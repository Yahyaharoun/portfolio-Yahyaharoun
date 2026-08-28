importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

// Configuration avec les variables brutes car process.env n'est pas dispo dans le SW
const firebaseConfig = {
  apiKey: "AIzaSyDQoo9-hrw8bpIutnepYiIXWlrGxF6HUvQ",
  authDomain: "portfeuill-yahya.firebaseapp.com",
  projectId: "portfeuill-yahya",
  storageBucket: "portfeuill-yahya.firebasestorage.app",
  messagingSenderId: "892981313709",
  appId: "1:892981313709:web:de08cf107d42c603c4c624",
  measurementId: "G-EN37XM0HZT"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'Nouvelle Notification';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
