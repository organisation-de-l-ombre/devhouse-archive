/// <reference no-default-lib="true"/>
/// <reference lib="es2015" />
/// <reference lib="webworker" />

import { precacheAndRoute } from "workbox-precaching/precacheAndRoute";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";
import { BackgroundSyncPlugin } from "workbox-background-sync";

// eslint-disable-next-line no-restricted-globals,no-underscore-dangle
precacheAndRoute((self as any).__WB_MANIFEST);

const bgSyncPlugin = new BackgroundSyncPlugin("myQueueName", {
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
});

const runtimecache = ["/locales", "/fonts"];
registerRoute(
  ({ url }) => runtimecache.filter((u) => url.pathname.startsWith(u))[0],
  new StaleWhileRevalidate({
    plugins: [bgSyncPlugin as never],
  })
);
