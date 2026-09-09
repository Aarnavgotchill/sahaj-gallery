import { useState, lazy, Suspense } from "react";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { ndhLogo4K as ndhLogo } from "@/assets/assets";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import { usePortraitNoScroll } from "@/lib/portrait";

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

function Contact() {
  usePortraitNoScroll();
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
      <section className="flex-1 px-5 pb-16 pt-32 sm:px-8 sm:pt-36 md:px-14 md:pb-24 md:pt-40">
        <div className="mx-auto grid max-w-[1240px] items-start gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-24">
        <Reveal className="flex items-center">
          <div className="mx-auto w-full max-w-[470px] text-center lg:mx-0 lg:text-left">
            <p className="text-[10px] tracking-[0.42em] uppercase text-muted-foreground">
              Contact Sahaj Gallery
            </p>
            <h1 className="mt-5 font-display text-[clamp(2rem,4vw,4rem)] leading-[1.08]">
              Begin a thoughtful
              <em className="mt-1 block italic text-[var(--gold)]">conversation.</em>
            </h1>
            <p className="mx-auto mt-7 max-w-[430px] text-[15px] leading-[1.9] text-muted-foreground lg:mx-0">
              Whether you are discovering an artwork, planning a visit, or exploring a collaboration, our team would be pleased to hear from you.
            </p>
            <div className="mt-10 border-t border-border/40 pt-8 text-[14px] leading-[1.9] text-muted-foreground">
              <p className="text-[10px] tracking-[0.32em] uppercase text-[var(--gold)]">Visit or reach us</p>
              <p className="mt-4">Ahmedabad, Gujarat</p>
              <a className="block transition-colors hover:text-[var(--gold)]" href="tel:+919510788933">+91 95107 88933</a>
              <a className="block transition-colors hover:text-[var(--gold)]" href="mailto:contact@sahajgallery.com">contact@sahajgallery.com</a>
            </div>
          </div>
        </Reveal>
        <Reveal delay={150} className="flex items-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full rounded-sm border border-border/60 bg-card/15 p-6 shadow-[0_24px_80px_rgba(20,10,32,0.12)] sm:p-8 md:p-10"
          >
            <div className="border-b border-border/40 pb-6">
              <div>
                <p className="text-[10px] tracking-[0.38em] uppercase text-muted-foreground">Inquiry</p>
                <h2 className="mt-2 font-display text-2xl text-foreground">Tell us what brings you here</h2>
              </div>
            </div>
            <div className="mt-7 grid gap-x-8 gap-y-6 md:grid-cols-2">
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
              <div className="md:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  {...register("message", { required: true })}
                  className="mt-2 w-full resize-none border-0 border-b border-border bg-transparent pb-2 text-[15px] text-foreground outline-none transition-colors duration-500 focus:border-[var(--gold)]"
                />
              </div>
            </div>
            <div className="mt-8 text-center md:text-left">
              <button
                type="submit"
                className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden border border-[var(--gold)] px-6 py-4 text-[11px] tracking-[0.3em] uppercase text-[var(--gold)] transition-all duration-500 hover:bg-[var(--gold)] hover:text-background md:w-auto md:px-12"
              >
                <span className="relative z-10">Send Inquiry</span>
                <Send className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                <span className="absolute inset-0 translate-y-full bg-[var(--gold)] transition-transform duration-500 group-hover:translate-y-0" />
              </button>
            </div>
          </form>
        </Reveal>
        </div>
      </section>
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
