import React from "react";
import { SimplifiedHTMLProperties } from "./Button";
import styles from "./button.module.scss";

const ButtonGroup: React.FC<SimplifiedHTMLProperties<HTMLImageElement>> = ({
  className,
  ...props
}) => <div className={[className, styles.group].join(" ")} {...props} />;

export default ButtonGroup;
