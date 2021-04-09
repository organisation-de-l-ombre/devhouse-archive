import { Theme } from "../../store/theme/Types";

export interface ThemeHook {
  theme: Theme;
  switchTheme: () => void;
}
