import React, { PropsWithChildren, ReactElement } from "react";
import { Helmet } from "react-helmet";
import styles from "./themes.module.scss";
import { useTheme } from "../../state/slices/theme/hooks";

const ThemeProvider = ({
  children,
}: PropsWithChildren<unknown>): ReactElement => {
  const currentTheme = useTheme();
  return (
    <>
      <Helmet>
        <body
          className={`${styles[currentTheme]} ${styles.themeContainer} ${styles.wrapper}`}
        />
      </Helmet>
      {children}
    </>
  );
};

export default ThemeProvider;
