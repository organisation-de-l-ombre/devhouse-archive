import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useLanguage } from "@hooks/Language";
import { useTheme } from "@hooks/Theme";
import { useNotificationsState } from "@hooks/Notifications";
import themes from "@themes/Themes.module.scss";
import { NotificationsGroup, NotificationsModal } from "@components/ui";
import i18n from "@languages/i18n";
import { Error, ApplicationRouter } from "@components/modules";
import { Helmet } from "react-helmet";
import globalStyles from "@themes/Global.module.scss";

const queryClient: QueryClient = new QueryClient();

const Application = (): React.ReactElement => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { firstUse } = useNotificationsState();
  const [open, setOpen] = React.useState<boolean>(firstUse);

  React.useEffect((): void => {
    document.body.style.overflowY = "auto";
  }, []);

  React.useEffect(() => {
    document.body.className = themes[theme];
  }, [theme]);

  React.useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <ErrorBoundary FallbackComponent={Error}>
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
  );
};

export default Application;
