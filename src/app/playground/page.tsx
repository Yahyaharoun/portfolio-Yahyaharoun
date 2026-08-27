"use client";

import { motion } from "framer-motion";
import { ArchitectureBuilder } from "@/components/playground/ArchitectureBuilder";
import { CyberPuzzle } from "@/components/playground/CyberPuzzle";
import { Sparkles, Gamepad2 } from "lucide-react";

export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
          <Gamepad2 size={16} />
          <span>Espace Interactif</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground mb-4">
          Playground
        </h1>
        <p className="mx-auto max-w-2xl text-foreground/70 sm:text-lg">
          Une collection de mini-expériences interactives conçues pour démontrer mes compétences en architecture logicielle et en logique.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ArchitectureBuilder />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CyberPuzzle />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-16 text-center"
      >
        <p className="text-sm text-foreground/50 flex items-center justify-center gap-2">
          <Sparkles size={14} /> D'autres expériences arriveront bientôt...
        </p>
      </motion.div>
    </div>
  );
}
