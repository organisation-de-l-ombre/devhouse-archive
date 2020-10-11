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

const { store, persistor } = createState();

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