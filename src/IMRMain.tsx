import React from "react";
import { RequestContext, UserAPIApi } from "@developers-house/abdera";
import { persistedStore, store } from "@store/Store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { I18nextProvider } from "react-i18next";
import i18n from "@languages/i18n";
import Application from "./application/Application";

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

  return (
    <Provider store={store}>
      <PersistGate persistor={persistedStore}>
        <I18nextProvider i18n={i18n}>
          <Application />
        </I18nextProvider>
      </PersistGate>
    </Provider>
  );
};

export default IMRMain;
export { DevHouseUserAPIInit };
