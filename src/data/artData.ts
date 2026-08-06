import type { ArtistData } from "@/types/artist";

const W = 600;
const H = 700;

/* ═══════════════════════════════════════════════════
   ARTWORK IMAGE URL
   ═══════════════════════════════════════════════════ */
const ARTWORK_BASE = "https://picsum.photos/seed";

function img(seed: string): string {
  return `${ARTWORK_BASE}/${seed}/600/700`;
}

function hero(seed: string): string {
  return `${ARTWORK_BASE}/${seed}-hero/1600/2000`;
}

const pages: Record<string, ArtistData> = {
  s: {
    name: "Stories\nOf The\nGallery",
    birthYear: "1988",
    tagline: "ART IN ARCHITECTURE",
    heroImage: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/Shyamaliyo%20Mukharvind.webp",
    biography: [
      "Born in Lahore in 1988, the artist works across painting and textile, exploring the architectural language of domestic spaces.",
      "Their practice is rooted in the observation of thresholds, courtyards, and interiors, rendering them as abstract topographies of memory.",
    ],
    artworks: Array.from({ length: 9 }, (_, i) => ({
      id: `s-${i + 1}`,
      catalogNo: `S / ${String(i + 1).padStart(3, "0")}`,
      title: `Artwork ${i + 1}`,
      year: "2024",
      medium: "Artwork",
      dimensions: "",
      image: i === 0 ? "https://ik.imagekit.io/u07yycxii/1S%20WEBP/S2.webp"
        : i === 1 ? "https://ik.imagekit.io/u07yycxii/1S%20WEBP/S1.webp"
          : i === 2 ? "https://ik.imagekit.io/u07yycxii/1S%20WEBP/S3.webp"
            : i === 3 ? "https://ik.imagekit.io/u07yycxii/1S%20WEBP/S4.webp"
              : i === 4 ? "https://ik.imagekit.io/u07yycxii/1S%20WEBP/S5.webp"
                : i === 5 ? "https://ik.imagekit.io/u07yycxii/1S%20WEBP/S6.webp"
                  : i === 6 ? "https://ik.imagekit.io/u07yycxii/1S%20WEBP/S7.webp"
                    : i === 7 ? "https://ik.imagekit.io/u07yycxii/1S%20WEBP/S8.webp"
                      : i === 8 ? "https://ik.imagekit.io/u07yycxii/1S%20WEBP/S9.webp"
                        : img(`s-art-${i + 1}`),
      width: W,
      height: H,
    })),
    exhibitions: [],
    publications: [],
  },
  a: {
    name: "Artisan Craftsmanship",
    nationality: "Indian",
    birthYear: "1991",
    tagline: "LIGHT AND SHADOW IN COMPOSITE SPACE",
    heroImage: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/2A%20Webp/hero.webp",
    biography: [
      "Anita Correa works at the intersection of painting and architectural drawing, exploring how light carves space and shadow defines form.",
      "Her practice documents the forgotten geometries of domestic interiors — courtyards, verandahs, lattice screens — translating them into layered abstractions.",
    ],
    artworks: Array.from({ length: 9 }, (_, i) => ({
      id: `a-${i + 1}`,
      catalogNo: `A / ${String(i + 1).padStart(3, "0")}`,
      title: `Artwork ${i + 1}`,
      year: "2024",
      medium: "Artwork",
      dimensions: "",
      image: i === 0 ? "https://ik.imagekit.io/u07yycxii/A2/1A.webp"
        : i === 1 ? "https://ik.imagekit.io/u07yycxii/A2/2A.webp"
          : i === 2 ? "https://ik.imagekit.io/u07yycxii/A2/3A.webp"
            : i === 3 ? "https://ik.imagekit.io/u07yycxii/A2/4A.webp"
              : i === 4 ? "https://ik.imagekit.io/u07yycxii/A2/5A.webp"
                : i === 5 ? "https://ik.imagekit.io/u07yycxii/A2/6A.webp"
                  : i === 6 ? "https://ik.imagekit.io/u07yycxii/A2/7A.webp"
                    : i === 7 ? "https://ik.imagekit.io/u07yycxii/A2/8A.webp"
                      : i === 8 ? "https://ik.imagekit.io/u07yycxii/A2/9A.webp"
                        : img(`a-art-${i + 1}`),
      width: W,
      height: H,
    })),
    exhibitions: [],
    publications: [],
  },
  h: {
    name: "Heart of Conversations",
    nationality: "Indian",
    birthYear: "1985",
    tagline: "Engage in meaningful conversations, interactive activities, and fresh perspectives that inspire connection.",
    heroImage: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/H3%20Webp/Hridaya%20Pushpa.webp",
    biography: [
      "Hari Mohan investigates the ruins of modernist architecture in post-colonial South Asia, treating demolished structures as archaeological sites.",
      "Using concrete pigment, sand, and found materials, his canvases become excavations — recording what remains after a building is erased.",
    ],
    artworks: Array.from({ length: 9 }, (_, i) => ({
      id: `h-${i + 1}`,
      catalogNo: `H / ${String(i + 1).padStart(3, "0")}`,
      title: `Artwork ${i + 1}`,
      year: "2024",
      medium: "Artwork",
      dimensions: "",

      image: i === 0 ? "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/H3%20Webp/1H.webp"
        : i === 1 ? "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/H3%20Webp/2H.webp"
          : i === 2 ? "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/H3%20Webp/3H.webp"
            : i === 3 ? "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/H3%20Webp/5H.webp"
              : i === 4 ? "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/H3%20Webp/6H.webp"
                : i === 5 ? "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/H3%20Webp/7H.webp"
                  : i === 6 ? "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/H3%20Webp/8H.webp"
                    : i === 7 ? "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/H3%20Webp/9H.webp"
                      : i === 8 ? "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/H3%20Webp/10H.webp"
                        : img(`h-art-${i + 1}`),
      width: W,
      height: H,
    })),
    exhibitions: [],
    publications: [],
  },
  "a-2": {
    name: "Audience Appreciation",
    nationality: "Indian",
    birthYear: "1993",
    tagline: "Celebrate shared experiences, thoughtful interactions, and a genuine appreciation for art and design.",
    heroImage: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/4A%20Webp/Shyama%20Nada.webp",
    biography: [
      "Celebrate shared experiences, thoughtful interactions, and a genuine appreciation for art and design.",

    ],
    artworks: Array.from({ length: 9 }, (_, i) => ({
      id: `a2-${i + 1}`,
      catalogNo: `A2 / ${String(i + 1).padStart(3, "0")}`,
      title: `Artwork ${i + 1}`,
      year: "2024",
      medium: "Artwork",
      dimensions: "",
      image: i === 0 ? "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/4A%20Webp/1AA.webp"
        : i === 1 ? "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/4A%20Webp/2AA.webp"
          : i === 2 ? "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/4A%20Webp/3AA.webp"
            : i === 3 ? "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/4A%20Webp/4AA.webp"
              : i === 4 ? "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/4A%20Webp/5AA.webp"
                : i === 5 ? "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/4A%20Webp/6AA.webp"
                  : i === 6 ? "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/4A%20Webp/7AA.webp"
                    : i === 7 ? "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/4A%20Webp/8AA.webp"
                      : i === 8 ? "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/4A%20Webp/9AA.webp"
                        : img(`a2-art-${i + 1}`),
      width: W,
      height: H,
    })),
    exhibitions: [],
    publications: [],
  },
  j: {
    name: "Journey Through the Installation",
    nationality: "Indian",
    birthYear: "1990",
    tagline: "Complete the journey by experiencing the products in their installed environment, showcasing the finished vision and the satisfaction of a delighted client.",
    heroImage: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/Rupantarana.webp",
    biography: [
      "Jaya Sengupta works with embroidery and textile traditions, reimagining architecture through the language of thread.",
      "Her stitched surfaces map the domestic archive — patterns inherited from family craft, translated into abstract topographies of home and belonging.",
    ],
    artworks: Array.from({ length: 9 }, (_, i) => ({
      id: `j-${i + 1}`,
      catalogNo: `J / ${String(i + 1).padStart(3, "0")}`,
      title: `Artwork ${i + 1}`,
      year: "2024",
      medium: "Artwork",
      dimensions: "",
      image: "https://img.magnific.com/free-vector/torn-style-coming-soon-promo-template-social-media-post_1017-55783.jpg?semt=ais_hybrid&w=740&q=80",
      width: W,
      height: H,
    })),
    exhibitions: [],
    publications: [],
  },
};

export function getPageContent(slug: string): ArtistData | undefined {
  return pages[slug];
}

export function getAllSlugs(): string[] {
  return Object.keys(pages);
}
