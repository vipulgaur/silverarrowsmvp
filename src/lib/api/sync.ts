/** Reads and writes the academy's records in Lovable Cloud. Row-level security decides what each member may see or change. */
import { supabase } from "@/integrations/supabase/client";
import type { AppData } from "@/lib/types";
import { TABLE_ORDER, fromTables, toTables, type Changes, type TableName } from "./mapping";

// Generated table types are strict; this layer writes rows already shaped by the mapping module.
type QueryChain = {
  select: (cols: string) => QueryChain;
  eq: (col: string, val: unknown) => QueryChain;
  is: (col: string, val: unknown) => QueryChain;
  in: (col: string, vals: readonly unknown[]) => QueryChain;
  limit: (count: number) => QueryChain;
  range: (from: number, to: number) => QueryChain;
  maybeSingle: () => Promise<{
    data: Record<string, unknown> | null;
    error: { message: string } | null;
  }>;
  single: () => Promise<{ data: Record<string, unknown>; error: { message: string } | null }>;
  insert: (row: Record<string, unknown>) => QueryChain;
  update: (vals: Record<string, unknown>) => QueryChain;
  upsert: (vals: Record<string, unknown>[], opts?: Record<string, unknown>) => QueryChain;
  then: <
    TResult1 = {
      data: Record<string, unknown>[] | null;
      error: { message: string; details?: string | null; code?: string } | null;
    },
  >(
    onfulfilled?:
      | ((value: {
          data: Record<string, unknown>[] | null;
          error: { message: string; details?: string | null; code?: string } | null;
        }) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: unknown) => never) | null,
  ) => Promise<TResult1>;
};

const db = supabase as unknown as { from: (t: string) => QueryChain };

export interface Loaded {
  data: AppData;
  tenantId: string;
  meId: string;
}

export async function loadAcademy(userId: string): Promise<Loaded | null> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
  let membership: Record<string, unknown> | null = null;
  if (isUuid) {
    const { data, error } = await db
      .from("tenant_members")
      .select("tenant_id, id")
      .eq("profile_id", userId)
      .eq("status", "active")
      .is("archived_at", null)
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    membership = data;
  }

  // If not linked by profile_id yet, link by the authenticated user's email
  if (!membership) {
    const { data: authData } = await supabase.auth.getUser();
    const userEmail = authData?.user?.email?.trim().toLowerCase();
    if (userEmail) {
      const { data: byEmail } = await db
        .from("tenant_members")
        .select("tenant_id, id")
        .ilike("email", userEmail)
        .eq("status", "active")
        .is("archived_at", null)
        .limit(1)
        .maybeSingle();

      if (byEmail) {
        membership = byEmail;
        await db
          .from("tenant_members")
          .update({ profile_id: userId })
          .eq("id", byEmail.id);
      } else {
        try {
          const namePart = userEmail.split("@")[0] || "Pilot";
          const res = await supabase.rpc("register_member", {
            p_first: namePart,
            p_last: "Member",
            p_role: "student",
          });
          if (res?.data) {
            membership = {
              tenant_id: "5a0e0000-0000-4000-8000-000000000001",
              id: res.data as string,
            };
          }
        } catch {
          /* ignore rpc fallback */
        }
      }
    }
  }

  if (!membership) return null;
  const tenantId = membership.tenant_id as string;
  const results = await Promise.all(
    TABLE_ORDER.map(async (t) => {
      const rows: Record<string, unknown>[] = [];
      for (let from = 0; ; from += 1000) {
        const { data, error } = await db
          .from(t)
          .select("*")
          .eq("tenant_id", tenantId)
          .is("archived_at", null)
          .range(from, from + 999);
        if (error) throw new Error(`${t}: ${error.message}`);
        rows.push(...(data ?? []));
        if (!data || data.length < 1000) break;
      }
      return [t, rows] as const;
    }),
  );
  return {
    data: fromTables(Object.fromEntries(results) as Record<TableName, Record<string, unknown>[]>),
    tenantId,
    meId: membership.id as string,
  };
}

/** Archive removed rows first (frees booking slots), then upsert in foreign-key order. */
export async function pushChanges(c: Changes, tenantId: string): Promise<void> {
  for (const t of [...TABLE_ORDER].reverse()) {
    const ids = c.archives[t];
    if (!ids?.length) continue;
    const { error } = await db
      .from(t)
      .update({ archived_at: new Date().toISOString() })
      .eq("tenant_id", tenantId)
      .in("id", ids);
    if (error) throw new Error(friendly(error));
  }
  for (const t of TABLE_ORDER) {
    const rows = c.upserts[t];
    if (!rows?.length) continue;
    const payload: Record<string, unknown>[] = rows.map((r) => ({ ...r, archived_at: null }));
    if (t === "bookings") {
      for (const row of payload) {
        const { requested_at: _requestedAt, requested_by: _requestedBy, ...updateRow } = row;
        const { data: existing } = await db
          .from(t)
          .select("id")
          .eq("tenant_id", tenantId)
          .eq("id", row["id"])
          .maybeSingle();

        if (existing) {
          const { error } = await db
            .from(t)
            .update(updateRow)
            .eq("tenant_id", tenantId)
            .eq("id", row["id"]);
          if (error) throw new Error(friendly(error));
        } else {
          const { error } = await db.from(t).insert(row);
          if (error && error.code !== "23505") throw new Error(friendly(error));
        }
      }
      continue;
    }
    if (t === "activity_feed") {
      const { error } = await db
        .from(t)
        .upsert(payload, { onConflict: "tenant_id,id", ignoreDuplicates: true });
      if (error && error.code !== "42501" && error.code !== "23505")
        throw new Error(friendly(error));
      continue;
    }
    const { error } = await db.from(t).upsert(payload, { onConflict: "tenant_id,id" });
    if (error) {
      // Graceful fallback if optional student-portal columns have not been migrated on the remote table yet
      if (t === "tenant_members" || t === "flights") {
        const EXTENDED_KEYS = new Set([
          "computer_number",
          "egca_id",
          "file_number",
          "spl_number",
          "spl_expiry",
          "frtol_number",
          "frtol_expiry",
          "rtr_number",
          "rtr_expiry",
          "exam_air_regulation",
          "exam_meteorology",
          "exam_air_navigation",
          "exam_technical_general",
          "exam_technical_specific",
          "day_minutes",
          "night_minutes",
          "xc_minutes",
          "multi_engine_minutes",
          "verification_status",
          "submitted_by",
          "verified_by",
          "verified_at",
        ]);
        const fallbackPayload = payload.map((row) =>
          Object.fromEntries(Object.entries(row).filter(([k]) => !EXTENDED_KEYS.has(k))),
        );
        const { error: retryErr } = await db
          .from(t)
          .upsert(fallbackPayload, { onConflict: "tenant_id,id" });
        if (!retryErr) continue;
      }
      throw new Error(friendly(error));
    }
  }
}

/** Save a single booking and return the canonical row after database approval guards. */
export async function persistBooking(
  booking: AppData["bookings"][number],
  tenantId: string,
  data: AppData,
) {
  const row = toTables({ ...data, bookings: [booking] }, tenantId).bookings[0];
  if (!row) throw new Error("Booking not found.");

  const { data: remoteExisting } = await db
    .from("bookings")
    .select("id, approval_status, requested_by, requested_at, reviewed_by, reviewed_at, decision_notes")
    .eq("tenant_id", tenantId)
    .eq("id", booking.id)
    .maybeSingle();

  const exists = !!remoteExisting;
  const previous = remoteExisting
    ? {
        approvalStatus: remoteExisting.approval_status as AppData["bookings"][number]["approvalStatus"],
        requestedBy: remoteExisting.requested_by as string | undefined,
        requestedAt: remoteExisting.requested_at as string | undefined,
        reviewedBy: remoteExisting.reviewed_by as string | undefined,
        reviewedAt: remoteExisting.reviewed_at as string | undefined,
        decisionNotes: remoteExisting.decision_notes as string | undefined,
      }
    : data.bookings.find((b) => b.id === booking.id);

  const safeRow = previous
    ? {
        ...row,
        requested_by: previous.requestedBy ?? row.requested_by ?? null,
        requested_at: previous.requestedAt ?? row.requested_at ?? null,
      }
    : row;
  if (
    previous &&
    data.users.find((u) => u.id === booking.requestedBy)?.role === "student" &&
    booking.approvalStatus === "pending" &&
    previous.approvalStatus !== "pending" &&
    !booking.reviewedBy
  ) {
    safeRow["approval_status"] = previous.approvalStatus;
    safeRow["reviewed_by"] = previous.reviewedBy ?? null;
    safeRow["reviewed_at"] = previous.reviewedAt ?? null;
    safeRow["decision_notes"] = previous.decisionNotes ?? null;
  }
  const { requested_at: _requestedAt, requested_by: _requestedBy, ...updateRow } = safeRow;
  if (previous && safeRow["approval_status"] === previous.approvalStatus) {
    delete updateRow["reviewed_at"];
    delete updateRow["reviewed_by"];
    delete updateRow["decision_notes"];
  }
  const query = exists
    ? db
        .from("bookings")
        .update({ ...updateRow, archived_at: null })
        .eq("tenant_id", tenantId)
        .eq("id", booking.id)
    : db.from("bookings").insert({ ...row, archived_at: null });
  const { data: saved, error } = await query.select("*").single();
  if (error) {
    if (error.code === "23505" || error.message?.includes("duplicate")) {
      const { data: fallback, error: fbErr } = await db
        .from("bookings")
        .update({ ...updateRow, archived_at: null })
        .eq("tenant_id", tenantId)
        .eq("id", booking.id)
        .select("*")
        .single();
      if (!fbErr && fallback) return fromTables({ bookings: [fallback] }).bookings[0];
    }
    throw new Error(friendly(error));
  }
  return fromTables({ bookings: [saved] }).bookings[0];
}

function friendly(e: { message: string; details?: string | null; code?: string }) {
  if (e.code === "23P01")
    return "That time slot is already taken for this aircraft, instructor, student or room.";
  if (e.code === "42501") return "You don't have permission to make that change.";
  if (e.code === "23505")
    return "That record already exists (duplicate email, registration or open duty period).";
  if (e.code === "23514") return "Some values are outside the allowed range.";
  return e.details || e.message;
}
