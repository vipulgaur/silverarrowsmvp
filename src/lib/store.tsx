import { toast } from "sonner";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ActivityLog, AppData, Booking, Flight, User } from "./types";
import { seedData } from "./seed";
import { uid } from "./logic";
import { enrichWithSeedDefaults, readDemoData, writeDemoData } from "./demo-storage";
import {
  findOrCreateLocalUser,
  getStoredDemoSession,
  isTestEnv,
  supabase,
} from "@/integrations/supabase/client";
import { loadAcademy, persistBooking, pushChanges } from "./api/sync";
import {
  fetchLocalSync,
  initLocalSyncListener,
  pushLocalSync,
  resetLocalSync,
} from "./api/local-sync-client";
import {
  diffTables,
  fromTables,
  hasChanges,
  mergePending,
  toAppMemberId,
  toTables,
  type Tables,
} from "./api/mapping";
import { mergeCourseAssignments, writeStoredCourseAssignments } from "./elearning-courses";
import {
  buildWeatherForBookingDate,
  enrichBookingWithWeather,
  formatRemarksWithWeather,
} from "./weather";
import {
  buildLoginSessionActivityEntry,
  getUserLoginPrivacyHistory,
  recordUserLoginSession,
  recordUserPrivacyActivity,
  subscribePrivacyTracker,
} from "./privacy-tracker";

/** Background sync status surfaced to the UI so failed server writes are visible. */
export type SyncState = "idle" | "syncing" | "synced" | "error";

interface Store {
  data: AppData;
  hydrated: boolean;
  me: User | null;
  noAccess: boolean;
  /** Status of the most recent background sync with the server (Supabase). */
  syncState: SyncState;
  signOut: () => Promise<void>;
  reload: () => Promise<void>;
  update: (fn: (d: AppData) => AppData) => void;
  reset: () => void;
  saveFlight: (f: Flight) => void;
  deleteFlight: (id: string) => void;
  saveBooking: (b: Booking) => Promise<void>;
  log: (
    action: string,
    entityType: ActivityLog["entityType"],
    details: string,
    entityId?: string,
  ) => void;
  commit: (result: AppData | string) => string | null;
}

const Ctx = createContext<Store | null>(null);

const ACTIVE_USER_SESSION_KEY = "silverarrows_active_member_session";

function getCachedActiveSession(): { id: string; email: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ACTIVE_USER_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.id === "string") return parsed;
    return null;
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => {
    if (!isTestEnv) {
      return mergeCourseAssignments(seedData());
    }
    const initial = readDemoData().data;
    const merged = mergeCourseAssignments(initial);
    writeStoredCourseAssignments(merged.activity);
    return merged;
  });

  const [meId, setMeId] = useState<string | null>(() => {
    if (!isTestEnv) return null;
    const demoSession = getStoredDemoSession();
    if (demoSession?.user?.id) {
      return toAppMemberId(demoSession.user.id, demoSession.user.email);
    }
    const cached = getCachedActiveSession();
    if (cached?.id) {
      return cached.id;
    }
    return null;
  });

  const [noAccess, setNoAccess] = useState(false);
  const [hydrated, setHydrated] = useState<boolean>(() => {
    if (!isTestEnv) return false;
    if (typeof window === "undefined") return false;
    const demoSession = getStoredDemoSession();
    const cached = getCachedActiveSession();
    return !!(demoSession?.user || cached?.id);
  });
  const [activeTenantId, setActiveTenantId] = useState<string | null>(null);
  const [syncState, setSyncState] = useState<SyncState>("idle");

  const latest = useRef<AppData>(data);
  latest.current = data;

  const tenantIdRef = useRef<string | null>(null);
  const baselineRef = useRef<Tables | null>(null);
  const isSyncingRef = useRef(false);
  // Throttle repeated sync-failure toasts so a flaky connection doesn't spam.
  const lastSyncErrorToastRef = useRef<number>(0);

  const notifySyncFailure = useCallback((err: unknown) => {
    console.warn("Background sync warning:", err);
    setSyncState("error");
    const now = Date.now();
    if (now - lastSyncErrorToastRef.current > 15000) {
      lastSyncErrorToastRef.current = now;
      toast.error(
        "Some changes could not be saved to the academy database and are kept locally. They will retry automatically when the connection is restored.",
      );
    }
  }, []);

  const applyAndSync = useCallback(
    (next: AppData) => {
      const merged = mergeCourseAssignments(next);
      writeStoredCourseAssignments(merged.activity);
      writeDemoData(merged);
      pushLocalSync(merged);
      latest.current = merged;
      setData(merged);

      if (tenantIdRef.current && baselineRef.current) {
        const nextTables = toTables(merged, tenantIdRef.current);
        const diff = diffTables(baselineRef.current, nextTables);
        baselineRef.current = nextTables;
        if (hasChanges(diff)) {
          setSyncState("syncing");
          void pushChanges(diff, tenantIdRef.current)
            .then(() => setSyncState("synced"))
            .catch((err) => notifySyncFailure(err));
        }
      }
    },
    [notifySyncFailure],
  );

  const syncFromServerOrLocal = useCallback(async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;

    try {
      const demoSession = getStoredDemoSession();

      // 1. In unit tests, resolve local demoSession synchronously without network
      if (demoSession && isTestEnv) {
        tenantIdRef.current = null;
        setActiveTenantId(null);
        baselineRef.current = null;
        const sharedSnapshot = await fetchLocalSync();
        const baseData = sharedSnapshot ?? readDemoData().data;
        const fresh = mergeCourseAssignments(baseData);
        writeDemoData(fresh);
        latest.current = fresh;
        setData(fresh);
        setMeId(toAppMemberId(demoSession.user.id, demoSession.user.email));
        setNoAccess(false);
        setHydrated(true);
        return;
      }

      // 2. Check cached local session first (instant, non-blocking)
      const { data: sessionData } = await supabase.auth.getSession();
      const sessionUser = sessionData?.session?.user ?? null;
      let authUser = sessionUser ?? demoSession?.user ?? null;

      if (!authUser) {
        try {
          const { data: authData } = await supabase.auth.getUser();
          if (authData?.user) {
            authUser = authData.user;
          }
        } catch {
          /* transient network failure */
        }
      }

      if (authUser) {
        try {
          const loaded = await loadAcademy(authUser.id, authUser.email);
          if (loaded) {
            tenantIdRef.current = loaded.tenantId;
            setActiveTenantId(loaded.tenantId);
            const remoteTables = toTables(loaded.data, loaded.tenantId);
            const pendingDiff = baselineRef.current
              ? diffTables(baselineRef.current, toTables(latest.current, loaded.tenantId))
              : null;
            const reconciledTables =
              pendingDiff && hasChanges(pendingDiff)
                ? mergePending(remoteTables, pendingDiff)
                : remoteTables;

            const reconciledData = mergeCourseAssignments(
              enrichWithSeedDefaults(fromTables(reconciledTables), latest.current),
            );
            baselineRef.current = toTables(reconciledData, loaded.tenantId);
            writeStoredCourseAssignments(reconciledData.activity);
            writeDemoData(reconciledData);
            latest.current = reconciledData;
            setData(reconciledData);

            const canonicalMeId = toAppMemberId(loaded.meId, authUser.email);
            setMeId(canonicalMeId);
            if (typeof window !== "undefined") {
              try {
                window.localStorage.setItem(
                  ACTIVE_USER_SESSION_KEY,
                  JSON.stringify({ id: canonicalMeId, email: authUser.email }),
                );
              } catch {}
            }
            setNoAccess(false);
            setHydrated(true);
            setSyncState("synced");
            return;
          }
        } catch (err) {
          console.warn("Failed to load academy from Supabase:", err);
          // Authenticated but the server load failed: surface it. The session
          // remains usable from the local mirror below.
          setSyncState("error");
          const now = Date.now();
          if (now - lastSyncErrorToastRef.current > 15000) {
            lastSyncErrorToastRef.current = now;
            toast.error(
              "Could not reach the academy database. Showing locally stored data; changes will sync when the connection is restored.",
            );
          }
        }

        // Graceful fallback if Supabase loadAcademy returns null or errors for an authenticated user
        const fallbackData = mergeCourseAssignments(
          enrichWithSeedDefaults(readDemoData().data, latest.current),
        );
        const emailLower = (authUser.email ?? "").trim().toLowerCase();
        const canonicalId = toAppMemberId(authUser.id, emailLower);
        let matchedUser =
          fallbackData.users.find((u) => u.id === canonicalId && u.status !== "deleted") ??
          fallbackData.users.find(
            (u) => u.email.trim().toLowerCase() === emailLower && u.status !== "deleted",
          );

        // If authenticated user is not in the fallback roster yet, ensure their member profile exists locally
        if (!matchedUser && authUser.email) {
          matchedUser = findOrCreateLocalUser(authUser.email);
          fallbackData.users = [
            ...fallbackData.users.filter((u) => u.email.toLowerCase() !== emailLower),
            matchedUser,
          ];
        }

        if (matchedUser) {
          writeDemoData(fallbackData);
          latest.current = fallbackData;
          setData(fallbackData);
          setMeId(matchedUser.id);
          if (typeof window !== "undefined") {
            try {
              window.localStorage.setItem(
                ACTIVE_USER_SESSION_KEY,
                JSON.stringify({ id: matchedUser.id, email: authUser.email }),
              );
            } catch {}
          }
          setNoAccess(false);
          setHydrated(true);
          return;
        }
      }

      // Check if we already have an active known session in cache before dropping session
      const cached = getCachedActiveSession();
      if (cached?.id) {
        let existing = latest.current.users.find(
          (u) =>
            (u.id === cached.id ||
              u.id === toAppMemberId(cached.id) ||
              (cached.email && u.email.toLowerCase() === cached.email.toLowerCase())) &&
            u.status !== "deleted",
        );
        if (!existing && cached.email) {
          existing = findOrCreateLocalUser(cached.email);
          const next = {
            ...latest.current,
            users: [...latest.current.users.filter((u) => u.id !== existing!.id), existing],
          };
          latest.current = next;
          setData(next);
          writeDemoData(next);
        }
        if (existing) {
          setMeId(existing.id);
          setNoAccess(false);
          setHydrated(true);
          return;
        }
      }

      // Truly unauthenticated (e.g. fresh visitor on login page)
      tenantIdRef.current = null;
      setActiveTenantId(null);
      baselineRef.current = null;
      setMeId(null);
      setNoAccess(false);
      setHydrated(true);
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!isTestEnv && typeof window !== "undefined") {
      const localInitial = mergeCourseAssignments(readDemoData().data);
      writeStoredCourseAssignments(localInitial.activity);
      latest.current = localInitial;
      setData(localInitial);
      const demoSession = getStoredDemoSession();
      const cached = getCachedActiveSession();
      if (demoSession?.user?.id) {
        setMeId(toAppMemberId(demoSession.user.id, demoSession.user.email));
        setHydrated(true);
      } else if (cached?.id) {
        setMeId(cached.id);
        setHydrated(true);
      }
    }
    void syncFromServerOrLocal();

    const sub = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        if (typeof window !== "undefined") {
          try {
            window.localStorage.removeItem(ACTIVE_USER_SESSION_KEY);
          } catch {}
        }
        tenantIdRef.current = null;
        setActiveTenantId(null);
        baselineRef.current = null;
        setMeId(null);
        setNoAccess(false);
      } else if (session?.user) {
        void syncFromServerOrLocal();
      }
    });

    const onStorage = () => {
      const fresh = mergeCourseAssignments(readDemoData().data);
      latest.current = fresh;
      setData(fresh);
    };
    window.addEventListener("storage", onStorage);

    const unsubLocalSync = initLocalSyncListener(
      (incoming) => {
        if (tenantIdRef.current) {
          void syncFromServerOrLocal();
          return;
        }
        const fresh = mergeCourseAssignments(incoming);
        writeDemoData(fresh);
        latest.current = fresh;
        setData(fresh);
      },
      () => {
        if (tenantIdRef.current) {
          void syncFromServerOrLocal();
          return;
        }
        const fresh = mergeCourseAssignments(seedData());
        writeDemoData(fresh);
        latest.current = fresh;
        setData(fresh);
      },
    );

    return () => {
      sub.data.subscription.unsubscribe();
      window.removeEventListener("storage", onStorage);
      unsubLocalSync();
    };
  }, [syncFromServerOrLocal]);

  // Tenant-scoped Realtime subscription reconciling remote rows with unsaved local diffs
  const realtimeDebounceRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!activeTenantId) return;
    const channel = supabase
      .channel(`academy-realtime-${activeTenantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
        },
        () => {
          if (realtimeDebounceRef.current) {
            clearTimeout(realtimeDebounceRef.current);
          }
          realtimeDebounceRef.current = setTimeout(() => {
            void syncFromServerOrLocal();
          }, 600);
        },
      )
      .subscribe();

    // 60-second passive fallback interval (only when tab is visible)
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        void syncFromServerOrLocal();
      }
    }, 60000);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        if (realtimeDebounceRef.current) {
          clearTimeout(realtimeDebounceRef.current);
        }
        realtimeDebounceRef.current = setTimeout(() => {
          void syncFromServerOrLocal();
        }, 1200);
      }
    };
    window.addEventListener("visibilitychange", onVisible);

    return () => {
      void supabase.removeChannel(channel);
      clearInterval(interval);
      if (realtimeDebounceRef.current) {
        clearTimeout(realtimeDebounceRef.current);
      }
      window.removeEventListener("visibilitychange", onVisible);
    };
  }, [activeTenantId, syncFromServerOrLocal]);

  const update = useCallback(
    (fn: (d: AppData) => AppData) => {
      const next = fn(latest.current);
      applyAndSync(next);
    },
    [applyAndSync],
  );

  const saveFlight = useCallback(
    (f: Flight) => {
      const d = latest.current;
      const prev = d.flights.find((x) => x.id === f.id);
      const delta = (f.minutes - (prev?.minutes ?? 0)) / 60;
      const acDelta = (id: string, h: number) => (a: AppData["aircraft"][number]) =>
        a.id === id
          ? {
              ...a,
              totalHours: Math.round((a.totalHours + h) * 10) / 10,
              tachHours: Math.round((a.tachHours + h) * 10) / 10,
            }
          : a;
      let aircraft = d.aircraft;
      if (prev && prev.aircraftId !== f.aircraftId) {
        aircraft = aircraft
          .map(acDelta(prev.aircraftId, -prev.minutes / 60))
          .map(acDelta(f.aircraftId, f.minutes / 60));
      } else {
        aircraft = aircraft.map(acDelta(f.aircraftId, delta));
      }

      const flightWx =
        f.weatherReport ?? buildWeatherForBookingDate(f.fromIcao || f.route, f.date);
      const enrichedFlight: Flight = {
        ...f,
        weatherReport: flightWx,
        remarks: f.remarks?.includes("[WX:")
          ? f.remarks
          : formatRemarksWithWeather(f.remarks, flightWx),
      };

      const flights = prev
        ? d.flights.map((x) => (x.id === enrichedFlight.id ? enrichedFlight : x))
        : [enrichedFlight, ...d.flights];

      let completions = d.completions.filter((c) => c.flightId !== enrichedFlight.id);
      if (enrichedFlight.lessonId && (enrichedFlight.grade ?? 0) >= 3) {
        completions = [
          ...completions,
          {
            id: `c-${enrichedFlight.id}`,
            studentId: enrichedFlight.pilotId,
            lessonId: enrichedFlight.lessonId,
            date: enrichedFlight.date,
            instructorId: enrichedFlight.instructorId,
            grade: enrichedFlight.grade,
            flightId: enrichedFlight.id,
          },
        ];
      }

      const bookings = enrichedFlight.bookingId
        ? d.bookings.map((b) =>
            b.id === enrichedFlight.bookingId
              ? enrichBookingWithWeather(
                  {
                    ...b,
                    status: "completed" as const,
                    weatherCompleted: flightWx,
                  },
                  b,
                )
              : b,
          )
        : d.bookings;

      applyAndSync({ ...d, aircraft, flights, completions, bookings });
    },
    [applyAndSync],
  );

  const deleteFlight = useCallback(
    (id: string) => {
      const d = latest.current;
      const f = d.flights.find((x) => x.id === id);
      if (!f) return;
      const next: AppData = {
        ...d,
        flights: d.flights.filter((x) => x.id !== id),
        completions: d.completions.filter((c) => c.flightId !== id),
        aircraft: d.aircraft.map((a) =>
          a.id === f.aircraftId
            ? {
                ...a,
                totalHours: Math.round((a.totalHours - f.minutes / 60) * 10) / 10,
                tachHours: Math.round((a.tachHours - f.minutes / 60) * 10) / 10,
              }
            : a,
        ),
        bookings: d.bookings.map((b) =>
          b.id === f.bookingId ? { ...b, status: "scheduled" as const } : b,
        ),
      };
      applyAndSync(next);
    },
    [applyAndSync],
  );

  const saveBooking = useCallback(async (b: Booking) => {
    const d = latest.current;
    const prevBooking = d.bookings.find((x) => x.id === b.id);
    const enrichedInput = enrichBookingWithWeather(b, prevBooking);
    let canonical = enrichedInput;
    if (tenantIdRef.current) {
      setSyncState("syncing");
      try {
        const persisted = await persistBooking(enrichedInput, tenantIdRef.current, d);
        canonical = enrichBookingWithWeather(persisted, enrichedInput);
        setSyncState("synced");
      } catch (err) {
        console.error("persistBooking failed:", err);
        setSyncState("error");
        toast.error((err as Error).message || "Failed to save booking to database.");
        throw err;
      }
    }
    const nextBookings = d.bookings.some((x) => x.id === canonical.id)
      ? d.bookings.map((x) => (x.id === canonical.id ? canonical : x))
      : [...d.bookings, canonical];
    const next = { ...d, bookings: nextBookings };
    if (baselineRef.current && tenantIdRef.current) {
      baselineRef.current = toTables(next, tenantIdRef.current);
    }
    writeDemoData(next);
    pushLocalSync(next);
    latest.current = next;
    setData(next);
  }, []);

  const me = useMemo(() => {
    if (!meId) return null;
    const cleanId = meId.trim().toLowerCase();
    const cached = getCachedActiveSession();
    const cachedEmail = (cached?.email ?? "").trim().toLowerCase();

    // 1. Direct ID match
    let found = data.users.find((u) => u.id === meId && u.status !== "deleted");
    if (found) return found;

    // 2. Mapped App Member ID match
    const appMappedId = toAppMemberId(meId);
    found = data.users.find((u) => u.id === appMappedId && u.status !== "deleted");
    if (found) return found;

    // 3. Email match (either cleanId if it is an email or cachedEmail)
    const searchEmail = cleanId.includes("@") ? cleanId : cachedEmail;
    if (searchEmail) {
      found = data.users.find(
        (u) => u.email.trim().toLowerCase() === searchEmail && u.status !== "deleted",
      );
      if (found) return found;
    }

    // 4. Case-insensitive ID match
    found = data.users.find((u) => u.id.toLowerCase() === cleanId && u.status !== "deleted");
    if (found) return found;

    // 5. Fallback user creation if active session is cached so me never drops to null during hydration
    if (cached?.email) {
      return findOrCreateLocalUser(cached.email);
    }

    return null;
  }, [meId, data.users]);

  const hasTrackedSessionRef = useRef<string | null>(null);

  useEffect(() => {
    if (!me) return;
    if (hasTrackedSessionRef.current === me.id) return;
    hasTrackedSessionRef.current = me.id;

    recordUserLoginSession(me, "Active Portal Session", false);

    const { currentSession } = getUserLoginPrivacyHistory(me, latest.current.activity);
    const entry = buildLoginSessionActivityEntry(currentSession);
    const alreadyStored = latest.current.activity.some((a) => a.id === entry.id);
    if (!alreadyStored) {
      const next = {
        ...latest.current,
        activity: [entry, ...latest.current.activity],
      };
      latest.current = next;
      setData(next);
      writeDemoData(next);
    }
  }, [me?.id]);

  const log = useCallback(
    (action: string, entityType: ActivityLog["entityType"], details: string, entityId?: string) => {
      if (!me) return;
      recordUserPrivacyActivity(me, action, details, entityType);
      const entry: ActivityLog = {
        id: `act-${uid()}`,
        at: new Date().toISOString(),
        actorId: me.id,
        actorName: me.name,
        actorRole: me.role,
        action,
        entityType,
        entityId,
        details,
      };
      const next = {
        ...latest.current,
        activity: [entry, ...latest.current.activity],
      };
      applyAndSync(next);
    },
    [me, applyAndSync],
  );

  const commit = useCallback(
    (result: AppData | string) => {
      if (typeof result === "string") return result;
      applyAndSync(result);
      return null;
    },
    [applyAndSync],
  );

  const value = useMemo<Store>(
    () => ({
      data,
      hydrated,
      me,
      noAccess,
      syncState,
      signOut: async () => {
        hasTrackedSessionRef.current = null;
        if (typeof window !== "undefined") {
          try {
            window.localStorage.removeItem(ACTIVE_USER_SESSION_KEY);
          } catch {}
        }
        tenantIdRef.current = null;
        setActiveTenantId(null);
        baselineRef.current = null;
        setMeId(null);
        setNoAccess(false);
        await supabase.auth.signOut();
      },
      reload: async () => {
        await syncFromServerOrLocal();
      },
      update,
      reset: () => {
        const next = seedData();
        writeStoredCourseAssignments([]);
        resetLocalSync();
        applyAndSync(next);
      },
      saveFlight,
      deleteFlight,
      saveBooking,
      log,
      commit,
    }),
    [
      data,
      hydrated,
      me,
      noAccess,
      syncState,
      syncFromServerOrLocal,
      update,
      applyAndSync,
      saveFlight,
      deleteFlight,
      saveBooking,
      log,
      commit,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside StoreProvider");
  return s;
}

export function useMe() {
  const s = useStore();
  return { ...s, me: s.me as User };
}

export function useLookup() {
  const { data } = useStore();
  return {
    user: (id?: string) => {
      if (!id) return undefined;
      const appId = toAppMemberId(id);
      return (
        data.users.find((u) => u.id === id || u.id === appId) ??
        seedData().users.find((u) => u.id === id || u.id === appId)
      );
    },
    aircraft: (id?: string) => {
      if (!id) return undefined;
      return (
        data.aircraft.find((a) => a.id === id) ??
        seedData().aircraft.find((a) => a.id === id)
      );
    },
    lesson: (id?: string) => {
      if (!id) return undefined;
      return (
        data.programs.flatMap((p) => p.lessons).find((l) => l.id === id) ??
        seedData().programs.flatMap((p) => p.lessons).find((l) => l.id === id)
      );
    },
  };
}
