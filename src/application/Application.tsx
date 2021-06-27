import React, { FC, ReactElement, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import useLanguage from "@hooks/useLanguage";
import { Helmet } from "react-helmet";
import loadable from "@loadable/component";
import { Route, RouteComponentProps, Switch } from "react-router";
import { useNotificationsState } from "@hooks/useNotifications";

const RootError = loadable(() => import("@components/modules/Error/RootError"));
const Navbar = loadable(() => import("@components/modules/Navbar/Navbar"));
const Home = loadable(() => import("@application/Home/Home"));
const Account = loadable(() => import("@application/Account/AccountRoot"));
const Callback = loadable(() => import("@application/Callback/Callback"));
const Login = loadable(() => import("@application/Login/Login"));
const MovieTitle = loadable(() => import("@application/MovieTitle/MovieRoot"));
const Search = loadable(() => import("@application/Search/Search"));
const InternalWiki = loadable(
  () => import("@application/Wiki/Internal/InternalRoot")
);
const NotFound = loadable(
  () => import("@components/modules/NotFound/NotFound")
);
const NotificationsModal = loadable(
  () =>
    import("@components/ui/Notifications/NotificationsModal/NotificationsModal")
);
const NotificationsGroup = loadable(
  () =>
    import("@components/ui/Notifications/NotificationsGroup/NotificationsGroup")
);

const Application: FC = () => {
  const { language } = useLanguage();
  const { firstUse } = useNotificationsState();
  const [open, setOpen] = useState<boolean>(firstUse);

  return (
    <ErrorBoundary FallbackComponent={RootError}>
      <Helmet htmlAttributes={{ lang: language }}>
        <title>IMR</title>
      </Helmet>

      <Navbar />

      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/account" component={Account} />
        <Route path="/callback" exact component={Callback} />
        <Route path="/auth/login" exact component={Login} />
        <Route path="/movies" exact />
        <Route path="/series" exact />
        <Route
          path="/movies/title/:title"
          render={(props: RouteComponentProps): ReactElement => {
            return <MovieTitle {...props} />;
          }}
        />
        <Route path="/search" exact component={Search} />
        <Route
          path="/wiki/internal/:section"
          render={(props: RouteComponentProps): ReactElement => {
            return <InternalWiki {...props} />;
          }}
        />
        <Route path="*" component={NotFound} />
      </Switch>

      {typeof window !== "undefined" && (
        <>
          <NotificationsModal open={open} setOpen={setOpen} />
          <NotificationsGroup />
        </>
      )}
    </ErrorBoundary>
  );
};

export default Application;
