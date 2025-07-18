import { ApplicationAction } from "@store/types";
import { Theme } from "./types";

const THEME_UPDATED = "theme/themeUpdated";
const THEME_CONTRAST_UPDATED = "theme/contrastUpdated";

const updateTheme: ApplicationAction<"theme/themeUpdated", [Theme]> = (
  theme: Theme
) => {
  return { type: THEME_UPDATED, payload: theme };
};

const updateContrastMode: ApplicationAction<
  "theme/contrastUpdated",
  [boolean]
> = (contrast: boolean) => {
  return { type: THEME_CONTRAST_UPDATED, payload: contrast };
};

export {
  updateTheme,
  updateContrastMode,
  THEME_UPDATED,
  THEME_CONTRAST_UPDATED,
};
export interface ThemeActionTypes {
  [THEME_UPDATED]: Theme;
  [THEME_CONTRAST_UPDATED]: boolean;
}
