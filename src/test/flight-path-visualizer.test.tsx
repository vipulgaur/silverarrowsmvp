import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  calculateGreatCircleLeg,
  createCustomGpsWaypoint,
  FlightPathVisualizer,
  synthesizeWaypointWeather,
} from "@/components/flight-path-visualizer";
import { StoreProvider } from "@/lib/store";

describe("D3.js Flight Path Visualizer & Waypoint Weather Overlay", () => {
  it("calculates accurate great-circle distance (NM/km) and true bearing between aerodromes", () => {
    // VIDP (28.5562, 77.1000) -> VIJP (26.8242, 75.8122)
    const leg = calculateGreatCircleLeg(28.5562, 77.1, 26.8242, 75.8122);
    expect(leg.distanceNm).toBeGreaterThan(115);
    expect(leg.distanceNm).toBeLessThan(135);
    expect(leg.bearingTrueDeg).toBeGreaterThan(200);
    expect(leg.bearingTrueDeg).toBeLessThan(230);
  });

  it("synthesizes aeronautical weather overlay and METAR for custom GPS waypoints", () => {
    const wpt = createCustomGpsWaypoint(23.1778, 80.052, 3, "WPT4");
    expect(wpt.code).toBe("WPT4");
    expect(wpt.weather.metar).toContain("METAR WPT4");
    expect(["VFR", "MVFR", "IFR", "LIFR"]).toContain(wpt.weather.flightCategory);

    const wx = synthesizeWaypointWeather("VAJB", "Jabalpur", 23.1778, 80.052);
    expect(wx.qnhHpa).toBeGreaterThanOrEqual(1000);
    expect(wx.windSpeedKt).toBeGreaterThan(0);
  });

  it("renders D3 geospatial flight map, vertical profile SVG, waypoint weather overlays, and plots new GPS coordinates", () => {
    render(
      <StoreProvider>
        <FlightPathVisualizer initialRouteCodes={["VIDP", "VIJP", "VAJB"]} />
      </StoreProvider>,
    );

    expect(screen.getByTestId("d3-flight-path-visualizer")).toBeTruthy();
    expect(screen.getByTestId("d3-flight-map-svg")).toBeTruthy();
    expect(screen.getByTestId("d3-vertical-profile-svg")).toBeTruthy();
    expect(screen.getByTestId("d3-route-string").textContent).toBe("VIDP → VIJP → VAJB");

    // Verify selected waypoint weather inspector is rendered
    const wxPanel = screen.getByTestId("d3-selected-waypoint-weather");
    expect(wxPanel.textContent).toContain("VIDP");
    expect(wxPanel.textContent).toContain("METAR VIDP");

    // Plot a custom GPS coordinate waypoint onto the route
    const coordInput = screen.getByTestId("d3-custom-coord-input");
    fireEvent.change(coordInput, { target: { value: "23.2875, 77.3374" } });
    fireEvent.click(screen.getByTestId("d3-add-coord-btn"));

    expect(screen.getByTestId("d3-route-string").textContent).toContain("VIDP → VIJP → VAJB → WPT4");
  });
});
