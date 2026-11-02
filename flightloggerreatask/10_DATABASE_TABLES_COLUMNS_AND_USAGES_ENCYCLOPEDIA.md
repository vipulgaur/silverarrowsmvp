# FlightLogger REA Technical Audit: Complete Database Tables, Columns, Usages & Verification Encyclopedia

**Target System:** FlightLogger Data & Backend Tier (`https://app.flightlogger.net`)  
**Purpose:** Pure Textual Reference & Exhaustive Field-Level Specification for Full Backend Recreation  
**Scope:** All 32 Database Entities, Exact Column Names, Data Types, Constraints, Places Used, Interacting Tools/APIs, and Verification Checklists  

---

## 1. Architectural Conventions & Data Types

Every table in FlightLogger follows strict aviation database design standards:
- **Identifier Type:** Primary keys use PostgreSQL `UUID` (`gen_random_uuid()`) or standardized slug identifiers.
- **Temporal Fields:** All timestamps are timezone-aware `TIMESTAMPTZ` (UTC Zulu time).
- **Aviation Hour Precision:** Flight hours, tachometer readings, and hobbs meters use `DECIMAL(10,2)` or `NUMERIC(10,2)` (never floating point) to prevent rounding errors.
- **Tenancy Boundary:** Every tenant-scoped entity contains `tenant_id UUID NOT NULL REFERENCES tenants(id)`.
- **Soft Deletion Policy:** Training and airworthiness records are never hard-deleted; status flags (`status = 'archived'`), `is_active = FALSE`, and `deleted_at TIMESTAMPTZ` preserve immutable historical fidelity.

---

## 2. Table-by-Table Encyclopedic Specification

Below is the exhaustive, column-by-column breakdown of all 32 tables.

---

### Table 1: `tenants` (Aviation Organizations / ATOs)

* **Domain:** Identity & Multi-Tenancy Boundary
* **Purpose:** Root organizational entity isolating flight academies, ATOs, DTOs, and commercial operators.

#### Column Definitions:
| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Primary Key | Unique tenant identifier. |
| `slug` | `VARCHAR(64)` | No | None | Unique | URL slug used in path routing (e.g., `trial-sa` in `/a/trial-sa`). |
| `name` | `VARCHAR(255)` | No | None | None | Legal name of the flight academy (e.g., "Silver Arrows Aviation"). |
| `company_registration_number` | `VARCHAR(64)` | Yes | None | None | Corporate registration identifier with national authorities. |
| `ato_dto_approval_number` | `VARCHAR(64)` | Yes | None | None | National Aviation Authority approval code (e.g., `DK-ATO-021`). |
| `time_zone` | `VARCHAR(64)` | No | `'UTC'` | None | Primary operational timezone (e.g., `'Asia/Kolkata'`, `'Europe/Copenhagen'`). |
| `base_currency` | `VARCHAR(3)` | No | `'USD'` | None | Currency code for pricing and invoicing (`USD`, `EUR`, `INR`, `GBP`). |
| `address_line1` | `VARCHAR(255)` | Yes | None | None | Physical airfield or headquarters street address. |
| `address_line2` | `VARCHAR(255)` | Yes | None | None | Suite, hangar, or terminal building number. |
| `city` | `VARCHAR(128)` | Yes | None | None | Operational base city. |
| `postal_code` | `VARCHAR(32)` | Yes | None | None | Postal code. |
| `country_code` | `VARCHAR(3)` | No | `'IND'` | None | ISO 3166-1 alpha-3 country code. |
| `phone_number` | `VARCHAR(64)` | Yes | None | None | Organization contact phone. |
| `email` | `VARCHAR(255)` | No | None | None | Primary operations / billing contact email. |
| `logo_url` | `TEXT` | Yes | None | None | S3 storage URL for academy branding on PDF invoices and certificates. |
| `settings` | `JSONB` | No | `'{}'` | None | Tenant-level operational settings (e.g., default fuel units, VAT percentage). |
| `is_active` | `BOOLEAN` | No | `TRUE` | None | Soft-deletion flag disabling tenant access if suspended. |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | None | Record creation timestamp. |
| `updated_at` | `TIMESTAMPTZ` | No | `NOW()` | None | Record modification timestamp. |

#### Places & Usages in System:
* **UI Routes:** Global `/my/organizations` organization switcher; `/a/:tenant/settings/general`.
* **UI Components:** App header branding logo, invoice letterheads, footer legal notices.
* **Tools & APIs:** Contextual header `X-Tenant-Slug` in all GraphQL calls; Supabase RLS function `app.is_member(tenant_id)`.

#### What Needs to be Checked:
1. Verify that `slug` is unique across all tenants and cannot contain spaces or uppercase characters.
2. Verify that deleting a tenant is non-destructive (`is_active = FALSE`) and does not cascade delete flight logs.
3. Verify that setting changes in `settings` JSONB correctly update booking buffer defaults.

---

### Table 2: `users` (Global Pilot & Staff Identities)

* **Domain:** Identity, Authentication & Profile Management
* **Purpose:** Stores individual pilots, students, instructors, and administrators across organizations.

#### Column Definitions:
| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Primary Key | User profile ID (maps to Supabase Auth UID). |
| `tenant_id` | `UUID` | No | None | FK $\to$ `tenants(id)` | Primary associated tenant organization. |
| `call_sign` | `VARCHAR(32)` | Yes | None | None | Pilot radio call sign or nickname (e.g., "TopGun", "Alpha1"). |
| `first_name` | `VARCHAR(128)` | No | None | None | Pilot legal first name. |
| `last_name` | `VARCHAR(128)` | No | None | None | Pilot legal last name. |
| `email` | `VARCHAR(255)` | No | None | Unique | Login email and communication address. |
| `encrypted_password` | `VARCHAR(255)` | No | None | None | Bcrypt password hash. |
| `date_of_birth` | `DATE` | Yes | None | None | Birthdate for age requirement audits (e.g. solo at 16, PPL at 17). |
| `gender` | `VARCHAR(16)` | No | `'unspecified'` | Enum | Gender (`male`, `female`, `other`, `unspecified`). |
| `nationality` | `VARCHAR(3)` | Yes | None | None | Citizenship code. |
| `phone_number` | `VARCHAR(64)` | Yes | None | None | SMS notification phone number. |
| `avatar_url` | `TEXT` | Yes | None | None | Pilot photo displayed on roster and student badges. |
| `pilot_license_number`| `VARCHAR(128)` | Yes | None | None | Official pilot license number issued by CAA/FAA/DGCA. |
| `state_of_license_issue`| `VARCHAR(64)` | Yes | None | None | Issuing authority (e.g., "India DGCA", "FAA USA", "Denmark CAA"). |
| `is_active` | `BOOLEAN` | No | `TRUE` | None | Active membership flag. |
| `status` | `VARCHAR(32)` | No | `'active'` | Enum | Operational status (`active`, `suspended`, `graduated`, `archived`). |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | None | Account creation timestamp. |
| `updated_at` | `TIMESTAMPTZ` | No | `NOW()` | None | Profile last update timestamp. |

#### Places & Usages in System:
* **UI Routes:** `/a/:tenant/users`, `/a/:tenant/users?type=student`, `/a/:tenant/users/:id`, `/my`.
* **UI Components:** User directory cards, avatar badge in navigation bar, pilot name pickers on bookings.
* **Tools & APIs:** Devise/Supabase Auth; GraphQL `query BookingCertBlockedUserIdsQuery`.

#### What Needs to be Checked:
1. Verify `email` format validation and uniqueness constraint.
2. Verify soft-deletion: setting `status = 'archived'` preserves past flight logs while preventing future scheduling.
3. Verify that `pilot_license_number` matches format required by the national regulatory authority.

---

### Table 3: `roles` & Table 4: `user_roles` (RBAC System)

* **Domain:** Security & Authorization Boundaries
* **Purpose:** Manages the 7-tier role-based access control matrix and user membership associations.

#### Column Definitions (`roles`):
| Column Name | Data Type | Nullable | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `VARCHAR(32)` | No | Primary Key | Role identifier (`administrator`, `staff`, `flight_instructor`, `ground_instructor`, `crew`, `renter`, `student`). |
| `description` | `TEXT` | No | None | Human-readable role mandate and responsibilities. |
| `default_permissions`| `JSONB` | No | None | Default capability matrix for module access. |

#### Column Definitions (`user_roles`):
| Column Name | Data Type | Nullable | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | Primary Key | Unique assignment ID. |
| `tenant_id` | `UUID` | No | FK $\to$ `tenants(id)` | Organization where this role is assigned. |
| `user_id` | `UUID` | No | FK $\to$ `users(id)` | Assigned user. |
| `role_id` | `VARCHAR(32)` | No | FK $\to$ `roles(id)` | Specific role granted. |
| `status` | `VARCHAR(32)` | No | Default `'active'` | Assignment status (`active`, `suspended`, `revoked`). |
| `joined_at` | `TIMESTAMPTZ` | No | Default `NOW()` | Date role was assigned. |
| Constraint | `UNIQUE` | No | `(tenant_id, user_id, role_id)` | Prevents duplicate role assignment. |

#### Places & Usages in System:
* **UI Routes:** `/a/:tenant/settings/roles`, `/a/:tenant/users/:id`.
* **UI Components:** Role selector dropdown in user profile, authorization route guards.
* **Tools & APIs:** Security middleware function `app.has_role(role_name)`.

#### What Needs to be Checked:
1. Verify that non-administrators cannot grant `administrator` roles to themselves.
2. Verify that revoking a role updates `status = 'revoked'` and immediately invalidates active sessions.

---

### Table 5: `webauthn_credentials` (FIDO2 Hardware 2FA Keys)

* **Domain:** Security & Multi-Factor Authentication
* **Purpose:** Stores hardware security keys (YubiKey, Apple TouchID) for passwordless or 2FA login.

#### Column Definitions:
| Column Name | Data Type | Nullable | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `VARCHAR(255)` | No | Primary Key | Credential ID emitted by hardware authenticator. |
| `user_id` | `UUID` | No | FK $\to$ `users(id)` | Owner user account. |
| `public_key` | `BYTEA` | No | None | Stored cryptographic public key. |
| `sign_count` | `BIGINT` | No | Default `0` | Replay attack prevention signature counter. |
| `device_name` | `VARCHAR(128)` | No | None | User-friendly label (e.g., "YubiKey 5 NFC"). |
| `created_at` | `TIMESTAMPTZ` | No | Default `NOW()` | Registration date. |
| `last_used_at`| `TIMESTAMPTZ` | Yes | None | Most recent authentication timestamp. |

#### Places & Usages in System:
* **UI Routes:** `/users/sign_in`, `/my/security`.
* **Tools & APIs:** WebAuthn navigator credentials API; bundle `auth-webauthn-A88yYy33.js`.

---

### Table 6: `aircraft_models` (Type Specifications & Endorsements)

* **Domain:** Fleet Specifications & Pilot Rating Rules
* **Purpose:** Defines aircraft specifications determining student endorsements, fuel types, and hourly rates.

#### Column Definitions:
| Column Name | Data Type | Nullable | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | Primary Key | Model ID. |
| `tenant_id` | `UUID` | No | FK $\to$ `tenants(id)` | Tenant owning this specification. |
| `manufacturer`| `VARCHAR(128)` | No | None | Aircraft maker (e.g., "Cessna", "Diamond"). |
| `model_name` | `VARCHAR(128)` | No | None | Model designation (e.g., "172S Skyhawk", "DA42-VI"). |
| `class_rating`| `VARCHAR(32)` | No | Enum | Rating required (`SEP_LAND`, `MEP_LAND`, `TMG`). |
| `engine_type` | `VARCHAR(32)` | No | Enum | Engine powerplant (`piston_single`, `piston_twin`, `turboprop`, `jet`). |
| `usable_fuel_liters` | `DECIMAL(8,2)` | No | None | Maximum usable fuel capacity in liters. |
| `cruise_speed_knots` | `INTEGER` | No | None | Standard true airspeed (KTAS) for flight planning. |
| `has_retractable_gear`| `BOOLEAN` | No | Default `FALSE` | Complex aircraft endorsement flag. |
| `has_variable_pitch_prop`| `BOOLEAN` | No | Default `FALSE` | Constant speed propeller endorsement flag. |

#### Places & Usages in System:
* **UI Routes:** `/a/:tenant/aircraft_models`, `/a/:tenant/aircraft_models/:id`.
* **Tools & APIs:** GraphQL `aircraftModelCertificateCheck` (verifies student holds rating for model).

---

### Table 7: `aircraft` (Fleet Airframe Inventory)

* **Domain:** Fleet Operations & Airworthiness Management
* **Purpose:** Physical airframes, registration call signs, tachometers, and operational statuses.

#### Column Definitions:
| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Primary Key | Airframe ID. |
| `tenant_id` | `UUID` | No | None | FK $\to$ `tenants(id)` | Owning organization. |
| `model_id` | `UUID` | No | None | FK $\to$ `aircraft_models(id)` | Associated model specification. |
| `call_sign` | `VARCHAR(16)` | No | None | None | Registration tail number (e.g., "OY-AAA", "VT-SA1"). |
| `serial_number` | `VARCHAR(64)` | No | None | None | Manufacturer airframe serial number. |
| `year_of_manufacture` | `INT` | No | None | None | Year built. |
| `status` | `VARCHAR(32)` | No | `'airworthy'` | Enum | Airworthiness status (`airworthy`, `grounded`, `maintenance_due`). |
| `total_airframe_hours`| `DECIMAL(10,2)`| No | `0.00` | None | Current airframe tachometer meter reading. |
| `engine_hours` | `DECIMAL(10,2)`| No | `0.00` | None | Cumulative engine operating hours. |
| `total_landings` | `INTEGER` | No | `0` | None | Cumulative lifetime landing cycles. |
| `current_fuel_liters` | `DECIMAL(8,2)` | No | `0.00` | None | Measured fuel in tanks. |
| `home_airport_icao` | `VARCHAR(4)` | No | None | None | Home airfield ICAO code (e.g., "EKAH"). |
| `deleted_at` | `TIMESTAMPTZ` | Yes | None | None | Soft-deletion timestamp. |
| Constraint | `UNIQUE` | No | `(tenant_id, call_sign)` | Prevents duplicate tail numbers in tenant. |

#### Places & Usages in System:
* **UI Routes:** `/a/:tenant/aircraft`, `/a/:tenant/aircraft/:id`, `/a/:tenant/activities/dep-arr`.
* **UI Components:** Fleet inventory table, aircraft picker on booking timeline, airframe status pill.
* **Tools & APIs:** ActionCable WebSocket broadcasts; `persist:aircraftStatus` in LocalStorage.

#### What Needs to be Checked:
1. Verify that `total_airframe_hours` increases monotonically; any attempt to write a smaller tachometer throws an error.
2. Verify that if `status = 'grounded'`, the aircraft cannot be selected on `/a/:tenant/bookings`.

---

### Table 8: `maintenance_requirements` (Inspection Tracking & Countdowns)

* **Domain:** Fleet Airworthiness & CAMO
* **Purpose:** Tracks 50h, 100h, 200h, Annual, Pitot-Static, and ELT service countdowns.

#### Column Definitions:
| Column Name | Data Type | Nullable | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | Primary Key | Requirement ID. |
| `aircraft_id` | `UUID` | No | FK $\to$ `aircraft(id)` | Target aircraft. |
| `title` | `VARCHAR(128)` | No | None | Inspection name (e.g., "50 Hour Service", "Annual Inspection"). |
| `interval_type` | `VARCHAR(32)` | No | Enum | Interval mode (`flight_hours`, `calendar_days`, `landings_count`). |
| `interval_value` | `DECIMAL(10,2)` | No | None | Full inspection cycle (e.g., 50.00 hours, 365 days). |
| `last_performed_at_meter` | `DECIMAL(10,2)` | Yes | None | Tachometer reading when last signed off by engineer. |
| `last_performed_date` | `DATE` | Yes | None | Calendar date last performed. |
| `hours_left` | `DECIMAL(10,2)` | No | None | Remaining flight hours before mandatory inspection. |
| `is_critical` | `BOOLEAN` | No | Default `TRUE` | If true, airframe automatically grounds when `hours_left <= 0`. |

#### Places & Usages in System:
* **UI Routes:** `/a/:tenant/aircraft/:id/maintenance`, `/a/:tenant/warnings`.
* **Tools & APIs:** GraphQL `query maintenanceRequirements`; post-flight commit decrement service.

#### What Needs to be Checked:
1. Verify that `hours_left` decrements by exactly $\Delta \text{Tach}$ upon flight registration.
2. Verify that when `hours_left <= 0`, `aircraft.status` transitions automatically to `maintenance_due`.

---

### Table 9: `aircraft_remarks` (Defect Squawks & Snags)

* **Domain:** Maintenance Snags & MEL
* **Purpose:** Defect log capturing pilot squawks, avionics faults, and engineer release sign-offs.

#### Column Definitions:
| Column Name | Data Type | Nullable | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | Primary Key | Remark ID. |
| `aircraft_id` | `UUID` | No | FK $\to$ `aircraft(id)` | Aircraft affected. |
| `reported_by_user_id`| `UUID` | No | FK $\to$ `users(id)` | Pilot or engineer who observed defect. |
| `headline` | `VARCHAR(255)` | No | None | Snag summary (e.g., "VHF COM 2 audio garbled"). |
| `details` | `TEXT` | Yes | None | Full pilot technical description. |
| `severity` | `VARCHAR(32)` | No | Enum | Snag impact (`info`, `warning`, `grounding_defect`). |
| `is_rectified` | `BOOLEAN` | No | Default `FALSE` | Rectification status. |
| `rectified_by_license`| `VARCHAR(64)` | Yes | None | CAMO engineer license number certifying repair. |
| `rectified_at` | `TIMESTAMPTZ` | Yes | None | Release to Service timestamp. |
| `created_at` | `TIMESTAMPTZ` | No | Default `NOW()` | Snag filing timestamp. |

---

### Table 10: `certificate_types`, Table 11: `user_certificates`, & Table 12: `certificate_warnings`

* **Domain:** Regulatory Compliance & Pre-Flight Gating
* **Purpose:** Enforces medical clearances, type ratings, flight reviews, and automated gating alerts.

#### Critical Columns:
* `certificate_types`: `id VARCHAR(64) PRIMARY KEY`, `name VARCHAR(128)`, `validity_months INT`, `blocks_booking_on_expiry BOOLEAN`.
* `user_certificates`: `id UUID PRIMARY KEY`, `user_id UUID REFERENCES users(id)`, `certificate_type_id VARCHAR(64)`, `expires_at DATE NOT NULL`, `storage_file_path TEXT`.
* `certificate_warnings`: `id UUID PRIMARY KEY`, `tenant_id UUID`, `user_id UUID`, `warning_code VARCHAR(64)`, `is_blocking BOOLEAN DEFAULT TRUE`.

#### Places & Usages in System:
* **UI Routes:** `/a/:tenant/users/:id/certificates`, `/a/:tenant/warnings`, `/my/warnings`.
* **Tools & APIs:** GraphQL `BookingCertBlockedUserIdsQuery`; pre-flight gating engine.

#### What Needs to be Checked:
1. Verify that a user whose `medical_class_1` expires today cannot be booked for tomorrow.
2. Verify that upload of a new certificate scan updates `expires_at` and clears active warnings.

---

### Table 13: `programs`, Table 14: `program_revisions`, & Table 15: `program_phases`

* **Domain:** Curriculum Structure & Course Management
* **Purpose:** Defines training courses (PPL, CPL, ATPL), authority revisions, and phase milestones.

#### Critical Columns:
* `programs`: `id UUID PRIMARY KEY`, `tenant_id UUID`, `title VARCHAR(255)`, `code VARCHAR(32)`.
* `program_revisions`: `id UUID PRIMARY KEY`, `program_id UUID REFERENCES programs(id)`, `revision_number INT`, `approved_by_naa VARCHAR(64)`, `is_active BOOLEAN`.
* `program_phases`: `id UUID PRIMARY KEY`, `program_revision_id UUID REFERENCES program_revisions(id)`, `phase_order INT`, `title VARCHAR(128)`, `requires_stage_check BOOLEAN`.

---

### Table 16: `syllabus_lessons` & Table 17: `master_exercises`

* **Domain:** Syllabus Sorties & Maneuvers
* **Purpose:** Stores individual flying sorties, ground school lectures, and specific flight exercises.

#### Critical Columns:
* `syllabus_lessons`: `id UUID PRIMARY KEY`, `phase_id UUID REFERENCES program_phases(id)`, `lesson_order INT`, `code VARCHAR(32)` (e.g. "Ex 4.1"), `title VARCHAR(255)`, `lesson_type VARCHAR(32)` (`dual_flight`, `solo_flight`, `simulator`, `ground_school`), `planned_flight_hours DECIMAL(4,2)`.
* `master_exercises`: `id UUID PRIMARY KEY`, `lesson_id UUID REFERENCES syllabus_lessons(id)`, `exercise_order INT`, `code VARCHAR(32)` (e.g. "4.1.a"), `title VARCHAR(255)`, `standard_briefing_notes TEXT`.

---

### Table 18: `core_competencies` & Table 19: `competency_indicators`

* **Domain:** CBTA Competency-Based Training
* **Purpose:** 8 ICAO core competencies (KNO, FPA, FPO, COM, WLM, SAW, PRB, LST) and behavioral markers.

#### Critical Columns:
* `core_competencies`: `id VARCHAR(16) PRIMARY KEY`, `name VARCHAR(128)`, `description TEXT`.
* `competency_indicators`: `id UUID PRIMARY KEY`, `competency_id VARCHAR(16) REFERENCES core_competencies(id)`, `marker_text TEXT NOT NULL`.

---

### Table 20: `user_programs`, Table 21: `user_lectures`, Table 22: `user_exercises`, & Table 23: `graded_competencies`

* **Domain:** Student Progress & 1–5 Norm Grading
* **Purpose:** Student course progress records, lesson grade sheets, and individual exercise evaluations.

#### Critical Columns:
* `user_programs`: `id UUID PRIMARY KEY`, `tenant_id UUID`, `student_id UUID REFERENCES users(id)`, `program_revision_id UUID REFERENCES program_revisions(id)`, `status VARCHAR(32) DEFAULT 'active'`.
* `user_lectures`: `id UUID PRIMARY KEY`, `user_program_id UUID REFERENCES user_programs(id)`, `lesson_id UUID REFERENCES syllabus_lessons(id)`, `instructor_id UUID REFERENCES users(id)`, `flight_id UUID REFERENCES flights(id)`, `status VARCHAR(32)` (`scheduled`, `passed`, `repeat_required`), `overall_norm_grade INT` (1–5 scale).
* `user_exercises`: `id UUID PRIMARY KEY`, `user_lecture_id UUID REFERENCES user_lectures(id)`, `exercise_id UUID REFERENCES master_exercises(id)`, `grade INT` (1–5 norm score), `remarks TEXT`.
* `graded_competencies`: `id UUID PRIMARY KEY`, `user_lecture_id UUID REFERENCES user_lectures(id)`, `competency_id VARCHAR(16) REFERENCES core_competencies(id)`, `score INT` (1–5 norm score).

#### Places & Usages in System:
* **UI Routes:** `/a/:tenant/user_programs/:id`, `/a/:tenant/user_lectures/:id/grade`, `/a/:tenant/cbta/matrix`.
* **Tools & APIs:** GraphQL `mutation addMissingCategoriesToLecture`; bundle `cbtaMatrix-M3nB82vX.js`.

---

### Table 24: `bookings` (Calendar Reservations with GiST Exclusion)

* **Domain:** Scheduling & Dispatch Command
* **Purpose:** Calendar slot reservations protected by PostgreSQL range exclusion locks.

#### Column Definitions:
| Column Name | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Primary Key | Booking reservation ID. |
| `tenant_id` | `UUID` | No | None | FK $\to$ `tenants(id)` | Owning organization. |
| `aircraft_id` | `UUID` | Yes | None | FK $\to$ `aircraft(id)` | Reserved aircraft (nullable for sim/ground). |
| `instructor_id`| `UUID` | Yes | None | FK $\to$ `users(id)` | Assigned flight instructor. |
| `student_id` | `UUID` | Yes | None | FK $\to$ `users(id)` | Assigned student or renter. |
| `lesson_id` | `UUID` | Yes | None | FK $\to$ `syllabus_lessons(id)` | Syllabus lesson to be trained. |
| `start_time` | `TIMESTAMPTZ` | No | None | None | Reservation slot start time. |
| `end_time` | `TIMESTAMPTZ` | No | None | None | Reservation slot end time. |
| `status` | `VARCHAR(32)` | No | `'scheduled'` | Enum | Status (`scheduled`, `briefing`, `flight`, `landed`, `debriefing`, `completed`, `cancelled`). |
| `cancellation_reason` | `TEXT` | Yes | None | None | Stated reason if cancelled. |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | None | Creation timestamp. |
| `updated_at` | `TIMESTAMPTZ` | No | `NOW()` | None | Modification timestamp. |

#### GiST Exclusion Constraints:
```sql
ALTER TABLE bookings ADD CONSTRAINT no_aircraft_overlap 
EXCLUDE USING gist (aircraft_id WITH =, tstzrange(start_time, end_time) WITH &&)
WHERE (status NOT IN ('cancelled', 'draft'));

ALTER TABLE bookings ADD CONSTRAINT no_instructor_overlap 
EXCLUDE USING gist (instructor_id WITH =, tstzrange(start_time, end_time) WITH &&)
WHERE (status NOT IN ('cancelled', 'draft'));

ALTER TABLE bookings ADD CONSTRAINT no_student_overlap 
EXCLUDE USING gist (student_id WITH =, tstzrange(start_time, end_time) WITH &&)
WHERE (status NOT IN ('cancelled', 'draft'));
```

#### Places & Usages in System:
* **UI Routes:** `/a/:tenant/bookings`, `/a/:tenant/activities/dep-arr`.
* **Tools & APIs:** GraphQL `resourceBookings`, `publishBooking`; WebSocket channel `BookingChannel`.

---

### Table 25: `booking_conflicts` (Pre-Flight Gating Exceptions)

* **Domain:** Gating Overrides & Conflict Logs
* **Purpose:** Stores detected schedule conflicts and records administrative manager overrides.

#### Critical Columns:
* `id UUID PRIMARY KEY`, `booking_id UUID REFERENCES bookings(id)`, `conflict_type VARCHAR(64)` (`medical_expired`, `maintenance_due`, `rest_violation`), `details TEXT`, `overridden_by_user_id UUID REFERENCES users(id)`, `override_reason TEXT`.

---

### Table 26: `flights` (Recorded Airframe Journeys)

* **Domain:** Operations & Flight Registration
* **Purpose:** Actual recorded flight log containing off/on-block times, tachometers, and fuel burn.

#### Column Definitions:
| Column Name | Data Type | Nullable | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | Primary Key | Flight log ID. |
| `booking_id` | `UUID` | No | Unique FK $\to$ `bookings(id)` | Associated reservation. |
| `tenant_id` | `UUID` | No | FK $\to$ `tenants(id)` | Tenant organization. |
| `aircraft_id` | `UUID` | No | FK $\to$ `aircraft(id)` | Airframe flown. |
| `departure_icao`| `VARCHAR(4)` | No | None | Origin aerodrome ICAO code (e.g. "EKAH"). |
| `arrival_icao` | `VARCHAR(4)` | No | None | Destination aerodrome ICAO code. |
| `off_block_time`| `TIMESTAMPTZ` | No | None | Chocks away / engine start timestamp. |
| `takeoff_time` | `TIMESTAMPTZ` | No | None | Wheels off / departure timestamp. |
| `landing_time` | `TIMESTAMPTZ` | No | None | Touchdown timestamp. |
| `on_block_time` | `TIMESTAMPTZ` | No | None | Chocks on / engine shutdown timestamp. |
| `block_hours` | `DECIMAL(6,2)` | No | None | Total block time: `(on_block - off_block)` in decimal hours. |
| `flight_hours` | `DECIMAL(6,2)` | No | None | Total air time: `(landing - takeoff)` in decimal hours. |
| `tach_start` | `DECIMAL(10,2)`| No | None | Meter reading prior to engine start. |
| `tach_stop` | `DECIMAL(10,2)`| No | None | Meter reading following engine shutdown. |
| `tach_delta` | `DECIMAL(6,2)` | No | None | Billed tachometer delta: `tach_stop - tach_start`. |
| `fuel_start_liters` | `DECIMAL(8,2)` | No | None | Fuel on board at departure. |
| `fuel_stop_liters` | `DECIMAL(8,2)` | No | None | Fuel on board at arrival. |
| `fuel_consumed_liters` | `DECIMAL(8,2)` | No | None | Consumed fuel: `fuel_start - fuel_stop`. |
| `oil_added_quarts` | `DECIMAL(4,2)` | No | Default `0.00` | Engine oil added during pre-flight. |
| `signed_off_by_pic_id` | `UUID` | No | FK $\to$ `users(id)` | PIC instructor digital signature. |

---

### Table 27: `landings` (Landing Tallies per Aerodrome)

* **Domain:** Currency & Airfield Billing
* **Purpose:** Itemizes day/night, touch-and-go, and full-stop landings for passenger currency and fees.

#### Critical Columns:
* `id UUID PRIMARY KEY`, `flight_id UUID REFERENCES flights(id)`, `aerodrome_icao VARCHAR(4)`, `day_landings INT DEFAULT 0`, `night_landings INT DEFAULT 0`, `touch_and_go_count INT DEFAULT 0`, `full_stop_count INT DEFAULT 0`.

---

### Table 28: `electronic_logbook_entries` (Dual EASA / FAA Pilot Logbook)

* **Domain:** Regulatory Pilot Logbook (EASA Part-FCL.050 / FAA 61.51)
* **Purpose:** Immutable pilot personal logbook records synthesized upon flight completion.

#### Column Definitions:
| Column Name | Data Type | Nullable | Default | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Primary Key. |
| `user_id` | `UUID` | No | None | Pilot or student holding logbook. |
| `flight_id` | `UUID` | No | None | Linked flight sortie. |
| `flight_date` | `DATE` | No | None | Date flight occurred. |
| `aircraft_model_code` | `VARCHAR(32)` | No | None | Model code (e.g. "C172", "DA42"). |
| `aircraft_registration`| `VARCHAR(16)` | No | None | Tail call sign (e.g. "OY-AAA"). |
| `departure_icao` | `VARCHAR(4)` | No | None | Origin airport. |
| `arrival_icao` | `VARCHAR(4)` | No | None | Arrival airport. |
| `total_time_hours` | `DECIMAL(6,2)` | No | None | Total logged time. |
| `pic_hours` | `DECIMAL(6,2)` | No | `0.00` | Pilot-in-Command hours. |
| `dual_received_hours` | `DECIMAL(6,2)` | No | `0.00` | Dual flight instruction received. |
| `instructor_hours` | `DECIMAL(6,2)` | No | `0.00` | Instruction given as CFI. |
| `night_hours` | `DECIMAL(6,2)` | No | `0.00` | Night flight time. |
| `ifr_hours` | `DECIMAL(6,2)` | No | `0.00` | Actual/simulated instrument hours. |
| `day_landings_count` | `INTEGER` | No | `0` | Day landing count. |
| `night_landings_count`| `INTEGER` | No | `0` | Night landing count. |
| `remarks` | `TEXT` | Yes | None | Operational remarks / lesson code. |
| `signature_hash` | `VARCHAR(255)` | No | None | Cryptographic SHA-256 digital signature. |

---

### Table 29: `duty_records` (Crew Duty Periods & EASA Part-FTL)

* **Domain:** Crew Duty Tracking & Rest Rules
* **Purpose:** Duty clock-in/out records, active duty timers, and mandatory rest enforcement.

#### Critical Columns:
* `id UUID PRIMARY KEY`, `tenant_id UUID REFERENCES tenants(id)`, `user_id UUID REFERENCES users(id)`, `duty_start_time TIMESTAMPTZ NOT NULL`, `duty_end_time TIMESTAMPTZ`, `duty_duration_hours DECIMAL(5,2)`, `is_active BOOLEAN DEFAULT TRUE`, `mandatory_rest_until TIMESTAMPTZ`.

---

### Table 30: `customers`, Table 31: `price_lists`, & Table 32: `activities` / `invoices`

* **Domain:** Automated Customer Invoicing (ACI) & Finance
* **Purpose:** Customer accounts, tariff schedules, unbilled flight ledgers, and formal PDF invoices.

#### Critical Columns:
* `customers`: `id UUID PRIMARY KEY`, `tenant_id UUID`, `user_id UUID`, `billing_name VARCHAR(255)`, `account_balance DECIMAL(12,2) DEFAULT 0.00`, `stripe_customer_id VARCHAR(128)`.
* `price_lists`: `id UUID PRIMARY KEY`, `tenant_id UUID`, `name VARCHAR(128)`, `currency VARCHAR(3)`.
* `activities`: `id UUID PRIMARY KEY`, `flight_id UUID REFERENCES flights(id)`, `customer_id UUID REFERENCES customers(id)`, `block_hours DECIMAL(6,2)`, `amount DECIMAL(10,2)`, `status VARCHAR(32) DEFAULT 'unbilled'`.
* `invoices`: `id UUID PRIMARY KEY`, `tenant_id UUID`, `customer_id UUID`, `invoice_number VARCHAR(64) UNIQUE`, `total_amount DECIMAL(10,2)`, `status VARCHAR(32)` (`draft`, `sent`, `paid`, `overdue`).
