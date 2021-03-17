import React from "react";
import { useHistory } from "react-router";
import FlexContainer from "../../components/ui/FlexContainer/FlexContainer";
import flexContainerStyles from "../../components/ui/FlexContainer/FlexContainer.module.scss";
import globalStyles from "../../themes/Global.module.scss";
import useUser from "../../hooks/User";
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
  });

  return user ? (
    <FlexContainer
      className={`${flexContainerStyles.container} ${globalStyles.column} ${globalStyles["navbar-margin"]}`}
    >
      <AccountHeaders />
      <AccountInternalNavigation />
      <AccountRouter />
    </FlexContainer>
  ) : (
    <></>
  );
};

export default AccountRoot;
