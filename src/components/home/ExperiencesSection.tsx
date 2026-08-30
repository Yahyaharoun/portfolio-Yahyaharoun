"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Evolution } from "@/types";
import { Briefcase, GraduationCap, Building2, Rocket, Store, CalendarDays, ArrowRight, Target, Code, Play } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import * as LucideIcons from "lucide-react";

const DefaultIcon = Play;

function getIconForType(type: string | null) {
  switch (type) {
    case "bac": return <GraduationCap size={20} />;
    case "univ": return <GraduationCap size={20} />;
    case "pro": return <Briefcase size={20} />;
    case "perso": return <Rocket size={20} />;
    default: return <Building2 size={20} />;
  }
}

function getColorForType(type: string | null, isObjective: boolean) {
  if (isObjective) return "text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/20";
  switch (type) {
    case "bac": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    case "univ": return "text-indigo-500 bg-indigo-500/10 border-indigo-500/20";
    case "pro": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    case "perso": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    default: return "text-accent bg-accent/10 border-accent/20";
  }
}

export function ExperiencesSection() {
  const [evolutions, setEvolutions] = useState<Evolution[] | null>(null);

  useEffect(() => {
    async function fetchEvolutions() {
      const supabase = createClient();
      try {
        const { data } = await supabase
          .from("evolutions")
          .select("*")
          .eq("is_published", true)
          .order("sort_order", { ascending: true });
        setEvolutions(data as Evolution[]);
      } catch (error) {
        console.error("Erreur Evolutions:", error);
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

      <div className="relative z-10 mt-10">
        <div className="relative">
          {/* Ligne verticale (Timeline) */}
          <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-purple-500/50 to-transparent -translate-x-1/2 hidden sm:block"></div>

          <div className="space-y-12">
            {evolutions?.map((evo, index) => {
              const isEven = index % 2 === 0;
              const typeColor = getColorForType(evo.type, evo.is_objective || false);
              
              let Icon = DefaultIcon;
              if (evo.icon_name && (LucideIcons as any)[evo.icon_name]) {
                Icon = (LucideIcons as any)[evo.icon_name];
              }
              
              return (
                <motion.div 
                  key={evo.id} 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`relative flex flex-col sm:flex-row items-center gap-6 sm:gap-12 ${isEven ? 'sm:flex-row-reverse' : ''}`}
                >
                  {/* Point central (Timeline Node) */}
                  <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-4 border-background bg-accent items-center justify-center text-white shadow-[0_0_20px_rgba(109,93,252,0.4)] z-10">
                    <Icon size={24} />
                  </div>

                  {/* Carte Contenu */}
                  <div className={`w-full sm:w-1/2 ${isEven ? 'sm:pl-16' : 'sm:pr-16'}`}>
                    <div className={`relative rounded-3xl border border-white/10 p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] ${evo.is_objective ? 'bg-fuchsia-500/5 border-fuchsia-500/20' : 'bg-black/5 dark:bg-white/5 hover:border-accent/30'}`}>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-foreground/20 backdrop-blur-md self-start">
                          <CalendarDays size={14} />
                          {evo.year}
                        </span>
                        {evo.is_objective && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-fuchsia-500 uppercase tracking-widest">
                            <Target size={14} /> Objectif
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl font-black text-foreground mb-2 drop-shadow-sm">
                        {evo.title}
                      </h3>
                      
                      {evo.organization && (
                        <div className="flex items-center gap-2 text-sm font-semibold text-accent mb-4">
                          <Building2 size={16} />
                          {evo.organization}
                        </div>
                      )}

                      {evo.description && (
                        <p className="text-base leading-relaxed text-foreground/70">
                          {evo.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {(!evolutions || evolutions.length === 0) && (
          <p className="text-foreground/50 text-center py-8">Chargement de la timeline...</p>
        )}
      </div>
    </section>
  );
}
