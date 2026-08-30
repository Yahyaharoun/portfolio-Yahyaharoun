import CertificationForm from "@/components/admin/CertificationForm";
import { createServiceClient } from "@/lib/supabase/service";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditCertificationPage({ params }: { params: { id: string } }) {
  const supabase = createServiceClient();
  const { data: certification } = await supabase
    .from("certifications")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!certification) {
    notFound();
  }

  return <CertificationForm initialData={certification} />;
}
