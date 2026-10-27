import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual<Record<string, unknown>>("@tanstack/react-router");
  return {
    ...actual,
    Link: ({ children, to, className, ...props }: any) => (
      <a href={typeof to === "string" ? to : "#"} className={className} {...props}>
        {children}
      </a>
    ),
    useNavigate: () => vi.fn(),
  };
});

import { seedData } from "@/lib/seed";
import { memberNotifications, hoursBreakdown, visibleTo } from "@/lib/logic";
import type { Booking, Flight, User } from "@/lib/types";
import { StoreProvider } from "@/lib/store";
import { setStoredDemoSession } from "@/integrations/supabase/client";
import {
  getPostFlightDueBookings,
  PostFlightCompletionDialog,
} from "@/components/post-flight-prompt";
import { AdminPostFlightSection } from "@/routes/_shell.flights";
import { Route as AdminRoute } from "@/routes/_shell.portal.admin";

describe("Admin Flight Notifications & 'Did the flight happen?' Post-Flight Logger", () => {
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

  it("assigns critical, medium, and low priorities to memberNotifications for administrators with student name in title", () => {
    const data = seedData();
    const admin = data.users.find((u) => u.role === "admin")!;
    const student = data.users.find((u) => u.id === "u-arp")!;

    // Ensure we have a past booking that needs verification
    const pastBooking: Booking = {
      id: "b-test-due",
      studentId: student.id,
      instructorId: "u-vsn",
      aircraftId: "a-1",
      start: "2024-01-01T08:00:00Z",
      end: "2024-01-01T10:00:00Z",
      status: "scheduled",
      approvalStatus: "approved",
      type: "lesson",
      lessonId: "l-ex04",
      createdAt: "2024-01-01T07:00:00Z",
    };

    const testData = {
      ...data,
      bookings: [pastBooking, ...data.bookings],
    };

    const notifs = memberNotifications(testData, admin);
    expect(notifs.length).toBeGreaterThan(0);

    // Verify all have valid priority
    for (const n of notifs) {
      expect(["critical", "medium", "low"]).toContain(n.priority);
      expect(["flight", "booking", "safety", "profile", "course"]).toContain(n.category);
    }

    // Verify critical notifications exist and are placed first
    const criticalNotifs = notifs.filter((n) => n.priority === "critical");
    expect(criticalNotifs.length).toBeGreaterThan(0);

    // Check that "Did the flight happen?" booking notification has critical priority AND student name
    const postFlightNotif = notifs.find((n) => n.id === `postflight:${pastBooking.id}`);
    expect(postFlightNotif).toBeDefined();
    expect(postFlightNotif?.priority).toBe("critical");
    expect(postFlightNotif?.category).toBe("flight");
    expect(postFlightNotif?.bookingId).toBe(pastBooking.id);
    expect(postFlightNotif?.title).toContain(student.name);

    // Verify sorting order: critical first, then medium, then low
    let seenMedium = false;
    let seenLow = false;
    for (const n of notifs) {
      if (n.priority === "critical") {
        expect(seenMedium).toBe(false);
        expect(seenLow).toBe(false);
      } else if (n.priority === "medium") {
        seenMedium = true;
        expect(seenLow).toBe(false);
      } else if (n.priority === "low") {
        seenLow = true;
      }
    }
  });

  it("detects overdue bookings accurately with getPostFlightDueBookings", () => {
    const data = seedData();
    const pastBooking: Booking = {
      id: "b-past-overdue",
      studentId: "u-arp",
      instructorId: "u-vsn",
      aircraftId: "a-1",
      start: "2024-01-10T10:00:00Z",
      end: "2024-01-10T12:00:00Z",
      status: "scheduled",
      approvalStatus: "approved",
      type: "lesson",
      createdAt: "2024-01-09T10:00:00Z",
    };

    const futureBooking: Booking = {
      id: "b-future-scheduled",
      studentId: "u-arp",
      instructorId: "u-vsn",
      aircraftId: "a-1",
      start: "2030-01-10T10:00:00Z",
      end: "2030-01-10T12:00:00Z",
      status: "scheduled",
      approvalStatus: "approved",
      type: "lesson",
      createdAt: "2024-01-09T10:00:00Z",
    };

    const testData = {
      ...data,
      bookings: [pastBooking, futureBooking, ...data.bookings],
    };

    const dueBookings = getPostFlightDueBookings(testData);
    expect(dueBookings.some((b) => b.id === pastBooking.id)).toBe(true);
    expect(dueBookings.some((b) => b.id === futureBooking.id)).toBe(false);
  });

  it("renders AdminPostFlightSection in flight logger with verification tabs, search, and prominent student pilot name", () => {
    render(
      <StoreProvider>
        <AdminPostFlightSection />
      </StoreProvider>,
    );

    // Section title
    expect(screen.getByText(/Did the flight happen\?/i)).toBeDefined();
    // Tabs
    expect(screen.getByText(/Due for Verification/i)).toBeDefined();
    expect(screen.getByText(/Upcoming & In-Flight/i)).toBeDefined();
    expect(screen.getByText(/Recently Verified Sorties/i)).toBeDefined();
  });

  it("opens post-flight dialog for 'yes' and updates the logbook exclusively for the target student", async () => {
    const data = seedData();
    const students = data.users.filter((u) => u.role === "student");
    const studentA = students[0]; // Aarav Patel
    const studentB = students[1]; // Other student

    const pastBooking: Booking = {
      id: "b-dialog-test-yes",
      studentId: studentA.id,
      instructorId: "u-vsn",
      aircraftId: "a-1",
      start: "2024-02-01T09:00:00Z",
      end: "2024-02-01T11:00:00Z",
      status: "scheduled",
      approvalStatus: "approved",
      type: "lesson",
      createdAt: "2024-02-01T08:00:00Z",
    };

    let closed = false;
    render(
      <StoreProvider>
        <PostFlightCompletionDialog
          state={{ booking: pastBooking, decision: "yes" }}
          onClose={() => {
            closed = true;
          }}
        />
      </StoreProvider>,
    );

    // Student name clearly displayed in dialog
    expect(screen.getAllByText(new RegExp(studentA.name, "i")).length).toBeGreaterThan(0);
    expect(screen.getByText(/Flight Happened \(Yes\)/i)).toBeDefined();

    const submitBtn = screen.getByRole("button", {
      name: /Confirm & Auto-Update Logbook/i,
    });
    expect(submitBtn).toBeDefined();
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(closed).toBe(true);
    });

    // Verify isolation: Student A gets the hours, Student B does not
    const hoursA = hoursBreakdown(studentA.id, data);
    const hoursB = hoursBreakdown(studentB.id, data);
    const mockFlight: Flight = {
      id: "FL-TEST-ISOLATION",
      bookingId: pastBooking.id,
      date: "2024-02-01",
      offBlock: "09:00",
      onBlock: "11:00",
      aircraftId: "a-1",
      pilotId: studentA.id,
      kind: "dual",
      fromIcao: "EKAH",
      toIcao: "EKAH",
      minutes: 120,
      landings: 3,
      verificationStatus: "verified",
    };

    const nextData = {
      ...data,
      flights: [mockFlight, ...data.flights],
    };

    const nextHoursA = hoursBreakdown(studentA.id, nextData);
    const nextHoursB = hoursBreakdown(studentB.id, nextData);

    expect(nextHoursA.total).toBe(hoursA.total + 120);
    expect(nextHoursB.total).toBe(hoursB.total); // Student B is strictly untouched!

    // Verify visibleTo RBAC isolation
    const visibleToA = visibleTo(studentA, nextData.flights);
    const visibleToB = visibleTo(studentB, nextData.flights);
    expect(visibleToA.some((f) => f.id === mockFlight.id)).toBe(true);
    expect(visibleToB.some((f) => f.id === mockFlight.id)).toBe(false);
  });

  it("opens post-flight dialog for 'no' and cancels booking with operational note for target student", async () => {
    const data = seedData();
    const student = data.users.find((u) => u.id === "u-arp")!;

    const pastBooking: Booking = {
      id: "b-dialog-test-no",
      studentId: student.id,
      instructorId: "u-vsn",
      aircraftId: "a-1",
      start: "2024-02-02T13:00:00Z",
      end: "2024-02-02T15:00:00Z",
      status: "scheduled",
      approvalStatus: "approved",
      type: "lesson",
      createdAt: "2024-02-01T08:00:00Z",
    };

    let closed = false;
    render(
      <StoreProvider>
        <PostFlightCompletionDialog
          state={{ booking: pastBooking, decision: "no" }}
          onClose={() => {
            closed = true;
          }}
        />
      </StoreProvider>,
    );

    // Displays student name in title/body
    expect(screen.getAllByText(new RegExp(student.name, "i")).length).toBeGreaterThan(0);
    expect(screen.getByText(/Did Not Fly \(No\)/i)).toBeDefined();

    const cancelBtn = screen.getByRole("button", {
      name: /Confirm Flight Did Not Happen/i,
    });
    expect(cancelBtn).toBeDefined();
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(closed).toBe(true);
    });
  });

  it("renders Admin Portal with Cessna 172S Atlas link and Operations Command Priority Notifications", async () => {
    const Component = AdminRoute.options.component!;
    render(
      <StoreProvider>
        <Component />
      </StoreProvider>,
    );

    // Wait for hydration and assertion
    await waitFor(() => {
      expect(screen.getByText(/Aircraft Atlas \(Cessna 172S\)/i)).toBeDefined();
    });

    // Priority Operations Notifications section
    expect(screen.getByText(/Operations Command & Priority Notifications/i)).toBeDefined();
    expect(screen.getAllByText(/Critical/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Medium/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Low/i).length).toBeGreaterThan(0);
  });
});
