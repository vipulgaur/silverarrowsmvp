# Chapter 14 — AC Electrics: Transformers

## 1\. Transformers

### 1.1 Why transformers are important in an AC electrical system

A major practical benefit of **alternating current (AC)** is that its voltage can be changed efficiently. A **transformer** allows an AC source to supply equipment needing either a higher or a lower voltage without first converting the supply into DC. This flexibility is especially useful when an aircraft has electrical consumers with different voltage requirements.

The basic transformer is built around **two separate electrical windings** and a shared magnetic path:

* The **primary winding** receives the AC supply.
* The **secondary winding** provides the electrical output to the connected load.
* Both windings are placed on a **laminated iron core** that provides a closed path for the changing magnetic field.
* In a conventional two-winding transformer, there is **no direct electrical connection** between the primary and secondary coils; the energy is transferred magnetically.

### 1.2 How voltage appears in the secondary winding

The transformer operates through **mutual induction** rather than electrical contact between its two windings.

1. Applying AC to the primary causes its current and magnetic field to vary continuously.
2. The laminated iron core guides the changing magnetic flux so that it also passes through, or **links**, the secondary coil.
3. Because the magnetic flux through the secondary is changing, an **electromotive force (EMF)** is induced in that winding.
4. This induced EMF becomes the **secondary output voltage**.
5. If a load is connected across the secondary terminals, the circuit is completed and **secondary current flows**.

The winding relationship described in this chapter gives a secondary output voltage **180° out of phase** with the applied input voltage. The primary and secondary remain electrically separate even though they share the same magnetic circuit.

> \*\*Image Generation Prompt — Figure 14.1 A simple transformer\*\*
>
> Recreate a clean, landscape-oriented \*\*technical electrical textbook diagram\*\* of a simple two-winding AC transformer, enclosed by a thin light-grey rectangular border on a white background. At the centre is a \*\*rectangular closed laminated soft-iron magnetic core\*\*, illustrated as several closely spaced, nested grey rectangular outlines with visible laminated edges. Wrap a \*\*red helical PRIMARY WINDING\*\* around the left-hand vertical core limb, with approximately eight visible loops; connect it to an \*\*AC input source\*\*, drawn on its left as a red circular symbol containing a sine-wave mark and red leads running to the winding ends. Wrap a \*\*blue helical SECONDARY WINDING\*\* around the right-hand vertical core limb, with approximately six visible loops; connect its top and bottom leads to a small \*\*blue zigzag load resistor\*\* drawn to the right. Use fine black pointer lines identifying the exact uppercase labels \*\*“LAMINATED SOFT IRON CORE”\*\* (above, pointing to the top core), \*\*“AC INPUT”\*\* (left of the red source), \*\*“PRIMARY WINDING”\*\* (below left), \*\*“SECONDARY WINDING”\*\* (below right) and \*\*“AC OUTPUT”\*\* (to the right of the blue secondary/load). Keep the red primary on the left, blue secondary on the right, and the grey shared core central. No invented components, no 3D rendering. Retain the original caption exactly: \*\*“Figure 14.1 A simple transformer”\*\*.

\---

## 2\. Transformation Ratio

The amount by which a transformer changes an AC voltage depends on the **relative numbers of turns** in its windings. The relevant quantity is the **transformation ratio**, usually written as **r**.

Let:

* **N₁** = number of turns on the primary winding.
* **N₂** = number of turns on the secondary winding.
* **E₁** = voltage supplied to the primary.
* **E₂** = voltage induced across the secondary.

The transformation ratio is:

$$
r = \\frac{N\_2}{N\_1} = \\frac{E\_2}{E\_1}
$$

The turns ratio therefore gives the corresponding relationship between the **input voltage** and **output voltage**.

### 2.1 Step-up transformer

A transformer is **step-up** when its secondary has **more turns** than its primary. The ratio is then greater than one:

$$
N\_2 > N\_1 \\quad\\Longrightarrow\\quad r > 1 \\quad\\Longrightarrow\\quad E\_2 > E\_1
$$

Its purpose is to provide an **AC output voltage higher than the primary supply voltage**.

### 2.2 Step-down transformer

A transformer is **step-down** when the secondary contains **fewer turns** than the primary. In this case:

$$
N\_2 < N\_1 \\quad\\Longrightarrow\\quad r < 1 \\quad\\Longrightarrow\\quad E\_2 < E\_1
$$

It delivers an **AC output voltage below the input voltage**.

|Transformer|Relative winding turns|Transformation ratio|Voltage change|
|-|-|-|-|
|**Step-up**|N₂ greater than N₁|Greater than 1|Output voltage increased|
|**Step-down**|N₂ less than N₁|Less than 1|Output voltage reduced|

> \*\*Image Generation Prompt — Figure 14.2 Step up and step down transformers\*\*
>
> Construct the original side-by-side, black-line-and-colour textbook comparison inside a single \*\*wide, thin-grey rectangular border\*\*, on white. \*\*Left panel:\*\* heading \*\*“STEP UP”\*\* beneath a pair of coils. Put a \*\*short red primary coil with relatively few turns\*\* at left and a \*\*tall blue secondary coil with many more turns\*\* at right, separated by \*\*two parallel thin vertical black core lines\*\*. Show each coil with a pair of horizontal open-circuit terminal wires ending in \*\*small circular terminals\*\*. Include the uppercase labels \*\*“PRIMARY WINDING”\*\* to the left of the short red coil and \*\*“SECONDARY WINDING”\*\* to the right of the taller blue coil. \*\*Right panel:\*\* heading \*\*“STEP DOWN”\*\* beneath the arrangement; place a \*\*tall red primary coil with many turns\*\* on the left, a \*\*shorter blue secondary with fewer turns\*\* on the right, separated by \*\*three closely spaced upright black core lines\*\*. Again show the four small round terminal ends and uppercase winding labels on the corresponding sides. Maintain a very restrained two-colour palette (bright red primary, cobalt blue secondary), a flat circuit-diagram style and original composition. Do not add numerical values or other devices. Caption exactly: \*\*“Figure 14.2 Step up and step down transformers”\*\*.

\---

## 3\. Power in a Transformer

Changing voltage does **not** mean that a transformer creates extra electrical power. The transformer transfers power from the primary circuit to the secondary circuit; only a small amount is lost in a practical unit.

For an **ideal transformer**, where those losses are disregarded:

$$
P\_{\\mathrm{in}} = P\_{\\mathrm{out}}
$$

Using voltage and current for each winding, this relationship becomes:

$$
E\_1 I\_1 = E\_2 I\_2
$$

where **I₁** and **I₂** are the currents in the primary and secondary respectively. Consequently, when a transformer changes the voltage, the corresponding current changes so that input and output power remain approximately equal. In an actual transformer, the output power is slightly lower because small losses occur.

**Power relationship to retain:** for either winding, electrical power is found from the product of its **voltage × current**.

\---

## 4\. Three Phase Transformers

A **three-phase alternator** produces three AC phases. If those voltages need to be transformed, the aircraft electrical installation can use either of two arrangements:

1. **Three separate single-phase transformers**, with one transformer handling each phase.
2. **One three-phase transformer**, incorporating all three phases in the same unit.

A single three-phase transformer has a **laminated iron core with three limbs**. Each limb carries the appropriate **primary and secondary winding for one phase**, so all three phases can be transformed within one magnetic assembly.

\---

## 5\. Autotransformers

### 5.1 Purpose and construction

Some aircraft instruments need an AC voltage different from that delivered by the main supply. The chapter identifies **26 V AC** as a commonly required instrument supply. An **autotransformer** can provide that voltage by **stepping down**, or in some installations **stepping up**, the available AC input.

Unlike an ordinary transformer with two electrically isolated coils, an autotransformer uses **a single continuous winding** placed around a **laminated magnetic core**. Connections made at different points on the winding act as the primary and secondary terminals.

A section of the winding is **common to both input and output circuits**. Because of this shared section, it carries both primary and secondary current.

### 5.2 Step-up and step-down connections

The same basic single-winding arrangement can produce either type of voltage conversion by choosing the terminal connections appropriately:

* For a **step-up connection**, the input is applied across fewer turns and the output is taken across a larger portion of the winding.
* For a **step-down connection**, the input spans more turns and the output is taken from a smaller section of the winding.

> \*\*Image Generation Prompt — Figure 14.3 Autotransformers\*\*
>
> Recreate the two-panel, monochrome original autotransformer diagram inside one thin rectangular outline, with a pure white background and \*\*two separate long, vertical grey helical windings\*\*, the left labelled \*\*“STEP UP”\*\* and the right \*\*“STEP DOWN”\*\* beneath. \*\*Left panel:\*\* show a single tall upright coil. A \*\*lower-end terminal\*\* and an intermediate \*\*tap approximately midway up\*\* connect to a short left-hand vertical dimension arrow marked \*\*“PRIMARY”\*\*; the \*\*upper-end terminal\*\* and lower-end terminal form a taller right-hand vertical dimension arrow marked \*\*“SECONDARY”\*\*. Use small \*\*white open circles\*\* for external terminals and \*\*black filled dots\*\* where the tapping wires contact the coil. \*\*Right panel:\*\* repeat the same full-length coil reversed in function; the full coil span at left is the \*\*“PRIMARY”\*\* (long vertical dimension arrow), whereas the lower tapped portion at right is the \*\*“SECONDARY”\*\* (short vertical dimension arrow). Include fine black arrows, thin grey wires and exactly the uppercase labels \*\*“PRIMARY,” “SECONDARY,” “STEP UP,” “STEP DOWN”\*\* at their corresponding positions. No coloured coil sections, no extra transformers, no invented numerical values. Original caption exactly: \*\*“Figure 14.3 Autotransformers”\*\*.

### 5.3 Advantages and limitation

Because there is **only one winding**, an autotransformer requires less wire and is generally **less expensive** than a transformer with separate primary and secondary coils.

That economy has an important trade-off: **the primary and secondary are electrically connected**, so an autotransformer does **not provide electrical isolation** between the supply and the output. For this reason, it is unsuitable for circuits in which that isolation is necessary.

|Property|Two-winding transformer|Autotransformer|
|-|-|-|
|Winding arrangement|Separate primary and secondary coils|One tapped winding shared between input and output|
|Electrical separation|Primary and secondary electrically separate|Primary and secondary electrically connected|
|Relative wire requirement|More wire|Less wire|
|Relative cost|Generally higher|Generally lower|
|Where isolation is needed|Suitable arrangement|Not suitable|

\---

## 6\. Rectification of Alternating Current

A **rectifier** changes an **AC supply into DC**. The chapter introduces the **diode rectifier**, which is widely used in modern aircraft **solid-state electrical circuits**; the underlying diode operation is treated more fully in the semiconductor section.

### 6.1 Rectifier diodes and blocking diodes

A diode conducts readily in **one direction** and opposes current in the **other direction**. In broad circuit terms, it therefore behaves as though it has:

* **Low resistance** in its conducting direction.
* **High resistance** in its blocking direction.

This one-way action supports two aircraft applications:

* **AC-to-DC rectification:** the diode permits one direction of the alternating current and restricts the opposite direction.
* **Blocking-diode protection:** the same one-way property prevents **reverse current** through a DC circuit, operating much like an electrical **non-return valve**.

The chapter also identifies **Zener diodes** as diodes designed to conduct at a **predetermined voltage**.

\---

## 7\. Half Wave Rectification

A **single diode** placed in the **secondary circuit of a transformer** forms a basic half-wave rectifier.

During the half of the AC cycle in which the diode permits conduction, current passes through the load. During the opposite half-cycle the diode blocks the current. The result is a succession of **one-directional pulses** rather than an alternating output that changes polarity.

The main characteristics are:

* Only **one half** of each incoming AC cycle produces output current.
* The other half of the waveform—shown as the **lower/negative half** in the figure—is blocked.
* The resulting DC is **pulsating**, with substantial intervals between pulses.
* The **output pulse repetition frequency** is the same as the frequency of the AC input.

> \*\*Image Generation Prompt — Figure 14.4 Single phase half wave rectification\*\*
>
> Draw the original simple \*\*single-phase half-wave rectifier\*\* as a wide landscape electrical teaching diagram, enclosed by a thin light-grey border. At \*\*far left\*\*, include black vertical positive/negative axis marks labelled \*\*“+”\*\* and \*\*“−”\*\*, the word \*\*“INPUT”\*\* below, and a \*\*red complete sine wave\*\* with one upward/positive crest and one downward/negative trough crossing a black horizontal zero line. Two open-circle terminals are drawn at the ends of a circuit enclosing the red AC input. From the upper input lead, run a black conducting line across the top through a \*\*single horizontal black diode symbol pointing right\*\*; label the component \*\*“DIODE”\*\* above it and draw a \*\*black right-pointing horizontal arrow\*\* underneath labelled \*\*“CURRENT FLOW”\*\*. Continue the black conductor to the output terminals at right, with a bottom return wire. At \*\*far right\*\*, show black positive/negative axis marks and a \*\*red output trace containing only repeated positive half-wave humps separated by flat zero-voltage intervals\*\*, marked \*\*“OUTPUT”\*\* near the lower right return terminal. Keep output and input traces in red, wires and lettering black, and positions closely matching the original. No load resistor or other components not shown. Caption exactly: \*\*“Figure 14.4 Single phase half wave rectification”\*\*.

\---

## 8\. Full Wave Rectification

Half-wave rectification discards one half of each AC cycle. A **bridge rectifier** avoids those missing pulses by arranging diodes so that either half-cycle can contribute to the output.

During one input half-cycle, one conducting path through the bridge is available while the other path presents high resistance. As the supply reverses, the conducting and blocking paths interchange. The connection arrangement makes current through the external output circuit maintain **the same direction**, regardless of which half-cycle is taking place.

Consequently:

* Both the **first** and **second** halves of the AC input contribute to the output.
* The output remains of **one polarity**.
* The output is still **pulsating DC**, but without the long missing alternate half-cycles seen with half-wave rectification.
* Connecting a **capacitor across the output terminals** can reduce the variation in the output voltage and give some smoothing.

> \*\*Image Generation Prompt — Figure 14.5 Single phase full wave rectifier\*\*
>
> Reconstruct the original high-detail, single-phase \*\*full-wave bridge rectifier\*\* classroom figure on white within a wide thin-grey rectangle. Keep its proportions: at \*\*left\*\*, draw vertical \*\*“+”\*\* and \*\*“−”\*\* marks beside a \*\*single red input sine wave\*\*, with positive portion marked \*\*“1st”\*\* and negative portion marked \*\*“2nd”\*\*, and \*\*“INPUT”\*\* below. In the \*\*centre\*\*, build a black four-diode bridge as a \*\*diamond-shaped network\*\* with \*\*four visible black diode symbols\*\* and small circular junctions at its four vertices; connect the left input upper and lower leads to the appropriate top and bottom bridge connections. At \*\*right\*\*, plot \*\*three positive red humps in succession\*\* above a horizontal zero line, labelled \*\*“OUTPUT”\*\* at the lower right, together with an output positive mark \*\*“+”\*\* and a return wire. Place a small \*\*two-line legend at the top left\*\*: \*\*“CURRENT FLOW IN FIRST HALF CYCLE”\*\* alongside a blue right-pointing arrow, and \*\*“CURRENT FLOW IN SECOND HALF CYCLE”\*\* alongside a red right-pointing arrow. Overlay many short \*\*blue and red directional arrows\*\* on the separate conduction routes through the diamond and return wires, retaining which diode path is active in each half-cycle. All component outlines black; red waveforms; blue/red flow arrows. Avoid showing the diodes as resistors or introducing a capacitor in this figure, because none is shown. Caption exactly: \*\*“Figure 14.5 Single phase full wave rectifier”\*\*.

\---

## 9\. Three Phase Rectifiers

A **three-phase AC supply** can also be rectified by using **six rectifier diodes arranged as a bridge**. Instead of handling only one sinusoidal input, the rectifier uses the changing relationships among **three phase voltages** to supply a common DC output.

Because the three phases reach their positive and negative values at different times, the rectifier combines successive conducting intervals from the available phases. The resulting DC has a **much steadier output** than the pulsating voltage produced by a simple single-phase rectifier. The chapter describes this output as **essentially steady**.

The operating diagrams show the different conducting paths associated with the line voltages between **phases A and B**, **phases A and C**, and **phases B and C**.

> \*\*Image Generation Prompt — Figure 14.6 Three phase full wave rectifier\*\*
>
> Faithfully reproduce this \*\*single, tall, multi-panel training diagram\*\* on a white background within a thin grey rectangular frame. \*\*Top graph:\*\* a horizontal reference axis with bold \*\*“+”\*\* and \*\*“−”\*\* signs on the left. Draw \*\*three overlapping smooth sinusoidal waveforms\*\*, \*\*red “PHASE A,” yellow “PHASE B,” and blue “PHASE C”\*\*, displaced from one another in phase and labelled near their positive peaks. Above them draw a \*\*thin black, shallowly rippled positive envelope\*\* with successive rounded humps marked \*\*“DC OUTPUT”\*\*; align the boundaries between the humps with narrow \*\*vertical grey dashed guidelines\*\*. \*\*Below the graph\*\*, present \*\*three individual, neatly spaced six-diode bridge-circuit panels\*\*: two side-by-side across the middle row, and one centred beneath. Each circuit has phase input conductors \*\*A (red), B (yellow), C (blue)\*\* feeding a network of \*\*six black outlined diode symbols arranged as two groups of three\*\* connected to common positive and negative DC rails; show a \*\*positive DC output terminal at lower right with “+”\*\*, and \*\*negative terminal at lower left with “−”\*\*. Highlight the conducting diodes in \*\*solid black\*\* while leaving non-conducting diodes as white outlines. Add thin directional black arrows tracing the active current route for each illustrated phase-pair condition. The \*\*middle left panel\*\* is captioned \*\*“LINE VOLTAGE BETWEEN PHASES A AND B,”\*\* the \*\*middle right\*\* \*\*“LINE VOLTAGE BETWEEN PHASES A AND C,”\*\* and the \*\*bottom panel\*\* \*\*“LINE VOLTAGE BETWEEN PHASES B AND C.”\*\* Keep the phase-colour coding, grid-like circuit layout, diode orientations, terminals, line routing and label capitalization as depicted; do not simplify to a generic single rectifier block. Beneath the outer frame retain the original caption exactly: \*\*“Figure 14.6 Three phase full wave rectifier”\*\*.

\---

## 10\. Transformer Rectifier Units (TRUs)

A **transformer rectifier unit (TRU)** combines the action of a transformer and rectifier in a single assembly. It is used when an aircraft's AC distribution system must provide electrical power to equipment requiring **DC**.

The transformation stage changes the AC voltage; the rectifier stage then converts the resulting AC into DC. The chapter gives this typical conversion:

**115/200 V, 400 Hz, three-phase AC → 28 V DC**

The principal features of aircraft TRUs are:

* They are generally **multiphase units**, because multiphase rectification provides a **smoother DC output**.
* The unit supplies the **DC electrical requirements** of an aircraft whose principal distribution is AC.
* **TRU output current**, in **amperes (A)**, can be displayed on the main electrical panel in the flight deck.
* Cooling is provided by **air passing through the unit**.
* The cooling or unit temperature may be **monitored**, with an **overheat warning** if necessary.

In short, a TRU delivers usable DC from the aircraft's AC source without requiring a separate DC generator for every consumer.

\---

## 11\. Inverters

An **inverter** performs the reverse electrical conversion to a rectifier: it changes **DC into AC**.

### 11.1 Emergency supply in constant-frequency AC aircraft

On an aircraft normally supplied by **constant-frequency AC generators**, an inverter can provide an **emergency AC supply** if the generators become unavailable. Under those conditions, the inverter is powered by the **aircraft battery**.

Modern examples are normally **static, solid-state inverters**, using electronic components such as transistors. They are intended to produce **constant-frequency AC** for services such as:

* **Flight instruments**.
* Other **essential AC consumers**.

The chapter also mentions **rotary inverters** and other static inverter designs described in its earlier DC section, while noting that older arrangements are **not generally used in modern aircraft**.

### 11.2 Constant-frequency supply from a frequency-wild system

Aircraft fitted with a **frequency-wild AC distribution system** need another method of supplying equipment that requires **fixed-frequency AC**. The aircraft examples named in the chapter are the **British Aerospace ATP** and **ATR 42**.

The conversion path is:

1. Start with the **variable-frequency AC** source.
2. **Transform** its voltage as required.
3. **Rectify** that AC into DC.
4. Supply the DC to a **static inverter**.
5. Use the inverter to produce **controlled-frequency AC** for the applicable consumers.

Thus, the intermediate DC stage separates the final AC output frequency from the varying frequency of the original generator supply.

### 11.3 Indications and cooling

The inverter's AC output can be supervised in the same general way as a main AC generator output. The chapter specifically identifies monitoring of:

* **Voltage**.
* **Frequency**.

An inverter is also **air-cooled**, using the same basic cooling approach as the TRU.

### 11.4 Device comparison

|Device|Input|Output|Principal function|
|-|-|-|-|
|**Transformer**|AC|AC|Increases or decreases voltage|
|**Autotransformer**|AC|AC|Changes voltage with a shared input/output winding|
|**Rectifier**|AC|DC|Produces one-directional electrical output|
|**TRU**|AC|DC|Combines voltage transformation with rectification|
|**Inverter**|DC|AC|Provides AC from a DC source|

\---

## 12\. Questions

**1.** What is the usual purpose of an aircraft instrument transformer?

A. Convert a 14 V DC source into a 26 V AC supply  
B. Reduce an AC source to approximately 26 V AC for selected instruments  
C. Increase a 115 V AC supply to 200 V AC exclusively for engine instruments  
D. Convert 28 V DC directly into 28 V AC

**2.** Which description correctly identifies an autotransformer?

A. It automatically changes its winding ratio whenever the supply voltage fluctuates  
B. It has one winding that serves both the input and output circuits  
C. It converts an unstable input frequency into a constant output frequency  
D. It has separate primary and secondary windings that are electrically isolated

**3.** A transformer will **increase** the applied AC voltage when which winding arrangement is used?

A. The primary and secondary have equal turns, provided their wire diameters match  
B. The secondary winding has more turns than the primary winding  
C. The secondary has fewer turns than the primary winding  
D. Both windings must have exactly the same number of turns

**4.** If a transformer delivers **half the primary voltage** at its secondary terminals, what is its winding-turn relationship?

A. The secondary has twice the primary number of turns  
B. The secondary has half the primary number of turns  
C. The secondary carries half the primary current under ideal operating conditions  
D. The secondary has four times the primary number of turns

**5.** Ignoring small losses, how does a transformer's output power compare with its input power?

A. Output power changes in direct proportion to the turns ratio  
B. Output power varies inversely with the turns ratio  
C. Input power and output power are equal  
D. A step-up transformer always produces additional electrical power

**6.** What happens to the current supplied to the external **secondary load** when the secondary terminals are left **open-circuit**?

A. It reaches its maximum value  
B. It becomes negligible because no load current flows  
C. It necessarily becomes exactly in phase with the primary voltage  
D. The primary voltage must always exceed the secondary voltage

**7.** A secondary winding produces a higher induced voltage than the primary voltage applied to the transformer. How is this transformer classified?

A. Autotransformer  
B. Step-up transformer  
C. Step-down transformer  
D. Magnetic amplifier

\---

## 13\. Answers and Explanations

|Question|Answer|Explanation|
|-|:-:|-|
|**1**|**B**|An instrument transformer or autotransformer can reduce the main AC voltage to the **26 V AC** required by certain aircraft instruments.|
|**2**|**B**|An autotransformer uses **one tapped winding**, meaning the primary and secondary share part of that winding and are not electrically isolated.|
|**3**|**B**|A step-up transformer has **more secondary turns than primary turns**; its voltage ratio is consequently greater than one.|
|**4**|**B**|Since **E₂/E₁ = N₂/N₁**, halving the output voltage requires **N₂ = N₁/2**.|
|**5**|**C**|With transformer losses ignored, **input power equals output power**; increased voltage is offset by a corresponding reduction in current.|
|**6**|**B**|Without a connected secondary load, the **external secondary current is effectively zero**; the transformer may still draw a small primary magnetizing current.|
|**7**|**B**|A higher secondary voltage identifies a **step-up transformer**.|



