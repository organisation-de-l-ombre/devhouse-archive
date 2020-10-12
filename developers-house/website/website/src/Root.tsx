/*
 * This component is the Application.
 * It loads the state and Suspense the service worker &
 * the App component.
 */
import React, { ReactElement } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ThemeProvider } from "components/ThemeProvider";
import { Provider } from "react-redux";
import { createState } from "state";
import { ErrorPage } from "pages/ErrorPage";
import { PersistGate } from "redux-persist/integration/react";
import { register } from 'utilities';
import { pushNotification } from "state/modules/notifications";

const { store, persistor } = createState();

const Navigator = React.lazy(() => import('pages/Navigator'));
const NotificationArea = React.lazy(() => import("components/notifications/NotificationsArea"));

register({
    onUpdate(registration) {
        store.dispatch(pushNotification({
            level: "information",
            text:
                "A new update is available for the website. Would you like to load this new update ?",
            time: 10000,
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
        }))
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
})

export default function Root(): ReactElement {
    return (
        <ErrorBoundary FallbackComponent={ErrorPage}>
            <Provider store={store}>
                <PersistGate loading={''} persistor={persistor}>
                    <ThemeProvider>
                        <NotificationArea />
                        <Navigator/>
                    </ThemeProvider>
                </PersistGate>
            </Provider>
        </ErrorBoundary >
    );
};