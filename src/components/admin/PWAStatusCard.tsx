"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Smartphone, Wifi, RefreshCw, Bell } from "lucide-react";
import { requestForToken } from "@/lib/firebase";

export default function PWAStatusCard() {
  const [status, setStatus] = useState({
    isStandalone: false,
    serviceWorkerActive: false,
    hasManifest: false,
    isOfflineReady: false,
    lastChecked: new Date(),
  });
  
  const [pushStatus, setPushStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const checkStatus = () => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
    
    // Check manifest
    const hasManifest = !!document.querySelector("link[rel='manifest']");
    
    // Check SW
    let swActive = false;
    if ("serviceWorker" in navigator) {
      swActive = !!navigator.serviceWorker.controller;
    }

    // Check if offline ready (basic heuristic: SW is controlling the page)
    const isOfflineReady = swActive;

    setStatus({
      isStandalone,
      serviceWorkerActive: swActive,
      hasManifest,
      isOfflineReady,
      lastChecked: new Date(),
    });
  };

  useEffect(() => {
    checkStatus();
    
    // Listen for SW changes
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", checkStatus);
    }
    
    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("controllerchange", checkStatus);
      }
    };
  }, []);

  const enablePushNotifications = async () => {
    try {
      setPushStatus("loading");
      const token = await requestForToken();
      
      if (token) {
        // Envoyer le token au backend pour le lier à l'admin
        const res = await fetch("/api/admin/fcm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });
        
        if (res.ok) {
          setPushStatus("success");
          alert("Notifications Push activées avec succès !");
        } else {
          setPushStatus("error");
        }
      } else {
        setPushStatus("error");
        alert("Impossible d'obtenir la permission pour les notifications.");
      }
    } catch (err) {
      setPushStatus("error");
      console.error(err);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-muted/30 p-6 backdrop-blur-md mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Smartphone className="text-accent" />
          Statut Système & PWA
        </h2>
        <button 
          onClick={checkStatus} 
          className="p-2 rounded-lg hover:bg-white/5 transition-colors text-foreground/50 hover:text-foreground"
          title="Rafraîchir le statut"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Mode Standalone */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/20">
          <div>
            <p className="text-sm font-medium text-foreground">Application Installée</p>
            <p className="text-xs text-foreground/50">Mode standalone actif</p>
          </div>
          {status.isStandalone ? (
            <CheckCircle2 className="text-green-500" size={20} />
          ) : (
            <XCircle className="text-foreground/30" size={20} />
          )}
        </div>

        {/* Service Worker */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/20">
          <div>
            <p className="text-sm font-medium text-foreground">Service Worker</p>
            <p className="text-xs text-foreground/50">Gestion du cache et requêtes</p>
          </div>
          {status.serviceWorkerActive ? (
            <CheckCircle2 className="text-green-500" size={20} />
          ) : (
            <XCircle className="text-red-500" size={20} />
          )}
        </div>

        {/* Push Notifications (Firebase) */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/20 lg:col-span-1 sm:col-span-2">
          <div>
            <p className="text-sm font-medium text-foreground">Notifications Push</p>
            <p className="text-xs text-foreground/50">Recevoir des alertes (Messages)</p>
          </div>
          <button 
            onClick={enablePushNotifications}
            disabled={pushStatus === "loading" || pushStatus === "success"}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg bg-accent text-white hover:bg-accent/80 transition-colors disabled:opacity-50"
          >
            <Bell size={14} />
            {pushStatus === "success" ? "Activé" : pushStatus === "loading" ? "Activation..." : "Activer"}
          </button>
        </div>
      </div>
      
      <p className="text-xs text-foreground/40 mt-4 text-center">
        Dernière vérification: {status.lastChecked.toLocaleTimeString()}
        <br/>Note: Le Service Worker est désactivé par défaut en mode développement (sauf si forcé).
      </p>
    </div>
  );
}
