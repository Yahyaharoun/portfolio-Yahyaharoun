import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Client Supabase utilisant la SERVICE_ROLE_KEY (contourne le RLS)
// À UTILISER UNIQUEMENT DANS DES ROUTES API OU SERVER ACTIONS SÉCURISÉES !
export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !serviceKey) {
    throw new Error("Missing Supabase URL or Service Role Key");
  }
  
  if (serviceKey === "A_REMPLIR") {
    throw new Error("Invalid API key : Vous devez renseigner la vraie clé 'service_role' dans votre fichier .env.local à la place de 'A_REMPLIR'. Allez dans Supabase > Project Settings > API.");
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
