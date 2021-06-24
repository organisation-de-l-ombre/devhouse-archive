import i18n from "i18next";
import I18NextHttpBackend from "i18next-http-backend";

i18n.use(I18NextHttpBackend).init({
  lng: "en",
  backend: {
    allowMultiLoading: true,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
