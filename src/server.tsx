import React from "react";
import express, { Request, Response } from "express";
import { renderToString } from "react-dom/server";
import { StaticRouter, StaticRouterProps } from "react-router-dom";
import Application from "@application/Application";
import { ChunkExtractor, ChunkExtractorManager } from "@loadable/server";
import { resolve } from "path";

interface RenderedApp {
  redirect?: string;
  html?: string;
}

const renderApp = (request: Request): RenderedApp => {
  const context: StaticRouterProps["context"] = {};
  const extractor = new ChunkExtractor({
    statsFile: resolve("build", "loadable-stats.json"),
    entrypoints: ["client"],
  });
  const reactRender: string = renderToString(
    <ChunkExtractorManager extractor={extractor}>
      <StaticRouter context={context} location={request.url}>
        <Application />
      </StaticRouter>
    </ChunkExtractorManager>
  );

  if (context.url) {
    return { redirect: context.url };
  }

  const linkTags: string = extractor.getLinkTags();
  const styletags: string = extractor.getStyleTags();
  const scriptTags: string = extractor.getScriptTags();
  const html = `
  <!doctype html>
    <html lang="">
    <head>
      <meta charSet="utf-8" />
      <title>IMR</title>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${linkTags}
      ${styletags}
    </head>
    <body>
        <div class="app">${reactRender}</div>
        ${scriptTags}
    </body>
  </html>
  `;

  return { html };
};

const server = express()
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR as string))
  .get("/*", (request: Request, response: Response): void => {
    const { redirect = "", html = "" } = renderApp(request);

    if (redirect) {
      response.redirect(redirect);
    } else {
      response.send(html);
    }
  });

export default server;
