import { createClient } from "@sanity/client";

const REPLACEMENTS = [
  ["Studio Bahar", "Flora Studio"],
  ["Bahar Studio", "Flora Studio"],
  ["STUDIO BAHAR", "FLORA STUDIO"],
  ["BAHAR STUDIO", "FLORA STUDIO"],
  ["studiobahar.com", "floraohio.com"],
  ["https://instagram.com/florastudio/", "https://www.instagram.com/byflorastudio/"],
  ["https://instagram.com/florastudio", "https://www.instagram.com/byflorastudio/"],
  ["instagram.com/studiobahar", "instagram.com/florastudio"],
  ["bahar-studio", "flora-studio"],
];

const DOC_TYPES = ["siteSettings", "homePage", "aboutPage", "processPage", "contactPage", "album"];

function rebrandString(str) {
  let out = str;
  for (const [from, to] of REPLACEMENTS) {
    out = out.split(from).join(to);
  }
  return out;
}

function walk(value, path, ops) {
  if (typeof value === "string") {
    const next = rebrandString(value);
    if (next !== value) {
      ops.push({ path, oldValue: value, newValue: next });
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      const seg =
        item && typeof item === "object" && item._key ? `[_key=="${item._key}"]` : `[${i}]`;
      walk(item, `${path}${seg}`, ops);
    });
    return;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith("_")) continue;
      walk(v, path ? `${path}.${k}` : k, ops);
    }
  }
}

const apply = process.argv.includes("--apply");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-07-11";
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
  process.exit(1);
}
if (!token) {
  console.error("Missing SANITY_API_TOKEN (write token required)");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

console.log(`[rebrand-sanity] ${apply ? "APPLY" : "dry-run"} mode, ${projectId}/${dataset}`);

const docs = await client.fetch(`*[_type in $types]`, { types: DOC_TYPES });
console.log(`[rebrand-sanity] scanning ${docs.length} documents`);

let totalOps = 0;
let touchedDocs = 0;

for (const doc of docs) {
  const ops = [];
  walk(doc, "", ops);
  if (ops.length === 0) continue;

  touchedDocs += 1;
  totalOps += ops.length;

  console.log(`\n${doc._id} (${doc._type}) — ${ops.length} changes:`);
  for (const op of ops) {
    console.log(`  ${op.path}`);
    console.log(`    - ${JSON.stringify(op.oldValue)}`);
    console.log(`    + ${JSON.stringify(op.newValue)}`);
  }

  if (apply) {
    const setObj = Object.fromEntries(ops.map((op) => [op.path, op.newValue]));
    await client.patch(doc._id).set(setObj).commit();
    console.log(`  → committed`);
  }
}

console.log(`\n[rebrand-sanity] ${touchedDocs} documents, ${totalOps} string changes`);
if (!apply) {
  console.log("[rebrand-sanity] dry-run complete. Re-run with --apply to write.");
} else {
  console.log("[rebrand-sanity] apply complete.");
}
