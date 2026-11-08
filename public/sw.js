// Oneworld Progressive Web App (PWA) Offline-First Service Worker
// Version: 2.1.0 - Ultra-fast caching & 100% offline autonomy

const CACHE_NAME = 'oneworld-offline-v2';
const STATIC_PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg'
];

// Install: pre-cache critical shell immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_PRECACHE).catch((err) => {
        console.warn('[Oneworld SW] Precache warning:', err);
      });
    })
  );
});

// Activate: clean up older caches immediately and claim all clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Oneworld SW] Removing legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Ultra-fast Cache-First strategy with automatic background revalidation
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Bypass non-http protocols (chrome-extension, etc.)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Bypass WebSocket upgrade requests
  if (url.pathname === '/ws' || event.request.headers.get('upgrade') === 'websocket') {
    return;
  }

  // Bypass live API calls if they shouldn't be cached, but provide offline responses for data endpoints
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Return offline mock JSON so frontend never crashes when offline
        if (url.pathname === '/api/health') {
          return new Response(JSON.stringify({ status: 'healthy', offline: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        return new Response(JSON.stringify({ offline: true, message: 'Offline Mode Active' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Cache-First with Stale-While-Revalidate for all assets (JS, CSS, HTML, fonts, images)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and request is HTML navigation, serve cached root / index.html
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html') || caches.match('/');
          }
          return null;
        });

      // Return cached version immediately for lightning speed, or wait for network if not in cache
      return cachedResponse || fetchPromise;
    })
  );
});
