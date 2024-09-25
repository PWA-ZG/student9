self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('my-cache').then((cache) => {
            return cache.addAll([
                '../src/App.css',
                '../src/index.css',
                '../src/logo.svg',
                'favicon.ico',
                'index.html',
                'logo192.png',
                'logo512.png',
                'manifest.json'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if(response) {
                return response;
            }

            return fetch(event.request).then((response) => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                const clonedResponse = response.clone();

                caches.open('my-cache').then((cache) => {
                    cache.put(event.request, clonedResponse);
                });

                return response;
            });
        })
    );
});