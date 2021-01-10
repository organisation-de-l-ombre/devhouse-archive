import { createContext } from "react";

const ThemeContext = createContext({
  theme: "light",
  changeTheme: () => {},
});

export default ThemeContext;
