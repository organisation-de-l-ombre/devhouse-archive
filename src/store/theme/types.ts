type Theme = "light" | "dark";

interface ThemePayload {
  type: string;
  payload: Theme | boolean;
}
interface ThemeState {
  theme: Theme;
  contrastMode: boolean;
}

export { Theme, ThemePayload, ThemeState };
