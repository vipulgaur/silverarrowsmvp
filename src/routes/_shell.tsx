import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ElementType } from "react";
import { toast } from "sonner";
import { playNotificationSound } from "@/lib/notification-sound";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Compass,
  Database,
  Download,
  FileCheck2,
  GraduationCap,
  Info,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Notebook,
  PlusSquare,
  RotateCcw,
  School,
  ShieldAlert,
  ShieldCheck,
  User as UserIcon,
  UserCheck,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { LiveIstClock } from "@/components/live-ist-clock";
import {
  getPostFlightDueBookings,
  PostFlightCompletionDialog,
} from "@/components/post-flight-prompt";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { bookingPending, canAccess, homeFor, memberNotifications } from "@/lib/logic";
import { useStore } from "@/lib/store";
import { roleLabel, type Booking } from "@/lib/types";

export const Route = createFileRoute("/_shell")({
  component: ShellLayout,
});

interface NavMenuItem {
  to: string;
  search?: Record<string, string>;
  label: string;
  icon: ElementType;
  badge?: number;
}

function isRouteMatch(currentPath: string, target: string): boolean {
  return currentPath === target || currentPath.startsWith(`${target}/`);
}

function PendingBadge({ count }: { count?: number }) {
  if (!count || count <= 0) return null;
  return (
    <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
      {count}
    </span>
  );
}

function ShellLayout() {
  const { data, me, hydrated, signOut, update, reset, log } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [postFlightBooking, setPostFlightBooking] = useState<Booking | null>(null);
  const [postFlightDecision, setPostFlightDecision] = useState<"yes" | "no">("yes");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "critical" | "medium" | "low">("all");

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading SilverArrows operations…
        </p>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center text-foreground">
        <div className="max-w-md rounded-3xl border border-border bg-card p-8 shadow-lg">
          <Lock className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-2xl font-bold">Authentication Required</h1>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Please sign in to access your flight academy portal, syllabus records, and assigned
            E-Learning courses.
          </p>
          <Button asChild className="mt-6 w-full">
            <Link to="/login">Sign In to SilverArrows</Link>
          </Button>
        </div>
      </div>
    );
  }

  const path = location.pathname;
  const hasAccess = canAccess(me.role, path);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
        <header className="border-b border-border bg-background/95 px-6 py-3.5 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <BrandLogo className="h-10 w-[140px]" />
            <ThemeToggle />
          </div>
        </header>
        <main className="mx-auto my-12 max-w-md px-4 text-center">
          <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-8 shadow-lg">
            <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="mt-4 text-2xl font-bold">403 — ACCESS DENIED</h1>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              This area isn&apos;t part of your portal ({roleLabel[me.role]}).
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Button asChild>
                <Link to={homeFor[me.role] as never}>Return to My Home Portal</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  void signOut();
                  void navigate({ to: "/login" });
                }}
              >
                <LogOut className="mr-1.5 h-3.5 w-3.5" /> Sign Out
              </Button>
            </div>
          </div>
        </main>
        <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          SilverArrows Flight Academy Security RBAC
        </footer>
      </div>
    );
  }

  const notifs = memberNotifications(data, me);
  const unreadCount = notifs.filter((n) => !n.read).length;

  const criticalNotifsCount = notifs.filter((n) => n.priority === "critical").length;
  const mediumNotifsCount = notifs.filter((n) => n.priority === "medium").length;
  const lowNotifsCount = notifs.filter((n) => n.priority === "low").length;

  const displayedNotifs =
    priorityFilter === "all"
      ? notifs
      : notifs.filter((n) => n.priority === priorityFilter);

  const markAllRead = () => {
    update((d) => ({
      ...d,
      readNotificationIds: {
        ...d.readNotificationIds,
        [me.id]: notifs.map((n) => n.id),
      },
    }));
  };

  const markOneRead = (id: string) => {
    update((d) => {
      const prev = d.readNotificationIds[me.id] ?? [];
      return {
        ...d,
        readNotificationIds: {
          ...d.readNotificationIds,
          [me.id]: prev.includes(id) ? prev : [...prev, id],
        },
      };
    });
  };

  // Play audio chime and trigger pop-up alert when new notifications arrive in real time
  const prevUnreadIdsRef = useRef<Set<string> | null>(null);
  useEffect(() => {
    if (!me) return;
    const currentUnread = notifs.filter((n) => !n.read);
    const currentIds = new Set(currentUnread.map((n) => n.id));

    if (prevUnreadIdsRef.current !== null) {
      const brandNew = currentUnread.filter((n) => !prevUnreadIdsRef.current!.has(n.id));
      if (brandNew.length > 0) {
        playNotificationSound();
        const top = brandNew[0];
        toast(top.title, {
          description: top.detail,
          action: top.to
            ? {
                label: "View",
                onClick: () => {
                  markOneRead(top.id);
                  void navigate({ to: top.to as never });
                },
              }
            : undefined,
        });
      }
    }
    prevUnreadIdsRef.current = currentIds;
  }, [notifs, me, navigate]);

  // Live pending-count badge calculations (Section 1.4)
  const postFlightDueCount = me.role === "admin" ? getPostFlightDueBookings(data).length : 0;
  const pendingFlightLogsForAdmin = data.flights.filter(
    (f) => f.verificationStatus === "pending",
  ).length;
  const adminPendingCount =
    data.requests.filter((r) => r.status === "pending").length +
    data.bookings.filter(bookingPending).length +
    data.profileRequests.filter((r) => r.status === "pending").length +
    pendingFlightLogsForAdmin +
    postFlightDueCount;

  const cfiPendingCount =
    me.role === "instructor"
      ? data.requests.filter((r) => r.status === "pending" && r.instructorId === me.id).length +
        data.flights.filter(
          (f) => f.verificationStatus === "pending" && f.instructorId === me.id,
        ).length
      : 0;

  // Call sign or two-letter initials for the Account menu avatar circle (Section 1.5)
  const avatarText = (
    me.callsign?.trim() ||
    me.name
      .split(/\s+/)
      .map((part) => part[0] ?? "")
      .join("")
      .slice(0, 2)
  ).toUpperCase();

  // Admin dropdown groups (Section 2.1)
  const adminGroups: { id: string; label: string; items: NavMenuItem[] }[] = [
    {
      id: "master",
      label: "Master control",
      items: [
        {
          to: "/portal/admin",
          label: "Admin hub",
          icon: ShieldCheck,
          badge: adminPendingCount,
        },
        {
          to: "/admin/create",
          label: "Create entities",
          icon: PlusSquare,
        },
        {
          to: "/admin/audit",
          label: "Audit log",
          icon: ClipboardList,
        },
        {
          to: "/database",
          label: "Database",
          icon: Database,
        },
      ],
    },
    {
      id: "portals",
      label: "Portal views",
      items: [
        {
          to: "/portal/student",
          label: "Student portal",
          icon: GraduationCap,
        },
        {
          to: "/portal/cfi",
          label: "CFI portal",
          icon: UserIcon,
        },
        {
          to: "/portal/ground",
          label: "Ground school portal",
          icon: School,
        },
      ],
    },
    {
      id: "operations",
      label: "Operations",
      items: [
        {
          to: "/schedule",
          label: "Bookings calendar",
          icon: CalendarDays,
        },
        {
          to: "/flights",
          label: "Flight log",
          icon: Notebook,
        },
        {
          to: "/people",
          label: "People",
          icon: Users,
        },
        {
          to: "/training",
          label: "Syllabus",
          icon: BookOpen,
        },
        {
          to: "/learning",
          label: "E-Learning",
          icon: GraduationCap,
        },
        {
          to: "/fleet",
          label: "Fleet & maintenance",
          icon: Wrench,
        },
        {
          to: "/atlas",
          label: "Atlas",
          icon: Compass,
        },
      ],
    },
  ];

  // Non-admin flat role items (Sections 2.2, 2.3, 2.4)
  const flatRoleItems: NavMenuItem[] =
    me.role === "instructor"
      ? [
          {
            to: "/portal/cfi",
            label: "CFI hub",
            icon: UserIcon,
            badge: cfiPendingCount,
          },
          { to: "/schedule", label: "Bookings calendar", icon: CalendarDays },
          { to: "/flights", label: "Flight log", icon: Notebook },
          { to: "/people", label: "People", icon: Users },
          { to: "/training", label: "Syllabus", icon: BookOpen },
          { to: "/learning", label: "E-Learning", icon: GraduationCap },
          { to: "/fleet", label: "Fleet & maintenance", icon: Wrench },
        ]
      : me.role === "ground"
        ? [
            { to: "/portal/ground", label: "Ground school", icon: School },
            { to: "/people", label: "People", icon: Users },
            { to: "/training", label: "Syllabus", icon: BookOpen },
            { to: "/learning", label: "E-Learning", icon: GraduationCap },
            { to: "/fleet", label: "Fleet & maintenance", icon: Wrench },
          ]
        : [
            { to: "/portal/student", label: "Student portal", icon: GraduationCap },
            { to: "/profile", label: "My profile", icon: UserCheck },
            { to: "/schedule", label: "Flight bookings", icon: CalendarDays },
            { to: "/flights", label: "Flight logs", icon: Notebook },
            { to: "/training", label: "Syllabus", icon: BookOpen },
            { to: "/learning", label: "Courses & E-Learning", icon: GraduationCap },
            { to: "/fleet", label: "Fleet & maintenance", icon: Wrench },
          ];

  const isDashboardActive = isRouteMatch(path, "/dashboard");
  const isAtlasActive = isRouteMatch(path, "/atlas");

  return (
    <div className="min-h-screen bg-background text-foreground antialiased flex flex-col justify-between selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* Top Title Bar: Logo + Live Authoritative IST 24h Clock in Top-Left Corner, then Right Controls */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 px-3 sm:px-5 lg:px-6 py-2.5 sm:py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-2.5 sm:gap-4">
          {/* Top-Left Corner: Brand Logo + Non-Stopping Authoritative IST Live 24h Clock */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-7 min-w-0">
            <Link to={homeFor[me.role] as never} className="shrink-0 transition hover:opacity-90">
              <BrandLogo className="h-10 sm:h-12" />
            </Link>
            <div className="hidden sm:block h-6 w-px bg-border/80 shrink-0" aria-hidden="true" />
            <LiveIstClock />
          </div>

          <div className="hidden lg:block flex-1" />

          {/* Right-side Controls: Mobile/Tablet Menu Toggle, Theme toggle, Notification bell, Account menu, Sign out */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Toggle navigation menu"
              data-testid="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden rounded-full h-9 w-9"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <ThemeToggle />

            {/* Notification Bell */}
            <Popover open={notifOpen} onOpenChange={setNotifOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative rounded-full h-9 w-9"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-88 sm:w-96 space-y-3 rounded-2xl p-4 shadow-2xl border-border bg-card/95 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Notifications ({notifs.length})
                    </span>
                    {me.role === "admin" && (
                      <span className="rounded-full bg-primary/15 border border-primary/30 px-2 py-0.5 text-[10px] font-bold text-primary font-mono">
                        ADMIN FEED
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="text-[11px] font-medium text-primary-ink hover:underline cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Priority Filter Segmented Control for Admins & Staff */}
                <div className="flex items-center gap-1 rounded-xl bg-muted/60 p-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPriorityFilter("all")}
                    className={`flex-1 rounded-lg py-1 px-1.5 font-medium transition cursor-pointer text-center ${
                      priorityFilter === "all"
                        ? "bg-background text-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    All ({notifs.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriorityFilter("critical")}
                    className={`flex-1 rounded-lg py-1 px-1 font-medium transition cursor-pointer text-center flex items-center justify-center gap-1 ${
                      priorityFilter === "critical"
                        ? "bg-red-500/20 text-red-500 border border-red-500/35 shadow-xs font-bold"
                        : "text-muted-foreground hover:text-red-500"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    Critical ({criticalNotifsCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriorityFilter("medium")}
                    className={`flex-1 rounded-lg py-1 px-1 font-medium transition cursor-pointer text-center flex items-center justify-center gap-1 ${
                      priorityFilter === "medium"
                        ? "bg-amber-500/20 text-amber-500 border border-amber-500/35 shadow-xs font-bold"
                        : "text-muted-foreground hover:text-amber-500"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Medium ({mediumNotifsCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriorityFilter("low")}
                    className={`flex-1 rounded-lg py-1 px-1 font-medium transition cursor-pointer text-center flex items-center justify-center gap-1 ${
                      priorityFilter === "low"
                        ? "bg-slate-500/20 text-slate-300 border border-slate-500/35 shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    Low ({lowNotifsCount})
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2 pr-0.5">
                  {displayedNotifs.length === 0 ? (
                    <p className="py-6 text-center text-xs text-muted-foreground">
                      No {priorityFilter !== "all" ? `${priorityFilter} priority` : ""} notifications at this time.
                    </p>
                  ) : (
                    displayedNotifs.map((n) => {
                      const bookingId =
                        "bookingId" in n ? (n.bookingId as string | undefined) : undefined;
                      const linkedBooking = bookingId
                        ? data.bookings.find((b) => b.id === bookingId)
                        : undefined;
                      const linkedStudent = linkedBooking
                        ? data.users.find((u) => u.id === linkedBooking.studentId)
                        : undefined;
                      return (
                        <div
                          key={n.id}
                          onClick={() => {
                            if (linkedBooking) return;
                            markOneRead(n.id);
                            setNotifOpen(false);
                            void navigate({ to: n.to as never });
                          }}
                          className={`rounded-xl border p-2.5 text-xs transition space-y-1.5 ${
                            linkedBooking ? "" : "cursor-pointer"
                          } ${
                            n.read
                              ? "border-border bg-card/60 text-muted-foreground"
                              : n.priority === "critical"
                              ? "border-red-500/40 bg-red-500/5 text-foreground"
                              : n.priority === "medium"
                              ? "border-amber-500/40 bg-amber-500/5 text-foreground"
                              : "border-primary/40 bg-primary/5 text-foreground font-medium"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              {n.priority === "critical" ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 border border-red-500/30 px-1.5 py-0.5 text-[9px] font-black text-red-500 tracking-wider uppercase font-mono">
                                  <AlertTriangle className="h-2.5 w-2.5" /> CRITICAL
                                </span>
                              ) : n.priority === "medium" ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 text-[9px] font-black text-amber-500 tracking-wider uppercase font-mono">
                                  <AlertCircle className="h-2.5 w-2.5" /> MEDIUM
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/15 border border-slate-500/30 px-1.5 py-0.5 text-[9px] font-bold text-slate-400 tracking-wider uppercase font-mono">
                                  <Info className="h-2.5 w-2.5" /> LOW
                                </span>
                              )}
                              <span className="font-semibold text-foreground truncate">{n.title}</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                              {n.at ? new Date(n.at).toLocaleDateString() : ""}
                            </span>
                          </div>
                          <p className="text-[11px] leading-snug">{n.detail}</p>
                          {linkedBooking && (
                            <div className="mt-2 space-y-1.5 pt-1.5 border-t border-border/40">
                              <div className="flex items-center justify-between gap-2 text-[11px]">
                                <span className="text-muted-foreground">Student:</span>
                                <span className="font-bold text-foreground bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                                  {linkedStudent?.name ?? "Student"}
                                </span>
                              </div>
                              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                Updates exclusively {linkedStudent?.name ?? "this student"}&apos;s logbook
                              </p>
                              <div className="flex items-center gap-2 pt-0.5">
                                <Button
                                  size="sm"
                                  className="h-7 px-3 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markOneRead(n.id);
                                    setNotifOpen(false);
                                    setPostFlightBooking(linkedBooking);
                                    setPostFlightDecision("yes");
                                  }}
                                >
                                  <CheckCircle2 className="mr-1 h-3 w-3" /> Yes, {linkedStudent?.name?.split(" ")[0] ?? "Student"} Flew
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-3 text-[11px] text-destructive border-destructive/40 hover:bg-destructive hover:text-destructive-foreground"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markOneRead(n.id);
                                    setNotifOpen(false);
                                    setPostFlightBooking(linkedBooking);
                                    setPostFlightDecision("no");
                                  }}
                                >
                                  No, Did Not Fly
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Account Menu Dropdown (Section 1.5) */}
            <Popover
              open={accountOpen}
              onOpenChange={(open) => {
                setAccountOpen(open);
                if (!open) setConfirmReset(false);
              }}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="Account menu"
                  className="flex items-center gap-2 rounded-full border border-border bg-card pl-1.5 pr-3 py-1 text-xs font-medium text-foreground shadow-2xs transition hover:border-primary/50"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                    {avatarText}
                  </span>
                  <span className="font-semibold hidden xs:inline sm:inline max-w-[110px] sm:max-w-none truncate">{me.name}</span>
                  <span className="hidden md:inline text-muted-foreground">
                    · {roleLabel[me.role]}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                      accountOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64 rounded-2xl p-2 shadow-xl">
                <div className="border-b border-border px-3 py-2.5">
                  <p className="text-sm font-semibold text-foreground">{me.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{me.email}</p>
                </div>

                <div className="mt-1 space-y-0.5">
                  <Link
                    to="/profile"
                    onClick={() => setAccountOpen(false)}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition hover:bg-accent ${
                      isRouteMatch(path, "/profile") ? "bg-accent font-medium" : ""
                    }`}
                  >
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <span>My profile</span>
                  </Link>

                  <Link
                    to={homeFor[me.role] as never}
                    onClick={() => setAccountOpen(false)}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition hover:bg-accent ${
                      isRouteMatch(path, homeFor[me.role]) ? "bg-accent font-medium" : ""
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                    <span>My portal</span>
                  </Link>

                  {me.role === "student" && (
                    <Link
                      to="/people/$id"
                      params={{ id: me.id }}
                      onClick={() => setAccountOpen(false)}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition hover:bg-accent ${
                        isRouteMatch(path, `/people/${me.id}`) ? "bg-accent font-medium" : ""
                      }`}
                    >
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <span>My member record</span>
                    </Link>
                  )}

                  {me.role === "admin" && (
                    <>
                      <div className="my-1 border-t border-border" />
                      {!confirmReset ? (
                        <button
                          type="button"
                          onClick={() => setConfirmReset(true)}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-foreground transition hover:bg-accent"
                        >
                          <RotateCcw className="h-4 w-4 text-muted-foreground" />
                          <span>Reset demo data</span>
                        </button>
                      ) : (
                        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-2.5 text-xs space-y-2">
                          <p className="font-medium text-foreground">
                            Reset all academy demo records to initial seed state?
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-7 flex-1 text-xs"
                              onClick={() => {
                                reset();
                                log(
                                  "demo_reset",
                                  "user",
                                  "Administrator reset academy demo records",
                                );
                                setConfirmReset(false);
                                setAccountOpen(false);
                                toast.success("Demo data reset to canonical seed state");
                              }}
                            >
                              Confirm reset
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => setConfirmReset(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="my-1 border-t border-border" />
                  <a
                    href="/MVP-3-ELearning-2026-10-25.zip"
                    download="MVP-3-ELearning-2026-10-25.zip"
                    onClick={() => setAccountOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium text-primary-ink transition hover:bg-accent"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download MVP-3-ELearning-2026-10-25.zip</span>
                  </a>

                  <div className="my-1 border-t border-border" />
                  <button
                    type="button"
                    onClick={() => {
                      setAccountOpen(false);
                      void signOut();
                      void navigate({ to: "/login" });
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-destructive transition hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void signOut();
                void navigate({ to: "/login" });
              }}
              title="Sign out"
              className="h-9 rounded-full px-3.5 text-xs font-medium whitespace-nowrap"
            >
              <LogOut className="h-3.5 w-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Next Div Right After Title Bar: Long Pill-Based & Highlighted Glassmorphic Nav Bar */}
      <div className="border-b border-border/50 bg-background/45 px-3 sm:px-5 lg:px-6 py-2 sm:py-2.5 backdrop-blur-md">
        <div className="mx-auto max-w-[1600px]">
          <nav
            aria-label="Main navigation"
            className="flex w-full items-center justify-between gap-1.5 sm:gap-2 overflow-x-auto rounded-2xl sm:rounded-full border border-white/20 bg-sidebar/55 p-1.5 text-xs sm:text-sm font-medium text-sidebar-foreground shadow-lg ring-1 ring-white/10 backdrop-blur-xl"
          >
            {/* 1. First item is always "Dashboard" linking to /dashboard */}
            <Link
              to="/dashboard"
              className={`flex flex-1 shrink-0 items-center justify-center gap-1.5 sm:gap-2 rounded-full border px-3 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap transition-all duration-200 ${
                isDashboardActive
                  ? "border-primary bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90"
                  : "border-white/15 bg-card/90 text-foreground font-medium shadow-xs hover:border-primary hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span>Dashboard</span>
            </Link>

            {/* 2. Role-specific items: 3 Dropdown Groups for Admin, or Direct Flat Pills for Non-Admin */}
            {me.role === "admin"
              ? adminGroups.map((group) => {
                  const groupActive = group.items.some((item) => isRouteMatch(path, item.to));
                  const groupBadgeSum = group.items.reduce(
                    (sum, item) => sum + (item.badge ?? 0),
                    0,
                  );
                  const isOpen = openGroup === group.id;

                  return (
                    <Popover
                      key={group.id}
                      open={isOpen}
                      onOpenChange={(nextOpen) => setOpenGroup(nextOpen ? group.id : null)}
                    >
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={`flex flex-1 shrink-0 items-center justify-center gap-1.5 sm:gap-2 rounded-full border px-3 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap transition-all duration-200 ${
                            groupActive
                              ? "border-primary bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90"
                              : "border-white/15 bg-card/90 text-foreground font-medium shadow-xs hover:border-primary hover:bg-primary hover:text-primary-foreground"
                          }`}
                        >
                          <span>{group.label}</span>
                          <PendingBadge count={groupBadgeSum} />
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="center"
                        className="w-60 rounded-2xl border border-white/20 bg-popover/90 p-1.5 text-popover-foreground shadow-2xl backdrop-blur-xl"
                      >
                        <div className="space-y-1">
                          {group.items
                            .filter(
                              (item) => item.to === "/elearning" || canAccess(me.role, item.to),
                            )
                            .map((item) => {
                              const Icon = item.icon;
                              const itemActive = isRouteMatch(path, item.to);
                              return (
                                <Link
                                  key={item.to}
                                  to={item.to as never}
                                  onClick={() => setOpenGroup(null)}
                                  className={`flex items-center justify-between gap-2 rounded-full px-3.5 py-2 text-sm transition-colors ${
                                    itemActive
                                      ? "bg-primary font-semibold text-primary-foreground shadow-xs"
                                      : "text-popover-foreground hover:bg-primary hover:text-primary-foreground"
                                  }`}
                                >
                                  <span className="flex items-center gap-2.5">
                                    <Icon className="h-4 w-4 shrink-0" />
                                    <span>{item.label}</span>
                                  </span>
                                  <PendingBadge count={item.badge} />
                                </Link>
                              );
                            })}
                        </div>
                      </PopoverContent>
                    </Popover>
                  );
                })
              : flatRoleItems
                  .filter((item) => canAccess(me.role, item.to))
                  .map((item) => {
                    const Icon = item.icon;
                    const itemActive = isRouteMatch(path, item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to as never}
                        className={`flex flex-1 shrink-0 items-center justify-center gap-1.5 sm:gap-2 rounded-full border px-3 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap transition-all duration-200 ${
                          itemActive
                            ? "border-primary bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90"
                            : "border-white/15 bg-card/90 text-foreground font-medium shadow-xs hover:border-primary hover:bg-primary hover:text-primary-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                        <PendingBadge count={item.badge} />
                      </Link>
                    );
                  })}

            {/* 3. Administrator top-level "Atlas" tab */}
            {me.role === "admin" && (
              <Link
                to={"/atlas" as never}
                data-testid="admin-nav-atlas-tab"
                className={`flex flex-1 shrink-0 items-center justify-center gap-1.5 sm:gap-2 rounded-full border px-3 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap transition-all duration-200 ${
                  isAtlasActive
                    ? "border-primary bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90"
                    : "border-white/15 bg-card/90 text-foreground font-medium shadow-xs hover:border-primary hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                <Compass className="h-4 w-4 shrink-0" />
                <span>Atlas</span>
              </Link>
            )}
          </nav>

          {/* Responsive Tablet / iPad / Mobile Expandable Grid Drawer */}
          {mobileMenuOpen && (
            <div
              data-testid="mobile-nav-drawer"
              className="lg:hidden mt-2.5 rounded-2xl border border-border/80 bg-card/95 p-3 shadow-xl backdrop-blur-xl space-y-3"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <span>Quick Navigation ({roleLabel[me.role]})</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-primary hover:underline"
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                    isDashboardActive
                      ? "border-primary bg-primary text-primary-foreground font-bold"
                      : "border-border bg-background/70 text-foreground hover:border-primary/50"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0" />
                  <span className="truncate">Dashboard</span>
                </Link>
                {(me.role === "admin"
                  ? adminGroups.flatMap((g) => g.items)
                  : flatRoleItems
                )
                  .filter((item) => item.to === "/elearning" || canAccess(me.role, item.to))
                  .map((item) => {
                    const Icon = item.icon;
                    const active = isRouteMatch(path, item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to as never}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                          active
                            ? "border-primary bg-primary text-primary-foreground font-bold"
                            : "border-border bg-background/70 text-foreground hover:border-primary/50"
                        }`}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </span>
                        <PendingBadge count={item.badge} />
                      </Link>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-3 sm:px-5 lg:px-6 py-4 sm:py-6 lg:py-8">
        <main className="mx-auto w-full max-w-[1600px]">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/20 px-6 py-4 text-xs text-muted-foreground">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4">
          <BrandLogo className="h-8" />
          <p className="text-right font-medium text-muted-foreground">
            &copy; SA Flight Academy OS. Rights Reserved.
          </p>
        </div>
      </footer>

      <PostFlightCompletionDialog
        booking={postFlightBooking}
        initialDecision={postFlightDecision}
        open={Boolean(postFlightBooking)}
        onOpenChange={(open) => {
          if (!open) setPostFlightBooking(null);
        }}
      />
    </div>
  );
}
