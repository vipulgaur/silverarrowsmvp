import { useEffect, useMemo, useState, type FormEvent } from "react";
import { addHours, format } from "date-fns";
import { CloudSun, Compass, Thermometer, Wind } from "lucide-react";
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
import { activeUsers, prepareBooking, uid } from "@/lib/logic";
import { useStore } from "@/lib/store";
import { type Booking, type BookingReason, type BookingType } from "@/lib/types";
import {
  buildWeatherForBookingDate,
  enrichBookingWithWeather,
  extractIcaoFromRoute,
  fetchLiveAerodromeWeather,
  formatIndianDateTime,
} from "@/lib/weather";

export function BookingDialog({
  open,
  onOpenChange,
  initial,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<Booking>;
}) {
  const { data, me, saveBooking, log } = useStore();
  const students = activeUsers(data, "student");
  const instructors = activeUsers(data, "instructor");

  const defaultStart = format(addHours(new Date(), 2), "yyyy-MM-dd'T'HH:00");
  const defaultEnd = format(addHours(new Date(), 4), "yyyy-MM-dd'T'HH:00");

  const [aircraftId, setAircraftId] = useState(
    initial?.aircraftId ?? data.aircraft[0]?.id ?? "a-1",
  );
  const [studentId, setStudentId] = useState(
    initial?.studentId ?? (me?.role === "student" ? me.id : (students[0]?.id ?? "")),
  );
  const [instructorId, setInstructorId] = useState(
    initial?.instructorId ?? (me?.role === "instructor" ? me.id : (instructors[0]?.id ?? "")),
  );
  const [type, setType] = useState<BookingType>(initial?.type ?? "lesson");
  const [reason, setReason] = useState<BookingReason>(initial?.reason ?? "training");
  const [lessonId, setLessonId] = useState(initial?.lessonId ?? "");
  const [route, setRoute] = useState(initial?.route ?? "VIDP → VIDP");
  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setAircraftId(initial?.aircraftId ?? data.aircraft[0]?.id ?? "a-1");
      setStudentId(
        initial?.studentId ?? (me?.role === "student" ? me.id : (students[0]?.id ?? "")),
      );
      setInstructorId(
        initial?.instructorId ?? (me?.role === "instructor" ? me.id : (instructors[0]?.id ?? "")),
      );
      setType(initial?.type ?? "lesson");
      setReason(initial?.reason ?? "training");
      setLessonId(initial?.lessonId ?? "");
      setRoute(initial?.route ?? "VIDP → VIDP");
      setStart(
        initial?.start ? format(new Date(initial.start), "yyyy-MM-dd'T'HH:mm") : defaultStart,
      );
      setEnd(initial?.end ? format(new Date(initial.end), "yyyy-MM-dd'T'HH:mm") : defaultEnd);
      setNotes(initial?.notes ?? "");
    }
  }, [open, initial]);

  const routeIcao = useMemo(() => extractIcaoFromRoute(route), [route]);
  const previewCurrentWx = useMemo(
    () => initial?.weatherCurrent ?? buildWeatherForBookingDate(routeIcao, new Date().toISOString()),
    [initial?.weatherCurrent, routeIcao],
  );
  const previewForecastWx = useMemo(
    () =>
      buildWeatherForBookingDate(
        routeIcao,
        start ? new Date(start).toISOString() : new Date().toISOString(),
      ),
    [routeIcao, start],
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!me) return;

    const startIso = new Date(start).toISOString();
    const endIso = new Date(end).toISOString();

    const candidate: Booking = {
      id: initial?.id ?? `BK-${uid().slice(0, 4).toUpperCase()}`,
      aircraftId,
      studentId: type === "maintenance" ? undefined : studentId || undefined,
      instructorId:
        type === "solo" || type === "maintenance" ? undefined : instructorId || undefined,
      lessonId: lessonId || undefined,
      type,
      status: initial?.status ?? "scheduled",
      start: startIso,
      end: endIso,
      route: route.trim() || undefined,
      notes: notes.trim() || undefined,
      reason,
      weatherCurrent: previewCurrentWx,
      weatherForecast: previewForecastWx,
      ...(initial?.status === "completed"
        ? {
            weatherCompleted:
              initial?.weatherCompleted ??
              buildWeatherForBookingDate(routeIcao, new Date().toISOString()),
          }
        : {}),
    };

    const prepared = prepareBooking(candidate, me, data);
    if (typeof prepared === "string") {
      toast.error(prepared);
      return;
    }

    setBusy(true);
    try {
      let liveCurrent = previewCurrentWx;
      try {
        const liveRes = await fetchLiveAerodromeWeather(routeIcao);
        liveCurrent = liveRes.report;
      } catch {
        /* use deterministic fallback if offline */
      }

      const withWx = enrichBookingWithWeather({
        ...prepared,
        weatherCurrent: liveCurrent,
        weatherForecast: previewForecastWx,
      });

      await saveBooking(withWx);
      log(
        withWx.approvalStatus === "pending" ? "booking_requested" : "booking_scheduled",
        "booking",
        `${withWx.approvalStatus === "pending" ? "Requested" : "Scheduled"} booking ${withWx.id} (${withWx.type}) · Current WX [${liveCurrent.flightCategory} ${liveCurrent.qnhHpa}hPa] & Date Forecast [${previewForecastWx.flightCategory}] synced to DB`,
        withWx.id,
      );
      toast.success(
        withWx.approvalStatus === "pending"
          ? "Booking request submitted with current & forecast weather synced"
          : "Booking scheduled with current & booking-date weather recorded in database",
      );
      onOpenChange(false);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const allLessons = data.programs.flatMap((p) => p.lessons);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {me?.role === "student" ? "Request flight booking" : "Create flight booking"}
          </DialogTitle>
          <DialogDescription>
            {me?.role === "student"
              ? "Student bookings are created in pending status until approved by an administrator. Weather telemetry is automatically synced."
              : "Schedule aircraft, student, and instructor with automatic conflict, airworthiness, and weather telemetry sync."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 py-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Aircraft">
              <NativeSelect value={aircraftId} onChange={(e) => setAircraftId(e.target.value)}>
                {data.aircraft.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.reg} ({a.type})
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Booking type">
              <NativeSelect value={type} onChange={(e) => setType(e.target.value as BookingType)}>
                <option value="lesson">Dual lesson</option>
                <option value="solo">Solo flight</option>
                {me?.role !== "student" && <option value="maintenance">Maintenance block</option>}
              </NativeSelect>
            </Field>
          </div>

          {type !== "maintenance" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Student">
                <NativeSelect
                  value={studentId}
                  disabled={me?.role === "student"}
                  onChange={(e) => setStudentId(e.target.value)}
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
              {type !== "solo" && (
                <Field label="Instructor">
                  <NativeSelect
                    value={instructorId}
                    onChange={(e) => setInstructorId(e.target.value)}
                  >
                    {instructors.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </NativeSelect>
                </Field>
              )}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Syllabus lesson (optional)">
              <NativeSelect value={lessonId} onChange={(e) => setLessonId(e.target.value)}>
                <option value="">— None —</option>
                {allLessons.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.code} · {l.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Route (Aerodrome ICAO)">
              <Input
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                placeholder="VIDP → VIDP or VAJB → VAJB"
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Start time">
              <Input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                required
              />
            </Field>
            <Field label="End time">
              <Input
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                required
              />
            </Field>
          </div>

          <Field label="Notes (optional)">
            <Input
              placeholder="e.g. Circuit consolidation, crosswind practice"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Field>

          <div className="rounded-xl border border-sky-500/25 bg-sky-500/5 p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <CloudSun className="h-3.5 w-3.5 text-sky-500" />
                Auto-Synced Database Weather Record ({routeIcao})
              </span>
              <span className="text-[10px] text-muted-foreground">
                {formatIndianDateTime()}
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-border/70 bg-background/80 p-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    1. Current Condition (Now)
                  </span>
                  <Chip tone={previewCurrentWx.flightCategory === "VFR" ? "ok" : "warn"}>
                    {previewCurrentWx.flightCategory}
                  </Chip>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-foreground">
                  <span className="flex items-center gap-0.5">
                    <Wind className="h-3 w-3 text-sky-500" />
                    {previewCurrentWx.windDir}°/{previewCurrentWx.windSpeedKt}kt
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Thermometer className="h-3 w-3 text-amber-500" />
                    {previewCurrentWx.tempC}°C
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Compass className="h-3 w-3 text-emerald-500" />
                    Q{previewCurrentWx.qnhHpa}
                  </span>
                </div>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/80 p-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    2. Booking Date Forecast
                  </span>
                  <Chip tone={previewForecastWx.flightCategory === "VFR" ? "ok" : "warn"}>
                    {previewForecastWx.flightCategory}
                  </Chip>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-foreground">
                  <span className="flex items-center gap-0.5">
                    <Wind className="h-3 w-3 text-sky-500" />
                    {previewForecastWx.windDir}°/{previewForecastWx.windSpeedKt}kt
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Thermometer className="h-3 w-3 text-amber-500" />
                    {previewForecastWx.tempC}°C
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Compass className="h-3 w-3 text-emerald-500" />
                    Q{previewForecastWx.qnhHpa}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground">
              ✓ Both current and booking-date weather snapshots are automatically stored in the booking record. When the flight is completed on that day, completion-day weather is also recorded automatically.
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : me?.role === "student" ? "Submit request" : "Schedule booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
