# SilverArrows E-Learning Workspace (`parthbhatt` Branch)

This workspace segregates the **SilverArrows E-Learning Ground School** from the core **FlightLogger Operations Platform** so that:
- **Parth Bhatt (`parthbhatt` branch)** can independently develop E-Learning courses, Markdown lessons, interactive hotspot illustrations, quizzes, and the `/elearning` platform.
- **Primary Maintainer (`main` branch)** can work across the entire platform (FlightLogger + E-Learning) and pull Parth's E-Learning updates into `main` with a single command (`npm run elearning:pull`) without merge conflicts or risk to FlightLogger code.

---

## 1. Directory & File Ownership (`parthbhatt` Branch)

When working on the `parthbhatt` branch, **only** modify or add files inside these E-Learning directories and modules:

### A. E-Learning Hub & Entry Routes
- `src/elearning/**` — E-Learning barrel exports, workspace config, and new E-Learning sub-components
- `src/routes/elearning.tsx` — Standalone E-Learning Ground School portal (`/elearning`)
- `src/routes/_shell.learning.index.tsx` — In-app syllabus index (`/learning`)
- `src/routes/_shell.learning.$chapterId.tsx` — Chapter reader route (`/learning/$chapterId`)
- `src/routes/_shell.portal.ground.tsx` — Ground Instructor portal (`/portal/ground`)

### B. E-Learning Content & Artwork Resources
- `src/content/learning/**` — Markdown lesson files (`airframes/`, `airlaw/`, `electrics/`, `powerplant/`, `chapter-01.md`..`chapter-03.md`)
- `src/assets/learning/**` — Generated technical diagrams and aviation illustrations

### C. E-Learning Reader & Interactive Experience Components
- `src/components/assigned-courses-panel.tsx`
- `src/components/learning-reader.tsx`
- `src/components/learning-blocks.tsx`
- `src/components/air-law-chapter-experience.tsx`
- `src/components/familiarisation-chapter-experience.tsx`
- `src/components/universal-chapter-experience.tsx`

### D. E-Learning Data, Subjects, Illustrations & State
- `src/lib/elearning-courses.ts`
- `src/lib/learning-subjects.ts`
- `src/lib/learning-content.ts`
- `src/lib/learning-source.ts`
- `src/lib/learning-state.ts`
- `src/lib/learning-illustrations.ts`
- `src/lib/airframes-content.ts` & `src/lib/airframes-illustrations.ts`
- `src/lib/airlaw-content.ts` & `src/lib/airlaw-illustrations.ts`
- `src/lib/electrics-content.ts` & `src/lib/electrics-illustrations.ts`
- `src/lib/powerplant-content.ts` & `src/lib/powerplant-illustrations.ts`
- `src/lib/universal-chapter-data.ts`
- `src/lib/chapter-01-redesign-data.ts`

---

## 2. Workflow for Parth Bhatt (`parthbhatt` Branch)

```bash
# 1. Clone ONLY the parthbhatt branch
git clone -b parthbhatt --single-branch https://github.com/vipulgaur/silverarrowsmvp.git
cd silverarrowsmvp

# 2. Install dependencies and start the server
npm install
npm run dev
# Open http://localhost:3000/elearning

# 3. Before committing/pushing, verify only E-Learning files were touched
npm run elearning:check

# 4. Commit and push to the parthbhatt branch
git add .
git commit -m "feat(elearning): update ground school lessons and reader"
git push origin parthbhatt
```

---

## 3. Workflow for Main Application Owner (`main` Branch)

Whenever Parth pushes new work to `origin/parthbhatt`, run:

```bash
# Fetch and sync ONLY the E-Learning files from parthbhatt into your current branch
npm run elearning:pull
```

This command:
1. Fetches the latest `parthbhatt` branch (`git fetch origin parthbhatt`).
2. Validates that all incoming changes are strictly within the allowed E-Learning paths.
3. Checks out the updated E-Learning files directly into your `main` working tree so you immediately see Parth's E-Learning updates in your application while keeping 100% of your FlightLogger code untouched.
