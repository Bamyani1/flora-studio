#!/usr/bin/env node
import { readdir, stat, readFile, writeFile } from "node:fs/promises";
import { join, relative, extname } from "node:path";
import sharp from "sharp";

const IMAGES_DIR = new URL("../public/images", import.meta.url).pathname;
const MANIFEST_PATH = new URL("../public/image-manifest.json", import.meta.url).pathname;
const CACHE_PATH = new URL("./.image-cache.json", import.meta.url).pathname;

const JPEG_QUALITY = 80;
const LQIP_WIDTH = 10;
const LQIP_QUALITY = 20;
const SUPPORTED_EXTS = new Set([".jpg", ".jpeg", ".png"]);

async function loadCache() {
  try {
    return JSON.parse(await readFile(CACHE_PATH, "utf-8"));
  } catch {
    return {};
  }
}

async function saveCache(cache) {
  await writeFile(CACHE_PATH, JSON.stringify(cache, null, 2));
}

async function walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkDir(fullPath)));
    } else if (SUPPORTED_EXTS.has(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

async function processImage(filePath, cache) {
  const publicPath = "/" + relative(join(IMAGES_DIR, ".."), filePath);
  const fileStat = await stat(filePath);
  const mtimeMs = fileStat.mtimeMs;

  // Skip unchanged files
  if (cache[publicPath]?.mtimeMs === mtimeMs) {
    return { publicPath, entry: cache[publicPath].entry, skipped: true, sizeBefore: 0, sizeAfter: 0 };
  }

  const ext = extname(filePath).toLowerCase();
  const originalBuffer = await readFile(filePath);
  const sizeBefore = originalBuffer.length;
  let sizeAfter = sizeBefore;

  // Compress
  if (ext === ".jpg" || ext === ".jpeg") {
    const compressed = await sharp(originalBuffer)
      .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true })
      .toBuffer();
    await writeFile(filePath, compressed);
    sizeAfter = compressed.length;
  } else if (ext === ".png") {
    const compressed = await sharp(originalBuffer)
      .png({ effort: 10 })
      .toBuffer();
    await writeFile(filePath, compressed);
    sizeAfter = compressed.length;
  }

  // Generate LQIP
  const metadata = await sharp(filePath).metadata();
  const lqipBuffer = await sharp(filePath)
    .resize(LQIP_WIDTH)
    .webp({ quality: LQIP_QUALITY })
    .toBuffer();
  const blurDataURL = `data:image/webp;base64,${lqipBuffer.toString("base64")}`;

  const entry = {
    blurDataURL,
    width: metadata.width,
    height: metadata.height,
  };

  // Update mtime after compression (file was rewritten)
  const newStat = await stat(filePath);
  cache[publicPath] = { mtimeMs: newStat.mtimeMs, entry };

  return { publicPath, entry, skipped: false, sizeBefore, sizeAfter };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

async function main() {
  console.log("Scanning public/images/ ...\n");

  const files = await walkDir(IMAGES_DIR);
  if (files.length === 0) {
    console.log("No images found.");
    return;
  }

  const cache = await loadCache();
  const manifest = {};
  const results = [];

  for (const file of files) {
    const result = await processImage(file, cache);
    manifest[result.publicPath] = result.entry;
    results.push(result);
  }

  await saveCache(cache);
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  // Print results table
  const processed = results.filter((r) => !r.skipped);
  const skipped = results.filter((r) => r.skipped);

  if (processed.length > 0) {
    console.log("Optimized images:");
    console.log("-".repeat(70));
    console.log(`${"File".padEnd(42)} ${"Before".padStart(10)} ${"After".padStart(10)} ${"Saved".padStart(6)}`);
    console.log("-".repeat(70));
    for (const r of processed) {
      const saved = r.sizeBefore > 0 ? Math.round((1 - r.sizeAfter / r.sizeBefore) * 100) : 0;
      console.log(
        `${r.publicPath.padEnd(42)} ${formatBytes(r.sizeBefore).padStart(10)} ${formatBytes(r.sizeAfter).padStart(10)} ${(saved + "%").padStart(6)}`
      );
    }
    console.log("-".repeat(70));
  }

  console.log(
    `\nDone: ${processed.length} optimized, ${skipped.length} skipped (unchanged)`
  );
  console.log(`Manifest written to public/image-manifest.json (${Object.keys(manifest).length} entries)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
