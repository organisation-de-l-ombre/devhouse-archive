/*
 * The Error page displayed to the user when the website crashes.
 */

import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TitleBox } from "../../components/ui/TitleBox/TitleBox";
import { Button } from "../../components/ui/Button/Button";
import ButtonGroup from "../../components/ui/Button/ButtonGroup";
import Authorizations from "./sections/Authorizations";
import Account from "./sections/Account";
import Support from "./sections/Support";
import styles from "./settings.module.scss";
import NotFound from "../NotFound/NotFound";
import UserAvatarStatus from "../../components/ui/UserAvatarStatus/UserAvatarStatus";
import { OnlyMobiles } from "../../components/navbar/Menu/OnlyMobiles";
import { logoutUser } from "../../state/modules/user/actions";

const Settings = (): ReactElement => {
  const match = useRouteMatch();
  const user = useSelector((x) => x.user.user);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  useEffect(() => {
    setOpen(false);
  }, [match]);

  return (
    <div className={styles.masterNav}>
      <div className={`${styles.card} ${open ? styles.open : ""}`}>
        <div className={styles.leftNav}>
          <TitleBox className={styles.header}>
            <UserAvatarStatus
              width="7rem"
              statusColor="grey"
              avatar={`https://s3.developershouse.xyz/${user?.avatar}`}
              animate
            />
            <h3>{user?.username}</h3>
            <ButtonGroup className={styles.list}>
              <OnlyMobiles>
                <Button onClick={() => setOpen(!open)}>Close</Button>
              </OnlyMobiles>
              <Button onClick={logout}>Logout</Button>
              <NavLink to={`${match.path}`}>
                <Button>Account</Button>
              </NavLink>
              <NavLink to={`${match.path}/authorizations`}>
                <Button>Manage authorizations</Button>
              </NavLink>
              <NavLink to={`${match.path}/linked-accounts`}>
                <Button>Linked accounts</Button>
              </NavLink>
              <NavLink to={`${match.path}/privacy-settings`}>
                <Button>Privacy settings</Button>
              </NavLink>
              <NavLink to={`${match.path}/support`}>
                <Button>Support</Button>
              </NavLink>
            </ButtonGroup>
          </TitleBox>
        </div>
      </div>
      <div className={styles.content}>
        <OnlyMobiles>
          <Button onClick={() => setOpen(!open)}>Open nav</Button>
        </OnlyMobiles>
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
      </div>
    </div>
  );
};

export default Settings;
