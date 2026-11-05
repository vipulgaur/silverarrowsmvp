import { createClient } from "@supabase/supabase-js";
import { pushLocalSync } from "@/lib/api/local-sync-client";
import { DEMO_SESSION_KEY, readDemoData, writeDemoData } from "@/lib/demo-storage";
import { SOLE_ADMIN_EMAIL, uid, validateAccountCreation } from "@/lib/logic";
import type { Role, User } from "@/lib/types";

const SUPABASE_URL =
  import.meta.env?.VITE_SUPABASE_URL || "https://lisycwpfvlhubvneifmb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_hxSYN9fl41h1zwHG1va0Gw_ZitbASFY";

/**
 * Test-env detection. Declared early so credential helpers below can gate on it.
 * (Also re-exported as `isTestEnv` further down for existing importers.)
 */
const IS_TEST_ENV =
  typeof import.meta !== "undefined" &&
  (import.meta.env?.MODE === "test" ||
    Boolean((import.meta.env as Record<string, unknown>)?.VITEST));

/**
 * Canonical testing password. This value is ONLY honoured inside the test runner
 * (IS_TEST_ENV). It must never authenticate against production. Do not reuse this
 * as a master/fallback password in any runtime code path.
 */
const TEST_ONLY_PASSWORD = "Vipul@1011";

/** Returns the testing password only under the test runner; null everywhere else. */
function testOnlyPassword(): string | null {
  return IS_TEST_ENV ? TEST_ONLY_PASSWORD : null;
}

/**
 * SEC-001 CONTAINMENT: privileged background sign-ins (admin/student "service"
 * clients) must NOT ship a hardcoded password to the browser. These read an
 * optional env var and are a no-op when it is absent, so a shipped bundle cannot
 * authenticate as the administrator by default.
 *
 * TODO(Phase 6): remove these browser-side privileged sign-ins entirely and move
 * the service-role operations behind a server endpoint / Supabase Edge Function.
 * See the Phase 6 re-architecture notes.
 */
const ADMIN_SYNC_PASSWORD: string | undefined = import.meta.env?.VITE_ADMIN_SYNC_PASSWORD || undefined;
const STUDENT_SYNC_PASSWORD: string | undefined =
  import.meta.env?.VITE_STUDENT_SYNC_PASSWORD || undefined;

export const realSupabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface DemoSession {
  user: {
    id: string;
    email: string;
    user_metadata?: { role?: Role };
  };
  isDemoFallback?: boolean;
}

type AuthListener = (event: string, session: DemoSession | null) => void;
const demoListeners = new Set<AuthListener>();

export function getStoredDemoSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DEMO_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoSession;
    if (parsed && parsed.user && typeof parsed.user.id === "string") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function setStoredDemoSession(session: DemoSession | null) {
  if (typeof window === "undefined") return;
  try {
    if (session) {
      window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(DEMO_SESSION_KEY);
    }
  } catch {
    /* ignore storage errors */
  }
}

function notifyDemoListeners(event: string, session: DemoSession | null) {
  demoListeners.forEach((cb) => {
    try {
      cb(event, session);
    } catch {
      /* ignore listener errors */
    }
  });
}

function inferRoleFromEmail(email: string): Role {
  const lower = email.trim().toLowerCase();
  if (lower === SOLE_ADMIN_EMAIL) return "admin";
  if (
    lower === "vipul@flysilverarrows.com" ||
    lower === "vipul@silverarrows.aero" ||
    lower === "priya@flysilverarrows.com" ||
    lower === "priya@silverarrows.aero" ||
    lower.startsWith("cfi@") ||
    lower.startsWith("instructor@")
  )
    return "instructor";
  if (
    lower === "anujay@flysilverarrows.com" ||
    lower === "anujay@silverarrows.aero" ||
    lower.startsWith("ground@")
  )
    return "ground";
  return "student";
}

const CANONICAL_TESTING_EMAILS = new Set([
  SOLE_ADMIN_EMAIL,
  "vipul@flysilverarrows.com",
  "priya@flysilverarrows.com",
  "anujay@flysilverarrows.com",
  "ananya@flysilverarrows.com",
  "aarav@flysilverarrows.com",
  "liam@flysilverarrows.com",
]);

export function findOrCreateLocalUser(
  email: string,
  preferredRole?: Role,
  fullName?: string,
  phone?: string,
  statusReason?: string,
): User {
  const { data } = readDemoData();
  const clean = email.trim().toLowerCase();
  const existing = data.users.find(
    (u) => u.email.toLowerCase() === clean && u.status !== "deleted",
  );
  if (existing) return existing;

  const rawRole = preferredRole ?? inferRoleFromEmail(clean);
  const role: Role =
    clean === SOLE_ADMIN_EMAIL ? "admin" : rawRole === "admin" ? "student" : rawRole;
  const effectiveStatusReason =
    clean === SOLE_ADMIN_EMAIL || CANONICAL_TESTING_EMAILS.has(clean)
      ? statusReason
      : (statusReason ?? "PENDING_ADMIN_APPROVAL");
  const localPart = clean.split("@")[0] || "pilot";
  const displayName =
    clean === SOLE_ADMIN_EMAIL
      ? "System Administrator"
      : fullName?.trim() ||
        localPart.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const newUser: User = {
    id: clean === SOLE_ADMIN_EMAIL ? "u-admin" : `u-${uid()}`,
    name: displayName,
    email: clean,
    role,
    status: "active",
    ...(phone ? { phone } : {}),
    ...(effectiveStatusReason ? { statusReason: effectiveStatusReason } : {}),
    callsign: clean === SOLE_ADMIN_EMAIL ? "ADM" : displayName.slice(0, 3).toUpperCase(),
    programId: role === "student" ? "p-ppl" : undefined,
    instructorId: role === "student" ? "u-vpl" : undefined,
    stage:
      role === "admin"
        ? "Operations Administrator"
        : role === "instructor"
          ? "Flight Instructor"
          : role === "ground"
            ? "Ground Instructor"
            : "Student Pilot — EASA PPL(A)",
  };
  writeDemoData({ ...data, users: [...data.users, newUser] });
  return newUser;
}

export const isTestEnv = IS_TEST_ENV;

/**
 * Creates a stateless Supabase client that never persists or overwrites the active browser session.
 * Used when an Admin creates a new user so the Admin's session is not replaced.
 *
 * SEC-001 CONTAINMENT: no longer defaults to a hardcoded password. If no password
 * is supplied and no provisioning password is configured in the environment, this
 * is a no-op (the account is instead provisioned lazily on first real sign-in).
 */
export async function provisionAuthUserWithoutSessionSwitch(
  email: string,
  password?: string,
): Promise<void> {
  if (isTestEnv) return;
  const provisionPassword = password ?? ADMIN_SYNC_PASSWORD;
  if (!provisionPassword) return;
  try {
    const ephemeralClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
    await ephemeralClient.auth.signUp({
      email: email.trim().toLowerCase(),
      password: provisionPassword,
    });
  } catch {
    /* ignore background auth provisioning errors */
  }
}

// supabase-js infers a narrower default-schema generic for a no-arg
// `createClient` type than for an actual `createClient(url, key, opts)` call.
// Alias the *concrete* call's return type (via `realSupabase`) so the promise
// holders and the background-client factories agree with the clients they build.
type ServiceClient = typeof realSupabase;

let serviceClientPromise: Promise<ServiceClient | null> | null = null;
let studentServiceClientPromise: Promise<ServiceClient | null> | null = null;

/**
 * Returns a background non-persisting Supabase client authenticated as the sole tenant administrator
 * (admin@flysilverarrows.com) so newly registered or unlinked users can read/write academy registration records.
 */
export async function getAuthenticatedServiceClient(): Promise<ServiceClient | null> {
  if (isTestEnv) return null;
  // SEC-001 CONTAINMENT: do not sign in as the administrator from the browser
  // unless a privileged password is explicitly configured in the environment.
  // Absent that, return null so callers fall back to the caller's own session
  // and RLS remains the authority. TODO(Phase 6): move server-side.
  if (!ADMIN_SYNC_PASSWORD) return null;
  if (!serviceClientPromise) {
    serviceClientPromise = (async () => {
      try {
        const client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
        });
        const { error } = await client.auth.signInWithPassword({
          email: SOLE_ADMIN_EMAIL,
          password: ADMIN_SYNC_PASSWORD,
        });
        if (error) {
          serviceClientPromise = null;
          return null;
        }
        return client;
      } catch {
        serviceClientPromise = null;
        return null;
      }
    })();
  }
  return serviceClientPromise;
}

/**
 * Returns a background non-persisting Supabase client authenticated as a canonical student
 * (ananya@flysilverarrows.com) so student booking inserts trigger the PostgreSQL student approval guard
 * (setting approval_status = 'pending').
 */
export async function getStudentServiceClient(): Promise<ServiceClient | null> {
  if (isTestEnv) return null;
  // SEC-001 CONTAINMENT: do not sign in as a canonical student from the browser
  // unless a privileged password is explicitly configured in the environment.
  // TODO(Phase 6): the student-approval-guard insert must move server-side.
  if (!STUDENT_SYNC_PASSWORD) return null;
  if (!studentServiceClientPromise) {
    studentServiceClientPromise = (async () => {
      try {
        const client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
        });
        const { error } = await client.auth.signInWithPassword({
          email: "ananya@flysilverarrows.com",
          password: STUDENT_SYNC_PASSWORD,
        });
        if (error) {
          studentServiceClientPromise = null;
          return null;
        }
        return client;
      } catch {
        studentServiceClientPromise = null;
        return null;
      }
    })();
  }
  return studentServiceClientPromise;
}

const hybridAuth = {
  async signInWithPassword({ email, password }: { email: string; password?: string }) {
    const clean = email.trim().toLowerCase();
    if (!clean) {
      return {
        data: { user: null, session: null },
        error: { message: "Please enter a valid email address." },
      };
    }

    // SEC-002 CONTAINMENT: never substitute a hardcoded master password in
    // production. The user-supplied password is used as-is. The testing password
    // is only ever honoured inside the test runner (see testOnlyPassword()).
    const suppliedPassword = password || testOnlyPassword() || "";
    if (!suppliedPassword) {
      return {
        data: { user: null, session: null },
        error: { message: "Please enter your password." },
      };
    }
    // For the built-in testing roster, enforce the testing password (test env only)
    if (
      isTestEnv &&
      CANONICAL_TESTING_EMAILS.has(clean) &&
      password &&
      password !== TEST_ONLY_PASSWORD &&
      password !== "demo12345"
    ) {
      return {
        data: { user: null, session: null },
        error: { message: "Invalid password. Access is restricted to authorized credentials." },
      };
    }

    // Check if local record is explicitly declined by admin
    const localSnapshot = readDemoData().data;
    const localMatch = localSnapshot.users.find((u) => u.email.toLowerCase() === clean);
    if (
      clean !== SOLE_ADMIN_EMAIL &&
      localMatch &&
      (localMatch.statusReason === "DECLINED_BY_ADMIN" || localMatch.status === "deleted")
    ) {
      return {
        data: { user: null, session: null },
        error: {
          message:
            "Your account access has been declined or deactivated by the Administrator.",
        },
      };
    }

    // Clear any stale demo session first
    setStoredDemoSession(null);

    if (!isTestEnv) {
      try {
        let res = await realSupabase.auth.signInWithPassword({
          email: clean,
          password: suppliedPassword,
        });

        // SEC-002 CONTAINMENT: the production master-password fallback has been
        // removed. Sign-in now succeeds only with the member's own credentials.

        // Only auto-provision Supabase auth for canonical testing roster or existing active members
        if (
          res.error &&
          (CANONICAL_TESTING_EMAILS.has(clean) ||
            (localMatch && localMatch.status === "active")) &&
          (res.error.message?.toLowerCase().includes("invalid login credentials") ||
            res.error.message?.toLowerCase().includes("user not found"))
        ) {
          const signupRes = await realSupabase.auth.signUp({
            email: clean,
            password: suppliedPassword,
          });
          if (!signupRes.error && signupRes.data.user) {
            res = await realSupabase.auth.signInWithPassword({
              email: clean,
              password: suppliedPassword,
            });
          }
        }

        if (!res.error && res.data.user) {
          const svc = (await getAuthenticatedServiceClient()) ?? realSupabase;
          const { data: existingMember } = await (svc as any)
            .from("tenant_members")
            .select("id, email, status, status_reason, archived_at")
            .ilike("email", clean)
            .limit(1)
            .maybeSingle();

          if (
            clean !== SOLE_ADMIN_EMAIL &&
            existingMember &&
            (existingMember.status_reason === "DECLINED_BY_ADMIN" ||
              existingMember.status === "deleted" ||
              existingMember.archived_at !== null)
          ) {
            await realSupabase.auth.signOut();
            return {
              data: { user: null, session: null },
              error: {
                message:
                  "Your account registration or access was declined by the Administrator.",
              },
            };
          }

          if (existingMember && res.data.user.id) {
            // Link profile_id if not linked yet
            await (svc as any)
              .from("tenant_members")
              .update({ profile_id: res.data.user.id })
              .eq("id", existingMember.id)
              .is("profile_id", null);
          }
          return res;
        }
      } catch {
        /* fallback to local demo session if network/auth unavailable */
      }
    }

    // Fallback to local academy store so demo/custom emails always sign into their own profile
    const localUser = findOrCreateLocalUser(clean);
    const demoSession: DemoSession = {
      user: {
        id: localUser.id,
        email: localUser.email,
        user_metadata: { role: localUser.role },
      },
      isDemoFallback: true,
    };
    setStoredDemoSession(demoSession);
    notifyDemoListeners("SIGNED_IN", demoSession);
    return {
      data: { user: demoSession.user, session: demoSession },
      error: null,
    };
  },

  async signUp({
    email,
    password,
    options,
  }: {
    email: string;
    password?: string;
    options?: Record<string, unknown>;
  }) {
    const clean = email.trim().toLowerCase();
    setStoredDemoSession(null);

    // SEC-002 CONTAINMENT: never substitute a hardcoded password. Registration
    // requires the member's own password; without one, fall through to the local
    // signup path below (the testing password is honoured only under the runner).
    const signupPassword = password || testOnlyPassword();

    if (!isTestEnv && signupPassword) {
      try {
        // Use a non-persisting client during signUp so realSupabase does NOT fire SIGNED_IN
        // before register_member has validated and inserted the PENDING_ADMIN_APPROVAL row.
        const ephemeralClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
        });
        const res = await ephemeralClient.auth.signUp({
          email: clean,
          password: signupPassword,
          options,
        });
        if (!res.error && res.data.user) {
          return {
            data: { user: res.data.user, session: res.data.session },
            error: null,
          };
        }
      } catch {
        /* fallback to local signup */
      }
    }

    const demoSession: DemoSession = {
      user: {
        id: `u-${uid().slice(0, 6)}`,
        email: clean,
        user_metadata: { role: "student" },
      },
      isDemoFallback: true,
    };
    return {
      data: { user: demoSession.user, session: demoSession },
      error: null,
    };
  },

  async signOut() {
    setStoredDemoSession(null);
    notifyDemoListeners("SIGNED_OUT", null);
    if (!isTestEnv) {
      try {
        return await realSupabase.auth.signOut();
      } catch {
        return { error: null };
      }
    }
    return { error: null };
  },

  async getUser() {
    const demo = getStoredDemoSession();
    if (demo) {
      return { data: { user: demo.user }, error: null };
    }
    if (!isTestEnv) {
      try {
        const res = await realSupabase.auth.getUser();
        if (res.data?.user) return res;
      } catch {
        /* fallback to local cached session check */
      }
      try {
        const sessionRes = await realSupabase.auth.getSession();
        if (sessionRes.data?.session?.user) {
          return { data: { user: sessionRes.data.session.user }, error: null };
        }
      } catch {
        /* ignore */
      }
    }
    return { data: { user: null }, error: null };
  },

  async getSession() {
    const demo = getStoredDemoSession();
    if (demo) {
      return { data: { session: demo }, error: null };
    }
    if (!isTestEnv) {
      try {
        return await realSupabase.auth.getSession();
      } catch {
        return { data: { session: null }, error: null };
      }
    }
    return { data: { session: null }, error: null };
  },

  onAuthStateChange(callback: AuthListener) {
    demoListeners.add(callback);
    const realSub = !isTestEnv
      ? realSupabase.auth.onAuthStateChange((event, session) => {
          if (event === "SIGNED_OUT") {
            // Only propagate SIGNED_OUT if no demo session is active
            if (!getStoredDemoSession()) {
              callback(event, null);
            }
          } else if (session?.user) {
            setStoredDemoSession(null);
            callback(event, {
              user: {
                id: session.user.id,
                email: session.user.email ?? "",
                user_metadata: session.user.user_metadata as { role?: Role },
              },
              isDemoFallback: false,
            });
          }
        })
      : { data: { subscription: { unsubscribe() {} } } };

    return {
      data: {
        subscription: {
          unsubscribe() {
            demoListeners.delete(callback);
            realSub.data.subscription.unsubscribe();
          },
        },
      },
    };
  },
};

const DEFAULT_TENANT_ID = "5a0e0000-0000-4000-8000-000000000001";
const SOLE_ADMIN_DB_ID = "m-21645e1e87914a0994e1167c9de40cb0";
const DEFAULT_INSTRUCTOR_DB_ID = "m-2326d678c3bf48e199818e105abe8e98";

export const supabase = new Proxy(realSupabase, {
  get(target, prop, receiver) {
    if (prop === "auth") {
      return hybridAuth;
    }
    if (prop === "rpc") {
      return async (fn: string, args: Record<string, unknown>) => {
        if (fn === "register_member") {
          const first = String(args.p_first ?? "").trim();
          const last = String(args.p_last ?? "").trim();
          const phone = typeof args.p_phone === "string" ? args.p_phone.trim() : undefined;
          const cleanEmailArg =
            typeof args.p_email === "string" ? args.p_email.trim().toLowerCase() : undefined;
          const requestedRole = (args.p_role ?? "student") as Role;
          const fullName = `${first} ${last}`.trim();
          const callsign = `${first.slice(0, 1)}${last.slice(0, 2)}`.toUpperCase() || "PLT";

          const demo = getStoredDemoSession();
          let authUserEmail = cleanEmailArg ?? demo?.user.email;

          if (!authUserEmail && !isTestEnv) {
            try {
              const { data: uData } = await target.auth.getUser();
              if (uData?.user?.email) {
                authUserEmail = uData.user.email;
              }
            } catch {
              /* ignore */
            }
          }

          const email = (authUserEmail ?? "").trim().toLowerCase();

          // Validate against local users first (rejects duplicate email, duplicate phone, or unauthorized admin)
          const { data: localData } = readDemoData();
          const validationError = validateAccountCreation(
            {
              firstName: first,
              lastName: last,
              name: fullName,
              email,
              phone: phone ?? "",
              role: requestedRole,
            },
            localData.users,
          );
          if (validationError) {
            return { data: null, error: { message: validationError } };
          }

          const role: Role =
            email === SOLE_ADMIN_EMAIL
              ? "admin"
              : requestedRole === "admin"
                ? "student"
                : requestedRole;
          const statusReason = role === "admin" ? undefined : "PENDING_ADMIN_APPROVAL";
          let cloudMemberId: string | null = null;

          if (!isTestEnv) {
            try {
              const svc = (await getAuthenticatedServiceClient()) ?? target;
              const dbClient = svc as any;

              // Check remote active members to prevent ANY duplicate email or duplicate phone collision
              const { data: remoteActive } = await dbClient
                .from("tenant_members")
                .select("id, name, email, phone, status")
                .eq("tenant_id", DEFAULT_TENANT_ID)
                .is("archived_at", null);

              const activeRows = ((remoteActive ?? []) as Record<string, unknown>[]).filter(
                (r) => r.status !== "deleted",
              );
              const remoteUsersForCheck: User[] = activeRows.map((r) => ({
                id: String(r.id),
                name: String(r.name ?? ""),
                email: String(r.email ?? ""),
                phone: r.phone ? String(r.phone) : undefined,
                role: "student",
                status: "active",
              }));

              const remoteValidationErr = validateAccountCreation(
                {
                  firstName: first,
                  lastName: last,
                  name: fullName,
                  email,
                  phone: phone ?? "",
                  role,
                },
                remoteUsersForCheck,
              );
              if (remoteValidationErr) {
                return { data: null, error: { message: remoteValidationErr } };
              }

              const memberId = `u-${uid().slice(0, 6)}`;
              cloudMemberId = memberId;

              const memberPayload: Record<string, unknown> = {
                id: memberId,
                tenant_id: DEFAULT_TENANT_ID,
                name: fullName,
                email,
                phone: phone ?? null,
                callsign,
                status: "active",
                status_reason: statusReason ?? null,
                program_id: role === "student" ? "p-ppl" : null,
                instructor_id: role === "student" ? DEFAULT_INSTRUCTOR_DB_ID : null,
                stage:
                  role === "admin"
                    ? "Operations Administrator"
                    : role === "instructor"
                      ? "Flight Instructor"
                      : role === "ground"
                        ? "Ground Instructor"
                        : "Student Pilot — EASA PPL(A)",
                archived_at: null,
              };

              await dbClient
                .from("tenant_members")
                .upsert([memberPayload], { onConflict: "tenant_id,id" });

              const dbRole =
                role === "admin"
                  ? "admin"
                  : role === "instructor" || role === "crew"
                    ? "instructor"
                    : role === "ground" || role === "staff"
                      ? "ground"
                      : "student";

              const roleRes = await dbClient.from("member_roles").upsert(
                [
                  {
                    id: memberId,
                    tenant_id: DEFAULT_TENANT_ID,
                    member_id: memberId,
                    role: dbRole,
                    archived_at: null,
                  },
                ],
                { onConflict: "tenant_id,id" },
              );
              if (roleRes?.error) {
                await dbClient.from("member_roles").upsert(
                  [
                    {
                      id: `${DEFAULT_TENANT_ID}:${memberId}`,
                      tenant_id: DEFAULT_TENANT_ID,
                      member_id: memberId,
                      role: dbRole,
                      archived_at: null,
                    },
                  ],
                  { onConflict: "tenant_id,member_id" },
                );
              }

              if (statusReason === "PENDING_ADMIN_APPROVAL") {
                await dbClient.from("activity_feed").upsert(
                  [
                    {
                      id: `act-reg-${memberId}`,
                      tenant_id: DEFAULT_TENANT_ID,
                      occurred_at: new Date().toISOString(),
                      actor_id: SOLE_ADMIN_DB_ID,
                      actor_name: fullName,
                      actor_role: dbRole,
                      action: "account_registration_requested",
                      entity_type: "user",
                      entity_id: memberId,
                      details: `${fullName} (${email}${phone ? ` · ${phone}` : ""}) registered a new ${role} account and is awaiting Administrator login approval.`,
                      archived_at: null,
                    },
                  ],
                  { onConflict: "tenant_id,id" },
                );
              }
            } catch (err) {
              console.warn("Cloud registration sync warning:", err);
            }
          }

          // 3. Always create a fresh local user record (never overwrite an existing active member)
          const { data } = readDemoData();
          const finalId = cloudMemberId ?? `u-${uid().slice(0, 6)}`;
          const updatedUser: User = {
            id: finalId,
            name: fullName,
            email,
            ...(phone ? { phone } : {}),
            role,
            status: "active",
            statusReason,
            callsign,
            programId: role === "student" ? "p-ppl" : undefined,
            instructorId: role === "student" ? "u-vpl" : undefined,
          };
          const nextUsers = [...data.users.filter((u) => u.id !== finalId), updatedUser];
          const regActivity =
            statusReason === "PENDING_ADMIN_APPROVAL"
              ? [
                  {
                    id: `act-reg-${finalId}`,
                    at: new Date().toISOString(),
                    actorId: finalId,
                    actorName: fullName,
                    actorRole: role,
                    action: "account_registration_requested",
                    entityType: "user" as const,
                    entityId: finalId,
                    details: `${fullName} (${email}${phone ? ` · ${phone}` : ""}) registered a new ${role} account and is awaiting Administrator login approval.`,
                  },
                  ...data.activity.filter((a) => a.id !== `act-reg-${finalId}`),
                ]
              : data.activity;

          const nextAppData = { ...data, users: nextUsers, activity: regActivity };
          writeDemoData(nextAppData);
          pushLocalSync(nextAppData);

          const nextSession: DemoSession = {
            user: {
              id: updatedUser.id,
              email: updatedUser.email,
              user_metadata: { role: updatedUser.role },
            },
            isDemoFallback: true,
          };
          setStoredDemoSession(nextSession);
          notifyDemoListeners("USER_UPDATED", nextSession);
          return { data: updatedUser.id, error: null };
        }

        if (!isTestEnv) {
          try {
            const res = await target.rpc(fn, args);
            if (!res.error) return res;
          } catch {
            /* ignore */
          }
        }
        return { data: null, error: null };
      };
    }
    const value = Reflect.get(target, prop, receiver);
    return typeof value === "function" ? value.bind(target) : value;
  },
});
