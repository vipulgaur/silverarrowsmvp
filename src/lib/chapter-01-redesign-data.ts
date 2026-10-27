import fig0101 from "@/assets/learning/fig-01-01.jpg";
import fig0102 from "@/assets/learning/fig-01-02.jpg";
import fig0103 from "@/assets/learning/fig-01-03.jpg";

/**
 * Administrative / developer feature flag controlling the redesigned
 * "Familiarisation with the Aeroplane" (Pooley Chapter 1) learning experience.
 *
 * Set to `false` to immediately restore the original markdown/block rendering
 * without modifying any chapter data, student progress, or notes.
 */
export const ENABLE_CHAPTER_01_REDESIGN = true;

export function isChapter01RedesignEnabled(
  courseKey: string,
  chapterId: string,
  overrideFlag?: boolean,
): boolean {
  const flag = overrideFlag ?? ENABLE_CHAPTER_01_REDESIGN;
  return Boolean(flag && courseKey === "pooley" && chapterId === "chapter-01");
}

export interface QuickFactItem {
  id: string;
  badge: string;
  statement: string;
  detail: string;
  targetSectionId: string;
  targetLabel: string;
}

export interface GuidedIntroStep {
  step: number;
  id: string;
  tag: string;
  title: string;
  summary: string;
  keyPoints: string[];
  takeaway: string;
  diagramViewId: "airframe-exterior" | "cockpit-panel" | "control-columns";
  highlightComponentId: string;
  targetSectionId: string;
}

export interface InteractiveAircraftComponent {
  id: string;
  number: number;
  x: number;
  y: number;
  name: string;
  category: "Airframe" | "Control Surface" | "Powerplant" | "Undercarriage" | "Instrument" | "Cockpit Control" | "Electrical & Lighting";
  summary: string;
  primaryFunction: string;
  aircraftRelationship: string;
  technicalDetail: string;
  remember: string;
  constituentParts?: string[];
  relatedSectionId: string;
  relatedSectionTitle: string;
}

export interface AircraftDiagramView {
  id: "airframe-exterior" | "cockpit-panel" | "control-columns";
  figureId: string;
  label: string;
  shortLabel: string;
  subtitle: string;
  src: string;
  alt: string;
  caption: string;
  components: InteractiveAircraftComponent[];
}

export interface ControlSurfaceAxisRow {
  surface: string;
  location: string;
  cockpitInput: string;
  axis: string;
  motion: string;
  distinction: string;
}

export interface ComponentDistinctionItem {
  id: string;
  title: string;
  leftName: string;
  leftRole: string;
  rightName: string;
  rightRole: string;
  keyDifference: string;
}

export interface SequentialFlowStep {
  step: number;
  title: string;
  area: string;
  action: string;
}

export interface RedesignedSyllabusSection {
  id: string;
  number: number;
  title: string;
  groupTag: string;
  figureId?: string;
  primaryFunction: string;
  essentialExplanation: string;
  verbatimMarkdown: string;
  keyDistinction?: string;
  keyPoints: string[];
  memoryAid: string;
  takeaway: string;
}

export interface ChapterKnowledgeCheck {
  id: string;
  number: number;
  formatLabel: string;
  sectionRef: string;
  question: string;
  options: Array<{
    id: string;
    label: string;
  }>;
  correctOptionId: string;
  explanation: string;
  misconception: string;
}

/**
 * SECTION 4 — QUICK REVISION ("REMEMBER / KEY FACTS")
 * Extracted directly from the 11 syllabus sections of Chapter 1.
 */
export const CHAPTER_01_KEY_FACTS: QuickFactItem[] = [
  {
    id: "kf-1",
    badge: "Structure",
    statement: "Five structural groups make the training aeroplane: Fuselage, Wings (Mainplanes), Empennage, Undercarriage, and Powerplant.",
    detail: "Fixed wings produce lift when air flows over them in flight.",
    targetSectionId: "section-1",
    targetLabel: "Section 1 · Airframe Structure",
  },
  {
    id: "kf-2",
    badge: "Flight Controls",
    statement: "Ailerons control roll (longitudinal axis). The elevator controls pitch (lateral axis). The rudder controls yaw (normal axis).",
    detail: "Move the control column to bank and pitch. Push the pedals to yaw.",
    targetSectionId: "section-3",
    targetLabel: "Section 3 · Primary Controls",
  },
  {
    id: "kf-3",
    badge: "Basic-T Panel",
    statement: "The Basic-T panel shows the primary flight instruments: ASI, Attitude Indicator, Altimeter, and Heading Indicator.",
    detail: "The Turn Coordinator and Vertical Speed Indicator complete the six-pack display.",
    targetSectionId: "section-2",
    targetLabel: "Section 2 · Cockpit & Instruments",
  },
  {
    id: "kf-4",
    badge: "Trim System",
    statement: "The elevator trim tab removes control column load during steady flight.",
    detail: "Set the aeroplane attitude first with primary controls. Then move the trim wheel to hold that attitude.",
    targetSectionId: "section-3",
    targetLabel: "Section 3 · Trim Operation",
  },
  {
    id: "kf-5",
    badge: "Ancillary Controls",
    statement: "Throttle (black) sets engine power. Mixture (red) adjusts the fuel-to-air ratio. Carburettor heat prevents carburettor ice.",
    detail: "Wing flaps increase wing camber. Flaps give a steeper descent path and lower the stall speed.",
    targetSectionId: "section-4",
    targetLabel: "Section 4 · Quadrant & Flaps",
  },
  {
    id: "kf-6",
    badge: "Fuel System",
    statement: "AVGAS 100LL fuel is dyed blue. Drain fuel from the sumps before flight to check for water and dirt.",
    detail: "Water is heavier than fuel. Water collects at the lowest drain point.",
    targetSectionId: "section-5",
    targetLabel: "Section 5 · Fuel Management",
  },
  {
    id: "kf-7",
    badge: "Electrical & Pressure",
    statement: "The Split Master switch (BAT and ALT) controls the direct current (DC) electrical bus.",
    detail: "The ASI uses pitot and static pressure. The altimeter and VSI use static pressure only.",
    targetSectionId: "section-7",
    targetLabel: "Section 6 & 7 · Systems",
  },
  {
    id: "kf-8",
    badge: "Ground & SOPs",
    statement: "Tricycle gear uses steerable nosewheel steering and independent main wheel toe brakes.",
    detail: "Check the aircraft documents before flight. Install the control locks and pitot cover after flight.",
    targetSectionId: "section-9",
    targetLabel: "Section 8–11 · Gear & SOPs",
  },
];

/**
 * SECTION 5 — GUIDED INTRODUCTION (7 STEP-BY-STEP CARDS)
 */
export const CHAPTER_01_GUIDED_STEPS: GuidedIntroStep[] = [
  {
    step: 1,
    id: "intro-airframe-overview",
    tag: "Airframe Overview",
    title: "Recognising the Main Parts of the Aeroplane",
    summary:
      "An aeroplane is a power-driven, heavier-than-air aircraft. Fixed wings produce the lift to fly.",
    keyPoints: [
      "Five main groups make the aircraft: fuselage, wings, empennage, undercarriage, and powerplant.",
      "Pre-flight checks and cockpit procedures follow these structural groups in order.",
    ],
    takeaway: "Learn the full aircraft structure first. This gives every control and instrument a clear position.",
    diagramViewId: "airframe-exterior",
    highlightComponentId: "ext-fuselage",
    targetSectionId: "section-1",
  },
  {
    step: 2,
    id: "intro-fuselage",
    tag: "Central Structure",
    title: "Purpose of the Fuselage & Cockpit Cabin",
    summary:
      "The fuselage is the central body of the aeroplane. It holds the crew cabin, flight controls, and instruments.",
    keyPoints: [
      "The fuselage holds the seats, dual flight controls, and instrument panel.",
      "It transfers flight and landing loads between the wings, engine, and tail unit.",
    ],
    takeaway: "The fuselage connects lift at the wings, thrust at the engine, and stability at the tail.",
    diagramViewId: "airframe-exterior",
    highlightComponentId: "ext-canopy",
    targetSectionId: "section-1",
  },
  {
    step: 3,
    id: "intro-wings",
    tag: "Lifting Surfaces",
    title: "Role of the Wings (Mainplanes), Ailerons & Flaps",
    summary:
      "The wings produce the lift that supports the aircraft in flight. They also hold fuel tanks, flaps, and ailerons.",
    keyPoints: [
      "The wing has a wing root, leading edge, trailing edge, and wing tips.",
      "Ailerons on the outer trailing edge move opposite each other to roll the aircraft.",
      "Position lights sit on the wing tips: red on the left tip, green on the right tip.",
    ],
    takeaway: "Wings produce lift and hold fuel. Flaps sit on the inner wing; ailerons sit on the outer wing.",
    diagramViewId: "airframe-exterior",
    highlightComponentId: "ext-mainplane",
    targetSectionId: "section-1",
  },
  {
    step: 4,
    id: "intro-empennage",
    tag: "Tail Assembly",
    title: "Identifying the Empennage (Tail Unit)",
    summary:
      "The empennage sits at the rear of the fuselage. It gives stability and aerodynamic control in pitch and yaw.",
    keyPoints: [
      "The vertical fin gives directional stability; the hinged rudder controls yaw.",
      "The horizontal tailplane gives pitch stability; the hinged elevator controls pitch.",
      "The trim tab on the elevator trailing edge holds the selected pitch attitude.",
    ],
    takeaway: "Fin and rudder control yaw. Tailplane, elevator, and trim tab control pitch.",
    diagramViewId: "airframe-exterior",
    highlightComponentId: "ext-empennage-fin",
    targetSectionId: "section-1",
  },
  {
    step: 5,
    id: "intro-undercarriage",
    tag: "Ground Handling",
    title: "Recognising the Tricycle Undercarriage & Brakes",
    summary:
      "The tricycle undercarriage has two main wheels under the wings and one steerable nosewheel at the front.",
    keyPoints: [
      "The oleo-pneumatic nose strut absorbs taxi bumps with gas and oil. Rudder pedals steer the nosewheel.",
      "The main gear struts absorb landing loads and carry hydraulic disc brakes.",
      "Push the top of each rudder pedal to apply the wheel brakes.",
    ],
    takeaway: "Steer with your feet on the lower pedals. Brake by pushing the top of the pedals.",
    diagramViewId: "airframe-exterior",
    highlightComponentId: "ext-main-gear",
    targetSectionId: "section-8",
  },
  {
    step: 6,
    id: "intro-powerplant",
    tag: "Propulsion",
    title: "Understanding the Powerplant, Cowling & Cooling",
    summary:
      "The engine sits inside the nose cowling. It turns the propeller to produce forward thrust.",
    keyPoints: [
      "The spinner streamlines the propeller hub. Cowling openings direct ram air to cool the cylinders.",
      "An exhaust shroud heats air for the carburettor heat system.",
      "The engine drives an alternator for electricity and a vacuum pump for flight instruments.",
    ],
    takeaway: "The engine produces thrust, generates electricity, drives gyro instruments, and heats carburettor air.",
    diagramViewId: "airframe-exterior",
    highlightComponentId: "ext-cowling",
    targetSectionId: "section-4",
  },
  {
    step: 7,
    id: "intro-cockpit-controls",
    tag: "Cockpit Integration",
    title: "Flight Instruments & Primary Cockpit Controls",
    summary:
      "Flight instruments sit in front of the pilot in the Basic-T layout. Levers and pedals control the flight path.",
    keyPoints: [
      "Six primary instruments show airspeed, attitude, altitude, turn rate, heading, and vertical speed.",
      "The control column controls pitch (fore and aft) and roll (left and right).",
      "The engine quadrant holds the throttle (black), mixture (red), and carburettor heat controls.",
    ],
    takeaway: "Flight instruments sit on the left panel, engine levers sit in the centre, and engine gauges sit on the right.",
    diagramViewId: "cockpit-panel",
    highlightComponentId: "pan-flight-instruments",
    targetSectionId: "section-2",
  },
];

/**
 * SECTION 6 & 7 — PRIMARY INTERACTIVE AIRCRAFT OVERVIEW & COMPONENT EXPLANATIONS
 * Uses the exact approved Chapter 1 illustrations (`fig-01-01.jpg`, `fig-01-02.jpg`, `fig-01-03.jpg`)
 * with pixel-verified marker coordinates matching the technical labels in each diagram.
 */
export const CHAPTER_01_DIAGRAM_VIEWS: AircraftDiagramView[] = [
  {
    id: "airframe-exterior",
    figureId: "Fig-01-01",
    label: "1. Airframe & Exterior Structure (Fig-01-01)",
    shortLabel: "Airframe Overview",
    subtitle: "Principal structural groups, lifting surfaces, control surfaces, powerplant cowling, and tricycle undercarriage.",
    src: fig0101,
    alt: "Principal Components of the Training Aeroplane showing empennage, fin, rudder, tailplane, elevator, trim tab, fuselage, cockpit canopy, wings, ailerons, engine cowling, propeller, spinner, oil cooler, exhaust, main landing gear, and nose gear",
    caption: "Select any numbered marker on the training aeroplane or from the component directory to inspect its function, relationships, and syllabus details.",
    components: [
      {
        id: "ext-propeller",
        number: 1,
        x: 81.5,
        y: 53,
        name: "Propeller & Spinner",
        category: "Powerplant",
        summary: "Rotating aerofoil blades and streamlined hub fairing that convert engine torque into forward thrust.",
        primaryFunction:
          "Accelerates a mass of air rearwards to produce forward thrust, plus slipstream airflow over the tail surfaces.",
        aircraftRelationship:
          "Mounted directly to the engine crankshaft flange at the nose of the aeroplane; the central conical spinner streamlines airflow into the cowling cooling intakes.",
        technicalDetail:
          "During pre-flight inspection, blades are checked carefully for nicks, cracks, or stone damage, and the spinner is checked for security and absence of oil leaks.",
        remember: "Treat the propeller arc as live at all times; never turn or touch a propeller unless magnetos are confirmed OFF and keys removed.",
        constituentParts: ["Propeller blades (rotating aerofoils)", "Conical hub spinner", "Crankshaft mounting flange"],
        relatedSectionId: "section-1",
        relatedSectionTitle: "1. The Aeroplane Structure and Flight Controls",
      },
      {
        id: "ext-cowling",
        number: 2,
        x: 70.5,
        y: 52,
        name: "Engine Cowling, Exhaust & Oil Cooler",
        category: "Powerplant",
        summary: "Streamlined enclosure housing the horizontally opposed piston engine, cooling baffles, oil cooler, and exhaust shroud.",
        primaryFunction:
          "Reduces aerodynamic drag around the engine while channelling ram air across the cylinders and oil cooler to regulate engine operating temperatures.",
        aircraftRelationship:
          "Bolted forward of the cabin firewall; incorporates lower engine exhaust pipes (which supply heated air to the carburettor heat shroud), the oil cooler radiator, and nose landing lights.",
        technicalDetail:
          "Monitored in the cockpit via the Oil Temperature and Oil Pressure gauges on the right-hand panel; carburettor heat draws unfiltered air heated by the exhaust manifold.",
        remember: "Ram air cools the cylinders and oil cooler; exhaust heat provides carburettor anti-icing.",
        constituentParts: ["Removable upper/lower cowling panels", "Engine exhaust manifold & heat shroud", "Oil cooler matrix", "Landing light(s)"],
        relatedSectionId: "section-4",
        relatedSectionTitle: "4. Ancillary Controls, Flap Selector and Carburettor Heat",
      },
      {
        id: "ext-nose-gear",
        number: 3,
        x: 73.5,
        y: 80.5,
        name: "Nose Gear & Steerable Nose Wheel",
        category: "Undercarriage",
        summary: "Forward oleo-pneumatic shock strut and steerable wheel assembly of the tricycle undercarriage.",
        primaryFunction:
          "Supports the forward fuselage on the ground, absorbs taxying shocks, and provides directional steering linked to the cockpit rudder pedals.",
        aircraftRelationship:
          "Attached to the engine mount/firewall structure; mechanically linked to the rudder pedal assembly and fitted with a hydraulic shimmy damper.",
        technicalDetail:
          "Uses compressed nitrogen gas and hydraulic fluid inside the oleo strut to cushion bumps. Steered with left/right foot pressure on the lower rudder pedals during taxying.",
        remember: "Nosewheel steering is controlled by the rudder pedals; avoid harsh braking while the nosewheel is turned sharply.",
        constituentParts: ["Oleo-pneumatic shock strut", "Torque links & shimmy damper", "Nose wheel & tyre"],
        relatedSectionId: "section-8",
        relatedSectionTitle: "8. Undercarriage, Brakes and Nosewheel Steering",
      },
      {
        id: "ext-canopy",
        number: 4,
        x: 58,
        y: 35,
        name: "Cockpit Canopy & Crew Cabin",
        category: "Airframe",
        summary: "Enclosed transparent cabin housing the pilot-in-command, instructor, flight controls, and instrument panel.",
        primaryFunction:
          "Provides all-round visual look-out for collision avoidance and attitude flying while protecting the crew and housing all cockpit controls and displays.",
        aircraftRelationship:
          "Integrated into the upper forward fuselage directly above the wing root; gives the pilot a clear visual reference over the nose cowling and wing tips.",
        technicalDetail:
          "Seated in the left-hand seat (Pilot-in-Command), the Basic-T flight instruments sit directly ahead while the nose cowling cut against the natural horizon sets pitch and bank attitudes.",
        remember: "Clean canopy perspex and unobstructed look-out are essential before every flight.",
        constituentParts: ["Windscreen & canopy glazing", "Crew seats & harnesses", "Cabin ventilation & demister outlets"],
        relatedSectionId: "section-2",
        relatedSectionTitle: "2. Cockpit Layout and Flight Instruments",
      },
      {
        id: "ext-fuselage",
        number: 5,
        x: 34,
        y: 41.5,
        name: "Fuselage & Radio Antenna",
        category: "Airframe",
        summary: "Main central body structure connecting the wings, nose powerplant, undercarriage, and tail unit.",
        primaryFunction:
          "Carries the crew, payload, and avionics while transmitting structural loads between the mainplane spars, engine mount, and empennage.",
        aircraftRelationship:
          "Forms the longitudinal axis of the aeroplane (nose-to-tail), about which the wings roll; carries dorsal VHF communication/navigation radio antennas and flush static vents.",
        technicalDetail:
          "Must remain aerodynamically clean and structurally sound; houses control cables running aft from the cockpit column and rudder pedals to the elevator and rudder.",
        remember: "The longitudinal axis runs through the fuselage from nose to tail — rotation about this axis is Roll.",
        constituentParts: ["Rear fuselage monocoque/semi-monocoque skin", "Dorsal VHF radio antenna", "Internal control cable runs", "Flush static vent ports"],
        relatedSectionId: "section-1",
        relatedSectionTitle: "1. The Aeroplane Structure and Flight Controls",
      },
      {
        id: "ext-mainplane",
        number: 6,
        x: 29,
        y: 65,
        name: "Mainplane (Wing Root, Leading & Trailing Edges)",
        category: "Airframe",
        summary: "Fixed aerodynamic lifting surfaces extending left and right from the fuselage wing roots.",
        primaryFunction:
          "Generates aerodynamic lift as air flows over the curved aerofoil section from the leading edge to the trailing edge, and houses the internal wing fuel tanks.",
        aircraftRelationship:
          "Joined structurally to the fuselage at the strong wing root; carries trailing-edge flaps inboard and differential ailerons outboard.",
        technicalDetail:
          "Houses the Left and Right wing fuel tanks (filled with blue AVGAS 100LL), tank vents, pitot head under the wing, and gascolator/wing sump drain points.",
        remember: "The lateral axis runs wingtip-to-wingtip through the Center of Gravity — rotation about this axis is Pitch.",
        constituentParts: ["Wing root junction", "Wing leading edge", "Wing trailing edge", "Integral wing fuel tanks & vents"],
        relatedSectionId: "section-5",
        relatedSectionTitle: "5. Fuel System Management and Tank Selection",
      },
      {
        id: "ext-ailerons",
        number: 7,
        x: 84.5,
        y: 24.5,
        name: "Outboard Ailerons (Roll Control)",
        category: "Control Surface",
        summary: "Hinged primary control surfaces on the outboard trailing edge of each wing that control Roll.",
        primaryFunction:
          "Rotates the aeroplane about its longitudinal axis (Roll) by moving differentially: when one aileron deflects down (increasing lift), the opposite aileron deflects up (decreasing lift).",
        aircraftRelationship:
          "Connected by cables/pushrods to left/right rotation of the cockpit control column or yoke.",
        technicalDetail:
          "Moving the control column to the right raises the right aileron and lowers the left aileron, banking the aeroplane to the right.",
        remember: "Ailerons = Control Column Left/Right = Longitudinal Axis = Roll.",
        constituentParts: ["Left & right outboard hinged surfaces", "Differential bellcrank & cable linkages"],
        relatedSectionId: "section-3",
        relatedSectionTitle: "3. Primary Flying Controls and Trim Systems",
      },
      {
        id: "ext-wingtips-lights",
        number: 8,
        x: 95,
        y: 23,
        name: "Wing Tips & Navigation Position Lights",
        category: "Electrical & Lighting",
        summary: "Aerodynamic extremities of the left and right wings housing red and green navigation position lights.",
        primaryFunction:
          "Reduces wingtip vortex drag and displays the aircraft's orientation at night or in poor visibility via internationally standardised navigation light colours.",
        aircraftRelationship:
          "Left (Port) wing tip carries a Red position light (visible through 110°); Right (Starboard) wing tip carries a Green position light (visible through 110°).",
        technicalDetail:
          "Protected by the NAV circuit breaker on the electrical panel; paired with the rear-facing white position light on the tail (140° coverage).",
        remember: "Port (Left) = Red; Starboard (Right) = Green; Tail = Rear-facing White.",
        constituentParts: ["Left wing tip (Red position light)", "Right wing tip (Green position light)"],
        relatedSectionId: "section-6",
        relatedSectionTitle: "6. Electrical System, Alternator and Circuit Breakers",
      },
      {
        id: "ext-main-gear",
        number: 9,
        x: 45.5,
        y: 73.5,
        name: "Main Wheel & Tricycle Landing Gear",
        category: "Undercarriage",
        summary: "Primary load-bearing undercarriage struts and wheels fitted with hydraulic disc brakes.",
        primaryFunction:
          "Absorbs the main vertical impact loads during touchdown and provides independent left and right hydraulic disc braking via the cockpit toe pedals.",
        aircraftRelationship:
          "Positioned slightly aft of the aeroplane's Center of Gravity so the aircraft rests stably on its nosewheel on the ground.",
        technicalDetail:
          "Each main wheel has a hydraulic disc brake calliper fed by a master cylinder actuated when the pilot presses the top of the corresponding rudder pedal.",
        remember: "Main wheels carry the hydraulic disc brakes; pressing the top of the left or right rudder pedal brakes that wheel independently.",
        constituentParts: ["Main gear spring/oleo struts", "Main wheels & tyres", "Hydraulic brake discs & callipers"],
        relatedSectionId: "section-8",
        relatedSectionTitle: "8. Undercarriage, Brakes and Nosewheel Steering",
      },
      {
        id: "ext-empennage-fin",
        number: 10,
        x: 20.5,
        y: 18.5,
        name: "Empennage: Fin (Vertical Stabiliser) & Rudder",
        category: "Control Surface",
        summary: "Fixed vertical fin for directional stability and hinged rear rudder for Yaw control about the normal axis.",
        primaryFunction:
          "The fixed fin provides weathercock directional stability; the hinged rudder yaws the aeroplane's nose left or right about the normal (vertical) axis and keeps flight balanced.",
        aircraftRelationship:
          "Forms the vertical portion of the empennage (tail unit); rudder cables connect directly to the cockpit rudder pedals.",
        technicalDetail:
          "Pushing the left rudder pedal deflects the rudder to the left, pushing the tail right and yawing the nose to the left.",
        remember: "Rudder = Rudder Pedals Left/Right = Normal (Vertical) Axis = Yaw.",
        constituentParts: ["Fin (vertical stabiliser)", "Hinged rudder surface", "Rudder horn & cable linkages"],
        relatedSectionId: "section-1",
        relatedSectionTitle: "1. The Aeroplane Structure and Flight Controls",
      },
      {
        id: "ext-tailplane-elevator",
        number: 11,
        x: 14.5,
        y: 36.5,
        name: "Horizontal Stabiliser (Tailplane), Elevator & Trim Tab",
        category: "Control Surface",
        summary: "Fixed tailplane for longitudinal stability, hinged elevator for Pitch control, and trailing-edge trim tab.",
        primaryFunction:
          "Controls pitch attitude about the lateral axis via fore-and-aft movement of the control column, while the trim tab aerodynamically relieves continuous stick forces.",
        aircraftRelationship:
          "Mounted horizontally at the empennage; pulling the control column back raises the elevator, pushing the tail down and pitching the nose up.",
        technicalDetail:
          "The elevator trim tab moves in the opposite direction to the elevator surface so airflow over the tab holds the elevator in the desired deflected position.",
        remember: "Elevator = Control Column Fore/Aft = Lateral Axis = Pitch; Trim Tab holds the elevator aerodynamically.",
        constituentParts: ["Horizontal stabiliser (tailplane)", "Hinged elevator", "Elevator trim tab (on trailing edge)"],
        relatedSectionId: "section-3",
        relatedSectionTitle: "3. Primary Flying Controls and Trim Systems",
      },
      {
        id: "ext-tail-lights",
        number: 12,
        x: 19.5,
        y: 10,
        name: "Rear Position Light (White) & Rotating Beacon (Red)",
        category: "Electrical & Lighting",
        summary: "High-visibility red anti-collision beacon at the fin tip and white rear-facing navigation light.",
        primaryFunction:
          "The red rotating/flashing beacon warns ground personnel and other aircraft that the electrical master/engine is active; the white light completes 360° navigation light coverage.",
        aircraftRelationship:
          "Mounted at the top of the vertical fin for maximum 360° visibility across the aerodrome and in flight.",
        technicalDetail:
          "Controlled via cockpit lighting switches and protected by dedicated circuit breakers on the 14V/28V DC bus.",
        remember: "Switch the anti-collision beacon ON before starting the engine to warn everyone near the aircraft.",
        constituentParts: ["Red rotating/flashing anti-collision beacon", "Rear-facing white position light"],
        relatedSectionId: "section-6",
        relatedSectionTitle: "6. Electrical System, Alternator and Circuit Breakers",
      },
    ],
  },
  {
    id: "cockpit-panel",
    figureId: "Fig-01-02",
    label: "2. Cockpit Panel & Six-Pack Instruments (Fig-01-02)",
    shortLabel: "Cockpit & Instruments",
    subtitle: "Standard Basic-T flight instruments, avionics stack, engine gauges, circuit breakers, and pedestal controls.",
    src: fig0102,
    alt: "Standard Six-Pack Flight Instrument Panel and Cockpit Layout showing flight instruments, magnetic compass, radio panel, tachometer, carburettor heat, throttle, mixture, oil gauges, circuit breakers, and suction gauge",
    caption: "Select any instrument or cockpit control on the panel diagram to inspect its sensor source, operating principle, and pilot scan role.",
    components: [
      {
        id: "pan-flight-instruments",
        number: 1,
        x: 21,
        y: 65,
        name: "Airspeed Indicator (ASI) — Basic-T Left",
        category: "Instrument",
        summary: "Pitot-static instrument displaying Indicated Airspeed (IAS) in knots from the difference between total (pitot) and static pressure.",
        primaryFunction:
          "Measures dynamic pressure (Pitot Total Pressure minus Static Pressure) to show the aircraft's airspeed through the surrounding air mass.",
        aircraftRelationship:
          "Occupies the top-left position of the Basic-T / Six-Pack directly ahead of the pilot-in-command; connected to both the wing pitot head and flush static vents.",
        technicalDetail:
          "Colour-coded arcs indicate the flap operating range (white arc), normal operating range (green arc), caution range (yellow arc), and never-exceed speed Vne (red radial line).",
        remember: "ASI is the ONLY instrument connected to both the Pitot line and the Static line.",
        relatedSectionId: "section-7",
        relatedSectionTitle: "7. Vacuum and Pitot-Static Systems",
      },
      {
        id: "pan-attitude-indicator",
        number: 2,
        x: 29.5,
        y: 65,
        name: "Attitude Indicator (Artificial Horizon) — Basic-T Top Centre",
        category: "Instrument",
        summary: "Gyroscopic master attitude instrument at the heart of the Basic-T displaying pitch and bank relative to the horizon.",
        primaryFunction:
          "Provides an immediate artificial representation of the aeroplane's pitch attitude (nose up/down) and bank angle (wings level/turning) against the sky/ground horizon bar.",
        aircraftRelationship:
          "Positioned top-centre of the Basic-T right in front of the pilot's eyes; powered by the engine-driven vacuum system (or electrical gyro).",
        technicalDetail:
          "Uses an earth-gyro maintaining rigidity in space while the aircraft pitches and rolls around it; normal suction is 4.5–5.5 inHg on the suction gauge.",
        remember: "Top-centre of the Basic-T: cross-check visual nose/wing attitude against the Attitude Indicator.",
        relatedSectionId: "section-2",
        relatedSectionTitle: "2. Cockpit Layout and Flight Instruments",
      },
      {
        id: "pan-altimeter",
        number: 3,
        x: 37.5,
        y: 65,
        name: "Sensitive Altimeter — Basic-T Right",
        category: "Instrument",
        summary: "Static-pressure barometric instrument indicating vertical height/altitude in feet above a selected pressure datum.",
        primaryFunction:
          "Measures ambient atmospheric static pressure via sealed aneroid capsules that expand as the aircraft climbs and contract as it descends.",
        aircraftRelationship:
          "Occupies the top-right position of the Basic-T; connected exclusively to the static pressure line and adjusted via the Kollsman subscale window (QNH / QFE / 1013 hPa).",
        technicalDetail:
          "Because atmospheric pressure decreases with height, decreasing static pressure expands the capsule and drives the pointers to indicate a higher altitude.",
        remember: "Altimeter uses static pressure only; always set the correct subscale pressure datum (QNH or QFE) before take-off.",
        relatedSectionId: "section-7",
        relatedSectionTitle: "7. Vacuum and Pitot-Static Systems",
      },
      {
        id: "pan-turn-coordinator",
        number: 4,
        x: 21,
        y: 75.5,
        name: "Turn Coordinator & Balance (Slip) Ball",
        category: "Instrument",
        summary: "Bottom-left six-pack instrument showing rate of turn (symbolic wings) and aerodynamic balance (inclinometer slip/skid ball).",
        primaryFunction:
          "The miniature aircraft shows rate of roll and rate of turn (Rate 1 = 3°/sec), while the liquid-filled curved tube and ball show whether rudder and aileron are coordinated.",
        aircraftRelationship:
          "Typically electrically powered so the pilot retains turn information even if the engine-driven vacuum pump fails.",
        technicalDetail:
          "If the ball moves out of the centre cage during a turn or climb, apply rudder on the side of the displaced ball ('step on the ball') to restore balanced flight.",
        remember: "'Step on the ball' — apply rudder toward the displaced ball to centre it in balanced flight.",
        relatedSectionId: "section-2",
        relatedSectionTitle: "2. Cockpit Layout and Flight Instruments",
      },
      {
        id: "pan-heading-indicator",
        number: 5,
        x: 29.5,
        y: 75.5,
        name: "Heading Indicator (Direction Indicator) — Basic-T Bottom",
        category: "Instrument",
        summary: "Vacuum-driven gyroscopic compass display providing a stable, lag-free magnetic heading readout.",
        primaryFunction:
          "Eliminates the dip, acceleration, and turning errors of the direct-reading magnetic compass so the pilot can track headings and execute precise turns.",
        aircraftRelationship:
          "Sits at the base of the Basic-T directly below the Attitude Indicator; driven by the vacuum system.",
        technicalDetail:
          "Because a free gyroscope precesses slowly over time due to bearing friction and Earth rotation, it must be aligned periodically with the Magnetic Compass in straight, level, unaccelerated flight.",
        remember: "Synchronise the Heading Indicator with the Magnetic Compass before take-off and every 15 minutes in cruise.",
        relatedSectionId: "section-2",
        relatedSectionTitle: "2. Cockpit Layout and Flight Instruments",
      },
      {
        id: "pan-vsi",
        number: 6,
        x: 37.5,
        y: 75.5,
        name: "Vertical Speed Indicator (VSI)",
        category: "Instrument",
        summary: "Static-pressure rate-of-climb and rate-of-descent indicator calibrated in hundreds of feet per minute (fpm).",
        primaryFunction:
          "Measures the rate of change of static pressure using a capsule connected directly to static pressure inside a case vented through a calibrated metering orifice (choke).",
        aircraftRelationship:
          "Occupies the bottom-right corner of the six-pack directly beneath the Altimeter.",
        technicalDetail:
          "Provides trend and stabilised rate of climb/descent in feet per minute (fpm) after a brief lag while pressure equalises through the calibrated leak.",
        remember: "Altimeter tells you your altitude; VSI tells you how fast your altitude is changing (fpm).",
        relatedSectionId: "section-7",
        relatedSectionTitle: "7. Vacuum and Pitot-Static Systems",
      },
      {
        id: "pan-compass",
        number: 7,
        x: 50.5,
        y: 54.5,
        name: "Direct-Reading Magnetic Compass",
        category: "Instrument",
        summary: "Self-contained standby magnetic reference mounted atop the centre glareshield requiring no electrical or vacuum power.",
        primaryFunction:
          "Senses the horizontal component of the Earth's magnetic field to indicate magnetic heading and provide the reference for setting the Heading Indicator.",
        aircraftRelationship:
          "Mounted centrally above the instrument panel away from heavy electrical current loops; accompanied by a compass deviation card.",
        technicalDetail:
          "Subject to acceleration errors (ANDS — Accelerate North, Decelerate South in the Northern Hemisphere) and northerly turning errors; read only when wings are level and speed is constant.",
        remember: "Read the magnetic compass only in straight, level, unaccelerated flight, then set the Heading Indicator to match.",
        relatedSectionId: "section-2",
        relatedSectionTitle: "2. Cockpit Layout and Flight Instruments",
      },
      {
        id: "pan-radio-stack",
        number: 8,
        x: 51,
        y: 66,
        name: "Radio & Avionics Panel (COM / NAV / Transponder)",
        category: "Electrical & Lighting",
        summary: "Central avionics stack housing VHF communications (COM), navigation receivers (NAV), audio panel, and transponder.",
        primaryFunction:
          "Enables two-way ATC voice communications (118.000–136.975 MHz) and radio navigation tuning with active and standby frequency windows.",
        aircraftRelationship:
          "Positioned in the centre of the panel so it is easily reachable by both the student pilot (left seat) and instructor (right seat); powered via the Avionics Master Switch.",
        technicalDetail:
          "Always keep the Avionics Master Switch OFF during engine start and shutdown to protect sensitive radio circuits from starter voltage transients.",
        remember: "Avionics Master OFF before engine start and before engine shutdown.",
        relatedSectionId: "section-6",
        relatedSectionTitle: "6. Electrical System, Alternator and Circuit Breakers",
      },
      {
        id: "pan-tachometer",
        number: 9,
        x: 31.5,
        y: 86.5,
        name: "Tachometer (Engine RPM)",
        category: "Instrument",
        summary: "Primary power instrument for a fixed-pitch propeller aeroplane, displaying engine crankshaft speed in Revolutions Per Minute (RPM).",
        primaryFunction:
          "Indicates engine power output in RPM and incorporates an elapsed-time recording counter for maintenance and flight log keeping.",
        aircraftRelationship:
          "Located below the six-pack near the throttle quadrant so the pilot can cross-check RPM while adjusting the throttle plunger.",
        technicalDetail:
          "Green arc marks normal operating RPM and the red radial line marks maximum permissible engine RPM.",
        remember: "In a fixed-pitch training aeroplane, the Tachometer (RPM) is your primary gauge of engine power.",
        relatedSectionId: "section-4",
        relatedSectionTitle: "4. Ancillary Controls, Flap Selector and Carburettor Heat",
      },
      {
        id: "pan-carb-heat",
        number: 10,
        x: 40.5,
        y: 86.8,
        name: "Carburettor Heat Control Plunger",
        category: "Cockpit Control",
        summary: "Push-pull plunger that selects unfiltered heated air from the exhaust shroud to prevent or melt carburettor ice.",
        primaryFunction:
          "Diverts intake air through a shroud around the hot exhaust manifold before entering the carburettor venturi.",
        aircraftRelationship:
          "Mounted immediately adjacent to the throttle control at the lower centre pedestal.",
        technicalDetail:
          "Pulling Carb Heat ON (out) introduces warm, less dense, unfiltered air, causing a slight RPM drop in normal flight. Return Carb Heat to COLD (in) on short final / go-around and during ground taxying (to avoid ingesting unfiltered dust).",
        remember: "Carb Heat ON = warm unfiltered air = slight RPM drop; select COLD on the ground and for full-power go-around.",
        relatedSectionId: "section-4",
        relatedSectionTitle: "4. Ancillary Controls, Flap Selector and Carburettor Heat",
      },
      {
        id: "pan-throttle-mixture",
        number: 11,
        x: 51.5,
        y: 86.2,
        name: "Throttle (Black) & Mixture (Red) Controls",
        category: "Cockpit Control",
        summary: "Paired push-pull engine controls on the central pedestal: Black smooth knob for Throttle power; Red grooved knob for Mixture.",
        primaryFunction:
          "Throttle (black) opens/closes the carburettor butterfly valve to control airflow and engine RPM; Mixture (red) meters fuel flow relative to air mass and shuts the engine down at Idle Cut-Off.",
        aircraftRelationship:
          "Mounted centrally between pilot and instructor with a friction nut on the throttle shaft to prevent vibration creep.",
        technicalDetail:
          "Push forward (IN) for FULL POWER / FULL RICH; pull aft (OUT) to reduce power (Throttle) or lean/shut down fuel flow (Mixture Idle Cut-Off).",
        remember: "Black = Throttle (Power); Red = Mixture (Fuel/Air Ratio & Idle Cut-Off shutdown).",
        relatedSectionId: "section-4",
        relatedSectionTitle: "4. Ancillary Controls, Flap Selector and Carburettor Heat",
      },
      {
        id: "pan-engine-elec-gauges",
        number: 12,
        x: 73,
        y: 72,
        name: "Oil Temp/Pressure, Suction Gauge & Circuit Breakers",
        category: "Electrical & Lighting",
        summary: "Right-hand systems panel housing engine oil temperature/pressure gauges, gyro suction gauge, and pull-reset circuit breakers.",
        primaryFunction:
          "Monitors engine lubrication health (Oil Temp & Pressure), vacuum gyro supply (Suction 4.5–5.5 inHg), and protects electrical bus circuits (ALT, FLAP, NAV, STROBE, COM, XPDR, AUDIO).",
        aircraftRelationship:
          "Grouped on the right-hand panel for systematic left-to-right cockpit scan verification after engine start and during FREDA cruise checks.",
        technicalDetail:
          "After engine start, oil pressure must rise into the green range within 30 seconds. If a circuit breaker pops in flight, allow brief cooling and reset at most once — never hold a popped breaker in.",
        remember: "Check Oil Pressure immediately after start; never reset a tripped circuit breaker more than once.",
        relatedSectionId: "section-6",
        relatedSectionTitle: "6. Electrical System, Alternator and Circuit Breakers",
      },
    ],
  },
  {
    id: "control-columns",
    figureId: "Fig-01-03",
    label: "3. Cockpit Pitch & Roll Control Types (Fig-01-03)",
    shortLabel: "Control Columns",
    subtitle: "Comparison of the three primary cockpit control mechanisms that actuate the elevator (pitch) and ailerons (roll).",
    src: fig0103,
    alt: "Primary Control Linkages comparing Control column or joystick, Control wheel or yoke, and Side-stick",
    caption: "Compare the three cockpit control geometries used across training aeroplanes: all three govern Pitch (fore/aft) and Roll (left/right) identically.",
    components: [
      {
        id: "col-joystick",
        number: 1,
        x: 14.5,
        y: 46,
        name: "Control Column or Centre Joystick",
        category: "Cockpit Control",
        summary: "Floor-pivoted vertical stick mounted between the pilot's knees providing direct mechanical cable/pushrod feel.",
        primaryFunction:
          "Moving the stick fore-and-aft actuates the elevator (pitch); moving it left-and-right actuates the ailerons differentially (roll).",
        aircraftRelationship:
          "Pivots on a universal joint at the cockpit floor; commonly incorporates a push-to-talk (PTT) radio trigger and electric trim switch on the grip.",
        technicalDetail:
          "Provides immediate visual and tactile feedback of control deflection angle during training manoeuvres and aerobatic/utility instruction.",
        remember: "Stick back = Nose pitches up; Stick forward = Nose pitches down; Stick left/right = Rolls left/right.",
        relatedSectionId: "section-3",
        relatedSectionTitle: "3. Primary Flying Controls and Trim Systems",
      },
      {
        id: "col-yoke",
        number: 2,
        x: 48,
        y: 40,
        name: "Control Wheel or Dual-Horn Yoke",
        category: "Cockpit Control",
        summary: "Panel-mounted sliding shaft and wheel assembly standard on most touring and ab-initio training aeroplanes.",
        primaryFunction:
          "Pulling or pushing the yoke shaft fore-and-aft controls the elevator (pitch); rotating the wheel left or right like a steering wheel controls the ailerons (roll).",
        aircraftRelationship:
          "Passes through the instrument panel on a sliding tube (as seen in the G-BZKD cockpit photo in Fig-01-02), leaving the cockpit floor clear.",
        technicalDetail:
          "Secured after shutdown by inserting a physical control-column gust lock pin through the yoke shaft collar to prevent wind damage to control surfaces.",
        remember: "Pull/Push the yoke for Pitch; Rotate the yoke left/right for Roll.",
        relatedSectionId: "section-3",
        relatedSectionTitle: "3. Primary Flying Controls and Trim Systems",
      },
      {
        id: "col-sidestick",
        number: 3,
        x: 85.5,
        y: 48,
        name: "Cockpit Side-Stick Controller",
        category: "Cockpit Control",
        summary: "Ergonomic outboard or console-mounted stick leaving an unobstructed view of the entire instrument panel.",
        primaryFunction:
          "Tilting fore-and-aft commands pitch via the elevator; tilting left-and-right commands roll via the ailerons.",
        aircraftRelationship:
          "Mounted on the side console or centre armrest (such as in modern composite trainers shown in Fig-01-01) with an natural wrist rest.",
        technicalDetail:
          "Regardless of whether an aircraft uses a centre stick, yoke, or side-stick, the aerodynamic control laws and sense of movement are 100% identical.",
        remember: "Different cockpit ergonomics (Stick, Yoke, Side-Stick), identical aerodynamic response in Pitch and Roll.",
        relatedSectionId: "section-3",
        relatedSectionTitle: "3. Primary Flying Controls and Trim Systems",
      },
    ],
  },
];

/**
 * SECTION 8 — VISUAL EXPLANATION MODULES
 * A. Three-Axis Primary Control Table & Interactive Selector
 */
export const CHAPTER_01_CONTROL_AXES: ControlSurfaceAxisRow[] = [
  {
    surface: "Ailerons (Outboard Wing)",
    location: "Outboard trailing edge of left and right mainplanes",
    cockpitInput: "Control Column / Yoke Left & Right",
    axis: "Longitudinal Axis (Nose to Tail)",
    motion: "Roll (Banking left or right)",
    distinction: "Move differentially (one up, one down) — unlike flaps, which deploy symmetrically downwards on both wings.",
  },
  {
    surface: "Elevator / Stabilator",
    location: "Rear of the horizontal stabiliser (tailplane)",
    cockpitInput: "Control Column / Yoke Fore & Aft",
    axis: "Lateral Axis (Wingtip to Wingtip)",
    motion: "Pitch (Nose up or nose down)",
    distinction: "Sets pitch attitude directly; the smaller elevator trim tab moves opposite to hold the elevator without pilot force.",
  },
  {
    surface: "Rudder (Vertical Tail)",
    location: "Rear of the vertical stabiliser (fin)",
    cockpitInput: "Rudder Pedals Left & Right (Lower Pedals)",
    axis: "Normal / Vertical Axis (Through CoG)",
    motion: "Yaw (Nose left or right) & Slip Balance",
    distinction: "In flight, rudder balances slip/skid (it does NOT turn the aeroplane on its own); on the ground, pedals steer the nosewheel.",
  },
];

/**
 * B. Side-by-Side Component Distinctions (Easily Confused Pairs)
 */
export const CHAPTER_01_DISTINCTIONS: ComponentDistinctionItem[] = [
  {
    id: "dist-aileron-flap",
    title: "Outboard Ailerons vs Inboard Trailing-Edge Flaps",
    leftName: "Ailerons (Outboard)",
    leftRole: "Primary flight control: deflect differentially (one up, one down) via left/right yoke input to roll the aircraft.",
    rightName: "Trailing-Edge Flaps (Inboard)",
    rightRole: "Ancillary high-lift device: deflect symmetrically downwards on both wings to increase camber, lift, and drag for approach/landing.",
    keyDifference: "Ailerons roll the aircraft (opposite movement); Flaps steepen approach angle and lower stall speed (symmetrical movement).",
  },
  {
    id: "dist-pitot-vacuum",
    title: "Pitot-Static System vs Vacuum Gyro System",
    leftName: "Pitot-Static Instruments",
    leftRole: "ASI (Pitot + Static), Altimeter (Static only), and VSI (Static only) require no electrical or vacuum pump power.",
    rightName: "Vacuum / Gyro Instruments",
    rightRole: "Attitude Indicator and Heading Indicator rely on high-speed spinning rotors driven by engine vacuum suction (4.5–5.5 inHg).",
    keyDifference: "Pressure capsules measure airspeed/altitude/climb rate; spinning gyroscopes measure pitch/bank attitude and heading.",
  },
  {
    id: "dist-throttle-mixture",
    title: "Throttle Plunger (Black) vs Mixture Control (Red)",
    leftName: "Throttle Control (Black)",
    leftRole: "Regulates total airflow and fuel-air charge entering the cylinders to set engine RPM and manifold power.",
    rightName: "Mixture Control (Red)",
    rightRole: "Adjusts the ratio of fuel to air for altitude leaning and cuts off fuel completely (Idle Cut-Off) to shut down the engine.",
    keyDifference: "Throttle controls quantity of charge (power); Mixture controls fuel-to-air ratio and engine shutdown.",
  },
  {
    id: "dist-rudder-toebrakes",
    title: "Lower Rudder Pedals vs Upper Differential Toe Brakes",
    leftName: "Lower Rudder Pedals (Heels on Floor)",
    leftRole: "Pushing left or right with your feet yaws the rudder in flight and steers the nosewheel during normal taxying.",
    rightName: "Upper Pedal Toe Brakes",
    rightRole: "Pressing the top portion of the left or right pedal actuates independent hydraulic disc brakes on the main wheels.",
    keyDifference: "Keep heels on the floor during take-off and landing so you do not inadvertently apply wheel brakes while steering with rudder.",
  },
];

/**
 * C. Sequential Diagrams: Cockpit Scan Flow & Pre/Post-Flight Discipline
 */
export const CHAPTER_01_SCAN_SEQUENCE: SequentialFlowStep[] = [
  {
    step: 1,
    title: "Floor Console & Fuel Selector Start",
    area: "Cockpit Floor",
    action: "Begin scan at the fuel selector valve (LEFT / RIGHT / BOTH), verify fuel shut-off, and check the elevator trim wheel neutral take-off mark.",
  },
  {
    step: 2,
    title: "Pedestal Quadrant & Ancillary Controls",
    area: "Centre Pedestal",
    action: "Verify carburettor heat COLD, throttle friction nut set, mixture RICH (or Idle Cut-Off prior to start), and flap selector position.",
  },
  {
    step: 3,
    title: "Left-to-Right Main Panel Sweep",
    area: "Instrument Panel",
    action: "Sweep across Split Master Switch (BAT/ALT), magneto switch, Basic-T flight instruments, avionics stack, engine oil gauges, suction gauge, and circuit breakers.",
  },
  {
    step: 4,
    title: "Written Checklist Verification",
    area: "Challenge & Response",
    action: "Confirm every physical flow action by reading each item aloud from the laminated aircraft checklist so no vital action relies on memory alone.",
  },
  {
    step: 5,
    title: "Technical Log & Airframe Documents Check",
    area: "Commander Acceptance",
    action: "Inspect the Technical Log, Certificate of Airworthiness (C of A), Airworthiness Review Certificate (ARC), Mass & Balance schedule, and deferred defects.",
  },
  {
    step: 6,
    title: "Post-Flight Securing & Control Locks",
    area: "Shutdown & Mooring",
    action: "Record flight times in the Tech Log, confirm all switches OFF, fit the control column gust lock and external pitot cover, and secure chocks and tie-downs.",
  },
];

/**
 * ALL 11 SYLLABUS SECTIONS OF CHAPTER 1 (Preserving exact IDs `section-1`..`section-11` and verbatim prose)
 */
export const CHAPTER_01_SYLLABUS_SECTIONS: RedesignedSyllabusSection[] = [
  {
    id: "section-1",
    number: 1,
    title: "1. The Aeroplane Structure and Flight Controls",
    groupTag: "Airframe & Axes",
    figureId: "Fig-01-01",
    primaryFunction:
      "Defines the five structural groups of a fixed-wing training aeroplane and the three orthogonal axes of rotation.",
    essentialExplanation:
      "Before entering the cockpit for Exercise 1, a pilot must identify how the fuselage, wings (mainplanes), empennage (tail unit), undercarriage, and powerplant work together, and how the three primary control surfaces rotate the aircraft in Roll, Pitch, and Yaw.",
    verbatimMarkdown:
      "An aeroplane is a power-driven heavier-than-air aircraft deriving its lift in flight chiefly from aerodynamic reactions on surfaces which remain fixed under given conditions of flight. Before entering the cockpit for Exercise 1 (Aircraft Familiarisation), every student pilot must understand the structural groups of the airframe: the fuselage, wings (mainplanes), empennage (tail unit), undercarriage (landing gear), and powerplant.",
    keyDistinction:
      "Wings remain fixed to generate lift while hinged trailing-edge control surfaces (ailerons, elevator, rudder) deflect to rotate the aircraft about its Center of Gravity.",
    keyPoints: [
      "Fuselage: central body carrying crew and connecting wings, tail unit, and nose powerplant.",
      "Mainplanes (Wings): fixed lifting surfaces housing fuel tanks, inboard flaps, and outboard ailerons.",
      "Empennage: vertical fin + rudder (directional stability & yaw) and horizontal tailplane + elevator (longitudinal stability & pitch).",
    ],
    memoryAid: "Ailerons = Roll (Longitudinal) · Elevator = Pitch (Lateral) · Rudder = Yaw (Normal).",
    takeaway:
      "Every movement of the aeroplane in three-dimensional space is a combination of Roll, Pitch, and Yaw around its Center of Gravity.",
  },
  {
    id: "section-2",
    number: 2,
    title: "2. Cockpit Layout and Flight Instruments",
    groupTag: "Cockpit & Basic-T",
    figureId: "Fig-01-02",
    primaryFunction:
      "Organises primary flight instruments directly in front of the pilot-in-command in the standard Basic-T scan pattern.",
    essentialExplanation:
      "To minimise scan fatigue and eye movement, the Attitude Indicator sits top-centre, flanked by Airspeed (left) and Altitude (right), with Heading directly beneath — while radios occupy the centre stack and engine/electrical gauges sit on the right.",
    verbatimMarkdown:
      "The cockpit is organised logically so that primary flight instruments sit directly ahead of the pilot-in-command in the standard Basic-T arrangement, while engine gauges, electrical switches, and avionics occupy the centre and right-hand panels.",
    keyDistinction:
      "The top row of the six-pack shows Speed, Attitude, and Altitude; the bottom row shows Turn Rate/Balance, Heading, and Vertical Speed.",
    keyPoints: [
      "Top Row: Airspeed Indicator (ASI), Attitude Indicator (AI), Sensitive Altimeter.",
      "Bottom Row: Turn Coordinator (with slip ball), Heading Indicator (DI), Vertical Speed Indicator (VSI).",
      "Centre & Right Panels: Magnetic compass above glareshield, COM/NAV radio stack in centre, tachometer and oil/suction gauges on right.",
    ],
    memoryAid: "Basic-T hub is the Attitude Indicator: scan left for Speed, right for Altitude, down for Heading.",
    takeaway:
      "A standardized cockpit layout lets you transition smoothly between visual attitude flying and instrument cross-checking.",
  },
  {
    id: "section-3",
    number: 3,
    title: "3. Primary Flying Controls and Trim Systems",
    groupTag: "Flight Controls",
    figureId: "Fig-01-03",
    primaryFunction:
      "Translates pilot stick/yoke and rudder pedal inputs into aerodynamic deflections and trims away continuous holding forces.",
    essentialExplanation:
      "Mechanical cables and pushrods link the cockpit control column and rudder pedals to the ailerons, elevator, and rudder. Once the desired pitch attitude and airspeed are stabilised, the elevator trim wheel adjusts the trailing-edge trim tab to hold the elevator aerodynamically.",
    verbatimMarkdown:
      "Moving the control column or rudder pedals deflects the primary aerodynamic surfaces at the extremities of the airframe. Trim tabs relieve the pilot of continuous control pressures during sustained flight attitudes.",
    keyDistinction:
      "Do not fly the aeroplane with the trim wheel: always select and hold the attitude with the control column first, then trim off the pressure.",
    keyPoints: [
      "Control column/yoke fore-and-aft controls Elevator (Pitch); left-and-right controls Ailerons differentially (Roll).",
      "Rudder pedals left-and-right control Rudder (Yaw and aerodynamic slip/skid balance).",
      "Elevator trim tab deflects opposite to the elevator to create an aerodynamic holding force.",
    ],
    memoryAid: "Set Attitude → Hold Stabilised Speed → Trim Away Control Pressure.",
    takeaway:
      "Accurate trimming frees your attention for look-out, navigation, and smooth attitude control.",
  },
  {
    id: "section-4",
    number: 4,
    title: "4. Ancillary Controls, Flap Selector and Carburettor Heat",
    groupTag: "Engine & Flaps",
    figureId: "Fig-01-04",
    primaryFunction:
      "Manages engine thrust, fuel-air mixture ratio, carburettor ice protection, and wing flap configuration.",
    essentialExplanation:
      "On the central pedestal, the pilot operates the black Throttle plunger (power), red Mixture control (fuel/air ratio & shutdown), Carburettor Heat plunger (unfiltered heated air from the exhaust shroud), and the trailing-edge Flap selector.",
    verbatimMarkdown:
      "In addition to throttle and mixture controls on the quadrant, the pilot manages carburettor heat (or alternate air), trailing-edge flaps, parking brake, and cabin ventilation controls.",
    keyDistinction:
      "Carburettor heat uses unfiltered warm air from the exhaust shroud — select it ON before reducing power or periodically in cruise, and return to COLD on the ground and on short final.",
    keyPoints: [
      "Throttle (black) adjusts manifold airflow/RPM; friction nut prevents lever creep.",
      "Mixture (red) leans fuel for altitude and shuts the engine down cleanly at Idle Cut-Off.",
      "Flaps deploy in stages (e.g. Take-off, Approach, Landing) within the ASI white-arc speed limit.",
    ],
    memoryAid: "Black = Throttle · Red = Mixture · Carb Heat = Warm Unfiltered Air · Flaps = White Arc Only.",
    takeaway:
      "Identify every ancillary control by both position and knob shape so you can operate it without taking your eyes off the runway.",
  },
  {
    id: "section-5",
    number: 5,
    title: "5. Fuel System Management and Tank Selection",
    groupTag: "Fuel System",
    figureId: "Fig-01-05",
    primaryFunction:
      "Stores, vents, filters, and delivers clean AVGAS 100LL from the wing tanks to the engine carburettor or fuel injectors.",
    essentialExplanation:
      "Fuel is carried in left and right wing tanks vented to ambient air so a vacuum cannot form as fuel is consumed. It passes through the cockpit fuel selector valve and low-point strainer drain (gascolator) to the auxiliary electric pump and engine-driven pump.",
    verbatimMarkdown:
      "Understanding fuel tank capacity, usable fuel quantity, fuel grade/colour (AVGAS 100LL dyed blue), tank venting, and the fuel selector valve is essential prior to engine start.",
    keyDistinction:
      "Total tank capacity includes a small unusable volume at the bottom of the tank — always plan flight endurance using USABLE fuel only.",
    keyPoints: [
      "AVGAS 100LL is dyed pale blue; water is colourless and denser, settling at the bottom of the sample cup.",
      "Fuel tank vents maintain atmospheric pressure above the fuel and prevent tank collapse or fuel starvation.",
      "Fuel selector valve selects LEFT, RIGHT, BOTH (where fitted), or OFF for emergency isolation.",
    ],
    memoryAid: "100LL is Blue · Water Sinks to the Bottom · Plan on Usable Fuel Only.",
    takeaway:
      "Visually dip the wing tanks, drain the low-point strainers for water/sediment, and confirm the fuel selector is on the fullest tank before start.",
  },
  {
    id: "section-6",
    number: 6,
    title: "6. Electrical System, Alternator and Circuit Breakers",
    groupTag: "Electrical Bus",
    figureId: "Fig-01-06",
    primaryFunction:
      "Supplies 14V or 28V direct-current (DC) power to avionics, lighting, flaps, and instruments via an alternator and storage battery.",
    essentialExplanation:
      "During flight, the engine-driven alternator supplies the main electrical bus and keeps the battery charged. The split Master Switch has two halves — BAT (battery contactor) and ALT (alternator field) — allowing independent isolation if an electrical fault occurs.",
    verbatimMarkdown:
      "The electrical system typically operates on a 14-volt or 28-volt direct-current bus supplied by an engine-driven alternator and buffered by a main storage battery.",
    keyDistinction:
      "Note: The engine ignition system (dual magnetos) is completely self-contained and independent of the aircraft's battery and alternator.",
    keyPoints: [
      "Split Master Switch: BAT connects the battery to the bus; ALT energises the alternator field circuit.",
      "Ammeter / Loadmeter indicates whether the battery is charging or discharging.",
      "Pull-reset circuit breakers protect individual services; Avionics Master protects radios during start/shutdown.",
    ],
    memoryAid: "BAT buffers · ALT generates · Magnetos run independently of the DC bus.",
    takeaway:
      "Monitor the ammeter and warning light in flight so an alternator failure is detected before the battery depletes.",
  },
  {
    id: "section-7",
    number: 7,
    title: "7. Vacuum and Pitot-Static Systems",
    groupTag: "Pressure & Gyros",
    figureId: "Fig-01-07",
    primaryFunction:
      "Feeds ram and static atmospheric pressures to the ASI, Altimeter, and VSI while spinning the attitude and direction gyros.",
    essentialExplanation:
      "The under-wing Pitot head faces into the airflow to sense Total (Ram + Static) pressure for the ASI, while the flush Static vent senses undisturbed ambient pressure for the ASI, Altimeter, and VSI. An engine-driven vacuum pump draws air (4.5–5.5 inHg suction) across the Attitude and Heading gyro rotors.",
    verbatimMarkdown:
      "The Airspeed Indicator (ASI), Altimeter, and Vertical Speed Indicator (VSI) rely on pitot and static pressure lines, whereas gyroscopic instruments rely on either a vacuum pump or electrical power.",
    keyDistinction:
      "A blocked pitot head affects ONLY the Airspeed Indicator; a blocked static vent affects all three pitot-static instruments (ASI, Altimeter, and VSI).",
    keyPoints: [
      "Pitot Head: supplies Total Pressure to the ASI capsule; heated electrically when Pitot Heat is switched ON.",
      "Static Vent: supplies Static Pressure to the ASI case, Altimeter case, and VSI capsule/case.",
      "Vacuum Pump & Suction Gauge: maintains 4.5–5.5 inHg suction for Attitude Indicator and Heading Indicator.",
    ],
    memoryAid: "ASI = Pitot + Static · Altimeter & VSI = Static Only · AI & DI = Vacuum Suction.",
    takeaway:
      "Always remove the external pitot cover on walk-around and verify suction is in the green range after engine start.",
  },
  {
    id: "section-8",
    number: 8,
    title: "8. Undercarriage, Brakes and Nosewheel Steering",
    groupTag: "Landing Gear",
    figureId: "Fig-01-08",
    primaryFunction:
      "Supports the aeroplane during ground operations, absorbs landing energy, and provides directional steering and wheel braking.",
    essentialExplanation:
      "The tricycle undercarriage places an oleo-pneumatic steerable nose strut at the front and two main gear struts with hydraulic disc brakes beneath the wings/fuselage. Steering is controlled with the lower rudder pedals, while independent left/right braking is applied by pressing the top of the pedals.",
    verbatimMarkdown:
      "Training aeroplanes commonly feature a tricycle undercarriage with differential toe brakes mounted on the top of the rudder pedals and a steerable nosewheel linked to the rudder pedal assembly.",
    keyDistinction:
      "Use rudder pedal nosewheel steering for normal directional control; use differential toe braking only to assist tight turns or control speed.",
    keyPoints: [
      "Oleo-pneumatic nose strut uses nitrogen gas and hydraulic fluid; fitted with a shimmy damper.",
      "Main gear struts carry hydraulic disc brake callipers on each main wheel.",
      "Parking brake latches both main wheel brakes for run-up and parking (supplemented by wheel chocks).",
    ],
    memoryAid: "Heels on the floor to steer; toes on the top of the pedals to brake.",
    takeaway:
      "Test the toe brakes immediately after the aircraft begins rolling forward when leaving the parking bay.",
  },
  {
    id: "section-9",
    number: 9,
    title: "9. Cockpit Checklists and Standard Operating Procedures",
    groupTag: "Cockpit Discipline",
    figureId: "Fig-01-09",
    primaryFunction:
      "Establishes a repeatable geographical cockpit scan flow backed by written challenge-and-response checklists.",
    essentialExplanation:
      "Rather than jumping randomly around the cockpit, the pilot follows a logical physical scan path — starting at the floor fuel selector and trim wheel, moving up the pedestal, and sweeping left-to-right across the main panel — and then verifies every item with the written checklist.",
    verbatimMarkdown:
      "Checklists ensure that vital actions are completed in a logical flow and verified systematically rather than relying on memory alone during high-workload phases.",
    keyDistinction:
      "A geographical scan sets switches smoothly; the written checklist verifies that no critical item was skipped after an interruption.",
    keyPoints: [
      "Floor-to-Panel-to-Overhead scan pattern creates muscle-memory consistency.",
      "Touch and look at each gauge or switch as you read the checklist item.",
      "If interrupted during a checklist (e.g. by ATC radio call), restart that checklist section from the beginning.",
    ],
    memoryAid: "Scan Flow to Configure · Written Checklist to Verify.",
    takeaway:
      "Never rely on memory alone for pre-start, vital pre-take-off, or shutdown checks.",
  },
  {
    id: "section-10",
    number: 10,
    title: "10. Airframe Documents and Technical Log Verification",
    groupTag: "Airworthiness & Law",
    primaryFunction:
      "Confirms that the aeroplane is legally airworthy, within maintenance hours, and properly documented before flight.",
    essentialExplanation:
      "Before walking out to the aircraft, the pilot-in-command must inspect the aircraft's Technical Log and statutory airworthiness certificates, verify remaining hours to the next maintenance check, and review any deferred defect entries.",
    verbatimMarkdown:
      "Before accepting an aircraft for flight, the commander must inspect the Technical Log, Certificate of Airworthiness, Airworthiness Review Certificate, mass and balance schedule, and deferred defect entries.",
    keyDistinction:
      "An unentered or unserviceable critical defect in the Technical Log grounds the aircraft until signed off by a licensed engineer.",
    keyPoints: [
      "Technical Log: check remaining hours to next scheduled maintenance, daily inspection sign-off, fuel/oil uplift, and deferred defects.",
      "Certificate of Airworthiness (C of A) & valid Airworthiness Review Certificate (ARC).",
      "Current Mass and Balance schedule, Radio Licence, Certificate of Registration, and Insurance certificate.",
    ],
    memoryAid: "No Technical Log Sign-Up = No Flight.",
    takeaway:
      "Legal responsibility for accepting the aircraft rests with the pilot-in-command upon signing the Technical Log.",
  },
  {
    id: "section-11",
    number: 11,
    title: "11. Post-Flight Securing and Control Locks",
    groupTag: "Post-Flight Care",
    primaryFunction:
      "Protects the airframe, flight controls, and pitot-static sensors from wind and environmental damage after shutdown.",
    essentialExplanation:
      "A flight is not complete until the engine is shut down via mixture idle cut-off, magnetos and master switches are confirmed OFF, flight times and any defects are recorded in the Technical Log, and physical restraints (gust lock, pitot cover, chocks, and tie-downs) are fitted.",
    verbatimMarkdown:
      "After shutdown, the pilot records flight times in the technical log, fits the external pitot cover and control column gust lock, verifies all switches are OFF, and secures chocks and tie-downs as required.",
    keyDistinction:
      "Leave the parking brake OFF if chocks and tie-downs are fitted in cold weather so brake pads cannot freeze onto hot discs.",
    keyPoints: [
      "Record airborne and block times accurately in the Technical Log and report any snags.",
      "Fit the cockpit control column gust lock so wind gusts cannot slam the ailerons and elevator against their stops.",
      "Fit the external pitot head cover (with high-visibility streamer) to keep insects and moisture out of the pitot line.",
    ],
    memoryAid: "Switches OFF · Gust Lock IN · Pitot Cover ON · Chocks & Tech Log Completed.",
    takeaway:
      "Disciplined post-flight securing ensures the aeroplane is safe and ready for the next crew.",
  },
];

/**
 * SECTION 10 — INTERACTIVE KNOWLEDGE CHECKS (6 PRACTICE QUESTIONS)
 */
export const CHAPTER_01_KNOWLEDGE_CHECKS: ChapterKnowledgeCheck[] = [
  {
    id: "kc-1",
    number: 1,
    formatLabel: "Control Surface & Axis Match",
    sectionRef: "Section 1 & 3",
    question:
      "When the pilot rotates or moves the control column to the left, which primary control surfaces deflect and around which axis does the aeroplane rotate?",
    options: [
      {
        id: "a",
        label: "The outboard ailerons deflect differentially (left up, right down), rolling the aeroplane about its longitudinal axis.",
      },
      {
        id: "b",
        label: "The inboard flaps deflect differentially, pitching the aeroplane about its lateral axis.",
      },
      {
        id: "c",
        label: "The vertical rudder deflects left, yawing the aeroplane about its normal (vertical) axis.",
      },
      {
        id: "d",
        label: "The elevator trim tab deflects downwards, rolling the aeroplane about its lateral axis.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Lateral movement of the control column or yoke actuates the outboard ailerons differentially (left aileron rises to reduce lift, right aileron lowers to increase lift), rolling the aeroplane to the left about its longitudinal (nose-to-tail) axis.",
    misconception:
      "Remember that the longitudinal axis runs nose-to-tail (Roll), whereas the lateral axis runs wingtip-to-wingtip (Pitch).",
  },
  {
    id: "kc-2",
    number: 2,
    formatLabel: "Component Distinction",
    sectionRef: "Section 3",
    question:
      "How should the pilot use the elevator trim wheel and trim tab when establishing a new flight attitude?",
    options: [
      {
        id: "a",
        label: "Use the trim wheel directly instead of the control column to pitch the nose up or down.",
      },
      {
        id: "b",
        label: "First establish and hold the desired attitude and airspeed with the control column, then adjust the trim wheel to relieve residual stick pressure.",
      },
      {
        id: "c",
        label: "Set the trim wheel to full nose-up before every manoeuvre to lighten the rudder pedals.",
      },
      {
        id: "d",
        label: "Never adjust the trim wheel in flight once the take-off position has been set on the ground.",
      },
    ],
    correctOptionId: "b",
    explanation:
      "Always fly the aeroplane with the primary controls first: select and hold the attitude with the control column until speed stabilises, then use the trim tab to aerodynamically hold the elevator in place and remove the load from your hand.",
    misconception:
      "Flying the aircraft primarily with the trim wheel causes chasing of pitch and airspeed.",
  },
  {
    id: "kc-3",
    number: 3,
    formatLabel: "Pitot-Static vs Vacuum Systems",
    sectionRef: "Section 7",
    question:
      "Which cockpit instrument relies on BOTH total (pitot) pressure and static pressure, and which instruments rely on the engine-driven vacuum pump?",
    options: [
      {
        id: "a",
        label: "The Altimeter uses pitot + static pressure; the ASI and VSI use the vacuum pump.",
      },
      {
        id: "b",
        label: "The Airspeed Indicator (ASI) uses pitot + static pressure; the Attitude Indicator and Heading Indicator use the vacuum pump.",
      },
      {
        id: "c",
        label: "The Vertical Speed Indicator (VSI) uses pitot + static pressure; the Magnetic Compass uses the vacuum pump.",
      },
      {
        id: "d",
        label: "All six instruments in the Basic-T six-pack rely on the pitot head.",
      },
    ],
    correctOptionId: "b",
    explanation:
      "The Airspeed Indicator (ASI) is the only instrument that compares Pitot (Total) pressure against Static pressure. The Altimeter and VSI use Static pressure only, while the Attitude Indicator and Heading Indicator are gyroscopic instruments spun by the vacuum system (4.5–5.5 inHg).",
    misconception:
      "If the pitot head is blocked (e.g. pitot cover left on), only the ASI fails; the Altimeter and VSI continue to receive static pressure from the static vent.",
  },
  {
    id: "kc-4",
    number: 4,
    formatLabel: "Engine & Ancillary Controls",
    sectionRef: "Section 4",
    question:
      "What happens when you pull the Carburettor Heat plunger ON during pre-take-off checks or in flight, and why?",
    options: [
      {
        id: "a",
        label: "Engine RPM increases immediately because extra fuel is injected into the cylinders.",
      },
      {
        id: "b",
        label: "Unfiltered air heated by the exhaust shroud enters the carburettor; because warm air is less dense, engine RPM drops slightly.",
      },
      {
        id: "c",
        label: "The alternator disconnects from the battery bus to save electrical power.",
      },
      {
        id: "d",
        label: "Filtered cold ram air bypasses the throttle butterfly valve to cool the oil radiator.",
      },
    ],
    correctOptionId: "b",
    explanation:
      "Carburettor heat routes unfiltered air through a shroud around the hot exhaust manifold. Because heated air is less dense than cold outside air, the fuel-air mixture becomes slightly richer and engine RPM drops slightly — confirming the hot-air flap is working.",
    misconception:
      "Because carburettor heat air is unfiltered and reduces full power slightly, it is returned to COLD for take-off, go-around, and ground taxying.",
  },
  {
    id: "kc-5",
    number: 5,
    formatLabel: "Fuel System & Contamination Check",
    sectionRef: "Section 5",
    question:
      "When draining a pre-flight fuel sample from the gascolator/wing strainer of an aeroplane fuelled with AVGAS 100LL, how do you identify clean fuel versus water contamination?",
    options: [
      {
        id: "a",
        label: "AVGAS 100LL is dyed pale blue; water is denser than AVGAS and settles as a clear layer at the bottom of the sample cup.",
      },
      {
        id: "b",
        label: "AVGAS 100LL is colourless and sinks below water, which floats on top and is dyed green.",
      },
      {
        id: "c",
        label: "Water dissolves completely into AVGAS 100LL and turns the fuel bright yellow.",
      },
      {
        id: "d",
        label: "Fuel tank vents automatically evaporate any water in the wing tanks before start.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "AVGAS 100LL is dyed pale blue. Because water is heavier (denser) than aviation gasoline, any condensation or water ingress sinks to the lowest sump points (wing drains and gascolator) and appears at the bottom of the tester cup below a distinct meniscus.",
    misconception:
      "If a cup were filled 100% with water, it would look completely clear with no line — always verify both the pale blue colour and smell of AVGAS.",
  },
  {
    id: "kc-6",
    number: 6,
    formatLabel: "Ground Handling & Pre-Flight Law",
    sectionRef: "Section 8, 9 & 10",
    question:
      "During ground taxying and pre-flight preparation in a tricycle-gear training aeroplane, which combination of practices is correct?",
    options: [
      {
        id: "a",
        label: "Steer with the control wheel/yoke like a car and rely on memory instead of a written checklist.",
      },
      {
        id: "b",
        label: "Steer with the lower rudder pedals (using upper toe pedals for braking), verify cockpit flows with the written checklist, and inspect the Technical Log before accepting the aircraft.",
      },
      {
        id: "c",
        label: "Keep your toes pressed on the top of both rudder pedals during the entire take-off roll to keep the nosewheel straight.",
      },
      {
        id: "d",
        label: "Sign the Technical Log only after completing the flight if no defects were noticed.",
      },
    ],
    correctOptionId: "b",
    explanation:
      "On the ground, directional steering is controlled with your feet on the lower rudder pedals while the tops of the pedals actuate the hydraulic toe brakes. Before flight, the commander must inspect the Technical Log (and C of A / ARC) and back up every cockpit flow scan with the written checklist.",
    misconception:
      "Rotating the yoke on the ground moves only the ailerons (for wind correction) — it does not steer the nosewheel.",
  },
];
