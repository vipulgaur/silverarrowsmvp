import { chapterById, learningChapters, type LearningChapter } from "@/lib/learning-content";
import type { LearningRecord } from "@/lib/types";

export function learningRecord(
  records: LearningRecord[],
  memberId: string,
  chapterId: string,
): LearningRecord {
  return (
    records.find((r) => r.memberId === memberId && r.chapterId === chapterId) ?? {
      memberId,
      chapterId,
      completed: false,
      bookmarked: false,
      notes: "",
      updatedAt: "",
    }
  );
}

export function saveLearningRecord(
  records: LearningRecord[],
  memberId: string,
  chapterId: string,
  updates: Partial<Pick<LearningRecord, "completed" | "bookmarked" | "notes">>,
  checkChapter?: (id: string) => LearningChapter | undefined,
): LearningRecord[] {
  const getter = checkChapter ?? chapterById;
  const rawId = chapterId.replace(/^(airframes|electrics|powerplant)-/, "");
  const chapter = getter(chapterId) ?? getter(rawId);
  if (!chapter || chapter.sections.length === 0) {
    return records;
  }

  const now = new Date().toISOString();
  const idx = records.findIndex((r) => r.memberId === memberId && r.chapterId === chapterId);

  if (idx >= 0) {
    const next = [...records] as LearningRecord[];
    next[idx] = {
      ...next[idx]!,
      ...updates,
      updatedAt: now,
    };
    return next;
  }

  return [
    ...records,
    {
      memberId,
      chapterId,
      completed: false,
      bookmarked: false,
      notes: "",
      ...updates,
      updatedAt: now,
    },
  ];
}

export function courseProgress(
  records: LearningRecord[],
  memberId: string,
  chaptersList: LearningChapter[] = learningChapters,
  coursePrefix = "",
) {
  const availableIds = new Set(
    chaptersList
      .filter((c) => c.sections.length > 0)
      .map((c) => (coursePrefix ? `${coursePrefix}-${c.id}` : c.id)),
  );
  const total = availableIds.size;
  const completed = records.filter(
    (r) => r.memberId === memberId && r.completed && availableIds.has(r.chapterId),
  ).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percent };
}
