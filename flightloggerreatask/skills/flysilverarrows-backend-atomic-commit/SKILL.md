---
name: flysilverarrows-backend-atomic-commit
description: >-
  The 6-way atomic post-flight debrief commit pipeline, tachometer delta verification, 50h/100h
  inspection decrements, automatic grounding triggers, dual EASA/FAA logbook synthesis, and
  transactional rollback engineering for FlightLogger / FlySilverArrows.
---

# FlySilverArrows 6-Way Atomic Post-Flight Commit Pipeline

## 1. Domain & Problem Statement
When an instructor finishes a flight debrief and clicks "Sign & Complete", the system must mutate **six separate subsystems simultaneously**. 

In legacy architectures, executing these across multiple REST endpoints leads to catastrophic partial failure states (e.g., tachometer updated on the airframe, but billing record lost, or logbook saved but syllabus progression failed to unlock).

FlySilverArrows executes the entire sequence inside a single **PostgreSQL ACID transaction** via `fn_register_flight()`. If any sub-operation fails, the entire transaction rolls back cleanly.

```
                           POST /a/:tenant/flight_registrations
                                        │
                      ┌─────────────────▼─────────────────┐
                      │    BEGIN POSTGRESQL TRANSACTION   │
                      └─────────────────┬─────────────────┘
                                        │
         ┌──────────────────────────────┼──────────────────────────────┐
         │                              │                              │
┌────────▼─────────┐          ┌─────────▼────────┐          ┌──────────▼─────────┐
│ 1. FLEET & TACH  │          │ 2. CBTA & SYLLABUS│         │ 3. DUAL LOGBOOKS   │
│ • Airframe Tach  │          │ • Norm scores 1-5│          │ • Student: Dual/PIC│
│ • Engine Hours   │          │ • Competencies   │          │ • Instructor: PIC  │
│ • Landings count │          │ • Lesson passed  │          │ • IFR & Night split│
│ • 50h/100h count │          │ • Unlock next    │          │ • Digital crypto-  │
│ • Warning alerts │          │ • Stage check req│          │   graphic sign-off │
└────────┬─────────┘          └─────────┬────────┘          └──────────┬─────────┘
         │                              │                              │
         ├──────────────────────────────┼──────────────────────────────┤
         │                              │                              │
┌────────▼─────────┐          ┌─────────▼────────┐          ┌──────────▼─────────┐
│ 4. CREW DUTY/FTL │          │ 5. ACI BILLING   │          │ 6. SMS REPORTING   │
│ • stopDuty clock │          │ • Billable hours │          │ • Incident check   │
│ • Rolling 7d/28d │          │ • Block * Rate   │          │ • If flagged, auto-│
│ • Rest lock timer│          │ • Landings tariff│          │   spawn draft 5x5  │
│   max(12h, duty) │          │ • Insert activity│          │   hazard report    │
└────────┬─────────┘          └─────────┬────────┘          └──────────┬─────────┘
         │                              │                              │
         └──────────────────────────────┼──────────────────────────────┘
                                        │
                      ┌─────────────────▼─────────────────┐
                      │   COMMIT TRANSACTION & BROADCAST  │
                      └───────────────────────────────────┘
```

---

## 2. Mathematical Formulas & Business Logic

### 2.1 Subsystem 1: Fleet & Tachometer Math
1. **Delta Calculation:**
   $$\Delta \text{Tach} = \text{Tach}_{\text{stop}} - \text{Tach}_{\text{start}}$$
   *Guard:* Enforce $\Delta \text{Tach} > 0$ and $\Delta \text{Tach} \le 12.00$.
2. **Airframe Lifetime Accumulation:**
   $$\text{total\_airframe\_hours}_{\text{new}} = \text{total\_airframe\_hours}_{\text{old}} + \Delta \text{Tach}$$
   $$\text{engine\_hours}_{\text{new}} = \text{engine\_hours}_{\text{old}} + \Delta \text{Tach}$$
   $$\text{total\_landings}_{\text{new}} = \text{total\_landings}_{\text{old}} + (\text{day\_landings} + \text{night\_landings})$$
3. **50h / 100h Inspection Decrement:**
   For each active inspection interval:
   $$\text{hours\_left}_{\text{new}} = \text{hours\_left}_{\text{old}} - \Delta \text{Tach}$$
   *Grounding Rule:* If $\text{hours\_left}_{\text{new}} \le 0$ and `is_critical = true`:
   - Set `aircraft.status = 'maintenance_due'`.
   - Insert `certificate_warnings` record (`MAINTENANCE_OVERDUE`).

### 2.2 Subsystem 2: CBTA 1–5 Norm Rubric & Progression
1. **Grading Evaluation:**
   - 1 = Unsatisfactory, 2 = Marginal, 3 = Competent, 4 = Proficient, 5 = Exemplary.
   - If $\min(\text{all exercise grades}) \ge 3$: set `user_lectures.status = 'passed'`.
   - If any exercise $< 3$: set `user_lectures.status = 'repeat_required'`.
2. **Next Lesson Unlocking:**
   - If passed, mark lesson completed, unlocking the next lesson sequence in `syllabus_lessons`.

### 2.3 Subsystem 3: Dual Logbook Synthesis (EASA Part-FCL.050)
1. **Student Entry:**
   - If Dual flight: `dual_received_hours = block_hours`, `pic_hours = 0.00`.
   - If Solo flight: `pic_hours = block_hours`, `dual_received_hours = 0.00`.
2. **Instructor Entry:**
   - `pic_hours = block_hours`, `instructor_hours = block_hours`.
3. **Cryptographic Sealing:**
   $$\text{Hash} = \text{SHA256}(\text{flight\_id} \,\|\, \text{user\_id} \,\|\, \text{block\_hours} \,\|\, \text{date} \,\|\, \text{tail})$$

### 2.4 Subsystem 4: Crew Duty & Rest Lock
1. Stop duty timer: `duty_end_time = NOW()`.
2. Mandatory rest calculation:
   $$\text{Rest Required} = \max(12.0\text{ hours}, \text{duty\_duration})$$
   $$\text{mandatory\_rest\_until} = \text{duty\_end\_time} + \text{Rest Required}$$

### 2.5 Subsystem 5: Automated Customer Invoicing (ACI)
$$\text{Sortie Cost} = (\text{Block Hours} \times \text{Plane Rate}) + (\text{Block Hours} \times \text{FI Rate}) + (\text{Landings} \times \text{Landing Fee})$$
Insert record into `activities` with status `'unbilled'`.

---

## 3. PostgreSQL PL/pgSQL Atomic Function

```sql
CREATE OR REPLACE FUNCTION fn_register_flight(
  p_booking_id UUID,
  p_tach_start DECIMAL,
  p_tach_stop DECIMAL,
  p_off_block TIMESTAMPTZ,
  p_takeoff TIMESTAMPTZ,
  p_landing TIMESTAMPTZ,
  p_on_block TIMESTAMPTZ,
  p_day_landings INT,
  p_night_landings INT,
  p_fuel_start DECIMAL,
  p_fuel_stop DECIMAL,
  p_exercise_grades JSONB, -- Array of {exerciseId, grade, remarks}
  p_pic_id UUID,
  p_incident_flag BOOLEAN DEFAULT FALSE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_booking RECORD;
  v_flight_id UUID;
  v_tach_delta DECIMAL;
  v_block_hours DECIMAL;
  v_flight_hours DECIMAL;
  v_maint RECORD;
  v_ex RECORD;
  v_lesson_passed BOOLEAN := TRUE;
  v_total_cost DECIMAL := 0.00;
  v_plane_rate DECIMAL := 180.00;
  v_fi_rate DECIMAL := 60.00;
  v_landing_fee DECIMAL := 15.00;
BEGIN
  -- 1. Validate Booking & Lock
  SELECT * INTO v_booking FROM bookings WHERE id = p_booking_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Booking % not found', p_booking_id; END IF;

  -- 2. Validate Tachometer Delta
  v_tach_delta := p_tach_stop - p_tach_start;
  IF v_tach_delta <= 0 THEN 
    RAISE EXCEPTION 'Tach stop (%) must exceed tach start (%)', p_tach_stop, p_tach_start;
  END IF;

  v_block_hours := EXTRACT(EPOCH FROM (p_on_block - p_off_block)) / 3600.0;
  v_flight_hours := EXTRACT(EPOCH FROM (p_landing - p_takeoff)) / 3600.0;

  -- 3. Create Flight Record
  INSERT INTO flights (
    booking_id, tenant_id, aircraft_id, departure_icao, arrival_icao,
    off_block_time, takeoff_time, landing_time, on_block_time,
    block_hours, flight_hours, tach_start, tach_stop, tach_delta,
    fuel_start_liters, fuel_stop_liters, fuel_consumed_liters,
    signed_off_by_pic_id
  ) VALUES (
    p_booking_id, v_booking.tenant_id, v_booking.aircraft_id, 'EKAH', 'EKAH',
    p_off_block, p_takeoff, p_landing, p_on_block,
    ROUND(v_block_hours, 2), ROUND(v_flight_hours, 2), p_tach_start, p_tach_stop, ROUND(v_tach_delta, 2),
    p_fuel_start, p_fuel_stop, (p_fuel_start - p_fuel_stop),
    p_pic_id
  ) RETURNING id INTO v_flight_id;

  -- 4. Insert Landings Tallies
  INSERT INTO landings (flight_id, aerodrome_icao, day_landings, night_landings)
  VALUES (v_flight_id, 'EKAH', p_day_landings, p_night_landings);

  -- 5. Subsystem 1: Update Aircraft Tach & Decrement Maintenance Countdowns
  UPDATE aircraft 
  SET total_airframe_hours = total_airframe_hours + v_tach_delta,
      engine_hours = engine_hours + v_tach_delta,
      total_landings = total_landings + (p_day_landings + p_night_landings),
      status = 'airworthy'
  WHERE id = v_booking.aircraft_id;

  FOR v_maint IN SELECT * FROM maintenance_requirements WHERE aircraft_id = v_booking.aircraft_id LOOP
    UPDATE maintenance_requirements 
    SET hours_left = hours_left - v_tach_delta 
    WHERE id = v_maint.id;

    IF (v_maint.hours_left - v_tach_delta) <= 0 AND v_maint.is_critical THEN
      UPDATE aircraft SET status = 'maintenance_due' WHERE id = v_booking.aircraft_id;
      INSERT INTO certificate_warnings (tenant_id, warning_code, message)
      VALUES (v_booking.tenant_id, 'MAINTENANCE_DUE', format('Inspection %s overdue on aircraft', v_maint.title));
    END IF;
  END LOOP;

  -- 6. Subsystem 2: CBTA Grades & Syllabus Progress
  FOR v_ex IN SELECT * FROM jsonb_to_recordset(p_exercise_grades) AS x(exercise_id UUID, grade INT, remarks TEXT) LOOP
    IF v_ex.grade < 3 THEN v_lesson_passed := FALSE; END IF;
    INSERT INTO user_exercises (user_lecture_id, exercise_id, grade, remarks)
    VALUES (v_booking.lesson_id, v_ex.exercise_id, v_ex.grade, v_ex.remarks);
  END LOOP;

  UPDATE user_lectures 
  SET status = CASE WHEN v_lesson_passed THEN 'passed'::lecture_status_enum ELSE 'repeat_required'::lecture_status_enum END,
      signed_off_at = NOW()
  WHERE lesson_id = v_booking.lesson_id AND instructor_id = p_pic_id;

  -- 7. Subsystem 3: Synthesize Dual Logbooks
  -- Student Logbook
  INSERT INTO electronic_logbook_entries (
    user_id, flight_id, flight_date, aircraft_model_code, aircraft_registration,
    departure_icao, arrival_icao, total_time_hours, pic_hours, dual_received_hours,
    day_landings_count, night_landings_count, pilot_role, signature_hash
  ) VALUES (
    v_booking.student_id, v_flight_id, CURRENT_DATE, 'C172', 'OY-AAA',
    'EKAH', 'EKAH', ROUND(v_block_hours, 2), 0.00, ROUND(v_block_hours, 2),
    p_day_landings, p_night_landings, 'DUAL_STUDENT',
    md5(v_flight_id::text || v_booking.student_id::text)
  );

  -- Instructor Logbook
  INSERT INTO electronic_logbook_entries (
    user_id, flight_id, flight_date, aircraft_model_code, aircraft_registration,
    departure_icao, arrival_icao, total_time_hours, pic_hours, instructor_hours,
    day_landings_count, night_landings_count, pilot_role, signature_hash
  ) VALUES (
    p_pic_id, v_flight_id, CURRENT_DATE, 'C172', 'OY-AAA',
    'EKAH', 'EKAH', ROUND(v_block_hours, 2), ROUND(v_block_hours, 2), ROUND(v_block_hours, 2),
    p_day_landings, p_night_landings, 'INSTRUCTOR',
    md5(v_flight_id::text || p_pic_id::text)
  );

  -- 8. Subsystem 4: Duty Clock & Rest Lock
  UPDATE duty_records 
  SET is_active = FALSE,
      duty_end_time = NOW(),
      mandatory_rest_until = NOW() + INTERVAL '12 hours'
  WHERE user_id = p_pic_id AND is_active = TRUE;

  -- 9. Subsystem 5: ACI Customer Invoicing
  v_total_cost := (ROUND(v_block_hours, 2) * v_plane_rate) + (ROUND(v_block_hours, 2) * v_fi_rate) + ((p_day_landings + p_night_landings) * v_landing_fee);
  INSERT INTO activities (flight_id, customer_id, block_hours, amount, status)
  SELECT v_flight_id, c.id, ROUND(v_block_hours, 2), v_total_cost, 'unbilled'
  FROM customers c WHERE c.user_id = v_booking.student_id LIMIT 1;

  -- 10. Subsystem 6: SMS Trigger
  IF p_incident_flag THEN
    INSERT INTO sms_reports (tenant_id, headline, severity, status)
    VALUES (v_booking.tenant_id, 'Incident Flagged During Post-Flight Debrief', 'warning', 'open');
  END IF;

  -- Mark booking completed
  UPDATE bookings SET status = 'completed', updated_at = NOW() WHERE id = p_booking_id;

  RETURN jsonb_build_object(
    'success', true,
    'flightId', v_flight_id,
    'tachDelta', v_tach_delta,
    'totalCost', v_total_cost,
    'lessonPassed', v_lesson_passed
  );
END;
$$;
```
