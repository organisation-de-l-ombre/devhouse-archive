import React from "react";
import styles from "./Presentation.module.scss";

const PresentationWrapper: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { reversed?: boolean }
> = ({ className, reversed, ...props }) => {
  return (
    <div
      className={`${styles.root}${
        reversed ? ` ${styles["invert-background"]}` : ""
      }`}
    >
      <div
        className={`${styles.wrapper}${reversed ? ` ${styles.reversed}` : ""}${
          className ? ` ${className}` : ""
        }`}
        {...props}
      />
    </div>
  );
};

const PresentationSection: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { type: "text" | "picture" }
> = ({ className, type, ...props }) => {
  return (
    <div
      className={`${styles.section} ${styles[type]}${
        className ? ` ${className}` : ""
      }`}
      {...props}
    />
  );
};

export { PresentationWrapper, PresentationSection };
