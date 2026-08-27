import GalleryForm from "@/components/admin/GalleryForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewGalleryPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/gallery" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-foreground transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nouveau média</h1>
          <p className="text-sm text-foreground/50">Ajouter une image ou une vidéo à la galerie</p>
        </div>
      </div>
      <GalleryForm />
    </div>
  );
}
