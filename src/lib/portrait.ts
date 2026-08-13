import { useEffect } from "react";

const PORTRAIT_MQ = "(orientation: portrait) and (max-width: 768px)";

export function isPortraitMobile(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia(PORTRAIT_MQ).matches
  );
}

/**
 * Portrait users get no visible scrollbar and no smooth-scroll animation on
 * every page except the home page. Applies `portrait-no-scroll` to <html>.
 */
export function usePortraitNoScroll() {
  useEffect(() => {
    const mq = window.matchMedia(PORTRAIT_MQ);
    const apply = () => {
      document.documentElement.classList.toggle("portrait-no-scroll", mq.matches);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      document.documentElement.classList.remove("portrait-no-scroll");
    };
  }, []);
}
