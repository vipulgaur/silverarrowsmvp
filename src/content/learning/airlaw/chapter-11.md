# Chapter 11: Altimeter Setting Procedure

## 11.1 Why Altimeter Settings Matter

A pressure altimeter measures vertical position by responding to atmospheric pressure, so the pressure entered into its subscale determines the reference against which the indication is interpreted. An incorrect setting can give the pilot a misleading indication of height or altitude, even if the instrument itself is functioning normally.

Correct altimeter setting serves two distinct flight-safety purposes: **maintaining clearance from terrain and obstacles** and **maintaining vertical separation between aircraft**. Both depend on pilots using the appropriate pressure reference for the phase of flight. An ATC instruction does not remove the pilot's responsibility to ensure that the aircraft's flight path remains safe.

## 11.2 Terrain Clearance on Departures and Arrivals

During an instrument departure or approach, the aircraft must follow the published vertical profile and remain at or above every applicable minimum altitude. Terrain elevations, obstacle elevations and the altitude constraints shown on instrument charts are referenced to **mean sea level (MSL)**. The altimeter must therefore indicate altitude in relation to that datum while the aircraft is operating close enough to the ground for obstacle avoidance to be critical.

Because atmospheric pressure differs from one location to another, the relevant sea-level pressure reference is **local QNH**. Using an unsuitable or outdated pressure setting can cause the altitude displayed in the cockpit to differ from the altitude needed for safe terrain clearance.

## 11.3 Lowest Usable Flight Level

The **lowest usable flight level** is the lowest flight level that is **at or above the established minimum flight altitude**. Its selection must ensure that a flight level does not place the aircraft below the altitude required for safety.

## 11.4 Vertical Separation and Standard Pressure

Once the aircraft is above the altitude that provides the necessary obstacle protection, the principal reason for a shared altimeter reference is separation from other aircraft. Two aircraft using different local pressure settings could indicate different vertical positions even when actual pressure separation is unchanged. A common pressure setting avoids that inconsistency.

The reference adopted is the **Standard Pressure Setting (SPS): 1013 hPa**. The corresponding standard-atmosphere mean sea-level pressure is **1013.25 hPa**, expressed as **1013 hPa** for the setting described here. With at least one altimeter set to SPS, aircraft can be allocated flight levels and separated vertically on a common basis, without depending on the local sea-level pressure.

## 11.5 Objectives of Altimeter Setting Procedures

Altimeter-setting procedures are intended to achieve both of the following:

1. Ensure adequate clearance from terrain and obstacles during every phase of flight, particularly departure and arrival.
2. Provide a consistent vertical reference for safe separation between aircraft.

## 11.6 Pressure References Used at Aerodromes

The three settings or related indications considered here are **QNH**, **QFE** and **QNE**. They are not interchangeable: QNH and QFE are pressure settings, while QNE refers to a particular altimeter indication obtained with standard pressure selected.

### 11.7 QNH — Altitude Referenced to Mean Sea Level

**QNH** is the pressure observed at an aerodrome, reduced to mean sea level using the pressure variation specified by the International Standard Atmosphere (ISA).

When the altimeter is adjusted to the appropriate QNH, it indicates **the aerodrome elevation on touchdown**, or more generally the aircraft's **altitude above mean sea level**. QNH is therefore the reference used when comparing aircraft altitude with published terrain and obstacle elevations.

### 11.8 QFE — Height Relative to the Aerodrome Datum

**QFE** is the aerodrome pressure setting that causes an altimeter to indicate **zero at the aerodrome reference point used for that setting**, as described for touchdown in this chapter.

With QFE selected, the altimeter provides **height above the QFE reference datum** rather than altitude above mean sea level. It may be useful when flying in the aerodrome traffic circuit or during the final part of an approach, subject to the applicable procedures.

### Image Generation Prompt — Figure 11.1: Figure 11.1

Create an original, technically precise aviation training **side-profile altitude-reference diagram**, with a clean white background and a rectangular illustrative panel. Retain the original caption exactly: **“Figure 11.1”**. Show a **grey aircraft silhouette near the top left** over a coastline: **bright turquoise-blue sea occupies the lower left**, while **irregular grey land rises to the right**. Near the top right of the land is a **small orange-red aerodrome building with a tower or chimney** on a level platform; a grey hill rises farther right. Use **two horizontal dashed pressure-reference lines**: the upper dashed line coincides with mean sea level and is labelled exactly **“MSL QNH 996 hPa”**; the lower dashed line, farther below across the water and sloping land, is labelled **“STANDARD PRESSURE SETTING 1013 hPa”**. From the upper/sea-level reference draw a long vertical black double-headed dimension arrow to the aircraft and print **“ALTITUDE 4000 ft”** alongside it. From the lower standard-pressure reference draw a separate, slightly longer black vertical arrow to the aircraft, labelled **“FLIGHT LEVEL FL45”** and beside it **“(PRESSURE ALTITUDE 4500 ft)”**. At the aerodrome, place two adjacent vertical black dimension arrows: **“ELEVATION”** runs from the mean-sea-level reference up to the aerodrome platform, while **“HEIGHT”** measures above the aerodrome platform to a second short dashed height reference. Maintain these four measurements as distinct concepts. Preserve the positions, sizes and arrow directions of the two pressure levels, aircraft, coastline, rising ground and aerodrome; use bold, completely legible text and consistent technical linework. No extra decorative elements, no invented numbers, and do not replace the two horizontal pressure references with a single datum.

### 11.9 QNE — Indication with Standard Pressure Selected

An altimeter may sometimes be unable to accept the prevailing QNH because its pressure-setting scale does not extend low enough. For example, a scale whose minimum is **940 hPa** cannot be adjusted to a QNH of **935 hPa**. In that situation, the standard pressure setting can be used and the indication expected at touchdown can be determined.

The term **QNE** denotes **the altimeter reading at touchdown with standard pressure set**, not the value of the standard pressure itself. In particular, **QNE is not another name for 1013 hPa**: 1013 hPa is the SPS.

The worked example uses the following conditions:

- QNH for the calculation: **930 hPa**.
- Altimeter setting used: **1013 hPa**.
- Aerodrome elevation: **100 ft AMSL**.
- Approximate ISA conversion used for the pressure interval: **27 ft per hPa**.

The difference in selected pressure is:

$$
1{,}013-930=83~\mathrm{hPa}
$$

The corresponding indicated-height difference is:

$$
83\times27~\mathrm{ft}=2{,}241~\mathrm{ft}
$$

Adding the **100 ft** aerodrome elevation gives:

$$
\mathrm{QNE}=2{,}241~\mathrm{ft}+100~\mathrm{ft}=\boxed{2{,}341~\mathrm{ft}}
$$

For an operationally rounded value, the example uses **2340 ft**. A controller's instruction is illustrated as:

> “G-CD set 1013 land with QNE 2340”

The initial **935 hPa** value illustrates an out-of-range QNH; the numerical calculation itself is made using **930 hPa**. These two values belong to different parts of the example.

## 11.10 Transition Between Altitudes and Flight Levels

**Transition** is the controlled change between two altimetry systems:

- **Altitude:** vertical position based on local QNH.
- **Flight level:** vertical position based on standard pressure, **1013 hPa**.

The change takes place at different references according to whether the aircraft is climbing or descending:

- **During climb:** change from **QNH to SPS** on reaching the **transition altitude**; thereafter express vertical position as a **flight level**.
- **During descent:** change from **SPS to QNH** on reaching the **transition level**; thereafter express vertical position as an **altitude**.

The separation of these changeover points ensures that aircraft departing and arriving can move between the two pressure-reference systems in an orderly manner. A descent clearance may provide the aerodrome QNH while the aircraft is still above the transition level, allowing vertical position to be expressed as altitude earlier when the prescribed descent procedure requires it.

## 11.11 Flight Levels

A **flight level (FL)** is a surface of constant atmospheric pressure referenced to **1013 hPa**. The standard-pressure surface is referred to as **FL0** in this treatment. Other flight levels are separated by pressure intervals equivalent to altitude increments in the Standard Atmosphere.

The flight-level examples use **500 ft intervals**, written as **FL30, FL35, FL40, FL45** and, at higher levels, **FL100, FL105, FL110**. These labels represent **pressure levels** rather than heights measured directly above the terrain.

## 11.12 Transition Altitude

The **transition altitude (TA or TAlt)** is the altitude, with **QNH set**, at which a climbing aircraft changes its altimeter to **SPS** and subsequently uses flight-level references.

Important characteristics are:

- The responsible **State authority** specifies the transition altitude for each aerodrome.
- It is established as low as practicable, but **normally not below 3000 ft** under the arrangement described here.
- It is published in the national **Aeronautical Information Publication (AIP)** and shown on applicable approach and other instrument charts.
- A State may prescribe a common transition altitude; the **United States' 18,000 ft** is the example given.

### Image Generation Prompt — Figure 11.2: Figure 11.2 Transition altitude

Create an original **side-view aviation teaching diagram**, with a simple white background, a rectangular frame, and the caption written exactly as **“Figure 11.2 Transition altitude”**. Along the bottom draw a **thick horizontal brown aerodrome ground strip** and a **small control tower near the middle-right**. A **small light-aircraft side silhouette** starts at the lower left and follows a **red dashed diagonal climbing track rising to the upper right**. Draw a **thin horizontal black dashed line** across the upper part of the panel representing the **transition altitude**. Put the purple label **“QNH set”** next to the aircraft below the transition-altitude line and **“SPS set”** above the line on the upper portion of the climb. Above or beside the dashed altitude line on the left, reproduce the explanatory wording **“Transition Altitude (decided by the State) should be as low as possible but not less than 3000 ft”**. On the right reproduce **“Transition Altitude is published in the AIP and shown on plates”**. Along the bottom add the exact central rule **“At Transition Altitude (TAlt) change from QNH to SPS. Above TAlt vertical displacement is a Flight Level”**. The ascent direction, altitude boundary and switch from QNH to SPS must be unequivocally clear. Use crisp, sufficiently large lettering and realistic simple aircraft/control-tower silhouettes; do not add other flight levels or change **3000 ft**.

## 11.13 Transition Level

The **transition level (TL or T Level)** is the flight level at which a descending aircraft changes from **SPS to the aerodrome QNH**. From that point, vertical position is reported as **altitude** rather than flight level.

The transition level is **the first available flight level above the transition altitude**. Unlike a published transition altitude, the transition level can change when **QNH changes**. In the system described, the **approach controller** determines or updates it at intervals and whenever the pressure setting requires a change. Where aerodromes are close together, they may use a common transition level.

Flight crews must be informed of the transition level:

1. **Before** reaching it during the descent.
2. As part of the **approach clearance**.
3. When the pilot **requests** the information.

### Image Generation Prompt — Figure 11.3: Figure 11.3 Transition level

Create an original, clearly legible **descent and altimeter-setting changeover illustration** captioned exactly **“Figure 11.3 Transition level”**, laid out horizontally inside a thin rectangular border on white. Put a **dark-brown horizontal runway/ground strip** along the bottom and a **small airport control tower** near the lower middle-right. Show **one aircraft near the upper-left** and **one aircraft farther down and to the right**, both pointing along a **red dashed diagonal descending track from upper left toward lower right**. Across the drawing place one **black dashed horizontal line** marking the transition level. Above the line label the higher aircraft **“SPS set”** in purple; below it label the lower aircraft **“QNH set”** in purple. In the upper-right text block write **“Transition Level* (decided by the Approach Controller)”**. In green to the left of the descending track, retain these separate original information blocks: **“* Where aerodromes are geographically close, a common T Level is used”** and **“QNH is passed by ATC in approach clearances and clearances to enter the circuit”**. Along the bottom include, word for word, **“At Transition Level (T Level) change from SPS to QNH. Below T Level vertical displacement is Altitude”**, followed by a distinct blue italic line **“T Level is the first available FL above the TAlt”**. Make the relative positions of the aircraft and the transition level unambiguous and avoid added labels or numerical levels.

## 11.14 Transition Layer

The **transition layer** is the vertical region **between the transition altitude and the transition level**. Its thickness is ordinarily small, although some States require a specified minimum depth.

The reference used to report the aircraft's level depends on the direction of flight and the pressure setting in effect:

- **Climbing through the layer:** after changing to **SPS**, report **flight level**.
- **Descending through the layer:** after changing to **QNH**, report **altitude**.

Accordingly, an aircraft does not simply use the words “altitude” or “flight level” because of its geographical position inside the layer; the distinction follows the altimeter reference that has been selected during climb or descent.

### Image Generation Prompt — Figure 11.4: Figure 11.4 Transition layer

Produce an original, precise **transition-layer schematic** captioned exactly **“Figure 11.4 Transition layer”**. Use a white background and thin grey rectangular outline. In the central section draw a **pale-green, finely dotted horizontal band** that represents the transition layer, bounded above by a **thin black horizontal dashed “Transition Level” line** and below by a lower **“Transition Altitude” boundary**. Along the bottom draw a **thick brown horizontal aerodrome ground line** with a small **control tower at its centre**. Show **two dashed diagonal flight paths crossing near the band**: an **ascending green dashed line rising from lower-left to upper-right**, starting near a small aircraft at lower-left, and a **descending red dashed line falling from upper-left to lower-right**, starting near a second small aircraft at upper-left. Label the ascending path **“Set SPS”** inside/near the layer and **“SPS set”** at the upper right. Label the descending path **“Set QNH”** above/within the layer and **“QNH set”** at the lower right. Use separate green text at the bottom **“Ascending through T Layer = FL”** and orange-red text **“Descending through T Layer = Altitude”**. Beneath both put the exact black statement **“T Layer is the airspace between the T Alt and the T Level”**. Preserve both aircraft, both diagonal directions, the layer's two distinct boundaries and every listed text label; prevent the aircraft from appearing to travel in the wrong direction or switch to the wrong pressure reference.

## 11.15 Altimeter Settings During Different Phases of Flight

### Departure and Taxi

Before departure, **ATC should supply the QNH with the taxi clearance**. The pilot uses this pressure setting for altitude information during the initial portion of the flight.

### En Route Below the Transition Altitude

An aircraft flying below the transition altitude reports its level as **altitude**, with **QNH** selected. When it travels away from the departure aerodrome, it needs pressure information appropriate to the new location rather than continuing indefinitely with an increasingly remote QNH.

The methods described include:

- **United Kingdom:** **Regional Pressure Settings (RPS)** are available to cover flight outside the vicinity of a departure aerodrome without requiring the QNH of every aerodrome along the route.
- **United States:** the pilot flying cross-country obtains updated pressure settings through contact with ATC at aerodromes in the local area.

Updating the setting maintains a reasonable relationship between indicated altitude and terrain clearance.

### En Route at Flight Levels

Above the transition altitude, an aircraft using the standard pressure reference reports its vertical position as a **flight level**. All aircraft allocated flight levels use the same pressure datum.

### Arrival and Descent

ATC supplies the destination **QNH** as part of the appropriate arrival or traffic-circuit clearances. During an ordinary descent, the vertical position continues to be expressed as a **flight level** until the aircraft reaches the transition level, after which it is expressed as **altitude**.

Following issue of an approach clearance, the pilot may be directed to use QNH and altitude earlier in the descent. This arrangement is particularly relevant to turbine-powered aircraft for which an uninterrupted descent from a higher level is operationally desirable.

## 11.16 Use of QFE in the Aerodrome Circuit

A pilot who remains within the **visual aerodrome traffic circuit** throughout the flight may select **QFE**, so that the altimeter indicates height relative to the aerodrome pressure datum rather than altitude above mean sea level.

## 11.17 Pilot and Operator Responsibilities

Flight planning must comply with the rules of the State and the flight rules applicable to the operation. The selected **IFR or VFR cruising level** must:

- Maintain **adequate terrain clearance throughout the route**.
- Meet **air traffic control requirements**.
- Agree with the applicable **table of cruising levels**.

### Checking the Altimeter Before Flight

Before departure, the pilot must confirm that the altimeter is both **serviceable and sufficiently accurate**. Set **QNH or QFE**, taking the aerodrome elevation into account when checking the QNH indication.

After moving the pressure subscale, **vibrate the instrument gently to settle the mechanism rather than tapping its glass**. With the selected reference correctly set, a satisfactory indication is:

- With **QFE**, the altimeter's height above the pressure reference point.
- With **QNH**, the elevation of the aircraft's position plus the altimeter's height above the ground at that location.

## 11.18 Permitted Altimeter Errors

The altimeter accuracy checks use the following tolerances:

| Test range | Permitted indication error |
|---|---|
| **0–30,000 ft** | **±60 ft (20 m)** |
| **0–50,000 ft** | **±80 ft (28 m)** |

## 11.19 Approach and Landing Altimetry

Before an instrument approach, the pilot must obtain the **transition level**. Before descending below that level, the pilot must also obtain the **latest aerodrome QNH**.

Using **QFE** to determine height during the last part of a runway approach is not excluded. ATC may also clear an aircraft to use **QNH above the transition level** when this is necessary to follow a specified **descent procedure**; that provision is **not intended for level flight**.

If an aircraft cleared as **number one to land** uses **QFE** for the approach, obstacle clearance height (**OCH**) is assessed with reference to **height above the aerodrome datum** for the relevant part of the flight.

On approach plates, vertical values are displayed using an **altitude above mean sea level**, with the corresponding **height above ground/aerodrome reference in parentheses**. A representative chart notation is:

**2000 (1485)**

In that notation, **2000 ft** is the altitude in AMSL and **1485 ft** is the height value in parentheses. The altitude is printed in bold type in the stated chart convention.

## 11.20 Minimum Flight Altitudes

Each State establishes and publishes minimum flight altitudes for the **ATS routes** and **Control Areas (CTAs)** within its territory. The published values appear in the State's **Aeronautical Information Publication (AIP)**.

## Questions

**1.** What minimum value is normally specified for a transition altitude?

a. 3000 ft  
b. 1000 ft  
c. 1500 ft  
d. 2000 ft

**2.** Which organization is responsible for establishing the transition level?

a. The State's aviation authority  
b. The ATC authority generally  
c. Approach Control or the Aerodrome Control Tower  
d. Area Control

**3.** Which description identifies the transition level?

a. The first available flight level above the transition altitude  
b. The highest available flight level below the transition altitude  
c. The upper limit of the aerodrome traffic zone  
d. Any level at which 1013 hPa is selected

**4.** At what point in the approach should the reported aerodrome pressure setting normally be selected?

a. At 3000 ft AMSL or 1000 ft AGL  
b. At the transition level  
c. At the transition altitude  
d. Anywhere within the transition layer

**5.** How is an aircraft's vertical position expressed when it is at or below the transition altitude?

a. As a flight level  
b. In whichever form the pilot prefers  
c. As an altitude  
d. As a height

**6.** When an aircraft is operating near the aerodrome it intends to use, how should its vertical position be expressed?

a. As a flight level at or below the transition level  
b. As a flight level at or below the transition altitude  
c. As altitude above sea level at or below the transition altitude  
d. As altitude above sea level at or above the transition altitude

**7.** On an IFR departure, when must the pilot normally change the altimeter reference from QNH to SPS?

a. While passing the transition level  
b. Only when ATC specifically orders the change  
c. On reaching the transition altitude  
d. At an unspecified point within the transition layer

**8.** Which changeover points apply when converting between altitude and flight-level references?

a. Transition level in the climb and transition altitude in the descent  
b. Transition altitude for both climb and descent  
c. Transition level for both climb and descent  
d. Transition altitude in the climb and transition level in the descent

**9.** In the system described, how is vertical position reported during a descent through the transition layer?

a. Altitude above mean sea level during climb  
b. Flight level during descent  
c. Either altitude or flight level during climb  
d. Altitude above mean sea level during descent

**10.** What determines whether vertical position is expressed as altitude or flight level while an aircraft is within the transition layer?

a. Altitude in every case  
b. Height in every case  
c. Flight level in every case  
d. The pressure reference selected on the altimeter

## Answers

| Question | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Correct option | a | c | a | b | c | c | c | d | d | d |
