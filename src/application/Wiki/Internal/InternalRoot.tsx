import React from "react";
import { FlexContainer } from "@components/ui";
import { BackToTop } from "@components/modules";
import { SidebarContainer } from "@components/modules/Sidebar";
import { RouteComponentProps } from "react-router";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useSidebar } from "@hooks/Sidebar";
import Sidebar from "./modules/InternalNavigation/InternalNavigation";
import styles from "./InternalRoot.module.scss";
import Router from "./modules/Router/Router";

const InternalRoot: React.FC<RouteComponentProps> = () => {
  const { open, manageSidebar } = useSidebar();
  const { t } = useTranslation("pages\\wiki\\internal\\root");

  return (
    <FlexContainer className={styles["container-root"]}>
      <Helmet>
        <title>{t("pageTitle")}</title>
      </Helmet>
      <Sidebar open={open} manageSidebar={manageSidebar} />
      <BackToTop />
      <SidebarContainer open={open} manageSidebar={manageSidebar}>
        <Router />
      </SidebarContainer>
    </FlexContainer>
  );
};

export default InternalRoot;
