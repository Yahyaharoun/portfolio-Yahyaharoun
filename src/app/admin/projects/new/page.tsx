import ProjectForm from "@/components/admin/ProjectForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProjectPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/projects" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-foreground transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nouveau projet</h1>
          <p className="text-sm text-foreground/50">Ajouter un nouveau projet à votre portfolio</p>
        </div>
      </div>
      <ProjectForm />
    </div>
  );
}
