import React, { ReactElement } from "react";
import { CookiesProvider, useCookies } from "react-cookie";
import Layout from "../components/layout";
import "../styles/globals.scss";
import "loaders.css";
import { Theme, ThemeContext } from "../contexts/Theme";
import themes from "../styles/themes.module.scss";
import parseCookies from "../lib/cookies/parseCookies";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const App = ({ Component, pageProps }): ReactElement => {
  const [cookies, setCookie] = useCookies(["theme"]);
  const themeValue: Theme = cookies.theme
    ? cookies.theme
    : {
        theme: "light",
      };
  const switchTheme = React.useCallback((): void => {
    setCookie(
      "theme",
      JSON.stringify({
        theme: themeValue.theme === "light" ? "dark" : "light",
      })
    );
  }, [setCookie, themeValue.theme]);

  return (
    <CookiesProvider>
      <ThemeContext.Provider value={{ theme: themeValue, switchTheme }}>
        <div className={`${themes[themeValue.theme]} provider`}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </div>
      </ThemeContext.Provider>
    </CookiesProvider>
  );
};

export const getServerSideProps = ({ req }): { props: Theme } => {
  const data = parseCookies(req) as Theme;

  console.log(req.headers);

  return {
    props: {
      theme:
        data && (data.theme === "light" || data.theme === "dark")
          ? data.theme
          : "light",
    },
  };
};

export default App;
