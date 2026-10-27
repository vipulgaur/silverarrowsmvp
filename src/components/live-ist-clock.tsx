import { useEffect, useState } from "react";
import { Clock, ShieldCheck } from "lucide-react";
import {
  ensureAuthoritativeTimeDaemon,
  getAuthoritativeIstNow,
  subscribeAuthoritativeTime,
  syncAuthoritativeNetworkTime,
  type IstClockSnapshot,
} from "@/lib/network-time";
import { cn } from "@/lib/utils";

interface LiveIstClockProps {
  className?: string;
  compact?: boolean;
}

/**
 * Non-stopping Authoritative IST (UTC+05:30) 24-hour Live Clock with Seconds, Day, and Date.
 * Anchored to network time + hardware monotonic counter (`performance.now()`), never trusting mutable OS time.
 */
export function LiveIstClock({ className, compact = false }: LiveIstClockProps) {
  const [snap, setSnap] = useState<IstClockSnapshot>(() => getAuthoritativeIstNow());

  useEffect(() => {
    ensureAuthoritativeTimeDaemon();
    const unsub = subscribeAuthoritativeTime(() => {
      setSnap(getAuthoritativeIstNow());
    });

    // Tick at 250ms intervals using hardware monotonic clock so seconds never drift or pause
    const intervalId = window.setInterval(() => {
      setSnap(getAuthoritativeIstNow());
    }, 250);

    return () => {
      unsub();
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div
      data-testid="live-ist-clock"
      onClick={() => void syncAuthoritativeNetworkTime()}
      title={`Authoritative IST Clock (Asia/Kolkata · UTC+05:30) · ${snap.source} · Click to re-verify network time`}
      className={cn(
        "group relative inline-flex items-center gap-2 sm:gap-2.5 rounded-2xl border border-primary/25 bg-card/85 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 text-xs shadow-xs backdrop-blur-md transition hover:border-primary/50 cursor-pointer select-none",
        className,
      )}
    >
      {/* Live Pulsing Network Status Dot */}
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>

      <Clock className="hidden xs:inline-block h-3.5 w-3.5 shrink-0 text-primary" />

      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 leading-tight">
        {/* Day & Date */}
        <div className="flex items-center gap-1 font-medium text-foreground/90">
          <span
            data-testid="live-ist-day"
            className="font-semibold text-primary dark:text-sky-400"
          >
            {compact ? snap.weekdayShort : snap.weekdayFull},
          </span>
          <span data-testid="live-ist-date" className="font-mono text-[11px] sm:text-xs whitespace-nowrap">
            {snap.dateLabel}
          </span>
        </div>

        <span className="text-muted-foreground/60 hidden sm:inline">·</span>

        {/* 24-Hour Time with Seconds (HH:mm:ss) */}
        <div className="flex items-center gap-1.5">
          <span
            data-testid="live-ist-time-24h"
            className="font-mono text-xs sm:text-sm font-extrabold tracking-wider text-foreground tabular-nums"
          >
            {snap.time24}
          </span>
          <span className="rounded bg-primary/15 border border-primary/30 px-1 py-0.2 font-mono text-[9px] font-bold tracking-wider text-primary uppercase">
            IST
          </span>
        </div>
      </div>

      {/* Anti-tamper verified shield indicator on larger screens */}
      <span
        className="hidden xl:inline-flex items-center gap-0.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pl-0.5 border-l border-border/60"
        title="Network-synced IST time (immune to local system clock changes)"
      >
        <ShieldCheck className="h-3 w-3 shrink-0" />
        <span>SYNC</span>
      </span>
    </div>
  );
}
