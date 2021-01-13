import React from "react";
import { randomBytes } from "crypto";
import { Route, Switch, useRouteMatch } from "react-router";
import { NavLink } from "react-router-dom";
import { BsBoxArrowLeft } from "react-icons/bs";
import { User } from "../../account/Types";
import FlexContainer from "../../components/FlexContainer/FlexContainer";
import UserContext from "../../account/UserContext";
import buttonStyles from "../../components/Button/Button.module.scss";
import flexContainerStyles from "../../components/FlexContainer/FlexContainer.module.scss";
import globalStyles from "../../themes/Global.module.scss";
import styles from "./Account.module.scss";
import Image from "../../components/Image/Image";
import ButtonsGroup from "../../components/ButtonsGroup/ButtonsGroup";
import { getAvatar } from "../../account/UserActions";
import Suspense from "../../components/Suspense/Suspense";
import NotFound from "../../components/NotFound/NotFound";

import AccountModule from "./modules/Account/Account";
import Button from "../../components/Button/Button";

const Account = (): React.ReactElement => {
  const userDefault: User = {
    avatar: "test",
    dataCollection: true,
    premium: false,
    private: false,
    roles: 0,
    sid: "123456789",
    sub: "123456789",
    token: randomBytes(32).toString("hex"),
    username: "Kylian",
  };
  const { user: userFetched } = React.useContext(UserContext);
  const user: User = userFetched !== null ? userFetched : userDefault;
  const baseURL = useRouteMatch().path;
  const [open, setOpen] = React.useState(false);

  return (
    <FlexContainer>
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
          className={globalStyles["rounded-picture"]}
          src={getAvatar(user.avatar)}
        />
        <h2>{user.username}</h2>
        <ButtonsGroup className={`${globalStyles.flex} ${globalStyles.column}`}>
          <NavLink
            to={baseURL}
            exact
            className={buttonStyles["button-styles"]}
            activeClassName={styles.active}
          >
            Account
          </NavLink>
          <NavLink
            to={`${baseURL}/authorizations`}
            exact
            className={buttonStyles["button-styles"]}
            activeClassName={styles.active}
          >
            Authorizations
          </NavLink>
        </ButtonsGroup>
      </FlexContainer>
      <FlexContainer
        className={`${flexContainerStyles.container} ${styles.content}`}
      >
        <div className={styles["mobile-navigation"]}>
          <p>
            To access to internal page navigation and to manage your account,
            use the button bellow.
          </p>
          <Button onClick={() => setOpen(true)}>Open navigation</Button>
        </div>

        <React.Suspense fallback={<Suspense />}>
          <Switch>
            <Route path={baseURL} exact component={AccountModule} />
            <Route path="*" exact component={NotFound} />
          </Switch>
        </React.Suspense>
      </FlexContainer>
    </FlexContainer>
  );
};

export default Account;
