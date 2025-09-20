
const CACHE = 'ecosafe-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => (k !== CACHE) && caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  e.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((res) => {
      const resClone = res.clone();
      caches.open(CACHE).then((cache) => cache.put(request, resClone));
      return res;
    }).catch(() => cached))
  );
});

// Background Sync (one-off)
self.addEventListener('sync', (event) => {
  // Example placeholder: queue processing could go here
  // if (event.tag === 'sync-queued-actions') {
  //   event.waitUntil(processQueuedActions());
  // }
});

// Periodic Background Sync (if supported)
self.addEventListener('periodicsync', (event) => {
  // Example placeholder: refresh lightweight data
  // if (event.tag === 'refresh-data') {
  //   event.waitUntil(fetch('/health').then(()=>{}).catch(()=>{}));
  // }
});
