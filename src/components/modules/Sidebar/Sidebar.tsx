import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { FlexContainer } from "@components/ui";
import styles from "./Sidebar.module.scss";

const Sidebar: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    open: boolean;
    manageSidebar: () => void;
    picture?: string;
    pictureAlt?: string;
    title: string;
  }
> = ({
  open,
  manageSidebar,
  className,
  picture,
  pictureAlt,
  title,
  children,
}): React.ReactElement => {
  return (
    <div
      className={`${styles.sidebar}${open ? ` ${styles.open}` : ""}${
        className ? ` ${className}` : ""
      }`}
    >
      <button type="button" onClick={manageSidebar}>
        <MdClose />
      </button>
      <div className={styles.headers}>
        {picture && pictureAlt && (
          <img src={picture} alt={pictureAlt} draggable={false} />
        )}
        <h2>{title}</h2>
      </div>
      <div className={styles.items}>{children}</div>
    </div>
  );
};
const SidebarSection: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
> = ({ className, children }) => {
  return (
    <div className={`${styles.section}${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
};
const SidebarItem: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { to: string }
> = ({ className, to, children }) => {
  return (
    <NavLink
      to={to}
      className={`${styles["section-item"]}${className ? ` ${className}` : ""}`}
      activeClassName={styles.active}
      exact
    >
      {children}
    </NavLink>
  );
};
const SidebarManager: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ ...props }) => {
  return (
    <button type="button" className={styles.manager} {...props}>
      <BsArrowRight />
    </button>
  );
};
const SidebarContainer: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { open: boolean; manageSidebar: () => void }
> = ({ open, manageSidebar, ...props }) => {
  return (
    <FlexContainer
      className={`${styles.container}${open ? ` ${styles.open}` : ""}`}
      onClick={(): void => {
        if (open) {
          manageSidebar();
        }
      }}
      {...props}
    />
  );
};

export {
  Sidebar,
  SidebarSection,
  SidebarItem,
  SidebarManager,
  SidebarContainer,
};
