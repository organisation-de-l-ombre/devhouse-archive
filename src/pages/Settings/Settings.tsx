/*
 * The Error page displayed to the user when the website crashes.
 */

import React, { ReactElement } from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import { NavLink } from "react-router-dom";
import { TitleBox } from "../../components/ui/TitleBox";
import { Button } from "../../components/ui/Button";
import ButtonGroup from "../../components/ui/ButtonGroup";
import Authorizations from "./sections/Authorizations";
import Account from "./sections/Account";
import Support from "./sections/Support";

const Settings = (): ReactElement => {
  const match = useRouteMatch();

  return (
    <div>
      <TitleBox>
        <h1>Account manager</h1>
        <ButtonGroup>
          <NavLink to={`${match.url}`}>
            <Button>Account</Button>
          </NavLink>
          <NavLink to={`${match.url}/authorizations`}>
            <Button>Manage authorizations</Button>
          </NavLink>
          <NavLink to={`${match.url}/support`}>
            <Button>Support</Button>
          </NavLink>
        </ButtonGroup>
      </TitleBox>

      <Switch>
        <Route exact path={`${match.path}`} component={Account} />
        <Route
          exact
          path={`${match.path}/authorizations`}
          component={Authorizations}
        />
        <Route exact path={`${match.path}/support`} component={Support} />
      </Switch>
    </div>
  );
};

export default Settings;
