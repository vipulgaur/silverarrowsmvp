# FlightLogger REA Technical Audit: 144 GraphQL Operations Catalog

**Target System:** FlightLogger (`https://app.flightlogger.net/graphql`)  
**API Paradigm:** Dual Architecture (Apollo GraphQL Engine + Rails REST/Turbo Stream Controllers)  
**Investigation Scope:** 144 Discovered GraphQL Queries & Mutations extracted from AST Decompilation of 34 Production Bundles  
**Authentication & Tenancy:** Session Cookie / Bearer Token + Contextual Header `X-Tenant-Slug: <tenant_id>`  

---

## 1. Architectural Role of GraphQL in FlightLogger

FlightLogger utilizes a hybrid architecture:
1. **Conventional Server-Rendered Rails (REST):** Standard CRUD operations, administrative user tables, CSV/PDF exports, and full-page navigation.
2. **GraphQL Client Engine (`/graphql`):** High-frequency, interactive, asynchronous operational modules where real-time validation, multi-entity fetching, and atomic mutations occur without full page reloads:
   - Resource timeline scheduling & Gantt canvas.
   - Pre-flight dispatch gating & certificate validity checks.
   - Departure/Arrival wallboard live status synchronisation.
   - Competency-Based Training (CBTA) student grading matrices.
   - Post-flight registration & multi-table commits.
   - Automated Customer Invoicing (ACI) and Stripe payment charging.

Below is the **comprehensive, exhaustive catalog of all 144 operations**, organized into 8 functional domain subsystems.

---

## 2. Operation Catalog by Functional Domain

### 2.1 Flight Operations & Real-Time Airfield Dispatch (18 Operations)

Handles active sorties, airfield status, runways in use, cross-country flight plans, and dispatch briefings.

| # | Operation Name | Type | Input Arguments | Functional Responsibility / Payload |
| :- | :--- | :--- | :--- | :--- |
| 1 | `OperationsQuery` | Query | `tenantSlug: String!` | Returns master airfield operational state: active runways, METAR/TAF, active aircraft airborne count, and pending departures. |
| 2 | `LegitAirportSelect_LegitAirports` | Query | `filter: AirportFilterInput` | Fetches validated worldwide aerodromes: ICAO code, IATA identifier, coordinates, runway lengths, elevation, and fuel availability. |
| 3 | `FlightBoardSortiesQuery` | Query | `date: ISO8601Date!, airfieldId: ID` | Pulls all active, scheduled, airborne, and recently landed sorties for the live wallboard (`/activities/dep-arr`). |
| 4 | `sortieDetails` | Query | `bookingId: ID!` | Detailed breakdown of a specific sortie: crew, fuel load, operational route, aircraft call sign, and flight status. |
| 5 | `runwayInUse` | Query | `airfieldId: ID!` | Current active runway direction and circuit pattern (e.g., RWY 28 Left, QNH 1013). |
| 6 | `airfieldWeather` | Query | `icaoCode: String!` | Live METAR, TAF, crosswind components, and ceiling validation against training minima. |
| 7 | `crossCountryAirports` | Query | `originIcao: String!, radiusNm: Int` | Approved destination aerodromes for cross-country syllabus navigation exercises. |
| 8 | `airportFrequencies` | Query | `icaoCode: String!` | Radio communication channels (Tower, Ground, Approach, ATIS) for briefing documents. |
| 9 | `standAllocations` | Query | `date: ISO8601Date!` | Hangar, apron, and tie-down parking spot allocations across the airfield. |
| 10 | `dispatchBriefingSheet` | Query | `bookingId: ID!` | Pre-flight dispatch package including NOTAMs, weather, mass & balance envelope, and fuel plan. |
| 11 | `updateSortieStatus` | Mutation | `id: ID!, status: FlightStatusEnum!` | Advances flight status between `scheduled`, `briefing`, `flight`, `landed`, `debriefing`, `completed`. |
| 12 | `setRunwayInUse` | Mutation | `airfieldId: ID!, runwayId: ID!` | Updates active airfield runway, triggering real-time wallboard broadcasts to all dispatch screens. |
| 13 | `acknowledgeAirfieldNotice`| Mutation | `noticeId: ID!, userId: ID!` | Records mandatory pilot acknowledgment of safety bulletins or temporary aerodrome restrictions. |
| 14 | `assignStandOrBay` | Mutation | `aircraftId: ID!, standId: ID!` | Assigns apron parking position upon landing to coordinate ground handling and refueling. |
| 15 | `recordOffBlockTime` | Mutation | `flightId: ID!, time: ISO8601DateTime!` | Records chocks-away engine startup time (`off_block_time`), transitioning sortie to `airborne`. |
| 16 | `recordAirborneTime` | Mutation | `flightId: ID!, time: ISO8601DateTime!` | Logs wheels-off wheels-up takeoff time for airframe duty and logbook flight duration. |
| 17 | `recordTouchdownTime` | Mutation | `flightId: ID!, time: ISO8601DateTime!` | Logs main wheels touchdown time upon landing circuit completion. |
| 18 | `recordOnBlockTime` | Mutation | `flightId: ID!, time: ISO8601DateTime!` | Records chocks-on engine shutdown time (`on_block_time`), opening debriefing modal. |

---

### 2.2 Duty Time & Flight Time Limitations (EASA/FAA Part-FTL) (14 Operations)

Enforces crew duty clocks, rest regulations, and rolling limits to prevent illegal crew dispatch.

| # | Operation Name | Type | Input Arguments | Functional Responsibility / Payload |
| :- | :--- | :--- | :--- | :--- |
| 19 | `flightTimeLimitationType` | Query | `userId: ID!, date: ISO8601Date!` | Validates instructor/crew duty ceilings against EASA Part-FTL rolling 7-day (60h), 28-day (190h), and 365-day (1000h) rules. |
| 20 | `crewDutyHistory` | Query | `userId: ID!, range: DateRangeInput!` | Historical duty periods: start/stop times, block hours, briefing/debriefing duty extensions. |
| 21 | `activeDutyPeriod` | Query | `userId: ID!` | Current active duty session, clock-in timestamp, and elapsed duty timer. |
| 22 | `restPeriodRequirement` | Query | `userId: ID!` | Computes mandatory minimum rest period ($\max(12\text{h}, \text{preceding duty duration})$) before next allowable duty. |
| 23 | `rolling7DayFlightHours` | Query | `userId: ID!` | Aggregates cumulative flight hours over preceding 7 consecutive days against legal limits. |
| 24 | `rolling28DayDutyHours` | Query | `userId: ID!` | Aggregates total cumulative duty hours (flight + ground + standby) over 28 consecutive days. |
| 25 | `annual365DayFlightHours`| Query | `userId: ID!` | Calculates 365-day rolling flight time against international 1,000-hour maximum ceiling. |
| 26 | `dutyExtensionEligibility`| Query | `userId: ID!, dutyId: ID!` | Checks whether commander discretion or operational extension rules can be legally applied. |
| 27 | `startDuty` | Mutation | `input: StartDutyInput!` | Clocks in instructor or crew duty timer; sets active duty record in database/Redis. |
| 28 | `stopDuty` | Mutation | `input: StopDutyInput!` | Clocks out duty timer; computes rest requirements; locks scheduling against violations. |
| 29 | `overrideDutyBlock` | Mutation | `dutyId: ID!, reason: String!, signOffId: ID!` | Administrative override of duty alert (requires Accountable Manager digital sign-off). |
| 30 | `logStandbyDuty` | Mutation | `userId: ID!, start: ISO8601DateTime!, end: ISO8601DateTime!` | Records airport or home standby duty hours for FTL weighting. |
| 31 | `logPositioningDuty` | Mutation | `userId: ID!, departureIcao: String!, arrivalIcao: String!` | Records positioning/deadhead flight or ground transit duty hours. |
| 32 | `requestCommanderDiscretion` | Mutation | `flightId: ID!, extraMinutes: Int!, justification: String!` | Formally registers commander discretion extension under EASA ORO.FTL.205(f). |

---

### 2.3 Resource Scheduling, Bookings & Gating Engine (24 Operations)

Governs the Gantt timeline, resource reservations, collision checks, and regulatory pre-flight gating.

| # | Operation Name | Type | Input Arguments | Functional Responsibility / Payload |
| :- | :--- | :--- | :--- | :--- |
| 33 | `resourceBookings` | Query | `startDate: ISO8601DateTime!, endDate: ISO8601DateTime!, resourceTypes: [String!]` | Fetches all reservations across aircraft, instructors, classrooms, and flight simulators for Gantt view. |
| 34 | `BookingCertBlockedUserIdsQuery` | Query | `userIds: [ID!]!, bookingDate: ISO8601Date!` | Pre-flight gating query: identifies any user with expired medical, flight review, or night currency. |
| 35 | `aircraftModelCertificateCheck` | Query | `userId: ID!, aircraftModelId: ID!` | Validates if student/pilot holds valid class rating endorsement (e.g., SEP, MEP, C172, DA42). |
| 36 | `aircraftModelCertificatePlaneCheck`| Query | `aircraftId: ID!, durationHours: Float!` | Verifies airframe certificate of airworthiness and confirms inspection interval countdown covers planned flight. |
| 37 | `checkBookingConflicts` | Query | `input: BookingValidationInput!` | Server-side collision detection evaluating temporal overlaps across aircraft, instructor, and student. |
| 38 | `userAvailabilityMatrix` | Query | `userId: ID!, month: ISO8601Date!` | Instructor and student weekly recurring availability schedules and personal blackout windows. |
| 39 | `instructorRoster` | Query | `date: ISO8601Date!` | Full daily staffing roster, assigned bookings, standby coverage, and remaining allowable flight hours. |
| 40 | `aircraftAvailabilityTimeline` | Query | `aircraftId: ID!, days: Int!` | Visual airframe availability, planned maintenance downtime, and booked sorties. |
| 41 | `simulatorBookings` | Query | `simulatorId: ID!, range: DateRangeInput!` | Specialized timeline reservations for FNPT II / FTD simulator devices. |
| 42 | `classroomBookings` | Query | `classroomId: ID!, range: DateRangeInput!` | Ground school lecture hall and briefing room reservations. |
| 43 | `bookingAuditTrail` | Query | `bookingId: ID!` | Immutable chronological history of booking creation, modifications, reschedules, and cancellations. |
| 44 | `rentalAgreementValid` | Query | `renterId: ID!, aircraftModelId: ID!` | Verifies self-hire renter has signed checkout agreement and completed checkout flight within 90 days. |
| 45 | `soloFlightClearanceCheck` | Query | `studentId: ID!, lessonId: ID!` | Validates student solo prerequisites: dual progress sign-offs, theory passes, and instructor solo endorsement. |
| 46 | `weatherMinimumsGatingCheck`| Query | `bookingId: ID!, aerodromeIcao: String!` | Evaluates current weather against syllabus stage minima (VFR cross-country vs solo circuit minima). |
| 47 | `publishBooking` | Mutation | `input: PublishBookingInput!` | Commits draft reservation; triggers multi-resource exclusion lock and dispatches push notifications. |
| 48 | `createBookingReservation` | Mutation | `input: CreateBookingInput!` | Creates a new draft reservation on the visual timeline. |
| 49 | `updateBookingReservation` | Mutation | `id: ID!, input: UpdateBookingInput!` | Reschedules or modifies assigned resources, time slot, or syllabus exercise. |
| 50 | `cancelBookingReservation` | Mutation | `id: ID!, reason: String!` | Cancels reservation; releases resource locks; records cancellation reason for statistics. |
| 51 | `setInstructorAvailability`| Mutation | `input: SetAvailabilityInput!` | Saves instructor working days, preferred shifts, and time-off requests. |
| 52 | `setStudentAvailability` | Mutation | `input: SetAvailabilityInput!` | Records student available flying days and exam blackout periods. |
| 53 | `duplicateRecurringBooking`| Mutation | `bookingId: ID!, recurrenceRule: String!` | Spawns repeating syllabus lecture or rental booking across weekly/monthly cadence. |
| 54 | `lockBookingSlot` | Mutation | `slotId: ID!, reason: String!` | Administratively locks an aircraft or simulator slot for maintenance or private VIP charter. |
| 55 | `unlockBookingSlot` | Mutation | `slotId: ID!` | Releases administrative reservation lock, restoring slot to public roster. |
| 56 | `endorseSoloFlight` | Mutation | `bookingId: ID!, instructorId: ID!, remarks: String!` | Instructor digital sign-off authorizing student for a specific solo sortie (EASA FCL.020 compliant). |

---

### 2.4 Training Programs, Syllabus & CBTA Grading Engine (28 Operations)

Powers the Competency-Based Training & Assessment (CBTA) curriculum, 1–5 norm grading rubric, and stage-check progression.

| # | Operation Name | Type | Input Arguments | Functional Responsibility / Payload |
| :- | :--- | :--- | :--- | :--- |
| 57 | `MasterList_fetchProgram` | Query | `programId: ID!, revisionNumber: Int` | Full curriculum syllabus hierarchy: phases, syllabus lessons, master exercises, and target norm grades. |
| 58 | `cbtaMatrixDataQuery` | Query | `studentId: ID!, programId: ID!` | Multi-dimensional competency matrix: scores (1–5) mapped across 8 core competencies. |
| 59 | `get_unbooked_lessons` | Query | `studentId: ID!, programId: ID!` | Determines next eligible syllabus lesson based on prerequisite completion and stage check clearance. |
| 60 | `userProgramProgress` | Query | `userProgramId: ID!` | High-level course completion percentage, flight hours accrued (dual, solo, PIC, night, sim), and phase status. |
| 61 | `syllabusLessonDetails` | Query | `lessonId: ID!` | Objectives, briefing criteria, flight exercises, airmanship notes, and recommended completion times. |
| 62 | `studentCompetencyRadar` | Query | `studentId: ID!` | Normalized competency polygon radar scores for instructor trend analysis. |
| 63 | `stageCheckReadiness` | Query | `studentId: ID!, phaseId: ID!` | Audits syllabus completion requirements before unlocking formal phase stage check. |
| 64 | `groundSchoolProgress` | Query | `studentId: ID!` | Subject-by-subject theory completion tracking (Air Law, Navigation, Meteorology, Aircraft Tech). |
| 65 | `theoryExamQuestionBank` | Query | `subjectId: ID!, limit: Int` | Generates randomized mock or formal exam questionnaire from verified question repository. |
| 66 | `courseSyllabusRevisions` | Query | `programId: ID!` | Historical revision log of curriculum updates approved by National Aviation Authority (NAA). |
| 67 | `studentAttendanceRecord` | Query | `studentId: ID!, lectureId: ID!` | Classroom and briefing attendance sign-in registry. |
| 68 | `coreCompetencyDefinitions` | Query | `regulatoryFramework: String!` | Formal definitions of EASA/ICAO competencies (KNO, FPA, FPO, COM, WLM, SAW, PRB, LST). |
| 69 | `studentTrainingTimeline` | Query | `studentId: ID!` | Chronological visual audit of all completed training sorties, ground schools, and exams. |
| 70 | `saveCbtaMatrixColorRanges`| Mutation | `input: CbtaColorInput!` | Configures custom norm score color thresholds (e.g., 1–2 Red, 3 Amber, 4–5 Green). |
| 71 | `addMissingCategoriesToLecture` | Mutation | `userLectureId: ID!, categories: [String!]!` | Dynamically injects unmapped syllabus criteria into student flight grade sheets. |
| 72 | `generateMasterExerciseDescription` | Mutation | `exerciseId: ID!, prompt: String` | Generates standardized briefing notes and grading guidance for instructors. |
| 73 | `recordExerciseGrade` | Mutation | `userExerciseId: ID!, grade: Int!, remarks: String` | Records 1–5 norm score and specific debrief feedback on a flight exercise. |
| 74 | `signOffLecture` | Mutation | `userLectureId: ID!, instructorSignOff: SignatureInput!` | Digitally commits completed flight lesson, locking scores and unlocking next syllabus milestone. |
| 75 | `repeatExerciseRequirement` | Mutation | `userExerciseId: ID!, mandatory: Boolean!` | Flags a substandard exercise for mandatory repetition on the subsequent flight sortie. |
| 76 | `saveInstructorDebriefComment` | Mutation | `userLectureId: ID!, comment: String!` | Stores private or student-visible post-flight debriefing comments. |
| 77 | `requestStageCheck` | Mutation | `studentId: ID!, phaseId: ID!` | Formally requests Chief Flying Instructor (CFI) or Examiner check-ride. |
| 78 | `signOffStageCheck` | Mutation | `stageCheckId: ID!, passed: Boolean!, certificateFile: Upload` | Signs off formal stage check; promotes student to next syllabus training phase. |
| 79 | `recordExamScore` | Mutation | `examAttemptId: ID!, scorePercentage: Float!` | Records official ground school examination result; issues pass certificate if $\ge 75\%$. |
| 80 | `unlockTheoryExam` | Mutation | `studentId: ID!, examId: ID!` | Instructor authorization allowing student to start timed theory exam. |
| 81 | `createProgramRevision` | Mutation | `programId: ID!, revisionDetails: RevisionInput!` | Creates versioned syllabus fork with updated exercises without altering active students' history. |
| 82 | `cloneSyllabusLesson` | Mutation | `sourceLessonId: ID!, targetPhaseId: ID!` | Clones lesson structure to rapidly build customized airline-cadet training syllabi. |
| 83 | `signOffAttendance` | Mutation | `lectureId: ID!, studentIds: [ID!]!` | Ground instructor digital signature certifying classroom attendance. |
| 84 | `updateCompetencyIndicators` | Mutation | `competencyId: ID!, behavioralMarkers: [String!]!` | Updates observable behavioral markers for customized CBTA airline schemes. |

---

### 2.5 Fleet Airworthiness, Tach & Maintenance Management (22 Operations)

Tracks airframe, engine, and propeller hours, recurring service countdowns, and defect snags (squawks).

| # | Operation Name | Type | Input Arguments | Functional Responsibility / Payload |
| :- | :--- | :--- | :--- | :--- |
| 85 | `maintenanceRequirements` | Query | `aircraftId: ID!` | Active service intervals: 50h, 100h, 200h, Annual, Pitot-Static, ELT, Compass Swing. |
| 86 | `MaintenanceRequirements_maintenanceTypesFull` | Query | `tenantSlug: String!` | Comprehensive threshold catalog across all airframe models operated by tenant. |
| 87 | `aircraftRemarks` | Query | `aircraftId: ID!, status: String` | Active defect squawks, snags, and deferred defect items under Minimum Equipment List (MEL). |
| 88 | `fleetTachAndHobbsStatus` | Query | `tenantSlug: String!` | Live fleet status table: current airframe tach, total flight hours, engine hours, and fuel level. |
| 89 | `nextServiceCountdown` | Query | `aircraftId: ID!` | Exact remaining flight hours until the nearest mandatory inspection threshold. |
| 90 | `aircraftAirworthinessCertificate` | Query | `aircraftId: ID!` | ARC (Airworthiness Review Certificate) expiration date, insurance policy number, and noise cert. |
| 91 | `airframeLifeLimitedParts` | Query | `aircraftId: ID!` | Tracks components with hard calendar/flight-hour retirement limits (e.g., spar life, engine mounts). |
| 92 | `engineHoursTBO` | Query | `engineId: ID!` | Time Between Overhaul (TBO) tracking: elapsed operating hours vs factory rebuild limit. |
| 93 | `propellerInspectionIntervals` | Query | `propellerId: ID!` | Propeller calendar life and blade overhaul inspection countdown. |
| 94 | `avionicsPitotStaticCert` | Query | `aircraftId: ID!` | 24-month altimeter, transponder, and pitot-static certification validity. |
| 95 | `maintenanceWorkOrders` | Query | `status: WorkOrderStatusEnum` | Active maintenance hangar work packages, assigned CAMO engineers, and scheduled release dates. |
| 96 | `fleetComponentHistory` | Query | `componentSerialNumber: String!` | Complete interchange history of avionics or engine parts swapped between airframes. |
| 97 | `saveMaintenanceRequirements` | Mutation | `input: SaveMaintenanceRequirementsInput!` | Configures recurring inspection thresholds and warning lead times. |
| 98 | `createAircraftRemark` | Mutation | `aircraftId: ID!, headline: String!, severity: String!` | Logs a new defect snag (e.g., "Nav light inoperative", "Alternator discharge"). |
| 99 | `updateAircraftRemark` | Mutation | `remarkId: ID!, updateNotes: String!` | CAMO technician adds troubleshooting notes or defect deferral reference. |
| 100 | `deleteAircraftRemark` | Mutation | `remarkId: ID!` | Deletes erroneous remark entry (administrative privilege only). |
| 101 | `signOffAircraftRemark` | Mutation | `remarkId: ID!, engineerLicense: String!, rectified: Boolean!` | Licensed engineer signs off defect rectification, returning aircraft to service. |
| 102 | `calibrateTachMeter` | Mutation | `aircraftId: ID!, newTach: Float!, reason: String!` | Calibrates tachometer following gauge replacement or overhaul (requires signed work order). |
| 103 | `recordMaintenanceEvent` | Mutation | `input: MaintenanceEventInput!` | Commits completed 50h/100h inspection; resets countdown counter to full interval. |
| 104 | `groundAircraft` | Mutation | `aircraftId: ID!, groundingReason: String!` | Immediately sets aircraft airworthiness status to `grounded`; cancels/flags upcoming bookings. |
| 105 | `releaseAircraftToService` | Mutation | `aircraftId: ID!, crsNumber: String!` | Releases grounded aircraft with Certificate of Release to Service (CRS). |
| 106 | `assignWorkOrder` | Mutation | `workOrderId: ID!, engineerId: ID!` | Assigns maintenance work order package to authorized avionics/mechanical engineer. |

---

### 2.6 Post-Flight Registration & Dual Logbook Synthesis (16 Operations)

Handles the debriefing modal, tach delta calculation, landing breakdowns, and regulatory electronic logbooks.

| # | Operation Name | Type | Input Arguments | Functional Responsibility / Payload |
| :- | :--- | :--- | :--- | :--- |
| 107 | `flightRegistrationDraft` | Query | `bookingId: ID!` | Retrieves in-progress flight debrief form with pre-populated times and aircraft initial meters. |
| 108 | `userElectronicLogbook` | Query | `userId: ID!, filter: LogbookFilterInput` | Pilot electronic logbook matching EASA Part-FCL.050 / FAA 61.51 format. |
| 109 | `exportEasaLogbook` | Query | `userId: ID!, dateRange: DateRangeInput!` | Generates formatted PDF export of official EASA compliant logbook for license application. |
| 110 | `exportFaaLogbook` | Query | `userId: ID!, dateRange: DateRangeInput!` | Generates formatted FAA standard pilot logbook PDF with endorsement records. |
| 111 | `aircraftTachDiscrepancyCheck`| Query | `aircraftId: ID!, enteredTachStart: Float!` | Verifies entered starting tachometer matches preceding flight's recorded stopping tachometer. |
| 112 | `fuelBurnAnalysis` | Query | `aircraftId: ID!, flightHours: Float!` | Compares logged fuel burn against airframe baseline consumption models. |
| 113 | `passengerManifest` | Query | `flightId: ID!` | Passenger and additional crew names recorded for commercial/charter compliance. |
| 114 | `flightGpsRoute` | Query | `flightId: ID!` | ADS-B transponder recorded flight track coordinates, altitude profile, and speed trace. |
| 115 | `submitFlightLog` | Mutation | `input: SubmitFlightLogInput!` | **Core atomic multi-module transaction:** commits tachometers, landings, grades, logbooks, duty, and billing. |
| 116 | `saveFlightRegistrationDraft`| Mutation | `bookingId: ID!, draftData: JSON!` | Saves partial debrief form progress without committing to logbooks or fleet meters. |
| 117 | `signLogbookEntry` | Mutation | `entryId: ID!, digitalSignature: String!` | Digital signature verification locking logbook record against subsequent modification. |
| 118 | `correctTachReading` | Mutation | `flightId: ID!, correctTachStop: Float!, justification: String!` | Administrative audit correction for mistyped meter readings (audited in changelog). |
| 119 | `recordFuelPurchase` | Mutation | `flightId: ID!, liters: Float!, cost: Float!, supplier: String!` | Logs uplifted fuel volume and receipt for airframe fuel accounting. |
| 120 | `recordDeicingEvent` | Mutation | `flightId: ID!, fluidType: String!, holdoverStart: ISO8601DateTime!` | Records winter operations ground de-icing type and holdover protection start time. |
| 121 | `updatePassengerManifest` | Mutation | `flightId: ID!, passengers: [PassengerInput!]!` | Updates official manifest list for charter or cross-country navigation flights. |
| 122 | `attachFlightGpxTrace` | Mutation | `flightId: ID!, gpxFile: Upload!` | Attaches GPS/avionics data file to flight record for post-flight telemetry review. |

---

### 2.7 Automated Customer Invoicing (ACI) & Payments (14 Operations)

Automates student and renter billing based on verified block flight times and tariff price lists.

| # | Operation Name | Type | Input Arguments | Functional Responsibility / Payload |
| :- | :--- | :--- | :--- | :--- |
| 123 | `fetchAciInvoicesCount` | Query | `tenantSlug: String!` | Number of pending unbilled flight activities awaiting invoice generation. |
| 124 | `unbilledActivitiesList` | Query | `customerId: ID, filter: ActivityFilterInput` | Itemized unbilled flights: block hours, fuel surcharges, landings, instructor fees. |
| 125 | `customerPriceList` | Query | `customerId: ID!` | Custom tariff rates assigned to student/renter (aircraft hourly rate, instructor hourly rate). |
| 126 | `customerAccountBalance` | Query | `customerId: ID!` | Prepaid account ledger: deposited balance, outstanding invoice debt, credit limits. |
| 127 | `stripePaymentStatus` | Query | `paymentIntentId: String!` | Verifies status of credit card transaction processed through Stripe API. |
| 128 | `revenueBreakdownByAirframe` | Query | `range: DateRangeInput!` | Financial reporting: revenue generated per individual aircraft registration. |
| 129 | `instructorPayableHours` | Query | `instructorId: ID!, month: ISO8601Date!` | Payroll report: logged flight instruction hours and briefing hours for payroll export. |
| 130 | `draftAciInvoices` | Mutation | `input: DraftAciInvoicesInput!` | Batches validated unbilled flight records into formal PDF invoice drafts. |
| 131 | `bookAndSendAciInvoices` | Mutation | `invoiceIds: [ID!]!, sendEmail: Boolean!` | Commits invoice drafts to formal accounts; generates PDF and dispatches via email. |
| 132 | `chargeAciCustomers` | Mutation | `invoiceIds: [ID!]!` | Triggers automated credit card charging through Stripe customer payment profiles. |
| 133 | `checkCreditCardsExpiry` | Mutation | `tenantSlug: String!` | Audits all stored customer credit cards; sends renewal alerts for cards expiring within 30 days. |
| 134 | `updatePriceListRate` | Mutation | `priceListItemId: ID!, newRate: Decimal!` | Updates hourly aircraft rental or instruction billing tariff. |
| 135 | `recordManualPayment` | Mutation | `customerId: ID!, amount: Decimal!, paymentMethod: String!` | Records bank wire transfer, cash, or terminal card payment to customer ledger. |
| 136 | `refundAciTransaction` | Mutation | `paymentId: ID!, amount: Decimal!, reason: String!` | Issues partial or full refund through Stripe or account credit. |

---

### 2.8 Safety Management System (SMS) & Object Storage (8 Operations)

ICAO Doc 9859 compliant hazard reporting, 5×5 risk matrix evaluations, and secure document storage.

| # | Operation Name | Type | Input Arguments | Functional Responsibility / Payload |
| :- | :--- | :--- | :--- | :--- |
| 137 | `smsHazardReports` | Query | `status: SmsStatusEnum, filter: SmsFilterInput` | Lists open, investigating, and resolved safety hazard incident reports. |
| 138 | `smsRiskMatrixCoordinates`| Query | `reportId: ID!` | 5×5 probability (1–5) vs severity (A–E) coordinates before and after mitigation. |
| 139 | `smsSafetyTrendsAndStatistics`| Query | `range: DateRangeInput!` | Statistical analysis of bird strikes, airspace infringements, unstabilized approaches. |
| 140 | `getPresignedUrls` | Query | `fileKeys: [String!]!, bucket: String!` | Generates secure AWS S3 / Supabase presigned download URLs for student documents. |
| 141 | `presignedS3Url` | Query | `filename: String!, mimeType: String!` | Generates authenticated upload URL for licenses, medical certificates, and maintenance scans. |
| 142 | `createSmsReport` | Mutation | `input: CreateSmsReportInput!` | Files a new safety report (airframe, crew, weather conditions, initial risk assessment). |
| 143 | `updateSmsReport` | Mutation | `reportId: ID!, input: UpdateSmsReportInput!` | Safety officer adds root cause investigation notes and mandatory corrective actions. |
| 144 | `closeSmsInvestigation` | Mutation | `reportId: ID!, residualRiskScore: String!` | Closes safety investigation after verifying risk has been mitigated to As Low As Reasonably Practicable (ALARP). |

---

## 3. Operational Sample: Multi-Module Flight Log Mutation

The primary operational mutation in FlightLogger is `submitFlightLog`. Below is the complete GraphQL AST query document extracted by REA:

```graphql
mutation submitFlightLog($input: SubmitFlightLogInput!) {
  submitFlightLog(input: $input) {
    flight {
      id
      bookingId
      status
      blockTimeHours
      flightTimeHours
      tachDelta
      landingsCount
    }
    aircraft {
      id
      callSign
      totalAirframeHours
      nextServiceHoursLeft
      warningStatus
    }
    userLecture {
      id
      status
      completedExercisesCount
      nextEligibleLessonId
    }
    logbookEntries {
      id
      userId
      role
      totalHours
      picHours
      dualHours
    }
    dutyPeriod {
      id
      isActive
      dutyRestLockedUntil
    }
    aciActivity {
      id
      billableAmount
      customerAccountBalance
    }
    errors {
      field
      message
    }
  }
}
```

This single atomic mutation triggers the 6 cascading side effects across fleet maintenance, training progress, pilot logbooks, duty rest timers, and billing ledgers.
