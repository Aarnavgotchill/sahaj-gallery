import ArtistHero from "@/components/ArtistHero";
import ArtworkGallery from "@/components/ArtworkGallery";
import { getPageContent } from "@/lib/pageData";

export default function A2Page() {
  const artist = getPageContent("a-2")!;

  return (
    <main className="pt-24 md:pt-28">
      <ArtistHero artist={artist} />
      <ArtworkGallery artworks={artist.artworks} artistName={artist.name} />
    </main>
  );
}
