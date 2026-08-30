"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { logoutAdmin } from "@/app/admin/login/actions";

export default function LogoutButton() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await logoutAdmin();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500/80 hover:bg-red-500/10 hover:text-red-500 transition-colors w-full"
      >
        <LogOut size={16} />
        Déconnexion
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleLogout}
        title="Voulez-vous vraiment vous déconnecter ?"
        description="Vous devrez saisir à nouveau vos identifiants pour accéder à l'administration."
        confirmText="Se déconnecter"
        isLoading={loading}
        isDestructive={true}
      />
    </>
  );
}
