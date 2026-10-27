import chapter01Raw from "@/content/learning/electrics/chapter-01.md?raw";
import chapter02Raw from "@/content/learning/electrics/chapter-02.md?raw";
import chapter03Raw from "@/content/learning/electrics/chapter-03.md?raw";
import chapter04Raw from "@/content/learning/electrics/chapter-04.md?raw";
import chapter05Raw from "@/content/learning/electrics/chapter-05.md?raw";
import chapter06Raw from "@/content/learning/electrics/chapter-06.md?raw";
import chapter07Raw from "@/content/learning/electrics/chapter-07.md?raw";
import chapter08Raw from "@/content/learning/electrics/chapter-08.md?raw";
import chapter09Raw from "@/content/learning/electrics/chapter-09.md?raw";
import chapter10Raw from "@/content/learning/electrics/chapter-10.md?raw";
import chapter11Raw from "@/content/learning/electrics/chapter-11.md?raw";
import chapter12Raw from "@/content/learning/electrics/chapter-12.md?raw";
import chapter13Raw from "@/content/learning/electrics/chapter-13.md?raw";
import chapter14Raw from "@/content/learning/electrics/chapter-14.md?raw";
import chapter15Raw from "@/content/learning/electrics/chapter-15.md?raw";
import chapter16Raw from "@/content/learning/electrics/chapter-16.md?raw";
import chapter17Raw from "@/content/learning/electrics/chapter-17.md?raw";
import { parseLearningSource, type LearningSection } from "@/lib/learning-source";
import type { LearningChapter, LearningChapterChild } from "@/lib/learning-content";

export const electricsCourseTitle = "CAE ATPL 3: Electrics & Electronics";
export const electricsCourseSubtitle =
  "EASA / UK ATPL Theoretical Knowledge · Aircraft General Knowledge";

export const electricsBookExtras = [
  { title: "Table of Contents" },
  { title: "Abbreviations & Electrical Symbols" },
  { title: "Formulas & Unit Conversions" },
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
};

export const ELECTRICS_CATALOGUE: Array<{
  number: number;
  title: string;
  page: string;
  children?: LearningChapterChild[];
}> = [
  {
    number: 1,
    title: "DC Electrics: Basic Principles",
    page: "1",
    children: [
      { label: "1a", title: "Matter, Atoms, Charge Carriers & Free Electron Drift" },
      { label: "1b", title: "Potential Difference, EMF, Voltage & Hydraulic Analogy" },
      { label: "1c", title: "Ohm's Law, Resistance, Power Dissipation & Heating" },
      { label: "1d", title: "Series, Parallel, Series-Parallel Networks & Kirchhoff's Laws" },
    ],
  },
  {
    number: 2,
    title: "DC Electrics: Switches",
    page: "27",
    children: [
      { label: "2a", title: "Manual Toggle, Pushbutton & Guarded Switch-Lights" },
      { label: "2b", title: "Snap-Action Microswitches & Over-Centre Springs" },
      { label: "2c", title: "Proximity Sensors, Magnetic Pickups & Bimetallic Switches" },
    ],
  },
  {
    number: 3,
    title: "DC Electrics: Circuit Protection and Capacitors",
    page: "35",
    children: [
      { label: "3a", title: "Fuses, Current Limiters & Push-Pull Circuit Breakers" },
      { label: "3b", title: "Bimetallic Thermal Overcurrent Elements & Trip Curves" },
      { label: "3c", title: "Capacitance, Dielectrics, RC Time Constants & Reactance" },
    ],
  },
  {
    number: 4,
    title: "DC Electrics: Batteries",
    page: "51",
    children: [
      { label: "4a", title: "Primary Cells, Local Action, Polarization & Depolarizers" },
      { label: "4b", title: "Lead-Acid Secondary Cells, Specific Gravity & Free vs AGM Construction" },
      { label: "4c", title: "Nickel-Cadmium (NiCad) Batteries, Thermal Runaway & Temperature Sensing" },
    ],
  },
  {
    number: 5,
    title: "DC Electrics: Magnetism",
    page: "69",
    children: [
      { label: "5a", title: "Magnetic Flux Lines, Poles, Attraction, Repulsion & Field Shielding" },
      { label: "5b", title: "Electromagnetism, Right-Hand Conductor Rule & Solenoid Force" },
      { label: "5c", title: "Hysteresis B-H Loops, Retentivity, Permeability & Relay Contactor Operation" },
    ],
  },
  {
    number: 6,
    title: "DC Electrics: Generators and Alternators",
    page: "81",
    children: [
      { label: "6a", title: "Electromagnetic Induction, Lenz's Law & Fleming's Right-Hand Rule" },
      { label: "6b", title: "Commutation, Split-Rings, Multi-Coil Armatures & Ripple Reduction" },
      { label: "6c", title: "Series, Shunt & Compound DC Generators; Carbon Pile & Vibrating Regulators" },
      { label: "6d", title: "Complete DC Generating System, Reverse Current Cutout & Paralleled Equalizing Bus" },
    ],
  },
  {
    number: 7,
    title: "DC Electrics: DC Motors",
    page: "103",
    children: [
      { label: "7a", title: "Force on Conductors, Fleming's Left-Hand Rule & Turning Couple" },
      { label: "7b", title: "Back-EMF Regulation & Series, Shunt, Compound Motor Characteristics" },
      { label: "7c", title: "Split-Field Reversible Motors, Starter-Generators & Linear/Rotary Actuators" },
    ],
  },
  {
    number: 8,
    title: "DC Electrics: Aircraft Electrical Power Systems",
    page: "119",
    children: [
      { label: "8a", title: "Single-Engine Light Aircraft vs Twin-Engine Split-Bus Distribution" },
      { label: "8b", title: "Bus Hierarchy: Hot Battery, Essential, Main & Sheddable Utility Buses" },
      { label: "8c", title: "External Ground Power (GPU), Static Inverters & Ram Air Turbine (RAT)" },
      { label: "8d", title: "Generator Control Units (GCU), Overvoltage, Undervoltage & Differential Feeder Protection" },
    ],
  },
  {
    number: 9,
    title: "DC Electrics: Bonding and Screening",
    page: "143",
    children: [
      { label: "9a", title: "Electrostatic Charge Accumulation & P-Static Dissipation" },
      { label: "9b", title: "Low-Resistance Airframe Bonding Jumpers & Lightning Strike Currents" },
      { label: "9c", title: "Coaxial Screening Braids & Radio Frequency Interference (RFI) Suppression" },
    ],
  },
  {
    number: 10,
    title: "DC Electrics: Specimen Questions",
    page: "149",
    children: [
      { label: "10a", title: "EASA Part-FCL Specimen Examination Questions" },
      { label: "10b", title: "Comprehensive Worked Explanations & Numerical Solutions" },
    ],
  },
  {
    number: 11,
    title: "AC Electrics: Introduction to AC",
    page: "159",
    children: [
      { label: "11a", title: "Rotating Phasors, Frequency, Period, Peak & RMS (0.707 Vpk) Values" },
      { label: "11b", title: "AC Resistive, Inductive & Capacitive Phase Angles (CIVIL Mnemonic)" },
      { label: "11c", title: "Impedance Triangles, RLC Resonance & True vs Reactive vs Apparent Power (kVA)" },
      { label: "11d", title: "Three-Phase AC: Star (115V/200V) vs Delta Systems & Neutral Cancellation" },
    ],
  },
  {
    number: 12,
    title: "AC Electrics: Alternators",
    page: "185",
    children: [
      { label: "12a", title: "Brushless Three-Stage AC Alternators: PMG, Exciter & Rotating Diodes" },
      { label: "12b", title: "Constant Speed Drive (CSD) & Integrated Drive Generator (IDG) Oil Cooling" },
      { label: "12c", title: "AC GCU Voltage Regulation, 400 Hz Frequency Governing & Protective Tripping" },
      { label: "12d", title: "Paralleling Four Conditions, Real Power (kW) & Reactive Power (kVAR) Sharing" },
    ],
  },
  {
    number: 13,
    title: "AC Electrics: Practical Aircraft Systems",
    page: "219",
    children: [
      { label: "13a", title: "Twin-Jet Split-Bus Architecture, APU Generator Integration & GPU Receptacles" },
      { label: "13b", title: "Transformer Rectifier Units (TRU) & Static Inverter Standby Conversion" },
      { label: "13c", title: "Flight Deck Overhead Electrical Panel & Automatic Load Shedding Schemes" },
    ],
  },
  {
    number: 14,
    title: "AC Electrics: Transformers",
    page: "229",
    children: [
      { label: "14a", title: "Mutual Induction, Primary/Secondary Turns Ratios & Power Conservation" },
      { label: "14b", title: "Laminated Silicon Steel Cores, Eddy Currents & Hysteresis Losses" },
      { label: "14c", title: "Autotransformers, Three-Phase Delta-Star & Current Transformers (CT)" },
    ],
  },
  {
    number: 15,
    title: "AC Electrics: AC Motors",
    page: "239",
    children: [
      { label: "15a", title: "Three-Phase Stator Windings & Rotating Magnetic Field (RMF) Synchronous Speed" },
      { label: "15b", title: "Squirrel-Cage Induction Motor Rotor Bars, Torque Generation & Slip Speed" },
    ],
  },
  {
    number: 16,
    title: "AC Electrics: Semiconductors",
    page: "249",
    children: [
      { label: "16a", title: "Intrinsic Silicon, N-Type & P-Type Doping (Donors vs Acceptors)" },
      { label: "16b", title: "PN Junction Depletion Layer, Barrier Potential (0.7V Si) & Biasing Modes" },
      { label: "16c", title: "Diode Characteristics, Half-Wave/Full-Wave Bridge Rectifiers & Zener Regulators" },
      { label: "16d", title: "Bipolar Junction Transistors (BJT): Base Control Current & Switching/Amplification" },
    ],
  },
  {
    number: 17,
    title: "AC Electrics: Logic Gates",
    page: "261",
    children: [
      { label: "17a", title: "AND & OR Gates: Logic Symbols, Switching Circuits & Truth Tables" },
      { label: "17b", title: "NOT (Inverter), NAND & NOR Gates: Relay Circuitry & Truth Tables" },
      { label: "17c", title: "Exclusive OR (XOR) Gate & Avionics Digital Switching Applications" },
    ],
  },
];

export const electricsChapters: LearningChapter[] = ELECTRICS_CATALOGUE.map((item) => {
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

export function electricsChapterById(id: string): LearningChapter | undefined {
  return electricsChapters.find((c) => c.id === id);
}
