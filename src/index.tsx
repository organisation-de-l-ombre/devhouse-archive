import "./utilities/i18n";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import SuspenseLoader from "./components/SuspenseLoader/SuspenseLoader";
import "./transitions.css";
import "rc-tooltip/assets/bootstrap.css";

const queryClient = new QueryClient();

const Root = React.lazy(() => import("./Root"));

const MainComponent = (): ReactElement => (
  <SuspenseLoader>
    <QueryClientProvider client={queryClient}>
      <Root />
    </QueryClientProvider>
  </SuspenseLoader>
);

ReactDOM.render(<MainComponent />, document.getElementById("root"));
