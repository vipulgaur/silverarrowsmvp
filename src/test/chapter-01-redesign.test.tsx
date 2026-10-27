import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { FamiliarisationChapterExperience } from "@/components/familiarisation-chapter-experience";
import {
  CHAPTER_01_DIAGRAM_VIEWS,
  CHAPTER_01_GUIDED_STEPS,
  CHAPTER_01_KEY_FACTS,
  CHAPTER_01_KNOWLEDGE_CHECKS,
  CHAPTER_01_SYLLABUS_SECTIONS,
  isChapter01RedesignEnabled,
} from "@/lib/chapter-01-redesign-data";
import { chapterById } from "@/lib/learning-content";

describe("Familiarisation with the Aeroplane — Chapter 1 Redesign", () => {
  const chapter01 = chapterById("chapter-01")!;

  it("scopes the redesign strictly to Pooley Chapter 1 and supports instant rollback via flag", () => {
    expect(isChapter01RedesignEnabled("pooley", "chapter-01", true)).toBe(true);
    // Other Pooley chapters remain untouched
    expect(isChapter01RedesignEnabled("pooley", "chapter-02", true)).toBe(false);
    expect(isChapter01RedesignEnabled("pooley", "chapter-03", true)).toBe(false);
    expect(isChapter01RedesignEnabled("pooley", "chapter-04", true)).toBe(false);
    // Other courses' Chapter 1 remain untouched
    expect(isChapter01RedesignEnabled("airframes", "chapter-01", true)).toBe(false);
    expect(isChapter01RedesignEnabled("electrics", "chapter-01", true)).toBe(false);
    expect(isChapter01RedesignEnabled("powerplant", "chapter-01", true)).toBe(false);
    // Disabling the feature flag restores the original chapter immediately
    expect(isChapter01RedesignEnabled("pooley", "chapter-01", false)).toBe(false);
  });

  it("preserves all 11 syllabus sections and maps verified interactive components & key facts", () => {
    expect(CHAPTER_01_SYLLABUS_SECTIONS).toHaveLength(11);
    expect(CHAPTER_01_KEY_FACTS).toHaveLength(8);
    expect(CHAPTER_01_GUIDED_STEPS).toHaveLength(7);
    expect(CHAPTER_01_DIAGRAM_VIEWS).toHaveLength(3);
    expect(CHAPTER_01_KNOWLEDGE_CHECKS).toHaveLength(6);

    for (const sec of CHAPTER_01_SYLLABUS_SECTIONS) {
      const original = chapter01.sections.find((s) => s.id === sec.id);
      expect(original).toBeDefined();
      expect(sec.title).toBe(original?.title);
    }
  });

  it("supports Guided Introduction step navigation, keyboard controls, and collapse/resume state preservation", () => {
    render(
      <FamiliarisationChapterExperience
        chapter={chapter01}
        completed={false}
        onToggleComplete={() => {}}
      />,
    );

    expect(screen.getByText(/Recognising the Main Parts of the Aeroplane/i)).toBeTruthy();

    // Advance to Step 2 via Next Step button
    const nextBtn = screen.getByRole("button", { name: /next step/i });
    fireEvent.click(nextBtn);
    expect(screen.getByText(/Purpose of the Fuselage & Cockpit Cabin/i)).toBeTruthy();

    // Collapse / skip the guided intro and verify step 2 is remembered when resumed
    const toggleBtn = screen.getByTestId("toggle-guided-intro-btn");
    fireEvent.click(toggleBtn);
    expect(screen.queryByTestId("guided-intro-active-card")).toBeNull();
    expect(toggleBtn.textContent).toContain("Step 2/7");

    // Reopen guided intro and verify still on Step 2
    fireEvent.click(toggleBtn);
    expect(screen.getByText(/Purpose of the Fuselage & Cockpit Cabin/i)).toBeTruthy();
  });

  it("allows selecting aircraft components on the diagram, switching views, and closing the detail panel", () => {
    render(
      <FamiliarisationChapterExperience
        chapter={chapter01}
        completed={false}
        onToggleComplete={() => {}}
      />,
    );

    // Default selected component is Empennage: Fin & Rudder
    expect(screen.getByTestId("selected-component-name").textContent).toContain(
      "Empennage: Fin (Vertical Stabiliser) & Rudder",
    );

    // Select Marker 1: Propeller & Spinner
    const propMarker = screen.getByTestId("aircraft-marker-ext-propeller");
    fireEvent.click(propMarker);
    expect(screen.getByTestId("selected-component-name").textContent).toBe("Propeller & Spinner");
    expect(screen.getByTestId("explored-components-counter").textContent).toContain("2 / 27");

    // Close the detail panel
    fireEvent.click(screen.getByTestId("close-component-detail-btn"));
    expect(screen.queryByTestId("selected-component-detail-panel")).toBeNull();

    // Switch to Cockpit Panel view (Fig-01-02)
    fireEvent.click(screen.getByTestId("diagram-view-tab-cockpit-panel"));
    expect(screen.getByTestId("selected-component-name").textContent).toContain(
      "Airspeed Indicator (ASI)",
    );

    // Switch to Control Columns view (Fig-01-03)
    fireEvent.click(screen.getByTestId("diagram-view-tab-control-columns"));
    expect(screen.getByTestId("selected-component-name").textContent).toContain(
      "Control Column or Centre Joystick",
    );
  });

  it("evaluates knowledge check answers, shows immediate feedback, and allows retrying", () => {
    const onToggleComplete = vi.fn();
    render(
      <FamiliarisationChapterExperience
        chapter={chapter01}
        completed={false}
        onToggleComplete={onToggleComplete}
      />,
    );

    // Answer Q1 incorrectly first (Option C)
    fireEvent.click(screen.getByTestId("kc-option-kc-1-c"));
    expect(screen.getByTestId("kc-feedback-kc-1").textContent).toContain("Not quite");

    // Retry Q1 with the correct answer (Option A)
    fireEvent.click(screen.getByTestId("kc-option-kc-1-a"));
    expect(screen.getByTestId("kc-feedback-kc-1").textContent).toContain("Correct — Well done!");

    // Expand all 11 syllabus sections
    fireEvent.click(screen.getByTestId("toggle-all-syllabus-sections-btn"));
    for (let i = 1; i <= 11; i++) {
      expect(document.getElementById(`section-${i}`)).toBeTruthy();
    }

    // Complete chapter button triggers callback
    fireEvent.click(screen.getByRole("button", { name: /complete chapter 1/i }));
    expect(onToggleComplete).toHaveBeenCalledTimes(1);
  });
});
