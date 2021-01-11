import { createContext } from "react";

const detectBrowserColorTheme = (): string => {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
};
const ThemeContext = createContext({
  theme: detectBrowserColorTheme(),
  changeTheme: () => {},
});

export default ThemeContext;
export { detectBrowserColorTheme };
