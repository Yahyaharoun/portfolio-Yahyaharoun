"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, LockKeyhole, Terminal } from "lucide-react";

export function CyberPuzzle() {
  const [code, setCode] = useState<number[]>([0, 0, 0]);
  const [unlocked, setUnlocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [failed, setFailed] = useState(false);
  const secretCode = [7, 3, 5]; // Just an example, can be hinted

  useEffect(() => {
    if (unlocked || failed) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setFailed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [unlocked, failed]);

  const handleDigitChange = (index: number, val: number) => {
    if (unlocked || failed) return;
    const newCode = [...code];
    newCode[index] = val > 9 ? 0 : val < 0 ? 9 : val;
    setCode(newCode);
    
    if (newCode.join("") === secretCode.join("")) {
      setUnlocked(true);
    }
  };

  const reset = () => {
    setCode([0, 0, 0]);
    setUnlocked(false);
    setFailed(false);
    setTimeLeft(60);
  };

  return (
    <div className="rounded-2xl border border-white/10 dark:border-white/10 border-black/10 bg-muted p-8 shadow-2xl flex flex-col items-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
        <Terminal size={300} />
      </div>

      <div className="z-10 flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          Cyber Escape <span className="text-xs bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full font-mono">{timeLeft}s</span>
        </h3>
        <p className="text-sm text-foreground/70 mb-8 text-center max-w-sm">
          Système compromis. Trouvez le port d'administration d'urgence (Indice : 7 _ 5, au milieu c'est 3).
        </p>

        {unlocked ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-green-500 bg-green-500/10 p-6 rounded-xl border border-green-500/20"
          >
            <ShieldCheck size={48} className="mb-2" />
            <span className="font-semibold text-lg">Accès Autorisé</span>
            <span className="text-sm opacity-80">Réseau sécurisé avec succès.</span>
          </motion.div>
        ) : failed ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-red-500 bg-red-500/10 p-6 rounded-xl border border-red-500/20"
          >
            <ShieldAlert size={48} className="mb-2" />
            <span className="font-semibold text-lg">Intrusion Détectée</span>
            <button onClick={reset} className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm transition-colors">
              Réinitialiser la connexion
            </button>
          </motion.div>
        ) : (
          <div className="flex gap-4">
            {code.map((digit, i) => (
              <div key={i} className="flex flex-col items-center">
                <button onClick={() => handleDigitChange(i, digit + 1)} className="p-2 text-foreground/50 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors">
                  ▲
                </button>
                <div className="w-16 h-20 bg-background border border-white/10 dark:border-white/10 border-black/10 rounded-xl flex items-center justify-center text-3xl font-mono shadow-inner">
                  {digit}
                </div>
                <button onClick={() => handleDigitChange(i, digit - 1)} className="p-2 text-foreground/50 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors">
                  ▼
                </button>
              </div>
            ))}
          </div>
        )}

        {!unlocked && !failed && (
          <div className="mt-8 flex items-center gap-2 text-sm text-foreground/50">
            <LockKeyhole size={16} /> Force brute désactivée.
          </div>
        )}
      </div>
    </div>
  );
}
