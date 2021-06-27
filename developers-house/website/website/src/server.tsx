import React from "react";
import { StaticRouter, StaticRouterProps } from "react-router-dom";
import express, { Request, Response } from "express";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import createStore, { RootState } from "@state/redux";
import i18next from "i18next";
import middleware from "i18next-http-middleware";
import createEmotionServer from "@emotion/server/create-instance";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
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
import App from "./Root";

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

  const state: DeepPartial<RootState> = {
    account: {},
    theme: { theme: "light" },
    featureFlags: { featureFlags: flags },
  };
  const persistedStoreKeys = [
    "theme",
    "account",
  ] as never as (keyof RootState)[];

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

  let render: string;
  // We render a first time to get all the loading promises.
  render = renderToStaticMarkup(jsx);

  if (preloaderContext.promises.length > 0) {
    preloaderContext.done = true;
    // Wait for all the loading promises to finish.
    await Promise.all(
      preloaderContext.promises.map(async ({ cache, promise }) => {
        if (cache) {
          if (redis.exists(`cache::website${cache}`)) {
            return JSON.parse(
              (await redis.get(`cache::website${cache}`)) as string
            );
          }
        }
        const result = await promise;
        if (cache) {
          queueMicrotask(async () => {
            await redis.set(`cache::website${cache}`, JSON.stringify(result));
          });
        }
        return result;
      })
    );
    // Create the cache for the react query state.
    render = renderToString(jsx);
  }

  const dehydratedState = dehydrate(queryClient);
  // Get all the used assets using emotion.
  const { html, styles } = extractCriticalToChunks(render);

  const helmet = Helmet.renderStatic();
  // collect script tags
  const scriptTags = extractor.getScriptTags();
  // collect "preload/prefetch" links
  const linkTags = extractor.getLinkTags();
  // collect style tags
  const styleTags = extractor.getStyleTags();
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
  .use(cookieParser())
  .disable("x-powered-by")
  .use(middleware.handle(i18next))
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
  .get("/*", renderApp);

export default server;
