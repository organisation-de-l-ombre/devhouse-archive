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
import loadable from "@loadable/component";
import NotFound from "./NotFound/NotFound";
import styles from "./navigator.module.scss";
import { useNotificationsManager } from "../hooks/useNotifications";
import { useHasUser } from "../state/slices/account/hooks";

const HomePage = loadable(() => import("./Home/Home"));
const AboutPage = loadable(() => import("./About/About"));
const ProjectsPage = loadable(() => import("./Projects/Projects"));
const ProjectDetailsPage = loadable(
  () => import("./ProjectDetails/ProjectDetails")
);
const Callback = loadable(() => import("./Settings/Callback"));
const Settings = loadable(() => import("./Settings/Settings"));
const MembersPage = loadable(() => import("./Members/Members"));

const PrivateRoute: FC<RouteProps> = ({ ...rest }) => {
  const auth = useHasUser();
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
  if (auth) {
    return <Route {...rest} />;
  }
  return null;
};

const GA: FC = () => {
  const route = useLocation();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).gtag) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag("event", "page_view", {
        page_title: route.pathname,
        page_location: route.hash,
        page_path: route.pathname,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        send_to: (window as any).GA_TAG,
      });
    }
  }, [route]);

  return null;
};

const Scroller: FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Navigator = () => {
  return (
    <div className={styles.wrapper}>
      <GA />
      <Scroller />
      <div className={styles.content}>
        <Switch>
          <Route path="/members" exact component={MembersPage} />
          <Route path="/" exact component={HomePage} />
          <Route path="/about" exact component={AboutPage} />
          <Route path="/projects" exact component={ProjectsPage} />
          <Route path="/projects/:id" exact component={ProjectDetailsPage} />
          <Route path="/callback" exact component={Callback} />
          <PrivateRoute path="/settings" component={Settings} />
          <Route path="*" exact component={NotFound} />
        </Switch>
      </div>
    </div>
  );
};

export default withRouter(Navigator);
