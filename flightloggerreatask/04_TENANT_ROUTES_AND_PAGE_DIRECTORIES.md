# FlightLogger REA Technical Audit: 60+ Tenant Routes & Page Directory Map

**Target System:** FlightLogger Routing Subsystem (`https://app.flightlogger.net`)  
**Routing Architecture:** Scoped Path Multi-Tenancy (`/a/:tenant_slug/...`) + Global SSO Pilot Hub (`/my`)  
**Investigation Scope:** 60+ Identified Tenant Routes, Query Filter Parameters, Breadcrumbs, Access Guard RBAC  

---

## 1. Architectural Routing Hierarchy

FlightLogger organizes its URL namespace into three functional tiers:

```
                                  Platform Root (/)
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   │                                           │
          Global SSO Hub (/my)                    Tenant Namespace (/a/:tenant_slug)
          • Cross-tenant flight logs               • Silver Arrows Flight Academy (/a/trial-sa)
          • Global certificate warnings            • Dedicated scheduling, fleet, CBTA, ACI
          • Organization directory selector        • Strict boundary enforced at routing level
                   │                                           │
                   ▼                                           ▼
      Personal Identity Context                    Organizational Operations Context
```

### 1.1 Tenant Resolution Mechanism (`routes-DVnkn9x-.js`)
Extracted from REA bundle decompilation, the client-side router resolves the tenant slug through a regular expression match:
```javascript
const tenantMatch = window.location.pathname.match(/^\/a\/([^/?#]+)/);
export const currentTenant = tenantMatch ? tenantMatch[1] : null;
```
If `currentTenant` is null and the user accesses an operational route, the router redirects the browser to `/my` (if authenticated) or `/users/sign_in` (if unauthenticated).

---

## 2. Global Personal Hub Routes (`/my`)

The `/my` portal provides a unified view for a pilot, student, or instructor who may be affiliated with multiple flight academies.

| Route URL | Page Name & View Title | Authorized Roles | Functional Description & Observed Elements |
| :--- | :--- | :--- | :--- |
| `/my` | Global Dashboard | All Authenticated | High-level summary of upcoming bookings across all organizations, urgent certificate warnings, and recent flights. |
| `/my/flights` | Personal Flight History | All Authenticated | Chronological log of all flights flown as PIC, student, or instructor across all academies. |
| `/my/warnings` | My Warnings & Expirations | All Authenticated | Dedicated list of personal expiring documents (Medical Class 1/2, English Language Proficiency, 90-day passenger currency). |
| `/my/certificates` | Personal Document Vault | All Authenticated | Upload center for medicals, licenses, passports, and ratings with renewal status indicators. |
| `/my/theory` | Personal Ground School | Students / Instructors | Student progress through ground school question banks, mock exams, and lecture attendances. |
| `/my/logbook` | My Electronic Logbook | Pilots / Instructors | Personal EASA Part-FCL.050 / FAA 61.51 electronic pilot logbook with export to PDF functionality. |
| `/my/organizations` | Academy Switcher | All Authenticated | Organization switcher displaying all flight schools where the user holds an active membership. |

---

## 3. The 60+ Scoped Organization Tenant Routes (`/a/:tenant/...`)

Below is the comprehensive catalog of all 60+ tenant routes operating under `/a/:tenant_slug/`.

### 3.1 Operations, Scheduling & Airfield Dispatch (Routes 1–7)

| # | Route URL | View / Controller Title | Minimum Role | Key Page Capabilities |
| :- | :--- | :--- | :--- | :--- |
| 1 | `/a/:tenant/bookings` | Booking Calendar (Timeline) | Student | Resource Gantt timeline showing aircraft, instructor, simulator, and classroom reservations with drag-and-drop scheduling. |
| 2 | `/a/:tenant/activities/dep-arr` | Departure/Arrival Board | Staff / FI | Real-time airfield wallboard with live status badges (`scheduled`, `briefing`, `flight`, `landed`, `debriefing`, `completed`). |
| 3 | `/a/:tenant/bookings_conflict_center` | Booking Conflict Center | Staff / Admin | Gating warning center displaying bookings flagged for lapsed medicals, maintenance over-runs, or duty violations. |
| 4 | `/a/:tenant/duty_time` | Duty & Flight Time Limitations | Staff / FI | Crew duty tracker calculating rolling 7-day (60h), 28-day (190h), and 365-day (1000h) FTL limits and rest periods. |
| 5 | `/a/:tenant/operations` | Operations Command Center | Staff / Admin | Master aerodrome operational view displaying active runways, QNH, wind components, airborne count, and NOTAMs. |
| 6 | `/a/:tenant/airports` | Verified Aerodromes Directory | All Roles | Aerodrome directory (`LegitAirportSelect_LegitAirports`) listing ICAO codes, elevation, runway directions, and frequencies. |
| 7 | `/a/:tenant/airports/:icao` | Airport Profile & Specs | All Roles | Detailed airport specification: runway dimensions, surface types (asphalt/grass), fuel types (AvGas 100LL, Jet A-1), and circuits. |

---

### 3.2 Fleet Airworthiness & Maintenance (Routes 8–15)

| # | Route URL | View / Controller Title | Minimum Role | Key Page Capabilities |
| :- | :--- | :--- | :--- | :--- |
| 8 | `/a/:tenant/aircraft` | Fleet Airframe Inventory | Staff / FI | Master fleet table displaying call sign, model, current tach/Hobbs meters, airworthiness status, and countdown to next inspection. |
| 9 | `/a/:tenant/aircraft/:id` | Aircraft Airframe Profile | Staff / FI | Technical airframe dossier: serial number, year, fuel capacity, empty weight, engine/propeller specs, and ARC validity. |
| 10 | `/a/:tenant/aircraft/:id/maintenance` | Maintenance & Inspection Intervals | Staff / Admin | Service intervals tracking 50h, 100h, 200h, Annual, Pitot-Static, and ELT inspection countdowns. |
| 11 | `/a/:tenant/aircraft/:id/remarks` | Defect Remarks & Squawks | Staff / FI | Open snags, squawks, and deferred defect logs under the aircraft Minimum Equipment List (MEL). |
| 12 | `/a/:tenant/aircraft/:id/flights` | Airframe Flight Ledger | Staff / Admin | Complete history of all flights flown on this specific registration with block times and tach deltas. |
| 13 | `/a/:tenant/aircraft_models` | Aircraft Models & Types | Staff / Admin | Fleet model specifications (e.g., Cessna 172S, Diamond DA42-VI) defining class ratings and endorsement rules. |
| 14 | `/a/:tenant/aircraft_models/:id` | Model Engineering Specs | Staff / Admin | Performance parameters: cruise speeds, fuel burn curves, V-speeds (Vr, Vx, Vy, Vno, Vne), and weight & balance envelopes. |
| 15 | `/a/:tenant/camo/work_orders` | CAMO Maintenance Work Orders | Staff / Admin | Active hangar maintenance packages, work order releases, and licensed engineer sign-offs. |

---

### 3.3 Training Programs, Syllabus & CBTA Grading (Routes 16–26)

| # | Route URL | View / Controller Title | Minimum Role | Key Page Capabilities |
| :- | :--- | :--- | :--- | :--- |
| 16 | `/a/:tenant/programs` | Training Curricula Index | Staff / FI | Course directory listing all approved training courses (PPL, CPL, ATPL Integrated, Night Rating, FI). |
| 17 | `/a/:tenant/programs/:id` | Course Syllabus Hierarchy | Staff / FI | Full syllabus breakdown: phases (Basic, Solo, Nav, IFR), syllabus lessons, and master exercises. |
| 18 | `/a/:tenant/programs/:id/revisions/:rev_id` | Curriculum Revision View | Staff / Admin | NAA-approved syllabus revision with exercise requirements, minimum hours, and competency indicators. |
| 19 | `/a/:tenant/cbta/matrix` | CBTA Competency Matrix | Staff / FI | Multi-dimensional competency matrix showing student cohort performance across 8 ICAO core competencies. |
| 20 | `/a/:tenant/user_programs/:id` | Student Training Progress | Student / FI | Student flight training record: hours accrued (dual, solo, PIC, night, sim), completed sorties, and phase check status. |
| 21 | `/a/:tenant/user_lectures/:id/grade` | Flight Debrief & Grading Sheet | Flight Instructor | Dynamic grading sheet: 1–5 norm scale scoring across maneuvers, competency indicators, and debriefing remarks. |
| 22 | `/a/:tenant/theory/courses` | Ground School Course Modules | Student / GI | Ground school classroom directory tracking theoretical subjects (Air Law, Navigation, Meteorology, Human Performance). |
| 23 | `/a/:tenant/theory/exams` | Theory Question Bank & Tests | Student / GI | Mock exam generator and official ground school examination center. |
| 24 | `/a/:tenant/theory/exams/:id/attempt` | Timed Examination Session | Student | Interactive timed testing portal with multiple-choice questions, countdown timer, and automatic grading. |
| 25 | `/a/:tenant/stage_checks` | Stage Check Authorization | CFI / Examiner | Stage check queue for Chief Flying Instructors and Flight Examiners to sign off phase promotions. |
| 26 | `/a/:tenant/stage_checks/:id` | Stage Check Examination Sheet | CFI / Examiner | Formal stage check rubric with pass/fail evaluation and NAA check-ride documentation. |

---

### 3.4 Flight Registration & Pilot Logbooks (Routes 27–33)

| # | Route URL | View / Controller Title | Minimum Role | Key Page Capabilities |
| :- | :--- | :--- | :--- | :--- |
| 27 | `/a/:tenant/flight_registrations/new` | Flight Registration Modal/Form | Flight Instructor | Post-flight debrief form: start/stop tachometers, block/flight times, fuel consumed, landing counts, and grading. |
| 28 | `/a/:tenant/flights` | Academy Flight History | Staff / FI | Chronological master flight log of all sorties executed across the academy's fleet. |
| 29 | `/a/:tenant/flights/:id` | Flight Details & Route Trace | Staff / FI | Flight summary sheet displaying crew, fuel burn, engine tach deltas, landing breakdown, and ADS-B track. |
| 30 | `/a/:tenant/logbooks` | Pilot Logbooks Master Index | Staff / Admin | Administrative index of all student and instructor electronic logbooks. |
| 31 | `/a/:tenant/logbooks/:user_id` | Pilot Electronic Logbook | Student / FI | Official EASA Part-FCL.050 / FAA 61.51 logbook view showing flight times broken down into PIC, Dual, IFR, Night. |
| 32 | `/a/:tenant/logbooks/:user_id/export` | Logbook PDF Export Generator | Student / FI | Export utility generating signed, formatted PDF logbooks for civil aviation authority license applications. |
| 33 | `/a/:tenant/flights/:id/edit` | Flight Record Audit Correction | Administrator | Audited administrative correction of mistyped meter readings (creates permanent entry in audit log). |

---

### 3.5 User Directories & Personnel Folders (Routes 34–45)

| # | Route URL | View / Controller Title | Filter / Query Param | Key Page Capabilities |
| :- | :--- | :--- | :--- | :--- |
| 34 | `/a/:tenant/users` | Master Personnel Directory | None | Filterable roster of all registered users in the organization. |
| 35 | `/a/:tenant/users?type=student` | Student Pilot Directory | `type=student` | Active students: enrolled programs, total flight hours, medical validity, and active instructor assignment. |
| 36 | `/a/:tenant/users?type=instructor` | Flight Instructor Directory | `type=instructor` | Active CFIs: ratings held (FI, IRI, CRI), class endorsements, 7-day duty hours, and student roster. |
| 37 | `/a/:tenant/users?type=ground_instructor`| Theory Instructor Directory | `type=ground_instructor`| Ground school instructors, subject qualifications, and classroom schedule. |
| 38 | `/a/:tenant/users?type=administrator`| System Administrators | `type=administrator` | Academy administrators with full security and financial privileges. |
| 39 | `/a/:tenant/users?type=staff` | Operations Staff Directory | `type=staff` | Dispatchers, maintenance coordinators, and front-desk personnel. |
| 40 | `/a/:tenant/users?type=crew` | Commercial Flight Crew | `type=crew` | Charter pilots and commercial multi-crew personnel. |
| 41 | `/a/:tenant/users?type=renter` | Aircraft Renters Directory | `type=renter` | Self-hire pilots: model checkouts, 90-day currency status, and rental insurance sign-offs. |
| 42 | `/a/:tenant/users?type=guest` | Guest & Prospective Directory | `type=guest` | Prospective students, trial flight participants, and temporary visitors. |
| 43 | `/a/:tenant/users/:id` | Personnel Master Dossier | User ID | Profile summary: personal details, emergency contacts, role assignments, and account status. |
| 44 | `/a/:tenant/users/:id/certificates` | Certificate Vault | User ID | Document verification center: medical certificates, licenses, language proficiencies, and renewals. |
| 45 | `/a/:tenant/users/:id/availabilities` | Roster Availability Schedule | User ID | Weekly availability calendar templates and personal blackout date requests. |

---

### 3.6 Automated Customer Invoicing (ACI) & Finance (Routes 46–54)

| # | Route URL | View / Controller Title | Minimum Role | Key Page Capabilities |
| :- | :--- | :--- | :--- | :--- |
| 46 | `/a/:tenant/invoicing/dashboard` | Invoicing & Finance Dashboard | Staff / Admin | Unbilled activities overview, draft invoice queue, revenue charts, and payment statuses. |
| 47 | `/a/:tenant/invoicing/unbilled` | Unbilled Flight Activities | Staff / Admin | Completed sorties awaiting billing: block hours, fuel uplifts, and calculated charges based on price lists. |
| 48 | `/a/:tenant/invoicing/invoices` | Master Invoices Registry | Staff / Admin | Ledger of all draft, committed, paid, and overdue customer invoices. |
| 49 | `/a/:tenant/invoicing/invoices/:id` | Formal Invoice Document | Staff / Admin | PDF invoice preview, itemized billing lines, VAT breakdown, and payment status. |
| 50 | `/a/:tenant/invoicing/customers` | Customer Account Balances | Staff / Admin | Customer ledger displaying prepaid deposits, credit limits, and outstanding balances. |
| 51 | `/a/:tenant/invoicing/customers/:id`| Customer Financial Profile | Staff / Admin | Individual customer profile: stored Stripe payment cards, billing history, and custom price list assignment. |
| 52 | `/a/:tenant/price_lists` | Price Lists & Tariff Schedules | Administrator | Master tariff directory configuring standard aircraft rental and instructional hourly rates. |
| 53 | `/a/:tenant/price_lists/:id` | Tariff Matrix Editor | Administrator | Granular rate configuration: per-airframe wet/dry rates, instructor fees, and landing fee add-ons. |
| 54 | `/a/:tenant/reports/revenue` | Academy Financial Reports | Administrator | Fleet profitability reports, aircraft utilization hours, and revenue breakdown by training course. |

---

### 3.7 Safety Management System (SMS) (Routes 55–58)

| # | Route URL | View / Controller Title | Minimum Role | Key Page Capabilities |
| :- | :--- | :--- | :--- | :--- |
| 55 | `/a/:tenant/sms/reports` | SMS Hazard Reports Index | Student / FI | ICAO Doc 9859 safety incident registry listing confidential and open hazard reports. |
| 56 | `/a/:tenant/sms/reports/new` | File Safety Report Form | All Roles | Safety reporting form capturing event date, flight phase, airframe, weather, and incident description. |
| 57 | `/a/:tenant/sms/reports/:id` | Safety Investigation & Risk Matrix | Safety Officer | 5×5 risk assessment matrix evaluating initial vs residual severity and probability coordinates. |
| 58 | `/a/:tenant/sms/statistics` | Safety Trends & Heatmaps | Safety Officer | Incident category breakdowns (airspace busts, hard landings, bird strikes) and hazard trends. |

---

### 3.8 Document Vault & System Administration (Routes 59–64)

| # | Route URL | View / Controller Title | Minimum Role | Key Page Capabilities |
| :- | :--- | :--- | :--- | :--- |
| 59 | `/a/:tenant/documents` | Document Library | All Roles | Cloud document repository organized into public flight operations manuals, checklists, and procedures. |
| 60 | `/a/:tenant/documents/folders/:id` | Folder Document Explorer | All Roles | Folder view with document revision tracking, PDF downloads, and mandatory reading acknowledgments. |
| 61 | `/a/:tenant/warnings` | Regulatory Warnings Dashboard | Staff / Admin | Comprehensive dashboard of all active organization warnings (maintenance countdowns, expired student medicals). |
| 62 | `/a/:tenant/audit_trail` | System Audit Changelog | Administrator | Immutable chronological changelog recording every database update, timestamp, IP, and user identity. |
| 63 | `/a/:tenant/settings/general` | Organization Settings | Administrator | Academy profile, company registration, billing currency, default timezone, and system logo. |
| 64 | `/a/:tenant/settings/integrations` | External API Integrations | Administrator | API configurations for Stripe, RadarBox ADS-B, SpiderTracks satellite tracking, and SendGrid email. |
