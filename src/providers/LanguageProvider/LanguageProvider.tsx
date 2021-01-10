import React from "react";
import { i18n, LanguageContext } from "../../languages/i18n";

const LanguageProvider: React.FC = ({ children }) => {
  const [language, setLanguage] = React.useState(
    window.localStorage.getItem("language") ?? "en"
  );
  const changeLanguage = React.useCallback((newLanguage) => {
    setLanguage(newLanguage);
  }, []);

  React.useEffect(() => {
    i18n.changeLanguage(language).then(() => {
      localStorage.setItem("language", language);
    });
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
