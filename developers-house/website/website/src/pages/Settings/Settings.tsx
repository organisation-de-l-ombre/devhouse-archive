/*
 * The Error page displayed to the user when the website crashes.
 */

import React, {
  ReactElement,
  useCallback,
  useEffect,
  useState,
  Suspense,
  FC,
} from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GlobalStyles } from "styles";
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

const Content: FC<{ switchOpen: () => void; path: string }> = ({
  switchOpen,
  path,
}) => {
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);
  return (
    <ButtonGroup className={styles.list}>
      <Button className={GlobalStyles.onlyMobiles} onClick={switchOpen}>
        Close
      </Button>
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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [match]);

  const switchOpen = useCallback(() => {
    setOpen(!open);
  }, [open]);

  return (
    <div className={styles.masterNav}>
      <div className={`${styles.card} ${open ? styles.open : ""}`}>
        <div className={styles.leftNav}>
          <div className={styles.leftNavHeader}>
            <UserAvatarStatus
              width="7rem"
              statusColor="grey"
              avatar={`https://s3.developershouse.xyz/${user?.avatar}`}
              animate
            />
            <h3>{user?.username}</h3>
          </div>
          <Content path={match.path} switchOpen={switchOpen} />
        </div>
      </div>
      <div className={styles.content}>
        <Button
          className={GlobalStyles.onlyMobiles}
          onClick={() => setOpen(!open)}
        >
          Open nav
        </Button>

        <Suspense fallback="">
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
