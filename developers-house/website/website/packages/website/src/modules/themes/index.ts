import { ThemedStyledProps } from "styled-components";

export type ThemeType = {
    name: string;
    foreground: {
        // The three base colors
        primary: string;
        secondary: string;
        tertiary: string;
        page: string;
        hover: {
            primary: string;
            secondary: string;
            tertiary: string;
        };
    };
    background: {
        // The three base background colors.
        primary: string;
        secondary: string;
        tertiary: string;

        page: string;

        hover: {
            primary: string;
            secondary: string;
            tertiary: string;
        };
    };
};

interface ObjectList<V> {
    [key: string]: V;
}

const themes: ObjectList<() => ThemeType> = {
    night: () => require("./night").default,
    light: () => require("./light").default
};

export function getThemeOrDefault (theme: string): ThemeType {
    return (themes[theme] || themes[0])();
}

export type CustomThemedStyledProps<A = {}> = ThemedStyledProps<A, ThemeType>;
