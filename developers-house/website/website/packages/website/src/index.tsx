/*
 * This is the entry point of the react application.
 * In this file, we setup some logic, such as the sentry
 * error reporting & performance monitoring.
 */

import React, {ReactElement, Suspense} from "react";
import ReactDOM from "react-dom";
import {ErrorBoundary, init} from "@sentry/react";
// Start the tracing.
init({dsn: "https://27e391d3fdac4bf8aa1b860a64b13b26@o375749.ingest.sentry.io/5389514"});


/*
 * We use React.lazy to delay the main component loading.
 */
const Root = React.lazy(() => import('./Root'));

const ErrorPage = React.lazy(async () => {
    const { ErrorPage } = await import('@website/app');
    return { default: ErrorPage };
});

const MainComponent = (): ReactElement => (
    <Suspense fallback={'Loading website.'}>
        { /* Catch the errors from the react application! */}
        <ErrorBoundary fallback={<ErrorPage/>}>
            <Root/>
        </ErrorBoundary>
    </Suspense>
);

/*
 * We mount the react application in the root element of the page.
 */
ReactDOM.render(<MainComponent/>, document.getElementById("root"));
