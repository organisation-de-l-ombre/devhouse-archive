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

const Root = React.lazy(() => import("Root"));
const queryClient = new QueryClient();

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
