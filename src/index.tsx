// Please keep @sentry's import before the react import
import { init } from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom";
import { PersistGate } from "redux-persist/integration/react";
import { RequestContext, UserAPIApi } from "@developers-house/abdera";
import { MdSystemUpdate } from "react-icons/md";
import { Action } from "redux";
import App from "./application/App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import i18n from "./languages/i18n";
import Suspense from "./components/modules/Suspense/Suspense";
import { store, persistor } from "./store/Store";
import { register } from "./lib/serviceWorker";
import { pushNotifications } from "./store/notifications/Actions";
import generateNotificationID from "./lib/generateNotificationID";

// Sentry initialization
init({
  dsn:
    "https://392ce00de8f64a408fcbf26155ba2e21@o487534.ingest.sentry.io/5595403",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1,
  release: process.env.CI_COMMIT_SHORT_SHA ?? "No Commit Short SHA",
});

// Developer's House API initialization for users and authorizations
const DevHouseUserAPIInit = new UserAPIApi().withPreMiddleware(
  async (context: RequestContext) => {
    const token: string = store.getState().user.user?.token || "";

    context.init.headers = {
      Authorization: `Bearer ${token}`,
    };

    return { url: context.url, init: context.init };
  }
);

// Creation of the app div which contains the website
const app = document.createElement("div");

app.id = "app";
document.body.appendChild(app);

// Service worker initialization
register({
  onSuccess() {
    store.dispatch(
      (pushNotifications([
        {
          id: generateNotificationID(),
          type: "info",
          body: i18n.t("serviceWorker:installed"),
          time: 5000,
        },
      ]) as unknown) as Action
    );
  },
  onUpdate(registration: ServiceWorkerRegistration) {
    store.dispatch(
      (pushNotifications([
        {
          id: generateNotificationID(),
          type: "warning",
          body: i18n.t("serviceWorker:waitingUpdate.title"),
          buttons: [
            {
              text: i18n.t("serviceWorker:waitingUpdate.button"),
              icon: <MdSystemUpdate />,
              onClick: () => {
                if (registration.waiting) {
                  registration.waiting.postMessage({ type: "SKIP_WAITING" });
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

const RootComponent = (): React.ReactElement => {
  return (
    <React.StrictMode>
      <React.Suspense fallback={<Suspense />}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </React.Suspense>
    </React.StrictMode>
  );
};

ReactDOM.render(<RootComponent />, app);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export { DevHouseUserAPIInit, RootComponent };
