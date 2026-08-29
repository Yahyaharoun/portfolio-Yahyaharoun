import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

const partnershipSchema = z.object({
  first_name: z.string().min(2).max(100),
  last_name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(50).optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  website: z.string().max(300).optional().nullable(),
  project_type: z.enum([
    "application_web",
    "saas",
    "site_internet",
    "automatisation",
    "ia",
    "cybersecurite",
  ]),
  budget_range: z.enum(["moins_100000", "100000_500000", "plus_500000"]),
  description: z.string().min(10).max(5000),
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const rawPayload = Object.fromEntries(formData.entries());
    const parsed = partnershipSchema.safeParse(rawPayload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Certains champs sont invalides ou manquants." },
        { status: 400 }
      );
    }

    const supabase = createClient();
    let attachment_url: string | null = null;

    const file = formData.get("attachment") as File | null;
    if (file && file.size > 0) {
      // Limite a 5 Mo pour eviter les abus
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "La pièce jointe dépasse 5 Mo." }, { status: 400 });
      }
      const fileExt = file.name.split(".").pop();
      const filePath = `partnership-attachments/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const arrayBuffer = await file.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, arrayBuffer, { contentType: file.type });

      if (uploadError) {
        console.error("Erreur upload pièce jointe:", uploadError);
      } else {
        const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(filePath);
        attachment_url = publicUrlData.publicUrl;
      }
    }

    const { error } = await supabase.from("partnership_requests").insert({
      ...parsed.data,
      attachment_url,
    });

    if (error) {
      console.error("Erreur insertion partnership:", error);
      return NextResponse.json({ error: "Erreur serveur, réessayez plus tard." }, { status: 500 });
    }

    try {
      await supabase.from("analytics").insert({ event_type: "partnership_sent" });
    } catch (_) {}

    // ----------------------------------------------------
    // ENVOI DE LA NOTIFICATION PUSH À L'ADMIN
    // ----------------------------------------------------
    try {
      const supabaseAdmin = createServiceClient();
      const { data: tokensData } = await supabaseAdmin.from("admin_fcm_tokens").select("token");
      if (tokensData && tokensData.length > 0) {
        const tokens = tokensData.map((t) => t.token);
        const { adminMessaging } = await import("@/lib/firebase-admin");
        
        await adminMessaging.sendEachForMulticast({
          tokens,
          notification: {
            title: "Nouveau Partenariat 🤝",
            body: `${parsed.data.first_name} ${parsed.data.last_name} (${parsed.data.company || 'Indépendant'}) a fait une demande.`,
          },
          data: {
            url: "/admin/messages" // ou une route dédiée partenariats
          }
        });
      }
    } catch (pushErr) {
      console.error("Erreur d'envoi de notification push partenariat:", pushErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur route partnership:", err);
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
}
