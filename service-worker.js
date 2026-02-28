const CACHE_NAME = 'calcrenal-cache-auto';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './scripts.js',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// ESTRATEGIA: Network First (Red primero, Caché como respaldo)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si hay internet, clonamos la respuesta fresca y la metemos en caché
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response; // Devolvemos la versión más reciente
      })
      .catch(() => {
        // Si no hay internet o falla, sacamos lo que haya en la caché
        return caches.match(event.request).then(cachedResponse => {
            return cachedResponse || caches.match('./index.html');
        });
      })
  );
});
