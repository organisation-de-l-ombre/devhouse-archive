import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { Language } from "../../store/language/Types";
import { GlobalState } from "../../store/Types";
import i18n from "../../languages/i18n";
import changeLanguage from "../../store/language/Actions";
import { useNotificationsManager } from "../Notifications/Notifications";
import generateNotificationID from "../../utilities/generateNotificationID";
import { LanguageHook } from "./Types";

const useLanguage = (): LanguageHook => {
  const dispatch = useDispatch();
  const language: string = useSelector(
    (state: GlobalState): Language => state.language.language
  );
  const { addNotifications } = useNotificationsManager();
  const [languageState, setLanguageState] = React.useState<string>("default");
  const validateLanguage = async (
    setLanguageWindowOpen: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<void> => {
    if (languageState === "default" || languageState === language) {
      alert(i18n.t("components\\navbar:modal.invalidLanguage"));
      return;
    }

    dispatch(changeLanguage(languageState));
    i18n.changeLanguage(languageState);
    setLanguageState("default");
    setLanguageWindowOpen(false);

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
  };

  return {
    language,
    setLanguageState,
    validateLanguage,
  };
};

export default useLanguage;
