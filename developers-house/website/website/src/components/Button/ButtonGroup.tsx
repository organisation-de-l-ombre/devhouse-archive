import React from "react";
import { SimplifiedHTMLProperties } from "./Button";
import styles from "./button.module.scss";

const ButtonGroup: React.FC<
  SimplifiedHTMLProperties<HTMLDivElement> & { full?: boolean }
> = ({ className, full, ...props }) => (
  <div
    className={[className, styles.group, full && styles.full].join(" ")}
    {...props}
  />
);

export default ButtonGroup;
