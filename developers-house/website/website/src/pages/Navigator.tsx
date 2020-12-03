import React from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import AboutPage from "pages/About/About";
import HomePage from "pages/Home/Home";
import MembersPage from "pages/Members/Members";
import NotFound from "pages/NotFound/NotFound";
import ProjectsPage from "pages/Projects/Projects";
import 'transitions.css';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {RouteComponentProps} from "react-router";
import styled from "styled-components";
import {ErrorBoundary} from "react-error-boundary";
import ErrorPage from "./ErrorPage";
import Analytics from 'react-router-ga';

const Wrapper = styled.div`
    .slide-enter {
        opacity: 0;
    }
    .slide-enter-active {
        opacity: 1;
        transition: opacity 300ms ease-in-out;
    }
    .slide-exit {
        opacity: 0;
    }
    .slide-exit-active {
        opacity: 0;
        transition: opacity 300ms 300ms ease-in-out;
    }
    .ignore-overflow {
        overflow: hidden;
    }
`;

const Navigator = ({location}: RouteComponentProps) => {
    return (
        <Wrapper>
            <TransitionGroup>
                <CSSTransition classNames={'slide'} key={location.pathname} timeout={300}>
                    <ErrorBoundary FallbackComponent={ErrorPage}>
                        <Analytics id="G-G9QKMF6D6K" debug>
                            <Switch>
                                <Route path="/" exact>
                                    <HomePage/>
                                </Route>
                                <Route path="/about" exact>
                                    <AboutPage/>
                                </Route>
                                <Route path="/projects" exact>
                                    <ProjectsPage/>
                                </Route>
                                <Route path="/members" exact>
                                    <MembersPage/>
                                </Route>
                                <Route path="*">
                                    <NotFound/>
                                </Route>
                            </Switch>
                        </Analytics>
                    </ErrorBoundary>
                </CSSTransition>
            </TransitionGroup>
        </Wrapper>);
}

export default withRouter(Navigator);
