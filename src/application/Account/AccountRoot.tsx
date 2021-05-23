import React from "react";
import { useHistory } from "react-router";
import useAccount from "@hooks/useAccount";
import FlexContainer from "@components/ui/FlexContainer/FlexContainer";
import BackToTop from "@components/modules/BackToTop/BackToTop";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import useSidebar from "@hooks/useSidebar";
import { SidebarContainer } from "@components/modules/Sidebar";
import { FunctionComponent } from "@typings/FunctionComponent";
import Sidebar from "./modules/InternalNavigation/InternalNavigation";
import Router from "./modules/Router/Router";

const AccountRoot: FunctionComponent<HTMLDivElement> = () => {
  const { user } = useAccount();
  const history = useHistory();
  const { open, manageSidebar } = useSidebar();
  const { t } = useTranslation("pages\\account\\root");

  React.useEffect(() => {
    if (!user) {
      history.push("/");
    }
  }, [history, user]);

  if (!user) {
    return null;
  }

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

export default AccountRoot;
