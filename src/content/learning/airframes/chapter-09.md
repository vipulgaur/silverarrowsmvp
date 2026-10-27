# Chapter 9: Powered Flying Controls



## 1\. Introduction: Why Flying Controls Are Powered

A modern aeroplane can develop considerable **aerodynamic loads on its control surfaces**. These loads become especially significant when the aircraft has **large movable surfaces** or flies at **high speed**. The corresponding control-column or pedal forces may be too great for convenient manual operation. Maximum permissible control loads are addressed in **CS-25**, the certification specifications cited by the textbook.

Aircraft manufacturers therefore use an external source of energy—most commonly **hydraulic power**, although electrical power is also used—to supply part or all of the force required to move the controls.

Two broad arrangements are distinguished:

* **Fully powered controls:** The power unit moves the control surface, while the cockpit control supplies the command. There is no direct aerodynamic feedback through the power unit to the pilot.
* **Power-assisted controls:** Power helps the pilot move the surface while the control arrangement still transmits a measure of the surface's aerodynamic reaction back to the cockpit.

The type selected depends on how much assistance the aircraft's control surfaces require.

\---

## 2\. Main Elements of a Power-Operated Control System

A basic powered control installation contains three essential devices:

1. **Hydraulic actuator:** Produces the physical movement and force needed at the control surface.
2. **Servo or control valve:** Routes pressure and return flow to command the actuator's direction and movement.
3. **Artificial-feel unit:** Provides the pilot with an appropriate resistance at the cockpit control when natural aerodynamic feedback is absent.

Two additional functions are essential to satisfactory control:

* **Follow-up / feedback:** Stops movement when the surface has reached the position corresponding to the pilot's input. The surface must not continue running simply because pressure is available.
* **Control feel:** Gives the pilot a sensible relationship between control effort, aircraft speed and the amount of control movement.

A feedback linkage measures the resulting actuator/surface movement and restores the valve toward neutral. This makes the output **proportional to the selected input**, rather than being an uncontrolled displacement.

### Figure 9.1 System requirements — Image-generation prompt

> Recreate the precise \*\*flowchart layout\*\* of the source figure as a wide landscape aviation technical diagram on a pure-white rectangular field with a thin light-grey border. At the far upper left, draw a small black/grey upright cockpit control column. Across the main upper path, place pale-beige rectangles with black lettering \*\*“SERVO-VALVE”\*\*, \*\*“ACTUATOR”\*\*, and \*\*“CONTROL SURFACE”\*\*, connected left-to-right by thick \*\*blue arrowed lines\*\*. Beneath, show \*\*two separate pale-beige boxes, each labeled “ARTIFICIAL FEEL UNIT”\*\*, with their own vertical blue bidirectional arrows up to the command line; retain both boxes exactly rather than deduplicating them. Toward the lower centre/right add \*\*“CUTS OUT THE OPERATION”\*\* and \*\*“FOLLOW UP OR FEED BACK”\*\* blocks, connected by the same blue-arrow system: an arrow drops from the control surface to the feedback box, the feedback signal points left into the cut-out block, and an arrow returns upward toward the servo valve. Keep the original simple squared-rectangle geometry, capitalized internal wording, narrow black outlines and textbook schematic aesthetic. Caption below in small blue italics exactly: \*\*“Figure 9.1 System requirements”\*\*.

\---

## 3\. Fully Powered Flying Control Unit (PFCU): How It Works

The example in the text uses an elevator operated by a hydraulic unit. Its **actuator ram/piston is anchored to the aircraft**, while the **actuator housing moves** and is linked to the elevator.

### 3.1 Commanding an Elevator-Up Movement

When the pilot **pulls the control column rearward**:

1. Mechanical linkage shifts the **servo/control valve toward the left**.
2. The valve connects the **left side of the actuator to hydraulic pressure**.
3. At the same time, the **right side is connected to return**.
4. Because the internal piston is held by the fixed ram, hydraulic force moves the **actuator housing to the left**.
5. This housing movement drives the elevator linkage and **raises the elevator**.

The important distinction is that **the actuator housing is the moving member** in this particular diagram; it is not a generic drawing of a moving piston rod extending from a fixed cylinder.

### Figure 9.2 A fully powered flying control unit (PFCU) — Image-generation prompt

> Draw the exact \*\*side-on mechanical-and-hydraulic schematic\*\* from the textbook, landscape orientation inside a thin grey rectangular frame, without aircraft scenery. On the left, a grey elevator section with triangular taper is attached to a black hinge and linked by a short horizontal grey rod to a central \*\*red hydraulic jack housing\*\*. The central section contains a \*\*yellow servo valve/spool passage arrangement\*\* above two red actuator chambers; a \*\*long grey jack ram extends to the right and is bolted to a black-and-white striped fixed aircraft-structure support\*\*. At the far right, draw the upright black/grey cockpit control column and horizontal control linkage. Recreate original thin blue/black outlines and red/yellow port highlights, as well as all visible arrows and words: \*\*“ELEVATOR”\*\*, \*\*“SERVO VALVE”\*\*, \*\*“PRESSURE”\*\*, \*\*“RETURN”\*\*, \*\*“HYDRAULIC JACK”\*\*, \*\*“JACK RAM BOLTED TO AIRCRAFT STRUCTURE”\*\*, \*\*“INPUT”\*\* above the control column and \*\*“OUTPUT”\*\* below the elevator linkage. Preserve the left-to-right locations and arrow directions; the actuator body must be the moving portion. Caption exactly \*\*“Figure 9.2 A fully powered flying control unit (PFCU)”\*\* beneath the drawing in blue italic lettering.

### 3.2 Follow-Up and Hydraulic Lock

The moving actuator housing also changes the position of the valve relative to its ports. As the output approaches the displacement requested by the pilot:

* The valve lands progressively **cover the pressure and return openings**.
* Further pressure supply is stopped and the return route is closed.
* Fluid becomes trapped, producing a **hydraulic lock** that holds the actuator at its newly selected position.

This is **mechanical follow-up**: the unit effectively cancels its own command when the commanded movement has been achieved. A larger control-column displacement produces a correspondingly larger surface movement, within the control system's limits.

A fully powered arrangement is described as **non-reversible (irreversible)**: aerodynamic movement of the elevator does **not** drive the pilot's control column backward through the power unit.

### 3.3 Duplicate Units and Power Reversion

A powered system must account for the failure of an actuator or its hydraulic supply. The textbook describes using **duplicated units**, arranged **in parallel or in series**, supplied by **separate hydraulic systems**.

In the illustrated backup arrangement:

1. One hydraulic supply fails or is deliberately isolated.
2. Hydraulic pressure falls in its actuator.
3. A **spring-loaded bypass piston** opens a passage between the actuator chambers.
4. Fluid can circulate through the bypass instead of being trapped.
5. The unpowered unit can move along with the surviving operating unit, so the failed unit does **not** impose a hydraulic lock against the available control movement.

This feature is often described as a **power-reversion/bypass provision**; its role here is to allow a backup unit to move the surface after the failed unit is depressurized.

### Figure 9.3 A power assisted flying control unit — Image-generation prompt

> Use the same visual scale, arrangement and palette as Figure 9.2 to reconstruct \*\*Figure 9.3\*\*: grey tapered \*\*elevator\*\* at far left, red \*\*hydraulic jack\*\* and yellow \*\*servo valve\*\* in the centre, fixed vertical ram to the right, and cockpit \*\*control column\*\* at far right. Preserve the critical distinction that the ram's right-hand attachment is to the \*\*control column\*\*, not to a fixed airframe support. Recreate arrows showing pilot \*\*“INPUT”\*\* and surface \*\*“OUTPUT”\*\*; label \*\*“ELEVATOR”\*\*, \*\*“SERVO VALVE”\*\*, \*\*“PRESSURE”\*\*, \*\*“RETURN”\*\*, \*\*“HYDRAULIC JACK”\*\*, and \*\*“JACK RAM BOLTED TO CONTROL COLUMN”\*\*. Include the fixed hinge dot and right-side control linkage geometry. White background, grey rectangular frame, red actuator shading and yellow passages, small blue italic caption exactly \*\*“Figure 9.3 A power assisted flying control unit”\*\*.

\---

## 4\. Artificial-Feel Units: Restoring Useful Feedback

In a **fully powered, irreversible** control system, the hydraulic unit provides the movement, so the pilot no longer experiences the natural aerodynamic resistance of the movable surface. Without any replacement resistance, the controls could feel unnaturally light and a pilot might command **excessive movement**.

An **artificial-feel unit** deliberately creates cockpit control resistance that reflects:

* **Aircraft speed**: generally more resistance is desirable as air loads rise with speed.
* **Amount of control movement**: larger displacements can require more force.

The chapter considers a progression from a **simple spring mechanism** to devices using **dynamic pressure**, often called **Q pots**, and then to hydraulically amplified feel computers.

|Control arrangement|Aerodynamic reaction at cockpit|Separate artificial feel in the chapter's model|
|-|-|-|
|**Fully powered**|No: the actuator is irreversible|**Required**|
|**Power assisted**|Yes: the linkage remains reversible|**Not required** for the basic arrangement described|

### 4.1 Spring-Box Feel

A control column connected to opposed springs develops force whenever it moves away from the neutral position. Moving the column **either forward or backward** compresses the corresponding spring, creating an increasing restoring effort.

This provides a simple mechanical form of feel. However, a spring alone does not automatically vary its resistance with dynamic pressure as airspeed changes.

### Figure 9.4 — Image-generation prompt

> Recreate the original rectangular \*\*spring-feel unit\*\* technical illustration. Place a tall black/grey \*\*control column\*\* at the left, with opposing \*\*blue left-pointing\*\* and \*\*red right-pointing\*\* arrows over its handle. A grey horizontal pushrod runs from the column to a grey horizontal \*\*cylinder/spring box\*\* on the right. Within the box show a central dark piston/slider and \*\*two opposed helical compression springs\*\*, one at either end, with blue and red directional arrows within the spring chambers. The grey housing rests on a broad pedestal with two bolt heads and a black base line. Use textbook cutaway shading, no text labels inside the original image, thin grey frame, and the exact centered italic blue caption \*\*“Figure 9.4”\*\*.

\---

## 5\. Dynamic Pressure and the Simple Q Pot

The **Q pot** uses pitot and static pressures to produce a resisting force related to airspeed. The textbook's simple design connects the control column to a piston through a **double linkage** arranged so that displacement of the column in **either direction** pulls the piston forward against the pressure acting on its face.

* **Pitot pressure** is applied to the forward chamber.
* The opposite/rear chamber is vented to **static pressure**.
* Therefore, the useful pressure difference across the piston equals **dynamic pressure**.

The required relationship is:

$$
q = p\_t - p\_s = \\frac{1}{2}\\rho V^2
$$

where **q** is dynamic pressure, **pₜ** pitot/total pressure, **pₛ** static pressure, **ρ** air density and **V** airspeed relative to the air.

Equivalently, using the book's pressure notation:

$$
\\left(p + \\frac{1}{2}\\rho V^2\\right)-p = \\frac{1}{2}\\rho V^2
$$

As **speed increases**, the pressure differential increases, which raises the pilot force needed to displace the Q-pot piston.

### Figure 9.5 — Image-generation prompt

> Reproduce the original \*\*mechanical Q-pot diagram\*\*, landscape technical cutaway in a light grey frame. A tall black cockpit \*\*control column\*\* stands on the far left with a \*\*blue arrow pointing left\*\* over the handle. A grey horizontal control rod from the column meets a \*\*diamond-shaped articulated double linkage\*\* (thin black/grey struts and small hinge dots). This linkage drives a long piston rod to the right, ending in a thick dark-grey sliding piston inside a large open-topped/outlined horizontal chamber on a trapezoidal bolted support. On the \*\*left/forward side of the piston\*\* put two \*\*left-pointing blue arrows\*\* labeled from above \*\*“Pitot Pressure”\*\*; the right-side chamber opening is marked \*\*“Static Pressure”\*\*. Preserve the bottom blue arrow and label \*\*“PFCU Control Rod”\*\* at the appropriate linkage. Thin outlines, grey mechanical shading, no invented components. Small blue italic caption exactly \*\*“Figure 9.5”\*\*.

### 5.1 Why a Purely Pneumatic Q Pot Is Impractical

For a useful cockpit resistance, the direct air-pressure piston would need to be **very large**. Instead of making the pneumatic unit so large, the system can use the pitot/static signal to operate a **hydraulic spool-type selector valve**, allowing hydraulic pressure to produce the stronger physical resistance.

### Figure 9.6 — Image-generation prompt

> Recreate \*\*Figure 9.6\*\*, an L-shaped hydraulic/pneumatic cutaway schematic on pure white inside a thin rectangle. At the upper left is a small \*\*horizontal piston and pushrod\*\* with arrow/label \*\*“Piston”\*\*; its cylinder has an upward blue return line labeled \*\*“Bleed to Return”\*\*. A grey pressure channel runs down and right to a large \*\*vertical spool-valve housing\*\*, in whose upper section sits the diaphragm of the \*\*“‘Q’ Pot”\*\*. Two horizontal blue arrows enter from the \*\*right\*\* with labels \*\*“Pitot Pressure”\*\* (above) and \*\*“Static Pressure”\*\* (below). Farther down, the vertical body contains a two-land \*\*“Spool Valve”\*\* with grey hydraulic passages. On the right side are separate arrows labeled \*\*“Return”\*\* and \*\*“Hydraulic Pressure”\*\*. Use \*\*red pointed annotation arrows\*\* for “Piston”, “‘Q’ Pot” and “Spool Valve”, \*\*blue fluid-flow arrows\*\* for pressure/return. Maintain the original component positions and white/grey engineering cross-section style. Caption exactly \*\*“Figure 9.6”\*\* centered beneath.

\---

## 6\. Hydraulically Amplified Q-Pot Feel: Sequence of Operation

The hydraulic arrangement shown in the source works through a **pitot-operated diaphragm, a spool valve, hydraulic passages and a feel piston**.

### 6.1 How Airspeed Changes the Resistance

1. As the aircraft moves, **pitot pressure** acts in the upper Q-pot chamber, loading the diaphragm downward.
2. With increasing airspeed, the diaphragm experiences a **greater downward force**.
3. The diaphragm pushes the **spool selector valve** down.
4. The **pressure port opens farther** and the **return port becomes more restricted**.
5. Hydraulic fluid enters the chamber **ahead of the feel piston**, increasing the pressure against which the pilot must work.
6. Some fluid also travels through a **restricted channel to the underside of the spool**; this damps the spool's downward movement.
7. The resulting higher feel-piston pressure makes the cockpit control **harder to move**.

Thus, the system converts the airspeed-dependent pitot/static signal into a larger hydraulic resisting force.

### 6.2 Why Return Flow Must Remain Possible

The return passage is **never completely shut**. If it closed entirely, hydraulic fluid could become trapped and create a **hydraulic lock** in the feel mechanism. The system must provide resistance while still allowing commanded movement.

### 6.3 Effect of Large Control Inputs

A large cockpit-control displacement increases control resistance in a way that the source compares to the greater resistance obtained during high-speed flight. Both the **airspeed signal** and the **amount of movement** contribute to useful feel characteristics.

### 6.4 Relationship Between Feel Unit and PFCU

The source combines the power-control unit and the separate artificial-feel mechanism in **Figure 9.7**. A particularly important arrangement detail is that the **artificial-feel unit is connected in parallel with the pilot's control column**, rather than being in series between the power actuator and the control surface.

### Figure 9.7 — Image-generation prompt

> Produce a highly accurate \*\*two-level schematic\*\* inside one thin grey-bordered white rectangle, as in the textbook. \*\*Upper half:\*\* black cockpit control column on left linked to a grey hydraulic actuator/servo valve at centre, with a cylinder rod connecting to a grey \*\*elevator airfoil on right\*\*; show blue \*\*“Pressure”\*\* arrow pointing down into the upper control-valve block, blue \*\*“Return”\*\* arrow pointing right, and red \*\*“Control Valve”\*\* arrow pointing left toward its spool. \*\*Lower half:\*\* a separate parallel linkage descending from the left control column to a hydraulic feel piston/valve at lower centre-right; clearly label blue arrows \*\*“Return”\*\*, \*\*“Pitot Pressure”\*\*, \*\*“Static Pressure”\*\*, another \*\*“Return”\*\*, and \*\*“Hydraulic Pressure”\*\* in the same relative positions as the original. Use light- and dark-grey sectional shading with black rods and hinges, blue flow arrows and a single red label arrow, preserving the connection of both upper and lower units to the pilot control. Do not combine the circuits or omit the separate feel unit. Centered italic blue caption exactly \*\*“Figure 9.7”\*\*.

\---

## 7\. Combined Spring and Hydraulic Artificial-Feel System

A more complete artificial-feel installation combines **mechanical spring feel** with **hydraulic pressure feel**:

* At **lower speeds**, spring resistance may be sufficient.
* At **higher speeds**, greater control force is required, partly to discourage inputs that could **overstress the structure**.

### 7.1 Restoring the Controls Toward Neutral

In the arrangement illustrated, a **double cam on the aft elevator-control quadrant** tends to return the controls to the neutral position. If the pilot deflects the control column, the pilot must:

1. **Compress the appropriate spring**, and
2. **Overcome pressure acting on the hydraulic feel piston**.

This produces a controlled, increasing force rather than an unrestricted free-moving control.

### 7.2 The Feel Computer's Airspeed Inputs

The feel computer receives two pressures on opposite sides of a diaphragm:

* **Pitot pressure** to the upper side;
* **Static pressure** to the other side.

The resulting diaphragm load acts downward on **two spring assemblies**:

* One sits above the **stabilizer-position cam**.
* The other sits above the **metering valve**.

The source describes the downward loading as dependent on airspeed, with the stabilizer-position input also contributing to the overall feel/trim arrangement.

### Figure 9.8 — Image-generation prompt

> Reconstruct the detailed \*\*“Figure 9.8” artificial-feel computer schematic\*\* as a single rectangular engineering diagram, preserving all interconnected parts. At the \*\*left\*\*, show a slender grey \*\*Control Column\*\* with handle; below/next to it show linked \*\*Quadrants\*\*, a crossed pair of black control links and the blue arrow \*\*“To PCU”\*\*. Slightly to the right place a tilted \*\*Hydraulic\*\* feel cylinder and diagonal \*\*Spring Feel\*\* element with their respective grey mechanism and blue \*\*“Return”\*\* arrow. At centre-right draw a tall grey \*\*Metering Valve\*\* housing with grey spool, lower \*\*“Hydraulic Pressure”\*\* input and upper \*\*“Return”\*\* arrow; label the nearby \*\*“Relief Valve”\*\*. At the \*\*upper right\*\*, draw a separate \*\*Feel Computer\*\* assembly fed by horizontal left-to-right blue arrows \*\*“Pitot Pressure”\*\* and \*\*“Static Pressure”\*\*, with wavy-edged \*\*“Bellows”\*\* in the top-right compartment; show spring rods and the curved stabilizer-position cam connected to the lower valve. At bottom-right is a grey horizontal-tail shape explicitly labelled \*\*“Stabilizer”\*\*. Preserve red component callout arrows, blue pressure/return arrows, black/grey line work and every label exactly: \*\*“Feel Computer”\*\*, \*\*“Bellows”\*\*, \*\*“Pitot Pressure”\*\*, \*\*“Static Pressure”\*\*, \*\*“Control Column”\*\*, \*\*“Quadrants”\*\*, \*\*“To PCU”\*\*, \*\*“Hydraulic”\*\*, \*\*“Return”\*\* (both locations), \*\*“Spring Feel”\*\*, \*\*“Relief Valve”\*\*, \*\*“Hydraulic Pressure”\*\*, \*\*“Metering Valve”\*\*, \*\*“Stabilizer”\*\*. Caption beneath, in centered blue italics, \*\*“Figure 9.8”\*\*.

### 7.3 How the Metering Valve Regulates Pressure

The metering valve is balanced by **hydraulic pressure acting on its internal horizontal surfaces**. In its steady condition, these hydraulic forces oppose one another and tend to hold it neutral.

* When the **metered pressure** on the relief-valve region balances the **downward diaphragm-and-spring load**, the high-pressure **inlet stays closed**.
* If **airspeed increases**, the diaphragm creates a greater downward load. The valve shifts downward to admit more hydraulic pressure.
* Pressure rises until it again balances the applied mechanical/diaphragm load.
* The valve continuously **modulates** to replace fluid that bleeds to the return path.

This is a **regulated hydraulic-resistance system**, not simply an on/off pressure switch.

### 7.4 What Happens When the Pilot Moves the Column

When the pilot pushes the feel piston into its cylinder, the pilot must overcome hydraulic resistance. The resulting load is transmitted to a **relief valve**, which opens slightly against the downward pitot-related force. A small quantity of hydraulic fluid then **bleeds back to return**, allowing controlled displacement while retaining the intended feel force.

\---

## 8\. Stabilizer Trim as Load-Relieving Feel Trim

After the pilot has used the elevator to establish a flight condition, the control column may still require a continuous holding force. The feel computer therefore incorporates a **load-relieving trim arrangement** connecting the **horizontal stabilizer** to the feel-system relief valve via the **stabilizer-position cam and bellows**.

To remove the residual force, the pilot adjusts the **variable-incidence stabilizer** until:

* The control-column force is cancelled;
* The elevator can return toward its **neutral position**; and
* The aircraft can maintain the selected flight condition **hands-off**, without a continuous pilot holding load.

### 8.1 Simplified Feel-Trim System

The trim wheel in the illustrated mechanism causes the **bellows to expand downward**, reducing the downward pressure on the **metering valve**. At the same time, the trimming mechanism changes the tailplane or elevator setting so that the aircraft no longer needs continuous stick pressure for the chosen flight condition.

### Figure 9.9 — Image-generation prompt

> Recreate \*\*Figure 9.9\*\* as a horizontal, minimally colored control-feel/trim schematic inside a light grey frame. On the \*\*left\*\*, a tall dark-grey \*\*feel-unit/valve housing\*\* shows a vertical piston and a stack of closely spaced spring/diaphragm folds at its top. To its left, three thick \*\*blue arrows pointing left\*\*, aligned vertically, are labelled exactly \*\*“Return”\*\*, \*\*“Controls”\*\*, \*\*“Pressure”\*\*. From the upper-right portion of the grey housing extend thin blue/grey lines, identified by red arrows and labels \*\*“Pitot Pressure”\*\*, \*\*“Static Pressure”\*\*, and \*\*“Trim”\*\*. At centre, a grey adjustable linkage with a \*\*circular trim wheel\*\* and a horizontal spring-like element connects toward the right. At far right depict a grey \*\*horizontal stabilizer\*\* with a small \*\*“Electric Trim Actuator”\*\* beneath/near its leading end, identified by a red arrow; a separate red trim arrow refers to the central trim command. Maintain exactly this left-system/right-tailplane placement, red callout arrows and white background. Caption exactly \*\*“Figure 9.9”\*\* beneath in blue italics.

\---

## 9\. Integrated Powered-Control Arrangement

A modern civil aircraft may combine numerous functions in one powered-control architecture:

* Mechanical pilot commands through the **control system**;
* Information from the **pitot (Q) system**;
* A **feel computer** and **feel unit**;
* **Stabilizer-position trim** and **neutral shift** inputs; and
* Commands from **autopilot flight-control computers** through a separate actuator.

The chapter illustrates two powered control paths, labelled **System A** and **System B**, that act on the controlled surface. This layout emphasizes **multiple inputs** and **separate actuation paths**, which improve the system's ability to maintain control despite individual failures.

### Figure 9.10 — Image-generation prompt

> Reproduce the original wide \*\*Figure 9.10\*\* systems block-and-linkage drawing on white with thin grey frame. At the \*\*left upper corner\*\*, draw a cockpit control stick feeding a pale-beige \*\*“Control System”\*\* block, connected by thin black mechanical linkage into a vertical linkage column. In the \*\*left middle\*\*, show beige blocks and blue arrows with these exact labels and directions: \*\*“Pitot System ‘Q’” → “Feel Computer” → “Feel Unit”\*\*; below them \*\*“Stabilizer Position Trim”\*\* feeding upward into the feel computer, and \*\*“Neutral Shift”\*\* feeding the feel-unit path. In the \*\*left lower part\*\*, place \*\*“Autopilot Flight Control Computers”\*\* connected by a blue arrow to a small grey \*\*“Actuator”\*\*, then to the vertical control linkage. At the \*\*right\*\*, show separate actuator/mechanical branches labeled \*\*“System ‘A’”\*\* and \*\*“System ‘B’”\*\*, each with a grey rectangular hydraulic actuator marked \*\*“A”\*\* or \*\*“B”\*\*, link rods and balance levers, joining two attachment points on the same large grey control-surface drawing at the far right. Show the diagonal lever geometry, springs and black rods rather than simplifying to just rectangles. Preserve all quoted labels, beige boxes, blue arrows, grey actuators and centered blue italic caption \*\*“Figure 9.10”\*\*.

\---

## 10\. Fly-by-Wire (FBW): Replacing Mechanical Commands With Electrical Signals

A **fly-by-wire** system remains a form of **powered flight control**, but the input to the actuator's **solenoid-operated servo valve** is an electrical command instead of a mechanically transmitted movement from the cockpit.

### 10.1 Command Path in an FBW System

1. The pilot moves a **sidestick** or a conventional **control column/rudder pedal**.
2. **Transducers** detect that movement and turn it into an **electrical signal**.
3. Electronic equipment amplifies/processes the signal, and **flight-control computers** calculate the required command.
4. The processed electrical instruction operates the **servo valve**.
5. The servo valve directs hydraulic flow to the appropriate **actuator**, moving the control surface.

Therefore, **“fly-by-wire” describes the transmission and processing of the commands**. It does **not** necessarily mean that electric motors provide the physical power to move every surface. In the textbook's **Airbus A320 example, the surfaces are hydraulically actuated** while control can be electrical or, for designated functions, mechanical.

### 10.2 Airbus A320 Example: Control Functions

The textbook describes the following division of responsibilities for the A320 arrangement:

|Function|Control method described|
|-|-|
|**Elevators (pitch)**|Electrical|
|**Horizontal stabilizer**|Electrical in normal or alternate mode; **mechanical manual trim** also available|
|**Ailerons (roll)**|Electrical|
|**Roll spoilers**|Electrical|
|**Rudder (yaw)**|Mechanically controlled, with electrical **yaw damping, turn coordination and trim**|
|**Slats and flaps**|Electrical|
|**Speed brakes**|Electrical|

The flight deck uses **two sidesticks**, **conventional rudder pedals**, and controls/indicators on the **centre pedestal**.

### 10.3 Flight-Control Computer Groups

|Computer type|Number in textbook example|Functions|
|-|-:|-|
|**ELAC — Elevator Aileron Computer**|**2**|Controls ailerons, elevators and stabilizer|
|**SEC — Spoilers Elevator Computer**|**3**|Controls upper-wing surfaces; provides standby elevator and stabilizer functions|
|**FAC — Flight Augmentation Computer**|**2**|Provides electrical rudder-control functions|

Together these computers convert pilot or automatic commands into controlled actions while offering alternative channels if an individual computer becomes unavailable.

### Figure 9.11 Fly by wire block diagram — Image-generation prompt

> Faithfully recreate \*\*Figure 9.11 Fly by wire block diagram\*\*, wide landscape white block diagram bounded by a thin rectangle. At top left, the heading \*\*“COMMANDS”\*\* sits above beige/white boxes \*\*“AUTOPILOT”\*\* and \*\*“SIDESTICK”\*\*; a left-hand vertical label reads \*\*“ELECTRICAL ORDERS”\*\*. \*\*Thin red arrows\*\* lead from both input boxes into a single slanted-front block headed \*\*“DIGITAL COMPUTERS”\*\*, listing exactly \*\*“ELAC’S (2)”\*\*, \*\*“SEC’S (3)”\*\*, \*\*“FAC’S (2)”\*\*. A red arrow exits to a tall \*\*“HYDRAULIC ACTUATORS”\*\* block beneath the right-side heading \*\*“HYDRAULIC ACTUATION”\*\*. A thick \*\*blue right-pointing arrow\*\* from that block leads to a vertical list \*\*“ELEVATOR”\*\*, \*\*“STABILIZER”\*\*, \*\*“AILERONS”\*\*, \*\*“SPOILERS”\*\*, \*\*“RUDDER”\*\*. Across the lower-left half, a separate heading \*\*“MECHANICAL BACKUP”\*\* accompanies a grey \*\*“RUDDER PEDALS”\*\* symbol and an illustrated \*\*“STABILIZER TRIM”\*\* handwheel/drive, each with horizontal grey mechanical lines to the actuator block. Preserve the exact colors and electrical-versus-mechanical grouping; below, set the blue italic caption \*\*“Figure 9.11 Fly by wire block diagram”\*\*.

\---

## 11\. Fly-by-Wire Compared With Conventional Controls

### 11.1 Weight, Stability and Fuel Consumption

FBW can offer **lower system weight** because the mechanical cable runs used by traditional cockpit-to-surface control systems are reduced or eliminated for functions that use electrical commands.

The textbook also notes that the control computers can make it possible to accept **less inherent (natural) stability** in a transport aeroplane. This can permit **smaller stabilizing surfaces**. Both the lighter control architecture and smaller surfaces contribute to **lower fuel consumption**.

### 11.2 The Reliability Challenge

The principal concern raised by the book is the **dependence on electrical/electronic control paths**. A conventional mechanical system may degrade progressively; an unprotected digital control path could cease functioning suddenly after a computer failure.

That is why aircraft FBW architecture must incorporate **redundancy**, such as:

* Additional independent computers;
* Mechanical backup paths for the functions designed to have them; and/or
* Hydraulic backup/control arrangements.

**Important interpretation:** A single flight-computer fault must not be treated as inevitably causing immediate total loss of aircraft control; the very purpose of the redundant design discussed here is to prevent that outcome.

### 11.3 Pilot Workload

Flight-control computers can perform or coordinate actions that would otherwise require separate pilot inputs, reducing workload. The examples given are:

* **Automatic turn coordination**; and
* **Automatic trimming**.

### 11.4 Flight-Envelope Protection

Flight-envelope protections help prevent pilot demands from exceeding defined aerodynamic or structural limits. The chapter specifically discusses:

* Limiting excessive **pitch/angle of attack**, so the pilot cannot command the aircraft beyond its **stalling angle of attack** under the described protective flight mode.
* Permitting positive pilot control up to the **+2.5 g** limit without intentionally exceeding that structural load limit in the protection mode described.

The associated diagram shows protections for several aircraft states, not only pitch and load factor.

### Figure 9.12 Flight protection — Image-generation prompt

> Recreate \*\*Figure 9.12 Flight protection\*\* as an exact \*\*hub-and-five-spokes conceptual diagram\*\* on white in a thin light-grey rectangular frame. All six rectangles have pale-beige fill with thin dark borders, centered black text. The \*\*centre rectangle\*\* reads exactly \*\*“Flight Mode”\*\*. From this middle box, draw \*\*five outward blue arrows\*\*: \*\*up-left\*\* to a top-left box \*\*“Pitch Attitude Protection”\*\*; \*\*straight up\*\* to a top-middle box \*\*“Load Factor Protection”\*\*; \*\*up-right\*\* to a top-right box \*\*“Bank Angle protection”\*\* (lowercase “protection” as shown); \*\*down-left\*\* to a lower-left box \*\*“Angle of Attack Protection”\*\*; and \*\*down-right\*\* to a lower-right box \*\*“High Speed Protection”\*\*. Preserve the generous white space and centered blue italic caption \*\*“Figure 9.12 Flight protection”\*\*.

\---

## 12\. Redundancy in Powered Flight Controls

Modern transport aircraft must be designed so that an isolated **hydraulic or electrical failure** does not produce an unacceptable loss of control.

One common form of structural/system redundancy divides a control surface into **two or three separately actuated sections**. Each part can be driven by a **different actuator and hydraulic system**, so that a single failure does not necessarily disable the whole surface.

FBW types add **computer-system redundancy** to the available hydraulic paths. In the Airbus example, the design includes the multiple ELAC, SEC and FAC channels introduced earlier.

### 12.1 Color-Coded Hydraulic Systems in the Airbus Example

Figure 9.13 distinguishes three supplies:

* **Y — Yellow hydraulic system**;
* **B — Blue hydraulic system**;
* **G — Green hydraulic system**.

The figure assigns different segments and functions to different supplies and computers, illustrating how control is distributed across physically separate resources.

### Figure 9.13 Flight control redundancy — Image-generation prompt

> Recreate the complete \*\*dense Airbus control-redundancy chart\*\* as a high-resolution technical diagram, \*\*not\*\* a simplified generic three-system picture. At top place three groups: left \*\*“2 Elevator, Aileron Computers”\*\* above overlapping blocks \*\*“ELAC 1”\*\* and \*\*“2”\*\*; centre \*\*“3 Spoiler, Elevator Computers”\*\* above \*\*“SEC 1”\*\*, \*\*“2”\*\*, \*\*“3”\*\*; right \*\*“2 Flight Augmentation Computers”\*\* above \*\*“FAC 1”\*\* and \*\*“2”\*\*. Below, show \*\*left and right tapered wing outlines\*\* with multiple small actuator boxes labeled \*\*“G”\*\*, \*\*“Y”\*\*, \*\*“B”\*\*, \*\*“Y”\*\*, \*\*“G”\*\*, the left aileron region \*\*“L Ail”\*\* and right \*\*“R Ail”\*\*, and tiny two-row \*\*B/G\*\* or \*\*G/B\*\* assignments at each aileron. Keep original over-wing control function brackets labeled \*\*“GND-SPL”\*\*, \*\*“LAF”\*\*, \*\*“SPD-BRK”\*\*, and \*\*“ROLL”\*\* on each wing; preserve dotted-lines and computer-control number assignments beneath marked \*\*“ELAC”\*\*, \*\*“SEC”\*\*, \*\*“Norm Control”\*\*, \*\*“Stby Control”\*\*. On lower left, add the explicit legend \*\*“Y - Yellow hydraulic system”\*\*, \*\*“B - Blue hydraulic system”\*\*, \*\*“G - green hydraulic system”\*\*. Lower centre show \*\*“L Elev”\*\* and \*\*“R Elev”\*\* trapezoidal elevator diagrams with two-cell \*\*B/G\*\* and \*\*Y/B\*\* boxes respectively; between them, a small \*\*“Horizontal Stabiliser Trim Actuator”\*\* with \*\*G\*\* and \*\*Y\*\* actuator tags and dashed \*\*ELAC/SEC\*\* control lines. On lower right show \*\*“Yaw Damper Actuator”\*\*, two small source boxes marked \*\*G\*\* and \*\*Y\*\* with \*\*“FAC 1”\*\* labels as printed, a round linkage marked \*\*“M”\*\*, and a tapered \*\*rudder/fin\*\* with stacked \*\*G, Y, B\*\* hydraulic source labels. Use thin black lines, small engineering text and accurate relative placement and original functional grouping. Caption exactly \*\*“Figure 9.13 Flight control redundancy”\*\* in centered blue italics below. All abbreviations and labels must remain legible; do not omit the crowded fine-detail lines.

\---

## 13\. Protection Against Jammed Controls

Control systems must also guard against **mechanical jamming**, which can occur in a control linkage or an individual actuator. Having redundant hydraulic pressure by itself does not guarantee that a jammed mechanical path can be bypassed.

The chapter describes several distinct ways of isolating a jam.

### 13.1 Pitch and Roll Disconnect Handles

Some aircraft have conspicuously colored **disconnect levers** on the centre pedestal. They separate coupled control paths so that an unaffected portion may remain usable.

* **Pitch/elevator disconnect:** Separates the elevator-related controls so that **each pilot retains control of that pilot's side**, according to the arrangement described.
* **Roll disconnect:** In the example, the **captain retains roll-spoiler control** and the **copilot retains aileron control**.

A disconnect system is **aircraft-specific**, and a reduced available **roll rate** may result after separation.

### 13.2 Cross-Linked Systems With Breakout Connectors

Some systems are normally cross-connected but contain **override or breakout connectors**. These allow the remaining usable control path to be operated despite a **single jam point**, rather than allowing one seized segment to immobilize the entire linked system.

### 13.3 Shear-Rivet Jam Isolation

Other systems deliberately connect control yokes with **shear rivets**. When the relevant control system becomes jammed, the rivet can be sheared by the prescribed opposing control action, allowing the remaining functioning path to move.

The book describes this arrangement for **aileron, elevator and rudder** systems:

* For an **aileron jam**, the control yokes are turned **toward one another** to shear the intended rivet, freeing the remaining control path.
* Comparable separation arrangements may be provided for **elevator and rudder** controls.
* A possible consequence when this form of protection is used is **loss of rudder centring**.

These are **design descriptions**, not universal in-flight instructions. The precise disconnect/breakout method depends on the aircraft's approved procedures.

\---

## 14\. Comparison: Manual, Power-Assisted, Fully Powered and FBW Controls

|Characteristic|Manual mechanical|Power assisted|Fully powered hydraulic|FBW powered|
|-|-|-|-|-|
|Principal cockpit-to-surface command|Mechanical|Mechanical with power assistance|Mechanical input to hydraulic servo|Electrical signal processed by computers|
|Main operating effort at surface|Pilot through linkage|Pilot plus assisting system|Hydraulic actuator|Usually hydraulic actuator in the chapter's Airbus example|
|Natural aerodynamic feedback to pilot|Present|Retained in basic reversible configuration|Absent through irreversible unit|Must be represented through designed control characteristics|
|Separate artificial feel in the textbook's basic comparison|Not needed|Not needed|Required|Control-force/handling characteristics supplied by system design|
|Essential additional protection emphasized|Stops, cable/linkage integrity|Power-failure provision|Redundancy and bypass|Computers, hydraulic/electrical redundancy and appropriate backup|

\---

# 15\. Rewritten Chapter Practice Questions (10 Source Questions)

The original chapter includes ten multiple-choice questions, mainly revising **mechanical cable-control principles** also encountered in the preceding flight-control-system material. Their concepts, options and original answer order are retained below in fresh wording.

### Question 1

**In an aircraft cable-control run, what is the main function of a pulley?**

A. Make tension identical everywhere in the cable system  
B. Redirect the cable around a change in routing  
C. Guarantee perfectly smooth operation in all conditions  
D. Prevent cable slack under every load

**Answer: B.** A pulley primarily changes the cable's **direction of travel**; tension is set and maintained by other aspects of the installation.

### Question 2

**Why are primary travel stops installed in a flight-control system?**

A. To establish the permitted travel limits of the control surface  
B. To determine the spacing of secondary stops  
C. To prevent movement in only one direction  
D. To set the aerodynamic neutral angle

**Answer: A.** Primary stops define the normal **end limits** of permitted surface travel.

### Question 3

**What is the protective purpose of secondary control stops?**

A. Reduce every load transmitted through the primary stops  
B. Prevent excessive travel if the primary stops fail  
C. Restrict only secondary controls, not primary controls  
D. Eliminate backlash from the linkage

**Answer: B.** Secondary stops provide a **backup travel limitation**.

### Question 4

**What is the main job of a fairlead in a cable-control installation?**

A. Produce large changes in cable direction  
B. Feed the cable onto pulley-wheel grooves  
C. Connect a cable directly to a chain drive  
D. Keep the cable aligned and clear of nearby structure

**Answer: D.** Fairleads guide and support the cable where it runs close to airframe structure; direction changes normally require **pulleys**.

### Question 5

**Which reasons for properly tensioning a cable-control system are selected by the source answer key?**

1. Reduce backlash in the linkage.
2. Load the turnbuckles for their own sake.
3. Support positive control action in both directions.
4. Guarantee full control travel merely by tensioning.
5. Account for temperature-related tension variations.

A. **1, 3 and 5 only**  
B. 3 only  
C. 4 only  
D. All five

**Answer: A.** The textbook selects **1, 3 and 5**: eliminate unwanted slack/backlash, maintain responsive action and accommodate temperature effects.

### Question 6

**According to the chapter's original answer key, what is the primary reason for using cables in opposing pairs?**

The possible statements are the same five listed in Question 5.

A. 1, 3 and 5 only  
B. **3 only**  
C. 4 only  
D. All five

**Answer: B.** Opposing cable runs are used to provide **positive control action in both directions**. The use of paired runs should not be confused with the separate need to set their tension correctly.

### Question 7

**Which statements correctly describe primary-control input in a manual flight-control system?**

1. The inputs are reversible.
2. The inputs are irreversible.
3. The pilot moves the controls in the instinctive direction for the intended response.
4. The controls must be moved opposite to the intended response.
5. Flight-deck obstructions are the intended design limit of control travel.

A. 1 and 4 only  
B. 2 and 4 only  
C. **1 and 3 only**  
D. 1, 3 and 5 only

**Answer: C.** Manual primary flight controls are normally **reversible** and arranged for **natural, instinctive pilot inputs**.

### Question 8

**For an intended yaw to the right, what is the correct rudder-pedal/surface combination?**

A. Right pedal forward, rudder deflected left  
B. **Right pedal forward, rudder deflected right**  
C. Left pedal forward, rudder deflected left  
D. Left pedal forward, rudder deflected right

**Answer: B.** Right rudder pedal forward commands the rudder to the **right**, producing the appropriate yawing tendency.

### Question 9

**What normal aileron action produces a roll to the right?**

A. Move the rudder right; right aileron up, left down  
B. Move the aileron control left; right aileron up, left down  
C. Move the aileron control right; right elevator up, left down  
D. **Move the aileron control right; right aileron up, left down**

**Answer: D.** Right control input commands **right aileron upward** and **left aileron downward**, generating the rolling moment.

### Question 10

**Which combined list of advantages of cable controls matches the textbook's selected answer?**

1. Low mass and good strength-to-weight ratio.
2. Relative ease of routing through the airframe.
3. Resistance to impact damage.
4. Small volume requirement.
5. Fewer bolted joints.

A. 1, 2 and 4 only  
B. 3 and 5 only  
C. 1, 2 and 5 only  
D. **All five statements**

**Textbook answer: D.** This reproduces the source's marked answer. **Study note:** the broader claims in items 3 and 5 are installation-dependent and should not be treated as universal rules about every cable-control arrangement. The chapter's answer key selects all five.

\---

## 16\. Original Chapter Answer Key

|Question|1|2|3|4|5|6|7|8|9|10|
|-|-|-|-|-|-|-|-|-|-|-|
|**Textbook key**|B|A|B|D|A|B|C|B|D|D|

\---

# 17\. Additional Diagnostic Self-Test Questions

1. **Why are powered flight controls used?**  
**Answer:** Large surface areas and/or high airspeeds create aerodynamic loads that would otherwise require excessive pilot control effort.
2. **Which CS document is cited for maximum control loads?**  
**Answer:** **CS-25**.
3. **What are the three core parts of a basic powered-control system?**  
**Answer:** Hydraulic actuator, servo/control valve and artificial-feel unit.
4. **Why does a system need follow-up?**  
**Answer:** To stop movement once the surface reaches the position matching the pilot's selected input.
5. **In Figure 9.2, which part of the actuator moves?**  
**Answer:** The **actuator housing**; its ram is fixed to the aircraft structure.
6. **When the column is pulled back in the illustrated fully powered system, which side receives pressure?**  
**Answer:** The **left-hand actuator port**; the right-hand port connects to return.
7. **How is the elevator held at its commanded position?**  
**Answer:** Follow-up closes the supply and return passages, forming a hydraulic lock.
8. **What is meant by an irreversible PFCU?**  
**Answer:** Surface loads/movements cannot drive the cockpit controls backward through the unit.
9. **Why is a bypass provided in a failed actuator?**  
**Answer:** It prevents trapped fluid from locking the failed unit so another actuator can move the control.
10. **Why is artificial feel required with fully powered controls?**  
**Answer:** The pilot otherwise lacks natural aerodynamic feedback and can overcontrol the aircraft.
11. **Does the textbook's reversible power-assisted unit require artificial feel?**  
**Answer:** **No**, not in the basic arrangement described.
12. **What does a spring-feel box oppose?**  
**Answer:** Control-column displacement in either direction away from neutral.
13. **What pressure difference operates a Q pot?**  
**Answer:** **Pitot pressure minus static pressure**, which equals dynamic pressure.
14. **State the dynamic-pressure equation.**  
**Answer:** $q = p\_t - p\_s = \\frac{1}{2}\\rho V^2$.
15. **Why is hydraulic amplification used with a Q pot?**  
**Answer:** An effective purely pneumatic piston would otherwise need to be impractically large.
16. **What happens to the spool valve as pitot loading increases?**  
**Answer:** It shifts toward greater pressure-port opening and a more restricted return, raising feel-piston resistance.
17. **Why must the feel-system return not close fully?**  
**Answer:** To avoid hydraulic lock.
18. **How is the artificial-feel unit connected to the cockpit control?**  
**Answer:** **In parallel** with the pilot's control column.
19. **Why is spring-plus-hydraulic feel beneficial?**  
**Answer:** It supplies low-speed resistance and increases force at higher speeds to discourage structural overstress.
20. **What does the metering valve do?**  
**Answer:** Modulates hydraulic pressure until it balances the speed-dependent diaphragm/spring load.
21. **What does feel trim seek to eliminate?**  
**Answer:** The continuous stick force needed to hold the selected flight condition.
22. **What is the important distinction between FBW and electric actuation?**  
**Answer:** FBW transmits commands electrically; the control surfaces may still be **hydraulically powered**.
23. **What converts cockpit movement into an electrical command?**  
**Answer:** A **transducer**.
24. **How many ELAC, SEC and FAC computers are cited for the Airbus example?**  
**Answer:** **2 ELAC, 3 SEC, 2 FAC**.
25. **Name two ways FBW may reduce fuel consumption.**  
**Answer:** Less heavy control cabling and smaller stabilizing surfaces permitted by relaxed natural stability.
26. **Which automatic functions can reduce workload?**  
**Answer:** Turn coordination and trim.
27. **Which structural-load value is explicitly used in the flight-envelope-protection discussion?**  
**Answer:** **+2.5 g**.
28. **What are the three hydraulic system colors in the Airbus redundancy diagram?**  
**Answer:** **Yellow (Y), Blue (B), Green (G)**.
29. **Why can redundant hydraulic systems still need jam protection?**  
**Answer:** A mechanically jammed control path can prevent surface movement even when pressure remains available.
30. **In the illustrated pitch/roll disconnect scheme, which control paths remain with each pilot after roll disconnection?**  
**Answer:** The **captain** retains **roll spoilers**, while the **copilot** retains **ailerons**.
31. **What is a possible consequence of using shear-rivet protection in the rudder system?**  
**Answer:** **Rudder centring may be lost**.

