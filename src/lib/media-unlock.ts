let unlocked = false;
const pending: Array<() => void> = [];

function handleInteraction() {
  if (unlocked) return;
  unlocked = true;
  const copy = pending.slice();
  pending.length = 0;
  copy.forEach((fn) => fn());
}

["click", "touchstart", "keydown", "wheel"].forEach((event) => {
  document.addEventListener(event, handleInteraction, { once: true });
});

export function onMediaUnlocked(callback: () => void): () => void {
  if (unlocked) {
    callback();
    return () => {};
  }
  pending.push(callback);
  return () => {
    const idx = pending.indexOf(callback);
    if (idx >= 0) pending.splice(idx, 1);
  };
}

export function isMediaUnlocked(): boolean {
  return unlocked;
}
