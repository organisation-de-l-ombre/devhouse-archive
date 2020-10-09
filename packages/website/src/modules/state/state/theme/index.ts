const UpdateTheme = "THEME_UPDATED";
const ResetTheme = "THEME_RESET";

type Themes = string;

export interface ThemeState {
    theme: Themes;
}

type UpdateTheme = {
    type: typeof UpdateTheme;
    newTheme: Themes;
};

type ResetTheme = {
    type: typeof ResetTheme;
};

type PayloadTypes = UpdateTheme | ResetTheme;

export const defaultState: ThemeState = {
    theme: "light"
};

export default function reducer (
    state: ThemeState = defaultState,
    payload: PayloadTypes
): ThemeState {
    switch (payload.type) {
        case ResetTheme:
            state.theme = defaultState.theme;
            break;
        case UpdateTheme:
            state.theme = payload.newTheme;
            break;
    }
    return state;
}
