import { useDispatch, useSelector } from "react-redux";
import { useCallback, useState, Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { Language } from "@store/language";
import { GlobalState } from "@store/Types";
import i18n from "@languages/i18n";
import changeLanguage from "@store/language/Actions";

interface LanguageHook {
  language: string;
  setLanguageState: Dispatch<SetStateAction<string>>;
  validateLanguage: (
    setLanguageWindowOpen?: Dispatch<SetStateAction<boolean>>
  ) => Promise<void>;
}

const useLanguage = (): LanguageHook => {
  const dispatch = useDispatch();
  const language: string = useSelector(
    (state: GlobalState): Language => state.language.language
  );
  const [languageState, setLanguageState] = useState<string>("default");
  const { t } = useTranslation("components\\ui\\languageModal\\languageModal");

  const validateLanguage = useCallback(
    async (
      setLanguageWindowOpen?: Dispatch<SetStateAction<boolean>>
    ): Promise<void> => {
      if (languageState === "default" || languageState === language) {
        alert(t("invalidLanguage"));
        return;
      }

      dispatch(changeLanguage(languageState));
      await i18n.changeLanguage(languageState);
      setLanguageState("default");

      if (setLanguageWindowOpen) {
        setLanguageWindowOpen(false);
      }
    },
    [dispatch, language, languageState, t]
  );

  return {
    language,
    setLanguageState,
    validateLanguage,
  };
};

export default useLanguage;
