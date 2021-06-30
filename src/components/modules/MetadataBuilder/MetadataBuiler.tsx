import { ServerContext, ServerContextProps } from "@contexts/server";
import useLanguage from "@hooks/useLanguage";
import { supportedLanguages } from "@store/language/types";
import React, { FC, ReactElement, useContext } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router";

interface MetadataBuilderProps {
  title?: string;
  embedTitle?: string;
  description?: string;
  image?: string;
  keywords?: string[];
  locales?: string[];
}

const formatURL = (serverContext: ServerContextProps, path: string): string => {
  if (serverContext) {
    const { request } = serverContext;

    return `${request.protocol}://${request.get("host")}${path}`;
  }

  return `${window.location.origin}${path}`;
};

const MetadataBuilder: FC<MetadataBuilderProps> = ({
  title,
  embedTitle,
  description: initialDescription,
  image,
  keywords,
  locales = supportedLanguages,
}) => {
  const { t } = useTranslation("root");
  const { language } = useLanguage();
  const serverContext = useContext(ServerContext);
  const { path } = useRouteMatch();

  const url = formatURL(serverContext, path);
  let description = t("helmet.description");

  if (initialDescription) {
    const descriptionArray = initialDescription.split(" ");

    description = `${descriptionArray.slice(0, 150).join(" ")}${
      descriptionArray.length > 150 ? "..." : ""
    }`;
  }

  return (
    <Helmet htmlAttributes={{ lang: language }}>
      <meta charSet="utf-8" />
      <title>{title || t("helmet.title")}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#E65555" />
      <meta name="format-detection" content="telephone=no" />

      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-touch-fullscreen" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <link rel="apple-touch-icon" href="icons/logo192.png" />
      <link rel="apple-touch-startup-image" href="icons/logo192.png" />

      <link
        rel="manifest"
        crossOrigin="use-credentials"
        href="/manifest.json"
      />
      <link href="/embed.json" type="application/json+oembed" />
      <link rel="canonical" href={url} />

      <meta name="language" content={language} />
      <meta
        name="author"
        content="Developer's House, https://developershouse.xyz, contact@developershouse.xyz"
      />
      <meta
        name="owner"
        content="Developer's House, https://developershouse.xyz, contact@developershouse.xyz"
      />
      <meta name="copyright" content={t("helmet.title")} />
      <meta name="reply-to" content="contact.imr@developershouse.xyz" />
      <meta name="url" content={url} />
      <meta name="identifier-URL" content={url} />
      <meta name="description" content={description} />
      <meta name="subject" content={t("helmet.topics")} />
      <meta name="topic" content={t("helmet.topics")} />
      <meta name="category" content={t("helmet.topics")} />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta
        name="keywords"
        content={keywords ? keywords.join(", ") : t("helmet.topics")}
      />

      {locales.map((locale: string): ReactElement => {
        return (
          <link
            key={locale}
            rel="alternate"
            hrefLang={locale}
            href={`${url}?language=%22${locale}%22`}
          />
        );
      })}

      <meta name="og:site_name" content={t("helmet.title")} />
      <meta name="og:title" content={embedTitle || t("helmet.title")} />
      <meta name="og:locale" content={language} />
      {locales.map((locale: string): ReactElement => {
        return (
          <meta key={locale} name="og:locale:alternate" content={locale} />
        );
      })}
      <meta name="og:url" content={url} />
      <meta name="og:email" content="contact.imr@developershouse.xyz" />
      <meta name="og:description" content={description} />
      <meta name="og:type" content="website" />
      {image && <meta name="og:image" content={image} />}

      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-H3WZYZR49L"
      />
      <script id="analytics">
        {`window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }

        gtag("js", new Date());
        gtag("config", "GA_MEASUREMENT_ID", {
            send_page_view: false,
        });
        gtag("config", "G-H3WZYZR49L");

        window.GA_TAG = "G-H3WZYZR49L";`}
      </script>
    </Helmet>
  );
};

export default MetadataBuilder;
