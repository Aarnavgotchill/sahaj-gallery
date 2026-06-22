# Asset Registry Report — Sahaj Gallery

Generated: 2026-06-22

> **Architecture:** All assets are served from Cloudflare R2 (`https://assets.sahajgallery.com`). Local files in `src/assets/` are the source originals uploaded to R2. The centralized registry is at `src/assets/assets.ts`, which provides named exports used throughout the application. The `r2` config helper (`src/config/r2.ts`) constructs the full R2 URLs.

---

## 1. Logos & Branding

| Asset Name | Registry Export | R2 Path | Used In | Status |
|---|---|---|---|---|
| Sahaj Transparent Logo | `sahajTransparentLogo` | `images/home_page/sahaj-trasnparent-logo.png` | `index-page.tsx` (philosophy section), `Nav.tsx` (navbar), `sahaj-page.tsx` (hero) | **Used** |
| NDH House Logo 4K | `ndhLogo4K` | `images/home_page/NDH_logo_4K.png` | `index-page.tsx` (footer, philosophy), `work-page.tsx` (footer), `sahaj-page.tsx` (hero, footer), `contact-page.tsx` (footer) | **Used** |
| Studio Shikshaptri Logo | `studioShikshaptriLogo` | `images/home_page/Studio_Shikshaptri_white_4K.png` | `sahaj-page.tsx` (partnership story section) | **Used** |
| Karigari Studio Logo | `karigariLogo` | `images/home_page/karigari-logo-png.webp` | `sahaj-page.tsx` (partnership story section) | **Used** |

## 2. Hero Assets

| Asset Name | Registry Export | R2 Path | Used In | Status |
|---|---|---|---|---|
| Hero Video | `heroVideo` | `hero/hero-video.mp4` | `index-page.tsx` (hero section) | **Used** |
| Hero Image | `heroImage` | `images/hero.jpg` | — (local only) | **Unused in code** |
| Hero Medium | `heroMedium` | `images/hero-medium.webp` | — (local only) | **Unused in code** |
| Hero Thumb | `heroThumb` | `images/hero-thumb.webp` | — (local only) | **Unused in code** |

## 3. Homepage Spotlight Artworks

| Asset Name | Registry Export | R2 Path | Used In | Status |
|---|---|---|---|---|
| Artwork Spotlight 1 | `artworkSpotlight1` | `images/home_page/ART-WORK-1-medium.webp` | `index-page.tsx` (spotlight row 1) | **Used** |
| Artwork Spotlight 2 | `artworkSpotlight2` | `images/home_page/ART-WORK-2-medium.webp` | `index-page.tsx` (spotlight row 2) | **Used** |
| Artwork Spotlight 3 | `artworkSpotlight3` | `images/home_page/ART-WORK-3-medium.webp` | `index-page.tsx` (spotlight row 3) | **Used** |
| Artwork Spotlight 1 Full | `artworkSpotlight1Full` | `images/home_page/ART-WORK-1.png` | — (local only) | **Unused in code** |
| Artwork Spotlight 2 Full | `artworkSpotlight2Full` | `images/home_page/ART-WORK-2.png` | — (local only) | **Unused in code** |
| Artwork Spotlight 3 Full | `artworkSpotlight3Full` | `images/home_page/ART-WORK-3.png` | — (local only) | **Unused in code** |

## 4. SAHAJ Panel Strip Backgrounds (Gallery Category Cards)

| Asset Name | Registry Export | R2 Path | Used In | Status |
|---|---|---|---|---|
| Strip S (The Eyes) | `stripS` | `images/home_page/S-medium.webp` | `work-page.tsx` (gallery strip cards) | **Used** |
| Strip A (Shreenathji) | `stripA` | `images/home_page/A-medium.webp` | `work-page.tsx` (gallery strip cards) | **Used** |
| Strip H (Sikshapatri) | `stripH` | `images/home_page/H-medium.webp` | `work-page.tsx` (gallery strip cards) | **Used** |
| Strip A1 (Reflection) | `stripA1` | `images/home_page/A1-medium.webp` | `work-page.tsx` (gallery strip cards) | **Used** |
| Strip J (Cherry Blossom) | `stripJ` | `images/home_page/J-medium.webp` | `work-page.tsx` (gallery strip cards) | **Used** |

## 5. Sahaj Panel Artworks (Gallery Lightbox)

### 5a. The Eyes (Panel 1S — 10 images)
Files: `sahaj panel/1S/S1.JPG` through `S10.JPG` (+ S7.jpg, S9-S14.jpg — extras exist locally)
Code references `r2.sahajPanel("1S/S{i}.JPG")` for i=1..10 via `eyesArtworks` array in `work-page.tsx`.
Local has 14 S files (S1–S14); code only uses S1–S10. S11–S14 are **unused**.

### 5b. Shreenathji Grace (Panel 2A — 2 images)
Files: `sahaj panel/2A/1A.JPG`, `2A/2A.JPG`
Code references both via `shreenathjiArtworks` in `work-page.tsx`.

### 5c. Sikshapatri (Panel 3H — 10 images)
Files: `sahaj panel/3H/1H.JPG` through `12H.JPG`
Code references `sikshapatriArtworks` (1H–10H). Files 11H.JPG and 12H.JPG exist locally but are **unused**.

### 5d. Reflection (Panel 4A — 9 images)
Files: `sahaj panel/4A/1AA.JPG` through `9AA.JPG`
Code references all 9 via `reflectionArtworks` in `work-page.tsx`. 10th entry is a placeholder.

### 5e. Cherry Blossom (Panel 5J — 10 images)
Files: `sahaj panel/5J/1J.jpg` through `10J.jpg` (also 5J.jpeg, 6J.jpeg, 9J.jpeg)
Code references `cherryBlossomArtworks` using `.jpg` extension. The `.jpeg` variants are **unused**.

## 6. Essentials Section Artworks

| Subsection | Registry Export | Files | Used In | Status |
|---|---|---|---|---|
| 6E (Handles) | `essentials6E` | `ESSENTIALS/6E/Handle 1-4.png` | `work-page.tsx` (essentials grid) | **Used** |
| 7S | `essentials7S` | `ESSENTIALS/7S/1SS.png`, `2SS.png` | `work-page.tsx` (essentials grid) | **Used** |
| 8S | `essentials8S` | `ESSENTIALS/8S/1SSS-3SSS.png` | `work-page.tsx` (essentials grid) | **Used** |
| 9E | `essentials9E` | `ESSENTIALS/9E/1EE-4EE.png` | `work-page.tsx` (essentials grid) | **Used** |
| 10N | `essentials10N` | `ESSENTIALS/10N/1N.png`, `2N.png` | `work-page.tsx` (essentials grid) | **Used** |
| 11T | `essentials11T` | `ESSENTIALS/11T/1T.png`, `2T.png` | `work-page.tsx` (essentials grid) | **Used** |

Each essentials PNG also has `-medium.webp` and `-thumb.webp` variants locally. The code references only the `.png` files via R2. The webp variants are **not directly referenced in code** (they may be used by the CDN for responsive delivery).

## 7. Placeholder / Gallery Images

| Asset Name | Registry Export | R2 Path | Used In | Status |
|---|---|---|---|---|
| Sahaj Gallery Placeholder | `sahajGalleryPlaceholder` | `images/placeholder/sahaj-gallery-placeholder.webp` | `sahaj-page.tsx` (The Space section) | **Used** |
| Sahaj Final Placeholder | `sahajFinalPlaceholder` | `images/placeholder/sahaj-final-placeholder.jpg` | — (local only) | **Unused in code** |
| Gallery Background | `galleryBackground` | `images/gallery-background.jpg` | — (local only) | **Unused in code** |

## 8. Videos

| Asset Name | Registry Export | R2 Path | Local File | Used In | Status |
|---|---|---|---|---|---|
| Fenil Testimonial | `fenilTestimonialVideo` | `videos/reviews/fenil-video.mp4` | `fenil video.mp4` | `sahaj-page.tsx` (Fenil section) | **Used** |
| Dhruti Testimonial | `dhrutiTestimonialVideo` | `videos/reviews/Dhruit-Panchal-V1.mp4` | `Dhruit Panchal V1.mp4` | `sahaj-page.tsx` (Dhruti section) | **Used** |
| Hands of Sahaj | `handsOfSahajVideo` | `videos/reviews/The-Hands-of-Sahaj.mp4` | `The Hands of Sahaj.mp4` | `sahaj-page.tsx` (Hands section) | **Used** |

## 9. Audio

| Asset Name | Registry Export | R2 Path | Local File | Used In | Status |
|---|---|---|---|---|---|
| Ambient Background Music | `ambientAudio` | `audio/Cinematic-Ambient-Background-Music.mp3` | `Cinematic Ambient Background Music - Piano Instrumental - (320 Kbps).mp3` | `index-page.tsx` (hero section audio) | **Used** |

## 10. Fonts

| Asset Name | Registry Export | R2 Path | Local File | Used In | Status |
|---|---|---|---|---|---|
| Gambetta Medium | `gambettaFont` | `fonts/Gambetta-Medium.otf` | `Gambetta-Medium.otf` | `styles.css` (`@font-face`) | **Used** |
| Micross | `microssFont` | `fonts/micross.ttf` | `micross.ttf` | `styles.css` (`@font-face`) | **Used** |

## 11. Public Assets

| File | Path | Used In | Status |
|---|---|---|---|
| `favicon.png` | `public/favicon.png` | Browser tab icon | **Used** (via index.html) |
| `_redirects` | `public/_redirects` | SPA routing (Netlify) | **Used** |

## 12. Unused Local Files

The following files exist in `src/assets/` but are **not referenced in any code**:

| File | Category |
|---|---|
| `hero.jpg`, `hero-medium.webp`, `hero-thumb.webp` | Hero fallback (unused — video is primary) |
| `ART WORK 1.png`, `ART WORK 2.png`, `ART WORK 3.png` | Full-resolution PNGs (webp used in code) |
| `SAHAJ.jpg`, `SAHAJ-medium.webp`, `SAHAJ-thumb.webp` | Unknown SAHAJ image |
| `sahal gallery.webp`, `sahal gallery-medium.webp`, `sahal gallery-thumb.webp` | "Sahal" (typo variant) |
| `artist.jpg`, `artist-medium.webp`, `artist-thumb.webp` | Artist photo |
| `art-1.jpg`, `art-2.jpg`, `art-3.jpg` + webp variants | Artwork samples |
| `gallery background.jpg` + webp variants | Gallery background |
| `html logo.png` + webp variants | HTML logo |
| `installation.jpg` + webp variants | Installation photo |
| `integration.jpg` + webp variants | Integration photo |
| `iris-elephant.png` + webp variants | Iris elephant artwork |
| `logo.jpg` + webp variants | Logo fallback |
| `sahaj final placeholder.jpg` + webp variants | Another placeholder |
| `sahaj trasnparent logo.png` (typo variant) vs `sahaj-trasnparent-logo.png` | Typo duplicate — only the hyphenated version is used via R2 |
| `sahaj panel/1S/S11.jpg` through `S14.jpg` + webp | Extra eyes images (code uses only S1–S10) |
| `sahaj panel/3H/11H.JPG`, `12H.JPG` + webp | Extra sikshapatri images (code uses only 1H–10H) |
| `sahaj panel/5J/5J.jpeg`, `6J.jpeg`, `9J.jpeg` | .jpeg variants of .jpg files |
| `AUTUMN/AUTUMN.webp` | Artwork category image |
| `CHERRY-BLOSSOM/CHERRY-BLOSSOM.webp` | Duplicate of panel 5J data |
| `FLORA/FLORA.webp` | Artwork category image |
| `PARIJAT/PARIJAT.webp` | Artwork category image |
| `PRAKRITI-MANDALA/` (3 webp files) | Artwork category images |
| `SARANAM/SARANAM.webp` | Artwork category image |
| `SERENE-WOODLAND/SERENE-WOODLAND.webp` | Artwork category image |
| `sreeyantra/sreeyantra.webp` | Artwork category image |
| `THE URBAN/` (10 webp files) | Artwork category (SVG generated in code instead) |
| `THE-EYES/` (4 webp files) | Artwork category (SVG generated in code instead) |
| `THE-REFLECTION/` (6 webp files) | Artwork category (SVG generated in code instead) |
| `THE-SIKSHAPATRI/` (3 webp files) | Artwork category (SVG generated in code instead) |
| `tribal-art/` (2 webp files) | Artwork category image |
| `The Shreenathji Grace/` (7 png files) | PNG source images |
| `ESSENTIALS/*/*-medium.webp`, `*-thumb.webp` | Webp variants of essentials PNGs |
| `sahaj panel/*/*-medium.webp`, `sahaj panel/*/*-thumb.webp` | Webp variants of panel artwork |
| `agent.md`, `agent1.md` | Documentation/notes |
| `Gallery html.html` | HTML export |
| `idea-2026.1.3.exe` | IDE installer (should be gitignored) |

---

## Summary

- **Total files in `src/assets/`:** ~370 files (including all subdirectories and webp variants)
- **Files referenced in code:** ~55 distinct logical assets
- **Registry exports in `assets.ts`:** 32 named exports + 6 artwork arrays
- **Files likely unused:** ~250+ files including webp variants, duplicates, category images not referenced in code
- **Public assets:** `favicon.png` (used), `_redirects` (used)

---

## Registry File

`src/assets/assets.ts` — 110 lines, 32 named exports + 6 artwork arrays.
All imports consolidated from 5 source files (Nav.tsx, index-page.tsx, work-page.tsx, sahaj-page.tsx, contact-page.tsx).
