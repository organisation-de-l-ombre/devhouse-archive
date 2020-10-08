/*
 * This component is the Application.
 * It loads the state and Suspense the service worker &
 * the App component.
 */
import React, {ReactElement, StrictMode} from "react";
import {StateWrapper} from "./modules/state/StateWrapper";
import { useServiceWorker } from '@website/app';


const App = React.lazy(() => import('./app/App'));

export default function Root (): ReactElement {
    // Use service worker from utilities.
    useServiceWorker();
    return (
        <StrictMode>
            <StateWrapper>
                <App/>
            </StateWrapper>
        </StrictMode>
    );
};