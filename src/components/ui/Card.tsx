import React from "react";
import styles from "./card.module.scss";
import { SimplifiedHTMLProps as SimplifiedHTMLProperties } from "./Button";

export const Card: React.FC<SimplifiedHTMLProperties<HTMLImageElement>> = ({
  className,
  ...properties
}) => <div className={[className, styles.card].join(" ")} {...properties} />;

export const CardPadding: React.FC<
  SimplifiedHTMLProperties<HTMLImageElement>
> = ({ className, ...properties }) => (
  <div className={[className, styles.padding].join(" ")} {...properties} />
);

export const CardHeader: React.FC<
  SimplifiedHTMLProperties<HTMLImageElement>
> = ({ className, ...properties }) => (
  <div className={[className, styles.header].join(" ")} {...properties} />
);

export const CardSection: React.FC<
  SimplifiedHTMLProperties<HTMLImageElement>
> = ({ className, ...properties }) => (
  <div className={[className, styles.section].join(" ")} {...properties} />
);

export const CardFlexContainer: React.FC<
  SimplifiedHTMLProperties<HTMLImageElement>
> = ({ className, ...properties }) => (
  <div className={[className, styles.container].join(" ")} {...properties} />
);
