import { createServiceClient } from "@/lib/supabase/service";
import { Mail, Handshake, CheckCircle2 } from "lucide-react";
import MessageRow from "./MessageRow";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function AdminMessagesPage() {
  const supabase = createServiceClient();
  
  // Fetch messages
  const { data: messagesData } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch partnerships
  const { data: partnershipsData } = await supabase
    .from("partnership_requests")
    .select("*")
    .order("created_at", { ascending: false });

  // Unify and sort
  const unifiedItems = [
    ...(messagesData || []).map(m => ({ ...m, _type: 'message' as const })),
    ...(partnershipsData || []).map(p => ({ 
      id: p.id,
      name: `${p.first_name} ${p.last_name}`,
      email: p.email,
      message: p.description,
      is_read: p.status !== 'nouveau',
      created_at: p.created_at,
      _type: 'partnership' as const,
      // Champs spécifiques
      company: p.company,
      project_type: p.project_type,
      budget: p.budget,
      document_url: p.document_url,
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Messages</h1>
          <p className="mt-1 text-sm text-foreground/50">Contact classique et demandes de partenariat</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {unifiedItems.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-muted/30 p-8 text-center text-sm text-foreground/50 backdrop-blur-md">
            Aucun message reçu pour le moment.
          </div>
        ) : (
          unifiedItems.map((item) => (
            <MessageRow key={`${item._type}-${item.id}`} item={item} />
          ))
        )}
      </div>
    </div>
  );
}
