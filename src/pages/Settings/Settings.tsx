import React, { ReactElement, useCallback, FC, useMemo } from "react";
import { Route, Switch } from "react-router";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AiFillLock } from "react-icons/all";
import { Button, ButtonImage } from "../../components/ui/Button/Button";
import ButtonGroup from "../../components/ui/Button/ButtonGroup";
import Authorizations from "./sections/Authorizations";
import Account from "./sections/Account";
import Support from "./sections/Support";
import styles from "./settings.module.scss";
import NotFound from "../NotFound/NotFound";
import UserAvatarStatus from "../../components/ui/UserAvatarStatus/UserAvatarStatus";
import { withNetwork } from "../../hooks/hoc/withNetwork";
import DataSettings from "./sections/DataSettings";
import { useUser } from "../../state/slices/account/hooks";
import { logout } from "../../state/slices/account/actions";

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
    <ButtonGroup className={styles.list} full>
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
      <Button onClick={doLogout}>
        <ButtonImage>
          <AiFillLock />
        </ButtonImage>
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
            avatar={`https://s3.developershouse.xyz/${user?.avatar}`}
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
