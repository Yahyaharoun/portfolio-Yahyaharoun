"use server";

import { createServiceClient } from "@/lib/supabase/service";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { revalidatePath } from "next/cache";

// Vérifie que l'utilisateur est un admin (via le JWT) avant d'exécuter l'action
async function verifyAdmin() {
  const token = cookies().get("admin_token")?.value;
  if (!token) throw new Error("Non autorisé");

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_super_secret_jwt_key_that_is_long_enough");
    await jwtVerify(token, secret);
  } catch (err) {
    throw new Error("Token invalide ou expiré");
  }
}

export async function saveProject(payload: any, id?: string) {
  await verifyAdmin();
  const supabase = createServiceClient();

  if (id) {
    const { error } = await supabase.from("projects").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("projects").insert(payload);
    if (error) throw new Error(error.message);
  }
  
  revalidatePath("/admin/projects");
  revalidatePath("/");
  return { success: true };
}

export async function deleteProject(id: string) {
  await verifyAdmin();
  const supabase = createServiceClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/");
  return { success: true };
}

export async function saveExperience(payload: any, id?: string) {
  await verifyAdmin();
  const supabase = createServiceClient();

  if (id) {
    const { error } = await supabase.from("experiences").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("experiences").insert(payload);
    if (error) throw new Error(error.message);
  }
  
  revalidatePath("/admin/experiences");
  revalidatePath("/");
  return { success: true };
}

export async function deleteExperience(id: string) {
  await verifyAdmin();
  const supabase = createServiceClient();
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/experiences");
  revalidatePath("/");
  return { success: true };
}

export async function saveGalleryItem(payload: any, id?: string) {
  await verifyAdmin();
  const supabase = createServiceClient();

  if (id) {
    const { error } = await supabase.from("gallery").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("gallery").insert(payload);
    if (error) throw new Error(error.message);
  }
  
  revalidatePath("/admin/gallery");
  revalidatePath("/");
  return { success: true };
}

export async function deleteGalleryItem(id: string) {
  await verifyAdmin();
  const supabase = createServiceClient();
  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/gallery");
  revalidatePath("/");
  return { success: true };
}

export async function saveArticle(payload: any, id?: string) {
  await verifyAdmin();
  const supabase = createServiceClient();

  if (id) {
    const { error } = await supabase.from("articles").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("articles").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}

export async function deleteArticle(id: string) {
  await verifyAdmin();
  const supabase = createServiceClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}

export async function toggleMessageReadStatus(id: string, type: 'message' | 'partnership', isRead: boolean) {
  await verifyAdmin();
  const supabase = createServiceClient();
  
  if (type === 'message') {
    const { error } = await supabase.from("messages").update({ is_read: isRead }).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("partnership_requests").update({ status: isRead ? 'lu' : 'nouveau' }).eq("id", id);
    if (error) throw new Error(error.message);
  }
  
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function deleteMessage(id: string, type: 'message' | 'partnership') {
  await verifyAdmin();
  const supabase = createServiceClient();
  
  if (type === 'message') {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("partnership_requests").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
  
  revalidatePath("/admin/messages");
  return { success: true };
}
