import React from "react";
import styles from "./ButtonsGroup.module.scss";

const ButtonsGroup: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { minimal?: boolean; notifications?: boolean }
> = ({ className, minimal, ...props }) => {
  return (
    <div
      className={`${styles["buttons-group"]}${
        minimal ? ` ${styles.minimal}` : ""
      }${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
};

export default ButtonsGroup;
