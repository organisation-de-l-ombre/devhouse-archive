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

const Root = loadable(() => import("Root"));

const queryClient = new QueryClient();
const preloadedState = window.PRELOADED_STATE;
const dehydratedState = window.REACT_QUERY;

const store = createStore(preloadedState);

const cache = createCache({
  key: "ssr-render",
});

const MainComponent = (): ReactElement => {
  return (
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
  );
};

hydrate(<MainComponent />, document.getElementById("root"));

if (module.hot) {
  module.hot.accept();
}
