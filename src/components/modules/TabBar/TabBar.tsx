import React from "react";
import { AiOutlineLink } from "react-icons/ai";
import styles from "./TabBar.module.scss";
import Button from "../../ui/Button/Button";

const TabBar: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { open: boolean; manageTabBar: () => void }
> = ({ className, children, open, manageTabBar }) => {
  return (
    <div
      className={`${styles["sections-container"]}${
        className ? ` ${className}` : ""
      }`}
    >
      <Button onClick={manageTabBar}>
        <AiOutlineLink />
        <span>Accéder à la navigation</span>
      </Button>
      <div
        className={`${styles["sections-items"]}${
          open ? ` ${styles.open}` : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default TabBar;
