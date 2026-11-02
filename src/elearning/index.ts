/**
 * Segregated E-Learning Workspace Barrel & Boundary Manifest
 * Branch Owner (E-Learning Only): parthbhatt (Parth Bhatt)
 * Full-Platform Owner (FlightLogger + E-Learning): main (Vipul)
 */

export * from "@/lib/elearning-courses";
export * from "@/lib/learning-subjects";
export * from "@/lib/learning-content";
export * from "@/lib/learning-source";
export * from "@/lib/learning-state";
export * from "@/lib/learning-illustrations";
export * from "@/lib/airframes-content";
export * from "@/lib/airframes-illustrations";
export * from "@/lib/airlaw-content";
export * from "@/lib/airlaw-illustrations";
export * from "@/lib/electrics-content";
export * from "@/lib/electrics-illustrations";
export * from "@/lib/powerplant-content";
export * from "@/lib/powerplant-illustrations";
export * from "@/lib/universal-chapter-data";
export * from "@/lib/chapter-01-redesign-data";

export * from "./workspace-config";
export * from "./dev-workspace";
export * from "./dev-workspace-panel";

export { AssignedCoursesPanel, CourseReaderView } from "@/components/assigned-courses-panel";
export { LearningReader } from "@/components/learning-reader";
export { AirLawChapterExperience } from "@/components/air-law-chapter-experience";
export { FamiliarisationChapterExperience } from "@/components/familiarisation-chapter-experience";
export { UniversalChapterExperience } from "@/components/universal-chapter-experience";

export const ELEARNING_BRANCH_CONFIG = {
  branchName: "parthbhatt",
  mainBranch: "main",
  entryRoute: "/elearning",
  internalRoutes: [
    "/elearning",
    "/learning",
    "/learning/$chapterId",
  ],
  allowedPathPrefixes: [
    "src/elearning/",
    "src/content/learning/",
    "src/assets/learning/",
    "src/routes/elearning.tsx",
    "src/routes/_shell.learning.index.tsx",
    "src/routes/_shell.learning.$chapterId.tsx",
    "src/components/assigned-courses-panel.tsx",
    "src/components/learning-reader.tsx",
    "src/components/learning-blocks.tsx",
    "src/components/air-law-chapter-experience.tsx",
    "src/components/familiarisation-chapter-experience.tsx",
    "src/components/universal-chapter-experience.tsx",
    "src/lib/elearning-courses.ts",
    "src/lib/learning-subjects.ts",
    "src/lib/learning-content.ts",
    "src/lib/learning-source.ts",
    "src/lib/learning-state.ts",
    "src/lib/learning-illustrations.ts",
    "src/lib/airframes-content.ts",
    "src/lib/airframes-illustrations.ts",
    "src/lib/airlaw-content.ts",
    "src/lib/airlaw-illustrations.ts",
    "src/lib/electrics-content.ts",
    "src/lib/electrics-illustrations.ts",
    "src/lib/powerplant-content.ts",
    "src/lib/powerplant-illustrations.ts",
    "src/lib/universal-chapter-data.ts",
    "src/lib/chapter-01-redesign-data.ts",
  ],
} as const;
