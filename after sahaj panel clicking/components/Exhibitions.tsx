"use client";

import { motion } from "framer-motion";
import { Exhibition } from "@/types/artist";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animation";

export default function Exhibitions({ exhibitions }: { exhibitions: Exhibition[] }) {
  return (
    <section id="h" className="border-t border-hairline py-20 lg:py-32">
      <div className="container-art">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mb-14 font-display text-4xl italic sm:text-5xl lg:mb-20"
        >
          Exhibitions
        </motion.h2>

        <motion.ul
          variants={staggerContainer(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="divide-y divide-hairline border-y border-hairline"
        >
          {exhibitions.map((ex) => (
            <motion.li
              key={ex.id}
              variants={fadeUp}
              className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-1 py-6 transition-colors duration-500 hover:bg-ink/[0.03] sm:grid-cols-[100px_auto_1fr] sm:gap-x-10 sm:px-4"
            >
              <span className="label-text text-stone">{ex.year}</span>
              <p className="font-display text-xl italic sm:text-2xl">{ex.title}</p>
              <div className="col-span-2 flex flex-wrap items-baseline gap-x-3 text-sm text-stone sm:col-span-1 sm:justify-self-end sm:text-right">
                <span>{ex.venue}, {ex.location}</span>
                <span className="label-text text-[10px] text-stone/70">{ex.type}</span>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
