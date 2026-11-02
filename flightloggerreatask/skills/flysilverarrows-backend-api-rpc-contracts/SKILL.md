---
name: flysilverarrows-backend-api-rpc-contracts
description: >-
  Mapping of FlightLogger's 144 GraphQL operations to PostgreSQL PL/pgSQL stored procedures (RPCs)
  and REST API endpoints with parameter validation and security definer checks for FlySilverArrows backend.
---

# FlySilverArrows 144 Operations Backend RPC & API Contract Mapping

## 1. Architectural Strategy: GraphQL to PostgreSQL RPC

FlightLogger exposes 144 GraphQL queries and mutations. In modern serverless and PostgREST architectures (e.g. Supabase, Fastify with PostgreSQL), routing logic directly into **PostgreSQL `SECURITY DEFINER` stored functions (RPCs)** provides:
1. **Zero-Latency Execution:** Logic runs directly inside the database engine without multiple network round-trips.
2. **ACID Transactional Boundaries:** Complex multi-table writes automatically execute atomically.
3. **Automatic Row-Level Security (RLS):** Queries derive the actor from `auth.uid()`, preventing client parameter spoofing.

---

## 2. Complete Operation-to-RPC Mapping Matrix

Below is the master translation matrix mapping all operation families discovered by REA to PostgreSQL stored procedures:

### 2.1 Flight Operations & Airfield Dispatch (18 Operations)
| GraphQL Operation | Target PostgreSQL RPC Function | Parameters | Core Responsibility |
| :--- | :--- | :--- | :--- |
| `OperationsQuery` | `fn_get_airfield_operations()` | `p_tenant_id UUID` | Returns active runways, airborne sorties count, and airfield METAR. |
| `LegitAirportSelect_LegitAirports`| `fn_get_verified_airports()` | `p_search TEXT` | Queries worldwide aerodromes with ICAO, runway specs, and elevation. |
| `FlightBoardSortiesQuery` | `fn_get_board_sorties()` | `p_tenant_id UUID, p_date DATE`| Retrieves live wallboard sorties with aircraft call signs and crew. |
| `updateSortieStatus` | `fn_transition_booking()` | `p_booking_id UUID, p_status ENUM`| Advances flight through 6-stage operational state machine. |
| `recordTouchdownTime` | `fn_record_touchdown()` | `p_flight_id UUID, p_time TIMESTAMPTZ`| Captures touchdown timestamp; triggers ground crew notification. |

### 2.2 Duty Time & EASA Part-FTL (14 Operations)
| GraphQL Operation | Target PostgreSQL RPC Function | Parameters | Core Responsibility |
| :--- | :--- | :--- | :--- |
| `startDuty` | `fn_start_duty()` | `p_user_id UUID` | Clocks in crew active duty timer in `duty_records`. |
| `stopDuty` | `fn_stop_duty()` | `p_user_id UUID` | Clocks out duty; computes $\max(12\text{h}, \text{duty})$ mandatory rest lock. |
| `flightTimeLimitationType` | `fn_calculate_ftl_status()` | `p_user_id UUID, p_date DATE` | Audits rolling 7-day (60h), 28-day (190h), and 365-day (1000h) limits. |
| `restPeriodRequirement` | `fn_get_required_rest()` | `p_user_id UUID` | Calculates exact timestamp when pilot is next legally dispatchable. |

### 2.3 Resource Scheduling & Gating (24 Operations)
| GraphQL Operation | Target PostgreSQL RPC Function | Parameters | Core Responsibility |
| :--- | :--- | :--- | :--- |
| `resourceBookings` | `fn_get_resource_timeline()` | `p_start TIMESTAMPTZ, p_end TIMESTAMPTZ`| Timeline bookings across aircraft, instructors, simulators. |
| `BookingCertBlockedUserIdsQuery`| `fn_get_blocked_user_ids()` | `p_user_ids UUID[], p_date DATE`| Pre-flight check: returns users with expired medicals or currency. |
| `aircraftModelCertificatePlaneCheck`| `fn_check_airframe_gating()` | `p_aircraft_id UUID, p_duration DECIMAL`| Confirms inspection countdown covers planned flight duration. |
| `publishBooking` | `fn_publish_booking()` | `p_booking_id UUID` | Locks reservation and activates GiST range exclusion constraint. |

### 2.4 Training Programs & CBTA (28 Operations)
| GraphQL Operation | Target PostgreSQL RPC Function | Parameters | Core Responsibility |
| :--- | :--- | :--- | :--- |
| `MasterList_fetchProgram` | `fn_get_program_tree()` | `p_program_id UUID, p_revision INT`| Returns 5-tier syllabus hierarchy: phases, lessons, exercises. |
| `get_unbooked_lessons` | `fn_get_unbooked_lessons()` | `p_student_id UUID, p_program_id UUID`| Determines next eligible syllabus lesson based on completed sorties. |
| `addMissingCategoriesToLecture`| `fn_inject_lecture_exercises()`| `p_lecture_id UUID, p_categories TEXT[]`| Injects unmapped syllabus criteria into student grading sheet. |
| `cbtaMatrixDataQuery` | `fn_get_cbta_matrix()` | `p_student_id UUID` | Returns multi-dimensional competency scores across 8 ICAO markers. |

### 2.5 Fleet Maintenance & Tach (22 Operations)
| GraphQL Operation | Target PostgreSQL RPC Function | Parameters | Core Responsibility |
| :--- | :--- | :--- | :--- |
| `maintenanceRequirements` | `fn_get_aircraft_maintenance()` | `p_aircraft_id UUID` | 50h, 100h, 200h, Annual inspection countdowns. |
| `aircraftRemarks` | `fn_get_aircraft_remarks()` | `p_aircraft_id UUID` | Active squawks, snags, and deferred defect MEL items. |
| `createAircraftRemark` | `fn_create_aircraft_remark()` | `p_aircraft_id UUID, p_headline TEXT`| Logs pilot defect report with severity classification. |
| `deleteAircraftRemark` | `fn_signoff_aircraft_remark()` | `p_remark_id UUID, p_license TEXT` | CAMO engineer signs off defect with Certificate of Release to Service. |

### 2.6 Post-Flight Registration & Dual Logbooks (16 Operations)
| GraphQL Operation | Target PostgreSQL RPC Function | Parameters | Core Responsibility |
| :--- | :--- | :--- | :--- |
| `submitFlightLog` | `fn_register_flight()` | `p_flight_payload JSONB` | **Core 6-Way Atomic Post-Flight Commit Pipeline**. |
| `userElectronicLogbook` | `fn_get_pilot_logbook()` | `p_user_id UUID, p_filter JSONB` | Official EASA Part-FCL.050 / FAA 61.51 logbook rows. |
| `exportEasaLogbook` | `fn_export_easa_logbook_pdf()`| `p_user_id UUID, p_date_range JSONB` | Generates official PDF export for authority license application. |

### 2.7 Automated Customer Invoicing (14 Operations)
| GraphQL Operation | Target PostgreSQL RPC Function | Parameters | Core Responsibility |
| :--- | :--- | :--- | :--- |
| `fetchAciInvoicesCount` | `fn_get_unbilled_activities_count()`| `p_tenant_id UUID` | Pending completed sorties awaiting billing. |
| `draftAciInvoices` | `fn_draft_aci_invoices()` | `p_tenant_id UUID` | Batches unbilled flights into formal invoice headers and items. |
| `chargeAciCustomers` | `fn_charge_aci_invoices()` | `p_invoice_ids UUID[]` | Decrements account balance or triggers Stripe PaymentIntent charge. |

### 2.8 Safety Management System & Storage (8 Operations)
| GraphQL Operation | Target PostgreSQL RPC Function | Parameters | Core Responsibility |
| :--- | :--- | :--- | :--- |
| `smsHazardReports` | `fn_get_sms_reports()` | `p_tenant_id UUID, p_status TEXT` | ICAO Doc 9859 incident registry. |
| `createSmsReport` | `fn_create_sms_report()` | `p_report_payload JSONB` | Files incident with initial 5×5 severity/probability risk score. |
| `getPresignedUrls` | `fn_get_presigned_url()` | `p_file_key TEXT` | Generates expiring authenticated S3 / Supabase storage download URL. |

---

## 3. PostgreSQL Security & Permission Enforcement Pattern

Every PL/pgSQL function must enforce caller identity and tenancy using this boilerplate:

```sql
CREATE OR REPLACE FUNCTION fn_secure_operation_template(p_tenant_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_caller_id UUID;
  v_has_access BOOLEAN;
BEGIN
  -- 1. Extract Caller from JWT Context
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'UNAUTHORIZED: Authentication required';
  END IF;

  -- 2. Verify Tenant Membership
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = v_caller_id AND tenant_id = p_tenant_id AND status = 'active'
  ) INTO v_has_access;

  IF NOT v_has_access THEN
    RAISE EXCEPTION 'FORBIDDEN: User does not belong to specified tenant organization';
  END IF;

  -- 3. Execute Protected Business Logic Here...
  RETURN jsonb_build_object('success', true);
END;
$$;
```
