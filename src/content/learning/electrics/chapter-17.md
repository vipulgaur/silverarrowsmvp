# Chapter 17: AC Electrics — Logic Gates

## 1\. Introduction to Logic Gates

Electronic computers and related control equipment make decisions by processing electrical signals. One of the simplest building blocks used for this purpose is the **logic gate**: a circuit whose output follows a defined logical rule based on the signals applied to its inputs.

A single **integrated circuit (IC)** can contain several interconnected gates. Although a gate may accept more than one input, the basic gate functions discussed here each provide **one output**. Its name indicates the relationship that must exist between its inputs and output.

The six standard functions covered in this chapter are **AND**, **OR**, **INVERT (NOT)**, **NAND**, **NOR** and **EXCLUSIVE OR (XOR)**.

## 2\. Binary Logic

Digital gates operate with just **two possible signal states**, rather than continuously varying values. These are written as **1** and **0**.

|Binary state|Common descriptions|
|-|-|
|**1**|ON, TRUE, HIGH (H), CLOSED, ENGAGED|
|**0**|OFF, FALSE, LOW (L), OPEN, DISENGAGED|

These descriptions can refer to the condition being represented—for example, whether a switch is operated or whether a particular system condition is true. They are not, by themselves, fixed voltage measurements: the voltages corresponding to 1 and 0 depend on the logic convention used in the circuit.

## 3\. Truth Tables

A **truth table** records how a gate responds to every possible combination of input states. Each row presents one input combination and its corresponding output.

For a gate with **two binary inputs**, there are four possible combinations: **00, 01, 10 and 11**. A gate with only one input has two possible input states. Comparing the observed output with the table helps confirm correct operation and is useful when **troubleshooting digital circuits**.

Throughout the chapter, **A** and **B** identify inputs and **C** identifies the output where a two-input gate is shown.

## 4\. Gate Symbols and Signal Direction

Each gate is represented by a recognizable circuit symbol. In the diagrams used here, **inputs enter from the left** and the **single output leaves on the right**. The outline identifies the logic function, and a small circle at a symbol's output indicates that the result is **inverted**.

Signals at the input and output are written as 1 or 0. In a typical positive-logic circuit, 1 is associated with the higher voltage and 0 with the lower voltage, often ground or a reference close to zero volts. This relationship must be interpreted using the circuit's chosen logic convention.

## 5\. Positive and Negative Logic

The meanings of binary **1** and **0** depend on which electrical level the designer assigns to each state. The actual voltages vary between systems; they do not have to be a particular number of volts.

### 5.1 Positive logic

With **positive logic**, the **more positive (higher) voltage** is designated **binary 1**, while the **less positive (lower) voltage** is designated **binary 0**. Both voltage levels may be positive, both may be negative, or the pair may span positive and negative voltages. What matters is their **relative order**.

Positive logic is the more widely used convention in the digital systems described in the textbook. **All gate examples that follow use positive logic.**

### 5.2 Negative logic

**Negative logic** reverses that allocation: the **lower voltage** represents **binary 1**, while the **higher (more positive) voltage** represents **binary 0**. It is less common, but may be selected to meet particular circuit-design requirements.

|Convention|Binary 1|Binary 0|
|-|-|-|
|Positive logic|Higher voltage level|Lower voltage level|
|Negative logic|Lower voltage level|Higher voltage level|

\---

## 6\. The AND Gate

An **AND gate** produces a **1** only when **every input is 1**. If even one input is 0, the output becomes 0. The same requirement applies whether the gate has two inputs, three inputs or more: **all of them must be on** for the output to be on.

For a two-input AND gate:

|Input A|Input B|Output C|
|-:|-:|-:|
|0|0|0|
|0|1|0|
|1|0|0|
|1|1|1|

> \*\*Image Generation Prompt — Figure 17.1 The symbol and truth table for an ‘AND’ gate\*\*
>
> Re-create the original composite aviation-electronics textbook figure on a pure white background, using a fine pale-grey outer border and \*\*three separate double-black-bordered panels\*\*. At \*\*upper left\*\*, label the panel \*\*“SYMBOL”\*\* and draw a conventional two-input AND symbol: black D-shaped outline with a straight vertical left edge and semicircular right edge; two horizontal black inputs from dark-blue circular terminals at the left labelled \*\*A\*\* and \*\*B\*\*, the group label \*\*“INPUTS”\*\*, and one horizontal black line to a dark-blue output terminal at right labelled \*\*C\*\* and \*\*“OUTPUT”\*\*. At \*\*upper right\*\*, label \*\*“TRUTH TABLE”\*\* and draw a black-grid table with \*\*bright-yellow header cells\*\*, the headings \*\*“INPUTS”\*\* above \*\*A\*\*, \*\*B\*\*, and \*\*“OUTPUT”\*\* above \*\*C\*\*, followed by the exact four rows \*\*0 0 0 / 0 1 0 / 1 0 0 / 1 1 1\*\*. In the \*\*wide lower central panel\*\*, label \*\*“A SERIES CIRCUIT”\*\* and show a red vertical supply bar at far left; a white curved connection/terminal shape; \*\*two normally open black switches in series\*\*, labelled \*\*A\*\* and \*\*B\*\* above their contacts, with \*\*dark-blue connection dots\*\*; a circular \*\*yellow lamp\*\* labelled \*\*C\*\* and a black ground/return symbol at far right. Preserve the original panel order, whitespace, black technical linework, blue connection points, red supply bar, yellow lamp, and all exact words. Caption: \*\*“Figure 17.1 The symbol and truth table for an ‘AND’ gate”\*\*. Do not insert extra components or alter the switching arrangement.

### 6.1 Series-switch example

Two switches connected **in series** provide a physical demonstration of AND logic. Current can reach the lamp only if **switch A and switch B are both closed**. Opening either switch interrupts the only current path, so the lamp goes out.

For this reason an AND gate may be described as an **“ALL or NOTHING”** gate.

## 7\. The OR Gate

An **OR gate** supplies a **1** whenever **at least one input is 1**. It remains off only when **every input is 0**. Unlike AND logic, it does not require all inputs to be on; any one of them—or several together—is sufficient.

|Input A|Input B|Output C|
|-:|-:|-:|
|0|0|0|
|0|1|1|
|1|0|1|
|1|1|1|

> \*\*Image Generation Prompt — Figure 17.2 Representation of the ‘OR’ gate\*\*
>
> Produce one white-background textbook figure within a thin pale-grey rectangular perimeter, divided into \*\*three double-black-framed panels\*\*: \*\*upper left SYMBOL\*\*, \*\*upper right PARALLEL\*\*, and \*\*lower center TRUTH TABLE\*\*. \*\*SYMBOL:\*\* a black outlined two-input OR gate with gently concave left face and curved pointed right end, two input terminals in dark blue marked \*\*A\*\*, \*\*B\*\*, grouped under \*\*“INPUTS”\*\*, and one blue terminal at the right marked \*\*C\*\* and \*\*“OUTPUT”\*\*. \*\*PARALLEL:\*\* show a red vertical supply bar on the left, a curved white connection from it, \*\*two separate parallel branches\*\*, each with a normally open switch labelled \*\*A\*\* (upper) or \*\*B\*\* (lower), blue terminal dots at each switch, branches recombining into one black line feeding a \*\*yellow circular lamp\*\* labelled \*\*C\*\* and a black ground/return marking on the right; print \*\*“PARALLEL”\*\* beneath. \*\*TRUTH TABLE:\*\* bright-yellow dual-level header showing \*\*INPUTS A B\*\* and \*\*OUTPUT C\*\*, black grid and exact rows \*\*0 0 0 / 0 1 1 / 1 0 1 / 1 1 1\*\*, with \*\*“TRUTH TABLE”\*\* beneath. Retain the clean proportional spacing, nested thin-and-thick black rectangular framing, minimal colors, and original caption \*\*“Figure 17.2 Representation of the ‘OR’ gate”\*\*.

### 7.1 Parallel-switch example

Put two switches **in parallel** and connect them to one lamp. Closing either switch completes a path for current and illuminates the lamp. If both switches close, the lamp also remains on; it goes out only when both are open.

The OR function can therefore be called **“ANY or ALL”**.

## 8\. The INVERT or NOT Gate

The **INVERT**, or **NOT**, function simply **reverses its input**. It is the only gate in this group shown with **one input and one output**. Its output is 1 when its input is 0, and 0 when its input is 1. NOT gates are often combined with other gates to modify a larger logic function.

|Input A|Output B|
|-:|-:|
|0|1|
|1|0|

> \*\*Image Generation Prompt — Figure 17.3 Representation of the ‘INVERT’ or ‘NOT’ gate\*\*
>
> Reproduce the original three-panel monochrome/electrical training drawing within one pale-grey outer frame, on white. \*\*Upper-left panel\*\*, marked \*\*“SYMBOL”\*\*: a solid black triangular inverter pointing right with a \*\*small unfilled inversion circle\*\* at its tip, a blue circular input at left marked \*\*A\*\* and \*\*“INPUT”\*\*, and a blue circular output to the right marked \*\*B\*\* and \*\*“OUTPUT”\*\*. \*\*Upper-right panel\*\*, marked \*\*“RELAY CIRCUIT”\*\*: a red vertical power-supply bar at left with two horizontally routed circuits, one controlling a tall central grey relay coil represented by stacked black wire loops, and another passing through a \*\*normally closed relay contact\*\* to a bright-yellow circular lamp \*\*B\*\* at right; include the control switch \*\*A\*\*, blue connection dots, the black directional/ground marks, and the exact relay-contact positions. \*\*Lower centered panel\*\*, labelled \*\*“TRUTH TABLE”\*\*: yellow column headings \*\*“INPUT” A\*\* and \*\*“OUTPUT” B\*\*, followed by black-grid rows \*\*0 1\*\* and \*\*1 0\*\*. Match the original panel positions, red/blue/yellow/grey palette, and original caption exactly: \*\*“Figure 17.3 Representation of the ‘INVERT’ or ‘NOT’ gate”\*\*.

### 8.1 Relay example

A simple NOT circuit can use a control switch and a **normally closed relay contact**. With the control switch off, the relay is not operated and the lamp circuit remains closed. When the input switch is switched on, the relay operates and opens the lamp circuit, causing the output lamp to turn off. Thus the output always takes the opposite state to the input.

## 9\. The NAND Gate

**NAND** combines an **AND function with output inversion**. An AND gate gives 1 only when all inputs are 1; a NAND gate gives **0 only for that same combination**. For all other input combinations, its output is 1.

|Input A|Input B|Output C|
|-:|-:|-:|
|0|0|1|
|0|1|1|
|1|0|1|
|1|1|0|

> \*\*Image Generation Prompt — Figure 17.4 The representation of the ‘NAND’ gate\*\*
>
> Match the source's white-background composite layout: one thin grey outer rectangle; two equally sized double-black-bordered panels above and one centered double-black-bordered panel below. \*\*Top left — SYMBOL:\*\* D-shaped two-input AND gate with a \*\*small hollow inversion circle at the output\*\*; blue left terminals \*\*A\*\*, \*\*B\*\* with \*\*“INPUTS”\*\*, blue right output \*\*C\*\* with \*\*“OUTPUT”\*\*, and caption within box \*\*“SYMBOL”\*\*. \*\*Top right — RELAY CIRCUIT:\*\* red vertical supply strip at left, two open switches \*\*A\*\* and \*\*B\*\* \*\*in series\*\* along the bottom control path with blue contact points, a tall vertical grey relay coil slightly right of centre, the \*\*normally closed\*\* controlled contact in the upper lamp path, and a bright-yellow circular output lamp \*\*C\*\* grounded at far right; include the small black arrow/ground symbols and blue dots. \*\*Bottom — TRUTH TABLE:\*\* yellow header cells \*\*INPUTS\*\*, \*\*OUTPUT\*\*, \*\*A\*\*, \*\*B\*\*, \*\*C\*\*, and rows exactly \*\*0 0 1 / 0 1 1 / 1 0 1 / 1 1 0\*\*, with the words \*\*“TRUTH TABLE”\*\* underneath. Preserve the original crisp 2D technical style and caption exactly: \*\*“Figure 17.4 The representation of the ‘NAND’ gate”\*\*.

### 9.1 Relay-switch interpretation

The illustration combines **series-controlled relay operation** with an inverted output. Only when the two input switches are both closed does the relay energize and change the normally closed lamp contact to the open position. The lamp is therefore off for **A = 1, B = 1** and on for the other combinations.

## 10\. The NOR Gate

The **NOR** function is an **OR gate with its output inverted**. A NOR output is **1 only if all inputs are 0**. The moment any input becomes 1, the output changes to 0.

|Input A|Input B|Output C|
|-:|-:|-:|
|0|0|1|
|0|1|0|
|1|0|0|
|1|1|0|

> \*\*Image Generation Prompt — Figure 17.5 Representations of the ‘NOR’ gate\*\*
>
> Reproduce an instructional composite with a light-grey overall border and \*\*three black double-line framed panels\*\*: two across the top, one centered below. \*\*Upper-left SYMBOL:\*\* conventional outlined two-input OR symbol, concave input edge, curved tapering right side, \*\*a small hollow output-inversion circle\*\*, blue connection dots for \*\*A\*\*, \*\*B\*\* and \*\*C\*\*; left label \*\*“INPUTS”\*\*, right \*\*“OUTPUT”\*\*, bottom \*\*“SYMBOL”\*\*. \*\*Upper-right RELAY CIRCUIT:\*\* red supply bar at left, two \*\*parallel\*\* normally open control switches labelled \*\*A\*\* and \*\*B\*\*, blue terminals, a grey vertical relay coil toward right, a \*\*normally closed\*\* contact in the lamp path, a bright-yellow round lamp \*\*C\*\* at far right, and exact black grounding/arrow symbols; label \*\*“RELAY CIRCUIT”\*\*. \*\*Lower TRUTH TABLE:\*\* yellow heading fields \*\*“INPUTS”\*\*, \*\*“OUTPUT”\*\*, \*\*A\*\*, \*\*B\*\*, \*\*C\*\*; rows \*\*0 0 1 / 0 1 0 / 1 0 0 / 1 1 0\*\* in black lines; bottom label \*\*“TRUTH TABLE”\*\*. Match the diagrams' flat 2D geometry, blue dots, yellow highlights, white space and exact original caption \*\*“Figure 17.5 Representations of the ‘NOR’ gate”\*\*.

### 10.1 Relay-switch interpretation

The parallel input-switch arrangement operates the relay if **either switch is closed**. Operating the relay opens its normally closed lamp contact, switching the lamp off. When **neither switch** is closed, the relay remains de-energized and the lamp stays on. This gives the NOR truth-table result.

## 11\. The EXCLUSIVE OR Gate

An **EXCLUSIVE OR (XOR)** gate compares the states of its **two inputs**. It produces **1 if the input states are different**, and **0 if they are the same**.

That means an XOR output is on when **one input, but not both**, is on. Unlike the ordinary OR gate, the **1, 1** input combination gives a zero output.

|Input A|Input B|Output C|
|-:|-:|-:|
|0|0|0|
|0|1|1|
|1|0|1|
|1|1|0|

> \*\*Image Generation Prompt — Figure 17.6 Representations of the ‘EXCLUSIVE OR’ gate\*\*
>
> Create one technically accurate composite figure with \*\*three separate double-black-framed modules\*\* arranged two on top and one centrally beneath, enclosed by a thin grey outer border, all on white. \*\*Top-left SYMBOL:\*\* black-outlined exclusive-OR gate symbol (the OR curved pointed outline \*\*with one additional parallel curved line just outside its concave input side\*\*); two blue input dots \*\*A\*\*, \*\*B\*\*, black label \*\*“INPUTS”\*\*, blue output dot \*\*C\*\* with black label \*\*“OUTPUT”\*\*, and module label \*\*“SYMBOL”\*\*. \*\*Top-right FUNCTIONAL CIRCUIT DIAGRAM:\*\* faithfully imitate the original complex two-input switching-and-relay arrangement: red vertical supply bar at far left; two separate input switches \*\*A\*\* and \*\*B\*\* low on the left with dark-blue connection nodes; two vertical relay coils in the lower half; a pair of changeover/switch paths across the upper half; small black switching arms, horizontal interconnecting lines, dotted vertical linkages between contacts and their corresponding coils, black earth symbols; bright-yellow circular output lamp on the far right labelled \*\*C\*\*. Preserve the visible dark blue terminals, the red bus and lamp. \*\*Bottom TRUTH TABLE:\*\* yellow dual-level headings \*\*INPUTS A B\*\* and \*\*OUTPUT C\*\*, exact four rows \*\*0 0 0 / 0 1 1 / 1 0 1 / 1 1 0\*\*, black grid, label \*\*“TRUTH TABLE”\*\*. Include original caption exactly \*\*“Figure 17.6 Representations of the ‘EXCLUSIVE OR’ gate”\*\*. No additional gates, labels, or graphic flourishes.

### 11.1 Relationship to ordinary OR logic

The difference is clearest when **both inputs are 1**: ordinary OR continues to produce a 1, whereas XOR produces a 0 because the inputs are **not dissimilar**. The source's switching-and-relay example illustrates this comparison using two separate control inputs and one lamp output.

\---

# Chapter Questions

### Question 1

**Which logical function is represented by the control-switch and test-switch relay circuit shown?**

A. AND  
B. OR  
C. NOR  
D. NOT

> \*\*Image Generation Prompt — Question 1, unnumbered relay-control schematic\*\*
>
> Reproduce the source's small white rectangular schematic with thin grey border. At the \*\*left centre\*\*, draw a black-line box containing \*\*two parallel contact branches\*\* with blue round terminal contacts; bold black labels \*\*“CONTROL SWITCH”\*\* above the upper branch and \*\*“TEST SWITCH”\*\* below the lower branch. A black line leaves the box toward the right and drives a \*\*vertical relay coil\*\* drawn as tightly stacked circular turns. Above the coil, draw a small black horizontal relay contact with two dark-blue connection dots and an open contact gap; show the black ground mark to the right of the lower coil connection. Maintain exact black/blue palette, white background, contact placement and printed labels; no added text or circuit interpretation.

### Question 2

**A supply, two switches in series and a lamp are shown in the diagram. Which gate function does this circuit model?**

A. AND  
B. NOR  
C. OR  
D. EXCLUSIVE OR

> \*\*Image Generation Prompt — Question 2, unnumbered series-switch circuit\*\*
>
> Match the original wide, narrow, thin-grey-bordered circuit on white: thick \*\*red vertical supply bar\*\* at far left, a curved white/black electrical terminal shape next to it, two \*\*normally open switches in series\*\* along a single horizontal line, marked \*\*A\*\* and \*\*B\*\* above their blue-dot contacts, then a \*\*yellow circular lamp\*\* marked \*\*C\*\* and a black earth/return symbol at far right. Keep every switch blue connection dot and small black slanted moving contact in the correct left-to-right order. Do not add other branches.

### Question 3

**Which of the four symbols corresponds to the relay-controlled circuit shown?**

A. Symbol a  
B. Symbol b  
C. Symbol c  
D. Symbol d

> \*\*Image Generation Prompt — Question 3, unnumbered relay circuit and four-symbol comparison\*\*
>
> Reconstruct two adjacent white rectangular technical panels from the examination page. \*\*Left panel:\*\* a relay-controlled lamp circuit with a wide vertical \*\*red supply bar\*\* at far left, \*\*two parallel normally open switches\*\* labelled \*\*SW1\*\* and \*\*SW2\*\* below, blue terminal dots, a grey relay coil in the middle-right, a normally closed contact in the upper lamp line and a \*\*yellow lamp L1\*\* on the right; print \*\*“RELAY CIRCUIT”\*\* below. \*\*Right panel:\*\* a \*\*2 × 2 grid\*\* with four quadrants individually labelled \*\*“a.”\*\*, \*\*“b.”\*\*, \*\*“c.”\*\*, \*\*“d.”\*\*. The black gate symbols must be, respectively: \*\*a — AND symbol with output inversion bubble (NAND)\*\*; \*\*b — triangular buffer outline with output inversion circle (NOT) and its two short left input marks matching the source\*\*; \*\*c — OR symbol with an output inversion bubble (NOR)\*\*; \*\*d — ordinary two-input AND symbol without bubble\*\*. Place round black terminal dots on each input/output as in the source, retain precise comparison layout and white-grey-black drafting style. Do not indicate which choice is correct.

### Question 4

**Identify the two gate symbols, from top to bottom, shown in the illustration.**

A. AND, then NAND  
B. EXCLUSIVE OR, then EXCLUSIVE NOR  
C. OR, then NOR  
D. OR, then EXCLUSIVE OR

> \*\*Image Generation Prompt — Question 4, unnumbered pair of gate symbols\*\*
>
> Draw one tall thin-grey-bordered white rectangle split horizontally into two equal sections by a fine line. In the \*\*upper\*\* section draw a two-input \*\*D-shaped AND outline\*\*, two blue terminals at left and one blue terminal at right, with no bubble. In the \*\*lower\*\* section draw an identical D-shaped outline but add a small \*\*hollow circle between the gate body and the right-side blue output terminal\*\*. Retain exact vertical alignment, two-input horizontal lines, simple black outlines and blue circular terminals; do not print functional names next to the symbols.

### Question 5

**Which gate produces a HIGH output only when every input is HIGH?**

A. NOR  
B. OR  
C. AND  
D. NOT

### Question 6

**Which gate is represented by the 28 V switch-and-relay circuit?**

A. Inverter  
B. AND  
C. EXCLUSIVE NOR  
D. OR

> \*\*Image Generation Prompt — Question 6, unnumbered 28 V relay schematic\*\*
>
> Draw the original rectangular white schematic with fine light-grey border. At the far left print \*\*“28 V”\*\*. Provide \*\*two separate horizontal input branches\*\*, each containing an \*\*open switch\*\* with short slanted moving blade and blue circular contacts; label both \*\*“OFF”\*\* in uppercase black. Join the branches on a central vertical line which powers a grey vertical \*\*relay coil\*\*. Show the coil's upper lead at a short black continuation mark and its other terminal returning to a black ground symbol at the upper right. Below the coil, draw a \*\*normally open relay-controlled contact\*\*, blue terminal dots, a black connection to a circle containing \*\*“M”\*\* representing a motor, and the terminal/ground symbol to the motor's right. Preserve the graphic's blue nodes, black wiring, grey coil, small black contact gap, white background and exact label \*\*28 V\*\*; no additional elements.

### Question 7

**For the gate with inputs X and Y and output Z, which input combination makes Z equal to 0?**

A. X = 1, Y = 0  
B. X = 0, Y = 1  
C. X = 1, Y = 1  
D. X = 0, Y = 0

> \*\*Image Generation Prompt — Question 7, unnumbered X–Y–Z gate symbol\*\*
>
> On a white square inside a thin grey border, draw a black \*\*two-input D-shaped gate\*\* (vertical line on left, rounded semicircle on right), two short black input conductors terminating in blue circular dots labelled \*\*X\*\* (upper) and \*\*Y\*\* (lower), and one output conductor emerging from a \*\*small unfilled inversion circle\*\* at the right edge, ending in a blue output terminal labelled \*\*Z\*\*. Keep black labels X, Y, Z in their respective locations and preserve the plain white/grey/blue style; show no state values.

### Question 8

**Which statement correctly describes what a transistor can do?**

A. It can function only as a signal amplifier.  
B. It is a demi-conductor that can automatically switch or amplify.  
C. It is an inverted silicon-controlled rectifier.  
D. It is a semiconductor device that can act as an automatic switch or amplifier.

### Question 9

**Which set of three electrodes describes the construction of a transistor?**

A. Emitter, base and collector  
B. Emitter, collector and base as the only valid arrangement  
C. Collector, emitter and base as the only valid arrangement  
D. A base that must carry 10 A before the transistor operates

### Question 10

**A basic logic gate has exactly one input and produces the opposite state at its single output. What gate is it?**

A. A gate that cannot be called a double gate  
B. NOT  
C. A semi-gate  
D. A gate that cannot perform inversion

### Question 11

**Which two gates are identified as the most commonly used basic functions in this chapter?**

A. NOT and NOR  
B. OR and EXCLUSIVE AND  
C. AND and OR  
D. AND and NAND

### Question 12

**What does a truth table describe?**

A. The relationship between input combinations and the corresponding outputs  
B. Only the physical arrangement of integrated circuits  
C. Only the chronological operating order of gates  
D. The difference between electrical and electronic wiring

### Question 13

**Identify the logic function represented by the illustrated two-input symbol.**

A. AND  
B. EXCLUSIVE NOR  
C. EXCLUSIVE OR  
D. EXCLUSIVE NOT

> \*\*Image Generation Prompt — Question 13, unnumbered XOR outline\*\*
>
> Recreate a clean black-outline \*\*exclusive-OR gate symbol\*\* centered in a thin light-grey rectangular frame against white. Draw two black horizontal incoming lines from \*\*dark-blue circular dots\*\* at the far left, both curving into an OR-shaped outline; add the \*\*second separate concave curve\*\* just behind the main concave input edge, which is the distinguishing feature of XOR. The gate's upper/lower arcs taper smoothly to a single pointed right end, a black horizontal output wire and one blue round terminal at far right. No inversion bubble; no letter labels; do not write the gate name.

### Question 14

**To energize the relay driven by the illustrated two-input gate, which states must be present?**

A. A = 0, B = 0  
B. A = 0, B = 1  
C. A = 1, B = 1  
D. A and B must always match, whether both are 0 or both are 1

> \*\*Image Generation Prompt — Question 14, unnumbered AND-driven relay\*\*
>
> Reproduce the small pale-grey-bordered white panel: two black horizontal input lines from blue dots at left into a standard \*\*D-shaped two-input AND symbol\*\*; mark the upper input \*\*A\*\* and lower input \*\*B\*\*. Continue the output conductor directly to a vertical \*\*black-coil relay winding\*\* near the right. Above the winding, depict an open contact with two dark-blue contact dots and a separate top horizontal contact wire; beneath the winding place a black grounded triangular line symbol. Maintain the right-side coil linkage and exact A/B annotations, with no logic-state digits or answer labels.

### Question 15

**Which gate function is modeled by the single input-switch, relay-contact and lamp circuit shown?**

A. OR  
B. NAND  
C. AND  
D. NOT

> \*\*Image Generation Prompt — Question 15, unnumbered inverter relay circuit\*\*
>
> Reproduce the source's wide, light-grey-bordered white diagram using the original flat electrical schematic palette. On the \*\*left\*\* draw a large red vertical supply bar. The \*\*upper path\*\* passes through a curved terminal shape and a \*\*normally closed changeover relay contact\*\* with blue dots, then follows a long horizontal black wire to the \*\*yellow circular lamp\*\* at the right, returning to a black earth symbol below. The \*\*lower path\*\* passes through another curved terminal and one \*\*open manual control switch\*\* with blue contacts to the tall, grey, multiple-loop relay coil in the centre. Show a horizontal ground/return line and small grounding arrow next to the relay, and blue circular contacts close to the top relay switch. Make the lamp and its circuit clearly separate from the coil input, and avoid adding gate-symbol labels.

\---

# Answers and Explanations

|Question|Answer|Explanation|
|-:|:-:|-|
|1|**B**|The control and test contacts provide alternative paths: either operated input can produce an output, which is OR behavior.|
|2|**A**|Both switches must close to complete the single series path; this is AND behavior.|
|3|**C**|The parallel switch arrangement drives a relay that reverses the lamp output, giving NOR behavior; symbol c has the OR outline and inversion bubble.|
|4|**A**|The upper D-shaped gate has no inversion bubble (AND); the lower one has an output inversion bubble (NAND).|
|5|**C**|An AND gate is high only when all of its inputs are high.|
|6|**D**|The two OFF-labelled switches are connected in parallel to the relay control: operation of either input can energize it, as with OR.|
|7|**C**|The drawing is a NAND gate, whose output is 0 only when both X and Y are 1.|
|8|**D**|A transistor is a semiconductor used for electronic switching or signal amplification.|
|9|**A**|The transistor has emitter, base and collector electrodes; the base controls current between the other two.|
|10|**B**|A NOT gate has a single input and produces its logical complement.|
|11|**C**|AND and OR are the two basic gate functions identified by the text.|
|12|**A**|A truth table lists possible input states and the output for each combination.|
|13|**C**|The extra curved line in front of the OR input face identifies the exclusive-OR symbol.|
|14|**C**|Both A and B must be 1 for the AND output to energize the relay.|
|15|**D**|The controlled relay contact reverses the state of the lamp output relative to the single switch input; this is NOT behavior.|



