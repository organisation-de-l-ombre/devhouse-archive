import React from "react";
import { MdSystemUpdate } from "react-icons/md";
import { Action } from "redux";
import { RequestContext, UserAPIApi } from "@developers-house/abdera";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { register } from "./lib/serviceWorker";
import { persistor, store } from "./store/Store";
import { pushNotifications } from "./store/notifications/Actions";
import generateNotificationID from "./lib/generateNotificationID";

const Application = React.lazy(() => import("./application/Application"));

// Service worker initialization
register({
  onUpdate(registration: ServiceWorkerRegistration) {
    store.dispatch(
      (pushNotifications([
        {
          id: generateNotificationID(),
          type: "warning",
          body: "A new update is available on the website.",
          buttons: [
            {
              text: "Update now",
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

const IMRMain = (): React.ReactElement => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Application />
      </PersistGate>
    </Provider>
  );
};

export default IMRMain;
export { DevHouseUserAPIInit };
