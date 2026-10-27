import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  AlertTriangle,
  CalendarClock,
  CalendarPlus,
  Plane,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Chip, Empty, Field, KV, NativeSelect, PageHeader, Section, Stat } from "@/components/app-ui";
import { BookingDialog } from "@/components/booking-dialog";
import { FlightDialog } from "@/components/flight-dialog";
import { AssignedCoursesPanel } from "@/components/assigned-courses-panel";
import { CumulativeHours } from "@/components/cumulative-hours";
import { FlightProgressTracker } from "@/components/flight-progress-tracker";
import { ProficiencyBadges } from "@/components/proficiency-badges";
import { ProfileEditor } from "@/components/profile-editor";
import { useViewAs, ViewAsPicker, viewAsSearch } from "@/components/view-as";
import { useLookup, useMe } from "@/lib/store";
import {
  aircraftUnavailable,
  bookingPending,
  expiryState,
  fmtDec,
  hoursBreakdown,
  hoursToService,
  studentDocumentsFor,
  studentProgress,
  theoryProgress,
  uid,
} from "@/lib/logic";
import {
  reasonLabel,
  type Booking,
  type Flight,
  type RescheduleReason,
} from "@/lib/types";

export const Route = createFileRoute("/_shell/portal/student")({
  validateSearch: viewAsSearch,
  head: () => ({
    meta: [
      { title: "Student portal — SilverArrows" },
      {
        name: "description",
        content:
          "Training progress, aviation identification, licences & documents, examination status, logbook hours, upcoming flights and e-learning for student pilots.",
      },
      { property: "og:title", content: "Student portal — SilverArrows" },
      {
        property: "og:description",
        content:
          "Training progress, aviation records, theory exams, logbook hours, upcoming flights and e-learning for student pilots.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StudentPortal,
});

const expTone = (s: string) =>
  (s === "ok" ? "ok" : s === "soon" ? "soon" : s === "expired" ? "expired" : "none") as
    | "ok"
    | "soon"
    | "expired"
    | "none";

function StudentPortal() {
  const { id } = Route.useSearch();
  const { data, me, update, log } = useMe();
  const lk = useLookup();
  const s = useViewAs("student", id);

  const [req, setReq] = useState<{
    booking: Booking;
    reason: RescheduleReason;
    details: string;
    date: string;
    t1: string;
    t2: string;
  } | null>(null);
  const [book, setBook] = useState<{ open: boolean; initial: Partial<Booking> }>({
    open: false,
    initial: {},
  });
  const [flightDialog, setFlightDialog] = useState<{ open: boolean; initial?: Partial<Flight> }>({
    open: false,
  });

  if (!s) return <Empty>No active students.</Empty>;

  const prog = studentProgress(s.id, data);
  const theory = theoryProgress(s.id, data);
  const hrs = hoursBreakdown(s.id, data);
  const med = expiryState(s.medicalExpiry);
  const spl = expiryState(s.splExpiry);
  const frtol = expiryState(s.frtolExpiry);
  const rtr = expiryState(s.rtrExpiry);
  const docs = studentDocumentsFor(s, data);
  const expiringDocs = docs.filter(
    (d) => d.expiryState === "expired" || d.expiryState === "soon",
  );

  const now = new Date();
  const upcoming = data.bookings
    .filter((b) => b.studentId === s.id && b.status === "scheduled" && new Date(b.end) > now)
    .sort((a, b) => a.start.localeCompare(b.start));
  const requests = data.requests
    .filter((r) => r.studentId === s.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const lectures = data.lectures
    .filter((l) => l.enrolled.includes(s.id) && new Date(l.end) > now)
    .sort((a, b) => a.start.localeCompare(b.start));
  const grades = data.flights
    .filter((f) => f.pilotId === s.id && f.grade)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  const isSelf = me.id === s.id;
  const canAct = isSelf || me.role === "admin";

  // DGCA / CAA 5-Paper Examination Checklist summary
  const coreExamsPassed = [
    Boolean(s.examAirRegulation),
    Boolean(s.examMeteorology),
    Boolean(s.examAirNavigation),
    Boolean(s.examTechnicalGeneral),
    Boolean(s.examTechnicalSpecific && s.examTechnicalSpecific !== "Not Attempted"),
  ].filter(Boolean).length;

  function openReq(b: Booking) {
    const st = new Date(new Date(b.start).getTime() + 86400000);
    const en = new Date(new Date(b.end).getTime() + 86400000);
    setReq({
      booking: b,
      reason: "weather",
      details: "",
      date: format(st, "yyyy-MM-dd"),
      t1: format(st, "HH:mm"),
      t2: format(en, "HH:mm"),
    });
  }

  function submitReq() {
    if (!req || !s) return;
    if (req.details.trim().length < 5) return void toast.error("Please describe the reason.");
    const proposedStart = new Date(`${req.date}T${req.t1}`);
    const proposedEnd = new Date(`${req.date}T${req.t2}`);
    if (proposedEnd <= proposedStart) return void toast.error("End must be after start.");
    if (proposedStart < new Date()) return void toast.error("Proposed time must be in the future.");
    if (data.requests.some((r) => r.bookingId === req.booking.id && r.status === "pending"))
      return void toast.error("A request for this flight is already pending.");
    const rq = {
      id: `RQ-${uid().slice(0, 4).toUpperCase()}`,
      bookingId: req.booking.id,
      studentId: s.id,
      instructorId: req.booking.instructorId,
      reason: req.reason,
      details: req.details.trim(),
      proposedStart: proposedStart.toISOString(),
      proposedEnd: proposedEnd.toISOString(),
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    };
    update((d) => ({ ...d, requests: [rq, ...d.requests] }));
    log(
      "reschedule_requested",
      "booking",
      `Requested reschedule for ${req.booking.id} (reason: ${req.reason}) to ${format(proposedStart, "dd.MM.yyyy HH:mm")}`,
      req.booking.id,
    );
    toast.success("Reschedule request sent to your instructor");
    setReq(null);
  }

  function handleCancelBooking(b: Booking) {
    if (!canAct) return;
    if (!confirm(`Cancel booking ${b.id} on ${format(new Date(b.start), "dd.MM.yyyy HH:mm")}?`))
      return;
    update((d) => ({
      ...d,
      bookings: d.bookings.map((x) =>
        x.id === b.id ? { ...x, status: "cancelled" as const } : x,
      ),
    }));
    log(
      "booking_cancelled",
      "booking",
      `Cancelled flight booking ${b.id} (${lk.aircraft(b.aircraftId)?.reg ?? b.aircraftId})`,
      b.id,
    );
    toast.success("Flight booking cancelled");
  }

  function selectAircraft(acId: string) {
    const ac = lk.aircraft(acId);
    log("plane_selected", "aircraft", `Selected ${ac?.reg} for next lesson`, acId);
    const st = new Date();
    st.setDate(st.getDate() + 1);
    st.setHours(10, 0, 0, 0);
    setBook({
      open: true,
      initial: {
        aircraftId: acId,
        studentId: s!.id,
        instructorId: s!.instructorId,
        lessonId: prog.next?.id,
        start: st.toISOString(),
        end: new Date(st.getTime() + 7200000).toISOString(),
      },
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student portal"
        subtitle={`${s.name} (${s.callsign ?? "—"}) · ${prog.program?.name ?? "No program"} · Computer No: ${s.computerNumber ?? "—"} · eGCA: ${s.egcaId ?? "—"}`}
      >
        <ViewAsPicker role="student" current={s} to="/portal/student" />
        <Button
          variant="outline"
          size="sm"
          disabled={!canAct}
          onClick={() => {
            const st = new Date();
            st.setDate(st.getDate() + 1);
            st.setHours(10, 0, 0, 0);
            setBook({
              open: true,
              initial: {
                aircraftId: data.aircraft[0]?.id ?? "a-1",
                studentId: s.id,
                instructorId: s.instructorId,
                lessonId: prog.next?.id,
                start: st.toISOString(),
                end: new Date(st.getTime() + 7200000).toISOString(),
              },
            });
          }}
        >
          <CalendarPlus className="mr-1.5 h-4 w-4" /> Book flight
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!canAct}
          onClick={() => setFlightDialog({ open: true, initial: { pilotId: s.id } })}
        >
          <Plus className="mr-1.5 h-4 w-4" /> Submit flight log
        </Button>
        <ProfileEditor person={s} />
      </PageHeader>

      {/* Expiring Aviation Document / Medical Warning Banner */}
      {expiringDocs.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-warning/40 bg-warning/10 px-4 py-3 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
            <div>
              <span className="font-bold text-foreground">
                Aviation Document Validity Alert ({expiringDocs.length}):
              </span>{" "}
              <span className="text-muted-foreground">
                {expiringDocs
                  .map(
                    (d) =>
                      `${d.title} (${d.expiryState === "expired" ? `Expired ${-d.daysRemaining}d ago` : `Expiring in ${d.daysRemaining}d`})`,
                  )
                  .join(" · ")}
              </span>
            </div>
          </div>
          <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
            <Link to="/profile">Review Licences &amp; Documents</Link>
          </Button>
        </div>
      )}

      {/* Primary Student KPI Strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total Flying Hours"
          value={`${fmtDec(hrs.total)} h`}
          hint={`Last flown: ${hrs.lastFlightDate ? format(new Date(hrs.lastFlightDate), "dd.MM.yyyy") : "—"}`}
        />
        <Stat
          label="Dual & Solo Hours"
          value={`${fmtDec(hrs.dual)}h / ${fmtDec(hrs.solo)}h`}
          hint={`Day ${fmtDec(hrs.day)} h · Night ${fmtDec(hrs.night)} h`}
        />
        <Stat
          label="XC · Instrument · Multi"
          value={`${fmtDec(hrs.crossCountry)}h · ${fmtDec(hrs.ifr)}h · ${fmtDec(hrs.multiEngine)}h`}
          hint="Verified specialist flying hours"
        />
        <Stat
          label="Exams & Syllabus"
          value={`${coreExamsPassed}/5 DGCA · ${prog.pct}%`}
          hint={`Theory ${theory.passed}/${theory.total} (${theory.pct}%)`}
        />
      </div>

      {/* 3-Column Overview Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Section
          title="Profile & Aviation ID"
          action={
            <Link to="/profile" className="text-xs font-medium text-primary hover:underline">
              Full profile &amp; records →
            </Link>
          }
        >
          <KV k="Name" v={<span className="font-semibold">{s.name}</span>} />
          <KV k="Call sign" v={<span className="num">{s.callsign ?? "—"}</span>} />
          <KV
            k="Computer Number"
            v={<span className="num font-semibold">{s.computerNumber ?? "—"}</span>}
          />
          <KV k="eGCA ID" v={<span className="num font-semibold">{s.egcaId ?? "—"}</span>} />
          <KV k="File Number" v={<span className="num">{s.fileNumber ?? "—"}</span>} />
          <KV k="Licence" v={<span className="num">{s.licence ?? "—"}</span>} />
          <KV k="Stage" v={s.stage ?? "—"} />
          <KV k="Instructor" v={lk.user(s.instructorId)?.name ?? "—"} />
          <KV k="Next lesson" v={prog.next?.name ?? "Program complete"} />
        </Section>

        <Section
          title="E-learning, Theory & Exams"
          action={
            <Link to="/training" className="text-xs font-medium text-primary hover:underline">
              Syllabus &amp; exams →
            </Link>
          }
        >
          <div className="mb-1 flex justify-between text-sm">
            <span>DGCA / Core Aviation Exams</span>
            <span className="num font-semibold">{coreExamsPassed}/5 passed</span>
          </div>
          <Progress value={(coreExamsPassed / 5) * 100} className="mb-3 h-2" />

          <div className="mb-1 flex justify-between text-sm">
            <span>Theory exams passed</span>
            <span className="num font-semibold">
              {theory.passed}/{theory.total} · {theory.pct}%
            </span>
          </div>
          <Progress value={theory.pct} className="mb-3 h-2" />

          <div className="mb-1 flex justify-between text-sm">
            <span>Flight syllabus</span>
            <span className="num font-semibold">
              {prog.completed}/{prog.total} · {prog.pct}%
            </span>
          </div>
          <Progress value={prog.pct} className="mb-3 h-2" />

          <div className="mb-2 grid grid-cols-2 gap-1 text-[11px]">
            <div className="flex items-center justify-between rounded border px-2 py-1">
              <span>Air Regulation</span>
              <Chip tone={s.examAirRegulation ? "ok" : "none"}>
                {s.examAirRegulation ? "Pass" : "Pending"}
              </Chip>
            </div>
            <div className="flex items-center justify-between rounded border px-2 py-1">
              <span>Meteorology</span>
              <Chip tone={s.examMeteorology ? "ok" : "none"}>
                {s.examMeteorology ? "Pass" : "Pending"}
              </Chip>
            </div>
            <div className="flex items-center justify-between rounded border px-2 py-1">
              <span>Air Navigation</span>
              <Chip tone={s.examAirNavigation ? "ok" : "none"}>
                {s.examAirNavigation ? "Pass" : "Pending"}
              </Chip>
            </div>
            <div className="flex items-center justify-between rounded border px-2 py-1">
              <span>Tech General</span>
              <Chip tone={s.examTechnicalGeneral ? "ok" : "none"}>
                {s.examTechnicalGeneral ? "Pass" : "Pending"}
              </Chip>
            </div>
          </div>
          <div className="mb-2 flex items-center justify-between rounded border px-2 py-1 text-[11px]">
            <span>Technical Specific</span>
            <span className="font-semibold text-primary">
              {s.examTechnicalSpecific ?? "Not Attempted"}
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
            {data.subjects.map((sub) => {
              const r = theory.best.get(sub.id);
              return (
                <span key={sub.id} title={`${sub.name}${r ? ` — ${r.score}%` : ""}`}>
                  <Chip tone={r?.passed ? "ok" : r ? "expired" : "none"}>
                    {sub.code}
                    {r ? ` ${r.score}%` : ""}
                  </Chip>
                </span>
              );
            })}
          </div>
        </Section>

        <Section
          title="Medical, Licences & Currency"
          action={
            <Link to="/profile" className="text-xs font-medium text-primary hover:underline">
              Licences &amp; documents →
            </Link>
          }
        >
          <KV
            k={`Class ${s.medicalClass ?? 2} medical`}
            v={
              <Chip tone={expTone(med.state)}>
                {med.state === "none"
                  ? "Not on file"
                  : med.state === "expired"
                    ? `Expired ${-med.days} d ago`
                    : `Valid · ${med.days} days`}
              </Chip>
            }
          />
          <KV
            k="Medical expiry"
            v={
              <span className="num">
                {s.medicalExpiry ? format(new Date(s.medicalExpiry), "dd.MM.yyyy") : "—"}
              </span>
            }
          />
          <KV
            k={`SPL (${s.splNumber ?? "—"})`}
            v={
              <Chip tone={expTone(spl.state)}>
                {s.splExpiry ? format(new Date(s.splExpiry), "dd.MM.yyyy") : "—"}
              </Chip>
            }
          />
          <KV
            k={`FRTOL (${s.frtolNumber ?? "—"})`}
            v={
              <Chip tone={expTone(frtol.state)}>
                {s.frtolExpiry ? format(new Date(s.frtolExpiry), "dd.MM.yyyy") : "—"}
              </Chip>
            }
          />
          <KV
            k={`RTR (${s.rtrNumber ?? "—"})`}
            v={
              <Chip tone={expTone(rtr.state)}>
                {s.rtrExpiry ? format(new Date(s.rtrExpiry), "dd.MM.yyyy") : "—"}
              </Chip>
            }
          />
          <KV
            k="ICAO English"
            v={
              s.icaoLevel ? (
                <Chip tone={s.icaoLevel >= 4 ? "ok" : "expired"}>Level {s.icaoLevel}</Chip>
              ) : (
                "—"
              )
            }
          />
          <KV
            k="90-day landings"
            v={
              <Chip tone={hrs.landings90 >= 3 ? "ok" : "expired"}>
                {hrs.landings90} {hrs.landings90 >= 3 ? "· compliant" : "· need 3"}
              </Chip>
            }
          />
        </Section>
      </div>

      {/* Flight Hours Breakdown */}
      <Section
        title="Flight hours (logbook breakdown)"
        description={`Last Date of Flying: ${hrs.lastFlightDate ? format(new Date(hrs.lastFlightDate), "dd.MM.yyyy") : "No verified flights"} · Calculated from verified flight records`}
        action={
          <Link to="/flights" className="text-xs font-medium text-primary hover:underline">
            Open flight logbook →
          </Link>
        }
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10">
          {[
            ["Total", `${fmtDec(hrs.total)} h`],
            ["Dual (Day)", `${fmtDec(hrs.dualDay)} h`],
            ["Dual (Night)", `${fmtDec(hrs.dualNight)} h`],
            ["Solo (Day)", `${fmtDec(hrs.soloDay)} h`],
            ["Solo (Night)", `${fmtDec(hrs.soloNight)} h`],
            ["Cross-Country", `${fmtDec(hrs.crossCountry)} h`],
            ["Instrument", `${fmtDec(hrs.ifr)} h`],
            ["Multi-Engine", `${fmtDec(hrs.multiEngine)} h`],
            ["Simulator", `${fmtDec(hrs.sim)} h`],
            ["Landings", `${hrs.landings} (${hrs.nightLandings}N)`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-border/60 bg-background/60 p-3">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</p>
              <p className="num mt-1 text-xl font-bold">{v}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Assigned E-Learning Courses */}
      <AssignedCoursesPanel person={s} />

      {/* Cumulative Flown Hours by Window */}
      <CumulativeHours person={s} />

      {/* Flight Progress Tracker Chart */}
      <FlightProgressTracker pilotId={s.id} showPilotSelector={false} />

      {/* Aviation Proficiency Badges & Milestones */}
      <ProficiencyBadges person={s} />

      {/* Upcoming Flights & Reschedule Requests */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Section
          title="Upcoming scheduled flights"
          action={
            <Link to="/schedule" className="text-xs font-medium text-primary hover:underline">
              Dispatch calendar →
            </Link>
          }
        >
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing scheduled.</p>
          ) : (
            <ul className="divide-y">
              {upcoming.map((b) => {
                const pend = data.requests.find(
                  (r) => r.bookingId === b.id && r.status === "pending",
                );
                return (
                  <li key={b.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                    <div className="flex-1 min-w-[200px]">
                      <div className="num font-medium">
                        {format(new Date(b.start), "dd.MM.yyyy HH:mm")}–
                        {format(new Date(b.end), "HH:mm")} · {lk.aircraft(b.aircraftId)?.reg}
                      </div>
                      <div className="text-muted-foreground">
                        {lk.lesson(b.lessonId)?.name ?? "Flight"} · CFI{" "}
                        {lk.user(b.instructorId)?.name ?? "—"} · {b.route ?? "EKAH → EKAH"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {bookingPending(b) ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setBook({ open: true, initial: b })}
                        >
                          Awaiting admin approval
                        </Button>
                      ) : pend ? (
                        <Chip tone="soon">Reschedule pending</Chip>
                      ) : canAct ? (
                        <Button size="sm" variant="outline" onClick={() => openReq(b)}>
                          <CalendarClock className="h-4 w-4" /> Request reschedule
                        </Button>
                      ) : null}
                      {canAct && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleCancelBooking(b)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Section>

        <Section title="My reschedule requests">
          {requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No requests yet.</p>
          ) : (
            <ul className="divide-y">
              {requests.map((r) => (
                <li key={r.id} className="py-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {r.bookingId} · {reasonLabel[r.reason]}
                    </span>
                    <Chip
                      tone={
                        r.status === "approved"
                          ? "ok"
                          : r.status === "declined"
                            ? "expired"
                            : "soon"
                      }
                    >
                      {r.status}
                    </Chip>
                  </div>
                  <p className="text-muted-foreground">
                    “{r.details}” → proposed{" "}
                    <span className="num">
                      {format(new Date(r.proposedStart), "dd.MM HH:mm")}
                    </span>
                  </p>
                  {r.notes && <p className="mt-1 text-xs">Instructor note: {r.notes}</p>}
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      {/* Aircraft Available for Training */}
      <Section title="Aircraft available for training">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {data.aircraft.map((a) => {
            const left = hoursToService(a, data.maintenance);
            const down = aircraftUnavailable(a, data.maintenance);
            return (
              <div key={a.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="num text-lg font-semibold">{a.reg}</span>
                  <Chip tone={down ? "expired" : left !== null && left <= 15 ? "soon" : "ok"}>
                    {down ? "Unavailable" : "Airworthy"}
                  </Chip>
                </div>
                <p className="text-xs text-muted-foreground">{a.type}</p>
                <div className="mt-2">
                  <KV
                    k="To next service"
                    v={<span className="num">{left === null ? "—" : `${left} h`}</span>}
                  />
                  <KV
                    k="Airframe"
                    v={<span className="num">{a.totalHours.toFixed(1)} h</span>}
                  />
                  <KV k="Tach" v={<span className="num">{a.tachHours.toFixed(1)} h</span>} />
                  <KV
                    k="Last service"
                    v={
                      <span className="num">
                        {a.lastService ? format(new Date(a.lastService), "dd.MM.yyyy") : "—"}
                      </span>
                    }
                  />
                </div>
                <Button
                  size="sm"
                  className="mt-3 w-full"
                  disabled={down || !canAct}
                  onClick={() => selectAircraft(a.id)}
                >
                  <Plane className="h-4 w-4" /> Select for next lesson
                </Button>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Ground School Lectures & Recent Grades */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Ground school lectures">
          {lectures.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming lectures.</p>
          ) : (
            lectures.map((l) => (
              <div key={l.id} className="py-2 text-sm">
                <div className="font-medium">{l.title}</div>
                <div className="num text-muted-foreground">
                  {format(new Date(l.start), "dd.MM.yyyy HH:mm")} ·{" "}
                  {data.classrooms.find((c) => c.id === l.roomId)?.name}
                </div>
              </div>
            ))
          )}
        </Section>

        <Section title="Recent CBTA grades">
          {grades.length === 0 ? (
            <p className="text-sm text-muted-foreground">No graded flights yet.</p>
          ) : (
            grades.map((f) => (
              <div key={f.id} className="flex items-center justify-between py-2 text-sm">
                <span>
                  {lk.lesson(f.lessonId)?.name ?? "Flight"}{" "}
                  <span className="num text-muted-foreground">
                    · {format(new Date(f.date), "dd.MM")}
                  </span>
                </span>
                <Chip tone={(f.grade ?? 0) >= 3 ? "ok" : "expired"}>Grade {f.grade}/5</Chip>
              </div>
            ))
          )}
        </Section>
      </div>

      <Dialog open={!!req} onOpenChange={(o) => !o && setReq(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request reschedule — {req?.booking.id}</DialogTitle>
          </DialogHeader>
          {req && (
            <div className="grid grid-cols-3 gap-4">
              <Field label="Reason" className="col-span-3">
                <NativeSelect
                  value={req.reason}
                  onChange={(e) => setReq({ ...req, reason: e.target.value as RescheduleReason })}
                >
                  {Object.entries(reasonLabel).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
              <Field label="Details" className="col-span-3">
                <Textarea
                  rows={3}
                  value={req.details}
                  onChange={(e) => setReq({ ...req, details: e.target.value })}
                  placeholder="e.g. Crosswind forecast exceeds solo limit"
                />
              </Field>
              <Field label="New date">
                <Input
                  type="date"
                  value={req.date}
                  onChange={(e) => setReq({ ...req, date: e.target.value })}
                />
              </Field>
              <Field label="From">
                <Input
                  type="time"
                  value={req.t1}
                  onChange={(e) => setReq({ ...req, t1: e.target.value })}
                />
              </Field>
              <Field label="To">
                <Input
                  type="time"
                  value={req.t2}
                  onChange={(e) => setReq({ ...req, t2: e.target.value })}
                />
              </Field>
            </div>
          )}
          <DialogFooter>
            <Button onClick={submitReq}>Send request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BookingDialog
        open={book.open}
        onOpenChange={(o) => setBook((b) => ({ ...b, open: o }))}
        initial={book.initial}
      />

      <FlightDialog
        open={flightDialog.open}
        onOpenChange={(o) => setFlightDialog((f) => ({ ...f, open: o }))}
        initial={flightDialog.initial}
      />
    </div>
  );
}
