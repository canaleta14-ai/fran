const CACHE_NAME = 'lovehibo-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/espanol.html',
  '/frances.html',
  '/aleman.html',
  '/portugues.html',
  '/italiano.html',
  '/holandes.html',
  '/polaco.html',
  '/css/style.min.css',
  '/css/w3.css',
  '/css/script.min.js',
  '/logos/PINGUINO LOVE HIBO.jpg',
  '/404.html'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estrategia: Cache First, falling back to Network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - devolver respuesta
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          response => {
            // Verificar que recibimos una respuesta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar la respuesta
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(() => {
          // Si falla la red, mostrar página 404 cacheada
          return caches.match('/404.html');
        });
      })
  );
});
