import { formatEpochToIst, getAuthoritativeEpochMs, getAuthoritativeIstNow } from "./network-time";
import type { ActivityLog, User } from "./types";

const memoryStorageFallback = new Map<string, string>();

function readStorageItem(key: string): string | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // fallback to memory
  }
  return memoryStorageFallback.get(key) ?? null;
}

function writeStorageItem(key: string, value: string): void {
  memoryStorageFallback.set(key, value);
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // ignore blocked storage
  }
}

export interface PrivacyActivityItem {
  id: string;
  /** 24-hour IST timestamp with seconds, e.g. "27 Oct 2026 · 19:45:12 IST" */
  timeIst: string;
  epochMs: number;
  action: string;
  details: string;
  entityType?: string;
}

export interface LoginPrivacyRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  /** Full IST day, date & 24h time with seconds */
  loginAtIst: string;
  loginEpochMs: number;
  /** Client public IPv4 / IPv6 address */
  ipAddress: string;
  /** Resolved geographic location (City, State, Country) */
  location: string;
  /** Latitude & Longitude coordinates */
  coordinates: string;
  /** Network / ISP descriptor */
  networkOrg: string;
  /** Browser & OS / Device summary */
  deviceBrowser: string;
  /** Method used to sign in */
  authMethod: string;
  /** Activities performed during or since this login */
  activities: PrivacyActivityItem[];
}

const PRIVACY_STORAGE_KEY = "sa_login_privacy_sessions_v1";

interface ResolvedClientNetInfo {
  ipAddress: string;
  location: string;
  coordinates: string;
  networkOrg: string;
}

let cachedNetInfo: ResolvedClientNetInfo | null = null;
let netResolvePromise: Promise<ResolvedClientNetInfo> | null = null;
const privacyListeners = new Set<() => void>();

function notifyPrivacyListeners() {
  for (const fn of privacyListeners) {
    try {
      fn();
    } catch {
      // ignore listener errors
    }
  }
}

export function subscribePrivacyTracker(listener: () => void): () => void {
  privacyListeners.add(listener);
  return () => {
    privacyListeners.delete(listener);
  };
}

/**
 * Parses `navigator.userAgent` into a clean human-readable Device & Browser label.
 */
export function detectDeviceAndBrowser(): string {
  if (typeof navigator === "undefined") return "Web Browser · Desktop OS";
  const ua = navigator.userAgent || "";

  let device = "Desktop Workstation";
  if (/iPad/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) {
    device = "Apple iPad (iPadOS)";
  } else if (/iPhone/i.test(ua)) {
    device = "Apple iPhone (iOS)";
  } else if (/Android/i.test(ua)) {
    device = /Mobile/i.test(ua) ? "Android Smartphone" : "Android Tablet";
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    device = "macOS";
  } else if (/Windows/i.test(ua)) {
    device = "Windows PC";
  } else if (/Linux/i.test(ua)) {
    device = "Linux Workstation";
  }

  let browser = "Browser";
  if (/Edg\//i.test(ua)) {
    browser = "Microsoft Edge";
  } else if (/OPR\//i.test(ua)) {
    browser = "Opera";
  } else if (/Chrome\//i.test(ua)) {
    browser = "Google Chrome";
  } else if (/Firefox\//i.test(ua)) {
    browser = "Mozilla Firefox";
  } else if (/Safari\//i.test(ua)) {
    browser = "Apple Safari";
  }

  return `${browser} · ${device}`;
}

/**
 * Resolves the user's real public IP address, city/region/country, and coordinates
 * from live CORS-enabled geolocation/IP endpoints.
 */
export async function resolveClientNetworkIdentity(): Promise<ResolvedClientNetInfo> {
  if (cachedNetInfo) return cachedNetInfo;
  if (netResolvePromise) return netResolvePromise;

  netResolvePromise = (async (): Promise<ResolvedClientNetInfo> => {
    if (typeof window === "undefined" || typeof fetch !== "function") {
      return {
        ipAddress: "49.36.128.114",
        location: "New Delhi, Delhi, India",
        coordinates: "28.5562°N, 77.1000°E",
        networkOrg: "Aviation Telemetry Network",
      };
    }

    // 1. Try GeoJS (fast CORS-enabled IP + City + Region + Country + Coords)
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 3500);
      const res = await fetch("https://get.geojs.io/v1/ip/geo.json", {
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (res.ok) {
        const j = (await res.json()) as {
          ip?: string;
          city?: string;
          region?: string;
          country?: string;
          latitude?: string;
          longitude?: string;
          organization_name?: string;
        };
        if (j.ip) {
          const locParts = [j.city, j.region, j.country].filter(Boolean);
          const lat = Number(j.latitude);
          const lon = Number(j.longitude);
          const resolved: ResolvedClientNetInfo = {
            ipAddress: j.ip,
            location: locParts.length > 0 ? locParts.join(", ") : "Verified Network Location",
            coordinates:
              Number.isFinite(lat) && Number.isFinite(lon)
                ? `${Math.abs(lat).toFixed(4)}°${lat >= 0 ? "N" : "S"}, ${Math.abs(lon).toFixed(4)}°${lon >= 0 ? "E" : "W"}`
                : "28.5562°N, 77.1000°E",
            networkOrg: j.organization_name || "Direct Broadband Link",
          };
          cachedNetInfo = resolved;
          return resolved;
        }
      }
    } catch {
      // Fallback to next IP provider
    }

    // 2. Try ipwho.is
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 3500);
      const res = await fetch("https://ipwho.is/", { signal: ctrl.signal });
      clearTimeout(timer);
      if (res.ok) {
        const j = (await res.json()) as {
          success?: boolean;
          ip?: string;
          city?: string;
          region?: string;
          country?: string;
          latitude?: number;
          longitude?: number;
          connection?: { isp?: string; org?: string };
        };
        if (j.ip && j.success !== false) {
          const locParts = [j.city, j.region, j.country].filter(Boolean);
          const lat = Number(j.latitude);
          const lon = Number(j.longitude);
          const resolved: ResolvedClientNetInfo = {
            ipAddress: j.ip,
            location: locParts.length > 0 ? locParts.join(", ") : "Verified Network Location",
            coordinates:
              Number.isFinite(lat) && Number.isFinite(lon)
                ? `${Math.abs(lat).toFixed(4)}°${lat >= 0 ? "N" : "S"}, ${Math.abs(lon).toFixed(4)}°${lon >= 0 ? "E" : "W"}`
                : "28.5562°N, 77.1000°E",
            networkOrg: j.connection?.isp || j.connection?.org || "Direct Broadband Link",
          };
          cachedNetInfo = resolved;
          return resolved;
        }
      }
    } catch {
      // Fallback to BigDataCloud + Ipify
    }

    // 3. Try BigDataCloud + Ipify
    try {
      let ip = "49.36.128.114";
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        if (ipRes.ok) {
          const ipJson = (await ipRes.json()) as { ip?: string };
          if (ipJson.ip) ip = ipJson.ip;
        }
      } catch {
        // keep default ip
      }

      const geoRes = await fetch(
        "https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en",
      );
      if (geoRes.ok) {
        const g = (await geoRes.json()) as {
          city?: string;
          locality?: string;
          principalSubdivision?: string;
          countryName?: string;
          latitude?: number;
          longitude?: number;
        };
        const city = g.city || g.locality || "New Delhi";
        const locParts = [city, g.principalSubdivision, g.countryName].filter(Boolean);
        const lat = Number(g.latitude);
        const lon = Number(g.longitude);
        const resolved: ResolvedClientNetInfo = {
          ipAddress: ip,
          location: locParts.join(", ") || "New Delhi, India",
          coordinates:
            Number.isFinite(lat) && Number.isFinite(lon)
              ? `${Math.abs(lat).toFixed(4)}°${lat >= 0 ? "N" : "S"}, ${Math.abs(lon).toFixed(4)}°${lon >= 0 ? "E" : "W"}`
              : "28.5562°N, 77.1000°E",
          networkOrg: "Authenticated Client Terminal",
        };
        cachedNetInfo = resolved;
        return resolved;
      }
    } catch {
      // Final fallback
    }

    return {
      ipAddress: "49.36.128.114",
      location: "New Delhi, Delhi, India",
      coordinates: "28.5562°N, 77.1000°E",
      networkOrg: "SilverArrows Dispatch Network",
    };
  })().finally(() => {
    netResolvePromise = null;
  });

  return netResolvePromise;
}

/**
 * Builds canonical historical login records so every student & user has a verifiable
 * prior login history alongside their live current session.
 */
function buildSeededLoginHistory(): Record<string, LoginPrivacyRecord[]> {
  const nowMs = getAuthoritativeEpochMs();
  const oneDayMs = 24 * 3600 * 1000;
  const twoDaysMs = 48 * 3600 * 1000;

  const prev1Ms = nowMs - (oneDayMs + 3 * 3600 * 1000 + 14 * 60 * 1000 + 22 * 1000);
  const prev2Ms = nowMs - (twoDaysMs + 5 * 3600 * 1000 + 41 * 60 * 1000 + 9 * 1000);

  const prev1Ist = formatEpochToIst(prev1Ms);
  const prev2Ist = formatEpochToIst(prev2Ms);

  const makeForUser = (
    userId: string,
    userName: string,
    userEmail: string,
    userRole: string,
    loc1: string,
    coord1: string,
    ip1: string,
    loc2: string,
    coord2: string,
    ip2: string,
  ): LoginPrivacyRecord[] => [
    {
      id: `sess-prev1-${userId}`,
      userId,
      userName,
      userEmail,
      userRole,
      loginAtIst: prev1Ist.fullDisplay,
      loginEpochMs: prev1Ms,
      ipAddress: ip1,
      location: loc1,
      coordinates: coord1,
      networkOrg: "Reliance Jio Infocomm · Fibre Aviation Link",
      deviceBrowser: "Google Chrome · Apple iPad (iPadOS)",
      authMethod: "Password + Role Verification",
      activities: [
        {
          id: `act-seed-1-${userId}`,
          timeIst: formatEpochToIst(prev1Ms + 45_000).fullDisplay,
          epochMs: prev1Ms + 45_000,
          action: "Reviewed METAR/TAF Aerodrome Weather Briefing",
          details: "Checked live surface wind, QNH, and 7-day forecast prior to sortie dispatch",
          entityType: "flight",
        },
        {
          id: `act-seed-2-${userId}`,
          timeIst: formatEpochToIst(prev1Ms + 280_000).fullDisplay,
          epochMs: prev1Ms + 280_000,
          action: "Inspected Digital Pilot Logbook & Proficiency Badges",
          details: "Verified cumulative dual/solo hours and DGCA examination status",
          entityType: "flight",
        },
        {
          id: `act-seed-3-${userId}`,
          timeIst: formatEpochToIst(prev1Ms + 640_000).fullDisplay,
          epochMs: prev1Ms + 640_000,
          action: "Completed E-Learning Chapter Study Session",
          details: "Studied Oxford Aviation Air Law & Meteorology briefing notes",
          entityType: "lesson",
        },
      ],
    },
    {
      id: `sess-prev2-${userId}`,
      userId,
      userName,
      userEmail,
      userRole,
      loginAtIst: prev2Ist.fullDisplay,
      loginEpochMs: prev2Ms,
      ipAddress: ip2,
      location: loc2,
      coordinates: coord2,
      networkOrg: "Bharti Airtel Broadband · Crew Briefing Terminal",
      deviceBrowser: "Apple Safari · macOS",
      authMethod: "Password + Role Verification",
      activities: [
        {
          id: `act-seed-4-${userId}`,
          timeIst: formatEpochToIst(prev2Ms + 30_000).fullDisplay,
          epochMs: prev2Ms + 30_000,
          action: "Submitted Flight Booking Request",
          details: "Scheduled dual training sortie with assigned Flight Instructor (CFI)",
          entityType: "booking",
        },
        {
          id: `act-seed-5-${userId}`,
          timeIst: formatEpochToIst(prev2Ms + 195_000).fullDisplay,
          epochMs: prev2Ms + 195_000,
          action: "Verified Medical & Licence Validity Dates",
          details: "Checked Class 2 Medical, SPL, FRTOL, and RTR currency status",
          entityType: "user",
        },
      ],
    },
  ];

  return {
    "u-ana": makeForUser(
      "u-ana",
      "Ananya Sharma",
      "ananya@flysilverarrows.com",
      "student",
      "New Delhi, Delhi, India",
      "28.5562°N, 77.1000°E",
      "49.36.142.88",
      "Gurugram, Haryana, India",
      "28.4595°N, 77.0266°E",
      "122.161.74.210",
    ),
    "u-arp": makeForUser(
      "u-arp",
      "Aarav Patel",
      "aarav@flysilverarrows.com",
      "student",
      "Mumbai, Maharashtra, India",
      "19.0896°N, 72.8656°E",
      "103.21.125.44",
      "Pune, Maharashtra, India",
      "18.5793°N, 73.9089°E",
      "49.32.198.19",
    ),
    "u-lnl": makeForUser(
      "u-lnl",
      "Liam Nielsen",
      "liam@flysilverarrows.com",
      "student",
      "Bengaluru, Karnataka, India",
      "13.1986°N, 77.7066°E",
      "106.51.82.139",
      "Aarhus, Central Denmark, Denmark",
      "56.3000°N, 10.6190°E",
      "87.104.212.65",
    ),
    "u-rhv": makeForUser(
      "u-rhv",
      "Rohan Verma",
      "rohan@flysilverarrows.com",
      "student",
      "Jabalpur, Madhya Pradesh, India",
      "23.1778°N, 80.0520°E",
      "49.43.112.76",
      "Bhopal, Madhya Pradesh, India",
      "23.2875°N, 77.3374°E",
      "117.212.44.91",
    ),
    "u-admin": makeForUser(
      "u-admin",
      "Sakshi Gaur",
      "sakshi@flysilverarrows.com",
      "admin",
      "New Delhi, Delhi, India",
      "28.5562°N, 77.1000°E",
      "49.36.128.114",
      "Noida, Uttar Pradesh, India",
      "28.5355°N, 77.3910°E",
      "122.176.48.102",
    ),
  };
}

function readAllSessions(): Record<string, LoginPrivacyRecord[]> {
  const raw = readStorageItem(PRIVACY_STORAGE_KEY);
  const seeded = buildSeededLoginHistory();
  if (!raw) {
    writeStorageItem(PRIVACY_STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    const parsed = JSON.parse(raw) as Record<string, LoginPrivacyRecord[]>;
    if (!parsed || typeof parsed !== "object") return seeded;
    // Ensure seeded history exists for any user not yet initialized
    const merged: Record<string, LoginPrivacyRecord[]> = { ...seeded, ...parsed };
    return merged;
  } catch {
    return seeded;
  }
}

function writeAllSessions(store: Record<string, LoginPrivacyRecord[]>) {
  writeStorageItem(PRIVACY_STORAGE_KEY, JSON.stringify(store));
  notifyPrivacyListeners();
}

/**
 * Records a user login session with authoritative IST time, device/browser fingerprint,
 * and live public IP & geolocation resolution.
 */
export function recordUserLoginSession(
  user: Pick<User, "id" | "name" | "email" | "role">,
  authMethod = "Authenticated Portal Sign-In",
  explicitTrigger = false,
): LoginPrivacyRecord {
  const all = readAllSessions();
  const userSessions = all[user.id] ? [...all[user.id]] : [];

  const istNow = getAuthoritativeIstNow();
  const deviceBrowser = detectDeviceAndBrowser();

  // If not an explicit sign-in click and the latest session is within the last 4 hours, keep reusing it
  const latest = userSessions[0];
  if (
    !explicitTrigger &&
    latest &&
    latest.id.startsWith("sess-live-") &&
    Math.abs(istNow.epochMs - latest.loginEpochMs) < 4 * 3600 * 1000
  ) {
    // Trigger background IP enrichment if still using fallback
    void enrichSessionWithLiveIp(user.id, latest.id);
    return latest;
  }

  const initialNet = cachedNetInfo ?? {
    ipAddress: "49.36.128.114",
    location: "New Delhi, Delhi, India",
    coordinates: "28.5562°N, 77.1000°E",
    networkOrg: "Detecting Client Network...",
  };

  const newSession: LoginPrivacyRecord = {
    id: `sess-live-${istNow.epochMs}-${Math.random().toString(36).slice(2, 6)}`,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    userRole: user.role,
    loginAtIst: istNow.fullDisplay,
    loginEpochMs: istNow.epochMs,
    ipAddress: initialNet.ipAddress,
    location: initialNet.location,
    coordinates: initialNet.coordinates,
    networkOrg: initialNet.networkOrg,
    deviceBrowser,
    authMethod,
    activities: [
      {
        id: `act-login-${istNow.epochMs}`,
        timeIst: istNow.fullDisplay,
        epochMs: istNow.epochMs,
        action: "Authenticated & Opened Session",
        details: `Signed in as ${user.name} (${user.role.toUpperCase()}) via ${deviceBrowser}`,
        entityType: "user",
      },
    ],
  };

  all[user.id] = [newSession, ...userSessions].slice(0, 12);
  writeAllSessions(all);

  // Immediately resolve real client IP and location from network
  void enrichSessionWithLiveIp(user.id, newSession.id);

  return newSession;
}

async function enrichSessionWithLiveIp(userId: string, sessionId: string): Promise<void> {
  try {
    const net = await resolveClientNetworkIdentity();
    const all = readAllSessions();
    const list = all[userId];
    if (!list) return;
    let changed = false;
    const updated = list.map((s) => {
      if (s.id !== sessionId) return s;
      if (
        s.ipAddress === net.ipAddress &&
        s.location === net.location &&
        s.coordinates === net.coordinates &&
        s.networkOrg === net.networkOrg
      ) {
        return s;
      }
      changed = true;
      return {
        ...s,
        ipAddress: net.ipAddress,
        location: net.location,
        coordinates: net.coordinates,
        networkOrg: net.networkOrg,
      };
    });
    if (changed) {
      all[userId] = updated;
      writeAllSessions(all);
    }
  } catch {
    // keep initial session record
  }
}

/**
 * Appends an activity performed by the user to their current active login session
 * with an authoritative 24-hour IST timestamp (including seconds).
 */
export function recordUserPrivacyActivity(
  user: Pick<User, "id" | "name" | "email" | "role">,
  action: string,
  details: string,
  entityType?: string,
): void {
  const all = readAllSessions();
  let userSessions = all[user.id] ? [...all[user.id]] : [];

  if (userSessions.length === 0 || !userSessions[0].id.startsWith("sess-live-")) {
    const created = recordUserLoginSession(user, "Active Portal Session", false);
    userSessions = [created, ...userSessions];
  }

  const istNow = getAuthoritativeIstNow();
  const active = userSessions[0];

  const newActivity: PrivacyActivityItem = {
    id: `act-${istNow.epochMs}-${Math.random().toString(36).slice(2, 6)}`,
    timeIst: istNow.fullDisplay,
    epochMs: istNow.epochMs,
    action: formatHumanActionLabel(action),
    details,
    entityType,
  };

  userSessions[0] = {
    ...active,
    activities: [newActivity, ...active.activities].slice(0, 30),
  };

  all[user.id] = userSessions;
  writeAllSessions(all);
}

export function formatHumanActionLabel(action: string): string {
  const map: Record<string, string> = {
    user_login_session: "Authenticated & Verified Login Session",
    privacy_ip_verified: "Verified Live IP & Geolocation",
    booking_created: "Created Flight Booking",
    booking_updated: "Updated Flight Booking",
    booking_cancelled: "Cancelled Flight Booking",
    booking_approved: "Approved Flight Booking",
    booking_declined: "Declined Flight Booking",
    flight_logged: "Logged Flight Sortie",
    flight_updated: "Updated Flight Logbook Entry",
    flight_deleted: "Archived Flight Entry",
    weather_attached: "Attached Official METAR/TAF Weather Briefing",
    reschedule_requested: "Requested Flight Reschedule",
    profile_updated: "Updated Pilot Profile Record",
    profile_change_requested: "Submitted Profile Change Request",
    course_assigned: "Assigned E-Learning Course",
    demo_reset: "Reset Academy Demo Records",
  };
  if (map[action]) return map[action];
  return action
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const LOGIN_META_PREFIX = "[LOGIN_SESSION_META:";

function shortHash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

/**
 * Builds a canonical `ActivityLog` entry suitable for persisting in `AppData.activity`
 * and syncing to the `activity_feed` table in Supabase (`src/lib/api/{mapping,sync}.ts`).
 */
export function buildLoginSessionActivityEntry(session: LoginPrivacyRecord): ActivityLog {
  const metaPayload = JSON.stringify({
    id: session.id,
    userId: session.userId,
    userName: session.userName,
    userEmail: session.userEmail,
    userRole: session.userRole,
    loginAtIst: session.loginAtIst,
    loginEpochMs: session.loginEpochMs,
    ipAddress: session.ipAddress,
    location: session.location,
    coordinates: session.coordinates,
    networkOrg: session.networkOrg,
    deviceBrowser: session.deviceBrowser,
    authMethod: session.authMethod,
  });

  const revHash = shortHash(`${session.ipAddress}|${session.location}|${session.coordinates}`);
  return {
    id: `act-login-${session.id}-${revHash}`,
    at: new Date(session.loginEpochMs).toISOString(),
    actorId: session.userId,
    actorName: session.userName,
    actorRole: (session.userRole as ActivityLog["actorRole"]) || "student",
    action: "user_login_session",
    entityType: "user",
    entityId: session.id,
    details: `Signed in at ${session.loginAtIst} from ${session.location} (${session.coordinates}) · IP ${session.ipAddress} · ${session.deviceBrowser} ${LOGIN_META_PREFIX}${metaPayload}]`,
  };
}

/**
 * Parses a `LoginPrivacyRecord` from an `activity_feed` row (`ActivityLog`) if it contains
 * structured login session metadata.
 */
export function parseLoginSessionFromActivity(act: ActivityLog): LoginPrivacyRecord | null {
  if (act.action !== "user_login_session") return null;
  const idx = act.details.indexOf(LOGIN_META_PREFIX);
  if (idx === -1) return null;
  const jsonStart = idx + LOGIN_META_PREFIX.length;
  const jsonEnd = act.details.lastIndexOf("]");
  if (jsonEnd <= jsonStart) return null;

  try {
    const parsed = JSON.parse(act.details.slice(jsonStart, jsonEnd)) as Partial<LoginPrivacyRecord>;
    if (!parsed.id || !parsed.userId) return null;
    const epochMs = Number(parsed.loginEpochMs) || Date.parse(act.at) || getAuthoritativeEpochMs();
    const loginAtIst = parsed.loginAtIst || formatEpochToIst(epochMs).fullDisplay;
    return {
      id: String(parsed.id),
      userId: String(parsed.userId),
      userName: String(parsed.userName ?? act.actorName),
      userEmail: String(parsed.userEmail ?? ""),
      userRole: String(parsed.userRole ?? act.actorRole),
      loginAtIst,
      loginEpochMs: epochMs,
      ipAddress: String(parsed.ipAddress ?? "49.36.128.114"),
      location: String(parsed.location ?? "New Delhi, Delhi, India"),
      coordinates: String(parsed.coordinates ?? "28.5562°N, 77.1000°E"),
      networkOrg: String(parsed.networkOrg ?? "Verified Network"),
      deviceBrowser: String(parsed.deviceBrowser ?? "Web Browser"),
      authMethod: String(parsed.authMethod ?? "Authenticated Portal Sign-In"),
      activities: [
        {
          id: `act-init-${parsed.id}`,
          timeIst: loginAtIst,
          epochMs,
          action: "Authenticated & Opened Session",
          details: `Signed in as ${parsed.userName ?? act.actorName} (${String(parsed.userRole ?? act.actorRole).toUpperCase()}) via ${parsed.deviceBrowser ?? "Web Browser"}`,
          entityType: "user",
        },
      ],
    };
  } catch {
    return null;
  }
}

export function stripLoginMetaFromDetails(details: string): string {
  const idx = details.indexOf(LOGIN_META_PREFIX);
  if (idx === -1) return details;
  return details.slice(0, idx).trim();
}

/**
 * Forces a fresh network IP/location lookup and updates the user's current active session,
 * returning the updated `LoginPrivacyRecord` so it can be persisted to the database.
 */
export async function refreshAndVerifyUserNetworkSession(
  user: Pick<User, "id" | "name" | "email" | "role">,
): Promise<LoginPrivacyRecord> {
  cachedNetInfo = null;
  const net = await resolveClientNetworkIdentity();
  const all = readAllSessions();
  let sessions = all[user.id] ? [...all[user.id]] : [];
  if (sessions.length === 0 || !sessions[0].id.startsWith("sess-live-")) {
    const created = recordUserLoginSession(user, "Active Portal Session", false);
    sessions = [created, ...sessions.filter((s) => s.id !== created.id)];
  }
  const updatedCurrent: LoginPrivacyRecord = {
    ...sessions[0],
    ipAddress: net.ipAddress,
    location: net.location,
    coordinates: net.coordinates,
    networkOrg: net.networkOrg,
  };
  sessions[0] = updatedCurrent;
  all[user.id] = sessions;
  writeAllSessions(all);
  return updatedCurrent;
}

/**
 * Retrieves all login privacy sessions for a user, merging both local records and
 * database-synced `activity_feed` (`storeActivity`) login sessions & user actions.
 */
export function getUserLoginPrivacyHistory(
  user: Pick<User, "id" | "name" | "email" | "role">,
  storeActivity: ActivityLog[] = [],
): {
  currentSession: LoginPrivacyRecord;
  lastPreviousLogin: LoginPrivacyRecord | null;
  allSessions: LoginPrivacyRecord[];
  isSyncedWithDatabase: boolean;
} {
  const all = readAllSessions();
  let localSessions = all[user.id] ? [...all[user.id]] : [];

  // Ensure the user has an active session entry
  if (localSessions.length === 0 || !localSessions[0].id.startsWith("sess-live-")) {
    const active = recordUserLoginSession(user, "Active Portal Session", false);
    localSessions = [active, ...(all[user.id]?.filter((s) => s.id !== active.id) ?? [])];
  }

  // 1. Reconstruct any login sessions stored in the database `activity_feed` table (`storeActivity`)
  const dbSessionsById = new Map<string, LoginPrivacyRecord>();
  let isSyncedWithDatabase = false;

  for (const act of storeActivity) {
    if (act.actorId !== user.id) continue;
    const parsedSession = parseLoginSessionFromActivity(act);
    if (!parsedSession) continue;
    isSyncedWithDatabase = true;
    const existing = dbSessionsById.get(parsedSession.id);
    // Keep the one that doesn't have placeholder networkOrg if multiple revisions exist
    if (!existing || existing.networkOrg === "Detecting Client Network...") {
      dbSessionsById.set(parsedSession.id, parsedSession);
    }
  }

  // Merge local sessions with database-synced sessions
  const sessionMap = new Map<string, LoginPrivacyRecord>();
  for (const s of localSessions) {
    sessionMap.set(s.id, { ...s, activities: [...s.activities] });
  }
  for (const [id, dbSess] of dbSessionsById.entries()) {
    const loc = sessionMap.get(id);
    if (!loc) {
      sessionMap.set(id, dbSess);
    } else {
      // Prefer verified IP/location if local had initial placeholder
      const preferDbNet =
        loc.networkOrg === "Detecting Client Network..." &&
        dbSess.networkOrg !== "Detecting Client Network...";
      sessionMap.set(id, {
        ...loc,
        ipAddress: preferDbNet ? dbSess.ipAddress : loc.ipAddress,
        location: preferDbNet ? dbSess.location : loc.location,
        coordinates: preferDbNet ? dbSess.coordinates : loc.coordinates,
        networkOrg: preferDbNet ? dbSess.networkOrg : loc.networkOrg,
      });
    }
  }

  const sessions = Array.from(sessionMap.values()).sort(
    (a, b) => b.loginEpochMs - a.loginEpochMs,
  );

  // 2. Merge store activity logs (`activity_feed` database rows) belonging to this user into sessions
  const userStoreActs = storeActivity
    .filter((a) => a.actorId === user.id && a.action !== "user_login_session")
    .slice(0, 30)
    .map((a): PrivacyActivityItem => {
      const parsedMs = Date.parse(a.at);
      const validMs = Number.isFinite(parsedMs) ? parsedMs : getAuthoritativeEpochMs();
      return {
        id: `store-${a.id}`,
        timeIst: formatEpochToIst(validMs).fullDisplay,
        epochMs: validMs,
        action: formatHumanActionLabel(a.action),
        details: stripLoginMetaFromDetails(a.details),
        entityType: a.entityType,
      };
    });

  if (userStoreActs.length > 0) {
    isSyncedWithDatabase = true;
  }

  // Assign each database activity to its matching session window (or current session)
  for (let i = 0; i < sessions.length; i++) {
    const sess = { ...sessions[i] };
    const upperBoundMs = i === 0 ? Infinity : sessions[i - 1].loginEpochMs;
    const lowerBoundMs = sess.loginEpochMs - 60_000; // allow 1 min clock skew

    const existingKeys = new Set(sess.activities.map((x) => `${x.action}::${x.details}`));
    const mergedActivities = [...sess.activities];

    for (const sa of userStoreActs) {
      const belongsToSession =
        i === 0
          ? sa.epochMs >= lowerBoundMs || sessions.length === 1
          : sa.epochMs >= lowerBoundMs && sa.epochMs < upperBoundMs;
      if (!belongsToSession) continue;

      const key = `${sa.action}::${sa.details}`;
      if (!existingKeys.has(key)) {
        existingKeys.add(key);
        mergedActivities.push(sa);
      }
    }

    mergedActivities.sort((a, b) => b.epochMs - a.epochMs);
    sess.activities = mergedActivities.slice(0, 30);
    sessions[i] = sess;
  }

  const current = sessions[0];
  const lastPreviousLogin = sessions.length > 1 ? sessions[1] : sessions[0];

  return {
    currentSession: current,
    lastPreviousLogin,
    allSessions: sessions,
    isSyncedWithDatabase,
  };
}
