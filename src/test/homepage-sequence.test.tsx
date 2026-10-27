import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  computeBoundaryState,
  HomepageAviationSequence,
  SEQUENCE_TIMING,
} from "@/components/homepage-aviation-sequence";

describe("Homepage Contained Vector Aviation Sequence", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("computes smooth left-to-right takeoff trajectory and boundary logo handoff", () => {
    const start = computeBoundaryState(0.3, "playing");
    expect(start.aircraftXPercent).toBeGreaterThanOrEqual(9);
    expect(start.aircraftXPercent).toBeLessThan(35);
    expect(start.handoffProgress).toBe(0);
    expect(start.silhouetteOpacity).toBe(0);
    expect(start.emblemBridgeOpacity).toBe(0);

    const midClimb = computeBoundaryState(2.0, "playing");
    expect(midClimb.aircraftXPercent).toBeGreaterThan(start.aircraftXPercent);
    expect(midClimb.altitudeFt).toBeGreaterThan(0);
    expect(midClimb.handoffProgress).toBe(0);

    // Boundary moment: aircraft exits right edge of circle and follows trail (2.75s - 4.10s)
    const silhouetteMoment = computeBoundaryState(3.15, "handoff");
    expect(silhouetteMoment.aircraftXPercent).toBeGreaterThan(75);
    expect(silhouetteMoment.silhouetteOpacity).toBeGreaterThan(0.5);
    expect(silhouetteMoment.boundaryMergeOpacity).toBeGreaterThan(0.4);

    const emblemMoment = computeBoundaryState(3.6, "handoff");
    expect(emblemMoment.emblemBridgeOpacity).toBeGreaterThan(0.7);
    expect(emblemMoment.bridgeOffsetPx).toBeGreaterThan(30);
    expect(emblemMoment.bridgeOffsetPx).toBeLessThanOrEqual(96);

    // Strike & settled state: logo hits the Silver Arrow's box and illuminates it
    const settled = computeBoundaryState(SEQUENCE_TIMING.handoffResolve, "settled");
    expect(settled.silhouetteOpacity).toBe(0);
    expect(settled.emblemBridgeOpacity).toBe(0);
    expect(settled.boundaryMergeOpacity).toBe(0);
    expect(settled.settledBadgeHighlight).toBe(1);
  });

  it("allows skipping the live animation immediately and replaying after completion", async () => {
    render(<HomepageAviationSequence />);

    const skipBtn = await screen.findByRole("button", {
      name: /skip takeoff sequence/i,
    });
    fireEvent.click(skipBtn);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /replay takeoff sequence/i }),
      ).toBeTruthy();
    });

    // Once settled (right side loaded), the takeoff trail is removed and the interactive aircraft controller is active
    const trailGroup = screen.getByTestId("takeoff-track-trail-group");
    const controllerGroup = screen.getByTestId("interactive-aircraft-controller");
    expect(trailGroup.style.opacity).toBe("0");
    expect(controllerGroup.style.opacity).toBe("1");
  });

  it("respects reduced-motion preferences without running takeoff or morph animations", () => {
    const originalMatchMedia = window.matchMedia;
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

    try {
      render(<HomepageAviationSequence />);

      const container = screen.getByTestId("homepage-aviation-sequence");
      expect(container.getAttribute("data-sequence-phase")).toBe("reduced-motion");
      expect(
        screen.getByRole("button", { name: /replay takeoff sequence/i }),
      ).toBeTruthy();
    } finally {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        configurable: true,
        value: originalMatchMedia,
      });
    }
  });
});
