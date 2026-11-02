import type { User } from "@/lib/types";

/**
 * Dedicated E-Learning Developer Collaborator Constants (Parth Bhatt)
 */
export const PARTH_USER_ID = "u-parth";
export const PARTH_EMAIL = "parth@flysilverarrows.com";
export const PARTH_ALT_EMAIL = "parth.bhatt@flysilverarrows.com";
export const PARTH_NAME = "Parth Bhatt";
export const PARTH_BRANCH = "parthbhatt";

/**
 * Branch-level E-Learning Lock Flag:
 * - On `main` (Vipul's branch): `false` -> Vipul has full access to BOTH FlightLogger and E-Learning.
 * - On `parthbhatt` (Parth's branch): set to `true` (or controlled via VITE_ELEARNING_ONLY_MODE)
 *   so when Parth runs the app on his branch, the entire UI is locked exclusively to E-Learning.
 */
export const ELEARNING_BRANCH_LOCK: boolean =
  typeof import.meta !== "undefined" &&
  import.meta.env?.VITE_ELEARNING_ONLY_MODE === "true";

/**
 * Returns true if the given user is Parth Bhatt (the E-Learning-only developer account).
 */
export function isParthUser(
  user?: Pick<User, "id" | "email" | "name"> | null,
): boolean {
  if (!user) return false;
  if (user.id === PARTH_USER_ID) return true;
  const email = (user.email ?? "").trim().toLowerCase();
  if (
    email === PARTH_EMAIL ||
    email === PARTH_ALT_EMAIL ||
    email === "parth@silverarrows.aero" ||
    email.startsWith("parth@") ||
    email.startsWith("parth.")
  ) {
    return true;
  }
  return false;
}

/**
 * Returns true when the current session MUST be restricted exclusively to E-Learning
 * (zero access to FlightLogger routes, portals, schedules, logbooks, or operations).
 *
 * Triggered when:
 * 1. The user is signed in as Parth Bhatt (`parth@flysilverarrows.com`), OR
 * 2. The app is running in E-Learning Branch Lock mode (`parthbhatt` branch / `ELEARNING_BRANCH_LOCK`).
 */
export function isElearningLockedSession(
  user?: Pick<User, "id" | "email" | "name"> | null,
): boolean {
  if (ELEARNING_BRANCH_LOCK) return true;
  return isParthUser(user);
}

/**
 * Checks whether a URL pathname is an allowed E-Learning route for a locked E-Learning session.
 */
export function isAllowedElearningPath(pathname: string): boolean {
  const clean = pathname.split("?")[0]?.split("#")[0] || "/";
  return (
    clean === "/elearning" ||
    clean.startsWith("/elearning/") ||
    clean === "/learning" ||
    clean.startsWith("/learning/")
  );
}
