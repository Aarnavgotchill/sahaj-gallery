const SANITY_STUDIO_URL = "https://sahaj-gallery.sanity.studio";

interface AdminPortalProps {
  onLogout: () => void;
}

export function AdminPortal({ onLogout }: AdminPortalProps) {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-background/98 backdrop-blur-sm overflow-y-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-border px-8 py-5 md:px-14">
        <div className="flex items-center gap-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--gold)]/20 text-[color:var(--gold)] text-sm font-bold">A</span>
          <h1 className="font-display text-xl tracking-[0.15em] text-foreground">Admin Portal</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] tracking-[0.2em] uppercase text-[color:var(--gold)]">Authenticated</span>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 border border-border px-4 py-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground transition-all duration-500 hover:border-red-500/50 hover:text-red-400"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 px-8 py-16 md:px-14 md:py-24">
        <div className="mx-auto max-w-[800px] text-center">
          <div className="mb-12">
            <p className="kicker">Sanity CMS</p>
            <h2 className="mt-6 font-display text-[clamp(2rem,4vw,4rem)] leading-[1.1]">
              Manage Website Content
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              Edit all text, upload images and videos, manage gallery artworks, update testimonials, and more — all changes go live instantly.
            </p>
          </div>

          <a
            href={SANITY_STUDIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-4 border border-[color:var(--gold)] px-12 py-5 text-[13px] tracking-[0.3em] uppercase text-[color:var(--gold)] transition-all duration-500 hover:bg-[color:var(--gold)] hover:text-background"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Open Sanity Studio
            <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </a>

          <div className="mt-20 grid gap-6 text-left md:grid-cols-3">
            <div className="border border-border p-6">
              <p className="text-[11px] tracking-[0.25em] uppercase text-[color:var(--gold)]">01</p>
              <h3 className="mt-4 font-display text-xl text-foreground">Site Settings</h3>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                Edit hero headline, philosophy text, contact info, and logo description.
              </p>
            </div>
            <div className="border border-border p-6">
              <p className="text-[11px] tracking-[0.25em] uppercase text-[color:var(--gold)]">02</p>
              <h3 className="mt-4 font-display text-xl text-foreground">Gallery & Media</h3>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                Upload artworks, manage categories, add descriptions. Videos too.
              </p>
            </div>
            <div className="border border-border p-6">
              <p className="text-[11px] tracking-[0.25em] uppercase text-[color:var(--gold)]">03</p>
              <h3 className="mt-4 font-display text-xl text-foreground">Testimonials</h3>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                Update Fenil, Dhruti, and Hands of SAHAJ sections with new quotes and videos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
