import React from "react";
import { NavLink } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { getAvatar } from "@lib/manageAuthentication";
import { FaBell, FaBellSlash, FaMoon, FaSun, FaUser } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import localForage from "localforage";
import { useUser } from "@hooks/User";
import generateNotificationID from "@lib/generateNotificationID";
import { useTheme } from "@hooks/Theme";
import {
  useNotificationsManager,
  useNotificationsState,
} from "@hooks/Notifications";
import { useLanguage } from "@hooks/Language";
import IMRMinimalLogo from "@assets/pictures/imr/imr-minimal.png";
import { Fade as Hamburger } from "hamburger-react";
import DisplayLanguageSVG from "../DisplayLanguageSVG/DisplayLanguageSVG";
import styles from "./Navbar.module.scss";

const MobileNavigation: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & { open: boolean }
> = ({ open }) => {
  const { t } = useTranslation("components\\modules\\navbar\\navbar");

  return (
    <button type="button" className={styles["navbar-logo"]}>
      <div className={styles.branding}>
        <img src={IMRMinimalLogo} alt="IMR logo" draggable={false} />
        <span>
          <Trans t={t} i18nKey="mobileMenu" />
        </span>
      </div>
      <div className={styles.hamburger}>
        <Hamburger
          size={20}
          label="Open or close navigation"
          toggled={open}
          duration={0.3}
        />
      </div>
    </button>
  );
};

const DrawerBackdrop: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { manageNavbar: () => void }
> = ({ manageNavbar }) => {
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
  return <div className={styles["drawer-backdrop"]} onClick={manageNavbar} />;
};

const Drawer: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
> = ({ ...props }) => {
  return <div className={styles.drawer} {...props} />;
};

const DrawerStart: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { manageNavbar: () => void }
> = ({ manageNavbar }) => {
  const { t } = useTranslation("components\\modules\\navbar\\navbar");

  return (
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
        to="/browse"
        exact
        activeClassName={styles.active}
        onClick={manageNavbar}
      >
        <Trans t={t} i18nKey="items.browse" />
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
  );
};

const DrawerEnd: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    open: boolean;
    manageNavbar: () => void;
    setLanguageWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setNotificationsWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
> = ({
  open,
  manageNavbar,
  setLanguageWindowOpen,
  setNotificationsWindowOpen,
}) => {
  const { t } = useTranslation("components\\modules\\navbar\\navbar");
  const { user } = useUser();
  const manageAuth = React.useCallback((): void => {
    manageNavbar();
    localForage.setItem("redirection", document.location.pathname);
  }, [manageNavbar]);
  const { theme, switchTheme } = useTheme();
  const { allowNotifications } = useNotificationsState();
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
  const { language } = useLanguage();

  return (
    <div className={styles.end}>
      <NavLink
        to={user ? "/account" : "/auth/login"}
        exact
        className={`${styles.buttons} ${styles.user}`}
        onClick={manageAuth}
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
              <Trans t={t} i18nKey="items.user.manageAccount" />
            </span>
          </>
        ) : (
          <span>
            <Trans t={t} i18nKey="items.user.login" />
          </span>
        )}
      </NavLink>
      <NavLink
        to="/search"
        exact
        className={styles.buttons}
        onClick={manageNavbar}
        aria-label="Do a search"
      >
        <MdSearch className={styles.search} />
        <span className={styles["switcher-span"]}>
          <Trans t={t} i18nKey="items.search" />
        </span>
      </NavLink>
      <button
        type="button"
        className={styles.buttons}
        onClick={() => {
          if (open) {
            manageNavbar();
          }

          setLanguageWindowOpen(true);
        }}
        aria-label="Change website language"
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

          setNotificationsWindowOpen(true);
        }}
        aria-label="Manage notifications preferences"
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
        aria-label="Change website color theme"
      >
        {theme === "light" ? <FaMoon /> : <FaSun />}
        <span className={styles["switcher-span"]}>
          <Trans
            t={t}
            i18nKey={`items.theme.${theme === "light" ? "light" : "dark"}`}
          />
        </span>
      </button>
    </div>
  );
};

export { MobileNavigation, DrawerBackdrop, Drawer, DrawerStart, DrawerEnd };
