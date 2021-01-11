import React from "react";
import themes from "../../themes/Themes.module.scss";
import ThemeContext, {
  detectBrowserColorTheme,
} from "../../themes/ThemeContext";

const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = React.useState(
    window.localStorage.getItem("theme") ?? detectBrowserColorTheme()
  );
  const changeTheme = React.useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme]);

  React.useEffect(() => {
    localStorage.setItem("theme", theme);

    const app = document.querySelector("#app");

    if (app) {
      app.className = themes[theme];
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
