import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import ndhLogo from "@/assets/NDH_logo_4K.png";
import { AdminPortal } from "@/components/AdminPortal";
import { Reveal } from "@/components/Reveal";
import { useForm } from "react-hook-form";
import { Send, MapPin, Clock, Phone, Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Sahaj Gallery" },
      { name: "description", content: "Get in touch with Sahaj Gallery. Submit an inquiry for art purchases, collaborations, exhibitions, and more." },
    ],
  }),
  component: Contact,
});

const inquiryTypes = [
  "Artwork Purchase",
  "Artist Collaboration",
  "Exhibition Inquiry",
  "Private Event Booking",
  "Gallery Visit",
  "General Inquiry",
] as const;

const features = [
  {
    title: "Curated Art Experiences",
    desc: "Each interaction is shaped around your vision — whether acquiring a piece or commissioning something entirely new.",
    icon: "✦",
  },
  {
    title: "Emerging & Established Artists",
    desc: "We represent voices from across the creative spectrum — from rising talents to masters with decades of practice.",
    icon: "✦",
  },
  {
    title: "Private Exhibitions & Events",
    desc: "Intimate viewings, curated walkthroughs, and exclusive previews tailored for collectors and connoisseurs.",
    icon: "✦",
  },
];

function Contact() {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem("sahaj_admin") === "true");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: Record<string, string>) => {
    if (
      data.name === "Sahaj Admin" &&
      data.email === "sahaj@palakprime" &&
      data.phone === "6541" &&
      data.message === "these is sahaj admin 6541"
    ) {
      sessionStorage.setItem("sahaj_admin", "true");
      setIsAdmin(true);
      return;
    }
    reset();
  };

  if (isAdmin) {
    return <AdminPortal onLogout={() => { sessionStorage.removeItem("sahaj_admin"); setIsAdmin(false); }} />;
  }

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />

      {/* HERO */}
      <section className="relative flex min-h-[80svh] items-center justify-center overflow-hidden px-8 pt-32 md:px-14">
        <div className="bloom" />
        <div className="absolute inset-0 glow-warm opacity-40" />

        {/* Floating abstract shapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-32 top-32 h-80 w-80 rounded-full border border-[var(--gold)]/10 animate-[float_20s_ease-in-out_infinite]" />
          <div className="absolute -right-20 top-1/3 h-64 w-64 rounded-full border border-[var(--gold)]/8 animate-[float_25s_ease-in-out_infinite_reverse]" />
          <div className="absolute bottom-1/4 left-1/4 h-48 w-48 rounded-full bg-[var(--gold)]/5 animate-[float_15s_ease-in-out_infinite_2s]" />
          <div className="absolute right-1/4 top-1/4 h-32 w-32 rounded-full bg-white/[0.02] animate-[float_18s_ease-in-out_infinite_1s]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[900px] text-center">
          <Reveal>
            <p className="kicker tracking-[0.4em]">Get in Touch</p>
            <h1 className="mt-10 font-display text-balance text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.1]">
              Let's Create Meaningful{" "}
              <em className="italic text-[var(--gold)]">Artistic Connections</em>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Whether you're an art collector, artist, curator, or enthusiast, we'd love to hear from you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* INQUIRY FORM */}
      <section className="section-ambient relative px-8 py-24 md:px-14 md:py-40">
        <div className="absolute inset-0 glow-warm opacity-20" />
        <div className="relative mx-auto max-w-[1100px]">
          <Reveal>
            <p className="kicker">Send Us a Message</p>
            <h2 className="mt-8 font-display text-[clamp(1.8rem,3.5vw,3.5rem)] leading-[1.1]">
              We'd love to hear{" "}
              <em className="italic text-[var(--gold)]">from you</em>.
            </h2>
          </Reveal>

          <div className="mt-16">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-sm border border-border bg-card/30 p-8 backdrop-blur-sm md:p-14"
            >
              <div className="grid gap-10 md:grid-cols-2">
                {/* Personal Info */}
                <div className="space-y-8">
                  <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground">Personal Information</p>
                  <div>
                    <label htmlFor="name" className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Full Name</label>
                    <input
                      id="name"
                      {...register("name", { required: true })}
                      className="mt-3 w-full border-0 border-b border-border bg-transparent pb-3 text-[15px] text-foreground outline-none transition-colors duration-500 focus:border-[var(--gold)]"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      {...register("email", { required: true })}
                      className="mt-3 w-full border-0 border-b border-border bg-transparent pb-3 text-[15px] text-foreground outline-none transition-colors duration-500 focus:border-[var(--gold)]"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Phone Number <span className="text-muted-foreground/50">(Optional)</span></label>
                    <input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      className="mt-3 w-full border-0 border-b border-border bg-transparent pb-3 text-[15px] text-foreground outline-none transition-colors duration-500 focus:border-[var(--gold)]"
                    />
                  </div>
                </div>

                {/* Inquiry Type + Subject */}
                <div className="space-y-8">
                  <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground">Inquiry Details</p>
                  <div>
                    <label htmlFor="inquiryType" className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Inquiry Type</label>
                    <select
                      id="inquiryType"
                      {...register("inquiryType", { required: true })}
                      className="mt-3 w-full border-0 border-b border-border bg-background pb-3 text-[15px] text-foreground outline-none transition-colors duration-500 focus:border-[var(--gold)]"
                    >
                      <option value="">Select an option</option>
                      {inquiryTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Subject</label>
                    <input
                      id="subject"
                      {...register("subject", { required: true })}
                      className="mt-3 w-full border-0 border-b border-border bg-transparent pb-3 text-[15px] text-foreground outline-none transition-colors duration-500 focus:border-[var(--gold)]"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="mt-10">
                <label htmlFor="message" className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  {...register("message", { required: true })}
                  className="mt-3 w-full resize-none border-0 border-b border-border bg-transparent pb-3 text-[15px] text-foreground outline-none transition-colors duration-500 focus:border-[var(--gold)]"
                />
              </div>

              {/* Upload */}
              <div className="mt-10">
                <label htmlFor="upload" className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                  Upload Artwork / Reference Image / Document <span className="text-muted-foreground/50">(Optional)</span>
                </label>
                <div className="mt-3 flex items-center gap-4">
                  <label className="group cursor-pointer border border-border px-5 py-3 text-[11px] tracking-[0.2em] uppercase text-muted-foreground transition-all duration-500 hover:border-[var(--gold)] hover:text-[var(--gold)]">
                    Choose File
                    <input
                      id="upload"
                      type="file"
                      {...register("upload")}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-muted-foreground/60">No file chosen</span>
                </div>
              </div>

              {/* Submit */}
              <div className="mt-14 text-center">
                <button
                  type="submit"
                  className="group relative inline-flex items-center gap-3 overflow-hidden border border-[var(--gold)] px-12 py-4 text-[11px] tracking-[0.3em] uppercase text-[var(--gold)] transition-all duration-500 hover:bg-[var(--gold)] hover:text-background"
                >
                  <span className="relative z-10">Send Inquiry</span>
                  <Send className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                  <span className="absolute inset-0 translate-y-full bg-[var(--gold)] transition-transform duration-500 group-hover:translate-y-0" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* VISIT + WHY CONNECT */}
      <section className="section-ambient relative border-t border-border/40 px-8 py-24 md:px-14 md:py-40">
        <div className="absolute inset-x-0 top-0 h-1/2 glow-warm opacity-30" />
        <div className="relative mx-auto max-w-[1400px]">
          <div className="grid gap-20 md:grid-cols-2 md:gap-24">
            {/* Visit Us */}
            <Reveal>
              <p className="kicker">Visit Us</p>
              <div className="mt-10 space-y-8">
                <div className="flex items-start gap-5">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gold)]" />
                  <div>
                    <p className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground">Address</p>
                    <p className="mt-2 text-[14px] leading-relaxed text-foreground/80">
                      Shop - 02, Palak Prime, Ambli Rd<br />
                      Opp. DoubleTree by Hilton Hotel<br />
                      Nr. Antriksh Colony BRTS Bus Stand<br />
                      Ambli, Ahmedabad, Gujarat 380058
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gold)]" />
                  <div>
                    <p className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground">Opening Hours</p>
                    <p className="mt-2 text-[14px] text-foreground/80">Opens at 10:30 AM · Closes at 7:30 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gold)]" />
                  <div>
                    <p className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground">Phone</p>
                    <p className="mt-2 text-[14px] text-foreground/80">
                      <a href="tel:+919510788933" className="hover:text-[var(--gold)] transition-colors">+91 95107 88933</a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gold)]" />
                  <div>
                    <p className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground">Email</p>
                    <p className="mt-2 text-[14px] text-foreground/80">
                      <a href="mailto:info@sahajgallery.in" className="hover:text-[var(--gold)] transition-colors">info@sahajgallery.in</a>
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Why Connect */}
            <Reveal delay={200}>
              <p className="kicker">Why Connect With Sahaj?</p>
              <div className="mt-10 space-y-6">
                {features.map((f, i) => (
                  <div
                    key={f.title}
                    className="group border border-border p-8 transition-all duration-500 hover:border-[var(--gold)] hover:bg-card/30"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <span className="text-2xl text-[var(--gold)]">{f.icon}</span>
                    <h3 className="mt-4 font-display text-xl leading-snug">{f.title}</h3>
                    <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{f.desc}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="section-ambient relative border-t border-border/40">
        <div className="mx-auto max-w-[1600px] px-8 py-16 md:px-14 md:py-24">
          <Reveal>
            <a
              href="https://www.google.com/maps?um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KWNN2o4_m145MTOJ5URhNfzK&daddr=Shop+-+02,+Palak+Prime,+Ambli+Rd,+opp.+DoubleTree+by+Hilton+Hotel,+nr.+Antriksh+colony+BRTS+Bus+Stand,+Ambli,+Ahmedabad,+Gujarat+380058"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex h-64 items-center justify-center overflow-hidden rounded-sm border border-border bg-card/50 md:h-80"
            >
              <MapPin className="h-10 w-10 text-[var(--gold)] transition-transform duration-500 group-hover:scale-110" />
              <span className="absolute bottom-6 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                Click to open in Google Maps
              </span>
            </a>
          </Reveal>
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
