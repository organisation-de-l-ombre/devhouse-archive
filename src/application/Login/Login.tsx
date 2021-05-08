import React from "react";
import { manageAuth } from "@lib/manageAuthentication";
import { FlexContainer, GenericLoader } from "@components/ui";
import globalStyles from "@themes/Global.module.scss";
import { Trans, useTranslation } from "react-i18next";
import { useUser } from "@hooks/User";
import { useHistory } from "react-router";

const Login = (): React.ReactElement => {
  const { t } = useTranslation("pages\\login\\login");
  const { user } = useUser();
  const history = useHistory();

  React.useEffect((): void => {
    if (user) {
      history.push("/");
      return;
    }

    manageAuth();
  }, [history, user]);

  return (
    <FlexContainer
      className={`${globalStyles["alignment-full-center"]} ${globalStyles["secondary-padding"]}`}
    >
      <GenericLoader className={globalStyles["generic-loader"]}>
        <Trans t={t} i18nKey="message" />
      </GenericLoader>
    </FlexContainer>
  );
};

export default Login;
