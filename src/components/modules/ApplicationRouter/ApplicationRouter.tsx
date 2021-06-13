import React, { FC, lazy, ReactElement } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { RouteComponentProps } from "react-router";

const Navbar = lazy(() => import("../Navbar/Navbar"));
const Home = lazy(() => import("@application/Home/Home"));
const Account = lazy(() => import("@application/Account/AccountRoot"));
const Callback = lazy(() => import("@application/Callback/Callback"));
const Login = lazy(() => import("@application/Login/Login"));
const MovieTitle = lazy(() => import("@application/MovieTitle/MovieRoot"));
const Search = lazy(() => import("@application/Search/Search"));
const InternalWiki = lazy(
  () => import("@application/Wiki/Internal/InternalRoot")
);
const NotFound = lazy(() => import("../NotFound/NotFound"));

const ApplicationRouter: FC = () => {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default ApplicationRouter;
