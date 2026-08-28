"use client";

import { useEffect } from "react";
import { app } from "@/lib/firebase";
import { getMessaging, onMessage } from "firebase/messaging";
import { useRouter } from "next/navigation";

export default function PushNotificationForeground() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      try {
        const messaging = getMessaging(app);
        
        const unsubscribe = onMessage(messaging, (payload) => {
          console.log("Message reçu au premier plan :", payload);
          
          // Vérifier si le navigateur supporte les notifications et si on a la permission
          if ("Notification" in window && Notification.permission === "granted") {
            const title = payload.notification?.title || payload.data?.title || "Nouveau message";
            const options = {
              body: payload.notification?.body || payload.data?.body,
              icon: payload.notification?.icon || "/icons/icon-192x192.png",
              vibrate: [200, 100, 200, 100, 200, 100, 200],
              data: {
                url: payload.data?.url || "/admin/messages"
              }
            };
            
            const notification = new Notification(title, options);
            
            notification.onclick = (event) => {
              event.preventDefault();
              notification.close();
              router.push(options.data.url);
            };
          } else {
            // Fallback si les notifications ne sont pas supportées nativement
            alert("Nouveau message reçu: " + (payload.notification?.body || payload.data?.body));
          }
        });
        
        return () => unsubscribe();
      } catch (err) {
        console.error("Firebase messaging foreground error:", err);
      }
    }
  }, [router]);

  return null; // Ce composant n'affiche rien visuellement
}
