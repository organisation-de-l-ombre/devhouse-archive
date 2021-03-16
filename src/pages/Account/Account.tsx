import React from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router";
import { NavLink } from "react-router-dom";
import {
  BsBoxArrowLeft,
  FaUser,
  GoVerified,
  IoIosLogOut,
} from "react-icons/all";
import FlexContainer from "../../components/ui/FlexContainer/FlexContainer";
import buttonStyles from "../../components/ui/Button/Button.module.scss";
import flexContainerStyles from "../../components/ui/FlexContainer/FlexContainer.module.scss";
import globalStyles from "../../themes/Global.module.scss";
import styles from "./Account.module.scss";
import Image from "../../components/ui/Image/Image";
import ButtonsGroup from "../../components/ui/ButtonsGroup/ButtonsGroup";
import Suspense from "../../components/modules/Suspense/Suspense";
import NotFound from "../../components/modules/NotFound/NotFound";
import AccountModule from "./modules/Account/Account";
import Button from "../../components/ui/Button/Button";
import { getAvatar } from "../../store/user/Login";
import useUser from "../../hooks/User";

const Account = (): React.ReactElement => {
  const { user, removeUser } = useUser();
  const baseURL = useRouteMatch().path;
  const [open, setOpen] = React.useState(false);
  const history = useHistory();

  React.useEffect(() => {
    if (!user) {
      history.push("/");
    }
  });

  return (
    <FlexContainer>
      {user ? (
        <>
          <FlexContainer
            className={`${flexContainerStyles.container} ${styles.menu}${
              open ? ` ${styles.opened}` : ""
            }`}
          >
            <Button
              className={styles["close-navigation"]}
              onClick={() => setOpen(false)}
            >
              <BsBoxArrowLeft />
              <span>Close navigation</span>
            </Button>
            <Image
              className={`${globalStyles["rounded-picture"]}`}
              src={getAvatar(user.avatar)}
            />
            <h2 className={styles.avatar}>{user.username}</h2>
            <ButtonsGroup
              className={`${globalStyles.flex} ${globalStyles.column}`}
            >
              <NavLink
                to={baseURL}
                exact
                className={buttonStyles["button-styles"]}
                activeClassName={styles.active}
              >
                <FaUser />
                <span>Account</span>
              </NavLink>
              <NavLink
                to={`${baseURL}/authorizations`}
                exact
                className={buttonStyles["button-styles"]}
                activeClassName={styles.active}
              >
                <GoVerified />
                <span>Authorizations</span>
              </NavLink>
              <Button onClick={() => removeUser()}>
                <IoIosLogOut />
                <span>Logout</span>
              </Button>
            </ButtonsGroup>
          </FlexContainer>
          <FlexContainer
            className={`${flexContainerStyles.container} ${styles.content} ${globalStyles["navbar-margin"]}`}
          >
            <div className={styles["mobile-navigation"]}>
              <p>
                To access to internal page navigation and to manage your
                account, use the button bellow.
              </p>
              <Button onClick={() => setOpen(true)}>Open navigation</Button>
              <hr />
            </div>

            <React.Suspense fallback={<Suspense />}>
              <Switch>
                <Route path={baseURL} exact component={AccountModule} />
                <Route path="*" component={NotFound} />
              </Switch>
            </React.Suspense>
          </FlexContainer>
        </>
      ) : (
        <></>
      )}
    </FlexContainer>
  );
};

export default Account;
