---
name: flysilverarrows-backend-preflight-gating
description: >-
  Pre-flight dispatch gating engine, EASA Part-MED medical validation, 90-day 3-landing passenger currency,
  airframe maintenance hour limits, and crew rest verification for FlightLogger / FlySilverArrows backend.
---

# FlySilverArrows Pre-Flight Dispatch Gating Engine

## 1. Domain & Problem Statement
In civil aviation operations, dispatching a flight with an expired medical, an uncertified pilot, or an airframe that overruns its mandatory 50-hour inspection invalidates insurance coverage and breaches aviation law.

The Pre-Flight Gating Engine acts as an automated regulatory gatekeeper. Before any booking can transition from `draft` to `scheduled` or be dispatched, it audits seven discrete gating conditions simultaneously.

```
                  Booking Reservation Request
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
   ┌────────▼────────┐ ┌───────▼────────┐ ┌───────▼────────┐
   │ Gate 1: Medical │ │ Gate 2: Currency│ │ Gate 3: Rating │
   │ Class 1/2 Valid?│ │ 90-Day 3-Landing│ │ Endorsement?  │
   └────────┬────────┘ └───────┬────────┘ └───────┬────────┘
            │                  │                  │
            ├──────────────────┼──────────────────┤
            │                  │                  │
   ┌────────▼────────┐ ┌───────▼────────┐ ┌───────▼────────┐
   │ Gate 4: Airframe│ │ Gate 5: FTL    │ │ Gate 6: Overlap│
   │ Maint Countdown?│ │ Rest & Ceilings│ │ GiST Range Lock│
   └────────┬────────┘ └───────┬────────┘ └───────┬────────┘
            │                  │                  │
            └──────────────────┼──────────────────┘
                               │
                    All 7 Gates Validated?
                               │
             ┌─────────────────┴─────────────────┐
             │                                   │
          [YES]                                [NO]
             │                                   │
      Booking Confirmed                   Booking Blocked
     & Resources Locked                  & Warning Emitted
```

---

## 2. The 7 Gating Conditions & Algorithms

### Gate 1: Medical Certificate Currency (EASA Part-MED)
- **Check:** `user_certificates.expires_at >= booking.end_time` where `certificate_type_id IN ('medical_class_1', 'medical_class_2')`.
- **Failure Code:** `medical_expired`.
- **Resolution:** Blocks solo student, renter, or PIC dispatch until updated medical scan is verified.

### Gate 2: 90-Day 3-Landing Passenger Currency (EASA FCL.060)
- **Requirement:** For flights carrying passengers or commercial operations, the pilot must have executed at least 3 takeoffs and 3 landings in the preceding 90 days on the same class/type.
- **Algorithm:**
  $$\sum_{i=1}^{n} (\text{landings.day\_landings} + \text{landings.night\_landings}) \ge 3 \quad \text{where} \quad \text{flight\_date} \ge (\text{booking.start\_time} - 90\text{ days})$$
- **Failure Code:** `passenger_currency_lapsed`.

### Gate 3: Night Flying Currency (EASA FCL.060.b.2)
- **Requirement:** If booking interval spans official night (civil twilight $+ 30$ mins to dawn $- 30$ mins), pilot must have executed at least 1 night landing in preceding 90 days.
- **Failure Code:** `night_currency_lapsed`.

### Gate 4: Aircraft Type & Class Rating Endorsement
- **Requirement:** Pilot must hold active rating for the aircraft model's class (`SEP_LAND`, `MEP_LAND`).
- **Failure Code:** `class_rating_missing`.

### Gate 5: Airframe Maintenance Countdown Coverage
- **Requirement:** For all active inspection countdowns on the airframe:
  $$\text{hours\_left} \ge \frac{\text{booking.end\_time} - \text{booking.start\_time}}{3600}$$
- **Failure Code:** `maintenance_overrun_prevented`.

### Gate 6: Crew FTL Rest & Rolling Duty Compliance
- **Requirement:** Verify `booking.start_time >= crew.mandatory_rest_until` and projected flight time does not breach 7-day (60h) or 28-day (190h) limits.
- **Failure Code:** `rest_period_violation`.

### Gate 7: Student Solo Endorsement
- **Requirement:** If `lesson_type = 'solo_flight'`, verifies instructor authorization has been digitally logged within preceding 24 hours.
- **Failure Code:** `solo_endorsement_missing`.

---

## 3. PostgreSQL PL/pgSQL Gating Function

```sql
CREATE OR REPLACE FUNCTION fn_validate_preflight_gating(
  p_aircraft_id UUID,
  p_instructor_id UUID,
  p_student_id UUID,
  p_start_time TIMESTAMPTZ,
  p_end_time TIMESTAMPTZ,
  p_is_solo BOOLEAN DEFAULT FALSE
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_duration_hours DECIMAL;
  v_conflicts JSONB := '[]'::jsonb;
  v_maint RECORD;
  v_landings_count INT;
  v_rest_until TIMESTAMPTZ;
  v_medical_expires DATE;
BEGIN
  v_duration_hours := EXTRACT(EPOCH FROM (p_end_time - p_start_time)) / 3600.0;

  -- 1. Check Aircraft Airworthiness & Maintenance Hours
  IF EXISTS (SELECT 1 FROM aircraft WHERE id = p_aircraft_id AND status = 'grounded') THEN
    v_conflicts := v_conflicts || jsonb_build_object('code', 'aircraft_grounded', 'message', 'Aircraft is administratively grounded');
  END IF;

  FOR v_maint IN SELECT * FROM maintenance_requirements WHERE aircraft_id = p_aircraft_id AND is_critical LOOP
    IF v_maint.hours_left < v_duration_hours THEN
      v_conflicts := v_conflicts || jsonb_build_object(
        'code', 'maintenance_overrun',
        'message', format('Inspection %s due in %s hours; flight duration is %s hours', v_maint.title, v_maint.hours_left, v_duration_hours)
      );
    END IF;
  END LOOP;

  -- 2. Check Student/Pilot Medical Validity
  SELECT expires_at INTO v_medical_expires 
  FROM user_certificates 
  WHERE user_id = p_student_id AND certificate_type_id IN ('medical_class_1', 'medical_class_2')
  ORDER BY expires_at DESC LIMIT 1;

  IF v_medical_expires IS NULL OR v_medical_expires < p_start_time::date THEN
    v_conflicts := v_conflicts || jsonb_build_object('code', 'medical_expired', 'message', 'Pilot Medical Certificate is expired or missing');
  END IF;

  -- 3. Check 90-Day 3-Landing Currency (if solo or rental)
  IF p_is_solo OR p_instructor_id IS NULL THEN
    SELECT COALESCE(SUM(day_landings_count + night_landings_count), 0) INTO v_landings_count
    FROM electronic_logbook_entries
    WHERE user_id = p_student_id AND flight_date >= (p_start_time::date - INTERVAL '90 days');

    IF v_landings_count < 3 THEN
      v_conflicts := v_conflicts || jsonb_build_object('code', 'passenger_currency_lapsed', 'message', 'Pilot has fewer than 3 landings in the preceding 90 days');
    END IF;
  END IF;

  -- 4. Check Instructor Rest Period Compliance
  IF p_instructor_id IS NOT NULL THEN
    SELECT mandatory_rest_until INTO v_rest_until
    FROM duty_records
    WHERE user_id = p_instructor_id AND mandatory_rest_until IS NOT NULL
    ORDER BY duty_end_time DESC LIMIT 1;

    IF v_rest_until IS NOT NULL AND p_start_time < v_rest_until THEN
      v_conflicts := v_conflicts || jsonb_build_object('code', 'mandatory_rest_violation', 'message', format('Instructor is in mandatory rest until %s', v_rest_until));
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'is_dispatchable', (jsonb_array_length(v_conflicts) = 0),
    'conflict_count', jsonb_array_length(v_conflicts),
    'conflicts', v_conflicts
  );
END;
$$;
```
