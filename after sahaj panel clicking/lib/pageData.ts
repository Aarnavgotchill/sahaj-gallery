import { ArtistData } from "@/types/artist";

const R2 = "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev";

const W = 600;
const H = 700;

const pages: Record<string, ArtistData> = {
  s: {
    name: "SAHAJ GALLERY",
    nationality: "Pakistani",
    birthYear: "1988",
    tagline: "ART IN ARCHITECTURE",
    heroImage: "https://tense-emerald-ag8mklnw.edgeone.dev/iris-elephant.webp.png",
    biography: [
      "Born in Lahore in 1988, the artist works across painting and textile, exploring the architectural language of domestic spaces.",
      "Their practice is rooted in the observation of thresholds, courtyards, and interiors, rendering them as abstract topographies of memory.",
    ],
    artworks: [
      { id: "aw-01", catalogNo: "AV / 001", title: "Courtyard, Late Afternoon", year: "2024", medium: "Oil and thread on stitched canvas", dimensions: "182 x 142 cm", image: `${R2}/S1.JPG`, width: W, height: H },
      { id: "aw-02", catalogNo: "AV / 002", title: "Interior with Two Doors", year: "2023", medium: "Oil on linen", dimensions: "120 x 150 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/S2.JPG", width: W, height: H },
      { id: "aw-03", catalogNo: "AV / 003", title: "Study for a Threshold", year: "2023", medium: "Gouache and pigment on paper", dimensions: "56 x 76 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/1S/S3.JPG", width: W, height: H },
      { id: "aw-04", catalogNo: "AV / 004", title: "Marigold Ledger", year: "2022", medium: "Oil and thread on stitched canvas", dimensions: "200 x 160 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/1S/S4.jpg", width: W, height: H },
      { id: "aw-05", catalogNo: "AV / 005", title: "Room Facing East", year: "2022", medium: "Oil on linen", dimensions: "100 x 130 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/1S/S5.jpg", width: W, height: H },
      { id: "aw-06", catalogNo: "AV / 006", title: "Second Courtyard", year: "2021", medium: "Oil and thread on stitched canvas", dimensions: "175 x 135 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/1S/S6.JPG", width: W, height: H },
      { id: "aw-07", catalogNo: "AV / 007", title: "Notes on a Wall, Amsterdam", year: "2021", medium: "Mixed media on paper", dimensions: "48 x 64 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/1S/S7.jpg", width: W, height: H },
      { id: "aw-08", catalogNo: "AV / 008", title: "Vessel with Standing Figure", year: "2020", medium: "Oil on linen", dimensions: "150 x 190 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/1S/S8.JPG", width: W, height: H },
      { id: "aw-09", catalogNo: "AV / 009", title: "Two Chairs, No One", year: "2020", medium: "Oil and thread on stitched canvas", dimensions: "140 x 110 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/1S/S9.jpg", width: W, height: H },
    ],
    exhibitions: [],
    publications: [],
  },
  a: {
    name: "ANITA CORREA",
    nationality: "Indian",
    birthYear: "1991",
    tagline: "LIGHT AND SHADOW IN COMPOSITE SPACE",
    heroImage: "https://picsum.photos/seed/anita-hero/1600/2000",
    biography: [
      "Anita Correa works at the intersection of painting and architectural drawing, exploring how light carves space and shadow defines form.",
      "Her practice documents the forgotten geometries of domestic interiors — courtyards, verandahs, lattice screens — translating them into layered abstractions.",
    ],
    artworks: [
      { id: "ac-01", catalogNo: "AC / 001", title: "Vernacular Geometry", year: "2024", medium: "Oil on canvas", dimensions: "150 x 120 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/2A/1A.JPG", width: W, height: H },
      { id: "ac-02", catalogNo: "AC / 002", title: "Threshold Series I", year: "2023", medium: "Mixed media on linen", dimensions: "120 x 150 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/2A/2A.JPG", width: W, height: H },
      { id: "ac-03", catalogNo: "AC / 003", title: "Courtyard Diagrams", year: "2023", medium: "Ink and pigment on paper", dimensions: "76 x 56 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/2A/3A.jpg", width: W, height: H },
      { id: "ac-04", catalogNo: "AC / 004", title: "Light Well", year: "2022", medium: "Oil on linen", dimensions: "180 x 140 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/2A/4A.jpg", width: W, height: H },
      { id: "ac-05", catalogNo: "AC / 005", title: "Shadow Diagram", year: "2022", medium: "Charcoal and acrylic", dimensions: "100 x 130 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/2A/5A.jpg", width: W, height: H },
      { id: "ac-06", catalogNo: "AC / 006", title: "Pochade for a Courtyard", year: "2021", medium: "Oil on board", dimensions: "60 x 80 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/2A/6A.jpg", width: W, height: H },
      { id: "ac-07", catalogNo: "AC / 007", title: "Lattice Study", year: "2021", medium: "Gouache on paper", dimensions: "50 x 65 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/2A/7A.jpg", width: W, height: H },
      { id: "ac-08", catalogNo: "AC / 008", title: "The Blue Room", year: "2020", medium: "Oil on canvas", dimensions: "160 x 130 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/8A.jpeg", width: W, height: H },
      { id: "ac-09", catalogNo: "AC / 009", title: "Interior, Late Light", year: "2020", medium: "Oil on linen", dimensions: "130 x 160 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/9A.jpeg", width: W, height: H },
    ],
    exhibitions: [],
    publications: [],
  },
  h: {
    name: "HARI MOHAN",
    nationality: "Indian",
    birthYear: "1985",
    tagline: "STRUCTURE AS MEMORY",
    heroImage: "https://picsum.photos/seed/hari-hero/1600/2000",
    biography: [
      "Hari Mohan investigates the ruins of modernist architecture in post-colonial South Asia, treating demolished structures as archaeological sites.",
      "Using concrete pigment, sand, and found materials, his canvases become excavations — recording what remains after a building is erased.",
    ],
    artworks: [
      { id: "hm-01", catalogNo: "HM / 001", title: "Foundation Fragments", year: "2024", medium: "Concrete pigment on canvas", dimensions: "170 x 130 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/3H/1H.JPG", width: W, height: H },
      { id: "hm-02", catalogNo: "HM / 002", title: "Column Study I", year: "2023", medium: "Oil and sand on linen", dimensions: "120 x 150 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/3H/2H.JPG", width: W, height: H },
      { id: "hm-03", catalogNo: "HM / 003", title: "Planar Elevation", year: "2023", medium: "Acrylic on board", dimensions: "90 x 120 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/3H/3H.JPG", width: W, height: H },
      { id: "hm-04", catalogNo: "HM / 004", title: "Load Bearing", year: "2022", medium: "Mixed media on canvas", dimensions: "200 x 150 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/3H/4H.JPG", width: W, height: H },
      { id: "hm-05", catalogNo: "HM / 005", title: "Reinforcement Pattern", year: "2022", medium: "Ink and thread on paper", dimensions: "76 x 56 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/3H/5H.JPG", width: W, height: H },
      { id: "hm-06", catalogNo: "HM / 006", title: "Archival Debris", year: "2021", medium: "Found materials on panel", dimensions: "100 x 80 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/3H/6H.JPG", width: W, height: H },
      { id: "hm-07", catalogNo: "HM / 007", title: "Steel and Ash", year: "2021", medium: "Oil on linen", dimensions: "150 x 120 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/3H/7H.JPG", width: W, height: H },
      { id: "hm-08", catalogNo: "HM / 008", title: "Tensile Drawing", year: "2020", medium: "Graphite and pigment", dimensions: "56 x 76 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/3H/8H.JPG", width: W, height: H },
      { id: "hm-09", catalogNo: "HM / 009", title: "Compression Study", year: "2020", medium: "Oil on canvas", dimensions: "160 x 140 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/3H/9H.JPG", width: W, height: H },
    ],
    exhibitions: [],
    publications: [],
  },
  "a-2": {
    name: "ARAVIND NAIR",
    nationality: "Indian",
    birthYear: "1993",
    tagline: "THE ARCHITECTURE OF ABSENCE",
    heroImage: "https://picsum.photos/seed/aravind-hero/1600/2000",
    biography: [
      "Aravind Nair's work is an inquiry into negative space — the volumes that architecture excludes rather than encloses.",
      "Working primarily in charcoal and ink, he maps the voids left behind by demolition, abandonment, and the passage of time across urban landscapes.",
    ],
    artworks: [
      { id: "an-01", catalogNo: "AN / 001", title: "Negative Volume", year: "2024", medium: "Oil on linen", dimensions: "160 x 130 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/4A/1AA.JPG", width: W, height: H },
      { id: "an-02", catalogNo: "AN / 002", title: "Void Studies", year: "2023", medium: "Charcoal on paper", dimensions: "76 x 56 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/4A/2AA.JPG", width: W, height: H },
      { id: "an-03", catalogNo: "AN / 003", title: "Unbuilt Room", year: "2023", medium: "Ink and wash", dimensions: "56 x 76 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/4A/3AA.JPG", width: W, height: H },
      { id: "an-04", catalogNo: "AN / 004", title: "Demolition Diary", year: "2022", medium: "Mixed media on canvas", dimensions: "180 x 140 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/4A/4AA.JPG", width: W, height: H },
      { id: "an-05", catalogNo: "AN / 005", title: "Trace of a Wall", year: "2022", medium: "Oil on board", dimensions: "90 x 120 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/4A/5AA.JPG", width: W, height: H },
      { id: "an-06", catalogNo: "AN / 006", title: "Corner Condition", year: "2021", medium: "Acrylic on canvas", dimensions: "130 x 160 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/4A/6AA.JPG", width: W, height: H },
      { id: "an-07", catalogNo: "AN / 007", title: "Shadow Index", year: "2021", medium: "Graphite and gouache", dimensions: "56 x 76 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/4A/7AA.JPG", width: W, height: H },
      { id: "an-08", catalogNo: "AN / 008", title: "Site of Absence", year: "2020", medium: "Oil on linen", dimensions: "150 x 120 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/4A/8AA.JPG", width: W, height: H },
      { id: "an-09", catalogNo: "AN / 009", title: "Residual Space", year: "2020", medium: "Mixed media on panel", dimensions: "100 x 80 cm", image: "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/4A/9AA.JPG", width: W, height: H },
    ],
    exhibitions: [],
    publications: [],
  },
  j: {
    name: "JAYA SENGUPTA",
    nationality: "Indian",
    birthYear: "1990",
    tagline: "THREAD, MEMORY, STRUCTURE",
    heroImage: "https://picsum.photos/seed/jaya-hero/1600/2000",
    biography: [
      "Jaya Sengupta works with embroidery and textile traditions, reimagining architecture through the language of thread.",
      "Her stitched surfaces map the domestic archive — patterns inherited from family craft, translated into abstract topographies of home and belonging.",
    ],
    artworks: [
      { id: "js-01", catalogNo: "JS / 001", title: "Woven Ground", year: "2024", medium: "Embroidery and oil on canvas", dimensions: "150 x 120 cm", image: "https://picsum.photos/seed/js01/1400/1100", width: W, height: H },
      { id: "js-02", catalogNo: "JS / 002", title: "Stitch as Line", year: "2023", medium: "Thread on linen", dimensions: "120 x 150 cm", image: "https://picsum.photos/seed/js02/1100/1400", width: W, height: H },
      { id: "js-03", catalogNo: "JS / 003", title: "Domestic Archive", year: "2023", medium: "Mixed media textile", dimensions: "90 x 120 cm", image: "https://picsum.photos/seed/js03/1300/1000", width: W, height: H },
      { id: "js-04", catalogNo: "JS / 004", title: "Mapping Memory", year: "2022", medium: "Embroidery on canvas", dimensions: "180 x 140 cm", image: "https://picsum.photos/seed/js04/1500/1200", width: W, height: H },
      { id: "js-05", catalogNo: "JS / 005", title: "Needle Drawing", year: "2022", medium: "Thread and pigment", dimensions: "76 x 56 cm", image: "https://picsum.photos/seed/js05/1200/1500", width: W, height: H },
      { id: "js-06", catalogNo: "JS / 006", title: "Pattern Language", year: "2021", medium: "Stitched paper", dimensions: "50 x 60 cm", image: "https://picsum.photos/seed/js06/1000/1300", width: W, height: H },
      { id: "js-07", catalogNo: "JS / 007", title: "Unravelling", year: "2021", medium: "Mixed media on canvas", dimensions: "130 x 160 cm", image: "https://picsum.photos/seed/js07/1300/1650", width: W, height: H },
      { id: "js-08", catalogNo: "JS / 008", title: "Threadbare", year: "2020", medium: "Oil and thread on linen", dimensions: "150 x 120 cm", image: "https://picsum.photos/seed/js08/1400/1100", width: W, height: H },
      { id: "js-09", catalogNo: "JS / 009", title: "Knot and Narrative", year: "2020", medium: "Embroidery on khadi", dimensions: "100 x 80 cm", image: "https://picsum.photos/seed/js09/1200/1500", width: W, height: H },
    ],
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
