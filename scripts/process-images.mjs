#!/usr/bin/env node
/**
 * process-images.mjs
 *
 * Batch-processes the pictures/ folder into web-optimized JPGs for public/images/.
 * Also generates public/image-manifest.json with LQIP blur data.
 *
 * Usage: node scripts/process-images.mjs
 */

import sharp from "sharp";
import { readdir, mkdir, cp, stat, writeFile } from "node:fs/promises";
import { join, extname, basename } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const PICTURES = join(ROOT, "pictures");
const PUBLIC_IMAGES = join(ROOT, "public/images");
const PUBLIC_VIDEOS = join(ROOT, "public/videos");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".tiff"]);

const ALBUM_MAX_WIDTH = 2400;
const ALBUM_QUALITY = 80;
const STANDALONE_MAX_WIDTH = 2400;
const STANDALONE_QUALITY = 85;
const PROCESS_MAX_WIDTH = 1600;

// ─── Album Mapping ───────────────────────────────────────────────────────────
// source folder name → output slug
const ALBUM_MAP = {
  "Graduation-1": "the-graduate",
  "graduation-2": "milestone",
  "Basketball-games": "game-day",
  "March-madness": "march-madness",
  "miami-vs-smu": "miami-vs-smu",
  "UD Football": "under-the-lights",
  "UD-Basketball": "ud-basketball",
  "uni-texas-cheers": "texas-cheer",
  "US-Nature-vol-1": "nature-vol-i",
  "US-Nature-vol-2": "nature-vol-ii",
  "US-Nature-vol-3": "nature-vol-iii",
};

// ─── Standalone Image Mapping ────────────────────────────────────────────────
// These come from the curated folder or specific album folders
const CURATED = join(PICTURES, "good for heros and albums other important images");

const STANDALONE_MAP = [
  // Landing hero — mountain sunset with mist
  {
    src: join(CURATED, "DSC01057-Recovered.jpg"),
    dest: join(PUBLIC_IMAGES, "landing-hero.jpg"),
    maxWidth: STANDALONE_MAX_WIDTH,
    quality: STANDALONE_QUALITY,
  },
  // Hero showcase — Miami player courtside
  {
    src: join(CURATED, "DSC_6283.jpg"),
    dest: join(PUBLIC_IMAGES, "hero.jpg"),
    maxWidth: STANDALONE_MAX_WIDTH,
    quality: STANDALONE_QUALITY,
  },
  // About page portrait — Mostafa
  {
    src: join(PICTURES, "About-pics/Mostafa.jpg"),
    dest: join(PUBLIC_IMAGES, "portrait.jpg"),
    maxWidth: STANDALONE_MAX_WIDTH,
    quality: STANDALONE_QUALITY,
  },
  // Landing editorial — graduate on steps
  {
    src: join(CURATED, "DSC01886_fullres.jpg"),
    dest: join(PUBLIC_IMAGES, "editorial-hero.jpg"),
    maxWidth: STANDALONE_MAX_WIDTH,
    quality: STANDALONE_QUALITY,
  },
  // Landing exhibition — empty arena
  {
    src: join(CURATED, "DSC09831.jpg"),
    dest: join(PUBLIC_IMAGES, "exhibition-hero.jpg"),
    maxWidth: STANDALONE_MAX_WIDTH,
    quality: STANDALONE_QUALITY,
  },
  // Landing studio — autumn canopy
  {
    src: join(CURATED, "GOPR0363.jpg"),
    dest: join(PUBLIC_IMAGES, "studio-hero.jpg"),
    maxWidth: STANDALONE_MAX_WIDTH,
    quality: STANDALONE_QUALITY,
  },
  // Process step 1 — graduate in library (planning)
  {
    src: join(CURATED, "DSC_0645.jpg"),
    dest: join(PUBLIC_IMAGES, "process/01.jpg"),
    maxWidth: PROCESS_MAX_WIDTH,
    quality: STANDALONE_QUALITY,
  },
  // Process step 2 — March Madness layup (presence)
  {
    src: join(CURATED, "DSC_6638.jpg"),
    dest: join(PUBLIC_IMAGES, "process/02.jpg"),
    maxWidth: PROCESS_MAX_WIDTH,
    quality: STANDALONE_QUALITY,
  },
  // Process step 3 — portrait in golden light (selection)
  {
    src: join(CURATED, "DSC02259-Enhanced-NR_fullres.jpg"),
    dest: join(PUBLIC_IMAGES, "process/03.jpg"),
    maxWidth: PROCESS_MAX_WIDTH,
    quality: STANDALONE_QUALITY,
  },
  // Process step 4a — graduate reaching for book
  {
    src: join(CURATED, "DSC_0651.jpg"),
    dest: join(PUBLIC_IMAGES, "process/04a.jpg"),
    maxWidth: PROCESS_MAX_WIDTH,
    quality: STANDALONE_QUALITY,
  },
  // Process step 4b — forest landscape
  {
    src: join(CURATED, "DSC00838.JPG"),
    dest: join(PUBLIC_IMAGES, "process/04b.jpg"),
    maxWidth: PROCESS_MAX_WIDTH,
    quality: STANDALONE_QUALITY,
  },
  // Process step 4c — graduate on steps (reuse editorial)
  {
    src: join(CURATED, "DSC01886_fullres.jpg"),
    dest: join(PUBLIC_IMAGES, "process/04c.jpg"),
    maxWidth: PROCESS_MAX_WIDTH,
    quality: STANDALONE_QUALITY,
  },
  // Process step 4d — mountain panorama
  {
    src: join(PICTURES, "US-Nature-vol-1/DSC04891-Pano.jpg"),
    dest: join(PUBLIC_IMAGES, "process/04d.jpg"),
    maxWidth: PROCESS_MAX_WIDTH,
    quality: STANDALONE_QUALITY,
  },
];

// Wallpaper images
const WALLPAPER_FOLDER = join(PICTURES, "Wallapaper");

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isImageFile(filename) {
  const ext = extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext) && !filename.startsWith(".");
}

async function processImage(srcPath, destPath, maxWidth, quality) {
  await mkdir(join(destPath, ".."), { recursive: true });
  const meta = await sharp(srcPath).metadata();
  let pipeline = sharp(srcPath).rotate(); // auto-rotate from EXIF

  if (meta.width && meta.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  await pipeline.jpeg({ quality, mozjpeg: true }).toFile(destPath);

  const outMeta = await sharp(destPath).metadata();
  return { width: outMeta.width, height: outMeta.height };
}

async function generateBlurDataURL(imagePath) {
  const buffer = await sharp(imagePath)
    .resize(10, undefined, { fit: "inside" })
    .webp({ quality: 20 })
    .toBuffer();
  return `data:image/webp;base64,${buffer.toString("base64")}`;
}

async function listImageFiles(dir) {
  const entries = await readdir(dir);
  return entries
    .filter(isImageFile)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function processAlbums() {
  console.log("\n═══ Processing Albums ═══\n");
  const manifest = {};

  for (const [sourceFolder, slug] of Object.entries(ALBUM_MAP)) {
    const srcDir = join(PICTURES, sourceFolder);
    const destDir = join(PUBLIC_IMAGES, slug);

    try {
      await stat(srcDir);
    } catch {
      console.log(`  ⚠ Skipping ${sourceFolder} — folder not found`);
      continue;
    }

    await mkdir(destDir, { recursive: true });
    const files = await listImageFiles(srcDir);

    if (files.length === 0) {
      console.log(`  ⚠ Skipping ${sourceFolder} — no images found`);
      continue;
    }

    console.log(`  📁 ${sourceFolder} → ${slug} (${files.length} images)`);

    // First image → hero.jpg
    const heroSrc = join(srcDir, files[0]);
    const heroDest = join(destDir, "hero.jpg");
    const heroMeta = await processImage(heroSrc, heroDest, ALBUM_MAX_WIDTH, ALBUM_QUALITY);
    const heroBlur = await generateBlurDataURL(heroDest);
    manifest[`/images/${slug}/hero.jpg`] = {
      blurDataURL: heroBlur,
      width: heroMeta.width,
      height: heroMeta.height,
    };
    console.log(`     hero.jpg ✓ (${heroMeta.width}×${heroMeta.height})`);

    // Second image → cover.jpg
    if (files.length > 1) {
      const coverSrc = join(srcDir, files[1]);
      const coverDest = join(destDir, "cover.jpg");
      const coverMeta = await processImage(coverSrc, coverDest, ALBUM_MAX_WIDTH, ALBUM_QUALITY);
      const coverBlur = await generateBlurDataURL(coverDest);
      manifest[`/images/${slug}/cover.jpg`] = {
        blurDataURL: coverBlur,
        width: coverMeta.width,
        height: coverMeta.height,
      };
      console.log(`     cover.jpg ✓`);
    }

    // Remaining images → 01.jpg, 02.jpg, ...
    const galleryFiles = files.slice(2);
    for (let i = 0; i < galleryFiles.length; i++) {
      const num = String(i + 1).padStart(2, "0");
      const gallerySrc = join(srcDir, galleryFiles[i]);
      const galleryDest = join(destDir, `${num}.jpg`);
      const meta = await processImage(gallerySrc, galleryDest, ALBUM_MAX_WIDTH, ALBUM_QUALITY);
      const blur = await generateBlurDataURL(galleryDest);
      manifest[`/images/${slug}/${num}.jpg`] = {
        blurDataURL: blur,
        width: meta.width,
        height: meta.height,
      };
    }
    console.log(`     ${galleryFiles.length} gallery images ✓`);
  }

  return manifest;
}

async function processStandalone() {
  console.log("\n═══ Processing Standalone Images ═══\n");
  const manifest = {};

  for (const item of STANDALONE_MAP) {
    try {
      await stat(item.src);
    } catch {
      console.log(`  ⚠ Skipping ${basename(item.src)} — not found`);
      continue;
    }

    const meta = await processImage(item.src, item.dest, item.maxWidth, item.quality);
    const relPath = item.dest.replace(join(ROOT, "public"), "");
    const blur = await generateBlurDataURL(item.dest);
    manifest[relPath] = {
      blurDataURL: blur,
      width: meta.width,
      height: meta.height,
    };
    console.log(`  ✓ ${relPath} (${meta.width}×${meta.height})`);
  }

  return manifest;
}

async function processWallpaper() {
  console.log("\n═══ Processing Wallpaper Images ═══\n");
  const manifest = {};
  const destDir = join(PUBLIC_IMAGES, "wallpaper");
  await mkdir(destDir, { recursive: true });

  const files = await listImageFiles(WALLPAPER_FOLDER);
  for (let i = 0; i < files.length; i++) {
    const num = String(i + 1).padStart(2, "0");
    const src = join(WALLPAPER_FOLDER, files[i]);
    const dest = join(destDir, `${num}.jpg`);
    const meta = await processImage(src, dest, STANDALONE_MAX_WIDTH, STANDALONE_QUALITY);
    const blur = await generateBlurDataURL(dest);
    manifest[`/images/wallpaper/${num}.jpg`] = {
      blurDataURL: blur,
      width: meta.width,
      height: meta.height,
    };
  }
  console.log(`  ✓ ${files.length} wallpaper images`);
  return manifest;
}

async function copyVideo() {
  console.log("\n═══ Copying Video ═══\n");
  const src = join(PICTURES, "graduation-2/Sequence 02.mp4");
  try {
    await stat(src);
    await mkdir(PUBLIC_VIDEOS, { recursive: true });
    const dest = join(PUBLIC_VIDEOS, "milestone.mp4");
    await cp(src, dest);
    console.log("  ✓ milestone.mp4");
  } catch {
    console.log("  ⚠ Video not found — skipping");
  }
}

async function main() {
  console.log("🔧 Bahar Studio Image Processor\n");
  console.log(`Source: ${PICTURES}`);
  console.log(`Output: ${PUBLIC_IMAGES}`);

  const manifest = {};

  const albumManifest = await processAlbums();
  Object.assign(manifest, albumManifest);

  const standaloneManifest = await processStandalone();
  Object.assign(manifest, standaloneManifest);

  const wallpaperManifest = await processWallpaper();
  Object.assign(manifest, wallpaperManifest);

  await copyVideo();

  // Include grain.png in manifest if it exists
  const grainPath = join(PUBLIC_IMAGES, "grain.png");
  try {
    await stat(grainPath);
    const grainMeta = await sharp(grainPath).metadata();
    manifest["/images/grain.png"] = {
      blurDataURL: "",
      width: grainMeta.width,
      height: grainMeta.height,
    };
  } catch {
    // grain.png not found
  }

  // Write manifest
  const manifestPath = join(ROOT, "public/image-manifest.json");
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\n✅ Manifest written: ${Object.keys(manifest).length} entries`);
  console.log("Done!");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
