import type { Variants } from "framer-motion";

// ─── Premium easing — cubic-bezier(0.22, 1, 0.36, 1) ────────────────────────
// This is the same easing Vadehra Art uses: fast out, silky deceleration.
// Feels calm, expensive, gravity-defying without any bounce.
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Gallery card reveal ─────────────────────────────────────────────────────
// y: 24px → 0  |  opacity: 0 → 1  |  1.0s
// Matches the Vadehra "artwork gently rises into frame" feeling.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.0, ease: EASE },
  },
};

// ─── Hero / large text reveal ─────────────────────────────────────────────────
export const fadeUpLarge: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: EASE },
  },
};

// ─── Stagger container ────────────────────────────────────────────────────────
// Call with 0.04 for a 40ms Vadehra-style card stagger.
export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

// ─── Simple opacity fade (for non-card elements) ──────────────────────────────
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

// ─── Viewport once config ─────────────────────────────────────────────────────
// Used by non-gallery elements that still want whileInView behaviour.
export const viewportOnce = { once: true, margin: "-80px 0px -80px 0px" };

// ─── Lightbox animations ──────────────────────────────────────────────────────

/**
 * Full-screen backdrop: fade in on open (450ms), fade out on close (350ms).
 * Matches the Vadehra "background softly darkens" sequence.
 */
export const lightboxBackdrop: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.45, ease: EASE },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.35, ease: EASE },
  },
};

/**
 * Lightbox image: y 12px → 0, opacity 0 → 1, 600ms.
 * The image "rises gently into frame" — the same language as the gallery cards
 * but applied to the full artwork in the lightbox.
 *
 * Note: this variant is kept for reference/future use.
 * The actual image in Lightbox.tsx uses CSS transitions (not Framer Motion)
 * to avoid AnimatePresence key-mismatch crashes during navigation.
 */
export const lightboxImage: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: 12,
    transition: { duration: 0.3, ease: EASE },
  },
};

/**
 * Artwork info panel: slides up 10px, fades in.
 * Starts 100ms after the image begins its animation — appears after the
 * artwork has settled, giving the image primacy (artwork is always the hero).
 */
export const lightboxInfo: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.1, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.25, ease: EASE },
  },
};
