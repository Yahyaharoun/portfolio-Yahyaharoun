import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/types";
import { Camera } from "lucide-react";

export async function GallerySection() {
  const supabase = createClient();
  let items = null;
  
  try {
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .limit(6);
    items = data;
  } catch (error) {
    console.error("Erreur Gallery:", error);
  }

  return (
    <section id="gallery" className="mx-auto max-w-6xl px-6 py-32 scroll-mt-20">
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
          <Camera size={16} />
          <span>Moments & Événements</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Galerie</h2>
        <div className="mt-4 mx-auto h-1 w-20 rounded-full bg-accent/50 mb-6"></div>
        <p className="mx-auto max-w-2xl text-foreground/70 sm:text-lg">
          Quelques moments capturés lors de conférences, de formations ou sur le terrain.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(items as GalleryItem[] | null)?.map((item) => (
          <div key={item.id} className="group relative h-64 overflow-hidden rounded-2xl bg-muted shadow-md hover:shadow-xl transition-all duration-300">
            {item.media_type === "image" ? (
              <Image
                src={item.media_url}
                alt={item.title ?? "Photo"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <video src={item.media_url} controls className="h-full w-full object-cover" />
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
            
            {item.title && (
              <div className="absolute inset-x-0 bottom-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-base font-semibold text-white drop-shadow-md">{item.title}</p>
              </div>
            )}
          </div>
        ))}
        
        {(!items || items.length === 0) && (
          <div className="col-span-full rounded-2xl border border-dashed border-white/20 dark:border-white/20 bg-black/5 dark:bg-white/5 p-12 text-center">
            <p className="text-foreground/50">Aucun média publié pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
