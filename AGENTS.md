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
- `background`: `#0f0f0f'
- `foreground`: `#f5f0eb`
- `muted-foreground`: faded warm gray
- `border`: subtle border color
- `card`: slightly lighter than background
