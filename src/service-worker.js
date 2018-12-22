/* eslint-disable */
// dokus:
// https://developers.google.com/web/tools/workbox/modules/workbox-sw
// https://developers.google.com/web/tools/workbox/guides/codelabs/webpack

/*
// exclude, siehe note in https://developers.google.com/web/tools/workbox/modules/workbox-sw#skip_waiting_and_clients_claim
workbox.skipWaiting();
workbox.clientsClaim();
 */

workbox.precaching.precacheAndRoute(self.__precacheManifest);

// das ist für "Offer a page reload for users" https://developers.google.com/web/tools/workbox/guides/advanced-recipes
// wird in src/components/ServiceWorkerUi.tsx gefeuert
self.addEventListener(
  'message',
  event => event.data === 'skipWaiting' && self.skipWaiting()
);

// caching strategies from https://developers.google.com/web/tools/workbox/guides/common-recipes

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

// cache images
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);
