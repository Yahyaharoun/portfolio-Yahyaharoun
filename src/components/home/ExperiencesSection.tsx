import { createClient } from "@/lib/supabase/server";
import type { Experience } from "@/types";
import { Briefcase, GraduationCap, Building2, Rocket, Store, MapPin, CalendarDays } from "lucide-react";

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

export async function ExperiencesSection() {
  const supabase = createClient();
  let experiences = null;
  
  try {
    const { data } = await supabase
      .from("experiences")
      .select("*")
      .eq("is_published", true)
      .order("start_date", { ascending: false });
    experiences = data;
  } catch (error) {
    console.error("Erreur Experiences:", error);
  }

  return (
    <section id="experiences" className="mx-auto max-w-5xl px-4 sm:px-6 py-24 sm:py-32 scroll-mt-20">
      <div className="mb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
          <Briefcase size={16} />
          <span>Parcours Professionnel</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-4">Expériences</h2>
        <div className="mt-4 mx-auto h-1 w-20 rounded-full bg-accent/50 mb-6"></div>
        <p className="mx-auto max-w-2xl text-foreground/70 sm:text-lg">
          Mon évolution depuis la gestion sur le terrain jusqu'au développement de solutions logicielles professionnelles.
        </p>
      </div>

      <div className="relative mx-auto max-w-3xl">
        {/* Ligne centrale (visible uniquement sur desktop) */}
        <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/0 via-accent/30 to-accent/0 transform sm:-translate-x-1/2 hidden sm:block"></div>
        {/* Ligne gauche (visible uniquement sur mobile) */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent/0 via-accent/30 to-accent/0 sm:hidden"></div>

        <div className="space-y-12 sm:space-y-16">
          {(experiences as Experience[] | null)?.map((exp, index) => {
            const isEven = index % 2 === 0;
            const typeColor = getColorForType(exp.type);
            
            return (
              <div key={exp.id} className={`relative flex flex-col sm:flex-row items-start sm:items-center ${isEven ? 'sm:flex-row-reverse' : ''} group pl-24 sm:pl-0`}>
                
                {/* Point central de la timeline */}
                <div className={`absolute left-4 sm:left-1/2 top-0 sm:top-1/2 flex h-10 w-10 shrink-0 transform -translate-x-1/2 sm:-translate-y-1/2 items-center justify-center rounded-full border-4 border-background ${typeColor} shadow-[0_0_15px_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform duration-300 z-10`}>
                  {getIconForType(exp.type)}
                </div>

                {/* Contenu (Carte) */}
                <div className={`w-full sm:w-1/2 ${isEven ? 'sm:pl-12' : 'sm:pr-12'}`}>
                  <div className="relative rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] p-6 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors shadow-sm hover:shadow-md">
                    
                    {/* Flèche pour desktop */}
                    <div className={`hidden sm:block absolute top-1/2 h-4 w-4 transform -translate-y-1/2 rotate-45 border-b border-l border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] group-hover:bg-black/[0.04] dark:group-hover:bg-white/[0.04] transition-colors ${
                      isEven ? '-left-2 border-r-0 border-t-0' : '-right-2 border-l-0 border-b-0 rotate-[225deg]'
                    }`}></div>
                    
                    {/* Flèche pour mobile */}
                    <div className="sm:hidden absolute top-4 -left-2 h-4 w-4 rotate-45 border-b border-l border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] group-hover:bg-black/[0.04] dark:group-hover:bg-white/[0.04] transition-colors"></div>

                    <div className="flex flex-col gap-2">
                      <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${typeColor}`}>
                        {exp.type}
                      </span>
                      
                      <h3 className="text-xl font-bold text-foreground mt-1 group-hover:text-accent transition-colors">
                        {exp.title}
                      </h3>
                      
                      {exp.organization && (
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground/80">
                          <Building2 size={14} className="text-foreground/50" />
                          {exp.organization}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-foreground/50 mt-1">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          <span>{formatDate(exp.start_date)} — {exp.is_current ? "Aujourd'hui" : exp.end_date ? formatDate(exp.end_date) : ""}</span>
                        </div>
                      </div>
                      
                      {exp.description && (
                        <p className="mt-4 text-sm leading-relaxed text-foreground/70">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {(!experiences || experiences.length === 0) && (
          <p className="text-foreground/50 text-center py-8">Aucune expérience publiée pour le moment.</p>
        )}
      </div>
    </section>
  );
}
