"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

export async function loginAdmin(username: string, pin: string) {
  try {
    if (username.trim().toLowerCase() !== "yahya haroun") {
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
      
    cookies().set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
