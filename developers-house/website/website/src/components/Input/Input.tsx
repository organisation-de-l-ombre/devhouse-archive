import React from "react";
import styles from "./input.module.scss";

export const Input: React.FC<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
> = ({ className, ...props }) => (
  <input className={[className, styles.input].join(" ")} {...props} />
);
