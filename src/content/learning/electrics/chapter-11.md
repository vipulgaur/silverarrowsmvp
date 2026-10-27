# Chapter 11 — AC Electrics: Introduction to AC

## 1\. Why Aircraft Use Alternating Current

Modern transport aircraft commonly obtain most electrical power from **alternating-current (AC) systems**. Compared with traditional direct-current (DC) generation and distribution, AC provides several important engineering advantages:

* **Simpler generators:** An AC generator does not need the commutator arrangement of a conventional DC generator, reducing mechanical complexity and improving robustness.
* **Improved power-to-mass ratio:** For comparable output, an AC machine can generally offer a more favourable relationship between electrical power and equipment weight.
* **Convenient voltage conversion:** Transformers allow AC voltage to be increased or decreased very efficiently, approaching 100% efficiency in the idealized treatment used here.
* **DC supplies from AC:** A **transformer rectifier unit (TRU)** can step AC voltage to a suitable value and rectify it to obtain DC for equipment requiring that form of supply.
* **Effective motor systems:** Three-phase AC motors can be mechanically straightforward, durable and efficient when supplied with AC at the appropriate frequency.
* **No commutator problems:** Eliminating commutation difficulties improves machine reliability, particularly in demanding operating conditions such as high altitude.
* **Less heavy cabling for a given transferred power:** Higher-voltage AC distribution allows a lower current for comparable power, which can reduce conductor size and cable weight relative to a low-voltage DC system.

These benefits help explain why many large aircraft use AC generation and distribution while continuing to supply DC to particular loads where needed.

## 2\. What Makes Current Alternate?

In a DC circuit, the direction of charge flow is maintained. With **alternating current**, the direction reverses repeatedly: electrons move one way and then the other about an average position. Both the magnitude and polarity of the electrical supply therefore change with time.

### 2.1 The basic alternator arrangement

Consider a rectangular loop of conducting wire rotating between the north and south poles of a magnet. The loop is the **armature**. As it turns, the magnetic flux linked with it changes, producing an induced **electromotive force (EMF)**. The magnitude of that voltage depends on how rapidly the magnetic flux changes; rotation speed and magnetic-field strength are therefore important.

The wire loop is connected to an external electrical **load** by two **slip rings** and stationary **carbon brushes**. Unlike a commutator, the slip rings maintain connections without reversing them mechanically. As long as the armature continues rotating and the circuit is complete, the induced voltage causes an alternating current through the load.

> \*\*Image-generation prompt — Figure 11.1 Simple AC generator\*\*
>
> Reconstruct a clean, white-background technical illustration of a simple rotating-coil AC generator, matching the source figure's oblique 3D view. Show a large grey magnetic north pole \*\*N\*\* above and a matching south pole \*\*S\*\* below, separated by an air gap; black arrows pass vertically down through the gap and a small label \*\*“Magnetic field”\*\* points into it. Place a thin rectangular multi-colour \*\*“Armature loop”\*\* in the gap, mounted diagonally on a rotating shaft. At the lower-left end of the shaft show two separate circular \*\*“Slip ring”\*\* contacts and a stationary \*\*“Carbon brush”\*\* touching them. A red external wire connects the brush assembly to a zigzag resistor labelled \*\*“Load”\*\* at far left. Preserve the blue/red/yellow line treatment, the N and S letters, the relative locations and the original caption \*\*“Figure 11.1 Simple AC generator”\*\*. Avoid additional components or labels.

### 2.2 Why the voltage rises, falls and reverses

The changing induced voltage can be followed through five positions of the loop:

1. **Position 1 — zero induction:** The active sides of the loop travel along the magnetic-field direction rather than cutting across it effectively, so the induced EMF is zero.
2. **Position 2 — positive maximum:** The conductors cut the flux at the greatest rate, giving the largest induced voltage in one direction.
3. **Position 3 — zero crossing:** The geometry again produces no instantaneous EMF.
4. **Position 4 — negative maximum:** Maximum flux cutting occurs again, but conductor motion relative to the field is reversed, so voltage and current have the opposite polarity.
5. **Position 5 — return to zero:** The loop returns to its starting electrical position, completing the cycle.

Between these positions, induced EMF changes smoothly. **Fleming's right-hand rule** gives the direction of the induced current for a generator conductor moving through a magnetic field. After every half-revolution the output polarity has changed; after one full revolution the electrical cycle repeats for this simple two-pole example.

> \*\*Image-generation prompt — Figure 11.2 Production of AC\*\*
>
> Produce an instructional two-tier figure on white. Across the upper tier, position \*\*five small stages numbered 1, 2, 3, 4 and 5\*\*, each illustrating a rectangular coloured conductor in the gap between red \*\*N\*\* and red \*\*S\*\* magnetic poles, with the loop orientations progressing through one full mechanical revolution; use the original miniature colour accents and arrow indications. Below, align a large blue \*\*sine-wave EMF graph\*\* with these stages, starting at zero, rising to a positive crest, crossing zero at 180°, reaching a negative trough at 270°, and returning to zero at 360°. Label the vertical direction \*\*“EMF”\*\* and the horizontal direction \*\*“Phase Angle”\*\*, and retain angle markings 0°, 90°, 180°, 270°, 360°. Exact caption \*\*“Figure 11.2 Production of AC”\*\*.

### 2.3 From a rotating vector to a sine wave

A rotating vector can illustrate why the generated voltage has a sinusoidal shape. Imagine the vector **OP** rotating about origin **O** at a uniform speed. Its vertical projection, shown in the original drawing as the ordinate **ON**, represents the instantaneous value. If the angle of rotation is θ and the peak EMF is Epeak, then:

$$
E\_{\\mathrm{instant}} = E\_{\\mathrm{peak}}\\sin\\theta
$$

Plotting that projection against time or angle builds the sine waveform. A full 360° rotation gives one complete electrical cycle in a two-pole machine.

> \*\*Image-generation prompt — Figure 11.3 Production of a sine wave\*\*
>
> Match the original textbook's landscape rectangle: on the \*\*left\*\*, draw a light-grey circular rotation guide marked \*\*0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°\*\*, with origin \*\*O\*\*, a dark-blue radial arrow \*\*OP\*\* pointing upward-right at \*\*45°\*\*, vertical projection point \*\*N\*\*, and nearby labels \*\*“Phase angle 45°”\*\* and \*\*“Rotation”\*\* with small curved arrows. On the \*\*right\*\*, connect this concept to one blue sine wave plotted from \*\*0° to 360°\*\*, peaking at 90°, crossing the axis at 180°, reaching a trough at 270°, and rising to zero at 360°. Include a vertical reference at the graph origin, dashed horizontal \*\*red\*\* lines connecting the projection height to wave ordinates, a dashed vertical peak marker, label \*\*“Max value”\*\*, and a long double-arrow labelled \*\*“Time”\*\* beneath the curve. Original caption \*\*“Figure 11.3 Production of a sine wave”\*\*.

\---

## 3\. AC Waveform Vocabulary and Measurements

Understanding a waveform requires distinguishing its time-based and amplitude-based quantities.

### 3.1 Cycle and phase

A **cycle** is one complete repetition of the alternating voltage or current waveform. Its position within the cycle is expressed as a **phase angle**:

* 0°: the starting zero crossing of the standard sine-wave example.
* 90°: positive peak.
* 180°: next zero crossing.
* 270°: negative peak.
* 360°: one complete cycle and return to the starting phase.

> \*\*Image-generation prompt — Figure 11.4 Frequency comparison\*\*
>
> Prepare two horizontally aligned blue sine-wave graphs stacked vertically in a white figure box, with the \*\*same total horizontal time span\*\*. The upper trace shows exactly \*\*two cycles\*\* and is labelled \*\*“Two cycles/second”\*\*. The lower trace shows exactly \*\*eight cycles\*\* with a denser sinusoidal repetition and is labelled \*\*“Eight cycles/second”\*\*. Under both traces, a single full-width double-ended arrow is labelled \*\*“One Second”\*\*. Include thin horizontal zero axes and the same spare aviation-manual appearance. Caption \*\*“Figure 11.4 Frequency comparison”\*\*.

### 3.2 Frequency

**Frequency** (f) indicates how many complete cycles occur each second; its unit is the **hertz (Hz)**. A 400 Hz supply therefore completes 400 cycles every second. Constant-frequency aircraft supplies in the textbook are typically **400 Hz**.

Generator frequency depends on rotational speed and the machine's total number of magnetic poles:

$$
f = \\frac{N\_{\\mathrm{poles}}}{2}\\times\\frac{n\_{\\mathrm{rpm}}}{60}
$$

Where `N\_poles` counts both north and south poles and `n\_rpm` is rotational speed in revolutions per minute. The factor `N\_poles / 2` counts the number of pole pairs.

**Worked example:** An eight-pole generator turns at 6,000 rpm.

$$
f = \\frac{8}{2}\\times\\frac{6000}{60}=4\\times100=\\boxed{400\~\\mathrm{Hz}}
$$

Increasing speed increases frequency if the pole count is fixed. Changing the number of poles also changes frequency for the same rotational speed.

### 3.3 Period

**Period (T)** is the duration of one cycle and is the reciprocal of frequency:

$$
T = \\frac{1}{f}
$$

At 400 Hz:

$$
T=\\frac{1}{400}=\\boxed{0.0025\~\\mathrm{s}}=\\boxed{2.5\~\\mathrm{ms}}
$$

### 3.4 Amplitude, peak and peak-to-peak values

The **amplitude** or **peak value** is the maximum magnitude attained above or below the zero reference. A waveform with a positive peak of +Vpeak has a matching negative peak of −Vpeak when symmetrical; its peak-to-peak span is **2 × Vpeak**.

### 3.5 Root mean square (RMS)

An AC voltage constantly changes, so simply quoting the instantaneous voltage does not indicate its useful heating effect. The **RMS value** is the effective DC-equivalent value that would dissipate the same average power in a given resistance.

To obtain RMS mathematically, the instantaneous samples are **squared**, averaged, and then **square-rooted**. For an ideal sinusoidal waveform:

$$
V\_{\\mathrm{RMS}}=\\frac{V\_{\\mathrm{peak}}}{\\sqrt{2}}\\approx0.707V\_{\\mathrm{peak}}
$$

$$
I\_{\\mathrm{RMS}}=\\frac{I\_{\\mathrm{peak}}}{\\sqrt{2}}\\approx0.707I\_{\\mathrm{peak}}
$$

For example, a 100 V peak sine wave corresponds to approximately 70.7 V RMS. The 0.707 factor applies to a **sine wave**, not automatically to arbitrary waveforms. The textbook illustrates the factor with the sine of 45°, but RMS is fundamentally determined through the mean-square calculation. Aircraft AC values and most general-purpose AC voltmeter/ammeter indications are normally expressed in RMS terms.

> \*\*Image-generation prompt — Figure 11.5 AC terminology\*\*
>
> Recreate a compact labelled blue sinusoidal voltage graph occupying a bordered white rectangle. Along the horizontal axis mark \*\*0°, 45°, 90°, 180°, 270°, 360°\*\*, with positive and negative signs on the vertical axis. Show one blue cycle, positive and negative crests, dotted horizontal reference lines for \*\*“Peak Value or Amplitude (Positive)”\*\*, \*\*“Peak Value or Amplitude (Negative)”\*\*, and \*\*“RMS Value (Peak value × .707)”\*\*. Beneath the axis use a \*\*“One Cycle”\*\* double arrow plus distinct arrows for \*\*“Positive Half Cycle”\*\* and \*\*“Negative Half Cycle”\*\*. Preserve placement of text relative to the curve and the exact caption \*\*“Figure 11.5 AC terminology”\*\*.

\---

## 4\. AC Voltage and Current: Understanding Phase

Current and voltage in the ideal linear AC circuits introduced here have the **same frequency**, but their waveforms do not necessarily peak together.

In a purely resistive circuit, the applied voltage and resulting current change together: they cross zero together and reach maxima together. We say the two are **in phase**, with **0° phase difference**. Ohm's law still applies using corresponding RMS values:

$$
V\_{\\mathrm{RMS}}=I\_{\\mathrm{RMS}}R
$$

In circuits containing **inductance** or **capacitance**, temporary energy storage in magnetic or electric fields displaces one waveform relative to the other. The angular separation of matching points on the waves is the **phase difference**, measured in degrees. A waveform can lead or lag the other even though their frequencies remain equal.

## 5\. The Purely Resistive AC Circuit

Real resistors and wiring inevitably have some inductance and possibly stray capacitance. For clear analysis, however, the textbook first treats resistance, inductance and capacitance as isolated ideal circuit properties.

For an ideal **resistive-only circuit**, current follows the voltage instantly in the sinusoidal model:

* **Current and voltage are in phase (0°).**
* Their positive and negative peaks coincide.
* RMS voltage, RMS current and resistance obey Ohm's law.
* Power is actually consumed in the resistive load, mainly as heat in this model.

> \*\*Image-generation prompt — Figure 11.6 The phase relationship in a purely resistive circuit\*\*
>
> Use a two-part technical figure. \*\*Left:\*\* a pale grey circular phasor guide marked \*\*90°\*\* and \*\*0°\*\*, with short arrows for \*\*V\*\* (blue) and \*\*I\*\* (red) pointing in precisely the same direction from the centre; label them clearly. \*\*Right:\*\* overlay one blue voltage sine wave and one red current sine wave along a 0°–360° phase-angle axis. Ensure matching zero crossings and peaks (zero phase difference), use \*\*V\*\* and \*\*I\*\* labels beside the traces, and place a small heading \*\*“Resistive Circuit - Voltage and Current ‘In Phase’”\*\*. Original caption \*\*“Figure 11.6 The phase relationship in a purely resistive circuit”\*\*.

\---

## 6\. Inductance and Magnetic Energy Storage

### 6.1 Inducing voltage without moving a conductor

A conductor crossing a magnetic field can develop an EMF, but mechanical motion is not essential: **changing the magnetic flux linked with a coil** also induces voltage. A varying current in one coil can change the field linking a neighbouring coil.

The textbook demonstrates this using **two separate circuits**, each with a coil:

1. **Primary switch open:** With no current in the primary winding, there is no current-produced field linking the secondary, so its ammeter shows no induced current.
2. **Primary switch closes:** Primary current builds and the magnetic field grows. That changing field links the secondary winding, causing a **brief meter deflection**. Once current and field settle, the induced voltage disappears and the meter returns to zero.
3. **Primary switch opens:** The field collapses, cutting the secondary with the opposite change of flux. The meter briefly deflects in the **opposite direction**.
4. **Primary supplied with AC:** The magnetic field grows, shrinks and reverses throughout the cycle, so the secondary experiences a continuously changing induced voltage and the meter oscillates between directions. The strongest induction occurs with the greatest **rate of flux change**, associated in the explanation with the rapid polarity-change portion of the waveform.

This interaction between two windings is called **mutual induction** and is the operating principle behind electrical transformers. For a given arrangement, greater supply frequency increases the rate at which the linked field changes.

> \*\*Image-generation prompt — Figure 11.7 Inductance\*\*
>
> Reproduce one boxed black-line \*\*five-panel electrical circuit sequence\*\*. Top heading \*\*“DC - Current flow changes only when switched on or off”\*\*; across the top draw three adjacent subpanels, exactly labelled \*\*“(a) Switch open - no field”\*\*, \*\*“(b) Switch closed - field builds then stabilizes”\*\*, and \*\*“(c) Switch open - collapsing field”\*\*. Each contains left-side battery/switch and primary coil, an adjacent separate secondary coil and analogue ammeter at right; use dashed red flux-loop outlines and small red arrows when magnetic field changes. Lower heading \*\*“AC - Current flow changing all the time - field changing all the time”\*\*; below place two wider panels \*\*“(d) AC first half cycle”\*\* and \*\*“(e) AC second half cycle”\*\* with AC source symbols, paired coils, red/black winding arrows, labelled \*\*N\*\* and \*\*S\*\*, and ammeter needles in opposite directions. Preserve the exact sequence and caption \*\*“Figure 11.7 Inductance”\*\*.

### 6.2 Self-induction and back EMF

If the adjacent secondary circuit is removed, the coil still produces a changing magnetic field when its own current changes. The flux variation then induces EMF in the **same coil**; this is **self-induction**.

**Lenz's law** establishes the important direction of this induced EMF: it acts against the change that created it. It is therefore termed **back EMF**. When current tries to increase, induced EMF resists the rise; when current tries to decrease, induction resists that decrease.

> \*\*Image-generation prompt — Figure 11.8 Self-induction\*\*
>
> Draw a single rectangular AC circuit with a sine-wave AC source at left and a vertical multi-turn coil at right. A \*\*red right-pointing arrow\*\* along the top wire carries the label \*\*“Circuit current”\*\* with red \*\*I\*\*; a \*\*blue left-pointing arrow\*\* near it is labelled \*\*“Opposition current”\*\* with blue \*\*I\*\*. To the right of the coil, use a red dotted elongated magnetic-field loop and clear blue \*\*+\*\* near its upper end and \*\*−\*\* near its lower end. Left of source label \*\*“Supply voltage”\*\* with polarity marks. A black right-side callout, arrowed toward the coil, states \*\*“Back EMF generated across coil while the current is changing opposes rate of change of current flow in the circuit”\*\*. White background, black circuit lines, original caption \*\*“Figure 11.8 Self-induction”\*\*.

### 6.3 What determines inductance?

The voltage produced through self-induction depends on the changing magnetic linkage. Influencing factors include:

* **Number of winding turns:** More turns improve magnetic linkage and can increase inductance.
* **Core material:** Adding a **soft iron core** strengthens the magnetic field and increases inductance.
* **Rate of current change:** Faster current variation, including increased AC frequency at the same relevant waveform conditions, gives greater induced opposing EMF.

The first two mainly describe the construction of the inductor, whereas the last affects the induced EMF during operation. A higher-inductance coil develops more back EMF than a low-inductance coil when subjected to a comparable current-change rate.

Inductance is denoted **L** and measured in **henries (H)**; **millihenries (mH)** and **microhenries (µH)** are common practical units. An inductance of 1 H produces 1 V of induced EMF when current changes at **1 ampere per second**.

Because inductance resists changes in current, in an ideal pure inductor the **current lags the voltage by 90°**.

> \*\*Image-generation prompt — Figure 11.9 The phase relationship in a purely inductive circuit\*\*
>
> Reproduce a two-panel phasor-and-waveform teaching diagram, very close to the original design. \*\*Left:\*\* light-grey circular angular reference labelled \*\*90°\*\* and \*\*0°\*\*, blue horizontal phasor \*\*V\*\* to the right and red phasor \*\*I\*\* pointing vertically downward, with text \*\*“Back EMF causes opposition to change”\*\* if present in the drawing. \*\*Right:\*\* draw a blue voltage sine wave and a red current sine wave over a \*\*0°–360°\*\* horizontal axis; place the red waveform \*\*90° behind\*\* the blue, visibly shifted right, with callout \*\*“Current ‘lags’ voltage by 90°”\*\*. Heading \*\*“Pure Inductive Circuit - Voltage and Current ‘Out of Phase’”\*\*. Original caption \*\*“Figure 11.9 The phase relationship in a purely inductive circuit”\*\*.

### 6.4 Inductive reactance

The frequency-dependent opposition caused by inductance in AC is called **inductive reactance** (XL). It is measured in ohms, but is distinguished from resistance because its value depends on both L and frequency:

$$
X\_L=2\\pi fL
$$

Here `f` is in hertz, `L` in henries and the resulting `X\_L` is in ohms.

**Increasing frequency increases inductive reactance**, reducing current when RMS supply voltage and the other conditions remain fixed. **Decreasing frequency reduces reactance**, allowing higher current in a predominantly inductive load. This is an important consideration when induction-based equipment is supplied below its intended frequency.

\---

## 7\. Capacitance and Electric Energy Storage

### 7.1 Capacitor construction and capacity

A **capacitor** is a component able to store separated electrical charge and energy in an electric field. The basic construction uses **two conductive plates** with an insulating **dielectric** between them. Examples of dielectric materials mentioned in the chapter are **air, mica and waxed paper**.

The capacitance depends on three construction factors:

1. **Plate area:** Larger effective plate area increases the capacity to store separated charge at a given voltage.
2. **Distance between plates:** Bringing the plates closer increases capacitance, subject to suitable insulation.
3. **Dielectric material:** The electrical characteristics of the material between the plates affect how much charge can be stored.

### 7.2 Charging and discharging on DC

Connecting a capacitor to a DC battery moves electrons **onto the plate connected to the negative terminal** and removes electrons **from the plate connected to the positive terminal**. Conventional current direction is opposite to electron movement. Charging current falls as plate voltage rises, and for an ideal capacitor charging is complete when its voltage equals the supply.

If the source is disconnected, the ideally insulated capacitor retains the charge; real capacitors lose it gradually because of leakage. If the charged capacitor is then connected through an external discharge path, current briefly flows in the **reverse direction** until the potential difference falls to zero.

**Crucial distinction:** Electrons travel in the external wires and conductors, **not through the dielectric between the capacitor plates**.

> \*\*Image-generation prompt — Figure 11.10 A capacitor in a DC circuit\*\*
>
> Show a large white-background training schematic with a mechanical \*\*three-position switch\*\* at the upper centre, labelled \*\*“Switch”\*\*, selecting a left charging connection, neutral centre, or right discharging connection. Left: DC source and labelled \*\*“Charging circuit”\*\* with arrows toward a two-plate capacitor at centre; show one \*\*Plate\*\* on each side of a blue/grey \*\*Dielectric\*\*, with red current-direction arrows and charges. Right: resistor/external circuit labelled \*\*“External circuit”\*\* and \*\*“Discharging circuit”\*\* with opposite arrows. Beneath the schematic put a paired \*\*capacitor charging / capacitor discharging\*\* graph showing \*\*Voltage\*\* and \*\*Current\*\* versus \*\*Time\*\*, with declining charge current and a brief oppositely directed discharge-current pulse. Preserve the original general arrangement and exact caption \*\*“Figure 11.10 A capacitor in a DC circuit”\*\*.

### 7.3 A capacitor connected to AC

When a capacitor is placed across an AC source, its charging and discharging action repeats continuously as the applied polarity alternates. It stores energy in the electric field during part of the cycle and returns energy to the circuit during another part.

The current through the external connecting circuit can therefore exist while the voltage between the plates is changing, even though no electrons cross the insulating gap. The chapter's ideal capacitive model gives an important phase rule: **current leads voltage by 90°**.

> \*\*Image-generation prompt — Figure 11.11 Capacitor in an AC circuit.\*\*
>
> Draw two side-by-side panels showing a two-plate capacitor energized by an AC source in the \*\*first half cycle\*\* and \*\*second half cycle\*\*. Use a vertical small blue capacitor dielectric gap with a black plate on either side; the plates carry opposite rows of \*\*+\*\* and \*\*−\*\* symbols that \*\*reverse between panels\*\*. Below each capacitor place a circular sine-wave AC source marked with \*\*+\*\* and \*\*−\*\* terminals, arrows on the external wires showing electron/charge movement in opposite directions, and the exact panel labels \*\*“Charge / discharge 1st half cycle”\*\* and \*\*“Charge / discharge 2nd half cycle”\*\*. Match the sparse line diagram, blue fill accents, and original caption \*\*“Figure 11.11 Capacitor in an AC circuit.”\*\*

Capacitance is represented by **C**, and its SI unit is the **farad (F)**. One farad gives a potential difference of 1 V for a stored charge of 1 coulomb, corresponding to **1 A applied for 1 s** in this ideal definition. Common smaller units are the **microfarad (µF)** and **picofarad (pF)**.

> \*\*Image-generation prompt — Figure 11.12 Phase relationship in a purely capacitive circuit\*\*
>
> Reproduce the paired light-grey circular phasor and sinusoid illustration. \*\*Left:\*\* blue voltage arrow \*\*V\*\* points right at 0° while red current arrow \*\*I\*\* points vertically upward at \*\*90°\*\*. \*\*Right:\*\* blue voltage sine wave and red current sine wave share a 0°–360° phase axis; the red current has a \*\*90° phase lead\*\*, reaching its crest before voltage. Show original callout \*\*“Current ‘leads’ voltage by 90°”\*\*, heading \*\*“Pure Capacitive Circuit - Voltage and Current Out of Phase”\*\*, and exact original caption \*\*“Figure 11.12 Phase relationship in a purely capacitive circuit”\*\*.

### 7.4 Capacitive reactance

An AC capacitor produces a frequency-dependent opposition to the flow of alternating current in the external circuit. **Capacitive reactance** (XC) is measured in ohms and calculated as:

$$
X\_C=\\frac{1}{2\\pi fC}
$$

Unlike inductive reactance, **capacitive reactance decreases as frequency rises**. For a given RMS supply voltage and capacitance, increasing frequency therefore increases the capacitive current; decreasing frequency increases reactance and reduces that current.

\---

## 8\. Impedance: The Total Opposition in AC

Actual AC circuits involve resistance alongside inductive and/or capacitive reactance. A simple numerical sum of all three is not valid because **resistive and reactive effects have different phase relationships**.

Inductive and capacitive phase effects oppose one another, so the net reactance in the series-circuit model is:

$$
X=X\_L-X\_C
$$

The circuit's total opposition, called **impedance** (Z), is the **vector combination** of resistance and net reactance. Its unit is the ohm (Ω):

$$
Z=\\sqrt{R^2+(X\_L-X\_C)^2}
$$

A right-angled **impedance triangle** helps visualize the relationship. The horizontal component represents resistance R, the vertical component represents net reactance X, and the diagonal represents impedance Z. The magnitude of resistance is at 90° to the reactive component in this diagram.

> \*\*Image-generation prompt — Figure 11.13\*\*
>
> Recreate the original wide \*\*impedance triangle\*\* on white. A \*\*red horizontal arrow\*\* extends right from an origin, labelled \*\*“Resistance R”\*\*; a \*\*red vertical arrow\*\* from the same origin extends upward, labelled \*\*“Reactance X (XL - Xc)”\*\*; a \*\*red sloping diagonal arrow\*\* from the origin to the upper-right forms the hypotenuse, labelled \*\*“Impedance Z”\*\*. Put the equation \*\*“Z = √(R² + (XL − XC)²)”\*\* to the right of the triangle in large clear black lettering. Retain a small right-angle corner marker and exact bare caption \*\*“Figure 11.13”\*\* (the book does not give this figure a descriptive caption).

### 8.1 Resonance

The two reactances change in opposite directions when supply frequency changes:

* `XL` increases as frequency rises.
* `XC` decreases as frequency rises.

At a specific frequency, the magnitudes become equal. **Electrical resonance** occurs when:

$$
X\_L=X\_C
$$

At resonance their reactive effects cancel in the series idealization. The textbook distinguishes two important arrangements:

* **Series inductor and capacitor:** The opposition is lowest at resonance and the supplied circuit current is **maximum**.
* **Parallel inductor and capacitor:** In the idealized parallel-resonant case, the **supply current is minimum** at resonance.

Real circuits have losses and component resistance, so their resonant behaviour is not infinitely sharp.

### 8.2 The phase-memory aid

The conventional memory aid **C–I–V–I–L** encodes the lead/lag relationship:

* **C**apacitive circuit: **I** (current) leads **V** (voltage).
* **L** inductive circuit: **V** (voltage) leads **I** (current).

> \*\*Image-generation prompt — Figure 11.14\*\*
>
> Recreate a white-background graph titled visually by the axis concepts, not a decorative title. The horizontal axis is \*\*“Frequency”\*\* with an arrow to the right; the vertical axis is \*\*“Reactance X”\*\* with arrow upward. Plot a \*\*red straight rising line\*\* labelled \*\*“XL”\*\* representing inductive reactance and a \*\*blue downward curved line\*\* labelled \*\*“XC”\*\* for capacitive reactance; make the two intersect at a point identified by a short downward dashed vertical guide to \*\*“Resonant frequency XL = XC”\*\*. Preserve the exact source caption \*\*“Figure 11.14”\*\* and minimalist colour/line hierarchy.

\---

## 9\. Understanding Power in AC Circuits

Electrical power in a circuit at any instant is **instantaneous voltage multiplied by instantaneous current**:

$$
p(t)=v(t)i(t)
$$

However, because AC voltage and current can be out of phase, the average power actually converted into heat or useful work may be less than the quantity obtained from RMS voltage multiplied by RMS current.

The chapter distinguishes:

|Quantity|Meaning|Unit|
|-|-|-|
|**True / real / active power, P**|Average power actually consumed or converted by the load|W or kW|
|**Reactive power, Q**|Alternating exchange of energy associated with inductive or capacitive fields|VAR or kVAR|
|**Apparent power, S**|Product of RMS supply voltage and RMS current|VA or kVA|
|**Power factor, PF**|Ratio between useful average power and apparent power|Dimensionless|

### 9.1 Pure resistance: power stays positive

When current and voltage are in phase, they have the same sign at the same instant. Their product is therefore positive in both halves of the cycle. The instantaneous-power waveform has **twice the frequency** of the voltage/current waves and never becomes negative in the ideal resistance model.

The mean height of that power waveform is the **true power**:

$$
P=V\_{\\mathrm{RMS}}I\_{\\mathrm{RMS}}
$$

This real electrical power is specified in **watts or kilowatts**; in purely resistive AC, apparent power and true power have numerically equal values.

> \*\*Image-generation prompt — Figure 11.15 Power in a purely resistive circuit\*\*
>
> Draw a single large white rectangular plot: horizontal axis shows one complete AC cycle; vertical axis shows positive and negative values with black numeric markings. Overlay \*\*blue sine voltage V\*\* and \*\*red sine current I\*\* precisely \*\*in phase\*\*, plus a higher-frequency, entirely \*\*positive black power waveform P\*\* whose two lobes extend above zero for each voltage cycle. Add the labels \*\*“Voltage”\*\*, \*\*“Current”\*\*, \*\*“Power”\*\*, the note \*\*“Voltage and Current ‘in phase’ = Real power”\*\*, and a dashed average-power reference identified as \*\*“Average power (True power)”\*\*. An annotation on the right identifies \*\*“RMS Volts × RMS Amps / Watts or kW”\*\*. Original caption \*\*“Figure 11.15 Power in a purely resistive circuit”\*\*.

### 9.2 Pure inductance: energy is exchanged, not consumed on average

In a pure inductor, **current lags voltage by 90°**. Multiplying the two changing waveforms creates alternating **positive and negative power lobes**:

* During a positive lobe, energy is supplied to build the inductor's magnetic field.
* During a negative lobe, energy is returned to the supply as the field collapses, associated with back EMF.
* The positive and negative areas are equal in the ideal circuit, so **average true power is zero**.

The supply still carries voltage and current, even though no net energy is consumed by the ideal reactive component. This component of electrical load is described as **reactive power**, expressed in **VAR or kVAR**. The RMS product is **apparent power**, expressed in **VA or kVA**.

> \*\*Image-generation prompt — Figure 11.16 Power in a purely inductive circuit\*\*
>
> Match the source's technical sinusoidal graph: over a common time axis show \*\*blue voltage V\*\*, \*\*red current I\*\* delayed by exactly \*\*90°\*\*, and a bold black \*\*instantaneous-power P\*\* waveform with equally sized \*\*positive and negative lobes\*\*. Add a small left phasor sketch with blue voltage and red current at right angles; label \*\*“Phase angle 90° current lags voltage”\*\*. Point to the upper lobe with \*\*“Positive power”\*\* and lower lobe with \*\*“Negative power”\*\*; the central horizontal axis reads \*\*“True power = 0”\*\*. Include the text \*\*“Power = Volts × Amps Reactive. VAR or kVAR”\*\* and the parenthetical explanation that there is no real power when current is 90° out of phase with voltage. Preserve caption \*\*“Figure 11.16 Power in a purely inductive circuit”\*\*.

### 9.3 Pure capacitance: a corresponding reactive exchange

A pure capacitor follows the same average-power principle but with the opposite phase sense: **current leads voltage by 90°**. The electric field stores energy during one interval and returns it during another. Positive and negative power areas are equal, so **true power is zero** in an ideal capacitor. Both reactive (VAR/kVAR) and apparent (VA/kVA) descriptions remain applicable.

> \*\*Image-generation prompt — Figure 11.17 Power in a purely capacitive circuit\*\*
>
> Produce the matching counterpart to Figure 11.16, with \*\*blue voltage V\*\*, \*\*red current I\*\* shifted \*\*90° ahead\*\*, and a black power waveform having equal positive and negative lobes around a central \*\*“True power = 0”\*\* axis. Include a compact phase-angle sketch at left labelled \*\*“Phase angle 90° current leads voltage”\*\*, upper and lower labels \*\*“Positive power”\*\* and \*\*“Negative power”\*\*, and explanatory text \*\*“Power = Volts × Amps Reactive. VAR or kVAR”\*\*. Use the source's spare white-background training-graphic format and exact caption \*\*“Figure 11.17 Power in a purely capacitive circuit”\*\*.

### 9.4 Real-world AC loads

An actual aircraft AC load often combines **resistance** with **inductance** and may also contain capacitance. Inductance and capacitance shift current in opposite directions and can cancel some of each other's reactive effects. The resulting phase angle depends on their relative influence alongside resistance.

The textbook's example uses equal resistance and inductive reactance, producing a **45° phase lag** of current behind voltage. Instantaneous power becomes negative during portions of the cycle, but the positive areas are larger than the negative areas. The average power is therefore **positive**, unlike a purely reactive component, but less than the apparent RMS-voltage-times-current product.

> \*\*Image-generation prompt — Figure 11.18 Power in a circuit having equal amounts of resistance and inductance\*\*
>
> Recreate a graph of \*\*blue voltage V\*\* and \*\*red current I\*\* where current lags by \*\*45°\*\*, overlaid with black instantaneous power having positive humps and smaller negative troughs. At left add a small 45° red/blue phasor illustration labelled \*\*“Phase angle of 45° current ‘lags’ voltage”\*\*. On the graph mark \*\*“Positive power”\*\*, \*\*“Negative power”\*\*, a \*\*raised horizontal dashed “True power axis now above the zero axis”\*\*, and \*\*“True power (kW)”\*\*. Include text \*\*“More positive power than negative power”\*\* and beneath the diagram the expression \*\*“Power factor = true power (kW) / apparent power (kVA)”\*\*. Caption exactly \*\*“Figure 11.18 Power in a circuit having equal amounts of resistance and inductance”\*\*.

\---

## 10\. Power Factor

**Power factor** compares the real power used by a load with the apparent power that must be supplied:

$$
\\mathrm{PF}=\\frac{P}{S}=\\frac{\\text{true power}}{\\text{apparent power}}
$$

For the ideal sinusoidal circuit considered here, it is also the cosine of the voltage/current phase displacement:

$$
\\mathrm{PF}=\\cos\\varphi
$$

Important boundary cases:

* **Pure resistance:** phase difference = 0°; `cos 0° = 1`; **PF = 1**. True power equals apparent power.
* **Pure ideal inductance or capacitance:** absolute phase difference = 90°; `cos 90° = 0`; **PF = 0**. Mean true power is zero even though reactive exchange occurs.
* **Mixed circuit:** intermediate phase angle gives a power factor between zero and one for the passive loads discussed. Increasing displacement reduces the power factor; reducing displacement increases it.

A useful set of relationships is:

$$
S=V\_{\\mathrm{RMS}}I\_{\\mathrm{RMS}}
$$

$$
P=V\_{\\mathrm{RMS}}I\_{\\mathrm{RMS}}\\cos\\varphi
$$

For a sinusoidal circuit, the corresponding reactive component has magnitude:

$$
|Q|=V\_{\\mathrm{RMS}}I\_{\\mathrm{RMS}}|\\sin\\varphi|
$$

The source calls apparent power **theoretical** or **rated** power in its revision summary; true power is also called **real**, **effective**, **wattful** or **working** power.

### 10.1 Power terminology at a glance

|Circuit model|Current relative to voltage|Phase displacement|Average true power|Power factor|
|-|-|-|-|-|
|Resistive only|In phase|0°|Positive|1|
|Inductive only|Lags|90°|0|0|
|Capacitive only|Leads|90°|0|0|
|Combined R and inductive reactance|Usually lags|Between 0° and 90°|Positive|Between 0 and 1|
|Combined R and capacitive reactance|Usually leads|Between 0° and 90°|Positive|Between 0 and 1|

### 10.2 Worked power-factor example

Suppose a load is supplied at 115 V RMS and draws 10 A RMS at a power factor of 0.8:

$$
S=115\\times10=1150\~\\mathrm{VA}=1.15\~\\mathrm{kVA}
$$

$$
P=1150\\times0.8=\\boxed{920\~\\mathrm{W}}
$$

This example illustrates how a current-carrying capacity of 1.15 kVA can correspond to only 920 W of average useful electrical power. It is an additional practice example, not a numerical example quoted from the chapter.

\---

## 11\. Formula and Principle Reference

|Subject|Expression / rule|Important qualification|
|-|-|-|
|Alternator frequency|`f = (number of poles / 2) × (rpm / 60)`|Pole count includes both N and S poles|
|Period|`T = 1 / f`|Seconds per cycle|
|Sinusoidal RMS|`RMS = peak / √2 ≈ 0.707 × peak`|Applies to a sine wave|
|Resistive AC|`V = IR`|Use corresponding RMS values|
|Inductive reactance|`XL = 2πfL`|Rises as frequency rises|
|Capacitive reactance|`XC = 1 / (2πfC)`|Falls as frequency rises|
|Net reactance (series)|`X = XL − XC`|Sign determines inductive/capacitive character|
|Series-circuit impedance|`Z = √\[R² + (XL − XC)²]`|Vector combination, measured in Ω|
|Resonance|`XL = XC`|Series current peaks, parallel source current is lowest in the ideal treatments|
|Apparent power|`S = Vrms × Irms`|VA, kVA|
|True power|`P = S × PF`|W, kW|
|Power factor|`PF = P / S = cos φ`|Ideal sinusoidal circuits|

**Aviation-specific points to remember:** Common constant-frequency supply is 400 Hz; supply-frequency deviations affect inductive and capacitive equipment differently; transformer and TRU operation depends on the electromagnetic phenomena introduced in this chapter.

\---

# 12\. Chapter Practice Questions — Attempt Before Viewing Answers

The following **32 questions** cover the same topics and answer-choice reasoning as the source chapter, with independently rewritten wording. The solutions appear together in the **final answer key**, not alongside individual questions.

**Q1.** In an AC circuit, which quantity expresses the complete opposition to current flow?  
A. Only the inductive portion of the load  
B. Inductive opposition in a DC circuit  
C. The circuit's total AC opposition (impedance)  
D. The highest reverse resistance of a rectifier

**Q2.** What is the name for true power divided by apparent power?  
A. Resistance  
B. Power factor  
C. Reactive volt-amperes  
D. RMS value

**Q3.** Which two generator characteristics determine the frequency of a constant-frequency AC output?  
A. Rotational speed and number of magnetic poles  
B. Engine speed and load power factor  
C. Capacitive reactance and applied voltage  
D. Circuit impedance and field resistance

**Q4.** For the same machine weight, which is generally associated with higher electrical output in this chapter?  
A. The machine selected only according to aircraft demand  
B. The conventional DC generator  
C. The AC generator  
D. Whichever machine is installed on the larger aircraft

**Q5.** What unit is appropriate for AC supply frequency?  
A. Hertz, or cycles each second  
B. Watts  
C. Megawatts  
D. Cycles each minute as the SI unit

**Q6.** Which property is a key benefit of AC distribution over DC?  
A. It removes the need for rectifier units in every situation  
B. AC generators never require cooling  
C. AC conductors require no insulation  
D. Transformer action allows very efficient voltage step-up and step-down

**Q7.** How does the generated EMF change in an elementary AC generator?  
A. Rises, falls to zero, then rises again with unchanged polarity  
B. Increases in one direction and holds at its maximum  
C. Rises in one direction, crosses zero, then builds to a maximum of opposite polarity  
D. Remains unidirectional throughout rotation

**Q8.** What happens to current in a predominantly inductive circuit if supply frequency decreases while voltage remains unchanged?  
A. It decreases  
B. It stays unchanged  
C. It must oscillate unpredictably  
D. It increases

**Q9.** A capacitive load is supplied at a higher frequency but unchanged RMS voltage. What happens to its current?  
A. It decreases  
B. It increases  
C. It is independent of frequency  
D. Only the supply polarity is affected

**Q10.** A conventional aircraft three-phase AC system with 115 V phase-to-neutral commonly has approximately what **line-to-line** voltage?  
A. 115 V  
B. 208 V  
C. 200 V  
D. 400 V

**Q11.** A source operating at 400 Hz completes how many cycles in one second?  
A. Enough to produce 400,000 W  
B. A total impedance of 400 Ω  
C. 400 cycles  
D. 400 cycles per minute

**Q12.** In a load that is mainly inductive, current generally:  
A. Leads voltage  
B. Remains exactly in phase  
C. Lags voltage  
D. Produces a negative power-factor magnitude

**Q13.** What happens to inductive reactance as frequency increases?  
A. It increases  
B. It decreases  
C. It remains constant in every circuit  
D. Its value becomes equal to resistance

**Q14.** For sinusoidal alternating current, the RMS magnitude is approximately:  
A. The simple mean over a positive half cycle  
B. 1.73 times peak  
C. The square root of the peak-current number  
D. 0.707 times peak

**Q15.** What characteristic of separate stator winding sets determines whether generator output is single-phase or multiphase?  
A. Maximum terminal voltage alone  
B. Mechanical speed only  
C. Connected load power factor  
D. Number of independently arranged phase windings

**Q16.** What does kVAR quantify?  
A. The alternator's purely resistive load  
B. The reactive component of load  
C. Total apparent load  
D. Total impedance

**Q17.** Which quantity is normally used for alternator electrical output ratings?  
A. kVA  
B. kVAR only  
C. kW only regardless of power factor  
D. kW divided by kVAR

**Q18.** AC voltmeters and ammeters are generally calibrated to show:  
A. RMS values  
B. Average readings of absolute values only  
C. Peak instantaneous values  
D. Arithmetic mean over a full sinusoidal cycle

**Q19.** Impedance in the relevant series AC circuit is:  
A. The vector combination of resistance and net reactance  
B. Resistance plus capacitive reactance as plain numbers  
C. The sum of inductive and capacitive magnitudes  
D. All resistance and reactance magnitudes added arithmetically

**Q20.** An alternator serving an inductive device runs below its specified frequency, with other conditions unchanged. What risk is highlighted?  
A. All motors necessarily stop at once  
B. Inductive devices may overheat from increased current  
C. Lamp filaments must become dimmer  
D. Every lamp necessarily becomes brighter

**Q21.** Which formula gives power factor using kilowatt and kilovolt-ampere quantities?  
A. kVA / kW  
B. kW / kVAR  
C. kW / kVA  
D. kVAR / kW

**Q22.** In the normal passive AC-circuit context of this chapter, a non-zero phase displacement caused by reactance generally makes power factor:  
A. Exactly one  
B. Negative in magnitude  
C. Greater than one  
D. Less than one

**Q23.** How can an AC generator's output frequency be reduced, with its pole count unchanged?  
A. Reduce the generator field's rotational speed  
B. Reduce excitation voltage only  
C. Reduce excitation current only  
D. Raise field winding impedance

**Q24.** What does the RMS value of AC represent in heating terms?  
A. 1.73 times its peak  
B. Peak multiplied by power factor  
C. The instantaneous AC peak that causes equivalent DC heating  
D. A DC value giving the same heating effect in the same resistance

**Q25.** What is generally true of current and voltage in a reactive circuit?  
A. They differ in phase  
B. They are necessarily separated by 180°  
C. Current always leads regardless of the reactive component  
D. They always remain in phase

**Q26.** The conducting plates of a capacitor are separated by:  
A. A material that conducts like a metal  
B. A direct electron-flow path between the plates  
C. A connection that prevents voltage appearing across them  
D. An insulating dielectric, potentially mica or waxed paper

**Q27.** How does an inductor behave when a DC circuit is switched on or off?  
A. It can never influence circuit voltage  
B. It acts only at switch-on, never at switch-off  
C. It opposes the changes of current associated with switching  
D. It always produces a sustained increase in DC voltage

**Q28.** Which SI unit measures inductance?  
A. Henry  
B. Ohm  
C. Farad  
D. Coulomb

**Q29.** In a predominantly inductive AC circuit:  
A. Current leads the voltage  
B. Current lags the voltage  
C. They are always in phase  
D. Only the effective numerical values change, not phase

**Q30.** At a fixed supply voltage, increasing frequency in a capacitive circuit will generally:  
A. Leave current unchanged  
B. Alter voltage only  
C. Reduce current  
D. Increase current

**Q31.** Choose the correct expression for power factor:  
A. Wattful power / real power  
B. Rated power / apparent power  
C. Apparent power / true power  
D. Real power / apparent power

**Q32.** Which effect describes electrical energy transfer through a changing magnetic field?  
A. Electrostatic induction without a magnetic field  
B. Electromolecular induction  
C. Electromagnetic induction  
D. Electromolecular amplification


# 13\. Final Answer Key and Explanations

## 13.1 Chapter questions

|Question|Answer|Explanation|
|-|:-:|-|
|1|**C**|Impedance is the total AC opposition after accounting for resistance and reactive effects.|
|2|**B**|The ratio P/S is power factor.|
|3|**A**|Frequency depends on rotation speed and number of pole pairs.|
|4|**C**|AC generation generally provides a better power-to-weight ratio.|
|5|**A**|Frequency is stated in hertz, equivalent to cycles per second.|
|6|**D**|Transformers offer efficient conversion of AC to higher or lower voltage.|
|7|**C**|An AC waveform reverses polarity after its zero crossing.|
|8|**D**|Lower f gives lower XL = 2πfL, so current can increase.|
|9|**B**|Higher f lowers XC = 1/(2πfC), increasing capacitive current.|
|10|**C**|The nominal aircraft system described is commonly 115/200 V, three phase; its line voltage is about 200 V.|
|11|**C**|A hertz is one cycle each second.|
|12|**C**|Inductance causes current to lag voltage.|
|13|**A**|Inductive reactance rises with supply frequency.|
|14|**D**|RMS/peak = 1/√2 ≈ 0.707 for a sine wave.|
|15|**D**|Separate phase-winding sets establish the number of output phases.|
|16|**B**|VAR and kVAR measure reactive power.|
|17|**A**|kVA expresses rated apparent output, independent of the external power factor.|
|18|**A**|Normal AC indications are in effective RMS values.|
|19|**A**|The combination is vectorial because reactance and resistance are in quadrature.|
|20|**B**|Supply below design frequency reduces inductive opposition and can increase heating current.|
|21|**C**|PF = real kW / apparent kVA.|
|22|**D**|A passive reactive load with a phase difference has PF below unity.|
|23|**A**|Reducing generator rotational speed lowers the generated frequency.|
|24|**D**|The RMS current/voltage has the same heating effect as the equivalent DC magnitude.|
|25|**A**|Reactive energy exchange shifts current relative to voltage.|
|26|**D**|A dielectric insulates the plates while permitting an electric field between them.|
|27|**C**|Inductance resists current changes during both energization and de-energization.|
|28|**A**|Inductance is measured in henries.|
|29|**B**|In an inductive circuit, current lags voltage.|
|30|**D**|Increasing frequency lowers capacitive reactance and increases current.|
|31|**D**|Power factor is real power divided by apparent power.|
|32|**C**|Changing magnetic flux induces an EMF: electromagnetic induction.|



