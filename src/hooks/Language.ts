import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { Language } from "../store/language/Types";
import { GlobalState } from "../store/Types";
import i18n from "../languages/i18n";
import changeLanguage from "../store/language/Actions";

const useLanguage = (): {
  language: string;
  languageState: string;
  setLanguageState: React.Dispatch<React.SetStateAction<string>>;
  windowOpen: boolean;
  setWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
  validate: () => void;
} => {
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

export default useLanguage;
