/*
 * This component is the Application.
 * It loads the state and Suspense the service worker &
 * the App component.
 */
import React, { ReactElement, StrictMode } from "react";
import { StateWrapper } from "./modules/state/StateWrapper";
import { useServiceWorker } from '@website/app';
import { ErrorBoundary } from "@sentry/react";

const App = React.lazy(() => import('./app/App'));

const ErrorPage = React.lazy(async () => {
    const { ErrorPage } = await import('@website/app');
    return { default: ErrorPage };
});

export default function Root(): ReactElement {
    // Use service worker from utilities.
    useServiceWorker();
    return (
        < ErrorBoundary fallback={< ErrorPage />}>
            <StrictMode>
                <StateWrapper>
                    <App />
                </StateWrapper>
            </StrictMode>
        </ErrorBoundary >
    );
};