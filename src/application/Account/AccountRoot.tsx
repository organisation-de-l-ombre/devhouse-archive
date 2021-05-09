import React from "react";
import { useHistory } from "react-router";
import { useUser } from "@hooks/User";
import FlexContainer from "@components/ui/FlexContainer/FlexContainer";
import BackToTop from "@components/modules/BackToTop/BackToTop";
import globalStyles from "@themes/Global.module.scss";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import AccountInternalNavigation from "./modules/AccountInternalNavigation/AccountInternalNavigation";
import AccountRouter from "./modules/Router/AccountRouter";
import AccountHeaders from "./modules/AccountHeaders/AccountHeaders";

const AccountRoot = (): React.ReactElement => {
  const { user } = useUser();
  const history = useHistory();
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
    <FlexContainer className={globalStyles.column}>
      <Helmet>
        <title>{t("pageTitle")}</title>
      </Helmet>
      <AccountHeaders />
      <AccountInternalNavigation />
      <BackToTop />
      <AccountRouter />
    </FlexContainer>
  );
};

export default AccountRoot;
