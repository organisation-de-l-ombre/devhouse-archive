import React, { FC } from "react";
import { BsArrowRight } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { NavLink, NavLinkProps } from "react-router-dom";
import { FlexContainer } from "@components/ui";
import globalStyles from "@styles/Global.module.scss";
import { ButtonComponent, FunctionComponent } from "@typings/FunctionComponent";
import styles from "./Sidebar.module.scss";

const Sidebar: FunctionComponent<
  HTMLDivElement,
  {
    open: boolean;
    manageSidebar: () => void;
    picture?: string;
    pictureCircle?: boolean;
    pictureAlt?: string;
    title: string;
  }
> = ({
  open,
  manageSidebar,
  className,
  picture,
  pictureCircle,
  pictureAlt,
  title,
  children,
}) => {
  return (
    <div
      className={[
        styles.sidebar,
        open && styles.open,
        className && className,
      ].join(" ")}
    >
      <button type="button" onClick={manageSidebar}>
        <MdClose />
      </button>
      <div className={styles.headers}>
        {picture && pictureAlt && (
          <img
            className={
              pictureCircle ? ` ${globalStyles["rounded-picture"]}` : ""
            }
            src={picture}
            alt={pictureAlt}
            draggable={false}
          />
        )}
        <h1>{title}</h1>
      </div>
      <div className={styles.items}>{children}</div>
    </div>
  );
};

const SidebarSection: FunctionComponent<HTMLDivElement> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={`${styles.section}${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
};

const SidebarItem: FC<NavLinkProps> = ({ className, ...props }) => {
  return (
    <NavLink
      className={`${styles["section-item"]}${className ? ` ${className}` : ""}`}
      activeClassName={styles.active}
      {...props}
    />
  );
};

const SidebarManager: ButtonComponent = ({ ...props }) => {
  return (
    <button
      type="button"
      aria-label="Open sidebar"
      className={styles.manager}
      {...props}
    >
      <BsArrowRight />
    </button>
  );
};

const SidebarContainer: FunctionComponent<
  HTMLDivElement,
  { open: boolean; manageSidebar: () => void }
> = ({ open, manageSidebar, wrap, children, ...props }) => {
  return (
    <FlexContainer
      expand
      column
      className={`${styles.container}${open ? ` ${styles.open}` : ""}`}
      onClick={(): void => {
        if (open) {
          manageSidebar();
        }
      }}
      {...props}
    >
      <SidebarManager onClick={manageSidebar} />
      {children}
    </FlexContainer>
  );
};

export {
  Sidebar,
  SidebarSection,
  SidebarItem,
  SidebarManager,
  SidebarContainer,
};
