import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { useLanguage } from "@hooks/Language";
import globalStyles from "@themes/Global.module.scss";
import { manageSelection } from "@components/ui/SelectList/SelectList";
import { supportedLanguages } from "@store/language";
import { DisplayLanguageSVG } from "@components/modules";
import { Button, Modal, modalStyles, SelectList } from "../../ui";

const LanguageModal: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    languageWindowOpen: boolean;
    setLanguageWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
> = ({ languageWindowOpen, setLanguageWindowOpen }) => {
  const { language, setLanguageState, validateLanguage } = useLanguage();
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
        <Trans
          t={t}
          i18nKey="modal.description"
          values={{ language: t(`modal.select.languages.${language}`) }}
        />
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
                <DisplayLanguageSVG lang={lang} alt={`lang-${lang}`} />
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

export default LanguageModal;
