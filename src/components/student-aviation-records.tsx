import { useState, type FormEvent } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  FileBadge,
  FilePlus,
  IdCard,
  Plane,
  ShieldCheck,
} from "lucide-react";
import { Chip, Field, KV, NativeSelect, Section } from "@/components/app-ui";
import { ProfileEditor } from "@/components/profile-editor";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TECHNICAL_SPECIFIC_OPTIONS,
  expiryState,
  fmtDec,
  fmtHours,
  hoursBreakdown,
  studentDocumentsFor,
  submitProfileRequest,
  uid,
} from "@/lib/logic";
import { useStore } from "@/lib/store";
import type { ProfileChanges, StudentDocument, User } from "@/lib/types";

const expTone = (s: string) =>
  (s === "ok" ? "ok" : s === "soon" ? "soon" : s === "expired" ? "expired" : "none") as "ok";

function fmtValidity(date?: string) {
  if (!date) return <Chip tone="none">Not on file</Chip>;
  const exp = expiryState(date, new Date(), 60);
  const formatted = format(new Date(date), "dd MMM yyyy");
  return (
    <span className="inline-flex items-center gap-2">
      <span className="num text-xs font-medium">{formatted}</span>
      <Chip tone={expTone(exp.state)}>
        {exp.state === "expired"
          ? `Expired (${-exp.days}d ago)`
          : exp.state === "soon"
            ? `Expiring (${exp.days}d)`
            : `Valid (${exp.days}d)`}
      </Chip>
    </span>
  );
}

export function StudentAviationRecords({
  student,
  showDocuments = true,
}: {
  student: User;
  showDocuments?: boolean;
}) {
  const { data, me, commit, update, log } = useStore();
  const hrs = hoursBreakdown(student.id, data);
  const docs = studentDocumentsFor(student, data);

  const canEdit = me?.role === "admin" || me?.id === student.id;
  const isStaff = me?.role === "admin" || me?.role === "instructor" || me?.role === "ground";

  // Examination Status interactive form state
  const [airReg, setAirReg] = useState<boolean>(Boolean(student.examAirRegulation));
  const [met, setMet] = useState<boolean>(Boolean(student.examMeteorology));
  const [nav, setNav] = useState<boolean>(Boolean(student.examAirNavigation));
  const [techGen, setTechGen] = useState<boolean>(Boolean(student.examTechnicalGeneral));
  const [techSpec, setTechSpec] = useState<string>(
    student.examTechnicalSpecific ?? "Not Attempted",
  );

  // Add Document Dialog state
  const [docOpen, setDocOpen] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [docCategory, setDocCategory] = useState<StudentDocument["category"]>("licence");
  const [docNumber, setDocNumber] = useState("");
  const [docIssued, setDocIssued] = useState("");
  const [docExpiry, setDocExpiry] = useState("");
  const [docNotes, setDocNotes] = useState("");

  const hasExamChanges =
    airReg !== Boolean(student.examAirRegulation) ||
    met !== Boolean(student.examMeteorology) ||
    nav !== Boolean(student.examAirNavigation) ||
    techGen !== Boolean(student.examTechnicalGeneral) ||
    techSpec !== (student.examTechnicalSpecific ?? "Not Attempted");

  function handleSaveExams(e: FormEvent) {
    e.preventDefault();
    if (!me) return;
    const changes: ProfileChanges = {
      examAirRegulation: airReg,
      examMeteorology: met,
      examAirNavigation: nav,
      examTechnicalGeneral: techGen,
      examTechnicalSpecific: techSpec,
    };
    const res = submitProfileRequest(data, me, student.id, changes);
    const err = commit(res);
    if (err) {
      toast.error(err);
      return;
    }
    const approved = me.role === "admin";
    log(
      approved ? "exam_status_updated" : "profile_change_requested",
      "user",
      approved
        ? `Updated examination status for ${student.name}`
        : `Submitted examination status update for ${student.name} (awaiting staff approval)`,
      student.id,
    );
    toast.success(
      approved
        ? "Examination status updated"
        : "Examination status changes submitted for staff approval",
    );
  }

  function handleAddDocument(e: FormEvent) {
    e.preventDefault();
    if (!me) return;
    if (!docTitle.trim() || !docNumber.trim()) {
      toast.error("Enter both a document title and document/certificate number.");
      return;
    }
    const newDoc: StudentDocument = {
      id: `doc-${uid()}`,
      studentId: student.id,
      title: docTitle.trim(),
      category: docCategory,
      documentNumber: docNumber.trim(),
      issuedAt: docIssued || undefined,
      expiryDate: docExpiry || undefined,
      verified: isStaff ?? false,
      verifiedBy: isStaff ? me.id : undefined,
      notes: docNotes.trim() || undefined,
    };
    update((d) => ({
      ...d,
      documents: [...(d.documents ?? []), newDoc],
    }));
    log(
      "document_added",
      "user",
      `Added aviation document "${newDoc.title}" (${newDoc.documentNumber}) for ${student.name}`,
      student.id,
    );
    toast.success(
      isStaff
        ? "Aviation document added and verified"
        : "Aviation document submitted for staff verification",
    );
    setDocTitle("");
    setDocNumber("");
    setDocIssued("");
    setDocExpiry("");
    setDocNotes("");
    setDocOpen(false);
  }

  function handleVerifyDoc(docId: string) {
    if (!me || !isStaff) return;
    update((d) => ({
      ...d,
      documents: (d.documents ?? []).map((doc) =>
        doc.id === docId ? { ...doc, verified: true, verifiedBy: me.id } : doc,
      ),
    }));
    log("document_verified", "user", `Verified aviation document ${docId} for ${student.name}`, student.id);
    toast.success("Document verified");
  }

  const expiringDocs = docs.filter(
    (d) => d.expiryState === "expired" || d.expiryState === "soon",
  );

  return (
    <div className="space-y-6">
      {/* Expiring Documents / Medical Warning Banner */}
      {expiringDocs.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div>
              <p className="font-bold text-foreground">
                {expiringDocs.length}{" "}
                {expiringDocs.length === 1
                  ? "Aviation Document / Certificate Requires Attention"
                  : "Aviation Documents / Certificates Require Attention"}
              </p>
              <p className="mt-0.5 text-muted-foreground">
                {expiringDocs
                  .map(
                    (d) =>
                      `${d.title} (${d.documentNumber}: ${d.expiryState === "expired" ? `Expired ${-d.daysRemaining}d ago` : `Expires in ${d.daysRemaining}d`})`,
                  )
                  .join(" · ")}
              </p>
            </div>
          </div>
          {canEdit && <ProfileEditor person={student} />}
        </div>
      )}

      {/* Row 1: Identification & Licences and Validity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Section
          title="Aviation Identification"
          description="Official DGCA / EASA student pilot registration identifiers"
          action={
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
              <IdCard className="h-4 w-4" /> Official Record
            </span>
          }
        >
          <KV k="Student Name" v={<span className="font-semibold">{student.name}</span>} />
          <KV
            k="Call Sign"
            v={<span className="num font-mono font-semibold">{student.callsign ?? "—"}</span>}
          />
          <KV
            k="Computer Number"
            v={
              <span className="num font-mono font-semibold">
                {student.computerNumber ?? "Not assigned"}
              </span>
            }
          />
          <KV
            k="eGCA ID"
            v={
              <span className="num font-mono font-semibold">
                {student.egcaId ?? "Not assigned"}
              </span>
            }
          />
          <KV
            k="File Number"
            v={
              <span className="num font-mono font-semibold">
                {student.fileNumber ?? "Not assigned"}
              </span>
            }
          />
          <KV
            k="Training Stage"
            v={<span className="font-medium">{student.stage ?? "Enrolled"}</span>}
          />
        </Section>

        <Section
          title="Licences and Validity"
          description="SPL, FRTOL, RTR and Aviation Medical certificate numbers & expiry dates"
          action={
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
              <FileBadge className="h-4 w-4" /> Currency &amp; Validity
            </span>
          }
        >
          <KV
            k="SPL Number"
            v={
              <span className="num font-mono font-semibold">
                {student.splNumber ?? student.licence ?? "—"}
              </span>
            }
          />
          <KV k="SPL Validity" v={fmtValidity(student.splExpiry)} />
          <KV
            k="FRTOL Number"
            v={<span className="num font-mono font-semibold">{student.frtolNumber ?? "—"}</span>}
          />
          <KV k="FRTOL Validity" v={fmtValidity(student.frtolExpiry)} />
          <KV
            k="RTR Number"
            v={<span className="num font-mono font-semibold">{student.rtrNumber ?? "—"}</span>}
          />
          <KV k="RTR Validity" v={fmtValidity(student.rtrExpiry)} />
          <KV
            k={`Medical Validity (Class ${student.medicalClass ?? 2})`}
            v={fmtValidity(student.medicalExpiry)}
          />
        </Section>
      </div>

      {/* Row 2: Examination Status & Flying Experience */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Section
          title="Examination Status"
          description="Official theoretical examination checklist & aircraft-type technical specific endorsement"
          action={
            <Chip
              tone={
                airReg && met && nav && techGen && techSpec !== "Not Attempted" ? "ok" : "soon"
              }
            >
              <Award className="mr-1 h-3 w-3" />
              {[airReg, met, nav, techGen, techSpec !== "Not Attempted"].filter(Boolean).length}/5
              Completed
            </Chip>
          }
        >
          <form onSubmit={handleSaveExams} className="space-y-3">
            <div className="grid gap-2.5 sm:grid-cols-2">
              {[
                {
                  id: "exam-air-reg",
                  label: "Air Regulation",
                  checked: airReg,
                  onChange: setAirReg,
                },
                {
                  id: "exam-met",
                  label: "Meteorology",
                  checked: met,
                  onChange: setMet,
                },
                {
                  id: "exam-nav",
                  label: "Air Navigation",
                  checked: nav,
                  onChange: setNav,
                },
                {
                  id: "exam-tech-gen",
                  label: "Technical General",
                  checked: techGen,
                  onChange: setTechGen,
                },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-xs transition ${
                    item.checked
                      ? "border-emerald-500/40 bg-emerald-500/10 text-foreground"
                      : "border-border bg-background/60 text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <span className="flex items-center gap-2.5 font-semibold text-foreground">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      disabled={!canEdit}
                      onChange={(e) => item.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-border accent-primary"
                    />
                    {item.label}
                  </span>
                  <Chip tone={item.checked ? "ok" : "none"}>
                    {item.checked ? "Passed" : "Pending"}
                  </Chip>
                </label>
              ))}
            </div>

            <Field label="Technical Specific (Aircraft Type Endorsement)">
              <NativeSelect
                value={techSpec}
                disabled={!canEdit}
                onChange={(e) => setTechSpec(e.target.value)}
                aria-label="Technical Specific"
              >
                {TECHNICAL_SPECIFIC_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </NativeSelect>
            </Field>

            {canEdit && (
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-[11px] text-muted-foreground">
                  {me?.role === "admin"
                    ? "Administrator changes apply immediately."
                    : "Changes require staff approval before becoming official."}
                </span>
                <Button type="submit" size="sm" disabled={!hasExamChanges}>
                  {me?.role === "admin" ? "Save Exam Status" : "Request Exam Update"}
                </Button>
              </div>
            )}
          </form>
        </Section>

        <Section
          title="Flying Experience Summary"
          description="Calculated directly from verified flight logbook records"
          action={
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Plane className="h-4 w-4" /> Verified Totals
            </span>
          }
        >
          <KV
            k="Last Date of Flying"
            v={
              <span className="num font-semibold">
                {hrs.lastFlightDate
                  ? format(new Date(hrs.lastFlightDate), "dd MMM yyyy")
                  : "No flights logged"}
              </span>
            }
          />
          <KV
            k="Total Flying Hours"
            v={
              <span className="num font-bold text-primary">
                {fmtDec(hrs.total)} h ({fmtHours(hrs.total)})
              </span>
            }
          />
          <KV
            k="Dual Hours (Day / Night)"
            v={
              <span className="num font-medium">
                Day: {fmtDec(hrs.dualDay)} h · Night: {fmtDec(hrs.dualNight)} h (Total:{" "}
                {fmtDec(hrs.dual)} h)
              </span>
            }
          />
          <KV
            k="Solo Hours (Day / Night)"
            v={
              <span className="num font-medium">
                Day: {fmtDec(hrs.soloDay)} h · Night: {fmtDec(hrs.soloNight)} h (Total:{" "}
                {fmtDec(hrs.solo)} h)
              </span>
            }
          />
          <KV
            k="Cross-Country Hours"
            v={
              <span className="num font-semibold">
                {fmtDec(hrs.crossCountry)} h ({fmtHours(hrs.crossCountry)})
              </span>
            }
          />
          <KV
            k="Instrument Time (IFR / Sim)"
            v={
              <span className="num font-semibold">
                {fmtDec(hrs.ifr)} h ({fmtHours(hrs.ifr)})
              </span>
            }
          />
          <KV
            k="Multi-Engine Hours"
            v={
              <span className="num font-semibold">
                {fmtDec(hrs.multiEngine)} h ({fmtHours(hrs.multiEngine)})
              </span>
            }
          />
          {hrs.pendingCount > 0 && (
            <KV
              k="Pending Instructor Verification"
              v={
                <Chip tone="soon">
                  <Clock className="mr-1 h-3 w-3" /> {hrs.pendingCount} flight(s) ·{" "}
                  {fmtDec(hrs.pendingMinutes)} h awaiting sign-off
                </Chip>
              }
            />
          )}
        </Section>
      </div>

      {/* Row 3: Aviation Documents & Certificates */}
      {showDocuments && (
        <Section
          title="Aviation Licences, Certificates & Documents"
          description="Monitor expiry dates, verification status, and compliance for all mandatory flight documents"
          action={
            canEdit && (
              <Button size="sm" variant="outline" onClick={() => setDocOpen(true)}>
                <FilePlus className="mr-1.5 h-3.5 w-3.5" /> Add Document
              </Button>
            )
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document / Certificate</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Document Number</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Validity Status</TableHead>
                <TableHead>Verification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((doc) => (
                <TableRow
                  key={doc.id}
                  className={
                    doc.expiryState === "expired"
                      ? "bg-destructive/5"
                      : doc.expiryState === "soon"
                        ? "bg-amber-500/5"
                        : ""
                  }
                >
                  <TableCell>
                    <div className="font-semibold text-foreground">{doc.title}</div>
                    {doc.notes && (
                      <div className="text-[11px] text-muted-foreground">{doc.notes}</div>
                    )}
                  </TableCell>
                  <TableCell className="capitalize text-xs text-muted-foreground">
                    {doc.category}
                  </TableCell>
                  <TableCell className="num font-mono text-xs font-semibold">
                    {doc.documentNumber}
                  </TableCell>
                  <TableCell className="num text-xs">
                    {doc.expiryDate ? format(new Date(doc.expiryDate), "dd MMM yyyy") : "—"}
                  </TableCell>
                  <TableCell>
                    <Chip tone={expTone(doc.expiryState)}>
                      {doc.expiryState === "none"
                        ? "Not on file"
                        : doc.expiryState === "expired"
                          ? `Expired (${-doc.daysRemaining}d ago)`
                          : doc.expiryState === "soon"
                            ? `Expiring in ${doc.daysRemaining}d`
                            : `Valid (${doc.daysRemaining}d)`}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {doc.verified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                      </span>
                    ) : isStaff ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => handleVerifyDoc(doc.id)}
                      >
                        <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Verify
                      </Button>
                    ) : (
                      <Chip tone="soon">Pending Verification</Chip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>
      )}

      <Dialog open={docOpen} onOpenChange={setDocOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Aviation Document / Certificate</DialogTitle>
            <DialogDescription>
              Record a licence, medical certificate, radiotelephony permit, or endorsement.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddDocument} className="space-y-3 py-2">
            <Field label="Document Title">
              <Input
                placeholder="e.g. Class 1 Medical Assessment"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                required
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Category">
                <NativeSelect
                  value={docCategory}
                  onChange={(e) =>
                    setDocCategory(e.target.value as StudentDocument["category"])
                  }
                >
                  <option value="licence">Licence</option>
                  <option value="medical">Medical</option>
                  <option value="radio">Radio / RTR / FRTOL</option>
                  <option value="identification">Identification</option>
                  <option value="endorsement">Endorsement</option>
                  <option value="other">Other</option>
                </NativeSelect>
              </Field>
              <Field label="Document / Certificate Number">
                <Input
                  placeholder="e.g. DK-FCL-2026-881"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  required
                />
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Issue Date (optional)">
                <Input
                  type="date"
                  value={docIssued}
                  onChange={(e) => setDocIssued(e.target.value)}
                />
              </Field>
              <Field label="Expiry Date">
                <Input
                  type="date"
                  value={docExpiry}
                  onChange={(e) => setDocExpiry(e.target.value)}
                />
              </Field>
            </div>
            <Field label="Remarks / Notes (optional)">
              <Input
                placeholder="Issuing authority or restrictions"
                value={docNotes}
                onChange={(e) => setDocNotes(e.target.value)}
              />
            </Field>
            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setDocOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Document</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
