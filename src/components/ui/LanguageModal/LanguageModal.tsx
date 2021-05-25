import React, { Dispatch, SetStateAction, ReactElement } from "react";
import { MdLanguage } from "react-icons/md";
import { Trans, useTranslation } from "react-i18next";
import useLanguage from "@hooks/useLanguage";
import { supportedLanguages } from "@store/language";
import { DisplayLanguageSVG } from "@components/modules";
import { FunctionComponent } from "@typings/FunctionComponent";
import { css } from "@emotion/react";
import Modal from "../Modal/Modal";
import FlexContainer from "../FlexContainer/FlexContainer";
import { Button } from "../Button/Button";

const LanguageModal: FunctionComponent<
  HTMLDivElement,
  {
    languageWindowOpen: boolean;
    setLanguageWindowOpen: Dispatch<SetStateAction<boolean>>;
  }
> = ({ languageWindowOpen, setLanguageWindowOpen }) => {
  const { language, setLanguageState, validateLanguage } = useLanguage();
  const { t } = useTranslation("components\\ui\\languageModal\\languageModal");

  return (
    <Modal
      windowsIcon={<MdLanguage />}
      windowTitle={<Trans t={t} i18nKey="title" />}
      open={languageWindowOpen}
      setOpen={setLanguageWindowOpen}
    >
      <p css={{ lineHeight: "1.5" }}>
        <Trans
          t={t}
          i18nKey="description"
          values={{ language: t(`languages.${language}`) }}
        />
      </p>
      <FlexContainer column>
        <FlexContainer expand allowWrap css={{ marginTop: "1.25rem" }}>
          {supportedLanguages.map(
            (lang: string): ReactElement => {
              return (
                <button
                  type="button"
                  key={lang}
                  css={css`
                    max-width: 10rem;
                    margin: 0.75rem 0.75rem 0 0;
                    padding: 0.75rem;
                    display: flex;
                    flex: 1;
                    align-items: center;
                    cursor: pointer;
                    background-color: ${lang === language
                      ? "var(--primary-background-color-hover)"
                      : "transparent"};
                    border: 0.15rem solid transparent;
                    border-radius: 5px;
                    outline: none;
                    transition: border 300ms, background-color 300ms;

                    img {
                      width: 25px;
                      height: 25px;
                      margin-right: 0.75rem;
                    }

                    &:focus {
                      border: 0.15rem solid var(--font-color-hover);
                    }

                    &:hover {
                      background-color: var(--primary-background-color-hover);
                    }
                  `}
                  onClick={(): void => setLanguageState(lang)}
                >
                  <DisplayLanguageSVG lang={lang} alt={`language-${lang}`} />
                  <span>
                    <Trans t={t} i18nKey={`languages.${lang}`} />
                  </span>
                </button>
              );
            }
          )}
        </FlexContainer>
        <Button
          css={{
            marginTop: "2rem",
            alignSelf: "center",
            backgroundColor: "var(--primary-background-color-hover)",
          }}
          onClick={() => validateLanguage(setLanguageWindowOpen)}
        >
          <Trans t={t} i18nKey="saveLanguage" />
        </Button>
      </FlexContainer>
    </Modal>
  );
};

export default LanguageModal;
