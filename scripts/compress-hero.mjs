/**
 * Compress landing hero images in /public/images/hero/ in place.
 * Resizes to 2560px on longest edge, JPEG quality 78, progressive mozjpeg.
 * Steps down to quality 72 for any file still over 600KB.
 * Idempotent: skips files already under 600KB with longest edge <= 2560.
 *
 * Usage:
 *   node scripts/compress-hero.mjs
 */

import sharp from "sharp";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ROOT = import.meta.dirname ? join(import.meta.dirname, "..") : process.cwd();
const HERO_DIR = join(ROOT, "public/images/hero");
const MAX_DIM = 2560;
const QUALITY = 78;
const FALLBACK_QUALITY = 72;
const SIZE_LIMIT = 600 * 1024;

function formatSize(bytes) {
  return `${(bytes / 1024).toFixed(0)}KB`;
}

/** Compress a single hero image in place and return before/after sizes */
async function compressHero(fileName) {
  const filePath = join(HERO_DIR, fileName);
  const input = readFileSync(filePath);

  const meta = await sharp(input).metadata();
  const longest = Math.max(meta.width, meta.height);

  if (input.length < SIZE_LIMIT && longest <= MAX_DIM) {
    console.log(`  ✓ ${fileName} skipped (${formatSize(input.length)}, ${meta.width}×${meta.height})`);
    return;
  }

  const encode = (quality) =>
    sharp(input)
      .rotate()
      .resize({ width: MAX_DIM, height: MAX_DIM, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true, progressive: true })
      .toBuffer();

  let output = await encode(QUALITY);
  if (output.length >= SIZE_LIMIT) {
    output = await encode(FALLBACK_QUALITY);
  }

  writeFileSync(filePath, output);
  console.log(`  ✓ ${fileName} ${formatSize(input.length)} → ${formatSize(output.length)}`);
}

async function main() {
  console.log("Compressing hero images → /public/images/hero/\n");

  const files = readdirSync(HERO_DIR).filter((file) => file.toLowerCase().endsWith(".jpg"));
  if (files.length === 0) {
    throw new Error("No hero images found (public/images/hero/*.jpg).");
  }

  for (const file of files) {
    try {
      await compressHero(file);
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`);
      process.exitCode = 1;
    }
  }

  console.log("\nDone!");
}

main().catch(console.error);
