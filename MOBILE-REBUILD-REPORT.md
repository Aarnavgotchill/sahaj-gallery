# Mobile Gallery Layout Rebuild — Report

## Generated: 2026-06-20

---

## Root Cause

The gallery page was using a single desktop-centric DOM structure with CSS overrides for mobile via @media queries. This approach failed because:

1. **`#l1` had conflicting heights** — the tablet query set `height:360px` which collapsed 5 stacked strips into thin bars. The mobile query tried to override with `height:auto` but was ordered incorrectly in the cascade.

2. **Essentials grid used `flex-wrap`** — the wrapping behavior caused misalignment on small screens. Items would wrap unpredictably rather than forming a clean 2-column grid.

3. **Footer positioning relied on the desktop layout** — on mobile, the footer appeared to overlap content because `gallery-content`'s `flex:1; justify-content:center` pushed it into the wrong position.

4. **No dedicated mobile structure** — scaling down desktop CSS produces a broken experience.

---

## Files Modified

| File | Change |
|------|--------|
| `src/routes/work-page.tsx` | Completely replaced `@media(max-width:767px)` CSS block with ground-up mobile layout; added `btn-catalogue` class to button |

---

## CSS Changes Applied

### Mobile (<768px) — Complete standalone layout

**SAHAJ strip cards:**
```css
.strip-row {
  flex-direction: column;
  width: 100%;
  gap: 24px;
  align-items: center;
}
.strip {
  width: 88vw;
  max-width: 420px;
  aspect-ratio: 3/1;
  border-radius: 8px;
  margin: 0 auto;
}
```
- Each strip is a proper banner card (3:1 aspect ratio) at 88vw
- 24px generous gap between cards
- Centered horizontally with auto margins
- Touch feedback via `:active { transform: scale(0.97) }`

**Essentials section — 2-column CSS Grid:**
```css
.essentials-grid {
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 16px;
  justify-content: center;
  max-width: 200px;
  margin: 0 auto;
}
```
- 2 equal columns, perfectly centered
- No flex wrapping issues
- Items align in the exact E-S-S-E-N-T-I-A-L-S pattern
- Staggered entrance animation preserved via `essentials-box-wrap`

**Catalogue button:**
```css
.btn-catalogue {
  width: calc(100vw - 48px);
  max-width: 380px;
  margin: 28px auto 0;
}
```
- Full-width with 24px margins on each side
- Centered below essentials
- Touch feedback via `:active`

**Footer:**
```css
.gallery-footer {
  margin-top: 36px;
  position: relative;
  bottom: auto;
}
```
- Pushed below all content with top margin
- No absolute/fixed positioning that could cause overlap

**Gallery content container:**
```css
.gallery-content {
  justify-content: flex-start;
  padding: 100px 0 40px;
}
```
- Changed from `justify-content:center` to `flex-start` so content starts from top
- Padding-top accounts for mobile nav height

---

## Breakpoints Used

| Range | Layout | Notes |
|-------|--------|-------|
| `<768px` | Mobile — complete rebuild | Standalone CSS, does not inherit desktop positioning |
| `768px–1023px` | Tablet — proportional scaling | Kept existing scaled desktop layout |
| `≥1024px` | Desktop — original | Unchanged |

---

## Verification

- Desktop (≥1024px): visually identical — tall vertical strips, flex row, side by side
- Tablet (768–1023px): proportional scaling preserved
- Mobile (<768px): banner cards stacked vertically, 2-column essentials grid, full-width button, footer at bottom
- Build passes, deployed to https://www.sahajgallery.com
