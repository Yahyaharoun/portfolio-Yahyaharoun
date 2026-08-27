"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedHeroText } from "@/components/AnimatedHeroText";
import { DownloadCVButton } from "@/components/DownloadCVButton";

export function HeroSection() {
  return (
    <section id="hero" className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center overflow-hidden pt-20">
      {/* Premium Background Effects (Vercel/Linear style) */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 opacity-50 blur-[120px] mix-blend-screen"></div>

      <div className="z-10 flex flex-col items-center max-w-4xl">
        <div className="mb-8 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2 sm:gap-3 rounded-full border border-black/10 dark:border-white/10 bg-background/50 backdrop-blur-md px-4 py-1.5 sm:px-5 sm:py-2.5 shadow-sm transition-all hover:scale-105 hover:border-accent/30 hover:shadow-accent/5 hover:bg-accent/5 active:scale-95 cursor-default"
          >
            <span className="text-xs sm:text-sm font-medium text-foreground/80 flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-lg">🎓</span> Un pied à l'école 
              <span className="text-black/20 dark:text-white/20 mx-0.5 sm:mx-1">•</span> 
              <span className="text-sm sm:text-lg">💼</span> Un pied dans le business
            </span>
          </motion.div>
        </div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl font-extrabold tracking-tight sm:text-7xl text-foreground"
        >
          Yahya Haroun
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 w-full"
        >
          <AnimatedHeroText />
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-6 max-w-2xl text-foreground/70 sm:text-lg leading-relaxed"
        >
          Étudiant en informatique, entrepreneur et développeur de Progressive Web Apps, je conçois des solutions numériques modernes, sécurisées et adaptées aux réalités africaines. Mon objectif est de créer des produits utiles qui allient innovation, simplicité et performance.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center w-full sm:w-auto"
        >
          <Link href="/#projects" className="group relative flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm font-medium text-background transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_8px_rgba(109,93,252,0.2)]">
            Voir mes projets 
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/#contact" className="flex h-12 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-8 text-sm font-medium text-foreground transition-all hover:bg-black/10 dark:hover:bg-white/10 active:scale-95">
            Me contacter
          </Link>
          <DownloadCVButton />
        </motion.div>
      </div>
    </section>
  );
}
