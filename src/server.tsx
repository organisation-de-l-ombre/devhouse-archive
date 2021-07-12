import React from "react";
import express, { Express, Request, Response } from "express";
import { renderToString } from "react-dom/server";
import { StaticRouter, StaticRouterProps } from "react-router-dom";
import Application from "@application/Application";
import { ChunkExtractor, ChunkExtractorManager } from "@loadable/server";
import { join, resolve } from "path";
import ssrPrepass from "react-ssr-prepass";
import { createStore, persistedKeys } from "@store/store";
import { Provider } from "react-redux";
import i18nInstance from "i18next";
import FSBackend from "i18next-fs-backend";
import i18nMiddleware, { LanguageDetector } from "i18next-http-middleware";
import {
  encode as base64Encode,
  decode as base64Decode,
} from "base64-arraybuffer";
import { encode as cborEncode, decode as cborDecode } from "cbor-js";
import createCache, { EmotionCache } from "@emotion/cache";
import createEmotionServer, {
  EmotionCriticalToChunks,
} from "@emotion/server/create-instance";
import { CacheProvider } from "@emotion/react";
import { DeepPartial, Store } from "redux";
import cookieParser from "cookie-parser";
import { I18nextProvider } from "react-i18next";
import { GlobalState } from "@store/types";
import { supportedLanguages } from "@store/language/types";
import { Helmet, HelmetData } from "react-helmet";
import { QueryClient, QueryClientProvider } from "react-query";
import { readdirSync, statSync } from "fs";
import { ServerContext, ServerContextProps } from "@contexts/server";
import themes from "@styles/Themes.module.scss";
import "@styles/Root.scss";

const handleApplication = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { cookies, query, i18n, url } = request;
  const extractor = new ChunkExtractor({
    statsFile: resolve("build", "loadable-stats.json"),
    outputPath: resolve("build/public"),
    entrypoints: ["client"],
  });
  const emotionCache: EmotionCache = createCache({
    key: "imr-frontend",
  });
  const queryClient = new QueryClient();
  const { extractCriticalToChunks, constructStyleTagsFromChunks } =
    createEmotionServer(emotionCache);
  const context: StaticRouterProps["context"] = {};
  const persistedState: DeepPartial<GlobalState> = {};

  for (const key of persistedKeys) {
    const cookie = cookies[`imr-data-${key}`];

    if (cookie) {
      persistedState[key] = cborDecode(base64Decode(cookie));
    }
  }

  const queryLanguage = query.language as string | undefined;
  let languageInQuery = false;

  if (
    queryLanguage &&
    queryLanguage.match(/[a-z]{2,2}/) &&
    supportedLanguages.includes(queryLanguage)
  ) {
    persistedState.language = {
      ...persistedState.language,
      language: queryLanguage,
    };

    languageInQuery = true;
  } else {
    const { language } = persistedState;

    if (!language?.language) {
      persistedState.language = {
        ...persistedState.language,
        language: supportedLanguages.includes(i18n.language.split("-")[0])
          ? i18n.language.split("-")[0]
          : "en",
      };
    }
  }

  await i18n.changeLanguage(persistedState.language?.language);

  const serverContext: ServerContextProps = {
    request,
    response,
    preload: [],
    preloadLoaded: false,
  };
  const store: Store = createStore(persistedState);
  const jsx = (
    <ChunkExtractorManager extractor={extractor}>
      <CacheProvider value={emotionCache}>
        <QueryClientProvider client={queryClient}>
          <StaticRouter context={context} location={url}>
            <ServerContext.Provider value={serverContext}>
              <Provider store={store}>
                <I18nextProvider i18n={i18n}>
                  <Application />
                </I18nextProvider>
              </Provider>
            </ServerContext.Provider>
          </StaticRouter>
        </QueryClientProvider>
      </CacheProvider>
    </ChunkExtractorManager>
  );

  await ssrPrepass(jsx);
  await Promise.all(serverContext.preload);
  serverContext.preloadLoaded = true;

  const { html: reactRender, styles }: EmotionCriticalToChunks =
    extractCriticalToChunks(renderToString(jsx));

  if (context.url) {
    response.redirect(context.url);
    return;
  }

  const helmet: HelmetData = Helmet.renderStatic();
  const globalState: GlobalState = store.getState();
  const {
    theme: { theme, contrastMode },
  } = globalState;
  const linkTags: string = extractor.getLinkTags();
  const styletags: string = extractor.getStyleTags();
  const scriptTags: string = extractor.getScriptTags();
  response.send(
    `
    <!doctype html>
    <html ${helmet.htmlAttributes.toString()}>
      <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        ${linkTags}
        ${styletags}
        ${await extractor.getInlineStyleTags()}
        ${constructStyleTagsFromChunks({ html: reactRender, styles })}
        <script id="imr-frontend-data">
          window.DATA_STORE = "${base64Encode(cborEncode(globalState))}";
          window.LANGUAGE_STORE = "${base64Encode(
            cborEncode(i18n.store.data)
          )}";
          window.LANGUAGE = "${i18n.language}";
          window.LANGUAGE_IN_QUERY = ${languageInQuery};
          window.THEME_DETECTION = ${!persistedState.theme};
        </script>
      </head>
      <body
        class="${themes[`${theme}${contrastMode ? `-${contrastMode}` : ""}`]}"
        ${helmet.bodyAttributes.toString()}
      >
        <div class="app">${reactRender}</div>
        ${scriptTags}
      </body>
    </html>
  `
  );
};

const walkDirectories = (directory: string): string[] => {
  const folders = readdirSync(directory);
  const files = [];

  for (const folder of folders) {
    const path = join(directory, folder);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      files.push(...walkDirectories(path));
    } else {
      files.push(path);
    }
  }

  return files;
};

const server: Express = express();

i18nInstance
  .use(LanguageDetector)
  .use(FSBackend)
  .init(
    {
      debug: false,
      initImmediate: false,
      fallbackLng: "en",
      preload: ["en"],
      supportedLngs: supportedLanguages,
      keySeparator: ".",
      nonExplicitSupportedLngs: true,
      defaultNS: "root",
      fallbackNS: "root",
      ns: walkDirectories("./build/public/locales/en").map((path) => {
        return path
          .replace(/(build\/public\/locales\/en\/|\.json)/g, "")
          .replace(/\//g, "\\");
      }),
      load: "all",
      backend: {
        loadPath: (lng: string, namespace: string) =>
          `./build/public/locales/${lng}/${namespace.replace(/\\/g, "/")}.json`,
      },
    },
    (): void => {
      server
        .use(express.static(process.env.RAZZLE_PUBLIC_DIR as string))
        .use(cookieParser())
        .use(i18nMiddleware.handle(i18nInstance))
        .set("Etag", true)
        .get("/*", handleApplication);
    }
  );

export default server;
