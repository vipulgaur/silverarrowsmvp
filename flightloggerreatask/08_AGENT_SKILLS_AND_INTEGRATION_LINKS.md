# FlightLogger REA Technical Audit: 8 Agent Skills & Integration Linkages

**Target System:** FlySilverArrows Aviation Operating System  
**Knowledge & Automation Foundation:** 8 Bespoke Engineering Skills in `.agents/skills/`  
**External Integration Ecosystem:** Stripe ACI, RadarBox/SpiderTracks ADS-B, AWS S3 / Supabase Storage, SendGrid / Twilio  
**Investigation Framework:** REA Decompilation, API Contract Extraction & Agent Skill Graphing  

---

## 1. The 8 Specialized FlySilverArrows Agent Skills

To guarantee zero regression and ensure every aviation formula, regulatory rule, and user interface standard is rigorously implemented, the project repository contains **8 specialized domain skills** located in `.agents/skills/`.

Below is the detailed specification and clickable links for all 8 skills:

```
                                ┌───────────────────────────────────────┐
                                │     FlySilverArrows Master System     │
                                └──────────────────┬────────────────────┘
                                                   │
         ┌───────────────────┬─────────────────────┼─────────────────────┬───────────────────┐
         │                   │                     │                     │                   │
┌────────▼────────┐ ┌────────▼────────┐   ┌────────▼────────┐   ┌────────▼────────┐ ┌────────▼────────┐
│ 1. Scheduling   │ │ 2. Real-Time    │   │ 3. Flight       │   │ 4. Fleet        │ │ 5. CBTA         │
│    Calendar     │ │    Operations   │   │    Logging      │   │    Maintenance  │ │    Training     │
└────────┬────────┘ └────────┬────────┘   └────────┬────────┘   └────────┬────────┘ └────────┬────────┘
         │                   │                     │                     │                   │
         └───────────────────┴──────────┐   ┌──────┴─────────────────────┴───────────────────┘
                                        │   │
                               ┌────────▼───▼────────┐
                               │ 6. Safety &         │
                               │    Invoicing (ACI)  │
                               └────────┬────────────┘
                                        │
                         ┌──────────────┴──────────────┐
                         │                             │
                ┌────────▼────────┐           ┌────────▼────────┐
                │ 7. UI Design    │           │ 8. Testing &    │
                │    System       │           │    QA Standards │
                └─────────────────┘           └─────────────────┘
```

---

### 1.1 [flysilverarrows-scheduling-calendar](file:///Users/beingdheet/reatask/.agents/skills/flysilverarrows-scheduling-calendar/SKILL.md)
* **Skill Path:** `.agents/skills/flysilverarrows-scheduling-calendar/SKILL.md`
* **Domain Responsibility:** Multi-resource timeline Gantt calendar, reservation workflows, pre-flight gating engine, and collision detection.
* **Core Mechanisms Encoded:**
  * Multi-resource Gantt scheduling across airframes, flight instructors, classrooms, and FNPT II simulators.
  * PostgreSQL `EXCLUDE USING gist` range exclusion constraints preventing scheduling race conditions at the database level.
  * 7-point pre-flight gating engine verifying pilot medical certificates, 90-day 3-landing currency, type endorsements, maintenance hour limits, and rest rules.
  * Drag-and-drop collision detection with instant visual feedback and administrative conflict override logging.

---

### 1.2 [flysilverarrows-realtime-ops](file:///Users/beingdheet/reatask/.agents/skills/flysilverarrows-realtime-ops/SKILL.md)
* **Skill Path:** `.agents/skills/flysilverarrows-realtime-ops/SKILL.md`
* **Domain Responsibility:** Live airfield operations, Departure/Arrival wallboard, WebSocket event pipelines, and crew duty & FTL calculations.
* **Core Mechanisms Encoded:**
  * Real-time flight wallboard (`/a/:tenant/activities/dep-arr`) synchronizing sorties across dispatchers, hangar tablets, and flight line terminals.
  * ActionCable / Supabase Realtime channels (`DepartureArrivalChannel`, `BookingChannel`, `NotificationChannel`, `AdminAuditChannel`).
  * 6-stage flight finite state machine (`scheduled` $\to$ `briefing` $\to$ `flight` $\to$ `landed` $\to$ `debriefing` $\to$ `completed`).
  * EASA Part-FTL rolling duty calculator (rolling 7-day 60h, 28-day 190h, 365-day 1000h flight ceilings, and mandatory rest locks $\max(12\text{h}, \text{duty duration})$).

---

### 1.3 [flysilverarrows-flight-logging](file:///Users/beingdheet/reatask/.agents/skills/flysilverarrows-flight-logging/SKILL.md)
* **Skill Path:** `.agents/skills/flysilverarrows-flight-logging/SKILL.md`
* **Domain Responsibility:** Post-flight registration form, 6-way atomic database commit, and dual electronic pilot logbook synthesis.
* **Core Mechanisms Encoded:**
  * Modal flight registration dialog capturing tachometer/Hobbs meters, fuel consumed, landing counts, and exercise grades.
  * Multi-table atomic commit pipeline updating airframe meters, maintenance countdowns, CBTA scores, pilot logbooks, duty logs, and unbilled billing ledgers.
  * Synthesis of dual immutable electronic logbook records adhering strictly to EASA Part-FCL.050 and FAA 61.51 standards (Student Dual Received vs Instructor PIC).
  * Cryptographic SHA-256 signature sealing preventing unauthorized retroactive modification of completed flight records.

---

### 1.4 [flysilverarrows-fleet-maintenance](file:///Users/beingdheet/reatask/.agents/skills/flysilverarrows-fleet-maintenance/SKILL.md)
* **Skill Path:** `.agents/skills/flysilverarrows-fleet-maintenance/SKILL.md`
* **Domain Responsibility:** Fleet airworthiness management, tach/Hobbs hour meters, inspection countdowns, and defect squawk tracking.
* **Core Mechanisms Encoded:**
  * Airframe, engine, and propeller operating hour tracking ledgers.
  * Real-time inspection countdowns decrementing against 50h, 100h, 200h, Annual, Pitot-Static, and ELT service thresholds.
  * Automated regulatory grounding logic when maintenance countdown drops to $\le 0$ flight hours.
  * Defect squawk snag registry with severity classifications (Info, Warning, Grounding Defect) and CAMO Certificate of Release to Service (CRS) sign-offs.

---

### 1.5 [flysilverarrows-cbta-training](file:///Users/beingdheet/reatask/.agents/skills/flysilverarrows-cbta-training/SKILL.md)
* **Skill Path:** `.agents/skills/flysilverarrows-cbta-training/SKILL.md`
* **Domain Responsibility:** Competency-Based Training & Assessment (CBTA), 1–5 norm scale grading rubric, curriculum syllabus hierarchy, and stage-check progression.
* **Core Mechanisms Encoded:**
  * Curriculum syllabus hierarchy: Courses $\to$ Revisions $\to$ Phases $\to$ Syllabus Lessons $\to$ Master Exercises.
  * EASA/ICAO 8 Core Competencies (Knowledge, Flight Path Control, Communication, Workload Management, Situation Awareness, Problem Solving, Leadership).
  * Standardized 1–5 norm scale grading rubric with color threshold maps (Red / Amber / Green).
  * Dynamic progression engine unlocking subsequent lessons via `get_unbooked_lessons` and enforcing mandatory stage-check milestones.

---

### 1.6 [flysilverarrows-safety-invoicing](file:///Users/beingdheet/reatask/.agents/skills/flysilverarrows-safety-invoicing/SKILL.md)
* **Skill Path:** `.agents/skills/flysilverarrows-safety-invoicing/SKILL.md`
* **Domain Responsibility:** Safety Management System (SMS) hazard risk matrix and Automated Customer Invoicing (ACI) with Stripe integration.
* **Core Mechanisms Encoded:**
  * ICAO Doc 9859 compliant safety reporting portal with 5×5 hazard probability (1–5) vs severity (A–E) risk assessment matrix.
  * Pre-mitigation vs residual risk scoring ensuring risks are mitigated to As Low As Reasonably Practicable (ALARP).
  * Automated Customer Invoicing (ACI) tariff calculator computing airframe block hours, instructor fees, and landing charges.
  * Batch invoice generator producing branded PDF invoices with direct Stripe credit card charging capabilities.

---

### 1.7 [flysilverarrows-design-system](file:///Users/beingdheet/reatask/.agents/skills/flysilverarrows-design-system/SKILL.md)
* **Skill Path:** `.agents/skills/flysilverarrows-design-system/SKILL.md`
* **Domain Responsibility:** Frontend component engineering, typography, color tokens, responsive layout grids, and cockpit micro-interactions.
* **Core Mechanisms Encoded:**
  * High-performance, ultra-premium visual aesthetics built with Tailwind CSS and CSS design tokens far superior to legacy Bootstrap 5 / jQuery UI styling.
  * Cockpit-ready dark mode palette with high-contrast status badges (Emerald Green for Landed, Sky Blue for Airborne, Amber for Briefing/Warnings, Crimson for Grounded/Alerts).
  * Responsive layout grids seamlessly adapting across desktop dispatch command screens, cockpit iPads, and mobile smartphones.
  * Micro-animations and GPU-accelerated transitions providing responsive, instantaneous feedback during scheduling and flight tracking.

---

### 1.8 [flysilverarrows-testing-qa](file:///Users/beingdheet/reatask/.agents/skills/flysilverarrows-testing-qa/SKILL.md)
* **Skill Path:** `.agents/skills/flysilverarrows-testing-qa/SKILL.md`
* **Domain Responsibility:** Unit testing, integration testing, and automated QA verification for aviation math, regulatory gating, and UI components.
* **Core Mechanisms Encoded:**
  * Automated test suites verifying tachometer delta arithmetic, fuel consumption formulas, and inspection countdown decrements.
  * Comprehensive gating test harnesses verifying medical certificate expiry, 90-day passenger currency, and EASA Part-FTL duty limits.
  * Transactional rollback verification testing ensuring that failed sub-operations in the post-flight registration form do not corrupt database records.
  * End-to-end user workflow testing across all 7 operational roles and 4 specialized portals.

---

## 2. Third-Party Integration Architecture & External Linkages

FlightLogger integrates with four primary external service providers to deliver end-to-end aviation operations:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   FlySilverArrows Integration Engine                   │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────────────────┐             ┌─────────────────────────┐   │
│  │   STRIPE PAYMENTS (ACI) │             │ LIVE ADS-B TELEMETRY    │   │
│  │ • Customer Payment Cards│             │ • RadarBox Transponders │   │
│  │ • Automated Card Charge │             │ • SpiderTracks Tracking │   │
│  │ • Webhook Notifications │             │ • Auto Touchdown Detect │   │
│  └─────────────────────────┘             └─────────────────────────┘   │
│                                                                        │
│  ┌─────────────────────────┐             ┌─────────────────────────┐   │
│  │ AWS S3 / SUPABASE STORE │             │ SENDGRID & TWILIO COMMS │   │
│  │ • Private Storage Vault │             │ • Transactional Emails  │   │
│  │ • Presigned Upload URLs │             │ • PDF Invoice Delivery  │   │
│  │ • Student Document Scans│             │ • Emergency SMS Alerts  │   │
│  └─────────────────────────┘             └─────────────────────────┘   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Stripe Payments & Automated Customer Invoicing (ACI)
* **Client Library:** `js.stripe.com/v3/` (formerly `js.stripe.com/dahlia/stripe.js`).
* **Functionality:**
  * Secure tokenization of customer credit cards using Stripe Elements without sensitive card numbers touching the server.
  * Automated batch charging via `mutation chargeAciCustomers` when unbilled flight activities are drafted into invoices.
  * Webhook listener handling `payment_intent.succeeded` and `payment_intent.payment_failed` to update customer account balances in real time.

### 2.2 Live ADS-B Aviation Telemetry Feeds
* **Telemetry Providers:** RadarBox (`airnav_radarbox_logo_dark.svg`) and SpiderTracks (`stl-logo-and-text-dark.svg`).
* **Functionality:**
  * Ingests real-time transponder telemetry (Mode S / ADS-B Out) reporting aircraft GPS coordinates, ground speed, heading, and pressure altitude.
  * Automated touchdown detection: identifies when ground speed drops below 30 knots at home aerodrome, automatically transitioning sortie status from `flight` to `landed`.
  * Renders live interactive flight track maps on the Departure/Arrival board.

### 2.3 Cloud Document Vault (AWS S3 / Supabase Storage)
* **Object Store:** Private cloud storage buckets (`silverarrows-documents-vault`).
* **Functionality:**
  * Time-limited presigned upload and download URLs (`query getPresignedUrls`, `query presignedS3Url`) preventing unauthorized public access to sensitive pilot records.
  * Secure storage for medical certificates, pilot licenses, passport scans, aircraft Certificates of Airworthiness (ARC), and maintenance work orders.
  * Automated PDF generation and storage for official student training records and signed logbooks.

### 2.4 Communications & Emergency Alerting (SendGrid & Twilio)
* **Communication Gateways:** SendGrid (Email API) and Twilio (SMS API).
* **Functionality:**
  * Branded email delivery of PDF invoices, booking confirmations, and lesson debrief summaries.
  * Automated regulatory warning notifications dispatched 30 days, 15 days, and 7 days prior to medical certificate or rating expirations.
  * High-priority SMS broadcasting for sudden weather cancellations, runway closures, or immediate fleet grounding notices.

---

## 3. The Unified System Linkage Matrix

Below is the master cross-reference matrix uniting all components reverse-engineered from FlightLogger:

| Domain Subsystem | DB Entities Involved | GraphQL Operations | Tenant Routes | Managing Agent Skill | Third-Party Linkage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Resource Scheduling** | `bookings`, `booking_conflicts`, `aircraft`, `users` | `resourceBookings`, `publishBooking`, `BookingCertBlockedUserIdsQuery` | `/a/:tenant/bookings`, `/a/:tenant/bookings_conflict_center` | [scheduling-calendar](file:///Users/beingdheet/reatask/.agents/skills/flysilverarrows-scheduling-calendar/SKILL.md) | PostgreSQL GiST Engine |
| **Real-Time Airfield** | `bookings`, `flights`, `duty_records` | `OperationsQuery`, `LegitAirportSelect_LegitAirports`, `FlightBoardSortiesQuery` | `/a/:tenant/activities/dep-arr`, `/a/:tenant/operations` | [realtime-ops](file:///Users/beingdheet/reatask/.agents/skills/flysilverarrows-realtime-ops/SKILL.md) | ActionCable / Supabase Realtime |
| **Flight Logging** | `flights`, `landings`, `electronic_logbook_entries` | `submitFlightLog`, `userElectronicLogbook`, `exportEasaLogbook` | `/a/:tenant/flight_registrations/new`, `/a/:tenant/flights`, `/a/:tenant/logbooks` | [flight-logging](file:///Users/beingdheet/reatask/.agents/skills/flysilverarrows-flight-logging/SKILL.md) | SHA-256 Crypto Signatures |
| **Fleet & Airworthiness** | `aircraft`, `aircraft_models`, `maintenance_requirements`, `aircraft_remarks` | `maintenanceRequirements`, `aircraftRemarks`, `saveMaintenanceRequirements` | `/a/:tenant/aircraft`, `/a/:tenant/aircraft/:id/maintenance` | [fleet-maintenance](file:///Users/beingdheet/reatask/.agents/skills/flysilverarrows-fleet-maintenance/SKILL.md) | CAMO Work Orders |
| **CBTA Training** | `programs`, `program_revisions`, `syllabus_lessons`, `user_lectures`, `user_exercises` | `MasterList_fetchProgram`, `cbtaMatrixDataQuery`, `addMissingCategoriesToLecture` | `/a/:tenant/programs`, `/a/:tenant/cbta/matrix`, `/a/:tenant/user_programs/:id` | [cbta-training](file:///Users/beingdheet/reatask/.agents/skills/flysilverarrows-cbta-training/SKILL.md) | EASA Part-FCL Syllabus |
| **Invoicing & Finance** | `customers`, `price_lists`, `activities`, `invoices`, `invoice_items` | `fetchAciInvoicesCount`, `draftAciInvoices`, `chargeAciCustomers` | `/a/:tenant/invoicing/dashboard`, `/a/:tenant/invoicing/invoices` | [safety-invoicing](file:///Users/beingdheet/reatask/.agents/skills/flysilverarrows-safety-invoicing/SKILL.md) | Stripe Payments API |
| **Safety Management** | `sms_reports`, `hazard_logs` | `smsHazardReports`, `createSmsReport`, `closeSmsInvestigation` | `/a/:tenant/sms/reports`, `/a/:tenant/sms/statistics` | [safety-invoicing](file:///Users/beingdheet/reatask/.agents/skills/flysilverarrows-safety-invoicing/SKILL.md) | ICAO Doc 9859 Matrix |
| **Document Storage** | `user_certificates`, `document_folders`, `documents` | `getPresignedUrls`, `presignedS3Url` | `/a/:tenant/documents`, `/a/:tenant/users/:id/certificates` | [design-system](file:///Users/beingdheet/reatask/.agents/skills/flysilverarrows-design-system/SKILL.md) | AWS S3 / Supabase Storage |

---

## 4. The 9 Dedicated Pure-Backend Skills (Excluding UI)

To reconstruct the entire FlySilverArrows / FlightLogger engine strictly through backend primitives (PostgreSQL DDL, GiST exclusion constraints, PL/pgSQL stored procedures, and Fastify / FastAPI controllers), 9 specialized backend skills are maintained in `flightloggerreatask/skills/` and `.agents/skills/`:

1. **[flysilverarrows-backend-db-schema](file:///Users/beingdheet/reatask/flightloggerreatask/skills/flysilverarrows-backend-db-schema/SKILL.md):** 32-table PostgreSQL DDL, GiST range exclusion constraints (`tstzrange`), Row-Level Security (RLS) tenant isolation, custom ENUMs, and non-destructive soft-deletion rules.
2. **[flysilverarrows-backend-flight-fsm](file:///Users/beingdheet/reatask/flightloggerreatask/skills/flysilverarrows-backend-flight-fsm/SKILL.md):** 6-stage operational flight finite state machine (`scheduled` $\to$ `briefing` $\to$ `flight` $\to$ `landed` $\to$ `debriefing` $\to$ `completed`), transition guards, and WebSocket dispatch event broadcasting.
3. **[flysilverarrows-backend-atomic-commit](file:///Users/beingdheet/reatask/flightloggerreatask/skills/flysilverarrows-backend-atomic-commit/SKILL.md):** 6-way atomic post-flight debrief commit pipeline, tachometer delta verification, 50h/100h inspection decrements, dual pilot logbooks, FTL rest locks, and transactional ACID rollbacks.
4. **[flysilverarrows-backend-preflight-gating](file:///Users/beingdheet/reatask/flightloggerreatask/skills/flysilverarrows-backend-preflight-gating/SKILL.md):** 7-point pre-flight dispatch gating engine (EASA Part-MED medical validity, 90-day 3-landing currency, night currency, airframe maintenance limits, and rest rules).
5. **[flysilverarrows-backend-crew-duty-ftl](file:///Users/beingdheet/reatask/flightloggerreatask/skills/flysilverarrows-backend-crew-duty-ftl/SKILL.md):** EASA Part-FTL rolling duty calculator (7-day 60h, 28-day 190h, 365-day 1000h flight ceilings, and $\max(12\text{h}, \text{duty})$ mandatory rest lock).
6. **[flysilverarrows-backend-cbta-engine](file:///Users/beingdheet/reatask/flightloggerreatask/skills/flysilverarrows-backend-cbta-engine/SKILL.md):** Competency-Based Training & Assessment backend engine, 1–5 norm scale rubric, 8 ICAO competencies, syllabus lesson progression, and stage-check check-ride unlocks.
7. **[flysilverarrows-backend-aci-invoicing](file:///Users/beingdheet/reatask/flightloggerreatask/skills/flysilverarrows-backend-aci-invoicing/SKILL.md):** Automated Customer Invoicing (ACI) tariff calculation, hourly wet/dry rates, instructor fees, landing fees, unbilled activity batcher, and Stripe customer charging.
8. **[flysilverarrows-backend-api-rpc-contracts](file:///Users/beingdheet/reatask/flightloggerreatask/skills/flysilverarrows-backend-api-rpc-contracts/SKILL.md):** Translation of FlightLogger's 144 GraphQL queries and mutations to PostgreSQL `SECURITY DEFINER` stored procedures (RPCs) and REST endpoints.
9. **[flysilverarrows-backend-background-jobs](file:///Users/beingdheet/reatask/flightloggerreatask/skills/flysilverarrows-backend-background-jobs/SKILL.md):** Asynchronous task workers, regulatory nightly currency & maintenance crons, Stripe webhook ingestion, ADS-B telemetry polling, and headless PDF logbook compilation.

> **Operational Implementation Guide:**  
> For complete instructions on how to ingest, cache, and execute these backend skills in Google AI Studio using Argon 4, Function Calling, and Structured JSON outputs, refer to:  
> **[HOW_TO_USE_SKILLS_IN_GOOGLE_AI_STUDIO.md](file:///Users/beingdheet/reatask/flightloggerreatask/HOW_TO_USE_SKILLS_IN_GOOGLE_AI_STUDIO.md)**.
