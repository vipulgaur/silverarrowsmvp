# Chapter 5: Piston Engines — Ignition

## 1. The Dual Ignition System

Aircraft piston engines use **two separate ignition systems** rather than relying on a single source of sparks. Each cylinder has **two spark plugs**, and the plugs are supplied by **different magnetos**, with the two ignition circuits operating independently.

This arrangement serves two purposes:

- **Reliability:** If one ignition system fails, the remaining system can continue igniting the mixture, reducing the possibility of an engine failure caused by an ignition fault.
- **More effective combustion:** Igniting the charge at two locations shortens the time required for the flame to spread through the cylinder. As a result, dual ignition also improves engine power output.

## 2. Magnetos

A **magneto** is an engine-driven, self-contained electrical generator that produces the **extra-high-tension (EHT)** pulses required to fire the spark plugs. It also delivers these pulses in the correct sequence for the engine's cylinders. Unlike an ignition arrangement that depends on a continuously supplied external electrical source, the magneto generates its own ignition energy as it turns.

### 2.1 How a Magneto Produces Ignition Voltage

A magneto combines two electrical principles:

1. **Permanent-magnet generation:** Rotation of the magnetic system produces a changing magnetic field.
2. **Step-up transformation:** A rapidly changing magnetic field induces a much larger voltage in a secondary winding than in a primary winding.

The **primary winding** contains several hundred turns of relatively thick wire. The **secondary winding** contains thousands of turns of much finer wire. A pair of **cam-operated contact breaker points** controls when the primary current is interrupted.

At the required ignition instant, the contact breaker points open. The primary current then stops, and the magnetic field associated with that current collapses rapidly. The changing magnetic flux links the many turns of the secondary coil and induces the EHT pulse needed to produce a spark across the plug electrodes. This is **electromagnetic induction**.

### 2.2 Distributing the Spark

The voltage induced in the secondary winding is routed to a rotating electrical selector known as the **distributor**. As the distributor turns, it connects the high-voltage output to the appropriate cylinder's spark plug in the engine's firing order.

The contact-breaker cam and distributor are mechanically synchronized. Consequently, the distributor selects the correct plug at the same moment the contact points open and the secondary voltage pulse is generated.

The **contact-breaker cam and distributor rotor operate at half engine speed**.

## 3. The Capacitor (Condenser)

The **condenser**, also called the **capacitor**, is essential to efficient magneto operation. Its two principal functions are to:

- Limit sparking and damage at the contact breaker points.
- Help the primary magnetic field collapse quickly enough to induce a high voltage in the secondary winding.

The condenser is connected **in parallel with the contact breaker points** in the magneto's primary control arrangement.

When the contact breaker opens, current would otherwise tend to continue flowing through an arc across the separating points. That arcing would damage the contacts and delay the change in magnetic flux. Instead, the voltage developed at the opening points charges the condenser. Only a small, weak spark may occur at the contacts, and primary current is interrupted much more rapidly.

The rapid disappearance of the primary magnetic field strengthens the induced EHT pulse in the secondary winding. In this way, the condenser both protects the breaker points and improves the magneto's effectiveness.

> **Image Generation Prompt — Figure 5.1 Magneto Circuit**
>
> Re-create a precise, flat, two-dimensional aircraft magneto electrical schematic on a white background, using the original textbook's layout and color coding. The circuit consists of a lower **red primary circuit** and an upper **blue secondary circuit**. In the bottom-centre/right, draw a black permanent-magnet arrangement with clearly legible repeated **N** and **S** magnetic-pole letters, a red primary coil wound around the horizontal top of the magnetic assembly, and a pale-blue secondary coil immediately above it. Keep these as visibly distinct windings. Across the bottom-left, arrange three separately labelled components in this exact left-to-right order: **Ignition switch** (open switch symbol), **Condenser** (two-plate capacitor symbol), and **Contact Breaker** (cam-operated point symbol). Use red wires from the primary winding to those components and red ground symbols under each grounding branch. Include a blue secondary-wire path from the secondary winding at the left, running down to a blue ground symbol, and from the winding at the right into the distributor. Place the **Distributor** at upper right as a vertically oriented rounded rectangular body with four circular contacts marked **1**, **3** on the top row and **2**, **4** on the bottom row; a black rotating pointer points toward contact **1**. Above and to the left of the distributor, show **four horizontally arranged spark-plug electrode symbols stacked vertically**, connected by blue wires, and numbered from top to bottom **4, 3, 1, 2**. Include four matching blue ground symbols at the far left of those spark-plug rows. Print **Spark plugs** beside the electrode bank, **Secondary circuit** beside the blue coil, **Primary circuit** to the right of the red coil and magnet assembly, and **Distributor** beside the distributor enclosure. Add the original **black dashed mechanical linkage** connecting the contact-breaker cam to the distributor, labelled **Mechanical linkage**. Keep thin blue wiring, red primary wires, black component outlines, neat technical lettering, accurate junctions and conductor routing, and a light rectangular figure boundary. Place the exact caption **Figure 5.1 Magneto Circuit** beneath the drawing. No invented electrical components, labels, or extra panels.

## 4. The Ignition Switch

The cockpit **ignition switch** controls whether each magneto is permitted to operate. It does so by controlling the **earthing (grounding) of the primary circuit**.

- **Switch OFF:** The switch provides an earth connection across the contact breaker circuit. The breaker can no longer interrupt the primary current in the required way, so the magneto is made inoperative.
- **Switch ON:** The earthing path through the switch is open. The contact breaker points are then able to make and break the primary circuit normally, allowing the magneto to generate sparks.

Thus, although the cockpit switch is called an ignition switch, **the magneto is disabled by closing its grounding circuit**, not by simply removing an external supply of electrical power.

## 5. The Grounding Wire

The wire connecting the magneto's primary circuit to its grounding switch is used to stop ignition when the magneto is selected OFF.

Two different wire faults have different consequences:

- **Wire broken and not touching earth:** The magneto may continue working normally while the engine runs, so the pilot might notice no change in engine performance. However, the cockpit switch can no longer reliably ground and switch off that magneto.
- **Wire broken and contacting the engine or airframe:** The magneto's primary circuit becomes grounded, which disables that magneto.

These possibilities help explain why magneto operation and switch effectiveness need to be checked.

## 6. Magneto Checks

### 6.1 Dead Cut Check

The **dead cut check** is performed with the engine **running slowly**. Its purpose is to establish that the ignition switch can control the magnetos before ignition checks are attempted at higher engine speeds.

When each magneto is selected OFF individually, **engine rpm must decrease, but the engine must continue running**.

**Essential observation: RPM must fall, but the engine must not stop, when either magneto is switched off in turn.**

### 6.2 Why the Check Must Be Done at Low Speed

Consider an engine that is actually running on only one serviceable magneto, with the pilot unaware of the fault. If that functioning magneto is switched off during a high-rpm check, the engine stops firing.

An instinctive move to turn the ignition switch rapidly back to **BOTH** could then make the engine resume firing abruptly, while the throttle remains set for the high-rpm test. The resulting sudden torque reaction between the engine and aircraft structure could cause serious damage.

This is why the initial confirmation of ignition-switch control takes place at low engine speed.

### 6.3 Live Magneto Check

A separate **live magneto check** is generally unnecessary because a change in engine rpm during the dead cut check normally indicates whether the selected magneto has responded to the switch movement.

### 6.4 Magneto RPM Drop Check

The **magneto rpm drop check** is carried out at approximately **75% of maximum engine speed**. It is used to assess whether both magnetos and their spark plugs are working correctly.

Each magneto is switched off separately, and the associated reduction in rpm is observed. The decrease must fall within the limits set by the **engine manufacturer**.

With one magneto turned off, only one plug in each cylinder continues firing. This means the mixture takes longer to burn, accounting for the observed reduction in engine speed.

## 7. Auxiliary Starting Devices

At normal starting cranking speed, approximately **25 rpm** for many aero-engines, a magneto turns too slowly to generate a spark of sufficient energy to ignite the petrol–air charge reliably.

To improve starting, certain engines therefore use devices that **increase or supplement spark energy**, while ensuring the spark occurs at a suitable, retarded point in the starting cycle.

### 7.1 High-Tension (HT) Booster Coil

An **HT booster coil** sends a succession of high-voltage impulses to the **trailing, starting, or retarded electrode** of the main distributor rotor. This creates the **shower-of-sparks** starting arrangement.

The booster is switched **ON for engine starting** and **OFF once the engine has started**.

### 7.2 Low-Tension (LT) Booster Coil

An **LT booster coil** provides a low-voltage supply to the magneto primary circuit during cranking. This supplements primary excitation and permits ignition operation when the magneto is rotating too slowly to work effectively unaided.

The system requires a **battery supply** and is connected to a primary magneto, typically the **left magneto**. During the starting sequence, operation of the starter and booster produces the boosted ignition output, routed through the distributor's trailing-arm arrangement to obtain a **retarded spark**. Retarding the spark helps prevent **engine kick-back** during starting.

The booster arrangement is selected **ON during starting** and **OFF after start-up**.

### 7.3 Impulse Coupling

An **impulse coupling** is a **mechanical, spring-operated starting aid**. It temporarily stores energy and then releases it so that the magneto rotates more quickly for a short interval. This brief increase in magneto speed produces a stronger spark at a **retarded ignition timing** during engine cranking.

The mechanism operates **without a separate action by the pilot**.

## 8. Magneto and Distributor Venting

Magnetos and distributors experience changes in **temperature and pressure**, especially as aircraft altitude varies. Their design must therefore account for moisture and condensation.

Moisture can permit current to travel across surfaces that would normally insulate electrical components. Examples include the distributor block, rotor arm, and coil casing.

### 8.1 Flashover

Under normal operation, EHT is intended to cross the appropriate air gaps and reach the correctly selected spark plug. If an insulating surface becomes wet, the high voltage may instead:

- Discharge along that surface to earth; or
- Reach a different spark plug rather than the plug intended to fire.

This unwanted discharge is called **flashover**, and it can cause one or more cylinders to misfire.

### 8.2 Waxing Insulating Components

Components such as **coils, condensers, distributors, and distributor rotors** may be coated with wax. The wax encourages moisture to form **separate droplets** rather than spreading as an unbroken film that could conduct electricity across an insulating surface.

### 8.3 Carbon Tracking

Flashover may leave a thin, pencil-like dark mark known as **carbon tracking**. This happens when electrical discharge burns contamination containing hydrocarbons on the insulating surface.

Heat from the discharge drives out moisture from the contamination, leaving carbon behind. The carbon deposit provides a conducting path. Consequently, **current may continue to follow the track even after the surface has dried**.

### 8.4 Why Magnetos Are Not Hermetically Sealed

A magneto cannot simply be made permanently airtight to exclude moisture, because the unit must accommodate **changes in ambient pressure and temperature with altitude**. Venting and moisture-control measures are therefore important parts of magneto and distributor design.

## 9. Diesel Engine Ignition

A diesel engine differs from a spark-ignition petrol engine because it is a **compression-ignition engine**. It does not need a magneto-and-spark-plug ignition system, reducing ignition-system **weight and complexity**.

Diesel engines operate with much higher compression ratios; a ratio of approximately **25:1** is not unusual. Compressing the air raises its temperature sufficiently for injected fuel to ignite without an externally generated spark.

### 9.1 Cold Starting

To help a cold diesel engine start, **glow plugs or pre-heaters** provide localized heating in or near the combustion chamber.

After the engine has started, the high temperature resulting from compression provides the conditions needed for continued ignition of the injected fuel. The combustion process can therefore continue without a separate spark-producing system.

## 10. Questions

**1. At what point in the magneto's operating cycle is a spark delivered across the spark-plug electrodes?**

- a. As the breaker contacts come together.
- b. As the breaker contacts separate.
- c. While the breaker contacts remain separated.
- d. When the magneto switch circuit is made.

**2. In which part of a magneto ignition system is the cockpit ignition switch connected?**

- a. The primary winding circuit.
- b. The secondary winding circuit.
- c. The starter-motor electrical circuit.
- d. The battery circuit.

**3. What happens to the primary-to-earth connection when the ignition switch is selected ON?**

- a. The breaker contacts are isolated.
- b. The starter-motor circuit is completed.
- c. The secondary coil is connected directly to earth.
- d. The primary grounding path is opened.

**4. What is the main reason for fitting a condenser to a magneto?**

- a. To help primary current cease rapidly and reduce arcing at the breaker contacts.
- b. To slow the collapse of primary current and prevent arcing.
- c. To lower the voltage produced in the secondary circuit.
- d. To hold the primary circuit permanently at earth potential.

**5. Under which engine operating condition is a dead cut check made?**

- a. During a power check.
- b. At low engine speed.
- c. At cruise rpm.
- d. With the throttle fully open.

**6. What does the magneto distributor route to the spark plugs?**

- a. Voltage taken directly from the primary winding.
- b. Secondary-winding voltage back into the primary circuit.
- c. High voltage produced by the secondary winding.
- d. Secondary voltage to the breaker contacts.

**7. Which electrical condition is needed to create a spark across the gap between two electrodes?**

- a. A sufficiently high electromotive force.
- b. A high resistance measured in ohms.
- c. An especially high current flow.
- d. An impulse union fitted to the circuit.

**8. What is the function of the ignition switch?**

- a. To control the primary circuit of the magneto.
- b. To stop moisture condensing inside the magneto.
- c. To connect the secondary winding to the distributor.
- d. To connect the battery supply to the magneto.

**9. In a complex piston engine, ignition timing may be adjusted in what way as rpm rises?**

- a. Advanced.
- b. Retarded.
- c. Left unchanged.
- d. Retarded only, with no possibility of advancing.

**10. How does an impulse starting device assist a magneto during engine starting?**

- a. By using a leaf spring.
- b. By using a coil spring to increase magneto rotational speed temporarily.
- c. By applying a special starting battery's single electrical pulse directly to the plugs.
- d. By firing an explosive charge inside a dedicated tube.

## 11. Answers

| Question | Answer |
|---|---|
| 1 | b |
| 2 | a |
| 3 | d |
| 4 | a |
| 5 | b |
| 6 | c |
| 7 | a |
| 8 | a |
| 9 | a |
| 10 | b |
