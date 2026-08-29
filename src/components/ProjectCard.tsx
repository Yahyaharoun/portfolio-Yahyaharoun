"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Project } from "@/types";
import { Globe, Github, ArrowRight, CheckCircle2 } from "lucide-react";
import React from "react";

export default function ProjectCard({ project }: { project: Project }) {
  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const statusMap: Record<string, { label: string, color: string }> = {
    en_cours: { label: "En cours", color: "bg-amber-500 text-white" },
    termine: { label: "En production", color: "bg-emerald-500 text-white" },
    archive: { label: "Archivé", color: "bg-gray-500 text-white" },
  };

  const projectStatus = project.status ? (statusMap[project.status] || statusMap.termine) : statusMap.termine;

  return (
    <motion.div
      style={{
        perspective: 1000,
      }}
      className="group w-full"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative flex flex-col overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 transition-colors duration-300 hover:border-accent/50 shadow-lg hover:shadow-2xl hover:shadow-accent/10 backdrop-blur-sm"
      >
        <Link href={`/projects/${project.slug}`} className="block relative h-64 sm:h-72 w-full overflow-hidden bg-black/5 dark:bg-white/5" style={{ transform: "translateZ(30px)" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>
          {project.cover_image_url ? (
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              unoptimized={true}
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-foreground/30 font-bold text-2xl">
              {project.title}
            </div>
          )}
          
          <div className="absolute top-4 right-4 z-20">
            <span className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-lg ${projectStatus.color}`}>
              {projectStatus.label}
            </span>
          </div>

          <div className="absolute bottom-4 left-6 z-20 pr-6">
            <p className="text-xs font-black uppercase tracking-widest text-accent drop-shadow-md mb-1">{project.type}</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-lg line-clamp-2">{project.title}</h3>
          </div>
        </Link>
        
        <div className="flex flex-col flex-1 p-5 sm:p-8" style={{ transform: "translateZ(20px)" }}>
          {project.description && (
            <p className="line-clamp-3 text-sm sm:text-base text-foreground/80 leading-relaxed mb-4 sm:mb-6 font-medium">
              {project.description}
            </p>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
              {project.technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech.id}
                  className="rounded-full bg-accent/10 text-accent border border-accent/20 px-2.5 py-1 text-[10px] sm:text-xs font-bold tracking-wide shadow-sm"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          )}

          {project.impact && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 sm:h-[18px] sm:w-[18px]" />
                <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                  {project.impact}
                </p>
              </div>
            </div>
          )}

          <div className="mt-auto pt-4 sm:pt-6 border-t border-black/10 dark:border-white/10 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {project.demo_url && (
                  <a 
                    href={project.demo_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 h-9 sm:h-10 rounded-full bg-accent text-white hover:bg-accent/90 transition-all shadow-md hover:shadow-accent/30 hover:scale-105"
                    title="Voir le site en direct"
                  >
                    <Globe size={16} className="shrink-0" />
                    <span className="text-xs sm:text-sm font-bold truncate max-w-[180px]">
                      {project.demo_url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                    </span>
                  </a>
                )}
                {project.repo_url && (
                  <a 
                    href={project.repo_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black/5 dark:bg-white/10 text-foreground hover:bg-black/10 dark:hover:bg-white/20 transition-all hover:scale-110"
                    title="Code source"
                  >
                    <Github size={16} className="sm:h-[18px] sm:w-[18px]" />
                  </a>
                )}
              </div>
              
              <Link 
                href={`/projects/${project.slug}`}
                className="group/link flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-widest text-foreground hover:text-accent transition-colors shrink-0"
              >
                <span className="hidden sm:inline">Étude de cas</span>
                <span className="sm:hidden">Détails</span>
                <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

