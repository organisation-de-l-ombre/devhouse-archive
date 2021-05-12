import React from "react";
import styles from "./ButtonsGroup.module.scss";

const ButtonsGroup: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { minimal?: boolean; allowExpand?: boolean }
> = ({ className, minimal, allowExpand, ...props }) => {
  return (
    <div
      className={[
        styles["buttons-group"],
        minimal && styles.minimal,
        allowExpand && styles["allow-expand"],
        className && className,
      ].join(" ")}
      {...props}
    />
  );
};

export default ButtonsGroup;
