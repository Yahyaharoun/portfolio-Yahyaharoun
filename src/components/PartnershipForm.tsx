"use client";

import { useState } from "react";

const projectTypes = [
  { value: "application_web", label: "Application web" },
  { value: "saas", label: "SaaS" },
  { value: "site_internet", label: "Site internet" },
  { value: "automatisation", label: "Automatisation" },
  { value: "ia", label: "Intelligence artificielle" },
  { value: "cybersecurite", label: "Cybersécurité" },
];

const budgetRanges = [
  { value: "moins_100000", label: "Moins de 100 000 FCFA" },
  { value: "100000_500000", label: "100 000 à 500 000 FCFA" },
  { value: "plus_500000", label: "Plus de 500 000 FCFA" },
];

export default function PartnershipForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/partnership", {
        method: "POST",
        body: formData, // multipart pour supporter la pièce jointe
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Une erreur est survenue");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  const inputClass =
    "rounded-lg border border-white/10 bg-muted px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none w-full";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="first_name" required placeholder="Prénom" className={inputClass} />
        <input name="last_name" required placeholder="Nom" className={inputClass} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="email" type="email" required placeholder="Email" className={inputClass} />
        <input name="phone" placeholder="Téléphone" className={inputClass} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="company" placeholder="Entreprise" className={inputClass} />
        <input name="website" placeholder="Site web" className={inputClass} />
      </div>

      <div>
        <label className="mb-2 block text-sm text-foreground/70">Type de projet</label>
        <select name="project_type" required className={inputClass}>
          <option value="">Sélectionner...</option>
          {projectTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm text-foreground/70">Budget estimé</label>
        <select name="budget_range" required className={inputClass}>
          <option value="">Sélectionner...</option>
          {budgetRanges.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>
      </div>

      <textarea
        name="description"
        required
        rows={5}
        placeholder="Décrivez votre besoin"
        className={inputClass}
      />

      <div>
        <label className="mb-2 block text-sm text-foreground/70">Pièce jointe (optionnel)</label>
        <input
          name="attachment"
          type="file"
          className="w-full text-sm text-foreground/70 file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-white"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "loading" ? "Envoi en cours..." : "Envoyer la demande"}
      </button>
      {status === "success" && (
        <p className="text-sm text-green-400">Demande envoyée. Réponse sous 48h ouvrées.</p>
      )}
      {status === "error" && <p className="text-sm text-red-400">{errorMsg}</p>}
    </form>
  );
}
