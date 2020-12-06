import React, {FC, useCallback} from 'react';
import {Route, Switch, withRouter, useHistory} from 'react-router-dom';
import 'transitions.css';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {RouteComponentProps, RouteProps} from "react-router";
import styled from "styled-components";
import {ErrorBoundary} from "react-error-boundary";
import {useDispatch, useSelector} from "react-redux";
import {pushNotification} from "../state/modules/notifications";
import SuspenseLoader from "../components/SuspenseLoader";
import NotFound from './NotFound/NotFound';

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



const AboutPage = React.lazy(() => import('./About/About')),
    HomePage = React.lazy(() => import('./Home/Home')),
    MembersPage = React.lazy(() => import('./Members/Members')),
    ProjectsPage = React.lazy(() => import('./Projects/Projects')),
    ErrorPage = React.lazy(() => import('./ErrorPage')),
    Callback = React.lazy(() => import('./Settings/Callback')),
    Settings = React.lazy(() => import('./Settings/Settings'));



const PrivateRoute: FC<{ component: FC<any> } & RouteProps> = ({ component: Component, ...rest }) => {
    const auth = useSelector((s) => s.user.loggedIn);
    const dispatch = useDispatch();
    const displayNotification = useCallback(() => {
        dispatch(pushNotification({
            level: "warning", text: "You need to be logged in to view this page.", time: 3000

        }));
    }, [dispatch]);
    const history = useHistory();
    return <Route {...rest} render={(props) => {
        if (!auth) {
            history.goBack();
            displayNotification();
            return <></>;
        }
        return <Component {...props} />;
    }} />
};


const Navigator = ({location}: RouteComponentProps) => {
    return (
        <Wrapper>
            <TransitionGroup>
                <CSSTransition classNames={'slide'} key={location.pathname} timeout={300}>
                    <ErrorBoundary FallbackComponent={ErrorPage}>
                        <Switch>
                            <SuspenseLoader>
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
                                <Route path="/callback" exact>
                                    <Callback/>
                                </Route>
                                <PrivateRoute path="/settings" component={Settings} exact />
                                <Route path="*">
                                    <NotFound/>
                                </Route>
                            </SuspenseLoader>
                        </Switch>
                    </ErrorBoundary>
                </CSSTransition>
            </TransitionGroup>
        </Wrapper>);
}

export default withRouter(Navigator);
