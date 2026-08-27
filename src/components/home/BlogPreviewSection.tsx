import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/types";
import { BookOpen, ArrowRight } from "lucide-react";

export async function BlogPreviewSection() {
  const supabase = createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <section id="blog" className="mx-auto max-w-5xl px-6 py-32 scroll-mt-20">
      <div className="mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
            <BookOpen size={16} />
            <span>Réflexions & Partages</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Blog</h2>
          <div className="mt-4 h-1 w-20 rounded-full bg-accent/50 mb-6"></div>
          <p className="max-w-2xl text-foreground/70 sm:text-lg">
            Mes retours d'expérience sur le développement, la cybersécurité et l'écosystème tech en Afrique.
          </p>
        </div>
        <Link href="/blog" className="group inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors bg-accent/10 hover:bg-accent/20 px-6 py-3 rounded-full border border-accent/20">
          Lire tous les articles
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {articles && articles.length > 0 ? (
        <div className="grid gap-6">
          {articles.map((article: Article) => (
            <Link 
              key={article.id} 
              href={`/blog/${article.slug}`} 
              className="group block p-8 rounded-3xl border border-white/5 dark:border-white/5 border-black/5 bg-background/50 hover:bg-muted/50 hover:border-accent/50 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-accent font-semibold mb-3">{article.category || "Général"}</p>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">{article.title}</h3>
                  <p className="text-foreground/60 line-clamp-2 max-w-3xl leading-relaxed">
                    {article.content.substring(0, 200).replace(/[#*`_~]/g, '')}...
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-black/5 dark:bg-white/5 group-hover:bg-accent/10 group-hover:text-accent text-foreground/40 transition-colors">
                  <ArrowRight size={20} className="transform group-hover:-rotate-45 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-12 text-center">
          <p className="text-foreground/50">Aucun article publié pour le moment.</p>
        </div>
      )}
    </section>
  );
}
