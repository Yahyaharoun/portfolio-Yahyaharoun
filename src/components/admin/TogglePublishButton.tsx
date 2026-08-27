"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function TogglePublishButton({
  table,
  id,
  isPublished,
}: {
  table: string;
  id: string;
  isPublished: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentState, setCurrentState] = useState(isPublished);

  async function handleToggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/toggle-publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, id, isPublished: !currentState }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur inconnue");
      }

      setCurrentState(!currentState);
      router.refresh();
    } catch (err: any) {
      alert("Erreur : " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title={currentState ? "Dépublier" : "Publier"}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-50 ${
        currentState
          ? "bg-green-500/15 text-green-400 hover:bg-green-500 hover:text-white"
          : "bg-white/5 text-foreground/40 hover:bg-white/10 hover:text-foreground"
      }`}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : currentState ? (
        <Eye size={14} />
      ) : (
        <EyeOff size={14} />
      )}
    </button>
  );
}
