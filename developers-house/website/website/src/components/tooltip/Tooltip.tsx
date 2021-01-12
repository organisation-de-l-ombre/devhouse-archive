import React, { FC, ReactNode } from "react";
import styles from "./tooltip.module.scss";

const Tooltip: FC<
  {
    tooltip: ReactNode;
    direction?: string;
  } & React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
> = ({ direction, tooltip, children, ...props }) => {
  return (
    <div className={styles.tooltipContainer} {...props}>
      <span className={[styles.tooltip, styles[direction || "top"]].join(" ")}>
        <span className={styles.hoverFix} />
        <span className={styles.padding}>{tooltip}</span>
      </span>
      {children}
    </div>
  );
};

export default Tooltip;
