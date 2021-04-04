import React, { FC, ReactNode } from "react";
import styles from "./tooltip.module.scss";
import { GlobalStyles } from "../../styles";

const Tooltip: FC<
  {
    tooltip: ReactNode;
    direction?: string;
    showMobile?: boolean;
  } & React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
> = ({ showMobile, direction, className, tooltip, children, ...props }) => {
  return (
    <div className={[styles.tooltipContainer, className].join(" ")} {...props}>
      <span
        className={[
          styles.tooltip,
          styles[direction || "top"],
          !showMobile && GlobalStyles.exceptMobile,
        ].join(" ")}
      >
        <span className={styles.hoverFix} />
        <span className={styles.padding}>{tooltip}</span>
      </span>
      {children}
    </div>
  );
};

export default Tooltip;
