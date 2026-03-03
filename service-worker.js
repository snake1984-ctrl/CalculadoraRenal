// CAMBIA ESTO CADA VEZ QUE SUBAS CAMBIOS (v1, v2, v3...)
// Solo con cambiar este número, fuerzas a todos los móviles a actualizarse.
const CACHE_NAME = 'nefroped-v2'; 

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

// 1. INSTALACIÓN: Guardamos lo básico
self.addEventListener('install', event => {
  // Obliga al SW a activarse inmediatamente, sin esperar a que cierres la pestaña
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 2. ACTIVACIÓN: ¡AQUÍ ESTABA EL FALLO! LIMPIEZA DE BASURA
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Si la caché que hay en el móvil no se llama como la nueva (nefroped-v1)
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // ¡Bórrala sin piedad!
            console.log('Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Tomar el control de todas las pestañas abiertas
      return self.clients.claim();
    })
  );
});

// 3. ESTRATEGIA: Network First (Intentar internet, si falla, usar caché)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si hay internet, clonamos la respuesta fresca y actualizamos la caché
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        
        return response; // Devolvemos lo fresco
      })
      .catch(() => {
        // Si no hay internet, devolvemos lo que haya en la caché
        return caches.match(event.request).then(cachedResponse => {
             // Si es una navegación (HTML) y no está en caché, devolver index.html
             if (event.request.mode === 'navigate') {
                return caches.match('./index.html');
             }
             return cachedResponse;
        });
      })
  );
});

