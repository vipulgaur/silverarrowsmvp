# FlightLogger REA Technical Audit: 32 Relational Database Entities & Schema Blueprint

**Target System:** FlightLogger Data Tier (`https://app.flightlogger.net`)  
**Underlying Engine:** PostgreSQL 15+ (with Row-Level Security, GiST Range Constraints & B-Tree Indexes)  
**Investigation Scope:** 32 Discovered Relational Entities, Primary & Foreign Keys, Enums, Constraints, Soft-Delete Strategy  
**Regulatory Standards:** EASA Part-FCL / Part-DTO / Part-ATO & FAA Part 141 Recordkeeping Standards  

---

## 1. Data Layer Architectural Principles

Reverse engineering of FlightLogger’s SessionStorage entity graph (`persist:entities`), Redux store slices, and GraphQL mutation contracts establishes five immutable architectural rules governing its data layer:

1. **Path & Tenant Isolation (`tenant_id NOT NULL`):** Every tenant-scoped entity contains a non-nullable `tenant_id` foreign key. Row-Level Security (RLS) ensures absolute data boundaries between flight academies.
2. **Physical Overlap Prevention via GiST Exclusion Constraints:** FlightLogger eliminates scheduling race conditions at the database engine level. Rather than relying on simple `SELECT` checks prior to `INSERT`, it uses PostgreSQL interval exclusion constraints:
   ```sql
   ALTER TABLE bookings ADD CONSTRAINT no_aircraft_overlap 
   EXCLUDE USING gist (aircraft_id WITH =, tstzrange(start_time, end_time) WITH &&)
   WHERE (status NOT IN ('cancelled', 'draft'));
   ```
3. **Non-Destructive Soft Deletion:** In civil aviation compliance, training hours, pilot logbooks, maintenance logs, and student grade sheets can **never be physically deleted (`DROP` / `DELETE`)**. Deletion operations update `status = 'archived'`, set `deleted_at = NOW()`, and record `deleted_by_user_id`.
4. **Dual Logbook Synthesis:** A single completed flight event produces two independent, immutable logbook rows (one for the student/co-pilot, one for the instructor/PIC).
5. **Universal Audit Trail (`audit_logs`):** Every insert, update, or soft-delete writes an immutable row containing the executing user's UUID, IP address, timestamp, table name, and a JSON `diff` of changed attributes.

---

## 2. Complete Catalog of the 32 Database Entities

```
                          ┌────────────────────────┐
                          │   1. tenants (ATO/DTO) │
                          └───────────┬────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         │                            │                            │
┌────────▼─────────┐        ┌─────────▼────────┐        ┌──────────▼─────────┐
│ 2. users         │        │ 7. aircraft      │        │ 13. programs       │
│ 3. roles         │        │ 6. air_models    │        │ 14. revisions      │
│ 4. user_roles    │        │ 8. maint_reqs    │        │ 15. phases         │
│ 5. webauthn      │        │ 9. air_remarks   │        │ 16. lessons        │
│ 10. cert_types   │        └─────────┬────────┘        │ 17. exercises      │
│ 11. certificates │                  │                 │ 18. competencies   │
│ 12. cert_warns   │                  │                 │ 19. comp_indicat   │
└────────┬─────────┘                  │                 └──────────┬─────────┘
         │                            │                            │
         │         ┌──────────────────▼─────────────────┐          │
         └────────►│ 24. bookings (GiST range overlap)  │◄─────────┘
                   └──────────────────┬─────────────────┘
                                      │
                   ┌──────────────────▼─────────────────┐
                   │ 26. flights (Post-flight registration)
                   └──────────┬─────────────────┬───────┘
                              │                 │
         ┌────────────────────┴──────┐   ┌──────┴────────────────────┐
         │                           │   │                           │
┌────────▼─────────┐ ┌───────────────▼┐ ┌▼──────────────┐ ┌──────────▼─────────┐
│ 27. landings     │ │ 22. user_exrc  │ │ 29. duty_recs │ │ 30. customers      │
│ 28. logbooks     │ │ 23. graded_cmp │ │ (Part-FTL)    │ │ 31. price_lists    │
│ (Dual EASA log)  │ │ (CBTA 1-5 norm)│ │               │ │ 32. activities/inv │
└──────────────────┘ └────────────────┘ └───────────────┘ └────────────────────┘
```

---

### Group 1: Tenancy, Identity & Access Control (Tables 1–5)

#### Table 1: `tenants` (Aviation Organizations)
The root tenant record isolating all operational data for an ATO or commercial flight academy.
- `id`: UUID (Primary Key, default `gen_random_uuid()`)
- `name`: VARCHAR(255) NOT NULL (e.g., "Silver Arrows Aviation Academy")
- `slug`: VARCHAR(64) UNIQUE NOT NULL (e.g., "trial-sa", used in `/a/:tenant_slug`)
- `country_code`: VARCHAR(3) NOT NULL (e.g., "IND", "DNK", "USA")
- `currency`: VARCHAR(3) NOT NULL DEFAULT 'USD' (e.g., "USD", "INR", "EUR")
- `regulatory_body`: VARCHAR(16) NOT NULL (Enum: `EASA`, `FAA`, `DGCA`, `UK_CAA`)
- `timezone`: VARCHAR(64) NOT NULL DEFAULT 'UTC' (e.g., "Asia/Kolkata", "Europe/Copenhagen")
- `settings`: JSONB NOT NULL DEFAULT '{}' (booking limits, default fuel units, VAT rates)
- `created_at`, `updated_at`: TIMESTAMPTZ NOT NULL

#### Table 2: `users` (Global Identities & Profiles)
Global user profile enabling Single Sign-On across multiple flight academies via `/my`.
- `id`: UUID (Primary Key, maps to Supabase / Devise auth UID)
- `email`: VARCHAR(255) UNIQUE NOT NULL
- `first_name`: VARCHAR(128) NOT NULL
- `last_name`: VARCHAR(128) NOT NULL
- `phone`: VARCHAR(64)
- `date_of_birth`: DATE NOT NULL
- `gender`: VARCHAR(16)
- `avatar_url`: TEXT
- `pilot_license_number`: VARCHAR(64)
- `is_active`: BOOLEAN NOT NULL DEFAULT TRUE
- `created_at`, `updated_at`: TIMESTAMPTZ NOT NULL

#### Table 3: `roles` (System RBAC Roles)
Lookup table defining standard aviation responsibilities.
- `id`: VARCHAR(32) PRIMARY KEY (Enum: `administrator`, `staff`, `flight_instructor`, `ground_instructor`, `crew`, `renter`, `student`)
- `description`: TEXT NOT NULL
- `default_permissions`: JSONB NOT NULL

#### Table 4: `user_roles` (Tenant Membership & Role Assignment)
Associates a user with specific roles within a designated flight academy.
- `id`: UUID PRIMARY KEY
- `tenant_id`: UUID NOT NULL REFERENCES `tenants(id)` ON DELETE RESTRICT
- `user_id`: UUID NOT NULL REFERENCES `users(id)` ON DELETE RESTRICT
- `role_id`: VARCHAR(32) NOT NULL REFERENCES `roles(id)`
- `status`: VARCHAR(32) NOT NULL DEFAULT 'active' (Enum: `active`, `suspended`, `graduated`, `archived`)
- `joined_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- UNIQUE (`tenant_id`, `user_id`, `role_id`)

#### Table 5: `webauthn_credentials` (FIDO2 Hardware Authentication Keys)
Stores hardware security token registrations for secure pilot and admin sign-ins.
- `id`: VARCHAR(255) PRIMARY KEY (Credential ID from authenticator)
- `user_id`: UUID NOT NULL REFERENCES `users(id)` ON DELETE CASCADE
- `public_key`: BYTEA NOT NULL
- `sign_count`: BIGINT NOT NULL DEFAULT 0
- `device_name`: VARCHAR(128) NOT NULL (e.g., "YubiKey 5C NFC", "MacBook TouchID")
- `created_at`, `last_used_at`: TIMESTAMPTZ NOT NULL

---

### Group 2: Fleet Airworthiness & Maintenance (Tables 6–9)

#### Table 6: `aircraft_models` (Type Specifications & Endorsements)
Aircraft type definitions determining pilot rating requirements and maintenance schedules.
- `id`: UUID PRIMARY KEY
- `tenant_id`: UUID NOT NULL REFERENCES `tenants(id)`
- `manufacturer`: VARCHAR(128) NOT NULL (e.g., "Cessna", "Diamond", "Piper")
- `model_name`: VARCHAR(128) NOT NULL (e.g., "172S Skyhawk", "DA42-VI Twin Star")
- `class_rating`: VARCHAR(32) NOT NULL (Enum: `SEP_LAND`, `MEP_LAND`, `TMG`, `SET`)
- `engine_type`: VARCHAR(32) NOT NULL (Enum: `piston_avgas`, `diesel_jet_a1`, `turboprop`)
- `usable_fuel_liters`: DECIMAL(8,2) NOT NULL
- `cruise_speed_knots`: INT NOT NULL
- `has_retractable_gear`: BOOLEAN NOT NULL DEFAULT FALSE
- `has_variable_pitch_prop`: BOOLEAN NOT NULL DEFAULT FALSE

#### Table 7: `aircraft` (Fleet Airframe Inventory)
Physical aircraft owned, leased, or managed by the flight academy.
- `id`: UUID PRIMARY KEY
- `tenant_id`: UUID NOT NULL REFERENCES `tenants(id)`
- `model_id`: UUID NOT NULL REFERENCES `aircraft_models(id)`
- `call_sign`: VARCHAR(16) NOT NULL (e.g., "OY-AAA", "VT-SA1")
- `serial_number`: VARCHAR(64) NOT NULL
- `year_of_manufacture`: INT NOT NULL
- `status`: VARCHAR(32) NOT NULL DEFAULT 'airworthy' (Enum: `airworthy`, `grounded`, `maintenance_due`)
- `total_airframe_hours`: DECIMAL(10,2) NOT NULL DEFAULT 0.00 (Current Tachometer)
- `engine_hours`: DECIMAL(10,2) NOT NULL DEFAULT 0.00
- `total_landings`: INT NOT NULL DEFAULT 0
- `current_fuel_liters`: DECIMAL(8,2) NOT NULL DEFAULT 0.00
- `home_airport_icao`: VARCHAR(4) NOT NULL (e.g., "EKAH", "VABB")
- `deleted_at`: TIMESTAMPTZ
- UNIQUE (`tenant_id`, `call_sign`)

#### Table 8: `maintenance_requirements` (Inspection Tracking & Countdowns)
Tracks recurring service intervals and remaining flight hours before mandatory grounding.
- `id`: UUID PRIMARY KEY
- `aircraft_id`: UUID NOT NULL REFERENCES `aircraft(id)` ON DELETE CASCADE
- `title`: VARCHAR(128) NOT NULL (e.g., "50 Hour Service", "100 Hour Inspection", "Annual Inspection", "Pitot-Static 24M")
- `interval_type`: VARCHAR(32) NOT NULL (Enum: `flight_hours`, `calendar_days`, `landings_count`)
- `interval_value`: DECIMAL(10,2) NOT NULL (e.g., 50.00 hours, 365 days)
- `last_performed_at_meter`: DECIMAL(10,2) (Tach meter when inspection was signed off)
- `last_performed_date`: DATE
- `hours_left`: DECIMAL(10,2) NOT NULL (Countdown: `due_at_meter - current_tach`)
- `is_critical`: BOOLEAN NOT NULL DEFAULT TRUE (If true, aircraft grounds when `hours_left <= 0`)

#### Table 9: `aircraft_remarks` (Defect Squawks & Snags)
Pilot and maintenance defect log tracking open snags and deferred defects.
- `id`: UUID PRIMARY KEY
- `aircraft_id`: UUID NOT NULL REFERENCES `aircraft(id)` ON DELETE CASCADE
- `reported_by_user_id`: UUID NOT NULL REFERENCES `users(id)`
- `headline`: VARCHAR(255) NOT NULL (e.g., "VHF COM 2 audio weak", "Left brake spongy")
- `details`: TEXT
- `severity`: VARCHAR(32) NOT NULL (Enum: `info`, `warning`, `grounding_defect`)
- `is_rectified`: BOOLEAN NOT NULL DEFAULT FALSE
- `rectified_by_license`: VARCHAR(64)
- `rectified_at`: TIMESTAMPTZ
- `created_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()

---

### Group 3: Regulatory Compliance, Licenses & Warnings (Tables 10–12)

#### Table 10: `certificate_types` (Aviation Regulatory Clearances)
Master catalog of certificates, ratings, medical clearances, and currency requirements.
- `id`: VARCHAR(64) PRIMARY KEY (e.g., `medical_class_1`, `medical_class_2`, `sep_land`, `mep_land`, `night_rating`, `ir_se`, `elp_level_4`)
- `name`: VARCHAR(128) NOT NULL
- `issuer`: VARCHAR(32) NOT NULL (Enum: `EASA`, `FAA`, `DGCA`)
- `validity_months`: INT (Nullable if lifetime)
- `blocks_booking_on_expiry`: BOOLEAN NOT NULL DEFAULT TRUE

#### Table 11: `user_certificates` (Issued Records & Documents)
User-held aviation documents, license numbers, and expiration dates.
- `id`: UUID PRIMARY KEY
- `user_id`: UUID NOT NULL REFERENCES `users(id)` ON DELETE CASCADE
- `certificate_type_id`: VARCHAR(64) NOT NULL REFERENCES `certificate_types(id)`
- `certificate_number`: VARCHAR(128) NOT NULL
- `issue_date`: DATE NOT NULL
- `expires_at`: DATE NOT NULL
- `storage_file_path`: TEXT (S3 / Supabase storage path to PDF scan)
- `verified_by_user_id`: UUID REFERENCES `users(id)`
- `verified_at`: TIMESTAMPTZ

#### Table 12: `certificate_warnings` (Dynamic Invalidation Log)
System-generated warnings generated when a certificate or currency lapses.
- `id`: UUID PRIMARY KEY
- `tenant_id`: UUID NOT NULL REFERENCES `tenants(id)`
- `user_id`: UUID NOT NULL REFERENCES `users(id)`
- `certificate_type_id`: VARCHAR(64) NOT NULL REFERENCES `certificate_types(id)`
- `warning_code`: VARCHAR(64) NOT NULL (e.g., `ANS: Medical (1) Missing`, `90_DAY_LANDING_CURRENCY_LAPSED`)
- `message`: TEXT NOT NULL
- `is_blocking`: BOOLEAN NOT NULL DEFAULT TRUE
- `created_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()

---

### Group 4: Training Curricula & CBTA Grading (Tables 13–19)

#### Table 13: `programs` (Training Courses)
Aviation training programs offered by the academy.
- `id`: UUID PRIMARY KEY
- `tenant_id`: UUID NOT NULL REFERENCES `tenants(id)`
- `title`: VARCHAR(255) NOT NULL (e.g., "PPL(A) Private Pilot Licence - Aeroplane", "CPL / ME / IR Integrated")
- `code`: VARCHAR(32) NOT NULL (e.g., "PPL-A", "ATPL-A-INT")
- `target_license`: VARCHAR(64) NOT NULL

#### Table 14: `program_revisions` (Syllabus Versions)
Versioned course revisions approved by civil aviation authorities.
- `id`: UUID PRIMARY KEY
- `program_id`: UUID NOT NULL REFERENCES `programs(id)` ON DELETE CASCADE
- `revision_number`: INT NOT NULL DEFAULT 1
- `approved_by_naa`: VARCHAR(64) (e.g., "CAA Denmark Approved Ref: DK-ATO-021")
- `effective_date`: DATE NOT NULL
- `is_active`: BOOLEAN NOT NULL DEFAULT TRUE
- UNIQUE (`program_id`, `revision_number`)

#### Table 15: `program_phases` (Curriculum Milestones)
Logical stages of a flight course (e.g., Basic Flying, Solo Circuits, Advanced Nav, IFR).
- `id`: UUID PRIMARY KEY
- `program_revision_id`: UUID NOT NULL REFERENCES `program_revisions(id)` ON DELETE CASCADE
- `phase_order`: INT NOT NULL
- `title`: VARCHAR(128) NOT NULL
- `requires_stage_check`: BOOLEAN NOT NULL DEFAULT FALSE

#### Table 16: `syllabus_lessons` (Individual Training Sorties)
Discrete flying lessons or ground classroom lectures.
- `id`: UUID PRIMARY KEY
- `phase_id`: UUID NOT NULL REFERENCES `program_phases(id)` ON DELETE CASCADE
- `lesson_order`: INT NOT NULL
- `code`: VARCHAR(32) NOT NULL (e.g., "Ex 4.1", "Nav 3", "Sim 5")
- `title`: VARCHAR(255) NOT NULL (e.g., "Climbing and Descending", "Cross-Country Navigation")
- `lesson_type`: VARCHAR(32) NOT NULL (Enum: `dual_flight`, `solo_flight`, `simulator`, `ground_school`)
- `planned_flight_hours`: DECIMAL(4,2) NOT NULL DEFAULT 1.00

#### Table 17: `master_exercises` (Flight Maneuvers & Tasks)
Individual exercises evaluated during a lesson.
- `id`: UUID PRIMARY KEY
- `lesson_id`: UUID NOT NULL REFERENCES `syllabus_lessons(id)` ON DELETE CASCADE
- `exercise_order`: INT NOT NULL
- `code`: VARCHAR(32) NOT NULL (e.g., "4.1.a", "4.1.b")
- `title`: VARCHAR(255) NOT NULL (e.g., "Normal Climb", "Best Rate of Climb (Vy)")
- `standard_briefing_notes`: TEXT

#### Table 18: `core_competencies` & Table 19: `competency_indicators` (CBTA Rubric)
ICAO / EASA Core Competencies and behavioral markers.
- `core_competencies`: `id` VARCHAR(16) PRIMARY KEY (`KNO`, `FPA`, `FPO`, `COM`, `WLM`, `SAW`, `PRB`, `LST`), `name` VARCHAR(128), `description` TEXT.
- `competency_indicators`: `id` UUID PRIMARY KEY, `competency_id` REFERENCES `core_competencies(id)`, `marker_text` TEXT NOT NULL.

---

### Group 5: Student Enrollment & Grade Sheets (Tables 20–23)

#### Table 20: `user_programs` (Student Course Enrollment)
Binds a student to a specific curriculum version.
- `id`: UUID PRIMARY KEY
- `tenant_id`: UUID NOT NULL REFERENCES `tenants(id)`
- `student_id`: UUID NOT NULL REFERENCES `users(id)`
- `program_revision_id`: UUID NOT NULL REFERENCES `program_revisions(id)`
- `enrolled_date`: DATE NOT NULL
- `status`: VARCHAR(32) NOT NULL DEFAULT 'active' (Enum: `active`, `completed`, `withdrawn`, `on_hold`)

#### Table 21: `user_lectures` (Lesson Flight Grade Sheets)
An actual lesson session attempted by a student.
- `id`: UUID PRIMARY KEY
- `user_program_id`: UUID NOT NULL REFERENCES `user_programs(id)` ON DELETE CASCADE
- `lesson_id`: UUID NOT NULL REFERENCES `syllabus_lessons(id)`
- `instructor_id`: UUID NOT NULL REFERENCES `users(id)`
- `flight_id`: UUID (Nullable until flight is logged)
- `status`: VARCHAR(32) NOT NULL DEFAULT 'scheduled' (Enum: `scheduled`, `in_progress`, `passed`, `repeat_required`)
- `overall_norm_grade`: INT (1–5 scale)
- `debrief_notes`: TEXT
- `signed_off_at`: TIMESTAMPTZ

#### Table 22: `user_exercises` & Table 23: `graded_competencies` (Exercise Norm Scores)
Records granular performance on flight maneuvers.
- `user_exercises`: `id` UUID PRIMARY KEY, `user_lecture_id` REFERENCES `user_lectures(id)`, `exercise_id` REFERENCES `master_exercises(id)`, `grade` INT (1–5 norm score), `remarks` TEXT.
- `graded_competencies`: `id` UUID PRIMARY KEY, `user_lecture_id` REFERENCES `user_lectures(id)`, `competency_id` REFERENCES `core_competencies(id)`, `score` INT (1–5 norm score), `evidence_notes` TEXT.

---

### Group 6: Operations, Bookings & Flight Execution (Tables 24–28)

#### Table 24: `bookings` (Resource Reservations with GiST Exclusion)
Resource timeline bookings across aircraft, instructors, students, and simulators.
- `id`: UUID PRIMARY KEY
- `tenant_id`: UUID NOT NULL REFERENCES `tenants(id)`
- `aircraft_id`: UUID REFERENCES `aircraft(id)`
- `instructor_id`: UUID REFERENCES `users(id)`
- `student_id`: UUID REFERENCES `users(id)`
- `lesson_id`: UUID REFERENCES `syllabus_lessons(id)`
- `start_time`: TIMESTAMPTZ NOT NULL
- `end_time`: TIMESTAMPTZ NOT NULL
- `status`: VARCHAR(32) NOT NULL DEFAULT 'scheduled' (Enum: `scheduled`, `briefing`, `flight`, `landed`, `debriefing`, `completed`, `cancelled`)
- `cancellation_reason`: TEXT
- `created_at`, `updated_at`: TIMESTAMPTZ NOT NULL
- **Exclusion Constraints:**
  - `EXCLUDE USING gist (aircraft_id WITH =, tstzrange(start_time, end_time) WITH &&) WHERE (status NOT IN ('cancelled', 'draft'))`
  - `EXCLUDE USING gist (instructor_id WITH =, tstzrange(start_time, end_time) WITH &&) WHERE (status NOT IN ('cancelled', 'draft'))`
  - `EXCLUDE USING gist (student_id WITH =, tstzrange(start_time, end_time) WITH &&) WHERE (status NOT IN ('cancelled', 'draft'))`

#### Table 25: `booking_conflicts` (Pre-Flight Gating Exceptions)
Records conflict detections and administrative overrides.
- `id`: UUID PRIMARY KEY
- `booking_id`: UUID NOT NULL REFERENCES `bookings(id)` ON DELETE CASCADE
- `conflict_type`: VARCHAR(64) NOT NULL (e.g., `CERTIFICATE_EXPIRED`, `MAINTENANCE_DUE`, `FTL_REST_VIOLATION`)
- `details`: TEXT NOT NULL
- `overridden_by_user_id`: UUID REFERENCES `users(id)`
- `override_reason`: TEXT

#### Table 26: `flights` (Recorded Aircraft Sorties)
The actual airframe flight execution record created during post-flight registration.
- `id`: UUID PRIMARY KEY
- `booking_id`: UUID UNIQUE NOT NULL REFERENCES `bookings(id)`
- `tenant_id`: UUID NOT NULL REFERENCES `tenants(id)`
- `aircraft_id`: UUID NOT NULL REFERENCES `aircraft(id)`
- `departure_icao`: VARCHAR(4) NOT NULL
- `arrival_icao`: VARCHAR(4) NOT NULL
- `off_block_time`: TIMESTAMPTZ NOT NULL
- `takeoff_time`: TIMESTAMPTZ NOT NULL
- `landing_time`: TIMESTAMPTZ NOT NULL
- `on_block_time`: TIMESTAMPTZ NOT NULL
- `block_hours`: DECIMAL(6,2) NOT NULL (Computed: `(on_block - off_block) in decimal hours`)
- `flight_hours`: DECIMAL(6,2) NOT NULL (Computed: `(landing - takeoff) in decimal hours`)
- `tach_start`: DECIMAL(10,2) NOT NULL
- `tach_stop`: DECIMAL(10,2) NOT NULL
- `tach_delta`: DECIMAL(6,2) NOT NULL (Computed: `tach_stop - tach_start`)
- `fuel_start_liters`: DECIMAL(8,2) NOT NULL
- `fuel_stop_liters`: DECIMAL(8,2) NOT NULL
- `fuel_consumed_liters`: DECIMAL(8,2) NOT NULL
- `oil_added_quarts`: DECIMAL(4,2) NOT NULL DEFAULT 0.00
- `signed_off_by_pic_id`: UUID NOT NULL REFERENCES `users(id)`
- `created_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()

#### Table 27: `landings` (Landing Breakdown)
Itemized landing counts used for passenger currency and airfield fees.
- `id`: UUID PRIMARY KEY
- `flight_id`: UUID NOT NULL REFERENCES `flights(id)` ON DELETE CASCADE
- `aerodrome_icao`: VARCHAR(4) NOT NULL
- `day_landings`: INT NOT NULL DEFAULT 0
- `night_landings`: INT NOT NULL DEFAULT 0
- `touch_and_go_count`: INT NOT NULL DEFAULT 0
- `full_stop_count`: INT NOT NULL DEFAULT 0

#### Table 28: `electronic_logbook_entries` (EASA / FAA Pilot Logbook)
Immutable electronic logbook record synthesized for every participating flight crew member.
- `id`: UUID PRIMARY KEY
- `user_id`: UUID NOT NULL REFERENCES `users(id)` ON DELETE CASCADE
- `flight_id`: UUID NOT NULL REFERENCES `flights(id)` ON DELETE CASCADE
- `flight_date`: DATE NOT NULL
- `aircraft_model_code`: VARCHAR(32) NOT NULL
- `aircraft_registration`: VARCHAR(16) NOT NULL
- `departure_icao`: VARCHAR(4) NOT NULL
- `arrival_icao`: VARCHAR(4) NOT NULL
- `total_time_hours`: DECIMAL(6,2) NOT NULL
- `pic_hours`: DECIMAL(6,2) NOT NULL DEFAULT 0.00
- `dual_hours`: DECIMAL(6,2) NOT NULL DEFAULT 0.00
- `instructor_hours`: DECIMAL(6,2) NOT NULL DEFAULT 0.00
- `night_hours`: DECIMAL(6,2) NOT NULL DEFAULT 0.00
- `ifr_actual_hours`: DECIMAL(6,2) NOT NULL DEFAULT 0.00
- `ifr_simulated_hours`: DECIMAL(6,2) NOT NULL DEFAULT 0.00
- `day_landings`: INT NOT NULL DEFAULT 0
- `night_landings`: INT NOT NULL DEFAULT 0
- `pilot_role`: VARCHAR(32) NOT NULL (Enum: `PIC`, `DUAL_STUDENT`, `INSTRUCTOR`, `CO_PILOT`)
- `remarks`: TEXT
- `is_digitally_signed`: BOOLEAN NOT NULL DEFAULT TRUE
- `signature_hash`: VARCHAR(255) NOT NULL

---

### Group 7: Crew Duty & Invoicing (Tables 29–32)

#### Table 29: `duty_records` (Crew Duty Periods & EASA Part-FTL)
Logs flight duty periods (FDP), ground duty, and mandatory rest windows.
- `id`: UUID PRIMARY KEY
- `tenant_id`: UUID NOT NULL REFERENCES `tenants(id)`
- `user_id`: UUID NOT NULL REFERENCES `users(id)`
- `duty_start`: TIMESTAMPTZ NOT NULL
- `duty_end`: TIMESTAMPTZ
- `is_active`: BOOLEAN NOT NULL DEFAULT TRUE
- `flight_duty_hours`: DECIMAL(6,2) NOT NULL DEFAULT 0.00
- `total_duty_hours`: DECIMAL(6,2) NOT NULL DEFAULT 0.00
- `mandatory_rest_until`: TIMESTAMPTZ (Computed: `duty_end + max(12h, duty_duration)`)
- `created_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()

#### Table 30: `customers` (Client Billing Accounts)
Financial account profile associated with students, renters, and charter customers.
- `id`: UUID PRIMARY KEY
- `tenant_id`: UUID NOT NULL REFERENCES `tenants(id)`
- `user_id`: UUID REFERENCES `users(id)`
- `billing_name`: VARCHAR(255) NOT NULL
- `vat_number`: VARCHAR(64)
- `billing_email`: VARCHAR(255) NOT NULL
- `account_balance`: DECIMAL(12,2) NOT NULL DEFAULT 0.00 (Positive = credit deposit, Negative = amount owed)
- `stripe_customer_id`: VARCHAR(128)

#### Table 31: `price_lists` & `price_list_items` (Tariff Matrix)
Hourly rates and landing fee schedules.
- `price_lists`: `id` UUID PRIMARY KEY, `tenant_id` REFERENCES `tenants(id)`, `name` VARCHAR(128), `currency` VARCHAR(3).
- `price_list_items`: `id` UUID PRIMARY KEY, `price_list_id` REFERENCES `price_lists(id)`, `item_type` VARCHAR(32) (Enum: `aircraft_hourly`, `instructor_hourly`, `touch_and_go_fee`, `full_stop_fee`), `aircraft_model_id` UUID, `unit_price` DECIMAL(10,2) NOT NULL.

#### Table 32: `activities`, `invoices`, & `invoice_items` (ACI Transaction Ledger)
- `activities`: Unbilled flight transactions inserted upon flight completion (`flight_id`, `customer_id`, `block_hours`, `amount`, `status: unbilled|drafted|invoiced`).
- `invoices`: Formal invoice document headers (`invoice_number`, `customer_id`, `issue_date`, `due_date`, `subtotal`, `tax`, `total_amount`, `status: draft|sent|paid|overdue`).
- `invoice_items`: Detailed invoice lines (`invoice_id`, `description`, `quantity`, `unit_price`, `total_price`).
