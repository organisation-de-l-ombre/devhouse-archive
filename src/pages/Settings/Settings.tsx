import React, { ReactElement, useCallback, FC, useMemo } from "react";
import { Route, Switch } from "react-router";
import { useDispatch } from "react-redux";
import { AiFillLock } from "react-icons/all";
import { Button, NavLinkButton } from "../../components/new/Button/Button";
import ButtonGroup from "../../components/new/Button/ButtonGroup";
import Authorizations from "./sections/Authorizations";
import Account from "./sections/Account";
import Support from "./sections/Support";
import styles from "./settings.module.scss";
import NotFound from "../NotFound/NotFound";
import UserAvatarStatus from "../../components/UserAvatarStatus/UserAvatarStatus";
import { withNetwork } from "../../hooks/hoc/withNetwork";
import DataSettings from "./sections/DataSettings";
import { useUser } from "../../state/slices/account/hooks";
import { logout } from "../../state/slices/account/actions";
import LinkedAccounts from "./sections/LinkedAccounts";

const Content: FC = () => {
  const dispatch = useDispatch();
  const match = useMemo(
    () => ({
      path: "/settings",
    }),
    []
  );

  const doLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <ButtonGroup orientation="column">
      <NavLinkButton to={`${match.path}`}>Account</NavLinkButton>
      <NavLinkButton to={`${match.path}/authorizations`}>
        Manage authorizations
      </NavLinkButton>
      <NavLinkButton to={`${match.path}/linked-accounts`}>
        Linked accounts
      </NavLinkButton>
      <NavLinkButton to={`${match.path}/privacy-settings`}>
        Privacy settings
      </NavLinkButton>
      <NavLinkButton to={`${match.path}/support`}>Support</NavLinkButton>
      <Button onClick={doLogout}>
        <AiFillLock />
        Logout
      </Button>
    </ButtonGroup>
  );
};

const Settings = (): ReactElement => {
  const match = useMemo(() => "/settings", []);
  const user = useUser();

  return (
    <div className={styles.main}>
      <div className={styles.navigation}>
        <div className={styles.navigationHeader}>
          <UserAvatarStatus
            width="7rem"
            statusColor="grey"
            avatar={`https://imageproxy.developershouse.xyz/250x250/https://s3.developershouse.xyz/${user?.avatar}`}
            animate
          />
          <h3>{user?.username}</h3>
        </div>
        <Content />
      </div>
      <div className={styles.content}>
        <Switch>
          <Route exact path={`${match}`} component={Account} />
          <Route
            exact
            path={`${match}/authorizations`}
            component={Authorizations}
          />
          <Route
            exact
            path={`${match}/linked-accounts`}
            component={LinkedAccounts}
          />
          <Route
            exact
            path={`${match}/privacy-settings`}
            component={DataSettings}
          />
          <Route exact path={`${match}/support`} component={Support} />
          <Route path="*" exact>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default withNetwork(Settings);
