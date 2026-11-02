import type { CourseId, ELearningModule } from "@/lib/elearning-courses";
import initialWorkspaceJson from "./dev-workspace-data.json";
import initialCustomModulesJson from "./custom-modules.json";

export type DevTaskStatus =
  | "assigned"
  | "in_progress"
  | "ready_for_review"
  | "approved"
  | "changes_requested";

export type DevTaskPriority = "critical" | "high" | "medium" | "low";

export interface ELearningUiPreviewTarget {
  courseId: CourseId;
  chapterId: string;
  sectionHighlight: string;
  beforeSummary: string;
  afterSummary: string;
}

export interface ELearningWorkReport {
  id: string;
  taskId: string;
  submittedBy: string;
  submittedAt: string;
  branch: string;
  commitHash: string;
  statusAfter: DevTaskStatus;
  summary: string;
  changesMade: string[];
  filesChanged: string[];
  uiPreview: ELearningUiPreviewTarget;
  adminFeedback?: string;
  reviewedAt?: string;
}

export interface ELearningDevTask {
  id: string;
  title: string;
  courseId: CourseId;
  courseTitle: string;
  targetChapterId: string;
  targetChapterLabel: string;
  priority: DevTaskPriority;
  status: DevTaskStatus;
  assignedBy: string;
  assignedAt: string;
  updatedAt: string;
  allowedFiles: string[];
  whatToDo: string[];
  whatNotToDo: string[];
  reports: ELearningWorkReport[];
  adminReviewNote?: string;
}

export interface LiveGitHubCommitSummary {
  sha: string;
  shortSha: string;
  message: string;
  authorName: string;
  date: string;
  filesChanged: string[];
}

export interface ELearningWorkspaceState {
  repository: string;
  collaborator: {
    id: string;
    name: string;
    email: string;
    branch: string;
    scope: string;
    allowedPaths: string[];
  };
  lastSyncedCommit: string;
  lastSyncedAt: string;
  tasks: ELearningDevTask[];
  liveGitHubCommit?: LiveGitHubCommitSummary;
  remoteCustomModules?: ELearningModule[];
}

export const ELEARNING_DEV_WORKSPACE_STORAGE_KEY =
  "silverarrows-elearning-dev-workspace-v1";

const DEFAULT_STATE: ELearningWorkspaceState = {
  ...(initialWorkspaceJson as unknown as ELearningWorkspaceState),
  remoteCustomModules: (initialCustomModulesJson.modules ?? []) as ELearningModule[],
};

/**
 * Reads the current E-Learning Developer Workspace state, merging the Git-tracked
 * JSON baseline with any local interactive updates from Vipul or Parth.
 */
export function readELearningWorkspace(): ELearningWorkspaceState {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }
  try {
    const raw = window.localStorage.getItem(ELEARNING_DEV_WORKSPACE_STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<ELearningWorkspaceState>;
    if (!parsed || !Array.isArray(parsed.tasks)) {
      return DEFAULT_STATE;
    }

    const storedById = new Map(parsed.tasks.map((t) => [t.id, t]));
    const mergedTasks: ELearningDevTask[] = [];

    for (const baseTask of DEFAULT_STATE.tasks) {
      const localTask = storedById.get(baseTask.id);
      if (!localTask) {
        mergedTasks.push(baseTask);
      } else {
        const reportMap = new Map<string, ELearningWorkReport>();
        for (const r of baseTask.reports ?? []) reportMap.set(r.id, r);
        for (const r of localTask.reports ?? []) reportMap.set(r.id, r);
        const combinedReports = Array.from(reportMap.values()).sort((a, b) =>
          b.submittedAt.localeCompare(a.submittedAt),
        );
        mergedTasks.push({
          ...baseTask,
          ...localTask,
          reports: combinedReports,
        });
        storedById.delete(baseTask.id);
      }
    }

    const customLocalTasks = Array.from(storedById.values());
    return {
      ...DEFAULT_STATE,
      ...parsed,
      collaborator: DEFAULT_STATE.collaborator,
      tasks: [...customLocalTasks, ...mergedTasks],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function writeELearningWorkspace(
  next: ELearningWorkspaceState,
): ELearningWorkspaceState {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        ELEARNING_DEV_WORKSPACE_STORAGE_KEY,
        JSON.stringify(next),
      );
    } catch {
      // Ignore storage quota errors
    }
  }
  return next;
}

/**
 * Fetches live commits, task reports, and newly added modules directly from
 * GitHub (`vipulgaur/silverarrowsmvp` branch `parthbhatt`) whenever Vipul refreshes his dashboard.
 */
export async function syncWorkspaceFromGitHubParthBranch(
  current: ELearningWorkspaceState,
): Promise<ELearningWorkspaceState> {
  const ts = Date.now();
  let nextState = { ...current };

  try {
    // 1. Fetch latest commit on branch `parthbhatt`
    const commitRes = await fetch(
      `https://api.github.com/repos/vipulgaur/silverarrowsmvp/commits/parthbhatt?t=${ts}`,
      { headers: { Accept: "application/vnd.github.v3+json" } },
    );
    if (commitRes.ok) {
      const commitJson = (await commitRes.json()) as {
        sha?: string;
        commit?: {
          message?: string;
          author?: { name?: string; date?: string };
        };
        files?: { filename: string }[];
      };
      if (commitJson.sha) {
        const shortSha = commitJson.sha.slice(0, 7);
        nextState = {
          ...nextState,
          lastSyncedCommit: shortSha,
          lastSyncedAt: new Date().toISOString(),
          liveGitHubCommit: {
            sha: commitJson.sha,
            shortSha,
            message: commitJson.commit?.message ?? "Updated E-Learning branch",
            authorName: commitJson.commit?.author?.name ?? "Parth Bhatt",
            date: commitJson.commit?.author?.date ?? new Date().toISOString(),
            filesChanged: (commitJson.files ?? []).map((f) => f.filename),
          },
        };
      }
    }

    // 2. Fetch live `src/elearning/dev-workspace-data.json` from `parthbhatt` branch
    const wsRes = await fetch(
      `https://raw.githubusercontent.com/vipulgaur/silverarrowsmvp/parthbhatt/src/elearning/dev-workspace-data.json?t=${ts}`,
    );
    if (wsRes.ok) {
      const remoteWs = (await wsRes.json()) as Partial<ELearningWorkspaceState>;
      if (remoteWs && Array.isArray(remoteWs.tasks)) {
        const localById = new Map(nextState.tasks.map((t) => [t.id, t]));
        for (const rTask of remoteWs.tasks) {
          const existing = localById.get(rTask.id);
          if (!existing) {
            localById.set(rTask.id, rTask);
          } else {
            const repMap = new Map<string, ELearningWorkReport>();
            for (const rep of existing.reports ?? []) repMap.set(rep.id, rep);
            for (const rep of rTask.reports ?? []) repMap.set(rep.id, rep);
            localById.set(rTask.id, {
              ...existing,
              ...rTask,
              reports: Array.from(repMap.values()).sort((a, b) =>
                b.submittedAt.localeCompare(a.submittedAt),
              ),
            });
          }
        }
        nextState.tasks = Array.from(localById.values());
      }
    }

    // 3. Fetch live `src/elearning/custom-modules.json` from `parthbhatt` branch
    const modRes = await fetch(
      `https://raw.githubusercontent.com/vipulgaur/silverarrowsmvp/parthbhatt/src/elearning/custom-modules.json?t=${ts}`,
    );
    if (modRes.ok) {
      const remoteMods = (await modRes.json()) as { modules?: ELearningModule[] };
      if (remoteMods && Array.isArray(remoteMods.modules)) {
        nextState.remoteCustomModules = remoteMods.modules;
      }
    }
  } catch {
    // Graceful offline fallback
  }

  return writeELearningWorkspace(nextState);
}

/**
 * Allows Vipul (Administrator) to create a new E-Learning task directive for Parth Bhatt
 * with explicit "What Needs To Be Done" and "What NOT To Do" instructions.
 */
export function createDirectiveForParth(
  state: ELearningWorkspaceState,
  input: {
    title: string;
    courseId: CourseId;
    courseTitle: string;
    targetChapterId: string;
    targetChapterLabel: string;
    priority: DevTaskPriority;
    whatToDo: string[];
    whatNotToDo: string[];
    allowedFiles?: string[];
  },
): ELearningWorkspaceState {
  const now = new Date().toISOString();
  const nextNum = state.tasks.length + 1;
  const newTask: ELearningDevTask = {
    id: `TASK-EL-${String(nextNum).padStart(2, "0")}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
    title: input.title.trim(),
    courseId: input.courseId,
    courseTitle: input.courseTitle,
    targetChapterId: input.targetChapterId,
    targetChapterLabel: input.targetChapterLabel,
    priority: input.priority,
    status: "assigned",
    assignedBy: "Vipul (Administrator)",
    assignedAt: now,
    updatedAt: now,
    allowedFiles:
      input.allowedFiles && input.allowedFiles.length > 0
        ? input.allowedFiles
        : [
            `src/lib/${input.courseId === "pooley" ? "learning" : input.courseId}-content.ts`,
            "src/components/learning-reader.tsx",
            "src/components/learning-diagram.tsx",
          ],
    whatToDo: input.whatToDo.filter((line) => line.trim().length > 0),
    whatNotToDo: input.whatNotToDo.filter((line) => line.trim().length > 0),
    reports: [],
  };

  const nextState: ELearningWorkspaceState = {
    ...state,
    lastSyncedAt: now,
    tasks: [newTask, ...state.tasks],
  };
  return writeELearningWorkspace(nextState);
}

/**
 * Allows Vipul to update an existing directive's instructions ("What To Do" / "What NOT To Do")
 * or review status ("approved" / "changes_requested").
 */
export function updateDirectiveByAdmin(
  state: ELearningWorkspaceState,
  taskId: string,
  updates: {
    status?: DevTaskStatus;
    whatToDo?: string[];
    whatNotToDo?: string[];
    adminReviewNote?: string;
    priority?: DevTaskPriority;
  },
): ELearningWorkspaceState {
  const now = new Date().toISOString();
  const nextState: ELearningWorkspaceState = {
    ...state,
    lastSyncedAt: now,
    tasks: state.tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            ...(updates.status ? { status: updates.status } : {}),
            ...(updates.whatToDo ? { whatToDo: updates.whatToDo } : {}),
            ...(updates.whatNotToDo ? { whatNotToDo: updates.whatNotToDo } : {}),
            ...(updates.adminReviewNote !== undefined
              ? { adminReviewNote: updates.adminReviewNote }
              : {}),
            ...(updates.priority ? { priority: updates.priority } : {}),
            updatedAt: now,
          }
        : t,
    ),
  };
  return writeELearningWorkspace(nextState);
}

/**
 * Allows Parth Bhatt to submit a work report on an assigned E-Learning task,
 * recording what he changed and linking the exact Course & Chapter for Vipul's UI inspection.
 */
export function submitParthWorkReport(
  state: ELearningWorkspaceState,
  input: {
    taskId: string;
    statusAfter: DevTaskStatus;
    summary: string;
    changesMade: string[];
    filesChanged: string[];
    sectionHighlight?: string;
    beforeSummary?: string;
    afterSummary?: string;
    commitHash?: string;
  },
): ELearningWorkspaceState {
  const now = new Date().toISOString();
  const targetTask = state.tasks.find((t) => t.id === input.taskId);
  if (!targetTask) return state;

  const newReport: ELearningWorkReport = {
    id: `REP-${Date.now().toString(36).toUpperCase()}`,
    taskId: targetTask.id,
    submittedBy: "Parth Bhatt",
    submittedAt: now,
    branch: "parthbhatt",
    commitHash: input.commitHash?.trim() || state.lastSyncedCommit || "HEAD",
    statusAfter: input.statusAfter,
    summary: input.summary.trim(),
    changesMade: input.changesMade.filter((c) => c.trim().length > 0),
    filesChanged:
      input.filesChanged.length > 0
        ? input.filesChanged
        : targetTask.allowedFiles,
    uiPreview: {
      courseId: targetTask.courseId,
      chapterId: targetTask.targetChapterId,
      sectionHighlight:
        input.sectionHighlight?.trim() || targetTask.targetChapterLabel,
      beforeSummary:
        input.beforeSummary?.trim() ||
        `Prior state of ${targetTask.courseTitle} (${targetTask.targetChapterLabel}) before task ${targetTask.id}.`,
      afterSummary:
        input.afterSummary?.trim() || input.summary.trim(),
    },
  };

  const nextState: ELearningWorkspaceState = {
    ...state,
    lastSyncedAt: now,
    tasks: state.tasks.map((t) =>
      t.id === input.taskId
        ? {
            ...t,
            status: input.statusAfter,
            updatedAt: now,
            reports: [newReport, ...t.reports],
          }
        : t,
    ),
  };
  return writeELearningWorkspace(nextState);
}
