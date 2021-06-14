import React, { FC } from "react";
import { FlexContainer } from "@components/ui";
import { BackToTop, SidebarContainer, withNetwork } from "@components/modules";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import useSidebar from "@hooks/useSidebar";
import { RouteComponentProps } from "react-router";
import Sidebar from "./modules/InternalNavigation/InternalNavigation";
import Router from "./modules/Router/Router";

const InternalRoot: FC<RouteComponentProps> = () => {
  const { open, manageSidebar } = useSidebar();
  const { t } = useTranslation("pages\\wiki\\internal\\root");

  return (
    <FlexContainer maxHeight expand>
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

export default withNetwork(InternalRoot);
