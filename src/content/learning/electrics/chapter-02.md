# Chapter 2: DC Electrics — Switches

## 1\. Switching and Control in Aircraft Electrical Systems

Aircraft electrical circuits need components that can **start, interrupt, or direct an electrical function** when required. **Switches** perform these tasks directly, while **relays** can perform switching in response to a separate control signal. The selection of a switching device depends on the operating requirement: some functions are controlled manually, whereas others respond automatically to a change in position, temperature, proximity, elapsed time, or rotational speed.

This chapter examines the switching arrangements used for these different purposes, beginning with flight-deck controls and moving on to sensors that operate without continuous pilot input.

## 2\. Toggle Switches

A **toggle switch** is a familiar manually operated control, especially on older aircraft. Moving its lever changes the state of internal contacts, which either connect or isolate parts of an electrical circuit. The arrangement of those contacts determines what the switch can select.

Two common forms are:

* **Two-position toggle:** The lever selects between two states, normally **ON** and **OFF**. One position completes the intended connection; the other opens it.
* **Multi-position toggle:** More than two selections can be provided. A typical example has a **centre OFF** position with an alternative selection in each direction. Some versions are **spring-centred**, so the lever must be held against the spring to keep a temporary selection active; releasing it returns the lever to its neutral position.

These arrangements give a pilot either a persistent selection or a short-duration command, depending on the switch design.

### Figure 2.1 — Image-Generation Prompt

> \*\*Recreate Figure 2.1 as a precise technical illustration of two toggle-switch configurations, arranged side by side in one thin rectangular border on a white background.\*\* Use fine grey outlines for the toggle levers and housings, black circuit lines, small hollow circular electrical terminals, and restrained textbook styling. \*\*Left panel:\*\* label the lever positions `OFF` and `ON` at the top, show a slightly left-leaning toggle above a two-terminal switch body and a slanted open-contact line; mark the incoming left-side supply `28 V` and the right-hand output `ON`. Beneath the circuit print `TWO POSITION`. \*\*Right panel:\*\* show an upright spring-centred toggle with three labels along the top, `OUT`, `OFF`, `IN`; depict one common input terminal on the left marked `28 V` and two separately drawn right-hand contacts, each terminating in a line, marked `IN` (upper) and `OUT` (lower). Beneath, print `THREE POSITION`. Preserve the position labels, number of terminals, circuit orientation, spacing, and simple black/grey diagram appearance; do not add components or connections.

## 3\. Illuminated Pushbutton Switches (Switch Lights)

On many more modern flight decks, **switch lights** perform work formerly assigned to toggle switches. A switch light combines a **push-operated electrical switch** with a **lighted indication** within the same unit. The indication is not merely decorative: it can show the chosen condition or draw attention to a condition that calls for switch operation.

### 3.1 Momentary-action switch lights

A **momentary** switch light provides its selected function **only for as long as the button is depressed**. The action follows a simple sequence:

1. Press and hold the button to make the selection.
2. Maintain pressure while the function is required.
3. Release the button to end the selection.

This is useful where an electrical command is intended to exist only temporarily.

### 3.2 Alternate-action switch lights

An **alternate-action** switch light remains in the selected state after the pilot lets go:

1. Press and release once to **activate** the function.
2. Press and release again to **deactivate** it.

The difference between the two types is therefore what happens **after release**, not whether a pushbutton is used.

### 3.3 Indications built into the switch

The illuminated lens may **confirm the selected switch position** or display a **warning or condition requiring a selection**. The illustration also shows a switch-light arrangement with a **flow-bar indication**, connecting the pushbutton's function with a clear visual status cue.

### Figure 2.2 — Image-Generation Prompt

> \*\*Reconstruct Figure 2.2 as the original compact cockpit-panel detail with two circular gauges and several rectangular illuminated switch lights, inside a narrow light-grey rectangular outline, on white.\*\* At upper left, draw a circular gauge titled `IDG oil temp`, with its markings including `150°C`, `100`, `50`, `20`, `0`, a black needle, and small yellow highlighted segments; put `IDG` below/right of the gauge. Below it, show a guarded yellow square pushbutton reading `OVHT` on its top line and `PRESS` on its bottom line, and identify it using the exact leader text `GUARDED MOMENTARY SWITCH LIGHT`. Further down, depict a small rectangular flow-bar switch with a black downward arrow, a nearby vertical marking `CLOSE`, and the status text `TRIP`. Adjacent to it, place the yellow `GENERATOR FIELD` switch displaying `OPEN` above `DIFF`, with a leader reading `ALTERNATE SWITCH LIGHT WITH FLOWBAR INDICATOR`. At the bottom draw another circular black-and-white gauge labelled `KW` and `KVAR`, with a pointer and the numbers `50`, `100`, `0`, `-20`. Keep the relationship of the IDG temperature gauge, warning switch, generator-field switch, flow bar, and lower electrical gauge faithful to the original; preserve capitalization and line breaks of each readable label and avoid adding unrelated avionics instruments.

## 4\. Guarded Switches

An important selection may need protection against being operated by accident. A **guard** can therefore be fitted over either a conventional toggle or a switch light. It adds a physical obstacle to casual or unintentional activation while leaving the correct selection available when needed.

The chapter identifies **generator-disconnect controls** and the **fuel-dump master** as examples of functions for which guarding is appropriate. The guarded switch-light arrangement appears in Figure 2.2.

## 5\. Microswitches

A **microswitch** is a position-sensing switch whose contacts change state with only a **very small movement** of its operating mechanism. Its name describes this limited travel between the **make** (contact-closed) and **break** (contact-open) conditions.

Aircraft applications include checking whether a **door is open or closed** or whether another moving component has reached a prescribed position. Once actuated, the microswitch may:

* Send an **indication to the flight deck**.
* Operate a **relay**, allowing a subsequent action in a sequence of events.

Microswitches continue to have applications in modern aircraft, although **proximity detectors** have replaced them in many position-detection installations.

### Figure 2.3 Microswitch — Image-Generation Prompt

> \*\*Draw an accurate black-and-white cutaway schematic of a rectangular microswitch, like the original Figure 2.3 Microswitch.\*\* Place the switch inside a bold black rectangular housing with a white interior. From the top centre, a small vertical button/plunger enters through the housing and presses a gently curved spring contact. Add the exact labels and arrows: `OPERATING PLUNGER` above the central vertical actuator; `MOVING CONTACT` toward the upper-right, pointing diagonally down-left to the spring strip; `COMMON TERMINAL` to the left of the housing, pointing to the common contact on the left side; and `FIXED TERMINALS` at lower-right, with an arrow pointing toward two separate terminals on the right side. Show one external circular connection at the left and two stacked circular connections at the right. The long flexible contact reaches from the left connection toward the two possible right contacts; include solid/dashed curved contact positions as shown. Keep the schematic monochrome, geometrically simple, with correct terminal count and no unnecessary markings.

## 6\. Bimetallic (Thermal) Switches

A **bimetallic switch**, also called a **thermal switch**, responds to **temperature** rather than to a manually applied command or a moving object's position. When the temperature reaches the value at which the device is set to operate, the switch changes the associated circuit condition.

Depending on the installation, that action can:

* Produce a **warning or other indication** for the crew.
* **Connect or disconnect** an electrical circuit automatically.

Examples given in the chapter are **fire-detection circuits**, **battery-overheat switching**, and **oil-temperature warning lights**. The common principle is a switch decision triggered by reaching a particular temperature.

## 7\. Proximity Detectors: General Principles

A **proximity detector** responds to the **presence of a nearby material**. Unlike a microswitch, it does not necessarily depend on the moving object pushing an operating plunger. Instead, the sensor produces an **electrical or electronic response** that can be used to control a **switch, relay, or transistor**.

Three principal detector families are discussed:

|Detector type|What produces the sensing change|Materials identified in the chapter|
|-|-|-|
|**Inductive**|Change in a coil's inductance|Ferromagnetic metallic targets|
|**Capacitive**|Change in electrical capacitance|Metallic or non-metallic materials, including solids and liquids|
|**Magnetic**|Change in magnetic flux causing an induced EMF|Moving ferrous objects, such as steel gear teeth|

The **inductive and magnetic** approaches require a suitable metal target; the **capacitive** approach can also respond to non-metallic substances.

## 8\. Inductive Proximity Detectors

An inductive detector contains a **coil**. As a **ferromagnetic target** is brought sufficiently close, the coil's **inductance changes**. The system interprets that change as evidence that the target is present.

### 8.1 Landing-gear position monitoring

The chapter describes the use of inductive proximity sensing as a replacement for mechanical microswitches in a **landing-gear system**. A typical arrangement has three distinct elements:

1. **Printed circuit card:** Located in the **landing-gear accessory unit** and associated with processing or control.
2. **Sensor:** Mounted on the relevant landing-gear structure.
3. **Actuator or target:** Installed on a nearby part of the gear so that its position can be detected by the sensor.

The name **actuator** does not mean that it must physically press the detector. In this arrangement, the target **comes near the sensor without contacting it**.

### 8.2 Construction and operating advantage

The proximity sensor is described as **hermetically sealed**. Because it detects a nearby target without mechanical contact, and because the sealed construction protects its interior, the textbook identifies it as **highly reliable and unaffected by atmospheric conditions**.

The distinction to remember is between a mechanically operated **microswitch** and a **non-contact proximity sensor**: both can provide position information, but they detect the required condition differently.

### Figure 2.4 — Image-Generation Prompt

> \*\*Recreate Figure 2.4 as one composite, three-part proximity-sensor illustration on white inside a thin grey border.\*\* Across the \*\*upper left\*\*, show a black cylindrical threaded proximity sensing head at a diagonal, its detection face tan/orange and its black cable leaving the bottom-left. Across the \*\*upper right\*\*, show a rectangular grey electronic module with two metal mounting ears/bolt holes, a dark top face with a small tan textured patch, several short lines of tiny technical markings, and four emerging insulated wires in blue, red, yellow/black, and blue or dark colours. \*\*Below both hardware views\*\*, show a straightforward electrical schematic: a grey vertical rectangle labelled `PROXIMITY SENSOR`; a coil drawn vertically inside its right half, a small zigzag resistor below it, two slim vertical dark lines representing the nearby metal target at the far right, and three long horizontal conductors extending left from the sensor — red upper, yellow middle, blue lower. Put a tall curly brace around the three wires at left with the exact stacked label `TO PROXIMITY SWITCH`. Preserve the original placement of photographed/illustrated sensor hardware above the coloured wire diagram, and include all component relationships without adding extra objects or captions.

## 9\. Capacitive Proximity Detectors

A capacitive sensor detects an object by registering a **change in capacitance** when material approaches its sensing area. Because the sensing principle is not restricted to ferromagnetic targets, capacitive detection can be applied to a wider variety of substances.

The chapter identifies the following capabilities:

* Detection of **ferrous** metal objects.
* Detection of **non-ferrous** metal objects.
* Detection of **non-metallic solids and liquids**.
* Indication of **high or low liquid level** in an aircraft **hydraulic system** or **fuel system**.

This versatility is the main comparison point with the inductive and magnetic detector types.

## 10\. Magnetic Proximity Detectors

A magnetic detector relies on **electromagnetic induction**. When a coil is placed in a magnetic field, **a change in the magnetic flux passing through it induces an electromotive force (EMF)**. The **faster the flux changes**, the greater the induced EMF, according to the relationship described in the chapter.

### 10.1 Basic magnet-and-coil arrangement

One simple arrangement consists of a **coil wound around a bar magnet**, with a pole of the magnet positioned close to a **ferrous object**. Movement of that object alters the magnetic flux associated with the magnet and coil. The resulting flux change creates an electrical response in the winding.

If several ferrous objects pass successively, the detector produces **a sequence of electrical pulses** rather than a single event.

### 10.2 Detecting rotating gear teeth

A typical application uses a **mild-steel gear wheel**. Each tooth behaves as a ferrous target as it passes the detector.

* The detector is fitted **radially**, near the **outer edge of the gear wheel**.
* Each passing tooth changes the magnetic conditions at the detector.
* Successive teeth create successive induced pulses.
* The **output pulse frequency** equals the **frequency with which teeth pass the detector**.

This is the essential relationship: the signal's frequency represents the rate of repeated tooth passages past the sensing head.

### Figure 2.5 — Image-Generation Prompt

> \*\*Rebuild Figure 2.5 as a horizontal magnetic pickup beside a rotating toothed gear, in a bordered, predominantly white technical diagram.\*\* At left centre, use a medium-grey horizontal rectangular block labelled exactly `MAGNET`. At its right end place a narrower assembly with \*\*two yellow winding blocks\*\* labelled `COIL` (one above and one below), adjoining a light-grey rectangular element labelled `POLE PIECE`. Surround the magnet with multiple red curved, elongated magnetic-flux loops above and below, drawn symmetrically and passing toward the pickup tip. At far right place a large black-outline segment of a toothed wheel, with a tooth pointing toward the pole piece; arrange the word `GEAR` vertically near the wheel edge. Keep the perspective flat and diagrammatic, preserve the yellow coils, red magnetic-flux paths, relative spacing of magnet/pole piece/toothed wheel, and the exact internal labels. Do not add a voltage graph or extra circuitry.

### 10.3 An example of landing-gear proximity-sensor placement

The book also illustrates a physical **landing-gear mechanism** carrying sensors and nearby target pieces. The drawing distinguishes sensing points for different mechanical positions and shows the surrounding linkage and cable routing. It reinforces that a proximity-sensing installation includes both a **mounted detector** and a **separate target** attached to the moving mechanism.

### Figure 2.6 — Image-Generation Prompt

> \*\*Reproduce Figure 2.6 as a detailed oblique cutaway engineering illustration of a landing-gear linkage and proximity-sensing installation.\*\* Use thin black engineering outlines and mostly grey/white mechanical parts, with select assemblies highlighted: a \*\*red upper sensor or target assembly\*\* near the top-left labelled `UPLOCK SENSOR`; one red-and-black angled target near the mid-left labelled `ACTUATOR (TARGET)`; a \*\*yellow central target plate\*\* with a nearby second label `ACTUATOR (TARGET)`; and a \*\*yellow lower sensing arrangement\*\* labelled `DOWNLOCK SENSOR`. Show the complex pivoting metallic links and rods across the bottom and right, a supporting bracket on the upper right, curved yellow wiring near the central mechanism, and a blue segmented cable running from the right-hand side labelled `TELEFLEX CABLE`. Include directional leader arrows for all five original text annotations, keep the same rough mechanical spatial arrangement and color-coded highlights, and use no invented system labels. Put the entire illustration in a thin rectangular border on a plain white background.

## 11\. Time Switches and Time-Delay Relays

A **time switch** or **timed relay** does not necessarily respond immediately when initiated. Instead, its job is to produce a switching action **after a specified interval** has passed.

Initiation may be **electrical** or **mechanical**. Once the timing requirement has been satisfied, the device activates the relevant circuit.

**Example from the chapter:** An aircraft's **auxiliary power unit (APU) air-intake door** closes **30 seconds after the APU has shut down**. The delayed door action illustrates why a switching command sometimes needs an intentional wait rather than immediate operation.

## 12\. Centrifugal Switches

A **centrifugal switch** responds to a change in a machine's **rotational speed**, normally expressed as **revolutions per minute (RPM)**.

The switch can be configured so that an electrical circuit is **connected or disconnected** as the speed **increases or decreases** past the relevant operating condition.

A chapter example is the **starter-motor cut-out switch**: it uses rotational-speed information to determine when the starter circuit should be deactivated.

The main contrast with a time switch is the trigger: a **time switch** responds to an elapsed interval, while a **centrifugal switch** responds to **RPM**.

\---

## 13\. Quick Comparison for Revision

|Device|Primary trigger or manual action|Typical function described|
|-|-|-|
|**Toggle switch**|Pilot moves lever between positions|Manual on/off or multi-position circuit selection|
|**Momentary switch light**|Button kept depressed|Temporary selection with an integrated indication|
|**Alternate-action switch light**|Successive press-and-release actions|Latching on/off selection with indication|
|**Guarded switch**|Deliberate access past protective guard|Prevent accidental selection of important functions|
|**Microswitch**|Small physical operating movement|Detect door or component position; initiate an indication or relay sequence|
|**Bimetallic switch**|Reaching a temperature threshold|Fire, battery-overheat, or oil-temperature indication/control|
|**Inductive detector**|Ferromagnetic target alters coil inductance|Non-contact landing-gear position sensing|
|**Capacitive detector**|Nearby matter changes capacitance|Solid/liquid detection or fuel/hydraulic level indication|
|**Magnetic detector**|Moving ferrous object changes magnetic flux|Pulse production as gear teeth pass the sensor|
|**Time switch / relay**|Preset time interval elapses|Delayed APU air-intake door closure|
|**Centrifugal switch**|Rotation reaches relevant RPM condition|Starter-motor cut-out|

\---

## 14\. Diagnostic Self-Test Questions

**1. What two kinds of electrical devices does the chapter identify as means of initiating and controlling aircraft circuits?**  
**Answer:** Switches and relays.

**2. What makes a two-position toggle different from a multi-position toggle?**  
**Answer:** A two-position toggle selects between two states, such as ON and OFF; a multi-position toggle offers additional selections, potentially with a spring-loaded centre or OFF position.

**3. What happens to a spring-centred toggle after the pilot stops holding it?**  
**Answer:** It returns to its centre or neutral position.

**4. Which two features are combined in a switch light?**  
**Answer:** A push-operated switch and an integral indication light.

**5. How does a momentary-action switch light behave after it is released?**  
**Answer:** The temporary selection ends when the button is released.

**6. How do you deactivate an alternate-action switch light after switching it on?**  
**Answer:** Press and release it a second time.

**7. What can the switch-light lens indicate?**  
**Answer:** The selected position or a warning/condition that calls for a switch selection.

**8. Why are some toggle switches and switch lights guarded?**  
**Answer:** To reduce the risk of accidental operation of an important function.

**9. Give two examples of controls named as candidates for guarding.**  
**Answer:** Generator disconnects and the fuel-dump master.

**10. Why is a microswitch called a microswitch?**  
**Answer:** Its switching contacts change between make and break with only a very small operating movement.

**11. Name two possible uses of a microswitch output.**  
**Answer:** Producing a flight-deck indication and operating a relay for a sequenced action.

**12. What determines the operation of a bimetallic switch?**  
**Answer:** The temperature reaching the switch's set operating value.

**13. What three main proximity-detector types are discussed?**  
**Answer:** Inductive, capacitive and magnetic.

**14. Which detector type senses a ferromagnetic target through a change in a coil's inductance?**  
**Answer:** An inductive proximity detector.

**15. Name the three main parts of the landing-gear inductive proximity-switch arrangement.**  
**Answer:** A printed circuit card in the landing-gear accessory unit, a mounted sensor, and its adjacent actuator/target.

**16. Does the target need to touch the proximity sensor?**  
**Answer:** No. Detection occurs by proximity without physical contact.

**17. Why does the chapter describe the landing-gear proximity sensor as reliable?**  
**Answer:** It is hermetically sealed, does not require contact with the target, and is described as unaffected by atmospheric conditions.

**18. What property changes in a capacitive proximity detector?**  
**Answer:** Capacitance changes as material approaches the sensor.

**19. Give two aircraft-liquid applications for capacitive sensing.**  
**Answer:** Detecting high or low liquid levels in hydraulic and fuel systems.

**20. What produces the output of a magnetic detector?**  
**Answer:** Movement of a ferrous object changes magnetic flux, inducing an EMF in the detector coil.

**21. How does the output signal relate to the teeth on a passing steel gear wheel?**  
**Answer:** Its pulse frequency is equal to the rate at which the gear teeth pass the detector.

**22. Which switching device could delay APU air-intake door closure until 30 seconds after shutdown?**  
**Answer:** A time switch or time-delay relay.

**23. What operating variable determines the action of a centrifugal switch?**  
**Answer:** Rotational speed (RPM).

**24. What starter-related application does the chapter give for centrifugal switching?**  
**Answer:** Starter-motor cut-out.



