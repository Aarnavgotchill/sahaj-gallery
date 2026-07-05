import artistJson from "@/data/artist.json";
import { ArtistData } from "@/types/artist";

export function getArtist(): ArtistData {
  return artistJson as ArtistData;
}
