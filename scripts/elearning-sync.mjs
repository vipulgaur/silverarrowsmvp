#!/usr/bin/env node
import { execSync } from "node:child_process";

const ELEARNING_BRANCH = "parthbhatt";
const MAIN_BRANCH = "main";

const ALLOWED_ELEARNING_PREFIXES = [
  "src/elearning/",
  "src/content/learning/",
  "src/assets/learning/",
  "src/routes/elearning.tsx",
  "src/routes/_shell.learning.index.tsx",
  "src/routes/_shell.learning.$chapterId.tsx",
  "src/routes/_shell.portal.ground.tsx",
  "src/components/assigned-courses-panel.tsx",
  "src/components/learning-reader.tsx",
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
    console.log(`E-Learning Dev : ${ELEARNING_BRANCH}`);
    console.log(`Primary Branch : ${MAIN_BRANCH}`);
    console.log("\nAvailable Git Branches:");
    console.log(branches);
    console.log("\nAllowed E-Learning Paths for 'parthbhatt':");
    for (const p of ALLOWED_ELEARNING_PREFIXES) {
      console.log(`  - ${p}`);
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
        "\nOnly files inside the E-Learning workspace are permitted on the 'parthbhatt' branch.",
      );
      process.exit(1);
    }

    console.log(
      `✓ Boundary check passed (${changedFiles.length} E-Learning file(s) verified).`,
    );
    process.exit(0);
  }

  if (mode === "--pull") {
    let sourceRef = ELEARNING_BRANCH;
    try {
      run(`git fetch origin ${ELEARNING_BRANCH}`);
      sourceRef = `origin/${ELEARNING_BRANCH}`;
    } catch {
      // Fallback to local parthbhatt branch when working offline
      sourceRef = ELEARNING_BRANCH;
    }

    console.log(
      `Syncing E-Learning paths from '${sourceRef}' into '${currentBranch}'...`,
    );
    const quotedPaths = ALLOWED_ELEARNING_PREFIXES.map((p) => `"${p}"`).join(" ");
    execSync(`git checkout ${sourceRef} -- ${quotedPaths}`, {
      stdio: "inherit",
    });
    console.log(
      `✓ Successfully synced E-Learning changes from '${sourceRef}' into '${currentBranch}'. FlightLogger core files remain untouched.`,
    );
    process.exit(0);
  }

  console.error("Usage: node scripts/elearning-sync.mjs [--status | --check | --pull]");
  process.exit(1);
} catch (err) {
  console.error("Error running elearning-sync:", err.message || err);
  process.exit(1);
}
