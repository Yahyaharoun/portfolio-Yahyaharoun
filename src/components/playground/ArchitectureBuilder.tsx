"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Database, LayoutTemplate, CheckCircle, RefreshCcw, Volume2, VolumeX, Trophy, Timer } from "lucide-react";

type ComponentType = "frontend" | "backend" | "database" | null;

export function ArchitectureBuilder() {
  const [selected, setSelected] = useState<ComponentType[]>([]);
  const [success, setSuccess] = useState(false);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !success) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, success]);

  useEffect(() => {
    let oscillator: OscillatorNode | null = null;
    let gainNode: GainNode | null = null;
    let audioCtx: AudioContext | null = null;

    if (isPlaying && !success && soundEnabled) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtx = new AudioContextClass();
        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime); // Son d'ambiance léger
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.02, audioCtx.currentTime + 1); // Fade in doux
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
      } catch (e) {
        console.warn("Audio d'ambiance non supporté", e);
      }
    }

    return () => {
      if (gainNode && audioCtx && oscillator) {
        try {
          gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
          setTimeout(() => {
            if (oscillator) oscillator.stop();
          }, 200);
        } catch (e) {}
      }
    };
  }, [isPlaying, success, soundEnabled]);

  const playTone = (frequency: number, type: OscillatorType, duration: number, volume = 0.05) => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio disabled or unsupported", e);
    }
  };

  const playSound = (type: "click" | "success") => {
    if (!soundEnabled) return;
    if (type === "click") {
      playTone(600, "sine", 0.1, 0.05);
    } else if (type === "success") {
      playTone(523.25, "sine", 0.1); // C5
      setTimeout(() => playTone(659.25, "sine", 0.1), 100); // E5
      setTimeout(() => playTone(783.99, "sine", 0.1), 200); // G5
      setTimeout(() => playTone(1046.50, "sine", 0.4), 300); // C6
    }
  };

  const handleSelect = (comp: ComponentType) => {
    if (selected.includes(comp) || success) return;
    
    if (!isPlaying) setIsPlaying(true);
    
    playSound("click");
    
    const newSelected = [...selected, comp];
    setSelected(newSelected);
    
    if (newSelected.length === 3) {
      playSound("success");
      setTimeout(() => {
        setSuccess(true);
        // Calculate score based on time (faster = higher score, max 1000)
        const calculatedScore = Math.max(100, 1000 - (time * 50));
        setScore(calculatedScore);
      }, 500);
    }
  };

  const reset = () => {
    setSelected([]);
    setSuccess(false);
    setTime(0);
    setIsPlaying(false);
    setScore(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-2xl border border-white/10 dark:border-white/10 border-black/10 bg-muted p-6 sm:p-8 shadow-2xl flex flex-col items-center relative overflow-hidden">
      
      {/* Top Bar: Timer, Sound Toggle */}
      <div className="w-full flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-foreground/70 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full border border-black/5 dark:border-white/5">
          <Timer size={16} className={isPlaying && !success ? "text-accent animate-pulse" : ""} />
          <span className="font-mono text-sm font-medium">{formatTime(time)}</span>
        </div>
        
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-foreground/50 hover:text-foreground transition-colors p-2"
          aria-label={soundEnabled ? "Désactiver le son" : "Activer le son"}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      <h3 className="text-xl font-bold mb-2 text-foreground">Architecture Builder</h3>
      <p className="text-sm text-foreground/60 mb-8 text-center max-w-sm">
        Assemblez les composants pour déployer l'application le plus rapidement possible.
      </p>

      {/* Component Selection */}
      <div className="flex flex-nowrap justify-center gap-2 sm:gap-4 mb-10 w-full">
        <button
          onClick={() => handleSelect("frontend")}
          className={`flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-5 rounded-xl border transition-all flex-1 min-w-[80px] max-w-[120px] ${
            selected.includes("frontend")
              ? "border-accent bg-accent/20 text-accent opacity-50 cursor-not-allowed scale-95 shadow-inner"
              : "border-white/10 dark:border-white/10 border-black/10 hover:border-accent hover:bg-accent/10 hover:scale-105 hover:shadow-lg hover:shadow-accent/10 bg-background/50"
          }`}
        >
          <LayoutTemplate size={24} className={`sm:w-7 sm:h-7 ${selected.includes("frontend") ? "" : "text-foreground/80"}`} />
          <span className="text-xs sm:text-sm font-semibold tracking-wide">Frontend</span>
        </button>
        <button
          onClick={() => handleSelect("backend")}
          className={`flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-5 rounded-xl border transition-all flex-1 min-w-[80px] max-w-[120px] ${
            selected.includes("backend")
              ? "border-accent bg-accent/20 text-accent opacity-50 cursor-not-allowed scale-95 shadow-inner"
              : "border-white/10 dark:border-white/10 border-black/10 hover:border-accent hover:bg-accent/10 hover:scale-105 hover:shadow-lg hover:shadow-accent/10 bg-background/50"
          }`}
        >
          <Server size={24} className={`sm:w-7 sm:h-7 ${selected.includes("backend") ? "" : "text-foreground/80"}`} />
          <span className="text-xs sm:text-sm font-semibold tracking-wide">Backend</span>
        </button>
        <button
          onClick={() => handleSelect("database")}
          className={`flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-5 rounded-xl border transition-all flex-1 min-w-[80px] max-w-[120px] ${
            selected.includes("database")
              ? "border-accent bg-accent/20 text-accent opacity-50 cursor-not-allowed scale-95 shadow-inner"
              : "border-white/10 dark:border-white/10 border-black/10 hover:border-accent hover:bg-accent/10 hover:scale-105 hover:shadow-lg hover:shadow-accent/10 bg-background/50"
          }`}
        >
          <Database size={24} className={`sm:w-7 sm:h-7 ${selected.includes("database") ? "" : "text-foreground/80"}`} />
          <span className="text-xs sm:text-sm font-semibold tracking-wide">Database</span>
        </button>
      </div>

      {/* Deployment Zone */}
      <div className="relative w-full max-w-md h-48 rounded-2xl border-2 border-dashed border-white/20 dark:border-white/20 border-black/20 bg-black/5 dark:bg-white/5 flex items-center justify-center overflow-hidden">
        
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="flex flex-col items-center text-green-500 w-full h-full justify-center bg-green-500/5"
            >
              <motion.div 
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              >
                <CheckCircle size={56} className="mb-3" />
              </motion.div>
              <span className="font-bold text-xl tracking-tight mb-4 text-foreground">Déploiement Réussi !</span>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-foreground/50 uppercase tracking-wider mb-1">Temps</span>
                  <span className="font-mono font-bold text-foreground">{formatTime(time)}</span>
                </div>
                <div className="h-8 w-px bg-foreground/10"></div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-foreground/50 uppercase tracking-wider mb-1 flex items-center gap-1"><Trophy size={10} className="text-yellow-500" /> Score</span>
                  <span className="font-mono font-bold text-yellow-500 text-lg">{score}</span>
                </div>
              </div>

              <button 
                onClick={reset} 
                className="flex items-center gap-2 text-sm font-medium bg-foreground text-background px-4 py-2 rounded-full hover:scale-105 active:scale-95 transition-transform"
              >
                <RefreshCcw size={14} /> Rejouer
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="building"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-2 p-4 w-full h-full flex-wrap items-center justify-center"
            >
              {selected.length === 0 && (
                <div className="flex flex-col items-center text-foreground/30">
                  <LayoutTemplate size={32} className="mb-2 opacity-50" />
                  <span className="text-sm font-medium uppercase tracking-widest">Zone de déploiement</span>
                </div>
              )}
              {selected.map((comp, i) => (
                <motion.div
                  key={`${comp}-${i}`}
                  initial={{ scale: 0, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="px-5 py-3 bg-accent text-white rounded-lg text-sm font-bold shadow-lg shadow-accent/30 capitalize"
                >
                  {comp}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
