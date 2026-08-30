"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { StackedCardCarousel } from "@/components/ui/StackedCardCarousel";
import { Vision } from "@/types";

// Icône par défaut si non trouvée
const DefaultIcon = LucideIcons.Compass;

// Fallback initial au cas où la BDD est vide
const defaultVisions: Vision[] = [
  {
    id: "parcours",
    title: "Mon parcours",
    description: "Je suis étudiant en informatique et entrepreneur. Je construis des outils pragmatiques, pensés pour fonctionner dans des conditions réelles et imparfaites.",
    category: "valeur",
    icon_name: "Briefcase",
    image_url: null,
    sort_order: 1,
    is_published: true,
  },
  {
    id: "vision",
    title: "Ma vision",
    description: "Spécialisé dans la création de PWA et d'architectures Offline-First pour l'Afrique. L'objectif : l'application doit continuer à fonctionner sans réseau.",
    category: "afrique",
    icon_name: "Globe",
    image_url: null,
    sort_order: 2,
    is_published: true,
  },
  {
    id: "philosophie",
    title: "Ma philosophie",
    description: "L'intelligence artificielle transforme notre façon d'interagir. Je l'intègre de manière utile pour l'automatisation de processus complexes.",
    category: "ia",
    icon_name: "Cpu",
    image_url: null,
    sort_order: 3,
    is_published: true,
  },
  {
    id: "objectif",
    title: "Mon objectif",
    description: "Me spécialiser en cybersécurité (DevSecOps), intégrant la sécurité dès la première ligne de code pour garantir la confidentialité des données.",
    category: "cybersecurite",
    icon_name: "ShieldCheck",
    image_url: null,
    sort_order: 4,
    is_published: true,
  }
];

export function AboutSection() {
  const [visions, setVisions] = useState<Vision[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVision, setSelectedVision] = useState<Vision | null>(null);

  useEffect(() => {
    async function fetchVisions() {
      const supabase = createClient();
      try {
        const { data } = await supabase
          .from("visions")
          .select("*")
          .eq("is_published", true)
          .order("sort_order", { ascending: true });
        
        if (data && data.length > 0) {
          setVisions(data);
        } else {
          setVisions(defaultVisions);
        }
      } catch (error) {
        console.error("Erreur Visions:", error);
        setVisions(defaultVisions);
      } finally {
        setLoading(false);
      }
    }
    fetchVisions();
  }, []);

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-32 scroll-mt-20 overflow-hidden relative">
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

      {/* Carousel */}
      <div className="relative z-10 min-h-[400px]">
        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          </div>
        ) : (
          <StackedCardCarousel
            items={visions}
            keyExtractor={(v) => v.id}
            autoPlayInterval={8000} // Défilement auto toutes les 8s
            renderItem={(vision, index, isVisible) => {
              // Extraction sécurisée de l'icône
              let Icon = DefaultIcon;
              if (vision.icon_name && (LucideIcons as any)[vision.icon_name]) {
                Icon = (LucideIcons as any)[vision.icon_name];
              }

              return (
                <div 
                  onClick={() => {
                    if (isVisible) setSelectedVision(vision);
                  }}
                  className={`relative flex h-[350px] sm:h-[400px] w-full flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white/10 p-8 sm:p-10 shadow-2xl transition-all duration-500
                    ${isVisible 
                      ? 'bg-gradient-to-br from-black/80 to-black/40 dark:from-white/10 dark:to-white/5 backdrop-blur-xl cursor-pointer hover:ring-2 hover:ring-accent/50' 
                      : 'bg-black/40 dark:bg-white/5 backdrop-blur-sm'
                    }
                  `}
                >
                  {/* Image de fond en option */}
                  {vision.image_url && (
                    <div 
                      className="absolute inset-0 z-0 opacity-20 mix-blend-overlay transition-opacity duration-700 pointer-events-none" 
                      style={{ backgroundImage: `url(${vision.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} 
                    />
                  )}
                  
                  {/* Effet Glow au survol */}
                  <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-[80px] pointer-events-none" />

                  <div className="relative z-10 flex flex-col gap-6 h-full pointer-events-none">
                    <div className="flex items-center justify-between">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/20 text-accent shadow-lg ring-1 ring-accent/30">
                        <Icon size={32} />
                      </div>
                      <span className="rounded-full bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white/70">
                        {vision.category || "Valeur"}
                      </span>
                    </div>
                    
                    <div className="mt-auto">
                      <h3 className="mb-4 text-3xl sm:text-4xl font-black text-white drop-shadow-sm">
                        {vision.title}
                      </h3>
                      <p className="text-base sm:text-lg leading-relaxed text-white/80 line-clamp-3">
                        {vision.description}
                      </p>
                      {isVisible && (
                        <div className="mt-4 text-accent font-bold text-sm flex items-center gap-1 transition-colors">
                          Lire la suite <LucideIcons.ArrowRight size={16} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }}
          />
        )}
      </div>

      {/* Modal pour afficher la vision en entier */}
      <AnimatePresence>
        {selectedVision && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => setSelectedVision(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-background border border-black/10 dark:border-white/10 p-8 sm:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <button 
                onClick={() => setSelectedVision(null)}
                className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-foreground/70 hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground transition-colors"
              >
                <LucideIcons.X size={20} />
              </button>
              
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/20 text-accent shadow-lg ring-1 ring-accent/30">
                  {selectedVision.icon_name && (LucideIcons as any)[selectedVision.icon_name] 
                    ? React.createElement((LucideIcons as any)[selectedVision.icon_name], { size: 32 })
                    : <DefaultIcon size={32} />
                  }
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-accent">
                    {selectedVision.category || "Valeur"}
                  </span>
                  <h3 className="text-3xl font-black text-foreground drop-shadow-sm">
                    {selectedVision.title}
                  </h3>
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-line">
                  {selectedVision.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
