"use client";

import { useState, useEffect } from "react";
import { Download, X, Share } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true) {
      setIsStandalone(true);
      return; // Ne rien faire si déjà installé
    }

    // Détection iOS Safari
    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isSafari = /Safari/i.test(ua) && !/Chrome/i.test(ua) && !/CriOS/i.test(ua) && !/FxiOS/i.test(ua);
    
    if (isIOSDevice && isSafari) {
      setIsIOS(true);
    }

    // Intercepter l'événement d'installation standard (Android, Windows, macOS Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    }
  };

  if (isStandalone) return null; // App déjà installée
  if (!deferredPrompt && !isIOS) return null; // Navigateur non supporté ou pas encore prêt

  return (
    <>
      {/* Bouton Premium Flottant (ou intégré selon le design, ici on le place en bas à droite) */}
      <motion.button
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleInstallClick}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white shadow-xl shadow-accent/30 transition-shadow hover:shadow-accent/50 group"
      >
        <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse" />
        <Download size={18} className="group-hover:-translate-y-1 transition-transform" />
        <span>Installer l'application</span>
      </motion.button>

      {/* Modale IOS Safari */}
      <AnimatePresence>
        {showIOSModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl bg-background p-6 shadow-2xl border border-black/10 dark:border-white/10"
            >
              <button
                onClick={() => setShowIOSModal(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-foreground/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-6 flex justify-center">
                <div className="rounded-2xl bg-accent/10 p-4">
                  <Share size={32} className="text-accent" />
                </div>
              </div>

              <h3 className="text-center text-xl font-bold mb-2">Installer sur iOS</h3>
              <p className="text-center text-sm text-foreground/70 mb-6">
                Profitez d'une expérience native, plus rapide et hors-ligne.
              </p>

              <div className="space-y-4 text-sm font-medium">
                <div className="flex items-center gap-4 rounded-xl bg-muted p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white">1</span>
                  <p>Appuyez sur le bouton <strong>Partager</strong> <Share size={16} className="inline mb-1" /> dans la barre de navigation Safari.</p>
                </div>
                <div className="flex items-center gap-4 rounded-xl bg-muted p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white">2</span>
                  <p>Faites défiler et choisissez <strong>Sur l'écran d'accueil</strong> (Add to Home Screen).</p>
                </div>
                <div className="flex items-center gap-4 rounded-xl bg-muted p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white">3</span>
                  <p>Validez en appuyant sur <strong>Ajouter</strong> en haut à droite.</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="mt-6 w-full rounded-xl bg-black/5 dark:bg-white/5 py-3 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                J'ai compris
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
