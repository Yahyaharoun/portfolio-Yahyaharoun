"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

export async function loginAdmin(username: string, pin: string) {
  try {
    const normalizedUsername = username.trim().toLowerCase().replace(/\s+/g, " ");
    if (normalizedUsername !== "yahya haroun") {
      return { error: "Nom d'utilisateur incorrect." };
    }
    
    const hash = process.env.ADMIN_PIN_HASH || "$2b$10$VA/KVqG/njTyIkQILTYdHuuTsyDBfHAHgvjNV2s4udZvlLBmoGqn2"; // Hash of 250772
    const isValid = bcrypt.compareSync(pin, hash);
    
    if (!isValid) {
      return { error: "Code PIN incorrect." };
    }
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_super_secret_jwt_key_that_is_long_enough");
    const token = await new SignJWT({ admin: true })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret);
      
    const isSecure = process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https");
    
    cookies().set("admin_token", token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24
    });
    
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Erreur lors de la connexion." };
  }
}

export async function logoutAdmin() {
  cookies().delete("admin_token");
}
