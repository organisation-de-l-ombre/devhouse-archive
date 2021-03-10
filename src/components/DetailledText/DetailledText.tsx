import React from "react";
import styles from "./DetailledText.module.scss";

const DetailledText: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
> = ({ className, children }) => {
  return (
    <div className={`${styles.container}${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
};

export default DetailledText;
