# FlightLogger REA Technical Audit: Comprehensive Test Specification & Verification Matrix

**Target System:** FlightLogger / FlySilverArrows Complete Stack  
**Scope:** 100% Verification Coverage for Database Presences, Columns, Rows, Tables, Backend Engines, UI Interactions, Tools & Linkages  
**Objective:** Provide a turnkey verification blueprint enabling complete system reproduction from backend primitives alone  
**Standards:** EASA Part-FCL, Part-DTO, Part-ORA, FAA Part 141, and ICAO Doc 9859 Regulatory Verification  

---

## 1. Testing Philosophy & Verification Framework

In an aviation operating system, testing is not merely software quality assurance—it is civil aviation regulatory compliance. A software defect that allows an expired medical to be dispatched or incorrectly calculates an airframe tachometer reading can lead to mandatory aircraft grounding, regulatory fines, or fatal accidents.

To recreate the entire system with just the backend, this specification provides complete verification coverage across six testing tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│             TIER 1: DATABASE SCHEMA & INTEGRITY AUDIT                  │
│ • 32 Relational Tables • All Column Definitions • GiST Exclusion Locks │
├────────────────────────────────────────────────────────────────────────┤
│             TIER 2: CORE BUSINESS ENGINES & FSM TESTS                  │
│ • 6-Stage Flight FSM • 6-Way Atomic Debrief Commit • Pre-Flight Gating │
├────────────────────────────────────────────────────────────────────────┤
│             TIER 3: REGULATORY AVIATION MATH SUITES                    │
│ • Tach/Hobbs Deltas • 50h/100h Countdowns • EASA Part-FTL Rolling Calc │
├────────────────────────────────────────────────────────────────────────┤
│             TIER 4: 144 GRAPHQL OPERATIONS & RPC SUITES                │
│ • Duty, Gating, CBTA, Fleet, Invoicing, Storage, Auth Contracts        │
├────────────────────────────────────────────────────────────────────────┤
│             TIER 5: REAL-TIME WEBSOCKETS & PERSISTENCE                 │
│ • ActionCable Channels • Status Badges • Redux Persist Rehydration     │
├────────────────────────────────────────────────────────────────────────┤
│             TIER 6: UI COMPONENTS, WORKFLOWS & PORTALS                 │
│ • Gantt Timeline • Dep/Arr Board • Debrief Modal • 4 RBAC Portals      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Tier 1: Database Presence, Columns, Tables & Usages

### 2.1 The 32 Relational Tables Verification Checklist

Every single table must exist with exact column naming, primary keys, and foreign key references. Below is the full verification matrix:

| Table # | Table Name | Required Primary Key | Critical Columns to Verify | Foreign Key Dependencies | Soft Delete Column |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 1 | `tenants` | `id UUID` | `slug`, `name`, `ato_dto_approval_number`, `base_currency`, `time_zone` | None (Root Entity) | `is_active` |
| 2 | `users` | `id UUID` | `tenant_id`, `email`, `first_name`, `last_name`, `call_sign`, `date_of_birth`, `pilot_license_number` | `tenants(id)` | `is_active`, `status` |
| 3 | `roles` | `id VARCHAR(32)` | `description`, `default_permissions` | None | None (System Static) |
| 4 | `user_roles` | `id UUID` | `tenant_id`, `user_id`, `role_id`, `status`, `joined_at` | `tenants(id)`, `users(id)`, `roles(id)` | `status` |
| 5 | `webauthn_credentials` | `id VARCHAR(255)` | `user_id`, `public_key`, `sign_count`, `device_name` | `users(id)` | None |
| 6 | `aircraft_models` | `id UUID` | `tenant_id`, `manufacturer`, `model_name`, `class_rating`, `engine_type`, `usable_fuel_liters` | `tenants(id)` | None |
| 7 | `aircraft` | `id UUID` | `tenant_id`, `model_id`, `call_sign`, `serial_number`, `total_airframe_hours`, `engine_hours`, `status` | `tenants(id)`, `aircraft_models(id)` | `deleted_at`, `status` |
| 8 | `maintenance_requirements`| `id UUID` | `aircraft_id`, `title`, `interval_type`, `interval_value`, `hours_left`, `is_critical` | `aircraft(id)` | None |
| 9 | `aircraft_remarks` | `id UUID` | `aircraft_id`, `reported_by_user_id`, `headline`, `severity`, `is_rectified` | `aircraft(id)`, `users(id)` | `is_rectified` |
| 10 | `certificate_types` | `id VARCHAR(64)` | `name`, `issuer`, `validity_months`, `blocks_booking_on_expiry` | None | None |
| 11 | `user_certificates` | `id UUID` | `user_id`, `certificate_type_id`, `certificate_number`, `issue_date`, `expires_at`, `storage_file_path` | `users(id)`, `certificate_types(id)` | None |
| 12 | `certificate_warnings` | `id UUID` | `tenant_id`, `user_id`, `certificate_type_id`, `warning_code`, `is_blocking` | `tenants(id)`, `users(id)` | None |
| 13 | `programs` | `id UUID` | `tenant_id`, `title`, `code`, `target_license` | `tenants(id)` | None |
| 14 | `program_revisions` | `id UUID` | `program_id`, `revision_number`, `approved_by_naa`, `effective_date`, `is_active` | `programs(id)` | `is_active` |
| 15 | `program_phases` | `id UUID` | `program_revision_id`, `phase_order`, `title`, `requires_stage_check` | `program_revisions(id)` | None |
| 16 | `syllabus_lessons` | `id UUID` | `phase_id`, `lesson_order`, `code`, `title`, `lesson_type`, `planned_flight_hours` | `program_phases(id)` | None |
| 17 | `master_exercises` | `id UUID` | `lesson_id`, `exercise_order`, `code`, `title`, `standard_briefing_notes` | `syllabus_lessons(id)` | None |
| 18 | `core_competencies` | `id VARCHAR(16)` | `name`, `description` | None | None |
| 19 | `competency_indicators` | `id UUID` | `competency_id`, `marker_text` | `core_competencies(id)` | None |
| 20 | `user_programs` | `id UUID` | `tenant_id`, `student_id`, `program_revision_id`, `enrolled_date`, `status` | `tenants(id)`, `users(id)`, `program_revisions(id)` | `status` |
| 21 | `user_lectures` | `id UUID` | `user_program_id`, `lesson_id`, `instructor_id`, `flight_id`, `status`, `overall_norm_grade` | `user_programs(id)`, `syllabus_lessons(id)`, `users(id)` | `status` |
| 22 | `user_exercises` | `id UUID` | `user_lecture_id`, `exercise_id`, `grade`, `remarks` | `user_lectures(id)`, `master_exercises(id)` | None |
| 23 | `graded_competencies` | `id UUID` | `user_lecture_id`, `competency_id`, `score`, `evidence_notes` | `user_lectures(id)`, `core_competencies(id)` | None |
| 24 | `bookings` | `id UUID` | `tenant_id`, `aircraft_id`, `instructor_id`, `student_id`, `start_time`, `end_time`, `status` | `tenants(id)`, `aircraft(id)`, `users(id)` | `status` |
| 25 | `booking_conflicts` | `id UUID` | `booking_id`, `conflict_type`, `details`, `overridden_by_user_id` | `bookings(id)`, `users(id)` | None |
| 26 | `flights` | `id UUID` | `booking_id`, `aircraft_id`, `off_block_time`, `on_block_time`, `tach_start`, `tach_stop`, `tach_delta` | `bookings(id)`, `aircraft(id)` | None |
| 27 | `landings` | `id UUID` | `flight_id`, `aerodrome_icao`, `day_landings`, `night_landings`, `touch_and_go_count` | `flights(id)` | None |
| 28 | `electronic_logbook_entries`| `id UUID` | `user_id`, `flight_id`, `flight_date`, `total_time_hours`, `pic_hours`, `dual_hours`, `signature_hash` | `users(id)`, `flights(id)` | None |
| 29 | `duty_records` | `id UUID` | `tenant_id`, `user_id`, `duty_start`, `duty_end`, `is_active`, `mandatory_rest_until` | `tenants(id)`, `users(id)` | `is_active` |
| 30 | `customers` | `id UUID` | `tenant_id`, `user_id`, `billing_name`, `account_balance`, `stripe_customer_id` | `tenants(id)`, `users(id)` | None |
| 31 | `price_lists` | `id UUID` | `tenant_id`, `name`, `currency` | `tenants(id)` | None |
| 32 | `activities` / `invoices` | `id UUID` | `flight_id`, `customer_id`, `block_hours`, `amount`, `status` | `flights(id)`, `customers(id)` | `status` |

---

## 3. Tier 2: Core State Machine & Atomic Pipeline Test Suites

### 3.1 Test Suite: 6-Stage Flight Finite State Machine (FSM)
* **Goal:** Verify that sorties only advance through strictly legal state progressions and that illegal transitions are blocked.
* **Test Cases:**
  1. `FSM_01 (Legal Lifecycle):` `scheduled` $\to$ `briefing` $\to$ `flight` $\to$ `landed` $\to$ `debriefing` $\to$ `completed` succeeds.
  2. `FSM_02 (Illegal Jump Blocked):` Transitioning directly from `scheduled` to `completed` throws `InvalidStateTransitionError: Cannot jump from scheduled to completed`.
  3. `FSM_03 (Airborne Jump Blocked):` Transitioning directly from `flight` to `completed` without recording landing time throws `InvalidStateTransitionError: Aircraft is airborne; touchdown required before debriefing`.
  4. `FSM_04 (Cancellation from Scheduled):` Transitioning from `scheduled` to `cancelled` releases GiST resource locks and updates reason.
  5. `FSM_05 (Cancellation from Airborne Forbidden):` Attempting to cancel an airborne sortie throws `IllegalCancellationError: Airborne aircraft cannot be cancelled; must record landing`.

### 3.2 Test Suite: 6-Way Atomic Post-Flight Commit Pipeline
* **Goal:** Ensure all 6 cascading operations execute inside a single atomic PostgreSQL transaction.
* **Test Cases:**
  1. `ATOMIC_01 (Happy Path Multi-Commit):`
     - Given flight on `OY-AAA` with $\text{Tach}_{\text{start}} = 1050.0$, $\text{Tach}_{\text{stop}} = 1051.5$ ($\Delta = 1.5$h) and 3 landings.
     - When `submitFlightLog` is called with exercise norm scores $[4, 3, 5]$.
     - Then:
       * `aircraft.total_airframe_hours` increments by exactly $1.50$.
       * `aircraft.total_landings` increments by $3$.
       * `maintenance_requirements.hours_left` on 50h inspection decrements by $1.50$.
       * `user_exercises` records norm grades.
       * `electronic_logbook_entries` creates 2 rows (Student Dual Received $1.5$h; Instructor PIC $1.5$h).
       * `duty_records` stops active duty timer and sets `mandatory_rest_until = NOW() + 12h`.
       * `activities` inserts unbilled flight activity with amount $= (1.5 \times \$180) + (1.5 \times \$60) + (3 \times \$15) = \$405.00$.
  2. `ATOMIC_02 (Transactional Rollback on Failure):`
     - If the billing or logbook step encounters a constraint violation (e.g. database foreign key error), **all database writes must roll back**.
     - Verify: `aircraft.total_airframe_hours` remains at $1050.0$, no logbook row is inserted, and no partial activity is committed.

---

## 4. Tier 3: Regulatory Aviation Math Test Suites

### 4.1 Airframe Tachometer & Maintenance Decrement Math
* **Test Cases:**
  1. `TACH_01 (Delta Calculation):` $1245.8 - 1244.2 = 1.60$ hours.
  2. `TACH_02 (Negative Delta Rejection):` $\text{Tach}_{\text{stop}} < \text{Tach}_{\text{start}}$ throws `NegativeTachDeltaError`.
  3. `TACH_03 (Excessive Duration Sanity):` $\Delta \text{Tach} > 12.0$ hours requires administrative confirmation flag.
  4. `MAINT_01 (Countdown Decrement):` If `hours_left = 3.2` and $\Delta = 1.5$, new `hours_left = 1.7`.
  5. `MAINT_02 (Zero Hours Grounding):` If `hours_left = 1.0` and $\Delta = 1.5$, new `hours_left = -0.5`. System immediately creates `certificate_warning` (`50_HOUR_SERVICE_OVERDUE`) and sets `aircraft.status = 'maintenance_due'`.

### 4.2 Pre-Flight Dispatch Gating Engine (7-Point Gate)
* **Test Cases:**
  1. `GATE_01 (Expired Medical Class 1):` Pilot medical expired on `2026-10-01`. Booking requested for `2026-10-16`. Gating returns `allowed: false`, conflict code: `medical_expired`.
  2. `GATE_02 (90-Day Passenger Currency):` Pilot has 2 day landings in last 90 days. Renter booking with passenger requested. Gating returns `allowed: false`, conflict code: `passenger_currency_lapsed`.
  3. `GATE_03 (Maintenance Overrun Prevention):` Airframe has $1.2$ hours remaining until 100-hour inspection. Booking requested for $2.0$ hours. Gating returns `allowed: false`, conflict code: `maintenance_overrun_prevented`.
  4. `GATE_04 (Type Rating Endorsement):` Student assigned to Diamond DA42 (`MEP_LAND`) without multi-engine endorsement. Gating returns `allowed: false`, conflict code: `type_rating_missing`.
  5. `GATE_05 (Rest Period Violation):` Instructor completed duty at 22:00 UTC. Next booking scheduled for 06:00 UTC (8h rest). Gating returns `allowed: false`, conflict code: `mandatory_rest_violation` (requires min 12h rest).
  6. `GATE_06 (Student Solo Endorsement):` Student attempting solo sortie without instructor digital sign-off in preceding 24h. Gating returns `allowed: false`, conflict code: `solo_endorsement_missing`.

### 4.3 EASA Part-FTL Rolling Duty Calculator
* **Test Cases:**
  1. `FTL_01 (Rolling 7-Day Duty Limit):` Cumulative duty hours in past 6 days $= 56.0$h. Proposed duty $= 5.0$h. Total $= 61.0$h. Engine flags `7_DAY_DUTY_LIMIT_EXCEEDED` (60h max).
  2. `FTL_02 (Rolling 28-Day Duty Limit):` Cumulative duty hours in past 27 days $= 188.0$h. Proposed duty $= 4.0$h. Total $= 192.0$h. Engine flags `28_DAY_DUTY_LIMIT_EXCEEDED` (190h max).
  3. `FTL_03 (Rolling 365-Day Flight Time Limit):` Cumulative flight time in past 364 days $= 998.5$h. Proposed flight $= 2.0$h. Total $= 1000.5$h. Engine flags `ANNUAL_FLIGHT_TIME_CEILING_BREACHED` (1000h max).

---

## 5. Tier 4: GraphQL Operations & RPC Test Suites

Verify all 144 GraphQL operations (or equivalent PostgreSQL RPC stored procedures) return valid schemas and enforce tenancy:

| Subsystem | Operation Name to Test | Input Parameters | Expected Assertion |
| :--- | :--- | :--- | :--- |
| **Duty/FTL** | `mutation startDuty` | `{ userId: "...", timestamp: "..." }` | Inserts `duty_records` row with `is_active: true`. |
| **Duty/FTL** | `mutation stopDuty` | `{ dutyId: "..." }` | Sets `is_active: false`, computes `mandatory_rest_until`. |
| **Gating** | `BookingCertBlockedUserIdsQuery` | `{ userIds: ["..."], date: "..." }` | Returns array of blocked user IDs and conflict messages. |
| **Gating** | `aircraftModelCertificatePlaneCheck` | `{ aircraftId: "...", duration: 1.5 }` | Returns `{ airworthy: true, hoursLeft: 12.5 }`. |
| **CBTA** | `mutation addMissingCategoriesToLecture` | `{ userLectureId: "...", categories: [...] }` | Injects exercise categories into student grade sheet. |
| **CBTA** | `query get_unbooked_lessons` | `{ studentId: "...", programId: "..." }` | Returns next eligible lesson ID based on prerequisites. |
| **Fleet** | `query maintenanceRequirements` | `{ aircraftId: "..." }` | Returns active 50h, 100h, annual countdown intervals. |
| **Invoicing** | `mutation draftAciInvoices` | `{ tenantSlug: "..." }` | Batches unbilled flight rows into draft invoices. |
| **Invoicing** | `mutation chargeAciCustomers` | `{ invoiceIds: ["..."] }` | Triggers Stripe payment intent charging customer card. |
| **Storage** | `query getPresignedUrls` | `{ fileKeys: ["..."] }` | Returns secure, expiring pre-signed S3 download URLs. |

---

## 6. Tier 5: Real-Time WebSockets & Persistence Test Suites

* **Test Cases:**
  1. `WS_01 (Departure/Arrival Broadcast):`
     - When `updateSortieStatus` is called with status `flight`.
     - Client connected to `DepartureArrivalChannel` receives WebSocket frame `{"event": "SORTIE_STATUS_UPDATED", "payload": { "callSign": "OY-AAA", "currentStatus": "flight" }}` within 50ms.
  2. `WS_02 (Runway In Use Update):`
     - Changing active runway from `28L` to `10R` broadcasts `RUNWAY_CHANGED` to all dispatch screens.
  3. `REDUX_01 (SessionStorage Debrief Recovery):`
     - If the browser tab crashes mid-debrief, rehydration from `persist:userCustomLecture` restores all unsaved norm scores and tachometer inputs.
  4. `REDUX_02 (Tenancy Isolation on Logout):`
     - Logging out immediately purges `persist:entities` from SessionStorage, preventing cross-user profile leaks.

---

## 7. Tier 6: UI Components & Portals Verification

* **Test Cases:**
  1. `UI_01 (Gantt Timeline Drag-and-Drop Collision):`
     - Dragging a booking block over an already reserved aircraft slot displays red collision highlight and triggers conflict tooltip.
  2. `UI_02 (Live Wallboard Badges):`
     - Badges render with compliant color tokens: `scheduled` (Slate), `briefing` (Amber), `flight` (Sky Blue), `landed` (Emerald Green).
  3. `UI_03 (CBTA Spider Radar Chart):`
     - Correctly renders 8-axis polygon mapping competency scores from 1 to 5.
  4. `UI_04 (Electronic Logbook PDF Export):`
     - Generates valid PDF with two-page EASA Part-FCL.050 layout containing flight dates, aircraft registrations, PIC hours, and dual instruction hours.
  5. `PORTAL_01 to PORTAL_04 (Role-Based Views):`
     - Student cannot view other students' logbooks or aircraft maintenance countdowns.
     - CFI can view student grading sheets and duty clocks.
     - Administrator has full access to pricing, invoices, and system audit changelogs.
