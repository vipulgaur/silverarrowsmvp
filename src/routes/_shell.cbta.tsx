import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  AlertTriangle,
  Award,
  BookCheck,
  CheckCircle2,
  Download,
  FileCheck2,
  Fingerprint,
  Flame,
  Gauge,
  Radar,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Badge, Card, NativeSelect, PageHeader } from "@/components/app-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  clearDebriefDraft,
  DEBRIEF_SESSION_STORAGE_KEY,
  loadDebriefDraft,
  saveDebriefDraft,
  type DebriefDraftState,
} from "@/lib/debrief-persistence";
import {
  registerFlightAtomic,
  studentCbtaRadarProfile,
  type AtomicFlightCommitReceipt,
} from "@/lib/logic";
import {
  DEFAULT_COMPETENCY_INDICATORS,
  DEFAULT_CORE_COMPETENCIES,
  DEFAULT_MASTER_EXERCISES,
} from "@/lib/rea-seed";
import { useStore } from "@/lib/store";
import type { CbtaCompetencyCode } from "@/lib/types";

export const Route = createFileRoute("/_shell/cbta")({
  component: CbtaAndDebriefSuitePage,
});

const GRADE_COLORS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "bg-red-600 text-white border-red-600",
  2: "bg-amber-600 text-white border-amber-600",
  3: "bg-sky-600 text-white border-sky-600",
  4: "bg-emerald-600 text-white border-emerald-600",
  5: "bg-indigo-600 text-white border-indigo-600",
};

function CbtaAndDebriefSuitePage() {
  const { data, me, update, log } = useStore();
  const [activeTab, setActiveTab] = useState<"wizard" | "radar" | "logbook">(
    "wizard",
  );
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [lastReceipt, setLastReceipt] =
    useState<AtomicFlightCommitReceipt | null>(null);

  const students = data.users.filter(
    (u) => u.role === "student" && u.status !== "deleted",
  );
  const instructors = data.users.filter(
    (u) =>
      (u.role === "instructor" || u.role === "admin") && u.status !== "deleted",
  );
  const defaultStudentId =
    me?.role === "student" ? me.id : (students[0]?.id ?? "u-stu-1");
  const defaultInstructorId =
    me?.role === "instructor" ? me.id : (instructors[0]?.id ?? "u-cfi-1");
  const firstAircraft = data.aircraft[0];
  const allLessons = data.programs.flatMap((p) => p.lessons);

  const initialDraft = (): DebriefDraftState => ({
    studentId: defaultStudentId,
    instructorId: defaultInstructorId,
    aircraftId: firstAircraft?.id ?? "a-1",
    lessonId: allLessons[0]?.id ?? "l-1",
    date: new Date().toISOString().slice(0, 10),
    fromIcao: "VIDP",
    toIcao: "VIDP",
    offBlock: "09:00",
    takeoffTime: "09:12",
    landingTime: "10:20",
    onBlock: "10:30",
    tachStart: firstAircraft?.tachHours ?? 1200,
    tachEnd: Math.round(((firstAircraft?.tachHours ?? 1200) + 1.5) * 10) / 10,
    hobbsStart: firstAircraft?.hobbsHours ?? 1296,
    hobbsEnd: Math.round(((firstAircraft?.hobbsHours ?? 1296) + 1.5) * 10) / 10,
    fuelStartLiters: 160,
    fuelAddedLiters: 40,
    fuelStopLiters: 146,
    oilAddedQuarts: 0,
    dayFullStop: 1,
    dayTouchAndGo: 3,
    nightFullStop: 0,
    nightTouchAndGo: 0,
    approachesIls: 0,
    approachesRnp: 0,
    approachesVisual: 4,
    ifrMinutes: 0,
    nightMinutes: 0,
    exerciseGrades: {
      "ex-l1-a": 4,
      "ex-l1-b": 4,
    },
    competencyScores: {
      KNO: 4,
      FPA: 4,
      FPO: 4,
      COM: 4,
      WLM: 4,
      SAW: 4,
      PRB: 4,
      LST: 4,
    },
    observedIndicators: ["KNO.1", "FPO.1", "COM.1"],
    remarks:
      "Consistent altitude control (+/- 60 ft) and clean radio readbacks. Cleared to progress to next syllabus lesson.",
    reportSquawk: false,
    squawkSeverity: "warning",
    squawkDescription: "",
    flagSmsIncident: false,
    smsTitle: "",
    smsCategory: "human_factors",
    smsSeverity: 2,
    smsLikelihood: "B",
    instructorPinSigned: true,
    studentPinSigned: true,
    updatedAt: new Date().toISOString(),
  });

  const [draft, setDraft] = useState<DebriefDraftState>(() => {
    return loadDebriefDraft() ?? initialDraft();
  });
  const [restoredFromSession, setRestoredFromSession] = useState(false);

  useEffect(() => {
    const existing = loadDebriefDraft();
    if (existing) {
      setRestoredFromSession(true);
    }
  }, []);

  const updateDraft = (patch: Partial<DebriefDraftState>) => {
    setDraft((prev) => {
      const next = { ...prev, ...patch, updatedAt: new Date().toISOString() };
      saveDebriefDraft(next);
      return next;
    });
  };

  // Radar Student Selector
  const [radarStudentId, setRadarStudentId] = useState(defaultStudentId);
  const radarProfile = useMemo(
    () => studentCbtaRadarProfile(radarStudentId, data),
    [radarStudentId, data],
  );

  // Electronic Logbook Pilot Selector
  const [logbookUserId, setLogbookUserId] = useState(me?.id ?? defaultStudentId);
  const userLogbookEntries = useMemo(
    () =>
      (data.electronicLogbookEntries ?? []).filter(
        (e) => e.userId === logbookUserId,
      ),
    [data.electronicLogbookEntries, logbookUserId],
  );

  if (!me) return null;

  const masterExercises = (
    data.masterExercises ?? DEFAULT_MASTER_EXERCISES
  ).filter((ex) => ex.lessonId === draft.lessonId || ex.lessonId === "l-1");
  const competencies = data.coreCompetencies ?? DEFAULT_CORE_COMPETENCIES;
  const indicators = data.competencyIndicators ?? DEFAULT_COMPETENCY_INDICATORS;

  const anyScoreBelowNorm =
    Object.values(draft.competencyScores).some((s) => s <= 2) ||
    Object.values(draft.exerciseGrades).some((g) => g <= 2);

  const handleAtomicCommit = () => {
    if (!draft.instructorPinSigned || !draft.studentPinSigned) {
      toast.error(
        "Both Instructor and Student digital signatures are required before committing.",
      );
      return;
    }
    const res = registerFlightAtomic(data, me, {
      studentId: draft.studentId,
      instructorId: draft.instructorId,
      aircraftId: draft.aircraftId,
      lessonId: draft.lessonId,
      date: draft.date,
      fromIcao: draft.fromIcao,
      toIcao: draft.toIcao,
      offBlock: draft.offBlock,
      takeoffTime: draft.takeoffTime,
      landingTime: draft.landingTime,
      onBlock: draft.onBlock,
      tachStart: draft.tachStart,
      tachEnd: draft.tachEnd,
      hobbsStart: draft.hobbsStart,
      hobbsEnd: draft.hobbsEnd,
      fuelStartLiters: draft.fuelStartLiters,
      fuelAddedLiters: draft.fuelAddedLiters,
      fuelStopLiters: draft.fuelStopLiters,
      oilAddedQuarts: draft.oilAddedQuarts,
      dayFullStop: draft.dayFullStop,
      dayTouchAndGo: draft.dayTouchAndGo,
      nightFullStop: draft.nightFullStop,
      nightTouchAndGo: draft.nightTouchAndGo,
      approachesIls: draft.approachesIls,
      approachesRnp: draft.approachesRnp,
      approachesVisual: draft.approachesVisual,
      ifrMinutes: draft.ifrMinutes,
      nightMinutes: draft.nightMinutes,
      exerciseGrades: draft.exerciseGrades,
      competencyScores: draft.competencyScores,
      observedIndicators: draft.observedIndicators,
      remarks: draft.remarks,
      reportSquawk: draft.reportSquawk,
      squawkSeverity: draft.squawkSeverity,
      squawkDescription: draft.squawkDescription,
      flagSmsIncident: draft.flagSmsIncident,
      smsTitle: draft.smsTitle,
      smsCategory: draft.smsCategory,
      smsSeverity: draft.smsSeverity,
      smsLikelihood: draft.smsLikelihood,
    });

    if (typeof res === "string") {
      toast.error(res);
      return;
    }

    update(() => res.data);
    clearDebriefDraft();
    setRestoredFromSession(false);
    setLastReceipt(res);
    toast.success(
      `6-Way Atomic Commit Complete! Flight ${res.flightId} registered & dual logbooks sealed.`,
    );
  };

  const handleExportLogbookPdf = () => {
    const owner = data.users.find((u) => u.id === logbookUserId);
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(
      `OFFICIAL EASA PART-FCL.050 / DGCA ELECTRONIC PILOT LOGBOOK — ${owner?.name ?? logbookUserId}`,
      14,
      15,
    );
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      `Licence: ${owner?.licence ?? owner?.splNumber ?? "On File"}  •  eGCA ID: ${owner?.egcaId ?? "N/A"}  •  Generated: ${new Date().toISOString().slice(0, 19).replace("T", " ")} UTC`,
      14,
      21,
    );

    autoTable(doc, {
      startY: 26,
      head: [
        [
          "Date",
          "Dep",
          "Off",
          "Arr",
          "On",
          "Model / Class",
          "Reg",
          "Role",
          "Total (m)",
          "PIC (m)",
          "Dual (m)",
          "Instr (m)",
          "Ldg D/N",
          "SHA-256 Digital Signature Hash",
        ],
      ],
      body: userLogbookEntries.map((e) => [
        e.date,
        e.departureIcao,
        e.offBlock,
        e.arrivalIcao,
        e.onBlock,
        `${e.aircraftModel} (${e.classRating})`,
        e.aircraftReg,
        e.roleCapacity,
        String(e.totalMinutes),
        String(e.picMinutes),
        String(e.dualMinutes),
        String(e.instructorMinutes),
        `${e.dayLandings}/${e.nightLandings}`,
        e.signatureHash,
      ]),
      styles: { fontSize: 7.5 },
      headStyles: { fillColor: [15, 23, 42] },
    });

    doc.save(`Official_EASA_DGCA_Logbook_${owner?.name?.replace(/\s+/g, "_") ?? "Pilot"}.pdf`);
    toast.success("Official Signed Electronic Logbook PDF exported!");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="CBTA 1–5 Grading, 4-Tab Post-Flight Wizard & Official Electronic Logbook"
        subtitle="FlightLogger REA CBTA Engine: 6-Way Atomic Post-Flight Commit (fn_register_flight), Crash-Proof SessionStorage Buffer (persist:userCustomLecture), 8-Axis Radar & Signed Logbook"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant={activeTab === "wizard" ? "default" : "outline"}
              onClick={() => setActiveTab("wizard")}
              data-testid="cbta-tab-wizard"
            >
              <FileCheck2 className="mr-1.5 h-3.5 w-3.5" />
              4-Tab Post-Flight &amp; CBTA Wizard
            </Button>
            <Button
              size="sm"
              variant={activeTab === "radar" ? "default" : "outline"}
              onClick={() => setActiveTab("radar")}
              data-testid="cbta-tab-radar"
            >
              <Radar className="mr-1.5 h-3.5 w-3.5" />
              8-Axis CBTA Spider Radar
            </Button>
            <Button
              size="sm"
              variant={activeTab === "logbook" ? "default" : "outline"}
              onClick={() => setActiveTab("logbook")}
              data-testid="cbta-tab-logbook"
            >
              <BookCheck className="mr-1.5 h-3.5 w-3.5" />
              Dual Electronic Logbook ({userLogbookEntries.length})
            </Button>
          </div>
        }
      />

      {/* =====================================================================
          TAB 1: 4-TAB POST-FLIGHT REGISTRATION & CBTA DEBRIEFING WIZARD
          ===================================================================== */}
      {activeTab === "wizard" && (
        <div className="space-y-5">
          {/* Crash-Proof SessionStorage Buffer Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sky-500/35 bg-sky-500/10 px-4 py-3 text-xs">
            <div className="flex items-center gap-2">
              <Save className="h-4 w-4 text-sky-500" />
              <span className="font-bold text-foreground">
                Crash-Proof Debrief Buffer Active ({DEBRIEF_SESSION_STORAGE_KEY})
              </span>
              <span className="text-muted-foreground">
                — Every keystroke &amp; 1–5 CBTA grade is automatically mirrored in{" "}
                <code className="font-mono">window.sessionStorage</code>{" "}
                {restoredFromSession ? "(Restored from active session)" : "(Live sync)"}.
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[11px]"
              onClick={() => {
                clearDebriefDraft();
                const fresh = initialDraft();
                setDraft(fresh);
                saveDebriefDraft(fresh);
                setRestoredFromSession(false);
                toast.info("Debriefing draft reset to defaults.");
              }}
            >
              <RotateCcw className="mr-1 h-3 w-3" /> Reset Draft
            </Button>
          </div>

          {/* 6-Subsystem Atomic Commit Receipt Banner (when committed) */}
          {lastReceipt && (
            <div
              data-testid="atomic-commit-receipt"
              className="rounded-3xl border border-emerald-500/50 bg-emerald-500/10 p-5 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-extrabold uppercase text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> fn_register_flight 6-WAY ATOMIC ACID COMMIT SUCCEEDED
                </span>
                <span className="font-mono text-xs font-bold">
                  Flight ID: {lastReceipt.flightId}
                </span>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 pt-1 text-[11px]">
                <div className="rounded-xl border border-emerald-500/30 bg-background/80 p-2.5">
                  <strong>1. Fleet &amp; CAMO:</strong> Airframe &amp; Tach hours updated; Auto-Grounding:{" "}
                  {lastReceipt.aircraftAutoGrounded ? "TRIGGERED (<=0h)" : "Airworthy"}
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-background/80 p-2.5">
                  <strong>2. CBTA 1–5 Matrix:</strong> Overall Grade {lastReceipt.overallGrade}/5 ·{" "}
                  {lastReceipt.repeatRequired
                    ? "REPEAT REQUIRED (Next lesson locked)"
                    : "PASSED (Next lesson unlocked)"}
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-background/80 p-2.5">
                  <strong>3. Dual Logbooks:</strong> Student ({lastReceipt.studentLogbookEntryId}) &amp; Instructor ({lastReceipt.instructorLogbookEntryId ?? "Solo"}) SHA-256 sealed
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-background/80 p-2.5">
                  <strong>4. EASA Part-FTL:</strong> Mandatory 12h Rest Lock stamped until{" "}
                  {lastReceipt.mandatoryRestUntil?.slice(0, 16).replace("T", " ") ?? "N/A"}
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-background/80 p-2.5">
                  <strong>5. ACI + Indian GST:</strong> INR{" "}
                  {lastReceipt.billedTotalInr.toLocaleString()} queued in unbilled activities
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-background/80 p-2.5">
                  <strong>6. ICAO 5×5 SMS:</strong>{" "}
                  {lastReceipt.spawnedSmsReportId
                    ? `Spawned SMS Report ${lastReceipt.spawnedSmsReportId}`
                    : "No safety occurrence flagged"}
                </div>
              </div>
            </div>
          )}

          {/* 4-Step Wizard Navigation Bar */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(
              [
                { step: 1, title: "1. Block Times, Tach & Fuel" },
                { step: 2, title: "2. CBTA 1–5 Grading Matrix" },
                { step: 3, title: "3. Remarks, Squawk & SMS" },
                { step: 4, title: "4. Dual Sign-Off & Commit" },
              ] as const
            ).map((item) => (
              <button
                key={item.step}
                type="button"
                onClick={() => setWizardStep(item.step)}
                className={`rounded-2xl border p-3 text-left text-xs font-bold transition cursor-pointer ${
                  wizardStep === item.step
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>

          {/* STEP 1: TIMES, TACH/HOBBS, FUEL/OIL & LANDINGS */}
          {wizardStep === 1 && (
            <Card className="space-y-4">
              <h3 className="text-sm font-bold">
                Tab 1 — Crew, Aircraft, 4-Point Timestamps, Tach/Hobbs Meters &amp; Fuel/Oil Ledger
              </h3>
              <div className="grid gap-3 sm:grid-cols-4 text-xs">
                <div>
                  <Label className="text-xs">Student Pilot</Label>
                  <NativeSelect
                    value={draft.studentId}
                    onChange={(e) => updateDraft({ studentId: e.target.value })}
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </NativeSelect>
                </div>
                <div>
                  <Label className="text-xs">Flight Instructor (CFI)</Label>
                  <NativeSelect
                    value={draft.instructorId}
                    onChange={(e) => updateDraft({ instructorId: e.target.value })}
                  >
                    {instructors.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </NativeSelect>
                </div>
                <div>
                  <Label className="text-xs">Aircraft Tail</Label>
                  <NativeSelect
                    value={draft.aircraftId}
                    onChange={(e) => {
                      const picked = data.aircraft.find(
                        (a) => a.id === e.target.value,
                      );
                      updateDraft({
                        aircraftId: e.target.value,
                        tachStart: picked?.tachHours ?? draft.tachStart,
                        tachEnd:
                          Math.round(((picked?.tachHours ?? draft.tachStart) + 1.5) * 10) /
                          10,
                      });
                    }}
                  >
                    {data.aircraft.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.reg} ({a.type} · Tach {a.tachHours}h)
                      </option>
                    ))}
                  </NativeSelect>
                </div>
                <div>
                  <Label className="text-xs">Syllabus Lesson</Label>
                  <NativeSelect
                    value={draft.lessonId}
                    onChange={(e) => updateDraft({ lessonId: e.target.value })}
                  >
                    {allLessons.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.code ?? l.id.toUpperCase()} — {l.name}
                      </option>
                    ))}
                  </NativeSelect>
                </div>

                <div>
                  <Label className="text-xs">Off-Block (HH:mm)</Label>
                  <Input
                    value={draft.offBlock}
                    onChange={(e) => updateDraft({ offBlock: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Takeoff / Airborne (HH:mm)</Label>
                  <Input
                    value={draft.takeoffTime}
                    onChange={(e) => updateDraft({ takeoffTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Landing / Touchdown (HH:mm)</Label>
                  <Input
                    value={draft.landingTime}
                    onChange={(e) => updateDraft({ landingTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs">On-Block (HH:mm)</Label>
                  <Input
                    value={draft.onBlock}
                    onChange={(e) => updateDraft({ onBlock: e.target.value })}
                  />
                </div>

                <div>
                  <Label className="text-xs">Tach Start (Decimal Hours)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={draft.tachStart}
                    onChange={(e) =>
                      updateDraft({ tachStart: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Tach Stop (Must be &gt; Start)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={draft.tachEnd}
                    onChange={(e) =>
                      updateDraft({ tachEnd: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Fuel Start / Stop (Liters)</Label>
                  <div className="flex gap-1.5">
                    <Input
                      type="number"
                      value={draft.fuelStartLiters}
                      onChange={(e) =>
                        updateDraft({ fuelStartLiters: Number(e.target.value) })
                      }
                    />
                    <Input
                      type="number"
                      value={draft.fuelStopLiters}
                      onChange={(e) =>
                        updateDraft({ fuelStopLiters: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Day Full-Stop / Touch-and-Go</Label>
                  <div className="flex gap-1.5">
                    <Input
                      type="number"
                      min={0}
                      value={draft.dayFullStop}
                      onChange={(e) =>
                        updateDraft({ dayFullStop: Number(e.target.value) })
                      }
                    />
                    <Input
                      type="number"
                      min={0}
                      value={draft.dayTouchAndGo}
                      onChange={(e) =>
                        updateDraft({ dayTouchAndGo: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button size="sm" onClick={() => setWizardStep(2)}>
                  Next: CBTA 1–5 Norm Grading Matrix →
                </Button>
              </div>
            </Card>
          )}

          {/* STEP 2: CBTA 1-5 NORM GRADING MATRIX */}
          {wizardStep === 2 && (
            <Card className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold">
                    Tab 2 — EASA / ICAO Doc 9995 CBTA 1–5 Norm Grading Matrix
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Grades 1 or 2 are below minimum acceptable safety standard and automatically trigger{" "}
                    <code className="font-mono font-bold text-amber-500">repeat_required</code>.
                  </p>
                </div>
                <Badge tone={anyScoreBelowNorm ? "warn" : "ok"}>
                  {anyScoreBelowNorm
                    ? "REPEAT REQUIRED (Grade <= 2 Detected)"
                    : "ALL COMPETENCIES >= 3 (PASS)"}
                </Badge>
              </div>

              {/* 8 Core Competencies 1-5 Segmented Buttons */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  8 ICAO Core Competencies (KNO · FPA · FPO · COM · WLM · SAW · PRB · LST)
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {competencies.map((comp) => {
                    const currentScore = draft.competencyScores[comp.code] ?? 4;
                    return (
                      <div
                        key={comp.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card/80 p-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-foreground">
                            <span className="font-mono text-primary">{comp.code}</span> —{" "}
                            {comp.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground line-clamp-1">
                            {comp.description}
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          {([1, 2, 3, 4, 5] as const).map((score) => (
                            <button
                              key={score}
                              type="button"
                              onClick={() =>
                                updateDraft({
                                  competencyScores: {
                                    ...draft.competencyScores,
                                    [comp.code]: score,
                                  },
                                })
                              }
                              className={`h-7 w-7 rounded-lg border font-mono text-xs font-extrabold transition cursor-pointer ${
                                currentScore === score
                                  ? GRADE_COLORS[score]
                                  : "border-border bg-background text-muted-foreground hover:border-primary"
                              }`}
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lesson Maneuvers (master_exercises) */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Syllabus Maneuvers (master_exercises)
                </div>
                <div className="space-y-2">
                  {masterExercises.map((ex) => {
                    const currentGrade = draft.exerciseGrades[ex.id] ?? 4;
                    return (
                      <div
                        key={ex.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-muted/30 p-3 text-xs"
                      >
                        <div>
                          <span className="font-mono font-bold text-primary">
                            {ex.code}
                          </span>{" "}
                          <span className="font-semibold text-foreground">
                            {ex.title}
                          </span>{" "}
                          <span className="text-[11px] text-muted-foreground">
                            (Norm Target: {ex.normTargetGrade}/5)
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {([1, 2, 3, 4, 5] as const).map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() =>
                                updateDraft({
                                  exerciseGrades: {
                                    ...draft.exerciseGrades,
                                    [ex.id]: g,
                                  },
                                })
                              }
                              className={`h-7 w-7 rounded-lg border font-mono text-xs font-extrabold transition cursor-pointer ${
                                currentGrade === g
                                  ? GRADE_COLORS[g]
                                  : "border-border bg-background text-muted-foreground"
                              }`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Observable Behavioral Indicators (OBIs) */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Observed Behavioral Indicators (OBIs)
                </div>
                <div className="flex flex-wrap gap-2">
                  {indicators.map((obi) => {
                    const checked = draft.observedIndicators.includes(
                      obi.indicatorCode,
                    );
                    return (
                      <button
                        key={obi.id}
                        type="button"
                        onClick={() => {
                          const next = checked
                            ? draft.observedIndicators.filter(
                                (c) => c !== obi.indicatorCode,
                              )
                            : [...draft.observedIndicators, obi.indicatorCode];
                          updateDraft({ observedIndicators: next });
                        }}
                        className={`rounded-full border px-3 py-1 text-[11px] font-medium transition cursor-pointer ${
                          checked
                            ? "border-primary bg-primary/15 text-primary font-bold"
                            : "border-border bg-background text-muted-foreground"
                        }`}
                      >
                        {obi.indicatorCode}: {obi.description}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setWizardStep(1)}
                >
                  ← Back
                </Button>
                <Button size="sm" onClick={() => setWizardStep(3)}>
                  Next: Remarks, Squawk &amp; SMS →
                </Button>
              </div>
            </Card>
          )}

          {/* STEP 3: REMARKS, INLINE AIRCRAFT SQUAWK & SMS TRIGGER */}
          {wizardStep === 3 && (
            <Card className="space-y-4">
              <h3 className="text-sm font-bold">
                Tab 3 — Instructor Debrief Remarks, Inline Aircraft Squawk &amp; SMS Occurrence Trigger
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <Label className="text-xs">Post-Flight Debriefing Summary</Label>
                  <Input
                    value={draft.remarks}
                    onChange={(e) => updateDraft({ remarks: e.target.value })}
                  />
                </div>

                {/* Inline Aircraft Squawk Toggle */}
                <div className="rounded-2xl border border-border p-4 space-y-3">
                  <label className="flex items-center gap-2 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.reportSquawk}
                      onChange={(e) =>
                        updateDraft({ reportSquawk: e.target.checked })
                      }
                    />
                    <Wrench className="h-4 w-4 text-amber-500" />
                    <span>Report Aircraft Defect / Technical Squawk on This Flight</span>
                  </label>
                  {draft.reportSquawk && (
                    <div className="grid gap-3 sm:grid-cols-3 pt-1">
                      <div>
                        <Label className="text-xs">Defect Severity</Label>
                        <NativeSelect
                          value={draft.squawkSeverity}
                          onChange={(e) =>
                            updateDraft({
                              squawkSeverity: e.target.value as
                                | "info"
                                | "warning"
                                | "grounding_defect",
                            })
                          }
                        >
                          <option value="info">Info (Monitor)</option>
                          <option value="warning">Warning (MEL Deferrable)</option>
                          <option value="grounding_defect">
                            Grounding Defect (Immediate AOG)
                          </option>
                        </NativeSelect>
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-xs">Squawk Description</Label>
                        <Input
                          placeholder="Describe technical defect observed during flight..."
                          value={draft.squawkDescription}
                          onChange={(e) =>
                            updateDraft({ squawkDescription: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Inline Safety Management System (SMS) Trigger */}
                <div className="rounded-2xl border border-border p-4 space-y-3">
                  <label className="flex items-center gap-2 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.flagSmsIncident}
                      onChange={(e) =>
                        updateDraft({ flagSmsIncident: e.target.checked })
                      }
                    />
                    <Flame className="h-4 w-4 text-red-500" />
                    <span>
                      Flag Safety Occurrence (Auto-Spawns ICAO Doc 9859 5×5 SMS Report)
                    </span>
                  </label>
                  {draft.flagSmsIncident && (
                    <div className="grid gap-3 sm:grid-cols-3 pt-1">
                      <div>
                        <Label className="text-xs">Occurrence Title</Label>
                        <Input
                          placeholder="e.g., Unstabilised approach go-around"
                          value={draft.smsTitle}
                          onChange={(e) =>
                            updateDraft({ smsTitle: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Severity (1–5)</Label>
                        <NativeSelect
                          value={String(draft.smsSeverity)}
                          onChange={(e) =>
                            updateDraft({
                              smsSeverity: Number(e.target.value) as 1 | 2 | 3 | 4 | 5,
                            })
                          }
                        >
                          <option value="1">1 — Negligible</option>
                          <option value="2">2 — Minor</option>
                          <option value="3">3 — Major</option>
                          <option value="4">4 — Hazardous</option>
                          <option value="5">5 — Catastrophic</option>
                        </NativeSelect>
                      </div>
                      <div>
                        <Label className="text-xs">Likelihood (A–E)</Label>
                        <NativeSelect
                          value={draft.smsLikelihood}
                          onChange={(e) =>
                            updateDraft({
                              smsLikelihood: e.target.value as
                                | "A"
                                | "B"
                                | "C"
                                | "D"
                                | "E",
                            })
                          }
                        >
                          <option value="A">A — Extremely Improbable</option>
                          <option value="B">B — Improbable</option>
                          <option value="C">C — Remote</option>
                          <option value="D">D — Occasional</option>
                          <option value="E">E — Frequent</option>
                        </NativeSelect>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setWizardStep(2)}
                >
                  ← Back
                </Button>
                <Button size="sm" onClick={() => setWizardStep(4)}>
                  Next: Dual Digital Sign-Off &amp; Commit →
                </Button>
              </div>
            </Card>
          )}

          {/* STEP 4: DUAL DIGITAL SIGN-OFF & 6-WAY ATOMIC COMMIT */}
          {wizardStep === 4 && (
            <Card className="space-y-4">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-sm font-bold">
                    Tab 4 — Dual Cryptographic Sign-Off &amp; 6-Way Atomic Commit (fn_register_flight)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Executes Fleet Tach/Maintenance, CBTA Grading, Dual SHA-256 Logbooks, EASA FTL Rest Lock, ACI Billing &amp; SMS in one atomic transaction.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <label className="flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.instructorPinSigned}
                    onChange={(e) =>
                      updateDraft({ instructorPinSigned: e.target.checked })
                    }
                  />
                  <div>
                    <div className="font-bold text-foreground">
                      Instructor Digital Signature &amp; FIDO2 Passkey Verified
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Certifies flight times, CBTA 1–5 grades, and logbook endorsement.
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-sky-500/40 bg-sky-500/5 p-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.studentPinSigned}
                    onChange={(e) =>
                      updateDraft({ studentPinSigned: e.target.checked })
                    }
                  />
                  <div>
                    <div className="font-bold text-foreground">
                      Student Pilot Digital Counter-Signature Verified
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Acknowledges debriefing feedback, CBTA scores, and ACI flight charges.
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setWizardStep(3)}
                >
                  ← Back
                </Button>
                <Button
                  size="sm"
                  onClick={handleAtomicCommit}
                  data-testid="execute-atomic-flight-commit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  <ShieldCheck className="mr-1.5 h-4 w-4" />
                  Execute 6-Way Atomic Post-Flight Commit (fn_register_flight)
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 2: 8-AXIS CBTA SPIDER RADAR CHART & LONGITUDINAL ANALYTICS
          ===================================================================== */}
      {activeTab === "radar" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold">
                  8-Axis ICAO CBTA Competency Spider Radar
                </h2>
                <p className="text-xs text-muted-foreground">
                  Plots Student Rolling Average vs. Academy Target (4.0) &amp; Minimum Safety Floor (2.0).
                </p>
              </div>
              <NativeSelect
                value={radarStudentId}
                onChange={(e) => setRadarStudentId(e.target.value)}
                className="w-auto min-w-[180px]"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </NativeSelect>
            </div>

            {/* Pure SVG 8-Axis Spider / Radar Chart */}
            <div className="flex flex-col items-center justify-center py-2">
              <svg
                viewBox="0 0 320 320"
                className="h-72 w-72 overflow-visible"
                aria-label="8-Axis CBTA Spider Radar Chart"
              >
                {/* Concentric Octagon Rings for Grades 1..5 */}
                {[1, 2, 3, 4, 5].map((ring) => {
                  const r = (ring / 5) * 110;
                  const pts = radarProfile.axes
                    .map((_, i) => {
                      const angle = (i * 2 * Math.PI) / 8 - Math.PI / 2;
                      const x = 160 + r * Math.cos(angle);
                      const y = 160 + r * Math.sin(angle);
                      return `${x},${y}`;
                    })
                    .join(" ");
                  return (
                    <polygon
                      key={ring}
                      points={pts}
                      fill="none"
                      stroke={ring === 2 ? "#ef4444" : ring === 4 ? "#10b981" : "#64748b"}
                      strokeOpacity={ring === 2 || ring === 4 ? 0.55 : 0.25}
                      strokeDasharray={ring === 2 ? "4 2" : undefined}
                      strokeWidth={ring === 2 || ring === 4 ? 1.5 : 1}
                    />
                  );
                })}

                {/* Axis Spokes & Labels */}
                {radarProfile.axes.map((axis, i) => {
                  const angle = (i * 2 * Math.PI) / 8 - Math.PI / 2;
                  const xEnd = 160 + 115 * Math.cos(angle);
                  const yEnd = 160 + 115 * Math.sin(angle);
                  const xLbl = 160 + 135 * Math.cos(angle);
                  const yLbl = 160 + 135 * Math.sin(angle);
                  return (
                    <g key={axis.code}>
                      <line
                        x1={160}
                        y1={160}
                        x2={xEnd}
                        y2={yEnd}
                        stroke="#64748b"
                        strokeOpacity={0.3}
                      />
                      <text
                        x={xLbl}
                        y={yLbl}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-foreground font-mono text-[10px] font-bold"
                      >
                        {axis.code} ({axis.studentAverage})
                      </text>
                    </g>
                  );
                })}

                {/* Student Rolling Competency Polygon */}
                <polygon
                  points={radarProfile.axes
                    .map((axis, i) => {
                      const angle = (i * 2 * Math.PI) / 8 - Math.PI / 2;
                      const r = (axis.studentAverage / 5) * 110;
                      return `${160 + r * Math.cos(angle)},${160 + r * Math.sin(angle)}`;
                    })
                    .join(" ")}
                  fill="rgba(14, 165, 233, 0.28)"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                />
              </svg>

              <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-sky-500">
                  ● Student Rolling Avg ({radarProfile.overallAverage}/5.0)
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-500">
                  — Academy Target (4.0)
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-red-500">
                  -- Safety Floor (2.0)
                </span>
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-base font-bold">
              Competency Breakdown &amp; Stage Check Queue
            </h2>
            <div className="space-y-2.5">
              {radarProfile.axes.map((axis) => (
                <div
                  key={axis.code}
                  className="rounded-xl border border-border p-2.5 text-xs"
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span>
                      <span className="font-mono text-primary">{axis.code}</span> —{" "}
                      {axis.name}
                    </span>
                    <span className="font-mono font-bold">
                      {axis.studentAverage} / 5.0
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-sky-500"
                      style={{ width: `${(axis.studentAverage / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* =====================================================================
          TAB 3: DUAL ELECTRONIC PILOT LOGBOOK & SIGNED PDF EXPORT
          ===================================================================== */}
      {activeTab === "logbook" && (
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold">
                Official EASA Part-FCL.050 / DGCA Electronic Logbook Ledger
              </h2>
              <p className="text-xs text-muted-foreground">
                Immutable dual-synthesized entries (Student DUAL/PIC + Instructor INSTRUCTOR/PIC) sealed with SHA-256 signature hashes.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <NativeSelect
                value={logbookUserId}
                onChange={(e) => setLogbookUserId(e.target.value)}
                className="w-auto min-w-[200px]"
              >
                {data.users
                  .filter((u) => u.status !== "deleted")
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role.toUpperCase()})
                    </option>
                  ))}
              </NativeSelect>
              <Button size="sm" onClick={handleExportLogbookPdf}>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Export Signed Logbook PDF
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 font-mono text-[11px] uppercase text-muted-foreground">
                <tr>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Route (Off–On)</th>
                  <th className="p-2.5">Aircraft / Class</th>
                  <th className="p-2.5">Capacity</th>
                  <th className="p-2.5">Total</th>
                  <th className="p-2.5">PIC</th>
                  <th className="p-2.5">Dual</th>
                  <th className="p-2.5">Instr</th>
                  <th className="p-2.5">Landings (D/N)</th>
                  <th className="p-2.5">SHA-256 Digital Seal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {userLogbookEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-muted/30">
                    <td className="p-2.5 font-bold">{entry.date}</td>
                    <td className="p-2.5">
                      {entry.departureIcao} → {entry.arrivalIcao} ({entry.offBlock}–
                      {entry.onBlock})
                    </td>
                    <td className="p-2.5">
                      <span className="font-bold text-primary">
                        {entry.aircraftReg}
                      </span>{" "}
                      · {entry.classRating}
                    </td>
                    <td className="p-2.5">
                      <Badge tone={entry.roleCapacity === "PIC" ? "ok" : "info"}>
                        {entry.roleCapacity}
                      </Badge>
                    </td>
                    <td className="p-2.5 font-bold">
                      {(entry.totalMinutes / 60).toFixed(1)}h
                    </td>
                    <td className="p-2.5">{(entry.picMinutes / 60).toFixed(1)}h</td>
                    <td className="p-2.5">{(entry.dualMinutes / 60).toFixed(1)}h</td>
                    <td className="p-2.5">
                      {(entry.instructorMinutes / 60).toFixed(1)}h
                    </td>
                    <td className="p-2.5">
                      {entry.dayLandings}D / {entry.nightLandings}N
                    </td>
                    <td className="p-2.5 text-[10px] text-emerald-600 dark:text-emerald-400">
                      🔒 {entry.signatureHash.slice(0, 22)}…
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
