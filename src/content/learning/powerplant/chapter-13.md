# Chapter 13: Gas Turbines — Introduction

## 1. The History of the Gas Turbine Engine

**Jet propulsion** is produced when a pressurized fluid leaves an opening and creates a force on the device in the opposite direction to the escaping flow. The fluid may be a gas or a liquid. A revolving garden sprinkler demonstrates this effect as its water jets cause the sprinkler head to rotate. A rocket is another application, producing forward motion as gases are discharged rearwards.

This form of propulsion is based on **Newton's Third Law of Motion**, established in 1687: an applied force is accompanied by an equal reaction in the opposite direction. A machine that develops motion through this principle is called a **reaction engine**.

One of the earliest known reaction devices was built by **Hero of Alexandria around 250 BC**. Steam entered a hollow sphere through supporting passages that also acted as its bearings. Two curved outlet pipes were fitted on opposite sides of the sphere. As pressurized steam escaped from these opposed pipes, its reaction made the sphere spin about its axis.

> **Image Generation Prompt — Figure 13.1**
>
> Recreate the original aviation textbook illustration of Hero of Alexandria's steam reaction engine (aeolipile), with a plain white rectangular background and a lightly shaded grey mechanical apparatus. Show a round grey hollow metal sphere mounted on a central upright steam-supply pipe above a shallow circular brazier or steam-heating vessel. Depict two short bent steam discharge tubes on opposite sides of the sphere; make their open tips face tangentially in opposing directions to illustrate reaction-driven rotation. Add a lightly drawn circular base and three dark supporting legs, a perforated-looking band beneath the vessel, and a small wood fire below with black logs and red, orange, and yellow flames. Position the whole object vertically in the centre, with no decorative scenery, annotations, added arrows, or extra components. Grayscale textbook mechanical illustration with only the flames colored. Retain the exact caption **"Figure 13.1"** beneath the drawing.

The idea of using this reaction principle to propel aircraft developed long before practical jet aircraft appeared. In **1913**, the French engineer **Lorin** proposed an **Aerodynamic Thermal Duct (Athodyd)**. A practical milestone came in **1941**, when an aircraft flew under power from the jet engine developed by **Sir Frank Whittle**.

> **Image Generation Prompt — Figure 13.2 Athodyd and Whittle Engine.**
>
> Reproduce the original two-panel horizontal cutaway comparison on a white technical drawing sheet inside a thin rectangular border. The **upper** panel must be headed **"Aerodynamic Thermal Duct"** and depict a left-to-right grey ramjet-like duct: a flared rounded intake, a narrowing middle region followed by a wider combustion area, three small orange-yellow flame shapes immediately behind a slim vertical fuel injector near the middle-left, and a convergent rear outlet. Label the left side **"Air Intake"** with short horizontal guide strokes and the bottom **"Fuel Supply"**, using a left-pointing annotation arrow. The **lower** panel must be headed **"Whittle-type turbo jet engine"** and show a similarly shaped grey intake/exhaust envelope with a front compressor-like stack of curved blades, a long central horizontal shaft, a rear set of turbine blades, and a vertical fuel feed nozzle from below. Add the lower-panel labels **"Air Intake"** and **"Fuel Supply"** in their original positions. Both engine axes run left to right, and all housing cross sections are medium grey with black outlines. Do not interchange the two designs, invent components or introduce new labels. Caption exactly **"Figure 13.2 Athodyd and Whittle Engine."**

## 2. The Principles of the Gas Turbine Engine

The piston-engine-and-propeller combination and the gas turbine operate on the same basic propulsion principle: **both create forward thrust by accelerating air backwards**. The main difference is the amount of air affected and how rapidly its speed is changed.

For a moving mass, the basic relationship is:

$$
F = m a
$$

In a gas turbine, the compressor supplies the air, while the energy released by combustion produces a substantial difference between its inlet and outlet velocities. Allowing for the contribution from exhaust pressure, the thrust relationship may be written as:

$$
\text{Thrust} = \dot{m}(V_o - V_i) + \text{Pressure thrust}
$$

where:

- $\dot{m}$ represents the mass of air passing through the engine per unit time (the source denotes the airflow term by $W$).
- $V_o$ is the exit or outlet velocity.
- $V_i$ is the entry or inlet velocity.
- **Pressure thrust** is the additional component arising from the pressure conditions at the engine outlet.

A propeller normally imparts a relatively small speed increase to a **large quantity of air**. A pure jet engine usually accelerates a **smaller quantity of air through a much greater speed difference**. In each case, the backward change in the airflow's momentum causes a forward reaction on the aircraft.

This forward reaction is **not created by the jet striking or pushing against the surrounding atmosphere**. It arises from the change of momentum of the air and gases as they pass through and leave the propulsion system. The magnitude therefore depends on both the airflow quantity and the change in its velocity, together with any pressure-thrust contribution.

## 3. The Working Cycle of the Gas Turbine Engine

The operating principles of a **four-stroke piston engine** and a **gas turbine** can be compared through their respective thermodynamic cycles:

- A piston engine operates on the **Otto cycle**.
- A gas turbine operates on the **Brayton cycle**.

Both involve induction, compression, combustion and exhaust, while useful power is obtained through the motion of the piston in the Otto cycle and through the turbine in the gas-turbine arrangement. In theoretical terms, the principal distinction during heat addition is that **Otto-cycle combustion takes place at constant volume**, whereas **Brayton-cycle combustion takes place at constant pressure**.

The processes are also timed differently. A four-stroke piston engine repeats a sequence of separate events in the same cylinder, whereas a gas turbine passes air continuously through different sections of the engine, allowing these processes to take place simultaneously in different locations.

Only the **power stroke** provides useful output in the four-stroke piston engine; the other three strokes require energy. A gas turbine does not have those three separate non-power strokes. Because its combustion process and airflow continue without those interruptions, the gas turbine has an important advantage in **power-to-weight ratio**.

> **Image Generation Prompt — Figure 13.3 A comparison of the working cycles of the piston engine & the gas turbine engine.**
>
> Recreate a white-background, wide, two-tier illustrated engineering comparison. Across the **top**, place five small side-by-side cutaway diagrams of a four-stroke piston-engine cylinder with different piston positions, valve states, and colored gas regions, titled in bold uppercase **"THE OTTO CYCLE"**. Above or beside the cylinder sequence show the exact process labels **"INDUCTION"**, **"COMPRESSION"**, **"COMBUSTION"**, **"POWER"**, **"EXHAUST"**. Use blue for the intake charge, a blue compressed mixture, red for combustion/power and yellow for the exhaust flow. Each piston assembly must show a cylinder, valves, a piston, connecting rod and crank. Directly below, place a long left-to-right cross-sectional gas turbine with blue intake air at the left, axial compressor blade rows, central combustors colored red, downstream turbine stages and a yellow exhaust region at the right, headed **"THE BRAYTON CYCLE"**. Align the lower labels **"INDUCTION"**, **"COMPRESSION"**, **"COMBUSTION"**, **"EXHAUST"** under the corresponding engine regions. Preserve the proportions and paired cycle layout rather than presenting independent modern illustrations. Caption exactly **"Figure 13.3 A comparison of the working cycles of the piston engine & the gas turbine engine."**

## 4. A Pressure Volume Diagram of the Working Cycle

The **Brayton cycle** can be represented on a graph with **pressure on the vertical axis** and **volume on the horizontal axis**. Four points, **A, B, C and D**, mark the main stages.

- **A → B — Compression:** Air entering at atmospheric pressure is compressed, so its pressure increases while its volume decreases.
- **B → C — Heat addition:** Fuel is burned in the combustion chambers. In the theoretical cycle, heat is added at nearly unchanged pressure while the gas volume rises considerably.
- **C → D — Expansion:** The heated gas expands through the turbine and jet pipe, producing useful energy and decreasing in pressure toward the atmospheric condition at discharge.
- **D → A — Induction/return on the idealized diagram:** The cycle's atmospheric-pressure segment completes the theoretical pressure–volume representation.

In a real engine, combustion is **not perfectly constant-pressure**. Swirling and turbulent airflow in the combustion chamber create a pressure loss of approximately **3–6%** across that section. Even with that loss, the heat release produces a marked increase in gas volume.

> **Image Generation Prompt — Figure 13.4 A pressure volume diagram of the working cycle of a gas turbine engine.**
>
> Draw the original simple Brayton-cycle pressure-versus-volume chart on white with thin black axes labeled **"PRESSURE"** vertically and **"VOLUME"** horizontally. Preserve four plotted points **A**, **B**, **C**, **D**. Point A sits near the lower middle-right; point B is toward the upper left; point C is right of B at high pressure; point D is far lower right. Show a descending left-side blue line from B to A labeled **"COMPRESSION"** (direction A toward B), an upper gently curved **red** B-to-C segment labeled **"COMBUSTION"**, a falling **yellow** curved C-to-D segment labeled **"EXPANSION"**, and a low horizontal green/blue D-to-A line labeled **"INDUCTION"**. Add the three original explanatory callouts and leader lines, keeping their meaning and approximate positioning: **"PRESSURE ENERGY BEING ADDED IN THE COMPRESSOR"**, **"HEAT ENERGY BEING ADDED IN THE COMBUSTION CHAMBERS"**, and **"THE EXHAUST GAS IS EXPANDING THROUGH THE TURBINE AND JET EXHAUST NOZZLE"**. Near the lower segment mark **"AMBIENT AIR ENTERING THE INTAKE"**. Use simple aeronautical textbook colors and no 3D treatment. Caption exactly **"Figure 13.4 A pressure volume diagram of the working cycle of a gas turbine engine."**

## 5. Constant Pressure Combustion

The continuous Brayton-cycle flow and the fact that the combustion chamber is **open to the gas stream rather than sealed** make approximately constant-pressure combustion possible. The turbine therefore avoids the large, intermittent combustion-pressure pulses present inside a reciprocating engine cylinder.

A piston engine may experience peak cylinder pressures **above 1,000 lb/in²**. Its components must be sufficiently strong to carry these loads, which increases structural weight. High-octane fuels are also required where necessary to prevent detonation under those operating conditions.

The different combustion process of a gas turbine generally permits **lighter structural construction** and the use of **lower-octane fuels**, instead of relying on the heavy pressure-resistant structures associated with reciprocating-cylinder combustion.

## 6. The Temperature Limit of the Engine

A gas turbine is a heat engine. Raising the combustion temperature increases the amount of energy available for expansion, and a greater expansion can improve **thermal efficiency**.

There is, however, an upper limit to the gas temperature the engine can tolerate. This is principally determined by the ability of the **turbine blades** and **nozzle guide vanes** to withstand the hot flow. Their construction materials and cooling arrangements therefore limit permissible combustion temperatures.

Developments in high-temperature materials and effective cooling of turbine components have made it possible for newer engines to operate at substantially higher gas temperatures. This is one reason their thermal efficiencies can exceed those of earlier gas turbines.

## 7. Application of the Gas Laws in the Gas Turbine Engine

Air acts as the working fluid throughout the engine. Its **pressure, volume and temperature** change as mechanical work is applied to it, heat is added during combustion and energy is extracted during expansion. The relationships can be understood using Boyle's law, Charles's law and the combined gas law.

### 7.1 Boyle's Law

For a fixed quantity of gas held at a constant absolute temperature, **pressure increases as volume decreases**. Mathematically:

$$
P V = K
$$

where $P$ is absolute pressure, $V$ is gas volume and $K$ is a constant for the stated conditions. Strictly constant-temperature compression is not representative of an operating gas turbine; consequently, Boyle's law is most useful here when considered alongside the temperature relationship.

### 7.2 Charles's Law

For a fixed quantity of gas at **constant pressure**, its volume changes in direct proportion to its **absolute temperature**:

$$
\frac{V}{T} = K
$$

The relationship is stated for ideal or perfect gases. It explains the tendency of hot gas to expand when heat is added without increasing pressure, as approximated in a turbine combustion chamber. Actual gas-turbine combustion has some pressure loss, so the ideal constant-pressure condition is not exact.

### 7.3 The Combined Gas Law

The effects of pressure, temperature and volume are brought together in the expression:

$$
\frac{PV}{T} = K
$$

For a given quantity of gas, **pressure multiplied by volume varies in proportion to absolute temperature**. The operating cycle can be considered in three main phases.

**During compression:** The compressor performs work on the incoming air, increasing its pressure, decreasing its volume and raising its temperature. Increasing the compression ratio tends to improve thermal efficiency and reduce specific fuel consumption. In addition, changing outside-air temperature changes the density of the incoming air. Colder air is denser, and the compressor has to do more work on it. Without compensation from the fuel-control unit, the increased demand may show as a reduction in engine rotational speed (**rpm**).

**During combustion:** Fuel burns with the compressed air and raises its temperature sharply. The heated gas expands substantially, with pressure remaining approximately constant except for the pressure losses within the combustor.

**During expansion:** Gas passes through the turbine, transferring some of its energy to the rotating machinery. The gas loses pressure and temperature, while its volume increases.

The same sequence is associated with characteristic variations in **axial velocity** at different engine stations.

> **Image Generation Prompt — Figure 13.5 Changes in pressure, temperature & velocity in a single spool axial flow engine.**
>
> Reproduce the original wide combined cutaway-and-graph illustration on a white background, inside a thin light-grey rectangle. Across the **upper portion**, show a left-to-right sectional view of a single-spool axial-flow gas turbine, divided by bold labels **"COMPRESSION"**, **"COMBUSTION"**, **"EXPANSION"**. Start with a grey **"AIR INTAKE"**, many narrowing grey compressor stages, a central combustion chamber with a small yellow flame, black turbine guide-vane stages and a white tapering **"PROPULSION NOZZLE"**. Include leader-arrow labels **"NOZZLE GUIDE VANES"** and **"COMPRESSOR DELIVERY PRESSURE"**. In the **lower portion**, recreate a rectangular line plot sharing horizontal engine-position progression. Show a left triple scale headed **"Deg C."**, **"Ft/sec."**, **"Lb/sq.in."**, with graduations from 0 through 3000 (temperature and velocity) and 0 through 150 (pressure). Draw **"TOTAL PRESSURE"** as a dark-blue line climbing through the compressor, near-flat at the combustion chamber, and dropping through the turbine; **"AXIAL VELOCITY"** as a red line with strong turbine spikes and a sharp rise at the exit; **"TEMP"** as a yellow curve rising gradually in compression, peaking near combustion, and declining through the turbine. Show close vertical turbine-stage lines and fine grey graph gridlines. Preserve the original labels, units, line colors, curves, relative placements and arrows without introducing extra information. Caption exactly **"Figure 13.5 Changes in pressure, temperature & velocity in a single spool axial flow engine."**

## 8. Duct Design

Gas-turbine components need different combinations of **air speed and static pressure**. A compressor must build pressure without allowing an uncontrolled increase in flow velocity. By contrast, the exhaust nozzle must convert much of the remaining gas pressure into a high exit velocity.

The engine accomplishes this through carefully shaped passages. These ducts govern the conversion between **pressure energy** and **kinetic energy**, so their efficiency affects the performance of the complete engine.

### 8.1 Divergent Ducts

A **divergent duct** has an increasing flow area in the direction of travel. It slows the flow and increases its static pressure and temperature under the conditions represented in the chapter. A diffuser placed between the final compressor stage and the combustion chamber can therefore raise compressor-delivery pressure without requiring extra mechanical work from the compressor. It also slows the air before combustion, which makes combustion-chamber operation easier.

### 8.2 Convergent Ducts

A **convergent duct** narrows in the direction of flow. In the application illustrated, it accelerates the gas while its static pressure and temperature decrease. This principle is used by **turbine nozzle guide vanes** to speed the hot gas before it meets the turbine blades.

The turning force on a turbine is influenced by the rate of gas movement into the blades. Converting some of the high gas-pressure energy into velocity therefore improves the ability of the gas to turn the turbine and drive its shaft.

> **Image Generation Prompt — Figure 13.6 The use of divergent & convergent ducts to control the passage of airflow through the engine.**
>
> Reconstruct the original black-grey-and-red, two-row technical diagram on a white background in a thin rectangular border. In the **upper row**, show **"THE DIVERGENT DUCT"** at left: parallel red airflow lines with arrowheads moving left-to-right through a black-outlined widening passage. Place the prominent three-line caption **"VELOCITY-DECREASING / PRESSURE-INCREASING / TEMPERATURE-INCREASING"** above it. On the upper right, continue the red airflow through a simplified grey axial-compressor outlet casing and flared diffuser; preserve the label **"AN EXAMPLE OF A DIVERGENT DUCT AN AXIAL FLOW COMPRESSOR OUTLET CASING"** (with words grouped as in the drawing). In the **lower row**, show **"THE CONVERGENT DUCT"** at left: converging black duct walls and red airflow arrows accelerating toward the narrower right opening. Underneath, label **"VELOCITY-INCREASING / PRESSURE-DECREASING / TEMPERATURE-DECREASING"**. At lower right, show grey turbine nozzle guide vanes and curved turbine blades in close-up, narrow red flow passages and downward curved red arrows, with text **"AN EXAMPLE OF A CONVERGENT DUCT, THE FLOW THROUGH THE TURBINE NOZZLE GUIDE VANES"** and **"DIRECTION OF ROTATION OF TURBINE BLADES"** accompanied by a large blue downward arrow. Maintain the original two-level arrangement and all callout relationships. Caption exactly **"Figure 13.6 The use of divergent & convergent ducts to control the passage of airflow through the engine."**

## 9. Airflow Through a Pure Straight Turbojet Engine

A **single-spool turbojet** connects the compressor and turbine by one shaft. This arrangement was widely used where **a small frontal area and high forward speed** were desirable, notably in fighter aircraft. One drawback was the difficulty of obtaining smooth, stable airflow through the engine over the full range of rotational speeds.

In operation, air enters the axial compressor, is compressed and then passes into the combustion chambers. Fuel is introduced and burned, making the hot gas expand significantly. The turbine extracts enough energy from this gas to drive the compressor through their common shaft. The gas energy remaining after the turbine is converted into **propulsive thrust** as it passes through the jet pipe and discharges into the atmosphere.

> **Image Generation Prompt — Figure 13.7 A single spool axial flow compressor turbojet engine.**
>
> Reproduce the original slim, unlabelled engine cross-section as a side-on engineering drawing inside a thin grey rectangular frame on white. The engine extends horizontally from **left intake to right exhaust**, with a light-blue intake flow region, a long row of closely spaced white/grey axial compressor blades, an elongated central grey rotor and single common shaft, two red/orange combustor regions around the core with small yellow flames, black turbine blade groups near the aft section and a bright-yellow jet exhaust plume emerging from the right end. Show the streamlined outer case, dark-grey central shaft and narrowing rear nozzle. Keep the turbine-compressor mechanical arrangement visually continuous, with no modern callouts or extra labels inside the art. Caption exactly **"Figure 13.7 A single spool axial flow compressor turbojet engine."**

## 10. Airflow Through a Turboprop Engine

Two forms of **turboprop** arrangement are illustrated: one using a **centrifugal compressor** and another using an **axial-flow compressor**. Both use turbine power to drive a propeller.

Turboprop output is expressed as **Equivalent Shaft Horsepower (ESHP)**, which accounts for the mechanical shaft power produced at the turbine together with the equivalent contribution of **residual exhaust thrust**.

Most of the gas energy remaining after the turbine has driven the compressor is extracted as useful mechanical power for the propeller. This is the main difference from a turbojet, where the exhaust retains much more energy for direct jet propulsion. With an efficient turboprop turbine, the remaining jet contribution is comparatively small and is often described as **residual thrust**.

The internal flow still follows the familiar sequence: air is compressed, fuel burns in the combustion chamber, and gas volume increases at approximately constant pressure. During turbine expansion, the gas gives up pressure, temperature and velocity as the engine converts its energy into shaft power. The propeller receives that power through a **reduction gearbox**.

> **Image Generation Prompt — Figure 13.8 Centrifugal and axial compressor turboprop engines.**
>
> Recreate the original double-engine cutaway comparison on white inside a fine rectangular outline. Arrange two **unlabelled side profiles** vertically. The **top engine** is a compact grey turboprop with a large rearward-curved flow passage and distinctive rounded **centrifugal compressor** near the front, a folded combustion path, black turbine vane stages near the back and a propeller/output shaft projecting from the left end. The **bottom engine** is a longer, straight-through grey turboprop with a short intake, multiple rows of **axial compressor blades**, separated combustor sections, black turbine-stage rows, a central shaft and a propeller-drive shaft exiting from the front. Both drawings show the internal passages and machinery in shades of light to dark grey with black outlines; use the original different lengths and proportions and do not introduce colored annotations or new text. Caption exactly **"Figure 13.8 Centrifugal and axial compressor turboprop engines."**

## 11. Airflow Through a Turboshaft Engine

A **turboshaft** has much in common with a turboprop, but its useful output is delivered through a shaft rather than directly to a propeller. It can supply the mechanical power required for **helicopter rotors** or drive an **alternator** where a compact source of electrical power is needed. This makes the turboshaft arrangement suitable for many modern transport-aircraft **Auxiliary Power Units (APUs)**.

Turboshaft designs commonly use a **free power turbine**. Unlike a turbine mounted on the compressor shaft, the free turbine is mechanically independent of the compressor. Consequently, its rotational speed does not have to match the compressor's preferred operating speed, giving the output shaft a broader usable speed range.

The illustrated engine uses a **reverse-flow combustion system**. Turning the airflow back through the combustion chamber allows a shorter, more rigid and lighter engine arrangement. In this design, a centrifugal compressor is included in the high-pressure stage so that the air is discharged radially and can enter the reverse-flow combustor correctly.

After combustion, gases pass through the compressor-driving high- and low-pressure turbine stages. Once sufficient energy has been extracted to operate the compressors, the remaining energy is transferred to the **free power turbine**, which drives the equipment coupled to its output shaft.

> **Image Generation Prompt — Figure 13.9 A single spool turboshaft engine incorporating a free power turbine.**
>
> Reconstruct the original horizontal cutaway illustration of a compact turboshaft on white. Use a lightly detailed silver/grey engine body with a front intake on the **left**, a grey axial compressor and central rotating shaft, a **centrifugal compressor stage** just before the combustion zone, and a **reverse-flow combustion chamber** that curves backwards around the core. Show the two distinctive large **bright-yellow U-shaped outer air passages** above and below the core, red hot-gas flow through the combustion zone, blue curved flow arrows at the reversing passages, dark turbine rows and a mechanically separate free power-turbine/output-shaft assembly extending to the **right**. The view is side-on, with symmetrically drawn upper and lower ducts, fine black outlines and no invented text or arrows. Preserve the contrast between grey hardware and yellow/blue/red flow regions. Caption exactly **"Figure 13.9 A single spool turboshaft engine incorporating a free power turbine."**

## 12. Airflow Through a Low Bypass Ratio Engine

A bypass engine divides the intake flow into **two streams**: one enters the engine's **hot core**, while the other travels through the **fan or bypass duct**. The **bypass ratio** compares their mass flow rates:

$$
\text{Bypass ratio} = \frac{\text{Mass flow through bypass duct}}{\text{Mass flow through hot core}}
$$

A **low bypass ratio** is approximately **1:1 or 2:1**; a **high bypass ratio** is represented in this chapter by about **5:1**.

For example, if the total airflow handled by the fan is **1,500 lb** and the core receives **300 lb**, the bypass airflow is the difference:

$$
\text{Bypass mass flow} = 1{,}500 - 300 = 1{,}200~\mathrm{lb}
$$

$$
\text{Bypass ratio} = \frac{1{,}200}{300} = 4:1
$$

The illustrated **twin-spool, low-bypass turbojet** operates initially like a pure turbojet. Air passes through the low-pressure compressor, after which part is sent through the bypass duct while the rest enters the high-pressure compressor. The proportion in each path is determined by the bypass ratio.

> **Image Generation Prompt — Figure 13.10 A twin spool low ratio bypass turbojet**
>
> Produce a precise black, grey and muted-red engineering cross-sectional drawing of a **twin-spool low-bypass turbojet** on a white background inside a thin rectangular frame. Air travels left to right. Draw the front compressor blade rows, a visible bypass annulus around the hot core, a separate high-pressure compressor, central combustion chambers, high- and low-pressure turbines, an aft exhaust duct and a rear convergent outlet. Add an upper row of vertical thin leader lines for the exact sequential station labels **P₁/T₁, P₂/T₂, P₃/T₃, P₄/T₄, P₅/T₅, P₆/T₆, P₇/T₇, P₈/T₈**, with **P₀/T₀** on the far-left lower intake side. Put **N₁** under the first/low-pressure rotating group and **N₂** under the high-pressure rotating group. Draw compressor stages in blue/grey and core combustion in pale red/pink, with the shaft/spool connections shown distinctly. Preserve the relative engine geometry and station positions in the original technical cutaway. Caption exactly **"Figure 13.10 A twin spool low ratio bypass turbojet"**.

### 12.1 Engine Measurement Stations

The designation used for an engine measurement consists of a **letter** identifying the variable and a **number** identifying the station, generally counted from front to rear.

- **P:** Gas pressure.
- **T:** Gas temperature.
- **N:** Rotating assembly or rotational speed.

The historical Rolls-Royce station notation is:

| Symbol | Station or assembly |
|---|---|
| **P₀, T₀** | Ambient condition |
| **P₁, T₁** | Inlet |
| **P₂, T₂** | Low-pressure (LP) compressor delivery |
| **P₃, T₃** | High-pressure (HP) compressor delivery |
| **P₄, T₄** | Turbine entry |
| **P₅, T₅** | HP turbine exit |
| **P₆, T₆** | LP turbine exit |
| **P₇, T₇** | Exhaust |
| **P₈, T₈** | Propelling nozzle |
| **N₁** | LP compressor/turbine assembly |
| **N₂** | HP compressor/turbine assembly |

After leaving the HP compressor, the core airflow enters the combustion system and expands through the turbines. In the exhaust mixing unit, the hot core gases are joined by the airflow that travelled through the bypass duct.

At normal jet-transport operating speeds, both low- and high-bypass configurations can provide higher **propulsive efficiency** than a pure turbojet. The **high-bypass** arrangement also provides a markedly lower **specific fuel consumption**.

## 13. Airflow Through a High Bypass Ratio (Turbofan) Engine

Experience with low-bypass engines demonstrated that handling **more air at a lower exhaust velocity** could raise propulsive efficiency significantly. At normal transport-aircraft cruise speeds, this could provide a result comparable with turboprops and better than that of a pure turbojet. This development led to the **front-fan turbofan**.

A well-known example is the **Rolls-Royce RB211**, shown as a **three-spool** engine. Air first enters the intake and passes through the large **low-pressure compressor or fan**. Its pressure rises, and the airflow then divides: one portion passes along the bypass duct, while the rest continues through the **intermediate-pressure compressor** and then the **high-pressure compressor**. The bypass ratio determines the relative mass flows.

The greatest share of thrust in this high-bypass arrangement comes from the large mass of **bypass air moving at relatively low speed**. The hot-core flow acquires energy through combustion, but much of this energy is required to drive the three rotating compressor/fan assemblies. The rearmost **low-pressure turbine** extracts most of the remaining gas energy to turn the large front fan. Ideally, only a small residual exhaust-thrust component is left in the core gas after the turbine.

> **Image Generation Prompt — Figure 13.11 Triple spool front fan turbojet**
>
> Reproduce the original precise two-dimensional side cutaway of a **Rolls-Royce-style triple-spool turbofan**, seen from the **left intake** to **right exhaust**, within a thin grey rectangular image frame on white. Use a tall front fan just aft of the bellmouth, colored in alternating grey/blue herringbone blades. Draw a wide annular bypass duct around a central core, with a pale-yellow flow region, separate intermediate- and high-pressure compressor sections, symmetric upper and lower reddish combustor blocks, and a multi-row turbine group at the rear. Show **three concentric rotating shafts** in purple, blue and yellow/dark grey connecting the **N1**, **N2**, and **N3** rotating systems. Keep the exhaust cone and thin outer contour in grey. Reproduce **red vertical station leader lines** and these original text labels in approximately their exact order: **P0/T0**, **P1/T1**, **P2/T2**, **P3/T3**, **P4/T4**, **P5/T5**, **P6/T6**, **P7/T7**, **P8/T8**, and **PE/TE** at the far right; include **N1**, **N2**, **N3** beneath the appropriate shafts and **PF** near the lower bypass-flow area. Do not omit or relocate labels, merge the shafts, or simplify the three-spool configuration. Caption exactly **"Figure 13.11 Triple spool front fan turbojet"**.

## 14. Propulsive Efficiency

A given thrust can be produced by accelerating a **large mass of air by a small amount** or a **smaller mass by a much greater amount**. The first approach tends to cause lower turbulence losses and makes more effective use of the energy supplied to the airflow.

**Propulsive efficiency**, also termed **external efficiency**, describes how effectively the energy associated with the moving air is turned into useful work on the aircraft rather than remaining as unused kinetic energy in the exhaust.

$$
\text{Propulsive efficiency} = \frac{\text{Work done on aircraft}}{\text{Work done on airflow} + \text{Work wasted in exhaust}}
$$

For the velocity relationship used here:

$$
\eta_p = \frac{2V}{V + V_j}
$$

where $V$ is **aircraft forward speed** and $V_j$ is **jet efflux velocity**, both expressed in the same units.

### 14.1 Example 1 — Aircraft at 200 mph

For a low-bypass turbojet travelling at **200 mph** with an exhaust velocity of **1,000 mph**:

$$
\eta_p = \frac{2 \times 200}{200 + 1{,}000} = \frac{400}{1{,}200} \approx 0.333 = 33\%
$$

### 14.2 Example 2 — Aircraft at 600 mph

With the jet velocity unchanged at **1,000 mph** but the aircraft moving at **600 mph**:

$$
\eta_p = \frac{2 \times 600}{600 + 1{,}000} = \frac{1{,}200}{1{,}600} = 0.75 = 75\%
$$

The examples show that **propulsive efficiency rises when aircraft forward speed becomes closer to the jet-exhaust speed**.

> **Image Generation Prompt — Figure 13.12 The propulsive efficiencies of gas turbine engines.**
>
> Recreate the original compact rectangular multi-curve graph on white with thin dark axes and square grid lines. Horizontal axis label **"AIRSPEED mph"**, with ticks **0, 200, 400, 600, 800, 1000**. Vertical axis label **"PROPULSIVE EFFICIENCY per cent"**, with percentage graduations from zero to approximately 100. Draw the labeled efficiency trends for four engine types exactly as distinguished in the source: a **red/orange TURBO-PROP** curve rising quickly to high efficiency at relatively low speed and turning downward beyond the medium-speed range; a **yellow LOW BY-PASS** rising curve; a **blue HIGH RATIO BY-PASS** rising curve; and a **dark straight rising PURE TURBOJET** trend, relatively poor at low speed but improving as speed increases. Print their respective names **"TURBO-PROP"**, **"LOW BY-PASS"**, **"HIGH RATIO BY-PASS"**, and **"PURE TURBOJET"** directly on or near the curves, rotated where the original does so. Match their order, rough crossover locations, line colors and graph proportions; do not invent additional efficiency categories. Caption exactly **"Figure 13.12 The propulsive efficiencies of gas turbine engines."**

At **low flight speeds**, a turboprop gives the best propulsive efficiency among the illustrated arrangements. Its efficiency, however, deteriorates noticeably above roughly **350 mph** because the airflow at the propeller tips becomes disturbed.

A **pure turbojet** is less efficient than a turboprop at low speeds, but its efficiency improves as airspeed increases. Above approximately **800 mph**, it can become more efficient than a propeller system, with the theoretical trend approaching **90%** efficiency at sufficiently high speed.

Most transport aircraft operate in a speed range between these extremes rather than routinely flying near 800 mph. For that reason the **bypass/turbofan** fills an important performance range. Moving a comparatively large mass of air at a relatively low jet velocity can produce higher propulsive efficiency than either the turboprop or the pure turbojet at typical jet-transport speeds.

## 15. Modular Construction Methods

Large transport aircraft reduce the cost of carrying passengers when they remain available for service. If a major component such as an engine becomes unserviceable, however, an aircraft carrying **300–400 passengers** may incur substantial costs while the passengers are accommodated and the aircraft is kept out of operation.

To reduce the disruption associated with major engine faults, manufacturers use **modular construction**. Instead of replacing or removing an entire powerplant for every major component failure, the engine is arranged in separately replaceable sections. A defective module can then be removed and another fitted, reducing the inconvenience and financial burden of maintenance.

> **Image Generation Prompt — Figure 13.13 Modular construction units.**
>
> Reconstruct the original **exploded modular gas-turbine assembly diagram** as a detailed grey engineering illustration against pure white inside a thin rectangular border. Components should be separated along a red dashed horizontal engine centreline from **left to right**, with several modules also positioned beneath that line. At far left show a large bladed fan wheel and its shaft labeled **"LP COMPRESSOR (FAN) MODULE"**. Slightly right and behind it place a short, dense cylindrical compressor segment labeled **"IP COMPRESSOR MODULE"**. Further right and larger, draw a substantial annular **"LP COMPRESSOR (FAN) CASE MODULE"** with grey blade-like circumferential fins. Beneath the shaftline, include a lumpy irregular cast-metal assembly labeled **"HS EXTERNAL GEARBOX MODULE"**, a circular housing at lower left labeled **"INTERMEDIATE CASE MODULE"**, a shorter cylindrical **"HP SYSTEM MODULE"** near the lower centre, and a large aft bladed ring section at lower right labeled **"IP & LP TURBINE MODULE"**. Point narrow blue arrows from each label to its corresponding component. Retain the separated exploded-view geometry, shading, dashed red alignment guides, and all original labels exactly. Do not attach the pieces or add components. Caption exactly **"Figure 13.13 Modular construction units."**

## Questions

**1.** What happens to gas passing through a convergent duct under the operating conditions described?

   a. Velocity and temperature rise, while pressure falls.  
   b. Velocity rises, while temperature and pressure both fall.  
   c. Velocity falls, while temperature and pressure both rise.  
   d. The gas expands adiabatically.

**2.** Which sequence puts engine types in their appropriate order for best propulsive efficiency as airspeed increases from low to high?

   a. High-bypass turbojet → low-bypass turbojet → pure turbojet → turboprop.  
   b. Low-bypass turbojet → pure turbojet → turboprop → high-bypass turbojet.  
   c. Pure turbojet → turboprop → high-bypass turbojet → low-bypass turbojet.  
   d. Turboprop → high-bypass turbojet → low-bypass turbojet → pure turbojet.

**3.** In which location does the gas turbine reach its highest pressure?

   a. Between the compressor outlet and the combustion chamber.  
   b. Within the combustion chamber.  
   c. Inside the jet pipe.  
   d. At the P1 sensing point.

**4.** Which component determines the fan's rotational speed in a turbofan?

   a. The reduction gear.  
   b. A wastegate.  
   c. The turbine.  
   d. Variable-pitch adjustment.

**5.** Which statement correctly describes airflow in a high-bypass-ratio engine?

   a. All intake air travels through the low- and high-pressure compressors.  
   b. Some intake air bypasses the high-pressure compressor.  
   c. Some intake air bypasses the low-pressure compressor.  
   d. All intake air passes through the high-pressure compressor.

**6.** What is the principal maintenance benefit of modular engine construction?

   a. It is confined to turboprop applications.  
   b. It cannot be applied to high-bypass engines.  
   c. Its purpose is to reduce engine weight.  
   d. A defective engine section can be replaced without changing the complete engine.

**7.** An engine's bypass ratio compares which two airflows?

   a. Primary flow against tertiary flow.  
   b. Cold bypass-duct flow against hot-core flow.  
   c. Exhaust pressure against intake pressure.  
   d. Primary flow against secondary flow.

**8.** The operating principle of the gas turbine is based on:

   a. Newton's Third Law of Motion.  
   b. Producing thrust numerically equal to aircraft weight.  
   c. Ejecting gas at exactly the aircraft's forward speed.  
   d. The fluid-flywheel principle.

**9.** What does heating the air in a turbine combustion chamber principally permit?

   a. Major gas expansion while pressure remains nearly constant.  
   b. Major gas expansion at fixed volume.  
   c. Major expansion accompanied by progressively falling static pressure.  
   d. Very little expansion at fixed volume.

**10.** How do the gas properties change in a divergent duct under the stated conditions?

   a. Pressure falls while both velocity and temperature rise.  
   b. Pressure, velocity and temperature all rise.  
   c. Pressure and temperature rise as velocity falls.  
   d. Pressure falls and temperature rises while velocity stays constant.

**11.** Which shaft connections are correct in a twin-spool gas turbine?

   a. LP compressor and HP compressor share the same connection.  
   b. HP turbine drives LP compressor, and LP turbine drives HP compressor.  
   c. LP turbine drives LP compressor, and HP turbine drives HP compressor.  
   d. HP and LP turbines connect together, while HP and LP compressors connect together.

**12.** What does a bypass ratio of **5:1** mean?

   a. Five pounds bypass the core for every ten pounds entering the engine.  
   b. Five pounds enter the HP compressor for every ten pounds entering the intake.  
   c. Ten pounds take the bypass route for every five pounds entering the intake.  
   d. Five pounds pass through the bypass duct for each one pound passing through the hot core.

**13.** What happens to airflow velocity between the compressor outlet and the combustion chamber?

   a. It does not change.  
   b. It decreases.  
   c. It increases.  
   d. Its pressure decreases.

**14.** In a ducted-fan engine, which turbine drives the fan?

   a. The high-pressure turbine.  
   b. The rearmost turbine.  
   c. The intermediate-pressure turbine.  
   d. All three turbines together.

**15.** What contribution does bypass airflow make in a bypass engine?

   a. It increases the overall airflow mass and improves propulsive efficiency.  
   b. It cools the combustor and thereby increases thermal efficiency.  
   c. It reduces total airflow mass but increases propulsive efficiency.  
   d. It increases total airflow mass while lowering propulsive efficiency.

**16.** Which statement correctly identifies the source of most thrust?

   a. Most turbofan thrust comes from the hot turbine exhaust.  
   b. Most turboprop thrust comes from turbine exhaust.  
   c. Most turboshaft thrust comes from its free-turbine exhaust.  
   d. Most turbofan thrust is produced by bypass airflow.

**17.** What characteristic acceleration does a pure turbojet produce?

   a. Small acceleration of a large mass of air.  
   b. Large acceleration of a large mass of air.  
   c. Small acceleration of a small mass of air.  
   d. Large acceleration of a small mass of air.

**18.** How does combustion occur during the Brayton cycle?

   a. Continuously.  
   b. Once during each revolution.  
   c. Once every two revolutions.  
   d. Only while starting the engine.

## Answers

| Question | Answer | Question | Answer | Question | Answer |
|---:|:---:|---:|:---:|---:|:---:|
| 1 | b | 7 | b | 13 | b |
| 2 | d | 8 | a | 14 | b |
| 3 | a | 9 | a | 15 | a |
| 4 | c | 10 | c | 16 | d |
| 5 | b | 11 | c | 17 | d |
| 6 | d | 12 | d | 18 | a |
