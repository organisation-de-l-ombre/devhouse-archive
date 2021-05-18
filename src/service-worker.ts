/// <reference no-default-lib="true"/>
/// <reference lib="es2015" />
/// <reference lib="webworker" />

import { precacheAndRoute } from "workbox-precaching/precacheAndRoute";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

export type {};
declare const self: ServiceWorkerGlobalScope;

// eslint-disable-next-line no-restricted-globals,no-underscore-dangle
precacheAndRoute((self as any).__WB_MANIFEST);

const runtimecache = ["/locales", "/.oauth.json"];
registerRoute(
  ({ url }) => runtimecache.filter((u) => url.pathname.startsWith(u))[0],
  new StaleWhileRevalidate()
);

self.addEventListener("message", (content) => {
  if (content.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
