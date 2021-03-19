import { FaMoon, FaSun, FaUser, MdLocalMovies, FaBell } from "react-icons/all";
import { NavLink } from "react-router-dom";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import generateNotificationID from "../../../utilities/generateNotificationID";
import i18n from "../../../languages/i18n";
import styles from "./Navbar.module.scss";
import Button from "../../ui/Button/Button";
import Image from "../../ui/Image/Image";
import { getAvatar } from "../../../store/user/Login";
import useLanguage from "../../../hooks/Language";
import useTheme from "../../../hooks/Theme";
import useUser from "../../../hooks/User";
import NotificationsModal from "../../ui/Notifications/NotificationsModal/NotificationsModal";
import { pushNotifications } from "../../../store/notifications/Actions";
import { DisplaySVG, LanguageModal } from "./LanguageModal";

const useNavbar = (): { open: boolean; manageNavbar: () => void } => {
  const [open, setOpen] = React.useState<boolean>(false);
  const manageNavbar = () => {
    if (window.matchMedia("(max-width: 700px)").matches) {
      setOpen(!open);
    }
  };

  return { open, manageNavbar };
};
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
  const dispatch = useDispatch();

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
      <nav className={`${styles.navbar}${open ? ` ${styles.open}` : ""}`}>
        <Button className={styles["mobile-menu"]} onClick={manageNavbar}>
          <MdLocalMovies />
          <h1>
            <Trans t={t} i18nKey="mobileMenu" />
          </h1>
        </Button>

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
            <DisplaySVG lang={language} alt={`lang-${language}`} />
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
            <FaBell />
            <span className={styles["switcher-span"]}>
              <Trans t={t} i18nKey="items.notifications" />
            </span>
          </Button>
          <Button
            className={styles.buttons}
            onClick={() => {
              switchTheme();
              manageNavbar();
              dispatch(
                pushNotifications([
                  {
                    id: generateNotificationID(),
                    type: "info",
                    time: 5000,
                    body: i18n.t(
                      `components\\navbar:notifications.themeChanged.${
                        theme === "light" ? "dark" : "light"
                      }`
                    ),
                  },
                ])
              );
            }}
          >
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
      </nav>
    </>
  );
};

export default Navbar;
