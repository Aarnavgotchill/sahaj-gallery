import { motion } from "framer-motion";
import type { Artwork } from "@/types/artist";
import { fadeUp } from "@/lib/artViewer";

interface Props {
  artwork: Artwork;
  onOpen: () => void;
  /**
   * "eager" for above-the-fold cards (i < 6) — browser fetches immediately.
   * "lazy"  for below-fold cards — browser defers until near viewport.
   * The parent gallery pre-decodes all images anyway; this prop only controls
   * the HTML hint to the browser's speculative preloader.
   */
  loading?: "eager" | "lazy";
}

export default function ArtworkCard({
  artwork,
  onOpen,
  loading = "eager",
}: Props) {
  return (
    <motion.button
      type="button"
      variants={fadeUp}
      onClick={onOpen}
      className="group w-full text-left cursor-pointer"
      aria-label={`Open ${artwork.title}, ${artwork.year} in full screen`}
    >
      <div
        className="relative w-full overflow-hidden bg-card"
        style={{ aspectRatio: `${artwork.width} / ${artwork.height}` }}
      >
        {/*
         * No onLoad opacity trick needed here:
         * ArtworkGallery.decode() already guarantees every image is fully
         * decoded before this component becomes visible. The image renders
         * into an already-painted slot — no flash, no pop.
         *
         * translateZ(0) promotes the img to its own GPU compositing layer
         * so hover scale and scrolling stay at 60fps.
         */}
        <img
          src={artwork.image}
          alt={`${artwork.title}, ${artwork.year}, ${artwork.medium}`}
          loading={loading}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.045]"
          style={{ transform: "translateZ(0)" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-foreground/0 transition-colors duration-700 group-hover:bg-foreground/5" />
      </div>

      <div className="mt-4 flex justify-end">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
          {artwork.catalogNo}
        </span>
      </div>
    </motion.button>
  );
}
