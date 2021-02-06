/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */
import { FaMoon, FaSun, FaUser, MdLocalMovies, FaBell } from "react-icons/all";
import { NavLink } from "react-router-dom";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import generateNotificationID from "../../utilities/generateNotificationID";
import globalStyles from "../../themes/Global.module.scss";
import i18n from "../../languages/i18n";
import modalStyles from "../Modal/Modal.module.scss";
import styles from "./Navbar.module.scss";
import Button from "../Button/Button";
import Image from "../Image/Image";
import { getAvatar } from "../../store/user/Login";
import { supportedLanguages } from "../../store/language/Types";
import Modal from "../Modal/Modal";
import useLanguage from "../../hooks/Language";
import useTheme from "../../hooks/Theme";
import useUser from "../../hooks/User";
import SelectList, { manageSelection } from "../SelectList/SelectList";
import NotificationsModal from "../Notifications/NotificationsModal/NotificationsModal";
import { useNotificationsManager } from "../../hooks/Notifications";

const useNavbar = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const manageNavbar = () => {
    if (window.matchMedia("(max-width: 700px)").matches) {
      setOpen(!open);
    }
  };

  return { open, manageNavbar };
};
const DisplaySVG: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement> & { alt: string; lang: string }
> = ({ alt, lang, ...props }) => {
  const { default: image } = React.useMemo(
    () => require(`../../assets/pictures/locales/${lang}.svg`),
    [lang]
  );

  return <img src={image} alt={alt} {...props} />;
};
const Navbar = (): React.ReactElement => {
  const { open, manageNavbar } = useNavbar();
  const { t } = useTranslation("components\\navbar");
  const { user, manageUser } = useUser();
  const [languageState, setLanguageState] = React.useState<string>("default");
  const [languageWindowOpen, setLanguageWindowOpen] = React.useState(false);
  const { language, validateLanguage } = useLanguage();
  const [
    notificationsWindowOpen,
    setNotificationsWindowOpen,
  ] = React.useState<boolean>(false);
  const { theme, switchTheme } = useTheme();
  const { addNotifications } = useNotificationsManager();

  return (
    <>
      <Modal
        windowTitle={<Trans t={t} i18nKey="modal.title" />}
        open={languageWindowOpen}
        setOpen={setLanguageWindowOpen}
      >
        <p
          className={`${globalStyles["primary-margin"]} ${globalStyles["text-align-center"]}`}
        >
          <Trans t={t} i18nKey="modal.description" />
        </p>
        <div className={modalStyles["buttons-container"]}>
          <SelectList
            defaultTitle={<Trans t={t} i18nKey="modal.select.default" />}
            id="select-language"
          >
            {supportedLanguages.sort().map((lang) => {
              return (
                <li
                  key={lang}
                  onClick={() => {
                    setLanguageState(lang);
                    manageSelection("select-language", "none");
                  }}
                >
                  <DisplaySVG lang={lang} alt={`lang-${lang}`} />
                  <span>
                    <Trans t={t} i18nKey={`modal.select.languages.${lang}`} />
                  </span>
                </li>
              );
            })}
          </SelectList>
          <Button
            onClick={() => {
              validateLanguage({
                languageState,
                setLanguageState,
                languageWindowOpen,
                setLanguageWindowOpen,
              });
            }}
          >
            <Trans t={t} i18nKey="modal.saveLanguage" />
          </Button>
        </div>
      </Modal>
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

              if (user) {
                addNotifications([
                  {
                    id: generateNotificationID(),
                    type: "info",
                    time: 5000,
                    body: i18n.t(
                      "components\\navbar:notifications.user.logout"
                    ),
                  },
                ]);
              }
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
              addNotifications([
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
              ]);
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
