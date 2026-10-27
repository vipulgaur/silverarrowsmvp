import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { WeatherWidget } from "@/components/weather-widget";
import { StoreProvider } from "@/lib/store";
import type { Booking, Flight } from "@/lib/types";
import {
  AERODROME_CATALOGUE,
  buildFallback10DayTimeline,
  buildFallbackWeather,
  buildMetarAndTaf,
  buildRegional100KmRing,
  computeAeronauticalMetrics,
  computeFlightCategory,
  computeRunwayWindComponents,
  enrichBookingWithWeather,
  evaluateFlyabilityCondition,
  extractFlightWeather,
  fetchCitySuggestions,
  formatIndianDateShort,
  formatRemarksWithWeather,
  parseCommaCoordinates,
  resolveAerodrome,
  resolveCoordinatesToStation,
} from "@/lib/weather";

describe("Aerodrome Weather Board — Browser Coords, Good-to-Fly Box, Comma Coords, Auto 3D Sky & City Suggestions", () => {
  it("constructs ICAO METAR/TAF, Aeronautical Metrics, and evaluates Condition: Good to Fly", () => {
    const station = AERODROME_CATALOGUE.VAJB!;
    const wx = buildMetarAndTaf({
      icao: "VAJB",
      stationName: "Jabalpur Dumna Airport (Jabalpur)",
      city: "Jabalpur",
      lat: station.lat,
      lon: station.lon,
      windDir: 60,
      windSpeedKt: 10,
      visibilityMeters: 9999,
      cloudCoverPct: 20,
      tempC: 27,
      dewpointC: 15,
      qnhHpa: 1013,
      wmoCode: 0,
      now: new Date("2026-10-27T09:15:00Z"),
    });

    expect(wx.icao).toBe("VAJB");
    expect(wx.flightCategory).toBe("VFR");

    const aero = computeAeronauticalMetrics(wx, station);
    const flyability = evaluateFlyabilityCondition(wx, aero);
    expect(flyability.verdict).toBe("GOOD TO FLY");
    expect(flyability.summary).toContain("Condition: Good to Fly");
  });

  it("parses single comma-separated coordinates and returns autocomplete suggestions for 'jabal' -> 'Jabalpur, MP, India'", async () => {
    const parsed = parseCommaCoordinates("23.1815, 79.9864");
    expect(parsed).toEqual({ lat: 23.1815, lon: 79.9864 });
    expect(parseCommaCoordinates("invalid")).toBeNull();

    const suggestions = await fetchCitySuggestions("jabal");
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0]?.displayLabel).toBe("Jabalpur, MP, India");
    expect(suggestions[0]?.icao).toBe("VAJB");
  });

  it("generates Past 2 Days + Today + Next 7 Days (10-Day timeline) and 100km Area Ring", () => {
    const station = resolveAerodrome("VABB");
    const current = buildFallbackWeather("VABB", new Date("2026-10-27T10:00:00Z"));
    const timeline = buildFallback10DayTimeline(
      station,
      current,
      new Date("2026-10-27T10:00:00Z"),
    );

    expect(timeline.length).toBe(10);
    expect(timeline[0]?.offsetDays).toBe(-2);
    expect(timeline[2]?.isToday).toBe(true);
    expect(timeline[9]?.offsetDays).toBe(7);
    expect(timeline[2]?.indianDate).toBe(formatIndianDateShort("2026-10-27"));

    const ring100km = buildRegional100KmRing(station, current);
    expect(ring100km.length).toBe(5);
    expect(ring100km[1]?.distanceKm).toBe(100);
  });

  it("resolves manual city names and coordinates", () => {
    const jabalpur = resolveAerodrome("Jabalpur");
    expect(jabalpur.icao).toBe("VAJB");
    expect(jabalpur.city).toBe("Jabalpur");

    const customCoord = resolveCoordinatesToStation(23.1815, 79.9864, "Jabalpur");
    expect(customCoord.lat).toBeCloseTo(23.1815, 3);
    expect(customCoord.lon).toBeCloseTo(79.9864, 3);

    expect(computeFlightCategory(9999, undefined)).toBe("VFR");
    const rwy = computeRunwayWindComponents(280, 20, 280);
    expect(rwy.headwindKt).toBe(20);
  });

  it("automatically records weatherCurrent, weatherForecast, and weatherCompleted on Bookings and persists Flight weather", () => {
    const newBooking: Booking = {
      id: "BK-TEST1",
      aircraftId: "a-1",
      studentId: "u-arp",
      instructorId: "u-ins-1",
      type: "lesson",
      status: "scheduled",
      start: "2026-10-30T09:00:00.000Z",
      end: "2026-10-30T11:00:00.000Z",
      route: "VAJB → VAJB",
    };

    const scheduledWithWx = enrichBookingWithWeather(newBooking);
    expect(scheduledWithWx.weatherCurrent?.icao).toBe("VAJB");
    expect(scheduledWithWx.weatherForecast?.icao).toBe("VAJB");

    const completedWithWx = enrichBookingWithWeather(
      { ...scheduledWithWx, status: "completed" },
      scheduledWithWx,
    );
    expect(completedWithWx.weatherCompleted?.icao).toBe("VAJB");

    const remarks = formatRemarksWithWeather("Circuit sortie.", completedWithWx.weatherCompleted!);
    const flight: Flight = {
      id: "FL-WX1",
      date: "2026-10-30",
      aircraftId: "a-1",
      pilotId: "u-arp",
      minutes: 60,
      landings: 3,
      fromIcao: "VAJB",
      toIcao: "VAJB",
      remarks,
    };
    const extracted = extractFlightWeather(flight);
    expect(extracted?.metar).toContain("METAR VAJB");
  });

  it("renders WeatherWidget with Condition box, hover city names on VIDP/VABB/VOBL, single comma coordinate input, and city suggestions for 'jabal'", async () => {
    let attachedWx: unknown = null;
    render(
      <StoreProvider>
        <WeatherWidget
          defaultIcao="VIDP"
          onAttachWeather={(wx) => {
            attachedWx = wx;
          }}
        />
      </StoreProvider>,
    );

    expect(
      screen.getByText(/Aerodrome Weather Briefing \(METAR \/ TAF\)/i),
    ).toBeDefined();
    expect(screen.getByText(/Condition:/i)).toBeDefined();

    const vidpBtn = screen.getByTitle(/VIDP — New Delhi/i);
    const vabbBtn = screen.getByTitle(/VABB — Mumbai/i);
    const voblBtn = screen.getByTitle(/VOBL — Bengaluru/i);
    expect(vidpBtn).toBeDefined();
    expect(vabbBtn).toBeDefined();
    expect(voblBtn).toBeDefined();

    const coordInput = screen.getByLabelText(/Comma-separated coordinates/i);
    expect(coordInput).toBeDefined();

    const searchInput = screen.getByLabelText(/Enter city or ICAO code/i);
    fireEvent.focus(searchInput);
    fireEvent.change(searchInput, { target: { value: "jabal" } });

    await waitFor(() => {
      expect(screen.getByText(/Jabalpur, MP, India/i)).toBeDefined();
    });

    const attachBtn = screen.getByRole("button", {
      name: /Attach to Current Flight Form/i,
    });
    fireEvent.click(attachBtn);
    expect(attachedWx).not.toBeNull();
  });
});
