import React from "react";
import express, { Express, Request, Response } from "express";
import { renderToString } from "react-dom/server";
import { StaticRouter, StaticRouterProps } from "react-router-dom";
import Application from "@application/Application";
import { ChunkExtractor, ChunkExtractorManager } from "@loadable/server";
import { resolve } from "path";
import { createStore, persistedKeys } from "@store/store";
import { Provider } from "react-redux";
import i18nInstance from "@lib/i18n";
import i18nMiddleware from "i18next-http-middleware";
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
import { Store } from "redux";
import cookieParser from "cookie-parser";
import { I18nextProvider } from "react-i18next";
import { GlobalState } from "@store/types";
import { LANGUAGE_UPDATED, supportedLanguages } from "@store/language/types";
import { Helmet } from "react-helmet";
import { QueryClient, QueryClientProvider } from "react-query";

interface RenderedApp {
  redirect?: string;
  html?: string;
}

const handleApplication = async ({
  cookies,
  url,
  i18n,
}: Request): Promise<RenderedApp> => {
  const extractor = new ChunkExtractor({
    statsFile: resolve("build", "loadable-stats.json"),
    outputPath: resolve("build/public"),
    entrypoints: ["client", "application/Application"],
  });
  const emotionCache: EmotionCache = createCache({
    key: "imr-frontend",
  });
  const queryClient = new QueryClient();
  const { extractCriticalToChunks, constructStyleTagsFromChunks } =
    createEmotionServer(emotionCache);
  const context: StaticRouterProps["context"] = {};
  const persistedState = {} as never;

  for (const key of persistedKeys) {
    const cookie = cookies[`imr-redux-${key}`];

    if (cookie) {
      persistedState[key] = cborDecode(base64Decode(cookie)) as never;
    }
  }

  const store: Store = createStore(persistedState);
  const { language }: GlobalState = store.getState();

  if (!language.language) {
    store.dispatch({
      type: LANGUAGE_UPDATED,
      payload: supportedLanguages.includes(i18n.language)
        ? i18n.language
        : "en",
    });
  } else {
    i18n.changeLanguage(language.language);
  }

  const { html: reactRender, styles }: EmotionCriticalToChunks =
    extractCriticalToChunks(
      renderToString(
        <ChunkExtractorManager extractor={extractor}>
          <CacheProvider value={emotionCache}>
            <QueryClientProvider client={queryClient}>
              <StaticRouter context={context} location={url}>
                <Provider store={store}>
                  <I18nextProvider i18n={i18n}>
                    <Application />
                  </I18nextProvider>
                </Provider>
              </StaticRouter>
            </QueryClientProvider>
          </CacheProvider>
        </ChunkExtractorManager>
      )
    );

  if (context.url) {
    return { redirect: context.url };
  }

  const helmet = Helmet.renderStatic();
  const linkTags: string = extractor.getLinkTags();
  const styletags: string = extractor.getStyleTags();
  const scriptTags: string = extractor.getScriptTags();
  const html = `
  <!doctype html>
    <html ${helmet.htmlAttributes.toString()}>
    <head>
      <meta charset="utf-8" />
      <title>International Media Referencing</title>
      <link rel="icon" href="/favicon.ico" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      />
      <meta name="theme-color" content="#000000" />
      <meta content="website" property="og:type">
      <link rel="apple-touch-icon" href="/icons/logo192.png" />
      <link
        rel="manifest"
        crossorigin="use-credentials"
        href="/manifest.json"
      />
      <link
        href="/embed.json"
        type="application/json+oembed"
      />
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      ${linkTags}
      ${styletags}
      ${await extractor.getInlineStyleTags()}
      ${constructStyleTagsFromChunks({ html: reactRender, styles })}
      <link rel="stylesheet" href="/index.css" />
      <script id="imr-data">
        window.REDUX_STATE = "${base64Encode(cborEncode(store.getState()))}"
      </script>
      <script id="analytics">
        window.dataLayer = window.dataLayer || [];

        function gtag() {
          dataLayer.push(arguments);
        }

        gtag("js", new Date());
        gtag("config", "GA_MEASUREMENT_ID", {
          send_page_view: false,
        });

        gtag("config", "G-JE051NFJX1");
        window.GA_TAG = "G-JE051NFJX1";
      </script>
    </head>
    <body ${helmet.bodyAttributes.toString()}>
      <div class="app">${reactRender}</div>
      ${scriptTags}
    </body>
  </html>
  `;

  return { html };
};

const server: Express = express()
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR as string))
  .use(cookieParser())
  .use(i18nMiddleware.handle(i18nInstance))
  .get("/*", async (request: Request, response: Response): Promise<void> => {
    const { redirect = "", html = "" } = await handleApplication(request);

    if (redirect) {
      response.redirect(redirect);
    }

    response.send(html);
  });

export default server;
