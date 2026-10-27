import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  addDays,
  addMinutes,
  differenceInMinutes,
  format,
  isSameDay,
  parseISO,
  startOfWeek,
} from "date-fns";
import { toast } from "sonner";
import {
  ArrowRight,
  BellRing,
  Calendar as CalendarIcon,
  CalendarPlus,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  GripVertical,
  History,
  List,
  Move,
  PlaneTakeoff,
  X,
  XCircle,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Chip, Empty, Field, NativeSelect, PageHeader, Section } from "@/components/app-ui";
import { BookingDialog } from "@/components/booking-dialog";
import { BookingApprovals } from "@/components/booking-approvals";
import { FlightDialog } from "@/components/flight-dialog";
import {
  getPostFlightDueBookings,
  PostFlightCompletionDialog,
  PostFlightVerificationBanner,
} from "@/components/post-flight-prompt";
import { useLookup, useMe } from "@/lib/store";
import { blockMinutes, can, reviewRequest, uid, visibleTo } from "@/lib/logic";
import { reasonLabel, type Booking, type BookingType, type Reason } from "@/lib/types";

export const Route = createFileRoute("/_shell/schedule")({
  head: () => ({
    meta: [
      { title: "Bookings & 24h Weekly Calendar — SilverArrows" },
      {
        name: "description",
        content:
          "Microsoft Teams-style weekly 24-hour scrollable flight booking calendar with drag-to-reschedule admin approval workflow, past flight records, and automated post-flight logbook updates.",
      },
    ],
  }),
  component: SchedulePage,
});

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 56; // 56px per hour -> 1344px total 24h grid

interface PendingDragShift {
  booking: Booking;
  proposedStart: string; // ISO
  proposedEnd: string; // ISO
}

interface CalendarEventItem {
  id: string;
  kind: "booking" | "past_flight";
  start: Date;
  end: Date;
  booking?: Booking;
  flightId?: string;
  aircraftId?: string;
  studentId?: string;
  instructorId?: string;
  lessonId?: string;
  type: BookingType | "dual";
  status: "scheduled" | "completed" | "cancelled";
  approvalStatus?: "pending" | "approved" | "declined";
  route?: string;
  notes?: string;
  loggedMinutes?: number;
}

function SchedulePage() {
  const { data, me, update, saveBooking, commit, log } = useMe();
  const lk = useLookup();

  const [viewMode, setViewMode] = useState<"calendar" | "list" | "postflight">("calendar");
  const postFlightDueCount = me.role === "admin" ? getPostFlightDueBookings(data).length : 0;

  const [bookingOpen, setBookingOpen] = useState(false);
  const [editBooking, setEditBooking] = useState<Booking | undefined>(undefined);
  const [logFromBooking, setLogFromBooking] = useState<Booking | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventItem | null>(null);

  // Post-flight "Did the flight happen?" dialog state
  const [postFlightBooking, setPostFlightBooking] = useState<Booking | null>(null);
  const [postFlightDecision, setPostFlightDecision] = useState<"yes" | "no">("yes");

  // Filters
  const [aircraftFilter, setAircraftFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showPastRecords, setShowPastRecords] = useState(true);

  // Default week: start on the Monday of the week containing the most recent/active bookings (2026-10-19)
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const latestBooking = [...data.bookings].sort((a, b) => b.start.localeCompare(a.start))[0];
    const baseDate = latestBooking ? new Date(latestBooking.start) : new Date();
    return startOfWeek(baseDate, { weekStartsOn: 1 });
  });

  // Drag-and-drop state
  const [draggingBookingId, setDraggingBookingId] = useState<string | null>(null);
  const [dropTargetCell, setDropTargetCell] = useState<{ dayIdx: number; hour: number } | null>(
    null,
  );
  const [pendingShift, setPendingShift] = useState<PendingDragShift | null>(null);
  const [shiftStartInput, setShiftStartInput] = useState("");
  const [shiftEndInput, setShiftEndInput] = useState("");
  const [shiftReason, setShiftReason] = useState<Reason>("conflict");
  const [shiftMessage, setShiftMessage] = useState("");
  const [submittingShift, setSubmittingShift] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Scroll 24h grid to 07:00 on initial mount so daytime bookings are centered
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 7 * HOUR_HEIGHT;
    }
  }, []);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const bookings = useMemo(
    () =>
      visibleTo(me, data.bookings)
        .filter((b) => !aircraftFilter || b.aircraftId === aircraftFilter)
        .filter((b) => !statusFilter || b.status === statusFilter)
        .sort((a, b) => b.start.localeCompare(a.start)),
    [aircraftFilter, data.bookings, me, statusFilter],
  );

  // Combine bookings + historical logged flights (that don't already have a booking) into CalendarEventItems
  const calendarEvents = useMemo<CalendarEventItem[]>(() => {
    const nowMs = Date.now();
    const items: CalendarEventItem[] = bookings
      .filter((b) => {
        if (!showPastRecords) {
          const isPast = new Date(b.end).getTime() < nowMs || b.status === "completed";
          if (isPast) return false;
        }
        return true;
      })
      .map((b) => {
        const linkedFlight = data.flights.find((f) => f.bookingId === b.id);
        return {
          id: b.id,
          kind: "booking",
          start: new Date(b.start),
          end: new Date(b.end),
          booking: b,
          flightId: linkedFlight?.id,
          aircraftId: b.aircraftId,
          studentId: b.studentId,
          instructorId: b.instructorId,
          lessonId: b.lessonId,
          type: b.type,
          status: b.status,
          approvalStatus: b.approvalStatus,
          route: b.route,
          notes: b.notes,
          loggedMinutes: linkedFlight?.minutes,
        };
      });

    if (showPastRecords && (!statusFilter || statusFilter === "completed")) {
      const visibleFlights = visibleTo(me, data.flights).filter(
        (f) => !aircraftFilter || f.aircraftId === aircraftFilter,
      );
      for (const f of visibleFlights) {
        if (f.bookingId && data.bookings.some((b) => b.id === f.bookingId)) continue;
        const startStr = `${f.date}T${f.offBlock ?? "09:00"}:00`;
        const startDate = new Date(startStr);
        if (Number.isNaN(startDate.getTime())) continue;
        const endDate = addMinutes(startDate, f.minutes || 60);
        items.push({
          id: `FLT-CAL-${f.id}`,
          kind: "past_flight",
          start: startDate,
          end: endDate,
          flightId: f.id,
          aircraftId: f.aircraftId,
          studentId: f.pilotId,
          instructorId: f.instructorId,
          lessonId: f.lessonId,
          type: f.kind === "solo" ? "solo" : "dual",
          status: "completed",
          approvalStatus: "approved",
          notes: f.remarks,
          loggedMinutes: f.minutes,
        });
      }
    }

    return items;
  }, [aircraftFilter, bookings, data.bookings, data.flights, me, showPastRecords, statusFilter]);

  const pendingReschedules = data.requests.filter(
    (r) =>
      r.status === "pending" &&
      (me.role === "admin" ||
        (me.role === "instructor" && r.instructorId === me.id) ||
        (me.role === "student" && r.studentId === me.id)),
  );

  function cancelBooking(b: Booking) {
    update((d) => ({
      ...d,
      bookings: d.bookings.map((x) => (x.id === b.id ? { ...x, status: "cancelled" as const } : x)),
    }));
    log("booking_cancelled", "booking", `Cancelled booking ${b.id}`, b.id);
    toast.success(`Booking ${b.id} cancelled`);
  }

  function handleRescheduleDecision(id: string, decision: "approved" | "declined") {
    const r = data.requests.find((x) => x.id === id);
    if (!r) return;
    const err = commit(reviewRequest(data, id, me, decision));
    if (err) return void toast.error(err);
    log(
      `reschedule_${decision}`,
      "booking",
      `${decision === "approved" ? "Approved" : "Declined"} reschedule request ${id} for ${lk.user(r.studentId)?.name ?? r.studentId}`,
      r.bookingId,
    );
    toast.success(`Reschedule request ${decision}`);
  }

  // Open the Confirmation Message Dialog when a booking is dragged & dropped onto a new day/hour cell
  function initiateBookingShift(booking: Booking, targetDay: Date, targetHour: number) {
    const origStart = new Date(booking.start);
    const origEnd = new Date(booking.end);
    const durationMins = Math.max(30, differenceInMinutes(origEnd, origStart));

    const newStart = new Date(targetDay);
    newStart.setHours(targetHour, origStart.getMinutes(), 0, 0);
    const newEnd = addMinutes(newStart, durationMins);

    if (newStart.getTime() === origStart.getTime()) return;

    setPendingShift({
      booking,
      proposedStart: newStart.toISOString(),
      proposedEnd: newEnd.toISOString(),
    });
    setShiftStartInput(format(newStart, "yyyy-MM-dd'T'HH:mm"));
    setShiftEndInput(format(newEnd, "yyyy-MM-dd'T'HH:mm"));
    setShiftReason("conflict");
    setShiftMessage(
      `Shifted on weekly calendar from ${format(origStart, "dd MMM HH:mm")} to ${format(newStart, "dd MMM HH:mm")}`,
    );
  }

  async function confirmAndSendShiftForAdminApproval() {
    if (!pendingShift) return;
    const { booking } = pendingShift;
    const startDate = new Date(shiftStartInput);
    const endDate = new Date(shiftEndInput);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime()) ||
      endDate <= startDate
    ) {
      toast.error("Please enter a valid shifted start and end time.");
      return;
    }

    setSubmittingShift(true);
    try {
      const updatedBooking: Booking = {
        ...booking,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        approvalStatus: "pending",
        requestedBy: me.id,
        requestedAt: new Date().toISOString(),
        reason: shiftReason,
        notes: shiftMessage.trim() || booking.notes,
      };

      await saveBooking(updatedBooking);

      const reqId = `RQ-${uid()}`;
      update((d) => ({
        ...d,
        bookings: d.bookings.map((b) => (b.id === booking.id ? updatedBooking : b)),
        requests: [
          {
            id: reqId,
            bookingId: booking.id,
            studentId: booking.studentId ?? me.id,
            instructorId: booking.instructorId ?? me.id,
            proposedStart: startDate.toISOString(),
            proposedEnd: endDate.toISOString(),
            reason: shiftReason,
            notes: shiftMessage.trim(),
            details: shiftMessage.trim() || `Reschedule requested for ${booking.id}`,
            status: "pending",
            createdAt: new Date().toISOString(),
          },
          ...d.requests,
        ],
      }));

      log(
        "booking_shifted_for_approval",
        "booking",
        `Shifted booking ${booking.id} to ${format(startDate, "dd MMM yyyy HH:mm")}–${format(endDate, "HH:mm")} and sent to Administrator for approval`,
        booking.id,
      );

      toast.success(
        `Booking ${booking.id} shifted to ${format(startDate, "dd MMM HH:mm")} and sent to Admin for approval.`,
      );
      setPendingShift(null);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSubmittingShift(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly 24-Hour Dispatch Calendar & Bookings"
        subtitle="Drag and drop any scheduled booking to shift times (sends confirmation for Admin approval). View past flights and verify post-flight logbooks."
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-full border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                viewMode === "calendar"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" /> Weekly 24h Calendar
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-3.5 w-3.5" /> Table List ({bookings.length})
            </button>
            {me.role === "admin" && (
              <button
                type="button"
                onClick={() => setViewMode("postflight")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                  viewMode === "postflight"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BellRing className="h-3.5 w-3.5" /> Post-Flight Verification
                {postFlightDueCount > 0 && (
                  <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                    {postFlightDueCount}
                  </span>
                )}
              </button>
            )}
          </div>

          <Button
            onClick={() => {
              setEditBooking(undefined);
              setBookingOpen(true);
            }}
          >
            <CalendarPlus className="mr-1.5 h-4 w-4" />{" "}
            {me.role === "student" ? "Request booking" : "New booking"}
          </Button>
        </div>
      </PageHeader>

      <BookingApprovals />

      {pendingReschedules.length > 0 && (
        <Section
          title={`Pending time-shift & reschedule requests (${pendingReschedules.length})`}
          description="Requests created when a booking is dragged to a new time slot or submitted for rescheduling"
          className="mb-6"
        >
          <div className="divide-y">
            {pendingReschedules.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
              >
                <div>
                  <div className="font-medium">
                    {lk.user(r.studentId)?.name ?? "Student"} · Booking {r.bookingId}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Reason: {reasonLabel[r.reason]} · Proposed:{" "}
                    <span className="num font-semibold text-foreground">
                      {format(new Date(r.proposedStart), "dd MMM yyyy HH:mm")} –{" "}
                      {format(new Date(r.proposedEnd), "HH:mm")}
                    </span>{" "}
                    {r.notes ? `· "${r.notes}"` : ""}
                  </div>
                </div>
                {(me.role === "admin" || me.role === "instructor") && (
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => handleRescheduleDecision(r.id, "approved")}>
                      <Check className="mr-1 h-3.5 w-3.5" /> Approve Shift
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRescheduleDecision(r.id, "declined")}
                    >
                      <X className="mr-1 h-3.5 w-3.5" /> Decline
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Calendar Controls & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/85 p-3.5 shadow-xs backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setWeekStart((w) => addDays(w, -7))}
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-48 text-center text-sm font-bold text-foreground num">
            {format(weekDays[0], "dd MMM yyyy")} – {format(weekDays[6], "dd MMM yyyy")}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setWeekStart((w) => addDays(w, 7))}
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
          >
            Today
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              setWeekStart(startOfWeek(new Date("2026-10-19T09:00:00Z"), { weekStartsOn: 1 }))
            }
          >
            Oct 19 Dispatch Week
          </Button>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Jump to date:</span>
            <Input
              type="date"
              className="h-8 w-38 rounded-full text-xs num"
              value={format(weekStart, "yyyy-MM-dd")}
              onChange={(e) => {
                if (!e.target.value) return;
                const d = parseISO(e.target.value);
                if (!Number.isNaN(d.getTime())) {
                  setWeekStart(startOfWeek(d, { weekStartsOn: 1 }));
                }
              }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={showPastRecords ? "default" : "outline"}
            onClick={() => setShowPastRecords((v) => !v)}
          >
            <History className="mr-1.5 h-3.5 w-3.5" />
            {showPastRecords ? "Showing Past & Completed" : "Upcoming Only"}
          </Button>

          <NativeSelect
            className="w-38"
            value={aircraftFilter}
            onChange={(e) => setAircraftFilter(e.target.value)}
            aria-label="Filter by aircraft"
          >
            <option value="">All aircraft</option>
            {data.aircraft.map((a) => (
              <option key={a.id} value={a.id}>
                {a.reg} ({a.type})
              </option>
            ))}
          </NativeSelect>

          <NativeSelect
            className="w-36"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed / Past</option>
            <option value="cancelled">Cancelled</option>
          </NativeSelect>
        </div>
      </div>

      {/* Quick Jump Pills for Bookings in Other Weeks (e.g., newly created 10-11-2026 booking or past weeks) */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-muted-foreground">Quick jump to booking weeks:</span>
        {Array.from(
          new Map(
            calendarEvents.map((ev) => {
              const mon = startOfWeek(ev.start, { weekStartsOn: 1 });
              return [format(mon, "yyyy-MM-dd"), mon];
            }),
          ).entries(),
        )
          .sort((a, b) => b[0].localeCompare(a[0]))
          .slice(0, 6)
          .map(([key, mon]) => {
            const active = isSameDay(mon, weekStart);
            const count = calendarEvents.filter((ev) =>
              isSameDay(startOfWeek(ev.start, { weekStartsOn: 1 }), mon),
            ).length;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setWeekStart(mon)}
                className={`rounded-full border px-3 py-1 font-medium transition ${
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                Week of {format(mon, "dd MMM yyyy")} ({count})
              </button>
            );
          })}
      </div>

      {viewMode === "postflight" ? (
        <PostFlightVerificationBanner
          showEmptyState
          onSelectDecision={(st) => {
            setPostFlightBooking(st.booking);
            setPostFlightDecision(st.decision);
          }}
        />
      ) : viewMode === "calendar" ? (
        /* Microsoft Teams-Style Weekly 24-Hour Scrollable Calendar Grid */

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
          {/* Top Legend Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2.5 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Move className="h-3.5 w-3.5 text-primary-ink" />
                Drag any scheduled flight card onto a new hour/day to shift &amp; request Admin
                approval
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Scheduled Dual
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: "var(--booking-solo)" }}
                />{" "}
                Solo Slot
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Pending Admin Approval
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Past / Completed Flight
              </span>
            </div>
          </div>

          {/* Sticky 7-Day Column Header */}
          <div className="grid grid-cols-[68px_repeat(7,minmax(130px,1fr))] border-b border-border bg-card/95 backdrop-blur-md">
            <div className="flex flex-col items-center justify-center border-r border-border p-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Clock className="mb-0.5 h-3.5 w-3.5" />
              24h UTC
            </div>
            {weekDays.map((day, idx) => {
              const isToday = isSameDay(day, new Date());
              const dayEvents = calendarEvents.filter((ev) => isSameDay(ev.start, day));
              return (
                <div
                  key={idx}
                  className={`border-r border-border px-2.5 py-2.5 text-center last:border-r-0 ${
                    isToday ? "bg-primary/10" : ""
                  }`}
                >
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {format(day, "EEE")}
                  </div>
                  <div className="mt-0.5 flex items-center justify-center gap-1.5">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold num ${
                        isToday ? "bg-primary text-primary-foreground shadow-xs" : "text-foreground"
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                    <span className="text-xs text-muted-foreground">{format(day, "MMM")}</span>
                  </div>
                  {dayEvents.length > 0 && (
                    <div className="mt-1 text-[10px] font-medium text-primary-ink">
                      {dayEvents.length} {dayEvents.length === 1 ? "slot" : "slots"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Scrollable 24-Hour Body (00:00 to 23:00) */}
          <div
            ref={scrollContainerRef}
            className="max-h-[640px] overflow-y-auto overflow-x-auto select-none"
          >
            <div
              className="grid grid-cols-[68px_repeat(7,minmax(130px,1fr))] relative"
              style={{ height: `${24 * HOUR_HEIGHT}px` }}
            >
              {/* Left 24-Hour Gutter */}
              <div className="border-r border-border bg-muted/20">
                {HOURS.map((hr) => (
                  <div
                    key={hr}
                    style={{ height: `${HOUR_HEIGHT}px` }}
                    className="flex items-start justify-end border-b border-border/60 pr-2 pt-1 text-[11px] font-medium text-muted-foreground num"
                  >
                    {String(hr).padStart(2, "0")}:00
                  </div>
                ))}
              </div>

              {/* 7 Day Columns */}
              {weekDays.map((day, dayIdx) => {
                const dayEvents = calendarEvents.filter((ev) => isSameDay(ev.start, day));

                return (
                  <div
                    key={dayIdx}
                    className="relative border-r border-border last:border-r-0"
                    style={{ height: `${24 * HOUR_HEIGHT}px` }}
                  >
                    {/* 24 Hour Drop Cells */}
                    {HOURS.map((hr) => {
                      const isDropHover =
                        dropTargetCell?.dayIdx === dayIdx && dropTargetCell?.hour === hr;
                      return (
                        <div
                          key={hr}
                          style={{ height: `${HOUR_HEIGHT}px` }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (dropTargetCell?.dayIdx !== dayIdx || dropTargetCell?.hour !== hr) {
                              setDropTargetCell({ dayIdx, hour: hr });
                            }
                          }}
                          onDragLeave={() => {
                            if (dropTargetCell?.dayIdx === dayIdx && dropTargetCell?.hour === hr) {
                              setDropTargetCell(null);
                            }
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            setDropTargetCell(null);
                            const draggedId =
                              e.dataTransfer.getData("text/plain") || draggingBookingId;
                            setDraggingBookingId(null);
                            if (!draggedId) return;
                            const found = data.bookings.find((b) => b.id === draggedId);
                            if (found) {
                              initiateBookingShift(found, day, hr);
                            }
                          }}
                          onDoubleClick={() => {
                            setEditBooking(undefined);
                            setBookingOpen(true);
                          }}
                          className={`border-b border-border/50 transition-colors ${
                            isDropHover
                              ? "bg-primary/25 ring-2 ring-inset ring-primary"
                              : "hover:bg-accent/30"
                          }`}
                        />
                      );
                    })}

                    {/* Positioned Booking & Past Flight Cards */}
                    {dayEvents.map((ev, evIdx) => {
                      const startMins = ev.start.getHours() * 60 + ev.start.getMinutes();
                      const durationMins = Math.max(45, differenceInMinutes(ev.end, ev.start));
                      const topPx = (startMins / 60) * HOUR_HEIGHT;
                      const heightPx = Math.max(46, (durationMins / 60) * HOUR_HEIGHT - 2);

                      const ac = lk.aircraft(ev.aircraftId);
                      const st = lk.user(ev.studentId);
                      const ins = lk.user(ev.instructorId);
                      const isPastOrCompleted =
                        ev.status === "completed" ||
                        ev.kind === "past_flight" ||
                        ev.end.getTime() <= Date.now();
                      const isPendingApproval = ev.approvalStatus === "pending";
                      const isCancelled = ev.status === "cancelled";
                      const canDrag =
                        ev.kind === "booking" &&
                        ev.booking &&
                        ev.status === "scheduled" &&
                        (me.role === "admin" ||
                          me.id === ev.studentId ||
                          me.id === ev.instructorId);

                      // Offset slightly if multiple events share the same start hour
                      const overlappingIndex = dayEvents
                        .slice(0, evIdx)
                        .filter(
                          (other) => Math.abs(differenceInMinutes(other.start, ev.start)) < 60,
                        ).length;
                      const leftOffsetPct = overlappingIndex * 8;

                      return (
                        <div
                          key={ev.id}
                          draggable={Boolean(canDrag)}
                          onDragStart={(e) => {
                            if (!ev.booking) return;
                            e.dataTransfer.setData("text/plain", ev.booking.id);
                            e.dataTransfer.effectAllowed = "move";
                            setDraggingBookingId(ev.booking.id);
                          }}
                          onDragEnd={() => {
                            setDraggingBookingId(null);
                            setDropTargetCell(null);
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(ev);
                          }}
                          style={{
                            top: `${topPx}px`,
                            height: `${heightPx}px`,
                            left: `${4 + leftOffsetPct}px`,
                            right: "4px",
                          }}
                          className={`group absolute z-10 flex flex-col justify-between overflow-hidden rounded-xl border p-2 text-left text-[11px] shadow-sm transition-all hover:z-20 hover:shadow-md ${
                            canDrag ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
                          } ${
                            isCancelled
                              ? "border-destructive/40 bg-destructive/10 text-muted-foreground line-through opacity-75"
                              : isPendingApproval
                                ? "border-amber-500/60 bg-amber-500/15 text-foreground"
                                : ev.status === "completed" || ev.kind === "past_flight"
                                  ? "border-emerald-500/50 bg-emerald-500/15 text-foreground"
                                  : ev.type === "solo"
                                    ? "border-sky-500/60 bg-sky-500/15 text-foreground"
                                    : "border-primary/70 bg-primary/20 text-foreground"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 font-bold leading-tight">
                              <span className="truncate num">
                                {format(ev.start, "HH:mm")}–{format(ev.end, "HH:mm")} ·{" "}
                                {ac?.reg ?? ev.aircraftId}
                              </span>
                              {canDrag && (
                                <GripVertical className="h-3.5 w-3.5 shrink-0 opacity-60 group-hover:opacity-100" />
                              )}
                            </div>

                            <div className="mt-0.5 truncate font-medium text-foreground/90">
                              {st?.name ?? "Maintenance"}
                              {ins ? ` / ${ins.name.split(" ")[0]}` : ""}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-1 pt-0.5">
                            <span className="rounded-full bg-background/80 px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider">
                              {isPendingApproval
                                ? "Pending Admin"
                                : ev.status === "completed" || ev.kind === "past_flight"
                                  ? `Past · ${((ev.loggedMinutes ?? durationMins) / 60).toFixed(1)}h`
                                  : isPastOrCompleted
                                    ? "Verify Flight?"
                                    : ev.type}
                            </span>

                            {me.role === "admin" &&
                              ev.kind === "booking" &&
                              ev.status === "scheduled" &&
                              ev.type !== "maintenance" && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!ev.booking) return;
                                    setPostFlightBooking(ev.booking);
                                    setPostFlightDecision("yes");
                                  }}
                                  className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground shadow-2xs hover:opacity-90"
                                  title="Verify whether this flight happened and auto-update student logbook"
                                >
                                  Did flight happen?
                                </button>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Classic Dispatch Table View */
        <Section title={`Bookings & Past Dispatch Records (${bookings.length})`}>
          {bookings.length === 0 ? (
            <Empty
              title="No matching bookings"
              description="Create a booking to schedule a flight."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Aircraft</TableHead>
                  <TableHead>Type / Lesson</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => {
                  const ac = lk.aircraft(b.aircraftId);
                  const st = lk.user(b.studentId);
                  const ins = lk.user(b.instructorId);
                  const les = lk.lesson(b.lessonId);
                  return (
                    <TableRow key={b.id}>
                      <TableCell className="num text-xs">
                        <div className="font-semibold text-foreground">
                          {format(new Date(b.start), "dd MMM yyyy")}
                        </div>
                        <div className="text-muted-foreground">
                          {format(new Date(b.start), "HH:mm")} – {format(new Date(b.end), "HH:mm")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{ac?.reg ?? b.aircraftId}</span>
                        <div className="text-xs text-muted-foreground">{b.route ?? "Local"}</div>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize font-medium">{b.type}</span>
                        {les && (
                          <div className="text-xs text-muted-foreground">
                            {les.code} · {les.name}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{st?.name ?? "—"}</TableCell>
                      <TableCell>{ins?.name ?? "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Chip
                            tone={
                              b.status === "completed"
                                ? "ok"
                                : b.status === "cancelled"
                                  ? "expired"
                                  : "soon"
                            }
                          >
                            {b.status}
                          </Chip>
                          {b.approvalStatus && b.approvalStatus !== "approved" && (
                            <Chip tone={b.approvalStatus === "pending" ? "soon" : "expired"}>
                              {b.approvalStatus}
                            </Chip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                          {me.role === "admin" &&
                            b.status === "scheduled" &&
                            b.type !== "maintenance" && (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => {
                                  setPostFlightBooking(b);
                                  setPostFlightDecision("yes");
                                }}
                              >
                                <BellRing className="mr-1 h-3.5 w-3.5" /> Did flight happen?
                              </Button>
                            )}
                          {b.status === "scheduled" &&
                            b.approvalStatus !== "pending" &&
                            can.logFlight(me.role) &&
                            b.type !== "maintenance" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setLogFromBooking(b)}
                              >
                                <PlaneTakeoff className="mr-1 h-3.5 w-3.5" /> Log
                              </Button>
                            )}
                          {b.status === "scheduled" &&
                            (me.role === "admin" ||
                              me.id === b.studentId ||
                              me.id === b.instructorId) && (
                              <Button size="sm" variant="ghost" onClick={() => cancelBooking(b)}>
                                Cancel
                              </Button>
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
      )}

      {/* Drag-and-Drop Time Shift Confirmation Message Dialog */}
      <Dialog
        open={Boolean(pendingShift)}
        onOpenChange={(o) => {
          if (!o) setPendingShift(null);
        }}
      >
        <DialogContent className="max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Move className="h-5 w-5 text-primary-ink" />
              Confirm Booking Time Shift &amp; Send for Admin Approval
            </DialogTitle>
            <DialogDescription>
              You dragged booking{" "}
              <span className="font-semibold text-foreground">{pendingShift?.booking.id}</span> to a
              new time slot. Confirming this message will send the shifted schedule to the
              Administrator for approval.
            </DialogDescription>
          </DialogHeader>

          {pendingShift && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-muted/40 p-3.5">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Original Slot
                  </div>
                  <div className="mt-0.5 font-semibold text-foreground num">
                    {format(new Date(pendingShift.booking.start), "EEE dd MMM yyyy")}
                  </div>
                  <div className="text-muted-foreground num">
                    {format(new Date(pendingShift.booking.start), "HH:mm")} –{" "}
                    {format(new Date(pendingShift.booking.end), "HH:mm")}
                  </div>
                </div>

                <ArrowRight className="h-5 w-5 shrink-0 text-primary-ink" />

                <div className="text-right">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-primary-ink">
                    New Shifted Slot
                  </div>
                  <div className="mt-0.5 font-bold text-foreground num">
                    {shiftStartInput ? format(new Date(shiftStartInput), "EEE dd MMM yyyy") : "—"}
                  </div>
                  <div className="font-semibold text-primary-ink num">
                    {shiftStartInput ? format(new Date(shiftStartInput), "HH:mm") : "—"} –{" "}
                    {shiftEndInput ? format(new Date(shiftEndInput), "HH:mm") : "—"}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Shifted Start Time">
                  <Input
                    type="datetime-local"
                    value={shiftStartInput}
                    onChange={(e) => setShiftStartInput(e.target.value)}
                  />
                </Field>
                <Field label="Shifted End Time">
                  <Input
                    type="datetime-local"
                    value={shiftEndInput}
                    onChange={(e) => setShiftEndInput(e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Reason for Shifting Slot">
                <NativeSelect
                  value={shiftReason}
                  onChange={(e) => setShiftReason(e.target.value as Reason)}
                >
                  {(Object.keys(reasonLabel) as Reason[]).map((r) => (
                    <option key={r} value={r}>
                      {reasonLabel[r]}
                    </option>
                  ))}
                </NativeSelect>
              </Field>

              <Field label="Confirmation Message / Notes for Administrator">
                <Textarea
                  rows={2}
                  value={shiftMessage}
                  onChange={(e) => setShiftMessage(e.target.value)}
                  placeholder="Explain why this booking is being shifted to the new time..."
                />
              </Field>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingShift(null)}>
              Cancel Drag
            </Button>
            <Button
              disabled={submittingShift}
              onClick={() => void confirmAndSendShiftForAdminApproval()}
            >
              <Check className="mr-1.5 h-4 w-4" /> Confirm &amp; Send for Admin Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Calendar Event Detail & Actions Modal */}
      <Dialog
        open={Boolean(selectedEvent)}
        onOpenChange={(o) => {
          if (!o) setSelectedEvent(null);
        }}
      >
        <DialogContent className="max-w-md rounded-3xl">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between gap-2">
                  <span>
                    {lk.aircraft(selectedEvent.aircraftId)?.reg ?? selectedEvent.aircraftId} ·{" "}
                    {selectedEvent.type.toUpperCase()}
                  </span>
                  <Chip
                    tone={
                      selectedEvent.status === "completed"
                        ? "ok"
                        : selectedEvent.approvalStatus === "pending"
                          ? "soon"
                          : selectedEvent.status === "cancelled"
                            ? "expired"
                            : "none"
                    }
                  >
                    {selectedEvent.approvalStatus === "pending"
                      ? "Pending Admin Approval"
                      : selectedEvent.status}
                  </Chip>
                </DialogTitle>
                <DialogDescription className="num">
                  {format(selectedEvent.start, "EEEE, dd MMM yyyy · HH:mm")} –{" "}
                  {format(selectedEvent.end, "HH:mm")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2.5 rounded-2xl border border-border bg-muted/30 p-3.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student Pilot:</span>
                  <span className="font-semibold text-foreground">
                    {lk.user(selectedEvent.studentId)?.name ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Flight Instructor:</span>
                  <span className="font-semibold text-foreground">
                    {lk.user(selectedEvent.instructorId)?.name ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Syllabus Lesson:</span>
                  <span className="font-semibold text-foreground">
                    {lk.lesson(selectedEvent.lessonId)?.code
                      ? `${lk.lesson(selectedEvent.lessonId)?.code} · ${lk.lesson(selectedEvent.lessonId)?.name}`
                      : "General Sortie"}
                  </span>
                </div>
                {selectedEvent.route && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Route:</span>
                    <span className="font-semibold text-foreground">{selectedEvent.route}</span>
                  </div>
                )}
                {selectedEvent.loggedMinutes && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Logged Flight Duration:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 num">
                      {(selectedEvent.loggedMinutes / 60).toFixed(1)} h (
                      {selectedEvent.loggedMinutes} min)
                    </span>
                  </div>
                )}
                {selectedEvent.notes && (
                  <div className="border-t border-border pt-2 text-muted-foreground">
                    “{selectedEvent.notes}”
                  </div>
                )}
              </div>

              {/* Post-Flight Verification Box inside Event Detail for Admin */}
              {me.role === "admin" &&
                selectedEvent.kind === "booking" &&
                selectedEvent.booking &&
                selectedEvent.status === "scheduled" &&
                selectedEvent.type !== "maintenance" && (
                  <div className="rounded-2xl border border-primary/40 bg-primary/10 p-3.5 text-xs space-y-2">
                    <div className="font-bold text-foreground flex items-center gap-1.5">
                      <BellRing className="h-4 w-4 text-primary-ink" />
                      Post-Flight Verification: Did the flight happen?
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Click <strong>Yes</strong> to open the debrief message box and automatically
                      record this sortie in{" "}
                      {lk.user(selectedEvent.studentId)?.name ?? "the student"}&apos;s logbook, or{" "}
                      <strong>No</strong> to mark it cancelled.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={() => {
                          const b = selectedEvent.booking!;
                          setSelectedEvent(null);
                          setPostFlightBooking(b);
                          setPostFlightDecision("yes");
                        }}
                      >
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Yes, Flight Happened
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const b = selectedEvent.booking!;
                          setSelectedEvent(null);
                          setPostFlightBooking(b);
                          setPostFlightDecision("no");
                        }}
                      >
                        <XCircle className="mr-1 h-3.5 w-3.5" /> No
                      </Button>
                    </div>
                  </div>
                )}

              <DialogFooter className="flex-wrap gap-2">
                {selectedEvent.kind === "booking" &&
                  selectedEvent.booking &&
                  selectedEvent.status === "scheduled" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const b = selectedEvent.booking!;
                          setSelectedEvent(null);
                          initiateBookingShift(
                            b,
                            new Date(b.start),
                            Math.min(22, new Date(b.start).getHours() + 1),
                          );
                        }}
                      >
                        <Move className="mr-1 h-3.5 w-3.5" /> Shift Time
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          cancelBooking(selectedEvent.booking!);
                          setSelectedEvent(null);
                        }}
                      >
                        Cancel Booking
                      </Button>
                    </>
                  )}
                <Button size="sm" variant="ghost" onClick={() => setSelectedEvent(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BookingDialog
        open={bookingOpen}
        onOpenChange={(open) => {
          setBookingOpen(open);
          // When a new booking is created, automatically jump the weekly calendar to that booking's week
          if (!open && data.bookings.length > 0) {
            const newest = data.bookings[0];
            if (newest) {
              setWeekStart(startOfWeek(new Date(newest.start), { weekStartsOn: 1 }));
            }
          }
        }}
        initial={editBooking}
      />

      <PostFlightCompletionDialog
        booking={postFlightBooking}
        initialDecision={postFlightDecision}
        open={Boolean(postFlightBooking)}
        onOpenChange={(open) => {
          if (!open) setPostFlightBooking(null);
        }}
      />

      {logFromBooking && (
        <FlightDialog
          open={Boolean(logFromBooking)}
          onOpenChange={(o) => !o && setLogFromBooking(undefined)}
          initial={{
            bookingId: logFromBooking.id,
            date: format(new Date(logFromBooking.start), "yyyy-MM-dd"),
            offBlock: format(new Date(logFromBooking.start), "HH:mm"),
            onBlock: format(new Date(logFromBooking.end), "HH:mm"),
            aircraftId: logFromBooking.aircraftId,
            pilotId: logFromBooking.studentId,
            instructorId: logFromBooking.instructorId,
            lessonId: logFromBooking.lessonId,
            kind: logFromBooking.type === "solo" ? "solo" : "dual",
            minutes:
              blockMinutes(
                format(new Date(logFromBooking.start), "HH:mm"),
                format(new Date(logFromBooking.end), "HH:mm"),
              ) || 60,
          }}
        />
      )}
    </div>
  );
}
