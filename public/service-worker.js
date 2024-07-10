const CACHE_NAME = 'image-cache-v1';
const IMAGE_URLS = [
  '/assets/image1.jpg',
  '/assets/image2.jpg',
  '/assets/image3.jpg',
  '/assets/image4.jpg',
  '/assets/news1.jpg',
  '/assets/news1_1.jpg',
  '/assets/news2.jpg',
  '/assets/news2_1.jpg',
  '/assets/news3.jpg',
  '/assets/news3_1.jpg',
  '/assets/news4.jpg',
  '/assets/news4_1.png',
  '/assets/news5.jpg',
  '/assets/news5_1.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(IMAGE_URLS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  }
});
