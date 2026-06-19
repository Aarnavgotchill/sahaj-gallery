import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SUPABASE_URL = "https://hjmljssybarcahnxvcrf.supabase.co";
const SUPABASE_ANON_KEY =
  "sb_publishable_eCSZ0rQPZF-GoJPjbColZQ_F-ztbhnm";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const GOOGLE_DRIVE_LINK =
  "https://drive.google.com/drive/folders/1tbnA8k-aKQ5vYCD_LJQnZrmr8C4tQddc?usp=drive_link";

interface CataloguePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CataloguePopup({
  open,
  onOpenChange,
}: CataloguePopupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!name.trim()) return "Name is required";
    if (!email.trim()) return "Email ID is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return "Enter a valid email address";
    if (!mobile.trim()) return "Mobile number is required";
    if (!/^\d{10}$/.test(mobile.trim()))
      return "Enter a valid 10-digit mobile number";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setLoading(true);

    try {
      const trimmedName = name.trim();
      const emailValue = email.trim();
      const mobileValue = mobile.trim();

      // Try to insert with incrementing suffix until we find a free unique_name
      let inserted = false;
      let attempt = 1;

      while (!inserted) {
        const uniqueName = attempt === 1 ? trimmedName : `${trimmedName}${attempt}`;

        const { error: insertError } = await supabase
          .from("users")
          .insert({
            name: trimmedName,
            email: emailValue,
            mobile: mobileValue,
            unique_name: uniqueName,
          });

        if (!insertError) {
          inserted = true;
        } else if (insertError.code === "23505") {
          // unique_violation — name already taken, try next suffix
          attempt++;
        } else {
          throw insertError;
        }
      }

      onOpenChange(false);
      window.open(GOOGLE_DRIVE_LINK, "_blank", "noopener,noreferrer");
    } catch (err) {
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? (err as { message: string }).message
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border/50" style={{ background: "#413152" }}>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-[0.15em] text-[var(--gold)] text-center">
            Full Catalogue
          </DialogTitle>
          <DialogDescription className="text-center text-sm tracking-[0.08em] text-muted-foreground">
            Enter your details to receive the full catalogue.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-1.5">
              Name <span className="text-[var(--gold)]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-transparent border border-border/60 rounded px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-[var(--gold)]"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-1.5">
              Email ID <span className="text-[var(--gold)]">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-transparent border border-border/60 rounded px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-[var(--gold)]"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-1.5">
              Mobile Number <span className="text-[var(--gold)]">*</span>
            </label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="1234567890"
              className="w-full bg-transparent border border-border/60 rounded px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-[var(--gold)]"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 tracking-[0.05em]">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 border border-border/60 text-muted-foreground rounded py-2.5 text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:border-muted-foreground hover:text-foreground cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 border border-[var(--gold)] text-[var(--gold)] rounded py-2.5 text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[var(--gold)] hover:text-background disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Submitting..." : "Receive"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
