let initialized = false;

export function initImageProtection() {
  if (initialized) return;
  initialized = true;

  const overlay = document.createElement("div");
  overlay.id = "img-protection-overlay";
  overlay.style.cssText = "position:fixed;inset:0;z-index:99998;pointer-events:none;background:transparent";
  document.body.appendChild(overlay);

  const style = document.createElement("style");
  style.textContent = `
    .protected-img-wrap { position:relative; display:inline-block; }
    .protected-img-overlay {
      position:absolute; inset:0; z-index:1; pointer-events:auto;
      background:transparent; user-select:none; -webkit-user-select:none;
    }
  `;
  document.head.appendChild(style);

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "PrintScreen" ||
      (e.ctrlKey && (e.key === "s" || e.key === "S" || e.key === "p" || e.key === "P" || e.key === "u" || e.key === "U" || e.key === "c" || e.key === "C")) ||
      (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) ||
      e.key === "F12"
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  document.addEventListener("contextmenu", (e) => {
    if ((e.target as HTMLElement)?.closest?.("img, .protected-img-wrap")) {
      e.preventDefault();
    }
  });

  let protectTimer: ReturnType<typeof setInterval>;
  const startProtection = () => {
    protectTimer = setInterval(() => {
      document.querySelectorAll("img").forEach((img) => {
        if (img.closest("#img-protection-overlay")) return;
        const parent = img.parentElement;
        if (parent && !parent.classList.contains("protected-img-wrap")) {
          const wrap = document.createElement("span");
          wrap.className = "protected-img-wrap";
          parent.insertBefore(wrap, img);
          wrap.appendChild(img);
          const imgOverlay = document.createElement("span");
          imgOverlay.className = "protected-img-overlay";
          wrap.appendChild(imgOverlay);
        }
      });
    }, 1000);
  };
  startProtection();
}
