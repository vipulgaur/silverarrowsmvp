# Chapter 14: Smoke Detection

## 1\. Why Aircraft Require Smoke Detection

Some parts of an aircraft cannot be watched continuously by the flight or cabin crew. Important examples include **cargo compartments** and **electrical or equipment bays**. Because smoke may develop out of sight, these locations are equipped with detection systems that can communicate an abnormal condition to the crew remotely.

A typical arrangement uses detectors distributed throughout the relevant compartment or bay. The system is designed to provide:

* **Remote indication:** A smoke warning is transmitted to the flight deck rather than requiring someone to see the smoke directly.
* **Crew-initiated testing:** The installation can be checked from the flight deck to confirm that its warning function operates.
* **Reset and verification:** Following an indication, the system can be reset so the warning can be checked or confirmed.

The precise installation depends on which aircraft compartment is being protected. Smoke and flame detectors do not all respond to the same physical change: some respond to **light**, while others detect changes in the electrical behavior of air or sensing materials.

### Figure 14.1 Location of smoke detectors

> \*\*Image Generation Prompt — Figure 14.1 Location of smoke detectors\*\*  
> Recreate the original technical training diagram as a \*\*three-quarter perspective, cutaway passenger jet\*\*, viewed from above its \*\*front-left quarter\*\*, with the nose at the lower-left, swept wings spread to the sides, and the tail at the upper-right. Use a restrained grey-and-white aircraft drawing with black outlines, red internal fire-suppression linework and arrows, and thin leader lines. Draw longitudinal cargo compartments inside the fuselage and small dark detector markings. Reproduce \*\*all visible original text labels\*\*, preserving capitalization: \*\*AVIONICS COMPARTMENT\*\*, \*\*FWD CARGO COMPARTMENT\*\*, \*\*AFT CARGO COMPARTMENT\*\*, \*\*BULK CARGO COMPARTMENT\*\*, \*\*CARGO FIRE EXTINGUISHER BOTTLE\*\*, \*\*CARGO SMOKE DETECTOR\*\*, \*\*CARGO SMOKE DETECTORS\*\*, \*\*FIRE EXTINGUISHER LINE\*\* (red text along the internal red line), \*\*ENGINE FIRE DETECTORS\*\*, \*\*ENGINE FIRE EXTINGUISHER BOTTLES\*\*, \*\*APU FIRE DETECTORS\*\*, and \*\*APU EXTINGUISHER BOTTLE\*\*. Position the wing engines, under-fuselage cargo bays, and tail APU in the same relative arrangement as the reference. Keep a white background with a thin rectangular boundary and the \*\*exact caption “Figure 14.1 Location of smoke detectors”\*\* underneath. This is a location diagram, not an invented wiring schematic; do not add components or labels.

\---

## 2\. Main Detection Principles

The chapter identifies two broad ways of detecting smoke or flame:

1. **Optical detection:** Monitors light or infrared radiation, or the way smoke particles redirect light.
2. **Ionization detection:** Monitors an electrical current affected when smoke enters an ionized air sample.

It also describes a separate **semiconductor-resistance** method that reacts to specified gases.

These systems identify different signs of a possible fire. Understanding what each sensor actually measures is more useful than memorizing only its name.

### 2.1 Optical Light Detection — Flame-Sensing Method

A light-sensitive detector can be arranged to observe an area for a change in either **visible light** or **infrared radiation**.

Its sensing component is a **photoelectric cell**. Radiation striking the cell affects its electrical output; if a monitored change takes place, the change in current is used to operate the warning circuit.

The application described in the textbook is **detection of an open flame**. The sensor is therefore looking for a change in emitted light or infrared energy, rather than waiting for smoke particles to enter a sampling chamber.

**Distinction to retain:** This light-detection method and the light-refraction smoke detector below both use a photoelectric cell, but they respond to **different optical effects**.

\---

## 3\. Light-Refraction Smoke Detection

In the **light-refraction** arrangement, air from a protected compartment is carried through a **detection chamber**. A lamp projects light into the chamber, but the photoelectric cell is positioned behind shielding so that the lamp does **not** normally shine directly onto it.

### 3.1 What Happens in Clear Air

Under clean-air conditions, the lamp beam follows the intended path through the chamber. A barrier and the internal optical arrangement keep direct light away from the receiving cell.

Because little or no beam light reaches the cell by reflection from suspended smoke, the detector remains in its normal condition.

### 3.2 What Changes When Smoke Arrives

When smoke enters the chamber:

1. **Smoke particles** pass into the illuminated region.
2. The particles **scatter or reflect** some of the lamp light toward the shielded photoelectric cell.
3. The light reaching the cell changes its electrical behavior and hence the **current in the detection circuit**.
4. The changed current operates the warning system, producing **visual and aural indications**.

The important trigger is therefore **light redirected by smoke particles**, not smoke blocking the light beam in a direct transmitter-to-receiver arrangement.

### 3.3 Flight-Deck Test

The detector includes a **test lamp**. Selecting the smoke-detector test from the flight deck illuminates that lamp and causes the detector to operate, allowing the warning arrangement to be checked.

### Figure 14.2 Light refraction smoke detector

> \*\*Image Generation Prompt — Figure 14.2 Light refraction smoke detector\*\*  
> Produce a close reproduction of the textbook's \*\*tall, portrait-oriented three-panel optical smoke-detector diagram\*\*, on a pale cyan-blue background with three black/charcoal cross-sections stacked vertically. The left edge of each panel shows \*\*two small lamps\*\*, with the \*\*TEST LAMP\*\* above the \*\*PROJECTOR LAMP\*\*; the right side contains the \*\*PHOTO-ELECTRIC CELL\*\*. Include the staggered zigzag channel walls explicitly labelled \*\*LIGHT-TIGHT LOUVRES\*\* and the central \*\*OPAQUE BARRIER\*\* that blocks a straight beam. Depict projected light as a bright \*\*yellow cone\*\*, grey slatted light paths, and white smoke clouds in the middle condition. In the \*\*top panel\*\*, labelled \*\*“1. Clean air condition.”\*\*, light must be blocked from direct contact with the photoelectric cell. In the \*\*middle panel\*\*, labelled \*\*“2. Smoke condition.”\*\*, show smoke entering from below and \*\*yellow scattered rays\*\* reaching the sensor. In the \*\*bottom panel\*\*, labelled \*\*“3. Test condition.”\*\*, depict the \*\*test light\*\* illuminating the sensor to simulate detection. Preserve each panel's relative proportions, all arrow/louvre geometry, the background layout, and the \*\*exact original caption “Figure 14.2 Light refraction smoke detector”\*\*. Do not change the three conditions or their order.

\---

## 4\. Ionization Smoke Detection

An **ionization detector** measures an electrical effect created inside a chamber containing sampled air.

### 4.1 Normal Operation

A small quantity of **radioactive material** bombards air molecules, including **oxygen and nitrogen**, in the detector chamber. This causes ionization: electrically charged particles are produced in the air.

With the chamber operating normally, ionization permits a **small current** to pass through the chamber and the associated external circuit.

### 4.2 Response to Smoke

When smoke is drawn into this chamber, its particles attach themselves to the ionized oxygen and nitrogen particles. This disrupts the normal movement of charge and **reduces the chamber current**.

The external detector circuit monitors that current. When the expected current decreases because of smoke, the system operates **audible and visual warnings**.

**Key comparison:** The optical chamber senses smoke through a **change in the amount of light reaching a cell**; an ionization chamber senses it through a **reduction in the ionization current**.

### Figure 14.3 Ionization type smoke detector

> \*\*Image Generation Prompt — Figure 14.3 Ionization type smoke detector\*\*  
> Recreate the original \*\*simple monochrome schematic\*\* inside a thin light-grey rectangular border. Place a black-outlined, almost square \*\*detection chamber\*\* in the center, with an airflow pipe entering horizontally from the \*\*left\*\* and leaving the \*\*right\*\*. Draw left-to-right black arrows and label them \*\*“Air in”\*\* and \*\*“Air out”\*\*. At the top of the chamber, add the small source identified \*\*“Radioactive material”\*\*, with a downward particle path. Label \*\*“Radioactive bombardment”\*\* at upper left, and represent ion movement by multiple thin dashed diagonal arrows radiating through the chamber. Near the bottom draw the circuit's visible \*\*+\*\* polarity mark and a dark central detector element with leader line \*\*“Detector”\*\*. On the lower left use the stacked annotation \*\*“Smoke particles reduce current flow”\*\* with a leader into the chamber. Preserve the deliberately minimal black/white line-work and the \*\*exact caption “Figure 14.3 Ionization type smoke detector”\*\*. Do not replace this airflow/chamber illustration with a generic electronic circuit.

\---

## 5\. Semiconductor-Resistance Smoke or Gas Detection

Another sensing principle relies on a **change in the electrical resistance or conductivity of a semiconductor coating** when it interacts with particular gases.

The arrangement described uses **two heated solid-state sensing elements**. Each has a coating made from semiconductor material capable of absorbing ions associated with **carbon monoxide** or **nitrous oxide**. Absorption alters the coating's conductivity.

The two sensors serve different sampling positions:

* **Cabin-air sensor:** Examines air from the cabin.
* **Ambient-air sensor:** Examines surrounding ambient air, giving the system a comparison reading.

Their electrical outputs are compared. If smoke or toxic gas affects the cabin sample, the cabin-side sensing element changes its output relative to the ambient sensor. A **difference between the two signals** is used to initiate the warning.

The essential operating concept is **comparative gas sensing**: the system responds to a changed electrical property in the exposed semiconductor, rather than directly looking for a flame or scattered light.

\---

## 6\. Unwanted or False Smoke Warnings

A warning does not always mean that an actual fire has occurred. The source identifies several conditions capable of causing a **false smoke indication**:

* **Dust** entering the sensing environment.
* **Dirt** contaminating the sensing area.
* **Gaseous emissions**, including those associated with **rotting fruit**.
* **Condensation** affecting detection.

These sources can interfere with the physical quantities monitored by some smoke detectors. The ability to **test** and, after a warning, **reset** the system is therefore an important part of its arrangement, as described earlier in the chapter.

### Figure 14.4 Smoke detector and indicator

> \*\*Image Generation Prompt — Figure 14.4 Smoke detector and indicator\*\*  
> Reproduce the textbook's \*\*two-part grey technical illustration\*\*, presented as a single image. \*\*Left:\*\* a grey cutaway segment of aircraft structure carrying a cylindrical detector or sensing head, with a ribbed dark cylinder, mounting bracket, visible small fasteners, and a light grey protective wire guard around it. \*\*Right:\*\* a rectangular dark grey cockpit indicator/test panel with two circular red/orange split indications. Across the top reproduce \*\*“SMOKE DETECTORS”\*\*, with the smaller wording \*\*“FREIGHT BAYS  DISCHARGE VALVES”\*\* underneath. Preserve the small panel markings \*\*“FWD”\*\* and \*\*“AFT”\*\* inside both round indicators, and put a rotary selector below with the exact three labels \*\*“TEST”\*\*, \*\*“NORM”\*\*, \*\*“RESET”\*\* vertically aligned at the right. Keep the picture mostly grey with reddish warning displays; match the original left-versus-right layout, boundary, and the \*\*exact caption “Figure 14.4 Smoke detector and indicator”\*\*.

\---

## 7\. Smoke Detection in Cargo Compartments

Cargo-bay smoke detectors operate using the **same basic sensing principles** already described for other protected compartments. Their application differs in the way the warning and protection arrangement is presented to the crew.

On the modern-aircraft installation described in the source:

* Cargo detectors are fitted to the relevant **cargo bays**.
* A cargo smoke condition produces a **FIRE warning on the flight deck**.
* An appropriate **fire-protection system** is installed for the cargo area.

The source illustration uses an **Airbus cargo-smoke control panel** to demonstrate the layout of warnings, a test facility, and agent-discharge controls. In this example, the forward and aft cargo positions are separately identified on the panel.

### Figure 14.5 Cargo smoke detection (Airbus)

> \*\*Image Generation Prompt — Figure 14.5 Cargo smoke detection (Airbus)\*\*  
> Draw a \*\*straight-on, rectangular Airbus-style cargo-smoke/fire-protection panel\*\* in medium-grey instrument-panel finish, keeping the full panel contained in a thin white or pale border. The large upper heading must read \*\*“CARGO SMOKE”\*\*. At the top left draw a black square \*\*FWD\*\* indicator with \*\*“SMOKE”\*\* inside, at the top center a circular \*\*“TEST”\*\* pushbutton, and at top right a matching \*\*AFT\*\* indicator with a distinctly \*\*red illuminated “SMOKE”\*\* legend. Beneath the test button, center a square pushbutton labelled \*\*“DISCH”\*\* and \*\*“AGENT 2”\*\*. Across the lower portion, show \*\*two orange-red guarded discharge handles\*\*, one near each bottom corner, with grey cylindrical pivots and visibly open guard profiles. Between the handles place a smaller black indication area with \*\*“DISCH 1”\*\* illuminated amber/yellow and \*\*“DISCH 2”\*\* beneath it; around the lower center reproduce the white \*\*“AGENT 1”\*\* and \*\*“AGENT 2”\*\* legends on both sides, keeping their positions aligned with the guards. Add the four round panel fasteners and top/bottom dividing lines visible in the original. All panel text and the \*\*exact caption “Figure 14.5 Cargo smoke detection (Airbus)”\*\* must match; do not invent extra annunciators.

\---

## 8\. Toilet Smoke Detector — Illustrated Crew Warning Sequence

The chapter includes a separate illustration of a **toilet (lavatory) smoke-detector** warning sequence. Its six numbered callouts show what crew members may see or hear following detection and how the illustrated warning panel may be handled.

In the diagram:

1. A **red warning light outside the toilet** flashes.
2. A **bleeper** sounds.
3. A **cabin call chime** sounds.
4. A **red light on the indication panel** flashes.
5. An illustrated **horn-off** control can cancel the audible warnings.
6. The **red lights remain flashing** until the smoke has cleared and the illustrated **reset** has been operated.

These indications and buttons are described here as features of **the depicted installation**. The precise crew actions for any aircraft remain subject to its applicable procedures.

### Figure 14.6 Toilet smoke detector

> \*\*Image Generation Prompt — Figure 14.6 Toilet smoke detector\*\*  
> Rebuild the original colourful \*\*pale-blue rectangular explanatory infographic\*\* with a centered red title banner \*\*“TOILET SMOKE DETECTORS”\*\* and six numbered callouts. \*\*Left:\*\* open aircraft toilet door seen in perspective, smoke clouds leaving the lavatory, a seated occupant partly visible, and a flashing red light above the door; label \*\*“1. Red light flashes outside toilet.”\*\*. \*\*Upper-right:\*\* circular cabin chime/loudspeaker with red sound-wave arcs, caption \*\*“3. Cabin call chime sounds.”\*\*. \*\*Lower middle:\*\* a grey cabin-control panel with a perforated round speaker at the upper left and red sound waves labelled \*\*“2. Bleeper sounds.”\*\*; two stacked annunciator locations with white labels \*\*“REAR 1”\*\* and \*\*“REAR 2”\*\*, each beside a round red lamp, with callout \*\*“4. Red light flashes.”\*\*. At the bottom of the panel, show three square buttons labelled \*\*“HORN OFF”\*\*, \*\*“RESET”\*\*, \*\*“TEST”\*\* in that order. Put a pointing hand on each outer button, with the exact side annotations \*\*“5. Can cancel audio warnings.”\*\* and \*\*“6. Red lights flash until smoke has cleared \& reset pressed.”\*\*. Maintain the source's large grey lavatory on the left, the right-aligned warning panel, red sound and flashing indicators, and \*\*the exact caption “Figure 14.6 Toilet smoke detector”\*\*. Keep all numbers and text intact.

\---

## 9\. Smoke Hoods: Role and Basic Construction

**Smoke hoods** are part of an aircraft's **emergency equipment**. The chapter treats them as equipment for **flight and cabin crew**, because their use requires specific training.

Their purpose is to help the wearer remain protected from smoke during an emergency **in flight or on the ground**.

### 9.1 Protective Features

The basic hood described in the textbook includes the following features:

* **Head-and-face enclosure:** Provides a covered breathing environment for the wearer.
* **Rubber neck seal:** Seals around the neck to separate the inside of the hood from surrounding smoke.
* **Self-contained oxygen supply:** Provides oxygen without relying on ordinary outside air.
* **Minimum operating duration:** **At least 15 minutes**, as stated in the chapter.
* **End-of-supply indication:** Oxygen exhaustion may be recognized when **breathing resistance increases**.

The figures further show a hood designed to help protect the **head from heat and flames**, permit **eyeglasses**, and allow communication through a **speech diaphragm**. They also emphasize that **long hair must be kept clear of the neck seal**.

### 9.2 Location on the Aircraft

Smoke hoods are stored where trained personnel need access to them:

* At **flight-crew stations**.
* At **cabin-crew positions**.

This positioning supports their use by the crew during a smoke-related emergency.

\---

## 10\. Airline Smoke-Hood Types

Two examples are given in the chapter: **Cabox** and **Drager**.

### 10.1 Cabox Hood

The **Cabox** unit is normally supplied in a **sealed container** at the relevant crew station. It contains a **chemical oxygen generator**.

Before using the unit, particular attention is required to the **quickstart cord**: the chapter specifically states that this cord must be **intact**.

### 10.2 Drager Hood

The **Drager** hood is also kept in a **sealed container**. According to the textbook, **no preflight check is required** for this unit.

Its oxygen supply is described as a **self-generating oxygen system** that is activated using a **start cord**.

### 10.3 Comparison

|Feature|Cabox|Drager|
|-|-|-|
|Storage arrangement|Sealed container at a crew station|Sealed container|
|Oxygen provision|Chemical oxygen generator|Self-generating oxygen system|
|Starting feature|Quickstart cord|Start cord|
|Source-specific checking point|Ensure quickstart cord is intact before use|Textbook states no preflight check is required|

Both units fall under the chapter's general smoke-hood description, including the protective neck seal and minimum oxygen duration.

### Figure 14.7 Smoke hoods

> \*\*Image Generation Prompt — Figure 14.7 Smoke hoods\*\*  
> Reproduce the textbook's clean \*\*white-background aviation safety infographic\*\* showing a \*\*standing female cabin-crew figure\*\* in dark clothing wearing a large \*\*grey self-contained smoke hood\*\*. The hood has a prominent grey head enclosure, clear front viewing panel with the person's eyes and \*\*glasses\*\*, an orange/grey circular \*\*mouth speech diaphragm\*\*, a dark-grey chest-length oxygen-generating front section, and a black rubber neck seal under the hood. Use thin \*\*red leader arrows\*\* and exactly the source annotations: \*\*“Glasses may be worn”\*\*, \*\*“Speak through speech diaphragm”\*\*, \*\*“Chemical reaction provides oxygen”\*\*, \*\*“Protects head from heat and flames”\*\*, \*\*“Long hair must be pushed back clear of neck seal”\*\*. At lower right add a small beige information box with \*\*“Expiry indicated by resistance to breathing and bag may slightly deflate.”\*\* and \*\*“Minimum Duration 15 mins”\*\*. Keep the same label distribution around the central figure, the thin image border and \*\*the exact caption “Figure 14.7 Smoke hoods”\*\*. Preserve the illustration's instructional appearance rather than making it a cinematic image.

### Figure 14.8 Smoke hoods Drager

> \*\*Image Generation Prompt — Figure 14.8 Smoke hoods Drager\*\*  
> Recreate the \*\*three-step, left-to-right crew smoke-hood donning illustration\*\* on a white background with a thin rectangular border. Draw three grey-shirted crew figures with bright \*\*yellow hoods\*\*, dark trousers, and black face-mask regions; panels \*\*1, 2 and 3\*\* are horizontally aligned and each has a \*\*beige caption box\*\* directly underneath. \*\*Left panel:\*\* rear/three-quarter view of a crew member pulling a loose yellow hood down over the head with both hands; reproduce the caption \*\*“Put both hands into the hood and widen elastic bands / neck seal with back of hands. Pull hood over head from behind. Keep hands between head and elastic straps until mask covers mouth and nose.”\*\*. \*\*Center panel:\*\* front view of an individual whose yellow hood carries the black uppercase word \*\*“CREW”\*\*; hand pulling the small hanging starter toggle at waist level; caption \*\*“Pull down toggle to initiate ‘Quick Start’ system. Toggle may detach.”\*\*. \*\*Right panel:\*\* front view of a crew member checking a neck seal and adjusting the yellow waist tapes; same visible \*\*“CREW”\*\* on hood; caption \*\*“Check neck seal. Tie tapes around waist.”\*\*. Match the simple flat-color manual artwork, garment shapes, yellow/black hood proportions and exact caption \*\*“Figure 14.8 Smoke hoods Drager”\*\*. Avoid adding steps or changing the displayed order.

\---

## 11\. Operational Ideas to Remember

The chapter's central connections are:

* **Protected spaces:** Smoke detectors are installed where humans cannot continually observe the compartment.
* **Warning and testing:** Detectors provide remote indications, a flight-deck test facility and a means of resetting an indication for verification.
* **Different sensing effects:** Open flames can be sensed through visible or infrared radiation; airborne smoke can be detected through scattered light or a reduction in ionization current; certain gases can change semiconductor conductivity.
* **False indications:** Contamination and environmental conditions, including dust, dirt, emissions from rotting fruit and condensation, may trigger unwanted indications.
* **Cargo applications:** The described modern cargo installation raises a flight-deck **FIRE** indication and is associated with a fire-protection system.
* **Lavatory indications:** The pictured detector arrangement provides external and cabin warnings, and the red indication continues until smoke clears and reset is applied.
* **Crew smoke protection:** Smoke hoods are for trained crew; they use a neck seal and an independent oxygen-generating system, with a stated **minimum 15-minute** duration.
* **Specific hood examples:** Cabox uses a chemical generator and an intact quickstart cord; Drager is stored sealed and uses a start cord, with the textbook stating that no preflight check is needed.

\---

## 12\. Diagnostic Self-Test Questions

*These are newly written revision questions based on the chapter's information; they are not represented as original textbook examination questions.*

**1. Why are aircraft smoke detectors placed in cargo and equipment bays?**  
Because those areas cannot be watched continuously, detectors provide a remote means of identifying a possible smoke condition.

**2. Which three broad crew-facing features are described for compartment smoke detection?**  
Remote warnings, a flight-deck test capability and a reset facility used to check a warning.

**3. What are the two detector principles expressly listed under the chapter's main smoke/flame categories?**  
Optical detection and ionization detection.

**4. What physical changes can the light-detection flame sensor monitor?**  
Changes in visible light or infrared radiation reaching a photoelectric cell.

**5. What sort of event is the basic light-detection system intended to recognize?**  
An open flame.

**6. In a light-refraction detector, why is the photocell shielded from the projector lamp?**  
So direct lamp light does not normally reach it; smoke must scatter or reflect light toward the cell to change its output.

**7. What carries the smoke into the light-refraction detection chamber?**  
Air drawn from the protected compartment through the chamber.

**8. What actually changes to activate the light-refraction warning?**  
Light scattered onto the photoelectric cell changes the electrical current, which activates the aural and visual warnings.

**9. What happens when a flight-deck test of the light-refraction detector is selected?**  
Its test lamp illuminates and activates the smoke detector to check the warning arrangement.

**10. What starts ionization in the chamber of an ionization detector?**  
Bombardment of oxygen and nitrogen molecules by a small radioactive source.

**11. How does smoke affect an ionization detector?**  
Smoke particles attach to ions, reducing the small electrical current flowing through the chamber and circuit.

**12. What is the measured variable in an ionization detector?**  
The electrical current through the ionized air in its detection circuit.

**13. How many sensing elements are described in the semiconductor method?**  
Two heated solid-state elements.

**14. Which sampled air streams are compared in the semiconductor method?**  
Cabin air and ambient air.

**15. Which gases are named as affecting the semiconductor coating?**  
Carbon monoxide and nitrous oxide.

**16. Name four sources of false smoke warnings listed in the chapter.**  
Dust, dirt, gaseous emissions such as those from rotting fruit, and condensation.

**17. What flight-deck warning is described for a cargo smoke condition on modern aircraft?**  
A **FIRE** warning.

**18. What additional installation is provided with cargo smoke detection?**  
An appropriate fire-protection system.

**19. What two kinds of audible indication are pictured in the toilet smoke-detector illustration?**  
A bleeper and a cabin call chime.

**20. How long do the illustrated toilet warning panel's red lights continue to flash?**  
Until the smoke condition has cleared and the reset control has been pressed.

**21. Who is described as using smoke hoods, and why?**  
Flight and cabin crews, because using the equipment requires training.

**22. What provides the seal around the smoke-hood wearer's neck?**  
A rubber neck seal.

**23. What minimum supply duration does the chapter specify for the hood's oxygen?**  
At least **15 minutes**.

**24. What may signal that the hood's oxygen supply is reaching expiry?**  
Increased resistance to breathing.

**25. Where are smoke hoods stowed?**  
At flight-crew stations and cabin-crew positions.

**26. What check is specified for a Cabox hood?**  
Make sure the quickstart cord is intact before use.

**27. How is the Drager oxygen system started?**  
By operating the start cord; the illustrated sequence shows pulling the quick-start toggle.

**28. What does the chapter say about the Drager preflight check?**  
It states that no preflight check is required.

**29. Why does the hood illustration emphasize long hair?**  
Hair must be pushed back so that it does not interfere with the rubber neck seal.

**30. Which item in the illustrations allows the hood wearer to speak?**  
The speech diaphragm.



