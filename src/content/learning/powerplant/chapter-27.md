# Chapter 27: Gas Turbines — Bleed Air

## 1. Bleed Air and Its Uses

**Bleed air** is compressed air diverted from a gas-turbine engine before it reaches the main combustion and turbine flow path. It performs two broad functions: it supplies air for **cooling and sealing inside the engine**, and it provides a source of pressurized air for **systems elsewhere on the aircraft**.

On a modern turbofan, externally supplied bleed air may be required for:

1. **Cabin air conditioning and pressurization.**
2. **Pressurizing hydraulic reservoirs.**
3. **Pressurizing domestic-water tanks.**
4. **Operating thrust reversers.**
5. **Driving an air turbine motor (ATM)** connected to a hydraulic pump or an electrical generator.
6. **Anti-icing of the engine and airframe.**
7. **Heating fuel.**

### 1.1 Low-pressure and high-pressure supplies

The external pneumatic system normally receives air from **two compressor locations**:

- A **low-pressure (LP) source** at the discharge of the LP compressor supplies bleed air continuously during normal operation.
- A **high-pressure (HP) source** at the HP compressor supplements the LP supply whenever the available LP pressure is inadequate.

At **high engine power**, the LP compressor can generally provide sufficient pressure for the air-conditioning and pressurization system without help from the HP source. When engine power is reduced, the LP bleed pressure also falls. The **HP bleed valve** then opens as necessary to maintain the airflow and pressure required by the aircraft system.

Selection of **airframe anti-icing** normally also schedules the HP bleed valve to open. In this case, the system needs air at an elevated temperature: air removed from a compressor at a higher pressure is also hotter.

### 1.2 Isolation, cooling and distribution

An **isolation valve**, controlled from the flight-deck bleed-air panel, allows the engine's bleed supply to be shut off. It also closes when the **engine fire handle** is operated, preventing that engine from continuing to feed the aircraft pneumatic network during a fire-isolation procedure.

Before reaching the users, hot engine bleed air can be passed through a **pre-cooler**. Cooling air from the turbofan's **fan outlet** passes through this heat exchanger and removes heat from the bleed supply. Fan air may additionally be directed to **constant-speed drive unit (CSDU) coolers** and **engine-oil coolers**.

The conditioned air routed toward the cabin passes through **pack flow-control valves**. These allow the crew to control air-conditioning pack operation and isolate an individual pack if a fault occurs, particularly where **smoke in the cabin** is involved.

During **ground de-icing**, air-conditioning bleed-air supplies from the main engines or the **auxiliary power unit (APU)** must be closed to avoid drawing harmful de-icing fumes into the occupied cabin.

### 1.3 Effect of extracting compressor air

Removing compressed air from the engine reduces the **mass flow continuing through its gas path**. The extraction also reduces the cooling airflow available to the combustion-chamber region. It therefore carries a performance penalty rather than providing a free supply of pneumatic energy.

The effects identified for bleed-air extraction are:

- **Reduced thrust** from the engine.
- **Increased engine rotational speed (rpm).**
- **Higher exhaust gas temperature (EGT).**
- **Higher specific fuel consumption (SFC).**
- **Lower engine pressure ratio (EPR).**

These changes explain why the operation of pneumatic consumers, especially anti-icing, must be taken into account when evaluating engine performance.

## 2. Internal Air

Compressor air is also routed through passages **within the engine** rather than to the external pneumatic distribution system. It is used to cool the **combustion chamber**, **turbine blades** and other hot components, and to maintain effective seals around **bearing chambers** and **turbine-disc spaces**.

> **Image Generation Prompt — Figure 27.1**
>
> Reconstruct the original full-color aircraft **bleed-air distribution system** diagram as a tall, fine-lined technical schematic on a white background, surrounded by a narrow gray rectangular border. At the top, show a left-facing side silhouette of a twin-engine passenger jet with a red horizontal duct across its upper fuselage marked exactly **OVERHEAD DISTRIBUTION DUCT**. Below it, build a branching **yellow cabin-air network** centered on a large yellow circle marked **MIX MANIFOLD**; include upward black airflow arrows and a **RECIRC. FAN** with its downward yellow-arrow branch. A pair of rectangular boxes must read **LEFT AIR COND. PACK** and **RIGHT AIR COND. PACK**, connected down to two thick **red pneumatic supply trunks**. Put **GROUND PRE-CONDITIONED AIR** and **PACK VALVES**, with small rectangular valve symbols labelled **L** and **R**, between the packs. Show the two red trunks joined through an **ISOLATION VALVE**, and correctly arrange the side branches labelled **HYD. RES**, **WATER TANK**, **STARTER VALVE**, and **WING AND TAIL UNIT ANTI-ICING**. At the lower edge draw two simplified engine nacelles, each linked by red bleed pipes; the left engine is labelled **5TH STAGE**, **9TH STAGE** and **ENGINE LOW PRESSURE BLEED AIR CONTROL VALVE**. Include the **APU** connection and **GROUND SERVICE PNEUMATIC CONNECTION** at the bottom center/right. Show **PRE-COOLER** components as small light-gray exchanger rectangles beside each engine with adjacent dark-blue **FAN AIR** ducts, blue fan-air arrows and **PRE-COOLER CONTROL VALVE** symbols. Also show the **HP SHUT OFF VALVE** label and arrow at the right engine. Preserve the original red, yellow and blue conduit colors; every valve icon, black directional arrow, branch junction and original label should be legible and in the same relative positions. Keep the original figure caption directly below: **Figure 27.1**.

Air pressure increases as the air moves through successive compressor stages because energy is being transferred to it. To avoid using more compressor work than necessary, cooling or sealing air is therefore taken from the **earliest compressor stage with sufficient pressure** to perform the required task.

After passing through an internal cooling or sealing passage, the air may be **released overboard** or **returned to the principal gas stream**. Where it re-enters the gas path at the highest practicable pressure, some of the energy spent compressing it can be recovered as a small performance benefit.

## 3. Cooling

The components most in need of cooling are the **combustion chamber** and **turbine assembly**. The combustion-chamber cooling arrangement provides protection against combustion temperatures; in the turbine section, compressor air must protect blades, nozzle guide vanes and discs while these components operate in an extremely hot gas stream.

### 3.1 Temperature limits and thermal efficiency

A gas turbine is a **heat engine**. Achieving a higher **turbine-entry temperature** is an important means of improving its thermal efficiency, but the maximum permissible temperature is constrained by the materials used in the **turbine blades** and **nozzle guide vanes**.

With continuous, effective cooling, these components can operate in a gas environment **hotter than the melting point of the material from which they are manufactured**, while the material itself is kept sufficiently cool. Without this protection, prolonged high temperature can cause damage, including **creep**.

The **turbine discs** also need protection. Heat travels from the attached turbine blades into the discs by conduction. If disc temperature and repeated expansion or contraction are not controlled, thermal stresses can ultimately lead to failure or even disc disintegration.

Cooling air serves two additional functions on some modern turbofan engines:

- **Active turbine-tip clearance control:** By adjusting turbine-casing temperature, airflow helps control the gap between blade tips and the casing.
- **Compressor-rotor cooling:** Selective cooling limits the thermal expansion of compressor blades and helps maintain compressor efficiency.

### 3.2 Turbine Blade Cooling

Early turbine blades could be protected by a comparatively simple system in which **LP compressor air passed once through an internal passage**. This **single-pass internal cooling** kept blade temperature low enough to avoid excessive creep at the operating temperatures then in use.

As greater engine power and efficiency demanded hotter turbine gases, **LP air alone became insufficient**. Designers introduced **multi-feed cooling**, routing **HP compressor air as well as LP air** through the blades. The additional cooling allowed a higher gas temperature before blade failure became a problem.

The next development was **film cooling**. Small openings in the **leading and trailing edges** permitted cooling air to flow out over the blade surface, creating a protective layer between the hot mainstream gases and the blade material. For a period this combined arrangement of internal air supply and external surface cooling met engine requirements, but further increases in performance demanded more effective blade designs.

Rather than allowing cooling air to travel through a blade only once, engineers arranged for it to make **multiple passes**. The cooling effect improved, and the arrangement described as the optimum development was a **five-pass, or quintuple-pass, internal circuit**. This was combined with **multiple air feeds** and **extensive film cooling** to provide the advanced turbine-blade cooling arrangement described here.

> **Image Generation Prompt — Figure 27.2 The development of turbine blade cooling**
>
> Reproduce the original **three-panel comparative turbine-blade engineering illustration** inside one wide, light-gray-bordered horizontal rectangle on a clean white background. Each panel shows the *same gray metallic turbine rotor blade* in an identical upright three-quarter view with a fir-tree root at the bottom and a blade tip at the top. The left-hand blade is a comparatively plain, solid-looking gray airfoil with **blue upward arrows leaving the tip** and blue arrows entering through its root, illustrating a single internal passage. The middle blade has two sources at the root—**blue and red arrows**—plus small black perforations running vertically near both airfoil edges; red arrows point sideways inside its body, blue arrows emerge from the side holes and tip, and a red arrow exits above the tip. The right-hand blade is visibly cut away to expose a complex **red serpentine five-pass internal passage**; use multiple red arrows exiting the tip, blue arrows exiting many rows of surface cooling holes and blue/red feed arrows at the fir-tree root. Preserve each blade's proportions, relative scale, gray shading, color-coded flow arrows, placement of small cooling holes and its original three exact uppercase descriptions: **SINGLE PASS WITH INTERNAL COOLING (1960s)**; **SINGLE PASS, MULTI-FEED INTERNAL COOLING WITH FILM COOLING (1970s)**; and **QUINTUPLE PASS, MULTI-FEED INTERNAL COOLING WITH EXTENSIVE FILM COOLING**. Center the original caption under the frame exactly: **Figure 27.2 The development of turbine blade cooling**.

### 3.3 Nozzle Guide Vane Cooling

**Nozzle guide vanes** receive cooling by methods broadly similar to those used on the turbine rotor blades. The essential difference in the described system is that the vanes use **HP compressor air only** rather than a combination of high- and low-pressure sources.

The HP air passes through the vane interiors, and **film cooling** adds a protective layer of air over the surfaces exposed to hot gases.

### 3.4 Turbine Disc Cooling

In most gas-turbine designs, turbine blades are attached to **turbine discs**. Since heat is conducted into the disc from the blades, the disc must be cooled to avoid excessive temperature cycling and **thermal fatigue**.

**HP compressor air** is directed along the **front and rear faces** of each turbine disc. The pressure maintained in the spaces around the discs is regulated by **interstage seals**, controlling how the cooling air passes between disc cavities.

> **Image Generation Prompt — Figure 27.3 Cooling & sealing within the turbine area.**
>
> Draw a high-fidelity, wide **longitudinal cross-section of a gas turbine's turbine-and-bearing region**, preserving the original component geometry and coloring. Use a white background and a pale orange/tan interior engine cavity; show a left-to-right sequence of **nozzle guide vanes**, **turbine blades**, blade roots, turbine disc webs, rotor shafts and labyrinth seals, all with precise gray/bronze metallic shading. Place the large original upper labels **LP AIR OVERBOARD** on the left, **NOZZLE GUIDE VANES** above the first vane rows, and **TURBINE BLADES** above the rotor blades; use long thin blue leader lines pointing to each associated part. At the lower center put **INTERSTAGE SEALS** with two long blue pointer lines to the stepped seals beneath the disc cavities. Show a light-blue vertical LP-air escape duct at far left with three or four upward light-blue arrows and matching smaller low-pressure arrows at the lower left. Show extensive **bright red high-pressure cooling-air arrows** through the vane passages, out the vane film holes, across turbine blade surfaces, up and around both front and rear turbine-disc faces and through the cavities and seals. Include horizontal shafts, fine black contours, brown/orange hatched sealing regions and correct direction changes of every red arrow. At the bottom left, retain the original two-color legend with a light-cyan square labelled **LOW PRESSURE AIR** and a red square labelled **HIGH PRESSURE AIR**. Keep the source drawing's landscape format, complexity, relative spacing and exact caption: **Figure 27.3 Cooling & sealing within the turbine area.**

## 4. Sealing

Engine internal seals are fitted wherever it is necessary to prevent **air or oil from entering the wrong compartment**. Different seal designs are available, but many operate as **labyrinth seals**, in which a series of closely spaced fins forces a leakage flow to negotiate a restricted path.

### 4.1 Labyrinth seals

A typical labyrinth arrangement has **rotating fins** running close to an annular sealing surface. In one version, the fins run near an **annulus of oil**; where the opposing portion is stationary, the annulus can instead be lined with **soft abradable material** or a **honeycomb structure**.

With an abradable or honeycomb liner, initial engine operation allows the fins to touch and remove a small amount of the sealing material. This produces a very close running clearance. During normal operation, **pressure falls across each successive fin**, making air leakage through the seal much more difficult.

When this sealing method is used on a **bearing chamber**, air is arranged to flow **from outside the chamber toward its interior**. The air-pressure barrier restricts outward oil leakage and also produces a positive internal pressure that assists the **oil-scavenge return**.

### 4.2 Seals between rotating shafts

Sealing becomes more difficult between **two independently rotating shafts**. The shafts can flex in service, and direct rubbing between a moving fin and a solid abradable face could create considerable frictional heat. The resulting temperature rise could damage the components and potentially cause **shaft failure**.

An **intershaft hydraulic seal** avoids that problem by allowing the fins to run very close to the surface of an **oil-filled annulus**. If a shaft deflects, its fins can move into the oil while the seal remains effective without creating the damaging solid-to-solid friction associated with a conventional abradable contact.

The air supporting these bearing-chamber seals originates in the **intermediate compressor stages**. It enters through **air-transfer ports in the compressor rotor drum** and then moves through internal communicating passages to the compartments requiring sealing.

> **Image Generation Prompt — Figure 27.4 Types of interstage & intershaft seals**
>
> Produce a precise **two-panel technical schematic** contained within a wide, thin gray rectangular border on white. The **left panel** is a simplified cross-section of an **INTERSTAGE (LABYRINTH) AIR SEAL**, drawn with a pale blue L-shaped/curved air passage, an upper dark-gray stationary stepped bar and a row of small pointed gray fins reaching down into the light-blue clearance path. Show multiple **red sealing-air arrows** entering through the lower center and moving through the fin labyrinth to the upper left and right; label the lower supply **SEALING AIR**. The **right panel** shows a section through an **INTERSTAGE HYDRAULIC SEAL** as written in the original image: two mirror-image upper and lower dark-gray/black shaft and sealing units enclosing a rectangular gray shaft space. Each half has a gold/brown oil annulus, black L-shaped seal boundary and one circular gray metallic component. Two **orange horizontal arrows** point from left to right into the top and bottom seals; each is labelled exactly **SEALING AIR**. Preserve the tiny golden oil droplets near the outer right edges and the same balanced spacing between the two arrangements. Beneath each panel retain its uppercase original title, respectively **INTERSTAGE (LABYRINTH) AIR SEAL** and **INTERSTAGE HYDRAULIC SEAL**. Under the complete drawing print exactly: **Figure 27.4 Types of interstage & intershaft seals**. Keep clean engineering-diagram linework and do not add any labels or components not present in the illustration.

### 4.3 Interstage pressure control

**Interstage seals** are used between regions of the engine that work at **different air pressures**. They prevent leakage or limit its rate. Each fin in the leakage path imposes some pressure loss, so the **number of fins** determines how much total pressure is lost before air reaches the adjoining cavity.

If one region must be kept at a higher pressure than another, the design can arrange **fewer sealing fins on the path feeding the higher-pressure region** and **more fins on the path feeding the lower-pressure region**. Air entering the first cavity then undergoes a smaller pressure drop.

The performance of these seals depends on both their **mechanical construction** and the **availability of the required sealing-air pressure**. The pressure contribution is especially important at low engine power. Even a serviceable engine may lose its greatest amount of oil when operating at **idle during a descent from high altitude**, because sealing air pressure is reduced. At **high power settings**, oil loss from a serviceable engine is almost negligible.

## 5. Disposal of Cooling and Sealing Air

Internal cooling and sealing air must leave the protected components after it has served its purpose. The two pressure sources follow different discharge arrangements:

- **HP air** that has cooled the turbine components is generally **reintroduced into the exhaust gas stream**.
- **LP air** is carried away through its **own dedicated vent pipe** and discharged separately.

On some engines, the **temperature of the LP air leaving the vent** is monitored as an indication of the integrity of the engine's internal structure. A temperature sensor detects when this airflow exceeds a **predetermined maximum**.

An excessive temperature activates a **red warning light** marked **IEOH — Internal Engine Overheat**. An **IEOH warning requires engine shutdown**; it is not merely an instruction to monitor the engine more closely or reduce power.

## Questions

**1.** Under which condition is an interstage air seal required?

- a. Between engine sections operating at different air pressures.
- b. Between engine sections having identical pressures.
- c. Wherever the installation makes sealing convenient.
- d. Where a component cannot easily be reached during servicing.

**2.** What action is required when an Internal Engine Overheat warning appears?

- a. Observe oil temperature particularly closely.
- b. Monitor exhaust gas temperature for further changes.
- c. Reduce engine power to idle.
- d. Shut the engine down.

**3.** Where is the cooling air for turbine blades obtained?

- a. From compressor air carried through passages inside the blades.
- b. From the combustion chambers at high pressure.
- c. From the intake airflow upstream of the inlet guide vanes.
- d. Only from intermediate-pressure bleed valves.

**4.** The hot air used for engine anti-icing is supplied from which section?

- a. The bleed-valve bodies themselves.
- b. The turbine stages.
- c. The compressor.
- d. The combustion chambers.

**5.** In addition to its mechanical design, what determines the effectiveness of a bearing-chamber oil seal?

- a. Fuel pressure.
- b. Compressor bleed-air pressure.
- c. Overall engine compression ratio.
- d. Lubricating-oil pressure.

**6.** If bleed-air anti-icing is switched on while the same thrust is maintained, what happens to specific fuel consumption?

- a. Overall fuel consumption falls.
- b. Specific fuel consumption decreases.
- c. Specific fuel consumption increases.
- d. Specific fuel consumption remains unchanged.

**7.** Which ice-removal method is normally used by modern jet aircraft?

- a. Hot-air heating.
- b. Inflatable rubber boots.
- c. Electrical thermal blankets.
- d. Freezing-point-depressant liquid.

**8.** What happens to EGT when engine bleed-air anti-icing is selected on?

- a. It decreases.
- b. It increases.
- c. It remains unchanged.
- d. The exhaust-to-intake pressure ratio increases.

**9.** Which description best matches the air supplied by the engine for air conditioning?

- a. High pressure, low volume.
- b. High pressure, high volume.
- c. Low pressure, low volume.
- d. Low pressure, high volume.

## Answers

| Question | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| Answer | a | d | a | c | b | c | a | b | d |
