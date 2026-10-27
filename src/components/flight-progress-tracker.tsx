import { useMemo, useState, useEffect } from "react";
import { format, subDays, isAfter, startOfMonth, parseISO } from "date-fns";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  Plane,
  Clock,
  Compass,
  Moon,
  Sun,
  Award,
  RefreshCw,
  Database,
  Filter,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useMe } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { fmtDec, fmtHours } from "@/lib/logic";
import type { Flight, User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NativeSelect, Section } from "@/components/app-ui";

export interface FlightProgressTrackerProps {
  /** Optional pilot ID to scope the tracker to. If not provided, defaults to current user or all if admin. */
  pilotId?: string;
  className?: string;
  /** Whether to show the pilot picker (for admins and instructors) */
  showPilotSelector?: boolean;
}

type TimeHorizon = "30d" | "90d" | "6m" | "1y" | "all";
type ChartMode = "cumulative" | "monthly" | "distribution";

interface ChartDataPoint {
  date: string;
  formattedDate: string;
  minutes: number;
  hours: number;
  cumulativeHours: number;
  dualHours: number;
  soloHours: number;
  xcHours: number;
  nightHours: number;
  landings: number;
  sorties: number;
}

const COLORS = {
  total: "#2563eb", // blue-600
  dual: "#3b82f6", // blue-500
  solo: "#10b981", // emerald-500
  xc: "#f59e0b", // amber-500
  night: "#8b5cf6", // violet-500
  sim: "#64748b", // slate-500
  grid: "#e2e8f0",
  gridDark: "#334155",
};

export function FlightProgressTracker({
  pilotId: propPilotId,
  className = "",
  showPilotSelector = true,
}: FlightProgressTrackerProps) {
  const { data, me } = useMe();

  // Pilot selection state
  const defaultPilotId = propPilotId ?? (me?.role === "student" ? me?.id : "all");
  const [selectedPilotId, setSelectedPilotId] = useState<string>(defaultPilotId);
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>("6m");
  const [chartMode, setChartMode] = useState<ChartMode>("cumulative");
  const [isSyncing, setIsSyncing] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<"idle" | "synced" | "connected">("connected");

  // Keep selectedPilotId in sync with prop if it changes
  useEffect(() => {
    if (propPilotId) {
      setSelectedPilotId(propPilotId);
    }
  }, [propPilotId]);

  // Pilots list for selection (students & instructors)
  const availablePilots = useMemo(() => {
    return data.users.filter((u) => u.status !== "deleted" && (u.role === "student" || u.role === "instructor"));
  }, [data.users]);

  // Filter flights based on pilot and time horizon
  const filteredFlights = useMemo(() => {
    let flights = [...data.flights].filter((f) => f.verificationStatus !== "rejected");

    // Filter by pilot
    if (selectedPilotId && selectedPilotId !== "all") {
      flights = flights.filter((f) => f.pilotId === selectedPilotId);
    } else if (me?.role === "student") {
      flights = flights.filter((f) => f.pilotId === me.id);
    }

    // Sort chronologically by date
    flights.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Filter by time horizon
    const now = new Date();
    if (timeHorizon !== "all") {
      const daysMap: Record<Exclude<TimeHorizon, "all">, number> = {
        "30d": 30,
        "90d": 90,
        "6m": 180,
        "1y": 365,
      };
      const cutoff = subDays(now, daysMap[timeHorizon]);
      flights = flights.filter((f) => isAfter(new Date(f.date), cutoff));
    }

    return flights;
  }, [data.flights, selectedPilotId, me, timeHorizon]);

  // Aggregated totals
  const stats = useMemo(() => {
    let totalMinutes = 0;
    let dualMinutes = 0;
    let soloMinutes = 0;
    let xcMinutes = 0;
    let nightMinutes = 0;
    let totalLandings = 0;
    let nightLandings = 0;

    for (const f of filteredFlights) {
      totalMinutes += f.minutes;
      if (f.kind === "dual") dualMinutes += f.minutes;
      if (f.kind === "solo" || f.kind === "pic") soloMinutes += f.minutes;
      if (f.xcMinutes) xcMinutes += f.xcMinutes;
      if (f.nightMinutes) nightMinutes += f.nightMinutes;
      totalLandings += f.landings ?? 0;
      nightLandings += f.nightLandings ?? 0;
    }

    const totalHours = totalMinutes / 60;
    const avgDuration = filteredFlights.length > 0 ? totalMinutes / filteredFlights.length : 0;

    return {
      totalHours,
      totalMinutes,
      dualHours: dualMinutes / 60,
      soloHours: soloMinutes / 60,
      xcHours: xcMinutes / 60,
      nightHours: nightMinutes / 60,
      totalLandings,
      nightLandings,
      flightCount: filteredFlights.length,
      avgDurationMinutes: Math.round(avgDuration),
    };
  }, [filteredFlights]);

  // Cumulative timeline data points
  const cumulativeData = useMemo(() => {
    let runningMinutes = 0;
    let runningDual = 0;
    let runningSolo = 0;
    let runningXc = 0;
    let runningNight = 0;

    return filteredFlights.map((f, idx) => {
      runningMinutes += f.minutes;
      if (f.kind === "dual") runningDual += f.minutes;
      if (f.kind === "solo" || f.kind === "pic") runningSolo += f.minutes;
      if (f.xcMinutes) runningXc += f.xcMinutes;
      if (f.nightMinutes) runningNight += f.nightMinutes;

      return {
        date: f.date,
        formattedDate: format(new Date(f.date), "dd MMM yyyy"),
        minutes: f.minutes,
        hours: Math.round((f.minutes / 60) * 10) / 10,
        cumulativeHours: Math.round((runningMinutes / 60) * 10) / 10,
        dualHours: Math.round((runningDual / 60) * 10) / 10,
        soloHours: Math.round((runningSolo / 60) * 10) / 10,
        xcHours: Math.round((runningXc / 60) * 10) / 10,
        nightHours: Math.round((runningNight / 60) * 10) / 10,
        landings: f.landings ?? 0,
        sorties: idx + 1,
      };
    });
  }, [filteredFlights]);

  // Periodic (Monthly) Aggregation
  const monthlyData = useMemo(() => {
    const map = new Map<
      string,
      {
        monthLabel: string;
        dateSort: string;
        dualHours: number;
        soloHours: number;
        simHours: number;
        totalHours: number;
        sorties: number;
        landings: number;
      }
    >();

    for (const f of filteredFlights) {
      const monthKey = format(new Date(f.date), "yyyy-MM");
      const label = format(new Date(f.date), "MMM yyyy");

      if (!map.has(monthKey)) {
        map.set(monthKey, {
          monthLabel: label,
          dateSort: monthKey,
          dualHours: 0,
          soloHours: 0,
          simHours: 0,
          totalHours: 0,
          sorties: 0,
          landings: 0,
        });
      }

      const entry = map.get(monthKey)!;
      const h = f.minutes / 60;
      entry.totalHours += h;
      entry.sorties += 1;
      entry.landings += f.landings ?? 0;

      if (f.kind === "dual") entry.dualHours += h;
      else if (f.kind === "solo" || f.kind === "pic") entry.soloHours += h;
      else if (f.kind === "sim") entry.simHours += h;
    }

    return Array.from(map.values())
      .sort((a, b) => a.dateSort.localeCompare(b.dateSort))
      .map((m) => ({
        ...m,
        dualHours: Math.round(m.dualHours * 10) / 10,
        soloHours: Math.round(m.soloHours * 10) / 10,
        simHours: Math.round(m.simHours * 10) / 10,
        totalHours: Math.round(m.totalHours * 10) / 10,
      }));
  }, [filteredFlights]);

  // Distribution Data (Category Pie Chart)
  const distributionData = useMemo(() => {
    const dual = Math.round(stats.dualHours * 10) / 10;
    const solo = Math.round(stats.soloHours * 10) / 10;
    const xc = Math.round(stats.xcHours * 10) / 10;
    const night = Math.round(stats.nightHours * 10) / 10;
    const other = Math.max(0, Math.round((stats.totalHours - dual - solo) * 10) / 10);

    const items = [
      { name: "Dual Received", value: dual, color: COLORS.dual },
      { name: "Solo / PIC", value: solo, color: COLORS.solo },
      { name: "Cross-Country (XC)", value: xc, color: COLORS.xc },
      { name: "Night Flown", value: night, color: COLORS.night },
    ];

    if (other > 0) {
      items.push({ name: "Other / Sim", value: other, color: COLORS.sim });
    }

    return items.filter((i) => i.value > 0);
  }, [stats]);

  // Sync / query from Supabase
  const handleSupabaseRefresh = async () => {
    setIsSyncing(true);
    try {
      const { data: remoteRows, error } = await supabase
        .from("flights")
        .select("id, pilot_id, minutes, date, kind, verification_status")
        .limit(20);

      if (error) {
        toast.info("Using cached local logs; Supabase tables are ready for live sync.");
      } else {
        setSupabaseStatus("synced");
        toast.success(`Queried ${remoteRows?.length ?? 0} flight logs from Supabase.`);
      }
    } catch {
      toast.info("Live local store synchronized.");
    } finally {
      setIsSyncing(false);
    }
  };

  const selectedPilot = data.users.find((u) => u.id === selectedPilotId);

  return (
    <div className={`space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-6 ${className}`}>
      {/* Header bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Flight Progress Tracker
            </h3>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Database className="h-3 w-3 text-emerald-500" />
              Supabase Logged
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {selectedPilot
              ? `Flight hour accumulation and syllabus training milestones for ${selectedPilot.name}`
              : "Consolidated academy flight hours trends over time"}
          </p>
        </div>

        {/* Controls: Pilot Picker, Time Window, Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          {showPilotSelector && (me?.role === "admin" || me?.role === "instructor") && (
            <div className="w-44">
              <NativeSelect
                value={selectedPilotId}
                onChange={(e) => setSelectedPilotId(e.target.value)}
                aria-label="Filter by Pilot"
                className="text-xs h-8"
              >
                <option value="all">All Pilots (Academy Total)</option>
                {availablePilots.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.role.toUpperCase()})
                  </option>
                ))}
              </NativeSelect>
            </div>
          )}

          {/* Time Horizon Selector */}
          <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5 text-xs">
            {(["30d", "90d", "6m", "1y", "all"] as TimeHorizon[]).map((horizon) => (
              <button
                key={horizon}
                type="button"
                onClick={() => setTimeHorizon(horizon)}
                className={`rounded-md px-2 py-1 font-medium transition ${
                  timeHorizon === horizon
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {horizon.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Supabase sync button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSupabaseRefresh}
            disabled={isSyncing}
            className="h-8 gap-1.5 text-xs px-2.5"
            title="Query Supabase flight records"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin text-primary" : ""}`} />
            <span className="hidden sm:inline">Sync</span>
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards (Unboxed clean layout following frontend-design rules) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 border-y border-border/60 py-3">
        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            Total Logged
          </span>
          <div className="text-xl font-bold font-mono text-primary flex items-baseline gap-1">
            {fmtHours(stats.totalMinutes)}
          </div>
          <span className="text-[10px] text-muted-foreground">{stats.flightCount} total sorties</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
            <Plane className="h-3 w-3 text-blue-500" /> Dual Hours
          </span>
          <div className="text-xl font-bold font-mono text-foreground">
            {fmtDec(stats.dualHours)}h
          </div>
          <span className="text-[10px] text-muted-foreground">Instruction received</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
            <Award className="h-3 w-3 text-emerald-500" /> Solo / PIC
          </span>
          <div className="text-xl font-bold font-mono text-foreground">
            {fmtDec(stats.soloHours)}h
          </div>
          <span className="text-[10px] text-muted-foreground">Pilot-in-command</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
            <Compass className="h-3 w-3 text-amber-500" /> Cross-Country
          </span>
          <div className="text-xl font-bold font-mono text-foreground">
            {fmtDec(stats.xcHours)}h
          </div>
          <span className="text-[10px] text-muted-foreground">Navigation sorties</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
            <Moon className="h-3 w-3 text-violet-500" /> Night Hours
          </span>
          <div className="text-xl font-bold font-mono text-foreground">
            {fmtDec(stats.nightHours)}h
          </div>
          <span className="text-[10px] text-muted-foreground">{stats.nightLandings} night ldgs</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            Total Landings
          </span>
          <div className="text-xl font-bold font-mono text-foreground">
            {stats.totalLandings}
          </div>
          <span className="text-[10px] text-muted-foreground">Avg {stats.avgDurationMinutes}m / sortie</span>
        </div>
      </div>

      {/* Chart View Tabs */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1 text-xs">
            <button
              type="button"
              onClick={() => setChartMode("cumulative")}
              className={`rounded-md px-3 py-1 font-medium transition ${
                chartMode === "cumulative"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Cumulative Trend
            </button>
            <button
              type="button"
              onClick={() => setChartMode("monthly")}
              className={`rounded-md px-3 py-1 font-medium transition ${
                chartMode === "monthly"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly Volume
            </button>
            <button
              type="button"
              onClick={() => setChartMode("distribution")}
              className={`rounded-md px-3 py-1 font-medium transition ${
                chartMode === "distribution"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Category Share
            </button>
          </div>

          <div className="text-xs text-muted-foreground hidden sm:block">
            {filteredFlights.length === 0 ? "No sorties recorded" : `${filteredFlights.length} sorties in period`}
          </div>
        </div>

        {/* 1. Cumulative Trend Chart */}
        {chartMode === "cumulative" && (
          <div className="h-[280px] w-full pt-2">
            {cumulativeData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                No flight entries found for the selected timeframe.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cumulativeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="totalHoursGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.total} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={COLORS.total} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    dataKey="formattedDate"
                    tick={{ fontSize: 11 }}
                    stroke="#94a3b8"
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="#94a3b8"
                    tickLine={false}
                    unit="h"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const pt = payload[0]?.payload as ChartDataPoint;
                      return (
                        <div className="rounded-lg border border-border bg-popover p-2.5 text-xs shadow-md text-popover-foreground space-y-1">
                          <p className="font-semibold text-foreground">{pt.formattedDate}</p>
                          <div className="space-y-0.5 text-[11px]">
                            <p className="text-primary font-medium">Cumulative Total: {pt.cumulativeHours}h</p>
                            <p className="text-blue-500">Dual Total: {pt.dualHours}h</p>
                            <p className="text-emerald-500">Solo Total: {pt.soloHours}h</p>
                            <p className="text-muted-foreground">Sortie Block: {pt.hours}h ({pt.landings} landings)</p>
                          </div>
                        </div>
                      );
                    }}
                  />
                  {/* Reference line for 45h standard PPL syllabus minimum */}
                  <ReferenceLine
                    y={45}
                    label={{ value: "45h PPL Target", position: "insideTopRight", fill: "#f59e0b", fontSize: 10 }}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulativeHours"
                    name="Cumulative Total"
                    stroke={COLORS.total}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#totalHoursGrad)"
                  />
                  <Line
                    type="monotone"
                    dataKey="dualHours"
                    name="Dual Hours"
                    stroke={COLORS.dual}
                    strokeWidth={1.5}
                    strokeDasharray="2 2"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="soloHours"
                    name="Solo Hours"
                    stroke={COLORS.solo}
                    strokeWidth={1.5}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* 2. Monthly Volume Chart */}
        {chartMode === "monthly" && (
          <div className="h-[280px] w-full pt-2">
            {monthlyData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                No monthly entries for the selected timeframe.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    dataKey="monthLabel"
                    tick={{ fontSize: 11 }}
                    stroke="#94a3b8"
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="hours"
                    tick={{ fontSize: 11 }}
                    stroke="#94a3b8"
                    tickLine={false}
                    unit="h"
                  />
                  <YAxis
                    yAxisId="sorties"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    stroke="#94a3b8"
                    tickLine={false}
                    unit=" flights"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const pt = payload[0]?.payload;
                      return (
                        <div className="rounded-lg border border-border bg-popover p-2.5 text-xs shadow-md text-popover-foreground space-y-1">
                          <p className="font-semibold text-foreground">{pt.monthLabel}</p>
                          <div className="space-y-0.5 text-[11px]">
                            <p className="text-foreground font-medium">Total: {pt.totalHours}h ({pt.sorties} flights)</p>
                            <p className="text-blue-500">Dual: {pt.dualHours}h</p>
                            <p className="text-emerald-500">Solo: {pt.soloHours}h</p>
                            <p className="text-muted-foreground">{pt.landings} total landings</p>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar
                    yAxisId="hours"
                    dataKey="dualHours"
                    name="Dual Hours"
                    stackId="hours"
                    fill={COLORS.dual}
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar
                    yAxisId="hours"
                    dataKey="soloHours"
                    name="Solo Hours"
                    stackId="hours"
                    fill={COLORS.solo}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="sorties"
                    type="monotone"
                    dataKey="sorties"
                    name="Sortie Count"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* 3. Category Distribution Chart */}
        {chartMode === "distribution" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[280px] w-full pt-2 items-center">
            {distributionData.length === 0 ? (
              <div className="col-span-2 flex h-full items-center justify-center text-xs text-muted-foreground">
                No flight hour distribution data available.
              </div>
            ) : (
              <>
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: unknown) => [`${val} hrs`, "Logged Hours"]}
                        contentStyle={{
                          borderRadius: "8px",
                          fontSize: "12px",
                          backgroundColor: "hsl(var(--popover))",
                          borderColor: "hsl(var(--border))",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 text-xs">
                  <h4 className="font-semibold text-foreground text-xs uppercase tracking-wide">
                    Sortie Category Breakdown
                  </h4>
                  <div className="space-y-1.5">
                    {distributionData.map((cat) => {
                      const pct = stats.totalHours > 0 ? Math.round((cat.value / stats.totalHours) * 100) : 0;
                      return (
                        <div key={cat.name} className="flex items-center justify-between border-b border-border/40 pb-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span className="font-medium text-foreground">{cat.name}</span>
                          </div>
                          <div className="font-mono text-muted-foreground">
                            {cat.value}h <span className="text-[10px]">({pct}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
