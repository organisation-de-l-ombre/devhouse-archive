import { Theme, THEME_UPDATED, ThemePayload, ThemeState } from "./Types";

const detectBrowserColorTheme = (): Theme => {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
};
const themeState: ThemeState = { theme: detectBrowserColorTheme() };
const themeReducer = (
  state: ThemeState = themeState,
  { type, payload: theme }: ThemePayload
): ThemeState => {
  switch (type) {
    case THEME_UPDATED:
      return { ...state, theme };

    default:
      return state;
  }
};

export default themeReducer;
export { themeState };
