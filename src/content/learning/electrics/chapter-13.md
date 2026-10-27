# Chapter 13 — AC Electrics: Practical Aircraft Systems

## 1\. Power Distribution in a Multi-Engine Aircraft

A transport aircraft does not normally send electricity straight from a generator to every electrical consumer. Instead, electrical output travels through **feeder cables, protective devices and distribution bus bars**. This arrangement makes it possible to supply the correct services, transfer loads to another source and isolate a faulty section without necessarily losing the entire electrical system.

For a representative **twin-engine jet**, the primary generating arrangement includes:

* **Engine-driven generator No. 1**, mounted on and driven by the first engine.
* **Engine-driven generator No. 2**, similarly attached to the second engine.
* **An auxiliary power unit (APU) generator**, which provides another electrical source. Although it is a normal part of the installation, it is omitted from the physical layout drawing in Figure 13.1.

Electrical feeder cables travel from the engine-mounted generators through the **wings**, continue into the **fuselage** and terminate at a central power-distribution location. The generator output therefore passes through the airframe before it is apportioned to individual electrical services.

### 1.1 Central electrical distribution compartment

The distribution compartment is usually positioned **under the flight deck or beneath the cabin floor**. Rather than being only a junction box, this compartment contains many of the important switching, regulation, monitoring and protective elements of the aircraft's power system:

|Component|Role in the distribution system|
|-|-|
|**Generator circuit breakers (GCBs)**|Connect or disconnect an individual generator from its associated distribution circuit.|
|**Bus tie breakers (BTBs)**|Make or break connections between designated bus sections or distribution paths.|
|**Generator control units (GCUs) / voltage regulators**|Supervise generator operation and control electrical output.|
|**Current transformers**|Supply signals used for electrical-current monitoring and protection.|
|**Main bus bars**|Provide common points from which separate electrical consumers or subordinate buses receive power.|
|**Bus-bar protection circuitry**|Identifies and assists in isolating electrical faults affecting distribution sections.|
|**Battery and battery charger**|Provide stored electrical energy and maintain the battery's charge.|

Additional bus bars and extensions are located at other positions in the aircraft. On the flight deck, some are mounted **behind the rear, side and overhead circuit-breaker panels**. Consequently, electrical distribution is spread across both the central compartment and accessible cockpit panel locations.

> \*\*Image Generation Prompt — Figure 13.1 Generator Feeder Lines\*\*
>
> Reconstruct the original full-page technical illustration of a twin-engine transport aircraft as a \*\*pale-grey, semi-transparent overhead plan view\*\*, with its long fuselage extending diagonally across the canvas, an engine below each swept wing and the nose/distribution compartment at one end. The illustration is printed \*\*sideways within a portrait textbook page\*\*; keep its unusual orientation rather than replacing it with a generic upright aircraft. Follow the routes of \*\*three narrow, parallel, color-coded generator feeder conductors—yellow, red and dark blue\*\*—from \*\*CSD Generator 1\*\* and \*\*CSD Generator 2\*\* along the wing roots toward the forward fuselage; show another similarly colored feed marked \*\*From APU Generator\*\* converging into the distribution area. Include small light-grey breaker enclosures near the forward fuselage and intermediate \*\*Line Current Transformers\*\* on the feeder routes. Preserve the arrow-leader wording and component positions: \*\*“CSD Generator 1,” “CSD Generator 2,” “Engine/Wing Disconnect”\*\* (at each engine), \*\*“From APU Generator,” “Line Current Transformers,” “Generator Breaker 1,” “Generator Breaker 2,” “APU Generator Breaker,” “Flight deck CB panel,”\*\* and \*\*“To load Bus bars.”\*\* Use the same subdued grey airframe, light-blue windows, colored wires, black labels, thin leader arrows, white background and exact original caption \*\*“Figure 13.1 Generator Feeder Lines.”\*\*

\---

## 2\. The Split Bus System

A **split bus** installation divides the aircraft's main AC power into separate sections. In normal operation, each engine-driven alternator powers its own section; it is **not connected in parallel** with the other engine's alternator.

The usual generating specification for this arrangement is **115/200 V, 400 Hz, three-phase AC**, with **constant-frequency alternators** providing the primary electrical supply.

The advantage of operating the alternators separately is that they do **not** require the more elaborate synchronization and load-sharing arrangements needed for routine parallel generator operation. Despite their normal separation, the buses can be interconnected when an electrical source is lost.

### 2.1 Supplying DC consumers

Most aircraft services use AC, but some systems require **28 V DC**. This is obtained using **two transformer rectifier units (TRUs)**:

* **TRU No. 1** is fed from **No. 1 AC bus** and normally supplies **essential DC loads**.
* **TRU No. 2** is fed from **No. 2 AC bus** and normally supplies **non-essential DC loads**.

Each TRU converts the **115 V AC input** into a **28 V DC output**. This arrangement gives the aircraft separate DC conversion paths associated with its two AC sources.

The installation also includes a **battery**. Its functions include starting the APU, providing restricted emergency electrical power for essential circuits and, where the aircraft arrangement permits, supplying certain services on the ground when the engine-driven generators are unavailable. It is not a normal substitute for the full power of the alternators.

### 2.2 Distribution during normal operation

With both main alternators operating:

1. **Generator 1** supplies **No. 1 AC bus**, while **Generator 2** supplies **No. 2 AC bus**.
2. The two **main AC buses remain isolated**; the generators do not operate in parallel.
3. Each AC bus feeds its own **non-essential AC services** and associated **TRU**.
4. The **essential AC bus** normally receives power from **No. 1 AC bus** through a **changeover relay**.
5. The two DC load buses—**essential DC** and **non-essential DC**—are joined by a normally closed **DC isolation relay**.
6. The battery is connected directly to the **battery bus**. Through the **battery relay**, it can also supply the **essential DC bus**.

The **battery bus**, **vital bus**, **essential buses** and **non-essential buses** represent different priority levels. If generating capability falls, the system can sacrifice non-essential consumers while retaining power for functions needed for continued safe operation.

> \*\*Image Generation Prompt — Figure 13.2 Split bus system\*\*
>
> Recreate a wide black-line \*\*aircraft electrical single-line schematic\*\* in a pale rectangular border. Across the top place three source circles in order \*\*“No. 1”\*\*, \*\*“APU”\*\*, \*\*“No. 2”\*\* under the heading \*\*“GENERATORS”\*\*; add a fourth \*\*“EXTERNAL POWER”\*\* connection at far right, attached through \*\*“EXTERNAL POWER RELAY”\*\*. Draw \*\*“GCB 1”\*\* and \*\*“GCB 2”\*\* under the two engine generators, feeding horizontal rectangles \*\*“NO 1 AC BUS”\*\* and \*\*“NO 2 AC BUS.”\*\* Between these buses put the central \*\*“BUS TIE BREAKER”\*\* with relay/breaker contacts and a double APU connection. From the left AC bus branch to \*\*“NON ESS AC BUS”\*\* and to \*\*“AC ESS BUS”\*\* through \*\*“CHANGE OVER RELAY.”\*\* Below, draw a striking \*\*red rectangular “INV”\*\* block linked to the essential AC bus, and two \*\*blue “TRU”\*\* rectangles beneath the respective main AC buses. The TRUs feed \*\*“DC ESS BUS”\*\* and \*\*“DC NON ESS BUS,”\*\* joined by an open-contact \*\*“DC ISOLATION RELAY.”\*\* At lower left place \*\*“VITAL BUS”\*\* and \*\*“BATT BUS”\*\*, a battery/earth symbol, and a contact marked \*\*“BATT RELAY”\*\* connecting the battery bus to the essential DC bus. Preserve all black conducting paths, arrows, relay dots, contact gaps, exact label capitalization, block colors and the original caption \*\*“Figure 13.2 Split bus system.”\*\* White technical-drawing background, no added equipment.

### 2.3 Failure of one engine-driven alternator

A failure of either alternator does not necessarily mean its associated services must be lost. The system can use the remaining source to supply both sides of the distribution arrangement:

1. The failed source becomes unavailable.
2. The **bus tie breaker** closes, connecting the normally separate main AC buses.
3. The **surviving alternator** can then energize both main AC bus sections.
4. Because both AC buses are still powered, **both TRUs remain supplied**, so the system can continue feeding its normal DC consumers as well.

The crucial distinction is that the two alternators are **not deliberately paralleled**. The tie connection allows **one surviving alternator** to supply the distribution system after the other source has failed.

The **APU can be started in flight**, where applicable, and its generator can be connected to **No. 1 or No. 2 AC bus**. This can restore the available generating capacity and reduce the demand placed on the remaining engine-driven source.

### 2.4 Failure of both engine-driven alternators

When both primary AC generators become unavailable, the aircraft can no longer operate every electrical service. The system must retain power for the most important loads and disconnect those that are not essential.

**AC-side response:**

* The main AC supplies can no longer sustain **non-essential AC loads**, which are therefore shed or isolated.
* The **essential AC changeover relay** switches away from its normal No. 1 AC bus feed.
* A **static inverter** now supplies essential AC circuits by converting the available battery-supplied DC power into AC.
* With batteries in a fully charged condition, the specified emergency supply duration in this example is **30 minutes** for the essential AC bus arrangement.

**DC-side response:**

* The **DC isolation relay opens**, splitting the essential and non-essential DC sections.
* **Non-essential DC consumers lose power**.
* The **battery bus** continues to supply **essential DC services**, including through the appropriate battery-relay connection.
* The battery-supported **static inverter** maintains the essential AC supply.

This design illustrates **load shedding**: preserve essential electrical functions first, rather than attempt to power every normal service from the limited battery reserve.

### 2.5 Ground power and APU power

With the aircraft on the ground, either **external electrical power** or the **APU generator** may be used to energize the aircraft's entire electrical-services distribution system. The available APU generating capacity can be more restricted in flight: in the installation described, the APU generator **may only be able to supply one AC bus** while airborne.

Whether a bus can actually be energized is determined by the installed switching and protection arrangement, not merely by whether a source is physically present.

### 2.6 Flight-deck controls and indications: Airbus A320 example

The A320 is used to illustrate how the split-bus concept appears to the crew. One panel provides **switching controls and fault/availability indications**; a separate ECAM page provides an **electrical distribution status display**.

**Electrical control panel:** The flight crew can identify generator selections, generator-related faults, bus tie configuration, battery switches, external-power availability, APU-generator availability and essential-AC alternate-feed selection. The panel also includes galley power isolation and engine-drive disconnect controls.

> \*\*Image Generation Prompt — Figure 13.3 A320 split bus control panel\*\*
>
> Reconstruct the textbook's \*\*rectangular black-outline Airbus A320 overhead ELEC control panel\*\*, with a \*\*white-grey face, black circuit lines, black text and pale indicator windows\*\*. Across the top display the leader labels \*\*“GALLEY POWER ISOLATION”\*\*, \*\*“BATT SWITCH AND VOLTAGE”\*\*, \*\*“AC ESSENTIAL BUS ALTERNATE SUPPLY SELECTOR”\*\* and \*\*“TRU”\*\* pointing to their exact equipment positions. Inside the panel reproduce two battery numerical readouts around \*\*“26.8V”\*\* and \*\*“27.9V”\*\* with \*\*“BAT 1”\*\* and \*\*“BAT 2”\*\* fault/OFF switches between them; a central \*\*“AC ESS BUS”\*\* with left and right arrows from \*\*“AC BUS 1”\*\* and \*\*“AC BUS 2”\*\*; side bus labels \*\*“DC BUS 1”\*\* and \*\*“DC BUS 2”\*\*; a right-side \*\*“AC ESS FEED”\*\* switch reading \*\*“FAULT / ALTN”\*\*. Along the bottom include labelled pushbutton blocks \*\*“GALLEY”\*\*, \*\*“IDG 1”\*\*, \*\*“GEN 1”\*\*, \*\*“APU GEN”\*\*, \*\*“BUS TIE”\*\*, \*\*“EXT PWR”\*\*, \*\*“GEN 2”\*\*, \*\*“IDG 2”\*\* with the internal status words \*\*“FAULT,” “OFF,” “AVAIL,” “AUTO”\*\* where shown. Preserve the vertical \*\*“ELEC”\*\* letters at both sides and lower leader captions \*\*“IDG DISCONNECT SWITCH,” “GCB CONTROL,” “APU GEN CONTROL,” “BUS TIE BREAKER CONTROL,” “EXTERNAL POWER CONTROL.”\*\* Use source-like panel spacing, arrows, border and exact caption \*\*“Figure 13.3 A320 split bus control panel.”\*\*

**ECAM electrical page:** The electrical system display represents how the power sources connect to the AC buses, TRUs, DC buses and batteries. It also reports relevant source parameters and equipment temperatures.

> \*\*Image Generation Prompt — Figure 13.4 A320 ECAM display\*\*
>
> Produce a faithful \*\*black, vertically oriented rounded-rectangle A320 ECAM “ELEC” synoptic display\*\* against a light-grey frame. At its top arrange white boxes \*\*“BAT 1 / 26 V / 0 A”\*\* at left and \*\*“BAT 2 / 26 V / 0 A”\*\* at right, with a \*\*“DC BAT”\*\* node between. Beneath these boxes draw white electrical-path lines leading to \*\*“DC 1”\*\* on the left, \*\*“DC ESS”\*\* in the middle and \*\*“DC 2”\*\* on the right. The centre column must show \*\*“ESS TR”\*\* with an upward triangular pointer and \*\*“EMER GEN”\*\* with a downward pointer; left and right columns show \*\*“TR 1 / 28 V / 110 A”\*\* and \*\*“TR 2 / 28 V / 82 A”\*\*, respectively. Lower still, draw \*\*“AC 1”\*\*, \*\*“AC ESS”\*\*, \*\*“AC 2”\*\*, and underneath \*\*“GEN 1 / 62% / 116 V / 400 Hz”\*\*, \*\*“APU GEN”\*\*, \*\*“GEN 2 / 60% / 115 V / 400 Hz.”\*\* At the bottom retain \*\*“IDG 1 °C 110”\*\*, \*\*“110°C IDG 2”\*\*, \*\*“TAT +19°C”\*\*, \*\*“SAT +18°C”\*\*, \*\*“GW 66000 KG”\*\* and \*\*“CG 28 %”\*\* where legible. To the right add a white explanatory legend listing \*\*“BATTERY VOLTS, AMPS,” “DC BUS BARS,” “TRU OUTPUT VOLTS, AMPS,” “AC BUS BARS,” “GEN OUTPUT POWER (%’AGE) VOLTS, FREQS,” “IDG TEMP.”\*\* Preserve all solid electrical connections, rectangular status blocks and exact caption \*\*“Figure 13.4 A320 ECAM display.”\*\*

\---

## 3\. Parallel Bus Bar System

A second method of aircraft AC power distribution allows **several alternators to operate together on interconnected buses**. Unlike the normal split-bus arrangement, a parallel distribution system can combine output from synchronized generators so that the total aircraft demand is shared.

The example uses **four alternators**, numbered **1 to 4**. They are initially arranged as **two groups**, each group having a common synchronizing bus:

* Generators **1 and 2** are associated with the first synchronizing bus.
* Generators **3 and 4** are associated with the second synchronizing bus.

The two groups can be connected to each other when required by operating a separate **split system breaker (SSB)**.

### 3.1 Bringing a generator online

Generator output must first be brought within the electrical limits specified for connection to the system:

1. **Excite the alternator field** so that usable output is produced.
2. Confirm that the output lies within the permissible operating limits.
3. Close the associated **generator circuit breaker (GCB)** to connect the alternator to its own **load bus bar**.
4. During normal system operation, the GCB then stays closed.
5. With the relevant **bus tie breaker (BTB)** normally closed, that load bus is electrically linked to its **synchronizing bus**.

When another alternator in the same group comes online, it may join the existing energized synchronizing bus **only after the required synchronizing conditions are met**. These include the relevant **voltage, frequency and phase-sequence** compatibility (and phase matching at connection). Only then should its GCB be permitted to close.

**GCBs and BTBs perform different jobs:** the GCB connects a generator with its load bus, while the BTB connects that load bus to the synchronizing distribution network.

### 3.2 Using the split system breaker

The two synchronizing buses are joined—or deliberately kept apart—by the **SSB**. Its position depends on operating needs, including the phase of flight.

**SSB open:** Each generator pair can operate in parallel within its own group, but the two groups remain electrically separated. This separation can be useful during a **dual-autopilot autoland**, when the two autopilots need independent electrical sources.

**SSB closed:** The synchronizing buses are joined and suitable online generators can operate as one larger parallel group, sharing the total aircraft load.

There is therefore a deliberate balance between **redundancy through independent channels** and **flexibility through common load sharing**.

### 3.3 Failure of one generator

If an alternator fails, its **GCB opens**, removing the failed generator from the network. Provided the other alternator in the same pair remains operational, that partner can supply the loads previously carried by **both members of the pair**.

This creates an **unequal loading situation**: the surviving generator of the affected pair must support more demand than either generator in the healthy pair on the other synchronizing bus.

Closing the **SSB** combines the two synchronizing buses. The **three surviving generators** may then supply the aircraft together and share the aggregate load, rather than leaving the local surviving generator to carry both of its pair's loads.

### 3.4 Isolating a bus-bar earth fault

A generator malfunction and a **distribution bus-bar fault** demand different handling.

If an **earth fault** develops on a load bus, opening the GCB of its own generator may **not** remove the problem. Other generators connected through the bus ties could continue feeding current into that same faulty bus.

To prevent healthy sources from being dragged into the fault:

1. Identify the **affected load bus**.
2. Open the **BTB associated with that bus**, preventing other synchronized sources from energizing the faulty section.
3. Open the **GCB of the alternator still feeding the faulty bus**, so the fault is completely isolated.

The key principle is to **separate the faulty bus from all possible feeds**, not merely disconnect one generator while leaving the fault connected to the rest of the distribution system.

> \*\*Image Generation Prompt — Figure 13.5 Parallel alternator operation\*\*
>
> Reconstruct the source's minimal \*\*black-and-white, four-generator single-line schematic\*\* in a horizontal rectangular border. Place four circles evenly across the top labelled \*\*“GEN 1,” “GEN 2,” “GEN 3,” “GEN 4.”\*\* Under each circle show an open-contact \*\*generator circuit breaker\*\* and a small dashed auxiliary line, with the group heading \*\*“GCBs”\*\* between the first pair. Draw four rectangular horizontal blocks \*\*“LOAD BUS 1”\*\*, \*\*“LOAD BUS 2”\*\*, \*\*“LOAD BUS 3”\*\*, \*\*“LOAD BUS 4”\*\* below their respective generators. Beneath each bus show an open-contact bus-tie symbol with dashed auxiliary line and the collective label \*\*“BTBs.”\*\* Connect load buses 1 and 2 to a long lower box marked \*\*“SYNCHRONIZING BUS”\*\*, and buses 3 and 4 to an identical box on the right. Link the two lower synchronizing buses through a low, centered switch labelled \*\*“SSB”\*\*. Keep \*\*four strictly vertical generator-load paths\*\*, the \*\*two separate bottom synchronizing buses\*\*, the centered inter-bus connecting breaker, circular switch terminals, source spacing and exact caption \*\*“Figure 13.5 Parallel alternator operation.”\*\* White background, thin dark-grey wiring, no color.

### 3.5 Boeing 747-400 electrical-system example

The **Boeing 747-400** is presented as an aircraft with a four-generator parallel-type electrical distribution arrangement. Two figures illustrate the relationship between **crew controls** and **electrical-system status information**.

**Electrical control panel:** The overhead controls show the options for standby power, battery supply, APU supply, external power, bus-tie isolation, generator circuit-breaker controls and generator-drive disconnection.

> \*\*Image Generation Prompt — Figure 13.6 747 - 400 electrical control panel\*\*
>
> Reproduce the grey, rectilinear \*\*Boeing 747-400 overhead electrical control-panel illustration\*\* with a symmetrical four-column equipment layout, dark-grey switch modules, white lettering, fine black interconnecting lines and thin rectangular outer border. At upper left draw a rotary selector headed \*\*“STANDBY POWER”\*\* with positions \*\*“OFF,” “AUTO,” “BATT”\*\*. At top centre draw a paired rocker block under \*\*“L – UTILITY – R”\*\* with \*\*“ON”\*\* above and \*\*“OFF”\*\* below each switch, and below it a \*\*“BATTERY”\*\* on/OFF control. At upper right draw the \*\*“APU”\*\* rotary selector labelled \*\*“OFF,” “ON,” “START.”\*\* Across the next band show rectangular source buttons \*\*“EXT PWR 1,” “APU GEN 1,” “APU GEN 2,” “EXT PWR 2”\*\* with vertical \*\*“AVAIL”\*\* indications. In the central lower portion arrange four \*\*“BUS TIE”\*\* modules each reading \*\*“AUTO / ISLN”\*\*; beneath them place four generator breaker switches with \*\*“BUS”\*\* tabs and \*\*“GCB CONT”\*\*, each carrying \*\*“ON / OFF”\*\* and numbered \*\*1, 2, 3, 4\*\*. Along the lowest row position four switch boxes labelled \*\*“DRIVE”\*\* with the centre descriptor \*\*“DRIVE DISC.”\*\* Keep the control arrangement, separation lines, switch positions, grey shades and original caption \*\*“Figure 13.6 747 - 400 electrical control panel.”\*\*

**EICAS electrical display:** Instead of showing only individual switches, the status page summarizes sources, the synchronizing/split buses, bus ties, consumer distribution and generator-drive warnings.

> \*\*Image Generation Prompt — Figure 13.7 747 - 400 EICAS electrical display\*\*
>
> Generate the original \*\*Boeing 747-400 EICAS electrical synoptic\*\* as a dark charcoal-to-black rounded rectangle on a pale-grey panel, with white electrical lines and square white status markers. Across the top show source annotations \*\*“EXT 1,” “APU 1,” “APU 2,” “EXT 2”\*\* connected down to the upper bus network; in the middle mark \*\*“SSB”\*\* across the central tie and \*\*“BUS TIE”\*\*, with small contact blocks on either side. At the far left and right of the upper display insert \*\*“ISLN”\*\* blocks; below show bus distribution \*\*“BUS 1,” “BUS 2,” “BUS 3,” “BUS 4”\*\* with nearby labels \*\*“UTILITY”\*\* and \*\*“GALLEY.”\*\* Lower down draw four generator circuit-breaker/status columns \*\*1, 2, 3, 4\*\*, including the central \*\*“GEN CONT”\*\*, two visible \*\*“OFF”\*\* boxes, \*\*“DRIVE”\*\* and a right-hand \*\*“DRIVE / TEMP / PRESS”\*\* warning. To the right of the black panel add the original white explanatory legend lines \*\*“APU \& EXT POWER INPUTS,” “SYNC BUS AND SSB INDICATIONS,” “BTB INDICATIONS,” “LOAD BUS BARS,” “GCB INDICATIONS (OPEN/CLOSED),” “GEN DRIVE FAULT INDICATIONS (HIGH TEMP LO PRESS).”\*\* Match source-like arrangement, letter sizes, connectors and exact caption \*\*“Figure 13.7 747 - 400 EICAS electrical display.”\*\*

\---

## 4\. Split-Bus and Parallel-Bus Arrangements Compared

|Feature|Split-bus installation|Parallel-bus installation|
|-|-|-|
|Main generator operation|Each alternator normally supplies its own AC bus.|Multiple synchronized alternators can feed shared buses.|
|Normal connection between main sources|Normally isolated.|Paired generators are connected through their load buses and bus ties.|
|Synchronization for normal operation|No normal alternator paralleling required.|Synchronization is required before joining an energized system.|
|Single-generator failure|A bus tie allows the surviving source to power both main bus sections.|The remaining generator of the pair can pick up both loads; joining synchronizing buses can distribute the load among three generators.|
|Separating supply groups|Separate AC main buses operate independently in normal conditions.|The SSB can keep two synchronizing bus groups independent.|
|Fault isolation|AC and DC tie/isolation devices maintain priorities and separate essential loads as required.|The correct combination of GCB and BTB operations removes a faulty load bus from all supplying generators.|
|Emergency priority|Battery-supported DC and a static inverter maintain essential functions after both main AC sources fail.|The illustrated discussion emphasizes flexible load sharing, separated pairs and selective isolation.|

\---

## 5\. Chapter Questions

**1.** What is the main purpose of the synchronizing bus in a multi-generator aircraft electrical installation?

A. Allow electrical connections between generator distribution buses  
B. Supply only essential aircraft equipment  
C. Measure current drawn by each electrical consumer  
D. Join the aircraft's DC buses together

**2.** In which aircraft electrical circuits are fuses and circuit breakers used?

A. DC circuits exclusively  
B. Both AC and DC circuits  
C. AC circuits exclusively  
D. Only installations that protect wiring, never equipment

**3.** In an aircraft whose primary distribution is AC, which component normally produces the required DC supply?

A. Main batteries operating alone  
B. Transformer rectifier units  
C. Conventional DC-to-AC inverters  
D. An emergency static inverter

**4.** In the normal operation of a non-paralleled, constant-frequency split-bus system, how is the essential AC bus usually supplied?

A. Directly from No. 1 AC bus, without switching arrangements  
B. Directly from No. 2 AC bus, without switching arrangements  
C. Only the non-essential circuits receive AC from the main buses  
D. From No. 1 AC bus through the essential-AC changeover relay

**5.** What happens to non-essential electrical consumers after the failure of both primary alternators in the split-bus arrangement described?

A. They are disconnected from the available supply  
B. They are all connected directly to the battery bus  
C. The static inverter is switched to every non-essential service  
D. Only essential DC loads remain powered from TRU No. 1

**6.** How are the two TRU-fed DC sections normally arranged in the split-bus installation?

A. The two TRUs and their load buses are permanently isolated from one another  
B. The battery obtains its entire charge solely from TRU No. 1  
C. The two TRU-fed DC load buses are interconnected through the DC isolation relay  
D. The DC load buses receive their normal supply from the static inverter

**7.** Which consumers receive power from the static inverter during an appropriate split-bus emergency configuration?

A. Essential DC consumers only  
B. Essential AC consumers  
C. All essential and non-essential AC and DC consumers  
D. The battery charger exclusively

**8.** If one main alternator fails in a split-bus system, how can its associated AC bus continue to receive power?

A. The DC isolation relay automatically joins the two AC buses  
B. The bus tie breaker automatically joins the main AC bus sections  
C. The pilot must always manually connect the two buses using a separate selection  
D. The AC bus sections cannot be interconnected because the generators are not paralleled

**9.** Which statement correctly describes the four-generator parallel-bus arrangement discussed in this chapter?

A. The two synchronizing buses can be kept electrically separated, including for specified flight operations  
B. Each GCB connects a generator directly to a synchronizing bus, bypassing its load bus  
C. BTBs are the breakers that join the two synchronizing buses to one another  
D. Generator control relays directly connect each generator to its load bus instead of GCBs

**10.** One of four online alternators fails in a parallel distribution system. Which action allows the three healthy alternators to share the total aircraft electrical load?

A. Manually assign the failed source's individual equipment to a selected generator only  
B. Keep the failed source's load bus permanently without power  
C. Leave the failed alternator's GCB closed so the other units can backfeed the alternator  
D. Close the split system breaker to place the remaining three alternators on a common parallel system

**11.** In the split-bus example, what electrical services can a suitable external power source supply when connected on the ground?

A. It must automatically operate in parallel with engine alternators already online  
B. Non-essential AC consumers only  
C. The aircraft's electrical services generally, via the distribution arrangement  
D. Essential AC consumers only through the emergency static inverter

\---

## 6\. Answers and Explanations

|Question|Answer|Explanation|
|-|:-:|-|
|1|**A**|A synchronizing bus gives suitably matched generator distribution sections a common electrical connection. It is not simply an essential-services bus or a DC tie.|
|2|**B**|Both AC and DC systems require overcurrent and fault protection. Fuses and circuit breakers are installed in both kinds of circuit.|
|3|**B**|A transformer rectifier unit converts the aircraft's AC supply into DC. An inverter performs the opposite conversion.|
|4|**D**|The normal feed for essential AC is from the No. 1 AC bus **through the changeover relay**; the relay provides an alternate feed arrangement.|
|5|**A**|Once both alternators are lost, non-essential AC and DC consumers are shed. The batteries and static inverter support the essential system for the available emergency period.|
|6|**C**|TRU No. 1 and No. 2 feed their respective DC buses, which are normally connected by the **DC isolation relay**. That relay opens after the dual-generator failure.|
|7|**B**|The static inverter converts battery-supported DC power into **AC for essential AC consumers**. It does not normally power all non-essential loads.|
|8|**B**|Closing the **bus tie breaker** lets the surviving alternator supply both main AC buses and continue feeding both TRUs.|
|9|**A**|The two synchronizing buses can remain isolated, allowing two independent synchronized generator pairs—for example, to support separate power paths during a dual-autopilot autoland.|
|10|**D**|Closing the **SSB** connects the two synchronizing buses so all three available synchronized generators can share the aircraft load.|
|11|**C**|When appropriate external power is connected on the ground, the aircraft distribution system can be supplied without the engine generators operating.|



