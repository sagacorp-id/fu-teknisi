/* Service worker: ambil versi terbaru dari jaringan, pakai cache saat offline.
   Halaman utama disimpan sejak awal supaya Buat FU dan Kalkulator tetap bisa dibuka tanpa internet. */
var C = 'fu-teknisi-v1-2-2';
var AWAL = ['./', 'index.html', 'config.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'favicon.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(C).then(function (c) { return c.addAll(AWAL).catch(function () {}); }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (x) { return x !== C; }).map(function (x) { return caches.delete(x); })); })
    .then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(function (r) {
    var k = r.clone(); caches.open(C).then(function (c) { c.put(e.request, k); }); return r;
  }).catch(function () { return caches.match(e.request).then(function (m) { return m || caches.match('index.html'); }); }));
});
