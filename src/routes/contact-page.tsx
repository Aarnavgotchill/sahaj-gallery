import { useState, lazy, Suspense } from "react";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { ndhLogo4K as ndhLogo } from "@/assets/assets";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";

const AdminPortal = lazy(() =>
  import("@/components/AdminPortal").then((m) => ({ default: m.AdminPortal })),
);

const inquiryTypes = [
  "Artwork Purchase",
  "Artist Collaboration",
  "Exhibition Inquiry",
  "Private Event Booking",
  "Gallery Visit",
  "General Inquiry",
] as const;

const qrLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/sahajgallery/",
    src: "/qr/instagram.png",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/919510788933",
    src: "/qr/whatsapp.png",
  },
  {
    label: "Leave a Review",
    href: "https://g.page/r/CTOJ5URhNfzKEBM/review",
    src: "/qr/review.png",
  },
] as const;

function Contact() {
  const [isAdmin, setIsAdmin] = useState(
    () => sessionStorage.getItem("sahaj_admin") === "true",
  );

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: Record<string, string>) => {
    if (
      data.name === "Sahaj Admin" &&
      data.email === "contact@sahajgallery.com" &&
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
    return (
      <Suspense fallback={null}>
        <AdminPortal
          onLogout={() => {
            sessionStorage.removeItem("sahaj_admin");
            setIsAdmin(false);
          }}
        />
      </Suspense>
    );
  }

  return (
    <main className="min-h-screen text-foreground flex flex-col overflow-x-hidden">
      <div className="border-b border-border/30">
        <Nav />
      </div>
      <div className="flex-1 flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 px-8 md:px-14 pt-28 md:pt-32 pb-[26px]">
        <Reveal className="flex items-center justify-start">
          <div className="font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.2]">
            <p className="text-left">
              Send us a message.{" "}
              <em className="italic text-[var(--gold)]">
                We'd love to hear
              </em>
            </p>
            <p className="text-left md:text-center">from you.</p>
          </div>
        </Reveal>
        <Reveal delay={150} className="flex items-start pt-4 md:pt-[100px]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full rounded-sm border border-border p-6 md:p-10"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground">
              Personal Information
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  {...register("name", { required: true })}
                  className="mt-2 w-full border-0 border-b border-border bg-transparent pb-2 text-[15px] text-foreground outline-none transition-colors duration-500 focus:border-[var(--gold)]"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email", { required: true })}
                  className="mt-2 w-full border-0 border-b border-border bg-transparent pb-2 text-[15px] text-foreground outline-none transition-colors duration-500 focus:border-[var(--gold)]"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register("phone", { required: true })}
                  className="mt-2 w-full border-0 border-b border-border bg-transparent pb-2 text-[15px] text-foreground outline-none transition-colors duration-500 focus:border-[var(--gold)]"
                />
              </div>
              <div>
                <label
                  htmlFor="inquiryType"
                  className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground"
                >
                  Inquiry Type
                </label>
                <select
                  id="inquiryType"
                  {...register("inquiryType", { required: true })}
                  className="mt-2 w-full border-0 border-b border-border bg-transparent pb-2 text-[15px] text-foreground outline-none transition-colors duration-500 focus:border-[var(--gold)] font-sans"
                  style={{ WebkitAppearance: "none", MozAppearance: "none" }}
                >
                  <option value="" className="font-sans bg-[#3a2a4e] text-foreground">
                    Select an option
                  </option>
                  {inquiryTypes.map((t) => (
                    <option key={t} value={t} className="font-sans bg-[#3a2a4e] text-foreground">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={3}
                  {...register("message", { required: true })}
                  className="mt-2 w-full resize-none border-0 border-b border-border bg-transparent pb-2 text-[15px] text-foreground outline-none transition-colors duration-500 focus:border-[var(--gold)]"
                />
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                type="submit"
                className="group relative inline-flex items-center gap-3 overflow-hidden border border-[var(--gold)] px-6 md:px-12 py-4 text-[11px] tracking-[0.3em] uppercase text-[var(--gold)] transition-all duration-500 hover:bg-[var(--gold)] hover:text-background"
              >
                <span className="relative z-10">Send Inquiry</span>
                <Send className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                <span className="absolute inset-0 translate-y-full bg-[var(--gold)] transition-transform duration-500 group-hover:translate-y-0" />
              </button>
            </div>
          </form>
        </Reveal>
      </div>
      <div className="px-8 md:px-14 pb-16 md:pb-24">
        <Reveal className="text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
            Scan to Connect
          </p>
          <h2 className="mt-3 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.2]">
            Sahaj, <em className="italic text-[var(--gold)]">in your hands</em>
          </h2>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          {qrLinks.map((qr, i) => (
            <Reveal key={qr.label} delay={i * 120}>
              <a
                href={qr.href}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center border border-border/30 p-6 text-center transition-colors duration-500 hover:border-[var(--gold)]"
              >
                <span className="flex h-32 w-32 items-center justify-center rounded-sm bg-white p-2">
                  <img
                    src={qr.src}
                    alt={`${qr.label} QR code`}
                    draggable={false}
                    className="h-full w-full select-none"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </span>
                <span className="mt-5 text-[10px] tracking-[0.3em] uppercase text-[var(--gold)]">
                  {qr.label}
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
      <footer className="border-t border-border/30 px-8 py-4 md:px-14">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg md:text-xl tracking-[0.3em] text-[#C8A86E]">SAHAJ GALLERY</p>
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

export default Contact;
