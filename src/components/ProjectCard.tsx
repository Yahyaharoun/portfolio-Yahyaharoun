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
          
          <div className="absolute bottom-4 left-6 z-20">
            <p className="text-xs font-black uppercase tracking-widest text-accent drop-shadow-md mb-1">{project.type}</p>
            <h3 className="text-3xl font-extrabold text-white drop-shadow-lg">{project.title}</h3>
          </div>
        </Link>
        
        <div className="flex flex-col flex-1 p-6 sm:p-8" style={{ transform: "translateZ(20px)" }}>
          {project.description && (
            <p className="line-clamp-3 text-base text-foreground/80 leading-relaxed mb-6 font-medium">
              {project.description}
            </p>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {project.technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech.id}
                  className="rounded-full bg-accent/10 text-accent border border-accent/20 px-3 py-1 text-xs font-bold tracking-wide shadow-sm"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          )}

          {project.impact && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                <p className="text-sm font-semibold leading-relaxed">
                  {project.impact}
                </p>
              </div>
            </div>
          )}

          <div className="mt-auto pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-4">
            <div className="flex gap-3">
              {project.demo_url && (
                <a 
                  href={project.demo_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-accent text-white hover:bg-accent/90 transition-all hover:scale-110 shadow-md hover:shadow-accent/30"
                  title="Voir le site en direct"
                >
                  <Globe size={18} />
                </a>
              )}
              {project.repo_url && (
                <a 
                  href={project.repo_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-black/5 dark:bg-white/10 text-foreground hover:bg-black/10 dark:hover:bg-white/20 transition-all hover:scale-110"
                  title="Code source"
                >
                  <Github size={18} />
                </a>
              )}
            </div>
            
            <Link 
              href={`/projects/${project.slug}`}
              className="group/link flex items-center gap-2 text-sm font-black uppercase tracking-widest text-foreground hover:text-accent transition-colors"
            >
              Étude de cas <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

