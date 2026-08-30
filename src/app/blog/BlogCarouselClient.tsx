"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import type { Article } from "@/types";
import { StackedCardCarousel } from "@/components/ui/StackedCardCarousel";

interface BlogCarouselClientProps {
  articles: Article[];
}

function calculateReadTime(text: string) {
  const wordsPerMinute = 200;
  const noOfWords = text.split(/\s/g).length;
  const minutes = noOfWords / wordsPerMinute;
  const readTime = Math.ceil(minutes);
  return readTime;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogCarouselClient({ articles }: BlogCarouselClientProps) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center p-16 border border-dashed border-black/20 dark:border-white/20 rounded-3xl bg-black/5 dark:bg-white/5">
        <BookOpen className="mx-auto mb-4 text-foreground/20" size={48} />
        <p className="text-foreground/60 text-lg">Aucun article publié pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full min-h-[450px]">
      <StackedCardCarousel
        items={articles}
        keyExtractor={(a) => a.id}
        autoPlayInterval={0}
        renderItem={(article, index, isVisible) => {
          const readTime = article.content ? calculateReadTime(article.content) : 3;
          return (
            <Link
              href={`/blog/${article.slug}`}
              className={`group relative flex h-[450px] w-full flex-col overflow-hidden rounded-[2.5rem] border border-white/10 transition-all duration-500 shadow-2xl
                ${isVisible 
                  ? 'bg-black/80 dark:bg-black/60 backdrop-blur-xl ring-2 ring-accent/30 hover:shadow-[0_0_40px_rgba(109,93,252,0.2)] hover:-translate-y-2' 
                  : 'bg-black/40 dark:bg-white/5 backdrop-blur-sm'
                }
              `}
              tabIndex={isVisible ? 0 : -1}
            >
              {/* Image de couverture */}
              <div className="relative h-[200px] w-full overflow-hidden bg-muted flex-shrink-0">
                {article.cover_image_url ? (
                  <Image
                    src={article.cover_image_url}
                    alt={article.title}
                    fill
                    className={`object-cover transition-transform duration-700 ${isVisible ? 'group-hover:scale-110' : ''}`}
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/20 to-purple-500/20 text-foreground/20">
                    <BookOpen size={48} strokeWidth={1} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                {article.category && (
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-background/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent shadow-sm">
                      {article.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Contenu */}
              <div className="flex flex-col flex-1 p-6 sm:p-8 bg-gradient-to-br from-black/50 to-transparent">
                <div className="flex items-center gap-4 text-xs font-bold text-white/50 uppercase tracking-widest mb-4">
                  {article.published_at && (
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {formatDate(article.published_at)}
                    </div>
                  )}
                  <div className="h-1 w-1 rounded-full bg-white/30"></div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {readTime} min
                  </div>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-3 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-white/70 line-clamp-2 leading-relaxed font-medium mb-4 flex-1 text-sm sm:text-base">
                  {article.excerpt || (article.content ? article.content.substring(0, 150).replace(/[#*`_~]/g, '') + "..." : "")}
                </p>
                
                {isVisible && (
                  <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-sm font-bold text-white group-hover:text-accent transition-colors">
                      Lire l'article
                    </span>
                    <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-white/10 group-hover:bg-accent group-hover:text-white text-white/70 transition-all duration-300">
                      <ArrowRight size={18} className="transform group-hover:-rotate-45 transition-transform duration-300" />
                    </div>
                  </div>
                )}
              </div>
            </Link>
          );
        }}
      />
    </div>
  );
}
