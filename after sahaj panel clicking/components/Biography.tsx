"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animation";

export default function Biography({ paragraphs }: { paragraphs: string[] }) {
  return (
    <section id="s" className="container-art py-20 lg:py-32">
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16"
      >
        <motion.div variants={fadeUp} className="lg:col-span-4">
          <span className="label-text">About the artist</span>
        </motion.div>

        <div className="max-w-reading space-y-6 lg:col-span-8">
          {paragraphs.map((paragraph, i) => (
            <motion.p
              key={i}
              variants={fadeUp}
              className="text-[17px] leading-[1.85] text-ink/85 first-letter:font-display first-of-type:first-letter:text-4xl"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
