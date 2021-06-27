type Theme = "light" | "dark";

interface ThemePayload {
  type: string;
  payload: Theme | boolean;
}
interface ThemeState {
  theme: Theme;
  contrastMode: boolean;
}

const THEME_UPDATED = "theme/themeUpdated";
const THEME_CONTRAST_UPDATED = "theme/contrastUpdated";

export {
  Theme,
  ThemePayload,
  ThemeState,
  THEME_UPDATED,
  THEME_CONTRAST_UPDATED,
};
