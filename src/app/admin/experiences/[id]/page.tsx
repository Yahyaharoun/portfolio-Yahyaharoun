import ExperienceForm from "@/components/admin/ExperienceForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditExperiencePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: exp } = await supabase.from("experiences").select("*").eq("id", params.id).single();

  if (!exp) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/experiences" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-foreground transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Éditer l'expérience</h1>
          <p className="text-sm text-foreground/50">{exp.title}</p>
        </div>
      </div>
      <ExperienceForm experience={exp} />
    </div>
  );
}
