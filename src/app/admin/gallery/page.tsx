import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/service";
import { Plus, Pencil } from "lucide-react";
import Image from "next/image";
import DeleteGalleryItemButton from "@/components/admin/DeleteGalleryItemButton";
import GalleryForm from "@/components/admin/GalleryForm";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: { edit?: string };
}) {
  const supabase = createServiceClient();
  const { data: galleryItems } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });

  let editingItem = undefined;
  if (searchParams.edit) {
    editingItem = galleryItems?.find(g => g.id === searchParams.edit);
  }

  const getTypeLabel = (category: string | null) => {
    switch (category) {
      case "certification": return "Certification";
      case "diplome": return "Diplôme";
      case "recompense": return "Récompense";
      case "media": return "Média / Conférence";
      default: return "Autre";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-10">
      
      {/* Colonne de Gauche : Formulaire (35%) */}
      <div className="w-full lg:w-[35%] lg:shrink-0">
        <div className="sticky top-8">
          <GalleryForm item={editingItem} />
          {editingItem && (
            <Link 
              href="/admin/gallery" 
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
          <h1 className="text-2xl font-bold text-foreground">Galerie & Certifications</h1>
          <div className="text-sm font-medium text-foreground/50 px-3 py-1 bg-white/5 rounded-full">
            {galleryItems?.length || 0} élément(s)
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {galleryItems?.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-muted/30 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black/50 hover:bg-white/5"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] w-full bg-black/20 overflow-hidden p-4 flex items-center justify-center">
                {item.media_url ? (
                  <Image src={item.media_url} alt={item.title || "Image"} fill className="object-contain transition-transform duration-500 group-hover:scale-105 p-2" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-foreground/20">Sans image</div>
                )}
                
                {/* Badge Publié/Masqué */}
                <div className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg ${item.is_published ? "bg-accent/80 text-white" : "bg-black/80 text-foreground/60 border border-white/10"}`}>
                  {item.is_published ? "Publié" : "Masqué"}
                </div>
              </div>

              {/* Contenu et Actions */}
              <div className="flex flex-1 flex-col p-4 border-t border-white/5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-foreground line-clamp-1">{item.title}</h3>
                    <span className="mt-1 inline-block rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-foreground/70 uppercase tracking-wider">
                      {getTypeLabel(item.category)}
                    </span>
                  </div>
                </div>

                {item.description && (
                  <p className="mt-2 text-xs text-foreground/60 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* Actions alignées en bas */}
                <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                  <Link
                    href={`/admin/gallery?edit=${item.id}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-foreground/60 transition-colors hover:bg-accent hover:text-white"
                    title="Modifier"
                  >
                    <Pencil size={14} />
                  </Link>
                  <DeleteGalleryItemButton id={item.id} title={item.title || "Élément"} />
                </div>
              </div>
            </div>
          ))}

          {(!galleryItems || galleryItems.length === 0) && (
            <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
              <p className="text-foreground/60">Aucun élément dans la galerie.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
