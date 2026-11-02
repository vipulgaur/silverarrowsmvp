import type {
  AerodromeInfo,
  AircraftModel,
  AircraftRemark,
  AppData,
  BillingActivity,
  BookingConflict,
  CertificateType,
  CertificateWarning,
  CompetencyIndicator,
  CoreCompetency,
  CustomerAccount,
  ElectronicLogbookEntry,
  GradedCompetency,
  Invoice,
  LandingRecord,
  MasterExercise,
  PriceList,
  PriceListItem,
  ProgramPhase,
  ProgramRevision,
  SmsReport,
  SoloEndorsement,
  StageCheck,
  UserCertificate,
  UserExercise,
  UserLecture,
  UserProgram,
  WebAuthnCredential,
} from "./types";

export const DEFAULT_AIRCRAFT_MODELS: AircraftModel[] = [
  {
    id: "mdl-c172s",
    make: "Cessna",
    modelName: "172S Skyhawk SP (G1000 NXi)",
    classRating: "SEP_LAND",
    engineType: "PISTON_AVGAS",
    engineCount: 1,
    usableFuelLiters: 200,
    fuelBurnLph: 36,
    cruiseSpeedKnots: 122,
    maxTakeoffWeightKg: 1157,
    maxLandingWeightKg: 1157,
    emptyWeightKg: 762,
    emptyCgArmMm: 1016,
    frontSeatArmMm: 940,
    rearSeatArmMm: 1854,
    baggageArmMm: 2413,
    fuelArmMm: 1219,
    maxCrosswindKt: 15,
    todrBaselineMeters: 497,
    ldrBaselineMeters: 407,
    cgEnvelopePolygon: [
      { armMm: 889, weightKg: 700 },
      { armMm: 889, weightKg: 885 },
      { armMm: 1041, weightKg: 1157 },
      { armMm: 1201, weightKg: 1157 },
      { armMm: 1201, weightKg: 700 },
    ],
    hasRetractableGear: false,
    hasVariablePitchProp: false,
  },
  {
    id: "mdl-da40ng",
    make: "Diamond",
    modelName: "DA40 NG Tundra Star (Austro AE300)",
    classRating: "SEP_LAND",
    engineType: "DIESEL_JET_A1",
    engineCount: 1,
    usableFuelLiters: 147,
    fuelBurnLph: 24,
    cruiseSpeedKnots: 138,
    maxTakeoffWeightKg: 1310,
    maxLandingWeightKg: 1280,
    emptyWeightKg: 900,
    emptyCgArmMm: 2440,
    frontSeatArmMm: 2300,
    rearSeatArmMm: 3250,
    baggageArmMm: 3650,
    fuelArmMm: 2630,
    maxCrosswindKt: 20,
    todrBaselineMeters: 520,
    ldrBaselineMeters: 460,
    cgEnvelopePolygon: [
      { armMm: 2400, weightKg: 850 },
      { armMm: 2400, weightKg: 1080 },
      { armMm: 2460, weightKg: 1310 },
      { armMm: 2550, weightKg: 1310 },
      { armMm: 2550, weightKg: 850 },
    ],
    hasRetractableGear: false,
    hasVariablePitchProp: true,
  },
  {
    id: "mdl-da42vi",
    make: "Diamond",
    modelName: "DA42-VI Twin Star (MEP G1000 NXi)",
    classRating: "MEP_LAND",
    engineType: "DIESEL_JET_A1",
    engineCount: 2,
    usableFuelLiters: 289,
    fuelBurnLph: 44,
    cruiseSpeedKnots: 175,
    maxTakeoffWeightKg: 1999,
    maxLandingWeightKg: 1999,
    emptyWeightKg: 1410,
    emptyCgArmMm: 2410,
    frontSeatArmMm: 2300,
    rearSeatArmMm: 3250,
    baggageArmMm: 3890,
    fuelArmMm: 2630,
    maxCrosswindKt: 25,
    todrBaselineMeters: 540,
    ldrBaselineMeters: 560,
    cgEnvelopePolygon: [
      { armMm: 2350, weightKg: 1350 },
      { armMm: 2350, weightKg: 1650 },
      { armMm: 2420, weightKg: 1999 },
      { armMm: 2490, weightKg: 1999 },
      { armMm: 2490, weightKg: 1350 },
    ],
    hasRetractableGear: true,
    hasVariablePitchProp: true,
  },
  {
    id: "mdl-fnpt2",
    make: "Alsim",
    modelName: "ALX FNPT II / MCC Flight Simulator",
    classRating: "FNPT_II",
    engineType: "SIMULATOR",
    engineCount: 2,
    usableFuelLiters: 280,
    fuelBurnLph: 0,
    cruiseSpeedKnots: 160,
    maxTakeoffWeightKg: 1999,
    maxLandingWeightKg: 1999,
    emptyWeightKg: 1400,
    emptyCgArmMm: 2400,
    frontSeatArmMm: 2300,
    rearSeatArmMm: 3250,
    baggageArmMm: 3800,
    fuelArmMm: 2600,
    maxCrosswindKt: 30,
    todrBaselineMeters: 400,
    ldrBaselineMeters: 400,
    cgEnvelopePolygon: [
      { armMm: 2350, weightKg: 1350 },
      { armMm: 2490, weightKg: 1999 },
    ],
    hasRetractableGear: true,
    hasVariablePitchProp: true,
  },
];

export const DEFAULT_CORE_COMPETENCIES: CoreCompetency[] = [
  {
    id: "cbta-kno",
    code: "KNO",
    name: "Application of Knowledge",
    description:
      "Demonstrates practical and applicable knowledge of aircraft limitations, systems, SOPs, airspace, and aviation regulations.",
    minAcceptableScore: 2,
  },
  {
    id: "cbta-fpa",
    code: "FPA",
    name: "Flight Path Management — Automation",
    description:
      "Controls the aircraft flight path safely and accurately through appropriate use of flight management systems, autopilot, and avionics.",
    minAcceptableScore: 2,
  },
  {
    id: "cbta-fpo",
    code: "FPO",
    name: "Flight Path Management — Manual Control",
    description:
      "Controls the aircraft flight path safely through smooth, precise manual handling of pitch, bank, yaw, and thrust across all phases.",
    minAcceptableScore: 2,
  },
  {
    id: "cbta-com",
    code: "COM",
    name: "Communication",
    description:
      "Communicates clearly, accurately, and timely using standard ICAO/DGCA phraseology with ATC, instructors, and crew.",
    minAcceptableScore: 2,
  },
  {
    id: "cbta-wlm",
    code: "WLM",
    name: "Workload Management",
    description:
      "Maintains available workload capacity by prioritizing tasks, planning ahead, and managing time effectively under high cockpit load.",
    minAcceptableScore: 2,
  },
  {
    id: "cbta-saw",
    code: "SAW",
    name: "Situational Awareness & Information Mgmt",
    description:
      "Perceives, comprehends, and projects aircraft energy state, terrain, traffic, weather evolution, and fuel endurance.",
    minAcceptableScore: 2,
  },
  {
    id: "cbta-prb",
    code: "PRB",
    name: "Problem Solving & Decision Making",
    description:
      "Identifies precursors to threats/errors, evaluates options structuredly (FORDEC/GRADE), and executes timely safety-first decisions.",
    minAcceptableScore: 2,
  },
  {
    id: "cbta-lst",
    code: "LST",
    name: "Leadership, Teamwork & Self-Management",
    description:
      "Maintains professional cockpit discipline, receptiveness to instructor feedback, and composure during abnormal drills.",
    minAcceptableScore: 2,
  },
];

export const DEFAULT_COMPETENCY_INDICATORS: CompetencyIndicator[] = [
  {
    id: "obi-kno-1",
    competencyId: "cbta-kno",
    competencyCode: "KNO",
    indicatorCode: "KNO.1",
    description: "Correctly recalls V-speeds, memory items, and POH operating limitations.",
  },
  {
    id: "obi-kno-2",
    competencyId: "cbta-kno",
    competencyCode: "KNO",
    indicatorCode: "KNO.2",
    description: "Applies airspace rules, altimetry settings, and circuit procedures accurately.",
  },
  {
    id: "obi-fpa-1",
    competencyId: "cbta-fpa",
    competencyCode: "FPA",
    indicatorCode: "FPA.1",
    description: "Selects appropriate G1000 flight director / nav modes and verifies FMA annunciations.",
  },
  {
    id: "obi-fpo-1",
    competencyId: "cbta-fpo",
    competencyCode: "FPO",
    indicatorCode: "FPO.1",
    description: "Maintains altitude within +/- 100 ft, heading +/- 5 deg, and airspeed +/- 5 kt.",
  },
  {
    id: "obi-fpo-2",
    competencyId: "cbta-fpo",
    competencyCode: "FPO",
    indicatorCode: "FPO.2",
    description: "Detects and corrects deviations promptly with coordinated rudder and aileron inputs.",
  },
  {
    id: "obi-com-1",
    competencyId: "cbta-com",
    competencyCode: "COM",
    indicatorCode: "COM.1",
    description: "Executes accurate ATC readbacks for runway hold-short, QNH, and heading clearances.",
  },
  {
    id: "obi-wlm-1",
    competencyId: "cbta-wlm",
    competencyCode: "WLM",
    indicatorCode: "WLM.1",
    description: "Completes checklists without rushing and prioritizes Aviate-Navigate-Communicate.",
  },
  {
    id: "obi-saw-1",
    competencyId: "cbta-saw",
    competencyCode: "SAW",
    indicatorCode: "SAW.1",
    description: "Continuously monitors traffic, wind drift, and remaining usable fuel.",
  },
  {
    id: "obi-prb-1",
    competencyId: "cbta-prb",
    competencyCode: "PRB",
    indicatorCode: "PRB.1",
    description: "Initiates timely go-around when approach stability gates are not met by 300 ft AGL.",
  },
  {
    id: "obi-lst-1",
    competencyId: "cbta-lst",
    competencyCode: "LST",
    indicatorCode: "LST.1",
    description: "Demonstrates self-critique during debriefing and maintains emotional composure.",
  },
];

export const DEFAULT_MASTER_EXERCISES: MasterExercise[] = [
  {
    id: "ex-l1-a",
    lessonId: "l-1",
    code: "1.1.a",
    title: "Cockpit Familiarisation, Safety Briefing & External Walkaround",
    normTargetGrade: 3,
    isMandatory: true,
  },
  {
    id: "ex-l1-b",
    lessonId: "l-1",
    code: "1.1.b",
    title: "Primary Flight Controls — Pitch, Roll & Yaw Primary/Secondary Effects",
    normTargetGrade: 3,
    isMandatory: true,
  },
  {
    id: "ex-l2-a",
    lessonId: "l-2",
    code: "1.2.a",
    title: "Straight & Level Flight at Varying Power Settings & Trim Control",
    normTargetGrade: 4,
    isMandatory: true,
  },
  {
    id: "ex-l2-b",
    lessonId: "l-2",
    code: "1.2.b",
    title: "Coordinated Climbing & Descending Turns (Vy / Enroute Climb)",
    normTargetGrade: 3,
    isMandatory: true,
  },
  {
    id: "ex-l3-a",
    lessonId: "l-3",
    code: "2.1.a",
    title: "Slow Flight (MCA) & Stall Recognition / Power-On & Power-Off Recovery",
    normTargetGrade: 4,
    isMandatory: true,
  },
  {
    id: "ex-l3-b",
    lessonId: "l-3",
    code: "2.1.b",
    title: "Steep Turns (45° Bank) Maintaining Altitude +/- 100 ft",
    normTargetGrade: 4,
    isMandatory: true,
  },
  {
    id: "ex-l4-a",
    lessonId: "l-4",
    code: "3.1.a",
    title: "Visual Aerodrome Circuit Geometry, Crosswind Correction & Stabilised Final",
    normTargetGrade: 4,
    isMandatory: true,
  },
  {
    id: "ex-l4-b",
    lessonId: "l-4",
    code: "3.1.b",
    title: "Balked Landing (Go-Around) & Simulated Engine Failure After Takeoff (EFATO)",
    normTargetGrade: 4,
    isMandatory: true,
  },
  {
    id: "ex-l5-a",
    lessonId: "l-5",
    code: "4.1.a",
    title: "First Supervised Solo Circuit — Pre-Takeoff Checks, Traffic Scan & Full-Stop Landing",
    normTargetGrade: 4,
    isMandatory: true,
  },
  {
    id: "ex-l6-a",
    lessonId: "l-6",
    code: "5.1.a",
    title: "Overland Dead-Reckoning Navigation, Wind-Drift Correction & Waypoint Timing",
    normTargetGrade: 4,
    isMandatory: true,
  },
];

export const DEFAULT_PROGRAM_REVISIONS: ProgramRevision[] = [
  {
    id: "rev-ppl-v2",
    programId: "p-ppl",
    revisionNumber: "v2.4 (DGCA CAR Sec 7 / EASA Part-FCL)",
    effectiveDate: "2026-01-01",
    approvedByAuthorityRef: "DGCA-FTO-SA-2026-REV2",
    isCurrent: true,
  },
  {
    id: "rev-cpl-v1",
    programId: "p-cpl",
    revisionNumber: "v1.8 (Commercial IR / MEP CBTA)",
    effectiveDate: "2026-01-01",
    approvedByAuthorityRef: "DGCA-FTO-SA-CPL-2026",
    isCurrent: true,
  },
];

export const DEFAULT_PROGRAM_PHASES: ProgramPhase[] = [
  {
    id: "ph-ppl-1",
    programId: "p-ppl",
    revisionId: "rev-ppl-v2",
    name: "Phase 1 — General Airwork & Pre-Solo Handling",
    sequenceOrder: 1,
    requiresStageCheck: true,
  },
  {
    id: "ph-ppl-2",
    programId: "p-ppl",
    revisionId: "rev-ppl-v2",
    name: "Phase 2 — Aerodrome Circuits & Supervised Solo Consolidation",
    sequenceOrder: 2,
    requiresStageCheck: true,
  },
  {
    id: "ph-ppl-3",
    programId: "p-ppl",
    revisionId: "rev-ppl-v2",
    name: "Phase 3 — Cross-Country Navigation & Final Skill Test Prep",
    sequenceOrder: 3,
    requiresStageCheck: true,
  },
];

export const DEFAULT_CERTIFICATE_TYPES: CertificateType[] = [
  {
    id: "ct-med-1",
    name: "DGCA / EASA Class 1 Medical Assessment",
    category: "medical",
    warningDaysBefore: 45,
    blocksBooking: true,
    blocksSolo: true,
  },
  {
    id: "ct-med-2",
    name: "DGCA / EASA Class 2 Medical Assessment",
    category: "medical",
    warningDaysBefore: 45,
    blocksBooking: true,
    blocksSolo: true,
  },
  {
    id: "ct-spl",
    name: "Student Pilot Licence (SPL)",
    category: "license",
    warningDaysBefore: 60,
    blocksBooking: false,
    blocksSolo: true,
  },
  {
    id: "ct-frtol",
    name: "Flight Radio Telephone Operator's Licence (FRTOL / RTR)",
    category: "radio",
    warningDaysBefore: 60,
    blocksBooking: true,
    blocksSolo: true,
  },
  {
    id: "ct-elp",
    name: "ICAO English Language Proficiency (ELP Level 4-6)",
    category: "language_proficiency",
    warningDaysBefore: 90,
    blocksBooking: true,
    blocksSolo: true,
  },
  {
    id: "ct-fi",
    name: "Flight Instructor Rating (FI / CFI Authority)",
    category: "rating",
    warningDaysBefore: 60,
    blocksBooking: true,
    blocksSolo: false,
  },
];

export const DEFAULT_AERODROMES: AerodromeInfo[] = [
  {
    icao: "VIDP",
    name: "Indira Gandhi International / SilverArrows Base",
    city: "New Delhi",
    elevationFt: 777,
    runways: [
      { designator: "28R", headingDeg: 281, lengthMeters: 3810, surface: "ASPHALT" },
      { designator: "10L", headingDeg: 101, lengthMeters: 3810, surface: "ASPHALT" },
      { designator: "27", headingDeg: 272, lengthMeters: 2813, surface: "ASPHALT" },
      { designator: "09", headingDeg: 92, lengthMeters: 2813, surface: "ASPHALT" },
    ],
    activeRunway: "28R",
    towerFreqMhz: "118.100",
    atisFreqMhz: "126.400",
    landingFeeInr: 1500,
  },
  {
    icao: "VIJP",
    name: "Jaipur International Aerodrome (XC Destination)",
    city: "Jaipur",
    elevationFt: 1263,
    runways: [
      { designator: "27", headingDeg: 271, lengthMeters: 3407, surface: "ASPHALT" },
      { designator: "09", headingDeg: 91, lengthMeters: 3407, surface: "ASPHALT" },
    ],
    activeRunway: "27",
    towerFreqMhz: "118.650",
    atisFreqMhz: "126.600",
    landingFeeInr: 1200,
  },
  {
    icao: "VIAL",
    name: "Aligarh Flying Training Aerodrome (Training Sector)",
    city: "Aligarh",
    elevationFt: 605,
    runways: [
      { designator: "29", headingDeg: 290, lengthMeters: 1580, surface: "ASPHALT" },
      { designator: "11", headingDeg: 110, lengthMeters: 1580, surface: "ASPHALT" },
    ],
    activeRunway: "29",
    towerFreqMhz: "122.700",
    atisFreqMhz: "127.850",
    landingFeeInr: 850,
  },
];

export const DEFAULT_PRICE_LISTS: PriceList[] = [
  {
    id: "pl-std-2026",
    name: "SilverArrows Standard Cadet & Charter Tariff 2026 (INR + GST)",
    currency: "INR",
    isDefault: true,
    effectiveFrom: "2026-01-01",
  },
];

export const DEFAULT_PRICE_LIST_ITEMS: PriceListItem[] = [
  {
    id: "pli-c172-wet",
    priceListId: "pl-std-2026",
    itemType: "aircraft_wet",
    targetRefId: "mdl-c172s",
    title: "Cessna 172S Skyhawk SP — Wet Block Rate (incl. Avgas 100LL)",
    sacCode: "999293",
    unitPrice: 16500,
    gstRatePercent: 18,
  },
  {
    id: "pli-da40-wet",
    priceListId: "pl-std-2026",
    itemType: "aircraft_wet",
    targetRefId: "mdl-da40ng",
    title: "Diamond DA40 NG — Wet Block Rate (incl. Jet A-1)",
    sacCode: "999293",
    unitPrice: 18000,
    gstRatePercent: 18,
  },
  {
    id: "pli-da42-wet",
    priceListId: "pl-std-2026",
    itemType: "aircraft_wet",
    targetRefId: "mdl-da42vi",
    title: "Diamond DA42-VI Twin Star MEP — Wet Block Rate",
    sacCode: "999293",
    unitPrice: 32000,
    gstRatePercent: 18,
  },
  {
    id: "pli-cfi-hour",
    priceListId: "pl-std-2026",
    itemType: "instructor_hour",
    title: "Dual Flight Instruction & CBTA Debriefing Fee",
    sacCode: "999293",
    unitPrice: 3500,
    gstRatePercent: 18,
  },
  {
    id: "pli-landing",
    priceListId: "pl-std-2026",
    itemType: "landing_fee",
    title: "Aerodrome Touchdown / Circuit Landing Charge",
    sacCode: "996761",
    unitPrice: 1200,
    gstRatePercent: 18,
  },
];

export const DEFAULT_AIRCRAFT_REMARKS: AircraftRemark[] = [
  {
    id: "sq-1",
    aircraftId: "a-1",
    reportedBy: "u-cfi-1",
    reportedAt: "2026-10-25T14:20:00.000Z",
    severity: "info",
    status: "deferred_mel",
    description:
      "Right-hand passenger map reading light intermittent flicker during taxi; primary G1000 floodlighting 100% serviceable.",
    melReference: "MEL 33-10-02 Cat C",
    deferredUntilDate: "2026-11-25",
  },
  {
    id: "sq-2",
    aircraftId: "a-3",
    reportedBy: "u-cfi-2",
    reportedAt: "2026-10-27T09:15:00.000Z",
    severity: "grounding_defect",
    status: "open",
    description:
      "LH Engine ECU Channel B caution message illuminated during run-up check at 1900 RPM. Aircraft grounded pending CAMO inspection.",
    workOrderRef: "WO-CAMO-2026-118",
  },
];

export const DEFAULT_SMS_REPORTS: SmsReport[] = [
  {
    id: "sms-1",
    reportNumber: "SMS-2026-041",
    reportedBy: "u-cfi-1",
    aircraftId: "a-1",
    occurredAt: "2026-10-24T11:30:00.000Z",
    title: "Bird Activity Near RWY 28R Threshold During Late Final",
    category: "bird_strike",
    description:
      "Flock of black kites observed crossing 200 ft AGL near RWY 28R threshold. Go-around executed proactively at 350 ft AGL; ATC notified.",
    severity: 3,
    likelihood: "C",
    riskIndex: "3C",
    riskZone: "AMBER",
    isConfidential: false,
    rootCauseAnalysis:
      "Thermal updrafts over perimeter grass attracting raptors between 10:30 and 13:00 IST.",
    capaMitigationPlan:
      "Coordinated airport wildlife dispersal patrol 15 mins prior to morning training wave; mandatory briefing item added.",
    status: "mitigation_in_progress",
    investigatedBy: "u-admin",
  },
  {
    id: "sms-2",
    reportNumber: "SMS-2026-042",
    reportedBy: "u-stu-1",
    aircraftId: "a-2",
    occurredAt: "2026-10-26T15:10:00.000Z",
    title: "Unstabilised Approach Speed (+12 kt Above Vref) Resulting in Early Go-Around",
    category: "human_factors",
    description:
      "During gusty crosswind circuit training on RWY 27, approach airspeed remained 77 kt (target 65 kt) passing 300 ft AGL gate. Student initiated go-around.",
    severity: 2,
    likelihood: "B",
    riskIndex: "2B",
    riskZone: "GREEN",
    isConfidential: false,
    rootCauseAnalysis:
      "Late throttle reduction on base leg combined with task fixation on crosswind crab angle.",
    capaMitigationPlan:
      "Reinforced 500 ft and 300 ft stabilised approach callouts in Phase 2 circuit syllabus.",
    status: "closed",
    investigatedBy: "u-admin",
    closedAt: "2026-10-28T10:00:00.000Z",
  },
];

export function ensureReaCollections(data: AppData): AppData {
  // Map aircraft to default modelIds if missing
  const aircraft = data.aircraft.map((ac) => {
    if (ac.modelId) return ac;
    const t = ac.type.toLowerCase();
    const modelId = t.includes("da42")
      ? "mdl-da42vi"
      : t.includes("da40")
        ? "mdl-da40ng"
        : t.includes("sim") || t.includes("fnpt")
          ? "mdl-fnpt2"
          : "mdl-c172s";
    return {
      ...ac,
      modelId,
      homeBaseIcao: ac.homeBaseIcao ?? "VIDP",
      meterType: ac.meterType ?? "TACH_DECIMAL",
      hobbsHours: ac.hobbsHours ?? Math.round((ac.tachHours * 1.08) * 10) / 10,
      totalLandings: ac.totalLandings ?? Math.round(ac.totalHours * 2.2),
    };
  });

  // Synthesize initial UserPrograms for active students
  const students = data.users.filter((u) => u.role === "student" && u.status !== "deleted");
  const defaultUserPrograms: UserProgram[] = students.map((stu) => ({
    id: `up-${stu.id}`,
    studentId: stu.id,
    programId: stu.programId ?? "p-ppl",
    revisionId: stu.programId === "p-cpl" ? "rev-cpl-v1" : "rev-ppl-v2",
    primaryInstructorId: stu.instructorId ?? "u-cfi-1",
    enrolledAt: "2026-08-01T00:00:00.000Z",
    status: "active",
  }));

  // Synthesize initial CustomerAccounts for students & renters
  const defaultCustomers: CustomerAccount[] = students.map((stu, idx) => ({
    id: `cust-${stu.id}`,
    userId: stu.id,
    customerNumber: `SA-CUST-${String(1001 + idx)}`,
    billingName: stu.name,
    billingEmail: stu.email,
    billingAddress: `${stu.address ?? "Aerocity Aviation Enclave"}, ${stu.city ?? "New Delhi"}`,
    gstin: idx === 0 ? "07AABCS1429B1Z5" : undefined,
    stateCode: "07",
    currency: "INR",
    accountBalance: 245000 - idx * 35000,
    creditLimit: 50000,
    paymentTermsDays: 14,
    autoBlockWhenOverLimit: true,
  }));

  // Synthesize initial UserLectures, UserExercises & GradedCompetencies from existing verified flights
  const verifiedFlights = data.flights.filter((f) => (f.verificationStatus ?? "verified") === "verified");
  const defaultUserLectures: UserLecture[] = verifiedFlights.slice(0, 8).map((f, idx) => ({
    id: `ul-${f.id}`,
    userProgramId: `up-${f.pilotId}`,
    studentId: f.pilotId,
    lessonId: f.lessonId ?? "l-1",
    flightId: f.id,
    instructorId: f.instructorId ?? "u-cfi-1",
    attemptNumber: 1,
    status: (f.grade ?? 4) <= 2 ? "repeat_required" : "passed",
    overallGrade: Math.min(5, Math.max(1, f.grade ?? 4)) as 1 | 2 | 3 | 4 | 5,
    debriefRemarks:
      f.remarks ??
      "Good situational awareness and checklist discipline; continue refining crosswind flare timing.",
    instructorSignatureHash: `sha256:inst-${f.id}-${idx + 101}`,
    studentSignatureHash: `sha256:stu-${f.id}-${idx + 202}`,
    signedAt: `${f.date}T16:00:00.000Z`,
  }));

  const defaultGradedCompetencies: GradedCompetency[] = defaultUserLectures.flatMap((ul) =>
    DEFAULT_CORE_COMPETENCIES.map((comp, cIdx) => {
      const baseScore = ul.overallGrade;
      const variance = (cIdx + ul.flightId.charCodeAt(ul.flightId.length - 1)) % 3 === 0 ? 1 : 0;
      const score = Math.min(5, Math.max(3, baseScore + (cIdx % 2 === 0 ? variance : 0))) as
        | 1
        | 2
        | 3
        | 4
        | 5;
      return {
        id: `gc-${ul.id}-${comp.code}`,
        userLectureId: ul.id,
        flightId: ul.flightId,
        studentId: ul.studentId,
        competencyId: comp.id,
        competencyCode: comp.code,
        score,
        observedIndicators: DEFAULT_COMPETENCY_INDICATORS.filter(
          (i) => i.competencyCode === comp.code,
        )
          .slice(0, 1)
          .map((i) => i.indicatorCode),
        debriefComment: `Demonstrated ${comp.name} to grade ${score}/5 standard.`,
      };
    }),
  );

  const defaultUserExercises: UserExercise[] = defaultUserLectures.flatMap((ul) => {
    const lessonEx = DEFAULT_MASTER_EXERCISES.filter((ex) => ex.lessonId === ul.lessonId);
    const exList = lessonEx.length > 0 ? lessonEx : DEFAULT_MASTER_EXERCISES.slice(0, 2);
    return exList.map((ex) => ({
      id: `ue-${ul.id}-${ex.id}`,
      userLectureId: ul.id,
      flightId: ul.flightId,
      studentId: ul.studentId,
      exerciseId: ex.id,
      exerciseCode: ex.code,
      grade: ul.overallGrade,
      attemptCount: 1,
      instructorRemark: "Completed within EASA/DGCA CBTA norm tolerances.",
    }));
  });

  // Synthesize Dual Electronic Logbook Entries for verified flights
  const defaultLogbookEntries: ElectronicLogbookEntry[] = verifiedFlights
    .slice(0, 10)
    .flatMap((f) => {
      const ac = aircraft.find((a) => a.id === f.aircraftId);
      const mdl = DEFAULT_AIRCRAFT_MODELS.find((m) => m.id === ac?.modelId);
      const pilot = data.users.find((u) => u.id === f.pilotId);
      const cfi = data.users.find((u) => u.id === f.instructorId);
      const isMep = mdl?.classRating === "MEP_LAND";
      const isSim = mdl?.classRating === "FNPT_II" || f.kind === "sim";
      const nightMin = f.nightMinutes ?? 0;
      const dayMin = Math.max(0, f.minutes - nightMin);
      const nightLdg = f.nightLandings ?? 0;
      const dayLdg = Math.max(0, f.landings - nightLdg);

      const entries: ElectronicLogbookEntry[] = [
        {
          id: `elb-stu-${f.id}`,
          userId: f.pilotId,
          flightId: f.id,
          date: f.date,
          aircraftReg: ac?.reg ?? "VT-SAA",
          aircraftModel: mdl?.modelName ?? ac?.type ?? "C172S",
          classRating: mdl?.classRating ?? "SEP_LAND",
          departureIcao: f.fromIcao,
          arrivalIcao: f.toIcao,
          offBlock: f.offBlock,
          onBlock: f.onBlock,
          roleCapacity: f.kind === "solo" || f.kind === "pic" ? "PIC" : "DUAL_STUDENT",
          picName: f.kind === "solo" || f.kind === "pic" ? (pilot?.name ?? "Self") : (cfi?.name ?? "Instructor"),
          totalMinutes: f.minutes,
          seDayMinutes: !isMep && !isSim ? dayMin : 0,
          seNightMinutes: !isMep && !isSim ? nightMin : 0,
          meDayMinutes: isMep && !isSim ? dayMin : 0,
          meNightMinutes: isMep && !isSim ? nightMin : 0,
          ifrMinutes: f.ifrMinutes ?? 0,
          simMinutes: isSim ? f.minutes : 0,
          picMinutes: f.kind === "solo" || f.kind === "pic" ? f.minutes : 0,
          dualMinutes: f.kind === "dual" || !f.kind ? f.minutes : 0,
          instructorMinutes: 0,
          spicMinutes: f.spicMinutes ?? 0,
          picusMinutes: f.picusMinutes ?? 0,
          dayLandings: dayLdg,
          nightLandings: nightLdg,
          remarks: f.remarks,
          signatureHash: f.signatureHash ?? `sha256:elb-${f.id}-${f.pilotId}`,
          signedByName: cfi?.name ?? pilot?.name ?? "Verified Signatory",
          signedAt: f.verifiedAt ?? `${f.date}T16:30:00.000Z`,
          isLocked: true,
        },
      ];

      if (f.instructorId && cfi) {
        entries.push({
          id: `elb-cfi-${f.id}`,
          userId: f.instructorId,
          flightId: f.id,
          date: f.date,
          aircraftReg: ac?.reg ?? "VT-SAA",
          aircraftModel: mdl?.modelName ?? ac?.type ?? "C172S",
          classRating: mdl?.classRating ?? "SEP_LAND",
          departureIcao: f.fromIcao,
          arrivalIcao: f.toIcao,
          offBlock: f.offBlock,
          onBlock: f.onBlock,
          roleCapacity: isSim ? "SIM_INSTRUCTOR" : "INSTRUCTOR",
          picName: cfi.name,
          totalMinutes: f.minutes,
          seDayMinutes: !isMep && !isSim ? dayMin : 0,
          seNightMinutes: !isMep && !isSim ? nightMin : 0,
          meDayMinutes: isMep && !isSim ? dayMin : 0,
          meNightMinutes: isMep && !isSim ? nightMin : 0,
          ifrMinutes: f.ifrMinutes ?? 0,
          simMinutes: isSim ? f.minutes : 0,
          picMinutes: isSim ? 0 : f.minutes,
          dualMinutes: 0,
          instructorMinutes: f.minutes,
          spicMinutes: 0,
          picusMinutes: 0,
          dayLandings: dayLdg,
          nightLandings: nightLdg,
          remarks: `Dual instruction with ${pilot?.name ?? "Student"}: ${f.remarks ?? ""}`.trim(),
          signatureHash: f.signatureHash ?? `sha256:elb-${f.id}-${f.instructorId}`,
          signedByName: cfi.name,
          signedAt: f.verifiedAt ?? `${f.date}T16:30:00.000Z`,
          isLocked: true,
        });
      }

      return entries;
    });

  const defaultLandingsLog: LandingRecord[] = verifiedFlights.map((f) => {
    const ac = aircraft.find((a) => a.id === f.aircraftId);
    const mdl = DEFAULT_AIRCRAFT_MODELS.find((m) => m.id === ac?.modelId);
    const nightLdg = f.nightLandings ?? 0;
    const dayLdg = Math.max(0, f.landings - nightLdg);
    return {
      id: `ldg-${f.id}`,
      flightId: f.id,
      pilotId: f.pilotId,
      date: f.date,
      airportIcao: f.toIcao || "VIDP",
      classRating: mdl?.classRating ?? "SEP_LAND",
      dayFullStop: f.dayFullStop ?? Math.max(1, Math.min(dayLdg, 1)),
      dayTouchAndGo: f.dayTouchAndGo ?? Math.max(0, dayLdg - 1),
      nightFullStop: f.nightFullStop ?? nightLdg,
      nightTouchAndGo: f.nightTouchAndGo ?? 0,
      approachesIls: f.approachesIls ?? (f.ifrMinutes ? 1 : 0),
      approachesRnp: f.approachesRnp ?? 0,
      approachesVisual: f.approachesVisual ?? Math.max(1, dayLdg),
    };
  });

  // Default Billing Activities & Invoices
  const firstCustomer = defaultCustomers[0];
  const defaultBillingActivities: BillingActivity[] = firstCustomer
    ? [
        {
          id: "act-bill-1",
          customerId: firstCustomer.id,
          userId: firstCustomer.userId,
          flightId: verifiedFlights[0]?.id,
          date: verifiedFlights[0]?.date ?? "2026-10-25",
          itemType: "aircraft_wet",
          description: "Cessna 172S (VT-SAA) Wet Block Time — Lesson L-2 (1.5 hrs)",
          sacCode: "999293",
          quantity: 1.5,
          unit: "hours",
          unitPrice: 16500,
          subtotalAmount: 24750,
          gstRatePercent: 18,
          cgstAmount: 2227.5,
          sgstAmount: 2227.5,
          igstAmount: 0,
          totalAmount: 29205,
          status: "unbilled",
        },
        {
          id: "act-bill-2",
          customerId: firstCustomer.id,
          userId: firstCustomer.userId,
          flightId: verifiedFlights[0]?.id,
          date: verifiedFlights[0]?.date ?? "2026-10-25",
          itemType: "instructor_hour",
          description: "CFI Dual Instruction & CBTA Debriefing — Lesson L-2 (1.5 hrs)",
          sacCode: "999293",
          quantity: 1.5,
          unit: "hours",
          unitPrice: 3500,
          subtotalAmount: 5250,
          gstRatePercent: 18,
          cgstAmount: 472.5,
          sgstAmount: 472.5,
          igstAmount: 0,
          totalAmount: 6195,
          status: "unbilled",
        },
      ]
    : [];

  const defaultInvoices: Invoice[] = firstCustomer
    ? [
        {
          id: "inv-2026-001",
          invoiceNumber: "SA-INV-2026-001",
          customerId: firstCustomer.id,
          userId: firstCustomer.userId,
          issueDate: "2026-10-15",
          dueDate: "2026-10-29",
          currency: "INR",
          subtotalAmount: 36000,
          cgstTotal: 3240,
          sgstTotal: 3240,
          igstTotal: 0,
          taxTotal: 6480,
          grandTotal: 42480,
          status: "paid",
          stripePaymentIntentId: "pi_3QSilverArrows001",
          paidAt: "2026-10-16T11:20:00.000Z",
          items: [
            {
              id: "invi-1",
              description: "Phase 1 Dual Flight Training Package — Cessna 172S (2.0 hrs Wet + CFI)",
              sacCode: "999293",
              quantity: 2,
              unitPrice: 18000,
              subtotalAmount: 36000,
              cgstAmount: 3240,
              sgstAmount: 3240,
              igstAmount: 0,
              totalAmount: 42480,
            },
          ],
        },
      ]
    : [];

  const defaultSoloEndorsements: SoloEndorsement[] = students[0]
    ? [
        {
          id: "solo-end-1",
          studentId: students[0].id,
          instructorId: students[0].instructorId ?? "u-cfi-1",
          aircraftModelId: "mdl-c172s",
          aerodromeIcao: "VIDP",
          maxCrosswindKt: 10,
          maxWindKt: 18,
          minVisibilityMeters: 5000,
          issuedAt: "2026-10-30T08:00:00.000Z",
          expiresAt: "2026-11-15T08:00:00.000Z",
          signatureHash: "sha256:solo-endorsement-cfi-verified",
          notes: "Cleared for up to 5 solo circuits RWY 28R/10L in VMC.",
        },
      ]
    : [];

  const defaultStageChecks: StageCheck[] = students[0]
    ? [
        {
          id: "sc-1",
          studentId: students[0].id,
          programId: "p-ppl",
          phaseId: "ph-ppl-1",
          phaseName: "Phase 1 — General Airwork & Pre-Solo Handling",
          examinerId: "u-admin",
          scheduledAt: "2026-11-05T10:00:00.000Z",
          status: "pending",
          notes: "Pre-Solo Stage Check assessment requested by primary CFI.",
        },
      ]
    : [];

  const defaultWebauthn: WebAuthnCredential[] = [
    {
      id: "webauthn-1",
      userId: "u-admin",
      credentialId: "fido2-yubikey-5c-nfc-admin",
      publicKey: "COSE_KEY_EC2_P256_SHA256_8f94a2c1",
      signCount: 42,
      deviceName: "YubiKey 5C NFC — Chief Flight Instructor / Admin",
      createdAt: "2026-09-10T08:00:00.000Z",
      lastUsedAt: "2026-10-30T09:00:00.000Z",
    },
  ];

  const defaultUserCertificates: UserCertificate[] = data.users
    .filter((u) => u.status !== "deleted")
    .flatMap((u) => {
      const certs: UserCertificate[] = [];
      if (u.medicalExpiry) {
        certs.push({
          id: `uc-med-${u.id}`,
          userId: u.id,
          certificateTypeId: u.medicalClass === 1 ? "ct-med-1" : "ct-med-2",
          certificateNumber: u.egcaId ? `MED-${u.egcaId}` : `DGCA-MED-${u.id}`,
          issueDate: "2025-11-01",
          expiryDate: u.medicalExpiry,
          classOrLevel: `Class ${u.medicalClass ?? 2}`,
          fileStoragePath: `/vault/certificates/${u.id}/medical_class_${u.medicalClass ?? 2}.pdf`,
          verifiedBy: "u-admin",
          verifiedAt: "2026-01-15T10:00:00.000Z",
        });
      }
      if (u.frtolNumber || u.frtolExpiry) {
        certs.push({
          id: `uc-frtol-${u.id}`,
          userId: u.id,
          certificateTypeId: "ct-frtol",
          certificateNumber: u.frtolNumber ?? `FRTOL-${u.id}`,
          issueDate: "2025-06-01",
          expiryDate: u.frtolExpiry ?? "2028-06-01",
          fileStoragePath: `/vault/certificates/${u.id}/frtol_permit.pdf`,
          verifiedBy: "u-admin",
          verifiedAt: "2026-01-15T10:00:00.000Z",
        });
      }
      return certs;
    });

  const defaultCertificateWarnings: CertificateWarning[] = [];
  const defaultBookingConflicts: BookingConflict[] = [];

  return {
    ...data,
    aircraft,
    aircraftModels:
      data.aircraftModels && data.aircraftModels.length > 0
        ? data.aircraftModels
        : DEFAULT_AIRCRAFT_MODELS,
    aircraftRemarks:
      data.aircraftRemarks && data.aircraftRemarks.length > 0
        ? data.aircraftRemarks
        : DEFAULT_AIRCRAFT_REMARKS,
    certificateTypes:
      data.certificateTypes && data.certificateTypes.length > 0
        ? data.certificateTypes
        : DEFAULT_CERTIFICATE_TYPES,
    userCertificates:
      data.userCertificates && data.userCertificates.length > 0
        ? data.userCertificates
        : defaultUserCertificates,
    certificateWarnings:
      data.certificateWarnings && data.certificateWarnings.length > 0
        ? data.certificateWarnings
        : defaultCertificateWarnings,
    programRevisions:
      data.programRevisions && data.programRevisions.length > 0
        ? data.programRevisions
        : DEFAULT_PROGRAM_REVISIONS,
    programPhases:
      data.programPhases && data.programPhases.length > 0
        ? data.programPhases
        : DEFAULT_PROGRAM_PHASES,
    masterExercises:
      data.masterExercises && data.masterExercises.length > 0
        ? data.masterExercises
        : DEFAULT_MASTER_EXERCISES,
    coreCompetencies:
      data.coreCompetencies && data.coreCompetencies.length > 0
        ? data.coreCompetencies
        : DEFAULT_CORE_COMPETENCIES,
    competencyIndicators:
      data.competencyIndicators && data.competencyIndicators.length > 0
        ? data.competencyIndicators
        : DEFAULT_COMPETENCY_INDICATORS,
    userPrograms:
      data.userPrograms && data.userPrograms.length > 0
        ? data.userPrograms
        : defaultUserPrograms,
    userLectures:
      data.userLectures && data.userLectures.length > 0
        ? data.userLectures
        : defaultUserLectures,
    userExercises:
      data.userExercises && data.userExercises.length > 0
        ? data.userExercises
        : defaultUserExercises,
    gradedCompetencies:
      data.gradedCompetencies && data.gradedCompetencies.length > 0
        ? data.gradedCompetencies
        : defaultGradedCompetencies,
    bookingConflicts:
      data.bookingConflicts && data.bookingConflicts.length > 0
        ? data.bookingConflicts
        : defaultBookingConflicts,
    landingsLog:
      data.landingsLog && data.landingsLog.length > 0
        ? data.landingsLog
        : defaultLandingsLog,
    electronicLogbookEntries:
      data.electronicLogbookEntries && data.electronicLogbookEntries.length > 0
        ? data.electronicLogbookEntries
        : defaultLogbookEntries,
    customers:
      data.customers && data.customers.length > 0 ? data.customers : defaultCustomers,
    priceLists:
      data.priceLists && data.priceLists.length > 0
        ? data.priceLists
        : DEFAULT_PRICE_LISTS,
    priceListItems:
      data.priceListItems && data.priceListItems.length > 0
        ? data.priceListItems
        : DEFAULT_PRICE_LIST_ITEMS,
    billingActivities:
      data.billingActivities && data.billingActivities.length > 0
        ? data.billingActivities
        : defaultBillingActivities,
    invoices:
      data.invoices && data.invoices.length > 0 ? data.invoices : defaultInvoices,
    smsReports:
      data.smsReports && data.smsReports.length > 0
        ? data.smsReports
        : DEFAULT_SMS_REPORTS,
    soloEndorsements:
      data.soloEndorsements && data.soloEndorsements.length > 0
        ? data.soloEndorsements
        : defaultSoloEndorsements,
    stageChecks:
      data.stageChecks && data.stageChecks.length > 0
        ? data.stageChecks
        : defaultStageChecks,
    aerodromes:
      data.aerodromes && data.aerodromes.length > 0
        ? data.aerodromes
        : DEFAULT_AERODROMES,
    webauthnCredentials:
      data.webauthnCredentials && data.webauthnCredentials.length > 0
        ? data.webauthnCredentials
        : defaultWebauthn,
  };
}
