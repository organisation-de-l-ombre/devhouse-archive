import React from "react";
import { StaticRouter } from "react-router-dom";
import express, { Request } from "express";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import createStore from "@state/redux";
import i18next from "i18next";
import middleware from "i18next-http-middleware";
import createEmotionServer from "@emotion/server/create-instance";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import Backend from "i18next-fs-backend";
import { ChunkExtractor, ChunkExtractorManager } from "@loadable/server";
import path from "path";
import { initialize } from "unleash-client";
import { QueryClient, QueryClientProvider } from "react-query";
import { dehydrate } from "react-query/hydration";
import PreloadContext from "@components/PreloadContext/PreloadContext";
import App from "./Root";

const pathLocales = path.join(
  process.cwd(),
  "./build/public/locales/{{lng}}/{{ns}}.json"
);

const unleash = initialize({
  url: "https://gitlab.com/api/v4/feature_flags/unleash/21654973",
  appName: process.env.GITLAB_ENV || "developement",
  instanceId: "USbeLowCufaWzxRu3np3",
});

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    initImmediate: false,
    backend: {
      loadPath: pathLocales,
    },
    supportedLngs: ["en", "fr"],
    ns: ["layout"],
    preload: ["en", "fr"],
    react: {
      useSuspense: false,
    },
  });

export const renderApp = async (
  req: Request
): Promise<{ redirect?: string; html?: string }> => {
  const context: { redirect?: string; url?: string } = {};

  const flags = unleash.getFeatureToggleDefinitions().map((flag) => ({
    name: flag.name,
    enabled: unleash.isEnabled(flag.name, {}),
    variants: flag.variants,
  }));

  const store = createStore({
    account: { state: "available", client_id: "123" },
    featureFlags: { featureFlags: flags },
  });

  const key = "ssr-render";
  const cache = createCache({ key });
  const { extractCriticalToChunks, constructStyleTagsFromChunks } =
    createEmotionServer(cache);
  const extractor = new ChunkExtractor({
    statsFile: path.resolve("build/loadable-stats.json"),
    // razzle client bundle entrypoint is client.js
    entrypoints: ["client"],
  });
  const queryClient = new QueryClient();
  const preloaderContext = {
    done: false,
    promises: [],
  };

  const jsx = (
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
  );

  renderToStaticMarkup(jsx);
  preloaderContext.done = true;

  await Promise.all(preloaderContext.promises);
  const dehydratedState = dehydrate(queryClient);

  const { html, styles } = extractCriticalToChunks(renderToString(jsx));
  // collect script tags
  const scriptTags = extractor.getScriptTags();

  // collect "preload/prefetch" links
  const linkTags = extractor.getLinkTags();

  // collect style tags
  const styleTags = extractor.getStyleTags();

  if (context.url) {
    return { redirect: context.url };
  }
  const rendered = `<!doctype html>
    <html lang="">
    <head>
    <script>
    window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydratedState).replace(
      /</g,
      "\\u003c"
    )};
    window.PRELOADED_STATE = ${JSON.stringify(store.getState()).replace(
      /</g,
      "\\u003c"
    )};
    window.INSTATE = ${JSON.stringify({
      options: req.i18n.store.options,
      data: req.i18n.store.data,
    })};
    window.LANG = ${JSON.stringify({ lang: req.language })};
    </script>
</head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${linkTags}
        ${styleTags}
        ${constructStyleTagsFromChunks({ html, styles })}
    <body>
        <div id="root">${html}</div>
        ${scriptTags}
    </body>
  </html>`;

  return { html: rendered };
};

const server = express();

server
  .disable("x-powered-by")
  .use(middleware.handle(i18next))
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
  .get("/*", async (req, res) => {
    const { html = "", redirect = null } = await renderApp(req);
    if (redirect) {
      res.redirect(redirect);
    } else {
      res.send(html);
    }
  });

export default server;
