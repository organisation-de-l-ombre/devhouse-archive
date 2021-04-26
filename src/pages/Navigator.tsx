import React, { FC, useEffect, Suspense, ReactElement } from "react";
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  withRouter,
} from "react-router-dom";
import "./transitions.css";
import { RouteProps, RouteComponentProps } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import { useSelector } from "react-redux";
import { Loader } from "../components/SuspenseLoader/SuspenseLoader";
import NotFound from "./NotFound/NotFound";
import styles from "./navigator.module.scss";
import { useNotificationsManager } from "../hooks/Notifications/Notifications";

const AboutPage = React.lazy(() => import("./About/About"));
const HomePage = React.lazy(() => import("./Home/Home"));
const ProjectsPage = React.lazy(() => import("./Projects/Projects"));
const ProjectDetailsPage = React.lazy(
  () => import("./ProjectDetails/ProjectDetails")
);
const ErrorPage = React.lazy(() => import("./ErrorPage"));
const Callback = React.lazy(() => import("./Settings/Callback"));
const Settings = React.lazy(() => import("./Settings/Settings"));
const MembersPage = React.lazy(() => import("./Members/Members"));

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

const GA: FC = () => {
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

  return null;
};

const Navigator = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <div className={styles.wrapper}>
        <GA />
        <div className={styles.content}>
          <Suspense fallback={<Loader />}>
            <Switch>
              <Route path="/members" exact component={MembersPage} />
              <Route path="/" exact component={HomePage} />
              <Route path="/about" exact component={AboutPage} />
              <Route path="/projects" exact component={ProjectsPage} />
              <Route
                path="/projects/:id"
                exact
                render={(props: RouteComponentProps): ReactElement => {
                  return <ProjectDetailsPage {...props} />;
                }}
              />
              <Route path="/callback" exact component={Callback} />
              <PrivateRoute path="/settings" component={Settings} />
              <Route path="*" exact component={NotFound} />
            </Switch>
          </Suspense>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default withRouter(Navigator);
