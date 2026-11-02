---
name: flysilverarrows-backend-background-jobs
description: >-
  Asynchronous task worker architecture, regulatory cron schedules (nightly currency sweeps, maintenance warnings),
  Stripe webhook ingestion, ADS-B telemetry polling, and headless PDF logbook compilation for FlightLogger / FlySilverArrows backend.
---

# FlySilverArrows Background Jobs, Regulatory Crons & Webhook Architecture

## 1. Architectural Strategy & Worker Engine

The FlySilverArrows backend relies on an asynchronous job processing system (such as **pg-boss**, **BullMQ / Redis**, or **Temporal**) alongside PostgreSQL's native `LISTEN / NOTIFY` mechanism to handle background tasks without blocking HTTP/RPC threads.

Key architectural responsibilities include:
1. **Zero-Latency HTTP Responses:** API calls trigger background jobs for heavy computations (PDF generation, bulk email dispatch, Stripe invoice finalization).
2. **Guaranteed Execution & Idempotency:** Every background job is assigned an idempotent UUID (`job_key`). Repeated deliveries do not cause double-charging or duplicate logbook generation.
3. **Dead-Letter Queue (DLQ):** Failed jobs retry up to 5 times with exponential backoff before landing in `failed_jobs` table with full error stack traces.

```
                           PostgreSQL / HTTP Action
                                      │
                       ┌──────────────▼──────────────┐
                       │   Job Dispatch / pg-boss    │
                       └──────────────┬──────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          │                           │                           │
┌─────────▼─────────┐       ┌─────────▼─────────┐       ┌─────────▼─────────┐
│ 1. Regulatory Cron│       │ 2. Webhook Workers│       │ 3. Heavy Compute  │
│ • Daily Currency  │       │ • Stripe Webhooks │       │ • PDF Logbook /   │
│ • Maintenance     │       │ • RadarBox ADS-B  │       │   Form Generation │
│ • FTL Rest Audit  │       │ • Email / SMS     │       │ • Cloud Archiving │
└───────────────────┘       └───────────────────┘       └───────────────────┘
```

---

## 2. Regulatory Scheduled Cron Jobs

### Cron 1: Nightly Pilot Regulatory Currency & Certificate Audit (`00:01 UTC`)
* **Cron Expression:** `1 0 * * *`
* **Target RPC:** `fn_audit_pilot_currencies()`
* **Logic:**
  1. Scans `user_certificates` for all pilots across all tenants.
  2. Identifies certificates expiring within **30 days, 14 days, and 3 days**.
  3. Inserts warnings into `certificate_warnings` table.
  4. If `expires_at < NOW()`, flags pilot profile with `has_expired_medical = TRUE`, which automatically trips **Gate 1** of `fn_validate_preflight_gating()`.
  5. Computes 90-day 3-landing passenger currency for all active commercial/flight instructors:
     $$\text{Landings}_{90\text{d}} = \sum (\text{day\_landings} + \text{night\_landings}) \quad \text{where} \quad \text{flight\_date} \ge (\text{NOW()} - 90\text{ days})$$
     If $\text{Landings}_{90\text{d}} < 3$, revokes passenger/dual-instruction dispatch privileges.

### Cron 2: Nightly Fleet Maintenance Countdown & Overdue Grounding (`00:30 UTC`)
* **Cron Expression:** `30 0 * * *`
* **Target RPC:** `fn_audit_fleet_maintenance()`
* **Logic:**
  1. Inspects `aircraft_maintenance_intervals` across all active airframes.
  2. Evaluates calendar-day limits:
     $$\text{days\_remaining} = \text{target\_date} - \text{CURRENT\_DATE}$$
  3. If $\text{days\_remaining} \le 7$, creates administrative warning banner on airfield dispatch board.
  4. If $\text{days\_remaining} \le 0$, immediately executes:
     ```sql
     UPDATE aircraft 
     SET status = 'maintenance_due' 
     WHERE id = interval_record.aircraft_id;
     ```
  5. Broadcasts `fleet_status_updated` WebSocket event to lock airframe from upcoming reservations.

### Cron 3: Automated Customer Invoicing (ACI) Batch Billing (`Weekly - Sunday 23:00 UTC`)
* **Cron Expression:** `0 23 * * 0`
* **Target RPC:** `fn_draft_aci_invoices(p_tenant_id UUID)`
* **Logic:**
  1. Selects all `activities` where `status = 'unbilled'` and `flight.status = 'completed'`.
  2. Aggregates activities by `customer_id` and generates a single consolidated draft invoice in `invoices`.
  3. Computes subtotal, tax rates, airport landing fees, and fuels.
  4. If customer has automatic credit card debit enabled (`auto_charge = TRUE`), queues Stripe payment worker.

---

## 3. Stripe Webhook Ingestion Worker

### Security & Idempotency Pipeline
1. **Signature Verification:** Validates `Stripe-Signature` header against tenant webhook secret (`whsec_...`) using HMAC-SHA256.
2. **Idempotency Gate:** Checks if `event.id` already exists in `stripe_webhook_events`. If present, returns HTTP 200 immediately to prevent duplicate processing.
3. **Event Routing:**

```typescript
switch (event.type) {
  case 'payment_intent.succeeded':
    await handlePaymentIntentSucceeded(event.data.object);
    break;
  case 'payment_intent.payment_failed':
    await handlePaymentIntentFailed(event.data.object);
    break;
  case 'customer.subscription.updated':
    await handleSubscriptionUpdated(event.data.object);
    break;
  default:
    // Unhandled event type acknowledged
    break;
}
```

### Stored Procedure: Settle Invoice on Stripe Succeeded
```sql
CREATE OR REPLACE FUNCTION fn_settle_stripe_payment(
  p_invoice_id UUID,
  p_stripe_payment_intent_id VARCHAR(128),
  p_amount_paid_cents INT,
  p_currency VARCHAR(3)
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 1. Verify invoice exists and is awaiting payment
  IF NOT EXISTS (SELECT 1 FROM invoices WHERE id = p_invoice_id AND status IN ('draft', 'sent', 'overdue')) THEN
    RAISE EXCEPTION 'INVOICE_NOT_PAYABLE: Invoice % cannot be settled', p_invoice_id;
  END IF;

  -- 2. Update invoice status
  UPDATE invoices
  SET 
    status = 'paid',
    stripe_payment_intent_id = p_stripe_payment_intent_id,
    paid_at = NOW(),
    updated_at = NOW()
  WHERE id = p_invoice_id;

  -- 3. Mark all constituent activities as invoiced
  UPDATE activities
  SET status = 'invoiced'
  WHERE invoice_id = p_invoice_id;

  -- 4. Record audit log entry
  INSERT INTO audit_logs (tenant_id, action, resource_type, resource_id, metadata)
  SELECT 
    tenant_id, 
    'STRIPE_PAYMENT_SETTLED', 
    'invoice', 
    p_invoice_id, 
    jsonb_build_object('payment_intent', p_stripe_payment_intent_id, 'amount', p_amount_paid_cents, 'currency', p_currency)
  FROM invoices WHERE id = p_invoice_id;
END;
$$;
```

---

## 4. ADS-B Flight Telemetry Ingestion Worker

For modern ATOs equipped with RadarBox, SpiderTracks, or OpenSky Network ADS-B telemetry:

1. **Polling / Webhook Stream:** Worker polls GPS lat/long/altitude/speed every 15 seconds for active airborne sorties (`bookings.status = 'flight'`).
2. **Geofence Calculation:** Computes Haversine distance between aircraft position $(lat_a, lon_a)$ and home aerodrome runway threshold $(lat_{rwy}, lon_{rwy})$.
3. **Automated Touchdown Detection:**
   $$\text{Distance} \le 1.0\text{ NM} \quad \text{AND} \quad \text{GroundSpeed} < 40\text{ kts} \quad \text{AND} \quad \text{Altitude} \approx \text{Elevation}$$
4. **FSM Auto-Advance:** Invokes `fn_record_touchdown(flight_id, NOW())`, automatically updating live departure/arrival boards and alerting ground marshals.

---

## 5. Headless PDF Logbook & EASA Form Compilation Worker

### Generation Queue Workflow
1. Pilot requests **EASA Part-FCL Compliant Electronic Logbook Export (PDF/A-3)** or **Form 141 Stage-Check Record**.
2. Controller inserts request into `pdf_generation_queue`.
3. Background worker picks up job:
   - Queries `flight_logs` with all cross-country, PIC, Dual, Night, and IFR breakdowns.
   - Embeds instructor cryptographic verification signatures and timestamp hashes.
   - Compiles output using headless Chromium or Typst engine.
   - Uploads compiled PDF to S3/Cloud Storage under `/tenants/{tenant_id}/logbooks/{user_id}/{filename}.pdf`.
   - Generates signed time-limited download URL (valid for 15 minutes).
4. Marks job completed; pushes notification via WebSocket to user's browser.
