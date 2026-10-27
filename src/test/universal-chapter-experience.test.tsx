import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { UniversalChapterExperience } from "@/components/universal-chapter-experience";
import { chapterById } from "@/lib/learning-content";
import { getUniversalChapterData } from "@/lib/universal-chapter-data";

describe("Universal Interactive Chapter Experience across all courses and modules", () => {
  const chapter02 = chapterById("chapter-02")!;
  const chapter03 = chapterById("chapter-03")!;
  const chapter04 = chapterById("chapter-04")!;

  it("extracts rich interactive data (guided steps, key facts, distinctions, knowledge checks) for Pooley Chapter 2", () => {
    const data = getUniversalChapterData(chapter02, "pooley");
    expect(data.keyFacts.length).toBeGreaterThanOrEqual(4);
    expect(data.guidedSteps.length).toBeGreaterThanOrEqual(4);
    expect(data.distinctions.length).toBeGreaterThanOrEqual(2);
    expect(data.knowledgeChecks.length).toBeGreaterThanOrEqual(2);

    expect(data.keyFacts.some((f) => f.statement.includes("fuel"))).toBe(true);
    expect(data.guidedSteps[0]?.title).toContain("Documentation");
  });

  it("renders UniversalChapterExperience for Pooley Chapter 2 with all interactive learning sections", () => {
    const onToggleComplete = vi.fn();
    render(
      <UniversalChapterExperience
        chapter={chapter02}
        courseKey="pooley"
        courseTitle="Air Manual — Pooley"
        completed={false}
        onToggleComplete={onToggleComplete}
      />,
    );

    // Verify Sticky Navigation Bar
    expect(screen.getByRole("navigation", { name: /chapter learning stages/i })).toBeTruthy();
    expect(screen.getByText(/1\. Key Facts/i)).toBeTruthy();
    expect(screen.getByText(/2\. Guided Intro/i)).toBeTruthy();

    // Verify Guided Intro Card
    expect(screen.getByText(/Guided Learning Tour:/i)).toBeTruthy();
    expect(screen.getAllByText(/Step 1 of/i).length).toBeGreaterThan(0);

    // Advance to Step 2
    const nextBtn = screen.getByRole("button", { name: /next step/i });
    fireEvent.click(nextBtn);
    expect(screen.getAllByText(/Step 2 of/i).length).toBeGreaterThan(0);

    // Collapse / Resume Guided Tour
    const toggleGuidedBtn = screen.getByTestId("toggle-guided-intro-btn");
    fireEvent.click(toggleGuidedBtn);
    expect(screen.queryByTestId("guided-intro-active-card")).toBeNull();

    // Reopen and check preserved step
    fireEvent.click(toggleGuidedBtn);
    expect(screen.getByTestId("guided-intro-active-card")).toBeTruthy();
    expect(screen.getAllByText(/Step 2 of/i).length).toBeGreaterThan(0);

    // Test Knowledge Check question evaluation
    const kc1 = screen.getByTestId("kc-option-kc-p2-1-b"); // Incorrect option
    fireEvent.click(kc1);
    expect(screen.getByTestId("kc-feedback-kc-p2-1").textContent).toContain("Not quite");

    // Retry and pick correct option
    const kc1Correct = screen.getByTestId("kc-option-kc-p2-1-a"); // Correct option
    fireEvent.click(kc1Correct);
    expect(screen.getByTestId("kc-feedback-kc-p2-1").textContent).toContain("Correct — Well done!");

    // Test Complete Chapter button
    const completeBtns = screen.getAllByRole("button", { name: /complete/i });
    fireEvent.click(completeBtns[0]!);
    expect(onToggleComplete).toHaveBeenCalledTimes(1);
  });

  it("dynamically synthesizes and renders interactive experience for other modules (Airframes / Electrics / Powerplant)", () => {
    // Mock synthetic chapter from CAE ATPL Airframes
    const mockAirframeChapter = {
      id: "chapter-08",
      number: 8,
      title: "Flight Controls & Control Surfaces",
      page: "120",
      children: [],
      sections: [
        {
          id: "sec-1",
          title: "1. Primary Flight Controls & Aerodynamic Balance",
          blocks: [
            {
              type: "markdown" as const,
              text: "Primary flight controls comprise elevators, ailerons, and rudders. Aerodynamic balance prevents excessive control stick loads at high dynamic pressures.",
            },
          ],
        },
        {
          id: "sec-2",
          title: "2. Secondary Flight Controls: Flaps, Slats & Spoilers",
          blocks: [
            {
              type: "markdown" as const,
              text: "Secondary controls enhance lift for takeoff and landing or increase drag for descent rate control.",
            },
          ],
        },
      ],
    };

    const data = getUniversalChapterData(mockAirframeChapter, "airframes");
    expect(data.guidedSteps.length).toBe(2);
    expect(data.keyFacts.length).toBe(2);
    expect(data.knowledgeChecks.length).toBe(2);

    render(
      <UniversalChapterExperience
        chapter={mockAirframeChapter}
        courseKey="airframes"
        courseTitle="CAE ATPL 2: Airframes & Systems"
        completed={false}
        onToggleComplete={() => {}}
      />,
    );

    expect(screen.getAllByText(/Flight Controls & Control Surfaces/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Primary Flight Controls & Aerodynamic Balance/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Secondary Flight Controls: Flaps, Slats & Spoilers/i).length).toBeGreaterThan(0);

    // Expand all syllabus sections
    const expandAllBtn = screen.getByRole("button", { name: /expand all/i });
    fireEvent.click(expandAllBtn);
    expect(screen.getAllByText(/Primary flight controls comprise elevators/i).length).toBeGreaterThan(0);
  });
});
