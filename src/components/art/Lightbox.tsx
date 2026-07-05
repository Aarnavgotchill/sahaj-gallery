import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Artwork } from "@/types/artist";
import { lightboxBackdrop, lightboxInfo } from "@/lib/artViewer";

interface Props {
  artworks: Artwork[];
  activeIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  artistName: string;
}

function decodeImage(src: string): Promise<void> {
  const img = new Image();
  img.src = src;
  return img.decode().catch(() => {});
}

export default function Lightbox({
  artworks,
  activeIndex,
  onClose,
  onNext,
  onPrev,
  artistName,
}: Props) {
  /**
   * displayedSrc: the image URL that is currently VISIBLE.
   * It only updates after decode() resolves, so the old image stays
   * on screen while the new one is being decoded — zero blank frames.
   *
   * visible: drives a CSS opacity transition (0 → 1) on the img element.
   * We fade out → swap src → fade in, all in CSS so no Framer Motion
   * state machine is involved in the image swap (avoids AnimatePresence
   * key-mismatch crashes during rapid navigation).
   */
  const initialArtwork = artworks[activeIndex];
  const [displayedSrc, setDisplayedSrc] = useState<string>(initialArtwork.image);
  const [visible, setVisible] = useState(false);
  const pendingRef = useRef<number>(activeIndex);
  const isFirstMount = useRef(true);

  useEffect(() => {
    const idx = activeIndex;
    pendingRef.current = idx;
    const src = artworks[idx].image;

    if (isFirstMount.current) {
      // On first open: decode then fade in from zero
      isFirstMount.current = false;
      setVisible(false);
      decodeImage(src).then(() => {
        if (pendingRef.current === idx) {
          setDisplayedSrc(src);
          setVisible(true);
        }
      });
    } else {
      // On navigation: fade out → swap decoded src → fade in
      setVisible(false);

      decodeImage(src).then(() => {
        if (pendingRef.current === idx) {
          // Small rAF gap lets the CSS opacity-out transition start before we
          // swap the src, so the old image fades before the new one appears.
          requestAnimationFrame(() => {
            if (pendingRef.current === idx) {
              setDisplayedSrc(src);
              setVisible(true);
            }
          });
        }
      });
    }
  }, [activeIndex, artworks]);

  // Preload + decode adjacent images so navigation feels instant
  useEffect(() => {
    const idxs = [
      (activeIndex + 1) % artworks.length,
      (activeIndex - 1 + artworks.length) % artworks.length,
    ];
    idxs.forEach((i) => decodeImage(artworks[i].image));
  }, [activeIndex, artworks]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, onNext, onPrev]);

  const infoArtwork = artworks[activeIndex];

  return createPortal(
    <motion.div
      key="lightbox"
      variants={lightboxBackdrop}
      initial="hidden"
      animate="show"
      exit="exit"
      className="fixed inset-0 z-[100] bg-background"
      onClick={onClose}
    >
      {/* Radial overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%), radial-gradient(ellipse 70% 40% at 50% 0%, rgba(201,169,110,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Close button */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-6 top-6 z-20 text-muted-foreground/50 transition-colors duration-300 hover:text-foreground/80 md:right-10 md:top-10"
      >
        <X size={22} strokeWidth={1.2} />
      </button>

      <div className="flex h-full w-full flex-col md:flex-row">
        {/* Info panel — updates immediately when activeIndex changes */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`info-${activeIndex}`}
            variants={lightboxInfo}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex flex-col justify-center px-8 pt-24 md:w-[380px] md:px-12 md:pt-0 lg:w-[440px] lg:px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-8">
              <p className="font-display text-sm uppercase tracking-widest text-[var(--gold)]">
                {artistName}
              </p>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                {infoArtwork.catalogNo}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Image area */}
        <div className="relative flex flex-1 items-center justify-center p-8 md:p-12 lg:p-16">
          <button
            type="button"
            aria-label="Previous artwork"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 text-muted-foreground/40 transition-colors duration-300 hover:text-foreground/70 md:left-6 lg:left-8"
          >
            <ChevronLeft size={32} strokeWidth={1.2} />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-[90vh] w-full items-center justify-center"
          >
            <div
              className="relative max-h-full max-w-full"
              style={{ width: "600px", aspectRatio: "600 / 700" }}
            >
              {/*
               * CSS opacity crossfade — deliberately NOT using AnimatePresence
               * here because AnimatePresence with mode="wait" keeps the old
               * keyed element alive during its exit animation, which means it
               * reads the (already-updated) state and can throw when `src`
               * resolves to a different index than the key.
               *
               * Instead: one stable <img> element, src swapped only after
               * decode(), opacity driven by `visible` state via CSS transition.
               * Fade out → decode → swap src → fade in.  No component lifecycle
               * involved in the image swap.
               */}
              <img
                src={displayedSrc}
                alt={`${infoArtwork.title}, ${infoArtwork.year}, ${infoArtwork.medium}`}
                loading="eager"
                decoding="async"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
                style={{
                  opacity: visible ? 1 : 0,
                  // y: 12px → 0 on open, 0 → 12px on fade-out — the artwork
                  // "rises gently into frame", matching the Vadehra motion language.
                  transform: visible
                    ? "translateZ(0) translateY(0px)"
                    : "translateZ(0) translateY(12px)",
                  transition:
                    "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)",
                }}
              />
            </div>
          </div>

          <button
            type="button"
            aria-label="Next artwork"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 text-muted-foreground/40 transition-colors duration-300 hover:text-foreground/70 md:right-6 lg:right-8"
          >
            <ChevronRight size={32} strokeWidth={1.2} />
          </button>
        </div>
      </div>

      {/* Counter */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 md:bottom-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(artworks.length).padStart(2, "0")}
        </span>
      </div>
    </motion.div>,
    document.body
  );
}
