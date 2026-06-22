# Cloudflare R2 Migration & Deployment Report

**Project:** Sahaj Gallery  
**Date:** 2026-06-22  
**Target:** Cloudflare Pages deployment  

---

## 1. R2 Integration Status

| Component | Status | Details |
|---|---|---|
| R2 Base URL | ✅ Configured | `VITE_R2_URL=https://assets.sahajgallery.com` |
| Environment Variable | ✅ Set | `VITE_R2_URL` in `.env.local` |
| URL Construction | ✅ Centralized | `src/config/r2.ts` builds all R2 URLs |
| Asset Registry | ✅ Created | `src/assets/assets.ts` — 32 named exports + 6 artwork arrays |
| URL Validation | ✅ Added | `r2.ts` validates constructed URLs at runtime |
| Fallback Handling | ✅ Added | CSS background fallback for broken images; `.catch()` on all audio/video `.play()` |

## 2. Assets Migrated to R2

All media assets are now served exclusively from Cloudflare R2:

| Category | Count | R2 Path Prefix |
|---|---|---|
| Logos & Branding | 4 | `images/home_page/` |
| Hero Video | 1 | `hero/` |
| Homepage Spotlight Artworks | 3 | `images/home_page/` |
| SAHAJ Panel Strip Backgrounds | 5 | `images/home_page/` |
| Sahaj Panel Artworks (Gallery) | 41 files | `artworks/sahaj_gallery_panel/` |
| Essentials Section Artworks | 17 files | `artworks/essentials/` |
| Placeholder Images | 1 | `images/placeholder/` |
| Testimonial Videos | 3 | `videos/reviews/` |
| Ambient Audio | 1 | `audio/` |
| Fonts | 2 | `fonts/` |
| **Total** | **~78 assets** | Served from `https://assets.sahajgallery.com` |

## 3. Files Removed from GitHub

All local media files have been **untracked from git and deleted from disk**:

| Category | Files Removed |
|---|---|
| Root-level images (PNG, JPG, WEBP) | ~60 files |
| Gallery artwork subdirectories | 18 directories, ~200+ files |
| SAHAJ panel subdirectories | 5 directories, ~150+ files (including webp variants) |
| Essentials artwork | 6 directories, ~75 files |
| Category folders (thematic) | 12 directories, ~30 files |
| Videos (MP4) | 4 files |
| Audio (MP3) | 1 file |
| Fonts (OTF, TTF) | 2 files |
| Other (MD, HTML, EXE) | 4 files |
| **Total** | **~350+ files removed from git tracking** |

## 4. Source Files Modified

| File | Changes |
|---|---|
| `.gitignore` | Updated to allow `*.ts` in `src/assets/` while ignoring media |
| `.env.example` | Added Cloudflare R2 environment variable documentation |
| `src/config/r2.ts` | Added URL validation via `buildUrl()` helper |
| `src/assets/assets.ts` | **NEW** — Centralized asset registry with all named exports |
| `src/routes/index-page.tsx` | Replaced `r2.homePage/hero/audio` calls with registry imports |
| `src/components/Nav.tsx` | Replaced `r2.homePage` with registry import |
| `src/routes/sahaj-page.tsx` | Replaced 8 `r2.*` calls with registry imports |
| `src/routes/contact-page.tsx` | Replaced `r2.homePage` with registry import |
| `src/routes/work-page.tsx` | Replaced strip backgrounds + logo with registry imports |
| `src/styles.css` | Added fallback styling for R2-hosted images/videos |
| `wrangler.jsonc` | **NEW** — Cloudflare Pages deployment configuration |

## 5. Components Updated

| Component | Asset Changes |
|---|---|
| `Nav.tsx` | Logo sourced from registry → R2 |
| `index-page.tsx` | Hero video, 3 spotlight artworks, logo, audio all from registry |
| `sahaj-page.tsx` | All logos, videos, placeholder from registry |
| `contact-page.tsx` | Footer logo from registry |
| `work-page.tsx` | Strip backgrounds + footer logo from registry; artwork arrays use `r2` helper |

## 6. Missing Assets

| Asset | Status |
|---|---|
| `favicon.png` | ✅ In `public/` (local, not R2) |
| `og-image.jpg` (Open Graph) | ✅ Referenced as external URL in route head |
| All R2 assets | ✅ Uploaded and verified (per user confirmation) |

No missing assets detected.

## 7. Cloudflare Pages Deployment Config

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` |
| SPA routing | `public/_redirects` (`/* /index.html 200`) |
| Environment variable | `VITE_R2_URL` must be set in Cloudflare Pages dashboard |

### Deploy via Cloudflare Pages:

1. Push this repo to GitHub
2. In Cloudflare Dashboard → Pages → Create a new project
3. Connect your GitHub repository
4. Set build command: `npm run build`
5. Set build output: `dist`
6. Add environment variable: `VITE_R2_URL=https://assets.sahajgallery.com`
7. Deploy

### Or deploy via Wrangler CLI:

```bash
npx wrangler pages deploy dist --project-name=sahaj-gallery
```

## 8. Git Repository Cleanup

```
[git status summary]
- 350+ media files deleted from tracking (staged)
- 8 source files modified
- 3 new files: assets.ts, wrangler.jsonc, .env.example
- src/assets/ now contains only assets.ts (the registry)
```

## 9. R2 Bucket Structure

```
assets.sahajgallery.com/
├── audio/
│   └── Cinematic-Ambient-Background-Music.mp3
├── fonts/
│   ├── Gambetta-Medium.otf
│   └── micross.ttf
├── hero/
│   └── hero-video.mp4
├── images/
│   ├── home_page/
│   │   ├── NDH_logo_4K.png
│   │   ├── sahal-gallery-placeholder.webp
│   │   ├── sahaj-trasnparent-logo.png
│   │   ├── Studio_Shikshaptri_white_4K.png
│   │   ├── karigari-logo-png.webp
│   │   ├── ART-WORK-1-medium.webp
│   │   ├── ART-WORK-2-medium.webp
│   │   ├── ART-WORK-3-medium.webp
│   │   ├── S-medium.webp
│   │   ├── A-medium.webp
│   │   ├── A1-medium.webp
│   │   ├── H-medium.webp
│   │   └── J-medium.webp
│   └── placeholder/
│       └── sahaj-gallery-placeholder.webp
├── artworks/
│   ├── sahaj_gallery_panel/
│   │   ├── 1S/S1-S10.JPG
│   │   ├── 2A/1A-2A.JPG
│   │   ├── 3H/1H-10H.JPG
│   │   ├── 4A/1AA-9AA.JPG
│   │   └── 5J/1J-10J.jpg
│   └── essentials/
│       ├── 6E/Handle 1-4.png
│       ├── 7S/1SS-2SS.png
│       ├── 8S/1SSS-3SSS.png
│       ├── 9E/1EE-4EE.png
│       ├── 10N/1N-2N.png
│       └── 11T/1T-2T.png
└── videos/
    └── reviews/
        ├── fenil-video.mp4
        ├── Dhruit-Panchal-V1.mp4
        └── The-Hands-of-Sahaj.mp4
```
