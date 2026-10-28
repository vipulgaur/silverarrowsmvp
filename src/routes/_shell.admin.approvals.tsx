import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Bell,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Info,
  Plane,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Chip, PageHeader, Section, Stat } from "@/components/app-ui";
import { useLookup, useMe } from "@/lib/store";
import { BookingApprovals } from "@/components/booking-approvals";
import { ProfileRequests } from "@/components/profile-requests";
import {
  getPostFlightDueBookings,
  PostFlightCompletionDialog,
  PostFlightVerificationBanner,
  type PostFlightDialogState,
} from "@/components/post-flight-prompt";
import {
  approveUserLogin,
  bookingPending,
  declineUserLogin,
  fmtDec,
  isUserPendingApproval,
  memberNotifications,
  reviewRequest,
  verifyFlightLog,
} from "@/lib/logic";
import { reasonLabel, roleLabel } from "@/lib/types";

export const Route = createFileRoute("/_shell/admin/approvals")({
  head: () => ({
    meta: [
      { title: "Approvals & Notifications Center — SilverArrows" },
      {
        name: "description",
        content:
          "Dedicated Administrator Approvals & Notifications tracking center with filtration tabs for {flights}, {accounts}, and {profiles}.",
      },
    ],
  }),
  component: AdminApprovalsPage,
});

function AdminApprovalsPage() {
  const { data, me, commit, log } = useMe();
  const lk = useLookup();
  const [activeTab, setActiveTab] = useState<"all" | "flights" | "accounts" | "profiles">("all");
  const [postFlightDialogState, setPostFlightDialogState] =
    useState<PostFlightDialogState | null>(null);

  if (!me) return null;

  const allNotifs = memberNotifications(data, me);

  // 1. {accounts} — Account based approvals & notifications
  const pendingAccounts = data.users.filter(
    (u) => u.status !== "deleted" && isUserPendingApproval(u),
  );
  const accountActivities = data.activity.filter((a) =>
    [
      "account_registration_requested",
      "user_login_approved",
      "user_login_declined",
      "user_created",
    ].includes(a.action),
  );
  const accountNotifs = allNotifs.filter((n) => n.category === "account");

  // 2. {flights} — Flight happen & flight booking/log/reschedule approvals
  const postFlightDue = getPostFlightDueBookings(data);
  const pendingBookings = data.bookings.filter(bookingPending);
  const pendingFlightLogs = data.flights.filter((f) => f.verificationStatus === "pending");
  const pendingReschedules = data.requests.filter((r) => r.status === "pending");
  const flightActivities = data.activity.filter((a) =>
    [
      "post_flight_confirmed_yes",
      "post_flight_confirmed_no",
      "flight_logged",
      "flight_verified",
      "flight_rejected",
      "booking_approved",
      "booking_declined",
      "reschedule_approved_override",
      "reschedule_declined_override",
    ].includes(a.action),
  );
  const flightNotifs = allNotifs.filter(
    (n) => n.category === "flight" || n.category === "booking",
  );

  // 3. {profiles} — Profile change approvals & safety/ops notifications
  const pendingProfileReqs = data.profileRequests.filter((r) => r.status === "pending");
  const profileAndOpsNotifs = allNotifs.filter(
    (n) => n.category === "profile" || n.category === "safety" || n.category === "course",
  );

  const flightsPendingTotal =
    postFlightDue.length +
    pendingBookings.length +
    pendingFlightLogs.length +
    pendingReschedules.length;
  const accountsPendingTotal = pendingAccounts.length;
  const profilesPendingTotal = pendingProfileReqs.length;
  const totalPendingApprovals =
    flightsPendingTotal + accountsPendingTotal + profilesPendingTotal;

  function approveAccount(uid: string) {
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

  function declineAccount(uid: string) {
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

  function handleVerifyFlight(flightId: string, decision: "verified" | "rejected") {
    const fl = data.flights.find((f) => f.id === flightId);
    if (!fl) return;
    const student = lk.user(fl.pilotId);
    const err = commit(
      verifyFlightLog(
        data,
        flightId,
        me,
        decision,
        decision === "verified"
          ? "Verified & approved by Administrator"
          : "Rejected by Administrator",
      ),
    );
    if (err) return void toast.error(err);
    log(
      decision === "verified" ? "flight_verified" : "flight_rejected",
      "flight",
      `${decision === "verified" ? "Approved & verified" : "Rejected"} flight log for ${student?.name ?? "Student"} on ${fl.date} (${fmtDec(fl.minutes)} h)`,
      flightId,
    );
    toast.success(
      decision === "verified"
        ? `Flight log approved for ${student?.name ?? "student"} — student notified!`
        : `Flight log rejected for ${student?.name ?? "student"}.`,
    );
  }

  function handleRescheduleOverride(id: string, decision: "approved" | "declined") {
    const r = data.requests.find((x) => x.id === id);
    if (!r) return;
    const err = commit(reviewRequest(data, id, me, decision, "Administrator review"));
    if (err) return void toast.error(err);
    log(
      `reschedule_${decision}_override`,
      "booking",
      `Administrator ${decision} schedule change ${r.id} for ${lk.user(r.studentId)?.name ?? "Student"}`,
      r.bookingId,
    );
    toast.success(`Schedule request ${decision}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          to="/portal/admin"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin Hub
        </Link>
        <div className="flex items-center gap-2">
          <Chip tone={totalPendingApprovals > 0 ? "soon" : "ok"}>
            {totalPendingApprovals} Pending Action{totalPendingApprovals === 1 ? "" : "s"}
          </Chip>
          <Chip variant="info">{allNotifs.length} Active Notifications</Chip>
        </div>
      </div>

      <PageHeader
        title="Approvals & Notifications Center"
        subtitle="Centralized Administrator command console to track, filter, and approve {flights}, {accounts}, and {profiles} notifications in real time."
      />

      {/* Summary KPI Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total Pending Approvals"
          value={totalPendingApprovals}
          sub={`${allNotifs.length} total bell notifications`}
          tone={totalPendingApprovals > 0 ? "warn" : "good"}
        />
        <Stat
          label="{flights} Flight Approvals"
          value={flightsPendingTotal}
          sub={`${postFlightDue.length} post-flight · ${pendingBookings.length} bookings · ${pendingFlightLogs.length} logs`}
          tone={flightsPendingTotal > 0 ? "warn" : "default"}
        />
        <Stat
          label="{accounts} Account Approvals"
          value={accountsPendingTotal}
          sub={
            accountsPendingTotal > 0
              ? `${accountsPendingTotal} new registration(s) awaiting login unlock`
              : "All registered accounts reviewed"
          }
          tone={accountsPendingTotal > 0 ? "bad" : "good"}
        />
        <Stat
          label="{profiles} Profile & Ops"
          value={profilesPendingTotal}
          sub={`${pendingProfileReqs.length} profile edit request(s)`}
          tone={profilesPendingTotal > 0 ? "warn" : "default"}
        />
      </div>

      {/* Filtration Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className="space-y-6"
      >
        <TabsList
          data-testid="approvals-filter-tabs"
          className="flex flex-wrap h-auto gap-1.5 p-1.5 bg-muted/70 rounded-2xl border border-border"
        >
          <TabsTrigger
            value="all"
            data-testid="tab-approvals-all"
            className="gap-2 text-xs font-bold px-3.5 py-2 rounded-xl"
          >
            <Bell className="h-3.5 w-3.5" />
            <span>All Approvals &amp; Notifications</span>
            <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] text-primary">
              {totalPendingApprovals}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="flights"
            data-testid="tab-approvals-flights"
            className="gap-2 text-xs font-bold px-3.5 py-2 rounded-xl"
          >
            <Plane className="h-3.5 w-3.5" />
            <span>&#123;flights&#125; — Flight Happened &amp; Bookings</span>
            <span className="rounded-full bg-sky-500/15 px-2 py-0.5 font-mono text-[10px] text-sky-600 dark:text-sky-400">
              {flightsPendingTotal}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="accounts"
            data-testid="tab-approvals-accounts"
            className="gap-2 text-xs font-bold px-3.5 py-2 rounded-xl"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>&#123;accounts&#125; — New Account Approvals</span>
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] text-amber-600 dark:text-amber-400">
              {accountsPendingTotal}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="profiles"
            data-testid="tab-approvals-profiles"
            className="gap-2 text-xs font-bold px-3.5 py-2 rounded-xl"
          >
            <ClipboardCheck className="h-3.5 w-3.5" />
            <span>&#123;profiles&#125; — Profile &amp; Safety</span>
            <span className="rounded-full bg-purple-500/15 px-2 py-0.5 font-mono text-[10px] text-purple-600 dark:text-purple-400">
              {profilesPendingTotal}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* ════════════════════ TAB 1: ALL APPROVALS & NOTIFICATIONS ════════════════════ */}
        <TabsContent value="all" className="space-y-6">
          {/* Account Login Approvals */}
          <Section
            title={`{accounts} Pending Account Login Approvals (${pendingAccounts.length})`}
            description="New accounts created from the Registration page. Users cannot access the portal until approved here."
            className={
              pendingAccounts.length > 0 ? "border-amber-500/40 bg-amber-500/5" : undefined
            }
          >
            {pendingAccounts.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">
                No new account registrations are currently awaiting Administrator approval.
              </p>
            ) : (
              <div className="space-y-2.5">
                {pendingAccounts.map((u) => (
                  <div
                    key={u.id}
                    data-testid={`pending-account-card-${u.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/35 bg-card p-3.5 text-sm shadow-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-foreground">{u.name}</span>
                        <Chip tone="soon">Pending Login Approval</Chip>
                        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                          {roleLabel[u.role]}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Email ID: <strong className="text-foreground font-mono">{u.email}</strong>
                        {u.phone ? (
                          <>
                            {" "}
                            · Mobile: <strong className="text-foreground font-mono">{u.phone}</strong>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => approveAccount(u.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <CheckCircle2 className="mr-1.5 h-4 w-4" />
                        Approve Login
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => declineAccount(u.id)}
                        className="text-destructive border-destructive/40 hover:bg-destructive/10"
                      >
                        <XCircle className="mr-1.5 h-4 w-4" />
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Post-Flight Verification ("Did the flight happen?") */}
          <PostFlightVerificationBanner
            data={data}
            onSelectAction={(booking, decision) =>
              setPostFlightDialogState({ booking, initialDecision: decision })
            }
          />

          {/* Student Flight Booking Approvals */}
          <BookingApprovals />

          {/* Student Flight Log Verifications */}
          {pendingFlightLogs.length > 0 && (
            <Section
              title={`{flights} Student Flight Logs Awaiting Verification (${pendingFlightLogs.length})`}
              description="Approve student-submitted flight logs to credit their official logbook and send an instant notification to the student."
            >
              <div className="space-y-2.5">
                {pendingFlightLogs.map((f) => {
                  const student = lk.user(f.pilotId);
                  const ac = lk.aircraft(f.aircraftId);
                  return (
                    <div
                      key={f.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">
                            {student?.name ?? "Student"}
                          </span>
                          <Chip tone="soon">Awaiting Verification</Chip>
                          <span className="font-mono text-muted-foreground">{f.date}</span>
                        </div>
                        <div className="text-muted-foreground">
                          Aircraft: <strong className="text-foreground">{ac?.reg ?? f.aircraftId}</strong> ·
                          Route:{" "}
                          <strong className="text-foreground">
                            {f.fromIcao} → {f.toIcao}
                          </strong>{" "}
                          · Duration: <strong className="text-foreground">{fmtDec(f.minutes)} h</strong> ·
                          Landings: <strong className="text-foreground">{f.landings}</strong>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleVerifyFlight(f.id, "verified")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                          Approve Flight Log
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVerifyFlight(f.id, "rejected")}
                          className="text-destructive border-destructive/40"
                        >
                          <XCircle className="mr-1.5 h-3.5 w-3.5" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* Profile Change Approvals */}
          <ProfileRequests review />
        </TabsContent>

        {/* ════════════════════ TAB 2: {FLIGHTS} — FLIGHT HAPPENED & FLIGHT APPROVALS ════════════════════ */}
        <TabsContent value="flights" className="space-y-6">
          <Section
            title={`1. Did the Flight Happen? — Post-Flight Confirmation (${postFlightDue.length})`}
            description="Confirm whether scheduled flights took place. Approving a flight logs the hours into the student's logbook and sends an immediate notification to the student."
          >
            {postFlightDue.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">
                All completed booking slots have been verified. No post-flight confirmations are due right now.
              </p>
            ) : (
              <div className="space-y-3">
                {postFlightDue.map((b) => {
                  const student = lk.user(b.studentId);
                  const instructor = lk.user(b.instructorId);
                  const ac = lk.aircraft(b.aircraftId);
                  return (
                    <div
                      key={b.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">
                            Did the flight happen? — {student?.name ?? "Student"}
                          </span>
                          <Chip tone="soon">Action Required</Chip>
                        </div>
                        <div className="text-muted-foreground">
                          Booking <strong className="font-mono text-foreground">{b.id}</strong> ·
                          Aircraft: <strong className="text-foreground">{ac?.reg ?? b.aircraftId}</strong> ·
                          CFI: <strong className="text-foreground">{instructor?.name ?? "Solo"}</strong> ·
                          Slot:{" "}
                          <strong className="text-foreground">
                            {format(new Date(b.start), "dd MMM yyyy HH:mm")}–
                            {format(new Date(b.end), "HH:mm")}
                          </strong>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() =>
                            setPostFlightDialogState({ booking: b, initialDecision: "yes" })
                          }
                        >
                          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                          Yes, {student?.name?.split(" ")[0] ?? "Student"} Flew
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive border-destructive/40"
                          onClick={() =>
                            setPostFlightDialogState({ booking: b, initialDecision: "no" })
                          }
                        >
                          <XCircle className="mr-1.5 h-3.5 w-3.5" />
                          No, Did Not Fly
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>

          {/* Student Flight Booking Approvals */}
          <BookingApprovals />

          {/* Student Flight Log Verifications */}
          <Section
            title={`2. Student Flight Log Verification Requests (${pendingFlightLogs.length})`}
            description="Student-logged flights awaiting Administrator or CFI verification."
          >
            {pendingFlightLogs.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">
                No student flight logs are currently awaiting verification.
              </p>
            ) : (
              <div className="space-y-2.5">
                {pendingFlightLogs.map((f) => {
                  const student = lk.user(f.pilotId);
                  const ac = lk.aircraft(f.aircraftId);
                  return (
                    <div
                      key={f.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">
                            {student?.name ?? "Student"}
                          </span>
                          <Chip tone="soon">Pending Verification</Chip>
                          <span className="font-mono text-muted-foreground">{f.date}</span>
                        </div>
                        <div className="text-muted-foreground">
                          Aircraft: <strong className="text-foreground">{ac?.reg ?? f.aircraftId}</strong> ·
                          Route:{" "}
                          <strong className="text-foreground">
                            {f.fromIcao} → {f.toIcao}
                          </strong>{" "}
                          · Duration: <strong className="text-foreground">{fmtDec(f.minutes)} h</strong>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleVerifyFlight(f.id, "verified")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                          Approve Flight Log
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVerifyFlight(f.id, "rejected")}
                          className="text-destructive border-destructive/40"
                        >
                          <XCircle className="mr-1.5 h-3.5 w-3.5" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>

          {/* Pending Schedule / Reschedule Requests */}
          <Section
            title={`3. Schedule & Slot Change Requests (${pendingReschedules.length})`}
            description="Student reschedule or slot change requests awaiting approval."
          >
            {pendingReschedules.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">
                No pending schedule change requests.
              </p>
            ) : (
              <div className="space-y-2.5">
                {pendingReschedules.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-sm text-foreground">
                        {lk.user(r.studentId)?.name ?? "Student"} · Booking {r.bookingId}
                      </div>
                      <div className="text-muted-foreground">
                        Reason: {reasonLabel[r.reason]} · &ldquo;{r.details}&rdquo; → Proposed{" "}
                        {format(new Date(r.proposedStart), "dd MMM HH:mm")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => handleRescheduleOverride(r.id, "approved")}>
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRescheduleOverride(r.id, "declined")}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Flight Notification & Approval History */}
          <Section
            title={`4. Flight Notifications & Approval History (${flightActivities.length + flightNotifs.length})`}
            description="Real-time log of flight approvals, post-flight confirmations, and student flight notifications."
          >
            {flightActivities.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">No flight approval history yet.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {flightActivities.slice(0, 25).map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-border/80 bg-card/60 p-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase font-bold text-primary">
                          {a.action.replace(/_/g, " ")}
                        </span>
                        <span className="text-muted-foreground">by {a.actorName}</span>
                      </div>
                      <p className="text-foreground">{a.details}</p>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                      {format(new Date(a.at), "dd MMM HH:mm")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </TabsContent>

        {/* ════════════════════ TAB 3: {ACCOUNTS} — NEW ACCOUNT APPROVALS & TRACKING ════════════════════ */}
        <TabsContent value="accounts" className="space-y-6">
          <Section
            title={`1. New Account Creation & Login Approval Requests (${pendingAccounts.length})`}
            description="Every new user who registers from the Login page appears here and in the Bell notification menu. They cannot sign in until you approve their account."
            className={
              pendingAccounts.length > 0 ? "border-amber-500/40 bg-amber-500/5" : undefined
            }
          >
            {pendingAccounts.length === 0 ? (
              <p className="text-xs text-muted-foreground py-3">
                No pending account registrations right now. New registrations from /login will appear here automatically.
              </p>
            ) : (
              <div className="space-y-3">
                {pendingAccounts.map((u) => (
                  <div
                    key={u.id}
                    data-testid={`accounts-tab-pending-${u.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/40 bg-card p-4 text-sm shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-foreground">{u.name}</span>
                        <Chip tone="soon">Awaiting Admin Login Approval</Chip>
                        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                          {roleLabel[u.role]}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Email ID: <strong className="text-foreground font-mono">{u.email}</strong>
                        {u.phone ? (
                          <>
                            {" "}
                            · Mobile: <strong className="text-foreground font-mono">{u.phone}</strong>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => approveAccount(u.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <CheckCircle2 className="mr-1.5 h-4 w-4" />
                        Approve Login Access
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => declineAccount(u.id)}
                        className="text-destructive border-destructive/40 hover:bg-destructive/10"
                      >
                        <XCircle className="mr-1.5 h-4 w-4" />
                        Decline Account
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section
            title="2. Academy Account Directory & Approval Status"
            description="Complete status of all academy accounts (Approved & Active vs. Pending Approval vs. Declined/Archived)."
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member Name</TableHead>
                  <TableHead>Email ID (@flysilverarrows.com)</TableHead>
                  <TableHead>Mobile (with ISD)</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Approval Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.users.map((u) => {
                  const isPending = u.status !== "deleted" && isUserPendingApproval(u);
                  const isDeleted = u.status === "deleted";
                  return (
                    <TableRow key={u.id}>
                      <TableCell className="font-semibold text-xs">{u.name}</TableCell>
                      <TableCell className="font-mono text-xs">{u.email}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {u.phone ?? "—"}
                      </TableCell>
                      <TableCell className="text-xs">{roleLabel[u.role]}</TableCell>
                      <TableCell>
                        {isDeleted ? (
                          <Chip tone="expired">Declined / Archived</Chip>
                        ) : isPending ? (
                          <Chip tone="soon">Pending Admin Approval</Chip>
                        ) : (
                          <Chip tone="ok">Approved &amp; Active</Chip>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {isPending ? (
                          <div className="inline-flex items-center gap-1.5">
                            <Button
                              size="sm"
                              className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() => approveAccount(u.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2.5 text-xs text-destructive"
                              onClick={() => declineAccount(u.id)}
                            >
                              Decline
                            </Button>
                          </div>
                        ) : (
                          <Link
                            to="/people/$id"
                            params={{ id: u.id }}
                            className="text-xs font-medium text-primary hover:underline"
                          >
                            View profile →
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Section>

          <Section
            title={`3. Account Registration & Approval Audit Trail (${accountActivities.length + accountNotifs.length})`}
            description="Chronological record of account creations, login approvals, and declines."
          >
            {accountActivities.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">
                No account approval audit entries recorded yet.
              </p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {accountActivities.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-border/80 bg-card/60 p-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase font-bold text-primary">
                          {a.action.replace(/_/g, " ")}
                        </span>
                        <span className="text-muted-foreground">by {a.actorName}</span>
                      </div>
                      <p className="text-foreground">{a.details}</p>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                      {format(new Date(a.at), "dd MMM HH:mm")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </TabsContent>

        {/* ════════════════════ TAB 4: {PROFILES} — PROFILE & OPERATIONS APPROVALS ════════════════════ */}
        <TabsContent value="profiles" className="space-y-6">
          <ProfileRequests review />

          <Section
            title={`Profile, Regulatory & Operations Notifications (${profileAndOpsNotifs.length})`}
            description="Medical expiry alerts, aircraft maintenance grounding alerts, and profile update notifications."
          >
            {profileAndOpsNotifs.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">
                No profile or safety notifications at this time.
              </p>
            ) : (
              <div className="space-y-2">
                {profileAndOpsNotifs.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-3.5 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {n.priority === "critical" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-[9px] font-black text-red-500 uppercase font-mono">
                            <AlertTriangle className="h-2.5 w-2.5" /> CRITICAL
                          </span>
                        ) : n.priority === "medium" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[9px] font-black text-amber-500 uppercase font-mono">
                            <AlertCircle className="h-2.5 w-2.5" /> MEDIUM
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/15 border border-slate-500/30 px-2 py-0.5 text-[9px] font-bold text-slate-400 uppercase font-mono">
                            <Info className="h-2.5 w-2.5" /> LOW
                          </span>
                        )}
                        <span className="font-bold text-foreground">{n.title}</span>
                      </div>
                      <p className="text-muted-foreground">{n.detail}</p>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                      {n.at ? format(new Date(n.at), "dd MMM HH:mm") : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </TabsContent>
      </Tabs>

      <PostFlightCompletionDialog
        state={postFlightDialogState}
        onClose={() => setPostFlightDialogState(null)}
        data={data}
        actor={me}
        commit={commit}
        log={log}
      />
    </div>
  );
}
