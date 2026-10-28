import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Compass,
  Database,
  Download,
  Eye,
  Info,
  LayoutDashboard,
  PlusSquare,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Users,
  Wrench,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Chip, NativeSelect, PageHeader, Section, Stat } from "@/components/app-ui";
import { useLookup, useMe } from "@/lib/store";
import { ProfileEditor } from "@/components/profile-editor";
import { ProfileRequests } from "@/components/profile-requests";
import { BookingApprovals } from "@/components/booking-approvals";
import { AssignedCoursesPanel } from "@/components/assigned-courses-panel";
import {
  getPostFlightDueBookings,
  PostFlightCompletionDialog,
  PostFlightVerificationBanner,
  type PostFlightDialogState,
} from "@/components/post-flight-prompt";
import {
  aircraftUnavailable,
  approveUserLogin,
  declineUserLogin,
  expiryState,
  isUserPendingApproval,
  memberNotifications,
  restoreUser,
  reviewRequest,
  softDeleteUser,
} from "@/lib/logic";
import { reasonLabel, roleLabel, type Role } from "@/lib/types";

export const Route = createFileRoute("/_shell/portal/admin")({
  head: () => ({
    meta: [
      { title: "Administrator master control — SilverArrows" },
      {
        name: "description",
        content:
          "Super-admin hub: portal switcher, live multi-role activity feed, user soft-deletion console and audit trail.",
      },
      { property: "og:title", content: "Administrator master control — SilverArrows" },
      {
        property: "og:description",
        content: "Super-admin hub with live activity feed, user console and audit trail.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPortal,
});

const quick = [
  { to: "/admin/approvals", label: "Approvals & notifications", icon: ShieldCheck },
  { to: "/admin/create", label: "Create entities", icon: PlusSquare },
  { to: "/portal/student", label: "Student view", icon: Eye },
  { to: "/portal/cfi", label: "CFI view", icon: Eye },
  { to: "/portal/ground", label: "Ground instructor view", icon: Eye },
  { to: "/dashboard", label: "Operations dashboard", icon: LayoutDashboard },
  { to: "/fleet", label: "Fleet maintenance", icon: Wrench },
  { to: "/schedule", label: "Bookings calendar", icon: CalendarDays },
  { to: "/admin/audit", label: "Full audit log", icon: ClipboardList },
  { to: "/database", label: "Database inspector", icon: Database },
  { to: "/atlas", label: "Aircraft Atlas (Cessna 172S)", icon: Compass },
] as const;

function AdminPortal() {
  const { data, me, commit, log } = useMe();
  const lk = useLookup();
  const [feedRole, setFeedRole] = useState<"" | Role>("");
  const [q, setQ] = useState("");
  const [roleF, setRoleF] = useState<"" | Role>("");
  const [adminNotifPriority, setAdminNotifPriority] = useState<"all" | "critical" | "medium" | "low">("all");
  const [postFlightDialogState, setPostFlightDialogState] = useState<PostFlightDialogState | null>(null);

  const allNotifs = memberNotifications(data, me);
  const criticalCount = allNotifs.filter((n) => n.priority === "critical").length;
  const mediumCount = allNotifs.filter((n) => n.priority === "medium").length;
  const lowCount = allNotifs.filter((n) => n.priority === "low").length;
  const filteredNotifs =
    adminNotifPriority === "all"
      ? allNotifs
      : allNotifs.filter((n) => n.priority === adminNotifPriority);

  if (!me) return null;

  const active = data.users.filter((u) => u.status !== "deleted");
  const pendingLoginUsers = active.filter((u) => isUserPendingApproval(u));
  const deleted = data.users.filter((u) => u.status === "deleted");
  const pending = data.requests.filter((r) => r.status === "pending");
  const feed = data.activity.filter((a) => !feedRole || a.actorRole === feedRole).slice(0, 12);
  const adminTrail = data.activity.filter((a) => a.actorRole === "admin").slice(0, 10);
  const filt = (list: typeof data.users) =>
    list.filter(
      (u) =>
        (!roleF || u.role === roleF) &&
        (!q || `${u.name} ${u.email} ${u.callsign ?? ""}`.toLowerCase().includes(q.toLowerCase())),
    );

  function approveLogin(uid: string) {
    const u = lk.user(uid);
    if (!u) return;
    const err = commit(approveUserLogin(data, uid, me));
    if (err) return void toast.error(err);
    log(
      "user_login_approved",
      "user",
      `Approved login access for ${u.name} (${u.email} · ${roleLabel[u.role]})`,
      uid,
    );
    toast.success(`Approved login access for ${u.name} — synced to database in real time!`);
  }
  function declineLogin(uid: string) {
    const u = lk.user(uid);
    if (!u) return;
    const err = commit(declineUserLogin(data, uid, me));
    if (err) return void toast.error(err);
    log(
      "user_login_declined",
      "user",
      `Declined login registration for ${u.name} (${u.email} · ${roleLabel[u.role]})`,
      uid,
    );
    toast.success(`Declined account registration for ${u.name} — permanently archived.`);
  }
  function del(uid: string) {
    const u = lk.user(uid)!;
    if (!confirm(`Soft-delete ${u.name}? Their records are kept and they can be restored.`)) return;
    const err = commit(softDeleteUser(data, uid, me));
    if (err) return void toast.error(err);
    log(
      "user_soft_deleted",
      "user",
      `Soft-deleted ${u.name} (${roleLabel[u.role]}); future bookings cancelled, history preserved`,
      uid,
    );
    toast.success(`${u.name} moved to archive`);
  }
  function restore(uid: string) {
    const u = lk.user(uid)!;
    const err = commit(restoreUser(data, uid, me));
    if (err) return void toast.error(err);
    log("user_restored", "user", `Restored ${u.name}`, uid);
    toast.success(`${u.name} restored`);
  }
  function override(id: string, decision: "approved" | "declined") {
    const r = data.requests.find((x) => x.id === id)!;
    const err = commit(reviewRequest(data, id, me, decision, "Administrator override"));
    if (err) return void toast.error(err);
    log(
      `reschedule_${decision}_override`,
      "booking",
      `Super-override: ${decision} ${r.id} for ${lk.user(r.studentId)?.name}`,
      r.bookingId,
    );
    toast.success(`Request ${decision}`);
  }

  const medChip = (d?: string) => {
    const e = expiryState(d);
    return (
      <Chip tone={e.state === "none" ? "none" : e.state}>
        {e.state === "none"
          ? "—"
          : e.state === "expired"
            ? "Expired"
            : e.state === "soon"
              ? "Expiring"
              : "Valid"}
      </Chip>
    );
  };

  return (
    <div>
      <PageHeader
        title="Administrator master control"
        subtitle={`${me.name} (${me.callsign ?? "—"}) · Super admin`}
      >
        <ProfileEditor person={me} />
      </PageHeader>
      <ProfileRequests review />
      <BookingApprovals />

      {pendingLoginUsers.length > 0 && (
        <Section
          title={`Pending Account Login Approvals (${pendingLoginUsers.length})`}
          description="New users who registered on the Login page. Approve their login access to immediately unlock their portal in real time."
          className="mb-4 border-amber-500/40 bg-amber-500/5"
        >
          <div className="space-y-2.5">
            {pendingLoginUsers.map((u) => (
              <div
                key={u.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/35 bg-card p-3.5 text-sm shadow-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{u.name}</span>
                    <Chip tone="soon">Pending Login Approval</Chip>
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      {roleLabel[u.role]}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Email: <strong className="text-foreground">{u.email}</strong>
                    {u.phone ? (
                      <>
                        {" "}
                        · Phone: <strong className="text-foreground">{u.phone}</strong>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => approveLogin(u.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <CheckCircle2 className="mr-1.5 h-4 w-4" />
                    Approve Login Access
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => declineLogin(u.id)}
                    className="border-destructive/40 text-destructive hover:bg-destructive/10"
                  >
                    <XCircle className="mr-1.5 h-4 w-4" />
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quick.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-center justify-between rounded-xl border bg-card p-4 sm:p-5 text-base font-semibold shadow-xs transition-all hover:border-primary hover:bg-accent/40 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-foreground transition-colors group-hover:text-primary">
                {label}
              </span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary group-hover:opacity-100" />
          </Link>
        ))}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-5">
        <Stat label="Active users" value={active.length} />
        <Stat label="Archived users" value={deleted.length} />
        <Stat label="Pending reschedules" value={pending.length} />
        <Stat
          label="Aircraft available"
          value={`${data.aircraft.filter((a) => !aircraftUnavailable(a, data.maintenance)).length}/${data.aircraft.length}`}
        />
        <Stat label="Audit entries" value={data.activity.length} />
      </div>

      {/* Priority Notifications & Operations Command Center */}
      <Section
        title={`Operations Command & Priority Notifications (${allNotifs.length})`}
        description="Real-time multi-stream operational alerts filtered by severity: critical safety/flight checks, medium booking updates, and low routine notifications."
        className="mt-4"
        action={
          <div className="flex items-center gap-1.5 rounded-xl bg-muted/60 p-1 text-xs">
            <button
              type="button"
              onClick={() => setAdminNotifPriority("all")}
              className={`rounded-lg px-2.5 py-1 font-medium transition cursor-pointer ${
                adminNotifPriority === "all"
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({allNotifs.length})
            </button>
            <button
              type="button"
              onClick={() => setAdminNotifPriority("critical")}
              className={`rounded-lg px-2.5 py-1 font-medium transition cursor-pointer flex items-center gap-1.5 ${
                adminNotifPriority === "critical"
                  ? "bg-red-500/20 text-red-500 border border-red-500/35 shadow-xs font-bold"
                  : "text-muted-foreground hover:text-red-500"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Critical ({criticalCount})
            </button>
            <button
              type="button"
              onClick={() => setAdminNotifPriority("medium")}
              className={`rounded-lg px-2.5 py-1 font-medium transition cursor-pointer flex items-center gap-1.5 ${
                adminNotifPriority === "medium"
                  ? "bg-amber-500/20 text-amber-500 border border-amber-500/35 shadow-xs font-bold"
                  : "text-muted-foreground hover:text-amber-500"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Medium ({mediumCount})
            </button>
            <button
              type="button"
              onClick={() => setAdminNotifPriority("low")}
              className={`rounded-lg px-2.5 py-1 font-medium transition cursor-pointer flex items-center gap-1.5 ${
                adminNotifPriority === "low"
                  ? "bg-slate-500/20 text-slate-300 border border-slate-500/35 shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              Low ({lowCount})
            </button>
          </div>
        }
      >
        {filteredNotifs.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No {adminNotifPriority !== "all" ? `${adminNotifPriority} priority` : ""} notifications at this time. All systems operational.
          </div>
        ) : (
          <div className="grid gap-2.5 md:grid-cols-2">
            {filteredNotifs.map((n) => {
              const booking = n.bookingId
                ? data.bookings.find((b) => b.id === n.bookingId)
                : undefined;
              return (
                <div
                  key={n.id}
                  className={`rounded-xl border p-3.5 transition-all text-xs flex flex-col justify-between gap-2.5 ${
                    n.priority === "critical"
                      ? "border-red-500/35 bg-red-500/5 hover:border-red-500/60"
                      : n.priority === "medium"
                        ? "border-amber-500/35 bg-amber-500/5 hover:border-amber-500/60"
                        : "border-border/70 bg-card hover:border-border"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {n.priority === "critical" ? (
                          <span className="flex items-center gap-1 rounded-md bg-red-500/20 border border-red-500/40 px-1.5 py-0.5 text-[10px] font-bold text-red-500 font-mono uppercase tracking-wider">
                            <AlertTriangle className="h-3 w-3" /> CRITICAL
                          </span>
                        ) : n.priority === "medium" ? (
                          <span className="flex items-center gap-1 rounded-md bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.5 text-[10px] font-bold text-amber-500 font-mono uppercase tracking-wider">
                            <AlertCircle className="h-3 w-3" /> MEDIUM
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 rounded-md bg-slate-500/20 border border-slate-500/40 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground font-mono uppercase tracking-wider">
                            <Info className="h-3 w-3" /> LOW
                          </span>
                        )}
                        <span className="font-semibold text-foreground text-xs">{n.title}</span>
                      </div>
                      <span className="num text-[11px] text-muted-foreground shrink-0">
                        {format(new Date(n.at), "dd.MM HH:mm")}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">{n.detail}</p>
                  </div>

                  {/* Contextual actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/50">
                    {booking && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Target Student: <strong>{data.users.find((u) => u.id === booking.studentId)?.name ?? "Student"}</strong> (exclusive logbook sync)
                      </span>
                    )}
                    <div className="flex items-center justify-end gap-2 ml-auto">
                      {booking && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => setPostFlightDialogState({ booking, decision: "yes" })}
                            className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white px-2.5"
                          >
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Yes, {data.users.find((u) => u.id === booking.studentId)?.name?.split(" ")[0] ?? "Student"} Flew
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPostFlightDialogState({ booking, decision: "no" })}
                            className="h-7 text-[11px] border-destructive/40 text-destructive hover:bg-destructive/10 px-2.5"
                          >
                            <XCircle className="mr-1 h-3 w-3" />
                            Did Not Fly
                          </Button>
                        </>
                      )}
                      {n.id.startsWith("accountapproval:") && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => approveLogin(n.id.replace("accountapproval:", ""))}
                            className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white px-2.5"
                          >
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Approve Login Access
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => declineLogin(n.id.replace("accountapproval:", ""))}
                            className="h-7 text-[11px] border-destructive/40 text-destructive hover:bg-destructive/10 px-2.5"
                          >
                            <XCircle className="mr-1 h-3 w-3" />
                            Decline
                          </Button>
                        </>
                      )}
                      {n.to && !booking && !n.id.startsWith("accountapproval:") && (
                        <Button asChild size="sm" variant="outline" className="h-7 text-[11px] px-2.5">
                          <Link to={n.to as never}>View Details →</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Section
          title="Real-time activity feed"
          action={
            <NativeSelect
              className="h-8 w-40"
              value={feedRole}
              onChange={(e) => setFeedRole(e.target.value as Role | "")}
              aria-label="Filter feed"
            >
              <option value="">All roles</option>
              {(Object.keys(roleLabel) as Role[]).map((r) => (
                <option key={r} value={r}>
                  {roleLabel[r]}
                </option>
              ))}
            </NativeSelect>
          }
        >
          <ul className="space-y-2">
            {feed.map((a) => (
              <li key={a.id} className="flex gap-3 text-sm">
                <span className="num w-24 shrink-0 text-xs text-muted-foreground">
                  {format(new Date(a.at), "dd.MM HH:mm")}
                </span>
                <span>
                  <span className="font-medium">
                    {roleLabel[a.actorRole].split(" ")[0]} {a.actorName}
                  </span>{" "}
                  — {a.details}
                </span>
              </li>
            ))}
            {feed.length === 0 && <li className="text-sm text-muted-foreground">No activity.</li>}
          </ul>
        </Section>
        <Section title={`Reschedule requests — super-override (${pending.length})`}>
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing pending.</p>
          ) : (
            pending.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 border-b py-3 text-sm last:border-0"
              >
                <div className="flex-1">
                  <div className="font-medium">
                    {lk.user(r.studentId)?.name} · {r.bookingId}
                  </div>
                  <div className="text-muted-foreground">
                    {reasonLabel[r.reason]} →{" "}
                    <span className="num">{format(new Date(r.proposedStart), "dd.MM HH:mm")}</span>{" "}
                    · CFI {lk.user(r.instructorId)?.name ?? "—"}
                  </div>
                </div>
                <Button size="sm" onClick={() => override(r.id, "approved")}>
                  Approve
                </Button>
                <Button size="sm" variant="outline" onClick={() => override(r.id, "declined")}>
                  Decline
                </Button>
              </div>
            ))
          )}
        </Section>
      </div>

      <Section title="User management, archive & post-flight verification" className="mt-4">
        <Tabs defaultValue="active">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <TabsList>
              <TabsTrigger value="active">
                <Users className="mr-1 h-3.5 w-3.5" /> Active ({active.length})
              </TabsTrigger>
              <TabsTrigger value="deleted">
                <Trash2 className="mr-1 h-3.5 w-3.5" /> Deleted archive ({deleted.length})
              </TabsTrigger>
              <TabsTrigger value="postflight">
                <CalendarDays className="mr-1 h-3.5 w-3.5" /> Post-Flight Verification (
                {getPostFlightDueBookings(data).length})
              </TabsTrigger>
            </TabsList>
            <Input
              className="w-56"
              placeholder="Search name, email, call sign"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <NativeSelect
              className="w-44"
              value={roleF}
              onChange={(e) => setRoleF(e.target.value as Role | "")}
              aria-label="Role filter"
            >
              <option value="">All roles</option>
              {(Object.keys(roleLabel) as Role[]).map((r) => (
                <option key={r} value={r}>
                  {roleLabel[r]}
                </option>
              ))}
            </NativeSelect>
          </div>
          <TabsContent value="postflight">
            <PostFlightVerificationBanner showEmptyState />
          </TabsContent>
          <TabsContent value="active">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Medical</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filt(active).map((u) => {
                  const profileLink =
                    u.role === "student"
                      ? { to: "/people/$id" as const, params: { id: u.id } }
                      : u.role === "instructor"
                        ? { to: "/portal/cfi" as const, search: { id: u.id } }
                        : u.role === "ground"
                          ? { to: "/portal/ground" as const, search: { id: u.id } }
                          : { to: "/profile" as const };
                  return (
                    <TableRow key={u.id}>
                      <TableCell>
                        <Link
                          to={profileLink.to}
                          params={"params" in profileLink ? profileLink.params : undefined}
                          search={
                            "search" in profileLink ? (profileLink.search as never) : undefined
                          }
                          className="font-semibold text-primary hover:underline"
                        >
                          {u.name}
                        </Link>{" "}
                        <span className="num text-xs text-muted-foreground">{u.callsign}</span>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </TableCell>
                      <TableCell>{roleLabel[u.role]}</TableCell>
                      <TableCell>{medChip(u.medicalExpiry)}</TableCell>
                      <TableCell>
                        {isUserPendingApproval(u) ? (
                          <Chip tone="soon">Pending Login Approval</Chip>
                        ) : (
                          <Chip tone="ok">Active</Chip>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          {isUserPendingApproval(u) && (
                            <Button
                              size="sm"
                              onClick={() => approveLogin(u.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Approve Login
                            </Button>
                          )}
                          <Button asChild size="sm" variant="outline">
                            <Link
                              to={profileLink.to}
                              params={"params" in profileLink ? profileLink.params : undefined}
                              search={
                                "search" in profileLink ? (profileLink.search as never) : undefined
                              }
                            >
                              <Eye className="mr-1 h-3.5 w-3.5" />{" "}
                              {u.role === "student" ? "Student Profile" : "View Portal"}
                            </Link>
                          </Button>
                          {u.role === "student" && (
                            <Button asChild size="sm" variant="ghost">
                              <Link to="/portal/student" search={{ id: u.id } as never}>
                                Student POV
                              </Link>
                            </Button>
                          )}
                          <ProfileEditor person={u} />
                          {u.id !== me.id && (
                            <Button size="sm" variant="outline" onClick={() => del(u.id)}>
                              <Trash2 className="h-3.5 w-3.5" /> Soft delete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="deleted">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Records kept</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filt(deleted).map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{roleLabel[u.role]}</TableCell>
                    <TableCell className="num text-xs">
                      {
                        data.flights.filter((f) => f.pilotId === u.id || f.instructorId === u.id)
                          .length
                      }{" "}
                      flights · {data.exams.filter((e) => e.studentId === u.id).length} exams
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      Deleted by Admin: {lk.user(u.deletedBy)?.name ?? "—"} on{" "}
                      <span className="num">
                        {u.deletedAt ? format(new Date(u.deletedAt), "dd.MM.yyyy HH:mm") : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => restore(u.id)}>
                        <RotateCcw className="h-3.5 w-3.5" /> Restore user
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filt(deleted).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                      Archive is empty.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </Section>

      <Section
        title="Administrator activity audit trail"
        className="mt-4"
        action={
          <Link to="/admin/audit" className="text-xs text-primary hover:underline">
            Full log →
          </Link>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminTrail.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="num text-xs">
                  {format(new Date(a.at), "dd.MM.yyyy HH:mm:ss")}
                </TableCell>
                <TableCell>{a.actorName}</TableCell>
                <TableCell className="num text-xs">{a.action}</TableCell>
                <TableCell className="text-xs capitalize">
                  {a.entityType}
                  {a.entityId ? ` #${a.entityId}` : ""}
                </TableCell>
                <TableCell className="text-sm">{a.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      {/* Admin Portal E-Learning Course Assignment & Management */}
      <AssignedCoursesPanel person={me} />

      <PostFlightCompletionDialog
        state={postFlightDialogState}
        onClose={() => setPostFlightDialogState(null)}
      />
    </div>
  );
}
