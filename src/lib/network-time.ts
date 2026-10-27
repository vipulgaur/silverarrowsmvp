/**
 * Authoritative IST (Indian Standard Time · UTC+05:30) Network Time Engine.
 *
 * SECURITY & ANTI-TAMPER DESIGN:
 * - Never relies on raw `Date.now()` or client OS timezone for ongoing clock display,
 *   because a user can manually change their computer/mobile system clock or timezone.
 * - Fetches authoritative UTC/IST time from external time servers and HTTP `Date` headers,
 *   then anchors that epoch to `performance.now()` (the hardware monotonic timer).
 * - Even if the user alters their system date/time while using the platform, `performance.now()`
 *   advances strictly monotonically at 1000ms per real second.
 */

export interface IstClockSnapshot {
  /** Authoritative UTC epoch in milliseconds */
  epochMs: number;
  /** Full weekday name in IST, e.g. "Tuesday" */
  weekdayFull: string;
  /** Short weekday name in IST, e.g. "Tue" */
  weekdayShort: string;
  /** Formatted date in IST, e.g. "27 Oct 2026" */
  dateLabel: string;
  /** Numeric date in IST, e.g. "27/10/2026" */
  dateNumeric: string;
  /** 24-hour time with seconds in IST, e.g. "19:45:08" */
  time24: string;
  /** Combined display string, e.g. "Tue, 27 Oct 2026 · 19:45:08 IST" */
  fullDisplay: string;
  /** ISO-8601 timestamp in IST (+05:30) */
  isoIst: string;
  /** Whether the clock has completed at least one live network time handshake */
  networkSynced: boolean;
  /** Source of the authoritative time anchor */
  source: string;
}

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000; // +05:30 in milliseconds (19,800,000 ms)

const WEEKDAYS_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function safePerfNow(): number {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return 0;
}

// Initial monotonic anchor captured once at module load before any user clock tampering
let anchorEpochMs: number = Date.now();
let anchorPerfMs: number = safePerfNow();
let isNetworkVerified = false;
let timeSource = "Monotonic Boot Anchor (Syncing IST...)";
let syncInFlight: Promise<void> | null = null;
let periodicSyncStarted = false;

const listeners = new Set<() => void>();

function notifyListeners() {
  for (const fn of listeners) {
    try {
      fn();
    } catch {
      // ignore listener errors
    }
  }
}

function setAuthoritativeAnchor(networkEpochMs: number, rttMs: number, sourceLabel: string) {
  if (!Number.isFinite(networkEpochMs) || networkEpochMs <= 1_600_000_000_000) {
    return;
  }
  const compensatedEpoch = Math.round(networkEpochMs + Math.max(0, Math.min(rttMs / 2, 2000)));
  anchorEpochMs = compensatedEpoch;
  anchorPerfMs = safePerfNow();
  isNetworkVerified = true;
  timeSource = sourceLabel;
  notifyListeners();
}

/**
 * Returns the current authoritative UTC epoch milliseconds using the network anchor
 * + hardware monotonic elapsed time (`performance.now()`).
 */
export function getAuthoritativeEpochMs(): number {
  const elapsed = Math.max(0, safePerfNow() - anchorPerfMs);
  return Math.round(anchorEpochMs + elapsed);
}

function pad2(n: number): string {
  return String(Math.floor(Math.abs(n))).padStart(2, "0");
}

/**
 * Formats any UTC epoch millisecond value into Indian Standard Time (Asia/Kolkata, UTC+05:30)
 * using pure UTC arithmetic so the client OS timezone setting can never skew the result.
 */
export function formatEpochToIst(epochMs: number): IstClockSnapshot {
  const istShiftedMs = epochMs + IST_OFFSET_MS;
  const d = new Date(istShiftedMs);

  const year = d.getUTCFullYear();
  const monthIdx = d.getUTCMonth();
  const dayOfMonth = d.getUTCDate();
  const dayOfWeek = d.getUTCDay();
  const hours24 = d.getUTCHours();
  const minutes = d.getUTCMinutes();
  const seconds = d.getUTCSeconds();

  const weekdayFull = WEEKDAYS_FULL[dayOfWeek] ?? "Monday";
  const weekdayShort = WEEKDAYS_SHORT[dayOfWeek] ?? "Mon";
  const monthShort = MONTHS_SHORT[monthIdx] ?? "Jan";

  const dd = pad2(dayOfMonth);
  const mm = pad2(monthIdx + 1);
  const hh = pad2(hours24);
  const min = pad2(minutes);
  const ss = pad2(seconds);

  const dateLabel = `${dd} ${monthShort} ${year}`;
  const dateNumeric = `${dd}/${mm}/${year}`;
  const time24 = `${hh}:${min}:${ss}`;
  const fullDisplay = `${weekdayShort}, ${dateLabel} · ${time24} IST`;
  const isoIst = `${year}-${mm}-${dd}T${hh}:${min}:${ss}+05:30`;

  return {
    epochMs,
    weekdayFull,
    weekdayShort,
    dateLabel,
    dateNumeric,
    time24,
    fullDisplay,
    isoIst,
    networkSynced: isNetworkVerified,
    source: timeSource,
  };
}

/**
 * Returns the live authoritative IST clock snapshot right now.
 */
export function getAuthoritativeIstNow(): IstClockSnapshot {
  return formatEpochToIst(getAuthoritativeEpochMs());
}

/**
 * Synchronizes the authoritative IST time anchor from independent network endpoints.
 * Falls back across multiple sources:
 * 1. WorldTimeAPI (`Asia/Kolkata`)
 * 2. TimeAPI.io (`Asia/Kolkata`)
 * 3. Server HTTP `Date` response header from origin or Open-Meteo API
 */
export async function syncAuthoritativeNetworkTime(): Promise<void> {
  if (typeof window === "undefined" || typeof fetch !== "function") return;
  if (syncInFlight) return syncInFlight;

  syncInFlight = (async () => {
    // 1. Try WorldTimeAPI (Asia/Kolkata)
    try {
      const t0 = safePerfNow();
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 3500);
      const res = await fetch("https://worldtimeapi.org/api/timezone/Asia/Kolkata", {
        cache: "no-store",
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (res.ok) {
        const rtt = safePerfNow() - t0;
        const json = (await res.json()) as { unixtime?: number; datetime?: string };
        if (typeof json.unixtime === "number" && json.unixtime > 1_600_000_000) {
          setAuthoritativeAnchor(json.unixtime * 1000, rtt, "WorldTimeAPI (Asia/Kolkata IST)");
          return;
        }
        if (typeof json.datetime === "string") {
          const parsed = Date.parse(json.datetime);
          if (Number.isFinite(parsed)) {
            setAuthoritativeAnchor(parsed, rtt, "WorldTimeAPI (Asia/Kolkata IST)");
            return;
          }
        }
      }
    } catch {
      // Continue to next network time provider
    }

    // 2. Try TimeAPI.io (Asia/Kolkata)
    try {
      const t0 = safePerfNow();
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 3500);
      const res = await fetch(
        "https://timeapi.io/api/Time/current/zone?timeZone=Asia/Kolkata",
        {
          cache: "no-store",
          signal: ctrl.signal,
        },
      );
      clearTimeout(timer);
      if (res.ok) {
        const rtt = safePerfNow() - t0;
        const json = (await res.json()) as {
          year?: number;
          month?: number;
          day?: number;
          hour?: number;
          minute?: number;
          seconds?: number;
          milliSeconds?: number;
        };
        if (
          typeof json.year === "number" &&
          typeof json.month === "number" &&
          typeof json.day === "number" &&
          typeof json.hour === "number" &&
          typeof json.minute === "number" &&
          typeof json.seconds === "number"
        ) {
          // TimeAPI returns fields already in Asia/Kolkata (UTC+05:30). Convert back to UTC epoch:
          const istAsUtc = Date.UTC(
            json.year,
            json.month - 1,
            json.day,
            json.hour,
            json.minute,
            json.seconds,
            json.milliSeconds ?? 0,
          );
          const utcEpoch = istAsUtc - IST_OFFSET_MS;
          setAuthoritativeAnchor(utcEpoch, rtt, "TimeAPI.io (Asia/Kolkata IST)");
          return;
        }
      }
    } catch {
      // Continue to HTTP Date header check
    }

    // 3. Try HTTP Date header from live server or public CDN endpoint
    const headerUrls = [
      "/api/local-sync",
      window.location.origin,
      "https://api.open-meteo.com/v1/forecast?latitude=28.5562&longitude=77.1000&current=temperature_2m",
    ];
    for (const url of headerUrls) {
      try {
        const t0 = safePerfNow();
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 3000);
        const res = await fetch(url, {
          method: url.startsWith("http") ? "GET" : "HEAD",
          cache: "no-store",
          signal: ctrl.signal,
        });
        clearTimeout(timer);
        const dateHeader = res.headers.get("date") || res.headers.get("Date");
        if (dateHeader) {
          const parsed = Date.parse(dateHeader);
          if (Number.isFinite(parsed) && parsed > 1_600_000_000_000) {
            const rtt = safePerfNow() - t0;
            setAuthoritativeAnchor(parsed, rtt, "Network HTTP Date Authority (IST)");
            return;
          }
        }
      } catch {
        // try next URL
      }
    }
  })().finally(() => {
    syncInFlight = null;
  });

  return syncInFlight;
}

/**
 * Starts background periodic network IST synchronization (every 60s + on tab focus/online).
 */
export function ensureAuthoritativeTimeDaemon(): () => void {
  if (typeof window === "undefined") return () => {};

  if (!periodicSyncStarted) {
    periodicSyncStarted = true;
    void syncAuthoritativeNetworkTime();

    window.setInterval(() => {
      void syncAuthoritativeNetworkTime();
    }, 60_000);

    window.addEventListener("online", () => {
      void syncAuthoritativeNetworkTime();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        void syncAuthoritativeNetworkTime();
      }
    });
  }

  return () => {};
}

export function subscribeAuthoritativeTime(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
