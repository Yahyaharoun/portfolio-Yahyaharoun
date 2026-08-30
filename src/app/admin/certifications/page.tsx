import { createServiceClient } from "@/lib/supabase/service";
import Link from "next/link";
import { Plus, Edit, Award } from "lucide-react";
import DeleteEntityButton from "@/components/admin/DeleteEntityButton";
import { Certification } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminCertificationsPage() {
  const supabase = createServiceClient();
  let certifications: Certification[] | null = null;
  let fetchError = null;
  
  try {
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("sort_order", { ascending: true });
      
    if (error) throw error;
    certifications = data as Certification[];
  } catch (error: any) {
    console.error("Erreur lors de la récupération des certifications:", error);
    fetchError = error.message;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Certifications</h1>
          <p className="mt-2 text-foreground/60">Gérez vos diplômes et certificats professionnels.</p>
        </div>
        <Link
          href="/admin/certifications/new"
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-semibold text-white transition-colors hover:bg-accent/90"
        >
          <Plus size={20} />
          Ajouter une certification
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
        {fetchError && (
          <div className="m-4 rounded-lg bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
            Une erreur est survenue lors du chargement: {fetchError}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/5 dark:bg-white/5 text-foreground/70">
              <tr>
                <th className="p-4 font-semibold">Titre</th>
                <th className="p-4 font-semibold">Organisme</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {certifications?.map((cert: Certification) => (
                <tr key={cert.id} className="transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="p-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Award size={20} />
                      </div>
                      {cert.title}
                    </div>
                  </td>
                  <td className="p-4">{cert.issuer}</td>
                  <td className="p-4 font-mono">{cert.issue_date || "-"}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        (cert as any).is_published !== false
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {(cert as any).is_published !== false ? "Publié" : "Brouillon"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/certifications/${cert.id}`}
                        className="rounded-lg p-2 text-foreground/50 transition-colors hover:bg-black/10 hover:text-foreground dark:hover:bg-white/10"
                      >
                        <Edit size={18} />
                      </Link>
                      <DeleteEntityButton id={cert.id} table="certification" title={cert.title} />
                    </div>
                  </td>
                </tr>
              ))}
              {(!certifications || certifications.length === 0) && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-foreground/50">
                    Aucune certification n'a été ajoutée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
