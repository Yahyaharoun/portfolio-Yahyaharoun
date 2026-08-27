"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { CvData } from "@/types";

export default function CvForm({ cv }: { cv: CvData | null }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skills, setSkills] = useState(cv?.skills?.join(", ") ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const payload = {
      full_name: String(formData.get("full_name") || ""),
      professional_title: String(formData.get("professional_title") || ""),
      summary: String(formData.get("summary") || ""),
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      languages: cv?.languages ?? [{ name: "Français", level: "Natif" }, { name: "Anglais", level: "Professionnel" }],
      education: cv?.education ?? [],
      is_active: true,
    };

    const { error: dbError } = cv
      ? await supabase.from("cv_data").update(payload).eq("id", cv.id)
      : await supabase.from("cv_data").insert(payload);

    setLoading(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }

    router.refresh();
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-muted px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="mb-2 block text-sm text-foreground/70">Nom complet</label>
        <input name="full_name" required defaultValue={cv?.full_name ?? "Yahya Haroun"} className={inputClass} />
      </div>
      <div>
        <label className="mb-2 block text-sm text-foreground/70">Titre professionnel</label>
        <input
          name="professional_title"
          required
          defaultValue={cv?.professional_title ?? "Développeur Full Stack"}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm text-foreground/70">Résumé</label>
        <textarea name="summary" rows={4} defaultValue={cv?.summary ?? ""} className={inputClass} />
      </div>
      <div>
        <label className="mb-2 block text-sm text-foreground/70">Compétences (séparées par des virgules)</label>
        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Next.js, React, TypeScript, Supabase..."
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}
