import React, { Dispatch, FC, SetStateAction, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { FaBell, FaBellSlash, FaMoon, FaSun, FaUser } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
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
import MinimalIcon from "@svg/icons/Minimal";
import { useClient } from "@hooks/useInternal";
import { AiFillWarning } from "react-icons/ai";
import fetchImage from "@lib/fetchImage";
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
        <MinimalIcon width="40" height="40" />
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

const UserManagement: FC<{
  manageNavbar: () => void;
  avatar: string | undefined;
  username: string | undefined;
}> = ({ manageNavbar, avatar, username }) => {
  const { t } = useTranslation("components\\modules\\navbar\\navbar");
  const { pathname } = useLocation();
  const { clientID } = useClient();
  const manageAuth = useCallback((): void => {
    manageNavbar();
    localStorage.setItem("redirection", pathname);
  }, [manageNavbar, pathname]);

  if (!avatar && !username && clientID === "Invalid client ID") {
    return (
      <button
        type="button"
        className={styles.account}
        onClick={manageNavbar}
        title={t("acronyms.authError")}
        aria-label="Login unavailable"
      >
        <AiFillWarning />
        <span className={styles["switcher-span"]}>
          <Trans t={t} i18nKey="items.user.authError" />
        </span>
      </button>
    );
  }

  if (!avatar && !username) {
    return (
      <NavLink
        to="/auth/login"
        exact
        className={styles.account}
        onClick={manageAuth}
      >
        <span>
          <Trans t={t} i18nKey="items.user.login" />
        </span>
      </NavLink>
    );
  }

  return (
    <NavLink
      to="/account"
      exact
      className={styles.account}
      onClick={manageAuth}
    >
      {avatar ? (
        <img
          src={fetchImage({
            type: "image",
            image: avatar,
            width: 30,
            height: 30,
          })}
          alt={`Avatar of ${username}`}
          draggable={false}
        />
      ) : (
        <FaUser />
      )}
      <span>
        <Trans t={t} i18nKey="items.user.manageAccount" />
      </span>
    </NavLink>
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
      <UserManagement
        manageNavbar={manageNavbar}
        avatar={user?.avatar}
        username={user?.username}
      />
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
            i18nKey={`items.theme.${theme === "light" ? "dark" : "light"}`}
          />
        </span>
      </button>
    </div>
  );
};

export { MobileNavigation, DrawerBackdrop, Drawer, DrawerStart, DrawerEnd };
