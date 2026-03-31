/**
 * Lighthouse mobile audit — informational, not a hard gate.
 *
 * Starts a production server and runs Lighthouse against homepage, /work, and
 * /contact. Outputs HTML reports to lighthouse-reports/ and prints a summary.
 *
 * Usage:  node scripts/lighthouse-audit.mjs
 *         node scripts/lighthouse-audit.mjs --skip-build
 *
 * Requires: Chrome/Chromium installed (Playwright's Chromium works).
 *
 * Security note: All child_process calls use hardcoded commands with no user
 * input — no command injection risk.
 */

import { spawn, execSync, spawnSync } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const PORT = 3200;
const BASE = `http://127.0.0.1:${PORT}`;
const STARTUP_TIMEOUT_MS = 60_000;
const SKIP_BUILD = process.argv.includes("--skip-build");
const REPORT_DIR = join(import.meta.dirname, "..", "lighthouse-reports");

const PAGES = [
  { name: "home", path: "/" },
  { name: "work", path: "/work" },
  { name: "contact", path: "/contact" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function waitForServer() {
  const start = Date.now();
  while (Date.now() - start < STARTUP_TIMEOUT_MS) {
    try {
      const res = await fetch(BASE, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return;
    } catch {
      // not ready yet
    }
    await delay(500);
  }
  throw new Error(`Server did not respond within ${STARTUP_TIMEOUT_MS / 1000}s`);
}

function runLighthouse(url, outputPath) {
  const result = spawnSync(
    "npx",
    [
      "lighthouse",
      url,
      "--form-factor=mobile",
      "--screenEmulation.mobile",
      "--throttling-method=simulate",
      `--output-path=${outputPath}`,
      "--output=json",
      "--output=html",
      "--chrome-flags=--headless=new --no-sandbox",
      "--quiet",
    ],
    { stdio: "pipe", timeout: 120_000, env: { ...process.env } },
  );

  if (result.status !== 0) {
    const stderr = result.stderr?.toString().trim() || "unknown error";
    console.error(`\x1b[31m  ✗ Lighthouse failed for ${url}: ${stderr}\x1b[0m`);
    return null;
  }

  try {
    const json = JSON.parse(readFileSync(`${outputPath}.report.json`, "utf-8"));
    return {
      performance: Math.round(json.categories.performance.score * 100),
      accessibility: Math.round(json.categories.accessibility.score * 100),
      bestPractices: Math.round(json.categories["best-practices"].score * 100),
      seo: Math.round(json.categories.seo.score * 100),
    };
  } catch {
    console.error(`\x1b[33m  ⚠ Could not parse Lighthouse JSON for ${url}\x1b[0m`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!existsSync(REPORT_DIR)) {
    mkdirSync(REPORT_DIR, { recursive: true });
  }

  // 1. Build
  if (!SKIP_BUILD) {
    console.log("\n\x1b[1m--- Building project ---\x1b[0m\n");
    try {
      execSync("npx next build", { stdio: "inherit", cwd: process.cwd() });
    } catch {
      console.error("\n\x1b[31mBuild failed. Aborting.\x1b[0m\n");
      process.exit(1);
    }
  } else {
    console.log(`\x1b[36m  ℹ\x1b[0m Skipping build (--skip-build)`);
  }

  // 2. Start server
  console.log(`\n\x1b[1m--- Starting production server on port ${PORT} ---\x1b[0m\n`);
  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    stdio: "pipe",
    env: { ...process.env },
    cwd: process.cwd(),
  });

  server.stderr.on("data", (chunk) => {
    const text = chunk.toString().trim();
    if (text) console.error(`  [server] ${text}`);
  });

  try {
    await waitForServer();
    console.log(`\x1b[36m  ℹ\x1b[0m Server ready at ${BASE}\n`);

    // 3. Run Lighthouse per page
    const scores = [];
    for (const page of PAGES) {
      const url = `${BASE}${page.path}`;
      const outputPath = join(REPORT_DIR, page.name);
      console.log(`\x1b[1m  Auditing ${page.path} ...\x1b[0m`);
      const result = runLighthouse(url, outputPath);
      if (result) {
        scores.push({ ...page, ...result });
      }
    }

    // 4. Print summary
    console.log(`\n\x1b[1m--- Lighthouse Mobile Scores ---\x1b[0m\n`);
    console.log("  Page         | Perf | A11y | Best Pract. | SEO");
    console.log("  -------------|------|------|-------------|----");
    for (const s of scores) {
      const name = s.name.padEnd(12);
      console.log(
        `  ${name} | ${String(s.performance).padStart(4)} | ${String(s.accessibility).padStart(4)} | ${String(s.bestPractices).padStart(11)} | ${String(s.seo).padStart(3)}`,
      );
    }

    console.log(`\n  Reports saved to: ${REPORT_DIR}/\n`);
  } finally {
    server.kill("SIGTERM");
    await delay(2000);
    if (!server.killed) server.kill("SIGKILL");
  }
}

main().catch((err) => {
  console.error(`\n\x1b[31mLighthouse audit crashed: ${err.message}\x1b[0m\n`);
  process.exit(1);
});
