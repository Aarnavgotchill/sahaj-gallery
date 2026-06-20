// Assets now served from Cloudflare R2.
// This script is preserved in case you need to regenerate thumbnails locally.
// To use: uncomment the code below and comment out the no-op exit.
console.log("  [skip] Assets are served from Cloudflare R2 — no local generation needed.");
process.exit(0);

import { readdirSync, statSync, existsSync } from "fs";
import { join, dirname, extname, basename } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const assetsDir = join(root, "src", "assets");

const THUMB_W = 400;
const MEDIUM_W = 1200;
const WEBP_QUALITY = 90;

const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const EXCLUDE = new Set([
  "NDH_logo_4K.png",
  "sahaj trasnparent logo.png",
  "Gambetta-Medium.otf",
  "micross.ttf",
]);

const DERIVED_RE = /-(thumb|medium)\.webp$/;

const EXCLUDE_DIRS = new Set([
  "The Shreenathji Grace",
  "AUTUMN",
  "CHERRY-BLOSSOM",
  "FLORA",
  "PARIJAT",
  "PRAKRITI-MANDALA",
  "SARANAM",
  "SERENE-WOODLAND",
  "THE URBAN",
  "THE-EYES",
  "THE-REFLECTION",
  "THE-SIKSHAPATRI",
  "sreeyantra",
  "tribal-art",
  "issue",
]);

function isImage(file) {
  if (DERIVED_RE.test(file)) return false;
  return EXTENSIONS.has(extname(file).toLowerCase());
}

function collectImages(dir) {
  const results = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.has(entry.name)) {
        results.push(...collectImages(full));
      }
    } else if (entry.isFile()) {
      if (EXCLUDE.has(entry.name)) continue;
      if (isImage(entry.name)) {
        results.push(full);
      }
    }
  }
  return results;
}

function derivedPath(originalPath, suffix) {
  const dir = dirname(originalPath);
  const base = basename(originalPath, extname(originalPath));
  return join(dir, `${base}-${suffix}.webp`);
}

function needsRegeneration(original, derived) {
  if (!existsSync(derived)) return true;
  return statSync(original).mtimeMs > statSync(derived).mtimeMs;
}

async function processImage(filePath) {
  const thumbPath = derivedPath(filePath, "thumb");
  const mediumPath = derivedPath(filePath, "medium");

  const needsThumb = needsRegeneration(filePath, thumbPath);
  const needsMedium = needsRegeneration(filePath, mediumPath);

  if (!needsThumb && !needsMedium) return null;

  const metadata = await sharp(filePath).metadata();
  const origW = metadata.width || 0;

  const results = { file: filePath, thumb: false, medium: false };

  if (needsThumb) {
    const tw = Math.min(THUMB_W, origW);
    await sharp(filePath)
      .resize(tw, undefined, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(thumbPath);
    results.thumb = true;
  }

  if (needsMedium) {
    const mw = Math.min(MEDIUM_W, origW);
    await sharp(filePath)
      .resize(mw, undefined, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(mediumPath);
    results.medium = true;
  }

  return results;
}

async function main() {
  console.log("\n  Responsive Image Generator");
  console.log("  ─────────────────────────\n");

  const files = collectImages(assetsDir);
  console.log(`  Found ${files.length} image files to process\n`);

  let processed = 0;
  let thumbCount = 0;
  let mediumCount = 0;
  let origBytes = 0;
  let newBytes = 0;

  for (const file of files) {
    const st = statSync(file);
    origBytes += st.size;

    const result = await processImage(file);
    if (result) {
      processed++;
      if (result.thumb) {
        newBytes += statSync(derivedPath(file, "thumb")).size;
        thumbCount++;
      }
      if (result.medium) {
        newBytes += statSync(derivedPath(file, "medium")).size;
        mediumCount++;
      }
    }
  }

  const origMB = (origBytes / 1024 / 1024).toFixed(1);
  const newMB = (newBytes / 1024 / 1024).toFixed(1);

  console.log(`  Summary:`);
  console.log(`    Images scanned:     ${files.length}`);
  if (processed > 0) {
    console.log(`    New thumbs:         ${thumbCount}`);
    console.log(`    New medium:         ${mediumCount}`);
    console.log(`    Original weight:    ${origMB} MB`);
    console.log(`    Generated weight:   ${newMB} MB`);
  } else {
    console.log(`    All derivatives up to date \u2014 nothing generated.`);
  }
  console.log("");
}

main().catch((err) => {
  console.error("  Error:", err.message);
  process.exit(1);
});
