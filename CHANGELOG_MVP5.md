# SilverArrows Flight Academy — MVP-5 Built v1
## Release Notes, Changelog & Project Execution Guide

---

## 1. Executive Summary

**MVP-5 Built v1** is a landmark milestone for the **SilverArrows Flight Academy OS**, delivering an end-to-end interactive flight training suite, an interactive WebGL 3D Aircraft Atlas, a completely redesigned glassmorphic authentication experience with an embedded atmospheric flight mini-game, and a controlled testing environment.

---

## 2. What's New in MVP-5 Built v1

### A. Atmospheric Flight Mini-Game: "Token Collector & Waypoint Scout"
- **Drifting Collectables Across the Sky**:
  - **SilverArrows Flight Wings (✦)**: Golden flight medallions awarding **+100 PTS** with pulsing golden aura.
  - **Jet-A Fuel Canisters (⛽)**: Aviation fuel barrels awarding **+50 PTS** and refilling **+25%** fuel reserve.
  - **Aeronautical Waypoints (▲)**: Navigational diamond fixes (`VOR · SA`, `FIX · LHR`, `FIX · FRA`, `FIX · AMS`) awarding **+75 PTS**.
- **Interactive Flight Physics & Collision**: Steering the Cessna 172 into drifting tokens triggers visual particle pops and animated floating score tags (`+100 ✦ WINGS!`, `+50 ⛽ JET-A!`, etc.).
- **Runway 27L Touchdown Refuel**: Hovering the cursor near the bottom of the screen flares the Cessna onto Runway 27L, triggering a **`🛬 RUNWAY 27L REFUEL +150 PTS`** bonus and replenishing fuel reserve to 100%.
- **Glass Cockpit Telemetry HUD** (Top-Right):
  - Real-time digital readout of **Score**, **Waypoints Logged**, **Combo Streak**, and an animated **Fuel Reserve Gauge**.
  - Dynamic **Pilot Rank Progression**: Automatically advances from `STUDENT PILOT` $\rightarrow$ `SOLO CADET` $\rightarrow$ `COMMERCIAL PILOT` $\rightarrow$ `CHIEF CAPTAIN`.
  - Single-click **Minimize Toggle** (`✦ 350 PTS ▾`) and quick **Reset** (`↺`).

### B. Airfield Runway & Air Traffic Control (ATC) Tower
- **Air Traffic Control (ATC) Tower**:
  - Detailed architectural tower shaft with concrete fluting and warm illuminated vertical stairwell slit windows.
  - Panoramic multi-sided canted glass Visual Control Room (VCR) with interior illuminated radar monitors (emerald, amber, cyan).
  - Rooftop observation catwalk with safety railings, primary radar radome, anemometer mast, and communications antenna.
  - FAA-standard **flashing red obstruction beacon** at the summit.
  - Tower callsign plaque: `SA TWR` alongside Runway 27L.
- **Runway 27L**:
  - Paved asphalt deck with threshold piano keys, centerline dashes, touchdown zone markings, and pulsing amber runway edge lights.
  - Horizon tree line silhouette framing the airfield boundary.

### C. Cessna 172 Night Headlight & Flight Physics
- **Volumetric Warm Headlight Beam**: In dark mode, a warm halogen/incandescent light cone (`#ffffff` core $\rightarrow$ `#fef08a` $\rightarrow$ `#fbbf24` $\rightarrow$ `#f59e0b`) projects 240px forward through the night sky.
- **Glowing Cowl Filament Lens**: Golden-amber incandescent bulb at the nose cowl with atmospheric halo.
- **Aerodynamic Aircraft Inertia**: Slower, realistic tracking physics (`easeX = 0.020`, `easeY = 0.018`) with smooth turn banking and vertical climb/descent pitch.
- **Full Volumetric Cumulus Clouds**: 360-degree rounded, puffy cloud lobes continuously traversing the sky horizontally across 5 staggered drift tracks.

### D. Redesigned Centered Glassmorphic Authentication
- **Centered Landscape Rectangle Card**: Standardized width-greater-than-length layout with backdrop blur (`backdrop-blur-xl`), translucent dark glass, and hairline borders.
- **Unified Mode Switcher**: Seamless switching between **Portal Sign In** and **Register Profile**.
- **Controlled Testing Environment**:
  - Private fixed testing password: `Vipul@1011` (never exposed in UI text or public displays).
  - Quick Login dropdown populated with standardized testing personas.
  - Account format: `{firstname}@flysilverarrows.com` (e.g. `sakshi@flysilverarrows.com`, `ananya@flysilverarrows.com`, `marcus@flysilverarrows.com`).
  - Account registration directly persists to the local database table.

### E. 3D WebGL Aircraft Atlas · Cessna 172S Skyhawk SP
- **Complete Procedural 3D Cessna 172S**:
  - High-wing airfoil geometry with diagonal cabin struts.
  - Lycoming IO-360-L2A engine assembly with McCauley 2-blade fixed-pitch propeller and exhaust system.
  - Fuel system with dual 28-gallon integral wing tanks, fuel selector valve, electric auxiliary fuel pump, and fuel strainer.
  - Tricycle landing gear with steerable nose gear oleo strut and main spring-steel gear.
  - Full **Garmin G1000 Glass Cockpit** with Primary Flight Display (PFD), Multi-Function Display (MFD), audio panel, dual control yokes, throttle/mixture quadrant, and flap selector.
- **Interactive Exploration Modes**:
  - **Explode Slider (0% to 100%)**: Smooth radial disassembly exposing all internal structural frames and systems.
  - **X-Ray See-Through**: Translucent fuselage skin for internal plumbing inspection.
  - **System Isolation**: Isolate Structure, Propulsion, Fuel, Flight Controls, Landing Gear, or Cockpit Avionics.
  - **Full-Screen Expansion Mode**: Expands 3D viewport into an immersive full-window inspection stage.
  - **Guided Audio-Visual Tours**: Narrated camera tours through Airframe, Powerplant, and Avionics.
  - **Interactive Checkride Quiz**: 10-question EASA/FAA system knowledge exam.

### F. Homepage Continuous Takeoff Animation
- Seamless, continuous takeoff roll and circle climb.
- Preserved aircraft silhouette across cross-region flight that transforms directly into the brand logo lockup upon reaching the target container.

---

## 3. How to Run This Project

### Prerequisites
- **Node.js**: Version **24 LTS** (or Node.js **22.12+**) from [nodejs.org](https://nodejs.org).
- **npm**: Included with Node.js (v10+).
- **No external accounts, API keys, or cloud database setup required** (runs 100% self-contained in browser with local persistence).

---

### Method 1: The Canonical One-Click Launcher (Recommended)

1. Open your terminal in the extracted project folder:
   ```bash
   cd flysilverarrows
   ```
2. Run the launcher script:
   ```bash
   node run.mjs
   ```
   *Windows shortcut:* Double-click `run.bat`  
   *macOS / Linux shortcut:* Run `sh run.sh`

> **What this does:**
> - Automatically validates public registry dependencies (`npm install` if needed).
> - Runs the automated 65-test regression check (`vitest run`).
> - Starts the local server on `http://localhost:8080` (or the next available port) and opens your default browser.

---

### Method 2: Fast Local Development Mode

If you are iterating on code and want hot-module reloading without running setup tests each time:

```bash
npm run dev:local
```
Or specify a custom port:
```bash
npm run dev:local -- --port 8081
```
Open **`http://localhost:8081`** in your browser.

---

### Method 3: Portable Production Build & Server

To test the portable production server build:

```bash
# 1. Compile the production bundle
npm run build:local

# 2. Launch the local Nitro server
npm run start:local
```
The server will listen on **`http://localhost:3000`**.

---

### Running Tests & Integrity Checks

To run the complete test suite:
```bash
npm test
```
To run the pre-flight integrity check without launching a web server:
```bash
node run.mjs --check
```

---

## 4. Testing Accounts & Credentials Directory

All testing accounts in this controlled environment share the fixed master password:

| Full Name | Role | Email | Password |
| :--- | :--- | :--- | :--- |
| **Sakshi Gaur** | Administrator | `sakshi@flysilverarrows.com` | `Vipul@1011` |
| **Ananya Sharma** | Student Pilot | `ananya@flysilverarrows.com` | `Vipul@1011` |
| **Marcus Vance** | Chief Flight Instructor | `marcus@flysilverarrows.com` | `Vipul@1011` |
| **Elena Rostova** | Flight Instructor | `elena@flysilverarrows.com` | `Vipul@1011` |
| **Vikram Malhotra**| Student Pilot | `vikram@flysilverarrows.com` | `Vipul@1011` |
| **David Chen** | Ground Instructor | `david@flysilverarrows.com` | `Vipul@1011` |
| **Priya Patel** | Student Pilot | `priya@flysilverarrows.com` | `Vipul@1011` |

> [!TIP]
> You can also click the **"Quick Login Testing Personas"** dropdown on the Sign In card to automatically populate any testing persona. The password will be prompted securely.

---

## 5. Project Directory Structure

```text
flysilverarrows/
├── src/
│   ├── routes/
│   │   ├── login.tsx                 # Redesigned centered auth & Sky Mini-Game
│   │   ├── index.tsx                 # Homepage with continuous takeoff flight
│   │   ├── _shell.atlas.tsx          # 3D WebGL Cessna 172S Aircraft Atlas
│   │   ├── _shell.dashboard.tsx      # Main role-based dashboard
│   │   ├── _shell.flights.tsx        # Flight logbook & dual-signature sign-offs
│   │   ├── _shell.schedule.tsx       # Flight scheduling & booking engine
│   │   └── _shell.elearning.tsx      # E-Learning Ground School syllabus
│   ├── lib/
│   │   ├── atlas/                    # Three.js Cessna 172S 3D geometry & systems
│   │   ├── store.tsx                 # In-memory reactive AppData store & local sync
│   │   └── logic.ts                  # Pure flight school business rules
│   └── components/
│       ├── theme-provider.tsx        # Light/Dark and color theme state
│       └── app-ui.tsx                # Reusable UI component library
├── run.mjs                           # Portable zero-config launcher
├── vite.local.ts                     # Standalone Vite configuration
├── package.json                      # Dependency declarations
└── CHANGELOG_MVP5.md                 # This file
```

---

*SilverArrows Flight Academy OS · EASA Part-FCL Compliant Training Platform*
