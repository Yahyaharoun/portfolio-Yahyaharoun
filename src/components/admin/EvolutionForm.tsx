"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveEvolution } from "@/app/admin/actions";
import { Evolution } from "@/types";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EvolutionForm({ initialData }: { initialData?: Evolution }) {
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
      organization: formData.get("organization") as string,
      year: formData.get("year") as string,
      description: formData.get("description") as string,
      logo_url: formData.get("logo_url") as string,
      document_url: formData.get("document_url") as string,
      sort_order: parseInt((formData.get("sort_order") as string) || "0", 10),
      is_published: formData.get("is_published") === "true",
      is_goal: formData.get("is_goal") === "true",
    };

    try {
      await saveEvolution(payload, initialData?.id);
      router.push("/admin/evolutions");
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
          href="/admin/evolutions"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-foreground/70 transition-colors hover:bg-black/10 hover:text-foreground dark:bg-white/5 dark:hover:bg-white/10"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">
          {initialData ? "Modifier l'étape" : "Nouvelle étape d'évolution"}
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
              Titre de l'étape <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={initialData?.title}
              required
              placeholder="Ex: Licence Informatique"
              className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-background px-4 py-2.5 text-foreground placeholder-foreground/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="organization" className="text-sm font-semibold text-foreground">
              Organisation / École <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="organization"
              name="organization"
              defaultValue={initialData?.organization}
              required
              placeholder="Ex: Université de Yaoundé I"
              className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-background px-4 py-2.5 text-foreground placeholder-foreground/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="year" className="text-sm font-semibold text-foreground">
              Année <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="year"
              name="year"
              defaultValue={initialData?.year}
              required
              placeholder="Ex: 2021 - 2024 ou 2026"
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
              defaultValue={initialData?.sort_order ?? 0}
              className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-background px-4 py-2.5 text-foreground placeholder-foreground/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <p className="text-xs text-foreground/50">Plus le chiffre est petit, plus il apparaît haut (0, 1, 2...)</p>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-semibold text-foreground">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={initialData?.description || ""}
            rows={4}
            placeholder="Décrivez ce que vous avez accompli lors de cette étape..."
            className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-background px-4 py-2.5 text-foreground placeholder-foreground/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          ></textarea>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="logo_url" className="text-sm font-semibold text-foreground">
              URL du Logo (Optionnel)
            </label>
            <input
              type="url"
              id="logo_url"
              name="logo_url"
              defaultValue={initialData?.logo_url || ""}
              placeholder="https://..."
              className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-background px-4 py-2.5 text-foreground placeholder-foreground/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="document_url" className="text-sm font-semibold text-foreground">
              Document Preuve / Diplôme (Optionnel)
            </label>
            <input
              type="url"
              id="document_url"
              name="document_url"
              defaultValue={initialData?.document_url || ""}
              placeholder="https://..."
              className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-background px-4 py-2.5 text-foreground placeholder-foreground/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="flex gap-6 pt-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-black/20 dark:bg-white/20">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                value="true"
                defaultChecked={initialData?.is_published ?? true}
                className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <span className="pointer-events-none absolute left-1 h-4 w-4 rounded-full bg-white transition-all peer-checked:left-6 peer-checked:bg-accent"></span>
            </div>
            <label htmlFor="is_published" className="cursor-pointer text-sm font-semibold text-foreground">
              Publier cette étape
            </label>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-black/20 dark:bg-white/20">
              <input
                type="checkbox"
                id="is_goal"
                name="is_goal"
                value="true"
                defaultChecked={initialData?.is_goal ?? false}
                className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <span className="pointer-events-none absolute left-1 h-4 w-4 rounded-full bg-white transition-all peer-checked:left-6 peer-checked:bg-emerald-500"></span>
            </div>
            <label htmlFor="is_goal" className="cursor-pointer text-sm font-semibold text-foreground">
              C'est un objectif futur
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
            {isSubmitting ? "Enregistrement..." : "Enregistrer l'étape"}
          </button>
        </div>
      </form>
    </div>
  );
}
