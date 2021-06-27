import i18n from "i18next";
import { supportedLanguages } from "@store/language/types";
import ClientBackend from "i18next-http-backend";
import ServerBackend from "i18next-fs-backend";
import { LanguageDetector } from "i18next-http-middleware";

if (typeof window !== "undefined") {
  i18n.use(ClientBackend).init({
    initImmediate: false,
    fallbackLng: "en",
    supportedLngs: supportedLanguages,
    react: {
      useSuspense: false,
    },
  });
} else {
  i18n
    .use(ServerBackend)
    .use(LanguageDetector)
    .init({
      initImmediate: false,
      fallbackLng: "en",
      supportedLngs: supportedLanguages,
      backend: {
        loadPath: "./build/public/locales/{{lng}}/{{ns}}.json",
      },
      react: {
        useSuspense: false,
      },
    });
}

export default i18n;
