"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveVision } from "@/app/admin/actions";
import { Vision } from "@/types";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VisionForm({ initialData }: { initialData?: Vision }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      icon_name: formData.get("icon_name") as string,
      image_url: formData.get("image_url") as string,
      sort_order: parseInt((formData.get("sort_order") as string) || "0", 10),
      is_published: formData.get("is_published") === "true",
    };

    try {
      await saveVision(payload, initialData?.id);
      router.push("/admin/visions");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/admin/visions"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-foreground/70 transition-colors hover:bg-black/10 hover:text-foreground dark:bg-white/5 dark:hover:bg-white/10"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">
          {initialData ? "Modifier la vision" : "Nouvelle carte Vision/Valeur"}
        </h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-semibold text-foreground">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={initialData?.title}
              required
              placeholder="Ex: Vision IA pour l'Afrique"
              className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-background px-4 py-2.5 text-foreground placeholder-foreground/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-semibold text-foreground">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              defaultValue={initialData?.category || "valeur"}
              required
              className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-background px-4 py-2.5 text-foreground placeholder-foreground/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="valeur">Valeur (Ce qui me définit)</option>
              <option value="afrique">Vision Afrique</option>
              <option value="ia">Vision IA</option>
              <option value="cybersecurite">Cybersécurité</option>
              <option value="entrepreneuriat">Entrepreneuriat</option>
              <option value="developpement">Développement</option>
              <option value="autre">Autre</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-semibold text-foreground">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={initialData?.description || ""}
            required
            rows={4}
            placeholder="Détaillez votre vision ou valeur..."
            className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-background px-4 py-2.5 text-foreground placeholder-foreground/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          ></textarea>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="icon_name" className="text-sm font-semibold text-foreground">
              Nom de l'icône (Lucide React)
            </label>
            <input
              type="text"
              id="icon_name"
              name="icon_name"
              defaultValue={initialData?.icon_name || ""}
              placeholder="Ex: Shield, Globe, Cpu..."
              className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-background px-4 py-2.5 text-foreground placeholder-foreground/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="sort_order" className="text-sm font-semibold text-foreground">
              Ordre d'affichage
            </label>
            <input
              type="number"
              id="sort_order"
              name="sort_order"
              defaultValue={(initialData as any)?.sort_order ?? 0}
              className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-background px-4 py-2.5 text-foreground placeholder-foreground/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="image_url" className="text-sm font-semibold text-foreground">
            Image de fond / Illustration URL (Optionnel)
          </label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            defaultValue={initialData?.image_url || ""}
            placeholder="https://..."
            className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-background px-4 py-2.5 text-foreground placeholder-foreground/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="flex gap-6 pt-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-black/20 dark:bg-white/20">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                value="true"
                defaultChecked={(initialData as any)?.is_published ?? true}
                className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <span className="pointer-events-none absolute left-1 h-4 w-4 rounded-full bg-white transition-all peer-checked:left-6 peer-checked:bg-accent"></span>
            </div>
            <label htmlFor="is_published" className="cursor-pointer text-sm font-semibold text-foreground">
              Publier cette carte
            </label>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 font-bold text-white transition-all hover:bg-accent/90 disabled:opacity-70 sm:w-auto sm:px-8"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}
