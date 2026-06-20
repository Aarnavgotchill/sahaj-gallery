import { readdirSync, statSync, writeFileSync, copyFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "..", "dist");
const assetsDir = join(distDir, "assets");
const files = readdirSync(assetsDir);

const cssFile = files.find((f) => f.endsWith(".css"));
const mainJs =
  files.find((f) => /^index-[a-zA-Z0-9_-]+\.js$/.test(f)) ||
  files.filter((f) => f.endsWith(".js")).sort((a, b) => statSync(join(assetsDir, b)).size - statSync(join(assetsDir, a)).size)[0];

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sahaj Gallery</title>
    <link rel="icon" type="image/png" sizes="64x64" href="/favicon.png?v=2" />
    <link rel="shortcut icon" type="image/png" sizes="64x64" href="/favicon.png?v=2" />
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
