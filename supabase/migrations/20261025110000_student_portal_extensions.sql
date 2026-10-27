-- Student Portal Schema Extensions (Silver Arrows FlightLogger)
-- Extends existing tenant_members and flights tables and creates student_documents
-- with foreign keys and Row-Level Security (RLS).

-- 1. Extend tenant_members with aviation identification, licences & validity, and examination status
ALTER TABLE public.tenant_members
  ADD COLUMN IF NOT EXISTS computer_number text,
  ADD COLUMN IF NOT EXISTS egca_id text,
  ADD COLUMN IF NOT EXISTS file_number text,
  ADD COLUMN IF NOT EXISTS spl_number text,
  ADD COLUMN IF NOT EXISTS spl_expiry date,
  ADD COLUMN IF NOT EXISTS frtol_number text,
  ADD COLUMN IF NOT EXISTS frtol_expiry date,
  ADD COLUMN IF NOT EXISTS rtr_number text,
  ADD COLUMN IF NOT EXISTS rtr_expiry date,
  ADD COLUMN IF NOT EXISTS exam_air_regulation boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS exam_meteorology boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS exam_air_navigation boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS exam_technical_general boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS exam_technical_specific text DEFAULT 'Not Attempted';

-- 2. Extend flights with day/night/cross-country/multi-engine breakdown and instructor verification workflow
ALTER TABLE public.flights
  ADD COLUMN IF NOT EXISTS day_minutes integer,
  ADD COLUMN IF NOT EXISTS night_minutes integer,
  ADD COLUMN IF NOT EXISTS xc_minutes integer,
  ADD COLUMN IF NOT EXISTS multi_engine_minutes integer,
  ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'verified'
    CHECK (verification_status IN ('verified', 'pending', 'rejected')),
  ADD COLUMN IF NOT EXISTS submitted_by text REFERENCES public.tenant_members(id),
  ADD COLUMN IF NOT EXISTS verified_by text REFERENCES public.tenant_members(id),
  ADD COLUMN IF NOT EXISTS verified_at timestamptz;

-- 3. Create student_documents table (one-to-many from tenant_members)
CREATE TABLE IF NOT EXISTS public.student_documents (
  tenant_id uuid NOT NULL,
  id text NOT NULL,
  student_id text NOT NULL REFERENCES public.tenant_members(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'other'
    CHECK (category IN ('licence', 'medical', 'radio', 'identification', 'endorsement', 'other')),
  document_number text NOT NULL,
  issued_at date,
  expiry_date date,
  verified boolean NOT NULL DEFAULT false,
  verified_by text REFERENCES public.tenant_members(id),
  notes text,
  inserted_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX IF NOT EXISTS idx_student_documents_student
  ON public.student_documents (tenant_id, student_id)
  WHERE archived_at IS NULL;

ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
