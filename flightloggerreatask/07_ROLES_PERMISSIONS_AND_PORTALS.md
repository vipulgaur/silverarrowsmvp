# FlightLogger REA Technical Audit: 7 Roles Matrix & 4 Specialized Portals

**Target System:** FlightLogger Authorization & Portal Subsystems  
**Authorization Architecture:** 7-Tier Role-Based Access Control (RBAC) with Path-Scoped Security Boundaries  
**Investigation Scope:** 7 Operational Roles, Granular Permission Capability Matrix, 4 Tailored Operational Portals  
**Compliance Standards:** EASA Part-FCL, Part-DTO, Part-ORA & FAA Part 141 Organizational Structures  

---

## 1. The 7 Operational Roles in FlightLogger

FlightLogger organizes aviation personnel into seven distinct operational roles. Users can hold multiple roles simultaneously within an academy (e.g., an individual may serve as both a `flight_instructor` and an `administrator`).

```
                              [Administrator]
                     Accountable Manager / Head of Training
                                     │
                     ┌───────────────┴───────────────┐
                     │                               │
                  [Staff]                         [Crew]
             Dispatch & Operations        Commercial Charter Crew
                     │                               │
        ┌────────────┴────────────┐                  │
        │                         │                  │
[Flight Instructor]      [Ground Instructor]         │
  CFI / FI / TRI           Theory / ATPL GI          │
        │                         │                  │
        └────────────┬────────────┘                  │
                     │                               │
            ┌────────┴────────┐                      │
            │                 │                      │
        [Student]          [Renter] ◄────────────────┘
       Ab-Initio /      Aircraft Self-Hire
      Modular Cadet           Pilot
```

### 1.1 Detailed Role Responsibilities

| Role Identifier | Aviation Title / Designation | Primary Operational Mandate |
| :--- | :--- | :--- |
| `administrator` | Accountable Manager / Head of Training | Master system authority: manages academy settings, price lists, fleet inventory, user permissions, and regulatory audit logs. |
| `staff` | Operations Coordinator / Dispatcher | Day-to-day airfield dispatch: manages the live booking calendar, monitors aircraft maintenance countdowns, and oversees customer invoicing. |
| `flight_instructor`| Certified Flight Instructor (CFI / FI / IRI) | Executes flight training: clocks in duty, conducts pre-flight briefings, grades students on the 1–5 CBTA norm scale, signs logbooks, and endorses solo flights. |
| `ground_instructor`| Ground School Theory Instructor | Delivers theoretical classroom training: conducts subject lectures, unlocks question bank mock tests, and signs off exam attendance. |
| `crew` | Commercial Air Charter Crew | Commercial multi-crew flight execution: logs commercial block times, manages passenger manifests, and complies with Part-FTL flight duty ceilings. |
| `renter` | Aircraft Self-Hire Pilot | Licensed pilot hiring club aircraft: books personal rental slots, conducts pre-flight inspections, and views personal electronic logbooks. |
| `student` | Ab-Initio / Modular Flight Student | Cadet pilot enrolled in syllabus courses: tracks flight progress, views debriefing feedback, attends theory lectures, and reviews account balances. |

---

## 2. Comprehensive RBAC Capability Matrix

Below is the complete capability matrix reverse-engineered from FlightLogger's access guard controllers:

| Functional Capability Domain | Student | Renter | Ground Inst. | Flight Inst. | Staff | Crew | Administrator |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Booking Calendar** | | | | | | | |
| View own bookings | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View all tenant bookings | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create personal booking request | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Reschedule / Cancel own booking | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Override booking gating conflicts | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Administratively lock aircraft/sim slot | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Airfield Dispatch & Dep/Arr Board**| | | | | | | |
| View Departure/Arrival Board | View Only | View Only | View Only | ✅ | ✅ | ✅ | ✅ |
| Clock-in / Clock-out Duty (`startDuty`) | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Update flight stage (`briefing` $\to$ `flight` $\to$ `landed`)| ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Change active runway in use | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Fleet & Maintenance** | | | | | | | |
| View fleet availability and tach meters| ❌ | View Only | ❌ | ✅ | ✅ | ✅ | ✅ |
| View maintenance countdowns (50h/100h) | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Report defect squawk / snag | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Sign-off defect rectification (CRS) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (CAMO) |
| Calibrate tachometer meter reading | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Training Programs & CBTA Grading** | | | | | | | |
| View personal syllabus progress | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| Grade student flight (1–5 norm rubric)| ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Inject unmapped exercise categories | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Endorse student for solo flight | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Sign off formal syllabus stage check | ❌ | ❌ | ❌ | CFI Only | ❌ | ❌ | ✅ (Examiner) |
| Edit master syllabus curriculum | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Theory School & Examinations** | | | | | | | |
| Attempt practice question banks | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Unlock formal examination session | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Certify classroom lecture attendance | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Logbooks & Debriefing** | | | | | | | |
| Submit post-flight registration form | ❌ | Self-Hire | ❌ | ✅ | ✅ | ✅ | ✅ |
| View personal electronic logbook | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Export official EASA/FAA logbook PDF | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Edit signed flight records (Audit mod) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Invoicing, Tariffs & Stripe (ACI)** | | | | | | | |
| View personal account balance & bills | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| View academy unbilled flight activities | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Generate draft PDF invoice batch | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Trigger Stripe customer card charges | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Edit hourly aircraft/instructor tariffs | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Safety & Administration** | | | | | | | |
| Submit confidential SMS hazard report| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Investigate SMS report (5×5 matrix) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Safety Mgr |
| View immutable system audit changelog | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 3. The 4 Specialized Operational Portals

FlightLogger dynamically configures its user interface depending on the user's primary active role, delivering four purpose-built portal experiences:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FLIGHTLOGGER APP SHELL                          │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────────────────┐             ┌─────────────────────────┐   │
│  │     STUDENT PORTAL      │             │  CFI OPERATIONS PORTAL  │   │
│  │ • Personal Syllabus     │             │ • Live Dep/Arr Board    │   │
│  │ • 1-5 Competency Radar  │             │ • 1-5 CBTA Grade Sheet  │   │
│  │ • Medical/Rating Alerts │             │ • Post-Flight Register  │   │
│  │ • EASA Logbook Export   │             │ • Solo Flight Endorser  │   │
│  └─────────────────────────┘             └─────────────────────────┘   │
│                                                                        │
│  ┌─────────────────────────┐             ┌─────────────────────────┐   │
│  │ GROUND INSTRUCTOR HUB   │             │  ADMINISTRATOR HUB      │   │
│  │ • Classroom Attendance  │             │ • Fleet & Maintenance   │   │
│  │ • Question Bank Manager │             │ • ACI Automated Billing │   │
│  │ • Timed Exam Proctoring │             │ • Price Lists & Tariffs │   │
│  │ • Theory Progress Sign  │             │ • Immutable Audit Logs  │   │
│  └─────────────────────────┘             └─────────────────────────┘   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 3.1 Portal 1: Student Pilot Portal
Designed to provide cadet pilots with full transparency over their flight training journey without exposing administrative or sensitive fleet data.

#### Key Dashboard Components:
1. **Course Progress Gauge:** Real-time visual progress ring tracking dual, solo, cross-country, night, and simulated instrument hours against NAA curriculum requirements.
2. **Next Eligible Lesson Card:** Automatically rendered via `query get_unbooked_lessons`, presenting the upcoming syllabus flight exercise, briefing notes, and preparation reading materials.
3. **Medical & Currency Shield:** Prominently displays days remaining on EASA/FAA Class 1 or 2 Medical, English Language Proficiency, and passport validity. A color-coded status badge turns amber at $\le 30$ days and red at expiration.
4. **CBTA Competency Radar:** Interactive polygon radar chart illustrating the cadet's evaluated strength across the 8 ICAO core competencies (Situation Awareness, Communication, Flight Path Control, Workload Management).
5. **Electronic Logbook Viewer:** Instant preview of signed flight hours with single-click PDF export formatted to official civil aviation authority standards.

---

### 3.2 Portal 2: Flight Instructor (CFI) Operations Portal
Optimized for cockpit iPads and airfield flight line operations, prioritizing fast data entry, debriefing efficiency, and regulatory compliance.

#### Key Dashboard Components:
1. **Active Duty Header:** Prominent duty timer showing elapsed flight duty period (FDP) and rolling 7-day/28-day allowable hours, with instantaneous "Clock In" and "Clock Out" buttons.
2. **Daily Flight Sortie Roster:** Visual timeline of the instructor's scheduled sorties for the day, pre-linked to student syllabi, aircraft registrations, and airfield weather.
3. **Interactive Debriefing Modal (`flightRegistration`):**
   - High-contrast numerical inputs for starting and stopping tachometer/Hobbs meters with automatic delta validation.
   - Dynamic landing counters (day dual, day solo, night dual, night solo).
   - Fuel burn and oil consumption inputs.
4. **CBTA 1–5 Norm Scale Grade Sheet:** Rapid touch-friendly button group (1: Unsat, 2: Marginal, 3: Competent, 4: Proficient, 5: Exemplary) for each assigned exercise maneuver.
5. **Solo Flight Endorsement Gateway:** EASA FCL.020 compliant digital sign-off module allowing the instructor to authorize a student for solo circuit or cross-country sorties with customized crosswind and visibility limits.

---

### 3.3 Portal 3: Ground Instructor (Theory) Portal
Focused on classroom lecture delivery, ATPL theoretical knowledge progress tracking, and examination proctoring.

#### Key Dashboard Components:
1. **Subject Lecture Schedule:** Calendar of theoretical knowledge modules (Air Law, Aircraft General Knowledge, Flight Planning, Meteorology, Navigation, Operational Procedures, Principles of Flight, Human Performance, Communications).
2. **Digital Attendance Sheet:** One-click roster check-in allowing instructors to certify student physical or virtual classroom attendance.
3. **Theory Examination Proctoring Hub:**
   - Unlocks timed, randomized multiple-choice mock or formal exams for authorized students.
   - Live proctoring monitor showing students currently taking tests and remaining time.
   - Automatic grading engine issuing official pass certificates upon achieving $\ge 75\%$.

---

### 3.4 Portal 4: Administrator & Accountable Manager Master Hub
Comprehensive oversight terminal for ATO leadership, CAMO maintenance managers, and finance directors.

#### Key Dashboard Components:
1. **Fleet Airworthiness & Maintenance Command:**
   - Real-time fleet status table displaying call signs, current tachometers, and live countdowns to 50h, 100h, and annual inspections.
   - Defect snag squawk log with grounding controls and licensed engineer release-to-service sign-offs.
2. **Automated Customer Invoicing (ACI) Suite:**
   - Unbilled activities queue calculating billable amounts from logged block hours and customer price lists.
   - Automated invoice batch generator producing branded PDF invoices with integrated Stripe card charging.
3. **Personnel & Certificate Vault:** Comprehensive audit of all instructor and student licenses, ratings, and medicals with automated reminder broadcasting.
4. **Immutable Audit Trail (`/a/:tenant/audit_trail`):** Cryptographic chronological log of every booking modification, grade adjustment, tachometer correction, and administrative override.
