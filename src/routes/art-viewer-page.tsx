import { useState, useEffect, useMemo } from "react";
import { useSearch } from "@tanstack/react-router";
import { ndhLogo4K as ndhLogo } from "@/assets/assets";
import { getPageContent } from "@/data/artData";
import ArtistHero from "@/components/art/ArtistHero";
import ArtworkGallery from "@/components/art/ArtworkGallery";
import ArtNav from "@/components/art/ArtNav";
import GalleryLoadingBar from "@/components/GalleryLoadingBar";
import { useImagePreloader } from "@/hooks/useImagePreloader";

function ArtViewerPage() {
  const { slug } = useSearch({ from: "/art-viewer" });
  const artist = getPageContent(slug);
  const [contentReady, setContentReady] = useState(false);

  const imageUrls = useMemo(() => {
    if (!artist) return [];
    return [artist.heroImage, ...artist.artworks.map((a) => a.image)];
  }, [artist]);

  const { progress, isLoaded } = useImagePreloader(imageUrls);

  useEffect(() => {
    setContentReady(false);
  }, [slug]);

  useEffect(() => {
    if (isLoaded) {
      const t = setTimeout(() => setContentReady(true), 100);
      return () => clearTimeout(t);
    }
  }, [isLoaded]);

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

  const showLoader = !contentReady;

  return (
    <>
      <GalleryLoadingBar progress={progress} visible={showLoader} />
      <div
        className="min-h-screen bg-background text-foreground/90 antialiased"
        style={{
          opacity: contentReady ? 1 : 0,
          transition: "opacity 0.35s ease",
          willChange: "opacity",
        }}
      >
        <ArtNav />
        <main className="pt-16 md:pt-20">
          <ArtistHero key={`artist-hero-${slug}`} artist={artist} slug={slug} description={slug === "s" ? "Explore the inspiration and philosophy behind Sahaj." : undefined} />
          <ArtworkGallery key={`gallery-${slug}`} artworks={artist.artworks} artistName={artist.name} />
        </main>
        <footer className="border-t border-border/30 px-8 py-4 md:px-14">
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
