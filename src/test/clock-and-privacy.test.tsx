import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { formatEpochToIst, getAuthoritativeIstNow } from "@/lib/network-time";
import {
  buildLoginSessionActivityEntry,
  getUserLoginPrivacyHistory,
  parseLoginSessionFromActivity,
  recordUserLoginSession,
  recordUserPrivacyActivity,
} from "@/lib/privacy-tracker";
import { fromTables, toTables } from "@/lib/api/mapping";
import { LiveIstClock } from "@/components/live-ist-clock";
import { LoginPrivacyPanel } from "@/components/login-privacy-panel";
import { StoreProvider } from "@/lib/store";
import { seedData } from "@/lib/seed";

describe("Authoritative IST 24-Hour Clock & Login Privacy Tracker", () => {
  it("formats UTC epoch into exact IST (UTC+05:30) Day, Date, and 24-hour Time with seconds", () => {
    // 2026-10-27T14:05:09Z UTC -> 2026-10-27T19:35:09+05:30 IST (Tuesday)
    const utcEpoch = Date.UTC(2026, 9, 27, 14, 5, 9);
    const snap = formatEpochToIst(utcEpoch);

    expect(snap.weekdayFull).toBe("Tuesday");
    expect(snap.weekdayShort).toBe("Tue");
    expect(snap.dateLabel).toBe("27 Oct 2026");
    expect(snap.time24).toBe("19:35:09");
    expect(snap.fullDisplay).toContain("27 Oct 2026 · 19:35:09 IST");
  });

  it("renders LiveIstClock with Day, Date, and 24-hour time with seconds in IST", () => {
    render(<LiveIstClock />);
    const clock = screen.getByTestId("live-ist-clock");
    expect(clock).toBeTruthy();

    const timeEl = screen.getByTestId("live-ist-time-24h");
    expect(timeEl.textContent).toMatch(/^\d{2}:\d{2}:\d{2}$/);

    const nowSnap = getAuthoritativeIstNow();
    expect(screen.getByTestId("live-ist-date").textContent).toBe(nowSnap.dateLabel);
  });

  it("tracks student login sessions, IP address, location, IST time, and syncs with database activity_feed table", () => {
    const baseData = seedData();
    const student = baseData.users.find((u) => u.id === "u-ana")!;
    const session = recordUserLoginSession(student, "Portal Password Sign-In", true);

    expect(session.userId).toBe("u-ana");
    expect(session.loginAtIst).toContain("IST");
    expect(session.ipAddress).toBeTruthy();
    expect(session.location).toBeTruthy();

    // Verify round-trip serialization through database `activity_feed` table mapping
    const dbEntry = buildLoginSessionActivityEntry(session);
    const appDataWithLogin = {
      ...baseData,
      activity: [dbEntry, ...baseData.activity],
    };
    const tables = toTables(appDataWithLogin, "tenant-demo");
    expect(tables.activity_feed.some((r) => r.id === dbEntry.id)).toBe(true);

    const restoredData = fromTables(tables);
    const restoredSession = parseLoginSessionFromActivity(restoredData.activity[0]);
    expect(restoredSession).not.toBeNull();
    expect(restoredSession?.id).toBe(session.id);
    expect(restoredSession?.ipAddress).toBe(session.ipAddress);

    recordUserPrivacyActivity(
      student,
      "weather_attached",
      "Attached METAR briefing for VIDP sortie",
      "flight",
    );

    const history = getUserLoginPrivacyHistory(student, restoredData.activity);
    expect(history.isSyncedWithDatabase).toBe(true);
    expect(history.currentSession.activities.length).toBeGreaterThanOrEqual(2);
    expect(history.currentSession.activities[0].action).toContain(
      "Attached Official METAR/TAF Weather Briefing",
    );
    expect(history.lastPreviousLogin).not.toBeNull();
  });

  it("renders LoginPrivacyPanel showing Last Login Time, Location, IP Address, and Activity Performed", () => {
    const student = seedData().users.find((u) => u.id === "u-ana")!;
    render(
      <StoreProvider>
        <LoginPrivacyPanel person={student} />
      </StoreProvider>,
    );

    expect(screen.getByTestId("login-privacy-panel")).toBeTruthy();
    expect(screen.getByTestId("privacy-db-sync-badge")).toBeTruthy();
    expect(screen.getByTestId("privacy-last-login-card").textContent).toContain("IST");
    expect(screen.getByTestId("privacy-location-card").textContent).toContain("Login Location");
    expect(screen.getByTestId("privacy-ip-card").textContent).toContain("Verified");
    expect(screen.getByTestId("privacy-activity-list")).toBeTruthy();
  });
});
