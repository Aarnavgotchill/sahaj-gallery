import { readdirSync, statSync, writeFileSync, copyFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "..", "dist");
const assetsDir = join(distDir, "assets");
const files = readdirSync(assetsDir);

const cssFile = files.find((f) => f.endsWith(".css"));
const jsFiles = files.filter((f) => f.endsWith(".js"));

let mainJs = "";
let maxSize = 0;
for (const f of jsFiles) {
  const size = statSync(join(assetsDir, f)).size;
  if (size > maxSize) {
    maxSize = size;
    mainJs = f;
  }
}

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sahaj Gallery</title>
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ""}
  </head>
  <body>
    <div id="root"></div>
    ${mainJs ? `<script type="module" src="/assets/${mainJs}"></script>` : ""}
  </body>
</html>`;

writeFileSync(join(distDir, "index.html"), html);
console.log("Generated index.html with", cssFile, mainJs);

// Copy _redirects from public if it exists
const publicRedirects = join(__dirname, "..", "public", "_redirects");
const distRedirects = join(distDir, "_redirects");
try {
  copyFileSync(publicRedirects, distRedirects);
  console.log("Copied _redirects");
} catch {};
