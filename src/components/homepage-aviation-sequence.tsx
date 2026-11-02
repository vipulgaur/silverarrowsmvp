import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { Compass, Gauge, Play, Radar, RotateCcw, SkipForward } from "lucide-react";

/**
 * Duration and cue points (in seconds) for the synced Circular Avionics -> Silver Arrows Box Strike sequence:
 * - 0.00s – 1.25s: Ground roll acceleration on RWY 09L inside the circular PFD/HSI
 * - 1.25s – 2.75s: Vr Rotation & climb along RNAV track to the right rim of the circle (468, 170)
 * - 2.75s – 4.10s: Plane exits the circle at (468, 170), morphs in-place into the bare original
 *                  `/favicon.png` logo, and follows the glowing golden trail into the Silver Arrow's box
 * - 4.10s:         Logo strikes the Silver Arrow's box -> triggers box illumination, right-side
 *                  background blur, and staggered reveal of the heading text and menu cards!
 */
export const SEQUENCE_TIMING = {
  totalDuration: 4.35,
  rotationStart: 1.25,
  climbStart: 1.85,
  handoffStart: 2.75,
  boundaryPeak: 3.55,
  handoffResolve: 4.1,
} as const;

export type SequencePhase =
  | "ready"
  | "playing"
  | "handoff"
  | "settled"
  | "autoplay-blocked"
  | "reduced-motion"
  | "media-error";

export type AvionicsMode = "pfd-hsi" | "nav-radar" | " aerodynamics";

function prefersReducedMotion(): boolean {
  try {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function easeOutQuad(x: number): number {
  return 1 - (1 - x) * (1 - x);
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4);
}

/**
 * Pure function that computes the Circular Avionics PFD / HSI state and synced
 * aeroplane-to-logo journey progress at time `currentTime` (seconds).
 *
 * Kinematics are calibrated for a completely smooth, continuous launch:
 * - Speed starts from 0 at runway start and monotonically accelerates down RWY 09L
 * - No pauses at rotation: aircraft lifts off with smooth momentum into the climb
 * - No pauses at the circle rim: aircraft exits at full climb speed straight into the sky trail
 * - Eases out gently as the logo strikes and illuminates the Silver Arrow's box
 */
export function computeBoundaryState(currentTime: number, phase: SequencePhase) {
  const isCompletedPhase =
    phase === "settled" || phase === "reduced-motion" || phase === "media-error";

  const t = isCompletedPhase
    ? SEQUENCE_TIMING.handoffResolve
    : Math.max(0, Math.min(currentTime, SEQUENCE_TIMING.totalDuration));

  // Single continuous, strictly accelerating motion inside the circle from t = 0 to handoffStart (2.75s)
  // Eliminates all stops/pauses at rotation and rim
  const tau = Math.min(1, t / SEQUENCE_TIMING.handoffStart);
  const u = Math.pow(tau, 1.55);

  let svgX = 116;
  let svgY = 352;
  let trackDeg = -25.8;

  // Exact arc-length fraction for runway is 0.325
  const RUNWAY_U = 0.325;
  if (u <= RUNWAY_U) {
    const seg = u / RUNWAY_U;
    svgX = 116 + seg * (232 - 116);
    svgY = 352 + seg * (296 - 352);
    trackDeg = -25.8;
  } else {
    const s = (u - RUNWAY_U) / (1 - RUNWAY_U);
    const p0x = 232,
      p0y = 296;
    const p1x = 305,
      p1y = 262;
    const p2x = 388,
      p2y = 204;
    const p3x = 468,
      p3y = 170;

    const inv = 1 - s;
    svgX =
      inv * inv * inv * p0x +
      3 * inv * inv * s * p1x +
      3 * inv * s * s * p2x +
      s * s * s * p3x;
    svgY =
      inv * inv * inv * p0y +
      3 * inv * inv * s * p1y +
      3 * inv * s * s * p2y +
      s * s * s * p3y;

    const dx =
      3 * inv * inv * (p1x - p0x) +
      6 * inv * s * (p2x - p1x) +
      3 * s * s * (p3x - p2x);
    const dy =
      3 * inv * inv * (p1y - p0y) +
      6 * inv * s * (p2y - p1y) +
      3 * s * s * (p3y - p2y);
    trackDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  }

  const aircraftXPercent = Number(((svgX / 520) * 100).toFixed(2));
  const aircraftYPercent = Number(((svgY / 520) * 100).toFixed(2));

  // Smooth, continuous avionics telemetry readouts
  const sCurve = u <= RUNWAY_U ? 0 : (u - RUNWAY_U) / (1 - RUNWAY_U);
  const airspeedKt = Math.round(
    u <= RUNWAY_U ? (u / RUNWAY_U) * 55 : 55 + Math.pow(sCurve, 0.85) * 63,
  );
  const altitudeFt =
    u <= RUNWAY_U ? 0 : Math.round(Math.pow(sCurve, 1.2) * 1850);
  const vsiFpm =
    u <= RUNWAY_U
      ? 0
      : Math.round(Math.sin(Math.min(1, sCurve / 0.75) * (Math.PI / 2)) * 1250);
  const pitchAttitudeDeg =
    u <= 0.30
      ? 0
      : u <= 0.50
        ? Math.sin(((u - 0.30) / 0.20) * (Math.PI / 2)) * 14.5
        : 14.5 - ((u - 0.50) / 0.50) * 4.0;
  const bankAngleDeg =
    u <= RUNWAY_U ? 0 : Math.sin(sCurve * Math.PI) * 12;
  const headingDeg = Math.round(90 - Math.pow(Math.max(0, (u - 0.3) / 0.7), 1.2) * 25);
  const rpmPct = Math.round(24 + easeOutQuart(Math.min(1, tau * 1.5)) * 74);

  const flightStageLabel = isCompletedPhase
    ? "RNAV SID · SLVR1 ESTABLISHED"
    : t < SEQUENCE_TIMING.rotationStart
      ? "TAKEOFF ROLL · RWY 09L"
      : t < SEQUENCE_TIMING.climbStart
        ? "ROTATION · VR 55 KT"
        : t < SEQUENCE_TIMING.handoffStart
          ? "POSITIVE CLIMB · HDG 065°"
          : "MERGING WITH SILVER ARROWS";

  if (isCompletedPhase) {
    return {
      u: 1,
      svgX: 468,
      svgY: 170,
      pitchDeg: trackDeg,
      pitchAttitudeDeg: 10.5,
      bankAngleDeg: 0,
      headingDeg: 65,
      airspeedKt: 118,
      altitudeFt: 1850,
      vsiFpm: 1250,
      rpmPct: 98,
      aircraftXPercent: 90,
      aircraftYPercent: 32.69,
      flightStageLabel,
      handoffProgress: 1,
      aircraftPlaneOpacity: 0,
      silhouetteOpacity: 0,
      emblemBridgeOpacity: 0,
      settledBadgeHighlight: phase === "settled" ? 1 : 0,
      boundaryMergeOpacity: 0,
      bridgeOffsetPx: 84,
    };
  }

  if (t < SEQUENCE_TIMING.handoffStart) {
    const rimApproach = u > 0.88 ? (u - 0.88) / 0.12 : 0;
    return {
      u: Number(u.toFixed(4)),
      svgX: Number(svgX.toFixed(2)),
      svgY: Number(svgY.toFixed(2)),
      pitchDeg: Number(trackDeg.toFixed(2)),
      pitchAttitudeDeg: Number(pitchAttitudeDeg.toFixed(1)),
      bankAngleDeg: Number(bankAngleDeg.toFixed(1)),
      headingDeg,
      airspeedKt,
      altitudeFt,
      vsiFpm,
      rpmPct,
      aircraftXPercent,
      aircraftYPercent,
      flightStageLabel,
      handoffProgress: 0,
      aircraftPlaneOpacity: Number((1 - rimApproach * 0.45).toFixed(3)),
      silhouetteOpacity: Number((rimApproach * 0.65).toFixed(3)),
      emblemBridgeOpacity: 0,
      settledBadgeHighlight: 0,
      boundaryMergeOpacity: 0,
      bridgeOffsetPx: 0,
    };
  }

  // Handoff Journey: 2.75s -> 4.10s (1.35s continuous flight from circle rim (468, 170) into the Silver Arrow's box)
  const rawHandoff =
    (t - SEQUENCE_TIMING.handoffStart) /
    (SEQUENCE_TIMING.handoffResolve - SEQUENCE_TIMING.handoffStart);
  const handoffProgress = Math.max(0, Math.min(1, rawHandoff));
  // Continuous ease-out carries the aeroplane's climb momentum straight out of the circle with no hesitation
  const smoothHandoff = easeOutQuad(handoffProgress);

  // SVG plane inside circle fades immediately upon leaving the circle as the flying plane takes flight
  const aircraftPlaneOpacity = 0;

  // The aeroplane itself flies all the way across the gap from circle exit to the Silver Arrow's box.
  // It remains 100% visible in flight, and converts to the logo only upon reaching & touching that box (p >= 0.44 to 0.72)!
  const silhouetteOpacity =
    handoffProgress < 0.44
      ? 1
      : handoffProgress < 0.72
        ? Math.max(0, 1 - (handoffProgress - 0.44) / 0.28)
        : 0;

  // Logo emblem remains hidden while the aeroplane flies across the gap, then converts in upon touching the box
  const emblemBridgeOpacity =
    handoffProgress < 0.44
      ? 0
      : handoffProgress < 0.70
        ? Math.min(1, Math.pow((handoffProgress - 0.44) / 0.26, 0.65))
        : handoffProgress < 0.90
          ? 1
          : Math.max(0, 1 - (handoffProgress - 0.90) / 0.10);

  const boundaryMergeOpacity = Math.sin(handoffProgress * Math.PI) * 0.9;
  const bridgeOffsetPx = Math.round(smoothHandoff * 92);

  // Illumination of the "Silver Arrow's" target box ramps up as the plane touches the box (p >= 0.60 to 1.0)
  const settledBadgeHighlight =
    handoffProgress < 0.60
      ? 0
      : easeOutQuart((handoffProgress - 0.60) / 0.40);

  return {
    u: 1,
    svgX: 468,
    svgY: 170,
    pitchDeg: Number(trackDeg.toFixed(2)),
    pitchAttitudeDeg: Number(pitchAttitudeDeg.toFixed(1)),
    bankAngleDeg: Number(bankAngleDeg.toFixed(1)),
    headingDeg,
    airspeedKt,
    altitudeFt,
    vsiFpm,
    rpmPct,
    aircraftXPercent: 90,
    aircraftYPercent: 32.69,
    flightStageLabel,
    handoffProgress: Number(handoffProgress.toFixed(3)),
    aircraftPlaneOpacity: Number(aircraftPlaneOpacity.toFixed(3)),
    silhouetteOpacity: Number(silhouetteOpacity.toFixed(3)),
    emblemBridgeOpacity: Number(emblemBridgeOpacity.toFixed(3)),
    settledBadgeHighlight: Number(settledBadgeHighlight.toFixed(3)),
    boundaryMergeOpacity: Number(boundaryMergeOpacity.toFixed(3)),
    bridgeOffsetPx,
  };
}

// Precompute 360° compass rose tick coordinates around center (260, 260) with radius R = 218
const COMPASS_TICKS = Array.from({ length: 72 }, (_, idx) => {
  const deg = idx * 5;
  const rad = ((deg - 90) * Math.PI) / 180;
  const isCardinal = deg % 90 === 0;
  const isMajor = deg % 30 === 0;
  const isTen = deg % 10 === 0;
  const outerR = 216;
  const innerR = isCardinal ? 198 : isMajor ? 202 : isTen ? 206 : 210;
  const labelR = 185;

  const x1 = Number((260 + outerR * Math.cos(rad)).toFixed(2));
  const y1 = Number((260 + outerR * Math.sin(rad)).toFixed(2));
  const x2 = Number((260 + innerR * Math.cos(rad)).toFixed(2));
  const y2 = Number((260 + innerR * Math.sin(rad)).toFixed(2));
  const lx = Number((260 + labelR * Math.cos(rad)).toFixed(2));
  const ly = Number((260 + labelR * Math.sin(rad)).toFixed(2));

  let label: string | null = null;
  if (deg === 0) label = "N";
  else if (deg === 90) label = "E";
  else if (deg === 180) label = "S";
  else if (deg === 270) label = "W";
  else if (isMajor) label = String(deg / 10).padStart(2, "0");

  return { deg, isCardinal, isMajor, x1, y1, x2, y2, lx, ly, label };
});

export interface HomepageAviationSequenceProps {
  onBoundaryHighlightChange?: (intensity: number, settled: boolean) => void;
}

export function HomepageAviationSequence({
  onBoundaryHighlightChange,
}: HomepageAviationSequenceProps) {
  const [phase, setPhase] = useState<SequencePhase>("ready");
  const [mode, setMode] = useState<AvionicsMode>("pfd-hsi");
  const phaseRef = useRef<SequencePhase>("ready");

  // Direct DOM refs for 60/120fps zero-rerender animation updates
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const rootStageRef = useRef<HTMLDivElement | null>(null);
  const avionicsSvgRef = useRef<SVGSVGElement | null>(null);

  const compassRoseRef = useRef<SVGGElement | null>(null);
  const horizonGroupRef = useRef<SVGGElement | null>(null);
  const radarSweepRef = useRef<SVGGElement | null>(null);
  const aircraftGroupRef = useRef<SVGGElement | null>(null);
  const aircraftDetailRef = useRef<SVGGElement | null>(null);
  const morphArrowRef = useRef<SVGGElement | null>(null);
  const activeTrailRef = useRef<SVGPathElement | null>(null);
  const takeoffTrackGroupRef = useRef<SVGGElement | null>(null);
  const glowDotRef = useRef<SVGCircleElement | null>(null);
  const settledEndpointRef = useRef<SVGGElement | null>(null);
  const vsiArcRef = useRef<SVGCircleElement | null>(null);

  // Interactive Aircraft Controller Refs (imitates mouse direction inside the circular compass box)
  const controllerGroupRef = useRef<SVGGElement | null>(null);
  const controllerAircraftRef = useRef<SVGGElement | null>(null);
  const controllerVectorLineRef = useRef<SVGLineElement | null>(null);
  const controllerReticleRef = useRef<SVGGElement | null>(null);
  const controllerYokeRef = useRef<SVGGElement | null>(null);
  const circleBoxRef = useRef<HTMLDivElement | null>(null);

  // Synced Cross-Region Journey Refs (from circle exit rim (468, 170) to `#silver-arrows-target-logo`)
  const journeyTrailSvgRef = useRef<SVGSVGElement | null>(null);
  const journeyTrailPathRef = useRef<SVGPathElement | null>(null);
  const journeyTrailGlowPathRef = useRef<SVGPathElement | null>(null);
  const bridgeContainerRef = useRef<HTMLDivElement | null>(null);
  const bridgeAuraRef = useRef<HTMLDivElement | null>(null);
  const bridgeSilhouetteRef = useRef<HTMLDivElement | null>(null);
  const bridgeEmblemRef = useRef<HTMLDivElement | null>(null);

  // Live Avionics Telemetry Digital Readout refs
  const iasTextRef = useRef<SVGTextElement | null>(null);
  const altTextRef = useRef<SVGTextElement | null>(null);
  const hdgTextRef = useRef<SVGTextElement | null>(null);
  const vsiTextRef = useRef<SVGTextElement | null>(null);
  const pitchTextRef = useRef<SVGTextElement | null>(null);
  const rpmTextRef = useRef<SVGTextElement | null>(null);
  const stageTextRef = useRef<HTMLSpanElement | null>(null);

  const updatePhase = useCallback((next: SequencePhase) => {
    phaseRef.current = next;
    setPhase((prev) => (prev === next ? prev : next));
  }, []);

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  /**
   * Computes exact pixel trajectory from the circle's right rim `(468, 170)` to the
   * `#silver-arrows-target-logo` inside the "Silver Arrow's" heading box on the right,
   * keeping the aeroplane and the bare `/favicon.png` logo 100% synced in position and angle.
   */
  const updateSyncedCrossRegionFlight = useCallback(
    (state: ReturnType<typeof computeBoundaryState>, currentPhase: SequencePhase) => {
      const rootEl = rootStageRef.current;
      const svgEl = avionicsSvgRef.current;
      const bridgeEl = bridgeContainerRef.current;
      if (!rootEl || !svgEl || !bridgeEl) return;

      const rootRect = rootEl.getBoundingClientRect();
      const svgRect = svgEl.getBoundingClientRect();

      // Exact pixel coordinates where the aeroplane reaches (468, 170) on the 520x520 circle rim
      const startX =
        svgRect.left - rootRect.left + (468 / 520) * svgRect.width;
      const startY =
        svgRect.top - rootRect.top + (170 / 520) * svgRect.height;

      // Exact pixel coordinates of `#silver-arrows-target-logo` inside the "Silver Arrow's" box
      const targetLogoEl =
        typeof document !== "undefined"
          ? document.getElementById("silver-arrows-target-logo")
          : null;

      let endX = startX + 165;
      let endY = startY - 52;
      let targetSizePx = 42;

      if (targetLogoEl) {
        const targetRect = targetLogoEl.getBoundingClientRect();
        if (targetRect.width > 0) {
          endX = targetRect.left - rootRect.left + targetRect.width / 2;
          endY = targetRect.top - rootRect.top + targetRect.height / 2;
          targetSizePx = targetRect.width;
        }
      }

      // Build a C1-continuous cubic Bezier curve from (startX, startY) to (endX, endY)
      // whose initial tangent matches the aeroplane's -24° climb angle inside the circle!
      const dxTotal = endX - startX;
      const dyTotal = endY - startY;
      const dist = Math.hypot(dxTotal, dyTotal) || 160;
      const climbRad = (-24 * Math.PI) / 180;

      const c1x = startX + Math.cos(climbRad) * (dist * 0.44);
      const c1y = startY + Math.sin(climbRad) * (dist * 0.44);
      const c2x = endX - dist * 0.36;
      const c2y = endY + Math.sin(climbRad) * (dist * 0.14);

      const p = easeOutQuad(state.handoffProgress);
      const inv = 1 - p;

      const curX =
        inv * inv * inv * startX +
        3 * inv * inv * p * c1x +
        3 * inv * p * p * c2x +
        p * p * p * endX;
      const curY =
        inv * inv * inv * startY +
        3 * inv * inv * p * c1y +
        3 * inv * p * p * c2y +
        p * p * p * endY;

      const dBx =
        3 * inv * inv * (c1x - startX) +
        6 * inv * p * (c2x - c1x) +
        3 * p * p * (endX - c2x);
      const dBy =
        3 * inv * inv * (c1y - startY) +
        6 * inv * p * (c2y - c1y) +
        3 * p * p * (endY - c2y);
      const tangentDeg = (Math.atan2(dBy, dBx) * 180) / Math.PI;

      // During flight across the gap, the aeroplane points along its climb flight path (tangentDeg).
      // As it touches and converts into the logo at the box (p >= 0.50), it smoothly straightens out to 0° to align with the badge logo.
      const activeRotationDeg =
        p < 0.50
          ? tangentDeg
          : tangentDeg * (1 - (p - 0.50) / 0.50);

      bridgeEl.style.left = `${curX}px`;
      bridgeEl.style.top = `${curY}px`;
      bridgeEl.style.transform = `translate3d(-50%, -50%, 0) rotate(${activeRotationDeg.toFixed(2)}deg)`;

      const currentSizePx = 46 * (1 - p) + targetSizePx * p;
      if (bridgeEmblemRef.current) {
        bridgeEmblemRef.current.style.opacity = String(state.emblemBridgeOpacity);
        bridgeEmblemRef.current.style.width = `${currentSizePx.toFixed(1)}px`;
        bridgeEmblemRef.current.style.height = `${currentSizePx.toFixed(1)}px`;
      }

      if (bridgeSilhouetteRef.current) {
        bridgeSilhouetteRef.current.style.opacity = String(state.silhouetteOpacity);
      }

      if (bridgeAuraRef.current) {
        bridgeAuraRef.current.style.opacity = String(state.boundaryMergeOpacity);
      }

      const pathD = `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`;
      const approxLen = Math.round(dist * 1.15);

      for (const pathEl of [journeyTrailPathRef.current, journeyTrailGlowPathRef.current]) {
        if (!pathEl) continue;
        pathEl.setAttribute("d", pathD);
        pathEl.style.strokeDasharray = `${approxLen}`;
        pathEl.style.strokeDashoffset = `${Math.max(0, approxLen * (1 - p))}`;
        // Remove the cross-region trail completely once the right side of the page loads ("settled")
        pathEl.style.opacity =
          currentPhase === "handoff"
            ? String(Math.min(1, Math.sin(state.handoffProgress * Math.PI) * 1.35))
            : "0";
      }
    },
    [],
  );

  /**
   * Applies calculated frame state directly to the Circular Avionics SVG & DOM nodes
   * at 60/120fps without causing React component re-renders.
   */
  const applyVisualFrame = useCallback(
    (
      elapsedSec: number,
      currentPhase: SequencePhase,
      customController?: {
        nx: number;
        ny: number;
        pitch: number;
        bank: number;
        headingDeg: number;
        angleDeg: number;
      },
    ) => {
      const state = computeBoundaryState(elapsedSec, currentPhase);
      const isSettledMode =
        currentPhase === "settled" || currentPhase === "reduced-motion";

      const pitch = customController ? customController.pitch : state.pitchAttitudeDeg;
      const bank = customController ? customController.bank : state.bankAngleDeg;
      const activeHeading = customController ? customController.headingDeg : state.headingDeg;

      if (compassRoseRef.current) {
        const rot = 90 - activeHeading;
        compassRoseRef.current.setAttribute("transform", `rotate(${rot} 260 260)`);
      }

      if (horizonGroupRef.current) {
        const pitchOffsetPx = pitch * 3.2;
        horizonGroupRef.current.setAttribute(
          "transform",
          `rotate(${-bank} 260 260) translate(0, ${pitchOffsetPx})`,
        );
      }

      if (radarSweepRef.current) {
        const sweepDeg = (elapsedSec * 78) % 360;
        radarSweepRef.current.setAttribute("transform", `rotate(${sweepDeg} 260 260)`);
      }

      if (aircraftGroupRef.current) {
        aircraftGroupRef.current.setAttribute(
          "transform",
          `translate(${state.svgX}, ${state.svgY}) rotate(${state.pitchDeg})`,
        );
      }
      if (aircraftDetailRef.current) {
        aircraftDetailRef.current.style.opacity = String(state.aircraftPlaneOpacity);
      }
      if (morphArrowRef.current) {
        morphArrowRef.current.style.opacity =
          currentPhase === "playing" ? String(state.silhouetteOpacity) : "0";
      }

      // Remove the takeoff trail inside the circle once the right side of the page loads
      if (takeoffTrackGroupRef.current) {
        takeoffTrackGroupRef.current.style.opacity = isSettledMode
          ? "0"
          : currentPhase === "handoff"
            ? String(Math.max(0, 1 - state.handoffProgress * 1.15))
            : "1";
      }

      const totalPathLen = 430;
      if (activeTrailRef.current) {
        const dashOffset = Math.max(0, totalPathLen * (1 - state.u));
        activeTrailRef.current.style.strokeDasharray = `${totalPathLen}`;
        activeTrailRef.current.style.strokeDashoffset = `${dashOffset}`;
      }
      if (glowDotRef.current) {
        glowDotRef.current.setAttribute("cx", String(state.svgX));
        glowDotRef.current.setAttribute("cy", String(state.svgY));
        glowDotRef.current.style.opacity =
          currentPhase === "playing" ? "0.95" : "0";
      }

      if (settledEndpointRef.current) {
        settledEndpointRef.current.style.opacity = "0";
      }

      // Interactive Aircraft Controller in the Circle Compass Box (imitates mouse direction)
      if (controllerGroupRef.current) {
        controllerGroupRef.current.style.opacity = isSettledMode
          ? "1"
          : currentPhase === "handoff" && state.handoffProgress > 0.65
            ? String(((state.handoffProgress - 0.65) / 0.35).toFixed(2))
            : "0";
      }

      const ctrlNx = customController ? customController.nx : 0;
      const ctrlNy = customController ? customController.ny : 0;
      const ctrlAngle = customController ? customController.angleDeg : -25;
      const planeX = 260 + ctrlNx * 66;
      const planeY = 260 + ctrlNy * 66;
      const reticleX = 260 + ctrlNx * 106;
      const reticleY = 260 + ctrlNy * 106;

      if (controllerAircraftRef.current) {
        controllerAircraftRef.current.setAttribute(
          "transform",
          `translate(${planeX.toFixed(1)}, ${planeY.toFixed(1)}) rotate(${ctrlAngle.toFixed(1)})`,
        );
      }
      if (controllerVectorLineRef.current) {
        controllerVectorLineRef.current.setAttribute("x2", planeX.toFixed(1));
        controllerVectorLineRef.current.setAttribute("y2", planeY.toFixed(1));
      }
      if (controllerReticleRef.current) {
        controllerReticleRef.current.setAttribute(
          "transform",
          `translate(${reticleX.toFixed(1)}, ${reticleY.toFixed(1)})`,
        );
      }
      if (controllerYokeRef.current) {
        controllerYokeRef.current.setAttribute(
          "transform",
          `translate(${(260 + ctrlNx * 18).toFixed(1)}, ${(260 + ctrlNy * 18).toFixed(1)}) rotate(${(ctrlNx * 16).toFixed(1)})`,
        );
      }

      if (vsiArcRef.current) {
        const maxArc = 160;
        const filled = Math.round((state.vsiFpm / 1500) * maxArc);
        vsiArcRef.current.setAttribute("stroke-dasharray", `${filled} 1600`);
      }

      if (iasTextRef.current) {
        iasTextRef.current.textContent = `${String(state.airspeedKt).padStart(3, "0")} KT`;
      }
      if (altTextRef.current) {
        altTextRef.current.textContent = `${state.altitudeFt.toLocaleString()} FT`;
      }
      if (hdgTextRef.current) {
        hdgTextRef.current.textContent = `${String(activeHeading).padStart(3, "0")}°`;
      }
      if (vsiTextRef.current) {
        vsiTextRef.current.textContent = `+${state.vsiFpm} FPM`;
      }
      if (pitchTextRef.current) {
        pitchTextRef.current.textContent = `${pitch >= 0 ? "+" : ""}${pitch.toFixed(1)}°`;
      }
      if (rpmTextRef.current) {
        rpmTextRef.current.textContent = customController
          ? `BANK ${bank >= 0 ? "+" : ""}${bank.toFixed(0)}°`
          : `${state.rpmPct}% N1`;
      }
      if (stageTextRef.current) {
        stageTextRef.current.textContent = customController
          ? `AIRCRAFT CONTROLLER · HDG ${String(activeHeading).padStart(3, "0")}°`
          : state.flightStageLabel;
      }

      updateSyncedCrossRegionFlight(state, currentPhase);

      onBoundaryHighlightChange?.(
        state.settledBadgeHighlight,
        isSettledMode,
      );
    },
    [onBoundaryHighlightChange, updateSyncedCrossRegionFlight],
  );

  const startSequence = useCallback(() => {
    stopRaf();
    startTimeRef.current = null;
    updatePhase("playing");
    onBoundaryHighlightChange?.(0, false);

    const tick = (now: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = now;
      }
      // Speed multiplier: fast-forwards the 4.35s flight into ~1.3 seconds for instant responsive loading
      const SPEED_FACTOR = 3.2;
      const elapsedSec = ((now - startTimeRef.current) / 1000) * SPEED_FACTOR;

      if (elapsedSec >= SEQUENCE_TIMING.handoffResolve) {
        updatePhase("settled");
        applyVisualFrame(SEQUENCE_TIMING.handoffResolve, "settled");
        stopRaf();
        return;
      }

      const activePhase: SequencePhase =
        elapsedSec >= SEQUENCE_TIMING.handoffStart ? "handoff" : "playing";
      if (phaseRef.current !== activePhase) {
        updatePhase(activePhase);
      }

      applyVisualFrame(elapsedSec, activePhase);
      rafRef.current = requestAnimationFrame(tick);
    };

    applyVisualFrame(0, "playing");
    rafRef.current = requestAnimationFrame(tick);
  }, [applyVisualFrame, onBoundaryHighlightChange, stopRaf, updatePhase]);

  const handleSkip = useCallback(() => {
    stopRaf();
    updatePhase("settled");
    applyVisualFrame(SEQUENCE_TIMING.handoffResolve, "settled");
  }, [applyVisualFrame, stopRaf, updatePhase]);

  const handleReplay = useCallback(() => {
    startSequence();
  }, [startSequence]);

  const steerFromClientCoordinates = useCallback(
    (clientX: number, clientY: number) => {
      if (phaseRef.current !== "settled" && phaseRef.current !== "reduced-motion") {
        return;
      }
      const boxEl = circleBoxRef.current;
      if (!boxEl) return;
      const rect = boxEl.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rawNx = (clientX - centerX) / (rect.width / 2);
      const rawNy = (clientY - centerY) / (rect.height / 2);

      // Clamp magnitude smoothly so moving the mouse anywhere on the page or inside the circle
      // steers the aircraft controller in that exact direction
      const mag = Math.hypot(rawNx, rawNy);
      const clampedMag = mag > 1 ? 1 : mag;
      const nx = mag > 0.001 ? (rawNx / mag) * clampedMag : 0;
      const ny = mag > 0.001 ? (rawNy / mag) * clampedMag : 0;

      const angleDeg =
        mag > 0.02 ? (Math.atan2(rawNy, rawNx) * 180) / Math.PI : -25;
      const headingDeg =
        mag > 0.02 ? (Math.round(angleDeg + 90) + 360) % 360 : 65;

      applyVisualFrame(SEQUENCE_TIMING.handoffResolve, phaseRef.current, {
        nx: Number(nx.toFixed(3)),
        ny: Number(ny.toFixed(3)),
        pitch: Number((10.5 - ny * 14).toFixed(1)),
        bank: Number((nx * 24).toFixed(1)),
        headingDeg,
        angleDeg: Number(angleDeg.toFixed(1)),
      });
    },
    [applyVisualFrame],
  );

  const handleCircleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      steerFromClientCoordinates(e.clientX, e.clientY);
    },
    [steerFromClientCoordinates],
  );

  const handleCircleMouseLeave = useCallback(() => {
    if (phaseRef.current !== "settled" && phaseRef.current !== "reduced-motion") {
      return;
    }
    applyVisualFrame(SEQUENCE_TIMING.handoffResolve, phaseRef.current);
  }, [applyVisualFrame]);

  useEffect(() => {
    function handleWindowMouseMove(e: globalThis.MouseEvent) {
      steerFromClientCoordinates(e.clientX, e.clientY);
    }
    window.addEventListener("mousemove", handleWindowMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleWindowMouseMove);
  }, [steerFromClientCoordinates]);

  useEffect(() => {
    if (prefersReducedMotion()) {
      updatePhase("reduced-motion");
      applyVisualFrame(SEQUENCE_TIMING.handoffResolve, "reduced-motion");
      return;
    }

    startSequence();

    return () => {
      stopRaf();
    };
  }, [applyVisualFrame, startSequence, stopRaf, updatePhase]);

  useEffect(() => {
    function onVisibilityChange() {
      if (document.hidden && (phaseRef.current === "playing" || phaseRef.current === "handoff")) {
        handleSkip();
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [handleSkip]);

  const isRunning = phase === "playing" || phase === "handoff";
  const showReplay =
    phase === "settled" || phase === "reduced-motion" || phase === "media-error";

  return (
    <div
      ref={rootStageRef}
      data-testid="homepage-aviation-sequence"
      data-sequence-phase={phase}
      className="relative flex w-full flex-col items-center justify-center overflow-visible select-none"
    >
      {/* ==========================================================================
          CROSS-REGION FLIGHT TRAIL SVG OVERLAY
          Draws the continuous glowing trajectory from the circle's exit rim (468, 170)
          all the way into the `#silver-arrows-target-logo` inside the "Silver Arrow's" box.
         ========================================================================== */}
      <svg
        ref={journeyTrailSvgRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id="saBridgeJourneyGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.85" />
            <stop offset="65%" stopColor="var(--primary)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--foreground)" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <path
          ref={journeyTrailGlowPathRef}
          d="M 0 0"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="8"
          strokeLinecap="round"
          style={{ filter: "blur(6px)", opacity: 0 }}
        />
        <path
          ref={journeyTrailPathRef}
          d="M 0 0"
          fill="none"
          stroke="url(#saBridgeJourneyGrad)"
          strokeWidth="2.75"
          strokeLinecap="round"
          style={{ opacity: 0 }}
        />
      </svg>

      {/* ==========================================================================
          SYNCED BARE SILVER ARROWS LOGO IN FLIGHT (NO SQUARE BOX!)
          Starts at the exact (468, 170) circle rim where the aeroplane exits and
          flies directly into `#silver-arrows-target-logo` in the heading badge.
         ========================================================================== */}
      <div
        ref={bridgeContainerRef}
        data-testid="boundary-transition-bridge"
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-40 flex items-center justify-center"
        style={{
          transform: "translate3d(-50%, -50%, 0)",
        }}
      >
        <div
          ref={bridgeAuraRef}
          className="pointer-events-none absolute h-20 w-20 rounded-full bg-primary/35 blur-xl"
          style={{ opacity: 0 }}
        />

        <div
          ref={bridgeSilhouetteRef}
          data-testid="matched-aircraft-silhouette"
          className="pointer-events-none absolute flex items-center justify-center text-primary"
          style={{
            opacity: 0,
            filter: "drop-shadow(0 0 14px var(--primary))",
          }}
        >
          <svg
            viewBox="-48 -24 84 48"
            className="h-10 w-16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Glowing engine wake line behind aircraft */}
            <path
              d="M -44 0 L -18 0"
              stroke="var(--primary)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeOpacity="0.85"
            />
            {/* Swept Port Wing */}
            <path
              d="M -3 -2 L -14 -20 L -5 -20 L 9 -2 Z"
              fill="var(--primary)"
              fillOpacity="0.92"
            />
            {/* Fuselage, Tailplane and Nose Cone */}
            <path
              d="M -26 -2 L -20 -14 L -13 -14 L -8 -3 L 14 -4 C 21 -4 27 -1 29 1 C 26 4 19 5 10 5 L -22 4 Z"
              fill="var(--foreground)"
            />
            {/* Swept Starboard Wing */}
            <path
              d="M -5 1 L -18 19 L -8 19 L 10 2 Z"
              fill="var(--primary)"
              fillOpacity="0.92"
            />
            {/* Propeller disc / nose spinner */}
            <ellipse cx="30" cy="1" rx="1.6" ry="9.5" fill="var(--primary)" />
          </svg>
        </div>

        <div
          ref={bridgeEmblemRef}
          data-testid="boundary-silver-arrows-emblem"
          className="pointer-events-none relative flex items-center justify-center"
          style={{
            opacity: 0,
            width: "44px",
            height: "44px",
            filter:
              "drop-shadow(0 0 14px var(--primary)) drop-shadow(0 0 28px var(--primary))",
          }}
        >
          <img
            src="/favicon.png"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      {/* ==========================================================================
          LARGE CIRCULAR AVIONICS PFD / HSI COMPASS ROSE GYROSCOPE
         ========================================================================== */}
      <div className="relative mx-auto flex w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[490px] xl:max-w-[520px] items-center justify-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-4 rounded-full bg-primary/12 blur-3xl"
        />

        <div
          ref={circleBoxRef}
          data-testid="aviation-video-clip-region"
          onMouseMove={handleCircleMouseMove}
          onMouseLeave={handleCircleMouseLeave}
          className="relative aspect-square w-full overflow-hidden rounded-full border border-primary/30 bg-card/45 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl transition-shadow duration-500 hover:border-primary/50"
          style={{
            background:
              "radial-gradient(circle at 50% 42%, color-mix(in oklch, var(--card) 92%, var(--primary) 8%) 0%, color-mix(in oklch, var(--background) 94%, var(--foreground) 6%) 74%, color-mix(in oklch, var(--primary) 18%, var(--background)) 100%)",
          }}
        >
          <svg
            ref={avionicsSvgRef}
            viewBox="0 0 520 520"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="pointer-events-none h-full w-full"
          >
            <defs>
              <clipPath id="saInnerGyroSphere">
                <circle cx="260" cy="260" r="168" />
              </clipPath>

              {/* Topographical Mountain Terrain & Synthetic Vision Gradients */}
              <linearGradient id="saTopoSkyHaze" x1="260" y1="90" x2="260" y2="240" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0.95" />
                <stop offset="65%" stopColor="#1e293b" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.25" />
              </linearGradient>

              <linearGradient id="saValleyFloor" x1="260" y1="200" x2="260" y2="440" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0b1728" />
                <stop offset="45%" stopColor="#0f2238" />
                <stop offset="100%" stopColor="#060c16" />
              </linearGradient>

              <linearGradient id="saNorthRidge1" x1="260" y1="90" x2="260" y2="220" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#254269" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#132742" stopOpacity="0.85" />
              </linearGradient>

              <linearGradient id="saNorthRidge2" x1="260" y1="90" x2="260" y2="180" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#3b6294" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#1d375a" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="saSouthRidge1" x1="260" y1="300" x2="260" y2="440" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#142844" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#26466f" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="saSouthRidge2" x1="260" y1="340" x2="260" y2="440" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1c365b" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#385e8d" stopOpacity="0.95" />
              </linearGradient>

              <linearGradient id="saRunwaySurfaceGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#060a12" />
                <stop offset="50%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#060a12" />
              </linearGradient>

              <linearGradient id="saGlideslopeBeam" x1="420" y1="180" x2="174" y2="324" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
                <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.95" />
              </linearGradient>

              <linearGradient id="saAdiSkyGrad" x1="260" y1="60" x2="260" y2="260" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.04" />
              </linearGradient>

              <linearGradient id="saAdiTerrainGrad" x1="260" y1="260" x2="260" y2="460" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="var(--foreground)" stopOpacity="0.08" />
                <stop offset="100%" stopColor="var(--background)" stopOpacity="0.35" />
              </linearGradient>

              <linearGradient id="saRadarSweepGrad" x1="260" y1="260" x2="428" y2="180" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.0" />
                <stop offset="70%" stopColor="var(--primary)" stopOpacity="0.16" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.34" />
              </linearGradient>

              <linearGradient id="saRnavTrackGrad" x1="116" y1="352" x2="468" y2="170" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
                <stop offset="45%" stopColor="var(--primary)" stopOpacity="0.7" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="1" />
              </linearGradient>

              <filter id="saAvionicsGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 1. OUTER PRECISION AVIONICS BEZEL RINGS & VSI ARC */}
            <circle
              cx="260"
              cy="260"
              r="248"
              stroke="var(--border)"
              strokeOpacity="0.45"
              strokeWidth="1.5"
            />
            <circle
              cx="260"
              cy="260"
              r="234"
              stroke="var(--primary)"
              strokeOpacity="0.28"
              strokeWidth="1"
              strokeDasharray="4 8"
            />
            <circle
              ref={vsiArcRef}
              cx="260"
              cy="260"
              r="234"
              stroke="var(--primary)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="110 1600"
              transform="rotate(-42 260 260)"
              filter="url(#saAvionicsGlow)"
            />

            {/* 2. ROTATING 360° COMPASS ROSE BEZEL (HDG 090° -> 065°) */}
            <g ref={compassRoseRef} transform="rotate(0 260 260)">
              <circle
                cx="260"
                cy="260"
                r="216"
                stroke="var(--border)"
                strokeOpacity="0.7"
                strokeWidth="1.5"
              />
              {COMPASS_TICKS.map((t) => (
                <g key={t.deg}>
                  <line
                    x1={t.x1}
                    y1={t.y1}
                    x2={t.x2}
                    y2={t.y2}
                    stroke={t.isCardinal ? "var(--primary)" : "var(--foreground)"}
                    strokeOpacity={t.isCardinal ? "0.95" : t.isMajor ? "0.7" : "0.32"}
                    strokeWidth={t.isCardinal ? "2.2" : t.isMajor ? "1.5" : "1"}
                  />
                  {t.label && (
                    <text
                      x={t.lx}
                      y={t.ly}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={t.isCardinal ? "var(--primary)" : "var(--muted-foreground)"}
                      fontSize={t.isCardinal ? "12" : "9.5"}
                      fontWeight={t.isCardinal ? "800" : "600"}
                      fontFamily="var(--font-learning-mono)"
                    >
                      {t.label}
                    </text>
                  )}
                </g>
              ))}

              <g transform="rotate(65 260 260)">
                <path
                  d="M 253 42 L 267 42 L 267 50 L 263 50 L 260 46 L 257 50 L 253 50 Z"
                  fill="var(--primary)"
                />
              </g>
            </g>

            {/* Fixed Top Lubber Line & Heading Readout Window at 12 O'Clock */}
            <g>
              <rect
                x="222"
                y="12"
                width="76"
                height="24"
                rx="8"
                fill="var(--card)"
                stroke="var(--primary)"
                strokeOpacity="0.65"
                strokeWidth="1.2"
              />
              <text
                x="240"
                y="27"
                fill="var(--muted-foreground)"
                fontSize="8.5"
                fontWeight="700"
                fontFamily="var(--font-learning-mono)"
              >
                HDG
              </text>
              <text
                ref={hdgTextRef}
                x="278"
                y="27.5"
                textAnchor="middle"
                fill="var(--primary)"
                fontSize="11.5"
                fontWeight="800"
                fontFamily="var(--font-learning-mono)"
              >
                065°
              </text>
              <polygon points="260,44 255,36 265,36" fill="var(--primary)" />
            </g>

            {/* 3. INNER COMPASS MAP: HIGH-FIDELITY MOUNTAINS & AIRSTRIP LANDING RUNWAY */}
            <g clipPath="url(#saInnerGyroSphere)">
              <g
                ref={horizonGroupRef}
                style={{
                  opacity: 0.96,
                  transition: "opacity 300ms ease",
                }}
              >
                {/* 1. Atmospheric Horizon & Deep Valley Base Sky */}
                <rect x="60" y="-120" width="400" height="380" fill="url(#saTopoSkyHaze)" />
                <rect x="60" y="240" width="400" height="380" fill="url(#saValleyFloor)" />

                {/* 2. Topographical Elevation Isolines (Valley to Peaks) */}
                <g stroke="#38bdf8" strokeOpacity="0.18" strokeWidth="0.8" fill="none">
                  <ellipse cx="260" cy="270" rx="140" ry="85" strokeDasharray="3 4" />
                  <ellipse cx="260" cy="270" rx="110" ry="65" />
                  <ellipse cx="260" cy="270" rx="80" ry="45" strokeDasharray="4 4" />
                </g>

                {/* 3. Winding Glacial Valley River & Approach Waterway */}
                <path
                  d="M 60 295 Q 120 280 180 300 Q 240 320 310 290 Q 380 270 460 285"
                  stroke="#0284c7"
                  strokeOpacity="0.35"
                  strokeWidth="3.5"
                  fill="none"
                />

                {/* 4. Northern Mountain Ranges (Mt. Eagle & North Ridge) */}
                <g>
                  {/* Outer Ridge Layer (2,000' MSL) */}
                  <path
                    d="M 60 240 Q 115 175 180 195 Q 240 155 310 180 Q 375 145 460 205 L 460 60 L 60 60 Z"
                    fill="url(#saNorthRidge1)"
                    stroke="#38bdf8"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  />
                  {/* High Ridge Layer (3,200' MSL) */}
                  <path
                    d="M 80 200 Q 130 145 185 160 Q 245 120 305 145 Q 365 115 440 170 L 440 60 L 80 60 Z"
                    fill="url(#saNorthRidge2)"
                    stroke="#38bdf8"
                    strokeWidth="1"
                    strokeOpacity="0.45"
                  />
                  {/* Rocky Summit Peaks (Mt. Eagle 4,280' & North Spur 3,650') */}
                  <path
                    d="M 125 165 L 165 115 L 205 165 Z"
                    fill="#3b6294"
                    stroke="#93c5fd"
                    strokeWidth="1"
                    strokeOpacity="0.7"
                  />
                  <path
                    d="M 305 155 L 340 110 L 375 155 Z"
                    fill="#3b6294"
                    stroke="#93c5fd"
                    strokeWidth="1"
                    strokeOpacity="0.7"
                  />
                  {/* Peak Altitude Labels */}
                  <g fontFamily="var(--font-learning-mono)">
                    <text x="165" y="105" textAnchor="middle" fill="#93c5fd" fontSize="7.5" fontWeight="800">
                      ▲ MT. EAGLE 4,280'
                    </text>
                    <text x="340" y="100" textAnchor="middle" fill="#93c5fd" fontSize="7.5" fontWeight="800">
                      ▲ NORTH SPUR 3,650'
                    </text>
                  </g>
                </g>

                {/* 5. Southern Mountain Ranges (South Ridge & Falcon Pass) */}
                <g>
                  {/* Outer Ridge Layer (2,000' MSL) */}
                  <path
                    d="M 60 290 Q 125 330 190 315 Q 255 350 325 330 Q 385 365 460 320 L 460 460 L 60 460 Z"
                    fill="url(#saSouthRidge1)"
                    stroke="#38bdf8"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  />
                  {/* High Ridge Layer (2,800' MSL) */}
                  <path
                    d="M 90 325 Q 150 360 215 340 Q 280 380 345 355 Q 405 390 440 350 L 440 460 L 90 460 Z"
                    fill="url(#saSouthRidge2)"
                    stroke="#38bdf8"
                    strokeWidth="1"
                    strokeOpacity="0.45"
                  />
                  {/* Summit Peak (South Ridge 3,120' & Falcon Pass 2,240') */}
                  <path
                    d="M 315 365 L 350 410 L 385 365 Z"
                    fill="#385e8d"
                    stroke="#93c5fd"
                    strokeWidth="1"
                    strokeOpacity="0.65"
                  />
                  {/* Altitude Labels */}
                  <g fontFamily="var(--font-learning-mono)">
                    <text x="350" y="425" textAnchor="middle" fill="#93c5fd" fontSize="7.5" fontWeight="800">
                      ▲ SOUTH RIDGE 3,120'
                    </text>
                    <text x="155" y="380" textAnchor="middle" fill="#93c5fd" fontSize="7" fontWeight="700">
                      ▲ FALCON PASS 2,240'
                    </text>
                  </g>
                </g>

                {/* 6. Precision Synthetic Vision Flight Corridor Guides */}
                <line
                  x1="70"
                  y1="260"
                  x2="450"
                  y2="260"
                  stroke="var(--primary)"
                  strokeOpacity="0.35"
                  strokeWidth="1.2"
                  strokeDasharray="6 4"
                />

                {/* 3.0° RNAV / ILS Glidepath Beam leading into Runway */}
                <path
                  d="M 440 185 L 232 296 L 116 352"
                  stroke="url(#saGlideslopeBeam)"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                />

                {/* Aerodrome Landing Telemetry Tag */}
                <g transform="translate(260, 240)">
                  <rect x="-92" y="-10" width="184" height="20" rx="6" fill="#08101e" fillOpacity="0.88" stroke="#38bdf8" strokeOpacity="0.5" strokeWidth="0.8" />
                  <text x="0" y="3.5" textAnchor="middle" fill="#38bdf8" fontSize="7" fontWeight="800" fontFamily="var(--font-learning-mono)">
                    SILVER ARROWS AIRSTRIP · RWY 27L · ELEV 1,420'
                  </text>
                </g>
              </g>

              <g stroke="var(--border)" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="3 5">
                <circle cx="260" cy="260" r="56" />
                <circle cx="260" cy="260" r="112" />
                <line x1="92" y1="260" x2="428" y2="260" />
                <line x1="260" y1="92" x2="260" y2="428" />
              </g>

              <g ref={radarSweepRef} transform="rotate(0 260 260)">
                <path
                  d="M 260 260 L 428 190 A 168 168 0 0 1 428 260 Z"
                  fill="url(#saRadarSweepGrad)"
                />
                <line
                  x1="260"
                  y1="260"
                  x2="428"
                  y2="260"
                  stroke="var(--primary)"
                  strokeOpacity="0.35"
                  strokeWidth="1"
                />
              </g>

              <g stroke="var(--primary)" strokeWidth="2.2" strokeLinecap="round" opacity="0.75">
                <path d="M 218 260 L 242 260 L 242 267" />
                <path d="M 302 260 L 278 260 L 278 267" />
                <circle cx="260" cy="260" r="2.5" fill="var(--primary)" />
              </g>

              {/* Takeoff Track & Trail (Automatically removed once the right side of the page loads) */}
              <g
                ref={takeoffTrackGroupRef}
                data-testid="takeoff-track-trail-group"
                style={{ transition: "opacity 300ms ease" }}
              >
                <g transform="translate(174, 324) rotate(-25.8)">
                  {/* Detailed Asphalt Runway Strip (RWY 09L / 27R) */}
                  <rect
                    x="-75"
                    y="-12"
                    width="150"
                    height="24"
                    rx="3"
                    fill="url(#saRunwaySurfaceGrad)"
                    stroke="#38bdf8"
                    strokeWidth="1.2"
                    strokeOpacity="0.8"
                  />
                  {/* White Runway Edge Guidelines */}
                  <line x1="-74" y1="-10" x2="74" y2="-10" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.9" />
                  <line x1="-74" y1="10" x2="74" y2="10" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.9" />

                  {/* Threshold Stripes (Piano Keys) Departure & Arrival Ends */}
                  {[-8, -5, -2, 1, 4, 7].map((offsetY) => (
                    <line
                      key={`th-dep-${offsetY}`}
                      x1="-72"
                      y1={offsetY}
                      x2="-63"
                      y2={offsetY}
                      stroke="#ffffff"
                      strokeWidth="1.2"
                    />
                  ))}
                  {[-8, -5, -2, 1, 4, 7].map((offsetY) => (
                    <line
                      key={`th-arr-${offsetY}`}
                      x1="63"
                      y1={offsetY}
                      x2="72"
                      y2={offsetY}
                      stroke="#ffffff"
                      strokeWidth="1.2"
                    />
                  ))}

                  {/* Runway Stencil Designators 09L / 27R */}
                  <text
                    x="-52"
                    y="3"
                    fill="#ffffff"
                    fontSize="7"
                    fontWeight="900"
                    fontFamily="var(--font-learning-mono)"
                    textAnchor="middle"
                  >
                    09L
                  </text>
                  <text
                    x="52"
                    y="3"
                    fill="#ffffff"
                    fontSize="7"
                    fontWeight="900"
                    fontFamily="var(--font-learning-mono)"
                    textAnchor="middle"
                  >
                    27R
                  </text>

                  {/* Aiming Point Touchdown Zone Blocks */}
                  <rect x="-36" y="-7" width="12" height="3" fill="#ffffff" />
                  <rect x="-36" y="4" width="12" height="3" fill="#ffffff" />
                  <rect x="24" y="-7" width="12" height="3" fill="#ffffff" />
                  <rect x="24" y="4" width="12" height="3" fill="#ffffff" />

                  {/* Centerline Dashes */}
                  <line
                    x1="-56"
                    y1="0"
                    x2="56"
                    y2="0"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeDasharray="6 5"
                  />

                  {/* Green Threshold Light Bar & Red Stop Bar */}
                  <line x1="-75" y1="-12" x2="-75" y2="12" stroke="#22c55e" strokeWidth="2.5" />
                  <line x1="75" y1="-12" x2="75" y2="12" stroke="#ef4444" strokeWidth="2.5" />

                  {/* PAPI Glideslope Indicator Lights (2 White / 2 Red = On 3.0° GS) */}
                  <g transform="translate(-30, -16)">
                    <circle cx="-6" cy="0" r="1.5" fill="#ffffff" />
                    <circle cx="-2" cy="0" r="1.5" fill="#ffffff" />
                    <circle cx="2" cy="0" r="1.5" fill="#ef4444" />
                    <circle cx="6" cy="0" r="1.5" fill="#ef4444" />
                  </g>
                </g>

                <path
                  d="M 116 352 L 232 296 C 305 262, 388 204, 468 170"
                  stroke="var(--foreground)"
                  strokeOpacity="0.22"
                  strokeWidth="1.75"
                  strokeDasharray="4 6"
                />

                <path
                  ref={activeTrailRef}
                  d="M 116 352 L 232 296 C 305 262, 388 204, 468 170"
                  stroke="url(#saRnavTrackGrad)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  filter="url(#saAvionicsGlow)"
                />

                <g transform="translate(232, 296)">
                  <polygon points="0,-5 5,0 0,5 -5,0" fill="var(--primary)" />
                  <text
                    x="8"
                    y="12"
                    fill="var(--muted-foreground)"
                    fontSize="8.5"
                    fontWeight="700"
                    fontFamily="var(--font-learning-mono)"
                  >
                    VR · D095A
                  </text>
                </g>
              </g>

              {/* Interactive Aircraft Controller (Imitates mouse direction across all 360° axes) */}
              <g
                ref={controllerGroupRef}
                data-testid="interactive-aircraft-controller"
                style={{ opacity: 0, transition: "opacity 320ms ease" }}
              >
                {/* Live Directional Vector Line from Compass Center (260, 260) to Aircraft Controller */}
                <line
                  ref={controllerVectorLineRef}
                  x1="260"
                  y1="260"
                  x2="260"
                  y2="260"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  strokeOpacity="0.78"
                />

                {/* Cockpit Control Yoke / Stick Gimbal at Center Deflecting with Mouse */}
                <g ref={controllerYokeRef} transform="translate(260, 260) rotate(0)">
                  <circle
                    cx="0"
                    cy="0"
                    r="24"
                    stroke="var(--primary)"
                    strokeOpacity="0.42"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                  />
                  {/* Yoke Handles Left & Right */}
                  <path
                    d="M -28 -8 C -34 -2, -34 6, -28 11 L -16 6 L 16 6 L 28 11 C 34 6, 34 -2, 28 -8"
                    stroke="var(--primary)"
                    strokeOpacity="0.7"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>

                {/* Leading Target Flight-Path Reticle in Mouse Direction */}
                <g ref={controllerReticleRef} transform="translate(260, 260)">
                  <circle
                    cx="0"
                    cy="0"
                    r="9"
                    stroke="var(--primary)"
                    strokeOpacity="0.75"
                    strokeWidth="1.5"
                  />
                  <line x1="-14" y1="0" x2="-9" y2="0" stroke="var(--primary)" strokeWidth="1.5" />
                  <line x1="9" y1="0" x2="14" y2="0" stroke="var(--primary)" strokeWidth="1.5" />
                  <line x1="0" y1="-9" x2="0" y2="-14" stroke="var(--primary)" strokeWidth="1.5" />
                </g>

                {/* Steerable Controller Aircraft Pointing & Moving in Mouse Direction */}
                <g ref={controllerAircraftRef} transform="translate(260, 260) rotate(-25)">
                  {/* Glow wake behind aircraft */}
                  <path
                    d="M -36 0 L -14 0"
                    stroke="var(--primary)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeOpacity="0.75"
                  />
                  {/* Swept Wings */}
                  <path
                    d="M -4 -2 L -16 -24 L -5 -24 L 11 -2 Z"
                    fill="var(--primary)"
                    fillOpacity="0.88"
                  />
                  <path
                    d="M -4 2 L -16 24 L -5 24 L 11 2 Z"
                    fill="var(--primary)"
                    fillOpacity="0.88"
                  />
                  {/* Horizontal Stabilizer Tailplane */}
                  <path
                    d="M -22 -1 L -28 -11 L -22 -11 L -16 -1 Z"
                    fill="var(--foreground)"
                    fillOpacity="0.8"
                  />
                  <path
                    d="M -22 1 L -28 11 L -22 11 L -16 1 Z"
                    fill="var(--foreground)"
                    fillOpacity="0.8"
                  />
                  {/* Fuselage & Nose Cone */}
                  <path
                    d="M -26 -2.5 L 15 -3 C 23 -3 29 -1 31 0 C 29 1 23 3 15 3 L -26 2.5 Z"
                    fill="var(--foreground)"
                  />
                  {/* Cockpit Canopy */}
                  <ellipse cx="8" cy="0" rx="6.5" ry="2.1" fill="var(--primary)" />
                </g>
              </g>
            </g>

            <circle
              cx="260"
              cy="260"
              r="168"
              stroke="var(--primary)"
              strokeOpacity="0.4"
              strokeWidth="1.75"
            />

            {/* 4. PERIMETER AVIONICS TAPES (IAS LEFT, ALTITUDE RIGHT, TELEMETRY BOTTOM) */}
            <g transform="translate(50, 232)">
              <rect
                x="0"
                y="0"
                width="68"
                height="48"
                rx="10"
                fill="var(--card)"
                fillOpacity="0.88"
                stroke="var(--border)"
                strokeWidth="1.2"
              />
              <text
                x="10"
                y="16"
                fill="var(--muted-foreground)"
                fontSize="8"
                fontWeight="700"
                fontFamily="var(--font-learning-mono)"
              >
                IAS · VY
              </text>
              <text
                ref={iasTextRef}
                x="10"
                y="35"
                fill="var(--foreground)"
                fontSize="13"
                fontWeight="800"
                fontFamily="var(--font-learning-mono)"
              >
                118 KT
              </text>
            </g>

            <g transform="translate(392, 232)">
              <rect
                x="0"
                y="0"
                width="78"
                height="48"
                rx="10"
                fill="var(--card)"
                fillOpacity="0.88"
                stroke="var(--border)"
                strokeWidth="1.2"
              />
              <text
                ref={vsiTextRef}
                x="10"
                y="16"
                fill="var(--primary)"
                fontSize="8"
                fontWeight="700"
                fontFamily="var(--font-learning-mono)"
              >
                +1250 FPM
              </text>
              <text
                ref={altTextRef}
                x="10"
                y="35"
                fill="var(--foreground)"
                fontSize="12.5"
                fontWeight="800"
                fontFamily="var(--font-learning-mono)"
              >
                1,850 FT
              </text>
            </g>

            <g transform="translate(152, 444)">
              <rect
                x="0"
                y="0"
                width="216"
                height="28"
                rx="14"
                fill="var(--card)"
                fillOpacity="0.88"
                stroke="var(--border)"
                strokeWidth="1.2"
              />
              <text
                x="22"
                y="17.5"
                fill="var(--muted-foreground)"
                fontSize="9"
                fontWeight="700"
                fontFamily="var(--font-learning-mono)"
              >
                PITCH{" "}
                <tspan ref={pitchTextRef} fill="var(--primary)">
                  +10.5°
                </tspan>
              </text>
              <text
                x="108"
                y="17.5"
                textAnchor="middle"
                fill="var(--border)"
                fontSize="9"
              >
                |
              </text>
              <text
                ref={rpmTextRef}
                x="136"
                y="17.5"
                fill="var(--foreground)"
                fontSize="9"
                fontWeight="700"
                fontFamily="var(--font-learning-mono)"
              >
                98% N1
              </text>
              <text
                x="194"
                y="17.5"
                textAnchor="end"
                fill="var(--muted-foreground)"
                fontSize="8.5"
                fontFamily="var(--font-learning-mono)"
              >
                1013
              </text>
            </g>

            {/* 5. RIGHT CIRCULAR RIM DEPARTURE FIX WAYPOINT (SLVR1 @ 468, 170) */}
            <g
              ref={settledEndpointRef}
              transform="translate(468, 170)"
              style={{ opacity: phase === "settled" || phase === "reduced-motion" ? 0.85 : 0 }}
            >
              <circle
                r="7"
                fill="var(--card)"
                stroke="var(--primary)"
                strokeWidth="2"
                filter="url(#saAvionicsGlow)"
              />
              <circle r="2.5" fill="var(--primary)" />
            </g>

            <circle
              ref={glowDotRef}
              cx="116"
              cy="352"
              r="4.5"
              fill="var(--primary)"
              filter="url(#saAvionicsGlow)"
            />

            {/* Animated Aircraft Group Travelling Across the Circle to the Right Rim (468, 170) */}
            <g ref={aircraftGroupRef} transform="translate(116, 352) rotate(-25.8)">
              <g ref={aircraftDetailRef}>
                <path
                  d="M -44 0 L -18 0"
                  stroke="var(--primary)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeOpacity="0.65"
                />
                <path
                  d="M -3 -2 L -14 -20 L -5 -20 L 9 -2 Z"
                  fill="var(--primary)"
                  fillOpacity="0.7"
                />
                <path
                  d="M -26 -2 L -20 -14 L -13 -14 L -8 -3 L 14 -4 C 21 -4 27 -1 29 1 C 26 4 19 5 10 5 L -22 4 Z"
                  fill="var(--foreground)"
                />
                <path
                  d="M -5 1 L -18 19 L -8 19 L 10 2 Z"
                  fill="var(--primary)"
                />
                <ellipse cx="30" cy="1" rx="1.6" ry="9.5" fill="var(--primary)" />
              </g>

              <g ref={morphArrowRef} style={{ opacity: 0 }}>
                <path
                  d="M -24 -4 L 30 0 L -16 17 L -5 2 Z"
                  fill="var(--primary)"
                  filter="url(#saAvionicsGlow)"
                />
              </g>
            </g>
          </svg>
        </div>
      </div>
      {/* Playback Controls & Fast-Forward Action */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
        {phase === "autoplay-blocked" && (
          <button
            type="button"
            onClick={startSequence}
            aria-label="Play aircraft takeoff sequence"
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-background/85 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur-md transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Play takeoff</span>
          </button>
        )}

        {isRunning && (
          <button
            type="button"
            onClick={handleSkip}
            aria-label="Skip takeoff sequence"
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-primary/15 px-3.5 py-1.5 text-xs font-bold text-primary shadow-xs backdrop-blur-md transition hover:bg-primary hover:text-primary-foreground cursor-pointer"
          >
            <SkipForward className="h-3.5 w-3.5" />
            <span>Skip Takeoff (Fast-Forward)</span>
          </button>
        )}

        {showReplay && (
          <button
            type="button"
            onClick={handleReplay}
            aria-label="Replay takeoff sequence"
            className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/85 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-xs backdrop-blur-md transition hover:border-primary/60 hover:text-foreground cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Replay Takeoff &amp; Approach</span>
          </button>
        )}
      </div>

      {/* Live Avionics Status Readout */}
      <p className="mt-2 text-center font-mono text-[10px] tracking-wider text-muted-foreground/80">
        <span ref={stageTextRef}>TERRAIN SYNTHETIC VISION · RWY 27L APPROACH</span> ·{" "}
        <span>MOVE MOUSE TO STEER AIRCRAFT VECTOR</span>
      </p>
    </div>
  );
}
