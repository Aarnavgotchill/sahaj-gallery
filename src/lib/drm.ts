import { useEffect } from "react";

export function useDRM() {
  useEffect(() => {
    const isMac = navigator.platform.includes("Mac");

    const keydown = (e: KeyboardEvent) => {
      const mod = isMac ? e.metaKey : e.ctrlKey;

      // PrintScreen — intercepted here on most browsers
      if (e.key === "PrintScreen" || e.code === "PrintScreen") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // F12 — DevTools
      if (e.key === "F12") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl/Meta + (S, P, U, C, Shift+I/J/C)
      if (mod) {
        if (["s", "S", "p", "P", "u", "U"].includes(e.key)) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        if (e.shiftKey && ["I", "i", "J", "j", "C", "c"].includes(e.key)) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }

      // macOS Cmd+Shift+3 or 4 — may be intercepted by OS, but attempt anyway
      if (isMac && e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // PrintScreen often fires on keyup rather than keydown
    const keyup = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || e.code === "PrintScreen") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const contextmenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".protect")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const copy = (e: ClipboardEvent) => {
      if ((e.target as HTMLElement)?.closest(".protect")) {
        e.preventDefault();
      }
    };

    const dragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement)?.closest(".protect")) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", keydown, true);
    window.addEventListener("keyup", keyup, true);
    document.addEventListener("contextmenu", contextmenu, true);
    document.addEventListener("copy", copy, true);
    document.addEventListener("dragstart", dragStart, true);

    return () => {
      window.removeEventListener("keydown", keydown, true);
      window.removeEventListener("keyup", keyup, true);
      document.removeEventListener("contextmenu", contextmenu, true);
      document.removeEventListener("copy", copy, true);
      document.removeEventListener("dragstart", dragStart, true);
    };
  }, []);
}
