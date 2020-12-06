/*
 * This component is the Application.
 * It loads the state and Suspense the service worker &
 * the App component.
 */
import React, {ReactElement} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {Provider} from "react-redux";
import {createState} from "state";
import {PersistGate} from "redux-persist/integration/react";
import {register} from 'utilities';
import {pushNotification} from "state/modules/notifications";
import {Menu} from "./components/navbar";
import {BrowserRouter} from "react-router-dom";
import {Loader} from "./components/SuspenseLoader";
const {store, persistor} = createState();

const ThemeProvider = React.lazy(() => import('components/ThemeProvider'))
const Navigator = React.lazy(() => import('pages/Navigator'));
const NotificationArea = React.lazy(() => import('components/notifications/NotificationsArea'));
const ErrorPage = React.lazy(() => import('pages/ErrorPage'));

register({
    onUpdate(registration) {
        store.dispatch(pushNotification({
            level: "information",
            text:
                "A new update is available for the website. Would you like to load this new update ?",
            time: -1,
            buttons: [
                {
                    text: "Yes",
                    click: (): boolean => {
                        registration.waiting?.postMessage({type: "SKIP_WAITING"});
                        window.location.reload();
                        return true;
                    }
                }
            ]
        }));
    },
    onSuccess() {
        store.dispatch(pushNotification({
            level: "information",
            text:
                "This website is now available for offline use.",
            time: 5000,
            buttons: []
        }));
    }
});

export default function Root(): ReactElement {
    return (
        <ErrorBoundary FallbackComponent={ErrorPage}>
            <Provider store={store}>
                <PersistGate loading={<Loader/>} persistor={persistor}>
                    <ThemeProvider>
                        <NotificationArea/>
                        <BrowserRouter>
                            <Menu/>
                            <Navigator/>
                        </BrowserRouter>
                    </ThemeProvider>
                </PersistGate>
            </Provider>
        </ErrorBoundary>
    );
};
