import { createClient } from "@supabase/supabase-js";
import { DEMO_SESSION_KEY, readDemoData, writeDemoData } from "@/lib/demo-storage";
import { uid } from "@/lib/logic";
import type { Role, User } from "@/lib/types";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://lisycwpfvlhubvneifmb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_hxSYN9fl41h1zwHG1va0Gw_ZitbASFY";

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
  const lower = email.toLowerCase();
  if (
    lower === "sakshi@flysilverarrows.com" ||
    lower === "admin@flysilverarrows.com" ||
    lower === "admin@silverarrows.aero" ||
    lower === "sakshi@silverarrows.aero"
  )
    return "admin";
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

function findOrCreateLocalUser(email: string, preferredRole?: Role, fullName?: string): User {
  const { data } = readDemoData();
  const clean = email.trim().toLowerCase();
  const existing = data.users.find(
    (u) => u.email.toLowerCase() === clean && u.status !== "deleted",
  );
  if (existing) return existing;

  const role = preferredRole ?? inferRoleFromEmail(clean);
  const localPart = clean.split("@")[0] || "pilot";
  const displayName =
    fullName?.trim() || localPart.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const newUser: User = {
    id: `u-${uid()}`,
    name: displayName,
    email: clean,
    role,
    status: "active",
    callsign: displayName.slice(0, 3).toUpperCase(),
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

const hybridAuth = {
  async signInWithPassword({ email, password }: { email: string; password?: string }) {
    const clean = email.trim().toLowerCase();
    if (!clean) {
      return {
        data: { user: null, session: null },
        error: { message: "Please enter a valid email address." },
      };
    }

    const testPassword = password || "Vipul@1011";
    // In controlled testing environment, reject passwords that don't match the testing password
    if (password && password !== "Vipul@1011" && password !== "demo12345") {
      return {
        data: { user: null, session: null },
        error: { message: "Invalid password. Access is restricted to authorized credentials." },
      };
    }

    // Clear any stale demo session first
    setStoredDemoSession(null);

    try {
      const res = await realSupabase.auth.signInWithPassword({
        email: clean,
        password: testPassword,
      });
      if (!res.error && res.data.user) {
        return res;
      }
    } catch {
      /* fallback to local demo session if network/auth unavailable */
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

    try {
      const res = await realSupabase.auth.signUp({
        email: clean,
        password: password || "demo12345",
        options,
      });
      if (!res.error && res.data.session) {
        return res;
      }
    } catch {
      /* fallback to local signup */
    }

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

  async signOut() {
    setStoredDemoSession(null);
    notifyDemoListeners("SIGNED_OUT", null);
    try {
      return await realSupabase.auth.signOut();
    } catch {
      return { error: null };
    }
  },

  async getUser() {
    const demo = getStoredDemoSession();
    if (demo) {
      return { data: { user: demo.user }, error: null };
    }
    try {
      const res = await realSupabase.auth.getUser();
      if (res.data?.user) return res;
    } catch {
      /* ignore */
    }
    return { data: { user: null }, error: null };
  },

  async getSession() {
    const demo = getStoredDemoSession();
    if (demo) {
      return { data: { session: demo }, error: null };
    }
    try {
      return await realSupabase.auth.getSession();
    } catch {
      return { data: { session: null }, error: null };
    }
  },

  onAuthStateChange(callback: AuthListener) {
    demoListeners.add(callback);
    const realSub = realSupabase.auth.onAuthStateChange((event, session) => {
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
    });

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

export const supabase = new Proxy(realSupabase, {
  get(target, prop, receiver) {
    if (prop === "auth") {
      return hybridAuth;
    }
    if (prop === "rpc") {
      return async (fn: string, args: Record<string, unknown>) => {
        const demo = getStoredDemoSession();
        if (!demo) {
          try {
            const res = await target.rpc(fn, args);
            if (!res.error) return res;
          } catch {
            /* fallback to local registration */
          }
        }
        if (fn === "register_member") {
          const first = String(args.p_first ?? "").trim();
          const last = String(args.p_last ?? "").trim();
          const role = (args.p_role ?? "student") as Role;
          const fullName = `${first} ${last}`.trim() || "Pilot Member";
          const session = getStoredDemoSession();
          const email = session?.user.email ?? "pilot@flysilverarrows.com";
          const { data } = readDemoData();
          const existing = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
          const updatedUser: User = {
            ...(existing ?? {
              id: session?.user.id ?? `u-${uid()}`,
              email,
              status: "active" as const,
            }),
            name: fullName,
            role,
            callsign: `${first.slice(0, 1)}${last.slice(0, 2)}`.toUpperCase() || "PLT",
            programId: role === "student" ? "p-ppl" : undefined,
            instructorId: role === "student" ? "u-vpl" : undefined,
          };
          const nextUsers = existing
            ? data.users.map((u) => (u.id === existing.id ? updatedUser : u))
            : [...data.users, updatedUser];
          writeDemoData({ ...data, users: nextUsers });
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
        return { data: null, error: null };
      };
    }
    const value = Reflect.get(target, prop, receiver);
    return typeof value === "function" ? value.bind(target) : value;
  },
});
