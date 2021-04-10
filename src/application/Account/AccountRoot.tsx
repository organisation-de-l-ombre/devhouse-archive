import React from "react";
import { useHistory } from "react-router";
import { useUser } from "@hooks/User";
import FlexContainer from "@components/ui/FlexContainer/FlexContainer";
import BackToTop from "@components/modules/BackToTop/BackToTop";
import globalStyles from "@themes/Global.module.scss";
import AccountInternalNavigation from "./modules/AccountInternalNavigation/AccountInternalNavigation";
import AccountRouter from "./modules/Router/AccountRouter";
import AccountHeaders from "./modules/AccountHeaders/AccountHeaders";

const AccountRoot = (): React.ReactElement => {
  const { user } = useUser();
  const history = useHistory();

  React.useEffect(() => {
    if (!user) {
      history.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return user ? (
    <FlexContainer
      className={`${globalStyles.column} ${globalStyles["navbar-margin"]}`}
    >
      <AccountHeaders />
      <AccountInternalNavigation />
      <BackToTop />
      <AccountRouter />
    </FlexContainer>
  ) : (
    <></>
  );
};

export default AccountRoot;
