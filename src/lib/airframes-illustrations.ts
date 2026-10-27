import fig0101 from "@/assets/learning/airframes/fig-01-01.png";
import fig0102 from "@/assets/learning/airframes/fig-01-02.png";
import fig0103 from "@/assets/learning/airframes/fig-01-03.png";
import fig0104 from "@/assets/learning/airframes/fig-01-04.png";
import fig0105 from "@/assets/learning/airframes/fig-01-05.png";
import fig0106 from "@/assets/learning/airframes/fig-01-06.png";
import fig0107 from "@/assets/learning/airframes/fig-01-07.png";
import fig0108 from "@/assets/learning/airframes/fig-01-08.png";
import fig0109 from "@/assets/learning/airframes/fig-01-09.png";
import fig0110 from "@/assets/learning/airframes/fig-01-10.png";
import fig0111 from "@/assets/learning/airframes/fig-01-11.png";
import fig0112 from "@/assets/learning/airframes/fig-01-12.png";
import fig0113 from "@/assets/learning/airframes/fig-01-13.png";
import fig0114 from "@/assets/learning/airframes/fig-01-14.png";
import fig0115 from "@/assets/learning/airframes/fig-01-15.png";
import fig0116 from "@/assets/learning/airframes/fig-01-16.png";
import fig0117 from "@/assets/learning/airframes/fig-01-17.png";
import fig0118 from "@/assets/learning/airframes/fig-01-18.png";
import fig0119 from "@/assets/learning/airframes/fig-01-19.png";
import fig0120 from "@/assets/learning/airframes/fig-01-20.png";
import fig0121 from "@/assets/learning/airframes/fig-01-21.png";
import fig0122 from "@/assets/learning/airframes/fig-01-22.png";
import fig0123 from "@/assets/learning/airframes/fig-01-23.png";
import fig0124 from "@/assets/learning/airframes/fig-01-24.png";
import fig0125 from "@/assets/learning/airframes/fig-01-25.png";
import fig0126 from "@/assets/learning/airframes/fig-01-26.png";
import fig0127 from "@/assets/learning/airframes/fig-01-27.png";
import fig0128 from "@/assets/learning/airframes/fig-01-28.png";
import fig0129 from "@/assets/learning/airframes/fig-01-29.png";
import fig01cs251 from "@/assets/learning/airframes/fig-01-cs25-1.png";
import fig01cs252 from "@/assets/learning/airframes/fig-01-cs25-2.png";

import fig0201 from "@/assets/learning/airframes/fig-02-01.png";
import fig0202 from "@/assets/learning/airframes/fig-02-02.png";
import fig0203 from "@/assets/learning/airframes/fig-02-03.png";
import fig0204 from "@/assets/learning/airframes/fig-02-04.png";
import fig0205 from "@/assets/learning/airframes/fig-02-05.png";

import fig0301 from "@/assets/learning/airframes/fig-03-01.png";
import fig0302 from "@/assets/learning/airframes/fig-03-02.png";
import fig0303 from "@/assets/learning/airframes/fig-03-03.png";

import fig0401 from "@/assets/learning/airframes/fig-04-01.png";
import fig0402 from "@/assets/learning/airframes/fig-04-02.png";

import fig0501 from "@/assets/learning/airframes/fig-05-01.png";
import fig0502 from "@/assets/learning/airframes/fig-05-02.png";

import fig0601 from "@/assets/learning/airframes/fig-06-01.png";
import fig0602 from "@/assets/learning/airframes/fig-06-02.png";
import fig0603 from "@/assets/learning/airframes/fig-06-03.png";
import fig0604 from "@/assets/learning/airframes/fig-06-04.png";

import fig1401 from "@/assets/learning/airframes/fig-14-01.png";
import fig1402 from "@/assets/learning/airframes/fig-14-02.png";
import fig1403 from "@/assets/learning/airframes/fig-14-03.png";

import fig1501 from "@/assets/learning/airframes/fig-15-01.png";
import fig1502 from "@/assets/learning/airframes/fig-15-02.png";
import fig1503 from "@/assets/learning/airframes/fig-15-03.png";

import fig1601 from "@/assets/learning/airframes/fig-16-01.png";
import fig1602 from "@/assets/learning/airframes/fig-16-02.png";

import type { FigureAsset, FigurePart } from "@/lib/learning-illustrations";

function defaultParts(
  prefix: string,
  items: Array<[number, number, string, string]>,
): FigurePart[] {
  return items.map(([x, y, label, detail], i) => ({
    id: `${prefix}-p${i + 1}`,
    number: i + 1,
    x,
    y,
    label,
    detail,
  }));
}

export const airframesFigureAssets: Record<string, FigureAsset> = {
  // CHAPTER 1 FIGURES
  "fig-01-01": {
    src: fig0101,
    alt: "Figure 1.1 Tensile Load on Structural Member",
    parts: defaultParts("fig-01-01", [
      [
        12,
        49,
        "Tensile Force (Left Outward Vector)",
        "Axial load pulling outward from the left end of the structural bar, tending to stretch or lengthen the component.",
      ],
      [
        50,
        49,
        "Tie Structural Member",
        "A component specifically designed and dimensioned to withstand tensile forces along its longitudinal axis.",
      ],
      [
        88,
        49,
        "Opposing Tensile Force (Right Vector)",
        "Matching outward tensile load creating uniform axial stress and elongation across the entire cross-section.",
      ],
    ]),
  },
  "fig-01-02": {
    src: fig0102,
    alt: "Figure 1.2 Compressive Load on Structural Member",
    parts: defaultParts("fig-01-02", [
      [
        20,
        49,
        "Compressive Force (Left Inward Vector)",
        "Force pushing inward toward the member center, tending to shorten the component along its axis.",
      ],
      [
        49,
        49,
        "Strut Structural Member",
        "A structural column designed to resist compressive loads. Vulnerable to buckling if the member is slender.",
      ],
      [
        79,
        49,
        "Opposing Compressive Force (Right Vector)",
        "Reactive inward compressive force resulting in compressive stress across the member's cross-sectional area.",
      ],
    ]),
  },
  "fig-01-03": {
    src: fig0103,
    alt: "Figure 1.3 Shear Force in Riveted Lap Joint",
    parts: defaultParts("fig-01-03", [
      [
        14,
        45,
        "Upper Shear Force (Left Vector)",
        "Applied load pulling the upper overlapping sheet leftward along the plane of the structural joint.",
      ],
      [
        50,
        47,
        "Riveted Fastener Joint",
        "The fastener shank is subjected to transverse shearing stress across the interface between the two overlapping plates.",
      ],
      [
        86,
        55,
        "Lower Shear Force (Right Vector)",
        "Opposing force pulling the lower sheet rightward; riveted joints are specifically designed to resist these sliding shear loads.",
      ],
    ]),
  },
  "fig-01-04": {
    src: fig0104,
    alt: "Figure 1.4 Safe-Life and Redundant Load Paths",
    parts: defaultParts("fig-01-04", [
      [
        25,
        35,
        "Primary Structural Member",
        "Main load-bearing member designed to carry normal flight loads and cabin pressurization differential.",
      ],
      [
        50,
        52,
        "Redundant Alternative Load Path",
        "Secondary load path engineered to safely carry redistributed loads should the primary member suffer fatigue failure.",
      ],
      [
        75,
        68,
        "Structural Splice Joint",
        "Multi-element fastener interface preventing complete structural separation if a single element develops a crack.",
      ],
    ]),
  },
  "fig-01-05": {
    src: fig0105,
    alt: "Figure 1.5 Damage Tolerant Fuselage Structure",
    parts: defaultParts("fig-01-05", [
      [
        28,
        32,
        "Tear Straps (Crack Arresters)",
        "Circumferential and longitudinal titanium or composite bands that halt skin crack propagation within a single bay.",
      ],
      [
        55,
        52,
        "Fuselage Circumferential Frame",
        "Transverse ring maintaining fuselage cross-section geometry and carrying hoop tension loads under cabin pressure.",
      ],
      [
        78,
        68,
        "Longitudinal Stringers",
        "Extruded stringers providing multi-element redundancy and stabilizing thin skin panels against shear buckling.",
      ],
    ]),
  },
  "fig-01-06": {
    src: fig0106,
    alt: "Figure 1.6 S-N Fatigue Life Curve",
    parts: defaultParts("fig-01-06", [
      [
        20,
        28,
        "High Stress Amplitude (Low-Cycle Fatigue)",
        "Elevated cyclic stress producing rapid microscopic slip band dislocation and early structural failure.",
      ],
      [
        50,
        54,
        "S-N Fatigue Transition Curve",
        "Characteristic Wöhler curve demonstrating that fatigue life in cycles increases logarithmically as cyclic stress decreases.",
      ],
      [
        80,
        78,
        "Fatigue Limit / Endurance Threshold",
        "Stress level below which the material can withstand an indefinite number of load reversals without crack initiation.",
      ],
    ]),
  },
  "fig-01-07": {
    src: fig0107,
    alt: "Figure 1.7 Corporate Jet Fuselage Stations Elevation",
    parts: defaultParts("fig-01-07", [
      [
        50,
        18,
        "Forward Fuselage Stations (FS 0 Datum)",
        "Station positions measured aft in inches from the reference datum ahead of the aircraft nose.",
      ],
      [
        50,
        48,
        "Central Fuselage & Wing Carry-Through",
        "Fuselage stations locating front and rear wing spar carry-through frames and cabin emergency exits.",
      ],
      [
        50,
        80,
        "Rear Fuselage & Empennage Stations",
        "Aft pressure bulkhead location, rear engine pylon attach frames, and inclined fin station lines.",
      ],
    ]),
  },
  "fig-01-08": {
    src: fig0108,
    alt: "Figure 1.8 Corporate Jet Plan & Water Line References",
    parts: defaultParts("fig-01-08", [
      [
        28,
        28,
        "Fuselage Centreline & Buttock Lines (BL)",
        "Lateral reference planes measuring distance left and right from the vertical plane of aircraft symmetry.",
      ],
      [
        55,
        52,
        "Wing Station 0 & Nacelle Centreline",
        "Spanwise coordinate grid establishing wing rib positions, engine thrust line, and pylon attach fittings.",
      ],
      [
        78,
        78,
        "Water Lines (WL) & Ground Datum",
        "Horizontal reference planes measuring vertical height above an arbitrary reference datum below the wheels.",
      ],
    ]),
  },
  "fig-01-09": {
    src: fig0109,
    alt: "Figure 1.9 Pressurized Fuselage Stress Distribution",
    parts: defaultParts("fig-01-09", [
      [
        28,
        45,
        "Axial (Longitudinal) Stress: σ_axial",
        "Tensile stress along fuselage length produced by internal air pressure against end bulkheads: σ = (p · r) / (2 · t).",
      ],
      [
        62,
        50,
        "Hoop (Circumferential) Stress: σ_hoop",
        "Tensile stress around the skin circumference: σ = (p · r) / t. Hoop stress is twice the magnitude of axial stress.",
      ],
      [
        82,
        28,
        "Cabin Pressure Differential (ΔP)",
        "The difference between internal cabin pressure and external ambient atmospheric pressure at high cruising altitudes.",
      ],
    ]),
  },
  "fig-01-10": {
    src: fig0110,
    alt: "Figure 1.10 Auster Welded Tubular Steel Truss Framework",
    parts: defaultParts("fig-01-10", [
      [
        22,
        48,
        "Welded Steel Longerons",
        "Four main longitudinal steel tubes running the length of the fuselage, carrying overall bending moments.",
      ],
      [
        52,
        42,
        "Diagonal Truss Bracing Struts",
        "Tubular struts welded into triangular Warren truss arrangements to resist torsional and shear loads.",
      ],
      [
        78,
        35,
        "Fuselage Joint Clusters",
        "Welded steel clusters where longerons and struts converge, distributing landing gear and empennage reactions.",
      ],
    ]),
  },
  "fig-01-11": {
    src: fig0111,
    alt: "Figure 1.11 Monocoque Fuselage Construction",
    parts: defaultParts("fig-01-11", [
      [
        35,
        45,
        "Heavy Structural Skin",
        "Thick outer skin shell designed to carry all tensile, compressive, shear, and torsional loads without internal stringers.",
      ],
      [
        65,
        48,
        "Lightweight Transverse Formers",
        "Rings that maintain the aerodynamic circular cross-section but provide minimal longitudinal load capacity.",
      ],
      [
        85,
        25,
        "Damage Sensitivity",
        "Any surface dent, crack, or puncture severely degrades monocoque load capacity, posing a risk of rapid buckling.",
      ],
    ]),
  },
  "fig-01-12": {
    src: fig0112,
    alt: "Figure 1.12 Semi-Monocoque Stressed-Skin Construction",
    parts: defaultParts("fig-01-12", [
      [
        30,
        35,
        "Thin Aerodynamic Skin",
        "Lightweight alloy skin carrying shear and cabin pressurization hoop tension while creating a smooth aerodynamic contour.",
      ],
      [
        52,
        50,
        "Longitudinal Stringers",
        "Extruded stiffeners running spanwise to absorb axial tension/compression and prevent skin panels from buckling.",
      ],
      [
        75,
        62,
        "Transverse Frames and Formers",
        "Circumferential rings that give the fuselage its shape and distribute concentrated point loads into the skin shell.",
      ],
    ]),
  },
  "fig-01-13": {
    src: fig0113,
    alt: "Figure 1.13 Longeron Beam Cross-Section Profiles",
    parts: defaultParts("fig-01-13", [
      [
        25,
        35,
        "I-Beam & Channel Sections",
        "High moment of inertia profiles used where large bending moments or heavy floor attachments occur.",
      ],
      [
        50,
        50,
        "Angle & T-Section Booms",
        "Compact structural extrusions offering high compressive stiffness along skin splices and longerons.",
      ],
      [
        75,
        65,
        "Top-Hat & Z-Section Stringers",
        "Formed and extruded stiffeners offering optimal strength-to-weight ratio for stabilizing thin fuselage skins.",
      ],
    ]),
  },
  "fig-01-14": {
    src: fig0114,
    alt: "Figure 1.14 Fuselage Transverse Frame Ring",
    parts: defaultParts("fig-01-14", [
      [
        25,
        45,
        "Outer Skin Attachment Flange",
        "Perimeter flange riveted directly to the fuselage skin, preventing skin distortion under aerodynamic suction.",
      ],
      [
        50,
        25,
        "Stringer Mouse-Hole Cutouts",
        "Precision cutouts along the outer edge allowing longitudinal stringers to pass continuously through the frame.",
      ],
      [
        50,
        75,
        "Inner Flange & Stiffened Web",
        "Deep annular web resisting in-plane ovalization caused by floor loading and pressurization forces.",
      ],
    ]),
  },
  "fig-01-15": {
    src: fig0115,
    alt: "Figure 1.15 Fuselage Pressure Bulkhead",
    parts: defaultParts("fig-01-15", [
      [
        50,
        25,
        "Transverse Pressure Diaphragm",
        "Solid pressure-tight web sealing the pressurized cabin from unpressurized nose, tail, or gear bays.",
      ],
      [
        35,
        55,
        "Reinforced Doorway Opening",
        "Access opening reinforced with heavy perimeter doublers to redistribute membrane hoop tension smoothly.",
      ],
      [
        75,
        60,
        "Perimeter Ring Attachment Joint",
        "Multi-row fastener attachment sealing the bulkhead to the fuselage skin and heavy carry-through frame.",
      ],
    ]),
  },
  "fig-01-16": {
    src: fig0116,
    alt: "Figure 1.16 Aircraft Cabin Floor Crossbeam",
    parts: defaultParts("fig-01-16", [
      [
        25,
        45,
        "Transverse Floor Crossbeam",
        "Heavy-duty beam spanning across the fuselage frames to support passenger seats, galleys, and floor panels.",
      ],
      [
        50,
        65,
        "Diagonal Floor Struts",
        "Diagonal support struts transmitting passenger floor loads downward into the lower fuselage frames.",
      ],
      [
        75,
        40,
        "Frame Attach Fitting",
        "Moment-relief pinned fitting connecting the crossbeam ends to the fuselage circumferential frame ring.",
      ],
    ]),
  },
  "fig-01-17": {
    src: fig0117,
    alt: "Figure 1.17 Fuselage Doubler Plate Reinforcement",
    parts: defaultParts("fig-01-17", [
      [
        32,
        38,
        "Fuselage Skin Opening Cutout",
        "Window or access door cutout in the skin where stress concentrations (K_t) naturally develop.",
      ],
      [
        52,
        48,
        "Reinforcing Doubler Plate",
        "Auxiliary sheet bonded or riveted around the cutout to restore structural thickness and disperse hoop stress.",
      ],
      [
        72,
        62,
        "Staggered Rivet Fastener Pattern",
        "Multi-row fastener grid transferring shear and membrane loads progressively into surrounding stringers.",
      ],
    ]),
  },
  "fig-01-18": {
    src: fig0118,
    alt: "Figure 1.18 Stressed-Skin Fuselage Barrel Assembly",
    parts: defaultParts("fig-01-18", [
      [
        30,
        35,
        "Upper Passenger Deck",
        "Pressurized cabin cylinder containing seating tracks, overhead stowage bins, and side linings.",
      ],
      [
        50,
        55,
        "Lower Cargo Compartment & Venting",
        "Underfloor cargo hold equipped with pressure blowout panels to protect floor structure during rapid decompression.",
      ],
      [
        75,
        65,
        "Frame-Stringer Orthogonal Grid",
        "Interlocked structural grid supporting the stressed skin against aerodynamic bending and cabin pressurization.",
      ],
    ]),
  },
  "fig-01-19": {
    src: fig0119,
    alt: "Figure 1.19 Flight Deck Windows & Direct Vision Window",
    parts: defaultParts("fig-01-19", [
      [
        28,
        45,
        "Impact-Resistant Electrically Heated Windshield",
        "Laminated glass/vinyl windscreen heated with transparent conductive gold film for anti-icing and bird-strike elasticity.",
      ],
      [
        58,
        52,
        "Direct Vision (DV) Sliding Window",
        "Sliding side window operable in flight to provide clear forward vision if the main windshield is obscured or iced.",
      ],
      [
        78,
        35,
        "Heavy Windshield Posts & Frame",
        "Rigid structural posts carrying fuselage cabin pressure hoop tension and resisting 4-lb bird impact at V_C.",
      ],
    ]),
  },
  "fig-01-20": {
    src: fig0120,
    alt: "Figure 1.20 Biplane Wing Structure",
    parts: defaultParts("fig-01-20", [
      [
        30,
        25,
        "Upper Mainplane",
        "Upper lifting surface anchoring interplane struts and providing significant lift at slow airspeeds.",
      ],
      [
        50,
        48,
        "Interplane Struts & Bracing Wires",
        "Rigid vertical struts and crossed diagonal steel wires creating a rigid Pratt truss box with high torsional stiffness.",
      ],
      [
        70,
        75,
        "Lower Mainplane & Fuselage Root",
        "Lower wing attached directly to fuselage bottom longerons, carrying landing gear reaction loads.",
      ],
    ]),
  },
  "fig-01-21": {
    src: fig0121,
    alt: "Figure 1.21 Braced Monoplane Configuration",
    parts: defaultParts("fig-01-21", [
      [
        45,
        28,
        "High-Mounted Wing",
        "Straight wing mounted atop the fuselage, providing high pendulum lateral stability and good downward visibility.",
      ],
      [
        28,
        62,
        "External Lift Strut (Tension Member)",
        "Diagonal streamlined strut transferring aerodynamic lift directly to the lower fuselage, relieving wing root bending.",
      ],
      [
        75,
        70,
        "Fuselage Strut Anchor Fitting",
        "Heavy forged fitting anchoring the lower end of the lift strut to the main carry-through bulkhead.",
      ],
    ]),
  },
  "fig-01-22": {
    src: fig0122,
    alt: "Figure 1.22 Cantilever Monoplane Wing",
    parts: defaultParts("fig-01-22", [
      [
        35,
        35,
        "Clean Aerodynamic Wing",
        "Cantilever wing with zero external drag-producing struts or wires; internal spars carry all structural loads.",
      ],
      [
        65,
        45,
        "Maximum Wing Root Bending Moment",
        "Point of greatest structural bending stress where wing joins the central fuselage carry-through box.",
      ],
      [
        82,
        58,
        "Tapered Wing Tip",
        "Thinned aerofoil section matching the reduced aerodynamic bending moment toward the tip.",
      ],
    ]),
  },
  "fig-01-23": {
    src: fig0123,
    alt: "Figure 1.23 Typical Wing Spar Beam Sections",
    parts: defaultParts("fig-01-23", [
      [
        25,
        30,
        "Upper Spar Cap / Boom",
        "Extruded alloy flange subjected to heavy compressive stress during positive-G flight manoeuvres.",
      ],
      [
        50,
        50,
        "Shear Web Plate",
        "Vertical web plate designed to withstand vertical aerodynamic shear loads without diagonal shear buckling.",
      ],
      [
        75,
        70,
        "Lower Spar Cap / Boom",
        "Extruded flange subjected to high tensile stress during normal flight; prime inspection zone for fatigue cracks.",
      ],
    ]),
  },
  "fig-01-24": {
    src: fig0124,
    alt: "Figure 1.24 Wing Torsion Box Structure",
    parts: defaultParts("fig-01-24", [
      [
        28,
        32,
        "Front & Rear Main Spars",
        "Twin vertical shear webs establishing the closed structural torque box and resisting wing bending.",
      ],
      [
        55,
        52,
        "Upper & Lower Stressed Skin",
        "Thick machined skin with integral stringers completing the closed cell that resists aerodynamic twisting moments.",
      ],
      [
        78,
        68,
        "Chordwise Ribs & Wet-Wing Fuel Bay",
        "Transverse ribs defining camber profile, preventing spar buckling, and baffling fuel movement inside integral tanks.",
      ],
    ]),
  },
  "fig-01-25": {
    src: fig0125,
    alt: "Figure 1.25 Tailplane & Fin Empennage Arrangements",
    parts: defaultParts("fig-01-25", [
      [
        25,
        35,
        "Conventional Tail Unit",
        "Fuselage-mounted horizontal tailplane and vertical fin; provides lowest structural weight and simple control routing.",
      ],
      [
        50,
        25,
        "T-Tail Configuration",
        "Tailplane mounted atop the vertical fin; clear of wing downwash but susceptible to deep stall at high angles of attack.",
      ],
      [
        75,
        65,
        "Cruciform & V-Tail Arrangements",
        "Cruciform mid-fin mount or butterfly V-tail combining elevator and rudder functions into dual ruddervator surfaces.",
      ],
    ]),
  },
  "fig-01-26": {
    src: fig0126,
    alt: "Figure 1.26 Empennage Structural Assembly",
    parts: defaultParts("fig-01-26", [
      [
        32,
        35,
        "Vertical Fin & Directional Rudder",
        "Cantilever vertical aerofoil providing weathercock directional stability, hinged to rudder for yaw control.",
      ],
      [
        62,
        48,
        "Horizontal Stabilizer & Elevator",
        "Longitudinal stability surface carrying tail downforce, hinged to elevator for pilot pitch attitude control.",
      ],
      [
        78,
        68,
        "Elevator Trim Tab & Actuator",
        "Auxiliary trailing-edge tab adjusted to aerodynamically relieve pilot control column stick forces in trim.",
      ],
    ]),
  },
  "fig-01-27": {
    src: fig0127,
    alt: "Figure 1.27 Sandwich Composite Panel Construction",
    parts: defaultParts("fig-01-27", [
      [
        30,
        30,
        "Upper Facing Sheet",
        "High-strength aluminium alloy or carbon-fibre skin carrying in-plane tensile and compressive bending stresses.",
      ],
      [
        52,
        52,
        "Honeycomb / Foam Core",
        "Lightweight aluminium or Nomex hexagonal honeycomb core providing high shear stiffness and spacing the facings.",
      ],
      [
        75,
        70,
        "Adhesive Bond Line & Lower Facing",
        "Structural epoxy adhesive film bonding core to face sheets, delivering exceptional bending stiffness-to-weight ratio.",
      ],
    ]),
  },
  "fig-01-28": {
    src: fig0128,
    alt: "Figure 1.28 Oxidation Rate and Protective Oxide Film",
    parts: defaultParts("fig-01-28", [
      [
        22,
        35,
        "Initial Rapid Oxidation Rate",
        "Fresh metal exposure immediately forms a microscopic aluminium oxide (Al₂O₃) layer on the surface.",
      ],
      [
        50,
        55,
        "Passivation Plateau (Protective Film)",
        "The tough oxide layer becomes self-limiting, sealing the metal beneath and halting progressive corrosion.",
      ],
      [
        78,
        75,
        "Linear Rust Flaking (Iron / Non-Passivating)",
        "In ferrous metals, rust flakes off continuously, exposing fresh metal and producing deep structural degradation.",
      ],
    ]),
  },
  "fig-01-29": {
    src: fig0129,
    alt: "Figure 1.29 Maximum Zero Fuel Mass (MZFM) Wing Bending Relief",
    parts: defaultParts("fig-01-29", [
      [
        28,
        45,
        "Aerodynamic Wing Lift Vector",
        "Upward lift acting through wing centers of pressure, causing upward wing bending during flight.",
      ],
      [
        52,
        55,
        "Wing Fuel Inertia Relief",
        "Fuel mass in wing tanks exerts downward inertia directly opposed to lift, significantly reducing wing root bending moment.",
      ],
      [
        78,
        65,
        "Maximum Zero Fuel Mass (MZFM) Limit",
        "Maximum allowable aircraft weight without usable fuel in wing tanks; protects wing root spars from fuselage payload overload.",
      ],
    ]),
  },
  "fig-01-cs25-1": {
    src: fig01cs251,
    alt: "Figure 1 EASA CS-25 Safety Objective: Probability vs Severity",
    parts: defaultParts("fig-01-cs25-1", [
      [
        30,
        68,
        "Acceptable Safety Operating Region",
        "Permitted operating zone below the descending diagonal boundary where failure probabilities meet safety standards.",
      ],
      [
        50,
        50,
        "Descending Boundary Line",
        "Fundamental airworthiness principle: as failure severity increases from Minor to Catastrophic, probability must decrease.",
      ],
      [
        72,
        32,
        "Prohibited Unacceptable Safety Region",
        "Zone where serious or hazardous failure conditions occur with intolerable frequency; prohibited by CS 25.1309.",
      ],
    ]),
  },
  "fig-01-cs25-2": {
    src: fig01cs252,
    alt: "Figure 2 CS-25 Failure Effects & Probability Classification Matrix",
    parts: defaultParts("fig-01-cs25-2", [
      [
        25,
        35,
        "Minor & Major Failure Condition Criteria",
        "Minor (< 10⁻³ per hr): slight workload increase. Major (< 10⁻⁵ per hr): significant workload increase or physical discomfort.",
      ],
      [
        55,
        55,
        "Hazardous Failure Condition Criteria (< 10⁻⁷ per hr)",
        "Large reduction in safety margins; severe physical distress or excessive crew workload; possible serious passenger injuries.",
      ],
      [
        82,
        75,
        "Catastrophic Failure Condition Criteria (< 10⁻⁹ per hr)",
        "Extremely improbable objective; multiple fatalities or hull loss. Must demonstrate that NO single failure causes catastrophe.",
      ],
    ]),
  },

  // CHAPTER 2: BASIC HYDRAULICS
  "fig-02-01": {
    src: fig0201,
    alt: "Figure 2.1 Hydrostatic Head and Liquid Pressure",
    parts: defaultParts("fig-02-01", [
      [
        30,
        30,
        "Liquid Head Column (h)",
        "Vertical fluid column creating hydrostatic pressure P = ρ · g · h.",
      ],
      [
        50,
        65,
        "Base Pressure Area",
        "Hydrostatic pressure exerts equal force in all directions on container walls.",
      ],
      [
        75,
        45,
        "Shape Independence",
        "Pressure depends solely on depth and liquid density, not on container volume or geometry.",
      ],
    ]),
  },
  "fig-02-02": {
    src: fig0202,
    alt: "Figure 2.2 Pascal's Principle of Pressure Transmission",
    parts: defaultParts("fig-02-02", [
      [
        25,
        35,
        "Input Force (F1)",
        "Force applied to the input plunger creating uniform hydraulic pressure: P = F1 / A1.",
      ],
      [
        50,
        55,
        "Incompressible Liquid",
        "Confined fluid transmitting applied pressure instantly throughout the system.",
      ],
      [
        75,
        40,
        "Pressure Transmission Vectors",
        "Pressure acts with equal force on all equal areas of the interior vessel boundary.",
      ],
    ]),
  },
  "fig-02-03": {
    src: fig0203,
    alt: "Figure 2.3 The Bramah Press Principle",
    parts: defaultParts("fig-02-03", [
      [
        25,
        45,
        "Small Input Plunger (A1)",
        "Small cross-sectional area where manual or mechanical input force is applied.",
      ],
      [
        50,
        50,
        "Transmission Fluid Line",
        "Hydraulic line transferring high pressure directly between cylinder chambers.",
      ],
      [
        75,
        35,
        "Large Output Ram (A2)",
        "Output force multiplied by ratio A2 / A1, while ram travel distance decreases proportionately.",
      ],
    ]),
  },
  "fig-02-04": {
    src: fig0204,
    alt: "Figure 2.4 Typical Light Aircraft Braking Circuit",
    parts: defaultParts("fig-02-04", [
      [
        25,
        35,
        "Toe Brake Master Cylinder",
        "Cockpit pedal cylinder displacing hydraulic fluid directly to the wheel brake.",
      ],
      [
        50,
        55,
        "Flexible Hydraulic Line",
        "Reinforced high-pressure hose routed down the landing gear leg.",
      ],
      [
        75,
        65,
        "Disc Caliper & Slave Piston",
        "Hydraulic cylinder squeezing friction pads against the rotating wheel disc.",
      ],
    ]),
  },
  "fig-02-05": {
    src: fig0205,
    alt: "Figure 2.5 Basic Active Hydraulic System Architecture",
    parts: defaultParts("fig-02-05", [
      [
        20,
        30,
        "Fluid Reservoir",
        "Maintains fluid reserve, accommodates thermal expansion, and de-aerates returning fluid.",
      ],
      [
        50,
        45,
        "Engine Pump & 4-Way Selector Valve",
        "Generates ~3,000 psi system pressure and directs fluid to extension or retraction ports.",
      ],
      [
        80,
        60,
        "Double-Acting Hydraulic Actuator",
        "Hydraulic ram providing powered linear motion in both extend and retract directions.",
      ],
    ]),
  },

  // CHAPTER 3: LANDING GEAR
  "fig-03-01": {
    src: fig0301,
    alt: "Figure 3.1 Oleo-Pneumatic Shock Absorber Strut",
    parts: defaultParts("fig-03-01", [
      [
        50,
        25,
        "Compressed Nitrogen Gas Chamber",
        "Pneumatic cushion acting as a spring to absorb aircraft landing impact and taxi loads.",
      ],
      [
        50,
        55,
        "Metering Pin and Orifice Plate",
        "Tapered metering pin throttling oil flow to convert kinetic landing energy into heat.",
      ],
      [
        50,
        80,
        "Hydraulic Fluid & Torque Links",
        "Hydraulic oil providing damping and scissors torque links preventing cylinder rotation.",
      ],
    ]),
  },
  "fig-03-02": {
    src: fig0302,
    alt: "Figure 3.2 Main Landing Gear Assembly",
    parts: defaultParts("fig-03-02", [
      [
        28,
        35,
        "Side Brace & Drag Strut",
        "Diagonal structural linkages carrying horizontal braking drag and side ground loads.",
      ],
      [
        52,
        52,
        "Main Oleo Strut",
        "Primary shock absorber strut attached to wing carry-through box.",
      ],
      [
        76,
        70,
        "Retraction Actuator & Mechanical Uplock",
        "Hydraulic cylinder that pulls the gear inward, locking onto mechanical uplock hook.",
      ],
    ]),
  },
  "fig-03-03": {
    src: fig0303,
    alt: "Figure 3.3 Nose Landing Gear & Steering Mechanism",
    parts: defaultParts("fig-03-03", [
      [
        30,
        30,
        "Steering Tiller Linkage",
        "Cockpit steering command input providing up to ±70° low-speed steering control.",
      ],
      [
        52,
        50,
        "Steering Actuator Cylinders",
        "Dual push-pull hydraulic pistons rotating the nose gear leg via rack and pinion.",
      ],
      [
        75,
        68,
        "Centring Cam & Shimmy Damper",
        "Cam mechanism centring the nosewheel before bay entry and damping high-speed shimmy.",
      ],
    ]),
  },

  // CHAPTER 4: AIRCRAFT WHEELS
  "fig-04-01": {
    src: fig0401,
    alt: "Figure 4.1 Loose Flange Wheel Assembly",
    parts: defaultParts("fig-04-01", [
      [
        30,
        35,
        "Detachable Outer Flange",
        "Removable rim flange allowing tyre bead mounting without stretching tyre plies.",
      ],
      [
        50,
        50,
        "Wheel Hub & Roller Bearing Cup",
        "Forged aluminium alloy hub housing tapered roller bearings and grease seals.",
      ],
      [
        75,
        65,
        "Locking Ring Channel",
        "Retaining channel that locks detachable flange firmly against tyre bead pressure.",
      ],
    ]),
  },
  "fig-04-02": {
    src: fig0402,
    alt: "Figure 4.2 Divided Wheel & Fusible Thermal Plug",
    parts: defaultParts("fig-04-02", [
      [
        30,
        35,
        "Split Hub Halves (Inner & Outer)",
        "Two matched wheel halves clamped together by high-strength cadmium-plated tie bolts.",
      ],
      [
        55,
        52,
        "Eutectic Fusible Plug",
        "Thermal safety plug melting at ~177°C during brake overheating to prevent explosive tyre blowout.",
      ],
      [
        75,
        68,
        "Tubeless Sealing O-Ring",
        "Elastomeric O-ring sealing the joint between hub halves against high tyre inflation pressures.",
      ],
    ]),
  },

  // CHAPTER 5: AIRCRAFT TYRES
  "fig-05-01": {
    src: fig0501,
    alt: "Figure 5.1 Aircraft Tyre Internal Cross-Section",
    parts: defaultParts("fig-05-01", [
      [
        28,
        35,
        "Tread Pattern & Breaker Plies",
        "Specially compounded natural rubber tread with circumferential rain dispersal grooves.",
      ],
      [
        50,
        55,
        "Carcass Cord Plies",
        "Multiple diagonal or radial nylon cord layers designed to withstand high landing shock loads.",
      ],
      [
        78,
        70,
        "High-Tensile Steel Bead Coils",
        "Bundles of high-tensile steel wire anchoring the tyre firmly onto the wheel rim seat.",
      ],
    ]),
  },
  "fig-05-02": {
    src: fig0502,
    alt: "Figure 5.2 Tyre Tread Regions & Wear Markers",
    parts: defaultParts("fig-05-02", [
      [
        30,
        40,
        "Circumferential Tread Ribs",
        "Parallel ribs providing directional stability and resisting dynamic hydroplaning.",
      ],
      [
        50,
        55,
        "Tread Wear Indicators (TWI)",
        "Moulded indicator depth marks signifying when tyre must be removed for retreading.",
      ],
      [
        75,
        70,
        "Nosewheel Water Chine",
        "Deflector ridge deflecting surface water spray sideways away from rear-mounted engine intakes.",
      ],
    ]),
  },

  // CHAPTER 6: AIRCRAFT BRAKES
  "fig-06-01": {
    src: fig0601,
    alt: "Figure 6.1 Multi-Plate Disc Brake Unit",
    parts: defaultParts("fig-06-01", [
      [
        28,
        35,
        "Hydraulic Actuating Pistons",
        "Multiple hydraulic pistons clamping the interleaved disc stack under pedal pressure.",
      ],
      [
        52,
        52,
        "Rotors and Stator Plates",
        "Alternating rotating steel/carbon discs keyed to wheel and stationary discs keyed to axle.",
      ],
      [
        78,
        68,
        "Torque Tube & Back Plate",
        "Transfers braking reaction torque directly to landing gear shock strut structure.",
      ],
    ]),
  },
  "fig-06-02": {
    src: fig0602,
    alt: "Figure 6.2 Brake Automatic Clearance Adjuster",
    parts: defaultParts("fig-06-02", [
      [
        30,
        35,
        "Piston Return Springs",
        "Pulls pistons back when pressure is released, maintaining correct disc running clearance.",
      ],
      [
        52,
        52,
        "Friction Collet & Pin",
        "Advances gradually as friction lining wears down, keeping pedal travel and response constant.",
      ],
      [
        75,
        68,
        "Running Clearance Gap",
        "Prevents brake dragging, minimizes heat build-up, and ensures instant braking onset.",
      ],
    ]),
  },
  "fig-06-03": {
    src: fig0603,
    alt: "Figure 6.3 Brake Wear Indicator Pin",
    parts: defaultParts("fig-06-03", [
      [
        30,
        35,
        "Protruding Wear Pin",
        "Spring-loaded mechanical pin extending from the front pressure plate.",
      ],
      [
        50,
        55,
        "Brake Applied Inspection",
        "Wear pin length must be verified while hydraulic parking brake is fully APPLIED.",
      ],
      [
        75,
        70,
        "Flush Replacement Datum",
        "When pin becomes flush with the guide bushing, the brake disc stack is worn to limit.",
      ],
    ]),
  },
  "fig-06-04": {
    src: fig0604,
    alt: "Figure 6.4 Anti-Skid Brake Modulating Circuit",
    parts: defaultParts("fig-06-04", [
      [
        25,
        35,
        "Axle Wheel Speed Transducer",
        "Magnetic sensor measuring wheel deceleration to detect rapid onset of tyre skidding.",
      ],
      [
        50,
        50,
        "Anti-Skid Electronic Controller",
        "Compares individual wheel speed to aircraft ground reference velocity.",
      ],
      [
        75,
        65,
        "Anti-Skid Servo Return Valve",
        "Releases brake line pressure in milliseconds to restore wheel rotation, maximizing friction.",
      ],
    ]),
  },

  // CHAPTER 14: SMOKE DETECTION
  "fig-14-01": {
    src: fig1401,
    alt: "Figure 14.1 Aircraft Smoke Detector Locations",
    parts: defaultParts("fig-14-01", [
      [
        25,
        35,
        "Avionics Equipment Bay",
        "Monitors cooling extract ducting for electrical smoke or overheated circuit cards.",
      ],
      [
        50,
        55,
        "Cargo Hold Ceiling Detectors",
        "Dual-loop optical detectors monitoring forward and aft pressurized cargo holds.",
      ],
      [
        75,
        65,
        "Lavatory Smoke Sensors",
        "Ceiling ionization sensors providing early detection of passenger cabin cigarette smoke.",
      ],
    ]),
  },
  "fig-14-02": {
    src: fig1402,
    alt: "Figure 14.2 Optical Light-Refraction Smoke Detector",
    parts: defaultParts("fig-14-02", [
      [
        28,
        35,
        "Infra-Red LED Source",
        "Beams light across optical sampling chamber into a light absorption trap.",
      ],
      [
        52,
        52,
        "Sampling Labyrinth Chamber",
        "Allows smoke particles to circulate freely while blocking ambient stray cabin light.",
      ],
      [
        78,
        68,
        "Photo-Transistor Receiver (90°)",
        "Positioned at right angle; detects refracted light scattered by smoke particles.",
      ],
    ]),
  },
  "fig-14-03": {
    src: fig1403,
    alt: "Figure 14.3 Ionization Type Smoke Detector",
    parts: defaultParts("fig-14-03", [
      [
        30,
        35,
        "Americium-241 Alpha Source",
        "Radioactive source ionising air molecules inside the chamber to produce a steady ion current.",
      ],
      [
        50,
        55,
        "Ionisation Chamber",
        "Smoke particles enter and attach to ions, reducing current flow across electrodes.",
      ],
      [
        75,
        70,
        "Current Drop Alarm Trigger",
        "Electronic comparator senses current reduction and activates cockpit fire/smoke warning.",
      ],
    ]),
  },

  // CHAPTER 15: FIRE DETECTION & PROTECTION
  "fig-15-01": {
    src: fig1501,
    alt: "Figure 15.1 The Fire Triangle (Aviation)",
    parts: defaultParts("fig-15-01", [
      [
        28,
        35,
        "Fuel Source",
        "Aviation kerosene, hydraulic oil, engine lubricating oil, or structural composites.",
      ],
      [
        52,
        52,
        "Oxygen Supply",
        "Atmospheric air or engine compressor bleed air feeding the combustion process.",
      ],
      [
        78,
        68,
        "Ignition Heat Source",
        "High-temperature turbine casing, exhaust ducting, friction, or electrical sparking.",
      ],
    ]),
  },
  "fig-15-02": {
    src: fig1502,
    alt: "Figure 15.2 Continuous Fire Wire Loop (Kidde / Fenwal)",
    parts: defaultParts("fig-15-02", [
      [
        30,
        35,
        "Stainless Steel Outer Tube",
        "Continuous flexible tube routed through designated high-risk engine fire zones.",
      ],
      [
        52,
        52,
        "Semiconductor / Ceramic Core",
        "Resistance drops sharply when localized temperature exceeds pre-set alarm threshold.",
      ],
      [
        75,
        68,
        "Central Conductor Wire",
        "Carries sensing current monitored by dual-channel fire detection control unit.",
      ],
    ]),
  },
  "fig-15-03": {
    src: fig1503,
    alt: "Figure 15.3 Engine Fire Extinguisher Discharge Bottle & Squib",
    parts: defaultParts("fig-15-03", [
      [
        25,
        35,
        "Halon Fire Extinguisher Bottle",
        "Spherical steel container filled with Halon 1301 pressurized by nitrogen gas.",
      ],
      [
        50,
        55,
        "Electrically Fired Squib (Cartridge)",
        "Pyrotechnic detonator triggered from cockpit discharge switch to pierce disc diaphragm.",
      ],
      [
        75,
        65,
        "Discharge Manifold & Nozzles",
        "Distributes Halon spray rings throughout the engine power section and accessory gearbox.",
      ],
    ]),
  },

  // CHAPTER 16: AIRCRAFT FUEL SYSTEMS
  "fig-16-01": {
    src: fig1601,
    alt: "Figure 16.1 Single-Engine Gravity-Feed Fuel System",
    parts: defaultParts("fig-16-01", [
      [
        30,
        30,
        "High-Wing Fuel Tanks",
        "Wing tanks positioned above engine providing positive hydrostatic gravity head pressure.",
      ],
      [
        50,
        55,
        "Fuel Tank Selector Valve",
        "Rotary valve allowing pilot to feed from LEFT, RIGHT, BOTH, or shut OFF completely.",
      ],
      [
        75,
        70,
        "Gascolator & Low-Point Drain",
        "Fuel strainer bowl for pre-flight water sampling and sediment separation.",
      ],
    ]),
  },
  "fig-16-02": {
    src: fig1602,
    alt: "Figure 16.2 Modern Jet Transport Aircraft Fuel System",
    parts: defaultParts("fig-16-02", [
      [
        25,
        35,
        "Main Wing & Centre Tanks",
        "Sealed integral wet-wing torque box tanks with surge vent tanks and flapper valves.",
      ],
      [
        50,
        50,
        "Electric Booster Pumps & Crossfeed",
        "Submerged AC booster pumps feeding engines and enabling cross-feed balancing in flight.",
      ],
      [
        75,
        65,
        "Jettison (Dumping) & Spar Shut-Off Valves",
        "Emergency fuel dumping nozzles and motorized spar fire valves commanded by fire handles.",
      ],
    ]),
  },
};
