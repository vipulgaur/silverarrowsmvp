import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Landing-page airfield scene, seen from a fixed spotter position beside the runway.
 *
 * - A light trainer takes off left to right (into wind): constant-acceleration ground
 *   roll, rotation about the main wheels, lift-off, then an accelerating climb-out.
 *   Its ground shadow separates and fades as it climbs.
 * - High above, two distant jets fly a formation join-up. Their smoke trails converge
 *   into the two-blade "V" of the SilverArrows mark, then widen, fade and drift with
 *   the wind.
 * - The wind is consistent everywhere: the windsock streams left, clouds and smoke
 *   drift left, and the take-off is into wind.
 *
 * Motion is computed by pure functions (exported for tests) and applied to SVG nodes
 * through refs in one requestAnimationFrame loop, so React does not re-render per
 * frame. The loop pauses when the scene is off-screen, when the tab is hidden, or when
 * the user presses pause. Reduced-motion users get a static composed frame.
 */

export const SCENE = { width: 1600, height: 700, runwayY: 612 } as const;

/**
 * Master loop length (s). The departure plays first (≈0.6–8 s), then the formation
 * join-up (7.5–20 s); the smoke has fully dispersed before the loop restarts.
 */
export const LOOP_DURATION = 30;

const AIRCRAFT_SCALE = 2.1;
/** Local x of the main-wheel contact point: the pivot for rotation. */
const MAIN_GEAR_X = 47;

export const TAKEOFF = {
  start: 0.6, // loop time when the roll enters the frame
  x0: -160,
  v0: 60,
  rollAccel: 60,
  rotateX: 560,
  rotateDuration: 1,
  rotatePitch: 8,
  climbAccel: 22,
  climbGradient: 0.16, // ≈ 9° flight-path angle
  transitionDistance: 260,
  climbAngleOfAttack: 3,
  exitX: SCENE.width + 220,
} as const;

const ROLL_DISTANCE = TAKEOFF.rotateX - TAKEOFF.x0;
const T_ROTATE =
  (-TAKEOFF.v0 + Math.sqrt(TAKEOFF.v0 ** 2 + 2 * TAKEOFF.rollAccel * ROLL_DISTANCE)) /
  TAKEOFF.rollAccel;
const T_LIFTOFF = T_ROTATE + TAKEOFF.rotateDuration;
const X_LIFTOFF = TAKEOFF.x0 + TAKEOFF.v0 * T_LIFTOFF + 0.5 * TAKEOFF.rollAccel * T_LIFTOFF ** 2;
const V_LIFTOFF = TAKEOFF.v0 + TAKEOFF.rollAccel * T_LIFTOFF;
const CLIMB_DISTANCE = TAKEOFF.exitX - X_LIFTOFF;
const T_EXIT =
  T_LIFTOFF +
  (-V_LIFTOFF + Math.sqrt(V_LIFTOFF ** 2 + 2 * TAKEOFF.climbAccel * CLIMB_DISTANCE)) /
    TAKEOFF.climbAccel;

/** Derived take-off cue points, in seconds since the roll started. */
export const TAKEOFF_TIMING = {
  rotate: T_ROTATE,
  liftOff: T_LIFTOFF,
  exit: T_EXIT,
} as const;

export type TakeoffPhase = "waiting" | "roll" | "rotate" | "climb" | "gone";

export interface TakeoffFrame {
  phase: TakeoffPhase;
  /** Main-wheel x position (scene units). */
  x: number;
  /** Main-wheel height above the runway (scene units). */
  altitude: number;
  /** Pitch attitude, degrees, nose-up positive. */
  pitch: number;
  /** Horizontal speed (scene units per second). */
  speed: number;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (edge0: number, edge1: number, v: number) => {
  const s = clamp01((v - edge0) / (edge1 - edge0));
  return s * s * (3 - 2 * s);
};
const easeInOutSine = (v: number) => -(Math.cos(Math.PI * clamp01(v)) - 1) / 2;
const lerp = (a: number, b: number, s: number) => a + (b - a) * s;

/** Trainer state `t` seconds after the take-off roll enters the frame. */
export function computeTakeoffFrame(t: number): TakeoffFrame {
  if (t < 0) {
    return { phase: "waiting", x: TAKEOFF.x0, altitude: 0, pitch: 0, speed: TAKEOFF.v0 };
  }

  if (t <= T_LIFTOFF) {
    const x = TAKEOFF.x0 + TAKEOFF.v0 * t + 0.5 * TAKEOFF.rollAccel * t * t;
    const speed = TAKEOFF.v0 + TAKEOFF.rollAccel * t;
    if (t <= T_ROTATE) return { phase: "roll", x, altitude: 0, pitch: 0, speed };
    const pitch = TAKEOFF.rotatePitch * easeInOutSine((t - T_ROTATE) / TAKEOFF.rotateDuration);
    return { phase: "rotate", x, altitude: 0, pitch, speed };
  }

  const tau = t - T_LIFTOFF;
  const x = X_LIFTOFF + V_LIFTOFF * tau + 0.5 * TAKEOFF.climbAccel * tau * tau;
  const speed = V_LIFTOFF + TAKEOFF.climbAccel * tau;
  const d = x - X_LIFTOFF;
  const g = TAKEOFF.climbGradient;
  const transition = TAKEOFF.transitionDistance;

  // The climb gradient builds smoothly over the transition distance after lift-off.
  const baseAltitude =
    d < transition ? (g * d * d) / (2 * transition) : (g * transition) / 2 + g * (d - transition);
  const gammaDeg = (Math.atan(d < transition ? (g * d) / transition : g) * 180) / Math.PI;
  const climbPitch = gammaDeg + TAKEOFF.climbAngleOfAttack;
  const basePitch = lerp(TAKEOFF.rotatePitch, climbPitch, smoothstep(0, 1, d / transition));

  // Light turbulence once clear of the ground.
  const k = clamp01(baseAltitude / 40);
  const altitude = baseAltitude + 0.9 * Math.sin(1.4 * tau + 0.6) * k;
  const pitch = basePitch + 0.35 * Math.sin(2.3 * tau) * k;

  return { phase: x >= TAKEOFF.exitX ? "gone" : "climb", x, altitude, pitch, speed };
}

export function aircraftTransform(frame: TakeoffFrame): string {
  const y = SCENE.runwayY - frame.altitude;
  return `translate(${frame.x.toFixed(2)} ${y.toFixed(2)}) rotate(${(-frame.pitch).toFixed(3)}) scale(${AIRCRAFT_SCALE}) translate(${-MAIN_GEAR_X} 0)`;
}

/** Ground shadow: the sun is low and ahead, so the shadow falls behind the aircraft. */
export function shadowFor(frame: TakeoffFrame) {
  const h = Math.max(0, frame.altitude);
  return {
    cx: frame.x + 12 - h * 0.85,
    rx: 34 * AIRCRAFT_SCALE * (1 + h / 220),
    ry: 2.4 * (1 + h / 90),
    opacity: Math.exp(-h / 55),
  };
}

/* ── Formation join-up ─────────────────────────────────────────────────────── */

type Point = readonly [number, number];

export const FORMATION = {
  start: 7.5,
  join: 16.5,
  exit: 20,
  leadStart: [-70, 212] as Point,
  wingStart: [-70, 372] as Point,
  joinPoint: [1150, 148] as Point,
  wingOffset: [-24, 13] as Point,
  exitPoint: [1760, 34] as Point,
  sampleInterval: 0.2,
  trailLife: 8,
  wind: 7, // smoke drift to the left, scene units per second
  sink: 0.5,
} as const;

export const TRAIL_POOL =
  Math.ceil((FORMATION.exit - FORMATION.start) / FORMATION.sampleInterval) + 2;

export interface JetState {
  x: number;
  y: number;
  angle: number;
  visible: boolean;
}

export interface TrailSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  opacity: number;
}

function jetPosition(role: "lead" | "wing", te: number): Point {
  const off: Point = role === "wing" ? FORMATION.wingOffset : [0, 0];
  const start = role === "wing" ? FORMATION.wingStart : FORMATION.leadStart;
  const join: Point = [FORMATION.joinPoint[0] + off[0], FORMATION.joinPoint[1] + off[1]];
  const exit: Point = [FORMATION.exitPoint[0] + off[0], FORMATION.exitPoint[1] + off[1]];
  if (te <= FORMATION.join) {
    const s = clamp01((te - FORMATION.start) / (FORMATION.join - FORMATION.start));
    return [lerp(start[0], join[0], s), lerp(start[1], join[1], s)];
  }
  const s = clamp01((te - FORMATION.join) / (FORMATION.exit - FORMATION.join));
  return [lerp(join[0], exit[0], s), lerp(join[1], exit[1], s)];
}

function jetHeading(role: "lead" | "wing", t: number): number {
  const off: Point = role === "wing" ? FORMATION.wingOffset : [0, 0];
  const start = role === "wing" ? FORMATION.wingStart : FORMATION.leadStart;
  const join: Point = [FORMATION.joinPoint[0] + off[0], FORMATION.joinPoint[1] + off[1]];
  const exit: Point = [FORMATION.exitPoint[0] + off[0], FORMATION.exitPoint[1] + off[1]];
  const before = Math.atan2(join[1] - start[1], join[0] - start[0]);
  const after = Math.atan2(exit[1] - join[1], exit[0] - join[0]);
  const blend = smoothstep(FORMATION.join - 0.8, FORMATION.join + 0.8, t);
  return (lerp(before, after, blend) * 180) / Math.PI;
}

function trailFor(role: "lead" | "wing", t: number): TrailSegment[] {
  const head = Math.min(t, FORMATION.exit);
  if (head <= FORMATION.start) return [];
  const times: number[] = [];
  for (let te = FORMATION.start; te < head; te += FORMATION.sampleInterval) times.push(te);
  times.push(head);

  const points = times.map((te) => {
    const [px, py] = jetPosition(role, te);
    const age = t - te;
    return { x: px - FORMATION.wind * age, y: py + FORMATION.sink * age, age };
  });

  const segments: TrailSegment[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!;
    const b = points[i + 1]!;
    const age = (a.age + b.age) / 2;
    const fadeIn = clamp01(age / 0.25);
    const fadeOut = 1 - smoothstep(4.5, FORMATION.trailLife, age);
    segments.push({
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      width: Math.min(7, 1.1 + 0.75 * age),
      opacity: 0.62 * fadeIn * fadeOut,
    });
  }
  return segments;
}

/** Both jets and their smoke trails at master-loop time `t`. */
export function computeFormation(t: number) {
  const visible = t >= FORMATION.start && t <= FORMATION.exit;
  const jet = (role: "lead" | "wing"): JetState => {
    const [x, y] = jetPosition(role, t);
    return { x, y, angle: jetHeading(role, t), visible };
  };
  return {
    lead: jet("lead"),
    wing: jet("wing"),
    trails: [trailFor("lead", t), trailFor("wing", t)] as const,
  };
}

export function sceneFrameAt(loopTime: number) {
  return {
    plane: computeTakeoffFrame(loopTime - TAKEOFF.start),
    formation: computeFormation(loopTime),
  };
}

/**
 * Still frame for reduced-motion users: the trainer just after lift-off and the
 * formation shortly after the join, so the converging trails read as the brand mark.
 */
export function reducedMotionFrame() {
  return {
    plane: computeTakeoffFrame(TAKEOFF_TIMING.liftOff + 1.5),
    formation: computeFormation(FORMATION.join + 2.2),
  };
}

/* ── Static artwork ────────────────────────────────────────────────────────── */

/** Deterministic pseudo-random value in [0, 1). */
function hash(n: number) {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

function buildTreeline(): string {
  const base = 590;
  let d = `M0 ${base}`;
  let x = 0;
  let i = 0;
  while (x < SCENE.width) {
    const width = 10 + hash(i) * 16;
    // Leave the airfield buildings in clear view.
    const clearing = x > 120 && x < 470;
    const height = clearing ? 0.5 + hash(i + 7) * 1.5 : 7 + hash(i + 31) * 17;
    const next = Math.min(SCENE.width, x + width);
    d += ` Q ${(x + next) / 2} ${base - height * 2} ${next} ${base - hash(i + 53) * 2}`;
    x = next;
    i += 1;
  }
  return `${d} L${SCENE.width} 604 L0 604 Z`;
}

const TREELINE = buildTreeline();

const STARS = Array.from({ length: 46 }, (_, i) => ({
  cx: hash(i + 101) * SCENE.width,
  cy: 18 + hash(i + 202) * 250,
  r: 0.5 + hash(i + 303) * 0.9,
}));

const RUNWAY_LIGHTS = Array.from({ length: 18 }, (_, i) => 20 + i * 96);

const FAR_RIDGE =
  "M0 512 C 140 494, 240 470, 380 486 S 640 458, 800 480 S 1060 466, 1220 488 S 1450 466, 1600 482 L1600 700 L0 700 Z";
const NEAR_RIDGE =
  "M0 560 C 170 542, 310 532, 470 548 S 780 534, 930 552 S 1230 530, 1370 550 S 1530 542, 1600 548 L1600 700 L0 700 Z";

const FUSELAGE =
  "M73 -9.6 C72.6 -11.4 71 -12.2 69.5 -12.3 L61 -13.2 C58 -13.4 55.5 -16.8 52 -18.6 C49 -19.6 44 -19.8 39 -19.4 C35 -19 31.5 -16.6 28 -15.2 L9 -12.4 L6.5 -12.2 L1.2 -11.6 L0.6 -10 C8 -9.2 20 -7.6 36 -6 L56 -5.4 C62 -5.6 66.5 -6.4 69.5 -7.6 C71 -8.1 72.6 -8.6 73 -9.6 Z";
const FIN = "M10.5 -12.3 C8 -14 5.4 -19 4.2 -23.6 L0.2 -23.8 C0 -19 0.4 -14.5 1.2 -11.6 Z";
const STABILATOR = "M0.4 -11.4 L11.5 -11.2 L11.8 -10.4 L0.6 -10.2 Z";
const WINDOWS =
  "M53 -17.4 C50.5 -18.5 45 -18.7 40 -18.4 L40 -14.4 L54.6 -14.4 Z M38.4 -18.2 C35 -17.9 32 -16.2 30.2 -15.2 L30.2 -14.4 L38.4 -14.4 Z";
const WING =
  "M58 -5.2 C57 -6.8 52.5 -7.2 47.5 -6.7 L39 -5.4 L39.2 -4.6 L57.4 -4.3 C58 -4.4 58.3 -4.8 58 -5.2 Z";
const JET =
  "M26 0 C22 -1.5 14 -2.1 4 -1.7 L1.5 -6.2 L-0.6 -6.2 L0.4 -1.2 L0 0 L0.6 1.1 L4 1.6 C14 2.1 22 1.5 26 0 Z M15 0.4 L7 4.8 L4.6 4.8 L9 0.6 Z";

interface CloudSpec {
  left: string;
  top: string;
  width: string;
}

const CUMULUS: CloudSpec[] = [
  { left: "4%", top: "13%", width: "16%" },
  { left: "31%", top: "25%", width: "10%" },
  { left: "55%", top: "8%", width: "19%" },
  { left: "83%", top: "29%", width: "9%" },
];

const CIRRUS: CloudSpec[] = [
  { left: "10%", top: "6%", width: "24%" },
  { left: "46%", top: "4%", width: "18%" },
  { left: "70%", top: "12%", width: "28%" },
];

const PUFFS = [
  { left: "10%", top: "24%", width: "38%", height: "68%" },
  { left: "29%", top: "2%", width: "42%", height: "86%" },
  { left: "54%", top: "16%", width: "36%", height: "72%" },
  { left: "70%", top: "34%", width: "26%", height: "54%" },
];

function Cumulus({ spec }: { spec: CloudSpec }) {
  return (
    <div className="sa-cloud" style={{ left: spec.left, top: spec.top, width: spec.width }}>
      {/* Clip first, then blur (outer filter) for a soft but flat cloud base. */}
      <div className="absolute inset-0" style={{ clipPath: "inset(0 0 16% 0)" }}>
        <span
          className="sa-puff sa-puff--base"
          style={{ left: "4%", top: "46%", width: "92%", height: "46%" }}
        />
        {PUFFS.map((p, i) => (
          <span key={i} className="sa-puff" style={p} />
        ))}
      </div>
    </div>
  );
}

function CloudStrip({ high }: { high?: boolean }) {
  const set = (key: string) => (
    <div key={key} className="sa-cloud-set">
      {high
        ? CIRRUS.map((c, i) => (
            <span
              key={i}
              className="sa-cirrus"
              style={{ left: c.left, top: c.top, width: c.width, transform: "rotate(-3deg)" }}
            />
          ))
        : CUMULUS.map((c, i) => <Cumulus key={i} spec={c} />)}
    </div>
  );
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className={cn("sa-cloud-strip", high && "sa-cloud-strip--high")}>
        {set("a")}
        {set("b")}
      </div>
    </div>
  );
}

function prefersReducedMotion(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  } catch {
    return false;
  }
}

const SVG_PROPS = {
  viewBox: `0 0 ${SCENE.width} ${SCENE.height}`,
  preserveAspectRatio: "xMidYMax slice",
  className: "absolute inset-0 h-full w-full",
} as const;

export function LandingTakeoffScene({ className }: { className?: string }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  // Server render and the first live frame both use loop time 0, so hydration does not jump.
  const initial = useMemo(
    () => (reducedMotion ? reducedMotionFrame() : sceneFrameAt(0)),
    [reducedMotion],
  );
  const initialShadow = shadowFor(initial.plane);

  const [playing, setPlaying] = useState(true);
  const playingRef = useRef(true);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const aircraftRef = useRef<SVGGElement | null>(null);
  const shadowRef = useRef<SVGEllipseElement | null>(null);
  const leadRef = useRef<SVGGElement | null>(null);
  const wingRef = useRef<SVGGElement | null>(null);
  const segmentRefs = useRef<Array<Array<SVGLineElement | null>>>([[], []]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setReducedMotion(true);
      return;
    }
    if (typeof window.requestAnimationFrame !== "function") return;

    const applyFrame = (loopTime: number) => {
      const { plane, formation } = sceneFrameAt(loopTime);
      aircraftRef.current?.setAttribute("transform", aircraftTransform(plane));

      const shadow = shadowFor(plane);
      const shadowEl = shadowRef.current;
      if (shadowEl) {
        shadowEl.setAttribute("cx", shadow.cx.toFixed(2));
        shadowEl.setAttribute("rx", shadow.rx.toFixed(2));
        shadowEl.setAttribute("ry", shadow.ry.toFixed(2));
        shadowEl.setAttribute("fill-opacity", shadow.opacity.toFixed(3));
      }

      const jets = [
        [leadRef.current, formation.lead],
        [wingRef.current, formation.wing],
      ] as const;
      for (const [el, jet] of jets) {
        if (!el) continue;
        el.setAttribute(
          "transform",
          `translate(${jet.x.toFixed(2)} ${jet.y.toFixed(2)}) rotate(${jet.angle.toFixed(2)})`,
        );
        el.style.opacity = jet.visible ? "1" : "0";
      }

      formation.trails.forEach((segments, trailIndex) => {
        const pool = segmentRefs.current[trailIndex] ?? [];
        for (let i = 0; i < pool.length; i++) {
          const line = pool[i];
          if (!line) continue;
          const seg = segments[i];
          if (!seg || seg.opacity < 0.004) {
            line.setAttribute("stroke-opacity", "0");
            continue;
          }
          line.setAttribute("x1", seg.x1.toFixed(1));
          line.setAttribute("y1", seg.y1.toFixed(1));
          line.setAttribute("x2", seg.x2.toFixed(1));
          line.setAttribute("y2", seg.y2.toFixed(1));
          line.setAttribute("stroke-width", seg.width.toFixed(2));
          line.setAttribute("stroke-opacity", seg.opacity.toFixed(3));
        }
      });
    };

    let visible = true;
    let observer: IntersectionObserver | undefined;
    if (rootRef.current && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          visible = entries.some((entry) => entry.isIntersecting);
        },
        { threshold: 0 },
      );
      observer.observe(rootRef.current);
    }

    let clock = 0;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      if (playingRef.current && visible && !document.hidden) {
        clock = (clock + dt) % LOOP_DURATION;
        applyFrame(clock);
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      data-testid="landing-scene"
      data-motion={reducedMotion ? "reduced" : "full"}
      data-paused={!playing || reducedMotion ? "true" : "false"}
      className={cn("sa-scene relative w-full overflow-hidden", className)}
    >
      <div aria-hidden="true" className="absolute inset-0">
        {/* Sky */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--sa-sky-top) 0%, var(--sa-sky-mid) 52%, var(--sa-sky-horizon) 80%, var(--sa-sky-horizon) 100%)",
          }}
        />

        {/* Stars (dusk only) and the low sun */}
        <svg {...SVG_PROPS}>
          <defs>
            <radialGradient id="sa-sun-glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" className="sa-stop-sun" />
              <stop offset="1" className="sa-stop-sun" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g className="sa-stars">
            {STARS.map((s, i) => (
              <circle key={i} cx={s.cx} cy={s.cy} r={s.r} />
            ))}
          </g>
          <circle cx={1290} cy={478} r={330} fill="url(#sa-sun-glow)" />
          <circle className="sa-sun-disc" cx={1290} cy={478} r={15} />
        </svg>

        <CloudStrip high />

        {/* Formation join-up and smoke trails */}
        <svg {...SVG_PROPS}>
          {initial.formation.trails.map((segments, trailIndex) => (
            <g key={trailIndex}>
              {Array.from({ length: TRAIL_POOL }, (_, i) => {
                const seg = segments[i];
                return (
                  <line
                    key={i}
                    ref={(el) => {
                      segmentRefs.current[trailIndex]![i] = el;
                    }}
                    className="sa-smoke"
                    x1={seg?.x1 ?? 0}
                    y1={seg?.y1 ?? 0}
                    x2={seg?.x2 ?? 0}
                    y2={seg?.y2 ?? 0}
                    strokeWidth={seg?.width ?? 1}
                    strokeOpacity={seg?.opacity ?? 0}
                  />
                );
              })}
            </g>
          ))}
          {(
            [
              [leadRef, initial.formation.lead],
              [wingRef, initial.formation.wing],
            ] as const
          ).map(([ref, jet], i) => (
            <g
              key={i}
              ref={ref}
              transform={`translate(${jet.x.toFixed(2)} ${jet.y.toFixed(2)}) rotate(${jet.angle.toFixed(2)})`}
              style={{ opacity: jet.visible ? 1 : 0 }}
            >
              <path className="sa-jet" d={JET} />
            </g>
          ))}
        </svg>

        <CloudStrip />

        {/* Terrain, airfield and the trainer */}
        <svg {...SVG_PROPS}>
          <defs>
            <linearGradient id="sa-grass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" className="sa-stop-grass-top" />
              <stop offset="1" className="sa-stop-grass-bottom" />
            </linearGradient>
            <linearGradient id="sa-landing-beam" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" className="sa-stop-landing" stopOpacity="0.85" />
              <stop offset="1" className="sa-stop-landing" stopOpacity="0" />
            </linearGradient>
            <filter id="sa-soft" x="-50%" y="-200%" width="200%" height="500%">
              <feGaussianBlur stdDeviation="2.2" />
            </filter>
            <filter id="sa-halo" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          <path className="sa-far" d={FAR_RIDGE} />
          <path className="sa-near" d={NEAR_RIDGE} />

          {/* Hangar, office and control tower on the far side of the runway */}
          <g>
            <path className="sa-building" d="M150 592 L150 566 Q240 547 330 566 L330 592 Z" />
            <rect className="sa-door" x={176} y={572} width={128} height={20} />
            <rect className="sa-building" x={334} y={574} width={56} height={18} />
            {[342, 356, 370].map((x) => (
              <rect key={x} className="sa-window" x={x} y={579} width={8} height={4} />
            ))}
            <rect className="sa-building" x={421} y={552} width={12} height={40} />
            <path className="sa-building" d="M410 552 L444 552 L440 538 L414 538 Z" />
            <rect className="sa-window" x={415} y={541} width={24} height={6} />
          </g>

          <path className="sa-trees" d={TREELINE} />
          <rect
            x={0}
            y={588}
            width={SCENE.width}
            height={SCENE.height - 588}
            fill="url(#sa-grass)"
          />

          {/* Runway */}
          <rect className="sa-runway" x={0} y={600} width={SCENE.width} height={24} />
          <line
            className="sa-runway-edge"
            x1={0}
            y1={601}
            x2={SCENE.width}
            y2={601}
            strokeWidth={0.8}
          />
          <line
            className="sa-runway-edge"
            x1={0}
            y1={623}
            x2={SCENE.width}
            y2={623}
            strokeWidth={1.2}
          />
          <line
            className="sa-centerline"
            x1={0}
            y1={612}
            x2={SCENE.width}
            y2={612}
            strokeWidth={1.1}
            strokeDasharray="34 30"
          />
          {RUNWAY_LIGHTS.map((x) => (
            <g key={x}>
              <circle className="sa-rwy-halo" cx={x + 40} cy={599} r={4} filter="url(#sa-halo)" />
              <circle className="sa-rwy-light" cx={x + 40} cy={599} r={1} />
              <circle className="sa-rwy-halo" cx={x} cy={625.5} r={6} filter="url(#sa-halo)" />
              <circle className="sa-rwy-light" cx={x} cy={625.5} r={1.6} />
            </g>
          ))}

          {/* Windsock streams downwind (left): the wind is from the right */}
          <line className="sa-pole" x1={1240} y1={600} x2={1240} y2={565} strokeWidth={1.6} />
          <g className="sa-sock">
            <path className="sa-sock-orange" d="M1240 564 L1231 564.6 L1231 572.4 L1240 573 Z" />
            <path className="sa-sock-white" d="M1231 564.6 L1223 565.3 L1223 571.7 L1231 572.4 Z" />
            <path
              className="sa-sock-orange"
              d="M1223 565.3 L1215.5 566 L1215.5 571 L1223 571.7 Z"
            />
            <path
              className="sa-sock-white"
              d="M1215.5 566 L1208.5 566.7 L1208.5 570.3 L1215.5 571 Z"
            />
            <path
              className="sa-sock-orange"
              d="M1208.5 566.7 L1202 567.4 L1202 569.6 L1208.5 570.3 Z"
            />
          </g>

          <ellipse
            ref={shadowRef}
            className="sa-shadow"
            cx={initialShadow.cx}
            cy={613.5}
            rx={initialShadow.rx}
            ry={initialShadow.ry}
            fillOpacity={initialShadow.opacity}
            filter="url(#sa-soft)"
          />

          {/* Single-engine low-wing trainer, side view, facing right */}
          <g ref={aircraftRef} transform={aircraftTransform(initial.plane)}>
            <polygon
              className="sa-landing-cone"
              points="58,-5.6 150,-16 150,7 58,-4.4"
              fill="url(#sa-landing-beam)"
            />
            <path className="sa-airframe" d={FIN} />
            <path className="sa-airframe" d={STABILATOR} />
            <path className="sa-airframe" d={FUSELAGE} />
            <path className="sa-glass" d={WINDOWS} />
            <path className="sa-airframe" d={WING} />
            <path
              className="sa-strut"
              d="M48.6 -4.4 L47.2 -2.4 M64.2 -6.2 L64.6 -2.8"
              strokeWidth={0.9}
              fill="none"
            />
            <ellipse className="sa-airframe" cx={47} cy={-2} rx={3.4} ry={2} />
            <ellipse className="sa-airframe" cx={64.9} cy={-1.8} rx={2.7} ry={1.8} />
            <ellipse className="sa-prop" cx={73.8} cy={-9.6} rx={0.9} ry={10.6} />
            <g className="sa-lights">
              <circle cx={50.5} cy={-5} r={0.8} fill="oklch(58% 0.22 25)" />
              <circle className="sa-strobe" cx={50.5} cy={-5} r={1.1} />
              <circle className="sa-beacon" cx={2.4} cy={-24.4} r={0.9} />
            </g>
          </g>
        </svg>
      </div>

      {!reducedMotion && (
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause background animation" : "Play background animation"}
          className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:right-5 sm:top-5"
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
      )}
    </div>
  );
}
