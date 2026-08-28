"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, XCircle, Smartphone, RefreshCw, Bell, AlertTriangle, ShieldAlert, Trash2, Send } from "lucide-react";
import { requestForToken } from "@/lib/firebase";

export default function PWAStatusCard() {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState({
    isStandalone: false,
    serviceWorkerActive: false,
    hasManifest: false,
    isOfflineReady: false,
    lastChecked: null as Date | null,
  });
  
  const [diag, setDiag] = useState({
    permission: "unknown",
    fcmToken: null as string | null,
    hasVapidKey: false,
  });

  const [pushStatus, setPushStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const checkStatus = useCallback(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
    const hasManifest = !!document.querySelector("link[rel='manifest']");
    
    let swActive = false;
    if ("serviceWorker" in navigator) {
      swActive = !!navigator.serviceWorker.controller;
    }

    setStatus({
      isStandalone,
      serviceWorkerActive: swActive,
      hasManifest,
      isOfflineReady: swActive,
      lastChecked: new Date(),
    });

    // Check Notifications Permission
    let perm = "unsupported";
    if (typeof window !== "undefined" && "Notification" in window) {
      perm = Notification.permission;
    }

    // Check VAPID
    const hasVapidKey = !!process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

    setDiag(prev => ({
      ...prev,
      permission: perm,
      hasVapidKey,
    }));
  }, []);

  useEffect(() => {
    setMounted(true);
    checkStatus();
    
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", checkStatus);
    }
    
    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("controllerchange", checkStatus);
      }
    };
  }, [checkStatus]);

  const enablePushNotifications = async () => {
    try {
      setPushStatus("loading");
      
      // Request permission manually if default
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
        await Notification.requestPermission();
        checkStatus();
      }

      if (Notification.permission === "denied") {
        alert("Vous avez bloqué les notifications dans votre navigateur. Veuillez les autoriser dans les paramètres du site.");
        setPushStatus("error");
        return;
      }

      const token = await requestForToken();
      
      if (token) {
        setDiag(prev => ({ ...prev, fcmToken: token }));
        // Envoyer le token au backend
        const res = await fetch("/api/admin/fcm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });
        
        if (res.ok) {
          setPushStatus("success");
          alert("✅ Cet appareil est maintenant enregistré pour recevoir les notifications.");
        } else {
          setPushStatus("error");
          alert("Erreur lors de l'enregistrement en base de données.");
        }
      } else {
        setPushStatus("error");
        if (!process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY) {
          alert("Erreur : La clé VAPID (NEXT_PUBLIC_FIREBASE_VAPID_KEY) est manquante dans votre environnement (.env.local).");
        } else {
          alert("Impossible de générer le token FCM. Vérifiez la console pour plus de détails.");
        }
      }
    } catch (err) {
      setPushStatus("error");
      console.error(err);
      alert("Une erreur inattendue s'est produite lors de l'activation.");
    }
  };

  const resetSystem = async () => {
    if (!confirm("Voulez-vous vraiment réinitialiser le système PWA et Firebase local ? Cela désenregistrera le Service Worker.")) return;
    
    try {
      // 1. Unregister SW
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
          await registration.unregister();
        }
      }
      
      // 2. Clear IndexedDB (Firebase Messaging cache)
      const req = indexedDB.deleteDatabase("firebase-messaging-database");
      req.onsuccess = () => {
        alert("Système réinitialisé avec succès ! La page va se recharger.");
        window.location.reload();
      };
      req.onerror = () => {
        alert("Les SW ont été supprimés mais une erreur s'est produite avec IndexedDB.");
        window.location.reload();
      };
      req.onblocked = () => {
        alert("Veuillez fermer les autres onglets du site pour réinitialiser la DB Firebase.");
      };
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la réinitialisation.");
    }
  };

  const sendTestNotification = async () => {
    if (!diag.fcmToken) {
      alert("Veuillez d'abord activer et générer un token pour cet appareil.");
      return;
    }
    
    setTestStatus("loading");
    try {
      const res = await fetch("/api/admin/fcm/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: diag.fcmToken })
      });
      
      if (res.ok) {
        setTestStatus("success");
      } else {
        setTestStatus("error");
        alert("Erreur serveur lors de l'envoi de la notification de test.");
      }
    } catch (e) {
      setTestStatus("error");
      console.error(e);
      alert("Erreur réseau lors du test.");
    }
  };

  const StatusIcon = ({ ok }: { ok: boolean }) => 
    ok ? <CheckCircle2 className="text-green-500 min-w-5" size={20} /> : <XCircle className="text-red-500 min-w-5" size={20} />;

  if (!mounted) {
    return <div className="rounded-2xl border border-white/10 bg-muted/30 p-6 backdrop-blur-md mt-6 h-64 flex items-center justify-center">Chargement de l'assistant...</div>;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-muted/30 p-6 backdrop-blur-md mt-6 space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <ShieldAlert className="text-accent" />
          Assistant de Diagnostic PWA & FCM
        </h2>
        <button 
          onClick={checkStatus} 
          className="flex items-center gap-2 p-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
        >
          <RefreshCw size={16} /> Audit Rapide
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Colonne 1: PWA Status */}
        <div className="space-y-3 p-4 rounded-xl border border-white/5 bg-black/20">
          <h3 className="font-semibold text-sm text-foreground/80 mb-3 border-b border-white/5 pb-2">État de la PWA</h3>
          
          <div className="flex justify-between items-center text-sm">
            <span>Manifest.json détecté</span>
            <StatusIcon ok={status.hasManifest} />
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Service Worker Actif</span>
            <StatusIcon ok={status.serviceWorkerActive} />
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Mode Standalone (Installé)</span>
            <StatusIcon ok={status.isStandalone} />
          </div>
        </div>

        {/* Colonne 2: FCM Status */}
        <div className="space-y-3 p-4 rounded-xl border border-white/5 bg-black/20">
          <h3 className="font-semibold text-sm text-foreground/80 mb-3 border-b border-white/5 pb-2">État Firebase Push</h3>
          
          <div className="flex justify-between items-center text-sm">
            <span>VAPID Key Configurée</span>
            <StatusIcon ok={diag.hasVapidKey} />
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Permission Navigateur</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              diag.permission === 'granted' ? 'bg-green-500/20 text-green-400' :
              diag.permission === 'denied' ? 'bg-red-500/20 text-red-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {diag.permission.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Token FCM Local généré</span>
            <StatusIcon ok={!!diag.fcmToken} />
          </div>
        </div>
      </div>
      
      {diag.fcmToken && (
        <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-xs break-all font-mono text-foreground/70">
          <span className="font-bold text-accent mr-2">Token actuel:</span>
          {diag.fcmToken}
        </div>
      )}

      {!diag.hasVapidKey && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
          <AlertTriangle className="shrink-0 mt-0.5" size={18} />
          <p>
            <strong>Attention :</strong> NEXT_PUBLIC_FIREBASE_VAPID_KEY est introuvable. 
            Firebase Cloud Messaging nécessite une paire de clés Web Push (VAPID) pour fonctionner.
            Ajoutez-la à votre .env.local.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
        <button 
          onClick={resetSystem}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors font-medium text-sm"
        >
          <Trash2 size={16} /> Réinitialisation Complète
        </button>
        
        <button 
          onClick={enablePushNotifications}
          disabled={pushStatus === "loading"}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent text-white hover:bg-accent/80 transition-colors font-medium text-sm shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)] disabled:opacity-50"
        >
          <Bell size={16} /> 
          {pushStatus === "loading" ? "Génération..." : "Activer les notifications"}
        </button>

        <button 
          onClick={sendTestNotification}
          disabled={!diag.fcmToken || testStatus === "loading"}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors font-medium text-sm disabled:opacity-50 disabled:grayscale"
        >
          <Send size={16} /> 
          {testStatus === "loading" ? "Envoi..." : "Tester (Push Local)"}
        </button>
      </div>
      
      <p className="text-xs text-foreground/40 text-center">
        Dernière vérification: {status.lastChecked ? status.lastChecked.toLocaleTimeString() : '...'}
      </p>
    </div>
  );
}
