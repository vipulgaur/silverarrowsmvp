import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { ArrowLeft, Download, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Chip, Empty, NativeSelect, PageHeader, Section, Stat } from "@/components/app-ui";
import { useMe } from "@/lib/store";
import { roleLabel, type ActivityLog, type Role } from "@/lib/types";

export const Route = createFileRoute("/_shell/admin/audit")({
  head: () => ({
    meta: [
      { title: "Immutable audit log — SilverArrows" },
      {
        name: "description",
        content:
          "Regulatory EASA Part-ORA immutable audit log of all user actions, bookings, flight logs, course assignments and profile changes.",
      },
    ],
  }),
  component: AdminAuditPage,
});

const ENTITY_TYPES: ActivityLog["entityType"][] = [
  "flight",
  "booking",
  "lesson",
  "exam",
  "lecture",
  "maintenance",
  "aircraft",
  "user",
];

function AdminAuditPage() {
  const { data } = useMe();
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | Role>("");
  const [entityFilter, setEntityFilter] = useState<"" | ActivityLog["entityType"]>("");

  const filtered = data.activity.filter((a) => {
    if (roleFilter && a.actorRole !== roleFilter) return false;
    if (entityFilter && a.entityType !== entityFilter) return false;
    if (!q) return true;
    return `${a.actorName} ${a.action} ${a.details} ${a.entityId ?? ""}`
      .toLowerCase()
      .includes(q.toLowerCase());
  });

  function exportAuditCsv() {
    const headers = ["Timestamp", "Actor", "Role", "Action", "EntityType", "EntityId", "Details"];
    const rows = filtered.map((a) => [
      a.at,
      a.actorName,
      a.actorRole,
      a.action,
      a.entityType,
      a.entityId ?? "",
      a.details.replace(/,/g, ";"),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url;
    el.download = `silverarrows-audit-log-${format(new Date(), "yyyy-MM-dd")}.csv`;
    el.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <Link
        to="/portal/admin"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Administrator Master Control
      </Link>

      <PageHeader
        title="Regulatory immutable audit log"
        subtitle="Complete, append-only history of every flight, booking, course assignment, sign-off, and user record action."
      >
        <Button variant="outline" size="sm" onClick={exportAuditCsv}>
          <Download className="mr-1.5 h-4 w-4" /> Export CSV
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Total audit events" value={data.activity.length} hint="Immutable records" />
        <Stat
          label="Admin actions"
          value={data.activity.filter((a) => a.actorRole === "admin").length}
        />
        <Stat
          label="Instructor actions"
          value={
            data.activity.filter((a) => a.actorRole === "instructor" || a.actorRole === "ground")
              .length
          }
        />
        <Stat
          label="Student actions"
          value={data.activity.filter((a) => a.actorRole === "student").length}
        />
      </div>

      <Section
        title={`Audit trail (${filtered.length} entries)`}
        className="mt-6"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Input
              className="w-56"
              placeholder="Search actor, action, details…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <NativeSelect
              className="w-40"
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
            <NativeSelect
              className="w-40"
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value as "" | ActivityLog["entityType"])}
              aria-label="Filter by entity"
            >
              <option value="">All entities</option>
              {ENTITY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </NativeSelect>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <Empty
            icon={ShieldCheck}
            title="No audit entries match your filter"
            description="Try clearing the search query or role/entity filter."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="num text-xs">
                    {format(new Date(a.at), "dd.MM.yyyy HH:mm:ss")}
                  </TableCell>
                  <TableCell className="font-medium">{a.actorName}</TableCell>
                  <TableCell>
                    <Chip variant="info">{roleLabel[a.actorRole]}</Chip>
                  </TableCell>
                  <TableCell className="num text-xs font-semibold">{a.action}</TableCell>
                  <TableCell className="text-xs capitalize">
                    {a.entityType}
                    {a.entityId ? ` #${a.entityId}` : ""}
                  </TableCell>
                  <TableCell className="text-sm">{a.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Section>
    </div>
  );
}
