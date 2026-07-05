import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, parse } from "path";

const SRC_DIR = "C:\\Users\\aarna\\OneDrive\\Pictures\\1S WEBP";
const WIDTH = 400;
const QUALITY = 75;

const files = (await readdir(SRC_DIR)).filter(f => f.endsWith(".webp"));

for (const f of files) {
  const srcPath = join(SRC_DIR, f);
  const { name } = parse(f);
  const outName = `${name}_thumb.webp`;
  const outPath = join(SRC_DIR, outName);

  const { size: before } = await stat(srcPath);
  await sharp(srcPath)
    .resize(WIDTH, undefined, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(outPath);
  const { size: after } = await stat(outPath);

  console.log(
    `${f}  ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB  (${after < before ? "✓" : "⚠"})`
  );
}

console.log(`\nDone. ${files.length} files processed.`);
