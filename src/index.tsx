import React from "react";
import ReactDOM from "react-dom";
import { RootSuspense } from "@components/modules";
import {
  FetchParams,
  RequestContext,
  UserAPIApi,
} from "@developers-house/abdera";
import { store } from "@store/Store";
import Application from "@application/Application";
import { Provider } from "react-redux";

export const DevHouseUserAPIInit = new UserAPIApi().withPreMiddleware(
  async (context: RequestContext): Promise<void | FetchParams> => {
    const token: string = store.getState().user.user?.token || "";

    context.init.headers = {
      Authorization: `Bearer ${token}`,
    };

    return { url: context.url, init: context.init };
  }
);

const RootComponent = (): React.ReactElement => {
  return (
    <React.Suspense fallback={<RootSuspense />}>
      <Provider store={store}>
        <Application />
      </Provider>
    </React.Suspense>
  );
};

const app = document.createElement("div");
app.className = "app";
document.body.appendChild(app);

ReactDOM.render(<RootComponent />, app);
