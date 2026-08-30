"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { GalleryItem } from "@/types";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { saveGalleryItem } from "@/app/admin/actions";

export default function GalleryForm({ item, onSuccess }: { item?: GalleryItem, onSuccess?: () => void }) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const isEdit = Boolean(item);

  const [title, setTitle] = useState(item?.title || "");
  const [imageUrl, setImageUrl] = useState(item?.media_url || "");
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
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
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
    if (!imageUrl) {
      setError("Veuillez sélectionner une image.");
      return;
    }
    
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const payload = {
      title,
      media_url: imageUrl,
      media_type: "image" as const,
      description: String(formData.get("description") || "") || null,
      category: String(formData.get("category") || "certification"),
      is_published: formData.get("is_published") === "on",
    };

    try {
      await saveGalleryItem(payload, item?.id);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/gallery");
      }
      
      if (!isEdit) {
        setTitle("");
        setImageUrl("");
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
        {isEdit ? "Modifier l'élément" : "Ajouter à la galerie"}
      </h2>
      
      <form id="gallery-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* Upload Image Compact */}
        <div>
          <label className={labelClass}>Image / Certificat *</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex h-36 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-white/10 bg-black/20 transition-all hover:border-accent/50 hover:bg-black/40"
          >
            {imageUrl ? (
              <>
                <Image src={imageUrl} alt="Preview" fill className="object-contain opacity-80 group-hover:opacity-40 transition-opacity p-2" />
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
          <label className={labelClass}>Titre *</label>
          <input name="title" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Ex: Certification AWS" />
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Catégorie</label>
            <select name="category" defaultValue={item?.category || "certification"} className={inputClass}>
              <option value="certification" className="bg-background">Certification</option>
              <option value="diplome" className="bg-background">Diplôme</option>
              <option value="recompense" className="bg-background">Récompense / Prix</option>
              <option value="media" className="bg-background">Média / Conférence</option>
            </select>
          </div>
          <div className="flex flex-col justify-end pb-2">
            <label className="flex items-center gap-2.5 text-sm text-foreground cursor-pointer">
              <input type="checkbox" name="is_published" defaultChecked={item ? (item as any).is_published !== false : true} className="h-4 w-4 rounded border-white/10 bg-black/20 text-accent focus:ring-accent focus:ring-offset-background" />
              <span>Visible publiquement</span>
            </label>
          </div>
        </div>

        <div>
          <label className={labelClass}>Description courte (optionnel)</label>
          <textarea name="description" rows={2} defaultValue={item?.description || ""} className={inputClass} placeholder="Obtenue en 2024..." />
        </div>

        {error && <div className="rounded-xl bg-red-500/10 p-3 border border-red-500/20 text-sm text-red-500">{error}</div>}

        <button
          type="submit"
          disabled={loading || isUploading}
          className="mt-2 flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white transition-all hover:bg-accent/90 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
          {loading ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Ajouter à la galerie"}
        </button>
      </form>
    </div>
  );
}
