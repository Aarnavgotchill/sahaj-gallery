import fs from "node:fs";
import path from "node:path";
import QRCode from "qrcode";
import sharp from "sharp";

const CONFIG = {
  errorCorrection: "H",
  quietZoneModules: 5,
  darkColor: "#433555",
  lightColor: "#FFFFFF",
  accentColor: "#C9A96E",
  moduleShape: "roundrect",
  moduleRadius: 0.34,
  finderOuterRadius: 1.8,
  finderMidRadius: 1.5,
  finderInnerRadius: 1.1,
  dotBase: 0.55,
  dotSmall: 0.5,
  dotSmallRatio: 0.08,
  dotBig: 0.58,
  dotBigRatio: 0.03,
  logoFile: "scripts/qr-assets/sahaj-symbol.png",
  logoEmbeddedWidth: 1024,
  logoFraction: 0.2,
  badgeFraction: 0.23,
  badgeRingWidthFraction: 0,
  frameStrokeFraction: 0.04,
  frameRadiusFraction: 0.045,
  notchWidthFraction: 0.26,
  notchHeightFraction: 0.055,
  notchText: "SAHAJ",
  labelEnabled: true,
  modulePixel: 10,
  printModulePixel: 44,
  outputDir: "public/qr",
};

const JOBS = [
  { slug: "instagram", url: "https://www.instagram.com/sahajgallery/", label: "Instagram" },
  { slug: "whatsapp", url: "https://wa.me/919510788933", label: "WhatsApp" },
  { slug: "review", url: "https://g.page/r/CTOJ5URhNfzKEBM/review", label: "Google Review" },
  { slug: "catalogue", url: "https://wa.me/919510788933?text=Hi%2C%20Please%20share%20the%20catalog%20link!", label: "Catalog" },
];

function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function renderSVG(url, label, logoDataUri, overrides = {}) {
  const C = { ...CONFIG, ...overrides };
  const qr = QRCode.create(url, { errorCorrectionLevel: C.errorCorrection });
  const n = qr.modules.size;
  const data = qr.modules.data;
  const m = C.modulePixel || 10;
  const W = n * m;
  const qz = C.quietZoneModules * m;
  const fs = C.frameStrokeFraction * W;
  const frameRadius = C.frameRadiusFraction * W;
  const badgeR = (C.badgeFraction * W) / 2;
  const logoW = C.logoFraction * W;
  const center = W / 2;
  const seed = hashString(url + C.errorCorrection);
  const el = [];

  el.push(`<rect width="100%" height="100%" fill="${C.lightColor}"/>`);

  const isFinder = (x, y) =>
    (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  const dist2 = (x, y) => ((x + 0.5) * m - center) ** 2 + ((y + 0.5) * m - center) ** 2;

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!data[y * n + x]) continue;
      if (isFinder(x, y)) continue;
      if (C.badgeFraction && dist2(x, y) < (badgeR + m * 0.5) ** 2) continue;
      const h = hashString(`${seed}:${x}:${y}`) / 4294967296;
      const size =
        h < C.dotSmallRatio
          ? C.dotSmall
          : h < C.dotSmallRatio + C.dotBigRatio
            ? C.dotBig
            : C.dotBase;
      if (C.moduleShape === "square") {
        el.push(
          `<rect x="${x * m}" y="${y * m}" width="${m}" height="${m}" fill="${C.darkColor}"/>`,
        );
      } else if (C.moduleShape === "roundrect") {
        el.push(
          `<rect x="${x * m}" y="${y * m}" width="${m}" height="${m}" rx="${C.moduleRadius * m}" fill="${C.darkColor}"/>`,
        );
      } else {
        el.push(
          `<circle cx="${(x + 0.5) * m}" cy="${(y + 0.5) * m}" r="${(size * m).toFixed(3)}" fill="${C.darkColor}"/>`,
        );
      }
    }
  }

  for (const [fx, fy] of [
    [0, 0],
    [n - 7, 0],
    [0, n - 7],
  ]) {
    const px = fx * m;
    const py = fy * m;
    el.push(
      `<rect x="${px}" y="${py}" width="${7 * m}" height="${7 * m}" rx="${C.finderOuterRadius * m}" fill="${C.darkColor}"/>`,
      `<rect x="${px + m}" y="${py + m}" width="${5 * m}" height="${5 * m}" rx="${C.finderMidRadius * m}" fill="${C.lightColor}"/>`,
      `<rect x="${px + 2 * m}" y="${py + 2 * m}" width="${3 * m}" height="${3 * m}" rx="${C.finderInnerRadius * m}" fill="${C.darkColor}"/>`,
    );
  }

  if (C.badgeFraction) {
    el.push(
      `<circle cx="${center}" cy="${center}" r="${badgeR.toFixed(3)}" fill="${C.lightColor}" stroke="${C.accentColor}" stroke-width="${(C.badgeRingWidthFraction * W).toFixed(3)}"/>`,
    );
    if (logoDataUri) {
      el.push(
        `<image x="${(center - logoW / 2).toFixed(3)}" y="${(center - logoW / 2).toFixed(3)}" width="${logoW.toFixed(3)}" height="${logoW.toFixed(3)}" preserveAspectRatio="xMidYMid meet" href="${logoDataUri}"/>`,
      );
    }
  }

  const frameX = -(qz + fs);
  const frameY = -(qz + fs);
  const frameSize = W + 2 * (qz + fs);
  const frameBottom = frameY + frameSize;
  let maxY = frameBottom;

  if (C.labelEnabled || C.notchText) {
    el.push(
      `<rect x="${frameX}" y="${frameY}" width="${frameSize}" height="${frameSize}" rx="${frameRadius}" fill="none" stroke="${C.darkColor}" stroke-width="${fs}"/>`,
    );
  }

  if (C.notchText) {
    const notchW = C.notchWidthFraction * W;
    const notchH = C.notchHeightFraction * W;
    const notchX = center - notchW / 2;
    const notchY = frameBottom - notchH * 0.45;
    const textSize = notchH * 0.42;
    el.push(
      `<rect x="${notchX}" y="${notchY}" width="${notchW}" height="${notchH}" rx="${notchH / 2}" fill="${C.darkColor}"/>`,
      `<text x="${(center - textSize * 0.12 * (C.notchText.length - 1)).toFixed(3)}" y="${notchY + notchH / 2 + textSize * 0.36}" text-anchor="middle" font-family="Gambetta, Georgia, serif" font-weight="500" font-size="${textSize.toFixed(3)}" fill="${C.accentColor}" letter-spacing="0.24em">${C.notchText}</text>`,
    );
    maxY = Math.max(maxY, notchY + notchH);
  }

  if (C.labelEnabled) {
    const textSize = 0.032 * W;
    const labelY = (C.notchText ? frameBottom + C.notchHeightFraction * W * 1.15 : frameBottom + fs) + textSize;
    el.push(
      `<text x="${(center - textSize * 0.19 * (label.length - 1)).toFixed(3)}" y="${labelY.toFixed(3)}" text-anchor="middle" font-family="Micross, 'Microsoft Sans Serif', Arial, sans-serif" font-size="${textSize.toFixed(3)}" fill="${C.darkColor}" opacity="0.55" letter-spacing="0.38em">${label.toUpperCase()}</text>`,
    );
    maxY = Math.max(maxY, labelY + textSize * 0.35);
  }

  const minX = frameX - fs;
  const minY = frameY - fs;
  const maxX = frameX + frameSize + fs;
  const pad = fs * 0.7;
  const width = maxX - minX + 2 * pad;
  const height = maxY - minY + 2 * pad;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width.toFixed(2)}" height="${height.toFixed(2)}" viewBox="0 0 ${width.toFixed(2)} ${height.toFixed(2)}" shape-rendering="geometricPrecision">
<g transform="translate(${(pad - minX).toFixed(2)} ${(pad - minY).toFixed(2)})">
${el.join("\n")}
</g>
</svg>`;
}

const WHITE = [255, 255, 255];
const DARK = [67, 53, 85];

function paintRect(buf, size, x, y, w, h, col) {
  const x0 = Math.max(0, Math.floor(x));
  const y0 = Math.max(0, Math.floor(y));
  const x1 = Math.min(size, Math.ceil(x + w));
  const y1 = Math.min(size, Math.ceil(y + h));
  for (let yy = y0; yy < y1; yy++) {
    const row = yy * size;
    for (let xx = x0; xx < x1; xx++) {
      const o = (row + xx) * 4;
      buf[o] = col[0];
      buf[o + 1] = col[1];
      buf[o + 2] = col[2];
      buf[o + 3] = 255;
    }
  }
}

function paintCircle(buf, size, cx, cy, r, col) {
  const x0 = Math.max(0, Math.floor(cx - r));
  const y0 = Math.max(0, Math.floor(cy - r));
  const x1 = Math.min(size, Math.ceil(cx + r));
  const y1 = Math.min(size, Math.ceil(cy + r));
  const r2 = r * r;
  for (let yy = y0; yy < y1; yy++) {
    const dy = yy + 0.5 - cy;
    const row = yy * size;
    for (let xx = x0; xx < x1; xx++) {
      const dx = xx + 0.5 - cx;
      if (dx * dx + dy * dy > r2) continue;
      const o = (row + xx) * 4;
      buf[o] = col[0];
      buf[o + 1] = col[1];
      buf[o + 2] = col[2];
      buf[o + 3] = 255;
    }
  }
}

function paintRoundedRect(buf, size, x, y, w, h, r, col) {
  if (r <= 0) {
    paintRect(buf, size, x, y, w, h, col);
    return;
  }
  const cr = Math.min(r, w / 2, h / 2);
  paintRect(buf, size, x + cr, y, w - 2 * cr, h, col);
  paintRect(buf, size, x, y + cr, w, h - 2 * cr, col);
  paintCircle(buf, size, x + cr, y + cr, cr, col);
  paintCircle(buf, size, x + w - cr, y + cr, cr, col);
  paintCircle(buf, size, x + cr, y + h - cr, cr, col);
  paintCircle(buf, size, x + w - cr, y + h - cr, cr, col);
}

function renderPngRaw(url, label, overrides = {}) {
  const C = { ...CONFIG, ...overrides };
  const qr = QRCode.create(url, { errorCorrectionLevel: C.errorCorrection });
  const n = qr.modules.size;
  const data = qr.modules.data;
  const m = C.printModulePixel || C.modulePixel || 44;
  const W = n * m;
  const qz = C.quietZoneModules * m;
  const fs = C.frameStrokeFraction * W;
  const frameRadius = C.frameRadiusFraction * W;
  const badgeR = (C.badgeFraction * W) / 2;
  const logoW = C.logoFraction * W;
  const center = W / 2;
  const seed = hashString(url + C.errorCorrection);

  const frameOuter = -(qz + fs);
  const frameSize = W + 2 * (qz + fs);
  const frameInner = frameOuter + fs;
  const frameBottom = frameOuter + frameSize;

  const notchW = C.notchWidthFraction * W;
  const notchH = C.notchHeightFraction * W;
  const notchX = center - notchW / 2;
  const notchY = frameBottom - notchH * 0.45;
  const notchTextSize = notchH * 0.42;

  const labelSize = 0.032 * W;
  const labelY = (C.notchText ? frameBottom + C.notchHeightFraction * W * 1.15 : frameBottom + fs) + labelSize;

  let maxY = frameBottom;
  if (C.notchText) maxY = Math.max(maxY, notchY + notchH);
  if (C.labelEnabled) maxY = Math.max(maxY, labelY + labelSize * 0.35);

  const minX = frameOuter - fs;
  const minY = frameOuter - fs;
  const maxX = frameOuter + frameSize + fs;
  const pad = fs * 0.7;
  const width = Math.round(maxX - minX + 2 * pad);
  const height = Math.round(maxY - minY + 2 * pad);
  const offX = minX - pad;
  const offY = minY - pad;

  const buf = Buffer.alloc(width * height * 4);
  paintRect(buf, width, 0, 0, width, height, WHITE);

  const X = (x) => x - offX;
  const Y = (y) => y - offY;

  paintRoundedRect(buf, width, X(frameOuter), Y(frameOuter), frameSize, frameSize, frameRadius, DARK);
  paintRoundedRect(
    buf, width, X(frameInner), Y(frameInner), frameSize - 2 * fs, frameSize - 2 * fs,
    Math.max(0, frameRadius - fs / 2), WHITE,
  );

  const isFinder = (x, y) =>
    (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  const dist2 = (x, y) => ((x + 0.5) * m - center) ** 2 + ((y + 0.5) * m - center) ** 2;
  const badgeR2 = (badgeR + m * 0.5) ** 2;

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!data[y * n + x]) continue;
      if (isFinder(x, y)) continue;
      if (C.badgeFraction && dist2(x, y) < badgeR2) continue;
      const h = hashString(`${seed}:${x}:${y}`) / 4294967296;
      const size =
        h < C.dotSmallRatio
          ? C.dotSmall
          : h < C.dotSmallRatio + C.dotBigRatio
            ? C.dotBig
            : C.dotBase;
      const px = X(x * m);
      const py = Y(y * m);
      if (C.moduleShape === "square") {
        paintRect(buf, width, px, py, m, m, DARK);
      } else if (C.moduleShape === "roundrect") {
        paintRoundedRect(buf, width, px, py, m, m, C.moduleRadius * m, DARK);
      } else {
        paintCircle(buf, width, px + m / 2, py + m / 2, size * m, DARK);
      }
    }
  }

  for (const [fx, fy] of [
    [0, 0],
    [n - 7, 0],
    [0, n - 7],
  ]) {
    const px = X(fx * m);
    const py = Y(fy * m);
    paintRoundedRect(buf, width, px, py, 7 * m, 7 * m, C.finderOuterRadius * m, DARK);
    paintRoundedRect(buf, width, px + m, py + m, 5 * m, 5 * m, C.finderMidRadius * m, WHITE);
    paintRoundedRect(buf, width, px + 2 * m, py + 2 * m, 3 * m, 3 * m, C.finderInnerRadius * m, DARK);
  }

  if (C.badgeFraction) {
    paintCircle(buf, width, X(center), Y(center), badgeR, WHITE);
    const bw = C.badgeRingWidthFraction * W;
    if (bw > 0) {
      paintCircle(buf, width, X(center), Y(center), badgeR + bw, DARK);
      paintCircle(buf, width, X(center), Y(center), badgeR, WHITE);
    }
  }

  if (C.notchText) {
    paintRoundedRect(buf, width, X(notchX), Y(notchY), notchW, notchH, notchH / 2, DARK);
  }

  const textEl = [];
  if (C.notchText) {
    textEl.push(
      `<text x="${(center - notchTextSize * 0.12 * (C.notchText.length - 1) - offX).toFixed(2)}" y="${(notchY + notchH / 2 + notchTextSize * 0.36 - offY).toFixed(2)}" text-anchor="middle" font-family="Gambetta, Georgia, serif" font-weight="500" font-size="${notchTextSize.toFixed(2)}" fill="${C.accentColor}" letter-spacing="0.24em">${C.notchText}</text>`,
    );
  }
  if (C.labelEnabled) {
    textEl.push(
      `<text x="${(center - labelSize * 0.19 * (label.length - 1) - offX).toFixed(2)}" y="${(labelY - offY).toFixed(2)}" text-anchor="middle" font-family="Micross, 'Microsoft Sans Serif', Arial, sans-serif" font-size="${labelSize.toFixed(2)}" fill="${C.darkColor}" opacity="0.55" letter-spacing="0.38em">${label.toUpperCase()}</text>`,
    );
  }
  const textSvg = textEl.length
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${textEl.join("")}</svg>`
    : null;

  return {
    buf,
    width,
    height,
    textSvg,
    logoRect: C.badgeFraction && logoW ? { x: X(center - logoW / 2), y: Y(center - logoW / 2), w: logoW } : null,
  };
}

async function renderPng(url, label, logoBuffer, overrides = {}) {
  const raw = renderPngRaw(url, label, overrides);
  let img = sharp(raw.buf, { raw: { width: raw.width, height: raw.height, channels: 4 } });
  const ops = [];
  if (raw.logoRect && logoBuffer) {
    const lw = Math.round(raw.logoRect.w);
    const logo = await sharp(logoBuffer).resize(lw, lw).png().toBuffer();
    ops.push({ input: logo, left: Math.round(raw.logoRect.x), top: Math.round(raw.logoRect.y) });
  }
  if (raw.textSvg) {
    const textPng = await sharp(Buffer.from(raw.textSvg)).png().toBuffer();
    ops.push({ input: textPng, left: 0, top: 0 });
  }
  if (ops.length) img = img.composite(ops);
  return img.png().toBuffer();
}

async function main() {
  const args = process.argv.slice(2);
  const jobs = args.length >= 2 ? [{ slug: args[0], url: args[1], label: args[2] || args[0] }] : JOBS;

  let logoBuffer = null;
  let logoDataUri = null;
  if (CONFIG.logoFile && fs.existsSync(CONFIG.logoFile)) {
    logoBuffer = await sharp(CONFIG.logoFile).resize(CONFIG.logoEmbeddedWidth).png().toBuffer();
    logoDataUri = `data:image/png;base64,${logoBuffer.toString("base64")}`;
  }

  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  for (const job of jobs) {
    const svg = renderSVG(job.url, job.label, logoDataUri);
    const svgPath = path.join(CONFIG.outputDir, `${job.slug}.svg`);
    const pngPath = path.join(CONFIG.outputDir, `${job.slug}.png`);
    fs.writeFileSync(svgPath, svg);
    const png = await renderPng(job.url, job.label, logoBuffer);
    await sharp(png).toFile(pngPath);
    console.log("wrote", svgPath, "and", pngPath);
  }
}

const isMain = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1].replace(/\\/g, "/")}`).href;

if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export { renderSVG, renderPngRaw, renderPng, CONFIG };
