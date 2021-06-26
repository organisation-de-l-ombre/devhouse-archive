import React from "react";
import { StaticRouter, StaticRouterProps } from "react-router-dom";
import express, { Request, Response } from "express";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import createStore from "@state/redux";
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
import PreloadContext from "@components/PreloadContext/PreloadContext";
import Helmet from "react-helmet";
import { SSRContext } from "@components/SSRContext/SSRContext";
import App from "./Root";

const unleash = initialize({
  url: "https://gitlab.com/api/v4/feature_flags/unleash/21654973",
  appName: process.env.GITLAB_ENV || "developement",
  instanceId: "USbeLowCufaWzxRu3np3",
});

const emotionCacheKey = "ssr-render";

export const renderApp = async (req: Request, res: Response): Promise<void> => {
  const context: StaticRouterProps["context"] = {};

  // We get the flags linked to the user.
  const flags = unleash.getFeatureToggleDefinitions().map((flag) => ({
    name: flag.name,
    enabled: process.env.NODE_ENV === "development" ? true : flag.enabled,
    variants: flag.variants,
  }));

  // This is the initialState given to the ssr renderer.
  const store = createStore({
    account: {
      state: "available",
      client_id:
        process.env.client_id || "4f48003e-3e66-40c4-b2b7-a0516dc40d4a",
    },
    featureFlags: { featureFlags: flags },
  });

  const cache = createCache({ key: emotionCacheKey });
  const { extractCriticalToChunks, constructStyleTagsFromChunks } =
    createEmotionServer(cache);

  const extractor = new ChunkExtractor({
    statsFile: path.resolve("build/loadable-stats.json"),
    outputPath: path.resolve("build/public"),
    // razzle client bundle entrypoint is client.js
    entrypoints: ["client", "Root"],
  });

  const queryClient = new QueryClient();
  const preloaderContext: { done: boolean; promises: Promise<never>[] } = {
    done: false,
    promises: [],
  };

  const jsx = (
    <SSRContext.Provider value={{ req, res }}>
      <PreloadContext.Provider value={preloaderContext}>
        <ChunkExtractorManager extractor={extractor}>
          <QueryClientProvider client={queryClient}>
            <CacheProvider value={cache}>
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

  // We render a first time to get all the loading promises.
  renderToStaticMarkup(jsx);
  preloaderContext.done = true;
  // Wait for all the loading promises to finish.
  await Promise.all(preloaderContext.promises.map((x) => x.catch()));
  // Create the cache for the react query state.
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
  res.send(`<!doctype html>
    <html ${helmet.htmlAttributes.toString()}>
      <head>
        <script>
          window.REACT_QUERY = ${JSON.stringify(dehydratedState).replace(
            /</g,
            "\\u003c"
          )};
          window.PRELOADED_STATE = ${JSON.stringify(store.getState()).replace(
            /</g,
            "\\u003c"
          )};
          window.INSTATE = ${JSON.stringify(req.i18n.store)};
          window.LANG = ${JSON.stringify(req.language)};
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
  .disable("x-powered-by")
  .use(middleware.handle(i18next))
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
  .get("/*", renderApp);

export default server;
