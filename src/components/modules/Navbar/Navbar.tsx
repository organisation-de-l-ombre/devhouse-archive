import { FaMoon, FaSun, FaUser, FaBell, FaBellSlash } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import { NavLink } from "react-router-dom";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import generateNotificationID from "@lib/generateNotificationID";
import { useLanguage } from "@hooks/Language";
import { useNavbar } from "@hooks/Navbar";
import {
  useNotificationsManager,
  useNotificationsState,
} from "@hooks/Notifications";
import { useTheme } from "@hooks/Theme";
import { useUser } from "@hooks/User";
import { getAvatar } from "@lib/manageAuthentication";
import IMRMinimalLogo from "@assets/pictures/imr/imr-minimal.png";
import { NotificationsModal } from "../../ui";
import DisplayLanguageSVG from "../DisplayLanguageSVG/DisplayLanguageSVG";
import styles from "./Navbar.module.scss";
import LanguageModal from "./LanguageModal";

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
        <button
          type="button"
          className={styles["navbar-logo"]}
          onClick={manageNavbar}
        >
          <img src={IMRMinimalLogo} alt="IMR logo" draggable={false} />
          <span>
            <Trans t={t} i18nKey="mobileMenu" />
          </span>
        </button>
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
            <button
              type="button"
              className={`${styles.buttons} ${styles.user}`}
              onClick={() => {
                manageUser();
                manageNavbar();
              }}
            >
              {user ? (
                <>
                  {user ? (
                    <img
                      className={styles.avatar}
                      src={getAvatar(user.avatar)}
                      alt={`Avatar of ${user.username}`}
                      draggable={false}
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
            </button>
            <NavLink
              to="/search"
              exact
              className={styles.buttons}
              onClick={manageNavbar}
            >
              <MdSearch className={styles.search} />
              <span className={styles["switcher-span"]}>
                <Trans t={t} i18nKey="items.browse" />
              </span>
            </NavLink>
            <button
              type="button"
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
            </button>
            <button
              type="button"
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
            </button>
            <button
              type="button"
              className={styles.buttons}
              onClick={manageTheme}
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
              <span className={styles["switcher-span"]}>
                {theme === "light" ? (
                  <Trans t={t} i18nKey="items.darkTheme" />
                ) : (
                  <Trans t={t} i18nKey="items.lightTheme" />
                )}
              </span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
