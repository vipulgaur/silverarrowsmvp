# Chapter 15: Fire Detection and Protection

## Complete Rewritten Aviation Study Notes — CAE ATPL Airframes and Systems

## 1\. Fire Safety and Designated Fire Zones

Although an aircraft is engineered to minimize fire risks, its safety equipment must also account for a serious failure or leakage event. Certain aircraft areas contain machinery, fuel, fluids, or equipment that could support a fire if a component fails. These areas are treated as **designated fire zones**.

The textbook identifies the following locations as requiring fire detection and/or protection arrangements:

* **Powerplant/engine compartments**.
* **Auxiliary power unit (APU) installations**.
* **Main landing-gear wheel wells**.

A designated fire zone is an aircraft location in which defective or leaking equipment could create a fire risk. In engines and APU installations, **fire-resistant or fireproof bulkheads** form boundaries intended to prevent a fire in one zone from spreading to adjoining parts of the aircraft.

The detection system must recognize a concentrated fire or an abnormal increase in temperature **quickly**. However, a fire indication is not, by itself, an instruction for the detector to discharge the engine extinguisher automatically: the textbook distinguishes **automatic warning** from **extinguishing-system operation**. The later APU section notes that certain aircraft may provide automatic APU extinguisher discharge under specified circumstances.

### 1.1 The Fire Triangle

For combustion to continue, **heat**, **fuel**, and **oxygen** must be present together. Removing or interrupting one of these elements prevents the fire from being sustained. The type of extinguisher chosen determines which part of the process is disrupted: an agent may cool the burning material, reduce the available oxygen, or interfere with the combustion reaction itself.

### Figure 15.1 Triangle of fire

> \*\*Image Generation Prompt — Figure 15.1 Triangle of fire\*\*  
> Reproduce a simple, brightly colored aviation-training cartoon on a clean white background, inside a fine grey rectangular border. Draw a broad \*\*yellow triangular platform\*\* in slight three-dimensional perspective resting on a narrow red-brown base strip. The \*\*left vertex\*\* represents heat: an orange-yellow-red flame with the original hand-lettered red label \*\*“H E A T”\*\* above it. At the \*\*top-center vertex\*\* position a yellow \*\*petrol/fuel pump\*\* with black nozzle, hose, digital display, a large readable label \*\*“FUEL”\*\*, and a red prohibition-style circle on its lower face. At the \*\*right vertex\*\* draw a tall black oxygen cylinder with a curved hose, blue valve, and a white \*\*“O₂”\*\* identification patch; put the exact large black label \*\*“OXYGEN”\*\* above it. Keep the proportions and left–top–right triangle relationship faithful to the original, without adding extra icons, arrows, or scientific labels. Preserve the caption exactly: \*\*“Figure 15.1 Triangle of fire”\*\*.

\---

## 2\. Methods Used to Detect Aircraft Fires

The most suitable detector depends on its position and on the way heat or fire is expected to affect the sensing element. This chapter describes **four principal detector arrangements**:

1. Melting-link detectors.
2. Differential-expansion detectors.
3. Continuous fire-wire detectors.
4. Gas-filled detectors.

Their main differences are the physical change they monitor, whether they return to normal after cooling, and how they signal a damaged sensor or loop.

### 2.1 Melting-Link Detectors

This is an older arrangement based on a **fusible component** holding two electrical contacts apart.

* With the detector cool, the contacts remain separated and the warning circuit is open.
* At a predetermined temperature, the fusible part **melts**.
* The contacts then touch, completing the fire-warning electrical circuit.
* Once activated, the mechanism does **not** reopen simply because the fire has been extinguished.

**Key disadvantage:** The resulting indication remains latched or effectively permanent until the detector is attended to. Unlike a temperature-responsive resetting detector, it cannot automatically clear the warning following cooling.

### 2.2 Differential-Expansion Detectors

Different materials change their length by different amounts when heated. A differential-expansion detector uses this effect to make and break an electrical contact.

Its principal parts are an **outer expansion tube**, an internal **spring-bow assembly**, a **pair of contacts**, and a supporting **base**.

**When temperature rises:**

1. The outer tube lengthens more rapidly than the inner spring-bow member.
2. Their different rates of expansion draw the electrical contacts together.
3. The completed circuit provides the engine fire or overheat warning.

**When temperature falls:** The tube contracts again, allowing the contacts to separate and the indication to clear.

One application described in the textbook is monitoring **engine cooling-air outlets** for an **Internal Engine Overheat (IEOH)** condition. A **brief time delay** is commonly incorporated before the warning is activated, limiting spurious indications that might otherwise arise from vibration.

### Figure 15.2 Differential expansion detectors

> \*\*Image Generation Prompt — Figure 15.2 Differential expansion detectors\*\*  
> Copy the textbook's landscape technical drawing with \*\*two large vertical detector cross-sections side by side\*\* inside a thin grey box. Each is a tall dark metallic outer tube with thick black cap at the top, silver-white internal curved bow/contact pieces, narrow \*\*yellow elongated internal sensing strips\*\*, and a wide black base. Draw subtle red dashed reference lines running horizontally over the tops to compare thermal elongation. Below \*\*each\*\* detector, draw a separate black rectangular indicator panel containing a large circular lamp and the exact white stacked text \*\*“ENGINE”\*\* / \*\*“OVERHEAT”\*\*. The \*\*left\*\* lamp must be white/unlit and the internal bow contacts separated; the \*\*right\*\* lamp must glow vivid red, with the tube/contact geometry reflecting heating and contact closure. White and grey cables curve from each detector into its indicator. Keep a white background, no other diagrams, and preserve the exact caption \*\*“Figure 15.2 Differential expansion detectors”\*\*.

### 2.3 Continuous Fire-Wire Detectors

A **continuous fire-wire** system monitors a length of flexible sensing element routed around an engine fire zone. The source refers to this general detector family as **FFFD — Fire Wire Free From False Detection**. The sensing assembly contains:

* A **stainless-steel outer tube**.
* A **central conducting electrode**.
* **Temperature-sensitive insulating material** separating the center conductor from the metal tube.

The chapter describes two electrical sensing methods. A given system may use one or combine both:

**Resistance-responsive sensing**

* The insulation has a **negative temperature coefficient of resistance**.
* As the fire wire becomes hotter, its insulating resistance decreases.
* More current leaks between the inner electrode and outer sheath.
* When leakage reaches a calibrated threshold, a fire warning occurs.
* Cooling below the resetting threshold restores normal operation automatically.

**Capacitance-responsive sensing**

* Here the insulating material exhibits a **positive temperature coefficient of capacitance**.
* Heating produces an increase in capacitance.
* A control unit supplies **half-wave rectified AC** to polarize the element.
* The element stores and returns charge; the control unit measures the resulting **feedback current**.
* Once the feedback reaches its set limit, **visual and aural fire warnings** are generated.
* Cooling below the required value resets the detector.

An important advantage attributed to the capacitance system is that an **earth/ground short** affecting the sensing circuit does **not** automatically create the same false fire indication as could occur in a resistance-dependent arrangement.

**Loop layout and fault tolerance:** The fire wire is routed through the engine's vulnerable regions in a **dual-loop configuration**. In normal dual-loop operation, **both loops must recognize the fire** to issue the warning. The source describes these installations as **AC-powered**, able to remain functional with **one wire break**, and capable of displaying a fault at the **fire-detection panel or electronic system display**.

### Figure 15.3 Continuous wire (fire wire) detector

> \*\*Image Generation Prompt — Figure 15.3 Continuous wire (fire wire) detector\*\*  
> Produce a detailed \*\*exploded metallic assembly diagram\*\* on white, matching the original wide rectangular illustration. A sequence of long cylindrical grey sensor parts extends diagonally from upper left toward lower right. At left show a dual sensing-element bracket; in the middle show a black-and-silver \*\*support tube\*\* with a central \*\*dual clamp\*\*; at the right show a grey \*\*quick-release fastener\*\*, a small annular \*\*copper gasket\*\*, and \*\*connectors\*\* leading into two braided wire-covered sensing elements. Use thin red leader arrows, keeping the exact labels \*\*“Sensing Elements”\*\*, \*\*“Dual Clamp”\*\*, \*\*“Support Tube”\*\*, \*\*“Quick Release Fastener”\*\*, \*\*“Copper Gasket”\*\*, and \*\*“Connectors”\*\*. In the lower-left inset add a circular magnified tube cross-section, linked to the sensor by a bold black triangular arrow; label its \*\*“Steel Tube”\*\*, \*\*“Central Electrode”\*\*, and the surrounding textured filler with the exact annotation \*\*“Material which has:”\*\*, \*\*“+ve coefficient of capacitance”\*\*, \*\*“-ve coefficient of resistance”\*\*. Retain the layered grey insulating texture, brownish center electrode line, and the exact original caption \*\*“Figure 15.3 Continuous wire (fire wire) detector”\*\*.

### 2.4 Gas-Filled Detectors

A **gas-filled continuous detector** also follows a fire zone in the form of a stainless-steel sensing tube, but the quantity monitored is **gas pressure**, not electrical resistance or capacitance.

The tube encloses a **gas-absorbing core**. During manufacture, gas is admitted under pressure, some gas is absorbed into the core material, and the assembly is sealed. Heating the tube causes absorbed gas to be released, increasing internal pressure rapidly.

**Fire/overheat response:** A pressure-operated switch at the end of the tube senses the pressure increase. The signal is processed by a **control box** and activates the cockpit warning. In addition to detecting a fire, this arrangement can register an **overheat** arising, for example, from a **hot bleed-air leak**.

**Break/leak response:** If a sensor tube is punctured or otherwise loses integrity, its internal pressure **falls**. The same pressure-sensing arrangement detects the reduction and sends a **LOOP FAULT** indication to the fire panel or electronic display.

Like the continuous electrical fire wire, the textbook describes the gas-filled sensing installation as a **two-loop system**, normally requiring agreement between the loops for a fire indication.

> \*\*Safety interpretation from the textbook:\*\* A defect in fire detection that could cause a misleading fire warning must nevertheless be handled as an \*\*actual fire warning\*\*. A pilot should not assume an indication is false merely because a detector failure is possible.

### Figure 15.4 Gas filled detector

> \*\*Image Generation Prompt — Figure 15.4 Gas filled detector\*\*  
> Create the original \*\*two-level technical schematic\*\* within a thin grey landscape rectangle on white. Stack an \*\*upper overheat condition\*\* and a \*\*lower fire condition\*\*. Each level starts at left with a pale thin-lined rectangular electrical diagram containing the vertical terminal letters \*\*“E”\*\*, \*\*“D”\*\*, \*\*“C”\*\*, \*\*“B”\*\*, \*\*“A”\*\*, the exact text \*\*“Power Supply”\*\*, and black switching elements. On the upper level, the central warning element is identified \*\*“Responder Alarm Switch (Normally Open)”\*\* with arrows to its switch contacts; a long slender silver sensor tube extends to the right through a violet-blue shaded gas region, annotated \*\*“Overheat Expands Inert Averaging Gas”\*\*. On the lower level, also include \*\*“Alarm Signal”\*\* and \*\*“Power Supply”\*\* at left, the second \*\*“Responder Alarm Switch (Normally Open)”\*\*, and a long horizontal gas-filled sensor tube with an orange-red flame pictogram below it; point a red leader arrow to the tube marked \*\*“Fire Releases Active Gas from Hydride Core”\*\*. Keep both sensor tubes in the same horizontal alignment and the arrows, terminal letters, switch labels, gas bulb shading, and tube break marks. Exact caption: \*\*“Figure 15.4 Gas filled detector”\*\*.

### 2.5 Comparing the Four Methods

|Detector|What changes?|Reset behavior / notable feature|
|-|-|-|
|Melting link|Fusible material melts and allows contacts to close|Contact closure remains after cooling; older system.|
|Differential expansion|Outer tube and inner member expand differently|Contacts reopen with cooling; often uses vibration-related time delay.|
|Continuous fire wire|Insulation resistance falls and/or capacitance rises|Resets after cooling; dual loops and fault monitoring.|
|Gas-filled tube|Internal pressure rises when heated; falls if leaking|Detects overheat and tube failure; twin-loop installation.|

\---

## 3\. Fire-Detection Loops and Warning Logic

Dual sensing loops reduce the likelihood that one isolated sensing defect will trigger a misleading warning. In the illustrated normal arrangement:

* **Loop A** monitors the fire-zone sensing elements.
* **Loop B** independently monitors the same protected region.
* An **AND** decision is used if **both loops are healthy**, so both must agree before the system issues the fire indication.
* The illustrated system can change to **OR** logic when **one loop has failed**; the remaining active loop can still initiate a warning.

The **Fire Detection Unit (FDU)** routes its output to cockpit warning equipment, including the audible alert, engine system display, and master warning. A degraded loop is a maintenance/fault condition even when a system can continue to operate using the available loop.

### Figure 15.5 Fire detection loops

> \*\*Image Generation Prompt — Figure 15.5 Fire detection loops\*\*  
> Recreate a horizontal \*\*grey aircraft-engine and system-block diagram\*\* enclosed by a thin rectangular border. At \*\*upper left\*\*, show a large light-grey side view of a jet engine and rear pylon with three \*\*bright red rectangular fire-sensing segments\*\* along the engine and connection to two black parallel wiring paths. Mark the down-going lines exactly \*\*“LOOP A”\*\* and \*\*“LOOP B”\*\*. Bring both lines into a pale grey box marked \*\*“FDU”\*\* containing a prominent shield/logic symbol with \*\*“AND”\*\* at its center and a small asterisk below. At lower left, reproduce two short bullets with exact wording \*\*“AND logic when both loops are operative”\*\* and \*\*“OR logic when either loop is inoperative”\*\*. At the \*\*right\*\*, use three output paths and black arrows pointing respectively to a grey speaker marked \*\*“CRC”\*\*, a dark green cockpit screen labelled \*\*“ECAM”\*\*, and a turquoise warning-panel graphic with visible \*\*“MASTER WARN”\*\* and \*\*“MASTER CAUT”\*\* indicators, annotated \*\*“MASTER WARNING”\*\* below. The sensing engine must occupy the left side, logic center-bottom, and flight-deck outputs the right. Caption exactly \*\*“Figure 15.5 Fire detection loops”\*\*.

\---

## 4\. Pre-Flight Fire-System Test

Aircraft equipment must provide a way for the crew to **test the fire-warning circuit before departure**. This is normally done using a **fire-test selector on the flight deck**.

On selecting the test function, the system should produce indications comparable to a **real fire warning** for the engine channels being tested. This demonstrates the relevant continuity and alerting functions.

Typical interpretations are:

* **Correct test indication:** The warning circuits and indications being checked respond as expected.
* **Broken fire-warning circuit:** The affected engine may fail to display the expected fire-test warning.
* **Gas-sensing tube leakage:** The detector may not generate the required warning response.
* **Failure of only one fire loop:** The cockpit may show a separate loop-failure indication while the available loop remains in service.

Depending on the aircraft type and its approved operating limitations, the source notes that **restricted numbers of flight sectors/legs** may be allowed with operation relying on one detector loop. This is **aircraft-specific**, not a general permission.

### Figure 15.6 Typical fire warning indicators

> \*\*Image Generation Prompt — Figure 15.6 Typical fire warning indicators\*\*  
> Match the textbook's landscape composite of Airbus cockpit panels on a \*\*white background\*\*. Across the top display one \*\*long steel-blue-grey overhead fire panel\*\* subdivided into \*\*“ENG 1”\*\*, \*\*“APU”\*\*, and \*\*“ENG 2”\*\* sections. Each section has a large red translucent push-light with the readable words \*\*“FIRE”\*\* and \*\*“PUSH”\*\*; show adjacent rectangular \*\*“SQUIB” / “DISCH”\*\* windows, \*\*“AGENT 1”\*\*, \*\*“AGENT 2”\*\*, \*\*“TEST”\*\*, and vertical \*\*“FIRE”\*\* labels where they appear. From this top panel, a \*\*thick red diagonal arrow\*\* points into a central \*\*realistic wide-angle cockpit photograph\*\* showing the overhead panel, windscreen, instrument boards, and pedestal. At lower left, place an inset grey engine-start/fire selector panel with two black \*\*“ENG 1” / “ENG 2”\*\* levers, two \*\*“FIRE” / “FAULT”\*\* indicators, and a large center selector; another thick red arrow points toward the pedestal. Keep inset sizes, relative positions, bezel screws, illuminated red areas, and panel wording accurate. Preserve caption \*\*“Figure 15.6 Typical fire warning indicators”\*\*.

### Figure 15.7 Cockpit overhead engine fire panel

> \*\*Image Generation Prompt — Figure 15.7 Cockpit overhead engine fire panel\*\*  
> Recreate the \*\*close-up grey metal overhead fire pushbutton panel\*\* as a single isolated front view. A large central metallic red glass button reads \*\*“FIRE”\*\* in bold red and \*\*“PUSH”\*\* beneath, with a red pull-tab shape extending below. Above it, mark \*\*“ENG 1”\*\* in white. Place a small \*\*“AGENT 1”\*\* panel left and \*\*“AGENT 2”\*\* right; both have adjacent vertically stacked \*\*“SQUIB”\*\* and \*\*“DISCH”\*\* windows. On the left border show the vertical text \*\*“FIRE”\*\*, and underneath the left agent window include the small round \*\*“TEST”\*\* control. Reproduce round fastening screws, dark edge shadow, symmetrical layout, and original caption \*\*“Figure 15.7 Cockpit overhead engine fire panel”\*\*. Do not invent extra controls.

### Figure 15.8 Pedestal engine and fire control panel

> \*\*Image Generation Prompt — Figure 15.8 Pedestal engine and fire control panel\*\*  
> Draw a square front-facing \*\*blue-grey Airbus engine-start control panel\*\*, preserving metallic screw heads in four corners. Across the top label \*\*“MASTER 1”\*\*, \*\*“ENG”\*\*, \*\*“MASTER 2”\*\*. Place two black engine master switches labelled \*\*“ENG 1”\*\* and \*\*“ENG 2”\*\* on the upper left and right, with \*\*“ON”\*\* and \*\*“OFF”\*\* written beside each. A large round center mode selector has the white annotations \*\*“MODE”\*\*, \*\*“NORM”\*\*, \*\*“IGN”\*\*, \*\*“START”\*\*, and \*\*“CRANK”\*\* around it. At the lower left and right place two dark square warning windows reading \*\*“FIRE”\*\* (red) above \*\*“FAULT”\*\* (light grey), with small identifiers \*\*“1”\*\* and \*\*“2”\*\*. Keep layout, surface shading, wiring-free cockpit-panel look, and exact caption \*\*“Figure 15.8 Pedestal engine and fire control panel”\*\*.

\---

## 5\. Fire-Warning Indications and Crew Response

A fire alert needs to be **immediately noticeable**, but should not startle the crew so severely that correct action is delayed. The chapter lists several warning outputs that may be combined:

* A **bell**, **klaxon**, or repeated **chime**.
* A **master warning message**, identifying the affected engine (for example, a No. 1 engine fire).
* A steady **red FIRE indication** in the appropriate engine display channel.

Once an engine fire is indicated, the emergency procedure follows a **strict sequence**. In general terms, the crew must be able to:

1. **Silence or acknowledge the audible warning** as permitted by the checklist.
2. **Stop or isolate affected engine services**, including its fuel, bleed-air, electrical, and hydraulic connections.
3. **Discharge extinguishing agent** into the identified engine fire zones when called for by the procedure.

These are conceptual stages, **not a substitute for the aircraft's approved emergency checklist**. Which cockpit control to use and in what order depends on the aircraft type.

### Figure 15.9 Engine fire protection

> \*\*Image Generation Prompt — Figure 15.9 Engine fire protection\*\*  
> Reproduce a busy but organized \*\*single-page educational system composite\*\* with a thin rectangular frame. At the \*\*top\*\* place the long red-illuminated Airbus overhead \*\*“ENG 1 / APU / ENG 2”\*\* fire panel used in the previous illustration, with legible \*\*“FIRE”\*\*, \*\*“AGENT 1”\*\*, \*\*“AGENT 2”\*\*, \*\*“SQUIB”\*\*, \*\*“DISCH”\*\* and \*\*“TEST”\*\* labels. On the \*\*left-center\*\*, add a small rectangular cockpit photo; draw a broad red arrow from the overhead panel into its overhead area. Across the \*\*bottom\*\*, draw a grey simplified \*\*jet-engine and pylon side view\*\*, with two small fire bottles shown as red circles near the pylon and labelled \*\*“BOTTLE 1”\*\* and \*\*“BOTTLE 2”\*\*. Use thin black and red interconnecting routes from the top panel through the fire bottles. At the \*\*far lower right\*\*, show an enlarged dark spherical fire bottle with red center glow and two tiny separate fittings underneath, one annotated \*\*“CARTRIDGE”\*\*. A bold red arrow points from the engine's bottles to the enlarged spherical bottle. Preserve the flight-deck-to-engine relationships, lines, and original caption \*\*“Figure 15.9 Engine fire protection”\*\*.

\---

## 6\. Engine Fire Extinguishing System

### 6.1 Physical Installation

Once the specified **engine shutdown and isolation** actions have been performed, extinguishing agent can be released into the protected engine spaces.

A typical arrangement contains:

* Pressurized **fire-extinguishing bottles**, normally providing **two discharge opportunities per engine**.
* Distribution **pipes** connecting the bottle installation to the fire zones.
* A **spray ring** or similar discharge arrangement distributing agent around the protected region.
* Flight-deck operating controls and electrical cartridges/squibs to release the contents.

The source refers to **CS-25.1195(c)** as requiring **two discharges for each engine**. The number and use of bottles may be organized differently between aircraft designs, but the textbook's example has two opportunities.

### 6.2 Representative Bottle-Discharge Sequence

The textbook's general operating description is:

1. Complete the **engine shutdown/isolation drill**.
2. The electrical cartridge (**squib**) between the bottle and piping is armed; an associated **SQUIB** indication may appear on the fire panel.
3. Select **AGENT** to fire the cartridge and allow the pressurized extinguisher contents into the engine spray rings.
4. The discharge/low-pressure monitoring switch detects the changed bottle condition and illuminates **DISCH** at the relevant agent selector.
5. If fire remains, use the **second available discharge** as the aircraft checklist directs.

**Indication differences:** An older installation may show bottle activation through an **indicator fuse** that looks like a transparent small lamp and turns **red** when the bottle operates. Direct inspection may instead reveal a changed **bottle-head indicator pin** or **pressure gauge**. These indications may be behind an access panel rather than externally visible.

A separate possibility is **thermal overpressure release**: abnormal temperature or pressure causes the bottle to vent **overboard**, independently of the intended firefighting action. Signs may include:

* The pressure gauge falling to **zero**.
* An external **green disc** ejecting, exposing a **red disc** beneath.

### Figure 15.10 Typical fire protection system layout

> \*\*Image Generation Prompt — Figure 15.10 Typical fire protection system layout\*\*  
> Reproduce the original precise \*\*black-on-white schematic\*\* inside a thin rectangular border. At the very top place the exact two-line direction \*\*“PULL HANDLE AND TWIST LEFT OR RIGHT”\*\* / \*\*“TO ACTIVATE FIRE EXTINGUISHER”\*\*. Below it, draw two tall vertical extinguisher-selector controls showing large outlined numerals \*\*“1”\*\* and \*\*“2”\*\*, each with a small \*\*“DISCH”\*\* window and \*\*“L” / “R”\*\* turn markings. Under the first control add \*\*“L BOTTLE DISCHARGE”\*\*, under the second \*\*“R BOTTLE DISCHARGE”\*\*. Beneath these draw two round reservoirs with necks labelled \*\*“LEFT FIRE EXTINGUISHER”\*\* and \*\*“RIGHT FIRE EXTINGUISHER”\*\*, with a black leader arrow labelled \*\*“SQUIB”\*\* pointing to the bottle's lower discharge hardware. At the lower corners show two simplified engine silhouettes labelled \*\*“LEFT ENGINE”\*\* and \*\*“RIGHT ENGINE”\*\*. Use the same crossing black pipes/lines so either bottle can be routed to the left or right engine through the selected handle. Retain two upper control lines leading to the corresponding cartridges, all arrows, and the exact caption \*\*“Figure 15.10 Typical fire protection system layout”\*\*. This must remain a schematic, not a rendered three-dimensional aircraft.

### 6.3 Worked Engine-Fire Drill: Source Example

The textbook includes the following **illustrative left-engine procedure**. It is valuable for understanding the logic of the two-bottle arrangement, but **must not be used as a general aircraft operating checklist**:

1. Move the **left thrust lever to CLOSED**.
2. Close the **left engine HP/engine-start lever**.
3. **Pull engine fire handle No. 1**.
4. Rotate the **No. 1 handle fully to the left** and hold **at least 1 second**, releasing the **left bottle into the left engine**.
5. If the **fire light remains illuminated after 30 seconds**, turn handle **No. 1 fully to the right** and hold **at least 1 second**, releasing the **right bottle into the left engine**.
6. **Land as soon as possible**.

This sequence is reproduced as a **rewritten textbook example**. For an actual aircraft, the manufacturer-approved emergency checklist governs the control names, order, timing, and landing decision.

\---

## 7\. Auxiliary Power Unit (APU) Fire Protection

The **APU** is an independent, constant-speed **gas turbine** supplied with fuel from the aircraft fuel system. Depending on the installation, it may provide **bleed air**, **electrical power**, **hydraulic power**, or a combination. Certain certificated APUs can also be operated in flight.

Because an APU can operate without continuous attention from the crew, it incorporates automatic monitoring. The textbook lists four reasons for **automatic APU shutdown**:

* Fire.
* Loss or failure of oil pressure.
* Overspeed.
* Overheat.

Although auto-shutdown is provided, the installation normally has a **manual APU control/fire panel** as well. Some aircraft automatically **discharge the APU fire bottle** under particular conditions; the source does not state that this happens on every aircraft.

### Figure 15.11 External APU fire control panel (Airbus)

> \*\*Image Generation Prompt — Figure 15.11 External APU fire control panel (Airbus)\*\*  
> Recreate the exact \*\*blue-grey Airbus external APU service/fire control plate\*\* as a wide landscape drawing. Include four rounded metal mounting screws. Across the upper left draw two circular indicators, one white/silver labelled \*\*“EXT PWR”\*\* with the sub-label \*\*“NOT IN USE”\*\*, and one amber/orange labelled \*\*“FLT INT”\*\* with \*\*“AVAIL”\*\* beneath. Across the upper middle/right add small circular indicators labelled \*\*“COCKPIT CALL”\*\* (dark blue), \*\*“ADIRU \& AVNCS VENT”\*\* (dark red), and \*\*“APU FIRE”\*\* (bright red-pink). In the lower row show a white/silver circular \*\*“LIGHT TEST”\*\* pushbutton, a silver circular \*\*“COCKPIT CALL”\*\* button, a silver circular \*\*“RESET”\*\* pushbutton, and at lower far right a large red and black striped \*\*“APU SHUT OFF”\*\* lever/button. Match metallic grey shading, panel lettering, geometry and Airbus component positions; place the exact caption \*\*“Figure 15.11 External APU fire control panel (Airbus)”\*\* underneath. Do not substitute a modern generic APU display.

\---

## 8\. Automatic Toilet Waste-Bin Fire Extinguishing

Aircraft lavatories contain potential fire sources in the **towel, paper, and waste receptacles**. A localized fire-extinguishing installation is therefore mounted in association with these bins.

For aircraft designed to carry **20 passengers or more**, the textbook identifies this installation as required. A typical system contains:

* A dedicated **extinguishing bottle**.
* A **fusible plug** that responds to high temperature.
* A **spray ring/nozzle arrangement** directing agent into the relevant receptacle.

If a fire heats the fusible element sufficiently, it melts and the pressurized extinguishant is released into the spray arrangement. The lavatory is also required to have a **smoke detector**—a separate means of detection discussed in Chapter 14.

### Figure 15.12 Automatic toilet fire extinguishers

> \*\*Image Generation Prompt — Figure 15.12 Automatic toilet fire extinguishers\*\*  
> Replicate a realistic but simplified \*\*Airbus lavatory waste-bin suppression diagram\*\*. At \*\*left\*\*, illustrate a vertical metallic \*\*red-orange extinguisher cylinder\*\* in a silver retaining bracket, with a silver top valve and a crosswise network of narrow pipes/nozzles on the upper end; show a small \*\*orange fusible/discharge element\*\* at the outlet. A \*\*large thick blue-grey arrow\*\* points from this bottle toward the \*\*right\*\*, where a cutaway aircraft lavatory cabinet is shown in grey perspective: visible waste-bin compartment, small cabin fixtures, storage doors and adjacent toilet bowl. Use a plain white field inside a rectangular outline; keep the illustration split between a large extinguisher at left and the lavatory compartment at right. Preserve the precise caption \*\*“Figure 15.12 Automatic toilet fire extinguishers”\*\*. No extraneous warnings or imaginary control panel.

\---

## 9\. Identifying Fire Extinguishing Agents

No single agent is equally suitable for every on-board fire. Material compatibility, whether the fire involves liquids or electrical equipment, possible damage to the aircraft, and the risk to crew or passengers all matter.

The textbook discusses **Halon compounds, water-based extinguishers, powder, carbon dioxide, foam, and sand**. It also distinguishes agents traditionally carried on board from those used primarily on the ground. The colors and permissions described below belong to the source's period and terminology; they should not be treated as a present-day purchasing or carriage guide.

### Figure 15.13 Extinguishers

> \*\*Image Generation Prompt — Figure 15.13 Extinguishers\*\*  
> Precisely reproduce the original \*\*two-row instructional product comparison\*\* on white, boxed by a light grey outline. In the \*\*upper row\*\*, place a large printed black-and-white label at left headed \*\*“B.C.F.”\*\* and \*\*“COLOUR GREEN”\*\*, with the brand-like title \*\*“AIRLINE MODEL”\*\*, the central text \*\*“1.5 kg BCF”\*\*, \*\*“Stored pressure fire extinguisher”\*\*, \*\*“GENERAL PURPOSE”\*\*, and \*\*“FOR USE ON ELECTRICAL \& FLAMMABLE LIQUID FIRES”\*\*, plus small illustrated operating-instruction panels at the bottom. A thick black arrow points right to a tall \*\*green bottle with black trigger handle and safety catch\*\*. On the right edge show leader notes \*\*“SAFETY CATCH Raise before use”\*\*, \*\*“Red disc marked ‘FULL’ will drop off when extinguisher is operated”\*\*, \*\*“Raise before use”\*\*, and \*\*“Duration of discharge 15 seconds”\*\*. In the \*\*lower row\*\*, repeat the same label-to-bottle layout with a large label headed \*\*“WATER”\*\* and \*\*“COLOUR RED”\*\*, prominent \*\*“1½ lb WATER”\*\*, \*\*“Stored pressure fire extinguisher”\*\*, \*\*“NOT TO BE USED ON LIVE ELECTRICAL OR BURNING LIQUID OR GAS FIRES”\*\*, and right-side bright \*\*red bottle with black trigger\*\*; keep equivalent safety-catch, red-disc and \*\*15 seconds\*\* discharge annotations. Retain the arrows, black label borders, small instruction cartoons, top-versus-bottom layout, and exact caption \*\*“Figure 15.13 Extinguishers”\*\*.

### 9.1 Bromochlorodifluoromethane — BCF / Halon 1211

**BCF**, also called **Halon 1211**, is described as a very effective agent for **electrical fires** and **flammable-liquid fires**. The textbook lists bottles colored **signal red, purple, brown, or green**.

Its relevant properties are:

* **Colorless**, **non-corrosive**, and described as only **slightly toxic**.
* **Rapidly evaporates**, leaving **no residue**.
* Does not freeze or cause the **cold burns** associated with some very cold discharges.
* Does not normally damage fabrics, metals, or other contacted materials.
* Forms a substantial agent cloud that helps deny air to a fire, but its more important action is **chemical interference with combustion**.
* Is particularly effective at reducing the risk of **re-ignition (re-flash)** after the initial flames have been extinguished.

BCF and Halon 1301 were used in **HRD — High Rate Discharge** fire systems in some gas-turbine powerplant installations.

### 9.2 Bromotrifluoromethane — BTM / Halon 1301

**BTM** is also called **Halon 1301**. The source describes it as stored in **grey containers**, used in **fixed installations**, and having **very low toxicity**. Applications include:

* Auxiliary power units.
* Engine/powerplant installations.
* Cargo compartments.

Like Halon 1211, it interrupts combustion, but its discharge forms a **vapour-like spray** that is **less easy to aim** than the discharge from Halon 1211.

**Related halogenated compounds:** The textbook groups BCF and BTM among **halogenated hydrocarbons** and also mentions the family label **FREON**. It names **Halon 1011, 104, and 1201** as other examples. According to the source, **Halon 104** had ceased to be used because of toxicity, while **1011 and 1201** were not recommended for aircraft use.

### 9.3 Water and Water-Glycol Extinguishers

These are **portable** extinguishers stored in **red containers** in the textbook's examples. They are useful in passenger areas against fires involving familiar **domestic/solid combustible materials**.

* **Main fire-fighting mechanism:** Cooling the burning material.
* **Glycol additive:** Acts as antifreeze so the unit can function at temperatures down to **−20 °C**.
* **Restrictions:** **Do not use on energized electrical equipment or burning liquids**, as described in the source.

### 9.4 Dry Chemical / Dry Powder

The textbook describes dry powder in either a **blue container** or a **red container with a blue label**. The active powder may be **potassium bicarbonate**, a non-toxic fine powder resembling talcum powder.

The powder is effective against burning **flammable liquids, wood, fabric, and paper**, and the source particularly associates it with **wheel and brake fires**. The important advantage for hot wheels is that a powder cloud provides suppression **without aggressive cooling**, reducing the risk of brake/wheel distortion or a hazardous wheel explosion.

**Limitations:**

* It has **little or no cooling effect**.
* Powder released in a confined cabin can seriously **restrict visibility**.
* Deposits can render otherwise working **electrical equipment unusable**.
* The source says JAR-25 prohibited its use in crew or passenger compartments of **pressurized aircraft**.
* Some light aircraft may carry it, but the textbook recommends avoiding its use when possible because of the above effects.
* The textbook cautions against using this agent on **electrical fires**.

### 9.5 Carbon Dioxide — CO₂

Carbon dioxide is described in **black containers**, or in **red containers with a black label**. It is **non-corrosive** and operates mainly by **reducing the oxygen concentration** in the immediate fire zone.

The chapter notes several specific characteristics:

* It was widely used for many years, including because it leaves no damaging residue or corrosion.
* Incorrect use can cause **mental confusion or suffocation**.
* CO₂ storage needs a comparatively **strong pressure vessel** because its vapor pressure changes substantially with temperature.
* The source states that CO₂ extinguishers were **not permitted for use in aircraft** in the context it discusses.
* On the ground, it can extinguish various fires and is especially useful around **engines**, where avoiding damage from the agent is desirable.
* As an alternative to powder on a hot **wheel/brake fire**, the jet should be **directed alongside the wheel**, creating an enveloping CO₂ cloud, rather than sprayed directly onto the wheel.

### 9.6 Foam

**Foam** is associated primarily with fires involving **flammable liquids** and **propane**. Its blanket separates the fire from oxygen. In ground equipment, the source describes foam containers as **cream**, or **red with a cream label**.

### 9.7 Water

Plain **water** works against **combustible solid materials** chiefly because it **cools** the burning substance. The textbook explicitly excludes its use on **electrical, fuel, and brake fires**.

### 9.8 Sand

**Sand** is useful for containing **burning metals**, notably **magnesium and titanium**. The chapter points out that introducing liquids to some metal fires can **make the situation worse**.

### 9.9 Ground-Use Agents and Summary

For ground operations the source lists **dry powder, foam, water, carbon dioxide, BCF, and sand** as available choices. The important principle is not simply selecting the extinguisher that is nearest: it must be appropriate to the **fuel/material burning**, the equipment around the fire, and the foreseeable hazards created by the agent.

|Agent|Principal source-described application|Main limitation or caution|
|-|-|-|
|BCF / Halon 1211|Electrical and flammable-liquid fires; certain high-rate systems|Historical agent and carriage information; use aircraft-approved equipment.|
|BTM / Halon 1301|Fixed systems for engines, APUs, cargo compartments|Vapour discharge is harder to direct.|
|Water / water-glycol|Cabin combustible solids|Not for electrical or burning liquid fires; glycol permits −20 °C operation.|
|Dry chemical|Wheels/brakes; selected solid and liquid fires|Visibility contamination, electrical damage, no cooling effect.|
|CO₂|Ground engine/wheel fire suppression|Suffocation risk; avoid direct cold jet onto hot wheel.|
|Foam|Flammable liquid and propane fires|Use appropriate approved agent and method.|
|Water|Ordinary combustibles|Not for fuel, electrical, or brake fires.|
|Sand|Burning magnesium/titanium|Intended to contain metal fire, not make liquid contact.|

\---

## 10\. Hand-Held Fire Extinguishers — Carriage Quantities

Under the **historical regulatory extract reproduced in the textbook**, the minimum number of portable extinguishers in passenger compartments depends on the aircraft's approved seating capacity:

|Maximum approved passenger seating configuration|Minimum extinguishers in passenger compartment(s)|
|-|-:|
|7–30|1|
|31–60|2|
|61–200|3|
|201–300|4|
|301–400|5|
|401–500|6|
|501–600|7|
|601 or more|8|

The older explanatory paragraph on the subject presents the last band as **601–700 = 8**; the formal **EU-OPS table later in the same chapter uses “601 or more = 8.”** For study of the reproduced regulation, use the formal table's wording.

**Additional agent distribution requirements in the quoted extract:**

* An aircraft with **31–60 passenger seats** needs **at least one** of its passenger-compartment extinguishers to contain **Halon 1211 or an equivalent**.
* With **61 seats or more**, **at least two** passenger-compartment extinguishers must contain **Halon 1211 or an equivalent**.
* The flight deck must have **at least one additional readily accessible Halon 1211 (or equivalent) extinguisher** for the crew.
* When **two or more** extinguishers are required in the passenger compartment, they must be **evenly distributed**.

The complete EU-OPS extract also addresses **galley** and **accessible cargo** locations, covered in Section 13.

\---

## 11\. Fixed, Portable, and Mixed Fire Systems

The textbook groups aircraft extinguishing arrangements into **three types**.

### 11.1 Fixed Systems

An installed extinguisher bottle is secured to the aircraft structure and connected to permanent **distribution lines and control mechanisms**. Fixed systems are principally used to protect:

* Engines/powerplants.
* Auxiliary power units.

In larger aircraft, installations can also protect **landing-gear bays** and **baggage compartments**.

### 11.2 Portable Systems

These consist of **hand-operated fire extinguishers** available to the crew. They are intended for fires that crew members can detect, approach, and fight in locations such as the **flight deck** or **passenger cabin**.

### 11.3 Mixed Systems

Certain baggage and service-area installations combine permanent **pipes and spray rings** with handheld or fixed portable bottles. The agent is released through **special adaptor connections** into the distribution network. This combines a permanently installed delivery route with a separately operated agent source.

\---

## 12\. Fire Compartments: JAR-25 Classification

Aircraft compartments are classified according to the likelihood that a crew member can see and access a fire, and the degree of installed detection and suppression required.

The source describes the **cockpit and passenger cabin** as **Class A** compartments because crew can normally see, reach, and fight a fire there. It describes the **engine** as a **Class C** fire zone with dedicated fire detection/warning. Cargo and baggage compartments may fall into **Classes A through E**. A and B provide access for crew intervention; C and the former D do not rely on direct access to the source of fire. **Class E** is associated with aircraft used **only for cargo transport**.

### 12.1 Class A

A Class A area meets all three conditions:

* **Smoke can be recognized visually.**
* Crew members can **reach the area while airborne**.
* A **fire extinguisher is available** for use.

### 12.2 Class B — Accessible Cargo/Baggage

A Class B compartment must provide:

1. Enough in-flight access for a crew member to **move the contents by hand** and direct a handheld extinguisher effectively into every part of the space.
2. Access and protection arrangements that prevent **dangerous levels of smoke, flames, or extinguishing agent** from entering occupied crew or passenger compartments during intervention.
3. A **separate approved smoke/fire detector system** delivering a warning to the pilot's station.
4. **Readily available handheld extinguishers** for use throughout these compartments.

### 12.3 Class C — Inaccessible Compartment with Built-In Extinguishing

The installation requires:

* An independent **smoke/fire detector** reporting to the pilot or flight engineer.
* An approved **built-in extinguishing system**, operable from the pilot/flight-engineer station.
* Protection against hazardous **smoke, flame, and other noxious gases** entering occupied spaces.
* **Ventilation and airflow control** sufficient to allow the extinguishing agent to remain effective against anticipated fires.

### 12.4 Class D

The source explicitly notes that **Class D is no longer used**.

### 12.5 Class E — Cargo-Only Aircraft

A Class E compartment must have:

* A **separate approved smoke or fire detector**.
* A means to **shut off ventilating air** to or within the space, with controls accessible from the cockpit.
* Protection against hazardous quantities of **smoke, flame, or noxious gases** entering the cockpit.
* Required **crew emergency exits accessible** under all cargo loading arrangements.

### 12.6 Classification Comparison

|Class|Crew access / distinguishing feature|Detection / suppression|
|-|-|-|
|A|Fire can be seen and area reached in flight|Visual detection and available extinguisher.|
|B|Cargo accessible for effective handheld firefighting|Approved smoke/fire detector and portable extinguishers.|
|C|Crew cannot directly fight the fire at its source|Separate detection, built-in suppression, containment, controlled ventilation.|
|D|Discontinued category|Not used.|
|E|Cargo-only aircraft compartment|Detection, shut-off ventilation, cockpit protection, crew-exit access.|

\---

## 13\. Historical EU-OPS Subpart K Extracts

The textbook concludes with selected material from **EU-OPS 1, Subpart K**, covering crew protective breathing equipment and handheld fire extinguishers. The extract is presented as a **regulatory reference from the textbook's publication period** and the book itself warns that the rules can be amended.

### 13.1 OPS 1.780 — Crew Protective Breathing Equipment (PBE)

**Scope:** The cited PBE requirement applies to an operator of:

* A **pressurized aircraft**; or
* An **unpressurized aircraft** with maximum certificated take-off mass **greater than 5,700 kg**; or
* An **unpressurized aircraft** with maximum approved passenger seating **exceeding 19**.

The excerpt establishes the following:

**Flight-crew protection**

* Equipment must protect each required flight-crew member's **eyes, nose, and mouth** while performing cockpit duties.
* A breathing/oxygen supply of **not less than 15 minutes** must be available for each such crew member.
* The PBE supply may be taken from the **supplemental-oxygen arrangements** referred to in **OPS 1.770(b)(1)** or **OPS 1.775(b)(1)**.
* If the flight crew consists of **more than one member** and **no cabin crew** are carried, an additional **portable PBE** is required for **one flight-crew member**, again supplying breathing gas for **at least 15 minutes**.

**Cabin-crew protection**

* Sufficient portable PBE must be available to protect the eyes, nose, and mouth of **all required cabin-crew members**.
* Each applicable breathing-gas supply must provide **at least 15 minutes**.

**Location and access**

* Flight-crew PBE must be **conveniently positioned on the flight deck**, immediately available at each crew member's assigned working position.
* Cabin-crew PBE must be located **adjacent to every required cabin-crew duty station**.
* An **extra readily accessible portable PBE** must be positioned at or beside the handheld fire extinguishers required by **OPS 1.790(c) and (d)**.
* If one of those extinguishers is **inside a cargo compartment**, its corresponding PBE must be placed **outside, next to the entrance**.

**Communication**

* Wearing or using PBE must **not prevent communications** required under the referenced **OPS 1.685, 1.690, 1.810, and 1.850** provisions.

### 13.2 OPS 1.790 — Hand Fire Extinguishers

The extract requires appropriate portable firefighting equipment for relevant **flight-crew, passenger, galley, and cargo/baggage** areas.

**Agent suitability and toxicity**

* The agent type and quantity must correspond to **fire hazards expected in that compartment**.
* In locations occupied by people, selecting the agent must also **minimize toxic-gas exposure**.

**Flight deck**

* At least **one conveniently located handheld extinguisher** containing **Halon 1211 (bromochlorodifluoromethane)** or an **equivalent** must be available for flight-crew use.

**Galleys**

* Each galley **not situated on the main passenger deck** must have at least **one extinguisher in it or conveniently accessible nearby**.

**Cargo/baggage**

* At least **one readily accessible handheld extinguisher** must be available for each **Class A or Class B cargo/baggage compartment**.
* The same provision covers each **Class E cargo compartment accessible to crew members during flight**.

**Passenger-compartment quantity**

The OPS 1.790 table specifies the eight seating bands and minimum quantities reproduced in **Section 10**. When more than one extinguisher is required, they must be **evenly distributed** through the passenger cabin.

**Halon 1211 / equivalent minimum numbers**

* **31–60 passenger seats:** at least **one** of the required passenger-compartment extinguishers contains Halon 1211 or equivalent.
* **61 or more passenger seats:** at least **two** contain Halon 1211 or equivalent.

**Source identification:** The reproduced excerpt is from the **Official Journal of the European Union, 20 September 2008, L 254/150**. This material is a study reference to that historical publication, not a representation of current EASA/UK/ICAO requirements.

\---

## 14\. Quick Comparison of Fire-Protection Decisions

|Situation|Key textbook concept|
|-|-|
|Heat causes a melting-link detector to operate|Fusible element permits contacts to close; indication does not automatically clear.|
|Differential expansion detector cools after warning|Contacts separate; indication resets.|
|Fire-wire resistive sensor becomes hot|Insulation resistance falls, leakage current rises.|
|Fire-wire capacitive sensor becomes hot|Capacitance and monitored feedback increase.|
|Gas-filled sensing tube becomes hot|Gas pressure rises and activates the fire switch.|
|Gas-filled sensing tube leaks|Pressure falls and a loop fault is signaled.|
|Both fire loops healthy|Dual-loop **AND** logic is used in the depicted arrangement.|
|One loop unavailable|Depicted arrangement can continue with **OR** logic.|
|Bottle fires as commanded|Squib releases agent; DISCH indication monitors bottle discharge.|
|Bottle vents because of overpressure|Gauge may read zero; green external disc may expose red.|
|APU fire/overspeed/oil failure/overheat|Automatic shutdown is expected in the described system.|
|Lavatory waste-bin fire|Fusible element melts and directs bottle contents into spray ring.|
|Wheel or brake fire|Source favors dry powder for low cooling effect and warns against direct CO₂ jet onto wheel.|
|Cargo Class C|Installed detection and an approved built-in extinguisher system.|

\---

## 15\. Diagnostic Self-Test Questions

### Detection Fundamentals

**1. What three aircraft locations are specifically identified as needing fire detection/protection arrangements?**  
**Answer:** Engine compartments, APU installations, and main wheel wells.

**2. What is meant by a designated fire zone?**  
**Answer:** An area with a foreseeable fire hazard due to possible failure or leakage of installed equipment or components.

**3. What three elements make up the fire triangle?**  
**Answer:** Heat, fuel, and oxygen.

**4. Why are fireproof bulkheads incorporated around an engine or APU fire zone?**  
**Answer:** To restrict the spread of fire into adjacent areas.

**5. Why does a melting-link detector continue indicating fire after the temperature falls?**  
**Answer:** Its fusible separator has melted, allowing the electrical contacts to remain closed rather than reopening automatically.

**6. What physical principle is used in a differential-expansion detector?**  
**Answer:** Two different materials expand at different rates, operating the detector's contacts as temperature rises.

**7. Where may differential-expansion detectors provide an Internal Engine Overheat warning?**  
**Answer:** At engine cooling-air outlets.

**8. Why may differential-expansion detectors include a time delay?**  
**Answer:** To reduce nuisance warnings caused by vibration.

**9. What happens to the insulating resistance of a resistive fire wire when heated?**  
**Answer:** It decreases, allowing increased leakage current between the central electrode and the outer sheath.

**10. What measured quantity rises in a capacitive fire-wire detector when heated?**  
**Answer:** Capacitance, and the resulting monitored electrical feedback associated with it.

**11. What electrical supply method is specified for polarizing the capacitive element?**  
**Answer:** Half-wave rectified AC from the system's control unit.

**12. How does a gas-filled detector produce a fire indication?**  
**Answer:** Heating releases gas from its core, raising internal pressure and operating a pressure switch.

**13. How can that same gas-filled system detect a damaged sensing tube?**  
**Answer:** A loss of gas pressure is sensed and reported as a loop fault.

**14. What is the normal role of AND logic in a dual fire-detection loop?**  
**Answer:** It requires both healthy loops to detect the condition before issuing a fire warning.

**15. What happens to the depicted system logic if one loop is inoperative?**  
**Answer:** It can use OR logic so the remaining operational loop can still provide fire detection.

**16. Why is a fire test performed before flight?**  
**Answer:** To verify the response/continuity of the detection and flight-deck warning circuits.

### Fire Warnings and Suppression

**17. Name three possible cockpit engine-fire warning indications.**  
**Answer:** A chime/bell/klaxon, a master fire warning caption, and a steady red engine FIRE light.

**18. What is the general sequence after an engine fire warning?**  
**Answer:** Acknowledge/silence the warning where appropriate, isolate the affected engine/services, then release extinguishing agent according to the aircraft checklist.

**19. What does a squib do in the described extinguisher system?**  
**Answer:** Its electrically fired cartridge releases the bottle's extinguishing agent into the distribution piping.

**20. What does the DISCH indication identify?**  
**Answer:** That the corresponding fire bottle has discharged, as sensed by the monitored pressure/discharge system.

**21. How many extinguishing discharges does the textbook cite for each engine?**  
**Answer:** Two, citing CS-25.1195(c).

**22. In the textbook's sample procedure, how long is the fire handle held at each selected discharge limit?**  
**Answer:** At least 1 second.

**23. After how long does the sample procedure check for an unchanged illuminated fire warning before using the second bottle?**  
**Answer:** 30 seconds.

**24. How may a bottle's thermal overpressure discharge be indicated externally?**  
**Answer:** A green rupture disc is ejected to expose a red disc; bottle pressure may read zero.

**25. Which four conditions can automatically shut down the described APU?**  
**Answer:** Fire, oil pressure failure, overspeed, and overheat.

**26. What automatically releases agent into a lavatory waste-paper receptacle?**  
**Answer:** Heat melts the fire bottle's fusible plug, allowing agent to enter the spray ring.

**27. At what passenger capacity does the textbook say automatic lavatory waste-bin protection is required?**  
**Answer:** 20 passengers or more.

### Agents, Compartments, and Regulation

**28. What are the alternative designations for BCF and BTM?**  
**Answer:** BCF is Halon 1211; BTM is Halon 1301.

**29. Why is dry powder particularly relevant to aircraft wheel/brake fires?**  
**Answer:** It suppresses fire without rapid cooling that could contribute to wheel explosion or component distortion.

**30. What is the specific CO₂ application precaution for a hot wheel?**  
**Answer:** Direct the agent alongside the wheel to envelope it in a CO₂ cloud, not directly onto the wheel.

**31. Which agent is suitable for containment of magnesium or titanium fires in this textbook?**  
**Answer:** Sand.

**32. What is the core difference between cargo compartment Classes B and C?**  
**Answer:** Class B can be reached and fought with a handheld extinguisher; Class C relies on installed detection and built-in suppression.

**33. Which former cargo compartment category is no longer used?**  
**Answer:** Class D.

**34. How many passenger-compartment extinguishers are required for 401–500 approved passenger seats in the quoted EU-OPS table?**  
**Answer:** Six.

**35. How many are required for 601 or more passenger seats in that table?**  
**Answer:** Eight.

**36. What is the minimum breathing-gas duration in the quoted OPS 1.780 PBE requirements?**  
**Answer:** Not less than 15 minutes.

**37. Where must an additional PBE be positioned if its associated handheld extinguisher is located inside a cargo compartment?**  
**Answer:** Outside the cargo compartment, near its entrance.

**38. According to OPS 1.790, how many Halon 1211 or equivalent extinguishers are required in the passenger cabin for an aircraft configured with 61 or more seats?**  
**Answer:** At least two of the required passenger-compartment extinguishers.

