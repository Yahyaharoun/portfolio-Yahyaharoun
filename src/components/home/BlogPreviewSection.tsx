"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Article } from "@/types";
import { BookOpen, ArrowRight, Clock, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StackedCardCarousel } from "@/components/ui/StackedCardCarousel";

function calculateReadTime(text: string) {
  const wordsPerMinute = 200;
  const noOfWords = text.split(/\s/g).length;
  const minutes = noOfWords / wordsPerMinute;
  const readTime = Math.ceil(minutes);
  return readTime;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

const defaultArticles: Article[] = [
  {
    id: "art1",
    title: "Comment construire une PWA moderne",
    slug: "comment-construire-une-pwa",
    content: "Voici les étapes pour construire une application web progressive avec Next.js et Tailwind CSS...",
    excerpt: "Découvrez comment créer une Progressive Web App performante.",
    category: "developpement",
    cover_image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "art2",
    title: "Les architectures Offline-First",
    slug: "architectures-offline-first",
    content: "L'offline-first est crucial pour les applications ciblant des zones avec une mauvaise connectivité...",
    excerpt: "Pourquoi et comment concevoir des applications Offline-First.",
    category: "entrepreneuriat",
    cover_image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "art3",
    title: "Sécurité et DevSecOps",
    slug: "securite-devsecops",
    content: "Intégrer la sécurité dès la conception de l'application est aujourd'hui indispensable...",
    excerpt: "L'importance de la sécurité dans le cycle de développement.",
    category: "cybersecurite",
    cover_image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }
];

export function BlogPreviewSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      const supabase = createClient();
      try {
        const { data } = await supabase
          .from("articles")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(5);
        
        if (data && data.length > 0) {
          setArticles(data as Article[]);
        } else {
          setArticles(defaultArticles);
        }
      } catch (error) {
        console.error("Erreur BlogPreview:", error);
        setArticles(defaultArticles);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  return (
    <section id="blog" className="mx-auto max-w-7xl px-6 py-32 scroll-mt-20 overflow-hidden relative">
      <div className="mb-20 flex flex-col sm:flex-row sm:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-5 py-2 text-sm font-semibold text-accent mb-6"
          >
            <BookOpen size={16} />
            <span>Réflexions & Partages</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6"
          >
            Derniers Articles
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            className="mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-accent to-purple-500 mb-6 origin-left"
          ></motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Link href="/blog" className="group flex items-center justify-center gap-3 rounded-full border-2 border-black/10 dark:border-white/10 bg-transparent text-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:border-foreground/30 px-8 py-4 font-bold text-sm uppercase tracking-wider transition-all">
            Voir le blog
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      <div className="relative z-10 min-h-[450px]">
        {loading ? (
          <div className="flex h-[450px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          </div>
        ) : (
          <StackedCardCarousel
            items={articles}
            keyExtractor={(a) => a.id}
            autoPlayInterval={6000}
            renderItem={(article, index, isVisible) => {
              const readTime = calculateReadTime(article.content);
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
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-purple-500/20" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-background/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent shadow-sm">
                        {article.category || "Général"}
                      </span>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="flex flex-col flex-1 p-6 sm:p-8 bg-gradient-to-br from-black/50 to-transparent">
                    <div className="flex items-center gap-4 text-xs font-bold text-white/50 uppercase tracking-widest mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {article.published_at ? formatDate(article.published_at) : "Brouillon"}
                      </div>
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
                      {article.excerpt || article.content.substring(0, 150).replace(/[#*`_~]/g, '') + "..."}
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
        )}
      </div>
    </section>
  );
}
