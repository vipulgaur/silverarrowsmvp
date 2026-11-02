export type Role =
  | "admin"
  | "staff"
  | "instructor"
  | "crew"
  | "ground"
  | "student"
  | "renter";

export const roleLabel: Record<Role, string> = {
  admin: "Administrator",
  staff: "Operations Staff / Dispatcher",
  instructor: "Flight Instructor (CFI)",
  crew: "Commercial Flight Crew",
  ground: "Ground Instructor",
  student: "Student Pilot",
  renter: "Self-Hire Renter Pilot",
};

export type RescheduleReason =
  | "weather"
  | "medical"
  | "academic"
  | "personal"
  | "illness"
  | "aircraft"
  | "instructor"
  | "other"
  | "training"
  | "solo"
  | "checkride"
  | "maintenance"
  | "conflict";

export type BookingReason = RescheduleReason;
export type Reason = RescheduleReason;

export const reasonLabel: Record<RescheduleReason, string> = {
  weather: "Weather / Crosswind",
  medical: "Medical / Fitness",
  academic: "Academic / Exam Conflict",
  personal: "Personal / Work Conflict",
  illness: "Medical / Illness",
  aircraft: "Aircraft Technical / Maintenance",
  instructor: "Instructor Availability",
  other: "Other Operational Reason",
  training: "Dual Syllabus Training",
  solo: "Supervised Solo Consolidation",
  checkride: "Stage Check / Skill Test",
  maintenance: "Scheduled Maintenance",
  conflict: "Scheduling / Operational Conflict",
};

export type ClassRatingCode =
  | "SEP_LAND"
  | "MEP_LAND"
  | "TMG"
  | "SET"
  | "MET"
  | "FNPT_II";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  secondaryRoles?: Role[];
  status: "active" | "deleted";
  callsign?: string;
  phone?: string;
  photoUrl?: string;
  instructorId?: string;
  programId?: string;
  stage?: string;
  licence?: string;
  speciality?: string;
  medicalClass?: 1 | 2;
  medicalExpiry?: string;
  ratingExpiry?: string;
  sepExpiry?: string;
  mepExpiry?: string;
  irExpiry?: string;
  fiExpiry?: string;
  icaoLevel?: number;
  icaoExpiry?: string;
  classRatings?: ClassRatingCode[];
  endorsements?: ("RETRACTABLE_GEAR" | "VARIABLE_PITCH_PROP" | "NIGHT_RATING" | "TAILWHEEL" | "SOLO_VALID")[];
  priorMinutes?: number;
  address?: string;
  postCode?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  dob?: string;
  gender?: string;
  placeOfBirth?: string;
  userReference?: string;
  caaRef?: string;
  computerNumber?: string;
  egcaId?: string;
  fileNumber?: string;
  splNumber?: string;
  splExpiry?: string;
  frtolNumber?: string;
  frtolExpiry?: string;
  rtrNumber?: string;
  rtrExpiry?: string;
  examAirRegulation?: boolean;
  examMeteorology?: boolean;
  examAirNavigation?: boolean;
  examTechnicalGeneral?: boolean;
  examTechnicalSpecific?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
  publicNote?: string;
  adminNote?: string;
  instructorNote?: string;
  deletedBy?: string;
  deletedAt?: string;
  statusReason?: string;
  assignedCourseIds?: string[];
  twoFactorEnabled?: boolean;
}

export type ProfileField =
  | "name"
  | "email"
  | "phone"
  | "photoUrl"
  | "callsign"
  | "licence"
  | "speciality"
  | "medicalClass"
  | "medicalExpiry"
  | "ratingExpiry"
  | "icaoLevel"
  | "address"
  | "postCode"
  | "city"
  | "country"
  | "dateOfBirth"
  | "gender"
  | "placeOfBirth"
  | "userReference"
  | "caaRef"
  | "computerNumber"
  | "egcaId"
  | "fileNumber"
  | "splNumber"
  | "splExpiry"
  | "frtolNumber"
  | "frtolExpiry"
  | "rtrNumber"
  | "rtrExpiry"
  | "examAirRegulation"
  | "examMeteorology"
  | "examAirNavigation"
  | "examTechnicalGeneral"
  | "examTechnicalSpecific"
  | "emergencyName"
  | "emergencyPhone"
  | "emergencyRelation"
  | "publicNote"
  | "adminNote"
  | "instructorNote";

export type ProfileChanges = Partial<Pick<User, ProfileField>>;

export interface ProfileChangeRequest {
  id: string;
  userId: string;
  submittedBy: string;
  changes: ProfileChanges;
  before: ProfileChanges;
  status: "pending" | "approved" | "declined";
  createdAt: string;
  reviewerId?: string;
  reviewedAt?: string;
  notes?: string;
}

export type ProfileRequest = ProfileChangeRequest;

// ============================================================================
// FLIGHTLOGGER REA 32-ENTITY EXTENSIONS
// ============================================================================

/** Table 5: webauthn_credentials */
export interface WebAuthnCredential {
  id: string;
  userId: string;
  credentialId: string;
  publicKey: string;
  signCount: number;
  deviceName: string;
  createdAt: string;
  lastUsedAt?: string;
}

/** Table 6: aircraft_models */
export interface WeightBalancePoint {
  armMm: number;
  weightKg: number;
}

export interface AircraftModel {
  id: string;
  make: string;
  modelName: string;
  classRating: ClassRatingCode;
  engineType: "PISTON_AVGAS" | "DIESEL_JET_A1" | "TURBOPROP" | "ELECTRIC" | "SIMULATOR";
  engineCount: 1 | 2;
  usableFuelLiters: number;
  fuelBurnLph: number;
  cruiseSpeedKnots: number;
  maxTakeoffWeightKg: number;
  maxLandingWeightKg: number;
  emptyWeightKg: number;
  emptyCgArmMm: number;
  frontSeatArmMm: number;
  rearSeatArmMm: number;
  baggageArmMm: number;
  fuelArmMm: number;
  maxCrosswindKt: number;
  todrBaselineMeters: number;
  ldrBaselineMeters: number;
  cgEnvelopePolygon: WeightBalancePoint[];
  hasRetractableGear: boolean;
  hasVariablePitchProp: boolean;
}

/** Table 7: aircraft */
export interface Aircraft {
  id: string;
  reg: string;
  type: string;
  modelId?: string;
  serialNumber?: string;
  homeBaseIcao?: string;
  meterType?: "HOBBS_DECIMAL" | "TACH_DECIMAL" | "FLIGHT_TIME_MINUTES";
  hourlyRate: number;
  totalHours: number;
  tachHours: number;
  hobbsHours?: number;
  totalLandings?: number;
  lastService?: string;
  grounded: boolean;
  status?: "available" | "airworthy" | "maintenance" | "maintenance_due" | "grounded";
}

/** Table 8: maintenance_requirements / maintenance_items */
export interface MaintenanceItem {
  id: string;
  aircraftId: string;
  title: string;
  dueHours?: number;
  intervalHours?: number;
  intervalDays?: number;
  intervalLandings?: number;
  warningHoursThreshold?: number;
  warningDaysThreshold?: number;
  dueDate?: string;
  nextDueLandings?: number;
  isCriticalGrounding?: boolean;
  completedAt?: string;
  completedByCamoRef?: string;
  workOrderRef?: string;
  notes?: string;
}

/** Table 9: aircraft_remarks (Pilot Squawk Sheet & CAMO CRS) */
export interface AircraftRemark {
  id: string;
  aircraftId: string;
  reportedBy: string;
  flightId?: string;
  reportedAt: string;
  severity: "info" | "warning" | "grounding_defect";
  status: "open" | "deferred_mel" | "rectified";
  description: string;
  melReference?: string;
  deferredUntilDate?: string;
  rectifiedBy?: string;
  rectifiedByLicense?: string;
  rectificationNotes?: string;
  workOrderRef?: string;
  rectifiedAt?: string;
}

/** Table 10: certificate_types */
export interface CertificateType {
  id: string;
  name: string;
  category:
    | "medical"
    | "license"
    | "rating"
    | "radio"
    | "language_proficiency"
    | "passport"
    | "company_check";
  warningDaysBefore: number;
  blocksBooking: boolean;
  blocksSolo: boolean;
}

/** Table 11: user_certificates */
export interface UserCertificate {
  id: string;
  userId: string;
  certificateTypeId: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate?: string;
  classOrLevel?: string;
  endorsements?: string[];
  fileStoragePath?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

/** Table 12: certificate_warnings */
export interface CertificateWarning {
  id: string;
  userId: string;
  userCertificateId?: string;
  warningCode: string;
  severity: "expiring_soon" | "expired" | "missing_mandatory";
  blocksDispatch: boolean;
  blocksSolo: boolean;
  generatedAt: string;
}

/** Table 14: program_revisions */
export interface ProgramRevision {
  id: string;
  programId: string;
  revisionNumber: string;
  effectiveDate: string;
  approvedByAuthorityRef: string;
  isCurrent: boolean;
}

/** Table 15: program_phases */
export interface ProgramPhase {
  id: string;
  programId: string;
  revisionId: string;
  name: string;
  sequenceOrder: number;
  requiresStageCheck: boolean;
}

export interface Lesson {
  id: string;
  code?: string;
  phaseId?: string;
  name: string;
  kind: "flight" | "ground" | "dual" | "solo" | "sim";
  minutes: number;
  briefingMinutes?: number;
  debriefingMinutes?: number;
  minGradeToPass?: number;
  description?: string;
}

export interface Program {
  id: string;
  code?: string;
  name: string;
  category?: "PPL" | "CPL" | "IR" | "ME" | "ATPL_INTEGRATED" | "TYPE_RATING" | "FI";
  authority?: "DGCA" | "EASA" | "FAA" | "ICAO";
  minTotalHours?: number;
  minDualHours?: number;
  minSoloHours?: number;
  minPicXcHours?: number;
  minInstrumentHours?: number;
  lessons: Lesson[];
}

/** Table 17: master_exercises */
export interface MasterExercise {
  id: string;
  lessonId: string;
  code: string;
  title: string;
  normTargetGrade: 1 | 2 | 3 | 4 | 5;
  isMandatory: boolean;
}

/** Table 18: core_competencies (8 ICAO Doc 9995 / EASA CBTA Dimensions) */
export type CbtaCompetencyCode =
  | "KNO"
  | "FPA"
  | "FPO"
  | "COM"
  | "WLM"
  | "SAW"
  | "PRB"
  | "LST";

export interface CoreCompetency {
  id: string;
  code: CbtaCompetencyCode;
  name: string;
  description: string;
  minAcceptableScore: 1 | 2 | 3 | 4 | 5;
}

/** Table 19: competency_indicators (Observable Behavioral Indicators - OBIs) */
export interface CompetencyIndicator {
  id: string;
  competencyId: string;
  competencyCode: CbtaCompetencyCode;
  indicatorCode: string;
  description: string;
}

/** Table 20: user_programs */
export interface UserProgram {
  id: string;
  studentId: string;
  programId: string;
  revisionId: string;
  primaryInstructorId?: string;
  enrolledAt: string;
  completedAt?: string;
  status: "active" | "on_hold" | "completed" | "withdrawn";
}

/** Table 21: user_lectures (Flight Folder per Syllabus Lesson Attempt) */
export interface UserLecture {
  id: string;
  userProgramId?: string;
  studentId: string;
  lessonId: string;
  flightId: string;
  instructorId: string;
  attemptNumber: number;
  status: "planned" | "in_progress" | "passed" | "repeat_required";
  overallGrade: 1 | 2 | 3 | 4 | 5;
  debriefRemarks?: string;
  instructorSignatureHash: string;
  studentSignatureHash: string;
  signedAt: string;
}

/** Table 22: user_exercises (Per-Maneuver 1-5 Grade) */
export interface UserExercise {
  id: string;
  userLectureId: string;
  flightId: string;
  studentId: string;
  exerciseId: string;
  exerciseCode: string;
  grade: 1 | 2 | 3 | 4 | 5;
  attemptCount: number;
  instructorRemark?: string;
}

/** Table 23: graded_competencies (Per-Flight 1-5 CBTA Score) */
export interface GradedCompetency {
  id: string;
  userLectureId: string;
  flightId: string;
  studentId: string;
  competencyId: string;
  competencyCode: CbtaCompetencyCode;
  score: 1 | 2 | 3 | 4 | 5;
  observedIndicators: string[];
  debriefComment?: string;
}

export type BookingType =
  | "lesson"
  | "solo"
  | "maintenance"
  | "dual_training"
  | "solo_training"
  | "stage_check"
  | "skill_test"
  | "rental"
  | "charter"
  | "ground_school";

/** 6-Stage Flight Lifecycle Finite State Machine (FSM) */
export type FlightFsmState =
  | "scheduled"
  | "briefing"
  | "flight"
  | "landed"
  | "debriefing"
  | "completed"
  | "cancelled";

export interface Booking {
  id: string;
  aircraftId?: string;
  studentId?: string;
  instructorId?: string;
  lessonId?: string;
  roomId?: string;
  type: BookingType;
  status: FlightFsmState;
  start: string;
  end: string;
  briefingStartTime?: string;
  offBlockTime?: string;
  takeoffTime?: string;
  landingTime?: string;
  onBlockTime?: string;
  debriefingEndTime?: string;
  departureIcao?: string;
  arrivalIcao?: string;
  alternateIcao?: string;
  standBay?: string;
  route?: string;
  notes?: string;
  reason?: BookingReason;
  approvalStatus?: "pending" | "approved" | "declined";
  requestedBy?: string;
  requestedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  decisionNotes?: string;
  createdAt?: string;
  weatherCurrent?: FlightWeatherAttachment;
  weatherForecast?: FlightWeatherAttachment;
  weatherCompleted?: FlightWeatherAttachment;
}

/** Table 25: booking_conflicts */
export type BookingConflictType =
  | "aircraft_overlap"
  | "instructor_overlap"
  | "student_overlap"
  | "maintenance_overdue"
  | "maintenance_flight_overrun"
  | "certificate_expired"
  | "currency_90_day_lapsed"
  | "class_rating_missing"
  | "ftl_rest_violation"
  | "ftl_rolling_limit_exceeded"
  | "solo_endorsement_missing"
  | "weather_minima";

export interface BookingConflict {
  id: string;
  bookingId: string;
  gateNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  conflictType: BookingConflictType;
  severity: "blocking" | "warning";
  message: string;
  overriddenBy?: string;
  overrideReason?: string;
  overriddenAt?: string;
  resolved?: boolean;
  detectedAt: string;
}

export interface Flight {
  id: string;
  bookingId?: string;
  date: string;
  offBlock: string;
  takeoffTime?: string;
  landingTime?: string;
  onBlock: string;
  airborneMinutes?: number;
  aircraftId: string;
  pilotId: string;
  instructorId?: string;
  lessonId?: string;
  kind?: "dual" | "solo" | "pic" | "sim" | "spic" | "picus";
  minutes: number;
  dayMinutes?: number;
  nightMinutes?: number;
  xcMinutes?: number;
  multiEngineMinutes?: number;
  ifrMinutes?: number;
  spicMinutes?: number;
  picusMinutes?: number;
  vfrMinutes?: number;
  simMinutes?: number;
  landings: number;
  dayTouchAndGo?: number;
  dayFullStop?: number;
  nightTouchAndGo?: number;
  nightFullStop?: number;
  nightLandings?: number;
  approachesIls?: number;
  approachesRnp?: number;
  approachesVisual?: number;
  fromIcao: string;
  toIcao: string;
  tachStart?: number;
  tachEnd?: number;
  hobbsStart?: number;
  hobbsEnd?: number;
  fuelStartLiters?: number;
  fuelAddedLiters?: number;
  fuelStopLiters?: number;
  oilAddedQuarts?: number;
  grade?: number;
  repeatRequired?: boolean;
  remarks?: string;
  route?: string;
  reason?: BookingReason;
  instructorSignedAt?: string;
  studentSignedAt?: string;
  signatureHash?: string;
  verificationStatus?: "verified" | "pending" | "rejected";
  submittedBy?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  weatherReport?: FlightWeatherAttachment;
}

/** Table 27: landings */
export interface LandingRecord {
  id: string;
  flightId: string;
  pilotId: string;
  date: string;
  airportIcao: string;
  classRating: ClassRatingCode;
  dayFullStop: number;
  dayTouchAndGo: number;
  nightFullStop: number;
  nightTouchAndGo: number;
  approachesIls: number;
  approachesRnp: number;
  approachesVisual: number;
}

/** Table 28: electronic_logbook_entries */
export type LogbookRoleCapacity =
  | "PIC"
  | "DUAL_STUDENT"
  | "INSTRUCTOR"
  | "SPIC"
  | "PICUS"
  | "SIM_INSTRUCTOR";

export interface ElectronicLogbookEntry {
  id: string;
  userId: string;
  flightId: string;
  date: string;
  aircraftReg: string;
  aircraftModel: string;
  classRating: ClassRatingCode;
  departureIcao: string;
  arrivalIcao: string;
  offBlock: string;
  onBlock: string;
  roleCapacity: LogbookRoleCapacity;
  picName: string;
  totalMinutes: number;
  seDayMinutes: number;
  seNightMinutes: number;
  meDayMinutes: number;
  meNightMinutes: number;
  ifrMinutes: number;
  simMinutes: number;
  picMinutes: number;
  dualMinutes: number;
  instructorMinutes: number;
  spicMinutes: number;
  picusMinutes: number;
  dayLandings: number;
  nightLandings: number;
  remarks?: string;
  signatureHash: string;
  signedByName: string;
  signedAt: string;
  isLocked: boolean;
}

/** Tables 30-32: Automated Customer Invoicing (ACI) & Indian GST Ledger */
export interface CustomerAccount {
  id: string;
  userId: string;
  customerNumber: string;
  billingName: string;
  billingEmail: string;
  billingAddress: string;
  gstin?: string;
  stateCode: string;
  currency: "INR" | "EUR" | "USD";
  accountBalance: number;
  creditLimit: number;
  paymentTermsDays: number;
  autoBlockWhenOverLimit: boolean;
}

export interface PriceList {
  id: string;
  name: string;
  currency: "INR" | "EUR" | "USD";
  isDefault: boolean;
  effectiveFrom: string;
}

export interface PriceListItem {
  id: string;
  priceListId: string;
  itemType: "aircraft_wet" | "aircraft_dry" | "instructor_hour" | "briefing_hour" | "landing_fee" | "simulator_hour" | "exam_fee";
  targetRefId?: string;
  title: string;
  sacCode: string;
  unitPrice: number;
  gstRatePercent: number;
}

export interface BillingActivity {
  id: string;
  customerId: string;
  userId: string;
  flightId?: string;
  date: string;
  itemType: PriceListItem["itemType"];
  description: string;
  sacCode: string;
  quantity: number;
  unit: "hours" | "landings" | "session";
  unitPrice: number;
  subtotalAmount: number;
  gstRatePercent: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalAmount: number;
  status: "unbilled" | "invoiced" | "waived";
  invoiceId?: string;
}

export interface InvoiceItem {
  id: string;
  activityId?: string;
  description: string;
  sacCode: string;
  quantity: number;
  unitPrice: number;
  subtotalAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalAmount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  userId: string;
  issueDate: string;
  dueDate: string;
  currency: "INR" | "EUR" | "USD";
  subtotalAmount: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  taxTotal: number;
  grandTotal: number;
  status: "draft" | "issued" | "paid" | "overdue" | "void";
  stripePaymentIntentId?: string;
  paidAt?: string;
  items: InvoiceItem[];
}

/** Safety Management System (SMS) - ICAO Doc 9859 */
export type SmsLikelihood = "A" | "B" | "C" | "D" | "E";
export type SmsSeverity = 1 | 2 | 3 | 4 | 5;
export type SmsRiskZone = "RED" | "AMBER" | "GREEN";

export interface SmsReport {
  id: string;
  reportNumber: string;
  reportedBy: string;
  flightId?: string;
  aircraftId?: string;
  occurredAt: string;
  title: string;
  category:
    | "airspace_infringement"
    | "runway_incursion"
    | "hard_landing"
    | "technical_failure"
    | "bird_strike"
    | "weather_deviation"
    | "human_factors"
    | "other";
  description: string;
  severity: SmsSeverity;
  likelihood: SmsLikelihood;
  riskIndex: string;
  riskZone: SmsRiskZone;
  isConfidential: boolean;
  rootCauseAnalysis?: string;
  capaMitigationPlan?: string;
  status: "submitted" | "under_investigation" | "mitigation_in_progress" | "closed";
  investigatedBy?: string;
  closedAt?: string;
}

/** Gate 7: Student Solo Endorsement (24h validity) */
export interface SoloEndorsement {
  id: string;
  studentId: string;
  instructorId: string;
  aircraftModelId: string;
  aerodromeIcao: string;
  maxCrosswindKt: number;
  maxWindKt: number;
  minVisibilityMeters: number;
  issuedAt: string;
  expiresAt: string;
  signatureHash: string;
  notes?: string;
}

/** Stage Check Sign-Off Queue */
export interface StageCheck {
  id: string;
  studentId: string;
  programId: string;
  phaseId: string;
  phaseName: string;
  examinerId: string;
  scheduledAt: string;
  completedAt?: string;
  status: "pending" | "passed" | "recheck_required";
  notes?: string;
}

/** Aerodrome & Active Runway Config */
export interface AerodromeInfo {
  icao: string;
  name: string;
  city: string;
  elevationFt: number;
  runways: {
    designator: string;
    headingDeg: number;
    lengthMeters: number;
    surface: "ASPHALT" | "CONCRETE" | "GRASS";
  }[];
  activeRunway: string;
  towerFreqMhz: string;
  atisFreqMhz: string;
  landingFeeInr: number;
}

export type FlightRulesCategory = "VFR" | "MVFR" | "IFR" | "LIFR";

export interface FlightWeatherAttachment {
  icao: string;
  stationName?: string;
  city?: string;
  lat?: number;
  lon?: number;
  flightCategory: FlightRulesCategory;
  metar: string;
  taf: string;
  windDir: number;
  windSpeedKt: number;
  windGustKt?: number;
  visibilityMeters: number;
  tempC: number;
  dewpointC: number;
  humidityPct?: number;
  precipMm?: number;
  qnhHpa: number;
  cloudCeilingFt?: number;
  cloudCoverPct?: number;
  cloudCoverage?: "SKC" | "FEW" | "SCT" | "BKN" | "OVC";
  wxPhenomena?: string;
  wmoCode?: number;
  isDay?: boolean;
  istTimestamp?: string;
  fetchedAt: string;
}

export interface StudentDocument {
  id: string;
  studentId: string;
  title: string;
  category: "licence" | "medical" | "radio" | "identification" | "endorsement" | "other";
  documentNumber: string;
  issuedAt?: string;
  expiryDate?: string;
  verified: boolean;
  verifiedBy?: string;
  notes?: string;
}

export interface LessonCompletion {
  id: string;
  studentId: string;
  lessonId: string;
  date: string;
  instructorId?: string;
  grade?: number;
  flightId?: string;
}

export type Completion = LessonCompletion;

export interface RescheduleRequest {
  id: string;
  bookingId: string;
  studentId: string;
  instructorId?: string;
  reason: RescheduleReason;
  details: string;
  proposedStart: string;
  proposedEnd: string;
  status: "pending" | "approved" | "declined";
  reviewerId?: string;
  reviewedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface TheorySubject {
  id: string;
  code: string;
  name: string;
}

export interface Classroom {
  id: string;
  name: string;
  capacity: number;
}

export interface Lecture {
  id: string;
  subjectId: string;
  title: string;
  start: string;
  end: string;
  roomId: string;
  instructorId: string;
  enrolled: string[];
  attended: string[];
  signedOff: boolean;
}

export interface ExamResult {
  id: string;
  studentId: string;
  subjectId: string;
  score: number;
  passed: boolean;
  signedBy: string;
  date: string;
}

export interface DutyLog {
  id: string;
  instructorId: string;
  start: string;
  end?: string;
  dutyType?: "flight_duty" | "ground_instruction" | "simulator_instruction" | "office_admin" | "standby_reserve";
  splitDutyBreakMinutes?: number;
  fdpHours?: number;
  maxAllowedFdpHours?: number;
  mandatoryRestUntil?: string;
}

export type DutyRecord = DutyLog;

export interface ActivityLog {
  id: string;
  at: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  action: string;
  entityType:
    | "user"
    | "aircraft"
    | "booking"
    | "flight"
    | "lesson"
    | "lecture"
    | "exam"
    | "duty"
    | "maintenance"
    | "invoice"
    | "sms"
    | "cbta";
  entityId?: string;
  details: string;
}

export interface LearningRecord {
  id?: string;
  userId?: string;
  memberId?: string;
  chapterId: string;
  completed: boolean;
  bookmarked: boolean;
  notes: string;
  answers?: Record<string, unknown>;
  updatedAt?: string;
}

export interface AppData {
  users: User[];
  aircraft: Aircraft[];
  maintenance: MaintenanceItem[];
  programs: Program[];
  bookings: Booking[];
  flights: Flight[];
  completions: LessonCompletion[];
  requests: RescheduleRequest[];
  subjects: TheorySubject[];
  classrooms: Classroom[];
  lectures: Lecture[];
  exams: ExamResult[];
  duty: DutyLog[];
  activity: ActivityLog[];
  profileRequests: ProfileChangeRequest[];
  readNotificationIds: Record<string, string[]>;
  learningRecords: LearningRecord[];
  documents?: StudentDocument[];

  // FlightLogger REA 32-Entity Collections (Normalized automatically on load)
  webauthnCredentials?: WebAuthnCredential[];
  aircraftModels?: AircraftModel[];
  aircraftRemarks?: AircraftRemark[];
  certificateTypes?: CertificateType[];
  userCertificates?: UserCertificate[];
  certificateWarnings?: CertificateWarning[];
  programRevisions?: ProgramRevision[];
  programPhases?: ProgramPhase[];
  masterExercises?: MasterExercise[];
  coreCompetencies?: CoreCompetency[];
  competencyIndicators?: CompetencyIndicator[];
  userPrograms?: UserProgram[];
  userLectures?: UserLecture[];
  userExercises?: UserExercise[];
  gradedCompetencies?: GradedCompetency[];
  bookingConflicts?: BookingConflict[];
  landingsLog?: LandingRecord[];
  electronicLogbookEntries?: ElectronicLogbookEntry[];
  customers?: CustomerAccount[];
  priceLists?: PriceList[];
  priceListItems?: PriceListItem[];
  billingActivities?: BillingActivity[];
  invoices?: Invoice[];
  smsReports?: SmsReport[];
  soloEndorsements?: SoloEndorsement[];
  stageChecks?: StageCheck[];
  aerodromes?: AerodromeInfo[];
}

export type NotificationPriority = "critical" | "medium" | "low";

export interface AppNotification {
  id: string;
  title: string;
  detail: string;
  at: string;
  to: string;
  status: string;
  priority: NotificationPriority;
  category: "flight" | "booking" | "safety" | "profile" | "course" | "account";
  read?: boolean;
  bookingId?: string;
  userId?: string;
  flightId?: string;
  requestId?: string;
  profileRequestId?: string;
}
