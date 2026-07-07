const CACHE_NAME = 'gasapp-v1';
const urlsToCache = [
    '/',
    'index.html',
    'add-fuel.html',
    'add-service.html',
    'edit-service.html',
    'history.html',
    'css/style.css',
    'js/db.js',
    'js/dashboard.js',
    'js/add-fuel.js',
    'js/add-service.js',
    'js/edit-service.js',
    'js/history.js',
    'js/utils.js',
    'manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
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