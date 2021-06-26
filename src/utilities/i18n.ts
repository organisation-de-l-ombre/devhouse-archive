import i18n from "i18next";
import I18NextHttpBackend from "i18next-http-backend";
import { LanguageDetector } from "i18next-http-middleware";

if (typeof window === "undefined") {
  const pathLocales = "./build/public/locales/{{lng}}/{{ns}}.json";
  i18n
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    .use(require("i18next-fs-backend"))
    .use(LanguageDetector)
    .init({
      initImmediate: false,
      backend: {
        loadPath: pathLocales,
      },
      fallbackLng: "en",
      supportedLngs: ["en", "fr"],
      ns: ["layout"],
      preload: ["en", "fr"],
      react: {
        useSuspense: false,
      },
    });
} else {
  i18n.use(I18NextHttpBackend).init({
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;
