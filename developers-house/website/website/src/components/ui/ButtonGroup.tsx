import React from "react";
import { SimplifiedHTMLProps as SimplifiedHTMLProperties } from "./Button";
import styles from "./button.module.scss";

type ButtonGroupProperties = {
  borderRadius?: string;
  buttonPadding?: string;
  direction?: string;
};

const ButtonGroup: React.FC<SimplifiedHTMLProperties<HTMLImageElement>> = ({
  className,
  ...properties
}) => <div className={[className, styles.group].join(" ")} {...properties} />;

export default ButtonGroup;
