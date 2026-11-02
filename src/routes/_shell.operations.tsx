import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Activity,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Compass,
  Gauge,
  Play,
  PlaneLanding,
  PlaneTakeoff,
  Radio,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Wind,
} from "lucide-react";
import { Badge, Card, NativeSelect, PageHeader } from "@/components/app-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  calculateRunwayPerformance,
  calculateWeightAndBalance,
  easaRollingFtlStatus,
  endorseSoloFlight,
  evaluateDispatchGates,
  overrideBookingConflict,
  processAdsbTelemetryUpdate,
  transitionFlightFsm,
} from "@/lib/logic";
import { DEFAULT_AERODROMES, DEFAULT_AIRCRAFT_MODELS } from "@/lib/rea-seed";
import { useStore } from "@/lib/store";
import type { Booking, FlightFsmState } from "@/lib/types";

export const Route = createFileRoute("/_shell/operations")({
  component: OperationsCenterPage,
});

const FSM_STAGES: FlightFsmState[] = [
  "scheduled",
  "briefing",
  "flight",
  "landed",
  "debriefing",
  "completed",
];

const FSM_BADGE_TONE: Record<FlightFsmState, "neutral" | "info" | "warn" | "ok" | "bad"> = {
  scheduled: "neutral",
  briefing: "info",
  flight: "warn",
  landed: "info",
  debriefing: "warn",
  completed: "ok",
  cancelled: "bad",
};

function OperationsCenterPage() {
  const { data, me, update, log } = useStore();
  const [activeTab, setActiveTab] = useState<
    "wallboard" | "gantt" | "conflicts" | "wb"
  >("wallboard");

  // Aerodrome & Runway state
  const aerodromes = data.aerodromes ?? DEFAULT_AERODROMES;
  const [selectedIcao, setSelectedIcao] = useState(aerodromes[0]?.icao ?? "VIDP");
  const currentAerodrome =
    aerodromes.find((a) => a.icao === selectedIcao) ?? aerodromes[0]!;

  // Override reason state
  const [overrideReasons, setOverrideReasons] = useState<Record<string, string>>({});

  // Solo endorsement form state
  const students = data.users.filter((u) => u.role === "student" && u.status !== "deleted");
  const models = data.aircraftModels ?? DEFAULT_AIRCRAFT_MODELS;
  const [soloStudentId, setSoloStudentId] = useState(students[0]?.id ?? "");
  const [soloModelId, setSoloModelId] = useState(models[0]?.id ?? "mdl-c172s");
  const [soloMaxXwind, setSoloMaxXwind] = useState(10);

  // Weight & Balance state
  const [wbModelId, setWbModelId] = useState(models[0]?.id ?? "mdl-c172s");
  const [frontSeatsKg, setFrontSeatsKg] = useState(155);
  const [rearSeatsKg, setRearSeatsKg] = useState(0);
  const [baggageKg, setBaggageKg] = useState(18);
  const [takeoffFuelLiters, setTakeoffFuelLiters] = useState(140);
  const [tripFuelBurnLiters, setTripFuelBurnLiters] = useState(50);
  const [qnhHpa, setQnhHpa] = useState(1011);
  const [oatC, setOatC] = useState(28);
  const [windDirDeg, setWindDirDeg] = useState(295);
  const [windSpeedKt, setWindSpeedKt] = useState(12);

  const selectedModel =
    models.find((m) => m.id === wbModelId) ?? models[0]!;

  const wbResult = useMemo(
    () =>
      calculateWeightAndBalance({
        model: selectedModel,
        frontSeatsKg,
        rearSeatsKg,
        baggageKg,
        takeoffFuelLiters,
        tripFuelBurnLiters,
      }),
    [
      selectedModel,
      frontSeatsKg,
      rearSeatsKg,
      baggageKg,
      takeoffFuelLiters,
      tripFuelBurnLiters,
    ],
  );

  const activeRunwayObj =
    currentAerodrome.runways.find(
      (r) => r.designator === currentAerodrome.activeRunway,
    ) ?? currentAerodrome.runways[0]!;

  const perfResult = useMemo(
    () =>
      calculateRunwayPerformance({
        elevationFt: currentAerodrome.elevationFt,
        qnhHpa,
        oatC,
        runwayHeadingDeg: activeRunwayObj.headingDeg,
        windDirDeg,
        windSpeedKt,
        model: selectedModel,
      }),
    [
      currentAerodrome.elevationFt,
      qnhHpa,
      oatC,
      activeRunwayObj.headingDeg,
      windDirDeg,
      windSpeedKt,
      selectedModel,
    ],
  );

  // Evaluate 7-point dispatch gates across all active bookings
  const bookingsWithGates = useMemo(() => {
    return data.bookings
      .filter((b) => b.status !== "cancelled")
      .map((b) => ({
        booking: b,
        gates: evaluateDispatchGates(b, data),
      }));
  }, [data]);

  const totalBlockingConflicts = bookingsWithGates.reduce(
    (s, item) => s + item.gates.blockingConflicts.length,
    0,
  );

  if (!me) return null;

  const handleSetActiveRunway = (rwy: string) => {
    update((d) => ({
      ...d,
      aerodromes: (d.aerodromes ?? DEFAULT_AERODROMES).map((a) =>
        a.icao === currentAerodrome.icao ? { ...a, activeRunway: rwy } : a,
      ),
    }));
    log(
      "set_runway_in_use",
      "booking",
      `Set active runway at ${currentAerodrome.icao} to RWY ${rwy}`,
    );
    toast.success(`${currentAerodrome.icao} Active Runway set to RWY ${rwy}`);
  };

  const handleFsmStep = (booking: Booking, nextState: FlightFsmState) => {
    const res = transitionFlightFsm(data, booking.id, nextState, me);
    if (typeof res === "string") {
      toast.error(res);
      return;
    }
    update(() => res);
    toast.success(
      `Flight ${booking.id} transitioned to ${nextState.toUpperCase()}`,
    );
  };

  const handleSimulateAdsbLanding = (aircraftId?: string) => {
    const ac = data.aircraft.find((a) => a.id === aircraftId);
    if (!ac) return;
    const { data: nextData, autoLandedBookingId } = processAdsbTelemetryUpdate(
      data,
      ac.reg,
      24, // < 30 knots touchdown threshold
      true,
    );
    if (autoLandedBookingId) {
      update(() => nextData);
      toast.success(
        `ADS-B Telemetry [<30 kt at ${currentAerodrome.icao}]: Auto-transitioned ${ac.reg} (${autoLandedBookingId}) to LANDED!`,
      );
    } else {
      toast.info(`${ac.reg} is not currently in 'flight' (airborne) state.`);
    }
  };

  const ganttHours = Array.from({ length: 14 }, (_, i) => i + 7); // 07:00 to 20:00

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations Dispatch, Gantt Timeline & 6-Stage Flight FSM"
        subtitle="FlightLogger REA Operations Center: Live Departure/Arrival Wallboard, Multi-Resource Gantt Scheduler, 7-Point Dispatch Gating & Weight/Balance Envelope"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: "wallboard", label: "Dep/Arr Wallboard & 6-Stage FSM", icon: Radio },
                { id: "gantt", label: "Resource Gantt Timeline", icon: CalendarClock },
                {
                  id: "conflicts",
                  label: `7-Gate Conflict Center (${totalBlockingConflicts})`,
                  icon: ShieldAlert,
                },
                { id: "wb", label: "Weight & Balance + Runway Perf", icon: Scale },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  size="sm"
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id)}
                  data-testid={`ops-tab-${tab.id}`}
                >
                  <Icon className="mr-1.5 h-3.5 w-3.5" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        }
      />

      {/* =====================================================================
          TAB 1: LIVE AIRFIELD DEPARTURE / ARRIVAL WALLBOARD & 6-STAGE FSM
          ===================================================================== */}
      {activeTab === "wallboard" && (
        <div className="space-y-5">
          {/* Top Aerodrome Telemetry & Active Runway Selector Bar */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5 text-slate-100 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400 ring-1 ring-sky-500/40">
                  <Radio className="h-5 w-5 animate-pulse" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-sky-400">
                      LIVE FBO DISPATCH WALLBOARD
                    </span>
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                      ADS-B BRIDGE ONLINE
                    </span>
                  </div>
                  <h2 className="text-lg font-extrabold tracking-tight text-white">
                    {currentAerodrome.icao} — {currentAerodrome.name}
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5">
                  <span className="text-xs text-slate-400">Aerodrome:</span>
                  <select
                    value={selectedIcao}
                    onChange={(e) => setSelectedIcao(e.target.value)}
                    className="bg-transparent font-mono text-xs font-bold text-white focus:outline-none"
                  >
                    {aerodromes.map((a) => (
                      <option key={a.icao} value={a.icao} className="bg-slate-900">
                        {a.icao} ({a.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5">
                  <Compass className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-300">
                    Active RWY:
                  </span>
                  {currentAerodrome.runways.map((rwy) => (
                    <button
                      key={rwy.designator}
                      type="button"
                      onClick={() => handleSetActiveRunway(rwy.designator)}
                      className={`rounded-lg px-2 py-0.5 font-mono text-xs font-bold transition cursor-pointer ${
                        currentAerodrome.activeRunway === rwy.designator
                          ? "bg-amber-500 text-slate-950 shadow-xs"
                          : "text-amber-200 hover:bg-amber-500/20"
                      }`}
                    >
                      {rwy.designator}
                    </button>
                  ))}
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 font-mono text-xs text-slate-300">
                  TWR {currentAerodrome.towerFreqMhz} · ATIS {currentAerodrome.atisFreqMhz} · ELEV{" "}
                  {currentAerodrome.elevationFt} FT
                </div>
              </div>
            </div>

            {/* 6-Stage Flight Lifecycle Finite State Machine Legend */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-semibold text-slate-200">
                  6-Stage Flight Lifecycle FSM:
                </span>
                {FSM_STAGES.map((stage, idx) => (
                  <span key={stage} className="inline-flex items-center gap-1.5">
                    <span className="rounded-md border border-slate-700 bg-slate-900 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-sky-300">
                      {idx + 1}. {stage}
                    </span>
                    {idx < FSM_STAGES.length - 1 && <span>→</span>}
                  </span>
                ))}
              </div>
              <span className="font-mono text-[11px] text-emerald-400">
                Airborne Cancellation Guard: ACTIVE
              </span>
            </div>

            {/* Live Flight Operations Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 font-mono text-[11px] uppercase text-slate-400">
                    <th className="py-2.5 pr-3">Slot / Callsign</th>
                    <th className="py-2.5 px-3">Aircraft Tail</th>
                    <th className="py-2.5 px-3">Pilot / Student</th>
                    <th className="py-2.5 px-3">Instructor</th>
                    <th className="py-2.5 px-3">Sector / Lesson</th>
                    <th className="py-2.5 px-3">7-Gate Status</th>
                    <th className="py-2.5 px-3">Current FSM Stage</th>
                    <th className="py-2.5 pl-3 text-right">
                      Advance 6-Stage FSM / ADS-B Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {bookingsWithGates.slice(0, 12).map(({ booking, gates }) => {
                    const ac = data.aircraft.find((a) => a.id === booking.aircraftId);
                    const student = data.users.find((u) => u.id === booking.studentId);
                    const cfi = data.users.find((u) => u.id === booking.instructorId);
                    const stageIdx = FSM_STAGES.indexOf(booking.status);
                    const nextStage =
                      stageIdx >= 0 && stageIdx < FSM_STAGES.length - 1
                        ? FSM_STAGES[stageIdx + 1]
                        : undefined;

                    return (
                      <tr key={booking.id} className="hover:bg-slate-900/70">
                        <td className="py-3 pr-3 font-mono">
                          <div className="font-bold text-white">{booking.id}</div>
                          <div className="text-[11px] text-slate-400">
                            {booking.start.slice(11, 16)}–{booking.end.slice(11, 16)} UTC
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="rounded-lg bg-slate-800 px-2.5 py-1 font-mono font-bold text-amber-300">
                            {ac?.reg ?? "TBA"}
                          </span>
                          <div className="mt-0.5 text-[10px] text-slate-400">
                            {ac?.type}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-200">
                          {student?.name ?? "Maintenance / Solo"}
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          {cfi?.name ?? "Solo / Self-Pilot"}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-300">
                          {booking.departureIcao ?? currentAerodrome.icao} →{" "}
                          {booking.arrivalIcao ?? currentAerodrome.icao}
                          {booking.lessonId ? ` · ${booking.lessonId.toUpperCase()}` : ""}
                        </td>
                        <td className="py-3 px-3">
                          {gates.passed ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" /> 7/7 GATES OK
                            </span>
                          ) : (
                            <span
                              title={gates.blockingConflicts.map((c) => c.message).join("\n")}
                              className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2.5 py-0.5 text-[11px] font-bold text-red-400"
                            >
                              <AlertTriangle className="h-3 w-3" />{" "}
                              {gates.blockingConflicts.length} GATE BLOCK
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <Badge tone={FSM_BADGE_TONE[booking.status]}>
                            {booking.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-3 pl-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {nextStage && (
                              <Button
                                size="sm"
                                className="h-7 px-2.5 text-[11px] font-bold"
                                onClick={() => handleFsmStep(booking, nextStage)}
                                data-testid={`fsm-advance-${booking.id}`}
                              >
                                <Play className="mr-1 h-3 w-3" /> →{" "}
                                {nextStage.toUpperCase()}
                              </Button>
                            )}
                            {booking.status === "flight" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-[11px] border-sky-500/50 text-sky-300 hover:bg-sky-500/20"
                                onClick={() =>
                                  handleSimulateAdsbLanding(booking.aircraftId)
                                }
                              >
                                <PlaneLanding className="mr-1 h-3 w-3" /> ADS-B &lt;30kt
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: HORIZONTAL MULTI-RESOURCE GANTT TIMELINE SCHEDULER
          ===================================================================== */}
      {activeTab === "gantt" && (
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold">
                Multi-Resource Horizontal Gantt Timeline (/a/:tenant/bookings)
              </h2>
              <p className="text-xs text-muted-foreground">
                Sticky resource rows (Aircraft, Simulators, Flight Instructors, Classrooms) across 15-minute operational blocks with conflict &amp;FSM status badges.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-sky-500" /> Dual Lesson
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-emerald-500" /> Solo / PIC
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-amber-500" /> Briefing / Airborne
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-red-500" /> Gate Conflict
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <div className="min-w-[980px]">
              {/* Header row with hours */}
              <div className="grid grid-cols-[200px_repeat(14,1fr)] border-b border-border bg-muted/60 font-mono text-[11px] font-bold text-muted-foreground">
                <div className="p-2.5 border-r border-border">RESOURCE / TAIL / CREW</div>
                {ganttHours.map((h) => (
                  <div
                    key={h}
                    className="p-2 text-center border-r border-border/50 last:border-r-0"
                  >
                    {String(h).padStart(2, "0")}:00
                  </div>
                ))}
              </div>

              {/* Group 1: Fleet Aircraft & FNPT Simulators */}
              <div className="bg-primary/5 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary border-b border-border">
                Fleet Aircraft &amp; FNPT II Simulators ({data.aircraft.length})
              </div>
              {data.aircraft.map((ac) => {
                const acBookings = bookingsWithGates.filter(
                  (x) => x.booking.aircraftId === ac.id,
                );
                return (
                  <div
                    key={ac.id}
                    className="grid grid-cols-[200px_1fr] border-b border-border/70 items-center hover:bg-muted/20"
                  >
                    <div className="p-2.5 border-r border-border flex items-center justify-between gap-2">
                      <div>
                        <div className="font-mono text-xs font-bold text-foreground">
                          {ac.reg}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                          {ac.type}
                        </div>
                      </div>
                      <Badge tone={ac.grounded ? "bad" : "ok"}>
                        {ac.grounded ? "AOG" : `${ac.tachHours}h`}
                      </Badge>
                    </div>
                    <div className="relative h-12 bg-background/50">
                      {acBookings.slice(0, 4).map(({ booking, gates }, idx) => {
                        const rawHour = Number(booking.start.slice(11, 13)) || 8 + idx * 3;
                        const clampedStart = Math.max(7, Math.min(19, rawHour));
                        const leftPct = ((clampedStart - 7) / 14) * 100;
                        const widthPct = Math.max(10, (2 / 14) * 100);
                        const student = data.users.find(
                          (u) => u.id === booking.studentId,
                        );
                        const hasConflict = !gates.passed;
                        return (
                          <div
                            key={booking.id}
                            style={{
                              left: `${leftPct}%`,
                              width: `${widthPct}%`,
                            }}
                            title={`${booking.id} · ${student?.name ?? "Slot"} · Status: ${booking.status}`}
                            className={`absolute top-1.5 bottom-1.5 rounded-lg px-2 py-1 text-[10px] font-bold text-white shadow-xs overflow-hidden truncate flex items-center justify-between ${
                              hasConflict
                                ? "bg-red-600 ring-2 ring-red-300"
                                : booking.status === "flight" ||
                                    booking.status === "briefing"
                                  ? "bg-amber-600"
                                  : booking.type === "solo"
                                    ? "bg-emerald-600"
                                    : "bg-sky-600"
                            }`}
                          >
                            <span className="truncate">
                              {student?.name?.split(" ")[0] ?? booking.type} ·{" "}
                              {booking.status.toUpperCase()}
                            </span>
                            {hasConflict && <AlertTriangle className="h-3 w-3 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Group 2: Flight Instructors (CFI) with EASA FTL Rolling Status */}
              <div className="bg-primary/5 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary border-b border-border">
                Flight Instructors &amp; EASA Part-FTL Availability
              </div>
              {data.users
                .filter((u) => u.role === "instructor" && u.status !== "deleted")
                .map((cfi) => {
                  const ftl = easaRollingFtlStatus(cfi.id, data);
                  const cfiBookings = bookingsWithGates.filter(
                    (x) => x.booking.instructorId === cfi.id,
                  );
                  return (
                    <div
                      key={cfi.id}
                      className="grid grid-cols-[200px_1fr] border-b border-border/70 items-center hover:bg-muted/20"
                    >
                      <div className="p-2.5 border-r border-border flex items-center justify-between gap-2">
                        <div>
                          <div className="text-xs font-bold text-foreground">
                            {cfi.name}
                          </div>
                          <div className="font-mono text-[10px] text-muted-foreground">
                            7d: {ftl.duty7DaysHours}h/60h · 28d: {ftl.flight28DaysHours}h
                          </div>
                        </div>
                        <Badge tone={ftl.anyCeilingExceeded || ftl.restLocked ? "bad" : "ok"}>
                          {ftl.restLocked ? "REST" : "FTL OK"}
                        </Badge>
                      </div>
                      <div className="relative h-12 bg-emerald-500/5">
                        {cfiBookings.slice(0, 4).map(({ booking }, idx) => {
                          const rawHour =
                            Number(booking.start.slice(11, 13)) || 9 + idx * 3;
                          const clampedStart = Math.max(7, Math.min(19, rawHour));
                          const leftPct = ((clampedStart - 7) / 14) * 100;
                          const widthPct = Math.max(10, (2 / 14) * 100);
                          const student = data.users.find(
                            (u) => u.id === booking.studentId,
                          );
                          return (
                            <div
                              key={booking.id}
                              style={{
                                left: `${leftPct}%`,
                                width: `${widthPct}%`,
                              }}
                              className="absolute top-1.5 bottom-1.5 rounded-lg bg-indigo-600 px-2 py-1 text-[10px] font-bold text-white shadow-xs truncate flex items-center"
                            >
                              {student?.name?.split(" ")[0] ?? "Dual"} ({booking.id})
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </Card>
      )}

      {/* =====================================================================
          TAB 3: 7-POINT PRE-FLIGHT DISPATCH GATING & CONFLICT CENTER
          ===================================================================== */}
      {activeTab === "conflicts" && (
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold">
                  7-Point Pre-Flight Dispatch Conflict Resolution Center
                </h2>
                <p className="text-xs text-muted-foreground">
                  Automated checks for Medical/Licences (Gate 1), 90-Day Currency (Gate 2), Class Rating (Gate 3), Maintenance Overrun (Gate 4), EASA FTL 12h Rest (Gate 5), Rolling 7/28/365d FTL (Gate 6), and 24h Solo Endorsement (Gate 7).
                </p>
              </div>
              <Badge tone={totalBlockingConflicts > 0 ? "bad" : "ok"}>
                {totalBlockingConflicts} Active Blocks
              </Badge>
            </div>

            <div className="space-y-3">
              {bookingsWithGates.map(({ booking, gates }) => {
                const allIssues = [...gates.blockingConflicts, ...gates.warnings];
                if (allIssues.length === 0) return null;
                const student = data.users.find((u) => u.id === booking.studentId);
                const ac = data.aircraft.find((a) => a.id === booking.aircraftId);

                return (
                  <div
                    key={booking.id}
                    className="rounded-2xl border border-border bg-card/70 p-4 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary">
                          {booking.id}
                        </span>
                        <span className="text-xs font-semibold">
                          {student?.name ?? "Crew"} · {ac?.reg ?? "Aircraft"}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          ({booking.start.slice(0, 16).replace("T", " ")})
                        </span>
                      </div>
                      <Badge tone={gates.passed ? "ok" : "bad"}>
                        {gates.passed ? "OVERRIDDEN / CLEARED" : "DISPATCH BLOCKED"}
                      </Badge>
                    </div>

                    {allIssues.map((conf) => (
                      <div
                        key={conf.id}
                        className={`rounded-xl border p-3 text-xs space-y-2 ${
                          conf.overriddenBy
                            ? "border-emerald-500/30 bg-emerald-500/5"
                            : "border-red-500/40 bg-red-500/5"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-medium text-foreground">
                            {conf.message}
                          </div>
                          <Badge tone={conf.overriddenBy ? "ok" : "bad"}>
                            Gate #{conf.gateNumber}
                          </Badge>
                        </div>

                        {conf.overriddenBy ? (
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                            ✓ Overridden by Accountable Manager ({conf.overriddenBy}): &ldquo;
                            {conf.overrideReason}&rdquo;
                          </div>
                        ) : (
                          (me.role === "admin" || me.role === "staff") && (
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <Input
                                placeholder="Mandatory regulatory override justification..."
                                value={overrideReasons[conf.id] ?? ""}
                                onChange={(e) =>
                                  setOverrideReasons((prev) => ({
                                    ...prev,
                                    [conf.id]: e.target.value,
                                  }))
                                }
                                className="h-8 flex-1 text-xs"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs font-bold"
                                onClick={() => {
                                  const res = overrideBookingConflict(
                                    data,
                                    conf,
                                    me,
                                    overrideReasons[conf.id] ?? "",
                                  );
                                  if (typeof res === "string") {
                                    toast.error(res);
                                    return;
                                  }
                                  update(() => res);
                                  log(
                                    "override_booking_conflict",
                                    "booking",
                                    `Overrode Gate ${conf.gateNumber} (${conf.conflictType}) on ${booking.id}: ${overrideReasons[conf.id]}`,
                                    booking.id,
                                  );
                                  toast.success(
                                    `Gate #${conf.gateNumber} conflict overridden with audit log.`,
                                  );
                                }}
                              >
                                Override Conflict
                              </Button>
                            </div>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Gate 7: Digital 24-Hour Solo Endorsement Sign-Off Card */}
          <Card className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <h3 className="text-sm font-bold">
                  Gate 7 — 24h Solo Endorsement Sign-Off
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Digital instructor authorization required prior to student solo dispatch.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <Label className="text-xs">Student Pilot</Label>
                <NativeSelect
                  value={soloStudentId}
                  onChange={(e) => setSoloStudentId(e.target.value)}
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.splNumber ?? "SPL On File"})
                    </option>
                  ))}
                </NativeSelect>
              </div>

              <div>
                <Label className="text-xs">Aircraft Model Class</Label>
                <NativeSelect
                  value={soloModelId}
                  onChange={(e) => setSoloModelId(e.target.value)}
                >
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.make} {m.modelName} ({m.classRating})
                    </option>
                  ))}
                </NativeSelect>
              </div>

              <div>
                <Label className="text-xs">Max Permitted Crosswind (kt)</Label>
                <Input
                  type="number"
                  min={5}
                  max={25}
                  value={soloMaxXwind}
                  onChange={(e) => setSoloMaxXwind(Number(e.target.value))}
                />
              </div>

              <Button
                className="w-full"
                size="sm"
                onClick={() => {
                  const res = endorseSoloFlight(data, me, {
                    studentId: soloStudentId,
                    aircraftModelId: soloModelId,
                    aerodromeIcao: currentAerodrome.icao,
                    maxCrosswindKt: soloMaxXwind,
                    maxWindKt: 18,
                    minVisibilityMeters: 5000,
                    notes: `Cleared for solo circuits at ${currentAerodrome.icao} RWY ${currentAerodrome.activeRunway}`,
                  });
                  if (typeof res === "string") {
                    toast.error(res);
                    return;
                  }
                  update(() => res);
                  log(
                    "solo_endorsement_signed",
                    "user",
                    `Signed 24h Solo Endorsement for student ${soloStudentId} on ${soloModelId}`,
                    soloStudentId,
                  );
                  toast.success("24-Hour Digital Solo Endorsement issued & sealed!");
                }}
              >
                Sign &amp; Seal 24h Solo Endorsement
              </Button>
            </div>

            <div className="border-t border-border pt-3 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Active Solo Endorsements ({(data.soloEndorsements ?? []).length})
              </div>
              {(data.soloEndorsements ?? []).slice(0, 4).map((se) => {
                const st = data.users.find((u) => u.id === se.studentId);
                return (
                  <div
                    key={se.id}
                    className="rounded-xl border border-border bg-muted/40 p-2.5 text-[11px]"
                  >
                    <div className="font-bold text-foreground">
                      {st?.name ?? se.studentId} · {se.aerodromeIcao}
                    </div>
                    <div className="text-muted-foreground">
                      Max X-Wind: {se.maxCrosswindKt} kt · Expires:{" "}
                      {se.expiresAt.slice(0, 16).replace("T", " ")}
                    </div>
                    <div className="font-mono text-[10px] text-primary truncate">
                      {se.signatureHash}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* =====================================================================
          TAB 4: INTERACTIVE WEIGHT & BALANCE + RUNWAY PERFORMANCE CALCULATOR
          ===================================================================== */}
      {activeTab === "wb" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold">
                  Mass &amp; Balance CG Envelope Calculator
                </h2>
                <p className="text-xs text-muted-foreground">
                  Computes Zero-Fuel Weight (ZFW), Takeoff Weight (TOW) &amp; Landing Weight (LDW) against structural CG limits.
                </p>
              </div>
              <Badge tone={wbResult.safeToDispatch ? "ok" : "bad"}>
                {wbResult.safeToDispatch ? "WITHIN CG ENVELOPE" : "OUT OF LIMITS — NO GO"}
              </Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="sm:col-span-2">
                <Label className="text-xs">Aircraft Model Specification</Label>
                <NativeSelect
                  value={wbModelId}
                  onChange={(e) => setWbModelId(e.target.value)}
                >
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.make} {m.modelName} (MTOW {m.maxTakeoffWeightKg} kg)
                    </option>
                  ))}
                </NativeSelect>
              </div>

              <div>
                <Label className="text-xs">Pilot + Front Seat (kg)</Label>
                <Input
                  type="number"
                  value={frontSeatsKg}
                  onChange={(e) => setFrontSeatsKg(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Rear Passengers (kg)</Label>
                <Input
                  type="number"
                  value={rearSeatsKg}
                  onChange={(e) => setRearSeatsKg(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Baggage Compartment (kg)</Label>
                <Input
                  type="number"
                  value={baggageKg}
                  onChange={(e) => setBaggageKg(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">
                  Takeoff Usable Fuel (L, max {selectedModel.usableFuelLiters}L)
                </Label>
                <Input
                  type="number"
                  value={takeoffFuelLiters}
                  onChange={(e) => setTakeoffFuelLiters(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Computed Weight & CG Table */}
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 font-mono text-[11px] uppercase text-muted-foreground">
                  <tr>
                    <th className="p-2.5">Condition</th>
                    <th className="p-2.5">Weight (kg)</th>
                    <th className="p-2.5">Max Limit (kg)</th>
                    <th className="p-2.5">CG Arm (mm)</th>
                    <th className="p-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-mono">
                  <tr>
                    <td className="p-2.5 font-sans font-semibold">Zero-Fuel (ZFW)</td>
                    <td className="p-2.5">{wbResult.zeroFuelWeightKg} kg</td>
                    <td className="p-2.5">{selectedModel.maxLandingWeightKg} kg</td>
                    <td className="p-2.5">{wbResult.zeroFuelCgMm} mm</td>
                    <td className="p-2.5 text-right text-emerald-500 font-bold">OK</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-semibold">Takeoff (TOW)</td>
                    <td className="p-2.5 font-bold">{wbResult.takeoffWeightKg} kg</td>
                    <td className="p-2.5">{selectedModel.maxTakeoffWeightKg} kg</td>
                    <td className="p-2.5">{wbResult.takeoffCgMm} mm</td>
                    <td className="p-2.5 text-right">
                      <Badge tone={wbResult.safeToDispatch ? "ok" : "bad"}>
                        {wbResult.safeToDispatch ? "SAFE" : "EXCEEDED"}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-semibold">Landing (LDW)</td>
                    <td className="p-2.5">{wbResult.landingWeightKg} kg</td>
                    <td className="p-2.5">{selectedModel.maxLandingWeightKg} kg</td>
                    <td className="p-2.5">{wbResult.landingCgMm} mm</td>
                    <td className="p-2.5 text-right text-emerald-500 font-bold">OK</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* Density Altitude, Crosswind & Factored Runway Distance Calculator */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold">
                  Density Altitude &amp; Runway Performance ({currentAerodrome.icao} RWY{" "}
                  {activeRunwayObj.designator})
                </h2>
                <p className="text-xs text-muted-foreground">
                  Available Runway Length: {activeRunwayObj.lengthMeters} m · Heading{" "}
                  {activeRunwayObj.headingDeg}°
                </p>
              </div>
              <Badge tone={perfResult.exceedsMaxCrosswind ? "bad" : "ok"}>
                {perfResult.exceedsMaxCrosswind
                  ? "MAX CROSSWIND EXCEEDED"
                  : "X-WIND WITHIN LIMITS"}
              </Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div>
                <Label className="text-xs">Altimeter QNH (hPa)</Label>
                <Input
                  type="number"
                  value={qnhHpa}
                  onChange={(e) => setQnhHpa(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Outside Air Temp OAT (°C)</Label>
                <Input
                  type="number"
                  value={oatC}
                  onChange={(e) => setOatC(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Surface Wind Direction (°M)</Label>
                <Input
                  type="number"
                  value={windDirDeg}
                  onChange={(e) => setWindDirDeg(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Surface Wind Speed (kt)</Label>
                <Input
                  type="number"
                  value={windSpeedKt}
                  onChange={(e) => setWindSpeedKt(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-border bg-muted/40 p-3">
                <div className="text-[10px] font-bold uppercase text-muted-foreground">
                  Pressure Alt
                </div>
                <div className="mt-1 font-mono text-base font-extrabold">
                  {perfResult.pressureAltitudeFt} ft
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-3">
                <div className="text-[10px] font-bold uppercase text-muted-foreground">
                  Density Alt
                </div>
                <div className="mt-1 font-mono text-base font-extrabold text-amber-500">
                  {perfResult.densityAltitudeFt} ft
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-3">
                <div className="text-[10px] font-bold uppercase text-muted-foreground">
                  Headwind / X-Wind
                </div>
                <div className="mt-1 font-mono text-sm font-extrabold">
                  {perfResult.headwindKt} / {perfResult.crosswindKt} kt
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-3">
                <div className="text-[10px] font-bold uppercase text-muted-foreground">
                  Factored TODR / LDR
                </div>
                <div className="mt-1 font-mono text-sm font-extrabold text-emerald-500">
                  {perfResult.todrMeters}m / {perfResult.ldrMeters}m
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
