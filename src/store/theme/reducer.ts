import {
  Theme,
  THEME_UPDATED,
  ThemePayload,
  ThemeState,
  THEME_CONTRAST_UPDATED,
} from "./types";

const detectBrowserColorTheme = (): Theme => {
  if (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
};

const themeState: ThemeState = {
  theme: detectBrowserColorTheme(),
  contrastMode: false,
};

const ThemeReducer = (
  state: ThemeState = themeState,
  { type, payload }: ThemePayload
): ThemeState => {
  switch (type) {
    case THEME_UPDATED:
      return { ...state, theme: payload as Theme };

    case THEME_CONTRAST_UPDATED:
      return { ...state, contrastMode: payload as boolean };

    default:
      return state;
  }
};

export { themeState, ThemeReducer };
