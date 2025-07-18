import React, { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";
import styles from "./ButtonContainer.module.scss";

export const ButtonContainer: FC<
  DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & { horizontal?: boolean }
> = ({ className, children, horizontal }) => {
  return (
    <div
      className={`${styles.container}${
        horizontal ? ` ${styles.horizontal}` : ""
      }${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
};
