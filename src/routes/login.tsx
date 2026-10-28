import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Eye,
  EyeOff,
  Fuel,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  Plane,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { APP_BUILD_HASH } from "@/lib/build-info";
import { useStore } from "@/lib/store";
import { roleLabel, type Role } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/app-ui";
import { BrandLogo } from "@/components/brand-logo";
import { LiveIstClock } from "@/components/live-ist-clock";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";
import { recordUserLoginSession } from "@/lib/privacy-tracker";
import { isUserPendingApproval } from "@/lib/logic";
import { playNotificationSound } from "@/lib/notification-sound";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Portal Sign In — SilverArrows Flight Academy" },
      {
        name: "description",
        content:
          "Sign in or register for SilverArrows Flight Academy OS. Glassmorphism engineering console with role-based access.",
      },
    ],
  }),
  component: LoginPage,
});

export const FIXED_TESTING_PASSWORD = "Vipul@1011";

export interface TestingPersona {
  id: string;
  name: string;
  role: Role;
  roleTitle: string;
  email: string;
  callsign: string;
  avatar: string;
  details: string;
  stage: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
}

export const TESTING_USERS: TestingPersona[] = [
  {
    id: "u-admin",
    name: "Sakshi Gaur",
    role: "admin",
    roleTitle: "Head of Training & Operations (Admin)",
    email: "sakshi@flysilverarrows.com",
    callsign: "SKG",
    avatar: "SG",
    details: "Full system administration, user management, audit logs, 3D aircraft atlas, syllabus control",
    stage: "Operations Administrator",
    accent: "#8B5CF6",
    badgeBg: "bg-purple-500/15 border-purple-500/30",
    badgeText: "text-purple-700 dark:text-purple-300",
  },
  {
    id: "u-vpl",
    name: "Vipul Aviation",
    role: "instructor",
    roleTitle: "Chief Flight Instructor (CFI)",
    email: "vipul@flysilverarrows.com",
    callsign: "VPL",
    avatar: "VA",
    details: "FI(A) / IRI / CRI · 4,820+ Flight Hours · Student sign-offs, flight log approvals",
    stage: "Chief Flight Instructor",
    accent: "#10B981",
    badgeBg: "bg-emerald-500/15 border-emerald-500/30",
    badgeText: "text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "u-prn",
    name: "Priya Nair",
    role: "instructor",
    roleTitle: "Flight Instructor (CFI)",
    email: "priya@flysilverarrows.com",
    callsign: "PRN",
    avatar: "PN",
    details: "FI(A) / CRI · 1,640+ Flight Hours · Dual instruction, student maneuvers & progress tracking",
    stage: "Flight Instructor",
    accent: "#10B981",
    badgeBg: "bg-emerald-500/15 border-emerald-500/30",
    badgeText: "text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "u-anj",
    name: "Anujay Singh",
    role: "ground",
    roleTitle: "Chief Ground Instructor",
    email: "anujay@flysilverarrows.com",
    callsign: "ANJ",
    avatar: "AS",
    details: "Ground School Lead · Meteorology & Air Regulations Specialist · Classroom & exam lecturer",
    stage: "Chief Ground Instructor",
    accent: "#F59E0B",
    badgeBg: "bg-amber-500/15 border-amber-500/30",
    badgeText: "text-amber-700 dark:text-amber-300",
  },
  {
    id: "u-ana",
    name: "Ananya Sharma",
    role: "student",
    roleTitle: "Student Pilot (EASA PPL(A))",
    email: "ananya@flysilverarrows.com",
    callsign: "ANA",
    avatar: "AS",
    details: "DK.SPL.90214 · EGCA-IND-90214 · Solo Cross-Country Prep · Air Law & Met Passed",
    stage: "Solo cross-country prep",
    accent: "#0EA5E9",
    badgeBg: "bg-sky-500/15 border-sky-500/30",
    badgeText: "text-sky-700 dark:text-sky-300",
  },
  {
    id: "u-arp",
    name: "Aarav Patel",
    role: "student",
    roleTitle: "Student Pilot (Pre-Solo Circuits)",
    email: "aarav@flysilverarrows.com",
    callsign: "ARP",
    avatar: "AP",
    details: "DK.SPL.90388 · Pre-Solo Circuits & Emergency Procedures Training · Cessna 172S",
    stage: "Pre-solo circuits",
    accent: "#0EA5E9",
    badgeBg: "bg-sky-500/15 border-sky-500/30",
    badgeText: "text-sky-700 dark:text-sky-300",
  },
  {
    id: "u-lnl",
    name: "Liam Nielsen",
    role: "student",
    roleTitle: "Student Pilot (Upper Air Work)",
    email: "liam@flysilverarrows.com",
    callsign: "LNL",
    avatar: "LN",
    details: "DK.SPL.90412 · Upper Air Work, Stalls & Steep Turns · Medical Class 2 Valid",
    stage: "Upper air work",
    accent: "#0EA5E9",
    badgeBg: "bg-sky-500/15 border-sky-500/30",
    badgeText: "text-sky-700 dark:text-sky-300",
  },
  {
    id: "u-rhv",
    name: "Rohan Verma",
    role: "student",
    roleTitle: "Student Pilot (Flight Maneuvers)",
    email: "rohan@flysilverarrows.com",
    callsign: "RHV",
    avatar: "RV",
    details: "DK.SPL.90521 · Steep Turns, Stalls, Crosswind Landings · Cessna 172S",
    stage: "Flight maneuvers",
    accent: "#0EA5E9",
    badgeBg: "bg-sky-500/15 border-sky-500/30",
    badgeText: "text-sky-700 dark:text-sky-300",
  },
];

const db = supabase as unknown as {
  rpc: (
    fn: string,
    args: Record<string, unknown>,
  ) => Promise<{ error: { message: string } | null }>;
};

/**
 * Full Volumetric Puffy Cumulus Cloud SVG (Not cut off, rounded all around)
 */
function VolumetricCloud({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 160"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main puffy cloud body with rounded lobes on top, sides and underside */}
      <path d="M 60 100 C 30 100, 15 80, 20 60 C 20 40, 40 30, 60 35 C 70 18, 95 10, 120 15 C 145 10, 175 12, 195 28 C 220 16, 255 22, 270 45 C 295 50, 305 75, 290 100 C 295 120, 275 140, 250 135 C 230 150, 200 148, 180 135 C 160 152, 125 152, 105 138 C 85 148, 55 140, 50 120 C 40 115, 45 102, 60 100 Z" />
      {/* Volumetric highlight puff for soft depth */}
      <path
        d="M 85 75 C 75 58, 95 40, 125 42 C 145 35, 175 38, 190 52 C 210 44, 235 52, 245 70 C 258 85, 245 102, 225 106 C 205 116, 180 112, 165 104 C 145 112, 120 112, 105 100 C 85 98, 80 88, 85 75 Z"
        className="fill-white/40 dark:fill-white/10"
      />
    </svg>
  );
}

/**
 * Air Traffic Control Tower (ATC Tower) alongside Runway 27L
 * - Realistic tapered concrete tower shaft with vertical structural reveals
 * - Observation catwalk / exterior maintenance gallery
 * - Panoramic faceted glass Visual Control Room (VCR) with interior illuminated radar monitors
 * - Primary radar radome and communications antenna mast
 * - Red blinking FAA-standard aviation obstruction beacon at the summit
 */
function AirTrafficControlTower({ className }: { className?: string }) {
  return (
    <div
      data-testid="atc-tower"
      className={cn(
        "pointer-events-none select-none transition-colors duration-500",
        className,
      )}
    >
      <svg
        viewBox="0 0 100 180"
        className="w-20 sm:w-24 h-auto drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        {/* Summit Red Obstruction Warning Strobe */}
        <circle
          cx="50"
          cy="8"
          r="4.5"
          className="fill-red-500 shadow-[0_0_12px_rgba(239,68,68,1)] animate-pulse"
        />
        <circle cx="50" cy="8" r="2" className="fill-white" />

        {/* Top Antenna Mast & Meteorological Anemometer Spire */}
        <line x1="50" y1="8" x2="50" y2="30" stroke="#94a3b8" strokeWidth="2.5" />
        <line x1="43" y1="18" x2="57" y2="18" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="45" y1="24" x2="55" y2="24" stroke="#94a3b8" strokeWidth="1.5" />

        {/* Primary Radar Dome (White Radome Sphere on Roof) */}
        <circle
          cx="36"
          cy="28"
          r="5"
          className="fill-slate-200 dark:fill-slate-300 stroke-slate-400 dark:stroke-slate-600"
          strokeWidth="1"
        />

        {/* Observation Cab Roof Canopy */}
        <polygon
          points="20,32 80,32 75,37 25,37"
          className="fill-slate-600 dark:fill-slate-700 stroke-slate-700 dark:stroke-slate-600"
          strokeWidth="1"
        />

        {/* Visual Control Room (VCR) - Multi-sided Outward-Slanted Glass Cab */}
        <polygon
          points="23,37 77,37 70,55 30,55"
          className="fill-sky-100/90 dark:fill-slate-900/95 stroke-slate-600 dark:stroke-slate-500"
          strokeWidth="1.5"
        />
        {/* Cab Window Mullions (Vertical Struts) */}
        <line x1="39" y1="37" x2="41" y2="55" stroke="#64748b" strokeWidth="1" />
        <line x1="50" y1="37" x2="50" y2="55" stroke="#64748b" strokeWidth="1" />
        <line x1="61" y1="37" x2="59" y2="55" stroke="#64748b" strokeWidth="1" />

        {/* Night-time Interior Radar Scope & Console Glow inside the Cab */}
        <rect
          x="34"
          y="44"
          width="8"
          height="6"
          rx="1"
          className="fill-emerald-400/80 dark:fill-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]"
        />
        <rect
          x="46"
          y="44"
          width="9"
          height="6"
          rx="1"
          className="fill-amber-400/80 dark:fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]"
        />
        <rect
          x="58"
          y="44"
          width="7"
          height="6"
          rx="1"
          className="fill-sky-400/80 dark:fill-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]"
        />

        {/* Exterior Catwalk & Observation Balcony Platform */}
        <rect
          x="18"
          y="55"
          width="64"
          height="4"
          rx="1"
          className="fill-slate-700 dark:fill-slate-800"
        />
        {/* Catwalk Safety Railing */}
        <line x1="19" y1="52" x2="81" y2="52" stroke="#94a3b8" strokeWidth="1" />
        <line x1="20" y1="52" x2="20" y2="55" stroke="#94a3b8" strokeWidth="1" />
        <line x1="35" y1="52" x2="35" y2="55" stroke="#94a3b8" strokeWidth="1" />
        <line x1="50" y1="52" x2="50" y2="55" stroke="#94a3b8" strokeWidth="1" />
        <line x1="65" y1="52" x2="65" y2="55" stroke="#94a3b8" strokeWidth="1" />
        <line x1="80" y1="52" x2="80" y2="55" stroke="#94a3b8" strokeWidth="1" />

        {/* Tapered Concrete Tower Shaft */}
        <polygon
          points="32,59 68,59 64,152 36,152"
          className="fill-slate-300 dark:fill-slate-800 stroke-slate-400 dark:stroke-slate-700"
          strokeWidth="1.5"
        />

        {/* Architectural Shaft Central Reveal / Fluting */}
        <line
          x1="50"
          y1="62"
          x2="50"
          y2="150"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-slate-400 dark:text-slate-700"
        />

        {/* Vertical Stairwell Slit Windows (illuminated warm at night) */}
        <rect
          x="48.5"
          y="72"
          width="3"
          height="10"
          rx="1"
          className="fill-amber-300 dark:fill-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]"
        />
        <rect
          x="48.5"
          y="95"
          width="3"
          height="10"
          rx="1"
          className="fill-amber-300 dark:fill-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]"
        />
        <rect
          x="48.5"
          y="118"
          width="3"
          height="10"
          rx="1"
          className="fill-amber-300 dark:fill-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]"
        />

        {/* Tower Callsign Badge */}
        <rect
          x="38"
          y="138"
          width="24"
          height="8"
          rx="1.5"
          className="fill-slate-800 dark:fill-slate-950 stroke-slate-600 dark:stroke-slate-700"
          strokeWidth="0.8"
        />
        <text
          x="50"
          y="144"
          textAnchor="middle"
          fill="#38bdf8"
          fontSize="4.5"
          fontWeight="bold"
          fontFamily="monospace"
        >
          SA TWR
        </text>

        {/* Foundation Plinth / Ground Apron Pad */}
        <rect
          x="28"
          y="152"
          width="44"
          height="10"
          rx="2"
          className="fill-slate-500 dark:fill-slate-900 stroke-slate-600 dark:stroke-slate-800"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

/**
 * ✦ Sky Collectables & Glass Cockpit HUD for "Token Collector & Waypoint Scout"
 */
interface SkyCollectable {
  id: number;
  type: "wing" | "fuel" | "waypoint";
  name: string;
  points: number;
  x: number;
  y: number;
  speed: number;
  phase: number;
  collected: boolean;
}

interface FloatingScoreTag {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
}

function CollectableWing() {
  return (
    <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 shadow-[0_0_16px_rgba(251,191,36,0.75)] border border-amber-200/70 select-none">
      <svg viewBox="0 0 32 32" className="w-6 h-6 text-slate-950" fill="currentColor">
        <path d="M 16 6 L 18 12 L 24 12 L 19 16 L 21 22 L 16 18 L 11 22 L 13 16 L 8 12 L 14 12 Z" />
        <path d="M 3 13 C 7 10, 12 12, 14 14 C 12 16, 6 16, 3 13 Z" opacity="0.85" />
        <path d="M 29 13 C 25 10, 20 12, 18 14 C 20 16, 26 16, 29 13 Z" opacity="0.85" />
      </svg>
      <span className="absolute -bottom-3 text-[9px] font-black tracking-wider text-amber-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] font-mono whitespace-nowrap">
        +100 ✦
      </span>
    </div>
  );
}

function CollectableFuel() {
  return (
    <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 shadow-[0_0_14px_rgba(56,189,248,0.75)] border border-cyan-200/70 select-none">
      <Fuel className="w-4 h-4 text-white drop-shadow" />
      <span className="absolute -bottom-3 text-[9px] font-black tracking-wider text-cyan-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] font-mono whitespace-nowrap">
        +50 ⛽
      </span>
    </div>
  );
}

function CollectableWaypoint({ name }: { name: string }) {
  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <div className="relative flex items-center justify-center w-8 h-8 rotate-45 rounded-md bg-gradient-to-br from-purple-500 via-fuchsia-500 to-indigo-600 shadow-[0_0_16px_rgba(168,85,247,0.75)] border border-purple-200/80">
        <div className="w-3 h-3 rounded-full bg-white shadow-inner -rotate-45 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
        </div>
      </div>
      <span className="absolute -bottom-3.5 text-[8.5px] font-bold tracking-wider text-purple-200 bg-slate-900/90 px-1 py-0.2 rounded border border-purple-400/40 drop-shadow font-mono whitespace-nowrap">
        {name} · +75
      </span>
    </div>
  );
}

function FlightScoutHUD({
  score,
  waypoints,
  fuel,
  streak,
  onReset,
}: {
  score: number;
  waypoints: number;
  fuel: number;
  streak: number;
  onReset: () => void;
}) {
  const [minimized, setMinimized] = useState(false);

  const pilotRank =
    score >= 1500
      ? {
          title: "CHIEF CAPTAIN",
          color:
            "text-amber-700 dark:text-amber-300 border-amber-500/45 bg-amber-500/15 backdrop-blur-md",
        }
      : score >= 700
        ? {
            title: "COMMERCIAL PILOT",
            color:
              "text-purple-700 dark:text-purple-300 border-purple-500/45 bg-purple-500/15 backdrop-blur-md",
          }
        : score >= 300
          ? {
              title: "SOLO CADET",
              color:
                "text-sky-700 dark:text-sky-300 border-sky-500/45 bg-sky-500/15 backdrop-blur-md",
            }
          : {
              title: "STUDENT PILOT",
              color:
                "text-emerald-700 dark:text-emerald-300 border-emerald-500/45 bg-emerald-500/15 backdrop-blur-md",
            };

  return (
    <aside
      aria-label="Flight Scout HUD"
      data-testid="flight-scout-hud"
      className="pointer-events-auto fixed top-[64px] right-4 sm:right-8 z-40 flex flex-col items-center select-none"
    >
      {/* Frosted Glass Score Panel (Retracts smoothly into the top notch when hidden) */}
      <div
        data-testid="flight-score-glass-panel"
        aria-hidden={minimized}
        className={cn(
          "relative w-68 sm:w-76 overflow-hidden rounded-b-3xl border-x border-b border-white/50 dark:border-white/20 bg-white/25 dark:bg-slate-900/40 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_20px_50px_rgba(15,23,42,0.22),inset_0_1px_1px_rgba(255,255,255,0.65)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-top",
          minimized
            ? "max-h-0 opacity-0 -translate-y-3 pointer-events-none border-b-0 py-0 px-3.5"
            : "max-h-[340px] opacity-100 translate-y-0 p-3.5",
        )}
      >
        {/* Subtle Specular Glass Reflection Overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/35 via-white/5 to-transparent dark:from-white/12 dark:via-transparent dark:to-transparent"
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-900/10 dark:border-white/15">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-amber-400/40 bg-amber-500/20 text-amber-600 dark:text-amber-300 text-xs shadow-inner backdrop-blur-md">
                ✦
              </span>
              <div>
                <div className="text-[10.5px] font-black tracking-wider uppercase font-mono text-slate-900 dark:text-white">
                  FLIGHT SCOUT · C172S
                </div>
                <div className="text-[8.5px] font-medium text-slate-600 dark:text-slate-300">
                  GLASS TELEMETRY SCORECARD
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onReset}
                title="Reset Score & Flight Telemetry"
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/35 dark:hover:bg-white/15 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Translucent Glass Telemetry Stats Grid */}
          <div className="grid grid-cols-3 gap-2 py-2.5">
            {/* Score */}
            <div className="rounded-xl bg-white/35 dark:bg-white/[0.07] backdrop-blur-md p-2 border border-white/55 dark:border-white/15 shadow-inner flex flex-col items-center">
              <span className="text-[8.5px] font-bold text-slate-600 dark:text-slate-300 tracking-wider">
                SCORE
              </span>
              <span className="font-mono text-sm font-black text-amber-600 dark:text-amber-300 drop-shadow-[0_1px_6px_rgba(251,191,36,0.35)]">
                {score}
              </span>
            </div>

            {/* Waypoints */}
            <div className="rounded-xl bg-white/35 dark:bg-white/[0.07] backdrop-blur-md p-2 border border-white/55 dark:border-white/15 shadow-inner flex flex-col items-center">
              <span className="text-[8.5px] font-bold text-slate-600 dark:text-slate-300 tracking-wider">
                WAYPOINTS
              </span>
              <span className="font-mono text-sm font-black text-purple-700 dark:text-purple-300 drop-shadow-[0_1px_6px_rgba(168,85,247,0.35)]">
                {waypoints}
              </span>
            </div>

            {/* Streak */}
            <div className="rounded-xl bg-white/35 dark:bg-white/[0.07] backdrop-blur-md p-2 border border-white/55 dark:border-white/15 shadow-inner flex flex-col items-center">
              <span className="text-[8.5px] font-bold text-slate-600 dark:text-slate-300 tracking-wider">
                STREAK
              </span>
              <span className="font-mono text-sm font-black text-sky-700 dark:text-sky-300">
                {streak}x
              </span>
            </div>
          </div>

          {/* Fuel Tank Bar */}
          <div className="space-y-1 py-1">
            <div className="flex justify-between items-center text-[9.5px] font-mono">
              <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
                <Fuel className="w-3 h-3 text-cyan-600 dark:text-cyan-400" /> FUEL RESERVE
              </span>
              <span
                className={cn(
                  "font-bold",
                  fuel < 25
                    ? "text-red-600 dark:text-red-400 animate-pulse"
                    : "text-cyan-700 dark:text-cyan-300",
                )}
              >
                {Math.round(fuel)}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-900/15 dark:bg-slate-950/60 rounded-full overflow-hidden border border-white/40 dark:border-white/10">
              <div
                className={cn(
                  "h-full transition-all duration-300 rounded-full",
                  fuel < 25
                    ? "bg-red-500"
                    : fuel < 50
                      ? "bg-amber-400"
                      : "bg-gradient-to-r from-cyan-500 to-sky-400",
                )}
                style={{ width: `${fuel}%` }}
              />
            </div>
          </div>

          {/* Pilot Rank Badge & Runway Hint */}
          <div className="pt-2.5 mt-1 border-t border-slate-900/10 dark:border-white/15 flex items-center justify-between text-[9px]">
            <span
              className={cn(
                "px-2 py-0.5 rounded-full border font-black tracking-wider uppercase font-mono",
                pilotRank.color,
              )}
            >
              ✦ {pilotRank.title}
            </span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Hover to 27L to refuel
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Hide / Show Glass Notch Handle */}
      <button
        type="button"
        data-testid="flight-score-notch-toggle"
        aria-expanded={!minimized}
        onClick={() => setMinimized((prev) => !prev)}
        title={minimized ? "Show Flight Score Card" : "Hide Flight Score Card into Notch"}
        className={cn(
          "group relative flex flex-col items-center justify-center border-x border-b border-white/50 dark:border-white/20 bg-white/30 dark:bg-slate-900/45 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_12px_30px_rgba(15,23,42,0.18),inset_0_1px_1px_rgba(255,255,255,0.6)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-300 cursor-pointer hover:bg-white/45 dark:hover:bg-slate-900/60",
          minimized
            ? "rounded-b-2xl px-4 py-1.5 gap-1"
            : "rounded-b-2xl px-5 py-1 -mt-[1px] gap-0.5",
        )}
      >
        <div className="flex items-center gap-2 text-[10.5px] font-mono font-bold text-slate-800 dark:text-slate-100">
          {minimized ? (
            <>
              <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400" />
              <span className="text-amber-700 dark:text-amber-300">{score} PTS</span>
              <span className="text-slate-400 dark:text-slate-500">·</span>
              <span className="text-cyan-700 dark:text-cyan-300">{Math.round(fuel)}% FUEL</span>
              <span className="text-[9.5px] uppercase tracking-wider text-slate-600 dark:text-slate-300 pl-0.5">
                Show ▾
              </span>
            </>
          ) : (
            <span className="text-[9.5px] uppercase tracking-widest text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
              Hide Notch ▴
            </span>
          )}
        </div>
        {/* Tactile Notch Pill Bar */}
        <span className="h-1 w-8 rounded-full bg-slate-700/30 dark:bg-white/35 group-hover:w-10 group-hover:bg-primary/70 transition-all" />
      </button>
    </aside>
  );
}

/**
 * Interactive Aviation Sky Background
 * - Cessna 172 model reduced by 50%
 * - Graceful aerodynamic flight physics: slowly and smoothly follows mouse position (not snapping)
 * - Smooth banking and pitch transitions (climb/descent)
 * - Lands on runway deck when mouse hovers towards bottom; takes off and climbs when mouse moves up
 * - Night / dark mode activates front landing headlights and micro red blinking wing beacon
 * - Paved runway with centerline dashes, threshold piano keys, and glowing edge lights
 * - Lush green tree line on the horizon
 * - Full, rounded, volumetric puffy clouds continuously moving across the sky (not cut off)
 * - "Token Collector & Waypoint Scout" game: collect wings, fuel, and nav waypoints with HUD
 */
function InteractiveAviationSky() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const planeRef = useRef<HTMLDivElement | null>(null);

  // Game state
  const [score, setScore] = useState(0);
  const [waypoints, setWaypoints] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [streak, setStreak] = useState(0);
  const [floatingTags, setFloatingTags] = useState<FloatingScoreTag[]>([]);

  const itemsRef = useRef<SkyCollectable[]>([
    { id: 1, type: "wing", name: "SilverArrows Wings", points: 100, x: 280, y: 140, speed: 1.1, phase: 0, collected: false },
    { id: 2, type: "waypoint", name: "VOR · SA", points: 75, x: 560, y: 220, speed: 0.9, phase: 1.2, collected: false },
    { id: 3, type: "fuel", name: "Jet-A Canister", points: 50, x: 840, y: 160, speed: 1.25, phase: 2.4, collected: false },
    { id: 4, type: "waypoint", name: "FIX · LHR", points: 75, x: 1120, y: 280, speed: 0.95, phase: 3.6, collected: false },
    { id: 5, type: "wing", name: "Solo Crest", points: 100, x: 1400, y: 190, speed: 1.15, phase: 4.8, collected: false },
  ]);

  const itemElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const hasAwardedLandingRefuelRef = useRef(false);

  // Auto clean floating score tags
  useEffect(() => {
    if (floatingTags.length > 0) {
      const timer = setTimeout(() => {
        setFloatingTags((tags) => tags.slice(1));
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [floatingTags]);

  const handleResetGame = () => {
    setScore(0);
    setWaypoints(0);
    setStreak(0);
    setFuel(100);
    setFloatingTags([]);
    hasAwardedLandingRefuelRef.current = false;
    itemsRef.current.forEach((item, idx) => {
      item.collected = false;
      item.x = 280 + idx * 280;
      item.y = 140 + (idx % 3) * 70;
      const el = itemElsRef.current[idx];
      if (el) {
        el.style.opacity = "1";
        el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0) scale(1)`;
      }
    });
  };

  useEffect(() => {
    let animationFrameId: number;
    let mouseX = window.innerWidth * 0.45;
    let mouseY = window.innerHeight * 0.28;
    let planeX = window.innerWidth * 0.25;
    let planeY = window.innerHeight * 0.25;
    let hasUserInteracted = false;
    let targetFacingRight = true;
    let currentScaleX = 1;
    let currentPitch = 0;
    let idleAngle = 0;
    let frameCount = 0;

    const onMouseMove = (e: MouseEvent) => {
      hasUserInteracted = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        hasUserInteracted = true;
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // Touchdown runway altitude: tarmac deck is 65px from bottom
    const tick = () => {
      idleAngle += 0.012;
      frameCount++;
      const runwayTouchdownY = window.innerHeight - 74;

      let targetX = mouseX;
      let targetY = mouseY;

      if (!hasUserInteracted) {
        // Subtle autonomous circuit cruise before any mouse interaction
        targetX = window.innerWidth * 0.5 + Math.sin(idleAngle * 0.35) * (window.innerWidth * 0.35);
        targetY = window.innerHeight * 0.25 + Math.cos(idleAngle * 0.7) * 45;
      }

      // Check if mouse is hovering towards bottom (Landing Zone: bottom 140px of screen)
      const isNearBottomLandingZone = targetY > window.innerHeight - 140;
      let effectiveTargetY = targetY;
      let isGrounded = false;

      if (isNearBottomLandingZone) {
        // Clamp plane's altitude so it touches down smoothly on the runway surface
        effectiveTargetY = runwayTouchdownY;
        if (Math.abs(planeY - runwayTouchdownY) < 6) {
          isGrounded = true;
        }
      }

      // Slower, graceful aerodynamic tracking with real aircraft inertia
      const easeX = isGrounded ? 0.016 : 0.020;
      const easeY = isGrounded ? 0.018 : 0.018;

      const dx = targetX - planeX;
      const dy = effectiveTargetY - planeY;

      planeX += dx * easeX;
      planeY += dy * easeY;

      // Heading orientation: smooth turning
      if (dx > 12) targetFacingRight = true;
      else if (dx < -12) targetFacingRight = false;

      // Smooth horizontal turn / bank transition
      const targetScaleX = targetFacingRight ? 1 : -1;
      currentScaleX += (targetScaleX - currentScaleX) * 0.08;

      // Calculate pitch angle (climb nose-up vs descent nose-down vs runway flare)
      let targetPitch = 0;
      if (isGrounded) {
        targetPitch = 0; // Level on tricycle wheels
      } else if (isNearBottomLandingZone) {
        // Landing flare attitude (nose pitched up 3.5 degrees onto main wheels)
        targetPitch = dy > 0 ? 3.5 : -5;
      } else {
        // In flight: pitch gently follows vertical climb/descent rate
        targetPitch = Math.max(-14, Math.min(14, dy * 0.08));
        if (!targetFacingRight) targetPitch = -targetPitch;
      }

      currentPitch += (targetPitch - currentPitch) * 0.05;

      if (planeRef.current) {
        planeRef.current.style.transform = `translate3d(${planeX}px, ${planeY}px, 0) scaleX(${currentScaleX}) rotate(${currentPitch}deg)`;
      }

      // Update collectables position & detect collisions
      const now = Date.now();
      for (let i = 0; i < itemsRef.current.length; i++) {
        const item = itemsRef.current[i];
        if (!item.collected) {
          item.x -= item.speed;
          const currentItemY = item.y + Math.sin(idleAngle * 2 + item.phase) * 9;
          const domEl = itemElsRef.current[i];
          if (domEl) {
            domEl.style.transform = `translate3d(${item.x}px, ${currentItemY}px, 0)`;
          }

          // Offscreen wrap to right
          if (item.x < -140) {
            item.x = window.innerWidth + Math.random() * 200 + 60;
            item.y = 110 + Math.random() * Math.max(160, window.innerHeight - 340);
            if (domEl) {
              domEl.style.opacity = "1";
              domEl.style.transform = `translate3d(${item.x}px, ${currentItemY}px, 0) scale(1)`;
            }
          }

          // Collision detection with Cessna (planeX, planeY)
          const dist = Math.hypot(planeX - item.x, planeY - currentItemY);
          if (dist < 46) {
            item.collected = true;
            if (domEl) {
              domEl.style.opacity = "0";
              domEl.style.transform = `translate3d(${item.x}px, ${currentItemY}px, 0) scale(1.5)`;
            }

            const pts = item.points;
            setScore((s) => s + pts);
            setStreak((st) => st + 1);
            if (item.type === "waypoint") {
              setWaypoints((w) => w + 1);
            }
            if (item.type === "fuel") {
              setFuel((f) => Math.min(100, f + 25));
            }

            const tagText =
              item.type === "wing"
                ? `+${pts} ✦ WINGS!`
                : item.type === "fuel"
                ? `+${pts} ⛽ JET-A!`
                : `+${pts} ▲ ${item.name}!`;
            const tagColor =
              item.type === "wing"
                ? "text-amber-400"
                : item.type === "fuel"
                ? "text-cyan-400"
                : "text-purple-400";

            setFloatingTags((tags) => [
              ...tags.slice(-5),
              { id: now + Math.random(), text: tagText, x: item.x, y: currentItemY, color: tagColor },
            ]);

            // Respawn after 3.5 seconds
            setTimeout(() => {
              item.collected = false;
              item.x = window.innerWidth + Math.random() * 200 + 80;
              item.y = 110 + Math.random() * Math.max(160, window.innerHeight - 340);
              const el = itemElsRef.current[i];
              if (el) {
                el.style.opacity = "1";
                el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0) scale(1)`;
              }
            }, 3500);
          }
        }
      }

      // Runway touchdown refuel check
      if (isGrounded && !hasAwardedLandingRefuelRef.current) {
        hasAwardedLandingRefuelRef.current = true;
        setFuel(100);
        setScore((s) => s + 150);
        setFloatingTags((tags) => [
          ...tags.slice(-5),
          {
            id: now + Math.random(),
            text: "🛬 RUNWAY 27L REFUEL +150 PTS",
            x: Math.min(window.innerWidth - 240, Math.max(80, planeX)),
            y: runwayTouchdownY - 45,
            color: "text-emerald-400",
          },
        ]);
      } else if (!isGrounded && hasAwardedLandingRefuelRef.current && planeY < runwayTouchdownY - 80) {
        hasAwardedLandingRefuelRef.current = false;
      }

      // Gentle fuel burn while airborne
      if (frameCount % 180 === 0 && !isGrounded) {
        setFuel((f) => Math.max(0, f - 1));
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
        aria-hidden="true"
      >
      <style>{`
        /* Continuous horizontal cloud drift across entire sky at visible, relaxing speeds */
        @keyframes cloud-drift-track-1 {
          0% { transform: translate3d(-380px, 0, 0); }
          100% { transform: translate3d(calc(100vw + 380px), 0, 0); }
        }
        @keyframes cloud-drift-track-2 {
          0% { transform: translate3d(-420px, 0, 0); }
          100% { transform: translate3d(calc(100vw + 420px), 0, 0); }
        }
        @keyframes cloud-drift-track-3 {
          0% { transform: translate3d(-360px, 0, 0); }
          100% { transform: translate3d(calc(100vw + 360px), 0, 0); }
        }
        @keyframes cloud-drift-track-4 {
          0% { transform: translate3d(-400px, 0, 0); }
          100% { transform: translate3d(calc(100vw + 400px), 0, 0); }
        }
        @keyframes cessna-propeller-spin {
          0% { transform: scaleY(1); opacity: 0.9; }
          50% { transform: scaleY(0.18); opacity: 0.35; }
          100% { transform: scaleY(1); opacity: 0.9; }
        }
        @keyframes cessna-wing-strobe {
          0%, 80%, 100% { opacity: 0.15; filter: none; }
          86%, 94% { opacity: 1; filter: drop-shadow(0 0 7px #ef4444); }
        }
        @keyframes runway-edge-pulse {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 1; filter: drop-shadow(0 0 6px rgba(251, 191, 36, 0.95)); }
        }
        @keyframes float-score-rise {
          0% { transform: translate3d(0, 0, 0) scale(0.9); opacity: 0; }
          15% { transform: translate3d(0, -10px, 0) scale(1.15); opacity: 1; }
          80% { transform: translate3d(0, -32px, 0) scale(1); opacity: 0.95; }
          100% { transform: translate3d(0, -48px, 0) scale(0.95); opacity: 0; }
        }
      `}</style>

      {/* Atmospheric Sky Gradient Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300/35 via-sky-100/30 to-background dark:from-slate-950 dark:via-slate-900/90 dark:to-background transition-colors duration-500" />

      {/* Sun / Moon Radial Atmosphere Glow */}
      <div className="absolute top-12 right-1/4 h-80 w-80 rounded-full bg-amber-200/25 blur-3xl dark:bg-sky-400/10" />

      {/* ☁ FULL VOLUMETRIC ROUNDED CLOUDS CONTINUOUSLY DRIFTING ACROSS THE SKY */}
      {/* Cloud Track 1: Upper Sky (Large, Volumetric, Staggered at 20% width) */}
      <div
        className="absolute top-[4%] left-0 w-80 sm:w-96 opacity-95 dark:opacity-60"
        style={{ animation: "cloud-drift-track-1 46s linear infinite", animationDelay: "-14s" }}
      >
        <VolumetricCloud className="w-full text-white drop-shadow-[0_16px_30px_rgba(14,165,233,0.22)] dark:text-slate-800" />
      </div>

      {/* Cloud Track 2: Upper Mid-Sky (Staggered at 65% width) */}
      <div
        className="absolute top-[14%] left-0 w-72 sm:w-84 opacity-95 dark:opacity-55"
        style={{ animation: "cloud-drift-track-2 54s linear infinite", animationDelay: "-34s" }}
      >
        <VolumetricCloud className="w-full text-white drop-shadow-[0_16px_30px_rgba(14,165,233,0.22)] dark:text-slate-800" />
      </div>

      {/* Cloud Track 3: Mid Sky (Staggered at 40% width) */}
      <div
        className="absolute top-[32%] left-0 w-84 sm:w-[380px] opacity-90 dark:opacity-50"
        style={{ animation: "cloud-drift-track-3 62s linear infinite", animationDelay: "-24s" }}
      >
        <VolumetricCloud className="w-full text-white/95 drop-shadow-[0_14px_28px_rgba(14,165,233,0.18)] dark:text-slate-800" />
      </div>

      {/* Cloud Track 4: Mid-Lower Sky (Staggered at 80% width) */}
      <div
        className="absolute top-[46%] left-0 w-72 sm:w-80 opacity-90 dark:opacity-50"
        style={{ animation: "cloud-drift-track-4 44s linear infinite", animationDelay: "-36s" }}
      >
        <VolumetricCloud className="w-full text-white/95 drop-shadow-[0_14px_28px_rgba(14,165,233,0.18)] dark:text-slate-800" />
      </div>

      {/* Cloud Track 5: Lower Horizon Sky (Staggered at 10% width) */}
      <div
        className="absolute top-[58%] left-0 w-80 sm:w-92 opacity-85 dark:opacity-40"
        style={{ animation: "cloud-drift-track-1 58s linear infinite", animationDelay: "-6s" }}
      >
        <VolumetricCloud className="w-full text-white/90 drop-shadow-[0_12px_24px_rgba(14,165,233,0.16)] dark:text-slate-800" />
      </div>

      {/* 🌲 TREES & HORIZON LINE ACROSS THE BOTTOM (ABOVE RUNWAY) */}
      <div className="absolute bottom-[62px] left-0 right-0 h-16 pointer-events-none flex items-end">
        <svg
          viewBox="0 0 1600 64"
          preserveAspectRatio="none"
          className="w-full h-full text-emerald-800/80 dark:text-slate-900/90 drop-shadow-sm transition-colors duration-500"
          fill="currentColor"
        >
          {/* Dense tree silhouettes along airfield boundary */}
          <path d="M 0 64 L 0 38 Q 20 18 40 38 Q 55 10 70 38 Q 90 20 110 38 Q 130 8 150 38 Q 175 14 200 38 Q 220 22 240 38 Q 260 6 280 38 Q 305 16 330 38 Q 350 24 370 38 Q 390 12 410 38 Q 435 20 460 38 Q 485 8 510 38 Q 535 22 560 38 Q 585 14 610 38 Q 635 24 660 38 Q 685 10 710 38 Q 735 18 760 38 Q 785 6 810 38 Q 835 22 860 38 Q 885 12 910 38 Q 935 20 960 38 Q 985 8 1010 38 Q 1035 22 1060 38 Q 1085 14 1110 38 Q 1135 24 1160 38 Q 1185 10 1210 38 Q 1235 18 1260 38 Q 1285 6 1310 38 Q 1335 22 1360 38 Q 1385 12 1410 38 Q 1435 20 1460 38 Q 1485 8 1510 38 Q 1535 22 1560 38 Q 1585 16 1600 38 L 1600 64 Z" />
        </svg>
      </div>

      {/* 🛫 RUNWAY AT THE VERY BOTTOM OF THE SCREEN */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-800 dark:bg-slate-950 border-t-2 border-slate-700/80 dark:border-slate-800 shadow-2xl transition-colors duration-500">
        {/* Runway Edge Lights (Row along top edge) */}
        <div className="absolute -top-1 left-0 right-0 flex justify-between px-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-amber-400 dark:bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.9)]"
              style={{ animation: "runway-edge-pulse 2s infinite", animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>

        {/* Runway Markings: Threshold Piano Keys & Dashed Centerline */}
        <div className="relative h-full w-full flex items-center justify-between px-8">
          {/* Left Threshold Piano Keys */}
          <div className="flex gap-1.5 h-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-1.5 h-full bg-white/90 rounded-xs" />
            ))}
          </div>

          {/* Runway Number & Designator */}
          <div className="font-mono text-[11px] font-black text-white/80 tracking-widest px-2">
            27L
          </div>

          {/* Centerline Dashes */}
          <div className="flex-1 flex justify-center gap-8 px-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-8 h-1.5 bg-white/80 rounded-xs" />
            ))}
          </div>

          {/* Touchdown Zone Markings */}
          <div className="flex gap-2">
            <div className="w-4 h-5 bg-white/75 rounded-xs" />
            <div className="w-4 h-5 bg-white/75 rounded-xs" />
          </div>

          {/* Right Threshold Piano Keys */}
          <div className="flex gap-1.5 h-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-1.5 h-full bg-white/90 rounded-xs" />
            ))}
          </div>
        </div>
      </div>

      {/* 🏢 AIR TRAFFIC CONTROL TOWER (ATC TOWER ALONGSIDE RUNWAY 27L) */}
      <AirTrafficControlTower className="absolute bottom-[58px] right-[8%] sm:right-[15%] z-10" />

      {/* ✈ INTERACTIVE CESSNA 172 MODEL (FOLLOWS MOUSE WITH INERTIA & LANDS ON RUNWAY) */}
      <div
        ref={planeRef}
        className="absolute top-0 left-0 z-20 pointer-events-none will-change-transform"
        style={{
          transform: "translate3d(-100px, -100px, 0)",
          transition: "none",
        }}
      >
        <div className="relative -top-3 -left-6">
          <svg
            viewBox="0 0 120 48"
            className="h-7 w-auto overflow-visible filter drop-shadow-[0_4px_10px_rgba(2,132,199,0.35)] dark:drop-shadow-[0_4px_12px_rgba(56,189,248,0.45)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: "visible" }}
          >
            {/* 🔦 WARM NIGHT MODE HEADLIGHT BEAM (Visible in warm amber/gold in dark mode) */}
            <g
              data-testid="cessna-headlight-warm"
              className="hidden dark:block pointer-events-none"
              style={{ overflow: "visible" }}
            >
              {/* Wide volumetric warm halogen beam projection */}
              <polygon
                points="103,22 360,-28 360,72"
                fill="url(#cessnaWarmHeadlightBeam)"
                className="pointer-events-none"
              />

              {/* High-intensity forward core beam */}
              <polygon
                points="103,22 270,-10 270,54"
                fill="url(#cessnaWarmHeadlightCore)"
                className="pointer-events-none opacity-90"
              />

              {/* Glowing warm bulb filament at the nose cowl */}
              <circle
                cx="103"
                cy="22"
                r="4"
                className="fill-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,1)]"
              />
              <circle
                cx="103"
                cy="22"
                r="2"
                className="fill-white drop-shadow-[0_0_6px_rgba(254,240,138,1)]"
              />
            </g>

            {/* High-Wing Wing Strut (Diagonal support from cabin to wing) */}
            <line
              x1="52"
              y1="25"
              x2="68"
              y2="13"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-sky-800 dark:text-slate-300"
            />

            {/* Tricycle Landing Gear (Tires & Struts) */}
            {/* Nose gear */}
            <line x1="90" y1="26" x2="88" y2="38" stroke="#334155" strokeWidth="1.8" />
            <ellipse cx="88" cy="38" rx="2.5" ry="2.5" fill="#0f172a" />
            {/* Main gear */}
            <line x1="56" y1="26" x2="52" y2="40" stroke="#334155" strokeWidth="2" />
            <ellipse cx="52" cy="40" rx="3.5" ry="3.5" fill="#0f172a" />

            {/* Cessna 172 Fuselage (Classic high-wing cabin profile) */}
            <path
              d="M 102 20 C 98 17, 85 16, 70 17 L 34 20 L 16 22 L 6 15 L 2 15 L 6 25 L 14 26 L 34 26 L 68 27 C 86 28, 98 26, 102 22 Z"
              className="fill-sky-700 dark:fill-slate-100 transition-colors"
            />

            {/* High-Mounted Cessna Wing */}
            <path
              d="M 36 12 L 86 11 C 88 11, 88 14, 86 14 L 34 15 C 32 15, 32 12, 36 12 Z"
              className="fill-sky-900 dark:fill-slate-300"
            />

            {/* Cabin Windshield & Windows */}
            <path
              d="M 88 17 L 76 17 L 72 22 L 86 21 Z"
              className="fill-sky-200 dark:fill-sky-400 opacity-90"
            />
            <path
              d="M 68 18 L 56 18 L 56 22 L 68 22 Z"
              className="fill-sky-200 dark:fill-sky-400 opacity-90"
            />

            {/* Front Propeller Spinner */}
            <circle cx="103" cy="21" r="2.5" className="fill-red-600 dark:fill-red-500" />

            {/* Spinning Propeller Blur Disc */}
            <ellipse
              cx="103"
              cy="21"
              rx="1.2"
              ry="11"
              className="fill-slate-400/70 dark:fill-slate-200/80"
              style={{ animation: "cessna-propeller-spin 0.08s linear infinite" }}
            />

            {/* 🔴 RED BLINKING LIGHT ON WING (Micro dot with strobe pulse) */}
            <circle
              cx="36"
              cy="10"
              r="2"
              className="fill-red-500"
              style={{ animation: "cessna-wing-strobe 1s infinite" }}
            />

            {/* Green Navigation Starboard Micro Dot */}
            <circle cx="86" cy="10" r="1.5" className="fill-emerald-400" />

            {/* White Tail Strobe Micro Dot */}
            <circle cx="4" cy="15" r="1.5" className="fill-white animate-pulse" />

            <defs>
              {/* Rich Warm Golden-Amber Halogen Beam Gradient for Night Headlights */}
              <linearGradient id="cessnaWarmHeadlightBeam" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                <stop offset="12%" stopColor="#fbbf24" stopOpacity="0.80" />
                <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.50" />
                <stop offset="70%" stopColor="#d97706" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
              </linearGradient>

              {/* High-Intensity Warm White/Gold Center Core */}
              <linearGradient id="cessnaWarmHeadlightCore" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="20%" stopColor="#fef08a" stopOpacity="0.80" />
                <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>

              {/* Headlight Beam Alias */}
              <linearGradient id="cessnaHeadlightBeam" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                <stop offset="20%" stopColor="#fbbf24" stopOpacity="0.80" />
                <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* ✦ DRIFTING SKY COLLECTABLES (WAYPOINTS, WINGS & FUEL CANISTERS) */}
      <div className="absolute inset-0 pointer-events-none">
        {itemsRef.current.map((item, idx) => (
          <div
            key={item.id}
            ref={(el) => {
              itemElsRef.current[idx] = el;
            }}
            data-testid={`sky-collectable-${item.type}`}
            className="absolute top-0 left-0 transition-opacity duration-300 pointer-events-none will-change-transform"
            style={{
              transform: `translate3d(${item.x}px, ${item.y}px, 0)`,
            }}
          >
            {item.type === "wing" && <CollectableWing />}
            {item.type === "fuel" && <CollectableFuel />}
            {item.type === "waypoint" && <CollectableWaypoint name={item.name} />}
          </div>
        ))}
      </div>

      {/* ✦ FLOATING SCORE FEEDBACK TAGS */}
      {floatingTags.map((tag) => (
        <div
          key={tag.id}
          className={cn(
            "pointer-events-none absolute font-mono font-black text-xs sm:text-sm tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] z-30 select-none",
            tag.color,
          )}
          style={{
            left: `${tag.x}px`,
            top: `${tag.y}px`,
            animation: "float-score-rise 1.2s ease-out forwards",
          }}
        >
          {tag.text}
        </div>
      ))}
      </div>

      {/* ✦ GLASS COCKPIT FLIGHT-POINTS HUD WITH HIDE/SHOW NOTCH */}
      <FlightScoutHUD
        score={score}
        waypoints={waypoints}
        fuel={fuel}
        streak={streak}
        onReset={handleResetGame}
      />
    </>
  );
}

function LoginPage() {
  const { data, me, hydrated, noAccess, signOut, reload, update } = useStore();
  const navigate = useNavigate();

  // Mode: "signin" | "signup"
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  // Sign In inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("");

  // Create Account inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [verify, setVerify] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [master, setMaster] = useState("");
  const [busy, setBusy] = useState(false);

  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  // Handle selecting a persona from the Quick Login dropdown
  const handleSelectPersona = (personaId: string) => {
    setSelectedPersonaId(personaId);
    if (!personaId) {
      setEmail("");
      setPassword("");
      return;
    }
    const found = TESTING_USERS.find((p) => p.id === personaId);
    if (found) {
      setEmail(found.email);
      setPassword("");
      toast.info(`Selected ${found.name}. Please enter your password.`);
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
    }
  };

  // Selected persona object
  const activeSelectedPersona = useMemo(() => {
    if (selectedPersonaId) {
      return TESTING_USERS.find((p) => p.id === selectedPersonaId) ?? null;
    }
    const clean = email.trim().toLowerCase();
    return TESTING_USERS.find((p) => p.email.toLowerCase() === clean) ?? null;
  }, [selectedPersonaId, email]);

  function navigateForEmail() {
    void navigate({ to: "/dashboard" });
  }

  // Real-time auto-unlock when an Administrator approves a waiting pending user
  const wasPendingRef = useRef(false);
  useEffect(() => {
    if (!hydrated || !me) {
      wasPendingRef.current = false;
      return;
    }
    if (isUserPendingApproval(me)) {
      wasPendingRef.current = true;
    } else if (wasPendingRef.current) {
      wasPendingRef.current = false;
      playNotificationSound();
      toast.success("Your account login has been approved by the Administrator! Entering portal…");
      void navigate({ to: "/dashboard" });
    }
  }, [hydrated, me, navigate]);

  // Handle Form Submission (Sign In or Create Account)
  async function submitAuth(e: FormEvent) {
    e.preventDefault();
    const clean = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean) || clean.length > 255) {
      toast.error("Enter a valid email address.");
      return;
    }
    if (password.length < 4) {
      toast.error("Password must be at least 4 characters.");
      return;
    }

    if (mode === "signup") {
      if (!firstName.trim() || !lastName.trim()) {
        toast.error("Enter your first and last name.");
        return;
      }
      const normPhone = phone.replace(/[\s\-()]/g, "");
      if (normPhone.length < 7) {
        toast.error("Enter a valid phone number.");
        return;
      }
      const activeUsers = data.users.filter((u) => u.status === "active");
      if (activeUsers.some((u) => u.email.toLowerCase() === clean.toLowerCase())) {
        toast.error(
          "An account with this email address already exists. Duplicate email addresses are not permitted.",
        );
        return;
      }
      if (activeUsers.some((u) => u.phone && u.phone.replace(/[\s\-()]/g, "") === normPhone)) {
        toast.error(
          "An account with this phone number already exists. Duplicate phone numbers are not permitted.",
        );
        return;
      }
      if (password !== verify) {
        toast.error("Passwords do not match.");
        return;
      }
      if (role === "admin" && master !== "admin-master-key" && master !== FIXED_TESTING_PASSWORD) {
        toast.error("Invalid master key for administrator registration.");
        return;
      }
    } else {
      // In controlled testing mode, validate testing password for canonical testing personas
      const isCanonicalPersona = TESTING_USERS.some(
        (u) => u.email.toLowerCase() === clean.toLowerCase(),
      );
      if (isCanonicalPersona && password !== FIXED_TESTING_PASSWORD && password !== "demo12345") {
        toast.error("Invalid password. Access is restricted to authorized credentials.");
        return;
      }
    }

    setBusy(true);
    if (me) {
      await signOut();
    }

    if (mode === "signin") {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email: clean,
        password,
      });
      setBusy(false);
      if (error) {
        toast.error(error.message);
      } else {
        if (activeSelectedPersona) {
          recordUserLoginSession(
            {
              id: activeSelectedPersona.id,
              name: activeSelectedPersona.name,
              email: activeSelectedPersona.email,
              role: activeSelectedPersona.role,
            },
            "Portal Password Sign-In",
            true,
          );
        }
        await reload();
        const matchingUser = data.users.find(
          (u) => u.email.toLowerCase() === clean.toLowerCase() && u.status !== "deleted",
        );
        if (isUserPendingApproval(matchingUser)) {
          toast.warning(
            "Your account is registered and awaiting Administrator approval before portal access is granted.",
          );
          return;
        }
        toast.success(`Signed in successfully as ${signInData.user?.email || clean}!`);
        navigateForEmail();
      }
      return;
    }

    // Sign Up Mode
    const { error } = await supabase.auth.signUp({
      email: clean,
      password,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) {
      setBusy(false);
      toast.error(error.message);
      return;
    }

    // Register member in database table (non-admin accounts start as PENDING_ADMIN_APPROVAL)
    const { error: regErr } = await db.rpc("register_member", {
      p_first: firstName.trim(),
      p_last: lastName.trim(),
      p_email: clean.toLowerCase(),
      p_phone: phone.trim(),
      p_role: role,
      p_master: role === "admin" ? master : null,
    });

    if (regErr) {
      setBusy(false);
      toast.error(regErr.message);
      await supabase.auth.signOut();
      return;
    }

    await reload();
    setBusy(false);
    if (role === "admin") {
      toast.success("Administrator account created and saved to database!");
      void navigate({ to: "/dashboard" });
    } else {
      toast.success(
        "Account registered in database! Access will unlock automatically as soon as the Administrator approves your login.",
      );
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary flex flex-col justify-between">
      {/* ✈ Interactive Aviation Sky Background with Mouse-Following Cessna, Runway & Visible Clouds */}
      <InteractiveAviationSky />

      {/* Top Glassmorphic Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/80 px-3 sm:px-6 py-2.5 sm:py-3.5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-2.5 sm:gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-7 min-w-0">
            <Link to="/" className="flex items-center shrink-0 transition hover:opacity-90">
              <BrandLogo className="h-9 sm:h-10" />
            </Link>
            <div className="hidden sm:block h-6 w-px bg-border/80 shrink-0" aria-hidden="true" />
            <LiveIstClock />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-foreground/80 shadow-xs backdrop-blur-md transition hover:border-primary/50 hover:bg-card hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Back to Home</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ════════════════════ CENTERED LANDSCAPE RECTANGLE BOX (WIDTH > LENGTH) ════════════════════ */}
      <main className="relative z-10 mx-auto my-auto flex w-full max-w-[840px] flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6">
        <section
          className="w-full rounded-3xl border border-white/40 dark:border-white/10 bg-card/90 dark:bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl transition-all duration-300 min-h-[500px] flex flex-col justify-between"
          data-testid="auth-console-section"
        >
          {/* Header & Mode Switcher Segmented Control */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-5">
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-[10px] font-bold tracking-widest text-primary uppercase">
                  SilverArrows Flight Operations
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary dark:text-sky-400">
                {mode === "signin" ? "Portal Sign In" : "Register Profile"}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                {mode === "signin"
                  ? "Sign in to access your flight operations, syllabus, and logbooks."
                  : "Create a new member entry in the local academy database."}
              </p>
            </div>

            {/* Smooth Mode Switcher Pill Control */}
            <div
              className="relative flex items-center rounded-full border border-border/80 bg-muted/60 p-1 shadow-inner backdrop-blur-md self-start sm:self-center shrink-0"
              role="tablist"
              aria-label="Authentication modes"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "signin"}
                data-testid="mode-tab-signin"
                onClick={() => setMode("signin")}
                className={`relative z-10 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
                  mode === "signin"
                    ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                }`}
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "signup"}
                data-testid="mode-tab-signup"
                onClick={() => setMode("signup")}
                className={`relative z-10 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
                  mode === "signup"
                    ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                }`}
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Register</span>
              </button>
            </div>
          </div>

          {/* Active Session Card (if user is currently logged in) */}
          {hydrated && me && (
            <div
              className={`my-4 rounded-2xl border p-4 text-xs ${
                isUserPendingApproval(me)
                  ? "border-amber-500/50 bg-amber-500/10"
                  : "border-primary/40 bg-primary/10"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-[11px] font-bold ${
                      isUserPendingApproval(me)
                        ? "bg-amber-500 text-slate-950"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {me.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <div className="font-semibold text-foreground">{me.name}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      {me.email} · {roleLabel[me.role]}
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs border-primary/30"
                  onClick={() => void signOut()}
                >
                  <LogOut className="mr-1 h-3 w-3" /> Sign out
                </Button>
              </div>

              {isUserPendingApproval(me) ? (
                <div className="mt-3 rounded-xl border border-amber-500/40 bg-background/80 p-3 text-left">
                  <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>Account Pending Administrator Login Approval</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                    Your account has been created in the database. Portal access is locked until the
                    Administrator approves your login. Keep this screen open — your portal will
                    unlock automatically in real time as soon as approved.
                  </p>
                </div>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  className="mt-3 w-full text-xs font-semibold shadow-xs"
                  onClick={() => void navigate({ to: "/dashboard" })}
                >
                  <Plane className="mr-1.5 h-3.5 w-3.5" /> Continue to Dashboard
                </Button>
              )}
            </div>
          )}

          {noAccess ? (
            <div className="my-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-5 text-xs">
              <div className="flex items-center gap-2 text-destructive font-semibold">
                <ShieldAlert className="h-4 w-4" />
                <span>Unlinked Member Profile</span>
              </div>
              <p className="mt-1.5 text-muted-foreground leading-relaxed">
                This account is not yet linked to an academy member record in the database. Ask your
                administrator to add this email to your member profile, then sign in again.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => void signOut()}
              >
                <LogOut className="mr-1.5 h-3.5 w-3.5" /> Sign out
              </Button>
            </div>
          ) : (
            <form onSubmit={submitAuth} className="mt-6 flex-1 flex flex-col justify-between">
              {/* ────────────────────── MODE A: SIGN IN (BALANCED 2-COLUMN LANDSCAPE) ────────────────────── */}
              {mode === "signin" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-in fade-in duration-300">
                  {/* Left Column: Quick Profile Select & Preview */}
                  <div className="space-y-3 rounded-2xl border border-border/80 bg-background/50 p-4">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="quickPersonaSelect"
                        className="font-mono text-[11px] font-bold tracking-wider text-primary uppercase"
                      >
                        ⚡ Quick Profile Login
                      </Label>
                      <span className="font-mono text-[10px] text-muted-foreground">Select user</span>
                    </div>

                    <NativeSelect
                      id="quickPersonaSelect"
                      data-testid="quick-persona-select"
                      value={selectedPersonaId}
                      onChange={(e) => handleSelectPersona(e.target.value)}
                      className="w-full text-xs font-medium bg-background"
                    >
                      <option value="">-- Choose an academy user to login --</option>
                      <optgroup label="Administrator">
                        <option value="u-admin">
                          Sakshi Gaur · Administrator (sakshi@flysilverarrows.com)
                        </option>
                      </optgroup>
                      <optgroup label="Flight Instructors (CFI)">
                        <option value="u-vpl">
                          Vipul Aviation · Chief CFI (vipul@flysilverarrows.com)
                        </option>
                        <option value="u-prn">
                          Priya Nair · Flight Instructor (priya@flysilverarrows.com)
                        </option>
                      </optgroup>
                      <optgroup label="Ground School">
                        <option value="u-anj">
                          Anujay Singh · Ground Instructor (anujay@flysilverarrows.com)
                        </option>
                      </optgroup>
                      <optgroup label="Student Pilots">
                        <option value="u-ana">
                          Ananya Sharma · Student Pilot (ananya@flysilverarrows.com)
                        </option>
                        <option value="u-arp">
                          Aarav Patel · Student Pilot (aarav@flysilverarrows.com)
                        </option>
                        <option value="u-lnl">
                          Liam Nielsen · Student Pilot (liam@flysilverarrows.com)
                        </option>
                        <option value="u-rhv">
                          Rohan Verma · Student Pilot (rohan@flysilverarrows.com)
                        </option>
                      </optgroup>
                    </NativeSelect>

                    {/* Selected Persona Callout Banner */}
                    {activeSelectedPersona ? (
                      <div
                        className="rounded-xl border border-sky-400/40 bg-sky-500/10 p-3 text-xs animate-in fade-in duration-200"
                        data-testid="selected-persona-badge"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="flex h-7 w-7 items-center justify-center rounded-lg font-mono text-[11px] font-bold text-white shadow-xs"
                              style={{ backgroundColor: activeSelectedPersona.accent }}
                            >
                              {activeSelectedPersona.avatar}
                            </span>
                            <div>
                              <div className="font-bold text-foreground">
                                {activeSelectedPersona.name}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {roleLabel[activeSelectedPersona.role]} · {activeSelectedPersona.stage}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold ${activeSelectedPersona.badgeBg} ${activeSelectedPersona.badgeText}`}
                          >
                            {activeSelectedPersona.callsign}
                          </span>
                        </div>
                        <div className="mt-2 text-[11px] text-muted-foreground border-t border-sky-400/20 pt-1.5">
                          Profile selected. Please enter authorization password to proceed.
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-border/70 bg-card/40 p-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2 font-medium text-foreground">
                          <UserCheck className="h-4 w-4 text-primary" />
                          <span>Fast Testing Access</span>
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed">
                          Choose any pilot or staff profile from the dropdown, or manually enter your credentials on the right.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Email & Password Credentials */}
                  <div className="space-y-4 rounded-2xl border border-border/80 bg-background/50 p-4">
                    {/* Email Input */}
                    <div className="space-y-1.5 text-left">
                      <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          placeholder="pilot@flysilverarrows.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setSelectedPersonaId("");
                          }}
                          maxLength={255}
                          required
                          className="pl-9 text-xs bg-background/80"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5 text-left">
                      <Label htmlFor="password" className="text-xs font-semibold text-foreground">
                        Password
                      </Label>
                      <div className="relative">
                        <KeyRound className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          ref={passwordInputRef}
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          minLength={4}
                          required
                          className="pr-9 pl-9 text-xs bg-background/80 font-mono"
                        />
                        <button
                          type="button"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <span>Restricted to authorized academy members</span>
                      <span className="font-mono text-[10px] text-primary">Active Session</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ────────────────────── MODE B: CREATE NEW ACCOUNT (BALANCED 2-COLUMN LANDSCAPE) ────────────────────── */}
              {mode === "signup" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-in fade-in duration-300">
                  {/* Left Column: Personal Information */}
                  <div className="space-y-3 rounded-2xl border border-border/80 bg-background/50 p-4">
                    <div className="font-mono text-[11px] font-bold tracking-wider text-primary uppercase text-left">
                      Member Information
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-left">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName" className="text-xs font-semibold">
                          First name
                        </Label>
                        <Input
                          id="firstName"
                          autoComplete="given-name"
                          placeholder="e.g. Kabir"
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value);
                            if (!email || email.includes("@flysilverarrows.com")) {
                              setEmail(
                                `${e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "")}@flysilverarrows.com`,
                              );
                            }
                          }}
                          maxLength={100}
                          required
                          className="text-xs bg-background/80"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lastName" className="text-xs font-semibold">
                          Last name
                        </Label>
                        <Input
                          id="lastName"
                          autoComplete="family-name"
                          placeholder="e.g. Mehta"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          maxLength={100}
                          required
                          className="text-xs bg-background/80"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="signupEmail" className="text-xs font-semibold">
                          Email address (Must be unique)
                        </Label>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          Table Synced
                        </span>
                      </div>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="signupEmail"
                          type="email"
                          autoComplete="email"
                          placeholder="firstname@flysilverarrows.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          maxLength={255}
                          required
                          className="pl-9 text-xs bg-background/80"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="signupPhone" className="text-xs font-semibold">
                          Phone number (Must be unique)
                        </Label>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          Required
                        </span>
                      </div>
                      <Input
                        id="signupPhone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+91 98100 00000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        maxLength={30}
                        required
                        className="text-xs bg-background/80"
                      />
                    </div>
                  </div>

                  {/* Right Column: Role & Security Credentials */}
                  <div className="space-y-3 rounded-2xl border border-border/80 bg-background/50 p-4">
                    <div className="font-mono text-[11px] font-bold tracking-wider text-primary uppercase text-left">
                      Role & Security
                    </div>

                    <div className="space-y-1.5 text-left">
                      <Label htmlFor="signupRole" className="text-xs font-semibold">
                        Academy Role
                      </Label>
                      <NativeSelect
                        id="signupRole"
                        value={role}
                        onChange={(e) => setRole(e.target.value as Role)}
                        className="text-xs bg-background/80 font-medium"
                      >
                        <option value="student">Student Pilot (EASA PPL / CPL)</option>
                        <option value="instructor">Flight Instructor (CFI)</option>
                        <option value="ground">Ground School Instructor</option>
                        <option value="admin">Administrator (Requires Master Key)</option>
                      </NativeSelect>
                    </div>

                    {role === "admin" && (
                      <div className="space-y-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 p-2.5 text-left">
                        <Label htmlFor="masterKey" className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                          Master Key (Admin only)
                        </Label>
                        <Input
                          id="masterKey"
                          type="password"
                          placeholder="Enter admin master key"
                          value={master}
                          onChange={(e) => setMaster(e.target.value)}
                          required
                          className="text-xs bg-background/90"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-left">
                      <div className="space-y-1.5">
                        <Label htmlFor="signupPassword" className="text-xs font-semibold">
                          Password
                        </Label>
                        <Input
                          id="signupPassword"
                          type="password"
                          autoComplete="new-password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          minLength={4}
                          required
                          className="text-xs bg-background/80 font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="verifyPassword" className="text-xs font-semibold">
                          Verify password
                        </Label>
                        <Input
                          id="verifyPassword"
                          type="password"
                          autoComplete="new-password"
                          placeholder="••••••••"
                          value={verify}
                          onChange={(e) => setVerify(e.target.value)}
                          minLength={4}
                          required
                          className="text-xs bg-background/80 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Actions: Submit Button & Mode Toggle Link */}
              <div className="mt-6 space-y-3">
                <Button
                  type="submit"
                  disabled={busy || !hydrated}
                  className="w-full h-11 font-bold text-xs shadow-lg transition-all"
                  data-testid="auth-submit-btn"
                >
                  {busy ? (
                    "Processing authentication…"
                  ) : mode === "signin" ? (
                    <span className="flex items-center justify-center gap-2">
                      <span>Sign In to Portal</span>
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Create Profile & Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                    className="font-semibold text-primary hover:underline"
                    data-testid="auth-mode-toggle"
                  >
                    {mode === "signin"
                      ? "New academy member? Register a new profile →"
                      : "← Already registered? Return to Sign In"}
                  </button>

                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Table synced & audit logged</span>
                  </div>
                </div>
              </div>
            </form>
          )}
        </section>
      </main>

      {/* Glassmorphic Footer */}
      <footer className="relative z-10 border-t border-border/80 bg-background/80 px-6 py-4 text-xs text-muted-foreground backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex flex-wrap items-center gap-3">
            <BrandLogo className="h-7 w-[100px]" />
            <span className="text-border">|</span>
            <span className="font-mono text-[11px]">SilverArrows Flight Operations OS</span>
            <span
              data-testid="login-build-badge"
              className="inline-flex items-center rounded-md border border-border/80 bg-muted/60 px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground"
            >
              Build #{APP_BUILD_HASH}
            </span>
          </div>
          <p className="text-center font-medium sm:text-right">
            &copy; {new Date().getFullYear()} SilverArrows Flight Academy · Build{" "}
            <span className="font-mono font-semibold text-foreground">{APP_BUILD_HASH}</span> ·
            Regulatory Audit Compliant.
          </p>
        </div>
      </footer>
    </div>
  );
}
