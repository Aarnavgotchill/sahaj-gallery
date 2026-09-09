import { lazy, useState, useCallback, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LoadingScreen } from "@/components/LoadingScreen";
import {
  artworkSpotlight1,
  artworkSpotlight2,
  artworkSpotlight3,
  heroVideo,
  galleryIntroVideoLandscape,
  galleryIntroVideoPortrait,
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

      // Preload the gallery intro video so navigating to /work plays it
      // instantly instead of buffering (metadata-only fetch keeps it cheap)
      const introSrc = window.matchMedia("(orientation: portrait)").matches
        ? galleryIntroVideoPortrait
        : galleryIntroVideoLandscape;
      const introVid = document.createElement("video");
      introVid.preload = "auto";
      introVid.muted = true;
      introVid.src = introSrc;
      introVid.load();
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
  }, []);

  const handleLoaderComplete = useCallback(() => {
    setShowLoader(false);
    // Begin the hero only after the loader has fully faded away. This keeps
    // frame zero and the opening audio hidden until the reveal is complete.
    window.dispatchEvent(new CustomEvent("homepage:ready"));
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
        <Page playbackEnabled={!isFirstVisit || !showLoader} />
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
