/*
 * Component that handles the position of the Menu
 */

import React from "react";
import styles from "./navigation.module.scss";

export const NavigationContainer: React.FC<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { open: boolean }
> = ({ className, open, ...props }) => (
  <div
    className={[
      styles.container,
      open ? styles.open : "",
      className ?? "",
    ].join(" ")}
    {...props}
  />
);
