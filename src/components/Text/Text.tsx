import React from "react";
import styles from "./text.module.scss";

export const Text: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >
> = ({ className, children }) => {
  return <p className={[className, styles.text].join(" ")}>{children}</p>;
};

export default Text;
