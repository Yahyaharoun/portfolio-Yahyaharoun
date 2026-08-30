import { createServiceClient } from "@/lib/supabase/service";
import Link from "next/link";
import { Plus, Edit, Compass } from "lucide-react";
import DeleteEntityButton from "@/components/admin/DeleteEntityButton";
import { Vision } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminVisionsPage() {
  const supabase = createServiceClient();
  const { data: visions } = await supabase
    .from("visions")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vision & Valeurs</h1>
          <p className="mt-2 text-foreground/60">Gérez les éléments de votre philosophie (Vision Afrique, IA, etc.).</p>
        </div>
        <Link
          href="/admin/visions/new"
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-semibold text-white transition-colors hover:bg-accent/90"
        >
          <Plus size={20} />
          Ajouter une carte
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/5 dark:bg-white/5 text-foreground/70">
              <tr>
                <th className="p-4 font-semibold">Titre</th>
                <th className="p-4 font-semibold">Catégorie</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {visions?.map((vision: Vision) => (
                <tr key={vision.id} className="transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="p-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Compass size={20} />
                      </div>
                      {vision.title}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-black/10 px-2 py-1 text-xs font-semibold capitalize text-foreground/70 dark:bg-white/10">
                      {vision.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        (vision as any).is_published !== false
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {(vision as any).is_published !== false ? "Publié" : "Brouillon"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/visions/${vision.id}`}
                        className="rounded-lg p-2 text-foreground/50 transition-colors hover:bg-black/10 hover:text-foreground dark:hover:bg-white/10"
                      >
                        <Edit size={18} />
                      </Link>
                      <DeleteEntityButton id={vision.id} entityType="vision" title={vision.title} />
                    </div>
                  </td>
                </tr>
              ))}
              {(!visions || visions.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-foreground/50">
                    Aucune vision n'a été ajoutée.
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
