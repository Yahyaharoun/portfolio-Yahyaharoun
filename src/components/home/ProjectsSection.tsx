"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";
import { motion } from "framer-motion";

export function ProjectsSection() {
  const [projects, setProjects] = useState<any[] | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      const supabase = createClient();
      try {
        const { data } = await supabase
          .from("projects")
          .select("*, technologies(*)")
          .eq("is_published", true)
          .order("sort_order", { ascending: true })
          .limit(3);
        setProjects(data);
      } catch (error) {
        console.error("Erreur Projets:", error);
      }
    }
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="mx-auto max-w-7xl px-6 py-32 scroll-mt-20 overflow-hidden">
      <div className="mb-20 flex flex-col sm:flex-row sm:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-5 py-2 text-sm font-semibold text-accent mb-6"
          >
            <Code2 size={16} />
            <span>Études de cas</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6"
          >
            Projets en vedette
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
            Découvrez une sélection de mes réalisations récentes : SaaS, applications Offline-First et plateformes e-commerce. Chaque projet est une réponse technique à un problème métier complexe.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Link href="/projects" className="group flex items-center justify-center gap-3 rounded-full bg-foreground text-background px-8 py-4 font-bold text-sm uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(109,93,252,0.15)] hover:shadow-accent/30">
            Explorer tout
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      <div className="relative z-10">
        {projects ? (
          projects.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 perspective-[1000px]">
              {projects.map((project: any, index: number) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50, rotateX: 10 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-16 text-center backdrop-blur-sm">
              <p className="text-foreground/50 font-medium text-lg">Aucun projet publié pour le moment.</p>
            </div>
          )
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[500px] rounded-3xl bg-black/5 dark:bg-white/5 animate-pulse border border-black/10 dark:border-white/10" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
