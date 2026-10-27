import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Database, KeyRound, Link2, Search, Table2 } from "lucide-react";
import { Chip, Empty, NativeSelect, PageHeader, Section, Stat } from "@/components/app-ui";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMe } from "@/lib/store";
import type { AppData } from "@/lib/types";

export const Route = createFileRoute("/_shell/database")({
  head: () => ({
    meta: [
      { title: "Database inspector & schema graph — SilverArrows" },
      {
        name: "description",
        content:
          "Administrator database inspector: relational table-linkage graph, primary/foreign key mappings, live record browser, and activity-to-table write audit reference.",
      },
    ],
  }),
  component: DatabaseInspectorPage,
});

type TableKey =
  | "users"
  | "aircraft"
  | "maintenance"
  | "programs"
  | "lessons"
  | "bookings"
  | "flights"
  | "completions"
  | "requests"
  | "profileRequests"
  | "subjects"
  | "classrooms"
  | "lectures"
  | "exams"
  | "duty"
  | "documents"
  | "learningRecords"
  | "activity";

interface TableSchemaMeta {
  key: TableKey;
  tableName: string;
  label: string;
  pk: string;
  fks: string[];
  description: string;
}

const TABLE_SCHEMAS: TableSchemaMeta[] = [
  {
    key: "users",
    tableName: "members + member_roles",
    label: "Members & Roles (users)",
    pk: "id (UUID / member ID)",
    fks: ["instructorId → users.id", "programId → programs.id"],
    description:
      "Academy members (students, CFIs, ground instructors, admins) and RBAC role assignments.",
  },
  {
    key: "aircraft",
    tableName: "aircraft",
    label: "Fleet Aircraft (aircraft)",
    pk: "id",
    fks: [],
    description:
      "Training fleet airframes, hourly rates, airframe/tach hours, and serviceability state.",
  },
  {
    key: "maintenance",
    tableName: "maintenance_items",
    label: "Maintenance Items (maintenance)",
    pk: "id",
    fks: ["aircraftId → aircraft.id"],
    description:
      "Scheduled inspections, 50h/100h checks, and airworthiness directives per airframe.",
  },
  {
    key: "programs",
    tableName: "programs",
    label: "Training Programs (programs)",
    pk: "id",
    fks: [],
    description: "Approved EASA Part-FCL training syllabi (e.g. PPL(A), LAPL(A), Night Rating).",
  },
  {
    key: "lessons",
    tableName: "lessons",
    label: "Syllabus Lessons (lessons)",
    pk: "id",
    fks: ["programId → programs.id"],
    description:
      "Individual flight, simulator, and ground exercises belonging to a training program.",
  },
  {
    key: "bookings",
    tableName: "bookings",
    label: "Dispatch Bookings (bookings)",
    pk: "id",
    fks: [
      "aircraftId → aircraft.id",
      "studentId → users.id",
      "instructorId → users.id",
      "lessonId → lessons.id",
    ],
    description: "Scheduled dual, solo, and maintenance slots with student booking approval state.",
  },
  {
    key: "flights",
    tableName: "flights",
    label: "Flight Logbook (flights)",
    pk: "id",
    fks: [
      "bookingId → bookings.id",
      "aircraftId → aircraft.id",
      "pilotId → users.id",
      "instructorId → users.id",
      "lessonId → lessons.id",
    ],
    description:
      "Completed flight debrief entries, block times, tach readings, landings, and grades.",
  },
  {
    key: "completions",
    tableName: "lesson_completions",
    label: "Lesson Completions (completions)",
    pk: "id",
    fks: [
      "studentId → users.id",
      "lessonId → lessons.id",
      "instructorId → users.id",
      "flightId → flights.id",
    ],
    description:
      "Signed-off syllabus exercises linking student progress to flight logbook records.",
  },
  {
    key: "requests",
    tableName: "reschedule_requests",
    label: "Booking Change Requests (requests)",
    pk: "id",
    fks: [
      "bookingId → bookings.id",
      "studentId → users.id",
      "instructorId → users.id",
      "reviewerId → users.id",
    ],
    description: "Student reschedule requests awaiting assigned CFI or administrator approval.",
  },
  {
    key: "profileRequests",
    tableName: "profile_requests",
    label: "Profile Change Requests (profileRequests)",
    pk: "id",
    fks: ["userId → users.id", "submittedBy → users.id", "reviewerId → users.id"],
    description: "Allowlisted member profile edits awaiting administrator review and approval.",
  },
  {
    key: "subjects",
    tableName: "theory_subjects",
    label: "Theory Exam Subjects (subjects)",
    pk: "id",
    fks: [],
    description:
      "EASA PPL(A) theoretical knowledge examination subjects (010 Air Law – 090 Communications).",
  },
  {
    key: "classrooms",
    tableName: "classrooms",
    label: "Ground Classrooms (classrooms)",
    pk: "id",
    fks: [],
    description: "Physical and simulator briefing rooms with maximum seating capacities.",
  },
  {
    key: "lectures",
    tableName: "lectures",
    label: "Ground School Lectures (lectures)",
    pk: "id",
    fks: [
      "subjectId → subjects.id",
      "roomId → classrooms.id",
      "instructorId → users.id",
      "enrolled[] → users.id",
    ],
    description:
      "Scheduled classroom sessions, student enrolment, attendance rolls, and sign-off status.",
  },
  {
    key: "exams",
    tableName: "exam_results",
    label: "Theory Exam Results (exams)",
    pk: "id",
    fks: ["studentId → users.id", "subjectId → subjects.id", "signedBy → users.id"],
    description:
      "Recorded theoretical exam sittings, percentage scores, pass/fail state, and examiner sign-off.",
  },
  {
    key: "duty",
    tableName: "duty_logs",
    label: "EASA Part-FTL Duty Logs (duty)",
    pk: "id",
    fks: ["instructorId → users.id"],
    description:
      "Flight instructor duty start/end timestamps enforcing EASA Part-FTL rest and duty limits.",
  },
  {
    key: "documents",
    tableName: "student_documents",
    label: "Student Aviation Documents (documents)",
    pk: "id",
    fks: ["studentId → users.id"],
    description:
      "Student licences, medical certificates, RTR/FRTOL/SPL endorsements, and expiry tracking.",
  },
  {
    key: "learningRecords",
    tableName: "learning_records",
    label: "E-Learning Progress (learningRecords)",
    pk: "userId + chapterId",
    fks: ["userId → users.id"],
    description: "Per-member chapter completion, bookmarks, and personal study notes.",
  },
  {
    key: "activity",
    tableName: "activity_log",
    label: "Immutable Audit Log (activity)",
    pk: "id",
    fks: ["actorId → users.id", "entityId → *.id"],
    description:
      "Append-only regulatory audit trail recording every state mutation across the academy.",
  },
];

const ACTIVITY_WRITE_MAP = [
  {
    action: "booking_requested / booking_created",
    entityType: "booking",
    writesTo: "bookings, activity_log",
    notes:
      "Student requests start as approvalStatus='pending'; staff bookings are 'approved' via DB trigger.",
  },
  {
    action: "booking_approved / booking_declined / booking_cancelled",
    entityType: "booking",
    writesTo: "bookings, activity_log",
    notes: "Updates booking approval/status and emits immutable notification + audit entries.",
  },
  {
    action: "reschedule_requested / reschedule_approved / reschedule_declined",
    entityType: "booking",
    writesTo: "reschedule_requests, bookings, activity_log",
    notes: "Approving a reschedule atomically updates the target booking's start/end window.",
  },
  {
    action: "flight_logged / flight_submitted / flight_verified / flight_deleted",
    entityType: "flight",
    writesTo: "flights, aircraft, bookings, lesson_completions, activity_log",
    notes:
      "Verified flights increment aircraft totalHours/tachHours, mark linked booking completed, and record lesson completion.",
  },
  {
    action: "document_added / document_removed",
    entityType: "user",
    writesTo: "student_documents, activity_log",
    notes:
      "Stores student aviation certificates, licence numbers, and expiry dates with automated validity alerts.",
  },
  {
    action: "profile_request_submitted / profile_request_approved / profile_request_declined",
    entityType: "user",
    writesTo: "profile_requests, members, activity_log",
    notes: "Pending requests do not mutate members until approved by an administrator.",
  },
  {
    action: "user_created / user_soft_deleted / user_restored",
    entityType: "user",
    writesTo: "members, member_roles, bookings, activity_log",
    notes:
      "Soft-deletion sets status='deleted' (archived_at) and cancels future scheduled bookings.",
  },
  {
    action: "lecture_scheduled / lecture_signed_off / exam_recorded",
    entityType: "lecture / exam",
    writesTo: "lectures, exam_results, activity_log",
    notes: "Records classroom attendance rolls and EASA PPL theory exam scores (>=75% pass mark).",
  },
  {
    action: "maintenance_added / maintenance_completed / aircraft_grounded",
    entityType: "maintenance / aircraft",
    writesTo: "maintenance_items, aircraft, activity_log",
    notes: "Updates airframe serviceability and grounds/ungrounds aircraft on the dispatch grid.",
  },
  {
    action: "course_assigned / course_unassigned / learning_completion_changed",
    entityType: "lesson",
    writesTo: "learning_records, activity_log",
    notes: "Tracks administrator course assignments and student chapter completions/notes.",
  },
];

function extractRows(data: AppData, table: TableKey): Record<string, unknown>[] {
  if (table === "lessons") {
    return data.programs.flatMap((p) =>
      p.lessons.map((l) => ({
        id: l.id,
        programId: p.id,
        programName: p.name,
        code: l.code ?? "—",
        name: l.name,
        kind: l.kind,
        minutes: l.minutes,
        description: l.description ?? "—",
      })),
    );
  }
  if (table === "programs") {
    return data.programs.map((p) => ({
      id: p.id,
      name: p.name,
      lessonCount: p.lessons.length,
      totalMinutes: p.lessons.reduce((s, l) => s + l.minutes, 0),
    }));
  }
  const raw = data[table];
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => ({ ...(item as unknown as Record<string, unknown>) }));
}

function formatCellValue(val: unknown): string {
  if (val === null || val === undefined || val === "") return "—";
  if (typeof val === "boolean") return val ? "true" : "false";
  if (Array.isArray(val)) return val.length ? val.join(", ") : "[]";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

function DatabaseInspectorPage() {
  const { data } = useMe();
  const [selectedTable, setSelectedTable] = useState<TableKey>("users");
  const [search, setSearch] = useState("");

  const activeSchema = TABLE_SCHEMAS.find((t) => t.key === selectedTable) ?? TABLE_SCHEMAS[0]!;
  const allRows = extractRows(data, selectedTable);
  const filteredRows = allRows.filter((row) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return Object.values(row).some((v) => formatCellValue(v).toLowerCase().includes(q));
  });

  const columns = Array.from(
    allRows.reduce((set, row) => {
      Object.keys(row).forEach((k) => set.add(k));
      return set;
    }, new Set<string>()),
  );

  const totalRecords = TABLE_SCHEMAS.reduce((sum, t) => sum + extractRows(data, t.key).length, 0);

  return (
    <div className="space-y-6">
      <Link
        to="/portal/admin"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Admin Hub
      </Link>

      <PageHeader
        title="Database inspector & table-linkage graph"
        subtitle="Inspect primary keys, foreign-key relationships, live table records, and activity-to-table write mappings."
      >
        <Chip variant="info">
          <Database className="h-3.5 w-3.5" /> {TABLE_SCHEMAS.length} tables · {totalRecords} live
          rows
        </Chip>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Relational tables"
          value={TABLE_SCHEMAS.length}
          hint="Canonical academy schema"
        />
        <Stat
          label="Total live records"
          value={totalRecords}
          hint="Across all active collections"
        />
        <Stat
          label="Active members"
          value={data.users.filter((u) => u.status === "active").length}
          hint={`${data.users.filter((u) => u.status === "deleted").length} soft-deleted (archived)`}
        />
        <Stat
          label="Audit trail entries"
          value={data.activity.length}
          hint="Immutable regulatory history"
        />
      </div>

      {/* 1. Table-Linkage Graph */}
      <Section
        title="Table-linkage graph (Primary keys & Foreign key relations)"
        description="Click any table node below to inspect its live records in the browser."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TABLE_SCHEMAS.map((schema) => {
            const count = extractRows(data, schema.key).length;
            const isSelected = schema.key === selectedTable;
            return (
              <button
                key={schema.key}
                type="button"
                onClick={() => setSelectedTable(schema.key)}
                className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-xs"
                    : "border-border bg-card hover:border-primary/50 hover:bg-accent/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <Table2 className="h-3.5 w-3.5 text-primary-ink" />
                      {schema.tableName}
                    </span>
                    <Chip tone={isSelected ? "ok" : "none"}>{count} rows</Chip>
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">
                    {schema.description}
                  </p>
                </div>

                <div className="mt-3 space-y-1 border-t border-border/60 pt-2.5 text-[11px]">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <KeyRound className="h-3 w-3 text-primary-ink shrink-0" />
                    <span>PK:</span>
                    <code className="rounded bg-muted px-1 py-0.5 text-[10px]">{schema.pk}</code>
                  </div>
                  {schema.fks.length > 0 ? (
                    <div className="space-y-0.5 text-muted-foreground">
                      {schema.fks.map((fk) => (
                        <div key={fk} className="flex items-center gap-1.5">
                          <Link2 className="h-3 w-3 shrink-0 text-muted-foreground" />
                          <code className="text-[10px]">{fk}</code>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[10px] text-muted-foreground">
                      Root entity table (no FKs)
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      {/* 2. Live Table Record Browser */}
      <Section
        title={`Live table browser — ${activeSchema.label}`}
        description={`Primary Key: ${activeSchema.pk} · Showing ${filteredRows.length} of ${allRows.length} records`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <NativeSelect
              aria-label="Pick table to browse"
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value as TableKey)}
              className="w-60"
            >
              {TABLE_SCHEMAS.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label} ({extractRows(data, t.key).length})
                </option>
              ))}
            </NativeSelect>
            <div className="relative w-56">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Filter rows…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-8 text-xs"
              />
            </div>
          </div>
        }
      >
        {filteredRows.length === 0 ? (
          <Empty>No records match the current filter in {activeSchema.tableName}.</Empty>
        ) : (
          <div className="max-h-[480px] overflow-auto rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col} className="whitespace-nowrap text-xs font-bold">
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((row, idx) => (
                  <TableRow key={String(row.id ?? idx)}>
                    {columns.map((col) => (
                      <TableCell
                        key={col}
                        className="max-w-[260px] truncate text-xs font-mono"
                        title={formatCellValue(row[col])}
                      >
                        {formatCellValue(row[col])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Section>

      {/* 3. Activity-to-Table Write Mapping */}
      <Section
        title="Activity-to-table write audit reference"
        description="Shows which operational actions write to which database tables and triggers."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Activity Action</TableHead>
              <TableHead>Entity Type</TableHead>
              <TableHead>Target Database Tables</TableHead>
              <TableHead>Transactional &amp; Trigger Behavior</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ACTIVITY_WRITE_MAP.map((item) => (
              <TableRow key={item.action}>
                <TableCell className="font-mono text-xs font-semibold">{item.action}</TableCell>
                <TableCell>
                  <Chip tone="none">{item.entityType}</Chip>
                </TableCell>
                <TableCell className="font-mono text-xs text-primary-ink">
                  {item.writesTo}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{item.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
    </div>
  );
}
