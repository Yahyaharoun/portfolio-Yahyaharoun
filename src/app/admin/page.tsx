import { createServiceClient } from "@/lib/supabase/service";
import { Users, FileDown, Mail, Handshake } from "lucide-react";
import TrendChart from "@/components/admin/TrendChart";
import PWAStatusCard from "@/components/admin/PWAStatusCard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = createServiceClient();
  
  // 1. Calcul des Visiteurs Uniques (7 derniers jours)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { data: recentViews } = await supabase
    .from("analytics")
    .select("ip_hash")
    .eq("event_type", "page_view")
    .gte("created_at", sevenDaysAgo.toISOString());
    
  // Compter le nombre de ip_hash uniques
  const uniqueVisitors = new Set((recentViews || []).map(v => v.ip_hash)).size;

  // 2. Total des téléchargements de CV
  const { count: cvDownloadsCount } = await supabase
    .from("analytics")
    .select("*", { count: "exact", head: true })
    .eq("event_type", "cv_download");

  // 3. Messages non lus
  const { count: unreadMessagesCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);
    
  const { data: latestMessages } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  // 4. Nouvelles demandes de partenariat
  const { count: newPartnershipsCount } = await supabase
    .from("partnership_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "nouveau");
    
  const { data: latestPartnerships } = await supabase
    .from("partnership_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  // 5. Données pour le Graphique (14 derniers jours, groupé par jour)
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
  fourteenDaysAgo.setHours(0,0,0,0);
  
  const { data: chartViews } = await supabase
    .from("analytics")
    .select("created_at, ip_hash")
    .eq("event_type", "page_view")
    .gte("created_at", fourteenDaysAgo.toISOString());

  // Générer un tableau avec chaque jour
  const chartData = [];
  const currentDate = new Date(fourteenDaysAgo);
  const now = new Date();
  
  while (currentDate <= now) {
    const dayString = currentDate.toISOString().split('T')[0];
    const displayDate = currentDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    
    // Compter les visiteurs uniques ce jour-là
    const viewsOnDay = (chartViews || []).filter(v => v.created_at.startsWith(dayString));
    const uniqueOnDay = new Set(viewsOnDay.map(v => v.ip_hash)).size;
    
    chartData.push({ date: displayDate, visites: uniqueOnDay });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const kpis = [
    { label: "Visiteurs uniques (7j)", value: uniqueVisitors, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "CV téléchargés (Total)", value: cvDownloadsCount || 0, icon: FileDown, color: "text-accent", bg: "bg-accent/10" },
    { label: "Messages non lus", value: unreadMessagesCount || 0, icon: Mail, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Partenariats (Nouveaux)", value: newPartnershipsCount || 0, icon: Handshake, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  const timeAgo = (dateStr: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return "À l'instant";
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)} h`;
    return `Il y a ${Math.floor(seconds / 86400)} j`;
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Vue d'ensemble</h1>
        <p className="mt-1 text-sm text-foreground/50">Vos performances et activités récentes en temps réel</p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-muted/30 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground/70">{kpi.label}</span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.bg} ${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="rounded-2xl border border-white/10 bg-muted/30 p-6 backdrop-blur-md">
        <h2 className="text-lg font-bold text-foreground mb-6">Tendance des visites (14 derniers jours)</h2>
        <TrendChart data={chartData} />
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages */}
        <div className="rounded-2xl border border-white/10 bg-muted/30 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Derniers messages</h2>
          </div>
          <div className="flex flex-col gap-4">
            {(!latestMessages || latestMessages.length === 0) ? (
              <p className="text-sm text-foreground/40 text-center py-4">Aucun message récent</p>
            ) : (
              latestMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-4 rounded-xl border border-white/5 bg-black/20 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent font-bold">
                    {msg.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-foreground truncate">{msg.name}</p>
                      <span className="text-xs text-foreground/40 whitespace-nowrap">{timeAgo(msg.created_at)}</span>
                    </div>
                    <p className="text-xs text-accent truncate">{msg.email}</p>
                    <p className="mt-2 text-sm text-foreground/70 line-clamp-2">{msg.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Partenariats */}
        <div className="rounded-2xl border border-white/10 bg-muted/30 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Demandes de partenariat</h2>
          </div>
          <div className="flex flex-col gap-4">
            {(!latestPartnerships || latestPartnerships.length === 0) ? (
              <p className="text-sm text-foreground/40 text-center py-4">Aucune demande récente</p>
            ) : (
              latestPartnerships.map((req) => (
                <div key={req.id} className="flex items-start gap-4 rounded-xl border border-white/5 bg-black/20 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-500 font-bold">
                    {req.first_name.charAt(0)}{req.last_name.charAt(0)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-foreground truncate">{req.first_name} {req.last_name}</p>
                      <span className="text-xs text-foreground/40 whitespace-nowrap">{timeAgo(req.created_at)}</span>
                    </div>
                    <p className="text-xs text-amber-500 truncate">{req.company || req.project_type}</p>
                    <p className="mt-2 text-sm text-foreground/70 line-clamp-2">{req.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* PWA Status Section */}
      <PWAStatusCard />
    </div>
  );
}
