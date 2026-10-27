# Chapter 7: DC Electrics — DC Motors

## 1\. Electric Motors — Purpose and Operating Principle

A **direct-current (DC) electric motor** takes electrical energy from a DC source and produces mechanical movement. A **generator** performs the opposite conversion, turning mechanical energy into electrical energy.

Although these devices carry out opposite tasks, many of their major components are alike. Both generally contain a magnetic-field system, an armature, and arrangements for connecting the rotating electrical parts to the external circuit. In suitable designs, the same DC machine can operate as either a motor or a generator.

The principle that makes a motor work is straightforward: **a conductor carrying an electric current experiences a force when it is placed within a magnetic field.** If the conductor is arranged around a rotating armature, that force can produce turning motion. A succession of current-carrying armature conductors then provides the mechanical output.

The important relationship to remember is:

* **Motor:** electrical input produces rotation and mechanical work.
* **Generator:** mechanical rotation produces an electrical output.
* **Common physical basis:** electricity and magnetic fields interact; the machine is built to use that interaction in the required direction.

## 2\. Fleming’s Left Hand Rule

**Fleming’s Left Hand Rule** provides a way to predict which direction a current-carrying conductor will be forced to move within a magnetic field. It is the motor-direction rule covered in this chapter.

Hold the thumb, first finger, and second finger of the **left hand** at right angles to one another:

1. **First finger — Field:** points along the magnetic field, from **North (N)** to **South (S)**.
2. **Second finger — Current:** indicates the direction of current through the conductor.
3. **Thumb — Motion:** points in the direction of the force acting on the conductor.

In the book’s illustrated motor, the first finger points from the north pole toward the south pole. On the **red, negative half** of the armature, current is shown emerging toward the observer, and the resulting force is upward. On the **blue, positive half**, current travels into the armature, giving a downward force when the left-hand arrangement is turned through 180 degrees. The two forces produce **anticlockwise rotation** of the armature in the example.

### Reversing the direction of rotation

A DC motor changes its rotational direction when **either** of these is reversed on its own:

* The **direction of current** through the armature; or
* The **polarity of the magnetic field**.

If **both** the current and field polarity are reversed together, the mechanical direction **does not change**, because the two changes cancel their effect on the direction of force.

> \*\*Image Generation Prompt — Figure 7.1 Fleming’s left hand rule for motors\*\*
>
> Re-create a clean, landscape-format, instructional aviation-electrics diagram matching the source. White rectangular drawing panel with two visual components side by side. On the left, show a peach-coloured illustrated \*\*left hand\*\* with thumb vertical upward, first finger pointing horizontally right, and second finger angled diagonally downward; thin black directional arrows point along each digit. Retain the exact labels \*\*“ThuMb Motion”\*\*, \*\*“First Finger Field”\*\*, and \*\*“SeCond Finger Current”\*\* near their respective fingers (including source capitalization). On the right, draw two large rectangular grey magnetic pole blocks separated by a gap; the left block has a large red \*\*“N”\*\*, and the right block a large blue \*\*“S”\*\*. In the air gap, use thin horizontal field lines with small red right-pointing arrowheads, and show the armature conductor pair in blue and red with a circled dot and a circled cross to indicate current respectively out of and into the plane. Above the conductors, draw a curved black arrow showing \*\*anticlockwise\*\* motion. Preserve the positions, relative sizes, pole arrangement, field direction, colour relationships, and teaching function; avoid decorative changes. Under the artwork retain the original caption exactly: \*\*“Figure 7.1 Fleming’s left hand rule for motors”\*\*.

\---

## 3\. The Practical DC Motor

A motor using only one rotating wire loop is useful for demonstrating the principle of rotation but is unsuitable for many practical applications. The motor needs more continuous torque and a better magnetic arrangement to drive useful mechanical loads reliably.

The designs shown in the textbook improve the basic machine in two main ways:

* **Additional armature conductors or coils** provide a greater and more even turning effect.
* **Improved magnetic pole-piece geometry** helps direct the magnetic field where it is needed around the rotating armature.

The strength of the magnetic field can also be adjusted by fitting **field windings**. This provides a means of controlling **motor speed**; the corresponding field-strength control in a DC generator influences its electrical output voltage.

The general mechanical construction of the practical DC generator illustrated in this chapter also applies closely to the DC motor, despite their different functions.

> \*\*Image Generation Prompt — Figure 7.2\*\*
>
> Draw a two-panel technical comparison on a clean white background, matching the textbook’s original arrangement and not changing the electrical layout. Place two equal rectangular diagrams next to each other. \*\*Left panel — “a: Simple DC motor”:\*\* grey north and south magnetic pole blocks, the \*\*“N”\*\* in red on the left and \*\*“S”\*\* in blue on the right, a single simple armature loop between them shown with red and blue conductor segments, horizontal magnetic-field lines with red arrowheads, a small commutator and two brush contacts connected to a DC battery circuit using yellow leads; show the red \*\*“+”\*\* and black \*\*“−”\*\* battery polarity marks at lower right. \*\*Right panel — “b: Improved DC motor”:\*\* black-and-white perspective line drawing of curved, shaped pole pieces marked \*\*N\*\* and \*\*S\*\*, a multipole or multicoil armature winding between them, numbered coil sides/commutator segments \*\*1, 2, 3, 4\*\*, two contacts/brushes and a small lower arrow marked \*\*“INPUT”\*\*; include the original downward arrows beside the supply path. Preserve orientation, labels and line relationships. Centre the exact figure caption \*\*“Figure 7.2”\*\* below the paired drawings and retain the individual captions \*\*“a: Simple DC motor”\*\* and \*\*“b: Improved DC motor”\*\*.

### 3.1 Components visible in a practical DC machine

A sectional view allows the internal arrangement to be understood. The **armature** turns within the field created by the stationary magnetic poles and their field windings. The **commutator and brushes** make the electrical connection to the rotating armature. Other components, including springs, bearings, a fan and a pulley, provide mechanical support and practical operation.

> \*\*Image Generation Prompt — Figure 7.3 Sectional view of DC rotating armature generator\*\*
>
> Produce a horizontally oriented, detailed technical \*\*cutaway cross-section\*\* of a DC rotating-armature electrical machine, replicating the original textbook illustration. Use a white background with the surrounding machine casing and pole pieces in light blue/grey, a long central horizontal grey \*\*ARMATURE\*\* with repeated longitudinal red conductor paths, and a left-side orange segmented \*\*COMMUTATOR\*\*. Show the brush assembly as small yellow blocks and red/brown connections immediately to the left of the armature; include the support shaft travelling through the centre and a black pulley and fan on the right. Preserve each internal arrow label and its destination exactly: \*\*“BRUSH”\*\*, \*\*“BRUSH BOX”\*\*, \*\*“POLE PIECE”\*\*, \*\*“FIELD COIL”\*\*, \*\*“ROLLER BEARING”\*\*, \*\*“SPRING”\*\*, \*\*“COMMUTATOR”\*\*, \*\*“ARMATURE”\*\*, \*\*“FAN”\*\*, \*\*“PULLEY”\*\*, and \*\*“BALL BEARING”\*\*. Position labels around the drawing as in the source, with arrows ending precisely on the component. Retain the caption exactly: \*\*“Figure 7.3 Sectional view of DC rotating armature generator”\*\*.

\---

## 4\. Back Electromotive Force (Back EMF)

Once an armature starts turning, its conductors move through the motor’s magnetic field. This movement **induces an electromotive force** in the rotating conductors, as it would in a generator.

Under **Lenz’s Law**, the induced EMF opposes the effect that produces it. In a DC motor, the induced voltage acts **against the applied supply voltage**, so it is called **back EMF** (or counter EMF).

### 4.1 Effect on motor current

The important consequences are:

* **Back EMF increases with motor speed.** A faster armature produces a greater opposing voltage, for a given magnetic field.
* **Back EMF is less than the applied voltage while the motor is taking the current necessary to produce torque.** The difference permits armature current to continue flowing.
* **Back EMF reduces the effective voltage driving armature current.** It therefore helps regulate how much current the motor draws once running.

The electrical relationship can be expressed clearly as:

$$
V\_{\\mathrm{effective}} = V\_{\\mathrm{supply}} - E\_{\\mathrm{back}}
$$

Here, the effective voltage is the part of the supply available to drive current through the armature circuit. The equation illustrates the textbook’s explanation; the chapter does not assign numerical values to these voltages.

### 4.2 Why the effect matters

At starting, the armature is initially **stationary**, so it has **not yet developed appreciable back EMF**. The opposing voltage is therefore very small and starting current can be high.

As rotation builds, the induced opposing voltage increases. This reduces the voltage available to force current through the armature and helps bring the motor toward a stable operating condition.

## 5\. Slow Start Resistor

Some DC motors incorporate a **slow-start resistor** to limit the initial current drawn before back EMF has built up.

The starting sequence is:

1. **Motor at rest:** the resistor is connected **in series with the armature**.
2. **Supply switched on:** the resistor restricts the initial starting current.
3. **Motor begins turning:** back EMF gradually develops as speed increases.
4. **Starting phase finishes:** a **centrifugal switch** or **time-operated switch** bypasses the resistor.
5. **Normal running:** the armature can receive its full intended operating supply without the temporary series resistance.

This arrangement protects the motor against excessive initial current while allowing normal performance once the motor has accelerated.

> \*\*Image Generation Prompt — Figure 7.4 Slow start resistor circuit\*\*
>
> Recreate a minimalist black-line DC electrical schematic inside a white rectangle. Show a rectangular main circuit with a DC cell/battery symbol along the bottom conductor, a small open switch near the lower left, and a motor at the right represented by a circle containing \*\*“M”\*\* with the adjacent label \*\*“STARTER MOTOR”\*\*. Along the upper conductor, place a red zig-zag resistor across two short vertical connection points and label it in uppercase exactly \*\*“SLOW START RESISTOR”\*\*. Below the resistor, show a parallel bypass branch using an open switch with two red contact dots and the caption \*\*“CENTRIFUGAL / TIME SWITCH”\*\*. Wiring should make the bypass action unambiguous: closing the switch shorts the starting resistor during normal running. Preserve the source’s black wiring, red resistor and contact points, white background, and original arrangement. Retain the caption \*\*“Figure 7.4 Slow start resistor circuit”\*\*.

\---

## 6\. Commutation and Smooth Rotation

### 6.1 Simple commutator arrangement

A basic DC motor has a **single wire loop** mounted so that it can turn between the poles of a permanent magnet. A DC supply, such as a battery, feeds the loop through **brushes resting against a commutator**.

For this simple motor, the commutator consists of **two segments**, one connected to each end of the loop. As the armature turns, the commutator changes the current connection at the required point of rotation, allowing the turning effect to continue in the desired direction.

The arrangement is illustrated by the **simple motor in Figure 7.2a**.

### 6.2 Why more coils and segments are needed

A one-loop motor does not provide the smooth, strong mechanical output required for heavier loads. A useful motor therefore follows the improvements made to practical DC generators:

* Use a **laminated iron armature core**.
* Carry **several armature coils**, rather than just one loop.
* Fit a **matching number of commutator segments** to serve the coils.
* Supply the magnetic field from an **electromagnet and its field coils**.
* Maintain a **small air gap** between the rotating armature and the shaped stationary pole pieces.

Combining these features increases the usable turning action and allows smoother operation than a simple demonstration motor.

**Image reference:** The multicoil arrangement is depicted in **Figure 7.2b**, while the brush, segmented commutator and armature construction are visible in **Figure 7.3**. Their prompts appear alongside the practical-motor explanation above; no original drawing is duplicated here.

\---

## 7\. Series Wound DC Motors

In a **series wound motor**, the **field winding** and **armature** form a series electrical path. The same current therefore passes through both.

A typical series field uses **a small number of turns of relatively thick wire**. Since field current is also armature current, the magnetic-field strength varies as motor current changes.

### 7.1 Response to an increasing load

When the mechanical load becomes harder to turn:

1. Motor speed begins to **decrease**.
2. The reduced speed produces **less back EMF**.
3. The effective armature voltage rises and **more current flows**.
4. Because that current also passes through the series field, the field becomes stronger.
5. The motor develops **greater torque** to cope with the heavier load.

This gives the series motor its particularly valuable **high starting torque**.

> \*\*Image Generation Prompt — Figure 7.5  Series wound motor\*\*
>
> Reconstruct the book’s two-panel series-motor electrical illustration in black/grey line art on white. Both panels are side by side inside pale rectangular outlines. The left panel is a simple semi-pictorial circuit: a circle labelled \*\*“ARMATURE”\*\* on the upper-left series branch, a horizontal coil labelled \*\*“SERIES FIELD”\*\* toward the upper-right, and two bottom DC terminal symbols shown as \*\*red +\*\* and \*\*red −\*\* circles, all forming one series electrical path. The right panel is the corresponding \*\*diagrammatic view\*\*, with a small round armature symbol, a coil placed along the top horizontal branch, a closed wiring loop, and red polarity circles on the right. Under the panels preserve the headings \*\*“A SERIES WOUND DC MOTOR”\*\* and \*\*“DIAGRAMMATIC VIEW”\*\* as in the source. Caption exactly: \*\*“Figure 7.5  Series wound motor”\*\*.

### 7.2 Speed and loading characteristics

Series motor speed varies markedly with mechanical loading:

* **Heavy load:** the motor turns relatively slowly and develops substantial torque.
* **Light load:** the motor runs much faster.
* **No load:** speed may rise to a **dangerously high value**, with the possibility of destructive mechanical failure.

The no-load danger comes from the low current required to turn an almost unloaded rotor. Low current weakens the series magnetic field, so the machine may have to reach an extremely high speed to generate sufficient back EMF.

**Safety rule:** A series wound motor must **not be started without an appropriate load**.

Since its speed changes greatly with load, the series motor is unsuitable where **constant speed** is essential or where the load is **intermittently removed**.

### 7.3 Typical applications

The source identifies series motors particularly with:

* **Electrical actuators**.
* **Starter motors**.
* **Landing gear actuation**.

These tasks benefit from the strong starting effort that the series-wound arrangement can provide.

\---

## 8\. Shunt Wound DC Motors

A **shunt wound motor** connects its field winding **across the supply voltage**, in parallel with the armature circuit rather than in series with it.

Its field typically has **many turns of fine wire**. Because it is connected directly across the source, field current and field strength are largely independent of the current drawn by the armature as the mechanical load varies.

The motor’s torque changes with the **armature current**.

### 8.1 Increasing the load

If the driven equipment demands more torque:

1. Motor speed momentarily **falls**.
2. Back EMF **decreases** with the lower speed, while field strength remains approximately constant.
3. More armature current can flow.
4. The greater armature current produces **more torque**, supporting the increased load.

### 8.2 Decreasing the load

When the mechanical load reduces:

1. The armature tends to **accelerate**.
2. Back EMF rises.
3. Armature current and developed torque reduce.
4. The motor settles to a speed close to its previous operating speed.

The book gives an important quantitative characteristic: the change in speed between **no-load** and normal **full-load** operation is approximately **10% of the no-load speed**. Shunt-wound motors are therefore treated as **approximately constant-speed motors**.

### 8.3 Suitable uses

A shunt-wound motor is useful where the speed should remain fairly stable even when mechanical load changes, and where the motor may be started with **little or no mechanical load**. Examples include:

* **Fans**.
* **Centrifugal pumps**.
* **Motor-generator units**.

> \*\*Image Generation Prompt — Figure 7.6 Shunt wound motor\*\*
>
> Create the exact two-part educational comparison shown in the textbook, with white background and thin black circuitry. Left panel: a rectangular supply circuit with a circular symbol labelled \*\*“ARMATURE”\*\* in one branch; a distinct horizontal coil across the upper branch labelled \*\*“SHUNT FIELD”\*\*, showing the field wired in parallel with the armature; two terminal dots at bottom marked red \*\*“+”\*\* and red \*\*“−”\*\*. Below, keep the title \*\*“A SHUNT WOUND DC MOTOR”\*\*. Right panel: simplified diagram of a round armature symbol and separate shunt field coil on the left side of a rectangular parallel circuit, two red DC terminal symbols to the right; keep the heading \*\*“DIAGRAMMATIC VIEW”\*\*. Match the source’s arrangement and preserve the caption exactly: \*\*“Figure 7.6 Shunt wound motor”\*\*.

### 8.4 Series versus shunt motors

|Feature|Series wound motor|Shunt wound motor|
|-|-|-|
|Field connection|In series with the armature|Across the supply, in parallel with the armature|
|Field winding|Few turns of heavy wire|Many turns of fine wire|
|Field strength as load changes|Changes with armature current|Relatively steady at a steady supply voltage|
|Starting characteristic|High starting torque|Better suited to stable-speed duties|
|Speed as load falls|Can rise sharply|Changes relatively little|
|Running with no load|Can overspeed dangerously|Acceptable for suitable designs and applications|
|Typical examples in this chapter|Starters, actuators, landing gear|Fans, centrifugal pumps, motor-generator units|

\---

## 9\. Starter-generator Systems

Some **turbine-powered aircraft** use a single electrical machine for **two different purposes**:

1. **Starting the engine**, by operating as a motor.
2. **Supplying DC electrical power**, by operating as a generator once the engine is running.

This equipment is called a **starter-generator**.

### 9.1 Construction

The machine is essentially a **compound-wound DC unit**, consisting of:

* **Two field-winding arrangements** (series and shunt).
* **One armature winding**.
* **A commutator**.
* A mechanical connection to the engine through a **drive shaft and gear train**.

The starter-generator remains **permanently connected** to its engine through the mechanical drive.

### 9.2 Operating as a starter motor

During engine start, the machine is supplied electrically and functions as a **compounded motor**. A **field-changeover relay** routes the required supply to the shunt field as part of the motor-mode circuit. Mechanical torque from the machine turns the engine through its drive connection.

### 9.3 Changing to generator operation

Once the engine is operating:

1. The **starter supply circuit is disconnected**.
2. The field-changeover relay **de-energizes** automatically.
3. Its contacts connect the **shunt field** to a **voltage regulator**.
4. Current supplied through the shunt winding provides initial field **excitation**.
5. The engine now drives the machine as a **DC generator**.
6. When generated output reaches the regulated level, the machine’s output is **connected to the aircraft busbar**.

The single unit thus changes role without needing a separate starting motor and generating machine.

> \*\*Image Generation Prompt — Figure 7.7 Compound wound motor generator\*\*
>
> Recreate the precise side-by-side schematic comparison, black lines on a white technical drawing background. Left diagram is headed \*\*“Motor mode”\*\* and right diagram \*\*“Generator mode”\*\*. Each has a grey rectangle labelled \*\*“Engine”\*\* on the left, a central circular machine labelled respectively \*\*“Motor”\*\* or \*\*“Generator”\*\*, and a horizontal link labelled \*\*“Drive shaft”\*\*. Show the upper coil labelled \*\*“Shunt field”\*\*, the separate right-hand coil labelled \*\*“Series field”\*\*, a switching contact above/right of the shunt field, and a zig-zag adjustment symbol labelled \*\*“Voltage regulator”\*\* in the upper-right. Put red \*\*“+”\*\* and black \*\*“−”\*\* supply terminal circles along the bottom of each circuit. Make the field-changeover contacts visibly different in the two modes, matching the source, while preserving all component positions and wiring relationships. Centre original caption \*\*“Figure 7.7 Compound wound motor generator”\*\* beneath both diagrams.

### 9.4 Advantages and limitations

The main benefit is a **saving in equipment weight and installation complexity**, because one electromechanical unit carries out both duties.

A principal limitation is that the device **cannot maintain its full electrical output when driven at low RPM**. For that reason, the source associates starter-generators with turbine engines that normally operate at relatively high rotational speeds.

**Typical output specified in this chapter:** **300 A at 28 V DC**.

\---

## 10\. Electrical Actuators — Why Aircraft Use Them

Aircraft contain numerous valves, shutters, control devices, and mechanical components that a pilot or crew member cannot conveniently reach or move by hand. **Electrical actuators** provide remote mechanical operation of this equipment.

The chapter divides them into two broad categories:

1. **Solenoid actuators** — electrical energizing produces movement by magnetic attraction.
2. **Motor actuators** — a reversible electric motor provides rotary motion which may be used directly or converted into straight-line movement.

## 11\. Solenoid Actuators

A solenoid provides an electrical way of moving a suitable mechanism, particularly a **hydraulic or pneumatic selector valve**.

When the solenoid winding is supplied with electricity, the resulting magnetic attraction moves the valve mechanism. In the example described in the chapter, energizing the solenoid causes a **valve to open**.

The essential sequence is: **electric current → magnetic attraction → movement of the valve/selector**.

## 12\. Motor Actuator Construction

For tasks that require more substantial travel, aircraft commonly use a **high-speed, reversible DC motor** coupled to a **high-ratio reduction gearbox**.

The gearbox transfers the motor’s relatively fast rotation into a form useful for operating aircraft equipment, including:

* **Fuel valves**.
* **Cooler shutters**.
* **Trimming tabs**.

Depending on how the mechanism is constructed, the delivered movement is either **rotary** or **linear**.

\---

## 13\. Split Field Series Actuators

A **split-field series actuator** uses two alternative series field windings. They are wound so that energizing one produces magnetic flux in the **opposite direction** to the flux produced by energizing the other.

The important points are:

* **Only one field winding is energized at a time.**
* The selected winding determines which direction the motor turns.
* **Limit switches** are connected in the field supply paths and are operated by the driven mechanical mechanism.
* These switches interrupt motor operation automatically when the mechanism reaches the end of its permitted travel.

The principle enables one actuator to move a component toward either end position—for example **OPEN** or **SHUT**—using an appropriate electrical selection.

> \*\*Image Generation Prompt — Figure 7.8 The Split Field Series Actuator\*\*
>
> Draw a source-faithful electrical circuit on a white rectangular panel using fine grey/black wiring. The top centre must show a thick black busbar marked exactly \*\*“28 V DC BUS”\*\*. Beneath it show a selector with the label \*\*“CONTROL SWITCH”\*\* and two positions \*\*“OPEN”\*\* and \*\*“SHUT”\*\*, its lever drawn toward SHUT as on the original page. At far left, within a dashed outlined actuator housing, draw a circular armature labelled \*\*“ARM”\*\* grounded on the left, one nearby coil marked \*\*“BRAKE COIL”\*\*, and two opposing field-coil paths marked \*\*“FIELD COIL”\*\* with separate paths \*\*“OPEN”\*\* and \*\*“SHUT”\*\*. Between the motor and selector add a two-part changeover \*\*“LIMIT SWITCHES”\*\* assembly, with small open/closed contact symbols. On the right top show an \*\*“INDICATORS”\*\* region containing two outline lamp circles headed \*\*“OPEN”\*\* and \*\*“SHUT”\*\*. Retain exact source spelling, wiring flow, limit-switch positions and labelled paths, without inventing extra components. Use the exact caption \*\*“Figure 7.8 The Split Field Series Actuator”\*\*.

## 14\. How the Split Field Series Actuator Operates

### 14.1 OPEN selection

When the pilot or operator selects **OPEN**:

1. Electrical power reaches the actuator armature along the circuit that includes the applicable **limit switch**, **OPEN field winding**, and **brake coil(s)**.
2. Supplying the **brake coil** releases the electromagnetic brake, if one is fitted.
3. The energized field establishes the motor direction that drives the mechanism toward the OPEN position.
4. The motor continues until the movement of the equipment causes the **OPEN limit switch** to operate.

### 14.2 At the end of OPEN travel

The end-of-travel switching accomplishes two separate tasks:

* **OPEN limit switch:** removes the motor supply and completes the circuit for the **OPEN position indicator**.
* **CLOSE/SHUT limit switch:** prepares the electrical path required for subsequent operation in the opposite direction when **CLOSE/SHUT** is selected.

### 14.3 Preventing overrun and mechanical damage

When the motor supply is broken, the brake solenoid ceases to hold the brake off and the brake acts **immediately**. This limits further unwanted movement, such as **overrun or creep**.

A **slipping friction clutch** may also be installed between the motor/armature shaft and the reduction gearing. If the mechanism experiences excessive mechanical resistance, the clutch slips instead of allowing the overload to damage the transmission.

\---

## 15\. Motor Actuators: Rotary and Linear

Motor-powered actuators are classified according to the form of movement delivered to the equipment:

* **Rotary actuator:** turns an output shaft.
* **Linear actuator:** moves a ram, rod or plunger in or out.

## 16\. Rotary Actuators

A rotary actuator uses a small **reversible motor** and **gearbox** to rotate an **output drive shaft**. The type described in this chapter is used for **fuel valves** and **air/oil shut-off valves**.

### 16.1 Selection and travel control

Control is provided by an **ON/OFF** or **OPEN/SHUT** selector. The actuator has **two limit microswitches** which together:

* Stop movement at the intended end of travel.
* Make the correct direction available for the next selection.
* Operate the cockpit’s visual **position indicators**.

At least one limit-switch path is available to admit power for the next selected travel direction. **At each end position, the limit switches change over** to stop the completed movement and permit operation back the other way.

### 16.2 Example illustrated layout

The source includes an actuator with a motor, separate OPEN and CLOSE field paths, brake coils, a **reduction gear**, **clutch**, and output drive, together with indicator and limit-switch connections on a **28 V DC** system.

> \*\*Image Generation Prompt — Figure 7.9 Rotary actuator\*\*
>
> Create a detailed, vertically oriented combined mechanical and electrical \*\*rotary actuator\*\* drawing as in the source, black/grey technical line art on white, not a generic simplified diagram. At top left place an outlined \*\*‘DOLL’S EYE’ POSITION INDICATOR\*\* circle marked \*\*“OPEN”\*\*; at top right place a grey filled round indicator marked \*\*“SHUT”\*\*. Across the upper centre include two separately drawn coils labelled collectively \*\*“BRAKE COILS”\*\*, with motor field windings on each side of a central oval \*\*“MOTOR”\*\* and direction words \*\*“OPEN”\*\* to its left and \*\*“CLOSE”\*\* to its right. Below, show toothed gearing labelled \*\*“REDUCTION GEAR”\*\*, a grey friction-disc assembly labelled \*\*“CLUTCH”\*\*, and a vertical central \*\*“OUTPUT DRIVE”\*\* shaft with a curved rotational arrow. At the mid-lower left and right show mechanically operated switch assemblies and exact labels \*\*“OPEN LIMIT SWITCH”\*\* and \*\*“CLOSE LIMIT SWITCH”\*\*. Near the bottom add the three-position \*\*“SELECTOR SWITCH”\*\*, with \*\*“OPEN”\*\*, \*\*“CLOSE”\*\* labels and a lower thick supply bar labelled \*\*“28 V DC”\*\*. Maintain the source’s wiring and spatial alignment of switches, motor, gearbox and indicators. Put the exact caption \*\*“Figure 7.9 Rotary actuator”\*\* below the diagram.

\---

## 17\. Linear Actuators

A linear actuator produces movement along a straight line rather than simply turning an output shaft.

### 17.1 Mechanical construction

The typical arrangement consists of:

1. A **small reversible electric motor**.
2. A **reduction gearbox**.
3. A **screw-jack mechanism**.
4. An extending/retracting **ram or plunger**.

When the motor rotates in one direction, the screw mechanism drives the output **outward**; reversing the motor drives it **inward**.

### 17.2 Applications

The chapter identifies linear actuators with jobs needing a **push/pull action**, such as:

* Moving **flaps**.
* Moving components of the **undercarriage**.
* Operating **trim tabs**.
* Making small or **inching** adjustments to **oil-cooler shutters**.

### 17.3 Full-travel and inching control

For an operation that travels between two set positions, a normal selector commands movement toward **UP/DOWN** or **IN/OUT**, as appropriate.

For trim and other small adjustments, the actuator uses a **spring-loaded, self-centring OFF switch**. Moving this switch to either side sends power to the corresponding motor direction. Releasing it returns the selector to the neutral OFF position, ending the commanded movement.

### 17.4 Limit switches

Two limit switches govern the ends of permitted travel and provide the basis for position indication. When an end position is reached, the associated limit switch **opens** and stops the motor in that direction.

With an **inching actuator** away from either limit, **both limit switches remain closed**, allowing the operator to choose movement in either direction. The appropriate limit switch opens only when the equipment reaches its own end position.

> \*\*Image Generation Prompt — Figure 7.10 A linear actuator.\*\*
>
> Reproduce the chapter’s rectangular, horizontally composed electro-mechanical linear-actuator drawing on white with fine black/grey linework. At upper left show a thick supply conductor marked \*\*“28 V DC”\*\* and a three-position \*\*“SELECTOR SWITCH”\*\* with contact choices \*\*“OUT”\*\*, \*\*“OFF”\*\* and \*\*“IN”\*\*; beneath it place a round dial whose pointer and markings are \*\*“OUT”\*\* (left) and \*\*“IN”\*\* (right). At the top middle include the spring-contact \*\*“IN LIMIT SWITCH”\*\*. At the upper right show \*\*“IN WINDING”\*\*, \*\*“OUT WINDING”\*\*, and a rectangular \*\*“MOTOR”\*\* symbol, with the motor body mechanically linked downward to a toothed \*\*“REDUCTION GEAR”\*\*. Label the next assembly \*\*“CLUTCH”\*\*, then show a vertical threaded \*\*“SCREW JACK”\*\* passing through a horizontal \*\*“DRIVE NUT”\*\*. A connected ram or bar extends toward the right and is labelled \*\*“OUTPUT DRIVE”\*\*; draw small up/down and circular motion arrows as in the textbook. At lower left mark \*\*“LIMIT SWITCH OPERATING ARM”\*\* and \*\*“OUT LIMIT SWITCH”\*\* on the mechanism. Keep all wiring, labels, relative positions, and arrow directions faithful to the original. Caption exactly \*\*“Figure 7.10 A linear actuator.”\*\*

\---

## 18\. Actuator Brakes

Many motor actuators include an **electromagnetic brake** to stop the mechanism precisely and prevent continued motion after power is removed.

Although individual brake designs differ according to actuator size and construction, the arrangement described in the source has the following common features:

* A **spring holds the brake applied** whenever the motor is **de-energized**.
* A **brake-release solenoid** is electrically connected in series with the motor armature.
* When current is supplied to run the motor, the solenoid **withdraws/releases the brake immediately**.
* When power stops, the solenoid releases and the spring reapplies the brake, limiting **over-travel**.

Thus, **power available = brake released for movement; power removed = brake applied to hold position**.

## 19\. Actuator Clutches

A motor actuator may also contain a **friction clutch** in its mechanical transmission.

The clutch protects the motor and associated gearing against **excessive mechanical load**. If the driven component jams or the mechanism is forced against an obstruction, the clutch can slip rather than transferring the full overload into the actuator’s components.

The two protective devices therefore have distinct roles:

|Device|Principal protection|
|-|-|
|**Electromagnetic brake**|Prevents unwanted movement or over-travel after motor power is removed|
|**Friction clutch**|Limits the mechanical forces transmitted during an overload|

\---

## 20\. Visual Indicators for Linear Actuators

The pilot often needs to know whether an actuator has reached its selected position or is at an intermediate point. Which display is appropriate depends on whether the equipment can be stopped between end positions.

* For equipment that is only required at its **limits of travel**, **press-to-test lamps** or **magnetic indicators** can be used.
* Where the operator must know a **range of movement**, such as deflection on either side of a datum or a position between open and closed, a **graduated-scale position indicator** is appropriate.

The distinction is between **end-position status** and **continuous/intermediate position information**.

## 21\. Visual Indicators for Rotary Actuators

Rotary actuators in this chapter normally operate equipment such as **fuel or oil valves**, for which the expected end positions are **OPEN** and **SHUT**.

The cockpit indication must therefore show the current valve position. The presentation must also allow recognition of circumstances when:

* The actuator is **moving between positions**; or
* The system has **lost its electrical supply**.

An operator should not confuse an in-transit or unpowered state with a confirmed OPEN or SHUT state.

## 22\. Press-to-Test Indicator Lights

A **press-to-test lamp** allows its own bulb filament to be checked without moving the aircraft equipment it monitors.

The pilot presses on the **front lens or glass** of the lamp unit. This operates the local lamp-test arrangement, verifying that the filament can illuminate while leaving the actuator’s actual selection and control switches unchanged.

The test establishes lamp functionality; the lamp’s normal indication continues to depend on the associated circuit or system condition.

## 23\. Electromagnetic Indicators

**Electromagnetic indicators** were introduced as an alternative to simple filament-lamp position indicators. The two styles shown in this chapter are:

1. **Doll’s-eye indicators**, with a circular visual window.
2. **Prism indicators**, with a small rectangular presentation.

The illustrations show the visual states **NO POWER**, **OPEN**, and **SHUT**. In the doll’s-eye example, the open and shut states have different circular appearances; in the prism example the words OPEN and SHUT appear through the indicator face, while the unpowered state is represented by diagonal hatching.

> \*\*Image Generation Prompt — Figure 7.11 Electromagnetic indicators\*\*
>
> Reproduce a detailed black-and-white instructional diagram of two different electromagnetic aircraft panel indicators on a white rectangular backing. \*\*Left side:\*\* a tall cutaway \*\*doll’s-eye\*\* indicator showing its internal movable mechanism; preserve leader labels exactly \*\*“SPINDLE”\*\*, \*\*“ARMATURE”\*\*, \*\*“RETURN SPRING”\*\*, \*\*“PLASTIC BALL”\*\*, \*\*“MAGNET ASSEMBLY”\*\*, \*\*“COIL”\*\*, and \*\*“TERMINAL”\*\*. Beside this cutaway show three circular display examples: diagonally hatched \*\*“NO POWER”\*\*, white \*\*“OPEN”\*\*, and dark/black \*\*“SHUT”\*\*; beneath them write \*\*“DOLLS EYE”\*\*. \*\*Right side:\*\* a horizontal cutaway prism indicator with layered optics and electromagnetic coil; label \*\*“PRISMS”\*\*, \*\*“CONTROL SPRING”\*\*, \*\*“TERMINAL”\*\*, \*\*“COILS”\*\*, and \*\*“ARMATURE”\*\* with corresponding leader lines. To its right/below, show three rectangular face appearances: diagonal black \*\*NO POWER\*\* hatching, small windows spelling \*\*“OPEN”\*\*, and dark windows spelling \*\*“SHUT”\*\*. Under this set write \*\*“PRISM”\*\*. Preserve the exact positions and relationships of the internal components and indicator states, avoiding decorative new elements. Keep the original caption \*\*“Figure 7.11 Electromagnetic indicators”\*\*.

### Improving cockpit readability

The book notes that visual system information may also be strengthened by adding painted **flow lines** to the relevant cockpit panels. These lines connect indicators visually with their associated system control switches, essential indications, and warning lights.

This helps the pilot interpret a group of instruments and controls as one system rather than isolated components.

\---

# 24\. Chapter Practice Questions — Rewritten From the Original Eight

The following questions assess the **same knowledge points** as the eight source MCQs. Choices are freshly worded for study use. The answers correspond to the original chapter’s intended key; explanations follow each question.

### Question 1 — Rotary actuator application

**Which aircraft component is most typically moved by a rotary electric actuator?**

A. The retracting landing-gear leg itself  
B. A mass-and-balance measuring device  
C. A fuel shut-off cock or valve  
D. A complete flying-control surface through a long linear stroke

**Answer: C — A fuel shut-off cock or valve.** Rotary actuators provide angular output through a gearbox and are well suited to turning fuel or air/oil shut-off valves.

### Question 2 — End-of-travel control

**What normally stops an electric actuator at its permitted travel limit?**

A. The slipping clutch during every normal movement  
B. End-position microswitches  
C. A mechanical position dial alone  
D. A hard stop without electrical interruption

**Answer: B — End-position microswitches.** The load operates the limit switches at the ends of its movement; the switches break the active motor supply and arrange the return-direction circuit.

### Question 3 — DC generator load sharing

**In a two-generator DC aircraft system, which arrangement does the source answer key identify as the normal load-sharing method?**

A. Matching the engines' rotational speeds precisely  
B. An equalizing circuit which senses a difference and acts to equalize the generators' output voltages  
C. Synchronizing relay equipment associated with an AC system  
D. An equalizing circuit which directly matches the generator field currents

**Answer according to this textbook: B.** This question is included in the DC motor chapter but refers to DC generator control discussed elsewhere in the book. For this source-based exercise, the retained response is the book’s **B**; specific aircraft generator equalization circuits should always be understood in the context of their actual control design.

### Question 4 — Position indication

**How is the end position of a typical rotary actuator presented to the crew?**

A. Through non-return hydraulic valves  
B. Through an indicator lamp or doll’s-eye display  
C. Solely through continuous-travel numerical counters  
D. By visual observation of an inaccessible valve

**Answer: B — An indicator lamp or doll’s-eye display.** Rotary actuators commonly have discrete OPEN and SHUT positions and matching cockpit indicators.

### Question 5 — Press-to-test lamps

**Which statement best describes an appropriate function of a press-to-test indication lamp?**

A. It provides cockpit indication of the relevant circuit/system condition and lets the lamp itself be tested  
B. It directly drives a rotary actuator  
C. It confirms actuator movement by itself without any status wiring  
D. It is fitted only for fault indications

**Answer according to the source: A.** The light is used for indication, and pressing the lens checks the filament locally without commanding the actuator. The source answer key assigns A.

### Question 6 — AC-to-DC conversion

**What electrical device converts alternating current into direct current?**

A. Inverter  
B. Rotary transformer  
C. Rectifier  
D. Alternator

**Answer: C — Rectifier.** Rectification converts AC into DC. This is a related electrical-systems knowledge check included in the original chapter questions.

### Question 7 — Inching movement

**For what type of actuator is a spring-centred IN/OFF/OUT inching switch particularly appropriate?**

A. Linear actuator  
B. Rotary valve actuator restricted to OPEN/SHUT  
C. A purely magnetic indicator  
D. A rectifier unit

**Answer: A — Linear actuator.** Small push/pull adjustments, such as trim or cooler-shutter positioning, are made by selecting brief motor movements in either direction.

### Question 8 — Overload protection

**Why is a friction clutch fitted in the mechanical drive of an actuator?**

A. To protect the mechanism from excessive mechanical load  
B. To replace every electromagnetic brake  
C. To compensate for hydraulic non-return valve failure  
D. To keep the supply voltage constant

**Answer: A — To protect the mechanism from excessive mechanical load.** A clutch slips when transmitted torque becomes excessive, limiting mechanical damage.

### Original source answer-key alignment

|Original question number|Source answer letter|Learning point|
|-:|:-:|-|
|1|C|Rotary actuator applications|
|2|B|Limit microswitches|
|3|B|DC generator equalizing/load-sharing principle|
|4|B|Position lights or doll’s-eye indicators|
|5|A|Press-to-test indication|
|6|C|AC-to-DC rectifier|
|7|A|Linear actuator inching|
|8|A|Friction clutch overload protection|



