import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const contactSchema = z.object({
  first_name: z.string().min(2, "Prénom trop court").max(100),
  last_name: z.string().min(2, "Nom trop court").max(100),
  email: z.string().email("Email invalide"),
  phone: z.string().max(20).optional(),
  subject: z.string().max(300).optional(),
  message: z.string().min(10, "Message trop court").max(5000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message || "Champs invalides." },
        { status: 400 }
      );
    }

    const supabase = createClient();
    
    // Convertir les champs pour correspondre à la table 'messages' (qui attend 'name')
    const messageData = {
      name: `${parsed.data.first_name} ${parsed.data.last_name}`,
      email: parsed.data.email,
      subject: parsed.data.subject || "Sans objet",
      message: parsed.data.message,
    };

    const { error } = await supabase.from("messages").insert(messageData);

    if (error) {
      console.error("Erreur insertion message:", error);
      return NextResponse.json({ error: "Une erreur est survenue lors de l'envoi du message." }, { status: 500 });
    }

    try {
      await supabase.from("analytics").insert({ event_type: "message_sent" });
    } catch (_) {}

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur route contact:", err);
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
}
