/*
 * Synchronize the theme to the styled-components variable.
 */

import React, { PropsWithChildren, ReactElement, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./themes.module.scss";

const ThemeProvider = ({
  children,
}: PropsWithChildren<unknown>): ReactElement => {
  const currentTheme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    const elem = document.querySelector("#root");
    if (elem)
      elem.className = `${styles[currentTheme]} ${styles.themeContainer} ${styles.wrapper}`;
  }, [currentTheme]);

  return <>{children}</>;
};

export default ThemeProvider;
