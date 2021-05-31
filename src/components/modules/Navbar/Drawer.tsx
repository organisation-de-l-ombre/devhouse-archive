import React, { Dispatch, SetStateAction, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { getAvatar } from "@lib/manageAuthentication";
import { FaBell, FaBellSlash, FaMoon, FaSun, FaUser } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import localForage from "localforage";
import useAccount from "@hooks/useAccount";
import generateNotificationID from "@lib/generateNotificationID";
import useTheme from "@hooks/useTheme";
import {
  useNotificationsManager,
  useNotificationsState,
} from "@hooks/useNotifications";
import useLanguage from "@hooks/useLanguage";
import { Fade as Hamburger } from "hamburger-react";
import { FunctionComponent } from "@typings/FunctionComponent";
import DisplayLanguageSVG from "../DisplayLanguageSVG/DisplayLanguageSVG";
import styles from "./Navbar.module.scss";

const MobileNavigation: FunctionComponent<
  HTMLButtonElement,
  {
    open: boolean;
    manageNavbar: () => void;
  }
> = ({ open, manageNavbar }) => {
  const { t } = useTranslation("components\\modules\\navbar\\navbar");

  return (
    <button
      type="button"
      className={styles["only-mobiles"]}
      onClick={manageNavbar}
    >
      <div className={styles.branding}>
        <img src="/icons/logo32.png" alt="IMR logo" draggable={false} />
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

const DrawerBackdrop: FunctionComponent<
  HTMLDivElement,
  { manageNavbar: () => void }
> = ({ manageNavbar }) => {
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
  return <div className={styles["drawer-backdrop"]} onClick={manageNavbar} />;
};

const Drawer: FunctionComponent<HTMLDivElement> = ({ ...props }) => {
  return <div className={styles.drawer} {...props} />;
};

const DrawerStart: FunctionComponent<
  HTMLDivElement,
  { manageNavbar: () => void }
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

const DrawerEnd: FunctionComponent<
  HTMLDivElement,
  {
    open: boolean;
    manageNavbar: () => void;
    setLanguageWindowOpen: Dispatch<SetStateAction<boolean>>;
    setNotificationsWindowOpen: Dispatch<SetStateAction<boolean>>;
  }
> = ({
  open,
  manageNavbar,
  setLanguageWindowOpen,
  setNotificationsWindowOpen,
}) => {
  const { t } = useTranslation("components\\modules\\navbar\\navbar");
  const { user } = useAccount();
  const manageAuth = useCallback((): void => {
    manageNavbar();
    localForage.setItem("redirection", document.location.pathname);
  }, [manageNavbar]);
  const { theme, switchTheme } = useTheme();
  const { allowNotifications } = useNotificationsState();
  const { addNotifications } = useNotificationsManager();
  const manageTheme = useCallback((): void => {
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
        className={styles.account}
        onClick={manageAuth}
      >
        {user ? (
          <>
            {user ? (
              <img
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
        onClick={manageNavbar}
        title={t("acronyms.search")}
        aria-label="Do a search"
      >
        <MdSearch className={styles.search} />
        <span className={styles["switcher-span"]}>
          <Trans t={t} i18nKey="items.search" />
        </span>
      </NavLink>
      <button
        type="button"
        onClick={() => {
          if (open) {
            manageNavbar();
          }

          setLanguageWindowOpen(true);
        }}
        title={t("acronyms.changeLanguage")}
        aria-label="Change website language"
      >
        <DisplayLanguageSVG lang={language} alt={`lang-${language}`} />
        <span className={styles["switcher-span"]}>
          <Trans t={t} i18nKey="items.changeLanguage" />
        </span>
      </button>
      <button
        type="button"
        onClick={() => {
          if (open) {
            manageNavbar();
          }

          setNotificationsWindowOpen(true);
        }}
        title={t("acronyms.notifications")}
        aria-label="Manage notifications preferences"
      >
        {allowNotifications ? <FaBell /> : <FaBellSlash />}
        <span className={styles["switcher-span"]}>
          <Trans t={t} i18nKey="items.notifications" />
        </span>
      </button>
      <button
        type="button"
        onClick={manageTheme}
        title={t("acronyms.theme")}
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
