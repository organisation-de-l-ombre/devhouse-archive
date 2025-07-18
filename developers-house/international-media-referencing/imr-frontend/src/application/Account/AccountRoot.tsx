import React from "react";
import FlexContainer from "@components/ui/FlexContainer/FlexContainer";
import BackToTop from "@components/modules/BackToTop/BackToTop";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import useSidebar from "@hooks/useSidebar";
import { SidebarContainer, withAccount } from "@components/modules";
import { FunctionComponent } from "@typings/FunctionComponent";
import Sidebar from "./modules/InternalNavigation/InternalNavigation";
import Router from "./modules/Router/Router";

const AccountRoot: FunctionComponent<HTMLDivElement> = () => {
  const { open, manageSidebar } = useSidebar();
  const { t } = useTranslation("pages\\account\\account");

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

export default withAccount(AccountRoot);
