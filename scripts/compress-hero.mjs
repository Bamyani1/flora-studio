/**
 * Compress landing hero images in /public/images/hero/ in place.
 * Resizes to 2880px WIDE (not longest edge — the hero renders full-viewport-width
 * with object-fit: cover, so width is the binding dimension; a longest-edge cap
 * left portrait images only ~1650px wide and visibly soft on 2x displays).
 * JPEG quality 80, progressive mozjpeg; steps down to 74 for files over 1MB.
 * Idempotent: skips files already under 1MB with width <= 2880.
 *
 * Usage:
 *   node scripts/compress-hero.mjs
 */

import sharp from "sharp";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ROOT = import.meta.dirname ? join(import.meta.dirname, "..") : process.cwd();
const HERO_DIR = join(ROOT, "public/images/hero");
const MAX_WIDTH = 2880;
const QUALITY = 80;
const FALLBACK_QUALITY = 74;
const SIZE_LIMIT = 1024 * 1024;

function formatSize(bytes) {
  return `${(bytes / 1024).toFixed(0)}KB`;
}

/** Compress a single hero image in place and return before/after sizes */
async function compressHero(fileName) {
  const filePath = join(HERO_DIR, fileName);
  const input = readFileSync(filePath);

  const meta = await sharp(input).metadata();

  if (input.length < SIZE_LIMIT && meta.width <= MAX_WIDTH) {
    console.log(`  ✓ ${fileName} skipped (${formatSize(input.length)}, ${meta.width}×${meta.height})`);
    return;
  }

  const encode = (quality) =>
    sharp(input)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
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
