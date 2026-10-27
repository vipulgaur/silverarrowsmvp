# Chapter 11: Piston Engines — Performance and Power Augmentation

## 1. Engine Performance

The quantity of fuel–air charge admitted to a cylinder is a major determinant of piston-engine power. Consequently, **air density, pressure and temperature** influence the mass of charge an engine can burn during a given period.

At increasing altitude, atmospheric pressure and density generally fall, while temperature normally decreases through the lower atmosphere. At standard sea-level conditions (**ISA**), the reference values are:

| Property | ISA sea-level value |
|---|---|
| Temperature | +15°C |
| Pressure | 1013.25 mb (hPa) |
| Pressure in mercury | 29.92 in Hg |
| Pressure in pounds per square inch | Approximately 14.69 lb/in² |
| Air density | 1.225 kg/m³ (1225 g/m³) |

Atmospheric pressure exists because of the weight of the air column above a location. With greater height, less air remains overhead, so pressure decreases. Atmospheric heating originates substantially at the Earth's surface; therefore, temperature also usually becomes lower with height.

### 1.1 Normal Temperature and Pressure (NTP)

Temperature may be stated in Celsius (Centigrade), Fahrenheit or Kelvin, making unit conversion necessary in different calculations and operating references. **Normal Temperature and Pressure (NTP)** provides an agreed reference condition when considering the properties of fluids, unless other conditions have been specified.

For comparable engine-performance checks anywhere in the world, manufacturers publish standard maximum-power and engine-speed figures referenced to **ISA sea-level conditions**. Actual temperatures and pressures must be considered when comparing an engine's observed performance with these ratings.

### 1.2 Density Altitude

**Density altitude** is the level in the standard atmosphere at which the air density equals the density currently encountered. It can also be understood as the ISA altitude corresponding to the existing combination of pressure and temperature. Engine-performance charts use it because engines respond to air density rather than airfield elevation alone.

Density altitude can be obtained from an airspeed correction chart or navigational computer. A useful approximate rule is to increase pressure altitude by **118 ft for each degree Celsius that actual temperature exceeds ISA temperature**.

**Example:** At an aerodrome elevation and pressure altitude of 5,500 ft, with QNH approximately 1013 mb and temperature **ISA +30°C**:

- ISA temperature near 5,500 ft is approximately **+4°C**.
- Actual temperature is therefore approximately **+34°C**.
- Temperature excess is **30°C**.
- Density-altitude increment is **30 × 118 = 3,540 ft**.
- Approximate density altitude is **5,500 + 3,540 = 9,040 ft**.

The navigational-computer method, using **5,500 ft pressure altitude** and **+34°C**, gives approximately **9,000 ft density altitude**. Air hotter than standard has lower density and behaves, from the engine's perspective, like air at a higher altitude.

## 2. Superchargers and Turbochargers

An engine develops power according to the **mass of combustible mixture** passing through its cylinders. The mass entering on each induction stroke is affected by manifold pressure and charge temperature.

Even at fully open throttle, a **normally aspirated engine** experiences an intake-pressure loss through its ducts. Its manifold pressure is therefore a little below ambient pressure and falls as the aircraft climbs. Reduced exhaust back pressure can improve cylinder scavenging at altitude, partially offsetting the power loss, but the overall trend is downward.

**Supercharging** increases intake-manifold pressure artificially, either to improve power for take-off and initial climb or to preserve useful power at higher altitudes.

Two operating aims are distinguished:

- **Ground boosting:** Additional pressure is provided to obtain more than the normal sea-level power. The engine must withstand the accompanying higher combustion pressures and therefore requires sufficient structural strength.
- **Altitude boosting:** A supercharging system sustains approximately sea-level power at considerable height. At low altitude, controls must prevent dangerously high charging and combustion pressures.

Aircraft installations commonly use a **centrifugal compressor**. It may receive drive from the engine crankshaft (**internally driven supercharger**) or an exhaust-powered turbine (**externally driven turbocharger**). Some designs combine the methods. In the arrangements considered here, the internally driven unit compresses the fuel–air **mixture**, whereas the turbocharger compresses **air**.

### 2.1 Centrifugal Compressors

The centrifugal design is relatively light, dependable, mechanically strong and capable of moving a large airflow while running at high speed. Its two main parts are:

1. **Impeller:** The rotating vaned component that draws air into its central **eye** and accelerates it outward, converting mechanical drive energy into velocity (kinetic energy).
2. **Diffuser:** A stationary assembly of guide vanes and widening passages that receives fast-moving air from the impeller, lowers its velocity and converts a substantial part of its kinetic energy into pressure.

The pressure increase produced within the impeller is influenced by its **diameter, rotational speed and vane geometry**. Air leaves the impeller with both radial and tangential velocity. Divergent diffuser passages further reduce velocity and raise pressure before the air reaches the inlet manifold.

> **Image Generation Prompt — Figure 11.1 A centrifugal compressor.**
>
> Recreate a technical aviation-book cutaway of a centrifugal compressor on a clean white background inside a fine rectangular boundary. At the left is a large dark-grey circular impeller shown face-on and slightly three-dimensional, with curved radial blades around a small central eye. To the right is the diffuser/collector casing and rectangular air-inlet throat with pale-blue flow arrows. Show arrows indicating radial and tangential motion, and an outlet leading **TO INLET MANIFOLD** at the lower-left. Retain the uppercase annotations **IMPELLER PERIPHERY**, **EYE OF THE IMPELLER**, **AIR INLET**, **DIFFUSER**, **IMPELLER** and **TO INLET MANIFOLD**, with fine red leader lines pointing to the correct components. Match the original grey shading, cyan flow arrows, orientation and relative component positions; do not simplify it into a generic fan drawing.

Compression also raises charge temperature. That heating offsets some of the density gain due to higher pressure. An **intercooler** can cool the compressed air; alternatively, fuel introduced at the impeller eye can absorb heat as it vaporizes.

At any fixed impeller speed the compressor delivers a characteristic pressure ratio. Rotor dimensions and maximum permissible rotational speed limit the obtainable ratio and, in turn, engine power and effective operating altitude. Ratios around **3:1** are attainable; if more compression is required, **two compressors in series** may be used.

### 2.2 Manifold Pressure and Engine Controls

A supercharged aircraft engine is normally paired with a **variable-pitch, constant-speed propeller**. The propeller pitch control establishes engine rpm, while the throttle controls how much induction pressure is admitted to the cylinders. Manifold pressure must be indicated so that the pilot can select engine power without overboosting.

**Manifold pressure** is measured in the induction passage **between the throttle valve and the engine inlet valve**. Two indication conventions are used.

#### Boost Pressure

In the British convention, a boost gauge shows manifold pressure relative to **standard sea-level atmospheric pressure**; the ISA reference is marked **zero**. Its graduations are in pounds per square inch above or below this reference.

- **−3 lb boost:** approximately 14.7 − 3 = **11.7 lb/in² absolute**.
- **+4 lb boost:** approximately 14.7 + 4 = **18.7 lb/in² absolute**.

#### Manifold Absolute Pressure (MAP)

The American convention uses a gauge showing **absolute induction-manifold pressure**, generally in **inches of mercury (in Hg)**. Standard sea-level pressure, about **14.7 lb/in²**, corresponds to **29.92 in Hg**; thus a zero reading on a relative boost gauge corresponds to approximately **29.92 in Hg** on a MAP gauge.

For approximate comparisons, **2 in Hg ≈ 1 lb/in² of boost**.

> **Image Generation Prompt — Figure 11.2 Manifold pressure indications.**
>
> Reproduce the original paired black circular cockpit-gauge illustration on a white background. The left round dial is titled **BOOST GAUGE**, with bold white graduations on a dark face, an indication needle, and the word **BOOST** inside; it illustrates relative pressure referenced to standard sea-level atmospheric pressure. The right dial is titled **MANIFOLD ABSOLUTE GAUGE**, marked with numerical inches-of-mercury divisions including the standard sea-level region, and a prominent pointer. Keep both dials side by side and approximately equal size. Preserve the central lower annotation **BOTH AT ISA SEA LEVEL STANDARD ATMOSPHERIC PRESSURE**, its leaders, the original gauge titles, tick marks, relative spacing, black-and-grey treatment, and the precise dial orientations rather than substituting modern digital instruments.

## 3. Externally Driven Superchargers (Turbochargers)

A **turbocharger** recovers energy from the engine's exhaust stream. Exhaust gases rotate a turbine, which shares a shaft with the centrifugal compressor. Engine oil lubricates the rotor bearings; the turbine connects to the exhaust system and the compressor to the intake system.

Turbocharger components may be attached to the engine or supported on a fire-resistant bulkhead, with shielding from combustible fluid lines. Exhaust flows through directing nozzles and across turbine blades before discharge overboard. Passing more exhaust gas through the turbine increases turbine and impeller rpm, increasing the compressor pressure ratio.

> **Image Generation Prompt — Figure 11.3 Turbocharger - general arrangement.**
>
> Draw the same side-on color-coded piston-engine/turbocharger system schematic: a single-cylinder piston and crankshaft at upper centre, **blue induction piping** entering the left side of the cylinder and **orange exhaust piping** from the right. At bottom-left place a grey compressor wheel and at bottom-centre a grey turbine wheel on a common shaft; label both. Air enters the compressor from a left-pointing inlet route, whereas exhaust leaves toward the lower-right after the turbine or bypass. Include the exhaust **Wastegate** bypass valve, **Wastegate actuator** with spring, **Engine oil pressure** supply, **Engine oil return**, **Wastegate controller**, **Throttle valve**, **Manifold Pressure** gauge, **Fuel Injector**, and relevant dashed control line. Show correct blue and orange directional arrows and the original physical routing and label placement; maintain the technical manual's white background and rectangular illustration boundary.

### 3.1 The Wastegate

To keep a selected manifold pressure while climbing, the turbocharger must compress progressively less-dense inlet air. Its impeller speed consequently needs to increase. The **wastegate** regulates turbine power by opening or closing an exhaust bypass duct:

- **More open:** A greater proportion of exhaust avoids the turbine, reducing turbocharger drive.
- **More closed:** More exhaust passes through the turbine, increasing shaft speed and boost.
- **Fully closed:** Turbine drive is at its highest for the available exhaust flow; once the system can no longer sustain the selected boost, the corresponding limiting height is the **critical altitude**.

Some arrangements permit pilot control, but automatic systems normally prevent excessive boost. The wastegate is connected mechanically to a **single-acting actuator**. In the arrangement described, **spring force opens** the wastegate and **engine-oil pressure closes** it. The controller changes actuator oil pressure, thereby changing the bypass opening.

Possible controllers include an **Absolute Pressure Controller (APC)**, **Density Controller (DC)** and **Differential Pressure Controller (DPC)**.

### 3.2 Absolute Pressure Controller (APC)

The APC protects against exceeding a specified **compressor discharge pressure**. An aneroid capsule senses that pressure and adjusts the **oil bleed** from the wastegate actuator. With less oil being released, actuator pressure closes the wastegate; increasing the bleed allows the spring to open it. The pilot's throttle separately determines the pressure admitted to the inlet manifold.

At low power, the actuator can receive full engine-oil pressure and keep the wastegate shut so sufficient turbine energy is available to provide the designed compressor outlet pressure. The oil is supplied by the **engine lubrication system**, which also supplies the turbocharger bearings.

Some installations include an **overboost warning light** and a **relief/dump valve** that opens to ambient pressure if compressor discharge (deck) pressure becomes excessive.

> **Image Generation Prompt — Figure 11.4 Operation of the APC.**
>
> Reproduce the original detailed colored flow schematic on white, with a **vertical turbocharger near the left**, a **single-cylinder engine on the right**, and a small **absolute-pressure controller/aneroid capsule** at extreme left. Air enters the light-cyan compressor from above, then follows a pink induction line past the **SUCK IN FLAP** and black **THROTTLE VALVE** to the **INLET MANIFOLD** and engine inlet valve. A **BOOST PRESSURE GAUGE** connects above the pink manifold. Dark-red exhaust leaves the cylinder, turns down and left along the **EXHAUST MANIFOLD**, and divides into a turbine branch and **BY-PASS DUCT** fitted with **WASTE GATE**. Use blue and yellow flow arrows in the turbine/exhaust, an oil-powered **WASTE GATE ACTUATOR** piston below the bypass, and a deep-blue oil line returning to the controller. Preserve ALL original labels, including **ABSOLUTE PRESSURE CONTROLLER**, **ANEROID CAPSULE**, **BLEED VALVE**, **PRESSURE BALANCE PIPES**, **TO DISCHARGE NOZZLES**, **AIR IN**, **COMPRESSOR**, **TURBINE**, **ENGINE OIL TO AND FROM ENGINE**, **THROTTLE VALVE**, **SUCK IN FLAP**, **BOOST PRESSURE GAUGE**, **INLET MANIFOLD**, **EXHAUST MANIFOLD**, **BY-PASS DUCT**, **WASTE GATE** and **WASTE GATE ACTUATOR**. Retain thin black leaders, red/blue piping, the actuator spring depiction and the original component placement.

#### Response to a Throttle Adjustment

Changing the throttle triggers a sequence of interconnected responses:

1. A different throttle opening changes the pressure difference across the throttle and changes **MAP**.
2. The APC detects the changed compressor-related condition and shifts its bleed-valve position.
3. Bleed-valve movement changes oil pressure acting on the wastegate actuator piston.
4. The actuator repositions the wastegate, altering the fraction of exhaust driving the turbine.
5. Turbine/compressor speed changes, changing **compressor discharge or deck pressure**.
6. The resulting deck-pressure change alters the throttle pressure difference again; the controller repeats its adjustment until a new balance is reached.

This feedback can produce noticeable **throttle sensitivity**. A turbocharged engine may need MAP reset more often than a normally aspirated engine, especially if the throttle is moved rapidly without permitting the system to settle.

An unstable repeated change in MAP at partial throttle is called **bootstrapping**. A differential-pressure controller helps reduce this tendency. Bootstrapping differs from **overboost**, in which excessive pressure can impose severe mechanical loading and promote detonation. The operational pressure-management sequence described for increasing power is **raise rpm before increasing boost**; for reducing power, **reduce boost before lowering rpm**.

### 3.3 Wastegate Position During Operation

From ground operation to critical altitude, the wastegate moves through a characteristic progression:

1. **Before start:** The actuator spring holds the wastegate fully open so exhaust can flow freely. Starting with the exhaust bypass closed would be difficult.
2. **Just after start:** Exhaust energy is initially insufficient to make rated discharge pressure. The expanded APC aneroid closes its oil bleed, retaining actuator oil and moving the wastegate toward fully closed.
3. **Increasing throttle at low altitude:** Exhaust flow and compressor pressure rise; the APC releases some actuator oil so the wastegate opens progressively. Around full throttle at ISA sea level it is **almost fully open**, leaving additional control range for higher-than-standard ambient pressure.
4. **During climb:** Falling compressor inlet pressure tends to lower outlet pressure. The APC reduces the bleed, increasing actuator oil pressure and **progressively closing** the wastegate to maintain compressor delivery pressure.
5. **At critical altitude:** The wastegate reaches fully closed and no further increase in turbine drive is available through this control. Above this height, deck pressure and MAP fall more rapidly.

> **Image Generation Prompt — Figure 11.5 The relationship of wastegate position, engine power, manifold pressure & turbocharger rpm to each other.**
>
> Faithfully redraw the multi-curve chart inside its thin black rectangular border. Horizontal progression is **ENGINE START → IDLE → TAKE-OFF POWER → CRITICAL ALTITUDE**, each event marked by black dashed vertical lines. At the left draw three horizontal wastegate-position levels: **FULLY OPEN** bottom, **ALMOST FULLY OPEN** middle, and **FULLY SHUT** top. A grey/dashed **WASTEGATE POSITION** curve first shoots upward to point **b**, falls to point **c** at take-off, then rises diagonally through **d** to **e** at critical altitude where it levels. A yellow curve labelled **ENGINE BHP** rises steeply to take-off power, then slowly declines to the right. A blue **TURBO RPM** curve rises from start to idle, remains almost flat to take-off, increases to critical altitude then falls. A red **COMPRESSOR DELIVERY PRESSURE** curve rises at start, holds approximately flat until critical altitude, then drops. Include the original stage letters **a, b, c, d, e**, the black arrows, all curve labels and colors, the markers **FULLY OPEN**, **ALMOST FULLY OPEN**, **FULLY SHUT**, **ENGINE START**, **IDLE**, **TAKE-OFF POWER** and **CRITICAL ALTITUDE**, and the corresponding exact relative trajectories.

Turbocharged engine power generally declines with height from take-off, despite regulated charge pressure, because of increasing exhaust back pressure. Above critical altitude, the loss becomes more pronounced and begins to resemble the power reduction of a normally aspirated engine.

> **Image Generation Prompt — Figure 11.6 A comparison of the power curves of a normally aspirated engine & a turbocharged engine.**
>
> Create the original Cartesian plot of **Engine bhp Output** against **Altitude in Thousands of Feet**, with the horizontal scale extending roughly 0–14 and vertical values approximately 300–700. Draw three downward-sloping labeled lines: an upper **green** line **Ground Boosted Turbo @ 2700 rpm**; a middle **red** line **Alt. Boosted Turbo @ 2700 rpm**; and a lower **black** line **Normally Aspirated**. Mark a vertical green dashed line at roughly 6.5 thousand feet labelled **Crit Alt Lower** and a vertical red dashed line at about 10 thousand feet labelled **Crit Alt Higher**. Keep the source's gridlines, labels, approximate starting and finishing power values, relative gradients, and clean technical-chart appearance.

### 3.4 Alternative Turbocharger Control

#### Fixed-Orifice Bypass

A basic installation can use a **fixed bypass opening** so that a predictable fraction of exhaust continuously avoids the turbine. The throttle controls MAP, but opening it also raises exhaust flow and compressor speed. This mutual interaction makes **overboost during rapid throttle movement** a particular concern.

> **Image Generation Prompt — Figure 11.7**
>
> Copy the composition of the black-and-white **TURBOCHARGER CONTROL #1** system schematic, not a generic turbocharger drawing. At upper centre-right is a piston cylinder, **Fuel Injector**, and **MAP or boost gauge**; below-left is the air **Inlet** and **Impeller**; below-centre/right is the exhaust-driven **Turbine** with a common shaft. Show the right-hand **Exhaust** arrow and a small **Fixed orifice - the simplest form of turbocharger control** explanation panel connected to a fixed exhaust bypass. Preserve the original arrows, component labels, cylindrical engine outline, duct routing and schematic proportions. The fixed orifice permanently allows a share of exhaust to bypass the turbine, and the throttle determines manifold pressure.

#### Density Controller and Differential Pressure Controller

More sophisticated installations can employ these two regulators together, although **only one actively determines wastegate position at any instant**.

- **Density Controller (DC):** Limits maximum MAP/boost at full throttle below critical altitude. Its two bellows respond to **compressor outlet pressure and temperature** and are filled with **dry nitrogen**. As charge temperature rises, the bellows' pressure response compensates for loss of density, allowing the maximum pressure setting to vary with temperature. Turbocharger speeds can approach **110,000 rpm**. The control can allow available pressure to increase toward critical altitude, reducing the density penalty associated with heating.
- **Differential Pressure Controller (DPC):** Functions at **part-throttle settings** rather than fully open throttle. It senses the pressure drop across the throttle, reducing unnecessary compressor discharge pressure when a lower MAP is demanded and limiting the tendency to bootstrap.

> **Image Generation Prompt — Figure 11.8**
>
> Reproduce the original black-line **TURBOCHARGER CONTROL #2** schematic. Place the piston cylinder with upper **MAP or boost gauge** and **Fuel injector** at the top centre; the compressor **Impeller** and **Air Inlet** at lower-left; the linked **Turbine** centrally; and the **Waste gate**, **Waste gate actuator** and **Exhaust** duct at lower-right. On the extreme left draw two stacked compact controller blocks labelled **DPC** (top) and **DC** (below), numbered **(1)** and **(2)** with fine dashed control lines to the actuator. At the right add two separate numbered technical callout boxes: **1. Differential pressure controller controls WG position thereby compressor delivery pressure at partial throttle openings by sensing pressure drop across the throttle. This minimizes bootstrapping.** and **2. Density controller controls WG position therefore compressor delivery pressure at full throttle operation to a predetermined pressure. Is able to compensate for temperature due to a dry nitrogen filled capsule.** Retain the exact diagram geometry, line thickness, controller acronyms and all flow arrows.

## 4. Internally Driven Superchargers

A crankshaft-driven supercharger is commonly fitted to medium- and high-power piston engines, typically from about **250 bhp upward**. It is positioned **downstream of the throttle** and is driven mechanically from the engine.

Earlier high-power designs used **two compressor-drive speeds**: the lower ratio saved drive power near sea level and the higher ratio was selected for operation at altitude. Some designs used two impellers in series to increase compression. The configuration described as more usual uses a **single impeller** driven at a fixed multiple of crankshaft speed, generally around **6:1 to 12:1**.

Depending on gear ratio and rating, sea-level manifold pressure may be sustained to approximately **5,000–10,000 ft** at **Rated Power** settings.

> **Image Generation Prompt — Figure 11.9 Internally driven supercharger - general arrangement.**
>
> Create the original white-background sectional system diagram showing a single piston cylinder near top-right with a grey crankshaft and orange exhaust outlet. At bottom-right draw a grey propeller-shaft/gearbox drive leading to the pale-grey propeller disc on the far right. On the left, blue air enters a centrifugal compressor below a blue **Throttle lever** and black **Manifold Pressure** gauge above the inlet duct. A labelled **Automatic Boost Controller (ABC)** is mounted near the blue induction route. Draw a mechanical grey gearbox path from crankshaft to compressor impeller, with **Spring drive unit** marked near the drive and a **Propeller constant speed unit (CSU)** near the propeller. Preserve labels **Air inlet**, **Fuel inlet**, **Throttle lever**, **Manifold Pressure**, **Automatic Boost Controller (ABC)**, **Spring drive unit**, **Propeller constant speed unit (CSU)** and **Propeller lever (rpm lever)**, including the original black arrows, blue/orange flows, perspective and component spacing.

### 4.1 Supercharger Drives

A splined shaft extending from the rear of the crankshaft provides drive to the supercharger via intermediate gears and an impeller pinion. A **spring drive unit** can reduce the sudden torque passed to the compressor during rapid engine or propeller acceleration or deceleration. Some systems also include a **centrifugal clutch**.

### 4.2 Supercharger Controls

Because a compressor selected to overcome low atmospheric pressure at altitude would otherwise give excessive pressure at low level, its outlet must be regulated. This is achieved by restricting throttle opening below the selected **full throttle height**, often automatically.

Two cockpit selections affect engine power:

- **Throttle lever (power lever):** Controls the desired boost or manifold pressure by governing the throttle opening; combined with rpm it determines engine output.
- **Propeller pitch control lever (rpm lever):** Sets engine rotational speed through a variable-pitch propeller and constant-speed arrangement. The propeller blade angle can vary between fine and coarse limits.

### 4.3 Throttle Position and Full Throttle Height

At sea level the supercharger can supply more pressure than the engine should receive. The throttle therefore operates **partly closed (choked)** to keep manifold pressure within the selected rating.

As atmospheric pressure falls during climb, the throttle must open progressively to preserve the selected MAP. The altitude where it finally reaches its mechanical **fully open** position is **Full Throttle Height (FTH)**. Above that height, manifold pressure and power decrease, broadly like those of a normally aspirated engine.

Because compressor delivery depends on impeller rpm, **each combination of rpm and boost has its own FTH**. When the engine is at **Rated rpm and Rated Boost**, its corresponding FTH is called **Rated Altitude**.

**Rated Power**, also called **Maximum Continuous Power (MCP)**, is the maximum rating permitted for unrestricted continuous operation. **Take-off Power**, and sometimes **Climb Power**, may have prescribed time limits.

> **Image Generation Prompt — Figure 11.10**
>
> Reconstruct the original line graph of **Power** (vertical arrow on left) versus **Altitude** (horizontal arrow right). Show three shallow rising lines of differing slopes, followed by downward segments after their respective full-throttle heights. Label the top black/brown curve **Rated rpm and rated Boost**; label a lower curve **Rated rpm, less than rated Boost**; and the blue lower-altitude-ending curve **Less than Rated rpm, rated Boost**. Place a label **Rated Power** at upper-left above the lines, **Rated Alt. (FTH at Rated Power)** above the middle vertical dashed marker, **Increased FTH** to the right, and **Decreased FTH** in blue under the earlier marker. Show three black/blue vertical dashed altitude guides and the correct ordering of their intersections. Preserve the chart's white background, thin axes and muted red, grey and blue lines.

#### Effects of Reduced Power Settings

The full-throttle-height response depends on how power has been reduced:

- With **Rated rpm but less than Rated Boost**, less manifold pressure is required; the throttle reaches its full-open position later, so **FTH increases**.
- With **Rated Boost but less than Rated rpm**, the mechanically driven compressor turns more slowly and produces less pressure. A larger throttle opening is needed, so **FTH decreases**.

Since the compressor is geared to the crankshaft, its speed changes along with engine speed. The throttle must open more quickly in the climb when compressor rpm is low, and more gradually when rpm is maintained but the selected boost is lower.

### 4.4 Automatic Boost Control (ABC)

At low altitude a crankshaft-driven supercharger may deliver excessive manifold pressure because the dense inlet air is being compressed by equipment designed for high-altitude operation. High cylinder pressure can lead to **detonation** and mechanical stress.

The **Automatic Boost Control unit**, commonly installed on or near the carburettor, maintains a selected boost by altering throttle opening as the aircraft climbs or descends. As altitude increases, it progressively admits more charge without requiring the pilot to make every adjustment.

> **Image Generation Prompt — Figure 11.11 An automatic boost control unit.**
>
> Draw an accurate small mechanical/hydraulic control schematic from an aviation manual. At the top is a horizontally arranged **CAM CONTROLLED BY BOOST SELECTOR LEVER** with roller and pivot; below it a vertical orange-brown pressure-sensitive **ANEROID CAPSULE** housed in a tall rectangle. A thick green/black hydraulic **SERVO PISTON MOVES THROTTLE VALVE** sits lower-right, with red and blue horizontal oil ports, labelled **RETURN OIL**, **PRESSURE OIL**, **RETURN OIL**. Add the **BOOST PRESSURE FROM INLET MANIFOLD** input entering the aneroid from the left and label **LANDED VALVE** as shown beside the upper moving component. Keep the original black lines, orange bellows, colored hydraulic ports, arrows, cam profile and white-page composition; do not replace it with an electronic control block diagram.

### 4.5 Normally Aspirated and Internally Supercharged Performance

A normally aspirated engine generally delivers its highest power at sea level, with power falling as altitude increases. An otherwise comparable internally supercharged engine may initially deliver less shaft power at the same rpm and manifold pressure, because part of the engine's output is used to drive the compressor.

With increasing height and unchanged throttle settings, the supercharged engine can initially develop **greater net power** because colder air allows greater charge mass at the same manifold pressure. Falling ambient pressure also reduces exhaust back pressure and improves scavenging. These benefits allow power to rise toward FTH before declining above it.

> **Image Generation Prompt — Figure 11.12**
>
> Recreate a minimalist two-curve aircraft power chart on a white field. Vertical axis is **Power** with an upward arrow; horizontal axis is **Altitude** with a right-facing arrow. Draw a **red descending straight line** labelled diagonally **Normally Aspirated Engine** from upper-left to lower-right near zero power. Draw a **blue-violet line** labelled **Supercharged Engine** starting slightly below the red line at sea level, climbing gradually to a peak at a vertical dashed line marked **Full Throttle Height**, then descending sharply after the dashed line. Keep the crossing of lines at low altitude, precise relative slopes and the single FTH dashed marker; no legend box or extra curves.

### 4.6 Engine Power Output: Turbocharger Versus Internal Supercharger

The two installations show contrasting altitude trends in the treatment here:

- A **turbocharged engine** experiences increased turbine-related exhaust back pressure as altitude rises and more exhaust is directed through the turbine. Its power therefore tends to decline with height, with a faster decline beyond critical altitude.
- An **internally supercharged engine** can gain power over an initial altitude range because of lower charge temperature and reduced exhaust back pressure, before declining above its FTH.

### 4.7 Engine Power Check: Reference rpm

Following installation of an engine, a power check determines its **Reference rpm** with the propeller held against its **fine-pitch stop**. This value provides an indication of engine output and remains reasonably stable over differences in airfield temperature and elevation.

The reference figure is normally noted in the cockpit, for example beside the rpm indicator. A substantial later change suggests a defect. Reference rpm must be established again after replacing important engine components such as a **carburettor** or **magneto**.

### 4.8 Engine Power Check: Static Boost

**Static Boost** is the pressure indicated by the boost or MAP gauge **before engine start**. Because the engine is not pumping air, the indication is approximately ambient atmospheric pressure.

At ISA sea level, that is approximately **29.92 in Hg MAP** or **zero relative boost**. The indicated static pressure falls at greater airfield altitude and rises if atmospheric pressure is greater than the sea-level ISA reference.

This pre-start reading provides the comparison point for a subsequent running check.

### 4.9 Checking Engine Power Output

After starting, manifold pressure drops below the static value, and it may not begin to recover until around **1,600–1,700 rpm**. With the propeller set to maximum engine rpm against the **fine-pitch stop**, the throttle is increased progressively.

Manifold pressure should return to the previously observed **static-boost value** at approximately the engine's **Reference rpm**, subject to a tolerance such as **±50 rpm**. The actual Reference rpm is model-specific, although an illustrative average is around **2,000 rpm**.

An out-of-tolerance result may indicate a **weak cylinder**, **ignition defect**, **carburettor maladjustment** or **incorrect propeller low-pitch-stop setting**.

### 4.10 Comparing Turbochargers and Internally Driven Superchargers

A turbocharger can provide a relatively economical performance improvement near ground level because it uses otherwise wasted exhaust energy. The internally driven supercharger, however, can give a different altitude-power characteristic and more immediate response to throttle movements.

An externally driven unit needs time for its turbine and compressor to accelerate after an increase in demanded pressure. This delay is **turbo-lag**: the APC and wastegate actuator respond, exhaust energy reaches the turbine, and compressor speed subsequently rises. The direct mechanical drive of an internal supercharger avoids the same exhaust-spool-up delay.

| Feature | Internally driven supercharger | Turbocharger |
|---|---|---|
| Drive source | Engine crankshaft | Exhaust-powered turbine |
| Rotational-speed control | Engine rpm | Wastegate position and available exhaust flow |
| Charge compressed in the arrangements described | Fuel–air mixture | Air |
| Primary boost control | ABC senses MAP and positions throttle | APC senses compressor discharge pressure and positions wastegate |
| Compressor outlet versus MAP | Approximately equal | Compressor discharge pressure greater than MAP |
| Throttle function | Controls MAP | Controls MAP |
| Exhaust back pressure during climb | Decreases | Increases |

> **Image Generation Prompt — Figure 11.13**
>
> Reproduce the source's combined **engine bhp output versus altitude** diagram, with a grey square grid, vertical scale approximately 300–700 and horizontal **Altitude in Thousands of Feet** running 0–14. Include four distinct power curves: a green downward **Ground Boosted Turbo**, a gently rising then descending blue-violet **Internal Supercharger**, a red downward **Alt. Boosted Turbo**, and a steep black downward **Normally Aspirated** curve. Mark three thin vertical dashed reference lines at increasing altitude: **Crit Alt Lower**, **Crit Alt Higher** and **Full Throttle Height**. Position the supercharger's peak near full-throttle height and show the descending turbocharger curves and lower normally aspirated curve. Match labels, line colors, intersections and relative heights of the original chart without inventing additional categories.

## 5. Diesel Engines

Diesel aero-engines, like spark-ignition engines, suffer declining **volumetric efficiency** in thinner high-altitude air, at high-elevation take-off locations and on hotter-than-standard days.

**Exhaust-driven turbochargers** can improve diesel performance by raising intake pressure, while **intercoolers** reduce the temperature rise caused by compression and restore charge density.

## Questions

1. What pressure quantity is shown by the manifold-pressure indicator on a supercharged piston engine?
   - a. Absolute pressure within the induction manifold
   - b. Pressure difference from one side of the compressor to the other
   - c. Atmospheric-pressure ratio relative to a rise in the compressor inlet cam
   - d. Pressure before the throttle butterfly

2. What is the principal purpose of an Automatic Boost Control unit?
   - a. To stop cylinder detonation and fuel dissociation directly
   - b. To hold the automatically selected boost pressure
   - c. To establish the fuel–air mixture appropriate to the boost selection
   - d. To position the turbocharger wastegate to retain preset boost

3. What is a principal result of fitting a turbocharger to a piston engine?
   - a. More efficient exhaust scavenging
   - b. Better volumetric efficiency
   - c. Engine rpm automatically rises during climb
   - d. Engine power automatically increases with climbing altitude

4. From where does a turbocharger obtain its driving power?
   - a. A spring-driven connection with the crankshaft
   - b. Mechanical drive from the accessory gearbox
   - c. Energy remaining in the engine exhaust
   - d. A connection to the reduction gearbox

5. Why can an internally supercharged engine produce more power during the early part of a climb?
   - a. A smaller mass of charge enters its cylinders
   - b. Atmospheric density decreases
   - c. Exhaust back pressure becomes lower
   - d. Charge temperature rises

6. Which description correctly defines **Rated Altitude**?
   - a. The height where boost effectiveness stops for one particular rpm
   - b. A comparison of sea-level boost with boost at altitude
   - c. The greatest altitude at which Rated Boost is obtainable at Rated rpm
   - d. The height where the wastegate finally closes completely

7. How is turbocharger turbine speed regulated?
   - a. By diverting a controlled amount of exhaust flow
   - b. By regulating exhaust leaving the compressor impeller eye
   - c. By the use of a variable mechanical governor
   - d. Through an automatically controlled gearbox between turbine and impeller

8. The spring in a typical turbocharger wastegate actuator urges the valve toward which state?
   - a. Open
   - b. Closed
   - c. Partially open and balanced
   - d. Maximum supercharging

9. What provides cooling and lubrication for the turbocharger's rotor bearings?
   - a. A separate oil supply entirely within the turbocharger
   - b. Oil supplied by the engine
   - c. A one-pass oil-loss arrangement
   - d. Oil tapped only from the scavenging return

10. Which statement describes **Static Boost**?
    - a. It must always equal ISA pressure at airfield elevation
    - b. It is established by opening the throttle until 30 in Hg or zero boost is indicated
    - c. It is the gauge indication with the engine stopped; that value can be reproduced with a suitable throttle opening while running
    - d. It is the pressure difference between inlet and exhaust manifolds

11. The pressure-sensitive capsule within an automatic boost-pressure controller responds to:
    - a. Outside atmospheric pressure
    - b. Pressure at the carburettor inlet
    - c. Boost pressure
    - d. Cabin differential pressure

12. To retain constant boost while altitude increases, an internally supercharged engine's ABC will:
    - a. Leave the throttle butterfly stationary
    - b. Open the throttle progressively
    - c. Close the wastegate progressively
    - d. Close the throttle progressively

13. Which definition matches **boost pressure**?
    - a. Manifold pressure in lb/in² measured above or below standard mean sea-level pressure
    - b. Absolute manifold pressure expressed in inches of mercury
    - c. Absolute manifold pressure expressed in millibars
    - d. Manifold pressure in lb/in² above or below the local atmospheric pressure

14. What is meant by **Full Throttle Height**?
    - a. The height at which Rated Boost first occurs
    - b. The highest altitude permitting a particular boost and rpm combination
    - c. The altitude where the wastegate closes completely
    - d. The cruise altitude associated with any selected boost

15. Why may an intercooler be included in a supercharging system?
    - a. To reduce the likelihood of detonation
    - b. To increase charge volume
    - c. To reduce charge density
    - d. To prevent the exhaust manifold from overheating

16. What occurs as flow passes through a supercharger diffuser?
    - a. Temperature falls and flow speed rises
    - b. Flow speed rises and pressure falls
    - c. Flow speed and pressure both fall
    - d. Flow speed falls while pressure rises

17. Which route does intake air follow through a centrifugal turbocharger compressor?
    - a. In at the blade tips, then inward to the impeller eye
    - b. From the diffuser into the impeller outlet
    - c. Through the diffuser passages first and then out from the blade tips
    - d. Into the impeller eye and outward between blades to the periphery

18. Where is the wastegate located in a turbosupercharger exhaust system?
    - a. In the passage bypassing the turbine
    - b. Inside the induction manifold
    - c. In a passage intended simply to maximize exhaust back pressure
    - d. In a duct arranged in series with the turbine

19. Which component physically moves a turbocharger wastegate?
    - a. The automatic boost controller itself
    - b. The wastegate actuator
    - c. Inlet-manifold pressure acting directly on the valve
    - d. Exhaust temperature

20. What happens to the engine's exhaust back pressure when a turbocharger is installed?
    - a. It is unchanged
    - b. It becomes lower
    - c. It becomes higher
    - d. It decreases progressively during climb

21. Where may the intercooler of a high-performance supercharging installation be fitted?
    - a. After the supercharger and before the inlet valve
    - b. At the carburettor inlet only
    - c. Between adjacent cylinders
    - d. Between the crankcase and exhaust manifold

22. As compressor discharge pressure increases, what happens to fuel flow?
    - a. It increases
    - b. It does not change
    - c. It decreases
    - d. It increases only in proportion to altitude

23. A turbocharger's operating rpm is determined primarily by:
    - a. How much exhaust gas is diverted
    - b. Throttle-valve position alone
    - c. Air density at the compressor inlet alone
    - d. A pressure bleed from the exhaust system

24. Under ISA sea-level conditions, where is the wastegate generally positioned for take-off power?
    - a. Completely open
    - b. Nearly fully open
    - c. Determined solely by the throttle angle
    - d. Completely closed

25. Which statement describes **Maximum Continuous Power**?
    - a. It can be held indefinitely only at economical cruise settings
    - b. It is the greatest instantaneous output the engine can produce
    - c. It may be used for only five minutes
    - d. Its duration of use is not time-limited

26. What is the central purpose of fitting a supercharger?
    - a. To heat the incoming charge
    - b. To admit a greater mass of charge into the cylinders
    - c. Solely to improve the exhaust-scavenging process
    - d. To make higher-octane fuel necessary

27. Which fuel type is associated with the turbocharged spark-ignition engine discussed here?
    - a. AVTUR
    - b. AVGAS
    - c. AVTAG
    - d. AVPIN

28. In the controller arrangement described, what is the wastegate's normal position at low or idle power?
    - a. Partially open
    - b. Wide open
    - c. Closed
    - d. Half open

29. Which energy change takes place in the divergent diffuser passages?
    - a. Velocity energy becomes pressure energy
    - b. Thermal energy becomes potential energy
    - c. Mechanical energy becomes heat
    - d. Pressure energy becomes velocity energy

30. How are the compressor and turbine connected in a turbocharger?
    - a. They rotate on one shaft
    - b. They turn on independent shafts
    - c. A set of gears joins them
    - d. The ABC mechanically links them

31. What does the wastegate actually vary?
    - a. Fuel–air charge entering the inlet manifold
    - b. Outside air admitted to the compressor
    - c. Exhaust gas routed around the turbine
    - d. Exhaust leaving the compressor

32. What is the chief effect intended from supercharging?
    - a. Improvement of the basic thermal-efficiency ratio
    - b. An increased engine mechanical compression ratio
    - c. Maintenance of sea-level induction pressure above Rated Altitude
    - d. Improvement of engine volumetric efficiency

33. Compared with a normally aspirated engine, how does a turbocharged engine initially respond to rapid opening of the throttle?
    - a. Better at first, before exhaust back pressure creates a hesitation
    - b. Better at all times
    - c. More slowly
    - d. At exactly the same rate

34. What happens to engine power during a climb with **constant MAP** in an internally supercharged installation?
    - a. It decreases
    - b. It increases
    - c. It remains unchanged
    - d. Altitude has no influence on it

35. Which statement identifies an internally driven supercharger in the installation described?
    - a. Exhaust energy drives it
    - b. It compresses only air
    - c. It compresses exhaust gas
    - d. It compresses fuel–air mixture

36. If the turbocharger wastegate jams before critical altitude while the aircraft continues climbing, what happens to engine output?
    - a. The ABC automatically maintains unchanged engine power
    - b. Power increases by about 10%
    - c. Reduced exhaust back pressure fully offsets the loss
    - d. Power decreases as altitude increases

37. How are high acceleration loads on the impeller drive of a mechanically driven supercharger commonly reduced?
    - a. By prohibiting every rapid throttle movement
    - b. By using a spring drive in the gearing
    - c. By relying on exhaust-gas inertia
    - d. By fitting a Vernier-type drive coupling

38. What is the turbine rotational-speed condition at full throttle at low altitude?
    - a. Somewhere between minimum and maximum
    - b. At its maximum
    - c. Wholly determined by the ABC
    - d. At its minimum

39. To keep manifold pressure constant as a turbocharged aircraft climbs, the system will:
    - a. Lower exhaust temperature through less exhaust back pressure
    - b. Open the wastegate progressively
    - c. Close the wastegate progressively
    - d. Increase the rotation speed of the diffuser

40. Which of the following is specified as protection against turbocharger overboost?
    - a. Automatic boost control unit
    - b. Manifold pressure gauge
    - c. Wastegate pressure controller
    - d. Suck-in flap

41. What term applies to a turbocharger configured to retain sea-level induction pressure with increasing altitude?
    - a. Altitude-boosted turbocharger
    - b. Turbosupercharger
    - c. Internal supercharger
    - d. Ground-boosted turbocharger

42. At sea-level take-off power, where is the throttle butterfly of an internally supercharged engine?
    - a. Fully open
    - b. In a restricted or choked opening
    - c. Partly open without deliberate restriction
    - d. Completely shut

43. The indication called **Static Boost** is taken when:
    - a. The engine is not running
    - b. The engine is idling at its specified rpm
    - c. Rated power has been established
    - d. The MAP needle is aligned with the lubber line

44. What places the ultimate limit on permissible supercharging?
    - a. Reaching maximum engine rpm
    - b. Reaching the engine's rated altitude
    - c. Obtaining the maximum boost indication
    - d. The onset of detonation in the engine

45. In the turbocharger arrangement considered, rotor speed depends on:
    - a. Engine rpm and wastegate position
    - b. Engine rpm alone
    - c. Throttle position alone
    - d. Propeller-pitch setting and altitude

46. How does inlet-manifold pressure behave in a turbocharged engine throughout a climb?
    - a. It rises until FTH and subsequently falls
    - b. It rises up to critical altitude, then stays unchanged
    - c. It is held until critical altitude, then falls
    - d. It falls until critical altitude and then stabilizes

47. Which compressor configuration is normally selected for supercharging?
    - a. Axial-flow compressor
    - b. Rootes-type blower
    - c. Centrifugal compressor
    - d. Reciprocating thrunge compressor

48. How does compressor outlet pressure compare with MAP in an internally driven supercharger installation?
    - a. They are approximately equal
    - b. Compressor outlet pressure is higher
    - c. The relationship changes above and below manifold pressure
    - d. Compressor outlet pressure is lower

49. In which relation to the turbine is the wastegate duct arranged?
    - a. Inside the inlet manifold
    - b. Beyond the turbine outlet, in series
    - c. In a parallel exhaust path around the turbine
    - d. In a path parallel to the compressor

50. The highest brake horsepower permitted continuously at a specified rpm and manifold pressure is known as:
    - a. Maximum power
    - b. Take-off power
    - c. Critical power
    - d. Rated power

51. On a turbocharged engine, compressor discharge pressure is normally:
    - a. Equal to manifold pressure
    - b. Above manifold pressure
    - c. Either above or below manifold pressure, depending on conditions
    - d. Below manifold pressure

52. What happens to pressure and temperature while air is compressed in a turbocharger?
    - a. Pressure rises and temperature falls
    - b. Both pressure and temperature rise
    - c. Both pressure and temperature fall
    - d. Pressure rises without a temperature change

53. In the compressor type used for these installations, the principal compression process is:
    - a. Axial
    - b. Co-axial
    - c. Confined to the diffuser only
    - d. Centrifugal

54. If the wastegate jams during a climb, what is the expected trend of manifold pressure?
    - a. It stays constant
    - b. It decreases
    - c. It increases
    - d. It initially rises and then falls

55. With **Rated Boost** retained but rpm reduced on an internally supercharged engine, what adjustment is needed?
    - a. Open the throttle further
    - b. Close the wastegate
    - c. Open the wastegate
    - d. Close the throttle further

56. How is full-throttle height affected by choosing Rated Boost with **less than Rated rpm** while climbing?
    - a. Rated Altitude becomes lower
    - b. Full Throttle Height becomes lower
    - c. Rated Altitude becomes higher
    - d. Full Throttle Height becomes higher

57. The Automatic Boost Control unit of an internally supercharged engine operates the:
    - a. Boost selection lever
    - b. Wastegate
    - c. Throttle butterfly
    - d. Engine rpm and manifold-pressure instruments

58. On which cockpit instrument is boost pressure indicated?
    - a. Cylinder-head-temperature gauge
    - b. Manifold-pressure gauge
    - c. Fuel-pressure gauge
    - d. Combination of rpm and manifold-pressure gauges

59. What change in fuel flow accompanies increasing compressor discharge pressure?
    - a. It decreases
    - b. It stays fixed
    - c. It first increases and then decreases
    - d. It increases

60. What atmospheric effect does supercharging principally counteract?
    - a. The reduction in air density at higher altitude
    - b. A temperature increase caused by climbing
    - c. Fuel density changes at altitude
    - d. Exhaust back pressure

61. In the referenced turbocharged engine arrangement, how is boost pressure selected or controlled?
    - a. By changing throttle position
    - b. By directly varying turbocharger speed
    - c. Through the ABC
    - d. By changing engine rpm

62. Which path does the mixture follow in an internally driven centrifugal supercharger?
    - a. Into the impeller eye and outward to its periphery
    - b. Into the periphery and inward to the eye
    - c. Through the turbine and then through the compressor
    - d. Through the compressor and then through the turbine

## Answers

| Question | Answer | Question | Answer | Question | Answer | Question | Answer |
|---:|:---:|---:|:---:|---:|:---:|---:|:---:|
| 1 | a | 2 | b | 3 | b | 4 | c |
| 5 | c | 6 | c | 7 | a | 8 | a |
| 9 | b | 10 | c | 11 | c | 12 | b |
| 13 | a | 14 | b | 15 | a | 16 | d |
| 17 | d | 18 | a | 19 | b | 20 | c |
| 21 | a | 22 | a | 23 | a | 24 | b |
| 25 | d | 26 | b | 27 | b | 28 | c |
| 29 | a | 30 | a | 31 | c | 32 | d |
| 33 | c | 34 | b | 35 | d | 36 | d |
| 37 | b | 38 | a | 39 | c | 40 | b |
| 41 | a | 42 | b | 43 | a | 44 | c |
| 45 | a | 46 | c | 47 | c | 48 | a |
| 49 | c | 50 | d | 51 | b | 52 | b |
| 53 | d | 54 | b | 55 | a | 56 | b |
| 57 | c | 58 | b | 59 | d | 60 | a |
| 61 | a | 62 | a | | | | |
