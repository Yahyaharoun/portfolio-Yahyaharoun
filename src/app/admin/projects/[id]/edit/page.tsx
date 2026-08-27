import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProjectForm from "@/components/admin/ProjectForm";
import type { Project } from "@/types";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: project } = await supabase.from("projects").select("*").eq("id", params.id).single();

  if (!project) return notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Modifier le projet</h1>
      <div className="mt-8">
        <ProjectForm project={project as Project} />
      </div>
    </div>
  );
}
