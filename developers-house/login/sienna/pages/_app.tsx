import React, { ReactElement } from "react";
import { CookiesProvider, useCookies } from "react-cookie";
import Head from "next/head";
import Layout from "../components/layout";
import "../styles/globals.scss";
import "loaders.css";
import { Theme, ThemeContext } from "../contexts/Theme";
import themes from "../styles/themes.module.scss";
import parseCookies from "../lib/cookies/parseCookies";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const App = ({ Component, pageProps, theme }): ReactElement => {
  const [cookies, setCookie] = useCookies(["theme"]);
  const themeValue: Theme = {
    theme: cookies.theme || theme,
  };

  const switchTheme = React.useCallback((): void => {
    setCookie("theme", themeValue.theme === "light" ? "dark" : "light");
  }, [setCookie, themeValue.theme]);

  return (
    <>
      <Head key="app-root">
        <title>Sienna</title>
        <link rel="icon" href="favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <meta content="website" property="og:type" />
        <meta
          content="https://auth-server.developershouse.xyz/"
          property="og:url"
        />
        <meta
          content="/dialog/assets/pictures/banner.png"
          property="og:image"
        />
        <meta content="Sienna" property="og:title" />
        <meta
          name="description"
          content="The authentication system for Developer's House services."
        />
        <meta
          content="The authentication system for Developer's House services."
          property="og:description"
        />
        <link
          rel="manifest"
          crossOrigin="use-credentials"
          href="/dialog/manifest.json"
        />
        <link href="/dialog/embed.json" type="application/json+oembed" />
      </Head>
      <CookiesProvider>
        <ThemeContext.Provider value={{ theme: themeValue, switchTheme }}>
          <div className={`${themes[themeValue.theme]} provider`}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </div>
        </ThemeContext.Provider>
      </CookiesProvider>
    </>
  );
};

/**
 * Properties given to the application at the first navigation.
 * @param props
 */
App.getInitialProps = (props): Theme => {
  const cookies = parseCookies(props.ctx.req) as Theme;
  const colorScheme = props.router.query.color_scheme;
  return {
    theme: colorScheme || cookies.theme || "light",
  };
};

export default App;
