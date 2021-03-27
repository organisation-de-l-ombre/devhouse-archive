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
import { useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import SuspenseLoader from "../components/SuspenseLoader/SuspenseLoader";
import NotFound from "./NotFound/NotFound";
import styles from "./navigator.module.scss";
import { useNotificationsManager } from "../hooks/Notifications/Notifications";

const AboutPage = React.lazy(() => import("./About/About"));
const HomePage = React.lazy(() => import("./Home/Home"));
const ProjectsPage = React.lazy(() => import("./Projects/Projects"));
const ErrorPage = React.lazy(() => import("./ErrorPage"));
const Callback = React.lazy(() => import("./Settings/Callback"));
const Settings = React.lazy(() => import("./Settings/Settings"));
const MembersPage = React.lazy(() => import("./Members/Members"));
const NotImplemented = React.lazy(
  () => import("./NotImplemented/NotImplemented")
);

const PrivateRoute: FC<{ component: FC<unknown> } & RouteProps> = ({
  component: Component,
  ...rest
}) => {
  const auth = useSelector((s) => s.user.loggedIn);
  const history = useHistory();
  const { addNotification } = useNotificationsManager();
  useEffect(() => {
    if (!auth) {
      addNotification({
        level: "warning",
        text: "You need to be logged in to view this page.",
        time: 3000,
      });
      history.push("/");
    }
  }, [addNotification, auth, history]);
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

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gtag("event", "page_view", {
      page_title: route.pathname,
      page_location: route.hash,
      page_path: route.pathname,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      send_to: (window as any).GA_TAG,
    });
  }, [route]);

  return (
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <div className={styles.wrapper}>
        <TransitionGroup className={styles.content}>
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
                <Route path="/contact" component={NotImplemented} />
                <Route path="/join" component={NotImplemented} />
                <Route path="*" exact component={NotFound} />
              </Switch>
            </SuspenseLoader>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </ErrorBoundary>
  );
};

export default withRouter(Navigator);
