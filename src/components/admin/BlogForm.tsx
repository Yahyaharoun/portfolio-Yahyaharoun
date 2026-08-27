"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { saveArticle } from "@/app/admin/actions";
import type { Article } from "@/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BlogForm({ article, onSuccess }: { article?: Article; onSuccess?: () => void }) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState(article?.title || "");
  const [coverUrl, setCoverUrl] = useState(article?.cover_image_url || "");
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const isEdit = Boolean(article);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError("");

      const fileExt = file.name.split(".").pop();
      const safeName = file.name
        .replace(`.${fileExt}`, "")
        .replace(/[^a-zA-Z0-9]/g, "_")
        .toLowerCase();
      const fileName = `${safeName}_${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("media").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(filePath);
      setCoverUrl(publicUrl);
    } catch (err: any) {
      setError(`Échec de l'upload : ${err.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!coverUrl) {
      setError("Veuillez sélectionner une image de couverture.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    setLoading(true);
    setError("");

    const isPublished = formData.get("is_published") === "on";

    const payload = {
      title,
      slug: article?.slug || slugify(title),
      excerpt: String(formData.get("excerpt") || ""),
      content: String(formData.get("content") || ""),
      cover_image_url: coverUrl,
      category: String(formData.get("category") || "developpement") as Article["category"],
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    };

    try {
      await saveArticle(payload, article?.id);
      setStatus("success");
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/blog");
      }
      if (!isEdit) {
        setTitle("");
        setCoverUrl("");
        setStatus("idle");
        form.reset();
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-accent focus:bg-black/40 focus:ring-1 focus:ring-accent focus:outline-none transition-all";
  const labelClass = "mb-1.5 block text-xs font-semibold text-foreground/70 uppercase tracking-wider";

  return (
    <div className="rounded-3xl border border-white/10 bg-muted/30 backdrop-blur-md p-5 sm:p-6 shadow-xl">
      <h2 className="mb-6 text-xl font-bold text-foreground">
        {isEdit ? "Modifier l'article" : "Nouvel article"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Image de couverture */}
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

        {/* Titre */}
        <div>
          <label className={labelClass}>Titre *</label>
          <input
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            placeholder="Ex: Comment sécuriser une API Next.js"
          />
        </div>

        {/* Extrait */}
        <div>
          <label className={labelClass}>Extrait / Résumé *</label>
          <textarea
            name="excerpt"
            required
            rows={2}
            defaultValue={article?.excerpt || ""}
            className={inputClass}
            placeholder="2-3 phrases résumant l'article..."
          />
        </div>

        {/* Catégorie */}
        <div>
          <label className={labelClass}>Catégorie</label>
          <select name="category" defaultValue={article?.category || "developpement"} className={inputClass}>
            <option value="developpement" className="bg-background">Développement</option>
            <option value="cybersecurite" className="bg-background">Cybersécurité</option>
            <option value="ia" className="bg-background">Intelligence Artificielle</option>
            <option value="entrepreneuriat" className="bg-background">Entrepreneuriat</option>
          </select>
        </div>

        {/* Contenu */}
        <div>
          <label className={labelClass}>Contenu complet *</label>
          <textarea
            name="content"
            required
            rows={10}
            defaultValue={article?.content || ""}
            className={`${inputClass} font-mono text-xs leading-relaxed`}
            placeholder="Rédigez votre article ici... (Markdown supporté)"
          />
        </div>

        {/* Publier */}
        <label className="flex items-center gap-2.5 text-sm text-foreground cursor-pointer">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={article?.published_at ? true : false}
            className="h-4 w-4 rounded border-white/10 bg-black/20 text-accent focus:ring-accent focus:ring-offset-background"
          />
          <span>Publier immédiatement</span>
        </label>

        {error && (
          <div className="rounded-xl bg-red-500/10 p-3 border border-red-500/20 text-sm text-red-500">{error}</div>
        )}

        {status === "success" && (
          <div className="rounded-xl bg-green-500/10 p-3 border border-green-500/20 text-sm text-green-400">
            Article enregistré avec succès !
          </div>
        )}

        <button
          type="submit"
          disabled={loading || isUploading}
          className="mt-2 flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white transition-all hover:bg-accent/90 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
          {loading ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Publier l'article"}
        </button>
      </form>
    </div>
  );
}
