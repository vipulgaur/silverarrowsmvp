import { useEffect, useState, type FormEvent } from "react";
import { format } from "date-fns";
import { CloudSun, Paperclip, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { Field, NativeSelect } from "@/components/app-ui";
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
import {
  activeUsers,
  blockMinutes,
  flightTimeParts,
  fmtDec,
  submitStudentFlightLog,
  uid,
} from "@/lib/logic";
import {
  fetchLiveAerodromeWeather,
  formatRemarksWithWeather,
} from "@/lib/weather";
import { useLookup, useStore } from "@/lib/store";
import type { Flight, FlightWeatherAttachment } from "@/lib/types";

export function FlightDialog({
  open,
  onOpenChange,
  initial,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<Flight>;
}) {
  const { data, me, saveFlight, commit, log } = useStore();
  const lk = useLookup();

  const pilots = [...activeUsers(data, "student"), ...activeUsers(data, "instructor")];
  const instructors = activeUsers(data, "instructor");
  const isStudent = me?.role === "student";

  const [date, setDate] = useState(initial?.date ?? format(new Date(), "yyyy-MM-dd"));
  const [offBlock, setOffBlock] = useState(initial?.offBlock ?? "10:00");
  const [onBlock, setOnBlock] = useState(initial?.onBlock ?? "11:00");
  const [fromIcao, setFromIcao] = useState(initial?.fromIcao ?? "EKAH");
  const [toIcao, setToIcao] = useState(initial?.toIcao ?? "EKAH");
  const [aircraftId, setAircraftId] = useState(
    initial?.aircraftId ?? data.aircraft[0]?.id ?? "a-1",
  );
  const [pilotId, setPilotId] = useState(
    initial?.pilotId ?? (isStudent && me ? me.id : (pilots[0]?.id ?? "")),
  );
  const [instructorId, setInstructorId] = useState(
    initial?.instructorId ??
      (me?.role === "instructor"
        ? me.id
        : isStudent && me?.instructorId
          ? me.instructorId
          : (instructors[0]?.id ?? "")),
  );
  const [kind, setKind] = useState<Flight["kind"]>(initial?.kind ?? "dual");
  const [lessonId, setLessonId] = useState(initial?.lessonId ?? "");
  const [minutes, setMinutes] = useState(
    String(
      initial?.minutes ??
        (initial?.offBlock && initial?.onBlock
          ? blockMinutes(initial.offBlock, initial.onBlock) || 60
          : 60),
    ),
  );
  const [dayMinutes, setDayMinutes] = useState(
    String(initial?.dayMinutes ?? initial?.minutes ?? 60),
  );
  const [nightMinutes, setNightMinutes] = useState(String(initial?.nightMinutes ?? 0));
  const [xcMinutes, setXcMinutes] = useState(String(initial?.xcMinutes ?? 0));
  const [ifrMinutes, setIfrMinutes] = useState(String(initial?.ifrMinutes ?? 0));
  const [multiEngineMinutes, setMultiEngineMinutes] = useState(
    String(initial?.multiEngineMinutes ?? 0),
  );
  const [landings, setLandings] = useState(String(initial?.landings ?? 3));
  const [nightLandings, setNightLandings] = useState(String(initial?.nightLandings ?? 0));
  const [grade, setGrade] = useState(initial?.grade ? String(initial.grade) : "4");
  const [remarks, setRemarks] = useState(initial?.remarks ?? "");
  const [weatherReport, setWeatherReport] = useState<FlightWeatherAttachment | undefined>(
    initial?.weatherReport,
  );
  const [fetchingWx, setFetchingWx] = useState(false);

  useEffect(() => {
    if (open) {
      const defaultMins =
        initial?.minutes ??
        (initial?.offBlock && initial?.onBlock
          ? blockMinutes(initial.offBlock, initial.onBlock) || 60
          : 60);
      const parts = initial?.minutes
        ? flightTimeParts(initial as Flight, data.aircraft)
        : {
            day: defaultMins,
            night: 0,
            xc: 0,
            ifr: 0,
            multi: 0,
          };

      setDate(initial?.date ?? format(new Date(), "yyyy-MM-dd"));
      setOffBlock(initial?.offBlock ?? "10:00");
      setOnBlock(initial?.onBlock ?? "11:00");
      setFromIcao(initial?.fromIcao ?? "EKAH");
      setToIcao(initial?.toIcao ?? "EKAH");
      setAircraftId(initial?.aircraftId ?? data.aircraft[0]?.id ?? "a-1");
      setPilotId(initial?.pilotId ?? (isStudent && me ? me.id : (pilots[0]?.id ?? "")));
      setInstructorId(
        initial?.instructorId ??
          (me?.role === "instructor"
            ? me.id
            : isStudent && me?.instructorId
              ? me.instructorId
              : (instructors[0]?.id ?? "")),
      );
      setKind(initial?.kind ?? "dual");
      setLessonId(initial?.lessonId ?? "");
      setMinutes(String(defaultMins));
      setDayMinutes(String(initial?.dayMinutes ?? parts.day));
      setNightMinutes(String(initial?.nightMinutes ?? parts.night));
      setXcMinutes(String(initial?.xcMinutes ?? parts.xc));
      setIfrMinutes(String(initial?.ifrMinutes ?? parts.ifr));
      setMultiEngineMinutes(String(initial?.multiEngineMinutes ?? parts.multi));
      setLandings(String(initial?.landings ?? 3));
      setNightLandings(String(initial?.nightLandings ?? 0));
      setGrade(initial?.grade ? String(initial.grade) : "4");
      setRemarks(initial?.remarks ?? "");
      setWeatherReport(initial?.weatherReport);
    }
  }, [open, initial]);

  async function handleAttachLiveWeather() {
    setFetchingWx(true);
    try {
      const res = await fetchLiveAerodromeWeather(fromIcao || "EKAH");
      setWeatherReport(res.report);
      setRemarks((prev) => formatRemarksWithWeather(prev, res.report));
      toast.success(`Attached ${res.report.icao} METAR/TAF (${res.report.flightCategory})`);
    } finally {
      setFetchingWx(false);
    }
  }

  function handleRemoveWeather() {
    setWeatherReport(undefined);
    setRemarks((prev) => prev.replace(/\s*\[WX:[^\]]+\]/g, "").trim());
  }

  function handleBlockTimeChange(nextOff: string, nextOn: string) {
    setOffBlock(nextOff);
    setOnBlock(nextOn);
    const computed = blockMinutes(nextOff, nextOn);
    if (computed > 0) {
      setMinutes(String(computed));
      const nightVal = Math.max(0, Math.min(computed, Number(nightMinutes) || 0));
      setDayMinutes(String(Math.max(0, computed - nightVal)));
    }
  }

  function handleDurationChange(val: string) {
    setMinutes(val);
    const total = Math.max(0, Number(val) || 0);
    const nightVal = Math.max(0, Math.min(total, Number(nightMinutes) || 0));
    setDayMinutes(String(Math.max(0, total - nightVal)));
  }

  function handleNightChange(val: string) {
    setNightMinutes(val);
    const total = Math.max(0, Number(minutes) || 0);
    const nightVal = Math.max(0, Math.min(total, Number(val) || 0));
    setDayMinutes(String(Math.max(0, total - nightVal)));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!me) return;
    const mins = Math.max(5, Number(minutes) || 60);
    const nightMins = Math.max(0, Math.min(mins, Number(nightMinutes) || 0));
    const dayMins = Math.max(0, mins - nightMins);
    const xcMins = Math.max(0, Math.min(mins, Number(xcMinutes) || 0));
    const ifrMins = Math.max(0, Math.min(mins, Number(ifrMinutes) || 0));
    const meMins = Math.max(0, Math.min(mins, Number(multiEngineMinutes) || 0));
    const ldg = Math.max(0, Number(landings) || 1);
    const nightLdg = Math.max(0, Number(nightLandings) || 0);
    const ac = lk.aircraft(aircraftId);
    const tachStart = initial?.tachStart ?? ac?.tachHours ?? 0;
    const tachEnd = Number((tachStart + mins / 60).toFixed(1));
    const parsedGrade = Number(grade) as 1 | 2 | 3 | 4 | 5;
    const finalRemarks = weatherReport
      ? formatRemarksWithWeather(remarks, weatherReport)
      : remarks.trim() || undefined;

    const flight: Flight = {
      id: initial?.id ?? `FL-${uid().slice(0, 4).toUpperCase()}`,
      bookingId: initial?.bookingId,
      date,
      offBlock,
      onBlock,
      aircraftId,
      pilotId: isStudent ? me.id : pilotId,
      instructorId: kind === "solo" && !instructorId ? undefined : instructorId || undefined,
      lessonId: lessonId || undefined,
      kind,
      fromIcao: (fromIcao || "EKAH").trim().toUpperCase(),
      toIcao: (toIcao || "EKAH").trim().toUpperCase(),
      tachStart,
      tachEnd,
      minutes: mins,
      dayMinutes: dayMins,
      nightMinutes: nightMins,
      xcMinutes: xcMins,
      ifrMinutes: ifrMins,
      multiEngineMinutes: meMins,
      landings: ldg,
      nightLandings: nightLdg > 0 ? nightLdg : undefined,
      grade: !isStudent && parsedGrade >= 1 && parsedGrade <= 5 ? parsedGrade : initial?.grade,
      remarks: finalRemarks,
      weatherReport,
    };

    if (isStudent) {
      const err = commit(submitStudentFlightLog(data, me, flight));
      if (err) {
        toast.error(err);
        return;
      }
      log(
        "flight_submitted",
        "flight",
        `Submitted flight log ${flight.id} (${fmtDec(mins)} h ${kind} in ${ac?.reg ?? aircraftId}) for instructor verification`,
        flight.id,
      );
      toast.success("Flight log submitted for instructor verification");
      onOpenChange(false);
      return;
    }

    saveFlight({
      ...flight,
      verificationStatus: "verified",
      verifiedBy: me.id,
      verifiedAt: new Date().toISOString(),
    });
    const pilotName = lk.user(flight.pilotId)?.name ?? flight.pilotId;
    log(
      "flight_logged",
      "flight",
      `Logged ${fmtDec(mins)} h (${kind}) for ${pilotName} in ${ac?.reg ?? aircraftId}`,
      flight.id,
    );
    toast.success("Flight logged and airframe hours updated");
    onOpenChange(false);
  }

  const allLessons = data.programs.flatMap((p) => p.lessons);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isStudent ? "Submit flight log entry" : "Log flight & debrief"}
          </DialogTitle>
          <DialogDescription>
            {isStudent
              ? "Submit a flight log entry or correction. Submitted hours are marked Pending Verification until verified by your instructor."
              : "Record flight duration, aerodromes, day/night/XC/instrument breakdown, landings, syllabus grade, and instructor remarks."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 py-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Flight date">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </Field>
            <Field label="Aircraft (Reg & Type)">
              <NativeSelect value={aircraftId} onChange={(e) => setAircraftId(e.target.value)}>
                {data.aircraft.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.reg} ({a.type})
                  </option>
                ))}
              </NativeSelect>
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Pilot / Student">
              <NativeSelect
                value={isStudent && me ? me.id : pilotId}
                disabled={isStudent}
                onChange={(e) => setPilotId(e.target.value)}
              >
                {pilots.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Flight type">
              <NativeSelect
                value={kind}
                onChange={(e) => setKind(e.target.value as Flight["kind"])}
              >
                <option value="dual">Dual</option>
                <option value="solo">Solo</option>
                <option value="pic">PIC</option>
                <option value="sim">Simulator</option>
              </NativeSelect>
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Instructor">
              <NativeSelect
                value={instructorId}
                onChange={(e) => setInstructorId(e.target.value)}
              >
                <option value="">— Solo / No instructor —</option>
                {instructors.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Syllabus lesson">
              <NativeSelect value={lessonId} onChange={(e) => setLessonId(e.target.value)}>
                <option value="">— Free / non-syllabus flight —</option>
                {allLessons.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.code} · {l.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <Field label="Departure ICAO">
              <Input
                value={fromIcao}
                onChange={(e) => setFromIcao(e.target.value.toUpperCase())}
                placeholder="EKAH"
                maxLength={6}
                required
              />
            </Field>
            <Field label="Arrival ICAO">
              <Input
                value={toIcao}
                onChange={(e) => setToIcao(e.target.value.toUpperCase())}
                placeholder="EKAH"
                maxLength={6}
                required
              />
            </Field>
            <Field label="Off-block (Dep)">
              <Input
                type="time"
                value={offBlock}
                onChange={(e) => handleBlockTimeChange(e.target.value, onBlock)}
                required
              />
            </Field>
            <Field label="On-block (Arr)">
              <Input
                type="time"
                value={onBlock}
                onChange={(e) => handleBlockTimeChange(offBlock, e.target.value)}
                required
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Total duration (min)">
              <Input
                type="number"
                min={5}
                max={600}
                value={minutes}
                onChange={(e) => handleDurationChange(e.target.value)}
                required
              />
            </Field>
            <Field label="Day minutes">
              <Input
                type="number"
                min={0}
                max={600}
                value={dayMinutes}
                onChange={(e) => setDayMinutes(e.target.value)}
              />
            </Field>
            <Field label="Night minutes">
              <Input
                type="number"
                min={0}
                max={600}
                value={nightMinutes}
                onChange={(e) => handleNightChange(e.target.value)}
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Cross-country (min)">
              <Input
                type="number"
                min={0}
                max={600}
                value={xcMinutes}
                onChange={(e) => setXcMinutes(e.target.value)}
              />
            </Field>
            <Field label="Instrument / IFR (min)">
              <Input
                type="number"
                min={0}
                max={600}
                value={ifrMinutes}
                onChange={(e) => setIfrMinutes(e.target.value)}
              />
            </Field>
            <Field label="Multi-engine (min)">
              <Input
                type="number"
                min={0}
                max={600}
                value={multiEngineMinutes}
                onChange={(e) => setMultiEngineMinutes(e.target.value)}
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Day landings">
              <Input
                type="number"
                min={0}
                max={50}
                value={landings}
                onChange={(e) => setLandings(e.target.value)}
                required
              />
            </Field>
            <Field label="Night landings">
              <Input
                type="number"
                min={0}
                max={50}
                value={nightLandings}
                onChange={(e) => setNightLandings(e.target.value)}
              />
            </Field>
            {!isStudent && (
              <Field label="Grade (1–5)">
                <NativeSelect value={grade} onChange={(e) => setGrade(e.target.value)}>
                  <option value="5">5 — Exemplary</option>
                  <option value="4">4 — Proficient</option>
                  <option value="3">3 — Satisfactory</option>
                  <option value="2">2 — Needs practice</option>
                  <option value="1">1 — Unsatisfactory</option>
                </NativeSelect>
              </Field>
            )}
          </div>

          {/* METAR / TAF Weather Attachment Block */}
          <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <CloudSun className="h-4 w-4 text-primary" />
                <span>Aerodrome Weather Attachment ({fromIcao || "EKAH"})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void handleAttachLiveWeather()}
                  disabled={fetchingWx}
                  className="h-7 gap-1.5 px-2.5 text-xs"
                  data-testid="dialog-attach-weather-btn"
                >
                  {fetchingWx ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : (
                    <Paperclip className="h-3 w-3" />
                  )}
                  <span>{weatherReport ? "Refresh METAR/TAF" : "Attach Live METAR/TAF"}</span>
                </Button>
                {weatherReport && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={handleRemoveWeather}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    title="Remove attached weather"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>

            {weatherReport ? (
              <div className="space-y-1 text-[11px] font-mono">
                <div className="text-foreground font-semibold">
                  {weatherReport.flightCategory} · Wind {String(weatherReport.windDir).padStart(3, "0")}°/
                  {weatherReport.windSpeedKt}kt · Temp {weatherReport.tempC}°C · QNH{" "}
                  {weatherReport.qnhHpa} hPa
                </div>
                <div className="text-muted-foreground break-all">{weatherReport.metar}</div>
                <div className="text-muted-foreground break-all">{weatherReport.taf}</div>
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Click &ldquo;Attach Live METAR/TAF&rdquo; to query current conditions for{" "}
                {fromIcao || "EKAH"} and bind the official observation to this flight log.
              </p>
            )}
          </div>

          <Field label={isStudent ? "Flight notes / remarks" : "Instructor remarks"}>
            <Input
              placeholder="Debrief summary, route notes, and airmanship remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </Field>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isStudent ? "Submit for verification" : "Save verified flight log"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
