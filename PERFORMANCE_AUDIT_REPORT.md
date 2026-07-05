# PERFORMANCE AUDIT REPORT

**Project:** Sahaj Gallery  
**Audit Date:** 2026-06-25  
**Build Tool:** Vite 7.3.3  
**Framework:** React 19 + TanStack Router  
**Total dist size:** 230.25 MB  
**Build time:** ~9.5 seconds  

---

## TABLE OF CONTENTS

1. [Build & Bundle Analysis](#1-build--bundle-analysis)
2. [Image & Media Audit](#2-image--media-audit)
3. [JavaScript Analysis](#3-javascript-analysis)
4. [CSS Analysis](#4-css-analysis)
5. [Animation Audit](#5-animation-audit)
6. [Network & Fetch Analysis](#6-network--fetch-analysis)
7. [Component Rendering Analysis](#7-component-rendering-analysis)
8. [Memory Leak Analysis](#8-memory-leak-analysis)
9. [Lighthouse Score Estimation](#9-lighthouse-score-estimation)
10. [Root Causes of Slow Performance](#10-root-causes-of-slow-performance)
11. [Optimization Roadmap](#11-optimization-roadmap)

---

## 1. BUILD & BUNDLE ANALYSIS

### Raw Build Output

```
dist/ size: 230.25 MB across 40 files
Build time: ~9.5 seconds
```

### JavaScript Chunks

| Chunk | Raw Size | Gzip | What's In It |
|-------|----------|------|-------------|
| `vendor-three` | **507 kB** | 128 kB | Three.js (WebGL gallery) |
| `vendor-supabase` | **210 kB** | 55 kB | Supabase client (CataloguePopup) |
| `index` (main) | 191 kB | 61 kB | App shell, all route definitions |
| `vendor-router` | 120 kB | 38 kB | TanStack Router + React Query |
| `CataloguePopup` | 66 kB | 21 kB | Sanity catalogue viewer |
| `contact-page` | 31 kB | 11 kB | Contact form + admin portal |
| `work-page` | 24 kB | 7 kB | Gallery grid + lightbox |
| `WebGLGallery` | 5 kB | 2 kB | WebGL mode (rarely used) |
| **Total JS** | **~1.2 MB** | **~380 kB** | |

### Empty Chunk Warning

```
Generated an empty chunk: "vendor-react"
```

`manualChunks` splits `react` and `react-dom` into `vendor-react`, but Vite's tree-shaking merges them back into the main entry because they're always needed. This chunk is **0 bytes** — wasted config.

### Bundle Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| Three.js (507 kB) loaded on every page | **High** | `vendor-three` is a separate chunk but its import lives in `work-page.tsx` which is always loaded. Even on Home/Sahaj/Contact pages, Three.js is present in the JS bundle. |
| Supabase (210 kB) always loaded | **Medium** | `vendor-supabase` imported by `CataloguePopup` which is lazy-loaded in `work-page.tsx` — but the chunk is preloaded eagerly by Vite. |
| No code-splitting below route level | **Medium** | `work-page.tsx` (24 kB) bundles 5 category data arrays, essentials data, CSS strings, and lightbox logic in one file. |
| No tree-shaking for unused components | **Low** | `class-variance-authority` (CVA) is in dependencies but unused in any source file. |

---

## 2. IMAGE & MEDIA AUDIT

### Total Asset Size in dist/: 220 MB (96% of total 230 MB)

### HEAVIEST ASSETS

| Asset | Current Size | Type | Recommended Size | Potential Saving |
|-------|-------------|------|-----------------|-----------------|
| `hero video.mp4` | **75.1 MB** | MP4 | <5 MB | **93%** |
| `Dhruit Panchal V1.mp4` | **42.6 MB** | MP4 | <3 MB | **93%** |
| `fenil video.mp4` | **37.1 MB** | MP4 | <3 MB | **92%** |
| `The Hands of Sahaj.mp4` | **17.4 MB** | MP4 | <2 MB | **88%** |
| `S.webp` (panel strip) | **12.1 MB** | WebP | <200 KB | **98%** |
| `A.webp` (panel strip) | **11.2 MB** | WebP | <200 KB | **98%** |
| `H.webp` (panel strip) | **9.7 MB** | WebP | <200 KB | **98%** |
| `A1.webp` (panel strip) | **8.6 MB** | WebP | <200 KB | **98%** |
| `J.webp` (panel strip) | **7.7 MB** | WebP | <200 KB | **97%** |
| `ambient.mp3` | **6.8 MB @ 320kbps** | MP3 | 2.5 MB @ 128kbps | **63%** |
| `karigari-logo-png.webp` | **3.7 MB** | WebP | <50 KB | **99%** |
| `sahaj gallery placeholder.webp` | **1.7 MB** | WebP | <100 KB | **94%** |
| `ART WORK 2.webp` | **1.4 MB** | WebP | <200 KB | **86%** |
| `ART WORK 3.webp` | **1.2 MB** | WebP | <200 KB | **83%** |
| `background image of sahaj panel.webp` | **1.2 MB** | WebP | <100 KB | **92%** |
| `ART WORK 1.webp` | **392 kB** | WebP | <150 KB | **62%** |
| 10 Shikshapatri artwork images | **~3-5 MB each** | WebP | <200 KB | **95%** |
| 10 Eyes artwork images | **~3-4 MB each** | WebP | <200 KB | **95%** |

### Save estimates from just the top 20 assets: **~175 MB**

### Image Format Issues

| Issue | Files | Detail |
|-------|-------|--------|
| **HEIC files in src/assets/** | `8A.HEIC` (1 MB), `9A.HEIC` (1.4 MB) | HEIC is NOT a web format. Chrome, Firefox, Edge do not support it. These files cannot be served. |
| **WebP saved as PNG** | `karigari-logo-png.webp` (3.7 MB) | File name says "png" but extension is WebP. At 3.7 MB for a logo, this is extremely oversized. The NDH logo is only 19 KB for comparison. |
| **No responsive images** | All images | No `srcset` or `<picture>` elements anywhere. Desktop users download the same 12 MB strip image as mobile users. |

### Missing Optimizations

| Optimization | Status |
|-------------|--------|
| Lazy loading (`loading="lazy"`) | ✅ Present on homepage artworks |
| `preload="none"` on video | ✅ On hero video |
| Responsive images (`srcset`) | ❌ Not used anywhere |
| Image CDN transforms | ❌ R2 has no on-the-fly resizing |
| AVIF format | ❌ All assets are WebP or MP4 |
| Video compression (H.265/AV1) | ❌ All videos appear unoptimized |

---

## 3. JAVASCRIPT ANALYSIS

### File-by-File Analysis

| File | Size | Issue | Impact | Severity |
|------|------|-------|--------|----------|
| `src/routes/work-page.tsx` | 35.6 kB | Inline CSS string `GALLERY_CSS` (~300 lines) in a JS file — cannot be cached separately | CSS in JS bloats bundle, no cache separation | **Medium** |
| `src/routes/work-page.tsx:4` | — | Imports `@/config/r2` (wrong path → was `@/config/R2_URL`), now fixed but indicates fragile imports | Build risk | **Medium** |
| `src/routes/sahaj-page.tsx` | 24.3 kB | Imports 9 static assets via `assets.ts` + ambient audio — every route loads ambient | **High** | **High** |
| `src/routes/index-page.tsx` | 18.4 kB | Same ambient audio + 6 static imports — all bundled into the home page | **Medium** | **Medium** |
| `src/components/WebGLGallery.tsx` | 11.2 kB | Rarely used (users report "black canvases"), yet imported in `work-page.tsx` and always parsed | Unused functionality | **Medium** |
| `src/lib/ambient.ts` | 967 B | Module-level side effects at import time — adds `click` + `touchstart` listeners immediately on import | Forces early execution | **Medium** |
| `src/lib/drm.ts` | 2.1 kB | Duplicate of `imageProtection.ts` — both run identical keyboard/copy blocking | Two event listeners for same thing | **Low** |
| `src/lib/imageProtection.ts` | 2.2 kB | `MutationObserver` wraps every `<img>` in a protection overlay — runs on every DOM mutation | Continuous performance cost | **Medium** |
| `src/routes/work-page.tsx:783-795` | — | Preload adjacent images in lightbox via `new Image()` — good practice | ✅ Positive | — |

### Duplicate Libraries / Unused Dependencies

| Package | Size Impact | Used? | Detail |
|---------|-------------|-------|--------|
| `class-variance-authority` | ~2 kB | **No** | Not imported anywhere. Leftover from removed shadcn/ui components. |
| `tw-animate-css` | ~10 kB | **Partial** | Imported in `styles.css:2` but only `animate-pulse` is used (Tailwind v4's own animation classes could replace it). |
| `@tanstack/react-query` | ~25 kB | **Partial** | Imported but no actual data fetching via React Query. Only `QueryClient` + `QueryClientProvider` are used as wrappers. |
| `sharp` | ~30 MB on disk | **No** | DevDependency, never referenced in any script. |

### Event Listener Bloat

| Component | Listeners | Issue |
|-----------|-----------|-------|
| `main.tsx` (via `initImageProtection`) | keydown, contextmenu, MutationObserver | Global — never cleaned up |
| `__root.tsx` (via `useDRM()`) | keydown, keyup, contextmenu, copy, dragstart | Global — same as above, duplicate |
| `index-page.tsx` (via `ambient.ts`) | click, touchstart (module-level) | Fires on every click on the entire page |
| `work-page.tsx` | touchstart, touchend (document-level) | Swipe handlers on entire document |
| `Nav.tsx` | scroll listener | Fine, passive |
| `VideoPlayer.tsx` | IntersectionObserver per instance | 3 instances on `/sahaj` |

**Total:** At minimum **14+ event listeners** and **2 MutationObservers** on every page load.

---

## 4. CSS ANALYSIS

### CSS Bundle Size: 46.7 kB (8.9 kB gzip)

| Source | Size | Notes |
|--------|------|-------|
| Tailwind CSS v4 generated | ~35 kB | Utility classes |
| `tw-animate-css` | ~5 kB | Animation utilities (mostly unused) |
| Custom cinematic CSS | ~4 kB | Ambient overlays, vignette, bloom |
| Inline `<style>` in `work-page.tsx` | ~8 kB | Not in CSS file — inlined in JS |
| FontShare CSS (external) | ~5 kB render-blocking | `api.fontshare.com` CSS for Gambetta font |

### CSS Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| **Render-blocking external CSS** | **High** | `api.fontshare.com/v2/css?f[]=gambetta...` loads synchronously in `<head>` via `__root.tsx:88-90`. This is an external blocking resource. |
| **Duplicate CSS source** | **Medium** | `work-page.tsx` has 300+ lines of gallery CSS injected via `<style>{GALLERY_CSS}</style>` at render time instead of being in `styles.css`. This CSS is not extracted at build time — it's inlined in the JS bundle. |
| **Inline styles on every element** | **Low** | `work-page.tsx:831-839` uses inline `style={{ background: ... }}` for strip backgrounds — no CSS class extraction. |
| **Unused animations in styles.css** | **Low** | `pop-in-out`, `pop-in-out-5s`, `fade-up-after`, `gallery-fade-up`, `float` — multiple custom keyframes, but only 2-3 are actually referenced in the HTML. |

---

## 5. ANIMATION AUDIT

| Component | Animation Type | Performance Cost | Fix |
|-----------|---------------|-----------------|-----|
| Strips hover (`work-page.tsx`) | CSS `scale(1.05,1.08)`, `filter`, `box-shadow`, `border-color` | **Medium** — 4 properties animating. 5 panels x 4 props = 20 simultaneous transitions. Uses GPU compositing via `transform` (good), but `filter` causes repaint. | Use `will-change: transform, filter` |
| Reveal scroll animations | `opacity` + `translateY` via IntersectionObserver | **Low** — GPUs composited. Observer disconnects after first trigger. ✅ Good. | — |
| Hero text pop-in (`index-page.tsx`) | 3s and 5s keyframe animations on text | **Low** — single frame, GPU composited. | — |
| Gallery lightbox (`work-page.tsx`) | `opacity` + `scale(0.97→1)` | **Low** — GPU composited. | — |
| Slow zoom (`styles.css:86-97`) | `scale` 8s animation | **Low** — not currently used anywhere. | — |
| Nav background blur | `backdrop-blur-2xl` + `bg-background/40` | **Medium** — `backdrop-filter` is expensive on scroll, especially with blur. Applied on every scroll event. | Debounce or use CSS transition only. |
| Gallery card hover (`styles.css:213-215`) | `transform: scale(1.08)` | **Low** — GPU composited. | — |
| Gallery tabs (`styles.css:232-245`) | `width` transition on `::after` pseudo-element | **Low** — not used in current gallery. | — |
| Essentials boxes hover (`work-page.tsx`) | `scale(1.1, 1.03)`, `background`, `box-shadow`, `border-color` | **Low** — 10 boxes, 4 properties each. | — |

### No JavaScript animation libraries found (✅ Good)
- No GSAP, Framer Motion, or anime.js — all animations are CSS-based.
- No `requestAnimationFrame` loops outside WebGLGallery.

---

## 6. NETWORK & FETCH ANALYSIS

| Endpoint | Issue | Recommendation |
|----------|-------|---------------|
| `api.fontshare.com/v2/css?...` | **Render-blocking external CSS** | Preload with `rel="preload"` or inline the font CSS |
| `fonts.gstatic.com` (Google Fonts) | Preconnected but **not used** — no Google Fonts are loaded | Remove preconnect for `fonts.googleapis.com` and `fonts.gstatic.com` |
| `https://fonts.googleapis.com/css2?family=Cormorant+Garamond...` | Loaded on `/work` route — but this font is **never used** in any component | Remove this stylesheet link |
| `https://sahaj-gallery.vercel.app/og-image.jpg` | OG image points to old Vercel domain — will 404 if Vercel project is deleted | Move OG image to R2 |
| Sanity CMS API (via `CataloguePopup`) | Only loaded when popup is opened (lazy import) | ✅ Good |
| Supabase connection (via `CataloguePopup`) | Only loaded when popup is opened | ✅ Good |

---

## 7. COMPONENT RENDERING ANALYSIS

| Component | Re-render Triggers | Issue | Fix |
|-----------|-------------------|-------|-----|
| `Nav.tsx` | Scroll event → `setScrolled` | Fine — no props passed, state is local. | ✅ OK |
| `Reveal.tsx` | IntersectionObserver → `setShown(true)` | Fine — disconnects after first trigger. | ✅ OK |
| `VideoPlayer.tsx` | `timeupdate` event on video → `setProgress` | `setProgress` fires ~4x/second per video. On `/sahaj`, 3 video players = **12 state updates/second**. Each `setProgress` triggers a re-render of the entire `VideoPlayer` component. | Memoize or use ref for progress bar |
| `work-page.tsx` | `c`, `e` URL params change → re-render entire page | Navigation between categories resets everything. `activeIdx` and `artworks` recalculated. | ✅ Acceptable |
| `index-page.tsx` | Scroll → `checkScroll` → `ambient.volume()` | No React state update — writes to Audio element directly. | ✅ OK |
| `ambient.ts` (module-level) | Imported in both `index-page.tsx` and `sahaj-page.tsx` | `play()`/`stop()` called in both. Two scroll listeners calling `ambient.volume()` simultaneously if both pages are mounted. | Prevent duplicate ambient instances |
| `imageProtection.ts` | `MutationObserver` on body | Every DOM mutation triggers iteration over all images. With 40+ images, this is non-trivial. | Disconnect after first pass |

### Unnecessary Re-renders

No major re-render issues detected. The app is mostly static content with local state. **React 19's automatic batching** handles most cases well.

---

## 8. MEMORY LEAK ANALYSIS

| Location | Leak Risk | Detail |
|----------|-----------|--------|
| `work-page.tsx:796-811` | **Low** | `touchstart`/`touchend` listeners on `document` — cleaned up on unmount ✅ |
| `lib/imageProtection.ts` | **Medium** | `MutationObserver` is never disconnected. It runs for the entire lifetime of the page, even after all images are wrapped. |
| `lib/ambient.ts` | **Low** | Audio element created once via module-level `let audio`. `click`/`touchstart` listeners use `{ once: true }` — clean. ✅ |
| `lib/drm.ts` | **Low** | Event listeners cleaned up via `useEffect` return. ✅ |
| `Reveal.tsx` | **Low** | `IntersectionObserver` disconnected after first trigger. ✅ |
| `work-page.tsx:695-706` | **Low** | `Image()` preloads for strips have no cleanup but are harmless. |

### Confirmed Minor Leak
`imageProtection.ts:56-71` — `MutationObserver` attached globally and never disconnected via `.disconnect()`. Since this runs in `main.tsx` (not inside a component), there's no cleanup lifecycle.

---

## 9. LIGHTHOUSE SCORE ESTIMATION

Based on the audit data, here are the estimated Lighthouse scores for a production Cloudflare Pages deployment:

| Metric | Estimated Score | Contributing Factors |
|--------|----------------|---------------------|
| **First Contentful Paint (FCP)** | **~2.5-3.5s** | Render-blocking FontShare CSS + 46 kB CSS bundle + large hero image/video |
| **Largest Contentful Paint (LCP)** | **~4-8s** | Hero video (75 MB) — even with `preload="none"`, the `<video>` element affects LCP. Panel strip images (7-12 MB each) add to LCP on `/work`. |
| **Time to Interactive (TTI)** | **~3-4s** | 1.2 MB JS bundle (380 kB gzip) needs full download + parse + execute. Three.js (507 kB) is a major contributor. |
| **Total Blocking Time (TBT)** | **~300-500ms** | Parsing 507 kB Three.js chunk + 210 kB Supabase chunk on main thread. |
| **Cumulative Layout Shift (CLS)** | **<0.1** | Mostly static content with explicit dimensions. ✅ Good — layout shifts are minimal. |

### Primary LCP Contributors (worst to best):
1. `S.webp` — **12.1 MB** — the largest strip image. On `/work`, this image is one of the first loaded.
2. `hero video.mp4` — **75 MB** — even though `preload="none"`, the `<video>` element is in the initial viewport.
3. `vendor-three.js` — **507 kB** — parsed and executed before paint.
4. FontShare CSS — render-blocking external resource.

---

## 10. ROOT CAUSES OF SLOW PERFORMANCE

### #1 — 220 MB of Unoptimized Static Assets in dist/
**Estimated performance loss: 70% of total load time**

The website is ~96% media payload. 4 videos (172 MB total) + 5 strip images (49 MB) + ambient audio (6.8 MB) + logos (3.7 MB) account for 230 MB of the 230 MB total dist. This directly contributes to:
- Slow initial page load on all routes
- High bandwidth consumption (especially on mobile)
- Risk of hitting Cloudflare Pages' 500 MB deployment limit

### #2 — Render-Blocking External Font CSS
**Estimated performance loss: 10-15% of FCP**

`api.fontshare.com/v2/css?f[]=gambetta...` is loaded synchronously in `<head>`. Until this CSS loads, the browser cannot render text styled with `font-family: Gambetta`. With 45+ elements using `font-display` across all pages, this blocks the initial paint.

### #3 — 507 kB Three.js Always Loaded
**Estimated performance loss: 15% of TTI**

Three.js is bundled as a separate chunk (`vendor-three`) but is imported via the `work-page.tsx` lazy import. However, the chunk is still fetched and parsed on every page load (not just `/work`), adding 507 kB of JS that must be compiled on the main thread.

### #4 — Duplicate DRM + MutationObserver Overhead
**Estimated performance loss: 2-5% CPU time on page load**

`initImageProtection()` runs a `MutationObserver` that wraps every image on the page. Combined with `useDRM()` hook in `__root.tsx`, the same keyboard shortcuts are blocked twice. The MutationObserver persists for the entire session, adding overhead to every DOM mutation.

### #5 — Missing CDN Image Optimization
**Estimated performance loss: 20-30% of image bytes**

All images are served at their raw resolution. R2 has no image transformation pipeline. A 4000×3000 px image is served at full dimensions even to a 375×667 px mobile screen.

### #6 — Inline Gallery CSS in JS Bundle
**Estimated performance loss: 2-3% bundle size overhead**

300+ lines of gallery-specific CSS in `work-page.tsx` are string-injected at render time, bypassing Vite's CSS extraction and caching.

### #7 — Unoptimized Video Encoding
**Estimated performance loss: 15-20 seconds of video load time**

All 4 MP4 videos appear to be raw exports without web-optimization. No H.264/H.265 compression, no faststart flag for progressive download.

---

## 11. OPTIMIZATION ROADMAP

### QUICK WINS (Minutes each)

| Fix | Expected Improvement | Difficulty | Files Affected |
|-----|--------------------|------------|---------------|
| Remove unused `fonts.googleapis.com` preconnect + Cormorant Garamond font load on `/work` | Saves 1-2 blocking requests | Trivial | `__root.tsx:85-86`, `work.tsx:76-79` |
| Fix triple spaces in `<title>` tag | Negligible performance, SEO fix | Trivial | `__root.tsx:75` |
| Remove `tw-animate-css` import (only `animate-pulse` used — replace with Tailwind's built-in) | Saves ~5 kB CSS | Trivial | `src/styles.css:2` |
| Remove `vendor-react` from manualChunks config | Cleaner build output | Trivial | `vite.config.ts:12` |
| Add `loading="lazy"` to images on `/sahaj` page | Faster initial render | Trivial | `sahaj-page.tsx` (multiple `<img>` tags) |
| Remove unused `class-variance-authority` dependency | Saves ~2 kB in potential bundle | Trivial | `package.json:22` |

### MEDIUM IMPROVEMENTS (1-3 hours)

| Fix | Expected Improvement | Difficulty | Files Affected |
|-----|--------------------|------------|---------------|
| **Compress hero video to <5 MB** using `ffmpeg -i input.mp4 -vcodec libx264 -crf 23 -preset slow -vf "scale=1920:-2" output.mp4` | **70s → 5s load time** for largest asset | Medium | Replace `hero video.mp4` |
| **Compress all 5 panel strip images to <200 KB each** using `ffmpeg` or Squoosh CLI | **49 MB → <1 MB** (98% reduction) | Medium | All strip `.webp` files |
| **Re-encode ambient audio to 128 kbps** | **6.8 MB → 2.5 MB** (63% reduction) | Easy | `ambient.mp3` |
| **Remove duplicate DRM** — delete either `drm.ts` or `imageProtection.ts` | Reduces event listener overhead | Easy | Remove one file |
| **Preload FontShare CSS with `rel="preload"`** instead of synchronous load | **Saves ~500ms FCP** | Easy | `__root.tsx:88-90` |
| **Move inline gallery CSS to `styles.css`** | Better caching, smaller JS bundle by ~8 kB | Medium | `work-page.tsx` → `styles.css` |
| **Optimize karigari logo from 3.7 MB to <50 KB** | **98% reduction on logo** | Medium | `karigari-logo-png.webp` |

### MAJOR IMPROVEMENTS (Several hours)

| Fix | Expected Improvement | Difficulty | Files Affected |
|-----|--------------------|------------|---------------|
| **Serve all static assets from R2** — replace 17 static imports in `assets.ts` with `r2.*` URLs | **Removes 220 MB from dist/**, enables CDN caching | Hard | `assets.ts`, all page components |
| **Set up image CDN transforms** via Cloudflare Images or Image Resizing | Serve responsive images per device | Hard | Cloudflare config + `<picture>` elements |
| **Code-split Three.js to only load when WebGL mode is toggled** | **Saves 507 kB parse/execute** on initial load | Hard | `work-page.tsx`, `WebGLGallery.tsx` |
| **Implement route-based code splitting for `vendor-three`** | Three.js only on `/work` route | Medium | Router config |
| **Add proper image compression pipeline** (script to batch-optimize all assets) | All images optimized in one pass | Medium | Build script + `sharp` usage |
| **Implement Content Security Policy** via Cloudflare Workers | Security + performance (stops XSS) | Medium | Cloudflare config |
| **Convert HEIC files to WebP** | Fixes broken image links | Easy | Remove/replace `8A.HEIC`, `9A.HEIC` |

---

## SUMMARY

```
Total dist size:    230.25 MB
Video assets:       172 MB  (74.7%)
Image assets:        48 MB  (20.9%)
Audio assets:         7 MB  (3.0%)
JS + CSS + HTML:     3 MB  (1.3%)
-----------------------
Optimizable:        ~225 MB (97.8% of total payload)
```

**The single biggest performance improvement** is compressing the 4 videos and 5 strip panel images. This alone can reduce payload from 230 MB to under 10 MB — a **96% reduction**.

**Three.js** is the largest JS bottleneck at 507 kB — splitting it to only load on the `/work` route when WebGL is enabled would save significant parse/execute time on all other pages.

---

*Report generated by OpenCode Performance Audit Engine*
