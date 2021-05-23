import React, { ReactElement, useState } from "react";
import { CookiesProvider, useCookies } from "react-cookie";
import NProgress from "nprogress"; // nprogress module
import Router from "next/router";
import Layout from "../components/layout";
import "../styles/globals.scss";
import "loaders.css";
import { Theme, ThemeContext } from "../contexts/Theme";
import themes from "../styles/themes.module.scss";
import parseCookies from "../lib/cookies/parseCookies";
import { TwoFAContext, TwoFAContextData } from "../contexts/2FAContext";
import "nprogress/nprogress.css"; // styles of nprogress

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const App = ({ Component, pageProps, theme }): ReactElement => {
  const [cookies, setCookie] = useCookies(["theme"]);
  const themeValue: Theme = {
    theme: cookies.theme || theme,
  };

  const switchTheme = React.useCallback((): void => {
    setCookie("theme", themeValue.theme === "light" ? "dark" : "light");
  }, [setCookie, themeValue.theme]);

  const [data, setTwoFaData] = useState<TwoFAContextData>(null);

  return (
    <CookiesProvider>
      <TwoFAContext.Provider value={{ setTwoFaData, data }}>
        <ThemeContext.Provider value={{ theme: themeValue, switchTheme }}>
          <div className={`${themes[themeValue.theme]} provider`}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </div>
        </ThemeContext.Provider>
      </TwoFAContext.Provider>
    </CookiesProvider>
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
