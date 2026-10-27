# Chapter 23: Gas Turbines — Ignition Systems

## 1. General

Gas turbine engines are equipped with **dual ignition systems**. For starting, they use **high-energy (HE) ignition**, with an ignition discharge of approximately **12 joules**. The joule is a unit of energy: a power of one watt sustained for one second corresponds to one joule.

Ignition may also be needed after the engine has started. During operations such as a **take-off from a contaminated runway** or **flight through heavy precipitation**, keeping the igniters active can reduce the risk of **flameout**. However, continuous operation at starting-energy levels rapidly wears away the material of the igniter plug, greatly reducing its service life.

To limit that wear, some engines have a combined system offering two ignition-energy settings:

- **High-energy ignition:** Approximately **6–12 joules**, selected for starting.
- **Low-energy ignition:** Approximately **3–6 joules**, intended for continuous operation when additional protection against flameout is required.

### 1.1 Ignition Components and Their Positions

> **Image Generation Prompt — Figure 23.1**
>
> Faithfully reconstruct a horizontal, cutaway aviation-engine technical illustration in the source's clean white-background textbook style. The upper half contains the combustion-chamber section: a broad salmon-pink/orange combustion volume, jagged flame-side boundary toward the LEFT, and a fuel spray nozzle mounted at the UPPER RIGHT. The nozzle directs a thin yellow triangular **fuel spray cone** diagonally leftward into the chamber, shown with narrow yellow rays. A small igniter tip enters the bottom of the combustion chamber near its centre-left; show bright red/yellow ignition flashes immediately inside the chamber above the tip. Across the image's lower middle is a wide, diagonally rising GREY **by-pass duct** with two large dark-blue arrows pointing toward the LEFT and the words **“BY-PASS DUCT”** in white over the duct. The long dark-grey igniter plug projects diagonally upward from a rectangular, outlined high-energy ignition box beneath the duct and is connected to that box by a thick curved vivid-RED insulated cable with its loop reaching the RIGHT side. Draw the rectangular white/grey metal **high-energy igniter unit** in the lower-left, with visible black mechanical connection fittings. Include every original uppercase callout with matching red arrowheads and similar positioning: **“FUEL SPRAY CONE”** at the upper left pointing to the yellow spray; **“COMBUSTION CHAMBER”** at the middle-left; **“IGNITER PLUG”** at the lower-left pointing to the central igniter; and **“HIGH ENERGY IGNITER UNIT”** at the lower-right with a long red arrow pointing toward the box. Preserve the technical cross-sectional appearance, orange chamber, grey duct, blue flow arrows, red wiring, nozzle location, and the source's near-square image proportions. Use no scenery or unrelated elements. Caption exactly: **“Figure 23.1”**.

### 1.2 Starting Ignition

The **engine-start sequence** brings the starting ignition system into operation. Depending on the aircraft installation, ignition is initiated automatically or through the pilot's operation of a **high-pressure (HP) cock**, **start lever**, or combined **fuel-and-ignition switch**.

Once the engine has accelerated beyond **self-sustaining speed**, the starting igniters are switched off automatically at a later point in the sequence. A **speed switch associated with the HP rpm indication** is a typical means of carrying out this deactivation.

### 1.3 Continuous Ignition

**Continuous ignition** is selected through the **engine-start panel**. On engines with a dual-energy selection, this setting uses the **low-energy mode**, allowing ignition support to continue without the rapid plug deterioration associated with prolonged high-energy operation.

### 1.4 Automatic Ignition

Some aircraft also have **automatic ignition selection**. A common arrangement links this function to the **aircraft stall-warning system**: when the system detects a stall, it automatically commands **continuous ignition**.

## 2. The High Energy Ignition Unit

A **high-energy ignition unit (HEIU)** accumulates electrical energy in a large **capacitor**, then releases it suddenly to produce a spark at an igniter plug. Because a capacitor of this capacity can retain a dangerous, potentially lethal charge, the unit incorporates protective circuitry for operation and servicing.

The circuit described here operates from a **28-volt DC supply**.

### 2.1 Circuit Arrangement

> **Image Generation Prompt — Figure 23.2**
>
> Reproduce the source's TALL, NARROW, VERTICALLY arranged high-energy ignition-unit electrical schematic on a pure white background within a thin grey rectangular border. Use BLACK conductive lines and conventional electronics symbols, RED for coils and resistor zigzags, and a pale-YELLOW rounded rectangle enclosing the spark/discharge-gap symbol. **At the BOTTOM**, show two large low-tension DC input terminals marked **“+”** at left and **“−”** at right, with a broken/dashed circular enclosure around them; the exact callout below is **“LT CONNECTION DC SUPPLY”**. Just above, place a RED primary winding, a red-lined laminated magnetic **INDUCTION COIL** core, and a RED secondary winding above the core. At the lower right, draw an open switching contact with the label **“TREMBLER MECHANISM”**; beneath it show a black two-plate capacitor labeled **“PRIMARY CAPACITOR”**. Put **“PRIMARY”** beside the lower red coil and **“SECONDARY”** beside the upper red coil. A vertical set of FOUR black rectifier-diode symbols arranged as two horizontal pairs runs above the transformer and is indicated by two black arrowheads from the label **“RECTIFIER”** on the left. Above the rectifiers, draw a black parallel-plate component connected across left and right conductors and label it **“RESERVOIR CAPACITOR”**. Above that capacitor, a horizontal pair of two RED zigzag resistors forms the **“DISCHARGE RESISTORS”** connection across the rails. Higher up, place the pale-yellow **“DISCHARGE GAP”** on the left vertical rail with a black spark-gap symbol inside it; above the gap, another horizontal pair of red zigzag resistors bridges the rails and is labeled **“SAFETY RESISTORS”**. Near the UPPER LEFT, show a vertically stacked RED inductor with the exact adjacent label **“CHOKE”**. Connect this coil upward to a small open circular terminal at top center labeled **“HT CONNECTION TO IGNITER PLUG”**. At the upper right, draw the black three-horizontal-line electrical ground/earth symbol attached to the right-hand rail. Retain the circuit's original connections, top-to-bottom order, component quantities, callout spellings, lettering placement, red-and-black color coding, and vertical proportions; do not invent any additional circuits or labels. Caption exactly: **“Figure 23.2”**.

### 2.2 Converting the DC Supply into High Voltage

When the unit receives **28 V DC**, both the **primary winding** of the induction coil and the **trembler mechanism** are energized. The trembler repeatedly makes and breaks the circuit, functioning much like the contact mechanism of an electric bell.

The repeated interruption produces a **sawtooth-like changing electrical input** in the primary circuit. Although the source is DC, this changing waveform provides the alternating effect needed for **transformer action**. The induction coil raises the voltage at the secondary winding to approximately **25,000 volts**.

### 2.3 Rectification and Energy Storage

The high-voltage alternating output is passed through **rectifiers**, which convert it back into DC. This rectified supply charges the **reservoir capacitor**.

Electrical energy continues to accumulate until the voltage reaches the level at which the **discharge gap** breaks down and a spark passes across it. The stored energy is then released toward the igniter plug.

### 2.4 Function of the Choke

During discharge, current passes through a **choke**, which acts as an **inductance**. It limits how quickly the discharge current rises and flows, extending the **duration of the spark** before the energy reaches the igniter in the combustion chamber.

### 2.5 Discharge Resistors

Even with the electrical supply disconnected, the reservoir capacitor can retain a dangerous charge. The **discharge resistors** provide a path for that charge to diminish after switch-off. Their purpose is to reduce the residual electrical energy so that a removed HEIU does not remain dangerously charged during servicing.

### 2.6 Safety Resistors

The **safety resistors** provide protection against an abnormal build-up of capacitor voltage if the **igniter plug becomes disconnected**. Without a normal discharge path, stored energy could continue to increase and potentially cause the capacitor to rupture or explode.

When the charge rises excessively, these resistors provide an alternative path for electrical energy. They thereby limit the abnormal charge imbalance across the capacitor plates and help protect the ignition unit.

### 2.7 Discharge Frequency

A typical HEIU produces about **60–100 sparks per minute**. The discharges are **random rather than synchronized** between the two ignition units.

When relight is selected before an engine start, a person listening at the **jet pipe** would therefore hear an **irregular, unsynchronized series of discharges** if both units were operating correctly.

### 2.8 Other Ignition-Unit Designs

The capacitor-and-trembler arrangement is not the only form of ignition equipment. **Transistorized units** are also used. Where an aircraft has an **AC electrical system**, an ignition unit may be designed to operate directly from that type of electrical supply.

## 3. Igniter Plugs

Two principal forms of gas-turbine igniter plug are used. Their main difference is the way in which the spark is established and the voltage required to produce it.

### 3.1 Conventional Large-Gap Igniter Plug

The earlier type resembles a **piston-engine spark plug**, but has a **substantially wider spark gap**. To make a spark jump that gap requires a potential of approximately **25,000 V**.

The high operating voltage demands particularly effective **electrical insulation**, both within the igniter assembly and along the connecting cables.

### 3.2 Surface-Discharge Igniter Plug

A newer design uses a **surface-discharge igniter**. Unlike the conventional large-gap plug, the end of its insulating section incorporates a **semiconductor material**.

> **Image Generation Prompt — Figure 23.3**
>
> Create a highly faithful, horizontally oriented CUTAWAY sectional engineering drawing of the original surface-discharge gas-turbine igniter plug. Use a WHITE page background and a thin grey rectangular illustration border. The igniter runs LEFT TO RIGHT, with its narrow discharge tip at far LEFT and a broader internally threaded connection body toward RIGHT. Reproduce the large solid ORANGE outer metal housing and its stepped internal channel, including GREY triangular external screw threads on both the upper and lower edges toward the right half. A long, straight bright-RED **hot electrode** extends horizontally inside the igniter from near the right side to the left tip, narrowing slightly as it approaches the left. Surround the red electrode with densely patterned BLUE-and-WHITE insulating material, leaving the ORANGE shell as the external body. At the extreme left tip, show a short, yellow finely patterned **semiconductor material** section bridging the gap between central electrode and outer housing. Include the central internal housing change in diameter, grey/white connector space on the RIGHT, and small rectangular protrusions between threaded regions along the upper and lower shell. Precisely reproduce the source callouts in bold BLACK uppercase, each with a thin black pointer: **“HOT ELECTRODE”** pointing diagonally to the red inner rod from the upper left; **“INSULATOR”** pointing down from the upper central-left to the blue patterned material; **“SEMICONDUCTOR MATERIAL”** below left pointing up toward the yellow tip; and **“NICKEL-CHROMIUM SHELL”** below centre-right with a pointer toward the lower grey external thread and orange body. Match the original short, wide composition, flat textbook palette, clear cross-section, linework, and arrangement. Add no other labels. Caption exactly: **“Figure 23.3”**.

The semiconductor permits a small amount of **electrical leakage** between the **hot electrode** and the igniter body. This leakage **ionizes the semiconductor surface**, creating a path of comparatively low electrical resistance for the energy released from the ignition capacitor.

The result is an intense **surface flashover** between the energized central electrode and the igniter body. Because the conductive path forms across the semiconductor surface, the required voltage is only about **2,000 V**, much lower than that of a conventional large-gap igniter.

The installation shown in **Figure 23.1** places the HEIU on the engine side and positions the igniter so that its discharge enters the **combustion chamber**.

## Questions

**1.** In which circumstance is the **low-energy ignition** setting used?

   a. Only when starting the engine on the ground.  
   b. During a take-off from a wet runway.  
   c. For an engine relight at high altitude.  
   d. During an engine blow-out or motoring-over cycle.

**2.** When might the precautionary selection of igniters be necessary?

   a. While flying through a heavy tropical rainstorm.  
   b. During ordinary ground running.  
   c. While flying in sandy conditions.  
   d. While flying in very dry air.

**3.** What is the operating principle of a **high-energy ignition system**?

   a. A step-up transformer drawing power from the aircraft's AC electrical supply.  
   b. Magnetostatic induction.  
   c. Fleming's right-hand rule.  
   d. Releasing energy previously stored in a capacitor.

**4.** For a gas turbine with both high- and low-energy ignition, select the corresponding purposes **(i) high energy** and **(ii) low energy**.

   | Option | (i) High-energy ignition | (ii) Low-energy ignition |
   |---|---|---|
   | a | Engine starting | Relight at high altitude |
   | b | Relight at high altitude | Take-off from a contaminated runway |
   | c | Take-off from a snow-covered runway | Engine starting |
   | d | Take-off from a flooded runway | Take-off from a snow-covered runway |

**5.** What is the purpose of the **discharge resistors** in a high-energy ignition unit?

   a. To hold enough capacitor energy for relighting at altitudes up to 55,000 ft.  
   b. To protect the unit from excessive voltage.  
   c. To let the capacitor discharge after the electrical supply has been switched off.  
   d. To lengthen the spark discharge.

**6.** What does the **choke** do in a high-energy ignition unit?

   a. Protects the unit from excessive voltage.  
   b. Extends the duration of the discharge reaching the igniter plug.  
   c. Increases the service life of the igniter.  
   d. Protects the unit from excessive current.

**7.** What is the normal discharge rate of a **high-energy ignition unit**?

   a. Between 60 and 100 discharges per minute.  
   b. Four discharges per engine revolution.  
   c. Between 60 and 100 discharges per second.  
   d. A rate determined by the igniter plug's resistance.

**8.** Which combination describes the electrical supply to the **spark in the combustion chamber**?

   a. Low voltage and high current.  
   b. Low voltage and low current.  
   c. High voltage and low current.  
   d. High voltage and high current.

## Answers

| Question | Answer |
|---|---|
| 1 | b |
| 2 | a |
| 3 | d |
| 4 | b |
| 5 | c |
| 6 | b |
| 7 | a |
| 8 | d |
