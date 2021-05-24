import React from "react";
import { Trans, useTranslation } from "react-i18next";
import useLanguage from "@hooks/useLanguage";
import globalStyles from "@styles/Global.module.scss";
import { supportedLanguages } from "@store/language";
import { DisplayLanguageSVG } from "@components/modules";
import SelectList, { manageSelection } from "../SelectList/SelectList";
import { Button } from "../Button/Button";
import Modal from "../Modal/Modal";
import FlexContainer from "../FlexContainer/FlexContainer";

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
  const { t } = useTranslation("components\\ui\\languageModal\\languageModal");

  return (
    <Modal
      windowTitle={<Trans t={t} i18nKey="title" />}
      open={languageWindowOpen}
      setOpen={setLanguageWindowOpen}
    >
      <p
        className={`${globalStyles["primary-margin"]} ${globalStyles["text-align-center"]}`}
      >
        <Trans
          t={t}
          i18nKey="description"
          values={{ language: t(`select.languages.${language}`) }}
        />
      </p>
      <FlexContainer allowWrap fullCentered>
        <SelectList
          defaultTitle={<Trans t={t} i18nKey="select.default" />}
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
                  <Trans t={t} i18nKey={`select.languages.${lang}`} />
                </span>
              </li>
            );
          })}
        </SelectList>
        <Button
          css={{ backgroundColor: "var(--secondary-background-color)" }}
          onClick={() => validateLanguage(setLanguageWindowOpen)}
        >
          <Trans t={t} i18nKey="saveLanguage" />
        </Button>
      </FlexContainer>
    </Modal>
  );
};

export default LanguageModal;
