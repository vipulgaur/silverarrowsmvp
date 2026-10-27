import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, GraduationCap, Search, UserCheck } from "lucide-react";
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
import { Chip, Empty, NativeSelect, PageHeader, Section } from "@/components/app-ui";
import { ProfileEditor } from "@/components/profile-editor";
import { useLookup, useMe } from "@/lib/store";
import { expiryState, fmtHours, studentProgress, theoryProgress } from "@/lib/logic";
import { assignedCourseIds } from "@/lib/elearning-courses";
import { roleLabel, type Role } from "@/lib/types";

export const Route = createFileRoute("/_shell/people/")({
  head: () => ({
    meta: [
      { title: "People & student roster — SilverArrows" },
      {
        name: "description",
        content:
          "Directory of student pilots, flight instructors, ground instructors and administrators with training progress and medical validity.",
      },
    ],
  }),
  component: PeopleDirectoryPage,
});

function PeopleDirectoryPage() {
  const { data, me } = useMe();
  const lk = useLookup();
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | Role>("");

  const active = data.users.filter((u) => u.status !== "deleted");
  const filtered = active.filter(
    (u) =>
      (!roleFilter || u.role === roleFilter) &&
      (!q || `${u.name} ${u.email} ${u.callsign ?? ""}`.toLowerCase().includes(q.toLowerCase())),
  );

  const students = filtered.filter((u) => u.role === "student");
  const staff = filtered.filter((u) => u.role !== "student");

  function medBadge(dateStr?: string) {
    const e = expiryState(dateStr);
    return (
      <Chip tone={e.state === "none" ? "none" : e.state}>
        {e.state === "none"
          ? "—"
          : e.state === "expired"
            ? "Expired"
            : e.state === "soon"
              ? `Expiring (${e.days}d)`
              : "Valid"}
      </Chip>
    );
  }

  return (
    <div>
      <PageHeader
        title="Academy roster & student profiles"
        subtitle="Inspect student training progress, syllabus sign-offs, assigned E-Learning courses, and crew currency."
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="w-56 pl-8"
              placeholder="Search name, email, callsign…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <NativeSelect
            className="w-44"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as "" | Role)}
            aria-label="Filter by role"
          >
            <option value="">All roles</option>
            {(Object.keys(roleLabel) as Role[]).map((r) => (
              <option key={r} value={r}>
                {roleLabel[r]}
              </option>
            ))}
          </NativeSelect>
        </div>
      </PageHeader>

      {students.length > 0 && (
        <Section
          title={`Student pilots (${students.length})`}
          description="Click any student to open their full training dossier, syllabus sign-offs, and flight log."
          className="mb-6"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Assigned CFI</TableHead>
                <TableHead>Syllabus progress</TableHead>
                <TableHead>Flight time</TableHead>
                <TableHead>Theory &amp; E-Learning</TableHead>
                <TableHead>Medical</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => {
                const prog = studentProgress(s.id, data);
                const th = theoryProgress(s.id, data);
                const courses = assignedCourseIds(s.id, data);
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <Link
                        to="/people/$id"
                        params={{ id: s.id }}
                        className="font-semibold text-primary hover:underline"
                      >
                        {s.name}
                      </Link>{" "}
                      {s.callsign && (
                        <span className="num text-xs text-muted-foreground">({s.callsign})</span>
                      )}
                      <div className="text-xs text-muted-foreground">{s.email}</div>
                    </TableCell>
                    <TableCell>{lk.user(s.instructorId)?.name ?? "—"}</TableCell>
                    <TableCell className="w-44">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">{prog.pct}%</span>
                        <span className="text-muted-foreground">
                          {prog.completed}/{prog.total} lessons
                        </span>
                      </div>
                      <Progress value={prog.pct} className="mt-1 h-1.5" />
                    </TableCell>
                    <TableCell className="num font-medium">{fmtHours(prog.minutes)}</TableCell>
                    <TableCell className="text-xs">
                      <div>
                        Exams:{" "}
                        <span className="num font-medium">
                          {th.passed}/{th.total}
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        {courses.length} assigned course{courses.length === 1 ? "" : "s"}
                      </div>
                    </TableCell>
                    <TableCell>{medBadge(s.medicalExpiry)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button asChild size="sm" variant="outline">
                          <Link to="/people/$id" params={{ id: s.id }}>
                            <Eye className="mr-1 h-3.5 w-3.5" /> Dossier
                          </Link>
                        </Button>
                        {me.role === "admin" && (
                          <Button asChild size="sm" variant="ghost">
                            <Link to="/portal/student" search={{ id: s.id } as never}>
                              Student POV
                            </Link>
                          </Button>
                        )}
                        <ProfileEditor person={s} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Section>
      )}

      {staff.length > 0 && (
        <Section
          title={`Instructors & Academy Staff (${staff.length})`}
          description="Flight instructors, ground school instructors, and administrators."
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Licence / Speciality</TableHead>
                <TableHead>Medical</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <span className="font-semibold">{u.name}</span>{" "}
                    {u.callsign && (
                      <span className="num text-xs text-muted-foreground">({u.callsign})</span>
                    )}
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </TableCell>
                  <TableCell>
                    <Chip variant="info">{roleLabel[u.role]}</Chip>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div>{u.licence ?? "—"}</div>
                    {u.speciality && <div className="text-muted-foreground">{u.speciality}</div>}
                  </TableCell>
                  <TableCell>{medBadge(u.medicalExpiry)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      {me.role === "admin" && u.role === "instructor" && (
                        <Button asChild size="sm" variant="outline">
                          <Link to="/portal/cfi" search={{ id: u.id } as never}>
                            <Eye className="mr-1 h-3.5 w-3.5" /> CFI POV
                          </Link>
                        </Button>
                      )}
                      {me.role === "admin" && u.role === "ground" && (
                        <Button asChild size="sm" variant="outline">
                          <Link to="/portal/ground" search={{ id: u.id } as never}>
                            <GraduationCap className="mr-1 h-3.5 w-3.5" /> Ground POV
                          </Link>
                        </Button>
                      )}
                      <ProfileEditor person={u} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>
      )}

      {filtered.length === 0 && (
        <Empty
          icon={UserCheck}
          title="No members match your search"
          description="Try clearing the role filter or search query."
        />
      )}
    </div>
  );
}
