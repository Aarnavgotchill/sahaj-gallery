type Listener = (id: string | null, prev: string | null) => void;

let activeVideoId: string | null = null;
const listeners: Listener[] = [];

export function setActiveVideo(id: string | null) {
  if (id === activeVideoId) return;
  const prev = activeVideoId;
  activeVideoId = id;
  listeners.forEach((fn) => fn(id, prev));
}

export function getActiveVideo(): string | null {
  return activeVideoId;
}

export function onActiveVideoChange(
  fn: (id: string | null, prev: string | null) => void,
): () => void {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}
