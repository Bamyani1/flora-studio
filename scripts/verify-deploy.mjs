import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = join(import.meta.dirname, "..");

// ---------------------------------------------------------------------------
// 1. Required environment variables
// ---------------------------------------------------------------------------

const REQUIRED_ENV_VARS = [
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "SANITY_READ_TOKEN",
  "ICLOUD_SMTP_USER",
  "ICLOUD_SMTP_PASS",
  "CONTACT_EMAIL",
  "NEXT_PUBLIC_SITE_URL",
];

const missingVars = REQUIRED_ENV_VARS.filter((v) => !process.env[v]);

if (missingVars.length > 0) {
  console.error("\x1b[31m✗ Missing required environment variables:\x1b[0m");
  for (const v of missingVars) {
    console.error(`  - ${v}`);
  }
} else {
  console.log("\x1b[32m✓ All required environment variables are set\x1b[0m");
}

// ---------------------------------------------------------------------------
// 2. Scan build output for placeholder:// URLs
// ---------------------------------------------------------------------------

const DIST_DIR = join(ROOT, process.env.NEXT_DIST_DIR || ".next");
const SCANNABLE_EXTENSIONS = new Set([".js", ".html", ".json"]);
const PLACEHOLDER_PATTERN = "placeholder://";

let placeholderHits = [];

function scanDir(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      scanDir(fullPath);
    } else if (entry.isFile() && SCANNABLE_EXTENSIONS.has(extname(entry.name))) {
      try {
        const content = readFileSync(fullPath, "utf-8");
        if (content.includes(PLACEHOLDER_PATTERN)) {
          placeholderHits.push(fullPath.replace(ROOT + "/", ""));
        }
      } catch {
        // skip unreadable files
      }
    }
  }
}

try {
  statSync(DIST_DIR);
  scanDir(DIST_DIR);
  if (placeholderHits.length > 0) {
    console.error("\x1b[31m✗ Found placeholder:// URLs in build output:\x1b[0m");
    for (const hit of placeholderHits) {
      console.error(`  - ${hit}`);
    }
  } else {
    console.log("\x1b[32m✓ No placeholder:// URLs found in build output\x1b[0m");
  }
} catch {
  console.warn("\x1b[33m⚠ Build output directory not found — run 'npm run build' first\x1b[0m");
}

// ---------------------------------------------------------------------------
// 3. Flag large files in public/
// ---------------------------------------------------------------------------

const PUBLIC_DIR = join(ROOT, "public");
const SIZE_THRESHOLD = 2 * 1024 * 1024; // 2 MB
let largeFiles = [];

function walkPublic(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkPublic(fullPath);
    } else if (entry.isFile()) {
      const stats = statSync(fullPath);
      if (stats.size > SIZE_THRESHOLD) {
        largeFiles.push({
          path: fullPath.replace(ROOT + "/", ""),
          sizeMB: (stats.size / (1024 * 1024)).toFixed(1),
        });
      }
    }
  }
}

walkPublic(PUBLIC_DIR);

if (largeFiles.length > 0) {
  console.warn("\x1b[33m⚠ Files in public/ exceeding 2 MB:\x1b[0m");
  for (const f of largeFiles) {
    console.warn(`  - ${f.path} (${f.sizeMB} MB)`);
  }
} else {
  console.log("\x1b[32m✓ No files in public/ exceed 2 MB\x1b[0m");
}

// ---------------------------------------------------------------------------
// Exit
// ---------------------------------------------------------------------------

const fatal = missingVars.length > 0 || placeholderHits.length > 0;
process.exit(fatal ? 1 : 0);
