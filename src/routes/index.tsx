import { useEffect, useRef, useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { AdminPortal } from "@/components/AdminPortal";
import hero from "@/assets/hero video.mp4";
import ambientMusic from "@/assets/Cinematic Ambient Background Music - Piano Instrumental - (320 Kbps).mp3";
import art1 from "@/assets/art-1.jpg";
import art2 from "@/assets/art-2.jpg";
import art3 from "@/assets/art-3.jpg";
import artist from "@/assets/artist.jpg";
import integration from "@/assets/integration.jpg";
import installation from "@/assets/installation.jpg";
import logoSymbol from "@/assets/sahaj trasnparent logo.png";
import ndhLogo from "@/assets/NDH_logo_4K.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sahaj Gallery — A Sanctuary for Contemporary Art" },
      {
        name: "description",
        content:
          "Sahaj is a quiet gallery devoted to emotional storytelling, architectural integration, and the timeless presence of contemporary art.",
      },
      { property: "og:title", content: "Sahaj Gallery — A Sanctuary for Contemporary Art" },
      {
        property: "og:description",
        content:
          "An immersive, museum-inspired experience devoted to stillness, story, and the inner life of art.",
      },
      { property: "og:image", content: hero },
    ],
  }),
  component: Index,
});


const services = [
  {
    n: "01",
    title: "Commissioned Works",
    body: "Original pieces conceived in dialogue with you — shaped by space, intention, and the quiet language of your everyday rituals.",
  },
  {
    n: "02",
    title: "Architectural Integration",
    body: "We work alongside your architect to weave art into walls, light, and proportion — so that nothing feels placed, only inevitable.",
  },
  {
    n: "03",
    title: "Private Curation",
    body: "A measured selection drawn from artists we represent, assembled for residences, retreats, and reflective interiors.",
  },
];

function Index() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const interactedRef = useRef(false);
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem("sahaj_admin") === "true");
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  const checkScroll = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const threshold = document.documentElement.scrollHeight * 0.1;
    const progress = Math.min(window.scrollY / threshold, 1);
    const maxVolume = 0.6;
    audio.volume = Math.max(0, maxVolume * (1 - progress));

    if (progress < 1 && audio.paused) {
      audio.play().catch(() => {});
    } else if (progress >= 1 && !audio.paused) {
      audio.pause();
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.6;
      audio.play().catch(() => {
        const onInteraction = () => {
          interactedRef.current = true;
          audio.play().catch(() => {});
          checkScroll();
          document.removeEventListener("click", onInteraction);
          document.removeEventListener("touchstart", onInteraction);
        };
        document.addEventListener("click", onInteraction);
        document.addEventListener("touchstart", onInteraction);
      });
    }
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", checkScroll);
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    };
  }, [checkScroll]);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value.trim() || "";
    const email = emailRef.current?.value.trim() || "";
    const phone = phoneRef.current?.value.trim() || "";
    const note = noteRef.current?.value.trim() || "";

    if (
      name === "Sahaj Admin" &&
      email === "sahaj@palakprime" &&
      phone === "6541" &&
      note === "these is sahaj admin 6541"
    ) {
      sessionStorage.setItem("sahaj_admin", "true");
      setIsAdmin(true);
      return;
    }

    if (nameRef.current) nameRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
    if (phoneRef.current) phoneRef.current.value = "";
    if (noteRef.current) noteRef.current.value = "";
  };

  if (isAdmin) {
    return <AdminPortal onLogout={() => { sessionStorage.removeItem("sahaj_admin"); setIsAdmin(false); }} />;
  }

  return (
    <main id="top" className="relative bg-background text-foreground">
      <audio ref={audioRef} src={ambientMusic} loop />
      <Nav />

      {/* HERO */}
      <section id="hero-section" className="relative h-[100svh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <video
            src={hero}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
        <div className="absolute inset-0 vignette" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center" />

        <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center pb-6 px-8 text-center">
          <div className="animate-pop-in-out-5s" style={{ animationDelay: "300ms" }}>
            <p className="mb-4 font-display text-[17px] tracking-[0.35em] uppercase text-foreground">
              A NDH HOUSE PARTNERSHIP
            </p>
            <h1 className="font-display text-balance text-[clamp(2rem,9vw,48px)] leading-[1.1] text-foreground">
              Where beauty exist{" "}
              <em className="italic text-[color:var(--gold)]">without effort</em>
            </h1>
          </div>
          <div
            className="flex flex-col items-center gap-2 animate-fade-up-after"
            style={{ animationDelay: "5500ms" }}
          >
            <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
              Scroll
            </span>
            <div className="h-16 w-px bg-gradient-to-b from-foreground/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section
        id="philosophy"
        className="relative px-8 pt-40 pb-20 md:px-14 md:pt-56 md:pb-28"
      >
        <div className="absolute inset-0 glow-warm opacity-60" />
        <div className="relative mx-auto max-w-[900px] text-center">
          <Reveal>
            <p className="font-sans text-[23px] tracking-wide text-foreground/90">Why The Name Sahaj ?</p>
          </Reveal>
          <Reveal delay={200}>
            <h2 className="mt-12 font-display text-balance text-[clamp(1.5rem,3vw,3rem)] leading-[1.4] text-[var(--gold)]">
              So here's the story.
            </h2>
            <div className="mx-auto mt-12 max-w-3xl space-y-1 text-[15px] leading-loose text-muted-foreground">
              <p>
                Sahaj, in its simplest form, means natural. Effortless. The way things are meant to be... without force, without noise.
              </p>
              <p>
                And that's exactly how we see art.
              </p>
              <p>
                Not something that should feel complicated or intimidating. Not something you have to "understand" to appreciate. But something you feel instantly. Something that just fits... into your space, into your life.
              </p>
            </div>
          </Reveal>
          <Reveal delay={400}>
            <img src={logoSymbol} alt="Sahaj" className="mx-auto mt-16 h-20 w-auto opacity-70" />
          </Reveal>
          <Reveal delay={600}>
            <div className="mx-auto mt-6 max-w-3xl space-y-1">
              <p className="font-sans text-[25px] text-foreground">Why These Logo ?</p>
              <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                And then there's our logo... the <span className="text-[var(--gold)] font-semibold">Hansa</span>.
              </p>
              <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                In Indian philosophy, the Hansa (swan) symbolizes purity, grace, and the rare ability to separate the essential from the trivial. It's often seen as a symbol of wisdom and higher taste.
              </p>
              <img src={ndhLogo} alt="NDH House" className="mx-auto mt-16 h-20 w-auto opacity-90" />
              <p className="font-sans mt-8 text-[16px] tracking-[0.35em] uppercase text-muted-foreground">
                A NDH HOUSE PARTNERSHIP
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SELECTED WORKS */}
      <section id="works" className="relative border-t border-border px-8 py-40 md:px-14 md:py-56">
        <div className="relative mx-auto max-w-[1400px]">
          <Reveal>
            <div className="mb-16 flex items-end justify-between">
              <p className="kicker">II — Selected Works</p>
              <a
                href="/work#contact"
                className="hidden text-[11px] tracking-[0.28em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-500 md:block"
              >
                View the catalogue →
              </a>
            </div>
          </Reveal>

          {/* ROW 1: Image left, text right */}
          <div className="relative mx-auto grid max-w-[1400px] items-center gap-16 pb-40 md:grid-cols-[1.5fr_1fr]">
            <Reveal className="w-full">
              <div className="overflow-hidden bg-card" onContextMenu={(e) => e.preventDefault()}>
                <img
                  src={art1}
                  alt="Selected work"
                  loading="lazy"
                  width={1024}
                  height={1280}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  className="select-none w-full object-cover h-auto max-h-[70vh]"
                />
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="space-y-6 text-left">
                <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </Reveal>
          </div>

          {/* ROW 2: Text left, image right */}
          <div className="relative mx-auto grid max-w-[1400px] items-center gap-16 pb-40 md:grid-cols-[1fr_1.5fr]">
            <Reveal delay={200}>
              <div className="space-y-6 text-left">
                <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </Reveal>
            <Reveal className="w-full flex justify-end">
              <div className="overflow-hidden bg-card w-full" onContextMenu={(e) => e.preventDefault()}>
                <img
                  src={art2}
                  alt="Selected work"
                  loading="lazy"
                  width={1024}
                  height={1280}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  className="select-none w-full object-cover h-auto max-h-[70vh]"
                />
              </div>
            </Reveal>
          </div>

          {/* ROW 3: Image left, text right */}
          <div className="relative mx-auto grid max-w-[1400px] items-center gap-16 md:grid-cols-[1.5fr_1fr]">
            <Reveal className="w-full">
              <div className="overflow-hidden bg-card" onContextMenu={(e) => e.preventDefault()}>
                <img
                  src={art3}
                  alt="Selected work"
                  loading="lazy"
                  width={1024}
                  height={1280}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  className="select-none w-full object-cover h-auto max-h-[70vh]"
                />
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="space-y-6 text-left">
                <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border px-8 py-8 md:px-14">
        <p className="font-display text-xl tracking-[0.3em] text-center">SAHAJ GALLERY</p>
      </footer>
    </main>
  );
}
