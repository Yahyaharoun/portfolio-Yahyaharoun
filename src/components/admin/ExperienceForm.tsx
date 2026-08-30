"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Experience } from "@/types";
import { Loader2 } from "lucide-react";
import { saveExperience } from "@/app/admin/actions";

export default function ExperienceForm({ experience, onSuccess }: { experience?: Experience, onSuccess?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isEdit = Boolean(experience);
  const [isCurrent, setIsCurrent] = useState(experience?.is_current || false);
  const [title, setTitle] = useState(experience?.title || "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      title,
      organization: String(formData.get("organization") || "") || null,
      type: formData.get("type") as Experience["type"],
      start_date: String(formData.get("start_date") || ""),
      end_date: isCurrent ? null : (String(formData.get("end_date") || "") || null),
      is_current: isCurrent,
      is_published: formData.get("is_published") === "on",
      // Champs avancés
      description: showAdvanced ? String(formData.get("description") || "") : (experience?.description || ""),
    };

    if (!payload.start_date) {
      setError("La date de début est requise.");
      setLoading(false);
      return;
    }

    try {
      await saveExperience(payload, experience?.id);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/experiences");
      }
      
      if (!isEdit) {
        setTitle("");
        setIsCurrent(false);
        setShowAdvanced(false);
        form.reset();
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-accent focus:bg-black/40 focus:ring-1 focus:ring-accent focus:outline-none transition-all";
  const labelClass = "mb-1.5 block text-xs font-semibold text-foreground/70 uppercase tracking-wider";

  return (
    <div className="rounded-3xl border border-white/10 bg-muted/30 backdrop-blur-md p-5 sm:p-6 shadow-xl">
      <h2 className="mb-6 text-xl font-bold text-foreground">
        {isEdit ? "Modifier l'expérience" : "Nouvelle expérience"}
      </h2>
      
      <form id="experience-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className={labelClass}>Titre du poste / formation *</label>
          <input name="title" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Ex: Développeur Full Stack" />
        </div>

        <div>
          <label className={labelClass}>Organisation / École *</label>
          <input name="organization" required defaultValue={experience?.organization ?? ""} className={inputClass} placeholder="Ex: Entreprise XYZ" />
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Type</label>
            <select name="type" defaultValue={experience?.type || "projet"} className={inputClass}>
              <option value="projet" className="bg-background">Projet</option>
              <option value="stage" className="bg-background">Stage</option>
              <option value="entrepreneuriat" className="bg-background">Entrepreneuriat</option>
              <option value="formation" className="bg-background">Formation</option>
              <option value="autre" className="bg-background">Autre</option>
            </select>
          </div>
          <div className="flex flex-col justify-end pb-2">
            <label className="flex items-center gap-2.5 text-sm text-foreground cursor-pointer">
              <input type="checkbox" name="is_published" defaultChecked={experience ? (experience as any).is_published !== false : true} className="h-4 w-4 rounded border-white/10 bg-black/20 text-accent focus:ring-accent focus:ring-offset-background" />
              <span>Publié publiquement</span>
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Date de début *</label>
            <input type="date" name="start_date" required defaultValue={experience?.start_date || ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Date de fin</label>
            <div className="flex flex-col gap-2">
              <input type="date" name="end_date" defaultValue={experience?.end_date || ""} disabled={isCurrent} className={`${inputClass} ${isCurrent ? 'opacity-50 cursor-not-allowed' : ''}`} />
              <label className="flex items-center gap-2 text-xs text-foreground/80 cursor-pointer">
                <input type="checkbox" checked={isCurrent} onChange={(e) => setIsCurrent(e.target.checked)} className="h-3 w-3 rounded text-accent focus:ring-accent" />
                <span>Poste actuel (En cours)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Champs Avancés */}
        <div className="border-t border-white/5 pt-4">
          <button 
            type="button" 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-medium text-accent hover:text-accent/80 transition-colors"
          >
            {showAdvanced ? "− Masquer les détails avancés" : "+ Ajouter une description détaillée (optionnel)"}
          </button>
          
          {showAdvanced && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className={labelClass}>Description des missions</label>
              <textarea name="description" rows={3} defaultValue={experience?.description ?? ""} className={inputClass} placeholder="Missions, apprentissages, technologies..." />
            </div>
          )}
        </div>

        {error && <div className="rounded-xl bg-red-500/10 p-3 border border-red-500/20 text-sm text-red-500">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white transition-all hover:bg-accent/90 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
          {loading ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Ajouter l'expérience"}
        </button>
      </form>
    </div>
  );
}
