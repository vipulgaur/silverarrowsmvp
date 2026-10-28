import { describe, expect, it } from "vitest";
import { canAccess } from "@/lib/logic";
import { chapterById, learningChapters } from "@/lib/learning-content";
import { courseProgress, learningRecord, saveLearningRecord } from "@/lib/learning-state";
import { restoreDemoData } from "@/lib/demo-storage";
import { seedData } from "@/lib/seed";
import chapterTwoSource from "@/content/learning/chapter-02.md?raw";
import chapterThreeSource from "@/content/learning/chapter-03.md?raw";
import source from "@/content/learning/chapter-01.md?raw";
import { parseLearningSource } from "@/lib/learning-source";
import { figureAssets } from "@/lib/learning-illustrations";
import fuelSamplingArtwork from "@/assets/learning/fuel-sampling-original.jpg";
import walkAroundArtwork from "@/assets/learning/walk-around-original.jpg";
describe("Flying Training course", () => {
  const chapterId = "chapter-01";
  it("makes the requested Chapter 2 available with both recreated interactive figures", () => {
    const c = chapterById("chapter-02");
    expect(c?.sections.length).toBeGreaterThan(0);
    const figures = c?.sections.flatMap((s) => s.blocks).filter((b) => b.type === "image") ?? [];
    expect(figures.map((b) => b.figure.id)).toEqual(["Fig-02-01", "Fig-02-02"]);
    for (const b of figures) {
      expect(figureAssets[b.figure.id]?.parts.length).toBeGreaterThan(0);
    }
    expect(parseLearningSource(chapterTwoSource)).toEqual(c?.sections);
  });
  it("uses newly created artwork instead of either original PDF crop", () => {
    expect(figureAssets["Fig-02-01"]?.src).toBe(fuelSamplingArtwork);
    expect(figureAssets["Fig-02-02"]?.src).toBe(walkAroundArtwork);
    for (const id of ["Fig-02-01", "Fig-02-02"]) {
      expect(figureAssets[id]?.src).not.toContain("/__l5e/assets-v1/");
    }
  });
  it("uses Chapter 3 verbatim with all five interactive figures", () => {
    const c = chapterById("chapter-03");
    expect(parseLearningSource(chapterThreeSource)).toEqual(c?.sections);
    const ids = c?.sections
      .flatMap((s) => s.blocks)
      .flatMap((b) => (b.type === "image" ? [b.figure.id] : []));
    expect(ids).toEqual(["Fig-03-01", "Fig-03-02", "Fig-03-03", "Fig-03-04", "Fig-03-05"]);
    for (const id of ids ?? []) expect(figureAssets[id]?.parts.length).toBeGreaterThan(0);
  });
  it("uses Chapter 4 with all 26 interactive figures", () => {
    const ids =
      chapterById("chapter-04")
        ?.sections.flatMap((s) => s.blocks)
        .flatMap((b) => (b.type === "image" ? [b.figure.id] : [])) ?? [];
    expect(ids).toHaveLength(26);
    for (const id of ids) expect(figureAssets[id]?.parts.length).toBeGreaterThan(0);
  });
  it("retains independent notes and completion for Chapter 2", () => {
    const records = saveLearningRecord([], "a", "chapter-02", {
      notes: "Fuel check",
      completed: true,
    });
    expect(learningRecord(records, "a", "chapter-02").notes).toBe("Fuel check");
    expect(learningRecord(records, "b", "chapter-02").notes).toBe("");
    expect(courseProgress(records, "a")).toEqual({ completed: 1, total: 4, percent: 25 });
  });
  it.each(["admin", "instructor", "ground", "student"] as const)("allows %s access", (role) => {
    expect(canAccess(role, "/learning")).toBe(true);
    expect(canAccess(role, `/learning/${chapterId}`)).toBe(true);
  });
  it("prepares all 19 chapters and populates Chapters 1 to 4", () => {
    expect(learningChapters).toHaveLength(19);
    expect(chapterById("chapter-01")?.sections.length).toBe(11);
    expect(learningChapters.slice(4).every((c) => c.sections.length === 0)).toBe(true);
    expect(chapterById("chapter-19")?.page).toBe("347");
    expect(chapterById("chapter-13")?.children).toHaveLength(8);
  });
  it("does not allow placeholder chapters to acquire completion or notes", () => {
    expect(saveLearningRecord([], "a", "chapter-05", { completed: true, notes: "test" })).toEqual(
      [],
    );
  });
  it("isolates per-member learning records and excludes old-course records", () => {
    const records = saveLearningRecord([], "a", chapterId, {
      completed: true,
      bookmarked: true,
      notes: "My notes",
    });
    expect(courseProgress(records, "a")).toEqual({ completed: 1, total: 4, percent: 25 });
    expect(courseProgress(records, "b").percent).toBe(0);
    expect(learningRecord(records, "b", chapterId).notes).toBe("");
    expect(
      courseProgress(
        [
          {
            ...learningRecord(records, "a", chapterId),
            chapterId: "introduction-to-flight-planning",
          },
        ],
        "a",
      ).completed,
    ).toBe(0);
  });
  it("preserves snapshots and migrates older collections", () => {
    const original = seedData();
    const { learningRecords, ...older } = original;
    expect(restoreDemoData(JSON.stringify(older)).learningRecords).toEqual([]);
    original.learningRecords = saveLearningRecord([], "a", chapterId, { notes: "Saved" });
    expect(restoreDemoData(JSON.stringify(original)).learningRecords).toEqual(
      original.learningRecords,
    );
  });
  it("rejects unknown chapters", () => {
    expect(chapterById("missing")).toBeUndefined();
    expect(saveLearningRecord([], "a", "missing", { completed: true })).toEqual([]);
  });
  it("preserves source prose while extracting all nine exact figure prompts", () => {
    const sections = parseLearningSource(source);
    const figures = sections.flatMap((s) => s.blocks).filter((b) => b.type === "image");
    expect(figures).toHaveLength(9);
    for (const block of sections.flatMap((s) => s.blocks)) {
      if (block.type === "markdown") expect(source.includes(block.text)).toBe(true);
      else {
        if (block.figure.prompt) expect(source.includes(block.figure.prompt)).toBe(true);
        expect(figureAssets[block.figure.id]?.parts.length).toBeGreaterThan(0);
      }
    }
    expect(figures.map((f) => f.figure.id)).toEqual(
      Array.from({ length: 9 }, (_, i) => `Fig-01-${String(i + 1).padStart(2, "0")}`),
    );
  });
});

import { accessibleModulesFor, assignedCourseIds } from "@/lib/elearning-courses";
import { memberNotifications } from "@/lib/logic";
describe("Course assignment access control", () => {
  it("shows all courses to admin and only assigned courses to Vipul and students", () => {
    const d = seedData();
    const admin = d.users.find((u) => u.id === "u-admin")!;
    const vipul = d.users.find((u) => u.id === "u-vpl")!;
    const student = d.users.find((u) => u.id === "u-ana")!;

    expect(accessibleModulesFor(admin, d).map((m) => m.id)).toEqual([
      "pooley",
      "airlaw",
      "airframes",
      "electrics",
      "powerplant",
    ]);
    expect(accessibleModulesFor(vipul, d)).toEqual([]);
    expect(accessibleModulesFor(student, d)).toEqual([]);

    // Assign Air Law to Vipul
    d.activity.unshift({
      id: "assign-1",
      at: new Date().toISOString(),
      actorId: admin.id,
      actorName: admin.name,
      actorRole: "admin",
      action: "course_assigned",
      entityType: "lesson",
      entityId: vipul.id,
      details: 'Course "Air Law" assigned to Vipul Aviation (Flight Instructor (CFI))',
    });

    expect(assignedCourseIds(vipul.id, d)).toEqual(["airlaw"]);
    expect(accessibleModulesFor(vipul, d).map((m) => m.id)).toEqual(["airlaw"]);
    expect(accessibleModulesFor(student, d)).toEqual([]);

    // Verify notification for course assignment routes directly to /elearning
    const notifs = memberNotifications(d, vipul);
    const courseNotif = notifs.find((n) => n.category === "course");
    expect(courseNotif?.to).toBe("/elearning");
  });
});

import {
  airframesChapters,
  airframesChapterById,
  airframesCourseTitle,
} from "@/lib/airframes-content";
import { airframesFigureAssets } from "@/lib/airframes-illustrations";

describe("CAE ATPL 2: Airframes & Systems course", () => {
  it("prepares all 16 chapters from the textbook table of contents and populates all 16 chapters", () => {
    expect(airframesChapters).toHaveLength(16);
    expect(airframesCourseTitle).toContain("Airframes");
    expect(airframesChapters[0].title).toBe("Fuselage, Wings and Stabilizing Surfaces");
    expect(airframesChapters[1].title).toBe("Basic Hydraulics");
    expect(airframesChapters[15].title).toBe("Aircraft Fuel Systems");
    expect(airframesChapters.every((c) => c.sections.length > 0)).toBe(true);
  });

  it("loads Chapter 1 with all 33 sections and all 31 interactive figures", () => {
    const ch1 = airframesChapterById("chapter-01");
    expect(ch1).toBeDefined();
    expect(ch1?.sections).toHaveLength(33);

    const imageBlocks =
      ch1?.sections.flatMap((s) => s.blocks).filter((b) => b.type === "image") ?? [];
    expect(imageBlocks).toHaveLength(31);

    for (const img of imageBlocks) {
      const asset = figureAssets[img.figure.id] ?? airframesFigureAssets[img.figure.id];
      expect(asset).toBeDefined();
      expect(asset.parts.length).toBeGreaterThanOrEqual(2);
      for (const part of asset.parts) {
        expect(part.label.length).toBeGreaterThan(0);
        expect(part.detail.length).toBeGreaterThan(0);
        expect(part.x).toBeGreaterThan(0);
        expect(part.y).toBeGreaterThan(0);
      }
    }
  });
});

import {
  electricsChapters,
  electricsChapterById,
  electricsCourseTitle,
} from "@/lib/electrics-content";
import { electricsFigureAssets } from "@/lib/electrics-illustrations";

describe("CAE ATPL 3: Electrics & Electronics course", () => {
  it("prepares all 17 chapters from the textbook table of contents and populates all 17 chapters", () => {
    expect(electricsChapters).toHaveLength(17);
    expect(electricsCourseTitle).toContain("Electrics");
    expect(electricsChapters[0].title).toBe("DC Electrics: Basic Principles");
    expect(electricsChapters[1].title).toBe("DC Electrics: Switches");
    expect(electricsChapters[16].title).toBe("AC Electrics: Logic Gates");
    expect(electricsChapters.every((c) => c.sections.length > 0)).toBe(true);
  });

  it("loads Chapter 1 with all 14 sections and interactive figures with defined hotspots", () => {
    const ch1 = electricsChapterById("chapter-01");
    expect(ch1).toBeDefined();
    expect(ch1?.sections).toHaveLength(14);

    const imageBlocks =
      ch1?.sections.flatMap((s) => s.blocks).filter((b) => b.type === "image") ?? [];
    expect(imageBlocks.length).toBeGreaterThanOrEqual(9);

    for (const img of imageBlocks) {
      const asset = figureAssets[img.figure.id] ?? electricsFigureAssets[img.figure.id];
      if (asset) {
        expect(asset.parts.length).toBeGreaterThanOrEqual(2);
        for (const part of asset.parts) {
          expect(part.label.length).toBeGreaterThan(0);
          expect(part.detail.length).toBeGreaterThan(0);
          expect(part.x).toBeGreaterThan(0);
          expect(part.y).toBeGreaterThan(0);
        }
      }
    }
  });

  it("loads AC Electrics chapters with interactive figures and sections", () => {
    const ch11 = electricsChapterById("chapter-11");
    expect(ch11).toBeDefined();
    expect(ch11?.sections.length).toBeGreaterThan(0);
    const ch17 = electricsChapterById("chapter-17");
    expect(ch17).toBeDefined();
    expect(ch17?.sections.length).toBeGreaterThan(0);

    // Verify key figures from AC chapters are present in electricsFigureAssets
    expect(electricsFigureAssets["fig-11-01"]).toBeDefined();
    expect(electricsFigureAssets["fig-12-01"]).toBeDefined();
    expect(electricsFigureAssets["fig-17-01"]).toBeDefined();
  });
});

import {
  powerplantChapters,
  powerplantChapterById,
  powerplantCourseTitle,
} from "@/lib/powerplant-content";
import { powerplantFigureAssets } from "@/lib/powerplant-illustrations";

describe("CAE ATPL 4: Powerplant course", () => {
  it("prepares all 28 chapters from the textbook table of contents and populates all 28 chapters", () => {
    expect(powerplantChapters).toHaveLength(28);
    expect(powerplantCourseTitle).toContain("Powerplant");
    expect(powerplantChapters[0].title).toBe("Piston Engines: Introduction");
    expect(powerplantChapters[11].title).toBe("Piston Engines: Propellers");
    expect(powerplantChapters[12].title).toBe("Gas Turbines: Introduction");
    expect(powerplantChapters[27].title).toBe("Revision Questions");
    expect(powerplantChapters.every((c) => c.sections.length > 0)).toBe(true);
  });

  it("loads Chapter 1 with 11 sections and interactive figures with defined hotspots", () => {
    const ch1 = powerplantChapterById("chapter-01");
    expect(ch1).toBeDefined();
    expect(ch1?.sections).toHaveLength(11);

    const imageBlocks =
      ch1?.sections.flatMap((s) => s.blocks).filter((b) => b.type === "image") ?? [];
    expect(imageBlocks).toHaveLength(3);

    for (const img of imageBlocks) {
      const asset = figureAssets[img.figure.id] ?? powerplantFigureAssets[img.figure.id];
      expect(asset).toBeDefined();
      expect(asset.parts.length).toBeGreaterThanOrEqual(2);
      for (const part of asset.parts) {
        expect(part.label.length).toBeGreaterThan(0);
        expect(part.detail.length).toBeGreaterThan(0);
        expect(part.x).toBeGreaterThan(0);
        expect(part.y).toBeGreaterThan(0);
      }
    }
  });

  it("loads Gas Turbine chapters with interactive figures and sections", () => {
    const ch15 = powerplantChapterById("chapter-15"); // Compressors
    expect(ch15).toBeDefined();
    expect(ch15?.sections.length).toBeGreaterThan(0);

    const ch16 = powerplantChapterById("chapter-16"); // Combustion Chambers
    expect(ch16).toBeDefined();
    expect(ch16?.sections.length).toBeGreaterThan(0);

    const ch17 = powerplantChapterById("chapter-17"); // Turbine Assembly
    expect(ch17).toBeDefined();
    expect(ch17?.sections.length).toBeGreaterThan(0);

    // Verify key figures from Gas Turbine chapters are present in powerplantFigureAssets
    expect(powerplantFigureAssets["fig-13-01"]).toBeDefined();
    expect(powerplantFigureAssets["fig-15-01"]).toBeDefined();
    expect(powerplantFigureAssets["fig-16-01"]).toBeDefined();
    expect(powerplantFigureAssets["fig-17-01"]).toBeDefined();
    expect(powerplantFigureAssets["fig-20-01"]).toBeDefined();
  });

  it("extracts full original .md image prompts for all figures across Modules 2, 3, and 4", () => {
    const airframesFigures = airframesChapters
      .flatMap((c) => c.sections)
      .flatMap((s) => s.blocks)
      .filter((b) => b.type === "image");
    const electricsFigures = electricsChapters
      .flatMap((c) => c.sections)
      .flatMap((s) => s.blocks)
      .filter((b) => b.type === "image");
    const powerplantFigures = powerplantChapters
      .flatMap((c) => c.sections)
      .flatMap((s) => s.blocks)
      .filter((b) => b.type === "image");

    expect(airframesFigures).toHaveLength(209);
    expect(electricsFigures).toHaveLength(154);
    expect(powerplantFigures).toHaveLength(185);

    for (const block of [...airframesFigures, ...electricsFigures, ...powerplantFigures]) {
      expect(block.figure.id.startsWith("Fig-")).toBe(false);
      expect(block.figure.prompt).toBeDefined();
      expect(block.figure.prompt!.length).toBeGreaterThan(20);
      expect(block.figure.caption).toBe(block.figure.prompt);
    }
  });
});
