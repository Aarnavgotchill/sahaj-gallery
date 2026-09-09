import { motion } from "framer-motion";
import type { Artwork } from "@/types/artist";
import { fadeUp } from "@/lib/artViewer";

interface Props {
  artwork: Artwork;
  onOpen: () => void;
  /**
   * "eager" for the first visible row — browser fetches immediately.
   * "lazy"  for below-fold cards — browser defers until near viewport.
   */
  loading?: "eager" | "lazy";
}

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E";

function imageKitUrl(src: string, width: number) {
  if (!src.includes("ik.imagekit.io")) return src;
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}tr=w-${width},q-82,f-auto`;
}

export default function ArtworkCard({
  artwork,
  onOpen,
  loading = "eager",
}: Props) {
  const isPlaceholder = artwork.image === PLACEHOLDER_IMG;

  return (
    <motion.button
      type="button"
      variants={fadeUp}
      onClick={isPlaceholder ? undefined : onOpen}
      className={`group w-full text-left ${isPlaceholder ? "" : "cursor-pointer"}`}
      aria-label={isPlaceholder ? "Coming Soon" : `Open ${artwork.title}, ${artwork.year} in full screen`}
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 700px" }}
    >
      <div
        className="relative w-full overflow-hidden bg-card"
        style={{ aspectRatio: `${artwork.width} / ${artwork.height}` }}
      >
        {isPlaceholder ? (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{
              background: "radial-gradient(ellipse at center, rgba(201,169,110,0.08) 0%, transparent 80%)",
              border: "1px solid rgba(201,169,110,0.08)",
              borderRadius: "2px",
            }}
          >
            <span
              style={{
                fontFamily: "Gambetta,Georgia,serif",
                fontSize: "clamp(18px,3vw,30px)",
                letterSpacing: "0.3em",
                opacity: 0.4,
                color: "#c9a96e",
              }}
            >
              Coming Soon
            </span>
          </div>
        ) : (
          <img
            src={imageKitUrl(artwork.image, 960)}
            srcSet={artwork.image.includes("ik.imagekit.io")
              ? [480, 720, 960, 1200]
                  .map((width) => `${imageKitUrl(artwork.image, width)} ${width}w`)
                  .join(", ")
              : undefined}
            sizes="(min-width: 1024px) 384px, (min-width: 640px) 46vw, calc(100vw - 48px)"
            alt={`${artwork.title}, ${artwork.year}, ${artwork.medium}`}
            loading={loading}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.045]"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-foreground/0 transition-colors duration-700 group-hover:bg-foreground/5" />
      </div>

      <div className="mt-4 flex justify-end">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
          {isPlaceholder ? "" : artwork.catalogNo}
        </span>
      </div>
    </motion.button>
  );
}
