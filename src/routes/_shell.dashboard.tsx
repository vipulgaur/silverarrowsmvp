import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { format, parseISO, subMonths } from "date-fns";
import {
  Activity,
  Award,
  BarChart3,
  CalendarPlus,
  Clock,
  Filter,
  Gauge,
  Plane,
  Plus,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Chip, NativeSelect, PageHeader, Section, Stat } from "@/components/app-ui";
import { BookingDialog } from "@/components/booking-dialog";
import { FlightDialog } from "@/components/flight-dialog";
import { BookingApprovals } from "@/components/booking-approvals";
import { CumulativeHours } from "@/components/cumulative-hours";
import { FlightPathVisualizer } from "@/components/flight-path-visualizer";
import { WeatherWidget } from "@/components/weather-widget";
import { useMe } from "@/lib/store";
import {
  aircraftUnavailable,
  can,
  cumulativeHours,
  demoHourEntries,
  fmtDec,
  fmtHours,
  hoursToService,
  studentProgress,
  visibleTo,
} from "@/lib/logic";
import { roleLabel } from "@/lib/types";

export const Route = createFileRoute("/_shell/dashboard")({
  head: () => ({
    meta: [
      { title: "Operations dashboard — SilverArrows" },
      {
        name: "description",
        content:
          "Interactive Total Flown Hours & Flight Operations dashboard with live telemetry, rolling FTL windows, syllabus progress, and fleet utilization.",
      },
    ],
  }),
  component: OperationsDashboard,
});

function OperationsDashboard() {
  const { data, me, log } = useMe();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [flightOpen, setFlightOpen] = useState(false);

  // Interactive Dashboard Filters
  const [selectedPilotId, setSelectedPilotId] = useState<string>(
    me.role === "student" ? me.id : "ALL",
  );
  const [includeSynthetic, setIncludeSynthetic] = useState<boolean>(true);
  const [studentChartMetric, setStudentChartMetric] = useState<"hours" | "pct">("hours");
  const [windowFilter, setWindowFilter] = useState<"all" | "short" | "long">("all");

  const activeStudents = useMemo(
    () => data.users.filter((u) => u.role === "student" && u.status !== "deleted"),
    [data.users],
  );
  const selectablePilots = useMemo(
    () =>
      data.users.filter(
        (u) => (u.role === "student" || u.role === "instructor") && u.status !== "deleted",
      ),
    [data.users],
  );

  const focusedPerson = useMemo(() => {
    if (selectedPilotId === "ALL") return me;
    return data.users.find((u) => u.id === selectedPilotId) ?? me;
  }, [data.users, me, selectedPilotId]);

  // Base visible flights combined with optional historical synthetic entries
  const scopedFlights = useMemo(() => {
    const base = visibleTo(me, data.flights);
    const extra = includeSynthetic
      ? selectedPilotId === "ALL"
        ? selectablePilots.flatMap((u) => demoHourEntries(u))
        : demoHourEntries(focusedPerson)
      : [];
    const combined = [...base, ...extra];
    if (selectedPilotId === "ALL") return combined;
    return combined.filter(
      (f) => f.pilotId === selectedPilotId || f.instructorId === selectedPilotId,
    );
  }, [data.flights, focusedPerson, includeSynthetic, me, selectablePilots, selectedPilotId]);

  // Total Flown Hours KPIs
  const totalMinutes = useMemo(
    () => scopedFlights.reduce((sum, f) => sum + f.minutes, 0),
    [scopedFlights],
  );
  const dualMinutes = useMemo(
    () =>
      scopedFlights
        .filter((f) => (f.kind ?? "dual") === "dual")
        .reduce((sum, f) => sum + f.minutes, 0),
    [scopedFlights],
  );
  const soloPicMinutes = useMemo(
    () =>
      scopedFlights
        .filter((f) => f.kind === "solo" || f.kind === "pic")
        .reduce((sum, f) => sum + f.minutes, 0),
    [scopedFlights],
  );
  const simMinutes = useMemo(
    () => scopedFlights.filter((f) => f.kind === "sim").reduce((sum, f) => sum + f.minutes, 0),
    [scopedFlights],
  );

  const availableAircraft = data.aircraft.filter((a) => !aircraftUnavailable(a, data.maintenance));

  // 1. Cumulative Flown Hours Chart Data across rolling windows
  const cumulativeChartData = useMemo(() => {
    const entries = includeSynthetic
      ? [...data.flights, ...demoHourEntries(focusedPerson)]
      : data.flights;
    const rows = cumulativeHours(focusedPerson, entries);
    const filteredRows =
      windowFilter === "short" ? rows.slice(0, 5) : windowFilter === "long" ? rows.slice(4) : rows;
    return filteredRows.map((r) => ({
      window: r.label
        .replace("Last ", "")
        .replace(" days", "d")
        .replace(" months", "m")
        .replace("Current month (MTD)", "MTD")
        .replace("Year to date (YTD)", "YTD"),
      totalHours: Number((r.total / 60).toFixed(1)),
      dualHours: Number((r.dual / 60).toFixed(1)),
      soloPicHours: Number(((r.solo + r.pic) / 60).toFixed(1)),
      simHours: Number((r.sim / 60).toFixed(1)),
      flights: r.flights,
    }));
  }, [data.flights, focusedPerson, includeSynthetic, windowFilter]);

  // 2. Monthly Flown Hours Trend (last 12 months around anchor 2026-10)
  const monthlyTrendData = useMemo(() => {
    const anchor = new Date("2026-10-25T12:00:00Z");
    const buckets: {
      key: string;
      month: string;
      hours: number;
      dual: number;
      soloPic: number;
      sorties: number;
    }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = subMonths(anchor, i);
      buckets.push({
        key: format(d, "yyyy-MM"),
        month: format(d, "MMM yy"),
        hours: 0,
        dual: 0,
        soloPic: 0,
        sorties: 0,
      });
    }
    for (const f of scopedFlights) {
      const ym = f.date.slice(0, 7);
      const b = buckets.find((x) => x.key === ym);
      if (b) {
        const hrs = f.minutes / 60;
        b.hours = Number((b.hours + hrs).toFixed(1));
        if ((f.kind ?? "dual") === "dual") {
          b.dual = Number((b.dual + hrs).toFixed(1));
        } else {
          b.soloPic = Number((b.soloPic + hrs).toFixed(1));
        }
        b.sorties += 1;
      }
    }
    return buckets;
  }, [scopedFlights]);

  // 3. Student Flight Hours & Syllabus Progress Chart Data
  const studentChartData = useMemo(
    () =>
      activeStudents.map((s) => {
        const p = studentProgress(s.id, data);
        const demoMins = includeSynthetic
          ? demoHourEntries(s).reduce((sum, e) => sum + e.minutes, 0)
          : 0;
        return {
          id: s.id,
          name: s.callsign ?? s.name.split(" ")[0],
          fullName: s.name,
          loggedHours: Number((p.minutes / 60).toFixed(1)),
          totalWithDemoHours: Number(((p.minutes + demoMins) / 60).toFixed(1)),
          pct: p.pct,
          completedLessons: p.completed,
          totalLessons: p.total,
        };
      }),
    [activeStudents, data, includeSynthetic],
  );

  // 4. Flight Category Breakdown Donut Data
  const categoryBreakdownData = useMemo(() => {
    const dual = Number((dualMinutes / 60).toFixed(1));
    const solo = Number(
      (
        scopedFlights.filter((f) => f.kind === "solo").reduce((s, f) => s + f.minutes, 0) / 60
      ).toFixed(1),
    );
    const pic = Number(
      (
        scopedFlights.filter((f) => f.kind === "pic").reduce((s, f) => s + f.minutes, 0) / 60
      ).toFixed(1),
    );
    const sim = Number((simMinutes / 60).toFixed(1));
    return [
      { name: "Dual Instruction", value: Math.max(dual, 0.1), color: "var(--primary)" },
      { name: "Solo Consolidation", value: Math.max(solo, 0.1), color: "var(--booking-solo)" },
      { name: "PIC Cross-Country", value: Math.max(pic, 0.1), color: "var(--success)" },
      { name: "FNPT II Simulator", value: Math.max(sim, 0.1), color: "var(--warning)" },
    ];
  }, [dualMinutes, scopedFlights, simMinutes]);

  // 5. Fleet Airframe Utilization & Service Margin Chart Data
  const fleetChartData = useMemo(
    () =>
      data.aircraft.map((a) => {
        const hrsLeft = hoursToService(a, data.maintenance);
        const loggedOnAc =
          data.flights.filter((f) => f.aircraftId === a.id).reduce((sum, f) => sum + f.minutes, 0) /
          60;
        return {
          reg: a.reg,
          type: a.type,
          airframeHours: Number(a.totalHours.toFixed(1)),
          academyLoggedHours: Number(loggedOnAc.toFixed(1)),
          hoursToCheck: hrsLeft !== null ? Math.max(0, Number(hrsLeft.toFixed(1))) : 50,
          status: aircraftUnavailable(a, data.maintenance) ? "Grounded" : "Airworthy",
        };
      }),
    [data.aircraft, data.flights, data.maintenance],
  );

  const tooltipStyle = {
    backgroundColor: "var(--popover)",
    borderColor: "var(--border)",
    borderRadius: "14px",
    color: "var(--popover-foreground)",
    fontSize: "12px",
    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.35)",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Total Flown Hours & Flight Operations Dashboard"
        subtitle={`${me.name} · ${roleLabel[me.role]} · Interactive flight hours telemetry, syllabus velocity & fleet utilization`}
      >
        <Button variant="outline" size="sm" onClick={() => setBookingOpen(true)}>
          <CalendarPlus className="mr-1.5 h-4 w-4" /> New booking
        </Button>
        {can.logFlight(me.role) && (
          <Button size="sm" onClick={() => setFlightOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> Log flight
          </Button>
        )}
      </PageHeader>

      <BookingApprovals />

      <WeatherWidget />

      <FlightPathVisualizer />

      {/* Interactive Telemetry Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/80 p-4 shadow-xs backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary-ink">
              <Filter className="h-4 w-4" />
            </span>
            <span>Telemetry Scope:</span>
          </div>

          {me.role !== "student" && (
            <NativeSelect
              className="w-56"
              value={selectedPilotId}
              onChange={(e) => {
                setSelectedPilotId(e.target.value);
                log(
                  "dashboard_filter_changed",
                  "flight",
                  `Filtered dashboard flown hours to ${e.target.value === "ALL" ? "All Academy Pilots" : (data.users.find((u) => u.id === e.target.value)?.name ?? e.target.value)}`,
                );
              }}
              aria-label="Filter by pilot"
            >
              <option value="ALL">All Academy Pilots ({selectablePilots.length})</option>
              {selectablePilots.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({roleLabel[u.role]})
                </option>
              ))}
            </NativeSelect>
          )}

          <div className="flex items-center gap-1 rounded-full border border-border bg-background/60 p-1">
            {(["all", "short", "long"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setWindowFilter(mode)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  windowFilter === mode
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode === "all"
                  ? "All 9 Windows"
                  : mode === "short"
                    ? "Short-Term (≤90d)"
                    : "Long-Term (6m–All)"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={includeSynthetic ? "default" : "outline"}
            onClick={() => {
              const next = !includeSynthetic;
              setIncludeSynthetic(next);
              log(
                "dashboard_demo_hours_toggled",
                "flight",
                `${next ? "Enabled" : "Disabled"} historical logbook hours in dashboard charts`,
              );
            }}
          >
            <Clock className="mr-1.5 h-3.5 w-3.5" />
            {includeSynthetic
              ? "Total Experience (Logbook + History)"
              : "Stored Academy Sorties Only"}
          </Button>
        </div>
      </div>

      {/* Primary Total Flown Hours KPI Strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total Flown Hours"
          value={`${fmtDec(totalMinutes)} h`}
          hint={`${fmtHours(totalMinutes)} across ${scopedFlights.length} logged sorties`}
        />
        <Stat
          label="Dual Instruction Flown"
          value={`${fmtDec(dualMinutes)} h`}
          hint={`${totalMinutes > 0 ? Math.round((dualMinutes / totalMinutes) * 100) : 0}% of total flight time`}
        />
        <Stat
          label="Solo & PIC Command"
          value={`${fmtDec(soloPicMinutes)} h`}
          hint={`Solo + Pilot-in-Command hours`}
        />
        <Stat
          label="Fleet & SIM Readiness"
          value={`${availableAircraft.length}/${data.aircraft.length} Ready`}
          hint={`${fmtDec(simMinutes)} h logged on FNPT II SIM`}
        />
      </div>

      {/* Row 1: Cumulative Flown Hours Bar Chart & Monthly Flown Hours Trend Area Chart */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          title={`Cumulative Flown Hours by Window — ${focusedPerson.name}`}
          description="Stacked breakdown of Dual, Solo/PIC, and Simulator hours synced with your active theme accent"
          action={
            <Chip tone="ok">
              <BarChart3 className="mr-1 h-3 w-3" /> Live FTL Windows
            </Chip>
          }
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={cumulativeChartData}
                margin={{ top: 8, right: 12, left: -12, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                <XAxis
                  dataKey="window"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={{ stroke: "var(--border)" }}
                  unit="h"
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar
                  dataKey="dualHours"
                  name="Dual (h)"
                  stackId="hours"
                  fill="var(--primary)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="soloPicHours"
                  name="Solo / PIC (h)"
                  stackId="hours"
                  fill="var(--booking-solo)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="simHours"
                  name="Simulator (h)"
                  stackId="hours"
                  fill="var(--success)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section
          title="12-Month Flown Hours & Sortie Velocity"
          description="Monthly progression of total flown hours (Dual vs Solo/PIC) across the last 12 months"
          action={
            <Chip variant="default">
              <Activity className="mr-1 h-3 w-3" /> 12-Month Trend
            </Chip>
          }
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyTrendData}
                margin={{ top: 8, right: 12, left: -12, bottom: 4 }}
              >
                <defs>
                  <linearGradient id="accentHoursGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.65} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="soloHoursGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--booking-solo)" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="var(--booking-solo)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={{ stroke: "var(--border)" }}
                  unit="h"
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Area
                  type="monotone"
                  dataKey="hours"
                  name="Total Flown (h)"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fill="url(#accentHoursGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="soloPic"
                  name="Solo / PIC (h)"
                  stroke="var(--booking-solo)"
                  strokeWidth={2}
                  fill="url(#soloHoursGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>

      {/* Row 2: Student Flight Hours / Syllabus BarChart, Flight Category Donut, Fleet Airframe Utilization */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Section
          title="Student Flown Hours & Syllabus Progress"
          description="Click a student bar to focus the dashboard on their logbook telemetry"
          action={
            <div className="flex items-center gap-1 rounded-full border border-border bg-background/60 p-0.5">
              <button
                type="button"
                onClick={() => setStudentChartMetric("hours")}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition ${
                  studentChartMetric === "hours"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Hours (h)
              </button>
              <button
                type="button"
                onClick={() => setStudentChartMetric("pct")}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition ${
                  studentChartMetric === "pct"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Syllabus %
              </button>
            </div>
          }
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentChartData} margin={{ top: 8, right: 8, left: -16, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={{ stroke: "var(--border)" }}
                  unit={studentChartMetric === "hours" ? "h" : "%"}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar
                  dataKey={studentChartMetric === "hours" ? "loggedHours" : "pct"}
                  name={
                    studentChartMetric === "hours"
                      ? "Academy Logged Hours"
                      : "Syllabus Completion %"
                  }
                  fill="var(--primary)"
                  radius={[8, 8, 0, 0]}
                  className="cursor-pointer"
                  onClick={(entry) => {
                    if (entry?.id && me.role !== "student") {
                      setSelectedPilotId(String(entry.id));
                    }
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section
          title="Flight Category Distribution"
          description="Proportion of Dual, Solo, PIC, and Simulator hours"
          action={
            <Chip variant="default">
              <Award className="mr-1 h-3 w-3" /> By Sortie Type
            </Chip>
          }
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdownData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="46%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {categoryBreakdownData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} stroke="var(--card)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section
          title="Fleet Airframe Hours & Service Margin"
          description="Total airframe hours and remaining hours before next scheduled check"
          action={
            <Link to="/fleet" className="text-xs font-medium text-primary-ink hover:underline">
              <Plane className="mr-1 inline h-3.5 w-3.5" /> Fleet hub →
            </Link>
          }
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fleetChartData} margin={{ top: 8, right: 8, left: -12, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                <XAxis
                  dataKey="reg"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={{ stroke: "var(--border)" }}
                  unit="h"
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar
                  dataKey="airframeHours"
                  name="Total Airframe (h)"
                  fill="var(--primary)"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="hoursToCheck"
                  name="Hours to Service (h)"
                  fill="var(--success)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>

      {/* Interactive Cumulative Flight Hours Table for Focused Person */}
      <CumulativeHours person={focusedPerson} />

      {/* Admin-Only Operational Audit Trail */}
      {me.role === "admin" && (
        <Section
          title="Recent Academy Activity Log (Admin Only)"
          description="Immutable regulatory audit trail of bookings, logbook updates, course assignments, and approvals"
          action={
            <Link
              to="/admin/audit"
              className="text-xs font-medium text-primary-ink hover:underline"
            >
              <Gauge className="mr-1 inline h-3.5 w-3.5" /> Full audit log →
            </Link>
          }
        >
          <ul className="divide-y">
            {data.activity.slice(0, 8).map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-3 py-2.5 text-xs">
                <div className="flex items-start gap-3">
                  <span className="num w-28 shrink-0 font-medium text-muted-foreground">
                    {format(parseISO(a.at), "dd MMM HH:mm")}
                  </span>
                  <div>
                    <span className="font-semibold text-foreground">{a.actorName}</span>{" "}
                    <span className="text-muted-foreground">({roleLabel[a.actorRole]})</span> —{" "}
                    <span>{a.details}</span>
                  </div>
                </div>
                <Chip variant="default">{a.entityType}</Chip>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
      <FlightDialog open={flightOpen} onOpenChange={setFlightOpen} />
    </div>
  );
}
