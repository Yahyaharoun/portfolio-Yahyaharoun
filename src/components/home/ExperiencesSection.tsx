"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Experience } from "@/types";
import { Briefcase, GraduationCap, Building2, Rocket, Store, CalendarDays, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

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
          .order("start_date", { ascending: false })
          .limit(3);
        setExperiences(data as Experience[]);
      } catch (error) {
        console.error("Erreur Experiences:", error);
      }
    }
    fetchExperiences();
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

      <div className="relative z-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 perspective-[1000px]">
          {experiences?.map((exp, index) => {
            const typeColor = getColorForType(exp.type);
            
            return (
              <motion.div 
                key={exp.id} 
                initial={{ opacity: 0, y: 50, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                className="group relative"
              >
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="h-full flex flex-col relative rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-8 backdrop-blur-sm overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl hover:border-accent/30"
                >
                  {/* Effet de lumière premium au hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/0 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  <div className={`mb-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-background/50 ${typeColor} shadow-[0_0_20px_rgba(109,93,252,0.1)] group-hover:scale-110 transition-transform duration-500`}>
                    {getIconForType(exp.type)}
                  </div>

                  <div className="flex flex-col gap-3 relative z-10 flex-grow">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${typeColor}`}>
                        {exp.type}
                      </span>
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

                    <div className="flex items-center gap-2 text-sm font-bold text-foreground/50 mt-1">
                      <CalendarDays size={14} />
                      <span>{formatDate(exp.start_date)} — {exp.is_current ? "Présent" : exp.end_date ? formatDate(exp.end_date) : ""}</span>
                    </div>
                    
                    {exp.description && (
                      <p className="mt-4 text-base leading-relaxed text-foreground/70 line-clamp-4">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </motion.div>
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
