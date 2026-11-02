import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Eye,
  FileCode,
  GitBranch,
  GitCommit,
  Lock,
  Pencil,
  Plus,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  UserCheck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
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
import { Label } from "@/components/ui/label";
import {
  assignCourseToUsers,
  ELEARNING_MODULES,
  isCourseAssignedToUser,
  unassignCourseFromUsers,
  type CourseId,
} from "@/lib/elearning-courses";
import { learningChapters } from "@/lib/learning-content";
import { airlawChapters } from "@/lib/airlaw-content";
import { airframesChapters } from "@/lib/airframes-content";
import { electricsChapters } from "@/lib/electrics-content";
import { powerplantChapters } from "@/lib/powerplant-content";
import { useStore } from "@/lib/store";
import {
  createDirectiveForParth,
  readELearningWorkspace,
  submitParthWorkReport,
  updateDirectiveByAdmin,
  type DevTaskPriority,
  type DevTaskStatus,
  type ELearningDevTask,
  type ELearningWorkReport,
} from "./dev-workspace";
import { PARTH_EMAIL, PARTH_NAME, PARTH_USER_ID, isParthUser } from "./workspace-config";

function chaptersForCourse(courseId: CourseId): { id: string; label: string }[] {
  if (courseId === "pooley") {
    return learningChapters.map((c) => ({
      id: c.id,
      label: `Ch ${c.number}: ${c.title}`,
    }));
  }
  if (courseId === "airlaw") {
    return airlawChapters.map((c) => ({
      id: c.id,
      label: `Ch ${c.number}: ${c.title}`,
    }));
  }
  if (courseId === "airframes") {
    return airframesChapters.map((c) => ({
      id: c.id,
      label: `Ch ${c.number}: ${c.title}`,
    }));
  }
  if (courseId === "electrics") {
    return electricsChapters.map((c) => ({
      id: c.id,
      label: `Ch ${c.number}: ${c.title}`,
    }));
  }
  return powerplantChapters.map((c) => ({
    id: c.id,
    label: `Ch ${c.number}: ${c.title}`,
  }));
}

function statusBadge(status: DevTaskStatus) {
  switch (status) {
    case "assigned":
      return {
        label: "Assigned to Parth",
        cls: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
      };
    case "in_progress":
      return {
        label: "In Progress (Parth Working)",
        cls: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
      };
    case "ready_for_review":
      return {
        label: "Ready for Vipul's Review",
        cls: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
      };
    case "approved":
      return {
        label: "Approved by Vipul",
        cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      };
    case "changes_requested":
      return {
        label: "Changes Requested by Vipul",
        cls: "bg-destructive/15 text-destructive border-destructive/30",
      };
  }
}

export interface InspectChangePayload {
  task: ELearningDevTask;
  report?: ELearningWorkReport;
  courseId: CourseId;
  chapterId: string;
}

export function ELearningDevWorkspacePanel({
  onInspectChangeInUi,
  onSwitchUser,
}: {
  onInspectChangeInUi: (payload: InspectChangePayload) => void;
  onSwitchUser?: (email: string) => void;
}) {
  const { data, me, update, log } = useStore();
  const [workspace, setWorkspace] = useState(() => readELearningWorkspace());

  // Admin: New Task Directive Modal
  const [newDirectiveOpen, setNewDirectiveOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState<CourseId>("pooley");
  const [chapterId, setChapterId] = useState("chapter-01");
  const [priority, setPriority] = useState<DevTaskPriority>("high");
  const [whatToDoText, setWhatToDoText] = useState(
    "Update interactive diagram callouts and verify textbook formatting for this chapter.\nSubmit a work report once verified.",
  );
  const [whatNotToDoText, setWhatNotToDoText] = useState(
    "DO NOT touch any FlightLogger files, routes, bookings, or logbooks.\nDO NOT alter verbatim supplied Markdown text.\nDO NOT push to main — push only to origin/parthbhatt.",
  );
  const [allowedFilesText, setAllowedFilesText] = useState(
    "src/lib/learning-content.ts, src/components/learning-reader.tsx, src/components/learning-diagram.tsx",
  );

  // Admin: Edit existing task instructions modal
  const [editingTask, setEditingTask] = useState<ELearningDevTask | null>(null);
  const [editDoText, setEditDoText] = useState("");
  const [editNotDoText, setEditNotDoText] = useState("");
  const [editReviewNote, setEditReviewNote] = useState("");

  // Parth: Submit Work Report Modal
  const [reportingTask, setReportingTask] = useState<ELearningDevTask | null>(null);
  const [reportStatus, setReportStatus] = useState<DevTaskStatus>("ready_for_review");
  const [reportSummary, setReportSummary] = useState("");
  const [reportChangesText, setReportChangesText] = useState("");
  const [reportFilesText, setReportFilesText] = useState("");
  const [reportSectionHighlight, setReportSectionHighlight] = useState("");

  if (!me) return null;

  const isAdmin = me.role === "admin";
  const isParth = isParthUser(me);

  // Only show to Admin (Vipul) or Parth Bhatt
  if (!isAdmin && !isParth) return null;

  const parthMember =
    data.users.find((u) => u.id === PARTH_USER_ID || isParthUser(u)) ?? {
      id: PARTH_USER_ID,
      name: PARTH_NAME,
      email: PARTH_EMAIL,
      role: "ground" as const,
      status: "active" as const,
    };

  const totalReportsCount = workspace.tasks.reduce(
    (sum, t) => sum + (t.reports?.length ?? 0),
    0,
  );
  const readyForReviewCount = workspace.tasks.filter(
    (t) => t.status === "ready_for_review",
  ).length;

  function handleToggleParthCourse(cid: CourseId) {
    if (!me || me.role !== "admin") return;
    const currentlyAssigned = isCourseAssignedToUser(parthMember.id, cid, data);
    const mod = ELEARNING_MODULES.find((m) => m.id === cid);
    if (currentlyAssigned) {
      const { next } = unassignCourseFromUsers(
        [parthMember.id],
        cid,
        data,
        me,
        "Unassigned from Parth Bhatt's E-Learning Developer scope",
      );
      update(() => next);
      toast.info(`Revoked "${mod?.title}" from Parth Bhatt's E-Learning workspace.`);
    } else {
      const { next } = assignCourseToUsers(
        [parthMember.id],
        cid,
        data,
        me,
        "Assigned to Parth Bhatt for E-Learning development",
      );
      update(() => next);
      toast.success(`Assigned "${mod?.title}" to Parth Bhatt.`);
    }
  }

  function handleCreateDirective() {
    if (!title.trim()) {
      toast.error("Please enter a task title for Parth Bhatt.");
      return;
    }
    const mod = ELEARNING_MODULES.find((m) => m.id === courseId) ?? ELEARNING_MODULES[0];
    const chapters = chaptersForCourse(courseId);
    const ch = chapters.find((c) => c.id === chapterId) ?? chapters[0];

    const next = createDirectiveForParth(workspace, {
      title,
      courseId,
      courseTitle: mod.title,
      targetChapterId: ch?.id ?? "chapter-01",
      targetChapterLabel: ch?.label ?? "Chapter 1",
      priority,
      whatToDo: whatToDoText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      whatNotToDo: whatNotToDoText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      allowedFiles: allowedFilesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });

    // Ensure the target course is also assigned to Parth so he can open it
    if (me && !isCourseAssignedToUser(parthMember.id, courseId, data)) {
      const { next: nextData } = assignCourseToUsers(
        [parthMember.id],
        courseId,
        data,
        me,
        `Auto-assigned for Task: ${title.trim()}`,
      );
      update(() => nextData);
    }

    log(
      "elearning_directive_assigned",
      "lesson",
      `Assigned E-Learning Task "${title.trim()}" (${mod.title} · ${ch?.label}) to Parth Bhatt`,
      parthMember.id,
    );
    setWorkspace(next);
    setNewDirectiveOpen(false);
    setTitle("");
    toast.success(`Directive assigned to Parth Bhatt for ${mod.title}!`);
  }

  function handleOpenEditDirective(task: ELearningDevTask) {
    setEditingTask(task);
    setEditDoText(task.whatToDo.join("\n"));
    setEditNotDoText(task.whatNotToDo.join("\n"));
    setEditReviewNote(task.adminReviewNote ?? "");
  }

  function handleSaveEditedDirective() {
    if (!editingTask) return;
    const next = updateDirectiveByAdmin(workspace, editingTask.id, {
      whatToDo: editDoText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      whatNotToDo: editNotDoText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      adminReviewNote: editReviewNote.trim(),
    });
    log(
      "elearning_directive_updated",
      "lesson",
      `Updated instructions ("What To Do" / "What NOT To Do") on ${editingTask.id} for Parth Bhatt`,
      editingTask.id,
    );
    setWorkspace(next);
    setEditingTask(null);
    toast.success(`Updated instructions for ${editingTask.id}.`);
  }

  function handleAdminDecision(task: ELearningDevTask, decision: "approved" | "changes_requested") {
    const next = updateDirectiveByAdmin(workspace, task.id, {
      status: decision,
      adminReviewNote:
        decision === "approved"
          ? "Verified & approved by Vipul in UI."
          : "Revisions requested by Vipul — check 'What To Do' instructions.",
    });
    log(
      decision === "approved" ? "elearning_task_approved" : "elearning_changes_requested",
      "lesson",
      `${decision === "approved" ? "Approved" : "Requested revisions on"} Parth Bhatt's work for ${task.id} (${task.title})`,
      task.id,
    );
    setWorkspace(next);
    toast.success(
      decision === "approved"
        ? `Approved Parth's work on ${task.id}!`
        : `Marked ${task.id} as Changes Requested for Parth.`,
    );
  }

  function handleOpenParthReportModal(task: ELearningDevTask) {
    setReportingTask(task);
    setReportStatus("ready_for_review");
    setReportSummary(
      `Completed requested updates on ${task.courseTitle} (${task.targetChapterLabel}).`,
    );
    setReportChangesText(
      `Implemented Vipul's instructions for ${task.targetChapterLabel}\nVerified interactive diagrams and formatting inside E-Learning reader\nConfirmed zero changes outside E-Learning files`,
    );
    setReportFilesText(task.allowedFiles.join(", "));
    setReportSectionHighlight(task.targetChapterLabel);
  }

  function handleSubmitParthReport() {
    if (!reportingTask) return;
    if (!reportSummary.trim()) {
      toast.error("Please enter a summary of what you changed.");
      return;
    }
    const next = submitParthWorkReport(workspace, {
      taskId: reportingTask.id,
      statusAfter: reportStatus,
      summary: reportSummary,
      changesMade: reportChangesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      filesChanged: reportFilesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      sectionHighlight: reportSectionHighlight.trim() || reportingTask.targetChapterLabel,
    });
    log(
      "elearning_work_report_submitted",
      "lesson",
      `Parth Bhatt submitted work report for ${reportingTask.id}: ${reportSummary.trim()}`,
      reportingTask.id,
    );
    setWorkspace(next);
    setReportingTask(null);
    toast.success("Work report submitted to Vipul! You can now push to origin/parthbhatt.");
  }

  const availableChapters = chaptersForCourse(courseId);

  return (
    <section
      data-testid="elearning-dev-workspace-panel"
      className="rounded-3xl border-2 border-primary/30 bg-card/95 p-6 sm:p-8 shadow-md space-y-6"
    >
      {/* Top Header: Different contextual view for Vipul (Admin) vs Parth Bhatt (E-Learning Dev) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary border border-primary/30">
              <GitBranch className="h-3.5 w-3.5" />
              <span>Branch: {workspace.collaborator.branch}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/15 px-3 py-1 text-xs font-bold text-destructive border border-destructive/30">
              <Lock className="h-3.5 w-3.5" />
              <span>FlightLogger UI &amp; Code: 100% Locked for Parth</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>
                {workspace.tasks.length} Active Directives · {totalReportsCount} Work Reports
              </span>
            </span>
            {readyForReviewCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/15 px-3 py-1 text-xs font-bold text-purple-600 dark:text-purple-400 border border-purple-500/30 animate-pulse">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{readyForReviewCount} Ready for Vipul&apos;s Review</span>
              </span>
            )}
          </div>

          {isAdmin ? (
            <>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                Parth Bhatt — E-Learning Developer Command, Instructions &amp; Activity Report
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-4xl leading-relaxed">
                You (<span className="font-semibold text-foreground">Vipul</span>) have full access
                to both <span className="font-semibold text-foreground">FlightLogger</span> and{" "}
                <span className="font-semibold text-foreground">E-Learning</span>. Parth Bhatt (
                <code className="font-mono text-xs text-primary">{PARTH_EMAIL}</code>) is strictly
                locked to <span className="font-semibold text-foreground">E-Learning only</span> in
                both the UI and Git. Instruct him below on what needs to be done and what NOT to do,
                review his activity reports, and click{" "}
                <span className="font-semibold text-primary">&ldquo;Show Changes in UI&rdquo;</span>{" "}
                to visually inspect every module change he makes.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                Parth Bhatt — Assigned E-Learning Development Tasks &amp; Instructions from Vipul
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-4xl leading-relaxed">
                Welcome, <span className="font-semibold text-foreground">Parth Bhatt</span>. Your
                workspace is restricted exclusively to{" "}
                <span className="font-semibold text-foreground">SilverArrows E-Learning</span>{" "}
                (FlightLogger Operations OS is disabled for your account and branch). Review
                Vipul&apos;s instructions (<span className="text-emerald-600 dark:text-emerald-400 font-semibold">What To Do</span>{" "}
                &amp; <span className="text-destructive font-semibold">What NOT To Do</span>) below,
                work on your assigned E-Learning modules, and submit your progress report before
                pushing to <code className="font-mono text-xs text-primary">origin/parthbhatt</code>.
              </p>
            </>
          )}
        </div>

        {/* Action Buttons for Vipul vs Parth */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {isAdmin && (
            <>
              <Button
                onClick={() => setNewDirectiveOpen(true)}
                data-testid="btn-assign-parth-directive"
                className="rounded-full font-bold shadow-xs"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Instruct Parth (New Task)
              </Button>
              {onSwitchUser && (
                <Button
                  variant="outline"
                  onClick={() => onSwitchUser(PARTH_EMAIL)}
                  data-testid="btn-preview-as-parth"
                  className="rounded-full font-semibold border-primary/40 text-primary hover:bg-primary/10"
                >
                  <UserCheck className="mr-1.5 h-4 w-4" />
                  Preview UI as Parth Bhatt
                </Button>
              )}
            </>
          )}
          {isParth && onSwitchUser && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs text-amber-700 dark:text-amber-300 font-medium flex items-center gap-2">
              <Lock className="h-4 w-4 shrink-0" />
              <span>E-Learning Only Session Active · FlightLogger Locked</span>
            </div>
          )}
        </div>
      </div>

      {/* VIPUL ADMIN BAR: 1-Click Control of Which E-Learning Modules Parth Bhatt Has Assigned */}
      {isAdmin && (
        <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Parth Bhatt&apos;s Assigned E-Learning Modules (Click to Toggle Access)
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">
              Parth can only view and work on the E-Learning courses enabled here (FlightLogger is
              always 100% blocked).
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ELEARNING_MODULES.map((mod) => {
              const assigned = isCourseAssignedToUser(parthMember.id, mod.id, data);
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => handleToggleParthCourse(mod.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                    assigned
                      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {assigned ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[3]" />
                  ) : (
                    <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span>{mod.title}</span>
                  <span className="text-[10px] opacity-75">
                    ({assigned ? "Assigned" : "Not Assigned"})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TASKS, INSTRUCTIONS ("WHAT TO DO" / "WHAT NOT TO DO") & PARTH'S WORK REPORTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-primary" />
            <span>
              {isAdmin
                ? "Assigned Module Directives & Parth Bhatt's Work Reports"
                : "Your Assigned Module Directives from Vipul (Administrator)"}
            </span>
          </h3>
          <span className="font-mono text-xs text-muted-foreground">
            Repo: github.com/vipulgaur/silverarrowsmvp · Branch: parthbhatt
          </span>
        </div>

        <div className="grid gap-5">
          {workspace.tasks.map((task) => {
            const badge = statusBadge(task.status);
            return (
              <div
                key={task.id}
                data-testid={`dev-task-card-${task.id}`}
                className="rounded-2xl border border-border bg-background/90 p-5 shadow-xs space-y-4 transition hover:border-primary/40"
              >
                {/* Task Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-3.5">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">
                        {task.id}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-foreground">
                        {task.courseTitle} · {task.targetChapterLabel}
                      </span>
                      <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                        Priority: {task.priority}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-foreground">
                      {task.title}
                    </h4>
                  </div>

                  {/* Quick Actions on Task */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        onInspectChangeInUi({
                          task,
                          report: task.reports[0],
                          courseId: task.courseId,
                          chapterId: task.targetChapterId,
                        })
                      }
                      data-testid={`btn-open-task-ui-${task.id}`}
                      className="rounded-full text-xs font-bold border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      {isAdmin ? "Show Module / Changes in UI" : "Open Target Module in UI"}
                    </Button>

                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenEditDirective(task)}
                        className="rounded-full text-xs font-semibold"
                      >
                        <Pencil className="mr-1.5 h-3.5 w-3.5" />
                        Edit Instructions
                      </Button>
                    )}

                    {isParth && (
                      <Button
                        size="sm"
                        onClick={() => handleOpenParthReportModal(task)}
                        data-testid={`btn-submit-report-${task.id}`}
                        className="rounded-full text-xs font-bold"
                      >
                        <Send className="mr-1.5 h-3.5 w-3.5" />
                        Submit Work Report
                      </Button>
                    )}
                  </div>
                </div>

                {/* Two-Column Directives: WHAT NEEDS TO BE DONE vs WHAT NOT TO DO */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Green Box: What Needs To Be Done */}
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>What Needs To Be Done (Vipul&apos;s Instructions)</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-foreground/90 pl-1">
                      {task.whatToDo.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Red Box: What NOT To Do */}
                  <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-destructive">
                      <ShieldAlert className="h-4 w-4 shrink-0" />
                      <span>What NOT To Do (Strict Boundaries)</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-foreground/90 pl-1">
                      {task.whatNotToDo.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Allowed Files Pill Bar */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="inline-flex items-center gap-1 font-semibold text-muted-foreground">
                    <FileCode className="h-3.5 w-3.5 text-primary" /> Allowed E-Learning Files:
                  </span>
                  {task.allowedFiles.map((file, i) => (
                    <code
                      key={i}
                      className="rounded-md border border-border bg-muted/50 px-2 py-0.5 font-mono text-[11px] text-foreground"
                    >
                      {file}
                    </code>
                  ))}
                </div>

                {/* Admin Review Note if present */}
                {task.adminReviewNote && (
                  <div className="rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-2.5 text-xs flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-primary">Vipul&apos;s Review Note: </span>
                      <span className="text-foreground">{task.adminReviewNote}</span>
                    </div>
                  </div>
                )}

                {/* Parth's Submitted Work Reports & Change Logs for this Task */}
                <div className="border-t border-border/60 pt-3.5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <GitCommit className="h-3.5 w-3.5 text-primary" />
                      <span>
                        Parth Bhatt&apos;s Work &amp; Change Reports ({task.reports.length})
                      </span>
                    </span>

                    {isAdmin && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAdminDecision(task, "approved")}
                          className="h-7 rounded-full px-3 text-[11px] font-bold border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white"
                        >
                          <Check className="mr-1 h-3 w-3" /> Approve Task
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAdminDecision(task, "changes_requested")}
                          className="h-7 rounded-full px-3 text-[11px] font-bold border-destructive/40 text-destructive hover:bg-destructive hover:text-white"
                        >
                          <XCircle className="mr-1 h-3 w-3" /> Request Changes
                        </Button>
                      </div>
                    )}
                  </div>

                  {task.reports.length === 0 ? (
                    <p className="text-xs italic text-muted-foreground">
                      No work report submitted yet for this task.
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {task.reports.map((rep) => (
                        <div
                          key={rep.id}
                          className="rounded-xl border border-border bg-card p-3.5 text-xs space-y-2.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-foreground">{rep.submittedBy}</span>
                              <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                                Commit: {rep.commitHash}
                              </span>
                              <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                                Branch: {rep.branch}
                              </span>
                              <span className="text-muted-foreground">
                                · {new Date(rep.submittedAt).toLocaleString()}
                              </span>
                            </div>

                            <Button
                              size="sm"
                              onClick={() =>
                                onInspectChangeInUi({
                                  task,
                                  report: rep,
                                  courseId: rep.uiPreview.courseId,
                                  chapterId: rep.uiPreview.chapterId,
                                })
                              }
                              className="h-7 rounded-full px-3 text-[11px] font-bold"
                            >
                              <Eye className="mr-1.5 h-3 w-3" />
                              Show Changes in UI ({rep.uiPreview.sectionHighlight})
                            </Button>
                          </div>

                          <p className="font-semibold text-foreground">{rep.summary}</p>

                          <ul className="space-y-1 pl-1 text-muted-foreground">
                            {rep.changesMade.map((chg, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary font-bold">→</span>
                                <span>{chg}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[11px] font-semibold text-muted-foreground">
                              Modified Files:
                            </span>
                            {rep.filesChanged.map((f, i) => (
                              <code
                                key={i}
                                className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground"
                              >
                                {f}
                              </code>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Git CLI Sync Reference Bar */}
      <div className="rounded-2xl border border-border bg-muted/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <Terminal className="h-4 w-4 text-primary shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <span className="font-bold text-foreground">
              {isAdmin ? "Vipul's Git Sync & Report Commands:" : "Parth's Git Push Commands:"}
            </span>{" "}
            {isAdmin ? (
              <span className="text-muted-foreground">
                Run <code className="font-mono text-primary font-semibold">npm run elearning:report</code>{" "}
                to see Parth&apos;s remote commits &amp; diffs, or{" "}
                <code className="font-mono text-primary font-semibold">npm run elearning:pull</code>{" "}
                to pull his verified E-Learning changes into your application.
              </span>
            ) : (
              <span className="text-muted-foreground">
                Run{" "}
                <code className="font-mono text-primary font-semibold">
                  npm run elearning:verify
                </code>{" "}
                to verify you only touched E-Learning files, then{" "}
                <code className="font-mono text-primary font-semibold">
                  git push origin parthbhatt
                </code>{" "}
                when Vipul asks you to push.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* DIALOG 1: VIPUL ASSIGNS NEW TASK / DIRECTIVE TO PARTH */}
      <Dialog open={newDirectiveOpen} onOpenChange={setNewDirectiveOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Code2 className="h-5 w-5 text-primary" />
              <span>Instruct Parth Bhatt — New E-Learning Module Directive</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Specify the target E-Learning course and chapter, what Parth needs to build/fix, and
              strict boundaries on what he must NOT touch.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Directive / Task Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Add Interactive Pitot-Static System Diagram Callouts in Pooley Chapter 3"
                className="text-xs"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Target E-Learning Course</Label>
                <select
                  value={courseId}
                  onChange={(e) => {
                    const nextCourse = e.target.value as CourseId;
                    setCourseId(nextCourse);
                    const chs = chaptersForCourse(nextCourse);
                    setChapterId(chs[0]?.id ?? "chapter-01");
                  }}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  {ELEARNING_MODULES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Target Chapter</Label>
                <select
                  value={chapterId}
                  onChange={(e) => setChapterId(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  {availableChapters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Priority</Label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as DevTaskPriority)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                What Needs To Be Done (One instruction per line)
              </Label>
              <textarea
                rows={4}
                value={whatToDoText}
                onChange={(e) => setWhatToDoText(e.target.value)}
                className="w-full rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-3 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-destructive">
                What NOT To Do — Strict Prohibitions (One restriction per line)
              </Label>
              <textarea
                rows={4}
                value={whatNotToDoText}
                onChange={(e) => setWhatNotToDoText(e.target.value)}
                className="w-full rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-destructive"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Allowed Files (Comma-separated)</Label>
              <Input
                value={allowedFilesText}
                onChange={(e) => setAllowedFilesText(e.target.value)}
                className="text-xs font-mono"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setNewDirectiveOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateDirective} className="font-bold">
              Assign Directive to Parth Bhatt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: VIPUL EDITS INSTRUCTIONS ON EXISTING TASK */}
      <Dialog open={Boolean(editingTask)} onOpenChange={(o) => !o && setEditingTask(null)}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Update Instructions for {editingTask?.id} ({editingTask?.courseTitle})
            </DialogTitle>
            <DialogDescription className="text-xs">
              Modify what Parth needs to do or what he must NOT do on this module.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                What Needs To Be Done (One per line)
              </Label>
              <textarea
                rows={4}
                value={editDoText}
                onChange={(e) => setEditDoText(e.target.value)}
                className="w-full rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-3 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-destructive">
                What NOT To Do (One per line)
              </Label>
              <textarea
                rows={4}
                value={editNotDoText}
                onChange={(e) => setEditNotDoText(e.target.value)}
                className="w-full rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Review / Guidance Note for Parth</Label>
              <Input
                value={editReviewNote}
                onChange={(e) => setEditReviewNote(e.target.value)}
                placeholder="e.g. Focus on Chapter 3 diagrams first before touching Chapter 4."
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setEditingTask(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveEditedDirective} className="font-bold">
              Save Updated Instructions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: PARTH SUBMITS WORK REPORT TO VIPUL */}
      <Dialog open={Boolean(reportingTask)} onOpenChange={(o) => !o && setReportingTask(null)}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Submit E-Learning Work Report to Vipul ({reportingTask?.id})
            </DialogTitle>
            <DialogDescription className="text-xs">
              Record the changes you made in {reportingTask?.courseTitle}. Vipul will see this
              report and can preview your exact changes in the UI.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Task Status</Label>
                <select
                  value={reportStatus}
                  onChange={(e) => setReportStatus(e.target.value as DevTaskStatus)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="in_progress">In Progress (Still Working)</option>
                  <option value="ready_for_review">Ready for Vipul&apos;s Review</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Section / Diagram Modified</Label>
                <Input
                  value={reportSectionHighlight}
                  onChange={(e) => setReportSectionHighlight(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Summary of Work Completed</Label>
              <Input
                value={reportSummary}
                onChange={(e) => setReportSummary(e.target.value)}
                placeholder="Brief summary of what you implemented..."
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Detailed Changes Made (One bullet per line)
              </Label>
              <textarea
                rows={4}
                value={reportChangesText}
                onChange={(e) => setReportChangesText(e.target.value)}
                className="w-full rounded-xl border border-input bg-background p-3 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Modified E-Learning Files</Label>
              <Input
                value={reportFilesText}
                onChange={(e) => setReportFilesText(e.target.value)}
                className="text-xs font-mono"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setReportingTask(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmitParthReport} className="font-bold">
              Submit Report to Vipul
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
