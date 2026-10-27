# Chapter 2: Basic Hydraulics

Part 1
1. Introduction to Aircraft Hydraulics
---

**Hydraulics** deals with how liquids behave when forces and pressures act on them. In an aircraft, a hydraulic system allows substantial power to be delivered to components that may be far from the cockpit or difficult to move using direct mechanical connections.

The basic method is to transfer power through a liquid, treated as practically **incompressible**, flowing through pipes to a device that converts the fluid's pressure and movement into useful mechanical action. The devices performing this action are commonly called **actuators** or **hydraulic jacks**.

Hydraulic operation is particularly useful when an aircraft system must combine **high operating force**, **precise movement** and **rapid response**. Examples include:

* Landing gear extension and retraction.
* Flap and spoiler operation.
* Powered flight controls.
* Wheel braking.
* Windscreen-wiper operation.
* Other services requiring strong, accurately controlled movement.

The fundamental idea is straightforward: **the fluid carries hydraulic power to the component that needs to move**.

\---

## 2\. Hydrostatic Pressure

An important property of a stationary liquid is that its pressure at a particular depth depends on the **vertical height of liquid above that point**, rather than on the width or shape of the container.

Therefore, when several open containers hold the same liquid to the same vertical level, the pressure measured at their bottoms is the same—even if one container is narrow, another is wide and another has an irregular shape.

### Figure 2.1

> \*\*Image Generation Prompt — Figure 2.1:\*\* Create a clean textbook diagram on a white background showing \*\*four purple-filled open vessels\*\* in one horizontal row. From left to right: (1) a very tall, slim vertical tube; (2) a wide straight-sided rectangular tank; (3) an inverted triangular/funnel-shaped container, broad at the top and narrow below; and (4) a small upright rectangular chamber whose base connects to a narrow curly, spiral descending tube. Beneath each vessel is an identical small round pressure gauge, each connected at the bottom and each showing the same indication. Maintain an equal vertical liquid head in all four examples. Use the original minimal purple, grey and white palette, simple black/grey outlines, and the same left-to-right order. No additional title within the illustration; preserve the caption \*\*“Figure 2.1”\*\* outside it.

**Remember:** In this comparison, the height of liquid is what matters—not how much liquid the container holds.

\---

## 3\. Pascal's Law and the Production of Hydraulic Pressure

### 3.1 Pascal's Principle

The seventeenth-century mathematician **Blaise Pascal** established the principle that a force applied to a confined liquid is transmitted throughout that liquid in every direction. This is the basis on which hydraulic systems pass an applied effect from one point to another.

### Figure 2.2

> \*\*Image Generation Prompt — Figure 2.2:\*\* Draw a simple sectioned \*\*vertical yellow pressure chamber\*\* with rounded corners, a dark outline and a short, grey horizontal piston entering through a small opening on the \*\*left\*\*. A black arrow enters the piston from the left, beside the red word \*\*“FORCE”\*\*. Within the chamber, place the red word \*\*“PRESSURE”\*\* and draw several short black arrows pointing outward against the chamber walls on both sides, at the top and at the bottom, depicting transmission in all directions. The chamber fills most of a thin rectangular image frame, with a white background. Match the spare two-dimensional graphic style and keep the caption \*\*“Figure 2.2”\*\* below the figure.

### 3.2 Flow Is Not the Same as Pressure

A hydraulic pump supplies **fluid flow**. The system develops useful working pressure when that movement meets resistance.

Consider oil passing freely through a pipe with an open outlet. The oil can escape, so this arrangement does not build up the working pressure associated with a blocked or loaded hydraulic circuit. If the outlet is closed and the oil can no longer move out, resistance to the flow causes the pressure to rise.

This leads to a central distinction:

* A **pump** drives liquid through the system.
* A **restriction or resisting load** allows pressure to develop.
* The resulting **pressure acting on an area** produces a force.

### 3.3 The Three Related Quantities

The useful relationships are:

$$
\\boxed{F = P \\times A}
$$

$$
\\boxed{P = \\frac{F}{A}}
$$

Where:

* **F — Force:** the total applied or available load, measured in newtons (N).
* **P — Pressure:** force acting on each unit of area, measured in pascals (Pa), N/m² or another appropriate pressure unit.
* **A — Area:** the surface over which that pressure acts, in m² for SI calculations.

At the same pressure, a larger piston develops a greater force because more area is exposed to the pressure.

\---

## 4\. Bramah's Press: How Hydraulic Force Is Multiplied

**Joseph Bramah (1749–1814)** developed the hydraulic press, showing how a common fluid pressure can connect two pistons of different sizes. His principle demonstrates two linked effects:

1. A given force acting on a **smaller area** produces **greater pressure**.
2. A given pressure acting on a **larger area** produces **greater available force**.

### 4.1 Worked Example: Pressure and Output Force

Suppose piston **A** receives a downward load of **1,000 N** over an area of **0.002 m²**.

Its applied pressure is:

$$
P = \\frac{1{,}000,\\mathrm{N}}{0.002,\\mathrm{m}^{2}} = 500{,}000,\\mathrm{Pa} = 500,\\mathrm{kPa}
$$

If that pressure reaches piston **B**, whose area is **0.004 m²**, the force available there is:

$$
F\_B = P \\times A\_B = (500{,}000,\\mathrm{Pa})(0.004,\\mathrm{m}^{2}) = \\boxed{2{,}000,\\mathrm{N}}
$$

So doubling the piston area, while maintaining the same liquid pressure, doubles the force available at the larger piston.

### Figure 2.3 The Bramah press

> \*\*Image Generation Prompt — Figure 2.3 The Bramah press:\*\* Reconstruct a front-on, schematic \*\*U-shaped, blue-fluid hydraulic press\*\* with two connected vertical cylinders: a \*\*narrow left cylinder containing “Piston A”\*\* and a \*\*wide right cylinder containing “Piston B”\*\*. Put a downward black force arrow above each piston; identify the left as \*\*“Area = 0.002 m²”\*\* and \*\*“Force = 1000 N”\*\*, and the right as \*\*“Area = 0.004 m²”\*\* and \*\*“Force = 2000 N”\*\*. Add the 1000 N and 2000 N load indications over the respective pistons. Between the cylinders, place two opposite orange horizontal arrows pointing outward from the bold word \*\*“BALANCED”\*\*. Along the horizontal bottom fluid passage, add the text \*\*“FLUID PRESSURE = 500 kPa”\*\* and small orange arrows. Use pale/medium blue liquid, black and grey structural outlines, orange arrows and a white background. Preserve the comparative piston widths, every value, and the caption exactly.

### 4.2 Worked Example: Movement and Work

The increased output force does not mean that the machine creates additional work. In an ideal hydraulic press, **work input equals work output**, assuming no frictional losses.

$$
\\text{Work} = \\text{Force} \\times \\text{Distance travelled}
$$

If piston A travels **0.6 m**, it performs:

$$
W\_A = (1{,}000,\\mathrm{N})(0.6,\\mathrm{m}) = 600,\\mathrm{J}
$$

For piston B to do the same amount of work while exerting **2,000 N**, its travel is:

$$
2{,}000,\\mathrm{N} \\times d\_B = 600,\\mathrm{J} \\quad \\Longrightarrow \\quad \\boxed{d\_B = 0.3,\\mathrm{m}}
$$

The two sides therefore satisfy:

$$
(1{,}000,\\mathrm{N})(0.6,\\mathrm{m}) = (2{,}000,\\mathrm{N})(0.3,\\mathrm{m}) = 600,\\mathrm{J}
$$

**Result:** More piston area gives **more force but less travel** for the same transferred amount of liquid and ideal work. The piston movements are inversely related to their areas.

### 4.3 Why This Is a Passive Arrangement

In the example, no pump continually maintains circuit pressure. The operator presses piston A **only when movement of piston B is wanted**. Pressure is generated at the moment of use rather than being held in the system all the time. That makes it an example of a **passive hydraulic system**.

\---

## 5\. Passive Hydraulic Systems

In a passive system, there is **no continuously driven hydraulic pump**. Pressure arises when an external mechanical force acts on the liquid through a piston.

A familiar aircraft example is the wheel-brake circuit on a light aeroplane:

* Pressing the brake pedal moves the **master-cylinder piston**, producing fluid pressure.
* The pressure passes through the brake pipe.
* At the wheel, the **slave-cylinder piston** moves in response and applies the brake.

In this arrangement the master cylinder is the pressure-producing component, while the slave cylinder performs the mechanical task.

### Figure 2.4 A typical light aircraft braking system (only one brake shown)

> \*\*Image Generation Prompt — Figure 2.4 A typical light aircraft braking system (only one brake shown):\*\* Show a simplified side-view mechanical/hydraulic diagram on white. At the \*\*left\*\*, a pivoted black/grey \*\*“Foot pedal”\*\* depresses the small red-filled \*\*“Master cylinder”\*\*, labelled \*\*“Piston A”\*\*; above it, connect a small open \*\*“Fluid reservoir”\*\*. A long \*\*red hydraulic line\*\* runs horizontally from the master cylinder toward the \*\*right\*\* and rises into the wheel-end \*\*“Slave cylinder”\*\*, marked \*\*“Piston B”\*\*, which presses a pad against a vertical grey \*\*“Brake disc”\*\*. Label all these items exactly as written. Show only one brake assembly, not a complete pair of wheels. Preserve the original left-to-right arrangement and caption.

\---

## 6\. Active Hydraulic Systems

Unlike a passive circuit, an **active hydraulic system** has a pump that provides fluid flow. When a connected service is selected, a load or restriction enables the flowing liquid to develop the pressure needed to move an actuator.

The key working parts are cylinders containing pistons that travel in or out. Together these are known as **hydraulic jacks (actuators)**.

Not every aircraft service needs the same force. Landing gear, flaps, spoilers, nose-wheel steering and powered flying-control units differ in size and resistance to movement. Hydraulic systems accommodate these differences by using **actuator pistons with appropriately chosen areas**. This creates a mechanical **gearing effect**: different forces can be generated while the system's nominal fluid pressure remains the same.

\---

## 7\. Hydraulic Fluids, Compressibility and Pipeline Losses

### 7.1 Why Aircraft Use Liquids

The fluid's resistance to compression is one reason hydraulic power transmission is practical. For normal aircraft-system purposes, oil behaves nearly as an **incompressible medium**. Its compressibility becomes more significant at particularly high pressures; the source discusses pressures beginning around **27.6 MN/m²** (approximately **276 bar**).

An illustrative comparison in the textbook uses an applied pressure of **34.6 MN/m² (346 bar)**:

|Medium|Volume reduction described in the source|Volume remaining|
|-|-:|-:|
|Liquid|1%|99%|
|Air|99%|1%|

This example emphasizes the very large difference between the compression of a liquid and that of a gas. It also notes that pressure within either enclosed medium acts throughout the contained medium in every direction.

### 7.2 Where Hydraulic Energy Is Lost

Even with a practically incompressible fluid, not all applied force becomes useful work. Part of it is needed to overcome resistance and friction at moving or flowing interfaces, especially:

* Between the **piston** and its **cylinder**.
* Around **piston rods**, **bearings**, **seals** and **glands**.
* Between the flowing **oil** and the inside surfaces of its **pipes**.

Very wide pipes and nearly friction-free moving parts could reduce these losses, but such construction would be unnecessarily **heavy and expensive** for an aircraft. Designers therefore aim to reduce friction rather than eliminate it completely.

### 7.3 What Determines Resistance in a Hydraulic Pipe?

The amount of fluid-to-pipe friction changes with:

1. **Flow velocity:** how rapidly the oil passes through the line.
2. **Pipe dimensions and condition:** its length, internal bore and interior surface finish.
3. **Pipe bends:** how many changes in direction the flow must negotiate.
4. **Fluid viscosity:** how readily the particular oil flows.

Seals, glands and backing rings remain necessary to prevent leaks even though they introduce resistance. Choosing the **correct hydraulic fluid**, alongside suitable design and workmanship, is therefore an important way of obtaining good operating efficiency.

\---

## 8\. Seals and Hydraulic-Fluid Selection

### 8.1 Why Seals Matter

The job of a hydraulic seal is to keep liquid where it belongs and prevent leakage around joints and moving components. The required seal shape depends on whether the two mating surfaces stay still or slide against each other.

**Static seals** operate between surfaces that do not move relative to one another. Gaskets and packing form a seal as they are compressed between the contacting faces.

**Dynamic seals** work where the components move, such as between a piston and cylinder or around a piston rod. Different shapes are used to suit the operating pressure and the direction from which it acts:

* **U-ring and V-ring seals** are intended to seal effectively in one pressure direction.
* **O-rings and square-section seals** may be chosen where pressure can act from either direction.

### 8.2 Lubrication, Backing Rings and Dirt Protection

Moving seals require lubrication. Consequently, a damp bearing surface or a small amount of seepage can be acceptable as part of normal dynamic-seal operation.

At higher pressures, an **O-ring** is often supported by a relatively rigid **backing ring**. This keeps the sealing ring in shape and stops it being forced into the clearance between the moving components.

Seals are vulnerable to grit. A **wiper ring** on an actuator removes dirt from its exposed piston rod before the dirt can reach and damage the main seals.

Seal materials also have to be **compatible with the hydraulic oil**. Installing the wrong seal material can seriously impair sealing, create leakage and potentially cause component failure.

### 8.3 Two Hydraulic-Fluid Families Described in the Textbook

The fluid must be chosen with the material of the system's **glands, seats, rings and other seals** in mind.

**DTD 585 — mineral/petroleum-based hydraulic oil**

* Identification colour: **red**.
* Compatible seal material specified: **Neoprene synthetic rubber**.
* The source identifies **DTD 585** as an obsolete specification, replaced in British specifications by **DEF STAN 91-48**.
* Other super-clean grades/specifications listed are **H515 (NATO)**, **OM15 (Joint Service)** and **MIL-H-5606F (U.S.)**.

**Skydrol — phosphate-ester-based hydraulic oil**

* **Types 500A and 500B:** purple.
* **Type 700:** green.
* Compatible seal material specified: **Butyl synthetic rubber**.
* The fluid is described as **fire resistant**, with a higher boiling point that reduces its susceptibility to **cavitation**.

### 8.4 Handling and Incorrect Fluid

Hydraulic fluids can irritate **skin and eyes**. They may also harm **paintwork, sealants, rubber materials and Perspex**. Different hydraulic-fluid types must **not be mixed**.

Introducing an unsuitable fluid can damage the system's seals, leading to **internal leakage** within components or **external leakage** from actuators and other connections.

Colour helps identify the type of fluid and makes leaks easier to notice, but **colour alone cannot confirm the approved specification**. Correct identification requires both:

* Checking the **aircraft documentation** for the approved fluid; and
* Using fluid supplied from **sealed, correctly identified containers** or the approved replenishment equipment.

### 8.5 Desired Characteristics of an Aircraft Hydraulic Fluid

A suitable fluid should meet several requirements at once:

|Desired characteristic|Importance or example from the source|
|-|-|
|Very low compressibility|Supports a fast response; the source cites pressures up to approximately **27.6 MN/m² (276 bar)**.|
|Good lubrication|Protects metal and rubber working surfaces.|
|Appropriate viscosity|Supports effective flow across the operating temperature range.|
|High boiling point|Helps avoid vapour locking and cavitation.|
|Low freezing point|The example operating range is **+80°C to −70°C**.|
|Flash point above **100°C**|A desirable high-temperature property.|
|Non-flammability|A preferred fire-safety characteristic.|
|Chemical inertness|Avoids unwanted reactions.|
|Low volatility|Reduces evaporation losses.|
|Resistance to sludge and foam|Keeps the fluid fit for use in the system.|
|Good storage stability|Preserves its properties while stored.|
|Non-corrosiveness|Protects components and pipework.|
|Reasonable cost and availability|Allows practical procurement and servicing.|

The choice is not based on one property alone: fluid performance, seal compatibility, safe handling and the aircraft's approved specification all matter.

\---

## 9\. The Six Components of a Basic Hydraulic System

A simple working hydraulic circuit contains six essential elements, each with a distinct task:

1. **Reservoir:** stores hydraulic oil, supplies the pump and accepts oil returning from the actuators.
2. **Pump:** moves oil into the circuit; its drive may be manual, engine-driven or electrical.
3. **Selector/control valve:** sends fluid toward the selected service and gives returning fluid a route to the reservoir.
4. **Actuator or jack:** converts the hydraulic input into movement of the aircraft component.
5. **Filter:** removes contamination from the oil.
6. **Relief valve:** protects the circuit by releasing an excessive pressure.

### Figure 2.5 Basic hydraulic system

> \*\*Image Generation Prompt — Figure 2.5 Basic hydraulic system:\*\* Recreate the original vertical block-style hydraulic circuit on white. At top right, put a pale-yellow rectangular \*\*“RESERVOIR”\*\*; immediately under it a compact black \*\*“PUMP”\*\* and then a light-blue \*\*“PRESSURE FILTER”\*\*. The grey pipes continue down into a central circular pale-yellow \*\*“SELECTOR VALVE”\*\* and across to a horizontal piston \*\*“ACTUATOR”\*\* at the bottom. A side branch carries a small orange \*\*“RELIEF VALVE”\*\* returning to the reservoir. Preserve the grey supply and return pipe routing and the labels \*\*RESERVOIR\*\*, \*\*PUMP\*\*, \*\*PRESSURE FILTER\*\*, \*\*RELIEF VALVE\*\*, \*\*SELECTOR VALVE\*\* and \*\*ACTUATOR\*\*. The source is a tidy flat technical schematic, not a photorealistic component drawing. Preserve the caption.

\---

## 10\. Classification of Active Hydraulic Systems

Active aircraft hydraulic systems are often grouped by the level of pressure they use:

* **Low-pressure:** working pressure up to about **2,000 psi**.
* **High-pressure:** above **2,000 psi**, with the source giving an average operating pressure of about **3,000 psi**.

Why is higher pressure attractive? Since **force = pressure × piston area**, a system at greater pressure can produce the required force with a **smaller piston and actuator**. Smaller actuators need less fluid and can be connected by smaller pipes.

The combined effect is **lower aircraft system weight** and **less space occupied** by hydraulic equipment.

\---

## 11\. Open-centre Hydraulic System

The **open-centre arrangement** is particularly straightforward, but its principal limitation is that **only one service can be operated at a time** in the configuration described.

### 11.1 When No Service Is Selected

The engine-driven pump keeps oil circulating through the open passage back to the reservoir. Because the flow faces little resistance, the pump does not have to maintain substantial working pressure. It is effectively **off-loaded**, although circulation continues to **lubricate and cool the pump**.

### 11.2 When a Service Is Selected

Moving the selector directs the circulating oil to an actuator so that the selected component can move. Once the actuator reaches its travel limit, resistance increases and system pressure rises. Returning the selector to **neutral** unloads the pump and makes another service available for selection.

If the selector fails to return to neutral when pressure becomes excessive, the **relief valve** provides pressure protection.

Open-centre systems in the source normally operate at pressures of **up to 2,000 psi**. They suit many light aircraft because services such as flaps and landing gear need hydraulic power only for brief periods of a flight; pressure does not need to be retained continuously.

### Figure 2.6 Open-centre system

> \*\*Image Generation Prompt — Figure 2.6 Open-centre system:\*\* Draw the original flat hydraulic schematic with a pale-yellow \*\*“RESERVOIR”\*\* at the top, a black \*\*“ENGINE DRIVEN PUMP”\*\* underneath, and a pale-blue \*\*“PRESSURE FILTER”\*\*. Place an orange \*\*“RELIEF VALVE”\*\* on a left return branch. In the middle, draw \*\*two vertically arranged yellow circular selector-valve symbols\*\*, linked to grey passages. From the lower selector, show orange arrows pointing to the left and right, each labelled \*\*“TO ANOTHER SERVICE”\*\*. Along the bottom, show \*\*two horizontal grey actuators\*\*, labelled \*\*“ACTUATOR”\*\*. Make the neutral fluid path return to the reservoir through the open centres. Copy all labelled pipe connections, the orange flow arrows, component positions and caption \*\*“Figure 2.6 Open-centre system”\*\*. White background, restrained grey/yellow/orange/blue palette.

\---

## 12\. Self-contained Hydraulic Power Packs

Instead of relying on a large centrally supplied installation, an aircraft may use a **self-contained power pack** for a particular hydraulic task.

The source gives these applications:

* A **light aircraft** power pack operating the **landing-gear retraction system**.
* A unit on a **larger aircraft** serving as an **emergency hydraulic source**.
* A power pack used to operate **freight/cargo doors** or similar services.

\---

## 13\. Closed Hydraulic System

A **closed system** retains working pressure in the portion of the hydraulic circuit feeding its selector valves. The pump therefore requires a method of preventing continual loading when no additional fluid is required.

Several arrangements are described:

* **Fixed-volume (constant-delivery) pump:** an **automatic cut-out valve** sends the pump output back to the reservoir once normal system pressure has been reached.
* **Variable-volume (constant-pressure) pump:** the pump reduces the volume it delivers as pressure rises.
* **Some small electrically powered installations:** a **pressure switch** starts or stops the electrical pump according to system pressure.

These mechanisms differ, but all prevent unnecessary pump loading while enabling pressure to be available for the next hydraulic demand.

### Figure 2.7 Closed system

> \*\*Image Generation Prompt — Figure 2.7 Closed system:\*\* Replicate a vertically organized grey-piped closed hydraulic system. A yellow rectangular \*\*“RESERVOIR”\*\* sits at the top, black \*\*“PUMP”\*\* directly below, and blue \*\*“PRESSURE FILTER”\*\* beneath that. In a right-hand pressure-control branch, depict orange \*\*“NON-RETURN VALVE”\*\* and orange \*\*“RELIEF VALVE”\*\* symbols, correctly connecting pressure and return paths. At upper middle-left show a grey \*\*“ACCUMULATOR”\*\* with its round gauge. Place \*\*two yellow circular “SELECTOR VALVE”\*\* symbols in the mid-to-lower area feeding \*\*two bottom horizontal “ACTUATOR”\*\* pistons. Reproduce all original text labels, line connections and relative component positions. Flat schematic style, white background, caption \*\*“Figure 2.7 Closed system”\*\*.

\---

## 14\. Hydraulic Reservoirs

A **reservoir** supplies storage volume for the oil used by a hydraulic system. It provides a positive source of fluid to the pump and accommodates minor fluid losses.

It also includes air space above the oil so the amount of liquid held in the reservoir can change without disrupting system operation. Two reasons for this variation are:

* **Actuator-rod displacement:** the volume of fluid accommodated inside a jack differs when the rod is extended and retracted; the textbook notes that its capacity is smaller when contracted.
* **Thermal expansion:** oil takes up more volume as its temperature rises.

### 14.1 Why Reservoirs Are Pressurized

Most aircraft hydraulic reservoirs described in the source are **pressurized**. The positive pressure at the pump inlet helps supply the pump reliably and reduces the likelihood of air bubbles developing in the oil at altitude.

The apparent reservoir fluid level changes with:

1. The **positions of the actuators**.
2. Whether the **accumulators are charged**.
3. **Fluid temperature**.

The pressurizing air is usually obtained from an **engine compressor** or the **cabin pressurization system**.

### 14.2 Reservoir Equipment and the Hand-pump Reserve

A typical reservoir includes a **pressure-relief valve**, suction connections to the pumps, return connections from the hydraulic services, a **contents transmitter**, a **filler cap** and sometimes a **temperature sensor**.

Where a system also has a **hand pump**, the primary pumps may draw through an elevated **stack pipe**. That arrangement leaves some oil below the normal-pump pickup. If fluid is lost from the part of the installation served by the main pumps, this retained quantity can still supply the hand pump.

### Figure 2.8 Reservoir

> \*\*Image Generation Prompt — Figure 2.8 Reservoir:\*\* Reproduce the original labelled cutaway of a tall cylindrical reservoir, with a grey housing and \*\*bright red hydraulic fluid occupying the lower portion\*\* beneath a white air space. The cylinder has a dark curved top, fittings at the top and bottom, a side-mounted vertical \*\*“Sight Glass”\*\* on the right, a horizontal internal fluid level marked \*\*“Pressurized Level”\*\*, and short interior flow baffles labelled \*\*“Baffles”\*\*. Show the large dark-grey rectangular/internal part on the lower left with the original label \*\*“Fin”\*\*, and a short right-hand probe labelled \*\*“Temp Sensor”\*\*. Keep the plumbing, fittings, arrow callouts and original black/grey/red palette, with white background and caption \*\*“Figure 2.8 Reservoir”\*\*.

\---

## 15\. Hydraulic Filters

Hydraulic fluid must remain clean because foreign particles can harm seals and moving surfaces.

Filters may be installed in several positions:

* **Suction line (before the pump):** primarily protects the pump.
* **Pressure line (after the pump):** keeps the delivered oil clean while services are being operated.
* **Return line:** may also be filtered before oil re-enters the reservoir.
* **Individual component inlets:** often have additional small filters.
* **Case drain of a constant-pressure pump:** a dedicated filter can help reveal the pump's condition.

### 15.1 Recognizing a Blocked Element

As a filter becomes contaminated, the **pressure difference across the filter element** grows. A fitted indicator may respond by releasing a visible **pop-out button** or illuminating a **warning light**.

Cold fluid becomes more viscous and can itself cause a high differential pressure. In the arrangement described, a **bi-metal spring** prevents the indicator button from showing a misleading blockage warning at low temperatures.

### 15.2 Bypass, Replacement and Cleaning

Some filters include a **relief or bypass valve**. If the element becomes obstructed, the valve lets fluid continue to the system **without passing through the filter**. This maintains flow but makes scheduled element replacement particularly important.

* **Paper elements** are ordinarily discarded after removal.
* **Wire-cloth elements** can commonly be cleaned and reused.
* **Ultrasonic cleaning** is the method recommended by the source.
* The text also describes **trichloroethane cleaning as a temporary measure** if a replacement or properly cleaned element is unavailable when a check is due. This is a historical textbook description, not a recommendation to substitute for current approved maintenance procedures.

### Figure 2.9 Filter

> \*\*Image Generation Prompt — Figure 2.9 Filter:\*\* Create a detailed \*\*section through a hydraulic filter housing\*\*: grey outer casing with a removable bottom cup, central black-and-white crosshatched cylindrical \*\*“FILTER ELEMENT”\*\*, upper flow channels and a spring-loaded \*\*“BY-PASS VALVE (SHOWN CLOSED)”\*\*. Place large bold red \*\*“OIL IN”\*\* on the upper left and \*\*“OIL OUT”\*\* on the upper right, with a series of curved red arrows showing oil flowing downward around the element, through it and upward to the outlet. Label \*\*“SEAL”\*\*, \*\*“FILTER ELEMENT”\*\*, \*\*“FILTER HOUSING”\*\* and \*\*“BY-PASS VALVE (SHOWN CLOSED)”\*\* using arrows to point to their exact parts. Keep the grey/black linework, red flow arrows and blue internal passage, with the original caption \*\*“Figure 2.9 Filter”\*\*.

\---

## 16\. Hydraulic Pumps

The function of a pump is to **take oil from the reservoir and supply it to the circuit**. Aircraft systems use a variety of ways to drive a hydraulic pump:

1. **Manual operation** by a hand pump.
2. **Engine drive**.
3. **Electric motor drive**.
4. **Air-turbine motor (ATM)** drive.
5. **Ram-air turbine (RAT or HYDRAT)** drive.
6. **Hydraulic motor driving another hydraulic pump**, called a **Power Transfer Unit (PTU)**.

ATM, RAT and PTU arrangements commonly provide an **alternative source of hydraulic power** as part of an aircraft's system redundancy.

### 16.1 Hand Pumps

A light aeroplane can use a hand pump as its main hydraulic power source. Larger aircraft use hand pumps for tasks that should be possible without running the engines or powering the main installation, including:

* Servicing systems while on the ground.
* Applying pressure to pipes and joints to test for leakage.
* Operating freight doors and other selected components without the usual power supply.

A typical hand pump is a compact **double-acting unit**, supplying oil during both directions of handle travel. Its internal design contains **non-return valves (NRVs)** and a **pressure-relief valve**. The relief pressure can be selected as required; the textbook's typical setting is about **10% above normal system operating pressure**.

### Figure 2.10 Hand pump

> \*\*Image Generation Prompt — Figure 2.10 Hand pump:\*\* Draw a cutaway small aircraft hand-operated hydraulic pump. On the upper right is a long grey \*\*“HANDLE”\*\* operating a vertical linkage and central piston within a black-bordered red-filled cylinder. Inside the pump label the \*\*“PISTON”\*\* and \*\*“TRANSFER VALVE”\*\*. The lower connection carries the text \*\*“INLET”\*\* and points upward through an \*\*“NRV”\*\*; the outlet pipe exits to the left in red and is marked \*\*“OUTLET”\*\*, with another \*\*“NRV”\*\*. A left-side branch down from the outlet contains a small \*\*“RELIEF VALVE”\*\* that rejoins the inlet circuit. Keep the same red pressure-fluid areas, pale-red inlet branch, grey mechanical lever, black outlines and arrow directions. White background, caption \*\*“Figure 2.10 Hand pump”\*\*.

### 16.2 Constant-delivery (Fixed-volume) Pumps

One family of engine-driven or electrically driven pumps delivers fluid at a **substantially fixed rate**, whether or not the system currently needs that quantity. When the actuators have completed their movement, the unused oil must have a route back to the reservoir.

Such a system therefore requires an **automatic cut-out valve or relief valve**, plus an **idling/off-load circuit** when the services are not working.

The source describes a fixed-delivery pump as commonly being a **single- or two-stage gear pump**, capable of a high flow rate at comparatively modest pressures, typically **up to 2,000 psi**.

### Figure 2.11 A spur gear type oil pump

> \*\*Image Generation Prompt — Figure 2.11 A spur gear type oil pump:\*\* Reproduce the original frontal cutaway of a simple gear pump: two equal \*\*grey intermeshing spur gears\*\* arranged left and right inside a black-edged twin-lobed housing. The gears have black circular central shafts and black curved rotation arrows in opposing directions. Hydraulic fluid is represented in \*\*red at the top port\*\* and \*\*yellow at the bottom port\*\*, with red/orange/yellow paths travelling around the outer circumference of each gear and small white flow arrows. Preserve the top and bottom port positions, gear-tooth engagement and colour-coded passages. Caption exactly \*\*“Figure 2.11 A spur gear type oil pump”\*\*.

### 16.3 Constant-pressure (Variable-volume) Pumps

A **variable-volume pump** changes how much fluid it delivers so that pressure can be regulated in response to system demand. This arrangement is common on modern aircraft, where the source gives typical operating pressures of **3,000–4,000 psi**.

The pump described uses a rotating **drive shaft and cylinder block** aligned on the same axis. Several pistons rotate with that block while sliding back and forth inside their bores. Each piston connects through a shoe to a stationary **yoke (swashplate)**.

The **angle of the yoke** determines how far each piston travels during a revolution:

* A **larger angle** creates a longer piston stroke and greater delivery.
* A **smaller angle** reduces piston travel and lowers the output.

### Figure 2.12

> \*\*Image Generation Prompt — Figure 2.12:\*\* Recreate a two-part engineering illustration of an axial-piston variable-volume hydraulic pump on white. \*\*Upper left:\*\* a realistic grey cylindrical pump casing with a portion cut away to reveal internal springs/pistons and a \*\*red/orange perimeter seal\*\*, with a shaft extending to the left and a flange/shaft to the right. \*\*Lower right:\*\* an exploded angled view of the pump's grey cylinder block and drive shaft, six piston rods with red-tipped piston sections, a circular angled swashplate/yoke at the front and a green arrow indicating the direction of movement; add the short red arrow in the central plate opening. Keep the same two-panel arrangement and original unlabelled internal view. Caption \*\*“Figure 2.12”\*\*.

### 16.4 How the Variable-volume Pump Responds to Demand

**High demand or low pressure:** Selecting a hydraulic service causes system pressure to fall. A spring pushes the control piston and positions the yoke at its **maximum angle**. The main pistons then travel their full stroke, delivering the greatest volume of oil.

**Low demand or normal/high pressure:** When the actuator completes its movement, system pressure increases. The pressure-control piston shifts the yoke toward its **minimum-stroke position**. Pump delivery falls substantially.

Even when delivery is reduced, a small internal oil flow remains necessary to:

* Lubricate moving pump components.
* Make up for internal leakage.
* Carry heat away from the mechanism.

The cooling/lubricating oil returns to the reservoir through the **case drain**. A **case-drain filter** and **overheat detector** may be used to assess pump health.

Some pumps also have a **solenoid-operated off-load/depressurizing valve**. When its solenoid is energized, it prevents normal delivery to the system and reduces pump output pressure to approximately **50–200 psi**. Oil can still circulate to cool and lubricate the pump while the rest of the hydraulic circuit retains system pressure.

Transport aircraft frequently use these **constant-pressure or demand-type pumps**. Compared with a fixed-delivery pump—which continues pumping surplus fluid back to the reservoir and wastes energy—the variable-volume design adjusts its delivery as more actuators or hydraulic motors are selected. By increasing flow as required, it helps keep working pressure available across the services in use.

### Figure 2.13 Constant pressure pump at maximum stroke

> \*\*Image Generation Prompt — Figure 2.13 Constant pressure pump at maximum stroke:\*\* Produce a technical longitudinal cross-section of an axial-piston pump at \*\*maximum displacement\*\*. Include a grey \*\*“DRIVE SHAFT”\*\* entering horizontally from the left; a prominently \*\*steeply sloping orange “YOKE OR SWASH PLATE”\*\* connected to grey \*\*“SHOE”\*\* links; blue pistons and a blue \*\*“CYLINDER BLOCK”\*\* toward the right. At the upper right, a yellow \*\*“INLET”\*\* arrow points left; at the lower right, a red \*\*“OUTLET”\*\* arrow points right. Mark upper \*\*“PISTON”\*\*, lower \*\*“CONTROL PISTON”\*\* with its spring, and lower \*\*“CASE DRAIN”\*\*. Keep the original grey casing, black labels and leader lines, orange yoke, blue chamber and yellow/red directional arrows. Caption \*\*“Figure 2.13 Constant pressure pump at maximum stroke”\*\*.

### Figure 2.14 Constant pressure pump at minimum stroke

> \*\*Image Generation Prompt — Figure 2.14 Constant pressure pump at minimum stroke:\*\* Recreate the \*\*same pump section and scale\*\* as Figure 2.13 but show the orange \*\*“YOKE OR SWASH PLATE”\*\* almost vertical, giving \*\*minimum piston movement\*\*, rather than the steep tilt in the maximum-stroke image. Keep all original connections and label positions: \*\*“DRIVE SHAFT”\*\*, \*\*“SHOE”\*\*, \*\*“YOKE OR SWASH PLATE”\*\*, \*\*“PISTON”\*\*, \*\*“CYLINDER BLOCK”\*\*, \*\*“INLET”\*\*, \*\*“OUTLET”\*\*, \*\*“CASE DRAIN”\*\* and \*\*“CONTROL PISTON”\*\*. Match the blue cylinder block, grey housing, yellow inlet arrow and red outlet arrow. Caption \*\*“Figure 2.14 Constant pressure pump at minimum stroke”\*\*.

\---

## 17\. Automatic Cut-out Valves (ACOV)

When a system uses a **fixed-delivery pump**, an **automatic cut-out valve (ACOV)** can both regulate the pressure and provide a **low-pressure circulation path** for the pump between selections.

The arrangement includes an **accumulator** to store pressure when the pump is unloaded. Without that stored pressure, even small internal or external leaks could make the cut-out valve operate repeatedly, causing unnecessary pump loading and unloading.

### 17.1 Cut-in: The Pump Feeds the System

With the ACOV in **cut-in**, pump output passes through a **non-return valve (NRV)** into the system. The pump continues supplying oil while pressure is being built or a service is drawing fluid.

### 17.2 Cut-out: The Pump Is Unloaded

Once normal operating pressure is reached, the pressure acting beneath the control piston moves it upward. This opens a **poppet valve** and directs the pump's output back toward the reservoir at low pressure.

The pump is now **off-loaded**, yet an oil flow remains available for its cooling and lubrication. The NRV, assisted by the accumulator, prevents the system from losing its retained pressure through the unloading path.

### 17.3 Return to Cut-in

Selecting a service reduces system pressure. The control piston moves down, the poppet closes and pressure produced by the pump can again pass through the NRV to the system.

### Figure 2.15 Automatic cut-out valve (ACOV)

> \*\*Image Generation Prompt — Figure 2.15 Automatic cut-out valve (ACOV):\*\* Render a flat cross-section of an automatic hydraulic cut-out valve in the textbook's colour-coded style. A large upper rectangular housing holds a horizontal \*\*yellow chamber\*\* above a dark \*\*“PISTON”\*\* and a grey spring; a small upper \*\*“POPPET VALVE”\*\* connects to a pipe marked \*\*“IDLING FLOW”\*\*, then \*\*“TO RESERVOIR”\*\*. A red pressure line at the lower left is labelled \*\*“FROM PUMP”\*\*, with an orange/grey one-way \*\*“NRV”\*\* leading right to \*\*“TO SYSTEM”\*\*. Show the original red high-pressure passages, light-grey case and yellow piston/control area. Position all labels and arrows around the valve as on a clear textbook engineering schematic, and preserve \*\*“Figure 2.15 Automatic cut-out valve (ACOV)”\*\*.

### 17.4 Why Cut-in/Cut-out Frequency Matters

The time separating the **cut-out** and **cut-in** actions—the valve's **periodicity**—is an indication of system condition.

* **External leakage:** the stored pressure falls more quickly, so the pump loads and unloads more often; reservoir fluid is also lost.
* **Internal leakage:** a failed piston seal, for example, can produce similarly frequent pump cycling **without external fluid loss**; the oil temperature may increase.

A noticeably shortened interval between pump cycles therefore warrants attention to possible leakage, while the presence or absence of fluid loss helps distinguish the cause.

\---

## 18\. Hydraulic Accumulators

An **accumulator** stores hydraulic fluid in a pressurized condition and supplies some of that stored energy when the system needs it. It performs several useful functions:

1. Stores **fluid under pressure**.
2. Smooths out **pressure fluctuations**.
3. Provides space/allowance for **thermal expansion**.
4. Supplies **emergency hydraulic fluid** if the pump fails.
5. Lengthens the interval between ACOV **cut-out and cut-in**, reducing wear on the pump.
6. Provides an **immediate initial supply** when a service is selected while the pump is off-loaded.

### 18.1 Construction and Charging Principle

The source shows two common forms: one separates gas and fluid with a **floating piston**, while another uses a **flexible diaphragm**. There are other accumulator designs as well.

A **non-return valve** upstream of the accumulator stops the pressurized fluid from flowing backward toward the reservoir.

The gas compartment is initially charged to a specified pressure using **air or nitrogen**. As pump pressure rises, oil enters the accumulator and compresses the gas. The two pressures become equal at the normal working-system pressure; the pump can then idle while the accumulator maintains the system's pressure.

When a hydraulic service is selected, fluid from the accumulator can supply it immediately. As the stored pressure falls, the normal pump-cut-in mechanism restores active delivery.

### 18.2 Amount of Pressure and Emergency Availability

The **initial gas pre-charge** must be higher than the minimum pressure needed to operate any service. The stored hydraulic quantity is normally large enough for **one complete operation of a service**.

**Brake accumulators** are a special case: they are arranged to give a **guaranteed number of brake applications**, or enough stored braking capability to stop the aircraft during a **rejected take-off**.

### Figure 2.16 Hydraulic accumulators

> \*\*Image Generation Prompt — Figure 2.16 Hydraulic accumulators:\*\* Show \*\*two accumulator types side by side\*\* on white. \*\*Left:\*\* a tall rounded blue gas/fluid container with a pale-yellow lower region, separated by a straight horizontal \*\*“SEPARATOR OR FLOATING PISTON”\*\*; large \*\*“GAS”\*\* label in the blue upper half and \*\*“LIQUID”\*\* in the yellow lower half. \*\*Right:\*\* a spherical/oval blue accumulator with a curved \*\*yellow “FLEXIBLE DIAPHRAGM”\*\* enclosing the lower \*\*“LIQUID”\*\* zone below upper \*\*“GAS”\*\*. Each vessel has a small circular gauge on the top, connected by a short grey line to a central \*\*“CHARGING POINT”\*\*, and a fluid connection below. Retain the original labels, symmetrical layout, dark-grey outlines and caption \*\*“Figure 2.16 Hydraulic accumulators”\*\*.

### 18.3 Ground Charging and Checking

Gas is introduced through a **charging valve** installed directly on the accumulator or on a **remote ground-service panel** connected by a line. The charging valve is normally a form of **NRV**. A plunger can depress it to release excess gas pressure.

Before checking or setting the gas pre-charge, the hydraulic side must be **depressurized (off-loaded)**. The gas can then drive the floating piston down to the bottom of the cylinder, allowing the pre-charge pressure to be assessed properly.

An incorrect gas pre-charge may cause the ACOV to cycle on and off too frequently. The rapid resulting changes in fluid pressure can create a noticeable **hammering noise and sensation** within the hydraulic system.

\---

## 19\. Hydraulic Jacks (Actuators)

A **hydraulic jack** changes fluid power into useful motion. Most examples produce **linear piston movement**; hydraulic actuator arrangements can also be used to provide rotary movement.

### 19.1 Common Construction

Although jacks are made in different sizes for different loads, the basic design consists of:

* An **outer cylinder**.
* A sliding **piston and seal assembly** inside the cylinder.
* A connected **piston rod or ram**.
* An end **gland seal** through which the rod passes.

The source identifies **three basic actuator types**. Aircraft-specific jack details must be obtained from the appropriate maintenance manual.

### Figure 2.17 Hydraulic actuators

> \*\*Image Generation Prompt — Figure 2.17 Hydraulic actuators:\*\* Reconstruct the three \*\*vertical sectional actuator drawings\*\* in one horizontal row against a white background. Above them write, left to right, \*\*“SINGLE ACTING ACTUATOR”\*\*, \*\*“BALANCED ACTUATOR”\*\*, \*\*“DOUBLE ACTING ACTUATOR”\*\*. \*\*Left:\*\* a long slender cylinder containing a spring above a grey/black piston and \*\*yellow fluid below\*\*, with one external side port and one lower rod. \*\*Centre:\*\* a balanced cylindrical actuator with \*\*red chambers\*\* and a piston/rod assembly extending through both ends, showing red pressure supply/return connections on opposite sides. \*\*Right:\*\* an \*\*orange-filled\*\* double-acting cylinder divided by a piston, with one large rod emerging at the top/right and pressure connections to opposite sides of the piston. Match the original black and grey outlines, yellow/red/orange fills, dimensions and arrangement. Preserve the caption \*\*“Figure 2.17 Hydraulic actuators”\*\*.

### 19.2 Single-acting Jack

A **single-acting actuator** is commonly used as a locking mechanism. A **spring applies the lock**, while **hydraulic pressure releases it**. One example is the **landing-gear downlock**.

### 19.3 Double-acting Unbalanced Jack

Most aircraft hydraulic systems use **double-acting, unbalanced actuators**. Pressure can act to move the piston in either direction, but the piston rod occupies area on one side.

This means:

* The full piston face has a **larger pressure-effective area**.
* The opposite side has a **smaller pressure-effective area**, reduced by the rod cross-section.
* At equal hydraulic pressure, the **larger area creates greater force**.

The actuator should therefore be arranged so that the **more heavily resisted operation** occurs in the direction of **rod extension**, when the larger effective force is available. The source uses **landing-gear retraction** as an example.

### 19.4 Differential Piston Areas

For an unbalanced actuator, the difference between the two effective piston areas equals the **cross-sectional area of the piston rod**:

$$
A\_{\\text{large side}} - A\_{\\text{rod side}} = A\_{\\text{rod}}
$$

Since the applied force is the product of **pressure × effective area**, the side offering the larger area produces the higher force at the same pressure.

### 19.5 Double-acting Balanced Jack

A **balanced actuator** is arranged so that the effective areas on opposite sides of its piston are equal. Consequently, the **same hydraulic pressure can produce an equal magnitude of force in either direction**.

These actuators are useful where comparable control effort is wanted in both directions, notably in **nose-wheel steering** and **powered flight-control boost systems**. Depending on the design, a mechanism may be connected to **one or both ends of the piston rod**.

**End of Part 1. Part 2 begins with Hydraulic Lock.**

\---

# Diagnostic Self-test Questions

*These are newly written study questions derived from the topics in Part 1, rather than copied textbook paragraphs.*

**1. What makes hydraulic power transmission useful on an aircraft?**  
**Answer:** It can transmit large, accurately controlled forces through fluid lines to remote components, often with rapid response.

**2. Two differently shaped open vessels contain the same liquid to the same height. How do their bottom pressures compare?**  
**Answer:** They are the same for the same vertical liquid head.

**3. What does Pascal's principle tell us about a force applied to enclosed liquid?**  
**Answer:** The pressure effect is transmitted throughout the confined liquid in all directions.

**4. Does a pump alone guarantee the development of working pressure?**  
**Answer:** No. The flow must encounter resistance or a load before substantial working pressure builds.

**5. A 1,000 N force acts on 0.002 m². Find the pressure.**  
**Answer:** 1,000 ÷ 0.002 = **500,000 Pa = 500 kPa**.

**6. The pressure is 500 kPa and the receiving piston area is 0.004 m². What force results?**  
**Answer:** 500,000 × 0.004 = **2,000 N**.

**7. If an ideal hydraulic press produces 2,000 N at the output from a 1,000 N input travelling 0.6 m, how far does the output move?**  
**Answer:** **0.3 m**, because 1,000 × 0.6 = 2,000 × 0.3.

**8. What distinguishes a passive hydraulic brake system from an active one?**  
**Answer:** A passive brake generates pressure through direct force on its master-cylinder piston; an active system has a pump providing flow.

**9. Name the four main factors influencing resistance between oil and a pipeline.**  
**Answer:** Flow speed; pipe length, bore and internal finish; number of bends; and fluid viscosity.

**10. Which seal types in the chapter act primarily in one pressure direction?**  
**Answer:** **U-ring and V-ring seals**.

**11. Why is a backing ring used alongside an O-ring at high pressure?**  
**Answer:** To help retain the seal's shape and prevent extrusion between moving surfaces.

**12. What seal materials are associated with the two oil families discussed?**  
**Answer:** **Neoprene** with the mineral-based DTD 585 type; **Butyl** with phosphate-ester Skydrol.

**13. Why must fluid colour not be the only identification method?**  
**Answer:** Colour may help identification and leak detection, but the approved specification must be confirmed from aircraft documents and correctly identified sealed supplies.

**14. List the six main elements of a basic hydraulic system.**  
**Answer:** Reservoir, pump, selector/control valve, actuator/jack, filter and pressure-relief valve.

**15. What is the principal operating limitation of the open-centre system described?**  
**Answer:** It permits **one service at a time**.

**16. Give two ways a closed hydraulic system prevents continuous pump loading.**  
**Answer:** An ACOV unloads a fixed-delivery pump; or a variable-volume pump reduces its delivery as pressure rises.

**17. Why are aircraft hydraulic reservoirs often pressurized?**  
**Answer:** To keep positive pressure at the pump inlet and reduce air-bubble formation at altitude.

**18. Why might a reservoir use a stack pipe for the main pumps?**  
**Answer:** To preserve a lower reserve of fluid for a hand pump if the main-pump supply is depleted.

**19. What does a rising pressure differential across a hydraulic filter indicate?**  
**Answer:** Usually increased restriction as the element becomes blocked; cold high-viscosity oil can cause a misleading indication.

**20. Why does a typical hand pump have non-return valves?**  
**Answer:** To direct fluid flow appropriately through the pump during its strokes rather than allowing uncontrolled reverse flow.

**21. Which pump changes output volume in response to system demand?**  
**Answer:** The **constant-pressure (variable-volume)** pump.

**22. What happens to the swashplate/yoke in a variable-volume pump when demand increases and system pressure drops?**  
**Answer:** Spring force moves it toward the **maximum angle**, making piston strokes and output flow greater.

**23. What maintains system pressure when a fixed-delivery pump has been unloaded by an ACOV?**  
**Answer:** A **non-return valve and accumulator**, retaining the system's pressurized fluid.

**24. How can internal and external leakage both affect ACOV cycling?**  
**Answer:** Both shorten the interval between cut-out and cut-in. External leakage also loses fluid; internal leakage may instead raise fluid temperature.

**25. State three uses of a hydraulic accumulator besides simply storing oil.**  
**Answer:** Damp pressure pulses, permit thermal expansion and provide emergency/initial fluid when pumps are not supplying it (among other uses).

**26. Why must system hydraulic pressure be released before checking the gas pre-charge in an accumulator?**  
**Answer:** To let the gas move the floating piston to the bottom so the gas charge can be correctly checked.

**27. Why does the same pressure give different forces on the two sides of an unbalanced actuator?**  
**Answer:** The piston rod reduces the effective area on one side, and **F = P × A**.

**28. Give two applications of balanced actuators.**  
**Answer:** **Nose-wheel steering** and **powered flying-control boost systems**.

\---


Chapter 2: Basic Hydraulics
---

## Part 2

# 1\. Hydraulic Lock

A **hydraulic lock** exists when an actuator's liquid is confined in a space from which it cannot escape. For example, if a non-return valve traps oil between itself and one face of a jack's piston, the piston cannot shift position.

The reason is that hydraulic liquid is treated as **incompressible**: moving the piston would require the trapped oil to occupy less space or move somewhere else. With neither possibility available, the jack stays where it is, even if an external force attempts to drive it. A hydraulic lock therefore holds an actuator in position by preventing fluid movement.

**Recognition point:** *No permitted oil flow → no actuator travel.* This is different from an actuator that can move because its fluid has an open return path.

# 2\. Hydraulic Motors

A **hydraulic motor** turns fluid power into **continuous rotary motion**, rather than the linear movement delivered by a conventional piston-and-cylinder jack. Its internal arrangement is generally comparable to a multi-piston, variable-displacement hydraulic pump.

Aircraft applications include:

* Driving a **screw jack** through reduction or transfer gearing.
* Providing mechanical rotation to equipment such as a **generator** or **pump**.
* Operating the pump portion of a **hydraulic motor–pump power-transfer unit**, so that one hydraulic system can power another system **without exchanging their hydraulic fluid**.

The oil flow supplied to a hydraulic motor sets its rotational speed: **higher flow rate produces higher speed**, for an otherwise comparable operating condition.

# 3\. Controlling Hydraulic Pressure

The main pump on an aircraft may be adjusted or regulated to establish the maximum hydraulic-system pressure. Other dedicated valves keep pressure suitable for particular services and provide protection when pressure rises too far.

Typical figures quoted in the textbook are **1,500 psi for a smaller aircraft** and **3,000 psi for a larger aircraft**. These are examples of system pressures, not a single required pressure for every aircraft.

## 3.1 Relief-valve functions

A **relief valve** provides a route for excess-pressure fluid to discharge back toward the reservoir. The chapter distinguishes three protective uses:

|Valve|Pressure problem addressed|Intended protective result|
|-|-|-|
|**Thermal relief valve**|Pressure increase in fluid trapped within an isolated pipe|Releases pressure caused by thermal expansion|
|**Full-flow / high-pressure relief valve**|Excessive pressure due to failed regulating equipment or a blockage|Can divert the pump's full output to the reservoir|
|**Flap relief valve**|Excessive aerodynamic load applied to extended flaps|Allows the flaps to move back toward **UP**, protecting their structure and mountings|

### Thermal relief

A line closed off by a **non-return valve (NRV)** or **selector** can contain liquid that expands as it warms. Since the trapped fluid has almost no room to expand, pressure increases. The thermal valve is calibrated to open slightly above the normal operating pressure—**typically around 10% higher** in the textbook's example—and relieve the excess.

### Full-flow protection

Some circuits fit a separate full-flow valve **after the pump**. Should an automatic cut-out valve fail or another part of the system become blocked, the relief path is capable of returning **all pump delivery** to the tank instead of allowing the pressure to rise unchecked.

### Mechanical overload / flap protection

If flaps are selected down at an excessively high airspeed, their aerodynamic loads may exceed the safe value. The flap relief arrangement allows **blowback toward the up position**, reducing the risk of damage to the flaps or their attachments.

## 3.2 Pressure-maintaining (priority) valves

The role of a **pressure-maintaining valve**, also called a **priority valve**, is to protect the pressure available to a **primary or essential service**. Demand from a secondary service must not drag the primary circuit below the pressure it needs to function.

This prioritization is particularly important where the hydraulic supply serves both flight-essential and less-critical loads.

### Figure 2.18 Pressure maintaining valves

> \\\*\\\*Image Generation Prompt — Figure 2.18 Pressure maintaining valves:\\\*\\\* Reproduce a single vertical cutaway of a spring-loaded hydraulic priority valve, centred in a white rectangular picture area. Use a medium-grey valve housing and moving piston/spool, a black cap at the top, and a white-grey compressed coil spring in the upper cavity. Illustrate the internal oil galleries in saturated red. Show a horizontal red branch entering from the \\\*\\\*left\\\*\\\*, labeled \\\*\\\*“PRESSURE INLET”\\\*\\\* with an arrow directed into the assembly. On the \\\*\\\*right\\\*\\\*, draw two red outlet passages: the \\\*\\\*upper\\\*\\\* labeled \\\*\\\*“SECONDARY SERVICES”\\\*\\\* and the \\\*\\\*lower\\\*\\\* labeled \\\*\\\*“PRIMARY SERVICES”\\\*\\\*, each with black direction arrow. Retain the spring, seals, stem and irregular cutaway port geometry and precisely the source's caption beneath the picture. Neutral textbook technical style; do not add any flow branches or other text.

## 3.3 Pressure-reducing valves

An aircraft's normal high-pressure system is not necessarily appropriate for every device connected to it. A **pressure-reducing valve** takes fluid from the principal system and supplies a controlled **lower pressure** to a sub-system, such as the wheel brakes.

### Figure 2.19 Pressure reducing valve

> \\\*\\\*Image Generation Prompt — Figure 2.19 Pressure reducing valve:\\\*\\\* Make a narrow, upright cross-sectional view of a grey pressure-reducing valve in a white image box. It has a dark top retaining cap, a large vertical spring, a long narrow plunger shaft beneath the spring and red internal fluid passages in the lower third. On the \\\*\\\*right\\\*\\\*, place three horizontal red connections with black arrows and exact uppercase labels in this vertical order: \\\*\\\*“RETURN”\\\*\\\* at the highest port, \\\*\\\*“INLET”\\\*\\\* at the middle port, and \\\*\\\*“LOW PRESSURE SUB-SYSTEM”\\\*\\\* at the lowest port. The inlet arrow points toward the valve; the other branches point away. Preserve internal seal dots and the caption \\\*\\\*“Figure 2.19 Pressure reducing valve”\\\*\\\*.

## 3.4 Brake-control valves

A **brake-control valve** functions like a **pressure reducer whose output setting can vary**. The braking pressure delivered is determined by the pilot's brake-pedal demand and, where installed, commands from the **anti-skid** and **autobrake** systems. Thus, brake pressure need not equal the pressure in the aircraft's main hydraulic circuit.

\---

# 4\. Hydraulic Flow Control

Pressure control determines how strongly a hydraulic device can act; **flow control** governs the route and quantity of liquid reaching the device. These components can make movement one-way, slow movement in one direction, reverse an actuator, select an alternate supply or preserve fluid after a leak.

## 4.1 Non-return valves (NRVs)

A **non-return valve** admits liquid in its designed forward direction but closes against reverse flow. It acts much like an electronic diode, which allows current mainly in one direction.

The simple valve shown in the book contains a ball-type closing element. When supply conditions support the permitted direction, fluid flows through it. A reverse pressure difference forces the element against its seat and prevents backflow.

Other names used for the same device are **one-way check valve** and **non-reversible valve**. For a separately installed unit, an **arrow on its housing** shows the intended flow direction and helps prevent backwards installation.

### Figure 2.20 A simple non-return valve

> \\\*\\\*Image Generation Prompt — Figure 2.20 A simple non-return valve:\\\*\\\* Horizontal mechanical cutaway occupying the centre of a plain white box. Draw the main valve body in pale grey/hatched metal with a yellow-tinted sleeve, saturated red fluid areas, a black spherical ball near the right-hand seat and a grey compression spring shown lengthwise. Mark \\\*\\\*“OUTLET PORT”\\\*\\\* at the left end and \\\*\\\*“INLET PORT”\\\*\\\* at the right, with thin arrow leaders. Preserve the source's passage shape, ball-to-seat contact and spring orientation. Caption exactly \\\*\\\*“Figure 2.20 A simple non-return valve”\\\*\\\* below.

## 4.2 One-way restrictor valves (chokes)

A **one-way restrictor** behaves differently depending on which way the oil is moving:

* In its **free-flow direction**, it permits essentially unrestricted flow.
* In its **restricted direction**, the oil has to pass through a smaller, usually **fixed-size** opening.

This enables an actuator to move at a normal speed one way but **more slowly in the opposite direction**. The textbook's examples include slowing **flap retraction** and **landing-gear extension**, with restrictors installed in the **up line** in both examples.

### Figure 2.21 Restrictor valve

> \\\*\\\*Image Generation Prompt — Figure 2.21 Restrictor valve:\\\*\\\* Draw two long horizontal cutaway illustrations of the \\\*\\\*same one-way restrictor\\\*\\\*, vertically stacked inside a thin rectangular outline. Use metallic grey housing, strong red fluid channels, black flow arrows and a thin spring/piston-like internal assembly. At the \\\*\\\*left\\\*\\\* of each cutaway include a separate grey circular, perforated end-on view with small red holes. The upper unit contains the exact text \\\*\\\*“FULL FLOW”\\\*\\\* and large black directional arrows; the lower unit contains \\\*\\\*“RESTRICTED FLOW”\\\*\\\* and smaller-direction arrows through the bypass opening. Keep the two aligned cylinders, perforation differences and original caption \\\*\\\*“Figure 2.21 Restrictor valve”\\\*\\\*.

## 4.3 Selector valves

A **selector** makes the required hydraulic connections when a pilot or another system commands an actuator to move. For a double-acting jack, the selector sends pressure to **one chamber**, while simultaneously giving the **other chamber** access to the return line. To reverse the movement, the selector swaps these routes.

Selectors may have an **open-centre** or **closed-centre** arrangement, and their moving parts may operate by **rotation** or by **straight-line sliding**. They may be worked locally by hand or actuated remotely through mechanical or electrical controls; remote operation is common on large transport aircraft.

### Rotary selectors

A rotary mechanism changes the internal connections by turning its plug. The book distinguishes a **simple two-port selector** for a **single-acting jack** from a **four-port arrangement** for a **double-acting jack**. The four-port design permits alternate pressurization of each side of the piston while the non-pressurized side returns fluid.

### Figure 2.22 Typical four port selector

> \\\*\\\*Image Generation Prompt — Figure 2.22 Typical four port selector:\\\*\\\* Reproduce a compact hydraulic schematic with a horizontal actuator cylinder at \\\*\\\*left\\\*\\\*, a valve at \\\*\\\*right\\\*\\\* and two colour-coded connected passages. The pressurized liquid passages are bright \\\*\\\*red\\\*\\\* and the return passages \\\*\\\*green\\\*\\\*. Label the upper supply connection \\\*\\\*“Pressure”\\\*\\\*, the lower connection \\\*\\\*“Return”\\\*\\\*, and the control plug \\\*\\\*“Selector Valve”\\\*\\\*. Show a rounded internal rotary plug with a black curved rotation arrow beside it, and show red pressure on one side of the actuator and green return on the opposite side. Grey metal components, black outlines, white background, original figure caption below.

### Linear/spool selectors

A **spool selector** changes the port connections by sliding a spool sideways. A **rod or cable** can provide the mechanical displacement, or an electrical actuator can operate it instead. Unlike a rotary plug, it moves **linearly**.

### Figure 2.23 Linear slide selector or spool valve selector

> \\\*\\\*Image Generation Prompt — Figure 2.23 Linear slide selector or spool valve selector:\\\*\\\* Cross-section of a \\\*\\\*wide rectangular three-position-looking spool valve\\\*\\\*, showing a central horizontally sliding red/grey spool and long grey pilot linkage extending from the \\\*\\\*right\\\*\\\*, labeled \\\*\\\*“Pilot Input”\\\*\\\*. Above the body, label \\\*\\\*“Pressure”\\\*\\\* with a downward red feed arrow and \\\*\\\*“Return”\\\*\\\* with green return branches. Colour lower return galleries green, central feed gallery red and housing grey; use arrows indicating the actual oil route. Below the valve retain the exact original label \\\*\\\*“Hydraulic lock”\\\*\\\*. A thin rectangular illustration border and caption \\\*\\\*“Figure 2.23 Linear slide selector or spool valve selector”\\\*\\\* complete the layout.

### Electrically operated selectors

A selector does not have to be positioned close to the cockpit. If it is installed far away, electrical actuation eliminates long rods and cables. The textbook identifies **electric-motor drive** and **solenoid operation** as two methods.

## 4.4 Shuttle valves: normal versus alternative supply

An **alternative hydraulic source** may need to operate the very same brakes or landing-gear actuator normally powered by the main system. A **shuttle valve** provides that choice automatically according to the pressure difference between the supplies.

* Under normal operation, the **normal feed** reaches the service while the alternate feed is blocked.
* If normal pressure disappears and the **alternate supply** is selected, alternate pressure pushes the shuttle to its other position. That movement **closes the normal inlet** and opens the alternate route to the service.

### Figure 2.24 Shuttle valve

> \\\*\\\*Image Generation Prompt — Figure 2.24 Shuttle valve:\\\*\\\* Horizontal cutaway of a shuttle valve in a grey hatched rectangular block. Inside the housing is a short \\\*\\\*dark grey piston/shuttle\\\*\\\* toward the left; a large \\\*\\\*red\\\*\\\* gallery on the right communicates with an upward red branch. Colour the left inlet \\\*\\\*yellow\\\*\\\* and label it \\\*\\\*“ALTERNATE SUPPLY”\\\*\\\* with an arrow toward the valve; label the right red inlet \\\*\\\*“NORMAL SUPPLY”\\\*\\\* with an arrow toward the valve. Label the central piston \\\*\\\*“SHUTTLE”\\\*\\\* with a downward leader; label the vertical upper outlet \\\*\\\*“SERVICE”\\\*\\\* and show an upward black arrow. Preserve horizontal left/right orientation and caption \\\*\\\*“Figure 2.24 Shuttle valve”\\\*\\\*.

## 4.5 Sequence valves

A **sequence valve** ensures that two related hydraulic actions occur in the required order. The example in this chapter is the **landing-gear circuit**, in which gear-door movement and landing-gear jack movement have to take place in the correct sequence.

### Figure 2.25 A sequence valve

> \\\*\\\*Image Generation Prompt — Figure 2.25 A sequence valve:\\\*\\\* Produce one instructional image split into \\\*\\\*two side-by-side cutaway mechanisms\\\*\\\*, white background with a thin enclosing rectangle. \\\*\\\*LEFT:\\\*\\\* grey mechanical piston/plunger arrangement with red internal fluid paths, blue side springs and the exact labels \\\*\\\*“LANDING GEAR DOOR JACK”\\\*\\\*, \\\*\\\*“PRESSURE”\\\*\\\*, \\\*\\\*“PLUNGER”\\\*\\\*, \\\*\\\*“PISTON”\\\*\\\*, \\\*\\\*“LANDING GEAR RETRACTION JACK”\\\*\\\*, and \\\*\\\*“MECHANICAL (PLUNGER IN)”\\\*\\\*. \\\*\\\*RIGHT:\\\*\\\* tall rectangular orange hydraulic valve with springs, red inflow/outflow and the labels \\\*\\\*“SECONDARY PRESSURE FLUID”\\\*\\\*, \\\*\\\*“VALVE”\\\*\\\*, \\\*\\\*“SELECTOR”\\\*\\\*, \\\*\\\*“PLUNGER”\\\*\\\*, \\\*\\\*“‘DOWN’ LINE PRESSURE”\\\*\\\*, and \\\*\\\*“HYDRAULIC (‘DOWN’ SELECTED)”\\\*\\\*. Keep the two different actuation methods distinct and retain caption \\\*\\\*“Figure 2.25 A sequence valve”\\\*\\\*.

## 4.6 Modulators

A brake-system **modulator** works with the **anti-skid controller**. During the first brake application, it lets oil reach the brake units at **full flow**. Afterward it allows a **restricted flow**, supporting the operation of the anti-skid braking arrangement.

## 4.7 Constant-flow control valves

Some hydraulic consumers, particularly a **hydraulic motor needing a steady rotational speed**, require a nearly constant oil-flow rate. A **flow-control valve** can be placed before such a device to regulate the supply and maintain its flow.

## 4.8 Hydraulic fuses

Modern jet aircraft use hydraulic power for multiple important functions—**landing-gear movement, powered flying-control assistance, thrust reversers, flaps, brakes and auxiliary services**. Aircraft therefore commonly have **more than one independent system**. An important defensive measure is the **hydraulic fuse**, which isolates a failed line to limit fluid loss from a serious leak.

Two basic operating principles appear in the chapter:

1. **Differential-pressure fuse:** closes when the pressure drop across it becomes sufficiently large.
2. **Quantity/volume-operated fuse:** closes after a specified amount of fluid has passed. During normal operation, the piston cannot travel far enough to close the line; a leak passes enough extra oil to carry the piston across and seal it.

The book points out that **wheel-brake lines** are routinely protected by hydraulic fuses. Their purpose is fluid-loss isolation—not regulating brake pressure or stopping the wheels from skidding.

\---

# 5\. Hydraulic-System Indications

Flight crew must be able to detect whether the hydraulic system is functioning correctly. The presentation depends on aircraft complexity:

* **Light aircraft:** warning lamps may indicate an **electric hydraulic-pump motor** running, alongside landing-gear and flap position indications.
* **Larger aircraft:** cockpit displays usually provide system **quantity, pressure and temperature** and may present information or controls for abnormal conditions.

## 5.1 Hydraulic control panel

### Figure 2.26 A hydraulic system control panel

> \\\*\\\*Image Generation Prompt — Figure 2.26 A hydraulic system control panel:\\\*\\\* A \\\*\\\*tall rectangular cockpit hydraulic panel\\\*\\\* drawn face-on within a thin border. Muted grey panel background, teal turquoise U-shaped edge marking, numerous circular gauges and small rectangular switch/warning windows, with \\\*\\\*white, grey and black controls and red annotation arrows\\\*\\\*. The title \\\*\\\*“HYDRAULIC SYSTEM”\\\*\\\* appears across its upper central section. To the \\\*\\\*right\\\*\\\* of the panel, add the exact callout topics in order, with red arrows pointing into the panel: \\\*\\\*“Reservoir contents”\\\*\\\*, \\\*\\\*“System Low Quantity / high temp warning”\\\*\\\*, \\\*\\\*“Firewall shut-off valve”\\\*\\\*, \\\*\\\*“Engine Driven Pump shut off”\\\*\\\*, \\\*\\\*“Air Turbine Pump”\\\*\\\*, \\\*\\\*“Engine Pump case drain warning”\\\*\\\*, \\\*\\\*“Alternate pumps Electric / Ram Air Turbine / Power Transfer Unit”\\\*\\\*, \\\*\\\*“Brake Accumulator low pressure”\\\*\\\*, and \\\*\\\*“System pressure”\\\*\\\*. Keep the physical gauge positions and callout alignment, and use the original caption.

## 5.2 ECAM hydraulic page

A representative **Airbus ECAM** hydraulic page displays **three independent hydraulic systems**, including their relevant valve positions, pump states, fluid quantity and pressure. In the textbook example, the **green-system accumulator** has a **low air-pressure warning**.

### Figure 2.27 An ECAM hydraulic system page

> \\\*\\\*Image Generation Prompt — Figure 2.27 An ECAM hydraulic system page:\\\*\\\* Recreate a realistic rectangular \\\*\\\*black Airbus electronic aircraft systems display\\\*\\\* with a charcoal bezel, thin luminous \\\*\\\*green\\\*\\\* schematic lines and white small text. Top-centre heading \\\*\\\*“HYD”\\\*\\\*. Across the upper area show three labelled system columns \\\*\\\*“GREEN”\\\*\\\*, \\\*\\\*“BLUE”\\\*\\\*, \\\*\\\*“YELLOW”\\\*\\\*, each with approximately \\\*\\\*“3000”\\\*\\\* pressure values where shown; retain \\\*\\\*“PTU”\\\*\\\*, \\\*\\\*“RAT”\\\*\\\*, \\\*\\\*“ELEC”\\\*\\\*, \\\*\\\*“1”\\\*\\\*, \\\*\\\*“2”\\\*\\\* and the green-system \\\*\\\*red “LO AIR PRESS”\\\*\\\* caption near the accumulator symbol. Bottom status strip shows \\\*\\\*“TAT -35°C”\\\*\\\*, \\\*\\\*“SAT -52°C”\\\*\\\*, and \\\*\\\*“13 H 28”\\\*\\\*, plus \\\*\\\*“GW”\\\*\\\* indication on the right. Carefully reproduce locations, schematic lines, circular symbols and indications from the source. Caption \\\*\\\*“Figure 2.27 An ECAM hydraulic system page”\\\*\\\*.

## 5.3 Quantity indication

The hydraulic reservoir often has a **transparent sight window** that lets technicians check its level directly during servicing. A **float-based transmitter** may also turn changes in reservoir level into an electrical quantity signal displayed to the crew.

## 5.4 Pressure relays and gauges

A **pressure relay** transfers pressure information either to a direct-reading gauge or to a **pressure transmitter** that sends an electrical indication to a flight-deck display.

* **Electrically driven pressure gauges** normally provide flight-deck indication of main and emergency pressures.
* **Direct-reading gauges** often appear on **reservoirs and accumulators**, especially to support servicing work.

### Figure 2.28 Pressure relays

> \\\*\\\*Image Generation Prompt — Figure 2.28 Pressure relays:\\\*\\\* At the lower right of a white textbook page area, draw one vertical cutaway of a \\\*\\\*grey cylindrical pressure-transmitting unit\\\*\\\*. The lower pressure chamber is bright \\\*\\\*red\\\*\\\*, separated from an upper pink chamber by an internal shaped plunger/sealing interface. Add a narrow pipe/shaft across the upper right leading to a separate round gauge, outlined \\\*\\\*cyan\\\*\\\*, with a white face and a \\\*\\\*short red pointer\\\*\\\*. Preserve the source's silver-grey body, small top cap, red lower fluid path and detached dial. Caption \\\*\\\*“Figure 2.28 Pressure relays”\\\*\\\*.

## 5.5 Pressure switches, flow and temperature warnings

* **Pressure switches** can operate a warning lamp when **hydraulic pressure is lost**, or when a **reservoir loses its air pressure**.
* A **flow-indicator valve** fitted in the outlet of a **constant-delivery pump** can give warning if that pump fails.
* A **reservoir temperature-sensing element** can warn of hot hydraulic liquid.
* Where an electrically driven emergency pump is installed, a comparable sensor in its **motor housing** may warn of motor overheating.

\---

# 6\. Items Fitted for Hydraulic Servicing

The chapter groups several servicing-related components together. They are commonly located in the **hydraulic equipment bay** so technicians can connect equipment, relieve pressure, drain oil, isolate power and investigate fluid condition.

|Component|Purpose / operating feature|
|-|-|
|**Quick-disconnect coupling**|A self-sealing coupling used where pipes are frequently separated; it avoids oil loss and generally avoids the need to bleed the system after that separation.|
|**Ground servicing coupling**|Allows suitable ground equipment to pressurize or test a hydraulic circuit without running the aircraft's engines.|
|**Pressure-release valve / off-load control**|Manually removes hydraulic pressure before servicing checks, including accumulator **pre-charge** and reservoir-level checks.|
|**Drain cock / valve**|A simple hand-operated, often spherical valve situated at a **low point** in the hydraulic bay so the oil can be drained.|
|**Shut-off valve**|At the engine **firewall**, isolates the supply feeding an engine-driven pump during an engine fire or maintenance/component replacement. Commonly a spherical ball valve that offers little flow restriction when open.|
|**Bleed point**|Permits trapped air to be expelled; air in the circuit may produce **banging noises** and irregular actuator action.|
|**Sampling point**|A fitting in an appropriate **suction or pressure line** for collecting hydraulic fluid for inspection/analysis.|

**Fluid appearance:** Oil that has been overheated may become **darker**. A **milky** appearance is an indication of water contamination.

\---

# 7\. Hydraulic Power for Flying Controls

A dedicated hydraulic **flying-control sub-system** may be supplied through a **priority/pressure-maintaining valve** so that pressure remains available to the flight controls even when other consumers are active. That sub-system may also include its own accumulator.

To improve availability following a failure, modern aircraft often have **alternative hydraulic sources for the flying controls**. Depending on design, **two, three or even four independent hydraulic systems** may supply the primary powered controls at the same time.

The book combines these ideas in two overall system diagrams: one traces the hydraulic generation and storage equipment; the other shows how the hydraulic supply is distributed to selected services.

## 7.1 Hydraulic power generation and distribution

### Figure 2.29

> \\\*\\\*Image Generation Prompt — Figure 2.29:\\\*\\\* Recreate a \\\*\\\*large, portrait-format complete aircraft hydraulic schematic\\\*\\\*, with a clean white background, very fine black component outlines and coloured piping. Start at the \\\*\\\*top\\\*\\\* with \\\*\\\*“Pressurizing Air”\\\*\\\* feeding the \\\*\\\*“Reservoir Air Space”\\\*\\\*. Beside this place the source explanation about \\\*\\\*positive liquid supply at pump inlet and preventing bubbles at high altitude\\\*\\\*. Label the reservoir \\\*\\\*“Contents”\\\*\\\*, \\\*\\\*“Reservoir”\\\*\\\*, \\\*\\\*“Flight deck gauge”\\\*\\\*, \\\*\\\*“Temperature”\\\*\\\* and show the \\\*\\\*purple wavy fluid-level line\\\*\\\*. Include reservoir notes about liquid storage, pump head, small-leak compensation, jack-ram displacement, thermal expansion and accumulator charge. From it draw the \\\*\\\*engine-firewall shut-off valve\\\*\\\* (marked \\\*\\\*“Firewall Shut-Off Valve”\\\*\\\* and \\\*\\\*“Operated by FIRE HANDLE”\\\*\\\*), \\\*\\\*“Low Pressure (LP) Filter (Protects Pump)”\\\*\\\*, a circular \\\*\\\*“P”\\\*\\\* pump, \\\*\\\*“Ground Service Coupling” / “G S C”\\\*\\\*, pressure gauge, and a dashed \\\*\\\*“CONSTANT VOLUME SYSTEM ONLY”\\\*\\\* region enclosing the red \\\*\\\*“Automatic Cut-Out Valve”\\\*\\\*. On the right, draw a long \\\*\\\*yellow return/cooling loop\\\*\\\* through \\\*\\\*“Full Flow Relief Valve”\\\*\\\* and \\\*\\\*“Cooler”\\\*\\\*. Below the pump show a \\\*\\\*“High Pressure (HP) Filter (Protects system)”\\\*\\\* in the red pressure supply. At the lower left show a red/grey \\\*\\\*“Accumulator”\\\*\\\* with \\\*\\\*“Air”\\\*\\\*, \\\*\\\*“Separator Piston”\\\*\\\* and its six original functions (pressure storage, damping 'Hammering', expansion, emergency liquid, initial supply, longer cut-in/cut-out interval). Include \\\*\\\*“Non Return Valve (NRV) / One Way Check Valve”\\\*\\\* and at lower right a boxed \\\*\\\*“Pump / Hyd Motor”\\\*\\\* receiving a dotted arrow from \\\*\\\*“Another Hydraulic System”\\\*\\\*, noting power transfer without fluid mixing. Finish with a broad red \\\*\\\*“To System”\\\*\\\* arrow across the bottom. Place an underlined \\\*\\\*“TYPES OF PUMP”\\\*\\\* list at left containing \\\*\\\*(a) Hand (Double Acting), (b) Engine Driven, (c) Electric (DC or AC), (d) Pneumatic (Air Turbine), (e) Ram Air (HYRAT), (f) Hydraulic (Pump \\\& Motor)\\\*\\\*. Preserve the source's relative component positioning and detailed internal annotations; caption simply \\\*\\\*“Figure 2.29”\\\*\\\*. Do not replace this dense full-system diagram with a generic hydraulic circuit.

### Figure 2.29 — How to read it

Follow the system from its **reservoir and positive pump supply**, through the **low-pressure filter**, **pump**, any **cut-out arrangement**, then the **high-pressure protection filter**, **NRV**, **accumulator** and final **distribution to services**. Separate loops serve pressure relief, cooling and ground servicing. A **motor-pump transfer unit** can provide hydraulic power from another system while keeping the liquids separate.

## 7.2 Essential services and selection circuits

### Figure 2.30

> \\\*\\\*Image Generation Prompt — Figure 2.30:\\\*\\\* Draw a \\\*\\\*tall, portrait-format hydraulic service-distribution schematic\\\*\\\* on white, using \\\*\\\*solid red pressure lines\\\*\\\*, \\\*\\\*yellow low-pressure return lines\\\*\\\*, black component outlines and many small original technical labels. At the \\\*\\\*top\\\*\\\*, show \\\*\\\*“FLAPS”\\\*\\\*, \\\*\\\*“Mechanical Overload Protection”\\\*\\\*, \\\*\\\*“Relief Valve”\\\*\\\*, a \\\*\\\*“Selector”\\\*\\\*, \\\*\\\*“Flow Control Valve”\\\*\\\* and \\\*\\\*“Down / UP”\\\*\\\* flow paths. Below left, add the \\\*\\\*U/C / landing gear\\\*\\\* circuit with \\\*\\\*“U/C DOWN”\\\*\\\*, \\\*\\\*“U/C UP”\\\*\\\*, \\\*\\\*“Shuttle Valve”\\\*\\\*, \\\*\\\*“Selector”\\\*\\\*, \\\*\\\*“Sequence Valve”\\\*\\\*, \\\*\\\*“Restrictor Valve”\\\*\\\*, return connections and the explanatory text \\\*\\\*“Fitted in U/C UP line so that free-fall speed will be restricted”\\\*\\\*. In a dashed centre box headed \\\*\\\*“ESSENTIAL SERVICES (Typical)”\\\*\\\*, show the \\\*\\\*“Brakes”\\\*\\\* sub-system with \\\*\\\*“Fuse”\\\*\\\*, \\\*\\\*“Modulator”\\\*\\\*, \\\*\\\*“Brake Control Valve”\\\*\\\*, \\\*\\\*“Pressure Reducing Valve”\\\*\\\*, \\\*\\\*“Shuttle Valve”\\\*\\\*, the \\\*\\\*“From Alternate System”\\\*\\\* input and the \\\*\\\*“Power Flying Control”\\\*\\\* area with selector and a small \\\*\\\*“TRV”\\\*\\\*. Add a bottom-centre \\\*\\\*“(HYdraulic Ram Air Turbine) HYRAT”\\\*\\\* block with the restriction \\\*\\\*“ONLY supplies Flying Controls”\\\*\\\*. To the right run a thick red vertical supply line feeding a \\\*\\\*“Pressure Maintaining Valve (Priority Valve)”\\\*\\\*, arrows \\\*\\\*“To Secondary Services”\\\*\\\* and \\\*\\\*“From Supply”\\\*\\\*. All flow routing and circuit labels should follow the source's positions. Caption \\\*\\\*“Figure 2.30”\\\*\\\*.

### Figure 2.30 — What the service layout demonstrates

The distribution circuit gives practical examples of the devices already described: the **flap circuit** contains overload protection and flow regulation; the **undercarriage circuit** uses shuttle, sequence and restrictor valves; the **brake circuit** combines fusing, modulation, controlled/reduced pressure and an alternate supply; and **flying controls** are treated as essential loads protected by a **priority valve**.

\---

# 8\. High-Pressure Pneumatic Systems

**Pneumatic power** uses pressurized **air** rather than hydraulic liquid. The textbook notes that high-pressure pneumatic operation is not widely employed for major services on modern transport aircraft, because hydraulic power generally handles large items such as the landing gear more efficiently. A historical example still described in the chapter is the **Fokker F.27**.

## 8.1 Advantages and limitation of compressed air

|Advantages|Main drawback|
|-|-|
|Air is readily available and does not have to be purchased as a hydraulic fluid.|**Air is compressible**, unlike the nearly incompressible working liquid in hydraulics.|
|Air weighs less than the equivalent hydraulic liquid.||
|There is no hydraulic-liquid fire hazard associated with the air itself.||
|Air does not present oil-viscosity problems when temperature changes.||
|The system can be lighter because it does not need **return pipes** to bring spent working air back to a reservoir.||

## 8.2 The F.27 system

The **F.27** example is a high-pressure **closed-centre** system. Air is compressed by a **four-stage compressor** driven through the turboprop engine's **accessory gearbox**. An **unloading valve** controls the supply to around **3,300 psi**. The circuit also has a **shuttle valve** so it may be charged from an **external air source**.

Water must be removed before air passes into storage or working components, because moisture may **freeze** inside the pneumatic circuit:

1. A **moisture separator** removes about **98%** of the water carried with the air.
2. A **dryer**, containing a **desiccant** such as **silica gel** or **anhydrous aluminium silicate**, removes the water remaining after separation.

A **10-micron filter** then helps ensure that the compressed air entering the system is clean.

### Storage and working pressures

Three air bottles hold a reserve of high-pressure air for immediate demand:

|Stored-air supply|Bottle volume|
|-|-:|
|Main system|**750 cubic inches**|
|Braking system|**180 cubic inches**|
|Emergency system|**180 cubic inches**|

Most of the aircraft's pneumatic users operate at about **1,000 psi**, so pressure is reduced from the high-pressure storage value before supplying the **landing gear, passenger door, nose-wheel steering and propeller brake**.

### Figure 2.31 F27 High Pressure Pneumatic System

> \\\*\\\*Image Generation Prompt — Figure 2.31 F27 High Pressure Pneumatic System:\\\*\\\* Reconstruct the \\\*\\\*complete F.27 pneumatic circuit\\\*\\\* as a large landscape flow diagram on white with thin grey/black symbols and striking \\\*\\\*red pneumatic lines\\\*\\\*. At the top, show \\\*\\\*“Ground charging port”\\\*\\\*, \\\*\\\*“Safety disc”\\\*\\\*, \\\*\\\*“Shuttle valve”\\\*\\\* and \\\*\\\*“Unloading valve”\\\*\\\*. To left and right, draw engine-driven compressor branches marked \\\*\\\*“Left engine”\\\*\\\*, \\\*\\\*“Right engine”\\\*\\\*, and central \\\*\\\*“Engine driven compressors”\\\*\\\*. On the left incoming supply draw \\\*\\\*“Moisture separator”\\\*\\\*, \\\*\\\*“Desiccant”\\\*\\\*, \\\*\\\*“Non-return valve”\\\*\\\* and \\\*\\\*“Filter”\\\*\\\* in that sequence. Mid-right use a tall upright grey bottle labeled \\\*\\\*“High pressure storage bottle (accumulator)”\\\*\\\*, with gauges, filters and valves connected as shown. Mid-left show separate horizontal cylindrical bottles for \\\*\\\*“Emergency system”\\\*\\\* and \\\*\\\*“Normal brakes”\\\*\\\*, and source labels at relief devices \\\*\\\*“3800 psi relief valve”\\\*\\\*. At bottom-right, show a \\\*\\\*“1000 psi pressure reducer”\\\*\\\* and the separate outlets \\\*\\\*“Propeller brakes”\\\*\\\*, \\\*\\\*“Nosewheel steering”\\\*\\\*, \\\*\\\*“Normal gear operation”\\\*\\\*, and \\\*\\\*“Passenger door”\\\*\\\*. Retain the \\\*\\\*“Isolation valve”\\\*\\\* near the lower crossover line and the source's red pipe routing with pressure arrows; preserve exact caption \\\*\\\*“Figure 2.31 F27 High Pressure Pneumatic System”\\\*\\\*.

\---

# 9\. Fast Revision: Component → Job

|Device|Key idea to remember|
|-|-|
|Hydraulic lock|Trapped liquid holds a piston stationary.|
|Hydraulic motor|Liquid flow produces rotary motion; flow rate affects speed.|
|Thermal relief|Relieves pressure caused by heating of trapped liquid.|
|Full-flow relief|Protects a circuit if its normal high-pressure regulation fails.|
|Flap relief|Permits flap blowback under excessive aerodynamic loading.|
|Priority valve|Preserves pressure for essential users ahead of secondary demand.|
|Reducing valve|Feeds a circuit at less than main-system pressure.|
|Brake-control valve|Adjusts braking pressure from pilot/anti-skid/autobrake demands.|
|NRV|Full flow in one direction, reverse flow blocked.|
|One-way restrictor|Free flow one way, slowed flow the other.|
|Selector|Connects a working port to pressure and another to return.|
|Shuttle valve|Enables normal or alternative supply to run one service.|
|Sequence valve|Ensures dependent components move in the intended order.|
|Modulator|Controls brake-flow delivery in an anti-skid system.|
|Flow-control valve|Holds liquid flow at the required value.|
|Hydraulic fuse|Cuts off a broken/leaking line.|
|Pressure relay/gauge/switch|Displays pressure or signals low pressure.|
|Bleed point|Removes air responsible for unstable operation.|

\---

# 10\. Chapter Practice Questions — Rewritten for Study

The following **50 questions** follow the chapter's original test objectives and numerical examples. Their wording has been refreshed for readability; the keyed responses follow the book unless an issue is specifically highlighted in the notes. Choose the **best** answer in each case.

**1.** Two separate hydraulic pistons each receive a **100 N** load. One has an area of **0.02 m²** and the other **0.04 m²**. What pressures result?

* **A.** 2,000 Pa on the smaller piston and 4,000 Pa on the larger.
* **B.** 5,000 Pa on the smaller piston and 2,500 Pa on the larger.
* **C.** Both pistons necessarily move at identical speeds.
* **D.** Both pistons develop identical pressures.

**2.** A gas-charged accumulator initially shows **1,000 bar**. Once the connected system reaches **1,500 bar**, what pressure will the accumulator indicate?

* **A.** 500 bar.
* **B.** 1,000 bar.
* **C.** 1,500 bar.
* **D.** 2,500 bar.

**3.** What does a normal hydraulic-system pressure gauge indicate?

* **A.** Only the charge pressure of the accumulator gas.
* **B.** A combined reading of gas and hydraulic pressure.
* **C.** A proportional reading rather than actual system pressure.
* **D.** The pressure of the liquid within the hydraulic circuit.

**4.** Which arrangement is the principal purpose of a shuttle valve?

* **A.** Substituting for every non-return valve in a circuit.
* **B.** Enabling either of two pressure supplies to drive one consumer.
* **C.** Splitting one pressure supply between two unrelated consumers.
* **D.** Providing only a basic one-way flow path.

**5.** Which fluid identification matches **DEF STAN 91-48** in the book?

* **A.** Red, mineral-based.
* **B.** Red, synthetic-based.
* **C.** Green, mineral-based.
* **D.** Purple, synthetic-based.

**6.** What is the main function of a hydraulic restrictor?

* **A.** Limiting how many services remain usable after a pressure failure.
* **B.** Regulating the speed at which an actuator carries out its movement.
* **C.** Determining the system's overall pressure-rise rate.
* **D.** Setting the total distance that an actuator travels.

**7.** What operating condition describes a hydraulic lock?

* **A.** Fluid passes normally but the jack cannot move.
* **B.** Fluid cannot pass but the jack continues under its own weight.
* **C.** Fluid is unable to flow and the actuator remains fixed.
* **D.** Fluid flow remains continuous in both directions.

**8.** A hydraulic circuit is filled with the wrong fluid type. What is the important risk?

* **A.** Only a higher normal operating temperature.
* **B.** Damage such as leakage, filter contamination/blockage, overheating and potentially corrosion.
* **C.** An increase in the indicated reservoir quantity with no other problem.
* **D.** No meaningful effect because hydraulic fluids are interchangeable.

**9.** What job does the freely moving internal piston perform in a gas/liquid accumulator?

* **A.** It pumps oil upward whenever the accumulator is charged.
* **B.** It forces oil downward whenever the accumulator is charged.
* **C.** It separates the compressed gas from the hydraulic oil.
* **D.** It prevents every possible hydraulic lock.

**10.** A relief valve opens when:

* **A.** Pressure remains below the normal operating value.
* **B.** A priority circuit needs a guaranteed supply.
* **C.** Its preset relieving pressure is reached.
* **D.** Temperature alone increases, irrespective of pressure or valve type.

**11.** What is the most complete statement of a hydraulic reservoir's primary job?

* **A.** Accommodating leaks, displaced oil and thermal expansion.
* **B.** Simply storing surplus fluid without other functions.
* **C.** Acting only as a fluid quantity indicator.
* **D.** Permanently holding oil between the jack and the accumulator.

**12.** Air is found inside a hydraulic circuit. What should happen?

* **A.** Leave it; normal use will always remove it without intervention.
* **B.** Vent or bleed the air out through the appropriate points.
* **C.** Rely exclusively on the accumulator to eliminate it.
* **D.** Increase system speed until the air is compressed.

**13.** Where is the hydraulic pressure-line filter positioned?

* **A.** Only in the oil-return pipe immediately before the reservoir.
* **B.** On the pressure side, after the main pump.
* **C.** In a bypass that opens whenever maximum flow is selected.
* **D.** At the reservoir outlet before the pump, instead of the pressure line.

**14.** Which description best represents the chapter's statement of Pascal's law?

* **A.** Applied pressure falls as the external load increases.
* **B.** Liquid has to compress significantly to transmit force.
* **C.** Accumulators must be charged using oxygen.
* **D.** A pressure effect imposed on enclosed fluid is conveyed equally in every direction.

**15.** What regulates the output of a variable-displacement pump used in a constant-pressure circuit?

* **A.** An automatic cut-out valve that switches every pump stroke off.
* **B.** Engine RPM alone.
* **C.** The pump's pressure-responsive control piston.
* **D.** A swash plate that responds directly to oil temperature.

**16.** What inlet condition is necessary for a high-pressure hydraulic pump?

* **A.** Positive hydraulic-fluid feed to the inlet.
* **B.** No need for a positive fluid supply.
* **C.** Centrifugal force alone setting the outlet pressure.
* **D.** No oil circulation needed for cooling or lubrication.

**17.** Why are filters provided in pump case-drain systems?

* **A.** To catch all debris coming directly out of the reservoir.
* **B.** To discharge case lubricant freely into the atmosphere.
* **C.** To help assess pump condition by examining its lubricant and contamination.
* **D.** To act as the normal reservoir suction filter.

**18.** What is an accumulator mainly intended to provide?

* **A.** A means of continually discharging excess system pressure.
* **B.** A reserve of hydraulic liquid held under pressure.
* **C.** Gas for inflating the aircraft tyres.
* **D.** A device whose only job is to remove air bubbles.

**19.** When does a normal one-way check valve shut off flow?

* **A.** Whenever upstream pressure is greater than downstream pressure.
* **B.** Only while a thermal relief valve unloads a hand pump.
* **C.** Whenever upstream pressure is smaller, the valve opens fully.
* **D.** When inlet pressure falls below the pressure downstream.

**20.** Where does the book place restrictors for slower gear extension and slower flap retraction?

* **A.** In the undercarriage **UP** line and flap **UP** line.
* **B.** In the undercarriage **DOWN** line and flap **UP** line.
* **C.** In both the undercarriage **DOWN** and flap **DOWN** lines.
* **D.** Only in the feed to the gear retraction actuator.

**21.** How is a constant-delivery system protected if its automatic cut-out valve fails?

* **A.** By a full-flow relief valve downstream of the cut-out arrangement.
* **B.** By a full-flow relief valve fitted only upstream of the cut-out.
* **C.** No separate pressure protection is needed.
* **D.** By controlling the pump's final pressure solely through RPM.

**22.** Two jacks receive **3,000 Pa**. Their piston areas are **0.02 m²** and **0.04 m²**. What forces do they produce?

* **A.** The same force at each piston.
* **B.** The same piston speed must occur at both jacks.
* **C.** 600 N and 1,200 N respectively.
* **D.** 60 N and 120 N respectively.

**23.** What is the separator's function inside an accumulator?

* **A.** Keeping the gas charge apart from hydraulic liquid.
* **B.** Directly halving the required overall accumulator size.
* **C.** Extracting dissolved gas from circulating liquid.
* **D.** Setting the reservoir's quantity reading.

**24.** In the idealized closed hydraulic circuit considered in this chapter, pressure transmitted to an operating jack is:

* **A.** Always greatest directly beside the jack.
* **B.** Always greatest at the most remote end of the line.
* **C.** Guaranteed to diminish continuously during every jack stroke.
* **D.** Transmitted at the same pressure throughout the connected liquid (ignoring flow losses).

**25.** A reservoir is filled to its marked level with the system unpressurized. What happens to its indicated quantity after the accumulator is charged and the system pressurized?

* **A.** The level moves below the initial full mark.
* **B.** It has to show a higher ‘full accumulator charged’ marking.
* **C.** There is no liquid-level change at all.
* **D.** It rises above the full mark.

**26.** What does a priority valve protect?

* **A.** Operation of all services when the aircraft engines are shut down.
* **B.** Availability of pressure for the essential services.
* **C.** A lower-pressure feed for an ordinary non-essential user.
* **D.** An increase in the pump's maximum regulated pressure.

**27.** Under what circumstances does hydraulic lock occur?

* **A.** When a thermal relief valve begins discharging.
* **B.** When hydraulic liquid circulates freely to the tank.
* **C.** When liquid movement is blocked and the jack cannot shift.
* **D.** When an air/liquid mixture continuously bypasses the cylinder.

**28.** Consider liquid trapped in an enclosed cylinder between the piston and the end wall. How does its pressure act in the idealized situation?

* **A.** More strongly at the piston than at the cylinder wall.
* **B.** More strongly at the closed end than at the piston.
* **C.** Only when the piston is moving, not when it is stopped.
* **D.** Equally on the piston and the cylinder end.

**29.** Which event causes a non-return valve to close in normal operation?

* **A.** Installing a selector valve without a bypass.
* **B.** Inlet pressure becoming greater than the outlet pressure.
* **C.** The two pressures becoming exactly equal, so it must open.
* **D.** Loss of sufficient inlet pressure to keep the valve open.

**30.** What is a characteristic symptom of an accumulator with an inadequately charged gas side?

* **A.** Unusually fast, but steady, jack travel.
* **B.** No possible change to hydraulic operation.
* **C.** Rapid pressure fluctuations during operation.
* **D.** Exceptionally fast and smooth operation.

**31.** What is the significance of hydraulic-system hammering?

* **A.** It is harmless and always expected.
* **B.** It occurs solely because pipe bores vary.
* **C.** It proves another hydraulic selection must immediately be made.
* **D.** It is undesirable and can harm the system.

**32.** Can the base type of an aircraft hydraulic fluid reliably be identified just by its colour?

* **A.** Yes, especially if a technician tastes it.
* **B.** Yes; its colour always identifies the base liquid.
* **C.** Yes, provided all samples come from the same manufacturer.
* **D.** No; colour alone is not a reliable universal identification method.

**33.** When is an automatic cut-out valve (ACOV) expected to provide an unloading/idling route?

* **A.** At every new hydraulic selection, regardless of pressure.
* **B.** In order to extend the life of the accumulator itself.
* **C.** When the accumulator has reached its fully charged cut-out condition.
* **D.** So the hydraulic pump is continuously under maximum load.

**34.** Why is a hydraulic fuse often fitted to a brake-pressure pipe?

* **A.** To keep the parking brake applied overnight.
* **B.** To lower brake pressure whenever a wheel is about to skid.
* **C.** To stop reservoir pressurization as altitude changes.
* **D.** To prevent a broken brake line draining the whole system's fluid.

**35.** A shuttle valve makes which arrangement possible?

* **A.** Emptying the accumulator whenever the engine stops.
* **B.** Unloading the main pump at the pressure cut-out threshold.
* **C.** Selecting either of two independent pressure sources for the same component.
* **D.** Bypassing a failed full-flow relief valve into the reservoir.

**36.** Which choice gives the best overall purpose of a reservoir?

* **A.** Allowance for temperature-related expansion only.
* **B.** Allowance for small leakage, expanding oil and actuator-ram displacement.
* **C.** Replacement of fluid lost through serious leaks only.
* **D.** Prevention of cavitation as its sole function.

**37.** In the chapter's stated reservoir arrangement, what change can follow release of hydraulic-system pressure?

* **A.** Reservoir air pressure must always increase.
* **B.** Reservoir fluid quantity can rise when the reservoir is below other hydraulic components.
* **C.** Reservoir liquid must fall when the reservoir occupies the highest position.
* **D.** The reservoir immediately empties overboard.

**38.** How does hydraulic pressure behave across different pipe diameters within an ideal closed system?

* **A.** A larger pipe always has a greater pressure.
* **B.** A smaller pipe always has a greater pressure.
* **C.** Pressure does not depend directly on pipe diameter.
* **D.** Pressure must change in strict proportion to the number of consumers selected.

**39.** Which safety description of **Skydrol** matches the chapter?

* **A.** It requires no special handling or protective care.
* **B.** It resists ignition, but can harm skin, eyes and certain paint finishes.
* **C.** It is very flammable and also harms skin, eyes and paint.
* **D.** It is very flammable but otherwise harmless.

**40.** Which seal compatibility is appropriate for replenishing a system with Skydrol under the chapter's example?

* **A.** Any hydraulic system, whatever its seal material.
* **B.** A hydraulic circuit built with **butyl-rubber seals**.
* **C.** Any aircraft hydraulic circuit during an emergency.
* **D.** A circuit using **neoprene seals** instead of butyl.

**41.** On initial demand during system start-up, a variable-displacement hydraulic pump tends to begin at:

* **A.** Minimum stroke.
* **B.** A stroke set directly by oil viscosity.
* **C.** Maximum stroke.
* **D.** Precisely half stroke.

**42.** What combination best describes a hydraulic reservoir's role?

* **A.** Housing the pressure-transducer equipment only.
* **B.** Providing a convenient level sight glass only.
* **C.** Handling actuator displacement, small losses and thermal expansion while providing quantity monitoring.
* **D.** Housing every principal hydraulic pump instead of using backing pumps.

**43.** Where are **thermal relief valves** commonly needed?

* **A.** Across the entire return system whenever temperature rises.
* **B.** To release only half the fluid pressure on a hot day.
* **C.** To send expanding fluid into the actuator rather than relieve trapped pressure.
* **D.** On **isolated hydraulic lines** to protect against heating of trapped oil.

**44.** What supply condition is required by a main hydraulic pump to reduce cavitation risk?

* **A.** No positive inlet supply once it has been primed.
* **B.** A positive supply of liquid at its inlet.
* **C.** No inlet pressure requirement whatsoever.
* **D.** Permission to run dry without damage.

**45.** Two actuators of different piston diameters are provided with fluid at the same pressure and delivery rate. What necessarily differs?

* **A.** They must develop precisely the same output force.
* **B.** Both must lift identical loads.
* **C.** Both piston rods must travel at the same speed.
* **D.** The forces they can produce differ because their piston areas differ.

**46.** A force of **1,500 N** acts on a piston of area **0.002 m²**. Its fluid pressure also acts on a second piston of area **0.003 m²**. If the smaller piston moves **0.025 m**, select the matching **second-piston force, system pressure and work input**.

* **A.** 56.25 J; 750,000 Pa; 750,000 N.
* **B.** 750,000 N; 2,250 Pa; 56.25 J.
* **C.** 225 N; 75,000 Pa; 562.5 J.
* **D.** 2,250 N; 750,000 Pa; 37.5 J.

**47.** Consider these accumulator functions: **(1)** store pressurized liquid; **(2)** damp pressure pulses; **(3)** accommodate liquid expansion; **(4)** remove the need for a reservoir; **(5)** absorb landing impacts; **(6)** allow thermal expansion; **(7)** increase the interval between cut-out and cut-in; **(8)** provide liquid at the start of a demand when the pump is cut out; **(9)** hold emergency pressure following pump failure. Which combination is printed as correct in the chapter's answer key?

* **A.** All nine functions.
* **B.** None of the functions.
* **C.** 1, 2, 3, 4, 5, 8 and 9.
* **D.** 1, 2, 3, 6, 7 and 9.

**48.** Which seals are associated respectively with **DEF STAN 91-48** and **Skydrol 700**?

* **A.** Natural rubber; neoprene.
* **B.** Neoprene; natural rubber.
* **C.** Butyl; neoprene.
* **D.** Neoprene; butyl.

**49.** Which reservoir design options can help prevent pump cavitation?

* **A.** Pressurizing the reservoir.
* **B.** Using a bootstrapped reservoir arrangement.
* **C.** Placing the reservoir higher than the pump.
* **D.** All three of these methods.

**50.** For which task is an aircraft hydraulic hand pump normally provided in the chapter's example?

* **A.** Ground hydraulic servicing.
* **B.** Extending the gear in every emergency by hand.
* **C.** Inflating oleo struts during flight.
* **D.** Automatically retracting the landing gear after take-off.

\---

# 11\. Answer Key and Explanations

|Question|Answer|Reason|
|-:|:-:|-|
|1|**B**|Pressure equals force divided by area: 100/0.02 = **5,000 Pa**; 100/0.04 = **2,500 Pa**.|
|2|**C**|Once charged above its gas pre-charge, accumulator pressure follows the connected system pressure in this idealized example.|
|3|**D**|The main system gauge reads hydraulic-liquid pressure.|
|4|**B**|A shuttle switches a shared consumer between two pressure feeds.|
|5|**A**|The book identifies DEF STAN 91-48 fluid as red and mineral based.|
|6|**B**|A restrictor limits flow, which sets how quickly an actuator can move.|
|7|**C**|Oil is trapped and cannot move, so the jack stays in position.|
|8|**B**|An unsuitable oil may attack seals/materials or cause blockages, leaks and overheating.|
|9|**C**|The floating piston physically separates gas from oil.|
|10|**C**|A relief valve responds to its calibrated opening pressure.|
|11|**A**|A reservoir provides volume allowance for normal system losses and displacement.|
|12|**B**|Trapped air must be removed through bleeding.|
|13|**B**|The pressure filter protects components downstream of the pump.|
|14|**D**|The intended Pascal principle is **equal transmission of pressure**, not the same numerical force on unequal piston areas.|
|15|**C**|The control piston responds to system pressure to regulate pump displacement.|
|16|**A**|Positive inlet feed helps avoid cavitation.|
|17|**C**|Case-drain material can reveal internal pump wear and condition.|
|18|**B**|The accumulator retains a usable reserve of pressurized liquid.|
|19|**D**|Reverse differential pressure closes the check valve.|
|20|**A**|In the textbook examples both relevant one-way restrictors are in **UP** lines.|
|21|**A**|A downstream full-flow relief path protects against cut-out failure.|
|22|**D**|$F\_1=(3{,}000,\\mathrm{Pa})(0.02,\\mathrm{m}^{2})=60,\\mathrm{N}$ and $F\_2=(3{,}000,\\mathrm{Pa})(0.04,\\mathrm{m}^{2})=120,\\mathrm{N}$.|
|23|**A**|Gas and hydraulic oil must remain separate.|
|24|**D**|Enclosed liquid conveys the applied pressure through its connected volume.|
|25|**A**|When the accumulator accepts liquid, reservoir quantity falls.|
|26|**B**|The priority device safeguards the essential circuit's supply.|
|27|**C**|Hydraulic lock requires restricted flow and an immobile jack.|
|28|**D**|The pressure in enclosed fluid acts equally at both faces in this idealized case.|
|29|**D**|Without sufficient upstream feed, the one-way valve closes against backflow.|
|30|**C**|Inadequate gas charge results in poor damping and rapid pressure variation.|
|31|**D**|Hammering is undesirable pressure shock/instability.|
|32|**D**|Colour alone is not a universal means of determining fluid type.|
|33|**C**|ACOV provides an unloaded/idling pump path at the cut-out condition.|
|34|**D**|A fuse shuts an abnormal leak path before all available fluid can be lost.|
|35|**C**|The valve allows two sources, one at a time, to feed a selected service.|
|36|**B**|This includes small leaks, volume changes and jack-ram movement.|
|37|**B**|The stated example permits fluid level to rise when circuit pressure is removed and fluid returns.|
|38|**C**|Within the ideal closed-fluid pressure model, pressure does not depend on tube diameter.|
|39|**B**|Skydrol is fire resistant but harmful to skin, eyes and some coatings.|
|40|**B**|The book associates Skydrol with butyl-rubber-compatible seals.|
|41|**C**|A pump facing initial demand is at maximum displacement/stroke.|
|42|**C**|The reservoir accommodates varying oil quantity and allows that quantity to be monitored.|
|43|**D**|Thermal relief protects **trapped oil in isolated lines**.|
|44|**B**|A positive pump-inlet feed prevents cavitation.|
|45|**D**|At common pressure, larger piston area develops greater force.|
|46|**D**|Detailed calculation below.|
|47|**D**\*|This is the **textbook's printed key**, but its statement (8) is also described as an accumulator function in Figure 2.29. See the note below.|
|48|**D**|DEF STAN 91-48: neoprene; Skydrol 700: butyl.|
|49|**D**|Pressure, bootstrap action or favourable gravity head can provide positive pump feed.|
|50|**A**|A hand pump is commonly used for ground hydraulic servicing.|



