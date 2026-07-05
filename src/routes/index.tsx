import { lazy, useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LoadingScreen } from "@/components/LoadingScreen";

const Page = lazy(() => import("./index-page"));

let _loadingShown = false;

function LoadingGate() {
  const [showLoader, setShowLoader] = useState(!_loadingShown);
  const [pageVisible, setPageVisible] = useState(_loadingShown);
  const [isFirstVisit] = useState(!_loadingShown);

  const handleTransitionStart = useCallback(() => {
    _loadingShown = true;
    setPageVisible(true);
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
          transition: 'opacity 0.8s ease-out',
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
