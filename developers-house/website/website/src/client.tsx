import React, { ReactElement } from "react";
import { hydrate } from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import "./transitions.css";
import "rc-tooltip/assets/bootstrap.css";
import createStore, { RootState } from "@state/redux";
import { DeepPartial } from "@reduxjs/toolkit";
import throttle from "lodash.throttle";
import pick from "lodash.pick";
import { Provider } from "react-redux";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { BrowserRouter } from "react-router-dom";
import SuspenseLoader from "@components/SuspenseLoader/SuspenseLoader";
import { I18nextProvider, useSSR } from "react-i18next";
import Root from "Root";
import { Hydrate } from "react-query/hydration";
import i18n from "./utilities/i18n";

const queryClient = new QueryClient();

const preloadedState =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).PRELOADED_STATE;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (window as any).PRELOADED_STATE;
// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any
const dehydratedState = (window as any).__REACT_QUERY_STATE__;

const save: ("account" | "theme")[] = ["account", "theme"];
const preloaded = preloadedState as DeepPartial<RootState>;

save.forEach((key) => {
  const item = localStorage.getItem(`redux-save/${key}`);
  if (item) {
    try {
      preloaded[key] = JSON.parse(item);
    } catch (e) {
      preloaded[key] = undefined;
    }
  }
});
const store = createStore(preloadedState);

store.subscribe(
  throttle(() => {
    const state = store.getState();
    const obj = pick(state, save);
    Object.keys(obj).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      localStorage.setItem(`redux-save/${key}`, JSON.stringify(obj[key]));
    });
  }, 500)
);

const cache = createCache({
  key: "ssr-render",
});
// TODO: client must implement redux store.
const MainComponent = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSSR((window as any).INSTATE, "en");
  return (
    <SuspenseLoader>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={dehydratedState}>
          <CacheProvider value={cache}>
            <BrowserRouter>
              <Provider store={store}>
                <Root />
              </Provider>
            </BrowserRouter>
          </CacheProvider>
        </Hydrate>
      </QueryClientProvider>
    </SuspenseLoader>
  );
};

hydrate(
  <I18nextProvider i18n={i18n}>
    <MainComponent />
  </I18nextProvider>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept();
}
