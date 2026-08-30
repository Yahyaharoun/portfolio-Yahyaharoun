"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Evolution } from "@/types";
import { Briefcase, GraduationCap, Building2, Rocket, CalendarDays, ArrowRight, Target, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { StackedCardCarousel } from "@/components/ui/StackedCardCarousel";
import * as LucideIcons from "lucide-react";
import { Experience, Certification } from "@/types";

type UnifiedTimelineItem = {
  id: string;
  typeLabel: "Formation" | "Certification" | "Expérience";
  title: string;
  organization: string;
  date: string;
  description: string | null;
  is_goal: boolean;
  sortDate: number;
};

// Fallback initial
const defaultItems: UnifiedTimelineItem[] = [
  {
    id: "exp1",
    typeLabel: "Expérience",
    title: "Développeur Full Stack",
    organization: "Entreprise Tech",
    description: "Création d'applications web performantes avec Next.js et React.",
    date: "2023",
    is_goal: false,
    sortDate: 2023
  },
  {
    id: "exp2",
    typeLabel: "Formation",
    title: "Licence Informatique",
    organization: "Université Numérique",
    description: "Apprentissage des bases de l'informatique, algorithmique et architecture logicielle.",
    date: "2020",
    is_goal: false,
    sortDate: 2020
  }
];

export function ExperiencesSection() {
  const [items, setItems] = useState<UnifiedTimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExperience, setSelectedExperience] = useState<UnifiedTimelineItem | null>(null);

  useEffect(() => {
    async function fetchAllData() {
      const supabase = createClient();
      try {
        const [
          { data: evos },
          { data: exps },
          { data: certs }
        ] = await Promise.all([
          supabase.from("evolutions").select("*").eq("is_published", true),
          supabase.from("experiences").select("*"),
          supabase.from("certifications").select("*")
        ]);

        const unified: UnifiedTimelineItem[] = [];

        // 1. Formations (Evolutions)
        if (evos) {
          evos.forEach((e: any) => {
            unified.push({
              id: `evo_${e.id}`,
              typeLabel: "Formation",
              title: e.title,
              organization: e.organization,
              description: e.description,
              date: e.year,
              is_goal: e.is_goal,
              sortDate: parseInt(e.year) || 0
            });
          });
        }

        // 2. Expériences
        if (exps) {
          exps.forEach((e: any) => {
            const year = e.start_date ? new Date(e.start_date).getFullYear().toString() : "";
            unified.push({
              id: `exp_${e.id}`,
              typeLabel: "Expérience",
              title: e.title,
              organization: e.organization || "",
              description: e.description,
              date: year,
              is_goal: false,
              sortDate: parseInt(year) || 0
            });
          });
        }

        // 3. Certifications
        if (certs) {
          certs.forEach((c: any) => {
            const year = c.issue_date ? new Date(c.issue_date).getFullYear().toString() : "";
            unified.push({
              id: `cert_${c.id}`,
              typeLabel: "Certification",
              title: c.title,
              organization: c.issuer || "",
              description: null,
              date: year,
              is_goal: false,
              sortDate: parseInt(year) || 0
            });
          });
        }

        // Trier par date décroissante
        unified.sort((a, b) => b.sortDate - a.sortDate);

        if (unified.length > 0) {
          setItems(unified);
        } else {
          setItems(defaultItems);
        }
      } catch (error) {
        console.error("Erreur chargement parcours:", error);
        setItems(defaultItems);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  const getIconForType = (typeLabel: string) => {
    switch (typeLabel) {
      case "Formation": return <GraduationCap size={24} />;
      case "Certification": return <Target size={24} />;
      case "Expérience": return <Briefcase size={24} />;
      default: return <Briefcase size={24} />;
    }
  };

  const getIconForTypeLarge = (typeLabel: string) => {
    switch (typeLabel) {
      case "Formation": return <GraduationCap size={32} />;
      case "Certification": return <Target size={32} />;
      case "Expérience": return <Briefcase size={32} />;
      default: return <Briefcase size={32} />;
    }
  };

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
            Un aperçu de mon parcours professionnel, de mes formations et de mes certifications.
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
            items={items}
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
                          {getIconForType(evo.typeLabel)}
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-white/10 backdrop-blur-md border border-white/10">
                          {evo.typeLabel}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-white/10 backdrop-blur-md border border-white/10">
                          <CalendarDays size={14} />
                          {evo.date}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <h3 className="mb-2 text-2xl sm:text-3xl font-black text-white drop-shadow-sm">
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
                          <p className="text-sm sm:text-base leading-relaxed text-white/80 line-clamp-3">
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
              className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-background border border-black/10 dark:border-white/10 p-8 sm:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <button 
                onClick={() => setSelectedExperience(null)}
                className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-foreground/70 hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground transition-colors"
              >
                <LucideIcons.X size={20} />
              </button>
              
              <div className="mb-8 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ${selectedExperience.is_goal ? 'bg-fuchsia-500/20 text-fuchsia-500 ring-1 ring-fuchsia-500/30' : 'bg-accent/20 text-accent ring-1 ring-accent/30'}`}>
                    {getIconForTypeLarge(selectedExperience.typeLabel)}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-accent">
                      {selectedExperience.organization || selectedExperience.typeLabel}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-foreground drop-shadow-sm">
                      {selectedExperience.title}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-black/5 dark:bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-foreground/70 border border-black/10 dark:border-white/10">
                    <CalendarDays size={14} />
                    {selectedExperience.date}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-black/5 dark:bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-foreground/70 border border-black/10 dark:border-white/10">
                    {selectedExperience.typeLabel}
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
