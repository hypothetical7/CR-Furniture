<<<<<<< HEAD
const CACHE_NAME = "cr-furniture-v5";
=======
const CACHE_NAME = "cr-furniture-v1";
>>>>>>> d2ac507f742c3681a5d1e3df7f06ce2484b7ebd3

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
<<<<<<< HEAD
  "./CR-Furniture-Logos/favicon-32.png",
  "./CR-Furniture-Logos/favicon-192.png",
  "./CR-Furniture-Logos/favicon-512.png",
  "./CR-Furniture-Logos/cr-logo-profile-photo-512.png",
  "./CR-Furniture-Logos/cr-logo-header-horizontal.png",
  "./images/living-room.jpeg",
  "./images/modular-kitchen.jpeg",
  "./images/bedroom.jpeg",
  "./images/dining-set.jpeg",
  "./images/home-office.jpeg",
  "./images/full-home.jpeg"
=======
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "./icons/apple-touch-icon.png",
  "./images/living-room.jpg",
  "./images/modular-kitchen.jpg",
  "./images/bedroom-suite.jpg",
  "./images/dining-set.jpg",
  "./images/home-office.jpg",
  "./images/full-home.jpg"
>>>>>>> d2ac507f742c3681a5d1e3df7f06ce2484b7ebd3
];

// Install: pre-cache the core site so it works offline right after first visit
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean up old cache versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first for the page itself (so updates are picked up when online),
// cache-first for everything else (images, icons, manifest), with offline fallback.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const isNavigation =
    event.request.mode === "navigate" ||
    (event.request.headers.get("accept") || "").includes("text/html");

  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => cached);
    })
  );
});
