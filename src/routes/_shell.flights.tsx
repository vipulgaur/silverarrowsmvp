import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  Lock,
  Pencil,
  PlaneTakeoff,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Chip, Empty, NativeSelect, PageHeader, Section, Stat } from "@/components/app-ui";
import { FlightDialog } from "@/components/flight-dialog";
import { CumulativeHours } from "@/components/cumulative-hours";
import { FlightProgressTracker } from "@/components/flight-progress-tracker";
import { FlightPathVisualizer } from "@/components/flight-path-visualizer";
import { WeatherWidget } from "@/components/weather-widget";
import { extractFlightWeather } from "@/lib/weather";
import {
  getPostFlightDueBookings,
  PostFlightCompletionDialog,
  type PostFlightDialogState,
} from "@/components/post-flight-prompt";
import { useLookup, useMe } from "@/lib/store";
import {
  blockMinutes,
  can,
  flightTimeParts,
  fmtDec,
  fmtHours,
  isFlightVerified,
  verifyFlightLog,
  visibleTo,
} from "@/lib/logic";
import type { Booking, Flight } from "@/lib/types";

export const Route = createFileRoute("/_shell/flights")({
  head: () => ({
    meta: [
      { title: "Flight logbook — SilverArrows" },
      {
        name: "description",
        content:
          "Electronic flight logbook: dual, solo, PIC and simulator sorties with day/night/XC/instrument/multi-engine breakdown, instructor verification and CSV export.",
      },
    ],
  }),
  component: FlightsPage,
});

/**
 * 🛬 DEDICATED ADMIN SECTION: DID THE FLIGHT HAPPEN?
 * Post-Flight Verification & Automated Student Logbook Synchronization
 */
export function AdminPostFlightSection() {
  const { data } = useMe();
  const lk = useLookup();
  const [dialogState, setDialogState] = useState<PostFlightDialogState | null>(null);
  const [tab, setTab] = useState<"due" | "upcoming" | "completed">("due");
  const [searchQuery, setSearchQuery] = useState("");
  const [aircraftFilter, setAircraftFilter] = useState("");

  const dueBookings = getPostFlightDueBookings(data);
  const upcomingBookings = data.bookings.filter(
    (b) =>
      b.type !== "maintenance" &&
      b.status === "scheduled" &&
      b.approvalStatus !== "pending" &&
      b.approvalStatus !== "declined" &&
      !dueBookings.some((d) => d.id === b.id) &&
      !data.flights.some((f) => f.bookingId === b.id),
  );

  const completedFlightsWithBookings = data.flights
    .filter((f) => f.bookingId)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  const filterList = (bookings: Booking[]) =>
    bookings.filter((b) => {
      if (aircraftFilter && b.aircraftId !== aircraftFilter) return false;
      if (!searchQuery) return true;
      const st = lk.user(b.studentId)?.name ?? "";
      const ins = lk.user(b.instructorId)?.name ?? "";
      const ac = lk.aircraft(b.aircraftId);
      const reg = ac?.reg ?? "";
      const lesson = lk.lesson(b.lessonId)?.name ?? "";
      return `${b.id} ${st} ${ins} ${reg} ${lesson}`.toLowerCase().includes(searchQuery.toLowerCase());
    });

  const filteredDue = filterList(dueBookings);
  const filteredUpcoming = filterList(upcomingBookings);

  return (
    <Section
      title={`Did the flight happen? — Post-Flight Verification & Logbook Sync (${dueBookings.length} due)`}
      description="Regulatory compliance: past scheduled bookings awaiting verification. Confirming 'Yes' automatically generates the official student logbook entry, advances airframe hours, and locks the slot. Confirming 'No' logs the cancellation reason."
      className="mt-6 border-2 border-primary/30 bg-card/90 shadow-md"
      action={
        <div className="flex items-center gap-2">
          <Chip tone={dueBookings.length > 0 ? "soon" : "ok"}>
            {dueBookings.length > 0 ? `${dueBookings.length} Awaiting Verification` : "All Flights Cleared"}
          </Chip>
        </div>
      }
    >
      <Tabs value={tab} onValueChange={(v) => setTab(v as never)}>
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
          <TabsList>
            <TabsTrigger value="due" className="relative">
              <Clock className="mr-1.5 h-3.5 w-3.5" />
              Due for Verification ({dueBookings.length})
              {dueBookings.length > 0 && (
                <span className="ml-1.5 flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
              Upcoming &amp; In-Flight ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
              Recently Verified Sorties ({completedFlightsWithBookings.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-center gap-2">
            <Input
              className="w-48 sm:w-56 h-8 text-xs"
              placeholder="Search student, tail #, lesson…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <NativeSelect
              className="w-36 h-8 text-xs"
              value={aircraftFilter}
              onChange={(e) => setAircraftFilter(e.target.value)}
              aria-label="Filter aircraft"
            >
              <option value="">All Aircraft</option>
              {data.aircraft.map((ac) => (
                <option key={ac.id} value={ac.id}>
                  {ac.reg} ({ac.type})
                </option>
              ))}
            </NativeSelect>
          </div>
        </div>

        {/* Tab 1: Due for Verification */}
        <TabsContent value="due" className="mt-3">
          {dueBookings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
              <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-emerald-500" />
              <p className="font-semibold text-foreground">All completed flight slots are verified</p>
              <p className="mt-1">Every past scheduled flight has been reviewed and synced with student logbooks.</p>
            </div>
          ) : filteredDue.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No due flights match your filter criteria.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDue.map((b) => {
                const st = lk.user(b.studentId);
                const stName =
                  st?.name ||
                  (b.studentId === "u-arp"
                    ? "Aarav Patel"
                    : b.studentId === "u-ana"
                      ? "Ananya Sharma"
                      : b.studentId === "u-lnl"
                        ? "Liam Nielsen"
                        : b.studentId === "u-rhv"
                          ? "Rohan Verma"
                          : `Student (${b.studentId})`);
                const stEmail = st?.email || `${stName.toLowerCase().split(" ")[0]}@flysilverarrows.com`;
                const ins = lk.user(b.instructorId);
                const ac = lk.aircraft(b.aircraftId);
                const lesson = lk.lesson(b.lessonId);
                const off = format(new Date(b.start), "HH:mm");
                const on = format(new Date(b.end), "HH:mm");
                const mins = blockMinutes(off, on) || 120;
                return (
                  <div
                    key={b.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/80 bg-muted/20 p-4 transition hover:border-primary/50 hover:bg-muted/30"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-primary bg-primary/10 border border-primary/25 px-2.5 py-0.5 rounded-lg">
                          Student Pilot: {stName}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          ({stEmail})
                        </span>
                        <span className="rounded-md bg-muted border border-border px-2 py-0.5 font-mono text-xs font-semibold text-foreground">
                          {ac?.reg ?? b.aircraftId} · {ac?.type ?? "Aircraft"}
                        </span>
                        <span className="rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[11px] font-bold text-amber-500 font-mono">
                          Slot ended {on} · Verification Due
                        </span>
                      </div>

                      <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
                        <span>
                          <strong>Date:</strong> {format(new Date(b.start), "dd-MM-yyyy")}
                        </span>
                        <span>
                          <strong>Slot:</strong> {off}–{on} ({fmtDec(mins)} h)
                        </span>
                        <span>
                          <strong>Lesson:</strong> {lesson?.name ?? (b.type === "solo" ? "Solo Flight" : "Dual Training")}
                        </span>
                        <span>
                          <strong>Instructor:</strong> {ins?.name ?? "Solo PIC"}
                        </span>
                      </div>

                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 pt-0.5">
                        <CheckCircle2 className="h-3 w-3 shrink-0" />
                        Updates exclusively {stName}&apos;s official logbook ({b.studentId})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => setDialogState({ booking: b, decision: "yes" })}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-8 px-3.5 shadow-sm"
                      >
                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                        Yes, {stName.split(" ")[0]} Flew
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDialogState({ booking: b, decision: "no" })}
                        className="border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground font-semibold text-xs h-8 px-3.5"
                      >
                        <XCircle className="mr-1.5 h-3.5 w-3.5" />
                        No, Did Not Fly
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Upcoming & In-Flight Slots */}
        <TabsContent value="upcoming" className="mt-3">
          {filteredUpcoming.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No upcoming scheduled flights matching filters.
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredUpcoming.map((b) => {
                const st = lk.user(b.studentId);
                const ins = lk.user(b.instructorId);
                const ac = lk.aircraft(b.aircraftId);
                const off = format(new Date(b.start), "HH:mm");
                const on = format(new Date(b.end), "HH:mm");
                const mins = blockMinutes(off, on) || 120;
                return (
                  <div
                    key={b.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/15 p-3 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-foreground">{st?.name ?? "Student"}</span> ·{" "}
                      <span className="font-mono">{ac?.reg ?? b.aircraftId}</span>{" "}
                      <span className="text-muted-foreground">
                        ({format(new Date(b.start), "dd-MM-yyyy")} {off}–{on} · {fmtDec(mins)} h · CFI: {ins?.name ?? "Solo"})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDialogState({ booking: b, decision: "yes" })}
                        className="h-7 px-3 text-[11px]"
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-500" /> Yes, Flown Early
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDialogState({ booking: b, decision: "no" })}
                        className="h-7 px-3 text-[11px] text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="mr-1 h-3 w-3" /> Cancel / No-Flight
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Tab 3: Recently Verified & Logged */}
        <TabsContent value="completed" className="mt-3">
          <div className="divide-y divide-border/60 rounded-xl border border-border bg-muted/10">
            {completedFlightsWithBookings.map((f) => {
              const st = lk.user(f.pilotId);
              const ins = lk.user(f.instructorId);
              const ac = lk.aircraft(f.aircraftId);
              return (
                <div key={f.id} className="p-3 text-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 font-semibold text-foreground">
                      <span>{st?.name ?? "Student"}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">{ac?.reg}</span>
                      <Chip tone="ok">Verified &amp; Logged</Chip>
                      <span className="font-mono text-[10px] text-muted-foreground">{f.id}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Date: {f.date} · {f.offBlock}–{f.onBlock} ({fmtDec(f.minutes)} h {f.kind}) · Grade: {f.grade ?? 4}/5 · Landings: {f.landings} · CFI: {ins?.name ?? "Solo"}
                    </div>
                    {f.remarks && (
                      <p className="text-[11px] text-foreground/80 italic mt-0.5">“{f.remarks}”</p>
                    )}
                  </div>
                  <Chip tone="ok">
                    +{fmtDec(f.minutes)} h Logged
                  </Chip>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <PostFlightCompletionDialog state={dialogState} onClose={() => setDialogState(null)} />
    </Section>
  );
}

function FlightsPage() {
  const { data, me, deleteFlight, commit, log } = useMe();
  const lk = useLookup();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Flight | undefined>(undefined);
  const [q, setQ] = useState("");
  const [kindFilter, setKindFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const allVisible = visibleTo(me, data.flights).sort((a, b) => b.date.localeCompare(a.date));

  const filtered = allVisible.filter((f) => {
    if (kindFilter && f.kind !== kindFilter) return false;
    const vStatus = f.verificationStatus ?? "verified";
    if (statusFilter && vStatus !== statusFilter) return false;
    if (!q) return true;
    const pilot = lk.user(f.pilotId)?.name ?? "";
    const inst = lk.user(f.instructorId)?.name ?? "";
    const ac = lk.aircraft(f.aircraftId);
    const lesson = lk.lesson(f.lessonId)?.name ?? "";
    return `${f.date} ${pilot} ${inst} ${ac?.reg ?? ""} ${ac?.type ?? ""} ${f.fromIcao ?? ""} ${f.toIcao ?? ""} ${lesson} ${f.remarks ?? ""}`
      .toLowerCase()
      .includes(q.toLowerCase());
  });

  const verifiedFiltered = filtered.filter(isFlightVerified);
  const pendingFiltered = filtered.filter((f) => f.verificationStatus === "pending");

  const totalMin = verifiedFiltered.reduce((s, f) => s + f.minutes, 0);
  const dualMin = verifiedFiltered
    .filter((f) => f.kind === "dual")
    .reduce((s, f) => s + f.minutes, 0);
  const soloMin = verifiedFiltered
    .filter((f) => f.kind === "solo" || f.kind === "pic")
    .reduce((s, f) => s + f.minutes, 0);
  const xcMin = verifiedFiltered.reduce(
    (s, f) => s + flightTimeParts(f, data.aircraft).xc,
    0,
  );
  const ifrMin = verifiedFiltered.reduce(
    (s, f) => s + flightTimeParts(f, data.aircraft).ifr,
    0,
  );
  const multiMin = verifiedFiltered.reduce(
    (s, f) => s + flightTimeParts(f, data.aircraft).multi,
    0,
  );
  const dayMin = verifiedFiltered.reduce(
    (s, f) => s + flightTimeParts(f, data.aircraft).day,
    0,
  );
  const nightMin = verifiedFiltered.reduce(
    (s, f) => s + flightTimeParts(f, data.aircraft).night,
    0,
  );

  function handleDelete(f: Flight) {
    if (!confirm(`Delete flight ${f.id} on ${f.date}? Airframe hours will be rolled back.`)) return;
    deleteFlight(f.id);
    log("flight_deleted", "flight", `Deleted flight ${f.id} (${fmtDec(f.minutes)} h)`, f.id);
    toast.success("Flight removed from logbook");
  }

  function handleVerify(f: Flight, decision: "verified" | "rejected") {
    const err = commit(verifyFlightLog(data, f.id, me, decision, f.remarks));
    if (err) {
      toast.error(err);
      return;
    }
    log(
      decision === "verified" ? "flight_verified" : "flight_rejected",
      "flight",
      `${decision === "verified" ? "Verified" : "Rejected"} flight log ${f.id} (${fmtDec(f.minutes)} h ${f.kind}) for ${lk.user(f.pilotId)?.name ?? f.pilotId}`,
      f.id,
    );
    toast.success(
      decision === "verified"
        ? "Flight log verified and official hours updated"
        : "Flight log marked as rejected",
    );
  }

  function exportCsv() {
    const headers = [
      "Date",
      "OffBlock",
      "OnBlock",
      "Departure",
      "Arrival",
      "AircraftReg",
      "AircraftType",
      "Pilot",
      "Instructor",
      "Kind",
      "Lesson",
      "DurationMin",
      "DayMin",
      "NightMin",
      "XCMin",
      "IFRMin",
      "MultiEngineMin",
      "Landings",
      "Grade",
      "VerificationStatus",
      "Remarks",
    ];
    const rows = filtered.map((f) => {
      const ac = lk.aircraft(f.aircraftId);
      const parts = flightTimeParts(f, data.aircraft);
      return [
        f.date,
        f.offBlock ?? "",
        f.onBlock ?? "",
        f.fromIcao ?? "EKAH",
        f.toIcao ?? "EKAH",
        ac?.reg ?? f.aircraftId,
        ac?.type ?? "",
        lk.user(f.pilotId)?.name ?? f.pilotId,
        lk.user(f.instructorId)?.name ?? "Solo",
        f.kind,
        lk.lesson(f.lessonId)?.code ?? "",
        String(f.minutes),
        String(parts.day),
        String(parts.night),
        String(parts.xc),
        String(parts.ifr),
        String(parts.multi),
        String(f.landings),
        String(f.grade ?? ""),
        f.verificationStatus ?? "verified",
        (f.remarks ?? "").replace(/,/g, ";"),
      ];
    });
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `silverarrows-flights-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <PageHeader
        title="Electronic flight logbook"
        subtitle="Official EASA Part-FCL & DGCA training flight records, hours breakdown, and instructor verification"
      >
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="mr-1.5 h-4 w-4" /> Export CSV
        </Button>
        {(can.logFlight(me.role) || me.role === "student") && (
          <Button
            size="sm"
            onClick={() => {
              setEditing(undefined);
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-1.5 h-4 w-4" />{" "}
            {me.role === "student" ? "Submit flight log entry" : "Log flight"}
          </Button>
        )}
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <Stat
          label="Verified total time"
          value={fmtHours(totalMin)}
          hint={`Day ${fmtDec(dayMin)} h · Night ${fmtDec(nightMin)} h`}
        />
        <Stat
          label="Dual instruction"
          value={fmtHours(dualMin)}
          hint={`${fmtDec(dualMin)} decimal hrs`}
        />
        <Stat
          label="Solo / PIC time"
          value={fmtHours(soloMin)}
          hint={`${fmtDec(soloMin)} decimal hrs`}
        />
        <Stat
          label="Cross-country"
          value={`${fmtDec(xcMin)} h`}
          hint={fmtHours(xcMin)}
        />
        <Stat
          label="Instrument (IFR)"
          value={`${fmtDec(ifrMin)} h`}
          hint={fmtHours(ifrMin)}
        />
        <Stat
          label="Multi-engine"
          value={`${fmtDec(multiMin)} h`}
          hint={
            pendingFiltered.length > 0
              ? `${pendingFiltered.length} pending verification`
              : `${verifiedFiltered.length} verified sorties`
          }
        />
      </div>

      {(me.role === "student" || me.role === "instructor") && <CumulativeHours person={me} />}

      <FlightProgressTracker className="mt-4" />

      <WeatherWidget
        className="mt-4"
        onLogFlightWithWeather={(wx) => {
          setEditing({
            fromIcao: wx.icao,
            toIcao: wx.icao,
            weatherReport: wx,
          });
          setDialogOpen(true);
        }}
      />

      <div className="mt-4">
        <FlightPathVisualizer
          onApplyRouteToFlightLog={(fromIcao, toIcao, remarks) => {
            setEditing({
              fromIcao,
              toIcao,
              remarks,
            });
            setDialogOpen(true);
          }}
        />
      </div>

      {me.role === "admin" && <AdminPostFlightSection />}

      <Section
        title={`Flight log records (${filtered.length})`}
        description="Verified flight logs are locked against unapproved student modifications. Student-submitted logs require instructor verification."
        className="mt-6"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input
              className="w-56"
              placeholder="Search pilot, reg, ICAO, lesson…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <NativeSelect
              className="w-36"
              value={kindFilter}
              onChange={(e) => setKindFilter(e.target.value)}
              aria-label="Filter flight kind"
            >
              <option value="">All types</option>
              <option value="dual">Dual</option>
              <option value="solo">Solo</option>
              <option value="pic">PIC</option>
              <option value="sim">Simulator</option>
            </NativeSelect>
            <NativeSelect
              className="w-40"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter verification status"
            >
              <option value="">All statuses</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending review</option>
              <option value="rejected">Rejected</option>
            </NativeSelect>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <Empty title="No flights match your filter" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date &amp; Times</TableHead>
                <TableHead>Aircraft (Reg &amp; Type)</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Pilot &amp; Instructor</TableHead>
                <TableHead>Type &amp; Duration</TableHead>
                <TableHead>Breakdown (Day / Night / XC / IFR / ME)</TableHead>
                <TableHead>Lesson, Weather &amp; Remarks</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((f) => {
                const ac = lk.aircraft(f.aircraftId);
                const parts = flightTimeParts(f, data.aircraft);
                const vStatus = f.verificationStatus ?? "verified";
                const studentCanEdit =
                  me.role === "student" && f.pilotId === me.id && vStatus !== "verified";
                const wxInfo = extractFlightWeather(f);
                const cleanRemarks = f.remarks
                  ? f.remarks.replace(/\s*\[WX:[^\]]+\]/g, "").trim()
                  : "";
                return (
                  <TableRow key={f.id}>
                    <TableCell className="num text-xs font-medium whitespace-nowrap">
                      {format(new Date(f.date), "dd.MM.yyyy")}
                      <div className="text-muted-foreground">
                        {f.offBlock ?? "—"}–{f.onBlock ?? "—"}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="font-semibold text-foreground">
                        {ac?.reg ?? f.aircraftId}
                      </div>
                      <div className="text-muted-foreground">{ac?.type ?? "—"}</div>
                    </TableCell>
                    <TableCell className="num text-xs font-medium whitespace-nowrap">
                      {f.fromIcao ?? "EKAH"} → {f.toIcao ?? "EKAH"}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="font-medium text-foreground">
                        {lk.user(f.pilotId)?.name ?? f.pilotId}
                      </div>
                      <div className="text-muted-foreground">
                        CFI: {lk.user(f.instructorId)?.name ?? "Solo"}
                      </div>
                    </TableCell>
                    <TableCell className="num text-xs whitespace-nowrap">
                      <div className="font-semibold uppercase text-foreground">
                        {f.kind} · {fmtDec(f.minutes)} h
                      </div>
                      <div className="text-muted-foreground">
                        {fmtHours(f.minutes)} · {f.landings} ldg
                      </div>
                    </TableCell>
                    <TableCell className="num text-[11px] leading-relaxed text-muted-foreground">
                      <div>
                        Day <strong className="text-foreground">{fmtDec(parts.day)}h</strong> ·
                        Night <strong className="text-foreground">{fmtDec(parts.night)}h</strong>
                      </div>
                      <div>
                        XC <strong className="text-foreground">{fmtDec(parts.xc)}h</strong> · IFR{" "}
                        <strong className="text-foreground">{fmtDec(parts.ifr)}h</strong> · ME{" "}
                        <strong className="text-foreground">{fmtDec(parts.multi)}h</strong>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <span>{lk.lesson(f.lessonId)?.name ?? "Free flight"}</span>
                        {f.grade && (
                          <Chip tone={f.grade >= 3 ? "ok" : "expired"}>G{f.grade}</Chip>
                        )}
                      </div>
                      {wxInfo && (
                        <div
                          className="font-mono text-[11px] font-medium text-primary"
                          title={wxInfo.metar}
                          data-testid={`flight-weather-${f.id}`}
                        >
                          WX: {wxInfo.summary}
                        </div>
                      )}
                      {cleanRemarks && (
                        <div className="truncate text-xs italic text-muted-foreground">
                          “{cleanRemarks}”
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {vStatus === "verified" ? (
                        <Chip tone="ok">Verified</Chip>
                      ) : vStatus === "pending" ? (
                        <Chip tone="soon">Pending review</Chip>
                      ) : (
                        <Chip tone="expired">Rejected</Chip>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-1">
                        {can.logFlight(me.role) && vStatus === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs"
                              title="Verify flight log"
                              onClick={() => handleVerify(f, "verified")}
                            >
                              <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-success" /> Verify
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs text-destructive"
                              title="Reject flight log"
                              onClick={() => handleVerify(f, "rejected")}
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                        {can.logFlight(me.role) && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              title="Edit flight log"
                              onClick={() => {
                                setEditing(f);
                                setDialogOpen(true);
                              }}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              title="Delete flight log"
                              onClick={() => handleDelete(f)}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </>
                        )}
                        {studentCanEdit && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2.5 text-xs"
                            onClick={() => {
                              setEditing(f);
                              setDialogOpen(true);
                            }}
                          >
                            <Pencil className="mr-1 h-3 w-3" /> Edit pending
                          </Button>
                        )}
                        {me.role === "student" && vStatus === "verified" && (
                          <span
                            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"
                            title="Verified flight logs are locked and cannot be altered by students"
                          >
                            <Lock className="h-3 w-3" /> Locked
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Section>

      <FlightDialog open={dialogOpen} onOpenChange={setDialogOpen} initial={editing} />
    </div>
  );
}
