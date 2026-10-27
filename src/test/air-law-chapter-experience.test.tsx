import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { AirLawChapterExperience } from "@/components/air-law-chapter-experience";

describe("Air Law Interactive Chapter Experience", () => {
  it("renders Air Law hero, key facts, and guided orientation", () => {
    render(
      <AirLawChapterExperience
        completed={false}
        onToggleComplete={() => {}}
      />,
    );

    // Hero title
    expect(screen.getByText(/International Civil Aviation Law & Operating Regulations/i)).toBeTruthy();

    // Key facts
    expect(screen.getByText(/8 Essential Rules for Aviation Law Exams/i)).toBeTruthy();
    expect(screen.getAllByText(/Every State has complete and exclusive sovereignty/i).length).toBeGreaterThan(0);

    // Guided step 1
    expect(screen.getByText(/International Aviation Needs Shared Rules/i)).toBeTruthy();
  });

  it("supports switching tabs in the Regulatory Explorer", () => {
    render(
      <AirLawChapterExperience
        completed={false}
        onToggleComplete={() => {}}
      />,
    );

    const explorer = screen.getByLabelText(/Regulatory Explorer/i);

    // Default tab shows Chicago Convention
    expect(within(explorer).getByText(/Airspace Sovereignty/i)).toBeTruthy();
    expect(within(explorer).getByText(/Notification of Differences/i)).toBeTruthy();

    // Switch to Freedoms of the Air tab
    const freedomsTab = within(explorer).getByRole("tab", { name: /freedoms of the air/i });
    fireEvent.click(freedomsTab);
    expect(within(explorer).getByText(/1st Freedom/i)).toBeTruthy();
    expect(within(explorer).getByText(/Overflight Privilege/i)).toBeTruthy();

    // Switch to Security & Liability tab
    const treatiesTab = within(explorer).getByRole("tab", { name: /security & liability/i });
    fireEvent.click(treatiesTab);
    expect(within(explorer).getByText(/Tokyo Convention 1963/i)).toBeTruthy();
    expect(within(explorer).getByText(/Hague Convention 1970/i)).toBeTruthy();

    // Switch to Airspace Classes & VMC tab
    const airspaceTab = within(explorer).getByRole("tab", { name: /airspace classes & vmc/i });
    fireEvent.click(airspaceTab);
    expect(within(explorer).getByText(/Class A/i)).toBeTruthy();
    expect(within(explorer).getByText(/Standard VMC Weather Minima/i)).toBeTruthy();
  });

  it("evaluates Air Law practice quiz answers and tracks score", () => {
    render(
      <AirLawChapterExperience
        completed={false}
        onToggleComplete={() => {}}
      />,
    );

    // Question 1: Article 1 of Chicago Convention
    const q1OptionC = screen.getByRole("button", { name: /C Article 1/i });
    fireEvent.click(q1OptionC);

    // Answer feedback should appear
    expect(screen.getByText(/✓ Correct!/i)).toBeTruthy();
    expect(screen.getAllByText(/1 \/ 8 Correct/i).length).toBeGreaterThan(0);
  });
});
