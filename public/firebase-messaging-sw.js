importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWsGAkHJPxUb8BuaXmhzF2-reWM9lrEhA",
  authDomain: "leap-hrms2.firebaseapp.com",
  projectId: "leap-hrms2",
  storageBucket: "leap-hrms2.firebasestorage.app",
  messagingSenderId: "100410730404",
  appId: "1:100410730404:web:9b2231fa88a2e212798331",
  measurementId: "G-5SQZQCKPBC"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background notifications
// messaging.onBackgroundMessage(function(payload) {
//   console.log('Received background message ', payload);

//   const notificationTitle = payload.data.title;
//   const notificationOptions = {
//     body: payload.data.body,
//     icon: payload.data.attachment||'/images/logo.png',
//     image: payload.data.attachment || undefined,
//     data: {
//       url: payload.data.url,
//     },
//     actions: payload.data.attachment ? [{
//       action: "view_attachment",
//       title: "View Attachment",
//       icon: payload.data.attachment||"/images/logo.png"
//     }] : []
//   };
 
//   // self.registration.showNotification(notificationTitle, notificationOptions);
// });

self.addEventListener('notificationclick', function(event) {
  const url = event.notification.data?.url || '/';
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
