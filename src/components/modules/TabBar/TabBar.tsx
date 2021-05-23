import React, { FC } from "react";
import { AiOutlineLink } from "react-icons/ai";
import { Trans, useTranslation } from "react-i18next";
import { FunctionComponent } from "@typings/FunctionComponent";
import classnames from "classnames";
import { NavLink, NavLinkProps } from "react-router-dom";
import styles from "./TabBar.module.scss";
import { Button } from "../../ui";

const TabBar: FunctionComponent<
  HTMLDivElement,
  { open: boolean; manageTabBar: () => void }
> = ({ className, children, open, manageTabBar, ...props }) => {
  const { t } = useTranslation("components\\modules\\tabBar\\tabBar");

  return (
    <div className={classnames(styles.container, className)} {...props}>
      <Button onClick={manageTabBar}>
        <AiOutlineLink />
        <span>
          <Trans t={t} i18nKey="accessNavigation" />
        </span>
      </Button>
      <div className={classnames(styles.items, { [styles.open]: open })}>
        {children}
      </div>
    </div>
  );
};

const TabBarItem: FC<NavLinkProps> = ({
  className,
  activeClassName,
  ...props
}) => {
  return (
    <NavLink
      className={classnames(styles.item, className)}
      activeClassName={classnames(styles.active, activeClassName)}
      {...props}
    />
  );
};

export { TabBar, TabBarItem };
