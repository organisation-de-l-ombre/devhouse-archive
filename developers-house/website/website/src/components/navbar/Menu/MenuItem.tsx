/*
 * A simple menu item component for the Menu.
 */
import React from "react";
import styles from "./navigation.module.scss";
import { Ripple } from "../../ui/Button/Button";

export const NavigationItem: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, children, ...props }) => (
  <Ripple className={[className, styles.item].join(" ")} {...props}>
    {children}
  </Ripple>
);
