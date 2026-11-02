---
name: flysilverarrows-backend-aci-invoicing
description: >-
  Automated Customer Invoicing (ACI) tariff calculation, hourly aircraft wet/dry rates, instructor fees,
  landing fee surcharges, batch invoice drafting, and Stripe payment automation for FlightLogger / FlySilverArrows backend.
---

# FlySilverArrows Automated Customer Invoicing (ACI) & Stripe Billing Engine

## 1. Domain & Billing Architecture
The Automated Customer Invoicing (ACI) subsystem automates the billing lifecycle for flight academies, eliminating manual timesheet transcription.

When a flight is completed, it enters the system as an unbilled activity. Dispatchers or scheduled billing crons batch these unbilled activities into formal invoice documents and automatically charge the customer's payment method via Stripe.

```
Flight Completed (on_block)
          │
          ▼
   activities Table (status = 'unbilled')
   • Block Hours × Aircraft Rate
   • Block Hours × Instructor Rate
   • Landing Count × Landing Fee
          │
          ▼
   Batch Drafting Engine (fn_draft_aci_invoices)
          │
          ▼
   invoices & invoice_items Tables (status = 'draft')
          │
          ├─────────────────────────────┐
          ▼                             ▼
Stripe Payment Charge        Direct Balance Decrement
(mutation chargeAciCustomers) (Prepaid Customer Deposit)
          │                             │
          ▼                             ▼
   status = 'paid'               status = 'paid'
```

---

## 2. Tariff Calculation Formulas & Price Lists

### 2.1 Sortie Cost Formula
$$\text{Airframe Cost} = \text{block\_hours} \times \text{PriceListItem}(\text{aircraft\_model\_id})$$
$$\text{Instruction Cost} = \text{block\_hours} \times \text{PriceListItem}(\text{instructor\_hourly})$$
$$\text{Landing Surcharge} = (\text{day\_landings} + \text{night\_landings}) \times \text{PriceListItem}(\text{landing\_fee})$$
$$\text{Total Billable Sortie Amount} = \text{Airframe Cost} + \text{Instruction Cost} + \text{Landing Surcharge}$$

### 2.2 Wet vs Dry Billing Rules
- **Wet Rate:** Includes fuel in the hourly rate. If the student uplifts fuel off-base, the fuel purchase receipt is credited against their invoice.
- **Dry Rate:** Aircraft hourly rate excludes fuel; actual fuel burned is metered via `(fuel_start - fuel_stop)` and billed at local airfield price per liter.

---

## 3. PostgreSQL Stored Procedure: Batch Invoice Generation

```sql
CREATE OR REPLACE FUNCTION fn_draft_aci_invoices(
  p_tenant_id UUID,
  p_customer_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_cust RECORD;
  v_act RECORD;
  v_invoice_id UUID;
  v_invoice_number VARCHAR(64);
  v_subtotal DECIMAL(10,2) := 0.00;
  v_tax DECIMAL(10,2) := 0.00;
  v_invoices_created INT := 0;
BEGIN
  -- Iterate through customers with unbilled activities
  FOR v_cust IN 
    SELECT DISTINCT c.id, c.billing_name, c.account_balance, c.stripe_customer_id
    FROM customers c
    JOIN activities a ON a.customer_id = c.id
    WHERE c.tenant_id = p_tenant_id 
      AND a.status = 'unbilled'
      AND (p_customer_id IS NULL OR c.id = p_customer_id)
  LOOP
    -- Calculate customer subtotal
    SELECT COALESCE(SUM(amount), 0.00) INTO v_subtotal
    FROM activities
    WHERE customer_id = v_cust.id AND status = 'unbilled';

    IF v_subtotal > 0 THEN
      -- Generate sequential invoice number (e.g. INV-2026-0042)
      v_invoice_number := format('INV-%s-%s', TO_CHAR(CURRENT_DATE, 'YYYY'), LPAD(FLOOR(RANDOM()*10000)::text, 4, '0'));

      -- Create Invoice Header
      INSERT INTO invoices (
        tenant_id, customer_id, invoice_number, subtotal, tax_amount, total_amount,
        status, issued_at, due_date
      ) VALUES (
        p_tenant_id, v_cust.id, v_invoice_number, v_subtotal, 0.00, v_subtotal,
        'draft', NOW(), CURRENT_DATE + INTERVAL '14 days'
      ) RETURNING id INTO v_invoice_id;

      -- Transition Activities from 'unbilled' to 'invoiced'
      UPDATE activities 
      SET status = 'invoiced'
      WHERE customer_id = v_cust.id AND status = 'unbilled';

      v_invoices_created := v_invoices_created + 1;
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'invoices_created_count', v_invoices_created
  );
END;
$$;
```

---

## 4. Stripe Automated Customer Charging Integration

When an invoice is approved, the backend initiates an automated charge:
1. Fetch customer's `stripe_customer_id` from `customers`.
2. Check if customer holds sufficient prepaid deposit in `account_balance`.
   - If `account_balance >= invoice.total_amount`: decrement `account_balance` directly and set `status = 'paid'`.
   - If `account_balance < invoice.total_amount`: invoke Stripe `PaymentIntents.create()` via backend Edge Function:
     ```javascript
     const paymentIntent = await stripe.paymentIntents.create({
       amount: Math.round(invoice.total_amount * 100), // In cents
       currency: tenant.base_currency.toLowerCase(),
       customer: customer.stripe_customer_id,
       confirm: true,
       off_session: true,
       description: `Silver Arrows Aviation Sortie Invoice ${invoice.invoice_number}`
     });
     ```
3. Stripe Webhook Listener updates invoice state upon receiving `payment_intent.succeeded`.
