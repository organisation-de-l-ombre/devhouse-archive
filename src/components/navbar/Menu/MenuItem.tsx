/*
 * A simple menu item component for the Menu.
 */
import React from "react";
import styles from "./navigation.module.scss";

export const NavigationItem: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, ...properties }) => (
  <div className={[className, styles.item].join(" ")} {...properties} />
);
