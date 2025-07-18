import { createContext } from "react";

interface Theme {
  theme: "light" | "dark";
}
interface ThemeContextObject {
  theme: Theme;
  switchTheme: () => void;
}

const ThemeContext = createContext({
  theme: {
    theme: "light",
  },
  switchTheme: () => {},
});

export { ThemeContext };
export type { Theme, ThemeContextObject };
