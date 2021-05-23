type Theme = "light" | "dark";

interface ThemePayload {
  type: string;
  payload: Theme;
}
interface ThemeState {
  theme: Theme;
}

const THEME_UPDATED = "theme/themeUpdated";

export { Theme, ThemePayload, ThemeState, THEME_UPDATED };
