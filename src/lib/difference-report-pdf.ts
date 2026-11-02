import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const DIFFERENCE_REPORT_FILENAME =
  "SilverArrows_FlightLogger_Architecture_Difference_Report.pdf";

interface AutoTableDoc extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

export function buildDifferenceReportPdf(): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  }) as AutoTableDoc;

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const colors = {
    navy: [15, 23, 42] as [number, number, number],
    slate: [51, 65, 85] as [number, number, number],
    muted: [100, 116, 139] as [number, number, number],
    blue: [3, 105, 161] as [number, number, number],
    emerald: [4, 120, 87] as [number, number, number],
    amber: [180, 83, 9] as [number, number, number],
    crimson: [185, 28, 28] as [number, number, number],
    purple: [109, 40, 217] as [number, number, number],
    lightBg: [248, 250, 252] as [number, number, number],
    border: [203, 213, 225] as [number, number, number],
  };

  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 18) {
      doc.addPage();
      y = 20;
    }
  };

  const drawSectionBanner = (
    badge: string,
    title: string,
    subtitle: string,
    rgb: [number, number, number]
  ) => {
    ensureSpace(26);
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.roundedRect(margin, y, contentWidth, 18, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(badge.toUpperCase(), margin + 4, y + 5.2);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(title, margin + 4, y + 11.2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(226, 232, 240);
    doc.text(subtitle, margin + 4, y + 15.8);

    y += 23;
  };

  const drawSubHeading = (
    title: string,
    rgb: [number, number, number] = colors.navy
  ) => {
    ensureSpace(12);
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.rect(margin, y, 2.5, 6.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);
    doc.text(title, margin + 5, y + 4.8);
    y += 9;
  };

  const drawParagraph = (text: string, fontSize = 9) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(colors.slate[0], colors.slate[1], colors.slate[2]);
    const lines = doc.splitTextToSize(text, contentWidth);
    const blockHeight = lines.length * (fontSize * 0.43) + 2;
    ensureSpace(blockHeight);
    doc.text(lines, margin, y);
    y += blockHeight;
  };

  const drawBulletItem = (
    heading: string,
    body: string,
    accentRgb: [number, number, number] = colors.blue
  ) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const fullText = `${heading}: ${body}`;
    const lines = doc.splitTextToSize(fullText, contentWidth - 6);
    const blockHeight = lines.length * 4.1 + 2.5;
    ensureSpace(blockHeight);

    doc.setFillColor(accentRgb[0], accentRgb[1], accentRgb[2]);
    doc.circle(margin + 1.8, y - 1.1, 1.1, "F");

    // Render heading bold on first line and body wrapped
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.8);
    doc.setTextColor(colors.slate[0], colors.slate[1], colors.slate[2]);
    doc.text(lines, margin + 5, y);
    y += blockHeight;
  };

  // =========================================================================
  // COVER HEADER & EXECUTIVE SUMMARY (PAGE 1)
  // =========================================================================
  doc.setFillColor(colors.navy[0], colors.navy[1], colors.navy[2]);
  doc.rect(0, 0, pageWidth, 54, "F");

  doc.setFillColor(14, 165, 233);
  doc.rect(0, 52.5, pageWidth, 1.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(56, 189, 248);
  doc.text(
    "SILVERARROWS FLIGHT ACADEMY  •  SYSTEMS ARCHITECTURE & GAP ANALYSIS REPORT",
    margin,
    13
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(255, 255, 255);
  doc.text(
    "SilverArrows vs. FlightLogger REA Specification",
    margin,
    23
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  doc.text(
    "Exhaustive 3-Way Difference Audit: Current Application Codebase vs. 13 FlightLogger REA .md Blueprints",
    margin,
    30.5
  );

  // Metadata bar inside cover header
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, 35.5, contentWidth, 12.5, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("DOC REF: SA-FL-DIFF-2026-V1", margin + 4, 40.5);
  doc.text("DATE: OCTOBER 30, 2026", margin + 62, 40.5);
  doc.text("ANALYZED SPECS: 13 REA .MD FILES", margin + 115, 40.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(226, 232, 240);
  doc.text(
    "Scope: (1) Exclusive to SilverArrows  |  (2) Missing from FlightLogger REA Spec  |  (3) Missing in Both Systems",
    margin + 4,
    45.5
  );

  y = 62;

  drawSubHeading("Executive Quantitative Comparison Matrix", colors.navy);
  drawParagraph(
    "This report presents a line-by-line architectural comparison between the live SilverArrows Aviation Academy codebase (/src, /supabase) and the 13 reverse-engineered FlightLogger REA specification files located in /flightloggerreatask (00_MASTER_REA_INDEX.md through 11_UI_AND_BACKEND_COMPLETE_RECREATION_CHECKLIST.md)."
  );

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [
      [
        "Architectural Dimension",
        "Current SilverArrows Application",
        "FlightLogger REA .md Specification",
        "Gap Severity",
      ],
    ],
    body: [
      [
        "Database Entities",
        "19 synced tables (15 operational + 4 approval, profile, learning & audit tables)",
        "32 core relational entities (+ SMS hazard reports & ACI invoicing tables)",
        "HIGH (19+ missing tables)",
      ],
      [
        "Application Routes",
        "17 routes (1 landing, 1 E-Learning portal, 1 auth, 14 _shell workspace routes)",
        "60+ routes (Global /my SSO hub + path-scoped /a/:tenant/... multi-tenant routes)",
        "HIGH (43+ missing views)",
      ],
      [
        "API & RPC Operations",
        "25 store actions + Supabase REST/Realtime diff sync (mapping.ts / sync.ts)",
        "144 cataloged GraphQL Queries, Mutations & ActionCable Subscriptions",
        "HIGH (ACID RPCs needed)",
      ],
      [
        "RBAC Role Matrix",
        "4 roles (admin, instructor, ground, student) — scalar 1 role per user",
        "7 roles (admin, staff, instructor, crew, student, renter, guest) — multi-role per user",
        "MEDIUM (3 missing roles)",
      ],
      [
        "Flight Lifecycle FSM",
        "3 states (scheduled, completed, cancelled) + Admin Post-Flight Yes/No prompt",
        "6-stage FSM (scheduled -> briefing -> flight -> landed -> debriefing -> completed)",
        "CRITICAL (Core Ops FSM)",
      ],
      [
        "Post-Flight Commit",
        "Sequential client store updates (flights, aircraft.hours, completions, bookings)",
        "6-Way Atomic ACID Stored Procedure (fn_register_flight) with full rollback",
        "CRITICAL (Data Integrity)",
      ],
      [
        "Pre-Flight Dispatch Gating",
        "3 checks (time overlap, active member status, aircraft grounded/overdue status)",
        "7-point regulatory gate (Medical, 90d currency, Class rating, Maint hours vs duration, FTL 12h rest & 7/28/365d rolling limits, 24h Solo sign-off)",
        "CRITICAL (Safety Gating)",
      ],
      [
        "Syllabus & Grading Model",
        "Lesson-level Pass/Fail (completed/incomplete) + 1-100 score + text notes",
        "EASA/ICAO CBTA 1-5 Norm Matrix across maneuvers (master_exercises) & 8 Core Competencies (KNO, FPA, FPO, COM, WLM, SAW, PRB, LST)",
        "HIGH (CBTA Compliance)",
      ],
      [
        "Ground School & Textbooks",
        "Full interactive digital textbook reader, hotspot diagrams, notes, quizzes & 3D/SVG Atlas",
        "Only classroom schedule slots (lectures) & theory exam score entry (exam_results)",
        "SILVERARROWS ADVANTAGE",
      ],
      [
        "Regulatory Authority Target",
        "Indian DGCA (Computer No, eGCA ID, SPL/FRTOL/RTR, 5 DGCA exams) + EASA FTL",
        "European EASA Part-FCL / Part-ORA / Part-FTL / Part-ML & FAA Part 141",
        "COMPLEMENTARY",
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: colors.navy,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 7.6,
      textColor: colors.slate,
      cellPadding: 2.2,
    },
    columnStyles: {
      0: { cellWidth: 36, fontStyle: "bold" },
      1: { cellWidth: 58 },
      2: { cellWidth: 58 },
      3: { cellWidth: 30, fontStyle: "bold" },
    },
  });

  y = (doc.lastAutoTable?.finalY ?? y) + 7;

  drawSubHeading("Source Files Audited in /flightloggerreatask", colors.blue);
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["File Name", "Specification Focus & Architectural Contents"]],
    body: [
      [
        "00_MASTER_REA_INDEX.md",
        "Master topology index linking bundle AST analysis, 144 operations, 32 database tables, and 7 core domains.",
      ],
      [
        "01_BUNDLE_AST_2_5M_ANALYSIS.md",
        "2.54M-char production Webpack/Babel AST decompilation (React 18, Apollo Client, Redux-Persist, FullCalendar, D3).",
      ],
      [
        "02_GRAPHQL_CATALOG_144_OPERATIONS.md",
        "Complete registry of 144 GraphQL queries, mutations, and subscriptions across 9 operational domains.",
      ],
      [
        "03_DATABASE_SCHEMA_32_ENTITIES.md",
        "DDL blueprint for 32 PostgreSQL tables across 7 functional domains with foreign keys and check constraints.",
      ],
      [
        "04_TENANT_ROUTES_AND_PAGE_DIRECTORIES.md",
        "60+ routes spanning global /my SSO pilot portal and tenant-scoped /a/:tenant/... academy operations.",
      ],
      [
        "05_CORE_ENGINES_AND_STATE_MACHINES.md",
        "6-Stage Flight FSM, 6-Way Atomic Post-Flight Commit (fn_register_flight), CBTA 1-5 Grading, and 7-Point Dispatch Gate.",
      ],
      [
        "06_REALTIME_WEBSOCKETS_AND_STATE_PERSISTENCE.md",
        "ActionCable / Supabase Realtime channels and crash-proof SessionStorage buffer (persist:userCustomLecture).",
      ],
      [
        "07_ROLES_PERMISSIONS_AND_PORTALS.md",
        "7-Tier RBAC matrix (Admin, Staff, Instructor, Crew, Student, Renter, Guest) and RLS security policies.",
      ],
      [
        "08_AGENT_SKILLS_AND_INTEGRATION_LINKS.md",
        "Stripe ACI billing, ADS-B telemetry auto-landing, S3 presigned document vault, SendGrid/Twilio, and WebAuthn 2FA.",
      ],
      [
        "09_COMPREHENSIVE_TEST_SPECIFICATION_AND_MATRIX.md",
        "100+ unit, integration, E2E, and chaos fault-injection test vectors for aviation regulatory invariants.",
      ],
      [
        "10_DATABASE_TABLES_COLUMNS_AND_USAGES_ENCYCLOPEDIA.md",
        "Column-by-column encyclopedia detailing exact SQL types, triggers, and UI bindings for all 32 tables.",
      ],
      [
        "11_UI_AND_BACKEND_COMPLETE_RECREATION_CHECKLIST.md",
        "Screen-by-screen UI recreation specification (Gantt scheduler, Wallboard, 4-tab Debrief Wizard, Radar Charts).",
      ],
    ],
    theme: "striped",
    headStyles: {
      fillColor: colors.blue,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 7.4,
      textColor: colors.slate,
      cellPadding: 1.8,
    },
    columnStyles: {
      0: { cellWidth: 68, fontStyle: "bold" },
      1: { cellWidth: 114 },
    },
  });

  // =========================================================================
  // SECTION 1: WHAT IS IN SILVERARROWS BUT MISSING IN FLIGHTLOGGER REA .MD
  // =========================================================================
  doc.addPage();
  y = 20;

  drawSectionBanner(
    "Section 1 of 3  •  SilverArrows Exclusive Capabilities",
    "1. What Is in Your App Today, But MISSING in the FlightLogger .md Files",
    "Custom-built E-Learning textbooks, Indian DGCA compliance, multi-stage admin approval workflows, and live weather synthesis",
    colors.emerald
  );

  drawParagraph(
    "Your current SilverArrows codebase contains 11 rich functional subsystems that are completely absent from the FlightLogger REA .md specification files. These must be preserved intact when expanding the platform."
  );

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [
      [
        "#",
        "SilverArrows Exclusive Feature",
        "Source Files in Your App",
        "Detailed Capability Absent from FlightLogger REA .md Spec",
      ],
    ],
    body: [
      [
        "1.1",
        "Interactive E-Learning Digital Textbook & Hotspot Reader",
        "/elearning, /learning/$chapterId, airframes-content.ts, electrics-content.ts, powerplant-content.ts, airlaw-content.ts, learning-illustrations.ts",
        "FlightLogger REA only tracks classroom schedule slots (lectures) and exam scores. SilverArrows provides a full digital ground-school textbook with verbatim & expanded markdown chapters, generated technical illustrations with interactive static coordinate hotspots, personal study notes, bookmarks, and inline chapter quizzes persisted in learning_records.",
      ],
      [
        "1.2",
        "Admin Ground-School Course Assignment Console",
        "src/components/assigned-courses-panel.tsx, assignedCourseIds on tenant_members",
        "Allows the Administrator to selectively assign or revoke specific ground-school textbook courses per student, emitting real-time course_assigned and course_unassigned notifications.",
      ],
      [
        "1.3",
        "Interactive 3D / SVG Aviation Technical Atlas",
        "src/routes/_shell.atlas.tsx, src/components/atlas/, src/lib/atlas/",
        "Dedicated interactive visual aircraft systems exploration atlas inside the authenticated workspace shell.",
      ],
      [
        "1.4",
        "Cinematic Takeoff Sequence, Terrain Compass & Live IST Clock",
        "src/components/homepage-aviation-sequence.tsx, live-ist-clock.tsx, network-time.ts",
        "Interactive landing page featuring an animated aircraft takeoff sequence, real-time mountain/airstrip terrain compass map (VIDP 28R/10L), 3D tactile gateway cards, and a network-synced Indian Standard Time (IST) cockpit clock.",
      ],
      [
        "1.5",
        "Indian DGCA Regulatory Pilot Credentials & Written Exams",
        "src/lib/types.ts, src/lib/api/mapping.ts, src/routes/_shell.crew.tsx",
        "Native support for Indian DGCA fields: Computer Number, eGCA ID, File Number, SPL (Student Pilot License), FRTOL, RTR(A) numbers/expiries, and 5 DGCA written exam statuses (Air Regulation, Air Navigation, Meteorology, Technical General, Technical Specific).",
      ],
      [
        "1.6",
        "Strict Registration Gate & Real-Time Admin Login Lock",
        "src/routes/login.tsx, isd-codes.ts, PENDING_ADMIN_APPROVAL",
        "Enforces @flysilverarrows.com usernames, ISD country code phone validation (default +91), atomic uniqueness across username/email/phone, sole-admin lock (admin@flysilverarrows.com), and a real-time Account Pending Administrator Login Approval screen.",
      ],
      [
        "1.7",
        "Student Flight Booking Approval Queue & Audit Trail",
        "src/routes/_shell.admin.approvals.tsx, approval-audit-trail.tsx, DB triggers",
        "Database triggers force student-created flight bookings into approval_status = 'pending'. The Admin Approvals Console provides one-click Approve/Decline and an immutable chronological Approval Audit Trail.",
      ],
      [
        "1.8",
        "Automated Post-Flight 'Did the Flight Happen?' Admin Prompt",
        "src/components/post-flight-prompt.tsx, confirmPostFlightOutcome()",
        "Detects past scheduled bookings whose end time has elapsed and prompts the Administrator to verify whether the flight occurred (Yes auto-creates the flight log & updates aircraft hours; No cancels the slot and records a DNF audit entry).",
      ],
      [
        "1.9",
        "Student Flight Log Verification & Profile Change Diff Queue",
        "submitStudentFlightLog(), verifyFlightLog(), profile_requests, profile-requests.tsx",
        "Students can submit flight logs in 'pending' status for Instructor/Admin verification. Non-admin profile edits create allowlisted before/after diffs (changes vs before_values) requiring Admin approval before mutating tenant_members.",
      ],
      [
        "1.10",
        "Live Open-Meteo Aerodrome Weather & METAR/TAF Synthesizer",
        "src/lib/weather.ts, src/components/weather-widget.tsx",
        "Fetches real-time aerodrome temperature, wind vector/gusts, visibility, cloud cover, and QNH pressure, synthesizes aviation METAR/TAF strings and flight categories (VFR/MVFR/IFR/LIFR), and attaches immutable weather snapshots to bookings and flight logs.",
      ],
      [
        "1.11",
        "Pilot Proficiency Badges, Role Switcher & Privacy Telemetry",
        "proficiency-badges.tsx, view-as.tsx, _shell.database.tsx, privacy-tracker.ts",
        "Computes Bronze/Silver/Gold tiers across 8 pilot badges and Pilot Ranks (Cadet Aviator to Master Command Aviator), plus an in-app Role Impersonation Switcher, Live Database Table Inspector, and session activity/idle telemetry tracker.",
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: colors.emerald,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: colors.slate,
      cellPadding: 2.1,
    },
    columnStyles: {
      0: { cellWidth: 10, fontStyle: "bold" },
      1: { cellWidth: 42, fontStyle: "bold" },
      2: { cellWidth: 42 },
      3: { cellWidth: 88 },
    },
  });

  // =========================================================================
  // SECTION 2: WHAT IS MISSING IN SILVERARROWS FROM FLIGHTLOGGER REA .MD
  // =========================================================================
  doc.addPage();
  y = 20;

  drawSectionBanner(
    "Section 2 of 3  •  Critical Gaps from FlightLogger REA Blueprint",
    "2. What Is MISSING in Your App from the FlightLogger .md Files",
    "Detailed breakdown of 20 missing database tables, 3 core backend state engines, 43+ routes, CBTA 1-5 grading, ACI billing & SMS",
    colors.crimson
  );

  drawSubHeading(
    "2.A — Missing Database Tables (19 Current Synced vs. 32 Core Entities in 03 & 10 .md)",
    colors.crimson
  );
  drawParagraph(
    "Your current app syncs 19 tables in src/lib/api/mapping.ts (tenant_members, member_roles, aircraft, maintenance_items, programs, program_lessons, theory_subjects, classrooms, bookings, flights, completions, change_requests, exam_results, lectures, duty_records, profile_requests, learning_records, notification_reads, activity_feed). Below are the 20 relational tables defined in 03_DATABASE_SCHEMA_32_ENTITIES.md and 10_DATABASE_TABLES_COLUMNS_AND_USAGES_ENCYCLOPEDIA.md that are missing from your database:"
  );

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [
      [
        "Spec #",
        "Missing Table Name",
        "Domain",
        "Key Columns, Constraints & Operational Purpose in FlightLogger REA",
      ],
    ],
    body: [
      [
        "Table 5",
        "webauthn_credentials",
        "Auth & 2FA",
        "credential_id, public_key, sign_count, device_name. Stores FIDO2 / Passkey hardware keys for biometric 2FA and logbook signing.",
      ],
      [
        "Table 6",
        "aircraft_models",
        "Fleet & CAMO",
        "make, model_name, class_rating (SEP_LAND, MEP_LAND, TMG, SET, MET), engine_type, usable_fuel_liters, cruise_speed_knots, has_retractable_gear, has_variable_pitch_prop.",
      ],
      [
        "Table 9",
        "aircraft_remarks",
        "Fleet & CAMO",
        "reported_by, flight_id, severity (info, warning, grounding_defect), status (open, deferred_mel, rectified), mel_reference, rectified_by_license (CAMO CRS sign-off).",
      ],
      [
        "Table 10",
        "certificate_types",
        "Compliance",
        "name, category (medical, license, rating, radio, language_proficiency, passport, company_check), warning_days_before, blocks_booking, blocks_solo.",
      ],
      [
        "Table 11",
        "user_certificates",
        "Compliance",
        "user_id, certificate_type_id, certificate_number, issue_date, expiry_date, file_storage_path (S3/Supabase Storage), verified_by. Replaces hardcoded flat columns.",
      ],
      [
        "Table 12",
        "certificate_warnings",
        "Compliance",
        "user_id, user_certificate_id, warning_code (e.g., 'ANS: Medical (1) Missing', '90_DAY_LANDING_CURRENCY_LAPSED'), severity (expiring_soon, expired, missing_mandatory).",
      ],
      [
        "Table 14",
        "program_revisions",
        "Syllabus & CBTA",
        "program_id, revision_number, effective_date, approved_by_authority_ref, is_current. Allows syllabus version upgrades without breaking active student cohorts.",
      ],
      [
        "Table 15",
        "program_phases",
        "Syllabus & CBTA",
        "revision_id, name (e.g. Phase 1: Pre-Solo), sequence_order, requires_stage_check. Enforces stage-check barriers between training phases.",
      ],
      [
        "Table 17",
        "master_exercises",
        "Syllabus & CBTA",
        "lesson_id, code (e.g. '4.1.a'), title (e.g. 'Steep Turns 45 deg Bank'), norm_target_grade (1-5), is_mandatory. Granular maneuvers inside each syllabus lesson.",
      ],
      [
        "Table 18",
        "core_competencies",
        "Syllabus & CBTA",
        "code (KNO, FPA, FPO, COM, WLM, SAW, PRB, LST), name, description, min_acceptable_score (default 2). The 8 ICAO Doc 9995 / EASA CBTA dimensions.",
      ],
      [
        "Table 19",
        "competency_indicators",
        "Syllabus & CBTA",
        "competency_id, indicator_code (e.g. 'FPA.1'), description. Observable Behavioral Indicators (OBIs) checked by instructors during post-flight debriefing.",
      ],
      [
        "Table 20",
        "user_programs",
        "Syllabus & CBTA",
        "student_id, program_id, revision_id, primary_instructor_id, enrolled_at, completed_at, status (active, on_hold, completed, withdrawn).",
      ],
      [
        "Table 21",
        "user_lectures",
        "Syllabus & CBTA",
        "user_program_id, lesson_id, flight_id, instructor_id, attempt_number, status (planned, in_progress, passed, repeat_required), instructor_signature_hash, student_signature_hash.",
      ],
      [
        "Table 22",
        "user_exercises",
        "Syllabus & CBTA",
        "user_lecture_id, exercise_id, grade (CHECK 1..5), attempt_count, instructor_remark. Stores the 1-5 norm grade for every maneuver flown.",
      ],
      [
        "Table 23",
        "graded_competencies",
        "Syllabus & CBTA",
        "user_lecture_id, competency_id, score (CHECK 1..5), observed_indicators[], debrief_comment. Feeds the 8-axis student CBTA radar chart.",
      ],
      [
        "Table 25",
        "booking_conflicts",
        "Dispatch & Ops",
        "booking_id, conflict_type (aircraft_overlap, instructor_overlap, maintenance_overdue, certificate_expired, ftl_violation, weather_minima), is_blocking, overridden_by, override_reason.",
      ],
      [
        "Table 27",
        "landings",
        "Flight Ops",
        "flight_id, airport_icao, day_full_stop, day_touch_and_go, night_full_stop, night_touch_and_go, approaches_ils, approaches_rnp, approaches_visual. Powers 90-day currency.",
      ],
      [
        "Table 28",
        "electronic_logbook_entries",
        "Flight Ops",
        "user_id, flight_id, role_capacity (PIC, DUAL_STUDENT, INSTRUCTOR, SPIC, PICUS, SIM_INSTRUCTOR), total_flight_time, signature_hash, is_locked. Dual rows per flight.",
      ],
      [
        "Tables 30-32",
        "customers, price_lists, price_list_items, activities, invoices, invoice_items",
        "Finance (ACI)",
        "Automated Customer Invoicing (ACI) ledger: customer account_balance & credit_limit, wet/dry aircraft hourly rates, unbilled flight activities, and finalized PDF/Stripe invoices.",
      ],
      [
        "SMS Ext.",
        "sms_reports / hazard_logs",
        "Safety (SMS)",
        "ICAO Doc 9859 occurrence reporting: category, severity (1-5), likelihood (A-E), risk_index (e.g. '4B'), is_confidential, capa_mitigation_plan, status.",
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: colors.crimson,
      textColor: [255, 255, 255],
      fontSize: 7.6,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 7.0,
      textColor: colors.slate,
      cellPadding: 1.4,
    },
    columnStyles: {
      0: { cellWidth: 16, fontStyle: "bold" },
      1: { cellWidth: 38, fontStyle: "bold" },
      2: { cellWidth: 24 },
      3: { cellWidth: 104 },
    },
  });

  doc.addPage();
  y = 20;

  drawSubHeading(
    "2.A (Cont.) — Missing Columns on Existing SilverArrows Tables",
    colors.crimson
  );

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [
      [
        "Existing Table",
        "Current Columns in SilverArrows",
        "Missing Columns Required by FlightLogger REA Specification",
      ],
    ],
    body: [
      [
        "aircraft",
        "id, registration, type, status, hours, next_due_hours, last_100hr, annual_due",
        "model_id (FK to aircraft_models), serial_number, home_base_icao, meter_type (HOBBS_DECIMAL / TACH_DECIMAL / FLIGHT_TIME_MINUTES), current_tach_hours, current_hobbs_hours, total_airframe_hours, total_landings, status = 'maintenance_due'.",
      ],
      [
        "maintenance_items",
        "id, aircraft_id, title, due_hours, due_date, status",
        "interval_days, interval_landings, warning_hours_threshold, warning_days_threshold, next_due_landings, is_critical_grounding (auto-grounds tail at <= 0h), completed_by_camo_ref, work_order_ref.",
      ],
      [
        "bookings",
        "id, aircraft_id, student_id, instructor_id, start_time, end_time, lesson_code, status, approval_status",
        "booking_type (dual_training, solo_training, stage_check, skill_test, rental, charter, maintenance, ground_school), 6-stage status (briefing, flight, landed, debriefing), departure_icao, arrival_icao, alternate_icao, briefing_start_time, debriefing_end_time.",
      ],
      [
        "flights",
        "id, date, aircraft_id, student_id, instructor_id, duration_hours, flight_type, lesson_code, day_hours, night_hours, instrument_hours, landings",
        "4-point timestamps (off_block_time, takeoff_time, landing_time, on_block_time), tach_start, tach_stop, hobbs_start, hobbs_stop, fuel_start_liters, fuel_added_liters, fuel_stop_liters, oil_added_quarts, time_spic, time_picus, time_vfr, time_ifr, time_sim_fnpt, instructor_signed_at, student_signed_at.",
      ],
      [
        "duty_records",
        "id, instructor_id, date, duty_hours, flight_hours, description",
        "duty_start (TIMESTAMPTZ), duty_end (TIMESTAMPTZ), duty_type (flight_duty, ground_instruction, simulator_instruction, office_admin, standby_reserve), split_duty_break_minutes, fdp_hours, max_allowed_fdp_hours, mandatory_rest_until (TIMESTAMPTZ).",
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: colors.slate,
      textColor: [255, 255, 255],
      fontSize: 7.8,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 7.3,
      textColor: colors.slate,
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 30, fontStyle: "bold" },
      1: { cellWidth: 64 },
      2: { cellWidth: 88 },
    },
  });

  y = (doc.lastAutoTable?.finalY ?? y) + 7;

  drawSubHeading(
    "2.B — Missing Core Backend Engines & State Machines (05_CORE_ENGINES_AND_STATE_MACHINES.md)",
    colors.crimson
  );

  drawBulletItem(
    "Engine 1: The 6-Stage Flight Lifecycle Finite State Machine (FSM)",
    "Your app only tracks 3 booking states (scheduled, completed, cancelled). The REA specification requires a 6-stage operational FSM: scheduled -> briefing -> flight -> landed -> debriefing -> completed. Transitioning scheduled -> briefing checks that no crew member has blocking certificate warnings and stamps briefing_start_time. Transitioning briefing -> flight verifies aircraft.status == 'airworthy', validates all 7 pre-flight dispatch gates, and stamps off_block_time & takeoff_time. Transitioning flight -> landed enforces landing_time > takeoff_time and blocks cancelling an airborne aircraft (IllegalStateTransitionError). Transitioning debriefing -> completed executes fn_register_flight.",
    colors.crimson
  );

  drawBulletItem(
    "Engine 2: The 6-Way Atomic Post-Flight Commit (fn_register_flight ACID Stored Procedure)",
    "In your app, logging a flight updates client memory and syncs 4 tables sequentially. In the REA specification, completing a flight runs a single PostgreSQL stored procedure (fn_register_flight) that atomically commits 6 subsystems with full rollback on error: (1) Updates aircraft tach/hobbs/airframe hours, total_landings, fuel burn & oil uplift, decrements maintenance_items.hours_left, and auto-grounds the aircraft (status = 'maintenance_due') if any critical task hits <= 0h; (2) Inserts CBTA 1-5 grades into user_lectures, user_exercises, and graded_competencies, marking repeat_required and locking the next syllabus lesson if any mandatory grade is <= 2; (3) Synthesizes TWO immutable rows in electronic_logbook_entries (Student DUAL/PIC row + Instructor INSTRUCTOR/PIC row) sealed with SHA-256 signature_hash; (4) Closes the instructor's duty_records row and stamps mandatory_rest_until = NOW() + GREATEST(12h, duty_duration); (5) Calculates Automated Customer Invoicing (ACI) charges into activities (unbilled) and deducts from customers.account_balance; (6) Auto-spawns a draft SMS hazard report if an incident was flagged.",
    colors.crimson
  );

  drawBulletItem(
    "Engine 3: The 7-Point Pre-Flight Dispatch Gating Engine",
    "Your current bookingProblem() in src/lib/logic.ts checks only 3 conditions (time overlap, active user status, and whether aircraft maintenance is already <= 0). It is missing 5 critical regulatory gates: Gate 1 (Crew Medical, License, Radio & Language Proficiency expiry vs booking.end_time); Gate 2 (EASA FCL.060 90-day 3-landing passenger/solo currency query on landings); Gate 3 (Aircraft Model Class/Type rating endorsement check for SEP_LAND, MEP_LAND, retractable gear, variable-pitch prop); Gate 4 (Planned flight duration vs remaining maintenance hours: hours_left >= planned_flight_duration so a 2.5h flight cannot launch with 1.8h left before a 100h check); Gate 5 & 6 (EASA Part-FTL 12h mandatory_rest_until lock + rolling cumulative ceilings: max 60h duty in 7 days, 190h duty / 100h flight in 28 days, 900h flight in calendar year, 1000h flight in 365 days); Gate 7 (24-hour instructor digital Solo Endorsement verification).",
    colors.crimson
  );

  // =========================================================================
  // SUBSECTION 2.C & 2.D: MISSING ROUTES, UI SCREENS, ROLES & INTEGRATIONS
  // =========================================================================
  doc.addPage();
  y = 20;

  drawSubHeading(
    "2.C — Missing Portals, Multi-Tenant Routes & UI Workspaces (04 & 11 .md)",
    colors.crimson
  );

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [
      [
        "Missing Route / Screen",
        "Target Path in .md Spec",
        "Detailed UI & Functional Specification from 04 & 11 .md",
      ],
    ],
    body: [
      [
        "Global Multi-Tenant Pilot Hub",
        "/my/flights, /my/warnings, /my/certificates, /my/logbook, /my/organizations",
        "Cross-academy SSO portal allowing freelance instructors, examiners, and students enrolled at multiple ATOs to view combined schedules, upload personal certificates, and switch active tenant.",
      ],
      [
        "Horizontal Multi-Resource Gantt Scheduler",
        "/a/:tenant/bookings",
        "Sticky left resource tree (Aircraft, Simulators, Instructors, Classrooms) + horizontal 15-min increment timeline grid (Day/Week/Month zoom), drag-to-create/resize, instructor availability shading (userAvailabilityMatrix), and conflict badges.",
      ],
      [
        "Live Airfield Departure / Arrival Wallboard",
        "/a/:tenant/activities/dep-arr",
        "Dark-mode FBO dispatch television display showing Active Runway in Use (setRunwayInUse), live surface wind/METAR, chronological Departures & Arrivals, real-time elapsed airborne timers, stand/bay assignments, and overdue alerts.",
      ],
      [
        "Booking Conflict Resolution Center",
        "/a/:tenant/bookings_conflict_center",
        "Dispatcher triage workspace listing all unresolved booking_conflicts with one-click aircraft tail swap, instructor reassignment, or Accountable Manager regulatory override (overrideBookingConflict with mandatory audit reason).",
      ],
      [
        "4-Tab Post-Flight & CBTA Debriefing Wizard",
        "/a/:tenant/bookings/:id/register",
        "Tab 1: 4-point times, Tach/Hobbs meters, Fuel/Oil & Day/Night landings. Tab 2: 1-5 CBTA segmented grading matrix for master_exercises & 8 Core Competencies + OBI checkboxes. Tab 3: Debrief notes & inline Aircraft Squawk toggle. Tab 4: Dual PIN/WebAuthn sign-off. Backed by crash-proof SessionStorage (persist:userCustomLecture).",
      ],
      [
        "CBTA 8-Axis Spider Radar Chart & Heatmap",
        "/a/:tenant/cbta/matrix, /a/:tenant/users/:id/programs/:pid",
        "8-axis SVG radar chart plotting student rolling average across KNO, FPA, FPO, COM, WLM, SAW, PRB, LST against target baseline (4.0) and safety floor (2.0), plus academy-wide maneuver bottleneck heatmaps and Stage Check queue (/a/:tenant/stage_checks).",
      ],
      [
        "Aircraft Squawks & CAMO CRS Work Orders",
        "/a/:tenant/aircraft/:id/remarks, /a/:tenant/camo/work_orders",
        "Digital aircraft technical logbook for reporting defects (info, warning, grounding_defect), deferring items to the Minimum Equipment List (MEL) with expiry dates, and recording licensed CAMO engineer Certificate of Release to Service (CRS) sign-offs.",
      ],
      [
        "Automated Customer Invoicing (ACI) Suite",
        "/a/:tenant/invoicing/dashboard, /unbilled, /invoices, /customers, /price_lists",
        "Complete financial management portal: unbilled flight activities queue, wet/dry aircraft hourly rate cards, customer prepayment retainer balances, batch PDF invoice generation, revenue analytics, and Stripe card charging.",
      ],
      [
        "Safety Management System (SMS) 5x5 Portal",
        "/a/:tenant/sms/reports, /a/:tenant/sms/statistics",
        "Confidential & standard occurrence reporting with interactive ICAO Doc 9859 5x5 Risk Matrix (Severity 1-5 x Likelihood A-E), Red/Amber/Green classification, Root Cause Analysis, and CAPA mitigation tracking.",
      ],
      [
        "Official EASA / FAA Electronic Logbook Export",
        "/a/:tenant/logbooks/:user_id, /a/:tenant/logbooks/:user_id/export",
        "Multi-column regulatory pilot logbook (SEP/MEP, Day/Night, PIC/Dual/Instructor/SPIC/PICUS, IFR approaches, FNPT Sim) with page-by-page brought-forward totals and SHA-256 digitally signed PDF export.",
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: colors.blue,
      textColor: [255, 255, 255],
      fontSize: 7.8,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 7.3,
      textColor: colors.slate,
      cellPadding: 1.9,
    },
    columnStyles: {
      0: { cellWidth: 44, fontStyle: "bold" },
      1: { cellWidth: 42 },
      2: { cellWidth: 96 },
    },
  });

  y = (doc.lastAutoTable?.finalY ?? y) + 7;

  drawSubHeading(
    "2.D — Missing RBAC Roles, Realtime Channels & External Integrations (06, 07, 08 .md)",
    colors.crimson
  );

  drawBulletItem(
    "3 Missing Operational Roles & Multi-Role Support (07_ROLES_PERMISSIONS_AND_PORTALS.md)",
    "Your app supports 4 roles (admin, instructor, ground, student) with a single role per user. The REA specification defines 7 roles—adding staff (Operations Coordinator / Dispatcher with full Gantt, conflict, certificate, and ACI billing rights), crew (Commercial Charter Pilot), and renter (Self-Hire Licensed Pilot)—and supports multiple simultaneous roles per user via UNIQUE(tenant_id, user_id, role_id).",
    colors.blue
  );

  drawBulletItem(
    "Dedicated Realtime WebSocket Channels & Crash-Proof Debrief Buffer (06 .md)",
    "While your app uses a single tenant-scoped Supabase Realtime subscription across tables, the REA spec defines 4 specialized real-time streams (DepartureArrivalChannel, BookingChannel, NotificationChannel, AdminAuditChannel) plus the persist:userCustomLecture SessionStorage mirror that preserves in-progress flight debriefings across iPad browser crashes.",
    colors.blue
  );

  drawBulletItem(
    "External Integrations (08_AGENT_SKILLS_AND_INTEGRATION_LINKS.md)",
    "Missing integrations cataloged in 08 .md: (1) Live ADS-B / SpiderTracks / RadarBox telemetry bridge that auto-transitions airborne flights to 'landed' when groundspeed drops below 30 kts inside the destination aerodrome geofence; (2) Stripe ACI payment processing; (3) S3 / Supabase Storage presigned document uploads for medical/license scans; (4) WebAuthn FIDO2 hardware 2FA.",
    colors.blue
  );

  // =========================================================================
  // SECTION 3: WHAT IS MISSING IN BOTH SILVERARROWS AND FLIGHTLOGGER REA .MD
  // =========================================================================
  doc.addPage();
  y = 20;

  drawSectionBanner(
    "Section 3 of 3  •  Blind Spots Across Both Systems",
    "3. What Is MISSING in BOTH Your App AND the FlightLogger .md Files",
    "Critical real-world flight academy, flight dispatch, Indian DGCA/GST, and avionics capabilities absent from both specifications",
    colors.purple
  );

  drawParagraph(
    "Even when combining 100% of your current SilverArrows codebase with all 13 FlightLogger REA .md files, the following 8 high-value aviation academy and flight operations capabilities are missing or under-specified in BOTH systems:"
  );

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [
      [
        "#",
        "Capability Missing in BOTH",
        "Operational Domain",
        "Why It Is Required & How We Should Engineer It",
      ],
    ],
    body: [
      [
        "3.1",
        "Interactive Weight & Balance (Mass & Balance) Envelope Calculator & Load Sheet",
        "Pre-Flight Dispatch Safety",
        "Neither your app nor the 32-table schema in 03_DATABASE_SCHEMA_32_ENTITIES.md includes a weight_balance_stations or flight_load_sheets table or CG envelope polygon validator. Before transitioning a flight from briefing -> flight, pilots must enter crew weights, baggage weights, and fuel load to plot Zero-Fuel Weight (ZFW), Takeoff Weight (TOW), and Landing Weight (LDW) inside the aircraft's structural CG envelope (C172S, DA40, PA28, DA42), blocking dispatch if out of limits.",
      ],
      [
        "3.2",
        "Takeoff & Landing Runway Performance Calculator (Density Altitude & Crosswind)",
        "Pre-Flight Dispatch Safety",
        "Your app fetches live temperature, QNH, and wind vectors, but neither system computes Pressure Altitude, Density Altitude, headwind/crosswind components against the aircraft's max demonstrated crosswind limit, or factored Takeoff Distance Required (TODR) / Landing Distance Required (LDR) vs available runway length.",
      ],
      [
        "3.3",
        "Interactive Cross-Country Operational Flight Plan (OFP) & Wind-Triangle NavLog",
        "Cross-Country Training",
        "For Cross-Country (XC) syllabus lessons, neither system includes a waypoint-by-waypoint Navigation Log (NavLog) generator computing True Track, Wind Correction Angle (WCA), Magnetic Heading, Groundspeed, ETE, Fuel Burn + 45-min VFR / IFR reserve requirements, and live NOTAM decoding.",
      ],
      [
        "3.4",
        "Indian DGCA eGCA Direct Sortie Batch Exporter & FTO Monthly Return Generator",
        "Indian DGCA Compliance",
        "SilverArrows operates in the Indian aviation ecosystem (VIDP, +91, DGCA Computer No, eGCA ID, SPL/FRTOL/RTR), whereas the FlightLogger REA .md files target European EASA rules. Neither system generates the standardized DGCA eGCA sortie batch upload JSON/CSV payload or FTO monthly regulatory return.",
      ],
      [
        "3.5",
        "Indian GST Aviation Tax Engine (CGST / SGST / IGST & SAC 999293 / 9964)",
        "Finance & Tax Compliance",
        "The REA invoicing specification (Table 32) only models a single European VAT percentage column (tax_rate_percent). Indian aviation academies require GSTIN validation, HSN/SAC service codes, and split CGST + SGST (intra-state) vs IGST (inter-state) tax breakdowns on all student and charter invoices.",
      ],
      [
        "3.6",
        "Flight Data Monitoring (FDM / FOQA) Garmin G1000 SD Card CSV Telemetry Analyzer",
        "Safety & Debriefing",
        "Modern glass-cockpit trainers (Cessna 172S G1000 NXi, Diamond DA40/DA42) log 1Hz flight parameters to SD card CSV files. Neither system includes a G1000 CSV parser to visualize the flight path during debriefing or automatically detect safety exceedances (hard landings > 2.1G, bank > 50 deg, Vne overspeed, unstabilized approaches).",
      ],
      [
        "3.7",
        "CAMO Spare Parts Inventory, Rotable Serial Traceability & Tool Calibration Store",
        "CAMO Maintenance Stores",
        "While the .md files track maintenance_items and aircraft_remarks, neither system includes a spare_parts_inventory or calibrated_tools table for tracking oil filter/tire stock levels, EASA Form 1 / DGCA CA Form 1 part serial numbers, shelf-life expiry dates, or torque-wrench calibration expiry dates.",
      ],
      [
        "3.8",
        "True Offline-First Apron/Cockpit PWA with IndexedDB Multi-Flight Sync Queue",
        "Mobile Apron Reliability",
        "The REA spec only caches a single active debriefing draft in window.sessionStorage (which vanishes if the tab closes). Instructors operating on remote unpaved airstrips or apron dead-zones need an IndexedDB / Service Worker offline mutation queue capable of queuing multiple briefings, block times, and debriefings offline and syncing automatically upon reconnection.",
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: colors.purple,
      textColor: [255, 255, 255],
      fontSize: 7.6,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 6.9,
      textColor: colors.slate,
      cellPadding: 1.4,
    },
    columnStyles: {
      0: { cellWidth: 10, fontStyle: "bold" },
      1: { cellWidth: 44, fontStyle: "bold" },
      2: { cellWidth: 30 },
      3: { cellWidth: 98 },
    },
  });

  y = (doc.lastAutoTable?.finalY ?? y) + 5;

  drawSubHeading(
    "Recommended 4-Phase Implementation Roadmap",
    colors.navy
  );

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [
      [
        "Phase",
        "Implementation Scope",
        "Key Deliverables",
      ],
    ],
    body: [
      [
        "Phase 1",
        "Database & Schema Expansion (32 Entities + DGCA Preservation)",
        "Add missing tables (aircraft_models, aircraft_remarks, certificate_types, user_certificates, certificate_warnings, master_exercises, core_competencies, user_exercises, graded_competencies, landings, electronic_logbook_entries, booking_conflicts, ACI billing tables, sms_reports) while retaining all existing SilverArrows tables and DGCA fields.",
      ],
      [
        "Phase 2",
        "Core State Machines & Regulatory Dispatch Engines",
        "Implement the 7-Point Pre-Flight Dispatch Gating Engine (including 7/28/365-day rolling FTL & 90-day currency), the 6-Stage Flight Lifecycle FSM (scheduled -> briefing -> flight -> landed -> debriefing -> completed), and the 6-Way Atomic Post-Flight Commit (fn_register_flight) with crash-proof debrief persistence.",
      ],
      [
        "Phase 3",
        "High-Priority Operational UIs & CBTA Analytics",
        "Build the Horizontal Multi-Resource Gantt Scheduler, Live Airfield Departure/Arrival Wallboard, Booking Conflict Resolution Center, 4-Tab Post-Flight & CBTA 1-5 Debriefing Wizard, 8-Axis CBTA Spider Radar Chart, and Aircraft Squawk / CAMO Tech Log.",
      ],
      [
        "Phase 4",
        "Finance (ACI + Indian GST), Safety (5x5 SMS) & Dispatch Extras",
        "Build the Automated Customer Invoicing (ACI) suite with Indian GST (CGST/SGST/IGST), ICAO 5x5 Safety Management System (SMS) portal, Interactive Weight & Balance CG Envelope Calculator, and Signed EASA/DGCA Electronic Logbook PDF Exporter.",
      ],
    ],
    theme: "striped",
    headStyles: {
      fillColor: colors.navy,
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 6.9,
      textColor: colors.slate,
      cellPadding: 1.4,
    },
    columnStyles: {
      0: { cellWidth: 20, fontStyle: "bold" },
      1: { cellWidth: 52, fontStyle: "bold" },
      2: { cellWidth: 110 },
    },
  });

  // =========================================================================
  // SECTION 4: POST-IMPLEMENTATION STATUS, TEST AUDIT & REMAINING EXTERNAL ITEMS
  // =========================================================================
  doc.addPage();
  y = 20;

  drawSectionBanner(
    "Section 4 of 4  •  Post-Implementation Verification & Status Audit",
    "4. What Has Now Been Implemented & Tested vs. What Remains External",
    "Complete verification matrix of the 32-entity REA expansion, core engines, UI routes, test suite results, and external hardware/API items",
    colors.navy
  );

  drawSubHeading(
    "4.A — Full Implementation & Automated Test Verification Matrix (100% Implemented in App)",
    colors.emerald
  );
  drawParagraph(
    "All core FlightLogger REA schemas, state machines, regulatory dispatch gates, CBTA 1–5 grading workflows, ACI GST invoicing, ICAO 5×5 SMS risk portals, and operational screens have been implemented in the codebase while preserving 100% of existing SilverArrows features and creating a full rollback archive (/backups/pre-flightlogger-rea-backup.tar.gz)."
  );

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [
      [
        "Subsystem / Engine",
        "Implemented Files & Routes",
        "Verification & Automated Test Status",
      ],
    ],
    body: [
      [
        "1. 32-Entity Relational Schema & Seed Normalizer",
        "src/lib/types.ts, src/lib/rea-seed.ts, src/lib/demo-storage.ts, supabase/migrations/20261030220000_flightlogger_rea_32_entities.sql",
        "IMPLEMENTED & VERIFIED — All 32 FlightLogger REA entities typed, seeded, normalized on localStorage load, and exposed in Live Database Inspector (/database).",
      ],
      [
        "2. 7-Role Multi-Role RBAC Matrix",
        "src/lib/types.ts (Role), src/lib/logic.ts (can, access, canAccess, hasRole)",
        "IMPLEMENTED & VERIFIED — Supports admin, staff, instructor, crew, ground, student, and renter roles + secondaryRoles[] across all routes.",
      ],
      [
        "3. Engine 1: 6-Stage Flight Lifecycle FSM & ADS-B Bridge",
        "src/lib/logic.ts (transitionFlightFsm, processAdsbTelemetryUpdate), /operations",
        "IMPLEMENTED & VERIFIED — Enforces scheduled -> briefing -> flight -> landed -> debriefing -> completed, blocks airborne cancellation, and auto-lands at <30 kt.",
      ],
      [
        "4. Engine 2: 6-Way Atomic Post-Flight Commit (fn_register_flight)",
        "src/lib/logic.ts (registerFlightAtomic), /cbta",
        "IMPLEMENTED & VERIFIED — Atomically updates Fleet/CAMO + auto-grounding, CBTA 1-5 norm grading + repeat_required lock, Dual SHA-256 Electronic Logbook rows, EASA FTL 12h rest lock, ACI + Indian GST billing, and SMS auto-triggers.",
      ],
      [
        "5. Engine 3: 7-Point Pre-Flight Dispatch Gating Engine",
        "src/lib/logic.ts (evaluateDispatchGates, easaRollingFtlStatus, endorseSoloFlight, overrideBookingConflict), /operations",
        "IMPLEMENTED & VERIFIED — Evaluates Medical/SPL/FRTOL expiry, 90-day currency, Class Rating (SEP/MEP), Maint hours vs planned flight duration, 12h FTL rest, 7d/28d/900h/1000h rolling FTL ceilings, and 24h Solo Endorsement.",
      ],
      [
        "6. Live Ops Wallboard, Gantt Scheduler, Conflict Center & W&B",
        "src/routes/_shell.operations.tsx (/operations)",
        "IMPLEMENTED & VERIFIED — Dark-mode Dep/Arr Wallboard, Active Runway selector, Multi-Resource Gantt timeline, Conflict Center override modal, 24h Solo Sign-Off, and Weight & Balance CG Envelope + Runway TODR/LDR Calculator.",
      ],
      [
        "7. 4-Tab CBTA Debriefing Wizard, 8-Axis Radar & Signed Logbook",
        "src/routes/_shell.cbta.tsx (/cbta), src/lib/debrief-persistence.ts",
        "IMPLEMENTED & VERIFIED — Crash-proof SessionStorage buffer (persist:userCustomLecture), 1-5 CBTA maneuver & 8-competency grading, 8-axis SVG Spider Radar Chart, and EASA/DGCA Dual Signed Electronic Logbook PDF export.",
      ],
      [
        "8. Automated Customer Invoicing (ACI) & Indian GST Suite",
        "src/routes/_shell.invoicing.tsx (/invoicing), generateInvoiceFromUnbilled()",
        "IMPLEMENTED & VERIFIED — Unbilled flight queue, customer retainer balances, SAC 999293/996751 CGST/SGST/IGST tax invoice generator, downloadable GST Invoice PDF, and Stripe/Retainer settlement.",
      ],
      [
        "9. ICAO Doc 9859 Safety Management System (SMS) 5x5 Portal",
        "src/routes/_shell.sms.tsx (/sms), classifySmsRisk()",
        "IMPLEMENTED & VERIFIED — Interactive 5x5 Severity (1-5) x Likelihood (A-E) risk matrix heatmap, Red/Amber/Green classification, confidential Just Culture reporting, and CAPA workflow.",
      ],
      [
        "10. Global Pilot Hub (/my-hub) & CAMO Squawk / CRS Tech Log",
        "src/routes/_shell.my-hub.tsx (/my-hub), src/routes/_shell.fleet.tsx (/fleet)",
        "IMPLEMENTED & VERIFIED — Multi-tenant organization switcher, certificate expiry vault, FIDO2 WebAuthn passkey enrollment, Pilot Squawk Sheet, and CAMO Certificate of Release to Service (CRS) sign-off.",
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: colors.emerald,
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 6.8,
      textColor: colors.slate,
      cellPadding: 1.35,
    },
    columnStyles: {
      0: { cellWidth: 44, fontStyle: "bold" },
      1: { cellWidth: 52 },
      2: { cellWidth: 86 },
    },
  });

  y = (doc.lastAutoTable?.finalY ?? y) + 5;

  drawSubHeading(
    "4.B — What Is Still Missing (External Production Hardware, Live Gateways & Phase-2 Extensions)",
    colors.amber
  );

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [
      [
        "Remaining External Item",
        "Current In-App State",
        "What Is Needed for Live Production Deployment",
      ],
    ],
    body: [
      [
        "1. Live Hardware ADS-B / SpiderTracks Feed",
        "processAdsbTelemetryUpdate() engine & interactive Touchdown Simulator active in /operations",
        "Connect a live ADS-B Exchange / FlightAware / SpiderTracks webhook secret key to stream physical aircraft GPS groundspeed packets into processAdsbTelemetryUpdate().",
      ],
      [
        "2. Live Stripe Merchant Secret Key & Webhook",
        "Full ACI GST invoicing, retainer ledger & PaymentIntent simulation active in /invoicing",
        "Configure production STRIPE_SECRET_KEY and webhook endpoint to process live credit card / UPI charges in addition to academy retainer deductions.",
      ],
      [
        "3. Live SendGrid / Twilio SMS & Email Gateways",
        "In-app real-time Notification Bell, audio chime & priority feed active across all roles",
        "Configure SENDGRID_API_KEY and TWILIO_AUTH_TOKEN to dispatch external SMS/email copies of slot alerts and certificate expiry warnings.",
      ],
      [
        "4. Garmin G1000 SD-Card CSV FOQA Parser & CAMO Parts Store",
        "Cataloged in Section 3 (Missing in Both Spec & App)",
        "Optional Phase-2 avionics telemetry CSV uploader (1Hz G1000 flight path replay) and physical spare-parts / tool calibration warehouse barcodes.",
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: colors.amber,
      textColor: [255, 255, 255],
      fontSize: 7.4,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 6.8,
      textColor: colors.slate,
      cellPadding: 1.3,
    },
    columnStyles: {
      0: { cellWidth: 44, fontStyle: "bold" },
      1: { cellWidth: 52 },
      2: { cellWidth: 86 },
    },
  });

  // =========================================================================
  // PAGE NUMBERS & FOOTER ON ALL PAGES
  // =========================================================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(colors.muted[0], colors.muted[1], colors.muted[2]);
    doc.text(
      "SilverArrows Aviation Academy  •  FlightLogger REA Architecture, Implementation & Verification Report",
      margin,
      pageHeight - 7.5
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 7.5,
      { align: "right" }
    );
  }

  return doc;
}

export function downloadDifferenceReportPdf(): void {
  const doc = buildDifferenceReportPdf();
  doc.save(DIFFERENCE_REPORT_FILENAME);
}
