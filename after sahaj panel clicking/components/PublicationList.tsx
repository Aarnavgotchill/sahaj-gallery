"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Publication } from "@/types/artist";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animation";

export default function PublicationList({ publications }: { publications: Publication[] }) {
  return (
    <section id="a-2" className="border-t border-hairline py-20 lg:py-32">
      <div className="container-art">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mb-14 font-display text-4xl italic sm:text-5xl lg:mb-20"
        >
          Press
        </motion.h2>

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-1 gap-x-12 gap-y-14 lg:grid-cols-3"
        >
          {publications.map((pub) => (
            <motion.a
              key={pub.id}
              href={pub.href}
              variants={fadeUp}
              className="group flex flex-col"
            >
              <span className="label-text mb-4">{pub.outlet} · {pub.date}</span>
              <h3 className="font-display text-2xl italic leading-snug">{pub.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-stone">{pub.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm underline decoration-hairline underline-offset-4 transition-colors group-hover:text-clay">
                Read more
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
