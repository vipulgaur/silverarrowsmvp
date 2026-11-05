import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ArrowRight, X } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { LandingTakeoffScene } from "@/components/landing-takeoff-scene";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { APP_BUILD_HASH } from "@/lib/build-info";
import { downloadDifferenceReportPdf } from "@/lib/difference-report-pdf";
import { ELEARNING_MODULES } from "@/lib/elearning-courses";

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
          "SilverArrows Flight Academy: ground-school e-learning and day-to-day flight operations for students, instructors and staff.",
      },
      {
        property: "og:title",
        content: "SilverArrows — Aviation E-Learning & Flight Logger",
      },
      {
        property: "og:description",
        content:
          "Study the theory for your licence, then book aircraft, log flights and keep training records in one place.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const [activeTopBarSection, setActiveTopBarSection] = useState<TopBarSectionId | null>(null);
  const selectedTopBarItem = TOP_BAR_LINKS.find((item) => item.id === activeTopBarSection);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground antialiased">
      <header className="relative z-30 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="transition-opacity hover:opacity-80">
            <BrandLogo className="h-10" />
          </Link>

          <nav
            aria-label="Academy information"
            className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto md:order-none md:mx-0 md:w-auto"
          >
            {TOP_BAR_LINKS.map((item) => {
              const isSelected = activeTopBarSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-expanded={isSelected}
                  onClick={() =>
                    setActiveTopBarSection((prev) => (prev === item.id ? null : item.id))
                  }
                  className={`shrink-0 rounded-md px-3 py-2 text-sm transition-colors ${
                    isSelected
                      ? "bg-secondary font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <ThemeToggle />
        </div>

        {selectedTopBarItem && (
          <div className="border-t border-border/70">
            <div
              data-testid="top-bar-coming-soon-panel"
              className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-2.5 text-sm sm:px-6 lg:px-8"
            >
              <p>
                <span className="font-medium text-foreground">{selectedTopBarItem.label}</span>
                <span className="text-muted-foreground"> · Details to be added soon.</span>
                <span className="hidden text-muted-foreground md:inline">
                  {" "}
                  {selectedTopBarItem.subtitle}
                </span>
              </p>
              <button
                type="button"
                onClick={() => setActiveTopBarSection(null)}
                aria-label="Close information notice"
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <section aria-labelledby="landing-title" className="relative">
          <LandingTakeoffScene className="h-[clamp(440px,68vh,660px)]" />

          {/* Soft scrim on the text side only, so copy stays legible over the sky */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-background/55 via-background/15 to-transparent md:w-2/3"
          />

          <div className="pointer-events-none absolute inset-x-0 top-0">
            <div className="mx-auto w-full max-w-7xl px-4 pt-[11vh] sm:px-6 lg:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/75">
                SilverArrows Flight Academy
              </p>
              <h1
                id="landing-title"
                className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
              >
                Ground school and flight operations, in one place.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/80 sm:text-lg">
                Students study the theory and track their progress. Instructors and staff run
                bookings, logbooks and the fleet.
              </p>
            </div>
          </div>
        </section>

        <section
          aria-label="Choose where to go"
          className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:pt-12 sm:px-6 lg:px-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <OptionCard
              system="E-Learning"
              title="Ground School"
              description="Study the theory for your licence at your own pace. Your instructor assigns the courses you need."
              points={[
                `${ELEARNING_MODULES.length} theory courses, from Air Law to Powerplant`,
                "Chapters with figures, notes and bookmarks",
                "Progress saved to your profile",
              ]}
              action={
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link to="/elearning" data-testid="landing-btn-elearning">
                    Open e-learning
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              }
            />
            <OptionCard
              system="Flight Logger"
              title="Flight Operations"
              description="Book aircraft, log flights and keep training records for students, instructors and staff."
              points={[
                "Bookings and the daily schedule",
                "Logbook entries with instructor sign-off",
                "Fleet status and maintenance tracking",
              ]}
              action={
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link to="/login" data-testid="landing-btn-flight-logger">
                    Sign in to operations
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              }
            />
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Accounts are issued by the academy. New students can request access from the sign-in
            page, and an administrator approves each request.
          </p>
        </section>
      </main>

      <footer className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <BrandLogo className="h-8" />
            <span>&copy; {new Date().getFullYear()} SilverArrows Flight Academy</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => downloadDifferenceReportPdf()}
              data-testid="download-difference-report-pdf"
              className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Platform difference report (PDF)
            </button>
            <span
              data-testid="landing-build-badge"
              className="rounded border border-border px-2 py-0.5 font-mono text-[11px]"
            >
              Build #{APP_BUILD_HASH}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function OptionCard({
  system,
  title,
  description,
  points,
  action,
}: {
  system: string;
  title: string;
  description: string;
  points: string[];
  action: ReactNode;
}) {
  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_18px_40px_-20px_rgb(0_0_0/0.35)] backdrop-blur-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {system}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {description}
      </p>
      <ul className="mt-6 space-y-2.5 border-t border-border pt-6 text-sm text-foreground">
        {points.map((point) => (
          <li key={point} className="flex items-baseline gap-3">
            <span
              aria-hidden="true"
              className="h-px w-3 shrink-0 translate-y-[-0.3em] bg-foreground/40"
            />
            {point}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-8">{action}</div>
    </article>
  );
}
