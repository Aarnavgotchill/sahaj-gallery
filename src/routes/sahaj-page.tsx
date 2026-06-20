import { useEffect } from "react";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { VideoPlayer } from "@/components/VideoPlayer";
import { r2 } from "@/config/r2";

const ndhLogo = r2.homePage("NDH_logo_4K.png");
const sahajLogo = r2.homePage("sahaj-trasnparent-logo.png");
const studioLogo = r2.homePage("Studio_Shikshaptri_white_4K.png");
const karigariLogo = r2.homePage("karigari-logo-png.webp");
const sahajGallery = r2.placeholder("sahaj-gallery-placeholder.webp");
const fenilVideo = r2.videos("fenil-video.mp4");
const dhrutiVideo = r2.videos("Dhruit-Panchal-V1.mp4");
const handsVideo = r2.videos("The-Hands-of-Sahaj.mp4");

function Sahaj() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <Nav />

      {/* HERO  Partnership Branding */}
      <section className="relative flex min-h-[90svh] items-center justify-center overflow-hidden px-8 pt-32 pb-20 md:px-14">
        <div className="bloom" />
        <div className="absolute inset-0 glow-warm opacity-30" />
        <div className="relative z-10 mx-auto max-w-[1200px] text-center">
          <Reveal className="shape">
            <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-10">
              <div className="flex flex-col items-center gap-3">
                <img
                  src={sahajLogo}
                  alt="Sahaj Gallery"
                  className="h-24 w-auto object-contain md:h-29"
                />
                <span className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground">
                  SAHAJ GALLERY
                </span>
              </div>
              <span className="font-display text-3xl tracking-[0.15em] text-[color:var(--gold)] md:text-4xl flex items-center justify-center h-24 md:h-29 flex-shrink-0">
                ×
              </span>
              <div className="flex flex-col items-center gap-3">
                <img
                  src={ndhLogo}
                  alt="NDH House"
                  className="h-24 w-auto object-contain md:h-29"
                />
                <div className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground leading-relaxed">
                  <span>NDH HOUSE</span>
                  <br />
                  <span className="text-[10px] tracking-[0.25em]">
                    Private Limited
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={200} className="shape">
            <h2 className="mx-auto mt-12 max-w-3xl font-display text-[clamp(1.1rem,4vw,25px)] leading-[1.4] text-[color:var(--gold)] md:mt-20">
              SAHAJ Gallery is the artistic extension of NDH House
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-[clamp(1.05rem,1.2vw,1.2rem)] leading-[1.9] text-muted-foreground">
              Founded on the belief that meaningful spaces are enriched by
              stories, culture, and art. Emerging from an architectural
              practice, SAHAJ serves as a gallery and creative destination
              where architecture meets art and craftsmanship showcasing
              thoughtfully curated artworks that complement and elevate
              contemporary interiors.
            </p>
            <p className="mx-auto mt-6 max-w-3xl text-[clamp(1.05rem,1.2vw,1.2rem)] leading-[1.9] text-muted-foreground">
              At SAHAJ, every piece is conceived with a designer's perspective,
              bridging art, materiality, and spatial experience. Through
              handcrafted creations, wall art, decorative installations, and
              bespoke artistic expressions, SAHAJ transforms walls into
              narratives and spaces into experiences.
            </p>
          </Reveal>
          <Reveal delay={400} className="shape">
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
              <a
                href="/contact"
                className="inline-flex items-center gap-3 border border-[color:var(--gold)] px-8 py-3 text-[11px] tracking-[0.3em] uppercase text-[color:var(--gold)] transition-all duration-500 hover:bg-[color:var(--gold)] hover:text-background"
              >
                Get in Touch
                <span className="transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PARTNERSHIP STORY */}
      <section className="section-ambient relative border-t border-border/40 px-8 py-24 md:px-14 md:py-56">
        <div className="relative mx-auto max-w-[1100px]">
          <div className="grid gap-16 md:grid-cols-2 md:gap-24">
            <Reveal>
              <p className="kicker">The Collaboration</p>
              <h2 className="mt-8 font-display text-[clamp(1rem,1.4vw,1.4rem)] leading-[1.2] text-[color:var(--gold)] md:whitespace-nowrap">
                STUDIO SHIKSHPATRI <em className="italic">×</em> KARIGARI
                STUDIO
              </h2>
              <div className="mt-10 space-y-5 text-[14px] leading-loose text-muted-foreground">
                <p>
                  SAHAJ Gallery collaborates with artists, designers, and
                  creative studios to bring distinctive art forms into
                  architectural spaces.
                </p>
                <p>
                  <span className="font-semibold text-foreground/90">
                    Studio Shikashapatrika – Calligraphy Series
                  </span>
                  <br />
                  A collection that celebrates the beauty of script, language,
                  and expression through contemporary calligraphic artworks,
                  blending tradition with modern aesthetics.
                </p>
                <p>
                  <span className="font-semibold text-foreground/90">
                    Karigari Studio – Mosaic Series
                  </span>
                  <br />
                  An exploration of craftsmanship and materiality through
                  handcrafted mosaic artworks, creating intricate compositions
                  that add texture, depth, and character to interiors.
                </p>
                <p>
                  Through these collaborations, SAHAJ Gallery seeks to curate
                  and explore innovative artistic mediums and materials,
                  combining the expertise of skilled artists with thoughtful
                  design sensibilities.
                </p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="flex h-full flex-col items-center justify-center gap-10 rounded-sm border border-border bg-card/50 p-12 md:p-16">
                <div className="flex items-center justify-center gap-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center justify-center h-28">
                      <img
                        src={studioLogo}
                        alt="Studio Shikshaptri"
                        className="h-24 w-auto object-contain md:h-28"
                      />
                    </div>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground text-center">
                      STUDIO SHIKSHPATRI
                    </span>
                  </div>
                  <span className="font-display text-4xl text-[color:var(--gold)] self-center">
                    ×
                  </span>
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center justify-center h-28">
                      <img
                        src={karigariLogo}
                        alt="Karigari Studio"
                        className="h-24 w-auto object-contain md:h-28"
                      />
                    </div>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground text-center">
                      KARIGARI STUDIO
                    </span>
                  </div>
                </div>
                <p className="text-center text-[12px] tracking-[0.25em] uppercase text-muted-foreground">
                  Collobration with sahaj
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FENIL VIDEO + TESTIMONIAL */}
      <section className="section-ambient relative border-t border-border/40 px-8 py-24 md:px-14 md:py-56">
        <div className="bloom" />
        <div className="absolute inset-0 glow-warm opacity-30" />
        <div className="relative mx-auto grid max-w-[1400px] items-center gap-16 md:grid-cols-[1.5fr_1fr]">
          <Reveal className="w-full">
            <div className="w-full">
              <VideoPlayer src={fenilVideo} />
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="space-y-6 text-left">
              <p className="font-sans text-[15px] leading-loose text-muted-foreground italic">
                "Some voices carry authority not because of how loudly they
                speak, but because of everything they have come to understand."
              </p>
              <p className="font-sans text-[17px] leading-loose text-foreground/90">
                <span className="font-bold">
                  CA. CS. Dr. Fenil Shah (
                  <a
                    href="https://www.instagram.com/fenil_spark/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--gold)] hover:underline"
                  >
                    @fenil_spark
                  </a>
                  )
                </span>
                , a name that spans across domains, from finance to law, from
                governance to mentorship, brings with him a rare clarity of
                thought.
              </p>
              <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                His reflections on SAHAJ feel less like praise and more like
                recognition, a perspective that sees both value and vision. Not
                just seeing art, but understanding what it stands for.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* DHRUTI VIDEO + TESTIMONIAL */}
      <section className="section-ambient relative border-t border-border/40 px-8 py-24 md:px-14 md:py-56">
        <div className="bloom" />
        <div className="absolute inset-0 glow-warm opacity-30" />
        <div className="relative mx-auto grid max-w-[1400px] items-center gap-16 md:grid-cols-[1fr_1fr]">
          <Reveal delay={200}>
            <div className="space-y-6 text-left">
              <p className="font-sans text-[15px] leading-loose text-muted-foreground italic">
                "An artist's opinion on another artist's work is always a
                confession."
              </p>
              <p className="font-sans text-[17px] leading-loose text-foreground/90">
                <strong>
                  Dhruti Panchal (
                  <a
                    href="https://www.instagram.com/dhruti_artfromheart/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--gold)] hover:underline"
                  >
                    @dhruti_artfromheart
                  </a>
                  ) is one such voice in Ahmedabad's art landscape. Her
                  appreciation of SAHAJ is meaningful not simply because it is
                  praise, but because it is recognition one artist recognizing
                  the sincerity, effort, and intention behind the work of
                  fellow makers.
                </strong>
              </p>
              <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                For us, SAHAJ has always been more than a gallery. It is an
                evolving dialogue between art, craftsmanship, architecture, and
                the people who engage with them. It is a space where materials
                become stories, where hands shape ideas into tangible
                expressions, and where creativity finds a place to belong.
              </p>
              <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                Moments like these reaffirm our purpose. They remind us that
                meaningful work is seen, understood, and valued by those who
                share the same commitment to creating with authenticity and
                heart.
              </p>
            </div>
          </Reveal>
          <Reveal className="w-full flex justify-end">
            <div className="w-full max-w-[380px]">
              <VideoPlayer src={dhrutiVideo} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* THE HANDS OF SAHAJ */}
      <section className="section-ambient relative border-t border-border/40 px-8 py-24 md:px-14 md:py-56">
        <div className="bloom" />
        <div className="absolute inset-0 glow-warm opacity-30" />
        <div className="relative mx-auto grid max-w-[1400px] items-center gap-16 md:grid-cols-[1.5fr_1fr]">
          <Reveal className="w-full">
            <div className="w-full">
              <VideoPlayer src={handsVideo} />
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="space-y-6 text-left">
              <h3 className="font-display text-2xl leading-snug text-[var(--gold)]">
                Hands of SAHAJ
              </h3>
              <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                An imprint of passion, crafted by the artists of SAHAJ.
              </p>
              <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                Every creation carries the touch of its maker a reflection of
                skill, dedication, and artistic spirit. More than an object,
                each piece tells a story, shaped not only by hands but also by
                imagination, emotion, and heart.
              </p>
              <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                At SAHAJ, we celebrate the human connection behind every
                artwork, where craftsmanship transforms materials into
                meaningful expressions. Through the hands of our artists, ideas
                become creations that enrich spaces, evoke emotions, and
                inspire lasting connections.
              </p>
              <p className="font-sans text-[15px] leading-loose text-muted-foreground">
                Nehal Rathod · Chintu Bhalani · Hetakshi Chauhan · Hansni
                Sharma · Arya Jadav · Pooja Bhavsar
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="section-ambient relative border-t border-border/40 px-8 py-24 md:px-14 md:py-56">
        <div className="relative mx-auto max-w-[1400px]">
          <Reveal>
            <h2 className="mt-8 text-center font-display text-[clamp(2rem,4vw,4rem)] leading-[1.05]">
              The Essence of Sahaj
            </h2>
          </Reveal>
          <div className="mt-20 grid gap-12 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "The Creative Circle",
                body: "A space to connect, collaborate, and build a creative community. A platform where ideas are exchanged, relationships are nurtured, and meaningful artistic partnerships take shape",
              },
              {
                n: "02",
                title: "Vision to Artwork",
                body: "We don't simply place art in spaces  we curate stories. Through thoughtful conversations, we translate your vision, personality, and aspirations into meaningful artworks that belong to the architecture and the people who experience it.",
              },
              {
                n: "03",
                title: "White Glove Installation",
                body: "From our studio to your space, every detail is thoughtfully managed. With meticulous handling, precision installation, and seamless execution, we ensure each artwork finds its perfect place  because exceptional art deserves an exceptional experience.",
              },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 120} className="h-full">
                <div className="group h-full border border-border p-10 transition-all duration-500 hover:border-[color:var(--gold)] hover:bg-card/30">
                  <p className="text-5xl font-display text-[color:var(--gold)] opacity-40">
                    {s.n}
                  </p>
                  <h3 className="mt-8 font-display text-2xl leading-snug">
                    {s.title}
                  </h3>
                  <p className="mt-6 text-[14px] leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* THE SPACE */}
      <section className="section-ambient relative border-t border-border/40 px-8 pt-40 pb-8 md:px-14 md:pt-56 md:pb-12">
        <div className="absolute inset-0 glow-warm opacity-25" />
        <div className="relative mx-auto max-w-[1100px]">
          <div className="grid gap-16 md:grid-cols-2 md:gap-24">
            <Reveal className="flex items-center md:pt-8">
              <div className="space-y-8 text-[14px] leading-loose text-foreground/80">
                <div>
                  <p className="kicker mb-3">Address</p>
                  <p>
                    Shop - 02, Palak Prime, Ambli Rd
                    <br />
                    Opp. DoubleTree by Hilton Hotel
                    <br />
                    Nr. Antriksh Colony BRTS Bus Stand
                    <br />
                    Ambli, Ahmedabad, Gujarat 380058
                  </p>
                  <a
                    href="https://www.google.com/maps?um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KWNN2o4_m145MTOJ5URhNfzK&daddr=Shop+-+02,+Palak+Prime,+Ambli+Rd,+opp.+DoubleTree+by+Hilton+Hotel,+nr.+Antriksh+colony+BRTS+Bus+Stand,+Ambli,+Ahmedabad,+Gujarat+380058"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-4 inline-flex items-center gap-2 border border-border px-4 py-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground transition-all duration-500 hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Get Directions
                    <span className="transition-transform duration-500 group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                </div>
                <div>
                  <p className="kicker mb-3">Hours</p>
                  <p>Opens at 10:30 AM · Closes at 7:30 PM</p>
                </div>
                <div>
                  <p className="kicker mb-3">Contact</p>
                  <p>
                    <a
                      href="tel:+919510788933"
                      className="hover:text-[color:var(--gold)] transition-colors"
                    >
                      +91 95107 88933
                    </a>
                    <br />
                    <a
                      href="mailto:info@sahajgallery.in"
                      className="hover:text-[color:var(--gold)] transition-colors"
                    >
                      info@sahajgallery.in
                    </a>
                  </p>
                  <a
                    href="https://www.instagram.com/sahajgallery/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-4 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-[color:var(--gold)]"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span className="text-[11px] tracking-[0.2em] uppercase">
                      Instagram
                    </span>
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="flex h-full flex-col rounded-sm border border-border bg-card/50 p-6 md:p-10">
                <img
                  src={sahajGallery}
                  alt="Sahaj Gallery interior"
                  className="w-full h-full object-cover rounded-sm"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/30 px-8 py-4 md:px-14">
        <div className="flex items-center justify-between">
          <p className="font-display text-xl tracking-[0.3em]">
            SAHAJ GALLERY
          </p>
          <img
            src={ndhLogo}
            alt="NDH House"
            className="h-12 w-auto opacity-80"
          />
        </div>
      </footer>
    </main>
  );
}

export default Sahaj;
