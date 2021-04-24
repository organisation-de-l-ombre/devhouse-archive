import React from "react";
import { Layout } from "../components/layout";
import "../styles/globals.scss";

export default function App({ Component, pageProps }) {
  return (
    <div className={(pageProps.htmlClass || "light") + " provider"}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}
