"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Une erreur est survenue");
      }

      // Track successful submission
      trackEvent("contact_form_submitted");

      setStatus("success");
      form.reset();
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      <div className="grid gap-4 grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="first_name" className="text-sm font-medium text-foreground/80 pl-1">Prénom</label>
          <input
            id="first_name"
            name="first_name"
            required
            placeholder="Ex: John"
            className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-accent focus:bg-background focus:ring-1 focus:ring-accent focus:outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="last_name" className="text-sm font-medium text-foreground/80 pl-1">Nom</label>
          <input
            id="last_name"
            name="last_name"
            required
            placeholder="Ex: Doe"
            className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-accent focus:bg-background focus:ring-1 focus:ring-accent focus:outline-none transition-all"
          />
        </div>
      </div>
      
      <div className="grid gap-4 grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground/80 pl-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="john.doe@example.com"
            className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-accent focus:bg-background focus:ring-1 focus:ring-accent focus:outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-foreground/80 pl-1">Téléphone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            defaultValue="+237 "
            className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-accent focus:bg-background focus:ring-1 focus:ring-accent focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium text-foreground/80 pl-1">Sujet</label>
        <input
          id="subject"
          name="subject"
          placeholder="De quoi souhaitez-vous parler ?"
          className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-accent focus:bg-background focus:ring-1 focus:ring-accent focus:outline-none transition-all"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-foreground/80 pl-1">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Votre message..."
          className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-accent focus:bg-background focus:ring-1 focus:ring-accent focus:outline-none transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="group flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 text-sm font-semibold text-white shadow-[0_0_20px_rgba(109,93,252,0.3)] transition-all hover:bg-accent/90 hover:shadow-[0_0_25px_rgba(109,93,252,0.5)] disabled:opacity-70 active:scale-[0.98]"
      >
        {status === "loading" ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : status === "success" ? (
          <>
            <CheckCircle2 size={18} /> Envoyé
          </>
        ) : (
          <>
            Envoyer le message
            <Send size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </>
        )}
      </button>

      {status === "error" && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20"
        >
          <AlertCircle size={16} />
          {errorMsg}
        </motion.div>
      )}
    </form>
  );
}
