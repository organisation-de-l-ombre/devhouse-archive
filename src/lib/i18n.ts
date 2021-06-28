import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import { LanguageDetector } from "i18next-http-middleware";
import { supportedLanguages } from "@store/language/types";

if (process && !process.release) {
  i18n.use(Backend).use(initReactI18next).use(LanguageDetector);
}

if (!i18n.isInitialized) {
  i18n.init({
    debug: false,
    initImmediate: false,
    fallbackLng: "en",
    supportedLngs: supportedLanguages,
    load: "languageOnly",
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;
