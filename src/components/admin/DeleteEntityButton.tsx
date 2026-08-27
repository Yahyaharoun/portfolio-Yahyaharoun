"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, AlertTriangle, X } from "lucide-react";
import { deleteProject, deleteExperience, deleteGalleryItem, deleteArticle } from "@/app/admin/actions";

const deleteActions: Record<string, (id: string) => Promise<any>> = {
  projects: deleteProject,
  experiences: deleteExperience,
  gallery: deleteGalleryItem,
  articles: deleteArticle,
};

export default function DeleteEntityButton({
  table,
  id,
  title,
}: {
  table: string;
  id: string;
  title: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    const action = deleteActions[table];
    if (!action) {
      alert(`Action de suppression non trouvée pour la table : ${table}`);
      return;
    }
    try {
      setLoading(true);
      await action(id);
      setShowModal(false);
      router.refresh();
    } catch (error: any) {
      alert("Erreur lors de la suppression : " + error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
        title="Supprimer"
      >
        <Trash2 size={14} />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !loading && setShowModal(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f14] shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/15 text-red-500">
                  <AlertTriangle size={18} />
                </div>
                <h2 className="text-base font-bold text-foreground">Confirmer la suppression</h2>
              </div>
              <button
                onClick={() => !loading && setShowModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground/40 transition-colors hover:bg-white/10 hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <p className="text-sm text-foreground/70 leading-relaxed">
                Vous êtes sur le point de supprimer définitivement{" "}
                <span className="font-semibold text-foreground">"{title}"</span>.
                Cette action est <span className="text-red-400 font-medium">irréversible</span>.
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-foreground/70 transition-all hover:bg-white/10 hover:text-foreground disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-red-600 active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                {loading ? "Suppression..." : "Supprimer définitivement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
