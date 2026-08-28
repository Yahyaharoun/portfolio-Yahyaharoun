// @ts-nocheck
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDQoo9-hrw8bpIutnepYiIXWlrGxF6HUvQ",
  authDomain: "portfeuill-yahya.firebaseapp.com",
  projectId: "portfeuill-yahya",
  storageBucket: "portfeuill-yahya.firebasestorage.app",
  messagingSenderId: "892981313709",
  appId: "1:892981313709:web:de08cf107d42c603c4c624",
  measurementId: "G-EN37XM0HZT"
};

// Protect against multiple initializations
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[Worker] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || payload.data?.title || 'Nouvelle Notification';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body,
    icon: payload.notification?.icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png', // Monochrome badge if possible, but 192x192 will be used
    image: payload.notification?.image || payload.data?.image,
    vibrate: [200, 100, 200, 100, 200, 100, 200], // Long vibration pattern
    data: {
      url: payload.data?.url || payload.fcmOptions?.link || '/admin/messages'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  const urlToOpen = new URL(event.notification.data?.url || '/admin/messages', self.location.origin).href;
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
