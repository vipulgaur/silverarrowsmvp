export interface LearningFigure {
  id: string;
  title?: string;
  caption?: string;
  prompt?: string;
}

export type LearningBlock =
  | { type: "markdown"; text: string }
  | { type: "image"; figure: LearningFigure };

export interface LearningSection {
  id: string;
  title: string;
  blocks: LearningBlock[];
}

const POOLEY_FIGURE_REGEX = /!\[(Fig-\d{2}-\d{2}):\s*([^\]]+)\]\(([^)]+)\)/g;

function normalizeFigureId(rawHeader: string): string {
  const clean = rawHeader.replace(/\\\*/g, "").replace(/\\/g, "").replace(/#/g, "").trim();
  const mDec = clean.match(/(?:Figure|Fig\.?|fig-)?\s*(\d+)\.(\d+)/i);
  if (mDec) {
    const ch = parseInt(mDec[1], 10);
    const num = parseInt(mDec[2], 10);
    return `fig-${String(ch).padStart(2, "0")}-${String(num).padStart(2, "0")}`;
  }
  const mCs1 = clean.match(/cs25-1|1\s*[:—–-]/i);
  if (mCs1) return "fig-01-cs25-1";
  const mCs2 = clean.match(/cs25-2|2\s*[:—–-]/i);
  if (mCs2) return "fig-01-cs25-2";
  return clean.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function parsePooleySource(raw: string): LearningSection[] {
  const headingRegex = /^##\s+(.+)$/gm;
  const matches: Array<{ title: string; start: number; bodyStart: number }> = [];
  let m: RegExpExecArray | null;

  while ((m = headingRegex.exec(raw)) !== null) {
    matches.push({
      title: m[1].trim(),
      start: m.index,
      bodyStart: m.index + m[0].length,
    });
  }

  return matches.map((sectionMatch, idx) => {
    const bodyEnd = idx + 1 < matches.length ? matches[idx + 1].start : raw.length;
    const body = raw.slice(sectionMatch.bodyStart, bodyEnd);
    const blocks: LearningBlock[] = [];
    let lastIndex = 0;

    POOLEY_FIGURE_REGEX.lastIndex = 0;
    let figMatch: RegExpExecArray | null;
    while ((figMatch = POOLEY_FIGURE_REGEX.exec(body)) !== null) {
      const before = body.slice(lastIndex, figMatch.index).trim();
      if (before) {
        blocks.push({ type: "markdown", text: before });
      }
      blocks.push({
        type: "image",
        figure: {
          id: figMatch[1],
          title: figMatch[2].trim(),
          caption: figMatch[3],
          prompt: figMatch[3],
        },
      });
      lastIndex = figMatch.index + figMatch[0].length;
    }

    const tail = body.slice(lastIndex).trim();
    if (tail) {
      blocks.push({ type: "markdown", text: tail });
    }

    return {
      id: `section-${idx + 1}`,
      title: sectionMatch.title,
      blocks,
    };
  });
}

function parseAtplSource(raw: string): LearningSection[] {
  const lines = raw.split("\n");
  let currentPart = "";
  const sectionRanges: Array<{ title: string; start: number; end: number }> = [];

  const PART_REGEX = /^##\s+(Part\s+\d+[^—–-]*[—–-][^\n]+)/i;
  const hasNumberedSections = lines.some((l) => /^#{1,2}\s+\d+(?:\\)?\.\s+[^\n]+/.test(l));

  let prevIdx = -1;
  let prevTitle = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const partMatch = line.match(PART_REGEX);
    if (partMatch) {
      currentPart = partMatch[1].replace(/\\\*/g, "").trim();
      continue;
    }

    let secTitle = "";
    if (hasNumberedSections) {
      const secNumMatch = line.match(/^#{1,2}\s+(\d+)(?:\\)?\.\s+([^\n]+)/);
      if (secNumMatch) {
        secTitle = `${secNumMatch[1]}. ${secNumMatch[2].replace(/\\/g, "").trim()}`;
      }
    } else {
      const secNamedMatch = line.match(/^##\s+([^\n]+)/);
      if (secNamedMatch) {
        const cand = secNamedMatch[1].replace(/\\/g, "").trim();
        if (
          !cand.toLowerCase().startsWith("chapter") &&
          !cand.toLowerCase().startsWith("part") &&
          !cand.toLowerCase().includes("image-generation") &&
          !cand.toLowerCase().includes("image generation")
        ) {
          secTitle = cand;
        }
      }
    }

    if (secTitle) {
      if (prevIdx !== -1) {
        sectionRanges.push({ title: prevTitle, start: prevIdx, end: i });
      }
      const partPrefix = currentPart ? currentPart.split("—")[0].trim().replace(" of 3", "") : "";
      prevTitle = partPrefix ? `${partPrefix}: ${secTitle}` : secTitle;
      prevIdx = i;
    }
  }
  if (prevIdx !== -1) {
    sectionRanges.push({ title: prevTitle, start: prevIdx, end: lines.length });
  }

  if (sectionRanges.length === 0) {
    const firstH1 = lines.find((l) => l.startsWith("# "))?.replace(/^#\s+/, "") ?? "Overview";
    sectionRanges.push({ title: firstH1, start: 0, end: lines.length });
  } else if (
    sectionRanges[0].start > 0 &&
    /Image[- ]generation prompt/i.test(lines.slice(0, sectionRanges[0].start).join("\n"))
  ) {
    sectionRanges[0].start = 0;
  }

  const PROMPT_REGEX =
    /(?:>|###|\*\*)[ \t\\*]*(?:(Figure\s*\d+\.\d+[^—\n*]*)[—–:-]\s*(?:Image[- ]generation prompt|Image[- ]Generation Prompt)|(?:Table description\s*\/\s*optional\s*)?(?:Image[- ]Generation Prompt|Image[- ]generation prompt)\s*[—–:-]?\s*(?:Figure\s*)?([^\n*]+))[ \t\\*:]*([\s\S]*?)(?=\n\s*(?:>|###|\*\*)[ \t\\*]*(?:Figure\s*\d+\.\d+|Image[- ]generation prompt|Image[- ]Generation Prompt|Table description)|\n\s*\n\s*[^>\s]|\n(?!\s*(?:>|###))|$)/gi;

  return sectionRanges.map((sec, idx) => {
    const body = lines.slice(sec.start, sec.end).join("\n");
    const blocks: LearningBlock[] = [];
    let lastIndex = 0;
    PROMPT_REGEX.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = PROMPT_REGEX.exec(body)) !== null) {
      const before = body
        .slice(lastIndex, match.index)
        .replace(/(?:^|\n)###\s+Figure\s+[^\n]+\s*$/i, "")
        .trim();
      if (before) {
        blocks.push({ type: "markdown", text: before });
      }
      const rawHeader = (match[1] || match[2] || "")
        .replace(/\\+\*/g, "")
        .replace(/\\/g, "")
        .replace(/[:*]+$/g, "")
        .trim();
      const promptBody = (match[3] || "")
        .replace(/^[ \t\\*:]+/g, "")
        .replace(/^>[\t ]?/gm, "")
        .replace(/\\+\*/g, "")
        .replace(/\\/g, "")
        .replace(/\*\*/g, "")
        .trim();
      const id = normalizeFigureId(rawHeader);
      const figTitle = /^figure\b/i.test(rawHeader) ? rawHeader : `Figure ${rawHeader}`;
      blocks.push({
        type: "image",
        figure: {
          id,
          title: figTitle,
          caption: promptBody,
          prompt: promptBody,
        },
      });
      lastIndex = match.index + match[0].length;
    }

    const tail = body.slice(lastIndex).trim();
    if (tail) {
      blocks.push({ type: "markdown", text: tail });
    }

    return {
      id: `section-${idx + 1}`,
      title: sec.title,
      blocks,
    };
  });
}

export function parseLearningSource(raw: string): LearningSection[] {
  if (/^\s*#\s+Chapter/im.test(raw) || /Image[- ]generation prompt/i.test(raw)) {
    return parseAtplSource(raw);
  }
  return parsePooleySource(raw);
}
