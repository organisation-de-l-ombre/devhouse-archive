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

const Wrapper = styled.div`
    .slide-enter {
        transform: translateX(100%);
    }
    .slide-enter-active {
        transform: translateX(0%);
        transition: transform 300ms ease-in-out;
    }
    .slide-exit {
        transform: translateX(0%);
    }
    .slide-exit-active {
        transform: translateX(-100%);
        transition: transform 300ms ease-in-out;
    }
`;

const Navigator = ({location}: RouteComponentProps) => {
    return (
        <Wrapper>
            <TransitionGroup>
                <CSSTransition classNames={'slide'} key={location.pathname} timeout={300}>
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
                </CSSTransition>
            </TransitionGroup>
        </Wrapper>);
}

export default withRouter(Navigator);
