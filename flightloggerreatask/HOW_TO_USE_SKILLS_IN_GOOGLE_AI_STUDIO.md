# How to Use FlySilverArrows Backend Skills in Google AI Studio

**Target Platform:** Google AI Studio (`https://aistudio.google.com`)  
**Target Models:** Argon 4 (Argon 4 Pro, Argon 4 Flash)  
**Domain Scope:** Civil Aviation Academy Operating System (FlightLogger / FlySilverArrows Backend)  
**Strict Focus:** 100% Backend Architecture, Database Schemas, Stored Procedures, Regulatory Rules, and APIs (Zero UI)  

---

## 1. Overview & Architectural Role of Google AI Studio

Google AI Studio provides access to Google's flagship multimodal reasoning engine **Argon 4** (**Argon 4 Pro** and **Argon 4 Flash**). With native context windows extending up to **2,000,000 tokens**, Google AI Studio running Argon 4 can ingest the complete FlightLogger technical architecture in a single prompt context.

The **FlySilverArrows Backend Skills** stored in `flightloggerreatask/skills/` (and `.agents/skills/`) represent the authoritative regulatory, mathematical, and architectural ground truth. Google AI Studio acts as the **code synthesizer and execution engine** that translates these skill specifications into production-ready PostgreSQL DDL migrations, PL/pgSQL stored procedures, FastAPI / Fastify backend controllers, and automated validation harnesses.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       FlySilverArrows Backend Skills                        │
│                                                                             │
│  • DB Schema (32 Tables, GiST, RLS)     • Pre-Flight Gating (7-Point Engine)│
│  • Flight FSM (6 Operational Stages)    • Crew Duty & Part-FTL Rolling Math │
│  • 6-Way Atomic Post-Flight Commit      • CBTA Syllabus & 1-5 Norm Grading  │
│  • ACI Invoicing & Stripe Tariffs       • 144 GraphQL-to-RPC API Contracts  │
│  • Background Jobs & Regulatory Crons                                       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                        Ingested into Google AI Studio
                    (System Instructions + Context Caching)
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Google AI Studio Engine                            │
│                                                                             │
│  • Model: Argon 4 Pro (Reasoning) / Argon 4 Flash (Throughput)             │
│  • Temperature: 0.0 – 0.2 (Deterministic Code Generation)                   │
│  • Context Caching: Active (>32k Tokens Cached at 75% Cost Reduction)       │
│  • Function Calling / Tools: Declared Stored Procedures (JSON Schema)       │
│  • Structured Outputs: JSON Schema Validation Enforcement                   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Synthesized Backend Outputs                         │
│                                                                             │
│  1. PostgreSQL Migration Scripts (.sql) with Zero-Hallucination Schemas     │
│  2. PL/pgSQL Stored Procedures with ACID Transactional Rollbacks            │
│  3. Fastify / NestJS / FastAPI REST Controllers & WebSocket Gateways        │
│  4. Pure Backend Verification Data Fixtures (No UI code)                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Step 1: Model Selection & Parameter Tuning in AI Studio

When working in Google AI Studio (`https://aistudio.google.com`), configure your session in the right-hand **Model Settings** sidebar:

### 2.1 Model Selection
| Task Type | Recommended Model | Why |
| :--- | :--- | :--- |
| **Complex Database DDL, ACID Pipelines & FSM** | `argon-4-pro` (or `argon-4`) | Maximum reasoning depth across complex multi-table constraints, GiST intervals, and transactional rollback edge cases. |
| **API Endpoints, DTO Schemas & Rapid RPC Bindings** | `argon-4-flash` | Extremely fast token generation, lowest latency, ideal for generating hundreds of route handlers from the 144 GraphQL catalog. |

### 2.2 Model Configuration Parameters
* **Temperature:** Set to `0.0` or `0.1`.
  * *Aviation Rationale:* Civil aviation compliance (EASA Part-FCL / Part-MED / Part-FTL) requires 100% deterministic outputs. Zero randomness ensures math formulas, regulatory rest windows, and SQL constraints are strictly preserved without creative variance.
* **Top-P:** Set to `0.95`.
* **Top-K:** Set to `40`.
* **Max Output Tokens:** Set to `8192` (allows full SQL migrations or complete controller files in a single pass).
* **Safety Settings:** Set all categories (**Harassment**, **Hate Speech**, **Sexually Explicit**, **Dangerous Content**) to `Block None` or `Block Few`.
  * *Aviation Rationale:* Aviation engineering includes terms like *"aircraft crash"*, *"grounding snag"*, *"severe hazard"*, *"touchdown abort"*, and *"defects"*. Standard safety filters can misinterpret these aeronautical terms as dangerous content if not relaxed.

---

## 3. Step 2: Injecting Backend Skills via System Instructions

Google AI Studio provides a dedicated **"System Instructions"** box at the top of the interface. This sets the persistent baseline personality and rules for the model.

### 3.1 Recommended System Instructions Template

Paste the following master directive directly into the **System Instructions** box:

```markdown
You are the Principal Aviation Backend Systems Architect and Database Engineer for FlySilverArrows (a full recreation of FlightLogger).

CORE ARCHITECTURAL RULES:
1. STRICTLY BACKEND ONLY: Never generate HTML, CSS, React, Vue, Tailwind, or frontend UI code. Focus exclusively on PostgreSQL DDL, PL/pgSQL stored procedures, GiST range exclusion constraints, Row-Level Security (RLS), ACID transactions, REST/Fastify/FastAPI controllers, and background workers.
2. CIVIL AVIATION REGULATORY COMPLIANCE: Strictly enforce EASA Part-FCL, EASA Part-MED, EASA Part-FTL (ORO.FTL), and ICAO CBTA regulations.
3. MULTI-TENANCY ISOLATION: Every entity must enforce path-based multi-tenancy (`tenant_id UUID REFERENCES tenants(id) NOT NULL`) with PostgreSQL Row-Level Security (RLS).
4. NON-DESTRUCTIVE SOFT DELETION: Never emit `DROP TABLE` or physical `DELETE FROM` statements for operational entities. Use `is_active = FALSE`, `status = 'archived'`, or `deleted_at = NOW()`.
5. TRANSACTIONAL ATOMICITY: Multi-table mutations (such as post-flight debrief registrations) must execute within a single PostgreSQL transaction with strict rollback on failure (`EXCEPTION WHEN OTHERS THEN ROLLBACK`).
6. ANTI-OVERLAP EXCLUSIONS: Resource scheduling conflicts (airframes, instructors, simulators) must be blocked using PostgreSQL GiST range exclusion constraints (`tstzrange`).

When tasked with generating migrations, controllers, or logic, strictly ground all outputs in the provided FlySilverArrows Backend Skills.
```

### 3.2 Loading Skill Markdown into the Session
Depending on your task, paste the relevant backend skill markdown file(s) into the System Instructions or into the first turn of the prompt:

1. **For Database & Relational Work:** Paste [flysilverarrows-backend-db-schema/SKILL.md](file:///Users/beingdheet/reatask/flightloggerreatask/skills/flysilverarrows-backend-db-schema/SKILL.md).
2. **For Dispatch & Flight Lifecycle Work:** Paste [flysilverarrows-backend-flight-fsm/SKILL.md](file:///Users/beingdheet/reatask/flightloggerreatask/skills/flysilverarrows-backend-flight-fsm/SKILL.md) and [flysilverarrows-backend-preflight-gating/SKILL.md](file:///Users/beingdheet/reatask/flightloggerreatask/skills/flysilverarrows-backend-preflight-gating/SKILL.md).
3. **For Post-Flight Debrief & Logbook Work:** Paste [flysilverarrows-backend-atomic-commit/SKILL.md](file:///Users/beingdheet/reatask/flightloggerreatask/skills/flysilverarrows-backend-atomic-commit/SKILL.md) and [flysilverarrows-backend-cbta-engine/SKILL.md](file:///Users/beingdheet/reatask/flightloggerreatask/skills/flysilverarrows-backend-cbta-engine/SKILL.md).
4. **For Pilot Rest & Duty Limitations:** Paste [flysilverarrows-backend-crew-duty-ftl/SKILL.md](file:///Users/beingdheet/reatask/flightloggerreatask/skills/flysilverarrows-backend-crew-duty-ftl/SKILL.md).
5. **For Invoicing & Billing Work:** Paste [flysilverarrows-backend-aci-invoicing/SKILL.md](file:///Users/beingdheet/reatask/flightloggerreatask/skills/flysilverarrows-backend-aci-invoicing/SKILL.md).
6. **For API Endpoints & RPC Layer:** Paste [flysilverarrows-backend-api-rpc-contracts/SKILL.md](file:///Users/beingdheet/reatask/flightloggerreatask/skills/flysilverarrows-backend-api-rpc-contracts/SKILL.md).
7. **For Asynchronous Workers & Crons:** Paste [flysilverarrows-backend-background-jobs/SKILL.md](file:///Users/beingdheet/reatask/flightloggerreatask/skills/flysilverarrows-backend-background-jobs/SKILL.md).

---

## 4. Step 3: Google AI Studio Context Caching (Cost & Speed Optimization)

When you load multiple backend skills and the schema encyclopedia into Google AI Studio, the token count will range from **40,000 to 120,000 tokens**. 

Google AI Studio automatically supports **Context Caching** for prompts exceeding 32,768 tokens on Argon 4 (Argon 4 Pro and Argon 4 Flash).

### 4.1 Benefits of Context Caching
* **75% Cost Reduction:** Cached input tokens are billed at a 75% discount compared to regular input tokens.
* **Instantaneous TTFT (Time To First Token):** First-token latency drops from 10–15 seconds down to under 500 milliseconds, because the model pre-indexes the attention keys of the backend skills.

### 4.2 How to Enable Context Caching in the Web UI
1. In Google AI Studio, paste your combined backend skills into the **System Instructions** or as a master initial user message.
2. Once the token counter in the bottom-right corner exceeds `32,768` tokens, a blue **"Cache Content"** pill/button will appear near the model settings or token meter.
3. Click **"Cache Content"** and select a Time-To-Live (TTL) (e.g. `1 hour`, `24 hours`, or `custom`).
4. Save the prompt. Subsequent turns in your AI Studio conversation will now hit the warm cache instantly.

### 4.3 Python Script to Programmatically Cache Skills in AI Studio
If interacting with the Google GenAI API programmatically, use this Python script to create a persistent cache:

```python
import os
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ.get("ARGON_API_KEY"))

# Read backend skills
skills_dir = "/Users/beingdheet/reatask/flightloggerreatask/skills"
skill_files = [
    "flysilverarrows-backend-db-schema/SKILL.md",
    "flysilverarrows-backend-flight-fsm/SKILL.md",
    "flysilverarrows-backend-atomic-commit/SKILL.md",
    "flysilverarrows-backend-preflight-gating/SKILL.md",
    "flysilverarrows-backend-crew-duty-ftl/SKILL.md",
    "flysilverarrows-backend-cbta-engine/SKILL.md",
    "flysilverarrows-backend-aci-invoicing/SKILL.md",
    "flysilverarrows-backend-api-rpc-contracts/SKILL.md",
    "flysilverarrows-backend-background-jobs/SKILL.md",
]

combined_skills_text = ""
for file_rel in skill_files:
    full_path = os.path.join(skills_dir, file_rel)
    with open(full_path, "r", encoding="utf-8") as f:
        combined_skills_text += f"\n\n--- SKILL: {file_rel} ---\n\n" + f.read()

# Create cached content (TTL = 1 day)
cache = client.caches.create(
    model="argon-4-pro",
    config=types.CreateCachedContentConfig(
        contents=[
            types.Content(
                role="user",
                parts=[types.Part.from_text(combined_skills_text)]
            )
        ],
        system_instruction=types.Content(
            parts=[types.Part.from_text(
                "You are the Lead Backend Aviation Architect for FlySilverArrows. Ground all code in the provided skills."
            )]
        ),
        ttl="86400s", # 24 Hours
    ),
)

print(f"Context Cache Created! Cache Name: {cache.name}")
```

---

## 5. Step 4: Configuring Function Calling / Tools in Google AI Studio

Google AI Studio enables you to define **Tools (Function Calling)** directly in the UI. By declaring the core stored procedures as tools, Argon 4 can autonomously decide when and how to call your backend database procedures.

### 5.1 How to Add a Tool in Google AI Studio
1. In the right-hand panel of AI Studio, toggle **Tools** $\to$ click **"Add Function"**.
2. Give the function a name, description, and JSON Schema parameters.

### 5.2 Tool Declaration 1: `fn_register_flight` (6-Way Atomic Commit)
```json
{
  "name": "fn_register_flight",
  "description": "Executes the 6-way atomic post-flight debrief commit pipeline. Mutates airframe tachometer, decrements 50h/100h inspections, records CBTA 1-5 norm grades, writes dual pilot logbooks, updates EASA Part-FTL rest limits, and creates unbilled billing activity in a single ACID transaction.",
  "parameters": {
    "type": "object",
    "properties": {
      "booking_id": { "type": "string", "format": "uuid", "description": "The UUID of the flight booking being registered" },
      "tach_start": { "type": "number", "description": "Airframe tachometer reading at engine start (e.g. 1420.50)" },
      "tach_stop": { "type": "number", "description": "Airframe tachometer reading at engine shutdown (e.g. 1422.10)" },
      "block_off": { "type": "string", "format": "date-time", "description": "Chocks-off / taxi timestamp" },
      "block_on": { "type": "string", "format": "date-time", "description": "Chocks-on / engine shutdown timestamp" },
      "takeoff_time": { "type": "string", "format": "date-time", "description": "Wheels-up runway departure timestamp" },
      "landing_time": { "type": "string", "format": "date-time", "description": "Wheels-down runway touchdown timestamp" },
      "day_landings": { "type": "integer", "description": "Total daytime landings executed" },
      "night_landings": { "type": "integer", "description": "Total nighttime landings executed" },
      "cbta_scores": {
        "type": "array",
        "description": "Array of CBTA exercise evaluations",
        "items": {
          "type": "object",
          "properties": {
            "exercise_id": { "type": "string", "format": "uuid" },
            "norm_score": { "type": "integer", "minimum": 1, "maximum": 5, "description": "Score from 1 (Unsatisfactory) to 5 (Exemplary)" },
            "competency_code": { "type": "string", "enum": ["KNO", "FPA", "FPO", "COM", "WLM", "SAW", "PRB", "LST"] },
            "remark": { "type": "string" }
          },
          "required": ["exercise_id", "norm_score", "competency_code"]
        }
      },
      "fuel_uplift_liters": { "type": "number", "description": "Fuel added in liters prior to or during sortie" },
      "instructor_signature_hash": { "type": "string", "description": "Cryptographic signature hash of the authorizing CFI" }
    },
    "required": ["booking_id", "tach_start", "tach_stop", "block_off", "block_on", "day_landings", "night_landings", "instructor_signature_hash"]
  }
}
```

### 5.3 Tool Declaration 2: `fn_validate_preflight_gating` (7-Point Gating Engine)
```json
{
  "name": "fn_validate_preflight_gating",
  "description": "Evaluates an upcoming reservation against the 7 mandatory pre-flight dispatch gates: EASA Part-MED medical validity, 90-day 3-landing currency, night currency, class/type ratings, airframe 50h/100h inspection countdown, FTL mandatory rest period, and GiST overlap locks.",
  "parameters": {
    "type": "object",
    "properties": {
      "tenant_id": { "type": "string", "format": "uuid" },
      "aircraft_id": { "type": "string", "format": "uuid" },
      "pic_user_id": { "type": "string", "format": "uuid" },
      "student_user_id": { "type": "string", "format": "uuid" },
      "start_time": { "type": "string", "format": "date-time" },
      "end_time": { "type": "string", "format": "date-time" },
      "is_solo_flight": { "type": "boolean" },
      "flight_rules": { "type": "string", "enum": ["VFR", "IFR"] }
    },
    "required": ["tenant_id", "aircraft_id", "pic_user_id", "start_time", "end_time"]
  }
}
```

### 5.4 Tool Declaration 3: `fn_calculate_ftl_status` (EASA Part-FTL Engine)
```json
{
  "name": "fn_calculate_ftl_status",
  "description": "Calculates rolling duty hours (7-day 60h limit, 28-day 190h limit), rolling flight block hours (28-day 100h limit, 365-day 1000h ceiling), and mandatory minimum rest period under EASA ORO.FTL.",
  "parameters": {
    "type": "object",
    "properties": {
      "user_id": { "type": "string", "format": "uuid" },
      "target_date": { "type": "string", "format": "date-time", "description": "Timestamp at which FTL legality is audited" }
    },
    "required": ["user_id"]
  }
}
```

---

## 6. Step 5: Enforcing Structured Outputs (JSON Schema Mode)

In Google AI Studio, under **Advanced Settings**, you can toggle **"Structured Output"** and set the response MIME type to `application/json`. This forces Argon 4 to respond strictly in a validated JSON structure, completely eliminating conversational filler.

### 6.1 Gating Audit Response Schema Example
When asking Argon 4 to audit a booking or validate a mock flight scenario against `flysilverarrows-backend-preflight-gating`, provide this schema in AI Studio:

```json
{
  "type": "object",
  "properties": {
    "is_dispatch_cleared": { "type": "boolean" },
    "audit_timestamp": { "type": "string" },
    "gates_evaluated": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "gate_number": { "type": "integer" },
          "gate_name": { "type": "string" },
          "status": { "type": "string", "enum": ["PASSED", "FAILED", "WARNING", "NOT_APPLICABLE"] },
          "regulatory_reference": { "type": "string" },
          "details": { "type": "string" }
        },
        "required": ["gate_number", "gate_name", "status", "regulatory_reference"]
      }
    },
    "blocking_violations": {
      "type": "array",
      "items": { "type": "string" }
    },
    "recommended_remedy": { "type": "string" }
  },
  "required": ["is_dispatch_cleared", "gates_evaluated", "blocking_violations"]
}
```

---

## 7. Step 6: Ready-to-Use Google AI Studio Prompt Workflows

Below are exact copy-paste prompts designed for use in Google AI Studio to generate each major backend component:

### Workflow 1: PostgreSQL DDL Migration Generation
> **Prompt to paste into Google AI Studio:**
> ```text
> Using the skills [flysilverarrows-backend-db-schema] and [10_DATABASE_TABLES_COLUMNS_AND_USAGES_ENCYCLOPEDIA.md], generate a complete, production-ready PostgreSQL 15+ migration script for Tables 6 to 12 (Fleet & Maintenance: aircraft, aircraft_models, engine_specifications, aircraft_remarks, certificate_warnings, aircraft_maintenance_intervals, squawks).
> 
> MANDATORY REQUIREMENTS:
> 1. Include all ENUM types, primary keys (UUID default gen_random_uuid()), and foreign key relationships with ON DELETE RESTRICT (to protect flight history).
> 2. Implement PostgreSQL GiST range exclusion constraints preventing overlapping maintenance grounding blocks.
> 3. Implement non-destructive soft-deletion via `deleted_at TIMESTAMPTZ` and `status` columns.
> 4. Include PostgreSQL Row-Level Security (RLS) policies enforcing multi-tenancy isolation (`tenant_id = current_setting('app.current_tenant_id')::UUID`).
> 5. Generate ONLY clean, syntactically flawless SQL. No explanatory markdown, no UI code.
> ```

---

### Workflow 2: Implementing the 6-Stage Flight FSM in PL/pgSQL
> **Prompt to paste into Google AI Studio:**
> ```text
> Using the skill [flysilverarrows-backend-flight-fsm], write the complete PostgreSQL stored procedure `fn_transition_booking(p_booking_id UUID, p_target_status booking_status_enum, p_actor_id UUID)`.
> 
> MANDATORY REQUIREMENTS:
> 1. Strictly enforce the legal transition matrix:
>    - draft -> scheduled
>    - scheduled -> briefing
>    - scheduled -> cancelled
>    - briefing -> flight
>    - briefing -> cancelled
>    - flight -> landed
>    - landed -> debriefing
>    - debriefing -> completed
> 2. If an illegal transition is attempted (e.g. scheduled -> completed, or flight -> cancelled), RAISE EXCEPTION with a specific descriptive error code.
> 3. Enforce pre-conditions (e.g., cannot transition to 'flight' if airframe has an open grounding snag).
> 4. Trigger PostgreSQL pg_notify on channel 'booking_status_channel' with a JSON payload containing {booking_id, tenant_id, old_status, new_status, actor_id, timestamp}.
> 5. Record the transition event in `booking_audit_logs`.
> ```

---

### Workflow 3: Implementing the 6-Way Atomic Post-Flight Commit Pipeline
> **Prompt to paste into Google AI Studio:**
> ```text
> Using the skill [flysilverarrows-backend-atomic-commit], author the master PostgreSQL PL/pgSQL function `fn_register_flight(...)`.
> 
> MANDATORY REQUIREMENTS:
> 1. Wrap all mutations in a single ACID transaction. If any calculation or constraint fails, RAISE EXCEPTION and rollback completely.
> 2. Validate tachometer delta: delta = tach_stop - tach_start. Enforce delta > 0.00 and delta <= 12.00.
> 3. Subsystem 1 (Fleet): Increment airframe and engine hours by delta tach; increment total landings.
> 4. Subsystem 1 (Maintenance): Decrement 50h/100h inspection intervals. If hours_left <= 0, automatically update aircraft.status = 'maintenance_due' and insert certificate_warning.
> 5. Subsystem 2 (CBTA): Insert exercise scores (1-5 norm scale). If any score is < 3, mark lecture as 'repeat_required'; otherwise mark 'passed' and unlock next syllabus lesson.
> 6. Subsystem 3 (Logbooks): Atomically create dual flight_logs records (one for student with role 'DUAL_STUDENT', one for CFI with role 'INSTRUCTOR' and PIC hours).
> 7. Subsystem 4 (FTL): Clock out duty record; compute mandatory rest lock = NOW() + MAX(12h, duty_duration).
> 8. Subsystem 5 (ACI): Calculate billable amount (block_hours * hourly_rate + landings * landing_fee) and insert record into `activities` with status = 'unbilled'.
> ```

---

### Workflow 4: Implementing Fastify / Node.js Backend API Handlers
> **Prompt to paste into Google AI Studio:**
> ```text
> Using the skill [flysilverarrows-backend-api-rpc-contracts], generate a Fastify TypeScript route controller for the Resource Scheduling & Gating operation family (resourceBookings, BookingCertBlockedUserIdsQuery, aircraftModelCertificatePlaneCheck, publishBooking).
> 
> MANDATORY REQUIREMENTS:
> 1. Use Fastify with strict TypeScript types and TypeBox / Zod request body validation.
> 2. Extract tenant_id and user_id from the authenticated JWT session.
> 3. Call the respective PostgreSQL stored procedures (`fn_get_resource_timeline`, `fn_validate_preflight_gating`, `fn_publish_booking`) using a pooled pg connection.
> 4. Map SQL exceptions to clean HTTP status codes (e.g. GIST range exclusion conflict -> 409 Conflict with details; Expired medical -> 422 Unprocessable Entity).
> 5. STRICTLY BACKEND ONLY: No frontend code.
> ```

---

### Workflow 5: Implementing Background Workers & Regulatory Crons
> **Prompt to paste into Google AI Studio:**
> ```text
> Using the skill [flysilverarrows-backend-background-jobs], generate a TypeScript worker using BullMQ or pg-boss that implements:
> 1. Nightly Currency Audit Cron (00:01 UTC): Queries pilots with medicals expiring within 30, 14, or 3 days; flags expired medicals; audits 90-day 3-landing currency.
> 2. Nightly Fleet Maintenance Cron (00:30 UTC): Decrements calendar-day inspections; grounds airframes with zero days left.
> 3. Stripe Webhook Ingestion Controller: Verifies Stripe-Signature with HMAC-SHA256, enforces idempotency via `stripe_webhook_events` table, and calls `fn_settle_stripe_payment()` on `payment_intent.succeeded`.
> ```

---

## 8. Step 7: Validating Generated Code Against Skills in Google AI Studio

To guarantee that Argon 4's generated code meets the highest aviation engineering standards, use this **Self-Validation Prompt** in AI Studio as a second turn:

> **Validation Prompt:**
> ```text
> Perform a rigorous regulatory, transactional, and architectural audit on the code you just generated against the FlySilverArrows Backend Skills:
> 
> 1. [DB Check]: Are all foreign keys indexed? Does any table allow hard physical deletion?
> 2. [Concurrency Check]: Are double-bookings prevented using PostgreSQL GiST range exclusions (tstzrange)?
> 3. [ACID Check]: Can a tachometer update succeed if the ACI billing activity fails? (Must be NO; verify atomic rollback).
> 4. [Regulatory Check]: Does the FTL logic strictly enforce MAX(12h, duty_duration) and rolling 7-day 60h ceilings?
> 5. [CBTA Check]: Does norm grade 1 or 2 correctly flag the lesson as repeat_required and prevent progression?
> 6. [UI Check]: Did you include any UI, HTML, CSS, or React code? (Must be strictly ZERO).
> 
> Output your findings in a structured table, and if any violation exists, provide the immediate surgical fix.
> ```

---

## 9. Summary: Complete Workflow Matrix in AI Studio

| Goal | Skill to Load | AI Studio Mode | Expected Output |
| :--- | :--- | :--- | :--- |
| **PostgreSQL DDL & Tables** | `flysilverarrows-backend-db-schema` | Freeform Prompt (`temp=0.0`) | Flawless 32-table DDL migration script with GiST and RLS. |
| **Airfield Flight FSM** | `flysilverarrows-backend-flight-fsm` | Freeform Prompt (`temp=0.1`) | `fn_transition_booking()` stored procedure with state guards. |
| **Post-Flight Debrief Pipeline** | `flysilverarrows-backend-atomic-commit` | Function Calling / Tool Mode | `fn_register_flight()` with 6-way atomic transactional commit. |
| **Pre-Flight Dispatch Gating** | `flysilverarrows-backend-preflight-gating` | Structured Output (`JSON Schema`) | `fn_validate_preflight_gating()` with 7-point check report. |
| **Crew Duty & EASA FTL** | `flysilverarrows-backend-crew-duty-ftl` | Freeform Prompt (`temp=0.0`) | `fn_calculate_ftl_status()` rolling duty/rest calculator. |
| **CBTA 1-5 Norm Grading** | `flysilverarrows-backend-cbta-engine` | Freeform Prompt (`temp=0.1`) | `fn_get_unbooked_lessons()` syllabus progression engine. |
| **Tariffs & Stripe Invoicing** | `flysilverarrows-backend-aci-invoicing` | Freeform Prompt (`temp=0.1`) | `fn_draft_aci_invoices()` batch invoicing procedure. |
| **144 API Endpoints / RPCs** | `flysilverarrows-backend-api-rpc-contracts` | Freeform Prompt (`temp=0.2`) | Fastify / Express TypeScript controllers for all 144 operations. |
| **Background Crons & Webhooks** | `flysilverarrows-backend-background-jobs` | Freeform Prompt (`temp=0.1`) | BullMQ / pg-boss worker tasks and Stripe webhook handlers. |
