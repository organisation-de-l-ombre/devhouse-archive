import React, { FC, useCallback } from "react";
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  withRouter,
} from "react-router-dom";
import "transitions.css";
import { RouteProps } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { pushNotification } from "../state/modules/notifications";
import SuspenseLoader from "../components/SuspenseLoader";
import NotFound from "./NotFound/NotFound";
import styles from "./navigator.module.scss";

const AboutPage = React.lazy(() => import("./About/About"));
const HomePage = React.lazy(() => import("./Home/Home"));
const MembersPage = React.lazy(() => import("./Members/Members"));
const ProjectsPage = React.lazy(() => import("./Projects/Projects"));
const ErrorPage = React.lazy(() => import("./ErrorPage"));
const Callback = React.lazy(() => import("./Settings/Callback"));
const Settings = React.lazy(() => import("./Settings/Settings"));

const PrivateRoute: FC<{ component: FC<unknown> } & RouteProps> = ({
  component: Component,
  ...rest
}) => {
  const auth = useSelector((s) => s.user.loggedIn);
  const dispatch = useDispatch();
  const displayNotification = useCallback(() => {
    dispatch(
      pushNotification({
        level: "warning",
        text: "You need to be logged in to view this page.",
        time: 3000,
      })
    );
  }, [dispatch]);
  const history = useHistory();
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!auth) {
          history.push("/");
          displayNotification();
          return <></>;
        }
        return <Component {...props} />;
      }}
    />
  );
};

const Navigator = () => {
  const route = useLocation();
  return (
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <SuspenseLoader>
        <TransitionGroup className={styles.wrapper}>
          <CSSTransition key={route.key} classNames="slide" timeout={300}>
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
              <Route path="/callback" exact>
                <Callback />
              </Route>
              <PrivateRoute path="/settings" component={Settings} />
              <Route path="*" exact>
                <NotFound />
              </Route>
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </SuspenseLoader>
    </ErrorBoundary>
  );
};

export default withRouter(Navigator);
