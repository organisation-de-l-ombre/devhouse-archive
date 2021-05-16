/*
 * This component is the Application.
 * It loads the state and Suspense the service worker &
 * the App component.
 */
import React, { ReactElement } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { RequestContext, UserAPIApi } from "@developers-house/abdera";
import ThemeProvider from "./components/ThemeProvider/ThemeProvider";
import Navigator from "./pages/Navigator";
import { register } from "./utilities";
import { Menu } from "./components/navbar";
import { Logger } from "./utilities/logger";
import NotificationsArea from "./components/notifications/NotificationsArea";
import { store } from "./state";
import { addNotification } from "./state/slices/notifications/notifications";

const logger = new Logger("Root");
logger.info("~ Loading Developer's House frontend.");

const UserAPI = new UserAPIApi().withPreMiddleware(
  async (context: RequestContext) => {
    const token = store.getState()?.account?.user?.token;

    context.init.headers = {
      Authorization: `Bearer ${token}`,
    };

    return { url: context.url, init: context.init };
  }
);

const ErrorPage = React.lazy(() => import("pages/ErrorPage"));

register({
  onUpdate(registration) {
    logger.info("Update callback triggered.");
    store.dispatch(
      addNotification({
        level: "information",
        text:
          "A new update is available for the website. Would you like to load this new update ?",
        time: -1,
        buttons: [
          {
            text: "Yes",
            click: (): boolean => {
              registration.waiting?.postMessage({ type: "SKIP_WAITING" });
              if (registration.waiting?.state !== "activated") {
                registration.waiting?.addEventListener("statechange", () => {
                  if (registration?.waiting?.state === "activated") {
                    window.location.reload();
                  }
                });
              }
              return true;
            },
          },
        ],
      })
    );
  },
  onSuccess() {
    logger.info("service worker installed.");
    store.dispatch(
      addNotification({
        level: "information",
        text: "This website is now available for offline use.",
        time: 5000,
        buttons: [],
      })
    );
  },
});

export default function Root(): ReactElement {
  return (
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <Provider store={store}>
        <I18nextProvider i18n={i18next}>
          <ThemeProvider>
            <NotificationsArea />
            <BrowserRouter>
              <Menu />
              <Navigator />
            </BrowserRouter>
          </ThemeProvider>
        </I18nextProvider>
      </Provider>
    </ErrorBoundary>
  );
}
export { UserAPI };
