// Cache only app shell assets. Network requests (including Firebase) remain untouched.
const CACHE = 'in-between-shift-pwa-v1';
const ASSETS = ['./in_between_shift_icon_192.png', './in_between_shift_icon_512.png', './manifest.webmanifest'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  // Do not intercept application data or HTML: always get the latest site.
  if (event.request.method !== 'GET') return;
  const path = new URL(event.request.url).pathname;
  if (!ASSETS.some(asset => path.endsWith(asset.slice(1)))) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
