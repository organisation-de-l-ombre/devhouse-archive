/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */
import {
  FaMoon,
  FaSun,
  FaUser,
  MdLocalMovies,
  TiArrowSortedDown,
} from "react-icons/all";
import { useHistory, NavLink } from "react-router-dom";
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import globalStyles from "../../themes/Global.module.scss";
import styles from "./Navbar.module.scss";
import Button from "../Button/Button";
import Image from "../Image/Image";
import { User } from "../../store/user/Types";
import { createUser, getAvatar } from "../../store/user/Login";
import { GlobalState } from "../../store/Types";
import { Theme } from "../../store/theme/Types";
import changeLanguage from "../../store/language/Actions";
import changeTheme from "../../store/theme/Actions";
import { Language, supportedLanguages } from "../../store/language/Types";
import Modal from "../Modal/Modal";
import i18n from "../../languages/i18n";

const useLanguage = () => {
  const dispatch = useDispatch();
  const language: Language = useSelector(
    (state: GlobalState): Language => state.language.language
  );
  const [languageState, setLanguageState] = React.useState<string>("default");
  const [windowOpen, setWindowOpen] = React.useState(false);
  const validate = (): void => {
    if (languageState === "default" || languageState === language) {
      alert(i18n.t("components\\navbar:modal.invalidLanguage"));
      return;
    }

    dispatch(changeLanguage(languageState));
    setLanguageState("default");
    setWindowOpen(!windowOpen);
  };

  return {
    language,
    languageState,
    setLanguageState,
    windowOpen,
    setWindowOpen,
    validate,
  };
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
  const history = useHistory();
  const [open, setOpen] = React.useState<boolean>(false);
  const theme: Theme = useSelector(
    (state: GlobalState): Theme => state.theme.theme
  );
  const dispatch = useDispatch();
  const { t } = useTranslation("components\\navbar");
  const user: User = useSelector((state: GlobalState): User => state.user.user);
  const manageUser = async (): Promise<void> => {
    if (user) {
      history.push("/account");
    } else {
      await createUser();
    }
  };
  const {
    language,
    windowOpen,
    setWindowOpen,
    setLanguageState,
    validate,
  } = useLanguage();

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
          <div className={styles["select-language"]}>
            <div>
              <span className={globalStyles["text-align-center"]}>
                <Trans t={t} i18nKey="modal.select.default" />
              </span>
              <TiArrowSortedDown />
            </div>
            <ul>
              {supportedLanguages.map((lang) => {
                return (
                  <li key={lang} onClick={() => setLanguageState(lang)}>
                    <DisplaySVG lang={lang} alt={`lang-${lang}`} />
                    <Trans t={t} i18nKey={`modal.select.languages.${lang}`} />
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
          <Button
            className={styles.buttons}
            onClick={() =>
              dispatch(changeTheme(theme === "light" ? "dark" : "light"))
            }
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
