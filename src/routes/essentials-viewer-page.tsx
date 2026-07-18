import { useState, useEffect, useRef } from "react";
import { useSearch } from "@tanstack/react-router";
import { ndhLogo4K as ndhLogo } from "@/assets/assets";
import { getEssentialsEntry } from "@/data/essentialsData";
import EssentialsNav from "@/components/essentials/EssentialsNav";
import ArtworkGallery from "@/components/art/ArtworkGallery";

function EssentialsViewerPage() {
  const { e } = useSearch({ from: "/essentials-viewer" });
  const entry = getEssentialsEntry(e);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [contentReady, setContentReady] = useState(false);
  const loadIdRef = useRef(0);

  useEffect(() => {
    if (!entry) return;

    const loadId = ++loadIdRef.current;
    setLoading(true);
    setProgress(0);
    setContentReady(false);

    const MIN_MS = 350;
    const start = performance.now();
    const artworks = entry.artworks;
    let loaded = 0;
    const total = artworks.length;

    const done = () => {
      if (loadId !== loadIdRef.current) return;
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, MIN_MS - elapsed);
      setTimeout(() => {
        if (loadId !== loadIdRef.current) return;
        setProgress(100);
        setTimeout(() => {
          if (loadId !== loadIdRef.current) return;
          setLoading(false);
          requestAnimationFrame(() => {
            if (loadId === loadIdRef.current) setContentReady(true);
          });
        }, 150);
      }, remaining);
    };

    if (total === 0) {
      done();
      return;
    }

    const tick = () => {
      loaded++;
      setProgress(Math.min(Math.round((loaded / total) * 100), 99));
      if (loaded >= total) done();
    };

    artworks.forEach((art) => {
      const img = new Image();
      img.onload = tick;
      img.onerror = tick;
      img.src = art.image;
    });

    return () => { loadIdRef.current++; };
  }, [e, entry]);

  if (!entry) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <EssentialsNav activeKey={e} />
        <div className="flex-1 flex items-center justify-center pt-28">
          <p className="text-muted-foreground">Collection not found</p>
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
      {/* ── Loading bar at the very top of the viewport ── */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            zIndex: 9999,
            background: "rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, rgba(201,169,110,0.3), #c9a96e)",
              transition: "width 0.3s ease",
              boxShadow: "0 0 8px rgba(201,169,110,0.3)",
            }}
          />
        </div>
      )}
      <div
        className="min-h-screen bg-background text-foreground/90 antialiased flex flex-col"
        style={{
          opacity: contentReady ? 1 : 0,
          transform: contentReady ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
          willChange: "opacity, transform",
        }}
      >
        <EssentialsNav activeKey={e} />
        <main className="relative flex-1 pt-0">
          <div className="border-t border-border/30" />
          {entry.artworks.length > 0 ? (
            <ArtworkGallery artworks={entry.artworks} artistName={entry.name || entry.letter} lightboxDimensions={entry.lightboxDimensions} lightboxAspectRatio={entry.lightboxAspectRatio} />
          ) : (
            <div className="flex items-center justify-center min-h-[40vh]">
              <p className="text-muted-foreground text-sm tracking-widest uppercase">Coming Soon</p>
            </div>
          )}
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

export default EssentialsViewerPage;
