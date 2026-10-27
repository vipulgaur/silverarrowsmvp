// CAE ATPL 1: Air Law (Subject 010) - Complete 28 Chapters
import chapter01Raw from "@/content/learning/airlaw/chapter-01.md?raw";
import chapter02Raw from "@/content/learning/airlaw/chapter-02.md?raw";
import chapter03Raw from "@/content/learning/airlaw/chapter-03.md?raw";
import chapter04Raw from "@/content/learning/airlaw/chapter-04.md?raw";
import chapter05Raw from "@/content/learning/airlaw/chapter-05.md?raw";
import chapter06Raw from "@/content/learning/airlaw/chapter-06.md?raw";
import chapter07Raw from "@/content/learning/airlaw/chapter-07.md?raw";
import chapter08Raw from "@/content/learning/airlaw/chapter-08.md?raw";
import chapter09Raw from "@/content/learning/airlaw/chapter-09.md?raw";
import chapter10Raw from "@/content/learning/airlaw/chapter-10.md?raw";
import chapter11Raw from "@/content/learning/airlaw/chapter-11.md?raw";
import chapter12Raw from "@/content/learning/airlaw/chapter-12.md?raw";
import chapter13Raw from "@/content/learning/airlaw/chapter-13.md?raw";
import chapter14Raw from "@/content/learning/airlaw/chapter-14.md?raw";
import chapter15Raw from "@/content/learning/airlaw/chapter-15.md?raw";
import chapter16Raw from "@/content/learning/airlaw/chapter-16.md?raw";
import chapter17Raw from "@/content/learning/airlaw/chapter-17.md?raw";
import chapter18Raw from "@/content/learning/airlaw/chapter-18.md?raw";
import chapter19Raw from "@/content/learning/airlaw/chapter-19.md?raw";
import chapter20Raw from "@/content/learning/airlaw/chapter-20.md?raw";
import chapter21Raw from "@/content/learning/airlaw/chapter-21.md?raw";
import chapter22Raw from "@/content/learning/airlaw/chapter-22.md?raw";
import chapter23Raw from "@/content/learning/airlaw/chapter-23.md?raw";
import chapter24Raw from "@/content/learning/airlaw/chapter-24.md?raw";
import chapter25Raw from "@/content/learning/airlaw/chapter-25.md?raw";
import chapter26Raw from "@/content/learning/airlaw/chapter-26.md?raw";
import chapter27Raw from "@/content/learning/airlaw/chapter-27.md?raw";
import chapter28Raw from "@/content/learning/airlaw/chapter-28.md?raw";
import { parseLearningSource, type LearningSection } from "@/lib/learning-source";
import type { LearningChapter, LearningChapterChild } from "@/lib/learning-content";

export const airlawCourseTitle = "CAE ATPL 1: Air Law";
export const airlawCourseSubtitle =
  "Module 5 · EASA / UK ATPL Theoretical Knowledge · Subject 010";

export const airlawBookExtras = [
  { title: "Table of Contents" },
  { title: "ICAO Annexes Quick Reference" },
  { title: "Airspace Classes & VMC Minima Matrix" },
  { title: "Subject Index" },
];

const RAW_CHAPTERS: Record<number, string> = {
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
  20: chapter20Raw,
  21: chapter21Raw,
  22: chapter22Raw,
  23: chapter23Raw,
  24: chapter24Raw,
  25: chapter25Raw,
  26: chapter26Raw,
  27: chapter27Raw,
  28: chapter28Raw,
};

export const AIRLAW_CATALOGUE: Array<{
  number: number;
  title: string;
  page: string;
  children?: LearningChapterChild[];
}> = [
  {
    number: 1,
    title: 'Definitions',
    page: '1',
    children: [
      { label: '1a', title: 'Introduction' },
      { label: '1b', title: 'Air Law' },
      { label: '1c', title: 'Abbreviations' },
      { label: '1d', title: 'Definitions' },
    ],
  },
  {
    number: 2,
    title: 'International Agreements and Organizations',
    page: '18',
    children: [
      { label: '2a', title: 'The Chicago Convention' },
      { label: '2b', title: 'International Law, Territory and Sovereignty' },
      { label: '2c', title: 'Commercial Rights and International Air Services' },
      { label: '2d', title: 'Customs, Excise and Immigration' },
    ],
  },
  {
    number: 3,
    title: 'Airworthiness of Aircraft',
    page: '39',
    children: [
      { label: '3a', title: 'Introduction' },
      { label: '3b', title: 'Airworthiness' },
      { label: '3c', title: 'Questions' },
      { label: '3d', title: 'Answers' },
    ],
  },
  {
    number: 4,
    title: 'Aircraft Nationality and Registration Marks',
    page: '54',
    children: [
      { label: '4a', title: 'Introduction' },
      { label: '4b', title: 'Nationality and Registration Marks' },
      { label: '4c', title: 'Certification of Registration' },
      { label: '4d', title: 'Aircraft Markings' },
    ],
  },
  {
    number: 5,
    title: 'Flight Crew Licensing',
    page: '69',
    children: [
      { label: '5a', title: 'Introduction' },
      { label: '5b', title: 'Definitions Used in Flight Crew Licensing' },
      { label: '5c', title: 'General Licensing Rules' },
      { label: '5d', title: 'Pilot Licences and Ratings' },
    ],
  },
  {
    number: 6,
    title: 'Rules of the Air',
    page: '93',
    children: [
      { label: '6a', title: 'History and Legal Application' },
      { label: '6b', title: 'Visual Meteorological Conditions and Flight Responsibility' },
      { label: '6c', title: 'General Rules' },
      { label: '6d', title: 'Flight Plans, ATC Clearances and Flight Reporting' },
    ],
  },
  {
    number: 7,
    title: 'Instrument Procedures — Departures',
    page: '123',
    children: [
      { label: '7a', title: '1 Instrument Procedures: General Introduction' },
      { label: '7b', title: '2 Abbreviations' },
      { label: '7c', title: '3 Obstacle Clearance' },
      { label: '7d', title: '4 PANS-OPS — ICAO Document 8168' },
    ],
  },
  {
    number: 8,
    title: 'Approach Procedures',
    page: '138',
    children: [
      { label: '8a', title: 'Procedure Basics' },
      { label: '8b', title: 'Approach Procedure Design' },
      { label: '8c', title: 'Obstacle Clearance Altitude/Height' },
      { label: '8d', title: 'Operating Minima' },
    ],
  },
  {
    number: 9,
    title: 'Circling Approach',
    page: '156',
    children: [
      { label: '9a', title: '1 Visual Manoeuvring (Circling): Purpose and Classification' },
      { label: '9b', title: '2 Conduct of the Visual Manoeuvre' },
      { label: '9c', title: '3 The Protected Visual Manoeuvring (Circling) Area' },
      { label: '9d', title: '4 Restricted or Prohibited Circling Sectors' },
    ],
  },
  {
    number: 10,
    title: 'Holding Procedures',
    page: '171',
    children: [
      { label: '10a', title: '1 Purpose and Use of Holding' },
      { label: '10b', title: '2 Keeping Within the Protected Area' },
      { label: '10c', title: '3 Standard Pattern: Shape and Terms' },
      { label: '10d', title: '4 Flying a Holding Pattern' },
    ],
  },
  {
    number: 11,
    title: 'Altimeter Setting Procedure',
    page: '186',
    children: [
      { label: '11a', title: '1 Why Altimeter Settings Matter' },
      { label: '11b', title: '2 Terrain Clearance on Departures and Arrivals' },
      { label: '11c', title: '3 Lowest Usable Flight Level' },
      { label: '11d', title: '4 Vertical Separation and Standard Pressure' },
    ],
  },
  {
    number: 12,
    title: 'Parallel or Near-parallel Runway Operation',
    page: '201',
    children: [
      { label: '12a', title: '1 Simultaneous Operations on Parallel Runways' },
      { label: '12b', title: '2 Modes of Parallel Runway Operation' },
      { label: '12c', title: '3 Mode 1 — Independent Parallel Approaches' },
      { label: '12d', title: '4 Separation During Independent Parallel Approaches' },
    ],
  },
  {
    number: 13,
    title: 'SSR and ACAS',
    page: '216',
    children: [
      { label: '13a', title: 'Secondary Surveillance Radar (SSR)' },
      { label: '13b', title: 'Airborne Collision Avoidance System (ACAS)' },
      { label: '13c', title: 'Questions' },
      { label: '13d', title: 'Answers' },
    ],
  },
  {
    number: 14,
    title: 'Airspace',
    page: '231',
    children: [
      { label: '14a', title: 'Introduction' },
      { label: '14b', title: 'Control Areas and Control Zones' },
      { label: '14c', title: 'Classes of Airspace' },
      { label: '14d', title: 'Required Navigation Performance (RNP)' },
    ],
  },
  {
    number: 15,
    title: 'Air Traffic Services',
    page: '246',
    children: [
      { label: '15a', title: 'Introduction' },
      { label: '15b', title: 'Air Traffic Control' },
      { label: '15c', title: 'ATC Clearances' },
      { label: '15d', title: 'Persons and Vehicles on Aerodromes' },
    ],
  },
  {
    number: 16,
    title: 'Separation',
    page: '262',
    children: [
      { label: '16a', title: 'Concept of Separation' },
      { label: '16b', title: 'Vertical Separation' },
      { label: '16c', title: 'Horizontal Separation' },
      { label: '16d', title: 'Radar Separation and Wake Turbulence' },
    ],
  },
  {
    number: 17,
    title: 'Control of Aircraft',
    page: '282',
    children: [
      { label: '17a', title: 'Procedural ATC' },
      { label: '17b', title: 'Radar Control' },
      { label: '17c', title: 'Figure 17.1 ATC radar head at Clee Hill, Shropshire' },
      { label: '17d', title: 'Figure 17.2 ATC radar head at London Heathrow' },
    ],
  },
  {
    number: 18,
    title: 'Aeronautical Information Service (AIS)',
    page: '300',
    children: [
      { label: '18a', title: 'Introduction' },
      { label: '18b', title: 'General' },
      { label: '18c', title: 'The Integrated Aeronautical Information Package' },
      { label: '18d', title: 'The Aeronautical Information Publication (AIP)' },
    ],
  },
  {
    number: 19,
    title: 'Aerodromes - Physical Characteristics',
    page: '315',
    children: [
      { label: '19a', title: 'Introduction' },
      { label: '19b', title: 'Aerodrome Reference Code' },
      { label: '19c', title: 'Glossary of Terms' },
      { label: '19d', title: 'Aerodrome Data' },
    ],
  },
  {
    number: 20,
    title: 'Aerodromes - Visual Aids, Markings and Signs',
    page: '330',
    children: [
      { label: '20a', title: 'Requirements' },
      { label: '20b', title: 'Visual Aids for Navigation' },
      { label: '20c', title: 'Runway Markings' },
      { label: '20d', title: 'Taxiway Markings' },
    ],
  },
  {
    number: 21,
    title: 'Aerodrome Lighting',
    page: '345',
    children: [
      { label: '21a', title: 'Aerodrome Lights' },
      { label: '21b', title: 'Approach Lighting Systems' },
      { label: '21c', title: 'Runway Lighting' },
      { label: '21d', title: 'Taxiway Lighting' },
    ],
  },
  {
    number: 22,
    title: 'Obstacle Marking and Aerodrome Services',
    page: '360',
    children: [
      { label: '22a', title: 'Introduction' },
      { label: '22b', title: 'Visual Aids for Denoting Obstacles' },
      { label: '22c', title: 'Visual Aids for Denoting Restricted Use Areas' },
      { label: '22d', title: 'Emergency and Other Services' },
    ],
  },
  {
    number: 23,
    title: 'Facilitation',
    page: '375',
    children: [
      { label: '23a', title: 'Aim' },
      { label: '23b', title: 'Entry and Departure of Aircraft' },
      { label: '23c', title: 'Questions' },
      { label: '23d', title: 'Answers' },
    ],
  },
  {
    number: 24,
    title: 'Search and Rescue',
    page: '390',
    children: [
      { label: '24a', title: 'Definitions and Abbreviations' },
      { label: '24b', title: 'Establishment and Provision of SAR Service' },
      { label: '24c', title: 'Co-operation between States' },
      { label: '24d', title: 'Operating Procedures' },
    ],
  },
  {
    number: 25,
    title: 'Security',
    page: '405',
    children: [
      { label: '25a', title: 'Introduction' },
      { label: '25b', title: 'Objectives' },
      { label: '25c', title: 'Organization' },
      { label: '25d', title: 'Preventative Security Measures' },
    ],
  },
  {
    number: 26,
    title: 'Aircraft Accident and Incident Investigation',
    page: '420',
    children: [
      { label: '26a', title: 'Introduction' },
      { label: '26b', title: 'Objective of Investigation' },
      { label: '26c', title: 'Investigations' },
      { label: '26d', title: 'Serious Incidents' },
    ],
  },
  {
    number: 27,
    title: 'Revision Questions',
    page: '435',
    children: [
      { label: '27a', title: 'Revision Questions' },
      { label: '27b', title: 'EASA Specimen Examination' },
      { label: '27c', title: 'Answer Key' },
    ],
  },
  {
    number: 28,
    title: 'Addendum: EASA Part-FCL & Part-MED',
    page: '478',
    children: [
      { label: '28a', title: 'European Aviation Safety Agency (EASA)' },
      { label: '28b', title: 'Licences' },
      { label: '28c', title: 'Ratings' },
      { label: '28d', title: 'Certificates' },
    ],
  },
];

export const airlawChapters: LearningChapter[] = AIRLAW_CATALOGUE.map((item) => {
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

export function airlawChapterById(id: string): LearningChapter | undefined {
  return airlawChapters.find((c) => c.id === id);
}
