import { seedData } from "./seed";
import type { AppData, User } from "./types";

export const DEMO_STORAGE_KEY = "silverarrows-demo-data-v1";
export const DEMO_SESSION_KEY = "silverarrows-demo-me-v1";

const SOLE_ADMIN_EMAIL = "admin@flysilverarrows.com";

function sanitizeUserRoleAndStatus(u: User): User {
  const emailLower = (u.email || "").trim().toLowerCase();
  const isSoleAdmin = emailLower === SOLE_ADMIN_EMAIL || (u.id === "u-admin" && !emailLower);
  if (isSoleAdmin) {
    return {
      ...u,
      id: "u-admin",
      email: SOLE_ADMIN_EMAIL,
      role: "admin",
      status: "active",
      statusReason: undefined,
      deletedAt: undefined,
      deletedBy: undefined,
    };
  }
  const safeRole = u.role === "admin" ? "student" : u.role;
  const isDeclined = u.statusReason === "DECLINED_BY_ADMIN" || u.status === "deleted";
  return {
    ...u,
    role: safeRole,
    status: isDeclined ? "deleted" : u.status,
  };
}

function mergeUserWithSeed(u: User, seedUser?: User): User {
  if (!seedUser) return sanitizeUserRoleAndStatus(u);
  const definedEntries = Object.entries(u).filter(
    ([, val]) => val !== undefined && val !== null && val !== "",
  );
  const merged: User = {
    ...seedUser,
    ...(Object.fromEntries(definedEntries) as Partial<User>),
    id: seedUser.id,
    name: seedUser.id === "u-admin" ? seedUser.name : u.name || seedUser.name,
    role: seedUser.role,
    status: seedUser.id === "u-admin" ? "active" : u.status,
  };
  // Canonical seed accounts are already approved; never mark a canonical seed member as PENDING_ADMIN_APPROVAL
  if (merged.statusReason === "PENDING_ADMIN_APPROVAL") {
    delete merged.statusReason;
  }
  if (seedUser.email.endsWith("@flysilverarrows.com")) {
    merged.email = seedUser.email;
  }
  return sanitizeUserRoleAndStatus(merged);
}

export function enrichWithSeedDefaults(data: AppData, localSnapshot?: AppData): AppData {
  const fallback = seedData();
  const seedById = new Map(fallback.users.map((u) => [u.id, u]));
  const seedByEmail = new Map(fallback.users.map((u) => [u.email.toLowerCase(), u]));
  const localById = new Map((localSnapshot?.users ?? []).map((u) => [u.id, u]));
  const localByEmail = new Map(
    (localSnapshot?.users ?? []).map((u) => [u.email.toLowerCase(), u]),
  );

  const filteredInputUsers = data.users.filter((u) => {
    const emailLower = (u.email || "").trim().toLowerCase();
    // Filter out legacy removed admin accounts or placeholder rows
    if (emailLower === "sakshi@flysilverarrows.com" || emailLower === "sakshi@silverarrows.aero") {
      return false;
    }
    return true;
  });

  const mappedUsers = filteredInputUsers.map((u) => {
    const emailLower = (u.email || "").trim().toLowerCase();
    const matchedSeedById = seedById.get(u.id);
    const seedUser =
      seedByEmail.get(emailLower) ??
      (matchedSeedById && matchedSeedById.email.toLowerCase() === emailLower
        ? matchedSeedById
        : undefined);
    const localUser = localById.get(u.id) ?? localByEmail.get(emailLower);
    const withSeed = mergeUserWithSeed(u, seedUser);
    if (!localUser) return withSeed;

    // If the user was explicitly declined or soft-deleted in the local session, preserve that deletion
    const wasDeclinedLocally =
      withSeed.id !== "u-admin" &&
      (localUser.status === "deleted" || localUser.statusReason === "DECLINED_BY_ADMIN");
    const wasApprovedLocally =
      localUser.status === "active" &&
      !localUser.statusReason &&
      withSeed.statusReason === "PENDING_ADMIN_APPROVAL";

    return sanitizeUserRoleAndStatus({
      ...withSeed,
      status: wasDeclinedLocally ? "deleted" : withSeed.status,
      statusReason: wasDeclinedLocally
        ? localUser.statusReason || "DECLINED_BY_ADMIN"
        : wasApprovedLocally
          ? undefined
          : withSeed.statusReason,
      deletedBy: wasDeclinedLocally ? localUser.deletedBy ?? withSeed.deletedBy : withSeed.deletedBy,
      deletedAt: wasDeclinedLocally ? localUser.deletedAt ?? withSeed.deletedAt : withSeed.deletedAt,
      computerNumber: u.computerNumber ?? localUser.computerNumber ?? withSeed.computerNumber,
      egcaId: u.egcaId ?? localUser.egcaId ?? withSeed.egcaId,
      fileNumber: u.fileNumber ?? localUser.fileNumber ?? withSeed.fileNumber,
      splNumber: u.splNumber ?? localUser.splNumber ?? withSeed.splNumber,
      splExpiry: u.splExpiry ?? localUser.splExpiry ?? withSeed.splExpiry,
      frtolNumber: u.frtolNumber ?? localUser.frtolNumber ?? withSeed.frtolNumber,
      frtolExpiry: u.frtolExpiry ?? localUser.frtolExpiry ?? withSeed.frtolExpiry,
      rtrNumber: u.rtrNumber ?? localUser.rtrNumber ?? withSeed.rtrNumber,
      rtrExpiry: u.rtrExpiry ?? localUser.rtrExpiry ?? withSeed.rtrExpiry,
      examAirRegulation:
        u.examAirRegulation ?? localUser.examAirRegulation ?? withSeed.examAirRegulation,
      examMeteorology:
        u.examMeteorology ?? localUser.examMeteorology ?? withSeed.examMeteorology,
      examAirNavigation:
        u.examAirNavigation ?? localUser.examAirNavigation ?? withSeed.examAirNavigation,
      examTechnicalGeneral:
        u.examTechnicalGeneral ?? localUser.examTechnicalGeneral ?? withSeed.examTechnicalGeneral,
      examTechnicalSpecific:
        u.examTechnicalSpecific ??
        localUser.examTechnicalSpecific ??
        withSeed.examTechnicalSpecific,
    });
  });

  // Deduplicate users by canonical ID and email
  const dedupedByEmail = new Map<string, User>();
  for (const u of mappedUsers) {
    const key = (u.email || u.id).trim().toLowerCase();
    const existing = dedupedByEmail.get(key);
    if (!existing) {
      dedupedByEmail.set(key, u);
    } else {
      const isDeleted = existing.status === "deleted" || u.status === "deleted";
      dedupedByEmail.set(
        key,
        sanitizeUserRoleAndStatus({
          ...existing,
          ...u,
          id: existing.id.startsWith("u-") ? existing.id : u.id,
          status: key === SOLE_ADMIN_EMAIL ? "active" : isDeleted ? "deleted" : "active",
        }),
      );
    }
  }
  const users = Array.from(dedupedByEmail.values());

  // Preserve canonical seed academy students & instructors if not yet in remote tables
  const existingUserIds = new Set(users.map((u) => u.id));
  const existingEmails = new Set(users.map((u) => u.email.toLowerCase()));
  const missingSeedUsers = fallback.users.filter(
    (fu) => !existingUserIds.has(fu.id) && !existingEmails.has(fu.email.toLowerCase()),
  );
  const completeUsers = [...users, ...missingSeedUsers].map(sanitizeUserRoleAndStatus);

  // Preserve any pending local flights or documents not yet present in remote tables
  const remoteFlightIds = new Set(data.flights.map((f) => f.id));
  const localPendingFlights = (localSnapshot?.flights ?? []).filter(
    (f) => !remoteFlightIds.has(f.id) && f.verificationStatus === "pending",
  );

  const documents =
    data.documents && data.documents.length > 0
      ? data.documents
      : localSnapshot?.documents && localSnapshot.documents.length > 0
        ? localSnapshot.documents
        : fallback.documents;

  return {
    ...data,
    users: completeUsers,
    flights: [...localPendingFlights, ...data.flights],
    documents,
  };
}

export function restoreDemoData(raw: string | null | undefined): AppData {
  const fallback = seedData();
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as Partial<AppData>;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !Array.isArray(parsed.users) ||
      parsed.users.length === 0 ||
      parsed.users.some(
        (u) =>
          !u || typeof u !== "object" || typeof u.id !== "string" || typeof u.role !== "string",
      )
    ) {
      return fallback;
    }

    // Detect if snapshot was produced by the broken Oct 22 replacement (e.g. aircraft ac-1 or program prog-ppl)
    const isOct22Corrupted =
      (Array.isArray(parsed.aircraft) && parsed.aircraft.some((a) => a.id === "ac-1")) ||
      (Array.isArray(parsed.programs) && parsed.programs.some((p) => p.id === "prog-ppl"));

    if (isOct22Corrupted) {
      const canonicalIds = new Set(fallback.users.map((u) => u.id));
      const canonicalEmails = new Set(fallback.users.map((u) => u.email.toLowerCase()));
      const extraUsers = parsed.users
        .filter((u) => !canonicalIds.has(u.id) && !canonicalEmails.has(u.email.toLowerCase()))
        .map((u) =>
          sanitizeUserRoleAndStatus({
            ...u,
            programId: u.programId === "prog-ppl" ? "p-ppl" : u.programId,
            instructorId: u.instructorId === "u-priya" ? "u-prn" : u.instructorId,
          }),
        );
      return {
        ...fallback,
        users: [...fallback.users, ...extraUsers],
        learningRecords: Array.isArray(parsed.learningRecords) ? parsed.learningRecords : [],
        readNotificationIds:
          parsed.readNotificationIds && typeof parsed.readNotificationIds === "object"
            ? parsed.readNotificationIds
            : {},
      };
    }

    const seedById = new Map(fallback.users.map((u) => [u.id, u]));
    const seedByEmail = new Map(fallback.users.map((u) => [u.email.toLowerCase(), u]));
    const validParsedUsers = parsed.users.filter((u) => {
      const emailLower = (u.email || "").trim().toLowerCase();
      if (
        emailLower === "sakshi@flysilverarrows.com" ||
        emailLower === "sakshi@silverarrows.aero" ||
        u.id === "u-demo-admin"
      ) {
        return false;
      }
      return true;
    });
    const normalizedUsers = validParsedUsers.map((u) => {
      const emailLower = (u.email || "").trim().toLowerCase();
      const matchedById = seedById.get(u.id);
      const seedUser =
        seedByEmail.get(emailLower) ??
        (matchedById && matchedById.email.toLowerCase() === emailLower ? matchedById : undefined);
      return mergeUserWithSeed(u, seedUser);
    });

    const existingIds = new Set(normalizedUsers.map((u) => u.id));
    const existingEmails = new Set(normalizedUsers.map((u) => u.email.toLowerCase()));
    const missingSeed = fallback.users.filter(
      (fu) => !existingIds.has(fu.id) && !existingEmails.has(fu.email.toLowerCase()),
    );
    const completeUsers = [...normalizedUsers, ...missingSeed].map(sanitizeUserRoleAndStatus);

    return {
      users: completeUsers,
      aircraft: Array.isArray(parsed.aircraft) ? parsed.aircraft : fallback.aircraft,
      maintenance: Array.isArray(parsed.maintenance) ? parsed.maintenance : fallback.maintenance,
      programs: Array.isArray(parsed.programs) ? parsed.programs : fallback.programs,
      subjects: Array.isArray(parsed.subjects) ? parsed.subjects : fallback.subjects,
      classrooms: Array.isArray(parsed.classrooms) ? parsed.classrooms : fallback.classrooms,
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : fallback.bookings,
      flights: Array.isArray(parsed.flights) ? parsed.flights : fallback.flights,
      completions: Array.isArray(parsed.completions) ? parsed.completions : fallback.completions,
      requests: Array.isArray(parsed.requests) ? parsed.requests : fallback.requests,
      exams: Array.isArray(parsed.exams) ? parsed.exams : fallback.exams,
      lectures: Array.isArray(parsed.lectures) ? parsed.lectures : fallback.lectures,
      duty: Array.isArray(parsed.duty) ? parsed.duty : fallback.duty,
      profileRequests: Array.isArray(parsed.profileRequests) ? parsed.profileRequests : [],
      learningRecords: Array.isArray(parsed.learningRecords) ? parsed.learningRecords : [],
      readNotificationIds:
        parsed.readNotificationIds && typeof parsed.readNotificationIds === "object"
          ? parsed.readNotificationIds
          : {},
      activity: Array.isArray(parsed.activity) ? parsed.activity : fallback.activity,
      documents:
        Array.isArray(parsed.documents) && parsed.documents.length > 0
          ? parsed.documents
          : fallback.documents,
    };
  } catch {
    return fallback;
  }
}

export function readDemoData(): { data: AppData; storageBlocked: boolean } {
  if (typeof window === "undefined") return { data: seedData(), storageBlocked: false };
  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
    return { data: restoreDemoData(raw), storageBlocked: false };
  } catch {
    return { data: seedData(), storageBlocked: true };
  }
}

export function writeDemoData(data: AppData): boolean {
  if (typeof window === "undefined") return true;
  try {
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
