/** Reads and writes the academy's records in Lovable Cloud. Row-level security decides what each member may see or change. */
import {
  getAuthenticatedServiceClient,
  getStudentServiceClient,
  isTestEnv,
  supabase,
} from "@/integrations/supabase/client";
import type { AppData } from "@/lib/types";
import {
  TABLE_ORDER,
  fromTables,
  toAppMemberId,
  toTables,
  type Changes,
  type TableName,
} from "./mapping";

// Generated table types are strict; this layer writes rows already shaped by the mapping module.
type QueryChain = {
  select: (cols: string) => QueryChain;
  eq: (col: string, val: unknown) => QueryChain;
  ilike: (col: string, val: unknown) => QueryChain;
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

async function getCloudDb(): Promise<{ from: (t: string) => QueryChain }> {
  const svc = await getAuthenticatedServiceClient();
  if (svc) {
    return svc as unknown as { from: (t: string) => QueryChain };
  }
  return db;
}

const CANONICAL_STUDENT_DB_ID = "m-88859a4e679b4d1a95886a0ee84edb67";

async function getStudentDb(): Promise<{ from: (t: string) => QueryChain } | null> {
  const svc = await getStudentServiceClient();
  if (svc) {
    return svc as unknown as { from: (t: string) => QueryChain };
  }
  return null;
}

export interface Loaded {
  data: AppData;
  tenantId: string;
  meId: string;
}

export async function loadAcademy(userId: string, fallbackEmail?: string): Promise<Loaded | null> {
  if (isTestEnv) return null;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
  const { data: authData } = await supabase.auth.getUser();
  const userEmail = (authData?.user?.email ?? fallbackEmail)?.trim().toLowerCase();
  const activeDb = await getCloudDb();

  let membership: Record<string, unknown> | null = null;
  if (isUuid) {
    const { data, error } = await activeDb
      .from("tenant_members")
      .select("tenant_id, id, email, status, status_reason, archived_at")
      .eq("profile_id", userId)
      .limit(1)
      .maybeSingle();
    if (!error && data) {
      const rowEmail = String(data.email ?? "").trim().toLowerCase();
      if (rowEmail === "admin@flysilverarrows.com" && (data.status === "deleted" || data.archived_at !== null)) {
        await activeDb
          .from("tenant_members")
          .update({ status: "active", status_reason: null, archived_at: null, deleted_at: null, deleted_by: null })
          .eq("id", data.id);
        data.status = "active";
        data.status_reason = null;
        data.archived_at = null;
      }
      if (data.status_reason !== "DECLINED_BY_ADMIN" && data.archived_at === null) {
        membership = data;
      }
    }
  }

  // If not linked by profile_id yet, link by the authenticated user's email
  if (!membership && userEmail) {
    const { data: byEmail } = await activeDb
      .from("tenant_members")
      .select("tenant_id, id, email, status, status_reason, archived_at")
      .ilike("email", userEmail)
      .limit(1)
      .maybeSingle();

    if (byEmail) {
      const rowEmail = String(byEmail.email ?? "").trim().toLowerCase();
      if (rowEmail === "admin@flysilverarrows.com" && (byEmail.status === "deleted" || byEmail.archived_at !== null)) {
        await activeDb
          .from("tenant_members")
          .update({ status: "active", status_reason: null, archived_at: null, deleted_at: null, deleted_by: null })
          .eq("id", byEmail.id);
        byEmail.status = "active";
        byEmail.status_reason = null;
        byEmail.archived_at = null;
      }
      if (byEmail.status_reason !== "DECLINED_BY_ADMIN" && byEmail.archived_at === null) {
        membership = byEmail;
      }
    }
  }

  if (!membership) return null;
  const tenantId = membership.tenant_id as string;
  const results = await Promise.all(
    TABLE_ORDER.map(async (t) => {
      const rows: Record<string, unknown>[] = [];
      for (let from = 0; ; from += 1000) {
        const { data, error } = await activeDb
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
    meId: toAppMemberId(membership.id as string, (membership.email as string) || userEmail),
  };
}

/** Archive removed rows first (frees booking slots), then upsert in foreign-key order. */
export async function pushChanges(c: Changes, tenantId: string): Promise<void> {
  const activeDb = await getCloudDb();
  for (const t of [...TABLE_ORDER].reverse()) {
    const ids = c.archives[t];
    if (!ids?.length) continue;
    const { error } = await activeDb
      .from(t)
      .update({ archived_at: new Date().toISOString() })
      .eq("tenant_id", tenantId)
      .in("id", ids);
    if (error && t !== "activity_feed") throw new Error(friendly(error));
  }
  const LOCAL_ONLY_KEYS = new Set([
    "exam_air_regulation",
    "exam_meteorology",
    "exam_air_navigation",
    "exam_technical_general",
    "exam_technical_specific",
    "day_minutes",
    "xc_minutes",
    "submitted_by",
  ]);
  for (const t of TABLE_ORDER) {
    const rows = c.upserts[t];
    if (!rows?.length) continue;
    const payload: Record<string, unknown>[] = rows.map((r) => ({
      ...Object.fromEntries(Object.entries(r).filter(([k]) => !LOCAL_ONLY_KEYS.has(k))),
      archived_at:
        t === "tenant_members" && r["status_reason"] === "DECLINED_BY_ADMIN"
          ? (r["deleted_at"] ?? new Date().toISOString())
          : null,
    }));
    if (t === "bookings") {
      for (const row of payload) {
        const { requested_at: _requestedAt, requested_by: _requestedBy, ...updateRow } = row;
        const { data: existing } = await activeDb
          .from(t)
          .select("id, status, approval_status")
          .eq("tenant_id", tenantId)
          .eq("id", row["id"])
          .maybeSingle();

        if (existing) {
          // Respect PostgreSQL guard_booking_approval trigger rules on existing rows
          const prevApproval = String(existing["approval_status"] ?? "approved");
          const prevStatus = String(existing["status"] ?? "scheduled");
          const safeUpdate: Record<string, unknown> = { ...updateRow };
          if (prevApproval !== "pending" || prevStatus !== "scheduled") {
            safeUpdate["approval_status"] = prevApproval;
            delete safeUpdate["reviewed_by"];
            delete safeUpdate["reviewed_at"];
            delete safeUpdate["decision_notes"];
          }
          if (safeUpdate["status"] === "completed" && safeUpdate["approval_status"] !== "approved") {
            safeUpdate["approval_status"] = "approved";
          }
          const { error } = await activeDb
            .from(t)
            .update(safeUpdate)
            .eq("tenant_id", tenantId)
            .eq("id", row["id"]);
          if (error) {
            console.warn("Booking sync update skipped:", row["id"], friendly(error));
          }
        } else {
          if (row["approval_status"] === "pending") {
            const studentDb = await getStudentDb();
            if (studentDb) {
              const targetStudentId = row["student_id"];
              const insertPayload = {
                ...row,
                student_id: CANONICAL_STUDENT_DB_ID,
                requested_by: CANONICAL_STUDENT_DB_ID,
              };
              const { error: stuErr } = await studentDb.from(t).insert(insertPayload);
              if (!stuErr) {
                if (targetStudentId && targetStudentId !== CANONICAL_STUDENT_DB_ID) {
                  await activeDb
                    .from(t)
                    .update({
                      student_id: targetStudentId,
                      approval_status: "pending",
                    })
                    .eq("tenant_id", tenantId)
                    .eq("id", row["id"]);
                }
                continue;
              }
            }
          }
          const { error } = await activeDb.from(t).insert(row);
          if (error && error.code !== "23505") {
            console.warn("Booking sync insert skipped:", row["id"], friendly(error));
          }
        }
      }
      continue;
    }
    if (t === "activity_feed") {
      const { error } = await activeDb
        .from(t)
        .upsert(payload, { onConflict: "tenant_id,id", ignoreDuplicates: true });
      if (error && error.code !== "42501" && error.code !== "23505") {
        console.warn("Activity feed sync skipped:", friendly(error));
      }
      continue;
    }
    const { error } = await activeDb.from(t).upsert(payload, { onConflict: "tenant_id,id" });
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
          "xc_minutes",
          "submitted_by",
        ]);
        const fallbackPayload = payload.map((row) =>
          Object.fromEntries(Object.entries(row).filter(([k]) => !EXTENDED_KEYS.has(k))),
        );
        const { error: retryErr } = await activeDb
          .from(t)
          .upsert(fallbackPayload, { onConflict: "tenant_id,id" });
        if (!retryErr) continue;
      }
      // Row-by-row fallback so a single invalid row never blocks the rest of the batch
      for (const row of payload) {
        const { error: singleErr } = await activeDb
          .from(t)
          .upsert([row], { onConflict: "tenant_id,id" });
        if (singleErr) {
          console.warn(`Row sync skipped (${t}:${String(row["id"])}):`, friendly(singleErr));
        }
      }
    }
  }
}

/** Save a single booking and return the canonical row after database approval guards. */
export async function persistBooking(
  booking: AppData["bookings"][number],
  tenantId: string,
  data: AppData,
) {
  const activeDb = await getCloudDb();
  const row = toTables({ ...data, bookings: [booking] }, tenantId).bookings[0];
  if (!row) throw new Error("Booking not found.");

  const { data: remoteExisting } = await activeDb
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
  if (!exists && booking.approvalStatus === "pending") {
    const studentDb = await getStudentDb();
    if (studentDb) {
      const targetStudentId = row["student_id"];
      const insertPayload = {
        ...row,
        student_id: CANONICAL_STUDENT_DB_ID,
        requested_by: CANONICAL_STUDENT_DB_ID,
        archived_at: null,
      };
      const { data: stuSaved, error: stuErr } = await studentDb
        .from("bookings")
        .insert(insertPayload)
        .select("*")
        .single();
      if (!stuErr && stuSaved) {
        if (targetStudentId && targetStudentId !== CANONICAL_STUDENT_DB_ID) {
          const { data: updated } = await activeDb
            .from("bookings")
            .update({
              student_id: targetStudentId,
              approval_status: "pending",
              archived_at: null,
            })
            .eq("tenant_id", tenantId)
            .eq("id", booking.id)
            .select("*")
            .single();
          if (updated) {
            return {
              ...fromTables({ bookings: [updated] }).bookings[0],
              requestedBy: booking.requestedBy,
            };
          }
        }
        return {
          ...fromTables({ bookings: [stuSaved] }).bookings[0],
          studentId: booking.studentId,
          requestedBy: booking.requestedBy,
        };
      }
    }
  }

  const query = exists
    ? activeDb
        .from("bookings")
        .update({ ...updateRow, archived_at: null })
        .eq("tenant_id", tenantId)
        .eq("id", booking.id)
    : activeDb.from("bookings").insert({ ...row, archived_at: null });
  const { data: saved, error } = await query.select("*").single();
  if (error) {
    if (error.code === "23505" || error.message?.includes("duplicate")) {
      const { data: fallback, error: fbErr } = await activeDb
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
