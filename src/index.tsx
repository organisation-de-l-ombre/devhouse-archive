import React, { FC } from "react";
import ReactDOM from "react-dom";
import { RootSuspense } from "@components/modules";
import {
  FetchParams,
  RequestContext,
  UserAPIApi,
} from "@developers-house/abdera";
import { persistedStore, store } from "@store/Store";
import Application from "@application/Application";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { register } from "@lib/serviceWorker";

register();

export const DevHouseUserAPIInit = new UserAPIApi().withPreMiddleware(
  async (context: RequestContext): Promise<void | FetchParams> => {
    const token: string = store.getState().account.user?.token || "";

    context.init.headers = {
      Authorization: `Bearer ${token}`,
    };

    return { url: context.url, init: context.init };
  }
);

const RootComponent: FC = () => {
  return (
    <React.Suspense fallback={<RootSuspense />}>
      <Provider store={store}>
        <PersistGate persistor={persistedStore}>
          <Application />
        </PersistGate>
      </Provider>
    </React.Suspense>
  );
};

const app: HTMLDivElement = document.createElement("div");
app.className = "app";
document.body.appendChild(app);

ReactDOM.render(<RootComponent />, app);
