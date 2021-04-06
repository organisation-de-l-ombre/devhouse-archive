import React from "react";
import { I18nextProvider } from "react-i18next";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";
import i18n from "../languages/i18n";
import themes from "../themes/Themes.module.scss";
import useTheme from "../hooks/Theme/Theme";
import NotificationsModal from "../components/ui/Notifications/NotificationsModal/NotificationsModal";
import NotificationsGroup from "../components/ui/Notifications/NotificationsGroup/NotificationsGroup";
import useLanguage from "../hooks/Language/Language";
import { useNotificationsState } from "../hooks/Notifications/Notifications";
import Error from "../components/modules/Error/Error";
import ApplicationRouter from "../components/modules/ApplicationRouter/ApplicationRouter";

const queryClient: QueryClient = new QueryClient();

const Application = (): React.ReactElement => {
  const { theme } = useTheme();
  const { firstUse } = useNotificationsState();
  const { language } = useLanguage();
  const [
    notificationsWindowOpen,
    setNotificationsWindowOpen,
  ] = React.useState<boolean>(firstUse);

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
          <NotificationsModal
            open={notificationsWindowOpen}
            setOpen={setNotificationsWindowOpen}
          />
          <NotificationsGroup />
          <ApplicationRouter />
        </QueryClientProvider>
      </ErrorBoundary>
    </I18nextProvider>
  );
};

export default Application;
