import { SSRContext } from "@components/SSRContext/SSRContext";
import i18n from "@utilities/i18n";
import { I18next } from "i18next-http-middleware";
import React, { FC, useContext } from "react";
import { Helmet } from "react-helmet";
import { useRouteMatch } from "react-router";

type MetadataProps = {
  title: string;
  description: string;
  image?: string;
  keywords?: string[];
};

export const Metadata: FC<MetadataProps> = ({
  title,
  description,
  image = "https://www.developershouse.xyz/icons/embed-back.png?v=4",
  keywords = ["developershouse", "projects"],
}) => {
  const shortDescription =
    description.length > 32 ? `${description.slice(0, 32)}...` : description;
  const match = useRouteMatch();
  const context = useContext(SSRContext);
  let url = `${match}`;
  let i18next: I18next;
  if (context) {
    i18next = context.req.i18n;
    url = context.req.url;
  } else {
    i18next = i18n;
    url = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
  }

  return (
    <Helmet>
      <title>{title}</title>
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-H3WZYZR49L"
      />
      <script>
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
      <meta name="og:title" content={title} />
      <meta name="og:type" content="website" />
      <meta name="og:locale" content={i18next.language} />
      <meta charSet="utf-8" />

      {i18next.languages.map((language) => (
        <meta name="og:locale:alternate" key={language} content={language} />
      ))}
      <meta content="#000000" name="theme-color" />

      <meta name="og:url" content={url} />
      <meta name="og:image" content={image} />
      <meta name="og:site_name" content="Developer's House" />
      <meta name="og:description" content={description} />
      <meta name="og:determiner" content="" />
      <meta name="og:email" content="admin@developershouse.xyz" />
      <meta content="summary_large_image" name="twitter:card" />
      <link
        href="https://www.developershouse.xyz/embed.json"
        type="application/json+oembed"
      />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
        rel="stylesheet"
        media="all"
      />

      <meta name="keywords" content={keywords.join(",")} />
      <meta name="description" content={description} />
      <meta name="subject" content={shortDescription} />
      <meta name="copyright" content="Developer's House" />
      <meta name="language" content={i18n.language} />
      <meta name="summary" content={shortDescription} />
      <meta name="reply-to" content="admin@developershouse.xyz" />
      <meta name="owner" content="Developer's House" />
      <meta name="url" content={url} />
      <meta name="identifier-URL" content={url} />
      <meta name="category" content="Developement" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      <link
        rel="manifest"
        crossOrigin="use-credentials"
        href="/manifest.json"
      />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta content="yes" name="apple-touch-fullscreen" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="format-detection" content="telephone=no" />
      <link rel="apple-touch-icon" href="icons/logo192.png" />
      <link rel="apple-touch-startup-image" href="icons/logo192.png" />
    </Helmet>
  );
};
