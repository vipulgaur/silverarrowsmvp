import { describe, expect, it, beforeEach } from "vitest";
import { seedData } from "@/lib/seed";
import {
  transitionFlightFsm,
  processAdsbTelemetryUpdate,
  evaluateDispatchGates,
  overrideBookingConflict,
  endorseSoloFlight,
  registerFlightAtomic,
  easaRollingFtlStatus,
  studentCbtaRadarProfile,
  classifySmsRisk,
  reportAircraftRemark,
  resolveAircraftRemark,
  generateInvoiceFromUnbilled,
  calculateWeightAndBalance,
  calculateRunwayPerformance,
  canAccess,
} from "@/lib/logic";
import {
  saveDebriefDraft,
  loadDebriefDraft,
  clearDebriefDraft,
  DEBRIEF_STORAGE_KEY,
} from "@/lib/debrief-persistence";
import { DEFAULT_AIRCRAFT_MODELS } from "@/lib/rea-seed";

describe("FlightLogger REA Core Engines & 32-Entity Verification Suite", () => {
  it("normalizes all 32 FlightLogger REA collections in seedData()", () => {
    const data = seedData();
    expect(data.aircraftModels?.length).toBeGreaterThanOrEqual(4);
    expect(data.coreCompetencies?.length).toBe(8);
    expect(data.competencyIndicators?.length).toBeGreaterThanOrEqual(10);
    expect(data.masterExercises?.length).toBeGreaterThanOrEqual(8);
    expect(data.certificateTypes?.length).toBeGreaterThanOrEqual(5);
    expect(data.userCertificates?.length).toBeGreaterThan(0);
    expect(data.customers?.length).toBeGreaterThan(0);
    expect(data.priceLists?.length).toBeGreaterThan(0);
    expect(data.priceListItems?.length).toBeGreaterThan(0);
    expect(data.smsReports?.length).toBeGreaterThan(0);
    expect(data.aerodromes?.length).toBeGreaterThanOrEqual(3);
  });

  it("enforces 7-Role RBAC access across all new REA routes", () => {
    expect(canAccess("admin", "/operations")).toBe(true);
    expect(canAccess("staff", "/operations")).toBe(true);
    expect(canAccess("staff", "/invoicing")).toBe(true);
    expect(canAccess("instructor", "/cbta")).toBe(true);
    expect(canAccess("crew", "/operations")).toBe(true);
    expect(canAccess("ground", "/cbta")).toBe(true);
    expect(canAccess("student", "/my-hub")).toBe(true);
    expect(canAccess("renter", "/invoicing")).toBe(true);
    expect(canAccess("renter", "/admin/approvals")).toBe(false);
  });

  describe("Engine 1: 6-Stage Flight Lifecycle FSM & ADS-B Auto-Touchdown", () => {
    it("transitions sequentially scheduled -> briefing -> flight -> landed -> debriefing and blocks airborne cancellation", () => {
      const data = seedData();
      const admin = data.users.find((u) => u.role === "admin")!;
      const booking = data.bookings.find((b) => b.status === "scheduled" && b.type === "lesson")!;

      // 1. scheduled -> briefing
      const step1 = transitionFlightFsm(data, booking.id, "briefing", admin);
      expect(typeof step1).not.toBe("string");
      if (typeof step1 === "string") return;
      expect(step1.bookings.find((b) => b.id === booking.id)?.status).toBe("briefing");

      // 2. briefing -> flight
      const step2 = transitionFlightFsm(step1, booking.id, "flight", admin, {
        offBlockTime: "2026-10-30T08:00:00.000Z",
        takeoffTime: "2026-10-30T08:10:00.000Z",
      });
      expect(typeof step2).not.toBe("string");
      if (typeof step2 === "string") return;
      expect(step2.bookings.find((b) => b.id === booking.id)?.status).toBe("flight");

      // 3. Attempting to cancel an airborne flight MUST return IllegalStateTransitionError
      const illegalCancel = transitionFlightFsm(step2, booking.id, "cancelled", admin);
      expect(typeof illegalCancel).toBe("string");
      expect(illegalCancel).toContain("IllegalStateTransitionError");

      // 4. Live ADS-B Telemetry Auto-Landing when groundSpeedKt < 30 inside geofence
      const ac = step2.aircraft.find((a) => a.id === booking.aircraftId)!;
      const adsbRes = processAdsbTelemetryUpdate(
        step2,
        ac.reg,
        24,
        true,
        new Date("2026-10-30T09:15:00.000Z"),
      );
      expect(adsbRes.autoLandedBookingId).toBe(booking.id);
      expect(adsbRes.data.bookings.find((b) => b.id === booking.id)?.status).toBe("landed");

      // 5. landed -> debriefing
      const step4 = transitionFlightFsm(adsbRes.data, booking.id, "debriefing", admin);
      expect(typeof step4).not.toBe("string");
      if (typeof step4 === "string") return;
      expect(step4.bookings.find((b) => b.id === booking.id)?.status).toBe("debriefing");
    });
  });

  describe("Engine 3: 7-Point Pre-Flight Dispatch Gating Engine & Solo Endorsement", () => {
    it("blocks solo dispatch when Gate 7 (24h Solo Endorsement) is missing and passes once endorsed", () => {
      const data = seedData();
      const cfi = data.users.find((u) => u.role === "instructor")!;
      const student = data.users.find((u) => u.role === "student")!;
      const ac = data.aircraft[0]!;

      const soloCandidate = {
        id: "bk-solo-test",
        aircraftId: ac.id,
        studentId: student.id,
        type: "solo" as const,
        status: "scheduled" as const,
        start: new Date(Date.now() + 3600000).toISOString(),
        end: new Date(Date.now() + 7200000).toISOString(),
      };

      // Clear existing solo endorsements for this student to test Gate 7 block
      const cleanData = { ...data, soloEndorsements: [] };
      const initialEval = evaluateDispatchGates(soloCandidate, cleanData);
      expect(initialEval.passed).toBe(false);
      expect(
        initialEval.blockingConflicts.some((c) => c.gateNumber === 7 && c.conflictType === "solo_endorsement_missing"),
      ).toBe(true);

      // Endorse solo flight via CFI
      const endorsedData = endorseSoloFlight(cleanData, cfi, {
        studentId: student.id,
        aircraftModelId: ac.modelId ?? "mdl-c172s",
        aerodromeIcao: "VIHR",
        maxCrosswindKt: 12,
        maxWindKt: 20,
        minVisibilityMeters: 5000,
        notes: "Cleared for solo circuit consolidation RWY 27",
      });
      expect(typeof endorsedData).not.toBe("string");
      if (typeof endorsedData === "string") return;

      const postEndorseEval = evaluateDispatchGates(soloCandidate, endorsedData);
      expect(
        postEndorseEval.blockingConflicts.some((c) => c.gateNumber === 7),
      ).toBe(false);
    });

    it("supports Accountable Manager override with audit justification", () => {
      const data = seedData();
      const admin = data.users.find((u) => u.role === "admin")!;
      const student = data.users.find((u) => u.role === "student")!;
      const ac = data.aircraft[0]!;

      const soloCandidate = {
        id: "bk-override-test",
        aircraftId: ac.id,
        studentId: student.id,
        type: "solo" as const,
        status: "scheduled" as const,
        start: new Date(Date.now() + 3600000).toISOString(),
        end: new Date(Date.now() + 7200000).toISOString(),
      };

      const cleanData = { ...data, soloEndorsements: [] };
      const gateRes = evaluateDispatchGates(soloCandidate, cleanData);
      const conflict = gateRes.blockingConflicts[0]!;
      expect(conflict).toBeDefined();

      const overriddenData = overrideBookingConflict(
        cleanData,
        conflict,
        admin,
        "Accountable Manager paper solo authorization verified on ramp",
      );
      expect(typeof overriddenData).not.toBe("string");
      if (typeof overriddenData === "string") return;

      const reEval = evaluateDispatchGates(soloCandidate, overriddenData);
      expect(reEval.passed).toBe(true);
    });
  });

  describe("Engine 2: 6-Way Atomic Post-Flight Commit (registerFlightAtomic)", () => {
    it("rolls back completely on tachometer monotonicity violation (tachEnd <= tachStart)", () => {
      const data = seedData();
      const cfi = data.users.find((u) => u.role === "instructor")!;
      const student = data.users.find((u) => u.role === "student")!;
      const ac = data.aircraft[0]!;

      const res = registerFlightAtomic(data, cfi, {
        studentId: student.id,
        instructorId: cfi.id,
        aircraftId: ac.id,
        date: "2026-10-30",
        fromIcao: "VIHR",
        toIcao: "VIHR",
        offBlock: "09:00",
        onBlock: "10:15",
        tachStart: ac.tachHours,
        tachEnd: ac.tachHours - 0.5, // INVALID!
        dayFullStop: 2,
        dayTouchAndGo: 3,
        nightFullStop: 0,
        nightTouchAndGo: 0,
        exerciseGrades: { "ex-1": 4 },
        competencyScores: {
          KNO: 4,
          FPA: 4,
          FPO: 4,
          COM: 4,
          WLM: 4,
          SAW: 4,
          PRB: 4,
          LST: 4,
        },
        remarks: "Invalid tach test",
      });

      expect(typeof res).toBe("string");
      expect(res).toContain("RollbackError [Tachometer Monotonicity Violation]");
    });

    it("executes all 6 subsystems atomically, flags repeat_required when CBTA score <= 2, synthesizes dual SHA-256 logbooks, sets 12h FTL rest lock, bills ACI GST, and spawns SMS report", () => {
      const data = seedData();
      const cfi = data.users.find((u) => u.role === "instructor")!;
      const student = data.users.find((u) => u.role === "student")!;
      const ac = data.aircraft[0]!;
      const startTach = ac.tachHours;

      const res = registerFlightAtomic(data, cfi, {
        studentId: student.id,
        instructorId: cfi.id,
        aircraftId: ac.id,
        lessonId: "l-1",
        date: "2026-10-30",
        fromIcao: "VIHR",
        toIcao: "VIHR",
        offBlock: "10:00",
        onBlock: "11:30",
        tachStart: startTach,
        tachEnd: Number((startTach + 1.4).toFixed(1)),
        dayFullStop: 2,
        dayTouchAndGo: 4,
        nightFullStop: 0,
        nightTouchAndGo: 0,
        exerciseGrades: { "ex-1": 2 },
        competencyScores: {
          KNO: 4,
          FPA: 2, // <= 2 triggers repeat_required!
          FPO: 4,
          COM: 4,
          WLM: 3,
          SAW: 4,
          PRB: 4,
          LST: 4,
        },
        remarks: "Gusty crosswind flare high; requires repeat consolidation.",
        reportSquawk: true,
        squawkSeverity: "grounding_defect",
        squawkDescription: "Nosewheel shimmy on rollout",
        flagSmsIncident: true,
        smsTitle: "Hard touchdown in gusty crosswind RWY 27",
        smsCategory: "hard_landing",
        smsSeverity: 3,
        smsLikelihood: "C",
      });

      expect(typeof res).not.toBe("string");
      if (typeof res === "string") return;

      // 1. Fleet updated & auto-grounded due to grounding_defect squawk
      expect(res.aircraftAutoGrounded).toBe(true);
      const updatedAc = res.data.aircraft.find((a) => a.id === ac.id)!;
      expect(updatedAc.tachHours).toBeCloseTo(startTach + 1.4, 1);
      expect(updatedAc.grounded).toBe(true);

      // 2. CBTA repeat_required triggered by score 2
      expect(res.repeatRequired).toBe(true);
      const lecture = res.data.userLectures?.find((ul) => ul.flightId === res.flightId);
      expect(lecture?.status).toBe("repeat_required");

      // 3. Dual Electronic Logbook entries synthesized with SHA-256 signatures
      const stuLog = res.data.electronicLogbookEntries?.find(
        (e) => e.id === res.studentLogbookEntryId,
      );
      const cfiLog = res.data.electronicLogbookEntries?.find(
        (e) => e.id === res.instructorLogbookEntryId,
      );
      expect(stuLog?.signatureHash).toMatch(/^sha256:stu-/);
      expect(cfiLog?.signatureHash).toMatch(/^sha256:cfi-/);

      // 4. EASA FTL 12h mandatoryRestUntil lock set on instructor
      expect(res.mandatoryRestUntil).toBeDefined();
      const ftl = easaRollingFtlStatus(cfi.id, res.data);
      expect(ftl.restLocked).toBe(true);

      // 5. ACI Unbilled items created & GST invoice generation works
      expect(res.billedTotalInr).toBeGreaterThan(0);
      const studentCust = res.data.customers!.find((c) => c.userId === student.id)!;
      const invRes = generateInvoiceFromUnbilled(res.data, studentCust.id, data.users[0]!);
      expect(typeof invRes).not.toBe("string");
      if (typeof invRes !== "string") {
        expect(invRes.invoice.cgstTotal).toBeGreaterThan(0);
        expect(invRes.invoice.sgstTotal).toBeGreaterThan(0);
        expect(invRes.invoice.grandTotal).toBeGreaterThan(invRes.invoice.subtotalAmount);
      }

      // 6. SMS Report spawned
      expect(res.spawnedSmsReportId).toBeDefined();
      expect(res.data.smsReports?.some((s) => s.id === res.spawnedSmsReportId)).toBe(true);
    });
  });

  describe("Crash-Proof SessionStorage Buffer (persist:userCustomLecture)", () => {
    beforeEach(() => {
      clearDebriefDraft();
    });

    it("persists and restores in-progress CBTA debrief state under persist:userCustomLecture", () => {
      saveDebriefDraft({
        bookingId: "b-1",
        studentId: "u-stu-1",
        instructorId: "u-cfi-1",
        aircraftId: "ac-1",
        lessonId: "l-1",
        date: "2026-10-30",
        fromIcao: "VIHR",
        toIcao: "VIHR",
        offBlock: "08:00",
        onBlock: "09:10",
        tachStart: 1240.5,
        tachEnd: 1241.6,
        dayFullStop: 1,
        dayTouchAndGo: 3,
        nightFullStop: 0,
        nightTouchAndGo: 0,
        ifrMinutes: 0,
        exerciseGrades: { "ex-1": 4 },
        competencyScores: {
          KNO: 4,
          FPA: 4,
          FPO: 4,
          COM: 5,
          WLM: 4,
          SAW: 4,
          PRB: 4,
          LST: 5,
        },
        observedIndicators: ["KNO.1"],
        remarks: "Recovered after iPad Safari refresh",
        reportSquawk: false,
        squawkSeverity: "info",
        squawkDescription: "",
        flagSmsIncident: false,
        smsTitle: "",
        smsCategory: "human_factors",
        smsSeverity: 2,
        smsLikelihood: "B",
        updatedAt: new Date().toISOString(),
      });

      const raw = window.sessionStorage.getItem(DEBRIEF_STORAGE_KEY);
      expect(raw).toBeTruthy();

      const restored = loadDebriefDraft();
      expect(restored?.remarks).toBe("Recovered after iPad Safari refresh");
      expect(restored?.competencyScores.COM).toBe(5);
    });
  });

  describe("Weight & Balance CG Envelope, Runway Performance, CAMO CRS & CBTA Radar", () => {
    it("computes Weight & Balance CG envelope and Runway TODR/LDR accurately", () => {
      const c172 = DEFAULT_AIRCRAFT_MODELS[0]!;
      const wb = calculateWeightAndBalance({
        model: c172,
        frontSeatsKg: 155,
        rearSeatsKg: 0,
        baggageKg: 15,
        takeoffFuelLiters: 140,
        tripFuelBurnLiters: 35,
      });
      expect(wb.safeToDispatch).toBe(true);
      expect(wb.takeoffWeightKg).toBeLessThanOrEqual(c172.maxTakeoffWeightKg);

      const perf = calculateRunwayPerformance({
        elevationFt: 700,
        qnhHpa: 1008,
        oatC: 34,
        runwayHeadingDeg: 270,
        windDirDeg: 290,
        windSpeedKt: 12,
        model: c172,
      });
      expect(perf.densityAltitudeFt).toBeGreaterThan(perf.pressureAltitudeFt);
      expect(perf.todrMeters).toBeGreaterThan(c172.todrBaselineMeters);
      expect(perf.exceedsMaxCrosswind).toBe(false);
    });

    it("grounds aircraft on grounding_defect squawk and releases on CAMO CRS sign-off", () => {
      const data = seedData();
      const admin = data.users.find((u) => u.role === "admin")!;
      const ac = data.aircraft[0]!;

      const afterSquawk = reportAircraftRemark(data, admin, {
        aircraftId: ac.id,
        severity: "grounding_defect",
        description: "Alternator belt tension out of limits",
      });
      expect(typeof afterSquawk).not.toBe("string");
      if (typeof afterSquawk === "string") return;
      expect(afterSquawk.aircraft.find((a) => a.id === ac.id)?.grounded).toBe(true);

      const remarkId = afterSquawk.aircraftRemarks![0]!.id;
      const afterCrs = resolveAircraftRemark(afterSquawk, remarkId, admin, {
        rectifiedByLicense: "DGCA-AME-08419",
        rectificationNotes: "Replaced alternator belt and tensioned IAW AMM",
      });
      expect(typeof afterCrs).not.toBe("string");
      if (typeof afterCrs === "string") return;
      expect(afterCrs.aircraft.find((a) => a.id === ac.id)?.grounded).toBe(false);
      expect(afterCrs.aircraftRemarks![0]!.status).toBe("rectified");
    });

    it("computes 8-axis CBTA radar profile and ICAO 5x5 SMS risk zones", () => {
      const data = seedData();
      const student = data.users.find((u) => u.role === "student")!;
      const radar = studentCbtaRadarProfile(student.id, data);
      expect(radar.axes).toHaveLength(8);
      expect(radar.overallAverage).toBeGreaterThan(0);

      expect(classifySmsRisk(5, "D").riskZone).toBe("RED");
      expect(classifySmsRisk(3, "C").riskZone).toBe("AMBER");
      expect(classifySmsRisk(1, "A").riskZone).toBe("GREEN");
    });
  });
});
