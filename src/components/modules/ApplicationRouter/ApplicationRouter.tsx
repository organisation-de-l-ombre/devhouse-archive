import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { RouteComponentProps } from "react-router";

// Modules
const Navbar = React.lazy(() => import("../Navbar/Navbar"));
const Footer = React.lazy(() => import("../Footer/Footer"));
const NotFound = React.lazy(() => import("../NotFound/NotFound"));
// Routes
const Home = React.lazy(() => import("@application/Home/Home"));
const Account = React.lazy(() => import("@application/Account/AccountRoot"));
const Callback = React.lazy(() => import("@application/Callback/Callback"));
const Login = React.lazy(() => import("@application/Login/Login"));
const MovieTitle = React.lazy(
  () => import("@application/MovieTitle/MovieRoot")
);
const Search = React.lazy(() => import("@application/Search/Search"));
const InternalWiki = React.lazy(
  () => import("@application/Wiki/Internal/InternalRoot")
);

const ApplicationRouter = (): React.ReactElement => {
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
          render={(props: RouteComponentProps): React.ReactElement => {
            return <MovieTitle {...props} />;
          }}
        />
        <Route path="/search" exact component={Search} />
        <Route path="/wiki/internal" component={InternalWiki} />
        <Route path="*" component={NotFound} />
      </Switch>

      <Footer />
    </BrowserRouter>
  );
};

export default ApplicationRouter;
