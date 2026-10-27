# Chapter 13: SSR and ACAS

## Secondary Surveillance Radar (SSR)

### 13.1 Background

**Secondary Surveillance Radar (SSR)** supplements the information available to air traffic control from radar surveillance. The radio-navigation principles and equipment of SSR belong to the Radio Navigation syllabus, while its practical use within **air traffic services (ATS)** is part of Air Law. Radar-related ATC procedures may therefore use SSR information to improve the identification and monitoring of aircraft.

SSR developed from the wartime **Identification Friend or Foe (IFF)** system. In its original form, equipment installed in a friendly aircraft responded to a ground interrogation. Because other aircraft were not equipped to return that recognition signal, a radar operator could distinguish friendly contacts from hostile ones. The aircraft equipment acquired the nickname **“parrot”**, a term that helps explain some traditional radar phraseology.

Unlike the early recognition system, modern SSR supports the identification of individual flights. Its transmitted information can include aircraft identity codes and altitude. Available SSR functions also provide a basis for airborne collision-avoidance equipment.

### 13.2 Carriage and Use of Transponders

The aircraft unit is known as a **transponder**, a name derived from its role in transmitting an answer to an interrogation from a ground station.

When an aircraft carries an operational transponder, the applicable PANS procedures require it to be used **throughout the flight unless ATC directs otherwise**. This obligation does not depend on whether the aircraft is actually receiving an ATC service.

A State may also establish airspace or operational conditions under which carrying and operating a transponder is compulsory. Those requirements apply independently of whether the flight is receiving radar control or another ATS service.

### 13.3 SSR Modes and Codes

A conventional SSR identity code contains **four digits**. Each digit can only be **0, 1, 2, 3, 4, 5, 6 or 7**. The ground **interrogator** sends a coded signal; the airborne transponder returns the appropriate response.

SSR has several operating modes. The relevant civil identity response is **Mode A (Alpha)**, while **Mode C (Charlie)** provides altitude-reporting information. Military modes also exist, and the civil and military systems have overlapping applications. For this reason, instructions should identify **both the mode and the code**, and the pilot's readback must include both.

An example exchange is:

**ATC:** “G-CD, squawk Alpha two one six one.”

**Pilot:** “Squawking Alpha two one six one, G-CD.”

### 13.4 Squawk Ident

The **IDENT** function allows a controller to distinguish a particular aircraft's radar return without relying solely on its selected identity code. When instructed to **“squawk Ident”**, the pilot activates the IDENT control on the transponder.

**IDENT must not be selected without a radar controller's instruction.**

### 13.5 Special and Reserved SSR Codes

The four-digit code arrangement provides **4,096 possible combinations**. Certain combinations have specific internationally recognized or reserved purposes.

| Mode A code | Significance |
|---|---|
| **7700** | Emergency |
| **7600** | Radio communication failure |
| **7500** | Unlawful interference |

If an aircraft has already been identified by radar through its assigned transponder code and subsequently encounters an emergency, the pilot should **retain the identified code** rather than automatically replacing it.

Other codes are reserved for defined circumstances:

| Mode A code | Circumstance or use |
|---|---|
| **7000** | **Conspicuity code** for an aircraft, such as a VFR flight outside controlled airspace, operating where radar supports ATS but not receiving a radar service. |
| **2000** | Used when no specific code has been instructed by ATC and no different regional air-navigation agreement applies, including operation outside a radar-service or radar-control area. The chapter specifies **2000 for eastbound traffic in the North Atlantic (NAT) region**. |
| **0000** | Associated with an unserviceable transponder; selected as instructed by ATC. |

### 13.6 Altitude Reporting — Mode C (Charlie)

**Mode C** transmits an altitude reference based on the **standard pressure setting, 1013 hPa**, rather than the aircraft's locally selected altimeter pressure setting. Where the transponder is in use, its altitude-reporting function should also be selected.

During initial communication, ATC may ask the pilot to **“say aircraft level for Charlie.”** The pilot supplies the aircraft's reported level to the **nearest complete 100 ft**, allowing the controller to compare it with the level indicated by the Mode C data.

For this check, the Mode C information is treated as accurate when the difference from the stated level does not exceed **300 ft above or below** it.

### Image Generation Prompt — Figure 13.1: Figure 13.1 SSR Transponder Control Panel
>
> Create one **original, technically faithful aviation-training illustration** of an older aircraft **Mode A/Mode C transponder control unit**. Preserve the control panel's features, settings, labels and exact example code; do not replace the panel with a modern glass-cockpit display or a generic radar screen. Compose a wide rectangular annotated diagram on a pale lavender background. Across the middle place a single long, low, black horizontal transponder faceplate. At its far left show a **circular rotary function-selector knob** with the small surrounding original-style selection labels **“SBY”**, **“ON”**, **“ALT”**, **“TST”** and **“O”** visibly distinguishable where applicable. Next to it show a small illuminated rectangular annunciator labelled **“IDENT”**, and below it the small physical **Ident push button**. Continuing across the black panel show **four separate rotary code-selector controls in a row**, each with a distinct small digit window directly above; the windows must read, from left to right, **3 4 7 3**, giving Mode A code **3473**. Use contrasting crisp callout arrows, with white arrows from above identifying **“Mode A”** and **“Mode A + C”** positions; a group of four red arrows from the upper right under the exact label **“Code selectors”**, each pointing to its corresponding digit/selector; one red arrow from below left labelled **“Function selector”**; and one red arrow from below near centre labelled **“Ident”**. At lower right, in **green lettering**, include the exact two-line teaching annotation: **“This transponder is set to mode A code 3473 but is not transmitting mode C”**. Keep that statement consistent with the rotary selector's indicated setting: the selected position is **Mode A/ON, not ALT/Mode A + C**. Do not accidentally illuminate/select altitude reporting. Use clean original technical artwork and perfectly legible panel text, large enough to check every setting. Beneath the diagram reproduce the caption exactly: **“Figure 13.1”**. No invented controls, no omitted labels, no different transponder code.

### 13.7 Transponder Failure

If a transponder fails **during flight**, ATC surveillance and the quality of the service available to the aircraft may be reduced. Controllers should try to accommodate continuation along the filed flight plan to the intended destination, although restrictions may be imposed on clearances.

Where the transponder is **unserviceable before departure** and cannot be repaired, the pilot is required to:

1. **Notify ATS promptly**, preferably before filing the flight plan.
2. Enter **“N” in Item 10** of the flight plan form to indicate the relevant equipment is unavailable.
3. Follow the published procedure for obtaining any necessary **exemption from mandatory transponder-carriage rules**.
4. If the ATS authority requires it, fly **directly to the nearest suitable aerodrome** where the equipment can be repaired.

### 13.8 Changing the Selected SSR Code

The preferred procedure for changing an SSR identity code is to put the transponder's function switch into **STBY (standby)**, adjust the digits to the new assigned code, and then return the equipment to **ON** or **ALT**, as appropriate.

Some installations provide two code controllers, **A and B**, and a switch choosing the controller in service. With this arrangement, the pilot can enter the replacement code on the **inactive controller**, then select that controller with the changeover switch.

## Airborne Collision Avoidance System (ACAS)

### 13.9 Purpose and Basis of ACAS

**Airborne Collision Avoidance System (ACAS)** makes use of capabilities associated with SSR transponders to assess the proximity of other aircraft operating suitable transponder equipment. The technical system itself belongs to the aircraft warning and recording subject, whereas the pilot's response to its indications is treated under Air Law.

**ACAS carriage and use is mandatory for the relevant operations in Reduced Vertical Separation Minima (RVSM) airspace**, and operators must ensure compliance with this requirement.

### 13.10 Operational Use and Pilot Responsibility

Pilots use ACAS to identify developing collision threats, maintain awareness of nearby aircraft and help locate potentially conflicting traffic visually.

ACAS warnings and the procedures associated with them **do not transfer responsibility for the aircraft's safety away from the pilot**. The pilot remains responsible for exercising judgement and authority when selecting the action appropriate to the situation.

### 13.11 Traffic Advisories and Resolution Advisories

ACAS alerts are divided into two classes:

| Alert | Intended purpose | Pilot response |
|---|---|---|
| **Traffic Advisory (TA)** | Draws attention to nearby traffic and the possibility that the situation may develop into a resolution advisory. | **Do not manoeuvre solely because of a TA.** |
| **Resolution Advisory (RA)** | Calls for a collision-avoidance response when a conflict requires resolution. | **Respond immediately**, unless doing so would endanger the aircraft. |

Warnings of **stall**, **wind shear** and **ground proximity (GPWS)** have priority over ACAS indications.

Visual judgement must be used cautiously. An aircraft visible through the windscreen might **not be the traffic responsible for the RA**, and visual estimates of position or closing distance can be particularly unreliable at night.

### 13.12 Conflicting Resolution Advisories

If there is a conflict in the resolution advisories associated with an encounter, the pilots must **follow the RA instructions**. The ACAS equipment should provide a **reversal advisory** when necessary to resolve the conflict.

### 13.13 Coordination with Air Traffic Control

After reacting to an RA, the crew should inform **ATC as soon as cockpit workload permits**. That report should identify the RA and the **direction of any deviation** from the current flight plan.

When the conflict has ended, the crew should **return promptly to the current flight plan requirements** and advise ATC again.

An ATC instruction may occasionally conflict with an RA because the controller is unaware of the airborne avoidance instruction. When a crew cannot follow an ATC clearance or instruction **because it conflicts with an RA**, the controller must be informed.

### 13.14 Circumstances for Disregarding an RA

The procedure described here permits the pilot to disregard an RA **only after visually identifying the potential conflicting aircraft** and determining that **no change to the existing flight path is needed**. ATC must still be informed when an RA is disregarded on this basis.

### 13.15 Identifying Level Occupancy with Mode C

The ICAO criteria for determining an aircraft's reported level using Mode C are generally based on a tolerance of **±300 ft**. The chapter also notes that many Contracting States apply the stricter criterion of **±200 ft**.

The ICAO indications are interpreted as follows:

| Assessment | Mode C indication required |
|---|---|
| **Occupying an assigned level** | Within **±300 ft** of that level. |
| **Maintaining an assigned level** | Within **±300 ft** of that level. |
| **Vacating a level** | More than **300 ft** away from the previously assigned level. |
| **Passing a specified level** | Within **±300 ft** of that level during a climb or descent. |
| **Reaching an assigned level** | Within **±300 ft** of the assigned level after completion of the climb or descent. |

## Questions

**1.** When ATC instructs a pilot to select a transponder mode and code, what must the pilot include in the acknowledgement?

   a. The four-digit code alone.  
   b. Both the instructed mode and the code.  
   c. Only “ROGER”.  
   d. Only “WILCO”.

**2.** Following a complete failure of two-way radio communications, which Mode A code is to be selected?

   a. 7700  
   b. 7600  
   c. 2000  
   d. 7500

**3.** A transponder is found to be unserviceable before a flight and cannot be repaired before departure. Which statement describes the applicable procedure?

   a. The aircraft may depart only to the closest aerodrome that can carry out repairs.  
   b. The pilot declares the equipment failure on the flight plan, after which ATC seeks to accommodate the intended flight.  
   c. The aircraft may fly only by the shortest possible route.  
   d. Departure is prohibited in every case.

**4.** Which Mode A code provides the recognized indication of an aircraft emergency?

   a. 7500  
   b. 7600  
   c. 7000  
   d. 7700

**5.** Which set of SSR special-purpose codes correctly matches emergency, unlawful interference and communications failure?

   a. Emergency 7700; unlawful interference 7600; communications failure 7500.  
   b. Emergency 7500; unlawful interference 7700; communications failure 7600.  
   c. Emergency 7600; unlawful interference 7500; communications failure 7700.  
   d. Emergency 7700; unlawful interference 7500; communications failure 7600.

**6.** An aircraft carries a serviceable SSR transponder. Under the applicable procedures, when should it normally be operated?

   a. Only within airspace where ATC uses SSR.  
   b. Only while flying in controlled airspace.  
   c. Only after the pilot has received a direct ATC instruction to activate it.  
   d. Throughout flight, irrespective of whether SSR-based ATC service is being supplied.

**7.** Which transponder setting indicates radio communication failure?

   a. Mode A, code 7500.  
   b. Mode B, code 7600.  
   c. Mode A, code 7700.  
   d. Mode A, code 7600.

**8.** Which of the following is **not** a permissible Mode A code?

   a. A5555  
   b. A5678  
   c. A2345  
   d. A7777

## Answers

| Question | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| **Correct option** | **b** | **b** | **b** | **d** | **d** | **d** | **d** | **b** |
