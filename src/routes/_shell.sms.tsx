import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMe } from "@/lib/store";
import { classifySmsRisk } from "@/lib/logic";
import type { SmsLikelihood, SmsReport, SmsSeverity } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ShieldAlert,
  AlertTriangle,
  Lock,
  CheckCircle2,
  PlusCircle,
  EyeOff,
  FileWarning,
} from "lucide-react";

export const Route = createFileRoute("/_shell/sms")({
  component: SmsPage,
});

const SEVERITIES: { value: SmsSeverity; label: string }[] = [
  { value: 5, label: "5 - Catastrophic" },
  { value: 4, label: "4 - Hazardous" },
  { value: 3, label: "3 - Major" },
  { value: 2, label: "2 - Minor" },
  { value: 1, label: "1 - Negligible" },
];

const LIKELIHOODS: { value: SmsLikelihood; label: string }[] = [
  { value: "A", label: "A - Extremely Improbable" },
  { value: "B", label: "B - Improbable" },
  { value: "C", label: "C - Remote" },
  { value: "D", label: "D - Occasional" },
  { value: "E", label: "E - Frequent" },
];

function SmsPage() {
  const { data, me, update, log } = useMe();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<SmsReport["category"]>("human_factors");
  const [severity, setSeverity] = useState<SmsSeverity>(3);
  const [likelihood, setLikelihood] = useState<SmsLikelihood>("B");
  const [description, setDescription] = useState("");
  const [isConfidential, setIsConfidential] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ s: SmsSeverity; l: SmsLikelihood } | null>(null);
  const [capaDrafts, setCapaDrafts] = useState<Record<string, { rootCause: string; capa: string }>>({});

  const canManageSms = me.role === "admin" || me.role === "staff" || me.role === "instructor";
  const reports = data.smsReports ?? [];

  const previewRisk = classifySmsRisk(severity, likelihood);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Provide a hazard title and occurrence description");
      return;
    }

    const { riskIndex, riskZone } = classifySmsRisk(severity, likelihood);
    const reportNumber = `SMS-${new Date().getFullYear()}-${String(reports.length + 43).padStart(3, "0")}`;
    const newReport: SmsReport = {
      id: `sms_${Date.now()}`,
      reportNumber,
      reportedBy: isConfidential ? "anonymous" : me.id,
      isConfidential,
      category,
      title: title.trim(),
      description: description.trim(),
      occurredAt: new Date().toISOString(),
      severity,
      likelihood,
      riskIndex,
      riskZone,
      status: "submitted",
    };

    update((d) => ({
      ...d,
      smsReports: [newReport, ...(d.smsReports ?? [])],
    }));

    log(
      "sms_hazard_reported",
      "sms",
      `Filed ICAO Doc 9859 SMS Report ${reportNumber} (${riskZone} · Risk Index ${riskIndex})`,
      newReport.id,
    );

    setTitle("");
    setDescription("");
    toast.success(`Safety report ${reportNumber} logged in ICAO Doc 9859 registry`);
  };

  const handleUpdateCapa = (reportId: string, nextStatus: SmsReport["status"]) => {
    if (!canManageSms) return;
    const draftVals = capaDrafts[reportId];
    update((d) => ({
      ...d,
      smsReports: (d.smsReports ?? []).map((rep) =>
        rep.id === reportId
          ? {
              ...rep,
              rootCauseAnalysis: draftVals?.rootCause ?? rep.rootCauseAnalysis,
              capaMitigationPlan: draftVals?.capa ?? rep.capaMitigationPlan,
              status: nextStatus,
              investigatedBy: me.id,
              closedAt: nextStatus === "closed" ? new Date().toISOString() : rep.closedAt,
            }
          : rep,
      ),
    }));
    log(
      "sms_capa_updated",
      "sms",
      `Updated SMS investigation status for ${reportId} to ${nextStatus}`,
      reportId,
    );
    toast.success(`SMS Report updated to ${nextStatus.replace(/_/g, " ").toUpperCase()}`);
  };

  const filteredReports = selectedCell
    ? reports.filter((r) => r.severity === selectedCell.s && r.likelihood === selectedCell.l)
    : reports;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-rose-500/40 bg-rose-500/10 text-rose-300">
              ICAO Doc 9859 SMS
            </Badge>
            <Badge variant="outline" className="border-sky-500/40 bg-sky-500/10 text-sky-300">
              Just Culture Confidential Reporting
            </Badge>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Safety Management System (SMS) & 5×5 Risk Matrix
          </h1>
          <p className="text-sm text-muted-foreground">
            Proactive hazard identification, confidential occurrence reporting, and Corrective & Preventive Action (CAPA) tracking.
          </p>
        </div>
        {selectedCell && (
          <Button size="sm" variant="outline" onClick={() => setSelectedCell(null)}>
            Clear Matrix Filter ({selectedCell.s}{selectedCell.l})
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Interactive 5x5 ICAO Risk Matrix */}
        <Card className="border-border/60 lg:col-span-7">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              ICAO 5×5 Safety Risk Tolerability Matrix
            </CardTitle>
            <CardDescription>
              Click any cell to filter occurrences or set severity/likelihood for a new report. RED = Unacceptable, AMBER = ALARP Review, GREEN = Acceptable.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-center text-xs">
                <thead>
                  <tr>
                    <th className="border border-border/60 bg-muted/40 p-2 text-left">
                      Severity ↓ \ Likelihood →
                    </th>
                    {LIKELIHOODS.map((l) => (
                      <th key={l.value} className="border border-border/60 bg-muted/40 p-2 font-medium">
                        {l.value}
                        <div className="text-[10px] font-normal text-muted-foreground">
                          {l.label.split(" - ")[1]}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SEVERITIES.map((s) => (
                    <tr key={s.value}>
                      <td className="border border-border/60 bg-muted/40 p-2 text-left font-medium">
                        {s.label}
                      </td>
                      {LIKELIHOODS.map((l) => {
                        const { riskIndex, riskZone } = classifySmsRisk(s.value, l.value);
                        const cellCount = reports.filter(
                          (r) => r.severity === s.value && r.likelihood === l.value,
                        ).length;
                        const isSelected =
                          selectedCell?.s === s.value && selectedCell?.l === l.value;

                        const bgClass =
                          riskZone === "RED"
                            ? "bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border-rose-500/40"
                            : riskZone === "AMBER"
                              ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-500/40"
                              : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border-emerald-500/40";

                        return (
                          <td
                            key={l.value}
                            onClick={() => {
                              setSeverity(s.value);
                              setLikelihood(l.value);
                              setSelectedCell(
                                isSelected ? null : { s: s.value, l: l.value },
                              );
                            }}
                            className={`cursor-pointer border p-2.5 transition ${bgClass} ${
                              isSelected ? "ring-2 ring-white" : ""
                            }`}
                          >
                            <div className="font-mono text-sm font-bold">{riskIndex}</div>
                            {cellCount > 0 && (
                              <Badge
                                variant="secondary"
                                className="mt-1 h-4 px-1.5 text-[10px]"
                              >
                                {cellCount} rep
                              </Badge>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* New Occurrence / Hazard Report Form */}
        <Card className="border-border/60 lg:col-span-5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PlusCircle className="h-4 w-4 text-sky-400" />
              Submit Safety Hazard / Occurrence Report
            </CardTitle>
            <CardDescription>
              Supports anonymous Just Culture reporting to the Safety Manager.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReport} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Occurrence Title</Label>
                <Input
                  placeholder="e.g., Bird congregation near RWY 27 threshold"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Hazard Category</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SmsReport["category"])}
                >
                  <option value="human_factors">Human Factors / CRM</option>
                  <option value="runway_incursion">Runway Incursion</option>
                  <option value="airspace_infringement">Airspace Infringement</option>
                  <option value="hard_landing">Hard Landing / Unstable Approach</option>
                  <option value="technical_failure">Technical / Airworthiness Defect</option>
                  <option value="bird_strike">Bird / Wildlife Hazard</option>
                  <option value="weather_deviation">Weather Deviation / Wind Shear</option>
                  <option value="other">Other Safety Observation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Severity (1–5)</Label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                    value={severity}
                    onChange={(e) => setSeverity(Number(e.target.value) as SmsSeverity)}
                  >
                    {SEVERITIES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Likelihood (A–E)</Label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                    value={likelihood}
                    onChange={(e) => setLikelihood(e.target.value as SmsLikelihood)}
                  >
                    {LIKELIHOODS.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-xs">
                <span>Computed Risk Index:</span>
                <Badge
                  variant="outline"
                  className={
                    previewRisk.riskZone === "RED"
                      ? "border-rose-500/50 text-rose-300"
                      : previewRisk.riskZone === "AMBER"
                        ? "border-amber-500/50 text-amber-300"
                        : "border-emerald-500/50 text-emerald-300"
                  }
                >
                  Index {previewRisk.riskIndex} • {previewRisk.riskZone} ZONE
                </Badge>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Narrative & Immediate Actions Taken</Label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-input bg-background p-2.5 text-xs"
                  placeholder="Describe weather, phase of flight, aircraft registration, and safety barriers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border/60 bg-background/50 p-2.5 text-xs">
                <input
                  type="checkbox"
                  checked={isConfidential}
                  onChange={(e) => setIsConfidential(e.target.checked)}
                />
                <EyeOff className="h-3.5 w-3.5 text-amber-400" />
                <span>Submit Confidentially (strip reporter identity from non-Safety Manager views)</span>
              </label>

              <Button type="submit" className="w-full">
                <FileWarning className="mr-1.5 h-4 w-4" />
                File ICAO SMS Occurrence Report
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* CAPA Investigation Registry */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">
            Occurrence Registry & Corrective Action Plans (CAPA) ({filteredReports.length})
          </CardTitle>
          <CardDescription>
            Tracks Root Cause Analysis, risk mitigation actions, and formal closure by the Accountable Manager / Safety Officer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredReports.map((rep) => {
            const draft = capaDrafts[rep.id] ?? {
              rootCause: rep.rootCauseAnalysis ?? "",
              capa: rep.capaMitigationPlan ?? "",
            };
            return (
              <div
                key={rep.id}
                className="space-y-3 rounded-lg border border-border/60 bg-background/50 p-4"
              >
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold">{rep.reportNumber}</span>
                    <Badge
                      variant="outline"
                      className={
                        rep.riskZone === "RED"
                          ? "border-rose-500/50 bg-rose-500/10 text-rose-300"
                          : rep.riskZone === "AMBER"
                            ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                            : "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                      }
                    >
                      Index {rep.riskIndex} ({rep.riskZone})
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {rep.category.replace(/_/g, " ").toUpperCase()}
                    </Badge>
                    {rep.isConfidential && (
                      <Badge variant="outline" className="border-purple-500/40 text-purple-300 text-xs">
                        <Lock className="mr-1 h-3 w-3" />
                        Confidential
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="uppercase">
                    {rep.status.replace(/_/g, " ")}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-semibold">{rep.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{rep.description}</p>
                </div>

                {(rep.rootCauseAnalysis || rep.capaMitigationPlan) && !canManageSms && (
                  <div className="grid gap-2 rounded-md bg-muted/40 p-3 text-xs sm:grid-cols-2">
                    <div>
                      <span className="font-semibold text-foreground">Root Cause: </span>
                      <span className="text-muted-foreground">
                        {rep.rootCauseAnalysis || "Pending investigation"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">CAPA Mitigation: </span>
                      <span className="text-muted-foreground">
                        {rep.capaMitigationPlan || "Pending CAPA"}
                      </span>
                    </div>
                  </div>
                )}

                {canManageSms && (
                  <div className="space-y-2 border-t border-border/50 pt-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Input
                        placeholder="Root Cause Analysis..."
                        value={draft.rootCause}
                        onChange={(e) =>
                          setCapaDrafts((prev) => ({
                            ...prev,
                            [rep.id]: { ...draft, rootCause: e.target.value },
                          }))
                        }
                        className="h-8 text-xs"
                      />
                      <Input
                        placeholder="Corrective & Preventive Action Plan (CAPA)..."
                        value={draft.capa}
                        onChange={(e) =>
                          setCapaDrafts((prev) => ({
                            ...prev,
                            [rep.id]: { ...draft, capa: e.target.value },
                          }))
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateCapa(rep.id, "under_investigation")}
                      >
                        <AlertTriangle className="mr-1 h-3.5 w-3.5 text-amber-400" />
                        Mark Investigating
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateCapa(rep.id, "mitigation_in_progress")}
                      >
                        Assign CAPA
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleUpdateCapa(rep.id, "closed")}
                      >
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                        Verify Mitigation & Close
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
