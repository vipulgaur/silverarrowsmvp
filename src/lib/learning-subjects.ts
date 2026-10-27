import { learningChapters, type LearningChapter } from "./learning-content";

export interface TheorySubjectModule {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  description: string;
  iconName:
    | "Wrench"
    | "Wind"
    | "Plane"
    | "Compass"
    | "Scale"
    | "ShieldAlert"
    | "Radio"
    | "Activity"
    | "BookOpen";
  chapterIds: string[];
  keyTopics: string[];
}

export const THEORY_SUBJECT_MODULES: TheorySubjectModule[] = [
  {
    id: "s-agk",
    code: "AGK",
    name: "Aircraft General Knowledge",
    subtitle: "Airframe, Engine & System Mechanics",
    description:
      "In-depth study of light aircraft systems: fuselage construction, piston engines, carburettor systems, electrical circuits, ignition, and pitot-static instruments.",
    iconName: "Wrench",
    chapterIds: ["chapter-01", "chapter-02"],
    keyTopics: [
      "Fuselage, wings, empennage & undercarriage",
      "Four-stroke piston engine cycle & ignition",
      "Fuel sampling, fuel grades & contamination",
      "Carburettor heat & icing prevention",
      "Engine starting, warm-up & magneto dead cut checks",
      "Pitot-static system & flight instruments",
    ],
  },
  {
    id: "s-pof",
    code: "POF",
    name: "Principles of Flight",
    subtitle: "Aerodynamics & Flight Dynamics",
    description:
      "The physics of flight: aerodynamic forces, Bernoulli's principle, lift generation, drag profiles, stall mechanics, stability, and flight control surfaces.",
    iconName: "Wind",
    chapterIds: ["chapter-04", "chapter-06", "chapter-09", "chapter-10", "chapter-11"],
    keyTopics: [
      "Primary & secondary effects of elevator, rudder & ailerons",
      "Slipstream, torque effect & asymmetric blade effect",
      "The art and physics of elevator trimming",
      "Lift/drag polar & angle of attack boundaries",
      "Slow flying, stall inception & spin recovery aerodynamics",
      "Flap deployment effects on lift, drag & pitch attitude",
    ],
  },
  {
    id: "s-flt",
    code: "FLT",
    name: "Flying Training & Air Experience",
    subtitle: "Cockpit Drills & Flying Exercises",
    description:
      "Core airborne handling syllabus: pre-flight walkaround, engine ground runs, lookout scan, straight-and-level attitudes, climbing, descending, and circuit patterns.",
    iconName: "Plane",
    chapterIds: [
      "chapter-03",
      "chapter-05",
      "chapter-07",
      "chapter-08",
      "chapter-12",
      "chapter-13",
      "chapter-14",
      "chapter-15",
    ],
    keyTopics: [
      "Cockpit scan discipline & airmanship lookout rules",
      "Climbing and descending horizon references",
      "Taxiing techniques and wind correction on ground",
      "Standard take-off roll, rotation & climbing turn",
      "The aerodrome traffic circuit: downwind, base & final",
      "Flapless, glide & short-field approach techniques",
    ],
  },
  {
    id: "s-met",
    code: "MET",
    name: "Meteorology",
    subtitle: "Atmospheric Physics & Weather Briefings",
    description:
      "Understand the weather environment: atmospheric stability, pressure systems, cold/warm fronts, wind shear, cloud classification, and METAR/TAF decoding.",
    iconName: "Wind",
    chapterIds: [],
    keyTopics: [
      "Atmospheric composition, standard atmosphere (ISA) & lapse rates",
      "Pressure gradients, geostrophic wind & sea breeze effects",
      "Air masses, fronts, squall lines & thunderstorm life cycle",
      "Structural & carburettor icing categories & hazards",
      "METAR, TAF, SIGMET & synoptic chart interpretation",
      "Altimetry: QNH, QFE, standard pressure setting (1013.25 hPa)",
    ],
  },
  {
    id: "s-alw",
    code: "ALW",
    name: "Air Law",
    subtitle: "Aviation Regulations & Rules of the Air",
    description:
      "International and domestic aviation legal frameworks: ICAO Annexes, visual flight rules (VFR), airspace classifications A through G, licensing privileges, and right-of-way rules.",
    iconName: "Scale",
    chapterIds: [],
    keyTopics: [
      "ICAO conventions & national civil aviation regulatory authorities",
      "Rules of the Air: collision avoidance, converging & overtaking",
      "Airspace classifications (Class A to G) & entry requirements",
      "VMC minima: visibility & distance from cloud requirements",
      "Pilot licences (PPL, CPL), medical validity & logbook laws",
      "Aerodrome signals, runway markings & light gun communications",
    ],
  },
  {
    id: "s-ops",
    code: "OPS",
    name: "Operational Procedures",
    subtitle: "Standard & Emergency Flight Operations",
    description:
      "Operational best practices and emergency responses: forced landing without power, precautionary searches, ditching, wake turbulence, and search and rescue procedures.",
    iconName: "ShieldAlert",
    chapterIds: ["chapter-16", "chapter-17"],
    keyTopics: [
      "Engine failure during take-off and climb-out drills",
      "Forced landing without power (FLWOP) field selection & gliding",
      "Precautionary search and off-field landing techniques",
      "Ditching in water protocols & passenger evacuation",
      "Wake turbulence separation & bird strike avoidance",
      "Search and rescue (SAR) alerting phases (INCERFA, ALERFA, DETRESFA)",
    ],
  },
  {
    id: "s-nav",
    code: "NAV",
    name: "Navigation & Flight Planning",
    subtitle: "Dead Reckoning, Charts & Radio Aids",
    description:
      "Navigation theory: map projections, true vs. magnetic courses, 1-in-60 rule, flight computers, wind triangles, and radionavigation equipment (VOR, ADF, GPS).",
    iconName: "Compass",
    chapterIds: ["chapter-18", "chapter-19"],
    keyTopics: [
      "Latitude, longitude, great circles & rhumb lines",
      "Aeronautical 1:500,000 VFR topographical charts",
      "Magnetic variation, compass deviation & wind correction angles",
      "Dead reckoning calculations & groundspeed estimation",
      "1-in-60 rule application for off-track corrections",
      "Basic instrument scan & radionavigation beacon tracking",
    ],
  },
  {
    id: "s-hpl",
    code: "HPL",
    name: "Human Performance & Limitations",
    subtitle: "Aero-Medical Physiology & Pilot Psychology",
    description:
      "Human factors in aviation: hypoxia, hyperventilation, vestibular illusions, spatial disorientation, fatigue management, and Threat & Error Management (TEM).",
    iconName: "Activity",
    chapterIds: [],
    keyTopics: [
      "Atmospheric pressure effects: hypoxia stages & time of useful consciousness",
      "Ear clearing (valsalva), sinus barotrauma & decompression sickness",
      "The vestibular system: semicircular canals & the leans illusion",
      "Night vision, rod/cone adaptation & empty field myopia",
      "Fatigue, sleep architecture & stress management",
      "Aeronautical decision making (ADM) & situational awareness",
    ],
  },
  {
    id: "s-com",
    code: "COM",
    name: "Communications",
    subtitle: "VFR Radiotelephony & Standard Phraseology",
    description:
      "Radio communication protocols: phonetic alphabet, standard words and phrases, readback obligations, transponder operation, and emergency distress calls.",
    iconName: "Radio",
    chapterIds: [],
    keyTopics: [
      "VHF propagation, frequency allocation & radio equipment checks",
      "ICAO standard phonetic alphabet & numerical transmission",
      "Standard aerodrome circuit calls (downwind, base, final)",
      "ATC clearances requiring mandatory full readbacks",
      "Transponder codes: 7000/1200 (VFR), 7500, 7600, 7700 (Emergencies)",
      "Distress (MAYDAY) and Urgency (PAN PAN) transmission format",
    ],
  },
];

export function getSubjectChapters(subject: TheorySubjectModule): LearningChapter[] {
  if (subject.chapterIds.length === 0) return [];
  return subject.chapterIds
    .map((id) => learningChapters.find((c) => c.id === id))
    .filter((c): c is LearningChapter => Boolean(c));
}
