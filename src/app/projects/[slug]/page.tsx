import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types";

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*, technologies(*), project_images(*)")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!project) return notFound();

  const p = project as Project;

  // Enregistrement analytique (best-effort, ne bloque pas l'affichage)
  await supabase.from("analytics").insert({
    event_type: "project_view",
    page_path: `/projects/${p.slug}`,
  });

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-xs uppercase tracking-wide text-accent">{p.type}</p>
      <h1 className="mt-2 text-3xl font-bold text-foreground">{p.title}</h1>

      {p.cover_image_url && (
        <div className="relative mt-8 h-80 w-full overflow-hidden rounded-2xl">
          <Image src={p.cover_image_url} alt={p.title} fill className="object-cover" />
        </div>
      )}

      {p.technologies && p.technologies.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {p.technologies.map((t) => (
            <span key={t.id} className="rounded-full bg-white/5 px-3 py-1 text-xs text-foreground/70">
              {t.name}
            </span>
          ))}
        </div>
      )}

      <div className="mt-10 space-y-8 text-foreground/70">
        {p.context && (
          <div>
            <h2 className="text-lg font-semibold text-foreground">Contexte</h2>
            <p className="mt-2 leading-relaxed">{p.context}</p>
          </div>
        )}
        {p.solution && (
          <div>
            <h2 className="text-lg font-semibold text-foreground">Solution</h2>
            <p className="mt-2 leading-relaxed">{p.solution}</p>
          </div>
        )}
        {p.description && (
          <div>
            <h2 className="text-lg font-semibold text-foreground">Fonctionnalités clés</h2>
            <p className="mt-2 leading-relaxed">{p.description}</p>
          </div>
        )}
        {p.impact && (
          <div>
            <h2 className="text-lg font-semibold text-foreground">Résultats / impact</h2>
            <p className="mt-2 leading-relaxed">{p.impact}</p>
          </div>
        )}
      </div>

      <div className="mt-10 flex gap-4">
        {p.demo_url && (
          <a href={p.demo_url} target="_blank" rel="noreferrer" className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white">
            Voir la démo
          </a>
        )}
        {p.repo_url && (
          <a href={p.repo_url} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-foreground">
            Code source
          </a>
        )}
      </div>

      {p.project_images && p.project_images.length > 0 && (
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {p.project_images.map((img) => (
            <div key={img.id} className="relative h-56 overflow-hidden rounded-xl">
              <Image src={img.image_url} alt={img.caption ?? p.title} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
