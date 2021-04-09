import { useDispatch, useSelector } from "react-redux";
import React from "react";
import generateNotificationID from "@lib/generateNotificationID";
import { useNotificationsManager } from "@hooks/Notifications";
import { useTranslation } from "react-i18next";
import { Language } from "../../store/language/Types";
import { GlobalState } from "../../store/Types";
import i18n from "../../languages/i18n";
import changeLanguage from "../../store/language/Actions";
import { LanguageHook } from "./Types";

const useLanguage = (): LanguageHook => {
  const dispatch = useDispatch();
  const language: string = useSelector(
    (state: GlobalState): Language => state.language.language
  );
  const { addNotifications } = useNotificationsManager();
  const [languageState, setLanguageState] = React.useState<string>("default");
  const { t } = useTranslation("components\\navbar");

  const validateLanguage = React.useCallback(
    async (
      setLanguageWindowOpen?: React.Dispatch<React.SetStateAction<boolean>>
    ): Promise<void> => {
      if (languageState === "default" || languageState === language) {
        alert(t("modal.invalidLanguage"));
        return;
      }

      dispatch(changeLanguage(languageState));
      await i18n.changeLanguage(languageState);
      setLanguageState("default");

      if (setLanguageWindowOpen) {
        setLanguageWindowOpen(false);
      }

      const newLanguage = await import(
        `../../../public/locales/${languageState}/components/navbar.json`
      );

      addNotifications([
        {
          id: generateNotificationID(),
          type: "info",
          body: newLanguage.modal.languageChanged,
          time: 5000,
        },
      ]);
    },
    [addNotifications, dispatch, language, languageState, t]
  );

  return {
    language,
    setLanguageState,
    validateLanguage,
  };
};

export default useLanguage;
