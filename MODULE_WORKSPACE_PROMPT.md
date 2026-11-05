# Master Implementation Prompt — Immersive E-Learning Module Workspace

> Hand this to Lovable to implement (or reproduce) the full-viewport learning
> workspace for ANY e-learning module. It is deliberately module-agnostic: it
> describes the design, layout, behavior, and constraints — not one specific
> course. Apply it to every module in the platform.

## 0. Objective

Replace the classic chapter-reader view with an **immersive, full-viewport
learning workspace** for every e-learning module and chapter. The workspace fills
the browser viewport, keeps navigation and the video region fixed, and lets the
theory and figure panels scroll independently. The page itself must never scroll.

This is a **layout and interaction redesign only**. Do not change the product's
fonts, colors, theme tokens, branding, data model, routing, or authentication.

## 1. Hard Constraints (do not violate)

- **Do NOT change fonts, colors, theme tokens, or branding.** Reuse the existing
  design tokens / CSS variables (e.g. `--primary`, `--border`, `--background`,
  `--foreground`, `--muted`, `--card`) and existing shared prose styles. No new
  design system, no new palette, no global typography changes.
- **Do NOT fabricate content.** Bind every screen region to real, existing module
  data. If a region has no data for a topic, hide it (see §7) — do not invent
  placeholder content.
- **Do NOT break existing functionality:** chapter navigation, topic/section
  navigation, progress, mark-complete, bookmarks, notes, quizzes/MCQs,
  authentication, authorization/RBAC, routing, and learning-state persistence must
  all keep working through the existing handlers/APIs.
- **Preserve all data contracts:** module IDs, chapter IDs, topic/section IDs,
  figure IDs, user records, and media references.
- **Reuse, don't duplicate:** reuse the existing content parser, the markdown/
  prose renderer, the figure/hotspot renderer, buttons, and theme components. Only
  create new components for the layout shell.
- **Keep it generic:** one reusable workspace component drives every module. The
  module identity (title, chapters, figure assets) is passed in as props — never
  hardcode a specific course.

## 2. Data Model (use what exists; adapt names to your app)

The workspace renders from a **chapter** object that already exists in the app:

- `chapter`: `{ id, number, title, sections[] }`
- `chapters[]`: the full ordered list for the module (for the sidebar)
- `section` (a "topic"): `{ id, title, blocks[] }`
- `block`: either `{ type: "markdown", text }` or `{ type: "image", figure }`
- `figure`: `{ id, title?, caption?, prompt? }`
- `figureAssets` (optional, per-module): `Record<figureId, { src, alt, parts[] }>`

**Topics** = the chapter's parsed `sections`. The topic filter bar is built from
`chapter.sections`. **Theory** = the active section's `markdown` blocks.
**Figures** = the active section's `image` blocks.

> If your content is markdown, parse `## headings` into sections and extract
> figures from an agreed image syntax, e.g. `![Fig-CC-NN: Title](prompt or caption)`.
> Keep figure IDs **namespaced per module** (e.g. prefix or a per-module asset map)
> so identical figure numbers in different modules never collide.

## 3. Component Structure

Create ONE reusable component (name it generically, e.g. `ModuleLearningWorkspace`)
with these props:

```
ModuleLearningWorkspace({
  chapter,            // current chapter object
  chapters,           // all chapters in the module (for sidebar)
  courseTitle,        // module display name
  moduleId,           // short module code shown in the title row
  completed,          // current chapter completion state
  bookmarked,         // current chapter bookmark state
  onToggleComplete,   // wire to existing save/learning-state handler
  onToggleBookmark,   // wire to existing save/learning-state handler
  onSelectChapter,    // wire to existing chapter-nav handler
  onBack,             // wire to existing back-navigation
  onLogInteraction,   // wire to existing audit/log handler
  figureAssets,       // OPTIONAL per-module asset map, resolved before any global map
})
```

Internal layout tree:

```
ModuleLearningWorkspace (full viewport, h-[100dvh], overflow hidden)
|-- Body (flex, fills remaining height)
|   |-- ChapterSidebar (fixed, ~15% width)        // chapters + Quizzes + MCQs ONLY
|   |-- ChapterWorkspace (flex column, fills rest)
|       |-- ChapterTitleRow (fixed)               // Back + title + Bookmark + Complete + moduleId
|       |-- TopicFilterBar (fixed, horizontal)    // the chapter's sections/topics
|       |-- LearningContent (fills rest)
|           |-- VideoSection (fixed)              // only if the topic has video(s)
|           |-- TopicContent (flex, scrolls)
|               |-- TheoryPanel (~60%, scrolls)
|               |-- ImagePanel (~40%, scrolls)    // only if the topic has figures
```

## 4. Layout & Proportions

Use CSS grid/flex with `min-h-0` / `min-w-0` and `overflow-hidden` discipline so
only the intended panels scroll. Target proportions (visual intent, not rigid):

| Region             | Target                                   |
|--------------------|------------------------------------------|
| Chapter sidebar    | ~15% of width (min ~160px, max ~280px)   |
| Theory panel       | ~60% of the topic-content width          |
| Image panel        | ~40% of the topic-content width          |
| Video section      | fixed height; does not scroll away       |

- Root: `h-[100dvh] w-full flex flex-col overflow-hidden`.
- Fixed regions (`shrink-0`): sidebar, chapter title row, topic filter bar, video
  section.
- Scrollable regions (`overflow-y-auto`, independent): theory panel, image panel.
- **No page-level vertical scroll. No horizontal scrollbar. No overlap. No content
  hidden behind fixed regions.**

## 5. Region Specs

### 5.1 Chapter Sidebar (~15%)
- Contains **only**: the list of chapters (number + title), plus **Quizzes** and
  **MCQs** entries. Nothing else (no topics, no descriptions, no progress cards).
- Highlight the active chapter. Clicking a chapter calls `onSelectChapter(id)`.
- Internally scrollable if the list is long.

### 5.2 Chapter Title Row (compact)
- Left: a **Back** button (if `onBack` given) + the chapter label
  `CHAPTER NN - TITLE`.
- Right: **Bookmark** toggle, **Mark complete** toggle, and the short `moduleId`.
- **No standalone global header bar.** No theme toggle inside this workspace (the
  app's global theme control lives elsewhere). No chapter description, no oversized
  heading, no redundant progress card.

### 5.3 Topic Filter Bar (horizontal)
- Built from `chapter.sections`. Render each section title as a horizontal,
  selectable pill. `overflow-x-auto` when they exceed the width.
- Highlight the active topic. Selecting a topic updates the video, theory, and
  image panels together and calls `onLogInteraction`.
- No subtopic navigation here (subtopics live inside the theory).
- Reset the active topic to the first section whenever the chapter changes.

### 5.4 Video Section (fixed, conditional)
- If the active topic has video(s): render a responsive `aspect-video` player.
- If it has none: **render nothing** (no empty placeholder box). Keep the slot in
  code so video appears automatically when video data is added later.
- Stays fixed while the theory/image panels scroll.

### 5.5 Theory Panel (~60%, scrolls)
- Render the active topic's markdown blocks with the **existing prose renderer**
  inside the shared prose class.
- **Typography:** use proper `H1 / H2 / H3` with clear visual differentiation, and
  set the reading body size **+2px** over the app default, scoped to this panel
  only (e.g. a `prose-lg`-style class — do NOT change global type).
- **Justify** the body text (full alignment).

### 5.6 Image / Figure Panel (~40%, scrolls, conditional)
- Render the active topic's figures with the **existing figure renderer**.
- Resolve a figure's asset from the **per-module `figureAssets` first**, then any
  global map, so figure IDs never collide across modules.
- **Do NOT render numbered callout markers or a callout legend over figures.**
- Add an **Expand** control on each figure that opens it **full-screen** (overlay
  viewer, click/Esc to close).
- If the figure asset is missing, show the figure's **prompt/caption text** as a
  clean card (prompt-card fallback) — never a random image.
- If the active topic has **no figures**, **hide the entire image panel** and let
  the theory panel take the full width. Keep the figure logic intact for topics/
  modules that do have images.

## 6. Behavior & Wiring

- **Chapter nav:** sidebar -> `onSelectChapter`. Keep the existing route/record
  mapping (e.g. record id `"<moduleKey>-<chapterId>"`).
- **Progress / complete / bookmark / notes:** wire to the existing learning-state
  save path. Do not invent new persistence.
- **Quizzes / MCQs:** keep the existing behavior and navigation.
- **Audit log:** every user action (topic select, figure expand, complete,
  bookmark, chapter nav) calls `onLogInteraction(action, detail)`.
- **Auth / RBAC:** unchanged; the workspace renders only for users allowed to view
  the module, through the existing guard.

## 7. Empty States (consistent rule)

A region that has no data for the current topic is **hidden**, not shown as an
empty placeholder — this applies to the **video section** and the **image panel**.
The logic that would render them is preserved so they appear when data exists.

## 8. Performance (required)

Avoid re-rendering heavy content on unrelated state changes:

- Hoist the markdown renderer's `components` map and plugin array to **stable
  module-level constants** (never recreate per render).
- **Memoize** the theory renderer and each figure card (`React.memo`), and wrap
  callbacks passed to them (e.g. expand handler) in `useCallback`.
- Lazy-load / code-split the workspace and its content graph so the catalogue view
  stays light.
- Do not ship oversized images for small thumbnails; use appropriately sized
  assets and `loading="lazy"` / `decoding="async"`.

## 9. Accessibility

- Keyboard-operable sidebar, topic pills, bookmark/complete, figure expand, and the
  full-screen viewer (focusable, Esc to close, `aria-modal`).
- `aria-current` on the active chapter; `aria-pressed`/`aria-selected` on the active
  topic. Meaningful `alt` text on figures. Maintain visible focus states and
  adequate contrast using the existing tokens.

## 10. Apply to ALL Modules

- The workspace is the default learning view for **every module and chapter** that
  has parsed content (not one course).
- Each module supplies its own `chapters`, `courseTitle`, `moduleId`, and (optional)
  per-module `figureAssets`. No module-specific logic inside the workspace.
- If a specific chapter already has a bespoke experience you want to keep, gate that
  one chapter explicitly; everything else uses this workspace.

## 11. Acceptance Criteria

- [ ] Every module/chapter with content renders in the full-viewport workspace.
- [ ] Sidebar shows chapters + Quizzes + MCQs only; active chapter highlighted.
- [ ] Compact title row with Back + title + Bookmark + Complete + moduleId; no
      standalone header bar; no theme toggle inside the workspace.
- [ ] Horizontal topic bar from the real sections; selecting a topic swaps video,
      theory, and figures together.
- [ ] Theory ~60%, justified, with H1/H2/H3 and +2px body (scoped), scrolls
      independently.
- [ ] Image panel ~40%, scrolls independently; figures have Expand -> full-screen;
      no callout numbers/legend; hidden entirely when the topic has no figures
      (theory goes full width).
- [ ] Video section shows only when the topic has video; otherwise hidden.
- [ ] Fonts, colors, theme, branding unchanged. No global style edits.
- [ ] Chapter nav, progress, complete, bookmark, notes, quizzes, MCQs, auth, and
      routing all still work.
- [ ] No page-level scroll, no horizontal scrollbar, no overlap, no content hidden
      behind fixed regions.
- [ ] App builds; no console errors; no broken routes or data requests.

## 12. Verification Before Done

Run the project's type check, tests, and production build; fix regressions. Confirm
in the browser on at least two different modules and on a figure-bearing chapter and
a text-only chapter. Report what changed, which existing components were reused, and
any limitations.

## 13. Out of Scope (do not do)

- No new color scheme, fonts, or design system.
- No content rewriting or fabricated figures/videos.
- No changes to backend, database, auth, or unrelated pages (home, login, admin).
- No committing or pushing unless explicitly asked; if the repo syncs to a hosted
  editor, keep the connected branch in a working state and never rewrite pushed
  history.
