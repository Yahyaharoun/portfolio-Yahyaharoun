import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event_type = "page_view", page_path = "/", metadata = {} } = body;
    
    // Récupérer l'IP via les headers
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const referrer = req.headers.get("referer") || "direct";
    
    // Hash IP pour RGPD
    const ipHash = crypto.createHash('sha256').update(ip + (process.env.IP_SALT || "secret")).digest('hex');

    // On utilise le Service Client pour forcer l'insertion même si RLS n'est pas bien configuré
    const supabase = createServiceClient();
    
    const { error } = await supabase.from("analytics").insert({
      event_type,
      page_path,
      ip_hash: ipHash,
      user_agent: userAgent,
      referrer: referrer,
      // On peut stocker les métadonnées dans une colonne jsonb si elle existe, mais l'actuelle schema n'en a peut-être pas.
      // Si la colonne n'existe pas, Supabase ignorera ou plantera. 
      // Pour l'instant, on se limite aux champs existants ou on suppose que l'admin ajoutera un champ "metadata" JSONB.
    });

    if (error) {
      console.error("Erreur d'insertion analytics:", error);
      return new NextResponse("Erreur interne", { status: 500 });
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Erreur générale analytics:", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
