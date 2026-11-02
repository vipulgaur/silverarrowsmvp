#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs";

const ELEARNING_BRANCH = "parthbhatt";
const MAIN_BRANCH = "main";

const ALLOWED_ELEARNING_PREFIXES = [
  "src/elearning/",
  "src/content/learning/",
  "src/assets/learning/",
  "src/assets/airlaw/",
  "src/assets/airframes/",
  "src/assets/electrics/",
  "src/assets/powerplant/",
  "src/routes/elearning.tsx",
  "src/routes/_shell.learning.index.tsx",
  "src/routes/_shell.learning.$chapterId.tsx",
  "src/components/assigned-courses-panel.tsx",
  "src/components/learning-reader.tsx",
  "src/components/learning-diagram.tsx",
  "src/components/learning-blocks.tsx",
  "src/components/air-law-chapter-experience.tsx",
  "src/components/familiarisation-chapter-experience.tsx",
  "src/components/universal-chapter-experience.tsx",
  "src/lib/elearning-courses.ts",
  "src/lib/learning-subjects.ts",
  "src/lib/learning-content.ts",
  "src/lib/learning-source.ts",
  "src/lib/learning-state.ts",
  "src/lib/learning-illustrations.ts",
  "src/lib/airframes-content.ts",
  "src/lib/airframes-illustrations.ts",
  "src/lib/airlaw-content.ts",
  "src/lib/airlaw-illustrations.ts",
  "src/lib/electrics-content.ts",
  "src/lib/electrics-illustrations.ts",
  "src/lib/powerplant-content.ts",
  "src/lib/powerplant-illustrations.ts",
  "src/lib/universal-chapter-data.ts",
  "src/lib/chapter-01-redesign-data.ts",
];

function run(cmd) {
  return execSync(cmd, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
}

function isAllowedPath(filePath) {
  return ALLOWED_ELEARNING_PREFIXES.some(
    (prefix) => filePath === prefix || filePath.startsWith(prefix),
  );
}

const args = process.argv.slice(2);
const mode = args[0] || "--status";

try {
  const currentBranch = run("git rev-parse --abbrev-ref HEAD");

  if (mode === "--status") {
    const branches = run("git branch -a");
    console.log("=== SilverArrows E-Learning Branch & Workspace Status ===");
    console.log(`Current Branch : ${currentBranch}`);
    console.log(`E-Learning Dev : ${ELEARNING_BRANCH} (Parth Bhatt — E-Learning Only)`);
    console.log(`Primary Branch : ${MAIN_BRANCH} (Vipul — Full FlightLogger + E-Learning)`);
    console.log("\nAvailable Git Branches:");
    console.log(branches);
    console.log("\nAllowed E-Learning Paths for 'parthbhatt':");
    for (const p of ALLOWED_ELEARNING_PREFIXES) {
      console.log(`  - ${p}`);
    }
    process.exit(0);
  }

  if (mode === "--report") {
    try {
      run(`git fetch origin ${ELEARNING_BRANCH}`);
    } catch {
      // Offline fallback
    }
    let targetRef = `origin/${ELEARNING_BRANCH}`;
    try {
      run(`git rev-parse --verify ${targetRef}`);
    } catch {
      targetRef = ELEARNING_BRANCH;
    }

    console.log("====================================================================");
    console.log("  PARTH BHATT (parthbhatt) — E-LEARNING ACTIVITY & DIFF REPORT");
    console.log("====================================================================");
    const recentCommits = run(`git log -n 8 --oneline ${targetRef}`);
    console.log("\nRecent Commits on parthbhatt:");
    console.log(recentCommits || "  (No commits)");

    const diffStat = run(`git diff --stat ${MAIN_BRANCH}...${targetRef}`);
    console.log(`\nFiles Changed on ${targetRef} vs ${MAIN_BRANCH}:`);
    console.log(diffStat || "  (Branches are currently identical — no unmerged file diffs)");

    if (fs.existsSync("src/elearning/dev-workspace-data.json")) {
      const workspaceData = JSON.parse(
        fs.readFileSync("src/elearning/dev-workspace-data.json", "utf8"),
      );
      console.log(`\nActive Directives (${workspaceData.tasks.length}):`);
      for (const t of workspaceData.tasks) {
        console.log(
          `  • [${t.id}] ${t.title} (${t.courseTitle} · ${t.targetChapterLabel}) — Status: ${t.status.toUpperCase()}`,
        );
        console.log(`    What To Do     : ${t.whatToDo.join(" | ")}`);
        console.log(`    What NOT To Do : ${t.whatNotToDo.join(" | ")}`);
        if (t.reports && t.reports.length > 0) {
          for (const r of t.reports) {
            console.log(
              `    -> Report [${r.id}] (${r.commitHash}): ${r.summary}`,
            );
          }
        }
      }
    }
    process.exit(0);
  }

  if (mode === "--check") {
    let baseRef = MAIN_BRANCH;
    try {
      run(`git rev-parse --verify ${MAIN_BRANCH}`);
    } catch {
      baseRef = "HEAD~1";
    }
    const diffOutput = run(`git diff --name-only ${baseRef}...HEAD`);
    const workingDiff = run("git status --porcelain")
      .split("\n")
      .filter(Boolean)
      .map((line) => line.slice(3).trim());

    const changedFiles = Array.from(
      new Set([...diffOutput.split("\n").filter(Boolean), ...workingDiff]),
    );

    const violations = changedFiles.filter((file) => !isAllowedPath(file));

    if (violations.length > 0) {
      console.error(
        `[BOUNDARY VIOLATION] The '${ELEARNING_BRANCH}' branch modified files outside the E-Learning scope:`,
      );
      for (const v of violations) {
        console.error(`  ✗ ${v}`);
      }
      console.error(
        "\nOnly files inside the E-Learning workspace are permitted on the 'parthbhatt' branch. FlightLogger files are strictly locked.",
      );
      process.exit(1);
    }

    console.log(
      `✓ Boundary check passed (${changedFiles.length} E-Learning file(s) verified). Zero FlightLogger files touched.`,
    );
    process.exit(0);
  }

  if (mode === "--pull") {
    let sourceRef = ELEARNING_BRANCH;
    try {
      run(`git fetch origin ${ELEARNING_BRANCH}`);
      sourceRef = `origin/${ELEARNING_BRANCH}`;
    } catch {
      sourceRef = ELEARNING_BRANCH;
    }

    console.log(
      `Syncing E-Learning paths from '${sourceRef}' into '${currentBranch}'...`,
    );
    const existingAllowed = ALLOWED_ELEARNING_PREFIXES.filter((p) => {
      try {
        const out = run(`git ls-tree -r --name-only ${sourceRef} -- "${p}"`);
        return out.length > 0;
      } catch {
        return false;
      }
    });
    if (existingAllowed.length > 0) {
      const quotedPaths = existingAllowed.map((p) => `"${p}"`).join(" ");
      execSync(`git checkout ${sourceRef} -- ${quotedPaths}`, {
        stdio: "inherit",
      });
    }
    // Always ensure workspace-config.ts on main keeps ELEARNING_BRANCH_LOCK = false for Vipul
    if (currentBranch === MAIN_BRANCH && fs.existsSync("src/elearning/workspace-config.ts")) {
      const cfg = fs.readFileSync("src/elearning/workspace-config.ts", "utf8");
      const unlocked = cfg.replace(
        /export const ELEARNING_BRANCH_LOCK:\s*boolean\s*=\s*true;/g,
        'export const ELEARNING_BRANCH_LOCK: boolean =\n  typeof import.meta !== "undefined" &&\n  import.meta.env?.VITE_ELEARNING_ONLY_MODE === "true";',
      );
      fs.writeFileSync("src/elearning/workspace-config.ts", unlocked, "utf8");
    }
    console.log(
      `✓ Successfully synced E-Learning changes from '${sourceRef}' into '${currentBranch}'. FlightLogger core files remain untouched.`,
    );
    process.exit(0);
  }

  console.error(
    "Usage: node scripts/elearning-sync.mjs [--status | --report | --check | --pull]",
  );
  process.exit(1);
} catch (err) {
  console.error("Error running elearning-sync:", err.message || err);
  process.exit(1);
}
