import { Theme } from "../../store/theme/Types";
import { Action } from "../../store/Types";

export interface ThemeHook {
  theme: Theme;
  switchTheme: () => Action;
}
