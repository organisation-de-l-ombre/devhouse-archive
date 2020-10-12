import React, { Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Menu } from "components/navbar";
import AboutPage from "pages/About/About";
import HomePage from "pages/Home/Home";
import MembersPage from "pages/Members/Members";
import NotFound from "pages/NotFound/NotFound";
import ProjectsPage from "pages/Projects/Projects";
import 'transitions.css';

const Navigator = () => {
    return (<BrowserRouter>
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
    </BrowserRouter>)
}

export default Navigator;