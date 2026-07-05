"use client";

import { motion } from "framer-motion";
import { Artwork } from "@/types/artist";
import { fadeUp } from "@/lib/animation";

interface Props {
  artwork: Artwork;
  onOpen: () => void;
}

export default function ArtworkCard({ artwork, onOpen }: Props) {
  return (
    <motion.button
      type="button"
      variants={fadeUp}
      onClick={onOpen}
      className="group w-full text-left"
      aria-label={`Open ${artwork.title}, ${artwork.year} in full screen`}
    >
      <div
        className="relative w-full overflow-hidden bg-gallery-surface"
        style={{ aspectRatio: `${artwork.width} / ${artwork.height}` }}
      >
        <img
          src={artwork.image}
          alt={`${artwork.title}, ${artwork.year}, ${artwork.medium}`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-gallery group-hover:scale-[1.045]"
        />
        <div className="pointer-events-none absolute inset-0 bg-white/0 transition-colors duration-700 group-hover:bg-white/5" />
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <p className="font-display text-lg italic leading-snug">{artwork.title}</p>
          <p className="mt-1 text-sm text-white/60">
            {artwork.year} · {artwork.medium}
          </p>
        </div>
        <span className="label-text shrink-0">{artwork.catalogNo}</span>
      </div>
    </motion.button>
  );
}
