import React, { useEffect } from "react";
import manageAuth from "@lib/manageAuthentication";
import { useTranslation } from "react-i18next";
import useAccount from "@hooks/useAccount";
import { useHistory } from "react-router";
import { SuspenseComponent, withNetwork } from "@components/modules";
import { FunctionComponent } from "@typings/FunctionComponent";
import { useClient } from "@hooks/useInternal";

const Login: FunctionComponent<HTMLDivElement> = () => {
  const { t } = useTranslation("root");
  const { user } = useAccount();
  const { clientId } = useClient();
  const history = useHistory();

  useEffect((): void => {
    if (user) {
      history.push("/");
      return;
    }

    manageAuth(clientId);
  }, [history, user, clientId]);

  return <SuspenseComponent customText={t("utils.redirecting")} />;
};

export default withNetwork(Login);
