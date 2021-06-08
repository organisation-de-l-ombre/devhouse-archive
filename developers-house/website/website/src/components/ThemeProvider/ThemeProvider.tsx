import React, { PropsWithChildren, ReactElement, useEffect } from "react";
import styles from "./themes.module.scss";
import { useTheme } from "../../state/slices/theme/hooks";

const ThemeProvider = ({
  children,
}: PropsWithChildren<unknown>): ReactElement => {
  const currentTheme = useTheme();

  useEffect(() => {
    const elem = document.querySelector("#root");
    if (elem)
      elem.className = `${styles[currentTheme]} ${styles.themeContainer} ${styles.wrapper}`;
  }, [currentTheme]);

  return <>{children}</>;
};

export default ThemeProvider;
