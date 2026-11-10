/* GAFI Analizador · Service Worker
   - App shell: precache (cache-first, se renueva al cambiar VERSION)
   - Librerías CDN (SheetJS, ExcelJS, jsPDF, html2canvas): stale-while-revalidate */
const VERSION = 'gafi-analizador-v1.1.1';
const SHELL = [
  './', './index.html', './manifest.json', './css/styles.css',
  './js/app.bundle.js', './js/core/reader.worker.js', './js/core/read-core.js',
  './assets/logo-gafi.png', './assets/fonts/fonts.css',
  './assets/fonts/dm-sans-latin-400-normal.woff2', './assets/fonts/dm-sans-latin-500-normal.woff2', './assets/fonts/dm-sans-latin-600-normal.woff2',
  './assets/fonts/dm-sans-latin-700-normal.woff2', './assets/fonts/space-mono-latin-400-normal.woff2', './assets/fonts/space-mono-latin-700-normal.woff2',
  './assets/fontawesome/css/fontawesome.min.css', './assets/fontawesome/css/solid.min.css', './assets/fontawesome/webfonts/fa-solid-900.woff2',
  './icons/favicon.png', './icons/icon-192.png', './icons/icon-512.png',
];
const CDN = /^https:\/\/(cdn\.sheetjs\.com|cdnjs\.cloudflare\.com)\//;

self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION && k !== 'gafi-cdn').map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  if (CDN.test(request.url)) {
    e.respondWith(caches.open('gafi-cdn').then(async (c) => {
      const hit = await c.match(request);
      const net = fetch(request).then((r) => { if (r.ok || r.type === 'opaque') c.put(request, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (new URL(request.url).origin !== location.origin) return;
  e.respondWith(caches.match(request, { ignoreSearch: true }).then((hit) => hit || fetch(request).then((r) => {
    if (r.ok) caches.open(VERSION).then((c) => c.put(request, r.clone()));
    return r;
  }).catch(() => caches.match('./index.html'))));
});
