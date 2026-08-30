"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Evolution } from "@/types";
import { Briefcase, GraduationCap, Building2, Rocket, CalendarDays, ArrowRight, Target, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { StackedCardCarousel } from "@/components/ui/StackedCardCarousel";
import * as LucideIcons from "lucide-react";

// Fallback initial
const defaultEvolutions: Evolution[] = [
  {
    id: "exp1",
    title: "Développeur Full Stack",
    organization: "Entreprise Tech",
    description: "Création d'applications web performantes avec Next.js et React.",
    year: "2023",
    logo_url: null,
    document_url: null,
    sort_order: 1,
    is_published: true,
    is_goal: false,
  },
  {
    id: "exp2",
    title: "Licence Informatique",
    organization: "Université Numérique",
    description: "Apprentissage des bases de l'informatique, algorithmique et architecture logicielle.",
    year: "2020",
    logo_url: null,
    document_url: null,
    sort_order: 2,
    is_published: true,
    is_goal: false,
  }
];

export function ExperiencesSection() {
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExperience, setSelectedExperience] = useState<Evolution | null>(null);

  useEffect(() => {
    async function fetchEvolutions() {
      const supabase = createClient();
      try {
        const { data } = await supabase
          .from("evolutions")
          .select("*")
          .eq("is_published", true)
          .order("sort_order", { ascending: true });
          
        if (data && data.length > 0) {
          setEvolutions(data as Evolution[]);
        } else {
          setEvolutions(defaultEvolutions);
        }
      } catch (error) {
        console.error("Erreur Evolutions:", error);
        setEvolutions(defaultEvolutions);
      } finally {
        setLoading(false);
      }
    }
    fetchEvolutions();
  }, []);

  return (
    <section id="experiences" className="mx-auto max-w-5xl px-4 sm:px-6 py-20 lg:py-32 scroll-mt-20">
      <div className="mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-8">
        <div className="max-w-2xl text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-5 py-2 text-sm font-semibold text-accent mb-6"
          >
            <Briefcase size={16} />
            <span>Parcours Professionnel</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6"
          >
            Mon Évolution
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            className="mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-accent to-purple-500 mb-6 origin-left"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-foreground/70 sm:text-xl leading-relaxed"
          >
            Un aperçu de mon parcours professionnel, de mes formations et de mes expériences.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Link href="/experiences" className="group flex items-center justify-center gap-3 rounded-full bg-foreground text-background px-8 py-4 font-bold text-sm uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(109,93,252,0.15)] hover:shadow-accent/30">
            Voir plus
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      <div className="relative z-10 mt-10 min-h-[400px]">
        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          </div>
        ) : (
          <StackedCardCarousel
            items={evolutions}
            keyExtractor={(e) => e.id}
            autoPlayInterval={0} 
            renderItem={(evo, index, isVisible) => {
              return (
                <div 
                  className={`relative flex h-[350px] sm:h-[400px] w-full flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white/10 p-8 shadow-2xl transition-all duration-500
                    ${isVisible 
                      ? (evo.is_goal ? 'bg-gradient-to-br from-fuchsia-900/80 to-fuchsia-900/40 backdrop-blur-xl border-fuchsia-500/30' : 'bg-gradient-to-br from-black/80 to-black/40 dark:from-white/10 dark:to-white/5 backdrop-blur-xl')
                      : 'bg-black/40 dark:bg-white/5 backdrop-blur-sm'
                    }
                  `}
                >
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${evo.is_goal ? 'bg-fuchsia-500/20 text-fuchsia-500' : 'bg-accent/20 text-accent'}`}>
                          {evo.is_goal ? <Target size={24} /> : <Briefcase size={24} />}
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-foreground/20 backdrop-blur-md">
                          <CalendarDays size={14} />
                          {evo.year}
                        </span>
                      </div>
                      
                      {evo.is_goal && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-fuchsia-500 uppercase tracking-widest">
                          <Target size={14} /> Objectif
                        </span>
                      )}
                    </div>

                    <div className="mt-auto">
                      <h3 className="mb-2 text-2xl sm:text-3xl font-black text-foreground drop-shadow-sm">
                        {evo.title}
                      </h3>
                      
                      {evo.organization && (
                        <div className="flex items-center gap-2 text-sm font-semibold text-accent mb-4">
                          <Building2 size={16} />
                          {evo.organization}
                        </div>
                      )}

                      {evo.description && (
                        <>
                          <p className="text-sm sm:text-base leading-relaxed text-foreground/70 line-clamp-3">
                            {evo.description}
                          </p>
                          {isVisible && (
                            <button 
                              onClick={() => setSelectedExperience(evo)}
                              className="mt-4 text-accent hover:text-accent/80 font-bold text-sm flex items-center gap-1 transition-colors"
                            >
                              Détails <ArrowRight size={16} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            }}
          />
        )}
      </div>

      {/* Modal pour afficher l'expérience en entier */}
      <AnimatePresence>
        {selectedExperience && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => setSelectedExperience(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-[#0f0f14] border border-white/10 p-8 sm:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <button 
                onClick={() => setSelectedExperience(null)}
                className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-foreground/70 hover:bg-white/10 hover:text-foreground transition-colors"
              >
                <LucideIcons.X size={20} />
              </button>
              
              <div className="mb-8 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ${selectedExperience.is_goal ? 'bg-fuchsia-500/20 text-fuchsia-500 ring-1 ring-fuchsia-500/30' : 'bg-accent/20 text-accent ring-1 ring-accent/30'}`}>
                    {selectedExperience.is_goal ? <Target size={32} /> : <Briefcase size={32} />}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-accent">
                      {selectedExperience.organization || "Expérience"}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-foreground drop-shadow-sm">
                      {selectedExperience.title}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-foreground/70">
                    <CalendarDays size={14} />
                    {selectedExperience.year}
                  </span>
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-line">
                  {selectedExperience.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
