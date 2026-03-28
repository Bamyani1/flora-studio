/**
 * One-time script to process source photos into web-ready images.
 * Resizes to 3200px on longest edge, JPEG quality 85.
 * Outputs to /public/images/ with clean directory structure.
 *
 * Usage: node scripts/process-images.mjs
 */

import sharp from "sharp";
import { mkdirSync, existsSync, readdirSync, statSync } from "fs";
import { join, extname, basename } from "path";

const SRC = "/Users/bamyani/Desktop/bmayan/pictures";
const DEST = "/Users/bamyani/Desktop/bmayan/public/images";
const MAX_DIM = 3200;
const QUALITY = 85;

/** Resize a single image and return its output dimensions */
async function processImage(srcPath, destPath) {
  const dir = join(destPath, "..");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const meta = await sharp(srcPath).metadata();
  const { width, height } = meta;

  // Determine if we need to resize
  const longest = Math.max(width, height);
  let resizeOpts = undefined;
  if (longest > MAX_DIM) {
    resizeOpts = width >= height ? { width: MAX_DIM } : { height: MAX_DIM };
  }

  const result = await sharp(srcPath)
    .rotate() // auto-orient from EXIF
    .resize(resizeOpts)
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(destPath);

  return { width: result.width, height: result.height };
}

/** Process all JPGs in a source folder into a dest folder with numbered names */
async function processFolder(srcFolder, destFolder, fileMap) {
  const srcDir = join(SRC, srcFolder);
  if (!existsSync(srcDir)) {
    console.error(`  ⚠ Source folder not found: ${srcDir}`);
    return;
  }

  for (const [srcFile, destFile] of Object.entries(fileMap)) {
    const srcPath = join(srcDir, srcFile);
    const destPath = join(DEST, destFolder, destFile);
    if (!existsSync(srcPath)) {
      console.error(`  ⚠ Missing: ${srcFile}`);
      continue;
    }
    try {
      const dims = await processImage(srcPath, destPath);
      console.log(`  ✓ ${destFile} (${dims.width}×${dims.height})`);
    } catch (err) {
      console.error(`  ✗ ${srcFile}: ${err.message}`);
    }
  }
}

/** Process a single named file */
async function processSingle(srcFolder, srcFile, destFolder, destFile) {
  const srcPath = join(SRC, srcFolder, srcFile);
  const destPath = join(DEST, destFolder, destFile);
  if (!existsSync(srcPath)) {
    console.error(`  ⚠ Missing: ${srcPath}`);
    return;
  }
  try {
    const dims = await processImage(srcPath, destPath);
    console.log(`  ✓ ${destFolder}/${destFile} (${dims.width}×${dims.height})`);
  } catch (err) {
    console.error(`  ✗ ${destFile}: ${err.message}`);
  }
}

async function main() {
  console.log("Processing images → /public/images/\n");

  // ── Landing Page ──
  console.log("Landing Page:");
  await processSingle(
    "good for heros and albums other important images",
    "DSC01886_fullres.jpg",
    "",
    "landing-hero.jpg",
  );
  await processSingle(
    "good for heros and albums other important images",
    "DSC_6467.jpg",
    "",
    "editorial-hero.jpg",
  );
  await processSingle(
    "good for heros and albums other important images",
    "DSC_5718.jpg",
    "",
    "exhibition-hero.jpg",
  );
  await processSingle(
    "good for heros and albums other important images",
    "DSC_0645.jpg",
    "",
    "studio-hero.jpg",
  );

  // ── About Page ──
  console.log("\nAbout Page:");
  await processSingle("About-pics", "Mostafa.jpg", "", "portrait.jpg");
  await processSingle(
    "good for heros and albums other important images",
    "DSC02259-Enhanced-NR_fullres.jpg",
    "",
    "about-process.jpg",
  );

  // ── Process Page ──
  console.log("\nProcess Page:");
  await processSingle(
    "good for heros and albums other important images",
    "DSC09831.jpg",
    "process",
    "hero.jpg",
  );
  await processSingle("Graduation-1", "DSC_0520.jpg", "process", "01.jpg");
  await processSingle("graduation-2", "DSC02086_fullres.jpg", "process", "02.jpg");
  await processSingle(
    "good for heros and albums other important images",
    "DSC01057-Recovered.jpg",
    "process",
    "03.jpg",
  );
  await processSingle(
    "good for heros and albums other important images",
    "DSC_0651.jpg",
    "process",
    "04a.jpg",
  );
  await processSingle(
    "good for heros and albums other important images",
    "DSC00586.jpg",
    "process",
    "04b.jpg",
  );
  await processSingle(
    "good for heros and albums other important images",
    "DSC02298_fullres.jpg",
    "process",
    "04c.jpg",
  );
  await processSingle(
    "good for heros and albums other important images",
    "GOPR0363.jpg",
    "process",
    "04d.jpg",
  );

  // ── Album 1: The Graduate ──
  console.log("\nThe Graduate:");
  await processFolder("Graduation-1", "the-graduate", {
    "DSC_0552.jpg": "cover.jpg",
    "DSC_0645.jpg": "hero.jpg",
    "DSC_0520.jpg": "01.jpg",
    "DSC_0650.jpg": "02.jpg",
    "DSC_0651.jpg": "03.jpg",
    "DSC_0659.jpg": "04.jpg",
  });

  // ── Album 2: Milestone ──
  console.log("\nMilestone:");
  await processFolder("graduation-2", "milestone", {
    "DSC02322_fullres.jpg": "cover.jpg",
    "DSC02086_fullres.jpg": "hero.jpg",
    "DSC01830_fullres.jpg": "01.jpg",
    "DSC01835_fullres.jpg": "02.jpg",
    "DSC01849_fullres.jpg": "03.jpg",
    "DSC01886_fullres.jpg": "04.jpg",
    "DSC01903_fullres.jpg": "05.jpg",
    "DSC01926_fullres.jpg": "06.jpg",
    "DSC02170_fullres.jpg": "07.jpg",
    "DSC02175_fullres.jpg": "08.jpg",
    "DSC02259-Enhanced-NR_fullres.jpg": "09.jpg",
    "DSC02298_fullres.jpg": "10.jpg",
  });

  // ── Album 3: Game Day ──
  console.log("\nGame Day:");
  await processFolder("Basketball-games", "game-day", {
    "DSC_5072.jpg": "cover.jpg",
    "DSC_4834.jpg": "hero.jpg",
    "DSC_4942.jpg": "01.jpg",
    "DSC_5113.jpg": "02.jpg",
    "DSC_5135.jpg": "03.jpg",
    "DSC_5517.jpg": "04.jpg",
    "DSC_5554.jpg": "05.jpg",
    "DSC_5556.jpg": "06.jpg",
    "DSC_5592.jpg": "07.jpg",
    "DSC_5626.jpg": "08.jpg",
    "DSC_5662.jpg": "09.jpg",
    "DSC_5711.jpg": "10.jpg",
    "DSC_5718.jpg": "11.jpg",
    "DSC_5773.jpg": "12.jpg",
    "DSC00369.jpg": "13.jpg",
    "DSC00598.jpg": "14.jpg",
  });

  // ── Album 4: March Madness ──
  console.log("\nMarch Madness:");
  await processFolder("March-madness", "march-madness", {
    "DSC00146.jpg": "cover.jpg",
    "DSC_4386.JPG": "hero.jpg",
    "DSC_4218.JPG": "01.jpg",
    "DSC_4372.JPG": "02.jpg",
    "DSC_4470.JPG": "03.jpg",
    "DSC_4540.JPG": "04.jpg",
    "DSC_4560.JPG": "05.jpg",
    "DSC_4568.JPG": "06.jpg",
    "DSC_4625.jpg": "07.jpg",
    "DSC_4627.jpg": "08.jpg",
    "DSC_4656.jpg": "09.jpg",
    "DSC00087.jpg": "10.jpg",
    "DSC09831.jpg": "11.jpg",
    "DSC09866.jpg": "12.jpg",
  });

  // ── Album 5: Miami vs SMU ──
  console.log("\nMiami vs SMU:");
  await processFolder("miami-vs-smu", "miami-vs-smu", {
    "DSC_6655.jpg": "cover.jpg",
    "DSC_6206.jpg": "hero.jpg",
    "DSC_6283.jpg": "01.jpg",
    "DSC_6431.jpg": "02.jpg",
    "DSC_6444.jpg": "03.jpg",
    "DSC_6467.jpg": "04.jpg",
    "DSC_6521.jpg": "05.jpg",
    "DSC_6527.jpg": "06.jpg",
    "DSC_6547.jpg": "07.jpg",
    "DSC_6598.jpg": "08.jpg",
    "DSC_6611.jpg": "09.jpg",
    "DSC_6620.jpg": "10.jpg",
    "DSC_6638.jpg": "11.jpg",
    "DSC_6643.jpg": "12.jpg",
    "DSC_6710.jpg": "13.jpg",
    "DSC_6719.jpg": "14.jpg",
    "DSC_6726.jpg": "15.jpg",
    "DSC_6736.jpg": "16.jpg",
  });

  // ── Album 6: Under the Lights ──
  console.log("\nUnder the Lights:");
  await processFolder("UD Football", "under-the-lights", {
    "DSC_7201-2.jpg": "cover.jpg",
    "DSC_7177.jpg": "hero.jpg",
    "DSC_6810.jpg": "01.jpg",
    "DSC_6832-3.jpg": "02.jpg",
    "DSC_6864-3.jpg": "03.jpg",
    "DSC_6886.jpg": "04.jpg",
    "DSC_7199.jpg": "05.jpg",
    "DSC_7207.jpg": "06.jpg",
    "DSC_7219.jpg": "07.jpg",
    "DSC_7221.jpg": "08.jpg",
    "DSC_7247.jpg": "09.jpg",
    "DSC_7287.jpg": "10.jpg",
    "DSC_7295.jpg": "11.jpg",
    "DSC_7368.jpg": "12.jpg",
    "DSC_7380.jpg": "13.jpg",
    "DSC_7402.jpg": "14.jpg",
    "DSC_7415-2.jpg": "15.jpg",
  });

  // ── Album 7: UD Basketball ──
  console.log("\nUD Basketball:");
  await processFolder("UD-Basketball", "ud-basketball", {
    "260306_VCUvsUD_Anwari 16.jpg": "cover.jpg",
    "260306_VCUvsUD_Anwari 12.JPG": "hero.jpg",
    "260306_VCUvsUD_Anwari 13.JPG": "01.jpg",
    "260306_VCUvsUD_Anwari 17.JPG": "02.jpg",
    "260306_VCUvsUD_Anwari 20.JPG": "03.jpg",
    "260306_VCUvsUD_Anwari 27.jpg": "04.jpg",
    "260306_VCUvsUD_Anwari 93.JPG": "05.jpg",
  });

  // ── Album 8: Texas Cheer ──
  console.log("\nTexas Cheer:");
  await processFolder("uni-texas-cheers", "texas-cheer", {
    "DSC_5700.jpg": "cover.jpg",
    "DSC_5781.jpg": "hero.jpg",
    "DSC_5606.jpg": "01.jpg",
    "DSC_5612.jpg": "02.jpg",
    "DSC_5616.jpg": "03.jpg",
    "DSC_5620.jpg": "04.jpg",
    "DSC_5659.jpg": "05.jpg",
    "DSC_5671.jpg": "06.jpg",
    "DSC_5699.jpg": "07.jpg",
    "DSC_5707.jpg": "08.jpg",
    "DSC_5775.jpg": "09.jpg",
  });

  // ── Album 9: Nature Vol. I ──
  console.log("\nNature Vol. I:");
  await processFolder("US-Nature-vol-1", "nature-vol-i", {
    "2-HDR.jpg": "cover.jpg",
    "DSC04815-Enhanced-NR.jpg": "hero.jpg",
    "15.jpg": "01.jpg",
    "16.jpg": "02.jpg",
    "17.jpg": "03.jpg",
    "18.jpg": "04.jpg",
    "19.jpg": "05.jpg",
    "DSC00472-Edit-Edit.jpg": "06.jpg",
    "DSC00507-Enhanced-NR.jpg": "07.jpg",
    "DSC00549.jpg": "08.jpg",
    "DSC00656-Enhanced-NR.jpg": "09.jpg",
    "DSC04891-Pano.jpg": "10.jpg",
    "GOPR0363.jpg": "11.jpg",
  });

  // ── Album 10: Nature Vol. II ──
  console.log("\nNature Vol. II:");
  await processFolder("US-Nature-vol-2", "nature-vol-ii", {
    "DSC01628.jpg": "cover.jpg",
    "DSC00364.jpg": "hero.jpg",
    "4.jpg": "01.jpg",
    "DSC00541.jpg": "02.jpg",
    "DSC00685.jpg": "03.jpg",
    "DSC00718.JPG": "04.jpg",
    "DSC00838.JPG": "05.jpg",
    "DSC00841.jpg": "06.jpg",
    "DSC00923.jpg": "07.jpg",
    "DSC00942.jpg": "08.jpg",
    "DSC01057-Recovered.jpg": "09.jpg",
    "DSC09466.jpg": "10.jpg",
  });

  // ── Album 11: Nature Vol. III ──
  console.log("\nNature Vol. III:");
  await processFolder("US-Nature-vol-3", "nature-vol-iii", {
    "DSC04237-Pano-2-2.jpg": "cover.jpg",
    "DSC00099.jpg": "hero.jpg",
    "9.jpg": "01.jpg",
    "10.jpg": "02.jpg",
    "11.jpg": "03.jpg",
    "12.jpg": "04.jpg",
    "13.jpg": "05.jpg",
    "14.jpg": "06.jpg",
    "DSC03979-Pano-3.jpg": "07.jpg",
    "DSC04350.jpg": "08.jpg",
    "DSC04554.jpg": "09.jpg",
    "DSC04595.jpg": "10.jpg",
    "DSC04635.jpg": "11.jpg",
  });

  // ── Copy video ──
  console.log("\nVideo:");
  const { copyFileSync } = await import("fs");
  const videoSrc = join(SRC, "graduation-2", "Sequence 02.mp4");
  const videoDest = join(DEST, "..", "videos", "milestone.mp4");
  const videoDir = join(videoDest, "..");
  if (!existsSync(videoDir)) mkdirSync(videoDir, { recursive: true });
  if (existsSync(videoSrc)) {
    copyFileSync(videoSrc, videoDest);
    console.log(`  ✓ videos/milestone.mp4`);
  } else {
    console.error(`  ⚠ Video not found: ${videoSrc}`);
  }

  console.log("\nDone!");
}

main().catch(console.error);
