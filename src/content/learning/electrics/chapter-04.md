# Chapter 4 — DC Electrics: Batteries

## 1\. What an Aircraft Battery Does

An aircraft battery stores energy in **chemical form** so that it can deliver **direct-current electrical power** when required. The chapter identifies two central functions:

* **Starting the engine:** The battery can provide the electrical energy needed for engine-starting equipment before a generator is supplying the aircraft.
* **Emergency electrical supply:** Should the generator be unavailable or no longer operating, the battery provides an alternative source for essential electrical equipment.

A battery contains one or more **electrochemical cells**. Inside each cell, interactions between different materials transfer electrons and establish an electrical **potential difference** between its terminals. When the cell operates, those materials undergo chemical changes. Supplying power uses up the available stored chemical energy; whether that reaction can be reversed determines the type of cell.

### 1.1 Cell, battery, voltage and capacity

A **cell** is an individual electrochemical unit. A **battery** is an arrangement of cells selected to provide a particular voltage and energy-delivery capability. Two specifications must not be confused:

* **Voltage (V)** describes the electrical potential difference that drives charge through a circuit.
* **Capacity (Ah)** indicates the quantity of current a cell or battery is rated to provide over a specified period.

Connecting cells differently changes how the assembled battery supplies voltage and capacity. These connections are examined after the two cell types.

\---

## 2\. Primary Cells — Single-Use Chemical Sources

A **primary cell** produces electrical energy from a chemical reaction that is not intended to be reversed by recharging. Two electrodes of different electrical characteristics are placed in an **electrolyte**—a substance that permits the electrochemical reaction between them.

As charge moves between the materials, an electrical potential difference develops. The introductory example in the chapter associates a primary cell with a terminal potential difference of approximately **1.5 V**.

If an external conductor joins the terminals, electrons travel around that external path **from the negative terminal to the positive terminal**. Chemical changes within the cell sustain this process while usable reactants remain. In the example described, material at the negative electrode gradually dissolves or is consumed; when the chemical reaction can no longer maintain useful output, the cell is exhausted and is discarded rather than recharged.

### Figure 4.1 A primary cell — image-generation prompt

> \*\*Recreate an original-style educational schematic\*\* of a primary electrochemical cell within a thin rectangular black border on a pure white background. Show a vertical open-top rectangular electrolyte vessel: a slender negative electrode plate at the left, a positive electrode plate at the right, and three small circular negative-charge symbols in the central liquid with black arrows pointing horizontally toward the negative side. At the top, a black horizontal indication connects `− VOLTAGE +`, with the `−` above the left electrode and `+` above the right. Label the right-side electrodes collectively \*\*`ELECTRODES`\*\* with a black leader line and the liquid on the right \*\*`ELECTROLYTE`\*\* with another leader line. Preserve a compact, black-and-white engineering textbook drawing, neat uppercase sans-serif annotation, and the original caption \*\*`Figure 4.1 A primary cell`\*\*. No decorative aircraft elements.

### Figure 4.2 A dry cell (primary) — image-generation prompt

> Produce a compact textbook cutaway of a \*\*single cylindrical primary dry cell\*\* powering a small yellow light bulb in a closed external electrical circuit. The central electrode is a dark \*\*carbon rod\*\*, the outer anode is a \*\*zinc plate\*\*, and the intervening conducting paste is the \*\*electrolyte\*\*. Show a partly opened cylindrical cell with pale blue-grey outer casing, a brown/dark central rod, a positive terminal at the top, negative connection from the zinc casing, two thin black connecting wires and an illuminated bulb to the upper right. Use the original uppercase callouts and leader arrows: \*\*`DRY CELL (PRIMARY)`\*\*, \*\*`CARBON ROD (POSITIVE)`\*\*, \*\*`ELECTROLYTE`\*\*, \*\*`ZINC PLATE (NEGATIVE)`\*\*, and \*\*`+`\*\* and \*\*`−`\*\* polarity indications. Technical schoolbook vector rendering, white background, preserve the caption \*\*`Figure 4.2 A dry cell (primary)`\*\*.

**Core distinction:** A primary cell can deliver electrical power, but the chemical reaction that provided it is not restored by an ordinary charging cycle.

\---

## 3\. Secondary Cells — Rechargeable Batteries

A **secondary cell** also converts chemical energy into electrical output, but its chemistry is designed to be substantially restored after discharge. The required restoration takes place when a charging source drives current through the cell in the **opposite direction to the discharge current**.

During charging, electrical energy is stored again as chemical energy. During the next discharge, some of that stored chemical energy is converted back into electrical energy. A secondary cell may therefore undergo numerous charging and discharging cycles throughout its service life.

### 3.1 Understanding ampere-hour capacity

Battery capacity is stated in **ampere-hours (Ah)**. The simplified relationship is:

$$
C=I\\times t
$$

where:

* $C$ = ampere-hour capacity, in $\\mathrm{Ah}$;
* $I$ = discharge current, in $\\mathrm{A}$;
* $t$ = discharge duration, in hours.

For the chapter's **80 Ah** example, two arithmetically equivalent demands are:

$$
8\~\\mathrm{A}\\times 10\~\\mathrm{h}=80\~\\mathrm{Ah}
$$

$$
80\~\\mathrm{A}\\times 1\~\\mathrm{h}=80\~\\mathrm{Ah}
$$

**These are theoretical equivalents, not a promise of equal practical endurance.** Delivering very high current may reduce the capacity actually available. The chapter uses the **one-hour discharge rate** as its normal capacity-rating reference and notes that **plate area** is a major determinant of cell capacity: larger effective plates generally permit more capacity.

### 3.2 Cells in series

For a **series arrangement**, each cell's positive terminal is linked to the next cell's negative terminal. The voltages **add**, while the combined ampere-hour rating of otherwise identical cells remains that of **one** cell:

$$
V\_{\\mathrm{series}}=V\_1+V\_2+\\cdots+V\_n
$$

For three identical **2 V, 10 Ah** cells:

$$
V\_{\\mathrm{series}}=2+2+2=6\~\\mathrm{V},\\qquad C\_{\\mathrm{series}}=10\~\\mathrm{Ah}
$$

This connection is selected when a higher output **voltage** is needed.

### 3.3 Cells in parallel

In a **parallel arrangement**, all positive terminals join the same positive connection and all negative terminals join the common negative connection. Identical cells retain their individual voltage but their capacities **add**:

$$
V\_{\\mathrm{parallel}}=V\_{\\mathrm{one\\ cell}}
$$

$$
C\_{\\mathrm{parallel}}=C\_1+C\_2+\\cdots+C\_n
$$

Three **2 V, 10 Ah** cells in parallel therefore give:

$$
V\_{\\mathrm{parallel}}=2\~\\mathrm{V},\\qquad C\_{\\mathrm{parallel}}=30\~\\mathrm{Ah}
$$

This connection is used where a greater **capacity** is desired without increasing terminal voltage. The source's examples assume cells of matching characteristics.

### Figure 4.3 — image-generation prompt

> Create a precise \*\*two-panel black-line electrical circuit diagram\*\* on a white textbook page, within one thin grey rectangular box. \*\*Left panel\*\*, heading \*\*`Cells in series`\*\*: three battery-cell symbols connected end-to-end along the upper side of one rectangular circuit, each marked \*\*`2 V`\*\*, with small \*\*`+`\*\* and \*\*`−`\*\* polarity marks and \*\*`10 Ah`\*\* beneath each cell; two open output terminals at the bottom are labelled \*\*`6 V`\*\* and \*\*`10 Ah`\*\*. \*\*Right panel\*\*, heading \*\*`Cells in parallel`\*\*: three separate horizontal branches between common left and right vertical bus connections, one battery symbol per branch; each battery shows \*\*`2 V`\*\*, \*\*`10 Ah`\*\*, \*\*`+`\*\* and \*\*`−`\*\*; the bottom output pair reads \*\*`2 V`\*\* and \*\*`30 Ah`\*\*. Keep all wiring orthogonal, use thin uniform black strokes, copy the original spacing and relative panel proportions, no color fill or decorative effects. Exact caption \*\*`Figure 4.3`\*\*.

|Arrangement of three identical 2 V / 10 Ah cells|Total voltage|Total rated capacity|
|-|-:|-:|
|Series|6 V|10 Ah|
|Parallel|2 V|30 Ah|

**Exam distinction:** Connecting batteries in series increases voltage; connecting equivalent batteries in parallel increases the available ampere-hour capacity.

\---

## 4\. Lead-Acid Secondary Batteries

The **lead-acid cell** is a rechargeable electrochemical cell, and the chapter identifies it as a common historical aircraft battery design. Its component chemistry explains how its state of charge may be checked.

### 4.1 Materials and physical construction

The basic parts are:

* **Positive plate:** lead peroxide (also called lead dioxide in modern terminology).
* **Negative plate:** spongy lead.
* **Electrolyte:** sulphuric acid mixed with water.
* **Container:** a hard-plastic or glass housing in the chapter's illustrative cell.
* **Filler cap:** permits replenishment of water lost in use.
* **Vent:** provides an escape path for hydrogen gas produced during battery operation/charging.

The plates sit in the electrolyte. When the cell delivers electrical energy, both plate materials gradually change as part of the discharge reaction.

### Figure 4.4 — image-generation prompt

> Reconstruct the textbook's \*\*black-and-grey, two-part exploded technical illustration of a lead-acid battery cell\*\*. On the left, show a tall rectangular single battery cell with internal stacks of fine ribbed plates and three fittings at the top. Label with uppercase black leader lines: \*\*`POSITIVE TERMINAL POST`\*\* to the left post, \*\*`VENT CAP`\*\* to the central cap, \*\*`NEGATIVE TERMINAL POST`\*\* to the right post, and a lower multi-line annotation \*\*`SINGLE BATTERY CELL SHOWING POSITIVE AND NEGATIVE PLATE GROUPS INTERLOCKED. PLATE SEPARATORS ARE NOT SHOWN`\*\*. On the right, display two expanded grey plate stacks with their upward-reaching contact tongues; one caption \*\*`POSITIVE PLATE GROUP`\*\*, the other \*\*`NEGATIVE PLATE GROUP`\*\*, and the shared top annotation \*\*`TERMINAL POSTS`\*\*. White backdrop, thin grey border, subtle shaded 3D outlines, precise relative alignment; preserve the exact figure caption \*\*`Figure 4.4`\*\*.

### 4.2 Charge indication using electrolyte specific gravity

A lead-acid cell's **specific gravity (SG)** provides an indication of the concentration of acid in its electrolyte, which changes with the cell's state of charge. A **hydrometer** is the instrument used for the SG check.

The values given in the textbook are:

|Lead-acid condition|Specific gravity|Relevant cell voltage|
|-|-:|-:|
|Fully charged|Approximately **1.27**|On-load voltage just above 2 V after charging|
|Discharged / charge required|Approximately **1.17**|Around **1.8 V** in the described discharge condition|
|Nominal cell voltage (on load)|—|**2.0 V**|
|Cell voltage off load|—|**2.2 V**|

As the battery discharges, **lead sulphate develops on both plates**, and the sulphuric-acid solution becomes weaker. Its specific gravity consequently falls. When the reference values reach approximately **SG 1.17** and **1.8 V** in the textbook example, the cell requires charging.

On recharge, a charger applies a potential higher than the cell's own voltage. The charging current acts in the reverse direction and helps convert the discharge products back toward the charged chemical state. Specific gravity rises toward **1.27**, and the on-load voltage recovers to just above **2 V** per cell.

### 4.3 Why charging rate matters

Charging too aggressively can accelerate **gassing** and water loss. If enough liquid is lost, plates may be damaged and the battery may be effectively boiled dry. The charging rate therefore requires control.

The textbook instructs that electrolyte liquid in the applicable refillable lead-acid construction should stand **just above the plate tops**. Top-up is with **distilled water**, not an arbitrary addition of acid. Water is gradually lost through evaporation and gas evolution during service.

**Corrosion warning:** The sulphuric-acid electrolyte is strongly corrosive. Acid spilled in an aircraft can damage structure and equipment. The source identifies **sodium bicarbonate solution** (bicarbonate of soda in water) as the neutralizing material for acid electrolyte contamination.

### Figure 4.5 A lead acid secondary cell — image-generation prompt

> Draw a \*\*single, simple cross-section of a lead-acid secondary cell\*\* in a long rectangular white-background technical illustration. A transparent/pale pink electrolyte chamber contains two vertical plates separated by liquid: at left a grey \*\*`NEGATIVE PLATE (SPONGY LEAD)`\*\*, at right a pale plate \*\*`POSITIVE PLATE (LEAD PEROXIDE)`\*\*, with vertical dark `−` signs on the negative plate and `+` signs on the positive. Put the centered top annotation \*\*`TERMINAL VOLTAGE 2.2 V`\*\*, small \*\*`−`\*\* above the left terminal and \*\*`+`\*\* above the right. At right label the liquid \*\*`ELECTROLYTE (SULPHURIC ACID AND WATER)`\*\*. Show the tank walls, vertical plate connectors, bottom supports, black leader lines and thin grey figure border. Exact caption \*\*`Figure 4.5 A lead acid secondary cell`\*\*.

### 4.4 Temperature and lead-acid performance

Lead-acid battery behavior is sensitive to ambient temperature:

* **Cold conditions:** Internal resistance increases, reducing the battery's ability to deliver current at a given condition; the chapter describes the discharge rate as decreasing.
* **Warmer conditions:** Electrical delivery is generally easier because internal resistance is lower, so battery performance tends to improve within appropriate operating limits.
* **Discharged battery exposed to freezing:** As acid strength falls, the weaker electrolyte becomes more vulnerable to freezing. This is an important reason to keep lead-acid batteries charged during winter operations.

Temperature benefits should **not** be read as permission to overheat batteries. Excessive heating is still a hazard, particularly while charging.

### 4.5 Free-liquid and absorbed-liquid types

The textbook presents two physical forms of lead-acid storage:

**Free-liquid construction** retains electrolyte as freely moving liquid in the battery's cells. The component illustration identifies the housing and its protective elements.

**Absorbed-liquid construction** holds the electrolyte within porous active materials/plate structure, thereby making accidental spillage less likely. The accompanying cutaway displays the mechanical terminals, seals and connector assembly.

### Figure 4.6 Lead acid battery (free liquid type) — image-generation prompt

> Create the original textbook's \*\*detailed color 3D exploded view of a free-liquid lead-acid aircraft battery\*\* on white. A rectangular grey metallic multi-cell battery case occupies the lower right, with a removable top/connector block hovering above to the upper left on a pale-yellow triangular exploded-view guide; depict bolts, cap openings, metallic rails and the repeating vertical ribbed sides. Include a small detail callout \*\*`A`\*\* adjacent to the raised cover, a red leader arrow labelled \*\*`PLASTIC COVER`\*\* near the upper case rim, and red leader arrows labelled \*\*`CELL BLOCK`\*\* and \*\*`BASE MAT`\*\* at the lower right of the case. Keep grey hardware shading and subtle yellow exploded-layer highlighting, frame within a fine rectangle, exact caption \*\*`Figure 4.6 Lead acid battery (free liquid type)`\*\*.

### Figure 4.7 Lead acid battery (absorbed liquid type) — image-generation prompt

> Recreate a \*\*three-quarter-view cutaway of a low rectangular lead-acid aircraft battery with absorbed electrolyte\*\*, in the source's semi-realistic grey industrial 3D rendering. The case occupies most of the right half; at the left foreground a removable \*\*`Cannon plug`\*\* sits apart from a \*\*`Cannon receptacle (including 2 contact sleeves)`\*\*. Show a raised handle above, round cell closures along the top, the exposed internal plate pack at the left face, layered seals and electrical connector hardware. Add thin \*\*red leader arrows\*\* with exact labels: \*\*`Connecting insulator`\*\*, \*\*`Vent stopper \& washer`\*\*, \*\*`Cover locking ring`\*\*, \*\*`Cover`\*\*, \*\*`Cover gasket`\*\*, \*\*`Cannon plug`\*\*, \*\*`Cannon receptacle (including 2 contact sleeves)`\*\*, \*\*`Terminal insulator`\*\*, \*\*`Terminal connector`\*\*, \*\*`Container`\*\*, \*\*`Connector bar`\*\*, and \*\*`Carrying handle`\*\*. Maintain the original arrow placement and technical detail, no invented components, thin grey outline frame, exact caption \*\*`Figure 4.7 Lead acid battery (absorbed liquid type)`\*\*.

\---

## 5\. Nickel-Cadmium (NiCad) Alkaline Batteries

Larger modern aircraft in the source increasingly use **nickel-cadmium (NiCad)** rechargeable batteries, although lead-acid types remain in some smaller aircraft. The principal distinction is the **electrode materials and electrolyte chemistry**.

### 5.1 Materials and cell output

The textbook uses the following identifiers for a nickel-cadmium cell:

* **Positive electrode:** nickel oxide in its charged condition (identified in the summary table).
* **Negative electrode:** cadmium in its charged condition.
* **Electrolyte:** potassium hydroxide in distilled water—an **alkaline** solution.
* **Electrolyte SG:** approximately **1.24–1.30**.
* **Nominal on-load cell output:** about **1.2 V**.

The summary figure also describes the **discharged materials** as nickel hydroxide and cadmium hydroxide. Unlike a lead-acid electrolyte, the alkaline electrolyte's specific gravity does not provide a useful measure of state of charge; it stays approximately unchanged during the usual discharge process.

### 5.2 Steady voltage and the capacity-test requirement

A notable NiCad characteristic is that terminal voltage stays near **1.2 V per cell** for most of the usable discharge. Although this makes the battery suitable for supplying a stable DC output, **voltage readings alone cannot reliably reveal the remaining capacity**.

The textbook therefore directs attention to a **measured discharge/capacity test** for assessing state of charge. Low internal resistance gives NiCad cells the ability to deliver high discharge currents, and the chapter notes that their terminal voltage is relatively stable during both high-current discharge and low-current recharge.

That stable performance is valuable when a large aircraft has lost its normal generator supplies and must operate essential loads from battery power.

### 5.3 Thermal runaway — a key NiCad hazard

NiCad batteries present a particularly important charging hazard: **thermal runaway**.

The feedback sequence is:

1. Heat is produced by the cell under particular charging conditions.
2. The battery may be unable to lose that heat quickly enough because of its limited ability to absorb and dissipate thermal energy, as described in the chapter.
3. The battery temperature rises.
4. Its effective internal resistance decreases as temperature rises.
5. At an inadequately controlled charging voltage, the lower resistance allows **more charging current**.
6. The higher current produces more heat, accelerating the cycle.

If the process is not interrupted, it can destroy the battery and may produce enough heat to cause **an explosion**.

### 5.4 Thermal protection

The chapter describes a **built-in thermal switch** that senses when a preset temperature is reached. It temporarily disconnects the battery from the charging source. After the battery cools sufficiently, the switch can return to its normal state. A **flight-deck indicator light** may be associated with this protective function.

The practical lesson is that the NiCad battery's strong output capability must be matched by carefully supervised charging and overtemperature protection.

### Figure 4.8 — image-generation prompt

> Reproduce a minimal \*\*two-curve line graph\*\* comparing the discharge behavior of lead-acid and NiCad batteries. White figure background, black horizontal axis labelled \*\*`Discharge time`\*\*, black vertical axis indicating voltage with \*\*`V`\*\* markings. The \*\*upper red curve\*\* begins near \*\*`2.2 V`\*\*, drops rapidly at first, and then gradually slopes down toward approximately the final lower voltage; label it directly \*\*`Lead acid`\*\*. The \*\*lower blue curve\*\* starts near \*\*`1.3 V`\*\*, declines sharply almost immediately to a long nearly horizontal plateau, then bends down abruptly near the right edge; label it \*\*`NiCad`\*\*. Preserve the unequal cell voltage scales shown in the original illustrative comparison; do not reinterpret it as a common-voltage battery-pack graph. Keep curves smooth, thin strokes and the caption \*\*`Figure 4.8`\*\*.

\---

## 6\. Battery Checks, Ratings and Serviceability

A voltage reading on its own does not describe everything needed to judge an aircraft battery. **Capacity, ability to sustain a load, and changes caused by service deterioration** are central to the checks explained in this chapter.

### 6.1 Rated capacity and rated load

**Rated capacity** is the product of the specified current and the discharge time over which the manufacturer rates the battery:

$$
C\_{\\mathrm{rated}}=I\_{\\mathrm{rated}}\\times t\_{\\mathrm{rated}}
$$

For example, a battery rated **40 Ah at the one-hour rate** is intended to sustain:

$$
40\~\\mathrm{A}\\times1\~\\mathrm{h}=40\~\\mathrm{Ah}
$$

At a lower current, the same nominal rating corresponds arithmetically to:

$$
4\~\\mathrm{A}\\times10\~\\mathrm{h}=40\~\\mathrm{Ah}
$$

Again, the usable capacity will depend on the discharge rate and battery condition; the two simple calculations should not be treated as a guaranteed real-world performance curve.

### 6.2 Actual capacity and percentage efficiency

Capacity falls as a battery ages or deteriorates. To assess it, compare how long the battery sustains the specified test load against its rated endurance.

**Original numerical scenario, rewritten:** A battery has a **60 Ah one-hour rating**. At its one-hour test current, it lasts **0.7 hours**, equivalent to **42 minutes**.

$$
C\_{\\mathrm{actual}}=60\~\\mathrm{A}\\times0.7\~\\mathrm{h}=42\~\\mathrm{Ah}
$$

$$
\\mathrm{Capacity\\ efficiency}=\\frac{42\~\\mathrm{Ah}}{60\~\\mathrm{Ah}}\\times100%=\\boxed{70%}
$$

So the battery delivers only **70%** of the rated quantity in that test.

### 6.3 Capacity testing interval and minimum result

For the training context used by the source:

* The capacity check is described as being performed **every three months**.
* To remain in service, the battery should show at least **80%** capacity efficiency.
* The intended operational capability includes the ability to supply specified essential loads for **30 minutes after generator failure**.

**Reference-status note:** These are requirements quoted from this edition's teaching material, not a universal statement that all current aircraft batteries share the same intervals and thresholds; actual service decisions follow applicable approved maintenance data.

### 6.4 What the battery must keep operating

Examples of the chapter's **essential/emergency loads** are:

* Attitude information systems.
* Essential communications.
* Required lighting.
* Pitot heating.
* Other equipment necessary for safe continuation of flight.
* Equipment whose demand remains after nonessential services have been switched off by **load shedding**.

**Load shedding** means removing unnecessary electrical demand so that the remaining supply can be reserved for equipment required for flight safety.

### 6.5 Storage of spare batteries

The battery's chemistry affects how it should be prepared for storage:

|Chemistry|Storage condition described|Reason|
|-|-|-|
|Lead-acid|Store **charged**|Helps avoid plate deterioration due to **sulphation**.|
|Nickel-cadmium|May be stored **discharged**|The chapter states that discharged storage is not detrimental in the same way, giving a potentially longer shelf life.|

### 6.6 On-load test

An **on-load check** applies a specified electrical demand to the battery and watches its terminal voltage under that load. The chapter describes a short test at the rated demand, with modern examples of **10–20 seconds**.

To pass, the voltage must remain sufficiently stable and must **not drop below the stated minimum within the prescribed time**. The check is more meaningful than relying solely on the unloaded battery voltage.

For a pilot's simplified preflight assessment, the chapter suggests comparing **off-load** and **on-load** readings. Example switchable loads include **pitot heating, landing lights and blower motors**. A battery may show a reasonable open-circuit voltage yet sag substantially once meaningful current is demanded. In the textbook's example, a drop below the approved limit indicates a low state of charge and the need for battery replacement according to the stated procedure.

**Exam distinction:** A **voltmeter** is placed across the battery to indicate voltage; applying the correct load is what makes the voltage test informative about useful delivery capability.

\---

## 7\. Charging Aircraft Batteries

### 7.1 Constant-voltage charging of lead-acid batteries

The textbook describes a **constant-voltage generator/regulator system** as the usual in-flight means of keeping many lead-acid batteries charged.

The examples given are:

|Battery's nominal voltage|Generator's regulated output|
|-|-:|
|12 V|**14 V**|
|24 V|**28 V**|

Thus, in these examples, the charging-system voltage is around **2 V higher for each 12 V of battery nominal potential**. A regulator maintains the set output so charging current can flow into the battery as required.

### 7.2 Controlled charging for NiCad batteries

Because uncontrolled NiCad charging can initiate thermal runaway, aircraft may use a **dedicated charger that controls current and monitors temperature and voltage**. The chapter also describes **pulse charging**: once the battery is approximately **85% charged**, the system supplies short charging-current pulses rather than continuing an uninterrupted current at the earlier rate.

Different aircraft installations can use different approved arrangements; the important source principle is that charging control must match the battery chemistry and protect it from heat damage.

### 7.3 What happens after engine start

If the aircraft battery supplied energy for engine starting, the generator ordinarily **recharges it after coming online**, whether the battery is lead-acid or alkaline.

A comparatively high initial indication may appear on:

* The **generator load ammeter**, or
* The **centre-zero battery ammeter**.

As the battery recovers, the indicated charging demand should **fall**. If the charge rate stays abnormally high or climbs further, the textbook warns that this can indicate a battery fault and that excessive charging current can lead to overheating and damage.

\---

## 8\. Secondary-Battery Chemistry at a Glance

The figure and accompanying text contrast charged and discharged materials. The table below retains the **source's specific chemistry, neutralizers and SG values**, but uses a different study-note layout.

|Feature|Lead-acid secondary battery|Alkaline (NiCad) secondary battery|
|-|-|-|
|Charged positive plate|Lead peroxide|Nickel oxide|
|Charged negative plate|Spongy lead|Cadmium|
|Discharged positive plate|Lead sulphate|Nickel hydroxide|
|Discharged negative plate|Lead sulphate|Cadmium hydroxide|
|Electrolyte|Sulphuric acid and water|Potassium hydroxide and distilled water|
|SG when fully charged|About **1.270**|About **1.240–1.300**|
|SG when discharged|About **1.170**|Remains broadly similar to its charged condition|
|Cell's nominal loaded voltage|**2.0 V**|**1.2 V**|
|Source-listed spillage neutralizer|**Sodium bicarbonate + water**|**Boric acid**|
|Best test of remaining charge/capacity in this chapter|SG trend, supported by load testing|Measured capacity/discharge test; SG is not a useful indication|
|Principal caution emphasized|Corrosive acid; water loss/gassing; cold-weather freezing of weak electrolyte|**Thermal runaway** during faulty/uncontrolled charging|

**Safety note:** The table describes the neutralizers named in the source, not a substitute for current aircraft-specific spill procedures, PPE, isolation, or chemical safety instructions.

### Figure 4.9 — image-generation prompt

> Recreate a \*\*wide pastel-colored secondary-battery comparison table\*\* in an aviation training manual on white, inside a light grey frame. At top left place a pale yellow boxed heading exactly \*\*`Secondary batteries: Summary.`\*\*; to its right a \*\*pale blue legend square\*\* labelled \*\*`CHARGED`\*\* and a \*\*pale pink legend square\*\* labelled \*\*`DISCHARGED`\*\*. The grid has column headings \*\*`POSITIVE`\*\*, \*\*`NEGATIVE`\*\*, \*\*`ELECTROLYTE`\*\*, \*\*`SPILLAGE`\*\*, and \*\*`SG`\*\*, with a category column at far left. Two main categories: \*\*`LEAD ACID`\*\* with a small realistic grey battery picture, and \*\*`ALKALINE`\*\* with a small blue-white battery picture. For \*\*LEAD ACID\*\*, blue charged row: `lead peroxide`, `spongy lead`, `sulphuric acid`, spillage cell `Sodium bicarbonate + water`, SG `1.270`; pink discharged row: `lead sulphate`, `lead sulphate`, `weak sulphuric acid`, SG `1.170`. For \*\*ALKALINE\*\*, blue charged row: `nickel oxide`, `cadmium`, `potassium hydroxide / distilled water`, spillage cell `Boric acid`, SG `1.240 - 1.300`; pink discharged row: `nickel hydroxide`, `cadmium hydroxide`, `potassium hydroxide / distilled water`. Preserve the original merged yellow category and spillage cells, grid lines, uppercase headings, narrow text-wrap arrangement, and caption \*\*`Figure 4.9`\*\*. Ensure all spelling and numeric labels exactly match the listed wording.

\---

## 9\. Core Worked Examples

### 9.1 Combining aircraft batteries in series

**Question:** Three identical 12 V, 40 Ah batteries are connected positive-to-negative in one chain. What are their combined ratings?

$$
V\_{\\mathrm{total}}=3\\times12\~\\mathrm{V}=\\boxed{36\~\\mathrm{V}}
$$

Their capacity remains:

$$
C\_{\\mathrm{total}}=\\boxed{40\~\\mathrm{Ah}}
$$

**Reasoning:** The same current must pass through each series-connected battery. Voltages add, but the ampere-hour rating of matching batteries does not triple.

### 9.2 Combining aircraft batteries in parallel

**Question:** Two identical 12 V, 40 Ah batteries are connected with matching positive terminals together and matching negative terminals together.

$$
V\_{\\mathrm{total}}=\\boxed{12\~\\mathrm{V}}
$$

$$
C\_{\\mathrm{total}}=40+40=\\boxed{80\~\\mathrm{Ah}}
$$

**Reasoning:** The batteries share a common terminal voltage and provide additional combined ampere-hour capacity.

### 9.3 Cells needed for a 12 V lead-acid battery

At the chapter's normal **2 V per lead-acid cell**:

$$
N=\\frac{12\~\\mathrm{V}}{2\~\\mathrm{V/cell}}=\\boxed{6\~\\mathrm{cells}}
$$

Six cells connected in series provide a nominal 12 V battery.

### 9.4 Off-load indication for a nominal 24 V lead-acid battery

The chapter gives an illustrative unloaded cell voltage of **2.2 V**. For 12 cells:

$$
V\_{\\mathrm{off\\ load}}=12\\times2.2\~\\mathrm{V}=\\boxed{26.4\~\\mathrm{V}}
$$

For the chapter's multiple-choice question, the nearest answer supplied is **26 V**. The test's selected option is therefore consistent with a rounded nominal indication, rather than 24 V exactly.

### 9.5 Capacity retained by a deteriorated battery

A 60 Ah battery supplies its rated one-hour load for only 42 minutes:

$$
t=\\frac{42}{60}\~\\mathrm{h}=0.7\~\\mathrm{h}
$$

$$
C\_{\\mathrm{actual}}=60\~\\mathrm{A}\\times0.7\~\\mathrm{h}=42\~\\mathrm{Ah}
$$

$$
\\mathrm{Efficiency}=\\frac{42}{60}\\times100%=\\boxed{70%}
$$

That is below the chapter's **80%** minimum serviceability figure.

\---

## 10\. Diagnostic Revision Notes

**Primary versus secondary:** A primary cell is normally discarded after depletion; a secondary cell can be recharged by reversing the discharge reaction.

**Cell potential versus battery capacity:** The chemistry controls a cell's nominal voltage; the **effective plate area** strongly influences capacity. Series connection is chiefly a voltage decision; parallel connection is chiefly a capacity decision.

**Lead-acid versus NiCad:** Lead-acid condition can be judged in part from changing electrolyte **SG**. NiCad voltage remains much more stable during discharge, and its electrolyte SG gives little indication of charge remaining, so capacity testing is important.

**On load versus off load:** A battery may look healthy on a voltmeter with no meaningful demand. Check the voltage's ability to hold up during a **specified load** for the required time.

**Battery charging:** Charging after engine start should initially show increased demand followed by a decrease. A persistently increasing charge rate is not normal and risks damage.

**Chemical handling:** Lead-acid acid spills and NiCad alkaline spills require **different** handling/neutralizing materials. Apply the correct aircraft-approved safety procedure, not a generic solution.

\---

## 11\. Rewritten Chapter Examination Questions

The three examination groups below preserve the **same 30 source question concepts and difficulty level**. Wording is independently restated, and the correct answers follow the source's answer key; explanations clarify the electrical principles.

### Batteries 1: Ten Rewritten Multiple-Choice Questions

**1. Which equipment is appropriate for checking an aircraft battery’s terminal voltage under its specified test demand?**

* **A.** A megohmmeter
* **B.** A voltmeter while the rated load is applied
* **C.** An ammeter set to the rated voltage
* **D.** A hydrometer alone

**Answer: B — A voltmeter while the rated load is applied.** A voltmeter measures terminal potential difference. Applying the specified load reveals whether that voltage can be maintained.

**2. What is obtained when two matching 12 V, 40 Ah batteries are placed in series?**

* **A.** 12 V, 80 Ah
* **B.** 12 V, 20 Ah
* **C.** 24 V, 80 Ah
* **D.** 24 V, 40 Ah

**Answer: D — 24 V, 40 Ah.** Series adds 12 + 12 volts; the ampere-hour rating remains 40 Ah.

**3. What is the combined nominal rating of two matching 12 V, 40 Ah batteries connected in parallel?**

* **A.** 12 V, 80 Ah
* **B.** 24 V, 80 Ah
* **C.** 12 V, 20 Ah
* **D.** 24 V, 40 Ah

**Answer: A — 12 V, 80 Ah.** Parallel batteries keep the same terminal voltage while their rated capacities add.

**4. How frequently does this textbook specify routine aircraft-battery capacity testing?**

* **A.** Every six months
* **B.** Every two months
* **C.** Every three months
* **D.** At every minor inspection only

**Answer: C — Every three months.** The chapter specifies a three-month interval in its reference maintenance context.

**5. Three batteries rated 12 V and 40 Ah apiece are connected in series. Which combined rating is correct?**

* **A.** 36 V, 120 Ah
* **B.** 12 V, 120 Ah
* **C.** 36 Ah, 120 W
* **D.** 36 V, 40 Ah

**Answer: D — 36 V, 40 Ah.** Series adds the three 12 V values but does not add the 40 Ah capacities.

**6. At a nominal ten-hour discharge rate, what current corresponds to a 40 Ah battery?**

* **A.** 40 A for 10 h
* **B.** 10 A for 4 h
* **C.** 4 A for 10 h
* **D.** 40 A for 1 h

**Answer: C — 4 A for 10 h.** 40 Ah divided by ten hours gives 4 A.

**7. What minimum actual-to-rated capacity percentage is stated as acceptable for continued service?**

* **A.** 10% above an arbitrary saturation level
* **B.** More than 70%
* **C.** At least 80%
* **D.** More than 90%

**Answer: C — At least 80%.** The textbook uses 80% of rated capacity as the minimum.

**8. When is a lead-acid battery’s voltage checked meaningfully for serviceability according to the chapter?**

* **A.** With the battery disconnected and entirely unloaded
* **B.** Only while its charging current is measured
* **C.** Only with the starter circuit absent
* **D.** With a specified/rated load switched on

**Answer: D — With a specified/rated load switched on.** The on-load voltage is the performance check rather than an unloaded indication alone.

**9. Which check can reveal the charge condition of an accessible lead-acid cell electrolyte?**

* **A.** Reading an ammeter alone
* **B.** Measuring specific gravity with a hydrometer
* **C.** Adding boric acid
* **D.** Measuring electrode resistance with an ohmmeter

**Answer: B — Measuring specific gravity with a hydrometer.** Lead-acid electrolyte SG moves with charge condition.

**10. Why cannot a battery be used as a direct source of alternating current?**

* **A.** An AC system requires all batteries in series
* **B.** The cable cross-section prevents AC delivery
* **C.** A battery produces direct current rather than AC
* **D.** Only a nickel-cadmium battery can generate AC

**Answer: C — A battery produces direct current rather than AC.** Batteries provide DC; converting it to AC requires additional equipment.

### Batteries 2: Ten Rewritten Multiple-Choice Questions

**1. What specific gravity does the chapter associate with a fully charged lead-acid cell?**

* **A.** 1.270
* **B.** 1.090
* **C.** 1.120
* **D.** 0.127

**Answer: A — 1.270.** The reference full-charge SG is approximately 1.27.

**2. What is the stated nominal loaded voltage of one lead-acid cell?**

* **A.** 1.2 V
* **B.** 1.5 V
* **C.** 1.8 V
* **D.** 2.0 V

**Answer: D — 2.0 V.** The chapter states approximately 2 V on load per lead-acid cell.

**3. For an operational voltage assessment, a lead-acid aircraft battery should be checked under which condition?**

* **A.** Only on an open circuit
* **B.** Using a trimming circuit
* **C.** By inserting an ammeter across its terminals
* **D.** With an appropriate electrical load applied

**Answer: D — With an appropriate electrical load applied.** Loading the battery exposes weakness hidden by open-circuit voltage.

**4. Approximately what voltage may a fully charged nominal 24 V lead-acid battery show with loads disconnected?**

* **A.** 22 V
* **B.** 24 V
* **C.** 26 V
* **D.** 28 V

**Answer: C — 26 V.** Twelve cells at about 2.2 V off load give 26.4 V; the source selects 26 V.

**5. Which charging arrangement is described as normally keeping a lead-acid aircraft battery topped up in flight?**

* **A.** Constant current only
* **B.** Constant electrical load
* **C.** Constant resistance
* **D.** Constant regulated voltage

**Answer: D — Constant regulated voltage.** The chapter cites regulated 14 V and 28 V supplies for nominal 12 V and 24 V batteries.

**6. Two identical batteries are placed in series. What happens to their ratings?**

* **A.** Voltage doubles and capacity halves
* **B.** Output voltage is halved
* **C.** Voltage doubles while ampere-hour capacity is unchanged
* **D.** Voltage and ampere-hour capacity both double

**Answer: C — Voltage doubles while ampere-hour capacity is unchanged.** A series connection adds their voltages without adding their matched Ah ratings.

**7. What is the nominal loaded voltage of one nickel-cadmium alkaline cell?**

* **A.** 2.2 V
* **B.** 1.8 V
* **C.** 1.2 V
* **D.** 0.12 V

**Answer: C — 1.2 V.** The cell is rated at approximately 1.2 V on load.

**8. What is the approximate electrolyte-specific-gravity range given for a charged nickel-cadmium cell?**

* **A.** 0.120–0.130
* **B.** 1.160
* **C.** 1.240–1.300
* **D.** 1.800

**Answer: C — 1.240–1.300.** The source provides about 1.24 to 1.30; SG does not usefully track NiCad charge state.

**9. What is the acid component of the diluted electrolyte in a lead-acid battery?**

* **A.** Hydrochloric acid
* **B.** Sulphuric acid
* **C.** Boric acid
* **D.** Potassium hydroxide

**Answer: B — Sulphuric acid.** Sulphuric acid in water is the lead-acid electrolyte.

**10. What substance forms the alkaline electrolyte in a nickel-cadmium battery?**

* **A.** Saline solution
* **B.** Sulphuric acid
* **C.** Cadmium metal suspended in distilled water
* **D.** Potassium hydroxide solution

**Answer: D — Potassium hydroxide solution.** Potassium hydroxide dissolved in distilled water provides the alkaline medium.

### Batteries 3: Ten Rewritten Multiple-Choice Questions

**1. How many 2 V lead-acid cells connected in series make a nominal 12 V battery?**

* **A.** 8
* **B.** 12
* **C.** 6
* **D.** 10

**Answer: C — 6.** 12 V / 2 V per cell = six cells.

**2. A voltmeter connected across an unloaded battery primarily indicates which electrical quantity?**

* **A.** Electromotive force/terminal potential difference
* **B.** Resistance
* **C.** Proof that the battery is flat
* **D.** Only residual output after complete discharge

**Answer: A — Electromotive force/terminal potential difference.** With no loads connected the reading is an open-circuit potential difference.

**3. What primarily sets the characteristic nominal voltage of an electrochemical secondary cell?**

* **A.** Its total number of plates
* **B.** Its plate surface area
* **C.** The diameter of its external terminals
* **D.** Its electrode active materials and chemical system

**Answer: D — Its electrode active materials and chemical system.** Plate chemistry controls cell potential; plate area more directly influences capacity.

**4. At what level is the electrolyte maintained in the chapter’s refillable lead-acid cell?**

* **A.** Slightly below the upper plates
* **B.** Up to the filler-cap rim
* **C.** One inch below the plate tops
* **D.** Just above the upper edges of the plates

**Answer: D — Just above the upper edges of the plates.** The source specifically directs keeping liquid just over the plate tops.

**5. Which liquid is used for topping up a refillable lead-acid battery?**

* **A.** Undiluted sulphuric acid
* **B.** Distilled water
* **C.** Fresh sulphuric acid mixture
* **D.** Boric acid

**Answer: B — Distilled water.** The lost component is primarily water, so the described top-up liquid is distilled water.

**6. Why are non-spill vent arrangements used on aircraft batteries?**

* **A.** To reduce electrolyte escape during severe manoeuvres
* **B.** To prevent loss of water only
* **C.** To ensure no gas can vent from the battery
* **D.** To prevent splashing exclusively during topping up

**Answer: A — To reduce electrolyte escape during severe manoeuvres.** Non-spill vents address unwanted liquid escape while preserving the function of battery venting.

**7. What battery-cell characteristic strongly influences lead-acid capacity?**

* **A.** Effective plate area
* **B.** Plate chemical identity alone
* **C.** Thickness of external connecting bars
* **D.** Number of insulating separators alone

**Answer: A — Effective plate area.** The chapter associates capacity with the area of the plates.

**8. Which source-listed material neutralizes a lead-acid electrolyte spill?**

* **A.** Caustic soda
* **B.** Soap solution only
* **C.** Ordinary soda crystals only
* **D.** Sodium bicarbonate solution in water

**Answer: D — Sodium bicarbonate solution in water.** Bicarbonate of soda and water are specified for sulphuric-acid electrolyte.

**9. What happens to the battery-to-bus connection when the aircraft battery master switch is switched off in flight?**

* **A.** Generators are necessarily disconnected from the bus
* **B.** The ammeter must show full deflection
* **C.** The battery is disconnected from the busbar
* **D.** The battery discharges through bonding diodes

**Answer: C — The battery is disconnected from the busbar.** The master switch isolates the battery from the aircraft electrical bus.

**10. When the generator is online in the typical DC aircraft system described, how is the battery connected relative to normal electrical loads?**

* **A.** In parallel with the loads
* **B.** In series with the generator output
* **C.** Switched into series only while generating
* **D.** Always independently load-sharing in a separate isolated circuit

**Answer: A — In parallel with the loads.** The battery is connected across the supply bus, in parallel with other connected loads.



\---

## 12\. Extra Diagnostic Self-Test Questions

1. **Why is a battery regarded as a chemical source of electricity?**  
Because chemical reactions between electrode materials establish a potential difference and release usable electrical energy when a circuit is connected.
2. **What makes a secondary cell different from a primary one?**  
Its chemical state can be restored by a charging current flowing opposite to the discharge current.
3. **What two independent ratings are needed to describe a battery assembly?**  
Nominal voltage and ampere-hour capacity.
4. **How are cells arranged to raise output voltage?**  
In series, positive terminal to adjacent negative terminal.
5. **How are matching cells arranged to obtain more ampere-hour capacity without raising voltage?**  
In parallel, with all positive terminals common and all negative terminals common.
6. **Why should the same Ah figure not be expected at every possible discharge current?**  
High discharge current can reduce the practically available capacity.
7. **Which active materials are present in a fully charged lead-acid cell?**  
Lead peroxide at the positive plate and spongy lead at the negative plate.
8. **How does a hydrometer help with lead-acid battery monitoring?**  
It measures electrolyte specific gravity, whose fall reflects weakening acid concentration during discharge.
9. **What do SG values of about 1.27 and 1.17 mean for the source's lead-acid example?**  
They are its approximate charged and discharged reference values.
10. **Why might a weak lead-acid battery electrolyte freeze more readily?**  
Discharge reduces the electrolyte's acid strength, making it more vulnerable in very low temperatures.
11. **What is the loaded voltage of a normal lead-acid cell and the approximate unloaded voltage?**  
Roughly 2.0 V and 2.2 V, respectively.
12. **Why is electrolyte specific gravity not a dependable indication of NiCad remaining charge?**  
The alkaline electrolyte SG changes very little between charged and discharged states.
13. **What electrical property makes a NiCad attractive for essential standby supply?**  
It maintains a comparatively steady terminal voltage for much of its discharge.
14. **Describe the mechanism of NiCad thermal runaway.**  
Excess heat lowers effective internal resistance, which may increase charging current, leading to still more heat unless charging is interrupted.
15. **What protection does the described NiCad thermal switch provide?**  
It disconnects the charging source when temperature exceeds the preset value and can reset after cooling.
16. **What does the example 60 Ah battery operating for only 0.7 h at 60 A reveal?**  
Actual capacity is 42 Ah, or 70% of its rated capacity.
17. **Which equipment might be preserved by load shedding after generator failure?**  
Essential attitude indication, communications, lighting, pitot heating and other flight-critical services.
18. **Why is an on-load voltage test better than measuring an unloaded battery alone?**  
It checks whether useful terminal voltage can be sustained when the battery supplies significant current.
19. **What regulated voltages does the chapter give for 12 V and 24 V lead-acid systems?**  
14 V and 28 V, respectively.
20. **What charging indication is expected after starting an engine on battery power?**  
An initially high charging current that decreases as the generator restores the battery's charge.



