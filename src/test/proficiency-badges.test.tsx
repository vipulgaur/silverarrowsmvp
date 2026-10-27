import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProficiencyBadges } from "@/components/proficiency-badges";
import { pilotProficiencyBadges } from "@/lib/logic";
import { StoreProvider } from "@/lib/store";
import { seedData } from "@/lib/seed";
import { setStoredDemoSession } from "@/integrations/supabase/client";
import type { AppData, Flight } from "@/lib/types";

describe("Proficiency Badges & Gamification System", () => {
  beforeEach(() => {
    window.localStorage.clear();
    const data = seedData();
    const student = data.users.find((u) => u.role === "student")!;
    setStoredDemoSession({
      user: {
        id: student.id,
        email: student.email,
        user_metadata: { role: student.role },
      },
    });
  });

  it("evaluates Night Flying, Instrument Rating, Solo Command, and other badges based on logged flight hours", () => {
    const baseData = seedData();
    const student = baseData.users.find((u) => u.role === "student")!;

    // Start with zero flights for this student to verify locked state
    const emptyData: AppData = {
      ...baseData,
      flights: [],
    };

    const initialSummary = pilotProficiencyBadges(student.id, emptyData);
    expect(initialSummary.unlockedCount).toBe(0);
    expect(initialSummary.rankTitle).toBe("Cadet Aviator");
    const nightLocked = initialSummary.badges.find((b) => b.id === "night_flying")!;
    const ifrLocked = initialSummary.badges.find((b) => b.id === "instrument_rating")!;
    expect(nightLocked.unlocked).toBe(false);
    expect(nightLocked.tier).toBe("locked");
    expect(ifrLocked.unlocked).toBe(false);

    // Log flights that meet Night Flying (Gold: >= 5h) and Instrument Rating (Silver: >= 5h)
    const testFlights: Flight[] = [
      {
        id: "fl-gamify-1",
        date: "2026-10-10",
        offBlock: "19:00",
        onBlock: "22:30",
        aircraftId: baseData.aircraft[0]!.id,
        pilotId: student.id,
        kind: "solo",
        fromIcao: "EKAH",
        toIcao: "EKRK",
        minutes: 210, // 3.5h
        dayMinutes: 0,
        nightMinutes: 210, // 3.5h night
        xcMinutes: 210, // 3.5h XC
        ifrMinutes: 120, // 2.0h IFR
        landings: 6,
        nightLandings: 6,
        verificationStatus: "verified",
      },
      {
        id: "fl-gamify-2",
        date: "2026-10-15",
        offBlock: "20:00",
        onBlock: "23:30",
        aircraftId: baseData.aircraft[0]!.id,
        pilotId: student.id,
        kind: "dual",
        fromIcao: "EKRK",
        toIcao: "EKAH",
        minutes: 210, // 3.5h
        dayMinutes: 30,
        nightMinutes: 180, // +3.0h night => 6.5h total night (Gold >= 5h)
        xcMinutes: 180, // +3.0h XC => 6.5h total XC (Silver >= 5h)
        ifrMinutes: 210, // +3.5h IFR => 5.5h total IFR (Silver >= 5h)
        landings: 8,
        nightLandings: 5,
        verificationStatus: "verified",
      },
    ];

    const populatedData: AppData = {
      ...baseData,
      flights: testFlights,
    };

    const afterSummary = pilotProficiencyBadges(student.id, populatedData);
    const nightBadge = afterSummary.badges.find((b) => b.id === "night_flying")!;
    const ifrBadge = afterSummary.badges.find((b) => b.id === "instrument_rating")!;
    const soloBadge = afterSummary.badges.find((b) => b.id === "first_solo")!;
    const xcBadge = afterSummary.badges.find((b) => b.id === "cross_country")!;
    const landingBadge = afterSummary.badges.find((b) => b.id === "precision_landings")!;

    expect(nightBadge.unlocked).toBe(true);
    expect(nightBadge.tier).toBe("gold");
    expect(nightBadge.currentValue).toBe(6.5);

    expect(ifrBadge.unlocked).toBe(true);
    expect(ifrBadge.tier).toBe("silver");
    expect(ifrBadge.currentValue).toBe(5.5);

    expect(soloBadge.unlocked).toBe(true);
    expect(soloBadge.tier).toBe("bronze");
    expect(soloBadge.currentValue).toBe(3.5);

    expect(xcBadge.unlocked).toBe(true);
    expect(xcBadge.tier).toBe("silver");

    expect(landingBadge.unlocked).toBe(true);
    expect(landingBadge.tier).toBe("bronze");
    expect(afterSummary.unlockedCount).toBeGreaterThanOrEqual(5);
    expect(afterSummary.totalPoints).toBeGreaterThan(0);
  });

  it("renders the ProficiencyBadges component in user profile and filters badges", () => {
    const data = seedData();
    const student = data.users.find((u) => u.role === "student")!;

    render(
      <StoreProvider>
        <ProficiencyBadges person={student} />
      </StoreProvider>,
    );

    expect(screen.getByTestId("proficiency-badges-section")).toBeDefined();
    expect(screen.getByTestId("proficiency-badge-night_flying")).toBeDefined();
    expect(screen.getByTestId("proficiency-badge-instrument_rating")).toBeDefined();
    expect(screen.getByTestId("proficiency-badge-first_solo")).toBeDefined();
    expect(screen.getByTestId("proficiency-badge-cross_country")).toBeDefined();

    // Filter to Unlocked only
    const unlockedFilterBtn = screen.getByRole("button", { name: /Unlocked \(/i });
    fireEvent.click(unlockedFilterBtn);

    // Filter back to All
    const allFilterBtn = screen.getByRole("button", { name: /All \(/i });
    fireEvent.click(allFilterBtn);
    expect(screen.getByTestId("proficiency-badge-night_flying")).toBeDefined();
  });
});
