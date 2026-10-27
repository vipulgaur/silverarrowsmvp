import { useState, type KeyboardEvent } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  FileText,
  Globe,
  HelpCircle,
  Info,
  Layers,
  Lightbulb,
  RotateCcw,
  Scale,
  Shield,
  Sparkles,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface AirLawChapterExperienceProps {
  completed: boolean;
  onToggleComplete: () => void;
  onLogInteraction?: (action: string, details: string) => void;
}

interface AirLawQuizQuestion {
  id: string;
  q: string;
  options: string[];
  answer: number;
  why: string;
}

const AIR_LAW_KEY_FACTS = [
  {
    id: "alf-1",
    badge: "Article 1",
    statement: "Every State has complete and exclusive sovereignty over the airspace above its territory.",
    detail: "Chicago Convention Article 1: territory includes land areas and territorial waters adjacent thereto.",
    targetTab: "chicago",
  },
  {
    id: "alf-2",
    badge: "ICAO Council",
    statement: "The ICAO Council has 36 Member States; the Air Navigation Commission has 19 members.",
    detail: "The Assembly elects the Council every 3 years. The Council adopts international Standards and Recommended Practices (SARPs).",
    targetTab: "chicago",
  },
  {
    id: "alf-3",
    badge: "Article 38",
    statement: "A State unable to comply with an ICAO Standard must notify ICAO immediately.",
    detail: "When ICAO amends a Standard, States have 60 days to register differences under Article 38.",
    targetTab: "chicago",
  },
  {
    id: "alf-4",
    badge: "Freedoms",
    statement: "Freedoms 1 and 2 are technical transit freedoms; Freedoms 3 to 5 are commercial freedoms.",
    detail: "First freedom: fly across without landing. Second freedom: land for non-traffic purposes (refuelling/technical).",
    targetTab: "freedoms",
  },
  {
    id: "alf-5",
    badge: "Air Law Treaties",
    statement: "Tokyo 1963 covers offences on board; Hague 1970 covers hijacking; Montreal 1971 covers sabotage.",
    detail: "Warsaw 1929 and Montreal 1999 establish airline liability for passenger injury, delay, and baggage loss.",
    targetTab: "treaties",
  },
  {
    id: "alf-6",
    badge: "Airspace Classes",
    statement: "Class A permits IFR flights only; all flights receive positive ATC separation.",
    detail: "VFR flights are prohibited in Class A airspace. In Class G, all flights receive flight information service on request.",
    targetTab: "airspace",
  },
  {
    id: "alf-7",
    badge: "VMC Minima",
    statement: "At and above 10,000 ft AMSL, VMC flight visibility minimum is 8 km (5 km below 10,000 ft).",
    detail: "Distance from cloud: 1,500 m horizontally and 1,000 ft (300 m) vertically in controlled airspace.",
    targetTab: "airspace",
  },
  {
    id: "alf-8",
    badge: "Documents (Art. 29)",
    statement: "Every international flight must carry C of R, C of A, Crew Licences, and Journey Log Book.",
    detail: "If carrying passengers, add the passenger list. If carrying cargo, add manifests and declarations.",
    targetTab: "chicago",
  },
];

const GUIDED_STEPS = [
  {
    step: 1,
    tag: "Why Air Law Exists",
    title: "International Aviation Needs Shared Rules",
    summary:
      "A single flight between international hubs crosses multiple countries. Each country possesses sovereignty over its airspace. Without common international agreements, international flight would be impossible.",
    keyPoints: [
      "Chicago Convention established global civil aviation standards in 1944",
      "ICAO creates Standards and Recommended Practices (SARPs)",
      "National regulators (DGCA, EASA, FAA) enforce rules locally",
    ],
    takeaway: "International treaties guarantee safe, seamless navigation across national boundaries.",
  },
  {
    step: 2,
    tag: "Chicago Convention",
    title: "Airspace Sovereignty & The 19 Annexes",
    summary:
      "Article 1 establishes complete and exclusive sovereignty. Annex 1 covers Personnel Licensing, Annex 2 covers Rules of the Air, Annex 6 covers Operation of Aircraft, and Annex 8 covers Airworthiness.",
    keyPoints: [
      "Applicable strictly to civil aircraft (not state/military aircraft, Art. 3)",
      "Cabotage (Art. 7): States may refuse foreign domestic commercial transport",
      "Rules of the Air (Art. 12): every State must enforce its national airspace rules",
    ],
    takeaway: "ICAO sets the international standards; each contracting State turns them into local statutory law.",
  },
  {
    step: 3,
    tag: "Freedoms of the Air",
    title: "Technical Transit vs Commercial Transport",
    summary:
      "The Transit Agreement grants 1st and 2nd freedoms. The Transport Agreement grants commercial carriage (3rd, 4th, and 5th freedoms between home and destination States).",
    keyPoints: [
      "1st Freedom: fly across territory without landing",
      "2nd Freedom: land for non-traffic technical reasons (refuelling)",
      "3rd & 4th Freedoms: carry traffic from/to airline's homeland",
      "5th Freedom: carry traffic between two foreign States on a route linking the homeland",
    ],
    takeaway: "Transit freedoms are technical; transport freedoms require bilateral or multilateral commercial rights.",
  },
  {
    step: 4,
    tag: "Aviation Security",
    title: "Offences, Hijacking, and Carrier Liability",
    summary:
      "Tokyo 1963 empowers the aircraft commander to restrain offenders. Hague 1970 penalises unlawful seizure of aircraft. Montreal 1971 covers acts of sabotage. Montreal 1999 governs passenger compensation.",
    keyPoints: [
      "Commander may require crew help, but may only request passenger assistance",
      "Hague applies to aircraft in flight (external doors closed)",
      "Montreal 1999 sets strict two-tier liability for passenger death or injury",
    ],
    takeaway: "The commander exercises quasi-judicial authority to ensure flight security and safety of all on board.",
  },
  {
    step: 5,
    tag: "Airspace & Weather",
    title: "Airspace Classes A through G & VMC Criteria",
    summary:
      "ICAO defines classes A to G. Classes A to E are controlled airspace; Class G is uncontrolled. Visual Flight Rules (VFR) require specific flight visibility and cloud clearance.",
    keyPoints: [
      "Class A: IFR only; continuous two-way communication and ATC clearance required",
      "Class D/E: VFR permitted with appropriate speed limits (250 kt IAS below 10,000 ft)",
      "Class G: open flight information service; pilot maintains separation",
    ],
    takeaway: "Know your airspace boundary: operating VFR into Class A is a serious regulatory violation.",
  },
  {
    step: 6,
    tag: "Rules of the Air",
    title: "Collision Avoidance & Right of Way",
    summary:
      "Aircraft approaching head-on must both alter heading to the right. An aircraft being overtaken has right of way; the overtaking aircraft must pass to the right. Balloons and gliders have priority over power-driven aeroplanes.",
    keyPoints: [
      "Right-of-way order: Balloon > Glider > Airship > Towing aircraft > Powered aeroplane",
      "Landing aircraft on final approach have right of way over aircraft in flight or on ground",
      "Semicircular cruising level rules apply based on magnetic track",
    ],
    takeaway: "Look-out scan and adherence to standard right-of-way rules prevent mid-air collisions.",
  },
];

const AIR_LAW_DISTINCTIONS = [
  {
    id: "dist-al-1",
    title: "ICAO Standard vs Recommended Practice (SARPs)",
    leftName: "ICAO Standard",
    leftRole: "Mandatory Technical Specification",
    rightName: "Recommended Practice",
    rightRole: "Desirable Aviation Practice",
    keyDifference:
      "A State unable to comply with a Standard MUST notify ICAO immediately (Article 38). For Recommended Practices, notification is urged but not legally mandatory.",
  },
  {
    id: "dist-al-2",
    title: "Transit Agreement vs Transport Agreement",
    leftName: "Transit Agreement",
    leftRole: "1st & 2nd Technical Freedoms",
    rightName: "Transport Agreement",
    rightRole: "3rd, 4th & 5th Commercial Freedoms",
    keyDifference:
      "Transit gives the right to overfly and land for fuel/technical reasons. Transport gives commercial rights to carry paying passengers and cargo.",
  },
  {
    id: "dist-al-3",
    title: "Tokyo Convention 1963 vs Hague Convention 1970",
    leftName: "Tokyo 1963",
    leftRole: "Offences & Misconduct On Board",
    rightName: "Hague 1970",
    rightRole: "Unlawful Seizure (Hijacking)",
    keyDifference:
      "Tokyo empowers the commander to maintain order and restrain unruly persons on board. Hague specifically makes hijacking an extraditable international offence.",
  },
  {
    id: "dist-al-4",
    title: "Class A Airspace vs Class G Airspace",
    leftName: "Class A Airspace",
    leftRole: "Controlled · IFR Flights Only",
    rightName: "Class G Airspace",
    rightRole: "Uncontrolled · IFR and VFR",
    keyDifference:
      "Class A prohibits VFR completely and requires continuous ATC separation. Class G permits VFR without ATC clearance; pilots fly by see-and-avoid.",
  },
];

const AIR_LAW_QUESTIONS: AirLawQuizQuestion[] = [
  {
    id: "q1",
    q: "Which Article of the Chicago Convention gives every State complete and exclusive sovereignty over its airspace?",
    options: ["Article 3", "Article 7", "Article 1", "Article 12"],
    answer: 2,
    why: "Article 1 establishes complete and exclusive sovereignty over airspace; Article 3 limits the convention to civil aircraft.",
  },
  {
    id: "q2",
    q: "A State finds it impracticable to comply with an ICAO Standard. When must it notify ICAO?",
    options: ["Immediately", "Within 60 days", "Within 45 days", "At the next triennial Assembly"],
    answer: 0,
    why: "Article 38 requires immediate notification if a State cannot comply with a Standard. The 60-day rule applies when ICAO adopts an amendment.",
  },
  {
    id: "q3",
    q: "An aircraft lands in a foreign State solely to refuel, embarking and disembarking no passengers or cargo. Which Freedom of the Air is this?",
    options: ["1st Freedom", "2nd Freedom", "3rd Freedom", "5th Freedom"],
    answer: 1,
    why: "The 2nd freedom gives the right to land in a foreign State for non-traffic purposes (technical landing / refuelling).",
  },
  {
    id: "q4",
    q: "How many Contracting States sit on the ICAO Council?",
    options: ["19 States", "36 States", "54 States", "193 States"],
    answer: 1,
    why: "The Council consists of 36 States elected by the Assembly. The Air Navigation Commission consists of 19 independent experts.",
  },
  {
    id: "q5",
    q: "Under the Tokyo Convention 1963, whose assistance may the aircraft commander legally REQUIRE (order), not merely request?",
    options: ["Able-bodied passengers", "Other crew members", "Airport security officers at destination", "Any pilot in the cabin"],
    answer: 1,
    why: "Under Tokyo Article 6(2), the commander may require other crew members to help restrain an offender, but may only request or authorise passengers.",
  },
  {
    id: "q6",
    q: "Which international convention specifically defines and penalises the offence of Hijacking (unlawful seizure of aircraft)?",
    options: ["Tokyo Convention 1963", "Warsaw Convention 1929", "Hague Convention 1970", "Rome Convention 1952"],
    answer: 2,
    why: "The Hague Convention 1970 covers unlawful seizure of aircraft (hijacking). Montreal 1971 covers sabotage, and Tokyo 1963 covers offences on board.",
  },
  {
    id: "q7",
    q: "In Class A controlled airspace, which flight operations are permitted?",
    options: ["Both IFR and VFR flights", "IFR flights only", "VFR flights with special VMC clearance", "SVFR helicopters only"],
    answer: 1,
    why: "Class A airspace is restricted strictly to IFR flights. VFR flights are completely prohibited.",
  },
  {
    id: "q8",
    q: "Two aeroplanes are approaching head-on at the same altitude. What avoidance action must both pilots take?",
    options: ["Both turn left", "Both turn right", "The higher aircraft climbs and the lower descends", "The aircraft on the right has right of way"],
    answer: 1,
    why: "Under standard Rules of the Air, when two aircraft are approaching head-on or approximately so, each must alter its heading to the right.",
  },
];

export function AirLawChapterExperience({
  completed,
  onToggleComplete,
  onLogInteraction,
}: AirLawChapterExperienceProps) {
  const [activeTab, setActiveTab] = useState<"chicago" | "freedoms" | "treaties" | "airspace">("chicago");
  const [guidedStepIndex, setGuidedStepIndex] = useState(0);
  const [guidedOpen, setGuidedOpen] = useState(true);
  const [visitedSteps, setVisitedSteps] = useState<number[]>([0]);

  // Quiz state
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const activeGuidedStep = GUIDED_STEPS[guidedStepIndex]!;
  const answeredCount = Object.keys(answers).length;
  const correctCount = AIR_LAW_QUESTIONS.filter((q) => answers[q.id] === q.answer).length;

  function scrollToElement(elementId: string, label?: string) {
    const el = document.getElementById(elementId);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (label) {
      onLogInteraction?.("airlaw_nav", `Jumped to ${label}`);
    }
  }

  function handleSelectGuidedStep(idx: number) {
    const clamped = Math.max(0, Math.min(GUIDED_STEPS.length - 1, idx));
    setGuidedStepIndex(clamped);
    setVisitedSteps((prev) => (prev.includes(clamped) ? prev : [...prev, clamped]));
  }

  function handleGuidedKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleSelectGuidedStep(guidedStepIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleSelectGuidedStep(guidedStepIndex - 1);
    }
  }

  function handleSelectAnswer(questionId: string, optionIdx: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    onLogInteraction?.("airlaw_quiz", `Answered ${questionId} with option ${optionIdx}`);
  }

  return (
    <div
      data-testid="airlaw-interactive-chapter"
      className="relative space-y-12 text-foreground rounded-3xl p-1 sm:p-2 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-[size:22px_22px]"
    >
      {/* =====================================================================
          1. STICKY IN-CHAPTER STAGE NAVIGATION BAR
         ===================================================================== */}
      <nav
        aria-label="Chapter learning stages"
        className="sticky top-16 z-30 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border/90 bg-background/90 px-3.5 py-2.5 shadow-sm backdrop-blur-md"
      >
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => scrollToElement("airlaw-key-facts", "Key Facts")}
            className="rounded-full px-2.5 py-1 font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            1. Key Facts
          </button>
          <button
            type="button"
            onClick={() => scrollToElement("airlaw-guided-intro", "Guided Intro")}
            className="rounded-full px-2.5 py-1 font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            2. Guided Intro
          </button>
          <button
            type="button"
            onClick={() => scrollToElement("airlaw-regulatory-explorer", "Regulatory Explorer")}
            className="rounded-full bg-primary/15 px-3 py-1 font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            3. Regulatory Explorer
          </button>
          <button
            type="button"
            onClick={() => scrollToElement("airlaw-distinctions", "Core Distinctions")}
            className="rounded-full px-2.5 py-1 font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            4. Do Not Confuse
          </button>
          <button
            type="button"
            onClick={() => scrollToElement("airlaw-knowledge-checks", "Practice Test")}
            className="rounded-full px-2.5 py-1 font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            5. Knowledge Check ({AIR_LAW_QUESTIONS.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={completed ? "default" : "outline"}
            onClick={onToggleComplete}
            className="h-8 gap-1.5 text-xs font-semibold rounded-full"
          >
            <CheckCircle2 className={`h-3.5 w-3.5 ${completed ? "text-emerald-300" : ""}`} />
            {completed ? "Completed" : "Mark as Complete"}
          </Button>
        </div>
      </nav>

      {/* =====================================================================
          2. CHAPTER HERO AND INTRODUCTION
         ===================================================================== */}
      <section
        id="airlaw-hero"
        aria-label="Air Law chapter introduction"
        className="rounded-3xl border border-border bg-card/80 p-6 shadow-xs sm:p-8"
      >
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.85fr] lg:items-center">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 font-semibold text-primary">
                <Scale className="h-3.5 w-3.5" />
                Air Law &amp; Regulations
              </span>
              <span className="rounded-full border border-border bg-background/80 px-2.5 py-0.5 font-medium text-muted-foreground">
                ICAO, Chicago Convention &amp; Rules of the Air
              </span>
              {completed ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                </span>
              ) : (
                <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 font-semibold text-amber-600 dark:text-amber-400">
                  In Progress
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
              International Civil Aviation Law &amp; Operating Regulations
            </h1>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Air law provides the legal foundation for every flight. It establishes national sovereignty, defines the technical standards of ICAO, grants the freedoms of the air, and establishes rules of the air to avoid collisions. Study each international treaty, airspace boundary, and pilot responsibility.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                onClick={() => scrollToElement("airlaw-regulatory-explorer", "Start Learning")}
                className="rounded-full font-semibold shadow-xs"
              >
                <Compass className="mr-1.5 h-4 w-4" />
                Start Learning (Regulatory Explorer)
              </Button>
              <Button
                variant="outline"
                onClick={() => scrollToElement("airlaw-key-facts", "Review Key Facts")}
                className="rounded-full font-medium"
              >
                <Lightbulb className="mr-1.5 h-4 w-4 text-primary" />
                Review Key Facts
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setGuidedOpen(true);
                  scrollToElement("airlaw-guided-intro", "Guided Introduction");
                }}
                className="rounded-full text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                6-Step Guided Walkthrough →
              </Button>
            </div>
          </div>

          {/* Air Law Focus Card */}
          <div className="overflow-hidden rounded-2xl border border-border bg-background/90 p-4 shadow-xs">
            <div className="rounded-xl border border-border/60 bg-primary/5 p-6 text-center space-y-2">
              <Globe className="mx-auto h-12 w-12 text-primary" />
              <h2 className="text-base font-bold text-foreground">Chicago Convention 1944</h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                193 Contracting States · 19 Technical Annexes · Global Standardisation of Civil Aviation
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 px-1 text-xs">
              <div>
                <p className="font-semibold text-foreground">Civil Aviation Law</p>
                <p className="text-[11px] text-muted-foreground">4 interactive modules · 8 verified exam topics</p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => scrollToElement("airlaw-regulatory-explorer", "Explore")}
                className="h-8 rounded-full px-3 text-xs font-semibold"
              >
                Explore →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. QUICK REVISION ("REMEMBER / KEY FACTS")
         ===================================================================== */}
      <section
        id="airlaw-key-facts"
        aria-labelledby="alf-heading"
        className="scroll-mt-32 space-y-4"
      >
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Quick Revision · Remember
            </p>
            <h2 id="alf-heading" className="mt-1 text-xl font-bold tracking-tight text-foreground">
              8 Essential Rules for Aviation Law Exams
            </h2>
          </div>
          <span className="rounded-full bg-muted px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
            {AIR_LAW_KEY_FACTS.length} Key Facts
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {AIR_LAW_KEY_FACTS.map((fact, idx) => (
            <div
              key={fact.id}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card/75 p-4 transition hover:border-primary/60 hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                    {fact.badge}
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-muted-foreground">
                    0{idx + 1}
                  </span>
                </div>
                <p className="mt-2.5 text-xs font-semibold leading-relaxed text-foreground">
                  {fact.statement}
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                  {fact.detail}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab(fact.targetTab as any);
                  scrollToElement("airlaw-regulatory-explorer", fact.badge);
                }}
                className="mt-3 inline-flex items-center gap-1 text-left text-[11px] font-semibold text-primary transition group-hover:translate-x-0.5 hover:underline"
              >
                <span>Study in Explorer</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          4. GUIDED STEP-BY-STEP INTRO CAROUSEL ("START HERE")
         ===================================================================== */}
      <section
        id="airlaw-guided-intro"
        aria-labelledby="alg-heading"
        onKeyDown={handleGuidedKeyDown}
        className="scroll-mt-32 rounded-3xl border border-border bg-card/85 p-5 shadow-xs sm:p-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
              {guidedStepIndex + 1}/{GUIDED_STEPS.length}
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Guided Introduction · Step {guidedStepIndex + 1} of {GUIDED_STEPS.length}
              </p>
              <h2 id="alg-heading" className="text-lg font-bold tracking-tight text-foreground">
                Orientation to Aviation Law
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGuidedOpen((prev) => !prev)}
              aria-expanded={guidedOpen}
              className="h-8 rounded-full px-3 text-xs font-medium"
            >
              {guidedOpen ? (
                <>
                  <ChevronUp className="mr-1 h-3.5 w-3.5" />
                  Skip / Collapse Intro
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1 h-3.5 w-3.5" />
                  Resume Intro (Step {guidedStepIndex + 1}/{GUIDED_STEPS.length})
                </>
              )}
            </Button>
          </div>
        </div>

        {guidedOpen && (
          <div className="mt-5 space-y-5">
            <div
              role="tablist"
              aria-label="Guided introduction steps"
              className="flex flex-wrap items-center gap-1.5"
            >
              {GUIDED_STEPS.map((s, idx) => {
                const isCurrent = idx === guidedStepIndex;
                const isVisited = visitedSteps.includes(idx);
                return (
                  <button
                    key={s.step}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    onClick={() => handleSelectGuidedStep(idx)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                      isCurrent
                        ? "border-primary bg-primary text-primary-foreground shadow-xs"
                        : isVisited
                          ? "border-primary/35 bg-primary/10 text-foreground hover:border-primary"
                          : "border-border bg-background/70 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{s.step}.</span>
                    <span className="hidden sm:inline">{s.tag}</span>
                    {isVisited && !isCurrent && <Check className="h-3 w-3 text-primary" />}
                  </button>
                );
              })}
            </div>

            <div className="grid gap-5 rounded-2xl border border-border/80 bg-background/75 p-5 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
              <div className="space-y-3">
                <span className="inline-block rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  {activeGuidedStep.tag}
                </span>
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  {activeGuidedStep.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {activeGuidedStep.summary}
                </p>
                <ul className="space-y-1.5 pt-1 text-xs text-foreground/90">
                  {activeGuidedStep.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col justify-between gap-4 rounded-xl border border-primary/25 bg-primary/5 p-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    Key Takeaway
                  </p>
                  <p className="mt-1.5 text-xs font-medium leading-relaxed text-foreground">
                    {activeGuidedStep.takeaway}
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => scrollToElement("airlaw-regulatory-explorer", activeGuidedStep.tag)}
                    className="w-full justify-between text-xs font-semibold"
                  >
                    <span>Open in Regulatory Explorer</span>
                    <Target className="h-3.5 w-3.5 text-primary" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <Button
                variant="outline"
                size="sm"
                disabled={guidedStepIndex === 0}
                onClick={() => handleSelectGuidedStep(guidedStepIndex - 1)}
                className="rounded-full"
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Previous Step
              </Button>

              <span className="text-xs text-muted-foreground">
                Tip: Use Left / Right arrow keys or select any step above
              </span>

              {guidedStepIndex < GUIDED_STEPS.length - 1 ? (
                <Button
                  size="sm"
                  onClick={() => handleSelectGuidedStep(guidedStepIndex + 1)}
                  className="rounded-full font-semibold"
                >
                  Next Step
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => scrollToElement("airlaw-regulatory-explorer", "Explorer")}
                  className="rounded-full font-semibold"
                >
                  Explore Regulations
                  <ArrowDown className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* =====================================================================
          5. REGULATORY EXPLORER (Interactive Matrix & Tabs)
         ===================================================================== */}
      <section
        id="airlaw-regulatory-explorer"
        aria-label="Regulatory Explorer"
        className="scroll-mt-32 rounded-3xl border border-primary/35 bg-card p-5 shadow-sm sm:p-7 space-y-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Globe className="h-3.5 w-3.5" />
              Interactive Regulatory Explorer
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              Civil Aviation Framework &amp; International Standards
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Select any regulatory topic below to explore verified rules, treaties, and definitions.
            </p>
          </div>

          <div
            role="tablist"
            className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-border bg-background/80 p-1.5"
          >
            {[
              { id: "chicago", label: "Chicago Convention & ICAO" },
              { id: "freedoms", label: "Freedoms of the Air" },
              { id: "treaties", label: "Security & Liability" },
              { id: "airspace", label: "Airspace Classes & VMC" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Chicago & ICAO */}
        {activeTab === "chicago" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-border bg-background p-4 space-y-2">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                  Article 1
                </span>
                <h3 className="font-bold text-sm text-foreground">Airspace Sovereignty</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every State has complete and exclusive sovereignty over the airspace above its territory and territorial waters. No scheduled international air service may operate across or into territory without special permission.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4 space-y-2">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                  Article 3
                </span>
                <h3 className="font-bold text-sm text-foreground">Civil vs State Aircraft</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The Chicago Convention applies only to civil aircraft; it does not apply to state aircraft (military, customs, and police services). State aircraft require specific diplomatic authorization to overfly foreign territory.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4 space-y-2">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                  Article 38
                </span>
                <h3 className="font-bold text-sm text-foreground">Notification of Differences</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If a contracting State finds it impracticable to comply with an ICAO Standard, it must immediately notify ICAO of the difference. When ICAO amends a standard, States have 60 days to register differences.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4 text-xs space-y-2">
              <p className="font-bold text-primary uppercase tracking-wider text-[11px]">
                Essential ICAO Annexes for Pilots:
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-foreground/90">
                <div>• <strong>Annex 1:</strong> Personnel Licensing</div>
                <div>• <strong>Annex 2:</strong> Rules of the Air</div>
                <div>• <strong>Annex 6:</strong> Operation of Aircraft</div>
                <div>• <strong>Annex 8:</strong> Airworthiness of Aircraft</div>
                <div>• <strong>Annex 10:</strong> Aeronautical Telecommunications</div>
                <div>• <strong>Annex 11:</strong> Air Traffic Services</div>
                <div>• <strong>Annex 12:</strong> Search and Rescue</div>
                <div>• <strong>Annex 14:</strong> Aerodromes &amp; Ground Aids</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Freedoms of the Air */}
        {activeTab === "freedoms" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { num: "1st Freedom", title: "Overflight Privilege", desc: "The right to fly across the territory of another State without landing." },
              { num: "2nd Freedom", title: "Technical Stop", desc: "The right to land in another State for non-traffic purposes (refuelling, maintenance)." },
              { num: "3rd Freedom", title: "Outbound Commercial Traffic", desc: "The right to carry passengers, cargo, and mail from the airline's home State to a foreign State." },
              { num: "4th Freedom", title: "Inbound Commercial Traffic", desc: "The right to carry passengers, cargo, and mail from a foreign State back to the airline's home State." },
              { num: "5th Freedom", title: "Beyond Commercial Rights", desc: "The right to carry traffic between two foreign States on a flight starting or ending in the home State." },
              { num: "Cabotage (Art. 7)", title: "Domestic Carriage", desc: "Carriage of traffic between two points within the same foreign territory; States reserve the right to refuse cabotage." },
            ].map((f) => (
              <div key={f.num} className="rounded-2xl border border-border bg-background p-4 space-y-2">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                  {f.num}
                </span>
                <h3 className="font-bold text-sm text-foreground">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Security & Liability */}
        {activeTab === "treaties" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                name: "Tokyo Convention 1963",
                tag: "Offences on Board Aircraft",
                desc: "Governs crimes and acts committed on board an aircraft in flight. Grants the aircraft commander authority to impose reasonable restraint on persons endangering safety, disembark them, or deliver them to law enforcement.",
                keyRule: "Crew members may be REQUIRED to assist; passengers may only be REQUESTED.",
              },
              {
                name: "Hague Convention 1970",
                tag: "Unlawful Seizure (Hijacking)",
                desc: "Establishes universal jurisdiction over anyone who unlawfully seizes or exercises control of an aircraft in flight by force or threat. Contracting States must either extradite the offender or submit the case for prosecution.",
                keyRule: "Applies from the moment external doors are closed following embarkation.",
              },
              {
                name: "Montreal Convention 1971",
                tag: "Sabotage & Unlawful Acts",
                desc: "Covers acts of sabotage and violence against civil aviation, including destroying an aircraft in service, placing dangerous devices on board, or damaging air navigation facilities.",
                keyRule: "Protects ground facilities, towers, and aircraft in service.",
              },
              {
                name: "Montreal Convention 1999",
                tag: "Airline Carrier Liability",
                desc: "Modernised passenger liability treaty replacing the Warsaw system. Establishes a strict two-tier liability system for passenger death or bodily injury, eliminating arbitrary liability caps.",
                keyRule: "First tier (up to ~128,821 SDR): strict liability that the airline cannot contest.",
              },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl border border-border bg-background p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-foreground">{t.name}</h3>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {t.tag}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                <div className="rounded-xl border border-primary/25 bg-primary/5 p-2.5 text-xs text-foreground font-medium">
                  <strong>Critical Exam Rule: </strong>{t.keyRule}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Airspace & VMC */}
        {activeTab === "airspace" && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-border bg-background">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/50 text-[11px] font-bold uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Airspace Class</th>
                    <th className="px-4 py-3">Flights Permitted</th>
                    <th className="px-4 py-3">Separation Provided</th>
                    <th className="px-4 py-3">Radio &amp; Clearance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-bold text-primary">Class A</td>
                    <td className="px-4 py-3">IFR Only</td>
                    <td className="px-4 py-3">All flights separated</td>
                    <td className="px-4 py-3">Continuous two-way radio + ATC clearance mandatory</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-foreground">Class B</td>
                    <td className="px-4 py-3">IFR and VFR</td>
                    <td className="px-4 py-3">All flights separated (IFR from IFR/VFR, VFR from VFR)</td>
                    <td className="px-4 py-3">Continuous two-way radio + ATC clearance mandatory</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-foreground">Class C</td>
                    <td className="px-4 py-3">IFR and VFR</td>
                    <td className="px-4 py-3">IFR from IFR and VFR; VFR from IFR; VFR receives traffic info</td>
                    <td className="px-4 py-3">Continuous two-way radio + ATC clearance mandatory</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-foreground">Class D</td>
                    <td className="px-4 py-3">IFR and VFR</td>
                    <td className="px-4 py-3">IFR from IFR; IFR receives VFR info; VFR receives traffic info</td>
                    <td className="px-4 py-3">Continuous two-way radio + ATC clearance mandatory</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-foreground">Class G</td>
                    <td className="px-4 py-3">IFR and VFR</td>
                    <td className="px-4 py-3">No separation; Flight Information Service provided on request</td>
                    <td className="px-4 py-3">Two-way radio required for IFR; VFR may operate non-radio</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4 text-xs space-y-2">
              <p className="font-bold text-primary uppercase tracking-wider text-[11px]">
                Standard VMC Weather Minima (ICAO Annex 2):
              </p>
              <div className="grid gap-2 sm:grid-cols-2 text-foreground/90">
                <div>• <strong>At or above 10,000 ft AMSL:</strong> Flight visibility 8 km; 1,500 m horizontal and 1,000 ft vertical from cloud.</div>
                <div>• <strong>Below 10,000 ft AMSL:</strong> Flight visibility 5 km; 1,500 m horizontal and 1,000 ft vertical from cloud.</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* =====================================================================
          6. "DO NOT CONFUSE" COMPARATIVE DISTINCTIONS
         ===================================================================== */}
      <section
        id="airlaw-distinctions"
        aria-labelledby="ald-heading"
        className="space-y-4"
      >
        <div className="flex items-center gap-2.5 border-b border-border/80 pb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Layers className="h-4 w-4" />
          </span>
          <div>
            <h2 id="ald-heading" className="text-lg font-bold tracking-tight text-foreground">
              Crucial Distinctions in Aviation Law
            </h2>
            <p className="text-xs text-muted-foreground">
              Frequently tested regulatory boundaries and pairs that catch students out
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {AIR_LAW_DISTINCTIONS.map((dist) => (
            <div
              key={dist.id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card/85 p-5 shadow-xs space-y-4"
            >
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                {dist.title}
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-background/80 p-3.5">
                  <p className="text-xs font-bold text-primary">{dist.leftName}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{dist.leftRole}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/80 p-3.5">
                  <p className="text-xs font-bold text-foreground">{dist.rightName}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{dist.rightRole}</p>
                </div>
              </div>

              <div className="rounded-xl bg-primary/10 px-3.5 py-2.5 text-xs font-medium text-foreground">
                <strong className="text-primary">Key Distinction: </strong>
                {dist.keyDifference}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          7. PRACTICE TEST & KNOWLEDGE CHECKS (Instant Feedback)
         ===================================================================== */}
      <section
        id="airlaw-knowledge-checks"
        aria-labelledby="alq-heading"
        className="rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-7 space-y-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <HelpCircle className="h-3.5 w-3.5" />
              Air Law Knowledge Checks
            </p>
            <h2 id="alq-heading" className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              Verify Your Understanding ({correctCount} / {AIR_LAW_QUESTIONS.length} Correct)
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Official DGCA / EASA exam-style questions with immediate answer feedback and rationale.
            </p>
          </div>

          {answeredCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAnswers({})}
              className="rounded-full text-xs"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset All Questions
            </Button>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {AIR_LAW_QUESTIONS.map((q, qIndex) => {
            const selectedOpt = answers[q.id];
            const isAnswered = selectedOpt !== undefined;
            const isCorrect = selectedOpt === q.answer;

            return (
              <div
                key={q.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-background/85 p-5 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-md bg-primary/10 px-2.5 py-0.5 font-bold text-primary">
                      Question {qIndex + 1}
                    </span>
                  </div>

                  <p className="text-sm font-bold leading-snug text-foreground">
                    {q.q}
                  </p>

                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isThisSelected = selectedOpt === optIdx;
                      const isThisCorrect = optIdx === q.answer;

                      let btnClass = "border-border bg-card/70 text-foreground hover:border-primary/50";
                      if (isAnswered) {
                        if (isThisCorrect) {
                          btnClass = "border-emerald-500 bg-emerald-500/10 text-foreground font-semibold";
                        } else if (isThisSelected && !isCorrect) {
                          btnClass = "border-destructive bg-destructive/10 text-foreground";
                        } else {
                          btnClass = "border-border/60 bg-card/30 text-muted-foreground opacity-75";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectAnswer(q.id, optIdx)}
                          className={`flex w-full items-start gap-2.5 rounded-xl border p-3 text-left text-xs leading-relaxed transition ${btnClass}`}
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[11px] font-bold uppercase">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {isAnswered && isThisCorrect && (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              <Check className="h-3 w-3" /> Correct
                            </span>
                          )}
                          {isAnswered && isThisSelected && !isCorrect && (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-destructive/20 px-2 py-0.5 text-[10px] font-bold text-destructive">
                              ✗ Selected
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {isAnswered && (
                  <div
                    className={`rounded-xl border p-3.5 text-xs space-y-1.5 ${
                      isCorrect
                        ? "border-emerald-500/40 bg-emerald-500/10 text-foreground"
                        : "border-amber-500/40 bg-amber-500/10 text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{isCorrect ? "✓ Correct!" : "Not quite — Review rationale:"}</span>
                    </div>
                    <p className="leading-relaxed text-foreground/95">{q.why}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          8. CHAPTER SUMMARY AND RAPID REVISION CHECKLIST
         ===================================================================== */}
      <footer className="rounded-3xl border border-primary/35 bg-card/90 p-6 shadow-xs sm:p-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Chapter Summary &amp; Rapid Revision
            </p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              Air Law Rapid Revision Checklist
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Review core international civil aviation legal principles before marking Air Law complete.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollToElement("airlaw-hero", "Top")}
            className="rounded-full text-xs font-semibold"
          >
            <ArrowUp className="mr-1.5 h-3.5 w-3.5" />
            Return to Top
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background/80 p-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              1. Chicago Convention &amp; ICAO
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• <strong className="text-foreground">Sovereignty:</strong> Article 1 grants exclusive control over national airspace.</li>
              <li>• <strong className="text-foreground">Civil Aircraft:</strong> Article 3 applies strictly to civil (not state) aircraft.</li>
              <li>• <strong className="text-foreground">Differences:</strong> Article 38 immediate notification for non-compliance.</li>
              <li>• <strong className="text-foreground">Council:</strong> 36 elected States adopt international SARPs.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-background/80 p-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              2. Freedoms &amp; Security Treaties
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• <strong className="text-foreground">Transit:</strong> 1st (fly over) and 2nd (technical refuelling) freedoms.</li>
              <li>• <strong className="text-foreground">Transport:</strong> 3rd, 4th, 5th commercial passenger/cargo freedoms.</li>
              <li>• <strong className="text-foreground">Tokyo 1963:</strong> Commander authority over offences committed on board.</li>
              <li>• <strong className="text-foreground">Hague 1970:</strong> Universal jurisdiction and punishment for hijacking.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-background/80 p-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              3. Airspace &amp; Rules of the Air
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• <strong className="text-foreground">Class A:</strong> Controlled airspace, IFR flights only; VFR prohibited.</li>
              <li>• <strong className="text-foreground">VMC Minima:</strong> 8 km vis at/above 10k ft; 5 km vis below 10k ft.</li>
              <li>• <strong className="text-foreground">Head-on:</strong> Both aircraft must alter heading to the right.</li>
              <li>• <strong className="text-foreground">Right of Way:</strong> Balloons &gt; Gliders &gt; Airships &gt; Powered aeroplanes.</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>
              Knowledge Checks:{" "}
              <strong>
                {correctCount} / {AIR_LAW_QUESTIONS.length} Correct
              </strong>
            </span>
          </div>

          <Button
            onClick={() => {
              onToggleComplete();
              toast.success(
                completed
                  ? "Marked Air Law as in-progress."
                  : "🎉 Successfully completed Air Law & Regulations!",
              );
            }}
            className="rounded-full font-semibold gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="h-4 w-4" />
            {completed ? "Mark as Incomplete" : "Complete Air Law"}
          </Button>
        </div>
      </footer>
    </div>
  );
}
