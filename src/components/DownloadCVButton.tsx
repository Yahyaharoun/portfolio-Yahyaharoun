"use client";

import { useState } from "react";
import { Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DownloadCVButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleDownload = async () => {
    if (status === "loading" || status === "success") return;
    try {
      setStatus("loading");
      const res = await fetch("/api/cv");
      if (!res.ok) throw new Error("Erreur de téléchargement");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "CV_Yahya_Haroun.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <button 
      onClick={handleDownload}
      disabled={status === "loading"}
      className="group relative flex h-12 items-center justify-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-8 text-sm font-medium text-foreground transition-all duration-300 hover:bg-accent hover:text-white hover:border-accent active:scale-95 shadow-sm hover:shadow-[0_0_20px_rgba(109,93,252,0.4)] overflow-hidden"
    >
      {/* Premium subtle shine effect on hover */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
      
      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
            <span className="text-lg group-hover:scale-110 transition-transform duration-300">📄</span>
            <span>Télécharger mon CV</span>
          </motion.div>
        )}
        
        {status === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2 text-accent group-hover:text-white">
            <Loader2 size={18} className="animate-spin" />
            <span>Génération en cours...</span>
          </motion.div>
        )}
        
        {status === "success" && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-2 text-green-500 group-hover:text-white">
            <CheckCircle2 size={18} />
            <span>Téléchargé avec succès</span>
          </motion.div>
        )}
        
        {status === "error" && (
          <motion.div key="error" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center gap-2 text-red-500 group-hover:text-white">
            <AlertCircle size={18} />
            <span>Échec du téléchargement</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
