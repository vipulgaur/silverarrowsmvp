import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, Clock, Info, Lock, Plane, Users, X } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { HomepageAviationSequence } from "@/components/homepage-aviation-sequence";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const TOP_BAR_LINKS = [
  {
    id: "about-us",
    label: "About Us",
    subtitle: "SilverArrows Aviation Academy & Flight Training Organization",
  },
  {
    id: "team-members",
    label: "Team Members",
    subtitle: "Chief Flight Instructors, Ground School Faculty & Operations Leadership",
  },
  {
    id: "our-fleet",
    label: "Our Fleet",
    subtitle: "Single & Multi-Engine Training Aircraft and Avionics Simulators",
  },
  {
    id: "contact",
    label: "Contact",
    subtitle: "Academy Operations Desk, Admissions & Dispatch",
  },
] as const;

type TopBarSectionId = (typeof TOP_BAR_LINKS)[number]["id"];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SilverArrows — Aviation E-Learning & Flight Logger" },
      {
        name: "description",
        content:
          "SilverArrows: Open-access aviation E-Learning (Air Manual - Pooley & Air Law) and complete Flight Logger academy operations platform.",
      },
      {
        property: "og:title",
        content: "SilverArrows — Aviation E-Learning & Flight Logger",
      },
      {
        property: "og:description",
        content:
          "Open-access aviation theory e-learning and comprehensive flight logger operations for students, instructors, and administrators.",
      },
    ],
  }),
  component: MinimalLandingPage,
});

function MinimalLandingPage() {
  const [badgeHighlight, setBadgeHighlight] = useState(0);
  const [sequenceSettled, setSequenceSettled] = useState(false);
  const [activeTopBarSection, setActiveTopBarSection] = useState<TopBarSectionId | null>(null);

  const handleBoundaryHighlight = useCallback((intensity: number, settled: boolean) => {
    setBadgeHighlight(intensity);
    setSequenceSettled(settled);
  }, []);

  // Triggered at the exact moment the flying logo strikes the Silver Arrow's box!
  const logoStruckBox = sequenceSettled || badgeHighlight >= 0.35;
  const activeGlow = sequenceSettled ? Math.max(0.55, badgeHighlight) : badgeHighlight;
  const selectedTopBarItem = TOP_BAR_LINKS.find((item) => item.id === activeTopBarSection);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased flex flex-col justify-between selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* Top Header with Navigation Links ("Details to be added soon") & Theme Toggle */}
      <header className="relative z-30 border-b border-border/80 bg-background/85 px-4 py-3.5 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 transition hover:opacity-90">
            <BrandLogo className="h-10 sm:h-12" />
          </Link>

          <nav
            aria-label="Homepage information links"
            className="flex flex-wrap items-center gap-1 sm:gap-2"
          >
            {TOP_BAR_LINKS.map((item) => {
              const isSelected = activeTopBarSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setActiveTopBarSection((prev) => (prev === item.id ? null : item.id))
                  }
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-card/80 hover:text-foreground"
                  }`}
                >
                  {item.id === "team-members" ? (
                    <Users className="h-3.5 w-3.5 opacity-80" />
                  ) : (
                    <Info className="h-3.5 w-3.5 opacity-80" />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />
          </div>
        </div>

        {/* Expandable Info Strip when a Top Bar Link (About Us, Team Members, etc.) is clicked */}
        {selectedTopBarItem && (
          <div
            data-testid="top-bar-coming-soon-panel"
            className="mx-auto mt-3 flex w-full max-w-[1600px] items-center justify-between gap-4 rounded-2xl border border-primary/35 bg-card/90 px-4 py-3 text-xs sm:text-sm shadow-lg backdrop-blur-xl"
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <Clock className="h-3.5 w-3.5" />
                {selectedTopBarItem.label}
              </span>
              <span className="font-semibold text-foreground">
                Details to be added soon.
              </span>
              <span className="hidden text-muted-foreground md:inline">
                — {selectedTopBarItem.subtitle}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTopBarSection(null)}
              aria-label="Close information notice"
              className="rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </header>

      {/* Two-Region Homepage Composition:
          LEFT (41-42% on desktop): Circular Avionics PFD/HSI takeoff sequence & interactive aircraft controller
          RIGHT (58-59% on desktop): Blurred right-side backdrop + Silver Arrow's strike box that
                                     reveals the 2-line heading text and menu cards upon logo impact */}
      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div
          data-testid="homepage-two-region-layout"
          className="relative flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8 xl:gap-10"
        >
          {/* LEFT REGION: Contained Circular Avionics Visual Area */}
          <section
            aria-label="Aviation takeoff visual sequence"
            data-testid="homepage-left-visual-region"
            className="relative z-20 w-full lg:w-[41%] xl:w-[42%] shrink-0"
          >
            <HomepageAviationSequence onBoundaryHighlightChange={handleBoundaryHighlight} />
          </section>

          {/* RIGHT REGION: Blurred Backdrop + Strike-Revealed Heading & Menu Cards */}
          <section
            aria-label="SilverArrows E-Learning and Flight Logger"
            data-testid="homepage-right-content-region"
            className="relative z-10 w-full lg:w-[59%] xl:w-[58%] lg:pl-8 xl:pl-10"
          >
            {/* Blurred Right-Side Frosted Glass Background & Ambient Illumination Aura */}
            <div
              data-testid="right-side-backdrop-blur"
              aria-hidden="true"
              className={`pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] transition-all duration-700 sm:-inset-6 ${
                logoStruckBox
                  ? "border border-primary/25 bg-card/35 opacity-100 shadow-2xl backdrop-blur-2xl"
                  : "border border-transparent bg-card/10 opacity-40 backdrop-blur-md"
              }`}
              style={{
                backgroundImage: logoStruckBox
                  ? "radial-gradient(circle at 28% 16%, color-mix(in oklch, var(--primary) 22%, transparent) 0%, transparent 58%), radial-gradient(circle at 75% 65%, color-mix(in oklch, var(--primary) 10%, transparent) 0%, transparent 65%)"
                  : undefined,
              }}
            />

            <div className="relative text-left lg:max-w-none">
              {/* Two-Line Heading:
                  Line 1: Welcome to [Silver Arrow's]
                  Line 2: E-Learning Academy & Flight Logger OS */}
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-[1.95rem] xl:text-[2.25rem] 2xl:text-[2.5rem] leading-tight">
                {/* LINE 1: "Welcome to" + Silver Arrow's Box */}
                <span className="flex flex-wrap items-center gap-2.5 sm:flex-nowrap">
                  <span
                    className={`inline-block whitespace-nowrap transition-all duration-500 ease-out ${
                      logoStruckBox
                        ? "translate-y-0 opacity-100 blur-none"
                        : "translate-y-2 opacity-0 blur-sm"
                    }`}
                  >
                    Welcome to
                  </span>

                  {/* Target Box: Always visible as the destination beacon; erupts with illumination on strike */}
                  <span
                    id="silver-arrows-target-badge"
                    data-testid="settled-brand-emblem-badge"
                    data-settled={logoStruckBox ? "true" : "false"}
                    className="relative inline-flex items-center gap-2.5 rounded-2xl border bg-card/90 px-3.5 py-1 whitespace-nowrap backdrop-blur-md transition-all duration-300"
                    style={{
                      borderColor: logoStruckBox
                        ? "var(--primary)"
                        : "color-mix(in oklch, var(--primary) 40%, transparent)",
                      boxShadow: logoStruckBox
                        ? `0 0 ${Math.round(22 + activeGlow * 30)}px -2px var(--primary), inset 0 0 ${Math.round(10 + activeGlow * 16)}px color-mix(in oklch, var(--primary) ${Math.round(16 + activeGlow * 24)}%, transparent)`
                        : "0 0 12px -4px color-mix(in oklch, var(--primary) 30%, transparent)",
                    }}
                  >
                    {/* Subtle Shockwave Ring when Logo Strikes the Box */}
                    {logoStruckBox && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-1 rounded-2xl border border-primary/50 opacity-0 animate-[ping_0.85s_cubic-bezier(0,0,0.2,1)_1]"
                      />
                    )}
                    <img
                      id="silver-arrows-target-logo"
                      src="/favicon.png"
                      alt=""
                      aria-hidden="true"
                      className="h-7 w-7 shrink-0 object-contain transition-all duration-200 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
                      style={{
                        opacity: logoStruckBox ? 1 : 0.14,
                        filter: logoStruckBox
                          ? "drop-shadow(0 0 12px var(--primary))"
                          : "grayscale(1)",
                        transform: logoStruckBox ? "scale(1)" : "scale(0.9)",
                      }}
                    />
                    <span className="font-black tracking-tight text-primary transition-colors duration-300">
                      Silver Arrow&apos;s
                    </span>
                  </span>
                </span>

                {/* LINE 2: E-Learning Academy & Flight Logger OS */}
                <span
                  className={`mt-2 block sm:whitespace-nowrap transition-all delay-75 duration-500 ease-out ${
                    logoStruckBox
                      ? "translate-y-0 opacity-100 blur-none"
                      : "translate-y-2 opacity-0 blur-sm"
                  }`}
                >
                  E-Learning Academy &amp;{" "}
                  <span className="text-primary transition-colors duration-300">
                    Flight Logger OS
                  </span>
                </span>
              </h1>

              {/* Subtitle Description: Revealed upon Logo Strike */}
              <p
                className={`mt-3.5 text-sm text-muted-foreground sm:text-lg leading-relaxed transition-all delay-100 duration-500 ease-out ${
                  logoStruckBox
                    ? "translate-y-0 opacity-100 blur-none"
                    : "translate-y-3 opacity-0 blur-md"
                }`}
              >
                Role-assigned ground school theory with interactive cockpit diagrams alongside a
                certified flight logging, scheduling, and regulatory audit management system.
              </p>
            </div>

            {/* The Two Distinct Core Menu Tiles: Revealed with Staggered Unblur when Logo Strikes Box */}
            <div
              data-testid="homepage-revealed-menu-cards"
              data-revealed={logoStruckBox ? "true" : "false"}
              className={`mt-7 grid gap-5 sm:grid-cols-2 transition-all delay-150 duration-600 ease-out ${
                logoStruckBox
                  ? "translate-y-0 scale-100 opacity-100 blur-none"
                  : "pointer-events-none translate-y-5 scale-[0.97] opacity-0 blur-md"
              }`}
            >
              {/* Tile 1: E-Learning */}
              <div className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card/85 p-5 shadow-sm backdrop-blur-xl transition-all hover:border-primary/60 hover:shadow-lg sm:p-6">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      Admin Course Assignment
                    </span>
                  </div>
                  <h2 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">
                    E-Learning Ground School
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Administrator-managed course portal for <strong>Air Manual — Pooley</strong> (19
                    chapters with interactive diagrams) and <strong>Air Law</strong>. Administrators
                    assign courses here; members view only their assigned courses in their profile.
                  </p>
                  <div className="mt-4 space-y-2 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      <span>Air Manual — Pooley (19 Chapters &amp; Diagrams)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      <span>Air Law (Regulations, Airspace &amp; Rules of the Air)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <Button asChild className="h-10 w-full rounded-full font-semibold shadow-sm">
                    <Link to="/elearning">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Open E-Learning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Tile 2: Flight Logger */}
              <div className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card/85 p-5 shadow-sm backdrop-blur-xl transition-all hover:border-primary/60 hover:shadow-lg sm:p-6">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Plane className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      Academy Operations OS
                    </span>
                  </div>
                  <h2 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">
                    SilverArrows Flight Logger
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Certified operations platform with dedicated role portals for student pilots,
                    flight instructors (CFI), ground school instructors, and academy administrators.
                  </p>
                  <div className="mt-4 space-y-2 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      <span>Student, CFI, Ground &amp; Admin Portals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      <span>Electronic Logbooks, Fleet Tracking &amp; Audit Trail</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <Button
                    asChild
                    variant="default"
                    className="h-10 w-full rounded-full font-semibold shadow-sm"
                  >
                    <Link to="/login">
                      <Lock className="mr-2 h-4 w-4" />
                      Launch Flight Logger
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Minimal Feature Highlights Bar: Revealed after Menu Cards */}
            <div
              className={`mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 rounded-2xl border border-border/80 bg-card/55 px-5 py-3.5 text-xs font-medium text-muted-foreground backdrop-blur-xl transition-all delay-250 duration-600 ease-out ${
                logoStruckBox
                  ? "translate-y-0 opacity-100 blur-none"
                  : "pointer-events-none translate-y-4 opacity-0 blur-md"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Air Manual — Pooley (19
                Chapters)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Air Law Regulations
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Dedicated Role Portals
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Regulatory Compliance
                &amp; Audit Trail
              </span>
            </div>
          </section>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-border bg-card/20 px-6 py-4 text-xs text-muted-foreground">
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
