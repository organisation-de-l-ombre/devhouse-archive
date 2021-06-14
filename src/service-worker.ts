/// <reference lib="es2015" />
/// <reference lib="webworker" />
import { precacheAndRoute } from "workbox-precaching/precacheAndRoute";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope;

// eslint-disable-next-line no-restricted-globals,no-underscore-dangle,@typescript-eslint/no-explicit-any
precacheAndRoute((self as any).__WB_MANIFEST);

const runtimeCache: string[] = ["/locales", "/fonts", "/favicon.ico"];

registerRoute(
  ({ url }) =>
    runtimeCache.filter((u): boolean => url.pathname.startsWith(u)).length,
  new StaleWhileRevalidate({ cacheName: "imr-cache" })
);

self.addEventListener("message", (content) => {
  if (content.type === "SKIP_WAITING" || content.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

export type {};
