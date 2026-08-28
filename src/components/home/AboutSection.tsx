"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Globe, Cpu, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";

const aboutItems = [
  {
    id: "parcours",
    icon: Briefcase,
    title: "Parcours",
    content: "Je suis étudiant en informatique et entrepreneur. Avant de me plonger pleinement dans le code, j'ai géré une boutique alimentaire. Cette expérience de terrain a forgé ma vision : je construis des outils pragmatiques, pensés pour fonctionner dans des conditions réelles."
  },
  {
    id: "vision",
    icon: Globe,
    title: "Vision",
    content: "Les réalités africaines imposent des défis uniques. Je me suis spécialisé dans la création de Progressive Web Apps (PWA) et d'architectures Offline-First. L'objectif : l'application doit continuer à fonctionner et sauvegarder les données, même quand le réseau disparaît."
  },
  {
    id: "philosophie",
    icon: Cpu,
    title: "Philosophie",
    content: "L'intelligence artificielle transforme notre façon d'interagir. Je suis passionné par l'intégration de l'IA de manière utile et ciblée, non pas comme un gadget, mais comme un véritable assistant pour l'utilisateur final et l'automatisation des processus."
  },
  {
    id: "objectifs",
    icon: ShieldCheck,
    title: "Objectifs",
    content: "Développer de belles applications ne suffit plus. Mon but ultime est de me spécialiser en cybersécurité. J'apprends à concevoir des architectures DevSecOps, intégrant la sécurité dès la première ligne de code pour garantir la confidentialité des données."
  }
];

export function AboutSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextItem = () => setActiveIndex((prev) => (prev + 1) % aboutItems.length);
  const prevItem = () => setActiveIndex((prev) => (prev === 0 ? aboutItems.length - 1 : prev - 1));

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-32 scroll-mt-20 overflow-hidden">
      <div className="mb-20 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl"
        >
          Ce qui me définit
        </motion.h2>
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          className="mt-6 mx-auto h-1.5 w-24 rounded-full bg-gradient-to-r from-accent to-purple-500"
        ></motion.div>
      </div>

      {/* Cercles Interactifs */}
      <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-16 relative z-10">
        {aboutItems.map((item, index) => {
          const isActive = index === activeIndex;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveIndex(index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={isActive ? {
                y: [0, -10, 0],
              } : {}}
              transition={isActive ? {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              } : {}}
              className={`relative flex flex-col items-center justify-center h-28 w-28 sm:h-36 sm:w-36 rounded-full border-2 backdrop-blur-xl transition-all duration-500 ${
                isActive 
                  ? "border-accent bg-accent/10 shadow-[0_0_30px_rgba(109,93,252,0.3)] text-accent" 
                  : "border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-foreground/50 hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              <Icon size={isActive ? 36 : 28} className="mb-2 transition-all duration-300" />
              <span className={`text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 ${isActive ? "opacity-100" : "opacity-0"}`}>
                {item.title}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Contenu Actif */}
      <div className="relative min-h-[250px] sm:min-h-[200px] w-full max-w-3xl mx-auto rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-8 sm:p-12 backdrop-blur-md shadow-xl flex items-center justify-center text-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent/20 text-accent mb-2">
              {(() => {
                const ActiveIcon = aboutItems[activeIndex].icon;
                return <ActiveIcon size={32} />;
              })()}
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
              {aboutItems[activeIndex].title}
            </h3>
            <p className="text-foreground/80 text-lg sm:text-xl leading-relaxed max-w-2xl">
              {aboutItems[activeIndex].content}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Boutons de navigation */}
      <div className="flex justify-center items-center gap-6 mt-10">
        <button 
          onClick={prevItem}
          className="group flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors font-medium text-sm sm:text-base uppercase tracking-wider"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          Précédent
        </button>
        <div className="h-4 w-[1px] bg-foreground/20"></div>
        <button 
          onClick={nextItem}
          className="group flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors font-medium text-sm sm:text-base uppercase tracking-wider"
        >
          Suivant
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}
