/*
 * Synchronize the theme to the styled-components variable.
 */

import React, {PropsWithChildren, ReactElement} from "react";
import {useSelector} from "react-redux";
import {createGlobalStyle, DefaultTheme, ThemeProvider as Theme} from 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
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
    }
}
;


const themes: { [K: string]: DefaultTheme } = {
    light: {
        name: "white",
        foreground: {
            // The three base colors
            primary: "black",
            secondary: "black",
            tertiary: "black",
            page: "black",
            hover: {
                primary: "rgb(35, 35, 35)",
                secondary: "rgb(35, 35, 35)",
                tertiary: ""
            }
        },
        background: {
            // The three base background colors.
            primary: "#cecece",
            secondary: "#dedede",
            tertiary: "",

            page: "rgb(215, 215, 215)",

            hover: {
                primary: "#bdbdbd",
                secondary: "#cacaca",
                tertiary: ""
            }
        }
    },
    dark: {
        name: "dark",
        foreground: {
            // The three base colors
            primary: "white",
            secondary: "white",
            tertiary: "white",
            page: "white",
            hover: {
                primary: "rgb(220, 220, 220)",
                secondary: "rgb(220, 220, 220)",
                tertiary: ""
            }
        },
        background: {
            // The three base background colors.
            primary: "#313131",
            secondary: "#353535",
            tertiary: "",

            page: "rgb(40, 40, 40)",

            hover: {
                primary: "#424242",
                secondary: "#404040",
                tertiary: ""
            }
        }
    }
};

const GlobalTheme = createGlobalStyle`
  body {
    color: ${(props): string =>
    props.theme.foreground.page};
    background: ${(props): string =>
    props.theme.background.page};
  }

  a {
    color: ${(props): string =>
    props.theme.foreground.page};
  }
`;

const ThemeProvider = (props: PropsWithChildren<{}>): ReactElement => {
    const currentTheme = useSelector((state) => state.theme.theme);
    return (
        <Theme theme={themes[currentTheme]}>
            <GlobalTheme/>
            {props.children}
        </Theme>
    )
};

export default ThemeProvider;
