import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Clock,
  Database,
  Globe,
  History,
  Laptop,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import type { User } from "@/lib/types";
import {
  buildLoginSessionActivityEntry,
  getUserLoginPrivacyHistory,
  refreshAndVerifyUserNetworkSession,
  subscribePrivacyTracker,
  type LoginPrivacyRecord,
} from "@/lib/privacy-tracker";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/app-ui";

interface LoginPrivacyPanelProps {
  person: User;
  compact?: boolean;
}

export function LoginPrivacyPanel({ person, compact = false }: LoginPrivacyPanelProps) {
  const { data, update, log } = useStore();
  const [tick, setTick] = useState(0);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [refreshingIp, setRefreshingIp] = useState(false);

  useEffect(() => {
    const unsub = subscribePrivacyTracker(() => {
      setTick((t) => t + 1);
    });
    return unsub;
  }, []);

  const history = useMemo(
    () => getUserLoginPrivacyHistory(person, data.activity),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [person.id, person.name, person.email, person.role, data.activity, tick],
  );

  const { currentSession, lastPreviousLogin, allSessions, isSyncedWithDatabase } = history;

  const activeInspectedSession: LoginPrivacyRecord = useMemo(() => {
    if (!selectedSessionId) return currentSession;
    return allSessions.find((s) => s.id === selectedSessionId) ?? currentSession;
  }, [selectedSessionId, allSessions, currentSession]);

  async function handleRefreshNetworkIdentity() {
    setRefreshingIp(true);
    try {
      const updated = await refreshAndVerifyUserNetworkSession(person);
      const sessionEntry = buildLoginSessionActivityEntry(updated);
      update((d) => {
        if (d.activity.some((a) => a.id === sessionEntry.id)) return d;
        return {
          ...d,
          activity: [sessionEntry, ...d.activity],
        };
      });
      log(
        "privacy_ip_verified",
        "user",
        `Verified live network identity: IP ${updated.ipAddress} · ${updated.location} (${updated.coordinates})`,
        person.id,
      );
      setTick((t) => t + 1);
      toast.success(`Live IP & Location verified (${updated.ipAddress} · ${updated.location}) and synced to database.`);
    } finally {
      setRefreshingIp(false);
    }
  }

  if (compact) {
    const displayLogin = lastPreviousLogin ?? currentSession;
    return (
      <div
        data-testid="login-privacy-compact"
        className="rounded-xl border border-primary/25 bg-primary/5 p-2.5 text-[11px] space-y-1.5"
      >
        <div className="flex items-center justify-between gap-1.5">
          <span className="inline-flex items-center gap-1 font-bold text-primary uppercase tracking-wider text-[10px] font-mono">
            <ShieldCheck className="h-3.5 w-3.5" /> Login &amp; Privacy Guard
          </span>
          <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 font-mono text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
            IP VERIFIED
          </span>
        </div>
        <div className="space-y-0.5 text-muted-foreground">
          <div className="flex items-center justify-between gap-2">
            <span>Last Login (IST):</span>
            <span className="font-mono font-semibold text-foreground truncate">
              {displayLogin.loginAtIst}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span>Location:</span>
            <span className="font-medium text-foreground truncate">{currentSession.location}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span>IP Address:</span>
            <span className="font-mono font-semibold text-primary">{currentSession.ipAddress}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span>Activities Logged:</span>
            <span className="font-mono font-semibold text-foreground">
              {currentSession.activities.length} actions
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      data-testid="login-privacy-panel"
      className="rounded-2xl border border-border/80 bg-card/90 p-4 sm:p-6 shadow-sm space-y-5"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" /> Account Privacy &amp; Security Audit
            </span>
            <span
              data-testid="privacy-db-sync-badge"
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/25 px-2.5 py-0.5 font-mono text-[10px] font-bold text-primary uppercase tracking-wider"
            >
              <Database className="h-3 w-3" />
              {isSyncedWithDatabase ? "Database Synced · activity_feed" : "Database Sync Active"}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              IST (UTC+05:30) Network Time Synced
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Login History, Location, IP &amp; Activity Tracker
          </h2>
          <p className="text-xs text-muted-foreground">
            Monitor when {person.name} last logged in, from which geographic location, IP address, exact 24-hour IST time, and every activity performed.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void handleRefreshNetworkIdentity()}
          disabled={refreshingIp}
          className="h-8 text-xs self-start sm:self-center shrink-0"
        >
          <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${refreshingIp ? "animate-spin" : ""}`} />
          Verify Live IP &amp; Location
        </Button>
      </div>

      {/* Top 4 Privacy & Login KPI Cards (Last Login Time, Location, IP Address, Activity Count) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {/* 1. Last Login Timestamp */}
        <div
          data-testid="privacy-last-login-card"
          className="rounded-xl border border-border/70 bg-background/60 p-3.5 space-y-1.5"
        >
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Last Login Time (IST)</span>
            <Clock className="h-4 w-4 text-primary shrink-0" />
          </div>
          <p className="font-mono text-xs sm:text-sm font-bold text-foreground leading-snug">
            {(lastPreviousLogin ?? currentSession).loginAtIst}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Current session: <span className="font-mono text-foreground">{currentSession.loginAtIst}</span>
          </p>
        </div>

        {/* 2. Login Location & Coordinates */}
        <div
          data-testid="privacy-location-card"
          className="rounded-xl border border-border/70 bg-background/60 p-3.5 space-y-1.5"
        >
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Login Location</span>
            <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-foreground leading-snug">
            {currentSession.location}
          </p>
          <p className="font-mono text-[11px] text-muted-foreground">
            Coords: {currentSession.coordinates}
          </p>
        </div>

        {/* 3. Public IP Address & Network */}
        <div
          data-testid="privacy-ip-card"
          className="rounded-xl border border-border/70 bg-background/60 p-3.5 space-y-1.5"
        >
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>IP Address &amp; Network</span>
            <Globe className="h-4 w-4 text-sky-500 shrink-0" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs sm:text-sm font-extrabold text-primary">
              {currentSession.ipAddress}
            </span>
            <Chip tone="ok">Verified</Chip>
          </div>
          <p className="text-[11px] text-muted-foreground truncate" title={currentSession.networkOrg}>
            {currentSession.networkOrg}
          </p>
        </div>

        {/* 4. Device / Browser & Activities Count */}
        <div
          data-testid="privacy-device-card"
          className="rounded-xl border border-border/70 bg-background/60 p-3.5 space-y-1.5"
        >
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Device &amp; Activity Log</span>
            <Laptop className="h-4 w-4 text-amber-500 shrink-0" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-foreground truncate">
            {currentSession.deviceBrowser}
          </p>
          <p className="text-[11px] text-muted-foreground">
            <span className="font-mono font-semibold text-foreground">
              {activeInspectedSession.activities.length}
            </span>{" "}
            recorded privacy actions in selected session
          </p>
        </div>
      </div>

      {/* Two-Column Split: Session History List (Left) & Detailed Activities Performed (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Login Sessions List */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <History className="h-3.5 w-3.5 text-primary" /> Recent Login Sessions ({allSessions.length})
            </h3>
            <span className="text-[11px] text-muted-foreground">Select session to inspect</span>
          </div>

          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {allSessions.map((sess, idx) => {
              const isSelected = sess.id === activeInspectedSession.id;
              const isCurrent = idx === 0;
              const isLastLogin = idx === 1;

              return (
                <button
                  key={sess.id}
                  type="button"
                  data-testid={`privacy-session-item-${idx}`}
                  onClick={() => setSelectedSessionId(sess.id)}
                  className={`w-full text-left rounded-xl border p-3 transition cursor-pointer space-y-1.5 ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-xs"
                      : "border-border/70 bg-background/50 hover:border-primary/40 hover:bg-background/80"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Current Session
                        </span>
                      ) : isLastLogin ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 font-mono text-[9px] font-bold text-sky-600 dark:text-sky-300 uppercase">
                          Last Login
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-mono text-[9px] font-semibold text-muted-foreground uppercase">
                          Previous Session
                        </span>
                      )}
                      <span className="font-mono text-[11px] font-bold text-primary">
                        IP: {sess.ipAddress}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {sess.activities.length} activities
                    </span>
                  </div>

                  <div className="font-mono text-xs font-semibold text-foreground">
                    {sess.loginAtIst}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-emerald-500 shrink-0" />
                      {sess.location} ({sess.coordinates})
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Wifi className="h-3 w-3 text-sky-500 shrink-0" />
                      {sess.deviceBrowser}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Activity Performed Timeline for Selected Login Session */}
        <div className="lg:col-span-7 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-primary" /> Activity Performed During Session
            </h3>
            <span className="font-mono text-[11px] text-muted-foreground">
              {activeInspectedSession.location} · IP {activeInspectedSession.ipAddress}
            </span>
          </div>

          <div
            data-testid="privacy-activity-list"
            className="rounded-xl border border-border/70 bg-background/50 divide-y divide-border/60 max-h-[320px] overflow-y-auto"
          >
            {activeInspectedSession.activities.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No activities recorded for this session yet.
              </div>
            ) : (
              activeInspectedSession.activities.map((act) => (
                <div
                  key={act.id}
                  data-testid="privacy-activity-row"
                  className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-card/60 transition"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-foreground">{act.action}</span>
                      {act.entityType && (
                        <span className="rounded bg-primary/10 border border-primary/25 px-1.5 py-0.2 font-mono text-[9px] font-semibold uppercase text-primary">
                          {act.entityType}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed break-words">
                      {act.details}
                    </p>
                  </div>

                  <div className="shrink-0 sm:text-right">
                    <span className="inline-block rounded-md bg-muted/70 px-2 py-1 font-mono text-[10px] font-semibold text-foreground whitespace-nowrap">
                      {act.timeIst}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
