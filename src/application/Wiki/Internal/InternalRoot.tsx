import React from "react";
import { FlexContainer } from "@components/ui";
import { BackToTop } from "@components/modules";
import globalStyles from "@themes/Global.module.scss";
import { SidebarManager } from "@components/modules/Sidebar";
import Sidebar from "./modules/InternalNavigation/InternalNavigation";
import styles from "./InternalRoot.module.scss";
import Router from "./modules/Router/Router";

const InternalRoot = (): React.ReactElement => {
  const [open, setOpen] = React.useState<boolean>(false);
  const manageSidebar = React.useCallback((): void => {
    if (window.matchMedia("(max-width: 1100px)").matches) {
      setOpen(!open);
    }
  }, [open]);

  return (
    <FlexContainer
      className={`${styles["container-root"]} ${globalStyles["navbar-margin"]}`}
    >
      <Sidebar open={open} manageSidebar={manageSidebar} />
      <BackToTop />
      <FlexContainer
        className={`${styles["container-main"]}${
          open ? ` ${styles["sidebar-open"]}` : ""
        }`}
        onClick={(): void => {
          if (open) {
            manageSidebar();
          }
        }}
      >
        <SidebarManager onClick={manageSidebar} />
        <Router />
      </FlexContainer>
    </FlexContainer>
  );
};

export default InternalRoot;
