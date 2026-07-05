export default function GalleryLoadingBar({ progress, visible }: { progress: number; visible: boolean }) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 9999,
        background: "rgba(255,255,255,0.08)",
        opacity: 1,
        transition: "opacity 250ms ease",
        pointerEvents: "none",
        willChange: "opacity",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "#C9A96E",
          transition: "width 300ms ease",
          willChange: "width",
        }}
      />
    </div>
  );
}
