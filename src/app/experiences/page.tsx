import { createClient } from "@/lib/supabase/server";
import type { Experience } from "@/types";

export const metadata = { title: "Expériences — Yahya Haroun" };

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

export default async function ExperiencesPage() {
  const supabase = createClient();
  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .eq("is_published", true)
    .order("start_date", { ascending: false });

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-bold text-foreground">Expériences</h1>
      <p className="mt-3 text-foreground/60">
        Parcours chronologique, avec dates précises pour chaque étape.
      </p>

      <div className="mt-12 space-y-8 border-l border-white/10 pl-8">
        {(experiences as Experience[] | null)?.map((exp) => (
          <div key={exp.id} className="relative">
            <span className="absolute -left-[2.35rem] top-1 h-3 w-3 rounded-full bg-accent" />
            <p className="text-xs uppercase tracking-wide text-accent">{exp.type}</p>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{exp.title}</h2>
            {exp.organization && <p className="text-sm text-foreground/50">{exp.organization}</p>}
            <p className="mt-1 text-xs text-foreground/40">
              {formatDate(exp.start_date)} — {exp.is_current ? "en cours" : exp.end_date ? formatDate(exp.end_date) : ""}
            </p>
            {exp.description && <p className="mt-3 text-sm leading-relaxed text-foreground/70">{exp.description}</p>}
          </div>
        ))}

        {(!experiences || experiences.length === 0) && (
          <p className="text-foreground/50">Aucune expérience publiée pour le moment.</p>
        )}
      </div>
    </section>
  );
}
