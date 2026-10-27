# Chapter 15: AC Electrics — AC Motors

## 1\. Alternating Current Motors

### 1.1 Why AC motors are used

An **alternating-current (AC) motor** converts electrical energy into rotation, performing many of the same tasks as a direct-current (DC) motor. For aircraft applications, AC motors can be easier to operate and maintain because some designs avoid the commutator and brush problems associated with DC machines.

In a conventional DC motor, **commutation** depends on reliable electrical contact between brushes and the commutator. This contact can become troublesome in service:

* At **high altitude**, electrical arcing during commutation can become especially difficult to manage.
* Frictional and electrical heating can make the brushes **stick in their holders**.
* Poor brush contact increases the resistance between the brush and the commutator.
* In an extreme case, the contact effectively becomes an **open circuit**, stopping the motor.

Not all AC machines are brushless. A **synchronous AC motor** can use brushes and slip rings to provide a relatively small DC excitation current to its rotor. Nevertheless, this arrangement is generally less troublesome than the commutation arrangement of a DC motor.

A further advantage is speed stability. The operating speed of an AC motor is strongly related to the **frequency of the supplied AC**, making AC machines particularly suitable for equipment requiring an approximately constant speed. Depending on the design, they can use a **single-phase** or a **multiphase** electrical supply.

## 2\. Principle of AC-Motor Operation

The key idea is that alternating currents in stationary motor windings produce a **magnetic field that rotates**. This field acts on the moving part of the machine and develops the torque needed to turn its shaft.

The principal components are:

* **Stator:** The stationary part containing windings that create the rotating magnetic field when energized.
* **Rotor:** The rotating assembly on which the field acts; it transfers mechanical rotation to the output shaft.

This basic interaction is common to both single-phase and multiphase AC motors. The method used to create a useful starting field and the way the rotor develops its own magnetic field depend on the motor type.

### 2.1 Main motor categories

Most aircraft AC motors discussed in this chapter fall into one of two groups:

|Feature|Synchronous motor|Induction motor|
|-|-|-|
|Stator supply|AC|AC|
|Rotor electrical arrangement|Receives DC excitation|Receives no direct electrical supply|
|How rotor magnetism is obtained|DC makes the rotor an electromagnet|The stator's rotating field induces current in the rotor|
|Relationship to rotating field|Rotor turns in synchronism with it|Rotor turns slightly slower than it|

## 3\. The Synchronous Motor

### 3.1 How synchronization occurs

A **synchronous motor** is similar in construction to a rotating-field alternator, but it is operated as a motor. Applying a **three-phase AC supply** to its stator produces a magnetic field whose direction rotates around the machine.

Imagine placing a freely suspended bar magnet inside that rotating field. The magnet would tend to align with the field and follow it as it turns. The synchronous motor works on the same principle, except that its rotor is magnetized by a **DC supply** rather than being a simple permanent bar magnet.

As the stator field rotates, the energized rotor stays aligned with it and therefore revolves at **synchronous speed**. Its speed is fixed by the frequency of the electrical supply and the machine's number of poles.

> \*\*Image Generation Prompt — Figure 15.1 Generation of a rotating magnetic field\*\*
>
> Recreate a precise instructional electrical-engineering figure arranged vertically in one bordered rectangular area on a white background. \*\*Caption exactly:\*\* “Figure 15.1 Generation of a rotating magnetic field”. At the top draw a voltage-versus-time graph for \*\*three AC phases\*\*: a red sine wave labelled \*\*PHASE A\*\*, a yellow sine wave labelled \*\*PHASE B\*\*, and a blue sine wave labelled \*\*PHASE C\*\*, separated in phase. The left vertical axis is labelled \*\*VOLTS\*\*, with \*\*+\*\* above and \*\*−\*\* below the zero line. Mark five successive vertical dashed sampling lines numbered \*\*1\*\*, \*\*2\*\*, \*\*3\*\*, \*\*4\*\*, \*\*5\*\*, corresponding to five instants across the three-phase waves. Beneath the graph draw \*\*five circular cross-sections of the same three-phase motor\*\*, arranged with positions \*\*1, 2, 3\*\* on the upper row and \*\*4, 5\*\* on the lower row. Each circular diagram has a grey stator ring, six equally spaced inward-facing pole positions, magnetic-pole markings \*\*N\*\* and \*\*S\*\*, and a central slim bar-magnet/rotor with its own \*\*N\*\* and \*\*S\*\* labels. Preserve the color-coded winding terminal labels around every circle: \*\*A\*\* at the top and \*\*A1\*\* at the bottom in red; \*\*B1\*\* toward upper-left and \*\*B\*\* toward lower-right in yellow; \*\*C1\*\* toward upper-right and \*\*C\*\* toward lower-left in blue. Show changes to the stator pole polarity and the rotor orientation across instants 1–5 so the sequence visibly explains the rotation of the magnetic field. Add curved magnetic-flux lines inside each circle. Retain the five instance numbers above their diagrams and the original textbook's clear two-row composition, relative sizes, line weights, lettering, and annotations. Do not add decorative aircraft or unrelated apparatus.

### 3.2 Speed of a synchronous motor

A synchronous machine is essentially a **fixed-speed motor for a given supply frequency and pole count**. In aircraft systems where the electrical frequency is maintained, its rotational speed is consequently maintained as well.

The relationship between frequency, rotational speed, and poles can be written as:

$$
f = \\frac{P}{2} \\times \\frac{N}{60}
$$

where:

* **f** = electrical frequency in hertz (Hz);
* **P** = total number of magnetic poles;
* **N** = rotational speed in revolutions per minute (RPM).

Rearranging gives the synchronous rotational speed:

$$
\\boxed{N = \\frac{120f}{P}}
$$

**Worked example — four-pole motor supplied at 400 Hz**

$$
N = \\frac{120 \\times 400}{4} = \\boxed{12{,}000\~\\mathrm{RPM}}
$$

A four-pole synchronous motor on a 400 Hz supply therefore runs at **12,000 RPM**. It turns at the same speed as a generator producing that frequency **if the generator and motor have the same number of poles**.

### 3.3 Starting limitation

A basic synchronous motor **cannot start itself from rest** merely by applying its normal AC stator supply. Its rotor must first be accelerated until it can remain locked to the stator's rotating magnetic field. The chapter describes fitting **induction-type windings on the rotor** to help it reach synchronous speed.

### 3.4 Use in an engine-RPM indicator

One aircraft application is an electrical **engine-speed indicating system**:

1. The engine turns a small **three-phase alternator**, or **tacho-generator**.
2. The alternator produces a frequency that varies directly with engine rotational speed.
3. Its output operates a **synchronous motor** in the cockpit RPM indicator.
4. The indicator mechanism uses a **permanent magnet** and a **drag cup** to couple the motor's rotation to the pointer.
5. As motor speed increases, the magnetic drag moves the cup farther and the pointer travels farther around the RPM scale.

This arrangement allows the pointer's position to correspond to the engine's rotational speed without requiring a direct mechanical shaft all the way to the cockpit instrument.

## 4\. The Induction Motor

### 4.1 Basic operating idea

An **induction motor** develops torque without supplying electricity directly to its rotor. Instead, the stator's rotating magnetic field passes across conductors in the rotor and **induces an alternating voltage and current** in them. The rotor current then generates a magnetic field of its own. Interaction between this induced field and the stator field produces the motor's turning force.

Induction motors are widely used because they are **simple, robust, and comparatively inexpensive**. Much of the constructional economy comes from their **self-contained rotor**, which does not need a separate external electrical connection.

> \*\*Image Generation Prompt — Figure 15.2 Squirrel cage induction motor\*\*
>
> Produce a faithfully organized aviation-electrics training illustration on a white background in a single wide, thinly bordered box. \*\*Caption exactly:\*\* “Figure 15.2 Squirrel cage induction motor”. Divide the drawing into \*\*two side-by-side technical views\*\*. \*\*Left:\*\* a front-on section through a grey circular motor stator with a central circular squirrel-cage rotor viewed end-on. Show six evenly spaced stator winding sites and use three clearly differentiated winding colors: red winding at 12 o'clock and 6 o'clock, labelled \*\*A\*\* and \*\*A1\*\*; yellow windings at approximately 10 o'clock and 4 o'clock, labelled \*\*B1\*\* and \*\*B\*\*; blue windings at approximately 2 o'clock and 8 o'clock, labelled \*\*C1\*\* and \*\*C\*\*. The center contains a small grey circular rotor and an orange ring of small conductor-bar cross sections. \*\*Right:\*\* a three-dimensional oblique exploded/detail view of the cylindrical \*\*SQUIRREL CAGE ROTOR\*\*, consisting of many parallel \*\*orange copper rotor bars\*\* spaced around a cylinder, connected at both ends by grey circular \*\*end rings\*\*, with a central grey \*\*drive shaft\*\* extending from each end. Use black leader arrows and reproduce the labels exactly: \*\*COPPER ROTOR BARS\*\*, \*\*END RING\*\*, \*\*DRIVE SHAFT\*\*, and \*\*SQUIRREL CAGE ROTOR\*\*. Keep each object in the same relative position as the source: stator diagram at left, large orange-and-grey rotor assembly at right. Preserve the technical line-art/vector style, color coding, all A/A1/B/B1/C/C1 labels, and clean uncluttered layout. Do not add extraneous text or decorations.

### 4.2 The squirrel cage rotor

The common induction-motor rotor is formed from a **laminated cylindrical iron core**. Around its circumference are many lengthwise **copper bars**, distributed at regular intervals. At both ends, the bars are electrically joined by **rings of the same material**, creating a closed cage-like structure.

This arrangement is called a **squirrel cage rotor** because of its appearance. The copper conductors provide a **very low-resistance path**, allowing substantial current to flow when the stator field induces a voltage in them. No brushes or slip rings are required to supply this rotor.

### 4.3 The induction motor stator

The stator carries AC windings whose arrangement depends on the **number of phases** available and the **number of poles** required for the machine.

When its field sweeps past the conductive squirrel cage:

1. Relative movement between the stator field and the rotor conductors induces an EMF in the rotor.
2. Because the bars and end rings form a low-resistance closed circuit, the induced EMF drives a relatively large rotor current.
3. That current produces a magnetic field associated with the rotor.
4. The rotor field interacts with the rotating field of the stator, developing **torque** and turning the shaft.

In a **three-phase induction motor**, interchanging **any two supply phases** reverses the sequence of the rotating stator field. The **direction of rotation therefore reverses**.

## 5\. Slip Speed

### 5.1 Why an induction rotor must lag behind

The induction-motor rotor cannot maintain **exactly** the same speed as the rotating stator field while producing normal torque. If both were moving together with no difference in speed, the field would no longer pass across the rotor bars. No voltage would be induced, rotor current would disappear, and the motor would lose its electromagnetic driving torque.

The difference between the field's synchronous speed and the actual rotor speed is called **slip speed** or **rotor slip**. A representative amount of slip in the chapter is **5%**.

Because it does not run in perfect step with the stator field, the induction motor is also termed an **asynchronous motor**.

The motor's operating speed is influenced by both:

* **Supply frequency**, which determines the synchronous speed of the stator field.
* **Mechanical load**, which affects the amount of slip and therefore the actual rotor speed.

For clarity, slip can be expressed as the difference between the two speeds:

$$
N\_{\\text{slip}} = N\_s - N\_r
$$

where **N\_s** is synchronous-field speed and **N\_r** is actual rotor speed. This is a restatement of the chapter's definition of slip, rather than an additional motor operating requirement.

## 6\. Starting Single-Phase Induction Motors

### 6.1 The starting problem

A basic **single-phase induction motor is not self-starting**. To obtain a rotating magnetic field during starting, an additional arrangement is needed.

A commonly used solution is a **split-phase winding**. It is designed so that the current in the auxiliary winding is displaced from the main-winding current. When a phase difference approaching **90°** is produced, the resulting combined magnetic effect can create the rotating field needed to start the motor.

### 6.2 Split-phase starting methods

The phase difference may be obtained by using:

1. **Resistance starting**.
2. **Inductance starting**.
3. **Combined resistance/inductance starting**.
4. **Capacitance starting**.

Which method is suitable depends partly on motor power. The textbook gives **capacitor-started motors** as being **usually below 2 horsepower (HP)**.

## 7\. Operation With a Failed Supply Phase

A three-phase induction motor may occasionally lose one of its supply phases. The chapter describes the following behavior for a **lightly loaded** motor:

* An already-running motor may keep rotating, but at **approximately half its normal speed**.
* It may develop a **humming sound** that is difficult to notice if the motor is installed in a remote part of the aircraft.
* The fault may only become evident when the motor is next selected, because it **will not start** under those conditions.

The important distinction is between a motor **already running when a phase is lost** and one **being started with that phase missing**. These are not equivalent operating conditions. The approximate half-speed behavior is the textbook's described fault scenario; it should not be treated as a universal prediction for every three-phase motor and load.

## 8\. Chapter Questions

### Question 1

A synchronous AC motor normally receives which supply at its stator?

* **a.** Three-phase alternating current
* **b.** Single-phase alternating current only
* **c.** Direct current applied to the stator
* **d.** Direct current at the stator and alternating current at the rotor

### Question 2

What happens to the direction of a three-phase motor when two incoming phases are exchanged?

* **a.** The supply fuses necessarily rupture
* **b.** The motor turns in the opposite direction
* **c.** The stator windings necessarily overheat
* **d.** The motor necessarily stops and remains stalled

### Question 3

With the number of motor poles unchanged, which property of the electrical supply determines the synchronous motor's rotational speed?

* **a.** Supply voltage
* **b.** Current magnitude
* **c.** Reactance
* **d.** Supply frequency

### Question 4

In the lightly loaded three-phase-motor fault condition described in this chapter, what can happen after one supply phase is lost?

* **a.** The motor continues at its former speed without any effect
* **b.** The motor always slows steadily to a complete stop
* **c.** The motor stops instantly in every case
* **d.** It may keep running at roughly half speed but fail to start on the next attempt

### Question 5

Which action provides the basic rotating magnetic field needed by a three-phase induction motor?

* **a.** Producing the rotating field directly in the rotor
* **b.** Producing the rotating field in the stator
* **c.** Establishing a stationary stator field
* **d.** Establishing a stationary rotor field

### Question 6

Which statement correctly describes how current is established in an induction motor's rotor?

* **a.** A star-connected rotor receives its normal supply externally
* **b.** The stator and rotor fields combine without relative movement
* **c.** Alternating current is induced in the rotor conductors
* **d.** An external DC source supplies DC directly to the squirrel cage

### Question 7

In a synchronous AC motor, what causes the rotor to follow the magnetic field produced by the stator?

* **a.** DC excitation magnetizes the rotor so it aligns with the stator field
* **b.** A wave-wound rotor eliminates the stator field
* **c.** AC and DC are both supplied directly to the same rotor winding
* **d.** Induced AC in the rotor continually prevents alignment

### Question 8

Which arrangement is characteristic of a basic squirrel-cage induction motor?

* **a.** Slip rings with brushes
* **b.** A commutator
* **c.** Neither slip rings nor brushes for rotor excitation
* **d.** Slip rings that operate without brushes

### Question 9

What is true of the squirrel-cage rotor in an induction motor?

* **a.** It does not need a direct connection to the electrical supply
* **b.** Its cost is high because it requires a separate excitation feed
* **c.** It always turns at exactly the stator-field speed
* **d.** Its electrical cage is an open, high-resistance path

### Question 10

Which starting arrangement may be selected for a comparatively powerful single-phase induction motor, according to the chapter?

* **a.** Capacitance starting as the usual choice regardless of output
* **b.** Combined resistance-and-inductance starting
* **c.** A cartridge-based starting device
* **d.** Mechanical bump starting as the standard electrical method

## 9\. Answers and Explanations

|Question|Answer|Explanation|
|-|-|-|
|1|**a**|The stator normally uses three-phase AC to produce its rotating field; the synchronous rotor receives DC excitation.|
|2|**b**|Exchanging two phases reverses phase sequence and therefore reverses the rotating field and motor direction.|
|3|**d**|With pole number fixed, synchronous speed depends on the supply frequency.|
|4|**d**|The textbook's lightly loaded, single-phase-loss example describes continued slower running followed by failure to restart.|
|5|**b**|The energized stator windings create the rotating field that induces rotor current and develops torque.|
|6|**c**|The stator field induces AC in the squirrel-cage rotor; no external rotor supply is required.|
|7|**a**|DC energizes the rotor so it behaves as a magnet and stays aligned with the rotating stator field.|
|8|**c**|Squirrel-cage induction motors do not need the brushes and slip rings used to supply current to some other rotor designs.|
|9|**a**|The rotor is a closed cage circuit in which current is induced, so it is electrically independent of a direct feed.|
|10|**b**|The chapter lists resistance/inductance starting as an option and associates capacitor starting usually with motors below 2 HP.|



