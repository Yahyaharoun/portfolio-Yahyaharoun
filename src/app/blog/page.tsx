import { createClient } from "@/lib/supabase/client";
import type { Article } from "@/types";
import BlogCarouselClient from "./BlogCarouselClient";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const supabase = createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 min-h-[calc(100vh-80px)] overflow-hidden">
      <div className="mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground mb-4">
          Blog & Réflexions
        </h1>
        <p className="text-foreground/70 sm:text-lg max-w-2xl">
          Partages d'expériences sur le développement web, la cybersécurité, et la création de solutions pour l'Afrique.
        </p>
      </div>

      <BlogCarouselClient articles={articles || []} />
    </div>
  );
}
