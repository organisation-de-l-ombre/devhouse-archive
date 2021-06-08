/* eslint-disable prettier/prettier */
import React from "react";
import styles from "./card.module.scss";
import { SimplifiedHTMLProperties } from "../Button/Button";

export const Card: React.FC<SimplifiedHTMLProperties<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={[className, styles.card].join(" ")} {...props} />;

export const CardPadding: React.FC<SimplifiedHTMLProperties<HTMLDivElement>> =
  ({ className, ...props }) => (
    <div className={[className, styles.padding].join(" ")} {...props} />
  );

export const CardHeader: React.FC<SimplifiedHTMLProperties<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={[className, styles.header].join(" ")} {...props} />;

export const CardSection: React.FC<SimplifiedHTMLProperties<HTMLDivElement>> =
  ({ className, ...props }) => (
    <div className={[className, styles.section].join(" ")} {...props} />
  );

export const CardFlexContainer: React.FC<
  SimplifiedHTMLProperties<HTMLDivElement>
> = ({ className, ...props }) => (
  <div className={[className, styles.container].join(" ")} {...props} />
);
