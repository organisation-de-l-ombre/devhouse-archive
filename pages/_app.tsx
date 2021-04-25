import React from "react";
import { Layout } from "../components/layout";
import "../styles/globals.scss";
import "loaders.css";
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function App({ Component, pageProps }) {
  return (
    <div className={`${pageProps.htmlClass || "light"} provider`}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}
