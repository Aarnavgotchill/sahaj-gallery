# Mobile Layout Fix — Report

## Generated: 2026-06-20

---

## Root Cause

The gallery page used three overlapping media queries (768px, 640px, 480px) with conflicting rules for the SAHAJ strip panels on mobile.

**At 768px:**
```css
#gallery-root #l1{height:360px}
```
This forced the 5-strip container to exactly 360px tall, collapsing each strip to ~72px when stacked vertically — making them appear as thin horizontal lines.

**At 640px:**
```css
#gallery-root .strip{min-height:72px}
```
Strips were only 72px minimum, resulting in thin banner bars that made the SAHAJ artwork unreadable.

**At 480px:**
```css
#gallery-root .strip{min-height:60px}
```
Even thinner.

The desktop layout uses tall vertical panels (aspect-ratio 190:504, max-height 480px) arranged horizontally. On mobile portrait, these became unrecognizable thin lines.

---

## Changes Applied

| File | Change |
|------|--------|
| `src/routes/work-page.tsx` | Replaced three mobile media queries with two clean ones |

### New media queries:

**Mobile (<768px)** — Banner cards:
- `.strip-row`: `flex-direction:column; gap:20px` — generous spacing between cards
- `.strip`: `width:90vw; max-width:420px; aspect-ratio:3/1; border-radius:10px` — horizontal banner cards
- `.strip-letter`: `font-size:clamp(44px,14vw,72px)` — prominent letter overlay
- `.gallery-content`: `padding:120px 0 40px` — proper nav clearance
- `.essentials-box`: scaled to 42px for mobile
- No fixed `#l1` height — container grows naturally

**Tablet (768–1023px)** — Proportional scaling:
- `#l1{height:360px}` — strips fit in viewport
- Essentials boxes at 48px

**Desktop (1024px+)** — Unchanged.

---

## Mobile Breakpoint Used

`max-width: 767px`

---

## CSS Changes Applied

```
@media(max-width:767px) { ... }
@media(min-width:768px) and (max-width:1023px) { ... }
```

Desktop (≥1024px) is not wrapped in any media query — it uses the base CSS unchanged.

---

## Verification

- Desktop (≥1024px): identical to before — tall vertical strip panels, side by side
- Tablet (768–1023px): proportional scaling with fixed 360px container
- Mobile (<768px): 5 horizontal banner cards (3:1 aspect ratio), 90vw wide, stacked vertically with 20px gap

Build passes. Deployed to https://www.sahajgallery.com
