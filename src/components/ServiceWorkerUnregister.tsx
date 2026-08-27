"use client";

import { useEffect } from "react";

// En développement, désactive et supprime tous les service workers
// pour éviter les conflits de cache entre versions
export default function ServiceWorkerUnregister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "development"
    ) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
          console.log("[Dev] Service worker désenregistré:", registration.scope);
        }
      });

      // Vider tous les caches du navigateur
      if ("caches" in window) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            caches.delete(cacheName);
            console.log("[Dev] Cache supprimé:", cacheName);
          });
        });
      }
    }
  }, []);

  return null;
}
