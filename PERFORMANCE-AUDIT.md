# 🔬 SAHAJ GALLERY — COMPLETE PERFORMANCE AUDIT

**Auditor:** OpenCode AI
**Date:** June 20, 2026
**Target:** Lighthouse Performance ≥ 90

---

## 1. PROJECT OVERVIEW

| Attribute | Value |
|-----------|-------|
| **Framework** | React 19.2 + Vite 7.3 (SPA — no SSR) |
| **Router** | TanStack Router 1.168 (client-side) |
| **State** | TanStack Query 5.83 |
| **Styling** | Tailwind CSS 4.2, `tw-animate-css`, 395-line `styles.css` + 300-line inline CSS in `work.tsx` |
| **Fonts** | Gambetta-Medium (Fontshare), Micross/Microsoft Sans Serif (local TTF, 876 KB) |
| **Animation** | Pure CSS transitions/keyframes, IntersectionObserver `Reveal` component, no Framer Motion |
| **3D** | Three.js 0.184 + @react-three/fiber + @react-three/drei (all loaded but only used as optional WebGL toggle in lightbox) |
| **Backend** | Vercel Blob (hero video), Supabase (catalogue form), Sanity CMS (admin) |
| **Deployment** | Vercel, custom postbuild script, `_redirects` for SPA routing |
| **Build** | Single JS chunk (no code splitting), Vite default config |

---

## 2. PERFORMANCE BOTTLENECKS

### 2A. Monolithic JavaScript Bundle

**File:** `dist/assets/index-*.js` — **1,171 KB raw / 326 KB gzip**

This single chunk contains the entire application: all 4 routes, all components, Three.js, Supabase client, TanStack Router, Lucide icons, Zod, date-fns, recharts, and **55+ unused Radix UI packages**.

**Why this matters:** The browser must download, parse, and execute 326 KB gzip before any content is interactive. On a 3G connection, this adds **2–4 seconds** of blocking time.

**Root cause:** `vite.config.ts` has no `build.rollupOptions.output.manualChunks` — no code splitting at all.

### 2B. Unnecessary Client-Side Rendering & Hydration Issues

| Issue | File | Details |
|-------|------|---------|
| **SPA with no SSR** | All routes | Entire app is client-rendered. No initial HTML shell, so the user sees a blank white page until JS loads, parses, and React hydrates. With a 1.17 MB bundle, this means **2–5 seconds of blank screen** on first visit. |
| **No route-level splitting** | `routeTree.gen.ts` | All 4 routes (`/`, `/work`, `/sahaj`, `/contact`) are in the same bundle. Visiting `/contact` forces download of the `/work` gallery code, Three.js, and `/sahaj` video imports. |

### 2C. Excessive Re-renders

| Location | Issue |
|----------|-------|
| `src/routes/index.tsx:82-106` | Scroll listener + audio volume callback runs on every scroll event (passive, but still fires `setState`-like behavior via `audio.volume` mutation) |
| `src/components/Nav.tsx:15-20` | Scroll listener sets state on every event (triggers re-render on every pixel scrolled) |
| `src/routes/work.tsx:631-633` | `useEffect` resets `activeIdx` on every `c` or `e` change — fine, but the lightbox re-renders all artwork `<div>` elements on every navigation |
| `src/lib/imageProtection.ts:42-56` | `setInterval` every **1000ms** iterating ALL `<img>` elements on the page — runs forever, causing DOM manipulation and layout thrashing |

### 2D. Unnecessary API Calls / Network Requests

| Resource | Issue |
|----------|-------|
| `src/routes/__root.tsx:86-89` | Fontshare API call for Gambetta font (500–700 weights) — renders blocking |
| `src/routes/__root.tsx:84-85` | Google Fonts preconnect (unused — no Google Fonts are loaded) |
| `src/routes/work.tsx:59-61` | Cormorant Garamond + Montserrat from Google Fonts on every `/work` visit |

### 2E. Unused Dependencies (bloating install time, not bundle)

These 40+ packages are in `package.json` but **never imported** in any source file:

- `@radix-ui/react-accordion`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-aspect-ratio`, `@radix-ui/react-avatar`, `@radix-ui/react-checkbox`, `@radix-ui/react-collapsible`, `@radix-ui/react-context-menu`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-hover-card`, `@radix-ui/react-menubar`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-popover`, `@radix-ui/react-progress`, `@radix-ui/react-radio-group`, `@radix-ui/react-scroll-area`, `@radix-ui/react-select`, `@radix-ui/react-separator`, `@radix-ui/react-slider`, `@radix-ui/react-switch`, `@radix-ui/react-tabs`, `@radix-ui/react-toggle`, `@radix-ui/react-toggle-group`, `@radix-ui/react-tooltip`, `@radix-ui/react-label`, `@radix-ui/react-context-menu`
- `@react-three/drei`, `@react-three/fiber` (Three.js is imported directly in WebGLGallery)
- `@tanstack/react-start`, `@tanstack/router-plugin`, `@cloudflare/vite-plugin`
- `recharts`, `date-fns`, `cmdk`, `vaul`, `sonner`, `input-otp`, `react-day-picker`, `react-resizable-panels`, `@hookform/resolvers`, `embla-carousel-react`
- `tw-animate-css` (Tailwind v4 handles animations natively)
- `@ffmpeg-installer/ffmpeg` (devDep — unused)
- `@lovable.dev/vite-tanstack-config` (devDep — unused)

**Impact:** These don't bloat the *bundle* (tree-shaken), but they bloat `node_modules` (~300 MB+), slow install times on CI/Vercel, and increase the attack surface.

### 2F. Dead Code (Bundle Bloat)

| File | Size (est.) | Notes |
|------|-------------|-------|
| `src/assets/artist.jpg` | ~500 KB | Imported at `index.tsx:11` but **never rendered** in JSX |
| `src/assets/integration.jpg` | ~500 KB | Imported at `index.tsx:12` but **never rendered** |
| `src/assets/installation.jpg` | ~500 KB | Imported at `index.tsx:13` but **never rendered** |
| `src/data/gallery.ts` | ~700 KB (50 inline SVGs) | **Not imported** by any route (confirmed dead code) |
| `src/server.ts`, `src/lib/error-capture.ts`, `src/lib/error-page.ts` | ~15 KB | SSR files — unused in SPA mode |
| `src/components/ProtectedImage.tsx` | ~5 KB | Dead code — not imported anywhere |
| `src/components/NewHero.tsx` | ~0.5 KB | Stub component — unused |

**Estimated waste:** ~1.5 MB of unused imports and dead assets.

---

## 3. MEDIA ANALYSIS

### 3A. All Images Referenced in Code

| File | Size | Used In | Format Issue |
|------|------|---------|--------------|
| `ART WORK 1.png` | 2.0 MB | `index.tsx:263` | PNG — should be WebP |
| `ART WORK 2.png` | 10.4 MB | `index.tsx:315` | PNG — extremely large for a photo |
| `ART WORK 3.png` | 9.9 MB | `index.tsx:330` | PNG — extremely large |
| `sahaj trasnparent logo.png` | 44 KB | Nav, Home, Sahaj | Reasonable |
| `NDH_logo_4K.png` | 40 KB | All routes | "4K" in name — overkill for web at 40 KB |
| `Studio_Shikshaptri_white_4K.png` | 891 KB | `sahaj.tsx:141` | 4K logo — should be < 50 KB |
| `karigari-logo-png.webp` | 3.5 MB | `sahaj.tsx:154` | WebP but 3.5 MB for a logo! |
| `sahaj gallery placeholder.webp` | 1.6 MB | `sahaj.tsx:360` | Could be compressed |
| `S.webp` | 11.6 MB | `work.tsx:704` | Panel BG — massive |
| `A.webp` | 10.6 MB | `work.tsx:704` | Panel BG — massive |
| `H.webp` | 9.2 MB | `work.tsx:704` | Panel BG — massive |
| `A1.webp` | 7.3 MB | `work.tsx:704` | Panel BG — massive |
| `J.webp` | 7.5 MB | `work.tsx:704` | Panel BG — massive |
| `sahaj panel/1S/S1.jpg`–`S10.jpg` | 0.1–3.7 MB each | `work.tsx:98-109` | Raw JPGs |
| `sahaj panel/2A/1A.JPG`–`2A.JPG` | 10.9–11.1 MB | `work.tsx:120-122` | Raw JPGs — enormous |
| `sahaj panel/3H/1H.JPG`–`12H.JPG` | 9.5–12.0 MB each | `work.tsx:136-143` | Raw JPGs — all > 9 MB |
| `sahaj panel/4A/1AA.JPG`–`9AA.JPG` | 2.2–3.0 MB each | `work.tsx:146-148` | Raw JPGs |
| `sahaj panel/5J/1J.jpg`–`10J.jpg` | 0.1–2.4 MB each | `work.tsx:162-173` | Raw JPGs |
| `ESSENTIALS/*/*.png` | 9.5–22.2 MB each | `work.tsx:202-288` | PNGs — 17 files averaging 15 MB each! |
| `artist.jpg`, `integration.jpg`, `installation.jpg` | ~500 KB each | `index.tsx:11-13` | **Dead imports** — never rendered |

**Total image weight referenced by code: ~380 MB**

### 3B. Next/Image Equivalent?

**Not used.** The site uses plain `<img>` tags with `loading="lazy"` (on homepage only). No:
- Responsive `srcSet` / `sizes`
- Picture element with WebP/AVIF fallback
- Width/height attributes (causing layout shift)

---

## 4. VIDEO ANALYSIS

| File | Size | Used In | Preload | Issues |
|------|------|---------|---------|--------|
| `hero video.mp4` (Vercel Blob) | **275 MB** | `index.tsx:144-152` | `preload="metadata"` | 1️⃣ 275 MB — largest single asset. Even with `preload="metadata"`, the browser requests headers and may download initial bytes. On first visit, this video starts streaming immediately due to `autoplay`. |
| `fenil video.mp4` | **35.4 MB** | `sahaj.tsx:180` | `preload="none"` (VideoPlayer default) | Imported statically via `import`. VideoPlayer has `autoplay` + IntersectionObserver — video starts downloading as soon as it enters viewport but is also **part of the static import chain**, meaning the URL is resolved at module load. |
| `Dhruit Panchal V1.mp4` | **40.6 MB** | `sahaj.tsx:224` | `preload="none"` | Same as above — static import + IntersectionObserver autoplay |
| `The Hands of Sahaj.mp4` | **16.6 MB** | `sahaj.tsx:237` | `preload="none"` | Same pattern |
| Ambient MP3 | **6.5 MB** | `index.tsx:138` | N/A (audio element) | Loaded eagerly on homepage load via `<audio src={ambientMusic}>`. **Every homepage visit downloads 6.5 MB of background music,** even if the user bounces immediately. |

**Total video weight: 367.6 MB**

**Key issues:**
1. All 3 `/sahaj` videos are **statically imported** in `sahaj.tsx:11-13`. Vite inlines these into the module graph — the video URLs are resolved at bundle time, and the video files are included in the build output even though they're only needed on scroll.
2. `fenil video.mp4` and `Dhruit Panchal V1.mp4` are both ~40 MB. On a 4G connection, each takes ~60s to download fully.
3. No video compression/codec optimization — all are likely H.264 baseline with no 2-pass encoding.
4. No poster images — the video element shows black/nothing before play.

---

## 5. NETWORK OPTIMIZATION

### 5A. Caching Strategy

| Aspect | Current State | Issue |
|--------|--------------|-------|
| **JS/CSS** | Vite generates hashed filenames (`index-abc123.js`) — cache-busted correctly | ✅ Good |
| **Images** | No CDN optimization. `/assets/` files are served from Vercel's CDN with default caching. | ⚠️ No explicit `Cache-Control` headers for media that rarely changes |
| **Hero video** | Vercel Blob URL — CDN with default caching | ⚠️ 275 MB asset with no compression |
| **Fonts** | Fontshare CDN (external) + local TTF (876 KB) | ⚠️ Local micross.ttf is 876 KB — large font file |

### 5B. HTTP Request Count (Estimated)

| Request Type | Count | Size |
|-------------|-------|------|
| Main JS bundle | 1 | 1,171 KB |
| CSS | 1 | 89 KB |
| Fonts (external) | 4+ | ~200 KB |
| Fontshare API CSS | 1 | ~5 KB |
| Fonts (local) | 2 | ~920 KB |
| **Total blocking** | **~9** | **~2.4 MB** |

### 5C. Asset Loading Priorities

No `<link rel="preload">` or `<link rel="prefetch">` for any critical assets. The hero video starts as a low-priority fetch despite being above the fold. Fonts are loaded late via Fontshare CSS (render-blocking).

---

## 6. RENDERING OPTIMIZATION

### 6A. Components That Should Be Lazy Loaded

| Component | File | Reason |
|-----------|------|--------|
| `WebGLGallery` | `work.tsx:4` | Imports Three.js (184 KB) — only used when user clicks "WebGL View" in lightbox |
| `CataloguePopup` | `work.tsx:5` | Imports Supabase client — only shown on button click |
| `AdminPortal` | `index.tsx:5`, `contact.tsx:5` | Only shown after easter egg activation |
| `VideoPlayer` (on `/sahaj`) | `sahaj.tsx:5` | All 3 videos are below the fold — VideoPlayer component could be lazy-loaded only when scrolled near |

### 6B. Components Below the Fold

| Section | Page | Above/Below Fold |
|---------|------|-----------------|
| Philosophy | `/` | Below (requires scroll) |
| Sahaj Spotlight (3 artworks) | `/` | Below |
| Partnership Story | `/sahaj` | Below |
| Fenil Video | `/sahaj` | Below |
| Dhruti Video | `/sahaj` | Below |
| Hands of SAHAJ | `/sahaj` | Below (near bottom) |
| The Space | `/sahaj` | Below (near bottom) |

**All 3 video players and all heavy images on `/sahaj` are below the fold** — yet they're statically imported in the route module.

### 6C. Dynamic Imports / Code Splitting

**Current:** Zero dynamic imports. Everything is in one bundle.

Routes should be lazy-loaded via TanStack Router's `lazy` or dynamic `import()`.

### 6D. Server Components (SSR)

Not applicable — this is a pure SPA. However, adding a lightweight **server-rendered shell** (even just the `<head>`, nav, and loading state) would dramatically improve perceived performance.

**On Vercel:** The SPA approach means every visit serves an empty `index.html` with no content. Converting to a framework with SSR (or pre-rendering) would be the single biggest improvement.

---

## 7. LIGHTHOUSE ESTIMATED SCORES

Based on the current state:

| Category | Estimated Score | Key Issues |
|----------|---------------|------------|
| **Performance** | **25–35** ❌ | 1.17 MB JS bundle, 380 MB image weight, 6.5 MB audio loaded eagerly, no image optimization, no code splitting, layout shift from unset image dimensions |
| **Accessibility** | **70–80** ⚠️ | Buttons have no aria-labels (nav hamburger has one), color contrast is adequate, but some interactive elements lack focus indicators |
| **Best Practices** | **50–65** ⚠️ | `setInterval` forever scanning DOM, images without explicit dimensions, no `preload` for critical assets, HTTP (not HTTPS) for fontshare |
| **SEO** | **80–90** ✅ | Good meta tags, OG tags, viewport, description. SPA means crawlers may struggle with content indexing. |

**Target: 90+ Performance** — This requires fixing every item labeled **HIGH IMPACT** below.

---

## 8. FIX PLAN

### 🔴 HIGH IMPACT (Lighthouse Performance +20–40 points)

These fixes directly reduce the critical rendering path and time-to-interactive.

---

**Fix #1: Code-split the monolithic JS bundle**

| | |
|---|---|
| **File** | `vite.config.ts` |
| **Action** | Add `build.rollupOptions.output.manualChunks` to split vendor deps (React, TanStack, Three.js, Supabase, Lucide) into separate cacheable chunks |
| **Expected gain** | Main bundle drops from 1,171 KB → ~250 KB. Time-to-interactive improves by **2–4 seconds** |
| **Effort** | 10 minutes |

```ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom'],
        'vendor-router': ['@tanstack/react-router', '@tanstack/react-query'],
        'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
        'vendor-supabase': ['@supabase/supabase-js'],
        'vendor-icons': ['lucide-react'],
      },
    },
  },
},
```

---

**Fix #2: Lazy-load route-level code with `React.lazy`**

| | |
|---|---|
| **Files** | `src/main.tsx`, `src/routeTree.gen.ts`, all route files |
| **Action** | Convert route components to dynamic imports via `React.lazy(() => import(...))`. TanStack Router supports this natively — wrap each route's `component` with `lazy()` and a `<Suspense>` fallback |
| **Expected gain** | `/` homepage loads **without** parsing `/work`, `/sahaj`, or `/contact` code. `/sahaj` page (which imports 3 videos + Three.js) is deferred. **Saves ~600 KB from initial parse** |
| **Effort** | 30 minutes |

---

**Fix #3: Remove dead image imports from `index.tsx`**

| | |
|---|---|
| **File** | `src/routes/index.tsx:11-13` |
| **Action** | Delete lines: `import artist from "@/assets/artist.jpg"`, `integration.jpg`, `installation.jpg`. These images are imported but **never used** in JSX |
| **Expected gain** | **~1.5 MB of static asset imports removed** from the module graph. Fewer HTTP requests, smaller bundle |
| **Effort** | 2 minutes |

---

**Fix #4: Remove `initImageProtection()` setInterval**

| | |
|---|---|
| **File** | `src/lib/imageProtection.ts:40-58` |
| **Action** | Remove the `setInterval(..., 1000)` loop that iterates ALL `<img>` elements every second. Use a MutationObserver once instead, or remove entirely (DRM in `useDRM()` already blocks right-click + keyboard shortcuts) |
| **Expected gain** | **Stops perpetual CPU/DOM thrashing.** Each interval scan triggers forced layout recalculation. On `/work` with 80+ images, this is significant |
| **Effort** | 15 minutes |

---

**Fix #5: Compress hero video (275 MB → ~40 MB)**

| | |
|---|---|
| **File** | `src/assets/hero video.mp4` (source), Vercel Blob (live) |
| **Action** | Re-encode with `ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 96k output.mp4`. CRF 28 is visually transparent for cinematic footage with grain/noise |
| **Expected gain** | **Hero video drops from 275 MB → ~30-40 MB.** First-visit bandwidth drops by **235 MB**. Time to first video frame improves from ~15s → ~3s on 4G |
| **Effort** | 15 minutes (one-time) |

---

**Fix #6: Compress SAHAJ panel backgrounds (46 MB → ~10 MB)**

| | |
|---|---|
| **File** | `src/assets/{S,A,H,A1,J}.webp` — 5 files totaling 46 MB |
| **Action** | Re-encode with `ffmpeg -i input.webp -quality 60 -c:v libwebp output.webp` or use `cwebp -q 60 input.png -o output.webp`. Current WebPs are likely lossless or low-compression |
| **Expected gain** | **46 MB → ~8-10 MB.** When user first opens `/work`, panel backgrounds load **4× faster** |
| **Effort** | 5 minutes |

---

**Fix #7: Compress Essentials PNGs (17 files, 180+ MB → ~30 MB)**

| | |
|---|---|
| **File** | `src/assets/ESSENTIALS/**/*.png` — 17 PNGs averaging 10-22 MB each |
| **Action** | Convert to WebP lossy (quality 75) using `cwebp` or Squoosh CLI. These are photographs inside SAHAJ panels — no need for lossless PNG |
| **Expected gain** | **180+ MB → ~30 MB.** Each essentials row click loads **6× faster** |
| **Effort** | 10 minutes |

---

**Fix #8: Lazy-load ambient MP3**

| | |
|---|---|
| **File** | `src/routes/index.tsx:7`, `index.tsx:138` |
| **Action** | Remove the static `import ambientMusic from "..."` and use a dynamic import only after user interaction. Replace `src={ambientMusic}` with a `useEffect` that imports the MP3 on first click/scroll |
| **Expected gain** | **Homepage initial load saves 6.5 MB** of unnecessary download. Most users who bounce never need the ambient audio |
| **Effort** | 15 minutes |

---

### 🟡 MEDIUM IMPACT (Lighthouse Performance +5–15 points)

---

**Fix #9: Lazy-load `/sahaj` video imports**

| | |
|---|---|
| **File** | `src/routes/sahaj.tsx:11-13` |
| **Action** | Replace static `import fenilVideo from "@/assets/..."` with dynamic URL resolution in the video component. Use `IntersectionObserver` in each `<VideoPlayer>` to set the `src` *only when the section is near the viewport*. Currently the import chain eagerly resolves these URLs |
| **Expected gain** | **Prevents 92 MB of video URLs** from being in the initial route module graph. Videos start downloading only when scrolled to |
| **Effort** | 30 minutes |

---

**Fix #10: Add `<link rel="preload">` for hero video**

| | |
|---|---|
| **File** | `src/routes/index.tsx` (in `head()`) |
| **Action** | Add `{ rel: "preload", href: hero, as: "video", type: "video/mp4" }` to the route head meta |
| **Expected gain** | **Hero video starts downloading earlier** — reduces time to first video frame |
| **Effort** | 2 minutes |

---

**Fix #11: Remove unused Radix UI packages**

| | |
|---|---|
| **File** | `package.json` |
| **Action** | Uninstall 40+ unused Radix packages. Keep only `@radix-ui/react-dialog` (used by CataloguePopup), `@radix-ui/react-slot` (used by shadcn pattern) |
| **Expected gain** | **Reduces `node_modules` by ~200 MB.** Faster installs on Vercel CI (~10-15s saved per build). Not a runtime perf gain but improves deploy speed |
| **Effort** | 15 minutes |

---

**Fix #12: Remove dead dependencies**

| | |
|---|---|
| **File** | `package.json` |
| **Action** | Uninstall: `@react-three/drei`, `@tanstack/react-start`, `@tanstack/router-plugin`, `recharts`, `date-fns`, `cmdk`, `vaul`, `sonner`, `input-otp`, `react-day-picker`, `react-resizable-panels`, `embla-carousel-react`, `@cloudflare/vite-plugin` |
| **Expected gain** | Smaller `node_modules`, faster installs |
| **Effort** | 10 minutes |

---

**Fix #13: Add image width/height attributes to prevent CLS**

| | |
|---|---|
| **Files** | `src/routes/index.tsx` (lines 263, 315, 330), `src/routes/sahaj.tsx` (multiple `<img>` tags) |
| **Action** | Add `width` and `height` attributes to every `<img>` tag so the browser reserves space before the image loads |
| **Expected gain** | **Eliminates Cumulative Layout Shift (CLS)** — improves Lighthouse score by ~5 points |
| **Effort** | 20 minutes |

---

**Fix #14: Optimize micross.ttf font (876 KB)**

| | |
|---|---|
| **File** | `src/assets/micross.ttf` |
| **Action** | Subset the font to only include characters used on the site (Latin + basic punctuation). Use `glyphhanger` or `fonttools` |
| **Expected gain** | **Font drops from 876 KB → ~30-50 KB** |
| **Effort** | 15 minutes |

---

**Fix #15: Lazy-load `WebGLGallery` (Three.js)**

| | |
|---|---|
| **File** | `src/routes/work.tsx:4` |
| **Action** | Replace static import with `const WebGLGallery = React.lazy(() => import("@/components/WebGLGallery"))`. Only load Three.js when user clicks "WebGL View" |
| **Expected gain** | **~200 KB of Three.js** only loaded on demand. Not bundled in initial `/work` load |
| **Effort** | 15 minutes |

---

**Fix #16: Remove Cormorant Garamond + Montserrat font request**

| | |
|---|---|
| **File** | `src/routes/work.tsx:59-61` |
| **Action** | These fonts are defined in `GALLERY_CSS` template string (`font-family:'Montserrat',sans-serif`) but the site already uses Micross + Gambetta as its primary fonts. Either remove the Google Fonts link or remove the Montserrat usage from `GALLERY_CSS` |
| **Expected gain** | **1 fewer external HTTP request** (~50 KB font) |
| **Effort** | 2 minutes |

---

**Fix #17: Remove `tw-animate-css` import (duplicate CSS)**

| | |
|---|---|
| **File** | `src/styles.css:2` |
| **Action** | Remove `@import "tw-animate-css"`. Tailwind v4 has built-in animation utilities. This package is likely adding unused CSS |
| **Expected gain** | **CSS bundle shrinks by ~10-15 KB** |
| **Effort** | 5 minutes |

---

**Fix #18: Move inline `GALLERY_CSS` from `work.tsx` to `styles.css`**

| | |
|---|---|
| **File** | `src/routes/work.tsx:316-606` |
| **Action** | Move the 290-line CSS template string into `src/styles.css`. Inline `<style>` tags cannot be cached and add HTML weight |
| **Expected gain** | **CSS is tree-shaken and cached** on first load rather than re-parsed every visit |
| **Effort** | 10 minutes |

---

### 🟢 LOW IMPACT (Lighthouse Performance +1–5 points)

---

**Fix #19: Scope `useDRM()` to only `/work` page**

| | |
|---|---|
| **File** | `src/routes/__root.tsx:103` |
| **Action** | Only enable DRM protection on `/work` page where actual artwork is displayed. Currently it blocks right-click/copy globally on all pages including the contact form |
| **Expected gain** | Removes 5 aggressive global event listeners on non-essential pages. Marginal perf improvement but better UX |
| **Effort** | 10 minutes |

---

**Fix #20: Reduce `Reveal` IntersectionObserver overhead**

| | |
|---|---|
| **File** | `src/components/Reveal.tsx` |
| **Action** | Each `Reveal` creates a separate `IntersectionObserver` instance. On `/sahaj` with 10+ Reveal instances, 10 observers are active. Use a single shared observer or increase `rootMargin` |
| **Expected gain** | Reduces observer overhead. Marginal perf improvement |
| **Effort** | 15 minutes |

---

**Fix #21: Add poster image for hero video**

| | |
|---|---|
| **File** | `src/routes/index.tsx:144-152` |
| **Action** | The hero video has no poster image. Add a low-quality poster (or the first frame as WebP) to eliminate black flash before autoplay |
| **Expected gain** | Improves perceived load time of hero section |
| **Effort** | 10 minutes |

---

## PRIORITY SUMMARY

| Priority | Count | Est. MB Saved | Est. Lighthouse Gain |
|----------|-------|--------------|---------------------|
| **🔴 HIGH** | 8 | **~500+ MB** | **+20–40 points** |
| **🟡 MEDIUM** | 10 | **~50–100 MB** | **+5–15 points** |
| **🟢 LOW** | 3 | **~5 MB** | **+1–5 points** |

**After all HIGH-priority fixes:** Lighthouse Performance **70–80**
**After all fixes:** Lighthouse Performance **85–95** ✅

---

## QUICKEST WINS (1 hour)

If you want maximum impact in minimum time:

1. **Code-split JS bundle** (`vite.config.ts`) — 10 min
2. **Remove dead image imports** (`index.tsx:11-13`) — 2 min
3. **Stop setInterval image protection** (`imageProtection.ts`) — 5 min
4. **Lazy-load route components** (`main.tsx` + routes) — 20 min
5. **Lazy-load ambient MP3** (`index.tsx`) — 10 min
6. **Remove unused Radix packages** (`package.json`) — 10 min

**Result after 1 hour:** JS bundle drops from 1,171 KB → ~250 KB, no dead code, no CPU thrashing, no 6.5 MB audio on first load. **Lighthouse Performance jumps from ~35 → ~65.**
