/**
 * Production smoke test — runtime launch gate.
 *
 * Builds the project, starts a production server, and verifies every route
 * returns 200 with live Sanity data (no placeholder:// URLs), valid OG tags,
 * a working sitemap, robots.txt, and Sanity Studio shell.
 *
 * Prerequisites: NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_READ_TOKEN must be
 * set in .env.local (or environment). Without them the build itself will fail.
 *
 * Usage:  node scripts/smoke-test.mjs
 *         node scripts/smoke-test.mjs --skip-build   (reuse existing build)
 *
 * Security note: All child_process calls use hardcoded commands with no user
 * input — no command injection risk.
 */

import { spawn, execSync } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const PORT = 3200;
const BASE = `http://127.0.0.1:${PORT}`;
const STARTUP_TIMEOUT_MS = 60_000;
const FETCH_TIMEOUT_MS = 15_000;
const STATIC_ROUTES = ["/", "/work", "/about", "/contact", "/process", "/privacy", "/terms"];
const SKIP_BUILD = process.argv.includes("--skip-build");

// ---------------------------------------------------------------------------
// Output helpers (matches verify-deploy.mjs style)
// ---------------------------------------------------------------------------

const pass = (msg) => console.log(`\x1b[32m  ✓\x1b[0m ${msg}`);
const fail = (msg) => console.error(`\x1b[31m  ✗\x1b[0m ${msg}`);
const info = (msg) => console.log(`\x1b[36m  ℹ\x1b[0m ${msg}`);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function safeFetch(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal, redirect: "follow" });
  } finally {
    clearTimeout(timer);
  }
}

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

function extractAlbumSlugs(sitemapXml) {
  const matches = [...sitemapXml.matchAll(/<loc>[^<]*\/work\/([^<]+)<\/loc>/g)];
  return matches.map((m) => m[1]);
}

// ---------------------------------------------------------------------------
// Check suites
// ---------------------------------------------------------------------------

const results = [];

function record(ok, msg) {
  results.push({ ok, msg });
  if (ok) pass(msg);
  else fail(msg);
}

async function checkRoute(path, { checkOg = true } = {}) {
  const url = `${BASE}${path}`;
  let res;
  try {
    res = await safeFetch(url);
  } catch (err) {
    record(false, `${path} — fetch error: ${err.message}`);
    return;
  }

  if (res.status !== 200) {
    record(false, `${path} → ${res.status}`);
    return;
  }
  record(true, `${path} → 200`);

  const html = await res.text();

  // Placeholder scan
  if (html.includes("placeholder://")) {
    record(false, `${path} contains placeholder:// URL`);
  } else {
    record(true, `${path} no placeholder:// URLs`);
  }

  // OG meta tags
  if (checkOg) {
    const hasOgTitle = html.includes('property="og:title"');
    const hasOgImage = html.includes('property="og:image"');
    record(hasOgTitle, `${path} ${hasOgTitle ? "has" : "missing"} og:title`);
    record(hasOgImage, `${path} ${hasOgImage ? "has" : "missing"} og:image`);
  }
}

async function checkSitemap() {
  let res;
  try {
    res = await safeFetch(`${BASE}/sitemap.xml`);
  } catch (err) {
    record(false, `/sitemap.xml — fetch error: ${err.message}`);
    return [];
  }

  if (res.status !== 200) {
    record(false, `/sitemap.xml → ${res.status}`);
    return [];
  }
  record(true, `/sitemap.xml → 200`);

  const xml = await res.text();

  // Structure check
  if (!xml.includes("<urlset") || !xml.includes("<loc>")) {
    record(false, `/sitemap.xml missing valid XML structure`);
    return [];
  }
  record(true, `/sitemap.xml has valid structure`);

  // Expected static routes
  for (const route of STATIC_ROUTES) {
    const expected =
      route === "/" ? "https://floraohio.com</loc>" : `https://floraohio.com${route}</loc>`;
    record(
      xml.includes(expected),
      `sitemap ${xml.includes(expected) ? "contains" : "missing"} ${route}`,
    );
  }

  // Album slugs
  const slugs = extractAlbumSlugs(xml);
  if (slugs.length === 0) {
    record(false, `No album slugs in sitemap (Sanity data missing?)`);
  } else {
    record(true, `${slugs.length} album(s) found in sitemap`);
  }

  return slugs;
}

async function checkRobots() {
  let res;
  try {
    res = await safeFetch(`${BASE}/robots.txt`);
  } catch (err) {
    record(false, `/robots.txt — fetch error: ${err.message}`);
    return;
  }

  if (res.status !== 200) {
    record(false, `/robots.txt → ${res.status}`);
    return;
  }
  record(true, `/robots.txt → 200`);

  const body = await res.text();
  const hasUserAgent = body.includes("User-Agent:") || body.includes("User-agent:");
  record(hasUserAgent, `/robots.txt ${hasUserAgent ? "has" : "missing"} User-Agent`);
  record(
    body.includes("Sitemap:"),
    `/robots.txt ${body.includes("Sitemap:") ? "has" : "missing"} Sitemap reference`,
  );
  record(
    body.includes("/studio"),
    `/robots.txt ${body.includes("/studio") ? "disallows" : "missing"} /studio`,
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // 1. Build
  if (!SKIP_BUILD) {
    console.log("\n\x1b[1m--- Building project ---\x1b[0m\n");
    try {
      execSync("npx next build", { stdio: "inherit", cwd: process.cwd() });
    } catch {
      console.error("\n\x1b[31mBuild failed. Aborting smoke test.\x1b[0m\n");
      process.exit(1);
    }
  } else {
    info("Skipping build (--skip-build)");
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
    // 3. Wait for ready
    await waitForServer();
    info(`Server ready at ${BASE}`);

    // 4a. Static routes
    console.log(`\n\x1b[1m--- Static routes ---\x1b[0m\n`);
    for (const route of STATIC_ROUTES) {
      await checkRoute(route);
    }

    // 4b. Sitemap + dynamic routes
    console.log(`\n\x1b[1m--- Sitemap & dynamic routes ---\x1b[0m\n`);
    const slugs = await checkSitemap();
    if (slugs.length > 0) {
      await checkRoute(`/work/${slugs[0]}`);
    }

    // 4c. Robots.txt
    console.log(`\n\x1b[1m--- Robots.txt ---\x1b[0m\n`);
    await checkRobots();

    // 4d. Studio
    console.log(`\n\x1b[1m--- Sanity Studio ---\x1b[0m\n`);
    await checkRoute("/studio", { checkOg: false });

    // 5. Report
    const passed = results.filter((r) => r.ok).length;
    const failed = results.filter((r) => !r.ok).length;
    console.log(`\n\x1b[1m--- Summary ---\x1b[0m`);
    console.log(`\n  ${passed} passed, ${failed} failed\n`);

    process.exitCode = failed > 0 ? 1 : 0;
  } finally {
    // 6. Cleanup
    server.kill("SIGTERM");
    await delay(2000);
    if (!server.killed) server.kill("SIGKILL");
  }
}

main().catch((err) => {
  console.error(`\n\x1b[31mSmoke test crashed: ${err.message}\x1b[0m\n`);
  process.exit(1);
});
