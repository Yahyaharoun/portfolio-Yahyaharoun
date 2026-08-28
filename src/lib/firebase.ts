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
      console.log("Firebase Messaging n'est pas supporté par ce navigateur.");
      return null;
    }

    // Demander la permission explicitement
    if (typeof window !== "undefined" && "Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.log("Permission de notification refusée par l'utilisateur.");
        return null;
      }
    }

    const messaging = getMessaging(app);
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    
    // Obtenir le Service Worker existant pour éviter les conflits avec next-pwa
    const registration = await navigator.serviceWorker.getRegistration();
    
    const currentToken = await getToken(messaging, { 
      vapidKey,
      serviceWorkerRegistration: registration
    });
    
    if (currentToken) {
      console.log("Token FCM obtenu:", currentToken);
      return currentToken;
    } else {
      console.log("Aucun token FCM disponible. Permission à demander.");
      return null;
    }
  } catch (err) {
    console.error("Une erreur s'est produite lors de la récupération du token.", err);
    return null;
  }
};
