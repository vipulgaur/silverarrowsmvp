import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  ListChecks,
  Maximize2,
  PlayCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { figureAssets, type FigureAsset } from "@/lib/learning-illustrations";
import type { LearningBlock, LearningFigure, LearningSection } from "@/lib/learning-source";
import type { LearningChapter } from "@/lib/learning-content";

/**
 * Immersive, full-viewport learning workspace used by ALL E-Learning modules
 * (Air Manual/Pooley, Air Law, Airframes, Electrics, Powerplant).
 *
 * Content is bound to the existing parsed chapter data (chapter.sections). No
 * fonts, colors, or theme tokens are changed — only layout, spatial organization,
 * typography scale, and navigation. Fixed regions (sidebar, chapter title, topic
 * filter, video) stay put; the theory and image panels scroll independently and
 * the page itself never scrolls.
 */
export interface ModuleLearningWorkspaceProps {
  chapter: LearningChapter;
  chapters: LearningChapter[];
  courseTitle: string;
  moduleId?: string;
  completed: boolean;
  bookmarked: boolean;
  onToggleComplete: () => void;
  onToggleBookmark: () => void;
  onSelectChapter?: (chapterId: string) => void;
  onBack?: () => void;
  onLogInteraction?: (action: string, details: string) => void;
  /** Optional module-scoped figure assets, resolved before the global map. */
  figureAssets?: Record<string, FigureAsset>;
}

function splitBlocks(section: LearningSection | undefined): {
  theory: LearningBlock[];
  figures: LearningBlock[];
} {
  if (!section) return { theory: [], figures: [] };
  const theory = section.blocks.filter((b) => b.type === "markdown");
  const figures = section.blocks.filter((b) => b.type === "image");
  return { theory, figures };
}

/**
 * Figure card for the learning workspace. Unlike the shared LearningBlocks figure,
 * this version does NOT render numbered callout markers or the callout legend
 * (they overlapped tables/diagrams), and it adds an "expand" control that opens the
 * figure full-screen. Hotspot/part data is still read from the asset but not drawn
 * as overlay numbers, so the underlying figure data model is preserved.
 */
const WorkspaceFigure = memo(function WorkspaceFigure({
  figure,
  onExpand,
  assets,
}: {
  figure: LearningFigure;
  onExpand: (src: string, alt: string, title: string) => void;
  assets?: Record<string, FigureAsset>;
}) {
  // Per-module assets (e.g. Air Manual) are resolved first so module-scoped figure
  // IDs never collide with another module's identically numbered figure in the
  // shared global map.
  // A module-scoped map is authoritative: missing ids show the prompt card instead of
  // falling back to another module's identically numbered figure.
  const asset = assets ? assets[figure.id] : figureAssets[figure.id];

  if (!asset) {
    const promptText = figure.prompt || figure.caption || "";
    return (
      <figure className="my-5 overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
          <span className="text-sm font-bold tracking-wide text-primary">
            {figure.title ? figure.title : figure.id}
          </span>
          <span className="rounded-md border border-border bg-background/80 px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {figure.id}
          </span>
        </div>
        {promptText && (
          <div className="bg-muted/15 p-5">
            <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground">
              {promptText}
            </p>
          </div>
        )}
      </figure>
    );
  }

  const title = figure.title ? `${figure.id} · ${figure.title}` : figure.id;

  return (
    <figure className="my-5 overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
        <span className="text-sm font-bold tracking-wide text-primary">{title}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs"
          onClick={() => onExpand(asset.src, asset.alt, title)}
          aria-label="Expand figure"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Expand</span>
        </Button>
      </div>
      <button
        type="button"
        onClick={() => onExpand(asset.src, asset.alt, title)}
        className="group block w-full cursor-zoom-in bg-muted/20"
        aria-label="Expand figure"
      >
        <img
          src={asset.src}
          alt={asset.alt}
          className="block h-auto w-full object-contain transition-transform duration-200 group-hover:scale-[1.01]"
        />
      </button>
      {figure.caption && (
        <figcaption className="border-t border-border bg-card/60 px-4 py-2.5 text-sm text-muted-foreground">
          {figure.caption}
        </figcaption>
      )}
    </figure>
  );
});

// Stable, module-level references. Recreating these per render forced ReactMarkdown
// to re-render the entire (often very large, e.g. 285-row) table on every parent
// state change, which was the main source of UI lag. Hoisting them lets the parsed
// markdown tree stay stable across unrelated re-renders.
const REMARK_PLUGINS = [remarkGfm];

const MARKDOWN_COMPONENTS: Components = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-2 text-3xl font-bold tracking-tight text-foreground">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-7 text-2xl font-bold tracking-tight text-foreground">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-6 text-xl font-semibold tracking-tight text-foreground">{children}</h3>
  ),
};

/** Theory renderer: markdown with proper H1/H2/H3 and the workspace typography scale.
 *  Memoized so the heavy markdown tree only re-renders when the topic blocks change. */
const WorkspaceTheory = memo(function WorkspaceTheory({ blocks }: { blocks: LearningBlock[] }) {
  const markdown = blocks.filter((b) => b.type === "markdown");
  if (markdown.length === 0) {
    return <p className="text-base text-muted-foreground">No theory content for this topic.</p>;
  }
  return (
    <div className="learning-prose learning-prose-lg space-y-4 leading-8">
      {markdown.map((block) =>
        block.type === "markdown" ? (
          <ReactMarkdown key={block.text.slice(0, 40)} remarkPlugins={REMARK_PLUGINS} components={MARKDOWN_COMPONENTS}>
            {block.text}
          </ReactMarkdown>
        ) : null,
      )}
    </div>
  );
});

export function ModuleLearningWorkspace({
  chapter,
  chapters,
  courseTitle,
  moduleId = "ATPL",
  completed,
  bookmarked,
  onToggleComplete,
  onToggleBookmark,
  onSelectChapter,
  onBack,
  onLogInteraction,
  figureAssets: moduleFigureAssets,
}: ModuleLearningWorkspaceProps) {
  const topics = chapter.sections;
  const [activeSectionId, setActiveSectionId] = useState<string>(topics[0]?.id ?? "section-1");
  const [expanded, setExpanded] = useState<{ src: string; alt: string; title: string } | null>(
    null,
  );

  // Reset active topic when the chapter changes.
  useEffect(() => {
    setActiveSectionId(chapter.sections[0]?.id ?? "section-1");
  }, [chapter.id]);

  const activeSection = useMemo(
    () => topics.find((s) => s.id === activeSectionId) ?? topics[0],
    [topics, activeSectionId],
  );
  const { theory, figures } = useMemo(() => splitBlocks(activeSection), [activeSection]);
  // No video field exists in the learning content model yet; preserved for future use.
  const videos: string[] = useMemo(() => [], [activeSection]);

  const chapterLabel = `CHAPTER ${String(chapter.number).padStart(2, "0")} — ${chapter.title.toUpperCase()}`;

  function selectTopic(id: string, title: string) {
    setActiveSectionId(id);
    onLogInteraction?.("learning_topic_selected", `Topic: ${title}`);
  }

  const handleExpand = useCallback(
    (src: string, alt: string, title: string) => {
      setExpanded({ src, alt, title });
      onLogInteraction?.("learning_figure_expanded", `Expanded ${title}`);
    },
    [onLogInteraction],
  );

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-background text-foreground">
      {/* ── BODY: SIDEBAR (15%) + WORKSPACE ────────────────────── */}
      <div className="flex min-h-0 flex-1">
        {/* CHAPTER SIDEBAR — chapters, quizzes, MCQs only */}
        <aside className="flex w-[15%] min-w-[160px] max-w-[280px] shrink-0 flex-col border-r border-border bg-card/40">
          <div className="shrink-0 border-b border-border px-3 py-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Chapters
            </p>
          </div>
          <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
            <ul className="space-y-0.5">
              {chapters.map((c) => {
                const isActive = c.id === chapter.id;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => onSelectChapter?.(c.id)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      }`}
                    >
                      <span className="shrink-0 font-mono text-xs opacity-80">
                        {String(c.number).padStart(2, "0")}
                      </span>
                      <span className="truncate">{c.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="my-2 border-t border-border" />
            <ul className="space-y-0.5">
              <li>
                <button
                  type="button"
                  onClick={() => onLogInteraction?.("learning_nav_quizzes", "Opened Quizzes")}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                >
                  <ListChecks className="h-4 w-4 shrink-0" />
                  <span>Quizzes</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onLogInteraction?.("learning_nav_mcqs", "Opened MCQs")}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                >
                  <FileText className="h-4 w-4 shrink-0" />
                  <span>MCQs</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* CHAPTER WORKSPACE */}
        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          {/* CHAPTER TITLE ROW */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-2 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              {onBack && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBack}
                  className="shrink-0 gap-1.5"
                  aria-label="Back to assigned courses"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              )}
              <h1 className="truncate text-base font-bold tracking-tight sm:text-lg">
                {chapterLabel}
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant={bookmarked ? "default" : "outline"}
                size="sm"
                onClick={onToggleBookmark}
                className="gap-1.5"
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{bookmarked ? "Bookmarked" : "Bookmark"}</span>
              </Button>
              <Button
                variant={completed ? "outline" : "default"}
                size="sm"
                onClick={onToggleComplete}
                className="gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {completed ? "Completed" : "Mark complete"}
                </span>
              </Button>
              <span className="hidden rounded-md border border-border bg-background/70 px-2 py-0.5 font-mono text-xs text-muted-foreground md:inline">
                {moduleId}
              </span>
            </div>
          </div>

          {/* TOPIC FILTER BAR */}
          <div className="shrink-0 border-b border-border bg-card/30 px-3 py-2 sm:px-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {topics.length === 0 ? (
                <span className="text-sm text-muted-foreground">No topics available.</span>
              ) : (
                topics.map((t) => {
                  const isActive = t.id === activeSection?.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => selectTopic(t.id, t.title)}
                      aria-pressed={isActive}
                      className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground shadow-xs"
                          : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      {t.title}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* LEARNING WORKSPACE */}
          <div className="flex min-h-0 flex-1 flex-col">
            {/* VIDEO SECTION — placeholder shown when a topic has no video data.
                When a topic has videos, the player renders instead. */}
            <div className="shrink-0 border-b border-border bg-muted/20 px-4 py-3 sm:px-6">
              {videos.length > 0 ? (
                <div className="mx-auto aspect-video w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-black">
                  <video key={videos[0]} src={videos[0]} controls className="h-full w-full" />
                </div>
              ) : (
                <div className="mx-auto flex w-full max-w-2xl items-center gap-3 rounded-xl border border-dashed border-border bg-background/50 px-4 py-4">
                  <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded-md bg-muted">
                    <PlayCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">Video briefing</p>
                    <p className="truncate text-xs text-muted-foreground">
                      No video is published for this topic yet.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* TOPIC CONTENT — theory (60%) + images (40%), independently scrollable */}
            <div className="flex min-h-0 flex-1 overflow-hidden">
              {/* THEORY PANEL — 60% */}
              <div className="min-w-0 flex-[3] overflow-y-auto px-5 py-6 text-justify sm:px-8">
                {theory.length > 0 ? (
                  <WorkspaceTheory blocks={theory} />
                ) : (
                  <p className="text-base text-muted-foreground">No theory content for this topic.</p>
                )}
              </div>

              {/* IMAGE PANEL — 40%; only shown when the topic actually has figures */}
              {figures.length > 0 && (
                <div className="min-w-0 flex-[2] overflow-y-auto border-l border-border px-4 py-6 sm:px-5">
                  <h2 className="mb-3 flex items-center gap-2 text-base font-bold tracking-tight text-primary">
                    <ImageIcon className="h-4 w-4" />
                    Figures
                  </h2>
                  {figures.map((b) =>
                    b.type === "image" ? (
                      <WorkspaceFigure key={b.figure.id} figure={b.figure} onExpand={handleExpand} assets={moduleFigureAssets} />
                    ) : null,
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* FULL-SCREEN FIGURE VIEWER */}
      {expanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={expanded.title}
          className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
          onClick={() => setExpanded(null)}
        >
          <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 text-white">
            <span className="truncate text-sm font-semibold">{expanded.title}</span>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-white/40 bg-transparent text-white hover:bg-white/10"
              onClick={() => setExpanded(null)}
              aria-label="Close figure viewer"
            >
              <X className="h-4 w-4" />
              Close
            </Button>
          </div>
          <div
            className="flex min-h-0 flex-1 items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={expanded.src}
              alt={expanded.alt}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
