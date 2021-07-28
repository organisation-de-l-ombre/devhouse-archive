import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { register } from "@lib/serviceWorker";
import Application from "@application/Application";
import { decode as cborDecode, encode as cborEncode } from "cbor-js";
import {
  decode as base64Decode,
  encode as base64Encode,
} from "base64-arraybuffer";
import { createStore, persistBlacklist } from "@store/store";
import { BrowserRouter, Route } from "react-router-dom";
import loadable, { loadableReady } from "@loadable/component";
import { hydrate } from "react-dom";
import { GlobalState } from "@store/types";
import { Provider, useDispatch, useSelector } from "react-redux";
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
import { QueryClient, QueryClientProvider } from "react-query";
import i18n, { Resource } from "i18next";
import { detectMobileDevice, supportedLanguages } from "@lib/utils";
import HTTPBackend from "i18next-http-backend";
import useTheme from "@hooks/useTheme";
import BodyContext from "@contexts/body";
import { Helmet } from "react-helmet";
import classnames from "classnames";
import themes from "@styles/Themes.module.scss";
import globalStyles from "@styles/Global.module.scss";
import "@styles/Root.scss";
import { QueryParamProvider } from "use-query-params";
import { useClient } from "@hooks/useProperties";
import { createUser, setTokens } from "@store/account/actions";
import { getUser, refresh } from "@lib/oauth";

register();

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
    DATA_STORE: string;
    LANGUAGE_STORE: string;
    LANGUAGE: string;
    LANGUAGE_IN_QUERY: string;
    THEME_DETECTION: boolean;
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
    base64Decode(window.DATA_STORE)
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

        Cookies.set(`imr-data-${key}`, value, {
          expires: 365,
        });
      }
    }, 500)
  );

  if (window.LANGUAGE_IN_QUERY) {
    const { language }: GlobalState = store.getState();

    Cookies.set("imr-data-language", base64Encode(cborEncode(language)));
  }

  const DataManager: FC = ({ children }) => {
    const [pageLoaded, setPageLoaded] = useState<boolean>(false);
    const { addNotifications } = useNotificationsManager();
    const { t } = useTranslation(
      "components\\ui\\languageModal\\languageModal"
    );
    const language = useLanguage();
    const [scroll, setScroll] = useState<boolean>(true);
    const { theme, contrastMode, switchTheme } = useTheme();
    const isMobileDevice: boolean = useMemo(
      (): boolean => detectMobileDevice(),
      []
    );

    useEffect((): void => {
      if (window.THEME_DETECTION) {
        switchTheme(
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
        );
      }

      setPageLoaded(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const tokens = useSelector((state) => state.account.tokens);
    const clientId = useClient();
    const dispatch = useDispatch();
    const refreshTokens = useCallback(async () => {
      if (tokens && clientId) {
        if (tokens.expire < Date.now() / 1000) {
          // we need to refresh the token
          const newTokens = await refresh(clientId, tokens.refreshToken);
          const user = getUser(newTokens.idToken);
          dispatch(createUser(user));
          dispatch(
            setTokens({
              accessToken: newTokens.accessToken,
              refreshToken: newTokens.refreshToken,
              expire: Date.now() / 1000 + newTokens.expire,
            })
          );
        } else {
          const seconds = tokens.expire - Date.now() / 1000;
          console.log("refresh in ", seconds);
          setTimeout(refreshTokens, seconds * 1000);
        }
      }
    }, [clientId, tokens, dispatch]);

    useEffect(() => {
      refreshTokens();
    }, [refreshTokens]);

    useEffect((): void => {
      i18n.changeLanguage(language).then((): void => {
        if (process.env.NODE_ENV === "production") {
          window.scrollTo({ top: 0 });
        }

        if (pageLoaded) {
          addNotifications([
            {
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
                [globalStyles.desktop]: !isMobileDevice,
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

  const Root: FC = () => {
    const languageStore: Resource = cborDecode(
      base64Decode(window.LANGUAGE_STORE)
    );

    useSSR(languageStore, window.LANGUAGE);

    const emotionCache: EmotionCache = createCache({
      key: "imr-frontend",
    });
    const queryClient: QueryClient = new QueryClient();

    return (
      <Provider store={store}>
        <CacheProvider value={emotionCache}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <QueryParamProvider ReactRouterRoute={Route}>
                <DataManager>
                  <Application />
                  <NotificationsWrapper />
                </DataManager>
              </QueryParamProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </CacheProvider>
      </Provider>
    );
  };

  hydrate(<Root />, document.querySelector(".app"));
});

if (module.hot) {
  module.hot.accept();
}
