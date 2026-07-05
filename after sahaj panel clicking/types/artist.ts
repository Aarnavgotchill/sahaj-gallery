export interface Artwork {
  id: string;
  catalogNo: string; // e.g. "ZA / 014" — museum-style inventory number
  title: string;
  year: string;
  medium: string;
  dimensions: string;
  image: string;
  width: number; // intrinsic width, used for masonry balancing
  height: number; // intrinsic height
}

export interface Exhibition {
  id: string;
  year: string;
  title: string;
  venue: string;
  location: string;
  type: "Solo" | "Group";
}

export interface Publication {
  id: string;
  title: string;
  outlet: string;
  date: string;
  excerpt: string;
  href: string;
}

export interface ArtistData {
  name: string;
  nationality: string;
  birthYear: string;
  tagline: string;
  heroImage: string;
  biography: string[];
  artworks: Artwork[];
  exhibitions: Exhibition[];
  publications: Publication[];
}
