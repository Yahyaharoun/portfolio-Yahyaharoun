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
            <h2 className="text-lg font-bold text-accent mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">🎯</span> Contexte & Problème
            </h2>
            <p className="leading-relaxed">{p.context}</p>
          </div>
        )}
        {p.challenges && (
          <div>
            <h2 className="text-lg font-bold text-accent mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">🚧</span> Défis rencontrés
            </h2>
            <p className="leading-relaxed">{p.challenges}</p>
          </div>
        )}
        {p.architecture && (
          <div>
            <h2 className="text-lg font-bold text-accent mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">🏗️</span> Architecture & Technique
            </h2>
            <p className="leading-relaxed">{p.architecture}</p>
          </div>
        )}
        {p.solution && (
          <div>
            <h2 className="text-lg font-bold text-accent mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">💡</span> Solution apportée
            </h2>
            <p className="leading-relaxed">{p.solution}</p>
          </div>
        )}
        {(p.results || p.impact) && (
          <div>
            <h2 className="text-lg font-bold text-accent mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">📈</span> Impact & Résultats
            </h2>
            <p className="leading-relaxed">{p.results || p.impact}</p>
          </div>
        )}
      </div>

      {p.video_url && (
        <div className="mt-12 rounded-3xl border border-white/10 overflow-hidden bg-black/5 dark:bg-white/5 p-4 sm:p-6 backdrop-blur-md shadow-xl">
          <h2 className="mb-4 text-xl font-bold text-foreground">Démonstration Vidéo</h2>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
            {/* Si c'est un lien YouTube, on peut l'embed, sinon on met un simple lien, ici on l'affiche s'il y a un composant video ou un embed iframe. Pour l'instant on met un iframe s'il semble être YouTube */}
            {p.video_url.includes("youtube.com") || p.video_url.includes("youtu.be") ? (
              <iframe 
                src={p.video_url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} 
                title="Démonstration" 
                className="absolute inset-0 h-full w-full border-none"
                allowFullScreen
              />
            ) : (
              <a href={p.video_url} target="_blank" rel="noreferrer" className="flex h-full w-full flex-col items-center justify-center gap-4 text-foreground/50 hover:text-accent transition-colors">
                <span className="rounded-full bg-white/10 p-4"><svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></span>
                Regarder la vidéo
              </a>
            )}
          </div>
        </div>
      )}

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
