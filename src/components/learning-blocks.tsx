import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { figureAssets } from "@/lib/learning-illustrations";
import type { LearningBlock, LearningFigure } from "@/lib/learning-source";

function FigureHotspotCard({ figure }: { figure: LearningFigure }) {
  const asset = figureAssets[figure.id];
  const [hoveredPartId, setHoveredPartId] = useState<string | null>(null);

  if (!asset) {
    const promptText = figure.prompt || figure.caption || "";
    if (promptText) {
      const headingText = figure.title
        ? `Image Generation Prompt — ${figure.title}`
        : `Image Generation Prompt — ${figure.id}`;

      return (
        <figure className="my-6 overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
            <span className="text-xs font-bold tracking-wide text-primary">
              {headingText}
            </span>
            <span className="rounded-md border border-border bg-background/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {figure.id}
            </span>
          </div>
          <div className="bg-muted/15 p-5 sm:p-6">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground select-text">
              {promptText}
            </p>
          </div>
        </figure>
      );
    }

    return (
      <figure className="my-6 rounded-2xl border border-border bg-card p-5">
        <figcaption className="text-xs font-semibold text-primary">
          {figure.id} {figure.title ? `— ${figure.title}` : ""}
        </figcaption>
        {figure.caption && <p className="mt-1 text-xs text-muted-foreground">{figure.caption}</p>}
      </figure>
    );
  }

  return (
    <figure className="my-6 rounded-2xl border border-border bg-card shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
        <span className="text-xs font-bold tracking-wide text-primary">
          {figure.id} {figure.title ? `· ${figure.title}` : ""}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {asset.parts.length > 0
            ? "Hover over any numbered callout to reveal component details directly"
            : "Official Technical Visual"}
        </span>
      </div>

      <div className="relative w-full bg-muted/20 select-none">
        <img src={asset.src} alt={asset.alt} className="block h-auto w-full object-contain rounded-b-none" />
        
        {asset.parts.map((part) => {
          const isHovered = hoveredPartId === part.id;
          const isRightSide = part.x > 60;
          const isBottomSide = part.y > 60;

          return (
            <div
              key={part.id}
              style={{ left: `${part.x}%`, top: `${part.y}%` }}
              className="-translate-x-1/2 -translate-y-1/2 absolute z-20"
              onMouseEnter={() => setHoveredPartId(part.id)}
              onMouseLeave={() => setHoveredPartId(null)}
            >
              <button
                type="button"
                aria-label={`${part.number}. ${part.label}`}
                onFocus={() => setHoveredPartId(part.id)}
                onBlur={() => setHoveredPartId(null)}
                onClick={() => setHoveredPartId(isHovered ? null : part.id)}
                className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-200 shadow-md ${
                  isHovered
                    ? "scale-125 border-primary-foreground bg-primary text-primary-foreground ring-4 ring-primary/30 z-30 shadow-xl"
                    : "border-primary bg-background/95 text-foreground hover:scale-115 hover:border-primary-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                {part.number}
              </button>

              {/* Floating Tooltip Card Revealed Directly on Hovering the Number */}
              {isHovered && (
                <div
                  className={`pointer-events-none absolute z-40 w-72 max-w-[85vw] rounded-xl border border-border bg-popover/95 p-3.5 text-popover-foreground shadow-2xl backdrop-blur-md transition-all duration-150 animate-in fade-in-0 zoom-in-95 ${
                    isRightSide ? "right-full mr-3.5" : "left-full ml-3.5"
                  } ${isBottomSide ? "bottom-0 -mb-2" : "top-0 -mt-2"}`}
                >
                  <div className="flex items-center gap-2 border-b border-border/60 pb-1.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                      {part.number}
                    </span>
                    <span className="font-bold text-xs leading-snug text-foreground">
                      {part.label}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {part.detail}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Component Index Reference Legend */}
      <figcaption className="border-t border-border px-4 py-3 bg-card/60">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Callout Legend (Hover to highlight on diagram)
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {asset.parts.map((part) => {
            const isHovered = hoveredPartId === part.id;
            return (
              <button
                key={part.id}
                type="button"
                onMouseEnter={() => setHoveredPartId(part.id)}
                onMouseLeave={() => setHoveredPartId(null)}
                onFocus={() => setHoveredPartId(part.id)}
                onBlur={() => setHoveredPartId(null)}
                onClick={() => setHoveredPartId(isHovered ? null : part.id)}
                className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-left text-xs transition-colors ${
                  isHovered
                    ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/40 shadow-xs"
                    : "border-border bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    isHovered
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {part.number}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block font-semibold text-foreground truncate">
                    {part.label}
                  </span>
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed">
                    {part.detail}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </figcaption>
    </figure>
  );
}

export function LearningBlocks({ blocks }: { blocks: LearningBlock[] }) {
  if (!blocks || blocks.length === 0) return null;
  return (
    <div className="learning-prose space-y-4 text-sm leading-7">
      {blocks.map((block, index) =>
        block.type === "markdown" ? (
          <div key={index} className="space-y-3">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.text}</ReactMarkdown>
          </div>
        ) : (
          <FigureHotspotCard key={block.figure.id} figure={block.figure} />
        ),
      )}
    </div>
  );
}
