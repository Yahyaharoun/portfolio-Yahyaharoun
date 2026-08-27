import { createServiceClient } from "@/lib/supabase/service";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Handshake, Calendar, Clock, Paperclip, User, Building, Briefcase, CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
    time: d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  };
}

export default async function MessageDetailPage({ params, searchParams }: { params: { id: string }, searchParams: { type: string } }) {
  const supabase = createServiceClient();
  const type = searchParams.type;

  let item = null;

  if (type === 'message') {
    const { data } = await supabase.from("messages").select("*").eq("id", params.id).single();
    if (data) {
      item = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: null,
        message: data.message,
        is_read: data.is_read,
        created_at: data.created_at,
        _type: 'message'
      };
      // Mark as read
      if (!data.is_read) await supabase.from("messages").update({ is_read: true }).eq("id", params.id);
    }
  } else if (type === 'partnership') {
    const { data } = await supabase.from("partnership_requests").select("*").eq("id", params.id).single();
    if (data) {
      item = {
        id: data.id,
        name: `${data.first_name} ${data.last_name}`,
        email: data.email,
        phone: data.phone,
        company: data.company,
        project_type: data.project_type,
        budget: data.budget,
        document_url: data.attachment_url || data.document_url,
        message: data.description,
        is_read: data.status !== 'nouveau',
        created_at: data.created_at,
        status: data.status,
        _type: 'partnership'
      };
      // Mark as read
      if (data.status === 'nouveau') await supabase.from("partnership_requests").update({ status: 'lu' }).eq("id", params.id);
    }
  }

  if (!item) return notFound();

  const isMessage = item._type === 'message';
  const { date, time } = formatDate(item.created_at);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/messages"
          className="group flex items-center gap-2 text-sm font-semibold text-foreground/60 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Retour aux messages
        </Link>
      </div>

      <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-background overflow-hidden shadow-xl">
        {/* Header */}
        <div className="border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-bold ${
                isMessage ? 'bg-accent/20 text-accent' : 'bg-amber-500/20 text-amber-500'
              }`}>
                {isMessage ? <Mail size={24} /> : <Handshake size={24} />}
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">{item.name}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-foreground/60 font-medium">
                  <a href={`mailto:${item.email}`} className="hover:text-accent transition-colors">{item.email}</a>
                  {item.phone && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <a href={`tel:${item.phone}`} className="hover:text-accent transition-colors">{item.phone}</a>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2 text-sm">
              <span className={`px-3 py-1 text-xs uppercase tracking-widest font-bold rounded-full ${
                isMessage ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
              }`}>
                {isMessage ? 'Contact Classique' : 'Partenariat'}
              </span>
              <div className="flex flex-col items-end text-foreground/50 font-medium mt-2">
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {date}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} /> {time}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid (Partnership only) */}
        {!isMessage && (
          <div className="border-b border-black/5 dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-black/5 dark:divide-white/5">
            <div className="p-6 flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground/40 uppercase mb-1">
                <Building size={14} /> Entreprise
              </span>
              <span className="text-sm font-semibold text-foreground/90">{item.company || "Non renseignée"}</span>
            </div>
            <div className="p-6 flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground/40 uppercase mb-1">
                <Briefcase size={14} /> Type de projet
              </span>
              <span className="text-sm font-semibold text-foreground/90">{item.project_type || "Non renseigné"}</span>
            </div>
            <div className="p-6 flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground/40 uppercase mb-1">
                <CreditCard size={14} /> Budget
              </span>
              <span className="text-sm font-bold text-amber-500">{item.budget || "Non renseigné"}</span>
            </div>
            <div className="p-6 flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground/40 uppercase mb-1">
                <Paperclip size={14} /> Pièce jointe
              </span>
              {item.document_url ? (
                <a href={item.document_url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-accent hover:underline">
                  Voir le document
                </a>
              ) : (
                <span className="text-sm font-semibold text-foreground/40">Aucun fichier</span>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-8 sm:p-12 bg-muted/30">
          <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-6 border-b border-black/5 dark:border-white/5 pb-4">
            Contenu du message
          </h3>
          <p className="text-foreground/90 leading-loose text-base whitespace-pre-wrap font-medium">
            {item.message}
          </p>
        </div>
      </div>
    </div>
  );
}
