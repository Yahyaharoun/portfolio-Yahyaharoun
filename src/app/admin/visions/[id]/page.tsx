import VisionForm from "@/components/admin/VisionForm";
import { createServiceClient } from "@/lib/supabase/service";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditVisionPage({ params }: { params: { id: string } }) {
  const supabase = createServiceClient();
  const { data: vision } = await supabase
    .from("visions")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!vision) {
    notFound();
  }

  return <VisionForm initialData={vision} />;
}
