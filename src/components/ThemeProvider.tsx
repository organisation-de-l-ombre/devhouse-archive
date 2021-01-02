/*
 * Synchronize the theme to the styled-components variable.
 */

import React, { PropsWithChildren, ReactElement } from "react";
import { useSelector } from "react-redux";
import {
  createGlobalStyle,
  DefaultTheme,
  ThemeProvider as Theme,
} from "styled-components";
import styles from "./themes.module.scss";

declare module "styled-components" {
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
const themes: { [K: string]: DefaultTheme } = {
  light: {
    name: "white",
    foreground: {
      // The three base colors
      primary: "",
      secondary: "black",
      tertiary: "black",
      page: "black",
      hover: {
        primary: "",
        secondary: "rgb(35, 35, 35)",
        tertiary: "",
      },
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
        tertiary: "",
      },
    },
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
        tertiary: "",
      },
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
        tertiary: "",
      },
    },
  },
};

const GlobalTheme = createGlobalStyle`
  body {
    color: ${(props): string => props.theme.foreground.page};
    background: ${(props): string => props.theme.background.page};
  }
`;

const ThemeProvider = ({
  children,
}: PropsWithChildren<unknown>): ReactElement => {
  const currentTheme = useSelector((state) => state.theme.theme);
  return (
    <div className={styles[currentTheme]}>
      <Theme theme={themes[currentTheme]}>
        <GlobalTheme />
        {children}
      </Theme>
    </div>
  );
};

export default ThemeProvider;
