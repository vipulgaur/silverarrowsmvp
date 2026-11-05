# Phase 6 — SEC-001 server-side re-architecture (authored, NOT applied)

Status: **authored for review only.** Nothing in this phase has been deployed, and
no migration or RLS change has been applied to the live Supabase project. Applying
any of this is a production/ops action that needs an explicit, separate go-ahead.

## The problem (recap)

The browser signed in as the administrator (`getAuthenticatedServiceClient`) and as
a canonical student (`getStudentServiceClient`) using a hardcoded password, and
routed privileged writes through those sessions. That bypasses Row-Level Security,
and it ships the admin credential to every client.

Phase 0 already contained this: those helpers now read an env var and **no-op when it
is absent**, so a shipped bundle can no longer authenticate as the administrator by
default. Phase 6 removes the *need* for them by making the server the authority.

## Good news: the server authority already exists

The database (migrations `0000`, `0003`–`0007`) already provides:

- RLS enabled on every tenant table, with `members read` / `own or admin insert|update` / `admins insert|update` policies.
- `public.current_member_id(tenant)`, `public.is_tenant_admin(tenant)` helpers (SECURITY DEFINER).
- `public.register_member(...)` RPC — an **authenticated user** links/creates their own member row; no client credentials needed.
- `guard_booking_approval` trigger — forces `approval_status='pending'` when a **student inserts their own** booking, and blocks everything else.

So the two client "service client" paths are redundant with existing server logic.

## What migration `0010` adds

`drizzle/migrations/0010_sec001_server_side_privileged_ops.sql` (authored):

1. **Removes the hardcoded `Vipul@1011`** from `register_member()` (it was the
   server-side half of SEC-002) and refuses admin self-registration outright.
   Note: migration `0002` still contains the old literal in git history — rotating
   the admin password (below) is what actually neutralizes it.
2. Adds **`request_booking(...)`** (SECURITY INVOKER) so a signed-in student creates
   their own pending booking request as themselves — RLS + the approval trigger both
   apply. This replaces `getStudentServiceClient`.

## Client changes to make AFTER `0010` is applied

These are intentionally **not** made yet, because they only work once the DB side is
live (otherwise registration/booking would break against the current database):

1. `src/integrations/supabase/client.ts`
   - Delete `getAuthenticatedServiceClient` and `getStudentServiceClient` and all
     their call sites. Reads/writes use the caller's own authenticated `supabase`
     session; RLS decides visibility.
   - In the `register_member` proxy branch, call the real RPC
     (`realSupabase.rpc("register_member", {...})`) instead of signing in as admin
     and upserting `tenant_members`/`member_roles` directly.
   - Remove `ADMIN_SYNC_PASSWORD` / `STUDENT_SYNC_PASSWORD` env plumbing once the
     above no longer references them.
2. `src/lib/api/sync.ts`
   - `getCloudDb()` / `getStudentDb()` should return the caller's `supabase` client
     (not a service client). The booking "pending insert" branch in `pushChanges`
     and `persistBooking` should call `supabase.rpc("request_booking", {...})` for a
     student's own new pending booking, and plain inserts/updates (under RLS) for
     everything else.

After those client edits, run `npm run typecheck && npm test && npm run build`.

## Alternative: Edge Function (only if you need true service-role operations)

If some operation genuinely needs the service-role key (e.g. an admin acting on
another member in a way RLS can't express), do NOT put the key in the browser. Add a
Supabase Edge Function that holds `SUPABASE_SERVICE_ROLE_KEY` server-side and verifies
the caller's JWT + admin role before acting. Sketch:

```ts
// supabase/functions/admin-op/index.ts  (NOT created — sketch only)
import { createClient } from "jsr:@supabase/supabase-js";
Deno.serve(async (req) => {
  const authHeader = req.headers.get("Authorization") ?? "";
  // 1. Verify the caller with the ANON client + their JWT.
  const asCaller = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user } } = await asCaller.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  // 2. Confirm admin via is_tenant_admin (RLS-backed RPC) before privileged work.
  // 3. Only then use a service-role client for the specific, audited operation.
  const admin = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  // ... perform the one narrow operation ...
  return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } });
});
```

The service-role key lives only in the function's environment, never in the client
bundle.

## Exact apply steps (run by you, against staging first)

1. Review `0010_sec001_server_side_privileged_ops.sql` and `0009_...sql`.
2. Apply to **staging**:
   - via drizzle-kit: `npx drizzle-kit migrate` (or the project's configured command), **or**
   - paste the SQL into the Supabase SQL editor for the staging project.
3. Make the client edits above; run typecheck + tests + build; smoke-test
   registration and student booking against staging.
4. Apply to **production** only after staging passes.

## Separate ops actions still required (not code)

- **Rotate the `Vipul@1011` admin password** in the Supabase Auth dashboard. It has
  been in source and in git history; the migration/code changes do not rotate it.
- **Untrack `.env`**: `git rm --cached .env`, add `.env` to `.gitignore`, and rotate
  any exposed keys. (Not done here — touches git history that syncs to Lovable.)
