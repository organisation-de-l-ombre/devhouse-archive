/*
 * This component is the Application.
 * It loads the state and Suspense the service worker &
 * the App component.
 */
import React, { ReactElement, Suspense } from "react";
import { ErrorBoundary } from "@sentry/react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "components/ThemeProvider";
import { Menu } from "./components/navbar";
import AboutPage from "./pages/About/About";
import HomePage from "./pages/Home/Home";
import MembersPage from "./pages/Members/Members";
import NotFound from "./pages/NotFound/NotFound";
import ProjectsPage from "./pages/Projects/Projects";
import { Provider } from "react-redux";
import { createState } from "state";
import NotificationsArea from "components/notifications/NotificationsArea";
import { ErrorPage } from "pages/ErrorPage";
import { PersistGate } from "redux-persist/integration/react";
import { register } from 'utilities';
import { pushNotification } from "state/modules/notifications";

const { store, persistor } = createState();

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
        <ErrorBoundary fallback={ErrorPage}>
            <Provider store={store}>
                <PersistGate loading={''} persistor={persistor}>
                    <ThemeProvider>
                        <NotificationsArea />
                        <BrowserRouter>
                            <Menu />
                            <Suspense fallback={""}>
                                <Switch>
                                    <Route path="/" exact>
                                        <HomePage />
                                    </Route>
                                    <Route path="/about" exact>
                                        <AboutPage />
                                    </Route>
                                    <Route path="/projects" exact>
                                        <ProjectsPage />
                                    </Route>
                                    <Route path="/members" exact>
                                        <MembersPage />
                                    </Route>
                                    <Route path="*">
                                        <NotFound />
                                    </Route>
                                </Switch>
                            </Suspense>
                        </BrowserRouter>
                    </ThemeProvider>
                </PersistGate>
            </Provider>
        </ErrorBoundary >
    );
};