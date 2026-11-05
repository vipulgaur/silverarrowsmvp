-- 0009_student_portal_and_flight_extended_columns.sql
--
-- DATA-002/DATA-003 remediation (AUTHORED, NOT YET APPLIED).
--
-- The client sync layer (src/lib/api/sync.ts) currently STRIPS a set of columns
-- before upserting to Supabase, because those columns do not exist on the remote
-- `tenant_members` and `flights` tables yet. The stripped keys are tracked in
-- `LOCAL_ONLY_KEYS` and `EXTENDED_KEYS` in sync.ts. As a result, these fields are
-- persisted ONLY in the local (browser) mirror and never reach the database — a
-- silent local/remote schema drift.
--
-- This migration adds those columns so the data can round-trip to the server.
-- It is additive and idempotent (ADD COLUMN IF NOT EXISTS); it does not alter or
-- drop any existing column and is safe to run on a populated database.
--
-- !! DO NOT APPLY automatically. Applying migrations and touching the live
-- !! Supabase project is an ops action. Review, then run through the project's
-- !! normal migration process (drizzle-kit / Supabase) against staging first.
--
-- After this is applied, the corresponding keys should be removed from
-- LOCAL_ONLY_KEYS / EXTENDED_KEYS in src/lib/api/sync.ts so the data syncs.

-- ---------------------------------------------------------------------------
-- tenant_members: student-portal licence / medical / exam fields
-- ---------------------------------------------------------------------------
alter table public.tenant_members add column if not exists computer_number text;
alter table public.tenant_members add column if not exists egca_id text;
alter table public.tenant_members add column if not exists file_number text;

alter table public.tenant_members add column if not exists spl_number text;
alter table public.tenant_members add column if not exists spl_expiry text;
alter table public.tenant_members add column if not exists frtol_number text;
alter table public.tenant_members add column if not exists frtol_expiry text;
alter table public.tenant_members add column if not exists rtr_number text;
alter table public.tenant_members add column if not exists rtr_expiry text;

-- Theory exam results surfaced in the student portal.
alter table public.tenant_members add column if not exists exam_air_regulation int;
alter table public.tenant_members add column if not exists exam_meteorology int;
alter table public.tenant_members add column if not exists exam_air_navigation int;
alter table public.tenant_members add column if not exists exam_technical_general int;
alter table public.tenant_members add column if not exists exam_technical_specific int;

-- ---------------------------------------------------------------------------
-- flights: time-decomposition fields used by logbook hour breakdowns
-- ---------------------------------------------------------------------------
alter table public.flights add column if not exists day_minutes int check (day_minutes is null or day_minutes >= 0);
alter table public.flights add column if not exists night_minutes int check (night_minutes is null or night_minutes >= 0);
alter table public.flights add column if not exists xc_minutes int check (xc_minutes is null or xc_minutes >= 0);
alter table public.flights add column if not exists multi_engine_minutes int check (multi_engine_minutes is null or multi_engine_minutes >= 0);

-- Who submitted the (possibly student-created, pending) flight-log entry.
alter table public.flights add column if not exists submitted_by text;

-- Verification workflow for student-submitted logs (see verifyFlightLog in logic.ts).
alter table public.flights add column if not exists verification_status text
  check (verification_status is null or verification_status in ('pending','verified','rejected'));
alter table public.flights add column if not exists verified_by text;
alter table public.flights add column if not exists verified_at timestamptz;
