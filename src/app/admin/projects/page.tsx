import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/service";
import { Plus, ExternalLink, Pencil } from "lucide-react";
import Image from "next/image";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";
import ProjectForm from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: { edit?: string };
}) {
  const supabase = createServiceClient();
  const { data: projects } = await supabase.from("projects").select("*").order("created_at", { ascending: false });

  let editingProject = undefined;
  if (searchParams.edit) {
    editingProject = projects?.find(p => p.id === searchParams.edit);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "termine": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "en_cours": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "archive": return "bg-foreground/10 text-foreground/70 border-foreground/20";
      default: return "bg-foreground/10 text-foreground/70 border-foreground/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "termine": return "Terminé";
      case "en_cours": return "En cours";
      case "archive": return "Archivé";
      default: return "Inconnu";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-10">
      
      {/* Colonne de Gauche : Formulaire (35%) */}
      <div className="w-full lg:w-[35%] lg:shrink-0">
        <div className="sticky top-8">
          <ProjectForm project={editingProject} />
          {editingProject && (
            <Link 
              href="/admin/projects" 
              className="mt-4 block text-center text-sm font-medium text-foreground/50 hover:text-foreground transition-colors"
            >
              Annuler la modification
            </Link>
          )}
        </div>
      </div>

      {/* Colonne de Droite : Liste (65%) */}
      <div className="w-full lg:w-[65%] flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-foreground">Projets existants</h1>
          <div className="text-sm font-medium text-foreground/50 px-3 py-1 bg-white/5 rounded-full">
            {projects?.length || 0} projet(s)
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {projects?.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col sm:flex-row gap-4 overflow-hidden rounded-2xl border border-white/10 bg-muted/30 backdrop-blur-sm p-4 transition-all hover:border-white/20 hover:bg-white/5"
            >
              {/* Image Thumbnail */}
              <div className="relative h-40 sm:h-32 w-full sm:w-48 shrink-0 overflow-hidden rounded-xl bg-black/20">
                {project.cover_image_url ? (
                  <Image src={project.cover_image_url} alt={project.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-foreground/20">Sans image</div>
                )}
                
                <div className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg ${project.is_published ? "bg-accent/80 text-white" : "bg-black/80 text-foreground/60 border border-white/10"}`}>
                  {project.is_published ? "Publié" : "Brouillon"}
                </div>
              </div>

              {/* Contenu et Actions */}
              <div className="flex flex-1 flex-col py-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground line-clamp-1">{project.title}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(project.status || 'en_cours')}`}>
                        {getStatusLabel(project.status || 'en_cours')}
                      </span>
                      <span className="text-xs text-foreground/50 truncate max-w-[150px]">{project.type}</span>
                    </div>
                  </div>
                  
                  {/* Actions (Desktop alignées en haut à droite) */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/projects?edit=${project.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-foreground/60 transition-colors hover:bg-accent hover:text-white"
                      title="Modifier"
                    >
                      <Pencil size={14} />
                    </Link>
                    <DeleteProjectButton projectId={project.id} projectTitle={project.title} />
                  </div>
                </div>

                <p className="mt-3 text-sm text-foreground/70 line-clamp-2">
                  {project.description || project.context || "Aucune description"}
                </p>

                {project.demo_url && (
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="mt-auto flex items-center gap-1.5 text-xs font-medium text-accent hover:underline w-fit pt-4 sm:pt-0">
                    <ExternalLink size={12} /> Voir la démo
                  </a>
                )}
              </div>
            </div>
          ))}

          {(!projects || projects.length === 0) && (
            <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
              <p className="text-foreground/60">Aucun projet trouvé.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
