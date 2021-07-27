import { ApplicationReducer } from "@store/types";
import { THEME_CONTRAST_UPDATED, THEME_UPDATED } from "./actions";
import { ThemeState } from "./types";

const defaultThemeState: ThemeState = {
  theme: "light",
  contrastMode: false,
};

const ThemeReducer: ApplicationReducer<"theme"> = (
  state: ThemeState = defaultThemeState,
  payload
): ThemeState => {
  switch (payload.type) {
    case THEME_UPDATED:
      return { ...state, theme: payload.payload };

    case THEME_CONTRAST_UPDATED:
      return { ...state, contrastMode: payload.payload };

    default:
      return state;
  }
};

export default ThemeReducer;
