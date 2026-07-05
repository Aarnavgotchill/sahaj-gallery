export default function Footer({ artistName }: { artistName: string }) {
  return (
    <footer className="border-t border-gallery-border/30 px-8 py-4">
      <div className="mx-auto flex w-full max-w-header items-center justify-between md:px-14">
        <p className="font-display text-xl tracking-[0.3em] text-gallery-gold">
          {artistName}
        </p>
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          className="opacity-80"
        >
          <rect x="6" y="16" width="28" height="20" rx="1" stroke="#C9A96E" strokeWidth="1.2" fill="none" />
          <path d="M4 18L20 4L36 18" stroke="#C9A96E" strokeWidth="1.2" fill="none" />
          <rect x="14" y="24" width="12" height="12" rx="1" stroke="#C9A96E" strokeWidth="1" fill="none" />
          <line x1="20" y1="28" x2="20" y2="32" stroke="#C9A96E" strokeWidth="1" />
        </svg>
      </div>
    </footer>
  );
}
