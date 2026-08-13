import { lazy, useState, useCallback, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LoadingScreen } from "@/components/LoadingScreen";
import {
  artworkSpotlight1,
  artworkSpotlight2,
  artworkSpotlight3,
  heroVideo,
} from "@/assets/assets";

const Page = lazy(() => import("./index-page"));

let _loadingShown = false;

function LoadingGate() {
  const [showLoader, setShowLoader] = useState(!_loadingShown);
  const [pageVisible, setPageVisible] = useState(_loadingShown);
  const [isFirstVisit] = useState(!_loadingShown);

  // ── Preload homepage assets in background during loading screen ──
  useEffect(() => {
    if (!_loadingShown) {
      [artworkSpotlight1, artworkSpotlight2, artworkSpotlight3].forEach((src) => {
        const img = new Image();
        img.src = src;
      });
      // Preload the hero video so the first frame is ready the moment the
      // loading screen fades out (same video for landscape and portrait)
      const vid = document.createElement("video");
      vid.preload = "auto";
      vid.muted = true;
      vid.src = heroVideo;
      vid.load();
    }
  }, []);

  // ── On subsequent visits (no loading screen), signal video to start immediately ──
  useEffect(() => {
    if (_loadingShown) {
      window.dispatchEvent(new CustomEvent("homepage:ready"));
    }
  }, []);

  const handleTransitionStart = useCallback(() => {
    _loadingShown = true;
    setPageVisible(true);
    // Signal to index-page that hero video should start playing
    window.dispatchEvent(new CustomEvent("homepage:ready"));
  }, []);

  const handleLoaderComplete = useCallback(() => {
    setShowLoader(false);
  }, []);

  return (
    <>
      {showLoader && (
        <LoadingScreen
          onTransitionStart={handleTransitionStart}
          onComplete={handleLoaderComplete}
        />
      )}
      <div
        className="page-entrance-wrapper"
        data-first-visit={isFirstVisit ? "true" : undefined}
        data-revealed={pageVisible ? "true" : "false"}
        style={{
          opacity: pageVisible ? 1 : 0,
          transition: "opacity 0.7s ease-out",
        }}
      >
        <Page />
      </div>
    </>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sahaj Gallery   A Sanctuary for Contemporary Art" },
      {
        name: "description",
        content:
          "Sahaj is a quiet gallery devoted to emotional storytelling, architectural integration, and the timeless presence of contemporary art.",
      },
      {
        property: "og:title",
        content: "Sahaj Gallery   A Sanctuary for Contemporary Art",
      },
      {
        property: "og:description",
        content:
          "An immersive, museum-inspired experience devoted to stillness, story, and the inner life of art.",
      },
      {
        property: "og:image",
        content: "https://sahaj-gallery.vercel.app/og-image.jpg",
      },
    ],
  }),
  component: LoadingGate,
});
