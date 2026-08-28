import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Client Supabase utilisant la SERVICE_ROLE_KEY (contourne le RLS)
// À UTILISER UNIQUEMENT DANS DES ROUTES API OU SERVER ACTIONS SÉCURISÉES !
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.warn("⚠️ Avertissement : Les variables d'environnement Supabase Service sont manquantes.");
  } else if (serviceKey === "A_REMPLIR") {
    throw new Error("Invalid API key : Vous devez renseigner la vraie clé 'service_role' dans votre fichier .env.local à la place de 'A_REMPLIR'. Allez dans Supabase > Project Settings > API.");
  }

  return createSupabaseClient(
    supabaseUrl || "https://placeholder.supabase.co",
    serviceKey || "placeholder_key",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
