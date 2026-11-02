import { useMemo, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Info,
  Plane,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import type { ActivityItem, AppData, User } from "@/lib/types";

export type AuditCategoryFilter = "all" | "accounts" | "flights" | "profiles";
export type AuditOutcomeFilter = "all" | "approved" | "declined" | "other";

export interface NormalizedAuditRecord {
  id: string;
  timestamp: string;
  category: "account" | "flight" | "profile" | "system";
  action: string;
  actionLabel: string;
  outcome: "approved" | "declined" | "pending" | "info";
  actorId?: string;
  actorName: string;
  actorRole?: string;
  targetId?: string;
  targetName: string;
  targetDetails: string;
  notes?: string;
  rawItem: ActivityItem;
}

interface ApprovalAuditTrailProps {
  data: AppData;
  currentUser: User;
  initialCategory?: AuditCategoryFilter;
  className?: string;
}

/**
 * Categorizes and normalizes raw immutable activity rows into rich, searchable
 * approval and regulatory audit records.
 */
function normalizeAuditActivities(data: AppData): NormalizedAuditRecord[] {
  const usersById = new Map<string, User>(data.users.map((u) => [u.id, u]));
  const bookingsById = new Map(data.bookings.map((b) => [b.id, b]));
  const flightsById = new Map(data.flights.map((f) => [f.id, f]));

  return data.activity
    .filter((a) => {
      // Keep all approval, review, decision, and registration audit entries
      return (
        a.action.includes("approved") ||
        a.action.includes("declined") ||
        a.action.includes("rejected") ||
        a.action.includes("verified") ||
        a.action.includes("post_flight_confirmed") ||
        a.action.includes("registration") ||
        a.action.includes("user_created") ||
        a.action.includes("reschedule") ||
        a.action.includes("profile_request") ||
        a.action.includes("course_") ||
        a.entityType === "booking" ||
        a.entityType === "flight" ||
        a.entityType === "user"
      );
    })
    .map((a) => {
      let category: NormalizedAuditRecord["category"] = "system";
      let outcome: NormalizedAuditRecord["outcome"] = "info";
      let actionLabel = a.action.replace(/_/g, " ").toUpperCase();
      let targetName = "Academy Entity";
      let targetDetails = a.details;

      // Classify Action & Outcome
      if (
        a.action === "user_login_approved" ||
        a.action === "account_registration_requested" ||
        a.action === "user_login_declined" ||
        a.action === "user_created"
      ) {
        category = "account";
        const matchedUser = a.entityId ? usersById.get(a.entityId) : undefined;
        targetName = matchedUser?.name ?? "Account Candidate";
        if (a.action === "user_login_approved") {
          outcome = "approved";
          actionLabel = "ACCOUNT LOGIN APPROVED";
        } else if (a.action === "user_login_declined") {
          outcome = "declined";
          actionLabel = "ACCOUNT LOGIN DECLINED";
        } else if (a.action === "account_registration_requested") {
          outcome = "pending";
          actionLabel = "REGISTRATION SUBMITTED";
        } else {
          outcome = "info";
          actionLabel = "USER PROFILE CREATED";
        }
      } else if (
        a.action.includes("flight") ||
        a.action.includes("booking") ||
        a.action.includes("reschedule")
      ) {
        category = "flight";
        if (a.action === "post_flight_confirmed_yes") {
          outcome = "approved";
          actionLabel = "FLIGHT CONFIRMED (FLEW)";
          const b = a.entityId ? bookingsById.get(a.entityId) : undefined;
          const student = b?.studentId ? usersById.get(b.studentId) : undefined;
          targetName = student ? `${student.name} (${b?.id ?? "Booking"})` : b?.id ?? "Flight Booking";
        } else if (a.action === "post_flight_confirmed_no") {
          outcome = "declined";
          actionLabel = "FLIGHT CANCELLED (DNF)";
          const b = a.entityId ? bookingsById.get(a.entityId) : undefined;
          const student = b?.studentId ? usersById.get(b.studentId) : undefined;
          targetName = student ? `${student.name} (${b?.id ?? "Booking"})` : b?.id ?? "Flight Booking";
        } else if (a.action === "booking_requested") {
          const b = a.entityId ? bookingsById.get(a.entityId) : undefined;
          const student = b?.studentId ? usersById.get(b.studentId) : undefined;
          targetName = student
            ? `${student.name} (${b?.id ?? "Booking"})`
            : (b?.id ?? a.entityId ?? "Flight Booking");
          outcome =
            b?.approvalStatus === "approved"
              ? "approved"
              : b?.approvalStatus === "declined"
                ? "declined"
                : "pending";
          actionLabel = "FLIGHT BOOKING REQUESTED";
        } else if (a.action === "booking_approved") {
          outcome = "approved";
          actionLabel = "BOOKING APPROVED";
          const b = a.entityId ? bookingsById.get(a.entityId) : undefined;
          const student = b?.studentId ? usersById.get(b.studentId) : undefined;
          targetName = student ? `${student.name} (${b?.id ?? "Booking"})` : b?.id ?? "Flight Booking";
        } else if (a.action === "booking_declined") {
          outcome = "declined";
          actionLabel = "BOOKING DECLINED";
        } else if (a.action === "flight_submitted") {
          const fl = a.entityId ? flightsById.get(a.entityId) : undefined;
          const pilot = fl?.pilotId ? usersById.get(fl.pilotId) : undefined;
          targetName = pilot ? `${pilot.name} (Flight Log)` : (a.entityId ?? "Flight Log");
          outcome =
            fl?.verificationStatus === "verified"
              ? "approved"
              : fl?.verificationStatus === "rejected"
                ? "declined"
                : "pending";
          actionLabel = "FLIGHT LOG SUBMITTED";
        } else if (a.action === "flight_verified") {
          outcome = "approved";
          actionLabel = "LOGBOOK ENTRY VERIFIED";
          const fl = a.entityId ? flightsById.get(a.entityId) : undefined;
          const pilot = fl?.pilotId ? usersById.get(fl.pilotId) : undefined;
          targetName = pilot ? `${pilot.name} (Flight Log)` : "Flight Log";
        } else if (a.action === "flight_rejected") {
          outcome = "declined";
          actionLabel = "LOGBOOK ENTRY REJECTED";
        } else if (a.action.includes("approved")) {
          outcome = "approved";
          actionLabel = "REQUEST APPROVED";
        } else if (a.action.includes("declined")) {
          outcome = "declined";
          actionLabel = "REQUEST DECLINED";
        }
      } else if (a.action.includes("profile_request") || a.action.includes("course_")) {
        category = "profile";
        if (a.action.includes("approved") || a.action === "course_assigned") {
          outcome = "approved";
          actionLabel = a.action === "course_assigned" ? "COURSE ASSIGNED" : "PROFILE CHANGE APPROVED";
        } else if (a.action.includes("declined") || a.action === "course_unassigned") {
          outcome = "declined";
          actionLabel = a.action === "course_unassigned" ? "COURSE REMOVED" : "PROFILE CHANGE DECLINED";
        }
      }

      const actorUser = a.actorId ? usersById.get(a.actorId) : undefined;
      const actorName =
        a.actorName ||
        actorUser?.name ||
        (a.actorId === "u-admin" ? "System Administrator" : "System / Dispatch");

      return {
        id: a.id,
        timestamp: a.at,
        category,
        action: a.action,
        actionLabel,
        outcome,
        actorId: a.actorId,
        actorName,
        actorRole: actorUser?.role,
        targetId: a.entityId,
        targetName,
        targetDetails,
        rawItem: a,
      };
    })
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export function ApprovalAuditTrail({
  data,
  currentUser,
  initialCategory = "all",
  className = "",
}: ApprovalAuditTrailProps) {
  const [categoryFilter, setCategoryFilter] = useState<AuditCategoryFilter>(initialCategory);
  const [outcomeFilter, setOutcomeFilter] = useState<AuditOutcomeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const normalizedRecords = useMemo(() => normalizeAuditActivities(data), [data]);

  const filteredRecords = useMemo(() => {
    return normalizedRecords.filter((record) => {
      // Category filter
      if (categoryFilter !== "all" && record.category !== categoryFilter) {
        return false;
      }

      // Outcome filter
      if (outcomeFilter !== "all") {
        if (outcomeFilter === "approved" && record.outcome !== "approved") return false;
        if (outcomeFilter === "declined" && record.outcome !== "declined") return false;
        if (outcomeFilter === "other" && (record.outcome === "approved" || record.outcome === "declined"))
          return false;
      }

      // Search query (matches action, actor, target, or details)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          record.actionLabel.toLowerCase().includes(q) ||
          record.actorName.toLowerCase().includes(q) ||
          record.targetName.toLowerCase().includes(q) ||
          record.targetDetails.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      return sortOrder === "desc"
        ? b.timestamp.localeCompare(a.timestamp)
        : a.timestamp.localeCompare(b.timestamp);
    });
  }, [normalizedRecords, categoryFilter, outcomeFilter, searchQuery, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    const total = normalizedRecords.length;
    const approved = normalizedRecords.filter((r) => r.outcome === "approved").length;
    const declined = normalizedRecords.filter((r) => r.outcome === "declined").length;
    const accounts = normalizedRecords.filter((r) => r.category === "account").length;
    const flights = normalizedRecords.filter((r) => r.category === "flight").length;
    return { total, approved, declined, accounts, flights };
  }, [normalizedRecords]);

  const exportAuditCsv = () => {
    if (filteredRecords.length === 0) {
      toast.info("No audit trail records to export.");
      return;
    }
    const header = ["Timestamp (UTC)", "Category", "Action", "Outcome", "Reviewer / Actor", "Target Entity", "Audit Log Details"];
    const rows = filteredRecords.map((r) => [
      `"${r.timestamp}"`,
      `"${r.category}"`,
      `"${r.actionLabel}"`,
      `"${r.outcome.toUpperCase()}"`,
      `"${r.actorName}"`,
      `"${r.targetName.replace(/"/g, '""')}"`,
      `"${r.targetDetails.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [header.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `silverarrows_approvals_audit_trail_${format(new Date(), "yyyyMMdd_HHmm")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredRecords.length} audit records to CSV.`);
  };

  return (
    <div
      data-testid="approval-audit-trail-container"
      className={`space-y-4 rounded-3xl border border-border/80 bg-card/85 p-5 shadow-sm backdrop-blur-xl sm:p-6 ${className}`}
    >
      {/* Header & Metric Summary */}
      <div className="flex flex-col gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              Approvals &amp; Decisions Audit Trail
            </h2>
            <Badge variant="outline" className="font-mono text-[11px]">
              {filteredRecords.length} / {stats.total} Records
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Chronological regulatory history of account registrations, login approvals, flight verifications, and CFI reviews.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={exportAuditCsv}
            className="gap-1.5 text-xs font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-border/60 bg-background/50 p-3">
          <span className="text-[10.5px] font-bold text-muted-foreground uppercase font-mono">
            Total Audit Entries
          </span>
          <div className="mt-1 font-mono text-xl font-black text-foreground">{stats.total}</div>
        </div>
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3">
          <span className="text-[10.5px] font-bold text-emerald-700 dark:text-emerald-300 uppercase font-mono">
            Total Approved
          </span>
          <div className="mt-1 font-mono text-xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.approved}
          </div>
        </div>
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3">
          <span className="text-[10.5px] font-bold text-rose-700 dark:text-rose-300 uppercase font-mono">
            Total Declined
          </span>
          <div className="mt-1 font-mono text-xl font-black text-rose-600 dark:text-rose-400">
            {stats.declined}
          </div>
        </div>
        <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-3">
          <span className="text-[10.5px] font-bold text-sky-700 dark:text-sky-300 uppercase font-mono">
            Flights &amp; Logs
          </span>
          <div className="mt-1 font-mono text-xl font-black text-sky-600 dark:text-sky-400">
            {stats.flights}
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCategoryFilter("all")}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
              categoryFilter === "all"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <span>All Categories</span>
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter("accounts")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
              categoryFilter === "accounts"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Users className="h-3 w-3" />
            <span>Accounts ({stats.accounts})</span>
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter("flights")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
              categoryFilter === "flights"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Plane className="h-3 w-3" />
            <span>Flights ({stats.flights})</span>
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter("profiles")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
              categoryFilter === "profiles"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <UserCheck className="h-3 w-3" />
            <span>Profiles &amp; Courses</span>
          </button>
        </div>

        {/* Search & Outcome Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1 sm:w-64">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search reviewer, cadet, action…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs bg-background/90"
            />
          </div>

          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value as AuditOutcomeFilter)}
            className="h-8 rounded-md border border-input bg-background/90 px-2 py-1 text-xs text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-32"
          >
            <option value="all">All Outcomes</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
            <option value="other">Pending / Info</option>
          </select>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))}
            title={sortOrder === "desc" ? "Latest First" : "Oldest First"}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
            <span className="text-[11px] font-mono">{sortOrder.toUpperCase()}</span>
          </Button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-background/70 shadow-xs">
        {filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-xs text-muted-foreground">
            <Info className="h-8 w-8 mb-2 opacity-40 text-muted-foreground" />
            <p className="font-semibold text-foreground">No matching audit records found</p>
            <p className="mt-1">Try adjusting your category, outcome filter, or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/80 bg-muted/40 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  <TableHead className="w-[170px]">Timestamp &amp; Time</TableHead>
                  <TableHead className="w-[190px]">Action &amp; Outcome</TableHead>
                  <TableHead className="w-[180px]">Reviewer / Actor</TableHead>
                  <TableHead className="w-[200px]">Target Entity</TableHead>
                  <TableHead>Audit Log Details &amp; Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => {
                  const dateObj = new Date(record.timestamp);
                  const formattedExact = isNaN(dateObj.getTime())
                    ? record.timestamp
                    : format(dateObj, "dd MMM yyyy, HH:mm");
                  const formattedRel = isNaN(dateObj.getTime())
                    ? ""
                    : formatDistanceToNow(dateObj, { addSuffix: true });

                  return (
                    <TableRow
                      key={record.id}
                      className="border-border/60 text-xs hover:bg-muted/30 transition-colors"
                    >
                      {/* Timestamp */}
                      <TableCell className="align-top py-3 font-mono">
                        <div className="font-bold text-foreground text-[11px] whitespace-nowrap">
                          {formattedExact}
                        </div>
                        <div className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {formattedRel}
                        </div>
                      </TableCell>

                      {/* Action & Decision Outcome */}
                      <TableCell className="align-top py-3">
                        <div className="space-y-1">
                          {record.outcome === "approved" ? (
                            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 font-mono">
                              <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
                              <span>{record.actionLabel}</span>
                            </span>
                          ) : record.outcome === "declined" ? (
                            <span className="inline-flex items-center gap-1 rounded-md border border-rose-500/40 bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-300 font-mono">
                              <XCircle className="h-3 w-3 shrink-0 text-rose-600 dark:text-rose-400" />
                              <span>{record.actionLabel}</span>
                            </span>
                          ) : record.outcome === "pending" ? (
                            <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 font-mono">
                              <Clock className="h-3 w-3 shrink-0 text-amber-600 dark:text-amber-400" />
                              <span>{record.actionLabel}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md border border-slate-500/40 bg-slate-500/15 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300 font-mono">
                              <Info className="h-3 w-3 shrink-0 text-slate-600 dark:text-slate-400" />
                              <span>{record.actionLabel}</span>
                            </span>
                          )}
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                            Category: {record.category}
                          </div>
                        </div>
                      </TableCell>

                      {/* Reviewer / Actor */}
                      <TableCell className="align-top py-3">
                        <div className="font-bold text-foreground">{record.actorName}</div>
                        <div className="text-[10px] font-mono text-muted-foreground">
                          {record.actorId === "u-admin"
                            ? "admin@flysilverarrows.com"
                            : record.actorRole
                              ? `Role: ${record.actorRole}`
                              : "Authorized System Actor"}
                        </div>
                      </TableCell>

                      {/* Target Entity */}
                      <TableCell className="align-top py-3">
                        <div className="font-semibold text-foreground">{record.targetName}</div>
                        {record.targetId && (
                          <div className="text-[10px] font-mono text-muted-foreground">
                            ID: {record.targetId}
                          </div>
                        )}
                      </TableCell>

                      {/* Log Details & Notes */}
                      <TableCell className="align-top py-3">
                        <div className="text-xs leading-relaxed text-foreground font-sans">
                          {record.targetDetails}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
