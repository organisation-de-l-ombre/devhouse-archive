import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";
import { useLanguage } from "@hooks/Language";
import { useTheme } from "@hooks/Theme";
import { useNotificationsState } from "@hooks/Notifications";
import themes from "@themes/Themes.module.scss";
import { NotificationsGroup, NotificationsModal } from "@components/ui";
import i18n from "@languages/i18n";
import { Error, ApplicationRouter } from "@components/modules";
import { register } from "@lib/serviceWorker";
import { store } from "@store/Store";
import { pushNotifications } from "@store/notifications/notificationsData";
import generateNotificationID from "@lib/generateNotificationID";
import { MdSystemUpdate } from "react-icons/md";
import { Action } from "redux";
import { Helmet } from "react-helmet";

// Service worker initialization
register({
  async onUpdate(registration: ServiceWorkerRegistration): Promise<void> {
    const translations = await import(
      `../../public/locales/${
        store.getState().language.language
      }/serviceWorker.json`
    );

    store.dispatch(
      (pushNotifications([
        {
          id: generateNotificationID(),
          type: "warning",
          body: translations.updateMessage,
          buttons: [
            {
              text: translations.updateButton,
              icon: <MdSystemUpdate />,
              onClick: () => {
                if (registration.waiting) {
                  registration.waiting?.postMessage({ type: "SKIP_WAITING" });
                  window.location.reload();
                }
                return true;
              },
            },
          ],
          time: 10000,
        },
      ]) as unknown) as Action
    );
  },
});

const queryClient: QueryClient = new QueryClient();

const Application = (): React.ReactElement => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { firstUse } = useNotificationsState();
  const [open, setOpen] = React.useState<boolean>(firstUse);

  React.useEffect(() => {
    document.body.className = themes[theme];
  }, [theme]);

  React.useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <ErrorBoundary FallbackComponent={Error}>
      <Helmet>
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
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default Application;
