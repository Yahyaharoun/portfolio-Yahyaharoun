import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDQoo9-hrw8bpIutnepYiIXWlrGxF6HUvQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "portfeuill-yahya.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "portfeuill-yahya",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "portfeuill-yahya.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "892981313709",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:892981313709:web:de08cf107d42c603c4c624",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-EN37XM0HZT"
};

// Initialize Firebase only once
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const requestForToken = async () => {
  try {
    const supported = await isSupported();
    if (!supported) {
      alert("Debug iOS: Firebase isSupported() a retourné false. (Notifications Push non supportées ou iOS < 16.4)");
      return null;
    }

    // Demander la permission explicitement
    if (typeof window !== "undefined" && "Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Debug iOS: Permission refusée. Statut = " + permission);
        return null;
      }
    } else {
      alert("Debug iOS: L'objet Notification n'existe pas dans window.");
      return null;
    }

    const messaging = getMessaging(app);
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    
    // S'assurer qu'un Service Worker est enregistré
    let registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      registration = await navigator.serviceWorker.register("/sw.js");
    }
    
    // Attendre qu'il soit actif
    const readyRegistration = await navigator.serviceWorker.ready;
    
    // ASTUCE IOS : Désinscrire l'ancienne souscription si elle est bloquée
    try {
      const existingSub = await readyRegistration.pushManager.getSubscription();
      if (existingSub) {
        await existingSub.unsubscribe();
        console.log("Ancienne souscription Push nettoyée.");
      }
    } catch (e) {
      console.log("Erreur lors du nettoyage de la souscription:", e);
    }
    
    if (!readyRegistration) {
      alert("Debug iOS: Service Worker non disponible après .ready");
      return null;
    }

    const currentToken = await Promise.race([
      getToken(messaging, { 
        vapidKey,
        serviceWorkerRegistration: readyRegistration
      }),
      new Promise<null>((_, reject) => setTimeout(() => reject(new Error("FCM_TIMEOUT")), 10000))
    ]);
    
    if (currentToken) {
      return currentToken;
    } else {
      alert("Debug iOS: getToken() a réussi mais a renvoyé un token vide/null.");
      return null;
    }
  } catch (err: any) {
    if (err.message === "FCM_TIMEOUT") {
      alert("Debug iOS: Firebase ne répond pas (Timeout 10s). Le Service Worker ou IndexedDB est bloqué.");
    } else {
      alert("Debug iOS Erreur: " + err.message + " | " + err.name);
    }
    return null;
  }
};
