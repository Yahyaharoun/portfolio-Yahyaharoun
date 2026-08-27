import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: Request) {
  try {
    const { table, id, isPublished } = await request.json();

    const allowedTables = ["projects", "experiences", "gallery", "articles"];
    if (!allowedTables.includes(table)) {
      return NextResponse.json({ error: "Table non autorisée" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const publishKey = table === "articles" ? "is_published" : "is_published";

    const { error } = await supabase
      .from(table)
      .update({ [publishKey]: isPublished })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
