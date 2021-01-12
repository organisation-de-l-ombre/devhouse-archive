/*
 * This is the entry point of the react application.
 * In this file, we setup some logic, such as the sentry
 * error reporting & performance monitoring.
 */

import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import SuspenseLoader from "./components/SuspenseLoader/SuspenseLoader";
import "./transitions.css";
import { RequestParams } from "./constants";
import Root from "./Root";

const queryClient = new QueryClient();

if (RequestParams.url) {
  const url = new URL(window.location.toString());
  url.searchParams.delete("url");
  url.pathname = decodeURIComponent(RequestParams.url as string).replace(
    "web+devhouse:",
    ""
  );
  window.location.replace(url.toString());
}

const MainComponent = (): ReactElement => (
  <SuspenseLoader>
    <QueryClientProvider client={queryClient}>
      <Root />
    </QueryClientProvider>
  </SuspenseLoader>
);

/*
 * We mount the react application in the root element of the page.
 */
ReactDOM.render(<MainComponent />, document.getElementById("root"));
