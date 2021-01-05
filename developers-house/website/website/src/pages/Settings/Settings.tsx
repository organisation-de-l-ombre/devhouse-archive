/*
 * The Error page displayed to the user when the website crashes.
 */

import React, { FC, ReactElement } from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import { NavLink } from "react-router-dom";
import { TitleBox } from "../../components/ui/TitleBox";
import { Button } from "../../components/ui/Button";
import ButtonGroup from "../../components/ui/ButtonGroup";
import Authorizations from "./sections/Authorizations";
import Account from "./sections/Account";
import Support from "./sections/Support";
import styles from "./settings.module.scss";
import {
  ExceptMobile,
  OnlyMobiles,
} from "../../components/navbar/Menu/OnlyMobiles";
import { Card, CardPadding } from "../../components/ui/Card";
import NotFound from "../NotFound/NotFound";

const SelectionMenu: FC<{ base: string }> = ({ base }) => {
  return (
    <ButtonGroup className={styles.leftNav}>
      <NavLink to={`${base}`}>
        <Button>Account</Button>
      </NavLink>
      <NavLink to={`${base}/authorizations`}>
        <Button>Manage authorizations</Button>
      </NavLink>
      <NavLink to={`${base}/linked-accounts`}>
        <Button>Linked accounts</Button>
      </NavLink>
      <NavLink to={`${base}/privacy-settings`}>
        <Button>Privacy settings</Button>
      </NavLink>
      <NavLink to={`${base}/support`}>
        <Button>Support</Button>
      </NavLink>
    </ButtonGroup>
  );
};

const Settings = (): ReactElement => {
  const match = useRouteMatch();

  return (
    <div className={styles.masterNav}>
      <ExceptMobile className={styles.full}>
        <Card className={styles.card}>
          <TitleBox className={styles.header}>
            <h3>Account manager</h3>
            <p>Here, you can manage your account settings and authorizations</p>
          </TitleBox>
          <SelectionMenu base={match.url} />
        </Card>
      </ExceptMobile>
      <div className={styles.content}>
        <OnlyMobiles>
          <TitleBox className={styles.header}>
            <h3>Account manager</h3>
            <p>Here, you can manage your account settings and authorizations</p>
          </TitleBox>
          <SelectionMenu base={match.url} />
        </OnlyMobiles>
        <CardPadding>
          <Card>
            <Switch>
              <Route exact path={`${match.path}`} component={Account} />
              <Route
                exact
                path={`${match.path}/authorizations`}
                component={Authorizations}
              />
              <Route exact path={`${match.path}/support`} component={Support} />
              <Route path="*" exact>
                <NotFound />
              </Route>
            </Switch>
          </Card>
        </CardPadding>
      </div>
    </div>
  );
};

export default Settings;
