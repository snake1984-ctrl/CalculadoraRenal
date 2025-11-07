const CACHE_NAME = 'calcrenal-cache-v21';
const urlsToCache = [
  './',
  './index.html',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Archivos en caché');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Error al cachear archivos:', err))
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activado');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Limpiando caché antigua');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // <- Añadido
  );
  self.skipWaiting(); // <- Añadido
});


self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si la petición a internet funciona, devuélvela
        return response;
      })
      .catch(() => {
        // Si falla (offline), usa la caché solo PARA el .html principal
        return caches.match('./index.html');
      })
  );
});



