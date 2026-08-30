import { createClient } from "@/lib/supabase/server";
import { Briefcase, GraduationCap, Target } from "lucide-react";

export const metadata = { title: "Expériences — Yahya Haroun" };

type UnifiedTimelineItem = {
  id: string;
  typeLabel: string;
  title: string;
  organization: string;
  dateStr: string;
  description: string | null;
  sortDate: number;
};

export default async function ExperiencesPage() {
  const supabase = createClient();
  
  const [
    { data: evos },
    { data: exps },
    { data: certs }
  ] = await Promise.all([
    supabase.from("evolutions").select("*").eq("is_published", true),
    supabase.from("experiences").select("*").eq("is_published", true),
    supabase.from("certifications").select("*").eq("is_published", true)
  ]);

  const items: UnifiedTimelineItem[] = [];

  // Formations (Evolutions)
  if (evos) {
    evos.forEach((e: any) => {
      items.push({
        id: `evo_${e.id}`,
        typeLabel: "Formation",
        title: e.title,
        organization: e.organization,
        description: e.description,
        dateStr: e.year,
        sortDate: parseInt(e.year) || 0
      });
    });
  }

  // Experiences
  if (exps) {
    exps.forEach((e: any) => {
      const year = e.start_date ? new Date(e.start_date).getFullYear().toString() : "";
      
      let dateDisplay = "";
      if (e.start_date) {
        const start = new Date(e.start_date).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
        const end = e.is_current ? "en cours" : (e.end_date ? new Date(e.end_date).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : "");
        dateDisplay = `${start} — ${end}`;
      }

      items.push({
        id: `exp_${e.id}`,
        typeLabel: e.type || "Expérience",
        title: e.title,
        organization: e.organization || "",
        description: e.description,
        dateStr: dateDisplay || year,
        sortDate: e.start_date ? new Date(e.start_date).getTime() : 0
      });
    });
  }

  // Certifications
  if (certs) {
    certs.forEach((c: any) => {
      const year = c.issue_date ? new Date(c.issue_date).getFullYear().toString() : "";
      const display = c.issue_date ? new Date(c.issue_date).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : year;
      items.push({
        id: `cert_${c.id}`,
        typeLabel: "Certification",
        title: c.title,
        organization: c.issuer || "",
        description: null,
        dateStr: display,
        sortDate: c.issue_date ? new Date(c.issue_date).getTime() : 0
      });
    });
  }

  // Sort descending
  items.sort((a, b) => b.sortDate - a.sortDate);

  const getIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("formation")) return <GraduationCap size={16} />;
    if (t.includes("certif")) return <Target size={16} />;
    return <Briefcase size={16} />;
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-bold text-foreground">Expériences</h1>
      <p className="mt-3 text-foreground/60">
        Parcours complet, réunissant mes expériences, formations et certifications.
      </p>

      <div className="mt-12 space-y-10 border-l-2 border-white/10 pl-8 ml-3 relative">
        {items.map((item) => (
          <div key={item.id} className="relative">
            <div className="absolute -left-[2.85rem] top-0 h-10 w-10 rounded-full bg-black/5 dark:bg-white/5 border border-white/10 flex items-center justify-center text-accent backdrop-blur-sm z-10">
              {getIcon(item.typeLabel)}
            </div>
            
            <div className="bg-black/5 dark:bg-white/5 border border-white/10 p-6 rounded-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs uppercase tracking-widest font-bold mb-3">
                {item.typeLabel}
              </span>
              
              <h2 className="text-xl font-bold text-foreground leading-tight">{item.title}</h2>
              {item.organization && <p className="mt-1 font-medium text-foreground/80">{item.organization}</p>}
              
              <p className="mt-2 text-sm text-foreground/50 flex items-center gap-2">
                {item.dateStr}
              </p>
              
              {item.description && (
                <p className="mt-4 text-sm leading-relaxed text-foreground/70 whitespace-pre-line">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-foreground/50">Aucun élément publié pour le moment.</p>
        )}
      </div>
    </section>
  );
}
