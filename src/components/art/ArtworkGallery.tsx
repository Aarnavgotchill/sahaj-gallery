import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import type { Artwork } from "@/types/artist";
import ArtworkCard from "@/components/art/ArtworkCard";
import Lightbox from "@/components/art/Lightbox";
import { useArtLightbox } from "@/hooks/useArtLightbox";
import { staggerContainer } from "@/lib/artViewer";

function decodeImage(src: string): Promise<void> {
  const img = new Image();
  img.src = src;
  return img.decode().catch(() => {});
}

export default function ArtworkGallery({
  artworks,
  artistName,
  lightboxDimensions,
  lightboxAspectRatio,
}: {
  artworks: Artwork[];
  artistName: string;
  lightboxDimensions?: { width: number; height: number };
  lightboxAspectRatio?: string;
}) {
  const { activeIndex, open, close, next, prev, isOpen } =
    useArtLightbox(artworks.length);

  // ── Step 1: Decode gate ────────────────────────────────────────────────────
  // galleryReady becomes true only after every above-the-fold image has been
  // fully decoded. The animation is blocked until images are ready to paint.
  const [galleryReady, setGalleryReady] = useState(false);

  useEffect(() => {
    const aboveFold = artworks.slice(0, 6);
    const safetyTimer = setTimeout(() => setGalleryReady(true), 4000);

    Promise.all(aboveFold.map((a) => decodeImage(a.image))).then(() => {
      clearTimeout(safetyTimer);
      setGalleryReady(true);
    });

    // Warm below-fold images in background so they're ready before the user scrolls
    artworks.slice(6).forEach((a) => decodeImage(a.image));

    return () => clearTimeout(safetyTimer);
  }, [artworks]);

  // ── Step 2: Viewport trigger ───────────────────────────────────────────────
  // useInView fires once when the section crosses the viewport threshold.
  // This gives us the Vadehra-style "trigger on scroll into view" behaviour
  // while letting us COMBINE it with galleryReady so the animation only plays
  // when images are already decoded AND the section is in view.
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,       // trigger once, never repeat on scroll-out/back
    margin: "-40px 0px", // fires when section is 40px inside the viewport
  });

  // Portrait users: no scroll-triggered animation on any page except home —
  // the grid appears immediately once images are decoded.
  const isPortrait =
    typeof window !== "undefined" &&
    window.matchMedia("(orientation: portrait) and (max-width: 768px)").matches;
  const isHome =
    typeof window !== "undefined" && window.location.pathname === "/";
  const skipScrollGate = isPortrait && !isHome;

  // The animation plays only when BOTH conditions are met:
  //   - inView:      gallery section has entered the viewport
  //   - galleryReady: every above-fold image has been decoded
  //
  // This is the exact Vadehra pattern:
  //   "gallery section becomes visible in scroll → artwork is already rendered →
  //    the entire grid gently lifts into frame with staggered cards"
  const showGallery = galleryReady && (skipScrollGate || inView);

  return (
    <section
      id="a"
      ref={sectionRef}
      className="border-t border-border/30 py-20 lg:py-32"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
        {/*
          staggerContainer(0.04) = 40ms stagger between cards.
          Cards use fadeUp (y:24→0, opacity:0→1, 1.0s, cubic-bezier(0.22,1,0.36,1))
          The container propagates "hidden"/"show" to all children automatically.

          animate is tied to `showGallery` — the grid stays invisible until both
          conditions above are satisfied, then the stagger reveal plays once.
        */}
        <motion.div
          variants={staggerContainer(0.04)}
          initial="hidden"
          animate={showGallery ? "show" : "hidden"}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10 items-start"
        >
          {artworks.map((artwork, i) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              onOpen={() => open(i)}
              loading={i < 6 ? "eager" : "lazy"}
            />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && activeIndex !== null && (
          <Lightbox
            artworks={artworks}
            activeIndex={activeIndex}
            onClose={close}
            onNext={next}
            onPrev={prev}
            artistName={artistName}
            containerDimensions={lightboxDimensions}
            containerAspectRatio={lightboxAspectRatio}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
