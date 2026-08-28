"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArchitectureBuilder } from "@/components/playground/ArchitectureBuilder";
import { CyberPuzzle } from "@/components/playground/CyberPuzzle";
import { Sparkles, Gamepad2, Volume2, VolumeX } from "lucide-react";

export function PlaygroundSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Synthetic sound using Web Audio API
  const playStartupSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      
      // Osc 1 - Tech sweep
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.log("Audio not supported or blocked");
    }
  };

  useEffect(() => {
    if (isInView && soundEnabled) {
      playStartupSound();
    }
  }, [isInView, soundEnabled]);

  return (
    <section id="playground" ref={containerRef} className="mx-auto max-w-7xl px-6 py-20 lg:py-32 scroll-mt-20 overflow-hidden relative">
      {/* Decorative bg elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="mb-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-5 py-2 text-sm font-semibold text-accent mb-6"
        >
          <Gamepad2 size={16} />
          <span>Espace Interactif</span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6"
        >
          Playground
        </motion.h2>

        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          className="mt-4 mx-auto h-1.5 w-24 rounded-full bg-gradient-to-r from-accent to-purple-500 mb-6"
        ></motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto max-w-2xl text-foreground/70 sm:text-xl leading-relaxed mb-8"
        >
          Une collection de mini-expériences interactives conçues pour démontrer mes compétences en architecture logicielle et en logique.
        </motion.p>

        {/* Sound Toggle */}
        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            if (!soundEnabled) {
              // Play immediately to unlock AudioContext on user interaction
              const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
              const ctx = new AudioContext();
              ctx.resume();
            }
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold transition-colors ${soundEnabled ? 'border-accent bg-accent/10 text-accent' : 'border-black/10 dark:border-white/10 text-foreground/50 hover:text-foreground'}`}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          {soundEnabled ? 'Son activé' : 'Activer le son'}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 perspective-[1000px]">
        <motion.div
          initial={{ opacity: 0, rotateY: -10, x: -50 }}
          whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onClick={playStartupSound}
        >
          <ArchitectureBuilder />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, rotateY: 10, x: 50 }}
          whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          onClick={playStartupSound}
        >
          <CyberPuzzle />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-20 text-center"
      >
        <p className="text-sm font-semibold text-foreground/40 flex items-center justify-center gap-2 uppercase tracking-widest">
          <Sparkles size={16} className="text-accent animate-pulse" /> D'autres expériences arriveront bientôt...
        </p>
      </motion.div>
    </section>
  );
}
