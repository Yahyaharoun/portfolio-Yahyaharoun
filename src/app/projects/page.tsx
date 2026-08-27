export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import ProjectCard from "@/components/ProjectCard";

export const metadata = { title: "Projets — Yahya Haroun" };

export default async function ProjectsPage() {
  const supabase = createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*, technologies(*)")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Mes Projets</h1>
        <p className="mt-4 text-foreground/70">
          Découvrez mes réalisations récentes : SaaS, applications Offline-First et plateformes e-commerce.
        </p>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-center text-foreground/50">Aucun projet publié pour le moment.</p>
      )}
    </section>
  );
}
