import React from "react";
import styles from "./ButtonsGroup.module.scss";

const ButtonsGroup: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { notifications?: boolean }
> = ({ className, children, notifications, ...props }) => {
  return (
    <div
      className={`${styles["buttons-group"]}${
        notifications ? ` ${styles.notifications}` : ""
      }${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default ButtonsGroup;
