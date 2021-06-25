import React, { ReactElement } from "react";
import { hydrate } from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import createStore from "@state/redux";
import { Provider } from "react-redux";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { BrowserRouter } from "react-router-dom";
import { Hydrate } from "react-query/hydration";
import loadable from "@loadable/component";

const queryClient = new QueryClient();
const Root = loadable(() => import("./Root"));
const preloadedState =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).PRELOADED_STATE;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (window as any).PRELOADED_STATE;
// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any
const dehydratedState = (window as any).__REACT_QUERY_STATE__;

const store = createStore(preloadedState);

const cache = createCache({
  key: "ssr-render",
});

// TODO: client must implement redux store.
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
