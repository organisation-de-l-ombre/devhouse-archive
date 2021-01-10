import Backend from "i18next-http-backend";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { createContext } from "react";

const LanguageContext = createContext({
  language: "en",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changeLanguage: (language: string) => {},
});

i18n.use(Backend);
i18n.use(initReactI18next);
i18n.init({ fallbackLng: "en" });

export { LanguageContext, i18n };
export default i18n;
