import { CHECKRIDE, PARTS, SYSTEMS, TOURS, type SystemId } from "./c172-data";

export const FLIGHTBOOK_STORAGE_KEY = "silverarrows_c172s_flightbook_v1";

function safeStorageGetItem(key: string): string | null {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSetItem(key: string, value: string): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage quota or security errors in restricted contexts
  }
}

function safeStorageRemoveItem(key: string): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage errors
  }
}

export interface FlightbookState {
  version: 1;
  inspectedParts: string[];
  completedTours: string[];
  checkrideBestScore: number | null;
  checkrideAttempts: number;
  lastUpdatedAt: string;
}

export function emptyFlightbook(): FlightbookState {
  return {
    version: 1,
    inspectedParts: [],
    completedTours: [],
    checkrideBestScore: null,
    checkrideAttempts: 0,
    lastUpdatedAt: new Date().toISOString(),
  };
}

export function normalizeFlightbook(raw: unknown): FlightbookState {
  if (!raw || typeof raw !== "object") return emptyFlightbook();
  const obj = raw as Record<string, unknown>;
  const validPartIds = new Set(PARTS.map((p) => p.id));
  const validTourIds = new Set(TOURS.map((t) => t.id));

  const inspectedParts = Array.isArray(obj.inspectedParts)
    ? Array.from(
        new Set(
          obj.inspectedParts.filter(
            (id): id is string => typeof id === "string" && validPartIds.has(id),
          ),
        ),
      )
    : [];

  const completedTours = Array.isArray(obj.completedTours)
    ? Array.from(
        new Set(
          obj.completedTours.filter(
            (id): id is string => typeof id === "string" && validTourIds.has(id),
          ),
        ),
      )
    : [];

  const rawBest =
    typeof obj.checkrideBestScore === "number"
      ? obj.checkrideBestScore
      : obj.checkrideBest &&
          typeof (obj.checkrideBest as { score?: unknown }).score === "number"
        ? ((obj.checkrideBest as { score: number }).score)
        : null;

  const checkrideBestScore =
    typeof rawBest === "number" &&
    Number.isFinite(rawBest) &&
    rawBest >= 0 &&
    rawBest <= CHECKRIDE.length
      ? Math.round(rawBest)
      : null;

  const checkrideAttempts =
    typeof obj.checkrideAttempts === "number" &&
    Number.isFinite(obj.checkrideAttempts) &&
    obj.checkrideAttempts >= 0
      ? Math.round(obj.checkrideAttempts)
      : 0;

  const lastUpdatedAt =
    typeof obj.lastUpdatedAt === "string" ? obj.lastUpdatedAt : new Date().toISOString();

  return {
    version: 1,
    inspectedParts,
    completedTours,
    checkrideBestScore,
    checkrideAttempts,
    lastUpdatedAt,
  };
}

export function loadFlightbook(): FlightbookState {
  const raw = safeStorageGetItem(FLIGHTBOOK_STORAGE_KEY);
  if (!raw) return emptyFlightbook();
  try {
    return normalizeFlightbook(JSON.parse(raw));
  } catch {
    return emptyFlightbook();
  }
}

export function saveFlightbook(state: Partial<FlightbookState>): FlightbookState {
  const next = normalizeFlightbook({
    ...state,
    lastUpdatedAt: new Date().toISOString(),
  });
  safeStorageSetItem(FLIGHTBOOK_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function resetFlightbook(): FlightbookState {
  safeStorageRemoveItem(FLIGHTBOOK_STORAGE_KEY);
  return emptyFlightbook();
}

export function markPartInspected(state: FlightbookState, partId: string): FlightbookState {
  if (state.inspectedParts.includes(partId)) return state;
  return saveFlightbook({
    ...state,
    inspectedParts: [...state.inspectedParts, partId],
  });
}

export function markTourCompleted(state: FlightbookState, tourId: string): FlightbookState {
  if (state.completedTours.includes(tourId)) return state;
  return saveFlightbook({
    ...state,
    completedTours: [...state.completedTours, tourId],
  });
}

export function recordCheckrideScore(
  state: FlightbookState,
  score: number,
  _total: number = CHECKRIDE.length,
): FlightbookState {
  const clamped = Math.max(0, Math.min(CHECKRIDE.length, Math.round(score)));
  const best =
    state.checkrideBestScore === null ? clamped : Math.max(state.checkrideBestScore, clamped);
  return saveFlightbook({
    ...state,
    checkrideBestScore: best,
    checkrideAttempts: state.checkrideAttempts + 1,
  });
}

export interface SystemConfidenceSummary {
  id: SystemId;
  label: string;
  glyph: string;
  color: string;
  inspectedCount: number;
  totalCount: number;
  percentage: number;
  confidenceLabel: "Untested" | "Familiarizing" | "Proficient" | "Mastered";
}

export interface FlightbookSummary {
  systemsExploredCount: number;
  totalSystemsCount: number;
  partsInspectedCount: number;
  totalPartsCount: number;
  toursCompletedCount: number;
  totalToursCount: number;
  checkrideBestScore: number | null;
  checkrideTotalQuestions: number;
  systemBreakdown: SystemConfidenceSummary[];
  // Convenient aliases used by the UI console & tests
  systemsExplored: number;
  systemsTotal: number;
  partsInspected: number;
  partsTotal: number;
  toursCompleted: number;
  toursTotal: number;
  checkrideBest: { score: number; total: number } | null;
  perSystem: Record<SystemId, { inspected: number; total: number }>;
}

export function summarizeFlightbook(state: FlightbookState): FlightbookSummary {
  const inspectedSet = new Set(state.inspectedParts);
  const perSystem = {} as Record<SystemId, { inspected: number; total: number }>;

  const systemBreakdown: SystemConfidenceSummary[] = SYSTEMS.map((sys) => {
    const sysParts = PARTS.filter((p) => p.system === sys.id);
    const inspectedCount = sysParts.filter((p) => inspectedSet.has(p.id)).length;
    const totalCount = sysParts.length;
    const percentage = totalCount > 0 ? Math.round((inspectedCount / totalCount) * 100) : 0;

    perSystem[sys.id] = { inspected: inspectedCount, total: totalCount };

    let confidenceLabel: SystemConfidenceSummary["confidenceLabel"] = "Untested";
    if (percentage >= 90) confidenceLabel = "Mastered";
    else if (percentage >= 50) confidenceLabel = "Proficient";
    else if (inspectedCount > 0) confidenceLabel = "Familiarizing";

    return {
      id: sys.id,
      label: sys.label,
      glyph: sys.glyph,
      color: sys.color,
      inspectedCount,
      totalCount,
      percentage,
      confidenceLabel,
    };
  });

  const systemsExploredCount = systemBreakdown.filter((s) => s.inspectedCount > 0).length;

  return {
    systemsExploredCount,
    totalSystemsCount: SYSTEMS.length,
    partsInspectedCount: state.inspectedParts.length,
    totalPartsCount: PARTS.length,
    toursCompletedCount: state.completedTours.length,
    totalToursCount: TOURS.length,
    checkrideBestScore: state.checkrideBestScore,
    checkrideTotalQuestions: CHECKRIDE.length,
    systemBreakdown,
    systemsExplored: systemsExploredCount,
    systemsTotal: SYSTEMS.length,
    partsInspected: state.inspectedParts.length,
    partsTotal: PARTS.length,
    toursCompleted: state.completedTours.length,
    toursTotal: TOURS.length,
    checkrideBest:
      state.checkrideBestScore !== null
        ? { score: state.checkrideBestScore, total: CHECKRIDE.length }
        : null,
    perSystem,
  };
}
