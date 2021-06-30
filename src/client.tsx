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
import loadable, { loadableReady } from "@loadable/component";
import { hydrate } from "react-dom";
import { GlobalState } from "@store/types";
import { Provider } from "react-redux";
import createCache, { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import debounce from "lodash.debounce";
import Cookies from "js-cookie";
import { initReactI18next, useSSR, useTranslation } from "react-i18next";
import useLanguage from "@hooks/useLanguage";
import {
  useNotificationsManager,
  useNotificationsState,
} from "@hooks/useNotifications";
import generateNotificationID from "@lib/generateNotificationID";
import { QueryClient, QueryClientProvider } from "react-query";
import useReducedMotion from "@hooks/useReducedMotion";
import { Globals } from "react-spring";
import i18n, { Resource } from "i18next";
import { supportedLanguages } from "@store/language/types";
import HTTPBackend from "i18next-http-backend";
import useQueryState from "@hooks/useQueryState";
import useTheme from "@hooks/useTheme";
import BodyContext from "@contexts/body";
import { Helmet } from "react-helmet";
import classnames from "classnames";
import themes from "@styles/Themes.module.scss";
import globalStyles from "@styles/Global.module.scss";

i18n
  .use(initReactI18next)
  .use(HTTPBackend)
  .init({
    debug: false,
    initImmediate: false,
    fallbackLng: "en",
    preload: ["en"],
    supportedLngs: supportedLanguages,
    load: "languageOnly",
    react: {
      useSuspense: false,
    },
  });

declare global {
  interface Window {
    REDUX_STORE: string;
    LANGUAGE_STORE: string;
    LANGUAGE: string;
  }
}

loadableReady((): void => {
  const NotificationsModal = loadable(
    () =>
      import(
        "@components/ui/Notifications/NotificationsModal/NotificationsModal"
      )
  );
  const NotificationsGroup = loadable(
    () =>
      import(
        "@components/ui/Notifications/NotificationsGroup/NotificationsGroup"
      )
  );
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
    const [, setLanguageInQuery] = useQueryState<string>("language");
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
      setLanguageInQuery(language);
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

  const NotificationsWrapper: FC = () => {
    const { firstUse } = useNotificationsState();
    const [open, setOpen] = useState<boolean>(firstUse);

    return (
      <>
        <NotificationsModal open={open} setOpen={setOpen} />
        <NotificationsGroup />
      </>
    );
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
        <CacheProvider value={emotionCache}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <DataManager>
                <Application />
                <NotificationsWrapper />
              </DataManager>
            </BrowserRouter>
          </QueryClientProvider>
        </CacheProvider>
      </Provider>
    );
  };

  hydrate(<RootComponent />, document.querySelector(".app"));
});

if (module.hot) {
  module.hot.accept();
}
