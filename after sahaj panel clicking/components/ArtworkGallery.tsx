"use client";

import { motion } from "framer-motion";
import { Artwork } from "@/types/artist";
import ArtworkCard from "@/components/ArtworkCard";
import Lightbox from "@/components/Lightbox";
import { useLightbox } from "@/hooks/useLightbox";
import { staggerContainer, fadeUp, viewportOnce } from "@/lib/animation";

export default function ArtworkGallery({ artworks, artistName }: { artworks: Artwork[]; artistName: string }) {
  const { activeIndex, open, close, next, prev, isOpen } = useLightbox(artworks.length);

  return (
    <section id="a" className="border-t border-gallery-border/40 py-20 lg:py-32">
      <div className="container-art">
        <motion.div
          variants={staggerContainer(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10 items-start"
        >
          {artworks.map((artwork, i) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              onOpen={() => open(i)}
            />
          ))}
        </motion.div>
      </div>

      {isOpen && activeIndex !== null && (
        <Lightbox
          artworks={artworks}
          activeIndex={activeIndex}
          onClose={close}
          onNext={next}
          onPrev={prev}
          artistName={artistName}
        />
      )}
    </section>
  );
}
