import React, { FC, lazy, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import useLanguage from "@hooks/useLanguage";
import useTheme from "@hooks/useTheme";
import {
  useNotificationsManager,
  useNotificationsState,
} from "@hooks/useNotifications";
import themes from "@styles/Themes.module.scss";
import { NotificationsGroup } from "@components/ui";
import i18n from "@lib/i18n";
import { ApplicationRouter } from "@components/modules";
import { Helmet } from "react-helmet";
import globalStyles from "@styles/Global.module.scss";
import { I18nextProvider, useTranslation } from "react-i18next";
import generateNotificationID from "@lib/generateNotificationID";
import BodyContext from "@contexts/body";
import classnames from "classnames";
import { useClient } from "@hooks/useInternal";
import { Globals } from "react-spring";
import useReducedMotion from "@hooks/useReducedMotion";

const RootError = lazy(() => import("@components/modules/Error/RootError"));
const NotificationsModal = lazy(
  () =>
    import("@components/ui/Notifications/NotificationsModal/NotificationsModal")
);

const queryClient: QueryClient = new QueryClient();

const Application: FC = () => {
  const { setClientID } = useClient();
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const { language } = useLanguage();
  const { addNotifications } = useNotificationsManager();
  const { t } = useTranslation("components\\ui\\languageModal\\languageModal");
  const prefersReducedMotion = useReducedMotion();
  const [scroll, setScroll] = useState<boolean>(true);
  const { theme, contrastMode } = useTheme();
  const { firstUse } = useNotificationsState();
  const [open, setOpen] = useState<boolean>(firstUse);

  useEffect((): void => {
    setClientID();
    setPageLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    Globals.assign({
      skipAnimation: prefersReducedMotion,
    });
  }, [prefersReducedMotion]);

  useEffect(() => {
    document.body.className = classnames(
      themes[`${theme}${contrastMode ? "-contrast" : ""}`],
      {
        [globalStyles["overflow-hidden"]]: !scroll,
      }
    );
  }, [contrastMode, scroll, theme]);

  return (
    <I18nextProvider i18n={i18n}>
      <ErrorBoundary FallbackComponent={RootError}>
        <BodyContext.Provider value={{ scroll, setScroll }}>
          <Helmet htmlAttributes={{ lang: language }}>
            <title>IMR</title>
          </Helmet>
          <QueryClientProvider client={queryClient}>
            {firstUse && <NotificationsModal open={open} setOpen={setOpen} />}
            <NotificationsGroup />
            <ApplicationRouter />
            <ReactQueryDevtools
              panelProps={{ className: globalStyles["react-query"] }}
            />
          </QueryClientProvider>
        </BodyContext.Provider>
      </ErrorBoundary>
    </I18nextProvider>
  );
};

export default Application;
