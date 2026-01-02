const CACHE_NAME = 'rate-ur-x-v7';
const urlsToCache = [
  'https://ja-haas41.github.io/rateURx/',
  'https://ja-haas41.github.io/rateURx/index.html',
  'https://ja-haas41.github.io/rateURx/styles.css',
  'https://ja-haas41.github.io/rateURx/app.js',
  'https://ja-haas41.github.io/rateURx/manifest.json',
  'https://ja-haas41.github.io/rateURx/icon-192.png',
  'https://ja-haas41.github.io/rateURx/icon-512.png'
];

self.addEventListener('install', event => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});