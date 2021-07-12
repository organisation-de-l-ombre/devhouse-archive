import React, { FC, ReactElement } from "react";
import { ErrorBoundary } from "react-error-boundary";
import loadable from "@loadable/component";
import { Route, RouteComponentProps, Switch } from "react-router";
import { MetadataBuilder } from "@components/modules";

const RootError = loadable(() => import("@components/modules/Error/RootError"));
const Navbar = loadable(() => import("@components/modules/Navbar/Navbar"));
const Home = loadable(() => import("@application/Home/Home"));
const Account = loadable(() => import("@application/Account/AccountRoot"));
const Callback = loadable(() => import("@application/Callback/Callback"));
const Login = loadable(() => import("@application/Login/Login"));
const MovieTitle = loadable(() => import("@application/MovieTitle/MovieRoot"));
/* const Search = loadable(() => import("@application/Search/Search"));
const InternalWiki = loadable(
  () => import("@application/Wiki/Internal/InternalRoot")
); */
const NotFound = loadable(
  () => import("@components/modules/NotFound/NotFound")
);

const Application: FC = () => {
  return (
    <ErrorBoundary FallbackComponent={RootError}>
      <MetadataBuilder />

      <Navbar />

      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/account" component={Account} />
        <Route path="/callback" exact component={Callback} />
        <Route path="/auth/login" exact component={Login} />
        <Route path="/movies" exact />
        <Route path="/series" exact />
        <Route
          path="/movies/title/:movieId"
          render={(props: RouteComponentProps): ReactElement => {
            return <MovieTitle {...props} />;
          }}
        />
        {/** <Route path="/search" exact component={Search} />
        <Route
          path="/wiki/internal/:section"
          render={(props: RouteComponentProps): ReactElement => {
            return <InternalWiki {...props} />;
          }}
        />* */}
        <Route path="*" component={NotFound} />
      </Switch>
    </ErrorBoundary>
  );
};

export default Application;
