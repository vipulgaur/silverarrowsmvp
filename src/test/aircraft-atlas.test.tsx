import { describe, expect, it, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  AIRFRAME,
  CHECKRIDE,
  PART_BY_ID,
  PARTS,
  SYSTEMS,
  TOURS,
  askTheAircraft,
  isCheckrideAnswerCorrect,
  linkedPartIds,
  parseAtlasState,
  partsForSystem,
  provenanceNoteFor,
  searchAtlas,
  serializeAtlasState,
} from "@/lib/atlas/c172-data";
import {
  loadFlightbook,
  markPartInspected,
  markTourCompleted,
  recordCheckrideScore,
  resetFlightbook,
  summarizeFlightbook,
} from "@/lib/atlas/flightbook";
import { buildC172Scene } from "@/lib/atlas/c172-geometry";
import { AircraftAtlasApp } from "@/components/atlas/aircraft-atlas-app";
import { canAccess } from "@/lib/logic";

describe("AIRCRAFT ATLAS · CESSNA 172S SKYHAWK SP (OY-AAA)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("enforces RBAC so only Administrator can access /atlas", () => {
    expect(canAccess("admin", "/atlas")).toBe(true);
    expect(canAccess("student", "/atlas")).toBe(false);
    expect(canAccess("instructor", "/atlas")).toBe(false);
    expect(canAccess("ground", "/atlas")).toBe(false);
  });

  it("defines all 71 parts across the 6 aircraft systems with valid connection graphs and cockpit interior", () => {
    expect(PARTS).toHaveLength(71);
    expect(SYSTEMS).toHaveLength(6);

    const expectedCounts: Record<string, number> = {
      structure: 14,
      powerplant: 13,
      fuel: 10,
      controls: 12,
      gear: 9,
      cockpit: 13,
    };

    for (const sys of SYSTEMS) {
      expect(partsForSystem(sys.id)).toHaveLength(expectedCounts[sys.id]);
    }

    for (const part of PARTS) {
      expect(part.name.length).toBeGreaterThan(2);
      expect(part.what.length).toBeGreaterThan(20);
      const note = provenanceNoteFor(part);
      expect(note.registry.length).toBeGreaterThan(10);
      expect(note.listing.length).toBeGreaterThan(10);
      expect(note.schematic.length).toBeGreaterThan(10);

      for (const upId of part.upstream) {
        expect(PART_BY_ID[upId]).toBeDefined();
      }
      for (const downId of part.downstream) {
        expect(PART_BY_ID[downId]).toBeDefined();
      }
      const linked = linkedPartIds(part.id);
      expect(linked.length).toBeGreaterThanOrEqual(0);
    }
  });

  it("builds the procedural 3D Cessna 172S scene with all 71 clickable part assemblies and G1000 cockpit", () => {
    const built = buildC172Scene();
    expect(Object.keys(built.parts)).toHaveLength(71);

    for (const part of PARTS) {
      const node = built.parts[part.id];
      expect(node).toBeDefined();
      expect(node.meshes.length).toBeGreaterThan(0);
      expect(node.meshes[0].userData.partId).toBe(part.id);
    }

    // Verify key cockpit and engine assemblies
    expect(built.parts["pfd"]).toBeDefined();
    expect(built.parts["mfd"]).toBeDefined();
    expect(built.parts["engine"]).toBeDefined();
    expect(built.parts["propeller"]).toBeDefined();
    expect(built.parts["yokes"]).toBeDefined();
  });

  it("supports Guided Tours, Checkride questions, Search, Ask the Aircraft, and URL serialization", () => {
    expect(TOURS).toHaveLength(3);
    expect(TOURS.map((t) => t.steps.length)).toEqual([6, 7, 6]);
    expect(CHECKRIDE).toHaveLength(10);

    // Checkride evaluation
    const mcq = CHECKRIDE[0];
    expect(mcq.kind).toBe("mcq");
    expect(isCheckrideAnswerCorrect(mcq, 2)).toBe(true);
    expect(isCheckrideAnswerCorrect(mcq, 0)).toBe(false);

    const locate = CHECKRIDE[1];
    expect(locate.kind).toBe("locate");
    expect(isCheckrideAnswerCorrect(locate, "fuel-selector")).toBe(true);
    expect(isCheckrideAnswerCorrect(locate, "nose-gear")).toBe(false);

    // Search
    const searchHits = searchAtlas("Lycoming");
    expect(searchHits.some((r) => r.id === "engine")).toBe(true);

    // Ask the Aircraft
    const answer = askTheAircraft("gravity fuel");
    expect(answer.found).toBe(true);
    expect(answer.citations.length).toBeGreaterThan(0);

    // URL state round-trip
    const qs = serializeAtlasState({
      system: "fuel",
      part: "fuel-tank-l",
      explode: 65,
      isolate: true,
      seeThrough: true,
      tour: { id: "trace-fuel", step: 2 },
      camera: { position: [10, 5, 11], target: [0, 0, -0.5] },
    });
    const parsed = parseAtlasState(qs);
    expect(parsed.system).toBe("fuel");
    expect(parsed.part).toBe("fuel-tank-l");
    expect(parsed.explode).toBe(65);
    expect(parsed.isolate).toBe(true);
    expect(parsed.seeThrough).toBe(true);
    expect(parsed.tour).toEqual({ id: "trace-fuel", step: 2 });
  });

  it("persists and summarizes My Flightbook progress in localStorage", () => {
    let state = resetFlightbook();
    state = markPartInspected(state, "wing-l");
    state = markPartInspected(state, "pfd");
    state = markTourCompleted(state, "walkaround");
    state = recordCheckrideScore(state, 9, 10);

    const reloaded = loadFlightbook();
    const summary = summarizeFlightbook(reloaded);
    expect(summary.partsInspected).toBe(2);
    expect(summary.systemsExplored).toBe(2);
    expect(summary.toursCompleted).toBe(1);
    expect(summary.checkrideBest?.score).toBe(9);
  });

  it("renders AircraftAtlasApp and supports Explore, Guided Tour, Checkride, Read as Text, and Flightbook", () => {
    render(<AircraftAtlasApp />);

    expect(screen.getByText(AIRFRAME.heading)).toBeTruthy();
    expect(screen.getByTestId("explore-drawer")).toBeTruthy();

    // Select a part from the left sidebar
    fireEvent.click(screen.getByTestId("sidebar-part-wing-l"));
    expect(screen.getByTestId("part-inspector-detail")).toBeTruthy();
    expect(screen.getByTestId("part-provenance-note")).toBeTruthy();

    // Follow an upstream/downstream chip
    fireEvent.click(screen.getByTestId("downstream-chip-aileron-l"));
    expect(screen.getByTestId("part-inspector-detail").textContent).toContain(
      "Left aileron",
    );

    // Verify Cockpit camera preset button exists and can be clicked
    const cockpitPresetBtn = screen.getByTestId("camera-preset-cockpit");
    expect(cockpitPresetBtn).toBeTruthy();
    fireEvent.click(cockpitPresetBtn);

    // Verify Theme toggle button exists and can be clicked
    const themeBtn = screen.getByTestId("atlas-theme-toggle-btn");
    expect(themeBtn).toBeTruthy();
    fireEvent.click(themeBtn);

    // Verify Expand / Fullscreen button exists and can be clicked
    const expandBtn = screen.getByTestId("atlas-expand-btn");
    expect(expandBtn).toBeTruthy();
    fireEvent.click(expandBtn);

    // Switch to Guided Tour mode
    fireEvent.click(screen.getByTestId("mode-tab-tour"));
    expect(screen.getByTestId("guided-tour-drawer")).toBeTruthy();
    fireEvent.click(screen.getByTestId("tour-next-btn"));
    expect(screen.getByTestId("guided-tour-drawer").textContent).toContain("STOP 2 OF 6");

    // Switch to Checkride mode and answer Question 1 (MCQ) + Question 2 (3D Locate)
    fireEvent.click(screen.getByTestId("mode-tab-checkride"));
    expect(screen.getByTestId("checkride-drawer")).toBeTruthy();
    fireEvent.click(screen.getByTestId("checkride-opt-2"));
    expect(screen.getByTestId("checkride-feedback").textContent).toContain("Correct");

    // Jump to Question 2 (Locate fuel selector) and click part
    fireEvent.click(screen.getByTestId("checkride-q-pill-2"));
    fireEvent.click(screen.getByTestId("system-filter-all"));
    fireEvent.click(screen.getByTestId("sidebar-part-fuel-selector"));
    expect(screen.getByTestId("checkride-feedback").textContent).toContain("Correct");

    // Toggle Read as text syllabus
    fireEvent.click(screen.getByTestId("atlas-read-text-btn"));
    expect(screen.getByTestId("atlas-read-as-text-view")).toBeTruthy();

    // Open My Flightbook modal
    fireEvent.click(screen.getByTestId("atlas-flightbook-btn"));
    expect(screen.getByTestId("atlas-flightbook-modal")).toBeTruthy();
  });
});
