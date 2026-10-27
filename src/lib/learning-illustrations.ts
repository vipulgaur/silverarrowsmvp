import fig0101 from "@/assets/learning/fig-01-01.jpg";
import fig0102 from "@/assets/learning/fig-01-02.jpg";
import fig0103 from "@/assets/learning/fig-01-03.jpg";
import fuelSamplingArtwork from "@/assets/learning/fuel-sampling-original.jpg";
import walkAroundArtwork from "@/assets/learning/walk-around-original.jpg";

export interface FigurePart {
  id: string;
  number: number;
  x: number;
  y: number;
  label: string;
  detail: string;
}

export interface FigureAsset {
  src: string;
  alt: string;
  parts: FigurePart[];
}

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

const ch1Assets: Record<string, FigureAsset> = {
  "Fig-01-01": {
    src: fig0101,
    alt: "Principal Components of the Training Aeroplane",
    parts: defaultParts("Fig-01-01", [
      [
        22,
        42,
        "Powerplant & Cowling",
        "Houses the horizontally opposed piston engine, propeller hub, and cooling air intakes.",
      ],
      [
        48,
        38,
        "Mainplane & Cockpit",
        "Generates aerodynamic lift and houses fuel tanks, flaps, and outboard ailerons.",
      ],
      [
        78,
        32,
        "Empennage (Tail Unit)",
        "Vertical fin, rudder, tailplane, and elevator providing directional and longitudinal stability.",
      ],
    ]),
  },
  "Fig-01-02": {
    src: fig0102,
    alt: "Standard Six-Pack Flight Instrument Panel",
    parts: defaultParts("Fig-01-02", [
      [
        28,
        35,
        "Airspeed Indicator (ASI)",
        "Measures dynamic pressure from pitot-static differential to display Indicated Airspeed (IAS).",
      ],
      [
        50,
        35,
        "Attitude Indicator (AI)",
        "Gyroscopic artificial horizon displaying pitch and bank attitude relative to the horizon.",
      ],
      [
        72,
        35,
        "Sensitive Altimeter",
        "Measures static pressure to indicate vertical altitude above the selected pressure datum.",
      ],
    ]),
  },
  "Fig-01-03": {
    src: fig0103,
    alt: "Primary Control Linkages and Trim Tab Operation",
    parts: defaultParts("Fig-01-03", [
      [
        25,
        50,
        "Control Column",
        "Fore-and-aft motion actuates the elevator; lateral rotation actuates the ailerons differentially.",
      ],
      [
        52,
        60,
        "Rudder Pedals & Cables",
        "Left/right foot input yaws the nose about the normal axis and steers the nosewheel on the ground.",
      ],
      [
        80,
        44,
        "Elevator Trim Tab",
        "Hinged auxiliary tab at the elevator trailing edge that aerodynamically holds the desired pitch attitude.",
      ],
    ]),
  },
  "Fig-01-04": {
    src: fig0101,
    alt: "Throttle Quadrant, Mixture and Carburettor Heat Controls",
    parts: defaultParts("Fig-01-04", [
      [
        30,
        48,
        "Throttle Plunger (Black)",
        "Controls butterfly valve opening and manifold/RPM power output.",
      ],
      [
        52,
        48,
        "Mixture Control (Red)",
        "Adjusts fuel-to-air ratio for altitude leaning and idle cut-off shutdown.",
      ],
      [
        74,
        52,
        "Carburettor Heat",
        "Routes unfiltered heated air from the exhaust shroud to prevent or clear carburettor icing.",
      ],
    ]),
  },
  "Fig-01-05": {
    src: fig0102,
    alt: "Training Aeroplane Fuel System Schematic",
    parts: defaultParts("Fig-01-05", [
      [
        26,
        36,
        "Wing Fuel Tanks & Vents",
        "Left and right wing tanks vented to ambient air to prevent vacuum lock during fuel draw.",
      ],
      [
        50,
        62,
        "Fuel Selector Valve",
        "Allows selection of LEFT, RIGHT, BOTH, or OFF for fuel management and emergency isolation.",
      ],
      [
        75,
        55,
        "Gascolator / Strainer Drain",
        "Lowest point of the fuel system where water and sediment collect for pre-flight sampling.",
      ],
    ]),
  },
  "Fig-01-06": {
    src: fig0103,
    alt: "DC Electrical Bus, Master Switch and Ammeter",
    parts: defaultParts("Fig-01-06", [
      [
        24,
        44,
        "Split Master Switch (BAT/ALT)",
        "Independently controls battery contactor and alternator field excitation.",
      ],
      [
        52,
        46,
        "Ammeter / Loadmeter",
        "Indicates battery charging rate or alternator load current on the primary bus.",
      ],
      [
        78,
        50,
        "Pull-Reset Circuit Breakers",
        "Protect individual avionics and lighting circuits against electrical overload.",
      ],
    ]),
  },
  "Fig-01-07": {
    src: fig0101,
    alt: "Pitot-Static Pressure Lines and Gyro Supply",
    parts: defaultParts("Fig-01-07", [
      [
        22,
        45,
        "Pitot Head & Heater",
        "Faces into the relative airflow to capture total (ram + static) pressure for the ASI.",
      ],
      [
        50,
        52,
        "Flush Static Vent",
        "Senses undisturbed atmospheric static pressure for the ASI, Altimeter, and VSI.",
      ],
      [
        76,
        48,
        "Vacuum Pump & Suction Gauge",
        "Maintains 4.5–5.5 inHg suction to spin the Attitude and Direction Indicator gyros.",
      ],
    ]),
  },
  "Fig-01-08": {
    src: fig0102,
    alt: "Tricycle Undercarriage and Differential Toe Brakes",
    parts: defaultParts("Fig-01-08", [
      [
        28,
        58,
        "Oleo-Pneumatic Nose Strut",
        "Absorbs taxi shocks with compressed nitrogen and hydraulic fluid; incorporates shimmy damper.",
      ],
      [
        54,
        62,
        "Main Gear Struts & Disc Brakes",
        "Carry the primary landing load and house hydraulic callipers on each main wheel.",
      ],
      [
        76,
        42,
        "Differential Toe Cylinders",
        "Pressing the top of either rudder pedal applies independent braking to assist tight turns.",
      ],
    ]),
  },
  "Fig-01-09": {
    src: fig0103,
    alt: "Cockpit Scan Flow and Checklist Discipline",
    parts: defaultParts("Fig-01-09", [
      [
        25,
        68,
        "Floor & Fuel Selector Start",
        "Begin cockpit scan at fuel selector and trim wheel on the centre floor console.",
      ],
      [
        50,
        42,
        "Flight & Engine Panel Sweep",
        "Scan left-to-right across switches, flight instruments, avionics, and engine gauges.",
      ],
      [
        75,
        28,
        "Written Checklist Verification",
        "Confirm every flow item with challenge-and-response reading from the laminated checklist.",
      ],
    ]),
  },
};

const ch2Assets: Record<string, FigureAsset> = {
  "Fig-02-01": {
    src: fuelSamplingArtwork,
    alt: "Fuel Sampling and Water Contamination Check",
    parts: defaultParts("Fig-02-01", [
      [
        48,
        30,
        "AVGAS 100LL (Blue Upper Layer)",
        "Clean 100LL aviation gasoline is dyed pale blue and floats above any water contamination.",
      ],
      [
        50,
        56,
        "Water Settlement Meniscus",
        "Water is denser than AVGAS and settles at the bottom of the tester cup with a distinct separation line.",
      ],
      [
        52,
        76,
        "Strainer Pin & Sediment Check",
        "Inspect the base of the sample cup against a bright background for rust, grit, or cloudiness.",
      ],
    ]),
  },
  "Fig-02-02": {
    src: walkAroundArtwork,
    alt: "Complete External Walk-Around Inspection Stations",
    parts: defaultParts("Fig-02-02", [
      [
        35,
        58,
        "Station 1: Cabin & Port Wing",
        "Confirm magnetos OFF, master check complete, flap tracks, aileron hinges, fuel cap security, and pitot head.",
      ],
      [
        20,
        45,
        "Station 2: Nose, Propeller & Oil",
        "Inspect propeller blades for nicks, alternator belt tension, oil dipstick quantity, and nose strut extension.",
      ],
      [
        75,
        42,
        "Station 3: Starboard Wing & Empennage",
        "Check starboard fuel drain, main tyre condition, static vent, rudder cable freedom, and elevator lock removal.",
      ],
    ]),
  },
};

const ch3Assets: Record<string, FigureAsset> = Object.fromEntries(
  Array.from({ length: 5 }, (_, i) => {
    const id = `Fig-03-0${i + 1}`;
    const imgs = [fig0101, fig0102, fig0103];
    return [
      id,
      {
        src: imgs[i % imgs.length],
        alt: `Chapter 3 Aerodynamic Control Figure ${i + 1}`,
        parts: defaultParts(id, [
          [
            26,
            40,
            "Relative Airflow & Aerofoil",
            "Oncoming airflow vector meeting the leading edge at the current angle of attack.",
          ],
          [
            52,
            48,
            "Control Surface Deflection",
            "Deflection alters camber and local pressure distribution, generating a moment about the CoG.",
          ],
          [
            78,
            52,
            "Resultant Aircraft Response",
            "Primary and secondary aerodynamic rotation about the lateral, longitudinal, or normal axis.",
          ],
        ]),
      },
    ];
  }),
);

const ch4Assets: Record<string, FigureAsset> = Object.fromEntries(
  Array.from({ length: 26 }, (_, i) => {
    const id = `Fig-04-${String(i + 1).padStart(2, "0")}`;
    const imgs = [fig0101, fig0102, fig0103];
    return [
      id,
      {
        src: imgs[i % imgs.length],
        alt: `Taxying, Straight-and-Level and Attitude Control Figure ${i + 1}`,
        parts: defaultParts(id, [
          [
            28,
            42,
            "Horizon Datum Attitude",
            "Nose cowling position relative to the natural horizon and wing-tip reference.",
          ],
          [
            52,
            50,
            "Power & Airspeed Balance",
            "Selected RPM setting balanced against drag for level flight or controlled taxi speed.",
          ],
          [
            76,
            46,
            "Trim & Rudder Coordination",
            "Slip ball centred with rudder pedals and control column forces trimmed to neutral.",
          ],
        ]),
      },
    ];
  }),
);

import { airframesFigureAssets } from "@/lib/airframes-illustrations";
import { electricsFigureAssets } from "@/lib/electrics-illustrations";
import { powerplantFigureAssets } from "@/lib/powerplant-illustrations";
import { airlawFigureAssets } from "@/lib/airlaw-illustrations";

export const figureAssets: Record<string, FigureAsset> = {
  ...ch1Assets,
  ...ch2Assets,
  ...ch3Assets,
  ...ch4Assets,
  ...airframesFigureAssets,
  ...electricsFigureAssets,
  ...powerplantFigureAssets,
  ...airlawFigureAssets,
};

export { airframesFigureAssets, electricsFigureAssets, powerplantFigureAssets, airlawFigureAssets };
