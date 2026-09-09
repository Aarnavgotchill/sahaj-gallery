import { useSearch } from "@tanstack/react-router";
import { ndhLogo4K as ndhLogo } from "@/assets/assets";
import { getPageContent } from "@/data/artData";
import ArtistHero from "@/components/art/ArtistHero";
import ArtworkGallery from "@/components/art/ArtworkGallery";
import ArtNav from "@/components/art/ArtNav";
import { usePortraitNoScroll } from "@/lib/portrait";

function ArtViewerPage() {
  usePortraitNoScroll();
  const { slug } = useSearch({ from: "/art-viewer" });
  const artist = getPageContent(slug);

  if (!artist) {
    return (
      <div className="min-h-screen bg-background">
        <ArtNav />
        <div className="flex items-center justify-center min-h-[60vh] pt-28">
          <p className="text-muted-foreground">Artist not found</p>
        </div>
        <footer className="border-t border-border/30 px-8 py-4 md:px-14">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg md:text-xl tracking-[0.3em] text-[#C8A86E]">SAHAJ GALLERY</p>
            <img src={ndhLogo} alt="NDH House" className="h-12 w-auto opacity-80" />
          </div>
        </footer>
      </div>
    );
  }

  return (
    <>
      <ArtNav />
      <div className="min-h-screen bg-background text-foreground/90 antialiased">
        <main className="pt-16 md:pt-20">
          <ArtistHero key={`artist-hero-${slug}`} artist={artist} slug={slug} description={slug === "s" ? "Explore the inspiration and philosophy behind Sahaj." : undefined} />
          <ArtworkGallery key={`gallery-${slug}`} artworks={artist.artworks} artistName={artist.name} />
        </main>
        <footer className="border-t border-border/30 px-8 py-4 md:px-14">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg md:text-xl tracking-[0.3em] text-[#C8A86E]">SAHAJ GALLERY</p>
            <img src={ndhLogo} alt="NDH House" className="h-12 w-auto opacity-80" />
          </div>
        </footer>
      </div>
    </>
  );
}

export default ArtViewerPage;
