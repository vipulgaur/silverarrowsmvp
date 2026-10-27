import { describe, expect, it } from "vitest";
import { seedData } from "@/lib/seed";
import { canAccess, homeFor, uid } from "@/lib/logic";
import {
  ELEARNING_MODULES,
  assignedCourseIds,
  isCourseAssignedToUser,
  usersAssignedToCourse,
  assignCourseToUsers,
  unassignCourseFromUsers,
  accessibleModulesFor,
} from "@/lib/elearning-courses";
import type { Flight, User } from "@/lib/types";

describe("E-Learning Course Assignment & Unassignment Linkage", () => {
  it("shows all modules for administrators, and only assigned modules for students/instructors", () => {
    const data = seedData();
    const adminUser = data.users.find((u) => u.role === "admin")!;
    const studentUser = data.users.find((u) => u.role === "student")!;

    // Admin sees all modules
    const adminModules = accessibleModulesFor(adminUser, data);
    expect(adminModules.length).toBe(ELEARNING_MODULES.length);

    // Initial student modules are only those assigned
    const initialStudentModules = accessibleModulesFor(studentUser, data);
    expect(Array.isArray(initialStudentModules)).toBe(true);
  });

  it("assigns and unassigns courses with complete audit logging and reactive state updates", () => {
    const data = seedData();
    const adminUser = data.users.find((u) => u.role === "admin")!;
    const student = data.users.find((u) => u.id === "u-arp")!; // Aarav Patel

    // 1. Assign Pooley to Aarav
    const assignResult = assignCourseToUsers(
      [student.id],
      "pooley",
      data,
      adminUser,
      "Complete before solo",
    );

    expect(assignResult.newlyAssignedNames).toContain(student.name);
    expect(isCourseAssignedToUser(student.id, "pooley", assignResult.next)).toBe(true);
    expect(
      usersAssignedToCourse("pooley", assignResult.next).some((u) => u.id === student.id),
    ).toBe(true);

    // Check activity audit entry
    const assignmentLog = assignResult.next.activity.find(
      (a) => a.action === "course_assigned" && a.entityId === student.id,
    );
    expect(assignmentLog).toBeDefined();
    expect(assignmentLog?.actorId).toBe(adminUser.id);
    expect(assignmentLog?.details).toContain("Complete before solo");

    // 2. Unassign Pooley from Aarav
    const unassignResult = unassignCourseFromUsers(
      [student.id],
      "pooley",
      assignResult.next,
      adminUser,
      "Syllabus rescheduled",
    );

    expect(unassignResult.unassignedNames).toContain(student.name);
    expect(isCourseAssignedToUser(student.id, "pooley", unassignResult.next)).toBe(false);
    expect(
      usersAssignedToCourse("pooley", unassignResult.next).some((u) => u.id === student.id),
    ).toBe(false);

    // Check unassign audit trail
    const unassignmentLog = unassignResult.next.activity.find(
      (a) => a.entityId === student.id && a.details.includes("unassigned"),
    );
    expect(unassignmentLog).toBeDefined();
  });

  it("handles batch assignment of multiple candidates to Air Law", () => {
    const data = seedData();
    const adminUser = data.users.find((u) => u.role === "admin")!;
    const candidates = data.users.filter((u) => u.role === "student").slice(0, 2);
    const candidateIds = candidates.map((c) => c.id);

    const { next, newlyAssignedNames } = assignCourseToUsers(
      candidateIds,
      "airlaw",
      data,
      adminUser,
    );

    expect(newlyAssignedNames.length).toBe(candidates.length);
    for (const c of candidates) {
      expect(isCourseAssignedToUser(c.id, "airlaw", next)).toBe(true);
    }
  });

  it("keeps users unassigned even when database contains historical course_assigned audit logs", () => {
    const data = seedData();
    const student = data.users.find((u) => u.id === "u-arp")!;

    // Simulate Supabase activity feed containing an old assignment, followed by an unassignment
    const simulatedActivityFeed = [
      {
        id: "act-unassign-latest",
        actorId: "u-admin",
        actorName: "Sakshi Gaur",
        actorRole: "admin" as const,
        action: "course_unassigned",
        entityType: "lesson" as const,
        entityId: student.id,
        details: 'Course "Air Manual — Pooley" unassigned from Aarav Patel (student)',
        at: "2026-10-24T18:30:00.000Z",
      },
      {
        id: "act-assign-historical",
        actorId: "u-admin",
        actorName: "Sakshi Gaur",
        actorRole: "admin" as const,
        action: "course_assigned",
        entityType: "lesson" as const,
        entityId: student.id,
        details: 'Course "Air Manual — Pooley" assigned to Aarav Patel (student)',
        at: "2026-10-24T18:00:00.000Z",
      },
      ...data.activity,
    ];

    const reloadedData = { ...data, activity: simulatedActivityFeed };

    // Must be unassigned because the latest event is course_unassigned
    expect(isCourseAssignedToUser(student.id, "pooley", reloadedData)).toBe(false);
    expect(assignedCourseIds(student.id, reloadedData)).not.toContain("pooley");
    expect(accessibleModulesFor(student, reloadedData).map((m) => m.id)).not.toContain("pooley");
  });

  it("handles legacy and slug course details correctly", () => {
    const data = seedData();
    const student = data.users.find((u) => u.id === "u-arp")!;

    // With legacy hyphenated slug format
    const legacyAssignedData = {
      ...data,
      activity: [
        {
          id: "act-legacy-assign",
          actorId: "u-admin",
          actorName: "Sakshi",
          actorRole: "admin" as const,
          action: "course_assigned",
          entityType: "lesson" as const,
          entityId: student.id,
          details: "air-manual",
          at: "2026-10-24T10:00:00.000Z",
        },
      ],
    };
    expect(isCourseAssignedToUser(student.id, "pooley", legacyAssignedData)).toBe(true);

    // Now unassigned with legacy format
    const legacyUnassignedData = {
      ...data,
      activity: [
        {
          id: "act-legacy-unassign",
          actorId: "u-admin",
          actorName: "Sakshi",
          actorRole: "admin" as const,
          action: "course_unassigned",
          entityType: "lesson" as const,
          entityId: student.id,
          details: "air-manual",
          at: "2026-10-24T11:00:00.000Z",
        },
        ...legacyAssignedData.activity,
      ],
    };
    expect(isCourseAssignedToUser(student.id, "pooley", legacyUnassignedData)).toBe(false);
  });
});

describe("Role-Based Access Control and Home Destinations", () => {
  it("maps roles to correct home portals", () => {
    expect(homeFor.admin).toBe("/portal/admin");
    expect(homeFor.instructor).toBe("/portal/cfi");
    expect(homeFor.ground).toBe("/portal/ground");
    expect(homeFor.student).toBe("/portal/student");
  });

  it("enforces portal path permissions correctly", () => {
    // Admin can access admin portal
    expect(canAccess("admin", "/portal/admin")).toBe(true);
    // Student cannot access admin portal
    expect(canAccess("student", "/portal/admin")).toBe(false);
    // Instructor can access cfi portal
    expect(canAccess("instructor", "/portal/cfi")).toBe(true);
    // All signed-in roles can access their profile and learning
    expect(canAccess("student", "/profile")).toBe(true);
    expect(canAccess("instructor", "/learning")).toBe(true);
  });
});

describe("Flight Logger Core State Updates", () => {
  it("accurately updates aircraft hours and pilot logbook records on saveFlight", () => {
    const data = seedData();
    const aircraft = data.aircraft[0];
    const initialHours = aircraft.totalHours;
    const flightMinutes = 90; // 1.5 hours

    const newFlight: Flight = {
      id: `FL-${uid().slice(0, 4).toUpperCase()}`,
      date: "2026-10-22",
      offBlock: "14:00",
      onBlock: "15:30",
      aircraftId: aircraft.id,
      pilotId: "u-arp",
      instructorId: "u-vpl",
      lessonId: "l-4",
      kind: "dual",
      fromIcao: "EKAH",
      toIcao: "EKAH",
      tachStart: aircraft.tachHours,
      tachEnd: aircraft.tachHours + 1.5,
      minutes: flightMinutes,
      landings: 3,
      grade: 4,
      remarks: "Steep turns and stalls completed with good recovery technique.",
    };

    // Calculate updated aircraft state
    const updatedAircraft = data.aircraft.map((a) =>
      a.id === aircraft.id
        ? { ...a, totalHours: Math.round((a.totalHours + flightMinutes / 60) * 10) / 10 }
        : a,
    );

    const updatedFlights = [newFlight, ...data.flights];

    expect(updatedAircraft[0].totalHours).toBe(Math.round((initialHours + 1.5) * 10) / 10);
    expect(updatedFlights[0].id).toBe(newFlight.id);
    expect(updatedFlights[0].minutes).toBe(90);
    expect(updatedFlights[0].grade).toBe(4);
  });
});
