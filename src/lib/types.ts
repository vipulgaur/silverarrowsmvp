export type Role = "admin" | "instructor" | "ground" | "student";

export const roleLabel: Record<Role, string> = {
  admin: "Administrator",
  instructor: "Flight Instructor (CFI)",
  ground: "Ground Instructor",
  student: "Student Pilot",
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
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
  irExpiry?: string;
  fiExpiry?: string;
  icaoLevel?: number;
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

export interface Aircraft {
  id: string;
  reg: string;
  type: string;
  hourlyRate: number;
  totalHours: number;
  tachHours: number;
  lastService?: string;
  grounded: boolean;
  status?: "available" | "maintenance" | "grounded";
}

export interface MaintenanceItem {
  id: string;
  aircraftId: string;
  title: string;
  dueHours?: number;
  intervalHours?: number;
  dueDate?: string;
  completedAt?: string;
  notes?: string;
}

export interface Lesson {
  id: string;
  code?: string;
  name: string;
  kind: "flight" | "ground" | "dual" | "solo" | "sim";
  minutes: number;
  description?: string;
}

export interface Program {
  id: string;
  name: string;
  lessons: Lesson[];
}

export type BookingType = "lesson" | "solo" | "maintenance";

export interface Booking {
  id: string;
  aircraftId?: string;
  studentId?: string;
  instructorId?: string;
  lessonId?: string;
  type: BookingType;
  status: "scheduled" | "completed" | "cancelled";
  start: string;
  end: string;
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

export interface Flight {
  id: string;
  bookingId?: string;
  date: string;
  offBlock: string;
  onBlock: string;
  aircraftId: string;
  pilotId: string;
  instructorId?: string;
  lessonId?: string;
  kind?: "dual" | "solo" | "pic" | "sim";
  minutes: number;
  dayMinutes?: number;
  nightMinutes?: number;
  xcMinutes?: number;
  multiEngineMinutes?: number;
  ifrMinutes?: number;
  landings: number;
  nightLandings?: number;
  fromIcao: string;
  toIcao: string;
  tachStart?: number;
  tachEnd?: number;
  hobbsStart?: number;
  hobbsEnd?: number;
  grade?: number;
  remarks?: string;
  route?: string;
  reason?: BookingReason;
  verificationStatus?: "verified" | "pending" | "rejected";
  submittedBy?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  weatherReport?: FlightWeatherAttachment;
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
    | "maintenance";
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
  category: "flight" | "booking" | "safety" | "profile" | "course";
  read?: boolean;
  bookingId?: string;
}
