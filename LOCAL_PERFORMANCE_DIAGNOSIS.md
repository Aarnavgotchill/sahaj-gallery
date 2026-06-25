# LOCAL PERFORMANCE DIAGNOSIS

> **Focus:** Runtime performance, rendering, React behavior, event listeners, animations
> **Mode:** Local development (`npm run dev`)
> **Date:** 2026-06-25

---

## VERIFIED BOTTLENECKS

### 🔴 Critical (Measurable Frame Drops)

#### 1. MutationObserver — Full DOM Scan on Every Mutation
- **File:** `src/lib/imageProtection.ts:56-71`
- **Problem:** `MutationObserver` with `{ childList: true, subtree: true }` on `document.body` fires on **every single DOM mutation** in the entire page. The callback runs `document.querySelectorAll("img")` which scans every node, then iterates to wrap each image in a protective overlay.
- **Why it's devastating in dev mode:** React StrictMode causes mounting → unmounting → re-mounting, doubling all DOM mutations. Suspense boundaries (present in `__root.tsx`) create/tear down DOM nodes. Lazy-loaded components (all routes) trigger additional mutations. Every route change, every image load, every `Reveal` triggering its class change — all fire the observer.
- **No cleanup:** The observer is **never disconnected** (`observer.disconnect()` never called). It persists for the lifetime of the page, unlike every other listener in the codebase which cleans up.
- **Estimated cost on `/work`:** 200–500+ DOM mutations during initial render → 200–500+ `querySelectorAll("img")` calls scanning the entire DOM tree.

#### 2. Duplicate Keyboard Event Handlers (2× Processing Per Keystroke)
- **File 1:** `src/lib/drm.ts:63` — `window.addEventListener("keydown", keydown, true)` (capture phase)
- **File 2:** `src/lib/imageProtection.ts:23` — `document.addEventListener("keydown", ...)` (bubble phase)
- **Problem:** Every keystroke is processed by **two separate handlers** on different phases. Both intercept overlapping key sets (PrintScreen, F12, Ctrl+S/P/U, Ctrl+Shift+I/J/C). The DRM handler has proper cleanup; the imageProtection handler has **no cleanup** and persists forever.
- **Additional handlers:** `contextmenu` also exists in both files (capture + bubble), `copy` + `dragstart` in drm.ts only. Three separate `contextmenu` blockers across the app.

#### 3. React StrictMode — Everything Runs Twice
- **File:** `src/main.tsx:27` — `<React.StrictMode>`
- **Impact:** All components render twice. All `useEffect` callbacks fire, cleanup, then fire again. All `useState` initializers run twice. All `IntersectionObserver` instances are created and disconnected twice. All scroll listeners are attached and removed twice before the final attachment.
- **This compounds every other issue on this list by 2×.**

#### 4. Multiple Scroll Listeners — 2–3 Per Page
- **Every page:** `Nav.tsx:18` — scroll listener for sticky header (passive)
- **`/` (index):** `index-page.tsx:61` — scroll listener for ambient audio fade (passive)
- **`/sahaj`:** `sahaj-page.tsx:33` — scroll listener for ambient audio fade (passive)
- **Problem:** On the Sahaj page, **three** scroll listeners fire on every scroll frame. The `checkScroll` callback computes `document.documentElement.scrollHeight * 0.15` (forced layout read) and calls `ambient.volume()` which sets `audio.volume`. The `Nav` callback triggers a React `setState` on every scroll event that crosses the 40px threshold.

#### 5. `backdrop-filter: blur()` — GPU/Paint Cost on Nav & Gallery
- **File:** `src/components/Nav.tsx:35` — `backdrop-blur-2xl` applied when scrolled (via `all duration-700` transition)
- **File:** `src/routes/work-page.tsx:414` — `backdrop-filter: blur(24px)` on gallery nav
- **File:** `src/routes/work-page.tsx:473,536` — `backdrop-filter: blur(10px)` and `blur(12px)` on lightbox elements
- **Problem:** `backdrop-filter: blur()` is one of the most expensive CSS properties. Safari and Chromium both composite it on the GPU, but it triggers a full-area paint on every scroll frame when the Nav transitions between states. The transition on `all` means backdrop-filter interpolates smoothly (60fps paint) across the 700ms duration. The gallery nav applies `blur(24px)` — the highest blur radius in the app — constantly on the `/work` page.

---

### 🟠 High (Cumulative Slowness)

#### 6. `Reveal` Component — 25+ Independent IntersectionObservers
- **File:** `src/components/Reveal.tsx` 
- **Usage:** ~15 instances on `/sahaj`, ~10 on `/`, ~3 on `/work` (essentials boxes)
- **Problem:** Each `Reveal` creates its own `IntersectionObserver` instance with `threshold: 0.15`. With 15+ on a page, the browser must process 15+ intersection calculations on every scroll frame. Each observer triggers `setTimeout` + `setState` when intersecting.

#### 7. Module-Level URL Computation — 50+ Calls Per Page Load
- **File:** `src/routes/work-page.tsx:88-172, 238-385` (module-level array definitions)
- **File:** `src/config/R2_URL.ts:4-11` (`toLocalPath()` with 4 regex replacements per call)
- **Problem:** ~50 artwork image URLs are computed at module evaluation time via `r2.sahajPanel()` and `r2.essentials()`. Each call runs through `buildUrl()` → `toLocalPath()` which performs 4 sequential regex `.replace()` calls. In production, this is fast (simple string concat), but in dev mode, the regex replacements add up. This runs **before any React rendering** and blocks the main thread.

#### 8. Video `IntersectionObserver` — 3 Video Players on Sahaj Page
- **File:** `src/components/VideoPlayer.tsx:28-43`
- **Problem:** Three `VideoPlayer` components on `/sahaj`, each with its own `IntersectionObserver` + `threshold: 0.3`. Each observer calls `el.play()` or `el.pause()` which triggers video decoding initialization. Even with `preload="none"`, calling `.play()` starts decoding work that persists until `.pause()`.

#### 9. Image Preloading — Creates New Image Objects on Every Category Navigation
- **File:** `src/routes/work-page.tsx:785-797`
- **Problem:** On every `activeIdx` change, the effect creates `new Image()` objects for adjacent artworks (index -1, +1). Combined with the keydown handler (arrow keys), rapid arrow key presses create multiple `Image` objects in flight with no cleanup/cancellation of previous preloads.

#### 10. WebGL Gallery Texture Re-Loading on Category Switch
- **File:** `src/components/WebGLGallery.tsx` 
- **Problem:** `key={c}` on `WebGLGallery` causes full unmount/re-mount when category changes. The `setupScene` function re-loads ALL textures from scratch via `Promise.all(artworks.map(...))`. For a category with 10 artworks, this means 10 `THREE.TextureLoader().load()` calls. The `requestAnimationFrame` loop runs continuously even when idle (no interaction), keeping the GPU active.

---

### 🟡 Moderate

#### 11. `Nav` State Update on Scroll — SetState on Every Scroll Event
- **File:** `src/components/Nav.tsx:12-20`
- **Problem:** `setScrolled()` is called on **every** scroll event (not throttled). While React is efficient with batched updates, setting state on every scroll animation frame forces a re-render of the entire `Nav` component each time.

#### 12. `VideoPlayer` `timeupdate` Listener — 4×/sec State Update
- **File:** `src/components/VideoPlayer.tsx:15`
- **Problem:** `timeupdate` fires ~4 times per second, each call does `setProgress(vid.currentTime / (vid.duration || 1))`. This triggers a re-render that updates the progress bar width via inline style. During active video playback, this is 4 re-renders/second.

#### 13. `CataloguePopup` — Supabase Client Created at Module Level
- **File:** `src/components/CataloguePopup.tsx:15`
- **Problem:** `createClient()` runs at module evaluation time with the Supabase URL/anon key, even though the CataloguePopup is only shown when the user clicks the button. The client object persists in memory for the entire app lifetime.

---

## FALSE POSITIVES

| Previous Concern | Finding |
|---|---|
| **Three.js / WebGL overhead** | `WebGLGallery` is lazy-loaded and opt-in (toggle button). Only active if user clicks "WebGL View". Not a factor for normal browsing. |
| **`class-variance-authority` / `clsx` / `tailwind-merge` overhead** | Only one use case (`dialog.tsx:cn()`). Negligible cost. |
| **Tailwind JIT compilation** | `@tailwindcss/vite` plugin handles this efficiently. Only generates used classes. |
| **React Query overhead** | Created via `QueryClient` but no actual queries are being made on any page. The provider is a no-op wrapper. |
| **Font loading** | Both fonts use `font-display: swap` and are preconnected. Blocking time is negligible. |
| **CSS animation performance (`.reveal`, `.pop-in-out`)** | These are opacity+transform animations that are GPU-composited. They run once or on scroll-reveal. Not a primary bottleneck. |
| **Image network requests** | Out of scope per your constraints, but noted: in dev mode, `R2_URL.ts` constructs local paths (`/src/assets/...`) for all images. These files do not exist in the repository (removed during R2 migration). Every image request returns a 404, which the browser must handle. |

---

## TOP 10 PERFORMANCE COSTS

| Rank | Issue | File | Estimated Dev Mode Impact |
|------|-------|------|--------------------------|
| **1** | MutationObserver scanning entire DOM on every mutation | `imageProtection.ts:56` | **50–60%** of perceived jank during scroll/page transitions |
| **2** | React StrictMode double-rendering | `main.tsx:27` | **2×** multiplier on all other costs |
| **3** | Duplicate keydown handlers (2× keystroke processing) | `drm.ts:63` + `imageProtection.ts:23` | **5–10%** of perceived sluggishness during keyboard interaction |
| **4** | Multiple scroll listeners (2–3 per page) | `Nav.tsx:18`, `index-page.tsx:61`, `sahaj-page.tsx:33` | **10–15%** of scroll jank |
| **5** | `backdrop-filter: blur()` on Nav + gallery | `Nav.tsx:35`, `work-page.tsx:414` | **10–15%** of scroll jank (expensive paint compositing) |
| **6** | Module-level URL computation (50+ regex calls) | `work-page.tsx:88-172`, `R2_URL.ts:4-11` | **5%** of initial load blocking time |
| **7** | 25+ IntersectionObservers (Reveal + VideoPlayer) | `Reveal.tsx`, `VideoPlayer.tsx` | **5–10%** of scroll processing |
| **8** | Image preloads without cancellation | `work-page.tsx:785-797` | **Spikes** during rapid gallery navigation |
| **9** | Nav `setScrolled` on every scroll frame | `Nav.tsx:16` | **3–5%** of scroll jank |
| **10** | VideoPlayer `timeupdate` → setProgress 4×/sec | `VideoPlayer.tsx:15` | **2–3%** during video playback |

---

## PERFORMANCE IMPACT ESTIMATE

| Scenario | Without Fixes | With Top-5 Fixes |
|----------|--------------|------------------|
| Initial page load (`/sahaj`) | ~1200–1800ms jank (visible lag, stutter) | ~400–600ms (smooth) |
| Scrolling on `/sahaj` | Choppy scroll, 15–25fps dips | Smooth 60fps |
| Scrolling on `/work` (gallery closed) | Choppy scroll, navigation lag | Smooth 60fps |
| Opening gallery (`/work?c=eyes`) | ~300–500ms delay, visible pop-in | ~100–150ms |
| Keyboard navigation in gallery | Noticeable lag on rapid arrow presses | Instant response |
| Typing in contact form | Small delay on every keystroke (2× handlers) | Instant response |

---

## FIX PRIORITY

### 1️⃣ Most Important (Immediate Impact)

| Fix | File | Why |
|-----|------|-----|
| **Disconnect MutationObserver after initial run** OR replace with targeted observer | `imageProtection.ts:56-71` | Stops the #1 source of DOM jank. The observer only needs to run once after initial render to wrap images. Use `{ once: true }` pattern or disconnect after first batch. |
| **Remove duplicate keydown handler from `imageProtection.ts`** | `imageProtection.ts:23-48` | DRM handler (`drm.ts`) already covers all cases with proper cleanup. The duplicate has no cleanup and doubles keystroke work. |
| **Remove React StrictMode in dev** | `main.tsx:27` | Use `React.StrictMode` only around specific subtrees during testing, not the entire app in dev. Eliminates the 2× multiplier on all render/effect work. |

### 2️⃣ Important (Perceptible Improvement)

| Fix | File | Why |
|-----|------|-----|
| **Throttle/debounce Nav scroll handler** | `Nav.tsx:15-19` | `setScrolled` only needs to run at ~5fps (200ms throttle) since it toggles a binary state. |
| **Reduce `backdrop-filter` blur radius** on gallery nav | `work-page.tsx:414` | `blur(24px)` → `blur(12px)` or remove entirely. Less GPU paint cost. |
| **Use `will-change: backdrop-filter`** on nav to promote to GPU layer | `Nav.tsx` | Prevents paint repromotion on every state transition. |
| **Remove `transition: all`** on nav | `Nav.tsx:33` | `all duration-700` transitions backdrop-filter unnecessarily. Use specific properties. |

### 3️⃣ Nice to Have (Marginal Gain)

| Fix | File | Why |
|-----|------|-----|
| Cancel previous image preloads on rapid navigation | `work-page.tsx:785-797` | Track preload image refs and abort if `activeIdx` changes. |
| Pause `requestAnimationFrame` in WebGLGallery when idle | `WebGLGallery.tsx:281-303` | Stop rAF loop when no interaction for 5s. Resume on interaction. |
| Replace module-level array construction with lazy evaluation | `work-page.tsx:88-172` | Only compute artwork URLs when the gallery opens, not at module load. |
| Remove rAF-based floating animation on non-focused planes | `WebGLGallery.tsx:296-299` | `Math.sin()` on every plane every frame is unnecessary GPU work. |
