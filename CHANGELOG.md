# Silver Arrows Aviation Training Platform — Changelog

All notable changes to the Silver Arrows Aviation platform are documented in this file.

---

## [MVP-6] — 2026-10-27

### Summary
Comprehensive bug resolution, type safety stabilization, and historical backup reorganization. Reverted experimental Module 6 draft, fixed 32 TypeScript errors across the active codebase, and achieved 100% green builds with zero compiler warnings.

### Fixed
- **Aircraft Atlas Model Data (`src/lib/atlas/c172-data.ts`)**:
  - Restored missing `serial` field on `AIRFRAME` (`172S-10492`), fixing runtime `undefined` references in Atlas inspection header and modal cards.
- **Maintenance Alert Pipeline (`src/lib/logic.ts`)**:
  - Corrected `maintenanceAlerts` filter in `memberNotifications()`.
  - Replaced invalid property checks (`m.status`, `m.grounded`, `m.severity`, `m.createdAt`) with canonical `aircraftUnavailable(ac, data.maintenance)` and `m.dueDate`.
- **Relational Types & Reschedule Reason (`src/lib/types.ts`)**:
  - Exported `type Reason = RescheduleReason` alias.
  - Added `"conflict"` to `RescheduleReason` union and mapped label in `reasonLabel`.
  - Added optional `createdAt?: string` to `Booking` interface.
- **Entity Creation Page UI (`src/routes/_shell.admin.create.tsx`)**:
  - Corrected `<Chip>` property from `tone="info"` to `variant="info"`.
- **Executive Analytics Dashboard (`src/routes/_shell.dashboard.tsx`)**:
  - Fixed student syllabus metrics from non-existent `p.completedCount` and `p.totalLessons` to `p.completed` and `p.total`.
  - Corrected `<Chip>` tone attributes (`tone="neutral"` to `variant="default"`).
  - Fixed audit activity chip label from `a.entity` to `a.entityType`.
- **Database Schema Inspector (`src/routes/_shell.database.tsx`)**:
  - Corrected `<Chip>` badge attribute from `tone="info"` to `variant="info"`.
- **CFI & Flight Instructor Portal (`src/routes/_shell.portal.cfi.tsx`)**:
  - Safe-guarded flight kind string conversion `(f.kind ?? "flight").toUpperCase()`.
- **24-Hour Scheduling Calendar (`src/routes/_shell.schedule.tsx`)**:
  - Imported `BookingType` from `@/lib/types`.
  - Made `aircraftId?: string` optional in `CalendarEventItem` to accommodate non-assigned bookings.
  - Added required `details` field to `RescheduleRequest` object creation.
  - Corrected dialog chip tone from `"neutral"` to `"none"`.
- **Test Suite Fixtures (`src/test/`)**:
  - `admin-flight-notifications.test.tsx`: Aligned test booking fixtures from `"dual"` to canonical `BookingType` `"lesson"`, and supplied missing route `fromIcao` / `toIcao`.
  - `elearning-and-flight.test.ts`: Explicitly typed `actorRole: "admin" as const` to prevent union widening to generic `string`.

### Reverted
- Reverted experimental Module 6 (Principles of Flight) draft commit (`6d21a95`), restoring clean baseline.

### Storage & Backups
- Consolidated all previous MVP archives (`MVP-4-2026-10-25.zip`, `MVP-5-Built-v1.zip`, `MVP-5-Built-v2.zip`, `Module 5 (CAE ATPL 1. Air Law).zip`) into the root `backups/` directory.

---

## [MVP-5] — 2026-10-27

### Added
- **Module 5: CAE ATPL 1 Air Law (Subject 010)**:
  - 28 complete syllabus chapters matching EASA / UK CAA theoretical knowledge standards.
  - 244 illustrated figures with interactive component hotspot callouts.
  - International aviation law: Chicago Convention, ICAO Annexes 1–19, airworthiness certificates, nationality marks, flight crew licensing (Part-FCL & Part-MED).
  - Rules of the Air, instrument approach & departure procedures, holding patterns, altimeter setting, parallel runway operations, SSR/ACAS.
  - Airspace classifications (Classes A through G), air traffic separation standards, AIS, aerodrome lighting, search & rescue, and accident investigation.
- **Universal Chapter Experience**:
  - Interactive stage navigation (Key Facts, Guided Intro, Visual Figures, Core Theory, Syllabus Accordion, Knowledge Checks, Final Summary).
  - Dynamic hotspot badges with component inspection drawer.

---

## [MVP-4] — 2026-10-25

### Added
- **E-Learning Foundation & Initial Core Modules**:
  - Module 1: Air Manual — Pooley (19 chapters on flying training & aircraft familiarisation).
  - Module 2: CAE ATPL 2 Airframes & Systems (16 chapters on structures, hydraulics, flight controls, pressurization).
  - Module 3: CAE ATPL 3 Electrics & Electronics (17 chapters on DC, AC, alternators, logic gates).
  - Module 4: CAE ATPL 4 Powerplant (28 chapters on piston engines, turbocharging, gas turbines, FADEC).
- **Assigned Courses Engine**:
  - Role-based curriculum access control (Admin manages assignments, students view assigned modules).
  - Audit logging for module assignment and completion state tracking.

---

## [MVP-3] — 2026-10-24

### Added
- **Weekly 24-Hour Scheduling Calendar**:
  - Microsoft Teams-style interactive schedule grid with drag-and-drop rescheduling.
  - Automated booking approval workflow and conflict detection.
  - Post-flight prompt and automated logbook recording.
- **Fleet & Maintenance Management**:
  - Aircraft maintenance intervals, 50h/100h inspections, and AOG grounding logic.

---

## [MVP-2] — 2026-10-23

### Added
- **Aircraft Atlas 3D Digital Twin**:
  - Interactive exploration for Cessna 172S Skyhawk SP and Learjet 24XR.
  - System isolation modes, component callouts, and checkride oral exam simulator.
- **Pilot Digital Logbook**:
  - Dual, Solo, PIC, and Instrument flight time recording with regulatory totals.

---

## [MVP-1] — 2026-10-22

### Added
- **SilverArrows Platform Baseline**:
  - Vite + React + TanStack Router architecture with Tailwind CSS.
  - Multi-role authentication (Admin, Instructor, Student, Ground Crew).
  - Guarded localStorage and Supabase Realtime synchronization framework.
