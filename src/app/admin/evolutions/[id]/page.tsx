import EvolutionForm from "@/components/admin/EvolutionForm";
import { createServiceClient } from "@/lib/supabase/service";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditEvolutionPage({ params }: { params: { id: string } }) {
  const supabase = createServiceClient();
  const { data: evolution } = await supabase
    .from("evolutions")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!evolution) {
    notFound();
  }

  return <EvolutionForm initialData={evolution} />;
}
