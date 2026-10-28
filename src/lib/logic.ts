import type {
  AppData,
  Booking,
  Flight,
  MaintenanceItem,
  Aircraft,
  Role,
  User,
  ProfileChanges,
  StudentDocument,
  AppNotification,
  NotificationPriority,
} from "./types";
import { roleLabel } from "./types";
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
 * Strict account creation validation shared across public registration (/login) and admin creation (/admin/create).
 * Enforces:
 * 1. Single-admin policy: only admin@flysilverarrows.com is permitted as Administrator.
 * 2. Unique Name policy: no two users can have the same name (or match an existing member's first/full name).
 * 3. Unique Email policy: no two users can share an email ID or @flysilverarrows.com prefix.
 * 4. Unique Phone policy: no two users can share the same phone number.
 */
export function validateAccountCreation(
  candidate: {
    name?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
    role?: Role;
  },
  existingUsers: User[],
): string | null {
  const first = (candidate.firstName ?? "").trim();
  const last = (candidate.lastName ?? "").trim();
  const fullName = (candidate.name ?? `${first} ${last}`).trim().replace(/\s+/g, " ");
  const cleanEmail = (candidate.email ?? "").trim().toLowerCase();
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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 255) {
    return "Enter a valid email address.";
  }
  const normPhone = cleanPhone.replace(/[\s\-().+]/g, "");
  if (normPhone.length < 7 || !/^\d+$/.test(normPhone)) {
    return "Enter a valid phone number (at least 7 digits).";
  }

  // 1. Sole Admin Lock
  if (candidate.role === "admin" || cleanEmail === SOLE_ADMIN_EMAIL) {
    return "Administrator creation is locked. Only admin@flysilverarrows.com is authorized as the sole Administrator in the system.";
  }

  const normFull = fullName.toLowerCase();
  const normFirst = (first || fullName.split(" ")[0] || "").toLowerCase();
  const emailPrefix = cleanEmail.split("@")[0] ?? "";

  // Reserved identities check
  const reservedNames = new Set([
    "admin",
    "administrator",
    "system administrator",
    "demo admin",
    "sakshi",
    "sakshi gaur",
  ]);
  if (
    reservedNames.has(normFull) ||
    reservedNames.has(normFirst) ||
    cleanEmail === "sakshi@flysilverarrows.com"
  ) {
    return `The name or email "${fullName || cleanEmail}" is a reserved system identity and cannot be registered.`;
  }

  const activeOrPending = existingUsers.filter((u) => u.status !== "deleted");

  for (const u of activeOrPending) {
    const existingEmail = u.email.trim().toLowerCase();
    const existingName = u.name.trim().replace(/\s+/g, " ").toLowerCase();
    const existingFirst = existingName.split(" ")[0] ?? "";
    const existingEmailPrefix = existingEmail.split("@")[0] ?? "";

    if (existingEmail === cleanEmail) {
      return `An account with the email ID "${cleanEmail}" already exists (${u.name}). Duplicate email IDs are not permitted.`;
    }

    if (existingName === normFull || (existingFirst.length >= 3 && existingFirst === normFirst)) {
      return `An account with the name "${u.name}" already exists (${u.email}). Anyone with the same name cannot register a duplicate account or share an email ID.`;
    }

    if (
      cleanEmail.endsWith("@flysilverarrows.com") &&
      existingEmail.endsWith("@flysilverarrows.com") &&
      existingEmailPrefix === emailPrefix
    ) {
      return `The email ID "${cleanEmail}" conflicts with existing member ${u.name} (${u.email}).`;
    }

    if (u.phone) {
      const existingPhone = u.phone.replace(/[\s\-().+]/g, "");
      if (existingPhone.length >= 7 && existingPhone === normPhone) {
        return `An account with this phone number already exists (${u.name}). Duplicate phone numbers are not permitted.`;
      }
    }
  }

  return null;
}



export const can = {
  manageUsers: (r: Role) => r === "admin",
  manageFleet: (r: Role) => r === "admin",
  groundAircraft: (r: Role) => r === "admin" || r === "instructor",
  managePrograms: (r: Role) => r === "admin",
  signOff: (r: Role) => r === "admin" || r === "instructor",
  logFlight: (r: Role) => r === "admin" || r === "instructor",
  manageLectures: (r: Role) => r === "admin" || r === "ground",
  bookFor: (me: User, studentId?: string) =>
    me.role === "admin" ||
    me.role === "instructor" ||
    (me.role === "student" && studentId === me.id),
  book: (r: Role) => r !== "ground",
};

export const homeFor: Record<Role, string> = {
  admin: "/portal/admin",
  instructor: "/portal/cfi",
  ground: "/portal/ground",
  student: "/portal/student",
};

const access: Record<Role, string[]> = {
  admin: ["*"],
  instructor: [
    "/dashboard",
    "/learning",
    "/profile",
    "/portal/cfi",
    "/schedule",
    "/flights",
    "/people",
    "/training",
    "/fleet",
  ],
  ground: [
    "/dashboard",
    "/learning",
    "/profile",
    "/portal/ground",
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
    "/flights",
    "/training",
    "/fleet",
    "/people/",
  ],
};

/** Route-level RBAC. "/people/" prefix grants detail pages only (students see their own). */
export function canAccess(role: Role, path: string): boolean {
  const allowed = access[role];
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
  if (me.role === "admin") return items;
  if (me.role === "instructor") {
    return items.filter((i) => i.instructorId === me.id);
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
          to: "/portal/admin",
          status: "pending",
          priority: isRegulatory ? "critical" : "medium",
          category: "profile",
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
        },
      ];
    return [];
  });
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
    }));
  const bookingRequests: AppNotification[] =
    me.role === "admin"
      ? data.bookings.filter(bookingPending).map((b) => ({
          id: `${b.id}:pending:${b.requestedAt}`,
          title: "Booking approval requested",
          detail: `${data.users.find((u) => u.id === b.studentId)?.name ?? "Student"} · ${b.id} · ${format(new Date(b.start), "dd MMM HH:mm")}`,
          at: b.requestedAt ?? b.start,
          to: "/portal/admin",
          status: "pending",
          priority: "medium",
          category: "booking",
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
              to: "/flights",
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
              to: "/portal/admin",
              status: "pending" as const,
              priority: "critical" as const,
              category: "profile" as const,
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
      category: "profile" as const,
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
            to: "/flights",
            status: "pending",
            priority: "critical",
            category: "flight",
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

