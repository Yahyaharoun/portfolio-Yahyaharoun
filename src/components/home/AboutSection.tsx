"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Briefcase, Globe, Cpu, ShieldCheck } from "lucide-react";

const aboutItems = [
  {
    id: "parcours",
    icon: Briefcase,
    title: "Parcours & Réalité Terrain",
    content: (
      <div className="space-y-4">
        <p>
          Je suis étudiant en informatique et entrepreneur. Mon parcours est atypique : avant de me plonger pleinement dans le code, j'ai géré une boutique alimentaire. Cette expérience de terrain a forgé ma vision de la technologie.
        </p>
        <p>
          Je sais qu'un logiciel parfait sur le papier ne vaut rien s'il ne répond pas aux contraintes quotidiennes de ses utilisateurs. C'est pourquoi je construis des outils pragmatiques, pensés pour fonctionner dans des conditions réelles.
        </p>
      </div>
    )
  },
  {
    id: "vision",
    icon: Globe,
    title: "Focus sur l'Afrique & l'Offline-First",
    content: (
      <div className="space-y-4">
        <p>
          Les réalités africaines imposent des défis uniques, notamment en termes de connectivité. Je me suis donc spécialisé dans la création de Progressive Web Apps (PWA) robustes et d'architectures Offline-First. 
        </p>
        <p>
          L'objectif est simple : l'application doit continuer à fonctionner, sauvegarder les données, et se synchroniser plus tard, même quand le réseau disparaît.
        </p>
      </div>
    )
  },
  {
    id: "philosophie",
    icon: Cpu,
    title: "Passion pour l'IA",
    content: (
      <div className="space-y-4">
        <p>
          L'intelligence artificielle transforme notre façon d'interagir avec la machine. Je suis passionné par l'intégration de l'IA de manière utile et ciblée, non pas comme un gadget, mais comme un véritable assistant pour l'utilisateur final et l'automatisation des processus métiers.
        </p>
      </div>
    )
  },
  {
    id: "objectifs",
    icon: ShieldCheck,
    title: "En route vers la Cybersécurité",
    content: (
      <div className="space-y-4">
        <p>
          Développer de belles applications ne suffit plus. Aujourd'hui, mon grand objectif est de me spécialiser en cybersécurité.
        </p>
        <p>
          Je suis actuellement en phase d'apprentissage intensif sur ce domaine. Mon but est de concevoir des architectures qui intègrent la sécurité (DevSecOps) dès la première ligne de code, garantissant ainsi l'intégrité et la confidentialité des données de mes clients.
        </p>
      </div>
    )
  }
];

export function AboutSection() {
  const [openId, setOpenId] = useState<string>("parcours");

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? "" : id);
  };

  return (
    <section id="about" className="mx-auto max-w-4xl px-6 py-32 scroll-mt-20">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">À propos de moi</h2>
        <div className="mt-4 mx-auto h-1 w-20 rounded-full bg-accent/50"></div>
      </div>

      <div className="flex flex-col gap-4">
        {aboutItems.map((item) => {
          const isOpen = openId === item.id;
          const Icon = item.icon;

          return (
            <div 
              key={item.id} 
              className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 overflow-hidden transition-colors hover:border-accent/50"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${isOpen ? "bg-accent/20 text-accent" : "bg-black/5 dark:bg-white/10 text-foreground/70"}`}>
                    <Icon size={20} />
                  </div>
                  <span className={`font-semibold sm:text-lg transition-colors ${isOpen ? "text-accent" : "text-foreground"}`}>
                    {item.title}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-foreground/50"
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-5 pt-0 text-foreground/80 leading-relaxed border-t border-black/5 dark:border-white/5 mt-2">
                      <div className="pt-4">
                        {item.content}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
