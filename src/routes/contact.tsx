import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import ndhLogo from "@/assets/NDH_logo_4K.png";
import { AdminPortal } from "@/components/AdminPortal";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact   Sahaj Gallery" },
      { name: "description", content: "Get in touch with Sahaj Gallery." },
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

function Contact() {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem("sahaj_admin") === "true");

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
    <main className="h-screen overflow-hidden bg-background text-foreground flex flex-col">
      <div className="border-b border-border/30">
        <Nav />
      </div>
      <div className="flex-1 grid md:grid-cols-2 gap-8 md:gap-12 px-[42px] md:px-12 pt-8 pb-[26px]">
        <div className="flex items-center justify-start">
          <h1 className="font-display text-left text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.2] max-w-[380px]">
            Send us a message{" "}
            <em className="italic text-[var(--gold)]">we'd love to hear</em>
            <br />
            <span className="block">from you.</span>
          </h1>
        </div>
        <div className="flex items-start pt-[92px] md:pt-[100px]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full rounded-sm border border-border bg-card/30 p-6 backdrop-blur-sm md:p-10"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground">Personal Information</p>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Full Name</label>
                <input
                  id="name"
                  {...register("name", { required: true })}
                  className="mt-2 w-full border-0 border-b border-border bg-transparent pb-2 text-[15px] text-foreground outline-none transition-colors duration-500 focus:border-[var(--gold)]"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Email Address</label>
                <input
                  id="email"
                  type="email"
                  {...register("email", { required: true })}
                  className="mt-2 w-full border-0 border-b border-border bg-transparent pb-2 text-[15px] text-foreground outline-none transition-colors duration-500 focus:border-[var(--gold)]"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  {...register("phone", { required: true })}
                  className="mt-2 w-full border-0 border-b border-border bg-transparent pb-2 text-[15px] text-foreground outline-none transition-colors duration-500 focus:border-[var(--gold)]"
                />
              </div>
              <div>
                <label htmlFor="inquiryType" className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Inquiry Type</label>
                <select
                  id="inquiryType"
                  {...register("inquiryType", { required: true })}
                  className="mt-2 w-full border-0 border-b border-border bg-background pb-2 text-[15px] text-foreground outline-none transition-colors duration-500 focus:border-[var(--gold)] font-sans"
                >
                  <option value="">Select an option</option>
                  {inquiryTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Message</label>
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
      <footer className="border-t border-border/30 px-8 py-4 md:px-14">
        <div className="flex items-center justify-between">
          <p className="font-display text-xl tracking-[0.3em]">SAHAJ GALLERY</p>
          <img src={ndhLogo} alt="NDH House" className="h-12 w-auto opacity-80" />
        </div>
      </footer>
    </main>
  );
}
