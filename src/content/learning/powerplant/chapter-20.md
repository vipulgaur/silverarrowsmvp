# Chapter 20: Gas Turbines — Thrust

## Introduction

A gas turbine produces forward thrust by accelerating a flow of air towards the rear of the engine. This action creates a reaction force acting in the opposite direction, as described by **Newton's Third Law of Motion**. The associated relationship between mass, acceleration, and force is:

$$
F = ma
$$

where **F** represents force, **m** is mass, and **a** is acceleration.

## Thrust

The gas turbine first develops **pressure energy** in its airflow and subsequently converts much of that energy into the **kinetic energy** of a fast-moving exhaust stream. Part of the available gas energy drives the turbine; the remaining energy can be used to produce propulsive force.

During combustion, the addition of fuel and heat causes the working gas to expand. The expanded flow must travel at a substantially greater velocity to pass through the exhaust nozzle. The rearward acceleration of that flow is responsible for the engine's forward reaction force.

> **Image Generation Prompt — Figure 20.1**
>
> Reconstruct the original wide, horizontal, side-on cutaway illustration of a gas-turbine engine on a plain white background. Retain the exact original caption **“Figure 20.1”**. The left inlet and compressor occupy the left half: a wide blue intake and numerous closely spaced blue compressor blade stages taper into a narrower central section. The middle region is pink/mauve with two mirrored combustion-chamber bulges containing small orange flame shapes, one above and one below the centreline. To the right, show several thin purple turbine blades followed by an expanding orange exhaust duct ending at the far right. Through the centre run two long opposing energy-label areas: bold black **“POTENTIAL ENERGY”** on the blue/grey left-central region and bold black **“KINETIC ENERGY”** on the pink/orange right-central region. At the bottom-left, reproduce **“ONE UNIT IN”** and at the bottom-right **“ONE UNIT OUT”**. Keep the compressor progressively narrowing, the combustion region symmetrical above and below the centreline, and the exhaust visibly flared. Flat technical vector colour scheme, original aspect ratio, crisp thin outlines, no additional annotations.

## The Thrust Formula

Total engine thrust has two components:

- **Momentum thrust:** The reaction to the change in momentum of the air passing through the engine. This component exists whenever the engine is operating.
- **Pressure thrust:** An additional force that becomes relevant when the nozzle flow reaches sonic conditions and a pressure difference is maintained between the nozzle and the surrounding atmosphere.

The combined expression is:

$$
\text{Total thrust} = W_a(V_o-V_i)+\text{pressure thrust}
$$

Here:

- $W_a$ = mass of air flowing through the engine each second;
- $V_o$ = velocity of the air leaving the engine;
- $V_i$ = velocity of the air entering the engine.

### Momentum Thrust

The momentum component depends on the difference between inlet and outlet speeds. As the aircraft moves forward faster, the inlet velocity rises, reducing the difference if the exhaust velocity is unchanged. For this reason, momentum thrust is greatest when the aircraft is stationary before take-off.

The conditions most favourable to static thrust are **sea-level atmospheric pressure**, **low air temperature**, and **low humidity**. High pressure and cool, dense air allow a greater mass of air to be processed by the engine.

Thrust measured with the aircraft stationary is described here as **gross thrust**, whereas the thrust available once forward airflow enters the engine is termed **net thrust**.

### Gross Thrust ($F_g$)

For the weight-flow quantities and feet-per-second velocities used in the Imperial examples, the momentum-thrust calculation is written:

$$
F_g=\frac{W_a(V_o-V_i)}{g}
$$

where:

- $W_a$ = weight flow of air each second;
- $V_o$ = exhaust velocity, in ft/s;
- $V_i$ = inlet velocity, in ft/s;
- $g$ = gravitational conversion factor, **32.2 ft/s²**.

When working in Imperial weight-flow units (lb per second) and ft/s, division by $g$ is required to obtain the force in pounds-force. When mass flow is instead given in SI units (kg/s) and the velocities are in m/s, **no division by $g$ is made**. The SI calculation directly produces newtons.

Engine thrust is commonly specified in **pounds-force (lbf)**, with the equivalent value in **kilonewtons (kN)** also shown.

### Gross Thrust Calculation ($F_g$)

Consider a business jet standing still at take-off power with the following conditions:

- Airflow: **60 lb/s**.
- Exit velocity: **1,600 ft/s**.
- Inlet velocity: **0 ft/s**, because the aircraft is stationary.

Substituting these values:

$$
F_g=\frac{60(1600-0)}{32.2}
    =2{,}981~\mathrm{lbf}
$$

The corresponding thrust is approximately **13.26 kN**.

The same calculation expressed in SI units uses:

- 60 lb = **27.211 kg**.
- 1,600 ft = **487.68 m**.
- 1 lbf = **4.448 N**.

$$
F_g=27.211(487.68-0)
   \approx13.27~\mathrm{kN}
$$

### Net Thrust Calculation ($F_n$)

If the same aircraft is now flying at **300 kt true airspeed**, the inlet velocity is approximately **506 ft/s**. Retaining an exhaust speed of 1,600 ft/s and airflow of 60 lb/s gives:

$$
F_n=\frac{W_a(V_o-V_i)}{g}
$$

$$
F_n=\frac{60(1600-506)}{32.2}
   \approx2{,}038~\mathrm{lbf}
$$

The equivalent force is approximately **9.07 kN**. The calculation demonstrates the loss of momentum thrust when inlet velocity increases while the exhaust velocity is held constant.

### Fan Engine Thrust

A turbofan develops thrust in two air streams that must be calculated separately:

1. The **fan or cold stream**, which moves a comparatively large mass of air at a lower velocity.
2. The **core or hot stream**, which carries a smaller mass of air at a higher velocity.

Total engine thrust is the sum of the forces produced by these streams.

> **Image Generation Prompt — Figure 20.2**
>
> Create a faithful horizontal cutaway technical drawing of a high-bypass turbofan, white background, thin black component outlines, with the original caption **“Figure 20.2”** below. The large circular inlet and rounded intake lip start at the far left. Show a big blue/grey fan at the entrance and a broad upper and lower bypass duct flowing around the central core. Inside the core depict a compressor section in yellow/light gold, symmetric red patterned combustion chambers above and below a central shaft, and a grey multi-stage turbine and pointed exhaust centrebody to the right. Keep two flow-path bands visibly separate. Near the upper left-middle label the bypass-air quantity **“1200 lb”** and inside the core label **“300 lb”**. On the far right use thin black horizontal arrows pointed right. Place exact labels **“Fan (Cold Stream) 800 ft/sec”** beside the outer-flow arrow and **“Core Engine (Hot Stream) 1000 ft/sec”** beside the centre arrow. Include the other visible rightward flow arrows and the dark central shaft; no additional textual labels or altered quantities. Match the original long, low aspect ratio.

### Example: Fan and Core Thrust

For the two-stream engine illustrated above:

**Fan stream** — airflow of **1,200 lb/s** and velocity increase of **800 ft/s**:

$$
F_{\mathrm{fan}}=\frac{1200\times800}{32.2}
                \approx29{,}814~\mathrm{lbf}
$$

This is approximately **132.6 kN**.

**Core stream** — airflow of **300 lb/s** and velocity increase of **1,000 ft/s**:

$$
F_{\mathrm{core}}=\frac{300\times1000}{32.2}
                 \approx9{,}317~\mathrm{lbf}
$$

This is approximately **41.5 kN**.

Combining the two thrust contributions using the rounded individual values:

$$
F_{\mathrm{total}}=29{,}814+9{,}317
                  =39{,}131~\mathrm{lbf}
$$

The total is given as approximately **175 kN**. In a fan engine, the fan can contribute **75%–90% of the entire thrust**.

## Pressure (Choked Nozzle) Thrust

Momentum change normally accounts for the greater share of engine thrust. However, during high-power operation, the gas in an exhaust nozzle can reach the **local speed of sound**. In this condition, the nozzle becomes **choked**, and the flow cannot be accelerated further through the controlling nozzle section in the manner assumed for an unchoked flow.

When the nozzle pressure remains higher than the external atmospheric pressure, the pressure difference produces a further thrust contribution acting across the nozzle exit area. This is **pressure thrust**, which is added to momentum thrust.

Many turbojets operate with a choked nozzle at high power. A non-choked nozzle, with no effective excess exit pressure in the calculation presented here, develops thrust through its momentum change alone.

### Choked Nozzle Thrust Example

At an altitude of approximately **32,000 ft**, the outside atmospheric pressure is taken as **4 psi**. Suppose that the pressure at the nozzle is **10 psi**. The pressure difference is therefore **6 psi**.

The basic relationship is:

$$
\text{Force}=\text{Pressure}\times\text{Area}
$$

For the pressure component of thrust:

$$
P_f=(P-P_o)A
$$

where:

- $P_f$ = pressure-thrust force;
- $P$ = nozzle internal pressure;
- $P_o$ = ambient pressure;
- $A$ = nozzle area.

Taking **$A=332$ in²**, **$P=10$ psi**, and **$P_o=4$ psi**:

$$
P_f=(10-4)\times332
   =1{,}992~\mathrm{lbf}
$$

Pressure thrust is approximately **8.86 kN**.

> **Image Generation Prompt — Figure 20.3**
>
> Reconstruct the original black-outline schematic of a choked exhaust nozzle, showing a rectangular duct entering from the left and a nozzle converging toward a short vertical exit boundary on the right. Retain the caption **“Figure 20.3”**. The incoming air region is white and bounded by thin black horizontal top and bottom walls. On the nozzle's right half, draw a tapering trapezoidal structure with multiple parallel jagged/zigzag vertical pressure-wave fronts, narrowest near the exit. Draw three red horizontal arrows: small rightward-pointing arrows near the upper and lower left regions, and one large red arrow across the centre pointing **left**, indicating the reaction to pressure. Place the letter **“P”** beside the large central arrow inside the nozzle and **“Pₒ”** immediately to the right of the exit line. Maintain the original positions of the walls, wave fronts, arrows, and black labels on a white background; do not add any new concepts or legend.

## Thrust Indications

Turbojet output is represented by thrust and may be indicated using **P7** or **engine pressure ratio (EPR)** instrumentation. These instruments serve as thrust-related indicators.

A turbopropeller is assessed by its **shaft horsepower (SHP)**, normally represented through a **torque meter**. Modern fan engines commonly use **N1** as an indication of thrust, with **EPR** also used on some installations.

N1, P7, EPR, and torque measurements are treated in the engine and aircraft-system monitoring instruments material.

## Thrust Ratings

| Thrust rating | Operational meaning |
|---|---|
| **Take-off thrust** | The engine's maximum take-off output; use is generally restricted by a time limit. |
| **Go-around thrust** | The rating used for go-around operation; it may equal take-off thrust but is normally somewhat lower. |
| **Maximum continuous thrust** | An output permitted for continuous operation. |
| **Maximum climb thrust** | Presented as equivalent to maximum continuous thrust and associated with best-angle-of-climb speeds. |
| **Maximum cruise thrust** | A setting below the maximum continuous rating, selected to extend engine life. |

## Equivalent Shaft Horsepower (ESHP)

**Equivalent shaft horsepower (ESHP)** provides a means of expressing the combined power contribution of the shaft and the residual exhaust-jet thrust of turboprops and certain turboshaft engines.

$$
\mathrm{ESHP}=\mathrm{SHP}+\text{horsepower equivalent of jet thrust}
$$

Under static conditions, approximately **2.5 lbf of thrust corresponds to one shaft horsepower**.

Different engine designs accelerate airflow differently. A low-bypass turbojet imparts a large velocity increase to a smaller air mass, whereas a high-bypass turbofan or turboprop accelerates a much larger air mass through a smaller velocity change. The two arrangements differ in propulsive efficiency.

Because engine thrust and shaft output depend on airflow mass and acceleration, **altitude**, **temperature**, and **airspeed** influence the energy available for production of thrust or SHP.

## Specific Fuel Consumption (SFC)

**Specific fuel consumption** compares the fuel used with the useful output produced. An economical engine has a low ratio of fuel flow to thrust or shaft horsepower.

For a thrust-producing engine, the comparison is commonly expressed as **pounds of fuel per hour per pound of thrust**. For a shaft-power engine, the fuel consumed is compared with **shaft horsepower**. Both thermal efficiency and propulsive efficiency influence SFC.

## Thrust-to-Weight Ratio

The **thrust-to-weight ratio** permits direct comparison between the thrust outputs of engines of different weights:

$$
\text{Thrust-to-weight ratio}=\frac{\text{Engine thrust}}{\text{Engine weight}}
$$

For example, a gas turbine with a static thrust rating of **53,000 lbf** and an engine weight of **10,400 lb** has a ratio of:

$$
\frac{53{,}000}{10{,}400}\approx5.1
$$

This is approximately **5:1**.

## Variation of Thrust with RPM

Higher compressor rotational speed normally means more air passing through a turbojet and therefore greater thrust. The increase is not linear: a disproportionately large share of thrust becomes available as **high-pressure compressor speed exceeds roughly 80%–85%**.

At **ground idle** in a twin-spool engine, typical speeds are:

- **HP rotor:** approximately **50%–60%**.
- **LP rotor:** approximately **25%**.

The corresponding in-flight idle speeds are higher in the conditions described here because of power take-offs from the engines. In a high-bypass turbofan, **25% N1** represents only about **5% of take-off thrust**.

> **Image Generation Prompt — Figure 20.4**
>
> Produce a faithful single-panel technical line graph on a white field, captioned **“Figure 20.4”**. Horizontal axis labelled **“ENGINE SPEED”** with tick labels **50, 60, 70, 80, 90, 100%**; vertical axis labelled **“THRUST lb”** with tick labels **2000, 3000, 4000, 5000, 6000**. Use thin black-grey square grid lines. Plot one smooth **red curve**, beginning a little above 2,300 lb just below 50% speed, rising gradually to about 4,000 lb near 80%, then steeply to 6,000 lb at 100%. In the upper-right outside the plot reproduce a short **horizontal double-headed arrow** between the 90% and 100% region labelled **“10%”**; add a **vertical double-headed arrow** at the right showing the approximate thrust rise from 4,000 to 6,000 lb and label it **“30%”**. Match the original grid, axis-lettering weight, annotations, and curve shape without a separate legend.

## Variation of Thrust with Altitude

Climbing through the atmosphere changes both pressure and temperature. The pressure reduction tends to decrease air density, reduce engine mass flow, and therefore lower thrust. The fuel-control system responds to the reduced airflow by decreasing fuel delivery as necessary to hold the selected engine speed for a fixed throttle position.

The accompanying reduction in temperature partly offsets this effect because colder air is denser, supporting a greater intake mass flow than would exist if pressure fell without a temperature change.

Taken together, the temperature and pressure reductions still produce an overall **loss of thrust**, but the decline is smaller than it would be from the fall in pressure alone.

Above the **tropopause**, atmospheric temperature is treated as remaining near **−56°C** while pressure continues to fall. With no further cooling to offset the falling pressure, thrust declines more rapidly with increasing altitude.

Fuel burn decreases as thrust falls, so **specific fuel consumption remains approximately unchanged** in the altitude trend shown.

> **Image Generation Prompt — Figure 20.5**
>
> Replicate the original tall rectangular **three-chart vertical stack** with caption **“Figure 20.5”** on white. All three panels share an altitude progression from **0 to 35 thousands of feet**, using a horizontal axis at the bottom marked **0, 5, 10, 15, 20, 25, 30, 35** with the caption **“ALTITUDE (THOUSANDS OF FEET)”**. Panel 1: y-axis **“NET THRUST - lb”**, values about **3000–8000**; a thin red curve descends from roughly 7,800 lb at zero altitude to about 3,600 lb at 35,000 ft, with a marked change in gradient after the upper teens. Add a small upper-right red-outlined box with exact words **“SEA LEVEL ISA CONDITION”**. Panel 2: y-axis **“FUEL CONSUMPTION lb / hr”**, approximate ticks **3000–7000**; another thin red descending curve from about 6,800 to 3,000. Panel 3: y-axis **“SPECIFIC FUEL CONSUMPTION lb / hr/thrust”**, tick marks around **0.80, 0.85, 0.90**; a shallow U-shaped red curve starting near 0.86, dipping slightly around middle altitudes, and recovering to roughly 0.86–0.87. Thin black rectangular plotting boxes and grey horizontal/vertical gridlines, black labels, original proportions; no extra legend.

## Variation of Thrust with Temperature

At a fixed compressor speed, reducing inlet-air temperature increases air density. More mass is then available to enter the engine, increasing thrust; additional fuel must be supplied if compressor speed is to remain constant.

Warmer air has the reverse effect. Lower density reduces mass flow and thrust. If the fuel flow were not reduced appropriately, the compressor would tend to accelerate above the intended speed.

In cold conditions, an engine may reach its rated take-off thrust before reaching its limiting exhaust temperature. The compressor pressure-ratio or other power limit becomes the controlling factor. An engine capable of attaining its rated thrust with the throttle below its full-travel position is described as **part-throttle** or **flat-rated**.

> **Image Generation Prompt — Figure 20.6**
>
> Recreate one square-ish performance plot with caption **“Figure 20.6”**, white background, thin grey/black grid. The horizontal axis reads **“OAT”**, with **“DECREASE”** at the left, **“15°C”** below a thin dotted vertical reference line near the middle, and **“INCREASE”** at the right. The vertical axis reads **“NET THRUST”**; at the upper left beside the chart mark **“100%”**. Draw a **red horizontal line** across the left-to-middle upper region with label **“POWER LIMITED”** printed above it. At the 15°C reference point let the red line break into a **red descending line** toward the lower right, marked diagonally **“EGT LIMITED”**. Preserve the exact flat-then-decreasing graphical relationship, dotted transition line, labels, and white margins; avoid extra values or explanatory text.

## Variation of Thrust with Aircraft Speed

With an unchanged exhaust speed, increasing aircraft speed increases inlet speed and reduces the difference between exit and inlet velocity. On this basis, **momentum thrust falls with forward speed**.

However, forward motion also gives the inlet an opportunity to convert part of the approaching airflow's kinetic energy into pressure. This **ram effect** increases intake pressure and therefore supports greater mass flow. To match the additional air, fuel delivery must increase. In the graph presented here, fuel consumption rises while net thrust falls, producing a rise in specific fuel consumption.

> **Image Generation Prompt — Figure 20.7**
>
> Faithfully reconstruct the white-background **three vertically stacked line graphs** of Figure **“Figure 20.7”**. Use a matching common horizontal speed progression shown at the bottom as **“KNOTS”**, with original tick labels **0, 5, 10, 15, 20, 25, 30**. Top graph: y-axis **“NET THRUST - lb”**, labelled around **6500, 8000, 9500, 11000**; thin red line falls steadily from roughly 11,000 at 0 toward about 6,500 at 30. In its upper-right add a thin red-outline box reading **“SEA LEVEL ISA CONDITION”**. Middle graph: y-axis **“FUEL CONSUMPTION lb / hr”**, marked near **6500, 6600, 6700**; thin red line rises gently from about 6,550 to 6,700. Bottom graph: y-axis **“SPECIFIC FUEL CONSUMPTION lb / hr / thrust”** with ticks approximately **0.5, 0.6, 0.7, 0.8, 0.9**; one straight red line increases from 0.6 to 0.9. Maintain the original separate rectangular plots, thin grey grids, black axis titles, and red curves; do not relabel the source's speed axis.

## Ram Recovery

As forward speed increases, the inlet's shape slows some of the incoming airflow and converts its velocity energy into **pressure energy**. This recovery of intake pressure is called **ram recovery**.

The pressure rise immediately ahead of the compressor increases the mass of air that can be processed at a given compressor speed. It can therefore restore **some of the thrust** that would otherwise be lost as the inlet velocity rises. The recovered thrust does not eliminate the underlying reduction attributable to increasing flight speed.

> **Image Generation Prompt — Figure 20.8**
>
> Reproduce the exact single technical graph labelled **“Figure 20.8”** showing ram recovery, on white. Bold horizontal label **“KNOTS”** with ticks **0, 100, 200, 300, 400, 500, 600**; vertical axis labelled **“THRUST - lb”** from **2000** to **9000**, in 1000-lb steps. Use a prominent black square grid and two **red lines** originating near 9000 lb at 0 knots. The first line slopes strongly downwards, slightly curved, toward about 2000 lb at 540 knots, with black diagonal annotation **“THRUST WITHOUT INTAKE RAM PRESSURE”** placed along the descending path. The upper red line descends less steeply and levels somewhat toward roughly 6200 lb near 600 knots, with label **“THRUST WITH INTAKE RAM PRESSURE”** along it. Near 450–530 knots show a black arrow pointing upward from the lower loss region to the upper recovered line, labelled **“(NET THRUST)”**. Place a small red-outlined upper-right box reading **“SEA LEVEL ISA CONDITION”**. Precisely retain curve orientations, original positions, and annotations, without added lines or numerical series.

## Effect of Altitude on SHP

A turboprop loses shaft power with height because the reduction in atmospheric density limits the mass of air passing through its engine. Both **shaft horsepower** and **net jet thrust** fall, so the combined **equivalent shaft horsepower** also declines.

Fuel flow likewise reduces as density decreases. Specific fuel consumption remains broadly similar across the altitude range represented.

> **Image Generation Prompt — Figure 20.9**
>
> Recreate **“Figure 20.9”** as a tall, four-panel column of aligned performance graphs on a plain white background. Shared bottom x-axis label **“ALTITUDE - IN THOUSANDS OF FEET”**, with tick labels from **0 to 35**, at 5-thousand-foot intervals. Panel 1 labelled vertically **“SHAFT HORSEPOWER”**, with y-ticks approximately **2000, 2750, 3500, 4250, 5000, 5750**; thin red line descends from just above 5000 at zero altitude to around 2000 at 35 thousand feet. Include the upper-right red-outlined annotation **“380 KNOTS ISA CONDITION”** as shown. Panel 2 labelled **“NET JET THRUST”**, ticks near **200, 300, 400**; descending red line from around 390 to 200. Panel 3 labelled **“FUEL CONSUMPTION”**, ticks around **1000, 1750, 2500**; descending red line from approximately 2450 to 1000. Panel 4 labelled **“SPECIFIC FUEL CONSUMPTION lb/HP/hr”**, y-axis roughly **0.40–0.46**; shallow red U curve falling from about 0.46 at zero altitude to 0.425 near 20 thousand feet, then rising back near 0.455 by 35 thousand feet. Keep consistent plotting widths, light grey grid lines, original vertical-panel spacing, red line colour, and technical typography.

## Effect of Aircraft Speed on SHP

For a turboprop, higher airspeed increases intake **ram pressure**, which raises the engine's available **shaft horsepower**. Over the same increase in speed, **net jet thrust decreases**.

The greater mass flow requires more fuel, so overall fuel consumption rises. Nevertheless, **specific fuel consumption decreases** as indicated by the relationship between increased useful shaft output and fuel used.

> **Image Generation Prompt — Figure 20.10**
>
> Reconstruct the original **four narrow charts vertically stacked** as **“Figure 20.10”**, white background, matching thin black/grey axes and grid. Shared bottom speed axis labelled **“KNOTS”** and marked **0, 100, 200, 300, 400**. Top graph y-axis **“SHAFT HORSEPOWER”**, tick levels roughly **4800, 5000, 5200, 5400, 5600**; plot a red rising curve from about 4800 at zero knots, increasing through about 5100 at 200 knots with a slight angle change, then curving up to around 5450 at 400 knots. Place a small upper-left red-framed box reading **“SEA LEVEL ISA CONDITION”**. Second graph y-axis **“NET JET THRUST”**, values around **6500–6700**; red line decreases gently from about 6700 to near 6520. Third graph y-axis **“FUEL CONSUMPTION”**, values approximately **6500, 6600, 6700**; red line rises from about 6550 to 6700 by 200 knots and then becomes nearly horizontal to 400. Fourth graph y-axis **“SPECIFIC FUEL CONSUMPTION”**, marked **0.40, 0.45, 0.50**; shallow descending red curve starts just under 0.50, ends around 0.44 at 400 knots. Recreate exact graph order, scales, annotations, red lines, and shared lower x-axis, without adding a legend.

## Questions

**1.** During the initial portion of a gas-turbine aircraft's take-off run, which relationship between thrust and ram pressure is correct?

 a. Ram pressure is greatest when the take-off run begins.

 b. Changing airspeed does not affect ram pressure.

 c. Aircraft forward speed does not change thrust.

 d. Thrust is at its maximum while ram pressure is at its minimum at the beginning of the run.

**2.** A high-bypass engine has a maximum fan speed of **20,000 rpm**. Approximately what percentage of take-off thrust is produced at **5,000 rpm**?

 a. 25%.

 b. 50%.

 c. 5%.

 d. 15%.

**3.** For a jet aircraft climbing at constant engine speed with a fixed throttle setting, select the combination of statements that applies:

 1. Lower temperature and pressure result in reduced thrust.
 2. Fuel consumption increases.
 3. Fuel consumption decreases.
 4. Specific fuel consumption increases.
 5. Specific fuel consumption decreases.
 6. Specific fuel consumption remains nearly constant.
 7. Reduced temperature and pressure increase thrust.

 a. 1, 3, 6.

 b. 2, 4, 1.

 c. 7, 2, 4.

 d. 1, 2, 5.

**4.** Which thrust condition represents the greatest thrust a jet engine can produce?

 a. Take-off thrust.

 b. Go-around thrust.

 c. Maximum climb thrust.

 d. Maximum static thrust.

**5.** Complete the following temperature–thrust relationship: When temperature ______, air density ______ and air mass flow at a fixed engine speed ______; consequently thrust ______. To maintain compressor rpm, ______ fuel is needed, otherwise the compressor will ______.

 a. decreases; decreases; increases; increases; less; slow down.

 b. increases; decreases; decreases; increases; more; slow down.

 c. decreases; increases; increases; increases; more; slow down.

 d. increases; decreases; increases; decreases; less; speed up.

**6.** Starting from rest, what is the overall change in jet thrust as aircraft forward speed increases?

 a. It increases throughout.

 b. It remains constant.

 c. It decreases steadily.

 d. It first falls and then recovers, without regaining the original static value.

**7.** A turboprop with a **14-stage axial-flow compressor** climbs. Which combination of changes is expected?

 a. Shaft horsepower increases; jet thrust increases; fuel consumption increases.

 b. Shaft horsepower decreases; jet thrust decreases; fuel consumption decreases.

 c. Shaft horsepower decreases; jet thrust increases; fuel consumption decreases.

 d. Shaft horsepower decreases; jet thrust decreases; fuel consumption increases.

**8.** As the forward speed of a turboprop fitted with a **14-stage axial-flow compressor** increases, which changes occur?

 a. Shaft horsepower rises; jet thrust rises.

 b. Shaft horsepower falls; jet thrust falls.

 c. Shaft horsepower falls; jet thrust rises.

 d. Shaft horsepower rises; jet thrust falls.

**9.** In a **part-throttle-rated** engine, rated take-off thrust is obtained:

 a. Later than usual because compressor pressure is low.

 b. Later than usual because EPR is low.

 c. Before the thrust lever reaches its full-travel position.

 d. Later than usual because EPR is high.

## Answers

| Question | Answer |
|---|---|
| 1 | d |
| 2 | c |
| 3 | a |
| 4 | d |
| 5 | c |
| 6 | d |
| 7 | b |
| 8 | d |
| 9 | c |
