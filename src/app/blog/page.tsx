import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { BookOpen, Calendar } from "lucide-react";
import type { Article } from "@/types";

export const dynamic = "force-dynamic";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export default async function BlogPage() {
  const supabase = createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl px-6 py-20 min-h-[calc(100vh-80px)]">
      <div className="mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground mb-4">
          Blog & Réflexions
        </h1>
        <p className="text-foreground/70 sm:text-lg max-w-2xl">
          Partages d'expériences sur le développement web, la cybersécurité, et la création de solutions pour l'Afrique.
        </p>
      </div>

      {articles && articles.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {articles.map((article: Article) => (
            <Link 
              key={article.id}
              href={`/blog/${article.slug}`} 
              className="group flex flex-col overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-muted hover:border-accent transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-accent/5"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/5 dark:bg-white/5">
                {article.cover_image_url ? (
                  <Image 
                    src={article.cover_image_url} 
                    alt={article.title}
                    fill
                    unoptimized={true}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-foreground/20 group-hover:text-accent/50 transition-colors">
                    <BookOpen size={48} strokeWidth={1} />
                  </div>
                )}
                
                {/* Category Badge over image */}
                {article.category && (
                  <div className="absolute top-4 left-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md bg-black/60 text-white border border-white/20 shadow-lg">
                    {article.category}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6 sm:p-8">
                {article.published_at && (
                  <div className="flex items-center gap-1.5 text-xs text-foreground/50 font-medium mb-3">
                    <Calendar size={12} />
                    {formatDate(article.published_at)}
                  </div>
                )}
                
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors line-clamp-2">
                  {article.title}
                </h2>
                
                {article.excerpt && (
                  <p className="text-foreground/70 line-clamp-3 text-sm leading-relaxed mb-6 flex-1">
                    {article.excerpt}
                  </p>
                )}
                
                <div className="mt-auto flex items-center text-sm font-bold text-accent">
                  Lire l'article <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center p-16 border border-dashed border-black/20 dark:border-white/20 rounded-3xl bg-black/5 dark:bg-white/5">
          <BookOpen className="mx-auto mb-4 text-foreground/20" size={48} />
          <p className="text-foreground/60 text-lg">Aucun article publié pour le moment.</p>
        </div>
      )}
    </div>
  );
}
