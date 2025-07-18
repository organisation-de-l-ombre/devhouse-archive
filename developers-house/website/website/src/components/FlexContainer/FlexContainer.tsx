import React from "react";
import styles from "./FlexContainer.module.scss";

const FlexContainer: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
> = ({ className, children, ...props }) => {
  return (
    <div
      className={`${styles.container}${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default FlexContainer;
