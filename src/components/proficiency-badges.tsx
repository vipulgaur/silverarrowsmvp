import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Award,
  CheckCircle2,
  Compass,
  Cpu,
  Gauge,
  Layers,
  Lock,
  Moon,
  ShieldCheck,
  Target,
  Trophy,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  pilotProficiencyBadges,
  type ProficiencyBadge,
  type ProficiencyBadgeId,
  type ProficiencyTier,
} from "@/lib/logic";
import { useStore } from "@/lib/store";
import type { User } from "@/lib/types";

export interface ProficiencyBadgesProps {
  person: User;
  className?: string;
}

const BADGE_ICONS: Record<ProficiencyBadgeId, typeof Moon> = {
  night_flying: Moon,
  instrument_rating: Gauge,
  first_solo: Award,
  cross_country: Compass,
  multi_engine: Layers,
  precision_landings: Target,
  simulator_pro: Cpu,
  ppl_mastery: ShieldCheck,
};

const TIER_VISUALS: Record<
  ProficiencyTier,
  {
    label: string;
    cardBorder: string;
    medallionRing: string;
    iconColor: string;
    textAccent: string;
  }
> = {
  gold: {
    label: "GOLD PROFICIENCY",
    cardBorder: "border-amber-500/45 bg-amber-500/5",
    medallionRing:
      "border-amber-500/60 bg-amber-500/15 text-amber-600 dark:text-amber-400 shadow-xs",
    iconColor: "text-amber-600 dark:text-amber-400",
    textAccent: "text-amber-600 dark:text-amber-400",
  },
  silver: {
    label: "SILVER PROFICIENCY",
    cardBorder: "border-sky-500/40 bg-sky-500/5",
    medallionRing:
      "border-sky-500/55 bg-sky-500/15 text-sky-600 dark:text-sky-400 shadow-xs",
    iconColor: "text-sky-600 dark:text-sky-400",
    textAccent: "text-sky-600 dark:text-sky-400",
  },
  bronze: {
    label: "BRONZE PROFICIENCY",
    cardBorder: "border-orange-500/35 bg-orange-500/5",
    medallionRing:
      "border-orange-500/50 bg-orange-500/15 text-orange-600 dark:text-orange-400 shadow-xs",
    iconColor: "text-orange-600 dark:text-orange-400",
    textAccent: "text-orange-600 dark:text-orange-400",
  },
  locked: {
    label: "IN PROGRESS",
    cardBorder: "border-border bg-card/60 opacity-85",
    medallionRing: "border-border bg-muted/60 text-muted-foreground",
    iconColor: "text-muted-foreground",
    textAccent: "text-muted-foreground",
  },
};

export function ProficiencyBadges({ person, className = "" }: ProficiencyBadgesProps) {
  const { data } = useStore();
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");

  const summary = useMemo(
    () => pilotProficiencyBadges(person.id, data),
    [person.id, data],
  );

  const visibleBadges = useMemo(() => {
    if (filter === "unlocked") return summary.badges.filter((b) => b.unlocked);
    if (filter === "locked") return summary.badges.filter((b) => !b.unlocked);
    return summary.badges;
  }, [summary.badges, filter]);

  const formatUnitValue = (val: number, unit: ProficiencyBadge["unit"]) =>
    unit === "hours" ? `${val}h` : `${val} ldgs`;

  return (
    <section
      aria-label="Aviation proficiency badges"
      data-testid="proficiency-badges-section"
      className={`space-y-4 rounded-2xl border border-border bg-card p-5 ${className}`}
    >
      {/* Header & Pilot Rank Summary */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Trophy className="h-5 w-5 text-amber-500" />
              Aviation Proficiency Badges &amp; Milestones
            </h2>
            <span className="text-xs text-muted-foreground" aria-hidden="true">
              ·
            </span>
            <span
              className="text-xs font-semibold text-primary"
              data-testid="pilot-rank-title"
            >
              {summary.rankTitle}
            </span>
            <span className="text-xs text-muted-foreground" aria-hidden="true">
              ·
            </span>
            <span
              className="font-mono text-xs font-medium text-muted-foreground"
              data-testid="pilot-proficiency-points"
            >
              {summary.totalPoints} XP
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Automatically awarded from verified flight logbook hours across Night Flying, Instrument
            Rating, Solo Command, Cross-Country, and Multi-Engine thresholds.
          </p>
        </div>

        {/* Interactive Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                filter === "all"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({summary.totalCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unlocked")}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                filter === "unlocked"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Unlocked ({summary.unlockedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter("locked")}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                filter === "locked"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              In Progress ({summary.totalCount - summary.unlockedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Tier Summary Strip */}
      <div className="grid grid-cols-2 gap-3 border-y border-border/60 py-3 sm:grid-cols-4">
        <div className="space-y-0.5">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Badges Unlocked
          </span>
          <div
            className="font-mono text-lg font-bold text-foreground"
            data-testid="unlocked-badges-count"
          >
            {summary.unlockedCount} / {summary.totalCount}
          </div>
          <span className="text-[10px] text-muted-foreground">
            {Math.round((summary.unlockedCount / summary.totalCount) * 100)}% milestone completion
          </span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] font-medium uppercase tracking-wide text-amber-600 dark:text-amber-400">
            Gold Medallions
          </span>
          <div className="font-mono text-lg font-bold text-foreground">{summary.goldCount}</div>
          <span className="text-[10px] text-muted-foreground">Mastery threshold met</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] font-medium uppercase tracking-wide text-sky-600 dark:text-sky-400">
            Silver Medallions
          </span>
          <div className="font-mono text-lg font-bold text-foreground">{summary.silverCount}</div>
          <span className="text-[10px] text-muted-foreground">Intermediate proficiency</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] font-medium uppercase tracking-wide text-orange-600 dark:text-orange-400">
            Bronze Medallions
          </span>
          <div className="font-mono text-lg font-bold text-foreground">{summary.bronzeCount}</div>
          <span className="text-[10px] text-muted-foreground">Initial qualification met</span>
        </div>
      </div>

      {/* Visual Badge Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {visibleBadges.map((badge) => {
          const Icon = BADGE_ICONS[badge.id];
          const vis = TIER_VISUALS[badge.tier];
          const activeTarget = badge.nextTierTarget ?? badge.tiers.gold;

          return (
            <div
              key={badge.id}
              data-testid={`proficiency-badge-${badge.id}`}
              data-unlocked={badge.unlocked ? "true" : "false"}
              data-tier={badge.tier}
              className={`flex flex-col justify-between rounded-xl border p-4 transition ${vis.cardBorder}`}
            >
              <div>
                {/* Top Row: Medallion Emblem + Title */}
                <div className="flex items-start gap-3">
                  <div
                    className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 ${vis.medallionRing}`}
                  >
                    <Icon className={`h-5 w-5 ${vis.iconColor}`} />
                    {badge.unlocked ? (
                      <CheckCircle2 className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-card text-emerald-500" />
                    ) : (
                      <Lock className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-card text-muted-foreground" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[10px] font-bold tracking-wider uppercase ${vis.textAccent}`}>
                        {vis.label}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {badge.regulationRef}
                      </span>
                    </div>
                    <h3 className="truncate text-sm font-bold text-foreground">{badge.title}</h3>
                    <p className="text-[11px] text-muted-foreground">{badge.category}</p>
                  </div>
                </div>

                <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                  {badge.description}
                </p>
              </div>

              {/* Progress Bar & Threshold Footer */}
              <div className="mt-4 space-y-2 border-t border-border/50 pt-3">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-mono font-bold text-foreground">
                    {formatUnitValue(badge.currentValue, badge.unit)}{" "}
                    <span className="font-normal text-muted-foreground">
                      / {formatUnitValue(activeTarget, badge.unit)}
                    </span>
                  </span>
                  <span className="font-mono text-[11px] font-medium text-muted-foreground">
                    {badge.progressPct}%
                  </span>
                </div>

                <Progress value={badge.progressPct} className="h-1.5" />

                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>
                    Tiers: {badge.tiers.bronze} · {badge.tiers.silver} · {badge.tiers.gold}{" "}
                    {badge.unit === "hours" ? "h" : "ldgs"}
                  </span>
                  {badge.tier === "gold" ? (
                    <span className="font-medium text-amber-600 dark:text-amber-400">
                      Max Tier Reached
                    </span>
                  ) : badge.unlocked && badge.earnedAtDate ? (
                    <span>Unlocked {format(new Date(badge.earnedAtDate), "d MMM yy")}</span>
                  ) : (
                    <span>
                      {badge.remainingToNext}
                      {badge.unit === "hours" ? "h" : ""} to unlock
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
