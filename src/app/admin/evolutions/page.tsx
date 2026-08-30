import { createServiceClient } from "@/lib/supabase/service";
import Link from "next/link";
import { Plus, Edit, Milestone } from "lucide-react";
import DeleteEntityButton from "@/components/admin/DeleteEntityButton";
import { Evolution } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminEvolutionsPage() {
  const supabase = createServiceClient();
  const { data: evolutions } = await supabase
    .from("evolutions")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mon Évolution</h1>
          <p className="mt-2 text-foreground/60">Gérez votre parcours académique et professionnel.</p>
        </div>
        <Link
          href="/admin/evolutions/new"
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-semibold text-white transition-colors hover:bg-accent/90"
        >
          <Plus size={20} />
          Ajouter une étape
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/5 dark:bg-white/5 text-foreground/70">
              <tr>
                <th className="p-4 font-semibold">Titre</th>
                <th className="p-4 font-semibold">Organisation</th>
                <th className="p-4 font-semibold">Année</th>
                <th className="p-4 font-semibold">Objectif Futur</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {evolutions?.map((evo: Evolution) => (
                <tr key={evo.id} className="transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="p-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Milestone size={20} />
                      </div>
                      {evo.title}
                    </div>
                  </td>
                  <td className="p-4">{evo.organization}</td>
                  <td className="p-4 font-mono">{evo.year}</td>
                  <td className="p-4">
                    {evo.is_goal ? (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-500">
                        Objectif
                      </span>
                    ) : (
                      <span className="text-foreground/50">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        evo.is_published
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {evo.is_published ? "Publié" : "Brouillon"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/evolutions/${evo.id}`}
                        className="rounded-lg p-2 text-foreground/50 transition-colors hover:bg-black/10 hover:text-foreground dark:hover:bg-white/10"
                      >
                        <Edit size={18} />
                      </Link>
                      <DeleteEntityButton id={evo.id} table="evolution" title={evo.title} />
                    </div>
                  </td>
                </tr>
              ))}
              {(!evolutions || evolutions.length === 0) && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-foreground/50">
                    Aucune étape d'évolution n'a été ajoutée.
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
