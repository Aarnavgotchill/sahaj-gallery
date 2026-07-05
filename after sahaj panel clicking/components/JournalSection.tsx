"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animation";

export default function JournalSection() {
  return (
    <section id="j" className="border-t border-hairline py-20 lg:py-32">
      <div className="container-art">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mb-14 font-display text-4xl italic sm:text-5xl lg:mb-20"
        >
          Journal
        </motion.h2>

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-1 gap-x-12 gap-y-14 lg:grid-cols-3"
        >
          {[
            { title: "Studio Visit", date: "March 2025", excerpt: "A rare glimpse into the working methods of contemporary artists shaping the dialogue between material and memory." },
            { title: "Curatorial Notes", date: "January 2025", excerpt: "Reflections on the intersections of architecture, light, and pigment in the gallery's current exhibition." },
            { title: "In Conversation", date: "November 2024", excerpt: "A dialogue between artist and architect on the role of threshold spaces in contemporary practice." },
          ].map((item) => (
            <motion.div key={item.title} variants={fadeUp} className="group flex flex-col">
              <span className="label-text mb-4">{item.date}</span>
              <h3 className="font-display text-2xl italic leading-snug">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-stone">{item.excerpt}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
