import Link from "next/link";
import Image from "next/image";
import { createServiceClient } from "@/lib/supabase/service";
import BlogForm from "@/components/admin/BlogForm";
import DeleteEntityButton from "@/components/admin/DeleteEntityButton";
import TogglePublishButton from "@/components/admin/TogglePublishButton";
import type { Article } from "@/types";
import { BookOpen, Pencil, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

const categoryLabels: Record<string, string> = {
  developpement: "Développement",
  cybersecurite: "Cybersécurité",
  ia: "Intelligence Artificielle",
  entrepreneuriat: "Entrepreneuriat",
};

const categoryColors: Record<string, string> = {
  developpement: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  cybersecurite: "bg-red-500/10 text-red-400 border-red-500/20",
  ia: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  entrepreneuriat: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: { edit?: string };
}) {
  const supabase = createServiceClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  const editingArticle = searchParams.edit
    ? articles?.find((a) => a.id === searchParams.edit)
    : undefined;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-10">
      {/* Colonne de Gauche : Formulaire (35%) */}
      <div className="w-full lg:w-[35%] lg:shrink-0">
        <div className="sticky top-8">
          <BlogForm article={editingArticle as Article | undefined} />
          {editingArticle && (
            <Link
              href="/admin/blog"
              className="mt-4 block text-center text-sm font-medium text-foreground/50 hover:text-foreground transition-colors"
            >
              Annuler la modification
            </Link>
          )}
        </div>
      </div>

      {/* Colonne de Droite : Liste (65%) */}
      <div className="w-full lg:w-[65%] flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-foreground">Articles existants</h1>
          <div className="text-sm font-medium text-foreground/50 px-3 py-1 bg-white/5 rounded-full">
            {articles?.length || 0} article(s)
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {articles?.map((article: Article) => (
            <div
              key={article.id}
              className="group flex flex-col sm:flex-row gap-4 overflow-hidden rounded-2xl border border-white/10 bg-muted/30 backdrop-blur-sm p-4 transition-all hover:border-white/20 hover:bg-white/5"
            >
              {/* Thumbnail */}
              <div className="relative h-36 sm:h-28 w-full sm:w-44 shrink-0 overflow-hidden rounded-xl bg-black/20">
                {article.cover_image_url ? (
                  <Image
                    src={article.cover_image_url}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-foreground/20">
                    <BookOpen size={24} />
                  </div>
                )}
                <div
                  className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg ${
                    article.is_published
                      ? "bg-accent/80 text-white"
                      : "bg-black/80 text-foreground/60 border border-white/10"
                  }`}
                >
                  {article.is_published ? "Publié" : "Brouillon"}
                </div>
              </div>

              {/* Contenu */}
              <div className="flex flex-1 flex-col py-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-foreground line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      {article.category && (
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            categoryColors[article.category] || "bg-white/10 text-foreground/60 border-white/10"
                          }`}
                        >
                          {categoryLabels[article.category] || article.category}
                        </span>
                      )}
                      {article.created_at && (
                        <span className="flex items-center gap-1 text-xs text-foreground/40">
                          <Calendar size={10} />
                          {formatDate(article.created_at)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <TogglePublishButton
                      table="articles"
                      id={article.id}
                      isPublished={article.is_published}
                    />
                    <Link
                      href={`/admin/blog?edit=${article.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-foreground/60 transition-colors hover:bg-accent hover:text-white"
                      title="Modifier"
                    >
                      <Pencil size={14} />
                    </Link>
                    <DeleteEntityButton
                      table="articles"
                      id={article.id}
                      title={article.title}
                    />
                  </div>
                </div>

                {article.excerpt && (
                  <p className="mt-2 text-sm text-foreground/60 line-clamp-2">{article.excerpt}</p>
                )}
              </div>
            </div>
          ))}

          {(!articles || articles.length === 0) && (
            <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
              <BookOpen className="mx-auto mb-3 text-foreground/20" size={32} />
              <p className="text-foreground/50">Aucun article pour le moment.</p>
              <p className="text-xs text-foreground/30 mt-1">Créez votre premier article avec le formulaire ci-contre.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
