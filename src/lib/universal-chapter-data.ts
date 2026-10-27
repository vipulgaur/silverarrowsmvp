import type { LearningChapter, LearningChapterChild } from "./learning-content";
import { figureAssets, type FigureAsset } from "./learning-illustrations";
import type { LearningSection } from "./learning-source";

export interface UniversalGuidedStep {
  step: number;
  id: string;
  tag: string;
  title: string;
  summary: string;
  keyPoints: string[];
  takeaway: string;
  targetSectionId: string;
}

export interface UniversalKeyFact {
  id: string;
  badge: string;
  statement: string;
  detail: string;
  targetSectionId: string;
}

export interface UniversalDistinction {
  id: string;
  title: string;
  leftName: string;
  leftRole: string;
  rightName: string;
  rightRole: string;
  keyDifference: string;
}

export interface UniversalKnowledgeCheckOption {
  id: string;
  label: string;
  text: string;
}

export interface UniversalKnowledgeCheck {
  id: string;
  questionNumber: number;
  question: string;
  options: UniversalKnowledgeCheckOption[];
  correctOptionId: string;
  explanation: string;
  sourceSectionId: string;
  sourceSectionTitle: string;
}

export interface UniversalIllustrationItem {
  id: string;
  title: string;
  caption: string;
  asset?: FigureAsset;
}

export interface UniversalChapterInteractiveData {
  keyFacts: UniversalKeyFact[];
  guidedSteps: UniversalGuidedStep[];
  distinctions: UniversalDistinction[];
  knowledgeChecks: UniversalKnowledgeCheck[];
  illustrations: UniversalIllustrationItem[];
}

// -----------------------------------------------------------------------------
// CURATED DOMAIN DATASETS FOR MAJOR SUBJECTS
// -----------------------------------------------------------------------------

const CURATED_DATASETS: Record<string, Partial<UniversalChapterInteractiveData>> = {
  // Pooley Chapter 2: Preparation for Flight and Action After Flight
  "pooley-chapter-02": {
    keyFacts: [
      {
        id: "kf-p2-1",
        badge: "Airworthiness",
        statement: "ARC and Maintenance Release must be in-date before flight.",
        detail: "The Airworthiness Review Certificate (ARC), Tech Log certificate of release to service (CRS), and insurance must be verified prior to signing out the aircraft.",
        targetSectionId: "section-1",
      },
      {
        id: "kf-p2-2",
        badge: "Fuel Safety",
        statement: "Sample fuel from all tank sumps and the engine gascolator.",
        detail: "Drain a clear sample into a fuel tester, inspect for water globules (water settles to the bottom), sediment, and verify the correct fuel colour (AVGAS 100LL is blue).",
        targetSectionId: "section-2",
      },
      {
        id: "kf-p2-3",
        badge: "Walkaround",
        statement: "Conduct a clockwise external inspection without skipping checklist items.",
        detail: "Verify pitot cover removed, stall warner clear, control surfaces free and correct, propeller free of nicks, and tie-down ropes removed.",
        targetSectionId: "section-3",
      },
      {
        id: "kf-p2-4",
        badge: "Engine Runs",
        statement: "Check magneto drop at 1,700–1,800 RPM and verify carburettor heat drop.",
        detail: "Magneto RPM drop should not exceed 150 RPM per side with maximum 50 RPM differential between LEFT and RIGHT. Carb heat hot should yield an immediate 50–100 RPM drop.",
        targetSectionId: "section-4",
      },
    ],
    guidedSteps: [
      {
        step: 1,
        id: "gs-p2-1",
        tag: "Pre-Flight Planning",
        title: "Documentation, Weather & Weight & Balance",
        summary: "Verify pilot qualifications, medical validity, weather briefing (NOTAMs/METAR/TAF), and calculate takeoff mass and centre of gravity.",
        keyPoints: [
          "Check Certificate of Airworthiness & maintenance release in aircraft tech log",
          "Verify fuel quantity requirements (flight duration + 30 min VFR daytime reserve)",
          "Confirm weight and balance stays within flight envelope throughout flight",
        ],
        takeaway: "Never accept an aircraft without confirming all documentation and performance calculations are legal.",
        targetSectionId: "section-1",
      },
      {
        step: 2,
        id: "gs-p2-2",
        tag: "External Inspection",
        title: "Aircraft Walkaround & Fuel Drains",
        summary: "Systematic physical walkaround around the airframe to inspect structural integrity, flight control hinges, and fluid systems.",
        keyPoints: [
          "Check engine oil level within manufacturer limits (min 5 qts, max 8 qts on C172)",
          "Inspect tyres for wear, tread depth, and proper oleo strut inflation",
          "Drain and inspect fuel from all low-point drain valves; water is heavier than fuel",
        ],
        takeaway: "Water in the fuel is the primary cause of engine failure after takeoff; never fly with unverified fuel.",
        targetSectionId: "section-2",
      },
      {
        step: 3,
        id: "gs-p2-3",
        tag: "Cockpit Checks",
        title: "Internal Pre-Start Checks & Safety Briefing",
        summary: "Cabin passenger briefing, seat and rudder pedal adjustments, flight controls full and free travel, and master switch sequence.",
        keyPoints: [
          "Passenger safety briefing: seatbelts, exits, fire extinguisher, sterile cockpit",
          "Control column full, free and correct movement (look at surfaces moving)",
          "Altimeter set to aerodrome QNH / elevation check within ±20 ft",
        ],
        takeaway: "A disciplined cockpit drill ensures all controls and emergency equipment are verified before engine start.",
        targetSectionId: "section-3",
      },
      {
        step: 4,
        id: "gs-p2-4",
        tag: "Ground Run-Up",
        title: "Engine Magneto & Carburettor Heat Power Checks",
        summary: "Head into the wind, set parking brake, run engine to test ignition systems, carburettor heat function, and suction/alternator output.",
        keyPoints: [
          "Set engine run-up RPM (typically 1,700–1,800 RPM on light singles)",
          "Test Left and Right magnetos: observe clean drop without excessive roughness",
          "Apply carburettor heat: confirm drop, wait for clearing, then return to cold",
        ],
        takeaway: "The run-up verifies ignition redundancy and confirms heated air will clear ice if encountered in flight.",
        targetSectionId: "section-4",
      },
    ],
    distinctions: [
      {
        id: "dist-p2-1",
        title: "AVGAS 100LL vs Jet A-1 Fuel",
        leftName: "AVGAS 100LL",
        leftRole: "Piston Aviation Gasoline",
        rightName: "Jet A-1",
        rightRole: "Kerosene Turbine / Diesel Fuel",
        keyDifference: "AVGAS 100LL is dyed BLUE; Jet A-1 is CLEAR to straw-yellow. Misfuelling a piston engine with Jet A-1 causes catastrophic pre-ignition and engine failure.",
      },
      {
        id: "dist-p2-2",
        title: "Dual Independent Magnetos",
        leftName: "Left Magneto",
        leftRole: "Fires Upper Left & Lower Right Plugs",
        rightName: "Right Magneto",
        rightRole: "Fires Upper Right & Lower Left Plugs",
        keyDifference: "Aircraft magnetos generate their own high-voltage spark mechanically from engine rotation; they are completely independent of the aircraft battery and electrical bus.",
      },
    ],
    knowledgeChecks: [
      {
        id: "kc-p2-1",
        questionNumber: 1,
        question: "What is the primary indicator of water contamination during pre-flight fuel sampling?",
        options: [
          { id: "a", label: "A", text: "Clear globules or bubbles settling to the bottom of the tester" },
          { id: "b", label: "B", text: "A bright green tint across the top of the fuel" },
          { id: "c", label: "C", text: "Fuel evaporating within five seconds from the sampler tube" },
          { id: "d", label: "D", text: "A strong sweet odour from the fuel tester" },
        ],
        correctOptionId: "a",
        explanation: "Water is denser than aviation gasoline and settles at the lowest point of the tank and sampler, appearing as distinct clear globules or a boundary line at the bottom.",
        sourceSectionId: "section-2",
        sourceSectionTitle: "Fuel Quality Checks",
      },
      {
        id: "kc-p2-2",
        questionNumber: 2,
        question: "When carburettor heat is selected to HOT during the engine ground check, what is the expected initial response?",
        options: [
          { id: "a", label: "A", text: "An immediate rise in RPM due to enriched mixture" },
          { id: "b", label: "B", text: "An immediate drop in RPM because hot air is less dense" },
          { id: "c", label: "C", text: "No change in RPM unless severe ice is already present" },
          { id: "d", label: "D", text: "Oil pressure rises above the redline limit" },
        ],
        correctOptionId: "b",
        explanation: "Carburettor heat routes warmer air into the induction system. Hot air is less dense, resulting in a slightly richer mixture and an immediate drop of 50 to 100 RPM.",
        sourceSectionId: "section-4",
        sourceSectionTitle: "Engine Power Checks",
      },
      {
        id: "kc-p2-3",
        questionNumber: 3,
        question: "If the aircraft electrical master switch is turned OFF while the engine is running at cruise power, what happens to the engine?",
        options: [
          { id: "a", label: "A", text: "The engine stops immediately due to spark loss" },
          { id: "b", label: "B", text: "The engine continues running normally because magnetos are engine-driven" },
          { id: "c", label: "C", text: "The starter motor engages automatically" },
          { id: "d", label: "D", text: "The carburettor heat valve shuts permanently" },
        ],
        correctOptionId: "b",
        explanation: "Aircraft piston engine ignition is provided by dual engine-driven magnetos, which generate their own spark independently of the battery and master switch.",
        sourceSectionId: "section-3",
        sourceSectionTitle: "Ignition Systems",
      },
    ],
  },

  // Pooley Chapter 3: Air Experience and Effects of Controls
  "pooley-chapter-03": {
    keyFacts: [
      {
        id: "kf-p3-1",
        badge: "Aerodynamics",
        statement: "Control surface effectiveness increases with indicated airspeed.",
        detail: "Dynamic pressure ($q = \\frac{1}{2}\\rho V^2$) increases with the square of speed; controls feel firm and responsive at high speed and soft/sluggish near stall.",
        targetSectionId: "section-1",
      },
      {
        id: "kf-p3-2",
        badge: "Secondary Effects",
        statement: "The secondary effect of rudder is roll in the direction of yaw.",
        detail: "Yawing causes the outer wing to travel faster than the inner wing, developing more lift and inducing a roll in the direction of the yaw.",
        targetSectionId: "section-2",
      },
      {
        id: "kf-p3-3",
        badge: "Secondary Effects",
        statement: "The secondary effect of ailerons is adverse yaw opposite to the turn.",
        detail: "The downgoing aileron generates more induced drag than the upgoing aileron, yawing the nose temporarily away from the intended turn direction.",
        targetSectionId: "section-3",
      },
      {
        id: "kf-p3-4",
        badge: "Trim Technique",
        statement: "Select desired attitude first with the primary controls, hold it, then trim out loads.",
        detail: "Remember the golden sequence: Power $\\rightarrow$ Attitude $\\rightarrow$ Trim. Never use the trim wheel to change aircraft attitude.",
        targetSectionId: "section-4",
      },
    ],
    guidedSteps: [
      {
        step: 1,
        id: "gs-p3-1",
        tag: "Primary Controls",
        title: "Pitch, Roll & Yaw Authority",
        summary: "Understanding how control surfaces actuate around the aircraft's centre of gravity to control flight path.",
        keyPoints: [
          "Elevator controls pitch around the lateral axis (push forward = nose down, pull back = nose up)",
          "Ailerons control roll around the longitudinal axis (turn wheel right = right wing down)",
          "Rudder controls yaw around the normal/vertical axis (press right pedal = nose swings right)",
        ],
        takeaway: "Primary control surfaces are aerodynamically balanced to give the pilot proportional control feedback.",
        targetSectionId: "section-1",
      },
      {
        step: 2,
        id: "gs-p3-2",
        tag: "Secondary Effects",
        title: "Aileron Adverse Yaw & Rudder Roll Interaction",
        summary: "No control input occurs in isolation; cross-coupling requires pilot coordination to maintain balanced flight.",
        keyPoints: [
          "Adverse yaw: the downgoing aileron creates higher induced drag, yawing the nose opposite the turn",
          "Differential ailerons and coordinated rudder pressure counteract adverse yaw",
          "Rudder yaw accelerates the outside wing, creating higher lift that rolls the aircraft",
        ],
        takeaway: "Fly with feet on the pedals to maintain coordinated, in-balance flight with the slip ball centred.",
        targetSectionId: "section-2",
      },
      {
        step: 3,
        id: "gs-p3-3",
        tag: "Slipstream & Torque",
        title: "Left-Turning Tendencies under High Power",
        summary: "Spiral slipstream, P-factor (asymmetric blade loading), torque reaction, and gyroscopic precession all tend to yaw the aircraft left.",
        keyPoints: [
          "Spiral slipstream wraps around the fuselage and strikes the left side of the vertical fin",
          "P-factor at high angles of attack causes the descending right blade to produce more thrust",
          "Apply positive right rudder pressure during high-power climbs to keep heading constant",
        ],
        takeaway: "Anticipate left yaw whenever adding power or raising the nose, and apply corrective right rudder.",
        targetSectionId: "section-3",
      },
      {
        step: 4,
        id: "gs-p3-4",
        tag: "Trimming Device",
        title: "The Art of Trimming: Power – Attitude – Trim",
        summary: "Trimming relieves steady aerodynamic pressure on the control column so the aeroplane flies hands-off.",
        keyPoints: [
          "Fly the aircraft manually to the desired attitude and wait for airspeed to stabilise",
          "Feel the residual pressure on the yoke (pushing forward or pulling back)",
          "Adjust trim wheel until you can release control pressure without the nose pitching away",
        ],
        takeaway: "Trim is an aerodynamic relief device, not a primary control; never use trim to change attitudes.",
        targetSectionId: "section-4",
      },
    ],
    distinctions: [
      {
        id: "dist-p3-1",
        title: "Primary vs Secondary Effects",
        leftName: "Primary Effect",
        leftRole: "Immediate Motion on Actuated Axis",
        rightName: "Secondary Effect",
        rightRole: "Coupled Motion Induced on Another Axis",
        keyDifference: "Rudder primary effect is yaw about the normal axis; its secondary effect is roll in the direction of yaw due to asymmetric wing velocity.",
      },
      {
        id: "dist-p3-2",
        title: "Aileron Roll vs Rudder Yaw",
        leftName: "Ailerons (Yoke Rotation)",
        leftRole: "Acts about Longitudinal Axis",
        rightName: "Rudder (Foot Pedals)",
        rightRole: "Acts about Normal (Vertical) Axis",
        keyDifference: "Ailerons tilt the total lift vector to bank the aeroplane into a turn; rudder coordinates the turn by aligning the fuselage with the relative airflow.",
      },
    ],
    knowledgeChecks: [
      {
        id: "kc-p3-1",
        questionNumber: 1,
        question: "What is the secondary effect of applying left rudder in level cruising flight?",
        options: [
          { id: "a", label: "A", text: "Roll to the left" },
          { id: "b", label: "B", text: "Pitch up of the nose" },
          { id: "c", label: "C", text: "Roll to the right" },
          { id: "d", label: "D", text: "Pitch down of the nose" },
        ],
        correctOptionId: "a",
        explanation: "Left rudder yaws the nose left. The right wing travels faster through the air than the left wing, generating increased lift that rolls the aircraft to the left.",
        sourceSectionId: "section-2",
        sourceSectionTitle: "Effects of Controls",
      },
      {
        id: "kc-p3-2",
        questionNumber: 2,
        question: "Why do flying controls feel heavy and firm at high speeds, but light and sluggish near stall speed?",
        options: [
          { id: "a", label: "A", text: "Dynamic pressure on control surfaces is proportional to the square of airspeed" },
          { id: "b", label: "B", text: "The autopilot automatically restricts control cable travel" },
          { id: "c", label: "C", text: "Engine oil pressure drops at higher flight speeds" },
          { id: "d", label: "D", text: "The trim tab reverses direction when airspeed exceeds 100 knots" },
        ],
        correctOptionId: "a",
        explanation: "Dynamic pressure ($q = \\frac{1}{2}\\rho V^2$) increases exponentially with airspeed, creating higher aerodynamic resisting force against deflecting control surfaces.",
        sourceSectionId: "section-1",
        sourceSectionTitle: "Control Effectiveness",
      },
    ],
  },

  // Pooley Chapter 4: Taxying and Straight and Level Flight
  "pooley-chapter-04": {
    keyFacts: [
      {
        id: "kf-p4-1",
        badge: "Ground Handling",
        statement: "Always test wheel brakes immediately upon moving off from the apron.",
        detail: "Release parking brake, throttle smoothly open, test both foot brakes to verify stopping authority before building taxying momentum.",
        targetSectionId: "section-1",
      },
      {
        id: "kf-p4-2",
        badge: "Wind Correction",
        statement: "Headwind: Dive into the wind; Tailwind: Dive away from the wind.",
        detail: "Quartering headwind: aileron INTO the wind, elevator neutral. Quartering tailwind: aileron AWAY from wind, elevator FORWARD (down) to prevent tail lift.",
        targetSectionId: "section-1",
      },
      {
        id: "kf-p4-3",
        badge: "Golden Formula",
        statement: "Power + Attitude = Performance.",
        detail: "For any specified power setting and pitch attitude, the aeroplane will settle at one unique airspeed and flight path angle.",
        targetSectionId: "section-3",
      },
      {
        id: "kf-p4-4",
        badge: "Lookout Cycle",
        statement: "Maintain the continuous scan: Attitude – Look-Out – Attitude – Instruments.",
        detail: "Spend 80% of visual attention outside referencing the natural horizon across the engine cowling, confirming with quick instrument cross-checks.",
        targetSectionId: "section-2",
      },
    ],
    guidedSteps: [
      {
        step: 1,
        id: "gs-p4-1",
        tag: "Taxiing Discipline",
        title: "Speed Control, Steering & Brake Verification",
        summary: "Ground speed should not exceed a brisk walking pace; use rudder pedals for nosewheel steering and throttle for speed control.",
        keyPoints: [
          "Do not ride the brakes; use minimum engine power to taxi and short firm brake applications",
          "Test left and right brakes separately to ensure differential braking authority",
          "Hold control column firmly in the correct wind-correction quadrant",
        ],
        takeaway: "Taxi at walking speed; riding the brakes overheats brake pads and risks runway tyre burst.",
        targetSectionId: "section-1",
      },
      {
        step: 2,
        id: "gs-p4-2",
        tag: "Crosswind Taxiing",
        title: "Aileron & Elevator Positioning in Surface Winds",
        summary: "Wind from behind can catch under tail surfaces or wing tips and flip a light aircraft if controls are neutral.",
        keyPoints: [
          "Quartering Headwind: Turn control column INTO the wind (deflects aileron up on windward wing)",
          "Quartering Tailwind: Turn control column AWAY from wind and push forward (tailplane down)",
          "Neutral controls in strong gusts leave the aeroplane vulnerable to weathervaning and tipping",
        ],
        takeaway: "Climb INTO headwinds; Dive AWAY from tailwinds on the ground.",
        targetSectionId: "section-1",
      },
      {
        step: 3,
        id: "gs-p4-3",
        tag: "Cruise Flight",
        title: "Straight & Level at Cruising Power",
        summary: "Establish normal cruising power (e.g. 2,300 RPM), set level pitch attitude against the horizon, verify wings level, and trim out all control forces.",
        keyPoints: [
          "Horizon reference: approximately 4 fingers width between horizon and top of instrument coaming",
          "Wingtip references: verify equal distance between left/right wingtips and the horizon",
          "Altimeter constant, VSI zeroed, heading indicator stable on selected magnetic track",
        ],
        takeaway: "Fix your gaze outside; use the instruments to verify the visual attitude.",
        targetSectionId: "section-2",
      },
      {
        step: 4,
        id: "gs-p4-4",
        tag: "Speed Variations",
        title: "Power + Attitude = Performance",
        summary: "Flying straight and level at different airspeeds requires adjusting pitch attitude to balance lift with weight.",
        keyPoints: [
          "High airspeed (high power): lower pitch attitude required because dynamic pressure is high",
          "Low airspeed (reduced power): higher pitch attitude required (higher angle of attack to maintain lift)",
          "Re-trim accurately after every airspeed or power change once the aircraft stabilises",
        ],
        takeaway: "Power sets the speed; pitch attitude maintains the altitude in level flight.",
        targetSectionId: "section-3",
      },
    ],
    distinctions: [
      {
        id: "dist-p4-1",
        title: "Quartering Headwind vs Tailwind Controls",
        leftName: "Quartering Headwind",
        leftRole: "Aileron INTO wind · Elevator NEUTRAL",
        rightName: "Quartering Tailwind",
        rightRole: "Aileron AWAY from wind · Elevator FORWARD",
        keyDifference: "In a tailwind, wind striking the elevator from behind tends to lift the tail, pushing the nose into the ground unless the elevator is held down.",
      },
      {
        id: "dist-p4-2",
        title: "Visual Reference vs Instrument Scan",
        leftName: "Visual Attitude (80%)",
        leftRole: "Outside Cowling Cut across Horizon",
        rightName: "Instrument Check (20%)",
        rightRole: "Altimeter, VSI, Heading, Ball",
        keyDifference: "Visual attitude provides instantaneous feedback; instruments suffer from minor aerodynamic and gyroscopic lag.",
      },
    ],
    knowledgeChecks: [
      {
        id: "kc-p4-1",
        questionNumber: 1,
        question: "When taxying with a strong wind blowing from the left rear quadrant (left quartering tailwind), how should the controls be positioned?",
        options: [
          { id: "a", label: "A", text: "Control column turned right and pushed fully forward" },
          { id: "b", label: "B", text: "Control column turned left and pulled fully aft" },
          { id: "c", label: "C", text: "Control column centered with elevator held neutral" },
          { id: "d", label: "D", text: "Rudder pedals held fully deflected to the right" },
        ],
        correctOptionId: "a",
        explanation: "In a quartering tailwind, 'dive away' from the wind: turn the control column away from the wind (right) and push forward to deflect the elevator downward, preventing wind from getting under the tail.",
        sourceSectionId: "section-1",
        sourceSectionTitle: "Taxying Principles & Wind Corrections",
      },
      {
        id: "kc-p4-2",
        questionNumber: 2,
        question: "In straight and level flight, if engine power is reduced while maintaining a constant altitude, how must the pitch attitude change?",
        options: [
          { id: "a", label: "A", text: "A higher nose attitude is required to increase angle of attack" },
          { id: "b", label: "B", text: "A lower nose attitude is required to minimize induced drag" },
          { id: "c", label: "C", text: "The pitch attitude remains completely unchanged" },
          { id: "d", label: "D", text: "The aircraft must be placed into a 15-degree bank" },
        ],
        correctOptionId: "a",
        explanation: "As power decreases, airspeed drops. To maintain lift equal to aircraft weight at a lower dynamic pressure, the angle of attack must be increased by raising the nose attitude.",
        sourceSectionId: "section-3",
        sourceSectionTitle: "Straight and Level at Different Airspeeds",
      },
    ],
  },
};

// -----------------------------------------------------------------------------
// INTELLIGENT DYNAMIC FALLBACK DATA GENERATOR
// -----------------------------------------------------------------------------

/**
 * Automatically synthesizes rich interactive components for ANY chapter
 * across ANY module that does not have a manually curated static dataset.
 */
export function getUniversalChapterData(
  chapter: LearningChapter,
  courseKey: string,
): UniversalChapterInteractiveData {
  const lookupKey = `${courseKey}-${chapter.id}`;
  const curated = CURATED_DATASETS[lookupKey] ?? CURATED_DATASETS[chapter.id];

  const sections = chapter.sections.length > 0 ? chapter.sections : [];

  // 1. Guided Steps: from curated data or dynamically from sections
  const guidedSteps: UniversalGuidedStep[] =
    curated?.guidedSteps && curated.guidedSteps.length > 0
      ? (curated.guidedSteps as UniversalGuidedStep[])
      : sections.slice(0, 6).map((sec, i) => {
          const firstBlock = sec.blocks.find((b) => b.type === "markdown");
          const rawText = firstBlock && "text" in firstBlock ? firstBlock.text : "";
          const firstSentence = rawText.split(/[.!?]/)[0] ?? sec.title;
          const cleanSummary =
            firstSentence.length > 20
              ? `${firstSentence.trim()}.`
              : `Core technical mastery of ${sec.title.toLowerCase()}.`;

          return {
            step: i + 1,
            id: `gs-auto-${sec.id}`,
            tag: `Phase ${i + 1}`,
            title: sec.title.replace(/^\d+[\.\s]*/, ""),
            summary: cleanSummary,
            keyPoints: [
              `Examine operational requirements and engineering principles for ${sec.title.toLowerCase()}`,
              `Verify regulatory EASA / Part-FCL standards and aircraft limitations`,
              `Apply standardized cockpit procedures and cross-check flight instruments`,
            ],
            takeaway: `Mastery of ${sec.title.toLowerCase()} is essential for flight safety and checkride success.`,
            targetSectionId: sec.id,
          };
        });

  // 2. Key Facts: from curated data or dynamically from sections
  const keyFacts: UniversalKeyFact[] =
    curated?.keyFacts && curated.keyFacts.length > 0
      ? (curated.keyFacts as UniversalKeyFact[])
      : sections.slice(0, 5).map((sec, i) => {
          const badges = ["Operations", "Safety Critical", "Theory", "Aerodynamics", "Regulations"];
          const cleanTitle = sec.title.replace(/^\d+[\.\s]*/, "");
          return {
            id: `kf-auto-${sec.id}`,
            badge: badges[i % badges.length]!,
            statement: `Standardised procedures apply to ${cleanTitle}.`,
            detail: `Cadets must demonstrate sound airmanship, adherence to manufacturer limitations, and thorough checklist discipline in this area.`,
            targetSectionId: sec.id,
          };
        });

  // 3. Technical Distinctions: from curated or dynamically
  const distinctions: UniversalDistinction[] =
    curated?.distinctions && curated.distinctions.length > 0
      ? (curated.distinctions as UniversalDistinction[])
      : [
          {
            id: "dist-auto-1",
            title: "Normal vs Abnormal Operating Envelope",
            leftName: "Normal Operations",
            leftRole: "Standard Flight Manual Procedures",
            rightName: "Abnormal / Emergency",
            rightRole: "Non-Normal Procedures & QRC Drills",
            keyDifference: "Normal procedures focus on optimal efficiency and standard airmanship; abnormal drills prioritize aircraft stability, power management, and terrain clearance.",
          },
          {
            id: "dist-auto-2",
            title: "Pilot Action vs System Automation",
            leftName: "Manual Pilot Flying",
            leftRole: "Direct Aerodynamic Control",
            rightName: "System Automation",
            rightRole: "Monitored Autopilot / Trim Assistance",
            keyDifference: "Manual inputs require tactile feel and active scan; automation requires rigorous mode awareness and flight director monitoring.",
          },
        ];

  // 4. Knowledge Checks: from curated or dynamically derived
  const knowledgeChecks: UniversalKnowledgeCheck[] =
    curated?.knowledgeChecks && curated.knowledgeChecks.length > 0
      ? (curated.knowledgeChecks as UniversalKnowledgeCheck[])
      : sections.slice(0, 4).map((sec, i) => {
          const cleanTitle = sec.title.replace(/^\d+[\.\s]*/, "");
          return {
            id: `kc-auto-${sec.id}`,
            questionNumber: i + 1,
            question: `Which airmanship principle is paramount when executing procedures in ${cleanTitle}?`,
            options: [
              {
                id: "a",
                label: "A",
                text: `Maintaining positive aircraft control and adhering to approved flight manual checklists`,
              },
              {
                id: "b",
                label: "B",
                text: `Relying solely on memory drills without cross-checking cockpit flight instruments`,
              },
              {
                id: "c",
                label: "C",
                text: `Maximizing airspeed regardless of published operating limitations`,
              },
              {
                id: "d",
                label: "D",
                text: `Omitting the lookout scan whenever operating within controlled airspace`,
              },
            ],
            correctOptionId: "a",
            explanation: `Aviate, Navigate, Communicate: maintaining positive aircraft control and operating within published manufacturer limits is the foundational priority of flight safety.`,
            sourceSectionId: sec.id,
            sourceSectionTitle: cleanTitle,
          };
        });

  // 5. Illustrations and Figures: extracted from section image blocks
  const illustrations: UniversalIllustrationItem[] = [];
  for (const sec of sections) {
    for (const b of sec.blocks) {
      if (b.type === "image" && b.figure) {
        const asset = figureAssets[b.figure.id];
        illustrations.push({
          id: b.figure.id,
          title: b.figure.title ?? b.figure.id,
          caption: b.figure.caption ?? "",
          asset,
        });
      }
    }
  }

  return {
    keyFacts: keyFacts.length > 0 ? keyFacts : [
      {
        id: "kf-fallback-1",
        badge: "Core Knowledge",
        statement: `Theoretical foundation for ${chapter.title}`,
        detail: "Review all chapter syllabus sections thoroughly before proceeding to the knowledge checks.",
        targetSectionId: "section-1",
      },
    ],
    guidedSteps: guidedSteps.length > 0 ? guidedSteps : [
      {
        step: 1,
        id: "gs-fallback-1",
        tag: "Introduction",
        title: chapter.title,
        summary: `Comprehensive study of ${chapter.title} in accordance with Part-FCL theoretical knowledge requirements.`,
        keyPoints: [
          "Study key definitions, structural principles, and operational limits",
          "Review illustrated technical figures and system schematics",
          "Test your knowledge with the chapter review questions",
        ],
        takeaway: "Diligent ground school study directly translates to confident airborne handling.",
        targetSectionId: "section-1",
      },
    ],
    distinctions,
    knowledgeChecks: knowledgeChecks.length > 0 ? knowledgeChecks : [
      {
        id: "kc-fallback-1",
        questionNumber: 1,
        question: `What is the primary objective of studying ${chapter.title}?`,
        options: [
          { id: "a", label: "A", text: "To develop sound theoretical knowledge and operational competence" },
          { id: "b", label: "B", text: "To bypass official flight manual limitations" },
          { id: "c", label: "C", text: "To eliminate the need for practical flight training" },
          { id: "d", label: "D", text: "To increase fuel consumption during cruise flight" },
        ],
        correctOptionId: "a",
        explanation: "Comprehensive ground school theory provides the necessary foundation for safe, competent pilot decision making.",
        sourceSectionId: "section-1",
        sourceSectionTitle: chapter.title,
      },
    ],
    illustrations,
  };
}
