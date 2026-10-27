/**
 * AIRCRAFT ATLAS · CESSNA 172S SKYHAWK SP — part database, tours, checkride and pure helpers.
 *
 * Provenance policy (shown on every part):
 *  - "verified"  → published Cessna 172S type data / Pilot's Operating Handbook (POH) fact.
 *  - "reported"  → varies by serial number, avionics fit or modification — confirm in the
 *                  specific aircraft's POH supplements and maintenance records.
 *  - "schematic" → illustrative placement or routing in the 3D model, not to scale.
 *
 * The Atlas is a familiarisation aid. It never replaces the POH/AFM of the aircraft being flown.
 */

export type SystemId = "structure" | "powerplant" | "fuel" | "controls" | "gear" | "cockpit";
export type SystemFilter = SystemId | "all";
export type Provenance = "verified" | "reported" | "schematic";

export interface AtlasSystem {
  id: SystemId;
  label: string;
  glyph: string;
  color: string;
}

export const ALL_SYSTEMS_META = { label: "All systems", glyph: "✦", color: "#94A3B8" } as const;

export const SYSTEMS: AtlasSystem[] = [
  { id: "structure", label: "Airframe & structure", glyph: "◫", color: "#64748B" },
  { id: "powerplant", label: "Powerplant", glyph: "⚙", color: "#F97316" },
  { id: "fuel", label: "Fuel system", glyph: "◐", color: "#0EA5E9" },
  { id: "controls", label: "Flight controls", glyph: "✚", color: "#A855F7" },
  { id: "gear", label: "Landing gear & brakes", glyph: "▲", color: "#22C55E" },
  { id: "cockpit", label: "Cockpit & instruments", glyph: "◎", color: "#D97706" },
];

export const PROVENANCE_META: Record<Provenance, { label: string; color: string; blurb: string }> =
  {
    verified: {
      label: "POH fact",
      color: "#10B981",
      blurb: "Published Cessna 172S type data / Pilot's Operating Handbook.",
    },
    reported: {
      label: "Varies by aircraft",
      color: "#F59E0B",
      blurb: "Depends on serial, avionics fit or modifications — check the aircraft's own POH.",
    },
    schematic: {
      label: "Schematic",
      color: "#64748B",
      blurb: "Illustrative placement or routing — not to scale.",
    },
  };

export const FLEET_REGISTRATIONS = ["OY-AAA", "OY-BBB"] as const;

export const AIRFRAME = {
  label: "Cessna 172S",
  name: "Skyhawk SP",
  registration: "OY-AAA",
  serial: "172S-10492",
  heading: "AIRCRAFT ATLAS · CESSNA 172S",
  tagline: "Pull the airplane apart. See how it works.",
  specs: [
    { label: "Engine", value: "Lycoming IO-360-L2A · 180 hp" },
    { label: "Propeller", value: "McCauley 2-blade fixed pitch · 76 in" },
    { label: "Wingspan", value: "36 ft 1 in (11.0 m)" },
    { label: "Length", value: "27 ft 2 in (8.28 m)" },
    { label: "Height", value: "8 ft 11 in (2.72 m)" },
    { label: "Max takeoff weight", value: "2,550 lb" },
    { label: "Fuel", value: "56 US gal total · 53 usable" },
    { label: "Seats", value: "4" },
  ],
} as const;

export interface ProvenanceNote {
  source: string;
  fleet: string;
  model: string;
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

const SOURCE_DEFAULT =
  "Cessna 172S Pilot's Operating Handbook (POH/AFM) and published type data. Always use the POH for the specific aircraft serial number.";
const FLEET_DEFAULT =
  "Academy aircraft OY-AAA and OY-BBB are both Cessna 172S. Confirm equipment against each aircraft's own POH supplements and maintenance records.";
const MODEL_DEFAULT =
  "Procedural 3D model built to published 172S dimensions (span 36 ft 1 in, length 27 ft 2 in). Internal detail is simplified.";

export const PARTS: AtlasPart[] = [
  // ─────────────────────────── Airframe & structure (14) ───────────────────────────
  {
    id: "cabin-fuselage",
    name: "Cabin fuselage",
    system: "structure",
    provenance: "verified",
    what: "Semi-monocoque aluminium structure: formed bulkheads, stringers and a stressed skin share the loads. It carries the four seats and instrument panel, and provides the attach points for the wings, struts and main landing gear.",
    upstream: [],
    downstream: [
      "tailcone",
      "wing-l",
      "wing-r",
      "door-l",
      "door-r",
      "firewall",
      "main-gear-l",
      "main-gear-r",
      "strut-l",
      "strut-r",
    ],
    aliases: ["fuselage", "cabin", "airframe", "monocoque", "body"],
  },
  {
    id: "tailcone",
    name: "Tailcone",
    system: "structure",
    provenance: "verified",
    what: "The tapering aft fuselage behind the baggage area. It places the tail surfaces far behind the centre of gravity, so small tail forces give large pitching and yawing moments, and it carries the control cables to the elevator and rudder.",
    upstream: ["cabin-fuselage"],
    downstream: ["h-stab", "v-fin", "baggage-door"],
    aliases: ["aft fuselage", "tail cone", "empennage"],
  },
  {
    id: "firewall",
    name: "Firewall",
    system: "structure",
    provenance: "verified",
    what: "Fire-resistant steel bulkhead between the engine compartment and the cabin. It is the fire barrier and the attach structure for the engine mount and nose gear; everything that passes through it uses a sealed fitting.",
    upstream: ["cabin-fuselage"],
    downstream: ["engine-mount", "nose-gear", "battery", "fuel-strainer"],
    aliases: ["bulkhead", "fire wall"],
  },
  {
    id: "windshield",
    name: "Windshield",
    system: "structure",
    provenance: "verified",
    what: "One-piece acrylic windshield. Acrylic scratches easily and some solvents cause crazing, so it is cleaned only with approved cleaner and a soft cloth. The magnetic compass is mounted at its top centre.",
    upstream: ["cabin-fuselage"],
    downstream: ["compass"],
    aliases: ["windscreen", "acrylic", "plexiglass"],
  },
  {
    id: "rear-windows",
    name: "Side & rear windows",
    system: "structure",
    provenance: "verified",
    what: "Fixed acrylic side windows and the wraparound rear window behind the wing give the 172 its good all-round visibility. The door windows open for ventilation on the ground.",
    upstream: ["cabin-fuselage"],
    downstream: [],
    aliases: ["rear window", "side window", "omni-vision", "windows"],
  },
  {
    id: "door-l",
    name: "Left cabin door",
    system: "structure",
    provenance: "verified",
    what: "Pilot's entry door, hinged at the front with a window that opens. The POH notes that a door accidentally opening in flight because it was not latched does not in itself require a landing — fly the aircraft first.",
    upstream: ["cabin-fuselage"],
    downstream: [],
    aliases: ["pilot door", "left door", "door"],
  },
  {
    id: "door-r",
    name: "Right cabin door",
    system: "structure",
    provenance: "verified",
    what: "Front-passenger entry door, hinged at the front. Check it is fully latched during the before-takeoff checks; its window can be opened for ventilation on the ground.",
    upstream: ["cabin-fuselage"],
    downstream: [],
    aliases: ["passenger door", "right door"],
  },
  {
    id: "baggage-door",
    name: "Baggage door",
    system: "structure",
    provenance: "verified",
    what: "Lockable door on the left side, aft of the cabin, giving access to the baggage compartment. Baggage limits are placarded (120 lb total) and every item must be included in the weight-and-balance calculation.",
    upstream: ["tailcone"],
    downstream: [],
    aliases: ["baggage", "luggage", "cargo door"],
  },
  {
    id: "wing-l",
    name: "Left wing",
    system: "structure",
    provenance: "verified",
    what: "All-metal, strut-braced high wing built around front and rear spars, ribs and stressed skin. It contains the left fuel tank, carries the flap and aileron, and holds the pitot tube underneath and the stall-warning inlet in its leading edge.",
    upstream: ["cabin-fuselage", "strut-l"],
    downstream: ["aileron-l", "flap-l", "fuel-tank-l", "pitot-tube", "stall-warning", "fuel-vent"],
    aliases: ["wing", "left wing", "spar", "high wing"],
  },
  {
    id: "wing-r",
    name: "Right wing",
    system: "structure",
    provenance: "verified",
    what: "Mirror of the left wing: front and rear spars, ribs and skin, the right fuel tank, flap and aileron. The wing has slight dihedral and washout so the root stalls before the tips, keeping the ailerons effective at the stall.",
    upstream: ["cabin-fuselage", "strut-r"],
    downstream: ["aileron-r", "flap-r", "fuel-tank-r", "flap-motor"],
    aliases: ["right wing", "washout", "dihedral"],
  },
  {
    id: "strut-l",
    name: "Left wing strut",
    system: "structure",
    provenance: "verified",
    what: "Streamlined aluminium strut from the lower fuselage to the wing. In flight it carries much of the wing's lift load in tension, which lets the spar be lighter than a fully cantilevered wing's.",
    upstream: ["cabin-fuselage"],
    downstream: ["wing-l"],
    aliases: ["strut", "lift strut", "brace"],
  },
  {
    id: "strut-r",
    name: "Right wing strut",
    system: "structure",
    provenance: "verified",
    what: "Right-hand lift strut. On the walkaround, check the strut and its attach fittings at the fuselage and wing for security, dents and corrosion.",
    upstream: ["cabin-fuselage"],
    downstream: ["wing-r"],
    aliases: ["right strut"],
  },
  {
    id: "h-stab",
    name: "Horizontal stabilizer",
    system: "structure",
    provenance: "verified",
    what: "Fixed tailplane that provides pitch stability. In normal flight it produces a downward balancing force that counters the nose-down pitching moment of the wing and the forward centre of gravity.",
    upstream: ["tailcone"],
    downstream: ["elevator"],
    aliases: ["stabilizer", "tailplane", "horizontal tail"],
  },
  {
    id: "v-fin",
    name: "Vertical fin & dorsal fin",
    system: "structure",
    provenance: "verified",
    what: "Fixed fin giving directional (weathercock) stability. The dorsal fin fairing in front of it improves directional stability at large sideslip angles. The anti-collision beacon sits on top.",
    upstream: ["tailcone"],
    downstream: ["rudder"],
    aliases: ["fin", "vertical stabilizer", "dorsal", "beacon"],
  },

  // ─────────────────────────── Powerplant (13) ───────────────────────────
  {
    id: "cowling-upper",
    name: "Upper cowling",
    system: "powerplant",
    provenance: "verified",
    what: "Removable cover over the engine. Together with internal baffles it forces cooling air from the nose inlets down through the cylinder fins. The oil-dipstick access door is in the upper cowling.",
    upstream: ["firewall"],
    downstream: [],
    aliases: ["cowl", "cowling", "engine cover", "oil door"],
  },
  {
    id: "cowling-lower",
    name: "Lower cowling & nose cap",
    system: "powerplant",
    provenance: "verified",
    what: "Lower engine cover and nose cap. The nose cap carries the two cooling-air inlets either side of the spinner and the induction-air intake; heated cooling air leaves at the bottom rear of the cowling.",
    upstream: ["firewall"],
    downstream: ["air-induction"],
    aliases: ["nose cap", "lower cowl", "cooling inlet"],
  },
  {
    id: "engine",
    name: "Lycoming IO-360-L2A engine",
    system: "powerplant",
    provenance: "verified",
    what: "Four-cylinder, horizontally opposed, air-cooled, fuel-injected piston engine rated 180 hp at 2,700 RPM. It is direct drive: the crankshaft turns the propeller with no reduction gearbox.",
    upstream: ["engine-mount", "fuel-servo", "air-induction"],
    downstream: ["cylinders", "propeller", "alternator", "magnetos", "oil-system"],
    aliases: ["lycoming", "io-360", "io360", "crankcase", "motor", "180 hp"],
  },
  {
    id: "cylinders",
    name: "Cylinders & heads (×4)",
    system: "powerplant",
    provenance: "verified",
    what: "Each finned cylinder holds a piston, intake and exhaust valves and two spark plugs — one fired by each magneto. The fins shed heat into the cooling airflow; cylinder head (CHT) and exhaust gas (EGT) temperatures are monitored.",
    upstream: ["engine", "flow-divider", "magnetos"],
    downstream: ["exhaust"],
    aliases: ["cylinder", "piston", "valves", "spark plug", "cht", "egt"],
  },
  {
    id: "propeller",
    name: "Propeller",
    system: "powerplant",
    provenance: "verified",
    what: "McCauley two-blade, fixed-pitch metal propeller, 76 in diameter. A fixed blade angle is a compromise between climb and cruise performance, so RPM is set by the throttle and changes with airspeed.",
    upstream: ["engine"],
    downstream: ["spinner"],
    aliases: ["prop", "mccauley", "blade", "fixed pitch"],
  },
  {
    id: "spinner",
    name: "Spinner",
    system: "powerplant",
    provenance: "verified",
    what: "Aerodynamic fairing over the propeller hub. It smooths the airflow into the cooling inlets and is checked for cracks and security on the walkaround.",
    upstream: ["propeller"],
    downstream: [],
    aliases: ["hub", "nose cone"],
  },
  {
    id: "exhaust",
    name: "Exhaust & muffler",
    system: "powerplant",
    provenance: "verified",
    what: "Collects exhaust from all four cylinders into a muffler and tailpipe. A shroud around the muffler heats fresh air for cabin heat and windshield defrost — which is why a cracked muffler is a carbon-monoxide hazard.",
    upstream: ["cylinders"],
    downstream: [],
    aliases: ["muffler", "tailpipe", "cabin heat", "carbon monoxide", "co"],
  },
  {
    id: "magnetos",
    name: "Dual magnetos",
    system: "powerplant",
    provenance: "verified",
    what: "Two engine-driven magnetos generate ignition independently of the aircraft's electrical system; each fires one of the two plugs in every cylinder. The ignition switch selects OFF, R, L, BOTH and START, and the run-up mag check confirms both work.",
    upstream: ["engine"],
    downstream: ["cylinders"],
    aliases: ["magneto", "mags", "ignition", "mag check"],
  },
  {
    id: "starter",
    name: "Starter motor",
    system: "powerplant",
    provenance: "verified",
    what: "Electric motor that engages the ring gear to crank the engine when the ignition key is turned to START. It draws heavy current from the battery, so avoid prolonged cranking to prevent overheating.",
    upstream: ["battery"],
    downstream: ["engine"],
    aliases: ["starter", "ring gear", "cranking"],
  },
  {
    id: "alternator",
    name: "Alternator",
    system: "powerplant",
    provenance: "verified",
    what: "Engine-driven, belt-driven alternator that powers the 28-volt electrical system and recharges the battery. If it fails, the battery becomes the only source, so electrical load must be reduced.",
    upstream: ["engine"],
    downstream: ["battery"],
    aliases: ["generator", "electrical", "28 volt", "charging"],
  },
  {
    id: "oil-system",
    name: "Oil sump & cooler",
    system: "powerplant",
    provenance: "verified",
    what: "The wet sump under the engine holds the oil (8 US quart capacity) and an oil cooler on the rear baffle keeps its temperature in limits. Oil quantity is checked with the dipstick before every flight; pressure and temperature are monitored in flight.",
    upstream: ["engine"],
    downstream: [],
    aliases: ["oil", "sump", "dipstick", "oil cooler", "lubrication"],
  },
  {
    id: "air-induction",
    name: "Induction air filter & alternate air",
    system: "powerplant",
    provenance: "verified",
    what: "Ram air enters through a filter in the nose cap and is ducted to the fuel-injection servo and intake tubes. If the filter is blocked (for example by ice), an alternate air door opens to draw air from inside the cowling. Being fuel-injected, the engine has no carburettor heat.",
    upstream: ["cowling-lower"],
    downstream: ["fuel-servo"],
    aliases: ["air filter", "alternate air", "intake", "induction", "carb heat"],
  },
  {
    id: "engine-mount",
    name: "Engine mount",
    system: "powerplant",
    provenance: "verified",
    what: "Welded steel-tube frame bolted to the firewall. It carries the engine's weight and thrust through rubber shock mounts that isolate vibration from the airframe.",
    upstream: ["firewall"],
    downstream: ["engine"],
    aliases: ["mount", "engine frame", "shock mount"],
  },

  // ─────────────────────────── Fuel system (10) ───────────────────────────
  {
    id: "fuel-tank-l",
    name: "Left fuel tank",
    system: "fuel",
    provenance: "verified",
    what: "Vented, integral tank in the left wing. Total capacity is 56 US gal, of which 53 are usable, split equally between the wings. Quantity is confirmed visually at the filler cap and fuel is sampled at the quick-drains before flight.",
    upstream: ["wing-l", "fuel-vent"],
    downstream: ["fuel-lines"],
    aliases: ["tank", "left tank", "fuel cap", "56 gallons", "quick drain"],
  },
  {
    id: "fuel-tank-r",
    name: "Right fuel tank",
    system: "fuel",
    provenance: "verified",
    what: "Integral tank in the right wing, identical to the left. Each tank has quick-drains at its low points that are sampled for water and contamination on the walkaround.",
    upstream: ["wing-r", "fuel-vent"],
    downstream: ["fuel-lines"],
    aliases: ["right tank"],
  },
  {
    id: "fuel-vent",
    name: "Fuel vent",
    system: "fuel",
    provenance: "verified",
    what: "Vent tube under the left wing that lets air into the tanks as fuel is used. A blocked vent can restrict fuel flow, so it is checked clear on every preflight.",
    upstream: [],
    downstream: ["fuel-tank-l", "fuel-tank-r"],
    aliases: ["vent", "tank vent"],
  },
  {
    id: "fuel-lines",
    name: "Fuel lines",
    system: "fuel",
    provenance: "schematic",
    what: "Fuel flows from each wing tank down through the cabin door posts to the fuel selector valve, then forward through the firewall to the strainer and engine. The routing shown here is schematic.",
    upstream: ["fuel-tank-l", "fuel-tank-r"],
    downstream: ["fuel-selector"],
    aliases: ["fuel line", "plumbing", "feed line"],
  },
  {
    id: "fuel-selector",
    name: "Fuel selector valve",
    system: "fuel",
    provenance: "verified",
    what: "Floor-mounted valve between the front seats with LEFT, RIGHT, BOTH and OFF positions. The POH calls for BOTH for takeoff, climb, landing and manoeuvres.",
    upstream: ["fuel-lines"],
    downstream: ["fuel-shutoff"],
    aliases: ["selector", "fuel valve", "both", "left right both off"],
  },
  {
    id: "fuel-shutoff",
    name: "Fuel shutoff valve",
    system: "fuel",
    provenance: "verified",
    what: "Red push-pull knob near the selector that cuts all fuel to the engine. Pulled OFF in an engine fire; it must be pushed fully in (ON) for flight.",
    upstream: ["fuel-selector"],
    downstream: ["fuel-strainer"],
    aliases: ["shutoff", "fuel cutoff", "fire"],
  },
  {
    id: "fuel-strainer",
    name: "Fuel strainer",
    system: "fuel",
    provenance: "verified",
    what: "Filter and sump at the low point of the system on the firewall. Water and sediment collect here and are drained through a quick-drain during the walkaround.",
    upstream: ["fuel-shutoff"],
    downstream: ["aux-fuel-pump"],
    aliases: ["strainer", "gascolator", "sediment", "water"],
  },
  {
    id: "aux-fuel-pump",
    name: "Auxiliary fuel pump",
    system: "fuel",
    provenance: "verified",
    what: "Electric pump used to prime the engine before start and as a backup if the engine-driven pump fails. It is controlled by the FUEL PUMP switch on the panel.",
    upstream: ["fuel-strainer", "battery"],
    downstream: ["fuel-servo"],
    aliases: ["fuel pump", "boost pump", "electric pump", "prime"],
  },
  {
    id: "fuel-servo",
    name: "Fuel injection servo",
    system: "fuel",
    provenance: "verified",
    what: "Meters fuel in proportion to the air flowing through the throttle body. The engine-driven fuel pump supplies it, and the throttle and mixture controls set how much fuel is delivered.",
    upstream: ["aux-fuel-pump", "air-induction", "engine-controls"],
    downstream: ["flow-divider"],
    aliases: ["servo", "fuel injection", "throttle body", "injector"],
  },
  {
    id: "flow-divider",
    name: "Flow divider & injector nozzles",
    system: "fuel",
    provenance: "verified",
    what: "Sits on top of the engine and distributes metered fuel equally to one injector nozzle per cylinder through fine stainless lines.",
    upstream: ["fuel-servo"],
    downstream: ["cylinders"],
    aliases: ["spider", "injector nozzle", "distribution"],
  },

  // ─────────────────────────── Flight controls (12) ───────────────────────────
  {
    id: "aileron-l",
    name: "Left aileron",
    system: "controls",
    provenance: "verified",
    what: "Frise-type aileron on the outer trailing edge. Turning the yoke left raises the left aileron and lowers the right, rolling the aircraft left; the Frise nose shape and differential travel reduce adverse yaw.",
    upstream: ["control-cables", "wing-l"],
    downstream: [],
    aliases: ["aileron", "roll", "frise"],
  },
  {
    id: "aileron-r",
    name: "Right aileron",
    system: "controls",
    provenance: "verified",
    what: "Moves opposite to the left aileron. On the walkaround check it for freedom of movement, hinge security and that it moves the correct way relative to the yoke.",
    upstream: ["control-cables", "wing-r"],
    downstream: [],
    aliases: ["right aileron"],
  },
  {
    id: "flap-l",
    name: "Left flap",
    system: "controls",
    provenance: "verified",
    what: "Single-slot, electrically operated flap, 0° to 30° (10°, 20°, 30°). Flaps increase lift and drag for slower, steeper approaches; the white arc on the airspeed indicator is the flap operating range.",
    upstream: ["flap-motor", "wing-l"],
    downstream: [],
    aliases: ["flap", "flaps", "single slot", "30 degrees"],
  },
  {
    id: "flap-r",
    name: "Right flap",
    system: "controls",
    provenance: "verified",
    what: "Driven together with the left flap so both always move symmetrically. Check flap tracks, rollers and actuating rods on the walkaround with flaps lowered.",
    upstream: ["flap-motor", "wing-r"],
    downstream: [],
    aliases: ["right flap"],
  },
  {
    id: "elevator",
    name: "Elevator",
    system: "controls",
    provenance: "verified",
    what: "Hinged to the horizontal stabilizer and moved by fore-aft yoke motion through cables. Pulling back raises the elevator, pitching the nose up and increasing the wing's angle of attack.",
    upstream: ["control-cables", "h-stab"],
    downstream: ["trim-tab"],
    aliases: ["elevator", "pitch"],
  },
  {
    id: "trim-tab",
    name: "Elevator trim tab",
    system: "controls",
    provenance: "verified",
    what: "Small tab on the elevator trailing edge set by the trim wheel. Trim removes the need to hold a steady control pressure; it does not change the aircraft's inherent stability.",
    upstream: ["trim-wheel", "elevator"],
    downstream: [],
    aliases: ["trim", "tab", "trim tab"],
  },
  {
    id: "rudder",
    name: "Rudder",
    system: "controls",
    provenance: "verified",
    what: "Moved by the rudder pedals to control yaw: coordinating turns, countering the left-turning tendencies at high power, and controlling crosswind takeoffs and landings.",
    upstream: ["control-cables", "v-fin"],
    downstream: [],
    aliases: ["rudder", "yaw"],
  },
  {
    id: "yokes",
    name: "Control yokes",
    system: "controls",
    provenance: "verified",
    what: "Dual control wheels. Rotating a yoke drives the ailerons and moving it fore and aft drives the elevator, through cables, pulleys and bellcranks.",
    upstream: [],
    downstream: ["control-cables"],
    aliases: ["yoke", "control wheel", "stick", "column"],
  },
  {
    id: "rudder-pedals",
    name: "Rudder pedals & toe brakes",
    system: "controls",
    provenance: "verified",
    what: "The pedals move the rudder and steer the nosewheel. Pressing the top of a pedal applies that side's main-wheel brake, allowing differential braking.",
    upstream: [],
    downstream: ["control-cables", "nose-wheel", "brakes"],
    aliases: ["pedals", "toe brakes", "rudder pedal"],
  },
  {
    id: "control-cables",
    name: "Control cables & pulleys",
    system: "controls",
    provenance: "schematic",
    what: "Steel cables, pulleys and bellcranks connect the yokes and pedals to the control surfaces. The routing shown here is schematic.",
    upstream: ["yokes", "rudder-pedals"],
    downstream: ["aileron-l", "aileron-r", "elevator", "rudder"],
    aliases: ["cables", "pulleys", "bellcrank"],
  },
  {
    id: "flap-motor",
    name: "Flap motor & selector",
    system: "controls",
    provenance: "verified",
    what: "Electric motor in the wing that drives both flaps through push-pull rods, commanded by the flap selector on the instrument panel; a position indicator shows the flap angle.",
    upstream: ["battery"],
    downstream: ["flap-l", "flap-r"],
    aliases: ["flap motor", "flap switch", "actuator"],
    note: { model: "Motor location in the wing root is approximate in the 3D model." },
  },
  {
    id: "trim-wheel",
    name: "Elevator trim wheel",
    system: "controls",
    provenance: "verified",
    what: "Vertical wheel on the centre pedestal with a position indicator. Rolling it forward trims nose-down; set it to the takeoff position before departure.",
    upstream: [],
    downstream: ["trim-tab"],
    aliases: ["trim wheel", "pitch trim"],
  },

  // ─────────────────────────── Landing gear & brakes (9) ───────────────────────────
  {
    id: "main-gear-l",
    name: "Left main gear",
    system: "gear",
    provenance: "verified",
    what: "Tubular spring-steel leg that flexes to absorb landing loads, with the wheel, tyre and disc brake at its end. The leg itself is the spring, so no separate shock absorber is needed.",
    upstream: ["cabin-fuselage"],
    downstream: ["brakes", "fairing-l"],
    aliases: ["main gear", "spring steel", "main wheel", "tyre", "tire"],
  },
  {
    id: "main-gear-r",
    name: "Right main gear",
    system: "gear",
    provenance: "verified",
    what: "Mirror of the left main gear. Check the tyre for wear, cuts and correct inflation and the leg for cracks at its fuselage attachment.",
    upstream: ["cabin-fuselage"],
    downstream: ["brakes", "fairing-r"],
    aliases: ["right main gear"],
  },
  {
    id: "nose-gear",
    name: "Nose gear oleo strut",
    system: "gear",
    provenance: "verified",
    what: "Air/oil (oleo) shock strut attached to the engine-mount structure behind the firewall area. The walkaround checks it for proper extension and leaks; torque links keep the wheel aligned with the strut.",
    upstream: ["firewall"],
    downstream: ["nose-wheel", "shimmy-damper"],
    aliases: ["nose strut", "oleo", "torque link"],
  },
  {
    id: "nose-wheel",
    name: "Nosewheel & steering",
    system: "gear",
    provenance: "verified",
    what: "Steered by linkage from the rudder pedals through about 10° each side; differential braking increases this to about 30° each side for tight turns.",
    upstream: ["nose-gear", "rudder-pedals"],
    downstream: ["fairing-nose"],
    aliases: ["nosewheel", "steering", "nose wheel"],
  },
  {
    id: "shimmy-damper",
    name: "Shimmy damper",
    system: "gear",
    provenance: "verified",
    what: "Small hydraulic damper on the nose strut that stops the nosewheel oscillating rapidly from side to side (shimmy) at taxi and takeoff speeds.",
    upstream: ["nose-gear"],
    downstream: ["nose-wheel"],
    aliases: ["damper", "shimmy"],
  },
  {
    id: "brakes",
    name: "Main-wheel disc brakes",
    system: "gear",
    provenance: "verified",
    what: "Hydraulic single-disc brakes on each main wheel, each with its own master cylinder operated from the toe brakes. A parking brake holds pressure when set.",
    upstream: ["rudder-pedals"],
    downstream: [],
    aliases: ["brake", "disc brake", "parking brake", "caliper"],
  },
  {
    id: "fairing-l",
    name: "Left wheel fairing",
    system: "gear",
    provenance: "reported",
    what: "Speed fairing that reduces the drag of the main wheel. Mud, slush or ice packed inside a fairing can jam the wheel, so it is looked into on the walkaround.",
    upstream: ["main-gear-l"],
    downstream: [],
    aliases: ["wheel pant", "spat", "fairing"],
  },
  {
    id: "fairing-r",
    name: "Right wheel fairing",
    system: "gear",
    provenance: "reported",
    what: "Right main-wheel speed fairing. Some aircraft operate without fairings — performance figures in the POH assume the configuration stated there.",
    upstream: ["main-gear-r"],
    downstream: [],
    aliases: ["right wheel pant"],
  },
  {
    id: "fairing-nose",
    name: "Nosewheel fairing",
    system: "gear",
    provenance: "reported",
    what: "Speed fairing over the nosewheel. Check it is secure and clear of the tyre.",
    upstream: ["nose-wheel"],
    downstream: [],
    aliases: ["nose wheel pant"],
  },

  // ─────────────────────────── Cockpit & instruments (13) ───────────────────────────
  {
    id: "instrument-panel",
    name: "Instrument panel & glareshield",
    system: "cockpit",
    provenance: "verified",
    what: "Holds the flight displays, standby instruments, switches, engine controls and centre pedestal. The glareshield above it shades the displays from sunlight.",
    upstream: ["cabin-fuselage"],
    downstream: ["pfd", "mfd", "standby-instruments", "audio-panel", "engine-controls"],
    aliases: ["panel", "dashboard", "glareshield", "pedestal"],
  },
  {
    id: "pfd",
    name: "Primary flight display (PFD)",
    system: "cockpit",
    provenance: "reported",
    what: "On Garmin G1000-equipped 172S aircraft, the PFD in front of the pilot combines attitude, airspeed, altitude, vertical speed, heading and navigation. In reversionary mode it can also show engine data.",
    upstream: ["instrument-panel", "pitot-tube", "static-port", "battery"],
    downstream: [],
    aliases: ["pfd", "g1000", "glass cockpit", "attitude", "airspeed", "altimeter"],
    note: { fleet: "Avionics differ between 172S aircraft — some have analogue instruments instead of the G1000. Check the installed avionics supplement." },
  },
  {
    id: "mfd",
    name: "Multi-function display (MFD)",
    system: "cockpit",
    provenance: "reported",
    what: "Shows the moving map, flight plan, traffic and terrain pages and the engine indication system: RPM, fuel flow, oil pressure and temperature, EGT/CHT, fuel quantity and electrical data.",
    upstream: ["instrument-panel", "battery"],
    downstream: [],
    aliases: ["mfd", "moving map", "engine indication", "eis"],
  },
  {
    id: "standby-instruments",
    name: "Standby instruments",
    system: "cockpit",
    provenance: "reported",
    what: "Standby airspeed indicator, attitude indicator and altimeter that remain usable if the main displays fail. The airspeed indicator and altimeter use the pitot-static system directly.",
    upstream: ["pitot-tube", "static-port"],
    downstream: [],
    aliases: ["standby", "backup instruments", "steam gauges"],
    note: { model: "Panel position of the standby instruments is approximate." },
  },
  {
    id: "compass",
    name: "Magnetic compass",
    system: "cockpit",
    provenance: "verified",
    what: "Wet compass at the top of the windshield that needs no power. It has turning and acceleration errors, and a deviation card shows the corrections for the aircraft's own magnetic field.",
    upstream: ["windshield"],
    downstream: [],
    aliases: ["compass", "deviation card", "whiskey compass"],
  },
  {
    id: "engine-controls",
    name: "Throttle & mixture",
    system: "cockpit",
    provenance: "verified",
    what: "Push-pull controls on the lower centre panel. The black throttle sets power; the red mixture sets the fuel/air ratio and is pulled to idle cut-off to stop the engine.",
    upstream: ["instrument-panel"],
    downstream: ["fuel-servo"],
    aliases: ["throttle", "mixture", "power", "idle cutoff"],
  },
  {
    id: "front-seats",
    name: "Front seats",
    system: "cockpit",
    provenance: "verified",
    what: "Adjustable pilot and front-passenger seats on rails, with lap belts and shoulder harnesses. Confirm the seat is locked on its rail before flight — a seat sliding back during takeoff can pull the pilot away from the controls.",
    upstream: ["cabin-fuselage"],
    downstream: [],
    aliases: ["seat", "seats", "harness", "seat rail"],
  },
  {
    id: "rear-seat",
    name: "Rear seats",
    system: "cockpit",
    provenance: "verified",
    what: "Seating for two rear passengers. Their weight acts well aft of the datum, so it has a large moment in the weight-and-balance calculation.",
    upstream: ["cabin-fuselage"],
    downstream: [],
    aliases: ["rear seat", "back seat", "passengers"],
  },
  {
    id: "pitot-tube",
    name: "Pitot tube",
    system: "cockpit",
    provenance: "verified",
    what: "Under the left wing, facing into the airflow, it senses total (ram) pressure for the airspeed indicator. Remove the cover and check it clear on the walkaround; pitot heat, where installed, keeps it free of ice.",
    upstream: ["wing-l"],
    downstream: ["pfd", "standby-instruments"],
    aliases: ["pitot", "airspeed", "pitot heat", "ram pressure"],
  },
  {
    id: "static-port",
    name: "Static port",
    system: "cockpit",
    provenance: "verified",
    what: "Flush port on the left side of the forward fuselage sensing ambient static pressure for the altimeter, vertical speed and airspeed indications. An alternate static source in the cabin is used if it becomes blocked.",
    upstream: ["cabin-fuselage"],
    downstream: ["pfd", "standby-instruments"],
    aliases: ["static", "alternate static", "static source"],
  },
  {
    id: "stall-warning",
    name: "Stall warning horn",
    system: "cockpit",
    provenance: "verified",
    what: "Pneumatic reed horn. As the wing approaches the stall, low pressure at an inlet in the left wing leading edge draws air through a reed, sounding a horn in the cabin about 5 to 10 knots before the stall.",
    upstream: ["wing-l"],
    downstream: [],
    aliases: ["stall horn", "stall warning", "reed"],
  },
  {
    id: "battery",
    name: "Battery & master switch",
    system: "cockpit",
    provenance: "verified",
    what: "24-volt battery that supplies power for starting and backs up the alternator. The split master switch (ALT and BAT) connects them to the bus, and the avionics switch powers the avionics.",
    upstream: ["alternator"],
    downstream: ["starter", "pfd", "mfd", "aux-fuel-pump", "flap-motor"],
    aliases: ["battery", "master", "electrical", "bus"],
    note: { model: "Battery placement on the firewall is approximate in the 3D model." },
  },
  {
    id: "audio-panel",
    name: "Audio panel & autopilot",
    system: "cockpit",
    provenance: "reported",
    what: "The audio panel selects which radios are heard and transmitted on and runs the intercom. Many 172S aircraft also have an autopilot; the model fitted varies, so use its own POH supplement.",
    upstream: ["instrument-panel", "battery"],
    downstream: [],
    aliases: ["audio", "intercom", "autopilot", "radio"],
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
  const source = part.note?.source ?? SOURCE_DEFAULT;
  const fleet = part.note?.fleet ?? FLEET_DEFAULT;
  const model = part.note?.model ?? MODEL_DEFAULT;
  return {
    source,
    fleet,
    model,
    registry: source,
    listing: fleet,
    schematic: model,
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
  | "engine"
  | "underside"
  | "tail";

export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
}

export const CAMERA_PRESETS: { id: CameraPresetId; label: string; pose: CameraPose }[] = [
  { id: "threeQuarter", label: "Three-quarter", pose: { position: [7.6, 4.1, 8.6], target: [0, 1.15, 0.2] } },
  { id: "nose", label: "Nose", pose: { position: [1.4, 1.7, 10.5], target: [0, 1.25, 1.2] } },
  { id: "leftSide", label: "Left side", pose: { position: [11.5, 1.7, -0.1], target: [0, 1.3, -0.1] } },
  { id: "plan", label: "Plan", pose: { position: [0, 15.5, 0.05], target: [0, 1.0, 0] } },
  { id: "rear", label: "Rear", pose: { position: [-2.2, 2.8, -10.5], target: [0, 1.4, 0] } },
  { id: "cockpit", label: "Cockpit", pose: { position: [0.27, 1.56, 1.02], target: [0.18, 1.24, 2.6] } },
  { id: "engine", label: "Engine bay", pose: { position: [3.1, 2.3, 5.4], target: [0, 1.12, 2.95] } },
  { id: "underside", label: "Underside", pose: { position: [3.2, -4.8, 3.4], target: [0, 0.8, 0.6] } },
  { id: "tail", label: "Tail", pose: { position: [4.6, 3.3, -7.8], target: [0, 1.65, -3.5] } },
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
    id: "walkaround",
    title: "Preflight walkaround",
    summary: "Follow the POH exterior inspection around the 172S — cabin, tail, right wing, nose, left wing.",
    steps: [
      {
        title: "1 · Cabin first",
        body: "The POH inspection starts inside: control lock removed, ignition OFF, master ON to check fuel quantity and lower the flaps, then master OFF. Fuel selector BOTH and fuel shutoff valve ON (pushed fully in).",
        partId: "fuel-selector",
        system: "all",
        explode: 0,
        seeThrough: true,
        isolate: false,
        camera: "cockpit",
        focus: false,
      },
      {
        title: "2 · Empennage",
        body: "Remove the rudder gust lock if fitted and untie the tail. Check the elevator, trim tab and rudder for freedom of movement, security and damage.",
        partId: "rudder",
        system: "controls",
        explode: 0,
        seeThrough: false,
        isolate: false,
        camera: "tail",
        focus: false,
      },
      {
        title: "3 · Right wing",
        body: "Check the flap and aileron for security and freedom, untie the wing, check the main-wheel tyre, sample the tank quick-drains, and confirm fuel quantity visually with the cap secured.",
        partId: "flap-r",
        system: "all",
        explode: 0,
        seeThrough: false,
        isolate: false,
        camera: "rear",
        focus: true,
      },
      {
        title: "4 · Nose",
        body: "Check oil quantity on the dipstick, drain the fuel strainer, inspect the propeller and spinner for nicks and security, the air filter for blockage, the nose strut for proper extension and the nosewheel tyre.",
        partId: "propeller",
        system: "powerplant",
        explode: 0,
        seeThrough: false,
        isolate: false,
        camera: "nose",
        focus: false,
      },
      {
        title: "5 · Left wing",
        body: "Remove the pitot cover and check the pitot tube clear, check the fuel vent clear, test the stall-warning horn, and check the left tank, aileron, flap and main gear as on the right side.",
        partId: "pitot-tube",
        system: "all",
        explode: 0,
        seeThrough: false,
        isolate: false,
        camera: "underside",
        focus: true,
      },
      {
        title: "6 · Ready for start",
        body: "With every item checked the aircraft is ready for the before-start checklist. Always work from the printed checklist, not memory.",
        partId: null,
        system: "all",
        explode: 0,
        seeThrough: false,
        isolate: false,
        camera: "threeQuarter",
        focus: false,
      },
    ],
  },
  {
    id: "trace-fuel",
    title: "Trace the fuel: tank to cylinder",
    summary: "Follow 100LL from the wing tanks through the selector, strainer and servo to the injector nozzles.",
    steps: [
      {
        title: "1 · Wing tanks",
        body: "Fuel is carried in integral tanks in both wings — 56 US gal in total, 53 usable. The vent under the left wing lets air in as fuel is used.",
        partId: "fuel-tank-l",
        system: "fuel",
        explode: 25,
        seeThrough: true,
        isolate: false,
        camera: "threeQuarter",
        focus: true,
      },
      {
        title: "2 · Down the door posts",
        body: "Lines run from each tank down through the cabin door posts to the floor (routing shown is schematic).",
        partId: "fuel-lines",
        system: "fuel",
        explode: 0,
        seeThrough: true,
        isolate: true,
        camera: "leftSide",
        focus: false,
      },
      {
        title: "3 · Selector & shutoff",
        body: "The selector chooses LEFT, RIGHT or BOTH tanks (BOTH for takeoff and landing). The red shutoff valve downstream cuts all fuel in an emergency.",
        partId: "fuel-selector",
        system: "fuel",
        explode: 0,
        seeThrough: true,
        isolate: true,
        camera: "cockpit",
        focus: true,
      },
      {
        title: "4 · Strainer",
        body: "Through the firewall the fuel reaches the strainer — the system's low point — where water and sediment are drained before flight.",
        partId: "fuel-strainer",
        system: "fuel",
        explode: 30,
        seeThrough: true,
        isolate: true,
        camera: "engine",
        focus: true,
      },
      {
        title: "5 · Pumps & servo",
        body: "The electric auxiliary pump primes and backs up the engine-driven pump. The servo then meters fuel against the measured airflow, as set by throttle and mixture.",
        partId: "fuel-servo",
        system: "fuel",
        explode: 30,
        seeThrough: true,
        isolate: true,
        camera: "engine",
        focus: true,
      },
      {
        title: "6 · Flow divider",
        body: "On top of the engine the flow divider sends equal fuel to one injector nozzle per cylinder.",
        partId: "flow-divider",
        system: "fuel",
        explode: 30,
        seeThrough: true,
        isolate: true,
        camera: "engine",
        focus: true,
      },
      {
        title: "7 · Into the cylinders",
        body: "Injected fuel mixes with induction air in each cylinder and is ignited by two spark plugs — one from each magneto.",
        partId: "cylinders",
        system: "powerplant",
        explode: 45,
        seeThrough: false,
        isolate: false,
        camera: "engine",
        focus: true,
      },
    ],
  },
  {
    id: "cockpit",
    title: "Inside the cockpit",
    summary: "Sit in the left seat and learn the panel: displays, standby instruments, engine and flight controls.",
    steps: [
      {
        title: "1 · The panel",
        body: "From the left seat: flight displays in front, engine controls and the trim wheel on the centre pedestal, rudder pedals below.",
        partId: "instrument-panel",
        system: "cockpit",
        explode: 0,
        seeThrough: true,
        isolate: false,
        camera: "cockpit",
        focus: false,
      },
      {
        title: "2 · Primary flight display",
        body: "On G1000 aircraft the PFD shows attitude, airspeed, altitude, vertical speed and heading in one scan.",
        partId: "pfd",
        system: "cockpit",
        explode: 0,
        seeThrough: true,
        isolate: false,
        camera: "cockpit",
        focus: false,
      },
      {
        title: "3 · Multi-function display",
        body: "The MFD carries the moving map and the engine indications — RPM, fuel flow, oil pressure and temperature, EGT/CHT and fuel quantity.",
        partId: "mfd",
        system: "cockpit",
        explode: 0,
        seeThrough: true,
        isolate: false,
        camera: "cockpit",
        focus: false,
      },
      {
        title: "4 · Throttle & mixture",
        body: "Black throttle for power, red mixture for the fuel/air ratio — pulled to idle cut-off to shut the engine down.",
        partId: "engine-controls",
        system: "cockpit",
        explode: 0,
        seeThrough: true,
        isolate: false,
        camera: "cockpit",
        focus: false,
      },
      {
        title: "5 · Yokes & pedals",
        body: "The yoke rolls (ailerons) and pitches (elevator); the pedals yaw the aircraft, steer the nosewheel and work the toe brakes. Try the Control check demo to see the surfaces move.",
        partId: "yokes",
        system: "controls",
        explode: 0,
        seeThrough: true,
        isolate: false,
        camera: "cockpit",
        focus: false,
      },
      {
        title: "6 · Standby & compass",
        body: "If the displays fail, the standby airspeed, attitude and altimeter remain, and the magnetic compass needs no power at all.",
        partId: "standby-instruments",
        system: "cockpit",
        explode: 0,
        seeThrough: true,
        isolate: false,
        camera: "cockpit",
        focus: false,
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
    system: "powerplant",
    prompt: "Which engine powers the Cessna 172S?",
    options: [
      "Continental O-300, 145 hp",
      "Lycoming O-320, 160 hp",
      "Lycoming IO-360-L2A, 180 hp",
      "Rotax 914, 115 hp",
    ],
    answerIndex: 2,
    explanation: "The 172S uses the fuel-injected Lycoming IO-360-L2A rated 180 hp at 2,700 RPM.",
    partId: "engine",
  },
  {
    id: "q2",
    kind: "locate",
    system: "fuel",
    prompt: "Locate on the aircraft: the fuel selector valve.",
    accept: ["fuel-selector"],
    explanation: "It sits on the cabin floor between the front seats.",
    partId: "fuel-selector",
  },
  {
    id: "q3",
    kind: "mcq",
    system: "fuel",
    prompt: "Which fuel selector position does the POH call for during takeoff and landing?",
    options: ["LEFT", "RIGHT", "BOTH", "OFF"],
    answerIndex: 2,
    explanation: "BOTH is used for takeoff, climb, landing and manoeuvres.",
    partId: "fuel-selector",
  },
  {
    id: "q4",
    kind: "locate",
    system: "cockpit",
    prompt: "Locate on the aircraft: the pitot tube.",
    accept: ["pitot-tube"],
    explanation: "It is under the left wing, facing forward into the airflow.",
    partId: "pitot-tube",
  },
  {
    id: "q5",
    kind: "mcq",
    system: "controls",
    prompt: "What is the maximum flap setting on the 172S?",
    options: ["20°", "30°", "40°", "45°"],
    answerIndex: 1,
    explanation: "The 172S flaps travel 0° to 30° (10°, 20°, 30°).",
    partId: "flap-l",
  },
  {
    id: "q6",
    kind: "locate",
    system: "controls",
    prompt: "Locate on the aircraft: the elevator trim tab.",
    accept: ["trim-tab"],
    explanation: "The small tab on the trailing edge of the elevator, set by the trim wheel.",
    partId: "trim-tab",
  },
  {
    id: "q7",
    kind: "mcq",
    system: "gear",
    prompt: "How is the 172S nosewheel steered on the ground?",
    options: [
      "With a tiller in the cockpit",
      "Through the rudder pedals, with differential braking for tighter turns",
      "It castors freely — steering by brakes only",
      "Electrically, from the yoke",
    ],
    answerIndex: 1,
    explanation: "Pedal linkage steers about 10° each side; differential braking extends this to about 30°.",
    partId: "nose-wheel",
  },
  {
    id: "q8",
    kind: "locate",
    system: "cockpit",
    prompt: "Locate on the aircraft: the static port.",
    accept: ["static-port"],
    explanation: "A flush port on the left side of the forward fuselage.",
    partId: "static-port",
  },
  {
    id: "q9",
    kind: "mcq",
    system: "powerplant",
    prompt: "The IO-360 is fuel-injected. What keeps induction air flowing if the air filter becomes blocked by ice?",
    options: ["Carburettor heat", "The alternate air door", "Propeller de-ice", "Pitot heat"],
    answerIndex: 1,
    explanation: "An alternate air door opens to draw air from inside the cowling. There is no carburettor to heat.",
    partId: "air-induction",
  },
  {
    id: "q10",
    kind: "mcq",
    system: "cockpit",
    prompt: "How does the 172S stall warning work?",
    options: [
      "An electric vane switch on the right wing",
      "A pneumatic reed horn fed from an inlet in the left wing leading edge",
      "An angle-of-attack computer in the PFD",
      "A stick shaker on the yoke",
    ],
    answerIndex: 1,
    explanation: "Low pressure at the leading-edge inlet draws air through a reed, sounding the horn 5–10 knots before the stall.",
    partId: "stall-warning",
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
    return { found: false, answer: "Ask about a part or system of the Cessna 172S.", citations: [] };
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
        "The Atlas database doesn't cover that. Try a named part — e.g. fuel selector, magnetos, pitot tube, flaps or stall warning.",
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
