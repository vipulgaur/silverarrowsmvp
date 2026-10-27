import { seedData } from "./seed";
import type { AppData, User } from "./types";

export const DEMO_STORAGE_KEY = "silverarrows-demo-data-v1";
export const DEMO_SESSION_KEY = "silverarrows-demo-me-v1";

function mergeUserWithSeed(u: User, seedUser?: User): User {
  if (!seedUser) return u;
  const definedEntries = Object.entries(u).filter(
    ([, val]) => val !== undefined && val !== null && val !== "",
  );
  const merged = {
    ...seedUser,
    ...(Object.fromEntries(definedEntries) as Partial<User>),
    id: u.id,
    role: u.role,
    status: u.status,
  };
  // Enforce canonical @flysilverarrows.com email for seed users
  if (seedUser.id === u.id && seedUser.email.endsWith("@flysilverarrows.com")) {
    merged.email = seedUser.email;
  }
  return merged;
}

export function enrichWithSeedDefaults(data: AppData, localSnapshot?: AppData): AppData {
  const fallback = seedData();
  const seedById = new Map(fallback.users.map((u) => [u.id, u]));
  const seedByEmail = new Map(fallback.users.map((u) => [u.email.toLowerCase(), u]));
  const localById = new Map((localSnapshot?.users ?? []).map((u) => [u.id, u]));
  const localByEmail = new Map(
    (localSnapshot?.users ?? []).map((u) => [u.email.toLowerCase(), u]),
  );

  const users = data.users.map((u) => {
    const seedUser = seedById.get(u.id) ?? seedByEmail.get(u.email.toLowerCase());
    const localUser = localById.get(u.id) ?? localByEmail.get(u.email.toLowerCase());
    const withSeed = mergeUserWithSeed(u, seedUser);
    if (!localUser) return withSeed;
    return {
      ...withSeed,
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
    };
  });

  // Preserve canonical seed academy students & instructors if not yet in remote tables
  const existingUserIds = new Set(users.map((u) => u.id));
  const existingEmails = new Set(users.map((u) => u.email.toLowerCase()));
  const missingSeedUsers = fallback.users.filter(
    (fu) => !existingUserIds.has(fu.id) && !existingEmails.has(fu.email.toLowerCase()),
  );
  const completeUsers = [...users, ...missingSeedUsers];

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
        .map((u) => ({
          ...u,
          programId: u.programId === "prog-ppl" ? "p-ppl" : u.programId,
          instructorId: u.instructorId === "u-priya" ? "u-prn" : u.instructorId,
        }));
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
    const normalizedUsers = parsed.users.map((u) => {
      const emailLower = (u.email || "").toLowerCase();
      const localPart = emailLower.split("@")[0];
      const seedUser =
        seedById.get(u.id) ??
        seedByEmail.get(emailLower) ??
        fallback.users.find(
          (s) => s.email.toLowerCase() === `${localPart}@flysilverarrows.com`,
        );
      return mergeUserWithSeed(u, seedUser);
    });

    const existingIds = new Set(normalizedUsers.map((u) => u.id));
    const existingEmails = new Set(normalizedUsers.map((u) => u.email.toLowerCase()));
    const missingSeed = fallback.users.filter(
      (fu) => !existingIds.has(fu.id) && !existingEmails.has(fu.email.toLowerCase()),
    );
    const completeUsers = [...normalizedUsers, ...missingSeed];

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
