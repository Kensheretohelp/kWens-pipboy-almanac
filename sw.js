// PIP-BOY 3000 Gardening OS service worker — PWA v1
const CACHE_NAME = 'kwen-gardening-os-v1';

const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './supply-database.js',
  './garden-database.js',
  './my-garden.js',
  './calendar-engine.js',
  './garden-app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './images/basil.png',
  './images/kwen-vault-farmer.png',
  './images/marigold.png',
  './images/pepper.png',
  './images/raised-bed-layout.png',
  './images/tomato.png',
  './images/vault-overseer.jpg',
  './images/vault-overseer.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
