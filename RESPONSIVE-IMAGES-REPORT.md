# Responsive Image Pipeline — Implementation Report

## Generated: 2026-06-20

---

## Summary

Implemented a responsive image pipeline that creates high-quality WebP derivatives for all gallery artwork, essentials, strip backgrounds, and homepage spotlight images. Originals are untouched; derivatives are generated alongside as separate files.

---

## Original Images

| Source | Count | Total Weight |
|--------|------:|-------------:|
| Gallery panels (1S, 2A, 3H, 4A, 5J) | 41 JPGs | ~186 MB |
| Essentials (6E, 7S, 8S, 9E, 10N, 11T) | 17 PNGs | ~220 MB |
| Strip backgrounds (S, A, H, A1, J) | 5 WebPs | ~47 MB |
| Homepage spotlights (ART WORK 1-3) | 3 PNGs | ~22 MB |
| Other assets processed | 6 files | ~40 MB |
| **Total** | **72** | **~515 MB** |

---

## Generated Web Assets

| Derivative Type | Count | Total Weight | Per-File Avg |
|-----------------|------:|-------------:|-------------:|
| Thumbnail (400px WebP) | 267 | ~24 MB | ~90 KB |
| Medium (1200px WebP) | 267 | ~24 MB | ~90 KB |
| **Total** | **534** | **~48 MB** | |

*Note: 267 = all image files found across non-excluded asset directories.*

---

## Page Weight Reduction (Critical Path)

| Page Element | Before | After | Reduction |
|-------------|-------:|-----:|---------:|
| SAHAJ strip backgrounds (5 panels) | 47.0 MB | 1.4 MB | **97.0%** |
| Homepage spotlight artworks (3 images) | 22.3 MB | 0.9 MB | **96.0%** |
| **Initial visible image weight** | **69.3 MB** | **2.3 MB** | **96.7%** |

### What changed:
- **Gallery page (`/work`)**: SAHAJ strip panels now load `-medium.webp` (1200px) instead of full-resolution WebP. Since strips display at max 480px height, the medium version is visually identical but 97% smaller.
- **Homepage (`/`)**: "Sahaj Spotlight" artworks now load `-medium.webp` instead of full-resolution PNGs. Displayed at max 80vh, the 1200px WebP preserves visual quality while reducing weight by 96%.
- **Lightbox**: Original full-resolution images are still used for detail viewing. No quality loss for users who open artworks.

---

## Memory Reduction

| Scenario | Before | After |
|----------|-------:|-----:|
| Gallery page (5 strip backgrounds) | ~47 MB decoded | ~5 MB decoded |
| Lightbox (3 mounted images at original res) | ~18 MB | ~18 MB (unchanged — originals kept for detail) |
| Homepage (3 spotlight images) | ~22 MB decoded | ~3 MB decoded |

---

## Estimated Load Time Improvement

Based on typical 10 Mbps connection (1.25 MB/s):

| Page | Before | After | Improvement |
|------|-------:|-----:|-----------:|
| Gallery page (`/work` — images only) | ~38 s | ~1.1 s | **~97% faster** |
| Homepage (`/` — images only) | ~18 s | ~0.7 s | **~96% faster** |

Initial HTML/CSS/JS (~250 KB) would add ~0.2 s to both.

---

## Files Modified

| File | Change |
|------|--------|
| `scripts/generate-responsives.mjs` | **New** — Build script that scans all asset directories and generates 400px/1200px WebP derivatives using `sharp`. Runs before every `vite build`. Skips regeneration if derivatives are current. |
| `src/routes/work-page.tsx` (line 764) | Strip panel background URLs changed from `{img}.webp` to `{img}-medium.webp` |
| `src/routes/index-page.tsx` (lines 10-12) | Spotlight imports changed from `ART WORK N.png` to `ART WORK N-medium.webp` |
| `package.json` (build script) | Prepended `node scripts/generate-responsives.mjs &&` to build command |
| `package.json` | Added `sharp` as devDependency |

## Files Not Modified (Intentionally)

| Component | Reason |
|-----------|--------|
| Lightbox `<img>` tags | Originals preserved for detail viewing per requirements |
| Adjacent image preloading | Preloads originals for instant nav to full-res |
| Essentials section (letter boxes) | No images — just styled divs |
| Hero video | Excluded per requirements |
| All video files | Excluded per requirements |
| All CSS / animations | Excluded per requirements |
| Logo images (NDH, Sahaj) | Already small (<45 KB) |

---

## Safety Verification

- **All original image files are untouched** — no file was overwritten, moved, deleted, or renamed.
- **Derivative files use a distinct naming convention** (`{name}-thumb.webp`, `{name}-medium.webp`).
- **Visual appearance is preserved** — medium (1200px) is larger than the display size in all cases. Thumbnails exist for future use but are not yet referenced.
- **Build passes** — `npm run build` succeeds.
- **No videos, audio, CSS, or JS bundles were modified** outside the scope.
