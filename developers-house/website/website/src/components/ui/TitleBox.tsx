import React from "react";
import { SimplifiedHTMLProps as SimplifiedHTMLProperties } from "./Button";
import styles from "./title.module.scss";

const TitleBox: React.FC<SimplifiedHTMLProperties<HTMLDivElement>> = ({
  className,
  ...properties
}) => <div className={[className, styles.title].join(" ")} {...properties} />;

export { TitleBox };
