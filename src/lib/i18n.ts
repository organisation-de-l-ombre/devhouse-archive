import Backend from "i18next-http-backend";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { supportedLanguages } from "@store/language/types";

i18n.use(Backend);
i18n.use(initReactI18next);

i18n.languages = supportedLanguages;

i18n.init({ fallbackLng: "en" });

export default i18n;
