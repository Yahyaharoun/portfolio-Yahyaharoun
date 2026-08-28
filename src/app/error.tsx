"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Oups ! Une erreur est survenue.
        </h1>
        
        <p className="text-foreground/60 text-sm">
          Nous n'avons pas pu charger cette page correctement. Il s'agit probablement d'un problème temporaire de connexion à la base de données.
        </p>

        {error.digest && (
          <p className="text-xs text-foreground/40 font-mono bg-black/5 dark:bg-white/5 p-2 rounded-md">
            Error Digest: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition-colors"
          >
            <RefreshCcw size={18} />
            Réessayer
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black/5 dark:bg-white/5 text-foreground rounded-xl font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <Home size={18} />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
