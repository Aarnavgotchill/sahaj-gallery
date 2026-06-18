import { useEffect } from "react";

export function useDRM() {
  useEffect(() => {
    const isMac = navigator.platform.includes("Mac");

    const keydown = (e: KeyboardEvent) => {
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if (e.key === "PrintScreen" || e.code === "PrintScreen") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      if (e.key === "F12") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

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

      if (isMac && e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const keyup = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || e.code === "PrintScreen") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const contextmenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const copy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    const dragStart = (e: DragEvent) => {
      e.preventDefault();
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
