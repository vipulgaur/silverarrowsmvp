---
name: flysilverarrows-backend-cbta-engine
description: >-
  Competency-Based Training & Assessment (CBTA) backend engine, 1-5 norm scale rubric, 8 ICAO competencies,
  syllabus lesson progression logic, and stage-check check-ride qualification for FlightLogger / FlySilverArrows backend.
---

# FlySilverArrows Competency-Based Training & Assessment (CBTA) Engine

## 1. Domain Overview & Curriculum Hierarchy

FlySilverArrows models flight training following the ICAO Competency-Based Training and Assessment (CBTA) and EASA Part-FCL framework.

Curricula are structured as a 5-tier relational hierarchy:

```
[Program] (e.g. PPL(A) Private Pilot Licence)
   └── [Program Revision] (e.g. Revision 2 - NAA Approved)
          └── [Program Phase] (e.g. Phase 1: Basic Handling, Phase 2: Solo Navigation)
                 └── [Syllabus Lesson] (e.g. Ex 4.1 Climbing & Descending, Dual 1.5h)
                        └── [Master Exercise] (e.g. 4.1.a Best Rate Vy, 4.1.b Best Angle Vx)
```

---

## 2. The 8 ICAO / EASA Core Competencies

Every flight maneuver is evaluated across 8 standardized behavioral competencies:

| Code | Competency Title | Evaluation Focus & Observable Behavioral Markers |
| :---: | :--- | :--- |
| **KNO** | Application of Knowledge | Demonstrates sound theoretical knowledge of aircraft systems, operational procedures, and airspace regulations. |
| **FPA** | Flight Path Control (Automation) | Controls the aircraft via autopilot, flight director, and automated avionics systems within legal tolerances. |
| **FPO** | Flight Path Control (Manual) | Controls aircraft manually using aerodynamic pitch, roll, yaw, and power coordination without exceeding flight envelope. |
| **COM** | Communication | Uses standardized ICAO radiotelephony phraseology; speaks clearly and listens actively to air traffic control. |
| **WLM** | Workload Management | Prioritizes cockpit tasks; prepares in advance (pre-landing checklist, ATIS review) to avoid task saturation. |
| **SAW** | Situation Awareness | Perceives and comprehends aircraft state, position, traffic proximity, fuel state, and evolving weather conditions. |
| **PRB** | Problem Solving & Decision Making | Identifies abnormal situations promptly; applies structured decision-making models (e.g. DODAR, FORDEC). |
| **LST** | Leadership & Teamwork | Demonstrates assertiveness when appropriate; creates a supportive cockpit environment and accepts feedback. |

---

## 3. The 1–5 Norm Scale Rubric & Pass/Repeat Rules

Instructors evaluate student performance on each exercise using an integer score from 1 to 5:

| Norm Score | Rating Label | Criteria & Regulatory Significance | System Action |
| :---: | :--- | :--- | :--- |
| **1** | Unsatisfactory | Severe deviation from standards; safety compromised; instructor had to intervene physically on controls. | Lesson status: `repeat_required`. Exercise flagged for repetition. |
| **2** | Marginal | Competency demonstrated intermittently; slow recovery from deviations; prompting required. | Lesson status: `repeat_required`. Substandard maneuver repeats next flight. |
| **3** | Competent | Standard commercial passing baseline. Aircraft operated safely within regulatory tolerance limits. | Lesson status: `passed`. Unlocks subsequent syllabus lesson. |
| **4** | Proficient | Confident, proactive execution. Minor deviations corrected smoothly without prompting. | Lesson status: `passed`. High commendation recorded in student ledger. |
| **5** | Exemplary | Faultless execution; superior situational awareness; displays Captain-level airmanship. | Lesson status: `passed`. Student eligible for accelerated check-ride. |

---

## 4. PostgreSQL Stored Procedure: Syllabus Progression & Unbooked Lessons

```sql
CREATE OR REPLACE FUNCTION fn_get_unbooked_lessons(
  p_student_id UUID,
  p_program_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_revision_id UUID;
  v_last_lecture RECORD;
  v_next_lesson RECORD;
  v_pending_repeat RECORD;
  v_eligible_lessons JSONB := '[]'::jsonb;
BEGIN
  -- 1. Identify Student's Active Program Revision
  SELECT program_revision_id INTO v_revision_id
  FROM user_programs
  WHERE student_id = p_student_id AND status = 'active'
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('eligible_lessons', '[]'::jsonb, 'message', 'Student has no active program');
  END IF;

  -- 2. Check for Mandatory Repeat Exercises from preceding flight
  SELECT ul.id, sl.code, sl.title INTO v_pending_repeat
  FROM user_lectures ul
  JOIN syllabus_lessons sl ON ul.lesson_id = sl.id
  WHERE ul.user_program_id IN (SELECT id FROM user_programs WHERE student_id = p_student_id)
    AND ul.status = 'repeat_required'
  ORDER BY ul.created_at DESC LIMIT 1;

  IF FOUND THEN
    -- Student must repeat or complete review lesson before moving forward
    RETURN jsonb_build_object(
      'eligible_lessons', jsonb_build_array(jsonb_build_object(
        'lesson_id', v_pending_repeat.id,
        'code', v_pending_repeat.code,
        'title', v_pending_repeat.title,
        'is_repeat', true,
        'reason', 'Preceding flight had exercises scored below Competent (< 3)'
      ))
    );
  END IF;

  -- 3. Determine Highest Completed Lesson Order
  SELECT sl.lesson_order INTO v_last_lecture
  FROM user_lectures ul
  JOIN syllabus_lessons sl ON ul.lesson_id = sl.id
  WHERE ul.user_program_id IN (SELECT id FROM user_programs WHERE student_id = p_student_id)
    AND ul.status = 'passed'
  ORDER BY sl.lesson_order DESC LIMIT 1;

  -- 4. Find the Immediate Subsequent Lesson
  SELECT sl.id, sl.code, sl.title, sl.lesson_type, sl.planned_flight_hours, pp.title AS phase_title, pp.requires_stage_check
  INTO v_next_lesson
  FROM syllabus_lessons sl
  JOIN program_phases pp ON sl.phase_id = pp.id
  WHERE pp.program_revision_id = v_revision_id
    AND (v_last_lecture.lesson_order IS NULL OR sl.lesson_order > v_last_lecture.lesson_order)
  ORDER BY sl.lesson_order ASC LIMIT 1;

  IF FOUND THEN
    v_eligible_lessons := jsonb_build_array(jsonb_build_object(
      'lesson_id', v_next_lesson.id,
      'code', v_next_lesson.code,
      'title', v_next_lesson.title,
      'lesson_type', v_next_lesson.lesson_type,
      'planned_hours', v_next_lesson.planned_flight_hours,
      'phase', v_next_lesson.phase_title,
      'is_stage_check', v_next_lesson.requires_stage_check
    ));
  END IF;

  RETURN jsonb_build_object(
    'student_id', p_student_id,
    'eligible_lessons', v_eligible_lessons
  );
END;
$$;
```
