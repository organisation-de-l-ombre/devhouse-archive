import React from "react";
import { StaticRouter, StaticRouterProps } from "react-router-dom";
import express, { Request, Response } from "express";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import createStore, { RootState } from "@state/redux";
import i18next from "i18next";
import middleware from "i18next-http-middleware";
import createEmotionServer from "@emotion/server/create-instance";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import openTracing from "express-opentracing";
import { ChunkExtractor, ChunkExtractorManager } from "@loadable/server";
import path from "path";
import { initialize } from "unleash-client";
import { QueryClient, QueryClientProvider } from "react-query";
import { dehydrate } from "react-query/hydration";
import PreloadContext, {
  PreloadContextType,
} from "@components/PreloadContext/PreloadContext";
import Helmet from "react-helmet";
import { SSRContext } from "@components/SSRContext/SSRContext";
import cookieParser from "cookie-parser";
import cbor from "cbor-js";
import { decode, encode } from "base64-arraybuffer";
import { DeepPartial } from "redux";
import CreateRedis from "ioredis";
import reactSSRPrepass from "react-ssr-prepass";
import { Tracer } from "@utilities/jaeger";
import { opentracing } from "jaeger-client";
import App from "./Root";

declare module "express-serve-static-core" {
  interface Request {
    span: opentracing.Span;
  }
}

const redis = new CreateRedis({
  sentinels: [
    {
      host: process.env.REDIS_HOST as string,
      port: Number.parseInt(process.env.REDIS_PORT || "6379", 10),
    },
  ],
  sentinelPassword: process.env.REDIS_PASSWORD,
  name: "mymaster",
  host: "localhost",
});

const unleash = initialize({
  url: "https://gitlab.com/api/v4/feature_flags/unleash/21654973",
  appName: process.env.GITLAB_ENV || "developement",
  instanceId: "USbeLowCufaWzxRu3np3",
});

const emotionCacheKey = "ssr-render";

export const renderApp = async (req: Request, res: Response): Promise<void> => {
  req.span.logEvent("render_start", {});

  const context: StaticRouterProps["context"] = {};
  if (
    req.query.language &&
    req.i18n.languages.includes(req.query?.language as string)
  )
    req.i18n.changeLanguage(req.query.language as string);

  // We get the flags linked to the user.
  const flags = unleash.getFeatureToggleDefinitions().map((flag) => ({
    name: flag.name,
    enabled: process.env.NODE_ENV === "development" ? true : flag.enabled,
    variants: flag.variants,
  }));

  req.span.addTags(flags);

  const state: DeepPartial<RootState> = {
    account: {},
    theme: { theme: "light" },
    featureFlags: { featureFlags: flags },
  };
  const persistedStoreKeys = [
    "theme",
    "account",
  ] as never as (keyof RootState)[];

  const loadingSpan = Tracer.startSpan("start_loading_state", {
    childOf: req.span,
  });

  persistedStoreKeys.forEach((element: keyof RootState) => {
    const cookie = req.cookies[`store-${element}`];
    if (!cookie) return;
    Object.assign(state[element], cbor.decode(decode(cookie)));
  });
  if (!state.account) state.account = {};
  state.account.client_id =
    process.env.client_id || "4f48003e-3e66-40c4-b2b7-a0516dc40d4a";
  state.account.state = "available";

  // This is the initialState given to the ssr renderer.
  const store = createStore(state);

  const emotionCache = createCache({ key: emotionCacheKey });
  const { extractCriticalToChunks, constructStyleTagsFromChunks } =
    createEmotionServer(emotionCache);

  const extractor = new ChunkExtractor({
    statsFile: path.resolve("build/loadable-stats.json"),
    outputPath: path.resolve("build/public"),
    // razzle client bundle entrypoint is client.js
    entrypoints: ["client", "Root"],
  });

  const queryClient = new QueryClient();
  const preloaderContext: PreloadContextType = {
    done: false,
    promises: [],
  };

  loadingSpan.finish();

  const preRenderPass = Tracer.startSpan("pre_render_pass", {
    childOf: req.span,
  });

  const jsx = (
    <SSRContext.Provider value={{ req, res }}>
      <PreloadContext.Provider value={preloaderContext}>
        <ChunkExtractorManager extractor={extractor}>
          <QueryClientProvider client={queryClient}>
            <CacheProvider value={emotionCache}>
              <StaticRouter context={context} location={req.url}>
                <Provider store={store}>
                  <App i18nInstance={req.i18n} />
                </Provider>
              </StaticRouter>
            </CacheProvider>
          </QueryClientProvider>
        </ChunkExtractorManager>
      </PreloadContext.Provider>
    </SSRContext.Provider>
  );

  await reactSSRPrepass(jsx);

  const loadingDataSpan = Tracer.startSpan("load_data", {
    childOf: preRenderPass,
  });

  preloaderContext.done = true;
  // Wait for all the loading promises to finish.
  await Promise.all(
    preloaderContext.promises.map(async ({ cache, promise, queryKey }) => {
      const key = `cache::website${encode(cbor.encode(queryKey))}`;
      if (cache) {
        const cacheValue = await redis.get(key);
        if (cacheValue) {
          queryClient.prefetchQuery(queryKey, () => JSON.parse(cacheValue));
          return Promise.resolve();
        }
      }
      const result = await promise;
      if (cache) {
        queueMicrotask(async () => {
          await redis.set(key, JSON.stringify(result), "ex", 120);
        });
      }
      return result;
    })
  );

  loadingDataSpan.finish();

  const renderSpan = Tracer.startSpan("render", { childOf: req.span });

  const dehydratedState = dehydrate(queryClient);
  // Get all the used assets using emotion.
  const { html, styles } = extractCriticalToChunks(renderToString(jsx));

  const helmet = Helmet.renderStatic();
  // collect script tags
  const scriptTags = extractor.getScriptTags();
  // collect "preload/prefetch" links
  const linkTags = extractor.getLinkTags();
  // collect style tags
  const styleTags = extractor.getStyleTags();

  renderSpan.finish();

  res.send(`<!doctype html>
    <html ${helmet.htmlAttributes.toString()}>
      <head>
        <script>
          window.REACT_QUERY = "${encode(cbor.encode(dehydratedState))}";
          window.PRELOADED_STATE = "${encode(cbor.encode(store.getState()))}";
          window.INSTATE = "${encode(cbor.encode(req.i18n.store.data))}";
          window.LANG = "${req.language}";
        </script>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        ${linkTags}
        ${styleTags}
        ${await extractor.getInlineStyleTags()}
        ${constructStyleTagsFromChunks({ html, styles })}
      </head>
      <body ${helmet.bodyAttributes.toString()}>
        <div id="root">${html}</div>
        ${scriptTags}
      </body>
    </html>
  `);
};

const server = express();

server
  .use(openTracing({ tracer: Tracer }))
  .use(cookieParser())
  .disable("x-powered-by")
  .use(middleware.handle(i18next))
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
  .get("/*", renderApp);

export default server;
