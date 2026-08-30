"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/types";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { saveProject } from "@/app/admin/actions";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProjectForm({ project, onSuccess }: { project?: Project, onSuccess?: () => void }) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const isEdit = Boolean(project);

  const [title, setTitle] = useState(project?.title || "");
  const [coverUrl, setCoverUrl] = useState(project?.cover_image_url || "");
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError("");

      const fileExt = file.name.split('.').pop();
      const safeName = file.name.replace(`.${fileExt}`, '').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const fileName = `${safeName}_${Math.random().toString(36).substring(2, 10)}_${Date.now()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      setCoverUrl(publicUrl);
    } catch (err: any) {
      console.error("Erreur d'upload:", err);
      setError(`Échec de l'upload : ${err.message || "Erreur inconnue"}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!coverUrl) {
      setError("Veuillez sélectionner une image de couverture.");
      return;
    }
    
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const payload = {
      title,
      slug: project?.slug || slugify(title),
      type: String(formData.get("type") || "Projet"),
      description: String(formData.get("description") || ""),
      demo_url: String(formData.get("demo_url") || "") || null,
      repo_url: String(formData.get("repo_url") || "") || null,
      cover_image_url: coverUrl,
      status: formData.get("status") as Project["status"],
      is_published: formData.get("is_published") === "on",
      is_featured: formData.get("is_featured") === "on",
      // Champs avancés (Étude de cas)
      context: showAdvanced ? String(formData.get("context") || "") : (project?.context || ""),
      solution: showAdvanced ? String(formData.get("solution") || "") : (project?.solution || ""),
      impact: showAdvanced ? String(formData.get("impact") || "") : (project?.impact || ""),
      architecture: showAdvanced ? String(formData.get("architecture") || "") : (project?.architecture || ""),
      challenges: showAdvanced ? String(formData.get("challenges") || "") : (project?.challenges || ""),
      results: showAdvanced ? String(formData.get("results") || "") : (project?.results || ""),
      video_url: showAdvanced ? String(formData.get("video_url") || "") : (project?.video_url || ""),
    };

    try {
      await saveProject(payload, project?.id);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/projects");
      }
      
      // Reset form if it's a new project
      if (!isEdit) {
        setTitle("");
        setCoverUrl("");
        setShowAdvanced(false);
        e.currentTarget.reset();
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
        {isEdit ? "Modifier le projet" : "Nouveau projet"}
      </h2>
      
      <form id="project-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* Upload Image Compact */}
        <div>
          <label className={labelClass}>Image de couverture *</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex h-32 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-white/10 bg-black/20 transition-all hover:border-accent/50 hover:bg-black/40"
          >
            {coverUrl ? (
              <>
                <Image src={coverUrl} alt="Cover" fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-medium bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-md">Changer l'image</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-foreground/40 group-hover:text-accent transition-colors">
                {isUploading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
                <span className="text-xs font-medium">{isUploading ? "Upload..." : "Sélectionner une image"}</span>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Nom du projet *</label>
          <input name="title" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Ex: Luma POS" />
        </div>

        <div>
          <label className={labelClass}>Description courte *</label>
          <textarea name="description" required rows={2} defaultValue={project?.description || project?.context || ""} className={inputClass} placeholder="1 ou 2 phrases percutantes..." />
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Statut</label>
            <select name="status" defaultValue={project?.status || "en_cours"} className={inputClass}>
              <option value="en_cours" className="bg-background">En développement</option>
              <option value="termine" className="bg-background">Terminé / Livré</option>
              <option value="archive" className="bg-background">Archivé</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Lien (Démo / Site)</label>
            <input name="demo_url" defaultValue={project?.demo_url ?? ""} className={inputClass} placeholder="https://..." />
          </div>
        </div>

        <div className="flex items-center gap-6 py-2">
          <label className="flex items-center gap-2.5 text-sm text-foreground cursor-pointer">
            <input type="checkbox" name="is_published" defaultChecked={project?.is_published ?? true} className="h-4 w-4 rounded border-white/10 bg-black/20 text-accent focus:ring-accent focus:ring-offset-background" />
            <span>Publié</span>
          </label>
          <label className="flex items-center gap-2.5 text-sm text-foreground cursor-pointer">
            <input type="checkbox" name="is_featured" defaultChecked={project?.is_featured} className="h-4 w-4 rounded border-white/10 bg-black/20 text-accent focus:ring-accent focus:ring-offset-background" />
            <span>Mis en avant</span>
          </label>
        </div>

        {/* Champs Avancés */}
        <div className="border-t border-white/5 pt-4">
          <button 
            type="button" 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-medium text-accent hover:text-accent/80 transition-colors"
          >
            {showAdvanced ? "− Masquer les détails avancés" : "+ Ajouter des détails avancés (optionnel)"}
          </button>
          
          {showAdvanced && (
            <div className="mt-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Type</label>
                  <input name="type" defaultValue={project?.type ?? ""} className={inputClass} placeholder="Ex: SaaS B2B" />
                </div>
                <div>
                  <label className={labelClass}>Dépôt (Github)</label>
                  <input name="repo_url" defaultValue={project?.repo_url ?? ""} className={inputClass} placeholder="https://github.com/..." />
                </div>
              </div>
              <div>
                <label className={labelClass}>Contexte / Problème</label>
                <textarea name="context" rows={2} defaultValue={project?.context ?? ""} className={inputClass} placeholder="Quel était le besoin initial ?" />
              </div>
              <div>
                <label className={labelClass}>Défis rencontrés</label>
                <textarea name="challenges" rows={2} defaultValue={project?.challenges ?? ""} className={inputClass} placeholder="Quelles difficultés avez-vous surmontées ?" />
              </div>
              <div>
                <label className={labelClass}>Solution apportée</label>
                <textarea name="solution" rows={2} defaultValue={project?.solution ?? ""} className={inputClass} placeholder="Comment avez-vous résolu le problème ?" />
              </div>
              <div>
                <label className={labelClass}>Architecture & Technologies (Détails)</label>
                <textarea name="architecture" rows={2} defaultValue={project?.architecture ?? ""} className={inputClass} placeholder="Décrivez la stack technique et l'architecture..." />
              </div>
              <div>
                <label className={labelClass}>Impact / Résultats</label>
                <textarea name="results" rows={2} defaultValue={project?.results ?? project?.impact ?? ""} className={inputClass} placeholder="Quels sont les résultats concrets obtenus ?" />
              </div>
              <div>
                <label className={labelClass}>Lien vidéo YouTube / Loom (Optionnel)</label>
                <input name="video_url" defaultValue={project?.video_url ?? ""} className={inputClass} placeholder="https://..." />
              </div>
            </div>
          )}
        </div>

        {error && <div className="rounded-xl bg-red-500/10 p-3 border border-red-500/20 text-sm text-red-500">{error}</div>}

        <button
          type="submit"
          disabled={loading || isUploading}
          className="mt-2 flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white transition-all hover:bg-accent/90 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
          {loading ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Ajouter le projet"}
        </button>
      </form>
    </div>
  );
}
