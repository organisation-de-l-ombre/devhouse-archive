import React from "react";
import styles from "./TextArea.module.scss";

const TextArea: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
> = ({ className, children, ...props }) => {
  return (
    <div
      className={`${styles["text-area"]}${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default TextArea;
