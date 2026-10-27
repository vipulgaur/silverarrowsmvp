import chapter01Raw from "@/content/learning/airframes/chapter-01.md?raw";
import chapter02Raw from "@/content/learning/airframes/chapter-02.md?raw";
import chapter03Raw from "@/content/learning/airframes/chapter-03.md?raw";
import chapter04Raw from "@/content/learning/airframes/chapter-04.md?raw";
import chapter05Raw from "@/content/learning/airframes/chapter-05.md?raw";
import chapter06Raw from "@/content/learning/airframes/chapter-06.md?raw";
import chapter07Raw from "@/content/learning/airframes/chapter-07.md?raw";
import chapter08Raw from "@/content/learning/airframes/chapter-08.md?raw";
import chapter09Raw from "@/content/learning/airframes/chapter-09.md?raw";
import chapter10Raw from "@/content/learning/airframes/chapter-10.md?raw";
import chapter11Raw from "@/content/learning/airframes/chapter-11.md?raw";
import chapter12Raw from "@/content/learning/airframes/chapter-12.md?raw";
import chapter13Raw from "@/content/learning/airframes/chapter-13.md?raw";
import chapter14Raw from "@/content/learning/airframes/chapter-14.md?raw";
import chapter15Raw from "@/content/learning/airframes/chapter-15.md?raw";
import chapter16Raw from "@/content/learning/airframes/chapter-16.md?raw";
import { parseLearningSource, type LearningSection } from "@/lib/learning-source";
import type { LearningChapter, LearningChapterChild } from "@/lib/learning-content";

export const airframesCourseTitle = "CAE ATPL 2: Airframes & Systems";
export const airframesCourseSubtitle =
  "EASA / UK ATPL Theoretical Knowledge · Aircraft General Knowledge";

export const airframesBookExtras = [
  { title: "Table of Contents" },
  { title: "Abbreviations & Symbols" },
  { title: "CS-25 Certification Standards" },
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
};

export const AIRFRAMES_CATALOGUE: Array<{
  number: number;
  title: string;
  page: string;
  children?: LearningChapterChild[];
}> = [
  {
    number: 1,
    title: "Fuselage, Wings and Stabilizing Surfaces",
    page: "1",
    children: [
      {
        label: "Part 1",
        title: "Structural Loads, Design Philosophies & Fuselage Construction",
      },
      {
        label: "Part 2",
        title: "Windows, Doors, Wings, Stabilizing Surfaces, Materials & Corrosion",
      },
      {
        label: "Part 3",
        title: "Structural Limitations, Landing Damage, CS-25 Safety Objectives & Maintenance",
      },
    ],
  },
  {
    number: 2,
    title: "Basic Hydraulics",
    page: "45",
    children: [
      { label: "2a", title: "Pascal's Law, Hydrostatic Head & Force Multiplication" },
      { label: "2b", title: "Bramah's Press & Passive Brake Systems" },
      { label: "2c", title: "Mineral vs Synthetic Fluids, Seals & Pipeline Losses" },
      { label: "2d", title: "Six Primary Components & System Architecture" },
    ],
  },
  {
    number: 3,
    title: "Landing Gear",
    page: "87",
    children: [
      { label: "3a", title: "Fixed vs Retractable Landing Gear Configurations" },
      { label: "3b", title: "Oleo-Pneumatic Shock Absorbers & Damping Mechanics" },
      { label: "3c", title: "Gear Retraction Sequences, Mechanical Uplocks & Downlocks" },
      { label: "3d", title: "Nosewheel Steering & Emergency Extension Systems" },
    ],
  },
  {
    number: 4,
    title: "Aircraft Wheels",
    page: "111",
    children: [
      { label: "4a", title: "Loose Flange and Detachable Flange Wheels" },
      { label: "4b", title: "Divided (Split-Hub) Wheels & Overpressure Fusible Plugs" },
      { label: "4c", title: "Wheel Bearings, Thermal Inspection & Maintenance Checks" },
    ],
  },
  {
    number: 5,
    title: "Aircraft Tyres",
    page: "117",
    children: [
      { label: "5a", title: "Radial vs Bias-Ply (Cross-Ply) Aircraft Tyres" },
      { label: "5b", title: "Bead Structure, Carcass Plies, Tread & Chined Tyres" },
      { label: "5c", title: "Tyre Inflation, Hydroplaning Types (Dynamic, Reverted Rubber, Viscous)" },
    ],
  },
  {
    number: 6,
    title: "Aircraft Brakes",
    page: "127",
    children: [
      { label: "6a", title: "Single and Multiple Disc (Plate) Steel Brakes" },
      { label: "6b", title: "Carbon-Carbon Heat Sink Discs & Wear Indicators" },
      { label: "6c", title: "Anti-Skid Control, Modulating Valves & Automatic Braking" },
    ],
  },
  {
    number: 7,
    title: "Flight Control Systems",
    page: "149",
    children: [
      { label: "7a", title: "Mechanical Control Cables, Pulleys & Tension Regulators" },
      { label: "7b", title: "Turnbuckle Safety Wiring & Duplicate Inspection Protocols" },
      { label: "7c", title: "Gust Locks, Friction Checks & Take-off Configuration Warnings" },
    ],
  },
  {
    number: 8,
    title: "Flight Controls",
    page: "165",
    children: [
      { label: "8a", title: "Primary Aerodynamic Flight Surfaces (Ailerons, Elevator, Rudder)" },
      { label: "8b", title: "Aerodynamic Balance: Inset Hinges, Horn Balance & Balance Tabs" },
      { label: "8c", title: "Secondary Controls: Trim Tabs, Servo Tabs & Spring Tabs" },
    ],
  },
  {
    number: 9,
    title: "Powered Flying Controls",
    page: "183",
    children: [
      { label: "9a", title: "Power-Assisted vs Fully Powered Flying Control Units (PFCUs)" },
      { label: "9b", title: "Hydraulic Actuators, Servovalves & Mechanical Feedback" },
      { label: "9c", title: "Artificial Feel Units (q-Feel) & Control Stick Pushers" },
    ],
  },
  {
    number: 10,
    title: "Aircraft Pneumatic Systems",
    page: "199",
    children: [
      { label: "10a", title: "Engine Compressor Bleed Air & APU High-Pressure Pneumatics" },
      { label: "10b", title: "Pre-Coolers, Pressure Regulating & Shut-Off Valves (PRSOVs)" },
      { label: "10c", title: "Cross-Bleed Ducting, Air Cycle Machines (Packs) & Distribution" },
    ],
  },
  {
    number: 11,
    title: "Pressurization Systems",
    page: "217",
    children: [
      { label: "11a", title: "Cabin Altitude, Cabin Rate of Climb & Differential Pressure (ΔP)" },
      { label: "11b", title: "Outflow Valves, Safety Relief Valves & Negative Pressure Relief" },
      { label: "11c", title: "Automatic Digital Controllers & Rapid Decompression Procedures" },
    ],
  },
  {
    number: 12,
    title: "Ice and Rain Protection",
    page: "235",
    children: [
      { label: "12a", title: "Structural Icing: Rime, Clear (Glaze) & Mixed Ice Hazards" },
      { label: "12b", title: "Thermal Anti-Icing (Hot Bleed Air Slats & Engine Cowls)" },
      { label: "12c", title: "Pneumatic De-Icing Boots & Electrical Windscreen Anti-Icing" },
    ],
  },
  {
    number: 13,
    title: "Aircraft Oxygen Equipment",
    page: "259",
    children: [
      { label: "13a", title: "Physiological Hypoxia, Cabin Altitude & Time of Useful Consciousness" },
      { label: "13b", title: "Flight Crew Demand Regulators & Diluter-Demand Quick-Don Masks" },
      { label: "13c", title: "Passenger Continuous-Flow Mask Deployment & Chemical Oxygen Generators" },
    ],
  },
  {
    number: 14,
    title: "Smoke Detection",
    page: "281",
    children: [
      { label: "14a", title: "Avionics, Cargo Hold & Toilet Smoke Detector Locations" },
      { label: "14b", title: "Optical Light Refraction & Light Scattering Photoelectric Detectors" },
      { label: "14c", title: "Ionization Chamber Detectors & False Alarm Protection" },
    ],
  },
  {
    number: 15,
    title: "Fire Detection and Protection",
    page: "289",
    children: [
      { label: "15a", title: "Engine & APU Fire Zones: The Fire Triangle & Classification" },
      { label: "15b", title: "Continuous Fire Loops (Fenwal Resistance & Kidde Capacitance)" },
      { label: "15c", title: "Dual-Loop AND Logic, Fire Extinguisher Squibs & Halon Agents" },
    ],
  },
  {
    number: 16,
    title: "Aircraft Fuel Systems",
    page: "309",
    children: [
      { label: "16a", title: "Aviation Gasoline (AVGAS) vs Turbine Fuels (JET A-1 / JP-4)" },
      { label: "16b", title: "Integral Wing Tanks, Surge Tanks, Baffles & Flapper Valves" },
      { label: "16c", title: "Cross-Feed Valves, Fuel Jettison (Dumping) & Refuel/Defuel Panels" },
    ],
  },
];

export const airframesChapters: LearningChapter[] = AIRFRAMES_CATALOGUE.map((item) => {
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

export function airframesChapterById(id: string): LearningChapter | undefined {
  return airframesChapters.find((c) => c.id === id);
}
