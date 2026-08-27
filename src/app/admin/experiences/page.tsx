import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/service";
import { Building2, GraduationCap, Briefcase, Rocket, Pencil, Calendar } from "lucide-react";
import DeleteExperienceButton from "@/components/admin/DeleteExperienceButton";
import ExperienceForm from "@/components/admin/ExperienceForm";

export const dynamic = "force-dynamic";

export default async function AdminExperiencesPage({
  searchParams,
}: {
  searchParams: { edit?: string };
}) {
  const supabase = createServiceClient();
  const { data: experiences } = await supabase.from("experiences").select("*").order("start_date", { ascending: false });

  let editingExperience = undefined;
  if (searchParams.edit) {
    editingExperience = experiences?.find(e => e.id === searchParams.edit);
  }

  const getIconForType = (t: string | null) => {
    switch (t) {
      case "formation": return <GraduationCap size={16} />;
      case "entrepreneuriat": return <Rocket size={16} />;
      case "stage": return <Briefcase size={16} />;
      default: return <Building2 size={16} />;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-10">
      
      {/* Colonne de Gauche : Formulaire (35%) */}
      <div className="w-full lg:w-[35%] lg:shrink-0">
        <div className="sticky top-8">
          <ExperienceForm experience={editingExperience} />
          {editingExperience && (
            <Link 
              href="/admin/experiences" 
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
          <h1 className="text-2xl font-bold text-foreground">Expériences</h1>
          <div className="text-sm font-medium text-foreground/50 px-3 py-1 bg-white/5 rounded-full">
            {experiences?.length || 0} parcours
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {experiences?.map((exp) => (
            <div
              key={exp.id}
              className="group flex flex-col sm:flex-row gap-4 overflow-hidden rounded-2xl border border-white/10 bg-muted/30 backdrop-blur-sm p-4 sm:p-5 transition-all hover:border-white/20 hover:bg-white/5"
            >
              <div className="flex flex-1 items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-accent border border-white/10">
                  {getIconForType(exp.type)}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground line-clamp-1">{exp.title}</h3>
                      <p className="mt-1 text-sm font-medium text-accent">{exp.organization}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/experiences?edit=${exp.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-foreground/60 transition-colors hover:bg-accent hover:text-white"
                        title="Modifier"
                      >
                        <Pencil size={14} />
                      </Link>
                      <DeleteExperienceButton id={exp.id} title={exp.title} />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-foreground/60">
                    <Calendar size={12} />
                    <span>
                      {formatDate(exp.start_date)} - {exp.is_current ? "Présent" : formatDate(exp.end_date)}
                    </span>
                    <span className="mx-1">•</span>
                    <span className={`px-2 py-0.5 rounded-full border uppercase tracking-wider text-[10px] font-bold ${exp.is_published ? "bg-accent/10 border-accent/20 text-accent" : "bg-black/40 border-white/10 text-foreground/50"}`}>
                      {exp.is_published ? "Publié" : "Masqué"}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="mt-3 text-sm text-foreground/70 line-clamp-2">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {(!experiences || experiences.length === 0) && (
            <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
              <p className="text-foreground/60">Aucune expérience trouvée.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
