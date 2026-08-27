"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-background p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] dark:bg-[#0a0a0f]"
            >
              <button 
                onClick={() => setShowConfirm(false)}
                className="absolute right-4 top-4 text-foreground/40 hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                  <AlertTriangle size={28} />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">Voulez-vous vraiment vous déconnecter ?</h3>
                <p className="mb-8 text-sm text-foreground/60">
                  Vous devrez saisir à nouveau vos identifiants pour accéder à l'administration.
                </p>

                <div className="flex w-full gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    disabled={loading}
                    className="flex-1 rounded-xl bg-muted/50 px-4 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50 border border-black/5 dark:border-white/5"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="flex-1 rounded-xl bg-red-500 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-red-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      "Se déconnecter"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
