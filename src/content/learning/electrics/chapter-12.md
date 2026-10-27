# Chapter 12 — AC Electrics: Alternators

## 1\. Why Large Aircraft Use AC Power

As the electrical equipment installed in transport aircraft became more demanding, the electrical supply had to deliver more power without an impractically heavy system. Consequently, **alternating-current generation and distribution** became the normal arrangement in large commercial aircraft.

The conventional constant-frequency three-phase aircraft supply is specified as **115/200 V, 400 Hz, three-phase AC**. In this description, 115 V is the phase-to-neutral value and 200 V is the line-to-line value of a star-connected system. Equipment requiring direct current normally receives **28 V DC** from **transformer rectifier units (TRUs)**, which convert the aircraft's AC supply. Batteries remain available for emergency or standby duties.

Like a DC distribution system, an AC installation uses a hierarchy of **bus bars** so that vital services can continue receiving electricity after selected failures. A multi-generator arrangement may keep each generator electrically separate or connect suitable generators **in parallel** to share the available load. This chapter examines alternator construction, output, frequency regulation, generator interconnection, protection, and emergency supply arrangements.

## 2\. Generators and Alternators

An **alternator** is an electrical machine that produces AC. Its moving assembly is the **rotor**, while the stationary assembly is the **stator**. In a DC generator, the armature is the rotating member; an AC alternator may instead rotate its field while keeping the output windings stationary.

### 2.1 Rotating-Armature Alternator

In the rotating-armature arrangement, the armature coils turn inside a stationary magnetic field. Their movement induces an alternating electromotive force. Rather than passing through a DC commutator, the generated AC reaches the external circuit through **slip rings** and brushes.

The configuration resembles a conventional DC generator mechanically, but its output is not commutated into DC. The arrangement is mainly suitable for **very small electrical outputs** rather than the main AC supply on a large aircraft.

### 2.2 Rotating-Field Alternator

In the much more common rotating-field arrangement, the **magnetic field turns** and the **armature output windings do not**. The rotor magnetic field may come from a permanent magnet or from an external excitation system, although the field-winding excitation in this type of alternator must be **DC** to maintain the required magnetic polarity.

Only the relatively small excitation current needs to reach a rotating field through slip rings. The potentially large generated output is collected from stationary stator windings. This substantially reduces the high-current brush-gear and arcing problems that would accompany a rotating output winding.

> \*\*Image Generation Prompt — Figure 12.1 Rotating field alternator\*\*
>
> Reconstruct the textbook's wide technical diagram headed \*\*“ROTATING FIELD AC GENERATOR (ALTERNATOR)”\*\*, with two views side by side: a circular \*\*cross section\*\* at left and an elongated \*\*side view\*\* at right. Show a bright yellow annular stationary stator surrounding a grey rotor containing a two-pole red/blue \*\*N/S\*\* magnetic field, a shaft, and small blue electrical nodes; use a curved rotation arrow. At right, show the same rotating field and fixed windings schematically, with stationary armature connections and a small AC sine-wave symbol. Preserve the distinguishing annotations \*\*“Cross section,” “Side view,” “Rotating field,” “Stationary armature,”\*\* and the supply/output symbols as shown. Crisp engineering lines, same relative arrangement, white page background; exact original caption \*\*“Figure 12.1 Rotating field alternator”\*\* below.

### 2.3 How Alternators Are Rated

An alternator's maximum useful current is constrained by the **temperature its armature windings can withstand**. Current in those conductors produces resistive heating; too much heat can damage or destroy winding insulation. The machine is consequently described by its output voltage and by **apparent power** in **volt-amperes (VA)** or **kilovolt-amperes (kVA)**, rather than by watts alone.

## 3\. Single-Phase Generation

A **single-phase alternator** supplies one alternating voltage waveform. Multiple stator coils can be connected in **series-aiding**, so that the voltages induced in them reinforce one another instead of opposing one another. The rotor presents **two opposite magnetic poles**, producing a positive voltage peak, a passage through zero, a negative peak, and a further return to zero in each complete electrical cycle.

> \*\*Image Generation Prompt — Figure 12.2 Single phase alternator\*\*
>
> Precisely reconstruct a landscape textbook diagram headed \*\*“SINGLE PHASE AC GENERATOR (ALTERNATOR)”\*\*. Draw a large circular yellow stator with two rectangular winding areas at its top and bottom and a central vertical grey rotor magnet marked \*\*N\*\* above \*\*S\*\*, with a curved rotation arrow. Lead the two blue output wires horizontally right to a rectangular blue \*\*“BUS BAR”\*\* box and a vertical \*\*“LOAD”\*\* resistor/load symbol; include a sine-wave circle between the wires. Use the exact internal labels \*\*“STATOR WINDING,” “ROTOR,” “BUS BAR,” “LOAD,” “N,” “S”\*\*, and the original caption \*\*“Figure 12.2 Single phase alternator.”\*\* Black, blue, yellow, grey and red details on white, with proportions and wire junctions matching the source.

## 4\. Polyphase Generation

A **polyphase alternator** contains at least two separate sets of stator windings, regularly distributed around the machine. The number of distinct windings determines the number of output phases. Their voltages have the **same frequency**, while reaching corresponding points in their cycles at **different phase angles**.

### 4.1 Three-Phase AC

Aircraft commonly use **three phases**, designated **A, B and C**, separated electrically by **120°**. The stator windings are likewise arranged 120° apart. With the **ABC phase sequence**, the positive peak of phase A occurs first, then B, then C. The three generated voltages form separate but related supplies.

Compared with a single-phase system, a three-phase system offers a **better power-to-weight ratio** and is **more convenient to connect in parallel** when the necessary synchronizing conditions are satisfied.

> \*\*Image Generation Prompt — Figure 12.3 Three phase alternator\*\*
>
> Recreate a textbook two-level illustration headed \*\*“THREE PHASE AC GENERATOR (ALTERNATOR)”\*\*. In the upper section, draw a circular alternator with central rotating two-pole N/S magnet and three surrounding \*\*red, yellow and blue phase windings\*\*, labelled \*\*“PHASE A,” “PHASE B,” “PHASE C,”\*\* spaced \*\*120°\*\* apart. Below show three overlapping sinusoidal traces, individually colored red, yellow and blue, displaced 120° on the common horizontal axis, with \*\*“VOLTS”\*\*, polarity markers \*\*+ / −\*\*, the 120° annotation and \*\*“ONE CYCLE OF ALL PHASES”\*\* beneath. Show A peaking before B and C, and retain \*\*“Figure 12.3 Three phase alternator.”\*\* White background and clean technical linework.

## 5\. Connecting Three-Phase Windings

Three-phase outputs can be linked in either a **star (wye/Y)** arrangement or a **delta (Δ)** arrangement. These differ in neutral availability and the relationship between phase and line voltage/current.

> \*\*Image Generation Prompt — Figure 12.4 Star and delta connection for three phase alternators\*\*
>
> Draw two equally sized circuit diagrams side by side below the original headings \*\*“Three phase Star connected”\*\* and \*\*“Three phase Delta connected.”\*\* The left diagram has three windings colored \*\*red A, yellow B and blue C\*\*, joined at one central \*\*“Neutral”\*\* point, with three free line terminals at the outside. The right diagram connects the three colored windings end-to-end into a closed triangular mesh with three line terminals and \*\*no neutral\*\*. Preserve phase letters, colored coils, dark terminal dots, the central neutral symbol on the left, and the exact caption \*\*“Figure 12.4 Star and delta connection for three phase alternators.”\*\* Plain white aircraft-electrics textbook style.

### 5.1 Four-Wire Star Connection

For a four-wire **star system**, one end of each of the three phase windings joins at a common **neutral point**. The other three ends are the individual line terminals. In the aircraft arrangement described, the neutral is normally connected to earth and can serve as the return path. It carries any **unbalanced current**; therefore an earth fault affecting one phase can cause a very large neutral current.

Because independent loads on the three bus bars need not be equal, a star system with a neutral is suitable for ordinary aircraft distribution.

There are two different voltage measurements:

* **Phase voltage:** between one line terminal and neutral.
* **Line voltage:** between any two line terminals.

The second is the **vector difference** of two phase voltages, so in a balanced star system its magnitude is greater:

$$
V\_{\\mathrm{line}} = \\sqrt{3}\~V\_{\\mathrm{phase}} \\approx 1.73\~V\_{\\mathrm{phase}}
$$

For the standard **200 V line voltage**, the phase voltage is about **115 V**:

$$
V\_{\\mathrm{phase}}=\\frac{200}{\\sqrt{3}}\\approx115.47\~\\mathrm{V}
$$

The source uses the rounded engineering description **115/200 V, 400 Hz, three-phase AC**. Unlike the voltage values, **line current equals phase current** in a star-connected generator because there is only one conducting path from each line through its phase winding.

$$
I\_{\\mathrm{line}} = I\_{\\mathrm{phase}}
$$

> \*\*Image Generation Prompt — Figure 12.5 Star connected alternator\*\*
>
> Produce the source's four-wire star-connection schematic using three \*\*yellow, red and blue\*\* coils labelled for \*\*Phase A, Phase B and Phase C\*\*, connected at a black neutral junction. Above are colored outgoing line conductors with a red arrow \*\*“Iₗ = Line current”\*\*. Show a phase-A resistor/load and B/C phase loads at right, two voltmeter circles marked \*\*“V”\*\*, one labelled \*\*“Phase voltage”\*\* measured line-to-neutral and one \*\*“Line voltage”\*\* measured line-to-line; mark \*\*“Neutral point”\*\*, earth/ground return, and \*\*“Phase loads”\*\* where present. Retain physical color scheme, wire paths, labels, and original caption \*\*“Figure 12.5 Star connected alternator.”\*\* Diagram centered on a white technical page.

### 5.2 Delta Connection

In **delta**, the ends of the three phase windings join into a **closed triangular circuit**. Each line is attached at a corner, and the loads are connected correspondingly. Since a single winding lies directly between each pair of line terminals, the **line voltage equals phase voltage**. The line current is the vector sum of currents from adjacent windings, giving:

$$
V\_{\\mathrm{line}}=V\_{\\mathrm{phase}},\\qquad I\_{\\mathrm{line}}=\\sqrt{3}\~I\_{\\mathrm{phase}}
$$

The chapter does not use delta for normal aircraft bus distribution because there is **no neutral point** available to accommodate the particular unbalanced-load arrangement described. Delta windings can still be useful in specialized equipment, including **speed sensors and tachogenerators**.

> \*\*Image Generation Prompt — Figure 12.6 Delta connected alternator\*\*
>
> Recreate a wide electrical training schematic of a \*\*three-phase delta alternator\*\*. At left, three color-coded \*\*red A, yellow B and blue C\*\* coil groups form a triangular closed winding network connected to three output lines. At right, connect three correspondingly colored rectangular \*\*A/B/C phase loads\*\* into a second closed delta. Add current-flow arrows with the exact meaning \*\*“Line current = Phase current × √3”\*\*, and voltage test circles with the label \*\*“Phase voltage = Line voltage.”\*\* Keep original phase letters, current arrows, winding colors and junctions, plus exact caption \*\*“Figure 12.6 Delta connected alternator.”\*\* Plain white background.

### 5.3 Connection Summary

|Property|Star / wye|Delta|
|-|-|-|
|Neutral connection|Available|Absent|
|Voltage relationship|Line = √3 × phase|Line = phase|
|Current relationship|Line = phase|Line = √3 × phase|
|Use in the chapter|Main aircraft distribution|Selected special-purpose devices|

## 6\. Practical Alternator Construction

The basic rotating-armature concept has several engineering disadvantages: the rotating coils are comparatively **heavy**, develop significant **centrifugal forces**, are hard to **insulate** reliably and difficult to **cool**. Large output currents must pass through brushes/slip rings, increasing contact resistance, and the arrangement gives a less favorable **power-to-weight ratio**.

A practical aircraft alternator therefore normally places the **main output windings in the stator** and uses a **rotating field**. Such machines may be *brushed* or *brushless*.

### 6.1 Brushed Rotating-Field Alternator

A brushed machine supplies the rotor's field using **DC through brushes and slip rings**. Initial field current may come from the aircraft **28 V DC bus/battery**, with later excitation supplied by **rectified AC** once the generator is operating. A voltage regulator samples the approximately **115 V AC** output and adjusts field excitation to maintain the correct output voltage as aircraft loads or generator operating conditions change.

A simple illustration of voltage regulation is a **variable resistance placed in series with the field winding**, comparable in principle to the carbon-pile regulator discussed elsewhere in the textbook.

> \*\*Image Generation Prompt — Figure 12.7 Brushed alternator\*\*
>
> Reconstruct the original left-to-right block schematic, titled \*\*“Figure 12.7 Brushed alternator.”\*\* At left is a shaft arrow \*\*“Input drive”\*\* driving a dashed-outline \*\*“ALTERNATOR”\*\* assembly with a \*\*“Rotating field”\*\* and \*\*“Stationary armature”\*\*; show \*\*“Slip rings and brushes”\*\* transferring \*\*“Excitation current”\*\* to the rotor. At right use a horizontal blue line terminating in a boxed \*\*“115 V AC BUS”\*\*, a \*\*“Voltage sample input”\*\* into a \*\*“VOLTAGE REGULATOR”\*\* with a red zigzag \*\*“Variable resistance”\*\*, a \*\*“Rectifier”\*\*, a \*\*“TRU”\*\*, and a red \*\*“28 V DC BUS BAR”\*\* with earth symbol. Include the source note \*\*“ONLY ONE PHASE SHOWN FOR CLARITY.”\*\* Preserve arrowheads, wire junctions, blue AC and red DC paths and placement.

### 6.2 Brushless Rotating-Field Alternator

A **brushless alternator** avoids physical electrical contacts supplying the main rotating field. An **exciter generator**, installed on the same shaft as the main generator, develops AC in a **rotating exciter armature**. A **rotating rectifier** converts it to DC and feeds it directly to the main rotor field. The main machine's stator then delivers the aircraft's AC output.

Voltage regulation is achieved indirectly: changing the **exciter's field strength** alters the DC supplied to the main field, which alters the final output voltage. Because there are no main field brushes to wear, brushless construction offers **reliability**, lower brush maintenance, and a good **power-to-weight ratio**.

Some designs add a third, same-shaft unit called a **permanent-magnet generator (PMG)** to energize the exciter generator. A conventional full aircraft output is **115/200 V, 400 Hz, three phase**. The chapter distinguishes **externally excited** brushless systems (no residual exciter magnetism) from **self-excited** systems (some residual exciter magnetism).

> \*\*Image Generation Prompt — Figure 12.8 Brushless alternator\*\*
>
> Technical wiring schematic labeled \*\*“Figure 12.8 Brushless alternator.”\*\* Draw a common horizontal mechanical shaft through three aligned generating sections: left \*\*“MAIN GENERATOR”\*\*, center \*\*“EXCITER GENERATOR”\*\*, and \*\*“ROTATING RECTIFIER”\*\* on the shaft. Show stationary excitation coils and spinning armature coils, with yellow field regions, red DC wiring and blue generated-AC wiring. At upper right, connect output to \*\*“115 V AC BUS”\*\*, and show a regulator path with \*\*“VOLTAGE SAMPLE INPUT”\*\*, \*\*“VOLTAGE REGULATOR”\*\* and rectifier/diode symbol. A \*\*“TRU”\*\* feeds the lower \*\*“28 V DC BUS BAR”\*\* and grounding symbol. Preserve the separation of stator and rotor elements, all colored paths and directional arrows. White source-like engineering layout.

## 7\. Controlling Frequency

### 7.1 Frequency-Wild Generation

The electrical frequency produced by an alternator depends on how quickly its field rotates. When the generator is connected directly to an engine gearbox, changes in engine speed change the output frequency. Such a supply is described as **frequency wild**.

Directly paralleling two frequency-wild alternators is not permitted in the textbook arrangement. However, varying frequency does not prevent their use for **resistive electrical de-icing heater mats** because those loads are not materially affected by changes in supply frequency.

### 7.2 Converting Variable-Frequency AC to Constant-Frequency AC

One solution is electronic conversion: **rectify the variable-frequency AC into DC**, filter it, then feed that DC into a **static inverter** that produces a controlled-frequency AC supply. The conversion separates the final frequency from the generator's changing mechanical speed.

### 7.3 Constant-Frequency Generation by Mechanical Speed Control

Another approach is to keep the alternator itself rotating at constant speed, despite engine speed changing in flight. A **constant speed drive unit (CSDU)** provides this mechanical regulation.

The chapter describes a CSDU using an engine-driven **hydraulic pump** to power a **hydraulic motor**, which turns the alternator. A distinct internal reservoir holds the working oil, which also assists lubrication and cooling; it is **separate from the engine oil system**. A variable **swash-plate angle** changes pump output, a **speed governor** manages that angle, and a **load controller** responds to electrical output frequency, varying transmitted drive torque as needed.

Most units described can keep the nominal **400 Hz** output within about **±5%**, or **380–420 Hz**. Mechanical protection is provided by a **quill drive**, designed as a deliberate weak link if an alternator fault creates excessive mechanical load.

The drive's operating relationships are:

|Mode|Engine speed relative to generator speed|
|-|-|
|**Overdrive**|Engine speed is lower|
|**Straight-through**|Speeds are equal|
|**Underdrive**|Engine speed is higher|

When generator and CSDU are built as one assembly the chapter calls it an **integrated drive unit (IDU)** or **integrated drive generator (IDG)**.

### 7.4 CSDU Warning Indications

The main cockpit-related indications described are **low oil pressure**, which warns when pressure drops below a set threshold, and **high oil temperature**, which monitors overheating at the drive's oil outlet. These warn of conditions in the self-contained drive mechanism, not simply a problem with the electrical output.

### 7.5 Drive Disconnect Mechanism

A serious fault in either the constant-speed unit or alternator can justify removing the mechanical drive so the damaged assembly stops turning and cannot compromise engine operation. A pilot-operated **momentary-action drive-disconnect switch** energizes a solenoid that separates the drive coupling; on some aircraft, a **generator control unit (GCU)** can initiate this action automatically for specified failures.

**Disconnection is possible while the engine is running, but reconnection is a ground maintenance action performed after engine shutdown.** The textbook's mechanically driven CSDU example therefore does not provide an in-flight reconnect capability.

> \*\*Image Generation Prompt — Figure 12.9\*\*
>
> Rebuild the textbook's simple horizontal CSDU/alternator block diagram. Across the top from left to right place \*\*“Engine Input Drive” → “Disconnect Unit” → “Constant Speed Drive Unit”\*\* (a rectangle containing \*\*P / M\*\* hydraulic pump/motor symbolism) → \*\*“Generator” → “3 phase output”\*\* with three red/yellow/blue line ends. Under the system add \*\*“Disconnect Switch”\*\* and coil box \*\*“DISC”\*\*, the \*\*“TEMP / OIL PRESS”\*\* warning box, \*\*“Oil system warnings”\*\*, a \*\*“Speed governor”\*\*, \*\*“Load controller”\*\*, and \*\*“Frequency sampling 400 Hz.”\*\* Connect all items with red control/sensor wires matching the figure. Preserve the exact numbered caption \*\*“Figure 12.9”\*\*, the source's left-to-right geometry and labels.

### 7.6 Variable-Speed Constant-Frequency (VSCF) Systems

A **VSCF installation** dispenses with the hydromechanical drive by allowing a directly driven alternator to produce variable-frequency AC. A **generator converter control unit (GCCU)** uses a **full-wave rectifier and filter** to create a DC link, then an **inverter** to supply **115/200 V, 400 Hz, three-phase AC**.

Removing the mechanical CSDU also removes its associated hydraulic speed-control components. The conversion equipment need not sit in the engine compartment, which improves packaging flexibility and reduces mechanical servicing demands. The source cites **Boeing 737 aircraft and certain military aircraft** as examples of applications, and describes a built-in test function that provides fault-isolation information for ground engineers.

### 7.7 Self-Excited Generators

Where an exciter retains magnetic flux from **permanent magnets or residual magnetism**, initial rotation induces AC in the exciter rotor. **Rotating rectifiers** convert that current to DC for the main rotating field. Some main-stator output is then used to furnish a regulated excitation supply, allowing output voltage to be controlled after generation has begun.

## 8\. Why Alternators Are Operated in Parallel

If several **constant-frequency generators** feed the same distribution network, the system must prevent one machine from carrying too much of the total demand. This means balancing **real power** and **reactive power** separately.

* **Real power (kW):** the part that performs useful work, closely associated with the **mechanical torque / power** supplied by the engine and CSDU.
* **Reactive power (kVAR):** the wattless contribution associated with inductive and capacitive effects and the phase relation between voltage and current. Its sharing is governed primarily by **excitation and generator output voltage**.

An alternator feeding its own isolated bus **does not participate in the parallel-system load-sharing circuits**. Those circuits become active only after it is connected to the other generators.

### 8.1 Conditions Required Before Paralleling

Alternators about to connect to a common AC bus must match **frequency, output voltage, instantaneous phase relationship and phase sequence**. Differences would cause strong circulating currents or mechanical reactions as synchronous machines attempt to pull into step. Once interconnected, their frequencies lock together and the operating frequency reflects the control of the connected system.

> \*\*Image Generation Prompt — Figure 12.10 Conditions required before paralleling\*\*
>
> Recreate four vertically stacked comparison strips of three-phase \*\*red, yellow and blue\*\* sinusoidal waveforms from \*\*Gen 1\*\* and \*\*Gen 2\*\*. The top three strips each end with a bold \*\*red X\*\* for a different synchronization failure: \*\*“Frequency different / Phase sequence same / Voltage same”\*\*, \*\*“Frequency same / Voltage same / Phase sequence different”\*\*, and \*\*“Frequency same / Voltage different / Phase sequence same”\*\* (use the source's line annotations). The bottom strip ends with a large green check mark and \*\*“Frequency same / Voltage same / Phase sequence same”\*\*, with the waveforms aligned in phase. Preserve waveform overlays, the four comparison rows, right-hand explanation blocks, and original caption \*\*“Figure 12.10 Conditions required before paralleling.”\*\* White background.

### 8.2 Bus-Bar Arrangement in a Three-Generator System

Each three-phase generator connects through its own three-pole **generator circuit breaker (GCB)** to an individual **three-phase generator bus**. The three bus bars are linked to a **synchronizing bus** through their **bus tie breakers (BTBs)**, also three-pole circuit breakers. Their operation may be automatic or under flight-deck command.

Normal loads attach to the **generator bus bars**, not directly to the synchronizing bus. The latter exists chiefly to **interconnect generating sources for parallel operation**. When the engine generators are not feeding the system and their GCBs are open, **APU or external ground power** can supply the synchronizing bus, then feed the load buses via suitable BTBs.

> \*\*Image Generation Prompt — Figure 12.11 Three generator paralleled system\*\*
>
> Reproduce a symmetric three-column block schematic with three circular sources labelled \*\*“GEN 1,” “GEN 2,” “GEN 3”\*\* along the top. Under each source show its three colored A/B/C phase conductors, individual \*\*“GCB NO.1/2/3”\*\* symbols and individual thick three-phase \*\*“GEN BUS 1/2/3”\*\* bars. Beneath each bus place \*\*“BTB NO.1/2/3”\*\* and connect all three vertically down to one long lower multicolored \*\*“SYNCHRONIZING BUS.”\*\* At lower left add incoming \*\*“GROUND POWER OR APU”\*\* arrows. Keep the figure's red/yellow/blue colors and labelled breaker positions exactly; caption \*\*“Figure 12.11 Three generator paralleled system.”\*\*

## 9\. Real Load Sharing

A paralleled alternator's share of **kW** depends on the **driving torque supplied to it**. Each generator's load controller maintains nominal **400 Hz** and adjusts its CSDU governor relative to the others. Increasing drive torque makes that alternator supply more real power; reducing it decreases its contribution.

### 9.1 Current-Transformer Error Circuit

**Current transformers (CTs)** sense how much current each generator delivers. Their outputs participate in a common comparison loop. At balance, the source's example uses **5 A from each transformer**, and **no current passes through the error detectors**.

If generator 1 supplies too much power, the example shows its CT output rising to **7 A**, while generators 2 and 3 each fall to **4 A**. The average remains **5 A**:

$$
\\frac{7+4+4}{3}=5\~\\mathrm{A}
$$

The respective departures from the average are **+2 A, −1 A and −1 A**. The comparison/error circuits sense these deviations, and amplified corrective signals command **generator 1 to reduce torque** while generators 2 and 3 **increase torque**. This continues until the transformer outputs and kW sharing are balanced again.

> \*\*Image Generation Prompt — Figure 12.12 Real load sharing circuit\*\*
>
> Recreate the source's three-generator real-power-sharing circuit with three top circles \*\*“GEN1,” “GEN2,” “GEN3”\*\*, three-phase output conductors at the top and a common red horizontal comparison loop with a \*\*5 A\*\* reference arrow. At each generator draw a current-transformer pickup with a small red winding, connected downward to separate dashed-outline boxes \*\*“ERROR DETECTOR”\*\* and \*\*“MAGNETIC AMPLIFIER.”\*\* Preserve the deliberately unbalanced transformer values \*\*7 A, 4 A, 4 A\*\*, reference values \*\*5 A\*\*, and correction currents \*\*2 A, 1 A, 1 A\*\*, plus labeled outputs \*\*“TO SPEED GOVERNOR NO.1 / NO.2 / NO.3.”\*\* Same circuit geometry and arrows, exact original caption \*\*“Figure 12.12 Real load sharing circuit.”\*\*

## 10\. Reactive Load Sharing

A separate circuit compares how much **kVAR** each alternator provides. The sensing arrangement resembles the real-load circuit, but a **mutual reactor**, functioning as a phase-shifting transformer, selects the component of current **90° out of phase with voltage**. This isolates the reactive contribution for comparison.

Amplified error signals alter **exciter field current** through the **voltage regulators**: the lower-voltage generator is commanded to raise its output, while the higher-voltage unit is commanded to lower its output. Reactive loads consequently move back toward equal sharing.

> \*\*Image Generation Prompt — Figure 12.13 Reactive load sharing circuit\*\*
>
> Engineering diagram matched to Figure 12.12's three-generator current-sharing layout, but show the reactive-control components. Three sources \*\*GEN1, GEN2, GEN3\*\* appear across the upper edge, with current transformers, red loop conductor and marked \*\*5 A\*\*, \*\*7 A\*\*, \*\*4 A\*\*, \*\*4 A\*\* and error deviations \*\*2 A / 1 A / 1 A\*\*. The lower dashed-line boxes include \*\*“MUTUAL REACTOR”\*\*, a note \*\*“PART OF VOLTAGE REGULATOR”\*\*, and \*\*“ERROR DETECTOR”\*\* for each generator; outputs lead to the individual \*\*generator field circuits\*\* instead of speed governors. Preserve the signal arrows, multicolored phase connections, all visible labels, and \*\*“Figure 12.13 Reactive load sharing circuit.”\*\*

### 10.1 Real Versus Reactive Control — Memory Table

|Controlled quantity|Sensed/measured as|Corrected by|
|-|-|-|
|Real load|**kW**|**CSDU speed/torque/governor**, via load controller|
|Reactive load|**kVAR**|**Exciter/field current and output voltage**, via voltage regulator|

Three- or four-generator aircraft can operate parallel sets using more channels of the same control circuits. Many modern two-generator/twin-engine aircraft instead operate as **split-bus** systems, in which engine generators remain normally isolated. Any source removed from a parallel group is also removed from the shared load-control circuits.

## 11\. Alternator Cooling

Electrical losses in stator conductors become **heat**, so aircraft alternators need cooling even during otherwise normal operation. **Frequency-wild machines** and constant-frequency installations with a separate drive commonly use **ram air in flight** and an induced airflow on the ground. **Integrated drive generators (IDGs)** often cool the stator with internal **oil**, then circulate that oil through a separate cooler.

## 12\. Generator Fault Protection

A parallel aircraft electrical system has to **detect abnormal output**, **disconnect a faulty source or bus**, and **keep unaffected buses supplied**. The chapter identifies protective devices including BTBs, discrimination circuits, differential protection, synchronizing controllers, warnings, meters and GCUs.

### 12.1 Bus Tie Breakers

The **BTB** connects a generator bus to the synchronizing network. A suitable **synchronizing signal** must authorize closure when a bus will be put in parallel with another source. In the chapter's typical arrangements, BTBs are **normally closed for parallel buses** and **normally open for split buses**. Status is presented on an electrical panel or electronic display.

### 12.2 Discriminatory Protection

A discriminatory system isolates **only the faulty part** of the network instead of unnecessarily disconnecting healthy systems. It achieves this by selecting the appropriate combination of **GCB and BTB switching**. A faulty bus and its connected source can then be separated while the remaining network is reconfigured where possible.

### 12.3 Differential Fault Protection and BPCU

A **bus power control unit (BPCU)** or comparable controller compares sensed currents from generators and bus-bar locations using **current transformers**. Differences beyond accepted limits can indicate a fault within the protected section, allowing circuit breakers to trip selectively.

The source lists protection against **overvoltage**, **undervoltage**, **overfrequency**, **underfrequency**, **overexcitation**, **underexcitation** and **differential-current faults**, including **bus-to-bus shorts, bus-to-earth shorts, and open-circuit/phase-output imbalance**.

### 12.4 Synchronizing Devices

Before a second alternator joins an energized common bus, a **synchronizer** must establish that **voltage, frequency, phase and sequence** are acceptable. Automatic circuits inhibit closing the **GCB or BTB** until synchronization is satisfactory. This logic can be built into a BPCU or the GCUs.

Some older installations use a manual **dark-lamp synchronization system**: lamps glow when the supplies differ and go dark at the required matching point, permitting breaker closure under the approved procedure.

### 12.5 Warnings and Meters

A generator-failure lamp indicates that the associated **GCB has tripped**; a centralized warning, aural alert or electronic system schematic may reinforce the indication.

For parallel operating checks, a load meter may be switched between **kW (real load)** and **kVAR (reactive load)**. The source notes that **kW is normally shown**, with kVAR selected when required. More recent electronic displays may show load as a **percentage of maximum rated output** instead. Voltage/frequency measurement may use a shared pair of instruments and a selector capable of monitoring engine generators, the APU, external power and possibly the emergency RAT.

### 12.6 Generator Control Unit

The **GCU** coordinates voltage regulation and generator protection. It monitors output and adjusts the **exciter field current**, while supervising frequency, phase sequence, current balance and overvoltage/overcurrent limits. Each generator may have its own GCU, cooperating with the **BPCU** when system isolation is required.

A **generator control relay (GCR)**—also called an **exciter control relay** or **generator field relay**—switches the field excitation supply. For a serious field/output fault, the controller opens this relay, collapsing the generator's controlled output to a small **residual** level, then opens the **GCB** to isolate it. In parallel systems, other sources can continue feeding that generator's load bus through a suitable BTB connection.

## 13\. Emergency and External Power Supplies

The textbook lists several means of powering essential aircraft services if the normal engine-driven AC generation fails:

### 13.1 Ram Air Turbine (RAT)

When deployed into the outside airflow, a **ram air turbine** can turn an emergency electrical generator capable of a nominal **115/200 V, 400 Hz, three-phase** output for limited **flight-instrument and radio** services. The chapter also explains that many modern aircraft favor **RAT-driven hydraulic pumps** instead, as hydraulic power is crucial for emergency operation of powered flight controls.

### 13.2 Auxiliary Power Unit (APU)

An **APU** is normally a small gas turbine installed near the **tail cone**. It operates at essentially constant speed, so its generator does not need a separate constant-speed drive. Its protection covers **fire, low oil pressure, high oil temperature, overspeed and overheat**. The APU can supply **115/200 V, 400 Hz, three-phase AC** for ground operations and, in aircraft so equipped, during airborne emergencies.

The textbook installation does **not parallel the APU generator with engine-driven alternators**; the APU supplies the buses only after other sources have been removed from the relevant bus supply.

### 13.3 Static Inverter

A **solid-state static inverter** takes aircraft **battery or essential-DC-bus power** and produces the specified AC for restricted **instrument and radio** operation. It provides a limited electrical emergency capability without a rotating generator.

### 13.4 Hydraulic-Motor-Driven Generator

The emergency-supply list also includes a generator mechanically driven by a **hydraulic motor**, using available hydraulic power to produce electricity.

### 13.5 External Ground Power

Standard ground AC is described as **115/200 V, 400 Hz, three-phase**. When properly connected it can power all aircraft electrical services on the ground. Protective logic must stop connection when engine generators are already supplying the relevant system, reject **incorrect phase sequence**, and **disconnect the external source after overvoltage**.

## 14\. Typical Flight-Deck Controls and Indications

Figure 12.14 depicts a **three-engine, normally parallel AC system**. It uses illuminated **switch-lights**: some are momentary-action switches, while others toggle from on to off on successive operations. The lamp indicates command or system state.

Important operating and monitoring elements include:

1. **Three engine IDGs:** Each has an oil-temperature gauge, overheat/low-pressure indication and a guarded **drive-disconnect** control.
2. **APU generator:** Uses the APU's steady speed rather than a separate CSDU.
3. **Generator field switching:** A **close** switch-light completes excitation; an associated **trip** action interrupts excitation and reduces controlled output. A flow bar indicates field completion.
4. **Voltage/frequency selector:** Selects **GEN1, GEN2, GEN3, APU, external power or inverter**, for checking source voltage and frequency at the corresponding instruments.
5. **Generator circuit breaker controls:** GCB **close/trip** devices connect or disconnect engine generators from their own AC buses and the APU from the AC tie connection.
6. **Load indicators:** A separate display for each generator normally indicates **kW**; holding the **kVAR** selection changes it to reactive power.
7. **Bus tie breakers:** Commands connect generator AC buses to the **AC tie bus**, making normal three-generator parallel operation possible.
8. **Transformer rectifier units:** Each AC bus feeds a **TRU** that creates **28 V DC** for its corresponding DC bus; DC tie breakers can interconnect these buses and are coordinated by a **DC bus isolation switch**.
9. **DC checks:** Another rotary selector and meters permit **DC volts and amps** to be examined.
10. **Standby/essential buses:** These may take normal AC/DC sources or battery support after extensive failure. **Red FAIL indicators** signal absent voltage on the relevant standby or essential bus.

> \*\*Image Generation Prompt — Figure 12.14 Control and indications for a three-engine parallel system\*\*
>
> Reconstruct the source's large rectangular aircraft overhead electrical-control panel on a white page, preserving its exact three-column layout. Along the top show \*\*IDG TEMP RISE\*\* test at left, \*\*“GALLEY POWER BUS 1 / BUS 2 / BUS 3”\*\* yellow \*\*“OFF”\*\* switch-lights, and three circular \*\*“ENGINE NO.1 / ENGINE NO.2 / ENGINE NO.3”\*\* IDG oil-temperature gauges. Below them put guarded \*\*“IDG DISCONNECT”\*\* switches, each carrying yellow \*\*“OVHT PRESS”\*\* warning blocks. The second tier has \*\*“AUXILIARY POWER UNIT GEN OIL”\*\* and \*\*“GENERATOR FIELD”\*\* close/trip rectangular illuminated switch groups with yellow \*\*“OPEN DIFF”\*\* indicators. Across the middle draw four round \*\*“KW / KVAR”\*\* load meters with \*\*“KVAR”\*\* push button and the full \*\*“GENERATOR BREAKER”\*\* close/trip groups. Below draw three \*\*“AC BUS 1 / 2 / 3”\*\* bars, their \*\*“TIE BREAKER”\*\* switches, \*\*“AC TIE BUS”\*\*, three \*\*“DC BUS”\*\* lines with tie breakers, \*\*“DC TIE BUS”\*\* and \*\*“DC BUS ISOLATION”\*\* switch. At right add a vertical black divider and instrument stack: two analog dials \*\*“FREQ HZ”\*\* and \*\*“AC VOLTS”\*\* with their rotary selector \*\*GEN1 / GEN2 / GEN3 / APU / EXT POWER / INVERTER\*\*, a circular \*\*“PMG TEST”\*\* switch, \*\*“DC VOLTS”\*\* and \*\*“DC AMPS”\*\* gauges, a separate DC source selector \*\*BUS VOLTS / T/R AMPS\*\*, \*\*“BATTERY OFF”\*\*, \*\*“DC STBY BUS”\*\*, \*\*“AC STBY BUS”\*\*, \*\*“AC ESS BUS”\*\*, \*\*“DC ESSENTIAL BUS”\*\* and red \*\*“FAIL”\*\* panels. Preserve the tiny yellow, red, blue and grey indicator states, flow bars, boundary lines and arrowed electrical bus connections as closely as feasible. Include caption exactly \*\*“Figure 12.14 Control and indications for a three-engine parallel system.”\*\* No invented components; use sharp technical annotation and legible labels.

\---

## 15\. Chapter Review — Essential Comparisons

|Topic|Key distinction|
|-|-|
|Rotating armature vs rotating field|Rotating output winding and slip-ring AC vs stationary output winding with rotating excitation|
|Brushed vs brushless|Brush/slip-ring excitation vs exciter and rotating rectifier|
|Star vs delta|Star includes neutral and has line voltage √3 times phase; delta has no neutral, with line current √3 times phase|
|Frequency wild vs constant frequency|Frequency changes with shaft speed vs governed 400 Hz output|
|CSDU/IDG vs VSCF|Mechanical-hydraulic speed regulation vs rectifier–inverter electronic conversion|
|Real vs reactive sharing|Adjust drive **torque** for kW; adjust **excitation** for kVAR|
|GCB vs BTB|Generator-to-its-bus switch vs bus-to-synchronizing-network switch|
|RAT vs APU vs inverter|Airflow-driven emergency generator / constant-speed auxiliary turbine / DC-to-AC solid-state supply|

**Exam caution:** This chapter describes particular aircraft system arrangements and textbook-era examples. The exact architectures, permitted connections, switching logic and emergency electrical procedures of an individual aircraft are determined by its approved documentation; these notes are theoretical study material, not an operating checklist.

\---

## 16\. Chapter Questions — Rewritten Practice Set

All **65 source-question concepts** are retained below. The correct options and explanations are intentionally **collected only at the end** so that you can answer without seeing solutions.

**1. Which device is properly called an alternator?**

* **A.** An input-reversing switch
* **B.** An AC-producing generator
* **C.** A generator delivering DC only
* **D.** An electronic DC-to-AC converter

**2. What must match before two aircraft alternators are paralleled to prevent large circulating currents?**

* **A.** Only voltage and frequency
* **B.** Only frequency and phase sequence
* **C.** Voltage, frequency, instantaneous phase and phase sequence
* **D.** Their inductive and capacitive reactances alone

**3. On a standard rotating-field AC alternator, where is the main output obtained?**

* **A.** Exciter field windings
* **B.** The rotating field winding
* **C.** The stationary armature windings
* **D.** The main rotor coil

**4. What name is given to an alternator's rotating assembly?**

* **A.** Rotor
* **B.** Megacycle
* **C.** Stator
* **D.** Frequency

**5. How are frequency-wild AC generators operated in the described system?**

* **A.** Always together in parallel
* **B.** Only if they use a rotating permanent magnet
* **C.** Only after they become self-excited
* **D.** Without directly paralleling their AC outputs

**6. In the aircraft's normal star-connected three-phase system, how does phase voltage compare with line voltage?**

* **A.** Phase voltage is greater
* **B.** Phase voltage is 10% higher
* **C.** Phase voltage is lower
* **D.** They are equal

**7. Which aircraft loads are most suited to frequency-wild alternator power?**

* **A.** Flight instruments
* **B.** Battery charging
* **C.** Every AC service
* **D.** Resistive propeller/engine de-icing heaters

**8. Which adjustment raises an alternator's generated voltage?**

* **A.** Increasing external load
* **B.** Adjusting only the frequency regulator
* **C.** Reducing field excitation voltage
* **D.** Increasing current through the generator field

**9. Which equipment creates constant-frequency AC from a variable-frequency source after rectification?**

* **A.** Inverter
* **B.** Diode alone
* **C.** Autotransformer
* **D.** Rectifier alone

**10. How many phases normally make up the principal aircraft AC generation system?**

* **A.** One
* **B.** Three
* **C.** Two
* **D.** A variable number dictated by wild frequency

**11. What initial function does a permanent magnet perform in the chapter's exciter arrangement?**

* **A.** Initiates field excitation
* **B.** Sets the magnitude of stator excitation continuously
* **C.** Provides an initial signal only to the regulator
* **D.** Accepts an AC flash to become permanently charged

**12. What is varied to regulate an alternator's generated voltage?**

* **A.** Excitation of a rotating commutator
* **B.** Load current by itself
* **C.** Current in the rotating field
* **D.** Power factor alone

**13. What makes a directly driven alternator's output frequency variable?**

* **A.** An open-circuit transformer
* **B.** Failure of the voltage regulator
* **C.** Changes in generator shaft speed
* **D.** Loss of phase sequence

**14. In a star-connected alternator, which currents are equal?**

* **A.** Line current and phase current
* **B.** Line current exceeds phase current
* **C.** Line current is smaller than phase current
* **D.** Phase current equals 0.707 times line current

**15. Across which connections is line-to-line voltage measured?**

* **A.** Two distinct phase line terminals
* **B.** One phase conductor and earth
* **C.** One phase conductor and neutral
* **D.** All phases tied to earth

**16. What benefit does a three-phase generator offer compared with single-phase equipment?**

* **A.** All aircraft devices must use three phases
* **B.** Rectification into DC is inherently the sole advantage
* **C.** More power with compact generation and less cable mass
* **D.** A necessarily lower power factor

**17. What is the usual phase-to-neutral voltage of an aircraft 115/200 V AC system?**

* **A.** 200 V
* **B.** 115 V
* **C.** 208 V
* **D.** 400 V

**18. What moving field arrangement has output taken from a fixed stator armature?**

* **A.** Stationary field
* **B.** The field current is routed through the output armature
* **C.** Excitation uses alternating current
* **D.** Rotating magnetic field

**19. Between what two points is star-connected phase voltage measured?**

* **A.** A line and neutral
* **B.** Two phases
* **C.** Two separate line conductors
* **D.** Neutral and earth alone

**20. What is the immediate neutral-conductor concern after one phase develops an earth fault in a star system?**

* **A.** All phases become directly grounded
* **B.** A high neutral current may flow
* **C.** The other phases are always unaffected
* **D.** The supply frequency must decrease

**21. Which excitation category does the answer key identify for a main aircraft alternator?**

* **A.** Brushed self-excited only
* **B.** Frequency wild
* **C.** Self-excited
* **D.** Externally excited

**22. How does an alternator voltage regulator vary output voltage?**

* **A.** Monitoring battery voltage alone
* **B.** Estimating impedance only
* **C.** Changing nominal circuit voltage directly without excitation
* **D.** Changing the rotating magnetic field strength

**23. What must be shared properly between alternators operating in parallel?**

* **A.** Both real and reactive components
* **B.** Only the useful work-producing part
* **C.** Only reactive current
* **D.** Only fixed bus impedance

**24. Which control change primarily redistributes reactive power among paralleled machines?**

* **A.** Changing bus-bar consumer loads
* **B.** Changing rotor speed
* **C.** Adjusting generator field current
* **D.** Changing CSDU output torque

**25. What adjustment primarily changes a paralleled alternator's real-power share?**

* **A.** Altering drive speed/torque setpoint
* **B.** Adjusting generator field current
* **C.** Changing the connected bus loads
* **D.** Using the voltage regulator

**26. How should paralleled alternators be related in phase?**

* **A.** The angle does not matter
* **B.** Separated by 180°
* **C.** Synchronized with each other
* **D.** Separated by 120° from generator to generator

**27. For the chapter's constant-speed parallel system, which statement is true?**

* **A.** Each engine-driven alternator has its own CSDU
* **B.** Every engine must run at the same RPM
* **C.** One engine drives all the alternators
* **D.** The CSDU dictates engine speed

**28. What stated frequency tolerance is typical for the CSDU output?**

* **A.** 350–450 Hz
* **B.** 380–420 Hz
* **C.** 115–200 Hz
* **D.** 395–495 Hz

**29. Which AC output specification is required of the aircraft's standard external ground-power unit?**

* **A.** 28 V AC
* **B.** 200 V only
* **C.** 115 V three-phase without frequency specification
* **D.** 115/200 V, 400 Hz, three-phase

**30. Where does the operating oil of a conventional CSDU come from?**

* **A.** The engine's lubrication sump
* **B.** Its separate self-contained oil supply
* **C.** One common tank for all CSDUs
* **D.** A supply needed solely for lubrication

**31. If a CSDU malfunctions, which cockpit action may disconnect the drive?**

* **A.** Automatically electrically isolate the mechanical input in all cases
* **B.** Wait for the input shaft to shear only after landing
* **C.** Operate the drive-disconnect control while in flight
* **D.** Operate the drive-disconnect control only on the ground

**32. What arrangement is required before two constant-frequency generators can safely run in parallel?**

* **A.** Match voltage, frequency, phase and sequence, with automatic real/reactive load-sharing capability
* **B.** Match only real/reactive loading while frequency and phase are left to settle
* **C.** Wait until synchronizing lamps are brightest
* **D.** Allow load sharing to correct arbitrarily large phase/frequency differences after connection

**33. In which part of the system is the generator control relay (GCR) located?**

* **A.** Field excitation circuit
* **B.** Alternator-to-generator-bus power lead
* **C.** Main stator winding
* **D.** Load bus-to-synchronizing-bus connection

**34. What supplies normal running excitation for the alternator's main rotating field?**

* **A.** AC directly
* **B.** Unrectified DC exclusively from the battery
* **C.** DC generated by the static inverter
* **D.** DC derived from rectified AC, potentially from a shaft-mounted exciter

**35. A balanced star supply has 115 V across each phase. Approximately what is line voltage?**

* **A.** 200 V AC
* **B.** 173 V DC
* **C.** 28 V DC
* **D.** 173 V AC

**36. Which protection detects a bus-to-earth or line-to-line fault?**

* **A.** Negative-earth detector alone
* **B.** Differential monitoring within the protection system
* **C.** Synchronizing circuit alone
* **D.** Reactive-sharing comparison alone

**37. What cockpit indication does the book's answer key associate with CSDU oil overheating?**

* **A.** Audible warning only
* **B.** Oil-overheat warning lamp
* **C.** Low-oil-pressure lamp
* **D.** Temperature gauge only

**38. Which drawback is emphasized for paralleled-generator installation?**

* **A.** Every fault necessarily passes to every service
* **B.** No control and protection can be added
* **C.** CSDUs must always have a lower torque rating
* **D.** Greater system complexity from CSDUs and sharing-control circuitry

**39. Why must connected generators keep synchronized frequency and phase?**

* **A.** To balance separate batteries
* **B.** To avoid unwanted circulating current
* **C.** Only to regulate voltage
* **D.** To weaken the magnetic fields

**40. Under what condition is the APU generator connected to supply the buses in the described system?**

* **A.** Only while another generator is supplying power
* **B.** Only while on the ground
* **C.** Only while other supplies remain on those buses
* **D.** Only when no other source is feeding those buses

**41. What comparison is made by differential current protection?**

* **A.** Generator current versus bus-bar current
* **B.** On-load current versus unloaded current only
* **C.** Reactive output versus real output
* **D.** Efficiency of one CSDU versus another

**42. What must an alternator driven through a CSDU still have?**

* **A.** A rule forbidding parallel connection
* **B.** Voltage regulation
* **C.** A lubricating circuit separate from the drive-oil system
* **D.** No voltage-control mechanism

**43. How is the CSDU mechanically protected against a severe alternator seizure?**

* **A.** Drive-disconnect unit automatically separates CSDU from alternator
* **B.** Load controller alone changes real load
* **C.** Designed quill drive fractures as a weak link
* **D.** Reducing CSDU oil temperature

**44. What does the electrical-load meter display on its kVAR setting?**

* **A.** Total available system apparent power
* **B.** Reactive power
* **C.** Real or active power
* **D.** Only resistive DC consumption

**45. When should the CSDU drive-disconnect action be considered according to the chapter?**

* **A.** Any frequency offset above 5 Hz
* **B.** Any voltage departure, even isolated electrical faults
* **C.** High drive-oil temperature or low drive-oil pressure
* **D.** Any engine failure automatically

**46. How can a paralleled AC alternator be made to carry a greater real load?**

* **A.** Increase its mechanical drive torque
* **B.** Increase its field excitation alone
* **C.** Increase torque and excitation together as a required pair
* **D.** Ask voltage regulator to change rotor torque

**47. When are generator load-sharing circuits required?**

* **A.** During series operation
* **B.** When each generator has an isolated bus
* **C.** When APU and external power run together
* **D.** When generators operate in parallel

**48. Which load-meter arrangement is provided for paralleled alternators in the example?**

* **A.** One total-system meter only
* **B.** A dedicated voltmeter for every alternator
* **C.** A load indication for each alternator
* **D.** One instrument measuring voltage and frequency simultaneously

**49. Must all constant-frequency generators be connected in parallel?**

* **A.** Always
* **B.** Not necessarily
* **C.** Never
* **D.** Only when their DC systems are also paralleled

**50. After a CSDU input-drive disconnect, when can it be re-engaged?**

* **A.** Only on the ground after shutdown
* **B.** In flight through an electrical maintenance switch
* **C.** In flight by selecting reconnect
* **D.** Using the RAT during a power emergency

**51. What quantity is shown by an alternator meter set to kW?**

* **A.** Entire apparent load
* **B.** Real power/load
* **C.** Reactive load
* **D.** Field excitation current

**52. Where is an integrated-drive generator's oil retained?**

* **A.** Within its self-contained system
* **B.** In the engine's oil system
* **C.** Only in a cooling circuit
* **D.** Only in a lubricating circuit

**53. What normally cools the output windings of an alternator paired with a separate CSDU?**

* **A.** Water
* **B.** Oil
* **C.** Oil mixed with water
* **D.** Air

**54. Which pair of units represents real and reactive loading in a paralleled AC system?**

* **A.** kW and kVA
* **B.** kW and kV
* **C.** kV and kVAR
* **D.** kW and kVAR

**55. Why should both real and reactive loads be distributed appropriately between connected machines?**

* **A.** Only to protect TRU inputs
* **B.** Only to minimize load on the prime mover
* **C.** To avoid large generator-to-generator circulating currents
* **D.** Only to eliminate harmonics on the tie bus

**56. What is one advantage of parallel alternator operation?**

* **A.** Every aircraft load is necessarily single-phase
* **B.** Capacity to absorb large transient load changes
* **C.** System overloading becomes physically impossible
* **D.** Only one CSDU is needed for all engines

**57. When an external AC supply is connected to the aircraft's energized distribution buses, how are onboard sources treated?**

* **A.** Every internal bus is disconnected
* **B.** Aircraft generators operate in parallel with the external source
* **C.** Aircraft generators are taken off those buses
* **D.** The synchronizer automatically parallels all onboard sources with ground power

**58. What equipment can a three-phase AC network supply?**

* **A.** Both single-phase and three-phase equipment
* **B.** Three-phase equipment only
* **C.** Single-phase equipment only
* **D.** Inductive/capacitive equipment only

**59. How can a frequency-wild architecture still offer redundant combined power, despite not directly paralleling AC machines?**

* **A.** Parallel AC machines whenever engine RPM matches
* **B.** It can never have any redundant supply
* **C.** Rectify their outputs and combine the DC on a common bus where designed
* **D.** Any inductive load can be connected with no frequency-related issues

**60. What may happen if a phase faults in a three-phase star distribution system?**

* **A.** Nothing detectable
* **B.** Only that phase can ever be affected
* **C.** Only inductive loads overheat
* **D.** Effects can extend to all three phases

**61. Which conversion is the essential purpose of an inverter?**

* **A.** AC to DC
* **B.** Only changing AC frequency without DC link
* **C.** Acting as a mechanical generator backup
* **D.** DC to AC

**62. How is an alternator with too little reactive load corrected?**

* **A.** Adjust its excitation-field current
* **B.** Increase mechanical speed only
* **C.** Raise real load on the other sources
* **D.** Reduce the total system load

**63. What deliberate mechanical weak link protects a CSDU if an alternator seizes?**

* **A.** Hydraulic clutch
* **B.** Universal joint
* **C.** Quill drive
* **D.** Feathered coupling

**64. How is a paralleled alternator's real power increased?**

* **A.** By its regulator directly changing rotor mechanical torque
* **B.** By mandatory simultaneous increase of torque and excitation
* **C.** Only by increasing field current
* **D.** By increasing mechanical drive torque

**65. If a common bus develops an earth fault in a paralleled system, which breakers isolate that faulty section in the example?**

* **A.** Its GCB only
* **B.** Its BTB only
* **C.** Both the relevant GCB and BTB
* **D.** All generators must remain permanently separate

\---

## 17\. Answer Key and Explanations

**1. B —** An alternator generates alternating, rather than direct, current.

**2. C —** Safe paralleling demands equal voltage, frequency, instantaneous phase and phase order before breaker closure.

**3. C —** In the normal aircraft rotating-field design, the main AC is induced in fixed stator windings.

**4. A —** The rotor is the rotating section; the stator remains stationary.

**5. D —** Frequency-wild AC sources cannot be directly tied together as a synchronized parallel supply.

**6. C —** A star system has line voltage √3 times phase voltage, so phase voltage is smaller.

**7. D —** Resistive de-icing elements can accept supply-frequency changes.

**8. D —** Greater field excitation strengthens the rotating magnetic field and raises generated voltage.

**9. A —** The system rectifies variable-frequency AC to DC, then uses the inverter to make fixed-frequency AC.

**10. B —** Three-phase generation is the normal large-aircraft configuration described.

**11. A —** Magnetic flux provides the first excitation as the machine starts rotating.

**12. C —** Generated voltage is controlled by changing rotor field excitation.

**13. C —** Output frequency follows generator shaft speed when no constant-speed regulation is present.

**14. A —** Each star line carries the current of its one connected phase winding.

**15. A —** Line voltage is the potential difference between two distinct phase conductors.

**16. C —** Three-phase generation can give more electrical power per mass with favorable conductors.

**17. B —** The standard star phase-to-neutral value is nominally 115 volts.

**18. D —** A fixed armature output means that the magnetic field assembly rotates.

**19. A —** Phase voltage is measured from one line to the common star neutral.

**20. B —** The neutral can carry a large fault current after a phase-to-earth fault.

**21. C —** The source answer key identifies the self-excited type; modern designs also vary in their excitation arrangements.

**22. D —** Regulation is through the excitation current that establishes rotating-field strength.

**23. A —** Sharing only kW or only kVAR would leave the other component unbalanced.

**24. C —** Reactive sharing is set by excitation current and consequent output voltage.

**25. A —** Changing mechanical drive torque/speed-governor reference redistributes real power.

**26. C —** Generators must be in synchronism to prevent hazardous circulating power.

**27. A —** The conventional configuration gives each engine-driven generator its own drive regulator.

**28. B —** The source specifies 400 Hz ±5%, equivalent to 380–420 Hz.

**29. D —** The standard supply is 115/200 V, three-phase at 400 Hz.

**30. B —** Drive oil is stored separately from the engine lubrication circuit.

**31. C —** The pilot can operate the disconnect while the engine runs; reconnection is on the ground.

**32. A —** All four electrical matching criteria and a functional load-sharing system are required in this arrangement.

**33. A —** The GCR opens or closes the generator field's excitation path.

**34. D —** An exciter can generate AC that is rectified to supply DC field excitation.

**35. A —** Using V\_line ≈ √3 × 115 gives about 199.2 V, conventionally quoted as 200 V AC.

**36. B —** Differential current monitoring detects shorts and other faults within protected electrical sections.

**37. B —** The printed answer key specifies the oil-overheat warning light; drive oil temperature is also monitored.

**38. D —** Synchronizing and balancing several machines introduces additional mechanical/control complexity.

**39. B —** A mismatched phase/frequency connection can create harmful recirculating currents.

**40. D —** In this textbook arrangement APU supply is selected only where no other source feeds that bus.

**41. A —** Differential protection compares source and bus currents to detect current imbalance indicative of a fault.

**42. B —** Constant mechanical speed does not by itself hold AC voltage constant under varying electrical loads.

**43. C —** The quill drive is engineered to shear before more serious mechanical damage occurs.

**44. B —** kVAR measures reactive rather than real power.

**45. C —** Excessive drive-oil temperature or insufficient drive-oil pressure suggests a serious CSDU fault.

**46. A —** A larger torque contribution increases the generator's real-power share.

**47. D —** Load-sharing controllers operate only between generators connected in parallel.

**48. C —** Each generator needs an indication of the load it contributes for monitoring and balancing.

**49. B —** Some constant-frequency systems operate with isolated generator buses instead of paralleling.

**50. A —** A mechanically disconnected drive is re-engaged after shutdown during ground servicing.

**51. B —** kW identifies the useful work-producing or real power.

**52. A —** IDG oil belongs to its independent lubrication/cooling/drive arrangement.

**53. D —** A separate-drive machine commonly uses air cooling for its stator windings.

**54. D —** Real power is measured in kW and reactive power in kVAR.

**55. C —** Unbalanced interconnected sources may force substantial currents between generators.

**56. B —** Parallel machines collectively provide capacity to accommodate large sudden load demands.

**57. C —** The external ground source is not paralleled with onboard engine generators in the described system.

**58. A —** Single-phase loads can be fed from suitable phase connections, and three-phase loads use all three phases.

**59. C —** Independent frequency-wild AC outputs can be rectified separately, then combined on a designed DC bus.

**60. D —** A phase-to-earth fault can cause neutral and protective-system effects beyond the faulted phase.

**61. D —** An inverter changes a DC supply into an AC output.

**62. A —** Reactive sharing is corrected through field current and voltage regulation.

**63. C —** A quill drive acts as a mechanical fuse protecting the constant-speed drive.

**64. D —** Increasing the engine/CSDU torque increases the share of real kW delivered.

**65. C —** The source's selective fault isolation opens both the appropriate generator and bus-tie breakers.

