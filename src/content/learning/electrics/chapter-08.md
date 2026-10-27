# Chapter 8 — DC Electrics: Aircraft Electrical Power Systems

## 1\. Aircraft Electrical Power Systems: Purpose and General Arrangement

An aircraft electrical system must **generate electrical energy, distribute it to the installed equipment, and allow the crew to observe whether the supply is healthy**. Its configuration depends on how much electrical power the aircraft's equipment requires and how many sources are available.

A typical single-engine aircraft has one engine-driven **DC generator or alternator**, accompanied by the controls, circuit protection and indicators needed to connect it to the aircraft's electrical network. The unit is **on line** only when it is actually connected to the distribution system and delivering power; a generating unit merely rotating with the engine is not necessarily supplying the aircraft.

Aircraft with multiple engines generally have at least two generating units capable of operating **in parallel**. They share the electrical demand while the distribution and protection arrangements help maintain supply if one source becomes unavailable. The electrical system's necessary **current capacity, expressed in amperes**, is based on the combined requirements of the consuming equipment.

An electrical load operates only when there is a complete path allowing current to leave its source, pass through the equipment, and return to the source. Two common arrangements provide this return path: a **two-wire (dipole)** circuit and an **airframe-return (unipole)** circuit.

\---

## 2\. Dipole or Two-Wire System

A **dipole system** uses two separate conductors for each load circuit:

1. The **positive conductor** carries supply from the generator or distribution **bus bar** toward the load.
2. The **negative conductor** carries current from the load back to the negative terminal of the electrical source.

Because neither conductor needs to be replaced by the aircraft structure, this arrangement is appropriate when the aircraft body is made from **non-conducting material**. An independent return conductor is necessary for continuity of current.

Multiple items of equipment may branch off the same positive bus bar while their own return paths lead back to the source. These loads are connected in **parallel**, so each has the same supply voltage.

> \*\*Image-generation prompt — Figure 8.1 Dipole system\*\*  
> Faithfully recreate the original simple, two-dimensional aircraft-electrical teaching schematic on a white background inside a pale rectangular border. Place a circular generator symbol marked \*\*G\*\* on the far left, with an explicit \*\*+\*\* beside its upper terminal and \*\*−\*\* beside its lower terminal. Draw one black positive wire upward and across to a long horizontal rectangle at top centre labelled exactly \*\*BUS BAR\*\*. From that bus bar draw four evenly spaced vertical positive branches down into four narrow, tall, separately outlined rectangles, each carrying the vertically arranged word \*\*LOAD\*\* (letters L-O-A-D stacked). Beneath all four loads, join the negative ends to a single horizontal return wire that travels left and connects directly to the generator's negative terminal. Show the positive and negative conductors distinctly, with no ground symbols or airframe-earth symbols on the load returns. Black electrical linework, simple flat textbook vector composition, exact four-load arrangement, no invented electrical components. Caption exactly \*\*Figure 8.1 Dipole system\*\*.

\---

## 3\. Single-Pole (Unipole or Earth-Return) System

In a **unipole circuit**, the source supplies each load through a positive wire, but the return route is the **conductive metal airframe**. The generator's negative terminal is electrically connected to the structure; each load's return connection is also bonded to the structure. The metal airframe consequently serves as the common negative conductor.

This saves a separate return wire for each circuit and is consequently a common arrangement in **metal aircraft**. Electrical continuity through the airframe and its connections remains necessary: if the return path is interrupted, the relevant load will stop operating.

The key distinction is therefore **where the return current travels**:

|Feature|Two-wire / dipole|One-wire / unipole|
|-|-|-|
|Supply path|Positive wire|Positive wire|
|Return path|Separate negative wire|Conductive aircraft structure|
|Typical application in the text|Non-conducting aircraft structure|Metal aircraft structure|
|Circuit requirement|Both wires must be continuous|Supply wire and airframe-return connections must be continuous|

> \*\*Image-generation prompt — Figure 8.2 Unipole system\*\*  
> Reconstruct the companion diagram to Figure 8.1 using the same white background, thin rectangular diagram border, black circuit lines, and an identical circular \*\*G\*\* generator at far left. Put \*\*+\*\* by the generator's upper terminal and \*\*−\*\* by its lower terminal. From the upper generator terminal, route a conductor upward to one horizontal, upper-centre \*\*BUS BAR\*\* rectangle. Connect exactly four parallel tall vertical rectangular loads below the bus bar, each labelled with vertically stacked letters \*\*L O A D\*\*. Unlike the dipole illustration, terminate each individual load's bottom conductor in its \*\*own three-horizontal-line earth/ground symbol\*\*; terminate the generator's negative terminal in an identical earth symbol. Do \*\*not\*\* connect all the load returns by a horizontal negative return wire. Preserve the original visual simplicity, spacing and monochrome vector line art. Caption exactly \*\*Figure 8.2 Unipole system\*\*.

\---

## 4\. Electrical Generating Equipment

### 4.1 Generator and alternator operation

Both generators and alternators convert the **mechanical energy supplied by an engine** into electrical energy, but their internal arrangements differ.

* A **DC generator** uses a **rotating armature**, a **stationary magnetic field**, and a **commutator** to provide a direct-current output.
* An **alternator** uses a **rotating magnetic field** and a **stationary armature** to produce alternating current. Where the aircraft needs DC, a **diode rectifier assembly**, located in the alternator end frame, converts its AC output into DC.

Modern light aircraft often distribute **DC** even though their generating device is an **alternator**. The type of output delivered to the aircraft must therefore not be confused with the type of machine producing it.

### 4.2 Engine speed and electrical output

The available output of a conventional generator depends strongly on its rotational speed. The textbook describes its full rated output as typically becoming available at approximately **half engine speed**, with the generator driven at roughly **three times the engine RPM** through its drive arrangement.

By comparison, an alternator can achieve its full usable output at relatively **low engine running speeds**. This low-speed output capability is a significant practical benefit of an alternator-powered light-aircraft system.

|Feature|DC generator|Alternator supplying a DC network|
|-|-|-|
|Rotating electromagnetic component|Armature|Field|
|Stationary component|Field|Armature|
|Method of obtaining DC|Commutator|Rectifier diodes|
|Low-RPM power capability|More strongly speed-dependent|Better output at low running speeds|

\---

## 5\. Voltage Regulation

An electrical system must keep its output voltage close to the required value, even as **engine RPM changes** and the pilot switches equipment on or off. That task belongs to the **voltage regulator**.

The regulator controls the strength of the magnetic field:

* For a **generator**, it adjusts the current passing through the **field coils**.
* For an **alternator**, it adjusts current in the **exciter field**.

Changing the field current changes the generated voltage, allowing the regulator to compensate for changes in speed and load.

### 5.1 Typical nominal voltages

The systems described in the chapter use the following nominal pairings:

|System description|Battery nominal voltage|Regulated generating voltage|
|-|-:|-:|
|14-volt electrical system|12 V|14 V|
|28-volt electrical system|24 V|28 V|

The generating voltage is deliberately above the nominal battery voltage so that it can both support the loads and recharge the battery.

\---

## 6\. Overvoltage Protection Unit

A voltage regulator can itself fail. If the generator's voltage rises too far, the resulting higher currents and resistive heating may damage the wiring and equipment. Resistive heating follows **P = I²R**: for an unchanged resistance, increasing current raises the heat dissipated in proportion to the square of the current.

The **overvoltage protection unit** monitors this condition and prevents a damaging voltage rise from being maintained. In the chapter's **14 V system**, a typical operating threshold is about **16.5 V**.

When that value is exceeded, the protection device **interrupts the generator field circuit**, collapsing its useful output to zero or to the very small residual voltage. The equipment may additionally act on the **generator cut-out** to prevent reverse-current flow.

**Distinguish two jobs:** the voltage regulator *normally controls the desired output*; the overvoltage unit *acts when normal regulation becomes unsafe*.

\---

## 7\. Generator Cut-Out / Reverse-Current Relay

### 7.1 Why a generator requires a cut-out

A DC generator should supply the aircraft only when its voltage has risen sufficiently. If it remained connected while producing less voltage than the battery, current could flow **backward from the battery into the generator**, wasting battery energy and possibly causing damage.

A **generator cut-out**, also described as a **reverse-current relay**, deals with both circumstances:

* It **closes** when rising generator voltage is high enough to connect the generator safely to the bus bar.
* It **opens** when generator voltage falls below battery voltage and reverse current begins.

This contact-based cut-out is normally not required for an alternator because its **rectifier diodes block reverse current**.

### 7.2 Construction

The illustrated DC-generator relay has a spring-operated contact assembly and two electromagnetic windings:

1. **Shunt or voltage coil:** many turns of comparatively thin wire, connected across the generator output; responds principally to generated voltage.
2. **Series or current coil:** fewer turns of thicker wire, placed in the output path; its magnetic effect depends on load current direction and magnitude.
3. **Spring contacts:** mechanically tend to hold the circuit open until the coils create enough force to close it.

The relay may be built into the voltage-regulator unit or fitted separately.

### 7.3 Bringing the generator on line

Initially, with no sufficient generator voltage, the spring keeps the contacts apart. As the generator speeds up, current in the **voltage coil** produces a magnetic pull. Once generated voltage is suitably greater than battery voltage, the contact closes and connects the generator output to the bus bar. Normal load current then passes through the **series coil**, whose magnetic action supports the voltage coil and helps hold the contacts closed.

### 7.4 Disconnecting the generator

If generator output falls below the battery potential, current attempts to reverse. At the same time, the decreasing generator voltage weakens the magnetic pull of the shunt coil, and **current reversal makes the series-coil field oppose the shunt-coil field**. The spring is then able to open the contacts and separate the generator from the bus bar.

The essential operating rule is **rising voltage closes the cut-out; reverse current opens it**.

> \*\*Image-generation prompt — Figure 8.3 Reverse current cut-out relay\*\*  
> Reproduce a complex but clean two-dimensional aircraft DC electrical relay schematic, white rectangular field and black fine technical lines, matching the textbook's component placement. At lower left draw a circular generator marked \*\*G\*\*, negative lead earthed; generator positive wire runs right and then into the relay's \*\*Series (current) coil\*\* near the middle-left. Place the \*\*Shunt (voltage) coil\*\* vertically below the current coil, connected across generator output and ground. Above both coils, show a vertical contact-moving assembly, an upper spiral spring and the switching gap, labelled \*\*Sprung contacts\*\* exactly as in the source (retain source spelling). Annotate the overlapping core fields as \*\*Magnetic influence\*\*. From the relay's upper-right contact, run a conductor horizontally to a rectangular \*\*BUS BAR\*\* on the upper right, with an upward black arrow \*\*To aircraft loads\*\*. On the right connect a vertically drawn battery, labelled \*\*Battery switch\*\*, to the bus bar through its depicted switch and place a ground symbol below the battery. Show \*\*Normal current flow\*\* with solid black directional arrows in the generator-to-bus direction and \*\*Reverse current flow\*\* with red dashed arrows toward the generator; include the distinct arrows around both relay windings. All source component names must appear with clear arrow leaders, and the drawing must show the current coil and voltage coil as two separate windings. Caption exactly \*\*Figure 8.3 Reverse current cut-out relay\*\*.

\---

## 8\. Rectifiers and Inverters

### 8.1 Rectifiers

**Rectification** converts AC into DC. The alternator rectifier uses diodes arranged in the end frame of the machine. A diode has comparatively **low resistance in its permitted direction** and **high resistance in the reverse direction**. As a result, DC can pass out to the aircraft network, but battery current cannot normally flow back through the alternator.

### 8.2 Static inverters

An **inverter** performs the reverse conversion: it produces **AC from a DC input**. A **static inverter** has no rotating motor-generator combination. Instead, electronic components perform the conversion and frequency control.

The chapter gives a representative static inverter with:

* **DC input:** 18–30 V.
* **AC output:** 115 V at **400 Hz**, held at a constant frequency.
* **Typical internal devices:** oscillators, transistors, diodes, capacitors and transformers.

### 8.3 Rotary inverters

A **rotary inverter** has an electric-mechanical conversion chain: a DC motor turns an alternator, producing AC. A **constant-speed DC motor** keeps the generated AC frequency constant.

|Device|Input|Output|Principle|
|-|-|-|-|
|Rectifier|AC|DC|One-way conduction through diodes|
|Static inverter|DC|AC|Solid-state electronic conversion|
|Rotary inverter|DC|AC|DC motor mechanically drives alternator|

\---

## 9\. Generator Differential Cut-Out

Where several generators can connect to a common distribution network, an approaching generator should not be connected at an unsuitable voltage. Otherwise, a potential difference between the generators can cause **circulating current** from one machine into the other.

A **differential cut-out** prevents this condition in the multiple-generator system described by the textbook. It delays connection of the incoming unit until that unit's output is **approximately 2% above the voltage of the generator already supplying the network**. The cited comparison is measured against the **battery bus-bar potential**.

This is a different purpose from the ordinary reverse-current cut-out: the differential arrangement specifically governs **the connection of another generating source to an energized system**.

\---

## 10\. Generator / Alternator Warning Light

A generator or alternator failure lamp warns the pilot that the generating-source voltage has fallen **below battery voltage**, indicating loss of useful contribution from that source. Its operating circuit is commonly associated with the position of the generator cut-out or a **reverse-current detection** arrangement.

The lamp is therefore intended as a **source availability indication**, not simply a battery-charge display. The pilot checks the accompanying ammeter, load meter or voltmeter to understand what the system is doing.

\---

## 11\. Generator / Alternator Master Switch

The generating unit must be capable of deliberate electrical isolation. Selecting its master switch **OFF** opens the appropriate excitation path:

* A generator's **field circuit**, or
* An alternator's **exciter circuit**.

Without normal excitation, the useful generated output falls to essentially zero, apart from possible **residual voltage**. The source can then be isolated from normal power production.

The generator/alternator master switch and **battery master switch** are not interchangeable: the latter isolates the **battery connection**, while the former controls the generating unit's electrical excitation.

\---

## 12\. Monitoring Instruments

Electrical-system indications are needed so that the crew can assess **source availability, load demand and battery charging or discharging**. The installation determines the exact combination of lights and meters; the chapter concentrates on the instruments used in DC systems, although similar instrument categories also occur on AC systems.

A common arrangement has an **ammeter or load meter for each available generating source**, together with a **selectable voltmeter** that can inspect the relevant DC system or battery voltage.

### 12.1 Moving-coil instrument construction

The textbook illustrates a type of electrical meter in which **current produces a mechanical deflection**. Its main components are:

* A fixed **permanent magnet**, producing the principal magnetic field.
* A **soft-iron core** between the magnetic poles.
* A light **former carrying a wire coil**, supported on a spindle so that it can rotate in the magnetic field.
* Two very fine **hairsprings**, which both conduct current to and from the moving coil and provide restoring torque.
* A **pointer** fixed to the moving assembly and a calibrated **scale**.

As current enters the coil, its magnetic field interacts with the permanent-magnet field. The assembly turns until the electromagnetic turning effect balances the spring's restoring torque. The pointer travels farther across the scale as coil current increases. As current decreases, the springs move the pointer back toward zero.

The description is consistent with a **uniformly divided scale**: pointer deflection is proportional to the coil current. A **soft-iron case** can shield the measuring assembly from stray magnetic influences.

### 12.2 Extending instrument range

The delicate meter mechanism should not carry the whole circuit current when measuring large values.

* In an **ammeter**, a **low-resistance shunt in parallel with the meter** carries most of the current, allowing the coil to measure a representative smaller portion.
* In a **voltmeter**, a **high-resistance multiplier in series with the meter** restricts current while allowing a higher potential difference to be measured.

Both arrangements protect the movement and extend the meter's usable indication range.

> \*\*Image-generation prompt — Figure 8.4 A moving coil instrument\*\*  
> Recreate the source's annotated cutaway of a moving-coil meter in a rectangular white figure. In the centre draw a simplified semicircular analogue instrument scale with equally spaced radial tick marks and a narrow angled \*\*Pointer\*\* pointing near the left half. Below it depict the rotor/coil wound around an oblique former on a spindle between two grey magnet pole blocks labelled \*\*N\*\* (left) and \*\*S\*\* (right), with the \*\*Permanent magnet\*\* label on the right. At the pivot illustrate the spiral \*\*Hairspring\*\*. Show tiny conductor turns and red current-direction arrows within the two sides of the moving coil. Add black dashed/solid field-direction arrows around the magnet gap and black curved arrow showing clockwise rotation. Preserve all explanatory callouts: \*\*Scale\*\*, \*\*Weakened field\*\*, \*\*Strengthened field due to attraction\*\*, \*\*Combined magnetic fields turn coil and moving pointer clockwise across scale\*\*, \*\*Current flow through coil produces magnetic field\*\*, \*\*Strengthened field\*\*, \*\*Weakened field due to repulsion\*\*, \*\*Permanent magnet\*\*, \*\*Hairspring\*\*, \*\*Pointer\*\*. Diagram must have fine leader lines and the same mechanically oriented arrangement; professional flight-school engineering artwork with grey magnet blocks and selective red current arrows. Caption exactly \*\*Figure 8.4 A moving coil instrument\*\*.

\---

## 13\. Ammeter Types and What Their Readings Mean

### 13.1 Centre-zero charge/discharge ammeter

A **centre-zero ammeter** measures the direction and magnitude of **battery current**. Its needle rests at the middle when there is no battery charge or discharge current.

* **Right / positive / charge side:** electrical energy is entering the battery. The generator or alternator is supplying the operating system and recharging the battery.
* **Left / negative / discharge side:** battery current is leaving the battery to support the aircraft's loads. In the single-generator example, this indicates the alternator is not carrying the demand.

The gauge tells the pilot about **battery charging state**, not the total output of the generator directly.

### 13.2 Left-zero generator ammeter / load meter

A **left-zero load meter** measures **current demanded from the generating unit**. Its indication rises from zero as more current is supplied by the generator or alternator.

* A positive reading represents power-source contribution to the electrical network.
* A **zero** reading means the generating unit is delivering no current; on a single-source aircraft, the battery may then be the remaining electrical source.

### 13.3 Recognizing a failure

If an alternator ceases to produce current, equipment still switched on begins to use the **battery's finite stored energy**. The crew must identify electrical equipment not required for immediate safe flight and turn it off to conserve remaining energy—an action covered in detail under **load shedding**.

> \*\*Image-generation prompt — Figure 8.5 Simple ammeters\*\*  
> Make a precise two-instrument comparison figure with \*\*two circular analogue gauges side by side\*\*, identical physical diameter and a white rectangular diagram background. The left gauge must have the heading \*\*Left Zero Ammeter\*\*, small text \*\*Load Meter\*\* centred inside, a semicircular grey/white graduated scale \*\*0, 10, 20, 30, 40, 50, 60\*\*, and its black needle starting at the far lower-left zero position. The right gauge must have heading \*\*Centre Zero Ammeter\*\*, a central vertical zero mark with left-hand negative markings \*\*−10, −20, −30\*\* and right-hand positive markings \*\*10, 20, 30\*\*, text \*\*Amperes\*\*, a minus sign on the left and a plus sign on the right. Put a red outer arc over the left half labelled \*\*DISCHARGE\*\*, and a green arc over the right half labelled \*\*CHARGE\*\*; right-hand needle vertical at zero. Both gauges grey-rimmed with black hubs, subtle shading, matching panel orientation and spacing. Caption exactly \*\*Figure 8.5 Simple ammeters\*\*.

\---

## 14\. Correct Ammeter and Voltmeter Connections

An instrument must be connected in the right way to measure the intended quantity.

**Ammeter:** measures the current flowing **through** an item of equipment. It belongs **in series** with the load and is designed with low internal resistance so that it changes circuit current as little as practicable. For large currents, the meter itself can be bypassed with a parallel **shunt**.

**Voltmeter:** measures **potential difference between two circuit points**, including a source's electromotive force or voltage across a load. It is connected **in parallel**, has high internal resistance, and may use a series **multiplier resistor** to extend its range.

|Property|Ammeter|Voltmeter|
|-|-|-|
|Quantity shown|Current|Potential difference / EMF|
|Connection|In series with measured load|Across two selected points|
|Internal resistance|Low|High|
|Range-extending component|Parallel shunt|Series multiplier|

> \*\*Image-generation prompt — Figure 8.6 Ammeter and voltmeter connections\*\*  
> Recreate a single rectangular circuit diagram with a \*\*positive and negative applied-voltage pair on the left\*\* labelled \*\*+ APPLIED VOLTAGE −\*\*, horizontal top and bottom conductors, and a rectangular \*\*LOAD\*\* at far right with the word L-O-A-D vertically stacked. Draw an \*\*AMPS\*\* circular meter in the top main line, so it is clearly \*\*in series with the load\*\*; beneath this ammeter draw a small parallel resistor loop labelled \*\*Shunt. (Extends range of indication)\*\*. On the left-middle part of the circuit draw a \*\*VOLTS\*\* circular meter connected in a vertical parallel branch between upper and lower rails; directly below it, in the same branch, draw a resistor labelled \*\*Multiplier. (Extends range of indication)\*\*. Use small red filled circular junction dots at the main connection points, black circuit wire, resistor zigzags, white background, and maintain the original left-to-right proportions and explicitly correct series/parallel arrangement. Caption exactly \*\*Figure 8.6 Ammeter and voltmeter connections\*\*.

\---

## 15\. Aircraft Battery

An aircraft electrical system includes a battery both for **engine starting** and for providing electrical power when a generator or alternator fails. The chapter identifies **12 V and 24 V** as common nominal values and names both **lead-acid and alkaline** battery types.

The battery must be considered a finite supply. If it becomes the sole electrical source, the achievable operating time depends upon the battery's available charge and the total current being consumed. That is why prompt load shedding is vital after loss of normal generating power.

> \*\*Image-generation prompt — Figure 8.7 Lead Acid Battery (Absorbed Liquid Type)\*\*  
> Produce a detailed three-quarter-view greyscale engineering cutaway of an \*\*aircraft lead-acid battery\*\* with a box-shaped grey container, open/partially cut-away lid, visible top row of individual cell/vent positions, metal connector bars, front electrical terminal fittings and a detached front cannon-style aircraft connector assembly. Use thin bright-red arrow leaders for every part and retain these exact label texts from the figure: \*\*Vent stopper \& washer\*\*, \*\*Connecting insulator\*\*, \*\*Carrying handle\*\*, \*\*Connector bar\*\*, \*\*Cover locking ring\*\*, \*\*Cover\*\*, \*\*Cover gasket\*\*, \*\*Cannon plug\*\*, \*\*Cannon receptacle (including 2 contact sleeves)\*\*, \*\*Terminal insulator\*\*, \*\*Terminal connector\*\*, \*\*Container\*\*. Show the carrying handle across the top, top connector bars, plug and receptacle at front-left, and container mass at right. Reproduce all major assembly elements with industrial-technical linework and selective shadows on pure white, rather than a photorealistic consumer car battery. Caption exactly \*\*Figure 8.7 Lead Acid Battery (Absorbed Liquid Type)\*\*.

\---

## 16\. Bus Bars: Electrical Collection and Distribution

A **bus bar** is a deliberately low-impedance conductor to which electrical sources and the circuits they feed can be connected. It forms a central point for **collecting generated electrical power and distributing it to multiple consumers**.

In a basic arrangement, the generator or alternator connects to the bus bar, while separate protected branches leave the bar for lights, instruments and other consumers. More elaborate designs may have several separate bus bars with controlled interconnections so that a fault does not interrupt every item of equipment.

### 16.1 Typical construction and location

The physical form varies with the aircraft:

* **Simple systems:** a linked strip of electrical terminals may act as the bus bar.
* **Larger systems:** heavy, low-resistance **copper strips or rods** with attachment holes carry substantial currents between supply and distribution cables.
* **Supplementary connections:** flat, flexible **braided copper conductors** may form subsidiary bus bars.

Bus bars are often installed inside **junction boxes or distribution panels** at appropriate central aircraft locations. They are **insulated from the aircraft structure** and commonly fitted with protective coverings.

### 16.2 Single-engine arrangement

The simplified example links a generator, regulator, overvoltage protection, generator cut-out, warning lamp, pilot switches, ammeters, voltmeter, battery and loads. It demonstrates both the power-flow connections and the separate controls required to manage that power.

> \*\*Image-generation prompt — Figure 8.8 General arrangement - single-engine light aircraft\*\*  
> Recreate the precise monochrome light-aircraft DC wiring block diagram occupying a horizontal rectangle. At lower-left place a circular \*\*GEN\*\* symbol with \*\*14 V\*\* immediately above and an earth symbol beneath; connect a generator positive lead upward through a circular \*\*A\*\* labelled \*\*LOAD METER\*\*, then through a labelled \*\*GEN. CUT-OUT\*\* into a central long rectangular \*\*BUS BAR\*\*. Above the cut-out depict a conspicuous \*\*red round GEN. FAILURE WARNING LIGHT\*\* and dashed signalling connection. Draw two vertically oriented \*\*LOAD\*\* boxes fed from the top of the bus bar and grounded at their tops. Beneath the bus bar, depict the \*\*ALTERNATOR SWITCH\*\*, \*\*VOLTAGE REGULATOR\*\* and \*\*OVERVOLTAGE PROTECTION UNIT\*\*, with connections back to the generator \*\*FIELD\*\*, including a small branch and the text \*\*14 V\*\*. Put a circular \*\*V\*\* \*\*VOLTMETER\*\* under the bus bar leading to earth. To the right, place a \*\*CENTRE ZERO AMMETER\*\* (round \*\*A\*\*) between bus bar and \*\*BATTERY SWITCH\*\*, then a 12-volt stacked-cell battery labelled \*\*12 V\*\*, grounded below. Use thin black conductors, accurate circuit symbols, empty background and original spatial relationships. Preserve the source's label spelling and capitalization: \*\*BUS BAR\*\*, \*\*LOAD METER\*\*, \*\*GEN. CUT-OUT\*\*, \*\*GEN. FAILURE WARNING LIGHT\*\*, \*\*VOLTAGE REGULATOR\*\*, \*\*OVERVOLTAGE PROTECTION UNIT\*\*, \*\*ALTERNATOR SWITCH\*\*, \*\*FIELD\*\*, \*\*CENTRE ZERO AMMETER\*\*, \*\*BATTERY SWITCH\*\*, \*\*VOLTMETER\*\*, \*\*GEN\*\*, \*\*LOAD\*\*, \*\*14 V\*\*, \*\*12 V\*\*. Caption exactly \*\*Figure 8.8 General arrangement - single-engine light aircraft\*\*.

\---

## 17\. Design Requirements of an Aircraft Distribution System

Once electric power is available, the distribution network must deliver it safely even when a source or individual load fails. The textbook identifies three important design objectives.

**Continued supply after source failures:** equipment should retain power whenever the remaining supply can support the demand. Loss of a source does not automatically justify shutting down equipment that can still be supplied.

**Containment of distribution faults:** abnormal currents, unintentional connections to ground, and faults at bus bars should disturb as little of the remaining network as possible, while creating the **smallest practicable fire risk**.

**Isolation of a defective consumer:** failure of an individual electrically powered item must not unnecessarily remove electrical power from other devices.

The engineering methods presented to meet these objectives include **parallel generation where appropriate, suitable protective devices, automatic isolation of failed generators**, and **bus bars arranged to receive power from different sources**.

### 17.1 Example: single-alternator wiring

The textbook provides a more extensive circuit showing the relationships between the battery, starter, alternator, external power receptacle, protective elements, control relays, and the aircraft's individual loads. It also shows that cabin loads and starting circuits are not all connected identically.

> \*\*Image-generation prompt — Figure 8.9 A typical light aircraft single alternator DC system\*\*  
> Reproduce the original dense black-and-white \*\*single-alternator light-aircraft wiring diagram\*\*, not a generic simplified block chart. Draw a vertical \*\*BUS BAR\*\* down the left edge with three separate outgoing branches protected by \*\*5A\*\*, \*\*5A\*\*, and \*\*15A\*\* fuse/circuit-breaker values respectively. Include \*\*ALT WARN LIGHT\*\*, \*\*CABIN LIGHT\*\*, and \*\*CIGAR LIGHTER\*\* as separate branch loads; connect the bus network to a circular \*\*AMMETER\*\* and a \*\*RADIO INTERFERENCE CAPACITOR\*\* on the alternator side. At upper left draw \*\*STARTER SOLENOID\*\*, \*\*STARTER MOTOR\*\*, \*\*STARTER SWITCH\*\*, and a \*\*LAMP TEST\*\* switch, with accurate switches, electrical contacts, circuit connection dots and relays. Across the right half place the \*\*BATTERY\*\*, \*\*MASTER SOLENOID\*\*, \*\*EXTERNAL POWER RECEPTACLE\*\*, \*\*EXTERNAL POWER SOLENOID\*\*, \*\*VOLTAGE REGULATOR\*\*, \*\*OVER VOLTAGE PROTECTOR\*\*, \*\*ALTERNATOR FIELD\*\*, \*\*ALTERNATOR SOURCE-POWER RELAY ENERGISING CIRCUIT\*\*, and \*\*MASTER INTERLOCK\*\* connections. Show \*\*BATTERY \& ALTERNATOR SWITCH\*\* and the alternative \*\*SEPARATE BATTERY \& ALTERNATOR SWITCHES\*\* wiring, as in the original, with each terminal and cable linking to the correct adjacent block. Keep the diagram densely packed with straight orthogonal black wires, accurate component symbols, no decorative aircraft or illustrations, clear readable original labels, and white figure background. Caption exactly \*\*Figure 8.9 A typical light aircraft single alternator DC system\*\*.

\---

## 18\. Bus-Bar Service Priorities

For effective management during abnormal conditions, electrical consumers are divided into three groups according to their importance.

### 18.1 Vital services

**Vital** services are needed even after an emergency **wheels-up landing**. The chapter's examples are **emergency lighting** and **fire-extinguisher operation through a crash switch**. They connect **directly to the battery** so that their supply is not dependent upon normal generating or bus-bar availability.

### 18.2 Essential services

**Essential** consumers are necessary to maintain **safe flight during an in-flight emergency**. According to the required current type, they connect to appropriate DC or AC distribution buses and are arranged so that they can receive power from **a generator or the batteries**.

### 18.3 Non-essential services

**Non-essential** consumers can be disconnected when electrical power becomes scarce. They receive power from generator-fed DC or AC buses and are the normal candidates for **load shedding**.

|Priority|When required|Normal supply arrangement in textbook|Response to power shortage|
|-|-|-|-|
|Vital|Emergency conditions, including after wheels-up landing|Direct battery connection|Preserve|
|Essential|To continue safe flight in an emergency|Generator or battery through relevant buses|Preserve as far as power permits|
|Non-essential|Convenience or other loads not needed for emergency safe flight|Generator-fed buses|Shed first|

\---

## 19\. Parallel Bus-Bar System and Multi-Generator Power Distribution

### 19.1 Power sources used in the textbook example

The chapter's representative multi-generator aircraft has three power categories:

* **28 V DC** from engine-driven generators connected in parallel.
* **115 V AC, 400 Hz** provided by inverters.
* **24 V DC** from the batteries.

Each generator has its **own numbered bus bar** supplying a group of non-essential DC loads. Both source buses are connected through the central system to an **essential-services bus**, enabling either generator to contribute to essential equipment.

### 19.2 Battery bus and essential loads

The **battery bus** is connected to the battery and is commonly called the **hot bus** or **hot battery bus** because it remains battery-connected. The essential distribution and battery connections allow normal generating power to keep the battery charged, while also making stored battery energy available if generation fails.

**Vital** loads are connected to the battery bus. **Essential** DC loads receive supply through the centre/essential bus. This is why a larger electrical system uses more than one bus bar: **the purpose is controlled continuity, not simply convenient wiring**.

### 19.3 Failure of one generator

When a single generator fails, the protection system **isolates it from its respective bus bar**. The remaining operative generator then takes on the connected electrical demand. Because the total available generating capacity has fallen, the pilot or an automatic controller must shed non-essential loads as needed.

### 19.4 Failure of both generators

With both generators unavailable, the system can no longer continue feeding **non-essential loads** in the normal way. The **batteries supply essential services for a predetermined period**, calculated from the relevant current demand and the charge available. The textbook gives a typical minimum period of **30 minutes**; this figure is an example from the source and should not replace aircraft-specific limitations.

### 19.5 AC power allocation by inverter

The **inverter's DC supply connection** is chosen according to how important its AC consumers are:

* **INV1** and **INV2** are supplied from the respective **No. 1** and **No. 2** DC generator buses. They produce AC for **non-essential** equipment.
* **INV3** is supplied from the **essential-services DC bus**, so the **essential AC** loads can remain available from the protected supply path.

> \*\*Image-generation prompt — Figure 8.10 Multi DC generator system block diagram\*\*  
> Draw a complex yet highly legible white-background electrical \*\*block diagram\*\* with \*\*two symmetrical engine-driven generators at the upper far-left and upper far-right\*\*, titled \*\*No.1 GEN 28 V\*\* and \*\*No.2 GEN 28 V\*\*. Below each draw a \*\*GENERATOR CIRCUIT BREAKER\*\*, then thick \*\*orange horizontal bus-bar bars\*\* labelled \*\*No.1 BUS\*\* on left and \*\*No.2 BUS\*\* on right. From each numbered bus, connect a vertical black arrow to a white box \*\*NON ESS DC CONSUMERS\*\*. Near the top-centre place rectangular \*\*INV1\*\* and \*\*INV2\*\* blocks; wire them to the respective numbered buses and toward a common box \*\*NON ESS AC CONSUMERS\*\*. Draw a long thick orange \*\*CENTRE BUS BAR\*\* below the two generators with a black upward/downward arrow to \*\*ESSENTIAL DC CONSUMERS\*\*. On its right side connect \*\*INV3\*\*, which feeds a small outlined orange-bordered box \*\*ESSENTIAL AC\*\*. From the centre bus extend a branch past a clearly drawn \*\*BATTERY SWITCH\*\* to the orange \*\*BATTERY BUS (HOT BUS)\*\* below. Put an \*\*EXT. PWR.\*\* external-power input, switch/connection and earth at left of that bus. Draw \*\*VITAL CONSUMERS\*\* at right, reached from the hot battery bus. At bottom place two dashed-outline battery units each marked \*\*24 V\*\*, both connected toward the hot bus and an earth symbol underneath, labelled collectively \*\*BATTERIES\*\*. Preserve exact original labels, black connector lines, circuit-breaker/switch symbols, red-orange thick distribution bars, arrowheads and general left-right symmetry. Caption exactly \*\*Figure 8.10 Multi DC generator system block diagram\*\*.

\---

## 20\. Load Shedding

**Load shedding** means deliberately reducing the total current required by the electrical consumers when the system's active power sources cannot support every connected item.

The immediate objective is to keep the demand within the usable rating of the remaining generator or alternator—or, if all generating sources have failed, to **extend battery endurance**. The following features are important:

1. Some aircraft automatically switch away designated non-essential equipment when the system detects a shortage.
2. Other aircraft require the pilot to check **ammeters and load meters** and manually turn off suitable consumers.
3. The total load should stay within the **rated generating capacity** still available.
4. Turning off non-essential equipment decreases the current demanded from the bus bar and protects supply to the essential loads.

An electrical indication of failure, such as **battery discharge or zero generator output**, therefore requires evaluation of which equipment is necessary to continue the flight safely.

\---

## 21\. Generator or Alternator Failure: Recognition and Typical Actions

### 21.1 Instrument indications

The chapter describes two characteristic indications of a failed generating unit:

* The **generator/alternator warning lamp illuminates**.
* The generating-source **ammeter or load meter falls to zero or decreases**, while a **centre-zero battery ammeter may indicate discharge** as the battery supports the operating loads.

### 21.2 Response sequence described by the chapter

1. **Reduce demand:** switch off unnecessary electrical consumers according to the aircraft's operating instructions, retaining equipment required for the immediate flight situation.
2. **Electrically isolate the defective unit:** select the relevant **generator/alternator master switch OFF**. This opens its field/excitation circuit and allows generated voltage to fall to essentially zero or a residual value.
3. **Confirm protective isolation:** a generator cut-out or reverse-current relay normally prevents the failed generator from continuing to connect improperly to the bus bar.
4. **Monitor the remaining power source:** use the instruments to check the electrical load and the battery's condition, and keep non-essential devices disconnected when supply is limited.

**Important operational distinction:** These are principles from an ATPL theory text. Actual crew actions and switching sequences must follow the approved **aircraft-specific checklist/QRH**, not a generic study-note procedure.

\---

## 22\. Consolidated Technical Reference

|Item|Important value or function|
|-|-|
|Nominal battery in 14 V generating system|12 V|
|Nominal battery in 28 V generating system|24 V|
|Overvoltage threshold in the text's 14 V example|Approximately 16.5 V|
|Incoming generator differential cut-out condition|Approximately 2% above voltage of online generator|
|Representative static inverter input|18–30 V DC|
|Representative static inverter output|115 V AC, 400 Hz|
|Parallel-generation example|28 V DC generators|
|Batteries in the parallel-system example|24 V DC|
|Typical minimum essential-service battery period cited|30 minutes|
|Generator cut-out closes|Generator voltage rises to sufficient level|
|Generator cut-out opens|Reverse current / generator voltage below battery voltage|
|Charge/discharge ammeter left of zero|Battery supplying current|
|Load meter zero|Generating unit supplying no output current|
|Rectifier|AC to DC|
|Inverter|DC to AC|
|Ammeter range increase|Low-resistance shunt in parallel with instrument|
|Voltmeter range increase|High-resistance multiplier in series with instrument|
|Unipole return path|Conductive aircraft structure|
|Dipole return path|Separate negative wire|

\---

# 23\. Chapter Practice Questions — Rewritten from the Four Original Groups

The following **39 multiple-choice questions** follow the textbook's four question groups and preserve their principal knowledge checks and answer logic. Their wording is independently written. The **answer positions match the source answer key**. Some textbook questions rely on simplified circuit assumptions; where needed, a clarification is included in the explanation.

## Group A — Generator Cut-Out (10 Questions)

**A1. Under what electrical condition should a DC generator reverse-current cut-out disconnect the generating unit?**  
A. Battery voltage is higher than generator voltage.  
B. Distribution voltage is lower than generator voltage.  
C. The generator circuit breaker is reset.  
D. The battery has discharged completely.  
**Answer: A.** A falling generator voltage allows battery current to reverse toward the machine, so the cut-out releases.

**A2. What is the primary reason for fitting a cut-out to a DC generator?**  
A. Reduce battery heating in normal operation.  
B. Keep charge voltage within its rated setting.  
C. Disconnect the generating unit in a crash.  
D. Stop battery discharge through generator windings.  
**Answer: D.** Its central purpose is reverse-current prevention, rather than normal voltage regulation.

**A3. The DC-generator cut-out should open when which voltage relationship develops?**  
A. Connected loads equal the battery voltage.  
B. Outside-air temperature reaches 45°C.  
C. Circuit demand equals generator voltage.  
D. Generator voltage drops below battery voltage.  
**Answer: D.** The difference makes current attempt to flow back into the generator.

**A4. Which unwanted current path does the generator cut-out prevent?**  
A. Battery current traveling into the generator.  
B. Generator current charging the battery.  
C. Load current passing through circuit protection.  
D. Alternator output becoming out of phase.  
**Answer: A.** Reverse-current protection disconnects the generator when it is no longer a useful source.

**A5. A DC generator's cut-out contacts remain stuck closed after engine shutdown. What is the main likely consequence?**  
A. The engine gains mechanical power.  
B. The generator may overheat and burn out.  
C. The aircraft instantly loses all residual magnetism.  
D. No electrical effect can occur.  
**Answer: B.** With the contacts stuck shut, the battery can drive damaging reverse current through the generator.

**A6. Which arrangement prevents excessive circulating current while bringing another generator onto a live bus?**  
A. Ordinary reverse-current relays only.  
B. Connecting generators in series.  
C. Installing alternator rectifiers between them.  
D. Differential cut-outs.  
**Answer: D.** These delay connection until the incoming source's voltage is appropriate.

**A7. Where is a generator cut-out placed electrically?**  
A. In the generator output path, in series.  
B. Within an alternator's rectifier diodes.  
C. Across the generator output in parallel.  
D. Exclusively in the generator field.  
**Answer: A.** Its contacts make or break the generator-to-bus output connection.

**A8. In the textbook's 28 V system with a 24 V battery, approximately at what voltage do the generator cut-out contacts connect?**  
A. 36 V.  
B. 24 V.  
C. 28 V.  
D. 26 V.  
**Answer: D.** The source keys the connection threshold at approximately 26 V, above nominal battery voltage; the precise threshold is device-specific.

**A9. Which named item performs essentially the same function as a DC generator cut-out?**  
A. Rectifier.  
B. Power converter.  
C. Inverter.  
D. Reverse-current relay.  
**Answer: D.** These two names refer to the same generator protection function in this chapter.

**A10. When the generator cut-out is open, how are loads connected relative to the supplying battery?**  
A. All in one series chain.  
B. In parallel across the battery supply.  
C. In a timed sequence with the relay.  
D. By cross-coupling the generator coils.  
**Answer: B.** The battery can independently feed the parallel distribution branches.

\---

## Group B — Generator Circuit 1 (10 Questions)

**B1. What indication arrangement is typical for a twin-engine aircraft with two generators?**  
A. An ammeter per generator and one selectable voltmeter for generator or battery voltage.  
B. A voltmeter for each generator and one selectable ammeter for all outputs.  
C. One shared ammeter and one shared voltmeter only.  
D. Meters displaying only average voltage and current.  
**Answer: A.** Separate current indications identify source contributions; a selected voltmeter monitors each required potential.

**B2. What fundamental physical effect makes a generator produce electrical output?**  
A. Spring action in an electromagnetic coil.  
B. Electromagnetic induction.  
C. Electrostatic induction between stationary plates.  
D. Mechanical rotation without a magnetic field.  
**Answer: B.** Moving conductors and magnetic flux generate an induced EMF.

**B3. Which characteristic does the installed aircraft voltmeter indicate?**  
A. Current flow before relay closure.  
B. The instantaneous rate of current flow.  
C. Electrical potential difference across selected points.  
D. Current flow after relay closure only.  
**Answer: C.** Voltage is the electrical potential difference; it is not current.

**B4. What does illumination of the generator-failure warning generally mean?**  
A. The generator is successfully feeding the battery bus.  
B. The generator is not supplying the bus as required.  
C. The battery itself must be damaged.  
D. Every rectifier diode has failed.  
**Answer: B.** The lamp identifies loss of the generator's contribution to the system.

**B5. Which combined indications are characteristic of a generator failure?**  
A. Falling current indication or discharge, together with a warning lamp.  
B. Increased generator voltage and the warning lamp.  
C. Immediate failure of every consumer, in all configurations.  
D. A rise in engine speed.  
**Answer: A.** Source current falls and battery discharge may become apparent.

**B6. Under what condition should the generator warning lamp illuminate?**  
A. Battery voltage exceeds generator voltage and the cut-out opens.  
B. Only during darkness.  
C. The generator charges an already full battery with no loads.  
D. Battery charge current is momentarily lower than a chosen value.  
**Answer: A.** This condition identifies a generator that can no longer sustain the network.

**B7. After a generator fails, what would normally happen to its ammeter indication?**  
A. Move to maximum voltage.  
B. Decrease toward zero.  
C. Automatically show increased load sharing as a measurement.  
D. Display increased watts.  
**Answer: B.** The generator stops providing its previous output current.

**B8. If one generator fails during flight, which general action matches the textbook's principle?**  
A. Disconnect the good generator.  
B. Shut down and feather the engine with the failed generator.  
C. Turn off the failed unit but leave all loads in use.  
D. Isolate the failed unit and reduce unnecessary electrical consumption.  
**Answer: D.** Load shedding prevents the remaining source from being overloaded. Aircraft-specific procedures govern actual action.

**B9. What does it mean to connect a generator 'on line' in a multiple-generator system?**  
A. Wire it in series with the other generators.  
B. Connect it in parallel to the energized aircraft electrical system.  
C. Connect it only to a ground starting battery.  
D. Feed it through a phase-reducing circuit.  
**Answer: B.** A generator is on line when connected and supplying the shared electrical network.

**B10. One of two operating aircraft generators fails. What must happen to that generator?**  
A. It must be electrically isolated from the system.  
B. Cooling airflow must always be reduced.  
C. Its driving engine must necessarily stop.  
D. Both electrical sources must be disconnected.  
**Answer: A.** Isolating the failed source protects the remaining power-distribution network.

\---

## Group C — Generator Circuit 2 (10 Questions)

**C1. Which rising quantity causes a DC generator to be connected through its cut-out?**  
A. Battery voltage.  
B. Radio bypass-switch potential.  
C. Generator output voltage.  
D. Voltage drop across an unrelated field switch.  
**Answer: C.** The shunt winding operates as generator voltage builds to the appropriate threshold.

**C2. What indications together suggest a generator failure?**  
A. Load-sharing equipment activates with no other signs.  
B. Ammeter output falls or shows discharge, and the warning lamp illuminates.  
C. Voltmeter indication necessarily increases sharply.  
D. All electrical instruments must stop immediately.  
**Answer: B.** Falling generated current and a failure warning identify a lost source.

**C3. A twin-engine aircraft loses only the electrical generator fitted to its right engine. What should be expected of engine operation in this question?**  
A. The right engine automatically stops.  
B. The left engine automatically stops.  
C. Both engines can continue operating normally.  
D. The right engine automatically feathers.  
**Answer: C.** Failure of an engine-driven electrical generator does not itself require engine shutdown.

**C4. Which circuit arrangement is used for individual loads on a bus bar?**  
A. Series connection to reduce all load voltage.  
B. Parallel connection solely to make voltage adjustable.  
C. Parallel branches with their individual demands contributing to system current.  
D. Connection determined only by the feeder cable's thickness.  
**Answer: C (source key).** Loads are connected **in parallel**; the source's wording about reducing current is imprecise. Parallel branches share supply voltage, and the **total source current is the sum of branch currents**—parallel connection does not inherently reduce total current.

**C5. What occurs when the battery master switch disconnects the battery during flight in the arrangement described?**  
A. All generating sources are disconnected from the bus.  
B. The battery is isolated from the bus bar.  
C. The battery discharges through bonding diodes.  
D. The battery must overheat.  
**Answer: B.** The battery switch controls its connection to the distribution network.

**C6. Which event removes a generator from the electrical network?**  
A. Closing the battery switch.  
B. Closing its excitation switch.  
C. Opening the generator cut-out.  
D. Simply switching off one load.  
**Answer: C.** Opening the output relay disconnects the generator from the bus.

**C7. After engine shutdown, a generator-related ammeter still shows +5 A. What does the textbook's answer key identify?**  
A. Some cabin switches are necessarily left on.  
B. The stopped generator is charging the battery.  
C. The generator field switch must be on.  
D. The ammeter is defective.  
**Answer: D (source key).** A genuine charging indication from a stopped, isolated generator is not expected; interpretation depends on exactly how that meter is installed.

**C8. An ammeter shows no battery charging current, while independent evidence shows the battery remains charged. What is a possible explanation emphasized by this question?**  
A. Loose battery terminals must always be responsible.  
B. Voltage regulation must be completely lost.  
C. Every circuit breaker must have tripped.  
D. The ammeter could be defective.  
**Answer: D (source key).** Absence of a charge indication alone does not prove the battery is defective; a full battery may also need little charging current in practice.

**C9. What is the purpose of a generator-field switch?**  
A. To stay permanently closed regardless of circumstances.  
B. To act as the main armature-output contact.  
C. To interrupt excitation of the generator field.  
D. To isolate only the aircraft battery.  
**Answer: C.** Removing excitation takes the unit out of normal generating operation.

**C10. Which instrument commonly gives a clue that the generator cut-out is malfunctioning during flight?**  
A. A battery-temperature indication alone.  
B. The ammeter.  
C. The cockpit lighting circuits alone.  
D. The current limiter without any indication.  
**Answer: B.** An abnormal current-flow indication can reveal that the generator is not connecting or disconnecting properly.

\---

## Group D — Electrical Distribution (9 Questions)

**D1. Which condition represents a short circuit in an aircraft earth-return system?**  
A. The supply conductor is broken open.  
B. One parallel load becomes disconnected.  
C. A positive supply conductor touches the earthed airframe.  
D. The load's earth-return circuit becomes open.  
**Answer: C.** A positive-to-airframe fault creates an unintended low-resistance path.

**D2. In the textbook's protected two-wire circuit, what is the expected result of a short between supply and return conductors?**  
A. The equipment operates even with its switch open.  
B. The component stops operating when its protection interrupts the fault.  
C. Bus voltage necessarily increases.  
D. The equipment must burn out before protection operates.  
**Answer: B (source key).** A short can draw excessive current and operate protection; actual damage depends on fault and protective-device behavior.

**D3. How can the current range of a sensitive moving-coil ammeter be extended?**  
A. Fit a low-resistance shunt in parallel with the meter.  
B. Put the shunt across the load instead.  
C. Put the shunt in series with the moving coil.  
D. Put a high-resistance multiplier across the meter.  
**Answer: A.** The parallel shunt diverts most current around the meter movement.

**D4. What name is given to a system using the metal aircraft as the current return?**  
A. Diode-pole circuit.  
B. Earth-return circuit.  
C. Single-phase AC circuit.  
D. Two-wire dipole circuit.  
**Answer: B.** The airframe acts as the negative conductor.

**D5. In a single-pole circuit, a positive conductor accidentally contacts the aircraft structure. What would typically happen?**  
A. The normal load automatically operates.  
B. Circuit protection opens the faulted branch.  
C. The load becomes harmlessly underloaded.  
D. Equipment continues operating at half speed.  
**Answer: B.** A positive-to-earth short normally produces enough fault current to operate the fuse or circuit breaker.

**D6. What describes a dipole circuit correctly?**  
A. Source polarity changes during normal use.  
B. A supply wire and airframe return are always used.  
C. One wire supplies the load and a second wire returns the current.  
D. A special immunity circuit provides the return.  
**Answer: C.** Two separate conductors complete the circuit.

**D7. If the supply conductor in an earth-return circuit breaks open, what happens to its load?**  
A. The fuse must necessarily blow.  
B. All bus bars overheat immediately.  
C. The load cannot operate.  
D. The generator must burn out.  
**Answer: C.** No complete supply path remains.

**D8. Which bus has a continuous electrical connection to the battery in the illustrated aircraft system?**  
A. The hot battery bus.  
B. The galley bus.  
C. Every essential bus.  
D. Every non-essential bus.  
**Answer: A.** The source specifically uses **hot bus** for a permanently battery-connected distribution point.

**D9. Which feature defines a dipole electrical system?**  
A. The use of diode rectifiers.  
B. Three separate conductor wires.  
C. The airframe as the normal current return.  
D. Two individual conductors for supply and return.  
**Answer: D.** It is a two-wire circuit by definition.

\---

## 

