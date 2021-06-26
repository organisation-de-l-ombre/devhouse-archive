import React, { useEffect } from "react";
import manageAuth from "@lib/manageAuthentication";
import { useTranslation } from "react-i18next";
import useAccount from "@hooks/useAccount";
import { useHistory } from "react-router";
import { SuspenseComponent, withNetwork } from "@components/modules";
import { FunctionComponent } from "@typings/FunctionComponent";

const Login: FunctionComponent<HTMLDivElement> = () => {
  const { t } = useTranslation("pages\\login\\login");
  const { user } = useAccount();
  const history = useHistory();

  useEffect((): void => {
    if (user) {
      history.push("/");
      return;
    }

    manageAuth();
  }, [history, user]);

  return <SuspenseComponent customText={t("message")} />;
};

export default withNetwork(Login);
