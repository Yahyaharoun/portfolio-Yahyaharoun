"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProject } from "@/app/admin/actions";

export default function DeleteProjectButton({ projectId, projectTitle }: { projectId: string; projectTitle: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement le projet "${projectTitle}" ?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteProject(projectId);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression du projet.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50"
      title="Supprimer"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </button>
  );
}
