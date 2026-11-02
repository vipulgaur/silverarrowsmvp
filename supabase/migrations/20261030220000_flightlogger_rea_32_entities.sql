-- ============================================================================
-- FLIGHTLOGGER REA 32-ENTITY COMPLETE DATABASE SCHEMA & ACID STORED PROCEDURES
-- Implements all missing entities from:
--   03_DATABASE_SCHEMA_32_ENTITIES.md
--   05_CORE_ENGINES_AND_STATE_MACHINES.md
--   10_DATABASE_TABLES_COLUMNS_AND_USAGES_ENCYCLOPEDIA.md
-- ============================================================================

-- 1. WebAuthn FIDO2 Hardware Credentials (Table 5)
CREATE TABLE IF NOT EXISTS public.webauthn_credentials (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  credential_id TEXT NOT NULL UNIQUE,
  public_key TEXT NOT NULL,
  sign_count INTEGER NOT NULL DEFAULT 0,
  device_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

-- 2. Aircraft Models & Class Ratings (Table 6)
CREATE TABLE IF NOT EXISTS public.aircraft_models (
  id TEXT PRIMARY KEY,
  make TEXT NOT NULL,
  model_name TEXT NOT NULL,
  class_rating TEXT NOT NULL CHECK (class_rating IN ('SEP_LAND', 'MEP_LAND', 'TMG', 'SET', 'MET', 'FNPT_II')),
  engine_type TEXT NOT NULL,
  engine_count INTEGER NOT NULL DEFAULT 1,
  usable_fuel_liters NUMERIC(8,2) NOT NULL DEFAULT 200,
  fuel_burn_lph NUMERIC(8,2) NOT NULL DEFAULT 36,
  cruise_speed_knots INTEGER NOT NULL DEFAULT 120,
  max_takeoff_weight_kg NUMERIC(8,2) NOT NULL DEFAULT 1157,
  max_landing_weight_kg NUMERIC(8,2) NOT NULL DEFAULT 1157,
  empty_weight_kg NUMERIC(8,2) NOT NULL DEFAULT 762,
  empty_cg_arm_mm NUMERIC(8,2) NOT NULL DEFAULT 1016,
  has_retractable_gear BOOLEAN NOT NULL DEFAULT FALSE,
  has_variable_pitch_prop BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Aircraft Remarks / Squawks & CAMO CRS (Table 9)
CREATE TABLE IF NOT EXISTS public.aircraft_remarks (
  id TEXT PRIMARY KEY,
  aircraft_id TEXT NOT NULL,
  reported_by TEXT NOT NULL,
  flight_id TEXT,
  reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'grounding_defect')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'deferred_mel', 'rectified')),
  description TEXT NOT NULL,
  mel_reference TEXT,
  deferred_until_date DATE,
  rectified_by TEXT,
  rectified_by_license TEXT,
  rectification_notes TEXT,
  work_order_ref TEXT,
  rectified_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ
);

-- 4. Certificate Types, User Certificates & Compliance Warnings (Tables 10-12)
CREATE TABLE IF NOT EXISTS public.certificate_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('medical', 'license', 'rating', 'radio', 'language_proficiency', 'passport', 'company_check')),
  warning_days_before INTEGER NOT NULL DEFAULT 45,
  blocks_booking BOOLEAN NOT NULL DEFAULT TRUE,
  blocks_solo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.user_certificates (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  certificate_type_id TEXT NOT NULL REFERENCES public.certificate_types(id),
  certificate_number TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  class_or_level TEXT,
  file_storage_path TEXT,
  verified_by TEXT,
  verified_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.certificate_warnings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_certificate_id TEXT REFERENCES public.user_certificates(id),
  warning_code TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('expiring_soon', 'expired', 'missing_mandatory')),
  blocks_dispatch BOOLEAN NOT NULL DEFAULT TRUE,
  blocks_solo BOOLEAN NOT NULL DEFAULT TRUE,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Program Revisions, Phases, Master Exercises & ICAO CBTA Competencies (Tables 14, 15, 17-23)
CREATE TABLE IF NOT EXISTS public.program_revisions (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL,
  revision_number TEXT NOT NULL,
  effective_date DATE NOT NULL,
  approved_by_authority_ref TEXT,
  is_current BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.program_phases (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL,
  revision_id TEXT NOT NULL REFERENCES public.program_revisions(id),
  name TEXT NOT NULL,
  sequence_order INTEGER NOT NULL DEFAULT 1,
  requires_stage_check BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.master_exercises (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  norm_target_grade INTEGER NOT NULL DEFAULT 4 CHECK (norm_target_grade BETWEEN 1 AND 5),
  is_mandatory BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.core_competencies (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE CHECK (code IN ('KNO', 'FPA', 'FPO', 'COM', 'WLM', 'SAW', 'PRB', 'LST')),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  min_acceptable_score INTEGER NOT NULL DEFAULT 2 CHECK (min_acceptable_score BETWEEN 1 AND 5)
);

CREATE TABLE IF NOT EXISTS public.competency_indicators (
  id TEXT PRIMARY KEY,
  competency_id TEXT NOT NULL REFERENCES public.core_competencies(id),
  competency_code TEXT NOT NULL,
  indicator_code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_programs (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  program_id TEXT NOT NULL,
  revision_id TEXT NOT NULL,
  primary_instructor_id TEXT,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'on_hold', 'completed', 'withdrawn'))
);

CREATE TABLE IF NOT EXISTS public.user_lectures (
  id TEXT PRIMARY KEY,
  user_program_id TEXT,
  student_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  flight_id TEXT NOT NULL,
  instructor_id TEXT NOT NULL,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL CHECK (status IN ('planned', 'in_progress', 'passed', 'repeat_required')),
  overall_grade INTEGER NOT NULL CHECK (overall_grade BETWEEN 1 AND 5),
  debrief_remarks TEXT,
  instructor_signature_hash TEXT NOT NULL,
  student_signature_hash TEXT NOT NULL,
  signed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_exercises (
  id TEXT PRIMARY KEY,
  user_lecture_id TEXT NOT NULL REFERENCES public.user_lectures(id),
  flight_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  exercise_code TEXT NOT NULL,
  grade INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 5),
  attempt_count INTEGER NOT NULL DEFAULT 1,
  instructor_remark TEXT
);

CREATE TABLE IF NOT EXISTS public.graded_competencies (
  id TEXT PRIMARY KEY,
  user_lecture_id TEXT NOT NULL REFERENCES public.user_lectures(id),
  flight_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  competency_id TEXT NOT NULL,
  competency_code TEXT NOT NULL CHECK (competency_code IN ('KNO', 'FPA', 'FPO', 'COM', 'WLM', 'SAW', 'PRB', 'LST')),
  score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
  observed_indicators TEXT[] NOT NULL DEFAULT '{}',
  debrief_comment TEXT
);

-- 6. Booking Conflicts, Landings & Dual Electronic Logbook Entries (Tables 25, 27, 28)
CREATE TABLE IF NOT EXISTS public.booking_conflicts (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL,
  gate_number INTEGER NOT NULL CHECK (gate_number BETWEEN 1 AND 7),
  conflict_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('blocking', 'warning')),
  message TEXT NOT NULL,
  overridden_by TEXT,
  override_reason TEXT,
  overridden_at TIMESTAMPTZ,
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.landings (
  id TEXT PRIMARY KEY,
  flight_id TEXT NOT NULL,
  pilot_id TEXT NOT NULL,
  date DATE NOT NULL,
  airport_icao TEXT NOT NULL,
  class_rating TEXT NOT NULL DEFAULT 'SEP_LAND',
  day_full_stop INTEGER NOT NULL DEFAULT 0,
  day_touch_and_go INTEGER NOT NULL DEFAULT 0,
  night_full_stop INTEGER NOT NULL DEFAULT 0,
  night_touch_and_go INTEGER NOT NULL DEFAULT 0,
  approaches_ils INTEGER NOT NULL DEFAULT 0,
  approaches_rnp INTEGER NOT NULL DEFAULT 0,
  approaches_visual INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.electronic_logbook_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  flight_id TEXT NOT NULL,
  date DATE NOT NULL,
  aircraft_reg TEXT NOT NULL,
  aircraft_model TEXT NOT NULL,
  class_rating TEXT NOT NULL DEFAULT 'SEP_LAND',
  departure_icao TEXT NOT NULL,
  arrival_icao TEXT NOT NULL,
  off_block TEXT NOT NULL,
  on_block TEXT NOT NULL,
  role_capacity TEXT NOT NULL CHECK (role_capacity IN ('PIC', 'DUAL_STUDENT', 'INSTRUCTOR', 'SPIC', 'PICUS', 'SIM_INSTRUCTOR')),
  pic_name TEXT NOT NULL,
  total_minutes INTEGER NOT NULL,
  se_day_minutes INTEGER NOT NULL DEFAULT 0,
  se_night_minutes INTEGER NOT NULL DEFAULT 0,
  me_day_minutes INTEGER NOT NULL DEFAULT 0,
  me_night_minutes INTEGER NOT NULL DEFAULT 0,
  ifr_minutes INTEGER NOT NULL DEFAULT 0,
  sim_minutes INTEGER NOT NULL DEFAULT 0,
  pic_minutes INTEGER NOT NULL DEFAULT 0,
  dual_minutes INTEGER NOT NULL DEFAULT 0,
  instructor_minutes INTEGER NOT NULL DEFAULT 0,
  spic_minutes INTEGER NOT NULL DEFAULT 0,
  picus_minutes INTEGER NOT NULL DEFAULT 0,
  day_landings INTEGER NOT NULL DEFAULT 0,
  night_landings INTEGER NOT NULL DEFAULT 0,
  remarks TEXT,
  signature_hash TEXT NOT NULL,
  signed_by_name TEXT NOT NULL,
  signed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_locked BOOLEAN NOT NULL DEFAULT TRUE
);

-- 7. Automated Customer Invoicing (ACI) & Indian GST Ledger (Tables 30-32)
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  customer_number TEXT NOT NULL UNIQUE,
  billing_name TEXT NOT NULL,
  billing_email TEXT NOT NULL,
  billing_address TEXT,
  gstin TEXT,
  state_code TEXT NOT NULL DEFAULT '07',
  currency TEXT NOT NULL DEFAULT 'INR',
  account_balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  credit_limit NUMERIC(12,2) NOT NULL DEFAULT 50000,
  payment_terms_days INTEGER NOT NULL DEFAULT 14,
  auto_block_when_over_limit BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.price_lists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  effective_from DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.price_list_items (
  id TEXT PRIMARY KEY,
  price_list_id TEXT NOT NULL REFERENCES public.price_lists(id),
  item_type TEXT NOT NULL,
  target_ref_id TEXT,
  title TEXT NOT NULL,
  sac_code TEXT NOT NULL DEFAULT '999293',
  unit_price NUMERIC(12,2) NOT NULL,
  gst_rate_percent NUMERIC(5,2) NOT NULL DEFAULT 18
);

CREATE TABLE IF NOT EXISTS public.activities (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES public.customers(id),
  user_id TEXT NOT NULL,
  flight_id TEXT,
  date DATE NOT NULL,
  item_type TEXT NOT NULL,
  description TEXT NOT NULL,
  sac_code TEXT NOT NULL DEFAULT '999293',
  quantity NUMERIC(10,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'hours',
  unit_price NUMERIC(12,2) NOT NULL,
  subtotal_amount NUMERIC(12,2) NOT NULL,
  gst_rate_percent NUMERIC(5,2) NOT NULL DEFAULT 18,
  cgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  sgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  igst_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'unbilled' CHECK (status IN ('unbilled', 'invoiced', 'waived')),
  invoice_id TEXT
);

CREATE TABLE IF NOT EXISTS public.invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL REFERENCES public.customers(id),
  user_id TEXT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  subtotal_amount NUMERIC(12,2) NOT NULL,
  cgst_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  sgst_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  igst_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  grand_total NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('draft', 'issued', 'paid', 'overdue', 'void')),
  stripe_payment_intent_id TEXT,
  paid_at TIMESTAMPTZ
);

-- 8. Safety Management System (SMS) Reports & Solo Endorsements
CREATE TABLE IF NOT EXISTS public.sms_reports (
  id TEXT PRIMARY KEY,
  report_number TEXT NOT NULL UNIQUE,
  reported_by TEXT NOT NULL,
  flight_id TEXT,
  aircraft_id TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  severity INTEGER NOT NULL CHECK (severity BETWEEN 1 AND 5),
  likelihood TEXT NOT NULL CHECK (likelihood IN ('A', 'B', 'C', 'D', 'E')),
  risk_index TEXT NOT NULL,
  risk_zone TEXT NOT NULL CHECK (risk_zone IN ('RED', 'AMBER', 'GREEN')),
  is_confidential BOOLEAN NOT NULL DEFAULT FALSE,
  root_cause_analysis TEXT,
  capa_mitigation_plan TEXT,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_investigation', 'mitigation_in_progress', 'closed')),
  investigated_by TEXT,
  closed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.solo_endorsements (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  instructor_id TEXT NOT NULL,
  aircraft_model_id TEXT NOT NULL,
  aerodrome_icao TEXT NOT NULL DEFAULT 'VIDP',
  max_crosswind_kt INTEGER NOT NULL DEFAULT 10,
  max_wind_kt INTEGER NOT NULL DEFAULT 18,
  min_visibility_meters INTEGER NOT NULL DEFAULT 5000,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  signature_hash TEXT NOT NULL,
  notes TEXT
);
