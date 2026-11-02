import type { CbtaCompetencyCode, SmsLikelihood, SmsSeverity } from "./types";

export const DEBRIEF_SESSION_STORAGE_KEY = "persist:userCustomLecture";
export const DEBRIEF_STORAGE_KEY = DEBRIEF_SESSION_STORAGE_KEY;

export interface DebriefDraftState {
  bookingId?: string;
  studentId: string;
  instructorId: string;
  aircraftId: string;
  lessonId: string;
  date: string;
  fromIcao: string;
  toIcao: string;
  offBlock: string;
  takeoffTime: string;
  landingTime: string;
  onBlock: string;
  tachStart: number;
  tachEnd: number;
  hobbsStart: number;
  hobbsEnd: number;
  fuelStartLiters: number;
  fuelAddedLiters: number;
  fuelStopLiters: number;
  oilAddedQuarts: number;
  dayFullStop: number;
  dayTouchAndGo: number;
  nightFullStop: number;
  nightTouchAndGo: number;
  approachesIls: number;
  approachesRnp: number;
  approachesVisual: number;
  ifrMinutes: number;
  nightMinutes: number;
  exerciseGrades: Record<string, 1 | 2 | 3 | 4 | 5>;
  competencyScores: Record<CbtaCompetencyCode, 1 | 2 | 3 | 4 | 5>;
  observedIndicators: string[];
  remarks: string;
  reportSquawk: boolean;
  squawkSeverity: "info" | "warning" | "grounding_defect";
  squawkDescription: string;
  flagSmsIncident: boolean;
  smsTitle: string;
  smsCategory:
    | "airspace_infringement"
    | "runway_incursion"
    | "hard_landing"
    | "technical_failure"
    | "bird_strike"
    | "weather_deviation"
    | "human_factors"
    | "other";
  smsSeverity: SmsSeverity;
  smsLikelihood: SmsLikelihood;
  instructorPinSigned: boolean;
  studentPinSigned: boolean;
  updatedAt: string;
}

export function saveDebriefDraft(draft: DebriefDraftState): boolean {
  if (typeof window === "undefined") return false;
  try {
    const payload = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };
    window.sessionStorage.setItem(DEBRIEF_SESSION_STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function loadDebriefDraft(): DebriefDraftState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(DEBRIEF_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DebriefDraftState>;
    if (!parsed || typeof parsed !== "object" || !parsed.studentId || !parsed.aircraftId) {
      return null;
    }
    return parsed as DebriefDraftState;
  } catch {
    return null;
  }
}

export function clearDebriefDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(DEBRIEF_SESSION_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}
