import { useState, useEffect, useRef } from "react";
import { useSearch, useRouterState } from "@tanstack/react-router";
import { ndhLogo4K as ndhLogo } from "@/assets/assets";
import { getPageContent } from "@/data/artData";
import ArtistHero from "@/components/art/ArtistHero";
import ArtworkGallery from "@/components/art/ArtworkGallery";
import ArtNav from "@/components/art/ArtNav";

function ArtViewerPage() {
  const { slug } = useSearch({ from: "/art-viewer" });
  const routerState = useRouterState();
  const fromTransition = !!(routerState.location.state as Record<string, unknown>)?.sahajTransition;
  const artist = getPageContent(slug);
  const [entrancePhase, setEntrancePhase] = useState<"hidden" | "fade" | "visible">(
    fromTransition ? "visible" : "visible",
  );
  const entranceRef = useRef(fromTransition);

  // When coming from SAHAJ transition, content appears instantly — no delay
  useEffect(() => {
    if (!fromTransition || entranceRef.current) return;
    entranceRef.current = true;
    setEntrancePhase("visible");
    document.body.style.overflow = "";
  }, [fromTransition]);

  if (!artist) {
    return (
      <div className="min-h-screen bg-background">
        <ArtNav />
        <div className="flex items-center justify-center min-h-[60vh] pt-28">
          <p className="text-muted-foreground">Artist not found</p>
        </div>
        <footer className="border-t border-border/30 px-8 py-4 md:px-14">
          <div className="flex items-center justify-between">
            <p className="font-display text-xl tracking-[0.3em] text-[#C8A86E]">SAHAJ GALLERY</p>
            <img src={ndhLogo} alt="NDH House" className="h-12 w-auto opacity-80" />
          </div>
        </footer>
      </div>
    );
  }

  const entranceFade = entrancePhase === "fade";
  const entranceVisible = entrancePhase === "visible";
  const showContent = entrancePhase !== "hidden";

  return (
    <>
      <ArtNav />
      <div
        className="min-h-screen bg-background text-foreground/90 antialiased"
        style={{
          opacity: showContent ? 1 : 0,
          transition: "opacity 0.45s ease",
          willChange: "opacity",
        }}
      >
        <main className="pt-16 md:pt-20">
          <div
            style={{
              opacity: entranceVisible ? 1 : 0,
              transform: entranceVisible ? "translateY(0)" : "translateY(18px)",
              transition: entranceVisible
                ? "opacity 0.7s cubic-bezier(0.22,1,0.36,1),transform 0.7s cubic-bezier(0.22,1,0.36,1)"
                : entranceFade
                  ? "opacity 0.01s,transform 0.01s"
                  : "none",
              willChange: "transform,opacity",
            }}
          >
            <ArtistHero key={`artist-hero-${slug}`} artist={artist} slug={slug} description={slug === "s" ? "Explore the inspiration and philosophy behind Sahaj." : undefined} />
          </div>
          <div
            style={{
              opacity: entranceVisible ? 1 : 0,
              transform: entranceVisible ? "translateY(0)" : "translateY(24px)",
              transition: entranceVisible
                ? "opacity 0.7s cubic-bezier(0.22,1,0.36,1) 0.12s,transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.12s"
                : entranceFade
                  ? "opacity 0.01s,transform 0.01s"
                  : "none",
              willChange: "transform,opacity",
            }}
          >
            <ArtworkGallery key={`gallery-${slug}`} artworks={artist.artworks} artistName={artist.name} />
          </div>
        </main>
        <footer
          className="border-t border-border/30 px-8 py-4 md:px-14"
          style={{
            opacity: entranceVisible ? 1 : 0,
            transform: entranceVisible ? "translateY(0)" : "translateY(12px)",
            transition: entranceVisible
              ? "opacity 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s,transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s"
              : entranceFade
                ? "opacity 0.01s,transform 0.01s"
                : "none",
            willChange: "transform,opacity",
          }}
        >
          <div className="flex items-center justify-between">
            <p className="font-display text-xl tracking-[0.3em] text-[#C8A86E]">SAHAJ GALLERY</p>
            <img src={ndhLogo} alt="NDH House" className="h-12 w-auto opacity-80" />
          </div>
        </footer>
      </div>
    </>
  );
}

export default ArtViewerPage;
