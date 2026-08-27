import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { page_path } = await req.json();
    
    // Récupérer l'IP via les headers Vercel/Next.js
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const referrer = req.headers.get("referer") || "direct";
    
    // Hash IP pour RGPD
    const ipHash = crypto.createHash('sha256').update(ip + (process.env.IP_SALT || "secret")).digest('hex');

    const supabase = createClient();
    
    const { error } = await supabase.from("analytics").insert({
      event_type: "page_view",
      page_path: page_path || "/",
      ip_hash: ipHash,
      user_agent: userAgent,
      referrer: referrer,
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
