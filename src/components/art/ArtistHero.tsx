import { motion } from "framer-motion";
import type { ArtistData } from "@/types/artist";
import { fadeUpLarge, fadeUp } from "@/lib/artViewer";

export default function ArtistHero({
  artist,
  description,
  slug,
}: {
  artist: ArtistData;
  description?: string;
  /** Passed in so we can apply slug-specific layout fixes without touching other pages */
  slug?: string;
}) {
  // ── Slug-specific fixes ────────────────────────────────────────────────────
  // slug=h (Hari Mohan):   circular hero image was being clipped by overflow-hidden
  //                        on the section. Remove it for this slug only.
  // slug=j (Jaya Sengupta): wide hero image was bleeding into the scrollbar.
  //                        Constrain it with max-w-full + right padding for this slug only.
  // All other slugs (s, a, a-2): original classes restored exactly as before.
  const isH = slug === "h";
  const isJ = slug === "j";

  return (
    <section
      id="top"
      className={`relative ${isH ? "" : "overflow-hidden"}`}
    >
      <div className="grid min-h-[calc(100dvh-6rem)] grid-cols-1 md:min-h-[calc(100dvh-7rem)] lg:grid-cols-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mx-auto w-full max-w-7xl z-10 flex flex-col justify-center pb-6 pt-8 px-6 sm:px-10 lg:col-span-5 lg:pb-12 lg:pt-0 lg:px-16"
        >
          <h1 className="font-display text-[13vw] leading-[0.92] tracking-tight sm:text-[9vw] lg:text-[4.4vw]">
            {"Stories\nOf The\nGallery" === artist.name ? (
              <>
                <span className="text-[#C8A86E]">Stories</span>
                <br />
                <span className="text-muted-foreground text-[64%]">Of The</span>
                <br />
                <span className="text-[#C8A86E]">Gallery</span>
              </>
            ) : (
              <span className="text-[#C8A86E] whitespace-pre-line">{artist.name}</span>
            )}
          </h1>
          {description && (
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              {description}
            </p>
          )}
        </motion.div>

        <motion.div
          variants={fadeUpLarge}
          initial="hidden"
          animate="show"
          className={`-order-1 flex min-h-[50vh] items-center justify-center lg:order-none lg:col-span-7 lg:min-h-0 lg:pl-16 lg:overflow-hidden${
            isJ ? " lg:pr-6" : ""
          }`}
        >
          <img
            src={artist.heroImage}
            alt={`Portrait study for ${artist.name}`}
            className={`object-contain max-w-full${isJ ? "" : ""}`}
            style={{
              maxWidth: "100%",
              width: "750px",
              aspectRatio: "1 / 1",
            }}
          />
        </motion.div>
      </div>

      <div className="border-t border-border/30" />

      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center pb-6 px-8 text-center pointer-events-none">
        <div
          className="flex flex-col items-center gap-2 animate-fade-up-after"
          style={{ animationDelay: "1500ms" }}
        >
          <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
            Scroll
          </span>
          <div className="h-16 w-px bg-gradient-to-b from-foreground/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
