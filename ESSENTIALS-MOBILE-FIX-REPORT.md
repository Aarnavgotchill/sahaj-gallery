# Essentials Mobile Layout Fix — Report

## Generated: 2026-06-20

---

## Root Cause

The essentials grid on mobile (`<768px`) was set to `grid-template-columns: repeat(2, auto)`, which caused the 10 letter boxes to wrap into 5 rows of 2 columns:

```
E  S
S  E
N  T
I  A
L  S
```

This misaligned the intended **E S S E N T I A L S** reading order and made the layout look broken on mobile.

## Files Modified

| File | Change |
|------|--------|
| `src/routes/work-page.tsx:567` | Essentials grid column count: `repeat(2,auto)` → `repeat(5,auto)`; gap: `16px` → `10px`; removed `max-width:200px` constraint |

## CSS Changes Applied

**Before:**
```css
#gallery-root .essentials-grid{
  display:grid;
  grid-template-columns:repeat(2,auto);
  gap:16px;
  justify-content:center;
  align-items:center;
  max-width:200px;
  margin:0 auto
}
```

**After:**
```css
#gallery-root .essentials-grid{
  display:grid;
  grid-template-columns:repeat(5,auto);
  gap:10px;
  justify-content:center;
  align-items:center;
  margin:0 auto
}
```

### Layout Result

| Row | Boxes | Width Calculation |
|-----|-------|-------------------|
| 1 | E · S · S · E · N | 5 × 44px + 4 × 10px = **260px** |
| 2 | T · I · A · L · S | 5 × 44px + 4 × 10px = **260px** |

Total width 260px fits on all mobile viewports ≥ 320px. Remaining space (30–80px depending on device) is evenly distributed as auto margins via `justify-content:center` and `margin:0 auto`.

## Scope

- **Modified:** essentials grid only, mobile breakpoint only
- **Unchanged:** SAHAJ artwork panels, desktop layout, tablet layout, hero, videos, performance, Vercel settings
