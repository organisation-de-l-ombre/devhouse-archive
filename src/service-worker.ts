import { precacheAndRoute } from "workbox-precaching/precacheAndRoute";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";
// @ts-ignore
precacheAndRoute(self.__WB_MANIFEST);

const runtimecache = ["/locales", "/fonts"];


registerRoute(
    ({url}) => runtimecache.filter((u) => url.pathname.startsWith(u)),
    new StaleWhileRevalidate({

    })
);
