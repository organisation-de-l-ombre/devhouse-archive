import React from "react";
import styles from "./Card.module.scss";

const Card: React.FC<
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

export default Card;
