import { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";


export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Gallery — Sahaj Gallery" },
      {
        name: "description",
        content: "Browse the full collection of works at Sahaj Gallery in Ahmedabad.",
      },
    ],
  }),
  component: Work,
});

// --- Image loading from category folders ---

const imageModules = import.meta.glob<{ default: string }>("../assets/**/*.webp", {
  eager: true,
});

const categoryDisplayName: Record<string, string> = {
  "THE-EYES": "THE EYES",
  "THE URBAN": "THE URBAN",
  "THE-SIKSHAPATRI": "THE SIKSHAPATRI",
  "THE-REFLECTION": "THE REFLECTION",
  "CHERRY-BLOSSOM": "CHERRY BLOSSOM",
  sreeyantra: "SREEYANTRA",
  "SERENE-WOODLAND": "SERENE WOODLAND",
  "tribal-art": "TRIBAL ART",
  AUTUMN: "AUTUMN",
  SARANAM: "SARANAM",
  PARIJAT: "PARIJAT",
  FLORA: "FLORA",
  "PRAKRITI-MANDALA": "PRAKRITI MANDALA",
};

function displayName(cat: string): string {
  return categoryDisplayName[cat] ?? cat.replace(/[-_]/g, " ").toUpperCase();
}

/** Derive a human-readable name from a filename. */
function deriveName(fileName: string, categoryDir: string): string {
  const noExt = fileName.replace(/\.webp$/i, "");
  const esc = categoryDir.replace(/[-\s]/g, "[\\s-]");
  const withoutPrefix = noExt.replace(new RegExp(`^${esc}`, "i"), "").replace(/^[-]/, "");
  const withoutNum = withoutPrefix.replace(/-\d+$/, "");
  const cleaned = withoutNum.replace(/[-_]/g, " ").trim();
  return cleaned
    ? cleaned.replace(/\b\w/g, (c) => c.toUpperCase())
    : displayName(categoryDir);
}

// Creative names for all images — mapped by filename
const specificNames: Record<string, string> = {
  "THE-URBAN.webp": "Jungle Majesty",
  "THE-URBAN-1.webp": "Elephant Harmony",
  "THE-URBAN-2.webp": "Lion Legacy",
  "THE-URBAN-5.webp": "Tiger Trail",
  "THE-URBAN-6.webp": "Urban Solitude",
  "THE-URBAN-7.webp": "Concrete Bloom",
  "THE-URBAN-8.webp": "Street Rhythm",
  "THE-URBAN-9.webp": "City Veil",
  "THE-URBAN-11.webp": "Ascent",
  "THE-URBAN-12.webp": "Neon Stillness",
  "THE-EYES-2.webp": "Eagle Vision",
  "THE-EYES-4.webp": "Celestial Gaze",
  "THE-EYES-5.webp": "Whisper of Sight",
  "THE-EYES-6.webp": "Dawn Pupil",
  "THE-REFLECTION.webp": "Graceful Bond",
  "THE-REFLECTION-1.webp": "Still Waters",
  "THE-REFLECTION-2.webp": "Mirrored Silence",
  "THE-REFLECTION-3.webp": "Echo",
  "THE-REFLECTION-4.webp": "Depth of Surface",
  "THE-REFLECTION-5.webp": "Ripple and Calm",
  "THE-SIKSHAPATRI.webp": "Sacred Script",
  "THE-SIKSHAPATRI-1.webp": "Ancient Verse",
  "THE-SIKSHAPATRI-2.webp": "Palm Leaf Prayer",
  "PRAKRITI-MANDALA.webp": "Mandala of Being",
  "PRAKRITI-MANDALA-1.webp": "Cosmic Circle",
  "PRAKRITI-MANDALA-2.webp": "Sacred Geometry",
  "tribal-art.webp": "Tribal Echo",
  "tribal-art-2.webp": "Ancestral Pulse",
  "AUTUMN.webp": "Golden Fall",
  "CHERRY-BLOSSOM.webp": "Petal Drift",
  "FLORA.webp": "Botanical Stillness",
  "PARIJAT.webp": "Night Bloom",
  "SARANAM.webp": "Surrender",
  "sreeyantra.webp": "Divine Geometry",
  "SERENE-WOODLAND.webp": "Divine Peace",
};

interface Artwork {
  name: string;
  category: string;
  img: string;
  fileName: string;
}

const allArtworks: Artwork[] = [];
const categorySet = new Set<string>();

for (const [filePath, mod] of Object.entries(imageModules)) {
  const normalized = filePath.replace(/\\/g, "/").replace("../assets/", "");
  const parts = normalized.split("/");
  if (parts.length < 2) continue; // skip root-level files (e.g. NDH.webp)
  const categoryDir = parts[0];
  const fileName = parts[parts.length - 1];
  const category = displayName(categoryDir);
  categorySet.add(category);

  allArtworks.push({
    name: specificNames[fileName] ?? deriveName(fileName, categoryDir),
    category,
    img: mod.default,
    fileName,
  });
}

const categoryOrder = [
  "All",
  "THE EYES",
  "THE URBAN",
  "THE SIKSHAPATRI",
  "THE REFLECTION",
  "CHERRY BLOSSOM",
  "SREEYANTRA",
  "SERENE WOODLAND",
  "TRIBAL ART",
  "AUTUMN",
  "SARANAM",
  "PARIJAT",
  "FLORA",
  "PRAKRITI MANDALA",
];

const categories = [
  "All",
  ...categoryOrder.filter((c) => c !== "All" && categorySet.has(c)),
];

function Work() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [is3dMode, setIs3dMode] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const tiltRef = useRef({ rotateX: 0, rotateY: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  const filtered =
    activeCategory === "All"
      ? allArtworks
      : allArtworks.filter((a) => a.category === activeCategory);

  const scrollTab = (direction: number) => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: direction * 200, behavior: "smooth" });
    }
  };

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIs3dMode(false);
    setTilt({ rotateX: 0, rotateY: 0 });
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const toggle3d = () => {
    setIs3dMode((v) => !v);
    if (!is3dMode) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
    setTilt({ rotateX: 0, rotateY: 0 });
    tiltRef.current = { rotateX: 0, rotateY: 0 };
  };

  const handle3dMouse = (e: React.MouseEvent) => {
    if (!is3dMode || zoom > 1) return;
    const container = imageContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    tiltRef.current = {
      rotateY: deltaX * 20,
      rotateX: -deltaY * 20,
    };
    if (!animationRef.current) {
      const animate = () => {
        setTilt((prev) => ({
          rotateX: prev.rotateX + (tiltRef.current.rotateX - prev.rotateX) * 0.1,
          rotateY: prev.rotateY + (tiltRef.current.rotateY - prev.rotateY) * 0.1,
        }));
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const reset3d = () => {
    tiltRef.current = { rotateX: 0, rotateY: 0 };
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = 0;
    }
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const goNext = () => {
    if (selectedIndex !== null && selectedIndex < filtered.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  };

  const goPrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  };

  const zoomIn = () => setZoom((z) => Math.min(z + 0.5, 5));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.5, 1));

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && zoom > 1) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Nav />

      {/* HEADER */}
      <section className="relative pt-40 pb-8 md:pt-48 md:pb-12">
        <div className="mx-auto max-w-[1600px] px-8 md:px-14">
          <Reveal>
            <p className="kicker">A NDH HOUSE PARTNERSHIP</p>
            <h1 className="mt-6 font-display text-[clamp(2.4rem,5vw,5.5rem)] leading-[1] text-balance">
              Gallery
            </h1>
          </Reveal>
        </div>
      </section>

      {/* CATEGORY TABS */}
      <section className="relative px-8 md:px-14">
        <div className="mx-auto max-w-[1600px]">
          <div className="relative">
            <button
              onClick={() => scrollTab(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-8 h-8 bg-white/10 text-muted-foreground rounded-full shadow hover:bg-white/20 transition-colors"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div
              ref={tabsRef}
              className="gallery-tabs flex gap-6 overflow-x-auto py-4 md:mx-10"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`gallery-tab text-[11px] tracking-[0.2em] uppercase pb-1 whitespace-nowrap ${
                    activeCategory === cat
                      ? "active text-[color:var(--gold)]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button
              onClick={() => scrollTab(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-8 h-8 bg-white/10 text-muted-foreground rounded-full shadow hover:bg-white/20 transition-colors"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="mt-2 h-px w-full bg-border" />
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="px-8 py-12 md:px-14 md:py-20">
        <div className="mx-auto max-w-[1600px]">
          <div key={activeCategory} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-5 md:gap-6">
            {filtered.map((work, i) => (
              <div
                key={`${work.fileName}-${i}`}
                className="artwork-card cursor-pointer animate-card"
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={() => openLightbox(i)}
                onContextMenu={(e) => e.preventDefault()}
              >
                <div className="gallery-img-wrap bg-card shadow-sm relative overflow-hidden rounded-sm">
                  <img
                    src={work.img}
                    alt={work.name}
                    loading="lazy"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    className="gallery-img w-full object-contain select-none max-h-[380px] mx-auto"
                  />
                  <div className="absolute inset-0 z-[1] pointer-events-none select-none" />
                </div>
                <div className="mt-3 px-0.5">
                  <p className="text-[13px] leading-snug text-foreground text-center font-[500]">
                    {work.name}
                  </p>
                  <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground text-center mt-0.5">
                    {work.category}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-32 text-center">
              <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase">
                No artworks in this category yet
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border px-8 py-8 md:px-14">
        <p className="font-display text-xl tracking-[0.3em] text-center">SAHAJ GALLERY</p>
      </footer>

      {/* LIGHTBOX */}
      {selectedIndex !== null && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onKeyDown={handleKeyDown}
          tabIndex={0}
          onClick={(e) => { if (e.target === lightboxRef.current) closeLightbox(); }}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {selectedIndex > 0 && (
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {selectedIndex < filtered.length - 1 && (
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 rounded-full bg-white/10 px-4 py-2">
            <button onClick={zoomOut} className="text-white/70 hover:text-white transition-colors disabled:opacity-30" disabled={zoom <= 1}>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M5 12h14" />
              </svg>
            </button>
            <span className="min-w-[2.5rem] text-center text-[12px] text-white/70">{Math.round(zoom * 100)}%</span>
            <button onClick={zoomIn} className="text-white/70 hover:text-white transition-colors disabled:opacity-30" disabled={zoom >= 5}>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <span className="h-5 w-px bg-white/20 mx-1" />
            <button
              onClick={toggle3d}
              className={`flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase transition-colors ${
                is3dMode ? "text-[#c9a96e]" : "text-white/70 hover:text-white"
              }`}
              title="Toggle 3D view"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              3D
            </button>
          </div>

          <div
            ref={imageContainerRef}
            className="flex max-h-[90vh] max-w-[90vw] items-center justify-center overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={(e) => { handleMouseMove(e); handle3dMouse(e); }}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { handleMouseUp(); reset3d(); }}
            style={{
              cursor: zoom > 1 ? (isPanning ? "grabbing" : "grab") : "default",
              perspective: is3dMode && zoom === 1 ? "1200px" : "none",
            }}
          >
            <div className="relative"
              style={{
                transform: is3dMode && zoom === 1
                  ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1, 1, 1)`
                  : "none",
                transition: is3dMode && zoom === 1 ? "transform 0.1s ease-out" : "none",
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              <img
                src={filtered[selectedIndex].img}
                alt={filtered[selectedIndex].name}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                className="max-h-[85vh] max-w-[85vw] object-contain select-none"
                style={{
                  transform: zoom > 1 ? `scale(${zoom})` : "none",
                  cursor: zoom > 1 ? "zoom-in" : "default",
                }}
              />
            </div>
          </div>

          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 text-center">
            <p className="text-white/90 text-sm tracking-[0.12em]">
              {filtered[selectedIndex].name}
            </p>
            <p className="text-white/50 text-[10px] tracking-[0.2em] uppercase mt-1">
              {filtered[selectedIndex].category}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
