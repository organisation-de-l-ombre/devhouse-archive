import React, { FC } from "react";
import ReactDOM from "react-dom";
import { RootSuspense } from "@components/modules";
import {
  FetchParams,
  RequestContext,
  UserAPIApi,
} from "@developers-house/abdera";
import store from "@store/store";
import Application from "@application/Application";
import { Provider } from "react-redux";
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
        <Application />
      </Provider>
    </React.Suspense>
  );
};

ReactDOM.render(<RootComponent />, document.querySelector(".app"));
