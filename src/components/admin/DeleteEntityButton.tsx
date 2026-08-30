"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, AlertTriangle, X } from "lucide-react";
import { deleteProject, deleteExperience, deleteGalleryItem, deleteArticle, deleteEvolution, deleteCertification, deleteVision } from "@/app/admin/actions";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const deleteActions: Record<string, (id: string) => Promise<any>> = {
  projects: deleteProject,
  experiences: deleteExperience,
  gallery: deleteGalleryItem,
  articles: deleteArticle,
  evolution: deleteEvolution,
  certification: deleteCertification,
  vision: deleteVision,
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

      <ConfirmDialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        description={`Vous êtes sur le point de supprimer définitivement "${title}". Cette action est irréversible.`}
        confirmText="Supprimer"
        isLoading={loading}
        isDestructive={true}
      />
    </>
  );
}
