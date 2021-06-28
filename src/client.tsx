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
import { useSSR, useTranslation } from "react-i18next";
import useLanguage from "@hooks/useLanguage";
import { useNotificationsManager } from "@hooks/useNotifications";
import generateNotificationID from "@lib/generateNotificationID";
import { QueryClient, QueryClientProvider } from "react-query";
import useReducedMotion from "@hooks/useReducedMotion";
import { Globals } from "react-spring";
import { Resource } from "i18next";

declare global {
  interface Window {
    REDUX_STORE: string;
    LANGUAGE_STORE: string;
    LANGUAGE: string;
  }
}

loadableReady((): void => {
  const persistedState: GlobalState = cborDecode(
    base64Decode(window.REDUX_STORE)
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

  const DataManager: FC = ({ children }) => {
    const [pageLoaded, setPageLoaded] = useState<boolean>(false);
    const { addNotifications } = useNotificationsManager();
    const { t } = useTranslation(
      "components\\ui\\languageModal\\languageModal"
    );
    const { language } = useLanguage();

    useEffect((): void => {
      setPageLoaded(true);
    }, []);

    useEffect((): void => {
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    return <>{children}</>;
  };

  const RootComponent: FC = () => {
    const languageStore: Resource = cborDecode(
      base64Decode(window.LANGUAGE_STORE)
    );

    useSSR(languageStore, window.LANGUAGE);

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
        <DataManager>
          <CacheProvider value={emotionCache}>
            <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                <Application />
              </BrowserRouter>
            </QueryClientProvider>
          </CacheProvider>
        </DataManager>
      </Provider>
    );
  };

  hydrate(<RootComponent />, document.querySelector(".app"));
});

if (module.hot) {
  module.hot.accept();
}
