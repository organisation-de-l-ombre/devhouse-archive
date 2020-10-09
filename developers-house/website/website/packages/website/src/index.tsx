/*
 * This is the entry point of the react application.
 * In this file, we setup some logic, such as the sentry
 * error reporting & performance monitoring.
 */

import React, {ReactElement, Suspense} from "react";
import ReactDOM from "react-dom";
// Start the tracing.


/*
 * We use React.lazy to delay the main component loading.
 */
const Root = React.lazy(() => import('./Root'));

const MainComponent = (): ReactElement => (
    <Suspense fallback={'Loading website.'}>
        <Root></Root>
    </Suspense>
);

/*
 * We mount the react application in the root element of the page.
 */
ReactDOM.render(<MainComponent/>, document.getElementById("root"));
