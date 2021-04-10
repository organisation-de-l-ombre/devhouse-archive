import React from "react";
import { AiOutlineLink } from "react-icons/ai";
import { Trans, useTranslation } from "react-i18next";
import styles from "./TabBar.module.scss";
import { Button } from "../../ui";

const TabBar: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { open: boolean; manageTabBar: () => void }
> = ({ className, children, open, manageTabBar, ...props }) => {
  const { t } = useTranslation("components\\modules\\tabBar\\tabBar");

  return (
    <div
      className={`${styles["navigation-container"]}${
        className ? ` ${className}` : ""
      }`}
      {...props}
    >
      <Button onClick={manageTabBar}>
        <AiOutlineLink />
        <span>
          <Trans t={t} i18nKey="accessNavigation" />
        </span>
      </Button>
      <div
        className={`${styles["navigation-items"]}${
          open ? ` ${styles.open}` : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default TabBar;
