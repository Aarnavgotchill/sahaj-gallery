    # Sahaj Gallery — Project Context

## Overview
Professional art gallery website for Sahaj Gallery (Ahmedabad, Gujarat). Built with Vite + React 19 + TanStack Router (client-side SPA). Deployed on Vercel at https://sahaj-gallery.vercel.app.

## Build & Deploy
- **Build command:** `npm run build` → `vite build && node scripts/postbuild.mjs`
- **Postbuild script** `scripts/postbuild.mjs`: scans `dist/assets/` for the largest JS file, generates `dist/index.html` with proper script/link tags, copies `public/_redirects` for SPA routing
- **Deploy:** `vercel --prod --yes`
- **Vercel config** (`vercel.json`): SPA rewrites `/* → /index.html`

## Tech Stack
- React 19, Vite 7, TypeScript 5.8
- TanStack Router (client-side, no SSR) + TanStack Query
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin, no config file)
- Fonts: Cormorant Garamond + Inter via Google Fonts (injected in `__root.tsx` `<head>`)

## Route Structure
| Path | File | Description |
|------|------|-------------|
| `/` | `src/routes/index.tsx` | Homepage — hero video, philosophy, featured works, audio |
| `/work` | `src/routes/work.tsx` | Gallery — category-filtered grid, lightbox, contact section |
| `/sahaj` | `src/routes/sahaj.tsx` | NDH House partnership page |
| `/contact` | `src/routes/contact.tsx` | Contact form + info page |

## Key Design Decisions
1. **No SSR** — converted from TanStack Start to plain Vite + React SPA for Vercel deployment
2. **Dark theme** — `bg-background` (#0f0f0f), `text-foreground` (#f5f0eb), gold accent (`--gold`)
3. **Image protection** — right-click, drag, long-press prevented. No WebGL (caused black canvases)
4. **Gallery categories** — horizontal scroll tabs, gold underline active, staggered fade-up animation
5. **Lightbox** — zoom, pan, 3D tilt, prev/next navigation, image name overlay
6. **Ambient audio** — plays on homepage hero, volume fades to 0 as scroll reaches 10% of page, then pauses. Autoplay blocked by browser → starts on first user click/touch

## Ambient Audio Behavior (`src/routes/index.tsx`)
- `checkScroll` callback calculates `progress = scrollY / (documentHeight * 0.1)`
- Volume fades linearly: `0.6 × (1 - progress)`, caps at 0
- Pauses when `progress >= 1` (≥10% scroll), resumes when back above threshold
- On mount: tries `audio.play()`, catches autoplay rejection → adds one-time click/touch listener to start
- Cleanup removes scroll listener and pauses audio on unmount

## Known Issues
- `routeTree.gen.ts` must be manually updated when adding new routes (TanStack Router plugin not in Vite config)
- No actual form submission handler on contact forms (preventDefault only)
- `src/lib/drm.ts` and `src/components/ProtectedImage.tsx` exist on disk but are dead code

## Color Palette
- `--gold`: `#c9a96e`
- `background`: `#1a0e28` (deep atmospheric purple)
- `foreground`: `#ece6dc` (warm off-white)
- `card`: `#281a3a` (slightly lifted purple)
- `border`: `#3a2850` (muted purple edge)
- `muted`: `#5a4a6e`
- `muted-foreground`: `#9a8aaa`

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
