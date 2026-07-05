"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Artwork } from "@/types/artist";

interface Props {
  artworks: Artwork[];
  activeIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  artistName: string;
}

function PreloadImage({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      className="pointer-events-none absolute size-0 opacity-0"
    />
  );
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.35, ease: "easeIn" },
  },
};

const panelVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.15,
    },
  },
  exit: {
    opacity: 0,
    x: -12,
    transition: {
      duration: 0.25,
      ease: "easeIn",
    },
  },
};

const imageVariants = {
  hidden: {
    opacity: 0,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

export default function Lightbox({
  artworks,
  activeIndex,
  onClose,
  onNext,
  onPrev,
  artistName,
}: Props) {
  const artwork = artworks[activeIndex];

  const prevIndex =
    (activeIndex - 1 + artworks.length) % artworks.length;

  const nextIndex =
    (activeIndex + 1) % artworks.length;

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, [activeIndex]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="viewer"
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${artwork.title}, full screen view`}
        tabIndex={-1}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex bg-[#31253E]"
        onClick={onClose}
      >
        <PreloadImage src={artworks[prevIndex].image} />
        <PreloadImage src={artworks[nextIndex].image} />

        {/* Close */}
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-6 top-6 z-20 text-white/40 transition-colors duration-300 hover:text-white/80 md:right-10 md:top-10"
        >
          <X size={22} strokeWidth={1.2} />
        </button>

        <div className="flex w-full flex-col md:flex-row">

          {/* LEFT PANEL */}
          <motion.div
            key={`info-${artwork.id}`}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col justify-center px-8 pt-24 md:w-[380px] md:px-12 md:pt-0 lg:w-[440px] lg:px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-8">

              <p className="font-display text-sm uppercase tracking-widest text-gallery-gold">
                {artistName}
              </p>

              <h2 className="font-display text-3xl italic leading-tight text-white md:text-4xl">
                {artwork.title}
              </h2>

              <div className="space-y-2">
                <p className="text-sm text-white/60">
                  {artwork.year}
                </p>

                <p className="text-sm text-white/60">
                  {artwork.medium}
                </p>

                <p className="text-sm text-white/60">
                  {artwork.dimensions}
                </p>
              </div>

              <span className="label-text">
                {artwork.catalogNo}
              </span>

            </div>
          </motion.div>

          {/* RIGHT PANEL */}
          <div className="relative flex flex-1 items-center justify-center p-8 md:p-12 lg:p-16">

            {/* Previous */}
            <button
              type="button"
              aria-label="Previous artwork"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 text-white/30 transition-colors duration-300 hover:text-white/70 md:left-6 lg:left-8"
            >
              <ChevronLeft size={32} strokeWidth={1.2} />
            </button>

            <AnimatePresence mode="popLayout">
              <motion.div
                key={artwork.id}
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                onClick={(e) => e.stopPropagation()}
                className="flex h-[90vh] w-full items-center justify-center"
              >
                <img
                  src={artwork.image}
                  alt={`${artwork.title}, ${artwork.year}, ${artwork.medium}`}
                  className="
                    max-h-full
                    max-w-full
                    object-contain
                    select-none
                    pointer-events-none
                  "
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* Next */}
            <button
              type="button"
              aria-label="Next artwork"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 text-white/30 transition-colors duration-300 hover:text-white/70 md:right-6 lg:right-8"
            >
              <ChevronRight size={32} strokeWidth={1.2} />
            </button>

          </div>

        </div>

        {/* Counter */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 md:bottom-3">
          <span className="label-text text-white/30">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(artworks.length).padStart(2, "0")}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}