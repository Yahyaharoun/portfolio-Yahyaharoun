"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveCertification } from "@/app/admin/actions";
import { Certification } from "@/types";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CertificationForm({ initialData }: { initialData?: Certification }) {
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
      issuer: formData.get("issuer") as string,
      issue_date: formData.get("issue_date") as string,
      credential_url: formData.get("credential_url") as string,
      image_url: formData.get("image_url") as string,
    };

    try {
      await saveCertification(payload, initialData?.id);
      router.push("/admin/certifications");
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
          href="/admin/certifications"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-foreground/70 transition-colors hover:bg-black/10 hover:text-foreground dark:bg-white/5 dark:hover:bg-white/10"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">
          {initialData ? "Modifier la certification" : "Nouvelle certification"}
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
              Nom de la certification <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={initialData?.title}
              required
              placeholder="Ex: Google Cloud Architect"
              className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-background px-4 py-2.5 text-foreground placeholder-foreground/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="issuer" className="text-sm font-semibold text-foreground">
              Organisme <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="issuer"
              name="issuer"
              defaultValue={initialData?.issuer || ""}
              required
              placeholder="Ex: Coursera, Google, Microsoft..."
              className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-background px-4 py-2.5 text-foreground placeholder-foreground/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="issue_date" className="text-sm font-semibold text-foreground">
            Date d'obtention
          </label>
          <input
            type="text"
            id="issue_date"
            name="issue_date"
            defaultValue={initialData?.issue_date || ""}
            placeholder="Ex: Octobre 2023"
            className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-background px-4 py-2.5 text-foreground placeholder-foreground/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="credential_url" className="text-sm font-semibold text-foreground">
              Lien de validation (Optionnel)
            </label>
            <input
              type="url"
              id="credential_url"
              name="credential_url"
              defaultValue={initialData?.credential_url || ""}
              placeholder="https://..."
              className="w-full rounded-lg border border-black/20 dark:border-white/20 bg-background px-4 py-2.5 text-foreground placeholder-foreground/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="image_url" className="text-sm font-semibold text-foreground">
              Image / Badge URL (Optionnel)
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
