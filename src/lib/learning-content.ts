import chapter01Raw from "@/content/learning/chapter-01.md?raw";
import chapter02Raw from "@/content/learning/chapter-02.md?raw";
import chapter03Raw from "@/content/learning/chapter-03.md?raw";
import { parseLearningSource, type LearningSection } from "@/lib/learning-source";

export const courseTitle = "Air Manual — Pooley";
export const courseSubtitle = "Volume 1 · Flying Training (EASA / UK Part-FCL PPL & LAPL)";

export const bookExtras = [
  { title: "Introduction" },
  { title: "Conversion Factors & Abbreviations" },
  { title: "Index" },
];

export interface LearningChapterChild {
  label: string;
  title: string;
}

export interface LearningChapter {
  id: string;
  number: number;
  title: string;
  page: string;
  sections: LearningSection[];
  children: LearningChapterChild[];
}

const chapterFourSections: LearningSection[] = [
  {
    id: "section-1",
    title: "1. Taxying Principles, Speed Control and Wind Corrections",
    blocks: [
      {
        type: "markdown",
        text: "Taxying is the controlled movement of the aeroplane on the ground under its own power. Maintain a brisk walking pace, steer with rudder pedals, test brakes immediately after moving off, and position ailerons and elevator correctly for headwind, tailwind, and quartering winds.",
      },
      ...Array.from({ length: 6 }, (_, i) => ({
        type: "image" as const,
        figure: {
          id: `Fig-04-${String(i + 1).padStart(2, "0")}`,
          title: `Taxying Wind Correction & Ground Handling (${i + 1})`,
          caption:
            "Control column positioning for quartering headwinds and tailwinds during ground taxying.",
        },
      })),
    ],
  },
  {
    id: "section-2",
    title: "2. Straight and Level Flight at Normal Cruising Power",
    blocks: [
      {
        type: "markdown",
        text: "Straight and level flight requires maintaining a constant heading, constant altitude, and wings level in balanced flight using the integrated visual attitude + instrument scan (Attitude – Look-Out – Attitude – Instruments).",
      },
      ...Array.from({ length: 7 }, (_, i) => ({
        type: "image" as const,
        figure: {
          id: `Fig-04-${String(i + 7).padStart(2, "0")}`,
          title: `Straight and Level Attitude Reference (${i + 1})`,
          caption:
            "Visual horizon cut across the nose cowling and wing tips in straight and level cruise.",
        },
      })),
    ],
  },
  {
    id: "section-3",
    title: "3. Straight and Level at Different Airspeeds (Power + Attitude = Performance)",
    blocks: [
      {
        type: "markdown",
        text: "As airspeed increases, a lower nose attitude is required to maintain constant altitude; at low airspeed, a higher nose-up attitude is required so that the increased angle of attack compensates for reduced dynamic pressure.",
      },
      ...Array.from({ length: 7 }, (_, i) => ({
        type: "image" as const,
        figure: {
          id: `Fig-04-${String(i + 14).padStart(2, "0")}`,
          title: `Airspeed, Attitude and Lift Vector Balance (${i + 1})`,
          caption:
            "Relationship between power setting, pitch attitude, angle of attack, and level flight path.",
        },
      })),
    ],
  },
  {
    id: "section-4",
    title: "4. Balance, Slip Ball and Trim Technique in Level Flight",
    blocks: [
      {
        type: "markdown",
        text: "Any change in power alters slipstream and torque, requiring coordinated rudder input to keep the balance ball centred and accurate elevator re-trimming once speed stabilises.",
      },
      ...Array.from({ length: 6 }, (_, i) => ({
        type: "image" as const,
        figure: {
          id: `Fig-04-${String(i + 21).padStart(2, "0")}`,
          title: `Slip/Skid Balance & Trim Stabilization (${i + 1})`,
          caption:
            "Coordinating rudder with power changes and trimming out residual control pressures.",
        },
      })),
    ],
  },
];

const CATALOGUE: Array<{
  number: number;
  title: string;
  page: string;
  children?: LearningChapterChild[];
}> = [
  { number: 1, title: "Familiarisation with the Aeroplane", page: "1" },
  { number: 2, title: "Preparation for Flight and Action After Flight", page: "27" },
  { number: 3, title: "Air Experience and Effects of Controls", page: "45" },
  { number: 4, title: "Taxying and Straight and Level Flight", page: "67" },
  { number: 5, title: "Climbing", page: "95" },
  { number: 6, title: "Descending", page: "113" },
  { number: 7, title: "Turning", page: "129" },
  { number: 8, title: "Slow Flight and Stalling", page: "149" },
  { number: 9, title: "Spinning and Spiral Dives", page: "177" },
  { number: 10, title: "Take-off and Climb to Downwind Position", page: "193" },
  { number: 11, title: "The Circuit, Approach and Landing", page: "215" },
  { number: 12, title: "First Solo and Consolidation", page: "249" },
  {
    number: 13,
    title: "Advanced Turning, Steep Turns and Manoeuvring",
    page: "259",
    children: [
      { label: "13a", title: "Steep Level Turns (45° and 60° Bank)" },
      { label: "13b", title: "Steep Gliding and Descending Turns" },
      { label: "13c", title: "Maximum Rate Climbing Turns" },
      { label: "13d", title: "Stalling in a Turn and Wing Drop Recovery" },
      { label: "13e", title: "Unusual Attitudes and Recovery Technique" },
      { label: "13f", title: "Flight at Minimum Controllable Airspeed" },
      { label: "13g", title: "Sideslipping in the Approach" },
      { label: "13h", title: "Short-Field and Soft-Field Considerations" },
    ],
  },
  { number: 14, title: "Forced Landings Without Power", page: "279" },
  { number: 15, title: "Precautionary Landings and Bad Weather Circuits", page: "297" },
  { number: 16, title: "Instrument Flying Appreciation", page: "309" },
  { number: 17, title: "Pilot Navigation and Cross-Country Flying", page: "323" },
  { number: 18, title: "Night Flying Training", page: "337" },
  { number: 19, title: "Revision and Skill Test Preparation", page: "347" },
];

export const learningChapters: LearningChapter[] = CATALOGUE.map((item) => {
  const id = `chapter-${String(item.number).padStart(2, "0")}`;
  let sections: LearningSection[] = [];
  if (item.number === 1) sections = parseLearningSource(chapter01Raw);
  else if (item.number === 2) sections = parseLearningSource(chapter02Raw);
  else if (item.number === 3) sections = parseLearningSource(chapter03Raw);
  else if (item.number === 4) sections = chapterFourSections;

  return {
    id,
    number: item.number,
    title: item.title,
    page: item.page,
    sections,
    children: item.children ?? [],
  };
});

export function chapterById(id: string): LearningChapter | undefined {
  return learningChapters.find((c) => c.id === id);
}

export function learningMeta(title: string, description?: string) {
  return {
    meta: [
      { title: `${title} — SilverArrows` },
      ...(description
        ? [
            { name: "description", content: description },
            { property: "og:title", content: `${title} — SilverArrows` },
            { property: "og:description", content: description },
          ]
        : []),
    ],
  };
}
