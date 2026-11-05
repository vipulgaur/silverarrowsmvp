import chapter01Raw from "@/content/learning/airmanual/chapter-01.md?raw";
import chapter02Raw from "@/content/learning/airmanual/chapter-02.md?raw";
import chapter03Raw from "@/content/learning/airmanual/chapter-03.md?raw";
import chapter04Raw from "@/content/learning/airmanual/chapter-04.md?raw";
import chapter05Raw from "@/content/learning/airmanual/chapter-05.md?raw";
import chapter06Raw from "@/content/learning/airmanual/chapter-06.md?raw";
import chapter07Raw from "@/content/learning/airmanual/chapter-07.md?raw";
import chapter08Raw from "@/content/learning/airmanual/chapter-08.md?raw";
import chapter09Raw from "@/content/learning/airmanual/chapter-09.md?raw";
import chapter10Raw from "@/content/learning/airmanual/chapter-10.md?raw";
import chapter11Raw from "@/content/learning/airmanual/chapter-11.md?raw";
import chapter12Raw from "@/content/learning/airmanual/chapter-12.md?raw";
import chapter13Raw from "@/content/learning/airmanual/chapter-13.md?raw";
import chapter14Raw from "@/content/learning/airmanual/chapter-14.md?raw";
import chapter15Raw from "@/content/learning/airmanual/chapter-15.md?raw";
import chapter16Raw from "@/content/learning/airmanual/chapter-16.md?raw";
import chapter17Raw from "@/content/learning/airmanual/chapter-17.md?raw";
import chapter18Raw from "@/content/learning/airmanual/chapter-18.md?raw";
import chapter19Raw from "@/content/learning/airmanual/chapter-19.md?raw";
import { parseLearningSource, type LearningSection } from "@/lib/learning-source";
import type { LearningChapter, LearningChapterChild } from "@/lib/learning-content";

export const airmanualCourseTitle = "CAE ATPL 0: Air Manual";
export const airmanualCourseSubtitle =
  "Volume 1 · Flying Training — The Air Pilot's Manual (EASA / UK Part-FCL PPL & LAPL)";

export const airmanualBookExtras = [
  { title: "Introduction" },
  { title: "Abbreviations" },
  { title: "Index" },
];

// Raw STE-structured markdown per chapter. Only chapters that have been authored
// are wired; the remainder resolve to empty sections (shown as "coming soon" and
// excluded from progress) until their content is added.
const RAW_CHAPTERS: Record<number, string | undefined> = {
  1: chapter01Raw,
  2: chapter02Raw,
  3: chapter03Raw,
  4: chapter04Raw,
  5: chapter05Raw,
  6: chapter06Raw,
  7: chapter07Raw,
  8: chapter08Raw,
  9: chapter09Raw,
  10: chapter10Raw,
  11: chapter11Raw,
  12: chapter12Raw,
  13: chapter13Raw,
  14: chapter14Raw,
  15: chapter15Raw,
  16: chapter16Raw,
  17: chapter17Raw,
  18: chapter18Raw,
  19: chapter19Raw,
};

// Chapter catalogue — titles taken from the source module (19 chapters).
const AIRMANUAL_CATALOGUE: Array<{
  number: number;
  title: string;
  page: string;
  children?: LearningChapterChild[];
}> = [
  { number: 1, title: "Aircraft Familiarisation", page: "1" },
  { number: 2, title: "Before and After Flight", page: "2" },
  { number: 3, title: "Air Experience", page: "3" },
  { number: 4, title: "The Controls", page: "4" },
  { number: 5, title: "Taxiing an Aeroplane", page: "5" },
  { number: 6, title: "Straight and Level", page: "6" },
  { number: 7, title: "Climbing", page: "7" },
  { number: 8, title: "Descending", page: "8" },
  { number: 9, title: "Turning", page: "9" },
  { number: 10, title: "Stalling and Slow Flight", page: "10" },
  { number: 11, title: "Spinning", page: "11" },
  { number: 12, title: "Standard Take-Off and Climb to Downwind Leg", page: "12" },
  { number: 13, title: "Circuits, Approaches and Landings", page: "13" },
  { number: 14, title: "First Solo", page: "14" },
  { number: 15, title: "Advanced Turning", page: "15" },
  { number: 16, title: "The Forced Landing Without Power", page: "16" },
  { number: 17, title: "Precautionary Landings", page: "17" },
  { number: 18, title: "Pilot Navigation", page: "18" },
  { number: 19, title: "Instrument Flying", page: "19" },
];

export const airmanualChapters: LearningChapter[] = AIRMANUAL_CATALOGUE.map((item) => {
  const id = `chapter-${String(item.number).padStart(2, "0")}`;
  const raw = RAW_CHAPTERS[item.number];
  const sections: LearningSection[] = raw ? parseLearningSource(raw) : [];
  return {
    id,
    number: item.number,
    title: item.title,
    page: item.page,
    sections,
    children: item.children ?? [],
  };
});

export function airmanualChapterById(id: string): LearningChapter | undefined {
  return airmanualChapters.find((c) => c.id === id);
}
