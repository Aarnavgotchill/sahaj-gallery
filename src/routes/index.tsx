import { useEffect, useRef, useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { AdminPortal } from "@/components/AdminPortal";
const hero = "https://jw6ejb2nprevgnmd.public.blob.vercel-storage.com/hero%20video.mp4";
import ambientMusic from "@/assets/Cinematic Ambient Background Music - Piano Instrumental - (320 Kbps).mp3";
import art1 from "@/assets/ART WORK 1.png";
import art2 from "@/assets/ART WORK 2.png";
import art3 from "@/assets/ART WORK 3.png";
import artist from "@/assets/artist.jpg";
import integration from "@/assets/integration.jpg";
import installation from "@/assets/installation.jpg";
import logoSymbol from "@/assets/sahaj trasnparent logo.png";
import ndhLogo from "@/assets/NDH_logo_4K.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sahaj Gallery   A Sanctuary for Contemporary Art" },
      {
        name: "description",
        content:
          "Sahaj is a quiet gallery devoted to emotional storytelling, architectural integration, and the timeless presence of contemporary art.",
      },
      { property: "og:title", content: "Sahaj Gallery   A Sanctuary for Contemporary Art" },
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
    body: "Original pieces conceived in dialogue with you   shaped by space, intention, and the quiet language of your everyday rituals.",
  },
  {
    n: "02",
    title: "Architectural Integration",
    body: "We work alongside your architect to weave art into walls, light, and proportion   so that nothing feels placed, only inevitable.",
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
        <div className="bloom" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
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
        className="section-ambient relative px-8 pt-20 pb-20 md:px-14 md:pt-28 md:pb-28"
      >
        <div className="bloom" />
        <div className="absolute inset-0 glow-warm opacity-40" />
        <div className="relative mx-auto max-w-[900px] text-center">
          <Reveal>
            <h2 className="font-display text-balance text-[clamp(1.2rem,2.2vw,2rem)] leading-[1.3] text-[var(--gold)]">
              The Story Behind the Name SAHAJ
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <div className="mx-auto mt-12 max-w-3xl space-y-6 text-[15px] leading-loose text-muted-foreground">
              <p>
                Every name carries a meaning, a thought, and a purpose. SAHAJ was chosen because it reflects everything we believe art should be. Sahaj, in its simplest form, means natural. Effortless. The way things are meant to be... without force, without noise. And that's exactly how we see art.
              </p>
              <p>
                Not something that should feel complicated or intimidating. Not something you have to "understand" to appreciate. But something you feel instantly. Something that naturally finds its place in your space, your surroundings, and your life.
              </p>
              <p>
                At SAHAJ, we create and curate art that feels authentic, timeless, and deeply connected to the people who live with it. Because the most meaningful things are often the ones that feel the most natural.
              </p>
            </div>
          </Reveal>
          <Reveal delay={400}>
            <img src={logoSymbol} alt="Sahaj" className="mx-auto mt-12 h-28 w-auto opacity-70" />
          </Reveal>
          <Reveal delay={600}>
            <div className="mx-auto mt-8 max-w-3xl space-y-6">
              <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                And then there's our logo... the <span className="text-[var(--gold)] font-semibold">Hansa</span>.
              </p>
              <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                A symbol of peace, purity, and quiet beauty, the Hansa has long held a special place in Indian philosophy. It represents grace in movement, clarity in thought, and a gentle connection to what is true and meaningful.
              </p>
              <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                We chose the Hansa because it reflects the feeling we want our art to evoke   calm, effortless, and timeless. Much like a swan gliding across still waters, true beauty doesn't seek attention; it simply exists, serene and natural.
              </p>
              <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                For us, the Hansa is a reminder that the most meaningful things are often the most peaceful. It embodies the spirit of SAHAJ   art that brings harmony to a space, softness to a moment, and beauty that feels naturally at home.
              </p>
            </div>
          </Reveal>
          <Reveal delay={800}>
            <img src={ndhLogo} alt="NDH House" className="mx-auto mt-12 h-20 w-auto opacity-90" />
            <p className="font-sans mt-8 text-[16px] tracking-[0.35em] uppercase text-muted-foreground">
              A NDH HOUSE PARTNERSHIP
            </p>
            <div className="mx-auto mt-10 max-w-3xl space-y-5 text-[15px] leading-loose text-muted-foreground">
              <p>
                SAHAJ is an initiative by NDH House, an architecture and interior design firm with extensive experience in hospitality, hotel, resort, and commercial interior projects.
              </p>
              <p>
                Over the years, we discovered that while architecture shapes a space, art gives it emotion and identity. This belief inspired our philosophy of <em className="text-[var(--gold)]">Art in Architecture</em>, where art is not merely an addition, but an integral part of the spatial experience.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SELECTED WORKS */}
      <section id="works" className="section-ambient relative border-t border-border/40 px-8 py-40 md:px-14 md:py-56">
        <div className="relative mx-auto max-w-[1400px]">
          <Reveal>
            <div className="mb-16 flex items-end justify-between">
              <p className="font-display text-[clamp(1rem,2vw,1.5rem)] tracking-[0.12em] text-[var(--gold)]">Sahaj Spotlight: <span className="italic text-foreground/90">Artwork of the Month</span></p>
              <a
                href="/work#contact"
                className="hidden text-[11px] tracking-[0.28em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-500 md:block"
              >
                View the Gallery →
              </a>
            </div>
          </Reveal>

          {/* ROW 1: Image left, text right   Burrows Beneath the Cracks */}
          <div className="relative mx-auto grid max-w-[1400px] items-center gap-8 pb-40 md:grid-cols-[1fr_1.8fr]">
            <Reveal className="flex justify-center">
              <div onContextMenu={(e) => e.preventDefault()}>
                  <img
                    src={art1}
                    alt="Burrows Beneath the Cracks"
                    loading="lazy"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    className="select-none h-auto max-h-[80vh] object-contain"
                  />
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="space-y-5 text-left">
                <h3 className="font-display text-[clamp(1.2rem,2vw,1.8rem)] text-[var(--gold)] leading-snug">
                  Burrows Beneath the Cracks
                </h3>
                <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                  We often see the cracked earth as a symbol of dryness and hardship, admiring the patterns it leaves behind. Yet beneath those fractures lies a hidden world   tiny homes, quiet shelters, and lives that continue to thrive against all odds. The rabbit burrows in this artwork reveal that even when the surface appears broken, life finds a way to endure.
                </p>
                <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                  These gentle rabbits remind us of our own journey through difficult times   that beneath every scar, every crack, and every challenge, there remains warmth, hope, and a place to belong. What seems broken from above may, in fact, be protecting a life below. Sometimes, the deepest strength is found in the most fragile places.
                </p>
                <p className="font-sans text-[13px] leading-relaxed text-muted-foreground/70 italic">
                  Size of the Artwork: 8'2"(H) X 3'2"(W)
                </p>
              </div>
            </Reveal>
          </div>

          {/* ROW 2: Text left, image right   Coffee on Canvas */}
          <div className="relative mx-auto grid max-w-[1400px] items-center gap-16 pb-40 md:grid-cols-[1fr_1.5fr]">
            <Reveal delay={200}>
              <div className="space-y-5 text-left">
                <h3 className="font-display text-[clamp(1.2rem,2vw,1.8rem)] text-[var(--gold)] leading-snug">
                  Coffee on Canvas
                </h3>
                <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                  This canvas is a shade card for coffee lovers. Every roast on it comes from a different part of the world, and someone who truly knows their coffee can look at a colour and instantly recall its taste, the richness of its soil, the altitude where it was grown, and the story behind every bean.
                </p>
                <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                  More than just artwork, it captures the memories, rituals, and emotions that make coffee special. For someone who truly loves coffee, this is one of the most personal canvases they can have in their space.
                </p>
                <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                  To experience it in person and explore the story behind every shade, do visit us at our gallery.
                </p>
                <p className="font-sans text-[13px] leading-relaxed text-muted-foreground/70 italic">
                  Size of the Artwork: 5'(H) X 5'(W)
                </p>
              </div>
            </Reveal>
            <Reveal className="w-full flex justify-end">
              <div className="w-full" onContextMenu={(e) => e.preventDefault()}>
                <img
                  src={art2}
                  alt="Coffee on Canvas"
                  loading="lazy"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  className="select-none w-full h-auto max-h-[80vh] object-contain"
                />
              </div>
            </Reveal>
          </div>

          {/* ROW 3: Image left, text right   Ayodhya Alok */}
          <div className="relative mx-auto grid max-w-[1400px] items-center gap-16 md:grid-cols-[1.5fr_1fr]">
            <Reveal className="w-full">
              <div className="w-full" onContextMenu={(e) => e.preventDefault()}>
                <img
                  src={art3}
                  alt="Ayodhya Alok"
                  loading="lazy"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  className="select-none w-full h-auto max-h-[80vh] object-contain"
                />
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="space-y-5 text-left">
                <h3 className="font-display text-[clamp(1.2rem,2vw,1.8rem)] text-[var(--gold)] leading-snug">
                  Ayodhya Alok
                </h3>
                <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                  There are moments in history that are remembered, and there are moments that are felt. This artwork captures the emotion of an Ayodhya where every heart chants "Shri Ram"   not merely as a prayer, but as a profound connection to faith, memory, and belonging.
                </p>
                <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                  As Shri Ram, Sita, and Lakshman walk toward the sacred temple, they embody the hopes, devotion, and unwavering love of countless generations. The resonating chant of "Shri Ram" becomes a collective heartbeat, uniting millions in a shared feeling of homecoming, grace, and divine presence.
                </p>
                <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                  More than a journey to a temple, it is the journey of millions of hearts returning to Ram.
                </p>
                <p className="font-sans text-[13px] leading-relaxed text-muted-foreground/70 italic">
                  Size of the Artwork: 3'6"(H) X 2'6"(W)
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/30 px-8 py-4 md:px-14">
        <div className="flex items-center justify-between">
          <p className="font-display text-xl tracking-[0.3em]">SAHAJ GALLERY</p>
          <img src={ndhLogo} alt="NDH House" className="h-12 w-auto opacity-80" />
        </div>
      </footer>
    </main>
  );
}