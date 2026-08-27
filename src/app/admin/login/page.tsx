"use client";

import { motion } from "framer-motion";
import { Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-1/2 top-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 opacity-50 blur-[100px]"></div>

      <div className="w-full max-w-md z-10">
        <Link href="/" className="group mb-8 inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Retour au Portfolio
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-white/10 dark:border-white/10 border-black/10 bg-background/60 backdrop-blur-2xl shadow-2xl p-8"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-4">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Accès Sécurisé</h1>
            <p className="mt-2 text-sm text-foreground/50">Veuillez vous identifier pour accéder au tableau de bord.</p>
          </div>

          <LoginForm />
        </motion.div>
      </div>
    </div>
  );
}
