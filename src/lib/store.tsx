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
import { getStoredDemoSession, isTestEnv, supabase } from "@/integrations/supabase/client";
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

interface Store {
  data: AppData;
  hydrated: boolean;
  me: User | null;
  noAccess: boolean;
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

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => {
    const initial = readDemoData().data;
    const merged = mergeCourseAssignments(initial);
    writeStoredCourseAssignments(merged.activity);
    return merged;
  });

  const [meId, setMeId] = useState<string | null>(null);
  const [noAccess, setNoAccess] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [activeTenantId, setActiveTenantId] = useState<string | null>(null);

  const latest = useRef<AppData>(data);
  latest.current = data;

  const tenantIdRef = useRef<string | null>(null);
  const baselineRef = useRef<Tables | null>(null);

  const applyAndSync = useCallback((next: AppData) => {
    const merged = mergeCourseAssignments(next);
    writeStoredCourseAssignments(merged.activity);
    writeDemoData(merged);
    if (!tenantIdRef.current) {
      pushLocalSync(merged);
    }
    latest.current = merged;
    setData(merged);

    if (tenantIdRef.current && baselineRef.current) {
      const nextTables = toTables(merged, tenantIdRef.current);
      const diff = diffTables(baselineRef.current, nextTables);
      baselineRef.current = nextTables;
      if (hasChanges(diff)) {
        void pushChanges(diff, tenantIdRef.current);
      }
    }
  }, []);

  const syncFromServerOrLocal = useCallback(async () => {
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

    // 2. Check real Supabase authenticated user OR active demoSession in browser
    const { data: authData } = await supabase.auth.getUser();
    const authUser = authData?.user ?? demoSession?.user ?? null;

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
          baselineRef.current = reconciledTables;

          const reconciledData = mergeCourseAssignments(
            enrichWithSeedDefaults(fromTables(reconciledTables), latest.current),
          );
          writeStoredCourseAssignments(reconciledData.activity);
          writeDemoData(reconciledData);
          latest.current = reconciledData;
          setData(reconciledData);
          setMeId(toAppMemberId(loaded.meId, authUser.email));
          setNoAccess(false);
          setHydrated(true);
          return;
        }
      } catch (err) {
        console.warn("Failed to load academy from Supabase:", err);
      }

      // Graceful fallback if Supabase loadAcademy returns null or errors for an authenticated user
      const fallbackData = mergeCourseAssignments(
        enrichWithSeedDefaults(readDemoData().data, latest.current),
      );
      const emailLower = (authUser.email ?? "").trim().toLowerCase();
      const canonicalId = toAppMemberId(authUser.id, emailLower);
      const matchedUser =
        fallbackData.users.find((u) => u.id === canonicalId && u.status !== "deleted") ??
        fallbackData.users.find(
          (u) => u.email.trim().toLowerCase() === emailLower && u.status !== "deleted",
        );

      if (matchedUser) {
        writeDemoData(fallbackData);
        latest.current = fallbackData;
        setData(fallbackData);
        setMeId(matchedUser.id);
        setNoAccess(false);
        setHydrated(true);
        return;
      }
    }

    tenantIdRef.current = null;
    setActiveTenantId(null);
    baselineRef.current = null;
    setMeId(null);
    setNoAccess(false);
    setHydrated(true);
  }, []);

  useEffect(() => {
    void syncFromServerOrLocal();

    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        tenantIdRef.current = null;
        baselineRef.current = null;
        setMeId(null);
        setNoAccess(false);
      } else {
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
        // If connected to a live database tenant, PostgreSQL Realtime is authoritative
        if (tenantIdRef.current) return;
        const fresh = mergeCourseAssignments(incoming);
        writeDemoData(fresh);
        latest.current = fresh;
        setData(fresh);
      },
      () => {
        if (tenantIdRef.current) return;
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
          void syncFromServerOrLocal();
        },
      )
      .subscribe();

    // 4-second fallback interval ensures cross-device sync even if WebSockets reconnect or are throttled
    const interval = setInterval(() => {
      void syncFromServerOrLocal();
    }, 4000);

    const onVisibleOrFocus = () => {
      if (document.visibilityState === "visible") {
        void syncFromServerOrLocal();
      }
    };
    window.addEventListener("visibilitychange", onVisibleOrFocus);
    window.addEventListener("focus", onVisibleOrFocus);

    return () => {
      void supabase.removeChannel(channel);
      clearInterval(interval);
      window.removeEventListener("visibilitychange", onVisibleOrFocus);
      window.removeEventListener("focus", onVisibleOrFocus);
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
      try {
        const persisted = await persistBooking(enrichedInput, tenantIdRef.current, d);
        canonical = enrichBookingWithWeather(persisted, enrichedInput);
      } catch (err) {
        console.error("persistBooking failed:", err);
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
    if (!tenantIdRef.current) {
      pushLocalSync(next);
    }
    latest.current = next;
    setData(next);
  }, []);

  const me = meId
    ? (data.users.find(
        (u) => (u.id === meId || u.id === toAppMemberId(meId)) && u.status !== "deleted",
      ) ?? null)
    : null;

  useEffect(() => {
    if (!me) return;
    const syncSessionToActivityTable = () => {
      const { currentSession } = getUserLoginPrivacyHistory(me, latest.current.activity);
      const entry = buildLoginSessionActivityEntry(currentSession);
      const alreadyStored = latest.current.activity.some((a) => a.id === entry.id);
      if (!alreadyStored) {
        applyAndSync({
          ...latest.current,
          activity: [entry, ...latest.current.activity],
        });
      }
    };

    recordUserLoginSession(me, "Active Portal Session", false);
    syncSessionToActivityTable();

    const unsub = subscribePrivacyTracker(() => {
      syncSessionToActivityTable();
    });
    return unsub;
  }, [me, applyAndSync]);

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
      signOut: async () => {
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
