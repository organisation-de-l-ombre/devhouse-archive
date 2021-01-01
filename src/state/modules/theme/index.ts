const UpdateTheme = "THEME_UPDATED";
const ResetTheme = "THEME_RESET";

type Themes = 'light' | 'dark';

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
    theme: 'light',
};

export default function reducer(
    state: ThemeState = defaultState,
    payload: PayloadTypes
): ThemeState {
    switch (payload.type) {
        case ResetTheme:
            state = {
                ...state,
                theme: defaultState.theme
            };
            break;
        case UpdateTheme:
            state = {
                ...state,
                theme: payload.newTheme
            };
            break;
    }
    return state;
}

export function updateTheme(newTheme: Themes): UpdateTheme {
    return {
        type: UpdateTheme,
        newTheme,
    };
};

export function resetTheme(): ResetTheme {
    return {
        type: ResetTheme,
    };
}
