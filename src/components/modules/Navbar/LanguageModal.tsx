import React from "react";
import { Trans, useTranslation } from "react-i18next";
import modalStyles from "../../ui/Modal/Modal.module.scss";
import globalStyles from "../../../themes/Global.module.scss";
import SelectList, { manageSelection } from "../../ui/SelectList/SelectList";
import { supportedLanguages } from "../../../store/language/Types";
import Button from "../../ui/Button/Button";
import Modal from "../../ui/Modal/Modal";
import useLanguage from "../../../hooks/Language/Language";

const DisplaySVG: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement> & { alt: string; lang: string }
> = ({ alt, lang, ...props }) => {
  const { default: image } = React.useMemo(
    () => require(`../../../assets/pictures/locales/${lang}.svg`),
    [lang]
  );

  return <img src={image} alt={alt} {...props} />;
};
const LanguageModal: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    languageWindowOpen: boolean;
    setLanguageWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
> = ({ languageWindowOpen, setLanguageWindowOpen }) => {
  const { setLanguageState, validateLanguage } = useLanguage();
  const { t } = useTranslation("components\\navbar");

  return (
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
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
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
        <Button onClick={() => validateLanguage(setLanguageWindowOpen)}>
          <Trans t={t} i18nKey="modal.saveLanguage" />
        </Button>
      </div>
    </Modal>
  );
};

export { DisplaySVG, LanguageModal };
