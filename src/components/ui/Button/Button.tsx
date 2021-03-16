import React from "react";
import styles from "./Button.module.scss";

const Button: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ children, className, ...props }) => {
  return (
    <button
      type="button"
      className={`${styles["button-styles"]}${
        className ? ` ${className}` : ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
