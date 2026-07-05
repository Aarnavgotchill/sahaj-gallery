"use client";

import { motion } from "framer-motion";
import { ArtistData } from "@/types/artist";
import { fadeUpLarge, fadeUp } from "@/lib/animation";

export default function ArtistHero({ artist }: { artist: ArtistData }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="grid min-h-[calc(100dvh-6rem)] grid-cols-1 md:min-h-[calc(100dvh-7rem)] lg:grid-cols-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="container-art z-10 flex flex-col justify-end pb-6 pt-8 lg:col-span-5 lg:pb-12 lg:pt-0"
        >
          <h1 className="font-display text-[13vw] leading-[0.92] tracking-tight sm:text-[9vw] lg:text-[4.4vw]">
            {artist.name}
          </h1>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/60 lg:mt-8">
            {artist.tagline}
          </p>
        </motion.div>

        <motion.div
          variants={fadeUpLarge}
          initial="hidden"
          animate="show"
          className="-order-1 flex min-h-[50vh] items-center justify-center lg:order-none lg:col-span-7 lg:min-h-0"
        >
          <img
            src={artist.heroImage}
            alt={`Portrait study for ${artist.name}`}
            className="object-cover"
          />
        </motion.div>
      </div>

      <div className="border-t border-gallery-border/40" />
    </section>
  );
}
