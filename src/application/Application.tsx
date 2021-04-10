import React from "react";
import { I18nextProvider } from "react-i18next";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";
import { useLanguage } from "@hooks/Language";
import { useTheme } from "@hooks/Theme";
import { useNotificationsState } from "@hooks/Notifications";
import themes from "@themes/Themes.module.scss";
import { NotificationsGroup, NotificationsModal } from "@components/ui";
import i18n from "@languages/i18n";
import { Error, ApplicationRouter } from "@components/modules";

const queryClient: QueryClient = new QueryClient();

const Application = (): React.ReactElement => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { firstUse } = useNotificationsState();
  const [open, setOpen] = React.useState<boolean>(firstUse);

  React.useEffect(() => {
    const app = document.querySelector("#app");

    if (app) {
      app.className = themes[theme];
    }
  }, [theme]);

  React.useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <I18nextProvider i18n={i18n}>
      <ErrorBoundary FallbackComponent={Error}>
        <QueryClientProvider client={queryClient}>
          {firstUse ? (
            <NotificationsModal open={open} setOpen={setOpen} />
          ) : (
            <></>
          )}
          <NotificationsGroup />
          <ApplicationRouter />
        </QueryClientProvider>
      </ErrorBoundary>
    </I18nextProvider>
  );
};

export default Application;
