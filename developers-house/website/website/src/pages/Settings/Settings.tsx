/*
 * The Error page displayed to the user when the website crashes.
 */

import React, { ReactElement, useCallback, Suspense, FC } from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiFillLock } from "react-icons/all";
import { Button, ButtonImage } from "../../components/ui/Button/Button";
import ButtonGroup from "../../components/ui/Button/ButtonGroup";
import Authorizations from "./sections/Authorizations";
import Account from "./sections/Account";
import Support from "./sections/Support";
import styles from "./settings.module.scss";
import NotFound from "../NotFound/NotFound";
import UserAvatarStatus from "../../components/ui/UserAvatarStatus/UserAvatarStatus";
import { logoutUser } from "../../state/modules/user/actions";
import { Loader } from "../../components/SuspenseLoader/SuspenseLoader";

const Content: FC<{ path: string }> = ({ path }) => {
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  return (
    <ButtonGroup className={styles.list} full>
      <NavLink to={`${path}`}>
        <Button>Account</Button>
      </NavLink>
      <NavLink to={`${path}/authorizations`}>
        <Button>Manage authorizations</Button>
      </NavLink>
      <NavLink to={`${path}/linked-accounts`}>
        <Button>Linked accounts</Button>
      </NavLink>
      <NavLink to={`${path}/privacy-settings`}>
        <Button>Privacy settings</Button>
      </NavLink>
      <NavLink to={`${path}/support`}>
        <Button>Support</Button>
      </NavLink>
      <Button onClick={logout}>
        <ButtonImage>
          <AiFillLock />
        </ButtonImage>
        Logout
      </Button>
    </ButtonGroup>
  );
};

const Settings = (): ReactElement => {
  const match = useRouteMatch();
  const user = useSelector((x) => x.user.user);

  return (
    <div className={styles.main}>
      <div className={styles.navigation}>
        <div className={styles.navigationHeader}>
          <UserAvatarStatus
            width="7rem"
            statusColor="grey"
            avatar={`https://s3.developershouse.xyz/${user?.avatar}`}
            animate
          />
          <h3>{user?.username}</h3>
        </div>
        <Content path={match.path} />
      </div>
      <div className={styles.content}>
        <Suspense fallback={<Loader />}>
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
        </Suspense>
      </div>
    </div>
  );
};

export default Settings;
