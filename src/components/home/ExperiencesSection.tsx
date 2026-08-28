"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Experience } from "@/types";
import { Briefcase, GraduationCap, Building2, Rocket, Store, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
}

function getIconForType(type: string | null) {
  switch (type) {
    case "formation": return <GraduationCap size={20} />;
    case "entrepreneuriat": return <Store size={20} />;
    case "projet": return <Rocket size={20} />;
    case "stage": return <Briefcase size={20} />;
    default: return <Building2 size={20} />;
  }
}

function getColorForType(type: string | null) {
  switch (type) {
    case "formation": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    case "entrepreneuriat": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    case "projet": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    case "stage": return "text-purple-500 bg-purple-500/10 border-purple-500/20";
    default: return "text-accent bg-accent/10 border-accent/20";
  }
}

export function ExperiencesSection() {
  const [experiences, setExperiences] = useState<Experience[] | null>(null);

  useEffect(() => {
    async function fetchExperiences() {
      const supabase = createClient();
      try {
        const { data } = await supabase
          .from("experiences")
          .select("*")
          .eq("is_published", true)
          .order("start_date", { ascending: false });
        setExperiences(data as Experience[]);
      } catch (error) {
        console.error("Erreur Experiences:", error);
      }
    }
    fetchExperiences();
  }, []);

  return (
    <section id="experiences" className="mx-auto max-w-5xl px-4 sm:px-6 py-20 lg:py-32 scroll-mt-20">
      <div className="mb-20 text-center">
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
          className="mt-4 mx-auto h-1.5 w-24 rounded-full bg-gradient-to-r from-accent to-purple-500 mb-8"
        ></motion.div>
      </div>

      <div className="relative mx-auto max-w-4xl">
        {/* Ligne centrale (visible uniquement sur desktop) */}
        <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-accent/0 via-accent/30 to-accent/0 transform sm:-translate-x-1/2 rounded-full hidden sm:block"></div>
        {/* Ligne gauche (visible uniquement sur mobile) */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-accent/0 via-accent/30 to-accent/0 rounded-full sm:hidden"></div>

        <div className="space-y-16">
          {experiences?.map((exp, index) => {
            const isEven = index % 2 === 0;
            const typeColor = getColorForType(exp.type);
            
            return (
              <motion.div 
                key={exp.id} 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`relative flex flex-col sm:flex-row items-start sm:items-center ${isEven ? 'sm:flex-row-reverse' : ''} group pl-24 sm:pl-0`}
              >
                {/* Point central de la timeline */}
                <div className={`absolute left-8 sm:left-1/2 top-0 sm:top-1/2 flex h-14 w-14 shrink-0 transform -translate-x-1/2 sm:-translate-y-1/2 items-center justify-center rounded-full border-4 border-background ${typeColor} shadow-[0_0_20px_rgba(109,93,252,0.2)] group-hover:scale-125 transition-transform duration-500 z-10`}>
                  {getIconForType(exp.type)}
                </div>

                {/* Contenu (Carte) */}
                <div className={`w-full sm:w-1/2 ${isEven ? 'sm:pl-16' : 'sm:pr-16'}`}>
                  <motion.div 
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="relative rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-8 backdrop-blur-sm overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl hover:border-accent/30"
                  >
                    {/* Effet de lumière premium au hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-accent/0 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    {/* Flèche pour desktop */}
                    <div className={`hidden sm:block absolute top-1/2 h-5 w-5 transform -translate-y-1/2 rotate-45 border-b border-l border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 group-hover:border-accent/30 transition-colors duration-300 ${
                      isEven ? '-left-2.5 border-r-0 border-t-0' : '-right-2.5 border-l-0 border-b-0 rotate-[225deg]'
                    }`}></div>
                    
                    {/* Flèche pour mobile */}
                    <div className="sm:hidden absolute top-5 -left-2.5 h-5 w-5 rotate-45 border-b border-l border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 group-hover:border-accent/30 transition-colors duration-300"></div>

                    <div className="flex flex-col gap-3 relative z-10">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${typeColor}`}>
                          {exp.type}
                        </span>
                        <div className="flex items-center gap-2 text-sm font-bold text-foreground/50 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full">
                          <CalendarDays size={14} />
                          <span>{formatDate(exp.start_date)} — {exp.is_current ? "Présent" : exp.end_date ? formatDate(exp.end_date) : ""}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-extrabold text-foreground mt-2 group-hover:text-accent transition-colors duration-300">
                        {exp.title}
                      </h3>
                      
                      {exp.organization && (
                        <div className="flex items-center gap-2 text-base font-semibold text-foreground/80">
                          <Building2 size={16} className="text-accent" />
                          {exp.organization}
                        </div>
                      )}
                      
                      {exp.description && (
                        <p className="mt-3 text-base leading-relaxed text-foreground/70">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {(!experiences || experiences.length === 0) && (
          <p className="text-foreground/50 text-center py-8">Chargement des expériences...</p>
        )}
      </div>
    </section>
  );
}
