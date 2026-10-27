import { describe, expect, it } from "vitest";
import { seedData } from "@/lib/seed";
import {
  aircraftUnavailable,
  bookingProblem,
  can,
  canAccess,
  expiryState,
  homeFor,
  hoursBreakdown,
  maintenanceState,
  memberNotifications,
  prepareBooking,
  reviewBooking,
  reviewProfileRequest,
  studentDocumentsFor,
  studentProgress,
  submitProfileRequest,
  submitStudentFlightLog,
  theoryProgress,
  verifyFlightLog,
  visibleTo,
} from "@/lib/logic";
import { diffTables, fromTables, hasChanges, mergePending, toTables } from "@/lib/api/mapping";

describe("Core Business Rules & Logic (src/lib/logic.ts)", () => {
  it("enforces role permissions and route access across all portals", () => {
    expect(can.manageUsers("admin")).toBe(true);
    expect(can.manageUsers("student")).toBe(false);
    expect(can.logFlight("instructor")).toBe(true);
    expect(can.logFlight("student")).toBe(false);
    expect(can.manageLectures("ground")).toBe(true);
    expect(can.manageLectures("student")).toBe(false);

    expect(canAccess("admin", "/admin/audit")).toBe(true);
    expect(canAccess("student", "/admin/audit")).toBe(false);
    expect(canAccess("instructor", "/portal/cfi")).toBe(true);
    expect(canAccess("student", "/portal/cfi")).toBe(false);
    expect(homeFor.student).toBe("/portal/student");
    expect(homeFor.instructor).toBe("/portal/cfi");
    expect(homeFor.ground).toBe("/portal/ground");
    expect(homeFor.admin).toBe("/portal/admin");
  });

  it("filters bookings and flights by role in visibleTo", () => {
    const data = seedData();
    const admin = data.users.find((u) => u.id === "u-admin")!;
    const studentAna = data.users.find((u) => u.id === "u-ana")!;
    const studentArp = data.users.find((u) => u.id === "u-arp")!;

    expect(visibleTo(admin, data.bookings).length).toBe(data.bookings.length);
    const anaBookings = visibleTo(studentAna, data.bookings);
    expect(anaBookings.every((b) => b.studentId === "u-ana")).toBe(true);

    const arpFlights = visibleTo(studentArp, data.flights);
    expect(arpFlights.every((f) => f.pilotId === "u-arp")).toBe(true);
  });

  it("computes syllabus and theory progress accurately", () => {
    const data = seedData();
    const anaProg = studentProgress("u-ana", data);
    expect(anaProg.completed).toBeGreaterThan(0);
    expect(anaProg.total).toBe(10);
    expect(anaProg.minutes).toBeGreaterThan(0);

    const anaTheory = theoryProgress("u-ana", data);
    expect(anaTheory.passed).toBe(6);
    expect(anaTheory.total).toBe(9);
  });

  it("detects booking conflicts and enforces student approval workflow", () => {
    const data = seedData();
    const existing = data.bookings[0];
    const student = data.users.find((u) => u.id === "u-arp")!;
    const admin = data.users.find((u) => u.id === "u-admin")!;

    const conflicting = {
      ...existing,
      id: "BK-CONFLICT",
    };
    expect(bookingProblem(conflicting, data)).toBeTruthy();

    const validCandidate = {
      id: "BK-NEW",
      aircraftId: "a-2",
      studentId: student.id,
      instructorId: "u-vpl",
      lessonId: "l-4",
      type: "lesson" as const,
      status: "scheduled" as const,
      start: "2026-11-10T10:00:00.000Z",
      end: "2026-11-10T12:00:00.000Z",
    };

    const prepared = prepareBooking(validCandidate, student, data);
    expect(typeof prepared).not.toBe("string");
    if (typeof prepared !== "string") {
      expect(prepared.approvalStatus).toBe("pending");
      const withBooking = { ...data, bookings: [...data.bookings, prepared] };
      const reviewed = reviewBooking(withBooking, prepared.id, admin, "approved", "Cleared");
      expect(typeof reviewed).not.toBe("string");
      if (typeof reviewed !== "string") {
        expect(reviewed.approvalStatus).toBe("approved");
      }
    }
  });

  it("handles profile change requests and notifications including aviation IDs, licences, and exams", () => {
    const data = seedData();
    const student = data.users.find((u) => u.id === "u-ana")!;
    const admin = data.users.find((u) => u.id === "u-admin")!;

    const submitted = submitProfileRequest(data, student, student.id, {
      phone: "+45 99 88 77 66",
      computerNumber: "CN-2025-8899",
      egcaId: "EGCA-IND-401299",
      examTechnicalGeneral: true,
      examTechnicalSpecific: "Passed — C172S & DA42",
    });
    expect(typeof submitted).not.toBe("string");
    if (typeof submitted !== "string") {
      expect(submitted.profileRequests.length).toBe(1);
      const reqId = submitted.profileRequests[0].id;
      const adminNotifs = memberNotifications(submitted, admin);
      expect(adminNotifs.some((n) => n.id.includes(reqId))).toBe(true);

      const reviewed = reviewProfileRequest(submitted, reqId, admin, "approved");
      expect(typeof reviewed).not.toBe("string");
      if (typeof reviewed !== "string") {
        const updatedUser = reviewed.users.find((u) => u.id === student.id);
        expect(updatedUser?.phone).toBe("+45 99 88 77 66");
        expect(updatedUser?.computerNumber).toBe("CN-2025-8899");
        expect(updatedUser?.examTechnicalGeneral).toBe(true);
        expect(updatedUser?.examTechnicalSpecific).toBe("Passed — C172S & DA42");
      }
    }
  });

  it("computes flying experience breakdown and enforces student flight-log verification workflow", () => {
    const data = seedData();
    const student = data.users.find((u) => u.id === "u-ana")!;
    const instructor = data.users.find((u) => u.id === "u-vpl")!;

    const initialHrs = hoursBreakdown(student.id, data);
    expect(initialHrs.total).toBeGreaterThan(0);
    expect(initialHrs.dualDay).toBeGreaterThan(0);
    expect(initialHrs.dualNight).toBeGreaterThan(0);
    expect(initialHrs.soloDay).toBeGreaterThan(0);
    expect(initialHrs.soloNight).toBeGreaterThan(0);
    expect(initialHrs.crossCountry).toBeGreaterThan(0);
    expect(initialHrs.ifr).toBeGreaterThan(0);
    expect(initialHrs.multiEngine).toBe(0);
    expect(initialHrs.lastFlightDate).toBe("2026-10-13");

    // Prevent student from altering an already verified flight log
    const verifiedFlight = data.flights.find(
      (f) => f.pilotId === student.id && f.verificationStatus === "verified",
    )!;
    const blockedAttempt = submitStudentFlightLog(data, student, {
      ...verifiedFlight,
      minutes: 999,
    });
    expect(typeof blockedAttempt).toBe("string");

    // Student submits a new flight log entry (starts as pending verification)
    const afterSubmit = submitStudentFlightLog(data, student, {
      id: "FL-TEST-PEND",
      date: "2026-10-18",
      offBlock: "09:00",
      onBlock: "10:30",
      aircraftId: "a-3",
      pilotId: student.id,
      instructorId: instructor.id,
      kind: "dual",
      fromIcao: "EKAH",
      toIcao: "EKBI",
      tachStart: 882.7,
      tachEnd: 884.2,
      minutes: 90,
      dayMinutes: 60,
      nightMinutes: 30,
      xcMinutes: 90,
      ifrMinutes: 30,
      multiEngineMinutes: 90,
      landings: 2,
      remarks: "Student submitted dual XC multi-engine flight",
    });
    expect(typeof afterSubmit).not.toBe("string");
    if (typeof afterSubmit !== "string") {
      // Unverified flight must NOT change official verified totals yet
      const pendingHrs = hoursBreakdown(student.id, afterSubmit);
      expect(pendingHrs.total).toBe(initialHrs.total);
      expect(pendingHrs.pendingCount).toBe(initialHrs.pendingCount + 1);
      expect(pendingHrs.pendingMinutes).toBe(initialHrs.pendingMinutes + 90);

      // Instructor verifies the flight log
      const afterVerify = verifyFlightLog(
        afterSubmit,
        "FL-TEST-PEND",
        instructor,
        "verified",
        "Verified dual XC in DA42",
      );
      expect(typeof afterVerify).not.toBe("string");
      if (typeof afterVerify !== "string") {
        const verifiedHrs = hoursBreakdown(student.id, afterVerify);
        expect(verifiedHrs.total).toBe(initialHrs.total + 90);
        expect(verifiedHrs.dualDay).toBe(initialHrs.dualDay + 60);
        expect(verifiedHrs.dualNight).toBe(initialHrs.dualNight + 30);
        expect(verifiedHrs.crossCountry).toBe(initialHrs.crossCountry + 90);
        expect(verifiedHrs.ifr).toBe(initialHrs.ifr + 30);
        expect(verifiedHrs.multiEngine).toBe(initialHrs.multiEngine + 90);
        expect(verifiedHrs.lastFlightDate).toBe("2026-10-18");
      }
    }
  });

  it("aggregates student aviation documents and expiry states", () => {
    const data = seedData();
    const student = data.users.find((u) => u.id === "u-ana")!;
    const docs = studentDocumentsFor(student, data);
    expect(docs.some((d) => d.id.startsWith("doc-spl-"))).toBe(true);
    expect(docs.some((d) => d.id.startsWith("doc-frtol-"))).toBe(true);
    expect(docs.some((d) => d.id.startsWith("doc-rtr-"))).toBe(true);
    expect(docs.some((d) => d.category === "medical")).toBe(true);
  });

  it("round-trips AppData through database table mapping and reconciles diffs", () => {
    const data = seedData();
    const tenantId = "5a0e0000-0000-4000-8000-000000000001";
    const tables = toTables(data, tenantId);
    const roundTripped = fromTables(tables);

    expect(roundTripped.users.length).toBe(data.users.length);
    expect(roundTripped.aircraft.length).toBe(data.aircraft.length);
    expect(roundTripped.flights.length).toBe(data.flights.length);
    expect(roundTripped.bookings.length).toBe(data.bookings.length);

    const anaRoundTripped = roundTripped.users.find((u) => u.id === "u-ana");
    expect(anaRoundTripped?.computerNumber).toBe("CN-2026-08421");
    expect(anaRoundTripped?.splNumber).toBe("DK.SPL.90214");
    expect(anaRoundTripped?.examAirRegulation).toBe(true);

    // Mutate one aircraft's grounded state and verify diffTables + mergePending
    const modifiedData = {
      ...data,
      aircraft: data.aircraft.map((a) => (a.id === "a-1" ? { ...a, grounded: true } : a)),
    };
    const nextTables = toTables(modifiedData, tenantId);
    const diff = diffTables(tables, nextTables);
    expect(hasChanges(diff)).toBe(true);
    expect(diff.upserts.aircraft?.length).toBe(1);

    const merged = mergePending(tables, diff);
    const mergedAppData = fromTables(merged);
    expect(mergedAppData.aircraft.find((a) => a.id === "a-1")?.grounded).toBe(true);
  });

  it("evaluates maintenance and expiry states", () => {
    const data = seedData();
    const ac = data.aircraft[0];
    const maint = data.maintenance[0];
    expect(["ok", "soon", "overdue"]).toContain(maintenanceState(maint, ac));
    expect(aircraftUnavailable({ ...ac, grounded: true }, data.maintenance)).toBe(true);
    expect(expiryState("2020-01-01").state).toBe("expired");
  });
});
