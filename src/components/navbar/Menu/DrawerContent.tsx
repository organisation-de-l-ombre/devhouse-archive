/*
 * Component that handles the position of the Menu
 */

import styles from "./navigation.module.scss";
import React from "react";

export const DrawerContent: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, ...properties }) => (
  <div className={[className, styles.drawer].join(" ")} {...properties} />
);
