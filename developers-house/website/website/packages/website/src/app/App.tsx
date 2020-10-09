import React, { lazy, ReactElement, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NotificationsDisplayed from "../components/notifications/NotificationsArea";
import { useSelector } from "react-redux";
import "normalize.css";
import { RootState } from "../modules/state/state/state";
import { Menu } from "../components/navbar";
import { ThemeProvider } from "@website/app";
import { useSentry } from "./useSentry";

const HomePage = lazy(() => import("./pages/Home/Home"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const AboutPage = lazy(() => import("./pages/About/About"));
const ProjectsPage = lazy(() => import("./pages/Projects/Projects"));
const MembersPage = lazy(() => import("./pages/Members/Members"));


export default function App(): ReactElement {
    const theme = useSelector<RootState, 'light' | 'dark'>((store) => store.theme.theme as 'light' | 'dark');
    useSentry();
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Menu />
                <NotificationsDisplayed />
                <div>
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
                </div>
            </Router>
        </ThemeProvider>
    );
}
