# Chapter 26: Gas Turbines — Fuel Systems

## 1. Introduction

A gas turbine's **engine fuel system** receives fuel from the aircraft supply, removes contamination, monitors operating conditions and delivers fuel to the combustion-chamber spray nozzles. Its principal task is to provide the **fuel flow appropriate to the thrust demanded by the throttle**, while keeping the engine within its operating limitations. To achieve this, the installation uses pumps, heaters, filters, metering and shut-off devices, instrumentation and engine-control equipment.

## 2. System Components

### 2.1 Airframe supply, booster pumps and engine isolation

Fuel is first moved from the aircraft tanks by **tank-mounted booster pumps**. It travels from the **airframe fuel system** through **non-return valves** to the engine supply. The non-return valves help prevent fuel from flowing backwards through the supply arrangement.

An **engine fuel shut-off valve**, also referred to as the **pylon shut-off valve** or the **low-pressure (LP) shut-off valve**, isolates the supply arriving from the airframe. It can be closed for engine-component removal and is connected to the **fire handle**, allowing the fuel supply to be isolated following an engine-fire warning.

Closing this valve can also stop the engine in an emergency. It is not the normal shutdown control, however: because the valve is upstream in the fuel supply, **engine run-down takes longer** than when fuel is stopped nearer the burners.

> **Image Generation Prompt — Figure 26.1**
>
> Re-create a precise, landscape-oriented **gas-turbine engine fuel-system schematic**, matching the original aviation textbook diagram rather than creating a decorative illustration. Use a white background, fine black strokes, small serif technical labels and a faint pale-gray gas-turbine silhouette behind the lower-right components. A horizontal **blue dashed division** separates the upper **AIRFRAME** region from the lower **ENGINE FUEL SYSTEM** region. At upper left, draw a rectangular **Fuel Tank** containing two circular **Booster Pumps**; a red fuel line exits downward through a black/white **LP shut off valve**, with a dashed black connection labelled **Fire handle**. Place the fuel-component blocks in their original left-to-right order in a single horizontal row: **LP pump**, **Cooler FCOC**, **Heater**, **Filter**, **HP pump**, **Filter**, **FCU**, a black circular **HP fuel shut off** element beneath **HP cock**, and **Flow meter**. Above the chain, show circular instrument bubbles labelled **N₁**, **Fuel temp**, **Fuel press**, **N₂**, **EGT** and **Fuel flow** in matching positions, plus slanted cockpit-control levers labelled **Throttle** and **HP cock**. Reproduce distinct black dashed, blue dotted, red solid and other signal lines connecting the components and engine sensors, with the original branching and termination points. Beneath the chain place the individual labels **P₁-Intake pressure**, **LP shaft speed**, **HP shaft speed**, **HP comp outlet P₃** and **Fuel Thermocouples**, with lines to the correct instrument and control blocks. Show four small red fuel-spray-nozzle circles stacked vertically and connected to the red high-pressure line. Add the **Drains tank**, **Drain valve open on shutdown**, its valve symbol, and the drain connections at lower right. Preserve the engineering layout, all label wording, arrow directions, relative sizes and functional connections. Put the exact caption **Figure 26.1** beneath the diagram; no new components or invented text.

### 2.2 Low-pressure pump (LP pump)

Once fuel has entered the engine installation, it reaches the **engine-driven LP pump**, sometimes called the **backing pump**. Driven through the engine gearbox, this pump provides the feed required by the downstream high-pressure pump.

The LP pump can draw fuel directly from the tanks if **all tank booster pumps fail**, so loss of the booster pumps does not necessarily stop the engine immediately. At high altitude, however, reduced pressure at the pump inlet increases the possibility of **cavitation**. The aircraft's **Minimum Equipment List (MEL)** provisions may therefore require a **descent to a lower altitude** after such a failure.

### 2.3 Fuel-cooled oil cooler (FCOC)

Most gas-turbine fuel installations incorporate a **fuel-cooled oil cooler**. Oil from the engine transfers heat to the fuel as the two fluids pass through the heat exchanger. The arrangement serves two purposes at once:

- **Engine oil is cooled** by giving up heat.
- **Fuel is warmed**, helping prevent the development of ice crystals capable of obstructing components farther along the fuel system.

### 2.4 Fuel heater

The dedicated **fuel heater** provides further warming to remove or prevent ice crystals remaining in the fuel after the fuel-cooled oil cooler. Its heat source is **compressor delivery air**.

The heating arrangement may operate **automatically**, coordinating with the FCOC to hold fuel near a predetermined temperature, or it may be **manually selected by the flight engineer** in installations providing that facility.

### 2.5 Low-pressure fuel filter

A **fuel filter** on the LP side keeps dirt and other contaminants away from sensitive downstream equipment, particularly the **HP fuel pump** and **Fuel Control Unit (FCU)**. These components rely on accurately controlled small passages and moving parts, so cleanliness is essential to their operation.

### 2.6 Fuel-flow indication

The **flowmeter** measures the rate at which fuel is being delivered. Its indication may be expressed in **gallons per hour** or **kilograms per hour**.

Some installations also use an **integrator or totalizer**. Instead of displaying only the current consumption rate, this function accumulates the **total fuel consumed since engine start**.

### 2.7 Fuel pressure and temperature monitoring

Sensors can measure **fuel pressure** and **fuel temperature** in this section of the system. Their readings may be sent to the flight deck, enabling the crew to observe fuel-system conditions during operation.

### 2.8 High-pressure fuel pump

The **HP pump** is driven from the engine's **high-pressure shaft** through the HP gearbox. It increases the fuel pressure and provides the flow needed to satisfy the selected engine-thrust demand.

An **axial-piston HP pump** is used in some engines. Its variable-displacement arrangement includes a swash plate, rotating pumping components and a servo mechanism to vary delivery.

Other engines use a simpler **spur-gear HP pump**. Such a pump supplies the required pressure and flow while **excess fuel is recirculated to the inlet side**.

> **Image Generation Prompt — Figure 26.2 Axial piston type fuel pump (based on an original Rolls Royce drawing)**
>
> Produce a close reconstruction of the original detailed **cutaway engineering illustration of an axial-piston gas-turbine fuel pump**. Format: wide horizontal technical drawing on white with a fine surrounding rectangle, gray-and-silver mechanical casing, dark gray shafts, black outlines and precisely placed color-filled internal flow passages. The **PUMP DRIVE** is a toothed shaft projecting from the bottom-left/left end; the pump body occupies the center with a large tilted **SWASH PLATE**, a visible **PLUNGER** and a central **ROTOR**. The upper-right extension contains a cylindrical **SERVO PISTON** assembly, drawn with nested springs, seals and passages. On the far right, a short tube marked **FUEL INLET** has a yellow arrow pointing toward the pump; at the lower center-right is **FUEL OUTLET** indicated in red. Preserve the colored flow routes: **yellow = LOW PRESSURE FUEL**, **red = PUMP DELIVERY (HP FUEL)** and **purple = SERVO PRESSURE**. Place a three-item square-color legend in the lower-right inside the drawing, with those exact labels. Use black leader lines and all original part labels **SWASH PLATE**, **PLUNGER**, **SERVO PISTON**, **PUMP DRIVE**, **ROTOR**, **FUEL INLET**, **FUEL OUTLET**. Match the original component angles, cross-sections and path positions. Caption exactly: **Figure 26.2 Axial piston type fuel pump (based on an original Rolls Royce drawing)**.

### 2.9 Fuel Control Unit (FCU) / Fuel Flow Regulator (FFR)

The **FCU**, also termed the **Fuel Flow Regulator (FFR)**, determines how much fuel reaches the burners for the required thrust. Fuel flow cannot be set from throttle position alone because engine operating conditions change with altitude, airspeed and engine state.

A hydro-mechanical FCU therefore contains devices that modify the metered fuel flow in response to **engine intake pressure**, **compressor delivery pressure**, **acceleration requirements**, **exhaust gas temperature** and other limiting conditions.

> **Image Generation Prompt — Figure 26.3 Hydro-mechanical fuel control**
>
> Reproduce the original wide, complex **hydro-mechanical fuel control schematic** in a thin black rectangular border on white. The left third contains a gray axial-piston **Pump** with a diagonally oriented **Swash Plate**, plungers, a drive shaft and labeled **Drain** and **Bleed** locations. Trace its multicolored internal channels through the central control assembly and across to the right-hand fuel line ending in a stylized **Burner** nozzle with two small curved blue **Primary Air** arrows. At lower-left include a boxed **Main Filter**; along the lower-middle show the separate labeled **Throttle** and **HP Cock** valve symbols and a drain; in the central upper region a labeled **Servo piston** and **RPM Governor** with spring/valve details. At right include the capsule-based **BPC** control box and a **Back Pressure Valve** below it, plus the full arrangement of connecting lines, arrows, orifices and relief paths. Preserve the exact left-side color legend and swatches: **LP** pale yellow, **HP** red, **Servo** light cyan, **Governor** blue, **Air Intake** pale lavender-gray, and **Primary Air** dark blue arrow. All leader lines, labels, arrows and channel colors must be included in their corresponding positions. Technical cross-section/vector style; no simplified replacement. Caption exactly: **Figure 26.3 Hydro-mechanical fuel control**.

### 2.10 Altitude control

At a fixed throttle setting, the required burner fuel flow changes as **engine intake pressure (P₁)** varies with altitude and airspeed. To maintain the selected **engine rpm**, the FCU responds to this pressure variation.

An **altitude-sensing unit** contains a **barometric pressure capsule (BPC)**. Changes in P₁ make the capsule expand or contract; that motion alters the fuel-metering arrangement to provide the required compensation.

### 2.11 Acceleration control

An engine requires additional fuel to accelerate, but adding it too quickly can produce **compressor stall or surge**. The FCU's **acceleration control unit** limits the rate at which fuel is increased.

It uses **intake pressure P₁** and, on a two-spool engine, **compressor delivery pressure P₃** as control inputs. These pressure signals reposition a **fuel-metering plunger**, which operates like another throttle valve **in series with the main throttle**. Fuel delivery can therefore be raised quickly enough for effective acceleration without exceeding the compressor's stable operating capability.

### 2.12 Exhaust-gas-temperature limiting

**Exhaust gas temperature (EGT)** is a critical gas-turbine operating parameter. High turbine temperature is associated with high efficiency, but temperature must stay below the limit imposed by the turbine materials.

A **top-temperature control unit** allows high power to be selected without permitting damaging turbine overheating. **Thermocouples** installed in or just downstream of the turbine sense gas temperature. Their signal is routed both to the **cockpit temperature indication** and to a **temperature-control signal amplifier**. The amplifier provides an electrical output that drives a **solenoid**, which acts indirectly on fuel flow to keep the temperature within limits.

### 2.13 Compressor pressure-ratio / power limitation

The compressor casing can safely withstand pressure only up to its structural design limit. Excess compressor pressure could cause severe structural failure.

To prevent an excessive **compressor pressure ratio**, the FCU's **power limiter** receives both **P₁ (intake pressure)** and **P₃ (compressor delivery pressure)**. Pressure-sensitive capsules and levers translate those inputs into adjustments of fuel flow so that the maximum permitted compressor pressure ratio is not exceeded.

### 2.14 Engine-rpm limiting

Compressor rotors must remain below their maximum permitted rotational speed to avoid destructive **centrifugal loading**. Two types of rpm limitation are described.

**Electrical speed sensing:** A **tacho-generator** or **electronic speed sensor** is driven by the relevant shaft. As shaft speed increases, it sends an electrical signal to an amplifier, normally shared with the temperature-limiting system. Near the preset rpm limit, the amplifier causes fuel delivery to be reduced or constrained.

**Hydro-mechanical speed governing:** This method is commonly used for the **HP compressor shaft**, which also drives the external gearbox and the HP fuel pump. A **hydro-mechanical governor** within the HP pump senses hydraulic pressure related to shaft speed. When speed reaches the specified maximum, pressure acting on a **diaphragm** moves valves that release some **servo-piston pressure**, restricting burner fuel flow and preventing further overspeed.

### 2.15 High-pressure fuel cock / HP shut-off valve

The **HP fuel cock**, also known as the **HP fuel shut-off valve**, is installed between the FCU and the **fuel spray nozzles**. This is the **normal valve used to start or stop the engine** by permitting or cutting off fuel to the burners.

Depending on the aircraft, it may be operated by a **mechanical lever on the flight deck** or by an **electrically powered actuator** controlled from a cockpit switch.

### 2.16 Pressurizing and dump valve

A **pressurizing valve** is used with **duplex fuel nozzles**. The primary or pilot manifold receives fuel first; when the fuel pressure reaches a specified value, the valve also opens the **main fuel manifold**.

At engine shutdown, a **dump valve** releases fuel remaining in the manifolds to a **drains tank**. Removing this residual fuel helps prevent it from **boiling because of heat retained by the engine**.

### 2.17 Drains tank

The **drains tank** collects unburned fuel from the **fuel manifold** and **combustion chamber** after a normal shutdown or an unsuccessful start. When the engine is operating, a **pressure-operated non-return valve** isolates the drains tank from the running engine.

## 3. Electronic Engine Control

### 3.1 Development of engine control

An engine-control system must obtain the best practical engine efficiency while respecting its **structural and operating limits** under changing flight conditions. The more complex the engine, the more demanding the control task.

In early installations, the pilot was responsible for virtually the entire process: **starting**, choosing power for each flight phase, adjusting the throttle, watching the instruments and shutting the engine down if a limit was exceeded. Engine gauges provided the indications, while a **mechanical throttle linkage** transmitted cockpit inputs to the engine-mounted **FCU**. The FCU then regulated fuel for altitude changes, acceleration and deceleration, and included an **rpm sensor** to guard against overspeed.

**Analogue electronic engine control** appeared in the **1960s**. Electrical signals replaced the mechanical command input to the FCU. Although this was an advance, the system could be affected by problems such as **electronic noise interference**. An early application was on the **Rolls-Royce Olympus 593** engine used by **Concorde**.

Development continued in the **1970s** with **Full Authority Digital Electronic Control (FADEC)**. Digital control reduced the pilot's workload for maintaining engine efficiency and overseeing engine condition. **NASA** and **Pratt & Whitney** were early experimenters with digital FADEC. This work was followed by a **Pratt & Whitney PW2000** becoming the first civil engine retrospectively fitted with FADEC.

### 3.2 Supervisory Electronic Engine Control (EEC)

In a **supervisory EEC** installation, a computer receives the engine target requested through the **throttle lever angle (TLA)** and/or the **Flight Management System (FMS)**. It sends commands to the FCU, which changes fuel delivery to the burners.

Depending on the pump design, the FCU changes fuel flow by:

- Adjusting the **swash-plate angle** of a hydro-mechanical variable-delivery HP pump; or
- Changing the **fuel bypass/return flow to the pump inlet** in a gear-pump arrangement.

The EEC monitors **Engine Pressure Ratio (EPR)**, **TLA**, **Mach number**, **engine inlet pressure** and **engine inlet temperature**. It alters the engine-control command so that **thrust stays constant** despite changes in temperature, pressure or other flight conditions.

A defining feature of this supervisory arrangement is **manual reversion**: if the EEC develops a fault, the engine can return to manual control.

> **Image Generation Prompt — Figure 26.4 Supervisory EEC**
>
> Create a faithful reconstruction of the original **Supervisory EEC** illustration on a flat pale-blue horizontal rectangle. Three main photographic/technical elements appear: a white passenger jet in side view near the **upper left/center**, a grey metal **EEC/engine-control box** at **lower left**, and a cutaway turbofan engine at **right**. A simple gray cockpit throttle handle and **Mechanical Throttle Linkage** descend on the left to the control box. Draw fine **red connector lines** with red terminal dots from labels and the aircraft/engine sensors to the box. Preserve each original boxed annotation and its position: **Throttle Lever Angle** above the aircraft; **Mechanical Throttle Linkage** on far left; **Mach No.** in the middle-left; **Maintains thrust constant regardless of temperature or pressure change** in a central box; and **T₁**, **P₁**, **EPR** adjacent to three respective engine sensing points. The engine cutaway must show compressor and turbine stages and the flight aircraft and box must remain distinct elements, not combined. Match label positioning, leader-line crossings, scale and muted blue/gray color balance. Caption exactly **Figure 26.4 Supervisory EEC**.

### 3.3 Full Authority Digital Engine Control (FADEC)

Earlier **hydro-mechanical FCUs** combined the throttle mechanism, HP fuel cock, governor and other regulators in an engine-mounted unit controlled from the flight deck through mechanical connections.

As electronics developed, computer-controlled systems progressively replaced many of those mechanical control functions. Initially, an electronic system with **one control channel** was used principally in a **supervisory** capacity: its computer could manage fuel and engine settings, but because long-term electronic reliability had not been fully demonstrated, the pilot retained the option of returning to the mechanical system.

Later designs adopted **two-channel FADEC**, making the electronic controls the **sole authority** for engine management. With reliable redundant channels, **modern FADEC has no manual control reversion**. The flight crew can still command engine shutdown, but cannot directly override the FADEC's regulation of engine operation.

> **Image Generation Prompt — Figure 26.5 FADEC**
>
> Reproduce a wide pale-blue illustrated system diagram captioned **Figure 26.5 FADEC**, using the same visual family and side-view jet and cutaway engine as Figure 26.4 but **without the mechanical throttle linkage**. Place the white/gray airliner horizontally near the **upper left**, an electronic black/gray multi-connector **FADEC controller** in the **lower center**, and the cutaway turbofan engine spanning the **right half**. Above the aircraft draw the black throttle lever and the boxed label **Throttle Lever Angle**. Along the far left stack seven small boxed inputs with exact text **Mach No.**, **ALT**, **Ambient Temp**, **Inlet Temp**, **Air Density**, **FMS**; join them using neat red horizontal/vertical signal lines to the controller. From the controller, fan several thin red lines to specific compressor/turbine sensing locations on the engine. Preserve engine-sensor labels **P₁**, **T₁**, **N₁**, **N₂**, **N₃**, **P₃**, **T₃** and **T OIL**/**Tₒᵢₗ** as visible; retain the engine cross-section and the red sensor dots. Show the original relative positions, differing line lengths, and all arrows/labels; do not add decorative icons or extra labels. Caption exactly **Figure 26.5 FADEC**.

### 3.4 Dual-channel architecture, monitoring and redundancy

A typical FADEC packages two independent **Electronic Engine Control (EEC)** channels in one installation, designated **A** and **B**. Either channel can perform all the essential monitoring and control functions, so **only one needs to be healthy enough to command the engine**.

Both channels independently process the available engine and flight information, including **throttle position**, **outside-air temperature**, **EGT** and the other parameters required for engine control. They compare their results with one another and with **manufacturer-programmed operating limits**.

Each channel has a continuous **Built-In Test Equipment (BITE)** function. BITE monitors EEC inputs and outputs, identifies faults and helps isolate failures. The channel judged to be in the **better operating condition** assumes command. Command can pass between the two if the standby channel becomes healthier than the active channel.

An EEC channel can still remain functional when **some internal elements have failed**. When incoming data is missing, invalid or outside its permitted range, the controlling channel can replace it with a suitable **stored default value**. This fault tolerance is one reason the two-channel system does not require a manual fallback.

### 3.5 Engine and accessory regulation

After evaluating its inputs, the active EEC continuously regulates **fuel and airflow**, including the relevant pressures and temperatures, throughout engine start, normal running and shutdown. It works to achieve the demanded performance while protecting the engine against **structural** and **operating** limit exceedances.

The EEC can operate or command the following equipment as needed:

- **Igniter systems**.
- **Variable inlet guide vanes**.
- **Variable stator vanes**.
- **Compressor bleed valves**.
- **Active clearance-control systems**.
- **Thrust reversers**, where installed.

Accurate coordination of these devices improves engine efficiency, lowers operating costs, reduces damaging operating conditions, can extend engine life and reduces the number of engine-management tasks required of the crew.

If an actuator or control fails to perform a requested action, the controlling EEC attempts to move the affected system to its **fail-safe or safest attainable condition**. It also generates a suitable warning for the aircraft's centralized warning display. For example, a **compressor bleed valve** that will not respond correctly may be commanded toward a safer position while a **bleed-valve failure** is indicated through **ECAM/EICAS**.

### 3.6 Typical FADEC installation equipment

A typical FADEC installation includes:

1. **Pilot thrust-lever input**, communicating **TLA** to the EEC.
2. **Cockpit displays**, described here as **CRT displays**, capable of showing **EPR, N₁, N₂, N₃, EGT, fuel flow (FF), vibration (VIB)** and **oil pressure**.
3. A **dual-channel EEC** controller.
4. A **dedicated engine-driven alternator** for the principal electrical supply.
5. **Actuators** for the **variable inlet guide vanes (VIGV)**, **variable stator vanes (VSV)**, **active clearance system (ACS)** and **bleed valves**.
6. **Position feedback** from controlled engine subsystems to the EEC.
7. A **Fuel Metering Unit (FMU)** incorporating the **HP fuel pump**.
8. An interface for **thrust-reverser control**, if the aircraft is equipped with reversers.
9. An **Engine Health Monitoring (EHM)** and **data-collection** capability.
10. **Sensors** providing engine-parameter feedback.

> **Image Generation Prompt — Figure 26.6 A typical FADEC structure**
>
> Generate a very accurate landscape technical **FADEC functional block diagram** on white, captioned exactly **Figure 26.6 A typical FADEC structure**. The diagram has a central orange rectangular block **EEC (dual channel)**; immediately beneath it two adjacent green/lime blocks **Power converter (A & B)** and **Overspeed protection (A&B)** enclosed within a larger orange control unit. On the upper boundary is a dashed horizontal line labelled **Interface**, with **Aircraft I/O** connected by a vertical red double-arrow above the EEC and **Master lever** shown at upper right with a circular red lever symbol. Arrange yellow square/rectangular system blocks around the EEC in the same original positions: left **IDG AOHE**, **T/R system**, **ECS HP valve**, **Engine sensors**; upper/right **Starter control valve**, **LP Comp speed N1**, **Ignition system**, **IP Comp speed N2**, **Dedicated alternator**, **LP turbine speed N1**; lower-left **Turbine case cooling**, **Data entry plug**. In the lower portion, depict blue fuel-flow arrows through four yellow blocks in exact sequence **LP fuel pump → HP fuel pump → Fuel metering unit → Fuel flow meter → To fuel spray nozzles**. Beneath this path retain **FOHE** and connecting blue fuel arrows; below/right place **VSV system** and **Bleed valve system**. A red network of thin directional arrows connects sensor/actuator blocks and returns to EEC; use red for **Electrical** signals and blue arrows for **Fuel** as in the bottom-right legend. Include the characteristic loop from the master lever, and preserve the original straight/right-angle wiring, all block names, arrowheads and relative geometry. Flat engineering vector style with black text, saturated yellow modules, orange EEC, green/yellow protection sections and no invented components.

### 3.7 Main FADEC inputs and fuel metering

For thrust control, the principal commands are the **pilot's thrust-lever angle (TLA)** and a target **EPR or N₁** supplied through the **Flight Management System (FMS)**.

Rather than relying on a traditional hydro-mechanical fuel-pump control, the EEC commands a **Fuel Metering Valve (FMV)** within the **Fuel Metering Unit (FMU)**. The metering/bypass action sets the fuel delivery reaching the burners. Fuel not required for combustion is returned to the **low-pressure side** of the system.

Other important FADEC inputs are:

- **Altitude**, from ground level upwards.
- **Mach number**.
- **Ambient temperature**.
- **Engine air-inlet temperature**.
- **Air demand from compressor bleed systems**.
- **Exhaust gas temperature (EGT)**.

### 3.8 Functions performed by FADEC

#### Engine control and overspeed protection

The EEC manages **fuel delivery in every stage of flight**, controls the engine's required power and operates the **FMV** within the FMU. These controls also provide protection against excessive rotational speeds.

#### Engine stall and surge protection

The EEC can control the devices that maintain stable compressor operation and manage clearances:

- **Variable bleed valves (VBV)**.
- **Variable stator vanes (VSV)**.
- **Rotor active clearance control and start bleed (RACSB)**, where installed.
- **High-pressure turbine active clearance control (HPTACC)**, where installed.
- **Low-pressure turbine active clearance control (LPTACC)**, where installed.

#### Engine–aircraft integration

FADEC also supports:

- **Automatic and manual engine starting and restarting**.
- **Thrust-reverser operation**.
- **Autothrust**.
- **Engine indications** and the collection of maintenance data.
- **Condition-monitoring data collection**.

### 3.9 Engine shutdown protection

The FADEC may initiate the protective sequence for an **Engine Shutdown (ESD)** when specified limits are exceeded. The listed conditions are exceedances involving:

- **N₁**.
- **N₂**.
- **Acceleration**.
- **EGT**.

**Final engine shutdown remains a pilot action** in this arrangement.

### 3.10 Operation through the phases of flight

Before departure, the crew enters the flight details into the **FMS**. It takes account of operating and environmental conditions, including **temperature, wind, runway length, runway condition and intended cruising altitude**, and computes the engine-power settings required during the flight.

For take-off, the pilots advance the thrust levers to the **take-off detent**, or select an **autothrottle take-off mode** if available. The movement sends an **electrical command** to the engine-control computer; it does **not** operate a direct mechanical linkage to the engine fuel control. FADEC computes and applies the necessary **take-off thrust**.

As the flight continues, it similarly calculates or applies appropriate power during **climb, cruise** and other phases, making frequent fine adjustments to keep engine operation efficient.

In an emergency, advancing the thrust lever fully requests the **maximum available thrust**, but the FADEC still controls engine acceleration and prevents operating limits from being exceeded. The crew cannot manually override the FADEC fuel-management decisions, although the ability to **shut down the engine manually** remains.

FADEC is employed on **almost all current-generation jet engines** and is increasingly used on **newer piston engines** in fixed-wing aircraft and helicopters.

## 4. The Advantages of the FADEC System

- **More efficient engine operation**, owing to accurate fuel-flow control and coordination of engine functions.
- **Automatic engine protection**, helping prevent operation beyond permissible limits.
- **Fault-tolerant operation**, allowing the system to continue functioning despite certain degraded components or signals.
- **Redundancy and safety**, provided by the two independent control channels and the multiple input signals used for comparison and backup.
- **Assisted engine starts and relights**, including semi-automatic starting/restarting and the ability to **abort or recycle** a start sequence.
- **Improved engine–airframe integration**, coordinating control and aircraft functions.
- **Long-term engine health monitoring** and useful fault-diagnostic records.
- **Reduced flight-crew monitoring burden**, since fewer parameters require continuous direct attention.
- **Automatic responses to abnormal conditions**, such as increasing thrust when necessary to help avert an aerodynamic stall.

## 5. The Disadvantages of the FADEC System

A genuine **full-authority digital engine-control system offers no manual override** of its engine-management functions. As a result, a **total FADEC failure** leads to engine failure: the pilot cannot take over fuel-metering control directly and has no remaining manual engine-management option other than commanding shutdown.

This makes complete loss of the control system a potentially serious **single-point failure concern**. The risk is reduced through **built-in redundancy**, particularly the use of independent control channels and other backup features.

## 6. Questions

**1. Which air supply provides heat for the engine's fuel heater?**

   a. Air from the air-conditioning system  
   b. Air delivered by the compressor  
   c. Air from the bootstrap unit  
   d. Air taken from the turbine

**2. Fuel heating is used to help prevent:**

   a. Wax formation  
   b. Loss of fuel through vaporization  
   c. Making the fuel more viscous  
   d. Flow of fuel in all operating conditions

**3. Where are the fuel booster pumps installed?**

   a. Inside the fuel tanks  
   b. In the supply pipe between the tanks and engines  
   c. On the LP side of the engine  
   d. On the HP side of the engine

**4. In a fuel-cooled oil cooler, which relationship is maintained between oil and fuel pressures?**

   a. Fuel pressure is higher than oil pressure  
   b. Oil pressure is lower than fuel pressure  
   c. Fuel and oil pressures are equal  
   d. Oil pressure is higher than fuel pressure

**5. On a high-bypass engine, the fuel pumps are driven by the:**

   a. High-pressure turbine  
   b. High-pressure compressor  
   c. Low-pressure compressor  
   d. Intermediate-pressure compressor

**6. What response occurs when the high-pressure compressor outlet pressure exceeds its permissible maximum?**

   a. A pressure sensor signals the FCU, which reduces fuel flow and engine rpm  
   b. A pressure sensor signals the FCU, which increases fuel flow and engine rpm  
   c. A pressure signal opens a bleed valve to release excess air volume  
   d. A pressure signal opens a bleed valve to discharge excess pressure

**7. Which device is normally used to stop a gas-turbine engine?**

   a. The LP fuel shut-off valve  
   b. The tank booster-pump switches  
   c. The HP fuel shut-off valve  
   d. The engine's electrical isolation device

**8. Which statement correctly describes the combustion-chamber drain arrangement?**

   a. With the engine running, a pressure-operated non-return valve closes the combustion-chamber drain  
   b. With the engine running, a pressure-operated non-return valve opens the drains tank  
   c. At shutdown, the drains tank closes to avoid losing fuel  
   d. After shutdown, remaining fuel is siphoned straight back into the main tanks

**9. Where is the fuel flowmeter installed?**

   a. Between the LP pump and the fuel-cooled oil cooler  
   b. Between the LP and HP pumps  
   c. Immediately downstream of the FCU  
   d. Between the HP shut-off valve and the fuel nozzles

**10. If turbine temperature becomes excessive, how is fuel flow reduced?**

   a. The thermocouple sends its electrical output directly to the FCU  
   b. The thermocouple signal is amplified and then used to command a fuel-flow reduction  
   c. The pilot must observe the temperature and manually reduce the throttle  
   d. The pilot must increase rpm to produce more cooling airflow

**11. An aircraft is at FL420 when all tank booster pumps feeding an engine stop working. What is the likely result?**

   a. The engine shuts down immediately  
   b. The LP pump may continue drawing fuel, but low inlet pressure and the resulting lower boiling point introduce a cavitation risk  
   c. The LP pump may continue drawing fuel, but low pressure and an increased fuel boiling point introduce a cavitation risk  
   d. The LP pump may continue drawing fuel, but higher pressure and an increased boiling point introduce a cavitation risk

**12. What is the effect of a fuel-cooled oil cooler?**

   a. It warms the oil and cools the fuel  
   b. It warms the fuel only  
   c. It cools the oil only  
   d. It warms the fuel while cooling the oil

**13. On a cold day, how would the idle speed of a gas turbine change if its fuel control unit did not compensate for temperature?**

   a. Idle speed would remain unchanged  
   b. Idle speed would increase  
   c. Idle speed would decrease  
   d. Idle speed would rise by no more than 4%

## 7. Answers

| Question | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Answer | b | a | a | d | b | a | c | a | d | b | b | d | c |
