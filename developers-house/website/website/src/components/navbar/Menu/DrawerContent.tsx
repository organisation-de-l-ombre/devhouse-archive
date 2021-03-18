/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/*
 * Component that handles the position of the Menu
 */

import React from "react";
import styles from "./navigation.module.scss";

export const DrawerContent: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, onClick, ...props }) => (
  <div className={[className, styles.drawer].join(" ")}>
    <div {...props} className={styles.content} />
    <span className={styles.backdrop} onClick={onClick} />
  </div>
);
