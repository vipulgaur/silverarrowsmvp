import chapter01Raw from "@/content/learning/powerplant/chapter-01.md?raw";
import chapter02Raw from "@/content/learning/powerplant/chapter-02.md?raw";
import chapter03Raw from "@/content/learning/powerplant/chapter-03.md?raw";
import chapter04Raw from "@/content/learning/powerplant/chapter-04.md?raw";
import chapter05Raw from "@/content/learning/powerplant/chapter-05.md?raw";
import chapter06Raw from "@/content/learning/powerplant/chapter-06.md?raw";
import chapter07Raw from "@/content/learning/powerplant/chapter-07.md?raw";
import chapter08Raw from "@/content/learning/powerplant/chapter-08.md?raw";
import chapter09Raw from "@/content/learning/powerplant/chapter-09.md?raw";
import chapter10Raw from "@/content/learning/powerplant/chapter-10.md?raw";
import chapter11Raw from "@/content/learning/powerplant/chapter-11.md?raw";
import chapter12Raw from "@/content/learning/powerplant/chapter-12.md?raw";
import chapter13Raw from "@/content/learning/powerplant/chapter-13.md?raw";
import chapter14Raw from "@/content/learning/powerplant/chapter-14.md?raw";
import chapter15Raw from "@/content/learning/powerplant/chapter-15.md?raw";
import chapter16Raw from "@/content/learning/powerplant/chapter-16.md?raw";
import chapter17Raw from "@/content/learning/powerplant/chapter-17.md?raw";
import chapter18Raw from "@/content/learning/powerplant/chapter-18.md?raw";
import chapter19Raw from "@/content/learning/powerplant/chapter-19.md?raw";
import chapter20Raw from "@/content/learning/powerplant/chapter-20.md?raw";
import chapter21Raw from "@/content/learning/powerplant/chapter-21.md?raw";
import chapter22Raw from "@/content/learning/powerplant/chapter-22.md?raw";
import chapter23Raw from "@/content/learning/powerplant/chapter-23.md?raw";
import chapter24Raw from "@/content/learning/powerplant/chapter-24.md?raw";
import chapter25Raw from "@/content/learning/powerplant/chapter-25.md?raw";
import chapter26Raw from "@/content/learning/powerplant/chapter-26.md?raw";
import chapter27Raw from "@/content/learning/powerplant/chapter-27.md?raw";
import chapter28Raw from "@/content/learning/powerplant/chapter-28.md?raw";
import { parseLearningSource, type LearningSection } from "@/lib/learning-source";
import type { LearningChapter, LearningChapterChild } from "@/lib/learning-content";

export const powerplantCourseTitle = "CAE ATPL 4: Powerplant";
export const powerplantCourseSubtitle =
  "EASA / UK ATPL Theoretical Knowledge · Aircraft General Knowledge";

export const powerplantBookExtras = [
  { title: "Table of Contents" },
  { title: "Abbreviations & Symbols" },
  { title: "Brayton & Otto Cycle Thermodynamics" },
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

export const POWERPLANT_CATALOGUE: Array<{
  number: number;
  title: string;
  page: string;
  children?: LearningChapterChild[];
}> = [
  {
    number: 1,
    title: "Piston Engines: Introduction",
    page: "1",
    children: [
      { label: "1a", title: "Heat Engine Principles & Energy Conversion" },
      { label: "1b", title: "Four-Stroke Operating Cycle Fundamentals" },
      { label: "1c", title: "Bernoulli Convergent Duct & Venturi Dynamics" },
    ],
  },
  {
    number: 2,
    title: "Piston Engines: General",
    page: "11",
    children: [
      { label: "2a", title: "Engine Configurations: Horizontally Opposed, Radial, In-Line" },
      { label: "2b", title: "Cylinder Barrel, Piston Head, Rings & Gudgeon Pins" },
      { label: "2c", title: "Crankshaft Journals, Counterweights & Connecting Rods" },
      { label: "2d", title: "Camshaft, Pushrods, Rocker Arms & Valve Timing Spiral" },
    ],
  },
  {
    number: 3,
    title: "Piston Engines: Lubrication",
    page: "41",
    children: [
      { label: "3a", title: "Functions of Engine Oil: Cooling, Sealing, Cleaning & Cushioning" },
      { label: "3b", title: "Wet Sump vs Dry Sump System Architecture" },
      { label: "3c", title: "Pressure Relief Valves, Full-Flow Filters & Thermostatic Coolers" },
    ],
  },
  {
    number: 4,
    title: "Piston Engines: Cooling",
    page: "55",
    children: [
      { label: "4a", title: "Air Cooling Dynamics, Cylinder Fins & Pressure Baffles" },
      { label: "4b", title: "Cowl Flap Modulation & Cylinder Head Temperature (CHT) Monitoring" },
    ],
  },
  {
    number: 5,
    title: "Piston Engines: Ignition",
    page: "65",
    children: [
      { label: "5a", title: "High-Tension Dual Magneto Principles & Rotating Magnets" },
      { label: "5b", title: "Contact Breaker Points, Capacitor Shunting & Cam Operation" },
      { label: "5c", title: "Spark Plug Heat Ranges, Fouling & Ignition Harness Shielding" },
    ],
  },
  {
    number: 6,
    title: "Piston Engines: Fuel",
    page: "75",
    children: [
      { label: "6a", title: "Aviation Gasoline (AVGAS) Grades 100LL & Octane Ratings" },
      { label: "6b", title: "Vapour Lock, Volatility & Fuel Tank Venting" },
      { label: "6c", title: "Abnormal Combustion: Detonation vs Surface Pre-Ignition" },
    ],
  },
  {
    number: 7,
    title: "Piston Engines: Mixture",
    page: "91",
    children: [
      { label: "7a", title: "Chemically Correct Stoichiometric Fuel/Air Ratio (15:1)" },
      { label: "7b", title: "Best Power vs Best Economy Mixtures & EGT Leaning Curves" },
    ],
  },
  {
    number: 8,
    title: "Piston Engines: Carburettors",
    page: "101",
    children: [
      { label: "8a", title: "Float-Chamber Carburettor Venturi & Main Metering Jet" },
      { label: "8b", title: "Diffuser Wells, Air Bleeds & Idling Systems" },
      { label: "8c", title: "Power Enrichment (Economiser) & Accelerator Pump Plungers" },
      { label: "8d", title: "Manual & Back-Suction Mixture Controls & Altitude Capsules" },
    ],
  },
  {
    number: 9,
    title: "Piston Engines: Icing",
    page: "115",
    children: [
      { label: "9a", title: "Impact Ice, Fuel Evaporation Ice & Throttle Ice Formation" },
      { label: "9b", title: "Carburettor Heat Air Doors, CAT Gauges & Engine Leaning During Heat" },
    ],
  },
  {
    number: 10,
    title: "Piston Engines: Fuel Injection",
    page: "123",
    children: [
      { label: "10a", title: "RSA Continuous-Flow Indirect Multi-Point Fuel Injection" },
      { label: "10b", title: "Impact Tubes, Air Diaphragm & Fuel Metering Servo Valve" },
      { label: "10c", title: "Fuel Flow Divider (Spider) & Cylinder Discharge Nozzles" },
    ],
  },
  {
    number: 11,
    title: "Piston Engines: Performance and Power Augmentation",
    page: "133",
    children: [
      { label: "11a", title: "Indicated, Brake, and Friction Horsepower (BHP = IHP - FHP)" },
      { label: "11b", title: "Engine Superchargers vs Exhaust-Gas Driven Turbochargers" },
      { label: "11c", title: "Wastegate Controllers: Density, Differential & Absolute Pressure" },
      { label: "11d", title: "Critical Altitude, Full-Throttle Height & Turbo-Normalized Systems" },
    ],
  },
  {
    number: 12,
    title: "Piston Engines: Propellers",
    page: "161",
    children: [
      { label: "12a", title: "Blade Aerodynamics: Helix Angle, Chord, Geometric vs Effective Pitch" },
      { label: "12b", title: "Aerodynamic Twisting Moment (ATM) vs Centrifugal Twisting Moment (CTM)" },
      { label: "12c", title: "P-Factor (Asymmetric Blade Effect), Torque Reaction & Gyro Precession" },
      { label: "12d", title: "Constant-Speed Unit (CSU) Flyweights, Pilot Valve & Oil Flow" },
      { label: "12e", title: "Feathering Propellers, Counterweights, Unfeathering Accumulators & Beta Range" },
    ],
  },
  {
    number: 13,
    title: "Gas Turbines: Introduction",
    page: "197",
    children: [
      { label: "13a", title: "Historical Evolution: Sir Frank Whittle & Hans von Ohain" },
      { label: "13b", title: "The Continuous Brayton Thermodynamic Cycle (Constant-Pressure Heat Addition)" },
      { label: "13c", title: "Engine Configurations: Turbojet, Turbofan, Turboprop, and Turboshaft" },
      { label: "13d", title: "Twin-Spool (N1/N2) & Triple-Spool (N1/N2/N3) Modular Architectures" },
    ],
  },
  {
    number: 14,
    title: "Gas Turbines: Air Inlets",
    page: "217",
    children: [
      { label: "14a", title: "Subsonic Pitot Intake Divergent Duct & Ram Pressure Recovery" },
      { label: "14b", title: "Boundary Layer Splitters & Supersonic Compression Ramps" },
    ],
  },
  {
    number: 15,
    title: "Gas Turbines: Compressors",
    page: "225",
    children: [
      { label: "15a", title: "Centrifugal Impeller & Radial Diffuser Vane Compression" },
      { label: "15b", title: "Axial Compressor Multi-Stage Rotor Blades & Stator Vanes" },
      { label: "15c", title: "Aerodynamic Blade Stall, Compressor Surge & Pressure Ratios" },
      { label: "15d", title: "Surge Protection: Variable Stator Vanes (VSV) & Transient Bleed Valves" },
    ],
  },
  {
    number: 16,
    title: "Gas Turbines: Combustion Chambers",
    page: "245",
    children: [
      { label: "16a", title: "Airflow Distribution: 20% Primary vs 80% Dilution / Cooling Air" },
      { label: "16b", title: "Combustor Layouts: Multiple Can, Tubo-Annular, and Full Annular Liners" },
      { label: "16c", title: "Pressure-Atomizing vs Airspray Nozzles & Vaporizing Tubes" },
      { label: "16d", title: "Thermal Barrier Coatings, Effusion Cooling & Low-NOx Combustor Staging" },
    ],
  },
  {
    number: 17,
    title: "Gas Turbines: The Turbine Assembly",
    page: "263",
    children: [
      { label: "17a", title: "Nozzle Guide Vane (NGV) Acceleration & Deflection" },
      { label: "17b", title: "Impulse vs Reaction Turbine Blade Aerodynamic Theory" },
      { label: "17c", title: "Internal Convective & Film Cooling Passages for Turbine Blades" },
      { label: "17d", title: "Thermal Creep, Centrifugal Stresses & Fir-Tree Root Attachments" },
    ],
  },
  {
    number: 18,
    title: "Gas Turbines: The Exhaust System",
    page: "277",
    children: [
      { label: "18a", title: "Convergent Propelling Nozzle Dynamics & Choked Flow Criteria" },
      { label: "18b", title: "Turbofan Exhaust Mixers, Acoustic Linings & Chevron Nozzles" },
      { label: "18c", title: "Afterburner (Reheat) Diffusers, Fuel Manifolds & Flameholders" },
    ],
  },
  {
    number: 19,
    title: "Gas Turbines: Lubrication",
    page: "291",
    children: [
      { label: "19a", title: "Synthetic Lubricants (MIL-PRF-23699) & High-Temperature Viscosity" },
      { label: "19b", title: "Dry Sump Pressure Relief & Scavenge Oil Return Circuits" },
      { label: "19c", title: "Carbon Face & Labyrinth Air-Pressurised Bearing Seals" },
      { label: "19d", title: "Magnetic Chip Detectors (MCD) & Fuel-Cooled Oil Coolers (FCOC)" },
    ],
  },
  {
    number: 20,
    title: "Gas Turbines: Thrust",
    page: "307",
    children: [
      { label: "20a", title: "Momentum Thrust, Pressure Thrust & Net Thrust Equation" },
      { label: "20b", title: "Primary Thrust Parameters: N1 Fan Speed vs Engine Pressure Ratio (EPR)" },
      { label: "20c", title: "Atmospheric Influences: Altitude, Ambient Temperature & Ram Air Ratio" },
      { label: "20d", title: "Flat-Rated Engine Limits & Specific Fuel Consumption (SFC)" },
    ],
  },
  {
    number: 21,
    title: "Gas Turbines: Reverse Thrust",
    page: "325",
    children: [
      { label: "21a", title: "Hot-Stream Clamshell Deflectors & Target Bucket Reversers" },
      { label: "21b", title: "Cold-Stream Pivoting Blocker Doors & Aerodynamic Cascade Vanes" },
      { label: "21c", title: "Safety Interlocks: Weight-on-Wheels & Throttle Idle Detent" },
    ],
  },
  {
    number: 22,
    title: "Gas Turbines: Gearboxes and Accessory Drives",
    page: "333",
    children: [
      { label: "22a", title: "Internal Radial Drive Shaft, Bevel Gears & Tower Shafts" },
      { label: "22b", title: "External Accessory Gearbox (AGB) Mounting Pads & Drive Ratios" },
    ],
  },
  {
    number: 23,
    title: "Gas Turbines: Ignition Systems",
    page: "341",
    children: [
      { label: "23a", title: "Dual High-Energy Ignition Units (HEIU) & Storage Capacitors" },
      { label: "23b", title: "Surface-Discharge Igniter Plugs & Auto-Relight Selection" },
    ],
  },
  {
    number: 24,
    title: "Gas Turbines: Auxiliary Power Units and Engine Starting",
    page: "349",
    children: [
      { label: "24a", title: "APU Single-Shaft Gas Turbines & Load Compressor Pneumatics" },
      { label: "24b", title: "Pneumatic Air Turbine Starters (ATS) & Electric Starter-Generators" },
      { label: "24c", title: "Starting Sequences: Dry Motoring, Wet Motoring & Start Cycles" },
      { label: "24d", title: "Abnormal Starts: Hot Start, Hung Start & Wet Start Recovery" },
    ],
  },
  {
    number: 25,
    title: "Gas Turbines: Fuels",
    page: "365",
    children: [
      { label: "25a", title: "Aviation Turbine Kerosene: Jet A, Jet A-1 & Wide-Cut Jet B" },
      { label: "25b", title: "Fuel Specifications: Flash Point, Freezing Point & Anti-Icing Additives" },
    ],
  },
  {
    number: 26,
    title: "Gas Turbines: Fuel Systems",
    page: "373",
    children: [
      { label: "26a", title: "Engine-Driven High-Pressure Fuel Pumps & Fuel-Cooled Oil Coolers" },
      { label: "26b", title: "Full Authority Digital Engine Control (FADEC) Dual-Channel Architecture" },
      { label: "26c", title: "Hydro-Mechanical Metering Units (HMU) & Active Clearance Cooling" },
    ],
  },
  {
    number: 27,
    title: "Gas Turbines: Bleed Air",
    page: "389",
    children: [
      { label: "27a", title: "Intermediate-Pressure (IP) vs High-Pressure (HP) Compressor Bleeds" },
      { label: "27b", title: "High-Pressure Bleed Valves (HPV) & Pressure Regulating Shutoff Valves (PRSOV)" },
      { label: "27c", title: "Thermal Anti-Icing & Environmental Control System (ECS) Supplies" },
    ],
  },
  {
    number: 28,
    title: "Revision Questions",
    page: "401",
    children: [
      { label: "28a", title: "EASA Part-FCL Specimen Examination Questions" },
      { label: "28b", title: "Comprehensive Worked Explanations & Numerical Answers" },
    ],
  },
];

export const powerplantChapters: LearningChapter[] = POWERPLANT_CATALOGUE.map((item) => {
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

export function powerplantChapterById(id: string): LearningChapter | undefined {
  return powerplantChapters.find((c) => c.id === id);
}
