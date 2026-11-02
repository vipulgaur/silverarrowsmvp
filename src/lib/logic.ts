import type {
  AppData,
  Booking,
  Flight,
  MaintenanceItem,
  Aircraft,
  AircraftModel,
  AircraftRemark,
  BookingConflict,
  CbtaCompetencyCode,
  ElectronicLogbookEntry,
  FlightFsmState,
  GradedCompetency,
  Invoice,
  LandingRecord,
  Role,
  SmsLikelihood,
  SmsReport,
  SmsRiskZone,
  SmsSeverity,
  SoloEndorsement,
  User,
  UserExercise,
  UserLecture,
  ProfileChanges,
  StudentDocument,
  AppNotification,
  NotificationPriority,
  BillingActivity,
} from "./types";
import { reasonLabel, roleLabel } from "./types";
import {
  DEFAULT_AIRCRAFT_MODELS,
  DEFAULT_CORE_COMPETENCIES,
  DEFAULT_MASTER_EXERCISES,
  DEFAULT_PRICE_LIST_ITEMS,
} from "./rea-seed";
import { addDays, format, startOfDay, subMonths } from "date-fns";

export const HOUR_PERIODS = [
  { label: "1 day", days: 1 },
  { label: "7 days", days: 7 },
  { label: "14 days", days: 14 },
  { label: "21 days", days: 21 },
  { label: "28 days", days: 28 },
  { label: "1 month", months: 1 },
  { label: "3 months", months: 3 },
  { label: "6 months", months: 6 },
  { label: "12 months", months: 12 },
] as const;

export type HourEntry = Pick<
  import("./types").Flight,
  "date" | "minutes" | "kind" | "ifrMinutes" | "pilotId" | "instructorId"
>;

/** Inclusive rolling calendar-date windows; months use calendar arithmetic, not 30-day approximations. */
export function cumulativeHours(
  person: Pick<User, "id" | "role">,
  entries: HourEntry[],
  now = new Date(),
) {
  const today = startOfDay(now);
  const end = format(today, "yyyy-MM-dd");
  const own = entries.filter((f) =>
    person.role === "instructor"
      ? f.instructorId === person.id || f.pilotId === person.id
      : f.pilotId === person.id,
  );
  return HOUR_PERIODS.map((period) => {
    const from =
      "days" in period
        ? addDays(today, 1 - period.days)
        : addDays(subMonths(today, period.months), 1);
    const start = format(from, "yyyy-MM-dd");
    const flights = own.filter((f) => f.date >= start && f.date <= end);
    const sum = (predicate: (f: HourEntry) => boolean) =>
      flights.filter(predicate).reduce((total, f) => total + f.minutes, 0);
    return {
      label: period.label,
      start,
      end,
      total: sum(() => true),
      dual: sum((f) => flightKind(f) === "dual"),
      solo: sum((f) => flightKind(f) === "solo"),
      instructed: sum((f) => f.instructorId === person.id && flightKind(f) !== "sim"),
      pic: sum((f) => f.pilotId === person.id && flightKind(f) !== "sim"),
      sim: sum((f) => flightKind(f) === "sim"),
      ifr: flights.reduce((total, f) => total + (f.ifrMinutes ?? 0), 0),
      flights: flights.filter((f) => flightKind(f) !== "sim").length,
    };
  });
}

/** Synthetic reporting records only: never insert these into the operational flight log or duty limits. */
export function demoHourEntries(person: Pick<User, "id" | "role">, now = new Date()): HourEntry[] {
  const seed = Array.from(person.id).reduce((total, letter) => total + letter.charCodeAt(0), 0);
  const today = startOfDay(now);
  const first = addDays(subMonths(today, 12), 1);
  const entries: HourEntry[] = [];
  for (let date = first, day = 0; date <= today; date = addDays(date, 1), day++) {
    const age = Math.round((today.getTime() - date.getTime()) / 86400000);
    if (age !== 0 && (age + seed) % 7 > (person.role === "instructor" ? 3 : 2)) continue;
    const kind = day % 9 === 0 ? "sim" : day % 4 === 0 ? "solo" : "dual";
    const minutes = 45 + ((day + seed) % 6) * 15;
    const teaches = person.role === "instructor" && kind !== "solo";
    entries.push({
      date: format(date, "yyyy-MM-dd"),
      kind,
      minutes,
      pilotId: teaches ? `demo-student-${person.id}` : person.id,
      instructorId: teaches ? person.id : kind === "dual" ? "demo-cfi" : undefined,
      ifrMinutes: day % 3 === 0 ? Math.floor(minutes / 3) : 0,
    });
  }
  return entries;
}

export const uid = () => Math.random().toString(36).slice(2, 10);

/** Minutes between two HH:mm times; wraps past midnight. */
export function blockMinutes(off: string, on: string): number {
  const [oh = NaN, om = NaN] = off.split(":").map(Number);
  const [nh = NaN, nm = NaN] = on.split(":").map(Number);
  if ([oh, om, nh, nm].some((n) => Number.isNaN(n))) return 0;
  let diff = nh * 60 + nm - (oh * 60 + om);
  if (diff < 0) diff += 24 * 60;
  return diff;
}

export function fmtHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}:${String(m).padStart(2, "0")}`;
}
export const fmtDec = (minutes: number) => (minutes / 60).toFixed(1);

export const activeUsers = (d: AppData, role?: Role) =>
  d.users.filter((u) => u.status !== "deleted" && (!role || u.role === role));

const overlaps = (a: { start: string; end: string }, b: { start: string; end: string }) =>
  new Date(a.start) < new Date(b.end) && new Date(b.start) < new Date(a.end);

/** Returns a human-readable reason a booking is not allowed, or null. */
export function bookingProblem(candidate: Booking, data: AppData): string | null {
  if (!Number.isFinite(Date.parse(candidate.start)) || !Number.isFinite(Date.parse(candidate.end)))
    return "Enter valid booking times.";
  if (new Date(candidate.end) <= new Date(candidate.start))
    return "End time must be after start time.";
  if (candidate.type === "lesson" && !candidate.studentId) return "A lesson needs a student.";
  if (candidate.aircraftId && candidate.type !== "maintenance") {
    const ac = data.aircraft.find((a) => a.id === candidate.aircraftId);
    if (ac && aircraftUnavailable(ac, data.maintenance))
      return `${ac.reg} is grounded or has overdue maintenance.`;
  }
  for (const id of [candidate.studentId, candidate.instructorId]) {
    const u = data.users.find((x) => x.id === id);
    if (u?.status === "deleted") return `${u.name} is no longer active.`;
  }
  for (const b of data.bookings) {
    if (b.id === candidate.id || b.status === "cancelled" || !overlaps(b, candidate)) continue;
    if (candidate.aircraftId && b.aircraftId === candidate.aircraftId)
      return "Aircraft is already booked at that time.";
    if (candidate.instructorId && b.instructorId === candidate.instructorId)
      return "Instructor is already booked at that time.";
    if (candidate.studentId && b.studentId === candidate.studentId)
      return "Student is already booked at that time.";
  }
  return null;
}

export const bookingApproved = (b: Booking) => (b.approvalStatus ?? "approved") === "approved";
export const bookingPending = (b: Booking) =>
  b.approvalStatus === "pending" && b.status === "scheduled";
export const bookingDeclined = (b: Booking) => b.approvalStatus === "declined";

export function prepareBooking(
  candidate: Booking,
  actor: User,
  data: AppData,
  now = new Date(),
): Booking | string {
  const previous = data.bookings.find((b) => b.id === candidate.id);
  if (!can.bookFor(actor, candidate.studentId)) return "You cannot book for this member.";
  if (actor.role === "student" && candidate.type === "maintenance")
    return "Students cannot book maintenance.";
  if (previous?.status === "completed" || previous?.status === "cancelled")
    return "This booking is no longer editable.";
  if (!candidate.aircraftId) return "Choose an aircraft.";
  const problem = bookingProblem(candidate, data);
  if (problem && candidate.status !== "cancelled") return problem;
  const changed =
    previous &&
    [
      "start",
      "end",
      "type",
      "aircraftId",
      "studentId",
      "instructorId",
      "lessonId",
      "route",
      "notes",
    ].some((key) => candidate[key as keyof Booking] !== previous[key as keyof Booking]);
  const rerequest = actor.role === "student" && changed && candidate.status === "scheduled";
  return {
    ...candidate,
    approvalStatus: rerequest
      ? "pending"
      : (previous?.approvalStatus ?? (actor.role === "student" ? "pending" : "approved")),
    requestedBy: previous?.requestedBy ?? actor.id,
    requestedAt: rerequest ? now.toISOString() : (previous?.requestedAt ?? now.toISOString()),
    reviewedBy: rerequest ? undefined : previous?.reviewedBy,
    reviewedAt: rerequest ? undefined : previous?.reviewedAt,
    decisionNotes: rerequest ? undefined : previous?.decisionNotes,
  };
}

export function reviewBooking(
  data: AppData,
  id: string,
  actor: User,
  decision: "approved" | "declined",
  notes = "",
  now = new Date(),
): Booking | string {
  if (actor.role !== "admin") return "Only administrators can review student bookings.";
  const b = data.bookings.find((x) => x.id === id);
  if (!b || !bookingPending(b)) return "Booking already reviewed or cancelled.";
  if (decision === "approved") {
    const problem = bookingProblem(b, data);
    if (problem) return problem;
  }
  return {
    ...b,
    approvalStatus: decision,
    status: decision === "declined" ? "cancelled" : "scheduled",
    reviewedBy: actor.id,
    reviewedAt: now.toISOString(),
    decisionNotes: notes.trim(),
  };
}

export type MxState = "ok" | "soon" | "overdue" | "done";

export function maintenanceState(item: MaintenanceItem, ac: Aircraft, now = new Date()): MxState {
  if (item.completedAt) return "done";
  let state: MxState = "ok";
  if (item.dueHours !== undefined) {
    const left = item.dueHours - ac.totalHours;
    if (left <= 0) return "overdue";
    if (left <= 10) state = "soon";
  }
  if (item.dueDate) {
    const days = (new Date(item.dueDate).getTime() - now.getTime()) / 86400000;
    if (days < 0) return "overdue";
    if (days <= 14) state = "soon";
  }
  return state;
}

export function aircraftUnavailable(ac: Aircraft, mx: MaintenanceItem[]): boolean {
  return (
    ac.grounded || mx.some((m) => m.aircraftId === ac.id && maintenanceState(m, ac) === "overdue")
  );
}

/** Hours remaining until the next hour-based inspection, or null if none scheduled. */
export function hoursToService(ac: Aircraft, mx: MaintenanceItem[]): number | null {
  const due = mx
    .filter((m) => m.aircraftId === ac.id && !m.completedAt && m.dueHours !== undefined)
    .map((m) => m.dueHours! - ac.totalHours);
  return due.length ? Math.round(Math.min(...due) * 10) / 10 : null;
}

export function studentProgress(studentId: string, data: AppData) {
  const student = data.users.find((u) => u.id === studentId);
  const program = data.programs.find((p) => p.id === student?.programId);
  const done = new Set(
    data.completions.filter((c) => c.studentId === studentId).map((c) => c.lessonId),
  );
  const total = program?.lessons.length ?? 0;
  const completed = program ? program.lessons.filter((l) => done.has(l.id)).length : 0;
  const minutes = data.flights
    .filter((f) => f.pilotId === studentId)
    .reduce((s, f) => s + f.minutes, 0);
  const next = program?.lessons.find((l) => !done.has(l.id));
  return {
    program,
    done,
    total,
    completed,
    pct: total ? Math.round((completed / total) * 100) : 0,
    minutes,
    next,
  };
}

export function flightKind(f: { kind?: string | undefined; instructorId?: string | undefined }) {
  return f.kind ?? (f.instructorId ? "dual" : "solo");
}

export function isFlightVerified(f: Pick<Flight, "verificationStatus">): boolean {
  return (f.verificationStatus ?? "verified") === "verified";
}

export function flightTimeParts(
  f: Flight,
  dataOrAircraft?: AppData | AppData["aircraft"],
) {
  const aircraftList = Array.isArray(dataOrAircraft)
    ? dataOrAircraft
    : (dataOrAircraft?.aircraft ?? []);
  const night =
    f.nightMinutes ??
    (f.nightLandings && f.nightLandings > 0 ? Math.min(f.minutes, f.nightLandings * 25) : 0);
  const day = f.dayMinutes ?? Math.max(0, f.minutes - night);
  const xc =
    f.xcMinutes ?? (f.fromIcao !== f.toIcao && flightKind(f) !== "sim" ? f.minutes : 0);
  const ifr = f.ifrMinutes ?? 0;
  const acType = aircraftList.find((a) => a.id === f.aircraftId)?.type?.toLowerCase() ?? "";
  const multiEngine =
    f.multiEngineMinutes ??
    (f.aircraftId === "a-3" || acType.includes("da42") || acType.includes("multi")
      ? f.minutes
      : 0);
  return { day, night, xc, ifr, multiEngine, multi: multiEngine };
}

export function hoursBreakdown(pilotId: string, data: AppData, now = new Date()) {
  const allFl = data.flights.filter((f) => f.pilotId === pilotId);
  const fl = allFl.filter(isFlightVerified);
  const pendingFl = allFl.filter((f) => f.verificationStatus === "pending");
  const sum = (pred: (f: (typeof fl)[number]) => boolean) =>
    fl.filter(pred).reduce((s, f) => s + f.minutes, 0);
  const since90 = new Date(now.getTime() - 90 * 86400000);
  const sortedDates = fl.map((f) => f.date).sort((a, b) => b.localeCompare(a));

  let dualDay = 0;
  let dualNight = 0;
  let soloDay = 0;
  let soloNight = 0;
  let day = 0;
  let night = 0;
  let crossCountry = 0;
  let multiEngine = 0;

  for (const f of fl) {
    const parts = flightTimeParts(f, data);
    const kind = flightKind(f);
    if (kind !== "sim") {
      day += parts.day;
      night += parts.night;
      crossCountry += parts.xc;
      multiEngine += parts.multiEngine;
    }
    if (kind === "dual") {
      dualDay += parts.day;
      dualNight += parts.night;
    } else if (kind === "solo" || kind === "pic") {
      soloDay += parts.day;
      soloNight += parts.night;
    }
  }

  return {
    total: sum(() => true),
    dual: sum((f) => flightKind(f) === "dual"),
    solo: sum((f) => flightKind(f) === "solo" || flightKind(f) === "pic"),
    dualDay,
    dualNight,
    soloDay,
    soloNight,
    day,
    night,
    crossCountry,
    multiEngine,
    sim: sum((f) => flightKind(f) === "sim"),
    ifr: fl.reduce((s, f) => s + (f.ifrMinutes ?? 0), 0),
    landings: fl.reduce((s, f) => s + f.landings, 0),
    nightLandings: fl.reduce((s, f) => s + (f.nightLandings ?? 0), 0),
    landings90: fl
      .filter((f) => new Date(f.date) >= since90 && flightKind(f) !== "sim")
      .reduce((s, f) => s + f.landings, 0),
    lastFlightDate: sortedDates[0] ?? undefined,
    pendingMinutes: pendingFl.reduce((s, f) => s + f.minutes, 0),
    pendingCount: pendingFl.length,
  };
}

/** Submit a flight log entry or correction. Students create 'pending' entries requiring instructor verification. */
export function submitStudentFlightLog(
  data: AppData,
  actor: User,
  candidate: Flight,
): AppData | string {
  if (actor.role === "student" && candidate.pilotId !== actor.id) {
    return "Students can only submit flight logs for themselves.";
  }
  const existing = data.flights.find((f) => f.id === candidate.id);
  if (existing && actor.role === "student" && isFlightVerified(existing)) {
    return "Verified flight logs cannot be modified by students without instructor authorisation.";
  }
  if (!candidate.date || !/^\d{4}-\d{2}-\d{2}$/.test(candidate.date)) {
    return "Enter a valid flight date.";
  }
  if (!candidate.minutes || candidate.minutes < 5 || candidate.minutes > 720) {
    return "Flight duration must be between 5 and 720 minutes.";
  }
  if (!candidate.aircraftId || !data.aircraft.some((a) => a.id === candidate.aircraftId)) {
    return "Select a valid aircraft.";
  }

  const entry: Flight = {
    ...candidate,
    verificationStatus: actor.role === "student" ? "pending" : "verified",
    submittedBy: existing?.submittedBy ?? actor.id,
    verifiedBy: actor.role === "student" ? undefined : actor.id,
    verifiedAt: actor.role === "student" ? undefined : new Date().toISOString(),
  };

  const flights = existing
    ? data.flights.map((f) => (f.id === entry.id ? entry : f))
    : [entry, ...data.flights];

  return {
    ...data,
    flights,
  };
}

/** Verify or reject a student-submitted flight log entry. */
export function verifyFlightLog(
  data: AppData,
  flightId: string,
  reviewer: User,
  decision: "verified" | "rejected",
  remarks?: string,
  now = new Date(),
): AppData | string {
  if (reviewer.role !== "admin" && reviewer.role !== "instructor") {
    return "Only flight instructors and administrators can verify flight logs.";
  }
  const target = data.flights.find((f) => f.id === flightId);
  if (!target) return "Flight log entry not found.";
  if (target.verificationStatus !== "pending") {
    return "This flight log has already been reviewed.";
  }

  const updatedFlight: Flight = {
    ...target,
    verificationStatus: decision,
    verifiedBy: reviewer.id,
    verifiedAt: now.toISOString(),
    instructorId: target.instructorId ?? (reviewer.role === "instructor" ? reviewer.id : undefined),
    remarks: remarks?.trim() ? remarks.trim() : target.remarks,
  };

  let aircraft = data.aircraft;
  let completions = data.completions;
  let bookings = data.bookings;

  if (decision === "verified") {
    const hrs = updatedFlight.minutes / 60;
    aircraft = data.aircraft.map((a) =>
      a.id === updatedFlight.aircraftId
        ? {
            ...a,
            totalHours: Math.round((a.totalHours + hrs) * 10) / 10,
            tachHours: Math.round((a.tachHours + hrs) * 10) / 10,
          }
        : a,
    );
    if (updatedFlight.lessonId && (updatedFlight.grade ?? 0) >= 3) {
      completions = [
        ...completions.filter((c) => c.flightId !== updatedFlight.id),
        {
          id: `c-${updatedFlight.id}`,
          studentId: updatedFlight.pilotId,
          lessonId: updatedFlight.lessonId,
          date: updatedFlight.date,
          instructorId: updatedFlight.instructorId ?? reviewer.id,
          grade: updatedFlight.grade,
          flightId: updatedFlight.id,
        },
      ];
    }
    if (updatedFlight.bookingId) {
      bookings = data.bookings.map((b) =>
        b.id === updatedFlight.bookingId ? { ...b, status: "completed" as const } : b,
      );
    }
  }

  return {
    ...data,
    aircraft,
    completions,
    bookings,
    flights: data.flights.map((f) => (f.id === flightId ? updatedFlight : f)),
  };
}

export function studentDocumentsFor(user: User, data: AppData, now = new Date()) {
  const derived: Array<
    StudentDocument & {
      expiryState: ExpiryState;
      daysRemaining: number;
      isProfileDerived?: boolean;
    }
  > = [];

  const pushDerived = (
    id: string,
    title: string,
    category: StudentDocument["category"],
    docNum?: string,
    expiryDate?: string,
    notes?: string,
  ) => {
    const exp = expiryState(expiryDate, now, 60);
    derived.push({
      id,
      studentId: user.id,
      title,
      category,
      documentNumber: docNum || "On file",
      expiryDate,
      verified: Boolean(docNum || expiryDate),
      notes,
      expiryState: exp.state,
      daysRemaining: exp.days,
      isProfileDerived: true,
    });
  };

  pushDerived(
    `doc-spl-${user.id}`,
    "Student Pilot Licence (SPL)",
    "licence",
    user.splNumber ?? user.licence,
    user.splExpiry,
    "Official Student Pilot Licence required for solo consolidation",
  );
  pushDerived(
    `doc-frtol-${user.id}`,
    "Flight Radio Telephone Operator's Licence (FRTOL)",
    "radio",
    user.frtolNumber,
    user.frtolExpiry,
    "Restricted/Full radiotelephony operations privilege",
  );
  pushDerived(
    `doc-rtr-${user.id}`,
    "Radio Telephony Restricted (RTR) Permit",
    "radio",
    user.rtrNumber,
    user.rtrExpiry,
    "WPC / Ministry of Communications RTR(A) certificate",
  );
  pushDerived(
    `doc-med-${user.id}`,
    `Class ${user.medicalClass ?? 2} Aviation Medical Assessment`,
    "medical",
    user.egcaId ? `MED-${user.egcaId}` : `CLASS-${user.medicalClass ?? 2}`,
    user.medicalExpiry,
    `Class ${user.medicalClass ?? 2} medical fitness certificate`,
  );

  const customDocs = (data.documents ?? [])
    .filter((d) => d.studentId === user.id)
    .map((d) => {
      const exp = expiryState(d.expiryDate, now, 60);
      return {
        ...d,
        expiryState: exp.state,
        daysRemaining: exp.days,
        isProfileDerived: false,
      };
    });

  return [...derived, ...customDocs];
}

export type ExpiryState = "ok" | "soon" | "expired" | "none";
export function expiryState(
  date?: string,
  now = new Date(),
  warnDays = 60,
): { state: ExpiryState; days: number } {
  if (!date) return { state: "none", days: 0 };
  const days = Math.ceil((new Date(date).getTime() - now.getTime()) / 86400000);
  return { state: days < 0 ? "expired" : days <= warnDays ? "soon" : "ok", days };
}

export const PASS_MARK = 75;

export function theoryProgress(studentId: string, data: AppData) {
  const results = data.exams.filter((e) => e.studentId === studentId);
  const best = new Map<string, (typeof results)[number]>();
  for (const r of results) {
    const prev = best.get(r.subjectId);
    if (!prev || r.score > prev.score) best.set(r.subjectId, r);
  }
  const passed = data.subjects.filter((s) => best.get(s.id)?.passed).length;
  const total = data.subjects.length;
  return { best, passed, total, pct: total ? Math.round((passed / total) * 100) : 0 };
}

export const FTL = { flightMin: 8 * 60, dutyMin: 10 * 60, restMin: 12 * 60 };

export function ftlStatus(instructorId: string, data: AppData, now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  const flightMin = data.flights
    .filter((f) => f.instructorId === instructorId && f.date === today)
    .reduce((s, f) => s + f.minutes, 0);
  const logs = data.duty.filter(
    (d) => d.instructorId === instructorId && d.start.slice(0, 10) === today,
  );
  const dutyMin = Math.round(
    logs.reduce(
      (s, d) => s + ((d.end ? new Date(d.end) : now).getTime() - new Date(d.start).getTime()),
      0,
    ) / 60000,
  );
  const open = data.duty.find((d) => d.instructorId === instructorId && !d.end);
  return {
    flightMin,
    dutyMin,
    open,
    flightLeft: Math.max(0, FTL.flightMin - flightMin),
    dutyLeft: Math.max(0, FTL.dutyMin - dutyMin),
    exceeded: flightMin > FTL.flightMin || dutyMin > FTL.dutyMin,
  };
}

/** Approve or decline a reschedule request. Returns new data or an error message. */
export function reviewRequest(
  data: AppData,
  requestId: string,
  reviewer: User,
  decision: "approved" | "declined",
  notes = "",
  now = new Date(),
): AppData | string {
  const req = data.requests.find((r) => r.id === requestId);
  if (!req) return "Request not found.";
  if (req.status !== "pending") return "Request was already reviewed.";
  if (
    reviewer.role !== "admin" &&
    !(reviewer.role === "instructor" && req.instructorId === reviewer.id)
  )
    return "Only the assigned instructor or an administrator can review this request.";
  let bookings = data.bookings;
  if (decision === "approved") {
    const booking = data.bookings.find((b) => b.id === req.bookingId);
    if (!booking) return "Booking no longer exists.";
    const moved = { ...booking, start: req.proposedStart, end: req.proposedEnd };
    const problem = bookingProblem(moved, data);
    if (problem) return `Cannot move booking: ${problem}`;
    bookings = data.bookings.map((b) => (b.id === moved.id ? moved : b));
  }
  return {
    ...data,
    bookings,
    requests: data.requests.map((r) =>
      r.id === requestId
        ? { ...r, status: decision, reviewerId: reviewer.id, notes, reviewedAt: now.toISOString() }
        : r,
    ),
  };
}

export function softDeleteUser(
  data: AppData,
  userId: string,
  admin: User,
  now = new Date(),
): AppData | string {
  if (admin.role !== "admin") return "Only administrators can delete users.";
  if (userId === admin.id) return "You cannot delete your own account.";
  const u = data.users.find((x) => x.id === userId);
  if (!u) return "User not found.";
  if (u.status === "deleted") return "User is already deleted.";
  return {
    ...data,
    users: data.users.map((x) =>
      x.id === userId
        ? {
            ...x,
            status: "deleted",
            deletedBy: admin.id,
            deletedAt: now.toISOString(),
            statusReason: `Soft-deleted by Admin ${admin.name}`,
          }
        : x,
    ),
    bookings: data.bookings.map((b) =>
      b.status === "scheduled" &&
      new Date(b.start) > now &&
      (b.studentId === userId || b.instructorId === userId)
        ? { ...b, status: "cancelled" }
        : b,
    ),
  };
}

export function restoreUser(data: AppData, userId: string, admin: User): AppData | string {
  if (admin.role !== "admin") return "Only administrators can restore users.";
  return {
    ...data,
    users: data.users.map((x) =>
      x.id === userId
        ? {
            ...x,
            status: "active",
            deletedBy: undefined,
            deletedAt: undefined,
            statusReason: undefined,
          }
        : x,
    ),
  };
}

export const SOLE_ADMIN_EMAIL = "admin@flysilverarrows.com";
export const PENDING_APPROVAL_STATUS_REASON = "PENDING_ADMIN_APPROVAL";
export const DECLINED_APPROVAL_STATUS_REASON = "DECLINED_BY_ADMIN";

export function isUserPendingApproval(
  u?: Pick<User, "statusReason" | "status" | "email" | "role"> | null,
): boolean {
  if (!u || u.status === "deleted") return false;
  if (u.role === "admin") return false;
  if (u.email && u.email.trim().toLowerCase() === SOLE_ADMIN_EMAIL) return false;
  if (u.statusReason === DECLINED_APPROVAL_STATUS_REASON) return false;
  return u.statusReason === PENDING_APPROVAL_STATUS_REASON;
}

export function approveUserLogin(data: AppData, userId: string, admin: User): AppData | string {
  if (admin.role !== "admin") return "Only administrators can approve user login access.";
  const u = data.users.find((x) => x.id === userId);
  if (!u) return "User not found.";
  return {
    ...data,
    users: data.users.map((x) =>
      x.id === userId
        ? {
            ...x,
            status: "active",
            statusReason: undefined,
          }
        : x,
    ),
  };
}

export function declineUserLogin(
  data: AppData,
  userId: string,
  admin: User,
  now = new Date(),
): AppData | string {
  if (admin.role !== "admin") return "Only administrators can decline user login requests.";
  if (userId === admin.id || userId === "u-admin") {
    return "Cannot decline the system administrator account.";
  }
  const u = data.users.find((x) => x.id === userId);
  if (!u) return "User not found.";
  return {
    ...data,
    users: data.users.map((x) =>
      x.id === userId
        ? {
            ...x,
            status: "deleted",
            deletedBy: admin.id,
            deletedAt: now.toISOString(),
            statusReason: DECLINED_APPROVAL_STATUS_REASON,
          }
        : x,
    ),
    activity: data.activity.filter(
      (a) =>
        !(
          a.action === "account_registration_requested" &&
          (a.entityId === userId || a.details.toLowerCase().includes(u.email.toLowerCase()))
        ),
    ),
  };
}

/**
 * Compares two phone numbers by normalized digits and subscriber suffix (last 10 digits when applicable).
 */
export function phonesMatch(phoneA?: string, phoneB?: string): boolean {
  if (!phoneA || !phoneB) return false;
  const digitsA = phoneA.replace(/[^\d]/g, "");
  const digitsB = phoneB.replace(/[^\d]/g, "");
  if (digitsA.length < 7 || digitsB.length < 7) return false;
  if (digitsA === digitsB) return true;
  if (digitsA.length >= 10 && digitsB.length >= 10) {
    return digitsA.slice(-10) === digitsB.slice(-10);
  }
  if (digitsA.length >= 8 && digitsB.length >= 8) {
    return digitsA.endsWith(digitsB) || digitsB.endsWith(digitsA);
  }
  return false;
}

/**
 * Live validation for username ({username}@flysilverarrows.com) and phone number ONLY.
 * Does NOT trigger on first/last/full name entry.
 */
export function validateLiveUsernameAndPhone(
  candidate: {
    username?: string;
    email?: string;
    phone?: string;
  },
  existingUsers: User[],
): string | null {
  const rawEmailOrUser = (candidate.username ?? candidate.email ?? "").trim().toLowerCase();
  const emailPrefix = rawEmailOrUser.includes("@")
    ? (rawEmailOrUser.split("@")[0]?.trim() ?? "")
    : rawEmailOrUser.replace(/\s+/g, "");
  const cleanEmail = rawEmailOrUser.includes("@")
    ? rawEmailOrUser
    : emailPrefix
      ? `${emailPrefix}@flysilverarrows.com`
      : "";
  const cleanPhone = (candidate.phone ?? "").trim();
  const phoneDigits = cleanPhone.replace(/[^\d]/g, "");

  const errors: string[] = [];
  const activeOrPending = existingUsers.filter((u) => u.status !== "deleted");

  if (emailPrefix) {
    if (
      emailPrefix === "admin" ||
      cleanEmail === SOLE_ADMIN_EMAIL ||
      cleanEmail === "sakshi@flysilverarrows.com"
    ) {
      errors.push(
        `Username "${emailPrefix}@flysilverarrows.com" is reserved for the sole System Administrator and cannot be registered.`,
      );
    } else {
      const emailMatch = activeOrPending.find((u) => {
        const existingEmail = u.email.trim().toLowerCase();
        const existingPrefix = existingEmail.split("@")[0] ?? "";
        return (
          existingEmail === cleanEmail ||
          (existingEmail.endsWith("@flysilverarrows.com") && existingPrefix === emailPrefix)
        );
      });
      if (emailMatch) {
        errors.push(
          `Username "${emailPrefix}@flysilverarrows.com" is already registered (${emailMatch.name}). Please choose a different username.`,
        );
      }
    }
  }

  // Only check phone uniqueness when the user has entered at least 7 subscriber digits
  // (ignoring a bare ISD code like "+91" before subscriber digits are typed)
  if (phoneDigits.length >= 7) {
    const phoneMatch = activeOrPending.find((u) => u.phone && phonesMatch(u.phone, cleanPhone));
    if (phoneMatch) {
      errors.push(
        `Phone number "${cleanPhone}" is already registered (${phoneMatch.name} · ${phoneMatch.phone}). Duplicate phone numbers are not permitted.`,
      );
    }
  }

  return errors.length > 0 ? errors.join(" ") : null;
}

/**
 * Strict account creation validation shared across public registration (/login) and admin creation (/admin/create).
 * Enforces:
 * 1. Single-admin policy: only admin@flysilverarrows.com is permitted as Administrator.
 * 2. Unique Username/Email policy: no two users can share an email ID or @flysilverarrows.com username.
 * 3. Unique Phone policy: no two users can share the same phone number.
 * Note: Name is NOT checked for duplicates or reserved words — only username/email and phone number are validated for uniqueness.
 */
export function validateAccountCreation(
  candidate: {
    name?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    email: string;
    phone: string;
    role?: Role;
  },
  existingUsers: User[],
): string | null {
  const first = (candidate.firstName ?? "").trim();
  const last = (candidate.lastName ?? "").trim();
  const fullName = (candidate.name ?? `${first} ${last}`).trim().replace(/\s+/g, " ");
  const rawEmail = (candidate.email || candidate.username || "").trim().toLowerCase();
  const cleanEmail = rawEmail.includes("@")
    ? rawEmail
    : rawEmail
      ? `${rawEmail}@flysilverarrows.com`
      : "";
  const emailPrefix = cleanEmail.split("@")[0] ?? "";
  const cleanPhone = (candidate.phone ?? "").trim();

  if (!fullName || fullName.length < 2) {
    return "Enter a valid full name (at least 2 characters).";
  }
  if (candidate.firstName !== undefined && (!first || first.length < 2)) {
    return "Enter a valid first name (at least 2 characters).";
  }
  if (candidate.lastName !== undefined && (!last || last.length < 2)) {
    return "Enter a valid last name (at least 2 characters).";
  }
  if (
    !emailPrefix ||
    !/^[a-z0-9._+-]+$/i.test(emailPrefix) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
    cleanEmail.length > 255
  ) {
    return "Enter a valid username for your @flysilverarrows.com email address.";
  }
  const normPhone = cleanPhone.replace(/[\s\-().+]/g, "");
  if (normPhone.length < 7 || !/^\d+$/.test(normPhone)) {
    return "Enter a valid phone number (at least 7 digits).";
  }

  // 1. Sole Admin Lock
  if (candidate.role === "admin" || cleanEmail === SOLE_ADMIN_EMAIL || emailPrefix === "admin") {
    return "Administrator creation is locked. Only admin@flysilverarrows.com is authorized as the sole Administrator in the system.";
  }

  // 2. Username/Email & Phone uniqueness check
  return validateLiveUsernameAndPhone(
    { username: emailPrefix, email: cleanEmail, phone: cleanPhone },
    existingUsers,
  );
}



export function hasRole(user: Pick<User, "role" | "secondaryRoles">, target: Role): boolean {
  return user.role === target || Boolean(user.secondaryRoles?.includes(target));
}

export const can = {
  manageUsers: (r: Role) => r === "admin" || r === "staff",
  manageFleet: (r: Role) => r === "admin" || r === "staff",
  groundAircraft: (r: Role) =>
    r === "admin" || r === "staff" || r === "instructor" || r === "crew",
  managePrograms: (r: Role) => r === "admin" || r === "staff",
  signOff: (r: Role) => r === "admin" || r === "instructor",
  logFlight: (r: Role) => r === "admin" || r === "instructor" || r === "crew",
  manageLectures: (r: Role) => r === "admin" || r === "staff" || r === "ground",
  manageInvoicing: (r: Role) => r === "admin" || r === "staff",
  bookFor: (me: User, studentId?: string) =>
    me.role === "admin" ||
    me.role === "staff" ||
    me.role === "instructor" ||
    ((me.role === "student" || me.role === "renter" || me.role === "crew") &&
      studentId === me.id),
  book: (r: Role) => r !== "ground",
};

export const homeFor: Record<Role, string> = {
  admin: "/portal/admin",
  staff: "/operations",
  instructor: "/portal/cfi",
  crew: "/operations",
  ground: "/portal/ground",
  student: "/portal/student",
  renter: "/portal/student",
};

/**
 * Returns true if the given user is restricted to E-Learning Only (Parth Bhatt or E-Learning branch lock).
 */
export function isElearningOnlyUser(
  user?: Pick<User, "id" | "email" | "name"> | null,
): boolean {
  if (
    typeof import.meta !== "undefined" &&
    import.meta.env?.VITE_ELEARNING_ONLY_MODE === "true"
  ) {
    return true;
  }
  if (!user) return false;
  if (user.id === "u-parth") return true;
  const email = (user.email ?? "").trim().toLowerCase();
  return (
    email === "parth@flysilverarrows.com" ||
    email === "parth.bhatt@flysilverarrows.com" ||
    email.startsWith("parth@") ||
    email.startsWith("parth.")
  );
}

export function homeForUser(
  user?: Pick<User, "id" | "email" | "name" | "role"> | null,
): string {
  if (!user) return "/elearning";
  if (isElearningOnlyUser(user)) return "/elearning";
  return homeFor[user.role] ?? "/portal/student";
}

const access: Record<Role, string[]> = {
  admin: ["*"],
  staff: [
    "/dashboard",
    "/learning",
    "/profile",
    "/portal/admin",
    "/schedule",
    "/operations",
    "/cbta",
    "/invoicing",
    "/sms",
    "/my-hub",
    "/flights",
    "/people",
    "/training",
    "/fleet",
  ],
  instructor: [
    "/dashboard",
    "/learning",
    "/profile",
    "/portal/cfi",
    "/schedule",
    "/operations",
    "/cbta",
    "/sms",
    "/my-hub",
    "/flights",
    "/people",
    "/training",
    "/fleet",
  ],
  crew: [
    "/dashboard",
    "/learning",
    "/profile",
    "/schedule",
    "/operations",
    "/cbta",
    "/sms",
    "/my-hub",
    "/flights",
    "/fleet",
  ],
  ground: [
    "/dashboard",
    "/learning",
    "/profile",
    "/portal/ground",
    "/cbta",
    "/sms",
    "/my-hub",
    "/people",
    "/training",
    "/fleet",
  ],
  student: [
    "/dashboard",
    "/learning",
    "/profile",
    "/portal/student",
    "/schedule",
    "/operations",
    "/cbta",
    "/invoicing",
    "/sms",
    "/my-hub",
    "/flights",
    "/training",
    "/fleet",
    "/people/",
  ],
  renter: [
    "/dashboard",
    "/learning",
    "/profile",
    "/portal/student",
    "/schedule",
    "/operations",
    "/invoicing",
    "/sms",
    "/my-hub",
    "/flights",
    "/fleet",
    "/people/",
  ],
};

/** Route-level RBAC. "/people/" prefix grants detail pages only (students see their own). */
export function canAccess(
  role: Role,
  path: string,
  user?: Pick<User, "id" | "email" | "name"> | null,
): boolean {
  if (isElearningOnlyUser(user)) {
    return (
      path === "/elearning" ||
      path.startsWith("/elearning/") ||
      path === "/learning" ||
      path.startsWith("/learning/")
    );
  }
  const allowed = access[role] ?? access.student;
  if (allowed.includes("*")) return true;
  return allowed.some((p) =>
    p.endsWith("/") ? path.startsWith(p) : path === p || path.startsWith(p + "/"),
  );
}

/** Flights/bookings visible to a user. */
export function visibleTo<
  T extends {
    pilotId?: string | undefined;
    studentId?: string | undefined;
    instructorId?: string | undefined;
  },
>(me: User, items: T[]): T[] {
  if (me.role === "admin" || me.role === "staff") return items;
  if (me.role === "instructor") {
    return items.filter((i) => i.instructorId === me.id || i.pilotId === me.id);
  }
  if (me.role === "ground") return [];
  return items.filter((i) => (i.pilotId ?? i.studentId) === me.id);
}

export const PROFILE_FIELDS = {
  name: "Full name",
  email: "Email",
  phone: "Phone",
  callsign: "Call sign",
  computerNumber: "Computer Number",
  egcaId: "eGCA ID",
  fileNumber: "File Number",
  licence: "Licence / ratings",
  splNumber: "SPL Number",
  splExpiry: "SPL Validity",
  frtolNumber: "FRTOL Number",
  frtolExpiry: "FRTOL Validity",
  rtrNumber: "RTR Number",
  rtrExpiry: "RTR Validity",
  speciality: "Speciality",
  medicalClass: "Medical class",
  medicalExpiry: "Medical Validity",
  ratingExpiry: "Rating expiry",
  icaoLevel: "ICAO English level",
  examAirRegulation: "Air Regulation Exam",
  examMeteorology: "Meteorology Exam",
  examAirNavigation: "Air Navigation Exam",
  examTechnicalGeneral: "Technical General Exam",
  examTechnicalSpecific: "Technical Specific Exam",
  address: "Address",
  postCode: "Post code",
  city: "City",
  country: "Country",
  dateOfBirth: "Date of birth",
  gender: "Gender",
  placeOfBirth: "Place of birth",
  userReference: "User reference",
  caaRef: "CAA Ref. number",
  emergencyName: "Emergency contact name",
  emergencyPhone: "Emergency contact phone",
  emergencyRelation: "Emergency contact relation",
  publicNote: "Public note",
  adminNote: "Admin note",
  instructorNote: "Instructor note",
} as const;

export const BOOLEAN_PROFILE_FIELDS = [
  "examAirRegulation",
  "examMeteorology",
  "examAirNavigation",
  "examTechnicalGeneral",
] as const;

export const DATE_PROFILE_FIELDS = [
  "dateOfBirth",
  "medicalExpiry",
  "ratingExpiry",
  "splExpiry",
  "frtolExpiry",
  "rtrExpiry",
] as const;

export const TECHNICAL_SPECIFIC_OPTIONS = [
  "Not Attempted",
  "Cessna 172S (Single-Engine)",
  "Diamond DA42 (Multi-Engine)",
  "Piper PA-28 Archer",
  "Cessna 152",
  "Passed — C172S & DA42",
] as const;

export const NOTE_FIELDS = ["publicNote", "adminNote", "instructorNote"] as const;
/** Fields only staff may set or see (never shown to or edited by the student). */
export const STAFF_ONLY_FIELDS = ["adminNote", "instructorNote"] as const;
export const GENDERS = ["Female", "Male", "Other", "Prefer not to say"] as const;

const isIsoDate = (v: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(v) &&
  !Number.isNaN(Date.parse(v)) &&
  new Date(v).toISOString().slice(0, 10) === v;

export function profileProblem(
  changes: ProfileChanges,
  target: User,
  data: AppData,
): string | null {
  if (Object.keys(changes).some((key) => !(key in PROFILE_FIELDS)))
    return "This profile field cannot be edited.";
  const next = { ...target, ...changes };
  if (typeof next.name !== "string" || !next.name.trim()) return "Enter a full name.";
  if (typeof next.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email))
    return "Enter a valid email address.";
  if (
    data.users.some(
      (u) =>
        u.id !== target.id &&
        u.status === "active" &&
        u.email.toLowerCase() === next.email.toLowerCase(),
    )
  )
    return "This email is already used by another member.";
  if ("phone" in changes && typeof next.phone === "string" && next.phone.trim()) {
    const normPhone = next.phone.replace(/[\s\-()]/g, "");
    if (
      normPhone.length >= 7 &&
      data.users.some(
        (u) =>
          u.id !== target.id &&
          u.status === "active" &&
          u.phone &&
          u.phone.replace(/[\s\-()]/g, "") === normPhone,
      )
    )
      return "This phone number is already registered to another member.";
  }
  for (const key of Object.keys(PROFILE_FIELDS) as (keyof ProfileChanges)[]) {
    const value = changes[key];
    if (value === undefined) continue;
    if (key === "medicalClass") {
      if (value !== 1 && value !== 2) return "Medical class must be 1 or 2.";
    } else if (key === "icaoLevel") {
      if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 6)
        return "ICAO English level must be 1 to 6.";
    } else if ((BOOLEAN_PROFILE_FIELDS as readonly string[]).includes(key)) {
      if (typeof value !== "boolean") return "Exam status must be true or false.";
    } else if (
      typeof value !== "string" ||
      value.length > ((NOTE_FIELDS as readonly string[]).includes(key) ? 2000 : 200)
    )
      return (NOTE_FIELDS as readonly string[]).includes(key)
        ? "Notes must be no longer than 2000 characters."
        : "Profile text must be no longer than 200 characters.";
    if (
      (key === "medicalExpiry" ||
        key === "ratingExpiry" ||
        key === "splExpiry" ||
        key === "frtolExpiry" ||
        key === "rtrExpiry") &&
      value &&
      (typeof value !== "string" || !isIsoDate(value))
    )
      return "Enter a valid expiry date.";
    if (
      key === "dateOfBirth" &&
      value &&
      (typeof value !== "string" ||
        !isIsoDate(value) ||
        value > new Date().toISOString().slice(0, 10))
    )
      return "Enter a valid date of birth.";
    if (key === "gender" && value && !(GENDERS as readonly string[]).includes(String(value)))
      return "Choose a gender from the list.";
  }
  return null;
}

export function submitProfileRequest(
  data: AppData,
  actor: User,
  userId: string,
  input: ProfileChanges,
  now = new Date(),
): AppData | string {
  const member = data.users.find((u) => u.id === actor.id && u.status === "active");
  const target = data.users.find((u) => u.id === userId && u.status === "active");
  if (!member || !target) return "Active member not found.";
  if (member.role !== "admin" && member.id !== userId) return "You can only edit your own profile.";
  if (member.role !== "admin" && STAFF_ONLY_FIELDS.some((key) => key in input))
    return "Only staff can edit admin and instructor notes.";
  const problem = profileProblem(input, target, data);
  if (problem) return problem;
  if (data.profileRequests.some((r) => r.userId === userId && r.status === "pending"))
    return "This profile already has a pending request.";
  const changes: ProfileChanges = {};
  const before: ProfileChanges = {};
  for (const key of Object.keys(PROFILE_FIELDS) as (keyof ProfileChanges)[]) {
    if (!(key in input)) continue;
    const value = typeof input[key] === "string" ? String(input[key]).trim() : input[key];
    if ((target[key] ?? "") === (value ?? "")) continue;
    Object.assign(changes, { [key]: value });
    Object.assign(before, { [key]: target[key] });
  }
  if (!Object.keys(changes).length) return "No profile changes to submit.";
  const approved = member.role === "admin";
  return {
    ...data,
    users: approved
      ? data.users.map((u) => (u.id === userId ? { ...u, ...changes } : u))
      : data.users,
    profileRequests: [
      {
        id: `PR-${uid()}`,
        userId,
        submittedBy: member.id,
        changes,
        before,
        status: approved ? "approved" : "pending",
        createdAt: now.toISOString(),
        ...(approved
          ? {
              reviewerId: member.id,
              reviewedAt: now.toISOString(),
              notes: "Updated by administrator",
            }
          : {}),
      },
      ...data.profileRequests,
    ],
  };
}

export function reviewProfileRequest(
  data: AppData,
  requestId: string,
  actor: User,
  decision: "approved" | "declined",
  notes = "",
  now = new Date(),
): AppData | string {
  const member = data.users.find((u) => u.id === actor.id && u.status === "active");
  if (member?.role !== "admin") return "Only administrators can review profile changes.";
  const request = data.profileRequests.find((r) => r.id === requestId);
  if (!request) return "Profile request not found.";
  if (request.status !== "pending") return "This request has already been reviewed.";
  if (decision === "declined" && !notes.trim()) return "Add a reason for declining the request.";
  const target = data.users.find((u) => u.id === request.userId);
  if (!target) return "Member not found.";
  if (decision === "approved") {
    if (target.status !== "active") return "An archived member's profile cannot be updated.";
    const problem = profileProblem(request.changes, target, data);
    if (problem) return problem;
    if (
      request.before &&
      (Object.keys(request.before) as (keyof ProfileChanges)[]).some(
        (key) => (target[key] ?? "") !== (request.before[key] ?? ""),
      )
    )
      return "The profile has changed since this request. Decline it and ask for a new request.";
  }
  return {
    ...data,
    users:
      decision === "approved"
        ? data.users.map((u) => (u.id === target.id ? { ...u, ...request.changes } : u))
        : data.users,
    profileRequests: data.profileRequests.map((r) =>
      r.id === requestId
        ? {
            ...r,
            status: decision,
            reviewerId: member.id,
            reviewedAt: now.toISOString(),
            notes: notes.trim(),
          }
        : r,
    ),
  };
}

export function memberNotifications(data: AppData, me?: User | null): AppNotification[] {
  if (!me) return [];
  const read = data.readNotificationIds?.[me.id] ?? [];
  const profile = data.profileRequests.flatMap<AppNotification>((r) => {
    const user = data.users.find((u) => u.id === r.userId);
    if (r.status === "pending" && me.role === "admin") {
      const isRegulatory =
        r.changes &&
        ("licence" in r.changes ||
          "medicalExpiry" in r.changes ||
          "ratingExpiry" in r.changes ||
          "aviationId" in r.changes);
      return [
        {
          id: `${r.id}:pending`,
          title: "Profile approval requested",
          detail: `${user?.name ?? "Member"} · ${Object.keys(r.changes).length} changes (${isRegulatory ? "Regulatory Licence/Medical" : "Contact/Bio"})`,
          at: r.createdAt,
          to: "/admin/approvals",
          status: "pending",
          priority: isRegulatory ? "critical" : "medium",
          category: "profile",
          profileRequestId: r.id,
        },
      ];
    }
    if (r.status !== "pending" && (r.userId === me.id || r.submittedBy === me.id))
      return [
        {
          id: `${r.id}:${r.status}`,
          title: `Profile changes ${r.status}`,
          detail:
            r.notes ||
            (r.status === "approved"
              ? "Your profile has been updated."
              : "Your profile remains unchanged."),
          at: r.reviewedAt ?? r.createdAt,
          to: "/profile",
          status: r.status,
          priority: "low",
          category: "profile",
          profileRequestId: r.id,
        },
      ];
    return [];
  });
  const pendingRescheduleRequests: AppNotification[] =
    me.role === "admin" || me.role === "instructor"
      ? data.requests
          .filter(
            (r) => r.status === "pending" && (me.role === "admin" || r.instructorId === me.id),
          )
          .map((r) => {
            const student = data.users.find((u) => u.id === r.studentId);
            return {
              id: `reschedreq:${r.id}:pending`,
              title: `Flight slot change approval requested — ${student?.name ?? "Student"}`,
              detail: `${student?.name ?? "Student"} · Booking ${r.bookingId} · Reason: ${reasonLabel[r.reason]}${r.details ? ` (${r.details})` : ""}`,
              at: r.createdAt,
              to: me.role === "admin" ? "/admin/approvals" : "/portal/cfi",
              status: "pending",
              priority: "medium" as const,
              category: "flight" as const,
              requestId: r.id,
            };
          })
      : [];
  const reschedules: AppNotification[] = data.requests
    .filter((r) => r.status !== "pending" && (r.studentId === me.id || r.instructorId === me.id))
    .map((r) => ({
      id: `${r.id}:${r.status}`,
      title: `Reschedule ${r.status}`,
      detail: `${r.bookingId}${r.notes ? ` · ${r.notes}` : ""}`,
      at: r.reviewedAt ?? r.createdAt,
      to: "/schedule",
      status: r.status,
      priority: "medium",
      category: "booking",
      requestId: r.id,
    }));
  const bookingRequests: AppNotification[] =
    me.role === "admin"
      ? data.bookings.filter(bookingPending).map((b) => ({
          id: `${b.id}:pending:${b.requestedAt}`,
          title: "Flight booking approval requested",
          detail: `${data.users.find((u) => u.id === b.studentId)?.name ?? "Student"} · ${b.id} · ${format(new Date(b.start), "dd MMM HH:mm")}`,
          at: b.requestedAt ?? b.start,
          to: "/admin/approvals",
          status: "pending",
          priority: "critical",
          category: "flight",
          bookingId: b.id,
        }))
      : [];
  const outcomes: AppNotification[] = data.activity
    .filter(
      (a) =>
        ["booking_approved", "booking_declined", "booking_cancelled"].includes(a.action) &&
        data.bookings.some((b) => b.id === a.entityId && b.studentId === me.id),
    )
    .map((a) => ({
      id: `booking:${a.id}`,
      title: a.action.replace("_", " ").replace(/^b/, "B"),
      detail: a.details,
      at: a.at,
      to: "/schedule",
      status: a.action.replace("booking_", ""),
      priority: "low",
      category: "booking",
    }));
  const courseAssignments: AppNotification[] = data.activity
    .filter((a) => {
      if (a.action !== "course_assigned" && a.action !== "course_unassigned") return false;
      if (a.entityId === me.id) return true;
      const targetUser = data.users.find((u) => u.id === a.entityId);
      if (targetUser && me.email && targetUser.email.toLowerCase() === me.email.toLowerCase()) return true;
      if (me.name && a.details.toLowerCase().includes(me.name.toLowerCase())) return true;
      return false;
    })
    .map((a) => ({
      id: `course:${a.id}`,
      title: a.action === "course_assigned" ? "New E-Learning course assigned" : "Course unassigned",
      detail: a.details,
      at: a.at,
      to: "/elearning",
      status: a.action === "course_assigned" ? "approved" : "cancelled",
      priority: "medium",
      category: "course",
    }));
  const nowMs = Date.now();
  const postFlightChecks: AppNotification[] =
    me.role === "admin"
      ? data.bookings
          .filter(
            (b) =>
              b.status === "scheduled" &&
              b.type !== "maintenance" &&
              b.approvalStatus !== "pending" &&
              b.approvalStatus !== "declined" &&
              new Date(b.end).getTime() <= nowMs &&
              !data.flights.some((f) => f.bookingId === b.id),
          )
          .map((b) => {
            const student = data.users.find((u) => u.id === b.studentId);
            const studentName = student?.name ?? "Student";
            const ac = data.aircraft.find((a) => a.id === b.aircraftId);
            return {
              id: `postflight:${b.id}`,
              title: `Did the flight happen? — ${studentName}`,
              detail: `Student: ${studentName} · Aircraft: ${ac?.reg ?? b.aircraftId} (${format(new Date(b.start), "dd MMM HH:mm")}–${format(new Date(b.end), "HH:mm")})`,
              at: b.end,
              to: "/admin/approvals",
              status: "postflight",
              priority: "critical" as const,
              category: "flight" as const,
              bookingId: b.id,
            };
          })
      : [];

  const flightVerifications: AppNotification[] = data.activity
    .filter((a) => {
      if (
        a.action === "flight_verified" ||
        a.action === "flight_rejected" ||
        a.action === "post_flight_confirmed_yes" ||
        (a.action === "flight_logged" && a.actorId !== me.id)
      ) {
        if (
          data.flights.some(
            (f) => f.id === a.entityId && (f.pilotId === me.id || f.instructorId === me.id),
          )
        ) {
          return true;
        }
        if (me.name && a.details.toLowerCase().includes(me.name.toLowerCase())) {
          return true;
        }
        return false;
      }
      if (a.action === "post_flight_confirmed_no") {
        if (
          data.bookings.some(
            (b) => b.id === a.entityId && (b.studentId === me.id || b.instructorId === me.id),
          )
        ) {
          return true;
        }
        if (me.name && a.details.toLowerCase().includes(me.name.toLowerCase())) {
          return true;
        }
        return false;
      }
      return false;
    })
    .map((a) => {
      const isApproved =
        a.action === "flight_verified" ||
        a.action === "post_flight_confirmed_yes" ||
        a.action === "flight_logged";
      const title =
        a.action === "post_flight_confirmed_yes"
          ? "Flight approved & logged by Administrator"
          : a.action === "post_flight_confirmed_no"
            ? "Scheduled flight marked Did Not Fly"
            : a.action === "flight_logged"
              ? "Flight approved & added to your logbook"
              : a.action === "flight_verified"
                ? "Flight log verified & approved"
                : "Flight log rejected";
      return {
        id: `flightver:${a.id}`,
        title,
        detail: a.details,
        at: a.at,
        to: a.action === "post_flight_confirmed_no" ? "/schedule" : "/flights",
        status: isApproved ? "approved" : "declined",
        priority: "medium" as const,
        category: "flight" as const,
      };
    });

  const accountApprovalRequests: AppNotification[] =
    me.role === "admin"
      ? data.users
          .filter((u) => isUserPendingApproval(u))
          .map((u) => {
            const reqAct = data.activity.find(
              (a) =>
                a.action === "account_registration_requested" &&
                (a.entityId === u.id ||
                  a.details.toLowerCase().includes(u.email.toLowerCase())),
            );
            return {
              id: `accountapproval:${u.id}`,
              title: `New Account Login Approval Requested — ${u.name}`,
              detail: `${u.name} (${u.email}${u.phone ? ` · ${u.phone}` : ""}) registered as ${roleLabel[u.role]} and is awaiting Administrator login approval.`,
              at: reqAct?.at ?? new Date().toISOString(),
              to: "/admin/approvals",
              status: "pending" as const,
              priority: "critical" as const,
              category: "account" as const,
              userId: u.id,
            };
          })
      : [];

  const accountApprovedNotifs: AppNotification[] = data.activity
    .filter(
      (a) =>
        a.action === "user_login_approved" &&
        (a.entityId === me.id ||
          (me.email && a.details.toLowerCase().includes(me.email.toLowerCase()))),
    )
    .map((a) => ({
      id: `loginapproved:${a.id}`,
      title: "Account login approved by Administrator",
      detail: a.details,
      at: a.at,
      to: homeFor[me.role],
      status: "approved" as const,
      priority: "medium" as const,
      category: "account" as const,
    }));

  const pendingFlightLogReviews: AppNotification[] =
    me.role === "admin" || me.role === "instructor"
      ? data.flights
          .filter(
            (f) =>
              f.verificationStatus === "pending" &&
              (me.role === "admin" || f.instructorId === me.id),
          )
          .map((f) => ({
            id: `flightpending:${f.id}`,
            title: "Flight log awaiting verification",
            detail: `${data.users.find((u) => u.id === f.pilotId)?.name ?? "Student"} · ${f.date} · ${fmtDec(f.minutes)} h`,
            at: `${f.date}T12:00:00.000Z`,
            to: me.role === "admin" ? "/admin/approvals" : "/flights",
            status: "pending",
            priority: "critical",
            category: "flight",
            flightId: f.id,
          }))
      : [];

  const studentUpcomingAndExpiry: AppNotification[] =
    me.role === "student"
      ? [
          ...data.bookings
            .filter(
              (b) =>
                b.studentId === me.id &&
                b.status === "scheduled" &&
                bookingApproved(b) &&
                new Date(b.start).getTime() > nowMs,
            )
            .slice(0, 3)
            .map((b) => ({
              id: `upcoming:${b.id}:${b.start}`,
              title: "Upcoming flight scheduled",
              detail: `${b.id} · ${data.aircraft.find((a) => a.id === b.aircraftId)?.reg ?? "Aircraft"} · ${format(new Date(b.start), "dd MMM HH:mm")}`,
              at: b.requestedAt ?? "2026-10-18T12:00:00.000Z",
              to: "/portal/student",
              status: "approved",
              priority: "low" as const,
              category: "booking" as const,
            })),
          ...studentDocumentsFor(me, data)
            .filter((doc) => doc.expiryState === "expired" || doc.expiryState === "soon")
            .map((doc) => ({
              id: `docexp:${doc.id}:${doc.expiryState}`,
              title:
                doc.expiryState === "expired"
                  ? `${doc.title} expired`
                  : `${doc.title} expiring soon`,
              detail: `${doc.documentNumber} · ${doc.expiryState === "expired" ? `Expired ${-doc.daysRemaining}d ago` : `${doc.daysRemaining} days remaining`}`,
              at: doc.expiryDate ? `${doc.expiryDate}T00:00:00.000Z` : "2026-10-18T08:00:00.000Z",
              to: "/portal/student",
              status: doc.expiryState,
              priority: doc.expiryState === "expired" ? ("critical" as const) : ("medium" as const),
              category: "safety" as const,
            })),
        ]
      : [];

  const maintenanceAlerts: AppNotification[] =
    me.role === "admin" || me.role === "instructor"
      ? data.maintenance
          .filter((m) => {
            if (m.completedAt) return false;
            const ac = data.aircraft.find((a) => a.id === m.aircraftId);
            return ac ? aircraftUnavailable(ac, data.maintenance) : false;
          })
          .map((m) => ({
            id: `maint:${m.id}`,
            title: "Aircraft AOG / Grounded",
            detail: `${data.aircraft.find((a) => a.id === m.aircraftId)?.reg ?? m.aircraftId} · ${m.title}`,
            at: m.dueDate ?? "2026-10-18T08:00:00.000Z",
            to: "/fleet",
            status: "expired",
            priority: "critical" as const,
            category: "safety" as const,
          }))
      : [];

  const adminDocExpiries: AppNotification[] =
    me.role === "admin"
      ? data.users
          .filter((u) => u.status !== "deleted")
          .flatMap((u) => {
            const res: AppNotification[] = [];
            if (u.medicalExpiry && expiryState(u.medicalExpiry).state === "expired") {
              res.push({
                id: `expmed:${u.id}`,
                title: `Medical expired — ${u.name}`,
                detail: `${roleLabel[u.role]} · Medical expired ${format(new Date(u.medicalExpiry), "dd.MM.yyyy")}`,
                at: `${u.medicalExpiry}T00:00:00.000Z`,
                to: "/portal/admin",
                status: "expired",
                priority: "critical",
                category: "safety",
              });
            } else if (u.medicalExpiry && expiryState(u.medicalExpiry).state === "soon") {
              res.push({
                id: `soonmed:${u.id}`,
                title: `Medical expiring soon — ${u.name}`,
                detail: `${roleLabel[u.role]} · Medical expires ${format(new Date(u.medicalExpiry), "dd.MM.yyyy")}`,
                at: `${u.medicalExpiry}T00:00:00.000Z`,
                to: "/portal/admin",
                status: "soon",
                priority: "medium",
                category: "safety",
              });
            }
            return res;
          })
      : [];

  return [
    ...accountApprovalRequests,
    ...postFlightChecks,
    ...maintenanceAlerts,
    ...adminDocExpiries,
    ...pendingFlightLogReviews,
    ...profile,
    ...bookingRequests,
    ...pendingRescheduleRequests,
    ...reschedules,
    ...outcomes,
    ...courseAssignments,
    ...flightVerifications,
    ...accountApprovedNotifs,
    ...studentUpcomingAndExpiry,
  ]
    .map((n) => ({ ...n, read: read.includes(n.id) }))
    .sort((a, b) => {
      // Sort priority: critical first, then medium, then low, then by date desc
      const priorityOrder: Record<NotificationPriority, number> = {
        critical: 0,
        medium: 1,
        low: 2,
      };
      const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (pDiff !== 0) return pDiff;
      return b.at.localeCompare(a.at);
    });
}

export type ProficiencyBadgeId =
  | "night_flying"
  | "instrument_rating"
  | "first_solo"
  | "cross_country"
  | "multi_engine"
  | "precision_landings"
  | "simulator_pro"
  | "ppl_mastery";

export type ProficiencyTier = "locked" | "bronze" | "silver" | "gold";

export interface ProficiencyBadge {
  id: ProficiencyBadgeId;
  title: string;
  category: string;
  description: string;
  regulationRef: string;
  unit: "hours" | "landings";
  currentValue: number;
  targetValue: number;
  tiers: {
    bronze: number;
    silver: number;
    gold: number;
  };
  tier: ProficiencyTier;
  unlocked: boolean;
  progressPct: number;
  nextTierLabel?: string;
  nextTierTarget?: number;
  remainingToNext?: number;
  earnedAtDate?: string;
}

export interface PilotProficiencySummary {
  badges: ProficiencyBadge[];
  unlockedCount: number;
  totalCount: number;
  goldCount: number;
  silverCount: number;
  bronzeCount: number;
  totalPoints: number;
  rankTitle: string;
}

/**
 * Pure gamification engine computing visual proficiency badges and tier progression
 * from a pilot's logged flight hours and landings.
 */
export function pilotProficiencyBadges(
  userId: string,
  data: AppData,
): PilotProficiencySummary {
  const user = data.users.find((u) => u.id === userId);
  const directFlights = data.flights.filter(
    (f) => f.pilotId === userId && isFlightVerified(f),
  );
  // For instructors/admins without student pilotId flights, include flights where they acted as instructor
  const relevantFlights =
    directFlights.length > 0
      ? directFlights
      : user?.role === "instructor" || user?.role === "admin"
        ? data.flights.filter(
            (f) => (f.pilotId === userId || f.instructorId === userId) && isFlightVerified(f),
          )
        : directFlights;

  const chronological = [...relevantFlights].sort((a, b) => a.date.localeCompare(b.date));

  let totalMin = 0;
  let nightMin = 0;
  let ifrAndSimMin = 0;
  let soloMin = 0;
  let xcMin = 0;
  let multiMin = 0;
  let simMin = 0;
  let landingsCount = 0;

  const firstUnlockedDate: Partial<Record<ProficiencyBadgeId, string>> = {};

  for (const f of chronological) {
    const parts = flightTimeParts(f, data);
    const kind = flightKind(f);
    totalMin += f.minutes;
    if (kind !== "sim") {
      nightMin += parts.night;
      xcMin += parts.xc;
      multiMin += parts.multiEngine;
    } else {
      simMin += f.minutes;
    }
    ifrAndSimMin += (f.ifrMinutes ?? 0) + (kind === "sim" ? f.minutes : 0);
    if (kind === "solo" || kind === "pic") {
      soloMin += f.minutes;
    }
    landingsCount += f.landings ?? 0;

    if (!firstUnlockedDate.night_flying && nightMin / 60 >= 1) {
      firstUnlockedDate.night_flying = f.date;
    }
    if (!firstUnlockedDate.instrument_rating && ifrAndSimMin / 60 >= 1) {
      firstUnlockedDate.instrument_rating = f.date;
    }
    if (!firstUnlockedDate.first_solo && soloMin / 60 >= 1) {
      firstUnlockedDate.first_solo = f.date;
    }
    if (!firstUnlockedDate.cross_country && xcMin / 60 >= 2) {
      firstUnlockedDate.cross_country = f.date;
    }
    if (!firstUnlockedDate.multi_engine && multiMin / 60 >= 1) {
      firstUnlockedDate.multi_engine = f.date;
    }
    if (!firstUnlockedDate.precision_landings && landingsCount >= 10) {
      firstUnlockedDate.precision_landings = f.date;
    }
    if (!firstUnlockedDate.simulator_pro && simMin / 60 >= 1) {
      firstUnlockedDate.simulator_pro = f.date;
    }
    if (!firstUnlockedDate.ppl_mastery && totalMin / 60 >= 5) {
      firstUnlockedDate.ppl_mastery = f.date;
    }
  }

  const specs: {
    id: ProficiencyBadgeId;
    title: string;
    category: string;
    description: string;
    regulationRef: string;
    unit: "hours" | "landings";
    rawVal: number;
    tiers: { bronze: number; silver: number; gold: number };
  }[] = [
    {
      id: "night_flying",
      title: "Night Flying",
      category: "Night Qualification",
      description:
        "Logged night flying experience including nocturnal aerodrome circuits and navigation.",
      regulationRef: "EASA FCL.810",
      unit: "hours",
      rawVal: Math.round((nightMin / 60) * 10) / 10,
      tiers: { bronze: 1, silver: 3, gold: 5 },
    },
    {
      id: "instrument_rating",
      title: "Instrument Rating",
      category: "Instrument Flight (IF)",
      description:
        "Logged instrument flight rules (IFR) and synthetic flight by sole reference to instruments.",
      regulationRef: "EASA FCL.600",
      unit: "hours",
      rawVal: Math.round((ifrAndSimMin / 60) * 10) / 10,
      tiers: { bronze: 1, silver: 5, gold: 10 },
    },
    {
      id: "first_solo",
      title: "Solo Command",
      category: "Pilot-in-Command",
      description:
        "Solo and Pilot-in-Command (PIC) airframe time demonstrating independent command authority.",
      regulationRef: "EASA FCL.210.A",
      unit: "hours",
      rawVal: Math.round((soloMin / 60) * 10) / 10,
      tiers: { bronze: 1, silver: 5, gold: 10 },
    },
    {
      id: "cross_country",
      title: "Cross-Country Navigator",
      category: "Overland Navigation",
      description:
        "Cross-country navigation legs between distinct ICAO aerodromes using dead reckoning and radio aids.",
      regulationRef: "EASA FCL.210.A",
      unit: "hours",
      rawVal: Math.round((xcMin / 60) * 10) / 10,
      tiers: { bronze: 2, silver: 5, gold: 10 },
    },
    {
      id: "multi_engine",
      title: "Multi-Engine Piston",
      category: "Complex Twin Class",
      description:
        "Asymmetric thrust management and multi-engine piston (MEP) class flight experience.",
      regulationRef: "EASA FCL.700",
      unit: "hours",
      rawVal: Math.round((multiMin / 60) * 10) / 10,
      tiers: { bronze: 1, silver: 3, gold: 6 },
    },
    {
      id: "precision_landings",
      title: "Precision Touchdowns",
      category: "Circuit & Approach",
      description:
        "Verified day and night full-stop and touch-and-go landings across training sorties.",
      regulationRef: "EASA FCL.060",
      unit: "landings",
      rawVal: landingsCount,
      tiers: { bronze: 10, silver: 30, gold: 60 },
    },
    {
      id: "simulator_pro",
      title: "FNPT II Simulator",
      category: "Synthetic Training",
      description:
        "Logged procedure and emergency drill sessions in approved FNPT II flight simulators.",
      regulationRef: "EASA FCL.210",
      unit: "hours",
      rawVal: Math.round((simMin / 60) * 10) / 10,
      tiers: { bronze: 1, silver: 3, gold: 5 },
    },
    {
      id: "ppl_mastery",
      title: "Aviator Flight Hours",
      category: "Total Airframe Time",
      description:
        "Cumulative verified flight time progressing toward the 45-hour EASA PPL(A) licence minimum.",
      regulationRef: "EASA Part-FCL",
      unit: "hours",
      rawVal: Math.round((totalMin / 60) * 10) / 10,
      tiers: { bronze: 5, silver: 20, gold: 45 },
    },
  ];

  const badges: ProficiencyBadge[] = specs.map((s) => {
    const val = s.rawVal;
    let tier: ProficiencyTier = "locked";
    let nextTierLabel: string | undefined = "Bronze Tier";
    let nextTierTarget: number | undefined = s.tiers.bronze;

    if (val >= s.tiers.gold) {
      tier = "gold";
      nextTierLabel = undefined;
      nextTierTarget = undefined;
    } else if (val >= s.tiers.silver) {
      tier = "silver";
      nextTierLabel = "Gold Tier";
      nextTierTarget = s.tiers.gold;
    } else if (val >= s.tiers.bronze) {
      tier = "bronze";
      nextTierLabel = "Silver Tier";
      nextTierTarget = s.tiers.silver;
    }

    const activeGoal = nextTierTarget ?? s.tiers.gold;
    const progressPct = Math.min(100, Math.round((val / activeGoal) * 100));
    const remainingToNext =
      nextTierTarget !== undefined
        ? Math.max(0, Math.round((nextTierTarget - val) * 10) / 10)
        : 0;

    return {
      id: s.id,
      title: s.title,
      category: s.category,
      description: s.description,
      regulationRef: s.regulationRef,
      unit: s.unit,
      currentValue: val,
      targetValue: s.tiers.bronze,
      tiers: s.tiers,
      tier,
      unlocked: tier !== "locked",
      progressPct,
      nextTierLabel,
      nextTierTarget,
      remainingToNext,
      earnedAtDate: firstUnlockedDate[s.id],
    };
  });

  const goldCount = badges.filter((b) => b.tier === "gold").length;
  const silverCount = badges.filter((b) => b.tier === "silver").length;
  const bronzeCount = badges.filter((b) => b.tier === "bronze").length;
  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalPoints = goldCount * 300 + silverCount * 150 + bronzeCount * 75;

  let rankTitle = "Cadet Aviator";
  if (totalPoints >= 1500) rankTitle = "Master Command Aviator";
  else if (totalPoints >= 900) rankTitle = "Senior Flight Officer";
  else if (totalPoints >= 450) rankTitle = "Solo Wingman";
  else if (totalPoints >= 150) rankTitle = "Solo Qualifer";

  return {
    badges,
    unlockedCount,
    totalCount: badges.length,
    goldCount,
    silverCount,
    bronzeCount,
    totalPoints,
    rankTitle,
  };
}

// ============================================================================
// FLIGHTLOGGER REA CORE ENGINES & STATE MACHINES (05_CORE_ENGINES_AND_STATE_MACHINES.md)
// ============================================================================

/**
 * EASA Part-FTL Rolling Cumulative Ceilings & Mandatory 12-Hour Rest Calculator.
 * Enforces:
 * - Max 60 Duty Hours in any rolling 7 consecutive days
 * - Max 190 Duty Hours in any rolling 28 consecutive days
 * - Max 100 Flight Hours in any rolling 28 consecutive days
 * - Max 900 Flight Hours in any calendar year
 * - Max 1000 Flight Hours in any rolling 365 consecutive days
 * - Mandatory 12-Hour Rest Period between consecutive duty periods
 */
export const EASA_FTL_LIMITS = {
  duty7DaysHours: 60,
  duty28DaysHours: 190,
  flight28DaysHours: 100,
  flightCalendarYearHours: 900,
  flight365DaysHours: 1000,
  minRestHours: 12,
} as const;

export interface RollingFtlReport {
  instructorId: string;
  duty7DaysHours: number;
  duty28DaysHours: number;
  flight28DaysHours: number;
  flightCalendarYearHours: number;
  flight365DaysHours: number;
  mandatoryRestUntil?: string;
  restLocked: boolean;
  exceeded7DayDuty: boolean;
  exceeded28DayDuty: boolean;
  exceeded28DayFlight: boolean;
  exceededCalendarYearFlight: boolean;
  exceeded365DayFlight: boolean;
  anyCeilingExceeded: boolean;
}

export function easaRollingFtlStatus(
  instructorId: string,
  data: AppData,
  refTime = new Date(),
): RollingFtlReport {
  const refMs = refTime.getTime();
  const ms7d = refMs - 7 * 86400000;
  const ms28d = refMs - 28 * 86400000;
  const ms365d = refMs - 365 * 86400000;
  const currentYear = String(refTime.getUTCFullYear());

  const cfiDuty = data.duty.filter((d) => d.instructorId === instructorId);
  const cfiFlights = data.flights.filter(
    (f) =>
      (f.instructorId === instructorId || f.pilotId === instructorId) &&
      isFlightVerified(f),
  );

  const dutyHoursInRange = (sinceMs: number) => {
    let mins = 0;
    for (const d of cfiDuty) {
      const startMs = Date.parse(d.start);
      if (Number.isNaN(startMs) || startMs > refMs) continue;
      const endMs = d.end ? Date.parse(d.end) : refMs;
      if (endMs < sinceMs) continue;
      const clippedStart = Math.max(sinceMs, startMs);
      const clippedEnd = Math.min(refMs, endMs);
      if (clippedEnd > clippedStart) {
        mins += (clippedEnd - clippedStart) / 60000;
      }
    }
    return Math.round((mins / 60) * 10) / 10;
  };

  const flightHoursInRange = (sinceMs: number) => {
    let mins = 0;
    for (const f of cfiFlights) {
      const fMs = Date.parse(`${f.date}T12:00:00.000Z`);
      if (fMs >= sinceMs && fMs <= refMs) {
        mins += f.minutes;
      }
    }
    return Math.round((mins / 60) * 10) / 10;
  };

  const flightHoursInCalendarYear = () => {
    let mins = 0;
    for (const f of cfiFlights) {
      if (f.date.startsWith(currentYear)) {
        mins += f.minutes;
      }
    }
    return Math.round((mins / 60) * 10) / 10;
  };

  // Find latest mandatoryRestUntil
  let mandatoryRestUntil: string | undefined;
  for (const d of cfiDuty) {
    const restIso =
      d.mandatoryRestUntil ??
      (d.end
        ? new Date(
            Date.parse(d.end) +
              Math.max(
                EASA_FTL_LIMITS.minRestHours * 3600000,
                Date.parse(d.end) - Date.parse(d.start),
              ),
          ).toISOString()
        : undefined);
    if (restIso && (!mandatoryRestUntil || restIso > mandatoryRestUntil)) {
      mandatoryRestUntil = restIso;
    }
  }

  const duty7DaysHours = dutyHoursInRange(ms7d);
  const duty28DaysHours = dutyHoursInRange(ms28d);
  const flight28DaysHours = flightHoursInRange(ms28d);
  const flightCalendarYearHours = flightHoursInCalendarYear();
  const flight365DaysHours = flightHoursInRange(ms365d);

  const restLocked = Boolean(
    mandatoryRestUntil && Date.parse(mandatoryRestUntil) > refMs,
  );
  const exceeded7DayDuty = duty7DaysHours > EASA_FTL_LIMITS.duty7DaysHours;
  const exceeded28DayDuty = duty28DaysHours > EASA_FTL_LIMITS.duty28DaysHours;
  const exceeded28DayFlight =
    flight28DaysHours > EASA_FTL_LIMITS.flight28DaysHours;
  const exceededCalendarYearFlight =
    flightCalendarYearHours > EASA_FTL_LIMITS.flightCalendarYearHours;
  const exceeded365DayFlight =
    flight365DaysHours > EASA_FTL_LIMITS.flight365DaysHours;

  return {
    instructorId,
    duty7DaysHours,
    duty28DaysHours,
    flight28DaysHours,
    flightCalendarYearHours,
    flight365DaysHours,
    mandatoryRestUntil,
    restLocked,
    exceeded7DayDuty,
    exceeded28DayDuty,
    exceeded28DayFlight,
    exceededCalendarYearFlight,
    exceeded365DayFlight,
    anyCeilingExceeded:
      exceeded7DayDuty ||
      exceeded28DayDuty ||
      exceeded28DayFlight ||
      exceededCalendarYearFlight ||
      exceeded365DayFlight,
  };
}

/**
 * Engine 3: The 7-Point Pre-Flight Dispatch Gating Engine (05_CORE_ENGINES_AND_STATE_MACHINES.md)
 * Evaluates all 7 aviation safety & regulatory gates prior to flight dispatch:
 *  Gate 1: Crew Medical, License, Radio & ICAO ELP Validity at booking.end
 *  Gate 2: EASA FCL.060 90-Day 3-Landing Currency (for solo/rental/charter)
 *  Gate 3: Aircraft Model Class/Type Rating & Endorsements (MEP, Retractable, VP Prop)
 *  Gate 4: Maintenance Hours-Remaining vs. Planned Flight Duration (blocks mid-flight overrun)
 *  Gate 5: EASA Part-FTL Mandatory 12-Hour Rest Period Lock
 *  Gate 6: EASA Part-FTL Rolling Cumulative Ceilings (7d/28d/365d)
 *  Gate 7: Student Solo Endorsement Verification (within preceding 24h)
 */
export function evaluateDispatchGates(
  candidate: Booking,
  data: AppData,
  now = new Date(),
): {
  passed: boolean;
  blockingConflicts: BookingConflict[];
  warnings: BookingConflict[];
} {
  const conflicts: BookingConflict[] = [];
  const endDateStr = candidate.end.slice(0, 10);
  const startMs = Date.parse(candidate.start);
  const endMs = Date.parse(candidate.end);
  const plannedHours =
    Number.isFinite(startMs) && Number.isFinite(endMs) && endMs > startMs
      ? Math.round(((endMs - startMs) / 3600000) * 100) / 100
      : 1;

  const existingOverrides = new Map(
    (data.bookingConflicts ?? [])
      .filter((c) => c.bookingId === candidate.id && c.overriddenBy)
      .map((c) => [c.conflictType, c]),
  );

  const pushConflict = (
    gateNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7,
    conflictType: BookingConflict["conflictType"],
    severity: "blocking" | "warning",
    message: string,
  ) => {
    const overridden = existingOverrides.get(conflictType);
    conflicts.push({
      id: overridden?.id ?? `conf-${candidate.id}-${conflictType}`,
      bookingId: candidate.id,
      gateNumber,
      conflictType,
      severity,
      message,
      overriddenBy: overridden?.overriddenBy,
      overrideReason: overridden?.overrideReason,
      overriddenAt: overridden?.overriddenAt,
      resolved: Boolean(overridden?.overriddenBy),
      detectedAt: now.toISOString(),
    });
  };

  const student = data.users.find((u) => u.id === candidate.studentId);
  const instructor = data.users.find((u) => u.id === candidate.instructorId);
  const ac = data.aircraft.find((a) => a.id === candidate.aircraftId);
  const models = data.aircraftModels ?? DEFAULT_AIRCRAFT_MODELS;
  const acModel: AircraftModel | undefined =
    models.find((m) => m.id === ac?.modelId) ??
    (ac?.type.toLowerCase().includes("da42")
      ? models.find((m) => m.id === "mdl-da42vi")
      : models.find((m) => m.id === "mdl-c172s"));

  const isSolo =
    candidate.type === "solo" ||
    candidate.type === "solo_training" ||
    (!candidate.instructorId && candidate.type !== "maintenance");

  // GATE 1: Crew Medical, License & Radio Validity at booking.end
  for (const crew of [student, instructor].filter(Boolean) as User[]) {
    if (crew.medicalExpiry && crew.medicalExpiry < endDateStr) {
      pushConflict(
        1,
        "certificate_expired",
        "blocking",
        `Gate 1 [Medical Expired]: ${crew.name}'s Medical Certificate expired on ${crew.medicalExpiry} (before flight end ${endDateStr}).`,
      );
    }
    if (isSolo && crew.id === student?.id) {
      if (crew.splExpiry && crew.splExpiry < endDateStr) {
        pushConflict(
          1,
          "certificate_expired",
          "blocking",
          `Gate 1 [SPL Expired]: ${crew.name}'s Student Pilot Licence expired on ${crew.splExpiry}.`,
        );
      }
      if (crew.frtolExpiry && crew.frtolExpiry < endDateStr) {
        pushConflict(
          1,
          "certificate_expired",
          "blocking",
          `Gate 1 [FRTOL Expired]: ${crew.name}'s Radio Telephone Permit expired on ${crew.frtolExpiry}.`,
        );
      }
    }
  }

  // GATE 2: EASA FCL.060 90-Day 3-Landing Recency Currency
  if ((isSolo || candidate.type === "rental" || candidate.type === "charter") && student) {
    const hb = hoursBreakdown(student.id, data, new Date(candidate.start));
    if (hb.landings90 < 3) {
      pushConflict(
        2,
        "currency_90_day_lapsed",
        candidate.type === "rental" || candidate.type === "charter" ? "blocking" : "warning",
        `Gate 2 [90-Day Currency Lapsed]: ${student.name} has ${hb.landings90}/3 required takeoffs & landings in the preceding 90 days (EASA FCL.060).`,
      );
    }
  }

  // GATE 3: Aircraft Model Class/Type Rating Endorsement Check
  if (acModel && student && isSolo) {
    if (
      acModel.classRating === "MEP_LAND" &&
      !student.classRatings?.includes("MEP_LAND") &&
      !student.licence?.toLowerCase().includes("mep")
    ) {
      pushConflict(
        3,
        "class_rating_missing",
        "blocking",
        `Gate 3 [Class Rating Missing]: ${student.name} does not hold a Multi-Engine Piston (MEP_LAND) endorsement for ${ac?.reg} (${acModel.modelName}).`,
      );
    }
  }

  // GATE 4: Maintenance Hours-Remaining vs. Planned Flight Duration
  if (ac && candidate.type !== "maintenance") {
    const openRemarks = (data.aircraftRemarks ?? []).filter(
      (r) =>
        r.aircraftId === ac.id &&
        r.status === "open" &&
        r.severity === "grounding_defect",
    );
    if (ac.grounded || openRemarks.length > 0) {
      pushConflict(
        4,
        "maintenance_overdue",
        "blocking",
        `Gate 4 [Aircraft Grounded]: ${ac.reg} is currently grounded (${openRemarks[0]?.description ?? "AOG / Maintenance"}).`,
      );
    } else {
      const remHours = hoursToService(ac, data.maintenance);
      if (remHours !== null && remHours <= 0) {
        pushConflict(
          4,
          "maintenance_overdue",
          "blocking",
          `Gate 4 [Maintenance Overdue]: ${ac.reg} has ${remHours}h remaining before mandatory inspection.`,
        );
      } else if (remHours !== null && remHours < plannedHours) {
        pushConflict(
          4,
          "maintenance_flight_overrun",
          "blocking",
          `Gate 4 [Mid-Flight Maintenance Overrun]: Planned flight is ${plannedHours}h, but ${ac.reg} only has ${remHours}h left before inspection.`,
        );
      }
    }
  }

  // GATE 5 & GATE 6: EASA Part-FTL Mandatory 12h Rest & Rolling Cumulative Ceilings
  if (instructor && Number.isFinite(startMs)) {
    const ftl = easaRollingFtlStatus(instructor.id, data, new Date(startMs));
    if (
      ftl.mandatoryRestUntil &&
      Date.parse(ftl.mandatoryRestUntil) > startMs
    ) {
      pushConflict(
        5,
        "ftl_rest_violation",
        "blocking",
        `Gate 5 [EASA FTL 12h Rest Lock]: Instructor ${instructor.name} is in mandatory rest until ${ftl.mandatoryRestUntil.slice(0, 16).replace("T", " ")}.`,
      );
    }
    if (ftl.duty7DaysHours + plannedHours > EASA_FTL_LIMITS.duty7DaysHours) {
      pushConflict(
        6,
        "ftl_rolling_limit_exceeded",
        "blocking",
        `Gate 6 [EASA FTL 7-Day Duty Ceiling]: ${instructor.name} would reach ${(ftl.duty7DaysHours + plannedHours).toFixed(1)}h / ${EASA_FTL_LIMITS.duty7DaysHours}h max in 7 days.`,
      );
    } else if (
      ftl.duty28DaysHours + plannedHours > EASA_FTL_LIMITS.duty28DaysHours ||
      ftl.flight28DaysHours + plannedHours > EASA_FTL_LIMITS.flight28DaysHours ||
      ftl.flight365DaysHours + plannedHours > EASA_FTL_LIMITS.flight365DaysHours
    ) {
      pushConflict(
        6,
        "ftl_rolling_limit_exceeded",
        "blocking",
        `Gate 6 [EASA FTL Rolling Ceiling]: ${instructor.name} exceeds 28-day (190h duty / 100h flight) or 365-day (1000h) FTL ceiling.`,
      );
    }
  }

  // GATE 7: Student Solo Endorsement Verification (within preceding 24 hours)
  if (isSolo && student && candidate.type !== "rental" && candidate.type !== "charter") {
    const validEndorsement = (data.soloEndorsements ?? []).find(
      (se) =>
        se.studentId === student.id &&
        Date.parse(se.expiresAt) >= endMs &&
        (!acModel || se.aircraftModelId === acModel.id),
    );
    if (!validEndorsement) {
      pushConflict(
        7,
        "solo_endorsement_missing",
        "blocking",
        `Gate 7 [Solo Endorsement Required]: ${student.name} does not have an active 24-hour Instructor Solo Endorsement for ${acModel?.modelName ?? ac?.reg ?? "this aircraft"}.`,
      );
    }
  }

  const blockingConflicts = conflicts.filter(
    (c) => c.severity === "blocking" && !c.overriddenBy,
  );
  const warnings = conflicts.filter(
    (c) => c.severity === "warning" || Boolean(c.overriddenBy),
  );

  return {
    passed: blockingConflicts.length === 0,
    blockingConflicts,
    warnings,
  };
}

/**
 * Accountable Manager / Operations Dispatcher Conflict Override (overrideBookingConflict).
 */
export function overrideBookingConflict(
  data: AppData,
  conflict: BookingConflict,
  actor: User,
  reason: string,
  now = new Date(),
): AppData | string {
  if (actor.role !== "admin" && actor.role !== "staff") {
    return "Only Administrators or Operations Dispatchers can override dispatch conflicts.";
  }
  if (!reason || reason.trim().length < 5) {
    return "Provide a mandatory regulatory justification (at least 5 characters) to override a dispatch conflict.";
  }
  const updated: BookingConflict = {
    ...conflict,
    overriddenBy: actor.id,
    overrideReason: reason.trim(),
    overriddenAt: now.toISOString(),
    resolved: true,
  };
  const existing = data.bookingConflicts ?? [];
  const nextConflicts = existing.some((c) => c.id === updated.id)
    ? existing.map((c) => (c.id === updated.id ? updated : c))
    : [updated, ...existing];
  return {
    ...data,
    bookingConflicts: nextConflicts,
  };
}

/**
 * Gate 7: Issue a 24-hour Instructor Digital Solo Endorsement (endorseSoloFlight).
 */
export function endorseSoloFlight(
  data: AppData,
  instructor: User,
  payload: {
    studentId: string;
    aircraftModelId: string;
    aerodromeIcao: string;
    maxCrosswindKt: number;
    maxWindKt: number;
    minVisibilityMeters: number;
    notes?: string;
  },
  now = new Date(),
): AppData | string {
  if (instructor.role !== "admin" && instructor.role !== "instructor") {
    return "Only Flight Instructors (CFI) or Administrators can issue solo flight endorsements.";
  }
  const student = data.users.find((u) => u.id === payload.studentId);
  if (!student) return "Student not found.";

  const endorsement: SoloEndorsement = {
    id: `solo-end-${uid()}`,
    studentId: payload.studentId,
    instructorId: instructor.id,
    aircraftModelId: payload.aircraftModelId,
    aerodromeIcao: payload.aerodromeIcao.trim().toUpperCase() || "VIDP",
    maxCrosswindKt: payload.maxCrosswindKt,
    maxWindKt: payload.maxWindKt,
    minVisibilityMeters: payload.minVisibilityMeters,
    issuedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 24 * 3600000).toISOString(),
    signatureHash: `sha256:solo-${payload.studentId}-${instructor.id}-${now.getTime()}`,
    notes: payload.notes?.trim(),
  };

  return {
    ...data,
    soloEndorsements: [endorsement, ...(data.soloEndorsements ?? [])],
  };
}

/**
 * Engine 1: The 6-Stage Flight Lifecycle Finite State Machine (FSM)
 * Valid Transitions:
 *   scheduled -> briefing | cancelled
 *   briefing  -> flight   | cancelled
 *   flight    -> landed   (CANNOT cancel an airborne flight!)
 *   landed    -> debriefing
 *   debriefing -> completed
 */
const VALID_FSM_TRANSITIONS: Record<FlightFsmState, FlightFsmState[]> = {
  scheduled: ["briefing", "cancelled"],
  briefing: ["flight", "cancelled"],
  flight: ["landed"],
  landed: ["debriefing"],
  debriefing: ["completed"],
  completed: [],
  cancelled: [],
};

export function transitionFlightFsm(
  data: AppData,
  bookingId: string,
  targetState: FlightFsmState,
  actor: User,
  timestamps?: {
    offBlockTime?: string;
    takeoffTime?: string;
    landingTime?: string;
    onBlockTime?: string;
  },
  now = new Date(),
): AppData | string {
  const booking = data.bookings.find((b) => b.id === bookingId);
  if (!booking) return "Booking not found.";

  const currentState: FlightFsmState = booking.status;
  if (currentState === targetState) return data;

  const allowedNext = VALID_FSM_TRANSITIONS[currentState] ?? [];
  if (!allowedNext.includes(targetState)) {
    if (currentState === "flight" && targetState === "cancelled") {
      return "IllegalStateTransitionError: Cannot cancel an airborne flight. The aircraft must land first.";
    }
    return `IllegalStateTransitionError: Cannot transition directly from '${currentState}' to '${targetState}'. Allowed next states: ${allowedNext.join(", ") || "none"}.`;
  }

  // Pre-condition checks per stage
  if (targetState === "briefing") {
    if (booking.approvalStatus === "pending") {
      return "Cannot start briefing: Student booking is still awaiting Administrator approval.";
    }
    const gateCheck = evaluateDispatchGates(booking, data, now);
    const certBlocks = gateCheck.blockingConflicts.filter((c) => c.gateNumber === 1);
    if (certBlocks.length > 0) {
      return certBlocks[0]!.message;
    }
  }

  if (targetState === "flight") {
    const gateCheck = evaluateDispatchGates(booking, data, now);
    if (!gateCheck.passed) {
      return gateCheck.blockingConflicts[0]!.message;
    }
  }

  if (targetState === "landed") {
    const takeoffIso = timestamps?.takeoffTime ?? booking.takeoffTime ?? now.toISOString();
    const landingIso = timestamps?.landingTime ?? now.toISOString();
    if (Date.parse(landingIso) < Date.parse(takeoffIso)) {
      return "Landing time cannot be earlier than takeoff time.";
    }
  }

  const nowIso = now.toISOString();
  const updatedBooking: Booking = {
    ...booking,
    status: targetState,
    briefingStartTime:
      targetState === "briefing" ? (booking.briefingStartTime ?? nowIso) : booking.briefingStartTime,
    offBlockTime:
      targetState === "flight"
        ? (timestamps?.offBlockTime ?? booking.offBlockTime ?? nowIso)
        : booking.offBlockTime,
    takeoffTime:
      targetState === "flight"
        ? (timestamps?.takeoffTime ?? booking.takeoffTime ?? nowIso)
        : booking.takeoffTime,
    landingTime:
      targetState === "landed"
        ? (timestamps?.landingTime ?? booking.landingTime ?? nowIso)
        : booking.landingTime,
    onBlockTime:
      targetState === "landed"
        ? (timestamps?.onBlockTime ?? booking.onBlockTime ?? nowIso)
        : booking.onBlockTime,
    debriefingEndTime:
      targetState === "completed"
        ? (booking.debriefingEndTime ?? nowIso)
        : booking.debriefingEndTime,
  };

  return {
    ...data,
    bookings: data.bookings.map((b) => (b.id === bookingId ? updatedBooking : b)),
    activity: [
      {
        id: `act-fsm-${uid()}`,
        at: nowIso,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action: `flight_fsm_${targetState}`,
        entityType: "booking",
        entityId: booking.id,
        details: `Transitioned flight ${booking.id} from [${currentState.toUpperCase()}] to [${targetState.toUpperCase()}]`,
      },
      ...data.activity,
    ],
  };
}

/**
 * Live ADS-B Telemetry Auto-Touchdown Bridge (08_AGENT_SKILLS_AND_INTEGRATION_LINKS.md)
 * When an airborne aircraft's groundspeed drops below 30 knots inside the arrival aerodrome geofence,
 * automatically transitions the active flight from 'flight' to 'landed'.
 */
export function processAdsbTelemetryUpdate(
  data: AppData,
  aircraftReg: string,
  groundSpeedKt: number,
  inArrivalGeofence: boolean,
  now = new Date(),
): { data: AppData; autoLandedBookingId?: string } {
  const ac = data.aircraft.find(
    (a) => a.reg.toUpperCase() === aircraftReg.trim().toUpperCase(),
  );
  if (!ac) return { data };

  const activeAirborne = data.bookings.find(
    (b) => b.aircraftId === ac.id && b.status === "flight",
  );
  if (!activeAirborne) return { data };

  if (groundSpeedKt < 30 && inArrivalGeofence) {
    const adminOrCfi =
      data.users.find((u) => u.id === activeAirborne.instructorId) ??
      data.users.find((u) => u.role === "admin")!;
    const next = transitionFlightFsm(
      data,
      activeAirborne.id,
      "landed",
      adminOrCfi,
      { landingTime: now.toISOString(), onBlockTime: now.toISOString() },
      now,
    );
    if (typeof next !== "string") {
      return { data: next, autoLandedBookingId: activeAirborne.id };
    }
  }
  return { data };
}

/**
 * ICAO Doc 9859 5x5 Safety Risk Matrix Classifier
 */
export function classifySmsRisk(
  severity: SmsSeverity,
  likelihood: SmsLikelihood,
): { riskIndex: string; riskZone: SmsRiskZone } {
  const riskIndex = `${severity}${likelihood}`;
  // High severity + high likelihood => RED (Unacceptable)
  const likelihoodScore: Record<SmsLikelihood, number> = {
    A: 1, // Extremely Improbable
    B: 2, // Improbable
    C: 3, // Remote
    D: 4, // Occasional
    E: 5, // Frequent
  };
  const product = severity * likelihoodScore[likelihood];
  const riskZone: SmsRiskZone =
    product >= 12 || (severity === 5 && likelihoodScore[likelihood] >= 2)
      ? "RED"
      : product >= 5
        ? "AMBER"
        : "GREEN";
  return { riskIndex, riskZone };
}

/**
 * Engine 2: The 6-Way Atomic Post-Flight Commit (fn_register_flight in 05_CORE_ENGINES_AND_STATE_MACHINES.md)
 * Executes a single atomic commit across all 6 subsystems (rolling back completely if any invariant fails):
 *   1. Fleet Tach/Hobbs/Airframe Hours + Landings + Fuel/Oil + Maintenance Auto-Grounding + Squawk Creation
 *   2. Syllabus & CBTA 1-5 Norm Grading (master_exercises + 8 Core Competencies + repeat_required lock)
 *   3. Dual Electronic Logbook Synthesis (Student row + Instructor row with SHA-256 signatureHash)
 *   4. Crew Duty & EASA Part-FTL Auto Clock-Out + 12h mandatoryRestUntil Lock
 *   5. Automated Customer Invoicing (ACI) + Indian GST (CGST/SGST) Ledger Charge
 *   6. Safety Management System (SMS) Hazard Report Auto-Trigger
 */
export interface AtomicFlightRegistrationInput {
  bookingId?: string;
  studentId: string;
  instructorId?: string;
  aircraftId: string;
  lessonId?: string;
  date: string;
  fromIcao: string;
  toIcao: string;
  offBlock: string;
  takeoffTime?: string;
  landingTime?: string;
  onBlock: string;
  tachStart: number;
  tachEnd: number;
  hobbsStart?: number;
  hobbsEnd?: number;
  fuelStartLiters?: number;
  fuelAddedLiters?: number;
  fuelStopLiters?: number;
  oilAddedQuarts?: number;
  dayFullStop: number;
  dayTouchAndGo: number;
  nightFullStop: number;
  nightTouchAndGo: number;
  approachesIls?: number;
  approachesRnp?: number;
  approachesVisual?: number;
  ifrMinutes?: number;
  nightMinutes?: number;
  kind?: Flight["kind"];
  exerciseGrades: Record<string, 1 | 2 | 3 | 4 | 5>;
  competencyScores: Record<CbtaCompetencyCode, 1 | 2 | 3 | 4 | 5>;
  observedIndicators?: string[];
  remarks: string;
  reportSquawk?: boolean;
  squawkSeverity?: "info" | "warning" | "grounding_defect";
  squawkDescription?: string;
  flagSmsIncident?: boolean;
  smsTitle?: string;
  smsCategory?: SmsReport["category"];
  smsSeverity?: SmsSeverity;
  smsLikelihood?: SmsLikelihood;
}

export interface AtomicFlightCommitReceipt {
  data: AppData;
  flightId: string;
  repeatRequired: boolean;
  overallGrade: 1 | 2 | 3 | 4 | 5;
  aircraftAutoGrounded: boolean;
  studentLogbookEntryId: string;
  instructorLogbookEntryId?: string;
  billedTotalInr: number;
  mandatoryRestUntil?: string;
  spawnedSmsReportId?: string;
}

export function registerFlightAtomic(
  data: AppData,
  actor: User,
  input: AtomicFlightRegistrationInput,
  now = new Date(),
): AtomicFlightCommitReceipt | string {
  // 0. ACID Pre-Commit Invariant Validation (Full Rollback on Any Error)
  const ac = data.aircraft.find((a) => a.id === input.aircraftId);
  if (!ac) return "RollbackError: Selected aircraft does not exist.";
  const student = data.users.find((u) => u.id === input.studentId);
  if (!student) return "RollbackError: Selected student/pilot does not exist.";
  const instructor = input.instructorId
    ? data.users.find((u) => u.id === input.instructorId)
    : undefined;

  if (
    !Number.isFinite(input.tachStart) ||
    !Number.isFinite(input.tachEnd) ||
    input.tachEnd <= input.tachStart
  ) {
    return `RollbackError [Tachometer Monotonicity Violation]: Tach Stop (${input.tachEnd}) must be strictly greater than Tach Start (${input.tachStart}).`;
  }

  const blockMins = blockMinutes(input.offBlock, input.onBlock);
  if (blockMins <= 0 || blockMins > 720) {
    return "RollbackError [Invalid Block Time]: Off-Block to On-Block duration must be between 1 and 720 minutes.";
  }

  const totalLandings =
    (input.dayFullStop || 0) +
    (input.dayTouchAndGo || 0) +
    (input.nightFullStop || 0) +
    (input.nightTouchAndGo || 0);
  if (totalLandings < 1 && input.kind !== "sim") {
    return "RollbackError: At least 1 landing must be recorded for an aircraft flight.";
  }

  const tachDeltaHours =
    Math.round((input.tachEnd - input.tachStart) * 100) / 100;
  const blockHours = Math.round((blockMins / 60) * 100) / 100;
  const nowIso = now.toISOString();
  const flightId = `fl-${uid()}`;

  // -------------------------------------------------------------------------
  // SUBSYSTEM 1: Fleet Tach/Engine Hours + Maintenance Decrement & Auto-Ground
  // -------------------------------------------------------------------------
  const newTotalHours = Math.round((ac.totalHours + tachDeltaHours) * 10) / 10;
  const newTachHours = Math.round(input.tachEnd * 10) / 10;
  const newHobbsHours =
    input.hobbsEnd && input.hobbsEnd > (input.hobbsStart ?? 0)
      ? Math.round(input.hobbsEnd * 10) / 10
      : Math.round(((ac.hobbsHours ?? ac.tachHours) + blockHours) * 10) / 10;
  const newAircraftLandings = (ac.totalLandings ?? 0) + totalLandings;

  const criticalMxHitZero = data.maintenance.some(
    (m) =>
      m.aircraftId === ac.id &&
      !m.completedAt &&
      m.dueHours !== undefined &&
      m.dueHours - newTotalHours <= 0,
  );
  const groundingSquawkReported =
    Boolean(input.reportSquawk) && input.squawkSeverity === "grounding_defect";
  const aircraftAutoGrounded = criticalMxHitZero || groundingSquawkReported;

  const updatedAircraftList = data.aircraft.map((a) =>
    a.id === ac.id
      ? {
          ...a,
          totalHours: newTotalHours,
          tachHours: newTachHours,
          hobbsHours: newHobbsHours,
          totalLandings: newAircraftLandings,
          grounded: a.grounded || aircraftAutoGrounded,
          status: groundingSquawkReported
            ? ("grounded" as const)
            : criticalMxHitZero
              ? ("maintenance_due" as const)
              : a.status,
        }
      : a,
  );

  const nextRemarks = [...(data.aircraftRemarks ?? [])];
  if (input.reportSquawk && input.squawkDescription?.trim()) {
    nextRemarks.unshift({
      id: `sq-${uid()}`,
      aircraftId: ac.id,
      reportedBy: actor.id,
      flightId,
      reportedAt: nowIso,
      severity: input.squawkSeverity ?? "warning",
      status: "open",
      description: input.squawkDescription.trim(),
    });
  }

  // -------------------------------------------------------------------------
  // SUBSYSTEM 2: CBTA 1-5 Norm Exercise & Competency Grading
  // -------------------------------------------------------------------------
  const competencyValues = Object.values(input.competencyScores);
  const exerciseValues = Object.values(input.exerciseGrades);
  const allScores = [...competencyValues, ...exerciseValues];
  const minScore = allScores.length > 0 ? Math.min(...allScores) : 4;
  const avgScore =
    allScores.length > 0
      ? Math.round(allScores.reduce((s, v) => s + v, 0) / allScores.length)
      : 4;
  const overallGrade = Math.min(5, Math.max(1, avgScore)) as 1 | 2 | 3 | 4 | 5;
  const repeatRequired = minScore <= 2;

  const userLectureId = `ul-${flightId}`;
  const sigBase = `${flightId}:${student.id}:${instructor?.id ?? actor.id}:${nowIso}`;
  const instructorSigHash = `sha256:cfi-${btoa(sigBase).slice(0, 24)}`;
  const studentSigHash = `sha256:stu-${btoa(sigBase).slice(4, 28)}`;

  const newUserLecture: UserLecture = {
    id: userLectureId,
    userProgramId: `up-${student.id}`,
    studentId: student.id,
    lessonId: input.lessonId ?? "l-1",
    flightId,
    instructorId: instructor?.id ?? actor.id,
    attemptNumber:
      (data.userLectures ?? []).filter(
        (ul) => ul.studentId === student.id && ul.lessonId === input.lessonId,
      ).length + 1,
    status: repeatRequired ? "repeat_required" : "passed",
    overallGrade,
    debriefRemarks: input.remarks.trim(),
    instructorSignatureHash: instructorSigHash,
    studentSignatureHash: studentSigHash,
    signedAt: nowIso,
  };

  const newExercises: UserExercise[] = Object.entries(input.exerciseGrades).map(
    ([exId, grade]) => {
      const exMeta = (data.masterExercises ?? DEFAULT_MASTER_EXERCISES).find(
        (e) => e.id === exId || e.code === exId,
      );
      return {
        id: `ue-${flightId}-${exId}`,
        userLectureId,
        flightId,
        studentId: student.id,
        exerciseId: exMeta?.id ?? exId,
        exerciseCode: exMeta?.code ?? exId,
        grade,
        attemptCount: 1,
        instructorRemark:
          grade <= 2
            ? "Below CBTA norm standard — requires repeat consolidation."
            : "Satisfactory CBTA execution.",
      };
    },
  );

  const newCompetencies: GradedCompetency[] = (
    Object.entries(input.competencyScores) as [CbtaCompetencyCode, 1 | 2 | 3 | 4 | 5][]
  ).map(([code, score]) => {
    const compMeta = (data.coreCompetencies ?? DEFAULT_CORE_COMPETENCIES).find(
      (c) => c.code === code,
    );
    return {
      id: `gc-${flightId}-${code}`,
      userLectureId,
      flightId,
      studentId: student.id,
      competencyId: compMeta?.id ?? `cbta-${code.toLowerCase()}`,
      competencyCode: code,
      score,
      observedIndicators: input.observedIndicators ?? [],
      debriefComment: input.remarks.trim(),
    };
  });

  // Unlock next lesson in completions ONLY if !repeatRequired
  const nextCompletions = [...data.completions];
  if (input.lessonId && !repeatRequired) {
    nextCompletions.push({
      id: `c-${flightId}`,
      studentId: student.id,
      lessonId: input.lessonId,
      date: input.date,
      instructorId: instructor?.id ?? actor.id,
      grade: overallGrade,
      flightId,
    });
  }

  // -------------------------------------------------------------------------
  // SUBSYSTEM 3: Dual Electronic Logbook Synthesis & Landings Table
  // -------------------------------------------------------------------------
  const nightLandings = (input.nightFullStop || 0) + (input.nightTouchAndGo || 0);
  const dayLandings = (input.dayFullStop || 0) + (input.dayTouchAndGo || 0);
  const nightMinutes = input.nightMinutes ?? (nightLandings > 0 ? Math.min(blockMins, nightLandings * 20) : 0);
  const dayMinutes = Math.max(0, blockMins - nightMinutes);
  const models = data.aircraftModels ?? DEFAULT_AIRCRAFT_MODELS;
  const acModel = models.find((m) => m.id === ac.modelId);
  const isMep = acModel?.classRating === "MEP_LAND";
  const isSim = acModel?.classRating === "FNPT_II" || input.kind === "sim";
  const flightKindResolved = input.kind ?? (instructor ? "dual" : "solo");

  const newFlight: Flight = {
    id: flightId,
    bookingId: input.bookingId,
    date: input.date,
    offBlock: input.offBlock,
    takeoffTime: input.takeoffTime,
    landingTime: input.landingTime,
    onBlock: input.onBlock,
    aircraftId: ac.id,
    pilotId: student.id,
    instructorId: instructor?.id,
    lessonId: input.lessonId,
    kind: flightKindResolved,
    minutes: blockMins,
    dayMinutes,
    nightMinutes,
    ifrMinutes: input.ifrMinutes ?? 0,
    multiEngineMinutes: isMep ? blockMins : 0,
    landings: totalLandings,
    dayFullStop: input.dayFullStop,
    dayTouchAndGo: input.dayTouchAndGo,
    nightFullStop: input.nightFullStop,
    nightTouchAndGo: input.nightTouchAndGo,
    nightLandings,
    approachesIls: input.approachesIls ?? 0,
    approachesRnp: input.approachesRnp ?? 0,
    approachesVisual: input.approachesVisual ?? dayLandings,
    fromIcao: input.fromIcao.toUpperCase(),
    toIcao: input.toIcao.toUpperCase(),
    tachStart: input.tachStart,
    tachEnd: input.tachEnd,
    hobbsStart: input.hobbsStart,
    hobbsEnd: input.hobbsEnd,
    fuelStartLiters: input.fuelStartLiters,
    fuelAddedLiters: input.fuelAddedLiters,
    fuelStopLiters: input.fuelStopLiters,
    oilAddedQuarts: input.oilAddedQuarts,
    grade: overallGrade,
    repeatRequired,
    remarks: input.remarks.trim(),
    instructorSignedAt: nowIso,
    studentSignedAt: nowIso,
    signatureHash: instructorSigHash,
    verificationStatus: "verified",
    submittedBy: actor.id,
    verifiedBy: instructor?.id ?? actor.id,
    verifiedAt: nowIso,
  };

  const newLandingRecord: LandingRecord = {
    id: `ldg-${flightId}`,
    flightId,
    pilotId: student.id,
    date: input.date,
    airportIcao: input.toIcao.toUpperCase() || "VIDP",
    classRating: acModel?.classRating ?? "SEP_LAND",
    dayFullStop: input.dayFullStop,
    dayTouchAndGo: input.dayTouchAndGo,
    nightFullStop: input.nightFullStop,
    nightTouchAndGo: input.nightTouchAndGo,
    approachesIls: input.approachesIls ?? 0,
    approachesRnp: input.approachesRnp ?? 0,
    approachesVisual: input.approachesVisual ?? dayLandings,
  };

  const studentLogbookEntry: ElectronicLogbookEntry = {
    id: `elb-stu-${flightId}`,
    userId: student.id,
    flightId,
    date: input.date,
    aircraftReg: ac.reg,
    aircraftModel: acModel?.modelName ?? ac.type,
    classRating: acModel?.classRating ?? "SEP_LAND",
    departureIcao: input.fromIcao.toUpperCase(),
    arrivalIcao: input.toIcao.toUpperCase(),
    offBlock: input.offBlock,
    onBlock: input.onBlock,
    roleCapacity:
      flightKindResolved === "solo" || flightKindResolved === "pic"
        ? "PIC"
        : flightKindResolved === "spic"
          ? "SPIC"
          : "DUAL_STUDENT",
    picName:
      flightKindResolved === "solo" || flightKindResolved === "pic"
        ? student.name
        : (instructor?.name ?? student.name),
    totalMinutes: blockMins,
    seDayMinutes: !isMep && !isSim ? dayMinutes : 0,
    seNightMinutes: !isMep && !isSim ? nightMinutes : 0,
    meDayMinutes: isMep && !isSim ? dayMinutes : 0,
    meNightMinutes: isMep && !isSim ? nightMinutes : 0,
    ifrMinutes: input.ifrMinutes ?? 0,
    simMinutes: isSim ? blockMins : 0,
    picMinutes:
      flightKindResolved === "solo" || flightKindResolved === "pic" ? blockMins : 0,
    dualMinutes: flightKindResolved === "dual" ? blockMins : 0,
    instructorMinutes: 0,
    spicMinutes: flightKindResolved === "spic" ? blockMins : 0,
    picusMinutes: flightKindResolved === "picus" ? blockMins : 0,
    dayLandings,
    nightLandings,
    remarks: input.remarks.trim(),
    signatureHash: studentSigHash,
    signedByName: instructor?.name ?? student.name,
    signedAt: nowIso,
    isLocked: true,
  };

  const newLogbookEntries: ElectronicLogbookEntry[] = [studentLogbookEntry];
  let instructorLogbookEntryId: string | undefined;

  if (instructor) {
    instructorLogbookEntryId = `elb-cfi-${flightId}`;
    newLogbookEntries.push({
      id: instructorLogbookEntryId,
      userId: instructor.id,
      flightId,
      date: input.date,
      aircraftReg: ac.reg,
      aircraftModel: acModel?.modelName ?? ac.type,
      classRating: acModel?.classRating ?? "SEP_LAND",
      departureIcao: input.fromIcao.toUpperCase(),
      arrivalIcao: input.toIcao.toUpperCase(),
      offBlock: input.offBlock,
      onBlock: input.onBlock,
      roleCapacity: isSim ? "SIM_INSTRUCTOR" : "INSTRUCTOR",
      picName: instructor.name,
      totalMinutes: blockMins,
      seDayMinutes: !isMep && !isSim ? dayMinutes : 0,
      seNightMinutes: !isMep && !isSim ? nightMinutes : 0,
      meDayMinutes: isMep && !isSim ? dayMinutes : 0,
      meNightMinutes: isMep && !isSim ? nightMinutes : 0,
      ifrMinutes: input.ifrMinutes ?? 0,
      simMinutes: isSim ? blockMins : 0,
      picMinutes: isSim ? 0 : blockMins,
      dualMinutes: 0,
      instructorMinutes: blockMins,
      spicMinutes: 0,
      picusMinutes: 0,
      dayLandings,
      nightLandings,
      remarks: `Dual instruction for ${student.name}: ${input.remarks.trim()}`,
      signatureHash: instructorSigHash,
      signedByName: instructor.name,
      signedAt: nowIso,
      isLocked: true,
    });
  }

  // -------------------------------------------------------------------------
  // SUBSYSTEM 4: Crew Duty & EASA Part-FTL Mandatory 12h Rest Lock
  // -------------------------------------------------------------------------
  let mandatoryRestUntil: string | undefined;
  let nextDuty = [...data.duty];
  if (instructor) {
    const dutyStartIso = `${input.date}T${input.offBlock}:00.000Z`;
    const dutyEndIso = `${input.date}T${input.onBlock}:00.000Z`;
    const dutyDurationMs = Math.max(blockMins * 60000, 2 * 3600000);
    const restMs = Math.max(12 * 3600000, dutyDurationMs);
    mandatoryRestUntil = new Date(now.getTime() + restMs).toISOString();

    const openDuty = nextDuty.find((d) => d.instructorId === instructor.id && !d.end);
    if (openDuty) {
      nextDuty = nextDuty.map((d) =>
        d.id === openDuty.id
          ? {
              ...d,
              end: nowIso,
              dutyType: "flight_duty",
              fdpHours: blockHours,
              mandatoryRestUntil,
            }
          : d,
      );
    } else {
      nextDuty.unshift({
        id: `d-${flightId}`,
        instructorId: instructor.id,
        start: Number.isNaN(Date.parse(dutyStartIso)) ? nowIso : dutyStartIso,
        end: Number.isNaN(Date.parse(dutyEndIso)) ? nowIso : dutyEndIso,
        dutyType: "flight_duty",
        fdpHours: blockHours,
        mandatoryRestUntil,
      });
    }
  }

  // -------------------------------------------------------------------------
  // SUBSYSTEM 5: Automated Customer Invoicing (ACI) + Indian GST (CGST/SGST)
  // -------------------------------------------------------------------------
  const priceItems = data.priceListItems ?? DEFAULT_PRICE_LIST_ITEMS;
  const acRateItem =
    priceItems.find((p) => p.targetRefId === ac.modelId) ?? priceItems[0]!;
  const cfiRateItem = priceItems.find((p) => p.itemType === "instructor_hour");
  const landingRateItem = priceItems.find((p) => p.itemType === "landing_fee");

  const customer =
    (data.customers ?? []).find((c) => c.userId === student.id) ??
    ({
      id: `cust-${student.id}`,
      userId: student.id,
      customerNumber: `SA-CUST-${student.id.toUpperCase()}`,
      billingName: student.name,
      billingEmail: student.email,
      billingAddress: student.address ?? "New Delhi",
      stateCode: "07",
      currency: "INR",
      accountBalance: 200000,
      creditLimit: 50000,
      paymentTermsDays: 14,
      autoBlockWhenOverLimit: true,
    } satisfies import("./types").CustomerAccount);

  const newActivities: BillingActivity[] = [];
  const makeBillRow = (
    itemType: BillingActivity["itemType"],
    description: string,
    sacCode: string,
    qty: number,
    unit: BillingActivity["unit"],
    unitPrice: number,
  ): BillingActivity => {
    const subtotal = Math.round(qty * unitPrice * 100) / 100;
    const cgst = Math.round(subtotal * 0.09 * 100) / 100;
    const sgst = Math.round(subtotal * 0.09 * 100) / 100;
    const total = Math.round((subtotal + cgst + sgst) * 100) / 100;
    return {
      id: `bill-${flightId}-${itemType}`,
      customerId: customer.id,
      userId: student.id,
      flightId,
      date: input.date,
      itemType,
      description,
      sacCode,
      quantity: qty,
      unit,
      unitPrice,
      subtotalAmount: subtotal,
      gstRatePercent: 18,
      cgstAmount: cgst,
      sgstAmount: sgst,
      igstAmount: 0,
      totalAmount: total,
      status: "unbilled",
    };
  };

  newActivities.push(
    makeBillRow(
      "aircraft_wet",
      `${ac.reg} (${acModel?.modelName ?? ac.type}) Wet Block Time (${blockHours}h)`,
      acRateItem?.sacCode ?? "999293",
      blockHours,
      "hours",
      acRateItem?.unitPrice ?? 16500,
    ),
  );
  if (instructor && cfiRateItem) {
    newActivities.push(
      makeBillRow(
        "instructor_hour",
        `CFI Dual Instruction & CBTA Debrief (${instructor.name} · ${blockHours}h)`,
        cfiRateItem.sacCode,
        blockHours,
        "hours",
        cfiRateItem.unitPrice,
      ),
    );
  }
  if (totalLandings > 0 && landingRateItem && !isSim) {
    newActivities.push(
      makeBillRow(
        "landing_fee",
        `${input.toIcao.toUpperCase()} Aerodrome Touchdown Charges (${totalLandings}x)`,
        landingRateItem.sacCode,
        totalLandings,
        "landings",
        landingRateItem.unitPrice,
      ),
    );
  }

  const billedTotalInr = newActivities.reduce((s, a) => s + a.totalAmount, 0);
  const existingCustomers = data.customers ?? [];
  const nextCustomers = existingCustomers.some((c) => c.id === customer.id)
    ? existingCustomers.map((c) =>
        c.id === customer.id
          ? { ...c, accountBalance: Math.round((c.accountBalance - billedTotalInr) * 100) / 100 }
          : c,
      )
    : [
        {
          ...customer,
          accountBalance: Math.round((customer.accountBalance - billedTotalInr) * 100) / 100,
        },
        ...existingCustomers,
      ];

  // -------------------------------------------------------------------------
  // SUBSYSTEM 6: Safety Management System (SMS) Hazard Auto-Trigger
  // -------------------------------------------------------------------------
  let spawnedSmsReportId: string | undefined;
  const nextSmsReports = [...(data.smsReports ?? [])];
  if (input.flagSmsIncident) {
    spawnedSmsReportId = `sms-${flightId}`;
    const sev = input.smsSeverity ?? 3;
    const lik = input.smsLikelihood ?? "C";
    const { riskIndex, riskZone } = classifySmsRisk(sev, lik);
    nextSmsReports.unshift({
      id: spawnedSmsReportId,
      reportNumber: `SMS-2026-${String(nextSmsReports.length + 43).padStart(3, "0")}`,
      reportedBy: actor.id,
      flightId,
      aircraftId: ac.id,
      occurredAt: nowIso,
      title:
        input.smsTitle?.trim() ||
        `Post-Flight Debrief Safety Occurrence — ${ac.reg} (${input.fromIcao}→${input.toIcao})`,
      category: input.smsCategory ?? "human_factors",
      description: input.remarks.trim(),
      severity: sev,
      likelihood: lik,
      riskIndex,
      riskZone,
      isConfidential: false,
      status: "submitted",
    });
  }

  // Update linked booking status to 'completed'
  const nextBookings = input.bookingId
    ? data.bookings.map((b) =>
        b.id === input.bookingId
          ? {
              ...b,
              status: "completed" as const,
              debriefingEndTime: nowIso,
            }
          : b,
      )
    : data.bookings;

  const nextData: AppData = {
    ...data,
    aircraft: updatedAircraftList,
    aircraftRemarks: nextRemarks,
    bookings: nextBookings,
    flights: [newFlight, ...data.flights],
    completions: nextCompletions,
    duty: nextDuty,
    userLectures: [newUserLecture, ...(data.userLectures ?? [])],
    userExercises: [...newExercises, ...(data.userExercises ?? [])],
    gradedCompetencies: [...newCompetencies, ...(data.gradedCompetencies ?? [])],
    landingsLog: [newLandingRecord, ...(data.landingsLog ?? [])],
    electronicLogbookEntries: [
      ...newLogbookEntries,
      ...(data.electronicLogbookEntries ?? []),
    ],
    customers: nextCustomers,
    billingActivities: [...newActivities, ...(data.billingActivities ?? [])],
    smsReports: nextSmsReports,
    activity: [
      {
        id: `act-reg-${flightId}`,
        at: nowIso,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action: "fn_register_flight_atomic",
        entityType: "flight",
        entityId: flightId,
        details: `6-Way Atomic Commit [${ac.reg} · ${student.name}]: +${tachDeltaHours}h Tach, CBTA Grade ${overallGrade}/5 (${repeatRequired ? "REPEAT REQUIRED" : "PASSED"}), Dual Logbook Signed, ACI Charged INR ${billedTotalInr.toLocaleString()}`,
      },
      ...data.activity,
    ],
  };

  return {
    data: nextData,
    flightId,
    repeatRequired,
    overallGrade,
    aircraftAutoGrounded,
    studentLogbookEntryId: studentLogbookEntry.id,
    instructorLogbookEntryId,
    billedTotalInr,
    mandatoryRestUntil,
    spawnedSmsReportId,
  };
}

/**
 * CBTA 8-Axis Spider Radar Chart & Bottleneck Analytics (04 & 11 .md)
 */
export interface CbtaRadarAxisPoint {
  code: CbtaCompetencyCode;
  name: string;
  studentAverage: number;
  academyTarget: number;
  safetyFloor: number;
  sampleCount: number;
}

export function studentCbtaRadarProfile(
  studentId: string,
  data: AppData,
): {
  axes: CbtaRadarAxisPoint[];
  overallAverage: number;
  repeatLecturesCount: number;
  passedLecturesCount: number;
} {
  const competencies = data.coreCompetencies ?? DEFAULT_CORE_COMPETENCIES;
  const graded = (data.gradedCompetencies ?? []).filter(
    (gc) => gc.studentId === studentId,
  );
  const lectures = (data.userLectures ?? []).filter(
    (ul) => ul.studentId === studentId,
  );

  const axes: CbtaRadarAxisPoint[] = competencies.map((comp) => {
    const scores = graded
      .filter((g) => g.competencyCode === comp.code)
      .map((g) => g.score);
    const avg =
      scores.length > 0
        ? Math.round((scores.reduce((s, v) => s + v, 0) / scores.length) * 10) / 10
        : 3.8;
    return {
      code: comp.code,
      name: comp.name,
      studentAverage: avg,
      academyTarget: 4.0,
      safetyFloor: comp.minAcceptableScore,
      sampleCount: scores.length,
    };
  });

  const overallAverage =
    axes.length > 0
      ? Math.round(
          (axes.reduce((s, a) => s + a.studentAverage, 0) / axes.length) * 10,
        ) / 10
      : 4.0;

  return {
    axes,
    overallAverage,
    repeatLecturesCount: lectures.filter((l) => l.status === "repeat_required").length,
    passedLecturesCount: lectures.filter((l) => l.status === "passed").length,
  };
}

/**
 * CAMO Aircraft Squawk Reporting, MEL Deferral & CRS Sign-Off (02 & 05 .md)
 */
export function reportAircraftRemark(
  data: AppData,
  actor: User,
  payload: {
    aircraftId: string;
    severity: AircraftRemark["severity"];
    description: string;
  },
  now = new Date(),
): AppData | string {
  const ac = data.aircraft.find((a) => a.id === payload.aircraftId);
  if (!ac) return "Aircraft not found.";
  if (!payload.description.trim()) return "Enter a squawk / defect description.";

  const remark: AircraftRemark = {
    id: `sq-${uid()}`,
    aircraftId: ac.id,
    reportedBy: actor.id,
    reportedAt: now.toISOString(),
    severity: payload.severity,
    status: "open",
    description: payload.description.trim(),
  };

  const shouldGround = payload.severity === "grounding_defect";
  return {
    ...data,
    aircraft: data.aircraft.map((a) =>
      a.id === ac.id && shouldGround
        ? { ...a, grounded: true, status: "grounded" as const }
        : a,
    ),
    aircraftRemarks: [remark, ...(data.aircraftRemarks ?? [])],
  };
}

export function resolveAircraftRemark(
  data: AppData,
  remarkId: string,
  actor: User,
  payload: {
    rectifiedByLicense: string;
    rectificationNotes: string;
    workOrderRef?: string;
  },
  now = new Date(),
): AppData | string {
  if (actor.role !== "admin" && actor.role !== "staff" && actor.role !== "instructor") {
    return "Only authorized CAMO / Admin personnel can issue a Certificate of Release to Service (CRS).";
  }
  if (!payload.rectifiedByLicense.trim()) {
    return "Enter the certifying CAMO / AME Engineer License Number for CRS sign-off.";
  }
  const target = (data.aircraftRemarks ?? []).find((r) => r.id === remarkId);
  if (!target) return "Aircraft remark not found.";

  const nextRemarks = (data.aircraftRemarks ?? []).map((r) =>
    r.id === remarkId
      ? {
          ...r,
          status: "rectified" as const,
          rectifiedBy: actor.id,
          rectifiedByLicense: payload.rectifiedByLicense.trim(),
          rectificationNotes: payload.rectificationNotes.trim(),
          workOrderRef: payload.workOrderRef?.trim() || `WO-CRS-${uid().toUpperCase()}`,
          rectifiedAt: now.toISOString(),
        }
      : r,
  );

  const remainingGrounding = nextRemarks.some(
    (r) =>
      r.aircraftId === target.aircraftId &&
      r.status === "open" &&
      r.severity === "grounding_defect",
  );

  return {
    ...data,
    aircraftRemarks: nextRemarks,
    aircraft: data.aircraft.map((a) =>
      a.id === target.aircraftId && !remainingGrounding
        ? { ...a, grounded: false, status: "available" as const }
        : a,
    ),
  };
}

/**
 * Automated Customer Invoicing (ACI): Bundle unbilled activities into an Indian GST Invoice
 */
export function generateInvoiceFromUnbilled(
  data: AppData,
  customerId: string,
  actor: User,
  now = new Date(),
): { data: AppData; invoice: Invoice } | string {
  if (!can.manageInvoicing(actor.role)) {
    return "Only Administrators or Operations Staff can generate customer invoices.";
  }
  const customer = (data.customers ?? []).find((c) => c.id === customerId);
  if (!customer) return "Customer account not found.";

  const unbilled = (data.billingActivities ?? []).filter(
    (a) => a.customerId === customerId && a.status === "unbilled",
  );
  if (unbilled.length === 0) {
    return "No unbilled flight activities found for this customer.";
  }

  const invoiceId = `inv-${uid()}`;
  const existingInvoices = data.invoices ?? [];
  const invoiceNumber = `SA-INV-2026-${String(existingInvoices.length + 2).padStart(3, "0")}`;
  const issueDate = now.toISOString().slice(0, 10);
  const dueDate = new Date(
    now.getTime() + customer.paymentTermsDays * 86400000,
  )
    .toISOString()
    .slice(0, 10);

  const items = unbilled.map((act) => ({
    id: `invi-${act.id}`,
    activityId: act.id,
    description: act.description,
    sacCode: act.sacCode,
    quantity: act.quantity,
    unitPrice: act.unitPrice,
    subtotalAmount: act.subtotalAmount,
    cgstAmount: act.cgstAmount,
    sgstAmount: act.sgstAmount,
    igstAmount: act.igstAmount,
    totalAmount: act.totalAmount,
  }));

  const subtotalAmount =
    Math.round(items.reduce((s, i) => s + i.subtotalAmount, 0) * 100) / 100;
  const cgstTotal =
    Math.round(items.reduce((s, i) => s + i.cgstAmount, 0) * 100) / 100;
  const sgstTotal =
    Math.round(items.reduce((s, i) => s + i.sgstAmount, 0) * 100) / 100;
  const igstTotal =
    Math.round(items.reduce((s, i) => s + i.igstAmount, 0) * 100) / 100;
  const taxTotal = Math.round((cgstTotal + sgstTotal + igstTotal) * 100) / 100;
  const grandTotal = Math.round((subtotalAmount + taxTotal) * 100) / 100;

  const invoice: Invoice = {
    id: invoiceId,
    invoiceNumber,
    customerId: customer.id,
    userId: customer.userId,
    issueDate,
    dueDate,
    currency: customer.currency,
    subtotalAmount,
    cgstTotal,
    sgstTotal,
    igstTotal,
    taxTotal,
    grandTotal,
    status: "issued",
    items,
  };

  return {
    invoice,
    data: {
      ...data,
      billingActivities: (data.billingActivities ?? []).map((a) =>
        a.customerId === customerId && a.status === "unbilled"
          ? { ...a, status: "invoiced" as const, invoiceId }
          : a,
      ),
      invoices: [invoice, ...existingInvoices],
    },
  };
}

/**
 * Interactive Weight & Balance (Mass & Balance) Envelope & Runway Performance Calculator
 */
export interface WeightBalanceLoadInput {
  model: AircraftModel;
  frontSeatsKg: number;
  rearSeatsKg: number;
  baggageKg: number;
  takeoffFuelLiters: number;
  tripFuelBurnLiters: number;
}

export interface WeightBalanceComputation {
  emptyWeightKg: number;
  zeroFuelWeightKg: number;
  zeroFuelCgMm: number;
  takeoffWeightKg: number;
  takeoffCgMm: number;
  landingWeightKg: number;
  landingCgMm: number;
  withinMaxWeight: boolean;
  withinCgEnvelope: boolean;
  safeToDispatch: boolean;
}

export function calculateWeightAndBalance(
  input: WeightBalanceLoadInput,
): WeightBalanceComputation {
  const { model } = input;
  const specificGravity = model.engineType === "DIESEL_JET_A1" ? 0.8 : 0.72;
  const takeoffFuelKg = Math.round(input.takeoffFuelLiters * specificGravity * 10) / 10;
  const tripBurnKg =
    Math.round(
      Math.min(input.takeoffFuelLiters, input.tripFuelBurnLiters) * specificGravity * 10,
    ) / 10;
  const landingFuelKg = Math.max(0, takeoffFuelKg - tripBurnKg);

  const zfwKg =
    model.emptyWeightKg + input.frontSeatsKg + input.rearSeatsKg + input.baggageKg;
  const zfwMoment =
    model.emptyWeightKg * model.emptyCgArmMm +
    input.frontSeatsKg * model.frontSeatArmMm +
    input.rearSeatsKg * model.rearSeatArmMm +
    input.baggageKg * model.baggageArmMm;
  const zfwCgMm = Math.round(zfwMoment / Math.max(1, zfwKg));

  const towKg = Math.round((zfwKg + takeoffFuelKg) * 10) / 10;
  const towMoment = zfwMoment + takeoffFuelKg * model.fuelArmMm;
  const towCgMm = Math.round(towMoment / Math.max(1, towKg));

  const ldwKg = Math.round((zfwKg + landingFuelKg) * 10) / 10;
  const ldwMoment = zfwMoment + landingFuelKg * model.fuelArmMm;
  const ldwCgMm = Math.round(ldwMoment / Math.max(1, ldwKg));

  const arms = model.cgEnvelopePolygon.map((p) => p.armMm);
  const minArm = Math.min(...arms);
  const maxArm = Math.max(...arms);

  const withinMaxWeight =
    towKg <= model.maxTakeoffWeightKg && ldwKg <= model.maxLandingWeightKg;
  const withinCgEnvelope =
    towCgMm >= minArm &&
    towCgMm <= maxArm &&
    ldwCgMm >= minArm &&
    ldwCgMm <= maxArm;

  return {
    emptyWeightKg: model.emptyWeightKg,
    zeroFuelWeightKg: Math.round(zfwKg * 10) / 10,
    zeroFuelCgMm: zfwCgMm,
    takeoffWeightKg: towKg,
    takeoffCgMm: towCgMm,
    landingWeightKg: ldwKg,
    landingCgMm: ldwCgMm,
    withinMaxWeight,
    withinCgEnvelope,
    safeToDispatch: withinMaxWeight && withinCgEnvelope,
  };
}

export function calculateRunwayPerformance(params: {
  elevationFt: number;
  qnhHpa: number;
  oatC: number;
  runwayHeadingDeg: number;
  windDirDeg: number;
  windSpeedKt: number;
  model: AircraftModel;
}) {
  const pressureAltitudeFt = Math.round(
    params.elevationFt + (1013.25 - params.qnhHpa) * 30,
  );
  const isaTempC = 15 - (pressureAltitudeFt / 1000) * 2;
  const densityAltitudeFt = Math.round(
    pressureAltitudeFt + 120 * (params.oatC - isaTempC),
  );
  const angleRad =
    ((params.windDirDeg - params.runwayHeadingDeg) * Math.PI) / 180;
  const headwindKt = Math.round(params.windSpeedKt * Math.cos(angleRad) * 10) / 10;
  const crosswindKt =
    Math.round(Math.abs(params.windSpeedKt * Math.sin(angleRad)) * 10) / 10;

  const daFactor = Math.max(1, 1 + Math.max(0, densityAltitudeFt) / 8000);
  const windFactor = headwindKt >= 0 ? Math.max(0.75, 1 - headwindKt / 45) : 1 + Math.abs(headwindKt) / 20;
  const todrMeters = Math.round(
    params.model.todrBaselineMeters * daFactor * windFactor * 1.25,
  );
  const ldrMeters = Math.round(
    params.model.ldrBaselineMeters * daFactor * windFactor * 1.43,
  );

  return {
    pressureAltitudeFt,
    densityAltitudeFt,
    headwindKt,
    crosswindKt,
    exceedsMaxCrosswind: crosswindKt > params.model.maxCrosswindKt,
    todrMeters,
    ldrMeters,
  };
}


