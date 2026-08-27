"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/types";
import { Globe, Github, ArrowRight } from "lucide-react";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-muted transition-transform duration-300 hover:border-accent/50 shadow-sm hover:shadow-xl"
    >
      <Link href={`/projects/${project.slug}`} className="block relative h-48 w-full overflow-hidden bg-black/5 dark:bg-white/5">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            unoptimized={true}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-foreground/30 font-semibold">
            {project.title}
          </div>
        )}
      </Link>
      
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <Link href={`/projects/${project.slug}`} className="block mb-4">
          <p className="text-xs uppercase tracking-wide text-accent font-bold">{project.type}</p>
          <h3 className="mt-1.5 text-xl font-bold text-foreground group-hover:text-accent transition-colors">{project.title}</h3>
          <p className="mt-2.5 line-clamp-2 text-sm text-foreground/70 leading-relaxed">{project.description}</p>
        </Link>
        
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech.id}
                className="rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 px-2.5 py-1 text-[11px] font-semibold text-foreground/70"
              >
                {tech.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-3">
          <div className="flex gap-2">
            {project.demo_url && (
              <a 
                href={project.demo_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 rounded-full bg-accent text-white hover:bg-accent/90 transition-colors shadow-md hover:shadow-lg hover:shadow-accent/20"
                title="Voir le site"
              >
                <Globe size={16} />
              </a>
            )}
            {project.repo_url && (
              <a 
                href={project.repo_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 rounded-full bg-black/5 dark:bg-white/5 text-foreground hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                title="Code source"
              >
                <Github size={16} />
              </a>
            )}
          </div>
          
          <Link 
            href={`/projects/${project.slug}`}
            className="flex items-center gap-1.5 text-xs font-bold text-foreground/50 hover:text-accent transition-colors"
          >
            Étude de cas <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

