import React, { FC, useEffect, useState } from "react";
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
import { NotificationsGroup, NotificationsModal } from "@components/ui";
import i18n from "@languages/i18n";
import { RootError, ApplicationRouter } from "@components/modules";
import { Helmet } from "react-helmet";
import globalStyles from "@styles/Global.module.scss";
import { I18nextProvider, useTranslation } from "react-i18next";
import generateNotificationID from "@lib/generateNotificationID";
import BodyContext from "@contexts/body";
import classnames from "classnames";

const queryClient: QueryClient = new QueryClient();

const Application: FC = () => {
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const { language } = useLanguage();
  const { addNotifications } = useNotificationsManager();
  const { t } = useTranslation("components\\ui\\languageModal\\languageModal");
  const [scroll, setScroll] = useState<boolean>(true);
  const { theme } = useTheme();
  const { firstUse } = useNotificationsState();
  const [open, setOpen] = useState<boolean>(firstUse);

  useEffect((): void => {
    setPageLoaded(true);
  }, []);

  useEffect(() => {
    i18n.changeLanguage(language).then((): void => {
      if (pageLoaded) {
        window.scrollTo({ top: 0 });

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
    document.body.className = classnames(themes[theme], {
      [globalStyles["overflow-hidden"]]: !scroll,
    });
  }, [scroll, theme]);

  return (
    <I18nextProvider i18n={i18n}>
      <ErrorBoundary FallbackComponent={RootError}>
        <BodyContext.Provider value={{ scroll, setScroll }}>
          <Helmet htmlAttributes={{ lang: language }}>
            <title>IMR</title>
          </Helmet>
          <QueryClientProvider client={queryClient}>
            {firstUse ? (
              <NotificationsModal open={open} setOpen={setOpen} />
            ) : (
              <></>
            )}
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
