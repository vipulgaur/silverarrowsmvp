import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  airlawChapters,
  airlawChapterById,
  airlawCourseTitle,
  airlawCourseSubtitle,
  AIRLAW_CATALOGUE,
} from "@/lib/airlaw-content";
import { airlawFigureAssets } from "@/lib/airlaw-illustrations";
import { figureAssets } from "@/lib/learning-illustrations";
import { UniversalChapterExperience } from "@/components/universal-chapter-experience";

describe("Module 5: CAE ATPL 1 Air Law Complete Implementation", () => {
  it("loads the complete 28-chapter syllabus and catalog", () => {
    expect(AIRLAW_CATALOGUE.length).toBe(28);
    expect(airlawChapters.length).toBe(28);

    // Verify first and last chapters
    expect(airlawChapters[0].id).toBe("chapter-01");
    expect(airlawChapters[0].title).toBe("Definitions");
    expect(airlawChapters[0].sections.length).toBeGreaterThan(0);

    expect(airlawChapters[27].id).toBe("chapter-28");
    expect(airlawChapters[27].title).toContain("EASA Part-FCL");
    expect(airlawChapters[27].sections.length).toBeGreaterThan(0);

    // Verify course titles
    expect(airlawCourseTitle).toBe("CAE ATPL 1: Air Law");
    expect(airlawCourseSubtitle).toContain("Module 5");
  });

  it("retrieves chapters by ID for key regulatory chapters", () => {
    const ch6 = airlawChapterById("chapter-06");
    expect(ch6).toBeDefined();
    expect(ch6?.title).toContain("Rules of the Air");
    expect(ch6?.sections.length).toBeGreaterThan(0);

    const ch10 = airlawChapterById("chapter-10");
    expect(ch10).toBeDefined();
    expect(ch10?.title).toContain("Holding Procedures");
    expect(ch10?.sections.length).toBeGreaterThan(0);

    const ch14 = airlawChapterById("chapter-14");
    expect(ch14).toBeDefined();
    expect(ch14?.title).toContain("Airspace");
    expect(ch14?.sections.length).toBeGreaterThan(0);
  });

  it("provides illustrated figures with interactive hotspot callouts across chapters", () => {
    // Over 240 illustrated figures
    expect(Object.keys(airlawFigureAssets).length).toBeGreaterThanOrEqual(240);

    // Verify Chapter 10 holding figures
    const fig1001 = airlawFigureAssets["fig-10-01"];
    expect(fig1001).toBeDefined();
    expect(fig1001.src).toContain("/assets/learning/airlaw/fig-10-01.png");
    expect(fig1001.parts.length).toBeGreaterThan(0);

    // Verify Chapter 6 rules figures
    const fig0601 = airlawFigureAssets["fig-06-01"];
    expect(fig0601).toBeDefined();
    expect(fig0601.src).toContain("/assets/learning/airlaw/fig-06-01.png");

    // Verify integrated in global figureAssets registry
    expect(figureAssets["fig-10-01"]).toBeDefined();
    expect(figureAssets["fig-06-01"]).toBeDefined();
  });

  it("renders UniversalChapterExperience for Air Law Chapter 10 (Holding Procedures)", () => {
    const ch10 = airlawChapterById("chapter-10")!;
    render(
      <UniversalChapterExperience
        chapter={ch10}
        courseKey="airlaw"
        courseTitle={airlawCourseTitle}
        completed={false}
        onToggleComplete={() => {}}
      />,
    );

    // Hero title
    expect(screen.getAllByText(/Holding Procedures/i).length).toBeGreaterThan(0);

    // Stage navigation
    expect(screen.getByRole("navigation", { name: /Chapter learning stages/i })).toBeTruthy();
    expect(screen.getByText(/1\. Key Facts/i)).toBeTruthy();
    expect(screen.getByText(/2\. Guided Intro/i)).toBeTruthy();

    // Section content
    expect(screen.getAllByText(/Standard Pattern/i).length).toBeGreaterThan(0);
  });
});
