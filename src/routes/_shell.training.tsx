import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Check, Plus, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Chip, Empty, Field, NativeSelect, PageHeader, Section } from "@/components/app-ui";
import { useLookup, useMe } from "@/lib/store";
import { activeUsers, can, studentProgress, theoryProgress, uid } from "@/lib/logic";

export const Route = createFileRoute("/_shell/training")({
  head: () => ({
    meta: [
      { title: "Training & syllabus — SilverArrows" },
      {
        name: "description",
        content:
          "EASA PPL(A) flight training syllabus, ground school lectures, attendance sign-off and theory examination records.",
      },
    ],
  }),
  component: TrainingPage,
});

function TrainingPage() {
  const { data, me, update, log } = useMe();
  const lk = useLookup();
  const students = activeUsers(data, "student");
  const [selectedStudentId, setSelectedStudentId] = useState(
    me.role === "student" ? me.id : (students[0]?.id ?? ""),
  );

  const [subjectId, setSubjectId] = useState(data.subjects[0]?.id ?? "sub-1");
  const [score, setScore] = useState("85");

  const targetStudent = lk.user(selectedStudentId) ?? students[0];
  const prog = targetStudent ? studentProgress(targetStudent.id, data) : null;
  const theory = targetStudent ? theoryProgress(targetStudent.id, data) : null;

  function signOffLesson(lessonId: string) {
    if (!targetStudent) return;
    update((d) => ({
      ...d,
      completions: [
        ...d.completions,
        {
          id: uid(),
          studentId: targetStudent.id,
          lessonId,
          date: format(new Date(), "yyyy-MM-dd"),
          instructorId: me.id,
          grade: 4,
        },
      ],
    }));
    log(
      "lesson_signed_off",
      "lesson",
      `Signed off ${lk.lesson(lessonId)?.name} for ${targetStudent.name}`,
      lessonId,
    );
    toast.success("Lesson signed off");
  }

  function removeLessonSignOff(lessonId: string) {
    if (!targetStudent) return;
    update((d) => ({
      ...d,
      completions: d.completions.filter(
        (c) => !(c.studentId === targetStudent.id && c.lessonId === lessonId),
      ),
    }));
    log(
      "lesson_signoff_removed",
      "lesson",
      `Removed sign-off of ${lk.lesson(lessonId)?.name} for ${targetStudent.name}`,
      lessonId,
    );
    toast("Sign-off removed");
  }

  function recordExam(e: FormEvent) {
    e.preventDefault();
    if (!targetStudent) return;
    const sc = Math.max(0, Math.min(100, Number(score) || 0));
    const passed = sc >= 75;
    const examId = `ex-${uid().slice(0, 5)}`;
    const subj = data.subjects.find((s) => s.id === subjectId);

    update((d) => ({
      ...d,
      exams: [
        {
          id: examId,
          studentId: targetStudent.id,
          subjectId,
          date: format(new Date(), "yyyy-MM-dd"),
          score: sc,
          passed,
          signedBy: me.id,
        },
        ...d.exams,
      ],
    }));
    log(
      "exam_recorded",
      "exam",
      `Recorded ${subj?.name ?? subjectId} exam (${sc}% — ${passed ? "PASS" : "FAIL"}) for ${targetStudent.name}`,
      examId,
    );
    toast.success(`Recorded ${subj?.name ?? subjectId}: ${sc}%`);
  }

  function toggleAttendance(lectureId: string, title: string) {
    if (!targetStudent) return;
    const lec = data.lectures.find((l) => l.id === lectureId);
    if (!lec) return;
    const isAttended = lec.attended.includes(targetStudent.id);

    update((d) => ({
      ...d,
      lectures: d.lectures.map((l) =>
        l.id === lectureId
          ? {
              ...l,
              attended: isAttended
                ? l.attended.filter((id) => id !== targetStudent.id)
                : [...l.attended, targetStudent.id],
            }
          : l,
      ),
    }));
    log(
      isAttended ? "attendance_removed" : "attendance_marked",
      "lecture",
      `${isAttended ? "Removed" : "Marked"} ${targetStudent.name} attendance for "${title}"`,
      lectureId,
    );
    toast.success(isAttended ? "Attendance removed" : "Attendance marked present");
  }

  return (
    <div>
      <PageHeader
        title="Syllabus & theoretical knowledge"
        subtitle="EASA Part-FCL practical flight exercises, ground school lectures, and 9-subject CAA exam tracking."
      >
        {me.role !== "student" && students.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Student:</span>
            <NativeSelect
              className="w-52"
              value={targetStudent?.id ?? ""}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              aria-label="Select student"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.callsign ?? "Student"})
                </option>
              ))}
            </NativeSelect>
          </div>
        )}
      </PageHeader>

      {!targetStudent ? (
        <Empty title="No student selected" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Practical Flight Syllabus */}
          <Section
            title={`Practical syllabus — ${prog?.program?.name ?? "PPL(A)"}`}
            description={`${prog?.completed ?? 0} of ${prog?.total ?? 0} lessons completed (${prog?.pct ?? 0}%)`}
          >
            <Progress value={prog?.pct ?? 0} className="mb-4 h-2" />
            {!prog?.program ? (
              <Empty title="No program assigned" />
            ) : (
              <ol className="divide-y">
                {prog.program.lessons.map((l, idx) => {
                  const comp = data.completions.find(
                    (c) => c.studentId === targetStudent.id && c.lessonId === l.id,
                  );
                  return (
                    <li key={l.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                      <div className="flex items-center gap-3">
                        <span
                          className={`num flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            comp
                              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {comp ? <Check className="h-4 w-4" /> : idx + 1}
                        </span>
                        <div>
                          <div className="font-medium">
                            <span className="num text-xs text-muted-foreground">{l.code}</span> ·{" "}
                            {l.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {l.kind.toUpperCase()} · {l.minutes} min
                            {comp &&
                              ` · Signed off ${format(new Date(comp.date), "dd MMM")} by ${lk.user(comp.instructorId)?.name ?? "Instructor"}`}
                          </div>
                        </div>
                      </div>
                      {can.signOff(me.role) &&
                        (comp ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeLessonSignOff(l.id)}
                          >
                            <Undo2 className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => signOffLesson(l.id)}>
                            Sign off
                          </Button>
                        ))}
                    </li>
                  );
                })}
              </ol>
            )}
          </Section>

          {/* EASA 9-Subject Theory Exams & Ground Lectures */}
          <div className="space-y-6">
            <Section
              title={`EASA PPL(A) Theory Exams (${theory?.passed ?? 0}/${theory?.total ?? 9} passed)`}
              description="Minimum 75% required per subject to pass."
            >
              {can.manageLectures(me.role) && (
                <form
                  onSubmit={recordExam}
                  className="mb-4 grid gap-2 rounded-xl border bg-muted/30 p-3 sm:grid-cols-4"
                >
                  <div className="sm:col-span-2">
                    <Field label="Subject">
                      <NativeSelect
                        value={subjectId}
                        onChange={(e) => setSubjectId(e.target.value)}
                      >
                        {data.subjects.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.code} · {sub.name}
                          </option>
                        ))}
                      </NativeSelect>
                    </Field>
                  </div>
                  <Field label="Score (%)">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                    />
                  </Field>
                  <div className="flex items-end">
                    <Button type="submit" size="sm" className="w-full">
                      <Plus className="mr-1 h-3.5 w-3.5" /> Record
                    </Button>
                  </div>
                </form>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Best Score</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.subjects.map((sub) => {
                    const results = data.exams.filter(
                      (e) => e.studentId === targetStudent.id && e.subjectId === sub.id,
                    );
                    const best = results.reduce<number | null>(
                      (max, r) => (max === null || r.score > max ? r.score : max),
                      null,
                    );
                    const passed = results.some((r) => r.passed);
                    return (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium text-xs">
                          <span className="num text-muted-foreground">{sub.code}</span> · {sub.name}
                        </TableCell>
                        <TableCell className="num text-xs">
                          {best !== null ? `${best}%` : "—"}
                        </TableCell>
                        <TableCell>
                          <Chip tone={passed ? "ok" : best !== null ? "expired" : "none"}>
                            {passed ? "Passed" : best !== null ? "Retake needed" : "Not sat"}
                          </Chip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Section>

            <Section
              title="Classroom ground lectures"
              description="Scheduled theoretical knowledge sessions and attendance verification"
            >
              <div className="divide-y">
                {data.lectures.map((lec) => {
                  const isPresent = lec.attended.includes(targetStudent.id);
                  const subName =
                    data.subjects.find((s) => s.id === lec.subjectId)?.name ?? lec.subjectId;
                  const roomName =
                    data.classrooms.find((r) => r.id === lec.roomId)?.name ?? lec.roomId;
                  return (
                    <div
                      key={lec.id}
                      className="flex items-center justify-between gap-3 py-3 text-sm"
                    >
                      <div>
                        <div className="font-medium">
                          {lec.title}{" "}
                          <span className="text-xs text-muted-foreground">({subName})</span>
                        </div>
                        <div className="num text-xs text-muted-foreground">
                          {format(new Date(lec.start), "dd MMM HH:mm")} · {roomName} ·{" "}
                          {lk.user(lec.instructorId)?.name ?? "Ground Instructor"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Chip tone={isPresent ? "ok" : "none"}>
                          {isPresent ? "Present" : "Not marked"}
                        </Chip>
                        {can.manageLectures(me.role) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleAttendance(lec.id, lec.title)}
                          >
                            {isPresent ? "Undo" : "Mark present"}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          </div>
        </div>
      )}
    </div>
  );
}
