// Service Worker for Demuse PWA & Web Push Notifications
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle Push Notifications (iOS Web Push / Android / Desktop)
self.addEventListener("push", (event) => {
  let data = {
    title: "Upcoming Class Reminder",
    body: "You have a class starting soon.",
    icon: "/demuse/android-chrome-192x192.png",
    badge: "/demuse/favicon-32x32.png",
    data: { url: "/timetable" },
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/demuse/android-chrome-192x192.png",
    badge: data.badge || "/demuse/favicon-32x32.png",
    vibrate: [200, 100, 200],
    data: data.data || { url: "/timetable" },
    tag: "demuse-class-reminder",
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle Notification Click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(urlToOpen) && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
