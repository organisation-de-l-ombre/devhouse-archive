import React, { FC, useEffect } from "react";
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  withRouter,
} from "react-router-dom";
import "./transitions.css";
import { RouteProps } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { pushNotification } from "../state/modules/notifications";
import SuspenseLoader from "../components/SuspenseLoader";
import NotFound from "./NotFound/NotFound";
import styles from "./navigator.module.scss";
import MembersPage from "./Members/Members";

const AboutPage = React.lazy(() => import("./About/About"));
const HomePage = React.lazy(() => import("./Home/Home"));
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
  const history = useHistory();
  useEffect(() => {
    if (!auth) {
      dispatch(
        pushNotification({
          level: "warning",
          text: "You need to be logged in to view this page.",
          time: 3000,
        })
      );
      history.push("/");
    }
  }, [dispatch, auth, history]);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (auth) {
          return <Component {...props} />;
        }
        return null;
      }}
    />
  );
};

const Navigator = () => {
  const route = useLocation();
  return (
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <TransitionGroup className={styles.wrapper}>
        <CSSTransition
          key={route.pathname.split("/")[1]}
          classNames="fade"
          timeout={500}
        >
          <SuspenseLoader key={route.pathname}>
            <Switch location={route}>
              <Route path="/members" exact component={MembersPage} />
              <Route path="/" exact component={HomePage} />
              <Route path="/about" exact component={AboutPage} />
              <Route path="/projects" exact component={ProjectsPage} />
              <Route path="/callback" exact component={Callback} />
              <PrivateRoute path="/settings" component={Settings} />
              <Route path="*" exact component={NotFound} />
            </Switch>
          </SuspenseLoader>
        </CSSTransition>
      </TransitionGroup>
    </ErrorBoundary>
  );
};

export default withRouter(Navigator);
