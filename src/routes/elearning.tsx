import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Flame,
  GraduationCap,
  Layers,
  Lock,
  LogOut,
  Scale,
  Search,
  ShieldCheck,
  UserMinus,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { AssignedCoursesPanel, CourseReaderView } from "@/components/assigned-courses-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import {
  ELEARNING_MODULES,
  isCourseAssignedToUser,
  usersAssignedToCourse,
  assignCourseToUsers,
  unassignCourseFromUsers,
  type CourseId,
  type ELearningModule,
} from "@/lib/elearning-courses";
import { roleLabel } from "@/lib/types";

export const Route = createFileRoute("/elearning")({
  head: () => ({
    meta: [
      { title: "E-Learning Ground School — SilverArrows" },
      {
        name: "description",
        content:
          "SilverArrows independent E-Learning platform: role-unified course access and administrator course assignment for Air Manual - Pooley and Air Law.",
      },
      {
        property: "og:title",
        content: "E-Learning Ground School — SilverArrows",
      },
    ],
  }),
  component: ELearningPage,
});

const QUICK_ELEARNING_USERS = [
  { label: "Sakshi Gaur", role: "Administrator (Course Admin)", email: "sakshi@flysilverarrows.com" },
  { label: "Vipul Aviation", role: "Chief CFI (VPL)", email: "vipul@flysilverarrows.com" },
  { label: "Priya Nair", role: "Flight Instructor (CFI)", email: "priya@flysilverarrows.com" },
  { label: "Anujay Singh", role: "Ground Instructor", email: "anujay@flysilverarrows.com" },
  { label: "Aarav Patel", role: "Student Pilot (ARP)", email: "aarav@flysilverarrows.com" },
  { label: "Ananya Sharma", role: "Student Pilot (ANA)", email: "ananya@flysilverarrows.com" },
] as const;

function ELearningPage() {
  const { data, me, update, signOut, reload, log } = useStore();

  // Active course reader state: null = course catalogue, "pooley" = Air Manual reader, "airlaw" = Air Law syllabus
  const [activeCourse, setActiveCourse] = useState<CourseId | null>(null);

  // Assignment Modal states (Admin only)
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [targetModule, setTargetModule] = useState<ELearningModule | null>(null);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [candidateSearch, setCandidateSearch] = useState("");
  const [assignmentNote, setAssignmentNote] = useState("");
  const [assigningBusy, setAssigningBusy] = useState(false);

  // Unassignment Modal states (Admin only)
  const [unassignModalOpen, setUnassignModalOpen] = useState(false);
  const [unassignCandidateIds, setUnassignCandidateIds] = useState<string[]>([]);
  const [unassigningBusy, setUnassigningBusy] = useState(false);

  // Unified E-Learning sign-in states
  const [loginEmail, setLoginEmail] = useState("sakshi@flysilverarrows.com");
  const [loginPassword, setLoginPassword] = useState("Vipul@1011");
  const [loginBusy, setLoginBusy] = useState(false);

  const isAdmin = me?.role === "admin";

  // Filter candidates: all active non-admin people (students, flight instructors, ground instructors)
  const candidates = data.users.filter(
    (u) =>
      u.status === "active" &&
      u.role !== "admin" &&
      (!candidateSearch ||
        `${u.name} ${u.email} ${u.callsign ?? ""} ${roleLabel[u.role]}`
          .toLowerCase()
          .includes(candidateSearch.toLowerCase())),
  );

  const handleLaunchModule = (moduleId: CourseId) => {
    const mod = ELEARNING_MODULES.find((m) => m.id === moduleId);
    log(
      "elearning_module_opened",
      "lesson",
      `Opened E-Learning module "${mod?.title ?? moduleId}"`,
      moduleId,
    );
    setActiveCourse(moduleId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenAssign = (module: ELearningModule) => {
    setTargetModule(module);
    setSelectedCandidateIds([]);
    setAssignmentNote("");
    setCandidateSearch("");
    setAssignModalOpen(true);
  };

  const handleOpenUnassign = (module: ELearningModule) => {
    setTargetModule(module);
    const assigned = usersAssignedToCourse(module.id, data);
    setUnassignCandidateIds(assigned.map((u) => u.id));
    setUnassignModalOpen(true);
  };

  const isAlreadyAssigned = (userId: string) =>
    Boolean(targetModule && isCourseAssignedToUser(userId, targetModule.id, data));

  const signInWithCredentials = async (emailToUse: string, passwordToUse: string) => {
    setLoginBusy(true);
    if (me) {
      await signOut();
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: emailToUse.trim(),
      password: passwordToUse,
    });
    setLoginBusy(false);
    if (error) {
      toast.error(error.message);
    } else {
      setActiveCourse(null);
      await reload();
      log("elearning_signin", "user", `Signed in to E-Learning (${emailToUse.trim()})`);
      toast.success("Signed in to SilverArrows E-Learning.");
    }
  };

  const handleSignIn = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    await signInWithCredentials(loginEmail, loginPassword);
  };

  const toggleCandidate = (id: string) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectAllCandidates = () => {
    setSelectedCandidateIds(candidates.map((c) => c.id));
  };

  const deselectAllCandidates = () => {
    setSelectedCandidateIds([]);
  };

  const handleConfirmAssignment = () => {
    if (!targetModule || selectedCandidateIds.length === 0) {
      toast.error("Please select at least one candidate.");
      return;
    }
    if (!me || me.role !== "admin") {
      toast.error("Administrator authorization required.");
      return;
    }

    setAssigningBusy(true);
    const { next, newlyAssignedNames, alreadyAssignedNames } = assignCourseToUsers(
      selectedCandidateIds,
      targetModule.id,
      data,
      me,
      assignmentNote,
    );

    update(() => next);

    if (alreadyAssignedNames.length > 0) {
      toast.info(`Already assigned: ${alreadyAssignedNames.join(", ")}`);
    }

    if (newlyAssignedNames.length > 0) {
      toast.success(
        `Assigned "${targetModule.title}" to ${newlyAssignedNames.join(", ")}. They have access immediately.`,
      );
    }

    setAssigningBusy(false);
    setAssignModalOpen(false);
  };

  const handleConfirmUnassignment = () => {
    if (!targetModule || unassignCandidateIds.length === 0) {
      toast.error("Please select at least one candidate to unassign.");
      return;
    }
    if (!me || me.role !== "admin") {
      toast.error("Administrator authorization required.");
      return;
    }

    setUnassigningBusy(true);
    const { next, unassignedNames } = unassignCourseFromUsers(
      unassignCandidateIds,
      targetModule.id,
      data,
      me,
    );

    update(() => next);

    if (unassignedNames.length > 0) {
      toast.success(`Unassigned "${targetModule.title}" from ${unassignedNames.join(", ")}.`);
    }

    setUnassigningBusy(false);
    setUnassignModalOpen(false);
  };

  const handleQuickUnassign = (courseId: CourseId, userId: string, userName: string) => {
    if (!me || me.role !== "admin") {
      toast.error("Administrator authorization required.");
      return;
    }
    const { next, unassignedNames } = unassignCourseFromUsers([userId], courseId, data, me);
    update(() => next);
    if (unassignedNames.length > 0) {
      toast.success(`Unassigned from ${userName}.`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      {/* Top Title Bar: Logo, long space, then member name, theme & log out */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 px-6 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <Link to="/" className="shrink-0 transition hover:opacity-90">
            <BrandLogo className="h-14 w-[120px]" />
          </Link>

          <div className="flex-1" />

          <div className="flex shrink-0 items-center gap-2.5">
            {me && (
              <div className="flex items-center gap-2 rounded-full border border-border bg-card pl-1.5 pr-3.5 py-1 text-xs font-medium text-foreground">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {(me.callsign ?? me.name.slice(0, 2)).toUpperCase()}
                </span>
                <span className="font-semibold">{me.name}</span>
                <span className="hidden sm:inline text-muted-foreground">
                  · {roleLabel[me.role]}
                </span>
              </div>
            )}
            <ThemeToggle />
            {me ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveCourse(null);
                  void signOut();
                }}
                className="h-9 rounded-full px-3.5 text-xs font-medium whitespace-nowrap"
              >
                <LogOut className="h-3.5 w-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-9 rounded-full px-3.5 text-xs font-medium whitespace-nowrap"
              >
                <Link to="/">
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  Home
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 px-6 py-8 sm:py-12">
        <main className="mx-auto w-full max-w-[1600px]">
        {/* 1. Not Signed In: Unified E-Learning Login for Any Academy User */}
        {!me ? (
          <div className="mx-auto max-w-lg py-4">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-lg">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary-ink">
                    <GraduationCap className="h-3.5 w-3.5" /> SilverArrows E-Learning Ground School
                  </span>
                  <h1 className="mt-2 text-2xl font-bold tracking-tight">Sign In to E-Learning</h1>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Sign in with your unified academy account. Administrators manage and assign
                    courses; students and instructors study their assigned modules.
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
                  <Lock className="h-5 w-5" />
                </div>
              </div>

              <form onSubmit={handleSignIn} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="loginEmail" className="text-xs">
                    Academy Email
                  </Label>
                  <Input
                    id="loginEmail"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@silverarrows.aero"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="loginPassword" className="text-xs">
                    Password
                  </Label>
                  <Input
                    id="loginPassword"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" disabled={loginBusy} className="w-full font-semibold">
                  {loginBusy ? "Signing in…" : "Sign In to E-Learning"}
                </Button>
              </form>

              <div className="mt-6 border-t border-border pt-4">
                <p className="mb-2.5 text-xs font-semibold text-muted-foreground">
                  Quick Demo Sign-In (Unified Academy Users):
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {QUICK_ELEARNING_USERS.map((item) => (
                    <button
                      key={item.email}
                      type="button"
                      disabled={loginBusy}
                      onClick={() => {
                        setLoginEmail(item.email);
                        setLoginPassword("Vipul@1011");
                        void signInWithCredentials(item.email, "Vipul@1011");
                      }}
                      className="flex flex-col items-start rounded-xl border border-border bg-background px-3 py-2 text-left text-xs transition hover:border-primary/60 hover:bg-accent/40"
                    >
                      <span className="font-semibold text-foreground">{item.label}</span>
                      <span className="text-[11px] text-muted-foreground">{item.role}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : activeCourse ? (
          /* 2. Active Course Reader (Pooley or Air Law) */
          <CourseReaderView
            courseId={activeCourse}
            onBack={() => setActiveCourse(null)}
            backLabel={isAdmin ? "Back to All E-Learning Modules" : "Back to My Assigned Courses"}
          />
        ) : !isAdmin ? (
          /* 3. Non-Admin Signed In (Student, CFI, Ground Instructor): View Their Assigned Courses */
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-ink">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>
                  {me.name} · {roleLabel[me.role]}
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                My Assigned E-Learning Courses
              </h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
                Showing the E-Learning training modules assigned to your profile by the academy
                administrator. Select any assigned course below to open the interactive reader.
              </p>
            </div>

            <AssignedCoursesPanel person={me} />
          </div>
        ) : (
          /* 4. Admin Signed In: View Total Courses & Direct Assign / Unassign Buttons */
          <div className="space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Administrator Authenticated · Course Management Active</span>
                </div>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Total Aviation E-Learning Courses
                </h1>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-3xl">
                  As an administrator, you have full authority to assign or unassign academy
                  training modules. Candidates only see the specific courses assigned to them inside
                  their individual E-Learning view and profile.
                </p>
              </div>
            </div>

            {/* SINGLE COLUMN LONG BARS FOR EACH MODULE */}
            <div className="flex flex-col gap-6">
              {ELEARNING_MODULES.map((mod) => {
                const Icon =
                  mod.id === "pooley"
                    ? BookOpen
                    : mod.id === "airframes"
                      ? Layers
                      : mod.id === "electrics"
                        ? Zap
                        : mod.id === "powerplant"
                          ? Flame
                          : Scale;
                const assignedUsers = usersAssignedToCourse(mod.id, data);
                return (
                  <div
                    key={mod.id}
                    className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs transition-all hover:border-primary/60 hover:shadow-md lg:flex-row lg:items-center gap-6"
                  >
                    {/* Left: Module Details */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1 min-w-0">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-7 w-7" />
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                            {mod.title}
                          </h2>
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            {mod.badge}
                          </span>
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                          {mod.subtitle}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
                          {mod.description}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 text-xs text-muted-foreground">
                          {mod.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-medium text-[11px]"
                            >
                              ✓ {tag}
                            </span>
                          ))}
                        </div>

                        {/* Assigned Candidates Summary Pill Bar with 1-Click Quick Unassign */}
                        <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs">
                          <span className="inline-flex items-center gap-1 font-semibold text-muted-foreground">
                            <Users className="h-3.5 w-3.5 text-primary" /> Assigned (
                            {assignedUsers.length}):
                          </span>
                          {assignedUsers.length === 0 ? (
                            <span className="text-muted-foreground italic">
                              No candidates assigned yet
                            </span>
                          ) : (
                            assignedUsers.map((u) => (
                              <span
                                key={u.id}
                                className="inline-flex items-center gap-1 rounded-full bg-primary/10 pl-2.5 pr-1.5 py-0.5 text-[11px] font-semibold text-primary"
                              >
                                <span>{u.name}</span>
                                <button
                                  type="button"
                                  onClick={() => handleQuickUnassign(mod.id, u.id, u.name)}
                                  className="h-3.5 w-3.5 rounded-full hover:bg-destructive hover:text-destructive-foreground inline-flex items-center justify-center transition"
                                  title={`Unassign ${u.name} from ${mod.title}`}
                                  aria-label={`Unassign ${u.name}`}
                                >
                                  <X className="h-2.5 w-2.5" />
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Action Buttons Group (Launch, Assign to, Unassign Course) */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-2.5 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-border">
                      <Button
                        onClick={() => handleLaunchModule(mod.id)}
                        className="rounded-full font-semibold shadow-xs"
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Launch Module
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleOpenAssign(mod)}
                        className="rounded-full font-semibold hover:border-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <UserPlus className="mr-2 h-4 w-4 text-primary group-hover:text-current" />
                        Assign to
                      </Button>
                      <Button
                        variant="outline"
                        disabled={assignedUsers.length === 0}
                        onClick={() => handleOpenUnassign(mod)}
                        className="rounded-full border-destructive/45 bg-destructive/10 font-semibold text-destructive shadow-xs hover:border-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <UserMinus className="mr-2 h-4 w-4" />
                        Unassign Course
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ADMIN-ONLY CHANGE & AUDIT LOG SECTION */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight">
                      Administrator Change &amp; Audit Log (Admin Visibility Only)
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Every course assignment, unassignment, and platform change is recorded here
                      and visible exclusively to administrators.
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {data.activity.length} Logged Entries
                </span>
              </div>

              <div className="mt-4 max-h-80 overflow-y-auto divide-y divide-border/60">
                {data.activity.slice(0, 20).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="rounded-full bg-primary/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-primary">
                        {entry.action}
                      </span>
                      <span className="font-semibold text-foreground">{entry.actorName}</span>
                      <span className="text-muted-foreground">({roleLabel[entry.actorRole]})</span>
                      <span className="text-foreground/90">— {entry.details}</span>
                    </div>
                    <span className="num shrink-0 font-mono text-[11px] text-muted-foreground">
                      {new Date(entry.at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        </main>
      </div>

      {/* DIRECT ASSIGNMENT DIALOG */}
      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>Assign {targetModule?.title ?? "Course"} to Candidates</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Select members from the academy roster. Assigned candidates will immediately see this
              course in their individual profile and syllabus reader.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 space-y-4">
            {/* Target Course Summary */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-3 text-xs">
              <div>
                <span className="font-semibold text-foreground">{targetModule?.title}</span>
                <p className="text-muted-foreground">{targetModule?.subtitle}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 font-bold text-primary">
                {selectedCandidateIds.length} Selected
              </span>
            </div>

            {/* Search & Bulk Select */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidate name, call sign, role or email…"
                  value={candidateSearch}
                  onChange={(e) => setCandidateSearch(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Available candidates ({candidates.length})</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAllCandidates}
                    className="text-primary hover:underline font-medium"
                  >
                    Select all
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={deselectAllCandidates}
                    className="text-muted-foreground hover:underline"
                  >
                    Deselect all
                  </button>
                </div>
              </div>
            </div>

            {/* Candidate Roster List */}
            <div className="max-h-56 overflow-y-auto space-y-1.5 rounded-xl border border-border p-2">
              {candidates.length === 0 ? (
                <p className="p-4 text-center text-xs text-muted-foreground">
                  No matching candidates found.
                </p>
              ) : (
                candidates.map((c) => {
                  const isSelected = selectedCandidateIds.includes(c.id);
                  const assigned = isAlreadyAssigned(c.id);
                  return (
                    <div
                      key={c.id}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition border ${
                        isSelected
                          ? "border-primary bg-primary/10 font-medium"
                          : "border-transparent bg-card hover:bg-accent/40"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleCandidate(c.id)}
                        className="flex items-center gap-3 flex-1 text-left"
                      >
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                            isSelected
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-input bg-background"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground flex items-center gap-2">
                            <span>{c.name}</span>
                            {c.callsign && (
                              <span className="font-mono text-[10px] text-muted-foreground">
                                ({c.callsign})
                              </span>
                            )}
                            {assigned && (
                              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                Assigned
                              </span>
                            )}
                          </div>
                          <span className="text-muted-foreground text-[11px]">{c.email}</span>
                        </div>
                      </button>

                      <div className="flex items-center gap-2">
                        {assigned && targetModule && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuickUnassign(targetModule.id, c.id, c.name)}
                            className="h-7 text-[11px] text-destructive hover:bg-destructive/10 px-2"
                          >
                            Unassign
                          </Button>
                        )}
                        <span className="rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {roleLabel[c.role]}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Optional Assignment Note */}
            <div className="space-y-1">
              <Label htmlFor="assignmentNote" className="text-xs">
                Assignment Note / Target Milestone (Optional)
              </Label>
              <Input
                id="assignmentNote"
                placeholder="e.g. Complete before solo cross-country navigation"
                value={assignmentNote}
                onChange={(e) => setAssignmentNote(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" size="sm" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={assigningBusy || selectedCandidateIds.length === 0}
              onClick={handleConfirmAssignment}
              className="font-semibold"
            >
              {assigningBusy ? "Assigning…" : `Confirm & Assign (${selectedCandidateIds.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* UNASSIGNMENT DIALOG */}
      <Dialog open={unassignModalOpen} onOpenChange={setUnassignModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-destructive">
              <UserMinus className="h-5 w-5" />
              <span>Unassign {targetModule?.title ?? "Course"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Select candidates from whom you wish to revoke access to this module.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 space-y-3">
            {targetModule && (
              <div className="space-y-1.5 rounded-xl border border-border p-2 max-h-60 overflow-y-auto">
                {usersAssignedToCourse(targetModule.id, data).length === 0 ? (
                  <p className="p-4 text-center text-xs text-muted-foreground">
                    No candidates are currently assigned to this module.
                  </p>
                ) : (
                  usersAssignedToCourse(targetModule.id, data).map((u) => {
                    const isChecked = unassignCandidateIds.includes(u.id);
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() =>
                          setUnassignCandidateIds((prev) =>
                            prev.includes(u.id) ? prev.filter((x) => x !== u.id) : [...prev, u.id],
                          )
                        }
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition border ${
                          isChecked
                            ? "border-destructive/40 bg-destructive/5 font-medium"
                            : "border-transparent bg-card hover:bg-accent/40"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                              isChecked
                                ? "bg-destructive border-destructive text-destructive-foreground"
                                : "border-input bg-background"
                            }`}
                          >
                            {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <span className="font-semibold text-foreground">{u.name}</span>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            ({roleLabel[u.role]})
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{u.email}</span>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" size="sm" onClick={() => setUnassignModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={unassigningBusy || unassignCandidateIds.length === 0}
              onClick={handleConfirmUnassignment}
              className="font-semibold"
            >
              {unassigningBusy ? "Revoking…" : `Unassign Selected (${unassignCandidateIds.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 px-6 py-4 text-xs text-muted-foreground">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4">
          <BrandLogo className="h-8" />
          <p className="text-right font-medium text-muted-foreground">
            &copy; SA Flight Academy OS. Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
