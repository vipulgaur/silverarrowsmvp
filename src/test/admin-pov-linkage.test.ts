import { describe, expect, it } from "vitest";
import { seedData } from "@/lib/seed";
import {
  bookingProblem,
  canAccess,
  homeFor,
  reviewBooking,
  reviewProfileRequest,
  reviewRequest,
  softDeleteUser,
  restoreUser,
  theoryProgress,
  uid,
} from "@/lib/logic";
import { toTables, fromTables, TABLE_ORDER } from "@/lib/api/mapping";
import type {
  AppData,
  Booking,
  Flight,
  MaintenanceItem,
  ProfileChangeRequest,
  RescheduleRequest,
  User,
} from "@/lib/types";

describe("Admin POV & Comprehensive Database Linkage Verification", () => {
  it("verifies all foreign keys across all relational tables in the database", () => {
    const data = seedData();
    const userIds = new Set(data.users.map((u) => u.id));
    const aircraftIds = new Set(data.aircraft.map((a) => a.id));
    const programIds = new Set(data.programs.map((p) => p.id));
    const lessonIds = new Set(data.programs.flatMap((p) => p.lessons.map((l) => l.id)));
    const subjectIds = new Set(data.subjects.map((s) => s.id));
    const classroomIds = new Set(data.classrooms.map((c) => c.id));
    const bookingIds = new Set(data.bookings.map((b) => b.id));
    const flightIds = new Set(data.flights.map((f) => f.id));

    // Maintenance FKs
    for (const m of data.maintenance) {
      expect(aircraftIds.has(m.aircraftId)).toBe(true);
    }

    // Booking FKs
    for (const b of data.bookings) {
      if (b.aircraftId) expect(aircraftIds.has(b.aircraftId)).toBe(true);
      if (b.studentId) expect(userIds.has(b.studentId)).toBe(true);
      if (b.instructorId) expect(userIds.has(b.instructorId)).toBe(true);
      if (b.lessonId) expect(lessonIds.has(b.lessonId)).toBe(true);
    }

    // Flight FKs
    for (const f of data.flights) {
      expect(aircraftIds.has(f.aircraftId)).toBe(true);
      expect(userIds.has(f.pilotId)).toBe(true);
      if (f.instructorId) expect(userIds.has(f.instructorId)).toBe(true);
      if (f.bookingId) expect(bookingIds.has(f.bookingId)).toBe(true);
      if (f.lessonId) expect(lessonIds.has(f.lessonId)).toBe(true);
    }

    // Lesson Completion FKs
    for (const c of data.completions) {
      expect(userIds.has(c.studentId)).toBe(true);
      expect(lessonIds.has(c.lessonId)).toBe(true);
      if (c.instructorId) expect(userIds.has(c.instructorId)).toBe(true);
      if (c.flightId) expect(flightIds.has(c.flightId)).toBe(true);
    }

    // Ground Lectures & Classrooms FKs
    for (const l of data.lectures) {
      expect(subjectIds.has(l.subjectId)).toBe(true);
      expect(classroomIds.has(l.roomId)).toBe(true);
      expect(userIds.has(l.instructorId)).toBe(true);
      for (const sId of l.enrolled) {
        expect(userIds.has(sId)).toBe(true);
      }
    }

    // Theory Exams FKs
    for (const e of data.exams) {
      expect(userIds.has(e.studentId)).toBe(true);
      expect(subjectIds.has(e.subjectId)).toBe(true);
      if (e.signedBy) expect(userIds.has(e.signedBy)).toBe(true);
    }

    // User FKs
    for (const u of data.users) {
      if (u.programId) expect(programIds.has(u.programId)).toBe(true);
      if (u.instructorId) expect(userIds.has(u.instructorId)).toBe(true);
    }
  });

  it("admin POV: reviews and approves pending student bookings", () => {
    const data = seedData();
    const admin = data.users.find((u) => u.role === "admin")!;
    const student = data.users.find((u) => u.role === "student")!;
    const aircraft = data.aircraft[0]!;

    // Create a pending booking submitted by student
    const pendingBooking: Booking = {
      id: `b-${uid()}`,
      aircraftId: aircraft.id,
      studentId: student.id,
      instructorId: student.instructorId,
      start: "2026-11-01T09:00:00Z",
      end: "2026-11-01T11:00:00Z",
      type: "dual",
      status: "scheduled",
      approvalStatus: "pending",
      requestedBy: student.id,
      requestedAt: "2026-10-27T08:00:00Z",
    };

    const dataWithPending: AppData = {
      ...data,
      bookings: [pendingBooking, ...data.bookings],
    };

    // Admin reviews and approves
    const reviewed = reviewBooking(
      dataWithPending,
      pendingBooking.id,
      admin,
      "approved",
      "Weather forecast looks clear",
    );

    expect(typeof reviewed).not.toBe("string");
    if (typeof reviewed !== "string") {
      expect(reviewed.approvalStatus).toBe("approved");
      expect(reviewed.reviewedBy).toBe(admin.id);
      expect(reviewed.decisionNotes).toBe("Weather forecast looks clear");
      expect(reviewed.status).toBe("scheduled");
    }

    // Admin reviews and declines
    const declined = reviewBooking(
      dataWithPending,
      pendingBooking.id,
      admin,
      "declined",
      "Crosswind exceeds student limit",
    );

    expect(typeof declined).not.toBe("string");
    if (typeof declined !== "string") {
      expect(declined.approvalStatus).toBe("declined");
      expect(declined.reviewedBy).toBe(admin.id);
      expect(declined.decisionNotes).toBe("Crosswind exceeds student limit");
      expect(declined.status).toBe("cancelled");
    }
  });

  it("admin POV: booking conflict detection prevents overlapping allocations", () => {
    const data = seedData();
    const aircraft = data.aircraft[0]!;
    const student = data.users.find((u) => u.role === "student")!;

    const existingBooking: Booking = {
      id: `b-exist-1`,
      aircraftId: aircraft.id,
      studentId: student.id,
      start: "2026-11-01T10:00:00Z",
      end: "2026-11-01T12:00:00Z",
      type: "solo",
      status: "scheduled",
      approvalStatus: "approved",
    };

    const dataset: AppData = { ...data, bookings: [existingBooking] };

    // New overlapping booking on same aircraft
    const overlappingOnAircraft: Booking = {
      id: `b-new-2`,
      aircraftId: aircraft.id,
      studentId: data.users.find((u) => u.role === "student" && u.id !== student.id)!.id,
      start: "2026-11-01T11:00:00Z",
      end: "2026-11-01T13:00:00Z",
      type: "solo",
      status: "scheduled",
      approvalStatus: "approved",
    };

    const problem = bookingProblem(overlappingOnAircraft, dataset);
    expect(problem).toBe("Aircraft is already booked at that time.");
  });

  it("admin POV: approves reschedule request and atomically updates booking schedule", () => {
    const data = seedData();
    const admin = data.users.find((u) => u.role === "admin")!;
    const student = data.users.find((u) => u.role === "student")!;
    const booking = data.bookings.find((b) => b.studentId === student.id && b.status === "scheduled")!;

    const rescheduleReq: RescheduleRequest = {
      id: `req-${uid()}`,
      bookingId: booking.id,
      studentId: student.id,
      instructorId: booking.instructorId ?? "u-pri",
      proposedStart: "2026-11-02T14:00:00Z",
      proposedEnd: "2026-11-02T16:00:00Z",
      reason: "weather",
      notes: "Thunderstorms forecast on original date",
      status: "pending",
      createdAt: "2026-10-27T08:00:00Z",
    };

    const dataWithReq: AppData = {
      ...data,
      requests: [rescheduleReq, ...data.requests],
    };

    const updated = reviewRequest(
      dataWithReq,
      rescheduleReq.id,
      admin,
      "approved",
      "Reschedule confirmed",
    );

    expect(typeof updated).not.toBe("string");
    if (typeof updated !== "string") {
      const targetBooking = updated.bookings.find((b) => b.id === booking.id)!;
      expect(targetBooking.start).toBe("2026-11-02T14:00:00Z");
      expect(targetBooking.end).toBe("2026-11-02T16:00:00Z");

      const reqRecord = updated.requests.find((r) => r.id === rescheduleReq.id)!;
      expect(reqRecord.status).toBe("approved");
      expect(reqRecord.reviewerId).toBe(admin.id);
    }
  });

  it("admin POV: reviews allowlisted profile change requests and applies mutations", () => {
    const data = seedData();
    const admin = data.users.find((u) => u.role === "admin")!;
    const student = data.users.find((u) => u.role === "student")!;

    const profileReq: ProfileChangeRequest = {
      id: `pr-${uid()}`,
      userId: student.id,
      submittedBy: student.id,
      createdAt: "2026-10-27T09:00:00Z",
      status: "pending",
      changes: {
        phone: "+91 98765 00000",
        address: "74 Aerodrome Way, Flight Base",
        city: "Mumbai",
      },
      reason: "Relocated near flight training base",
    };

    const dataWithProfReq: AppData = {
      ...data,
      profileRequests: [profileReq, ...data.profileRequests],
    };

    // Before approval, student user is unchanged
    expect(dataWithProfReq.users.find((u) => u.id === student.id)?.phone).not.toBe(
      "+91 98765 00000",
    );

    // Admin approves
    const updated = reviewProfileRequest(
      dataWithProfReq,
      profileReq.id,
      admin,
      "approved",
      "Address proof verified",
    );

    expect(typeof updated).not.toBe("string");
    if (typeof updated !== "string") {
      const mutatedUser = updated.users.find((u) => u.id === student.id)!;
      expect(mutatedUser.phone).toBe("+91 98765 00000");
      expect(mutatedUser.address).toBe("74 Aerodrome Way, Flight Base");
      expect(mutatedUser.city).toBe("Mumbai");

      const req = updated.profileRequests.find((r) => r.id === profileReq.id)!;
      expect(req.status).toBe("approved");
      expect(req.reviewerId).toBe(admin.id);
    }
  });

  it("admin POV: soft-deletes user (preserves regulatory history) and restores user", () => {
    const data = seedData();
    const admin = data.users.find((u) => u.role === "admin")!;
    const student = data.users.find((u) => u.role === "student")!;

    // Soft delete
    const deletedState = softDeleteUser(data, student.id, admin);
    expect(typeof deletedState).not.toBe("string");
    if (typeof deletedState !== "string") {
      const u = deletedState.users.find((x) => x.id === student.id)!;
      expect(u.status).toBe("deleted");
      expect(u.deletedBy).toBe(admin.id);
      expect(u.deletedAt).toBeDefined();

      // Future bookings are cancelled
      const futureBookings = deletedState.bookings.filter(
        (b) => b.studentId === student.id && new Date(b.start) > new Date(),
      );
      for (const b of futureBookings) {
        expect(b.status).toBe("cancelled");
      }

      // Restore user
      const restoredState = restoreUser(deletedState, student.id, admin);
      expect(typeof restoredState).not.toBe("string");
      if (typeof restoredState !== "string") {
        const restored = restoredState.users.find((x) => x.id === student.id)!;
        expect(restored.status).toBe("active");
        expect(restored.deletedAt).toBeUndefined();
      }
    }
  });

  it("admin POV: full access RBAC permissions", () => {
    // Admin has access to all routes
    expect(canAccess("admin", "/portal/admin")).toBe(true);
    expect(canAccess("admin", "/schedule")).toBe(true);
    expect(canAccess("admin", "/flights")).toBe(true);
    expect(canAccess("admin", "/fleet")).toBe(true);
    expect(canAccess("admin", "/people")).toBe(true);
    expect(canAccess("admin", "/training")).toBe(true);
    expect(canAccess("admin", "/database")).toBe(true);
    expect(canAccess("admin", "/admin/audit")).toBe(true);
    expect(canAccess("admin", "/admin/create")).toBe(true);
    expect(canAccess("admin", "/atlas")).toBe(true);
    expect(canAccess("admin", "/learning")).toBe(true);

    // Other roles are restricted
    expect(canAccess("student", "/database")).toBe(false);
    expect(canAccess("student", "/admin/audit")).toBe(false);
    expect(canAccess("instructor", "/database")).toBe(false);
    expect(canAccess("ground", "/schedule")).toBe(false);

    expect(homeFor.admin).toBe("/portal/admin");
  });

  it("database mapping: round-trips all tables between AppData and database relational rows", () => {
    const data = seedData();
    const tenantId = "t-silverarrows";

    const tables = toTables(data, tenantId);

    // Check all table keys in TABLE_ORDER are populated
    for (const tableName of TABLE_ORDER) {
      expect(Array.isArray(tables[tableName])).toBe(true);
    }

    const reconstructed = fromTables(tables);

    expect(reconstructed.users.length).toBe(data.users.length);
    expect(reconstructed.aircraft.length).toBe(data.aircraft.length);
    expect(reconstructed.programs.length).toBe(data.programs.length);
    expect(reconstructed.bookings.length).toBe(data.bookings.length);
    expect(reconstructed.flights.length).toBe(data.flights.length);
    expect(reconstructed.completions.length).toBe(data.completions.length);
    expect(reconstructed.subjects.length).toBe(data.subjects.length);
    expect(reconstructed.classrooms.length).toBe(data.classrooms.length);
    expect(reconstructed.lectures.length).toBe(data.lectures.length);
    expect(reconstructed.exams.length).toBe(data.exams.length);
  });
});
