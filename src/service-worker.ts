/// <reference lib="es2015" />
/// <reference lib="webworker" />

import { precacheAndRoute } from "workbox-precaching/precacheAndRoute";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope;

// eslint-disable-next-line no-restricted-globals,no-underscore-dangle,@typescript-eslint/no-explicit-any
precacheAndRoute((self as any).__WB_MANIFEST);

const runtimeCache: string[] = ["/locales", "/fonts"];

registerRoute(
  ({ url }) => runtimeCache.filter((u) => url.pathname.startsWith(u)),
  new StaleWhileRevalidate({})
);

self.addEventListener("message", (content) => {
  if (content.type === "SKIP_WAITING" || content.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

export type {};
