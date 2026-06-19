# Sahaj Gallery — Project Context

## Overview
Professional art gallery website for Sahaj Gallery (Ahmedabad, Gujarat). Built with Vite + React 19 + TanStack Router (client-side SPA). Deployed on Vercel at https://sahaj-gallery.vercel.app.

## Build & Deploy
- **Build command:** `npm run build` → `vite build && node scripts/postbuild.mjs`
- **Postbuild script** `scripts/postbuild.mjs`: scans `dist/assets/` for the largest JS file, generates `dist/index.html` with proper script/link tags, copies `public/_redirects` for SPA routing
- **Deploy:** `vercel --prod --yes`
- **Vercel config** (`vercel.json`): SPA rewrites `/* → /index.html`
- **`.vercelignore`** ignores large files (`idea-2026.1.3.exe`, `hero video.mp4`)

## Tech Stack
- React 19, Vite 7, TypeScript 5.8
- TanStack Router (client-side, no SSR) + TanStack Query
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin, no config file)
- Fonts: Gambetta-Medium (`--font-display`), Micross / Microsoft Sans Serif (`--font-sans`)

## Route Structure
| Path | File | Description |
|------|------|-------------|
| `/` | `src/routes/index.tsx` | Homepage — hero video, philosophy, featured works, audio |
| `/work` | `src/routes/work.tsx` | Gallery — category-filtered grid, SAHAJ panels, lightbox |
| `/sahaj` | `src/routes/sahaj.tsx` | NDH House partnership page |
| `/contact` | `src/routes/contact.tsx` | Contact form + info page |

## Key Design Decisions
1. **No SSR** — converted from TanStack Start to plain Vite + React SPA for Vercel deployment
2. **Dark theme** — `bg-background` (#413152 deep purple), `text-foreground` (#ece6dc warm off-white), gold accent (`--gold: #c9a96e`)
3. **Image protection** — right-click, drag, long-press prevented. No WebGL (caused black canvases)
4. **Gallery categories** — URL-driven via `?c=` search param; deep-linkable
5. **Lightbox (`#l3`)** — fade + scale (0.97→1) entrance, no diamond clip-path
6. **Ambient audio** — plays on homepage hero, volume fades to 0 as scroll reaches 10% of page, then pauses
7. **Font mapping** — Gambetta-Medium for display/headings/gold text, Micross/Microsoft Sans Serif for body/descriptions

## Color Palette (`src/styles.css`)
- `--gold`: `#c9a96e`
- `background`: `#413152` (deep atmospheric purple)
- `foreground`: `#ece6dc` (warm off-white)
- `card`: `#4a385e` (slightly lifted purple)
- `border`: `#5a4a6e` (muted purple edge)
- `muted`: `#7a6a8e`
- `muted-foreground`: `#b0a4be`
- `primary`: `#ece6dc`
- `primary-foreground`: `#413152`

## Gallery Page (`src/routes/work.tsx`)

### SAHAJ Panels (Strips)
- 5 panels: S (Eyes), A (Shreenathji), H (Sikshapatri), A (Reflection), J (Cherry Blossom)
- Each maps to a category via explicit ID in `CATEGORIES` array
- Each category has exactly 10 artworks; missing entries show "Coming Soon" placeholders
- Strips have `aspect-ratio: 190/504`, `max-height: 480px`, `border-radius: 7px`
- Staggered fade-in entrance (opacity 0→1, translateY 30→0, 1.2s cubic-bezier, 250ms stagger)

#### Panel Hover Behavior
- **Scale:** `scale(1.1, 1.03)` — 10% wider, 3% taller
- **Background zoom:** `background-size: 110%`
- **Border:** fades to gold `rgba(201,169,110,.25)`
- **Brightness:** `brightness(.9)` (was .7 idle)
- **Transition duration:** all hover properties `0.35s ease`
- **Overlap prevention:** panels to the right of the hovered one shift via `translateX(22px)` using CSS custom property `--shift`, GPU-composited for zero jank
- **Stagger delay** for entrance animation uses CSS variable `--delay` so it doesn't affect hover speed

### Essentials Section
- 10 boxes spelling E-S-S-E-N-T-I-A-L-S
- Gold border, staggered entrance (100ms delay each)
- Hides when gallery opens (`#l1.out ~ .essentials-section`)

### Lightbox (`#l3`)
- Fixed fullscreen overlay, z-index 30
- Entrance: `opacity .5s` + `scale(.97→1)` (no diamond clip-path)
- Image name overlay, prev/next arrows, close button
- Swipe/touch support via touchStart/touchEnd handlers
- Keyboard: Escape (close), ArrowLeft/ArrowRight (navigate)

### URL State
- `?c=` search param drives gallery open/close
- `validateSearch` in route definition parses and resolves category aliases
- `useNavigate` to set/clear the param

## Sahaj Page (`src/routes/sahaj.tsx`)

### Sections
1. **Hero** — SAHAJ × NDH HOUSE branding, logos, tagline, description paragraphs, "Get in Touch" CTA
2. **Partnership Story** — "The Collaboration" kicker, STUDIO SHIKSHPATRI × KARIGARI STUDIO heading (gold), description text, logo cards
3. **Fenil Video + Testimonial** — video player with quote from CA. CS. Dr. Fenil Shah
4. **Dhruti Video + Testimonial** — video player with quote from Dhruti Panchal
5. **Hands of SAHAJ** — video with artist list (Nehal, Chintu, Hetakshi, Hansni, Arya, Pooja)
6. **The Essence of Sahaj** — 3 cards: "The Creative Circle", "Vision to Artwork", "White Glove Installation"
7. **The Space** — address, hours, contact info + sahaj gallery placeholder image card
8. **Footer** — SAHAJ GALLERY text + NDH House logo

### The Space Section
- `border-t` separator, `pt-40 pb-8 md:pt-56 md:pb-12` (bottom padding creates gap before footer)
- Two-column grid: left = address/hours/contact, right = placeholder image card
- Footer below has `border-t border-border/30 px-8 py-4`

## Homepage (`src/routes/index.tsx`)

### Sections
1. **Hero** — video background (autoplay muted), SAHAJ branding, corner bracket frame, kicker text
2. **Philosophy** — "The Story Behind the Name SAHAJ" with Hansa description (4 paragraphs) and Hansa logo
3. **Ambient Audio** — plays on hero, fades on scroll (progress < 10% = play, ≥10% = pause)
4. **Sahaj Spotlight** — "Artwork of the Month" title (gold), 3 artworks (ART WORK 1.png, 2.png, 3.png) with `object-contain`, descriptions
5. **Footer spacing** — last section before footer: `pt-40 pb-0 md:pt-56 md:pb-0`

## Ambient Audio Behavior (`src/routes/index.tsx`)
- `checkScroll` callback calculates `progress = scrollY / (documentHeight * 0.1)`
- Volume fades linearly: `0.6 × (1 - progress)`, caps at 0
- Pauses when `progress >= 1` (≥10% scroll), resumes when back above threshold
- On mount: tries `audio.play()`, catches autoplay rejection → adds one-time click/touch listener to start
- Cleanup removes scroll listener and pauses audio on unmount

## Cinematic Ambient System (`src/styles.css`)
The site uses a multi-layer cinematic aesthetic for a premium museum/editorial feel:

| Class | Purpose |
|-------|---------|
| `.ambient-overlay` | Fixed full-screen overlay with 3 radial purple gradients (low opacity, z-index 1) — rendering behind all page content |
| `.vignette` | Radial darkening from edges inward (45% transparent → 70% black) |
| `.bloom` | Position-absolute warm gold bloom from top center (very subtle, 6% opacity) |
| `.bloom-cool` | Cool blue-purple bloom from bottom-right corner |
| `.text-glow` | Gold-tinted text shadow for headings |
| `.text-glow-subtle` | Warm-white text shadow for body elegance |
| `.section-ambient` | Pseudo-element overlay on sections with top/bottom purple radial gradients |
| `.glow-warm` | Gold radial gradient from upper-left (5% opacity) |
| `.art-muted` | 85% saturation on artwork images, restores on hover |
| `.gold-border-bottom` | 0.5px gold bottom border |

**Usage:** `.ambient-overlay` is rendered in `__root.tsx` above the `Outlet`. Route sections can use `.bloom`, `.vignette`, `.section-ambient` as needed. All borders use `/40` or `/30` opacity for subtlety.

## Known Issues
- `routeTree.gen.ts` must be manually updated when adding new routes (TanStack Router plugin not in Vite config)
- No actual form submission handler on contact forms (preventDefault only)
- `src/lib/drm.ts` and `src/components/ProtectedImage.tsx` exist on disk but are dead code

## 🤝 Dual-Instance Collaboration Protocol

Two OpenCode instances work simultaneously:
- **VSCODE** — running in Visual Studio Code
- **ZED** — running in Zed editor (this instance)

### Communication
- **Shared log:** `.opencode/comm.log` — both instances read/write here
- **Format:** `[timestamp] INSTANCE | message`
- Always **write to comm.log before starting a new task** — claim what you're working on
- Always **read comm.log first** — check if the other instance is already working on something that overlaps

### Rules of Engagement
1. **Claim first** — write to comm.log before starting work
2. **Avoid overlap** — don't edit the same file the other instance is editing
3. **Tag the other** — use `@vscode` or `@zed` in comm.log to pass messages
4. **Conflict resolution** — if both claim overlapping work, the one who claimed first keeps it; the other picks a different task
5. **Sync after deploy** — after `git push`/`vercel deploy`, update comm.log with the deploy status
6. **No force-push** — always `git pull --rebase` before pushing to avoid clobbering the other instance's work
7. **Check comm.log on every task start** — always read the tail of comm.log before beginning work

## Recent Changes (Latest Session)

### Panel Hover Refinements (`src/routes/work.tsx`)
- Changed from uniform `scale(1.05)` → `scale(1.1, 1.03)` (10% width, 3% height)
- Transition speed reduced from `0.7s` → `0.35s` for snappiness
- Replaced `marginLeft` (layout-triggering) with `translateX` via CSS custom property `--shift` for GPU-composited, jank-free animation
- Panels to the right of the hovered panel shift 22px to prevent visual overlap
- Entrance stagger delay moved from inline `transitionDelay` (which was slowing hover) to CSS variable `--delay` applied only to entrance transition

### Sahaj Page (`src/routes/sahaj.tsx`)
- "The Space" section bottom padding: `pb-0` → `pb-8`, `md:pb-0` → `md:pb-12` (gap before footer)
- "STUDIO SHIKSHPATRI × KARIGARI STUDIO" heading changed to gold (`text-[color:var(--gold)]`)
