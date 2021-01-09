import React from "react";
import styles from "./Button.module.scss";

export const Button: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ children, className, ...props }) => {
  // eslint-disable-next-line react/button-has-type
  return (
    <button
      type="button"
      className={`${styles["button-styles"]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
