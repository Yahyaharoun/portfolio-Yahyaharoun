"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedHeroText } from "@/components/AnimatedHeroText";
import { DownloadCVButton } from "@/components/DownloadCVButton";

export function HeroSection() {
  return (
    <section id="hero" className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center overflow-hidden pt-20">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Light gradient blob */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[120px] mix-blend-screen"
      />

      <div className="z-10 flex flex-col items-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 flex justify-center"
        >
          <div className="flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-background/50 backdrop-blur-xl px-5 py-2 shadow-sm transition-all hover:scale-105 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(109,93,252,0.2)] hover:bg-accent/5 cursor-default">
            <span className="text-sm font-medium text-foreground/80 flex items-center gap-2">
              <Sparkles size={16} className="text-accent animate-pulse" />
              Yahya Haroun — Portfolio v2.0
            </span>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl font-extrabold tracking-tight sm:text-8xl text-foreground mb-6"
        >
          Un pied à <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">l'école.</span><br />
          Un pied dans le <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">business.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-foreground/70 sm:text-xl font-medium tracking-wide leading-relaxed uppercase"
        >
          Étudiant en informatique <span className="text-accent mx-2">•</span> Développeur Full Stack <span className="text-accent mx-2">•</span> Entrepreneur <span className="text-accent mx-2">•</span> Futur spécialiste en cybersécurité
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center w-full sm:w-auto"
        >
          <Link href="/#projects" className="group relative flex h-14 items-center justify-center gap-2 rounded-full bg-foreground px-10 text-sm font-bold text-background transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_8px_rgba(109,93,252,0.2)]">
            Découvrir mon travail
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/#contact" className="flex h-14 items-center justify-center rounded-full border-2 border-black/10 dark:border-white/10 bg-transparent px-10 text-sm font-bold text-foreground transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 hover:border-foreground/30">
            Me contacter
          </Link>
          <DownloadCVButton />
        </motion.div>
      </div>
    </section>
  );
}
