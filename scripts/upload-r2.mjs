/**
 * Cloudflare R2 Asset Manager
 * 
 * Uploads all local assets to R2, then verifies by listing objects.
 * Maintains asset-manifest.json with component usage tracking.
 */

import { S3Client, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createHash } from "crypto";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));

// ── Load env ──────────────────────────────────────────────────────────────
function loadEnv(filePath) {
  const env = {};
  if (!existsSync(filePath)) return env;
  for (const line of readFileSync(filePath, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    env[t.slice(0, i).trim()] = v;
  }
  return env;
}

const env = loadEnv(path.join(ROOT, ".env.local"));

const S3 = new S3Client({
  region: "auto",
  endpoint: env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const BUCKET = env.R2_BUCKET_NAME || "sahaj-gallery-assets";

// ── Helpers ────────────────────────────────────────────────────────────────

function walkDir(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkDir(full));
    else files.push(full);
  }
  return files;
}

const EXCLUDE = ["idea-2026.1.3.exe", "agent.md", "agent1.md", "Gallery html.html", ".gitkeep"];
const EXCLUDE_DIRS = ["issue"];

function isMediaFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return [".png", ".jpg", ".jpeg", ".webp", ".mp4", ".mp3", ".otf", ".ttf"].includes(ext);
}

const MIME_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".mp3": "audio/mpeg",
  ".otf": "font/otf",
  ".ttf": "font/ttf",
};

// Map local paths to R2 keys
function localToR2Key(localRelPath) {
  const rel = localRelPath.replace(/\\/g, "/");

  // sahaj panel
  if (rel.startsWith("sahaj panel/")) {
    return `artworks/sahaj_gallery_panel/${rel.slice("sahaj panel/".length)}`;
  }

  // essentials
  if (rel.startsWith("ESSENTIALS/")) {
    return `artworks/essentials/${rel.slice("ESSENTIALS/".length)}`;
  }

  const f = rel.split("/").pop();

  // videos
  if (f === "hero video.mp4") return "hero/hero-video.mp4";
  if (f === "fenil video.mp4") return "videos/reviews/fenil-video.mp4";
  if (f === "Dhruit Panchal V1.mp4") return "videos/reviews/Dhruit-Panchal-V1.mp4";
  if (f === "The Hands of Sahaj.mp4") return "videos/reviews/The-Hands-of-Sahaj.mp4";

  // audio
  if (f.endsWith(".mp3")) return `audio/${f}`;

  // fonts
  if (f === "Gambetta-Medium.otf") return `fonts/Gambetta-Medium.otf`;
  if (f === "micross.ttf") return `fonts/micross.ttf`;

  // placeholder
  if (rel.startsWith("sahaj gallery placeholder") || rel.startsWith("sahaj final placeholder") || rel.startsWith("sahal gallery")) {
    return `images/placeholder/${f}`;
  }

  // home_page images — catch-all for root-level media assets
  return `images/home_page/${f}`;
}

// ── Component usage mapping ────────────────────────────────────────────────

function getComponentUsage(r2Key, filename) {
  const usages = [];

  if (r2Key.startsWith("artworks/sahaj_gallery_panel/")) {
    usages.push("src/routes/work-page.tsx — gallery lightbox");
    usages.push("src/routes/work-page.tsx — SAHAJ panel strip backgrounds");
  }

  if (r2Key.startsWith("artworks/essentials/")) {
    usages.push("src/routes/work-page.tsx — Essentials section artwork grid");
  }

  if (r2Key.startsWith("hero/")) {
    usages.push("src/routes/index-page.tsx — hero video background");
  }

  if (r2Key.startsWith("videos/reviews/")) {
    usages.push("src/routes/sahaj-page.tsx — Fenil/Dhruti/Hands video testimonial");
  }

  if (r2Key.startsWith("images/home_page/")) {
    if (filename.startsWith("ART WORK")) usages.push("src/routes/index-page.tsx — Sahaj Spotlight artwork");
    if (filename.includes("logo") || filename.includes("SAHAJ") || filename.includes("Logo")) {
      usages.push("src/components/Nav.tsx — site logo");
      usages.push("src/routes/sahaj-page.tsx — SAHAJ branding logos");
      usages.push("src/routes/contact-page.tsx — contact page logo");
    }
    if (filename.includes("karigari") || filename.includes("Studio_Shikshaptri")) {
      usages.push("src/routes/sahaj-page.tsx — partnership logo cards");
    }
    if (filename.includes("gallery background")) {
      usages.push("src/routes/work-page.tsx — gallery background decoration");
    }
    if (filename.startsWith("art-") || filename.startsWith("hero") || filename.startsWith("artist") ||
        filename.startsWith("html logo") || filename.startsWith("installation") || filename.startsWith("integration") ||
        filename.startsWith("iris-elephant") || filename === "S.webp" || filename === "H.webp" ||
        filename === "A.webp" || filename === "J.webp" || filename === "A1.webp" ||
        filename.endsWith("-medium.webp") || filename.endsWith("-thumb.webp")) {
      usages.push("src/routes/index-page.tsx — homepage decorative visuals");
    }
    usages.push("src/routes/index-page.tsx — homepage imagery");
  }

  if (r2Key.startsWith("images/placeholder/")) {
    usages.push("src/routes/sahaj-page.tsx — gallery placeholder image card");
  }

  if (r2Key.startsWith("fonts/")) {
    usages.push("src/styles.css — @font-face declarations");
  }

  if (r2Key.startsWith("audio/")) {
    usages.push("src/routes/index-page.tsx — ambient audio on homepage hero");
  }

  if (usages.length === 0) {
    usages.push("unknown — check references");
  }

  return usages;
}

// ── Main ──────────────────────────────────────────────────────────────────

async function listR2Objects() {
  const objects = [];
  let token;
  do {
    const resp = await S3.send(new ListObjectsV2Command({
      Bucket: BUCKET,
      ContinuationToken: token,
    }));
    if (resp.Contents) {
      for (const o of resp.Contents) {
        objects.push({ key: o.Key, size: o.Size, etag: o.ETag });
      }
    }
    token = resp.NextContinuationToken;
  } while (token);
  return objects;
}

async function uploadFile(localAbsPath, r2Key, mimeType) {
  const content = readFileSync(localAbsPath);
  await S3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: r2Key,
    Body: content,
    ContentType: mimeType,
  }));
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function main() {
  console.log("╔═══════════════════════════════════════════╗");
  console.log("║   Cloudflare R2 Asset Manager             ║");
  console.log("╚═══════════════════════════════════════════╝\n");

  // Step 1: Scan local
  console.log("◆ Scanning local assets...");
  const allLocal = walkDir(path.join(ROOT, "src/assets"));
  const localFiles = allLocal.filter(f => {
    const rel = path.relative(path.join(ROOT, "src/assets"), f).replace(/\\/g, "/");
    for (const ex of EXCLUDE) if (rel === ex || f.endsWith(`/${ex}`)) return false;
    for (const ed of EXCLUDE_DIRS) if (rel.startsWith(ed + "/") || rel.startsWith(ed)) return false;
    if (!isMediaFile(f)) return false;
    return true;
  });
  console.log(`  Found ${localFiles.length} media files\n`);

  // Step 2: List existing R2 objects
  console.log("◆ Checking existing R2 objects...");
  const r2Objects = await listR2Objects();
  const r2Map = new Map(r2Objects.map(o => [o.key, o]));
  console.log(`  ${r2Objects.length} objects currently in R2\n`);

  // Step 3: Build manifest and determine what to upload
  const toUpload = [];
  const manifest = [];

  for (const filePath of localFiles) {
    const rel = path.relative(path.join(ROOT, "src/assets"), filePath).replace(/\\/g, "/");
    const size = statSync(filePath).size;
    const r2Key = localToR2Key(rel);
    const filename = rel.split("/").pop();
    const exists = r2Map.has(r2Key);

    const entry = {
      localPath: `src/assets/${rel}`,
      r2Path: r2Key,
      size,
      componentUsage: getComponentUsage(r2Key, filename),
      uploaded: exists,
    };

    manifest.push(entry);

    if (!exists) {
      toUpload.push({ filePath, r2Key, size, filename });
    }
  }

  // Sort: largest first for better progress tracking
  toUpload.sort((a, b) => b.size - a.size);

  const totalSizeMB = toUpload.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024);

  // Step 4: Report planned uploads
  console.log("◆ Upload Plan");
  console.log(`  Files to upload: ${toUpload.length}`);
  console.log(`  Total size:      ${totalSizeMB.toFixed(1)} MB\n`);

  // Group by directory
  const byDir = {};
  for (const f of toUpload) {
    const dir = path.dirname(f.r2Key).split("/")[0] || "root";
    if (!byDir[dir]) byDir[dir] = [];
    byDir[dir].push(f);
  }

  for (const [dir, files] of Object.entries(byDir).sort()) {
    const dirSize = files.reduce((s, f) => s + f.size, 0);
    console.log(`  ${dir}/ — ${files.length} files, ${formatSize(dirSize)}`);
    for (const f of files.slice(0, 3)) {
      console.log(`    ${f.r2Key} (${formatSize(f.size)})`);
    }
    if (files.length > 3) {
      console.log(`    ... and ${files.length - 3} more`);
    }
    console.log();
  }

  if (toUpload.length === 0) {
    console.log("◆ All assets already uploaded. Nothing to do.\n");
  } else {
    // Step 5: Upload
    console.log("◆ Uploading assets...");
    let success = 0;
    let failed = 0;

    for (let i = 0; i < toUpload.length; i++) {
      const f = toUpload[i];
      const ext = path.extname(f.filename).toLowerCase();
      const mime = MIME_TYPES[ext] || "application/octet-stream";
      const pct = ((i + 1) / toUpload.length * 100).toFixed(0);

      try {
        await uploadFile(f.filePath, f.r2Key, mime);
        console.log(`  [${pct}%] ✓ ${f.r2Key} (${formatSize(f.size)})`);
        success++;
      } catch (err) {
        console.log(`  [${pct}%] ✗ ${f.r2Key} — ${err.message}`);
        failed++;
      }
    }

    console.log(`\n  Uploaded: ${success}, Failed: ${failed}\n`);
  }

  // Step 6: Verify by listing R2 again
  console.log("◆ Verifying uploads...");
  const r2After = await listR2Objects();
  const r2AfterMap = new Map(r2After.map(o => [o.key, o]));
  console.log(`  Objects in R2 now: ${r2After.length}`);

  // Update manifest with verified status
  let verifiedCount = 0;
  let missingCount = 0;
  for (const entry of manifest) {
    const exists = r2AfterMap.has(entry.r2Path);
    entry.uploaded = exists;
    if (exists) verifiedCount++;
    else missingCount++;
  }

  // Check for R2-only objects
  const localKeys = new Set(manifest.map(m => m.r2Path));
  const r2Only = r2After.filter(o => !localKeys.has(o.key));

  // Step 7: Generate final report
  console.log("\n╔═══════════════════════════════════════════╗");
  console.log("║   VERIFICATION REPORT                    ║");
  console.log("╚═══════════════════════════════════════════╝");
  console.log(`  Local media files:    ${manifest.length}`);
  console.log(`  Uploaded & verified:  ${verifiedCount}`);
  console.log(`  Still missing:        ${missingCount}`);
  console.log(`  R2-only (orphans):    ${r2Only.length}`);

  if (missingCount > 0) {
    console.log("\n  ● Missing assets:");
    for (const e of manifest.filter(e => !e.uploaded)) {
      console.log(`    ${e.r2Path}`);
    }
  }

  if (r2Only.length > 0) {
    console.log("\n  ● R2-only objects (not in local manifest):");
    for (const o of r2Only) {
      console.log(`    ${o.key}`);
    }
  }

  // Step 8: Write manifest
  manifest.sort((a, b) => a.r2Path.localeCompare(b.r2Path));
  writeFileSync(
    path.join(ROOT, "asset-manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
  console.log(`\n◆ asset-manifest.json written (${manifest.length} entries)`);

  // Summary
  if (missingCount === 0) {
    console.log("\n✅ ALL ASSETS VERIFIED IN R2");
  } else {
    console.log(`\n⚠️  ${missingCount} assets still need uploading`);
  }
}

main().catch(err => { console.error("FATAL:", err); process.exit(1); });
