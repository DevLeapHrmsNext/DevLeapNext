// app/components/NotificationListener.tsx
'use client';

import { useEffect } from "react";
import { messaging, onMessage } from "../../../utils/firebaseClientConfig";

export default function NotificationListener() {
  useEffect(() => {
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      const title = payload.notification?.title || 'New Notification';
      const body = payload.notification?.body || '';
      const url = payload.data?.url || '/';

      if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
          body,
          icon: '/images/logo.png',
          data: { url },
        });

        notification.onclick = (event) => {
          event.preventDefault();
          window.open(notification.data.url, '_blank');
        };
      }
    });

    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  return null; // No UI
}
