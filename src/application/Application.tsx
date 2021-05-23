import React, { FC, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import useLanguage from "@hooks/useLanguage";
import useTheme from "@hooks/useTheme";
import { useNotificationsState } from "@hooks/useNotifications";
import themes from "@styles/Themes.module.scss";
import { NotificationsGroup, NotificationsModal } from "@components/ui";
import i18n from "@languages/i18n";
import { RootError, ApplicationRouter } from "@components/modules";
import { Helmet } from "react-helmet";
import globalStyles from "@styles/Global.module.scss";
import { I18nextProvider } from "react-i18next";

const queryClient: QueryClient = new QueryClient();

const Application: FC = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { firstUse } = useNotificationsState();
  const [open, setOpen] = React.useState<boolean>(firstUse);

  useEffect((): void => {
    document.body.style.overflowY = "auto";
  }, []);

  useEffect(() => {
    document.body.className = themes[theme];
  }, [theme]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <I18nextProvider i18n={i18n}>
      <ErrorBoundary FallbackComponent={RootError}>
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
      </ErrorBoundary>
    </I18nextProvider>
  );
};

export default Application;
