import React, { FC, Suspense } from "react";
import ReactDOM from "react-dom";
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
    <Suspense fallback={null}>
      <Provider store={store}>
        <Application />
      </Provider>
    </Suspense>
  );
};

ReactDOM.render(<RootComponent />, document.querySelector(".app"));
