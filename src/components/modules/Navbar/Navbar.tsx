import { FaMoon, FaSun, FaUser, FaBell, FaBellSlash } from "react-icons/all";
import { NavLink } from "react-router-dom";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import styles from "./Navbar.module.scss";
import Button from "../../ui/Button/Button";
import Image from "../../ui/Image/Image";
import { getAvatar } from "../../../store/user/Login";
import useLanguage from "../../../hooks/Language/Language";
import useTheme from "../../../hooks/Theme/Theme";
import useUser from "../../../hooks/User/User";
import NotificationsModal from "../../ui/Notifications/NotificationsModal/NotificationsModal";
import LanguageModal from "./LanguageModal";
import {
  useNotificationsManager,
  useNotificationsState,
} from "../../../hooks/Notifications/Notifications";
import generateNotificationID from "../../../lib/generateNotificationID";
import DisplayLanguageSVG from "../DisplayLanguageSVG/DisplayLanguageSVG";
import useNavbar from "../../../hooks/Navbar/Navbar";
import IMRMinimalLogo from "../../../assets/pictures/imr/imr-minimal.png";

const Navbar = (): React.ReactElement => {
  const { open, manageNavbar } = useNavbar();
  const { t } = useTranslation("components\\navbar");
  const { user, manageUser } = useUser();
  const { language } = useLanguage();
  const [languageWindowOpen, setLanguageWindowOpen] = React.useState<boolean>(
    false
  );
  const [
    notificationsWindowOpen,
    setNotificationsWindowOpen,
  ] = React.useState<boolean>(false);
  const { theme, switchTheme } = useTheme();
  const { addNotifications } = useNotificationsManager();
  const manageTheme = React.useCallback((): void => {
    switchTheme();
    manageNavbar();
    addNotifications([
      {
        id: generateNotificationID(),
        type: "info",
        body: t(
          `notifications.themeChanged.${theme === "light" ? "dark" : "light"}`
        ),
        time: 5000,
      },
    ]);
  }, [addNotifications, manageNavbar, switchTheme, t, theme]);
  const { allowNotifications } = useNotificationsState();

  return (
    <>
      <LanguageModal
        languageWindowOpen={languageWindowOpen}
        setLanguageWindowOpen={setLanguageWindowOpen}
      />
      <NotificationsModal
        open={notificationsWindowOpen}
        setOpen={setNotificationsWindowOpen}
      />
      <nav className={styles.navbar}>
        <Button className={styles["navbar-logo"]} onClick={manageNavbar}>
          <img src={IMRMinimalLogo} alt="IMR logo" draggable={false} />
          <span>
            <Trans t={t} i18nKey="mobileMenu" />
          </span>
        </Button>
        <div className={styles.separator} />
        <div
          className={`${styles["navbar-items"]}${
            open ? ` ${styles.open}` : ""
          }`}
        >
          <div className={styles.start}>
            <NavLink
              to="/"
              exact
              activeClassName={styles.active}
              onClick={manageNavbar}
            >
              <Trans t={t} i18nKey="items.home" />
            </NavLink>
            <NavLink
              to="/movies"
              exact
              activeClassName={styles.active}
              onClick={manageNavbar}
            >
              <Trans t={t} i18nKey="items.movies" />
            </NavLink>
            <NavLink
              to="/series"
              exact
              activeClassName={styles.active}
              onClick={manageNavbar}
            >
              <Trans t={t} i18nKey="items.series" />
            </NavLink>
          </div>
          <div className={styles.end}>
            <Button
              className={`${styles.buttons} ${styles.user}`}
              onClick={() => {
                manageUser();
                manageNavbar();
              }}
            >
              {user ? (
                <>
                  {user ? (
                    <Image
                      className={styles.avatar}
                      src={getAvatar(user.avatar)}
                    />
                  ) : (
                    <FaUser />
                  )}
                  <span>
                    <Trans t={t} i18nKey="items.manageAccount" />
                  </span>
                </>
              ) : (
                <Trans t={t} i18nKey="items.login" />
              )}
            </Button>
            <Button
              className={styles.buttons}
              onClick={() => {
                if (open) {
                  manageNavbar();
                }

                setLanguageWindowOpen(!languageWindowOpen);
              }}
            >
              <DisplayLanguageSVG lang={language} alt={`lang-${language}`} />
              <span className={styles["switcher-span"]}>
                <Trans t={t} i18nKey="items.changeLanguage" />
              </span>
            </Button>
            <Button
              className={styles.buttons}
              onClick={() => {
                if (open) {
                  manageNavbar();
                }

                setNotificationsWindowOpen(!notificationsWindowOpen);
              }}
            >
              {allowNotifications ? <FaBell /> : <FaBellSlash />}
              <span className={styles["switcher-span"]}>
                <Trans t={t} i18nKey="items.notifications" />
              </span>
            </Button>
            <Button className={styles.buttons} onClick={manageTheme}>
              {theme === "light" ? <FaMoon /> : <FaSun />}
              <span className={styles["switcher-span"]}>
                {theme === "light" ? (
                  <Trans t={t} i18nKey="items.darkTheme" />
                ) : (
                  <Trans t={t} i18nKey="items.lightTheme" />
                )}
              </span>
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
