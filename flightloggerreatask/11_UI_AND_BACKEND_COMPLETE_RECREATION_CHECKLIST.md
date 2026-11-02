# FlightLogger REA Technical Audit: UI & Backend Complete Recreation Checklist

**Target System:** FlightLogger Full System Recreation  
**Purpose:** Pure Textual Master Verification & Engineering Audit Checklist  
**Objective:** Enable 100% reproduction of FlightLogger's functionality strictly using backend primitives and modern frontend contracts  
**Format:** Exhaustive Textual Checklists, Step-by-Step Validation Rules, and Component Audit Points  

---

## 1. Master Architecture & Recreation Roadmap

This checklist provides a systematic, item-by-item verification guide to build, test, and validate the entire FlightLogger platform from the ground up:

```
┌────────────────────────────────────────────────────────────────────────┐
│            PART 1: DATABASE RECREATION CHECKLIST                       │
│  • 32 Tables • Exact Columns • Foreign Keys • GiST Exclusion Locks     │
├────────────────────────────────────────────────────────────────────────┤
│            PART 2: BACKEND ENGINES & RPCS CHECKLIST                    │
│  • 6-Stage FSM • 6-Way Atomic Commit • 7-Point Gating • FTL Engine     │
├────────────────────────────────────────────────────────────────────────┤
│            PART 3: UI FRONTENDS & PORTALS CHECKLIST                    │
│  • Timeline Gantt • Dep/Arr Board • Debrief Modal • 4 Role Portals     │
├────────────────────────────────────────────────────────────────────────┤
│            PART 4: TOOLS, APIS & THIRD-PARTY LINKAGES                  │
│  • WebSockets • Stripe ACI • ADS-B Telemetry • S3 Presigned URLs       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Part 1: Database Recreation Checklist

Verify that every database primitive exists, adheres to column specifications, and enforces relational integrity:

### 2.1 Table Existence & Relational Structure
- [ ] **Table 1: `tenants`** exists with UUID PK, unique `slug`, `name`, `base_currency`, `time_zone`, and `is_active` soft-delete flag.
- [ ] **Table 2: `users`** exists with UUID PK, foreign key to `tenants(id)`, unique `email`, `call_sign`, and `pilot_license_number`.
- [ ] **Table 3: `roles`** exists with 7 static role keys (`administrator`, `staff`, `flight_instructor`, `ground_instructor`, `crew`, `renter`, `student`).
- [ ] **Table 4: `user_roles`** exists with compound unique constraint `(tenant_id, user_id, role_id)`.
- [ ] **Table 5: `webauthn_credentials`** exists with `user_id` FK, `public_key` bytea, and `sign_count`.
- [ ] **Table 6: `aircraft_models`** exists with `class_rating` enum (`SEP_LAND`, `MEP_LAND`, `TMG`) and `usable_fuel_liters`.
- [ ] **Table 7: `aircraft`** exists with unique `(tenant_id, call_sign)`, `total_airframe_hours` decimal, `engine_hours`, and `status`.
- [ ] **Table 8: `maintenance_requirements`** exists with `aircraft_id` FK, `interval_value`, `hours_left`, and `is_critical` flag.
- [ ] **Table 9: `aircraft_remarks`** exists with `aircraft_id` FK, `reported_by_user_id` FK, `severity`, and `is_rectified`.
- [ ] **Table 10: `certificate_types`** exists with `validity_months` and `blocks_booking_on_expiry` boolean.
- [ ] **Table 11: `user_certificates`** exists with `user_id` FK, `certificate_type_id` FK, `expires_at` date, and `storage_file_path`.
- [ ] **Table 12: `certificate_warnings`** exists with `user_id` FK, `warning_code`, and `is_blocking` boolean.
- [ ] **Table 13: `programs`** exists with `tenant_id` FK, `title`, and `target_license`.
- [ ] **Table 14: `program_revisions`** exists with `program_id` FK, `revision_number`, and `is_active` flag.
- [ ] **Table 15: `program_phases`** exists with `program_revision_id` FK, `phase_order`, and `requires_stage_check` boolean.
- [ ] **Table 16: `syllabus_lessons`** exists with `phase_id` FK, `code`, `lesson_type`, and `planned_flight_hours`.
- [ ] **Table 17: `master_exercises`** exists with `lesson_id` FK, `code`, `title`, and `standard_briefing_notes`.
- [ ] **Table 18: `core_competencies`** exists with 8 rows (`KNO`, `FPA`, `FPO`, `COM`, `WLM`, `SAW`, `PRB`, `LST`).
- [ ] **Table 19: `competency_indicators`** exists with `competency_id` FK and `marker_text`.
- [ ] **Table 20: `user_programs`** exists with `student_id` FK, `program_revision_id` FK, and `status`.
- [ ] **Table 21: `user_lectures`** exists with `user_program_id` FK, `lesson_id` FK, `instructor_id` FK, and `overall_norm_grade` (1–5).
- [ ] **Table 22: `user_exercises`** exists with `user_lecture_id` FK, `exercise_id` FK, and `grade` (1–5 norm score).
- [ ] **Table 23: `graded_competencies`** exists with `user_lecture_id` FK, `competency_id` FK, and `score` (1–5 norm score).
- [ ] **Table 24: `bookings`** exists with `tenant_id` FK, `aircraft_id` FK, `instructor_id` FK, `student_id` FK, `start_time`, `end_time`, and `status`.
- [ ] **Table 25: `booking_conflicts`** exists with `booking_id` FK, `conflict_type`, `details`, and `overridden_by_user_id`.
- [ ] **Table 26: `flights`** exists with unique `booking_id` FK, `off_block_time`, `on_block_time`, `tach_start`, `tach_stop`, `tach_delta`.
- [ ] **Table 27: `landings`** exists with `flight_id` FK, `aerodrome_icao`, `day_landings`, `night_landings`, `touch_and_go_count`.
- [ ] **Table 28: `electronic_logbook_entries`** exists with `user_id` FK, `flight_id` FK, `pic_hours`, `dual_hours`, and `signature_hash`.
- [ ] **Table 29: `duty_records`** exists with `user_id` FK, `duty_start_time`, `duty_end_time`, `is_active`, and `mandatory_rest_until`.
- [ ] **Table 30: `customers`** exists with `tenant_id` FK, `user_id` FK, `account_balance`, and `stripe_customer_id`.
- [ ] **Table 31: `price_lists`** exists with `tenant_id` FK, `name`, and `currency`.
- [ ] **Table 32: `activities` & `invoices`** exists with `flight_id` FK, `customer_id` FK, `block_hours`, `amount`, and `status`.

### 2.2 Physical Integrity & Constraint Verification
- [ ] **GiST Exclusion Constraint on `aircraft_id`:** Physical check that no two non-cancelled bookings can share the same `aircraft_id` during overlapping `tstzrange(start_time, end_time)`.
- [ ] **GiST Exclusion Constraint on `instructor_id`:** Physical check that an instructor cannot be scheduled in two places simultaneously.
- [ ] **GiST Exclusion Constraint on `student_id`:** Physical check that a student cannot be scheduled in two flights simultaneously.
- [ ] **Row-Level Security (RLS):** All queries verify `tenant_id = current_tenant_id` preventing cross-tenant data leakage.

---

## 3. Part 2: Backend Engines & Business Logic Recreation Checklist

### 3.1 The 6-Stage Flight Finite State Machine (FSM)
- [ ] **Initial Stage:** Creating and publishing a booking sets `status = 'scheduled'`.
- [ ] **Transition 1 (`scheduled` $\to$ `briefing`):** Clocks in active duty timer in `duty_records`; updates board badge to Amber.
- [ ] **Transition 2 (`briefing` $\to$ `flight`):** Captures wheels-off takeoff time; locks aircraft status to `in_flight` preventing concurrent dispatch.
- [ ] **Transition 3 (`flight` $\to$ `landed`):** Captures touchdown time (manual click or ADS-B); updates board badge to Landed.
- [ ] **Transition 4 (`landed` $\to$ `debriefing`):** Captures on-block chocks-on time; triggers client modal hosting flight registration form.
- [ ] **Transition 5 (`debriefing` $\to$ `completed`):** Instructor digital signature commits atomic multi-module pipeline.
- [ ] **Illegal Jump Rejection:** Attempting to jump directly from `scheduled` to `completed` throws `InvalidStateTransitionError`.
- [ ] **Airborne Lockout:** Attempting to transition from `flight` to `completed` without recording landing throws an exception.
- [ ] **Pre-Flight Cancellation:** Cancelling from `scheduled` or `briefing` releases GiST range locks.
- [ ] **Airborne Cancellation Blocked:** Attempting to cancel an airborne aircraft is rejected.

### 3.2 The 6-Way Atomic Post-Flight Commit Pipeline
- [ ] **Transaction Atomicity:** All 6 mutations execute in a single database transaction (`BEGIN ... COMMIT`). A failure in any step rolls back all preceding writes.
- [ ] **Mutation 1 (Fleet & Tach):** Computes $\Delta \text{Tach} = \text{Tach}_{\text{stop}} - \text{Tach}_{\text{start}}$. Increments `aircraft.total_airframe_hours` and `aircraft.engine_hours`.
- [ ] **Mutation 2 (Maintenance Decrement):** Decrements `hours_left` on all active rows in `maintenance_requirements`. If $\le 0$, automatically flags `maintenance_due` on airframe.
- [ ] **Mutation 3 (CBTA Grades):** Inserts norm scores (1–5) into `user_exercises` and `graded_competencies`. If all maneuvers $\ge 3$, sets `user_lectures.status = 'passed'` and unlocks next lesson.
- [ ] **Mutation 4 (Dual Logbooks):** Synthesizes two independent, immutable rows in `electronic_logbook_entries`:
  - Student: Dual Received (or PIC if solo), Day/Night landings, IFR hours.
  - Instructor: PIC hours and Flight Instructor hours.
  - Generates SHA-256 digital signature hash locking the records.
- [ ] **Mutation 5 (Crew Duty & FTL):** Calls `stopDuty`, records duty end timestamp, calculates total duty duration, and sets `mandatory_rest_until = NOW() + max(12h, duty_duration)`.
- [ ] **Mutation 6 (ACI Invoicing):** Computes billable sortie charge: $(\text{Block Hours} \times \text{Plane Rate}) + (\text{Block Hours} \times \text{FI Rate}) + (\text{Landings} \times \text{Fee})$. Inserts record into `activities` with status `'unbilled'`.

### 3.3 The 7-Point Pre-Flight Gating Engine
- [ ] **Gate 1 (Medical Expiry):** Blocks reservation if `user_certificates.expires_at < booking.end_time` for `medical_class_1` or `medical_class_2`.
- [ ] **Gate 2 (90-Day Passenger Currency):** Audits pilot's preceding 90 days; requires $\ge 3$ landings before permitting carriage of passengers.
- [ ] **Gate 3 (Type & Class Rating):** Verifies pilot holds class endorsement (`SEP_LAND`, `MEP_LAND`) for assigned aircraft model.
- [ ] **Gate 4 (Maintenance Countdown):** Confirms that airframe `hours_left >= planned_flight_duration`. Blocks dispatch if flight would overrun inspection limit.
- [ ] **Gate 5 (FTL Rest Compliance):** Verifies `booking.start_time >= crew.mandatory_rest_until`. Blocks dispatch if rest period is violated.
- [ ] **Gate 6 (FTL Duty Ceilings):** Audits rolling 7-day (max 60h), 28-day (max 190h), and 365-day (max 1000h) limits.
- [ ] **Gate 7 (Student Solo Endorsement):** Requires instructor digital authorization within preceding 24 hours for solo sorties.

---

## 4. Part 3: UI Frontends & Specialized Portals Recreation Checklist

Verify that every user interface screen, component, and interactive visual element functions correctly:

### 4.1 Resource Timeline Gantt Calendar (`/a/:tenant/bookings`)
- [ ] **Resource Grid:** Renders horizontal timeline with rows for Aircraft, Flight Instructors, Classrooms, and Simulators.
- [ ] **Drag & Drop:** Supports dragging reservations to new time slots or resources with instantaneous collision boundary checks.
- [ ] **Visual Conflict Indicators:** Highlights overlapping or blocked slots in high-contrast Crimson (`#dc2626`) with conflict reason tooltips.
- [ ] **View Modes:** Toggle between Day View (15-min intervals), Week View, and Month View.
- [ ] **Filter Controls:** Ability to filter by aircraft model (`C172`, `DA42`), airfield location, or instructor certification.

### 4.2 Live Airfield Departure/Arrival Board (`/a/:tenant/activities/dep-arr`)
- [ ] **Real-Time Synchronisation:** Subscribes to WebSocket channel `DepartureArrivalChannel`. Automatically re-renders upon receiving `SORTIE_STATUS_UPDATED`.
- [ ] **Cockpit Status Badges:**
  - `scheduled`: Slate Gray (`#475569`)
  - `briefing`: Amber Warning (`#f59e0b`)
  - `flight`: Sky Blue Airborne (`#0284c7`)
  - `landed`: Emerald Green Landed (`#10b981`)
  - `debriefing`: Royal Purple Debrief (`#8b5cf6`)
  - `completed`: Dark Forest Green (`#059669`)
- [ ] **Airfield Banner:** Displays active runway in use (e.g., `RWY 28L`), current surface wind heading/knots, and QNH altimeter setting.
- [ ] **Elapsed Flight Timers:** Live counting timer displaying elapsed airborne duration since wheels-off.

### 4.3 Post-Flight Registration Modal (`flightRegistration`)
- [ ] **Meter Inputs:** Numerical input fields for starting and stopping Tachometer and Hobbs meters.
- [ ] **Delta Auto-Calculation:** Automatically calculates and displays $\Delta \text{Tach} = \text{Tach}_{\text{stop}} - \text{Tach}_{\text{start}}$ in real time.
- [ ] **Discrepancy Warning:** Flags yellow warning if entered `tach_start` differs from preceding flight's recorded `tach_stop`.
- [ ] **Landing Counter:** Interactive touch buttons to increment Day Dual, Day Solo, Night Dual, and Night Solo landings.
- [ ] **Fuel Consumption:** Starting fuel, uplifted fuel, and arrival fuel inputs with automatic fuel burn calculation.
- [ ] **CBTA Norm Grade Buttons:** 1–5 touch button group for each syllabus maneuver with color encodings (1–2 Red, 3 Amber, 4–5 Green).
- [ ] **Digital Sign-Off:** CFI signature input and password challenge prior to enabling the "Sign & Complete" button.

### 4.4 CBTA Competency Radar & Progress Visualization
- [ ] **8-Axis Polygon Radar Chart:** Renders visual spider web mapping scores across Knowledge, Flight Path Control, Communication, Workload Management, Situation Awareness, Problem Solving, and Leadership.
- [ ] **Syllabus Progress Ring:** Circular progress bar illustrating completed dual vs solo flight hours against syllabus targets.
- [ ] **Stage Check Milestone:** Visual checkmark badge indicating student readiness for Chief Flight Instructor (CFI) phase promotion check-ride.

### 4.5 Pilot Electronic Logbook (`/a/:tenant/logbooks/:id`)
- [ ] **Official EASA Format:** Columns match EASA Part-FCL.050 order (Date, Aircraft Type, Registration, Dep/Arr, Total Time, PIC, Dual, Night, IFR).
- [ ] **Role Separation:** Automatic segregation of hours into Pilot-in-Command vs Dual Instruction Received.
- [ ] **PDF Export Utility:** Generates downloadable, printable, vector-crisp PDF logbook pages certified for civil aviation license issuance.

### 4.6 The 4 Role-Based Dedicated Portals
- [ ] **Student Portal (`/a/:tenant/user_programs/:id`):** Displays enrolled syllabus, upcoming bookings, personal medical warning shield, CBTA radar, and account balance. Blocks access to fleet management and billing settings.
- [ ] **CFI Operations Portal (`/a/:tenant/activities/dep-arr`):** Prominent duty clock-in/out header, live departure board, debrief form modal trigger, and solo student endorsement signer.
- [ ] **Ground Instructor Portal (`/a/:tenant/theory/courses`):** Ground school subject classroom roster, digital attendance register, and timed theory examination unlocking terminal.
- [ ] **Administrator Hub (`/a/:tenant/invoicing/dashboard`):** Fleet airworthiness dashboard, maintenance work order generator, tariff price list editor, unbilled activity batcher, and immutable audit changelog viewer.

---

## 5. Part 4: Tools, APIs & Third-Party Linkages Recreation Checklist

Verify that all external services, communication channels, and API bridges operate reliably:

### 5.1 Real-Time WebSockets (`/a/:tenant/cable`)
- [ ] **Handshake & Heartbeat:** WebSocket client successfully connects, subscribes with `{"command": "subscribe", "identifier": "..."}`, and replies to 3-second heartbeat pings.
- [ ] **Channel 1 (`DepartureArrivalChannel`):** Broadcasts `SORTIE_STATUS_UPDATED` and `RUNWAY_CHANGED` events.
- [ ] **Channel 2 (`BookingChannel`):** Broadcasts `BOOKING_PUBLISHED` and `BOOKING_CANCELLED` events.
- [ ] **Channel 3 (`NotificationChannel`):** Delivers direct user notifications for expiring medicals and solo flight clearances.
- [ ] **Channel 4 (`AdminAuditChannel`):** Broadcasts maintenance alerts when an airframe's inspection countdown reaches zero.

### 5.2 Stripe Payments & Automated Customer Invoicing (ACI)
- [ ] **Stripe Elements Integration:** Tokenizes customer credit cards securely on `/a/:tenant/invoicing/customers/:id` without raw card data reaching the backend.
- [ ] **Automated Invoice Batching:** Batches completed unbilled sorties into formal PDF invoices.
- [ ] **Direct Card Charge:** Calling `mutation chargeAciCustomers` triggers Stripe `PaymentIntent` API, charging the customer's default payment method.
- [ ] **Webhook Handling:** Listens to `payment_intent.succeeded` to transition invoice status to `'paid'` and update customer account balance.

### 5.3 Live ADS-B Aviation Telemetry Feeds
- [ ] **Transponder Ingestion:** Ingests live ADS-B Out / Mode S telemetry (RadarBox / SpiderTracks APIs) reporting GPS position, altitude, ground speed, and heading.
- [ ] **Automated Touchdown Detection:** Automatically detects when an active aircraft touches down at its destination aerodrome ($< 30$ knots ground speed), transitioning sortie status from `flight` to `landed`.

### 5.4 Cloud Document Storage (AWS S3 / Supabase Storage)
- [ ] **Private Storage Buckets:** All student medical certificates, licenses, and aircraft maintenance work orders are stored in private, unguessable storage buckets.
- [ ] **Presigned URL Generation:** Calling `query getPresignedUrls` generates temporary, expiring authenticated URLs (valid for 15 minutes) for document downloads.
- [ ] **Direct Client Upload:** Calling `query presignedS3Url` generates authenticated `PUT` upload URLs for student document scans.

### 5.5 Transactional Communications (SendGrid & Twilio)
- [ ] **Transactional Email (SendGrid):** Automatically dispatches branded PDF invoices, lesson debriefing summaries, and 30-day medical renewal reminders.
- [ ] **Emergency SMS Alerts (Twilio):** Sends instantaneous high-priority SMS notifications to affected pilots in the event of sudden weather grounding, aircraft defect grounding, or runway closure.
