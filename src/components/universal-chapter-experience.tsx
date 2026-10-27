import { useState, useMemo, type KeyboardEvent } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  Eye,
  HelpCircle,
  ImageIcon,
  Info,
  Layers,
  Lightbulb,
  Plane,
  RotateCcw,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LearningBlocks } from "@/components/learning-blocks";
import type { LearningChapter } from "@/lib/learning-content";
import {
  getUniversalChapterData,
  type UniversalIllustrationItem,
} from "@/lib/universal-chapter-data";

export interface UniversalChapterExperienceProps {
  chapter: LearningChapter;
  courseKey?: string;
  courseTitle?: string;
  completed: boolean;
  onToggleComplete: () => void;
  onJumpToSection?: (sectionId: string) => void;
  onLogInteraction?: (action: string, details: string) => void;
}

export function UniversalChapterExperience({
  chapter,
  courseKey = "pooley",
  courseTitle = "E-Learning",
  completed,
  onToggleComplete,
  onJumpToSection,
  onLogInteraction,
}: UniversalChapterExperienceProps) {
  // Extract and synthesize interactive data for this specific chapter
  const data = useMemo(
    () => getUniversalChapterData(chapter, courseKey),
    [chapter, courseKey],
  );

  // Guided Introduction state
  const [guidedOpen, setGuidedOpen] = useState(true);
  const [guidedStepIndex, setGuidedStepIndex] = useState(0);
  const [visitedGuidedSteps, setVisitedGuidedSteps] = useState<number[]>([0]);

  // Progressive disclosure for syllabus sections (Section 1 expanded by default)
  const defaultExpanded = chapter.sections[0] ? [chapter.sections[0].id] : [];
  const [expandedSectionIds, setExpandedSectionIds] = useState<string[]>(defaultExpanded);

  // Knowledge Checks state: questionId -> selectedOptionId
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Illustration / Figure Explorer state
  const [activeIllustrationIndex, setActiveIllustrationIndex] = useState(0);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [exploredFigures, setExploredFigures] = useState<string[]>([]);

  const activeGuidedStep = data.guidedSteps[guidedStepIndex] ?? data.guidedSteps[0]!;
  const currentFigure: UniversalIllustrationItem | undefined = data.illustrations[activeIllustrationIndex];

  const totalCalloutsCount = data.illustrations.reduce(
    (acc, fig) => acc + (fig.asset?.parts.length ?? 0),
    0,
  );

  const selectedPart = currentFigure?.asset?.parts.find((p) => p.id === selectedHotspotId) ?? null;

  const answeredCount = Object.keys(answers).length;
  const correctCount = data.knowledgeChecks.filter(
    (q) => answers[q.id] === q.correctOptionId,
  ).length;

  function scrollToElement(elementId: string, label?: string) {
    if (onJumpToSection && elementId.startsWith("section-")) {
      onJumpToSection(elementId);
    } else {
      const el = document.getElementById(elementId);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (label) {
      onLogInteraction?.("learning_nav_jump", `Navigated to ${label}`);
    }
  }

  function handleSelectGuidedStep(nextIdx: number) {
    const clamped = Math.max(0, Math.min(data.guidedSteps.length - 1, nextIdx));
    setGuidedStepIndex(clamped);
    setVisitedGuidedSteps((prev) => (prev.includes(clamped) ? prev : [...prev, clamped]));
    onLogInteraction?.(
      "learning_guided_step",
      `Guided Intro Step ${clamped + 1}: ${data.guidedSteps[clamped]?.title ?? ""}`,
    );
  }

  function handleGuidedKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleSelectGuidedStep(guidedStepIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleSelectGuidedStep(guidedStepIndex - 1);
    }
  }

  function toggleSyllabusSection(sectionId: string) {
    setExpandedSectionIds((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    );
  }

  function expandAllSyllabusSections() {
    if (expandedSectionIds.length === chapter.sections.length) {
      setExpandedSectionIds(chapter.sections[0] ? [chapter.sections[0].id] : []);
    } else {
      setExpandedSectionIds(chapter.sections.map((s) => s.id));
    }
  }

  function jumpToSectionAndExpand(sectionId: string, label?: string) {
    setExpandedSectionIds((prev) => (prev.includes(sectionId) ? prev : [...prev, sectionId]));
    scrollToElement(sectionId, label ?? sectionId);
  }

  function handleSelectAnswer(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    onLogInteraction?.("learning_knowledge_check", `Answered ${questionId} with option ${optionId}`);
  }

  function handleResetQuestion(questionId: string) {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  }

  function handleSelectFigure(index: number) {
    setActiveIllustrationIndex(index);
    setSelectedHotspotId(null);
    const fig = data.illustrations[index];
    if (fig && !exploredFigures.includes(fig.id)) {
      setExploredFigures((prev) => [...prev, fig.id]);
    }
    onLogInteraction?.("learning_figure_selected", `Selected Figure ${fig?.id}`);
  }

  return (
    <div
      data-testid="universal-interactive-chapter"
      className="relative space-y-12 text-foreground rounded-3xl p-1 sm:p-2 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-[size:22px_22px]"
    >
      {/* =====================================================================
          1. STICKY IN-CHAPTER STAGE NAVIGATION BAR
         ===================================================================== */}
      <nav
        aria-label="Chapter learning stages"
        className="sticky top-16 z-30 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border/90 bg-background/90 px-3.5 py-2.5 shadow-sm backdrop-blur-md"
      >
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => scrollToElement("chapter-key-facts", "Key Facts")}
            className="rounded-full px-2.5 py-1 font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            1. Key Facts
          </button>
          <button
            type="button"
            onClick={() => scrollToElement("chapter-guided-intro", "Guided Intro")}
            className="rounded-full px-2.5 py-1 font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            2. Guided Intro
          </button>
          {data.illustrations.length > 0 && (
            <button
              type="button"
              onClick={() => scrollToElement("chapter-figure-explorer", "Technical Figures")}
              className="rounded-full bg-primary/15 px-3 py-1 font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              3. Visual Figures ({data.illustrations.length})
            </button>
          )}
          <button
            type="button"
            onClick={() => scrollToElement("chapter-distinctions", "Core Distinctions")}
            className="rounded-full px-2.5 py-1 font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            {data.illustrations.length > 0 ? "4" : "3"}. Core Theory
          </button>
          <button
            type="button"
            onClick={() => scrollToElement("chapter-syllabus-sections", "Syllabus Sections")}
            className="rounded-full px-2.5 py-1 font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            {data.illustrations.length > 0 ? "5" : "4"}. Syllabus ({chapter.sections.length})
          </button>
          <button
            type="button"
            onClick={() => scrollToElement("chapter-knowledge-checks", "Knowledge Checks")}
            className="rounded-full px-2.5 py-1 font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            {data.illustrations.length > 0 ? "6" : "5"}. Knowledge Checks ({data.knowledgeChecks.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={completed ? "default" : "outline"}
            onClick={onToggleComplete}
            className="h-8 gap-1.5 text-xs font-semibold rounded-full"
          >
            <CheckCircle2 className={`h-3.5 w-3.5 ${completed ? "text-emerald-300" : ""}`} />
            {completed ? "Completed" : "Mark as Complete"}
          </Button>
        </div>
      </nav>

      {/* =====================================================================
          2. CHAPTER HERO AND INTRODUCTION
         ===================================================================== */}
      <section
        id="ch-hero"
        aria-label="Chapter introduction"
        className="rounded-3xl border border-border bg-card/80 p-6 shadow-xs sm:p-8"
      >
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.85fr] lg:items-center">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 font-semibold text-primary">
                <Plane className="h-3.5 w-3.5" />
                {courseTitle}
              </span>
              <span className="rounded-full border border-border bg-background/80 px-2.5 py-0.5 font-medium text-muted-foreground">
                Chapter {chapter.number || 1} · Page {chapter.page}
              </span>
              {completed ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                </span>
              ) : (
                <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 font-semibold text-amber-600 dark:text-amber-400">
                  In Progress
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
              {chapter.title}
            </h1>

            <p className="text-sm leading-relaxed text-muted-foreground">
              This chapter covers core aerodynamic principles, technical systems, and operational procedures in accordance with EASA and Part-FCL standards. Study each concept carefully through guided steps, technical schematics, and interactive practice questions.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                onClick={() =>
                  scrollToElement(
                    data.illustrations.length > 0 ? "chapter-figure-explorer" : "chapter-guided-intro",
                    "Start Learning",
                  )
                }
                className="rounded-full font-semibold shadow-xs"
              >
                <Compass className="mr-1.5 h-4 w-4" />
                Start Learning
              </Button>
              <Button
                variant="outline"
                onClick={() => scrollToElement("chapter-key-facts", "Review Key Facts")}
                className="rounded-full font-medium"
              >
                <Lightbulb className="mr-1.5 h-4 w-4 text-primary" />
                Review Key Facts
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setGuidedOpen(true);
                  scrollToElement("chapter-guided-intro", "Guided Introduction");
                }}
                className="rounded-full text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                {data.guidedSteps.length}-Step Guided Walkthrough →
              </Button>
            </div>
          </div>

          {/* Figure Preview Card */}
          <div className="overflow-hidden rounded-2xl border border-border bg-background/90 p-4 shadow-xs">
            {currentFigure?.asset?.src ? (
              <div className="overflow-hidden rounded-xl border border-border/60 bg-white">
                <img
                  src={currentFigure.asset.src}
                  alt={currentFigure.asset.alt}
                  className="h-44 w-full object-contain p-2 sm:h-48"
                />
              </div>
            ) : (
              <div className="flex h-44 w-full items-center justify-center rounded-xl bg-muted/30 p-4 text-center sm:h-48">
                <div className="space-y-1.5">
                  <BookOpen className="mx-auto h-8 w-8 text-primary/70" />
                  <p className="font-semibold text-sm text-foreground">{chapter.title}</p>
                  <p className="text-xs text-muted-foreground">{chapter.sections.length} syllabus sections</p>
                </div>
              </div>
            )}
            <div className="mt-3 flex items-center justify-between gap-2 px-1 text-xs">
              <div>
                <p className="font-semibold text-foreground">
                  {currentFigure ? currentFigure.title : "Technical Syllabus"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {data.illustrations.length} verified diagrams · {chapter.sections.length} syllabus units
                </p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  scrollToElement(
                    data.illustrations.length > 0 ? "chapter-figure-explorer" : "chapter-key-facts",
                    "Explore Diagram",
                  )
                }
                className="h-8 rounded-full px-3 text-xs font-semibold"
              >
                Explore →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. QUICK REVISION ("REMEMBER / KEY FACTS")
         ===================================================================== */}
      <section
        id="chapter-key-facts"
        aria-labelledby="ch-facts-heading"
        className="scroll-mt-32 space-y-4"
      >
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Quick Revision · Remember
            </p>
            <h2 id="ch-facts-heading" className="mt-1 text-xl font-bold tracking-tight text-foreground">
              Essential Facts for {chapter.title}
            </h2>
          </div>
          <span className="rounded-full bg-muted px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
            {data.keyFacts.length} High-Yield Facts
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {data.keyFacts.map((fact, idx) => (
            <div
              key={fact.id}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card/75 p-4 transition hover:border-primary/60 hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                    {fact.badge}
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-muted-foreground">
                    0{idx + 1}
                  </span>
                </div>
                <p className="mt-2.5 text-xs font-semibold leading-relaxed text-foreground">
                  {fact.statement}
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                  {fact.detail}
                </p>
              </div>

              <button
                type="button"
                onClick={() => jumpToSectionAndExpand(fact.targetSectionId, fact.statement)}
                className="mt-3 inline-flex items-center gap-1 text-left text-[11px] font-semibold text-primary transition group-hover:translate-x-0.5 hover:underline"
              >
                <span>Read Section</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          4. GUIDED STEP-BY-STEP INTRO CAROUSEL ("START HERE")
         ===================================================================== */}
      <section
        id="chapter-guided-intro"
        aria-labelledby="ch-guided-heading"
        onKeyDown={handleGuidedKeyDown}
        className="scroll-mt-32 rounded-3xl border border-border bg-card/85 p-5 shadow-xs sm:p-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
              {guidedStepIndex + 1}/{data.guidedSteps.length}
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Guided Introduction · Step {guidedStepIndex + 1} of {data.guidedSteps.length}
              </p>
              <h2 id="ch-guided-heading" className="text-lg font-bold tracking-tight text-foreground">
                Guided Learning Tour: Step-by-Step Orientation
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGuidedOpen((prev) => !prev)}
              aria-expanded={guidedOpen}
              data-testid="toggle-guided-intro-btn"
              className="h-8 rounded-full px-3 text-xs font-medium"
            >
              {guidedOpen ? (
                <>
                  <ChevronUp className="mr-1 h-3.5 w-3.5" />
                  Skip / Collapse Intro
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1 h-3.5 w-3.5" />
                  Resume Intro (Step {guidedStepIndex + 1}/{data.guidedSteps.length})
                </>
              )}
            </Button>
          </div>
        </div>

        {guidedOpen && (
          <div data-testid="guided-intro-active-card" className="mt-5 space-y-5">
            {/* Step selector pills */}
            <div
              role="tablist"
              aria-label="Guided introduction steps"
              className="flex flex-wrap items-center gap-1.5"
            >
              {data.guidedSteps.map((s, idx) => {
                const isCurrent = idx === guidedStepIndex;
                const isVisited = visitedGuidedSteps.includes(idx);
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    onClick={() => handleSelectGuidedStep(idx)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                      isCurrent
                        ? "border-primary bg-primary text-primary-foreground shadow-xs"
                        : isVisited
                          ? "border-primary/35 bg-primary/10 text-foreground hover:border-primary"
                          : "border-border bg-background/70 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{idx + 1}.</span>
                    <span className="hidden sm:inline">{s.tag}</span>
                    {isVisited && !isCurrent && <Check className="h-3 w-3 text-primary" />}
                  </button>
                );
              })}
            </div>

            {/* Active Guided Card Content */}
            <div className="grid gap-5 rounded-2xl border border-border/80 bg-background/75 p-5 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
              <div className="space-y-3">
                <span className="inline-block rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  {activeGuidedStep.tag}
                </span>
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  {activeGuidedStep.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {activeGuidedStep.summary}
                </p>
                <ul className="space-y-1.5 pt-1 text-xs text-foreground/90">
                  {activeGuidedStep.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col justify-between gap-4 rounded-xl border border-primary/25 bg-primary/5 p-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    Key Takeaway
                  </p>
                  <p className="mt-1.5 text-xs font-medium leading-relaxed text-foreground">
                    {activeGuidedStep.takeaway}
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
                  {data.illustrations.length > 0 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        scrollToElement(
                          "chapter-figure-explorer",
                          `Inspect figures for ${activeGuidedStep.tag}`,
                        )
                      }
                      className="w-full justify-between text-xs font-semibold"
                    >
                      <span>Show on Technical Diagram</span>
                      <Target className="h-3.5 w-3.5 text-primary" />
                    </Button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      jumpToSectionAndExpand(
                        activeGuidedStep.targetSectionId,
                        activeGuidedStep.title,
                      )
                    }
                    className="text-left text-[11px] font-semibold text-primary hover:underline"
                  >
                    Read full syllabus section →
                  </button>
                </div>
              </div>
            </div>

            {/* Guided Intro Previous / Next Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <Button
                variant="outline"
                size="sm"
                disabled={guidedStepIndex === 0}
                onClick={() => handleSelectGuidedStep(guidedStepIndex - 1)}
                className="rounded-full"
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Previous Step
              </Button>

              <span className="text-xs text-muted-foreground">
                Tip: Use Left / Right arrow keys or select any step above
              </span>

              {guidedStepIndex < data.guidedSteps.length - 1 ? (
                <Button
                  size="sm"
                  onClick={() => handleSelectGuidedStep(guidedStepIndex + 1)}
                  className="rounded-full font-semibold"
                >
                  Next Step
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() =>
                    scrollToElement(
                      data.illustrations.length > 0 ? "chapter-figure-explorer" : "chapter-distinctions",
                      "Proceed to Core Content",
                    )
                  }
                  className="rounded-full font-semibold"
                >
                  Proceed to Core Material
                  <ArrowDown className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* =====================================================================
          5. PRIMARY INTERACTIVE FIGURE & HOTSPOT EXPLORER (when figures exist)
         ===================================================================== */}
      {data.illustrations.length > 0 && currentFigure && (
        <section
          id="chapter-figure-explorer"
          aria-labelledby="ch-figures-heading"
          className="scroll-mt-32 rounded-3xl border border-primary/35 bg-card p-5 shadow-sm sm:p-7"
        >
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <Target className="h-3.5 w-3.5" />
                Primary Interactive Figure Explorer
              </p>
              <h2 id="ch-figures-heading" className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                Illustrated Technical Figures &amp; Callouts
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {currentFigure.caption}
              </p>
            </div>

            {/* View Switcher Tabs */}
            <div
              role="tablist"
              aria-label="Chapter figure views"
              className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-border bg-background/80 p-1.5"
            >
              {data.illustrations.map((fig, idx) => {
                const isActive = idx === activeIllustrationIndex;
                const calloutsCount = fig.asset?.parts.length ?? 0;
                return (
                  <button
                    key={fig.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleSelectFigure(idx)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:bg-card hover:text-foreground"
                    }`}
                  >
                    {fig.id} {calloutsCount > 0 ? `(${calloutsCount})` : ""}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Marker state legend */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-full border-2 border-primary bg-background" />
                Unselected
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-3.5 w-3.5 rounded-full bg-primary ring-4 ring-primary/30" />
                Selected (Active)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
                  ✓
                </span>
                Explored ({exploredFigures.length} / {data.illustrations.length})
              </span>
            </div>
            <span>Select any callout marker on the diagram or in the list below</span>
          </div>

          {/* Diagram + Side-by-Side Component Detail Panel */}
          <div
            className={`mt-4 grid gap-6 ${
              selectedPart ? "xl:grid-cols-[1.25fr_0.85fr]" : "grid-cols-1"
            } items-start`}
          >
            {/* Left: Illustration Canvas */}
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-700">
                <span className="font-bold">
                  {currentFigure.id} · {currentFigure.title}
                </span>
                <span className="text-[11px] text-slate-500">
                  {currentFigure.asset?.parts.length ?? 0} verified callouts
                </span>
              </div>

              <div className="relative w-full select-none bg-white flex items-center justify-center">
                {currentFigure.asset?.src ? (
                  <div className="relative w-full aspect-video flex items-center justify-center">
                    <img
                      src={currentFigure.asset.src}
                      alt={currentFigure.asset.alt}
                      className="max-h-full max-w-full object-contain"
                    />

                    {/* Interactive Hotspot Markers */}
                    {currentFigure.asset.parts.map((p) => {
                      const isSelected = selectedHotspotId === p.id;
                      return (
                        <div
                          key={p.id}
                          style={{ left: `${p.x}%`, top: `${p.y}%` }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                        >
                          {isSelected && (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -inset-4 rounded-full border-2 border-primary/70 bg-primary/15 animate-pulse"
                            />
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedHotspotId(p.id)}
                            aria-label={`Callout ${p.number}: ${p.label}`}
                            aria-pressed={isSelected}
                            className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-extrabold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                              isSelected
                                ? "scale-125 border-white bg-primary text-primary-foreground ring-4 ring-primary/40 shadow-xl z-30"
                                : "border-primary bg-white/95 text-slate-900 shadow-md hover:scale-110"
                            }`}
                          >
                            <span>{p.number}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center text-xs text-muted-foreground p-8">
                    <div className="text-center space-y-1.5">
                      <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground/60" />
                      <p className="font-semibold text-foreground">{currentFigure.title}</p>
                      <p className="text-[11px] max-w-sm text-muted-foreground">{currentFigure.caption}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-600">
                {currentFigure.caption}
              </div>
            </div>

            {/* Right: Component Detail Panel */}
            {selectedPart && (
              <aside
                aria-label="Selected component details"
                className="rounded-2xl border border-primary/40 bg-background p-5 shadow-md space-y-4"
              >
                <div className="flex items-start justify-between gap-3 border-b border-border pb-3.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {selectedPart.number}
                      </span>
                      <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-primary">
                        Component Callout
                      </span>
                    </div>
                    <h3 className="pt-1 text-lg font-bold tracking-tight text-foreground">
                      {selectedPart.label}
                    </h3>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Close component details"
                    onClick={() => setSelectedHotspotId(null)}
                    className="h-8 w-8 shrink-0 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                      Primary Function
                    </p>
                    <p className="mt-1 text-foreground/95">
                      {selectedPart.detail}
                    </p>
                  </div>

                  <div className="rounded-xl border border-primary/30 bg-primary/10 p-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                      <Lightbulb className="h-3.5 w-3.5" />
                      Remember
                    </p>
                    <p className="mt-1 text-xs font-semibold text-foreground">
                      Verify component integrity during pre-flight walkaround and monitor instrument indications in flight.
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-3.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedHotspotId(null)}
                    className="h-8 rounded-full text-xs text-muted-foreground w-full"
                  >
                    Close &amp; View Full Diagram
                  </Button>
                </div>
              </aside>
            )}
          </div>

          {/* Callouts Directory Grid */}
          {currentFigure.asset?.parts && currentFigure.asset.parts.length > 0 && (
            <div className="mt-6 border-t border-border pt-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Figure {currentFigure.id} Callout Directory — Select any part to inspect
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentFigure.asset.parts.map((p) => {
                  const isSelected = selectedHotspotId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedHotspotId(p.id)}
                      className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-left text-xs transition ${
                        isSelected
                          ? "border-primary bg-primary/15 text-foreground ring-1 ring-primary/40 shadow-xs"
                          : "border-border bg-background/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                        }`}
                      >
                        {p.number}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="truncate font-semibold text-foreground block">
                          {p.label}
                        </span>
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                          {p.detail}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* =====================================================================
          6. CORE THEORY & "DO NOT CONFUSE" COMPARATIVE CARDS
         ===================================================================== */}
      <section
        id="chapter-distinctions"
        aria-labelledby="ch-dist-heading"
        className="space-y-4"
      >
        <div className="flex items-center gap-2.5 border-b border-border/80 pb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Layers className="h-4 w-4" />
          </span>
          <div>
            <h2 id="ch-dist-heading" className="text-lg font-bold tracking-tight text-foreground">
              Crucial Distinctions &amp; Core Aerodynamic Rules
            </h2>
            <p className="text-xs text-muted-foreground">
              Key operational boundaries and concepts students frequently confuse on checkrides
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {data.distinctions.map((dist) => (
            <div
              key={dist.id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card/85 p-5 shadow-xs space-y-4"
            >
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                {dist.title}
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-background/80 p-3.5">
                  <p className="text-xs font-bold text-primary">{dist.leftName}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{dist.leftRole}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/80 p-3.5">
                  <p className="text-xs font-bold text-foreground">{dist.rightName}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{dist.rightRole}</p>
                </div>
              </div>

              <div className="rounded-xl bg-primary/10 px-3.5 py-2.5 text-xs font-medium text-foreground">
                <strong className="text-primary">Important Distinction: </strong>
                {dist.keyDifference}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          7. PROGRESSIVE DISCLOSURE SYLLABUS ACCORDION SECTIONS
         ===================================================================== */}
      <section
        id="chapter-syllabus-sections"
        aria-labelledby="ch-sections-heading"
        className="space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <BookOpen className="h-4 w-4" />
            </span>
            <div>
              <h2 id="ch-sections-heading" className="text-lg font-bold tracking-tight text-foreground">
                Complete Syllabus Curriculum ({chapter.sections.length} Sections)
              </h2>
              <p className="text-xs text-muted-foreground">
                Expandable technical syllabus with formatted engineering diagrams, tables, and notes
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={expandAllSyllabusSections}
            className="h-8 gap-1.5 text-xs font-semibold rounded-full"
          >
            {expandedSectionIds.length === chapter.sections.length ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" /> Collapse All
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" /> Expand All ({chapter.sections.length})
              </>
            )}
          </Button>
        </div>

        <div className="space-y-3">
          {chapter.sections.map((section, idx) => {
            const isExpanded = expandedSectionIds.includes(section.id);
            return (
              <div
                key={section.id}
                id={section.id}
                className="scroll-mt-32 rounded-2xl border border-border bg-card transition hover:border-primary/40 shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleSyllabusSection(section.id)}
                  aria-expanded={isExpanded}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-mono text-xs font-bold text-primary">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base text-foreground">
                        {section.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        {section.blocks.length} content blocks · ~{Math.max(1, Math.round(section.blocks.length * 1.5))} min read
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {isExpanded ? "Hide Details" : "Show Details"}
                    </span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border/70 p-5 sm:p-6 bg-card/50">
                    <LearningBlocks blocks={section.blocks} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          8. INTERACTIVE KNOWLEDGE CHECKS (Instant Feedback)
         ===================================================================== */}
      <section
        id="chapter-knowledge-checks"
        aria-labelledby="ch-quiz-heading"
        className="rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-7 space-y-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <HelpCircle className="h-3.5 w-3.5" />
              Interactive Knowledge Checks
            </p>
            <h2 id="ch-quiz-heading" className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              Verify Your Understanding ({correctCount} / {data.knowledgeChecks.length} Correct)
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Select an answer on each question for immediate explanation and misconception feedback.
            </p>
          </div>

          {answeredCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAnswers({})}
              className="rounded-full text-xs"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset All Questions
            </Button>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {data.knowledgeChecks.map((q) => {
            const selectedOpt = answers[q.id];
            const isAnswered = Boolean(selectedOpt);
            const isCorrect = selectedOpt === q.correctOptionId;

            return (
              <div
                key={q.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-background/85 p-5 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="rounded-md bg-primary/10 px-2.5 py-0.5 font-bold text-primary">
                      Question {q.questionNumber}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {q.sourceSectionTitle}
                    </span>
                  </div>

                  <p className="text-sm font-bold leading-snug text-foreground">
                    {q.question}
                  </p>

                  {/* Options List */}
                  <div className="space-y-2 pt-1">
                    {q.options.map((opt) => {
                      const isThisSelected = selectedOpt === opt.id;
                      const isThisCorrect = opt.id === q.correctOptionId;

                      let btnClass = "border-border bg-card/70 text-foreground hover:border-primary/50";
                      if (isAnswered) {
                        if (isThisCorrect) {
                          btnClass = "border-emerald-500 bg-emerald-500/10 text-foreground font-semibold";
                        } else if (isThisSelected && !isCorrect) {
                          btnClass = "border-destructive bg-destructive/10 text-foreground";
                        } else {
                          btnClass = "border-border/60 bg-card/30 text-muted-foreground opacity-75";
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          data-testid={`kc-option-${q.id}-${opt.id}`}
                          onClick={() => handleSelectAnswer(q.id, opt.id)}
                          className={`flex w-full items-start gap-2.5 rounded-xl border p-3 text-left text-xs leading-relaxed transition ${btnClass}`}
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[11px] font-bold uppercase">
                            {opt.label}
                          </span>
                          <span className="flex-1">{opt.text}</span>
                          {isAnswered && isThisCorrect && (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              <Check className="h-3 w-3" /> Correct
                            </span>
                          )}
                          {isAnswered && isThisSelected && !isCorrect && (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-destructive/20 px-2 py-0.5 text-[10px] font-bold text-destructive">
                              <X className="h-3 w-3" /> Selected
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Instant Feedback Banner */}
                {isAnswered && (
                  <div
                    data-testid={`kc-feedback-${q.id}`}
                    className={`rounded-xl border p-3.5 text-xs space-y-2 ${
                      isCorrect
                        ? "border-emerald-500/40 bg-emerald-500/10 text-foreground"
                        : "border-amber-500/40 bg-amber-500/10 text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold">
                        {isCorrect ? "✓ Correct — Well done!" : "Not quite — Review explanation below:"}
                      </span>
                      {!isCorrect && (
                        <button
                          type="button"
                          onClick={() => handleResetQuestion(q.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                        >
                          <RotateCcw className="h-3 w-3" /> Retry
                        </button>
                      )}
                    </div>
                    <p className="leading-relaxed text-foreground/95">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          9. CHAPTER SUMMARY AND REVISION CHECKLIST
         ===================================================================== */}
      <footer className="rounded-3xl border border-primary/35 bg-card/90 p-6 shadow-xs sm:p-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Chapter Summary &amp; Rapid Revision
            </p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {chapter.title} Revision Checklist
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Review core technical concepts before completing this syllabus module.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              scrollToElement(
                data.illustrations.length > 0 ? "chapter-figure-explorer" : "chapter-key-facts",
                "Return to Top",
              )
            }
            className="rounded-full text-xs font-semibold"
          >
            <ArrowUp className="mr-1.5 h-3.5 w-3.5" />
            Return to Top
          </Button>
        </div>

        {/* 3-Column ASD-STE100 Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background/80 p-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              1. Core Theory &amp; Operations
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• <strong className="text-foreground">Principles:</strong> Master fundamental aerodynamic laws and aircraft systems.</li>
              <li>• <strong className="text-foreground">Limitations:</strong> Respect all airframe, engine, and airspeed limitations.</li>
              <li>• <strong className="text-foreground">Airmanship:</strong> Maintain constant look-out scan and situational awareness.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-background/80 p-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              2. Systems &amp; Instruments
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• <strong className="text-foreground">Instruments:</strong> Scan flight instruments to cross-check natural horizons.</li>
              <li>• <strong className="text-foreground">Controls:</strong> Coordinate primary controls with power and trim settings.</li>
              <li>• <strong className="text-foreground">Redundancy:</strong> Monitor dual ignition, fuel sumps, and electrical buses.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-background/80 p-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              3. Checklists &amp; Regulations
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• <strong className="text-foreground">SOPs:</strong> Back cockpit memory flows with written aircraft checklists.</li>
              <li>• <strong className="text-foreground">Documents:</strong> Verify Tech Log, airworthiness, and fuel reserves before flight.</li>
              <li>• <strong className="text-foreground">Securing:</strong> Ensure switches OFF, control locks installed, and aircraft parked safely.</li>
            </ul>
          </div>
        </div>

        {/* Completion status strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {data.illustrations.length > 0 && (
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                <span>
                  Figures Explored:{" "}
                  <strong>
                    {exploredFigures.length} / {data.illustrations.length}
                  </strong>
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>
                Knowledge Checks:{" "}
                <strong>
                  {correctCount} / {data.knowledgeChecks.length} Correct
                </strong>
              </span>
            </div>
          </div>

          <Button
            onClick={() => {
              onToggleComplete();
              toast.success(
                completed
                  ? `Marked ${chapter.title} as in-progress.`
                  : `🎉 Successfully completed ${chapter.title}!`,
              );
            }}
            className="rounded-full font-semibold gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="h-4 w-4" />
            {completed ? "Mark as Incomplete" : `Complete ${chapter.title}`}
          </Button>
        </div>
      </footer>
    </div>
  );
}
