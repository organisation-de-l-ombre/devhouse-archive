/*
 * This is the entry point of the react application.
 * In this file, we setup some logic, such as the sentry
 * error reporting & performance monitoring.
 */

import React, {ReactElement} from "react";
import ReactDOM from "react-dom";
import SuspenseLoader from "./components/SuspenseLoader";

const Root = React.lazy(() => import('Root'));

const MainComponent = (): ReactElement => (
    <SuspenseLoader>
        <Root/>
    </SuspenseLoader>
);

/*
 * We mount the react application in the root element of the page.
 */
ReactDOM.render(<MainComponent/>, document.getElementById("root"));
