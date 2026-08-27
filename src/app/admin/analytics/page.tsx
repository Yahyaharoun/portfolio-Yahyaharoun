import { createClient } from "@/lib/supabase/server";
import { MonitorSmartphone, Globe, Download, MousePointerClick } from "lucide-react";
import { UAParser } from "ua-parser-js";

export default async function AdminAnalyticsPage() {
  const supabase = createClient();
  
  // 1. Récupérer les 50 dernières vues de page
  const { data: pageViews } = await supabase
    .from("analytics")
    .select("*")
    .eq("event_type", "page_view")
    .order("created_at", { ascending: false })
    .limit(50);

  // 2. Récupérer les derniers téléchargements de CV
  const { data: cvDownloads } = await supabase
    .from("analytics")
    .select("*")
    .eq("event_type", "cv_download")
    .order("created_at", { ascending: false })
    .limit(50);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  const parseUserAgent = (ua: string | null) => {
    if (!ua || ua === "unknown") return { browser: "Inconnu", os: "Inconnu", device: "Desktop" };
    const parser = new UAParser(ua);
    const result = parser.getResult();
    return {
      browser: result.browser.name || "Inconnu",
      os: result.os.name || "Inconnu",
      device: result.device.type === "mobile" ? "Mobile" : result.device.type === "tablet" ? "Tablette" : "Desktop"
    };
  };

  const parseReferrer = (ref: string | null) => {
    if (!ref || ref === "direct") return "Accès direct";
    try {
      const url = new URL(ref);
      return url.hostname;
    } catch {
      return ref;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-foreground/50">Analyse détaillée du trafic et des interactions</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Section A : Téléchargements de CV */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Download className="text-accent" size={20} />
            <h2 className="text-xl font-bold text-foreground">Téléchargements CV</h2>
          </div>
          <div className="flex flex-col gap-3">
            {(!cvDownloads || cvDownloads.length === 0) ? (
              <div className="rounded-2xl border border-white/10 bg-muted/30 p-8 text-center text-sm text-foreground/50 backdrop-blur-md">
                Aucun téléchargement enregistré pour le moment.
              </div>
            ) : (
              cvDownloads.map((event) => {
                const ua = parseUserAgent(event.user_agent);
                return (
                  <div key={event.id} className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-white/10 bg-muted/30 p-4 backdrop-blur-md transition-colors hover:bg-white/5">
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                          {formatDate(event.created_at)}
                        </span>
                        <span className="text-xs text-foreground/50 truncate max-w-[120px]" title={`Hash IP: ${event.ip_hash}`}>
                          {event.ip_hash?.substring(0, 8)}...
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground/80">
                        <div className="flex items-center gap-1.5">
                          <MonitorSmartphone size={14} className="text-foreground/40" />
                          <span>{ua.device} · {ua.os} · {ua.browser}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Globe size={14} className="text-foreground/40" />
                          <span>{parseReferrer(event.referrer)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Section B : Trafic Récent */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <MousePointerClick className="text-blue-500" size={20} />
            <h2 className="text-xl font-bold text-foreground">Trafic récent (Vues)</h2>
          </div>
          <div className="flex flex-col gap-3">
            {(!pageViews || pageViews.length === 0) ? (
              <div className="rounded-2xl border border-white/10 bg-muted/30 p-8 text-center text-sm text-foreground/50 backdrop-blur-md">
                Aucune vue enregistrée.
              </div>
            ) : (
              pageViews.map((event) => {
                const ua = parseUserAgent(event.user_agent);
                return (
                  <div key={event.id} className="flex items-center gap-4 rounded-xl border border-white/5 bg-black/20 p-3">
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-foreground truncate">{event.page_path}</p>
                        <span className="text-xs text-foreground/40 whitespace-nowrap">{formatDate(event.created_at)}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-foreground/60">
                        <span className="truncate max-w-[100px]" title={`Hash IP: ${event.ip_hash}`}>
                          {event.ip_hash?.substring(0, 6)}...
                        </span>
                        <span>•</span>
                        <span>{ua.os}</span>
                        <span>•</span>
                        <span className="truncate">{parseReferrer(event.referrer)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
