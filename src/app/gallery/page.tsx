import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/types";

export const metadata = { title: "Galerie — Yahya Haroun" };

export default async function GalleryPage() {
  const supabase = createClient();
  const { data: items } = await supabase
    .from("gallery")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-3xl font-bold text-foreground">Galerie</h1>
      <p className="mt-3 text-foreground/60">Conférences, formations, événements et photos professionnelles.</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(items as GalleryItem[] | null)?.map((item) => (
          <div key={item.id} className="group relative h-64 overflow-hidden rounded-xl bg-muted">
            {item.media_type === "image" ? (
              <Image
                src={item.media_url}
                alt={item.title ?? "Photo"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <video src={item.media_url} controls className="h-full w-full object-cover" />
            )}
            {item.title && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-sm text-white">{item.title}</p>
              </div>
            )}
          </div>
        ))}
        {(!items || items.length === 0) && (
          <p className="text-foreground/50">Aucun média publié pour le moment.</p>
        )}
      </div>
    </section>
  );
}
