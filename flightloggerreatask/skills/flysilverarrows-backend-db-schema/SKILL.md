---
name: flysilverarrows-backend-db-schema
description: >-
  PostgreSQL 32-table database schema engineering, GiST range exclusion constraints (tstzrange),
  Row-Level Security (RLS) tenant isolation, soft-deletion triggers, and audit changelog architecture
  for FlightLogger / FlySilverArrows backend recreation. Use when authoring DDL migrations, relational
  constraints, or data models.
---

# FlySilverArrows Backend Data Layer & Database Schema Engineering

## 1. Domain & Architectural Mandate
This skill governs the entire data persistence tier for FlySilverArrows / FlightLogger. The backend data tier is built on **PostgreSQL 15+** and strictly enforces four non-negotiable architectural mandates:

1. **Path-Based Tenancy Isolation (`tenant_id NOT NULL`):** Every tenant entity contains a non-nullable `tenant_id UUID REFERENCES tenants(id)`. Queries must enforce Row-Level Security (RLS) using `app.is_member(tenant_id)`.
2. **Physical Overlap Prevention via GiST Exclusion Constraints:** Time-slot double-bookings for aircraft, instructors, students, and simulators are prevented at the database engine level using PostgreSQL interval exclusion constraints (`tstzrange`).
3. **Non-Destructive Soft Deletion:** In civil aviation compliance (EASA Part-ORA / FAA Part 141), pilot flight hours, maintenance logs, and training grades can **never be physically deleted (`DROP` / `DELETE`)**. Deletions set `is_active = FALSE`, `status = 'archived'`, or `deleted_at = NOW()`.
4. **Universal Cryptographic Audit Changelog:** Every write, update, or soft-deletion is recorded in `audit_logs` with executing user UUID, timestamp, IP address, and old/new JSON state diffs.

---

## 2. PostgreSQL Custom ENUM Types

```sql
-- Identity & Access
CREATE TYPE user_gender_enum AS ENUM ('male', 'female', 'other', 'unspecified');
CREATE TYPE user_status_enum AS ENUM ('active', 'suspended', 'graduated', 'archived');
CREATE TYPE role_name_enum AS ENUM ('administrator', 'staff', 'flight_instructor', 'ground_instructor', 'crew', 'renter', 'student');

-- Fleet & Airworthiness
CREATE TYPE engine_type_enum AS ENUM ('piston_single', 'piston_twin', 'turboprop', 'jet');
CREATE TYPE class_rating_enum AS ENUM ('SEP_LAND', 'MEP_LAND', 'TMG', 'SET');
CREATE TYPE aircraft_status_enum AS ENUM ('airworthy', 'grounded', 'maintenance_due');
CREATE TYPE remark_severity_enum AS ENUM ('info', 'warning', 'grounding_defect');
CREATE TYPE maintenance_interval_enum AS ENUM ('flight_hours', 'calendar_days', 'landings_count');

-- Operations & Flight State Machine
CREATE TYPE booking_status_enum AS ENUM ('draft', 'scheduled', 'briefing', 'flight', 'landed', 'debriefing', 'completed', 'cancelled');
CREATE TYPE lesson_type_enum AS ENUM ('dual_flight', 'solo_flight', 'simulator', 'ground_school');
CREATE TYPE lecture_status_enum AS ENUM ('scheduled', 'in_progress', 'passed', 'repeat_required');
CREATE TYPE logbook_role_enum AS ENUM ('PIC', 'DUAL_STUDENT', 'INSTRUCTOR', 'CO_PILOT');

-- Billing & Invoicing
CREATE TYPE activity_status_enum AS ENUM ('unbilled', 'drafted', 'invoiced', 'void');
CREATE TYPE invoice_status_enum AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
```

---

## 3. The 32 Relational Tables DDL & Schema Blueprint

### 3.1 Tenancy & Identity (Tables 1–5)
```sql
-- 1. tenants
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  company_registration_number VARCHAR(64),
  ato_dto_approval_number VARCHAR(64),
  time_zone VARCHAR(64) NOT NULL DEFAULT 'UTC',
  base_currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  address_line1 VARCHAR(255),
  city VARCHAR(128),
  country_code VARCHAR(3) NOT NULL DEFAULT 'IND',
  phone_number VARCHAR(64),
  email VARCHAR(255) NOT NULL,
  logo_url TEXT,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  call_sign VARCHAR(32),
  first_name VARCHAR(128) NOT NULL,
  last_name VARCHAR(128) NOT NULL,
  email VARCHAR(255) NOT NULL,
  encrypted_password VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  gender user_gender_enum NOT NULL DEFAULT 'unspecified',
  nationality VARCHAR(3),
  phone_number VARCHAR(64),
  avatar_url TEXT,
  pilot_license_number VARCHAR(128),
  state_of_license_issue VARCHAR(64),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  status user_status_enum NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_tenant_user_email UNIQUE (tenant_id, email)
);

-- 3. roles
CREATE TABLE IF NOT EXISTS roles (
  id VARCHAR(32) PRIMARY KEY,
  description TEXT NOT NULL,
  default_permissions JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- 4. user_roles
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id VARCHAR(32) NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_tenant_user_role UNIQUE (tenant_id, user_id, role_id)
);

-- 5. webauthn_credentials
CREATE TABLE IF NOT EXISTS webauthn_credentials (
  id VARCHAR(255) PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  public_key BYTEA NOT NULL,
  sign_count BIGINT NOT NULL DEFAULT 0,
  device_name VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);
```

### 3.2 Fleet Airworthiness & Maintenance (Tables 6–9)
```sql
-- 6. aircraft_models
CREATE TABLE IF NOT EXISTS aircraft_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  manufacturer VARCHAR(128) NOT NULL,
  model_name VARCHAR(128) NOT NULL,
  class_rating class_rating_enum NOT NULL DEFAULT 'SEP_LAND',
  engine_type engine_type_enum NOT NULL DEFAULT 'piston_single',
  usable_fuel_liters DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  cruise_speed_knots INTEGER NOT NULL DEFAULT 110,
  has_retractable_gear BOOLEAN NOT NULL DEFAULT FALSE,
  has_variable_pitch_prop BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. aircraft
CREATE TABLE IF NOT EXISTS aircraft (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  model_id UUID NOT NULL REFERENCES aircraft_models(id) ON DELETE RESTRICT,
  call_sign VARCHAR(16) NOT NULL,
  serial_number VARCHAR(64) NOT NULL,
  year_of_manufacture INT NOT NULL,
  status aircraft_status_enum NOT NULL DEFAULT 'airworthy',
  total_airframe_hours DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  engine_hours DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_landings INT NOT NULL DEFAULT 0,
  current_fuel_liters DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  home_airport_icao VARCHAR(4) NOT NULL,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_tenant_call_sign UNIQUE (tenant_id, call_sign)
);

-- 8. maintenance_requirements
CREATE TABLE IF NOT EXISTS maintenance_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aircraft_id UUID NOT NULL REFERENCES aircraft(id) ON DELETE CASCADE,
  title VARCHAR(128) NOT NULL,
  interval_type maintenance_interval_enum NOT NULL DEFAULT 'flight_hours',
  interval_value DECIMAL(10,2) NOT NULL,
  last_performed_at_meter DECIMAL(10,2),
  last_performed_date DATE,
  hours_left DECIMAL(10,2) NOT NULL,
  is_critical BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. aircraft_remarks (Squawks & Snags)
CREATE TABLE IF NOT EXISTS aircraft_remarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aircraft_id UUID NOT NULL REFERENCES aircraft(id) ON DELETE CASCADE,
  reported_by_user_id UUID NOT NULL REFERENCES users(id),
  headline VARCHAR(255) NOT NULL,
  details TEXT,
  severity remark_severity_enum NOT NULL DEFAULT 'warning',
  is_rectified BOOLEAN NOT NULL DEFAULT FALSE,
  rectified_by_license VARCHAR(64),
  rectified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3.3 Regulatory Certificates & Warnings (Tables 10–12)
```sql
-- 10. certificate_types
CREATE TABLE IF NOT EXISTS certificate_types (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  issuer VARCHAR(32) NOT NULL DEFAULT 'EASA',
  validity_months INT,
  blocks_booking_on_expiry BOOLEAN NOT NULL DEFAULT TRUE
);

-- 11. user_certificates
CREATE TABLE IF NOT EXISTS user_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  certificate_type_id VARCHAR(64) NOT NULL REFERENCES certificate_types(id),
  certificate_number VARCHAR(128) NOT NULL,
  issue_date DATE NOT NULL,
  expires_at DATE NOT NULL,
  storage_file_path TEXT,
  verified_by_user_id UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. certificate_warnings
CREATE TABLE IF NOT EXISTS certificate_warnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  certificate_type_id VARCHAR(64) REFERENCES certificate_types(id),
  warning_code VARCHAR(64) NOT NULL,
  message TEXT NOT NULL,
  is_blocking BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3.4 Training Programs & CBTA (Tables 13–19)
```sql
-- 13. programs
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  title VARCHAR(255) NOT NULL,
  code VARCHAR(32) NOT NULL,
  target_license VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. program_revisions
CREATE TABLE IF NOT EXISTS program_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  revision_number INT NOT NULL DEFAULT 1,
  approved_by_naa VARCHAR(64),
  effective_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT uq_program_revision UNIQUE (program_id, revision_number)
);

-- 15. program_phases
CREATE TABLE IF NOT EXISTS program_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_revision_id UUID NOT NULL REFERENCES program_revisions(id) ON DELETE CASCADE,
  phase_order INT NOT NULL,
  title VARCHAR(128) NOT NULL,
  requires_stage_check BOOLEAN NOT NULL DEFAULT FALSE
);

-- 16. syllabus_lessons
CREATE TABLE IF NOT EXISTS syllabus_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id UUID NOT NULL REFERENCES program_phases(id) ON DELETE CASCADE,
  lesson_order INT NOT NULL,
  code VARCHAR(32) NOT NULL,
  title VARCHAR(255) NOT NULL,
  lesson_type lesson_type_enum NOT NULL DEFAULT 'dual_flight',
  planned_flight_hours DECIMAL(4,2) NOT NULL DEFAULT 1.00
);

-- 17. master_exercises
CREATE TABLE IF NOT EXISTS master_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES syllabus_lessons(id) ON DELETE CASCADE,
  exercise_order INT NOT NULL,
  code VARCHAR(32) NOT NULL,
  title VARCHAR(255) NOT NULL,
  standard_briefing_notes TEXT
);

-- 18. core_competencies
CREATE TABLE IF NOT EXISTS core_competencies (
  id VARCHAR(16) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  description TEXT NOT NULL
);

-- 19. competency_indicators
CREATE TABLE IF NOT EXISTS competency_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competency_id VARCHAR(16) NOT NULL REFERENCES core_competencies(id) ON DELETE CASCADE,
  marker_text TEXT NOT NULL
);
```

### 3.5 Student Progress & Evaluations (Tables 20–23)
```sql
-- 20. user_programs
CREATE TABLE IF NOT EXISTS user_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  program_revision_id UUID NOT NULL REFERENCES program_revisions(id),
  enrolled_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. user_lectures
CREATE TABLE IF NOT EXISTS user_lectures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_program_id UUID NOT NULL REFERENCES user_programs(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES syllabus_lessons(id),
  instructor_id UUID NOT NULL REFERENCES users(id),
  flight_id UUID,
  status lecture_status_enum NOT NULL DEFAULT 'scheduled',
  overall_norm_grade INT CHECK (overall_norm_grade BETWEEN 1 AND 5),
  debrief_notes TEXT,
  signed_off_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. user_exercises
CREATE TABLE IF NOT EXISTS user_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_lecture_id UUID NOT NULL REFERENCES user_lectures(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES master_exercises(id),
  grade INT NOT NULL CHECK (grade BETWEEN 1 AND 5),
  remarks TEXT
);

-- 23. graded_competencies
CREATE TABLE IF NOT EXISTS graded_competencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_lecture_id UUID NOT NULL REFERENCES user_lectures(id) ON DELETE CASCADE,
  competency_id VARCHAR(16) NOT NULL REFERENCES core_competencies(id),
  score INT NOT NULL CHECK (score BETWEEN 1 AND 5),
  evidence_notes TEXT
);
```

### 3.6 Bookings, Flights & Electronic Logbooks (Tables 24–28)
```sql
-- Extension required for GiST range exclusion locks
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 24. bookings (with physical GiST range exclusion constraints)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  aircraft_id UUID REFERENCES aircraft(id) ON DELETE RESTRICT,
  instructor_id UUID REFERENCES users(id) ON DELETE RESTRICT,
  student_id UUID REFERENCES users(id) ON DELETE RESTRICT,
  lesson_id UUID REFERENCES syllabus_lessons(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status booking_status_enum NOT NULL DEFAULT 'scheduled',
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_booking_time CHECK (end_time > start_time)
);

-- Physical Overlap Prevention Locks
ALTER TABLE bookings ADD CONSTRAINT uq_no_aircraft_double_booking 
EXCLUDE USING gist (aircraft_id WITH =, tstzrange(start_time, end_time) WITH &&)
WHERE (status NOT IN ('cancelled', 'draft'));

ALTER TABLE bookings ADD CONSTRAINT uq_no_instructor_double_booking 
EXCLUDE USING gist (instructor_id WITH =, tstzrange(start_time, end_time) WITH &&)
WHERE (status NOT IN ('cancelled', 'draft'));

ALTER TABLE bookings ADD CONSTRAINT uq_no_student_double_booking 
EXCLUDE USING gist (student_id WITH =, tstzrange(start_time, end_time) WITH &&)
WHERE (status NOT IN ('cancelled', 'draft'));

-- 25. booking_conflicts
CREATE TABLE IF NOT EXISTS booking_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  conflict_type VARCHAR(64) NOT NULL,
  details TEXT NOT NULL,
  overridden_by_user_id UUID REFERENCES users(id),
  override_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 26. flights
CREATE TABLE IF NOT EXISTS flights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  aircraft_id UUID NOT NULL REFERENCES aircraft(id) ON DELETE RESTRICT,
  departure_icao VARCHAR(4) NOT NULL,
  arrival_icao VARCHAR(4) NOT NULL,
  off_block_time TIMESTAMPTZ NOT NULL,
  takeoff_time TIMESTAMPTZ NOT NULL,
  landing_time TIMESTAMPTZ NOT NULL,
  on_block_time TIMESTAMPTZ NOT NULL,
  block_hours DECIMAL(6,2) NOT NULL,
  flight_hours DECIMAL(6,2) NOT NULL,
  tach_start DECIMAL(10,2) NOT NULL,
  tach_stop DECIMAL(10,2) NOT NULL,
  tach_delta DECIMAL(6,2) NOT NULL CHECK (tach_delta > 0),
  fuel_start_liters DECIMAL(8,2) NOT NULL,
  fuel_stop_liters DECIMAL(8,2) NOT NULL,
  fuel_consumed_liters DECIMAL(8,2) NOT NULL,
  oil_added_quarts DECIMAL(4,2) NOT NULL DEFAULT 0.00,
  signed_off_by_pic_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 27. landings
CREATE TABLE IF NOT EXISTS landings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_id UUID NOT NULL REFERENCES flights(id) ON DELETE CASCADE,
  aerodrome_icao VARCHAR(4) NOT NULL,
  day_landings INT NOT NULL DEFAULT 0,
  night_landings INT NOT NULL DEFAULT 0,
  touch_and_go_count INT NOT NULL DEFAULT 0,
  full_stop_count INT NOT NULL DEFAULT 0
);

-- 28. electronic_logbook_entries
CREATE TABLE IF NOT EXISTS electronic_logbook_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  flight_id UUID NOT NULL REFERENCES flights(id) ON DELETE CASCADE,
  flight_date DATE NOT NULL,
  aircraft_model_code VARCHAR(32) NOT NULL,
  aircraft_registration VARCHAR(16) NOT NULL,
  departure_icao VARCHAR(4) NOT NULL,
  arrival_icao VARCHAR(4) NOT NULL,
  total_time_hours DECIMAL(6,2) NOT NULL,
  pic_hours DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  dual_received_hours DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  instructor_hours DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  night_hours DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  ifr_hours DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  day_landings_count INT NOT NULL DEFAULT 0,
  night_landings_count INT NOT NULL DEFAULT 0,
  pilot_role logbook_role_enum NOT NULL,
  remarks TEXT,
  signature_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3.7 Crew Duty & Invoicing (Tables 29–32)
```sql
-- 29. duty_records
CREATE TABLE IF NOT EXISTS duty_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  duty_start_time TIMESTAMPTZ NOT NULL,
  duty_end_time TIMESTAMPTZ,
  duty_duration_hours DECIMAL(5,2),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  mandatory_rest_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 30. customers
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID REFERENCES users(id),
  billing_name VARCHAR(255) NOT NULL,
  vat_number VARCHAR(64),
  billing_email VARCHAR(255) NOT NULL,
  account_balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  stripe_customer_id VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 31. price_lists & price_list_items
CREATE TABLE IF NOT EXISTS price_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(128) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS price_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  price_list_id UUID NOT NULL REFERENCES price_lists(id) ON DELETE CASCADE,
  item_type VARCHAR(32) NOT NULL,
  aircraft_model_id UUID REFERENCES aircraft_models(id),
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00
);

-- 32. activities & invoices
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_id UUID NOT NULL REFERENCES flights(id) ON DELETE RESTRICT,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  block_hours DECIMAL(6,2) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status activity_status_enum NOT NULL DEFAULT 'unbilled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  invoice_number VARCHAR(64) UNIQUE NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL,
  status invoice_status_enum NOT NULL DEFAULT 'draft',
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 4. Verification & Testing Rules for Database Schema
1. **Constraint Testing:** Attempting to insert two bookings with the same `aircraft_id` in overlapping `tstzrange` must raise error code `23P01` (`exclusion_violation`).
2. **Precision Testing:** Verify `total_airframe_hours` and `block_hours` use 2 decimal places. Floating point types (`REAL`, `FLOAT`) are forbidden.
3. **Foreign Key Testing:** Deleting a `tenant` with active flights must fail (`23503: foreign_key_violation`).
