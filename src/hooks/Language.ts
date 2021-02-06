import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { Language } from "../store/language/Types";
import { GlobalState } from "../store/Types";
import i18n from "../languages/i18n";
import changeLanguage from "../store/language/Actions";

interface ValidateLanguageOptions {
  languageState: string;
  setLanguageState: React.Dispatch<React.SetStateAction<string>>;
  languageWindowOpen: boolean;
  setLanguageWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
type ValidateLanguage = ({
  languageState,
  setLanguageState,
  languageWindowOpen,
  setLanguageWindowOpen,
}: ValidateLanguageOptions) => void;

const useLanguage = (): {
  language: string;
  validateLanguage: ValidateLanguage;
} => {
  const dispatch = useDispatch();
  const language = useSelector(
    (state: GlobalState): Language => state.language.language
  );
  const validateLanguage = React.useCallback(
    ({
      languageState,
      setLanguageState,
      languageWindowOpen,
      setLanguageWindowOpen,
    }: ValidateLanguageOptions): void => {
      if (languageState === "default" || languageState === language) {
        alert(i18n.t("components\\navbar:modal.invalidLanguage"));
        return;
      }

      dispatch(changeLanguage(languageState));
      setLanguageState("default");
      setLanguageWindowOpen(!languageWindowOpen);
    },
    [dispatch, language]
  );

  return {
    language,
    validateLanguage,
  };
};

export default useLanguage;
