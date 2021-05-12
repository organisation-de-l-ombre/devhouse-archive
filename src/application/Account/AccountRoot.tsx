import React from "react";
import { useHistory } from "react-router";
import { useUser } from "@hooks/User";
import FlexContainer from "@components/ui/FlexContainer/FlexContainer";
import BackToTop from "@components/modules/BackToTop/BackToTop";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import containerStyle from "./Containers.module.scss";
import Sidebar from "./modules/InternalNavigation/InternalNavigation";
import Router from "./modules/Router/Router";
import { useSidebar } from "../../hooks/Sidebar";
import { SidebarContainer } from "../../components/modules/Sidebar";

const AccountRoot = (): React.ReactElement => {
  const { user } = useUser();
  const history = useHistory();
  const { open, manageSidebar } = useSidebar();
  const { t } = useTranslation("pages\\account\\root");

  React.useEffect(() => {
    if (!user) {
      history.push("/");
    }
  }, [history, user]);

  if (!user) {
    return <></>;
  }

  return (
    <FlexContainer className={containerStyle["container-root"]}>
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
