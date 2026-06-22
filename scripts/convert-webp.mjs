import sharp from "sharp";
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync, unlinkSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const ASSETS = path.join(ROOT, "src", "assets");

function walkDir(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkDir(full));
    else files.push(full);
  }
  return files;
}

const IMAGE_EXTS = [".png", ".jpg", ".jpeg"];
const allFiles = walkDir(ASSETS);
const images = allFiles.filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()));

let converted = 0;
let skipped = 0;
let errors = [];

for (const file of images) {
  const outPath = file.substring(0, file.lastIndexOf(".")) + ".webp";
  const relIn = path.relative(ASSETS, file);
  const relOut = path.relative(ASSETS, outPath);

  try {
    const info = await sharp(file)
      .webp({ quality: 95, effort: 6 })
      .toFile(outPath);

    const origSize = statSync(file).size;
    const newSize = statSync(outPath).size;
    const pct = ((1 - newSize / origSize) * 100).toFixed(0);

    unlinkSync(file);
    console.log(`  ${relIn} → ${relOut}  (${pct}% smaller)`);
    converted++;
  } catch (err) {
    errors.push(`${relIn}: ${err.message}`);
    skipped++;
  }
}

console.log(`\nDone: ${converted} converted, ${skipped} skipped, ${errors.length} errors`);
for (const e of errors) console.log(`  ERR: ${e}`);
