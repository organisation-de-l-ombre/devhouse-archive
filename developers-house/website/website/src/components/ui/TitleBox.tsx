import React from "react";
import { SimplifiedHTMLProperties } from "./Button";
import styles from "./title.module.scss";

const TitleBox: React.FC<SimplifiedHTMLProperties<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={[className, styles.title].join(" ")} {...props} />;

export { TitleBox };
