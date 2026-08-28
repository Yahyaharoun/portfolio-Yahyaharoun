import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) {
      return new NextResponse("Token manquant", { status: 400 });
    }

    const supabase = createServiceClient();
    
    // Vérification basique si l'admin est connecté (à adapter selon votre logique d'auth)
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      // Dans ce portfolio, l'auth Admin est parfois gérée différemment.
      // Assurez-vous d'ajouter une vérification d'authentification ici.
      // return new NextResponse("Non autorisé", { status: 401 });
    }

    // Insérer le token dans la table
    const { error } = await supabase
      .from("admin_fcm_tokens")
      .upsert({ token }, { onConflict: "token" });

    if (error) {
      console.error("Erreur insertion FCM token:", error);
      return new NextResponse("Erreur DB", { status: 500 });
    }

    return new NextResponse("Token sauvegardé", { status: 200 });
  } catch (error) {
    console.error("Erreur FCM api:", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
