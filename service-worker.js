
const CACHE_NAME = 'nrl-league-heroes-v3-cache';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './data/cards-2026.js',
  './manifest.json',
  './assets/team-badges/broncos.svg',
  './assets/team-badges/raiders.svg',
  './assets/team-badges/bulldogs.svg',
  './assets/team-badges/sharks.svg',
  './assets/team-badges/dolphins.svg',
  './assets/team-badges/titans.svg',
  './assets/team-badges/sea-eagles.svg',
  './assets/team-badges/storm.svg',
  './assets/team-badges/knights.svg',
  './assets/team-badges/cowboys.svg',
  './assets/team-badges/eels.svg',
  './assets/team-badges/panthers.svg',
  './assets/team-badges/rabbitohs.svg',
  './assets/team-badges/dragons.svg',
  './assets/team-badges/roosters.svg',
  './assets/team-badges/warriors.svg',
  './assets/team-badges/tigers.svg',
  './assets/team-badges/special.svg',
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
