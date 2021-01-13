import React from "react";
import styles from "./ButtonsGroup.module.scss";

const ButtonsGroup: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
> = ({ children, ...props }) => {
  return (
    <div className={styles["buttons-group"]} {...props}>
      {children}
    </div>
  );
};

export default ButtonsGroup;
