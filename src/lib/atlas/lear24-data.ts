/**
 * AIRCRAFT ATLAS · LEAR 24XR — part database, tours, checkride and pure helpers.
 *
 * Provenance policy (shown on every part):
 *  - "verified"  → established type-design fact for the Learjet 24 series.
 *  - "reported"  → claimed for this airframe by a historical sale listing; not confirmed.
 *  - "schematic" → illustrative geometry / routing, not to scale and not from drawings.
 *
 * The Atlas never fetches live FAA records. Registry notes only describe which fields an
 * FAA registry lookup for N24SA can confirm, so the user can verify them independently.
 */

export type SystemId = "structure" | "propulsion" | "fuel" | "controls" | "gear" | "cabin";
export type SystemFilter = SystemId | "all";
export type Provenance = "verified" | "reported" | "schematic";

export interface AtlasSystem {
  id: SystemId;
  label: string;
  glyph: string;
  color: string;
}

export const ALL_SYSTEMS_META = { label: "All systems", glyph: "✦", color: "#E2E8F0" } as const;

export const SYSTEMS: AtlasSystem[] = [
  { id: "structure", label: "Structure & skin", glyph: "◫", color: "#94A3B8" },
  { id: "propulsion", label: "Propulsion", glyph: "⚙", color: "#F97316" },
  { id: "fuel", label: "Fuel", glyph: "◐", color: "#38BDF8" },
  { id: "controls", label: "Flight controls", glyph: "✚", color: "#A855F7" },
  { id: "gear", label: "Landing gear & brakes", glyph: "▲", color: "#22C55E" },
  { id: "cabin", label: "Cabin environment", glyph: "◎", color: "#EAB308" },
];

export const PROVENANCE_META: Record<Provenance, { label: string; color: string; blurb: string }> = {
  verified: {
    label: "Verified",
    color: "#10B981",
    blurb: "Type-design fact for the Learjet 24 series.",
  },
  reported: {
    label: "Reported",
    color: "#F59E0B",
    blurb: "Claimed by a historical listing for this airframe — not confirmed.",
  },
  schematic: {
    label: "Schematic / Unverified",
    color: "#64748B",
    blurb: "Illustrative geometry or routing — not to scale.",
  },
};

export const AIRFRAME = {
  label: "Lear 24XR",
  registration: "N24SA",
  serial: "24-117",
  heading: "AIRCRAFT ATLAS · LEAR 24XR",
  tagline: "Pull the airplane apart. See how it works.",
} as const;

export interface ProvenanceNote {
  registry: string;
  listing: string;
  schematic: string;
}

export interface AtlasPart {
  id: string;
  name: string;
  system: SystemId;
  provenance: Provenance;
  what: string;
  upstream: string[];
  downstream: string[];
  aliases: string[];
  note?: Partial<ProvenanceNote>;
}

const REGISTRY_DEFAULT =
  "Not a registry field. An FAA registry lookup for N24SA covers make/model, serial number, engine make/model and registrant — not individual components.";
const LISTING_DEFAULT =
  "No specific listing claim. Shown as standard Learjet 24-series equipment.";
const SCHEMATIC_DEFAULT =
  "Procedural 3D geometry sized from published Learjet 24 dimensions; internal detail is simplified.";

export const PARTS: AtlasPart[] = [
  // ─────────────────────────── Structure & skin (11) ───────────────────────────
  {
    id: "radome",
    name: "Radome / nose cone",
    system: "structure",
    provenance: "verified",
    what: "Non-structural composite fairing at the very nose. It is transparent to radio waves so a weather-radar antenna can sit behind it, and it shapes the airflow over the forward fuselage. Behind it is the nose avionics bay, ahead of the forward pressure bulkhead.",
    upstream: [],
    downstream: ["bulkhead-fwd", "stall-warning"],
    aliases: ["nose", "radar", "nose cone"],
  },
  {
    id: "cabin-shell",
    name: "Pressurized cabin shell",
    system: "structure",
    provenance: "verified",
    what: "Semi-monocoque aluminium skin, stringers and frames forming the pressure vessel between the forward and aft pressure bulkheads. Cabin pressure is carried as hoop stress in the skin, and the shell is reinforced around the windshield, window and door cut-outs.",
    upstream: ["bulkhead-fwd", "fwd-frames"],
    downstream: ["bulkhead-aft", "wing-box", "cabin-door", "windshield"],
    aliases: ["fuselage", "pressure vessel", "skin", "cabin"],
  },
  {
    id: "windshield",
    name: "Windshield & bird-strike glass",
    system: "structure",
    provenance: "verified",
    what: "Thick laminated windshield panels designed to keep their strength after a bird strike at speed. Anti-ice and defog air is blown across the glass so the crew keeps a clear view in icing and humid conditions.",
    upstream: ["cabin-shell"],
    downstream: ["instrument-panel"],
    aliases: ["glass", "window", "bird strike", "windscreen"],
  },
  {
    id: "fwd-frames",
    name: "Forward fuselage frames",
    system: "structure",
    provenance: "verified",
    what: "Ring frames and longitudinal stringers that give the forward fuselage its shape and stop the thin skin from buckling. They carry nose-gear loads into the structure and frame the cockpit opening.",
    upstream: ["radome"],
    downstream: ["cabin-shell", "nose-gear"],
    aliases: ["frames", "stringers", "ribs"],
  },
  {
    id: "cabin-door",
    name: "Clam-shell cabin door",
    system: "structure",
    provenance: "verified",
    what: "Two-piece door on the left forward fuselage. The upper half swings up, the lower half folds down and forms the entry steps. Latching pins transfer pressurization loads into the reinforced door frame.",
    upstream: ["cabin-shell"],
    downstream: [],
    aliases: ["door", "entry", "airstair", "steps"],
  },
  {
    id: "wing-box",
    name: "Main wing box & 8-spar structure",
    system: "structure",
    provenance: "verified",
    what: "The Learjet wing descends from the Swiss FFA P-16 strike-fighter and uses a multi-spar box — commonly described as eight spars — instead of a conventional two-spar layout. Multiple spars give redundant load paths and form the walls of the integral fuel tanks; the centre section runs under the cabin floor.",
    upstream: ["cabin-shell"],
    downstream: ["wing-skin-l", "wing-skin-r", "main-gear-l", "main-gear-r", "wing-tanks"],
    aliases: ["spar", "spars", "p-16", "p16", "wing structure", "swiss"],
    note: {
      listing: "No listing claim. The P-16 heritage is part of the Learjet type history.",
    },
  },
  {
    id: "wing-skin-l",
    name: "Left wing skin",
    system: "structure",
    provenance: "verified",
    what: "Aluminium skin panels forming the left wing's upper and lower aerofoil surfaces and the outer wall of the integral fuel tank. They carry bending loads together with the spars.",
    upstream: ["wing-box"],
    downstream: ["tip-tank-l", "aileron-l", "flap-l", "spoiler-l"],
    aliases: ["left wing", "wing"],
    note: {
      listing:
        "The listing reports a Dee Howard XR modification, which reshapes wing aerodynamic surfaces. Treat XR-specific geometry as unconfirmed.",
    },
  },
  {
    id: "wing-skin-r",
    name: "Right wing skin",
    system: "structure",
    provenance: "verified",
    what: "Aluminium skin panels forming the right wing's upper and lower aerofoil surfaces and the outer wall of the integral fuel tank. They carry bending loads together with the spars.",
    upstream: ["wing-box"],
    downstream: ["tip-tank-r", "aileron-r", "flap-r", "spoiler-r"],
    aliases: ["right wing", "wing"],
    note: {
      listing:
        "The listing reports a Dee Howard XR modification, which reshapes wing aerodynamic surfaces. Treat XR-specific geometry as unconfirmed.",
    },
  },
  {
    id: "aft-bay",
    name: "Rear equipment bay (unpressurized)",
    system: "structure",
    provenance: "verified",
    what: "Unpressurized compartment behind the aft pressure bulkhead. It houses the fuselage fuel tank, hydraulic and electrical equipment, the air-conditioning heat exchanger and the structure that carries the engine pylons.",
    upstream: ["bulkhead-aft"],
    downstream: ["nacelle-l", "nacelle-r", "vertical-stab", "fuselage-tank", "heat-exchanger"],
    aliases: ["tail cone", "equipment bay", "aft fuselage", "rear fuselage"],
  },
  {
    id: "dorsal-fin",
    name: "Dorsal fin",
    system: "structure",
    provenance: "schematic",
    what: "Fillet blending the fuselage spine into the vertical stabilizer. Extra side area at high sideslip angles delays fin stall and improves directional stability.",
    upstream: ["aft-bay"],
    downstream: ["vertical-stab"],
    aliases: ["fillet", "dorsal"],
    note: { schematic: "Fillet outline is illustrative; exact size not taken from drawings." },
  },
  {
    id: "vertical-stab",
    name: "T-tail vertical stabilizer",
    system: "structure",
    provenance: "verified",
    what: "Swept fin providing directional stability. It carries the horizontal stabilizer on top in a T-tail layout, keeping the tailplane clear of the wing wake and engine exhaust, and houses the pitch-trim actuator attachment.",
    upstream: ["aft-bay", "dorsal-fin"],
    downstream: ["rudder", "horizontal-stab", "yaw-damper"],
    aliases: ["fin", "t-tail", "tail", "vertical tail"],
  },

  // ─────────────────────────── Propulsion (10) ───────────────────────────
  {
    id: "engine-core-l",
    name: "Left CJ610 turbojet core",
    system: "propulsion",
    provenance: "verified",
    what: "The General Electric CJ610 is the civil version of the J85: a single-spool turbojet with an 8-stage axial compressor, an annular combustor and a two-stage turbine on one shaft. With no bypass fan, all thrust comes from the hot jet — fast, loud and thirsty.",
    upstream: ["nacelle-l", "firewall-valves"],
    downstream: ["compressor", "starter-gen", "bleed-ducts"],
    aliases: ["engine", "cj610", "cj-610", "j85", "turbojet", "left engine"],
    note: {
      registry:
        "Registry-checkable: the FAA record lists the engine manufacturer and model for N24SA — confirm the installed CJ610 variant there.",
    },
  },
  {
    id: "engine-core-r",
    name: "Right CJ610 turbojet core",
    system: "propulsion",
    provenance: "verified",
    what: "Identical single-spool CJ610 turbojet on the right side. Each engine drives its own starter-generator and supplies bleed air, so either engine alone can power the essential systems.",
    upstream: ["nacelle-r", "firewall-valves"],
    downstream: ["compressor", "starter-gen", "bleed-ducts"],
    aliases: ["engine", "cj610", "cj-610", "j85", "turbojet", "right engine"],
    note: {
      registry:
        "Registry-checkable: the FAA record lists the engine manufacturer and model for N24SA — confirm the installed CJ610 variant there.",
    },
  },
  {
    id: "nacelle-l",
    name: "Left engine nacelle & pylon",
    system: "propulsion",
    provenance: "verified",
    what: "Aerodynamic cowling around the left engine, hung from the aft fuselage on a short pylon. The pylon carries thrust and weight into the aft-bay frames and routes fuel, bleed air and electrics; a firewall isolates a nacelle fire from the airframe.",
    upstream: ["aft-bay"],
    downstream: ["engine-core-l", "intake-ducts"],
    aliases: ["cowling", "nacelle", "pylon", "left nacelle"],
  },
  {
    id: "nacelle-r",
    name: "Right engine nacelle & pylon",
    system: "propulsion",
    provenance: "verified",
    what: "Aerodynamic cowling around the right engine, hung from the aft fuselage on a short pylon. The pylon carries thrust and weight into the aft-bay frames and routes fuel, bleed air and electrics; a firewall isolates a nacelle fire from the airframe.",
    upstream: ["aft-bay"],
    downstream: ["engine-core-r", "intake-ducts"],
    aliases: ["cowling", "nacelle", "pylon", "right nacelle"],
  },
  {
    id: "intake-ducts",
    name: "Compressor intake ducts",
    system: "propulsion",
    provenance: "verified",
    what: "Short pitot-style inlets that slow the incoming air and deliver an even flow to the compressor face. Bleed-air heating of the inlet lip prevents ice from forming and being swallowed by the engine.",
    upstream: ["nacelle-l", "nacelle-r"],
    downstream: ["compressor"],
    aliases: ["intake", "inlet", "air intake", "anti-ice"],
  },
  {
    id: "compressor",
    name: "8-stage axial compressor rotors",
    system: "propulsion",
    provenance: "verified",
    what: "Eight rows of rotating blades, with stator vanes between them, raise air pressure stage by stage to roughly seven times ambient. Variable inlet guide vanes and interstage bleed keep the compressor from stalling at low rpm.",
    upstream: ["intake-ducts", "engine-core-l", "engine-core-r"],
    downstream: ["combustor", "bleed-ducts"],
    aliases: ["compressor", "rotor", "blades", "axial", "stages"],
  },
  {
    id: "combustor",
    name: "Annular combustors",
    system: "propulsion",
    provenance: "verified",
    what: "A single ring-shaped combustion chamber around the shaft. Fuel nozzles spray atomised Jet-A into compressed air; only part of the air burns, the rest cools the liner and dilutes the gas before it reaches the turbine.",
    upstream: ["compressor", "firewall-valves"],
    downstream: ["turbine-exhaust"],
    aliases: ["burner", "combustion", "combustion chamber", "fuel nozzle"],
  },
  {
    id: "turbine-exhaust",
    name: "Turbine & exhaust nozzles",
    system: "propulsion",
    provenance: "verified",
    what: "A two-stage turbine extracts just enough energy from the hot gas to drive the compressor and accessories. The remaining energy accelerates through the exhaust nozzle as the jet that produces thrust.",
    upstream: ["combustor"],
    downstream: ["thrust-reversers"],
    aliases: ["turbine", "exhaust", "nozzle", "tailpipe", "jet pipe"],
  },
  {
    id: "thrust-reversers",
    name: "Dee Howard thrust reverser buckets",
    system: "propulsion",
    provenance: "reported",
    what: "Aftermarket target-type reversers: two clamshell buckets close behind the nozzle after touchdown and deflect the jet forward to shorten the landing roll. Deployment is interlocked with weight-on-wheels.",
    upstream: ["turbine-exhaust", "squat-switch"],
    downstream: [],
    aliases: ["reverser", "reversers", "buckets", "dee howard", "clamshell"],
    note: {
      listing:
        "Reported: the historical listing claims Dee Howard thrust reversers are installed. Confirm against the aircraft's logbooks and STC records.",
      schematic: "Bucket shape is a generic target-reverser illustration.",
    },
  },
  {
    id: "starter-gen",
    name: "Starter-generators",
    system: "propulsion",
    provenance: "verified",
    what: "Engine-driven DC machines. On the ground they spin the engine up for starting; once it is running they switch over to generating 28 V DC for the aircraft electrical bus.",
    upstream: ["engine-core-l", "engine-core-r"],
    downstream: ["fuel-pumps", "yaw-damper"],
    aliases: ["starter", "generator", "electrical", "dc", "28v"],
  },

  // ─────────────────────────── Fuel (7) ───────────────────────────
  {
    id: "tip-tank-l",
    name: "Left wingtip tank",
    system: "fuel",
    provenance: "verified",
    what: "Learjet's signature permanent tip tank. It carries a large share of the fuel, acts as an endplate that reduces induced drag, and its outboard mass relieves wing bending in flight. Fuel flows from the tip tank into the wing tank.",
    upstream: ["wing-skin-l"],
    downstream: ["wing-tanks"],
    aliases: ["tip tank", "tiptank", "wingtip", "left tank"],
  },
  {
    id: "tip-tank-r",
    name: "Right wingtip tank",
    system: "fuel",
    provenance: "verified",
    what: "Learjet's signature permanent tip tank on the right wing. Like the left tank it carries a large share of the fuel, reduces induced drag as an endplate and drains into its wing tank.",
    upstream: ["wing-skin-r"],
    downstream: ["wing-tanks"],
    aliases: ["tip tank", "tiptank", "wingtip", "right tank"],
  },
  {
    id: "wing-tanks",
    name: "Integral wing wet-tanks",
    system: "fuel",
    provenance: "verified",
    what: "The sealed wing structure itself — spars, ribs and skins — forms the tank, so there is no separate bladder. Each wing tank feeds its own engine through boost and jet pumps and receives fuel from the tip tank and the fuselage tank.",
    upstream: ["tip-tank-l", "tip-tank-r", "fuselage-tank", "wing-box"],
    downstream: ["fuel-pumps"],
    aliases: ["wet wing", "wing tank", "integral tank"],
  },
  {
    id: "fuselage-tank",
    name: "Fuselage fuel tank",
    system: "fuel",
    provenance: "verified",
    what: "Tank in the unpressurized area behind the cabin. Electric transfer pumps move its fuel into the wing tanks; the engines draw from the wings, not directly from this tank.",
    upstream: ["aft-bay"],
    downstream: ["wing-tanks"],
    aliases: ["fuselage tank", "aft tank", "bladder"],
  },
  {
    id: "fuel-pumps",
    name: "Electric transfer & boost pumps",
    system: "fuel",
    provenance: "verified",
    what: "Electric boost pumps in each wing tank supply pressurised fuel for engine start and as backup; jet (ejector) pumps driven by motive-flow fuel keep the feed lines full in flight. Transfer pumps move fuselage fuel into the wings.",
    upstream: ["wing-tanks", "starter-gen"],
    downstream: ["crossfeed"],
    aliases: ["pump", "boost pump", "jet pump", "transfer pump"],
  },
  {
    id: "crossfeed",
    name: "Crossfeed valve & feed manifold",
    system: "fuel",
    provenance: "schematic",
    what: "A valve linking the left and right feed lines so either wing can supply either engine — used to correct a fuel imbalance or to feed both engines from one side. The tubes drawn from tip tanks to engines show the flow path, not exact routing.",
    upstream: ["fuel-pumps"],
    downstream: ["firewall-valves"],
    aliases: ["crossfeed", "manifold", "fuel lines", "feed lines", "imbalance"],
    note: { schematic: "Fuel line routing is schematic — it shows the flow path, not drawings." },
  },
  {
    id: "firewall-valves",
    name: "Fuel shutoff firewall valves",
    system: "fuel",
    provenance: "verified",
    what: "Motor-operated valves where each fuel line crosses the engine firewall. Pulling the engine fire handle closes the valve so a nacelle fire is starved of fuel.",
    upstream: ["crossfeed"],
    downstream: ["combustor", "engine-core-l", "engine-core-r"],
    aliases: ["shutoff", "firewall", "fire handle", "valve"],
  },

  // ─────────────────────────── Flight controls (13) ───────────────────────────
  {
    id: "yokes",
    name: "Dual control yokes",
    system: "controls",
    provenance: "verified",
    what: "Left and right control wheels are mechanically linked. Pushing and pulling drives the elevators through cables; turning drives the ailerons. Pitch-trim switches and the autopilot disconnect sit on the wheels.",
    upstream: ["instrument-panel", "stall-warning"],
    downstream: ["control-cables", "horizontal-stab"],
    aliases: ["yoke", "control wheel", "column", "stick"],
  },
  {
    id: "aileron-l",
    name: "Left aileron",
    system: "controls",
    provenance: "verified",
    what: "Outboard trailing-edge surface for roll control. It is cable-driven and moves opposite to the right aileron: one rises, the other drops, rolling the aircraft.",
    upstream: ["control-cables", "wing-skin-l"],
    downstream: [],
    aliases: ["aileron", "roll"],
  },
  {
    id: "aileron-r",
    name: "Right aileron",
    system: "controls",
    provenance: "verified",
    what: "Outboard trailing-edge surface on the right wing for roll control, moving opposite to the left aileron.",
    upstream: ["control-cables", "wing-skin-r"],
    downstream: [],
    aliases: ["aileron", "roll"],
  },
  {
    id: "spoiler-l",
    name: "Left spoiler",
    system: "controls",
    provenance: "verified",
    what: "Hydraulically raised panel on the upper wing surface ahead of the flap. Raised together with the right spoiler, it dumps lift and adds drag for descent and on the landing roll. Later Learjets also use spoilers for roll (spoilerons).",
    upstream: ["wing-skin-l", "squat-switch"],
    downstream: [],
    aliases: ["spoiler", "speed brake", "spoileron", "lift dump"],
  },
  {
    id: "spoiler-r",
    name: "Right spoiler",
    system: "controls",
    provenance: "verified",
    what: "Hydraulically raised panel on the right upper wing surface, deployed together with the left spoiler as a speed brake and lift dumper.",
    upstream: ["wing-skin-r", "squat-switch"],
    downstream: [],
    aliases: ["spoiler", "speed brake", "spoileron", "lift dump"],
  },
  {
    id: "flap-l",
    name: "Left trailing-edge flap",
    system: "controls",
    provenance: "verified",
    what: "Hydraulically driven flap on the inboard trailing edge. Extending it increases wing camber and area, lowering stall speed for takeoff and landing.",
    upstream: ["wing-skin-l"],
    downstream: [],
    aliases: ["flap", "flaps", "fowler"],
  },
  {
    id: "flap-r",
    name: "Right trailing-edge flap",
    system: "controls",
    provenance: "verified",
    what: "Hydraulically driven flap on the right inboard trailing edge, moving symmetrically with the left flap.",
    upstream: ["wing-skin-r"],
    downstream: [],
    aliases: ["flap", "flaps", "fowler"],
  },
  {
    id: "horizontal-stab",
    name: "Moveable horizontal stabilizer (pitch trim)",
    system: "controls",
    provenance: "verified",
    what: "The whole tailplane pivots to trim the aircraft in pitch, driven by an electric trim actuator in the fin. Moving the entire stabilizer gives far more trim authority across the Learjet's wide speed range than a small tab would.",
    upstream: ["vertical-stab", "yokes"],
    downstream: ["elevators"],
    aliases: ["stabilizer", "tailplane", "pitch trim", "trim", "stab"],
  },
  {
    id: "elevators",
    name: "Elevators",
    system: "controls",
    provenance: "verified",
    what: "Hinged trailing-edge surfaces on the horizontal stabilizer that control pitch, moved through cables from the yokes.",
    upstream: ["control-cables", "horizontal-stab"],
    downstream: [],
    aliases: ["elevator", "pitch"],
  },
  {
    id: "rudder",
    name: "Rudder",
    system: "controls",
    provenance: "verified",
    what: "Trailing-edge surface on the fin for yaw control, cable-driven from the pedals and assisted by the yaw damper in flight.",
    upstream: ["control-cables", "yaw-damper", "vertical-stab"],
    downstream: [],
    aliases: ["rudder", "yaw", "pedals"],
  },
  {
    id: "control-cables",
    name: "Control cable routing & bellcranks",
    system: "controls",
    provenance: "schematic",
    what: "Steel cables, pulleys and bellcranks carry pilot inputs from the cockpit to the ailerons, elevators and rudder. The routing drawn here shows the idea, not the exact cable runs.",
    upstream: ["yokes"],
    downstream: ["aileron-l", "aileron-r", "elevators", "rudder"],
    aliases: ["cables", "bellcrank", "pulleys", "control runs"],
    note: { schematic: "Cable runs are schematic — they show the concept, not drawings." },
  },
  {
    id: "stall-warning",
    name: "Stall warning vane & stick shaker",
    system: "controls",
    provenance: "verified",
    what: "An angle-of-attack vane on the nose feeds a shaker motor that vibrates the control columns before the stall. Learjets also use a stick pusher that pushes the nose down if the warning is ignored.",
    upstream: ["radome"],
    downstream: ["yokes"],
    aliases: ["stall", "aoa", "angle of attack", "shaker", "pusher"],
  },
  {
    id: "yaw-damper",
    name: "Yaw damper actuator",
    system: "controls",
    provenance: "verified",
    what: "Senses yaw rate and makes small rudder inputs to damp Dutch roll — the coupled yaw-roll oscillation swept-wing jets are prone to, especially at altitude.",
    upstream: ["starter-gen", "vertical-stab"],
    downstream: ["rudder"],
    aliases: ["yaw damper", "dutch roll", "damper"],
  },

  // ─────────────────────────── Landing gear & brakes (7) ───────────────────────────
  {
    id: "nose-gear",
    name: "Steerable nose gear strut",
    system: "gear",
    provenance: "verified",
    what: "Oleo-pneumatic strut that absorbs landing loads and steers the nosewheel during taxi. It retracts into a bay under the cockpit, behind closing doors.",
    upstream: ["fwd-frames", "gear-actuators"],
    downstream: [],
    aliases: ["nose gear", "nosewheel", "steering"],
  },
  {
    id: "main-gear-l",
    name: "Left main gear oleo strut",
    system: "gear",
    provenance: "verified",
    what: "Oleo strut with dual wheels carrying most of the aircraft's weight on the ground. It retracts inward so the wheels stow in the wing root and lower fuselage.",
    upstream: ["wing-box", "gear-actuators"],
    downstream: ["brakes", "squat-switch"],
    aliases: ["main gear", "left gear", "oleo", "strut", "wheels"],
  },
  {
    id: "main-gear-r",
    name: "Right main gear oleo strut",
    system: "gear",
    provenance: "verified",
    what: "Right oleo strut with dual wheels. It mirrors the left leg and retracts inward into the wing root and lower fuselage.",
    upstream: ["wing-box", "gear-actuators"],
    downstream: ["brakes"],
    aliases: ["main gear", "right gear", "oleo", "strut", "wheels"],
  },
  {
    id: "gear-doors",
    name: "Gear doors",
    system: "gear",
    provenance: "schematic",
    what: "Doors that close over the retracted gear to restore a smooth lower surface. Some are fixed to the struts and move with them; others are hydraulically sequenced.",
    upstream: ["gear-actuators"],
    downstream: [],
    aliases: ["doors", "gear door", "wheel well"],
    note: { schematic: "Door shapes are illustrative." },
  },
  {
    id: "gear-actuators",
    name: "Hydraulic retraction actuators",
    system: "gear",
    provenance: "verified",
    what: "Hydraulic cylinders that raise and lower each gear leg and work the up- and down-locks. An emergency system lets the crew extend the gear if normal hydraulic pressure is lost.",
    upstream: ["squat-switch"],
    downstream: ["nose-gear", "main-gear-l", "main-gear-r", "gear-doors"],
    aliases: ["actuator", "hydraulic", "retraction", "uplock", "downlock"],
  },
  {
    id: "brakes",
    name: "Multi-disc anti-skid brakes",
    system: "gear",
    provenance: "verified",
    what: "Hydraulic multi-disc brakes in each main wheel. The anti-skid system watches wheel speed and releases pressure on any wheel that starts to lock, giving the shortest stop without flat-spotting tyres.",
    upstream: ["main-gear-l", "main-gear-r"],
    downstream: [],
    aliases: ["brake", "anti-skid", "antiskid", "disc"],
  },
  {
    id: "squat-switch",
    name: "Squat switch (weight-on-wheels)",
    system: "gear",
    provenance: "verified",
    what: "Switch on the main gear that senses strut compression. It tells systems whether the aircraft is on the ground — inhibiting gear retraction, enabling reversers and spoilers after landing, and switching pressurization modes.",
    upstream: ["main-gear-l"],
    downstream: ["gear-actuators", "thrust-reversers", "outflow-valve", "spoiler-l", "spoiler-r"],
    aliases: ["squat", "weight on wheels", "wow", "air ground"],
  },

  // ─────────────────────────── Cabin environment (8) ───────────────────────────
  {
    id: "bleed-ducts",
    name: "Engine bleed-air ducting",
    system: "cabin",
    provenance: "schematic",
    what: "Hot, high-pressure air tapped from each engine's compressor flows through insulated ducts to the air-conditioning, pressurization and anti-ice systems.",
    upstream: ["compressor", "engine-core-l", "engine-core-r"],
    downstream: ["heat-exchanger", "emergency-press"],
    aliases: ["bleed", "bleed air", "duct", "ducts"],
    note: { schematic: "Duct routing is schematic." },
  },
  {
    id: "heat-exchanger",
    name: "Heat exchanger & cooling pack",
    system: "cabin",
    provenance: "verified",
    what: "Ram air flowing through the heat exchanger cools the hot bleed air before it enters the cabin; a mixing valve blends hot and cooled air to set the cabin temperature.",
    upstream: ["bleed-ducts", "aft-bay"],
    downstream: ["cabin-shell", "outflow-valve"],
    aliases: ["heat exchanger", "air conditioning", "cooling", "pack", "ram air"],
  },
  {
    id: "bulkhead-fwd",
    name: "Forward pressure bulkhead",
    system: "cabin",
    provenance: "verified",
    what: "Bulkhead closing the front of the pressure vessel behind the nose avionics bay. It carries the full pressure differential and anchors frames around the windshield and nose gear.",
    upstream: ["radome"],
    downstream: ["cabin-shell", "instrument-panel"],
    aliases: ["bulkhead", "forward bulkhead", "pressure bulkhead"],
  },
  {
    id: "bulkhead-aft",
    name: "Aft pressure bulkhead",
    system: "cabin",
    provenance: "verified",
    what: "Domed bulkhead at the rear of the cabin. A dome carries pressure loads mostly in tension, which is far more efficient than a flat plate. The outflow and safety valves are mounted on it.",
    upstream: ["cabin-shell"],
    downstream: ["outflow-valve", "aft-bay"],
    aliases: ["bulkhead", "aft bulkhead", "pressure dome", "rear bulkhead"],
  },
  {
    id: "outflow-valve",
    name: "Cabin outflow & safety valves",
    system: "cabin",
    provenance: "verified",
    what: "The outflow valve sets cabin altitude by regulating how fast air leaves the pressure vessel. Separate safety valves open if the pressure differential gets too high, or if outside pressure exceeds cabin pressure.",
    upstream: ["bulkhead-aft", "squat-switch", "heat-exchanger"],
    downstream: [],
    aliases: ["outflow", "safety valve", "cabin altitude", "pressurization"],
  },
  {
    id: "emergency-press",
    name: "Emergency pressurization system",
    system: "cabin",
    provenance: "verified",
    what: "If normal conditioned air fails, a valve routes bleed air directly into the cabin. It is hot and loud, but it keeps the cabin pressurized long enough for a controlled descent.",
    upstream: ["bleed-ducts"],
    downstream: ["cabin-shell"],
    aliases: ["emergency pressurization", "emergency", "backup pressurization"],
  },
  {
    id: "instrument-panel",
    name: "Cockpit instrument panel shroud",
    system: "cabin",
    provenance: "schematic",
    what: "Glare shield and panel housing flight instruments, engine gauges and avionics in front of both pilots. The shroud stops windshield reflections and keeps sunlight from washing out the displays.",
    upstream: ["bulkhead-fwd", "windshield"],
    downstream: ["yokes"],
    aliases: ["panel", "instruments", "glare shield", "cockpit", "avionics"],
    note: { schematic: "Panel layout is generic; it is not N24SA's actual avionics fit." },
  },
  {
    id: "oxygen-manifold",
    name: "Passenger oxygen distribution manifold",
    system: "cabin",
    provenance: "schematic",
    what: "A high-pressure oxygen bottle feeds crew quick-donning masks and, through a manifold along the cabin ceiling, drop-down passenger masks that deploy if cabin altitude climbs too high.",
    upstream: [],
    downstream: ["cabin-shell"],
    aliases: ["oxygen", "o2", "masks", "manifold"],
    note: { schematic: "Bottle position and manifold routing are illustrative." },
  },
];

export const PART_BY_ID: Record<string, AtlasPart> = Object.fromEntries(
  PARTS.map((p) => [p.id, p]),
);

export const SYSTEM_BY_ID: Record<SystemId, AtlasSystem> = Object.fromEntries(
  SYSTEMS.map((s) => [s.id, s]),
) as Record<SystemId, AtlasSystem>;

export function partsForSystem(system: SystemFilter): AtlasPart[] {
  return system === "all" ? PARTS : PARTS.filter((p) => p.system === system);
}

export function systemColor(system: SystemFilter): string {
  return system === "all" ? ALL_SYSTEMS_META.color : SYSTEM_BY_ID[system].color;
}

export function provenanceNoteFor(part: AtlasPart): ProvenanceNote {
  return {
    registry: part.note?.registry ?? REGISTRY_DEFAULT,
    listing: part.note?.listing ?? LISTING_DEFAULT,
    schematic: part.note?.schematic ?? SCHEMATIC_DEFAULT,
  };
}

/** Unique set of parts directly connected to a part (upstream ∪ downstream ∪ reverse links). */
export function linkedPartIds(partId: string): string[] {
  const part = PART_BY_ID[partId];
  if (!part) return [];
  const set = new Set<string>([...part.upstream, ...part.downstream]);
  for (const other of PARTS) {
    if (other.upstream.includes(partId) || other.downstream.includes(partId)) set.add(other.id);
  }
  set.delete(partId);
  return [...set].filter((id) => PART_BY_ID[id]);
}

// ─────────────────────────── Camera presets ───────────────────────────
export type CameraPresetId =
  | "threeQuarter"
  | "nose"
  | "leftSide"
  | "plan"
  | "rear"
  | "cockpit"
  | "underside"
  | "tail";

export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
}

export const CAMERA_PRESETS: { id: CameraPresetId; label: string; pose: CameraPose }[] = [
  { id: "threeQuarter", label: "Three-quarter", pose: { position: [10.5, 4.6, 11.5], target: [0, 0, -0.6] } },
  { id: "nose", label: "Nose", pose: { position: [1.2, 0.9, 15.5], target: [0, 0, 0] } },
  { id: "leftSide", label: "Left side", pose: { position: [17, 1.1, -0.6], target: [0, 0.1, -0.6] } },
  { id: "plan", label: "Plan", pose: { position: [0, 21, -0.55], target: [0, 0, -0.6] } },
  { id: "rear", label: "Rear", pose: { position: [-2.2, 3.2, -16.5], target: [0, 0.4, -1] } },
  { id: "cockpit", label: "Cockpit", pose: { position: [0.2, 0.32, 3.05], target: [0, 0.05, 6.5] } },
  { id: "underside", label: "Underside", pose: { position: [3.5, -9.5, 3.5], target: [0, -0.6, -0.6] } },
  { id: "tail", label: "Tail", pose: { position: [6.5, 5.2, -12], target: [0, 1.4, -5.6] } },
];

export const CAMERA_PRESET_BY_ID = Object.fromEntries(
  CAMERA_PRESETS.map((p) => [p.id, p]),
) as Record<CameraPresetId, (typeof CAMERA_PRESETS)[number]>;

// ─────────────────────────── Guided tours ───────────────────────────
export interface TourStep {
  title: string;
  body: string;
  partId: string | null;
  system: SystemFilter;
  explode: number; // 0–100
  seeThrough: boolean;
  isolate: boolean;
  camera: CameraPresetId;
  focus: boolean;
}

export interface Tour {
  id: string;
  title: string;
  summary: string;
  steps: TourStep[];
}

export const TOURS: Tour[] = [
  {
    id: "meet-n24sa",
    title: "Meet N24SA",
    summary: "Walk around the exterior: what's verified, what's reported, and where the design came from.",
    steps: [
      {
        title: "A 1960s business jet",
        body: "The Learjet 24 seats six to eight behind a two-pilot cockpit. Low swept wing, permanent tip tanks, two aft-mounted turbojets and a T-tail — the layout that defined the early bizjet.",
        partId: null,
        system: "all",
        explode: 0,
        seeThrough: false,
        isolate: false,
        camera: "threeQuarter",
        focus: false,
      },
      {
        title: "Registry vs. reported",
        body: "An FAA registry lookup can confirm make, model, serial number and engine type. A historical listing additionally claims a Dee Howard XR modification and thrust reversers — the Atlas marks those Reported until you confirm them in the records.",
        partId: "wing-skin-l",
        system: "structure",
        explode: 0,
        seeThrough: false,
        isolate: false,
        camera: "leftSide",
        focus: false,
      },
      {
        title: "Swiss fighter heritage",
        body: "Bill Lear based the wing on the Swiss FFA P-16 strike-fighter. Exploding the skins reveals its multi-spar box, which doubles as the wall of the integral fuel tanks.",
        partId: "wing-box",
        system: "structure",
        explode: 60,
        seeThrough: false,
        isolate: false,
        camera: "plan",
        focus: false,
      },
      {
        title: "Tip tanks",
        body: "Permanent tip tanks carry a large share of the fuel and act as endplates. Their outboard mass also relieves wing bending loads in flight.",
        partId: "tip-tank-r",
        system: "fuel",
        explode: 0,
        seeThrough: false,
        isolate: false,
        camera: "nose",
        focus: true,
      },
      {
        title: "The T-tail",
        body: "Mounting the horizontal stabilizer on top of the fin keeps it out of the wing wake and the engine exhaust. The whole stabilizer moves for pitch trim.",
        partId: "vertical-stab",
        system: "structure",
        explode: 0,
        seeThrough: false,
        isolate: false,
        camera: "tail",
        focus: false,
      },
      {
        title: "CJ610 turbojets",
        body: "Two General Electric CJ610 turbojets hang from the aft fuselage. Explode the nacelles to see the core: intake, 8-stage compressor, annular combustor, two-stage turbine and nozzle.",
        partId: "engine-core-l",
        system: "propulsion",
        explode: 70,
        seeThrough: false,
        isolate: false,
        camera: "threeQuarter",
        focus: true,
      },
    ],
  },
  {
    id: "trace-fuel",
    title: "Trace a system: fuel",
    summary: "Follow Jet-A from the wingtip tank all the way to the CJ610 burner.",
    steps: [
      {
        title: "1 · Wingtip tank",
        body: "The journey starts in the left tip tank. Fuel flows inboard from here into the wing tank.",
        partId: "tip-tank-l",
        system: "fuel",
        explode: 0,
        seeThrough: true,
        isolate: false,
        camera: "threeQuarter",
        focus: true,
      },
      {
        title: "2 · Integral wing tank",
        body: "The sealed wing box itself is the tank. Each wing tank feeds its own engine.",
        partId: "wing-tanks",
        system: "fuel",
        explode: 25,
        seeThrough: true,
        isolate: true,
        camera: "plan",
        focus: false,
      },
      {
        title: "3 · Fuselage tank",
        body: "Fuel in the fuselage tank behind the cabin is transferred into the wing tanks — the engines never draw from it directly.",
        partId: "fuselage-tank",
        system: "fuel",
        explode: 25,
        seeThrough: true,
        isolate: true,
        camera: "threeQuarter",
        focus: true,
      },
      {
        title: "4 · Boost, jet and transfer pumps",
        body: "Electric boost pumps provide pressure for starting and backup; jet pumps keep feed lines full in flight; transfer pumps move fuselage fuel outboard.",
        partId: "fuel-pumps",
        system: "fuel",
        explode: 25,
        seeThrough: true,
        isolate: true,
        camera: "underside",
        focus: true,
      },
      {
        title: "5 · Firewall shutoff",
        body: "Each feed line passes a motor-operated shutoff valve at the firewall. The fire handle closes it.",
        partId: "firewall-valves",
        system: "fuel",
        explode: 25,
        seeThrough: true,
        isolate: true,
        camera: "rear",
        focus: true,
      },
      {
        title: "6 · Into the burner",
        body: "Fuel nozzles spray Jet-A into the CJ610's annular combustor, where it burns with compressed air to drive the turbine.",
        partId: "combustor",
        system: "propulsion",
        explode: 70,
        seeThrough: false,
        isolate: false,
        camera: "threeQuarter",
        focus: true,
      },
    ],
  },
  {
    id: "pressure-cabin",
    title: "The pressure cabin",
    summary: "How engine air becomes a comfortable cabin at altitude.",
    steps: [
      {
        title: "1 · Engine bleed air",
        body: "Hot, high-pressure air is tapped from each CJ610 compressor and ducted forward.",
        partId: "bleed-ducts",
        system: "cabin",
        explode: 20,
        seeThrough: true,
        isolate: false,
        camera: "threeQuarter",
        focus: true,
      },
      {
        title: "2 · Heat exchanger",
        body: "Ram air cools the bleed air; a mixing valve sets the temperature before it enters the cabin.",
        partId: "heat-exchanger",
        system: "cabin",
        explode: 20,
        seeThrough: true,
        isolate: true,
        camera: "leftSide",
        focus: true,
      },
      {
        title: "3 · Pressure bulkheads",
        body: "A flat forward bulkhead and a domed aft bulkhead close the pressure vessel. The dome carries load in tension — much more efficient than a flat plate.",
        partId: "bulkhead-aft",
        system: "cabin",
        explode: 35,
        seeThrough: true,
        isolate: false,
        camera: "leftSide",
        focus: false,
      },
      {
        title: "4 · Bird-strike windshield",
        body: "The windshield is part of the pressure vessel and must also survive a bird strike at speed.",
        partId: "windshield",
        system: "structure",
        explode: 0,
        seeThrough: false,
        isolate: false,
        camera: "nose",
        focus: true,
      },
      {
        title: "5 · Outflow valve",
        body: "Cabin altitude is set by how fast air leaves through the outflow valve; safety valves protect against over-pressure.",
        partId: "outflow-valve",
        system: "cabin",
        explode: 35,
        seeThrough: true,
        isolate: true,
        camera: "threeQuarter",
        focus: true,
      },
    ],
  },
];

export const TOUR_BY_ID = Object.fromEntries(TOURS.map((t) => [t.id, t])) as Record<string, Tour>;

// ─────────────────────────── Checkride ───────────────────────────
export type CheckrideQuestion =
  | {
      id: string;
      kind: "mcq";
      system: SystemId;
      prompt: string;
      options: string[];
      answerIndex: number;
      explanation: string;
      partId: string;
    }
  | {
      id: string;
      kind: "locate";
      system: SystemId;
      prompt: string;
      accept: string[];
      explanation: string;
      partId: string;
    };

export const CHECKRIDE: CheckrideQuestion[] = [
  {
    id: "q1",
    kind: "mcq",
    system: "propulsion",
    prompt: "The General Electric CJ610 on the Lear 24 is best described as…",
    options: [
      "A high-bypass turbofan",
      "A single-spool turbojet",
      "A twin-spool turbofan",
      "A turboprop",
    ],
    answerIndex: 1,
    explanation: "The CJ610 (civil J85) has one shaft and no bypass fan — all thrust comes from the hot jet.",
    partId: "engine-core-l",
  },
  {
    id: "q2",
    kind: "locate",
    system: "fuel",
    prompt: "Locate on the aircraft: a wingtip fuel tank.",
    accept: ["tip-tank-l", "tip-tank-r"],
    explanation: "The cylindrical tanks on each wingtip are a Learjet signature.",
    partId: "tip-tank-l",
  },
  {
    id: "q3",
    kind: "mcq",
    system: "fuel",
    prompt: "How does fuel in the fuselage tank reach the engines?",
    options: [
      "It feeds both engines directly through the crossfeed",
      "It is transferred into the wing tanks, which feed the engines",
      "It gravity-drains into the tip tanks",
      "It is only used for the APU",
    ],
    answerIndex: 1,
    explanation: "Transfer pumps move fuselage fuel into the wing tanks; engines draw from the wings.",
    partId: "fuselage-tank",
  },
  {
    id: "q4",
    kind: "locate",
    system: "controls",
    prompt: "Locate on the aircraft: the surface that moves as a whole to trim pitch.",
    accept: ["horizontal-stab"],
    explanation: "The whole horizontal stabilizer pivots for pitch trim.",
    partId: "horizontal-stab",
  },
  {
    id: "q5",
    kind: "mcq",
    system: "cabin",
    prompt: "Why is the aft pressure bulkhead domed rather than flat?",
    options: [
      "To make room for baggage",
      "A dome carries pressure mostly in tension, saving weight",
      "To hold the fuselage fuel tank",
      "It reduces cabin noise",
    ],
    answerIndex: 1,
    explanation: "Curved shells carry pressure in membrane tension; a flat plate must resist bending.",
    partId: "bulkhead-aft",
  },
  {
    id: "q6",
    kind: "locate",
    system: "gear",
    prompt: "Locate on the aircraft: a main landing-gear strut.",
    accept: ["main-gear-l", "main-gear-r"],
    explanation: "The dual-wheel oleo struts under each wing carry most of the weight.",
    partId: "main-gear-l",
  },
  {
    id: "q7",
    kind: "mcq",
    system: "cabin",
    prompt: "In normal operation, what sets cabin altitude?",
    options: [
      "The engine throttle position",
      "The emergency pressurization valve",
      "The outflow valve regulating air leaving the cabin",
      "The heat exchanger",
    ],
    answerIndex: 2,
    explanation: "Air flows in continuously; the outflow valve controls how fast it leaves.",
    partId: "outflow-valve",
  },
  {
    id: "q8",
    kind: "mcq",
    system: "gear",
    prompt: "What does the squat switch tell the aircraft's systems?",
    options: [
      "Whether the gear is up or down",
      "Whether there is weight on the wheels",
      "Brake temperature",
      "Tyre pressure",
    ],
    answerIndex: 1,
    explanation: "Strut compression = on the ground. Systems use it to inhibit or enable functions.",
    partId: "squat-switch",
  },
  {
    id: "q9",
    kind: "locate",
    system: "propulsion",
    prompt: "Locate on the aircraft: an engine nacelle.",
    accept: ["nacelle-l", "nacelle-r"],
    explanation: "Both nacelles hang from short pylons on the aft fuselage.",
    partId: "nacelle-l",
  },
  {
    id: "q10",
    kind: "mcq",
    system: "controls",
    prompt: "What does the yaw damper counter?",
    options: ["Adverse yaw from flaps", "Dutch roll", "Engine-out yaw on takeoff", "Crosswind drift"],
    answerIndex: 1,
    explanation: "Swept-wing jets are prone to Dutch roll; the yaw damper applies small rudder inputs to damp it.",
    partId: "yaw-damper",
  },
];

export function isCheckrideAnswerCorrect(
  q: CheckrideQuestion,
  answer: number | string,
): boolean {
  if (q.kind === "mcq") return answer === q.answerIndex;
  return typeof answer === "string" && q.accept.includes(answer);
}

// ─────────────────────────── Search & Ask the Aircraft ───────────────────────────
const STOPWORDS = new Set(
  "a an the is are of on in to for and or what how does do why which where it its this that with from by as at be can when who".split(
    " ",
  ),
);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

export interface SearchResult {
  kind: "part" | "system";
  id: string;
  label: string;
  system: SystemId;
}

export function searchAtlas(query: string, limit = 12): SearchResult[] {
  const q = query.trim().toLowerCase();
  const systems: SearchResult[] = SYSTEMS.filter(
    (s) => !q || s.label.toLowerCase().includes(q),
  ).map((s) => ({ kind: "system", id: s.id, label: s.label, system: s.id }));
  if (!q) {
    return [...systems, ...PARTS.slice(0, limit).map(partResult)].slice(0, limit + systems.length);
  }
  const scored = PARTS.map((p) => {
    let score = 0;
    const name = p.name.toLowerCase();
    if (name.startsWith(q)) score += 6;
    else if (name.includes(q)) score += 4;
    if (p.aliases.some((a) => a.includes(q) || q.includes(a))) score += 3;
    if (p.id.includes(q)) score += 2;
    if (SYSTEM_BY_ID[p.system].label.toLowerCase().includes(q)) score += 1;
    if (score === 0 && p.what.toLowerCase().includes(q)) score += 1;
    return { p, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => partResult(s.p));
  return [...systems, ...scored];
}

function partResult(p: AtlasPart): SearchResult {
  return { kind: "part", id: p.id, label: p.name, system: p.system };
}

export interface AtlasAnswer {
  found: boolean;
  answer: string;
  citations: string[];
}

function firstSentences(text: string, n: number): string {
  const parts = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  return parts.slice(0, n).join(" ").trim();
}

/** Answers strictly from the part database; returns found=false when nothing matches. */
export function askTheAircraft(question: string): AtlasAnswer {
  const tokens = tokenize(question);
  if (tokens.length === 0) {
    return { found: false, answer: "Ask about a part or system of N24SA.", citations: [] };
  }
  const scored = PARTS.map((p) => {
    const name = tokenize(p.name);
    const aliases = p.aliases.flatMap(tokenize);
    const body = new Set(tokenize(p.what));
    let score = 0;
    for (const t of tokens) {
      if (name.includes(t)) score += 3;
      if (aliases.includes(t)) score += 3;
      if (body.has(t)) score += 1;
    }
    return { p, score };
  })
    .filter((s) => s.score >= 3)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return {
      found: false,
      answer:
        "The Atlas database doesn't cover that. Try asking about a named part — e.g. tip tanks, outflow valve, CJ610 compressor or squat switch.",
      citations: [],
    };
  }
  const top = scored[0].p;
  const second = scored[1] && scored[1].score >= scored[0].score - 1 ? scored[1].p : null;
  let answer = `${top.name}: ${firstSentences(top.what, 2)}`;
  if (second && second.id !== top.id) {
    answer += ` Related — ${second.name}: ${firstSentences(second.what, 1)}`;
  }
  return { found: true, answer, citations: second ? [top.id, second.id] : [top.id] };
}

// ─────────────────────────── Share URL state ───────────────────────────
export interface AtlasUrlState {
  system?: SystemFilter;
  part?: string;
  explode?: number;
  isolate?: boolean;
  seeThrough?: boolean;
  tour?: { id: string; step: number };
  camera?: CameraPose;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function serializeAtlasState(state: AtlasUrlState): string {
  const params = new URLSearchParams();
  if (state.system && state.system !== "all") params.set("system", state.system);
  if (state.part && PART_BY_ID[state.part]) params.set("part", state.part);
  if (typeof state.explode === "number" && state.explode > 0) {
    params.set("explode", String(Math.round(Math.min(100, Math.max(0, state.explode)))));
  }
  if (state.isolate) params.set("isolate", "1");
  if (state.seeThrough) params.set("seeThrough", "1");
  if (state.tour && TOUR_BY_ID[state.tour.id]) params.set("tour", `${state.tour.id}:${state.tour.step}`);
  if (state.camera) {
    params.set("camera", [...state.camera.position, ...state.camera.target].map(round2).join(","));
  }
  return params.toString();
}

export function parseAtlasState(search: string): AtlasUrlState {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const out: AtlasUrlState = {};
  const system = params.get("system");
  if (system && (system === "all" || SYSTEMS.some((s) => s.id === system))) {
    out.system = system as SystemFilter;
  }
  const part = params.get("part");
  if (part && PART_BY_ID[part]) out.part = part;
  const explode = Number(params.get("explode"));
  if (Number.isFinite(explode) && explode > 0) out.explode = Math.min(100, Math.max(0, explode));
  if (params.get("isolate") === "1") out.isolate = true;
  if (params.get("seeThrough") === "1") out.seeThrough = true;
  const tour = params.get("tour");
  if (tour) {
    const [id, stepRaw] = tour.split(":");
    const t = TOUR_BY_ID[id];
    const step = Number(stepRaw);
    if (t && Number.isInteger(step) && step >= 0 && step < t.steps.length) out.tour = { id, step };
  }
  const cam = params.get("camera");
  if (cam) {
    const nums = cam.split(",").map(Number);
    if (nums.length === 6 && nums.every((n) => Number.isFinite(n) && Math.abs(n) < 500)) {
      out.camera = {
        position: [nums[0], nums[1], nums[2]],
        target: [nums[3], nums[4], nums[5]],
      };
    }
  }
  return out;
}
