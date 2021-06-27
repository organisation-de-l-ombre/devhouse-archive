import "react-app-polyfill/ie11";
import Application from "@application/Application";
import React, { FC, useEffect, useState } from "react";
import { decode as cborDecode, encode as cborEncode } from "cbor-js";
import {
  decode as base64Decode,
  encode as base64Encode,
} from "base64-arraybuffer";
import { createStore, persistBlacklist } from "@store/store";
import { BrowserRouter } from "react-router-dom";
import { loadableReady } from "@loadable/component";
import { hydrate } from "react-dom";
import { GlobalState } from "@store/types";
import { Provider } from "react-redux";
import createCache, { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import debounce from "lodash.debounce";
import Cookies from "js-cookie";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "@lib/i18n";
import useLanguage from "@hooks/useLanguage";
import { useNotificationsManager } from "@hooks/useNotifications";
import generateNotificationID from "@lib/generateNotificationID";
import { QueryClient, QueryClientProvider } from "react-query";
import globalStyles from "@styles/Global.module.scss";
import BodyContext from "@contexts/body";
import useReducedMotion from "@hooks/useReducedMotion";
import { Globals } from "react-spring";
import classnames from "classnames";
import themes from "@styles/Themes.module.scss";
import useTheme from "@hooks/useTheme";
import { Helmet } from "react-helmet";

declare global {
  interface Window {
    REDUX_STATE: string;
  }
}

loadableReady((): void => {
  const persistedState: GlobalState = cborDecode(
    base64Decode(window.REDUX_STATE)
  );
  const store = createStore(persistedState);

  store.subscribe(
    debounce((): void => {
      const currentState: GlobalState = store.getState();
      const keys = Object.keys(currentState).filter(
        (key: string): boolean =>
          !persistBlacklist.includes(key as keyof GlobalState)
      ) as (keyof GlobalState)[];

      for (const key of keys) {
        const value = base64Encode(cborEncode(currentState[key]));

        Cookies.set(`imr-redux-${key}`, value);
      }
    }, 500)
  );

  const ReduxDataManager: FC = ({ children }) => {
    const [pageLoaded, setPageLoaded] = useState<boolean>(false);
    const { addNotifications } = useNotificationsManager();
    const { t } = useTranslation(
      "components\\ui\\languageModal\\languageModal"
    );
    const { language } = useLanguage();
    const [scroll, setScroll] = useState<boolean>(true);
    const { theme, contrastMode } = useTheme();

    useEffect((): void => {
      setPageLoaded(true);
    }, []);

    useEffect((): void => {
      i18n.changeLanguage(language).then((): void => {
        if (pageLoaded) {
          if (process.env.NODE_ENV === "production") {
            window.scrollTo({ top: 0 });
          }

          addNotifications([
            {
              id: generateNotificationID(),
              type: "info",
              body: t("languageChanged"),
              time: 5000,
            },
          ]);
        }
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    return (
      <BodyContext.Provider value={{ scroll, setScroll }}>
        <Helmet>
          <body
            className={classnames(
              themes[`${theme}${contrastMode ? "-contrast" : ""}`],
              {
                [globalStyles["overflow-hidden"]]: !scroll,
              }
            )}
          />
        </Helmet>
        {children}
      </BodyContext.Provider>
    );
  };

  const RootComponent: FC = () => {
    const emotionCache: EmotionCache = createCache({
      key: "imr-frontend",
    });
    const queryClient: QueryClient = new QueryClient();
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
      Globals.assign({
        skipAnimation: prefersReducedMotion,
      });
    }, [prefersReducedMotion]);

    return (
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ReduxDataManager>
            <CacheProvider value={emotionCache}>
              <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                  <Application />
                </BrowserRouter>
              </QueryClientProvider>
            </CacheProvider>
          </ReduxDataManager>
        </I18nextProvider>
      </Provider>
    );
  };

  hydrate(<RootComponent />, document.querySelector(".app"));
});

if (module.hot) {
  module.hot.accept();
}
