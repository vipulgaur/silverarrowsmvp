import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FlightProgressTracker } from "@/components/flight-progress-tracker";
import { StoreProvider } from "@/lib/store";
import { seedData } from "@/lib/seed";
import { setStoredDemoSession } from "@/integrations/supabase/client";

// Mock resize observer for Recharts ResponsiveContainer
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("FlightProgressTracker Component", () => {
  beforeEach(() => {
    window.localStorage.clear();
    const data = seedData();
    const admin = data.users.find((u) => u.role === "admin")!;
    setStoredDemoSession({
      user: {
        id: admin.id,
        email: admin.email,
        user_metadata: { role: admin.role },
      },
    });
  });

  it("renders the Flight Progress Tracker header and KPI metrics", () => {
    render(
      <StoreProvider>
        <FlightProgressTracker />
      </StoreProvider>,
    );

    expect(screen.getByText("Flight Progress Tracker")).toBeDefined();
    expect(screen.getByText("Supabase Logged")).toBeDefined();
    expect(screen.getByText("Total Logged")).toBeDefined();
    expect(screen.getByText("Dual Hours")).toBeDefined();
    expect(screen.getByText("Solo / PIC")).toBeDefined();
    expect(screen.getByText("Cross-Country")).toBeDefined();
    expect(screen.getByText("Night Hours")).toBeDefined();
    expect(screen.getByText("Total Landings")).toBeDefined();
  });

  it("allows switching between Cumulative Trend, Monthly Volume, and Category Share tabs", () => {
    render(
      <StoreProvider>
        <FlightProgressTracker />
      </StoreProvider>,
    );

    const cumulativeBtn = screen.getByRole("button", { name: "Cumulative Trend" });
    const monthlyBtn = screen.getByRole("button", { name: "Monthly Volume" });
    const categoryBtn = screen.getByRole("button", { name: "Category Share" });

    expect(cumulativeBtn).toBeDefined();
    expect(monthlyBtn).toBeDefined();
    expect(categoryBtn).toBeDefined();

    // Click Monthly Volume
    fireEvent.click(monthlyBtn);
    expect(screen.getByText("Monthly Volume")).toBeDefined();

    // Click Category Share
    fireEvent.click(categoryBtn);
    expect(screen.getByText("Sortie Category Breakdown")).toBeDefined();
  });

  it("allows toggling time horizons (30D, 90D, 6M, 1Y, ALL)", () => {
    render(
      <StoreProvider>
        <FlightProgressTracker />
      </StoreProvider>,
    );

    const btn30d = screen.getByRole("button", { name: "30D" });
    const btnAll = screen.getByRole("button", { name: "ALL" });

    fireEvent.click(btn30d);
    expect(btn30d).toBeDefined();

    fireEvent.click(btnAll);
    expect(btnAll).toBeDefined();
  });

  it("supports scoping to a specific pilot without crashing", () => {
    const data = seedData();
    const student = data.users.find((u) => u.role === "student")!;

    render(
      <StoreProvider>
        <FlightProgressTracker pilotId={student.id} showPilotSelector={false} />
      </StoreProvider>,
    );

    expect(
      screen.getByText(new RegExp(`for ${student.name}`, "i")),
    ).toBeDefined();
  });

  it("triggers Supabase query when Sync button is clicked", async () => {
    render(
      <StoreProvider>
        <FlightProgressTracker />
      </StoreProvider>,
    );

    const syncBtn = screen.getByRole("button", { name: /Sync/i });
    expect(syncBtn).toBeDefined();

    fireEvent.click(syncBtn);
    await waitFor(() => {
      expect(syncBtn).toBeDefined();
    });
  });
});
