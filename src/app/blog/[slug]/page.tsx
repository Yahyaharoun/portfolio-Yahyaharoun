import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createServiceClient } from "@/lib/supabase/service";
import type { Article } from "@/types";
import { ArrowLeft, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const supabase = createServiceClient();
  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!article) return notFound();
  const a = article as Article;

  return (
    <article className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24 min-h-[calc(100vh-80px)]">
      <Link
        href="/blog"
        className="group mb-12 inline-flex items-center gap-2 text-sm font-semibold text-foreground/50 hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        Retour aux articles
      </Link>

      <header className="mb-14 text-center sm:text-left mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-6">
          <span className="px-4 py-1.5 text-xs uppercase tracking-widest text-accent font-bold bg-accent/10 rounded-full">
            {a.category || "Général"}
          </span>
          {a.published_at && (
            <span className="flex items-center gap-2 text-sm text-foreground/50 font-medium">
              <Calendar size={16} />
              {formatDate(a.published_at)}
            </span>
          )}
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.15] mb-6">
          {a.title}
        </h1>
        
        {a.excerpt && (
          <p className="text-xl sm:text-2xl text-foreground/60 leading-relaxed font-medium">
            {a.excerpt}
          </p>
        )}
      </header>

      {a.cover_image_url && (
        <div className="relative w-full aspect-[21/9] sm:aspect-video rounded-[2rem] overflow-hidden mb-16 shadow-2xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
          <Image 
            src={a.cover_image_url} 
            alt={a.title} 
            fill 
            unoptimized={true}
            className="object-cover" 
            priority
          />
        </div>
      )}

      <div className="prose prose-lg sm:prose-xl dark:prose-invert max-w-2xl mx-auto prose-headings:font-bold prose-headings:tracking-tight prose-a:text-accent hover:prose-a:text-accent/80 prose-img:rounded-3xl prose-img:shadow-2xl prose-p:leading-loose text-foreground/90 dark:text-foreground/80">
        {a.content}
      </div>
    </article>
  );
}

