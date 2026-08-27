"use client";

import { motion } from "framer-motion";
import { ArchitectureBuilder } from "@/components/playground/ArchitectureBuilder";
import { CyberPuzzle } from "@/components/playground/CyberPuzzle";
import { Sparkles, Gamepad2 } from "lucide-react";

export function PlaygroundSection() {
  return (
    <section id="playground" className="mx-auto max-w-6xl px-6 py-32 scroll-mt-20">
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
          <Gamepad2 size={16} />
          <span>Espace Interactif</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
          Playground
        </h2>
        <p className="mx-auto max-w-2xl text-foreground/70 sm:text-lg">
          Une collection de mini-expériences interactives conçues pour démontrer mes compétences en architecture logicielle et en logique.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ArchitectureBuilder />
        <CyberPuzzle />
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-foreground/50 flex items-center justify-center gap-2">
          <Sparkles size={14} /> D'autres expériences arriveront bientôt...
        </p>
      </div>
    </section>
  );
}
