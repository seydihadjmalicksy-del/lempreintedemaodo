/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'maodo-pwa-v3';
const STATIC_CACHE = 'maodo-static-v3';
const MEDIA_CACHE = 'maodo-media-v3';
const API_CACHE = 'maodo-api-v3';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/favicon.ico'
];

// API routes to cache for offline access
const CACHEABLE_API_ROUTES = [
  '/api/quotes/daily',
  '/api/quotes',
  '/api/events',
  '/api/khalifes',
  '/api/archives/manuscripts',
  '/api/archives/photos',
  '/api/archives/audio',
  '/api/archives/videos',
  '/api/archives/sources',
  '/api/family-tree',
  '/api/ouvrages/majeurs',
  '/api/ouvrages/autres',
  '/api/ouvrages/bibliotheque',
  '/api/ouvrages/archives-academiques'
];

// Install service worker
self.addEventListener('install', (event) => {
  console.log('[PWA] Installing service worker v3...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[PWA] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.log('[PWA] Cache install failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate service worker
self.addEventListener('activate', (event) => {
  console.log('[PWA] Activating service worker v3...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches (v1, v2)
          if (!cacheName.includes('-v3')) {
            console.log('[PWA] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event handler
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Handle cacheable API requests - Network first, then cache
  if (url.pathname.startsWith('/api/')) {
    const isCacheableRoute = CACHEABLE_API_ROUTES.some(route => url.pathname.includes(route));
    
    if (isCacheableRoute) {
      event.respondWith(
        caches.open(API_CACHE).then((cache) => {
          return fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse.ok) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => {
              console.log('[PWA] Serving API from cache:', url.pathname);
              return cache.match(event.request);
            });
        })
      );
      return;
    }
    // Non-cacheable API routes - network only
    return;
  }
  
  // Handle audio files - cache first for offline playback
  if (url.pathname.endsWith('.mp3') || url.pathname.endsWith('.wav') || 
      url.href.includes('sopnabyfrance.com') || url.href.includes('archive.org')) {
    event.respondWith(
      caches.open(MEDIA_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[PWA] Serving audio from cache:', url.pathname);
            return cachedResponse;
          }
          return fetch(event.request).then((networkResponse) => {
            // Cache audio files for offline use
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
              console.log('[PWA] Cached audio:', url.pathname);
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }
  
  // Handle images - cache first
  if (event.request.destination === 'image' || 
      url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Return placeholder for offline
            return new Response('', { status: 404 });
          });
        });
      })
    );
    return;
  }
  
  // Default strategy: Network first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone and cache the response
        if (response.ok) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return offline page for navigation
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Hors ligne', { 
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  let data = {
    title: "L'empreinte de Maodo",
    body: 'Nouvelle notification',
    icon: '/logo192.png',
    badge: '/logo192.png',
    tag: 'maodo-notification'
  };
  
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }
  
  const options = {
    body: data.body,
    icon: data.icon || '/logo192.png',
    badge: data.badge || '/logo192.png',
    tag: data.tag || 'maodo-notification',
    data: data.url ? { url: data.url } : {},
    vibrate: [100, 50, 100],
    actions: [
      { action: 'open', title: 'Ouvrir' },
      { action: 'close', title: 'Fermer' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'close') return;
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync
self.addEventListener('sync', (event) => {
  console.log('[PWA] Background sync:', event.tag);
});

// Message handler for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_AUDIO') {
    const audioUrl = event.data.url;
    caches.open(MEDIA_CACHE).then((cache) => {
      fetch(audioUrl).then((response) => {
        if (response.ok) {
          cache.put(audioUrl, response);
          console.log('[PWA] Pre-cached audio:', audioUrl);
          // Notify the client
          event.source.postMessage({ type: 'AUDIO_CACHED', url: audioUrl });
        }
      }).catch((err) => {
        console.error('[PWA] Failed to cache audio:', err);
        event.source.postMessage({ type: 'AUDIO_CACHE_FAILED', url: audioUrl, error: err.message });
      });
    });
  }
  
  if (event.data && event.data.type === 'CACHE_ALL_AUDIO') {
    const audioUrls = event.data.urls || [];
    caches.open(MEDIA_CACHE).then((cache) => {
      Promise.all(audioUrls.map(url => 
        fetch(url).then((response) => {
          if (response.ok) {
            cache.put(url, response);
            return { url, success: true };
          }
          return { url, success: false };
        }).catch(() => ({ url, success: false }))
      )).then((results) => {
        event.source.postMessage({ type: 'ALL_AUDIO_CACHED', results });
      });
    });
  }
  
  if (event.data && event.data.type === 'CLEAR_MEDIA_CACHE') {
    caches.delete(MEDIA_CACHE).then(() => {
      console.log('[PWA] Media cache cleared');
      event.source.postMessage({ type: 'MEDIA_CACHE_CLEARED' });
    });
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    Promise.all([
      caches.open(MEDIA_CACHE).then(cache => cache.keys()),
      caches.open(API_CACHE).then(cache => cache.keys()),
      caches.open(CACHE_NAME).then(cache => cache.keys())
    ]).then(([mediaKeys, apiKeys, staticKeys]) => {
      event.source.postMessage({ 
        type: 'CACHE_STATUS', 
        media: mediaKeys.length,
        api: apiKeys.length,
        static: staticKeys.length
      });
    });
  }
  
  if (event.data && event.data.type === 'PRECACHE_API') {
    caches.open(API_CACHE).then((cache) => {
      Promise.all(CACHEABLE_API_ROUTES.map(route => {
        const url = new URL(route, self.location.origin).href;
        return fetch(url).then(response => {
          if (response.ok) {
            cache.put(url, response);
            return { route, success: true };
          }
          return { route, success: false };
        }).catch(() => ({ route, success: false }));
      })).then((results) => {
        console.log('[PWA] API pre-cache complete:', results);
        event.source.postMessage({ type: 'API_PRECACHED', results });
      });
    });
  }
});
