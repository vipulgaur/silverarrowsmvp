import { useState } from "react";
import { format } from "date-fns";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Flame,
  GraduationCap,
  Layers,
  Lock,
  Play,
  Scale,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LearningReader } from "@/components/learning-reader";
import { useStore } from "@/lib/store";
import {
  AIR_LAW_TOPICS,
  accessibleModulesFor,
  courseAssignmentInfo,
  type CourseId,
  type ELearningModule,
} from "@/lib/elearning-courses";
import { learningChapters } from "@/lib/learning-content";
import { courseProgress, saveLearningRecord } from "@/lib/learning-state";
import { AirLawChapterExperience } from "@/components/air-law-chapter-experience";
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
import type { LearningRecord, User } from "@/lib/types";

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
  const { data, me } = useStore();
  const [activeCourse, setActiveCourse] = useState<{
    courseId: CourseId;
    chapterId: string;
  } | null>(null);

  const isSelf = me?.id === person.id;
  const assignedModules = accessibleModulesFor(person, data);

  if (activeCourse) {
    // Security guard: verify the person actually has access to activeCourse
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
                ? "Administrator view of all academy courses."
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
                        Assigned Course
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

                    {info && (
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

                <div className="flex shrink-0 flex-col sm:flex-row items-stretch sm:items-center gap-2 border-t border-border pt-3 lg:border-t-0 lg:pt-0">
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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
