/*
 * Component that handles the position of the Menu
 */

import React from "react";
import styles from "./navigation.module.scss";

export const DrawerContent: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className }) => <div className={[className, styles.drawer].join(" ")} />;
