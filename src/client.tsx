import React, { ReactElement } from "react";
import { hydrate } from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import createStore from "@state/redux";
import { Provider } from "react-redux";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { BrowserRouter } from "react-router-dom";
import { Hydrate } from "react-query/hydration";
import "rc-tooltip/assets/bootstrap.css";
import "./transitions.css";
import loadable from "@loadable/component";
import SuspenseLoader from "@components/SuspenseLoader/SuspenseLoader";
import { register } from "@utilities/serviceWorker";
import { addNotification } from "@state/slices/notifications/notifications";
import { SSRContext } from "@components/SSRContext/SSRContext";

const Root = loadable(() => import("Root"));

const queryClient = new QueryClient();
const preloadedState = window.PRELOADED_STATE;
const dehydratedState = window.REACT_QUERY;

const store = createStore(preloadedState);
register({
  onUpdate() {},
  onSuccess() {
    store.dispatch(
      addNotification({
        text: "Application available for offline use.",
        time: 2500,
        level: "information",
      })
    );
  },
});
const cache = createCache({
  key: "ssr-render",
});

const MainComponent = (): ReactElement => {
  return (
    <SSRContext.Provider value={null}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={dehydratedState}>
          <CacheProvider value={cache}>
            <BrowserRouter>
              <Provider store={store}>
                <SuspenseLoader>
                  <Root />
                </SuspenseLoader>
              </Provider>
            </BrowserRouter>
          </CacheProvider>
        </Hydrate>
      </QueryClientProvider>
    </SSRContext.Provider>
  );
};

hydrate(<MainComponent />, document.getElementById("root"));

if (module.hot) {
  module.hot.accept();
}
