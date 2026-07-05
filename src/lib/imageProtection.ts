let initialized = false;

// Wraps a single <img> in a protection overlay that intercepts right-clicks
// and long-press saves, without blocking pointer events on the image itself.
function protectImg(img: HTMLImageElement) {
  if (img.closest("#img-protection-overlay")) return;
  const parent = img.parentElement;
  if (parent && !parent.classList.contains("protected-img-wrap")) {
    const wrap = document.createElement("span");
    wrap.className = "protected-img-wrap";
    const isAbsolute = getComputedStyle(img).position === "absolute";
    if (isAbsolute) {
      wrap.style.cssText = "position:absolute;inset:0;display:block;pointer-events:none";
    }
    parent.insertBefore(wrap, img);
    wrap.appendChild(img);
    const imgOverlay = document.createElement("span");
    imgOverlay.className = "protected-img-overlay";
    wrap.appendChild(imgOverlay);
    if (isAbsolute && imgOverlay) {
      imgOverlay.style.cssText = "position:absolute;inset:0;z-index:1;pointer-events:auto;background:transparent;user-select:none;-webkit-user-select:none";
    }
  }
}

// Scans a single DOM node (and its subtree) for images to protect.
// Avoids full-document querySelectorAll on every mutation.
function scanNodeForImages(node: Node) {
  if (node instanceof HTMLImageElement) {
    protectImg(node);
  } else if (node instanceof Element) {
    node.querySelectorAll("img").forEach(protectImg);
  }
}

export function initImageProtection() {
  if (initialized) return;
  initialized = true;

  const overlay = document.createElement("div");
  overlay.id = "img-protection-overlay";
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:99998;pointer-events:none;background:transparent";
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

  // Process images already present in the DOM
  document.querySelectorAll("img").forEach(protectImg);

  // Watch for dynamically added images — only processes added nodes,
  // avoiding repeated full-document scans on every mutation.
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        scanNodeForImages(node);
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
