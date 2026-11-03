import type { ActivityLog, AppData, Role, User } from "./types";

export type CourseId = "pooley" | "airlaw" | "airframes" | "electrics" | "powerplant";

export interface ELearningModule {
  id: CourseId;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  tags: string[];
}

export const ELEARNING_MODULES: ELearningModule[] = [
  {
    id: "pooley",
    title: "Air Manual — Pooley",
    subtitle: "Volume 1 · Flying Training & Ground School",
    badge: "19 Chapters · Interactive Diagrams",
    description:
      "Complete flying training manual containing all 19 course chapters. Features verbatim textbook sections and original interactive diagrams: aircraft familiarisation, pre-flight walkarounds, fuel sampling, cockpit scan horizons, and primary/secondary flight control aerodynamics.",
    tags: [
      "Aircraft Familiarisation",
      "Pre & Post Flight Checks",
      "Air Experience & Horizons",
      "Flight Controls & Aerodynamics",
      "Navigation & Forced Landings",
    ],
  },
  {
    id: "airlaw",
    title: "CAE ATPL 1: Air Law",
    subtitle: "Module 5 · Subject 010 (EASA / UK ATPL)",
    badge: "28 Chapters · 240+ Illustrated Figures",
    description:
      "Comprehensive EASA / UK ATPL Subject 010 theoretical knowledge course containing all 28 chapters. Features verbatim textbook sections and original interactive diagrams: international agreements & ICAO conventions, airworthiness, nationality & registration, flight crew licensing, rules of the air, instrument departure & approach procedures, circling & holding, altimeter setting, parallel runways, SSR & ACAS, airspace classifications A–G, ATS & radar control, separation standards, AIS, aerodromes, visual aids, aerodrome lighting, obstacle marking, facilitation, search & rescue, security, accident investigation, and EASA Part-FCL & Part-MED.",
    tags: [
      "ICAO Framework & Treaties",
      "Rules of the Air & Collision",
      "Instrument & Holding Procedures",
      "Airspace Classes A–G & Separation",
      "Aerodromes & Visual Signals",
      "EASA Part-FCL & Part-MED",
    ],
  },
  {
    id: "airframes",
    title: "CAE ATPL 2: Airframes & Systems",
    subtitle: "Module 2 · Aircraft General Knowledge (EASA / UK ATPL)",
    badge: "16 Chapters · Interactive Hotspots",
    description:
      "Comprehensive EASA / UK ATPL theoretical knowledge textbook covering aircraft structures, hydraulics, landing gear, flight controls, pneumatics, pressurization, ice & rain, and fuel systems. Features verbatim textbook sections and original interactive engineering diagrams with hotspot callouts.",
    tags: [
      "Fuselage & Wings",
      "Hydraulics & Flight Controls",
      "Landing Gear & Brakes",
      "Pressurization & Oxygen",
      "CS-25 Safety Objectives",
    ],
  },
  {
    id: "electrics",
    title: "CAE ATPL 3: Electrics & Electronics",
    subtitle: "Module 3 · Aircraft General Knowledge (EASA / UK ATPL)",
    badge: "17 Chapters · Interactive Diagrams",
    description:
      "Comprehensive EASA / UK ATPL theoretical knowledge textbook covering DC principles, switches, circuit protection, batteries, magnetism, DC generators & motors, aircraft power distribution, AC principles, alternators, transformers, semiconductors, and logic gates.",
    tags: [
      "DC & AC Principles",
      "Batteries & Power Systems",
      "Generators & Alternators",
      "Transformers & Inverters",
      "Semiconductors & Logic",
    ],
  },
  {
    id: "powerplant",
    title: "CAE ATPL 4: Powerplant",
    subtitle: "Module 4 · Aircraft General Knowledge (EASA / UK ATPL)",
    badge: "28 Chapters · Interactive Diagrams",
    description:
      "Comprehensive EASA / UK ATPL theoretical knowledge textbook covering piston engines (Otto cycle, fuel injection, turbocharging, constant-speed propellers) and gas turbines (Brayton cycle, compressors, combustors, turbines, thrust reversers, FADEC, bleed air).",
    tags: [
      "Piston Engines & Otto Cycle",
      "Carburettors & Fuel Injection",
      "Supercharging & Propellers",
      "Gas Turbines & Brayton Cycle",
      "Compressors & Turbines",
      "FADEC & Engine Systems",
    ],
  },
];

export const AIR_LAW_TOPICS = [
  {
    title: "International Civil Aviation Organisation (ICAO)",
    subtitle: "Chicago Convention & Standard Annexes",
    description:
      "Historical framework, freedoms of the air, SARPs (Standards and Recommended Practices), and the division of regulatory oversight between ICAO and national authorities.",
    keyPoints: [
      "Chicago Convention of 1944 (Annexes 1 through 19)",
      "Role of national aviation authorities (EASA, FAA, DGCA)",
      "Aircraft nationality and registration marks",
      "Airworthiness certificates and continuing compliance",
    ],
  },
  {
    title: "Rules of the Air & Collision Avoidance",
    subtitle: "VFR Right-of-Way & Air Navigation Rules",
    description:
      "Right-of-way hierarchies (balloons, gliders, airships, powered aircraft), converging headings, overtaking protocols, and cruising levels based on magnetic track.",
    keyPoints: [
      "Converging: aircraft on the right has the right of way",
      "Head-on approach: both aircraft alter heading to the right",
      "Overtaking: passing aircraft alters heading to the right and remains clear",
      "Semicircular cruising altitude rules (Eastbound Odd, Westbound Even)",
    ],
  },
  {
    title: "Airspace Classifications & Entry Minima",
    subtitle: "Class A through G Structures",
    description:
      "Controlled vs. uncontrolled airspace divisions, control zones (CTR), terminal control areas (TMA), and pilot separation responsibilities under Visual Flight Rules.",
    keyPoints: [
      "Class A: IFR only; VFR prohibited",
      "Class B, C, D: ATC clearance mandatory; two-way radio required",
      "Class E: Controlled for IFR; VFR permitted without continuous clearance",
      "Class G: Uncontrolled airspace; pilot self-separation via visual lookout",
    ],
  },
  {
    title: "Visual Meteorological Conditions (VMC)",
    subtitle: "VFR Weather Boundaries & Minima",
    description:
      "Mandatory flight visibility and distance from cloud limits for safe visual flight at, below, and above 3,000 ft AMSL or 1,000 ft above terrain.",
    keyPoints: [
      "Above 3,000 ft AMSL: 5 km visibility, 1,500 m horizontal & 1,000 ft vertical cloud clearance",
      "At or below 3,000 ft AMSL: 5 km visibility, clear of cloud and in sight of surface",
      "Special VFR (SVFR): Minimum 1.5 km flight visibility and clear of cloud",
      "Minimum safe heights: 500 ft AGL (open country), 1,000 ft above highest obstacle within 600m (congested areas)",
    ],
  },
  {
    title: "Pilot Licensing & Medical Validity",
    subtitle: "PPL(A) Privileges, Ratings & Currency",
    description:
      "Pilot-in-Command privileges, single-engine piston (SEP) revalidation, passenger carrying recency (3 take-offs and landings within 90 days), and medical fitness tiers.",
    keyPoints: [
      "Private Pilot Licence (Aeroplanes) non-commercial privileges",
      "Class 2 medical validity intervals based on pilot age",
      "90-day passenger carriage recency rules for day and night",
      "Logbook recording obligations and signature verifications",
    ],
  },
  {
    title: "Aerodrome Operations & Visual Signals",
    subtitle: "Circuit Procedures, Runway Markings & Light Signals",
    description:
      "Standard aerodrome traffic circuit legs, signal area square markings (dumbbells, red square with yellow cross), and air traffic control tower light gun emergency signals.",
    keyPoints: [
      "Standard left-hand circuit: Take-off, Crosswind, Downwind, Base, Final",
      "Signal square: Red square with yellow diagonal cross indicates landing prohibited",
      "Flashing Green light from tower: Cleared to taxi (ground) / Return for landing (air)",
      "Steady Red light: Stop (ground) / Give way to other aircraft and continue circling (air)",
    ],
  },
];

export const COURSE_ASSIGNMENTS_KEY = "silverarrows-course-assignments-v1";

/**Read persisted course assignment activity entries from browser storage safely.*/
export function readStoredCourseAssignments(): ActivityLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(COURSE_ASSIGNMENTS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is ActivityLog =>
      Boolean(
        item &&
        typeof item === "object" &&
        typeof (item as ActivityLog).id === "string" &&
        ((item as ActivityLog).action === "course_assigned" ||
          (item as ActivityLog).action === "course_unassigned") &&
        typeof (item as ActivityLog).entityId === "string" &&
        typeof (item as ActivityLog).details === "string",
      ),
    );
  } catch {
    return [];
  }
}

/**Persist course assignment activity entries to browser storage safely.*/
export function writeStoredCourseAssignments(entries: ActivityLog[]): void {
  if (typeof window === "undefined") return;
  try {
    const courseEntries = entries.filter(
      (a) => a.action === "course_assigned" || a.action === "course_unassigned",
    );
    window.localStorage.setItem(COURSE_ASSIGNMENTS_KEY, JSON.stringify(courseEntries));
  } catch {
    // Ignore storage errors in restricted environments
  }
}

/** Helper to ensure strictly monotonic timestamps for sequential activity logs */
function getStrictNextTimestamp(activities: ActivityLog[], baseIso = new Date().toISOString()): string {
  const baseMs = new Date(baseIso).getTime();
  let maxMs = isNaN(baseMs) ? Date.now() : baseMs;
  for (const a of activities) {
    if (a && a.at) {
      const t = new Date(a.at).getTime();
      if (!isNaN(t) && t >= maxMs) {
        maxMs = t + 1;
      }
    }
  }
  return new Date(maxMs).toISOString();
}

/**Merge stored course assignments with an AppData snapshot without duplicating entries.*/
export function mergeCourseAssignments(data: AppData): AppData {
  const stored = readStoredCourseAssignments();
  if (stored.length === 0) return data;
  const existingKeys = new Set(
    data.activity
      .filter((a) => a.action === "course_assigned" || a.action === "course_unassigned")
      .map((a) => a.id || `${a.action}:${a.entityId ?? ""}:${a.details}:${a.at}`),
  );
  const missing = stored.filter(
    (a) => !existingKeys.has(a.id || `${a.action}:${a.entityId ?? ""}:${a.details}:${a.at}`),
  );
  if (missing.length === 0) return data;
  return {
    ...data,
    activity: [...missing, ...data.activity].sort((a, b) => b.at.localeCompare(a.at)),
  };
}

/**Determines which course IDs a specific activity log entry refers to.*/
export function courseIdFromDetails(details: string): CourseId | null {
  if (!details || typeof details !== "string") return null;
  const lower = details.toLowerCase();
  if (
    lower.includes("pooley") ||
    lower.includes("air manual") ||
    lower.includes("air-manual") ||
    lower.includes("air_manual") ||
    lower.trim() === "pooley"
  ) {
    return "pooley";
  }
  if (
    lower.includes("air law") ||
    lower.includes("airlaw") ||
    lower.includes("air-law") ||
    lower.includes("air_law") ||
    lower.trim() === "airlaw"
  ) {
    return "airlaw";
  }
  if (
    lower.includes("electric") ||
    lower.includes("electrics") ||
    lower.includes("electronic") ||
    lower.includes("electronics") ||
    lower.includes("module 3") ||
    lower.trim() === "electrics"
  ) {
    return "electrics";
  }
  if (
    lower.includes("powerplant") ||
    lower.includes("power plant") ||
    lower.includes("power-plant") ||
    lower.includes("piston engine") ||
    lower.includes("gas turbine") ||
    lower.includes("module 4") ||
    lower.trim() === "powerplant"
  ) {
    return "powerplant";
  }
  if (
    lower.includes("airframe") ||
    lower.includes("airframes") ||
    lower.includes("module 2") ||
    lower.includes("airframes & systems") ||
    lower.includes("airframes and systems") ||
    (lower.includes("cae") && !lower.includes("electr") && !lower.includes("power")) ||
    lower.trim() === "airframes"
  ) {
    return "airframes";
  }
  return null;
}

/**Returns the list of CourseIds explicitly assigned to a specific user based on latest timeline action.*/
export function assignedCourseIds(
  userId: string,
  data: Pick<AppData, "activity"> & { users?: User[] },
): CourseId[] {
  const targetUser = (data as AppData).users?.find((u) => u.id === userId);
  const targetEmail = targetUser?.email?.trim().toLowerCase();
  const targetName = targetUser?.name?.trim().toLowerCase();

  const rawList = [...(data?.activity ?? []), ...readStoredCourseAssignments()];
  const seen = new Set<string>();
  const events: ActivityLog[] = [];

  for (const act of rawList) {
    if (!act || typeof act !== "object") continue;
    if (act.action !== "course_assigned" && act.action !== "course_unassigned") continue;

    let matchesUser = act.entityId === userId;
    if (!matchesUser && (data as AppData).users) {
      const actUser = (data as AppData).users?.find((u) => u.id === act.entityId);
      if (actUser && targetEmail && actUser.email?.trim().toLowerCase() === targetEmail) {
        matchesUser = true;
      } else if (targetName && act.details && act.details.toLowerCase().includes(targetName)) {
        matchesUser = true;
      }
    }

    if (!matchesUser) continue;
    const cid = courseIdFromDetails(act.details);
    if (!cid) continue;

    const key = act.id || `${act.action}:${act.entityId}:${cid}:${act.at}`;
    if (!seen.has(key)) {
      seen.add(key);
      events.push(act);
    }
  }

  // Group events by courseId
  const courseEvents = new Map<CourseId, ActivityLog[]>();
  for (const act of events) {
    const cid = courseIdFromDetails(act.details)!;
    const list = courseEvents.get(cid) ?? [];
    list.push(act);
    courseEvents.set(cid, list);
  }

  const assigned = new Set<CourseId>();

  for (const [cid, acts] of courseEvents.entries()) {
    // Sort chronologically ascending (oldest first, newest last)
    acts.sort((a, b) => {
      const aTime = new Date(a.at).getTime();
      const bTime = new Date(b.at).getTime();
      const diff = aTime - bTime;
      if (diff !== 0) return diff;
      // If timestamps match, course_unassigned takes precedence over course_assigned
      if (a.action === b.action) return 0;
      return a.action === "course_assigned" ? -1 : 1;
    });

    const latest = acts[acts.length - 1];
    if (latest && latest.action === "course_assigned") {
      assigned.add(cid);
    }
  }

  return ELEARNING_MODULES.map((m) => m.id).filter((id) => assigned.has(id));
}

/**
 * Returns the E-Learning modules a user is allowed to see and access:
 * - Admin sees ALL modules.
 * - All other roles (student, instructor, ground) ONLY see modules explicitly assigned to them.
 */
export function accessibleModulesFor(
  user: Pick<User, "id" | "role" | "name" | "email"> | null | undefined,
  data: Pick<AppData, "activity"> & { users?: User[] },
): ELearningModule[] {
  if (!user) return [];
  if (user.role === "admin") return ELEARNING_MODULES;
  const assigned = new Set(assignedCourseIds(user.id, data));
  return ELEARNING_MODULES.filter((m) => assigned.has(m.id));
}

/**Checks whether a user is already assigned to a given course.*/
export function isCourseAssignedToUser(
  userId: string,
  courseId: CourseId,
  data: Pick<AppData, "activity">,
): boolean {
  return assignedCourseIds(userId, data).includes(courseId);
}

/**Returns all users currently assigned to a given course.*/
export function usersAssignedToCourse(
  courseId: CourseId,
  data: Pick<AppData, "users" | "activity">,
): User[] {
  return data.users.filter(
    (u) =>
      u.status === "active" && u.role !== "admin" && isCourseAssignedToUser(u.id, courseId, data),
  );
}

/**Returns the latest assignment metadata (date, note, assignedBy) for a user and course.*/
export function courseAssignmentInfo(
  userId: string,
  courseId: CourseId,
  data: Pick<AppData, "activity">,
): { at: string; actorName: string; note?: string } | null {
  if (!isCourseAssignedToUser(userId, courseId, data)) {
    return null;
  }
  const rawList = [...(data?.activity ?? []), ...readStoredCourseAssignments()];
  const matches = rawList.filter(
    (a) =>
      a &&
      a.action === "course_assigned" &&
      a.entityId === userId &&
      courseIdFromDetails(a.details) === courseId,
  );
  if (matches.length === 0) return null;
  matches.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  const match = matches[0];
  const noteIdx = match.details.indexOf("· Note:");
  const note = noteIdx !== -1 ? match.details.slice(noteIdx + 7).trim() : undefined;
  return {
    at: match.at,
    actorName: match.actorName,
    ...(note ? { note } : {}),
  };
}

/**
 * Pure function to assign a course module to candidate users.
 * Generates audit log entries, updates stored assignments, and returns next AppData.
 */
export function assignCourseToUsers(
  candidateIds: string[],
  courseId: CourseId,
  data: AppData,
  admin: Pick<User, "id" | "name" | "role">,
  note?: string,
): { next: AppData; newlyAssignedNames: string[]; alreadyAssignedNames: string[] } {
  const targetModule = ELEARNING_MODULES.find((m) => m.id === courseId);
  const title = targetModule?.title ?? courseId;
  const now = getStrictNextTimestamp(data.activity);

  const newlyAssignedNames: string[] = [];
  const alreadyAssignedNames: string[] = [];
  const newActivities: ActivityLog[] = [];

  for (const cid of candidateIds) {
    const user = data.users.find((u) => u.id === cid);
    if (!user) continue;

    if (isCourseAssignedToUser(cid, courseId, data)) {
      alreadyAssignedNames.push(user.name);
      continue;
    }

    newlyAssignedNames.push(user.name);
    newActivities.push({
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      actorId: admin.id,
      actorName: admin.name,
      actorRole: "admin",
      action: "course_assigned",
      entityType: "lesson",
      entityId: user.id,
      details: `Course "${title}" assigned to ${user.name} (${user.role})${note ? ` · Note: ${note.trim()}` : ""}`,
      at: now,
    });
  }

  const nextActivity = [...newActivities, ...data.activity];
  writeStoredCourseAssignments(nextActivity);

  return {
    next: { ...data, activity: nextActivity },
    newlyAssignedNames,
    alreadyAssignedNames,
  };
}

/**
 * Pure function to unassign a course module from specified users.
 * Logs course_unassigned audit entries, updates persistence, and returns next AppData.
 */
export function unassignCourseFromUsers(
  candidateIds: string[],
  courseId: CourseId,
  data: AppData,
  admin: Pick<User, "id" | "name" | "role">,
  note?: string,
): { next: AppData; unassignedNames: string[] } {
  const targetModule = ELEARNING_MODULES.find((m) => m.id === courseId);
  const title = targetModule?.title ?? courseId;
  const now = getStrictNextTimestamp(data.activity);
  const unassignedNames: string[] = [];
  const unassignActivities: ActivityLog[] = [];

  // 1. Identify affected users
  for (const cid of candidateIds) {
    const user = data.users.find((u) => u.id === cid);
    if (!user) continue;
    if (isCourseAssignedToUser(cid, courseId, data)) {
      unassignedNames.push(user.name);
      unassignActivities.push({
        id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        actorId: admin.id,
        actorName: admin.name,
        actorRole: "admin",
        action: "course_unassigned",
        entityType: "lesson",
        entityId: user.id,
        details: `Course "${title}" unassigned from ${user.name} (${user.role})${note ? ` · Note: ${note.trim()}` : ""}`,
        at: now,
      });
    }
  }

  // Preserve full immutable audit history while filtering out active assignment in current memory snapshot
  const remainingActivity = data.activity.filter((act) => {
    if (
      act.action === "course_assigned" &&
      candidateIds.includes(act.entityId ?? "") &&
      courseIdFromDetails(act.details) === courseId
    ) {
      return false;
    }
    return true;
  });

  const nextActivity = [...unassignActivities, ...remainingActivity];
  writeStoredCourseAssignments(nextActivity);

  return {
    next: {
      ...data,
      activity: nextActivity,
    },
    unassignedNames,
  };
}
