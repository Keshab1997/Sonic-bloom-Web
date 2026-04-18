const CACHE_NAME = "sonic-bloom-v3";
const STATIC_ASSETS = ["/", "/index.html"];

// Separate caches for different content types
const STATIC_CACHE = "sonic-bloom-static-v3";
const API_CACHE = "sonic-bloom-api-v3";
const MEDIA_CACHE = "sonic-bloom-media-v3";
const OFFLINE_CACHE = "sonic-bloom-offline-v3";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.startsWith("sonic-bloom-v"))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Helper: Check if response is cacheable
function isCacheable(response) {
  return response && response.status === 200 && response.type === "basic";
}

// Helper: Check if request is for media (audio/video)
function isMediaRequest(request) {
  const dest = request.destination;
  return dest === "audio" || dest === "video" || dest === "media";
}

// Helper: Check if request is for an image
function isImageRequest(request) {
  return request.destination === "image";
}

// Background sync for downloads
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-downloads") {
    event.waitUntil(syncDownloads());
  }
});

async function syncDownloads() {
  // Handle offline downloads when back online
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only cache GET requests
  if (request.method !== "GET") return;

  // Skip chrome-extension and other non-http(s) requests
  if (!request.url.startsWith("http")) return;

  // Media requests (audio/video) - don't cache, just pass through
  // This prevents 206 Partial Content errors
  if (isMediaRequest(request)) {
    event.respondWith(fetch(request));
    return;
  }

  // API calls - network-first with cache fallback
  if (request.url.includes("/api/") || request.url.includes("jiosaavn")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (isCacheable(response)) {
            const clone = response.clone();
            caches.open(API_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || fetch(request)))
    );
    return;
  }

  // Images - cache-first with network fallback
  if (isImageRequest(request)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (isCacheable(response)) {
            const clone = response.clone();
            caches.open(MEDIA_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      }).catch(() => fetch(request))
    );
    return;
  }

  // Static assets - cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (isCacheable(response)) {
          const clone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    }).catch(() => fetch(request))
  );
});

// Handle messages from the app
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
