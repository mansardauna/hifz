// Hifz Quranic LMS Service Worker
const CACHE_NAME = 'hifz-pwa-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/favicon.ico'
];

// Install Event - Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean up stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Stale-while-revalidate strategy for assets, network first for pages
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  // Strictly prevent caching of all authenticated, administrative, and private routes
  const isExcludedFromCache =
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.includes('/login') ||
    url.pathname.includes('/admin') ||
    url.pathname.includes('/super-admin') ||
    url.pathname.includes('/lms') ||
    url.pathname.includes('/dashboard') ||
    url.pathname.includes('/settings') ||
    url.pathname.includes('/profile') ||
    url.pathname.includes('/onboarding');

  if (isExcludedFromCache) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache valid HTTP responses
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Return cached version if network is offline
        return caches.match(event.request);
      })
  );
});
