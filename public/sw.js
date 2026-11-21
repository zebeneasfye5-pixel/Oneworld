// Oneworld Progressive Web App (PWA) Service Worker
// Version: 3.1.0 - Fast Edge Caching & Zero-Poison WebView Fetch Handling

const CACHE_NAME = 'oneworld-offline-v24';
const STATIC_PRECACHE = [
  '/manifest.json',
  '/icon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_PRECACHE).catch(() => {});
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  if (url.pathname === '/ws' || url.pathname === '/sw.js' || event.request.headers.get('upgrade') === 'websocket') return;

  // Never serve stale or fabricated data for live backend APIs
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(JSON.stringify({ error: 'Network unavailable', offline: true }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );
    return;
  }

  // Strictly Network-First with 3.5s timeout for HTML navigations (prevents stale JS hash trap)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3500);
        try {
          const networkResponse = await fetch(event.request, {
            cache: 'no-store',
            signal: controller.signal
          });
          clearTimeout(timer);
          const ct = networkResponse.headers.get('content-type') || '';
          if (networkResponse.ok && ct.includes('text/html')) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', clone));
          }
          return networkResponse;
        } catch {
          clearTimeout(timer);
          return (await caches.match('/index.html')) || fetch(event.request);
        }
      })()
    );
    return;
  }

  // Immutable hashed /assets/* & static files: NEVER cache text/html into a JS/CSS asset slot
  event.respondWith(
    caches.match(event.request).then(async (cachedResponse) => {
      if (cachedResponse) {
        const cachedCt = cachedResponse.headers.get('content-type') || '';
        const looksLikeScriptOrStyle = /\.(js|mjs|css)(\?|$)/i.test(url.pathname);
        if (looksLikeScriptOrStyle && cachedCt.includes('text/html')) {
          caches.open(CACHE_NAME).then((cache) => cache.delete(event.request));
        } else {
          // Revalidate quietly in background only for non-hashed URLs
          if (!url.pathname.startsWith('/assets/')) {
            fetch(event.request).then((netRes) => {
              const netCt = netRes.headers.get('content-type') || '';
              if (netRes.ok && !(looksLikeScriptOrStyle && netCt.includes('text/html'))) {
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, netRes.clone()));
              }
            }).catch(() => {});
          }
          return cachedResponse;
        }
      }

      try {
        const networkResponse = await fetch(event.request);
        const netCt = networkResponse.headers.get('content-type') || '';
        const looksLikeScriptOrStyle = /\.(js|mjs|css)(\?|$)/i.test(url.pathname);
        if (networkResponse.ok && !(looksLikeScriptOrStyle && netCt.includes('text/html'))) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      } catch {
        return new Response('', { status: 504 });
      }
    })
  );
});
