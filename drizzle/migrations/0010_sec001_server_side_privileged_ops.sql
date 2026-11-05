-- 0010_sec001_server_side_privileged_ops.sql
--
-- SEC-001 / SEC-002 remediation (AUTHORED, NOT YET APPLIED).
--
-- Goal: make the Supabase server (RLS + SECURITY DEFINER functions) the sole
-- authority for privileged writes, so the browser no longer needs to sign in as
-- the administrator (getAuthenticatedServiceClient) or as a canonical student
-- (getStudentServiceClient). Those helpers exist only because account
-- registration and student booking-request inserts were being performed with
-- borrowed privileged sessions. The database already enforces the rules via
-- current_member_id(), is_tenant_admin(), and the guard_booking_approval trigger
-- (migration 0007); this migration closes the two remaining gaps.
--
-- !! DO NOT APPLY automatically. Review, then run via the project's normal
-- !! migration process against STAGING first. See PHASE6_SEC001_SERVER_SIDE.md.
--
-- ---------------------------------------------------------------------------
-- 1. Remove the hardcoded master password from register_member().
-- ---------------------------------------------------------------------------
-- The previous definition (migration 0002) compared p_master against the literal
-- 'Vipul@1011' to gate administrator self-registration. A hardcoded secret in a
-- shipped function is the server-side half of SEC-002. The academy already
-- operates a single, seeded administrator, so self-service admin registration is
-- not required: refuse admin self-registration outright. A new administrator is
-- provisioned by an existing admin (or via a seed/service-role migration), never
-- by an end user through this RPC.
create or replace function public.register_member(
  p_first text,
  p_last text,
  p_role public.app_role,
  p_master text default null  -- retained for signature compatibility; now ignored
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_email text;
  v_tenant uuid := '5a0e0000-0000-4000-8000-000000000001';
  v_member text;
begin
  if v_uid is null then
    raise exception 'Not signed in';
  end if;
  select email into v_email from auth.users where id = v_uid;
  if v_email is null then
    raise exception 'Account not found';
  end if;

  -- Existing member record with this email: just link the account.
  select id into v_member from public.tenant_members
   where tenant_id = v_tenant and lower(email) = lower(v_email) and status <> 'deleted'
   limit 1;
  if v_member is not null then
    update public.tenant_members set profile_id = v_uid where id = v_member;
    return v_member;
  end if;

  -- SEC-002: administrator self-registration is not permitted through this RPC.
  -- (No hardcoded master password. Admins are provisioned out-of-band.)
  if p_role = 'admin' then
    raise exception 'Administrator accounts cannot be self-registered.';
  end if;

  v_member := 'm-' || replace(v_uid::text, '-', '');
  insert into public.tenant_members (tenant_id, id, profile_id, name, email, status, status_reason)
  values (v_tenant, v_member, v_uid, trim(p_first || ' ' || p_last), v_email, 'active', 'PENDING_ADMIN_APPROVAL');
  insert into public.member_roles (tenant_id, id, member_id, role)
  values (v_tenant, v_member, v_member, p_role);
  return v_member;
end;
$$;

grant execute on function public.register_member(text, text, public.app_role, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 2. request_booking(): authenticated students create their OWN pending booking
--    request without a borrowed student session.
-- ---------------------------------------------------------------------------
-- The guard_booking_approval trigger already forces approval_status='pending'
-- for a student inserting their own booking. This RPC simply lets the signed-in
-- student perform that insert as themselves (SECURITY INVOKER so RLS + the
-- trigger both apply), removing the need for getStudentServiceClient on the
-- client. It inserts a row owned by the caller; the trigger does the rest.
create or replace function public.request_booking(
  p_id text,
  p_aircraft_id text,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_type text default 'lesson',
  p_instructor_id text default null,
  p_lesson_id text default null,
  p_route text default null,
  p_notes text default null
)
returns text
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_tenant uuid := '5a0e0000-0000-4000-8000-000000000001';
  v_member text := public.current_member_id(v_tenant);
begin
  if v_member is null then
    raise exception 'Not an active member of this academy.';
  end if;
  -- student_id is forced to the caller; the trigger rejects anything else and
  -- sets approval_status='pending' for students.
  insert into public.bookings (
    tenant_id, id, aircraft_id, starts_at, ends_at, type,
    student_id, instructor_id, lesson_id, route, notes, status
  ) values (
    v_tenant, p_id, p_aircraft_id, p_starts_at, p_ends_at, p_type,
    v_member, p_instructor_id, p_lesson_id, p_route, p_notes, 'scheduled'
  );
  return p_id;
end;
$$;

grant execute on function public.request_booking(
  text, text, timestamptz, timestamptz, text, text, text, text, text
) to authenticated;
