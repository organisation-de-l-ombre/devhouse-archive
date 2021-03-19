import React from "react";
import styles from "./DetailledText.module.scss";

const DetailledText: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { title?: string; text?: string | string[] }
> = ({ className, children, title, text, ...props }) => {
  return (
    <div
      className={`${styles.container}${className ? ` ${className}` : ""}`}
      {...props}
    >
      {/* eslint-disable-next-line no-nested-ternary */}
      {title && text ? (
        typeof text === "string" ? (
          <>
            <h1>{title}</h1>
            <p>{text}</p>
          </>
        ) : (
          <>
            <h1>{title}</h1>
            {text.map(
              (t: string): React.ReactElement => {
                return <p key={t}>{t}</p>;
              }
            )}
          </>
        )
      ) : (
        children
      )}
    </div>
  );
};

export default DetailledText;
