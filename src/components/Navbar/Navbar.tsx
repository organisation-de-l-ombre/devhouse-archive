import { FaMoon, FaSun, FaUser, MdLocalMovies } from "react-icons/all";
import { useHistory, NavLink } from "react-router-dom";
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { createUser, getAvatar } from "../../account/UserActions";
import styles from "./Navbar.module.scss";
import Button from "../Button/Button";
import ThemeContext from "../../themes/ThemeContext";
import UserContext from "../../account/UserContext";
import Image from "../Image/Image";

const Navbar = (): React.ReactElement => {
  const { loggedIn } = React.useContext(UserContext);
  const history = useHistory();
  const manageUser = React.useCallback(async (): Promise<void> => {
    switch (loggedIn) {
      case true:
        history.push("/account");
        break;

      case false:
        await createUser();
        break;

      default:
        break;
    }
  }, [history, loggedIn]);
  const [open, setOpen] = React.useState(false);
  const { changeTheme, theme } = React.useContext(ThemeContext);
  const { t } = useTranslation("translation");
  const { user } = React.useContext(UserContext);

  return (
    <nav className={`${styles.navbar}${open ? ` ${styles.open}` : ""}`}>
      <Button className={styles["mobile-menu"]} onClick={() => setOpen(!open)}>
        <MdLocalMovies />
        <h1>
          <Trans t={t} i18nKey="components.navbar.mobileMenu" />
        </h1>
      </Button>

      <div className={styles.start}>
        <NavLink to="/" exact activeClassName={styles.active}>
          <Trans t={t} i18nKey="components.navbar.items.home" />
        </NavLink>
        <NavLink to="/movies" exact activeClassName={styles.active}>
          <Trans t={t} i18nKey="components.navbar.items.movies" />
        </NavLink>
        <NavLink to="/series" exact activeClassName={styles.active}>
          <Trans t={t} i18nKey="components.navbar.items.series" />
        </NavLink>
      </div>
      <div className={styles.end}>
        <Button className={styles.buttons} onClick={manageUser}>
          {loggedIn ? (
            <>
              {user ? (
                <Image className={styles.avatar} src={getAvatar(user.avatar)} />
              ) : (
                <FaUser />
              )}
              <span>
                <Trans t={t} i18nKey="components.navbar.items.manageAccount" />
              </span>
            </>
          ) : (
            <Trans t={t} i18nKey="components.navbar.items.login" />
          )}
        </Button>
        <Button className={styles.buttons} onClick={changeTheme}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
          <span className={styles["theme-switcher-span"]}>
            {theme === "light" ? (
              <Trans t={t} i18nKey="components.navbar.items.darkTheme" />
            ) : (
              <Trans t={t} i18nKey="components.navbar.items.lightTheme" />
            )}
          </span>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
