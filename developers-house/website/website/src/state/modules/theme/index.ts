const UpdateTheme = "THEME_UPDATED";
const ResetTheme = "THEME_RESET";

type Themes = "light" | "dark";

export interface ThemeState {
  theme: Themes;
}

type TUpdateTheme = {
  type: typeof UpdateTheme;
  newTheme: Themes;
};

type TResetTheme = {
  type: typeof ResetTheme;
};

type PayloadTypes = TUpdateTheme | TResetTheme;

export const defaultState: ThemeState = {
  theme: "light",
};

export default function reducer(
  state: ThemeState = defaultState,
  payload: PayloadTypes
): ThemeState {
  switch (payload.type) {
    case ResetTheme:
      state = {
        ...state,
        theme: defaultState.theme,
      };
      break;
    case UpdateTheme:
      state = {
        ...state,
        theme: payload.newTheme,
      };
      break;
    default:
      return state;
  }
  return state;
}

export function updateTheme(newTheme: Themes): TUpdateTheme {
  return {
    type: UpdateTheme,
    newTheme,
  };
}

export function resetTheme(): TResetTheme {
  return {
    type: ResetTheme,
  };
}
