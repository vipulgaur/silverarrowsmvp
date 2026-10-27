import { useEffect, useState, type FormEvent } from "react";
import { format } from "date-fns";
import { CheckCircle2, Clock, MessageSquare, PlaneTakeoff, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Chip, Field, NativeSelect } from "@/components/app-ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { blockMinutes, fmtDec, uid } from "@/lib/logic";
import { seedData } from "@/lib/seed";
import { useLookup, useStore } from "@/lib/store";
import type { Booking, Flight } from "@/lib/types";

export interface PostFlightDialogState {
  booking: Booking;
  decision: "yes" | "no";
}

export function PostFlightCompletionDialog({
  state,
  onClose,
  booking: propBooking,
  initialDecision = "yes",
  open,
  onOpenChange,
}: {
  state?: PostFlightDialogState | null;
  onClose?: () => void;
  booking?: Booking | null;
  initialDecision?: "yes" | "no";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { data, me, saveFlight, saveBooking, log } = useStore();
  const lk = useLookup();

  const booking = state?.booking ?? propBooking ?? null;
  const decision = state?.decision ?? initialDecision;
  const isOpen = open !== undefined ? open : Boolean(state);

  const handleClose = () => {
    onClose?.();
    onOpenChange?.(false);
  };

  const defaultOff = booking ? format(new Date(booking.start), "HH:mm") : "13:00";
  const defaultOn = booking ? format(new Date(booking.end), "HH:mm") : "15:00";
  const defaultMins = blockMinutes(defaultOff, defaultOn) || 120;

  const [minutes, setMinutes] = useState(String(defaultMins));
  const [landings, setLandings] = useState("3");
  const [grade, setGrade] = useState("4");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (booking) {
      const off = format(new Date(booking.start), "HH:mm");
      const on = format(new Date(booking.end), "HH:mm");
      const mins = blockMinutes(off, on) || 120;
      setMinutes(String(mins));
      setLandings("3");
      setGrade("4");
      setMessage(
        decision === "yes"
          ? `Flight completed as scheduled (${off}–${on}). Logbook auto-updated.`
          : "Flight did not take place due to operational/weather constraints.",
      );
    }
  }, [booking, decision]);

  if (!isOpen || !booking) return null;

  const fallbackSeed = seedData();
  const student =
    lk.user(booking.studentId) ??
    data.users.find((u) => u.id === booking.studentId) ??
    fallbackSeed.users.find((u) => u.id === booking.studentId);

  const studentName =
    student?.name ||
    (booking.studentId === "u-arp"
      ? "Aarav Patel"
      : booking.studentId === "u-ana"
        ? "Ananya Sharma"
        : booking.studentId === "u-lnl"
          ? "Liam Nielsen"
          : booking.studentId === "u-rhv"
            ? "Rohan Verma"
            : `Student Pilot (${booking.studentId})`);

  const studentEmail =
    student?.email ||
    `${(studentName.toLowerCase().split(" ")[0])}@flysilverarrows.com`;

  const instructor = lk.user(booking.instructorId);
  const aircraft = lk.aircraft(booking.aircraftId);
  const lesson = lk.lesson(booking.lessonId);
  const dateStr = format(new Date(booking.start), "yyyy-MM-dd");
  const offBlock = format(new Date(booking.start), "HH:mm");
  const onBlock = format(new Date(booking.end), "HH:mm");

  async function handleConfirm(e: FormEvent) {
    e.preventDefault();
    const actor = me ?? data.users.find((u) => u.role === "admin") ?? data.users[0];
    if (!actor || !booking) return;

    const targetStudentId = booking.studentId;
    if (!targetStudentId) {
      toast.error("Cannot confirm flight: Booking has no assigned student.");
      return;
    }
    setBusy(true);

    try {
      if (decision === "yes") {
        const mins = Math.max(5, Number(minutes) || defaultMins);
        const ldg = Math.max(0, Number(landings) || 1);
        const parsedGrade = Number(grade) as 1 | 2 | 3 | 4 | 5;
        const tachStart = aircraft?.tachHours ?? 0;
        const tachEnd = Number((tachStart + mins / 60).toFixed(1));
        const kind: Flight["kind"] = booking.type === "solo" ? "solo" : "dual";

        const flight: Flight = {
          id: `FL-${uid().slice(0, 4).toUpperCase()}`,
          bookingId: booking.id,
          date: dateStr,
          offBlock,
          onBlock,
          aircraftId: booking.aircraftId ?? data.aircraft[0]?.id ?? "a-1",
          pilotId: targetStudentId,
          instructorId: kind === "solo" ? undefined : booking.instructorId,
          lessonId: booking.lessonId,
          kind,
          fromIcao: "EKAH",
          toIcao: "EKAH",
          tachStart,
          tachEnd,
          minutes: mins,
          landings: ldg,
          grade: parsedGrade >= 1 && parsedGrade <= 5 ? parsedGrade : 4,
          remarks: message.trim() || `Flight verified post-slot for student ${studentName}.`,
          verificationStatus: "verified",
          route: booking.route,
        };

        saveFlight(flight);
        log(
          "post_flight_confirmed_yes",
          "flight",
          `Confirmed flight ${booking.id} happened (${fmtDec(mins)} h). Exclusively updated logbook for student ${studentName} (${message.trim()})`,
          flight.id,
        );
        toast.success(
          `Logbook updated exclusively for student ${studentName} (+${fmtDec(mins)} h in ${aircraft?.reg ?? "aircraft"}).`,
        );
      } else {
        const updatedBooking: Booking = {
          ...booking,
          status: "cancelled",
          reviewedBy: actor.id,
          reviewedAt: new Date().toISOString(),
          decisionNotes: message.trim() || "Flight did not take place.",
        };
        await saveBooking(updatedBooking);
        log(
          "post_flight_confirmed_no",
          "booking",
          `Confirmed flight ${booking.id} did NOT happen for student ${studentName} · Message: ${message.trim()}`,
          booking.id,
        );
        toast.info(`Recorded that booking ${booking.id} did not happen for student ${studentName}.`);
      }
      handleClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {decision === "yes" ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>Confirm Flight for {studentName} &amp; Auto-Update Logbook</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-destructive" />
                <span>Record Flight Did Not Happen for {studentName}</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {decision === "yes"
              ? `Regulatory verification: Submitting will automatically update ONLY student pilot ${studentName}'s official electronic logbook, syllabus completions, and airframe tach hours.`
              : `Enter the operational/weather reason why this scheduled slot for ${studentName} did not take place. The booking will be closed and logged in the regulatory audit trail.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => void handleConfirm(e)} className="space-y-4 py-2">
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-3.5 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-primary">
                Student Pilot: {studentName}
              </span>
              <Chip tone={decision === "yes" ? "ok" : "expired"}>
                {decision === "yes" ? "Flight Happened (Yes)" : "Did Not Fly (No)"}
              </Chip>
            </div>
            <div className="text-foreground/90">
              Booking: <strong className="text-foreground">{booking.id}</strong> · Student ID:{" "}
              <span className="font-mono text-muted-foreground">{booking.studentId}</span> · Email:{" "}
              <strong className="text-foreground">{studentEmail}</strong>
            </div>
            <div className="text-muted-foreground">
              Aircraft: <strong className="text-foreground">{aircraft?.reg ?? booking.aircraftId}</strong> ({aircraft?.type ?? "Cessna 172S"}) ·
              Instructor: <strong className="text-foreground">{instructor?.name ?? "Solo PIC"}</strong>
            </div>
            <div className="num text-muted-foreground">
              Slot:{" "}
              <strong className="text-foreground">
                {format(new Date(booking.start), "dd-MM-yyyy")}
              </strong>{" "}
              from <strong className="text-foreground">{offBlock}</strong> to{" "}
              <strong className="text-foreground">{onBlock}</strong>
              {lesson ? ` · ${lesson.code} ${lesson.name}` : ""}
            </div>
            <div className="mt-1 pt-1 border-t border-primary/20 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              ✓ Logbook entries and flight hours will be updated exclusively for student {studentName}.
            </div>
          </div>

          {decision === "yes" && (
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Flown duration (min)">
                <Input
                  type="number"
                  min={5}
                  max={600}
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  required
                />
              </Field>
              <Field label="Landings">
                <Input
                  type="number"
                  min={0}
                  max={50}
                  value={landings}
                  onChange={(e) => setLandings(e.target.value)}
                  required
                />
              </Field>
              <Field label="Syllabus grade">
                <NativeSelect value={grade} onChange={(e) => setGrade(e.target.value)}>
                  <option value="5">5 — Exemplary</option>
                  <option value="4">4 — Proficient</option>
                  <option value="3">3 — Satisfactory</option>
                  <option value="2">2 — Needs practice</option>
                  <option value="1">1 — Unsatisfactory</option>
                </NativeSelect>
              </Field>
            </div>
          )}

          <Field
            label={
              decision === "yes"
                ? "Confirmation Message / Debrief Remarks (saved to student logbook)"
                : "Cancellation / No-Flight Message (logged to student & audit record)"
            }
          >
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                decision === "yes"
                  ? "Enter post-flight confirmation message & remarks…"
                  : "Enter reason why the flight did not happen…"
              }
              required
            />
          </Field>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={decision === "yes" ? "default" : "destructive"}
              disabled={busy}
            >
              <MessageSquare className="mr-1.5 h-4 w-4" />
              {busy
                ? "Updating…"
                : decision === "yes"
                  ? `Confirm & Auto-Update Logbook (${studentName.split(" ")[0]} · ${fmtDec(Number(minutes) || defaultMins)} h)`
                  : `Confirm Flight Did Not Happen for ${studentName.split(" ")[0]}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Returns scheduled flight bookings whose end time has passed (post end-hour)
 * and haven't been logged/completed yet.
 */
export function getPostFlightDueBookings(
  input: Booking[] | { bookings?: Booking[]; flights?: Flight[] } | null | undefined,
  now = new Date(),
): Booking[] {
  const bookings = Array.isArray(input) ? input : (input?.bookings ?? []);
  const flights = !Array.isArray(input) && input?.flights ? input.flights : [];
  return bookings.filter(
    (b) =>
      b.type !== "maintenance" &&
      b.status === "scheduled" &&
      b.approvalStatus !== "pending" &&
      b.approvalStatus !== "declined" &&
      new Date(b.end).getTime() <= now.getTime() &&
      !flights.some((f) => f.bookingId === b.id),
  );
}

export function PostFlightVerificationBanner({
  onSelectDecision,
  showEmptyState = false,
}: {
  onSelectDecision?: (state: PostFlightDialogState) => void;
  showEmptyState?: boolean;
}) {
  const { data, me } = useStore();
  const lk = useLookup();
  const [dialogState, setDialogState] = useState<PostFlightDialogState | null>(null);

  const dueBookings = getPostFlightDueBookings(data);
  const upcomingScheduled = data.bookings.filter(
    (b) =>
      b.type !== "maintenance" &&
      b.status === "scheduled" &&
      b.approvalStatus !== "pending" &&
      b.approvalStatus !== "declined" &&
      !dueBookings.some((d) => d.id === b.id) &&
      !data.flights.some((f) => f.bookingId === b.id),
  );

  if (!me || me.role !== "admin") {
    return null;
  }

  if (dueBookings.length === 0 && !showEmptyState) {
    return <PostFlightCompletionDialog state={dialogState} onClose={() => setDialogState(null)} />;
  }

  const handleOpen = (state: PostFlightDialogState) => {
    if (onSelectDecision) {
      onSelectDecision(state);
    } else {
      setDialogState(state);
    }
  };

  return (
    <>
      <div className="mb-6 rounded-2xl border border-primary/40 bg-card/90 p-5 shadow-md backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Post-Flight Verification — Did the flight happen? ({dueBookings.length})
              </h3>
              <p className="text-xs text-muted-foreground">
                Scheduled bookings that have passed their end time. Confirm Yes or No to open the
                message dialogue and automatically update the student&apos;s logbook.
              </p>
            </div>
          </div>
          <Chip tone={dueBookings.length > 0 ? "soon" : "ok"}>
            {dueBookings.length > 0
              ? `${dueBookings.length} Pending Verification`
              : "All Caught Up"}
          </Chip>
        </div>

        {dueBookings.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            All past scheduled flights have been verified and synced with student logbooks.
          </div>
        ) : (
          <div className="mt-3 divide-y divide-border/60">
            {dueBookings.map((b) => {
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
              const ins = lk.user(b.instructorId);
              const ac = lk.aircraft(b.aircraftId);
              const off = format(new Date(b.start), "HH:mm");
              const on = format(new Date(b.end), "HH:mm");
              const mins = blockMinutes(off, on) || 120;
              return (
                <div
                  key={b.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 font-semibold text-foreground">
                      <PlaneTakeoff className="h-3.5 w-3.5 text-primary" />
                      <span>
                        Did the flight happen? — <strong className="text-primary">{stName}</strong> ({ac?.reg ?? b.aircraftId})
                      </span>
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] text-primary">
                        {b.id}
                      </span>
                    </div>
                    <div className="num text-muted-foreground">
                      Student: <strong className="text-foreground">{stName}</strong> · Date: {format(new Date(b.start), "dd-MM-yyyy")} · Slot: {off}–{on} (
                      {fmtDec(mins)} h) · CFI: {ins?.name ?? "Solo"} · Post-{on} verification due
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Syncs exclusively to {stName}&apos;s electronic logbook
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleOpen({ booking: b, decision: "yes" })}
                      className="h-8 px-3.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                      Yes, {stName.split(" ")[0]} Flew
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpen({ booking: b, decision: "no" })}
                      className="h-8 border-destructive/45 bg-destructive/10 px-3.5 text-xs font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <XCircle className="mr-1 h-3.5 w-3.5" />
                      No, Did Not Fly
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showEmptyState && upcomingScheduled.length > 0 && (
          <div className="mt-5 border-t border-border/70 pt-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Upcoming Scheduled Bookings (Available for Early / Manual Post-Flight Check)
            </h4>
            <div className="divide-y divide-border/50">
              {upcomingScheduled.map((b) => {
                const st = lk.user(b.studentId);
                const ins = lk.user(b.instructorId);
                const ac = lk.aircraft(b.aircraftId);
                const off = format(new Date(b.start), "HH:mm");
                const on = format(new Date(b.end), "HH:mm");
                const mins = blockMinutes(off, on) || 120;
                return (
                  <div
                    key={b.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-2.5 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-foreground">
                        {st?.name ?? "Student"} · {ac?.reg ?? b.aircraftId}
                      </span>{" "}
                      <span className="num text-muted-foreground">
                        · {format(new Date(b.start), "dd-MM-yyyy")} {off}–{on} ({fmtDec(mins)} h) ·
                        CFI: {ins?.name ?? "Solo"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpen({ booking: b, decision: "yes" })}
                        className="h-7 px-3 text-[11px]"
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Yes, Flight Happened
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpen({ booking: b, decision: "no" })}
                        className="h-7 px-3 text-[11px] text-destructive"
                      >
                        <XCircle className="mr-1 h-3 w-3" /> No
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <PostFlightCompletionDialog state={dialogState} onClose={() => setDialogState(null)} />
    </>
  );
}
