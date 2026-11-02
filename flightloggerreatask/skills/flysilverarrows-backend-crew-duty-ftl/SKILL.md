---
name: flysilverarrows-backend-crew-duty-ftl
description: >-
  EASA Part-FTL rolling duty calculator, 7-day 60h, 28-day 190h, 365-day 1000h flight ceilings,
  mandatory minimum rest enforcement, and duty clock-in/out engineering for FlightLogger / FlySilverArrows backend.
---

# FlySilverArrows Crew Duty & EASA Part-FTL Engine

## 1. Regulatory Framework & Ceilings (EASA ORO.FTL)

Flight Time Limitations (FTL) protect aviation safety by preventing aircrew fatigue. The backend enforces four statutory maximums:

1. **Rolling 7-Day Duty Limit:** Maximum **60.0 duty hours** in any 7 consecutive 24-hour periods.
2. **Rolling 28-Day Duty Limit:** Maximum **190.0 duty hours** in any 28 consecutive 24-hour periods.
3. **Rolling 28-Day Flight Time Limit:** Maximum **100.0 flight block hours** in any 28 consecutive days.
4. **Rolling 365-Day Flight Time Ceiling:** Maximum **1,000.0 flight block hours** in any rolling 365 days.
5. **Mandatory Rest Period:**
   $$\text{Rest Period} = \max(12.0\text{ hours}, \text{preceding duty duration})$$
   If duty ends away from home base: minimum 10 hours or duration of preceding duty (whichever is greater), including 8 hours of sleep opportunity.

---

## 2. Mathematical Definitions & Rolling Window Algorithms

```
                          Target Dispatch Date / Time
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
┌───────▼────────┐           ┌────────▼────────┐           ┌────────▼────────┐
│ Rolling 7-Day  │           │ Rolling 28-Day  │           │ Rolling 365-Day │
│ Duty Window    │           │ Duty Window     │           │ Flight Window   │
│ Max: 60h Duty  │           │ Max: 190h Duty  │           │ Max: 1000h Flight│
└────────────────┘           └─────────────────┘           └─────────────────┘
```

### 2.1 Rolling 7-Day Duty Aggregation Formula
$$\text{Duty}_{7\text{d}} = \sum_{i=1}^{n} \text{duty\_duration\_hours}_i \quad \text{where} \quad \text{duty\_start\_time} \ge (\text{target\_date} - 7\text{ days})$$

### 2.2 Mandatory Rest Lockout Window
$$\text{mandatory\_rest\_until} = \text{duty\_end\_time} + \max(12.0\text{ hours}, (\text{duty\_end\_time} - \text{duty\_start\_time}))$$
Any booking with `start_time < mandatory_rest_until` is physically rejected by the pre-flight gating engine.

---

## 3. PostgreSQL Stored Procedure: FTL Calculator

```sql
CREATE OR REPLACE FUNCTION fn_calculate_ftl_status(
  p_user_id UUID,
  p_target_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_rolling_7d_duty DECIMAL := 0.00;
  v_rolling_28d_duty DECIMAL := 0.00;
  v_rolling_28d_flight DECIMAL := 0.00;
  v_rolling_365d_flight DECIMAL := 0.00;
  v_active_duty RECORD;
  v_last_rest RECORD;
  v_is_compliant BOOLEAN := TRUE;
  v_alerts JSONB := '[]'::jsonb;
BEGIN
  -- 1. Rolling 7-Day Duty Hours (Max 60h)
  SELECT COALESCE(SUM(duty_duration_hours), 0.00) INTO v_rolling_7d_duty
  FROM duty_records
  WHERE user_id = p_user_id AND duty_start_time >= (p_target_date - INTERVAL '7 days');

  IF v_rolling_7d_duty > 60.0 THEN
    v_is_compliant := FALSE;
    v_alerts := v_alerts || jsonb_build_object('code', '7D_DUTY_CEILING', 'current', v_rolling_7d_duty, 'max', 60.0);
  END IF;

  -- 2. Rolling 28-Day Duty Hours (Max 190h)
  SELECT COALESCE(SUM(duty_duration_hours), 0.00) INTO v_rolling_28d_duty
  FROM duty_records
  WHERE user_id = p_user_id AND duty_start_time >= (p_target_date - INTERVAL '28 days');

  IF v_rolling_28d_duty > 190.0 THEN
    v_is_compliant := FALSE;
    v_alerts := v_alerts || jsonb_build_object('code', '28D_DUTY_CEILING', 'current', v_rolling_28d_duty, 'max', 190.0);
  END IF;

  -- 3. Rolling 28-Day Flight Hours (Max 100h)
  SELECT COALESCE(SUM(total_time_hours), 0.00) INTO v_rolling_28d_flight
  FROM electronic_logbook_entries
  WHERE user_id = p_user_id AND flight_date >= (p_target_date::date - INTERVAL '28 days');

  IF v_rolling_28d_flight > 100.0 THEN
    v_is_compliant := FALSE;
    v_alerts := v_alerts || jsonb_build_object('code', '28D_FLIGHT_CEILING', 'current', v_rolling_28d_flight, 'max', 100.0);
  END IF;

  -- 4. Rolling 365-Day Flight Hours (Max 1000h)
  SELECT COALESCE(SUM(total_time_hours), 0.00) INTO v_rolling_365d_flight
  FROM electronic_logbook_entries
  WHERE user_id = p_user_id AND flight_date >= (p_target_date::date - INTERVAL '365 days');

  IF v_rolling_365d_flight > 1000.0 THEN
    v_is_compliant := FALSE;
    v_alerts := v_alerts || jsonb_build_object('code', '365D_FLIGHT_CEILING', 'current', v_rolling_365d_flight, 'max', 1000.0);
  END IF;

  -- 5. Active Rest Period Check
  SELECT * INTO v_last_rest FROM duty_records 
  WHERE user_id = p_user_id AND mandatory_rest_until IS NOT NULL 
  ORDER BY duty_end_time DESC LIMIT 1;

  IF v_last_rest.mandatory_rest_until > p_target_date THEN
    v_is_compliant := FALSE;
    v_alerts := v_alerts || jsonb_build_object(
      'code', 'REST_PERIOD_ACTIVE',
      'rest_until', v_last_rest.mandatory_rest_until,
      'hours_remaining', ROUND(EXTRACT(EPOCH FROM (v_last_rest.mandatory_rest_until - p_target_date)) / 3600.0, 2)
    );
  END IF;

  RETURN jsonb_build_object(
    'is_compliant', v_is_compliant,
    'rolling_7d_duty', v_rolling_7d_duty,
    'rolling_28d_duty', v_rolling_28d_duty,
    'rolling_28d_flight', v_rolling_28d_flight,
    'rolling_365d_flight', v_rolling_365d_flight,
    'alerts', v_alerts
  );
END;
$$;
```
