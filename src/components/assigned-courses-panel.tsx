import { useState } from "react";
import { format } from "date-fns";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Flame,
  GraduationCap,
  Layers,
  Lock,
  Play,
  Scale,
  Search,
  ShieldCheck,
  UserMinus,
  UserPlus,
  Users,
  X,
  Zap,
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
import { Progress } from "@/components/ui/progress";
import { LearningReader } from "@/components/learning-reader";
import { useStore } from "@/lib/store";
import {
  AIR_LAW_TOPICS,
  accessibleModulesFor,
  assignCourseToUsers,
  courseAssignmentInfo,
  unassignCourseFromUsers,
  usersAssignedToCourse,
  type CourseId,
  type ELearningModule,
} from "@/lib/elearning-courses";
import { learningChapters } from "@/lib/learning-content";
import { courseProgress, saveLearningRecord } from "@/lib/learning-state";
import {
  airframesChapters,
  airframesChapterById,
  airframesCourseTitle,
  airframesCourseSubtitle,
  airframesBookExtras,
} from "@/lib/airframes-content";
import {
  electricsChapters,
  electricsChapterById,
  electricsCourseTitle,
  electricsCourseSubtitle,
  electricsBookExtras,
} from "@/lib/electrics-content";
import {
  powerplantChapters,
  powerplantChapterById,
  powerplantCourseTitle,
  powerplantCourseSubtitle,
  powerplantBookExtras,
} from "@/lib/powerplant-content";
import {
  airlawChapters,
  airlawChapterById,
  airlawCourseTitle,
  airlawCourseSubtitle,
  airlawBookExtras,
} from "@/lib/airlaw-content";
import { roleLabel, type LearningRecord, type User } from "@/lib/types";

function getCourseModuleProgress(courseId: CourseId, memberId: string, records: LearningRecord[]) {
  if (courseId === "pooley") {
    const p = courseProgress(records, memberId, learningChapters, "");
    const available = learningChapters.filter((c) => c.sections.length > 0);
    const nextChapter = available.find(
      (c) => !records.some((r) => r.memberId === memberId && r.chapterId === c.id && r.completed),
    );
    return {
      ...p,
      resumeChapterId: nextChapter?.id ?? "chapter-01",
      resumeTitle: nextChapter ? `Ch ${nextChapter.number}: ${nextChapter.title}` : undefined,
    };
  }
  if (courseId === "airframes") {
    const p = courseProgress(records, memberId, airframesChapters, "airframes");
    const available = airframesChapters.filter((c) => c.sections.length > 0);
    const nextChapter = available.find(
      (c) =>
        !records.some(
          (r) => r.memberId === memberId && r.chapterId === `airframes-${c.id}` && r.completed,
        ),
    );
    return {
      ...p,
      resumeChapterId: nextChapter?.id ?? "chapter-01",
      resumeTitle: nextChapter ? `Ch ${nextChapter.number}: ${nextChapter.title}` : undefined,
    };
  }
  if (courseId === "electrics") {
    const p = courseProgress(records, memberId, electricsChapters, "electrics");
    const available = electricsChapters.filter((c) => c.sections.length > 0);
    const nextChapter = available.find(
      (c) =>
        !records.some(
          (r) => r.memberId === memberId && r.chapterId === `electrics-${c.id}` && r.completed,
        ),
    );
    return {
      ...p,
      resumeChapterId: nextChapter?.id ?? "chapter-01",
      resumeTitle: nextChapter ? `Ch ${nextChapter.number}: ${nextChapter.title}` : undefined,
    };
  }
  if (courseId === "powerplant") {
    const p = courseProgress(records, memberId, powerplantChapters, "powerplant");
    const available = powerplantChapters.filter((c) => c.sections.length > 0);
    const nextChapter = available.find(
      (c) =>
        !records.some(
          (r) => r.memberId === memberId && r.chapterId === `powerplant-${c.id}` && r.completed,
        ),
    );
    return {
      ...p,
      resumeChapterId: nextChapter?.id ?? "chapter-01",
      resumeTitle: nextChapter ? `Ch ${nextChapter.number}: ${nextChapter.title}` : undefined,
    };
  }
  return {
    completed: AIR_LAW_TOPICS.length,
    total: AIR_LAW_TOPICS.length,
    percent: 100,
    resumeChapterId: "chapter-01",
    resumeTitle: "6 Regulatory Units",
  };
}

export function CourseReaderView({
  courseId,
  initialChapterId = "chapter-01",
  onBack,
  backLabel = "Back to Assigned Courses",
}: {
  courseId: CourseId;
  initialChapterId?: string;
  onBack?: () => void;
  backLabel?: string;
}) {
  const [pooleyChapterId, setPooleyChapterId] = useState(initialChapterId);
  const [airframesChapterId, setAirframesChapterId] = useState(initialChapterId);
  const [electricsChapterId, setElectricsChapterId] = useState(initialChapterId);
  const [powerplantChapterId, setPowerplantChapterId] = useState(initialChapterId);
  const [airlawChapterId, setAirlawChapterId] = useState(initialChapterId);
  const { data, me, update, log } = useStore();

  const isAirLawCompleted = Boolean(
    data.learningRecords.some(
      (r) => r.memberId === (me?.id ?? "") && r.chapterId === "airlaw-unit-01" && r.completed,
    ),
  );

  function handleToggleAirLawComplete() {
    if (!me) return;
    const nextCompleted = !isAirLawCompleted;
    const nextRecords = saveLearningRecord(data.learningRecords, me.id, "airlaw-unit-01", {
      completed: nextCompleted,
    });
    update((d) => ({ ...d, learningRecords: nextRecords }));
    log(
      "learning_completion_changed",
      "lesson",
      nextCompleted ? "Completed Air Law course" : "Marked Air Law course incomplete",
      "airlaw-unit-01",
    );
  }
  void handleToggleAirLawComplete;

  if (courseId === "pooley") {
    return (
      <div className="space-y-6">
        {onBack && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 font-medium"
            >
              <ArrowLeft className="h-4 w-4" /> {backLabel}
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span>Air Manual — Pooley · Assigned Course Reader</span>
            </div>
          </div>
        )}
        <LearningReader
          key={pooleyChapterId}
          chapterId={pooleyChapterId}
          onSelectChapter={(id) => {
            setPooleyChapterId(id);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    );
  }

  if (courseId === "airframes") {
    return (
      <div className="space-y-6">
        {onBack && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 font-medium"
            >
              <ArrowLeft className="h-4 w-4" /> {backLabel}
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex h-2 w-2 rounded-full bg-sky-500" />
              <span>CAE ATPL 2: Airframes &amp; Systems · Assigned Course Reader</span>
            </div>
          </div>
        )}
        <LearningReader
          key={airframesChapterId}
          chapterId={airframesChapterId}
          chapters={airframesChapters}
          getChapterById={airframesChapterById}
          courseTitle={airframesCourseTitle}
          courseSubtitle={airframesCourseSubtitle}
          extras={airframesBookExtras}
          courseKey="airframes"
          onSelectChapter={(id) => {
            setAirframesChapterId(id);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    );
  }

  if (courseId === "electrics") {
    return (
      <div className="space-y-6">
        {onBack && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 font-medium"
            >
              <ArrowLeft className="h-4 w-4" /> {backLabel}
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex h-2 w-2 rounded-full bg-amber-500" />
              <span>CAE ATPL 3: Electrics &amp; Electronics · Assigned Course Reader</span>
            </div>
          </div>
        )}
        <LearningReader
          key={electricsChapterId}
          chapterId={electricsChapterId}
          chapters={electricsChapters}
          getChapterById={electricsChapterById}
          courseTitle={electricsCourseTitle}
          courseSubtitle={electricsCourseSubtitle}
          extras={electricsBookExtras}
          courseKey="electrics"
          onSelectChapter={(id) => {
            setElectricsChapterId(id);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    );
  }

  if (courseId === "powerplant") {
    return (
      <div className="space-y-6">
        {onBack && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 font-medium"
            >
              <ArrowLeft className="h-4 w-4" /> {backLabel}
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex h-2 w-2 rounded-full bg-rose-500" />
              <span>CAE ATPL 4: Powerplant · Assigned Course Reader</span>
            </div>
          </div>
        )}
        <LearningReader
          key={powerplantChapterId}
          chapterId={powerplantChapterId}
          chapters={powerplantChapters}
          getChapterById={powerplantChapterById}
          courseTitle={powerplantCourseTitle}
          courseSubtitle={powerplantCourseSubtitle}
          extras={powerplantBookExtras}
          courseKey="powerplant"
          onSelectChapter={(id) => {
            setPowerplantChapterId(id);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {onBack && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2 font-medium"
          >
            <ArrowLeft className="h-4 w-4" /> {backLabel}
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span>CAE ATPL 1: Air Law · Assigned Course Reader</span>
          </div>
        </div>
      )}

      <LearningReader
        key={airlawChapterId}
        chapterId={airlawChapterId}
        chapters={airlawChapters}
        getChapterById={airlawChapterById}
        courseTitle={airlawCourseTitle}
        courseSubtitle={airlawCourseSubtitle}
        extras={airlawBookExtras}
        courseKey="airlaw"
        onSelectChapter={(id) => {
          setAirlawChapterId(id);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
}

export function AssignedCoursesPanel({ person, title }: { person: User; title?: string }) {
  const { data, me, update } = useStore();
  const [activeCourse, setActiveCourse] = useState<{
    courseId: CourseId;
    chapterId: string;
  } | null>(null);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [unassignModalOpen, setUnassignModalOpen] = useState(false);
  const [targetModule, setTargetModule] = useState<ELearningModule | null>(null);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [unassignCandidateIds, setUnassignCandidateIds] = useState<string[]>([]);
  const [candidateSearch, setCandidateSearch] = useState("");
  const [assignmentNote, setAssignmentNote] = useState("");
  const [assigningBusy, setAssigningBusy] = useState(false);
  const [unassigningBusy, setUnassigningBusy] = useState(false);

  const isSelf = me?.id === person.id;
  const isAdminViewer = me?.role === "admin";
  const assignedModules = accessibleModulesFor(person, data);

  const activeCandidates = data.users.filter((u) => u.status === "active" && u.role !== "admin");
  const filteredCandidates = activeCandidates.filter(
    (u) =>
      u.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(candidateSearch.toLowerCase()),
  );

  function handleOpenAssign(mod: ELearningModule) {
    setTargetModule(mod);
    setSelectedCandidateIds(person.role !== "admin" ? [person.id] : []);
    setCandidateSearch("");
    setAssignmentNote("");
    setAssignModalOpen(true);
  }

  function handleOpenUnassign(mod: ELearningModule) {
    setTargetModule(mod);
    const assigned = usersAssignedToCourse(mod.id, data);
    setUnassignCandidateIds(assigned.map((u) => u.id));
    setUnassignModalOpen(true);
  }

  function handleQuickUnassign(courseId: CourseId, userId: string, userName: string) {
    if (!me || me.role !== "admin") return;
    update((prev) => unassignCourseFromUsers([userId], courseId, prev, me).next);
    toast.success(`Course unassigned from ${userName}`);
  }

  async function handleConfirmAssignment() {
    if (!targetModule || !me || me.role !== "admin") return;
    if (selectedCandidateIds.length === 0) {
      toast.error("Please select at least one candidate to assign.");
      return;
    }
    setAssigningBusy(true);
    try {
      const assignedNames = data.users
        .filter((u) => selectedCandidateIds.includes(u.id))
        .map((u) => u.name)
        .join(", ");
      update((prev) =>
        assignCourseToUsers(
          selectedCandidateIds,
          targetModule.id,
          prev,
          me,
          assignmentNote.trim() || undefined,
        ).next,
      );
      toast.success(`"${targetModule.title}" assigned to ${assignedNames}`, {
        description:
          "Assigned students will immediately receive a real-time notification and see this course on their E-Learning dashboard.",
      });
      setAssignModalOpen(false);
    } finally {
      setAssigningBusy(false);
    }
  }

  async function handleConfirmUnassignment() {
    if (!targetModule || !me || me.role !== "admin") return;
    if (unassignCandidateIds.length === 0) {
      toast.error("Please select at least one candidate to unassign.");
      return;
    }
    setUnassigningBusy(true);
    try {
      const removedNames = data.users
        .filter((u) => unassignCandidateIds.includes(u.id))
        .map((u) => u.name)
        .join(", ");
      update((prev) =>
        unassignCourseFromUsers(unassignCandidateIds, targetModule.id, prev, me).next,
      );
      toast.success(`"${targetModule.title}" unassigned from ${removedNames}`);
      setUnassignModalOpen(false);
    } finally {
      setUnassigningBusy(false);
    }
  }

  if (activeCourse) {
    const canView = assignedModules.some((m) => m.id === activeCourse.courseId);
    if (!canView) {
      setActiveCourse(null);
      return null;
    }
    return (
      <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <CourseReaderView
          courseId={activeCourse.courseId}
          initialChapterId={activeCourse.chapterId}
          onBack={() => setActiveCourse(null)}
          backLabel={isSelf ? "Back to My Assigned Courses" : `Back to ${person.name}'s Courses`}
        />
      </section>
    );
  }

  return (
    <section
      aria-label="Assigned E-Learning courses"
      className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">
              {title ??
                (person.role === "admin"
                  ? "All Academy E-Learning Courses"
                  : isSelf
                    ? "My Assigned E-Learning Courses"
                    : `Assigned E-Learning Courses — ${person.name}`)}
            </h2>
            <p className="text-xs text-muted-foreground">
              {person.role === "admin"
                ? "Administrator view of all academy courses. Assign or unassign courses to candidates in real time."
                : `Showing only the specific E-Learning course(s) assigned to ${isSelf ? "your profile" : person.name}.`}
            </p>
          </div>
        </div>

        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {assignedModules.length} {assignedModules.length === 1 ? "Course" : "Courses"} Assigned
        </span>
      </div>

      {assignedModules.length === 0 ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
          <Lock className="h-7 w-7 text-muted-foreground/70" />
          <p className="mt-2 text-sm font-semibold text-foreground">
            No E-Learning courses assigned yet
          </p>
          <p className="mt-1 max-w-md text-xs text-muted-foreground">
            {isSelf
              ? "Your profile currently has no assigned courses. Once an administrator assigns a course (such as Air Law or Air Manual — Pooley) to you, only that assigned course will appear here."
              : `${person.name} has not been assigned any E-Learning courses yet.`}
          </p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {assignedModules.map((mod: ELearningModule) => {
            const Icon =
              mod.id === "pooley"
                ? BookOpen
                : mod.id === "airframes"
                  ? Layers
                  : mod.id === "electrics"
                    ? Zap
                    : mod.id === "powerplant"
                      ? Flame
                      : Scale;
            const info = courseAssignmentInfo(person.id, mod.id, data);
            const prog = getCourseModuleProgress(mod.id, person.id, data.learningRecords);
            const assignedUsers = isAdminViewer ? usersAssignedToCourse(mod.id, data) : [];

            return (
              <div
                key={mod.id}
                className="flex flex-col justify-between gap-5 rounded-2xl border border-border bg-background p-5 transition hover:border-primary/60 lg:flex-row lg:items-center"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-foreground">{mod.title}</h3>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {isAdminViewer ? "Academy Module" : "Assigned Course"}
                      </span>
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {mod.badge}
                      </span>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {mod.subtitle}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
                      {mod.description}
                    </p>

                    <div className="max-w-md pt-1">
                      <div className="mb-1 flex items-center justify-between text-[11px]">
                        <span className="font-medium text-muted-foreground">
                          {prog.completed} of {prog.total} chapters completed
                        </span>
                        <span className="num font-bold text-foreground">{prog.percent}%</span>
                      </div>
                      <Progress value={prog.percent} className="h-1.5" />
                      {prog.resumeTitle && prog.percent < 100 && (
                        <p className="mt-1 text-[11px] text-primary font-medium">
                          Up next: {prog.resumeTitle}
                        </p>
                      )}
                    </div>

                    {isAdminViewer && (
                      <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="inline-flex items-center gap-1 font-semibold text-muted-foreground">
                          <Users className="h-3.5 w-3.5 text-primary" /> Assigned (
                          {assignedUsers.length}):
                        </span>
                        {assignedUsers.length === 0 ? (
                          <span className="text-muted-foreground italic">
                            No candidates assigned yet
                          </span>
                        ) : (
                          assignedUsers.map((u) => (
                            <span
                              key={u.id}
                              className="inline-flex items-center gap-1 rounded-full bg-primary/10 pl-2.5 pr-1.5 py-0.5 text-[11px] font-semibold text-primary"
                            >
                              <span>{u.name}</span>
                              <button
                                type="button"
                                onClick={() => handleQuickUnassign(mod.id, u.id, u.name)}
                                className="h-3.5 w-3.5 rounded-full hover:bg-destructive hover:text-destructive-foreground inline-flex items-center justify-center transition"
                                title={`Unassign ${u.name} from ${mod.title}`}
                                aria-label={`Unassign ${u.name}`}
                              >
                                <X className="h-2.5 w-2.5" />
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                    )}

                    {info && !isAdminViewer && (
                      <div className="mt-2 flex flex-wrap items-center gap-2 pt-1 text-[11px] text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                        <span>
                          Assigned by <strong className="text-foreground">{info.actorName}</strong>{" "}
                          on {format(new Date(info.at), "dd MMM yyyy HH:mm")}
                        </span>
                        {info.note && (
                          <span className="rounded bg-primary/10 px-2 py-0.5 font-medium text-primary">
                            Note: {info.note}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col sm:flex-row lg:flex-col items-stretch gap-2 border-t border-border pt-3 lg:border-t-0 lg:pt-0">
                  {prog.completed > 0 && prog.percent < 100 && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        setActiveCourse({ courseId: mod.id, chapterId: prog.resumeChapterId })
                      }
                      className="w-full sm:w-auto font-semibold"
                    >
                      <Play className="mr-1.5 h-3.5 w-3.5" />
                      Resume Module
                    </Button>
                  )}
                  <Button
                    onClick={() =>
                      setActiveCourse({
                        courseId: mod.id,
                        chapterId:
                          prog.completed > 0 && prog.percent < 100
                            ? prog.resumeChapterId
                            : "chapter-01",
                      })
                    }
                    className="w-full sm:w-auto font-semibold"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    {prog.completed > 0 && prog.percent < 100 ? "Open Reader" : "Launch Course"}
                  </Button>
                  {isAdminViewer && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleOpenAssign(mod)}
                        className="w-full sm:w-auto font-semibold"
                      >
                        <UserPlus className="mr-2 h-4 w-4 text-primary" />
                        Assign Candidates
                      </Button>
                      <Button
                        variant="outline"
                        disabled={assignedUsers.length === 0}
                        onClick={() => handleOpenUnassign(mod)}
                        className="w-full sm:w-auto border-destructive/45 bg-destructive/10 font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <UserMinus className="mr-2 h-4 w-4" />
                        Unassign
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADMIN DIRECT ASSIGNMENT DIALOG */}
      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>Assign {targetModule?.title ?? "Course"} to Candidates</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Select members from the academy roster. Assigned candidates will immediately receive a
              notification chime and see this course on their E-Learning dashboard.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">
                  Select Candidates ({selectedCandidateIds.length} selected)
                </Label>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedCandidateIds(filteredCandidates.map((u) => u.id))}
                    className="font-semibold text-primary hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-muted-foreground">·</span>
                  <button
                    type="button"
                    onClick={() => setSelectedCandidateIds([])}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Filter candidates by name, email, or role…"
                  value={candidateSearch}
                  onChange={(e) => setCandidateSearch(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>

              <div className="max-h-56 overflow-y-auto rounded-xl border border-border divide-y divide-border/60">
                {filteredCandidates.map((u) => {
                  const isChecked = selectedCandidateIds.includes(u.id);
                  const alreadyHas =
                    targetModule &&
                    usersAssignedToCourse(targetModule.id, data).some((x) => x.id === u.id);
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() =>
                        setSelectedCandidateIds((prev) =>
                          prev.includes(u.id) ? prev.filter((x) => x !== u.id) : [...prev, u.id],
                        )
                      }
                      className={`w-full flex items-center justify-between p-2.5 text-left text-xs transition ${
                        isChecked ? "bg-primary/8 font-medium" : "hover:bg-accent/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            isChecked
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-input bg-background"
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <div className="truncate">
                          <span className="font-semibold text-foreground">{u.name}</span>
                          <span className="ml-1.5 text-[11px] text-muted-foreground">
                            ({roleLabel[u.role]})
                          </span>
                          <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                        </div>
                      </div>
                      {alreadyHas && (
                        <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          Already Assigned
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Assignment Note (Optional)</Label>
              <Input
                placeholder="e.g. Complete Chapter 1–3 prior to next ground school session"
                value={assignmentNote}
                onChange={(e) => setAssignmentNote(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" size="sm" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={assigningBusy || selectedCandidateIds.length === 0}
              onClick={handleConfirmAssignment}
              className="font-semibold"
            >
              {assigningBusy ? "Assigning…" : `Confirm & Assign (${selectedCandidateIds.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADMIN UNASSIGNMENT DIALOG */}
      <Dialog open={unassignModalOpen} onOpenChange={setUnassignModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-destructive">
              <UserMinus className="h-5 w-5" />
              <span>Unassign {targetModule?.title ?? "Course"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Select candidates from whom you wish to revoke access to this module.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 space-y-3">
            {targetModule && (
              <div className="space-y-1.5 rounded-xl border border-border p-2 max-h-60 overflow-y-auto">
                {usersAssignedToCourse(targetModule.id, data).length === 0 ? (
                  <p className="p-4 text-center text-xs text-muted-foreground">
                    No candidates are currently assigned to this module.
                  </p>
                ) : (
                  usersAssignedToCourse(targetModule.id, data).map((u) => {
                    const isChecked = unassignCandidateIds.includes(u.id);
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() =>
                          setUnassignCandidateIds((prev) =>
                            prev.includes(u.id) ? prev.filter((x) => x !== u.id) : [...prev, u.id],
                          )
                        }
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition border ${
                          isChecked
                            ? "border-destructive/40 bg-destructive/5 font-medium"
                            : "border-transparent bg-card hover:bg-accent/40"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                              isChecked
                                ? "bg-destructive border-destructive text-destructive-foreground"
                                : "border-input bg-background"
                            }`}
                          >
                            {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <span className="font-semibold text-foreground">{u.name}</span>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            ({roleLabel[u.role]})
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{u.email}</span>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" size="sm" onClick={() => setUnassignModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={unassigningBusy || unassignCandidateIds.length === 0}
              onClick={handleConfirmUnassignment}
              className="font-semibold"
            >
              {unassigningBusy ? "Revoking…" : `Unassign Selected (${unassignCandidateIds.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

