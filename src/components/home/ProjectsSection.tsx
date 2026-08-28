import { createClient } from "@/lib/supabase/server";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export async function ProjectsSection() {
  const supabase = createClient();
  let projects = null;
  
  try {
    const { data } = await supabase
      .from("projects")
      .select("*, technologies(*)")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .limit(3);
    projects = data;
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
  }

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-32 scroll-mt-20">
      <div className="mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Projets en vedette</h2>
          <div className="mt-4 h-1 w-20 rounded-full bg-accent/50"></div>
          <p className="mt-6 max-w-2xl text-foreground/70 sm:text-lg">
            Découvrez une sélection de mes réalisations récentes : SaaS, applications Offline-First et plateformes e-commerce.
          </p>
        </div>
        <Link href="/projects" className="group inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors">
          Voir tous les projets
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/20 dark:border-white/20 bg-black/5 dark:bg-white/5 p-12 text-center">
          <p className="text-foreground/50">Aucun projet publié pour le moment.</p>
        </div>
      )}
    </section>
  );
}
