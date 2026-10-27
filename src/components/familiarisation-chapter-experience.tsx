import { useState, type KeyboardEvent } from "react";
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
  Gauge,
  HelpCircle,
  Info,
  Layers,
  Lightbulb,
  Plane,
  RotateCcw,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearningBlocks } from "@/components/learning-blocks";
import {
  CHAPTER_01_CONTROL_AXES,
  CHAPTER_01_DIAGRAM_VIEWS,
  CHAPTER_01_DISTINCTIONS,
  CHAPTER_01_GUIDED_STEPS,
  CHAPTER_01_KEY_FACTS,
  CHAPTER_01_KNOWLEDGE_CHECKS,
  CHAPTER_01_SCAN_SEQUENCE,
  CHAPTER_01_SYLLABUS_SECTIONS,
  type AircraftDiagramView,
  type InteractiveAircraftComponent,
} from "@/lib/chapter-01-redesign-data";
import type { LearningChapter } from "@/lib/learning-content";

export interface FamiliarisationChapterExperienceProps {
  chapter: LearningChapter;
  completed: boolean;
  onToggleComplete: () => void;
  onJumpToSection?: (sectionId: string) => void;
  onLogInteraction?: (action: string, details: string) => void;
}

export function FamiliarisationChapterExperience({
  chapter,
  completed,
  onToggleComplete,
  onJumpToSection,
  onLogInteraction,
}: FamiliarisationChapterExperienceProps) {
  // Guided Introduction state
  const [guidedOpen, setGuidedOpen] = useState(true);
  const [guidedStepIndex, setGuidedStepIndex] = useState(0);
  const [visitedGuidedSteps, setVisitedGuidedSteps] = useState<number[]>([0]);

  // Primary Interactive Aircraft Explorer state
  const [activeViewId, setActiveViewId] = useState<AircraftDiagramView["id"]>("airframe-exterior");
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>("ext-empennage-fin");
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);
  const [exploredComponentIds, setExploredComponentIds] = useState<string[]>(["ext-empennage-fin"]);

  // Three-Axis Control Matrix interactive state
  const [selectedAxisIndex, setSelectedAxisIndex] = useState<number>(0);

  // Progressive disclosure state for syllabus sections (Section 1 open by default; can expand any or all)
  const [expandedSectionIds, setExpandedSectionIds] = useState<string[]>(["section-1"]);

  // Knowledge Checks state: maps questionId -> selectedOptionId
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const activeView =
    CHAPTER_01_DIAGRAM_VIEWS.find((v) => v.id === activeViewId) ?? CHAPTER_01_DIAGRAM_VIEWS[0]!;
  const totalComponentsCount = CHAPTER_01_DIAGRAM_VIEWS.reduce(
    (acc, v) => acc + v.components.length,
    0,
  );
  const selectedComponent: InteractiveAircraftComponent | null =
    activeView.components.find((c) => c.id === selectedComponentId) ?? null;

  const activeGuidedStep =
    CHAPTER_01_GUIDED_STEPS[guidedStepIndex] ?? CHAPTER_01_GUIDED_STEPS[0]!;

  const answeredCount = Object.keys(answers).length;
  const correctCount = CHAPTER_01_KNOWLEDGE_CHECKS.filter(
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
      onLogInteraction?.("learning_chapter01_nav", `Navigated to ${label}`);
    }
  }

  function handleSelectGuidedStep(nextIdx: number) {
    const clamped = Math.max(0, Math.min(CHAPTER_01_GUIDED_STEPS.length - 1, nextIdx));
    setGuidedStepIndex(clamped);
    setVisitedGuidedSteps((prev) => (prev.includes(clamped) ? prev : [...prev, clamped]));
    onLogInteraction?.(
      "learning_guided_step",
      `Guided Intro Step ${clamped + 1}: ${CHAPTER_01_GUIDED_STEPS[clamped]?.title ?? ""}`,
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

  function handleSelectDiagramView(viewId: AircraftDiagramView["id"], defaultCompId?: string) {
    setActiveViewId(viewId);
    const targetView = CHAPTER_01_DIAGRAM_VIEWS.find((v) => v.id === viewId);
    const nextCompId = defaultCompId ?? targetView?.components[0]?.id ?? null;
    setSelectedComponentId(nextCompId);
    if (nextCompId) {
      setExploredComponentIds((prev) => (prev.includes(nextCompId) ? prev : [...prev, nextCompId]));
    }
    onLogInteraction?.("learning_diagram_view_changed", `Switched diagram view to ${viewId}`);
  }

  function handleSelectComponent(component: InteractiveAircraftComponent) {
    setSelectedComponentId(component.id);
    setExploredComponentIds((prev) =>
      prev.includes(component.id) ? prev : [...prev, component.id],
    );
    onLogInteraction?.(
      "learning_component_selected",
      `Inspected aircraft component: ${component.name}`,
    );
  }

  function handleStepComponent(delta: number) {
    const list = activeView.components;
    if (list.length === 0) return;
    const currentIdx = list.findIndex((c) => c.id === selectedComponentId);
    const nextIdx = currentIdx < 0 ? 0 : (currentIdx + delta + list.length) % list.length;
    const nextComp = list[nextIdx];
    if (nextComp) {
      handleSelectComponent(nextComp);
    }
  }

  function toggleSyllabusSection(sectionId: string) {
    setExpandedSectionIds((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    );
  }

  function expandAllSyllabusSections() {
    if (expandedSectionIds.length === CHAPTER_01_SYLLABUS_SECTIONS.length) {
      setExpandedSectionIds(["section-1"]);
    } else {
      setExpandedSectionIds(CHAPTER_01_SYLLABUS_SECTIONS.map((s) => s.id));
    }
  }

  function jumpToSyllabusSectionAndExpand(sectionId: string, label?: string) {
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

  const allSectionBlocksById = Object.fromEntries(
    chapter.sections.map((s) => [s.id, s.blocks]),
  );

  return (
    <div
      data-testid="familiarisation-redesigned-chapter"
      className="relative space-y-12 text-foreground rounded-3xl p-1 sm:p-2 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-[size:22px_22px]"
    >
      {/* =====================================================================
          IN-CHAPTER PROGRESS & QUICK SECTION JUMP BAR
         ===================================================================== */}
      <nav
        aria-label="Chapter learning stages"
        className="sticky top-16 z-30 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border/90 bg-background/90 px-3.5 py-2.5 shadow-sm backdrop-blur-md"
      >
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => scrollToElement("ch1-key-facts", "Key Facts")}
            className="rounded-full px-2.5 py-1 font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            1. Key Facts
          </button>
          <button
            type="button"
            onClick={() => scrollToElement("ch1-guided-intro", "Guided Intro")}
            className="rounded-full px-2.5 py-1 font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            2. Guided Intro
          </button>
          <button
            type="button"
            onClick={() => scrollToElement("ch1-aircraft-explorer", "Interactive Aircraft")}
            className="rounded-full bg-primary/15 px-3 py-1 font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            3. Interactive Aircraft
          </button>
          <button
            type="button"
            onClick={() => scrollToElement("ch1-visual-modules", "Visual Comparisons")}
            className="rounded-full px-2.5 py-1 font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            4. Control &amp; System Visuals
          </button>
          <button
            type="button"
            onClick={() => scrollToElement("section-1", "Syllabus Deep-Dive")}
            className="rounded-full px-2.5 py-1 font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            5. Technical Sections (1–11)
          </button>
          <button
            type="button"
            onClick={() => scrollToElement("ch1-knowledge-checks", "Knowledge Checks")}
            className="rounded-full px-2.5 py-1 font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            6. Knowledge Checks
          </button>
          <button
            type="button"
            onClick={() => scrollToElement("ch1-revision-summary", "Revision Summary")}
            className="rounded-full px-2.5 py-1 font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            7. Summary
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
          <span
            data-testid="explored-components-counter"
            className="rounded-full border border-border bg-card px-2.5 py-0.5 text-foreground"
          >
            {exploredComponentIds.length} / {totalComponentsCount} parts explored
          </span>
          <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-foreground">
            {correctCount} / {CHAPTER_01_KNOWLEDGE_CHECKS.length} checks
          </span>
        </div>
      </nav>

      {/* =====================================================================
          SECTION 3 — CHAPTER HERO AND INTRODUCTION
         ===================================================================== */}
      <section
        id="ch1-hero"
        aria-label="Chapter introduction"
        className="rounded-3xl border border-border bg-card/80 p-6 shadow-xs sm:p-8"
      >
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.85fr] lg:items-center">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 font-semibold text-primary">
                <Plane className="h-3.5 w-3.5" />
                Exercise 1 · Aircraft Familiarisation
              </span>
              <span className="rounded-full border border-border bg-background/80 px-2.5 py-0.5 font-medium text-muted-foreground">
                Air Manual — Pooley · Page {chapter.page}
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

            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Visual Guide to the Training Aeroplane, Cockpit &amp; Systems
            </h3>

            <p className="text-sm leading-relaxed text-muted-foreground">
              An aeroplane is a power-driven, heavier-than-air aircraft. It gets its lift in flight
              from fixed aerodynamic surfaces. Before your first flight, study the five airframe
              groups, the Basic-T instruments, the flight controls, the engine systems, and the
              operating procedures.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                onClick={() => scrollToElement("ch1-aircraft-explorer", "Start Learning — Interactive Aircraft")}
                className="rounded-full font-semibold shadow-xs"
              >
                <Compass className="mr-1.5 h-4 w-4" />
                Start Learning (Interactive Aircraft)
              </Button>
              <Button
                variant="outline"
                onClick={() => scrollToElement("ch1-key-facts", "Review Key Facts")}
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
                  scrollToElement("ch1-guided-intro", "Guided Introduction");
                }}
                className="rounded-full text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                7-Step Guided Walkthrough →
              </Button>
            </div>
          </div>

          {/* Approved Aircraft Diagram Preview Card */}
          <div className="overflow-hidden rounded-2xl border border-border bg-background/90 p-3 shadow-xs">
            <div className="overflow-hidden rounded-xl border border-border/60 bg-white">
              <img
                src={CHAPTER_01_DIAGRAM_VIEWS[0]!.src}
                alt={CHAPTER_01_DIAGRAM_VIEWS[0]!.alt}
                className="h-44 w-full object-contain p-2 sm:h-48"
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between gap-2 px-1 text-xs">
              <div>
                <p className="font-semibold text-foreground">
                  Single-Engine Tricycle Training Aeroplane
                </p>
                <p className="text-[11px] text-muted-foreground">
                  3 interactive views · {totalComponentsCount} clickable callouts · 11 syllabus units
                </p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => scrollToElement("ch1-aircraft-explorer", "Open Interactive Diagram")}
                className="h-8 rounded-full px-3 text-xs font-semibold"
              >
                Explore →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4 — QUICK REVISION ("REMEMBER — KEY FACTS")
         ===================================================================== */}
      <section
        id="ch1-key-facts"
        aria-label="Remember — Key Facts"
        className="scroll-mt-32 space-y-4"
      >
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Quick Revision · Remember
            </p>
            <h3 className="mt-1 text-xl font-bold tracking-tight">
              8 Essential Facts Before Entering the Cockpit
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Select any key fact to jump directly to its detailed syllabus section.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CHAPTER_01_KEY_FACTS.map((fact, idx) => (
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
                onClick={() => jumpToSyllabusSectionAndExpand(fact.targetSectionId, fact.targetLabel)}
                className="mt-3 inline-flex items-center gap-1 text-left text-[11px] font-semibold text-primary transition group-hover:translate-x-0.5 hover:underline"
              >
                <span>{fact.targetLabel}</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          SECTION 5 — OPTIONAL GUIDED INTRODUCTION (7 STEP-BY-STEP CARDS)
         ===================================================================== */}
      <section
        id="ch1-guided-intro"
        aria-label="Guided Introduction to the Aeroplane"
        onKeyDown={handleGuidedKeyDown}
        className="scroll-mt-32 rounded-3xl border border-border bg-card/85 p-5 shadow-xs sm:p-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
              {activeGuidedStep.step}/{CHAPTER_01_GUIDED_STEPS.length}
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Guided Introduction · Step {activeGuidedStep.step} of {CHAPTER_01_GUIDED_STEPS.length}
              </p>
              <h3 className="text-lg font-bold tracking-tight">
                Step-by-Step Aircraft Orientation
              </h3>
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
                  Resume Guided Intro (Step {activeGuidedStep.step}/{CHAPTER_01_GUIDED_STEPS.length})
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
              {CHAPTER_01_GUIDED_STEPS.map((s, idx) => {
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
                    <span>{s.step}.</span>
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
                <h4 className="text-xl font-bold tracking-tight text-foreground">
                  {activeGuidedStep.title}
                </h4>
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
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      handleSelectDiagramView(
                        activeGuidedStep.diagramViewId,
                        activeGuidedStep.highlightComponentId,
                      );
                      scrollToElement(
                        "ch1-aircraft-explorer",
                        `Inspect ${activeGuidedStep.tag} on diagram`,
                      );
                    }}
                    className="w-full justify-between text-xs font-semibold"
                  >
                    <span>Show on Interactive Aircraft</span>
                    <Target className="h-3.5 w-3.5 text-primary" />
                  </Button>
                  <button
                    type="button"
                    onClick={() =>
                      jumpToSyllabusSectionAndExpand(
                        activeGuidedStep.targetSectionId,
                        activeGuidedStep.title,
                      )
                    }
                    className="text-left text-[11px] font-semibold text-primary hover:underline"
                  >
                    Read full section ({activeGuidedStep.targetSectionId.replace("-", " ")}) →
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
                Tip: Use Left / Right arrow keys or click any step above
              </span>

              {guidedStepIndex < CHAPTER_01_GUIDED_STEPS.length - 1 ? (
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
                  onClick={() => scrollToElement("ch1-aircraft-explorer", "Proceed to Interactive Aircraft")}
                  className="rounded-full font-semibold"
                >
                  Explore Interactive Aircraft
                  <ArrowDown className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* =====================================================================
          SECTION 6 & 7 — PRIMARY INTERACTIVE AIRCRAFT OVERVIEW
          Centerpiece visual feature with 3 approved technical diagram views,
          4 distinct marker states (unselected, hovered, selected, explored),
          and a structured Component Explanation panel.
         ===================================================================== */}
      <section
        id="ch1-aircraft-explorer"
        aria-label="Primary Interactive Aircraft Overview"
        data-testid="primary-aircraft-overview"
        className="scroll-mt-32 rounded-3xl border border-primary/35 bg-card p-5 shadow-sm sm:p-7"
      >
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Target className="h-3.5 w-3.5" />
              Primary Interactive Aircraft Overview
            </p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight">
              Explore the Aeroplane, Cockpit Panel &amp; Control Columns
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {activeView.subtitle}
            </p>
          </div>

          {/* View Switcher Tabs */}
          <div
            role="tablist"
            aria-label="Aircraft diagram views"
            className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-border bg-background/80 p-1.5"
          >
            {CHAPTER_01_DIAGRAM_VIEWS.map((v) => {
              const isActive = v.id === activeView.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  data-testid={`diagram-view-tab-${v.id}`}
                  onClick={() => handleSelectDiagramView(v.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-card hover:text-foreground"
                  }`}
                >
                  {v.shortLabel} ({v.components.length})
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
              Selected (Active Callout)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
                ✓
              </span>
              Explored ({exploredComponentIds.length}/{totalComponentsCount})
            </span>
          </div>
          <span>Click any marker on the diagram or any item in the list below</span>
        </div>

        {/* Diagram + Side-by-Side Component Detail Panel */}
        <div
          className={`mt-4 grid gap-6 ${
            selectedComponent ? "xl:grid-cols-[1.25fr_0.85fr]" : "grid-cols-1"
          } items-start`}
        >
          {/* Left: High-Clarity Technical Illustration Canvas with Interactive Markers */}
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-700">
              <span className="font-bold">
                {activeView.figureId} · {activeView.label}
              </span>
              <span className="text-[11px] text-slate-500">
                {activeView.components.length} verified callouts
              </span>
            </div>

            <div className="relative w-full select-none bg-white">
              <img
                src={activeView.src}
                alt={activeView.alt}
                className="block h-auto w-full object-contain"
              />

              {/* Interactive Component Markers */}
              {activeView.components.map((comp) => {
                const isSelected = selectedComponentId === comp.id;
                const isHovered = hoveredComponentId === comp.id;
                const isExplored = exploredComponentIds.includes(comp.id);
                const isRightHalf = comp.x > 58;
                const isBottomHalf = comp.y > 65;

                return (
                  <div
                    key={comp.id}
                    style={{ left: `${comp.x}%`, top: `${comp.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                    onMouseEnter={() => setHoveredComponentId(comp.id)}
                    onMouseLeave={() => setHoveredComponentId(null)}
                  >
                    {/* Highlight Halo around the selected aircraft area */}
                    {isSelected && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-4 rounded-full border-2 border-primary/70 bg-primary/15 animate-pulse"
                      />
                    )}

                    <button
                      type="button"
                      data-testid={`aircraft-marker-${comp.id}`}
                      aria-label={`${comp.number}. ${comp.name}${isSelected ? " (Selected)" : ""}${isExplored ? " (Explored)" : ""}`}
                      aria-pressed={isSelected}
                      onFocus={() => setHoveredComponentId(comp.id)}
                      onBlur={() => setHoveredComponentId(null)}
                      onClick={() => handleSelectComponent(comp)}
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-extrabold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        isSelected
                          ? "scale-125 border-white bg-primary text-primary-foreground ring-4 ring-primary/40 shadow-xl z-30"
                          : isHovered
                            ? "scale-115 border-primary bg-slate-900 text-white shadow-lg z-30"
                            : isExplored
                              ? "border-emerald-600 bg-white/95 text-slate-900 shadow-md hover:scale-110"
                              : "border-primary bg-white/95 text-slate-900 shadow-md hover:scale-110"
                      }`}
                    >
                      <span>{comp.number}</span>
                      {isExplored && (
                        <span
                          aria-hidden="true"
                          className=" -right-1 -top-1 absolute flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white ring-1 ring-white"
                        >
                          ✓
                        </span>
                      )}
                    </button>

                    {/* Quick Hover / Focus Label Pill */}
                    {(isHovered || isSelected) && (
                      <div
                        className={`pointer-events-none absolute z-40 whitespace-nowrap rounded-lg border border-slate-700 bg-slate-900/95 px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg ${
                          isRightHalf ? "right-full mr-2.5" : "left-full ml-2.5"
                        } ${isBottomHalf ? "bottom-0" : "top-0"}`}
                      >
                        {comp.number}. {comp.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-600">
              {activeView.caption}
            </div>
          </div>

          {/* Right: Structured Component Explanation Panel (Section 7 Pattern) */}
          {selectedComponent && (
            <aside
              aria-label="Selected aircraft component details"
              data-testid="selected-component-detail-panel"
              className="rounded-2xl border border-primary/40 bg-background p-5 shadow-md space-y-4"
            >
              <div className="flex items-start justify-between gap-3 border-b border-border pb-3.5">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {selectedComponent.number}
                    </span>
                    <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-primary">
                      {selectedComponent.category}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <Check className="h-3 w-3" /> Explored
                    </span>
                  </div>
                  <h4
                    data-testid="selected-component-name"
                    className="pt-1 text-lg font-bold tracking-tight text-foreground"
                  >
                    {selectedComponent.name}
                  </h4>
                  <p className="text-xs font-medium text-muted-foreground">
                    {selectedComponent.summary}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close component detail panel"
                  data-testid="close-component-detail-btn"
                  onClick={() => setSelectedComponentId(null)}
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
                    {selectedComponent.primaryFunction}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    How It Relates to the Aircraft
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {selectedComponent.aircraftRelationship}
                  </p>
                </div>

                {selectedComponent.constituentParts && selectedComponent.constituentParts.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Constituent Parts
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {selectedComponent.constituentParts.map((part) => (
                        <span
                          key={part}
                          className="rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground"
                        >
                          • {part}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Technical Detail
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {selectedComponent.technicalDetail}
                  </p>
                </div>

                {/* Remember Box */}
                <div className="rounded-xl border border-primary/30 bg-primary/10 p-3">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                    <Lightbulb className="h-3.5 w-3.5" />
                    Remember
                  </p>
                  <p className="mt-1 text-xs font-semibold text-foreground">
                    {selectedComponent.remember}
                  </p>
                </div>
              </div>

              {/* Explore Further & Prev/Next Component Controls */}
              <div className="space-y-3 border-t border-border pt-3.5">
                <button
                  type="button"
                  onClick={() =>
                    jumpToSyllabusSectionAndExpand(
                      selectedComponent.relatedSectionId,
                      selectedComponent.relatedSectionTitle,
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Explore Further: {selectedComponent.relatedSectionTitle}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStepComponent(-1)}
                    className="h-8 rounded-full text-xs"
                  >
                    <ArrowLeft className="mr-1 h-3 w-3" />
                    Prev Part
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedComponentId(null)}
                    className="h-8 rounded-full text-xs text-muted-foreground"
                  >
                    Full Diagram View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStepComponent(1)}
                    className="h-8 rounded-full text-xs"
                  >
                    Next Part
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* Component Directory Grid below the diagram for full keyboard/mobile accessibility */}
        <div className="mt-6 border-t border-border pt-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {activeView.shortLabel} Component Directory — Click any part to inspect
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeView.components.map((comp) => {
              const isSelected = selectedComponentId === comp.id;
              const isExplored = exploredComponentIds.includes(comp.id);
              return (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => handleSelectComponent(comp)}
                  onMouseEnter={() => setHoveredComponentId(comp.id)}
                  onMouseLeave={() => setHoveredComponentId(null)}
                  className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-left text-xs transition ${
                    isSelected
                      ? "border-primary bg-primary/15 text-foreground ring-1 ring-primary/40 shadow-xs"
                      : isExplored
                        ? "border-emerald-500/35 bg-background/80 text-foreground hover:border-primary/50"
                        : "border-border bg-background/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : isExplored
                          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                          : "bg-muted text-foreground"
                    }`}
                  >
                    {comp.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate font-semibold text-foreground">
                        {comp.name}
                      </span>
                      {isExplored && (
                        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                      {comp.category}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 8 — VISUAL EXPLANATION MODULES
          - 8A: Interactive Three-Axis Flight Control Explorer & Reference Table
          - 8B: Side-by-Side Component Comparisons (Easily Confused Pairs)
          - 8C: Numbered Sequential Cockpit Flow & SOP Diagram
         ===================================================================== */}
      <section
        id="ch1-visual-modules"
        aria-label="Visual Explanation Modules"
        className="scroll-mt-32 space-y-10"
      >
        {/* 8A. THREE-AXIS FLIGHT CONTROL EXPLORER */}
        <div className="rounded-3xl border border-border bg-card/85 p-5 shadow-xs sm:p-7 space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <Gauge className="h-3.5 w-3.5" />
                Visual Module A · Primary Flight Controls &amp; Axes
              </p>
              <h3 className="mt-1 text-xl font-bold tracking-tight">
                How Cockpit Inputs Rotate the Aeroplane Around Three Axes
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CHAPTER_01_CONTROL_AXES.map((row, idx) => (
                <button
                  key={row.surface}
                  type="button"
                  onClick={() => setSelectedAxisIndex(idx)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    selectedAxisIndex === idx
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {row.motion.split(" ")[0]} ({row.surface.split(" ")[0]})
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Selected Axis Card */}
          {CHAPTER_01_CONTROL_AXES[selectedAxisIndex] && (
            <div className="grid gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:grid-cols-4">
              <div>
                <p className="text-[11px] font-bold uppercase text-primary">Control Surface</p>
                <p className="mt-1 text-sm font-bold text-foreground">
                  {CHAPTER_01_CONTROL_AXES[selectedAxisIndex]!.surface}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {CHAPTER_01_CONTROL_AXES[selectedAxisIndex]!.location}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-primary">Cockpit Input</p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {CHAPTER_01_CONTROL_AXES[selectedAxisIndex]!.cockpitInput}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-primary">Axis &amp; Motion</p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {CHAPTER_01_CONTROL_AXES[selectedAxisIndex]!.axis}
                </p>
                <p className="mt-0.5 text-xs font-bold text-primary">
                  → {CHAPTER_01_CONTROL_AXES[selectedAxisIndex]!.motion}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-primary">Important Distinction</p>
                <p className="mt-1 text-xs leading-relaxed text-foreground/90">
                  {CHAPTER_01_CONTROL_AXES[selectedAxisIndex]!.distinction}
                </p>
              </div>
            </div>
          )}

          {/* Compact Comparison Table */}
          <div className="overflow-x-auto rounded-2xl border border-border bg-background">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/50 text-[11px] font-bold uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Primary Control Surface</th>
                  <th className="px-4 py-3">Cockpit Input</th>
                  <th className="px-4 py-3">Axis of Rotation</th>
                  <th className="px-4 py-3">Primary Motion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {CHAPTER_01_CONTROL_AXES.map((row, idx) => (
                  <tr
                    key={row.surface}
                    onClick={() => setSelectedAxisIndex(idx)}
                    className={`cursor-pointer transition ${
                      selectedAxisIndex === idx ? "bg-primary/10 font-medium" : "hover:bg-muted/30"
                    }`}
                  >
                    <td className="px-4 py-3 font-semibold text-foreground">{row.surface}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.cockpitInput}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.axis}</td>
                    <td className="px-4 py-3 font-bold text-primary">{row.motion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 8B. SIDE-BY-SIDE COMPONENT DISTINCTIONS */}
        <div className="space-y-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Layers className="h-3.5 w-3.5" />
              Visual Module B · Component Comparisons
            </p>
            <h3 className="mt-1 text-xl font-bold tracking-tight">
              Key Distinctions Between Frequently Confused Systems
            </h3>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {CHAPTER_01_DISTINCTIONS.map((d) => (
              <div
                key={d.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card/85 p-5 shadow-xs space-y-4"
              >
                <h4 className="text-base font-bold text-foreground">{d.title}</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-background/80 p-3.5">
                    <p className="text-xs font-bold text-primary">{d.leftName}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {d.leftRole}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/80 p-3.5">
                    <p className="text-xs font-bold text-foreground">{d.rightName}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {d.rightRole}
                    </p>
                  </div>
                </div>
                <div className="rounded-xl bg-primary/10 px-3.5 py-2.5 text-xs font-medium text-foreground">
                  <strong className="text-primary">Distinction: </strong>
                  {d.keyDifference}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8C. SEQUENTIAL DIAGRAM: COCKPIT SCAN FLOW & PRE/POST-FLIGHT SOP */}
        <div className="rounded-3xl border border-border bg-card/85 p-5 shadow-xs sm:p-7 space-y-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Compass className="h-3.5 w-3.5" />
              Visual Module C · Sequential Procedure
            </p>
            <h3 className="mt-1 text-xl font-bold tracking-tight">
              Cockpit Scan Flow, Document Acceptance &amp; Post-Flight Securing Sequence
            </h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CHAPTER_01_SCAN_SEQUENCE.map((item) => (
              <div
                key={item.step}
                className="relative flex flex-col justify-between rounded-2xl border border-border bg-background/85 p-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {item.step}
                    </span>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.area}
                    </span>
                  </div>
                  <h4 className="mt-2.5 text-sm font-bold text-foreground">{item.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {item.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 9 — FOCUSED TECHNICAL SYLLABUS SECTIONS (SECTIONS 1 TO 11)
          Preserves all 11 exact section IDs (`section-1`..`section-11`), all
          9 interactive figures (`Fig-01-01`..`Fig-01-09`), and all verbatim
          syllabus text using structured progressive disclosure & memory aids.
         ===================================================================== */}
      <section aria-label="Technical syllabus sections" className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              Complete Chapter Syllabus · Sections 1 to 11
            </p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight">
              Focused Technical Explanations &amp; Memory Aids
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Each section presents its core function, essential explanation, memory aid, and
              expandable syllabus diagram.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={expandAllSyllabusSections}
            data-testid="toggle-all-syllabus-sections-btn"
            className="rounded-full text-xs font-semibold"
          >
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            {expandedSectionIds.length === CHAPTER_01_SYLLABUS_SECTIONS.length
              ? "Collapse Supporting Diagrams"
              : "Expand All 11 Syllabus Diagrams & Text"}
          </Button>
        </div>

        <div className="space-y-5">
          {CHAPTER_01_SYLLABUS_SECTIONS.map((sec) => {
            const isExpanded = expandedSectionIds.includes(sec.id);
            const originalBlocks = allSectionBlocksById[sec.id] ?? [];

            return (
              <section
                key={sec.id}
                id={sec.id}
                className="scroll-mt-32 rounded-3xl border border-border bg-card/80 p-5 shadow-xs transition hover:border-primary/40 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-primary/15 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                        {sec.groupTag}
                      </span>
                      {sec.figureId && (
                        <span className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                          {sec.figureId}
                        </span>
                      )}
                    </div>
                    <h3 className="pt-1 text-xl font-bold tracking-tight text-foreground">
                      {sec.title}
                    </h3>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSyllabusSection(sec.id)}
                    aria-expanded={isExpanded}
                    className="h-8 rounded-full text-xs font-semibold text-primary"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="mr-1 h-3.5 w-3.5" />
                        Hide Diagram &amp; Verbatim Text
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-1 h-3.5 w-3.5" />
                        Show Diagram &amp; Verbatim Text
                      </>
                    )}
                  </Button>
                </div>

                {/* Structured Concise Explanation */}
                <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
                  <div className="space-y-3 text-xs leading-relaxed">
                    <div>
                      <span className="font-bold text-foreground">Primary Function: </span>
                      <span className="text-muted-foreground">{sec.primaryFunction}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/95">
                      {sec.essentialExplanation}
                    </p>
                    <ul className="space-y-1.5 pt-1">
                      {sec.keyPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    {sec.keyDistinction && (
                      <div className="rounded-xl border border-border bg-background/70 px-3.5 py-2.5 text-xs">
                        <strong className="text-foreground">Important Distinction: </strong>
                        <span className="text-muted-foreground">{sec.keyDistinction}</span>
                      </div>
                    )}
                  </div>

                  {/* Memory Aid & Section Takeaway */}
                  <div className="flex flex-col justify-between gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-4">
                    <div>
                      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                        <Lightbulb className="h-3.5 w-3.5" />
                        Memory Aid
                      </p>
                      <p className="mt-1.5 font-mono text-xs font-bold text-foreground">
                        {sec.memoryAid}
                      </p>
                    </div>
                    <div className="border-t border-border/60 pt-2.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Key Takeaway
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-foreground/90">
                        {sec.takeaway}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progressive Disclosure: Original Verbatim Text & Interactive Figure Hotspot Card */}
                {isExpanded && originalBlocks.length > 0 && (
                  <div className="mt-5 border-t border-border pt-5">
                    <LearningBlocks blocks={originalBlocks} />
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          SECTION 10 — INTERACTIVE KNOWLEDGE CHECKS
         ===================================================================== */}
      <section
        id="ch1-knowledge-checks"
        aria-label="Chapter 1 Knowledge Checks"
        data-testid="chapter-01-knowledge-checks"
        className="scroll-mt-32 rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-7 space-y-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <HelpCircle className="h-3.5 w-3.5" />
              Interactive Knowledge Checks
            </p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight">
              Verify Your Understanding ({correctCount} / {CHAPTER_01_KNOWLEDGE_CHECKS.length} Correct)
            </h3>
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
          {CHAPTER_01_KNOWLEDGE_CHECKS.map((q) => {
            const selectedOptionId = answers[q.id];
            const isAnswered = Boolean(selectedOptionId);
            const isCorrect = selectedOptionId === q.correctOptionId;

            return (
              <div
                key={q.id}
                data-testid={`knowledge-check-${q.id}`}
                className="flex flex-col justify-between rounded-2xl border border-border bg-background/85 p-5 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="rounded-md bg-primary/10 px-2.5 py-0.5 font-bold text-primary">
                      Q{q.number} · {q.formatLabel}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {q.sectionRef}
                    </span>
                  </div>

                  <p className="text-sm font-bold leading-snug text-foreground">
                    {q.question}
                  </p>

                  <div className="space-y-2 pt-1">
                    {q.options.map((opt) => {
                      const isThisSelected = selectedOptionId === opt.id;
                      const isThisCorrect = opt.id === q.correctOptionId;

                      let btnStyle =
                        "border-border bg-card/70 text-foreground hover:border-primary/50";
                      if (isAnswered) {
                        if (isThisCorrect) {
                          btnStyle =
                            "border-emerald-500 bg-emerald-500/10 text-foreground font-semibold";
                        } else if (isThisSelected && !isThisCorrect) {
                          btnStyle =
                            "border-destructive bg-destructive/10 text-foreground";
                        } else {
                          btnStyle = "border-border/60 bg-card/30 text-muted-foreground opacity-75";
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          data-testid={`kc-option-${q.id}-${opt.id}`}
                          onClick={() => handleSelectAnswer(q.id, opt.id)}
                          className={`flex w-full items-start gap-2.5 rounded-xl border p-3 text-left text-xs leading-relaxed transition ${btnStyle}`}
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[11px] font-bold uppercase">
                            {opt.id}
                          </span>
                          <span className="flex-1">{opt.label}</span>
                          {isAnswered && isThisCorrect && (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              <Check className="h-3 w-3" /> Correct
                            </span>
                          )}
                          {isAnswered && isThisSelected && !isThisCorrect && (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-destructive/20 px-2 py-0.5 text-[10px] font-bold text-destructive">
                              <X className="h-3 w-3" /> Selected
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Immediate Explanation & Misconception Feedback */}
                {isAnswered && (
                  <div
                    data-testid={`kc-feedback-${q.id}`}
                    className={`rounded-xl border p-3.5 text-xs space-y-2 ${
                      isCorrect
                        ? "border-emerald-500/40 bg-emerald-500/10"
                        : "border-amber-500/40 bg-amber-500/10"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-foreground">
                        {isCorrect
                          ? "✓ Correct — Well done!"
                          : "Not quite — Review the explanation below:"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleResetQuestion(q.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Try again
                      </button>
                    </div>
                    <p className="leading-relaxed text-foreground/95">{q.explanation}</p>
                    <p className="border-t border-border/60 pt-1.5 text-[11px] text-muted-foreground">
                      <strong className="text-foreground">Key Point to Remember: </strong>
                      {q.misconception}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          SECTION 11 — CHAPTER SUMMARY AND FINAL REVISION
         ===================================================================== */}
      <section
        id="ch1-revision-summary"
        aria-label="Chapter Summary and Final Revision"
        data-testid="chapter-01-revision-summary"
        className="scroll-mt-32 rounded-3xl border border-primary/35 bg-card/90 p-6 shadow-xs sm:p-8 space-y-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Final Chapter Revision Summary
            </p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight">
              Chapter 1 Rapid Revision Checklist
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Review the core aircraft systems below before marking Chapter 1 complete.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollToElement("ch1-aircraft-explorer", "Return to Interactive Aircraft")}
            className="rounded-full text-xs font-semibold"
          >
            <ArrowUp className="mr-1.5 h-3.5 w-3.5" />
            Return to Interactive Aircraft Overview
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background/80 p-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              1. Airframe &amp; Primary Controls
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• <strong className="text-foreground">5 Groups:</strong> Fuselage, Mainplanes, Empennage, Undercarriage, Powerplant.</li>
              <li>• <strong className="text-foreground">Ailerons:</strong> Control column L/R → Longitudinal axis → Roll.</li>
              <li>• <strong className="text-foreground">Elevator:</strong> Control column Fore/Aft → Lateral axis → Pitch.</li>
              <li>• <strong className="text-foreground">Rudder:</strong> Rudder pedals L/R → Normal axis → Yaw &amp; Balance.</li>
              <li>• <strong className="text-foreground">Trim Tab:</strong> Relieves continuous holding force after attitude is set.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-background/80 p-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              2. Instruments, Fuel &amp; Electrics
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• <strong className="text-foreground">Basic-T:</strong> ASI (left), Attitude Indicator (top), Altimeter (right), DI (bottom).</li>
              <li>• <strong className="text-foreground">Pitot-Static:</strong> ASI = Pitot + Static; Altimeter &amp; VSI = Static only.</li>
              <li>• <strong className="text-foreground">Vacuum Gyros:</strong> AI &amp; DI driven by 4.5–5.5 inHg vacuum suction.</li>
              <li>• <strong className="text-foreground">AVGAS 100LL:</strong> Dyed pale blue; water sinks to strainer drain bottom.</li>
              <li>• <strong className="text-foreground">Split Master:</strong> BAT + ALT on 14V/28V DC bus; Avionics Master OFF for start.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-background/80 p-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              3. Ground Handling, Checklists &amp; Law
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• <strong className="text-foreground">Tricycle Gear:</strong> Oleo nose strut steered by lower rudder pedals.</li>
              <li>• <strong className="text-foreground">Toe Brakes:</strong> Top of rudder pedals apply independent main-wheel disc brakes.</li>
              <li>• <strong className="text-foreground">Checklists:</strong> Floor-to-panel flow verified by written checklist.</li>
              <li>• <strong className="text-foreground">Documents:</strong> Technical Log, C of A, ARC, and Mass &amp; Balance before flight.</li>
              <li>• <strong className="text-foreground">Post-Flight:</strong> Switches OFF, gust lock fitted, pitot cover on, chocks &amp; Tech Log.</li>
            </ul>
          </div>
        </div>

        {/* Exploration & Practice Status Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <span>
                Aircraft Components Explored:{" "}
                <strong>
                  {exploredComponentIds.length} / {totalComponentsCount}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>
                Knowledge Checks Correct:{" "}
                <strong>
                  {correctCount} / {CHAPTER_01_KNOWLEDGE_CHECKS.length}
                </strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {exploredComponentIds.length < totalComponentsCount && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollToElement("ch1-aircraft-explorer", "Explore remaining components")}
                className="rounded-full text-xs"
              >
                Explore Remaining Aircraft Parts
              </Button>
            )}
            <Button
              variant={completed ? "outline" : "default"}
              onClick={onToggleComplete}
              className="rounded-full font-semibold"
            >
              <CheckCircle2 className="mr-1.5 h-4 w-4" />
              {completed ? "Mark Chapter Incomplete" : "Complete Chapter 1"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
