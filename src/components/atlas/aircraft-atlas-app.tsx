import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider";
import {
  AIRFRAME,
  ALL_SYSTEMS_META,
  CAMERA_PRESET_BY_ID,
  CAMERA_PRESETS,
  CHECKRIDE,
  PART_BY_ID,
  PARTS,
  PROVENANCE_META,
  SYSTEM_BY_ID,
  SYSTEMS,
  TOUR_BY_ID,
  TOURS,
  askTheAircraft,
  isCheckrideAnswerCorrect,
  parseAtlasState,
  partsForSystem,
  provenanceNoteFor,
  searchAtlas,
  serializeAtlasState,
  type AtlasAnswer,
  type AtlasPart,
  type CameraPose,
  type CameraPresetId,
  type SystemFilter,
  type SystemId,
} from "@/lib/atlas/c172-data";
import {
  loadFlightbook,
  markPartInspected,
  markTourCompleted,
  recordCheckrideScore,
  resetFlightbook,
  saveFlightbook,
  summarizeFlightbook,
  type FlightbookState,
} from "@/lib/atlas/flightbook";
import { C172Viewport, type ViewportCameraRequest } from "./c172-viewport";

export type AtlasMode = "explore" | "tour" | "checkride";

export interface AircraftAtlasAppProps {
  onAuditLog?: (action: string, details: string) => void;
}

export const AircraftAtlasApp: React.FC<AircraftAtlasAppProps> = ({ onAuditLog }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // Parse initial URL query state if present
  const initialUrlState = useMemo(() => {
    if (typeof window === "undefined") return {};
    return parseAtlasState(window.location.search);
  }, []);

  const [mode, setMode] = useState<AtlasMode>(() => (initialUrlState.tour ? "tour" : "explore"));
  const [activeSystem, setActiveSystem] = useState<SystemFilter>(
    () => initialUrlState.system ?? "all",
  );
  const [selectedPartId, setSelectedPartId] = useState<string | null>(
    () => initialUrlState.part ?? null,
  );
  const [explode, setExplode] = useState<number>(() => initialUrlState.explode ?? 0);
  const [isolate, setIsolate] = useState<boolean>(() => initialUrlState.isolate ?? false);
  const [seeThrough, setSeeThrough] = useState<boolean>(
    () => initialUrlState.seeThrough ?? false,
  );
  const [showLinks, setShowLinks] = useState<boolean>(true);
  const [scrollToExplode, setScrollToExplode] = useState<boolean>(false);
  const [activeCameraPreset, setActiveCameraPreset] = useState<CameraPresetId | null>(
    "threeQuarter",
  );
  const [currentCameraPose, setCurrentCameraPose] = useState<CameraPose>(
    () => initialUrlState.camera ?? CAMERA_PRESET_BY_ID.threeQuarter.pose,
  );
  const [cameraRequest, setCameraRequest] = useState<ViewportCameraRequest>(() => ({
    seq: initialUrlState.camera || initialUrlState.part ? 1 : 0,
    pose: initialUrlState.camera,
    focusPartId: initialUrlState.part ?? null,
    explodeAtRequest: initialUrlState.explode ?? 0,
  }));

  // Layout expansion & sidebar toggles
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);
  const [rightDrawerOpen, setRightDrawerOpen] = useState<boolean>(true);

  // Sidebar part filter
  const [partFilterQuery, setPartFilterQuery] = useState<string>("");

  // Flightbook state
  const [flightbook, setFlightbook] = useState<FlightbookState>(() => loadFlightbook());
  const summary = useMemo(() => summarizeFlightbook(flightbook), [flightbook]);

  // Guided Tour state
  const [activeTourId, setActiveTourId] = useState<string>(
    () => initialUrlState.tour?.id ?? TOURS[0].id,
  );
  const [activeTourStepIndex, setActiveTourStepIndex] = useState<number>(
    () => initialUrlState.tour?.step ?? 0,
  );

  // Checkride state
  const [checkrideIndex, setCheckrideIndex] = useState<number>(0);
  const [checkrideAnswers, setCheckrideAnswers] = useState<
    Record<string, { answer: number | string; correct: boolean }>
  >({});

  // Utility overlays & modals
  const [aircraftSelectorOpen, setAircraftSelectorOpen] = useState<boolean>(false);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [readAsTextOpen, setReadAsTextOpen] = useState<boolean>(false);
  const [askDrawerOpen, setAskDrawerOpen] = useState<boolean>(false);
  const [askInput, setAskInput] = useState<string>("");
  const [askHistory, setAskHistory] = useState<
    { question: string; response: AtlasAnswer }[]
  >([
    {
      question: "How does gravity fuel feed work in the Cessna 172S?",
      response: askTheAircraft("gravity fuel tanks selector shutoff strainer servo"),
    },
    {
      question: "What are the Garmin G1000 PFD and MFD displays?",
      response: askTheAircraft("G1000 PFD MFD glass cockpit avionics"),
    },
  ]);
  const [flightbookModalOpen, setFlightbookModalOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Theme-aware styles
  const glassPanelStyle: React.CSSProperties = useMemo(
    () =>
      isDark
        ? {
            background: "rgba(15, 19, 28, 0.86)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderColor: "rgba(255, 255, 255, 0.08)",
            color: "#F8FAFC",
          }
        : {
            background: "rgba(255, 255, 255, 0.88)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderColor: "rgba(226, 232, 240, 0.85)",
            color: "#0F172A",
          },
    [isDark],
  );

  // Toggle fullscreen / expanded view
  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => {
      const next = !prev;
      if (typeof document !== "undefined") {
        if (next) {
          if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
        } else {
          if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        }
      }
      return next;
    });
  }, []);

  // Sync fullscreenchange from browser Escape
  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement && isExpanded) {
        // user pressed Esc to exit native fullscreen
        // keep expanded view or sync
      }
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, [isExpanded]);

  // Cmd+K / Ctrl+K shortcut for Search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setSearchModalOpen(false);
        setAircraftSelectorOpen(false);
        if (isExpanded) {
          setIsExpanded(false);
          if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  // Inspect & focus a part
  const inspectAndFocusPart = useCallback(
    (
      partId: string | null,
      opts?: {
        presetId?: CameraPresetId;
        focusCamera?: boolean;
        nextExplode?: number;
      },
    ) => {
      setSelectedPartId(partId);
      if (partId && PART_BY_ID[partId]) {
        setFlightbook((prev) => markPartInspected(prev, partId));
        if (opts?.focusCamera !== false) {
          setActiveCameraPreset(opts?.presetId ?? null);
          setCameraRequest((prev) => ({
            seq: prev.seq + 1,
            presetId: opts?.presetId,
            focusPartId: partId,
            explodeAtRequest: opts?.nextExplode,
          }));
        }
      }
    },
    [],
  );

  // Apply a Guided Tour step to the 3D scene
  const applyTourStep = useCallback(
    (tourId: string, stepIdx: number) => {
      const tour = TOUR_BY_ID[tourId] ?? TOURS[0];
      const clampedIdx = Math.max(0, Math.min(tour.steps.length - 1, stepIdx));
      const step = tour.steps[clampedIdx];
      setActiveTourId(tour.id);
      setActiveTourStepIndex(clampedIdx);
      setActiveSystem(step.system);
      setExplode(step.explode);
      setSeeThrough(step.seeThrough);
      setIsolate(step.isolate);
      setSelectedPartId(step.partId);
      if (step.partId) {
        setFlightbook((prev) => markPartInspected(prev, step.partId!));
      }
      setActiveCameraPreset(step.camera);
      setCameraRequest((prev) => ({
        seq: prev.seq + 1,
        presetId: step.camera,
        focusPartId: step.focus ? step.partId : null,
        explodeAtRequest: step.explode,
      }));
      if (clampedIdx === tour.steps.length - 1) {
        setFlightbook((prev) => markTourCompleted(prev, tour.id));
        onAuditLog?.("atlas_tour_complete", `Completed Guided Tour: ${tour.title}`);
      }
    },
    [onAuditLog],
  );

  // Handle clicking a part in the 3D scene or part list
  const currentCheckrideQuestion = CHECKRIDE[checkrideIndex] ?? CHECKRIDE[0];
  const currentCheckrideRecord = checkrideAnswers[currentCheckrideQuestion.id];
  const isCheckrideLocateWaiting =
    mode === "checkride" &&
    currentCheckrideQuestion.kind === "locate" &&
    !currentCheckrideRecord;

  const submitCheckrideAnswer = useCallback(
    (answer: number | string) => {
      const q = CHECKRIDE[checkrideIndex];
      if (!q) return;
      const correct = isCheckrideAnswerCorrect(q, answer);
      const nextAnswers = {
        ...checkrideAnswers,
        [q.id]: { answer, correct },
      };
      setCheckrideAnswers(nextAnswers);

      // Focus the reference part so the student sees it clearly
      const targetPartId =
        typeof answer === "string" && PART_BY_ID[answer] ? answer : q.partId;
      inspectAndFocusPart(targetPartId, { focusCamera: true });

      // If all questions are answered, record Checkride score in Flightbook
      const answeredCount = Object.keys(nextAnswers).length;
      if (answeredCount === CHECKRIDE.length) {
        const correctCount = Object.values(nextAnswers).filter((a) => a.correct).length;
        setFlightbook((prev) => recordCheckrideScore(prev, correctCount, CHECKRIDE.length));
        onAuditLog?.(
          "atlas_checkride_complete",
          `Completed C172S Checkride (${correctCount}/${CHECKRIDE.length})`,
        );
      }
    },
    [checkrideIndex, checkrideAnswers, inspectAndFocusPart, onAuditLog],
  );

  const handleViewportPartSelect = useCallback(
    (partId: string | null) => {
      if (!partId) return;
      if (isCheckrideLocateWaiting) {
        submitCheckrideAnswer(partId);
        return;
      }
      inspectAndFocusPart(partId, { focusCamera: true });
    },
    [isCheckrideLocateWaiting, submitCheckrideAnswer, inspectAndFocusPart],
  );

  // Camera Preset trigger
  const triggerCameraPreset = (presetId: CameraPresetId) => {
    setActiveCameraPreset(presetId);
    const pose = CAMERA_PRESET_BY_ID[presetId].pose;
    setCurrentCameraPose(pose);
    setCameraRequest((prev) => ({
      seq: prev.seq + 1,
      presetId,
      focusPartId: null,
    }));
  };

  // Full Reset
  const handleResetView = () => {
    setExplode(0);
    setIsolate(false);
    setSeeThrough(false);
    setActiveSystem("all");
    setSelectedPartId(null);
    triggerCameraPreset("threeQuarter");
  };

  // Share current state to URL & clipboard
  const handleShareState = async () => {
    const query = serializeAtlasState({
      system: activeSystem,
      part: selectedPartId ?? undefined,
      explode,
      isolate,
      seeThrough,
      tour:
        mode === "tour"
          ? { id: activeTourId, step: activeTourStepIndex }
          : undefined,
      camera: currentCameraPose,
    });
    const newUrl = `${window.location.origin}${window.location.pathname}${
      query ? `?${query}` : ""
    }`;
    window.history.replaceState(null, "", newUrl);
    try {
      await navigator.clipboard?.writeText(newUrl);
      toast.success("Atlas telemetry link copied to clipboard");
    } catch {
      toast.success("Atlas URL updated in address bar");
    }
  };

  // Ask the Aircraft submission
  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = askInput.trim();
    if (!q) return;
    const ans = askTheAircraft(q);
    setAskHistory((prev) => [{ question: q, response: ans }, ...prev]);
    setAskInput("");
    if (ans.citations[0]) {
      inspectAndFocusPart(ans.citations[0], { focusCamera: true });
    }
  };

  // Flightbook Import / Export
  const handleExportFlightbook = () => {
    const blob = new Blob([JSON.stringify(flightbook, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `c172s-flightbook-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Flightbook telemetry exported");
  };

  const handleImportFlightbook = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as FlightbookState;
        if (Array.isArray(parsed.inspectedParts)) {
          saveFlightbook(parsed);
          setFlightbook(parsed);
          toast.success("Flightbook telemetry loaded successfully");
        } else {
          toast.error("Invalid Flightbook telemetry file");
        }
      } catch {
        toast.error("Failed to parse Flightbook telemetry file");
      }
    };
    reader.readAsText(file);
  };

  // Filter parts for left sidebar
  const visibleParts = useMemo(() => {
    const base = activeSystem === "all" ? PARTS : partsForSystem(activeSystem);
    if (!partFilterQuery.trim()) return base;
    const q = partFilterQuery.toLowerCase();
    return base.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.what.toLowerCase().includes(q),
    );
  }, [activeSystem, partFilterQuery]);

  // Search results for Cmd+K modal
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchAtlas(searchQuery);
  }, [searchQuery]);

  const selectedPart = selectedPartId ? PART_BY_ID[selectedPartId] : null;
  const selectedProvenanceNote = selectedPart ? provenanceNoteFor(selectedPart) : null;
  const activeTour = TOUR_BY_ID[activeTourId] ?? TOURS[0];
  const activeTourStep = activeTour.steps[activeTourStepIndex] ?? activeTour.steps[0];
  const checkrideScoreCount = Object.values(checkrideAnswers).filter((a) => a.correct).length;

  return (
    <div
      className={`transition-all duration-300 ${
        isExpanded
          ? "fixed inset-0 z-50 flex h-screen w-screen flex-col overflow-hidden rounded-none p-0"
          : "relative flex h-[calc(100vh-11rem)] min-h-[780px] w-full flex-col overflow-hidden rounded-3xl border shadow-2xl"
      } ${
        isDark
          ? "border-white/10 bg-[#090D14] text-slate-100"
          : "border-slate-300/80 bg-slate-50 text-slate-900 shadow-slate-200/50"
      }`}
      style={{
        fontFamily: "'Inter', 'IBM Plex Sans', system-ui, sans-serif",
      }}
      data-testid="aircraft-atlas-console"
    >
      {/* ────────────────────── 1. TOP NAVIGATION & UTILITY BAR ────────────────────── */}
      <header
        className="z-30 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2.5 transition-colors duration-200"
        style={glassPanelStyle}
      >
        {/* Left: Brand Lockup + Aircraft Selector Dropdown Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-sky-400/40 bg-sky-500/15 font-mono text-xs font-bold text-sky-500 dark:text-sky-300">
              ✦
            </span>
            <span
              className="text-xs font-bold tracking-[0.14em] uppercase"
              style={{ fontFamily: "'Space Grotesk', 'Barlow Condensed', sans-serif" }}
            >
              LLOYDPILOT <span className="opacity-40">/</span> Aircraft Atlas
            </span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setAircraftSelectorOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-slate-300/80 bg-slate-200/50 px-3 py-1 font-mono text-xs font-medium transition hover:border-sky-400/60 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
              data-testid="aircraft-selector-pill"
            >
              <span className="text-sky-500 dark:text-sky-400">✈</span>
              <span>
                {AIRFRAME.label} · {AIRFRAME.registration}
              </span>
              <span className="opacity-50">▾</span>
            </button>

            {aircraftSelectorOpen && (
              <div
                className="absolute top-full left-0 z-50 mt-2 w-84 rounded-2xl border p-3.5 text-xs shadow-2xl"
                style={glassPanelStyle}
              >
                <div className="flex items-center justify-between border-b border-border/80 pb-2">
                  <span className="font-mono text-[11px] font-semibold tracking-wider text-sky-600 uppercase dark:text-sky-300">
                    Active Airframe Dossier
                  </span>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] text-emerald-700 dark:text-emerald-300">
                    71 Parts · 6 Systems
                  </span>
                </div>
                <div className="mt-2.5 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="opacity-60">Model</span>
                    <span className="font-medium">Cessna 172S Skyhawk SP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Registration</span>
                    <span className="font-medium">{AIRFRAME.registration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Serial Number</span>
                    <span className="font-medium">{AIRFRAME.serial}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Powerplant</span>
                    <span className="font-medium text-amber-600 dark:text-amber-300">
                      Lycoming IO-360-L2A (180 HP)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Avionics Suite</span>
                    <span className="font-medium text-sky-600 dark:text-sky-300">
                      Garmin G1000 PFD / MFD
                    </span>
                  </div>
                </div>
                <p className="mt-2.5 border-t border-border/80 pt-2 text-[11px] leading-relaxed opacity-80">
                  Every assembly carries an explicit provenance badge distinguishing type-design
                  POH facts (<span className="text-emerald-600 dark:text-emerald-400 font-semibold">Verified</span>),
                  fleet log entries (<span className="text-amber-600 dark:text-amber-400 font-semibold">Reported</span>),
                  and schematic routing (<span className="text-slate-600 dark:text-slate-300 font-semibold">Schematic</span>).
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Center Mode Switcher (Segmented Control) */}
        <div
          className="flex items-center rounded-full border border-border/70 bg-slate-200/60 p-0.5 dark:bg-black/40"
          role="tablist"
          aria-label="Atlas interaction modes"
        >
          {(
            [
              { id: "explore", label: "Explore" },
              { id: "tour", label: "Guided tour" },
              { id: "checkride", label: "Checkride" },
            ] as const
          ).map((tab) => {
            const active = mode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                data-testid={`mode-tab-${tab.id}`}
                onClick={() => {
                  setMode(tab.id);
                  if (tab.id === "tour") {
                    applyTourStep(activeTourId, 0);
                  }
                }}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                  active
                    ? "bg-sky-500 text-slate-950 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Utility Actions */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            data-testid="atlas-theme-toggle-btn"
            title={`Switch to ${isDark ? "Light Studio" : "Dark Hangar"} mode`}
            className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-2.5 py-1 text-xs font-medium transition hover:border-sky-400 hover:bg-card"
          >
            <span>{isDark ? "☀" : "☾"}</span>
            <span>{isDark ? "Light" : "Dark"}</span>
          </button>

          {/* Fullscreen / Expand Button */}
          <button
            type="button"
            onClick={toggleExpand}
            data-testid="atlas-expand-btn"
            title={isExpanded ? "Collapse to embedded view (Esc)" : "Expand to fullscreen"}
            className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-2.5 py-1 text-xs font-medium transition hover:border-sky-400 hover:bg-card"
          >
            <span>{isExpanded ? "🗗" : "⛶"}</span>
            <span className="hidden sm:inline">{isExpanded ? "Exit Full" : "Full View"}</span>
          </button>

          {/* Toggle Left Sidebar */}
          <button
            type="button"
            onClick={() => setLeftSidebarOpen((v) => !v)}
            title="Toggle Systems Sidebar"
            className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition ${
              leftSidebarOpen
                ? "border-sky-400/50 bg-sky-500/15 text-sky-700 dark:text-sky-200"
                : "border-border/80 bg-card/60 hover:bg-card"
            }`}
          >
            <span>◫</span>
            <span className="hidden md:inline">Systems</span>
          </button>

          {/* Search Button */}
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            data-testid="atlas-search-btn"
            className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-2.5 py-1 text-xs transition hover:border-sky-400 hover:bg-card"
          >
            <span>⌕</span>
            <span>Search</span>
            <kbd className="ml-1 hidden rounded bg-slate-200 px-1.5 py-0.5 font-mono text-[10px] text-slate-600 sm:inline dark:bg-white/10 dark:text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Read as Text */}
          <button
            type="button"
            onClick={() => setReadAsTextOpen((v) => !v)}
            data-testid="atlas-read-text-btn"
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition ${
              readAsTextOpen
                ? "border-sky-400 bg-sky-500/20 text-sky-700 dark:text-sky-200"
                : "border-border/80 bg-card/60 hover:border-sky-400 hover:bg-card"
            }`}
          >
            <span>≡</span>
            <span>Read as text</span>
          </button>

          {/* Ask the Aircraft */}
          <button
            type="button"
            onClick={() => setAskDrawerOpen((v) => !v)}
            data-testid="atlas-ask-btn"
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition ${
              askDrawerOpen
                ? "border-amber-400 bg-amber-500/20 text-amber-700 dark:text-amber-200"
                : "border-border/80 bg-card/60 hover:border-amber-400 hover:bg-card"
            }`}
          >
            <span>Ask C172S</span>
          </button>

          {/* My Flightbook */}
          <button
            type="button"
            onClick={() => setFlightbookModalOpen(true)}
            data-testid="atlas-flightbook-btn"
            className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-2.5 py-1 text-xs transition hover:border-sky-400 hover:bg-card"
          >
            <span>▤</span>
            <span className="hidden sm:inline">Flightbook</span>
            <span className="rounded-full bg-sky-500/20 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-sky-700 dark:text-sky-300">
              {summary.partsInspected}
            </span>
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={() => void handleShareState()}
            data-testid="atlas-share-btn"
            className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-2.5 py-1 text-xs transition hover:border-sky-400 hover:bg-card"
          >
            <span>Share</span>
          </button>
        </div>
      </header>

      {/* ────────────────────── 2. MAIN WORKSPACE: LEFT SIDEBAR + 3D STAGE + RIGHT DRAWER ────────────────────── */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR: System Layers & Parts List */}
        {leftSidebarOpen && (
          <aside
            className="z-20 flex w-76 shrink-0 flex-col border-r transition-all duration-200"
            style={glassPanelStyle}
            aria-label="System layers"
          >
            {/* Identity Header */}
            <div className="border-b border-border/80 p-3.5">
              <div className="flex items-center justify-between">
                <h1
                  className="text-xs font-bold tracking-[0.12em] uppercase"
                  style={{ fontFamily: "'Space Grotesk', 'Barlow Condensed', sans-serif" }}
                >
                  {AIRFRAME.heading}
                </h1>
                <button
                  type="button"
                  onClick={() => setLeftSidebarOpen(false)}
                  className="rounded p-1 text-xs opacity-50 hover:opacity-100"
                  title="Collapse sidebar"
                >
                  ◀
                </button>
              </div>
              <p className="mt-0.5 text-xs opacity-75">{AIRFRAME.tagline}</p>
              <p className="mt-1 font-mono text-[11px] opacity-60">
                {AIRFRAME.label} · {AIRFRAME.registration} · serial {AIRFRAME.serial}
              </p>
            </div>

            {/* System Layers List */}
            <div className="border-b border-border/80 p-2.5">
              <div className="mb-1.5 flex items-center justify-between px-1">
                <span className="font-mono text-[10px] font-semibold tracking-wider opacity-60 uppercase">
                  System layers
                </span>
                <span className="font-mono text-[10px] opacity-60">
                  {summary.partsInspected}/{summary.partsTotal} inspected
                </span>
              </div>

              <div className="space-y-1">
                {/* All Systems Row */}
                <button
                  type="button"
                  onClick={() => setActiveSystem("all")}
                  data-testid="system-filter-all"
                  className={`flex w-full items-center justify-between rounded-xl border px-2.5 py-1.5 text-left text-xs transition ${
                    activeSystem === "all"
                      ? "border-sky-500/50 bg-sky-500/15 font-semibold"
                      : "border-transparent opacity-85 hover:bg-black/5 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span style={{ color: ALL_SYSTEMS_META.color }}>{ALL_SYSTEMS_META.glyph}</span>
                    <span>{ALL_SYSTEMS_META.label}</span>
                  </span>
                  <span className="font-mono text-[11px] opacity-60">
                    {summary.partsInspected}/{summary.partsTotal}
                  </span>
                </button>

                {/* 6 Individual System Layers */}
                {SYSTEMS.map((sys) => {
                  const stat = summary.perSystem[sys.id] ?? { inspected: 0, total: 0 };
                  const isActive = activeSystem === sys.id;
                  const pct = stat.total > 0 ? Math.round((stat.inspected / stat.total) * 100) : 0;
                  return (
                    <button
                      key={sys.id}
                      type="button"
                      onClick={() => setActiveSystem(sys.id)}
                      data-testid={`system-filter-${sys.id}`}
                      className={`group flex w-full flex-col gap-1 rounded-xl border px-2.5 py-1.5 text-left text-xs transition ${
                        isActive
                          ? "border-sky-500/50 bg-sky-500/15 font-semibold"
                          : "border-transparent opacity-85 hover:bg-black/5 dark:hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="flex items-center gap-2 truncate">
                          <span className="text-sm leading-none" style={{ color: sys.color }}>
                            {sys.glyph}
                          </span>
                          <span className="truncate">{sys.label}</span>
                        </span>
                        <span className="font-mono text-[11px] opacity-60">
                          {stat.inspected}/{stat.total}
                        </span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-slate-300/60 dark:bg-white/[0.08]">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%`, backgroundColor: sys.color }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filterable Parts List in Active System */}
            <div className="flex flex-1 flex-col overflow-hidden p-2.5">
              <div className="mb-2 flex items-center gap-1.5 rounded-lg border border-border/80 bg-card/60 px-2.5 py-1">
                <span className="text-xs opacity-50">⌕</span>
                <input
                  type="text"
                  value={partFilterQuery}
                  onChange={(e) => setPartFilterQuery(e.target.value)}
                  placeholder={`Filter ${visibleParts.length} parts…`}
                  className="w-full bg-transparent text-xs placeholder:opacity-40 focus:outline-none"
                  aria-label="Filter parts in sidebar"
                />
                {partFilterQuery && (
                  <button
                    type="button"
                    onClick={() => setPartFilterQuery("")}
                    className="text-[10px] opacity-60 hover:opacity-100"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto pr-1">
                {visibleParts.map((part) => {
                  const sys = SYSTEM_BY_ID[part.system];
                  const prov = PROVENANCE_META[part.provenance];
                  const isSelected = selectedPartId === part.id;
                  const isInspected = flightbook.inspectedParts.includes(part.id);
                  return (
                    <button
                      key={part.id}
                      type="button"
                      data-testid={`sidebar-part-${part.id}`}
                      onClick={() => {
                        if (isCheckrideLocateWaiting) {
                          submitCheckrideAnswer(part.id);
                        } else {
                          inspectAndFocusPart(part.id, { focusCamera: true });
                        }
                      }}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs transition ${
                        isSelected
                          ? "border-sky-500 bg-sky-500/20 font-medium"
                          : "border-transparent opacity-85 hover:border-border hover:bg-black/5 dark:hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span className="text-xs" style={{ color: sys.color }}>
                          {sys.glyph}
                        </span>
                        <span className="truncate">{part.name}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: prov.color }}
                          title={prov.label}
                        />
                        {isInspected && (
                          <span
                            className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold"
                            title="Inspected in Flightbook"
                          >
                            ✓
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        )}

        {/* CENTER 3D VIEWPORT + FLOATING BOTTOM HUD */}
        <div className="relative flex flex-1 flex-col overflow-hidden">
          {readAsTextOpen ? (
            /* Accessible Full-Text Structured Syllabus View ("Read as text") */
            <div
              className="flex-1 overflow-y-auto p-6 transition-colors duration-200"
              style={{
                background: isDark ? "#080c14" : "#f8fafc",
                color: isDark ? "#f1f5f9" : "#0f172a",
              }}
              data-testid="atlas-read-as-text-view"
            >
              <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center justify-between border-b border-border/80 pb-4">
                  <div>
                    <h2
                      className="text-xl font-bold tracking-wider uppercase"
                      style={{ fontFamily: "'Space Grotesk', 'Barlow Condensed', sans-serif" }}
                    >
                      {AIRFRAME.heading} — Full Technical Syllabus
                    </h2>
                    <p className="mt-1 text-xs opacity-70">
                      Complete structured specification for all {PARTS.length} assemblies across 6
                      aircraft systems ({AIRFRAME.registration} · serial {AIRFRAME.serial}).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReadAsTextOpen(false)}
                    className="rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-medium hover:border-sky-400"
                  >
                    Return to 3D Hangar
                  </button>
                </div>

                {SYSTEMS.map((sys) => {
                  const sysParts = partsForSystem(sys.id);
                  return (
                    <section
                      key={sys.id}
                      className="space-y-3 rounded-2xl border border-border/80 bg-card/60 p-5"
                    >
                      <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
                        <h3 className="flex items-center gap-2 text-base font-bold">
                          <span style={{ color: sys.color }}>{sys.glyph}</span>
                          <span>{sys.label}</span>
                        </h3>
                        <span className="font-mono text-xs opacity-60">
                          {sysParts.length} parts
                        </span>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {sysParts.map((part) => {
                          const prov = PROVENANCE_META[part.provenance];
                          return (
                            <div
                              key={part.id}
                              className="rounded-xl border border-border/80 bg-card/40 p-3.5"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReadAsTextOpen(false);
                                    inspectAndFocusPart(part.id, { focusCamera: true });
                                  }}
                                  className="text-left text-sm font-semibold text-sky-600 hover:underline dark:text-sky-300"
                                >
                                  {part.name}
                                </button>
                                <span
                                  className="shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px]"
                                  style={{
                                    backgroundColor: `${prov.color}22`,
                                    color: prov.color,
                                  }}
                                >
                                  {prov.label}
                                </span>
                              </div>
                              <p className="mt-1.5 text-xs leading-relaxed opacity-85">
                                {part.what}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          ) : (
            <C172Viewport
              theme={theme}
              activeSystem={activeSystem}
              selectedPartId={selectedPartId}
              explode={explode}
              isolate={isolate}
              seeThrough={seeThrough}
              showLinks={showLinks}
              scrollToExplode={scrollToExplode}
              isExpanded={isExpanded}
              cameraRequest={cameraRequest}
              checkrideLocateActive={isCheckrideLocateWaiting}
              onToggleExpand={toggleExpand}
              onSelectPart={handleViewportPartSelect}
              onExplodeChange={setExplode}
              onCameraPoseChange={setCurrentCameraPose}
            />
          )}

          {/* FLOATING BOTTOM TELEMETRY & CAMERA HUD */}
          {!readAsTextOpen && (
            <div className="pointer-events-none absolute right-4 bottom-3 left-4 z-20 flex flex-col items-center gap-2">
              {/* Row 1: Explode Slider, Isolate, See-Through, Links */}
              <div
                className="pointer-events-auto flex flex-wrap items-center justify-center gap-2.5 rounded-2xl border px-3.5 py-2 shadow-2xl transition-colors duration-200"
                style={glassPanelStyle}
              >
                {/* Explode quick toggle */}
                <button
                  type="button"
                  data-testid="hud-explode-toggle"
                  onClick={() => setExplode((prev) => (prev > 0 ? 0 : 85))}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                    explode > 0
                      ? "border-sky-500 bg-sky-500/20 text-sky-700 dark:text-sky-200"
                      : "border-border/80 bg-card/60 hover:border-sky-400"
                  }`}
                >
                  <span>⧉</span>
                  <span>Explode</span>
                </button>

                {/* Live Explode Range Slider */}
                <div className="flex items-center gap-2 px-1">
                  <span className="font-mono text-[10px] tracking-wider opacity-60 uppercase">
                    EXPLODE
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={explode}
                    aria-label="Explode percentage"
                    data-testid="hud-explode-slider"
                    onChange={(e) => setExplode(Number(e.target.value))}
                    className="h-1.5 w-28 cursor-pointer accent-sky-500"
                  />
                  <span className="w-9 text-right font-mono text-xs font-semibold text-sky-600 dark:text-sky-400">
                    {explode}%
                  </span>
                </div>

                {/* Scroll-to-explode toggle */}
                <button
                  type="button"
                  onClick={() => setScrollToExplode((v) => !v)}
                  title="When enabled, mouse wheel adjusts Explode % instead of camera zoom"
                  className={`rounded-full border px-2.5 py-1 font-mono text-[10px] transition ${
                    scrollToExplode
                      ? "border-sky-400/60 bg-sky-500/15 text-sky-700 dark:text-sky-200"
                      : "border-border/80 bg-card/60 opacity-70 hover:opacity-100"
                  }`}
                >
                  Scroll=Explode
                </button>

                <div className="h-4 w-px bg-border/80" />

                {/* Isolate */}
                <button
                  type="button"
                  data-testid="hud-isolate-toggle"
                  onClick={() => setIsolate((v) => !v)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                    isolate
                      ? "border-amber-400 bg-amber-500/20 text-amber-700 dark:text-amber-200"
                      : "border-border/80 bg-card/60 hover:border-amber-400"
                  }`}
                >
                  <span>◎</span>
                  <span>Isolate</span>
                </button>

                {/* See through */}
                <button
                  type="button"
                  data-testid="hud-seethrough-toggle"
                  onClick={() => setSeeThrough((v) => !v)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                    seeThrough
                      ? "border-cyan-400 bg-cyan-500/20 text-cyan-700 dark:text-cyan-200"
                      : "border-border/80 bg-card/60 hover:border-cyan-400"
                  }`}
                >
                  <span>◍</span>
                  <span>See through</span>
                </button>

                {/* Links */}
                <button
                  type="button"
                  data-testid="hud-links-toggle"
                  onClick={() => setShowLinks((v) => !v)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                    showLinks
                      ? "border-violet-400 bg-violet-500/20 text-violet-700 dark:text-violet-200"
                      : "border-border/80 bg-card/60 hover:border-violet-400"
                  }`}
                >
                  <span>⟟</span>
                  <span>Links</span>
                </button>
              </div>

              {/* Row 2: Camera Preset Pills (includes Cockpit view) */}
              <div
                className="pointer-events-auto flex flex-wrap items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 shadow-xl transition-colors duration-200"
                style={glassPanelStyle}
              >
                {CAMERA_PRESETS.map((preset) => {
                  const active = activeCameraPreset === preset.id;
                  const isCockpit = preset.id === "cockpit";
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      data-testid={`camera-preset-${preset.id}`}
                      onClick={() => triggerCameraPreset(preset.id)}
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition ${
                        active
                          ? "bg-sky-500 text-slate-950 font-bold"
                          : isCockpit
                            ? "border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold hover:bg-amber-500/20"
                            : "opacity-75 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
                      }`}
                    >
                      {isCockpit ? "✈ Cockpit" : preset.label}
                    </button>
                  );
                })}
                <div className="mx-1 h-3.5 w-px bg-border/80" />
                <button
                  type="button"
                  data-testid="camera-preset-reset"
                  onClick={handleResetView}
                  className="rounded-full px-2.5 py-0.5 font-mono text-[11px] text-sky-600 dark:text-sky-300 transition hover:bg-sky-500/20"
                >
                  ↺ Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT CONTEXTUAL DRAWER (Explore / Guided Tour / Checkride) */}
        {rightDrawerOpen && (
          <aside
            className="z-20 flex w-88 shrink-0 flex-col border-l overflow-y-auto p-4 transition-all duration-200"
            style={glassPanelStyle}
            aria-label="Inspector drawer"
          >
            {/* Drawer Header Toggle */}
            <div className="mb-2 flex items-center justify-between border-b border-border/80 pb-2">
              <span className="font-mono text-[10px] font-semibold tracking-wider opacity-60 uppercase">
                {mode === "explore"
                  ? "Part Telemetry"
                  : mode === "tour"
                    ? "Guided Story"
                    : "Checkride Test"}
              </span>
              <button
                type="button"
                onClick={() => setRightDrawerOpen(false)}
                className="rounded p-1 text-xs opacity-50 hover:opacity-100"
                title="Collapse drawer"
              >
                ▶
              </button>
            </div>

            {/* MODE A: EXPLORE (Part Inspector) */}
            {mode === "explore" && (
              <div className="flex flex-1 flex-col" data-testid="explore-drawer">
                {!selectedPart ? (
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="rounded-2xl border border-border/80 bg-card/40 p-4">
                      <span className="font-mono text-[10px] tracking-wider text-sky-600 dark:text-sky-400 uppercase">
                        3D Cessna 172S Part Inspector
                      </span>
                      <p className="mt-2 text-sm leading-relaxed opacity-90">
                        Click any part on the aircraft — or pick a system on the left — to see what
                        it does, its POH provenance, and mechanical/electrical linkages.
                      </p>
                      <div className="mt-4 space-y-2 border-t border-border/80 pt-3">
                        <span className="font-mono text-[10px] opacity-60 uppercase">
                          Suggested starting points
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            "wing-l",
                            "engine",
                            "propeller",
                            "pfd",
                            "mfd",
                            "fuel-selector",
                            "rudder",
                            "main-gear-l",
                          ].map((id) => {
                            const p = PART_BY_ID[id];
                            if (!p) return null;
                            const sys = SYSTEM_BY_ID[p.system];
                            return (
                              <button
                                key={id}
                                type="button"
                                onClick={() => inspectAndFocusPart(id, { focusCamera: true })}
                                className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-2.5 py-1 text-xs transition hover:border-sky-400 hover:bg-card"
                              >
                                <span style={{ color: sys.color }}>{sys.glyph}</span>
                                <span>{p.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Provenance Legend */}
                    <div className="mt-4 rounded-2xl border border-border/80 bg-card/40 p-3.5 text-xs">
                      <div className="font-mono text-[10px] font-semibold tracking-wider opacity-60 uppercase">
                        Provenance Legend
                      </div>
                      <div className="mt-2 space-y-2">
                        {(["verified", "reported", "schematic"] as const).map((key) => {
                          const meta = PROVENANCE_META[key];
                          return (
                            <div key={key} className="flex items-start gap-2">
                              <span
                                className="mt-1 h-2 w-2 shrink-0 rounded-full"
                                style={{ backgroundColor: meta.color }}
                              />
                              <div>
                                <span className="font-semibold">{meta.label}: </span>
                                <span className="opacity-75">{meta.blurb}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4" data-testid="part-inspector-detail">
                    {/* Header: System & Provenance Badges + Title */}
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                          style={{
                            borderColor: `${SYSTEM_BY_ID[selectedPart.system].color}55`,
                            backgroundColor: `${SYSTEM_BY_ID[selectedPart.system].color}18`,
                            color: SYSTEM_BY_ID[selectedPart.system].color,
                          }}
                        >
                          <span>{SYSTEM_BY_ID[selectedPart.system].glyph}</span>
                          <span>{SYSTEM_BY_ID[selectedPart.system].label}</span>
                        </span>

                        <span
                          className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold"
                          style={{
                            borderColor: `${PROVENANCE_META[selectedPart.provenance].color}55`,
                            backgroundColor: `${PROVENANCE_META[selectedPart.provenance].color}18`,
                            color: PROVENANCE_META[selectedPart.provenance].color,
                          }}
                          data-testid="part-provenance-badge"
                        >
                          ● {PROVENANCE_META[selectedPart.provenance].label}
                        </span>
                      </div>

                      <div className="mt-2.5 flex items-start justify-between gap-2">
                        <h2
                          className="text-lg font-bold tracking-wide"
                          style={{ fontFamily: "'Space Grotesk', 'Barlow Condensed', sans-serif" }}
                        >
                          {selectedPart.name}
                        </h2>
                        <button
                          type="button"
                          onClick={() => setSelectedPartId(null)}
                          className="rounded-lg border border-border/80 px-2 py-0.5 text-xs opacity-60 hover:opacity-100"
                          title="Clear selection"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="font-mono text-[10px] opacity-60">
                        ID: {selectedPart.id}
                      </p>
                    </div>

                    {/* Section 1: What it does */}
                    <div className="rounded-2xl border border-border/80 bg-card/50 p-3.5">
                      <h3 className="font-mono text-[10px] font-semibold tracking-wider opacity-60 uppercase">
                        What it does
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed opacity-90">
                        {selectedPart.what}
                      </p>
                    </div>

                    {/* Section 2: How it connects (Upstream & Downstream chips) */}
                    <div className="rounded-2xl border border-border/80 bg-card/50 p-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-mono text-[10px] font-semibold tracking-wider opacity-60 uppercase">
                          How it connects
                        </h3>
                        <span className="font-mono text-[10px] opacity-60">
                          {selectedPart.upstream.length + selectedPart.downstream.length} links
                        </span>
                      </div>

                      <div>
                        <div className="mb-1.5 font-mono text-[10px] text-sky-600 dark:text-sky-400">
                          ← Upstream (Inputs / Mechanical Drive / Feed)
                        </div>
                        {selectedPart.upstream.length === 0 ? (
                          <p className="text-[11px] opacity-50">Primary source / no upstream input</p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {selectedPart.upstream.map((upId) => {
                              const up = PART_BY_ID[upId];
                              if (!up) return null;
                              return (
                                <button
                                  key={upId}
                                  type="button"
                                  data-testid={`upstream-chip-${upId}`}
                                  onClick={() => inspectAndFocusPart(upId, { focusCamera: true })}
                                  className="flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-sky-500/10 px-2.5 py-1 text-xs text-sky-700 dark:text-sky-200 transition hover:border-sky-400 hover:bg-sky-500/20"
                                >
                                  <span>←</span>
                                  <span>{up.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="mb-1.5 font-mono text-[10px] text-amber-600 dark:text-amber-400">
                          Downstream → (Loads / Output / Flow Target)
                        </div>
                        {selectedPart.downstream.length === 0 ? (
                          <p className="text-[11px] opacity-50">Terminal assembly / external airflow</p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {selectedPart.downstream.map((downId) => {
                              const down = PART_BY_ID[downId];
                              if (!down) return null;
                              return (
                                <button
                                  key={downId}
                                  type="button"
                                  data-testid={`downstream-chip-${downId}`}
                                  onClick={() => inspectAndFocusPart(downId, { focusCamera: true })}
                                  className="flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-700 dark:text-amber-200 transition hover:border-amber-400 hover:bg-amber-500/20"
                                >
                                  <span>{down.name}</span>
                                  <span>→</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section 3: Provenance Note */}
                    {selectedProvenanceNote && (
                      <div
                        className="rounded-2xl border border-border/80 bg-card/60 p-3.5 space-y-2.5"
                        data-testid="part-provenance-note"
                      >
                        <h3 className="font-mono text-[10px] font-semibold tracking-wider opacity-60 uppercase">
                          C172S Provenance Note
                        </h3>
                        <div className="space-y-2 text-[11px] leading-relaxed">
                          <div>
                            <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                              Registry:{" "}
                            </span>
                            <span className="opacity-90">{selectedProvenanceNote.registry}</span>
                          </div>
                          <div>
                            <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                              Listing:{" "}
                            </span>
                            <span className="opacity-90">{selectedProvenanceNote.listing}</span>
                          </div>
                          <div>
                            <span className="font-mono font-semibold opacity-60">
                              Schematic:{" "}
                            </span>
                            <span className="opacity-75">{selectedProvenanceNote.schematic}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* MODE B: GUIDED TOUR DRAWER */}
            {mode === "tour" && (
              <div className="flex flex-1 flex-col space-y-4" data-testid="guided-tour-drawer">
                <div>
                  <span className="font-mono text-[10px] font-semibold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
                    Guided Camera Stories
                  </span>
                  <h2
                    className="mt-1 text-base font-bold tracking-wide uppercase"
                    style={{ fontFamily: "'Space Grotesk', 'Barlow Condensed', sans-serif" }}
                  >
                    Select a Tour
                  </h2>
                </div>

                {/* Tour Selector Cards */}
                <div className="space-y-2">
                  {TOURS.map((tour) => {
                    const isCurrent = tour.id === activeTour.id;
                    const isCompleted = flightbook.completedTours.includes(tour.id);
                    return (
                      <button
                        key={tour.id}
                        type="button"
                        data-testid={`tour-select-${tour.id}`}
                        onClick={() => applyTourStep(tour.id, 0)}
                        className={`w-full rounded-2xl border p-3 text-left transition ${
                          isCurrent
                            ? "border-sky-500 bg-sky-500/15"
                            : "border-border/80 bg-card/40 hover:border-sky-400/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{tour.title}</span>
                          <span className="font-mono text-[10px] opacity-60">
                            {isCompleted ? "✓ Completed · " : ""}
                            {tour.steps.length} stops
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] leading-snug opacity-80">
                          {tour.summary}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Active Stop Story Card */}
                <div className="flex-1 rounded-2xl border border-border/80 bg-card/50 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] text-sky-600 dark:text-sky-300">
                      <span>
                        STOP {activeTourStepIndex + 1} OF {activeTour.steps.length}
                      </span>
                      <span>EXPLODE {activeTourStep.explode}%</span>
                    </div>
                    <h3 className="mt-2 text-base font-bold">{activeTourStep.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed opacity-90">
                      {activeTourStep.body}
                    </p>

                    {activeTourStep.partId && PART_BY_ID[activeTourStep.partId] && (
                      <div className="mt-3 rounded-xl border border-border/80 bg-card/60 p-2.5 text-xs">
                        <span className="font-mono text-[10px] opacity-60 uppercase">
                          Focused Assembly:{" "}
                        </span>
                        <span className="font-semibold text-sky-600 dark:text-sky-300">
                          {PART_BY_ID[activeTourStep.partId].name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Step Progress Dots & Prev/Next Controls */}
                  <div className="mt-4 space-y-3 border-t border-border/80 pt-3">
                    <div className="flex justify-center gap-1.5">
                      {activeTour.steps.map((st, idx) => (
                        <button
                          key={st.title}
                          type="button"
                          aria-label={`Jump to step ${idx + 1}`}
                          onClick={() => applyTourStep(activeTour.id, idx)}
                          className={`h-1.5 rounded-full transition-all ${
                            idx === activeTourStepIndex
                              ? "w-6 bg-sky-500"
                              : "w-2 bg-slate-300 dark:bg-white/20 hover:opacity-100"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        data-testid="tour-prev-btn"
                        disabled={activeTourStepIndex === 0}
                        onClick={() => applyTourStep(activeTour.id, activeTourStepIndex - 1)}
                        className="flex-1 rounded-xl border border-border/80 bg-card/60 px-3 py-2 text-xs font-medium transition hover:bg-card disabled:opacity-40"
                      >
                        ← Previous
                      </button>
                      <button
                        type="button"
                        data-testid="tour-next-btn"
                        disabled={activeTourStepIndex >= activeTour.steps.length - 1}
                        onClick={() => applyTourStep(activeTour.id, activeTourStepIndex + 1)}
                        className="flex-1 rounded-xl bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-40"
                      >
                        Next step →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODE C: CHECKRIDE DRAWER */}
            {mode === "checkride" && (
              <div className="flex flex-1 flex-col space-y-4" data-testid="checkride-drawer">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-semibold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
                      Interactive Oral & Practical
                    </span>
                    <h2
                      className="text-base font-bold tracking-wide uppercase"
                      style={{ fontFamily: "'Space Grotesk', 'Barlow Condensed', sans-serif" }}
                    >
                      C172S Checkride
                    </h2>
                  </div>
                  <div className="rounded-full border border-border/80 bg-card/60 px-3 py-1 font-mono text-xs text-sky-600 dark:text-sky-300">
                    Score: {checkrideScoreCount}/{CHECKRIDE.length}
                  </div>
                </div>

                {/* Question Number Pills */}
                <div className="flex flex-wrap gap-1">
                  {CHECKRIDE.map((q, idx) => {
                    const rec = checkrideAnswers[q.id];
                    const isCurrent = idx === checkrideIndex;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        data-testid={`checkride-q-pill-${idx + 1}`}
                        onClick={() => setCheckrideIndex(idx)}
                        className={`h-7 w-7 rounded-lg border font-mono text-xs transition ${
                          isCurrent
                            ? "border-sky-500 bg-sky-500 text-slate-950 font-bold"
                            : rec
                              ? rec.correct
                                ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold"
                                : "border-rose-500/50 bg-rose-500/20 text-rose-700 dark:text-rose-300"
                              : "border-border/80 bg-card/40 opacity-70"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Current Question Card */}
                <div className="flex-1 rounded-2xl border border-border/80 bg-card/50 p-4 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] opacity-60 uppercase">
                        Question {checkrideIndex + 1} of {CHECKRIDE.length} ·{" "}
                        {SYSTEM_BY_ID[currentCheckrideQuestion.system].label}
                      </span>
                      <span className="rounded-full bg-slate-200 dark:bg-white/10 px-2 py-0.5 font-mono text-[10px] opacity-75 uppercase">
                        {currentCheckrideQuestion.kind === "locate" ? "3D Locate" : "Multiple Choice"}
                      </span>
                    </div>

                    <p className="text-sm font-semibold leading-snug">
                      {currentCheckrideQuestion.prompt}
                    </p>

                    {currentCheckrideQuestion.kind === "mcq" ? (
                      <div className="space-y-2 pt-1">
                        {currentCheckrideQuestion.options.map((opt, optIdx) => {
                          const chosen = currentCheckrideRecord?.answer === optIdx;
                          const isAnswer = currentCheckrideQuestion.answerIndex === optIdx;
                          return (
                            <button
                              key={opt}
                              type="button"
                              disabled={Boolean(currentCheckrideRecord)}
                              data-testid={`checkride-opt-${optIdx}`}
                              onClick={() => submitCheckrideAnswer(optIdx)}
                              className={`w-full rounded-xl border p-2.5 text-left text-xs transition ${
                                currentCheckrideRecord
                                  ? isAnswer
                                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-800 dark:text-emerald-100 font-semibold"
                                    : chosen
                                      ? "border-rose-500 bg-rose-500/20 text-rose-800 dark:text-rose-100"
                                      : "border-border/60 opacity-40"
                                  : "border-border/80 bg-card/60 hover:border-sky-400 hover:bg-card"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200">
                        <p className="font-medium">
                          Click the target assembly directly on the 3D aircraft model (or in the left
                          parts list) to verify your identification.
                        </p>
                      </div>
                    )}

                    {currentCheckrideRecord && (
                      <div
                        className={`rounded-xl border p-3 text-xs leading-relaxed ${
                          currentCheckrideRecord.correct
                            ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-900 dark:text-emerald-100"
                            : "border-rose-500/50 bg-rose-500/15 text-rose-900 dark:text-rose-100"
                        }`}
                        data-testid="checkride-feedback"
                      >
                        <div className="font-bold">
                          {currentCheckrideRecord.correct ? "✓ Correct" : "✕ Incorrect"}
                        </div>
                        <p className="mt-1">{currentCheckrideQuestion.explanation}</p>
                      </div>
                    )}
                  </div>

                  {/* Prev / Next Question Navigation */}
                  <div className="flex items-center justify-between gap-2 border-t border-border/80 pt-3">
                    <button
                      type="button"
                      disabled={checkrideIndex === 0}
                      onClick={() => setCheckrideIndex((i) => Math.max(0, i - 1))}
                      className="rounded-xl border border-border/80 bg-card/60 px-3 py-1.5 text-xs disabled:opacity-40"
                    >
                      ← Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckrideAnswers({})}
                      className="font-mono text-[11px] opacity-60 hover:opacity-100"
                    >
                      Restart Quiz
                    </button>
                    <button
                      type="button"
                      disabled={checkrideIndex >= CHECKRIDE.length - 1}
                      onClick={() =>
                        setCheckrideIndex((i) => Math.min(CHECKRIDE.length - 1, i + 1))
                      }
                      className="rounded-xl bg-sky-500 px-3 py-1.5 text-xs font-semibold text-slate-950 disabled:opacity-40"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </aside>
        )}

        {/* ────────────────────── SLIDE-OVER: ASK THE AIRCRAFT ────────────────────── */}
        {askDrawerOpen && (
          <div
            className="absolute top-0 right-0 bottom-0 z-40 flex w-96 flex-col border-l p-4 shadow-2xl transition-all"
            style={glassPanelStyle}
            data-testid="ask-aircraft-drawer"
          >
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div>
                <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400 uppercase">
                  Citation-Backed Database Q&A
                </span>
                <h3 className="text-sm font-bold">Ask the Cessna 172S</h3>
              </div>
              <button
                type="button"
                onClick={() => setAskDrawerOpen(false)}
                className="rounded-lg border border-border/80 px-2 py-1 text-xs opacity-60 hover:opacity-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAskSubmit} className="mt-3 flex gap-2">
              <input
                type="text"
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                placeholder="Ask about G1000, fuel selector, Lycoming IO-360…"
                data-testid="ask-aircraft-input"
                className="flex-1 rounded-xl border border-border/80 bg-card/80 px-3 py-2 text-xs placeholder:opacity-50 focus:border-sky-500 focus:outline-none"
              />
              <button
                type="submit"
                data-testid="ask-aircraft-submit"
                className="rounded-xl bg-sky-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400"
              >
                Ask
              </button>
            </form>

            <div className="mt-3 flex flex-wrap gap-1">
              {[
                "gravity fuel feed",
                "G1000 PFD MFD",
                "Lycoming engine",
                "rudder & nosewheel",
              ].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => {
                    const res = askTheAircraft(sample);
                    setAskHistory((prev) => [{ question: sample, response: res }, ...prev]);
                  }}
                  className="rounded-full border border-border/80 bg-card/60 px-2.5 py-0.5 text-[11px] opacity-75 hover:opacity-100"
                >
                  {sample}
                </button>
              ))}
            </div>

            <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
              {askHistory.map((item, idx) => (
                <div
                  key={`${item.question}-${idx}`}
                  className="rounded-2xl border border-border/80 bg-card/60 p-3 text-xs space-y-2"
                >
                  <div className="font-mono text-[11px] text-sky-600 dark:text-sky-300">
                    Q: {item.question}
                  </div>
                  <p className="leading-relaxed opacity-90">{item.response.answer}</p>
                  {item.response.citations.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="font-mono text-[10px] opacity-60">Citations:</span>
                      {item.response.citations.map((cid) => {
                        const cpart = PART_BY_ID[cid];
                        if (!cpart) return null;
                        return (
                          <button
                            key={cid}
                            type="button"
                            onClick={() => inspectAndFocusPart(cid, { focusCamera: true })}
                            className="rounded-full border border-sky-400/40 bg-sky-500/15 px-2 py-0.5 font-mono text-[10px] text-sky-700 dark:text-sky-200 hover:bg-sky-500/25"
                          >
                            [{cpart.name}]
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ────────────────────── MODAL: CMD+K SEARCH ────────────────────── */}
      {searchModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-24 backdrop-blur-xs"
          onClick={() => setSearchModalOpen(false)}
          data-testid="atlas-search-modal"
        >
          <div
            className="w-full max-w-lg rounded-2xl border p-4 shadow-2xl"
            style={glassPanelStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-border/80 pb-3">
              <span className="opacity-50">⌕</span>
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 71 parts & 6 systems (e.g. Lycoming, G1000, flap, strut, fuel)…"
                data-testid="atlas-search-input"
                className="w-full bg-transparent text-sm placeholder:opacity-40 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="rounded bg-slate-200 dark:bg-white/10 px-2 py-0.5 font-mono text-xs opacity-75"
              >
                ESC
              </button>
            </div>

            <div className="mt-3 max-h-80 space-y-1 overflow-y-auto">
              {searchResults.map((res) => {
                const sys = SYSTEM_BY_ID[res.system];
                return (
                  <button
                    key={`${res.kind}-${res.id}`}
                    type="button"
                    data-testid={`search-result-${res.kind}-${res.id}`}
                    onClick={() => {
                      if (res.kind === "system") {
                        setActiveSystem(res.id as SystemId);
                      } else {
                        setMode("explore");
                        inspectAndFocusPart(res.id, { focusCamera: true });
                      }
                      setSearchModalOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    <span className="flex items-center gap-2">
                      <span style={{ color: sys.color }}>{sys.glyph}</span>
                      <span className="font-medium">{res.label}</span>
                    </span>
                    <span className="font-mono text-[10px] opacity-60 uppercase">
                      {res.kind === "system" ? "System Layer" : sys.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────── MODAL: MY FLIGHTBOOK ────────────────────── */}
      {flightbookModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setFlightbookModalOpen(false)}
          data-testid="atlas-flightbook-modal"
        >
          <div
            className="w-full max-w-xl rounded-3xl border p-6 shadow-2xl"
            style={glassPanelStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div>
                <span className="font-mono text-[10px] text-sky-600 dark:text-sky-400 uppercase">
                  Local Telemetry Logbook
                </span>
                <h2
                  className="text-lg font-bold tracking-wider uppercase"
                  style={{ fontFamily: "'Space Grotesk', 'Barlow Condensed', sans-serif" }}
                >
                  ▤ My Flightbook · {AIRFRAME.registration}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setFlightbookModalOpen(false)}
                className="rounded-lg border border-border/80 px-2.5 py-1 text-xs opacity-60 hover:opacity-100"
              >
                ✕
              </button>
            </div>

            {/* 4 Key Summary Metrics */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-border/80 bg-card/50 p-3">
                <div className="font-mono text-lg font-bold">
                  {summary.systemsExplored} / {summary.systemsTotal}
                </div>
                <div className="text-[11px] opacity-60">Systems explored</div>
              </div>
              <div className="rounded-2xl border border-border/80 bg-card/50 p-3">
                <div className="font-mono text-lg font-bold text-sky-600 dark:text-sky-300">
                  {summary.partsInspected} / {summary.partsTotal}
                </div>
                <div className="text-[11px] opacity-60">Parts inspected</div>
              </div>
              <div className="rounded-2xl border border-border/80 bg-card/50 p-3">
                <div className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-300">
                  {summary.toursCompleted} / {summary.toursTotal}
                </div>
                <div className="text-[11px] opacity-60">Tours completed</div>
              </div>
              <div className="rounded-2xl border border-border/80 bg-card/50 p-3">
                <div className="font-mono text-lg font-bold text-amber-600 dark:text-amber-300">
                  {summary.checkrideBest
                    ? `${summary.checkrideBest.score}/${summary.checkrideBest.total}`
                    : "—"}
                </div>
                <div className="text-[11px] opacity-60">Checkride score</div>
              </div>
            </div>

            {/* Per-System Confidence Breakdown */}
            <div className="mt-5 space-y-2.5">
              <div className="font-mono text-[10px] font-semibold tracking-wider opacity-60 uppercase">
                System Inspection Breakdown
              </div>
              {SYSTEMS.map((sys) => {
                const st = summary.perSystem[sys.id] ?? { inspected: 0, total: 0 };
                const pct = st.total > 0 ? Math.round((st.inspected / st.total) * 100) : 0;
                return (
                  <div key={sys.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="flex items-center gap-2">
                        <span style={{ color: sys.color }}>{sys.glyph}</span>
                        <span>{sys.label}</span>
                      </span>
                      <span className="font-mono opacity-70">
                        {st.inspected}/{st.total} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-300/60 dark:bg-white/10">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: sys.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions: Export, Import, Reset */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-border/80 pt-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportFlightbook}
                  className="rounded-xl border border-border/80 bg-card/60 px-3 py-1.5 text-xs font-medium hover:bg-card"
                >
                  Export progress ↓
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl border border-border/80 bg-card/60 px-3 py-1.5 text-xs font-medium hover:bg-card"
                >
                  Import progress ↑
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json"
                  onChange={handleImportFlightbook}
                  className="hidden"
                />
              </div>

              <button
                type="button"
                data-testid="flightbook-reset-btn"
                onClick={() => {
                  const empty = resetFlightbook();
                  setFlightbook(empty);
                  toast.success("Flightbook progress reset");
                }}
                className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-300 hover:bg-rose-500/20"
              >
                Reset progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
