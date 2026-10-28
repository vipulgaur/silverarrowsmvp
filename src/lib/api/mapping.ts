import type {
  ActivityLog,
  Aircraft,
  AppData,
  Booking,
  Classroom,
  Completion,
  DutyRecord,
  ExamResult,
  Flight,
  LearningRecord,
  Lecture,
  MaintenanceItem,
  ProfileChanges,
  ProfileRequest,
  Program,
  RescheduleReason,
  RescheduleRequest,
  Role,
  TheorySubject,
  User,
} from "@/lib/types";

export const TABLE_ORDER = [
  "tenant_members",
  "member_roles",
  "aircraft",
  "maintenance_items",
  "programs",
  "program_lessons",
  "theory_subjects",
  "classrooms",
  "bookings",
  "flights",
  "completions",
  "change_requests",
  "exam_results",
  "lectures",
  "duty_records",
  "profile_requests",
  "learning_records",
  "notification_reads",
  "activity_feed",
] as const;

export type TableName = (typeof TABLE_ORDER)[number];
export type Tables = Record<TableName, Record<string, unknown>[]>;
export interface Changes {
  upserts: Partial<Record<TableName, Record<string, unknown>[]>>;
  archives: Partial<Record<TableName, string[]>>;
}

const num = (v: unknown): number | undefined =>
  v === null || v === undefined || v === "" ? undefined : Number(v);
const str = (v: unknown): string | undefined =>
  v === null || v === undefined || v === "" ? undefined : String(v);

export const APP_TO_DB_MEMBER_ID: Record<string, string> = {
  "u-admin": "m-21645e1e87914a0994e1167c9de40cb0",
  "u-vpl": "m-2326d678c3bf48e199818e105abe8e98",
  "u-prn": "m-a73723d804884a57896a629899673193",
  "u-anj": "m-93fba566ab0b4b7d996915d2550e9a6a",
  "u-ana": "m-88859a4e679b4d1a95886a0ee84edb67",
  "u-arp": "m-759b6b6f419e4a3290bd963945d542ba",
  "u-lnl": "m-dbc9b6e3a6284caf8e04980311992e57",
};

export const DB_TO_APP_MEMBER_ID: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(APP_TO_DB_MEMBER_ID).map(([appId, dbId]) => [dbId, appId]),
  ),
  "u-demo-admin": "u-admin",
  "m-fd7e4922f88e467683f0ef8e62ca2b05": "u-admin",
};

export const SOLE_ADMIN_EMAIL = "admin@flysilverarrows.com";

export const EMAIL_TO_APP_MEMBER_ID: Record<string, string> = {
  "admin@flysilverarrows.com": "u-admin",
  "vipul@flysilverarrows.com": "u-vpl",
  "priya@flysilverarrows.com": "u-prn",
  "anujay@flysilverarrows.com": "u-anj",
  "ananya@flysilverarrows.com": "u-ana",
  "aarav@flysilverarrows.com": "u-arp",
  "liam@flysilverarrows.com": "u-lnl",
  "rohan@flysilverarrows.com": "u-rhv",
};

export function toDbMemberId(id: string | null | undefined): string | null {
  if (!id) return null;
  return APP_TO_DB_MEMBER_ID[id] ?? id;
}

export function toAppMemberId(id: string | null | undefined, email?: string | null): string {
  if (email) {
    const cleanEmail = email.trim().toLowerCase();
    if (EMAIL_TO_APP_MEMBER_ID[cleanEmail]) {
      return EMAIL_TO_APP_MEMBER_ID[cleanEmail];
    }
  }
  if (!id) return "";
  return DB_TO_APP_MEMBER_ID[id] ?? id;
}

export function toTables(data: AppData, tenantId: string): Tables {
  return {
    tenant_members: data.users.map((u) => {
      const dbId = toDbMemberId(u.id) ?? u.id;
      return {
        tenant_id: tenantId,
        id: dbId,
        name: u.name,
        email: u.email,
        phone: u.phone ?? null,
        callsign: u.callsign ?? null,
        program_id: u.programId ?? null,
        instructor_id: toDbMemberId(u.instructorId),
        licence: u.licence ?? null,
        stage: u.stage ?? null,
        speciality: u.speciality ?? null,
        medical_class: u.medicalClass ?? null,
        medical_expiry: u.medicalExpiry ?? null,
        rating_expiry: u.ratingExpiry ?? null,
        icao_level: u.icaoLevel ?? null,
        prior_minutes: u.priorMinutes ?? null,
        status: u.status,
        deleted_by: toDbMemberId(u.deletedBy),
        deleted_at: u.deletedAt ?? null,
        status_reason: u.statusReason ?? null,
        address: u.address ?? null,
        post_code: u.postCode ?? null,
        city: u.city ?? null,
        country: u.country ?? null,
        date_of_birth: u.dateOfBirth ?? null,
        gender: u.gender ?? null,
        place_of_birth: u.placeOfBirth ?? null,
        user_reference: u.userReference ?? null,
        caa_ref: u.caaRef ?? null,
        computer_number: u.computerNumber ?? null,
        egca_id: u.egcaId ?? null,
        file_number: u.fileNumber ?? null,
        spl_number: u.splNumber ?? null,
        spl_expiry: u.splExpiry ?? null,
        frtol_number: u.frtolNumber ?? null,
        frtol_expiry: u.frtolExpiry ?? null,
        rtr_number: u.rtrNumber ?? null,
        rtr_expiry: u.rtrExpiry ?? null,
        exam_air_regulation: u.examAirRegulation ?? null,
        exam_meteorology: u.examMeteorology ?? null,
        exam_air_navigation: u.examAirNavigation ?? null,
        exam_technical_general: u.examTechnicalGeneral ?? null,
        exam_technical_specific: u.examTechnicalSpecific ?? null,
        emergency_name: u.emergencyName ?? null,
        emergency_phone: u.emergencyPhone ?? null,
        emergency_relation: u.emergencyRelation ?? null,
        public_note: u.publicNote ?? null,
        admin_note: u.adminNote ?? null,
        instructor_note: u.instructorNote ?? null,
        photo_url: u.photoUrl ?? null,
      };
    }),
    member_roles: data.users.map((u) => {
      const dbId = toDbMemberId(u.id) ?? u.id;
      return {
        tenant_id: tenantId,
        id: dbId,
        member_id: dbId,
        role: u.role,
      };
    }),
    aircraft: data.aircraft.map((a) => ({
      tenant_id: tenantId,
      id: a.id,
      reg: a.reg,
      type: a.type,
      hourly_rate: a.hourlyRate,
      total_hours: a.totalHours,
      tach_hours: a.tachHours,
      last_service: a.lastService ?? null,
      grounded: a.grounded,
    })),
    maintenance_items: data.maintenance.map((m) => ({
      tenant_id: tenantId,
      id: m.id,
      aircraft_id: m.aircraftId,
      title: m.title,
      due_hours: m.dueHours ?? null,
      due_date: m.dueDate ?? null,
      interval_hours: m.intervalHours ?? null,
      completed_at: m.completedAt ?? null,
    })),
    programs: data.programs.map((p) => ({
      tenant_id: tenantId,
      id: p.id,
      name: p.name,
    })),
    program_lessons: data.programs.flatMap((p) =>
      p.lessons.map((l, position) => ({
        tenant_id: tenantId,
        id: l.id,
        program_id: p.id,
        name: l.name,
        kind: l.kind,
        minutes: l.minutes,
        position,
      })),
    ),
    theory_subjects: data.subjects.map((s) => ({
      tenant_id: tenantId,
      id: s.id,
      code: s.code,
      name: s.name,
    })),
    classrooms: data.classrooms.map((c) => ({
      tenant_id: tenantId,
      id: c.id,
      name: c.name,
      capacity: c.capacity,
    })),
    bookings: data.bookings.map((b) => ({
      tenant_id: tenantId,
      id: b.id,
      starts_at: b.start,
      ends_at: b.end,
      type: b.type,
      status: b.status,
      aircraft_id: b.aircraftId ?? null,
      instructor_id: toDbMemberId(b.instructorId),
      student_id: toDbMemberId(b.studentId),
      lesson_id: b.lessonId ?? null,
      route: b.route ?? null,
      notes: b.notes ?? null,
      approval_status: b.approvalStatus ?? "approved",
      requested_by: toDbMemberId(b.requestedBy),
      requested_at: b.requestedAt ?? null,
      reviewed_by: toDbMemberId(b.reviewedBy),
      reviewed_at: b.reviewedAt ?? null,
      decision_notes: b.decisionNotes ?? null,
    })),
    flights: data.flights.map((f) => ({
      tenant_id: tenantId,
      id: f.id,
      date: f.date,
      off_block: f.offBlock,
      on_block: f.onBlock,
      minutes: f.minutes,
      day_minutes: f.dayMinutes ?? null,
      night_minutes: f.nightMinutes ?? null,
      xc_minutes: f.xcMinutes ?? null,
      multi_engine_minutes: f.multiEngineMinutes ?? null,
      kind: f.kind ?? null,
      ifr_minutes: f.ifrMinutes ?? null,
      night_landings: f.nightLandings ?? null,
      tach_start: f.tachStart ?? null,
      tach_end: f.tachEnd ?? null,
      aircraft_id: f.aircraftId,
      pilot_id: toDbMemberId(f.pilotId) ?? f.pilotId,
      instructor_id: toDbMemberId(f.instructorId),
      lesson_id: f.lessonId ?? null,
      booking_id: f.bookingId ?? null,
      landings: f.landings,
      from_icao: f.fromIcao,
      to_icao: f.toIcao,
      grade: f.grade ?? null,
      remarks: f.remarks ?? null,
      verification_status: f.verificationStatus ?? "verified",
      submitted_by: toDbMemberId(f.submittedBy),
      verified_by: toDbMemberId(f.verifiedBy),
      verified_at: f.verifiedAt ?? null,
    })),
    completions: data.completions.map((c) => ({
      tenant_id: tenantId,
      id: c.id,
      student_id: toDbMemberId(c.studentId) ?? c.studentId,
      lesson_id: c.lessonId,
      date: c.date,
      instructor_id: toDbMemberId(c.instructorId),
      grade: c.grade ?? null,
      flight_id: c.flightId ?? null,
    })),
    change_requests: data.requests.map((r) => ({
      tenant_id: tenantId,
      id: r.id,
      booking_id: r.bookingId,
      student_id: toDbMemberId(r.studentId) ?? r.studentId,
      instructor_id: toDbMemberId(r.instructorId),
      reason: r.reason,
      details: r.details,
      proposed_start: r.proposedStart,
      proposed_end: r.proposedEnd,
      status: r.status,
      reviewer_id: toDbMemberId(r.reviewerId),
      notes: r.notes ?? null,
      reviewed_at: r.reviewedAt ?? null,
      created_at: r.createdAt,
    })),
    exam_results: data.exams.map((e) => ({
      tenant_id: tenantId,
      id: e.id,
      student_id: toDbMemberId(e.studentId) ?? e.studentId,
      subject_id: e.subjectId,
      score: e.score,
      passed: e.passed,
      signed_by: toDbMemberId(e.signedBy) ?? e.signedBy,
      date: e.date,
    })),
    lectures: data.lectures.map((l) => ({
      tenant_id: tenantId,
      id: l.id,
      subject_id: l.subjectId,
      title: l.title,
      starts_at: l.start,
      ends_at: l.end,
      room_id: l.roomId,
      instructor_id: toDbMemberId(l.instructorId) ?? l.instructorId,
      enrolled: l.enrolled.map((id) => toDbMemberId(id) ?? id),
      attended: l.attended.map((id) => toDbMemberId(id) ?? id),
      signed_off: l.signedOff,
    })),
    duty_records: data.duty.map((d) => ({
      tenant_id: tenantId,
      id: d.id,
      instructor_id: toDbMemberId(d.instructorId) ?? d.instructorId,
      starts_at: d.start,
      ends_at: d.end ?? null,
    })),
    profile_requests: data.profileRequests.map((p) => ({
      tenant_id: tenantId,
      id: p.id,
      user_id: toDbMemberId(p.userId) ?? p.userId,
      submitted_by: toDbMemberId(p.submittedBy) ?? p.submittedBy,
      changes: p.changes,
      before_values: p.before,
      status: p.status,
      created_at: p.createdAt,
      reviewed_at: p.reviewedAt ?? null,
      reviewer_id: toDbMemberId(p.reviewerId),
      notes: p.notes ?? null,
    })),
    learning_records: data.learningRecords.map((r) => {
      const appUid = r.userId ?? r.memberId ?? "guest";
      const dbUid = toDbMemberId(appUid) ?? appUid;
      return {
        tenant_id: tenantId,
        id: r.id ?? `${dbUid}:${r.chapterId}`,
        user_id: dbUid,
        chapter_id: r.chapterId,
        completed: r.completed,
        bookmarked: r.bookmarked,
        notes: r.notes,
        answers: r.answers ?? {},
      };
    }),
    notification_reads: Object.entries(data.readNotificationIds).flatMap(([memberId, ids]) => {
      const dbMemberId = toDbMemberId(memberId) ?? memberId;
      return ids.map((notificationId) => ({
        tenant_id: tenantId,
        id: `${dbMemberId}::${notificationId}`,
        member_id: dbMemberId,
        notification_id: notificationId,
      }));
    }),
    activity_feed: data.activity.map((a) => ({
      tenant_id: tenantId,
      id: a.id,
      occurred_at: a.at,
      actor_id: toDbMemberId(a.actorId) ?? a.actorId,
      actor_name: a.actorName,
      actor_role: a.actorRole,
      action: a.action,
      entity_type: a.entityType,
      entity_id: toDbMemberId(a.entityId),
      details: a.details,
    })),
  };
}

export function fromTables(tables: Partial<Record<TableName, Record<string, unknown>[]>>): AppData {
  const roleMap = new Map<string, Role>();
  for (const r of tables.member_roles ?? []) {
    if (typeof r.member_id === "string" && typeof r.role === "string") {
      roleMap.set(r.member_id, r.role as Role);
      roleMap.set(toAppMemberId(r.member_id), r.role as Role);
    }
  }

  const rawUsers: User[] = (tables.tenant_members ?? []).map((m) => {
    const rawId = String(m.id);
    const email = String(m.email ?? "");
    const cleanEmail = email.trim().toLowerCase();
    const isSoleAdmin = cleanEmail === SOLE_ADMIN_EMAIL;
    const id = isSoleAdmin
      ? "u-admin"
      : EMAIL_TO_APP_MEMBER_ID[cleanEmail] ??
        (rawId === "m-fd7e4922f88e467683f0ef8e62ca2b05" || rawId === "u-demo-admin"
          ? rawId
          : toAppMemberId(rawId, email));
    const mc = num(m.medical_class);
    const rawRole = roleMap.get(rawId) ?? roleMap.get(id) ?? "student";
    // Enforce single-admin rule: only admin@flysilverarrows.com can hold the admin role
    const effectiveRole: Role = isSoleAdmin
      ? "admin"
      : rawRole === "admin"
        ? "student"
        : rawRole;
    const rawReason = str(m.status_reason);
    const isDeclinedOrDeleted =
      !isSoleAdmin && (m.status === "deleted" || rawReason === "DECLINED_BY_ADMIN");
    return {
      id,
      name: String(m.name ?? ""),
      email,
      role: effectiveRole,
      status: isDeclinedOrDeleted ? "deleted" : "active",
      ...(str(m.phone) ? { phone: str(m.phone)! } : {}),
      ...(str(m.callsign) ? { callsign: str(m.callsign)! } : {}),
      ...(str(m.program_id) ? { programId: str(m.program_id)! } : {}),
      ...(str(m.instructor_id) ? { instructorId: toAppMemberId(str(m.instructor_id)!) } : {}),
      ...(str(m.licence) ? { licence: str(m.licence)! } : {}),
      ...(str(m.stage) ? { stage: str(m.stage)! } : {}),
      ...(str(m.speciality) ? { speciality: str(m.speciality)! } : {}),
      ...(mc === 1 || mc === 2 ? { medicalClass: mc } : {}),
      ...(str(m.medical_expiry) ? { medicalExpiry: str(m.medical_expiry)! } : {}),
      ...(str(m.rating_expiry) ? { ratingExpiry: str(m.rating_expiry)! } : {}),
      ...(num(m.icao_level) !== undefined ? { icaoLevel: num(m.icao_level)! } : {}),
      ...(num(m.prior_minutes) !== undefined ? { priorMinutes: num(m.prior_minutes)! } : {}),
      ...(str(m.deleted_by) ? { deletedBy: toAppMemberId(str(m.deleted_by)!) } : {}),
      ...(str(m.deleted_at) ? { deletedAt: str(m.deleted_at)! } : {}),
      ...(!isSoleAdmin && rawReason ? { statusReason: rawReason } : {}),
      ...(str(m.address) ? { address: str(m.address)! } : {}),
      ...(str(m.post_code) ? { postCode: str(m.post_code)! } : {}),
      ...(str(m.city) ? { city: str(m.city)! } : {}),
      ...(str(m.country) ? { country: str(m.country)! } : {}),
      ...(str(m.date_of_birth) ? { dateOfBirth: str(m.date_of_birth)! } : {}),
      ...(str(m.gender) ? { gender: str(m.gender)! } : {}),
      ...(str(m.place_of_birth) ? { placeOfBirth: str(m.place_of_birth)! } : {}),
      ...(str(m.user_reference) ? { userReference: str(m.user_reference)! } : {}),
      ...(str(m.caa_ref) ? { caaRef: str(m.caa_ref)! } : {}),
      ...(str(m.computer_number) ? { computerNumber: str(m.computer_number)! } : {}),
      ...(str(m.egca_id) ? { egcaId: str(m.egca_id)! } : {}),
      ...(str(m.file_number) ? { fileNumber: str(m.file_number)! } : {}),
      ...(str(m.spl_number) ? { splNumber: str(m.spl_number)! } : {}),
      ...(str(m.spl_expiry) ? { splExpiry: str(m.spl_expiry)! } : {}),
      ...(str(m.frtol_number) ? { frtolNumber: str(m.frtol_number)! } : {}),
      ...(str(m.frtol_expiry) ? { frtolExpiry: str(m.frtol_expiry)! } : {}),
      ...(str(m.rtr_number) ? { rtrNumber: str(m.rtr_number)! } : {}),
      ...(str(m.rtr_expiry) ? { rtrExpiry: str(m.rtr_expiry)! } : {}),
      ...(typeof m.exam_air_regulation === "boolean"
        ? { examAirRegulation: m.exam_air_regulation }
        : {}),
      ...(typeof m.exam_meteorology === "boolean" ? { examMeteorology: m.exam_meteorology } : {}),
      ...(typeof m.exam_air_navigation === "boolean"
        ? { examAirNavigation: m.exam_air_navigation }
        : {}),
      ...(typeof m.exam_technical_general === "boolean"
        ? { examTechnicalGeneral: m.exam_technical_general }
        : {}),
      ...(str(m.exam_technical_specific)
        ? { examTechnicalSpecific: str(m.exam_technical_specific)! }
        : {}),
      ...(str(m.emergency_name) ? { emergencyName: str(m.emergency_name)! } : {}),
      ...(str(m.emergency_phone) ? { emergencyPhone: str(m.emergency_phone)! } : {}),
      ...(str(m.emergency_relation) ? { emergencyRelation: str(m.emergency_relation)! } : {}),
      ...(str(m.public_note) ? { publicNote: str(m.public_note)! } : {}),
      ...(str(m.admin_note) ? { adminNote: str(m.admin_note)! } : {}),
      ...(str(m.instructor_note) ? { instructorNote: str(m.instructor_note)! } : {}),
      ...(str(m.photo_url) ? { photoUrl: str(m.photo_url)! } : {}),
    };
  });

  // Deduplicate users by canonical ID and normalized email, consolidating to one primary canonical account per person
  const userById = new Map<string, User>();
  for (const u of rawUsers) {
    const existing = userById.get(u.id);
    if (!existing) {
      userById.set(u.id, u);
    } else {
      const active = existing.status === "active" ? existing : u.status === "active" ? u : existing;
      userById.set(u.id, {
        ...existing,
        ...u,
        id: existing.id,
        status: active.status,
        phone: active.phone || existing.phone || u.phone,
      });
    }
  }
  const userByEmail = new Map<string, User>();
  for (const u of userById.values()) {
    const key = u.email.trim().toLowerCase();
    if (!key) continue;
    const existing = userByEmail.get(key);
    if (!existing) {
      userByEmail.set(key, u);
    } else {
      const active = existing.status === "active" ? existing : u.status === "active" ? u : existing;
      const canonicalId = existing.id.startsWith("u-") ? existing.id : u.id;
      userByEmail.set(key, {
        ...existing,
        ...u,
        id: canonicalId,
        status: active.status,
        phone: active.phone || existing.phone || u.phone,
      });
    }
  }
  const users: User[] = Array.from(userByEmail.values());

  const aircraft: Aircraft[] = (tables.aircraft ?? []).map((a) => ({
    id: String(a.id),
    reg: String(a.reg),
    type: String(a.type),
    hourlyRate: Number(a.hourly_rate ?? 0),
    totalHours: Number(a.total_hours ?? 0),
    tachHours: Number(a.tach_hours ?? 0),
    ...(str(a.last_service) ? { lastService: str(a.last_service)! } : {}),
    grounded: Boolean(a.grounded),
  }));

  const maintenance: MaintenanceItem[] = (tables.maintenance_items ?? []).map((m) => ({
    id: String(m.id),
    aircraftId: String(m.aircraft_id),
    title: String(m.title),
    ...(num(m.due_hours) !== undefined ? { dueHours: num(m.due_hours)! } : {}),
    ...(str(m.due_date) ? { dueDate: str(m.due_date)! } : {}),
    ...(num(m.interval_hours) !== undefined ? { intervalHours: num(m.interval_hours)! } : {}),
    ...(str(m.completed_at) ? { completedAt: str(m.completed_at)! } : {}),
  }));

  const lessonsByProgram = new Map<
    string,
    Array<{
      id: string;
      name: string;
      kind: "flight" | "ground";
      minutes: number;
      position: number;
    }>
  >();
  for (const l of tables.program_lessons ?? []) {
    const pid = String(l.program_id);
    const list = lessonsByProgram.get(pid) ?? [];
    list.push({
      id: String(l.id),
      name: String(l.name),
      kind: l.kind === "ground" ? "ground" : "flight",
      minutes: Number(l.minutes ?? 60),
      position: Number(l.position ?? 0),
    });
    lessonsByProgram.set(pid, list);
  }

  const programs: Program[] = (tables.programs ?? []).map((p) => {
    const id = String(p.id);
    const lessons = (lessonsByProgram.get(id) ?? [])
      .sort((a, b) => a.position - b.position)
      .map(({ position: _pos, ...rest }) => rest);
    return { id, name: String(p.name), lessons };
  });

  const subjects: TheorySubject[] = (tables.theory_subjects ?? []).map((s) => ({
    id: String(s.id),
    code: String(s.code),
    name: String(s.name),
  }));

  const classrooms: Classroom[] = (tables.classrooms ?? []).map((c) => ({
    id: String(c.id),
    name: String(c.name),
    capacity: Number(c.capacity ?? 0),
  }));

  const bookings: Booking[] = (tables.bookings ?? []).map((b) => ({
    id: String(b.id),
    start: String(b.starts_at),
    end: String(b.ends_at),
    type: (b.type as Booking["type"]) ?? "lesson",
    status: (b.status as Booking["status"]) ?? "scheduled",
    ...(str(b.aircraft_id) ? { aircraftId: str(b.aircraft_id)! } : {}),
    ...(str(b.instructor_id) ? { instructorId: toAppMemberId(str(b.instructor_id)!) } : {}),
    ...(str(b.student_id) ? { studentId: toAppMemberId(str(b.student_id)!) } : {}),
    ...(str(b.lesson_id) ? { lessonId: str(b.lesson_id)! } : {}),
    ...(str(b.route) ? { route: str(b.route)! } : {}),
    ...(str(b.notes) ? { notes: str(b.notes)! } : {}),
    approvalStatus: (b.approval_status as Booking["approvalStatus"]) ?? "approved",
    ...(str(b.requested_by) ? { requestedBy: toAppMemberId(str(b.requested_by)!) } : {}),
    ...(str(b.requested_at) ? { requestedAt: str(b.requested_at)! } : {}),
    ...(str(b.reviewed_by) ? { reviewedBy: toAppMemberId(str(b.reviewed_by)!) } : {}),
    ...(str(b.reviewed_at) ? { reviewedAt: str(b.reviewed_at)! } : {}),
    ...(str(b.decision_notes) ? { decisionNotes: str(b.decision_notes)! } : {}),
  }));

  const flights: Flight[] = (tables.flights ?? []).map((f) => ({
    id: String(f.id),
    date: String(f.date),
    offBlock: String(f.off_block),
    onBlock: String(f.on_block),
    minutes: Number(f.minutes ?? 0),
    ...(num(f.day_minutes) !== undefined ? { dayMinutes: num(f.day_minutes)! } : {}),
    ...(num(f.night_minutes) !== undefined ? { nightMinutes: num(f.night_minutes)! } : {}),
    ...(num(f.xc_minutes) !== undefined ? { xcMinutes: num(f.xc_minutes)! } : {}),
    ...(num(f.multi_engine_minutes) !== undefined
      ? { multiEngineMinutes: num(f.multi_engine_minutes)! }
      : {}),
    ...(str(f.kind) ? { kind: str(f.kind) as Flight["kind"] } : {}),
    ...(num(f.ifr_minutes) !== undefined ? { ifrMinutes: num(f.ifr_minutes)! } : {}),
    ...(num(f.night_landings) !== undefined ? { nightLandings: num(f.night_landings)! } : {}),
    ...(num(f.tach_start) !== undefined ? { tachStart: num(f.tach_start)! } : {}),
    ...(num(f.tach_end) !== undefined ? { tachEnd: num(f.tach_end)! } : {}),
    aircraftId: String(f.aircraft_id),
    pilotId: toAppMemberId(String(f.pilot_id)),
    ...(str(f.instructor_id) ? { instructorId: toAppMemberId(str(f.instructor_id)!) } : {}),
    ...(str(f.lesson_id) ? { lessonId: str(f.lesson_id)! } : {}),
    ...(str(f.booking_id) ? { bookingId: str(f.booking_id)! } : {}),
    landings: Number(f.landings ?? 0),
    fromIcao: String(f.from_icao ?? "EKAH"),
    toIcao: String(f.to_icao ?? "EKAH"),
    ...(num(f.grade) !== undefined ? { grade: num(f.grade)! } : {}),
    ...(str(f.remarks) ? { remarks: str(f.remarks)! } : {}),
    verificationStatus:
      (str(f.verification_status) as Flight["verificationStatus"]) ?? "verified",
    ...(str(f.submitted_by) ? { submittedBy: toAppMemberId(str(f.submitted_by)!) } : {}),
    ...(str(f.verified_by) ? { verifiedBy: toAppMemberId(str(f.verified_by)!) } : {}),
    ...(str(f.verified_at) ? { verifiedAt: str(f.verified_at)! } : {}),
  }));

  const completions: Completion[] = (tables.completions ?? []).map((c) => ({
    id: String(c.id),
    studentId: toAppMemberId(String(c.student_id)),
    lessonId: String(c.lesson_id),
    date: String(c.date),
    ...(str(c.instructor_id) ? { instructorId: toAppMemberId(str(c.instructor_id)!) } : {}),
    ...(num(c.grade) !== undefined ? { grade: num(c.grade)! } : {}),
    ...(str(c.flight_id) ? { flightId: str(c.flight_id)! } : {}),
  }));

  const requests: RescheduleRequest[] = (tables.change_requests ?? []).map((r) => ({
    id: String(r.id),
    bookingId: String(r.booking_id),
    studentId: toAppMemberId(String(r.student_id)),
    ...(str(r.instructor_id) ? { instructorId: toAppMemberId(str(r.instructor_id)!) } : {}),
    reason: (r.reason as RescheduleReason) ?? "weather",
    details: String(r.details ?? ""),
    proposedStart: String(r.proposed_start),
    proposedEnd: String(r.proposed_end),
    status: (r.status as RescheduleRequest["status"]) ?? "pending",
    ...(str(r.reviewer_id) ? { reviewerId: toAppMemberId(str(r.reviewer_id)!) } : {}),
    ...(str(r.notes) ? { notes: str(r.notes)! } : {}),
    ...(str(r.reviewed_at) ? { reviewedAt: str(r.reviewed_at)! } : {}),
    createdAt: String(r.created_at),
  }));

  const exams: ExamResult[] = (tables.exam_results ?? []).map((e) => ({
    id: String(e.id),
    studentId: toAppMemberId(String(e.student_id)),
    subjectId: String(e.subject_id),
    score: Number(e.score ?? 0),
    passed: Boolean(e.passed),
    signedBy: toAppMemberId(String(e.signed_by)),
    date: String(e.date),
  }));

  const lectures: Lecture[] = (tables.lectures ?? []).map((l) => ({
    id: String(l.id),
    subjectId: String(l.subject_id),
    title: String(l.title),
    start: String(l.starts_at),
    end: String(l.ends_at),
    roomId: String(l.room_id),
    instructorId: toAppMemberId(String(l.instructor_id)),
    enrolled: Array.isArray(l.enrolled) ? l.enrolled.map((x) => toAppMemberId(String(x))) : [],
    attended: Array.isArray(l.attended) ? l.attended.map((x) => toAppMemberId(String(x))) : [],
    signedOff: Boolean(l.signed_off),
  }));

  const duty: DutyRecord[] = (tables.duty_records ?? []).map((d) => ({
    id: String(d.id),
    instructorId: toAppMemberId(String(d.instructor_id)),
    start: String(d.starts_at),
    ...(str(d.ends_at) ? { end: str(d.ends_at)! } : {}),
  }));

  const profileRequests: ProfileRequest[] = (tables.profile_requests ?? []).map((p) => ({
    id: String(p.id),
    userId: toAppMemberId(String(p.user_id)),
    submittedBy: toAppMemberId(String(p.submitted_by)),
    changes: (p.changes as ProfileChanges) ?? {},
    before: (p.before_values as ProfileChanges) ?? {},
    status: (p.status as ProfileRequest["status"]) ?? "pending",
    createdAt: String(p.created_at),
    ...(str(p.reviewed_at) ? { reviewedAt: str(p.reviewed_at)! } : {}),
    ...(str(p.reviewer_id) ? { reviewerId: toAppMemberId(str(p.reviewer_id)!) } : {}),
    ...(str(p.notes) ? { notes: str(p.notes)! } : {}),
  }));

  const learningRecords: LearningRecord[] = (tables.learning_records ?? []).map((r) => {
    const uid = toAppMemberId(String(r.user_id ?? ""));
    return {
      id: String(r.id),
      userId: uid,
      memberId: uid,
      chapterId: String(r.chapter_id),
      completed: Boolean(r.completed),
      bookmarked: Boolean(r.bookmarked),
      notes: String(r.notes ?? ""),
      answers: (r.answers as Record<string, unknown>) ?? {},
    };
  });

  const readNotificationIds: Record<string, string[]> = {};
  for (const n of tables.notification_reads ?? []) {
    const mid = toAppMemberId(String(n.member_id ?? ""));
    const nid = String(n.notification_id ?? "");
    if (!mid || !nid) continue;
    readNotificationIds[mid] = [...(readNotificationIds[mid] ?? []), nid];
  }

  const activity: ActivityLog[] = (tables.activity_feed ?? [])
    .map((a) => ({
      id: String(a.id),
      at: String(a.occurred_at),
      actorId: toAppMemberId(String(a.actor_id)),
      actorName: String(a.actor_name),
      actorRole: (a.actor_role as Role) ?? "student",
      action: String(a.action),
      entityType: (a.entity_type as ActivityLog["entityType"]) ?? "user",
      ...(str(a.entity_id) ? { entityId: toAppMemberId(str(a.entity_id)!) } : {}),
      details: String(a.details ?? ""),
    }))
    .sort((a, b) => b.at.localeCompare(a.at));

  return {
    users,
    aircraft,
    maintenance,
    programs,
    subjects,
    classrooms,
    bookings,
    flights,
    completions,
    requests,
    exams,
    lectures,
    duty,
    profileRequests,
    learningRecords,
    readNotificationIds,
    activity,
  };
}

function stableRowJson(row: Record<string, unknown>): string {
  const entries = Object.entries(row)
    .filter(
      ([k]) =>
        k !== "inserted_at" && k !== "updated_at" && k !== "archived_at" && k !== "profile_id",
    )
    .sort(([a], [b]) => a.localeCompare(b));
  return JSON.stringify(Object.fromEntries(entries));
}

const NON_ARCHIVABLE_TABLES = new Set<TableName>([
  "tenant_members",
  "member_roles",
  "programs",
  "program_lessons",
  "aircraft",
  "theory_subjects",
  "classrooms",
  "activity_feed",
]);

export function diffTables(prev: Tables, next: Tables): Changes {
  const upserts: Partial<Record<TableName, Record<string, unknown>[]>> = {};
  const archives: Partial<Record<TableName, string[]>> = {};

  for (const t of TABLE_ORDER) {
    const prevMap = new Map(prev[t].map((r) => [String(r.id), r]));
    const nextMap = new Map(next[t].map((r) => [String(r.id), r]));

    const removedIds: string[] = [];
    if (!NON_ARCHIVABLE_TABLES.has(t)) {
      for (const id of prevMap.keys()) {
        if (!nextMap.has(id)) {
          removedIds.push(id);
        }
      }
    }
    if (removedIds.length > 0) archives[t] = removedIds;

    const changedRows: Record<string, unknown>[] = [];
    for (const [id, row] of nextMap.entries()) {
      const old = prevMap.get(id);
      if (!old) {
        changedRows.push(row);
      } else if (t !== "activity_feed" && stableRowJson(old) !== stableRowJson(row)) {
        changedRows.push(row);
      }
    }
    if (changedRows.length > 0) upserts[t] = changedRows;
  }

  return { upserts, archives };
}

export function hasChanges(c: Changes): boolean {
  return (
    Object.values(c.upserts).some((rows) => Boolean(rows?.length)) ||
    Object.values(c.archives).some((ids) => Boolean(ids?.length))
  );
}

export function mergePending(remote: Tables, pending: Changes): Tables {
  const merged = { ...remote };
  for (const t of TABLE_ORDER) {
    const archivedSet = new Set(pending.archives[t] ?? []);
    const upserts = pending.upserts[t] ?? [];
    const upsertMap = new Map(upserts.map((r) => [String(r.id), r]));
    const base = remote[t]
      .filter((r) => !archivedSet.has(String(r.id)))
      .map((r) => upsertMap.get(String(r.id)) ?? r);
    const existingIds = new Set(base.map((r) => String(r.id)));
    const added = upserts.filter((r) => !existingIds.has(String(r.id)));
    merged[t] = [...added, ...base];
  }
  return merged;
}
