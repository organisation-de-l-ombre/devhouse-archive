import React from "react";
import { FlexContainer } from "@components/ui";
import { BackToTop } from "@components/modules";
import { SidebarContainer, SidebarManager } from "@components/modules/Sidebar";
import { RouteComponentProps } from "react-router";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@hooks/Language";
import Sidebar from "./modules/InternalNavigation/InternalNavigation";
import styles from "./InternalRoot.module.scss";
import Router from "./modules/Router/Router";

const InternalRoot: React.FC<RouteComponentProps> = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const manageSidebar = React.useCallback((): void => {
    if (window.matchMedia("(max-width: 1100px)").matches) {
      setOpen(!open);
    }
  }, [open]);
  const { t } = useTranslation("pages\\wiki\\internal\\root");
  const { language } = useLanguage();

  React.useEffect((): (() => void) => {
    document.title = t("pageTitle");

    return (): void => {
      document.title = "IMR";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <FlexContainer className={styles["container-root"]}>
      <Sidebar open={open} manageSidebar={manageSidebar} />
      <BackToTop />
      <SidebarContainer open={open} manageSidebar={manageSidebar}>
        <SidebarManager onClick={manageSidebar} />
        <Router />
      </SidebarContainer>
    </FlexContainer>
  );
};

export default InternalRoot;
