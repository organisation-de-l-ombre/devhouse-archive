/*
 * A simple menu item component for the Menu.
 */
import React from "react";
import styles from "./navigation.module.scss";

export const OnlyMobiles: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, ...props }) => (
  <div className={[className, styles.onlyMobiles].join(" ")} {...props} />
);

export const ExceptMobile: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, ...props }) => (
  <div className={[className, styles.exceptMobile].join(" ")} {...props} />
);

export default OnlyMobiles;
