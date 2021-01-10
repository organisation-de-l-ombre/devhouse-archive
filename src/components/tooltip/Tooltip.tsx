import React, { FC, ReactNode } from "react";
import styles from "./tooltip.module.scss";

const Tooltip: FC<{
  tooltip: ReactNode;
}> = ({ tooltip, children }) => {
  return (
    <div className={styles.tooltipContainer}>
      <span className={styles.tooltip}>
        <span className={styles.hoverFix} />
        <span className={styles.padding}>{tooltip}</span>
      </span>
      {children}
    </div>
  );
};

export default Tooltip;
