/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */
import {
  FaMoon,
  FaSun,
  FaUser,
  MdLocalMovies,
  TiArrowSortedDown,
} from "react-icons/all";
import { NavLink } from "react-router-dom";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import globalStyles from "../../themes/Global.module.scss";
import styles from "./Navbar.module.scss";
import Button from "../Button/Button";
import Image from "../Image/Image";
import { getAvatar } from "../../store/user/Login";
import { supportedLanguages } from "../../store/language/Types";
import Modal from "../Modal/Modal";
import useLanguage from "../../hooks/Language";
import useTheme from "../../hooks/Theme";
import useUser from "../../hooks/User";

const manageLanguagesSelection = (display: "flex" | "none"): void => {
  const languagesList = document.getElementById("languages-list");

  if (languagesList) {
    languagesList.style.display = display;
  }
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
  const [open, setOpen] = React.useState<boolean>(false);
  const { t } = useTranslation("components\\navbar");
  const {
    language,
    windowOpen,
    setWindowOpen,
    setLanguageState,
    validate,
  } = useLanguage();
  const { user, manageUser } = useUser();
  const { theme, switchTheme } = useTheme();

  return (
    <>
      <Modal
        windowTitle={<Trans t={t} i18nKey="modal.title" />}
        open={windowOpen}
        setOpen={setWindowOpen}
      >
        <p
          className={`${globalStyles["primary-margin"]} ${globalStyles["text-align-center"]}`}
        >
          <Trans t={t} i18nKey="modal.description" />
        </p>
        <div className={styles["form-container"]}>
          <div
            className={styles["select-language"]}
            onMouseEnter={() => manageLanguagesSelection("flex")}
            onMouseLeave={() => manageLanguagesSelection("none")}
          >
            <div>
              <span className={globalStyles["text-align-center"]}>
                <Trans t={t} i18nKey="modal.select.default" />
              </span>
              <TiArrowSortedDown />
            </div>
            <ul id="languages-list" style={{ display: "none" }}>
              {supportedLanguages.sort().map((lang) => {
                return (
                  <li
                    key={lang}
                    onClick={() => {
                      setLanguageState(lang);
                      manageLanguagesSelection("none");
                    }}
                  >
                    <DisplaySVG lang={lang} alt={`lang-${lang}`} />
                    <span>
                      <Trans t={t} i18nKey={`modal.select.languages.${lang}`} />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <Button onClick={() => validate()}>
            <Trans t={t} i18nKey="modal.saveLanguage" />
          </Button>
        </div>
      </Modal>
      <nav className={`${styles.navbar}${open ? ` ${styles.open}` : ""}`}>
        <Button
          className={styles["mobile-menu"]}
          onClick={() => setOpen(!open)}
        >
          <MdLocalMovies />
          <h1>
            <Trans t={t} i18nKey="mobileMenu" />
          </h1>
        </Button>

        <div className={styles.start}>
          <NavLink to="/" exact activeClassName={styles.active}>
            <Trans t={t} i18nKey="items.home" />
          </NavLink>
          <NavLink to="/movies" exact activeClassName={styles.active}>
            <Trans t={t} i18nKey="items.movies" />
          </NavLink>
          <NavLink to="/series" exact activeClassName={styles.active}>
            <Trans t={t} i18nKey="items.series" />
          </NavLink>
        </div>
        <div className={styles.end}>
          <Button className={styles.buttons} onClick={manageUser}>
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
            className={`${styles.buttons} ${styles["langs-container"]}`}
            onClick={() => {
              if (open) {
                setOpen(!open);
              }

              setWindowOpen(!windowOpen);
            }}
          >
            <DisplaySVG lang={language} alt={`lang-${language}`} />
            <span className={styles["switcher-span"]}>
              <Trans t={t} i18nKey="items.changeLanguage" />
            </span>
          </Button>
          <Button className={styles.buttons} onClick={() => switchTheme()}>
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
