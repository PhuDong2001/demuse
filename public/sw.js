// Service Worker for Demuse PWA & Web Push Notifications
const CACHE_NAME = "demuse-v1";
const STATIC_ASSETS = [
  "/",
  "/about",
  "/privacy",
  "/terms",
  "/demuse_logo.png",
  "/site.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Continue install even if individual asset fails to cache
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Stale-While-Revalidate caching strategy for static resources
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Cache static image, fonts, manifests
  if (
    url.pathname.match(/\.(?:png|jpg|jpeg|svg|webp|ico|woff2|webmanifest)$/) ||
    STATIC_ASSETS.includes(url.pathname)
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});

// Handle Push Notifications (iOS Web Push / Android / Desktop)
self.addEventListener("push", (event) => {
  let data = {
    title: "Demuse · Upcoming Class Reminder",
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
