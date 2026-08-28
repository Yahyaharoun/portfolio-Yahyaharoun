"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Article } from "@/types";
import { BookOpen, ArrowRight, Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";

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

export function BlogPreviewSection() {
  const [articles, setArticles] = useState<Article[] | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      const supabase = createClient();
      try {
        const { data } = await supabase
          .from("articles")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(3);
        setArticles(data as Article[]);
      } catch (error) {
        console.error("Erreur BlogPreview:", error);
      }
    }
    fetchArticles();
  }, []);

  return (
    <section id="blog" className="mx-auto max-w-7xl px-6 py-32 scroll-mt-20 overflow-hidden">
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

      <div className="relative z-10">
        {articles ? (
          articles.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article: Article, index: number) => {
                const readTime = calculateReadTime(article.content);
                return (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                  >
                    <Link 
                      href={`/blog/${article.slug}`} 
                      className="group flex flex-col h-full rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-accent/50 hover:-translate-y-2 backdrop-blur-sm"
                    >
                      {/* Image de couverture */}
                      <div className="relative h-64 w-full overflow-hidden bg-muted">
                        {article.cover_image_url ? (
                          <Image
                            src={article.cover_image_url}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            unoptimized
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-purple-500/20" />
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                        <div className="absolute top-4 left-4">
                          <span className="rounded-full bg-background/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent shadow-sm">
                            {article.category || "Général"}
                          </span>
                        </div>
                      </div>

                      {/* Contenu */}
                      <div className="flex flex-col flex-1 p-8">
                        <div className="flex items-center gap-4 text-xs font-bold text-foreground/50 uppercase tracking-widest mb-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            {article.published_at ? formatDate(article.published_at) : "Brouillon"}
                          </div>
                          <div className="h-1 w-1 rounded-full bg-foreground/30"></div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {readTime} min
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-extrabold text-foreground mb-4 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                          {article.title}
                        </h3>
                        
                        <p className="text-foreground/70 line-clamp-3 leading-relaxed font-medium mb-6 flex-1">
                          {article.excerpt || article.content.substring(0, 150).replace(/[#*`_~]/g, '') + "..."}
                        </p>
                        
                        <div className="mt-auto pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                          <span className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">
                            Lire l'article
                          </span>
                          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-black/5 dark:bg-white/10 group-hover:bg-accent group-hover:text-white text-foreground/50 transition-all duration-300">
                            <ArrowRight size={18} className="transform group-hover:-rotate-45 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-16 text-center backdrop-blur-sm">
              <p className="text-foreground/50 font-medium text-lg">Aucun article publié pour le moment.</p>
            </div>
          )
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[500px] rounded-3xl bg-black/5 dark:bg-white/5 animate-pulse border border-black/10 dark:border-white/10" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
