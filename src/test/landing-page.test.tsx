import { afterEach, describe, expect, it, vi } from "vitest";
import type React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual<Record<string, unknown>>("@tanstack/react-router");
  return {
    ...actual,
    Link: ({
      children,
      to,
      ...props
    }: { children?: React.ReactNode; to?: unknown } & Record<string, unknown>) => (
      <a href={typeof to === "string" ? to : "#"} {...props}>
        {children}
      </a>
    ),
  };
});

import { Route } from "@/routes/index";
import {
  computeFormation,
  computeTakeoffFrame,
  FORMATION,
  LOOP_DURATION,
  shadowFor,
  TAKEOFF,
  TAKEOFF_TIMING,
  TRAIL_POOL,
} from "@/components/landing-takeoff-scene";
import { ELEARNING_MODULES } from "@/lib/elearning-courses";

function renderLanding() {
  const Component = Route.options.component!;
  return render(<Component />);
}

describe("Landing take-off kinematics", () => {
  it("rolls on the runway with no pitch until rotation speed", () => {
    for (const t of [0, 1, 2, 3, TAKEOFF_TIMING.rotate]) {
      const frame = computeTakeoffFrame(t);
      expect(frame.altitude).toBe(0);
      expect(frame.pitch).toBe(0);
    }
    expect(computeTakeoffFrame(-1).phase).toBe("waiting");
  });

  it("accelerates continuously along the runway and through the climb", () => {
    let prevX = -Infinity;
    let prevSpeed = 0;
    for (let t = 0; t <= TAKEOFF_TIMING.exit; t += 0.1) {
      const frame = computeTakeoffFrame(t);
      expect(frame.x).toBeGreaterThan(prevX);
      expect(frame.speed).toBeGreaterThanOrEqual(prevSpeed);
      expect(frame.pitch).toBeGreaterThanOrEqual(0);
      expect(frame.pitch).toBeLessThan(14);
      prevX = frame.x;
      prevSpeed = frame.speed;
    }
  });

  it("rotates about the main wheels before lifting off, then climbs", () => {
    const rotating = computeTakeoffFrame((TAKEOFF_TIMING.rotate + TAKEOFF_TIMING.liftOff) / 2);
    expect(rotating.phase).toBe("rotate");
    expect(rotating.altitude).toBe(0);
    expect(rotating.pitch).toBeGreaterThan(0);

    const liftOff = computeTakeoffFrame(TAKEOFF_TIMING.liftOff);
    expect(liftOff.pitch).toBeCloseTo(TAKEOFF.rotatePitch, 5);

    const climb = computeTakeoffFrame(TAKEOFF_TIMING.liftOff + 1);
    expect(climb.phase).toBe("climb");
    expect(climb.altitude).toBeGreaterThan(20);
    expect(computeTakeoffFrame(TAKEOFF_TIMING.exit - 0.1).altitude).toBeGreaterThan(80);
    expect(computeTakeoffFrame(TAKEOFF_TIMING.exit + 0.1).phase).toBe("gone");
  });

  it("separates and fades the ground shadow as the aircraft climbs", () => {
    const ground = shadowFor(computeTakeoffFrame(1));
    const airborne = computeTakeoffFrame(TAKEOFF_TIMING.liftOff + 1.5);
    const high = shadowFor(airborne);
    expect(ground.opacity).toBe(1);
    expect(high.opacity).toBeLessThan(0.5);
    expect(high.cx).toBeLessThan(airborne.x);
  });
});

describe("Landing formation join-up", () => {
  it("converges two widely separated jets into close formation", () => {
    const start = computeFormation(FORMATION.start + 0.5);
    expect(Math.abs(start.wing.y - start.lead.y)).toBeGreaterThan(100);

    const joined = computeFormation(FORMATION.join);
    const gap = Math.hypot(joined.wing.x - joined.lead.x, joined.wing.y - joined.lead.y);
    expect(gap).toBeLessThan(30);
    expect(joined.lead.visible).toBe(true);
    expect(computeFormation(FORMATION.exit + 0.5).lead.visible).toBe(false);
  });

  it("lets the smoke drift downwind, then disperse before the loop restarts", () => {
    // Follow the puff emitted one second before the join.
    const index = Math.round((FORMATION.join - 1 - FORMATION.start) / FORMATION.sampleInterval);
    const early = computeFormation(FORMATION.join).trails[0][index]!;
    const later = computeFormation(FORMATION.join + 2).trails[0][index]!;
    expect(later.x1).toBeLessThan(early.x1);
    expect(later.width).toBeGreaterThan(early.width);

    const end = computeFormation(LOOP_DURATION - 0.01);
    for (const trail of end.trails) {
      expect(trail.length).toBeLessThanOrEqual(TRAIL_POOL);
      for (const segment of trail) expect(segment.opacity).toBeLessThan(0.01);
    }
  });
});

describe("Landing page", () => {
  const originalMatchMedia = window.matchMedia;
  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: originalMatchMedia,
    });
  });

  it("shows the heading and both options immediately, without waiting for the animation", () => {
    renderLanding();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      "Ground school and flight operations",
    );
    expect(screen.getByRole("heading", { name: "Ground School" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Flight Operations" })).toBeTruthy();
    expect(screen.getByTestId("landing-btn-elearning").getAttribute("href")).toBe("/elearning");
    expect(screen.getByTestId("landing-btn-flight-logger").getAttribute("href")).toBe("/login");
    expect(
      screen.getByText(`${ELEARNING_MODULES.length} theory courses, from Air Law to Powerplant`),
    ).toBeTruthy();
    expect(screen.getByTestId("landing-build-badge")).toBeTruthy();
  });

  it("toggles the 'details to be added soon' notice from the top links", () => {
    renderLanding();
    fireEvent.click(screen.getByRole("button", { name: "About Us" }));
    expect(screen.getByTestId("top-bar-coming-soon-panel").textContent).toContain(
      "Details to be added soon",
    );
    fireEvent.click(screen.getByRole("button", { name: "About Us" }));
    expect(screen.queryByTestId("top-bar-coming-soon-panel")).toBeNull();
  });

  it("lets the user pause and resume the background animation", () => {
    renderLanding();
    const scene = screen.getByTestId("landing-scene");
    fireEvent.click(screen.getByRole("button", { name: /pause background animation/i }));
    expect(scene.getAttribute("data-paused")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: /play background animation/i }));
    expect(scene.getAttribute("data-paused")).toBe("false");
  });

  it("shows a still frame with no animation controls for reduced-motion users", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: (query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
    renderLanding();
    expect(screen.getByTestId("landing-scene").getAttribute("data-motion")).toBe("reduced");
    expect(screen.queryByRole("button", { name: /background animation/i })).toBeNull();
  });
});
