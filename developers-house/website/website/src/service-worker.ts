/// <reference no-default-lib="true"/>
/// <reference lib="es2015" />
/// <reference lib="webworker" />

import { precacheAndRoute } from "workbox-precaching/precacheAndRoute";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";
import { BackgroundSyncPlugin } from "workbox-background-sync";
import { ExpirationPlugin } from "workbox-expiration";

// eslint-disable-next-line no-restricted-globals,no-underscore-dangle
precacheAndRoute((self as any).__WB_MANIFEST);

const bgSyncPlugin = new BackgroundSyncPlugin("myQueueName", {
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
});

const runtimecache = ["/locales", "/fonts"];
registerRoute(
  ({ url }) => runtimecache.filter((u) => url.pathname.startsWith(u))[0],
  new StaleWhileRevalidate({
    plugins: [
      bgSyncPlugin as never,
      new ExpirationPlugin({
        // Only cache requests for a week
        maxAgeSeconds: 24 * 60 * 60,
        // Only cache 10 requests.
        maxEntries: 10,
      }) as never,
    ],
  })
);
