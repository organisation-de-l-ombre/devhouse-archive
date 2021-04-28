import React from "react";
import { MdSystemUpdate } from "react-icons/md";
import { Action } from "redux";
import { RequestContext, UserAPIApi } from "@developers-house/abdera";
import { register } from "@lib/serviceWorker";
import generateNotificationID from "@lib/generateNotificationID";
import { store } from "@store/Store";
import { pushNotifications } from "@store/notifications/notificationsData";
import i18n from "@languages/i18n";
import Application from "./application/Application";

// Service worker initialization
register({
  onUpdate(registration: ServiceWorkerRegistration) {
    store.dispatch(
      (pushNotifications([
        {
          id: generateNotificationID(),
          type: "warning",
          body: i18n.t("serviceWorker:updateMessage"),
          buttons: [
            {
              text: i18n.t("serviceWorker:updateButton"),
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
// Component which initializes the entire website with routing
const IMRMain = (): React.ReactElement => {
  React.useEffect((): void => {
    document.body.style.overflowY = "visible";
  }, []);
  return <Application />;
};

export default IMRMain;
export { DevHouseUserAPIInit };
